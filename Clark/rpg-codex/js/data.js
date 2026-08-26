(function () {
  "use strict";

  const chapters = [
    {
      id: 1,
      title: "The First Portal",
      page: 1,
      intro: "A blast reveals a purple doorway. Clark's first trip through it leads from a TNT yard to a fire realm—and straight toward the enormous Pi Monster.",
      reward: "Unlock: Star Bolt",
      palette: { ground: "#557a46", ground2: "#364d38", line: "#8fae67", glow: "#a65dff", sky: "#65bced" },
      environment: "portal-yard",
      objective: "Break the three cracked portal stones",
      start: { x: 120, y: 360 },
      portal: { x: 1065, y: 165, color: "#a65dff" },
      puzzle: {
        type: "break",
        targets: [
          { id: "rock-a", x: 410, y: 230 },
          { id: "rock-b", x: 585, y: 470 },
          { id: "rock-c", x: 790, y: 260 }
        ]
      },
      boss: { name: "The Pi Monster", type: "pi", hp: 12, x: 955, y: 355, color: "#33223f" },
      memories: [{ x: 220, y: 175 }, { x: 640, y: 160 }, { x: 985, y: 565 }],
      dialogue: [
        ["Clark", "Okay... exploding the wall was not the plan. But that portal definitely was!"],
        ["Bradley", "You bring the cape. I brought the MEGA BOOM cannon!"],
        ["Clark", "Then let's show that giant Pi face some actual math."]
      ]
    },
    {
      id: 2,
      title: "Mars Stasis",
      page: 11,
      intro: "After a meteor collision, Clark and Bradley crash on Mars. Strange tracks lead to a buried bunker, two sleeping warriors, and a storm made of portal energy.",
      reward: "Unlock: Bradley's Mega Boom",
      palette: { ground: "#a34d31", ground2: "#663025", line: "#d07850", glow: "#6dff9a", sky: "#2c1322" },
      environment: "mars",
      objective: "Wake the stasis chamber: blue, purple, orange",
      start: { x: 100, y: 570 },
      portal: { x: 1130, y: 160, color: "#ff9f1c" },
      puzzle: {
        type: "sequence",
        sequence: ["blue", "purple", "orange"],
        targets: [
          { id: "blue", x: 350, y: 230, color: "#39a8ff", label: "Blue Core" },
          { id: "purple", x: 615, y: 505, color: "#a65dff", label: "Purple Core" },
          { id: "orange", x: 850, y: 225, color: "#ff9f1c", label: "Orange Core" }
        ]
      },
      boss: { name: "Stasis Warden", type: "warden", hp: 15, x: 970, y: 390, color: "#142d28" },
      memories: [{ x: 205, y: 390 }, { x: 585, y: 205 }, { x: 1010, y: 590 }],
      dialogue: [
        ["Bradley", "Mars landing score: maybe two out of ten."],
        ["Clark", "Those tracks go into the bunker. Stay close."],
        ["Bradley", "If the green lights wake up, I'm pressing Q."]
      ]
    },
    {
      id: 3,
      title: "The Prison Engine",
      page: 21,
      intro: "A runaway portal engine races through a hidden facility. Behind its force fields, colorful prisoners need Clark and Bradley to solve a four-star lock.",
      reward: "Unlock: Rocket Dash",
      palette: { ground: "#18273a", ground2: "#0c1527", line: "#325171", glow: "#ba57ff", sky: "#070b1a" },
      environment: "facility",
      objective: "Repeat the star code: blue, purple, orange, green",
      start: { x: 105, y: 345 },
      portal: { x: 1160, y: 350, color: "#ff9f1c" },
      puzzle: {
        type: "sequence",
        sequence: ["blue", "purple", "orange", "green"],
        targets: [
          { id: "blue", x: 350, y: 205, color: "#39a8ff", label: "Blue Star" },
          { id: "purple", x: 350, y: 500, color: "#a65dff", label: "Purple Star" },
          { id: "orange", x: 700, y: 205, color: "#ff9f1c", label: "Orange Star" },
          { id: "green", x: 700, y: 500, color: "#7ee568", label: "Green Star" }
        ]
      },
      boss: { name: "Portal Engine", type: "engine", hp: 16, x: 1000, y: 350, color: "#727a89" },
      memories: [{ x: 190, y: 170 }, { x: 555, y: 350 }, { x: 1030, y: 590 }],
      dialogue: [
        ["Clark", "That machine is carrying a portal—and running away with it!"],
        ["Prisoner", "The stars are the key. Please hurry!"],
        ["Bradley", "Four colors, one lock. We can do this."]
      ]
    },
    {
      id: 4,
      title: "The Shadow Guardian",
      page: 31,
      intro: "Beyond the repaired gate is a sky of floating islands. A winged Portal Guardian offers a path of golden leaves—but a shadow blocks the final door.",
      reward: "Unlock: Leaf Shield",
      palette: { ground: "#34285a", ground2: "#171535", line: "#645596", glow: "#ffd34f", sky: "#080a25" },
      environment: "star-void",
      objective: "Awaken the four leaf-path stones",
      start: { x: 100, y: 570 },
      portal: { x: 1140, y: 145, color: "#ffd34f" },
      puzzle: {
        type: "sequence",
        sequence: ["leaf-a", "leaf-b", "leaf-c", "leaf-d"],
        targets: [
          { id: "leaf-a", x: 285, y: 510, color: "#ffd34f", label: "First Leaf" },
          { id: "leaf-b", x: 465, y: 385, color: "#ffd34f", label: "Second Leaf" },
          { id: "leaf-c", x: 660, y: 270, color: "#ffd34f", label: "Third Leaf" },
          { id: "leaf-d", x: 845, y: 160, color: "#ffd34f", label: "Final Leaf" }
        ]
      },
      boss: { name: "Shadow Guardian", type: "shadow", hp: 18, x: 980, y: 365, color: "#1d102b" },
      memories: [{ x: 200, y: 215 }, { x: 650, y: 590 }, { x: 1045, y: 535 }],
      dialogue: [
        ["Portal Guardian", "The leaves remember every safe path. Follow their light."],
        ["Clark", "And if the giant shadow doesn't like that?"],
        ["Portal Guardian", "Then hold the shield toward the dark."]
      ]
    },
    {
      id: 5,
      title: "The Vine Tower",
      page: 41,
      intro: "A tiny bird leads the party to an overgrown tower. Hidden square runes, roaring wind traps, and a misunderstood stone golem guard the route forward.",
      reward: "Unlock: Bird's Secret Finder",
      palette: { ground: "#425b37", ground2: "#243627", line: "#6f8a4e", glow: "#e4c14b", sky: "#78b9d2" },
      environment: "vine-tower",
      objective: "Push the rune block onto the glowing square",
      start: { x: 105, y: 350 },
      portal: { x: 1145, y: 350, color: "#62bfff" },
      puzzle: {
        type: "push",
        block: { x: 390, y: 350 },
        goal: { x: 705, y: 350 },
        targets: []
      },
      boss: { name: "Vine Golem", type: "golem", hp: 1, x: 970, y: 350, color: "#677052", peaceful: true },
      memories: [{ x: 220, y: 170 }, { x: 600, y: 555 }, { x: 990, y: 160 }],
      dialogue: [
        ["Bird", "Tweet-tweet! The square isn't on the wall. It's under the roots!"],
        ["Clark", "That golem looks angry... or maybe just worried."],
        ["Bradley", "Let's try talking before Mega Boom-ing."]
      ]
    },
    {
      id: 6,
      title: "The Raven Tempest",
      page: 51,
      intro: "Maps and spiral signs lead through an abandoned wind city. Above it, a colossal shadow raven gathers every corrupted gust into one living storm.",
      reward: "Unlock: Wind Dash",
      palette: { ground: "#59614a", ground2: "#253039", line: "#8a8b69", glow: "#ffe56d", sky: "#4baad1" },
      environment: "wind-city",
      objective: "Cross the safe runes: spiral, leaf, square, spiral",
      start: { x: 100, y: 585 },
      portal: { x: 1145, y: 145, color: "#69cfff" },
      puzzle: {
        type: "path",
        sequence: ["spiral", "leaf", "square", "spiral"],
        targets: [
          { id: "spiral", x: 310, y: 520, color: "#ffd34f", label: "Spiral Rune" },
          { id: "leaf", x: 495, y: 405, color: "#8ce568", label: "Leaf Rune" },
          { id: "square", x: 690, y: 285, color: "#ffd34f", label: "Square Rune" },
          { id: "spiral-2", match: "spiral", x: 870, y: 175, color: "#69cfff", label: "Spiral Rune" }
        ]
      },
      boss: { name: "Raven Tempest", type: "raven", hp: 20, x: 970, y: 350, color: "#111927" },
      memories: [{ x: 170, y: 230 }, { x: 600, y: 560 }, { x: 1045, y: 530 }],
      dialogue: [
        ["Bird", "TWEET! That shadow has been following us since the tower!"],
        ["Portal Guardian", "It is the storm's fear given wings."],
        ["Clark", "Then we'll give the wind its sky back."]
      ]
    },
    {
      id: 7,
      title: "The Book's Trial",
      page: 61,
      intro: "The last blue gate opens onto a three-minute trial of lasers, spikes, music, and living runes. At the end waits a key—and the secret of the magical book.",
      reward: "Final reward: The Leaf Key",
      palette: { ground: "#3d5138", ground2: "#182c27", line: "#71865b", glow: "#ffd34f", sky: "#62bde2" },
      environment: "final-trial",
      objective: "Play the keys: 1, 3, 2, 4, 2",
      start: { x: 95, y: 350 },
      portal: { x: 1145, y: 350, color: "#ffd34f" },
      timed: 180,
      puzzle: {
        type: "rhythm",
        sequence: ["note-1", "note-3", "note-2", "note-4", "note-2"],
        targets: [
          { id: "note-1", x: 330, y: 210, color: "#62bfff", label: "Note 1", number: 1 },
          { id: "note-2", x: 330, y: 500, color: "#8ce568", label: "Note 2", number: 2 },
          { id: "note-3", x: 695, y: 210, color: "#a65dff", label: "Note 3", number: 3 },
          { id: "note-4", x: 695, y: 500, color: "#ff9f1c", label: "Note 4", number: 4 }
        ]
      },
      boss: { name: "The Final Gate", type: "gate", hp: 1, x: 1000, y: 350, color: "#d9bc4a", peaceful: true },
      memories: [{ x: 180, y: 170 }, { x: 565, y: 355 }, { x: 985, y: 580 }],
      dialogue: [
        ["Portal Guardian", "Three minutes. Listen to the Bird, trust your friends, and follow the rhythm."],
        ["Bradley", "No pressure. Except the pressure switches. Those have lots of pressure."],
        ["Clark", "Last portal. Everybody together!"]
      ]
    }
  ];

  const abilityUnlocks = {
    fist: 1,
    bolt: 2,
    dash: 3,
    shield: 4
  };

  window.PortalboundData = Object.freeze({ chapters, abilityUnlocks });
}());
