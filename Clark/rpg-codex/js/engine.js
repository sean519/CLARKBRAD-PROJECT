(function () {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const normalize = (x, y) => {
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  };
  const circleHit = (a, b) => distance(a, b) < (a.radius || 0) + (b.radius || 0);
  const circleRectHit = (circle, rect) => {
    const x = clamp(circle.x, rect.x, rect.x + rect.w);
    const y = clamp(circle.y, rect.y, rect.y + rect.h);
    return Math.hypot(circle.x - x, circle.y - y) < circle.radius;
  };

  class Input {
    constructor() {
      this.down = new Set();
      this.pressed = new Set();
      this.released = new Set();
      this.touchVector = { x: 0, y: 0 };
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("keyup", this.onKeyUp);
      window.addEventListener("blur", () => this.clear());
      document.addEventListener("visibilitychange", () => { if (document.hidden) this.clear(); });
    }

    onKeyDown(event) {
      const code = event.code;
      const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyJ", "KeyK", "KeyQ", "KeyE", "KeyR", "KeyZ", "KeyX", "ShiftLeft", "ShiftRight", "Digit1", "Digit2", "Digit3", "Digit4", "Enter", "Escape", "KeyP"];
      if (gameKeys.includes(code) && !["INPUT", "TEXTAREA", "BUTTON"].includes(document.activeElement?.tagName)) event.preventDefault();
      if (!this.down.has(code)) this.pressed.add(code);
      this.down.add(code);
    }

    onKeyUp(event) {
      this.down.delete(event.code);
      this.released.add(event.code);
    }

    isDown(...codes) { return codes.some(code => this.down.has(code)); }
    wasPressed(...codes) { return codes.some(code => this.pressed.has(code)); }
    consume(...codes) {
      const hit = codes.some(code => this.pressed.has(code));
      codes.forEach(code => this.pressed.delete(code));
      return hit;
    }
    consumeReleased(...codes) {
      const hit = codes.some(code => this.released.has(code));
      codes.forEach(code => this.released.delete(code));
      return hit;
    }
    movement() {
      let x = this.touchVector.x;
      let y = this.touchVector.y;
      if (this.isDown("ArrowLeft", "KeyA")) x -= 1;
      if (this.isDown("ArrowRight", "KeyD")) x += 1;
      if (this.isDown("ArrowUp", "KeyW")) y -= 1;
      if (this.isDown("ArrowDown", "KeyS")) y += 1;
      if (Math.abs(x) + Math.abs(y) < .05) return { x: 0, y: 0 };
      return normalize(x, y);
    }
    endFrame() { this.pressed.clear(); this.released.clear(); }
    clear() { this.down.clear(); this.pressed.clear(); this.released.clear(); this.touchVector = { x: 0, y: 0 }; }
  }

  class Sound {
    constructor() {
      this.context = null;
      this.muted = false;
    }
    unlock() {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.context = new AudioContext();
      }
      if (this.context?.state === "suspended") this.context.resume();
    }
    tone(frequency = 440, duration = .08, type = "sine", volume = .04, slide = 0, delay = 0) {
      if (this.muted) return;
      this.unlock();
      if (!this.context) return;
      const now = this.context.currentTime + delay;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.linearRampToValueAtTime(Math.max(30, frequency + slide), now + duration);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    }
    play(name) {
      const sounds = {
        click: [320, .04, "square", .025, 80],
        attack: [150, .08, "sawtooth", .035, 130],
        bolt: [610, .1, "triangle", .035, -180],
        boom: [88, .22, "sawtooth", .065, -50],
        portal: [210, .35, "sine", .045, 520],
        pickup: [620, .13, "sine", .04, 300],
        success: [430, .18, "triangle", .04, 300],
        hurt: [105, .14, "square", .05, -45],
        shield: [350, .18, "sine", .035, 260],
        leafHit: [[230, .055, "triangle", .035, 210, 0], [720, .035, "sine", .018, -120, .018]],
        hammerHit: [[78, .2, "sawtooth", .075, -38, 0], [165, .08, "square", .025, -90, .025]],
        criticalHit: [[260, .09, "triangle", .045, 360, 0], [920, .08, "sine", .03, -180, .045]],
        perfectDodge: [[760, .11, "sine", .035, 340, 0], [1180, .08, "triangle", .02, -120, .055]],
        counter: [[125, .14, "sawtooth", .06, 180, 0], [820, .13, "triangle", .045, 380, .035]],
        bossDown: [[92, .34, "sawtooth", .075, -48, 0], [360, .28, "triangle", .04, -220, .08]],
        note1: [262, .18, "sine", .04, 0],
        note2: [330, .18, "sine", .04, 0],
        note3: [392, .18, "sine", .04, 0],
        note4: [523, .18, "sine", .04, 0]
      };
      const spec = sounds[name] || sounds.click;
      if (Array.isArray(spec[0])) spec.forEach(layer => this.tone(...layer));
      else this.tone(...spec);
    }
  }

  class SaveStore {
    constructor(key) { this.key = key; }
    defaults() {
      return {
        version: 1,
        chapter: 1,
        unlockedChapter: 1,
        completed: [],
        memories: [],
        defeated: {},
        scanned: [],
        level: 1,
        xp: 0,
        maxHealth: 6,
        maxEnergy: 100,
        weapon: "leafblade",
        weaponTraits: { leafblade: null, hammer: null },
        weaponUpgrades: { leafblade: 0, hammer: 0 },
        materials: { gel: 0, shard: 0, fiber: 0, crystal: 0 },
        muted: false
      };
    }
    load() {
      try {
        const parsed = JSON.parse(localStorage.getItem(this.key));
        if (!parsed || parsed.version !== 1) return this.defaults();
        const base = this.defaults();
        const loaded = { ...base, ...parsed };
        loaded.chapter = clamp(Number(loaded.chapter) || 1, 1, 7);
        loaded.unlockedChapter = clamp(Number(loaded.unlockedChapter) || 1, 1, 7);
        loaded.level = clamp(Number(loaded.level) || 1, 1, 10);
        loaded.xp = Math.max(0, Number(loaded.xp) || 0);
        loaded.maxHealth = clamp(Number(loaded.maxHealth) || 6, 6, 12);
        loaded.maxEnergy = clamp(Number(loaded.maxEnergy) || 100, 100, 160);
        loaded.weapon = ["leafblade", "hammer"].includes(loaded.weapon) ? loaded.weapon : "leafblade";
        loaded.weaponTraits = loaded.weaponTraits && typeof loaded.weaponTraits === "object" ? loaded.weaponTraits : { leafblade: null, hammer: null };
        loaded.weaponTraits.leafblade = typeof loaded.weaponTraits.leafblade === "string" ? loaded.weaponTraits.leafblade : null;
        loaded.weaponTraits.hammer = typeof loaded.weaponTraits.hammer === "string" ? loaded.weaponTraits.hammer : null;
        loaded.weaponUpgrades = loaded.weaponUpgrades && typeof loaded.weaponUpgrades === "object" ? loaded.weaponUpgrades : { leafblade: 0, hammer: 0 };
        loaded.weaponUpgrades.leafblade = clamp(Math.floor(Number(loaded.weaponUpgrades.leafblade) || 0), 0, 3);
        loaded.weaponUpgrades.hammer = clamp(Math.floor(Number(loaded.weaponUpgrades.hammer) || 0), 0, 3);
        loaded.materials = loaded.materials && typeof loaded.materials === "object" ? loaded.materials : { gel: 0, shard: 0, fiber: 0, crystal: 0 };
        ["gel", "shard", "fiber", "crystal", "moss", "amber", "prism", "cog", "silk", "void", "vine", "wing", "page"].forEach(key => { loaded.materials[key] = Math.max(0, Math.floor(Number(loaded.materials[key]) || 0)); });
        loaded.completed = Array.isArray(loaded.completed) ? loaded.completed.filter(Number.isFinite) : [];
        loaded.memories = Array.isArray(loaded.memories) ? loaded.memories.filter(value => typeof value === "string") : [];
        loaded.defeated = loaded.defeated && typeof loaded.defeated === "object" ? loaded.defeated : {};
        loaded.scanned = Array.isArray(loaded.scanned) ? loaded.scanned.filter(value => typeof value === "string") : [];
        loaded.muted = Boolean(loaded.muted);
        return loaded;
      } catch (_) {
        return this.defaults();
      }
    }
    save(data) {
      try {
        const previous = localStorage.getItem(this.key);
        if (previous) localStorage.setItem(`${this.key}-backup`, previous);
        localStorage.setItem(this.key, JSON.stringify(data));
        return true;
      }
      catch (_) { return false; }
    }
    hasBackup() {
      try { return Boolean(localStorage.getItem(`${this.key}-protected`) || localStorage.getItem(`${this.key}-backup`)); }
      catch (_) { return false; }
    }
    restoreBackup(current) {
      try {
        const protectedKey = `${this.key}-protected`;
        const backupKey = localStorage.getItem(protectedKey) ? protectedKey : `${this.key}-backup`;
        const backup = localStorage.getItem(backupKey);
        if (!backup) return null;
        localStorage.setItem(backupKey, JSON.stringify(current));
        localStorage.setItem(this.key, backup);
        return this.load();
      } catch (_) { return null; }
    }
    reset(current) {
      try { if (current) localStorage.setItem(`${this.key}-protected`, JSON.stringify(current)); } catch (_) { /* storage can be unavailable */ }
      try { localStorage.removeItem(this.key); } catch (_) { /* storage can be unavailable */ }
      return this.defaults();
    }
  }

  class ParticleField {
    constructor() { this.items = []; }
    burst(x, y, color, count = 10, force = 170) {
      const available = Math.max(0, 260 - this.items.length);
      for (let i = 0; i < Math.min(count, available); i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = force * (.3 + Math.random() * .7);
        this.items.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: .35 + Math.random() * .45, maxLife: .8,
          radius: 2 + Math.random() * 5, color
        });
      }
    }
    update(delta) {
      this.items.forEach(item => {
        item.x += item.vx * delta;
        item.y += item.vy * delta;
        item.vx *= .97;
        item.vy *= .97;
        item.life -= delta;
      });
      this.items = this.items.filter(item => item.life > 0);
    }
    draw(context) {
      context.save();
      this.items.forEach(item => {
        context.globalAlpha = clamp(item.life / item.maxLife, 0, 1);
        context.fillStyle = item.color;
        context.beginPath();
        context.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    }
  }

  window.PortalboundEngine = Object.freeze({
    clamp, lerp, distance, normalize, circleHit, circleRectHit,
    Input, Sound, SaveStore, ParticleField
  });
}());
