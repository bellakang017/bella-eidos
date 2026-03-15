/**
 * ============================================================
 *  bella eidos — MD/YAML Domain Trainer
 *  Flashcards, Challenges, Sandbox, Glossary, Symbols, Reference
 *  Integrates with core.js (Eidos.ErrorReframe, Eidos.Session)
 * ============================================================
 */

window.EidosTrainer = {

  // ========================================================
  //  FLASHCARD DATA
  // ========================================================
  flashcards: [
    // --- MARKDOWN FUNDAMENTALS ---
    { q: "What does # do, and how does\nthe number of # symbols matter?", a: "Creates headings. Count = level.\n# = H1 (largest)\n## = H2\n### = H3\n\nNever skip levels (e.g., H1 to H3)." },
    { q: "Single backtick ` vs\ntriple backtick ```. When each?", a: "Single ` = inline code. Terms within a sentence.\n\nTriple ``` = code block. Multi-line code.\nOpening ``` can have a language: ```yaml\nClosing ``` must be alone on its own line." },
    { q: "--- means different things\ndepending on position. Explain both.", a: "Line 1 of a note: frontmatter fence\n(opens/closes the YAML metadata block)\n\nAnywhere in the body: horizontal rule\n(visual section divider)\n\nPosition determines function." },
    { q: "What is the ONE universal rule\nof YAML syntax?", a: "key: value (colon + exactly one space)\n\ntype:concept  = BREAKS (no space)\ntype: concept = WORKS\n\nApplies to every YAML key-value pair." },
    { q: "[a, b] in frontmatter vs\n[[a]] in the body. Difference?", a: "[a, b] = YAML list (enumerating values)\n[[a]] = Obsidian wikilink (connects notes)\n\nFrontmatter: single brackets [ ]\nBody text: double brackets [[ ]]\n\nMixing them breaks parsing." },
    { q: "Why must URLs in YAML\nbe wrapped in double quotes?", a: "URLs contain : and / which YAML interprets\nas key-value separators.\n\nsource: https://x.com = YAML sees 'https' as new key\nsource: \"https://x.com\" = Correct\n\nRule: special chars in value = quotes." },
    { q: "What is frontmatter?\nWhy does it exist?", a: "Front(before) + Matter(content) = metadata.\n\nFrom publishing: title page, TOC, author info.\nIn notes: classification, dates, tags, relationships.\n\nMachines read frontmatter.\nHumans read the body." },
    // --- YAML ADVANCED ---
    { q: "Write valid YAML for a note with:\ntype, date, 3 tags, and a URL source.", a: "---\ntype: concept\ndate: 2026-03-15\ntags: [ontology, SPARQL, data]\nsource: \"https://example.com/paper\"\n---\n\nNote: tags use brackets, URL uses quotes." },
    { q: "What happens if you indent\nYAML with tabs instead of spaces?", a: "YAML breaks. Tabs are illegal in YAML.\n\nYAML only allows spaces for indentation.\nMost editors auto-convert, but pasted\ncontent can contain hidden tabs.\n\nResult: parsing error, frontmatter ignored." },
    { q: "YAML multiline values:\nwhat do | and > do?", a: "| = literal block (preserves line breaks)\ndescription: |\n  Line one\n  Line two\n\n> = folded block (joins into paragraph)\ndescription: >\n  This becomes\n  one paragraph\n\nUseful for long frontmatter descriptions." },
    // --- ONTOLOGY & KNOWLEDGE GRAPHS ---
    { q: "Ontology vs Knowledge Graph.\nExplain with an analogy.", a: "Ontology = blueprint/schema\n(rules for how data relates)\n\"Employees belong to departments\"\n\nKnowledge Graph = blueprint + actual data\n\"Bella belongs to OCLD\"\n\nOntology defines structure.\nKG fills it with instances." },
    { q: "What does SPARQL do\nthat SQL cannot?", a: "SPARQL traverses relationships across a graph.\nSQL queries flat tables.\n\nSQL: SELECT * FROM employees WHERE dept='AI'\nSPARQL: Find people connected to org X\n  who published with person Y on topic Z.\n\nSPARQL follows edges. SQL filters rows." },
    { q: "Vector embedding in one sentence.\nThen: why does it matter for LLMs?", a: "Maps data to coordinates where similar\nthings are physically close in space.\n\nFor LLMs: enables semantic search.\n\"Find notes similar to this concept\"\nworks because related ideas have\nnearby vectors, even without shared keywords." },
    { q: "SHACL validates data.\nGive a concrete example.", a: "SHACL = Shapes Constraint Language\n\nRule: \"Every employee must have a department\"\n\nData: {name: 'Bella', role: 'RA'}\nSHACL rejects it. Missing 'department'.\n\nLike Dataview in Obsidian:\nenforcing frontmatter schema consistency." },
    { q: "LLM without ontology vs\nLLM with ontology. What changes?", a: "Without: words = statistical patterns.\nNo logical reasoning. No fact verification.\nHallucinations unchecked.\n\nWith: words map to real-world concepts.\nCan verify claims against structured data.\nCausal reasoning becomes possible.\n\nOntology = pattern matching vs understanding." },
    // --- TECH ETYMOLOGY ---
    { q: "Framework: original meaning.\nWhy is it called that in code?", a: "Original: steel skeleton of a building.\nEverything hangs on the structure.\n\nIn code: pre-built structure with conventions.\nYou fill in your logic; the frame holds it.\n\nKey: you work INSIDE a framework.\nYou call a library. A framework calls you." },
    { q: "Cache comes from French.\nWhat does it literally mean?", a: "French 'cacher' = to hide.\n\nComputing: hiding frequently-used data\nclose by for fast retrieval.\n\nAnalogy: spices on the counter vs pantry.\n\nLayers: L1 cache (counter) -> L2 (shelf)\n-> L3 (pantry) -> disk (grocery store)." },
    { q: "Token: subway token to LLM token.\nTrace the metaphor.", a: "Original: coin/voucher exchanged for access.\nOne token = one unit of value.\n\nLLMs: one token = one unit of text.\n'Hello world' = ['Hello', ' world'] = 2 tokens\nCJK: each character often = 1 token.\n\nLLMs read, think, and bill in tokens." },
    { q: "Grounding in AI.\nWhy the electrical metaphor?", a: "Electrical: connecting to earth so\nexcess charge dissipates safely.\n\nAI: connecting LLM output to\nverifiable real-world data.\n\nWithout grounding:\n- Electricity = shock hazard\n- LLM = hallucination hazard\n\nRAG is the main grounding technique." },
    { q: "Origin of 'bug' in computing.\nWhy does the term persist?", a: "1947: a moth jammed the Harvard Mark II.\nGrace Hopper taped it in the logbook:\n\"First actual case of bug being found.\"\n\nThe term predates computers (Edison used it)\nbut the moth made it iconic.\n\nDebugging = removing what shouldn't be there." },
    // --- KEYBOARD & SHORTCUTS ---
    { q: "Cmd, Option, Shift, Ctrl, Fn.\nMental model for each?", a: "Cmd = \"Do this\" (primary action)\nOption = \"Do it differently\" (variant)\nShift = \"Do opposite/expanded version\"\nCtrl = auxiliary modifier (rare on Mac)\nFn = \"Use hidden function of this key\"\n\nPattern: Cmd+S = save\nCmd+Shift+S = save as (expanded)" },
    { q: "How to type em dash (--) on Mac?\nExplain the logic.", a: "Option + Shift + -\n\nLogic:\n- = hyphen (base character)\nOption = \"variant of\"\nShift = \"expanded\"\n\nExpanded variant of hyphen = em dash.\n\nAlso: Option + - alone = en dash\n(just variant, not expanded)" },
    { q: "Cmd+Ctrl+Space opens what?\nWhy this specific combo?", a: "Character Viewer (emoji/symbol picker).\n\nLogic:\nCmd = primary action\nCtrl = auxiliary\nSpace = text entry\n\nAll three = \"special text entry mode\"\n\nOnce open, search: arrow, check, star, etc." },
    // --- ADVANCED SYNTHESIS ---
    { q: "A note has broken frontmatter.\nList 3 possible causes.", a: "1. Missing space after colon\n   type:concept (needs type: concept)\n\n2. Unquoted special characters\n   source: https://... (needs quotes)\n\n3. Tabs instead of spaces\n   YAML only allows space indentation\n\nBonus: missing closing ---\nEntire note treated as YAML." },
    { q: "[[Note]] vs [text](url).\nWhen to use each?", a: "[[Note]] = internal vault link.\nBidirectional. Shows in graph view.\nWorks offline.\n\n[text](url) = standard web link.\nOne-directional. External resource.\nNo graph connection.\n\nRule: vault note = [[ ]]\nExternal = [ ]( )" },
    { q: "Design a frontmatter schema\nfor a research paper note.", a: "---\ntype: literature\ndate: 2026-03-15\nstatus: reading\ntags: [trust, AI, education]\nauthors: [\"Chen, P.\", \"Mrazek, A.\"]\nyear: 2024\njournal: \"Journal of Ed Psych\"\ndoi: \"10.1037/edu0000XXX\"\nrelated: [\"[[ZPD]]\", \"[[Self-Regulation]]\"]\n---\n\nConsistent schema enables Dataview queries." },
    { q: "Ontology vs schema vs taxonomy.\nRelationship between the three?", a: "Taxonomy = hierarchical classification\n(animal > mammal > dog)\n\nSchema = structure definition\n(fields, types, required vs optional)\n\nOntology = schema + relationships + rules\n(dogs are mammals, mammals are warm-blooded,\nwarm-blooded implies temperature regulation)\n\nComplexity: taxonomy < schema < ontology." }
  ],

  // ========================================================
  //  CHALLENGE SETS
  // ========================================================
  challengeSets: [
    [
      { q: "Write complete frontmatter for a concept note about SPARQL, dated today, with 3 tags.", answer: "---\ntype: concept\ndate: 2026-03-15\ntags: [SPARQL, ontology, query]\n---", hint: "--- fence, key: value, brackets for list" },
      { q: "What's wrong with this YAML?\ntags: [ontology, SPARQL]\nsource: https://example.com", answer: "URL needs double quotes because it contains : and /", hint: "Special characters in values need quoting" },
      { q: "Write a YAML multiline literal block for a description field.", answer: "description: |\n  First line\n  Second line", hint: "| preserves line breaks, indent with 2 spaces" },
      { q: "Type the keyboard shortcut for em dash on Mac and explain the logic.", answer: "Option + Shift + - (variant + expanded + hyphen = long dash)", hint: "Option = variant, Shift = expanded" },
      { q: "What's the difference between ontology and knowledge graph?", answer: "Ontology = rules/blueprint for how data relates. Knowledge graph = ontology filled with actual data instances.", hint: "Blueprint vs blueprint + data" }
    ],
    [
      { q: "Create an internal link to a note called 'Self-Regulation' and an external link to Google.", answer: "[[Self-Regulation]] and [Google](https://google.com)", hint: "Double brackets = internal, [text](url) = external" },
      { q: "This YAML breaks. Why?\ntype: concept\n\ttags: [a, b]", answer: "Tabs are illegal in YAML. Only spaces allowed for indentation.", hint: "YAML's strictest rule about whitespace" },
      { q: "SPARQL vs SQL: what can SPARQL do that SQL cannot?", answer: "Traverse relationships across a graph (follow edges between nodes), not just filter flat table rows.", hint: "Graph traversal vs row filtering" },
      { q: "Write frontmatter for a literature note with authors list and DOI.", answer: "---\ntype: literature\nauthors: [\"Smith, J.\", \"Lee, K.\"]\ndoi: \"10.1000/xyz123\"\n---", hint: "Authors in brackets with quotes, DOI in quotes" },
      { q: "What is SHACL and what's its Obsidian equivalent?", answer: "SHACL validates data against schema rules (e.g., required fields). Dataview in Obsidian does similar frontmatter validation.", hint: "Shapes Constraint Language" }
    ],
    [
      { q: "Explain grounding in AI using the electrical metaphor.", answer: "Electrical grounding connects to earth for safety. AI grounding connects LLM output to verifiable data to prevent hallucinations.", hint: "Both prevent dangerous disconnection from reality" },
      { q: "What are the 3 most common causes of broken frontmatter?", answer: "1. Missing space after colon (type:x)\n2. Unquoted special characters (URLs)\n3. Tabs instead of spaces", hint: "Syntax, quoting, whitespace" },
      { q: "Vector embedding in one sentence.", answer: "Maps data to numerical coordinates where semantically similar items are physically close in space.", hint: "Proximity = similarity" },
      { q: "Framework vs library: what's the key distinction?", answer: "You call a library. A framework calls you (inversion of control). You work inside a framework's structure.", hint: "Who controls the flow?" },
      { q: "Taxonomy vs schema vs ontology: rank by complexity and explain.", answer: "Taxonomy (classification) < Schema (structure + types) < Ontology (schema + relationships + inference rules)", hint: "Each level adds more expressiveness" }
    ],
    [
      { q: "Design a YAML frontmatter schema for tracking weekly reflections.", answer: "---\ntype: reflection\ndate: 2026-03-15\nweek: 9\ncourse: EDP382K\ntags: [metacognition, self-regulation]\nstatus: submitted\n---", hint: "Think about what fields you'd query with Dataview" },
      { q: "LLM with ontology vs without: what specifically changes?", answer: "Without: statistical pattern matching, no fact checking, hallucinations.\nWith: concept-level understanding, fact verification against structured data, causal reasoning.", hint: "Pattern matching vs understanding" },
      { q: "Cache has 4 layers. Name them from fastest to slowest.", answer: "L1 cache (CPU register) -> L2 cache -> L3 cache -> Disk/SSD. Each layer is larger but slower.", hint: "Think: counter -> shelf -> pantry -> grocery store" },
      { q: "Write both a YAML literal block (|) and folded block (>).", answer: "Literal: description: |\n  Line one\n  Line two\n(preserves breaks)\n\nFolded: description: >\n  Joined into\n  one paragraph\n(folds lines)", hint: "| = keep breaks, > = join lines" },
      { q: "Cmd+Ctrl+Space: what opens and why that specific key combo?", answer: "Character Viewer. Cmd=action, Ctrl=auxiliary, Space=text entry. All three = special text entry mode.", hint: "Each modifier adds a dimension" }
    ]
  ],

  // ========================================================
  //  STATE
  // ========================================================
  currentCard: 0,
  isFlipped: false,
  cardResults: {},
  currentChallengeSet: 0,
  challengesDone: 0,

  // ========================================================
  //  TAB NAVIGATION
  // ========================================================
  showPage: function (name) {
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(function (t) {
      t.classList.remove('active');
    });
    var pageEl = document.getElementById('page-' + name);
    if (pageEl) pageEl.classList.add('active');

    // Find the clicked tab by data attribute
    var tab = document.querySelector('.nav-tab[data-page="' + name + '"]');
    if (tab) tab.classList.add('active');

    if (name === 'sandbox') this.renderPreview();
  },

  // ========================================================
  //  FLASHCARDS
  // ========================================================
  showCard: function () {
    var fc = this.flashcards[this.currentCard];
    var qEl = document.getElementById('fc-question');
    var aEl = document.getElementById('fc-answer');
    var cntEl = document.getElementById('fc-counter');
    var cardEl = document.getElementById('flashcard');
    var hintEl = document.getElementById('fc-hint');

    if (qEl) qEl.textContent = fc.q;
    if (aEl) aEl.innerHTML = fc.a.replace(/\n/g, '<br>');
    if (cntEl) cntEl.textContent = (this.currentCard + 1) + ' / ' + this.flashcards.length;
    if (cardEl) cardEl.classList.remove('flipped');
    if (hintEl) hintEl.textContent = '클릭해서 뒤집기';
    this.isFlipped = false;
  },

  flipCard: function () {
    this.isFlipped = !this.isFlipped;
    var cardEl = document.getElementById('flashcard');
    var hintEl = document.getElementById('fc-hint');
    if (cardEl) cardEl.classList.toggle('flipped');
    if (hintEl) hintEl.textContent = this.isFlipped ? '아래 버튼으로 평가' : '클릭해서 뒤집기';
  },

  nextCard: function () {
    this.currentCard = (this.currentCard + 1) % this.flashcards.length;
    this.showCard();
  },

  prevCard: function () {
    this.currentCard = (this.currentCard - 1 + this.flashcards.length) % this.flashcards.length;
    this.showCard();
  },

  markCard: function (known) {
    this.cardResults[this.currentCard] = known;

    // Integrate with Eidos.ErrorReframe
    if (typeof Eidos !== 'undefined' && Eidos.ErrorReframe) {
      if (known) {
        Eidos.ErrorReframe.recordCorrect();
      } else {
        Eidos.ErrorReframe.recordError();
      }
    }

    // Update session data
    if (typeof Eidos !== 'undefined' && Eidos.Session && Eidos.Session.current) {
      Eidos.Session.current.flashcardsReviewed = Object.keys(this.cardResults).length;
      Eidos.Session.current.flashcardsCorrect = Object.values(this.cardResults).filter(function (v) { return v; }).length;
    }

    this.currentCard = (this.currentCard + 1) % this.flashcards.length;
    this.showCard();
    this._updateZPD();
  },

  // ========================================================
  //  SANDBOX
  // ========================================================
  renderPreview: function () {
    var inputEl = document.getElementById('sandboxInput');
    var preview = document.getElementById('sandboxPreview');
    if (!inputEl || !preview) return;

    var input = inputEl.value;
    var html = '';
    var inFrontmatter = false;
    var fmStarted = false;
    var fmContent = '';
    var inCodeBlock = false;
    var codeContent = '';
    var lines = input.split('\n');
    var self = this;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.trim() === '---' && i === 0) {
        inFrontmatter = true;
        fmStarted = true;
        fmContent = '';
        continue;
      }

      if (line.trim() === '---' && fmStarted && inFrontmatter) {
        inFrontmatter = false;
        html += '<div class="fm-block">' + fmContent + '</div>';
        continue;
      }

      if (inFrontmatter) {
        var parts = line.split(':');
        if (parts.length >= 2) {
          var key = parts[0].trim();
          var val = parts.slice(1).join(':').trim();
          fmContent += '<span class="fm-key">' + self.esc(key) + '</span>: ' + self.esc(val) + '<br>';
        }
        continue;
      }

      if (line.trim().startsWith('```') && !inCodeBlock) {
        inCodeBlock = true;
        codeContent = '';
        continue;
      }

      if (line.trim() === '```' && inCodeBlock) {
        inCodeBlock = false;
        html += '<pre><code>' + self.esc(codeContent.trim()) + '</code></pre>';
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      if (line.trim() === '---') {
        html += '<hr>';
        continue;
      }

      var processed = self.esc(line);
      processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');
      processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      processed = processed.replace(/==([^=]+)==/g, '<mark>$1</mark>');
      processed = processed.replace(/\[\[([^\]]+)\]\]/g, '<a href="#">$1</a>');

      if (line.startsWith('### ')) {
        html += '<h3>' + processed.substring(4) + '</h3>';
      } else if (line.startsWith('## ')) {
        html += '<h2>' + processed.substring(3) + '</h2>';
      } else if (line.startsWith('# ')) {
        html += '<h1>' + processed.substring(2) + '</h1>';
      } else if (line.startsWith('- ')) {
        html += '<div style="padding-left:16px;">&#8226; ' + processed.substring(2) + '</div>';
      } else if (line.startsWith('  - ')) {
        html += '<div style="padding-left:32px;">&#9702; ' + processed.substring(4) + '</div>';
      } else if (line.trim() === '') {
        html += '<br>';
      } else {
        html += '<div>' + processed + '</div>';
      }
    }

    preview.innerHTML = html;
  },

  // ========================================================
  //  CHALLENGES
  // ========================================================
  loadChallenges: function () {
    var set = this.challengeSets[this.currentChallengeSet % this.challengeSets.length];
    var container = document.getElementById('challengeList');
    if (!container) return;
    container.innerHTML = '';
    var self = this;

    set.forEach(function (ch, i) {
      var div = document.createElement('div');
      div.className = 'challenge';
      div.style.marginBottom = '16px';
      div.innerHTML =
        '<div class="challenge-q subheading" style="margin-bottom:12px;">' + (i + 1) + '. ' + ch.q + '</div>' +
        '<textarea class="challenge-input" id="ch-input-' + i + '" placeholder="Type here..."></textarea>' +
        '<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">' +
          '<button class="flash-btn" onclick="EidosTrainer.checkChallenge(' + i + ')">Check</button>' +
          '<button class="flash-btn" onclick="EidosTrainer.showHint(' + i + ')" style="color:var(--text-dim);">Hint</button>' +
        '</div>' +
        '<div class="challenge-result" id="ch-result-' + i + '" style="display:none;"></div>' +
        '<div class="caption" style="margin-top:4px;display:none;" id="ch-hint-' + i + '">Hint: ' + ch.hint + '</div>';
      container.appendChild(div);
    });
  },

  checkChallenge: function (idx) {
    var set = this.challengeSets[this.currentChallengeSet % this.challengeSets.length];
    var inputEl = document.getElementById('ch-input-' + idx);
    var result = document.getElementById('ch-result-' + idx);
    if (!inputEl || !result) return;

    var input = inputEl.value.trim();
    var answer = set[idx].answer;

    var normalize = function (s) {
      return s.toLowerCase().replace(/\s+/g, ' ').replace(/[\u201C\u201D\u2018\u2019]/g, '"').trim();
    };

    if (normalize(input) === normalize(answer) || input.includes(answer.split('\n')[0])) {
      result.className = 'challenge-result correct';
      result.style.display = 'block';
      result.innerHTML = 'Correct!';
      this.challengesDone++;

      // Integrate with Eidos.ErrorReframe
      if (typeof Eidos !== 'undefined' && Eidos.ErrorReframe) {
        Eidos.ErrorReframe.recordCorrect();
      }
    } else {
      result.className = 'challenge-result wrong';
      result.style.display = 'block';
      result.innerHTML = '정답 예시:<br><code class="mono" style="white-space:pre-wrap;">' + this.esc(answer) + '</code>';

      // Integrate with Eidos.ErrorReframe
      if (typeof Eidos !== 'undefined' && Eidos.ErrorReframe) {
        Eidos.ErrorReframe.recordError();
      }
    }

    // Update session data
    if (typeof Eidos !== 'undefined' && Eidos.Session && Eidos.Session.current) {
      Eidos.Session.current.challengesDone = this.challengesDone;
    }

    this._updateZPD();
  },

  showHint: function (idx) {
    var el = document.getElementById('ch-hint-' + idx);
    if (el) el.style.display = 'block';
  },

  resetChallenges: function () {
    this.currentChallengeSet++;
    this.loadChallenges();
  },

  // ========================================================
  //  COPY SYMBOL
  // ========================================================
  copySymbol: function (s) {
    var showAlert = function () {
      var el = document.getElementById('copyAlert');
      if (el) {
        el.textContent = '"' + s + '" copied!';
        el.style.display = 'block';
        setTimeout(function () { el.style.display = 'none'; }, 1500);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(showAlert).catch(function () {
        // fallback
        var ta = document.createElement('textarea');
        ta.value = s;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showAlert();
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = s;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showAlert();
    }
  },

  // ========================================================
  //  HTML ESCAPE
  // ========================================================
  esc: function (s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  // ========================================================
  //  ZPD INDICATOR UPDATE
  // ========================================================
  _updateZPD: function () {
    if (typeof Eidos === 'undefined' || !Eidos.ErrorReframe) return;
    var zpd = Eidos.ErrorReframe.getZPDStatus();
    var badge = document.getElementById('zpd-badge');
    if (!badge) return;

    if (zpd.zone === 'insufficient') {
      badge.style.display = 'none';
      return;
    }
    badge.style.display = '';
    badge.textContent = zpd.label;
    badge.className = 'zpd-indicator';
    if (zpd.zone === 'easy') badge.classList.add('too-easy');
    else if (zpd.zone === 'optimal') badge.classList.add('optimal');
    else if (zpd.zone === 'hard') badge.classList.add('scaffold-needed');
  },

  // ========================================================
  //  INIT
  // ========================================================
  init: function () {
    this.showCard();
    this.loadChallenges();
    this.renderPreview();
    this._updateZPD();
  }
};
