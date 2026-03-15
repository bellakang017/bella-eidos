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
    { q: "# 이 기호는 뭘 하는 거야?", a: "헤딩 (제목). # 개수 = 층 번호.\n# = 1층 (가장 큰 제목)\n## = 2층\n### = 3층" },
    { q: "`백틱` 1개로 감싸면?", a: "인라인 코드 — 문장 안에서 기술 용어를 시각적으로 구분.\n회색 배경 + 모노스페이스 폰트로 표시됨." },
    { q: "```백틱 3개```로 감싸면?", a: "코드 블록 — 여러 줄을 상자 안에 보여주기.\n닫을 때: 새 줄에 ``` 만 단독으로!" },
    { q: "---는 어디에 쓰느냐에 따라\n역할이 달라진다. 뭐가 다를까?", a: "노트 맨 첫 줄 → frontmatter 울타리\n(이름표 영역의 시작/끝)\n\n본문 중간 → 수평선 (가로 구분선)" },
    { q: "YAML의 규칙은 딱 하나.\n그게 뭐야?", a: "이름: 값\n(콜론 + 띄어쓰기 1칸)\n\ntype:concept ← ✗ 띄어쓰기 없음\ntype: concept ← ✓" },
    { q: "YAML에서 값이 여러 개일 때\n어떻게 써?", a: "대괄호 + 쉼표\ntags: [ontology, SPARQL, data]\n\n쉼표 뒤에 띄어쓰기 넣으면 가독성 좋음." },
    { q: "frontmatter 뜻이 뭐야?\n왜 '이름표'라고 불러?", a: "Front(앞) + Matter(내용물)\n= 본문 앞에 오는 메타정보.\n\n출판 용어: 책의 제목 페이지, 목차, 저자 정보 부분.\n노트의 분류/날짜/관계를 담으니까 '이름표' 역할." },
    { q: "Frontmatter 안에서 [a, b] 와\n본문에서 [[a]] 의 차이는?", a: "[a, b] = YAML 목록 (값 여러 개 나열)\n[[a]] = 옵시디언 링크 (다른 노트로 연결)\n\nfrontmatter에서는 [  ] 1개\n본문에서는 [[  ]] 2개" },
    { q: "URL에 : 나 / 가 있을 때\nYAML에서 어떻게 써?", a: "큰따옴표로 감싸기\nsource: \"https://youtu.be/...\"\n\n안 감싸면 YAML이 :을 새로운 이름:값으로 혼동." },
    { q: "⌘ Cmd 키는 뭘 해?", a: "\"이걸 해\" — Mac의 기본 명령 키.\nCmd+C = 복사\nCmd+V = 붙여넣기\nCmd+S = 저장" },
    { q: "⌥ Option 키는 뭘 해?", a: "\"근데 좀 다르게 해\" — 변형 키.\n\nCmd+S = 저장\nCmd+Opt+S = 다른 이름으로 저장\n\nOpt+Shift+- = em dash (—)" },
    { q: "Fn 키는 뭘 해?", a: "\"이 키의 숨겨진 기능을 써\"\n\nF1~F12가 기본은 밝기/볼륨인데\nFn 누르면 진짜 F1~F12 기능 실행." },
    { q: "온톨로지 = ?", a: "설계도 (Schema/Blueprint)\n\n데이터 간의 관계 '규칙'을 정의.\n예: \"직원은 회사에 소속된다\"" },
    { q: "지식 그래프 = ?", a: "온톨로지(규칙)에 따라\n실제 데이터가 입력된 결과물.\n\n온톨로지: \"직원은 회사에 소속\"\n지식 그래프: \"Bella는 OCLD에 소속\"" },
    { q: "SPARQL은 뭘 해?", a: "지식 그래프에 질문하는 언어.\n\n 엑셀 = 한 줄 안에서 필터\nSPARQL = 관계를 따라가면서 질문\n\n\"A에 소속된 사람 중 B 스킬을 가진 사람은?\"" },
    { q: "벡터 임베딩 = ?", a: "비슷한 것끼리 가까이 놓기.\n\n데이터를 숫자 좌표로 바꿔서\n의미가 비슷한 데이터가 공간에서 가까이 위치.\n\n옷장 정리: 겨울옷 왼쪽, 여름옷 오른쪽." },
    { q: "SHACL은 뭘 해?", a: "규칙대로 데이터를 넣었는지 검사.\n\n\"모든 직원은 부서가 있어야 한다\"\n→ 부서 없는 직원 데이터 들어오면 ❌ 잡아냄.\n\n옵시디언에서 Dataview가 비슷한 역할." },
    { q: "온톨로지 없는 LLM vs\n온톨로지 장착한 LLM 차이는?", a: "없는 LLM: 단어를 통계적 확률로 처리.\n논리적 추론 불가, 팩트 체크 불가.\n\n장착한 LLM: 단어를 실제 세상의 '개념'으로 이해.\n팩트 기반 답변, 인과관계 추론 가능." },
    { q: "Framework의 원래 뜻은?\n컴퓨터에서는?", a: "원래: 건물의 뼈대 (철골 구조)\n\n컴퓨터: 코드의 기본 구조.\n뼈대가 이미 있고 살만 붙이면 됨." },
    { q: "Pipeline의 원래 뜻은?\n컴퓨터에서는?", a: "원래: 수도관/송유관\n\n컴퓨터: 데이터가 단계별로 흘러가는 처리 과정.\nA → B → C 순서대로 처리." },
    { q: "Sandbox의 원래 뜻은?\n컴퓨터에서는?", a: "원래: 아이들 모래놀이터\n\n컴퓨터: 안전한 실험 공간.\n뭘 해도 진짜 시스템에 영향 없음." },
    { q: "Bug의 유래는?", a: "1947년 하버드 Mark II 컴퓨터에\n진짜 나방(moth)이 끼어서 고장.\n\n이후 코드 오류를 'bug'라 부르고\n오류 수정을 'debugging'(벌레잡기)이라 부름." },
    { q: "Cache의 원래 뜻은?\n컴퓨터에서는?", a: "프랑스어 cacher = 숨기다\n\n컴퓨터: 자주 쓰는 데이터를\n가까운 곳에 숨겨두고 빠르게 꺼내는 것.\n\n냉장고에 자주 먹는 반찬을 앞에 두는 것과 같음." },
    { q: "Token의 원래 뜻은?\nLLM에서는?", a: "원래: 동전/교환권 (지하철 토큰 등)\n\nLLM: 텍스트의 최소 단위 조각.\n'안녕하세요' → ['안녕', '하', '세요'] 이렇게 쪼개짐.\n\nLLM은 토큰 단위로 읽고 생성함." },
    { q: "Grounding의 원래 뜻은?\nAI에서는?", a: "원래: 접지 (전기를 땅에 닿게 해서 안전하게)\n\nAI: LLM의 출력을 실제 데이터에 대조해서 검증.\n'땅(=현실)에 닿게' 만드는 것.\n\n→ 환각(hallucination) 방지의 핵심 기법." },
    { q: "em dash (—) 치는 방법은?", a: "Option + Shift + -\n\nOption = '변형'\nShift = '확장'\n- = 하이픈\n\n→ 하이픈의 변형+확장 = 긴 대시(—)" },
    { q: "Cmd+Ctrl+Space는 뭘 열어?", a: "특수문자 입력기!\n\n여기서 arrow, check, star 등\n검색하면 심볼을 찾을 수 있음.\n\n→ ← ✓ ✗ ★ 등" }
  ],

  // ========================================================
  //  CHALLENGE SETS
  // ========================================================
  challengeSets: [
    [
      { q: "\"SPARQL\"이라는 용어를 문장 안에서 강조하려면 어떻게 쳐?", answer: "`SPARQL`", hint: "백틱 1개로 감싸기" },
      { q: "frontmatter를 시작하는 첫 줄을 써봐", answer: "---", hint: "하이픈 3개" },
      { q: "type이 concept이고 date가 2026-03-15인 frontmatter를 완성해봐", answer: "---\ntype: concept\ndate: 2026-03-15\n---", hint: "--- 울타리 안에 이름: 값" },
      { q: "tags에 ontology, SPARQL, data 세 개를 넣는 YAML을 써봐", answer: "tags: [ontology, SPARQL, data]", hint: "대괄호 + 쉼표 + 띄어쓰기" },
      { q: "em dash (—)를 치려면 어떤 키 조합?", answer: "Option + Shift + -", hint: "Option = 변형, Shift = 확장, - = 하이픈의 변형" }
    ],
    [
      { q: "제목 2단계 (2층)를 만들려면?", answer: "## 텍스트", hint: "# 개수 = 층 번호" },
      { q: "Knowledge-Graph 노트로 링크를 만들려면?", answer: "[[Knowledge-Graph]]", hint: "대괄호 2개" },
      { q: "URL https://youtu.be/abc 를 YAML 값으로 넣으려면?", answer: 'source: "https://youtu.be/abc"', hint: "특수문자가 있으면 큰따옴표" },
      { q: "코드 블록을 닫으려면 어떻게 해?", answer: "```\n(새 줄에 백틱 3개만 단독으로)", hint: "다른 글자 없이 백틱 3개만" },
      { q: "Cmd 키의 역할을 한마디로?", answer: "기본 명령 키 (\"이걸 해\")", hint: "Mac의 주인공 키" }
    ],
    [
      { q: "온톨로지를 한마디로 정의하면?", answer: "데이터 간 관계 규칙을 정의하는 설계도", hint: "Schema / Blueprint" },
      { q: "하이라이트(노란 형광펜)를 만들려면?", answer: "==텍스트==", hint: "등호 2개로 감싸기" },
      { q: "YAML에서 type:concept이 에러인 이유는?", answer: "콜론 뒤에 띄어쓰기가 없어서", hint: "규칙: 이름: 값 (콜론 + 스페이스)" },
      { q: "frontmatter와 코드 블록의 차이 — 각각 뭘로 감싸?", answer: "frontmatter = --- (하이픈 3개)\n코드 블록 = ``` (백틱 3개)", hint: "하이픈 vs 백틱" },
      { q: "Option 키의 역할을 한마디로?", answer: "변형 키 (\"근데 좀 다르게 해\")", hint: "기본 동작에 변형을 줌" }
    ],
    [
      { q: "Pipeline의 원래 뜻과 컴퓨터 뜻은?", answer: "수도관 → 데이터가 단계별로 흘러가는 처리 과정", hint: "물이 파이프를 타고 흐르듯이" },
      { q: "Bug는 왜 벌레라고 불러?", answer: "1947년 진짜 나방이 컴퓨터에 끼어서 고장남", hint: "실제 사건에서 유래" },
      { q: "Cache(캐시)의 원래 뜻은?", answer: "프랑스어로 '숨기다' — 자주 쓰는 데이터를 가까이 숨겨두기", hint: "cacher = 숨기다" },
      { q: "Grounding이 AI에서 뜻하는 건?", answer: "LLM 출력을 실제 데이터에 대조해서 검증 (환각 방지)", hint: "접지 = 현실에 닿게 하기" },
      { q: "Cmd+Ctrl+Space를 누르면 뭐가 열려?", answer: "특수문자 입력기", hint: "심볼/이모지 검색창" }
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
        '<textarea class="challenge-input" id="ch-input-' + i + '" placeholder="여기에 타이핑..."></textarea>' +
        '<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">' +
          '<button class="flash-btn" onclick="EidosTrainer.checkChallenge(' + i + ')">확인</button>' +
          '<button class="flash-btn" onclick="EidosTrainer.showHint(' + i + ')" style="color:var(--text-dim);">힌트</button>' +
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

    badge.textContent = zpd.label;
    badge.className = 'zpd-indicator';
    if (zpd.zone === 'easy') badge.classList.add('too-easy');
    else if (zpd.zone === 'optimal') badge.classList.add('optimal');
    else if (zpd.zone === 'hard') badge.classList.add('scaffold-needed');
    else badge.classList.add('too-easy');
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
