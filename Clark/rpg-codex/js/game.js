(function () {
  "use strict";

  const Data = window.PortalboundData;
  const Engine = window.PortalboundEngine;
  if (!Data || !Engine) throw new Error("Portalbound data or engine failed to load.");

  const { clamp, lerp, distance, normalize, circleHit, circleRectHit, Input, Sound, SaveStore, ParticleField } = Engine;
  const WORLD_WIDTH = 1280;
  const WORLD_HEIGHT = 720;
  const SAVE_KEY = "clark-portalbound-codex-save-v1";
  const usesTouchControls = () => navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;

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
    materialReadout: document.querySelector("#materialReadout"),
    soundButton: document.querySelector("#soundButton"),
    pauseButton: document.querySelector("#pauseButton"),
    comicWord: document.querySelector("#comicWord"),
    interactionPrompt: document.querySelector("#interactionPrompt"),
    saveToast: document.querySelector("#saveToast"),
    scanCard: document.querySelector("#scanCard"),
    scanIcon: document.querySelector("#scanIcon"),
    scanName: document.querySelector("#scanName"),
    scanWeak: document.querySelector("#scanWeak"),
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
    bestiaryButton: document.querySelector("#bestiaryButton"),
    bestiaryOverlay: document.querySelector("#bestiaryOverlay"),
    closeBestiary: document.querySelector("#closeBestiary"),
    bestiaryGrid: document.querySelector("#bestiaryGrid"),
    forgeButton: document.querySelector("#forgeButton"),
    restoreButton: document.querySelector("#restoreButton"),
    forgeOverlay: document.querySelector("#forgeOverlay"),
    closeForge: document.querySelector("#closeForge"),
    materialInventory: document.querySelector("#materialInventory"),
    forgeGrid: document.querySelector("#forgeGrid"),
    endingOverlay: document.querySelector("#endingOverlay"),
    endingImage: document.querySelector("#endingImage"),
    endingChapters: document.querySelector("#endingChapters"),
    endingMenu: document.querySelector("#endingMenu"),
    companionButton: document.querySelector("#companionButton"),
    companionAction: document.querySelector("#companionAction"),
    companionCooldown: document.querySelector("#companionCooldown"),
    weaponButton: document.querySelector("#weaponButton"),
    weaponIcon: document.querySelector("#weaponIcon"),
    weaponName: document.querySelector("#weaponName"),
    weaponRank: document.querySelector("#weaponRank"),
    weaponDockRank: document.querySelector("#weaponDockRank"),
    weaponSlots: [...document.querySelectorAll("[data-weapon]")],
    weaponTraits: document.querySelector("#weaponTraits"),
    comboPips: [...document.querySelectorAll("#comboPips i")],
    comboLabel: document.querySelector("#comboPips span"),
    skillRanks: [...document.querySelectorAll("[data-skill-rank]")],
    abilityButtons: [...document.querySelectorAll("[data-ability]")],
    touchStick: document.querySelector("#touchStick"),
    touchStickKnob: document.querySelector("#touchStick span"),
    touchAttack: document.querySelector("#touchAttack"),
    touchWeapon: document.querySelector("#touchWeapon"),
    touchBolt: document.querySelector("#touchBolt"),
    touchShield: document.querySelector("#touchShield"),
    touchDash: document.querySelector("#touchDash"),
    touchInteract: document.querySelector("#touchInteract"),
    touchInteractLabel: document.querySelector("#touchInteractLabel"),
    touchCompanion: document.querySelector("#touchCompanion"),
    touchBoltLabel: document.querySelector("#touchBolt small"),
    touchDashLabel: document.querySelector("#touchDash small"),
    touchShieldLabel: document.querySelector("#touchShield small"),
    touchCompanionLabel: document.querySelector("#touchCompanion small"),
    liveRegion: document.querySelector("#liveRegion")
  };

  const context = dom.canvas.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const BACKGROUND_SOURCES = [null,
    "assets/chapter1/meadow.webp",
    "assets/chapters/chapter-02.webp",
    "assets/chapters/chapter-03.webp",
    "assets/chapters/chapter-04.webp",
    "assets/chapters/chapter-05.webp",
    "assets/chapters/chapter-06.webp",
    "assets/chapters/chapter-07.webp"
  ];
  const PROP_SOURCES = {
    clark: "assets/chapter1/clark.webp",
    piMonster: "assets/chapter1/pi-monster.webp",
    leafblade: "assets/chapter1/leafblade.webp",
    cometHammer: "assets/weapons/comet-hammer.webp"
  };
  const art = {
    backgrounds: Array(BACKGROUND_SOURCES.length).fill(null),
    monsters: {},
    props: {},
    heroAnimation: null,
    heroRig: null,
    monsterAtlas: null,
    finalMonsterAtlas: null,
    bossAtlas: null,
    bossAnimations: {},
    worldObjectAtlas: null,
    companionAtlas: null,
    combatEffectsAtlas: null
  };
  // Stand-in for a prop that has not been requested yet, so draw code can test
  // .complete/.naturalWidth without a null check and fall back to vector art.
  const PENDING_ART = Object.freeze({ complete: false, naturalWidth: 0 });
  const WEAPONS = {
    leafblade: { name: "Portal Leafblade", shortName: "Leafblade", icon: "⚔", unlockChapter: 1 },
    hammer: { name: "Comet Hammer", shortName: "Comet Hammer", icon: "◆", unlockChapter: 3 }
  };
  const WEAPON_ORDER = ["leafblade", "hammer"];
  const MATERIAL_LABELS = { gel: "Rift Gel", moss: "Soft Moss", amber: "Amber Shell", shard: "Star Shard", prism: "Prism Dust", cog: "Clockwork Cog", silk: "Moon Silk", void: "Void Drop", fiber: "Thorn Fiber", vine: "Living Vine", crystal: "Storm Crystal", wing: "Storm Wing", page: "Living Page" };
  const FORGE_RECIPES = {
    leafblade: [
      { gel: 3, moss: 2 },
      { prism: 3, cog: 3 },
      { fiber: 4, vine: 3 }
    ],
    hammer: [
      { amber: 2, shard: 3 },
      { silk: 3, void: 3 },
      { crystal: 2, wing: 4 }
    ]
  };
  const WEAPON_TRAITS = {
    leafblade: [
      { id: "windstep", name: "Windstep", icon: "↝", desc: "Faster combo rhythm" },
      { id: "thornedge", name: "Thorn Edge", icon: "✦", desc: "Sharper critical hits" },
      { id: "bloomarc", name: "Bloom Arc", icon: "❋", desc: "Wider finishing spin" }
    ],
    hammer: [
      { id: "breaker", name: "Starbreaker", icon: "◆", desc: "More damage to armor" },
      { id: "quake", name: "Quakeheart", icon: "⌁", desc: "Larger smash radius" },
      { id: "meteor", name: "Meteor Core", icon: "☄", desc: "Faster, stronger charge" }
    ]
  };
  // The counter each weakness asks for. Icons match the ability bar in index.html
  // so the badge over a monster reads as "press that one".
  const WEAKNESS_INFO = {
    hammer: { icon: "◆", label: "Comet Hammer", color: "#ff9f1c" },
    dash:   { icon: "➜", label: "Rocket Dash",  color: "#69e5ff" },
    shield: { icon: "◈", label: "Leaf Shield",  color: "#8ce568" }
  };
  const ROMAN_RANKS = ["I", "II", "III", "IV"];
  let traitUiSignature = "";
  let hudHeartSignature = "";
  const MONSTER_SOURCES = {
    slime: "assets/monsters/rift-slime.webp",
    drone: "assets/monsters/star-drone.webp",
    thornling: "assets/monsters/thornling.webp",
    wisp: "assets/monsters/storm-wisp.webp"
  };
  const MONSTER_ATLAS_SOURCE = "assets/monsters/generated/storybook-monster-atlas-v1.webp";
  const MONSTER_ATLAS_CELLS = {
    mossling: [0,0], sandbeetle: [1,0], prismimp: [2,0],
    gearbug: [0,1], shadowmoth: [1,1], voidling: [2,1],
    vinebrute: [0,2], stormbat: [1,2], bookwisp: [2,2]
  };
  const FINAL_MONSTER_ATLAS_SOURCE = "assets/monsters/generated/final-trial-monster-atlas-v1.webp";
  const FINAL_MONSTER_ATLAS_CELLS = { inkhound: [0,0], runeknight: [1,0], quillseer: [2,0] };
  const BOSS_ATLAS_SOURCE = "assets/bosses/generated/storybook-boss-atlas-v1.webp";
  const BOSS_ATLAS_CELLS = { pi: [0,0], warden: [1,0], engine: [2,0], shadow: [3,0], golem: [0,1], raven: [1,1], final: [2,1] };
  const HERO_ANIMATION_SOURCE = "assets/characters/animations/clark-action-atlas-v4.webp";
  const HERO_ANIMATION_ROWS = Object.freeze({ idle: 0, move: 1, leafblade: 2, hammer: 3, dash: 4, hurt: 5 });
  const HERO_RIG_SOURCE = "assets/characters/rig/clark-puppet-parts-tight-v1.png";
  const HERO_RIG_CELLS = Object.freeze({
    head: [0,0], torso: [1,0], cape: [2,0],
    upperArm: [0,1], lowerArm: [1,1], fist: [2,1], openHand: [3,1],
    thigh: [0,2], shin: [1,2], bootRight: [2,2], bootLeft: [3,2]
  });
  const BOSS_ANIMATION_SOURCES = {
    pi: "assets/bosses/animations/pi-action-atlas-v2.webp",
    warden: "assets/bosses/animations/warden-action-atlas-v2.webp",
    engine: "assets/bosses/animations/engine-action-atlas-v2.webp",
    shadow: "assets/bosses/animations/shadow-action-atlas-v2.webp",
    golem: "assets/bosses/animations/golem-action-atlas-v2.webp",
    raven: "assets/bosses/animations/raven-action-atlas-v2.webp",
    final: "assets/bosses/animations/final-action-atlas-v2.webp"
  };
  const BOSS_ANIMATION_ROWS = Object.freeze({ idle: 0, move: 1, hurt: 2, attack: 3, death: 4 });
  const BOSS_SPRITE_SIZES = {
    pi: [190,174], warden: [172,168], engine: [178,174], shadow: [188,178],
    golem: [174,174], raven: [194,178], final: [174,178]
  };
  const WORLD_OBJECT_ATLAS_SOURCE = "assets/props/generated/storybook-world-object-atlas-v1.webp";
  const WORLD_OBJECT_CELLS = {
    portal: [0,0], crackedStone: [1,0], energyCore: [2,0], starRune: [3,0],
    leafRune: [0,1], spiralRune: [1,1], musicRune: [2,1], runeBlock: [3,1],
    goalSocket: [0,2], coopPlate: [1,2], memory: [2,2], healingShrine: [3,2]
  };
  const COMPANION_ATLAS_SOURCE = "assets/companions/generated/storybook-companion-atlas-v1.webp";
  const COMPANION_ATLAS_CELLS = { bradley: [0,0], bird: [1,0], guardian: [2,0] };
  const COMBAT_EFFECTS_ATLAS_SOURCE = "assets/effects/generated/storybook-combat-effects-atlas-v1.webp";
  const COMBAT_EFFECT_CELLS = {
    star: [0,0], storm: [1,0], pi: [2,0], crystal: [3,0], gear: [0,1], crescent: [1,1],
    feather: [2,1], rune: [3,1], prism: [0,2], shadow: [1,2], leafSlash: [2,2], hammerShockwave: [3,2]
  };
  const ELITE_TRAITS = {
    1: { id: "splitter", name: "SPLITTER", color: "#8ce568", hint: "Splits into two Mosslings" },
    2: { id: "shell", name: "STAR SHELL", color: "#ffd34f", hint: "Armor yields to its weakness" },
    3: { id: "overclock", name: "OVERCLOCK", color: "#69e5ff", hint: "Attacks in rapid bursts" },
    4: { id: "phase", name: "PHASEWALKER", color: "#d6a4ff", hint: "Fades out of danger" },
    5: { id: "regrowth", name: "REGROWTH", color: "#8ce568", hint: "Slowly restores health" },
    6: { id: "tempest", name: "TEMPEST", color: "#69cfff", hint: "Releases storm rings" },
    7: { id: "summoner", name: "PAGECALLER", color: "#ffd34f", hint: "Calls Ink Hounds at half health" }
  };
  const MONSTER_TYPES = {
    slime: { name: "Rift Slime", hp: 3, radius: 25, speed: 78, behavior: "melee", damage: 1, weakness: "hammer", xp: 8, width: 82, height: 75, color: "#a65dff" },
    drone: { name: "Star Drone", hp: 4, radius: 25, speed: 66, behavior: "ranged", damage: 1, weakness: "hammer", xp: 10, width: 82, height: 82, color: "#69e5ff" },
    thornling: { name: "Thornling", hp: 4, radius: 26, speed: 92, behavior: "charger", damage: 1, weakness: "dash", xp: 10, width: 80, height: 80, color: "#8ce568" },
    wisp: { name: "Storm Wisp", hp: 3, radius: 24, speed: 84, behavior: "ranged", damage: 1, weakness: "shield", xp: 11, width: 76, height: 80, color: "#ffd34f" },
    mossling: { name: "Mossling", hp: 3, radius: 24, speed: 82, behavior: "melee", damage: 1, weakness: "hammer", xp: 9, width: 78, height: 78, color: "#5fb878" },
    sandbeetle: { name: "Sand Beetle", hp: 5, radius: 27, speed: 86, behavior: "charger", damage: 1, weakness: "dash", xp: 12, width: 86, height: 78, color: "#d9924f" },
    prismimp: { name: "Prism Imp", hp: 4, radius: 24, speed: 70, behavior: "ranged", damage: 1, weakness: "hammer", xp: 12, width: 78, height: 82, color: "#ee7dff" },
    shadowmoth: { name: "Shadow Moth", hp: 4, radius: 25, speed: 76, behavior: "ranged", damage: 1, weakness: "shield", xp: 13, width: 88, height: 78, color: "#b875e8" },
    vinebrute: { name: "Vine Brute", hp: 6, radius: 29, speed: 68, behavior: "charger", damage: 2, weakness: "dash", xp: 14, width: 94, height: 92, color: "#74b95e" },
    stormbat: { name: "Storm Bat", hp: 4, radius: 24, speed: 102, behavior: "ranged", damage: 1, weakness: "shield", xp: 14, width: 88, height: 76, color: "#77b9df" },
    bookwisp: { name: "Book Wisp", hp: 5, radius: 25, speed: 88, behavior: "ranged", damage: 1, weakness: "hammer", xp: 16, width: 88, height: 84, color: "#e9b85e" },
    gearbug: { name: "Gear Bug", hp: 5, radius: 25, speed: 74, behavior: "charger", damage: 1, weakness: "dash", xp: 13, width: 84, height: 78, color: "#c2a15a" },
    voidling: { name: "Voidling", hp: 4, radius: 24, speed: 80, behavior: "ranged", damage: 1, weakness: "shield", xp: 13, width: 82, height: 82, color: "#8c78c7" },
    inkhound: { name: "Ink Hound", hp: 5, radius: 25, speed: 112, behavior: "melee", damage: 1, weakness: "dash", xp: 16, width: 92, height: 78, color: "#7e55c9" },
    runeknight: { name: "Rune Knight", hp: 8, radius: 29, speed: 64, behavior: "charger", damage: 2, weakness: "hammer", xp: 19, width: 94, height: 94, color: "#d2a252" },
    quillseer: { name: "Quill Seer", hp: 5, radius: 25, speed: 78, behavior: "ranged", damage: 1, weakness: "shield", xp: 18, width: 90, height: 92, color: "#69cfea" }
  };
  const MONSTER_NOTES = {
    slime: ["Meadow", "Hammer", "Gel", "Bouncy pounce"], drone: ["Skyway", "Hammer", "Shard", "Twin star shots"],
    mossling: ["Meadow", "Hammer", "Moss", "Leaf-cap melee"], sandbeetle: ["Dunes", "Dash", "Amber", "Burrowing charge"],
    prismimp: ["Clockwork", "Hammer", "Prism", "Splitting prism bolts"], gearbug: ["Clockwork", "Dash", "Cog", "Gear rush"],
    shadowmoth: ["Gloam", "Shield", "Silk", "Curving shadow volley"], voidling: ["Gloam", "Shield", "Void", "Orbiting void shots"],
    thornling: ["Wildwood", "Dash", "Fiber", "Thornline charge"], vinebrute: ["Wildwood", "Dash", "Vine", "Heavy vine rush"],
    stormbat: ["Stormpeak", "Shield", "Wing", "Five-feather fan"], wisp: ["Stormpeak", "Shield", "Crystal", "Curling storm shots"],
    bookwisp: ["Finale", "Hammer", "Page", "Homing rune volley"],
    inkhound: ["Finale", "Dash", "Void", "Fast ink pounce"], runeknight: ["Finale", "Hammer", "Page", "Armored rune charge"],
    quillseer: ["Finale", "Shield", "Page", "Curving quill fan"]
  };
  const CHAPTER_ENCOUNTERS = {
    1: [["slime",280,525],["mossling",530,345],["mossling",865,535],["slime",905,185]],
    2: [["drone",245,455],["sandbeetle",505,350],["sandbeetle",760,585],["drone",920,300]],
    3: [["prismimp",245,570],["prismimp",545,345],["gearbug",900,155],["gearbug",910,560],["prismimp",770,365]],
    4: [["shadowmoth",275,350],["shadowmoth",500,555],["voidling",740,430],["voidling",910,235],["shadowmoth",985,540]],
    5: [["thornling",245,555],["vinebrute",515,175],["vinebrute",810,540],["thornling",930,175],["vinebrute",870,330]],
    6: [["stormbat",270,320],["stormbat",610,535],["wisp",520,155],["stormbat",855,535],["wisp",975,265],["stormbat",760,300]],
    7: [["inkhound",255,570],["inkhound",315,340],["bookwisp",555,540],["quillseer",650,300],["inkhound",870,175],["bookwisp",950,520]]
  };
  const FINAL_WAVES = [
    [["inkhound",275,350],["inkhound",520,185],["bookwisp",760,535],["quillseer",1010,220]],
    [["runeknight",250,180],["quillseer",430,550],["bookwisp",700,180],["runeknight",930,545],["quillseer",1080,330]],
    [["inkhound",235,350],["runeknight",420,175],["quillseer",420,545],["bookwisp",725,175],["runeknight",725,545],["quillseer",1040,350]]
  ];
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
    runeGuards: new Map(),
    puzzleSolved: false,
    portalActive: false,
    portalTransitioning: false,
    aimTarget: null,
    aimTargetTime: 0,
    sceneTime: 0,
    timeLeft: null,
    shake: 0,
    flash: 0,
    flashColor: "255,70,85",
    zoomPunch: 0,
    hitStop: 0,
    messageTimer: 0,
    storyAction: null,
    dialogueQueue: [],
    dialogueDone: null,
    nearestInteraction: null,
    attacks: [],
    projectiles: [],
    enemyProjectiles: [],
    enemies: [],
    waveIndex: 0,
    waveDelay: 0,
    spawnSerial: 0,
    memoryObjects: [],
    healingShrine: null,
    obstacles: [],
    boss: null,
    block: null,
    camera: { x: 640, y: 360 },
    viewport: { width: 1280, height: 720, scale: 1, offsetX: 0, offsetY: 0, dpr: 1 },
    lastFrame: performance.now()
  };

  function loadBackground(chapterId) {
    if (!art.backgrounds[chapterId] && BACKGROUND_SOURCES[chapterId]) {
      art.backgrounds[chapterId] = Object.assign(new Image(), { src: BACKGROUND_SOURCES[chapterId] });
    }
    return art.backgrounds[chapterId];
  }

  function loadMonsterArt(type) {
    if (!art.monsters[type] && MONSTER_SOURCES[type]) {
      art.monsters[type] = Object.assign(new Image(), { src: MONSTER_SOURCES[type] });
    }
    return art.monsters[type];
  }

  function loadMonsterAtlas() {
    if (!art.monsterAtlas) art.monsterAtlas = Object.assign(new Image(), { src: MONSTER_ATLAS_SOURCE });
    return art.monsterAtlas;
  }

  function loadFinalMonsterAtlas() {
    if (!art.finalMonsterAtlas) art.finalMonsterAtlas = Object.assign(new Image(), { src: FINAL_MONSTER_ATLAS_SOURCE });
    return art.finalMonsterAtlas;
  }

  function loadBossAtlas() {
    if (!art.bossAtlas) art.bossAtlas = Object.assign(new Image(), { src: BOSS_ATLAS_SOURCE });
    return art.bossAtlas;
  }

  function loadHeroAnimation() {
    if (!art.heroAnimation) art.heroAnimation = Object.assign(new Image(), { src: HERO_ANIMATION_SOURCE });
    return art.heroAnimation;
  }

  function loadHeroRig() {
    if (!art.heroRig) art.heroRig = Object.assign(new Image(), { src: HERO_RIG_SOURCE });
    return art.heroRig;
  }

  function loadBossAnimation(type) {
    const source = BOSS_ANIMATION_SOURCES[type];
    if (!source) return PENDING_ART;
    if (!art.bossAnimations[type]) art.bossAnimations[type] = Object.assign(new Image(), { src: source });
    return art.bossAnimations[type];
  }

  function loadWorldObjectAtlas() {
    if (!art.worldObjectAtlas) art.worldObjectAtlas = Object.assign(new Image(), { src: WORLD_OBJECT_ATLAS_SOURCE });
    return art.worldObjectAtlas;
  }

  function loadCompanionAtlas() {
    if (!art.companionAtlas) art.companionAtlas = Object.assign(new Image(), { src: COMPANION_ATLAS_SOURCE });
    return art.companionAtlas;
  }

  function loadCombatEffectsAtlas() {
    if (!art.combatEffectsAtlas) art.combatEffectsAtlas = Object.assign(new Image(), { src: COMBAT_EFFECTS_ATLAS_SOURCE });
    return art.combatEffectsAtlas;
  }

  // Props are fetched the first time a chapter actually needs them: the Pi Monster
  // never downloads if you start at Chapter 7, and the Comet Hammer waits until
  // it is unlocked.
  function loadProp(key) {
    if (!art.props[key] && PROP_SOURCES[key]) {
      art.props[key] = Object.assign(new Image(), { src: PROP_SOURCES[key] });
    }
    return art.props[key] || PENDING_ART;
  }

  const player = {
    x: 120, y: 360, radius: 23,
    health: save.maxHealth, maxHealth: save.maxHealth,
    energy: save.maxEnergy, maxEnergy: save.maxEnergy,
    speed: 245, facing: { x: 1, y: 0 },
    invulnerable: 0, attackCooldown: 0, dashCooldown: 0, dashTime: 0,
    shieldTime: 0, moving: false, walkCycle: 0,
    weapon: save.weapon === "hammer" && save.unlockedChapter >= 3 ? "hammer" : "leafblade", comboStep: 0, comboTimer: 0, attackKind: "leafblade", touchAttackHeld: false,
    attackTime: 0, attackDuration: .3, attackDirection: { x: 1, y: 0 }, hammerCharging: false, hammerCharge: 0, perfectDodgeTime: 0, counterReadyTime: 0, counterCooldown: 0, dashStrikeWindow: 0,
    hurtTime: 0, animationTime: 0, animState: "idle", animStateTime: 0,
    previousAnimState: "idle", previousAnimStateTime: 0, animBlend: 1,
    capeAngle: -.08, capeVelocity: 0
  };

  const bradley = { x: 80, y: 390, radius: 20, cooldown: 0, facing: { x: 1, y: 0 }, command: "follow", target: null };
  const bird = { x: 70, y: 320, angle: 0, found: null };
  const guardian = { x: 55, y: 275, angle: 0 };

  function announce(text) {
    dom.liveRegion.textContent = "";
    requestAnimationFrame(() => { dom.liveRegion.textContent = text; });
  }

  function haptic(pattern) {
    if (!usesTouchControls() || typeof navigator.vibrate !== "function") return;
    try { navigator.vibrate(pattern); } catch (_) { /* Unsupported iPads simply ignore haptics. */ }
  }

  function impactFeedback(hit, kind = "light") {
    if (hit.feedbackPlayed) return;
    hit.feedbackPlayed = true;
    const heavy = kind === "heavy" || kind === "critical" || kind === "counter";
    sound.play(kind === "counter" ? "counter" : kind === "heavy" ? "hammerHit" : kind === "critical" ? "criticalHit" : "leafHit");
    game.hitStop = Math.max(game.hitStop, kind === "counter" ? .1 : heavy ? .075 : .035);
    game.shake = Math.max(game.shake, kind === "counter" ? 9 : heavy ? 6 : 2.5);
    game.zoomPunch = Math.max(game.zoomPunch, kind === "counter" ? .045 : heavy ? .026 : .012);
    haptic(kind === "counter" ? [18, 24, 28] : heavy ? 28 : 10);
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

  function hasAnyProgress(data = save) {
    const materialCount = Object.values(data.materials || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const defeatedCount = Object.values(data.defeated || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const forged = Object.values(data.weaponUpgrades || {}).some(value => Number(value) > 0);
    return data.chapter > 1 || data.unlockedChapter > 1 || data.level > 1 || data.xp > 0 || data.completed.length > 0 || data.memories.length > 0 || materialCount > 0 || defeatedCount > 0 || data.scanned.length > 0 || forged || Object.values(data.weaponTraits || {}).some(Boolean);
  }

  function updateMenu() {
    const hasProgress = hasAnyProgress();
    dom.continueButton.hidden = !hasProgress;
    dom.continueButton.textContent = hasProgress ? `Continue · Chapter ${save.chapter}` : "Continue Adventure";
    dom.restoreButton.hidden = !store.hasBackup();
    dom.soundButton.textContent = sound.muted ? "×" : "♪";
    dom.soundButton.setAttribute("aria-label", sound.muted ? "Turn sound on" : "Mute sound");
  }

  function gainExperience(amount) {
    save.xp += amount;
    let levelled = false;
    // A single award can cross more than one threshold — the boss hands out 100 XP
    // at once — so keep levelling until the bank is short of the next rank.
    while (save.level < 10 && save.xp >= save.level * 120) {
      save.xp -= save.level * 120;
      save.level += 1;
      levelled = true;
      if (save.level % 2 === 0) {
        save.maxHealth = Math.min(12, save.maxHealth + 1);
        player.maxHealth = save.maxHealth;
        player.health = player.maxHealth;
      } else {
        save.maxEnergy = Math.min(160, save.maxEnergy + 10);
        player.maxEnergy = save.maxEnergy;
        player.energy = player.maxEnergy;
      }
    }
    if (levelled) {
      showComicWord("LEVEL UP!", "#8ce568");
      sound.play("success");
      announce(`Level up. Clark is now level ${save.level}.`);
    }
    persist(false);
  }

  // Abilities, weapons and companions are rewards you keep: they all gate on how
  // far the adventure has been pushed, not on which chapter is loaded right now.
  // Gating on the current chapter used to strip Clark's skills when replaying an
  // early chapter while leaving the Comet Hammer in his hands.
  function hasUnlocked(chapterNeeded) { return save.unlockedChapter >= chapterNeeded; }

  // Is the counter for this weakness usable this instant? Drives the badge
  // pulse, so "your current tool beats this one" is readable without menus.
  function weaknessReady(weakness) {
    if (weakness === "hammer") return player.weapon === "hammer";
    if (weakness === "dash") return hasUnlocked(3) && player.dashCooldown <= 0 && player.energy >= skillCost("dash");
    if (weakness === "shield") return hasUnlocked(4) && player.shieldTime <= 0 && player.energy >= skillCost("shield");
    return false;
  }

  // First sighting of a monster type posts its field-note card, once ever.
  function scanMonster(type) {
    if (!type || save.scanned.includes(type)) return;
    save.scanned.push(type);
    const spec = MONSTER_TYPES[type];
    const info = WEAKNESS_INFO[spec.weakness];
    dom.scanName.textContent = spec.name;
    dom.scanName.style.color = spec.color;
    dom.scanIcon.textContent = info.icon;
    dom.scanIcon.style.color = info.color;
    dom.scanWeak.textContent = `Weak to ${info.label}`;
    dom.scanCard.classList.add("is-showing");
    clearTimeout(scanMonster.timer);
    scanMonster.timer = setTimeout(() => dom.scanCard.classList.remove("is-showing"), 3600);
    sound.play("pickup");
    announce(`New field note: ${spec.name}, weak to ${info.label}.`);
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

  function buildEnemy(chapter, type, x, y, index, elite = false, options = {}) {
    const spec = MONSTER_TYPES[type];
    const scale = options.scale || 1;
    const eliteTrait = elite ? ELITE_TRAITS[chapter.id] : null;
    loadMonsterArt(type);
    if (MONSTER_ATLAS_CELLS[type]) loadMonsterAtlas();
    if (FINAL_MONSTER_ATLAS_CELLS[type]) loadFinalMonsterAtlas();
    const maxHp = Math.max(1, Math.round((spec.hp + (elite ? 2 : 0)) * scale));
    return {
      ...spec,
      id: options.id || `${chapter.id}-${index}`,
      type,
      elite,
      eliteTrait,
      eliteTimer: elite ? 1.4 + Math.random() * 1.2 : 0,
      eliteTriggered: false,
      phaseTime: 0,
      noDrop: Boolean(options.noDrop),
      speed: spec.speed * (elite ? 1.12 : 1) * (eliteTrait?.id === "overclock" ? 1.18 : 1),
      damage: spec.damage + (elite ? 1 : 0),
      xp: Math.max(1, Math.round((spec.xp + (elite ? 8 : 0)) * scale)),
      radius: (spec.radius + (elite ? 3 : 0)) * scale,
      width: spec.width * scale,
      height: spec.height * scale,
      x, y,
      homeX: x,
      homeY: y,
      hp: maxHp,
      maxHp,
      active: true,
      invulnerable: 0,
      attackCooldown: (elite ? .35 : .5) + Math.random() * (elite ? .8 : 1.2),
      contactCooldown: 0,
      chargeTime: 0,
      windupTime: 0,
      marked: 0,
      stunTime: 0,
      exposed: 0,
      hitStagger: 0,
      attackDirection: { x: 1, y: 0 },
      phase: Math.random() * Math.PI * 2,
      facingX: 1
    };
  }

  function createEnemies(chapter, encounters = CHAPTER_ENCOUNTERS[chapter.id]) {
    game.spawnSerial = 0;
    game.enemies = (encounters || []).map(([type, x, y], index) => buildEnemy(chapter, type, x, y, index, index % 4 === 3));
  }

  function spawnEnemy(type, x, y, options = {}) {
    if (!MONSTER_TYPES[type]) return null;
    const id = `${game.chapter.id}-spawn-${game.spawnSerial++}`;
    const enemy = buildEnemy(game.chapter, type, clamp(x, 70, WORLD_WIDTH - 70), clamp(y, 70, WORLD_HEIGHT - 70), game.enemies.length, false, { ...options, id });
    game.enemies.push(enemy);
    return enemy;
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
    game.coopSolved = false;
    game.coopPuzzle = game.chapter.cooperation ? { ...game.chapter.cooperation } : null;
    game.portalActive = false;
    game.portalTransitioning = false;
    game.aimTarget = null;
    game.aimTargetTime = 0;
    game.sceneTime = 0;
    game.hitStop = 0;
    game.zoomPunch = 0;
    game.timeLeft = game.chapter.timed || null;
    game.attacks = [];
    game.projectiles = [];
    game.enemyProjectiles = [];
    createEnemies(game.chapter);
    assignRuneGuards(game.chapter);
    game.boss = null;
    game.waveIndex = 0;
    game.waveDelay = 0;
    game.obstacles = chapterObstacles(game.chapter);
    game.healingShrine = {
      x: clamp(game.chapter.start.x + 105, 95, WORLD_WIDTH - 95),
      y: clamp(game.chapter.start.y - 82, 95, WORLD_HEIGHT - 95),
      radius: 42,
      cooldown: 0,
      cooldownMax: 28
    };
    loadBackground(game.chapter.id);
    loadBossAtlas();
    loadWorldObjectAtlas();
    loadCompanionAtlas();
    loadCombatEffectsAtlas();
    loadProp("clark");
    loadHeroAnimation();
    loadHeroRig();
    loadProp("leafblade");
    if (save.unlockedChapter >= WEAPONS.hammer.unlockChapter) loadProp("cometHammer");
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
    player.hammerCharging = false;
    player.hammerCharge = 0;
    player.perfectDodgeTime = 0;
    player.counterReadyTime = 0;
    player.counterCooldown = 0;
    player.hurtTime = 0;
    player.animationTime = 0;
    player.animState = "idle";
    player.animStateTime = 0;
    player.previousAnimState = "idle";
    player.previousAnimStateTime = 0;
    player.animBlend = 1;
    player.capeAngle = -.08;
    player.capeVelocity = 0;
    player.dashStrikeWindow = 0;
    player.comboStep = 0;
    player.comboTimer = 0;
    player.touchAttackHeld = false;
    if (save.unlockedChapter < WEAPONS[player.weapon].unlockChapter) player.weapon = "leafblade";
    player.dashCooldown = 0;
    player.dashTime = 0;
    player.shieldTime = 0;
    player.walkCycle = 0;
    bradley.x = player.x - 45;
    bradley.y = player.y + 35;
    bradley.cooldown = 0;
    bradley.command = "follow";
    bradley.target = null;
    bird.x = player.x - 50;
    bird.y = player.y - 35;
    bird.found = null;
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
    if (dom.endingImage?.dataset.src) {
      dom.endingImage.src = dom.endingImage.dataset.src;
      delete dom.endingImage.dataset.src;
    }
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
      const locked = !hasUnlocked(unlockChapter);
      button.classList.toggle("is-locked", locked);
      button.disabled = locked;
    });
    dom.companionButton.disabled = !hasUnlocked(2);
    dom.companionButton.classList.toggle("is-locked", !hasUnlocked(2));
    dom.touchBolt.hidden = !hasUnlocked(Data.abilityUnlocks.bolt);
    dom.touchDash.hidden = !hasUnlocked(Data.abilityUnlocks.dash);
    dom.touchShield.hidden = !hasUnlocked(Data.abilityUnlocks.shield);
    dom.touchCompanion.hidden = !hasUnlocked(2);
  }

  function weaponRank() {
    return Math.min(4, 1 + Math.floor(save.memories.length / 5));
  }

  function weaponForgeLevel(weapon = player.weapon) { return clamp(Number(save.weaponUpgrades?.[weapon] || 0), 0, 3); }
  function forgedDamage(weapon, amount) { return Math.max(1, Math.round(amount * (1 + weaponForgeLevel(weapon) * .18))); }
  function forgedRecovery(weapon, duration) { return duration * (1 - weaponForgeLevel(weapon) * .04); }

  function skillRank() { return weaponRank(); }
  function skillCost(name, rank = skillRank()) {
    const costs = {
      bolt: [14, 13, 12, 10],
      dash: [12, 11, 10, 9],
      shield: [18, 17, 15, 14]
    };
    return costs[name]?.[rank - 1] || 0;
  }
  function companionCooldownMax(rank = skillRank()) { return 6 - (rank - 1) * .5; }

  function cycleWeapon() {
    const candidates = WEAPON_ORDER.filter(key => save.unlockedChapter >= WEAPONS[key].unlockChapter);
    if (candidates.length < 2) {
      showComicWord("LOCKED!", "#ffd34f");
      announce("The Comet Hammer unlocks after completing Chapter 2.");
      return;
    }
    const currentIndex = candidates.indexOf(player.weapon);
    selectWeapon(candidates[(currentIndex + 1) % candidates.length]);
  }

  function selectWeapon(key, feedback = true) {
    const weapon = WEAPONS[key];
    if (!weapon) return false;
    if (save.unlockedChapter < weapon.unlockChapter) {
      showComicWord("LOCKED!", "#ffd34f");
      announce(`${weapon.name} unlocks after completing Chapter 2.`);
      return false;
    }
    const changed = player.weapon !== key;
    player.weapon = key;
    if (changed) {
      player.comboStep = 0;
      player.comboTimer = 0;
      player.hammerCharging = false;
      player.hammerCharge = 0;
      player.attackCooldown = Math.min(player.attackCooldown, .12);
      save.weapon = key;
      store.save(save);
    }
    updateWeaponHud();
    if (feedback && changed) {
      sound.play("click");
      showComicWord(key === "hammer" ? "HEAVY!" : "QUICK!", key === "hammer" ? "#ff9f1c" : "#b7ff9b");
      announce(`${weapon.name} equipped.`);
    }
    return true;
  }

  function updateWeaponHud() {
    const weapon = WEAPONS[player.weapon];
    const rank = weaponRank();
    dom.weaponIcon.textContent = weapon.icon;
    dom.weaponName.textContent = weapon.shortName;
    const forge = weaponForgeLevel();
    dom.weaponRank.textContent = `Rank ${ROMAN_RANKS[rank - 1]} · Forge +${forge}`;
    dom.weaponDockRank.textContent = `Rank ${ROMAN_RANKS[rank - 1]} · +${forge}`;
    dom.weaponButton.title = `${weapon.name}, Rank ${ROMAN_RANKS[rank - 1]}. Press R or click again to switch.`;
    dom.touchAttack.textContent = weapon.icon;
    dom.touchAttack.setAttribute("aria-label", `Hold to attack with ${weapon.name}`);
    dom.touchWeapon.hidden = save.unlockedChapter < WEAPONS.hammer.unlockChapter;
    dom.touchWeapon.textContent = player.weapon === "hammer" ? "⚔" : "◆";
    dom.touchWeapon.setAttribute("aria-label", `Switch to ${player.weapon === "hammer" ? WEAPONS.leafblade.name : WEAPONS.hammer.name}`);
    dom.weaponSlots.forEach(slot => {
      const slotWeapon = WEAPONS[slot.dataset.weapon];
      const locked = save.unlockedChapter < slotWeapon.unlockChapter;
      slot.classList.toggle("is-active", slot.dataset.weapon === player.weapon);
      slot.classList.toggle("is-locked", locked);
      slot.setAttribute("aria-pressed", String(slot.dataset.weapon === player.weapon));
      slot.setAttribute("aria-disabled", String(locked));
      const hint = slot.querySelector("small");
      if (hint) hint.textContent = locked ? "X · Chapter 3" : slot.dataset.weapon === "hammer" ? "X · Heavy smash" : "Z · Fast combo";
    });
    dom.comboPips.forEach((pip, index) => pip.classList.toggle("is-filled", player.weapon === "leafblade" && index < player.comboStep));
    dom.comboLabel.textContent = player.weapon === "hammer" ? "Heavy smash" : "3-hit combo";
    renderWeaponTraits();
  }

  function weaponTrait(weapon = player.weapon) {
    return save.weaponTraits?.[weapon] || null;
  }

  function renderWeaponTraits() {
    if (!dom.weaponTraits) return;
    const rank = weaponRank();
    const weapon = player.weapon;
    const selected = weaponTrait(weapon) || "";
    const signature = `${weapon}:${rank}:${selected}`;
    if (signature === traitUiSignature) return;
    traitUiSignature = signature;
    dom.weaponTraits.innerHTML = `<div class="trait-head"><span>Specialization</span><small>${rank >= 2 ? "Choose one path" : "Unlocks at Rank II"}</small></div>${WEAPON_TRAITS[weapon].map(trait => `<button type="button" class="trait-choice ${selected === trait.id ? "is-selected" : ""}" data-trait="${trait.id}" ${rank < 2 ? "disabled" : ""} title="${trait.desc}"><span>${trait.icon}</span><strong>${trait.name}</strong><small>${trait.desc}</small></button>`).join("")}`;
    dom.weaponTraits.querySelectorAll("[data-trait]").forEach(button => button.addEventListener("click", () => selectWeaponTrait(weapon, button.dataset.trait)));
  }

  function selectWeaponTrait(weapon, traitId) {
    if (weaponRank() < 2 || !WEAPON_TRAITS[weapon]?.some(trait => trait.id === traitId)) return;
    save.weaponTraits[weapon] = traitId;
    persist(false);
    traitUiSignature = "";
    renderWeaponTraits();
    const trait = WEAPON_TRAITS[weapon].find(item => item.id === traitId);
    showComicWord(`${trait.name.toUpperCase()}!`, weapon === "hammer" ? "#ff9f1c" : "#8ce568");
    announce(`${trait.name} specialization equipped for ${WEAPONS[weapon].name}.`);
  }

  function updateHud() {
    // Hearts only change on damage or a level-up, but this runs 60 times a second:
    // rebuilding the row every frame threw away and re-rasterised a dozen
    // drop-shadowed spans for nothing.
    const heartSignature = `${player.health}/${player.maxHealth}`;
    if (heartSignature !== hudHeartSignature) {
      hudHeartSignature = heartSignature;
      dom.hearts.innerHTML = Array.from({ length: player.maxHealth }, (_, index) => `<span class="heart ${index >= player.health ? "is-empty" : ""}">♥</span>`).join("");
    }
    dom.energyBar.style.width = `${clamp(player.energy / player.maxEnergy * 100, 0, 100)}%`;
    dom.levelReadout.textContent = save.level;
    // updateTimedTrial owns this readout while a countdown is running, otherwise
    // the timer it just wrote would be overwritten before the frame ever paints.
    if (game.timeLeft === null) dom.chapterReadout.textContent = `Chapter ${game.chapter.id}`;
    dom.memoryReadout.textContent = `${save.memories.length}/21`;
    if (dom.materialReadout) dom.materialReadout.textContent = Object.values(save.materials || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    updateWeaponHud();
    const rank = skillRank();
    dom.skillRanks.forEach(label => {
      const skill = label.dataset.skillRank;
      const cost = skill === "companion" ? "" : ` · ${skillCost(skill, rank)} EP`;
      label.textContent = `Rank ${ROMAN_RANKS[rank - 1]}${cost}`;
    });
    const cooldownPercent = bradley.cooldown > 0 ? bradley.cooldown / companionCooldownMax(rank) * 100 : 0;
    dom.companionCooldown.style.width = `${cooldownPercent}%`;
    const boltUnavailable = player.attackCooldown > 0 || player.energy < skillCost("bolt", rank);
    const dashUnavailable = player.dashCooldown > 0 || player.energy < skillCost("dash", rank);
    const shieldUnavailable = player.attackCooldown > 0 || player.energy < skillCost("shield", rank) || player.shieldTime > 0;
    [[dom.touchBolt,boltUnavailable],[dom.touchDash,dashUnavailable],[dom.touchShield,shieldUnavailable],[dom.touchCompanion,bradley.cooldown>0]].forEach(([button,unavailable]) => {
      button.classList.toggle("is-unavailable", unavailable);
      button.classList.toggle("is-ready", !unavailable);
    });
    dom.touchBoltLabel.textContent = `Bolt · ${skillCost("bolt", rank)}`;
    dom.touchDashLabel.textContent = `Dash · ${skillCost("dash", rank)}`;
    dom.touchShieldLabel.textContent = `Shield · ${skillCost("shield", rank)}`;
    const cooperationMode = game.phase === "cooperation" && !!game.coopPuzzle;
    if (dom.companionAction) dom.companionAction.textContent = cooperationMode ? "Send Bradley" : "Mega Boom";
    dom.companionButton.setAttribute("aria-label", cooperationMode ? "Send Bradley to the orange plate" : "Bradley Mega Boom");
    dom.touchCompanionLabel.textContent = cooperationMode ? (bradley.command === "station" ? "Waiting" : "Send") : (bradley.cooldown > 0 ? `${bradley.cooldown.toFixed(1)}s` : "Boom");
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
    player.animationTime += delta;
    player.animStateTime += delta;
    player.animBlend = Math.min(1, player.animBlend + delta / .13);
    player.invulnerable = Math.max(0, player.invulnerable - delta);
    player.attackCooldown = Math.max(0, player.attackCooldown - delta);
    player.attackTime = Math.max(0, player.attackTime - delta);
    player.perfectDodgeTime = Math.max(0, player.perfectDodgeTime - delta);
    player.counterReadyTime = Math.max(0, player.counterReadyTime - delta);
    player.counterCooldown = Math.max(0, player.counterCooldown - delta);
    player.hurtTime = Math.max(0, player.hurtTime - delta);
    player.dashStrikeWindow = Math.max(0, player.dashStrikeWindow - delta);
    if (player.hammerCharging) player.hammerCharge = Math.min(1, player.hammerCharge + delta / (weaponTrait("hammer") === "meteor" ? .58 : .75));
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

    const rhythmKeyHandled = handleRhythmKeyboardInput();
    if (!rhythmKeyHandled && input.consume("Digit1")) cycleWeapon();
    if (!rhythmKeyHandled && input.consume("Digit2")) useTouchAbility("bolt");
    if (!rhythmKeyHandled && input.consume("Digit3")) useDash();
    if (!rhythmKeyHandled && input.consume("Digit4")) useTouchAbility("shield");
    if (input.consume("KeyZ")) selectWeapon("leafblade");
    if (input.consume("KeyX")) selectWeapon("hammer");
    if (input.consume("KeyR")) cycleWeapon();
    if (input.consume("ShiftLeft", "ShiftRight")) useDash();
    if (input.consume("Space", "KeyJ", "KeyK")) {
      if (player.weapon === "hammer") {
        player.hammerCharging = true;
        player.hammerCharge = 0;
        showComicWord("CHARGE!", "#ffb347");
      } else useSelectedAbility();
    }
    if (player.hammerCharging && input.consumeReleased("Space", "KeyJ", "KeyK")) {
      player.hammerCharging = false;
      useCometHammer(player.hammerCharge);
      player.hammerCharge = 0;
    }
    if (input.consume("KeyQ")) useCompanion();
    if (input.consume("KeyE", "Enter")) interact();
    if (player.touchAttackHeld && player.weapon === "hammer") player.hammerCharging = true;
    if (player.touchAttackHeld && player.weapon !== "hammer" && player.attackCooldown <= 0) useWeapon();

    game.memoryObjects.forEach(memory => {
      if (!memory.collected && distance(player, memory) < 34) collectMemory(memory);
    });
    // Active portals behave like doorways on touch devices: walking through the center enters.
    if (game.portalActive && !game.portalTransitioning && distance(player, game.chapter.portal) < 68) completeChapter();
    const nextState = player.hurtTime > 0 ? "hurt" : player.dashTime > 0 ? "dash" : player.attackTime > 0 || player.hammerCharging ? (player.attackKind === "hammer" || player.hammerCharging ? "hammer" : "leafblade") : player.moving ? "move" : "idle";
    if (nextState !== player.animState) {
      player.previousAnimState = player.animState;
      player.previousAnimStateTime = player.animStateTime;
      player.animState = nextState;
      player.animStateTime = 0;
      player.animBlend = 0;
    }
    const capeTarget = nextState === "dash" ? -.72 : nextState === "move" ? -.28 - Math.abs(Math.sin(player.walkCycle * Math.PI * 2)) * .12 : nextState === "hurt" ? .18 : nextState === "hammer" ? -.16 : -.08;
    player.capeVelocity += (capeTarget - player.capeAngle) * 48 * delta;
    player.capeVelocity *= Math.exp(-8.5 * delta);
    player.capeAngle += player.capeVelocity * delta;
    dom.touchAttack.classList.toggle("is-counter-ready", player.counterReadyTime > 0);
    dom.weaponButton?.classList.toggle("is-counter-ready", player.counterReadyTime > 0);
  }

  function useDash() {
    const rank = skillRank();
    const cost = skillCost("dash", rank);
    if (!hasUnlocked(3) || player.dashCooldown > 0 || player.energy < cost) return;
    player.energy -= cost;
    player.dashTime = .22 + rank * .025;
    // Chapter 5 turns the tail of a dash into an attack opening.
    player.dashStrikeWindow = hasUnlocked(5) ? player.dashTime + .28 : 0;
    player.dashCooldown = .88 - rank * .07;
    player.invulnerable = Math.max(player.invulnerable, .28 + rank * .04);
    if (rank >= 3) {
      const impact = { x: player.x + player.facing.x * 68, y: player.y + player.facing.y * 68, radius: 62 + rank * 5, life: .26, color: "#69e5ff", type: "dash", consumeMark: true };
      game.attacks.push(impact);
      damageEnemies(impact, rank === 4 ? 2 : 1);
      damageBoss(impact, rank === 4 ? 2 : 1);
      damageBreakTargets(impact, 1);
    }
    if (rank === 4) player.shieldTime = Math.max(player.shieldTime, .42);
    particles.burst(player.x, player.y, "#ff9f1c", 12 + rank * 3, 130 + rank * 20);
    sound.play("attack");
    showComicWord(rank >= 3 ? "WIND RUSH!" : "WHOOSH!", "#69e5ff");
  }

  // Skills 2-4 cast instantly from their own keys and buttons, so there is no
  // "armed ability" to route through: Space is always the equipped weapon.
  function useSelectedAbility() {
    if (player.attackCooldown > 0) return;
    useWeapon();
  }

  function useTouchAbility(name) {
    if (game.mode !== "playing" || player.attackCooldown > 0) return;
    if (!hasUnlocked(Data.abilityUnlocks[name] || 1)) return;
    if (name === "bolt") fireBolt();
    else if (name === "shield") useShield();
  }

  function assistedAim(maxRange) {
    const targets = game.enemies.filter(enemy => enemy.active);
    if (game.boss?.active && !game.boss.peaceful) targets.push(game.boss);
    let nearest = null;
    targets.forEach(target => {
      const away = distance(player, target);
      if (away > maxRange || (nearest && away >= nearest.away)) return;
      const direction = normalize(target.x - player.x, target.y - player.y);
      const facingDot = direction.x * player.facing.x + direction.y * player.facing.y;
      if (!usesTouchControls() && facingDot < .05) return;
      nearest = { away, direction, target };
    });
    if (nearest) {
      player.facing = nearest.direction;
      game.aimTarget = nearest.target;
      game.aimTargetTime = .55;
    }
    return nearest?.direction || player.facing;
  }

  function useWeapon() {
    if (game.mode !== "playing") return;
    if (player.counterReadyTime > 0) { usePerfectCounter(); return; }
    if (player.attackCooldown > 0) return;
    if (player.dashStrikeWindow > 0) useDashStrike();
    else if (player.weapon === "hammer") useCometHammer();
    else useLeafblade();
  }

  function usePerfectCounter() {
    const direction = assistedAim(270);
    player.counterReadyTime = 0;
    player.counterCooldown = 1.15;
    player.attackCooldown = .42;
    player.attackDuration = .38;
    player.attackTime = player.attackDuration;
    player.attackKind = player.weapon === "hammer" ? "hammer" : "leafblade-finisher";
    player.attackDirection = { ...direction };
    player.invulnerable = Math.max(player.invulnerable, .38);
    moveCircle(player, direction.x * 38, direction.y * 38);
    const counter = {
      x: player.x + direction.x * 52,
      y: player.y + direction.y * 52,
      radius: 98,
      life: .36,
      maxLife: .36,
      angle: Math.atan2(direction.y, direction.x),
      type: "perfect",
      color: "#dfffcf",
      critical: true,
      consumeMark: true
    };
    game.attacks.push(counter);
    damageEnemies(counter, forgedDamage(player.weapon, 3));
    damageBoss(counter, forgedDamage(player.weapon, 3));
    particles.burst(counter.x, counter.y, "#d9ffb7", 30, 270);
    impactFeedback(counter, "counter");
    showComicWord("PERFECT COUNTER!", "#fff1a8");
    announce("Perfect counter released.");
  }

  // Skyfall: attack while a dash is still carrying you. No new button -- it is
  // the first move that comes from combining two the player already has, and it
  // lands as a dash hit, so it breaks every charger's guard.
  function useDashStrike() {
    const rank = weaponRank();
    const heavy = player.weapon === "hammer";
    const direction = assistedAim(240);
    player.dashStrikeWindow = 0;
    player.comboStep = 0;
    player.comboTimer = 0;
    player.attackCooldown = forgedRecovery(player.weapon, heavy ? .52 : .34);
    player.attackDuration = heavy ? .46 : .34;
    player.attackTime = player.attackDuration;
    player.attackKind = heavy ? "hammer" : "leafblade-finisher";
    player.attackDirection = { ...direction };
    player.invulnerable = Math.max(player.invulnerable, .18);
    moveCircle(player, direction.x * 46, direction.y * 46);
    const hit = {
      x: player.x + direction.x * 40,
      y: player.y + direction.y * 40,
      radius: (heavy ? 92 : 78) + rank * 3,
      life: .34, maxLife: .34,
      angle: Math.atan2(direction.y, direction.x),
      type: "dash",
      color: "#69e5ff",
      critical: rank >= 3,
      consumeMark: true
    };
    game.attacks.push(hit);
    particles.burst(hit.x, hit.y, "#a9ecff", 24, 235);
    sound.play(heavy ? "boom" : "attack");
    game.shake = Math.max(game.shake, heavy ? 9 : 6);
    showComicWord("SKYFALL!", "#69e5ff");
    const damage = forgedDamage(player.weapon, (heavy ? 3 : 2) + Math.floor((rank - 1) / 2));
    damageBreakTargets(hit, heavy ? 3 : 2);
    damageEnemies(hit, damage);
    damageBoss(hit, damage);
  }

  function useLeafblade() {
    const rank = weaponRank();
    const direction = assistedAim(205);
    player.comboStep = player.comboTimer > 0 ? player.comboStep % 3 + 1 : 1;
    const trait = weaponTrait("leafblade");
    player.comboTimer = trait === "windstep" ? .82 : .62;
    const finisher = player.comboStep === 3;
    player.attackCooldown = forgedRecovery("leafblade", Math.max(.16, (finisher ? .4 : .24) - (trait === "windstep" ? .05 : 0)));
    player.attackDuration = finisher ? .4 : .27;
    player.attackTime = player.attackDuration;
    player.attackKind = finisher ? "leafblade-finisher" : "leafblade";
    player.attackDirection = { ...direction };
    moveCircle(player, direction.x * (finisher ? 24 : 17), direction.y * (finisher ? 24 : 17));
    const radius = finisher ? 76 + rank * 2 + (trait === "bloomarc" ? 22 : 0) : 52 + rank * 2;
    const hit = {
      x: player.x + direction.x * (finisher ? 30 : 58),
      y: player.y + direction.y * (finisher ? 30 : 58),
      radius,
      life: finisher ? .32 : .22,
      maxLife: finisher ? .32 : .22,
      angle: Math.atan2(direction.y, direction.x),
      type: finisher ? "spin" : "slash",
      comboStep: player.comboStep,
      color: "#b7ff9b",
      consumeMark: true
    };
    game.attacks.push(hit);
    particles.burst(hit.x, hit.y, "#d9ffb7", finisher ? 20 : 11, finisher ? 210 : 155);
    sound.play("attack");
    showComicWord(finisher ? "LEAFSTORM!" : player.comboStep === 2 ? "SWOOSH!" : "SLASH!", "#b7ff9b");
    const damage = forgedDamage("leafblade", (rank >= 3 ? 2 : 1) + (finisher ? 1 : 0) + (trait === "thornedge" && finisher ? 1 : 0));
    damageBreakTargets(hit, finisher ? 2 : 1);
    damageEnemies(hit, damage);
    damageBoss(hit, damage);
  }

  function useCometHammer(charge = 0) {
    const rank = weaponRank();
    const direction = assistedAim(220);
    const trait = weaponTrait("hammer");
    const chargePower = clamp(charge * (trait === "meteor" ? 1.22 : 1), 0, 1);
    player.comboStep = 0;
    player.comboTimer = 0;
    player.attackCooldown = forgedRecovery("hammer", .7);
    player.attackDuration = .58;
    player.attackTime = player.attackDuration;
    player.attackKind = "hammer";
    player.attackDirection = { ...direction };
    moveCircle(player, direction.x * 11, direction.y * 11);
    const hit = {
      x: player.x + direction.x * 42,
      y: player.y + direction.y * 42,
      radius: 88 + (rank - 1) * 6 + chargePower * 22 + (trait === "quake" ? 20 : 0),
      life: .42 + chargePower * .08,
      maxLife: .42 + chargePower * .08,
      angle: Math.atan2(direction.y, direction.x),
      type: "smash",
      color: "#ff9f1c"
    };
    game.attacks.push(hit);
    particles.burst(hit.x, hit.y, "#ffb347", 24 + rank * 3, 245);
    sound.play("boom");
    game.shake = 9 + rank + chargePower * 5;
    showComicWord(chargePower > .65 || rank === 4 ? "COMET CRASH!" : "KRAKOOM!", "#ff9f1c");
    damageBreakTargets(hit, 3 + Math.floor(chargePower * 2));
    const damage = forgedDamage("hammer", Math.round((2 + Math.floor((rank - 1) / 2) + (trait === "breaker" ? 1 : 0)) * (1 + chargePower * .65)));
    damageEnemies({ ...hit, consumeMark: true }, damage);
    damageBoss(hit, damage);
  }

  function fireBolt() {
    const rank = skillRank();
    const cost = skillCost("bolt", rank);
    if (player.energy < cost) return;
    const direction = assistedAim(540);
    player.energy -= cost;
    player.attackCooldown = rank >= 3 ? .36 : .28;
    const count = rank >= 3 ? 3 : 1;
    const baseAngle = Math.atan2(direction.y, direction.x);
    for (let index = 0; index < count; index += 1) {
      const spread = (index - (count - 1) / 2) * .14;
      const angle = baseAngle + spread;
      game.projectiles.push({
        x: player.x + Math.cos(angle) * 30,
        y: player.y + Math.sin(angle) * 30,
        vx: Math.cos(angle) * (580 + rank * 18),
        vy: Math.sin(angle) * (580 + rank * 18),
        radius: rank === 4 ? 11 : 9,
        life: 1.45 + rank * .08,
        damage: rank >= 4 ? 3 : rank >= 2 ? 2 : 1,
        color: rank === 4 ? "#d6a4ff" : "#69e5ff",
        marks: rank >= 2
      });
    }
    sound.play("bolt");
    showComicWord(rank >= 3 ? "STAR BURST!" : "ZAP!", rank === 4 ? "#d6a4ff" : "#69e5ff");
  }

  function useShield() {
    const rank = skillRank();
    const cost = skillCost("shield", rank);
    if (player.energy < cost || player.shieldTime > 0) return;
    player.energy -= cost;
    player.attackCooldown = .35;
    player.shieldTime = 1.18 + rank * .22;
    if (rank >= 3) {
      const burst = { x: player.x, y: player.y, radius: 68 + rank * 6, life: .28, color: "#8ce568" };
      game.attacks.push(burst);
      damageEnemies(burst, rank === 4 ? 2 : 1);
      damageBoss(burst, 1);
    }
    sound.play("shield");
    particles.burst(player.x, player.y, "#8ce568", 14 + rank * 3, 100 + rank * 15);
    showComicWord(rank >= 3 ? "LEAF BURST!" : "SHIELD!", "#8ce568");
  }

  function useCompanion() {
    if (game.phase === "cooperation" && game.coopPuzzle) {
      commandBradleyToPlate();
      return;
    }
    if (!hasUnlocked(2) || bradley.cooldown > 0) return;
    const rank = skillRank();
    bradley.cooldown = companionCooldownMax(rank);
    const nearestEnemy = game.enemies.filter(enemy=>enemy.active).sort((a,b)=>distance(player,a)-distance(player,b))[0];
    const target = game.boss?.active ? game.boss : nearestEnemy || { x: player.x + player.facing.x * 170, y: player.y + player.facing.y * 170, radius: 55 };
    const blast = { x: target.x, y: target.y, radius: 82 + rank * 9, life: .25, color: "#ff9f1c", type: "companion", companion: true, consumeMark: true };
    particles.burst(target.x, target.y, "#ff9f1c", 28, 250);
    game.attacks.push(blast);
    damageBreakTargets(blast, 2 + rank);
    damageEnemies(blast, 2 + rank);
    damageBoss(blast, 2 + rank);
    sound.play("boom");
    game.shake = 12;
    showComicWord(rank === 4 ? "ULTRA BOOM!" : "MEGA BOOM!", "#ff9f1c");
    announce(`Bradley fired Rank ${ROMAN_RANKS[rank - 1]} Mega Boom.`);
  }

  function commandBradleyToPlate() {
    if (!game.coopPuzzle) return;
    if (bradley.command === "station") {
      bradley.command = "follow";
      bradley.target = null;
      showComicWord("COME ON!", "#69e5ff");
      announce("Bradley is following Clark again.");
    } else {
      bradley.command = "station";
      bradley.target = game.coopPuzzle.plateB;
      showComicWord("HOLD!", "#ff9f1c");
      announce("Bradley is moving to the orange plate.");
    }
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
    if (!boss?.active || boss.defeated || boss.peaceful || boss.invulnerable > 0) return;
    if (distance(hit, boss) > (hit.radius || 0) + boss.radius) return;
    const critical = hit.critical || hit.type === "spin" || hit.type === "perfect" || Math.random() < .06;
    const dealt = Math.max(1, Math.round(amount * (critical ? 1.55 : 1)));
    boss.hp -= dealt;
    boss.invulnerable = .12;
    boss.hurtTime = .24;
    boss.animState = "hurt";
    boss.animStateTime = 0;
    impactFeedback(hit, hit.type === "perfect" ? "counter" : hit.type === "smash" ? "heavy" : critical ? "critical" : "light");
    particles.burst(boss.x, boss.y, game.chapter.palette.glow, 12, 170);
    if (critical) showComicWord("CRITICAL!", "#fff1a8");
    const healthRatio = boss.hp / boss.maxHp;
    const phase = healthRatio <= .34 ? 3 : healthRatio <= .67 ? 2 : 1;
    if (phase > (boss.phaseIndex || 1)) {
      boss.phaseIndex = phase;
      boss.attackTimer = .18;
      particles.burst(boss.x, boss.y, game.chapter.palette.glow, 28, 210);
      showComicWord(`PHASE ${phase}!`, "#ffd34f");
      announce(`${boss.name} has entered phase ${phase}.`);
    }
    if (boss.hp <= 0) defeatBoss();
  }

  function damageEnemies(hit, amount) {
    game.enemies.forEach(enemy => {
      if (!enemy.active || enemy.invulnerable > 0) return;
      if (distance(hit, enemy) > (hit.radius || 0) + enemy.radius) return;
      const weakHit = enemy.exposed > 0 || hit.companion || (enemy.weakness === "hammer" && hit.type === "smash") || (enemy.weakness === "dash" && hit.type === "dash");
      const markedBonus = hit.consumeMark && enemy.marked > 0 ? 1.75 : 1;
      const critical = hit.critical || hit.type === "spin" || Math.random() < .08;
      let dealt = Math.max(1, Math.round(amount * markedBonus * (weakHit ? 1.8 : 1) * (critical ? 1.65 : 1)));
      // Dune elites teach counterplay instead of merely soaking damage: their
      // shell halves ordinary hits, while the correct weakness breaks through.
      if (enemy.eliteTrait?.id === "shell" && !weakHit) dealt = Math.max(1, Math.round(dealt * .5));
      enemy.hp -= dealt;
      impactFeedback(hit, hit.type === "perfect" ? "counter" : hit.type === "smash" ? "heavy" : critical ? "critical" : "light");
      if (hit.consumeMark && enemy.marked > 0) {
        enemy.marked = 0;
        particles.burst(enemy.x, enemy.y, "#d6a4ff", 9, 140);
      }
      if (weakHit) {
        enemy.stunTime = Math.max(enemy.stunTime, 1.05);
        enemy.exposed = 0;
        // A brief freeze sells the counter far better than a bigger number does.
        game.hitStop = Math.max(game.hitStop, .07);
        game.shake = Math.max(game.shake, 5);
        particles.burst(enemy.x, enemy.y, WEAKNESS_INFO[enemy.weakness]?.color || "#ffd34f", 16, 210);
      }
      enemy.invulnerable = .13;
      const knock = normalize(enemy.x - hit.x, enemy.y - hit.y);
      const impactForce = weakHit ? 34 : critical ? 23 : 16;
      moveCircle(enemy, knock.x * impactForce, knock.y * impactForce, true);
      if (weakHit || critical) enemy.hitStagger = .16;
      particles.burst(enemy.x, enemy.y, enemy.color, 10, 150);
      if (critical || weakHit) showComicWord(weakHit ? "WEAK!" : "CRITICAL!", weakHit ? "#ffd34f" : "#fff1a8");
      if (enemy.hp <= 0) defeatEnemy(enemy);
    });
  }

  function defeatEnemy(enemy) {
    if (!enemy.active) return;
    enemy.active = false;
    particles.burst(enemy.x, enemy.y, enemy.color, 22, 215);
    sound.play("pickup");
    const material = { slime: "gel", drone: "shard", thornling: "fiber", wisp: "crystal", mossling: "moss", sandbeetle: "amber", prismimp: "prism", gearbug: "cog", shadowmoth: "silk", voidling: "void", vinebrute: "vine", stormbat: "wing", bookwisp: "page", inkhound: "void", runeknight: "page", quillseer: "page" }[enemy.type] || "shard";
    if (!enemy.noDrop) {
      save.materials[material] = (save.materials[material] || 0) + (enemy.elite ? 3 : 1);
      save.defeated[enemy.type] = (save.defeated[enemy.type] || 0) + 1;
    }
    if (enemy.eliteTrait?.id === "splitter" && !enemy.eliteTriggered) {
      enemy.eliteTriggered = true;
      const left = spawnEnemy("mossling", enemy.x - 34, enemy.y + 12, { scale: .72, noDrop: true });
      const right = spawnEnemy("mossling", enemy.x + 34, enemy.y - 12, { scale: .72, noDrop: true });
      if (left) left.hp = left.maxHp = 1;
      if (right) right.hp = right.maxHp = 1;
      showComicWord("SPLIT!", "#8ce568");
    }
    // Freeing a rune is the more useful thing to shout about, so it wins the
    // banner over the generic defeat word.
    const freed = enemy.guardsRune
      ? game.chapter.puzzle.targets.find(target => target.id === enemy.guardsRune && !game.activeTargets.has(target.id))
      : null;
    if (freed) {
      particles.burst(freed.x, freed.y, freed.color || "#ffd34f", 22, 170);
      sound.play("success");
      showComicWord("RUNE FREED!", freed.color || "#ffd34f");
      announce(`${enemy.name} defeated. The rune is free — go light it.`);
    } else {
      showComicWord(enemy.elite ? "ELITE DOWN!" : enemy.type === "drone" ? "SHORTED!" : enemy.type === "thornling" ? "TUMBLED!" : "POOF!", enemy.color);
      announce(enemy.noDrop ? `${enemy.name} dispersed.` : `${enemy.elite ? "Elite " : ""}${enemy.name} defeated. ${enemy.elite ? "3" : "1"} ${material} collected.`);
    }
    gainExperience(enemy.noDrop ? 1 : enemy.xp);
    if (!enemy.noDrop) persist(false);
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
      showComicWord(`SKILLS ${ROMAN_RANKS[upgradedRank - 1]}!`, "#ff9f1c");
      announce(`Adventure rank upgraded to ${ROMAN_RANKS[upgradedRank - 1]}. Weapons and skills are stronger.`);
      if (upgradedRank >= 2 && !weaponTrait(player.weapon)) {
        setTimeout(() => { showComicWord("CHOOSE A PATH!", "#ffd34f"); announce("Choose a weapon specialization in the Weapon panel."); }, 420);
      }
    } else {
      showComicWord("MEMORY!", "#ffd34f");
      announce(`Comic memory found. ${save.memories.length} of 21.`);
    }
    persist();
  }

  // Chapters 3, 4 and 6 post a monster on each rune. Nothing about the puzzle
  // changes -- you just cannot light a rune while its guard is standing, which
  // forces the fight and the lock to happen together instead of in sequence.
  // Chapters 1-2 stay unguarded as the teaching ramp, 5 pushes a block, and 7
  // is already on a clock.
  const GUARDED_CHAPTERS = [3, 4, 6];

  function assignRuneGuards(chapter) {
    game.runeGuards = new Map();
    if (!GUARDED_CHAPTERS.includes(chapter.id)) return;
    const taken = new Set();
    chapter.puzzle.targets.forEach(target => {
      let best = null;
      game.enemies.forEach(enemy => {
        if (!enemy.active || taken.has(enemy.id)) return;
        const away = distance(enemy, target);
        if (!best || away < best.away) best = { enemy, away };
      });
      if (!best) return;
      taken.add(best.enemy.id);
      best.enemy.guardsRune = target.id;
      // The post becomes its home, so it idles on the rune instead of its
      // original spawn point.
      best.enemy.homeX = target.x;
      best.enemy.homeY = target.y;
      best.enemy.leashX = target.x;
      best.enemy.leashY = target.y;
      game.runeGuards.set(target.id, best.enemy.id);
    });
  }

  // Returns the living guard for a rune, or null once it has been cleared.
  function runeGuard(targetId) {
    const guardId = game.runeGuards.get(targetId);
    if (!guardId) return null;
    const guard = game.enemies.find(enemy => enemy.id === guardId);
    return guard && guard.active ? guard : null;
  }

  function nearestPuzzleTarget() {
    if (game.puzzleSolved) return null;
    if (game.chapter.puzzle.type === "break" || game.chapter.puzzle.type === "push") return null;
    let nearest = null;
    game.chapter.puzzle.targets.forEach(target => {
      if (game.chapter.puzzle.type !== "rhythm" && game.activeTargets.has(target.id)) return;
      const away = distance(player, { ...target, radius: 25 });
      const reach = usesTouchControls() ? 108 : 72;
      if (away < reach && (!nearest || away < nearest.distance)) {
        nearest = { type: "puzzle", target, distance: away, guard: runeGuard(target.id) };
      }
    });
    return nearest;
  }

  function determineInteraction() {
    const target = nearestPuzzleTarget();
    if (target) return target;
    if (game.healingShrine && distance(player, game.healingShrine) < (usesTouchControls() ? 125 : 88)) {
      return { type: "healingShrine", target: game.healingShrine };
    }
    if (game.boss?.active && game.boss.peaceful && distance(player, game.boss) < (usesTouchControls() ? 150 : 115)) return { type: "peacefulBoss", target: game.boss };
    const portalReach = usesTouchControls() ? 150 : 100;
    if (game.portalActive && distance(player, game.chapter.portal) < portalReach) return { type: "portal", target: game.chapter.portal };
    return null;
  }

  function updateInteractionPrompt() {
    game.nearestInteraction = determineInteraction();
    if (!game.nearestInteraction) {
      dom.interactionPrompt.hidden = true;
      dom.touchInteract.classList.remove("is-ready", "is-portal");
      dom.touchInteract.querySelector("span").textContent = "E";
      dom.touchInteractLabel.textContent = "Use";
      return;
    }
    const labels = {
      puzzle: game.nearestInteraction.guard
        ? `Defeat the ${game.nearestInteraction.guard.name}`
        : game.nearestInteraction.target.label || "Activate rune",
      peacefulBoss: game.chapter.id === 5 ? "Talk to the Golem" : "Open the Final Gate",
      healingShrine: game.healingShrine.cooldown > 0
        ? `Heartleaf Shrine · ${Math.ceil(game.healingShrine.cooldown)}s`
        : player.health >= player.maxHealth && player.energy >= player.maxEnergy
          ? "Heartleaf Shrine · You are restored"
          : "Rest at the Heartleaf Shrine",
      portal: game.chapter.id === 7 ? "Claim the Leaf Key" : "Enter Portal"
    };
    dom.interactionPrompt.querySelector("span").textContent = labels[game.nearestInteraction.type];
    dom.interactionPrompt.querySelector("kbd").textContent = usesTouchControls() ? "TAP" : "E";
    dom.interactionPrompt.hidden = false;
    const enteringPortal = game.nearestInteraction.type === "portal";
    dom.touchInteract.classList.add("is-ready");
    dom.touchInteract.classList.toggle("is-portal", enteringPortal);
    dom.touchInteract.querySelector("span").textContent = enteringPortal ? "↪" : "E";
    dom.touchInteractLabel.textContent = enteringPortal ? "Enter" : "Use";
  }

  function interact() {
    const interaction = determineInteraction();
    if (!interaction) return;
    if (interaction.type === "puzzle") activatePuzzleTarget(interaction.target);
    else if (interaction.type === "healingShrine") useHealingShrine();
    else if (interaction.type === "peacefulBoss") completePeacefulEncounter();
    else if (interaction.type === "portal") completeChapter();
  }

  function useHealingShrine() {
    const shrine = game.healingShrine;
    if (!shrine) return;
    if (shrine.cooldown > 0) {
      announce(`The Heartleaf Shrine will bloom again in ${Math.ceil(shrine.cooldown)} seconds.`);
      return;
    }
    if (player.health >= player.maxHealth && player.energy >= player.maxEnergy) {
      announce("Clark is already fully restored.");
      return;
    }
    const healed = Math.min(3, player.maxHealth - player.health);
    player.health = Math.min(player.maxHealth, player.health + 3);
    player.energy = Math.min(player.maxEnergy, player.energy + 45);
    player.invulnerable = Math.max(player.invulnerable, .7);
    shrine.cooldown = shrine.cooldownMax;
    hudHeartSignature = "";
    particles.burst(shrine.x, shrine.y - 18, "#ff8fb7", 24, 145);
    particles.burst(player.x, player.y, "#8ce568", 18, 120);
    sound.play("success");
    showComicWord(healed > 0 ? `+${healed} HEARTS!` : "ENERGY BLOOM!", "#ff8fb7");
    announce(`Heartleaf Shrine restored ${healed} hearts and refreshed Clark's energy.`);
  }

  function handleStageTap(event) {
    if (!usesTouchControls() || game.portalTransitioning || game.mode !== "playing") return;
    const rect = dom.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    const worldPoint = {
      x: (canvasX - game.viewport.offsetX) / game.viewport.scale,
      y: (canvasY - game.viewport.offsetY) / game.viewport.scale
    };
    if (game.healingShrine && distance(worldPoint, game.healingShrine) < 82 && distance(player, game.healingShrine) < 170) {
      event.preventDefault();
      useHealingShrine();
      return;
    }
    if (!game.puzzleSolved && game.chapter.puzzle.type === "rhythm") {
      const tappedKey = game.chapter.puzzle.targets.find(target =>
        distance(worldPoint, target) < 62 && distance(player, target) < 155
      );
      if (tappedKey) {
        event.preventDefault();
        activatePuzzleTarget(tappedKey);
        return;
      }
    }
    if (!game.portalActive) return;
    if (distance(worldPoint, game.chapter.portal) < 145 && distance(player, game.chapter.portal) < 190) {
      event.preventDefault();
      completeChapter();
    }
  }

  function handleRhythmKeyboardInput() {
    const puzzle = game.chapter.puzzle;
    if (game.puzzleSolved || game.phase !== "puzzle" || puzzle.type !== "rhythm") return false;
    for (let number = 1; number <= 4; number += 1) {
      if (!input.consume(`Digit${number}`, `Numpad${number}`)) continue;
      const target = puzzle.targets.find(item => item.number === number);
      if (target) activatePuzzleTarget(target);
      return true;
    }
    return false;
  }

  function activatePuzzleTarget(target) {
    const puzzle = game.chapter.puzzle;
    const guard = runeGuard(target.id);
    if (guard) {
      game.aimTarget = guard;
      game.aimTargetTime = 1.1;
      particles.burst(target.x, target.y, "#ff5d62", 8, 90);
      sound.play("hurt");
      showComicWord("GUARDED!", "#ff5d62");
      announce(`That rune is guarded by a ${guard.name}. Defeat it first.`);
      return;
    }
    const match = target.match || target.id;
    const expected = puzzle.sequence[game.puzzleProgress];
    const uniqueKey = target.id;
    if (match === expected) {
      game.puzzleProgress += 1;
      if (puzzle.type === "rhythm") game.activeTargets.clear();
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
      game.flashColor = "255,70,85";
      sound.play("hurt");
      showComicWord("TRY AGAIN!", "#ff5d62");
      setObjective(game.chapter.objective);
    }
  }

  function solvePuzzle() {
    if (game.puzzleSolved) return;
    game.puzzleSolved = true;
    gainExperience(60);
    sound.play("success");
    showComicWord("PORTAL POWER!", "#8ce568");
    particles.burst(game.chapter.portal.x, game.chapter.portal.y, game.chapter.palette.glow, 36, 220);
    if (game.coopPuzzle && !game.coopSolved) {
      game.phase = "cooperation";
      showComicWord("TEAMWORK!", "#8ce568");
      setObjective(game.coopPuzzle.prompt);
      announce(game.coopPuzzle.prompt + ". Press Q or tap Bradley's button to send him.");
      return;
    }
    if (game.chapter.id === 7) {
      startFinalWaves();
      return;
    }
    game.phase = "boss";
    spawnBoss();
  }

  function startFinalWaves() {
    game.phase = "waves";
    game.waveIndex = 1;
    game.waveDelay = 0;
    // The living enemies already in the trial become Wave 1. Replacing the
    // array here used to make undefeated monsters vanish without drops.
    const survivors = game.enemies.filter(enemy => enemy.active);
    if (!survivors.length) createEnemies(game.chapter, FINAL_WAVES[0]);
    else game.enemies = survivors;
    setObjective("Survive Wave 1/3 · defeat every attacker");
    showComicWord("WAVE 1!", "#ffd34f");
    announce("Final trial wave 1 of 3. Defeat every attacker.");
  }

  function updateFinalWaves(delta) {
    if (game.phase !== "waves" || game.enemies.some(enemy => enemy.active)) return;
    if (game.waveDelay <= 0) { game.waveDelay = .7; return; }
    game.waveDelay -= delta;
    if (game.waveDelay > 0) return;
    if (game.waveIndex < FINAL_WAVES.length) {
      // Do not carry a dead wave's remaining bullets into the next encounter.
      // On iPad those overlapping rune paths were the largest Chapter 7 spike.
      game.enemyProjectiles = [];
      createEnemies(game.chapter, FINAL_WAVES[game.waveIndex]);
      game.waveIndex += 1;
      setObjective(`Survive Wave ${game.waveIndex}/3 · defeat every attacker`);
      showComicWord(`WAVE ${game.waveIndex}!`, "#ffd34f");
      announce(`Final trial wave ${game.waveIndex} of ${FINAL_WAVES.length}.`);
    } else {
      game.phase = "boss";
      game.enemyProjectiles = [];
      setObjective(`Defeat ${game.chapter.boss.name}`);
      showComicWord("THE BOOK AWAKENS!", "#d6a4ff");
      spawnBoss();
    }
  }

  function spawnBoss() {
    const spec = game.chapter.boss;
    if (spec.type === "pi") loadProp("piMonster");
    loadBossAnimation(spec.type);
    game.boss = {
      ...spec,
      radius: spec.type === "raven" ? 66 : spec.type === "pi" || spec.type === "shadow" ? 58 : 48,
      maxHp: spec.hp,
      active: true,
      attackTimer: 1.2,
      attackPattern: 0,
      phaseIndex: 1,
      meleeTime: 0,
      meleeHit: false,
      meleeDamage: 2,
      meleeKind: "slam",
      attackDirection: { x: 1, y: 0 },
      moveTimer: 0,
      invulnerable: 0,
      angle: 0,
      animationTime: 0,
      animState: "idle",
      animStateTime: 0,
      hurtTime: 0,
      attackAnimTime: 0,
      isMoving: false,
      facingX: -1,
      telegraphTarget: null,
      telegraphDuration: spec.type === "raven" ? .58 : spec.type === "engine" || spec.type === "final" ? .72 : .64,
      defeated: false,
      deathTime: 0
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
    const boss = game.boss;
    if (!boss || boss.defeated) return;
    boss.defeated = true;
    boss.deathTime = 1.08;
    boss.animState = "death";
    boss.animStateTime = 0;
    boss.attackAnimTime = 0;
    boss.meleeTime = 0;
    boss.invulnerable = 99;
    game.enemies.forEach(enemy => {
      if (enemy.active) particles.burst(enemy.x, enemy.y, enemy.color, 6, 90);
      enemy.active = false;
    });
    game.enemyProjectiles = [];
    game.hitStop = Math.max(game.hitStop, .14);
    game.zoomPunch = Math.max(game.zoomPunch, .06);
    game.flash = Math.max(game.flash, .2);
    game.flashColor = "255,255,245";
    sound.play("bossDown");
    haptic([35, 45, 50]);
  }

  function finishBossDefeat() {
    const boss = game.boss;
    if (!boss?.active) return;
    boss.active = false;
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
    if (!game.portalActive || game.portalTransitioning) return;
    game.portalTransitioning = true;
    const id = game.chapter.id;
    if (!save.completed.includes(id)) save.completed.push(id);
    save.unlockedChapter = Math.max(save.unlockedChapter, Math.min(7, id + 1));
    save.chapter = Math.min(7, id + 1);
    persist();
    sound.play("portal");
    if (id < 7) loadBackground(id + 1);
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
    if (hasUnlocked(2)) {
      if (game.phase === "cooperation" && bradley.command === "station" && bradley.target) {
        const away = distance(bradley, bradley.target);
        if (away > 8) {
          const direction = normalize(bradley.target.x - bradley.x, bradley.target.y - bradley.y);
          const step = Math.min(225 * delta, away - 8);
          bradley.x += direction.x * step;
          bradley.y += direction.y * step;
          bradley.facing = direction;
        }
      } else follow(bradley, player, 62, 225);
    }
    if (hasUnlocked(5)) {
      bird.angle += delta * 2.2;
      // "Bird's Secret Finder" is Chapter 5's listed reward but had no code
      // behind it. Bird now breaks formation to circle the nearest memory the
      // player has not picked up, which is the only hint the game gives that
      // there is anything to look for.
      let find = null;
      game.memoryObjects.forEach(memory => {
        if (memory.collected) return;
        const away = distance(player, memory);
        if (away < 460 && away > 60 && (!find || away < find.away)) find = { memory, away };
      });
      bird.found = find ? find.memory : null;
      const anchorX = find ? find.memory.x : player.x - 38;
      const anchorY = find ? find.memory.y : player.y - 48;
      const orbit = find ? 30 : 25;
      bird.x = lerp(bird.x, anchorX + Math.cos(bird.angle) * orbit, find ? .045 : .08);
      bird.y = lerp(bird.y, anchorY + Math.sin(bird.angle) * (find ? orbit * .6 : 12), find ? .045 : .08);
    }
    if (hasUnlocked(4)) {
      guardian.angle += delta * 1.2;
      guardian.x = lerp(guardian.x, player.x - 72 + Math.cos(guardian.angle) * 20, .055);
      guardian.y = lerp(guardian.y, player.y - 52 + Math.sin(guardian.angle) * 16, .055);
    }
  }

  function updateCooperationPuzzle() {
    if (game.phase !== "cooperation" || !game.coopPuzzle || game.coopSolved) return;
    const playerReady = distance(player, game.coopPuzzle.plateA) < 52;
    const bradleyReady = distance(bradley, game.coopPuzzle.plateB) < 52;
    if (!playerReady || !bradleyReady) return;
    game.coopSolved = true;
    game.phase = "boss";
    bradley.command = "follow";
    bradley.target = null;
    setObjective(`Defeat ${game.chapter.boss.name}`);
    showComicWord("TEAMWORK!", "#8ce568");
    announce("Teamwork complete. The boss is vulnerable.");
    particles.burst(game.coopPuzzle.plateA.x, game.coopPuzzle.plateA.y, "#8ce568", 18, 130);
    particles.burst(game.coopPuzzle.plateB.x, game.coopPuzzle.plateB.y, "#8ce568", 18, 130);
    spawnBoss();
  }

  function fireMonsterAttack(enemy) {
    const aimed = normalize(player.x - enemy.x, player.y - enemy.y);
    const curling = ["wisp", "shadowmoth", "quillseer"].includes(enemy.type);
    const rune = ["prismimp", "bookwisp"].includes(enemy.type);
    const count = enemy.type === "stormbat" ? 5 : enemy.type === "quillseer" ? 4 : curling ? 3 : 2;
    for (let index = 0; index < count; index += 1) {
      if (game.enemyProjectiles.length >= 96) break;
      const spread = (index - (count - 1) / 2) * (enemy.type === "stormbat" ? .17 : enemy.type === "quillseer" ? .2 : curling ? .28 : .15);
      const angle = Math.atan2(aimed.y, aimed.x) + spread;
      const speed = enemy.type === "stormbat" ? 255 : enemy.type === "quillseer" ? 235 : rune ? 245 : curling ? 220 : 285;
      game.enemyProjectiles.push({
        x: enemy.x, y: enemy.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: curling ? 9 : 8,
        life: 3.2,
        color: enemy.color,
        damage: enemy.damage,
        monsterShot: true,
        shape: ["stormbat", "quillseer"].includes(enemy.type) ? "feather" : rune ? "rune" : enemy.type === "shadowmoth" ? "shadow" : enemy.type === "prismimp" ? "prism" : curling ? "storm" : "star",
        turnRate: enemy.type === "quillseer" ? (index - 1.5) * .16 : enemy.type === "shadowmoth" ? (index - 1) * -.22 : curling ? (index - 1) * .34 : enemy.type === "voidling" ? (index - 1) * .2 : 0,
        age: 0
      });
    }
    particles.burst(enemy.x, enemy.y, enemy.color, 7, 80);
    sound.play("bolt");
  }

  function fireElitePulse(enemy) {
    for (let index = 0; index < 6; index += 1) {
      if (game.enemyProjectiles.length >= 96) break;
      const angle = index * Math.PI / 3 + game.sceneTime * .35;
      game.enemyProjectiles.push({
        x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 205, vy: Math.sin(angle) * 205,
        radius: 9, life: 2.8, color: enemy.eliteTrait?.color || enemy.color,
        damage: enemy.damage, monsterShot: true, shape: "storm", turnRate: index % 2 ? .12 : -.12, age: 0
      });
    }
    particles.burst(enemy.x, enemy.y, enemy.eliteTrait?.color || enemy.color, 12, 105);
    showComicWord("TEMPEST!", enemy.eliteTrait?.color || enemy.color);
    sound.play("bolt");
  }

  function updateEnemies(delta) {
    game.enemies.forEach(enemy => {
      if (!enemy.active) return;
      enemy.phase += delta * (enemy.type === "slime" ? 4.4 : 2.8);
      enemy.invulnerable = Math.max(0, enemy.invulnerable - delta);
      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - delta);
      enemy.contactCooldown = Math.max(0, enemy.contactCooldown - delta);
      const previousCharge = enemy.chargeTime;
      enemy.chargeTime = Math.max(0, enemy.chargeTime - delta);
      enemy.marked = Math.max(0, (enemy.marked || 0) - delta);
      enemy.stunTime = Math.max(0, (enemy.stunTime || 0) - delta);
      enemy.exposed = Math.max(0, (enemy.exposed || 0) - delta);
      enemy.hitStagger = Math.max(0, (enemy.hitStagger || 0) - delta);
      const previousWindup = enemy.windupTime;
      enemy.windupTime = Math.max(0, enemy.windupTime - delta);
      if (previousWindup > 0 && enemy.windupTime === 0) enemy.chargeTime = ["thornling", "sandbeetle", "inkhound"].includes(enemy.type) ? .4 : ["vinebrute", "gearbug", "runeknight"].includes(enemy.type) ? .52 : .28;
      if (previousCharge > 0 && enemy.chargeTime === 0) enemy.exposed = .8;
      const away = distance(enemy, player);
      if (enemy.eliteTrait) {
        enemy.eliteTimer -= delta;
        enemy.phaseTime = Math.max(0, (enemy.phaseTime || 0) - delta);
        if (enemy.eliteTrait.id === "overclock" && enemy.eliteTimer <= 0 && away < 430) {
          fireMonsterAttack(enemy);
          enemy.eliteTimer = 1.75;
        } else if (enemy.eliteTrait.id === "phase" && enemy.eliteTimer <= 0) {
          enemy.phaseTime = .72;
          enemy.eliteTimer = 3.15;
          showComicWord("PHASE!", enemy.eliteTrait.color);
        } else if (enemy.eliteTrait.id === "regrowth" && enemy.hp < enemy.maxHp) {
          enemy.hp = Math.min(enemy.maxHp, enemy.hp + delta * .3);
        } else if (enemy.eliteTrait.id === "tempest" && enemy.eliteTimer <= 0 && away < 470) {
          fireElitePulse(enemy);
          enemy.eliteTimer = 2.75;
        } else if (enemy.eliteTrait.id === "summoner" && !enemy.eliteTriggered && enemy.hp <= enemy.maxHp * .5) {
          enemy.eliteTriggered = true;
          spawnEnemy("inkhound", enemy.x - 54, enemy.y + 28, { scale: .78, noDrop: true });
          spawnEnemy("inkhound", enemy.x + 54, enemy.y - 28, { scale: .78, noDrop: true });
          particles.burst(enemy.x, enemy.y, enemy.eliteTrait.color, 18, 140);
          showComicWord("PAGECALL!", enemy.eliteTrait.color);
        }
        if (enemy.phaseTime > 0) enemy.invulnerable = Math.max(enemy.invulnerable, .06);
      }
      if (away < 430) scanMonster(enemy.type);
      const toward = normalize(player.x - enemy.x, player.y - enemy.y);
      let direction = { x: 0, y: 0 };
      let speed = enemy.speed;

      if (enemy.stunTime > 0 || enemy.hitStagger > 0) {
        direction = { x: 0, y: 0 };
      } else if (enemy.phaseTime > 0) {
        direction = { x: Math.cos(enemy.phase) * .22, y: Math.sin(enemy.phase) * .22 };
      } else if (enemy.windupTime > 0) {
        direction = { x: 0, y: 0 };
      } else if (enemy.chargeTime > 0) {
        direction = enemy.attackDirection;
        speed *= ["thornling", "sandbeetle", "inkhound"].includes(enemy.type) ? 3.05 : enemy.type === "gearbug" ? 2.85 : ["vinebrute", "runeknight"].includes(enemy.type) ? 2.55 : 2.25;
        if (Math.floor(enemy.chargeTime * 40) % 3 === 0) particles.burst(enemy.x, enemy.y, enemy.color, 2, 35);
      } else if (enemy.behavior === "ranged" && away < 430) {
        if (away > 245) direction = toward;
        else if (away < 145) direction = { x: -toward.x, y: -toward.y };
        else direction = { x: -toward.y * .45, y: toward.x * .45 };
        if (enemy.attackCooldown <= 0 && away < 390) {
          enemy.attackCooldown = enemy.type === "wisp" ? 1.85 : 1.55;
          fireMonsterAttack(enemy);
        }
      } else if (away < 390) {
        direction = toward;
        const charger = ["thornling", "sandbeetle", "vinebrute", "gearbug", "runeknight"].includes(enemy.type);
        const pouncer = ["slime", "inkhound"].includes(enemy.type);
        const canSpecial = (charger && away < 285) || (pouncer && away < 220);
        if (canSpecial && enemy.attackCooldown <= 0) {
          enemy.windupTime = ["thornling", "sandbeetle"].includes(enemy.type) ? .42 : enemy.type === "inkhound" ? .24 : charger ? .52 : .28;
          enemy.attackCooldown = enemy.type === "vinebrute" ? 2.1 : enemy.type === "runeknight" ? 2.25 : enemy.type === "gearbug" ? 1.65 : enemy.type === "thornling" ? 1.85 : enemy.type === "sandbeetle" ? 1.7 : enemy.type === "inkhound" ? 1.2 : 1.45;
          enemy.attackDirection = toward;
          direction = { x: 0, y: 0 };
          particles.burst(enemy.x, enemy.y, enemy.color, 8, 95);
        }
      } else {
        const homeDistance = Math.hypot(enemy.homeX - enemy.x, enemy.homeY - enemy.y);
        direction = homeDistance > 55
          ? normalize(enemy.homeX - enemy.x, enemy.homeY - enemy.y)
          : { x: Math.cos(enemy.phase) * .35, y: Math.sin(enemy.phase * .8) * .35 };
        speed *= .42;
      }

      enemy.facingX = Math.abs(direction.x) > .04 ? direction.x : enemy.facingX;
      moveCircle(enemy, direction.x * speed * delta, direction.y * speed * delta, true);
      // A rune guard cannot kite away from its post. Without this the ranged
      // ones retreat out of reach and the player ends up chasing a monster
      // across the arena to unlock a rune standing right in front of them.
      if (enemy.guardsRune) {
        const post = { x: enemy.leashX, y: enemy.leashY };
        const out = distance(enemy, post);
        const LEASH = 120;
        if (out > LEASH) {
          const back = normalize(post.x - enemy.x, post.y - enemy.y);
          enemy.x = post.x - back.x * LEASH;
          enemy.y = post.y - back.y * LEASH;
        }
      }
      if (enemy.stunTime <= 0 && enemy.phaseTime <= 0 && away < player.radius + enemy.radius + 7 && enemy.contactCooldown <= 0) {
        enemy.contactCooldown = 1.05;
        hurtPlayer(enemy.damage, enemy);
      }
    });
  }

  function updateBoss(delta) {
    const boss = game.boss;
    if (!boss?.active) return;
    boss.animationTime = (boss.animationTime || 0) + delta;
    boss.animStateTime = (boss.animStateTime || 0) + delta;
    if (boss.defeated) {
      boss.deathTime = Math.max(0, boss.deathTime - delta);
      if (boss.deathTime === 0) finishBossDefeat();
      return;
    }
    boss.hurtTime = Math.max(0, (boss.hurtTime || 0) - delta);
    boss.attackAnimTime = Math.max(0, (boss.attackAnimTime || 0) - delta);
    if (boss.peaceful) {
      boss.animState = "idle";
      boss.isMoving = false;
      return;
    }
    boss.invulnerable = Math.max(0, boss.invulnerable - delta);
    boss.attackTimer -= delta;
    if (boss.attackTimer <= boss.telegraphDuration && !boss.telegraphTarget) {
      boss.telegraphTarget = { x: player.x, y: player.y };
    }
    boss.meleeTime = Math.max(0, (boss.meleeTime || 0) - delta);
    boss.moveTimer += delta;
    boss.angle += delta;
    const direction = normalize(player.x - boss.x, player.y - boss.y);
    const desiredDistance = ["engine", "warden", "raven", "final"].includes(boss.type) ? 260 : 150;
    const away = distance(player, boss);
    const movement = away > desiredDistance ? 48 : away < desiredDistance - 70 ? -35 : 0;
    boss.isMoving = boss.meleeTime > 0 || movement !== 0;
    if (Math.abs(direction.x) > .08) boss.facingX = direction.x;
    if (boss.meleeTime > 0) {
      const lunge = boss.meleeKind === "dive" ? 390 : 275;
      boss.x = clamp(boss.x + boss.attackDirection.x * lunge * delta, 100, 1180);
      boss.y = clamp(boss.y + boss.attackDirection.y * lunge * delta, 90, 630);
      if (!boss.meleeHit && distance(player, boss) < player.radius + boss.radius + 24) {
        boss.meleeHit = true;
        hurtPlayer(boss.meleeDamage, boss);
      }
    } else {
      boss.x = clamp(boss.x + direction.x * movement * delta, 100, 1180);
      boss.y = clamp(boss.y + direction.y * movement * delta + Math.sin(boss.moveTimer * 2.4) * 22 * delta, 90, 630);
    }
    if (boss.attackTimer <= 0) {
      const cooldowns = { pi: 1.2, warden: 1.02, engine: 1.38, shadow: 1.08, raven: .82, final: .88 };
      boss.attackTimer = cooldowns[boss.type] || 1.15;
      fireBossAttack(boss);
      boss.telegraphTarget = null;
    }
    const nextState = boss.hurtTime > 0 ? "hurt" : boss.attackAnimTime > 0 || boss.meleeTime > 0 ? "attack" : boss.isMoving ? "move" : "idle";
    if (nextState !== boss.animState) {
      boss.animState = nextState;
      boss.animStateTime = 0;
    }
  }

  function startBossMelee(boss, kind = "slam", damage = 2) {
    boss.meleeTime = kind === "dive" ? .52 : .42;
    boss.attackAnimTime = Math.max(boss.attackAnimTime || 0, kind === "dive" ? .66 : .54);
    boss.meleeHit = false;
    boss.meleeKind = kind;
    boss.meleeDamage = damage;
    const target = boss.telegraphTarget || player;
    boss.attackDirection = normalize(target.x - boss.x, target.y - boss.y);
    particles.burst(boss.x, boss.y, game.chapter.palette.glow, kind === "dive" ? 14 : 20, 150);
    sound.play("boom");
  }

  function fireBossAttack(boss) {
    boss.attackAnimTime = Math.max(boss.attackAnimTime || 0, boss.type === "raven" ? .66 : .52);
    boss.animStateTime = 0;
    const target = boss.telegraphTarget || player;
    const aimed = normalize(target.x - boss.x, target.y - boss.y);
    const aimedAngle = Math.atan2(aimed.y, aimed.x);
    const healthRatio = boss.hp / boss.maxHp;
    const phase = healthRatio <= .34 ? 3 : healthRatio <= .67 ? 2 : 1;
    const launch = (angle, speed, options = {}) => {
      // A defensive ceiling keeps older iPads responsive even if several
      // patterns overlap after a slow frame or repeated phase transition.
      if (game.enemyProjectiles.length >= 96) return;
      game.enemyProjectiles.push({
        x: boss.x, y: boss.y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        radius: options.radius || 11,
        life: options.life || 4,
        color: options.color || "#b85dff",
        damage: options.damage || 1,
        shape: options.shape || "orb",
        turnRate: options.turnRate || 0,
        age: 0,
        bossShot: boss.type
      });
    };

    // Phase 3 previously just meant "same attack, more bullets". Each boss now
    // alternates in one move that only exists at low health, so the last third
    // of a fight asks a different question than the first two.
    if (phase === 3 && boss.attackPattern % 2 === 1) {
      boss.attackPattern += 1;
      fireSignatureAttack(boss, launch, aimedAngle);
      return;
    }

    if (boss.type === "pi") {
      const count = phase === 3 ? 5 : 3;
      for (let index = 0; index < count; index += 1) { const offset = index - (count - 1) / 2; launch(aimedAngle + offset * .2, 225 + Math.abs(offset) * 18, { radius: 15, color: "#d78aff", shape: "pi", turnRate: offset * .08 }); }
    } else if (boss.type === "warden") {
      if (distance(player, boss) < 215) { startBossMelee(boss, "slam", phase + 1); boss.attackPattern += 1; return; }
      const colors = ["#39a8ff", "#a65dff", "#ff9f1c", "#7ee568"];
      const color = colors[boss.attackPattern % colors.length];
      const count = phase === 3 ? 5 : 3;
      for (let index = 0; index < count; index += 1) { const offset = index - (count - 1) / 2; launch(aimedAngle + offset * .15, 270 + phase * 12, { radius: 12, color, shape: "crystal" }); }
    } else if (boss.type === "engine") {
      const offset = boss.attackPattern * .31;
      const count = phase === 3 ? 12 : phase === 2 ? 10 : 8;
      for (let index = 0; index < count; index += 1) launch(offset + index * Math.PI * 2 / count, 205 + phase * 10, { radius: 11, color: index % 2 ? "#ba57ff" : "#69e5ff", shape: "gear", life: 4.8 });
    } else if (boss.type === "shadow") {
      if (distance(player, boss) < 310) { startBossMelee(boss, "dive", phase + 1); boss.attackPattern += 1; return; }
      const count = phase === 3 ? 7 : 5;
      for (let index = 0; index < count; index += 1) { const offset = index - (count - 1) / 2; launch(aimedAngle + offset * .2, 238 + phase * 8, { radius: 13, color: "#c77dff", shape: "crescent", turnRate: -offset * .045 }); }
    } else if (boss.type === "raven") {
      if (distance(player, boss) < 250) { startBossMelee(boss, "dive", phase + 1); boss.attackPattern += 1; return; }
      const count = phase === 3 ? 9 : 7;
      for (let index = 0; index < count; index += 1) { const offset = index - (count - 1) / 2; launch(aimedAngle + offset * .14, 300 + (3-Math.abs(offset))*12 + phase * 10, { radius: 10, color: index % 2 ? "#8da2d9" : "#38496f", shape: "feather" }); }
    } else if (boss.type === "final") {
      if (distance(player, boss) < 230 && boss.attackPattern % 2 === 0) { startBossMelee(boss, "slam", phase + 1); boss.attackPattern += 1; return; }
      const healthRatio = boss.hp / boss.maxHp;
      const phase = healthRatio <= .34 ? 3 : healthRatio <= .67 ? 2 : 1;
      const count = phase === 3 ? 9 : phase === 2 ? 7 : 5;
      const spread = phase === 3 ? .18 : .22;
      for (let index = 0; index < count; index += 1) {
        const offset = index - (count - 1) / 2;
        launch(aimedAngle + offset * spread, 235 + phase * 22, { radius: 12 + phase, color: phase === 3 ? "#ffd34f" : phase === 2 ? "#d6a4ff" : "#8ce568", shape: "rune", turnRate: offset * .018, life: 4.4 });
      }
      if (phase >= 2) launch(aimedAngle + Math.PI, 185, { radius: 14, color: "#ff9f1c", shape: "rune", life: 4.4 });
    } else {
      launch(aimedAngle, 245);
    }
    boss.attackPattern += 1;
    particles.burst(boss.x, boss.y, game.chapter.palette.glow, boss.type === "engine" ? 18 : 9, 105);
    sound.play("bolt");
  }

  function fireSignatureAttack(boss, launch, aimedAngle) {
    const names = {
      pi: "FULL CIRCLE!", warden: "PRISM CROSS!", engine: "DOUBLE HELIX!",
      shadow: "NIGHTFALL!", raven: "STORMBREAK!", final: "THE BOOK OPENS!"
    };
    showComicWord(names[boss.type] || "OVERDRIVE!", "#ff5d62");
    game.shake = Math.max(game.shake, 10);
    particles.burst(boss.x, boss.y, game.chapter.palette.glow, 26, 200);
    sound.play("boom");

    if (boss.type === "pi") {
      // A closed ring: no safe side, but slow enough to dash a gap.
      for (let i = 0; i < 12; i += 1) {
        launch(i * Math.PI * 2 / 12, 190, { radius: 14, color: "#d78aff", shape: "pi" });
      }
    } else if (boss.type === "warden") {
      // Four colours on the diagonals, each pair rotating opposite ways.
      const colors = ["#39a8ff", "#a65dff", "#ff9f1c", "#7ee568"];
      for (let i = 0; i < 8; i += 1) {
        launch(i * Math.PI / 4, 250, {
          radius: 12, color: colors[i % 4], shape: "crystal",
          turnRate: (i % 2 ? .3 : -.3)
        });
      }
    } else if (boss.type === "engine") {
      // Two counter-rotating rings that braid as they travel.
      for (let ring = 0; ring < 2; ring += 1) {
        for (let i = 0; i < 9; i += 1) {
          launch(i * Math.PI * 2 / 9 + ring * .35, 200 + ring * 34, {
            radius: 10, color: ring ? "#ba57ff" : "#69e5ff", shape: "gear",
            turnRate: ring ? .34 : -.34, life: 5
          });
        }
      }
    } else if (boss.type === "shadow") {
      // A wall of crescents that closes from both sides at once.
      for (const side of [-1, 1]) {
        for (let i = 0; i < 5; i += 1) {
          launch(aimedAngle + side * (.28 + i * .26), 230, {
            radius: 13, color: "#c77dff", shape: "crescent", turnRate: -side * .16
          });
        }
      }
      startBossMelee(boss, "dive", 3);
    } else if (boss.type === "raven") {
      // Nearly a full fan of feathers, with one deliberate gap behind the boss.
      for (let i = 0; i < 14; i += 1) {
        launch(aimedAngle - 1.45 + i * (2.9 / 13), 285 + (i % 3) * 26, {
          radius: 10, color: i % 2 ? "#8da2d9" : "#38496f", shape: "feather"
        });
      }
    } else if (boss.type === "final") {
      // The spiral from the portal art, thrown at the player.
      for (let i = 0; i < 16; i += 1) {
        launch(aimedAngle + i * .42, 175 + i * 9, {
          radius: 11, color: i % 2 ? "#ffd34f" : "#d6a4ff", shape: "rune",
          turnRate: .12, life: 5
        });
      }
    } else {
      for (let i = 0; i < 8; i += 1) launch(i * Math.PI / 4, 220);
    }
  }

  function updateProjectiles(delta) {
    const updateList = list => {
      list.forEach(projectile => {
        projectile.age = (projectile.age || 0) + delta;
        if (projectile.turnRate) {
          const speed = Math.hypot(projectile.vx, projectile.vy);
          const angle = Math.atan2(projectile.vy, projectile.vx) + projectile.turnRate * delta;
          projectile.vx = Math.cos(angle) * speed;
          projectile.vy = Math.sin(angle) * speed;
        }
        projectile.x += projectile.vx * delta;
        projectile.y += projectile.vy * delta;
        projectile.life -= delta;
      });
    };
    updateList(game.projectiles);
    updateList(game.enemyProjectiles);
    game.attacks.forEach(attack => { attack.life -= delta; });

    game.projectiles.forEach(projectile => {
      if (projectile.life > 0 && game.enemies.some(enemy => enemy.active && circleHit(projectile, enemy))) {
        if (projectile.marks) markEnemies(projectile);
        damageEnemies(projectile, projectile.damage);
        projectile.life = 0;
      }
      if (projectile.life > 0 && game.boss?.active && !game.boss.peaceful && circleHit(projectile, game.boss)) {
        damageBoss(projectile, projectile.damage);
        projectile.life = 0;
      }
      if (projectile.life > 0 && game.chapter.puzzle.type === "break") damageBreakTargets(projectile, 1);
    });

    game.enemyProjectiles.forEach(projectile => {
      if (projectile.life <= 0) return;
      if (player.shieldTime > 0 && distance(projectile, player) < player.radius + projectile.radius + 35) {
        const outward = normalize(projectile.x - player.x, projectile.y - player.y);
        game.projectiles.push({ ...projectile, vx: outward.x * (470 + skillRank() * 25), vy: outward.y * (470 + skillRank() * 25), color: "#8ce568", damage: 1 + Math.ceil(skillRank() / 2), life: 1.5 });
        projectile.life = 0;
        // Reflecting a shot breaks the guard of everything weak to the shield,
        // not just the Storm Wisp it was originally written for.
        game.enemies.forEach(enemy => { if (enemy.active && enemy.weakness === "shield" && distance(enemy, player) < 170) { enemy.exposed = 1.2; enemy.stunTime = .45; } });
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

  function markEnemies(hit) {
    game.enemies.forEach(enemy => {
      if (!enemy.active || !circleHit(hit, enemy)) return;
      enemy.marked = 3.2;
      particles.burst(enemy.x, enemy.y, "#d6a4ff", 6, 90);
    });
  }

  function hurtPlayer(amount, source) {
    if (player.dashTime > 0) {
      player.perfectDodgeTime = .55;
      if (player.counterCooldown > 0) {
        particles.burst(player.x, player.y, "#d9ffb7", 8, 120);
        showComicWord("DODGE!", "#8ce568");
        return;
      }
      player.counterReadyTime = .78;
      player.attackCooldown = 0;
      particles.burst(player.x, player.y, "#d9ffb7", 18, 190);
      sound.play("perfectDodge");
      haptic([8, 22, 12]);
      game.hitStop = Math.max(game.hitStop, .055);
      game.zoomPunch = Math.max(game.zoomPunch, .025);
      showComicWord("PERFECT! ATTACK!", "#8ce568");
      announce("Perfect dodge. Press attack now for a powerful counter.");
      return;
    }
    if (player.invulnerable > 0 || player.shieldTime > 0) return;
    player.health = Math.max(0, player.health - amount);
    player.invulnerable = 1;
    player.hurtTime = .36;
    player.previousAnimState = player.animState;
    player.previousAnimStateTime = player.animStateTime;
    player.animState = "hurt";
    player.animStateTime = 0;
    player.animBlend = 0;
    const knock = normalize(player.x - source.x, player.y - source.y);
    moveCircle(player, knock.x * 35, knock.y * 35);
    particles.burst(player.x, player.y, "#ff5d62", 12, 160);
    sound.play("hurt");
    haptic([25, 35, 18]);
    game.shake = 7;
    showComicWord("OOF!", "#ff5d62");
    if (player.health <= 0) heroFell();
  }

  function heroFell() {
    game.mode = "dialogue";
    showDialogue([["Clark", "That portal got the jump on me. One more try—from the last safe page!"]], () => {
      respawn();
      game.mode = "playing";
    });
  }

  // Falling costs the fight, not the chapter. Solved runes, collected memories and
  // wave progress all survive; the current encounter resets to a fair starting
  // state so the retry is winnable without redoing the puzzle every time.
  function respawn() {
    hudHeartSignature = "";
    player.health = player.maxHealth;
    player.energy = player.maxEnergy;
    player.invulnerable = 1.6;
    player.x = game.chapter.start.x;
    player.y = game.chapter.start.y;
    player.attackCooldown = 0;
    player.attackTime = 0;
    player.dashTime = 0;
    player.dashCooldown = 0;
    player.shieldTime = 0;
    player.comboStep = 0;
    player.comboTimer = 0;
    player.perfectDodgeTime = 0;
    player.counterReadyTime = 0;
    player.counterCooldown = 0;
    player.hurtTime = 0;
    player.animationTime = 0;
    player.animState = "idle";
    player.animStateTime = 0;
    player.previousAnimState = "idle";
    player.previousAnimStateTime = 0;
    player.animBlend = 1;
    player.capeAngle = -.08;
    player.capeVelocity = 0;
    player.dashStrikeWindow = 0;
    player.hammerCharging = false;
    player.hammerCharge = 0;
    player.touchAttackHeld = false;
    game.camera.x = player.x;
    game.camera.y = player.y;
    game.attacks = [];
    game.projectiles = [];
    game.enemyProjectiles = [];
    game.aimTarget = null;
    game.aimTargetTime = 0;
    bradley.x = player.x - 45;
    bradley.y = player.y + 35;
    bradley.cooldown = 0;
    game.enemies.forEach(enemy => {
      if (!enemy.active) return;
      enemy.hp = enemy.maxHp;
      enemy.x = enemy.homeX;
      enemy.y = enemy.homeY;
      enemy.invulnerable = 0;
      enemy.windupTime = 0;
      enemy.chargeTime = 0;
      enemy.stunTime = 0;
      enemy.exposed = 0;
      enemy.marked = 0;
      enemy.hitStagger = 0;
      enemy.contactCooldown = 0;
      enemy.attackCooldown = .8 + Math.random() * .9;
      enemy.eliteTimer = enemy.elite ? 1.4 + Math.random() * 1.2 : 0;
      enemy.eliteTriggered = false;
      enemy.phaseTime = 0;
    });
    if (game.boss?.active && !game.boss.peaceful) {
      game.boss.hp = game.boss.maxHp;
      game.boss.phaseIndex = 1;
      game.boss.attackTimer = 1.6;
      game.boss.attackPattern = 0;
      game.boss.meleeTime = 0;
      game.boss.invulnerable = 0;
      game.boss.hurtTime = 0;
      game.boss.attackAnimTime = 0;
      game.boss.animationTime = 0;
      game.boss.animState = "idle";
      game.boss.animStateTime = 0;
      game.boss.isMoving = false;
      game.boss.telegraphTarget = null;
      game.boss.defeated = false;
      game.boss.deathTime = 0;
      game.boss.x = game.chapter.boss.x;
      game.boss.y = game.chapter.boss.y;
    }
    if (game.chapter.timed && !game.puzzleSolved) game.timeLeft = game.chapter.timed;
    showComicWord("BACK UP!", "#8ce568");
    announce("Clark is back on his feet. The chapter's progress is safe.");
  }

  function updateTimedTrial(delta) {
    if (game.timeLeft === null) return;
    if (game.puzzleSolved) {
      // Trial passed — hand the readout back to updateHud.
      game.timeLeft = null;
      dom.chapterReadout.textContent = `Chapter ${game.chapter.id}`;
      return;
    }
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
    if (game.healingShrine) game.healingShrine.cooldown = Math.max(0, game.healingShrine.cooldown - delta);
    game.aimTargetTime = Math.max(0, game.aimTargetTime - delta);
    game.flash = Math.max(0, game.flash - delta);
    game.shake = Math.max(0, game.shake - 30 * delta);
    game.zoomPunch = Math.max(0, game.zoomPunch - delta * .18);
    updatePlayer(delta);
    const cameraEase = 1 - Math.pow(.002, delta);
    game.camera.x = lerp(game.camera.x, player.x, cameraEase);
    game.camera.y = lerp(game.camera.y, player.y, cameraEase);
    updateCompanions(delta);
    updateCooperationPuzzle();
    updateEnemies(delta);
    updateFinalWaves(delta);
    updateBoss(delta);
    updateProjectiles(delta);
    particles.update(delta);
    updateTimedTrial(delta);
    updateInteractionPrompt();
    updateHud();
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, width, height, radius);
      return;
    }
    // Canvas roundRect is missing on older iPadOS Safari. A thrown TypeError
    // here used to abort the animation frame and make Chapter 7 look frozen.
    const r = Math.max(0, Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2));
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y); ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r); ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  // ctx.shadowBlur re-blurs the source bitmap on every single draw call, which
  // measured 6-14x the cost of the draw itself — 30 blurred projectiles alone ate
  // 8.3ms of a 16.7ms frame. Anything drawn once per entity uses these instead:
  // one extra low-alpha pass that the compositor handles almost for free. The
  // handful of singletons (portal, boss, Clark's shield) keep real blur.
  function haloFill(ctx, x, y, radius, color, strength = .3) {
    const alpha = ctx.globalAlpha;
    ctx.globalAlpha = alpha * strength;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha;
  }

  // Soft outer pass for a stroked ring: same shape, wider and fainter.
  function haloArc(ctx, x, y, radius, color, lineWidth, start = 0, end = Math.PI * 2, strength = .28) {
    const alpha = ctx.globalAlpha;
    ctx.globalAlpha = alpha * strength;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end);
    ctx.stroke();
    ctx.globalAlpha = alpha;
  }

  function drawAtlasCell(ctx, image, cell, columns, rows, x, y, width, height) {
    if (!image?.complete || !image.naturalWidth || !cell) return false;
    const cellWidth = image.naturalWidth / columns;
    const cellHeight = image.naturalHeight / rows;
    ctx.drawImage(image, cell[0] * cellWidth, cell[1] * cellHeight, cellWidth, cellHeight, x, y, width, height);
    return true;
  }

  function drawWorldObject(ctx, key, x, y, width, height) {
    return drawAtlasCell(ctx, loadWorldObjectAtlas(), WORLD_OBJECT_CELLS[key], 4, 3, x, y, width, height);
  }

  function drawCombatEffect(ctx, key, x, y, width, height, rotation = 0, alpha = 1) {
    const image = loadCombatEffectsAtlas();
    const cell = COMBAT_EFFECT_CELLS[key];
    if (!image?.complete || !image.naturalWidth || !cell) return false;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.globalAlpha *= alpha;
    const drawn = drawAtlasCell(ctx, image, cell, 4, 3, -width / 2, -height / 2, width, height);
    ctx.restore();
    return drawn;
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
    ctx.globalAlpha = active ? 1 : .36;
    ctx.shadowColor = portal.color;
    ctx.shadowBlur = active ? 22 : 5;
    if (!drawWorldObject(ctx, "portal", -69, -88, 138, 154)) {
      ctx.strokeStyle = portal.color; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.ellipse(0,0,44,70,0,0,Math.PI*2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawMemory(ctx, memory) {
    if (memory.collected) return;
    const pulse = 1 + Math.sin(game.sceneTime * 4 + memory.index) * .18;
    ctx.save(); ctx.translate(memory.x,memory.y); ctx.scale(pulse,pulse);
    ctx.rotate(Math.sin(game.sceneTime * .9 + memory.index) * .08);
    if (!drawWorldObject(ctx, "memory", -27, -27, 54, 54)) {
      ctx.fillStyle = "#ffd34f"; ctx.font = "900 34px Georgia"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("✦", 0, 1);
    }
    ctx.restore();
  }

  function drawPuzzle(ctx) {
    const puzzle = game.chapter.puzzle;
    if (puzzle.type === "break") {
      puzzle.targets.forEach(target => {
        if (game.activeTargets.has(target.id)) return;
        const health = game.brokenTargets.get(target.id) ?? 3;
        ctx.save(); ctx.translate(target.x,target.y);
        ctx.translate(health === 1 ? Math.sin(game.sceneTime * 22) * 1.5 : 0, Math.sin(game.sceneTime * 2.2 + target.x) * 1.5);
        ctx.globalAlpha = .7 + health * .1;
        if (!drawWorldObject(ctx, "crackedStone", -49, -48, 98, 96)) {
          ctx.fillStyle = "#5e6655"; ctx.fillRect(-36, -36, 72, 72);
        }
        ctx.restore();
      });
    } else if (puzzle.type === "push") {
      const goal=puzzle.goal;
      ctx.save(); ctx.translate(goal.x, goal.y); ctx.globalAlpha = .9 + Math.sin(game.sceneTime * 4) * .1;
      drawWorldObject(ctx, "goalSocket", -49, -49, 98, 98); ctx.restore();
      if(game.block){ctx.save();ctx.translate(game.block.x,game.block.y);drawWorldObject(ctx,"runeBlock",-43,-43,86,86);ctx.restore();}
    } else {
      puzzle.targets.forEach(target => {
        const active=game.activeTargets.has(target.id);
        ctx.save();ctx.translate(target.x,target.y);
        const key = puzzle.type === "rhythm" ? "musicRune"
          : target.id.includes("leaf") ? "leafRune"
            : (target.match || target.id).includes("spiral") ? "spiralRune"
              : game.chapter.id === 2 ? "energyCore" : "starRune";
        const size = puzzle.type === "rhythm" ? 102 : 88;
        const scale = active ? 1.08 : 1;
        ctx.scale(scale, scale); ctx.globalAlpha = active ? 1 : .72;
        ctx.shadowColor = target.color; ctx.shadowBlur = active ? 18 : 4;
        drawWorldObject(ctx,key,-size/2,-size/2,size,size);
        ctx.shadowBlur = 0;
        if (puzzle.type === "rhythm") {
          ctx.globalAlpha = 1; ctx.fillStyle = "#fff6d0"; ctx.strokeStyle = "#38234c"; ctx.lineWidth = 4;
          ctx.font="900 24px Trebuchet MS";ctx.textAlign="center";ctx.textBaseline="middle";
          ctx.strokeText(String(target.number),0,3);ctx.fillText(String(target.number),0,3);
        }
        ctx.restore();
        if(!active)drawRuneGuardLink(ctx,target);
      });
    }
    if (game.phase === "cooperation" && game.coopPuzzle) drawCooperationPuzzle(ctx);
  }

  // A dashed leash from the rune to whoever is holding it, plus a padlock on
  // the rune itself. One glance says "clear that, then come back here".
  function drawRuneGuardLink(ctx, target) {
    const guard = runeGuard(target.id);
    if (!guard) return;
    const pulse = .5 + Math.sin(game.sceneTime * 3.4) * .18;
    ctx.save();
    ctx.globalAlpha = pulse * .7;
    ctx.strokeStyle = "#ff8a8f";
    ctx.setLineDash([9, 8]);
    ctx.lineDashOffset = -game.sceneTime * 26;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(target.x, target.y);
    ctx.lineTo(guard.x, guard.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    ctx.save();
    ctx.translate(target.x, target.y - 46);
    ctx.globalAlpha = .92;
    haloFill(ctx, 0, 0, 15, "#ff5d62", .3);
    ctx.fillStyle = "#ff5d62";
    ctx.strokeStyle = "#2b0d10";
    ctx.lineWidth = 2;
    roundedRect(ctx, -8, -4, 16, 13, 3); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#ff5d62"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -4, 5.5, Math.PI, 0); ctx.stroke();
    ctx.restore();
  }

  function drawCooperationPuzzle(ctx) {
    const pulse = 1 + Math.sin(game.sceneTime * 4) * .08;
    const drawPlate = (plate, occupied, label) => {
      ctx.save(); ctx.translate(plate.x, plate.y);
      ctx.scale(pulse, pulse); ctx.globalAlpha = occupied ? 1 : .72;
      ctx.shadowColor = occupied ? "#8ce568" : plate.color;
      ctx.shadowBlur = occupied ? 22 : 6;
      drawWorldObject(ctx, "coopPlate", -55, -38, 110, 76);
      ctx.shadowBlur = 0; ctx.fillStyle = occupied ? "#18301c" : plate.color; ctx.font = "900 13px Trebuchet MS"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, 0, 1);
      ctx.restore();
    };
    const playerReady = distance(player, game.coopPuzzle.plateA) < 52;
    const bradleyReady = distance(bradley, game.coopPuzzle.plateB) < 52;
    drawPlate(game.coopPuzzle.plateA, playerReady, "CLARK");
    drawPlate(game.coopPuzzle.plateB, bradleyReady, "BRADLEY");
  }

  function drawHealingShrine(ctx) {
    const shrine = game.healingShrine;
    if (!shrine) return;
    const ready = shrine.cooldown <= 0;
    const pulse = ready ? 1 + Math.sin(game.sceneTime * 3.2) * .035 : .96;
    ctx.save(); ctx.translate(shrine.x, shrine.y); ctx.scale(pulse, pulse);
    ctx.globalAlpha = ready ? 1 : .56;
    ctx.shadowColor = ready ? "#ff8fb7" : "#6d8069";
    ctx.shadowBlur = ready ? 16 : 2;
    drawWorldObject(ctx, "healingShrine", -58, -64, 116, 116);
    ctx.restore();
  }

  function heroRigPose(state, time) {
    const pose = {
      rootX: 0, rootY: 0, bodyRot: 0, headRot: 0, headX: 0, headY: 0,
      leftUpperArm: .16, leftLowerArm: -.18, rightUpperArm: -.16, rightLowerArm: .18,
      leftThigh: .04, leftShin: -.08, leftFoot: .04,
      rightThigh: -.04, rightShin: .08, rightFoot: -.04,
      openLeftHand: false, openRightHand: false, weaponRot: .24
    };
    if (state === "idle") {
      const breath = Math.sin((player.animationTime || 0) * 2.8);
      pose.rootY = breath * 1.1;
      pose.headY = breath * -.55;
      pose.headRot = Math.sin((player.animationTime || 0) * 1.7) * .018;
      pose.leftUpperArm += breath * .025;
      pose.rightUpperArm -= breath * .025;
    } else if (state === "move") {
      const phase = player.walkCycle * Math.PI * 2;
      const stride = Math.sin(phase);
      const liftLeft = Math.max(0, -stride);
      const liftRight = Math.max(0, stride);
      pose.rootX = Math.sin(phase * 2) * .8;
      pose.rootY = -Math.abs(Math.sin(phase)) * 3.2;
      pose.bodyRot = stride * .035;
      pose.headRot = -pose.bodyRot * .7;
      pose.leftThigh = stride * .62;
      pose.rightThigh = -stride * .62;
      pose.leftShin = .08 + liftLeft * .72;
      pose.rightShin = .08 + liftRight * .72;
      pose.leftFoot = -(pose.leftThigh + pose.leftShin) * .72;
      pose.rightFoot = -(pose.rightThigh + pose.rightShin) * .72;
      pose.leftUpperArm = -stride * .48;
      pose.rightUpperArm = stride * .48;
      pose.leftLowerArm = -.22 - Math.abs(stride) * .12;
      pose.rightLowerArm = .16 + Math.abs(stride) * .1;
    } else if (state === "leafblade") {
      const progress = clamp(1 - player.attackTime / Math.max(.01, player.attackDuration), 0, 1);
      const swing = 1 - Math.pow(1 - progress, 3);
      pose.rootX = Math.sin(progress * Math.PI) * 4;
      pose.bodyRot = -.11 + swing * .2;
      pose.rightUpperArm = -1.65 + swing * 2.55;
      pose.rightLowerArm = -.32 + swing * .18;
      pose.weaponRot = -.25;
      pose.leftUpperArm = .58 - swing * .42;
      pose.leftLowerArm = -.42;
      pose.rightThigh = -.2; pose.leftThigh = .22;
    } else if (state === "hammer") {
      const progress = player.hammerCharging ? clamp(player.hammerCharge, 0, 1) * .28 : clamp(1 - player.attackTime / Math.max(.01, player.attackDuration), 0, 1);
      const slam = progress < .42 ? progress / .42 : 1 - Math.pow(1 - (progress - .42) / .58, 3);
      pose.rootY = progress > .42 ? Math.sin((progress - .42) / .58 * Math.PI) * 4 : 0;
      pose.bodyRot = -.12 + slam * .25;
      pose.rightUpperArm = -2.35 + slam * 2.75;
      pose.rightLowerArm = -.42;
      pose.leftUpperArm = -1.95 + slam * 2.2;
      pose.leftLowerArm = -.25;
      pose.weaponRot = -.16;
      pose.leftThigh = .18; pose.rightThigh = -.18;
    } else if (state === "dash") {
      const rush = Math.sin(Math.min(1, time / .28) * Math.PI);
      pose.rootX = 5 * rush;
      pose.rootY = -3;
      pose.bodyRot = .28;
      pose.headRot = -.16;
      pose.leftUpperArm = .75; pose.rightUpperArm = .58;
      pose.leftLowerArm = -.25; pose.rightLowerArm = .1;
      pose.leftThigh = .75; pose.rightThigh = .42;
      pose.leftShin = -.35; pose.rightShin = -.18;
      pose.leftFoot = -.25; pose.rightFoot = -.18;
      pose.weaponRot = -.55;
    } else if (state === "hurt") {
      const recoil = Math.sin(Math.min(1, time / .36) * Math.PI);
      pose.rootX = -5 * recoil;
      pose.rootY = -2 * recoil;
      pose.bodyRot = -.27 * recoil;
      pose.headRot = -.16 * recoil;
      pose.leftUpperArm = -1.05 * recoil; pose.rightUpperArm = 1.1 * recoil;
      pose.leftLowerArm = -.35; pose.rightLowerArm = .35;
      pose.leftThigh = -.34 * recoil; pose.rightThigh = .42 * recoil;
      pose.leftShin = .34 * recoil; pose.rightShin = -.16 * recoil;
      pose.openLeftHand = recoil > .25; pose.openRightHand = recoil > .25;
    }
    return pose;
  }

  function blendHeroRigPose(from, to, amount) {
    const eased = amount * amount * (3 - 2 * amount);
    const mixed = {};
    Object.keys(to).forEach(key => {
      mixed[key] = typeof to[key] === "number" ? lerp(typeof from[key] === "number" ? from[key] : to[key], to[key], eased) : eased < .5 ? from[key] : to[key];
    });
    return mixed;
  }

  function drawHeroRigPart(ctx, atlas, key, x, y, width, height, rotation = 0, pivotX = .5, pivotY = .1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS[key], 4, 3, -width * pivotX, -height * pivotY, width, height);
    ctx.restore();
  }

  function drawHeroRigLeg(ctx, atlas, x, upperAngle, lowerAngle, footAngle, bootKey) {
    ctx.save(); ctx.translate(x, -3); ctx.rotate(upperAngle);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS.thigh, 4, 3, -12, -4, 24, 38);
    ctx.translate(0, 28); ctx.rotate(lowerAngle);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS.shin, 4, 3, -10, -3, 20, 34);
    ctx.translate(0, 27); ctx.rotate(footAngle);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS[bootKey], 4, 3, -11, -7, 34, 24);
    ctx.restore();
  }

  function drawHeroRigArm(ctx, atlas, x, y, upperAngle, lowerAngle, openHand, weaponArt, wieldingHammer, weaponRot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(upperAngle);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS.upperArm, 4, 3, -11, -4, 22, 34);
    ctx.translate(0, 25); ctx.rotate(lowerAngle);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS.lowerArm, 4, 3, -5, -9, 31, 18);
    ctx.translate(23, 0);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS[openHand ? "openHand" : "fist"], 4, 3, -10, -11, 23, 23);
    if (weaponArt?.complete && weaponArt.naturalWidth) {
      ctx.rotate(weaponRot);
      ctx.shadowColor = wieldingHammer ? "#ff852a" : "#79eb8c";
      ctx.shadowBlur = player.attackTime > 0 ? 14 : 5;
      if (wieldingHammer) ctx.drawImage(weaponArt, -24, -64, 48, 78);
      else ctx.drawImage(weaponArt, -16, -56, 32, 64);
    }
    ctx.restore();
  }

  function drawClarkRig(ctx) {
    const atlas = loadHeroRig();
    if (!atlas.complete || !atlas.naturalWidth || !atlas.naturalHeight) return false;
    const current = heroRigPose(player.animState, player.animStateTime);
    const previous = heroRigPose(player.previousAnimState || player.animState, player.previousAnimStateTime || 0);
    const pose = blendHeroRigPose(previous, current, player.animBlend);
    const facingX = player.attackTime > 0 ? player.attackDirection.x : player.facing.x;
    const directionFlip = facingX < -.08 ? -1 : 1;
    const wieldingHammer = player.weapon === "hammer";
    const weaponArt = loadProp(wieldingHammer ? "cometHammer" : "leafblade");
    ctx.save(); ctx.scale(directionFlip, 1); ctx.translate(pose.rootX, pose.rootY);
    drawHeroRigPart(ctx, atlas, "cape", 3, -45, 78, 52, player.capeAngle, .86, .22);
    drawHeroRigLeg(ctx, atlas, -9, pose.leftThigh, pose.leftShin, pose.leftFoot, "bootLeft");
    drawHeroRigArm(ctx, atlas, -18, -39, pose.leftUpperArm, pose.leftLowerArm, pose.openLeftHand, null, false, 0);
    drawHeroRigLeg(ctx, atlas, 9, pose.rightThigh, pose.rightShin, pose.rightFoot, "bootRight");
    ctx.save(); ctx.rotate(pose.bodyRot);
    drawAtlasCell(ctx, atlas, HERO_RIG_CELLS.torso, 4, 3, -31, -52, 62, 59);
    drawHeroRigPart(ctx, atlas, "head", pose.headX, -65 + pose.headY, 64, 64, pose.headRot, .5, .5);
    drawHeroRigArm(ctx, atlas, 18, -39, pose.rightUpperArm, pose.rightLowerArm, pose.openRightHand, weaponArt, wieldingHammer, pose.weaponRot);
    ctx.restore();
    ctx.restore();
    return true;
  }

  function drawClark(ctx) {
    const blink = player.invulnerable > 0 && Math.floor(game.sceneTime * 14) % 2 === 0;
    ctx.save();ctx.translate(player.x,player.y);
    const attacking = player.attackTime > 0;
    const charging = player.hammerCharging;
    const stepPhase = (player.walkCycle % 1) * Math.PI;
    const hop = player.moving && !attacking ? Math.sin(stepPhase) : 0;
    const landing = player.moving && !attacking ? Math.pow(Math.abs(Math.cos(stepPhase)), 10) : 0;
    const bob = attacking ? -2 : player.moving ? -hop * 5.5 : Math.sin(game.sceneTime*3)*1.2;
    const shadowScale = 1 - hop * .2;
    ctx.save();ctx.scale(shadowScale,shadowScale);ctx.fillStyle="rgba(35,57,34,.28)";ctx.beginPath();ctx.ellipse(0,31,34,13,0,0,Math.PI*2);ctx.fill();ctx.restore();
    if (loadHeroRig().complete && loadHeroRig().naturalWidth) {
      if (charging) { ctx.strokeStyle="#ffb347";ctx.shadowColor="#ff7a21";ctx.shadowBlur=18;ctx.lineWidth=5;ctx.globalAlpha=.5+.45*player.hammerCharge;ctx.beginPath();ctx.arc(0,-12,43+player.hammerCharge*15,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.shadowBlur=0; }
      if (blink) ctx.globalAlpha=.35;
      if (player.counterReadyTime > 0) {
        const counterPulse = 1 + Math.sin(game.sceneTime * 16) * .08;
        drawCombatEffect(ctx, "leafSlash", 0, -18, 112 * counterPulse, 112 * counterPulse, game.sceneTime * 3.5, .5);
      }
      drawClarkRig(ctx);
      if(player.shieldTime>0){const shieldSize=skillRank()*3;ctx.strokeStyle="#9ce98c";ctx.shadowColor="#d8ffb2";ctx.shadowBlur=24+shieldSize;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-19,52+shieldSize,58+shieldSize,0,0,Math.PI*2);ctx.stroke();}
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      ctx.fillStyle="rgba(251,248,220,.92)";ctx.strokeStyle="rgba(70,91,55,.35)";ctx.lineWidth=2;roundedRect(ctx,-30,-105,60,18,9);ctx.fill();ctx.stroke();
      ctx.fillStyle="#364b31";ctx.font="800 10px Trebuchet MS";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("CLARK",0,-96);
      ctx.restore();
      return;
    }
    ctx.translate(0,bob);
    if (charging) { ctx.strokeStyle="#ffb347";ctx.shadowColor="#ff7a21";ctx.shadowBlur=18;ctx.lineWidth=5;ctx.globalAlpha=.5+.45*player.hammerCharge;ctx.beginPath();ctx.arc(0,0,43+player.hammerCharge*15,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.shadowBlur=0; }
    if (blink) ctx.globalAlpha=.35;
    const heroAnimation = loadHeroAnimation();
    if (heroAnimation.complete && heroAnimation.naturalWidth && heroAnimation.naturalHeight) {
      const state = HERO_ANIMATION_ROWS[player.animState] === undefined ? "idle" : player.animState;
      const row = HERO_ANIMATION_ROWS[state];
      const progress = player.attackTime > 0 ? clamp(1 - player.attackTime / player.attackDuration, 0, 1) : 0;
      const frame = state === "idle" ? Math.floor(player.animationTime * 5) % 6
        : state === "move" ? Math.floor(player.walkCycle * 6) % 6
          : state === "dash" ? Math.min(5, Math.floor(player.animStateTime * 22))
            : state === "hurt" ? Math.min(5, Math.floor(player.animStateTime * 17))
              : Math.min(5, Math.floor(progress * 6));
      const sourceWidth = heroAnimation.naturalWidth / 6;
      const sourceHeight = heroAnimation.naturalHeight / 6;
      const facingX = attacking ? player.attackDirection.x : player.facing.x;
      const directionFlip = facingX < -.08 ? -1 : 1;
      if (player.counterReadyTime > 0) {
        const counterPulse = 1 + Math.sin(game.sceneTime * 16) * .08;
        drawCombatEffect(ctx, "leafSlash", 0, -18, 112 * counterPulse, 112 * counterPulse, game.sceneTime * 3.5, .5);
      }
      ctx.save();
      ctx.scale(directionFlip, 1);
      ctx.drawImage(heroAnimation, frame * sourceWidth, row * sourceHeight, sourceWidth, sourceHeight, -64, -91, 128, 128);
      const wieldingHammer = player.weapon === "hammer";
      const weaponArt = loadProp(wieldingHammer ? "cometHammer" : "leafblade");
      if (weaponArt.complete && weaponArt.naturalWidth) {
        const handX = 34, handY = -24;
        let weaponAngle = wieldingHammer ? -.48 : .26;
        if (state === "leafblade") weaponAngle = -1.15 + progress * 2.65;
        else if (state === "hammer") weaponAngle = -1.5 + progress * 2.95;
        else if (state === "dash") weaponAngle = -.72;
        else weaponAngle += Math.sin(game.sceneTime * 3.5) * .05;
        ctx.save(); ctx.translate(handX, handY); ctx.rotate(weaponAngle);
        ctx.shadowColor = wieldingHammer ? "#ff852a" : "#79eb8c"; ctx.shadowBlur = attacking ? 14 : 5;
        if (wieldingHammer) ctx.drawImage(weaponArt, -24, -60, 48, 78);
        else ctx.drawImage(weaponArt, -16, -55, 32, 64);
        ctx.restore();
      }
      ctx.restore();
      if(player.shieldTime>0){const shieldSize=skillRank()*3;ctx.strokeStyle="#9ce98c";ctx.shadowColor="#d8ffb2";ctx.shadowBlur=24+shieldSize;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-19,52+shieldSize,58+shieldSize,0,0,Math.PI*2);ctx.stroke();}
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      ctx.fillStyle="rgba(251,248,220,.92)";ctx.strokeStyle="rgba(70,91,55,.35)";ctx.lineWidth=2;roundedRect(ctx,-30,-105,60,18,9);ctx.fill();ctx.stroke();
      ctx.fillStyle="#364b31";ctx.font="800 10px Trebuchet MS";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("CLARK",0,-96);
      ctx.restore();
      return;
    }
    const clarkArt = loadProp("clark");
    if (clarkArt.complete && clarkArt.naturalWidth) {
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
      const weaponArt = loadProp(wieldingHammer ? "cometHammer" : "leafblade");
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
      ctx.drawImage(clarkArt, spriteX, spriteY, spriteWidth, spriteHeight);
      ctx.restore();
      if(player.shieldTime>0){const shieldSize=skillRank()*3;ctx.strokeStyle="#9ce98c";ctx.shadowColor="#d8ffb2";ctx.shadowBlur=24+shieldSize;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,-19,52+shieldSize,58+shieldSize,0,0,Math.PI*2);ctx.stroke();}
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
    if(player.shieldTime>0){ctx.strokeStyle="#8ce568";ctx.shadowColor="#8ce568";ctx.shadowBlur=20;ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,42+skillRank()*3,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
    ctx.restore();ctx.globalAlpha=1;
  }

  function drawBradley(ctx) {
    if(!hasUnlocked(2))return;
    ctx.save();ctx.translate(bradley.x,bradley.y);ctx.strokeStyle="#11131a";ctx.lineWidth=5;ctx.lineCap="round";
    if (game.phase === "cooperation" && bradley.command === "station") { ctx.strokeStyle="#ff9f1c";ctx.shadowColor="#ff9f1c";ctx.shadowBlur=16;ctx.lineWidth=4;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(0,0,31+Math.sin(game.sceneTime*4)*3,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0; }
    const companionAtlas = loadCompanionAtlas();
    const bradleyBob = Math.sin(game.sceneTime * 4.2) * 1.5;
    if (drawAtlasCell(ctx, companionAtlas, COMPANION_ATLAS_CELLS.bradley, 3, 1, -44, -61 + bradleyBob, 88, 88)) { ctx.restore(); return; }
    ctx.strokeStyle="#171721";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-7,18);ctx.lineTo(-10,36);ctx.moveTo(7,18);ctx.lineTo(11,36);ctx.stroke();
    ctx.fillStyle="#8e6334";roundedRect(ctx,-15,-2,30,29,8);ctx.fill();ctx.stroke();
    ctx.fillStyle="#f29a19";ctx.beginPath();ctx.arc(0,-14,22,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle="#2877c6";ctx.beginPath();ctx.arc(0,-20,23,Math.PI,Math.PI*2);ctx.lineTo(26,-17);ctx.lineTo(0,-15);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="#111";ctx.beginPath();ctx.ellipse(-6,-14,3,6,0,0,Math.PI*2);ctx.ellipse(7,-14,3,6,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function drawBird(ctx) {
    if (bird.found && !bird.found.collected) {
      ctx.save();
      ctx.globalAlpha = .2 + Math.sin(game.sceneTime * 3) * .07;
      ctx.strokeStyle = "#ffd34f";
      ctx.setLineDash([4, 9]);
      ctx.lineDashOffset = -game.sceneTime * 18;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(bird.found.x, bird.found.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    if(!hasUnlocked(5))return;
    ctx.save();ctx.translate(bird.x,bird.y);ctx.fillStyle="#d6b56d";ctx.strokeStyle="#2d241c";ctx.lineWidth=3;
    if (drawAtlasCell(ctx, loadCompanionAtlas(), COMPANION_ATLAS_CELLS.bird, 3, 1, -28, -29 + Math.sin(game.sceneTime * 5) * 2, 56, 52)) { ctx.restore(); return; }
    ctx.beginPath();ctx.ellipse(0,0,16,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(13,-2);ctx.lineTo(27,2);ctx.lineTo(13,6);ctx.closePath();ctx.fillStyle="#ffcb45";ctx.fill();ctx.stroke();
    ctx.fillStyle="#111";ctx.beginPath();ctx.arc(6,-4,2.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#735a2e";ctx.beginPath();ctx.moveTo(-5,-10);ctx.lineTo(-9,-19);ctx.moveTo(1,-11);ctx.lineTo(0,-20);ctx.stroke();ctx.restore();
  }

  function drawGuardian(ctx) {
    if(!hasUnlocked(4))return;
    ctx.save();ctx.translate(guardian.x,guardian.y);ctx.strokeStyle="#ffd34f";ctx.lineWidth=3;ctx.fillStyle="rgba(255,211,79,.32)";
    if (drawAtlasCell(ctx, loadCompanionAtlas(), COMPANION_ATLAS_CELLS.guardian, 3, 1, -38, -48 + Math.sin(game.sceneTime * 3.4) * 2, 76, 78)) { ctx.restore(); return; }
    for(const side of[-1,1]){ctx.beginPath();ctx.ellipse(side*20,4,18,8,side*.8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(side*17,-8,15,6,side*.8,0,Math.PI*2);ctx.fill();ctx.stroke();}
    ctx.fillStyle="#111429";ctx.strokeStyle="#ffd34f";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-4,17,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle="#69e5ff";ctx.lineWidth=3;ctx.beginPath();for(let a=0;a<Math.PI*4;a+=.18){const r=a*1.05,x=Math.cos(a)*r,y=-4+Math.sin(a)*r;if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.restore();
  }

  function drawEnemy(ctx, enemy) {
    if (!enemy.active) return;
    const monsterArt = art.monsters[enemy.type] || loadMonsterArt(enemy.type);
    const atlasCell = MONSTER_ATLAS_CELLS[enemy.type];
    const monsterAtlas = atlasCell ? loadMonsterAtlas() : null;
    const finalAtlasCell = FINAL_MONSTER_ATLAS_CELLS[enemy.type];
    const finalMonsterAtlas = finalAtlasCell ? loadFinalMonsterAtlas() : null;
    const hover = ["drone", "wisp", "bookwisp", "quillseer"].includes(enemy.type)
      ? Math.sin(enemy.phase) * 7 - 9
      : Math.abs(Math.sin(enemy.phase)) * -3;
    const hitBlink = enemy.invulnerable > 0 && Math.floor(game.sceneTime * 22) % 2 === 0;
    ctx.save();ctx.translate(enemy.x,enemy.y);
    if (game.aimTarget === enemy && game.aimTargetTime > 0) {
      ctx.save();ctx.rotate(game.sceneTime*2.2);ctx.globalAlpha=clamp(game.aimTargetTime/.3,0,1);ctx.lineWidth=3;
      for(let quadrant=0;quadrant<4;quadrant+=1){
        haloArc(ctx,0,2,enemy.radius+13,"#ffd34f",3,quadrant*Math.PI/2+.16,quadrant*Math.PI/2+.64);
        ctx.strokeStyle="#fff3a5";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,2,enemy.radius+13,quadrant*Math.PI/2+.16,quadrant*Math.PI/2+.64);ctx.stroke();
      }
      ctx.restore();
    }
    if(enemy.windupTime>0){
      const warning=1-clamp(enemy.windupTime/(["thornling","sandbeetle"].includes(enemy.type)?.42:["vinebrute","gearbug","runeknight"].includes(enemy.type)?.52:enemy.type==="inkhound"?.24:.28),0,1);ctx.save();ctx.globalAlpha=.38+warning*.42;const warnColor=["thornling","sandbeetle","vinebrute","gearbug","runeknight"].includes(enemy.type)?"#ffcf55":"#d6a4ff";ctx.strokeStyle=warnColor;ctx.lineWidth=3;
      if(["thornling","sandbeetle","vinebrute","gearbug","runeknight"].includes(enemy.type)){ctx.rotate(Math.atan2(enemy.attackDirection.y,enemy.attackDirection.x));ctx.setLineDash([10,7]);ctx.lineWidth=9;ctx.globalAlpha*=.32;ctx.beginPath();ctx.moveTo(enemy.radius,0);ctx.lineTo(150,0);ctx.stroke();ctx.globalAlpha/=.32;ctx.lineWidth=3;ctx.strokeStyle=warnColor;ctx.beginPath();ctx.moveTo(enemy.radius,0);ctx.lineTo(150,0);ctx.stroke();ctx.setLineDash([]);}
      else{const ringRadius=enemy.radius+10+warning*13;haloArc(ctx,0,5,ringRadius,warnColor,3);ctx.strokeStyle=warnColor;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,5,ringRadius,0,Math.PI*2);ctx.stroke();}
      ctx.restore();
    }
    if ((enemy.marked || 0) > 0 || (enemy.exposed || 0) > 0 || (enemy.stunTime || 0) > 0) {
      ctx.save();
      ctx.globalAlpha = enemy.exposed > 0 || enemy.stunTime > 0 ? .95 : .72;
      const markColor = enemy.exposed > 0 || enemy.stunTime > 0 ? "#ffd34f" : "#d6a4ff";
      const markRadius = enemy.radius + 11 + Math.sin(game.sceneTime * 8) * 2;
      haloArc(ctx, 0, 2, markRadius, markColor, 3, 0, Math.PI * 2, .24);
      ctx.strokeStyle = markColor; ctx.lineWidth = 3;
      ctx.setLineDash(enemy.stunTime > 0 ? [3, 5] : [8, 6]);
      ctx.beginPath(); ctx.arc(0, 2, markRadius, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
    }
    if (enemy.elite) {
      const eliteColor = enemy.eliteTrait?.color || "#ffd34f";
      ctx.save(); ctx.globalAlpha = .72; const eliteRadius = enemy.radius + 18 + Math.sin(game.sceneTime * 4 + enemy.phase) * 2;
      haloArc(ctx, 0, 2, eliteRadius, eliteColor, 2, 0, Math.PI * 2, .22);
      ctx.strokeStyle = eliteColor; ctx.lineWidth = 2; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.arc(0, 2, eliteRadius, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = eliteColor; ctx.font = "900 10px Trebuchet MS"; ctx.textAlign = "center"; ctx.fillText(enemy.eliteTrait?.name || "ELITE", 0, -enemy.height * .72 - 17); ctx.restore();
    }
    // Painted and vector monsters share one footprint so the two styles read as
    // one set when they appear side by side in the same chapter.
    const spriteHalf = enemy.width / 2;
    ctx.fillStyle="rgba(30,38,33,.26)";ctx.beginPath();ctx.ellipse(0,enemy.radius*.78,spriteHalf*.74,spriteHalf*.27,0,0,Math.PI*2);ctx.fill();
    ctx.translate(0,hover);
    if (enemy.phaseTime > 0) ctx.globalAlpha = .3 + Math.sin(game.sceneTime * 18) * .12;
    else if (hitBlink) ctx.globalAlpha=.42;
    const flip = enemy.facingX < 0 ? -1 : 1;
    const squash = enemy.type === "slime" ? 1 + Math.sin(enemy.phase) * .045 : 1;
    haloFill(ctx,0,-enemy.height*.12,spriteHalf*(enemy.type==="wisp"?1.12:.94),enemy.color,enemy.type==="wisp"?.28:.18);
    ctx.save();ctx.scale(flip/squash,squash);
    if (monsterArt?.complete && monsterArt.naturalWidth) {
      ctx.drawImage(monsterArt,-spriteHalf,-enemy.height*.68,enemy.width,enemy.height);
    } else if (monsterAtlas?.complete && monsterAtlas.naturalWidth && atlasCell) {
      const cellWidth = monsterAtlas.naturalWidth / 3, cellHeight = monsterAtlas.naturalHeight / 3;
      ctx.drawImage(monsterAtlas, atlasCell[0] * cellWidth, atlasCell[1] * cellHeight, cellWidth, cellHeight, -spriteHalf, -enemy.height * .74, enemy.width, enemy.height);
    } else if (finalMonsterAtlas?.complete && finalMonsterAtlas.naturalWidth && finalAtlasCell) {
      const cellWidth = finalMonsterAtlas.naturalWidth / 3, cellHeight = finalMonsterAtlas.naturalHeight;
      ctx.drawImage(finalMonsterAtlas, finalAtlasCell[0] * cellWidth, 0, cellWidth, cellHeight, -spriteHalf, -enemy.height * .74, enemy.width, enemy.height);
    } else drawProceduralMonster(ctx, enemy);
    ctx.restore();ctx.globalAlpha=1;
    if (enemy.hp < enemy.maxHp) {
      ctx.fillStyle="rgba(21,25,24,.72)";roundedRect(ctx,-25,-enemy.height*.68-12,50,7,4);ctx.fill();
      ctx.fillStyle=enemy.color;roundedRect(ctx,-24,-enemy.height*.68-11,48*clamp(enemy.hp/enemy.maxHp,0,1),5,3);ctx.fill();
    }
    drawWeaknessBadge(ctx, enemy);
    ctx.restore();
  }

  // The weakness table was previously buried in the codex menu. This puts it
  // over the monster's head: dim by default, lit and bouncing when the counter
  // it asks for is ready in the player's hands right now.
  function drawWeaknessBadge(ctx, enemy) {
    const info = WEAKNESS_INFO[enemy.weakness];
    if (!info) return;
    const ready = weaknessReady(enemy.weakness);
    const broken = enemy.exposed > 0 || enemy.stunTime > 0;
    const y = -enemy.height * .68 - (enemy.hp < enemy.maxHp ? 26 : 18)
            + (ready ? Math.sin(game.sceneTime * 6 + enemy.phase) * 2.5 : 0);
    ctx.save();
    ctx.translate(0, y);
    ctx.globalAlpha = broken ? .35 : ready ? 1 : .5;
    if (ready && !broken) {
      haloFill(ctx, 0, 0, 15, info.color, .4);
      ctx.strokeStyle = info.color; ctx.lineWidth = 1.5; ctx.globalAlpha = .75;
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = broken ? "#7d8a99" : info.color;
    ctx.font = `900 ${ready ? 17 : 14}px "Trebuchet MS", sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(broken ? "✗" : info.icon, 0, 0);
    ctx.restore();
  }

  function drawProceduralMonster(ctx, enemy) {
    // Derived from the sprite footprint, not the collision radius, so vector
    // monsters come out the same size on screen as the painted ones.
    const r = enemy.width * .4, t = game.sceneTime;
    ctx.strokeStyle = "#273229"; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (enemy.type === "mossling") {
      ctx.fillStyle = enemy.color; ctx.beginPath(); ctx.moveTo(-r,-3); ctx.quadraticCurveTo(-r-4,-r*.75,0,-r); ctx.quadraticCurveTo(r+5,-r*.7,r,3); ctx.quadraticCurveTo(r*.7,r,0,r*.9); ctx.quadraticCurveTo(-r*.8,r,-r,-3); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#9be07b"; ctx.beginPath(); ctx.moveTo(-8,-r*.8);ctx.quadraticCurveTo(-18,-r-15,-3,-r*.55);ctx.quadraticCurveTo(6,-r-18,9,-r*.62);ctx.quadraticCurveTo(20,-r-10,11,-r*.3);ctx.closePath();ctx.fill();ctx.stroke();
    } else if (enemy.type === "sandbeetle") {
      ctx.fillStyle=enemy.color;ctx.beginPath();ctx.ellipse(0,2,r*1.05,r*.78,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle="#7e4b2e";ctx.lineWidth=3;for(let x=-r*.55;x<=r*.55;x+=r*.55){ctx.beginPath();ctx.moveTo(x,-r*.45);ctx.lineTo(x*.8,r*.55);ctx.stroke();}ctx.strokeStyle="#273229";ctx.beginPath();ctx.moveTo(-r*.7,-6);ctx.lineTo(-r-10,-16);ctx.moveTo(r*.7,-6);ctx.lineTo(r+10,-16);ctx.stroke();
    } else if (enemy.type === "prismimp") {
      ctx.fillStyle=enemy.color;ctx.beginPath();ctx.moveTo(0,-r-8);ctx.lineTo(r*.92,-r*.15);ctx.lineTo(r*.62,r);ctx.lineTo(-r*.62,r);ctx.lineTo(-r*.92,-r*.15);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#ffd34f";ctx.beginPath();ctx.moveTo(-r*.6,-r*.55);ctx.lineTo(-r-8,-r-15);ctx.lineTo(-r*.3,-r*.8);ctx.moveTo(r*.6,-r*.55);ctx.lineTo(r+8,-r-15);ctx.lineTo(r*.3,-r*.8);ctx.fill();ctx.stroke();
    } else if (enemy.type === "shadowmoth") {
      ctx.fillStyle="#46325f";ctx.beginPath();ctx.moveTo(-4,0);ctx.quadraticCurveTo(-r-13,-r-16,-r-7,5);ctx.quadraticCurveTo(-r-9,r+12,-3,r*.5);ctx.moveTo(4,0);ctx.quadraticCurveTo(r+13,-r-16,r+7,5);ctx.quadraticCurveTo(r+9,r+12,3,r*.5);ctx.fill();ctx.stroke();ctx.fillStyle=enemy.color;ctx.beginPath();ctx.ellipse(0,3,8,r*.8,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    } else if (enemy.type === "vinebrute") {
      ctx.fillStyle=enemy.color;ctx.beginPath();ctx.moveTo(-r*.7,r);ctx.quadraticCurveTo(-r*.9,0,-r*.5,-r*.75);ctx.quadraticCurveTo(0,-r-4,r*.5,-r*.75);ctx.quadraticCurveTo(r*.9,0,r*.7,r);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#3f7e46";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-r*.45,0);ctx.quadraticCurveTo(-r-18,-8,-r-7,-r*.7);ctx.moveTo(r*.45,0);ctx.quadraticCurveTo(r+18,-8,r+7,-r*.7);ctx.stroke();
    } else if (enemy.type === "stormbat") {
      ctx.fillStyle=enemy.color;ctx.beginPath();ctx.moveTo(0,-r*.7);ctx.quadraticCurveTo(-r-17,-r-12,-r-20,r*.65);ctx.quadraticCurveTo(-r*.45,r*.4,0,r*.95);ctx.quadraticCurveTo(r*.45,r*.4,r+20,r*.65);ctx.quadraticCurveTo(r+17,-r-12,0,-r*.7);ctx.fill();ctx.stroke();ctx.fillStyle="#dcefff";ctx.beginPath();ctx.arc(-7,-3,3,0,Math.PI*2);ctx.arc(7,-3,3,0,Math.PI*2);ctx.fill();
    } else if (enemy.type === "bookwisp") {
      ctx.fillStyle="#f6e6bb";ctx.beginPath();ctx.moveTo(-r*.9,-r*.65);ctx.quadraticCurveTo(-r*.2,-r-2,0,-r*.35);ctx.quadraticCurveTo(r*.2,-r-2,r*.9,-r*.65);ctx.lineTo(r*.75,r*.8);ctx.quadraticCurveTo(r*.2,r*.45,0,r*.75);ctx.quadraticCurveTo(-r*.2,r*.45,-r*.75,r*.8);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#b97838";ctx.beginPath();ctx.moveTo(0,-r*.35);ctx.lineTo(0,r*.65);ctx.stroke();ctx.fillStyle="#e9b85e";ctx.beginPath();ctx.arc(0,.1,5+Math.sin(t*5)*1.5,0,Math.PI*2);ctx.fill();
    } else if (enemy.type === "gearbug") {
      ctx.fillStyle=enemy.color;ctx.beginPath();ctx.arc(0,0,r*.72,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle="#6e5236";for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.65,Math.sin(a)*r*.65);ctx.lineTo(Math.cos(a)*r*1.25,Math.sin(a)*r*1.25);ctx.stroke();}ctx.strokeStyle="#273229";
    } else {
      ctx.fillStyle=enemy.color;ctx.beginPath();ctx.moveTo(0,-r);ctx.quadraticCurveTo(r*.9,-r*.2,r*.35,r*.55);ctx.quadraticCurveTo(r*.8,r,0,r+8);ctx.quadraticCurveTo(-r*.8,r,-r*.35,r*.55);ctx.quadraticCurveTo(-r*.9,-r*.2,0,-r);ctx.fill();ctx.stroke();ctx.fillStyle="#f4d8ff";ctx.beginPath();ctx.arc(-6,-2,3,0,Math.PI*2);ctx.arc(6,-2,3,0,Math.PI*2);ctx.fill();
    }
  }

  function drawBossTelegraph(ctx, boss) {
    if (boss.peaceful || boss.defeated || !boss.telegraphTarget || boss.attackTimer > boss.telegraphDuration) return;
    const warning = 1 - clamp(boss.attackTimer / boss.telegraphDuration, 0, 1);
    const targetX = boss.telegraphTarget.x - boss.x;
    const targetY = boss.telegraphTarget.y - boss.y;
    const effect = { pi: "pi", warden: "crystal", engine: "gear", shadow: "crescent", raven: "storm", final: "rune" }[boss.type] || "star";
    const rotation = Math.atan2(targetY, targetX);
    ctx.save();
    ctx.globalAlpha = .26 + warning * .68;
    if (boss.type === "engine") {
      drawCombatEffect(ctx, effect, 0, 0, 150 + warning * 60, 150 + warning * 60, game.sceneTime * 2.4, .8);
    } else if (boss.type === "raven" || boss.type === "shadow") {
      for (let index = 1; index <= 4; index += 1) {
        const amount = index / 4;
        drawCombatEffect(ctx, effect, targetX * amount, targetY * amount, 48 + warning * 20, 48 + warning * 20, rotation, .28 + amount * .16);
      }
      drawCombatEffect(ctx, effect, targetX, targetY, 118 + warning * 36, 118 + warning * 36, rotation, .7);
    } else {
      drawCombatEffect(ctx, effect, targetX, targetY, 126 + warning * 54, 126 + warning * 54, game.sceneTime * (boss.type === "final" ? 2.8 : 1.2), .76);
    }
    ctx.restore();
  }

  function drawBoss(ctx, boss) {
    if(!boss?.active)return;
    ctx.save();ctx.translate(boss.x,boss.y);
    drawBossTelegraph(ctx, boss);
    if (!boss.peaceful && boss.meleeTime > 0) {
      const meleeAngle = Math.atan2(boss.attackDirection.y, boss.attackDirection.x);
      drawCombatEffect(ctx, boss.meleeKind === "dive" ? "crescent" : "hammerShockwave", boss.attackDirection.x * 38, boss.attackDirection.y * 38, boss.radius * 2.5, boss.radius * 2.5, meleeAngle, .82);
    }
    const pulse=1+Math.sin(game.sceneTime*4)*.035;ctx.scale(pulse,pulse);ctx.globalAlpha=boss.invulnerable>0?.55:1;ctx.shadowColor=game.chapter.palette.glow;ctx.shadowBlur=18;
    const bossSize = BOSS_SPRITE_SIZES[boss.type] || [176, 176];
    const bossAnimation = loadBossAnimation(boss.type);
    if (bossAnimation.complete && bossAnimation.naturalWidth && bossAnimation.naturalHeight) {
      const state = BOSS_ANIMATION_ROWS[boss.animState] === undefined ? "idle" : boss.animState;
      const row = BOSS_ANIMATION_ROWS[state];
      const stateTime = boss.animStateTime || 0;
      const frameRate = state === "idle" ? 5 : state === "move" ? 9 : state === "hurt" ? 22 : state === "attack" ? 11 : 5.6;
      const frame = state === "idle" || state === "move" ? Math.floor((state === "idle" ? boss.animationTime : stateTime) * frameRate) % 6 : Math.min(5, Math.floor(stateTime * frameRate));
      const sourceWidth = bossAnimation.naturalWidth / 6;
      const sourceHeight = bossAnimation.naturalHeight / 5;
      const drawWidth = state === "attack" ? bossSize[0] * 1.08 : bossSize[0];
      const drawHeight = state === "attack" ? bossSize[1] * 1.08 : bossSize[1];
      ctx.drawImage(bossAnimation, frame * sourceWidth, row * sourceHeight, sourceWidth, sourceHeight, -drawWidth / 2, -drawHeight * .62, drawWidth, drawHeight);
      ctx.shadowBlur = 0; ctx.restore(); return;
    }
    const bossAtlas = loadBossAtlas();
    const bossCell = BOSS_ATLAS_CELLS[boss.type];
    if (drawAtlasCell(ctx, bossAtlas, bossCell, 4, 2, -bossSize[0] / 2, -bossSize[1] * .58, bossSize[0], bossSize[1])) {
      ctx.shadowBlur = 0; ctx.restore(); return;
    }
    const piArt = boss.type==="pi" ? loadProp("piMonster") : PENDING_ART;
    if(piArt.complete&&piArt.naturalWidth){
      ctx.fillStyle="rgba(38,29,51,.3)";ctx.beginPath();ctx.ellipse(0,50,75,24,0,0,Math.PI*2);ctx.fill();
      ctx.drawImage(piArt,-92,-94,184,168);ctx.shadowBlur=0;ctx.restore();return;
    }
    if (boss.type === "final") {
      ctx.fillStyle="rgba(38,29,22,.3)";ctx.beginPath();ctx.ellipse(0,58,78,24,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#8b5a3c";ctx.strokeStyle="#241a18";ctx.lineWidth=7;roundedRect(ctx,-70,-48,140,108,18);ctx.fill();ctx.stroke();
      ctx.fillStyle="#f6e6bb";ctx.strokeStyle="#5d3a2b";ctx.lineWidth=4;roundedRect(ctx,-54,-38,108,86,11);ctx.fill();ctx.stroke();
      ctx.fillStyle="#5c3828";ctx.fillRect(-5,-38,10,86);
      ctx.strokeStyle="#d6a04e";ctx.shadowColor="#ffd34f";ctx.shadowBlur=14;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,4,30,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#6a4c2d";ctx.font="900 38px Georgia";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("✦",0,6);
      ctx.fillStyle="#ffd34f";ctx.strokeStyle="#4b2e24";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-34,-55);ctx.lineTo(-20,-79);ctx.lineTo(-2,-60);ctx.lineTo(17,-82);ctx.lineTo(34,-55);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.shadowBlur=0;ctx.restore();return;
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

  function drawHostileProjectile(ctx, projectile) {
    const angle = Math.atan2(projectile.vy, projectile.vx);
    const radius = projectile.radius;
    const paintedKey = COMBAT_EFFECT_CELLS[projectile.shape] ? projectile.shape : "star";
    const paintedRotation = projectile.shape === "storm" || projectile.shape === "gear" || projectile.shape === "rune" || projectile.shape === "shadow"
      ? (projectile.age || 0) * 3
      : angle + Math.PI;
    if (drawCombatEffect(ctx, paintedKey, projectile.x, projectile.y, radius * 5.6, radius * 5.6, paintedRotation)) return;
    ctx.save();ctx.translate(projectile.x,projectile.y);
    haloFill(ctx,0,0,radius*1.9,projectile.color,.26);
    ctx.rotate(angle);
    ctx.strokeStyle=projectile.color;ctx.lineCap="round";ctx.lineWidth=Math.max(3,radius*.55);
    ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(-radius*.4,0);ctx.lineTo(-radius*2.5,0);ctx.stroke();ctx.globalAlpha=1;
    ctx.fillStyle=projectile.color;ctx.strokeStyle="rgba(255,255,255,.8)";ctx.lineWidth=2;
    if(projectile.shape==="star"){
      ctx.rotate((projectile.age||0)*5);ctx.beginPath();for(let i=0;i<8;i+=1){const a=i*Math.PI/4,r=i%2===0?radius:radius*.42;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fill();ctx.stroke();
    }else if(projectile.shape==="storm"){
      ctx.rotate((projectile.age||0)*4);ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle="#eef4ff";ctx.lineWidth=2;ctx.beginPath();for(let a=0;a<Math.PI*3;a+=.2){const r=a*radius/(Math.PI*3),x=Math.cos(a)*r,y=Math.sin(a)*r;if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    }else if(projectile.shape==="pi"){
      ctx.rotate(-angle);ctx.font=`900 ${radius*2.1}px Georgia`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("π",0,1);ctx.strokeText("π",0,1);
    }else if(projectile.shape==="crystal"){
      ctx.beginPath();ctx.moveTo(radius*1.2,0);ctx.lineTo(0,-radius*.72);ctx.lineTo(-radius*.8,0);ctx.lineTo(0,radius*.72);ctx.closePath();ctx.fill();ctx.stroke();
    }else if(projectile.shape==="gear"){
      ctx.rotate((projectile.age||0)*5);ctx.beginPath();for(let i=0;i<16;i+=1){const a=i*Math.PI/8,r=i%2===0?radius*1.18:radius*.72;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#132748";ctx.beginPath();ctx.arc(0,0,radius*.32,0,Math.PI*2);ctx.fill();
    }else if(projectile.shape==="crescent"){
      ctx.strokeStyle=projectile.color;ctx.lineWidth=radius*.62;ctx.beginPath();ctx.arc(0,0,radius*.9,-1.15,1.15);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,.8)";ctx.lineWidth=2;ctx.stroke();
    }else if(projectile.shape==="feather"){
      ctx.beginPath();ctx.moveTo(radius*1.5,0);ctx.quadraticCurveTo(0,-radius*.75,-radius*.9,0);ctx.quadraticCurveTo(0,radius*.75,radius*1.5,0);ctx.fill();ctx.stroke();ctx.strokeStyle="#dce6ff";ctx.beginPath();ctx.moveTo(-radius*.65,0);ctx.lineTo(radius*1.1,0);ctx.stroke();
    }else if(projectile.shape==="rune"){
      ctx.rotate((projectile.age||0)*2.6);ctx.beginPath();for(let i=0;i<6;i+=1){const a=-Math.PI/2+i*Math.PI/3;const r=radius*(i%2?0.62:1.1);const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#fff6c8";ctx.font=`900 ${radius*1.05}px Georgia`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("✦",0,1);
    }else if(projectile.shape==="prism"){
      ctx.rotate((projectile.age||0)*3);ctx.fillStyle="#f3a6ff";ctx.beginPath();ctx.moveTo(radius*1.35,0);ctx.lineTo(0,-radius);ctx.lineTo(-radius*.85,0);ctx.lineTo(0,radius);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#fff5ff";ctx.beginPath();ctx.moveTo(0,-radius*.65);ctx.lineTo(radius*.65,0);ctx.lineTo(0,radius*.15);ctx.closePath();ctx.fill();
    }else if(projectile.shape==="shadow"){
      ctx.fillStyle="#3f235d";ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle="#d6a4ff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(-2,0,radius*.72,-1.15,1.15);ctx.stroke();
    }else{
      ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();ctx.stroke();
    }
    ctx.restore();
  }

  function drawProjectiles(ctx) {
    game.projectiles.forEach(projectile=>{
      const angle = Math.atan2(projectile.vy || 0, projectile.vx || 1) + Math.PI;
      if (!drawCombatEffect(ctx,"star",projectile.x,projectile.y,projectile.radius*5.4,projectile.radius*5.4,angle)) {
        ctx.fillStyle=projectile.color;ctx.beginPath();ctx.arc(projectile.x,projectile.y,projectile.radius,0,Math.PI*2);ctx.fill();
      }
    });
    game.enemyProjectiles.forEach(projectile=>drawHostileProjectile(ctx,projectile));
    game.attacks.forEach(attack=>{
      const progress=clamp(1-attack.life/(attack.maxLife||.25),0,1);
      const fade=Math.sin(progress*Math.PI);
      if(attack.type==="slash") drawCombatEffect(ctx,"leafSlash",attack.x,attack.y,attack.radius*2.45,attack.radius*1.85,attack.angle,fade*.92);
      else if(attack.type==="spin") drawCombatEffect(ctx,"leafSlash",attack.x,attack.y,attack.radius*2.6,attack.radius*2.05,attack.angle+progress*Math.PI*1.5,fade*.9);
      else if(attack.type==="smash") {
        const radius=attack.radius*(.35+progress*.65);
        drawCombatEffect(ctx,"hammerShockwave",attack.x,attack.y+6,radius*2.2,radius*1.55,0,(1-progress)*.92);
      } else if(attack.type==="perfect") {
        const radius=attack.radius*(.45+progress*.55);
        drawCombatEffect(ctx,"star",attack.x,attack.y,radius*1.8,radius*1.8,progress*Math.PI,(1-progress)*.9);
      } else drawCombatEffect(ctx,"star",attack.x,attack.y,attack.radius*1.8,attack.radius*1.8,0,clamp(attack.life/.25,0,.6));
    });
    ctx.globalAlpha=1;ctx.shadowBlur=0;
  }

  function currentObjectiveTarget() {
    if(game.phase==="portal")return game.chapter.portal;
    if(game.phase==="waves")return game.enemies.find(enemy=>enemy.active)||game.chapter.portal;
    if(game.phase==="boss")return game.boss;
    if(game.phase==="cooperation"&&game.coopPuzzle)return game.coopPuzzle.plateA;
    const puzzle=game.chapter.puzzle;
    if(puzzle.type==="push")return puzzle.goal;
    if(puzzle.type==="break")return puzzle.targets.find(target=>!game.activeTargets.has(target.id));
    const nextRune=puzzle.targets.find(target=>!game.activeTargets.has(target.id))||puzzle.targets[0];
    return runeGuard(nextRune.id)||nextRune;
  }

  function drawObjectiveMarker(ctx) {
    const target=currentObjectiveTarget();if(!target)return;
    const y=target.y-(target.radius||30)-38+Math.sin(game.sceneTime*5)*5;
    ctx.save();ctx.translate(target.x,y);ctx.rotate(Math.sin(game.sceneTime*2.5)*.08);drawWorldObject(ctx,"memory",-15,-15,30,30);ctx.restore();
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
    const actionScale=viewport.scale*(1+game.zoomPunch);
    context.setTransform(dpr*actionScale,0,0,dpr*actionScale,dpr*(viewport.offsetX+shakeX*viewport.scale-(game.zoomPunch*viewport.width/2)),dpr*(viewport.offsetY+shakeY*viewport.scale-(game.zoomPunch*viewport.height/2)));
    drawBackground(context,game.chapter);
    drawPortal(context,game.chapter.portal,game.portalActive);
    drawHealingShrine(context);
    drawPuzzle(context);
    game.memoryObjects.forEach(memory=>drawMemory(context,memory));
    drawObjectiveMarker(context);
    game.enemies.forEach(enemy=>drawEnemy(context,enemy));
    drawBoss(context,game.boss);
    drawProjectiles(context);
    drawGuardian(context);drawBird(context);drawBradley(context);drawClark(context);
    particles.draw(context);
    if(game.flash>0){context.fillStyle=`rgba(${game.flashColor||"255,70,85"},${game.flash})`;context.fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);}
  }

  function resizeCanvas() {
    const rect=dom.stage.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,usesTouchControls()?1.5:2);
    dom.canvas.width=Math.max(1,Math.floor(rect.width*dpr));dom.canvas.height=Math.max(1,Math.floor(rect.height*dpr));
    context.imageSmoothingEnabled=true;context.imageSmoothingQuality="high";
    const scale=Math.max(rect.width/WORLD_WIDTH,rect.height/WORLD_HEIGHT);
    game.viewport={width:rect.width,height:rect.height,dpr,scale,offsetX:(rect.width-WORLD_WIDTH*scale)/2,offsetY:(rect.height-WORLD_HEIGHT*scale)/2};
  }

  function frame(now) {
    const delta=Math.min(.034,Math.max(0,(now-game.lastFrame)/1000));game.lastFrame=now;
    if(!Number.isFinite(game.hitStop)||game.hitStop<0)game.hitStop=0;
    if(game.hitStop>0){game.hitStop-=delta;}
    else if(game.mode==="playing")update(delta);
    if(dom.gameScreen.classList.contains("is-active"))render();
    if(game.mode==="dialogue"&&input.consume("Enter","Space","KeyE"))advanceDialogue();
    if((game.mode==="playing"||game.mode==="paused")&&input.consume("Escape","KeyP"))togglePause();
    input.endFrame();requestAnimationFrame(frame);
  }

  function togglePause(force) {
    if(!dom.gameScreen.classList.contains("is-active")||["story","dialogue","ending"].includes(game.mode))return;
    const shouldPause=typeof force==="boolean"?force:game.mode!=="paused";
    player.touchAttackHeld=false;
    game.mode=shouldPause?"paused":"playing";dom.pauseOverlay.hidden=!shouldPause;
    if(shouldPause){dom.pauseStats.textContent=`Chapter ${game.chapter.id}: ${game.chapter.title} · Level ${save.level} · ${save.memories.length}/21 memories`;dom.resumeButton.focus();}
  }

  function showMenu() {
    game.mode="menu";dom.pauseOverlay.hidden=true;dom.storyOverlay.hidden=true;dom.dialogueOverlay.hidden=true;dom.endingOverlay.hidden=true;switchScreen("menu");updateMenu();dom.newGameButton.focus();
  }

  function buildChapterGrid() {
    dom.chapterGrid.innerHTML=Data.chapters.map(chapter=>{
      const locked=chapter.id>save.unlockedChapter;
      return `<button class="chapter-choice ${locked?"is-locked":""}" type="button" data-chapter="${chapter.id}" ${locked?"disabled":""}><img loading="lazy" decoding="async" src="../comic/assets/comic-web-640/page-${String(chapter.page).padStart(2,"0")}.webp" alt=""><span>Chapter ${chapter.id}${save.completed.includes(chapter.id)?" · Complete":""}</span><strong>${chapter.title}</strong></button>`;
    }).join("");
    dom.chapterGrid.querySelectorAll("[data-chapter]").forEach(button=>button.addEventListener("click",()=>{dom.chapterOverlay.hidden=true;startChapter(Number(button.dataset.chapter),true);}));
  }

  function showChapters() { buildChapterGrid();dom.chapterOverlay.hidden=false;dom.chapterGrid.querySelector("button:not([disabled])")?.focus(); }

  function showBestiary() {
    dom.bestiaryGrid.innerHTML = Object.entries(MONSTER_TYPES).map(([type, spec]) => {
      const note = MONSTER_NOTES[type] || ["Unknown", "—", "Shard", "Unrecorded"];
      const defeated = Number(save.defeated?.[type] || 0);
      const info = WEAKNESS_INFO[spec.weakness] || { icon: "?", label: note[1], color: "#ffd34f" };
      return `<div class="codex-entry"><strong style="color:${spec.color}">${spec.name}</strong><span>${defeated ? `${defeated} defeated` : "Not yet encountered"}</span><small><b style="color:${info.color}">${info.icon} ${info.label}</b> · ${note[0]} · Drops ${note[2]}<br>${note[3]}</small></div>`;
    }).join("");
    dom.bestiaryOverlay.hidden = false; dom.closeBestiary.focus();
  }

  function renderForge() {
    dom.materialInventory.innerHTML = Object.entries(MATERIAL_LABELS).map(([key, label]) => `<span class="material-chip">${label}<strong>${Number(save.materials?.[key] || 0)}</strong></span>`).join("");
    dom.forgeGrid.innerHTML = WEAPON_ORDER.map(weapon => {
      const level = weaponForgeLevel(weapon);
      const recipe = FORGE_RECIPES[weapon][level];
      const locked = save.unlockedChapter < WEAPONS[weapon].unlockChapter;
      const affordable = recipe && Object.entries(recipe).every(([key, amount]) => Number(save.materials?.[key] || 0) >= amount);
      const cost = recipe ? Object.entries(recipe).map(([key, amount]) => `<span class="${Number(save.materials?.[key] || 0) < amount ? "is-missing" : ""}">${MATERIAL_LABELS[key]} ${Number(save.materials?.[key] || 0)}/${amount}</span>`).join("") : `<span>Maximum forge level reached</span>`;
      const buttonText = locked ? "Unlock in Chapter 3" : level >= 3 ? "Masterwork Complete" : `Forge to +${level + 1}`;
      return `<article class="forge-item"><h3>${WEAPONS[weapon].icon} ${WEAPONS[weapon].name}</h3><div class="forge-level">Forge +${level} / +3</div><p>Each level grants +18% weapon damage and 4% faster attack recovery.</p><div class="forge-cost">${cost}</div><button type="button" data-forge="${weapon}" ${locked || !affordable || level >= 3 ? "disabled" : ""}>${buttonText}</button></article>`;
    }).join("");
    dom.forgeGrid.querySelectorAll("[data-forge]").forEach(button => button.addEventListener("click", () => forgeWeapon(button.dataset.forge)));
  }

  function forgeWeapon(weapon) {
    const level = weaponForgeLevel(weapon);
    const recipe = FORGE_RECIPES[weapon]?.[level];
    if (!recipe || save.unlockedChapter < WEAPONS[weapon].unlockChapter) return;
    if (!Object.entries(recipe).every(([key, amount]) => Number(save.materials?.[key] || 0) >= amount)) return;
    Object.entries(recipe).forEach(([key, amount]) => { save.materials[key] -= amount; });
    save.weaponUpgrades[weapon] = level + 1;
    traitUiSignature = "";
    persist(); renderForge(); updateHud();
    sound.play("success"); showComicWord(`FORGE +${level + 1}!`, weapon === "hammer" ? "#ff9f1c" : "#8ce568");
    announce(`${WEAPONS[weapon].name} forged to level ${level + 1}.`);
  }

  function showForge() { renderForge(); dom.forgeOverlay.hidden = false; dom.closeForge.focus(); }

  function restorePreviousSave() {
    if (!window.confirm("Restore the previous save? Your current progress will be kept as the new backup.")) return;
    const restored = store.restoreBackup(save);
    if (!restored) return;
    save = restored; sound.muted = save.muted;
    player.maxHealth = save.maxHealth; player.maxEnergy = save.maxEnergy; player.weapon = save.weapon;
    resetChapterState(save.chapter); updateMenu();
    showComicWord("SAVE RESTORED!", "#8ce568"); announce("Previous adventure restored.");
  }

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
      if(hasAnyProgress()&&!window.confirm("Start a new adventure? Your current progress will be protected as a restorable backup."))return;
      save=store.reset(save);sound.muted=false;player.maxHealth=save.maxHealth;player.maxEnergy=save.maxEnergy;player.weapon="leafblade";startChapter(1,true);
    });
    dom.chaptersButton.addEventListener("click",showChapters);dom.howButton.addEventListener("click",()=>{dom.howOverlay.hidden=false;dom.closeHow.focus();});dom.bestiaryButton.addEventListener("click",showBestiary);dom.forgeButton.addEventListener("click",showForge);dom.restoreButton.addEventListener("click",restorePreviousSave);
    dom.closeChapters.addEventListener("click",()=>{dom.chapterOverlay.hidden=true;dom.chaptersButton.focus();});dom.closeHow.addEventListener("click",()=>{dom.howOverlay.hidden=true;dom.howButton.focus();});dom.closeBestiary.addEventListener("click",()=>{dom.bestiaryOverlay.hidden=true;dom.bestiaryButton.focus();});dom.closeForge.addEventListener("click",()=>{dom.forgeOverlay.hidden=true;dom.forgeButton.focus();});
    dom.storyContinue.addEventListener("click",()=>{sound.play("click");if(game.storyAction)game.storyAction();});
    dom.dialogueOverlay.addEventListener("click",advanceDialogue);
    dom.interactionPrompt.addEventListener("click",interact);
    dom.canvas.addEventListener("pointerdown",handleStageTap);
    dom.pauseButton.addEventListener("click",()=>togglePause());dom.resumeButton.addEventListener("click",()=>togglePause(false));
    dom.restartButton.addEventListener("click",()=>{dom.pauseOverlay.hidden=true;resetChapterState(game.chapter.id);game.mode="playing";});dom.menuButton.addEventListener("click",showMenu);
    dom.soundButton.addEventListener("click",()=>{sound.muted=!sound.muted;persist(false);updateMenu();});
    dom.abilityButtons.forEach(button=>button.addEventListener("click",()=>{
      if(button.dataset.ability==="fist")cycleWeapon();
      else if(button.dataset.ability==="dash")useDash();
      else useTouchAbility(button.dataset.ability);
    }));
    dom.weaponSlots.forEach(slot=>slot.addEventListener("click",()=>selectWeapon(slot.dataset.weapon)));
    dom.companionButton.addEventListener("click",useCompanion);
    dom.endingChapters.addEventListener("click",()=>{dom.endingOverlay.hidden=true;showChapters();});dom.endingMenu.addEventListener("click",showMenu);
    dom.touchAttack.addEventListener("pointerdown",event=>{event.preventDefault();player.touchAttackHeld=true;if(player.weapon === "hammer"){player.hammerCharging=true;player.hammerCharge=0;showComicWord("CHARGE!", "#ffb347");}else useWeapon();});dom.touchWeapon.addEventListener("pointerdown",event=>{event.preventDefault();cycleWeapon();});dom.touchBolt.addEventListener("pointerdown",event=>{event.preventDefault();useTouchAbility("bolt");});dom.touchShield.addEventListener("pointerdown",event=>{event.preventDefault();useTouchAbility("shield");});dom.touchDash.addEventListener("pointerdown",event=>{event.preventDefault();useDash();});dom.touchInteract.addEventListener("pointerdown",event=>{event.preventDefault();interact();});dom.touchCompanion.addEventListener("pointerdown",event=>{event.preventDefault();useCompanion();});
    const stopTouchAttack=()=>{if(player.touchAttackHeld&&player.weapon === "hammer"&&player.hammerCharging){player.hammerCharging=false;useCometHammer(player.hammerCharge);player.hammerCharge=0;}player.touchAttackHeld=false;};
    window.addEventListener("pointerup",stopTouchAttack);window.addEventListener("pointercancel",stopTouchAttack);window.addEventListener("blur",stopTouchAttack);
    window.addEventListener("resize",resizeCanvas);
    window.addEventListener("orientationchange",()=>requestAnimationFrame(resizeCanvas));
    window.visualViewport?.addEventListener("resize",resizeCanvas);
    document.addEventListener("visibilitychange",()=>{if(document.hidden&&game.mode==="playing")togglePause(true);});
    bindTouchStick();
  }

  function init() {
    bindEvents();updateMenu();resizeCanvas();resetChapterState(save.chapter);switchScreen("menu");game.mode="menu";requestAnimationFrame(frame);
  }

  init();
}());
