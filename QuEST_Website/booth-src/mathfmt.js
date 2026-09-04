/* A small TeX renderer for the booth's "Show the maths" panels.
 *
 * Emits native MathML.  The first version of this file built fractions and
 * radicals out of styled <span>s, which fell apart the moment anything nested:
 * baselines drifted, radical bars did not span their bodies, and sum limits
 * landed beside the sigma instead of above and below it.  Browsers already
 * contain a maths layout engine, so the fix is to stop reimplementing one --
 * MathML Core is supported everywhere current, needs no network, and picks up
 * a real maths font.
 *
 * Supported: \frac \sqrt (with index) ^ _ \ket \bra \braket \ketbra, Greek,
 * relations and operators, \sum \prod \int with proper under/over limits,
 * \text \mathrm \mathbf \operatorname, \left \right, accents, spacing,
 * \begin{aligned} for derivations, and pmatrix/bmatrix/vmatrix.
 *
 * Unknown commands render visibly as \command rather than vanishing, so a typo
 * is caught by eye and by verify/test_mathfmt.py instead of shipping a blank
 * equation to the booth.
 */
(function (global) {
  "use strict";

  var GREEK_LOWER = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε",
    varepsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", vartheta: "ϑ",
    iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ",
    pi: "π", rho: "ρ", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ",
    varphi: "ϕ", chi: "χ", psi: "ψ", omega: "ω"
  };

  var GREEK_UPPER = {
    Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π",
    Sigma: "Σ", Upsilon: "Υ", Phi: "Φ", Psi: "Ψ", Omega: "Ω"
  };

  var RELATIONS = {
    cdot: "⋅", times: "×", pm: "±", mp: "∓", approx: "≈", simeq: "≃",
    neq: "≠", ne: "≠", leq: "≤", le: "≤", geq: "≥", ge: "≥", equiv: "≡",
    sim: "∼", propto: "∝", to: "→", rightarrow: "→", longrightarrow: "⟶",
    Rightarrow: "⇒", Longrightarrow: "⟹", mapsto: "↦", otimes: "⊗",
    oplus: "⊕", in: "∈", notin: "∉", subset: "⊂", geqslant: "⩾",
    leqslant: "⩽", ll: "≪", gg: "≫", cong: "≅", asymp: "≍", perp: "⊥",
    parallel: "∥"
  };

  var SYMBOLS = {
    infty: "∞", partial: "∂", nabla: "∇", hbar: "ℏ", dagger: "†",
    ast: "∗", star: "⋆", circ: "∘", ldots: "…", cdots: "⋯", vdots: "⋮",
    ddots: "⋱", prime: "′", deg: "°", ell: "ℓ", Re: "ℜ", Im: "ℑ",
    forall: "∀", exists: "∃", emptyset: "∅", angle: "∠", hslash: "ℏ"
  };

  /* Big operators take limits above and below, not beside. */
  var BIG_OPERATORS = { sum: "∑", prod: "∏", coprod: "∐", int: "∫", oint: "∮" };

  var FENCES = {
    langle: "⟨", rangle: "⟩", lvert: "|", rvert: "|",
    lVert: "‖", rVert: "‖", vert: "|", Vert: "‖", "{": "{", "}": "}"
  };

  var FUNCTIONS = ("sin cos tan cot sec csc arcsin arccos arctan sinh cosh "
    + "tanh exp log ln det tr max min lim sup inf gcd mod arg Tr round").split(" ");

  /* em widths, matching TeX's spacing commands */
  var SPACING = {
    ",": 0.167, ":": 0.222, ";": 0.278, "!": -0.167,
    quad: 1, qquad: 2, " ": 0.25
  };

  var ACCENTS = {
    hat: "\u02C6", bar: "\u00AF", vec: "\u2192", tilde: "\u02DC",
    dot: "\u02D9", ddot: "\u00A8", check: "\u02C7"
  };
  /* these stretch to cover a multi-character base */
  var STRETCHY_ACCENTS = { bar: true, vec: true, tilde: true };

  var MATRIX_FENCES = {
    pmatrix: ["(", ")"], bmatrix: ["[", "]"], vmatrix: ["|", "|"],
    Bmatrix: ["{", "}"], matrix: ["", ""]
  };

  function esc(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ------------------------------------------------------------ tokenizer

  function tokenize(input) {
    var tokens = [], i = 0;
    while (i < input.length) {
      var ch = input[i];
      if (ch === "\\") {
        var name = /^[a-zA-Z]+/.exec(input.slice(i + 1));
        if (name) { tokens.push({ type: "cmd", value: name[0] }); i += 1 + name[0].length; }
        else { tokens.push({ type: "cmd", value: input[i + 1] }); i += 2; }
      }
      else if (ch === "{") { tokens.push({ type: "open" }); i++; }
      else if (ch === "}") { tokens.push({ type: "close" }); i++; }
      else if (ch === "^") { tokens.push({ type: "sup" }); i++; }
      else if (ch === "_") { tokens.push({ type: "sub" }); i++; }
      else if (ch === "&") { tokens.push({ type: "amp" }); i++; }
      else if (/\s/.test(ch)) { tokens.push({ type: "space" }); i++; }
      else { tokens.push({ type: "char", value: ch }); i++; }
    }
    return tokens;
  }

  // --------------------------------------------------------------- parser

  function Parser(tokens) { this.tokens = tokens; this.pos = 0; }
  Parser.prototype.peek = function () { return this.tokens[this.pos]; };
  Parser.prototype.next = function () { return this.tokens[this.pos++]; };
  Parser.prototype.done = function () { return this.pos >= this.tokens.length; };

  /* One argument as a node: a braced group, or the next single atom. */
  Parser.prototype.arg = function () {
    var token = this.peek();
    if (!token) return { t: "mrow", body: [] };
    if (token.type === "open") {
      this.next();
      var body = this.list(function (t) { return t.type === "close"; });
      if (this.peek() && this.peek().type === "close") this.next();
      return { t: "mrow", body: body };
    }
    var atom = this.atom();
    return atom || { t: "mrow", body: [] };
  };

  /* Literal source of a group, whitespace intact -- for \text. */
  Parser.prototype.rawArg = function () {
    var token = this.peek();
    if (!token) return "";
    if (token.type !== "open") { this.next(); return token.value || ""; }
    this.next();
    var depth = 1, out = "";
    while (!this.done()) {
      var t = this.next();
      if (t.type === "open") { depth++; out += "{"; continue; }
      if (t.type === "close") { depth--; if (!depth) break; out += "}"; continue; }
      if (t.type === "space") { out += " "; continue; }
      if (t.type === "cmd") { out += "\\" + t.value; continue; }
      if (t.type === "sup") { out += "^"; continue; }
      if (t.type === "sub") { out += "_"; continue; }
      if (t.type === "amp") { out += "&"; continue; }
      out += t.value || "";
    }
    return out;
  };

  Parser.prototype.list = function (stop) {
    var nodes = [];
    while (!this.done()) {
      var token = this.peek();
      if (stop && stop(token)) break;

      if (token.type === "sup" || token.type === "sub") {
        this.next();
        var script = this.arg();
        var base = nodes.pop() || { t: "mrow", body: [] };
        nodes.push(attachScript(base, script, token.type === "sup"));
        continue;
      }
      var atom = this.atom();
      if (atom) nodes.push(atom);
    }
    return nodes;
  };

  /* Attach a script, merging sub+sup and using under/over for big operators. */
  function attachScript(base, script, isSup) {
    var limits = base.t === "bigop";
    if (base.t === "subsup" || base.t === "underover") {
      base[isSup ? "over" : "under"] = script;
      return base;
    }
    if (limits) {
      return { t: "underover", base: base,
               under: isSup ? null : script, over: isSup ? script : null };
    }
    return { t: "subsup", base: base,
             under: isSup ? null : script, over: isSup ? script : null };
  }

  Parser.prototype.atom = function () {
    var token = this.next();
    if (!token) return null;

    if (token.type === "space") return null;
    if (token.type === "close") return null;
    if (token.type === "amp") return { t: "sep" };

    if (token.type === "char") {
      var ch = token.value;
      if (/[a-zA-Z]/.test(ch)) return { t: "mi", v: ch };
      if (/[0-9.]/.test(ch)) return { t: "mn", v: ch };
      if (ch === "-") return { t: "mo", v: "−" };
      if (ch === "'") return { t: "mo", v: "′" };
      if ("()[]|".indexOf(ch) >= 0) return { t: "mo", v: ch, fence: true };
      return { t: "mo", v: ch };
    }

    if (token.type === "open") {
      var body = this.list(function (t) { return t.type === "close"; });
      if (this.peek() && this.peek().type === "close") this.next();
      return { t: "mrow", body: body };
    }

    if (token.type === "cmd") return this.command(token.value);
    return null;
  };

  /* A lone +/- used as a state label is not a binary operator. */
  function tightenLabel(node) {
    if (!node) return node;
    if (node.t === "mo") { node.tight = true; return node; }
    if (node.t === "mrow" && node.body.length === 1) tightenLabel(node.body[0]);
    return node;
  }

  Parser.prototype.command = function (name) {
    if (name === "frac" || name === "dfrac" || name === "tfrac") {
      return { t: "frac", num: this.arg(), den: this.arg() };
    }
    if (name === "sqrt") {
      var index = null;
      if (this.peek() && this.peek().type === "char" && this.peek().value === "[") {
        this.next();
        var inner = this.list(function (t) {
          return t.type === "char" && t.value === "]";
        });
        if (this.peek()) this.next();
        index = { t: "mrow", body: inner };
      }
      var body = this.arg();
      return index ? { t: "root", body: body, index: index }
                   : { t: "sqrt", body: body };
    }

    // Dirac notation
    if (name === "ket") {
      return { t: "mrow", body: [{ t: "mo", v: "|", fence: true }, tightenLabel(this.arg()),
                                 { t: "mo", v: "⟩", fence: true }] };
    }
    if (name === "bra") {
      return { t: "mrow", body: [{ t: "mo", v: "⟨", fence: true }, tightenLabel(this.arg()),
                                 { t: "mo", v: "|", fence: true }] };
    }
    if (name === "braket") {
      var l = tightenLabel(this.arg()), r = tightenLabel(this.arg());
      return { t: "mrow", body: [{ t: "mo", v: "⟨", fence: true }, l,
                                 { t: "mo", v: "|" }, r,
                                 { t: "mo", v: "⟩", fence: true }] };
    }
    if (name === "ketbra") {
      var a = tightenLabel(this.arg()), b = tightenLabel(this.arg());
      return { t: "mrow", body: [{ t: "mo", v: "|", fence: true }, a,
                                 { t: "mo", v: "⟩" }, { t: "mo", v: "⟨" }, b,
                                 { t: "mo", v: "|", fence: true }] };
    }
    if (name === "expval") {
      return { t: "mrow", body: [{ t: "mo", v: "⟨", fence: true }, tightenLabel(this.arg()),
                                 { t: "mo", v: "⟩", fence: true }] };
    }

    if (name === "text" || name === "textrm" || name === "mathrm"
        || name === "operatorname" || name === "mathsf") {
      return { t: "mtext", v: this.rawArg() };
    }
    if (name === "mathbf" || name === "bm") {
      return { t: "style", weight: "bold", body: this.arg() };
    }
    if (name === "mathbb") {
      return { t: "mi", v: this.rawArg(), variant: "double-struck" };
    }

    if (ACCENTS[name]) {
      return { t: "over", base: this.arg(), accent: true,
               over: { t: "mo", v: ACCENTS[name], tight: true,
                       stretchy: !!STRETCHY_ACCENTS[name] } };
    }

    if (name === "xrightarrow" || name === "xleftarrow") {
      return { t: "over", base: { t: "mo", v: name === "xrightarrow" ? "⟶" : "⟵" },
               over: this.arg(), accent: false };
    }
    if (name === "overset") {
      var over = this.arg();
      return { t: "over", base: this.arg(), over: over, accent: false };
    }
    if (name === "underset") {
      var under = this.arg();
      return { t: "under", base: this.arg(), under: under };
    }

    if (name === "left" || name === "right" || name === "big" || name === "Big"
        || name === "bigg" || name === "Bigg") {
      var fence = this.next();
      if (!fence) return null;
      var glyph = fence.type === "cmd" ? (FENCES[fence.value] || SYMBOLS[fence.value]
                                          || fence.value) : fence.value;
      if (glyph === ".") return null;
      return { t: "mo", v: glyph, fence: true, stretchy: true };
    }

    if (name === "begin") return this.environment(this.rawArg());
    if (name === "end") { this.rawArg(); return null; }
    if (name === "\\") {
      // TeX allows an optional [length] after a row break
      if (this.peek() && this.peek().type === "char" && this.peek().value === "[") {
        this.next();
        while (!this.done()) {
          var skip = this.next();
          if (skip.type === "char" && skip.value === "]") break;
        }
      }
      return { t: "break" };
    }

    if (SPACING[name] !== undefined) return { t: "space", width: SPACING[name] };
    if (BIG_OPERATORS[name]) return { t: "bigop", v: BIG_OPERATORS[name] };
    if (GREEK_LOWER[name]) return { t: "mi", v: GREEK_LOWER[name] };
    if (GREEK_UPPER[name]) return { t: "mi", v: GREEK_UPPER[name], variant: "normal" };
    if (RELATIONS[name]) return { t: "mo", v: RELATIONS[name] };
    if (FENCES[name]) return { t: "mo", v: FENCES[name], fence: true };
    if (SYMBOLS[name]) return { t: "mo", v: SYMBOLS[name] };
    if (FUNCTIONS.indexOf(name) >= 0) return { t: "func", v: name };
    if (name === "%") return { t: "mo", v: "%" };
    if (name === "_") return { t: "mo", v: "_" };

    return { t: "unknown", v: name };
  };

  Parser.prototype.environment = function (kind) {
    var stop = function (t) { return t.type === "cmd" && t.value === "end"; };
    var body = this.list(stop);
    if (this.peek() && this.peek().type === "cmd" && this.peek().value === "end") {
      this.next();
      this.rawArg();
    }

    var rows = [[[]]];
    body.forEach(function (node) {
      if (node.t === "break") { rows.push([[]]); return; }
      if (node.t === "sep") { rows[rows.length - 1].push([]); return; }
      var row = rows[rows.length - 1];
      row[row.length - 1].push(node);
    });
    rows = rows.filter(function (row) {
      return row.some(function (cell) { return cell.length; });
    });

    if (kind === "aligned" || kind === "align" || kind === "align*") {
      return { t: "table", rows: rows, align: "aligned" };
    }
    if (MATRIX_FENCES[kind]) {
      return { t: "table", rows: rows, align: "matrix",
               fences: MATRIX_FENCES[kind] };
    }
    return { t: "table", rows: rows, align: "aligned" };
  };

  // ------------------------------------------------------------ serialiser

  function toMathML(node) {
    if (!node) return "";
    switch (node.t) {
      case "mi":
        return "<mi" + (node.variant ? ' mathvariant="' + node.variant + '"' : "")
             + ">" + esc(node.v) + "</mi>";
      case "mn":
        return "<mn>" + esc(node.v) + "</mn>";
      case "mo":
        return "<mo" + (node.fence ? ' fence="true"' : "")
             + (node.stretchy ? ' stretchy="true"' : ' stretchy="false"')
             + (node.tight ? ' lspace="0" rspace="0"' : "")
             + ">" + esc(node.v) + "</mo>";
      case "func":
        return "<mspace width=\"0.17em\"></mspace>"
             + "<mi mathvariant=\"normal\">" + esc(node.v) + "</mi>"
             + "<mo lspace=\"0\" rspace=\"0.17em\" stretchy=\"false\">⁡</mo>";
      case "bigop":
        return "<mo largeop=\"true\" movablelimits=\"false\">" + esc(node.v) + "</mo>";
      case "mtext":
        return "<mtext>" + esc(node.v) + "</mtext>";
      case "space":
        return "<mspace width=\"" + node.width + "em\"></mspace>";
      case "break":
        return "";
      case "sep":
        return "";
      case "unknown":
        return "<merror><mtext>\\" + esc(node.v) + "</mtext></merror>";
      case "mrow":
        return "<mrow>" + node.body.map(toMathML).join("") + "</mrow>";
      case "style":
        return "<mstyle mathvariant=\"bold\">" + toMathML(node.body) + "</mstyle>";
      case "frac":
        return "<mfrac>" + wrap(node.num) + wrap(node.den) + "</mfrac>";
      case "sqrt":
        return "<msqrt>" + inner(node.body) + "</msqrt>";
      case "root":
        return "<mroot>" + wrap(node.body) + wrap(node.index) + "</mroot>";
      case "subsup":
        if (node.under && node.over)
          return "<msubsup>" + wrap(node.base) + wrap(node.under) + wrap(node.over) + "</msubsup>";
        if (node.under) return "<msub>" + wrap(node.base) + wrap(node.under) + "</msub>";
        return "<msup>" + wrap(node.base) + wrap(node.over) + "</msup>";
      case "underover":
        if (node.under && node.over)
          return "<munderover>" + wrap(node.base) + wrap(node.under) + wrap(node.over) + "</munderover>";
        if (node.under) return "<munder>" + wrap(node.base) + wrap(node.under) + "</munder>";
        return "<mover>" + wrap(node.base) + wrap(node.over) + "</mover>";
      case "over":
        return "<mover" + (node.accent ? ' accent="true"' : "") + ">"
             + wrap(node.base) + wrap(node.over) + "</mover>";
      case "under":
        return "<munder>" + wrap(node.base) + wrap(node.under) + "</munder>";
      case "table":
        return tableToMathML(node);
      default:
        return "";
    }
  }

  /* MathML script and fraction slots take exactly one child. */
  function wrap(node) {
    if (!node) return "<mrow></mrow>";
    if (node.t === "mrow") return "<mrow>" + node.body.map(toMathML).join("") + "</mrow>";
    return "<mrow>" + toMathML(node) + "</mrow>";
  }

  function inner(node) {
    if (!node) return "";
    if (node.t === "mrow") return node.body.map(toMathML).join("");
    return toMathML(node);
  }

  function tableToMathML(node) {
    var isAligned = node.align === "aligned";
    var rows = node.rows.map(function (cells) {
      var tds = cells.map(function (cell, index) {
        // TeX's aligned puts & between a right-aligned and a left-aligned column
        var align = isAligned ? (index % 2 === 0 ? "right" : "left") : "center";
        return "<mtd columnalign=\"" + align + "\"><mrow>"
             + cell.map(toMathML).join("") + "</mrow></mtd>";
      }).join("");
      return "<mtr>" + tds + "</mtr>";
    }).join("");
    var table = "<mtable" + (isAligned ? ' columnspacing="0.15em"' : "") + ">"
              + rows + "</mtable>";
    if (node.fences && node.fences[0]) {
      return "<mrow><mo stretchy=\"true\">" + esc(node.fences[0]) + "</mo>"
           + table + "<mo stretchy=\"true\">" + esc(node.fences[1]) + "</mo></mrow>";
    }
    return table;
  }

  // ---------------------------------------------------------------- API

  function mathElement(inner, display, extraClass) {
    return '<math xmlns="http://www.w3.org/1998/Math/MathML"'
         + (display ? ' display="block"' : "")
         + ' class="mf' + (extraClass ? " " + extraClass : "") + '"><mrow>'
         + inner + "</mrow></math>";
  }

  /* An aligned derivation as a CSS grid: every cell is its own <math>, so the
     column boundaries -- and therefore the = signs -- land at exactly the same
     x on every row. MathML Core has no columnalign, so an <mtable> centres each
     cell instead and the relations come out ragged. */
  function alignedToGrid(node) {
    var columns = node.rows.reduce(function (most, row) {
      return Math.max(most, row.length);
    }, 1);
    var html = '<div class="mf-align" style="grid-template-columns:repeat('
             + columns + ',max-content)">';
    node.rows.forEach(function (cells) {
      for (var index = 0; index < columns; index++) {
        var cell = cells[index] || [];
        var side = index % 2 === 0 ? "mf-al-r" : "mf-al-l";
        html += mathElement(cell.map(toMathML).join(""), false, side);
      }
    });
    return html + "</div>";
  }

  function render(tex, options) {
    options = options || {};
    var nodes = new Parser(tokenize(tex)).list(null);
    if (nodes.length === 1 && nodes[0].t === "table" && nodes[0].align === "aligned") {
      return alignedToGrid(nodes[0]);
    }
    return mathElement(nodes.map(toMathML).join(""), options.display);
  }

  function install(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-tex]");
    Array.prototype.forEach.call(nodes, function (node) {
      var tex = node.getAttribute("data-tex");
      var display = node.hasAttribute("data-display");
      node.innerHTML = render(tex, { display: display });
      if (!node.getAttribute("aria-label")) node.setAttribute("aria-label", tex);
    });
    return nodes.length;
  }

  global.MathFmt = { render: render, install: install, tokenize: tokenize };
  if (typeof module !== "undefined" && module.exports) module.exports = global.MathFmt;
})(typeof globalThis !== "undefined" ? globalThis : this);
