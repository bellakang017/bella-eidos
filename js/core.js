/**
 * ============================================================
 *  bella eidos — core engine (B+)
 *  Constructivist learning tool for an ADHD learner
 *  Based on Huberman's Neuroplasticity Super Protocol
 * ============================================================
 *
 *  Modules exposed on window.Eidos:
 *    - Timer        Ultradian 90-min focus timer
 *    - MicroRest    Random-interval eyes-closed replay prompts
 *    - ErrorReframe Neuroplasticity-based error celebration
 *    - Session      Start / end / persist learning sessions
 *
 *  No frameworks. No modules. Just vanilla JS + DOM.
 * ============================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------
  //  1.  ULTRADIAN TIMER  (90 minutes)
  // --------------------------------------------------------

  const EidosTimer = {
    duration: 90 * 60,       // 90 minutes in seconds
    remaining: 90 * 60,
    interval: null,
    isPaused: false,

    /** Start the countdown. */
    start() {
      if (this.interval) return;          // already running
      this.isPaused = false;
      this.interval = setInterval(() => this._tick(), 1000);
      this._tick();                       // immediate first render
    },

    /** Pause the countdown. */
    pause() {
      this.isPaused = true;
    },

    /** Resume after pause. */
    resume() {
      this.isPaused = false;
    },

    /** Reset back to 90:00. */
    reset() {
      clearInterval(this.interval);
      this.interval = null;
      this.remaining = this.duration;
      this.isPaused = false;
      updateTimerDisplay(this.remaining);
      updateTimerBar(100);
      // Remove warning classes
      const bar = document.querySelector('.timer-bar');
      if (bar) bar.classList.remove('warning', 'critical');
    },

    /** Seconds elapsed since timer started. */
    getElapsed() {
      return this.duration - this.remaining;
    },

    /** Seconds left on the clock. */
    getRemaining() {
      return this.remaining;
    },

    // -- internal --------------------------------------------------

    _tick() {
      if (this.isPaused) return;
      if (this.remaining <= 0) {
        this._complete();
        return;
      }

      this.remaining--;
      const pct = (this.remaining / this.duration) * 100;

      updateTimerDisplay(this.remaining);
      updateTimerBar(pct);

      // Colour warnings
      const bar = document.querySelector('.timer-bar');
      if (bar) {
        bar.classList.remove('warning', 'critical');
        if (this.remaining <= 300) {          // 5 min — coral
          bar.classList.add('critical');
        } else if (this.remaining <= 600) {   // 10 min — amber
          bar.classList.add('warning');
        }
      }
    },

    _complete() {
      clearInterval(this.interval);
      this.interval = null;

      // Gather session stats for the overlay
      const stats = {
        elapsed: this.duration,
        errorRate: EidosErrorReframe.getErrorRate(),
        zpd: EidosErrorReframe.getZPDStatus(),
        flashcardsReviewed: EidosErrorReframe.totalAttempts,
        flashcardsCorrect: EidosErrorReframe.totalAttempts - EidosErrorReframe.errors,
        microRests: EidosMicroRest.count,
        microRestsSkipped: EidosMicroRest.skipped,
      };
      showOverlay(createSessionCompleteOverlay(stats), {
        id: 'eidos-session-complete',
        className: 'session-complete-overlay',
      });
    },
  };

  // --------------------------------------------------------
  //  2.  MICRO-REST SYSTEM
  // --------------------------------------------------------

  const EidosMicroRest = {
    minInterval: 90,       // seconds between rests (min)
    maxInterval: 180,      // seconds between rests (max)
    restDuration: 10,      // each rest lasts 10 s
    count: 0,
    skipped: 0,
    timeout: null,
    _paused: false,
    _countdownInterval: null,

    /** Kick off the micro-rest cycle. */
    start() {
      this.count = 0;
      this.skipped = 0;
      this._paused = false;
      this.scheduleNext();
    },

    /** Schedule the next micro-rest at a random interval. */
    scheduleNext() {
      clearTimeout(this.timeout);
      if (this._paused) return;
      const delay =
        (Math.random() * (this.maxInterval - this.minInterval) + this.minInterval) * 1000;
      this.timeout = setTimeout(() => this.trigger(), delay);
    },

    /** Show the micro-rest overlay with a 10-second ring countdown. */
    trigger() {
      if (this._paused) {
        this.scheduleNext();
        return;
      }

      // Pause the main timer during rest
      EidosTimer.pause();

      let secondsLeft = this.restDuration;
      const overlayId = 'eidos-micro-rest';

      showOverlay(createMicroRestOverlay(secondsLeft), {
        id: overlayId,
        className: 'micro-rest-overlay',
      });

      // Animate SVG ring
      const circle = document.getElementById('eidos-rest-ring');
      const counterEl = document.getElementById('eidos-rest-counter');
      const totalLen = circle ? parseFloat(circle.getAttribute('stroke-dasharray')) : 0;

      this._countdownInterval = setInterval(() => {
        secondsLeft--;
        if (counterEl) counterEl.textContent = secondsLeft;

        // Update ring offset
        if (circle && totalLen) {
          const offset = totalLen * (1 - secondsLeft / this.restDuration);
          circle.setAttribute('stroke-dashoffset', offset);
        }

        if (secondsLeft <= 0) {
          clearInterval(this._countdownInterval);
          this._countdownInterval = null;
          this.count++;
          hideOverlay(overlayId);
          EidosTimer.resume();
          this.scheduleNext();
        }
      }, 1000);

      // Wire up skip button
      const skipBtn = document.getElementById('eidos-rest-skip');
      if (skipBtn) {
        skipBtn.addEventListener('click', () => {
          clearInterval(this._countdownInterval);
          this._countdownInterval = null;
          this.skipped++;
          hideOverlay(overlayId);
          EidosTimer.resume();
          this.scheduleNext();
        });
      }
    },

    /** Pause scheduling (e.g. while user is typing in sandbox). */
    pause() {
      this._paused = true;
      clearTimeout(this.timeout);
    },

    /** Resume scheduling after pause. */
    resume() {
      this._paused = false;
      this.scheduleNext();
    },

    /** Return micro-rest statistics. */
    getStats() {
      return { count: this.count, skipped: this.skipped };
    },
  };

  // --------------------------------------------------------
  //  3.  ERROR REFRAMING SYSTEM
  // --------------------------------------------------------

  const EidosErrorReframe = {
    totalAttempts: 0,
    errors: 0,

    /** Record a correct answer. */
    recordCorrect() {
      this.totalAttempts++;
    },

    /** Record an error — show the neuroplasticity reframe card. */
    recordError() {
      this.totalAttempts++;
      this.errors++;
      this._showCard();
    },

    /** Current error rate as a percentage (0-100). */
    getErrorRate() {
      if (this.totalAttempts === 0) return 0;
      return Math.round((this.errors / this.totalAttempts) * 100);
    },

    /**
     * Zone of Proximal Development status.
     * Only meaningful after 5+ attempts.
     */
    getZPDStatus() {
      const rate = this.getErrorRate();
      if (this.totalAttempts < 5) {
        return { zone: 'insufficient', label: 'Gathering data…', color: '--text-dim' };
      }
      if (rate < 10) {
        return { zone: 'easy', label: 'Too Easy', color: '--text-dim' };
      }
      if (rate <= 25) {
        return { zone: 'optimal', label: 'Optimal ZPD', color: '--green' };
      }
      return { zone: 'hard', label: 'Scaffold Needed', color: '--accent' };
    },

    /** Full stats snapshot. */
    getStats() {
      return {
        totalAttempts: this.totalAttempts,
        errors: this.errors,
        errorRate: this.getErrorRate(),
        zpd: this.getZPDStatus(),
      };
    },

    // -- internal --------------------------------------------------

    _showCard() {
      const cardId = 'eidos-error-reframe';
      showOverlay(createErrorReframeCard(), {
        id: cardId,
        className: 'error-reframe',
      });

      // Click-to-dismiss
      const el = document.getElementById(cardId);
      if (el) {
        el.addEventListener('click', () => hideOverlay(cardId));
      }

      // Auto-dismiss after 2 seconds
      setTimeout(() => hideOverlay(cardId), 2000);
    },
  };

  // --------------------------------------------------------
  //  4.  SESSION MANAGER
  // --------------------------------------------------------

  const EidosSession = {
    current: null,

    /**
     * Start a new learning session.
     * @param {string} domain  e.g. 'md-yaml', 'html-basics'
     */
    start(domain) {
      this.current = {
        domain: domain,
        startTime: Date.now(),
      };

      // Reset per-session counters
      EidosErrorReframe.totalAttempts = 0;
      EidosErrorReframe.errors = 0;
      EidosMicroRest.count = 0;
      EidosMicroRest.skipped = 0;

      EidosTimer.reset();
      EidosTimer.start();
      EidosMicroRest.start();
    },

    /** End the current session and save to localStorage. */
    end() {
      if (!this.current) return;

      EidosTimer.reset();
      EidosMicroRest.pause();
      clearTimeout(EidosMicroRest.timeout);

      const duration = Math.round((Date.now() - this.current.startTime) / 1000);
      const errorStats = EidosErrorReframe.getStats();
      const restStats = EidosMicroRest.getStats();

      const record = {
        date: new Date().toISOString().slice(0, 10),  // YYYY-MM-DD
        domain: this.current.domain,
        duration: duration,
        flashcardsReviewed: errorStats.totalAttempts,
        flashcardsCorrect: errorStats.totalAttempts - errorStats.errors,
        challengesDone: 0,  // set by domain pages if needed
        errorRate: errorStats.errorRate,
        microRests: restStats.count,
        microRestsSkipped: restStats.skipped,
      };

      const sessions = this.load();
      sessions.push(record);
      this.save(sessions);

      this.current = null;
      return record;
    },

    /** Aggregate today's session records. */
    getTodayStats() {
      const today = new Date().toISOString().slice(0, 10);
      const sessions = this.load().filter((s) => s.date === today);

      const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
      const totalFlashcards = sessions.reduce((sum, s) => sum + s.flashcardsReviewed, 0);
      const totalErrors = sessions.reduce(
        (sum, s) => sum + Math.round((s.errorRate / 100) * s.flashcardsReviewed),
        0
      );
      const avgErrorRate =
        totalFlashcards > 0 ? Math.round((totalErrors / totalFlashcards) * 100) : 0;

      return {
        totalTime: totalTime,
        sessions: sessions.length,
        avgErrorRate: avgErrorRate,
        totalFlashcards: totalFlashcards,
        streak: this.getStreak(),
      };
    },

    /**
     * Return last 7 days of data for a progress chart.
     * Each entry: { date, totalTime, score, sessions }
     */
    getWeekHistory() {
      const all = this.load();
      const result = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const daySessions = all.filter((s) => s.date === dateStr);
        const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
        const totalCards = daySessions.reduce((sum, s) => sum + s.flashcardsReviewed, 0);
        const totalCorrect = daySessions.reduce((sum, s) => sum + (s.flashcardsCorrect || 0), 0);
        const score = totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0;

        result.push({
          date: dateStr,
          totalTime: totalTime,
          score: score,
          sessions: daySessions.length,
        });
      }
      return result;
    },

    /** Consecutive days (up to today) with at least 1 session. */
    getStreak() {
      const all = this.load();
      const dates = new Set(all.map((s) => s.date));
      let streak = 0;
      const d = new Date();

      while (true) {
        const dateStr = d.toISOString().slice(0, 10);
        if (dates.has(dateStr)) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    },

    /** Persist sessions array to localStorage. */
    save(sessions) {
      try {
        localStorage.setItem('eidos-sessions', JSON.stringify(sessions || []));
      } catch (e) {
        console.warn('[eidos] localStorage save failed:', e);
      }
    },

    /** Read sessions array from localStorage. */
    load() {
      try {
        return JSON.parse(localStorage.getItem('eidos-sessions') || '[]');
      } catch (e) {
        console.warn('[eidos] localStorage load failed:', e);
        return [];
      }
    },
  };

  // --------------------------------------------------------
  //  5.  DOM HELPERS
  // --------------------------------------------------------

  /**
   * Show a full-screen overlay.
   * @param {string}  html               Inner HTML content
   * @param {Object}  options
   * @param {string}  options.id          DOM id for the overlay wrapper
   * @param {string}  options.className   CSS class(es) for the overlay wrapper
   */
  function showOverlay(html, options = {}) {
    const id = options.id || 'eidos-overlay';

    // Remove existing overlay with the same id
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = id;
    if (options.className) el.className = options.className;
    el.innerHTML = html;
    document.body.appendChild(el);

    // Trigger reflow then add .visible for CSS transitions
    void el.offsetWidth;
    el.classList.add('visible');
  }

  /** Remove an overlay by id. */
  function hideOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('visible');
    // Wait for CSS transition before removing from DOM
    setTimeout(() => el.remove(), 350);
  }

  /**
   * Build the micro-rest overlay HTML.
   * Includes an SVG ring countdown.
   */
  function createMicroRestOverlay(seconds) {
    // SVG ring parameters
    const radius = 54;
    const circumference = 2 * Math.PI * radius;

    return `
      <div class="micro-rest-content">
        <div class="micro-rest-ring-wrapper">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="${radius}"
              fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6" />
            <circle id="eidos-rest-ring" cx="70" cy="70" r="${radius}"
              fill="none" stroke="var(--lavender, #b8a9e3)" stroke-width="6"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="0"
              stroke-linecap="round"
              transform="rotate(-90 70 70)" />
          </svg>
          <span id="eidos-rest-counter" class="micro-rest-counter">${seconds}</span>
        </div>

        <p class="micro-rest-heading">Close your eyes.</p>
        <p class="micro-rest-sub">Replay what you just learned.</p>

        <button id="eidos-rest-skip" class="micro-rest-skip" aria-label="Skip rest">
          skip
        </button>
      </div>`;
  }

  /** Build the error-reframe card HTML. */
  function createErrorReframeCard() {
    return `
      <div class="error-reframe-content">
        <span class="error-reframe-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.4 2 2 7.4 2 14s5.4 12 12 12 12-5.4 12-12S20.6 2 14 2z"
              fill="var(--accent, #a78bfa)" opacity="0.2"/>
            <text x="14" y="19" text-anchor="middle"
              font-size="16" fill="var(--accent, #a78bfa)">🧠</text>
          </svg>
        </span>
        <span class="error-reframe-label">Error detected</span>
        <p class="error-reframe-msg">Neuroplasticity activating — your brain is rewiring</p>
      </div>`;
  }

  /**
   * Build the session-complete overlay HTML.
   * @param {Object} stats  Session statistics
   */
  function createSessionCompleteOverlay(stats) {
    const mins = Math.floor(stats.elapsed / 60);
    const zpd = stats.zpd || {};

    return `
      <div class="session-complete-content">
        <h2 class="session-complete-title">Session Complete</h2>
        <p class="session-complete-sub">Great focus work.</p>

        <div class="session-complete-grid">
          <div class="session-stat">
            <span class="session-stat-value">${mins}</span>
            <span class="session-stat-label">minutes</span>
          </div>
          <div class="session-stat">
            <span class="session-stat-value">${stats.flashcardsReviewed || 0}</span>
            <span class="session-stat-label">reviewed</span>
          </div>
          <div class="session-stat">
            <span class="session-stat-value">${stats.errorRate || 0}%</span>
            <span class="session-stat-label">error rate</span>
          </div>
          <div class="session-stat">
            <span class="session-stat-value">${stats.microRests || 0}</span>
            <span class="session-stat-label">micro-rests</span>
          </div>
        </div>

        <div class="session-zpd" style="color: var(${zpd.color || '--text'})">
          ${zpd.label || ''}
        </div>

        <button class="session-complete-btn" onclick="
          document.getElementById('eidos-session-complete')?.classList.remove('visible');
          setTimeout(function(){ document.getElementById('eidos-session-complete')?.remove(); }, 350);
        ">Done</button>
      </div>`;
  }

  /**
   * Update the nav timer text.
   * @param {number} seconds  Remaining seconds
   */
  function updateTimerDisplay(seconds) {
    const el = document.querySelector('.nav-timer');
    if (!el) return;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  /**
   * Update the timer bar width with smooth animation.
   * @param {number} percentage  0-100
   */
  function updateTimerBar(percentage) {
    const bar = document.querySelector('.timer-bar');
    if (!bar) return;
    requestAnimationFrame(() => {
      bar.style.width = percentage + '%';
    });
  }

  /**
   * Update the streak badge in the nav.
   * @param {number} days  Consecutive days
   */
  function updateStreakBadge(days) {
    const el = document.querySelector('.streak-badge');
    if (!el) return;
    el.textContent = days > 0 ? days + 'd streak' : '';
    el.style.display = days > 0 ? '' : 'none';
  }

  // --------------------------------------------------------
  //  EXPORT on window.Eidos
  // --------------------------------------------------------

  window.Eidos = {
    Timer: EidosTimer,
    MicroRest: EidosMicroRest,
    ErrorReframe: EidosErrorReframe,
    Session: EidosSession,

    // DOM helpers (exposed for domain pages)
    showOverlay: showOverlay,
    hideOverlay: hideOverlay,
    createMicroRestOverlay: createMicroRestOverlay,
    createErrorReframeCard: createErrorReframeCard,
    createSessionCompleteOverlay: createSessionCompleteOverlay,
    updateTimerDisplay: updateTimerDisplay,
    updateTimerBar: updateTimerBar,
    updateStreakBadge: updateStreakBadge,
  };
})();
