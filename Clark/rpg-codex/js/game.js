(function () {
  "use strict";

  const Data = window.PortalboundData;
  const Engine = window.PortalboundEngine;
  if (!Data || !Engine) throw new Error("Portalbound data or engine failed to load.");

  const { clamp, lerp, distance, normalize, circleHit, circleRectHit, Input, Sound, SaveStore, ParticleField } = Engine;
  const WORLD_WIDTH = 1280;
  const WORLD_HEIGHT = 720;
  const SAVE_KEY = "clark-portalbound-codex-save-v1";

  const dom = {
    menuScreen: document.querySelector("#menuScreen"),
    gameScreen: document.querySelector("#gameScreen"),
    continueButton: document.querySelector("#continueButton"),
    newGameButton: document.querySelector("#newGameButton"),
    chaptersButton: document.querySelector("#chaptersButton"),
    howButton: document.querySelector("#howButton"),
    canvas: document.querySelector("#gameCanvas"),
    stage: document.querySelector("#stage"),
    hearts: document.querySelector("#hearts"),
    energyBar: document.querySelector("#energyBar"),
    levelReadout: document.querySelector("#levelReadout"),
    chapterReadout: document.querySelector("#chapterReadout"),
    objectiveReadout: document.querySelector("#objectiveReadout"),
    memoryReadout: document.querySelector("#memoryReadout"),
    soundButton: document.querySelector("#soundButton"),
    pauseButton: document.querySelector("#pauseButton"),
    comicWord: document.querySelector("#comicWord"),
    interactionPrompt: document.querySelector("#interactionPrompt"),
    saveToast: document.querySelector("#saveToast"),
    bossBar: document.querySelector("#bossBar"),
    bossName: document.querySelector("#bossName"),
    bossHealth: document.querySelector("#bossHealth"),
    storyOverlay: document.querySelector("#storyOverlay"),
    storyImage: document.querySelector("#storyImage"),
    storyEyebrow: document.querySelector("#storyEyebrow"),
    storyTitle: document.querySelector("#storyTitle"),
    storyText: document.querySelector("#storyText"),
    storyReward: document.querySelector("#storyReward"),
    storyContinue: document.querySelector("#storyContinue"),
    dialogueOverlay: document.querySelector("#dialogueOverlay"),
    speakerPortrait: document.querySelector("#speakerPortrait"),
    speakerName: document.querySelector("#speakerName"),
    dialogueText: document.querySelector("#dialogueText"),
    pauseOverlay: document.querySelector("#pauseOverlay"),
    pauseStats: document.querySelector("#pauseStats"),
    resumeButton: document.querySelector("#resumeButton"),
    restartButton: document.querySelector("#restartButton"),
    menuButton: document.querySelector("#menuButton"),
    chapterOverlay: document.querySelector("#chapterOverlay"),
    chapterGrid: document.querySelector("#chapterGrid"),
    closeChapters: document.querySelector("#closeChapters"),
    howOverlay: document.querySelector("#howOverlay"),
    closeHow: document.querySelector("#closeHow"),
    endingOverlay: document.querySelector("#endingOverlay"),
    endingChapters: document.querySelector("#endingChapters"),
    endingMenu: document.querySelector("#endingMenu"),
    companionButton: document.querySelector("#companionButton"),
    companionCooldown: document.querySelector("#companionCooldown"),
    weaponButton: document.querySelector("#weaponButton"),
    weaponIcon: document.querySelector("#weaponIcon"),
    weaponName: document.querySelector("#weaponName"),
    weaponRank: document.querySelector("#weaponRank"),
    abilityButtons: [...document.querySelectorAll("[data-ability]")],
    touchStick: document.querySelector("#touchStick"),
    touchStickKnob: document.querySelector("#touchStick span"),
    touchAttack: document.querySelector("#touchAttack"),
    touchWeapon: document.querySelector("#touchWeapon"),
    touchDash: document.querySelector("#touchDash"),
    touchInteract: document.querySelector("#touchInteract"),
    touchCompanion: document.querySelector("#touchCompanion"),
    liveRegion: document.querySelector("#liveRegion")
  };

  const context = dom.canvas.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const art = {
    backgrounds: [null,
      Object.assign(new Image(), { src: "assets/chapter1/meadow.webp" }),
      Object.assign(new Image(), { src: "assets/chapters/chapter-02.webp" }),
      Object.assign(new Image(), { src: "assets/chapters/chapter-03.webp" }),
      Object.assign(new Image(), { src: "assets/chapters/chapter-04.webp" }),
      Object.assign(new Image(), { src: "assets/chapters/chapter-05.webp" }),
      Object.assign(new Image(), { src: "assets/chapters/chapter-06.webp" }),
      Object.assign(new Image(), { src: "assets/chapters/chapter-07.webp" })
    ],
    clark: Object.assign(new Image(), { src: "assets/chapter1/clark.webp" }),
    piMonster: Object.assign(new Image(), { src: "assets/chapter1/pi-monster.webp" }),
    leafblade: Object.assign(new Image(), { src: "assets/chapter1/leafblade.webp" }),
    cometHammer: Object.assign(new Image(), { src: "assets/weapons/comet-hammer.webp" })
  };
  const WEAPONS = {
    leafblade: { name: "Portal Leafblade", shortName: "Leafblade", icon: "⚔", unlockChapter: 1 },
    hammer: { name: "Comet Hammer", shortName: "Comet Hammer", icon: "◆", unlockChapter: 3 }
  };
  const WEAPON_ORDER = ["leafblade", "hammer"];
  const ROMAN_RANKS = ["I", "II", "III", "IV"];
  const input = new Input();
  const sound = new Sound();
  const store = new SaveStore(SAVE_KEY);
  const particles = new ParticleField();
  let save = store.load();
  sound.muted = save.muted;

  const game = {
    mode: "menu",
    chapterIndex: 0,
    chapter: Data.chapters[0],
    phase: "puzzle",
    puzzleProgress: 0,
    activeTargets: new Set(),
    brokenTargets: new Map(),
    puzzleSolved: false,
    portalActive: false,
    sceneTime: 0,
    timeLeft: null,
    shake: 0,
    flash: 0,
    messageTimer: 0,
    storyAction: null,
    dialogueQueue: [],
    dialogueDone: null,
    nearestInteraction: null,
    attacks: [],
    projectiles: [],
    enemyProjectiles: [],
    memoryObjects: [],
    obstacles: [],
    boss: null,
    block: null,
    camera: { x: 640, y: 360 },
    viewport: { width: 1280, height: 720, scale: 1, offsetX: 0, offsetY: 0, dpr: 1 },
    lastFrame: performance.now()
  };

  const player = {
    x: 120, y: 360, radius: 23,
    health: save.maxHealth, maxHealth: save.maxHealth,
    energy: save.maxEnergy, maxEnergy: save.maxEnergy,
    speed: 245, facing: { x: 1, y: 0 },
    invulnerable: 0, attackCooldown: 0, dashCooldown: 0, dashTime: 0,
    shieldTime: 0, selectedAbility: "fist", moving: false, walkCycle: 0,
    weapon: "leafblade", comboStep: 0, comboTimer: 0, attackKind: "leafblade",
    attackTime: 0, attackDuration: .3, attackDirection: { x: 1, y: 0 }
  };

  const bradley = { x: 80, y: 390, radius: 20, cooldown: 0, facing: { x: 1, y: 0 } };
  const bird = { x: 70, y: 320, angle: 0 };
  const guardian = { x: 55, y: 275, angle: 0 };

  function announce(text) {
    dom.liveRegion.textContent = "";
    requestAnimationFrame(() => { dom.liveRegion.textContent = text; });
  }

  function switchScreen(screen) {
    dom.menuScreen.classList.toggle("is-active", screen === "menu");
    dom.gameScreen.classList.toggle("is-active", screen === "game");
  }

  function showComicWord(word, color = "#ffd34f") {
    const viewport = game.viewport;
    const screenX = viewport.width / 2 + (player.x - game.camera.x) * viewport.scale;
    const screenY = viewport.height / 2 + (player.y - game.camera.y - 78) * viewport.scale;
    dom.comicWord.textContent = word;
    dom.comicWord.style.color = color;
    dom.comicWord.style.left = `${clamp(screenX, 75, viewport.width - 75)}px`;
    dom.comicWord.style.top = `${clamp(screenY, 55, viewport.height - 70)}px`;
    dom.comicWord.classList.remove("is-showing");
    void dom.comicWord.offsetWidth;
    dom.comicWord.classList.add("is-showing");
  }

  function showSaved() {
    dom.saveToast.classList.add("is-showing");
    clearTimeout(showSaved.timer);
    showSaved.timer = setTimeout(() => dom.saveToast.classList.remove("is-showing"), 1200);
  }

  function persist(show = true) {
    save.muted = sound.muted;
    if (store.save(save) && show) showSaved();
    updateMenu();
  }

  function updateMenu() {
    const hasProgress = save.completed.length > 0 || save.memories.length > 0 || save.chapter > 1;
    dom.continueButton.hidden = !hasProgress;
    dom.continueButton.textContent = hasProgress ? `Continue · Chapter ${save.chapter}` : "Continue Adventure";
    dom.soundButton.textContent = sound.muted ? "×" : "♪";
    dom.soundButton.setAttribute("aria-label", sound.muted ? "Turn sound on" : "Mute sound");
    buildChapterGrid();
  }

  function gainExperience(amount) {
    save.xp += amount;
    const needed = save.level * 120;
    if (save.xp >= needed && save.level < 10) {
      save.xp -= needed;
      save.level += 1;
      if (save.level % 2 === 0) {
        save.maxHealth = Math.min(12, save.maxHealth + 1);
        player.maxHealth = save.maxHealth;
        player.health = player.maxHealth;
      } else {
        save.maxEnergy = Math.min(160, save.maxEnergy + 10);
        player.maxEnergy = save.maxEnergy;
        player.energy = player.maxEnergy;
      }
      showComicWord("LEVEL UP!", "#8ce568");
      sound.play("success");
      announce(`Level up. Clark is now level ${save.level}.`);
    }
    persist(false);
  }

  function chapterMemoryKey(chapterId, index) { return `${chapterId}:${index}`; }

  function createMemoryObjects(chapter) {
    game.memoryObjects = chapter.memories.map((memory, index) => ({
      ...memory,
      radius: 16,
      index,
      collected: save.memories.includes(chapterMemoryKey(chapter.id, index))
    }));
  }

  function chapterObstacles(chapter) {
    const common = [
      { x: 0, y: 0, w: WORLD_WIDTH, h: 34 },
      { x: 0, y: WORLD_HEIGHT - 34, w: WORLD_WIDTH, h: 34 },
      { x: 0, y: 0, w: 34, h: WORLD_HEIGHT },
      { x: WORLD_WIDTH - 34, y: 0, w: 34, h: WORLD_HEIGHT }
    ];
    // The painted scenes keep their playable arena clear; only the world borders collide.
    const specific = {};
    return common.concat(specific[chapter.environment] || []);
  }

  function resetChapterState(chapterId) {
    game.chapterIndex = clamp(chapterId - 1, 0, Data.chapters.length - 1);
    game.chapter = Data.chapters[game.chapterIndex];
    game.phase = "puzzle";
    game.puzzleProgress = 0;
    game.activeTargets = new Set();
    game.brokenTargets = new Map();
    game.puzzleSolved = false;
    game.portalActive = false;
    game.sceneTime = 0;
    game.timeLeft = game.chapter.timed || null;
    game.attacks = [];
    game.projectiles = [];
    game.enemyProjectiles = [];
    game.boss = null;
    game.obstacles = chapterObstacles(game.chapter);
    game.block = game.chapter.puzzle.type === "push"
      ? { ...game.chapter.puzzle.block, radius: 32, goal: game.chapter.puzzle.goal }
      : null;
    createMemoryObjects(game.chapter);
    player.x = game.chapter.start.x;
    player.y = game.chapter.start.y;
    game.camera.x = player.x;
    game.camera.y = player.y;
    player.health = player.maxHealth = save.maxHealth;
    player.energy = player.maxEnergy = save.maxEnergy;
    player.facing = { x: 1, y: 0 };
    player.invulnerable = 0;
    player.attackCooldown = 0;
    player.attackTime = 0;
    player.attackDirection = { x: 1, y: 0 };
    player.comboStep = 0;
    player.comboTimer = 0;
    if (save.unlockedChapter < WEAPONS[player.weapon].unlockChapter) player.weapon = "leafblade";
    player.dashCooldown = 0;
    player.dashTime = 0;
    player.shieldTime = 0;
    player.walkCycle = 0;
    bradley.x = player.x - 45;
    bradley.y = player.y + 35;
    bradley.cooldown = 0;
    bird.x = player.x - 50;
    bird.y = player.y - 35;
    guardian.x = player.x - 75;
    guardian.y = player.y - 65;
    setObjective(game.chapter.objective);
    updateAbilityLocks();
    updateHud();
  }

  function startChapter(chapterId, showStory = true) {
    const safeId = clamp(chapterId, 1, save.unlockedChapter);
    save.chapter = safeId;
    resetChapterState(safeId);
    switchScreen("game");
    resizeCanvas();
    if (showStory) showChapterStory();
    else {
      game.mode = "playing";
      showDialogue(game.chapter.dialogue);
    }
    persist(false);
  }

  function showChapterStory() {
    const chapter = game.chapter;
    game.mode = "story";
    dom.storyEyebrow.textContent = `Chapter ${chapter.id} of 7`;
    dom.storyTitle.textContent = chapter.title;
    dom.storyText.textContent = chapter.intro;
    dom.storyReward.textContent = chapter.reward;
    dom.storyImage.src = `../comic/assets/comic-web-640/page-${String(chapter.page).padStart(2, "0")}.webp`;
    dom.storyContinue.textContent = "Enter Chapter";
    dom.storyOverlay.hidden = false;
    game.storyAction = () => {
      dom.storyOverlay.hidden = true;
      game.mode = "playing";
      showDialogue(chapter.dialogue);
    };
    dom.storyContinue.focus();
  }

  function showChapterComplete() {
    const chapter = game.chapter;
    game.mode = "story";
    dom.storyEyebrow.textContent = `Chapter ${chapter.id} complete`;
    dom.storyTitle.textContent = chapter.id === 7 ? "The Leaf Key" : "Portal Restored!";
    dom.storyText.textContent = chapter.id === 7
      ? "Every friend brought one part of the answer. Beyond the final gate, the nature city is alive again—and a magical book is waiting."
      : `${chapter.title} is complete. The next portal has awakened.`;
    dom.storyReward.textContent = chapter.reward;
    dom.storyImage.src = `../comic/assets/comic-web-640/page-${String(Math.min(68, chapter.page + 9)).padStart(2, "0")}.webp`;
    dom.storyContinue.textContent = chapter.id === 7 ? "Open the Book" : "Next Chapter";
    dom.storyOverlay.hidden = false;
    game.storyAction = () => {
      dom.storyOverlay.hidden = true;
      if (chapter.id === 7) showEnding();
      else startChapter(chapter.id + 1, true);
    };
    dom.storyContinue.focus();
  }

  function showDialogue(lines, onDone) {
    game.dialogueQueue = [...lines];
    game.dialogueDone = onDone || null;
    game.mode = "dialogue";
    dom.dialogueOverlay.hidden = false;
    advanceDialogue();
  }

  function advanceDialogue() {
    const next = game.dialogueQueue.shift();
    if (!next) {
      dom.dialogueOverlay.hidden = true;
      game.mode = "playing";
      const done = game.dialogueDone;
      game.dialogueDone = null;
      if (done) done();
      return;
    }
    const [speaker, text] = next;
    dom.speakerName.textContent = speaker;
    dom.dialogueText.textContent = text;
    const portraitColors = { Clark: "#fff", Bradley: "#ff9f1c", Bird: "#d5b66a", "Portal Guardian": "#11142e", Prisoner: "#62bfff" };
    dom.speakerPortrait.style.background = portraitColors[speaker] || "#fff";
    sound.play("click");
    announce(`${speaker}: ${text}`);
  }

  function showEnding() {
    game.mode = "ending";
    dom.endingOverlay.hidden = false;
    dom.endingChapters.focus();
    sound.play("portal");
  }

  function setObjective(text) {
    dom.objectiveReadout.textContent = text;
    announce(`New objective: ${text}`);
  }

  function updateAbilityLocks() {
    dom.abilityButtons.forEach(button => {
      const unlockChapter = Data.abilityUnlocks[button.dataset.ability] || 1;
      const locked = game.chapter.id < unlockChapter;
      button.classList.toggle("is-locked", locked);
      button.disabled = locked;
      if (locked && player.selectedAbility === button.dataset.ability) player.selectedAbility = "fist";
    });
    dom.companionButton.disabled = game.chapter.id < 2;
    dom.companionButton.classList.toggle("is-locked", game.chapter.id < 2);
    selectAbility(player.selectedAbility);
  }

  function selectAbility(name) {
    const unlock = Data.abilityUnlocks[name] || 1;
    if (game.chapter.id < unlock) return;
    player.selectedAbility = name;
    dom.abilityButtons.forEach(button => button.classList.toggle("is-active", button.dataset.ability === name));
    announce(`${name === "fist" ? WEAPONS[player.weapon].name : name.replace(/^./, character => character.toUpperCase())} selected.`);
  }

  function weaponRank() {
    return Math.min(4, 1 + Math.floor(save.memories.length / 5));
  }

  function cycleWeapon() {
    const currentIndex = WEAPON_ORDER.indexOf(player.weapon);
    const candidates = WEAPON_ORDER.filter(key => save.unlockedChapter >= WEAPONS[key].unlockChapter);
    if (candidates.length < 2) {
      selectAbility("fist");
      showComicWord("LOCKED!", "#ffd34f");
      announce("The Comet Hammer unlocks after completing Chapter 2.");
      return;
    }
    const next = WEAPON_ORDER[(currentIndex + 1) % WEAPON_ORDER.length];
    player.weapon = next;
    player.comboStep = 0;
    player.comboTimer = 0;
    player.attackCooldown = Math.min(player.attackCooldown, .12);
    selectAbility("fist");
    updateWeaponHud();
    sound.play("click");
    showComicWord(next === "hammer" ? "HEAVY!" : "QUICK!", next === "hammer" ? "#ff9f1c" : "#b7ff9b");
  }

  function updateWeaponHud() {
    const weapon = WEAPONS[player.weapon];
    const rank = weaponRank();
    dom.weaponIcon.textContent = weapon.icon;
    dom.weaponName.textContent = weapon.shortName;
    dom.weaponRank.textContent = `Rank ${ROMAN_RANKS[rank - 1]} · R switch`;
    dom.weaponButton.title = `${weapon.name}, Rank ${ROMAN_RANKS[rank - 1]}. Press R or click again to switch.`;
    dom.touchAttack.textContent = weapon.icon;
    dom.touchAttack.setAttribute("aria-label", `Attack with ${weapon.name}`);
    dom.touchWeapon.hidden = save.unlockedChapter < WEAPONS.hammer.unlockChapter;
  }

  function updateHud() {
    dom.hearts.innerHTML = Array.from({ length: player.maxHealth }, (_, index) => `<span class="heart ${index >= player.health ? "is-empty" : ""}">♥</span>`).join("");
    dom.energyBar.style.width = `${clamp(player.energy / player.maxEnergy * 100, 0, 100)}%`;
    dom.levelReadout.textContent = save.level;
    dom.chapterReadout.textContent = `Chapter ${game.chapter.id}`;
    dom.memoryReadout.textContent = `${save.memories.length}/21`;
    updateWeaponHud();
    const cooldownPercent = bradley.cooldown > 0 ? bradley.cooldown / 6 * 100 : 0;
    dom.companionCooldown.style.width = `${cooldownPercent}%`;
    if (game.boss?.active) {
      dom.bossBar.hidden = false;
      dom.bossName.textContent = game.boss.name;
      dom.bossHealth.style.width = `${clamp(game.boss.hp / game.boss.maxHp * 100, 0, 100)}%`;
    } else dom.bossBar.hidden = true;
  }

  function canMoveTo(x, y, radius = player.radius, ignoreBlock = false) {
    const circle = { x, y, radius };
    if (game.obstacles.some(rect => circleRectHit(circle, rect))) return false;
    if (!ignoreBlock && game.block && distance(circle, game.block) < radius + game.block.radius - 3) return false;
    return true;
  }

  function moveCircle(entity, dx, dy, ignoreBlock = false) {
    if (canMoveTo(entity.x + dx, entity.y, entity.radius, ignoreBlock)) entity.x += dx;
    if (canMoveTo(entity.x, entity.y + dy, entity.radius, ignoreBlock)) entity.y += dy;
  }

  function tryPushBlock(dx, dy) {
    if (!game.block || distance(player, game.block) > player.radius + game.block.radius + 7) return false;
    const direction = normalize(dx, dy);
    const next = { x: game.block.x + direction.x * 2.8, y: game.block.y + direction.y * 2.8, radius: game.block.radius };
    if (next.x < 70 || next.x > WORLD_WIDTH - 70 || next.y < 70 || next.y > WORLD_HEIGHT - 70) return false;
    if (game.obstacles.some(rect => circleRectHit(next, rect))) return false;
    game.block.x = next.x;
    game.block.y = next.y;
    if (distance(game.block, game.block.goal) < 42 && !game.puzzleSolved) solvePuzzle();
    return true;
  }

  function updatePlayer(delta) {
    player.invulnerable = Math.max(0, player.invulnerable - delta);
    player.attackCooldown = Math.max(0, player.attackCooldown - delta);
    player.attackTime = Math.max(0, player.attackTime - delta);
    player.comboTimer = Math.max(0, player.comboTimer - delta);
    if (player.comboTimer === 0) player.comboStep = 0;
    player.dashCooldown = Math.max(0, player.dashCooldown - delta);
    player.dashTime = Math.max(0, player.dashTime - delta);
    player.shieldTime = Math.max(0, player.shieldTime - delta);
    player.energy = Math.min(player.maxEnergy, player.energy + 11 * delta);
    const movement = input.movement();
    player.moving = Math.abs(movement.x) + Math.abs(movement.y) > .05;
    if (player.moving) player.facing = movement;
    let speed = player.speed;
    if (player.dashTime > 0) speed = 670;
    const dx = movement.x * speed * delta;
    const dy = movement.y * speed * delta;
    if (player.moving) player.walkCycle += delta * 3.35 * (speed / player.speed);
    const pushedBlock = game.block && player.moving && distance(player, game.block) < player.radius + game.block.radius + 7
      ? tryPushBlock(dx, dy)
      : false;
    moveCircle(player, dx, dy, pushedBlock);

    if (input.consume("Digit1")) selectAbility("fist");
    if (input.consume("Digit2")) selectAbility("bolt");
    if (input.consume("Digit3")) selectAbility("dash");
    if (input.consume("Digit4")) selectAbility("shield");
    if (input.consume("KeyR")) cycleWeapon();
    if (input.consume("ShiftLeft", "ShiftRight")) useDash();
    if (input.consume("Space", "KeyJ", "KeyK")) useSelectedAbility();
    if (input.consume("KeyQ")) useCompanion();
    if (input.consume("KeyE", "Enter")) interact();

    game.memoryObjects.forEach(memory => {
      if (!memory.collected && distance(player, memory) < 34) collectMemory(memory);
    });
  }

  function useDash() {
    if (game.chapter.id < 3 || player.dashCooldown > 0 || player.energy < 12) return;
    player.energy -= 12;
    player.dashTime = .24;
    player.dashCooldown = .8;
    player.invulnerable = Math.max(player.invulnerable, .3);
    particles.burst(player.x, player.y, "#ff9f1c", 12, 130);
    sound.play("attack");
    showComicWord("WHOOSH!", "#69e5ff");
  }

  function useSelectedAbility() {
    if (player.attackCooldown > 0) return;
    if (player.selectedAbility === "bolt") fireBolt();
    else if (player.selectedAbility === "dash") useDash();
    else if (player.selectedAbility === "shield") useShield();
    else useWeapon();
  }

  function useWeapon() {
    if (player.weapon === "hammer") useCometHammer();
    else useLeafblade();
  }

  function useLeafblade() {
    const rank = weaponRank();
    player.comboStep = player.comboTimer > 0 ? player.comboStep % 3 + 1 : 1;
    player.comboTimer = .62;
    const finisher = player.comboStep === 3;
    player.attackCooldown = finisher ? .4 : .24;
    player.attackDuration = finisher ? .4 : .27;
    player.attackTime = player.attackDuration;
    player.attackKind = finisher ? "leafblade-finisher" : "leafblade";
    player.attackDirection = { ...player.facing };
    moveCircle(player, player.facing.x * (finisher ? 24 : 17), player.facing.y * (finisher ? 24 : 17));
    const radius = finisher ? 76 + rank * 2 : 52 + rank * 2;
    const hit = {
      x: player.x + player.facing.x * (finisher ? 30 : 58),
      y: player.y + player.facing.y * (finisher ? 30 : 58),
      radius,
      life: finisher ? .32 : .22,
      maxLife: finisher ? .32 : .22,
      angle: Math.atan2(player.facing.y, player.facing.x),
      type: finisher ? "spin" : "slash",
      comboStep: player.comboStep,
      color: "#b7ff9b"
    };
    game.attacks.push(hit);
    particles.burst(hit.x, hit.y, "#d9ffb7", finisher ? 20 : 11, finisher ? 210 : 155);
    sound.play("attack");
    showComicWord(finisher ? "LEAFSTORM!" : player.comboStep === 2 ? "SWOOSH!" : "SLASH!", "#b7ff9b");
    const damage = (rank >= 3 ? 2 : 1) + (finisher ? 1 : 0);
    damageBreakTargets(hit, finisher ? 2 : 1);
    damageBoss(hit, damage);
  }

  function useCometHammer() {
    const rank = weaponRank();
    player.comboStep = 0;
    player.comboTimer = 0;
    player.attackCooldown = .7;
    player.attackDuration = .58;
    player.attackTime = player.attackDuration;
    player.attackKind = "hammer";
    player.attackDirection = { ...player.facing };
    moveCircle(player, player.facing.x * 11, player.facing.y * 11);
    const hit = {
      x: player.x + player.facing.x * 42,
      y: player.y + player.facing.y * 42,
      radius: 88 + (rank - 1) * 6,
      life: .42,
      maxLife: .42,
      angle: Math.atan2(player.facing.y, player.facing.x),
      type: "smash",
      color: "#ff9f1c"
    };
    game.attacks.push(hit);
    particles.burst(hit.x, hit.y, "#ffb347", 24 + rank * 3, 245);
    sound.play("boom");
    game.shake = 9 + rank;
    showComicWord(rank === 4 ? "COMET CRASH!" : "KRAKOOM!", "#ff9f1c");
    damageBreakTargets(hit, 3);
    damageBoss(hit, 2 + Math.floor((rank - 1) / 2));
  }

  function fireBolt() {
    if (player.energy < 14) return;
    player.energy -= 14;
    player.attackCooldown = .28;
    game.projectiles.push({
      x: player.x + player.facing.x * 30,
      y: player.y + player.facing.y * 30,
      vx: player.facing.x * 580,
      vy: player.facing.y * 580,
      radius: 9,
      life: 1.5,
      damage: 1,
      color: "#69e5ff"
    });
    sound.play("bolt");
    showComicWord("ZAP!", "#69e5ff");
  }

  function useShield() {
    if (player.energy < 18) return;
    player.energy -= 18;
    player.attackCooldown = .35;
    player.shieldTime = 1.25;
    sound.play("shield");
    particles.burst(player.x, player.y, "#8ce568", 14, 100);
    showComicWord("SHIELD!", "#8ce568");
  }

  function useCompanion() {
    if (game.chapter.id < 2 || bradley.cooldown > 0) return;
    bradley.cooldown = 6;
    const target = game.boss?.active ? game.boss : { x: player.x + player.facing.x * 170, y: player.y + player.facing.y * 170, radius: 55 };
    particles.burst(target.x, target.y, "#ff9f1c", 28, 250);
    game.attacks.push({ x: target.x, y: target.y, radius: 90, life: .25, color: "#ff9f1c" });
    damageBreakTargets(target, 3);
    damageBoss(target, 3);
    sound.play("boom");
    game.shake = 12;
    showComicWord("MEGA BOOM!", "#ff9f1c");
    announce("Bradley fired Mega Boom.");
  }

  function damageBreakTargets(hit, amount) {
    if (game.chapter.puzzle.type !== "break" || game.puzzleSolved) return;
    game.chapter.puzzle.targets.forEach(target => {
      const key = target.id;
      if (game.activeTargets.has(key)) return;
      if (distance(hit, { ...target, radius: 35 }) <= (hit.radius || 0) + 36) {
        const health = (game.brokenTargets.get(key) || 3) - amount;
        game.brokenTargets.set(key, health);
        particles.burst(target.x, target.y, "#91756a", 12, 160);
        if (health <= 0) {
          game.activeTargets.add(key);
          sound.play("boom");
          showComicWord("CRACK!", "#ff9f1c");
          if (game.activeTargets.size === game.chapter.puzzle.targets.length) solvePuzzle();
        }
      }
    });
  }

  function damageBoss(hit, amount) {
    const boss = game.boss;
    if (!boss?.active || boss.peaceful || boss.invulnerable > 0) return;
    if (distance(hit, boss) > (hit.radius || 0) + boss.radius) return;
    boss.hp -= amount;
    boss.invulnerable = .12;
    particles.burst(boss.x, boss.y, game.chapter.palette.glow, 12, 170);
    if (boss.hp <= 0) defeatBoss();
  }

  function collectMemory(memory) {
    const previousRank = weaponRank();
    memory.collected = true;
    const key = chapterMemoryKey(game.chapter.id, memory.index);
    if (!save.memories.includes(key)) save.memories.push(key);
    gainExperience(20);
    particles.burst(memory.x, memory.y, "#ffd34f", 24, 180);
    sound.play("pickup");
    const upgradedRank = weaponRank();
    if (upgradedRank > previousRank) {
      showComicWord(`WEAPONS ${ROMAN_RANKS[upgradedRank - 1]}!`, "#ff9f1c");
      announce(`Weapon rank upgraded to ${ROMAN_RANKS[upgradedRank - 1]}. Both weapons are stronger.`);
    } else {
      showComicWord("MEMORY!", "#ffd34f");
      announce(`Comic memory found. ${save.memories.length} of 21.`);
    }
    persist();
  }

  function nearestPuzzleTarget() {
    if (game.puzzleSolved) return null;
    if (game.chapter.puzzle.type === "break" || game.chapter.puzzle.type === "push") return null;
    let nearest = null;
    game.chapter.puzzle.targets.forEach(target => {
      if (game.activeTargets.has(target.id)) return;
      const away = distance(player, { ...target, radius: 25 });
      if (away < 72 && (!nearest || away < nearest.distance)) nearest = { type: "puzzle", target, distance: away };
    });
    return nearest;
  }

  function determineInteraction() {
    const target = nearestPuzzleTarget();
    if (target) return target;
    if (game.boss?.active && game.boss.peaceful && distance(player, game.boss) < 115) return { type: "peacefulBoss", target: game.boss };
    if (game.portalActive && distance(player, game.chapter.portal) < 92) return { type: "portal", target: game.chapter.portal };
    return null;
  }

  function updateInteractionPrompt() {
    game.nearestInteraction = determineInteraction();
    if (!game.nearestInteraction) {
      dom.interactionPrompt.hidden = true;
      return;
    }
    const labels = {
      puzzle: game.nearestInteraction.target.label || "Activate rune",
      peacefulBoss: game.chapter.id === 5 ? "Talk to the Golem" : "Open the Final Gate",
      portal: game.chapter.id === 7 ? "Claim the Leaf Key" : "Enter Portal"
    };
    dom.interactionPrompt.querySelector("span").textContent = labels[game.nearestInteraction.type];
    dom.interactionPrompt.hidden = false;
  }

  function interact() {
    const interaction = determineInteraction();
    if (!interaction) return;
    if (interaction.type === "puzzle") activatePuzzleTarget(interaction.target);
    else if (interaction.type === "peacefulBoss") completePeacefulEncounter();
    else if (interaction.type === "portal") completeChapter();
  }

  function activatePuzzleTarget(target) {
    const puzzle = game.chapter.puzzle;
    const match = target.match || target.id;
    const expected = puzzle.sequence[game.puzzleProgress];
    const uniqueKey = target.id;
    if (match === expected) {
      game.puzzleProgress += 1;
      game.activeTargets.add(uniqueKey);
      particles.burst(target.x, target.y, target.color, 15, 120);
      const noteName = target.number ? `note${target.number}` : "click";
      sound.play(noteName);
      showComicWord(puzzle.type === "rhythm" ? `NOTE ${target.number}!` : "CLICK!", target.color);
      if (game.puzzleProgress >= puzzle.sequence.length) solvePuzzle();
      else setObjective(`${game.chapter.objective} · ${game.puzzleProgress}/${puzzle.sequence.length}`);
    } else {
      game.puzzleProgress = 0;
      game.activeTargets.clear();
      game.flash = .25;
      sound.play("hurt");
      showComicWord("TRY AGAIN!", "#ff5d62");
      setObjective(game.chapter.objective);
    }
  }

  function solvePuzzle() {
    if (game.puzzleSolved) return;
    game.puzzleSolved = true;
    game.phase = "boss";
    gainExperience(60);
    sound.play("success");
    showComicWord("PORTAL POWER!", "#8ce568");
    particles.burst(game.chapter.portal.x, game.chapter.portal.y, game.chapter.palette.glow, 36, 220);
    spawnBoss();
  }

  function spawnBoss() {
    const spec = game.chapter.boss;
    game.boss = {
      ...spec,
      radius: spec.type === "raven" ? 66 : spec.type === "pi" || spec.type === "shadow" ? 58 : 48,
      maxHp: spec.hp,
      active: true,
      attackTimer: 1.2,
      moveTimer: 0,
      invulnerable: 0,
      angle: 0
    };
    if (spec.peaceful) {
      setObjective(game.chapter.id === 5 ? "The golem is frightened—try talking" : "Approach the Final Gate together");
    } else {
      setObjective(`Defeat ${spec.name}`);
      showComicWord(spec.name, "#ff5d62");
      announce(`${spec.name} has appeared.`);
    }
  }

  function completePeacefulEncounter() {
    if (!game.boss?.active) return;
    game.boss.active = false;
    if (game.chapter.id === 5) {
      showDialogue([
        ["Clark", "We're sorry. We thought you were guarding the corruption."],
        ["Portal Guardian", "The golem is guarding everyone from it. That is the safe road."],
        ["Bird", "Tweet! No punching required!"]
      ], defeatBoss);
    } else {
      showDialogue([
        ["Portal Guardian", "Every trial answered. The city remembers you."],
        ["Bradley", "Clark, look—the leaf key!"],
        ["Clark", "We made it together."]
      ], defeatBoss);
    }
  }

  function defeatBoss() {
    if (game.boss) game.boss.active = false;
    game.phase = "portal";
    game.portalActive = true;
    game.enemyProjectiles = [];
    gainExperience(100);
    sound.play("success");
    showComicWord(game.chapter.id === 7 ? "KEY FOUND!" : "THE END?", "#ffd34f");
    setObjective(game.chapter.id === 7 ? "Claim the Leaf Key" : "Enter the restored portal");
    persist();
  }

  function completeChapter() {
    const id = game.chapter.id;
    if (!save.completed.includes(id)) save.completed.push(id);
    save.unlockedChapter = Math.max(save.unlockedChapter, Math.min(7, id + 1));
    save.chapter = Math.min(7, id + 1);
    persist();
    sound.play("portal");
    showChapterComplete();
  }

  function updateCompanions(delta) {
    bradley.cooldown = Math.max(0, bradley.cooldown - delta);
    const follow = (entity, target, preferred, speed) => {
      const away = distance(entity, target);
      if (away > preferred) {
        const direction = normalize(target.x - entity.x, target.y - entity.y);
        entity.x += direction.x * Math.min(speed * delta, away - preferred);
        entity.y += direction.y * Math.min(speed * delta, away - preferred);
        entity.facing = direction;
      }
      if (away > 430) { entity.x = target.x - 45; entity.y = target.y + 35; }
    };
    if (game.chapter.id >= 2) follow(bradley, player, 62, 225);
    if (game.chapter.id >= 5) {
      bird.angle += delta * 2.2;
      bird.x = lerp(bird.x, player.x - 38 + Math.cos(bird.angle) * 25, .08);
      bird.y = lerp(bird.y, player.y - 48 + Math.sin(bird.angle) * 12, .08);
    }
    if (game.chapter.id >= 4) {
      guardian.angle += delta * 1.2;
      guardian.x = lerp(guardian.x, player.x - 72 + Math.cos(guardian.angle) * 20, .055);
      guardian.y = lerp(guardian.y, player.y - 52 + Math.sin(guardian.angle) * 16, .055);
    }
  }

  function updateBoss(delta) {
    const boss = game.boss;
    if (!boss?.active || boss.peaceful) return;
    boss.invulnerable = Math.max(0, boss.invulnerable - delta);
    boss.attackTimer -= delta;
    boss.moveTimer += delta;
    boss.angle += delta;
    const direction = normalize(player.x - boss.x, player.y - boss.y);
    const desiredDistance = ["engine", "warden", "raven"].includes(boss.type) ? 260 : 150;
    const away = distance(player, boss);
    const movement = away > desiredDistance ? 48 : away < desiredDistance - 70 ? -35 : 0;
    boss.x = clamp(boss.x + direction.x * movement * delta, 100, 1180);
    boss.y = clamp(boss.y + direction.y * movement * delta + Math.sin(boss.moveTimer * 2.4) * 22 * delta, 90, 630);
    if (boss.attackTimer <= 0) {
      boss.attackTimer = boss.type === "raven" ? .75 : boss.type === "engine" ? .9 : 1.15;
      fireBossAttack(boss);
    }
  }

  function fireBossAttack(boss) {
    const aimed = normalize(player.x - boss.x, player.y - boss.y);
    const count = boss.type === "raven" || boss.type === "shadow" ? 5 : boss.type === "pi" ? 3 : 1;
    for (let index = 0; index < count; index += 1) {
      const spread = (index - (count - 1) / 2) * .22;
      const angle = Math.atan2(aimed.y, aimed.x) + spread;
      const speed = boss.type === "engine" ? 330 : 245;
      game.enemyProjectiles.push({
        x: boss.x, y: boss.y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        radius: boss.type === "pi" ? 15 : 11,
        life: 4,
        color: boss.type === "warden" ? "#6dff9a" : "#b85dff",
        damage: 1
      });
    }
    sound.play("bolt");
  }

  function updateProjectiles(delta) {
    const updateList = list => {
      list.forEach(projectile => {
        projectile.x += projectile.vx * delta;
        projectile.y += projectile.vy * delta;
        projectile.life -= delta;
      });
    };
    updateList(game.projectiles);
    updateList(game.enemyProjectiles);
    game.attacks.forEach(attack => { attack.life -= delta; });

    game.projectiles.forEach(projectile => {
      if (game.boss?.active && !game.boss.peaceful && circleHit(projectile, game.boss)) {
        damageBoss(projectile, projectile.damage);
        projectile.life = 0;
      }
      if (game.chapter.puzzle.type === "break") damageBreakTargets(projectile, 1);
    });

    game.enemyProjectiles.forEach(projectile => {
      if (projectile.life <= 0) return;
      if (player.shieldTime > 0 && distance(projectile, player) < player.radius + projectile.radius + 35) {
        const outward = normalize(projectile.x - player.x, projectile.y - player.y);
        game.projectiles.push({ ...projectile, vx: outward.x * 480, vy: outward.y * 480, color: "#8ce568", damage: 2, life: 1.5 });
        projectile.life = 0;
        particles.burst(projectile.x, projectile.y, "#8ce568", 8, 100);
        sound.play("shield");
      } else if (circleHit(projectile, player)) {
        hurtPlayer(projectile.damage || 1, projectile);
        projectile.life = 0;
      }
    });

    game.projectiles = game.projectiles.filter(projectile => projectile.life > 0 && projectile.x > -40 && projectile.x < 1320 && projectile.y > -40 && projectile.y < 760);
    game.enemyProjectiles = game.enemyProjectiles.filter(projectile => projectile.life > 0 && projectile.x > -40 && projectile.x < 1320 && projectile.y > -40 && projectile.y < 760);
    game.attacks = game.attacks.filter(attack => attack.life > 0);
  }

  function hurtPlayer(amount, source) {
    if (player.invulnerable > 0 || player.shieldTime > 0) return;
    player.health = Math.max(0, player.health - amount);
    player.invulnerable = 1;
    const knock = normalize(player.x - source.x, player.y - source.y);
    moveCircle(player, knock.x * 35, knock.y * 35);
    particles.burst(player.x, player.y, "#ff5d62", 12, 160);
    sound.play("hurt");
    game.shake = 7;
    showComicWord("OOF!", "#ff5d62");
    if (player.health <= 0) heroFell();
  }

  function heroFell() {
    game.mode = "dialogue";
    showDialogue([["Clark", "That portal got the jump on me. One more try—from the last safe page!"]], () => {
      resetChapterState(game.chapter.id);
      game.mode = "playing";
    });
  }

  function updateTimedTrial(delta) {
    if (game.timeLeft === null || game.puzzleSolved) return;
    game.timeLeft = Math.max(0, game.timeLeft - delta);
    const minutes = Math.floor(game.timeLeft / 60);
    const seconds = Math.floor(game.timeLeft % 60).toString().padStart(2, "0");
    dom.chapterReadout.textContent = `Chapter 7 · ${minutes}:${seconds}`;
    if (game.timeLeft <= 0) {
      game.timeLeft = game.chapter.timed;
      game.puzzleProgress = 0;
      game.activeTargets.clear();
      player.x = game.chapter.start.x;
      player.y = game.chapter.start.y;
      showComicWord("TIME REWINDS!", "#69e5ff");
      setObjective(game.chapter.objective);
    }
  }

  function update(delta) {
    game.sceneTime += delta;
    game.flash = Math.max(0, game.flash - delta);
    game.shake = Math.max(0, game.shake - 30 * delta);
    updatePlayer(delta);
    const cameraEase = 1 - Math.pow(.002, delta);
    game.camera.x = lerp(game.camera.x, player.x, cameraEase);
    game.camera.y = lerp(game.camera.y, player.y, cameraEase);
    updateCompanions(delta);
    updateBoss(delta);
    updateProjectiles(delta);
    particles.update(delta);
    updateTimedTrial(delta);
    updateInteractionPrompt();
    updateHud();
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function drawBackground(ctx, chapter) {
    const background = art.backgrounds[chapter.id];
    if (background?.complete && background.naturalWidth) {
      ctx.drawImage(background, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      const vignette = ctx.createRadialGradient(640, 340, 170, 640, 340, 760);
      vignette.addColorStop(0, "rgba(255,255,255,.035)");
      vignette.addColorStop(1, chapter.id === 3 ? "rgba(7,8,36,.25)" : "rgba(35,51,39,.18)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      return;
    }
    const palette = chapter.palette;
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    gradient.addColorStop(0, palette.ground);
    gradient.addColorStop(1, palette.ground2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.globalAlpha = .18;
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 2;
    const size = chapter.environment === "facility" ? 55 : 80;
    for (let x = 0; x < WORLD_WIDTH; x += size) {
      for (let y = 0; y < WORLD_HEIGHT; y += size) {
        ctx.strokeRect(x + 5, y + 5, size - 10, size - 10);
      }
    }
    ctx.globalAlpha = 1;

    if (chapter.environment === "mars") drawCraters(ctx);
    if (chapter.environment === "star-void") drawFloatingVoid(ctx);
    if (["vine-tower", "wind-city", "final-trial"].includes(chapter.environment)) drawLeaves(ctx);
    if (chapter.environment === "facility") drawFacilityLines(ctx);
    if (chapter.environment === "portal-yard") drawCloudsAndBlocks(ctx);
    game.obstacles.slice(4).forEach(obstacle => drawObstacle(ctx, obstacle, chapter));
  }

  function drawCraters(ctx) {
    [[180,160,60],[510,120,38],[750,580,55],[1030,130,48],[1090,560,66]].forEach(([x,y,r]) => {
      ctx.fillStyle = "rgba(55,21,22,.25)";
      ctx.beginPath(); ctx.ellipse(x,y,r,r*.45,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = "rgba(230,126,82,.25)"; ctx.lineWidth = 5; ctx.stroke();
    });
  }

  function drawFloatingVoid(ctx) {
    ctx.fillStyle = "rgba(7,8,29,.56)";
    [[110,110,90],[520,115,80],[960,600,120],[1170,160,90]].forEach(([x,y,r]) => {
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = "rgba(255,211,79,.25)"; ctx.stroke();
    });
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 44; i += 1) {
      const x = (i * 97) % WORLD_WIDTH;
      const y = (i * i * 31) % WORLD_HEIGHT;
      ctx.globalAlpha = .25 + (i % 4) * .15;
      ctx.fillRect(x,y,2,2);
    }
    ctx.globalAlpha = 1;
  }

  function drawLeaves(ctx) {
    ctx.fillStyle = "rgba(114,177,76,.35)";
    for (let i = 0; i < 34; i += 1) {
      const x = (i * 143 + 41) % WORLD_WIDTH;
      const y = (i * 83 + 19) % WORLD_HEIGHT;
      ctx.save(); ctx.translate(x,y); ctx.rotate((i % 7) * .7); ctx.beginPath(); ctx.ellipse(0,0,12,4,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    }
  }

  function drawFacilityLines(ctx) {
    ctx.strokeStyle = "rgba(105,229,255,.28)";
    ctx.lineWidth = 3;
    for (let y = 90; y < WORLD_HEIGHT; y += 145) {
      ctx.beginPath(); ctx.moveTo(40,y); ctx.lineTo(WORLD_WIDTH-40,y); ctx.stroke();
    }
  }

  function drawCloudsAndBlocks(ctx) {
    ctx.fillStyle = "rgba(205,239,255,.18)";
    [[210,95],[590,80],[1020,110]].forEach(([x,y]) => {
      ctx.beginPath(); ctx.arc(x,y,34,0,Math.PI*2); ctx.arc(x+38,y+5,28,0,Math.PI*2); ctx.arc(x-35,y+8,24,0,Math.PI*2); ctx.fill();
    });
  }

  function drawObstacle(ctx, obstacle, chapter) {
    ctx.fillStyle = chapter.environment === "facility" ? "#26364b" : chapter.environment === "star-void" ? "#211c43" : "#384533";
    roundedRect(ctx, obstacle.x, obstacle.y, obstacle.w, obstacle.h, 12); ctx.fill();
    ctx.strokeStyle = chapter.palette.line; ctx.lineWidth = 4; ctx.stroke();
  }

  function drawPortal(ctx, portal, active) {
    ctx.save();
    ctx.translate(portal.x, portal.y);
    const pulse = 1 + Math.sin(game.sceneTime * 3) * .045;
    ctx.scale(pulse,pulse);
    if (game.chapter.id === 1) {
      const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, 82);
      aura.addColorStop(0, active ? "rgba(247,235,255,.92)" : "rgba(212,183,255,.15)");
      aura.addColorStop(.45, active ? "rgba(174,105,255,.48)" : "rgba(155,93,255,.08)");
      aura.addColorStop(1, "rgba(112,60,190,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(-86, -92, 172, 184);
      if (active) {
        ctx.strokeStyle = "rgba(255,248,222,.88)";
        ctx.shadowColor = portal.color;
        ctx.shadowBlur = 28;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 58, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    ctx.globalAlpha = active ? 1 : .32;
    ctx.strokeStyle = portal.color;
    ctx.shadowColor = portal.color;
    ctx.shadowBlur = active ? 28 : 8;
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.ellipse(0,0,46,74,0,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 4; angle += .12) {
      const radius = 4 + angle * 2.4;
      const x = Math.cos(angle + game.sceneTime * 1.6) * radius * .58;
      const y = Math.sin(angle + game.sceneTime * 1.6) * radius;
      if (angle === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawMemory(ctx, memory) {
    if (memory.collected) return;
    const pulse = 1 + Math.sin(game.sceneTime * 4 + memory.index) * .18;
    ctx.save(); ctx.translate(memory.x,memory.y); ctx.scale(pulse,pulse);
    ctx.fillStyle = "#ffd34f"; ctx.shadowColor = "#ffd34f"; ctx.shadowBlur = 18;
    ctx.rotate(game.sceneTime*.35);
    ctx.beginPath();
    for (let i=0;i<10;i+=1) {
      const a=-Math.PI/2+i*Math.PI/5; const r=i%2===0?14:6;
      const x=Math.cos(a)*r,y=Math.sin(a)*r; if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function drawPuzzle(ctx) {
    const puzzle = game.chapter.puzzle;
    if (puzzle.type === "break") {
      puzzle.targets.forEach(target => {
        if (game.activeTargets.has(target.id)) return;
        const health = game.brokenTargets.get(target.id) ?? 3;
        ctx.save(); ctx.translate(target.x,target.y);
        const hover = Math.sin(game.sceneTime * 2.2 + target.x) * 1.5;
        ctx.translate(0, hover);
        ctx.fillStyle="rgba(45,61,40,.22)";
        ctx.beginPath();ctx.ellipse(2,28,43,17,0,0,Math.PI*2);ctx.fill();
        const rock = ctx.createLinearGradient(-26,-38,30,32);
        rock.addColorStop(0,"#8f9b78");rock.addColorStop(.48,"#5e6655");rock.addColorStop(1,"#3d443a");
        ctx.fillStyle=rock;ctx.strokeStyle="#30372e";ctx.lineWidth=4;ctx.lineJoin="round";
        ctx.beginPath();ctx.moveTo(-39,18);ctx.quadraticCurveTo(-43,-8,-24,-31);ctx.quadraticCurveTo(2,-46,29,-27);ctx.quadraticCurveTo(46,-6,34,27);ctx.quadraticCurveTo(0,42,-39,18);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle="rgba(197,219,135,.72)";ctx.beginPath();ctx.ellipse(-10,-28,22,7,-.22,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle="#ffd77a";ctx.shadowColor="#ffb44e";ctx.shadowBlur=9;ctx.lineWidth=3;
        const cracks=Math.max(1,4-health);for(let i=0;i<cracks;i+=1){const x=-12+i*10;ctx.beginPath();ctx.moveTo(x,-19);ctx.lineTo(x+7,0);ctx.lineTo(x-3,17);ctx.stroke();}
        ctx.shadowBlur=0;
        ctx.restore();
      });
    } else if (puzzle.type === "push") {
      const goal=puzzle.goal;
      ctx.strokeStyle="#ffd34f";ctx.lineWidth=6;ctx.shadowColor="#ffd34f";ctx.shadowBlur=16;ctx.strokeRect(goal.x-36,goal.y-36,72,72);ctx.shadowBlur=0;
      if(game.block){ctx.fillStyle="#665f50";ctx.strokeStyle="#17191a";ctx.lineWidth=5;ctx.fillRect(game.block.x-30,game.block.y-30,60,60);ctx.strokeRect(game.block.x-30,game.block.y-30,60,60);ctx.strokeStyle="#ffd34f";ctx.strokeRect(game.block.x-14,game.block.y-14,28,28);}
    } else {
      puzzle.targets.forEach(target => {
        const active=game.activeTargets.has(target.id);
        const radius=puzzle.type==="rhythm"?37:30;
        ctx.save();ctx.translate(target.x,target.y);
        ctx.fillStyle=active?target.color:"rgba(8,13,28,.72)";ctx.strokeStyle=target.color;ctx.lineWidth=5;ctx.shadowColor=target.color;ctx.shadowBlur=active?22:8;
        if(target.id.includes("leaf")){ctx.beginPath();ctx.ellipse(0,0,38,18,-.5,0,Math.PI*2);ctx.fill();ctx.stroke();}
        else if(target.id.includes("square")){ctx.fillRect(-radius,-radius,radius*2,radius*2);ctx.strokeRect(-radius,-radius,radius*2,radius*2);}
        else {ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.stroke();}
        ctx.shadowBlur=0;ctx.fillStyle=active?"#07111e":target.color;ctx.font="900 22px Trebuchet MS";ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(target.number||((target.match||target.id).includes("spiral")?"↻":(target.id.includes("leaf")?"⌁":"◆")),0,1);
        ctx.restore();
      });
    }
  }

  function drawClark(ctx) {
    const blink = player.invulnerable > 0 && Math.floor(game.sceneTime * 14) % 2 === 0;
    ctx.save();ctx.translate(player.x,player.y);
    const attacking = player.attackTime > 0;
    const stepPhase = (player.walkCycle % 1) * Math.PI;
    const hop = player.moving && !attacking ? Math.sin(stepPhase) : 0;
    const landing = player.moving && !attacking ? Math.pow(Math.abs(Math.cos(stepPhase)), 10) : 0;
    const bob = attacking ? -2 : player.moving ? -hop * 5.5 : Math.sin(game.sceneTime*3)*1.2;
    const shadowScale = 1 - hop * .2;
    ctx.save();ctx.scale(shadowScale,shadowScale);ctx.fillStyle="rgba(35,57,34,.28)";ctx.beginPath();ctx.ellipse(0,31,34,13,0,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.translate(0,bob);
    if (blink) ctx.globalAlpha=.35;
    if (art.clark.complete && art.clark.naturalWidth) {
      const attackProgress = attacking ? clamp(1 - player.attackTime / player.attackDuration, 0, 1) : 0;
      const attackEase = 1 - Math.pow(1 - attackProgress, 3);
      const facingX = attacking ? player.attackDirection.x : player.facing.x;
      const directionFlip = facingX < -.08 ? -1 : 1;
      const movingTilt = attacking
        ? -.1 + attackEase * .2
        : player.moving ? directionFlip * .045 + Math.sin(player.walkCycle * Math.PI * 2) * .018 : Math.sin(game.sceneTime * 2.2) * .008;
      const squashX = 1 + landing * .055 - hop * .012 + (attacking ? .045 : 0);
      const squashY = 1 - landing * .06 + hop * .018 - (attacking ? .035 : 0);
      const spriteX = -61, spriteY = -75, spriteWidth = 122, spriteHeight = 104;
      ctx.save();
      ctx.rotate(movingTilt);
      ctx.scale(directionFlip * squashX, squashY);
      const wieldingHammer = player.weapon === "hammer";
      const weaponArt = wieldingHammer ? art.cometHammer : art.leafblade;
      if (weaponArt.complete && weaponArt.naturalWidth) {
        const handX = 36, handY = -16;
        const idleSway = Math.sin(game.sceneTime * 3.5) * .055;
        let weaponAngle = wieldingHammer ? -.48 + idleSway : .28 + idleSway - hop * .08;
        if (attacking) {
          if (player.attackKind === "hammer") weaponAngle = -1.42 + attackEase * 2.9;
          else if (player.attackKind === "leafblade-finisher") weaponAngle = -1.5 + attackProgress * Math.PI * 2;
          else if (player.comboStep === 2) weaponAngle = 1.18 - attackEase * 2.55;
          else weaponAngle = -1.2 + attackEase * 2.65;
        }
        ctx.save();ctx.translate(handX,handY);
        if (attacking) {
          ctx.globalAlpha = Math.sin(attackProgress * Math.PI) * .58;
          ctx.strokeStyle = wieldingHammer ? "#ffc46a" : "#dfffcf";ctx.shadowColor=wieldingHammer?"#ff7a21":"#8dff78";ctx.shadowBlur=20;ctx.lineWidth=wieldingHammer?20:15;ctx.lineCap="round";
          ctx.beginPath();ctx.arc(0,0,wieldingHammer?40:46,-Math.PI/2-1.15,-Math.PI/2+weaponAngle);ctx.stroke();
          ctx.globalAlpha = 1;ctx.shadowBlur=0;
        }
        ctx.rotate(weaponAngle);
        ctx.shadowColor=wieldingHammer?"#ff852a":"#79eb8c";ctx.shadowBlur=attacking?14:5;
        if (wieldingHammer) ctx.drawImage(weaponArt,-24,-60,48,78);
        else ctx.drawImage(weaponArt,-16,-55,32,64);
        ctx.restore();
      }
      ctx.drawImage(art.clark, spriteX, spriteY, spriteWidth, spriteHeight);
      ctx.restore();
      if(player.shieldTime>0){ctx.strokeStyle="#9ce98c";ctx.shadowColor="#d8ffb2";ctx.shadowBlur=24;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-19,52,58,0,0,Math.PI*2);ctx.stroke();}
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      ctx.fillStyle="rgba(251,248,220,.92)";ctx.strokeStyle="rgba(70,91,55,.35)";ctx.lineWidth=2;roundedRect(ctx,-30,-100,60,18,9);ctx.fill();ctx.stroke();
      ctx.fillStyle="#364b31";ctx.font="800 10px Trebuchet MS";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("CLARK",0,-91);
      ctx.restore();
      return;
    }
    const faceAngle=Math.atan2(player.facing.y,player.facing.x);
    ctx.fillStyle="#b82232";ctx.strokeStyle="#12131b";ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(-8,3);ctx.lineTo(-42-player.facing.x*8,20-player.facing.y*8);ctx.lineTo(-26,-7);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle="#11131a";ctx.lineWidth=8;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(-8,26);ctx.lineTo(-13,44);ctx.moveTo(8,26);ctx.lineTo(13,44);ctx.stroke();
    ctx.fillStyle="#e3343e";roundedRect(ctx,-17,-5,34,38,9);ctx.fill();ctx.stroke();
    ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.arc(0,-16,25,0,Math.PI*2);ctx.fill();ctx.stroke();
    const eyeX=Math.cos(faceAngle)*7,eyeY=Math.sin(faceAngle)*4;
    ctx.fillStyle="#111";ctx.beginPath();ctx.ellipse(eyeX-6,eyeY-18,3.5,7,0,0,Math.PI*2);ctx.ellipse(eyeX+7,eyeY-18,3.5,7,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#111";ctx.lineWidth=3;ctx.beginPath();ctx.arc(eyeX,eyeY-11,8,.2,Math.PI-.2);ctx.stroke();
    if(player.shieldTime>0){ctx.strokeStyle="#8ce568";ctx.shadowColor="#8ce568";ctx.shadowBlur=20;ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
    ctx.restore();ctx.globalAlpha=1;
  }

  function drawBradley(ctx) {
    if(game.chapter.id<2)return;
    ctx.save();ctx.translate(bradley.x,bradley.y);ctx.strokeStyle="#11131a";ctx.lineWidth=5;ctx.lineCap="round";
    ctx.strokeStyle="#171721";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-7,18);ctx.lineTo(-10,36);ctx.moveTo(7,18);ctx.lineTo(11,36);ctx.stroke();
    ctx.fillStyle="#8e6334";roundedRect(ctx,-15,-2,30,29,8);ctx.fill();ctx.stroke();
    ctx.fillStyle="#f29a19";ctx.beginPath();ctx.arc(0,-14,22,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle="#2877c6";ctx.beginPath();ctx.arc(0,-20,23,Math.PI,Math.PI*2);ctx.lineTo(26,-17);ctx.lineTo(0,-15);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="#111";ctx.beginPath();ctx.ellipse(-6,-14,3,6,0,0,Math.PI*2);ctx.ellipse(7,-14,3,6,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function drawBird(ctx) {
    if(game.chapter.id<5)return;
    ctx.save();ctx.translate(bird.x,bird.y);ctx.fillStyle="#d6b56d";ctx.strokeStyle="#2d241c";ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(0,0,16,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(13,-2);ctx.lineTo(27,2);ctx.lineTo(13,6);ctx.closePath();ctx.fillStyle="#ffcb45";ctx.fill();ctx.stroke();
    ctx.fillStyle="#111";ctx.beginPath();ctx.arc(6,-4,2.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#735a2e";ctx.beginPath();ctx.moveTo(-5,-10);ctx.lineTo(-9,-19);ctx.moveTo(1,-11);ctx.lineTo(0,-20);ctx.stroke();ctx.restore();
  }

  function drawGuardian(ctx) {
    if(game.chapter.id<4)return;
    ctx.save();ctx.translate(guardian.x,guardian.y);ctx.strokeStyle="#ffd34f";ctx.lineWidth=3;ctx.fillStyle="rgba(255,211,79,.32)";
    for(const side of[-1,1]){ctx.beginPath();ctx.ellipse(side*20,4,18,8,side*.8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(side*17,-8,15,6,side*.8,0,Math.PI*2);ctx.fill();ctx.stroke();}
    ctx.fillStyle="#111429";ctx.strokeStyle="#ffd34f";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-4,17,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle="#69e5ff";ctx.lineWidth=3;ctx.beginPath();for(let a=0;a<Math.PI*4;a+=.18){const r=a*1.05,x=Math.cos(a)*r,y=-4+Math.sin(a)*r;if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.restore();
  }

  function drawBoss(ctx, boss) {
    if(!boss?.active)return;
    ctx.save();ctx.translate(boss.x,boss.y);const pulse=1+Math.sin(game.sceneTime*4)*.035;ctx.scale(pulse,pulse);ctx.globalAlpha=boss.invulnerable>0?.55:1;ctx.shadowColor=game.chapter.palette.glow;ctx.shadowBlur=18;
    if(boss.type==="pi"&&art.piMonster.complete&&art.piMonster.naturalWidth){
      ctx.fillStyle="rgba(38,29,51,.3)";ctx.beginPath();ctx.ellipse(0,50,75,24,0,0,Math.PI*2);ctx.fill();
      ctx.drawImage(art.piMonster,-92,-94,184,168);ctx.shadowBlur=0;ctx.restore();return;
    }
    ctx.strokeStyle="#0b0c13";ctx.lineWidth=7;ctx.fillStyle=boss.color;
    if(boss.type==="raven"){
      ctx.beginPath();ctx.moveTo(-70,0);ctx.quadraticCurveTo(-20,-70,0,-25);ctx.quadraticCurveTo(35,-70,75,-10);ctx.quadraticCurveTo(35,10,10,28);ctx.quadraticCurveTo(-30,25,-70,0);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(14,-21,7,4,-.2,0,Math.PI*2);ctx.fill();
    }else if(boss.type==="engine"||boss.type==="gate"){
      roundedRect(ctx,-55,-42,110,84,18);ctx.fill();ctx.stroke();drawPortal(ctx,{x:0,y:0,color:game.chapter.palette.glow},true);
    }else if(boss.type==="golem"){
      ctx.beginPath();ctx.arc(0,-15,38,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle="#8ce568";ctx.beginPath();ctx.arc(-12,-18,6,0,Math.PI*2);ctx.arc(12,-18,6,0,Math.PI*2);ctx.fill();
    }else{
      ctx.beginPath();ctx.arc(0,0,boss.radius,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=boss.type==="warden"?"#6dff9a":"#d78aff";ctx.beginPath();ctx.ellipse(-17,-12,8,12,-.25,0,Math.PI*2);ctx.ellipse(17,-12,8,12,.25,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#fff";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,9,25,.1,Math.PI-.1);ctx.stroke();
      if(boss.type==="pi"){ctx.fillStyle="#fff";ctx.font="900 27px serif";ctx.textAlign="center";ctx.fillText("π",0,-42);}
      if(boss.type==="shadow"){for(let i=0;i<9;i+=1){const a=i*Math.PI*2/9;ctx.fillStyle="#251330";ctx.beginPath();ctx.moveTo(Math.cos(a)*boss.radius,Math.sin(a)*boss.radius);ctx.lineTo(Math.cos(a-.18)*(boss.radius+22),Math.sin(a-.18)*(boss.radius+22));ctx.lineTo(Math.cos(a+.18)*(boss.radius+22),Math.sin(a+.18)*(boss.radius+22));ctx.fill();}}
    }
    ctx.shadowBlur=0;ctx.restore();
  }

  function drawProjectiles(ctx) {
    game.projectiles.forEach(projectile=>{ctx.fillStyle=projectile.color;ctx.shadowColor=projectile.color;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(projectile.x,projectile.y,projectile.radius,0,Math.PI*2);ctx.fill();});
    game.enemyProjectiles.forEach(projectile=>{ctx.fillStyle=projectile.color;ctx.shadowColor=projectile.color;ctx.shadowBlur=13;ctx.beginPath();ctx.arc(projectile.x,projectile.y,projectile.radius,0,Math.PI*2);ctx.fill();});
    ctx.shadowBlur=0;
    game.attacks.forEach(attack=>{
      if(attack.type==="slash"){
        const progress=clamp(1-attack.life/attack.maxLife,0,1);
        const fade=Math.sin(progress*Math.PI);
        ctx.save();ctx.translate(attack.x,attack.y);ctx.rotate(attack.angle);
        ctx.globalAlpha=fade*.82;ctx.strokeStyle="#a9ff8d";ctx.shadowColor="#75ef8a";ctx.shadowBlur=22;ctx.lineCap="round";
        ctx.lineWidth=18-progress*9;ctx.beginPath();ctx.arc(0,0,attack.radius,-1.05,1.05);ctx.stroke();
        ctx.globalAlpha=fade*.9;ctx.strokeStyle="#f6ffe9";ctx.shadowBlur=8;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,attack.radius+2,-.9,.9);ctx.stroke();
        ctx.restore();
      }else if(attack.type==="spin"){
        const progress=clamp(1-attack.life/attack.maxLife,0,1);
        const fade=Math.sin(progress*Math.PI);
        ctx.save();ctx.translate(attack.x,attack.y);ctx.rotate(attack.angle+progress*1.2);
        ctx.globalAlpha=fade*.75;ctx.strokeStyle="#b7ff9b";ctx.shadowColor="#75ef8a";ctx.shadowBlur=24;ctx.lineWidth=16-progress*7;ctx.lineCap="round";
        ctx.beginPath();ctx.arc(0,0,attack.radius,-Math.PI*.85,Math.PI*.85);ctx.stroke();
        ctx.globalAlpha=fade;ctx.strokeStyle="#f6ffe9";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,attack.radius+3,-Math.PI*.7,Math.PI*.72);ctx.stroke();ctx.restore();
      }else if(attack.type==="smash"){
        const progress=clamp(1-attack.life/attack.maxLife,0,1);
        const radius=attack.radius*(.25+progress*.75);
        ctx.save();ctx.translate(attack.x,attack.y);ctx.globalAlpha=(1-progress)*.78;
        ctx.strokeStyle="#ffae42";ctx.shadowColor="#ff6f24";ctx.shadowBlur=24;ctx.lineWidth=18*(1-progress)+4;ctx.beginPath();ctx.ellipse(0,7,radius,radius*.48,0,0,Math.PI*2);ctx.stroke();
        ctx.strokeStyle="#fff0b8";ctx.shadowBlur=8;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,7,radius+4,(radius+4)*.48,0,0,Math.PI*2);ctx.stroke();
        ctx.fillStyle="rgba(92,52,33,.38)";for(let i=0;i<7;i+=1){const angle=i*Math.PI*2/7;const rockDistance=radius*.7;ctx.beginPath();ctx.arc(Math.cos(angle)*rockDistance,7+Math.sin(angle)*rockDistance*.45,3+4*(1-progress),0,Math.PI*2);ctx.fill();}ctx.restore();
      }else{
        ctx.globalAlpha=clamp(attack.life/.25,0,.45);ctx.fillStyle=attack.color;ctx.beginPath();ctx.arc(attack.x,attack.y,attack.radius,0,Math.PI*2);ctx.fill();
      }
    });ctx.globalAlpha=1;ctx.shadowBlur=0;
  }

  function currentObjectiveTarget() {
    if(game.phase==="portal")return game.chapter.portal;
    if(game.phase==="boss")return game.boss;
    const puzzle=game.chapter.puzzle;
    if(puzzle.type==="push")return puzzle.goal;
    if(puzzle.type==="break")return puzzle.targets.find(target=>!game.activeTargets.has(target.id));
    return puzzle.targets.find(target=>!game.activeTargets.has(target.id))||puzzle.targets[0];
  }

  function drawObjectiveMarker(ctx) {
    const target=currentObjectiveTarget();if(!target)return;
    const y=target.y-(target.radius||30)-38+Math.sin(game.sceneTime*5)*5;
    ctx.save();ctx.translate(target.x,y);ctx.fillStyle="#ffd34f";ctx.shadowColor="#ffd34f";ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(0,14);ctx.lineTo(-12,-5);ctx.lineTo(12,-5);ctx.closePath();ctx.fill();ctx.restore();
  }

  function render() {
    const viewport=game.viewport;const dpr=viewport.dpr;
    context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,dom.canvas.width,dom.canvas.height);
    const shakeX=game.shake?Math.sin(game.sceneTime*70)*game.shake:0;const shakeY=game.shake?Math.cos(game.sceneTime*57)*game.shake:0;
    const visibleWidth=viewport.width/viewport.scale,visibleHeight=viewport.height/viewport.scale;
    const cameraX=visibleWidth>=WORLD_WIDTH?WORLD_WIDTH/2:clamp(game.camera.x,visibleWidth/2,WORLD_WIDTH-visibleWidth/2);
    const cameraY=visibleHeight>=WORLD_HEIGHT?WORLD_HEIGHT/2:clamp(game.camera.y,visibleHeight/2,WORLD_HEIGHT-visibleHeight/2);
    viewport.offsetX=viewport.width/2-cameraX*viewport.scale;
    viewport.offsetY=viewport.height/2-cameraY*viewport.scale;
    context.setTransform(dpr*viewport.scale,0,0,dpr*viewport.scale,dpr*(viewport.offsetX+shakeX*viewport.scale),dpr*(viewport.offsetY+shakeY*viewport.scale));
    drawBackground(context,game.chapter);
    drawPortal(context,game.chapter.portal,game.portalActive);
    drawPuzzle(context);
    game.memoryObjects.forEach(memory=>drawMemory(context,memory));
    drawObjectiveMarker(context);
    drawBoss(context,game.boss);
    drawProjectiles(context);
    drawGuardian(context);drawBird(context);drawBradley(context);drawClark(context);
    particles.draw(context);
    if(game.flash>0){context.fillStyle=`rgba(255,70,85,${game.flash})`;context.fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);}
  }

  function resizeCanvas() {
    const rect=dom.stage.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);
    dom.canvas.width=Math.max(1,Math.floor(rect.width*dpr));dom.canvas.height=Math.max(1,Math.floor(rect.height*dpr));
    const scale=Math.max(rect.width/WORLD_WIDTH,rect.height/WORLD_HEIGHT);
    game.viewport={width:rect.width,height:rect.height,dpr,scale,offsetX:(rect.width-WORLD_WIDTH*scale)/2,offsetY:(rect.height-WORLD_HEIGHT*scale)/2};
  }

  function frame(now) {
    const delta=Math.min(.034,Math.max(0,(now-game.lastFrame)/1000));game.lastFrame=now;
    if(game.mode==="playing")update(delta);
    if(dom.gameScreen.classList.contains("is-active"))render();
    if(game.mode==="dialogue"&&input.consume("Enter","Space","KeyE"))advanceDialogue();
    if((game.mode==="playing"||game.mode==="paused")&&input.consume("Escape","KeyP"))togglePause();
    input.endFrame();requestAnimationFrame(frame);
  }

  function togglePause(force) {
    if(!dom.gameScreen.classList.contains("is-active")||["story","dialogue","ending"].includes(game.mode))return;
    const shouldPause=typeof force==="boolean"?force:game.mode!=="paused";
    game.mode=shouldPause?"paused":"playing";dom.pauseOverlay.hidden=!shouldPause;
    if(shouldPause){dom.pauseStats.textContent=`Chapter ${game.chapter.id}: ${game.chapter.title} · Level ${save.level} · ${save.memories.length}/21 memories`;dom.resumeButton.focus();}
  }

  function showMenu() {
    game.mode="menu";dom.pauseOverlay.hidden=true;dom.storyOverlay.hidden=true;dom.dialogueOverlay.hidden=true;dom.endingOverlay.hidden=true;switchScreen("menu");updateMenu();dom.newGameButton.focus();
  }

  function buildChapterGrid() {
    dom.chapterGrid.innerHTML=Data.chapters.map(chapter=>{
      const locked=chapter.id>save.unlockedChapter;
      return `<button class="chapter-choice ${locked?"is-locked":""}" type="button" data-chapter="${chapter.id}" ${locked?"disabled":""}><img src="../comic/assets/comic-web-640/page-${String(chapter.page).padStart(2,"0")}.webp" alt=""><span>Chapter ${chapter.id}${save.completed.includes(chapter.id)?" · Complete":""}</span><strong>${chapter.title}</strong></button>`;
    }).join("");
    dom.chapterGrid.querySelectorAll("[data-chapter]").forEach(button=>button.addEventListener("click",()=>{dom.chapterOverlay.hidden=true;startChapter(Number(button.dataset.chapter),true);}));
  }

  function showChapters() { buildChapterGrid();dom.chapterOverlay.hidden=false;dom.chapterGrid.querySelector("button:not([disabled])")?.focus(); }

  function bindTouchStick() {
    let pointerId=null;
    const updateStick=event=>{
      const rect=dom.touchStick.getBoundingClientRect();const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;let dx=event.clientX-cx,dy=event.clientY-cy;const max=rect.width*.32;const length=Math.hypot(dx,dy)||1;if(length>max){dx=dx/length*max;dy=dy/length*max;}
      input.touchVector={x:dx/max,y:dy/max};dom.touchStickKnob.style.transform=`translate(${dx}px,${dy}px)`;
    };
    dom.touchStick.addEventListener("pointerdown",event=>{pointerId=event.pointerId;dom.touchStick.setPointerCapture(pointerId);updateStick(event);});
    dom.touchStick.addEventListener("pointermove",event=>{if(event.pointerId===pointerId)updateStick(event);});
    const release=event=>{if(event.pointerId!==pointerId)return;pointerId=null;input.touchVector={x:0,y:0};dom.touchStickKnob.style.transform="";};
    dom.touchStick.addEventListener("pointerup",release);dom.touchStick.addEventListener("pointercancel",release);
  }

  function bindEvents() {
    document.addEventListener("pointerdown",()=>sound.unlock(),{once:true});
    dom.continueButton.addEventListener("click",()=>startChapter(save.chapter,true));
    dom.newGameButton.addEventListener("click",()=>{
      const hasProgress=save.completed.length||save.memories.length;
      if(hasProgress&&!window.confirm("Start a new adventure and erase the current Codex Edition save?"))return;
      save=store.reset();sound.muted=false;player.maxHealth=save.maxHealth;player.maxEnergy=save.maxEnergy;player.weapon="leafblade";startChapter(1,true);
    });
    dom.chaptersButton.addEventListener("click",showChapters);dom.howButton.addEventListener("click",()=>{dom.howOverlay.hidden=false;dom.closeHow.focus();});
    dom.closeChapters.addEventListener("click",()=>{dom.chapterOverlay.hidden=true;dom.chaptersButton.focus();});dom.closeHow.addEventListener("click",()=>{dom.howOverlay.hidden=true;dom.howButton.focus();});
    dom.storyContinue.addEventListener("click",()=>{sound.play("click");if(game.storyAction)game.storyAction();});
    dom.dialogueOverlay.addEventListener("click",advanceDialogue);
    dom.pauseButton.addEventListener("click",()=>togglePause());dom.resumeButton.addEventListener("click",()=>togglePause(false));
    dom.restartButton.addEventListener("click",()=>{dom.pauseOverlay.hidden=true;resetChapterState(game.chapter.id);game.mode="playing";});dom.menuButton.addEventListener("click",showMenu);
    dom.soundButton.addEventListener("click",()=>{sound.muted=!sound.muted;persist(false);updateMenu();});
    dom.abilityButtons.forEach(button=>button.addEventListener("click",()=>{
      if(button.dataset.ability==="fist"&&player.selectedAbility==="fist")cycleWeapon();
      else selectAbility(button.dataset.ability);
    }));
    dom.companionButton.addEventListener("click",useCompanion);
    dom.endingChapters.addEventListener("click",()=>{dom.endingOverlay.hidden=true;showChapters();});dom.endingMenu.addEventListener("click",showMenu);
    dom.touchAttack.addEventListener("pointerdown",event=>{event.preventDefault();useSelectedAbility();});dom.touchWeapon.addEventListener("pointerdown",event=>{event.preventDefault();cycleWeapon();});dom.touchDash.addEventListener("pointerdown",event=>{event.preventDefault();useDash();});dom.touchInteract.addEventListener("pointerdown",event=>{event.preventDefault();interact();});dom.touchCompanion.addEventListener("pointerdown",event=>{event.preventDefault();useCompanion();});
    window.addEventListener("resize",resizeCanvas);document.addEventListener("visibilitychange",()=>{if(document.hidden&&game.mode==="playing")togglePause(true);});
    bindTouchStick();
  }

  function init() {
    bindEvents();updateMenu();resizeCanvas();resetChapterState(save.chapter);switchScreen("menu");game.mode="menu";requestAnimationFrame(frame);
  }

  init();
}());
