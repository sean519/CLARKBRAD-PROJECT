const canvas = document.querySelector("#field");
    const ctx = canvas.getContext("2d");
    const message = document.querySelector("#message");
    const autoMessage = document.querySelector("#autoMessage");
    const readout = document.querySelector("#readout");
    const shuffleButton = document.querySelector("#shuffle");
    const pauseButton = document.querySelector("#pause");
    const pauseIcon = document.querySelector("#pauseIcon");
    const slotA = document.querySelector("#slotA");
    const slotB = document.querySelector("#slotB");
    const tooltip = document.querySelector("#tooltip");
    const lookupInput = document.querySelector("#lookupInput");
    const lookupResult = document.querySelector("#lookupResult");
    const labPanel = document.querySelector(".lab-panel");
    const gamePanel = document.querySelector(".game-panel");
    const familyButtons = [...document.querySelectorAll("[data-family]")];
    const hazardButtons = [...document.querySelectorAll("[data-hazard]")];
    const weaponButtons = [...document.querySelectorAll("[data-weapon]")];
    const scoreReadout = document.querySelector("#scoreReadout");
    const levelReadout = document.querySelector("#levelReadout");
    const streakReadout = document.querySelector("#streakReadout");
    const timerReadout = document.querySelector("#timerReadout");
    const levelMap = document.querySelector("#levelMap");
    const missionName = document.querySelector("#missionName");
    const missionHint = document.querySelector("#missionHint");
    const missionProgress = document.querySelector("#missionProgress");
    const collectionTargets = document.querySelector("#collectionTargets");
    const missionTimerReadout = document.querySelector("#missionTimerReadout");
    const bestTimeReadout = document.querySelector("#bestTimeReadout");
    const rankingList = document.querySelector("#rankingList");
    const shipStatus = document.querySelector("#shipStatus");
    const shipParts = document.querySelector("#shipParts");
    const bossReadout = document.querySelector("#bossReadout");
    const bossBar = document.querySelector("#bossBar");
    const bossTopbar = document.querySelector("#bossTopbar");
    const bossTopName = document.querySelector("#bossTopName");
    const bossTopReadout = document.querySelector("#bossTopReadout");
    const bossTopBar = document.querySelector("#bossTopBar");
    const riderReadout = document.querySelector("#riderReadout");
    const cargoReadout = document.querySelector("#cargoReadout");
    const weaponReadout = document.querySelector("#weaponReadout");
    const ufoReadout = document.querySelector("#ufoReadout");
    const stationReadout = document.querySelector("#stationReadout");
    const phaseReadout = document.querySelector("#phaseReadout");
    const upgradeReadout = document.querySelector("#upgradeReadout");
    const evolutionReadout = document.querySelector("#evolutionReadout");
    const energyReadout = document.querySelector("#energyReadout");
    const evolutionLabel = document.querySelector("#evolutionLabel");
    const evolutionPercent = document.querySelector("#evolutionPercent");
    const evolutionBar = document.querySelector("#evolutionBar");
    const skillPointReadout = document.querySelector("#skillPointReadout");
    const techTree = document.querySelector("#techTree");
    const hudMessage = document.querySelector("#hudMessage");
    const upgradeLine = document.querySelector("#upgradeLine");
    const rewardToast = document.querySelector("#rewardToast");
    const discoveryStrip = document.querySelector("#discoveryStrip");
    const startGameButton = document.querySelector("#startGame");
    const nextMissionButton = document.querySelector("#nextMission");
    const resetGameButton = document.querySelector("#resetGame");
    const toolButtons = [...document.querySelectorAll("[data-tool]")];
    const clarkSkillButton = document.querySelector("#clarkSkill");
    const bradleySkillButton = document.querySelector("#bradleySkill");
    const kidsModeButton = document.querySelector("#kidsMode");
    const soundToggleButton = document.querySelector("#soundToggle");
    const openCodexButton = document.querySelector("#openCodex");
    const fireUfoButton = document.querySelector("#fireUfo");
    const vacuumUfoButton = document.querySelector("#vacuumUfo");
    const closeCodexButton = document.querySelector("#closeCodex");
    const codexModal = document.querySelector("#codexModal");
    const codexGrid = document.querySelector("#codexGrid");
    const guideToggleButton = document.querySelector("#guideToggle");
    const closeGuideButton = document.querySelector("#closeGuide");
    const guidePopover = document.querySelector("#guidePopover");

    const elements = [
      { n: 1, symbol: "H", name: "Hydrogen", family: "reactive", info: "The lightest element. It burns easily and forms water with oxygen." },
      { n: 2, symbol: "He", name: "Helium", family: "noble", info: "A noble gas that rarely reacts. It is used in balloons and cooling systems." },
      { n: 3, symbol: "Li", name: "Lithium", family: "metal", info: "A soft, light metal used in batteries and reactive salts." },
      { n: 4, symbol: "Be", name: "Beryllium", family: "metal", info: "A light, hard alkaline earth metal used in special alloys." },
      { n: 5, symbol: "B", name: "Boron", family: "metalloid", info: "A metalloid used in borosilicate glass, detergents, and semiconductors." },
      { n: 6, symbol: "C", name: "Carbon", family: "reactive", info: "The backbone of organic chemistry. It forms diamond, graphite, CO2, and methane." },
      { n: 7, symbol: "N", name: "Nitrogen", family: "reactive", info: "Most of Earth's air is nitrogen. It forms ammonia with hydrogen." },
      { n: 8, symbol: "O", name: "Oxygen", family: "reactive", info: "Supports breathing and combustion. It forms water with hydrogen and oxides with metals." },
      { n: 9, symbol: "F", name: "Fluorine", family: "halogen", info: "A highly reactive halogen. It can react violently with hydrogen." },
      { n: 10, symbol: "Ne", name: "Neon", family: "noble", info: "A noble gas famous for bright red-orange signs." },
      { n: 11, symbol: "Na", name: "Sodium", family: "metal", info: "A soft metal that reacts strongly with oxygen and chlorine." },
      { n: 12, symbol: "Mg", name: "Magnesium", family: "metal", info: "A light metal that burns with a bright white flame to form magnesium oxide." },
      { n: 13, symbol: "Al", name: "Aluminum", family: "metal", info: "A lightweight metal protected by a thin oxide layer." },
      { n: 14, symbol: "Si", name: "Silicon", family: "metalloid", info: "A metalloid used in glass, sand, and computer chips." },
      { n: 15, symbol: "P", name: "Phosphorus", family: "reactive", info: "A reactive element important in DNA, bones, and fertilizers." },
      { n: 16, symbol: "S", name: "Sulfur", family: "reactive", info: "A yellow nonmetal found in minerals and many strong-smelling compounds." },
      { n: 17, symbol: "Cl", name: "Chlorine", family: "halogen", info: "A reactive halogen used in disinfectants and table salt." },
      { n: 18, symbol: "Ar", name: "Argon", family: "noble", info: "A noble gas used in welding and light bulbs because it avoids reacting." },
      { n: 19, symbol: "K", name: "Potassium", family: "metal", info: "A very reactive metal. It can flare violently when it meets oxygen or water." },
      { n: 20, symbol: "Ca", name: "Calcium", family: "metal", info: "A metal important in bones, shells, limestone, and quicklime." },
      { n: 21, symbol: "Sc", name: "Scandium", family: "metal", info: "A transition metal used in lightweight aluminum alloys." },
      { n: 22, symbol: "Ti", name: "Titanium", family: "metal", info: "A strong, light metal valued for aircraft, implants, and corrosion resistance." },
      { n: 23, symbol: "V", name: "Vanadium", family: "metal", info: "A transition metal used to strengthen steel and in flow batteries." },
      { n: 24, symbol: "Cr", name: "Chromium", family: "metal", info: "A shiny transition metal used in stainless steel and chrome plating." },
      { n: 25, symbol: "Mn", name: "Manganese", family: "metal", info: "A transition metal important in steelmaking and battery chemistry." },
      { n: 26, symbol: "Fe", name: "Iron", family: "metal", info: "A strong metal that forms rust when it reacts with oxygen." },
      { n: 27, symbol: "Co", name: "Cobalt", family: "metal", info: "A magnetic metal used in superalloys, pigments, and batteries." },
      { n: 28, symbol: "Ni", name: "Nickel", family: "metal", info: "A corrosion-resistant metal used in stainless steel and rechargeable batteries." },
      { n: 29, symbol: "Cu", name: "Copper", family: "metal", info: "A conductive reddish metal used in wires, pipes, and alloys." },
      { n: 30, symbol: "Zn", name: "Zinc", family: "metal", info: "A metal used for galvanizing steel and making useful sulfide compounds." },
      { n: 31, symbol: "Ga", name: "Gallium", family: "metal", info: "A soft metal that melts near room temperature and is used in electronics." },
      { n: 32, symbol: "Ge", name: "Germanium", family: "metalloid", info: "A metalloid used in fiber optics, infrared optics, and semiconductors." },
      { n: 33, symbol: "As", name: "Arsenic", family: "metalloid", info: "A toxic metalloid found in minerals and some semiconductor materials." },
      { n: 34, symbol: "Se", name: "Selenium", family: "reactive", info: "A trace element used in glass, electronics, and biology in tiny amounts." },
      { n: 35, symbol: "Br", name: "Bromine", family: "halogen", info: "A reddish-brown liquid halogen that reacts with many metals." },
      { n: 36, symbol: "Kr", name: "Krypton", family: "noble", info: "A noble gas used in lighting, lasers, and high-performance windows." },
      { n: 37, symbol: "Rb", name: "Rubidium", family: "metal", info: "A very reactive alkali metal used in research and atomic clocks." },
      { n: 38, symbol: "Sr", name: "Strontium", family: "metal", info: "An alkaline earth metal that gives fireworks a red color." },
      { n: 39, symbol: "Y", name: "Yttrium", family: "metal", info: "A transition metal used in LEDs, lasers, and advanced ceramics." },
      { n: 40, symbol: "Zr", name: "Zirconium", family: "metal", info: "A corrosion-resistant metal used in ceramics and nuclear reactor materials." },
      { n: 41, symbol: "Nb", name: "Niobium", family: "metal", info: "A transition metal used in superconducting magnets and strong alloys." },
      { n: 42, symbol: "Mo", name: "Molybdenum", family: "metal", info: "A heat-resistant metal used in high-strength steels and catalysts." },
      { n: 43, symbol: "Tc", name: "Technetium", family: "radioactive", info: "The lightest element with no stable isotopes. It is used in medical imaging." },
      { n: 44, symbol: "Ru", name: "Ruthenium", family: "metal", info: "A rare transition metal used in electronics, catalysts, and alloys." },
      { n: 45, symbol: "Rh", name: "Rhodium", family: "metal", info: "A rare, reflective metal used in catalytic converters and plating." },
      { n: 46, symbol: "Pd", name: "Palladium", family: "metal", info: "A precious metal used in catalytic converters, electronics, and hydrogen chemistry." },
      { n: 47, symbol: "Ag", name: "Silver", family: "metal", info: "A shiny conductive metal. Silver chloride darkens in light." },
      { n: 48, symbol: "Cd", name: "Cadmium", family: "metal", info: "A toxic metal formerly common in batteries and pigments." },
      { n: 49, symbol: "In", name: "Indium", family: "metal", info: "A soft metal used in touchscreens, solders, and semiconductors." },
      { n: 50, symbol: "Sn", name: "Tin", family: "metal", info: "A soft metal used in solder, bronze, and protective coatings." },
      { n: 51, symbol: "Sb", name: "Antimony", family: "metalloid", info: "A brittle metalloid used in flame retardants, alloys, and semiconductors." },
      { n: 52, symbol: "Te", name: "Tellurium", family: "metalloid", info: "A brittle metalloid used in solar cells, alloys, and thermoelectrics." },
      { n: 53, symbol: "I", name: "Iodine", family: "halogen", info: "A purple-black halogen important for thyroid health and antiseptics." },
      { n: 54, symbol: "Xe", name: "Xenon", family: "noble", info: "A heavy noble gas used in lamps, ion thrusters, and medical imaging." },
      { n: 55, symbol: "Cs", name: "Cesium", family: "metal", info: "A very reactive alkali metal used in atomic clocks." },
      { n: 56, symbol: "Ba", name: "Barium", family: "metal", info: "An alkaline earth metal used in medical contrast agents and fireworks." },
      { n: 57, symbol: "La", name: "Lanthanum", family: "metal", info: "A lanthanide metal used in camera lenses, catalysts, and batteries." },
      { n: 58, symbol: "Ce", name: "Cerium", family: "metal", info: "A lanthanide used in polishing powders, catalysts, and lighter flints." },
      { n: 59, symbol: "Pr", name: "Praseodymium", family: "metal", info: "A lanthanide used in magnets, glass coloring, and alloys." },
      { n: 60, symbol: "Nd", name: "Neodymium", family: "metal", info: "A lanthanide famous for powerful permanent magnets." },
      { n: 61, symbol: "Pm", name: "Promethium", family: "radioactive", info: "A radioactive lanthanide with no stable isotopes." },
      { n: 62, symbol: "Sm", name: "Samarium", family: "metal", info: "A lanthanide used in magnets, lasers, and nuclear reactor control rods." },
      { n: 63, symbol: "Eu", name: "Europium", family: "metal", info: "A lanthanide used in red and blue phosphors for displays and lighting." },
      { n: 64, symbol: "Gd", name: "Gadolinium", family: "metal", info: "A lanthanide used in MRI contrast agents and magnetic materials." },
      { n: 65, symbol: "Tb", name: "Terbium", family: "metal", info: "A lanthanide used in green phosphors, magnets, and sensors." },
      { n: 66, symbol: "Dy", name: "Dysprosium", family: "metal", info: "A lanthanide used in high-performance magnets and lasers." },
      { n: 67, symbol: "Ho", name: "Holmium", family: "metal", info: "A lanthanide with strong magnetic properties and laser uses." },
      { n: 68, symbol: "Er", name: "Erbium", family: "metal", info: "A lanthanide used in fiber-optic amplifiers and pink glass coloring." },
      { n: 69, symbol: "Tm", name: "Thulium", family: "metal", info: "A rare lanthanide used in lasers and portable X-ray sources." },
      { n: 70, symbol: "Yb", name: "Ytterbium", family: "metal", info: "A lanthanide used in lasers, atomic clocks, and specialty alloys." },
      { n: 71, symbol: "Lu", name: "Lutetium", family: "metal", info: "A dense lanthanide used in detectors, catalysts, and medical applications." },
      { n: 72, symbol: "Hf", name: "Hafnium", family: "metal", info: "A corrosion-resistant metal used in superalloys and nuclear control rods." },
      { n: 73, symbol: "Ta", name: "Tantalum", family: "metal", info: "A corrosion-resistant metal used in electronics and medical implants." },
      { n: 74, symbol: "W", name: "Tungsten", family: "metal", info: "A very high-melting metal used in tools, filaments, and armor-piercing alloys." },
      { n: 75, symbol: "Re", name: "Rhenium", family: "metal", info: "A rare metal used in jet engine superalloys and catalysts." },
      { n: 76, symbol: "Os", name: "Osmium", family: "metal", info: "A very dense transition metal used in hard alloys and research." },
      { n: 77, symbol: "Ir", name: "Iridium", family: "metal", info: "A dense, corrosion-resistant metal used in spark plugs and crucibles." },
      { n: 78, symbol: "Pt", name: "Platinum", family: "metal", info: "A precious metal used in catalysts, jewelry, and medical devices." },
      { n: 79, symbol: "Au", name: "Gold", family: "metal", info: "A dense, stable precious metal that resists corrosion." },
      { n: 80, symbol: "Hg", name: "Mercury", family: "metal", info: "A liquid metal at room temperature. It is toxic and used only with care." },
      { n: 81, symbol: "Tl", name: "Thallium", family: "metal", info: "A toxic heavy metal used in specialized electronics and research." },
      { n: 82, symbol: "Pb", name: "Lead", family: "metal", info: "A dense heavy metal once used widely, now restricted because of toxicity." },
      { n: 83, symbol: "Bi", name: "Bismuth", family: "metal", info: "A heavy metal used in medicines, low-melting alloys, and cosmetics." },
      { n: 84, symbol: "Po", name: "Polonium", family: "radioactive", info: "A rare radioactive element discovered by Marie Curie." },
      { n: 85, symbol: "At", name: "Astatine", family: "radioactive", info: "A very rare radioactive halogen with only tiny natural amounts on Earth." },
      { n: 86, symbol: "Rn", name: "Radon", family: "radioactive", info: "A radioactive noble gas produced by decay of uranium and radium." },
      { n: 87, symbol: "Fr", name: "Francium", family: "radioactive", info: "An extremely rare radioactive alkali metal." },
      { n: 88, symbol: "Ra", name: "Radium", family: "radioactive", info: "A naturally radioactive metal once famous for glowing compounds. It must be handled with strict shielding." },
      { n: 89, symbol: "Ac", name: "Actinium", family: "radioactive", info: "A radioactive actinide used in research and targeted medical isotope work." },
      { n: 90, symbol: "Th", name: "Thorium", family: "radioactive", info: "A weakly radioactive actinide studied as a possible nuclear fuel." },
      { n: 91, symbol: "Pa", name: "Protactinium", family: "radioactive", info: "A rare radioactive actinide found in uranium ores." },
      { n: 92, symbol: "U", name: "Uranium", family: "radioactive", info: "A heavy radioactive element used as nuclear fuel. Its atoms can release energy through radioactive decay and fission." },
      { n: 93, symbol: "Np", name: "Neptunium", family: "radioactive", info: "A radioactive actinide produced in nuclear reactors." },
      { n: 94, symbol: "Pu", name: "Plutonium", family: "radioactive", info: "A synthetic radioactive metal used in nuclear technology. It is highly hazardous and tightly controlled." },
      { n: 95, symbol: "Am", name: "Americium", family: "radioactive", info: "A radioactive actinide used in some smoke detectors and research sources." },
      { n: 96, symbol: "Cm", name: "Curium", family: "radioactive", info: "A synthetic radioactive actinide named after Marie and Pierre Curie." },
      { n: 97, symbol: "Bk", name: "Berkelium", family: "radioactive", info: "A synthetic radioactive actinide made in nuclear reactors." },
      { n: 98, symbol: "Cf", name: "Californium", family: "radioactive", info: "A radioactive actinide used as a neutron source in specialized applications." },
      { n: 99, symbol: "Es", name: "Einsteinium", family: "radioactive", info: "A synthetic radioactive element discovered in nuclear test debris." },
      { n: 100, symbol: "Fm", name: "Fermium", family: "radioactive", info: "A synthetic radioactive element named after physicist Enrico Fermi." },
      { n: 101, symbol: "Md", name: "Mendelevium", family: "radioactive", info: "A synthetic radioactive element named after Dmitri Mendeleev." },
      { n: 102, symbol: "No", name: "Nobelium", family: "radioactive", info: "A synthetic radioactive element named after Alfred Nobel." },
      { n: 103, symbol: "Lr", name: "Lawrencium", family: "radioactive", info: "A synthetic radioactive actinide named after Ernest Lawrence." },
      { n: 104, symbol: "Rf", name: "Rutherfordium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 105, symbol: "Db", name: "Dubnium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 106, symbol: "Sg", name: "Seaborgium", family: "radioactive", info: "A synthetic superheavy radioactive element named after Glenn Seaborg." },
      { n: 107, symbol: "Bh", name: "Bohrium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 108, symbol: "Hs", name: "Hassium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 109, symbol: "Mt", name: "Meitnerium", family: "radioactive", info: "A synthetic superheavy radioactive element named after Lise Meitner." },
      { n: 110, symbol: "Ds", name: "Darmstadtium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 111, symbol: "Rg", name: "Roentgenium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 112, symbol: "Cn", name: "Copernicium", family: "radioactive", info: "A synthetic superheavy radioactive element named after Nicolaus Copernicus." },
      { n: 113, symbol: "Nh", name: "Nihonium", family: "radioactive", info: "A synthetic superheavy radioactive element discovered by researchers in Japan." },
      { n: 114, symbol: "Fl", name: "Flerovium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 115, symbol: "Mc", name: "Moscovium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 116, symbol: "Lv", name: "Livermorium", family: "radioactive", info: "A synthetic superheavy radioactive element." },
      { n: 117, symbol: "Ts", name: "Tennessine", family: "radioactive", info: "A synthetic superheavy radioactive element in the halogen column." },
      { n: 118, symbol: "Og", name: "Oganesson", family: "radioactive", info: "A synthetic superheavy radioactive element in the noble gas column." }
    ];

    const familyColors = {
      reactive: "#e85d4f",
      metal: "#d49b2a",
      halogen: "#0f9b8f",
      noble: "#2e79bd",
      metalloid: "#8d6ab6",
      radioactive: "#b7d12a"
    };

    const reactions = {
      "H+O": { formula: "H2O", name: "water", note: "H2O is water.", animation: "water" },
      "C+O": { formula: "CO2", name: "carbon dioxide", note: "CO2 is carbon dioxide, the gas we breathe out.", animation: "gas" },
      "H+N": { formula: "NH3", name: "ammonia", note: "NH3 is ammonia, a sharp-smelling compound.", animation: "gas" },
      "H+Cl": { formula: "HCl", name: "hydrogen chloride", note: "HCl is hydrogen chloride; in water it forms hydrochloric acid.", animation: "gas" },
      "Na+Cl": { formula: "NaCl", name: "salt", note: "NaCl is table salt.", animation: "crystal" },
      "Mg+O": { formula: "MgO", name: "magnesium oxide", note: "MgO is magnesium oxide, formed by burning magnesium.", animation: "spark" },
      "Ca+O": { formula: "CaO", name: "calcium oxide", note: "CaO is quicklime.", animation: "spark" },
      "Fe+O": { formula: "Fe2O3", name: "iron oxide", note: "Fe2O3 is rust.", animation: "crystal" },
      "Cu+S": { formula: "CuS", name: "copper sulfide", note: "CuS is copper sulfide.", animation: "crystal" },
      "Ag+Cl": { formula: "AgCl", name: "silver chloride", note: "AgCl is silver chloride, a light-sensitive compound.", animation: "crystal" },
      "Zn+S": { formula: "ZnS", name: "zinc sulfide", note: "ZnS is zinc sulfide.", animation: "spark" },
      "Al+O": { formula: "Al2O3", name: "aluminum oxide", note: "Al2O3 is aluminum oxide.", animation: "crystal" },
      "Li+F": { formula: "LiF", name: "lithium fluoride", note: "LiF is lithium fluoride.", animation: "crystal" },
      "C+H": { formula: "CH4", name: "methane", note: "CH4 is methane, a flammable gas.", animation: "gas" }
    };

    const explosiveReactions = {
      "H+F": { formula: "HF", note: "H + F can react explosively to make hydrogen fluoride.", product: "hydrogen fluoride" },
      "K+O": { formula: "K2O", note: "Potassium reacts violently with oxygen. Boom: potassium oxide.", product: "potassium oxide" },
      "Na+O": { formula: "Na2O", note: "Sodium and oxygen can flare violently into sodium oxide.", product: "sodium oxide" },
      "Al+Cl": { formula: "AlCl3", note: "Aluminum and chlorine can react very violently to form aluminum chloride.", product: "aluminum chloride" },
      "H+Cl": { formula: "HCl", note: "Hydrogen and chlorine can explode in bright light, forming hydrogen chloride.", product: "hydrogen chloride" }
    };

    const missions = [
      { title: "Cool the Engine", formula: "H2O", hint: "Make H2O: water cools the UFO engine.", points: 100, part: "engine", partLabel: "Engine cooler" },
      { title: "Start the Circuit", formula: "NaCl", hint: "Make NaCl: salt starts the rescue circuit.", points: 120, part: "circuit", partLabel: "Salt circuit" },
      { title: "Put Out the Fire", formula: "CO2", hint: "Make CO2: carbon dioxide puts out the fire.", points: 130, part: "fire", partLabel: "Fire control" }
    ];

    const levelNames = ["Scout", "Collector", "Striker", "Engineer", "Guardian", "Starforge", "Nebula", "Quantum", "Nova", "Singularity"];
    const evolutionNames = ["Scout", "Collector", "Striker", "Engineer", "Guardian", "Starforge", "Nebula", "Quantum", "Nova", "Singularity"];
    const evolutionRewards = [
      { title: "Starter hull", text: "basic flight online", points: 0 },
      { title: "Cargo bay", text: "+1 tech point and larger element storage", points: 1 },
      { title: "Weapon link", text: "+1 tech point and stronger shots", points: 1 },
      { title: "Ion thrusters", text: "+1 tech point and faster movement", points: 1 },
      { title: "Shield matrix", text: "+2 tech points and stronger hull growth", points: 2 },
      { title: "Starforge core", text: "+1 tech point and better boss control", points: 1 },
      { title: "Nebula scanner", text: "+1 tech point and better target XP", points: 1 },
      { title: "Quantum bay", text: "+2 tech points and high cargo capacity", points: 2 },
      { title: "Nova weapon", text: "+1 tech point and heavy shot scaling", points: 1 },
      { title: "Singularity drive", text: "maximum level reached", points: 2 }
    ];
    const bossPhaseNames = ["Feeding", "Volatile", "Swarm", "Critical"];
    const bossWeakness = {
      H: { label: "H coolant burst", damage: 9 },
      O: { label: "O stabilizer", damage: 9 },
      H2O: { label: "Water coolant", damage: 18 },
      CO2: { label: "CO2 coolant", damage: 30 },
      NaCl: { label: "Salt interference", damage: 26 }
    };
    const kidsElements = new Set(["H", "O", "C", "N", "Na", "Cl", "Fe", "Mg", "Ag", "S", "Si"]);
    const discoveryFacts = {
      H2O: "Water. Living things need it, and it can be made from hydrogen and oxygen.",
      NaCl: "Table salt. It forms when sodium and chlorine combine.",
      CO2: "Carbon dioxide. We breathe it out, and plants use it.",
      Fe2O3: "Rust. Iron and oxygen slowly make this reddish compound.",
      NH3: "Ammonia. A sharp-smelling compound made from nitrogen and hydrogen.",
      MgO: "Magnesium oxide. It can form with a bright white flash.",
      AgCl: "Silver chloride. A light-sensitive compound.",
      SiO2: "Silicon dioxide. Found in sand, quartz, and glass.",
      HCl: "Hydrogen chloride. In water it becomes hydrochloric acid.",
      HF: "Hydrogen fluoride. A dangerous compound that needs expert safety.",
      K2O: "Potassium oxide. A reactive metal oxide.",
      CH4: "Methane. A simple gas made from carbon and hydrogen."
    };
    const achievementDefs = {
      H2O: "First water synthesis",
      NaCl: "Circuit starter",
      CO2: "Fire control expert",
      bossWeakness: "Black hole counter",
      evolution: "UFO evolution",
      cargo: "Element cannon pilot",
      bossDefeat: "Monster black hole breaker"
    };

    const nonmetals = new Set(["H", "C", "N", "O", "P", "S", "Se"]);
    const diatomicElements = new Set(["H", "N", "O", "F", "Cl", "Br", "I"]);
    const commonIons = {
      Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Fr: 1, Ag: 1,
      Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Ra: 2, Zn: 2, Cd: 2,
      Al: 3, Ga: 3, Sc: 3, Y: 3, La: 3,
      F: -1, Cl: -1, Br: -1, I: -1, O: -2, S: -2, Se: -2, N: -3, P: -3
    };
    const electronegativity = {
      H: 2.20, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98,
      Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.90, P: 2.19, S: 2.58, Cl: 3.16,
      K: 0.82, Ca: 1.00, Fe: 1.83, Cu: 1.90, Zn: 1.65, Br: 2.96, Ag: 1.93,
      I: 2.66, Au: 2.54, Hg: 2.00, Pb: 2.33, U: 1.38
    };

    const substanceLookup = {
      water: { formula: "H2O", name: "water" },
      "水": { formula: "H2O", name: "water" },
      salt: { formula: "NaCl", name: "table salt" },
      "食盐": { formula: "NaCl", name: "table salt" },
      "盐": { formula: "NaCl", name: "table salt" },
      rust: { formula: "Fe2O3", name: "iron oxide / rust" },
      "铁锈": { formula: "Fe2O3", name: "iron oxide / rust" },
      "carbon dioxide": { formula: "CO2", name: "carbon dioxide" },
      "二氧化碳": { formula: "CO2", name: "carbon dioxide" },
      oxygen: { formula: "O2", name: "oxygen gas" },
      "氧气": { formula: "O2", name: "oxygen gas" },
      hydrogen: { formula: "H2", name: "hydrogen gas" },
      "氢气": { formula: "H2", name: "hydrogen gas" },
      nitrogen: { formula: "N2", name: "nitrogen gas" },
      "氮气": { formula: "N2", name: "nitrogen gas" },
      ammonia: { formula: "NH3", name: "ammonia" },
      "氨": { formula: "NH3", name: "ammonia" },
      methane: { formula: "CH4", name: "methane" },
      "甲烷": { formula: "CH4", name: "methane" },
      "hydrochloric acid": { formula: "HCl", name: "hydrogen chloride / hydrochloric acid" },
      "盐酸": { formula: "HCl", name: "hydrogen chloride / hydrochloric acid" },
      "magnesium oxide": { formula: "MgO", name: "magnesium oxide" },
      "氧化镁": { formula: "MgO", name: "magnesium oxide" },
      "calcium oxide": { formula: "CaO", name: "calcium oxide / quicklime" },
      "生石灰": { formula: "CaO", name: "calcium oxide / quicklime" },
      "quicklime": { formula: "CaO", name: "calcium oxide / quicklime" },
      "silver chloride": { formula: "AgCl", name: "silver chloride" },
      "氯化银": { formula: "AgCl", name: "silver chloride" },
      "aluminum oxide": { formula: "Al2O3", name: "aluminum oxide" },
      "氧化铝": { formula: "Al2O3", name: "aluminum oxide" },
      "zinc sulfide": { formula: "ZnS", name: "zinc sulfide" },
      "硫化锌": { formula: "ZnS", name: "zinc sulfide" },
      uranium: { formula: "U", name: "uranium" },
      "铀": { formula: "U", name: "uranium" },
      radium: { formula: "Ra", name: "radium" },
      "镭": { formula: "Ra", name: "radium" },
      plutonium: { formula: "Pu", name: "plutonium" },
      "钚": { formula: "Pu", name: "plutonium" }
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = true;
    let nodes = [];
    let compounds = [];
    let effects = [];
    let selected = [];
    let pointer = { x: 0, y: 0, active: false };
    let hoveredNode = null;
    let reactionCooldowns = new Map();
    let lastAutoReactionAt = 0;
    let activeFamily = null;
    let spaceship = null;
    let spaceStation = null;
    let astronauts = [];
    let organizer = null;
    let blackHole = null;
    let tornado = null;
    let tsunami = null;
    let meteors = [];
    let miniBlackHoles = [];
    let energyOrbs = [];
    let shots = [];
    let spaceshipPressed = false;
    let processingStation = false;
    let stationReactionQueued = false;
    let stationCompletionQueued = false;
    let stationCompletionKey = "";
    let energyGrantDepth = 0;
    let lastPanelUpdateAt = 0;
    let lastReadoutUpdateAt = 0;
    const arrowKeys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };
    const MISSION_TIME_LIMIT = 90;
    const BLACK_HOLE_BOSS_EATEN_THRESHOLD = 24;
    const RANKING_STORAGE_KEY = "clark-space-lab-best-times-v1";
    // Cached deliberately: this used to call window.matchMedia once per element
    // tile per frame — about 7,000 media-query evaluations a second.
    const lowPowerQuery = window.matchMedia("(pointer: coarse), (max-width: 900px), (prefers-reduced-motion: reduce)");
    const weakCpu = Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    let lowPowerCached = lowPowerQuery.matches || weakCpu;
    const lowPowerMode = () => lowPowerCached;
    const refreshLowPowerMode = () => { lowPowerCached = lowPowerQuery.matches || weakCpu; };
    if (lowPowerQuery.addEventListener) lowPowerQuery.addEventListener("change", refreshLowPowerMode);
    else if (lowPowerQuery.addListener) lowPowerQuery.addListener(refreshLowPowerMode);
    let game = {
      active: true,
      score: 0,
      level: 1,
      streak: 0,
      missionIndex: 0,
      completed: 0,
      repairedParts: new Set(),
      shipRescues: 0,
      upgrades: { cargo: 0, hull: 0, weapon: 0, engine: 0, magnet: 0, shield: 0 },
      evolutionTier: 0,
      energy: 0,
      skillPoints: 1,
      lastUpgrade: "",
      achievements: new Set(),
      rewardCards: new Set(),
      discovered: new Set(),
      levelGoal: 3,
      timeLeft: MISSION_TIME_LIMIT,
      missionStartedAt: 0,
      missionElapsed: 0,
      rankings: loadMissionRankings(),
      lastRankingId: "",
      rankingRenderKey: "",
      lastTick: 0,
      kidsMode: false,
      sound: false,
      activeTool: null,
      shieldUntil: 0
    };
    // Single source of truth for the weapons. These numbers used to live in five
    // separate object literals inside shootUfo(), which meant the HUD had no way
    // to know a weapon's cooldown and the player got no feedback at all.
    const WEAPONS = {
      bolt: {
        key: "1", label: "Bolt", role: "Steady shot",
        cooldown: 190, speed: 10.5, power: 1, color: "#fff4b8", tone: 860, toneLength: 0.04
      },
      laser: {
        key: "2", label: "Laser", role: "Fast, pierces",
        cooldown: 95, speed: 17.4, power: 0.9, color: "#2aa8d8", tone: 980, toneLength: 0.04
      },
      spread: {
        key: "3", label: "Spread", role: "Three at once",
        cooldown: 280, speed: 10.2, power: 0.78, color: "#ffcf33", tone: 640, toneLength: 0.04
      },
      megaboom: {
        key: "4", label: "Boom", role: "Big blast",
        cooldown: 360, speed: 8.2, power: 2.35, color: "#e85d4f", tone: 180, toneLength: 0.12
      }
    };
    const WEAPON_ORDER = ["bolt", "laser", "spread", "megaboom"];
    const CARGO_SHOT_COOLDOWN = 160;
    let selectedWeapon = "bolt";
    let fireHeld = false;
    const hazards = {
      blackHole: true,
      tornado: false,
      meteor: false,
      tsunami: false
    };

    // ── Game feel ──────────────────────────────────────────────────────────
    // Impacts had no physical consequence on screen: the black hole simply lost
    // health. A short camera shake, a frame of hitstop and an expanding
    // shockwave are the three cheapest things that make a hit read as a hit.
    //
    // Note this deliberately uses its own reduced-motion query rather than
    // lowPowerMode(): a tablet is "low power" but should still get the shake,
    // whereas someone who asked for reduced motion should not.
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", () => { reducedMotion = reducedMotionQuery.matches; });
    }

    let shakeMagnitude = 0;
    let shakeUntil = 0;
    let shakeDuration = 1;

    const MAX_SHAKE = 10;   // px per axis; the two axes combine, so this is plenty
    function addScreenShake(magnitude, duration = 260, t = performance.now()) {
      if (reducedMotion) return;
      magnitude = Math.min(magnitude, MAX_SHAKE);
      // Keep the strongest shake in flight rather than letting them stack.
      if (magnitude >= shakeMagnitude || t > shakeUntil) {
        shakeMagnitude = Math.max(magnitude, t < shakeUntil ? shakeMagnitude : 0);
        shakeDuration = duration;
        shakeUntil = t + duration;
      }
    }

    function currentShakeOffset(t) {
      if (t >= shakeUntil || shakeMagnitude <= 0) return null;
      // Quadratic falloff feels like a real impact; linear feels like a wobble.
      const remaining = (shakeUntil - t) / shakeDuration;
      const strength = shakeMagnitude * remaining * remaining;
      if (strength < 0.15) return null;
      return {
        x: Math.sin(t * 0.083) * strength,
        y: Math.cos(t * 0.117) * strength
      };
    }

    // Hitstop: hold the simulation for a few milliseconds so a big hit lands.
    // It works by pushing the next fixed step back, so it cannot desync physics.
    let hitstopUntil = 0;
    function addHitstop(ms, t = performance.now()) {
      if (reducedMotion) return;
      hitstopUntil = Math.max(hitstopUntil, t + Math.min(ms, 90));
    }

    function addShockwave(x, y, radius, color, now) {
      if (reducedMotion) return;
      if (lowPowerCached && effects.length > 40) return;
      effects.push({ type: "shockwave", x, y, radius, color, born: now });
    }

    function addMuzzleFlash(x, y, angle, color, now) {
      if (reducedMotion) return;
      if (effects.length > 60) return;
      effects.push({ type: "muzzle", x, y, angle, color, born: now });
    }

    // easing helpers — linear motion is what makes effects look cheap
    const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
    const easeOutBack = (k) => 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    function uiBlockRects(extraPadding = 0) {
      return [labPanel, gamePanel].map((panel) => {
        const rect = panel.getBoundingClientRect();
        return {
          left: rect.left - extraPadding,
          right: rect.right + extraPadding,
          top: rect.top - extraPadding,
          bottom: rect.bottom + extraPadding
        };
      });
    }

    function pointInsideRect(x, y, rect) {
      return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    }

    function randomElementPoint() {
      const blocked = uiBlockRects(56);
      for (let tries = 0; tries < 80; tries += 1) {
        const point = {
          x: randomBetween(50, Math.max(80, width - 50)),
          y: randomBetween(110, Math.max(170, height - 110))
        };
        if (!blocked.some((rect) => pointInsideRect(point.x, point.y, rect))) return point;
      }
      return { x: width * 0.52, y: height * 0.5 };
    }

    function keepNodeOutOfUi(node, blockedRects) {
      blockedRects.forEach((rect) => {
        const padding = node.size * 0.62 + 12;
        const padded = {
          left: rect.left - padding,
          right: rect.right + padding,
          top: rect.top - padding,
          bottom: rect.bottom + padding
        };
        if (!pointInsideRect(node.x, node.y, padded)) return;

        const distances = [
          { side: "left", value: Math.abs(node.x - padded.left) },
          { side: "right", value: Math.abs(padded.right - node.x) },
          { side: "top", value: Math.abs(node.y - padded.top) },
          { side: "bottom", value: Math.abs(padded.bottom - node.y) }
        ].sort((a, b) => a.value - b.value);

        const nearest = distances[0].side;
        if (nearest === "left") {
          node.x = padded.left;
          node.vx = -Math.abs(node.vx) - 0.55;
        } else if (nearest === "right") {
          node.x = padded.right;
          node.vx = Math.abs(node.vx) + 0.55;
        } else if (nearest === "top") {
          node.y = padded.top;
          node.vy = -Math.abs(node.vy) - 0.55;
        } else {
          node.y = padded.bottom;
          node.vy = Math.abs(node.vy) + 0.55;
        }
      });
    }

    function pairKey(a, b) {
      const forward = `${a}+${b}`;
      const backward = `${b}+${a}`;
      if (explosiveReactions[forward] || reactions[forward]) return forward;
      if (explosiveReactions[backward] || reactions[backward]) return backward;
      return forward;
    }

    function nodePairId(a, b) {
      return [a.id, b.id].sort().join("|");
    }

    function gcd(a, b) {
      return b === 0 ? Math.abs(a) : gcd(b, a % b);
    }

    function formulaPart(symbol, count) {
      return `${symbol}${count > 1 ? count : ""}`;
    }

    function metalLike(element) {
      return element.family === "metal" || element.family === "radioactive";
    }

    function oxidationState(element) {
      return commonIons[element.symbol] || null;
    }

    function makeIonicFormula(cation, anion) {
      const cCharge = Math.abs(oxidationState(cation));
      const aCharge = Math.abs(oxidationState(anion));
      if (!cCharge || !aCharge) return null;
      const divisor = gcd(cCharge, aCharge);
      const cCount = aCharge / divisor;
      const aCount = cCharge / divisor;
      return `${formulaPart(cation.symbol, cCount)}${formulaPart(anion.symbol, aCount)}`;
    }

    function compoundName(a, b, kind) {
      if (kind === "diatomic") return `${a.name} molecule`;
      if (kind === "oxide") return `${a.name.toLowerCase()} oxide`;
      if (kind === "halide") return `${a.name.toLowerCase()} ${b.name.toLowerCase()} compound`;
      if (kind === "hydride") return `${a.name.toLowerCase()} hydride`;
      if (kind === "ionic") return `${a.name.toLowerCase()} ${b.name.toLowerCase()} compound`;
      return `${a.name.toLowerCase()}-${b.name.toLowerCase()} compound`;
    }

    function inferReaction(a, b) {
      const key = pairKey(a.symbol, b.symbol);
      if (reactions[key]) return { ...reactions[key], inferred: false };
      if (explosiveReactions[key]) return null;
      if (a.symbol === b.symbol && diatomicElements.has(a.symbol)) {
        return {
          formula: `${a.symbol}2`,
          name: compoundName(a, b, "diatomic"),
          note: `${a.symbol} commonly exists as a diatomic molecule: ${a.symbol}2.`,
          animation: "gas",
          inferred: true
        };
      }

      const first = metalLike(a) && !metalLike(b) ? a : metalLike(b) && !metalLike(a) ? b : a;
      const second = first === a ? b : a;
      const firstIon = oxidationState(first);
      const secondIon = oxidationState(second);
      if (metalLike(first) && secondIon < 0 && firstIon > 0) {
        const formula = makeIonicFormula(first, second);
        if (formula) {
          const kind = second.symbol === "O" ? "oxide" : second.family === "halogen" ? "halide" : second.symbol === "H" ? "hydride" : "ionic";
          return {
            formula,
            name: compoundName(first, second, kind),
            note: `Rule prediction: ${first.symbol} tends to form ${firstIon}+ ions and ${second.symbol} tends to form ${Math.abs(secondIon)}- ions, giving ${formula}.`,
            animation: kind === "oxide" ? "spark" : "crystal",
            inferred: true
          };
        }
      }

      if (nonmetals.has(a.symbol) && nonmetals.has(b.symbol)) {
        const delta = Math.abs((electronegativity[a.symbol] || 2) - (electronegativity[b.symbol] || 2));
        if (delta < 1.2) {
          const formula = a.symbol === "C" && b.symbol === "O" || a.symbol === "O" && b.symbol === "C" ? "CO2" : `${a.symbol}${b.symbol}`;
          return {
            formula,
            name: compoundName(a, b, "covalent"),
            note: `Rule prediction: two nonmetals usually form covalent compounds by sharing electrons.`,
            animation: "gas",
            inferred: true
          };
        }
      }

      return null;
    }

    function reactionForElements(a, b) {
      const key = pairKey(a.symbol, b.symbol);
      if (explosiveReactions[key]) return { ...explosiveReactions[key], explosive: true };
      return inferReaction(a, b);
    }

    function setMessage(title, body) {
      message.innerHTML = `<strong>${title}</strong>${body}`;
      hudMessage.innerHTML = `<strong>${title}</strong>${body}`;
    }

    function setAutoMessage(title, body) {
      autoMessage.innerHTML = `<strong>${title}</strong>${body}`;
      autoMessage.classList.remove("is-idle");
      hudMessage.innerHTML = `<strong>${title}</strong>${body}`;
    }

    function currentMission() {
      return missions[game.missionIndex % missions.length];
    }

    function loadMissionRankings() {
      try {
        const saved = window.localStorage?.getItem(RANKING_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.seconds === "number") : [];
      } catch {
        return [];
      }
    }

    function saveMissionRankings() {
      try {
        window.localStorage?.setItem(RANKING_STORAGE_KEY, JSON.stringify((game.rankings || []).slice(0, 30)));
      } catch {
        // Rankings are nice to have; the game should keep running if storage is blocked.
      }
    }

    function formatMissionTime(seconds) {
      const safeSeconds = Math.max(0, seconds || 0);
      const mins = Math.floor(safeSeconds / 60);
      const secs = Math.floor(safeSeconds % 60).toString().padStart(2, "0");
      const tenths = Math.floor((safeSeconds % 1) * 10);
      return `${mins}:${secs}.${tenths}`;
    }

    function currentMissionElapsed(t = performance.now()) {
      if (!game.missionStartedAt) return game.missionElapsed || 0;
      return Math.max(0, (t - game.missionStartedAt) / 1000);
    }

    function startMissionClock(t = performance.now()) {
      game.missionStartedAt = t;
      game.missionElapsed = 0;
      game.timeLeft = MISSION_TIME_LIMIT;
      game.lastTick = t;
    }

    function bestTimeForFormula(formula) {
      return (game.rankings || [])
        .filter((item) => item.formula === formula)
        .sort((a, b) => a.seconds - b.seconds)[0] || null;
    }

    function recordMissionRanking(mission, seconds) {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const entry = {
        id,
        formula: mission.formula,
        title: mission.title,
        seconds,
        completedAt: new Date().toISOString()
      };
      const rankings = [...(game.rankings || []), entry]
        .sort((a, b) => a.seconds - b.seconds)
        .slice(0, 30);
      game.rankings = rankings;
      game.lastRankingId = id;
      saveMissionRankings();
      return rankings.findIndex((item) => item.id === id) + 1;
    }

    function renderRankings() {
      if (!rankingList) return;
      const top = [...(game.rankings || [])].sort((a, b) => a.seconds - b.seconds).slice(0, 5);
      const key = top.map((item) => `${item.id}:${item.seconds}`).join("|") + `:${game.lastRankingId}`;
      if (game.rankingRenderKey === key) return;
      game.rankingRenderKey = key;
      rankingList.innerHTML = top.length
        ? top.map((item, index) => `<li class="${item.id === game.lastRankingId ? "is-new" : ""}"><span>#${index + 1} ${item.formula}</span><em>${formatMissionTime(item.seconds)}</em></li>`).join("")
        : "<li>No completed missions yet</li>";
    }

    function setCachedHtml(element, html) {
      if (!element || element.__lastHtml === html) return;
      element.__lastHtml = html;
      element.innerHTML = html;
    }

    function currentBossWeaknessKeys() {
      const phase = blackHole?.phaseIndex || 0;
      if (phase === 0) return ["H", "O"];
      if (phase === 1) return ["CO2", "H2O"];
      if (phase === 2) return ["NaCl"];
      return ["H", "O", "CO2", "NaCl", "H2O"];
    }

    function currentBossWeaknessText() {
      return currentBossWeaknessKeys().join(" / ");
    }

    function compactBossWeaknessText() {
      return currentBossWeaknessKeys().join("/");
    }

    function currentMissionSymbols() {
      return new Set((parseFormula(currentMission().formula) || [])
        .filter((item) => item.element)
        .map((item) => item.symbol));
    }

    function stationStoredSymbols() {
      return spaceStation?.stored?.map((item) => item.symbol) || [];
    }

    function stationHasSymbol(symbol) {
      return stationStoredSymbols().includes(symbol);
    }

    function stationCanBuildFormula(formula) {
      if (spaceStation?.products?.some((item) => item.formula === formula)) return true;
      if (findStationReactionPair(formula)) return true;
      const parsed = parseFormula(formula)?.filter((item) => item.element) || [];
      if (!parsed.length) return false;
      const counts = stationStoredSymbols().reduce((acc, symbol) => {
        acc[symbol] = (acc[symbol] || 0) + 1;
        return acc;
      }, {});
      return parsed.every((item) => (counts[item.symbol] || 0) >= item.count);
    }

    function stationHealthPercent() {
      if (!spaceStation) return 100;
      return Math.max(0, Math.round(spaceStation.health / spaceStation.maxHealth * 100));
    }

    function collectionEnergyForNode(node) {
      if (!node?.element) return 1;
      const symbol = node.element.symbol;
      const missionSymbols = currentMissionSymbols();
      const weaknessKeys = currentBossWeaknessKeys();
      const levelBonus = Math.floor((game.evolutionTier || 0) / 2);
      if (missionSymbols.has(symbol)) return 10 + levelBonus;
      if (weaknessKeys.includes(symbol)) return 8 + levelBonus;
      if (node.dangerousUntil > performance.now()) return 6;
      return 1;
    }

    function reactionEnergyForFormula(formula, wasNew) {
      const mission = currentMission();
      const weaknessKeys = currentBossWeaknessKeys();
      const levelBonus = Math.floor((game.evolutionTier || 0) / 2);
      if (formula === mission.formula) return 32 + game.streak * 6 + (wasNew ? 10 : 0) + levelBonus;
      if (weaknessKeys.includes(formula)) return 22 + (wasNew ? 8 : 0) + levelBonus;
      if (bossWeakness[formula]) return 14 + (wasNew ? 5 : 0);
      return wasNew ? 4 : 1;
    }

    function collectionTargetItems() {
      const mission = currentMission();
      const missionSymbols = [...currentMissionSymbols()];
      const weaknessKeys = currentBossWeaknessKeys();
      const items = [];
      missionSymbols.forEach((symbol) => items.push({ key: symbol, label: symbol, type: "mission" }));
      weaknessKeys.forEach((key) => {
        if (!items.some((item) => item.key === key)) {
          items.push({ key, label: key, type: key.length > 2 ? "compound" : "weakness" });
        }
      });
      return items.slice(0, 8).map((item) => ({
        ...item,
        collected: stationHasSymbol(item.key)
          || (item.type === "compound" && stationCanBuildFormula(item.key))
      }));
    }

    function updateGamePanel() {
      const mission = currentMission();
      const shipLevel = (game.evolutionTier || 0) + 1;
      const levelIndex = Math.min(levelNames.length - 1, shipLevel - 1);
      const targets = collectionTargetItems();
      missionName.textContent = targets.filter((item) => item.type === "mission").map((item) => item.label).join(" + ") || mission.formula;
      setCachedHtml(collectionTargets, targets.map((item) => `<span class="target-chip ${item.collected ? "is-collected" : ""} ${item.type}"><strong>${item.label}</strong><small>${item.type === "mission" ? "mission" : item.type === "compound" ? "combo" : "weak"}</small></span>`).join(""));
      const missionText = mission.hint.replace(new RegExp(`^Make\\s+${mission.formula}:\\s*`, "i"), "").replace(/[.。]\s*$/, "");
      missionHint.textContent = `Dock at station: ${mission.formula}. Weak: ${compactBossWeaknessText()}.`;
      scoreReadout.textContent = `${game.score} pts`;
      levelReadout.textContent = `L${shipLevel}`;
      streakReadout.textContent = `x${game.streak}`;
      timerReadout.textContent = `${Math.ceil(game.timeLeft)}s`;
      missionTimerReadout.textContent = formatMissionTime(currentMissionElapsed());
      const bestTime = bestTimeForFormula(mission.formula);
      bestTimeReadout.textContent = bestTime ? formatMissionTime(bestTime.seconds) : "--";
      missionProgress.style.width = `${Math.min(100, game.repairedParts.size / missions.length * 100)}%`;
      setCachedHtml(levelMap, levelNames.map((name, index) => `<span class="level-node ${index === levelIndex ? "is-active" : ""}" title="${name}">L${index + 1}</span>`).join(""));
      shipStatus.textContent = `Ship repair: ${game.repairedParts.size}/${missions.length} · rescues ${game.shipRescues}`;
      setCachedHtml(shipParts, missions.map((item) => `<span class="ship-part ${game.repairedParts.has(item.part) ? "is-fixed" : ""}">${item.partLabel}<br>${item.formula}</span>`).join(""));
      const bossHp = blackHole ? Math.max(0, Math.round(blackHole.health / blackHole.maxHealth * 100)) : 0;
      if (bossReadout) bossReadout.textContent = `${bossHp}%`;
      if (bossBar) bossBar.style.width = `${bossHp}%`;
      const bossActive = !!blackHole?.enraged;
      bossTopbar?.classList.toggle("is-hidden", !bossActive);
      if (bossTopReadout) bossTopReadout.textContent = `${bossHp}%`;
      if (bossTopBar) bossTopBar.style.width = `${bossHp}%`;
      if (bossTopName) bossTopName.textContent = bossActive ? "Monster Black Hole" : "";
      const riderName = spaceship?.rider?.name || "None";
      riderReadout.textContent = riderName;
      const cargo = spaceship?.cargo?.map((node) => node.element.symbol).join(" ") || "";
      cargoReadout.textContent = cargo || "Empty";
      const stationCounts = stationStoredSymbols().reduce((acc, symbol) => {
        acc[symbol] = (acc[symbol] || 0) + 1;
        return acc;
      }, {});
      const stationSummary = Object.entries(stationCounts).slice(-4).map(([symbol, count]) => `${symbol}${count > 1 ? `x${count}` : ""}`).join(" ");
      const productSummary = spaceStation?.products?.slice(-2).map((item) => item.formula).join(" ") || "";
      if (stationReadout) stationReadout.textContent = `${stationHealthPercent()}% | ${stationSummary || productSummary || "Empty"}`;
      const weaponLabel = (WEAPONS[selectedWeapon] || WEAPONS.bolt).label;
      weaponReadout.textContent = riderName === "Clark" && selectedWeapon === "laser" ? "Clark Laser" : riderName === "Bradley" && selectedWeapon === "megaboom" ? "Bradley Boom" : weaponLabel;
      const ufoHp = spaceship ? Math.max(0, Math.round(spaceship.health / spaceship.maxHealth * 100)) : 0;
      ufoReadout.textContent = `${ufoHp}%`;
      phaseReadout.textContent = blackHole
        ? blackHole.enraged ? "Chase" : `${blackHole.phaseIndex + 1}: ${bossPhaseNames[blackHole.phaseIndex]}`
        : "I";
      const upgrades = game.upgrades || { cargo: 0, hull: 0, weapon: 0, engine: 0 };
      upgradeReadout.textContent = `C${upgrades.cargo || 0} H${upgrades.hull || 0} W${upgrades.weapon || 0} E${upgrades.engine || 0} A${upgrades.magnet || 0} S${upgrades.shield || 0}`;
      skillPointReadout.textContent = `${game.skillPoints || 0} pts`;
      renderTechTree();
      const tier = game.evolutionTier || 0;
      const nextEnergy = energyNeededForEvolution();
      evolutionReadout.textContent = `Lv.${shipLevel} ${evolutionNames[Math.min(evolutionNames.length - 1, tier)]}`;
      energyReadout.textContent = tier >= evolutionNames.length - 1 ? "MAX" : `${Math.floor(game.energy)}/${nextEnergy}`;
      const energyPct = tier >= evolutionNames.length - 1 ? 100 : Math.max(0, Math.min(100, game.energy / nextEnergy * 100));
      evolutionLabel.textContent = tier >= evolutionNames.length - 1 ? `Lv.${shipLevel} MAX` : `Lv.${shipLevel} -> Lv.${shipLevel + 1}`;
      evolutionPercent.textContent = tier >= evolutionNames.length - 1 ? "MAX" : `${Math.floor(energyPct)}%`;
      evolutionBar.style.width = `${energyPct}%`;
      upgradeLine.textContent = game.lastUpgrade || `Weak: ${compactBossWeaknessText()}`;
      setCachedHtml(discoveryStrip, [...game.discovered].slice(-8).map((formula) => `<span class="discovery-chip">${formula}</span>`).join(""));
      kidsModeButton.classList.toggle("is-active", game.kidsMode);
      soundToggleButton.classList.toggle("is-active", game.sound);
      toolButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.tool === game.activeTool));
      weaponButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.weapon === selectedWeapon));
      renderRankings();
    }

    function startGame() {
      game.active = true;
      game.lastRankingId = "";
      startMissionClock(performance.now());
      updateGamePanel();
      setMessage("Mission started", `${currentMission().hint}`);
      playTone(660, 0.08);
    }

    function resetGame() {
      shots = [];
      energyOrbs = [];
      processingStation = false;
      stationReactionQueued = false;
      stationCompletionQueued = false;
      stationCompletionKey = "";
      game = {
        active: true,
        score: 0,
        level: 1,
        streak: 0,
        missionIndex: 0,
        completed: 0,
        repairedParts: new Set(),
        shipRescues: 0,
        upgrades: { cargo: 0, hull: 0, weapon: 0, engine: 0, magnet: 0, shield: 0 },
        evolutionTier: 0,
        energy: 0,
        skillPoints: 1,
        lastUpgrade: "",
        achievements: new Set(),
        rewardCards: new Set(),
        discovered: new Set(),
        levelGoal: 3,
        timeLeft: MISSION_TIME_LIMIT,
        missionStartedAt: 0,
        missionElapsed: 0,
        rankings: game.rankings || loadMissionRankings(),
        lastRankingId: game.lastRankingId || "",
        rankingRenderKey: "",
        lastTick: 0,
        kidsMode: game.kidsMode,
        sound: game.sound,
        activeTool: null,
        shieldUntil: 0
      };
      startMissionClock(performance.now());
      spaceStation = null;
      makeNodes();
      makeSpaceship();
      makeSpaceStation();
      makeAstronauts();
      makeBlackHole();
      updateGamePanel();
      updateCodex();
      setMessage("New game", `${currentMission().hint}`);
      playTone(520, 0.08);
    }

    function nextMissionCard() {
      game.missionIndex = (game.missionIndex + 1) % missions.length;
      game.streak = 0;
      game.lastRankingId = "";
      startMissionClock(performance.now());
      updateGamePanel();
      setMessage("New mission", `${currentMission().hint}`);
    }

    function useClarkHelp() {
      const mission = currentMission();
      const parsed = parseFormula(mission.formula)?.filter((item) => item.element) || [];
      const symbols = parsed.map((item) => item.symbol);
      setMessage("Clark's clue", symbols.length ? `Look for ${symbols.join(" + ")} to make ${mission.formula}.` : mission.hint);
      clarkSkillButton.classList.add("is-active");
      window.setTimeout(() => clarkSkillButton.classList.remove("is-active"), 700);
      playTone(760, 0.08);
    }

    function useBradleyShip() {
      const mission = currentMission();
      const parsed = parseFormula(mission.formula)?.filter((item) => item.element) || [];
      const first = nodes.find((node) => parsed.some((item) => item.symbol === node.element.symbol));
      if (first && spaceship) {
        spaceship.following = true;
        spaceship.targetX = first.x;
        spaceship.targetY = first.y;
        window.setTimeout(() => { if (!spaceshipPressed && spaceship) spaceship.following = false; }, 1500);
      }
      bradleySkillButton.classList.add("is-active");
      window.setTimeout(() => bradleySkillButton.classList.remove("is-active"), 700);
      setMessage("Bradley pilots", `The spaceship is heading toward ${mission.formula} ingredients.`);
      playTone(420, 0.1);
    }

    function toggleKidsMode() {
      game.kidsMode = !game.kidsMode;
      makeNodes();
      makeAstronauts();
      updateGamePanel();
      setMessage(game.kidsMode ? "Kids Mode on" : "Kids Mode off", game.kidsMode ? "Only common beginner elements are floating now." : "All elements are back in the lab.");
    }

    function setTool(tool) {
      game.activeTool = game.activeTool === tool ? null : tool;
      if (tool === "shield" && game.activeTool === "shield") {
        game.shieldUntil = performance.now() + 9000;
        setAutoMessage("Shield on", "Hazards are blocked for a few seconds.");
      }
      updateGamePanel();
      playTone(560, 0.05);
    }

    function updateCodex() {
      const formulas = [...game.discovered];
      codexGrid.innerHTML = formulas.length
        ? formulas.map((formula) => `<div class="codex-entry"><strong>${formula}</strong>${discoveryFacts[formula] || "A new compound discovered in the lab."}</div>`).join("")
        : `<div class="codex-entry"><strong>No discoveries yet</strong>Complete missions to fill the codex.</div>`;
    }

    function playTone(frequency, duration = 0.08) {
      if (!game.sound) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audio = playTone.audio || new AudioContext();
      playTone.audio = audio;
      if (audio.state === "suspended") audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + duration + 0.02);
    }

    function updateGameTimer(t) {
      if (!game.active) return;
      if (!game.missionStartedAt) startMissionClock(t);
      game.missionElapsed = currentMissionElapsed(t);
      game.timeLeft = Math.max(0, MISSION_TIME_LIMIT - game.missionElapsed);
      if (game.timeLeft <= 0) {
        game.streak = 0;
        startMissionClock(t);
        setAutoMessage("Try again", "Time ran out, but nothing bad happens. Same mission, fresh timer.");
        playTone(240, 0.12);
      }
      if (game.activeTool === "shield" && game.shieldUntil <= t) game.activeTool = null;
    }

    function completeStationMission(mission, formula, x, y, wasNew) {
      const now = performance.now();
      const elapsed = currentMissionElapsed(now);
      const rank = recordMissionRanking(mission, elapsed);
      game.streak += 1;
      game.completed += 1;
      game.repairedParts.add(mission.part);
      const speedBonus = Math.max(0, Math.round((MISSION_TIME_LIMIT - elapsed) * 1.5));
      const earned = mission.points + game.streak * 25 + speedBonus + (wasNew ? 50 : 0);
      game.score += earned;

      if (x != null && y != null) {
        addSimpleEffect("spark", x, y, now);
        addScoreEffect(x, y - 20, `+${earned}`, now);
        addScoreEffect(x, y - 42, formatMissionTime(elapsed), now);
        grantEnergy(reactionEnergyForFormula(formula, wasNew), "target reaction", x, y, now);
      }

      game.missionIndex = (game.missionIndex + 1) % missions.length;
      startMissionClock(now);

      const resultText = `${mission.partLabel} fixed in ${formatMissionTime(elapsed)}. Rank #${rank}.`;
      if (game.repairedParts.size >= missions.length) {
        game.shipRescues += 1;
        game.level = Math.min(levelNames.length, (game.evolutionTier || 0) + 1);
        game.repairedParts = new Set();
        awardUfoUpgrade();
        setAutoMessage("Ship rescued", `${resultText} Clark and Bradley repaired the UFO. Next: ${currentMission().hint}`);
        playTone(880, 0.12);
        playTone(1180, 0.14);
      } else {
        setAutoMessage("Mission complete", `${resultText} Next mission: ${currentMission().hint}`);
        playTone(880, 0.1);
      }
    }

    function scheduleStationMissionCompletion(mission, formula, x, y, wasNew) {
      const key = `${game.missionIndex}:${formula}`;
      if (stationCompletionQueued && stationCompletionKey === key) return;
      stationCompletionQueued = true;
      stationCompletionKey = key;
      window.setTimeout(() => {
        stationCompletionQueued = false;
        stationCompletionKey = "";
        if (currentMission().formula !== formula) return;
        if (wasNew) showRewardCard(formula);
        if (achievementDefs[formula]) unlockAchievement(formula, performance.now());
        completeStationMission(mission, formula, x, y, wasNew);
        updateGamePanel();
        updateCodex();
      }, 0);
    }

    function recordCompound(formula, x, y, source = "field") {
      addShockwave(x, y, 52, "#67e8f9", performance.now());
      if (!formula) return;
      const mission = currentMission();
      const wasNew = !game.discovered.has(formula);
      game.discovered.add(formula);
      if (game.active && formula === mission.formula && source === "station") {
        scheduleStationMissionCompletion(mission, formula, x, y, wasNew);
        return;
      }
      if (wasNew) showRewardCard(formula);
      if (achievementDefs[formula]) unlockAchievement(formula, performance.now());
      if (bossWeakness[formula] && x != null && y != null) {
        applyBlackHoleWeakness(formula, x, y, performance.now(), "compound");
      }

      if (!game.active) {
        updateGamePanel();
        updateCodex();
        return;
      }

      if (formula === mission.formula) {
        game.score += wasNew ? 25 : 5;
        if (x != null && y != null) addScoreEffect(x, y - 20, wasNew ? "+25" : "+5", performance.now());
        setAutoMessage("Good reaction", `${formula} discovered. Put the needed elements into the space station to finish the mission.`);
        playTone(620, 0.07);
      } else if (wasNew) {
        game.score += 25;
        if (x != null && y != null) {
          const now = performance.now();
          addScoreEffect(x, y - 20, "+25", now);
          const energy = reactionEnergyForFormula(formula, wasNew);
          if (energy > 4) grantEnergy(energy, "bonus formula", x, y, now);
        }
        setAutoMessage("New discovery", `${formula} added to the collection.`);
        playTone(620, 0.07);
      } else {
        game.score += 5;
      }

      updateGamePanel();
      updateCodex();
    }

    function showRewardCard(formula) {
      if (game.rewardCards.has(formula)) return;
      game.rewardCards.add(formula);
      const fact = discoveryFacts[formula] || `${formula} discovered.`;
      rewardToast.innerHTML = `<strong>New Discovery: ${formula}</strong>${fact}`;
      rewardToast.classList.add("is-visible");
      window.clearTimeout(showRewardCard.timer);
      showRewardCard.timer = window.setTimeout(() => rewardToast.classList.remove("is-visible"), 3600);
    }

    function unlockAchievement(key, t = performance.now()) {
      if (!achievementDefs[key] || game.achievements.has(key)) return;
      game.achievements.add(key);
      rewardToast.innerHTML = `<strong>Achievement Unlocked</strong>${achievementDefs[key]}`;
      rewardToast.classList.add("is-visible");
      window.clearTimeout(showRewardCard.timer);
      showRewardCard.timer = window.setTimeout(() => rewardToast.classList.remove("is-visible"), 3200);
      grantEnergy(10, "achievement", spaceship?.x || width * 0.5, spaceship?.y || height * 0.5, t);
    }

    function awardUfoUpgrade() {
      game.skillPoints = (game.skillPoints || 0) + 1;
      game.lastUpgrade = `Rescue: +1 tech point`;
      grantEnergy(45, "rescue", spaceship.x, spaceship.y, performance.now());
    }

    function energyNeededForEvolution() {
      const tier = game.evolutionTier || 0;
      return 70 + tier * 42 + Math.floor(Math.pow(tier, 1.35) * 18);
    }

    function grantEnergy(amount, reason, x, y, t = performance.now()) {
      if ((game.evolutionTier || 0) >= evolutionNames.length - 1) return;
      game.energy += amount;
      if (x != null && y != null) addScoreEffect(x, y - 30, `+${Math.round(amount)} energy`, t);
      if (reason !== "energy orb" && x != null && y != null && amount >= 12) spawnEnergyOrbs(x, y, Math.min(5, Math.max(2, Math.round(amount / 14))), 4, t);
      if (energyGrantDepth > 0) return;
      energyGrantDepth += 1;
      try {
        if (game.evolutionTier < evolutionNames.length - 1 && game.energy >= energyNeededForEvolution()) {
          game.energy -= energyNeededForEvolution();
          evolveUfo(reason, t);
        }
      } finally {
        energyGrantDepth -= 1;
      }
    }

    function spawnEnergyOrbs(x, y, count = 3, value = 6, t = performance.now()) {
      for (let i = 0; i < count; i += 1) {
        const angle = randomBetween(0, Math.PI * 2);
        energyOrbs.push({
          x,
          y,
          vx: Math.cos(angle) * randomBetween(1.2, 3.1),
          vy: Math.sin(angle) * randomBetween(1.2, 3.1),
          value,
          born: t,
          phase: randomBetween(0, Math.PI * 2)
        });
      }
    }

    function updateEnergyOrbs(t) {
      if (!spaceship) return;
      energyOrbs.forEach((orb) => {
        const dx = spaceship.x - orb.x;
        const dy = spaceship.y - orb.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance < 190) {
          const pull = (1 - distance / 190) * 0.36;
          orb.vx += dx / distance * pull;
          orb.vy += dy / distance * pull;
        }
        orb.x += orb.vx;
        orb.y += orb.vy + Math.sin(t * 0.006 + orb.phase) * 0.12;
        orb.vx *= 0.985;
        orb.vy *= 0.985;
        if (distance < spaceship.radius + 18) {
          orb.collected = true;
          grantEnergy(orb.value, "energy orb", orb.x, orb.y, t);
        }
      });
      energyOrbs = energyOrbs.filter((orb) => !orb.collected && t - orb.born < 12000);
    }

    const techCatalog = [
      { type: "cargo", title: "Cargo Bay", body: "+1 element slot", max: 8 },
      { type: "weapon", title: "Weapon Core", body: "+damage", max: 8, minLevel: 2 },
      { type: "hull", title: "Hull Plating", body: "+20 hull", max: 8, minLevel: 2 },
      { type: "engine", title: "Ion Engine", body: "+speed", max: 8, minLevel: 3 },
      { type: "magnet", title: "Auto Collector", body: "+pickup range", max: 6, minLevel: 4, requires: { cargo: 2 } },
      { type: "shield", title: "Panic Shield", body: "-damage", max: 6, minLevel: 5, requires: { hull: 2 } }
    ];

    function isTechLocked(tech) {
      if (tech.minLevel && ((game.evolutionTier || 0) + 1) < tech.minLevel) return true;
      if (!tech.requires) return false;
      return Object.entries(tech.requires).some(([type, requiredLevel]) => (game.upgrades[type] || 0) < requiredLevel);
    }

    function techRequirementText(tech) {
      const parts = [];
      if (tech.minLevel && ((game.evolutionTier || 0) + 1) < tech.minLevel) parts.push(`Need Lv.${tech.minLevel}`);
      if (tech.requires) {
        Object.entries(tech.requires).forEach(([type, requiredLevel]) => parts.push(`Need ${type} ${requiredLevel}`));
      }
      return parts.join(" + ");
    }

    function renderTechTree() {
      const points = game.skillPoints || 0;
      const html = techCatalog.map((tech) => {
        const level = game.upgrades[tech.type] || 0;
        const maxed = level >= tech.max;
        const locked = isTechLocked(tech);
        const unavailable = points <= 0 && !maxed && !locked;
        const body = maxed ? "Maxed" : locked ? techRequirementText(tech) : unavailable ? "Need tech point" : tech.body;
        return (
          `<button class="tech-node ${maxed ? "is-maxed" : ""} ${locked ? "is-locked" : ""} ${unavailable ? "is-unavailable" : ""}" type="button" data-tech="${tech.type}">` +
          `<strong>${tech.title} ${level}/${tech.max}</strong><span>${body}</span></button>`
        );
      }).join("");
      setCachedHtml(techTree, html);
    }

    function spendTechPoint(type) {
      const tech = techCatalog.find((item) => item.type === type);
      if (!tech) return;
      const level = game.upgrades[type] || 0;
      if (level >= tech.max) {
        setAutoMessage("Tech maxed", `${tech.title} is already fully upgraded.`);
        return;
      }
      if (isTechLocked(tech)) {
        setAutoMessage("Tech locked", `${tech.title}: ${techRequirementText(tech)}.`);
        return;
      }
      if ((game.skillPoints || 0) <= 0) {
        setAutoMessage("Need tech point", "Complete missions, rescue the UFO, or level up to earn tech points.");
        return;
      }
      game.skillPoints -= 1;
      game.upgrades[type] = level + 1;
      applyTechUpgrade(type);
      game.lastUpgrade = `${tech.title} ${game.upgrades[type]}/${tech.max}`;
      setAutoMessage("Tech upgraded", `${tech.title}: ${tech.body}.`);
      updateGamePanel();
    }

    function applyTechUpgrade(type) {
      if (!spaceship) return;
      if (type === "cargo" || type === "magnet") {
        spaceship.cargoCapacity = 4 + (game.upgrades.cargo || 0) + (game.evolutionTier || 0) + (game.upgrades.magnet || 0);
      } else if (type === "hull") {
        spaceship.maxHealth = 100 + (game.upgrades.hull || 0) * 20 + (game.evolutionTier || 0) * 15;
        spaceship.health = spaceship.maxHealth;
      }
    }

    function evolveUfo(reason, t = performance.now()) {
      if ((game.evolutionTier || 0) >= evolutionNames.length - 1) return;
      game.evolutionTier += 1;
      const tier = game.evolutionTier;
      const reward = evolutionRewards[tier] || { title: "Tech point", text: "new upgrade point", points: 1 };
      game.skillPoints = (game.skillPoints || 0) + reward.points;
      game.level = Math.min(levelNames.length, tier + 1);
      if (spaceship) {
        spaceship.cargoCapacity = 4 + (game.upgrades.cargo || 0) + tier + (game.upgrades.magnet || 0);
        spaceship.maxHealth = 100 + (game.upgrades.hull || 0) * 20 + tier * 15;
        spaceship.health = spaceship.maxHealth;
        effects.push({ type: "bump", x: spaceship.x, y: spaceship.y, born: t });
        addExplosionEffect(spaceship.x, spaceship.y, t);
      }
      game.lastUpgrade = `Lv.${tier + 1}: ${evolutionNames[tier]}`;
      unlockAchievement("evolution", t);
      setAutoMessage("UFO evolved", `Lv.${tier + 1} ${evolutionNames[tier]} unlocked: ${reward.text}.`);
      playTone(980 + tier * 90, 0.16);
      updateGamePanel();
    }

    // -- Viewport handling --------------------------------------------------
    // This used to rebuild the entire world on every resize, which meant that on
    // an iPad simply rotating the device -- or Safari hiding its address bar
    // mid-scroll -- wiped the player's elements, cargo and progress. Now the
    // world is built once and merely rescaled afterwards.
    let worldBuilt = false;

    function buildWorld() {
      makeNodes();
      makeSpaceship();
      makeSpaceStation();
      makeAstronauts();
      makeBlackHole();
      makeTornado();
      makeTsunami();
    }

    function rescalePoint(entity, scaleX, scaleY) {
      if (!entity) return;
      if (typeof entity.x === "number") entity.x *= scaleX;
      if (typeof entity.y === "number") entity.y *= scaleY;
      if (typeof entity.targetX === "number") entity.targetX *= scaleX;
      if (typeof entity.targetY === "number") entity.targetY *= scaleY;
      if (typeof entity.homeX === "number") entity.homeX *= scaleX;
      if (typeof entity.homeY === "number") entity.homeY *= scaleY;
    }

    function rescaleWorld(scaleX, scaleY) {
      nodes.forEach((node) => rescalePoint(node, scaleX, scaleY));
      astronauts.forEach((astronaut) => rescalePoint(astronaut, scaleX, scaleY));
      meteors.forEach((meteor) => rescalePoint(meteor, scaleX, scaleY));
      miniBlackHoles.forEach((hole) => rescalePoint(hole, scaleX, scaleY));
      energyOrbs.forEach((orb) => rescalePoint(orb, scaleX, scaleY));
      shots.forEach((shot) => rescalePoint(shot, scaleX, scaleY));
      effects.forEach((effect) => rescalePoint(effect, scaleX, scaleY));
      compounds.forEach((compound) => rescalePoint(compound, scaleX, scaleY));
      [spaceship, spaceStation, organizer, blackHole, tornado, tsunami]
        .forEach((entity) => rescalePoint(entity, scaleX, scaleY));
    }

    function applyViewportSize() {
      const previousWidth = width;
      const previousHeight = height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!worldBuilt) {
        buildWorld();
        worldBuilt = true;
        return;
      }
      if (previousWidth > 0 && previousHeight > 0 && (previousWidth !== width || previousHeight !== height)) {
        rescaleWorld(width / previousWidth, height / previousHeight);
      }
    }

    // Kept as the public name the rest of the file (and startGame/resetGame) uses.
    function resize() {
      applyViewportSize();
    }

    // iOS fires resize repeatedly while the address bar slides away; coalesce
    // those into one layout pass on the next frame.
    let resizePending = false;
    function requestResize() {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        resizePending = false;
        applyViewportSize();
      });
    }

    function makeSpaceship() {
      spaceship = {
        x: width * 0.68,
        y: height * 0.38,
        vx: 1.35,
        vy: 0.72,
        angle: 0,
        wobble: randomBetween(0, Math.PI * 2),
        radius: 48,
        targetX: width * 0.68,
        targetY: height * 0.38,
        following: false,
        keyboardControl: false,
        rider: null,
        cargo: [],
        cargoCapacity: 4 + (game.upgrades?.cargo || 0) + (game.evolutionTier || 0) + (game.upgrades?.magnet || 0),
        tractorActive: false,
        tractorAnim: 0,
        tractorRange: 350,
        tractorAngle: Math.PI * 0.2,
        lastBumpAt: 0,
        lastShotAt: 0,
        health: 100,
        maxHealth: 100 + (game.upgrades?.hull || 0) * 20 + (game.evolutionTier || 0) * 15,
        lastDamageAt: 0,
        dodgeUntil: 0
      };
      spaceship.health = spaceship.maxHealth;
    }

    function makeSpaceStation() {
      const stored = spaceStation?.stored || [];
      const products = spaceStation?.products || [];
      const healthRatio = spaceStation ? Math.max(0.25, spaceStation.health / spaceStation.maxHealth) : 1;
      const maxHealth = 220;
      spaceStation = {
        x: Math.max(150, Math.min(width - 460, width * 0.2)),
        y: Math.max(210, Math.min(height - 160, height * 0.68)),
        radius: 94,
        dockRadius: 188,
        phase: randomBetween(0, Math.PI * 2),
        stored,
        products,
        capacity: 18,
        maxHealth,
        health: Math.round(maxHealth * healthRatio),
        pulseUntil: 0,
        lastDamageAt: 0,
        lastThreatAt: 0
      };
    }

    function makeAstronauts() {
      astronauts = [
        {
          name: "Clark",
          initial: "C",
          color: "#2aa8d8",
          x: width * 0.38,
          y: height * 0.34,
          vx: 0.42,
          vy: 0.28,
          phase: randomBetween(0, Math.PI * 2),
          targetIndex: 0,
          nextLookAt: 0,
          lookAngle: 0,
          holding: null,
          partner: null
        },
        {
          name: "Bradley",
          initial: "B",
          color: "#e85d4f",
          x: width * 0.68,
          y: height * 0.56,
          vx: -0.36,
          vy: 0.32,
          phase: randomBetween(0, Math.PI * 2),
          targetIndex: Math.floor(nodes.length / 2),
          nextLookAt: 0,
          lookAngle: 0,
          holding: null,
          partner: null
        }
      ];
    }

    function makeOrganizer() {
      organizer = {
        name: "Mendeleev",
        x: width * 0.5,
        y: height * 0.2,
        vx: 0.24,
        vy: 0.18,
        phase: randomBetween(0, Math.PI * 2),
        dreamPulse: 0,
        lastMessageAt: 0
      };
    }

    function makeBlackHole() {
      miniBlackHoles = [];
      blackHole = {
        x: width * 0.24,
        y: height * 0.42,
        vx: 0.78,
        vy: -0.46,
        baseRadius: 34,
        radius: 34,
        baseInfluence: 228,
        influence: 228,
        eatenCount: 0,
        phase: randomBetween(0, Math.PI * 2),
        lastSparkAt: 0,
        health: 180,
        maxHealth: 180,
        hurtUntil: 0,
        swallowed: [],
        lastEatAt: 0,
        phaseIndex: 0,
        lastPhaseAt: 0,
        lastMiniSpawnAt: 0,
        enraged: false,
        enrageThreshold: BLACK_HOLE_BOSS_EATEN_THRESHOLD,
        enrageAt: 0,
        lastEnrageMessageAt: 0,
        maxTrapped: 100
      };
    }

    function makeTornado() {
      tornado = {
        x: width * 0.52,
        y: height * 0.42,
        vx: -0.7,
        vy: 0.42,
        radius: 26,
        influence: 148,
        phase: randomBetween(0, Math.PI * 2),
        lastSparkAt: 0
      };
    }

    function makeTsunami() {
      tsunami = {
        x: -180,
        y: height * 0.64,
        speed: 2.35,
        height: 130,
        phase: randomBetween(0, Math.PI * 2),
        captured: [],
        lastSplashAt: 0,
        lastCollapseAt: 0
      };
    }

    function makeNodes() {
      const availableElements = game.kidsMode ? elements.filter((element) => kidsElements.has(element.symbol)) : elements;
      const count = lowPowerMode() && !game.kidsMode ? Math.min(84, availableElements.length) : availableElements.length;
      nodes = Array.from({ length: count }, (_, index) => {
        const element = availableElements[Math.floor(index * availableElements.length / count) % availableElements.length];
        const point = randomElementPoint();
        return {
          id: `${element.symbol}-${index}-${Math.random().toString(16).slice(2)}`,
          x: point.x,
          y: point.y,
          size: randomBetween(32, 42),
          vx: randomBetween(-0.42, 0.42),
          vy: randomBetween(-0.38, 0.38),
          phase: randomBetween(0, Math.PI * 2),
          element,
          selected: false
        };
      });
      selected = [];
      compounds = [];
      effects = [];
      shots = [];
      reactionCooldowns = new Map();
      lastAutoReactionAt = 0;
      updateSlots();
    }

    function updateSlots() {
      slotA.textContent = selected[0] ? selected[0].element.symbol : "slot A";
      slotB.textContent = selected[1] ? selected[1].element.symbol : "slot B";
    }

    function electronShells(atomicNumber) {
      const capacities = [2, 8, 18, 32, 32, 18, 8];
      let remaining = atomicNumber;
      const shells = [];
      capacities.forEach((capacity) => {
        if (remaining <= 0) return;
        const count = Math.min(capacity, remaining);
        shells.push(count);
        remaining -= count;
      });
      if (remaining > 0) shells.push(remaining);
      return shells;
    }

    function atomModelMarkup(element, color) {
      const shells = electronShells(element.n);
      const orbitMarkup = shells.map((_, index) => `<i class="orbit" style="--i: ${index}"></i>`).join("");
      const electronMarkup = shells.map((count, shellIndex) => {
        const radius = 15 + shellIndex * 10;
        const visible = Math.min(count, 16);
        return Array.from({ length: visible }, (_, electronIndex) => {
          const angle = (360 / visible) * electronIndex + shellIndex * 18;
          return `<i class="electron" style="--angle: ${angle}deg; --radius: ${radius}px"></i>`;
        }).join("");
      }).join("");
      const shellLabels = shells.map((count, index) => `${["K", "L", "M", "N", "O", "P", "Q"][index] || `S${index + 1}`}:${count}`).join(" · ");
      return `
        <div class="atom-preview" style="--electron-color: ${color}; --nucleus-color: ${color}">
          <div class="atom-model">
            ${orbitMarkup}
            ${electronMarkup}
            <i class="nucleus">${element.symbol}</i>
          </div>
          <div class="atom-notes">
            <b>Atom view</b><br>
            Protons: ${element.n}<br>
            Electrons: ${element.n}<br>
            Shells: ${shellLabels}
          </div>
        </div>
      `;
    }

    function setActiveFamily(family) {
      activeFamily = activeFamily === family ? null : family;
      familyButtons.forEach((button) => {
        const active = button.dataset.family === activeFamily;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    function setHazardActive(name, active) {
      hazards[name] = active;
      if (name === "blackHole" && active && !blackHole) makeBlackHole();
      if (name === "tornado" && active && !tornado) makeTornado();
      if (name === "meteor" && active && !meteors.length) spawnMeteor(performance.now());
      if (name === "tsunami" && active && !tsunami) makeTsunami();
      if (name === "tsunami" && !active) collapseTsunami(performance.now(), true);

      hazardButtons.forEach((button) => {
        const isActive = hazards[button.dataset.hazard];
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    function elementBySymbol(symbol) {
      return elements.find((element) => element.symbol.toLowerCase() === symbol.toLowerCase());
    }

    function parseFormula(formula) {
      const clean = formula.replace(/\s+/g, "");
      const parts = [...clean.matchAll(/([A-Z][a-z]?)(\d*)/g)];
      if (!parts.length || parts.map((part) => part[0]).join("") !== clean) return null;
      return parts.map((part) => ({
        symbol: part[1],
        count: part[2] ? Number(part[2]) : 1,
        element: elementBySymbol(part[1])
      }));
    }

    function prettyElements(parsed) {
      return parsed.map((item) => {
        const name = item.element ? item.element.name : "unknown element";
        return `${item.symbol}${item.count > 1 ? ` x ${item.count}` : ""} (${name})`;
      }).join(", ");
    }

    function lookupSubstance(rawValue) {
      const result = resolveSubstance(rawValue);
      const value = result.value;
      if (!value) {
        lookupResult.textContent = "Enter a substance name or formula to identify its elements.";
        return;
      }

      if (result.error === "parse") {
        lookupResult.innerHTML = `I do not know <strong>${value}</strong> yet. Try water, salt, rust, CO2, NaCl, 氧气, or 二氧化碳.`;
        return;
      }

      if (result.unknown.length) {
        lookupResult.innerHTML = `<strong>${result.formula}</strong> contains symbols I have not loaded yet: ${result.unknown.map((item) => item.symbol).join(", ")}.`;
        return;
      }

      const displayName = result.direct ? result.direct.name : "formula input";
      lookupResult.innerHTML = `<strong>${displayName}: ${result.formula}</strong><br>Elements: ${prettyElements(result.parsed)}.`;

      const firstFamily = result.parsed[0]?.element?.family;
      if (firstFamily) {
        activeFamily = firstFamily;
        familyButtons.forEach((button) => {
          const active = button.dataset.family === activeFamily;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });
      }
    }

    function resolveSubstance(rawValue) {
      const value = rawValue.trim();
      if (!value) return { value: "", parsed: null, unknown: [] };
      const direct = substanceLookup[value.toLowerCase()] || substanceLookup[value];
      const formula = direct ? direct.formula : value;
      const parsed = parseFormula(formula);
      if (!parsed) return { value, direct, formula, parsed: null, unknown: [], error: "parse" };
      return {
        value,
        direct,
        formula,
        parsed,
        unknown: parsed.filter((item) => !item.element)
      };
    }

    function parseElementPair(rawValue) {
      const pieces = rawValue.trim().split(/[\s,+-]+/).filter(Boolean);
      if (pieces.length !== 2) return null;
      const a = elementBySymbol(pieces[0]);
      const b = elementBySymbol(pieces[1]);
      return a && b ? [a, b] : null;
    }

    function updateTooltip() {
      if (!hoveredNode) {
        tooltip.classList.remove("is-visible");
        tooltip.setAttribute("aria-hidden", "true");
        return;
      }

      const element = hoveredNode.element;
      const color = familyColors[element.family];
      tooltip.innerHTML = `<strong>${element.name} (${element.symbol})</strong>${element.info}<span>Atomic number ${element.n} · ${element.family}</span>${atomModelMarkup(element, color)}`;
      tooltip.style.borderColor = color;
      tooltip.style.left = `${Math.max(132, Math.min(width - 132, hoveredNode.x))}px`;
      tooltip.style.top = `${Math.max(118, hoveredNode.y - hoveredNode.size * 0.8)}px`;
      tooltip.classList.add("is-visible");
      tooltip.setAttribute("aria-hidden", "false");
    }

    function roundRect(x, y, w, h, radius) {
      const r = Math.min(radius, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function updateNodes(t) {
      updateSpaceship(t);
      updateAstronauts(t);
      const shielded = game.shieldUntil > t;
      if (hazards.blackHole && !shielded) updateBlackHole(t);
      if (hazards.tornado && !shielded) updateTornado(t);
      if (hazards.meteor && !shielded) updateMeteors(t);
      else meteors = meteors.filter((meteor) => t - meteor.born < 1400);
      if (hazards.tsunami && !shielded) updateTsunami(t);
      const blockedRects = uiBlockRects(0);

      nodes.forEach((node) => {
        if (node.heldByUfo) {
          node.vx = spaceship ? spaceship.vx : 0;
          node.vy = spaceship ? spaceship.vy : 0;
          return;
        }

        if (node.trappedByTsunami || node.heldByAstronaut || node.swallowedByBlackHole) {
          node.vx *= 0.4;
          node.vy *= 0.4;
          keepNodeOutOfUi(node, blockedRects);
          return;
        }

        if (hoveredNode && hoveredNode.id === node.id) {
          node.vx *= 0.78;
          node.vy *= 0.78;
          return;
        }

        node.x += node.vx + Math.sin(t * 0.0008 + node.phase) * 0.08;
        node.y += node.vy + Math.cos(t * 0.0007 + node.phase) * 0.08;

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance < 130) {
            const force = (1 - distance / 130) * 0.75;
            node.vx += (dx / distance) * force * 0.035;
            node.vy += (dy / distance) * force * 0.035;
          }
          if (game.activeTool === "magnet" && metalLike(node.element) && distance < 280) {
            const pull = (1 - distance / 280) * 0.24;
            node.vx -= (dx / distance) * pull;
            node.vy -= (dy / distance) * pull;
          }
          if (game.activeTool === "net" && distance < 92) {
            node.vx -= (dx / distance) * 0.18;
            node.vy -= (dy / distance) * 0.18;
          }
        }

        applyBlackHoleEjectionBoost(node, t);
        keepNodeOutOfUi(node, blockedRects);
        if (node.x < 32 || node.x > width - 32) node.vx *= -1;
        if (node.y < 86 || node.y > height - 34) node.vy *= -1;
        node.x = Math.max(32, Math.min(width - 32, node.x));
        node.y = Math.max(86, Math.min(height - 34, node.y));
        node.vx *= 0.996;
        node.vy *= 0.996;
        if (game.activeTool === "freeze") {
          node.vx *= 0.82;
          node.vy *= 0.82;
        }
        if (Math.abs(node.vx) < 0.12) node.vx += Math.sin(t * 0.001 + node.phase) * 0.006;
        if (Math.abs(node.vy) < 0.12) node.vy += Math.cos(t * 0.001 + node.phase) * 0.006;
      });

      // Neighbour forces. The reaction lookup used to run for every one of the
      // ~6,900 pairs on every step, allocating a fresh object each time, even
      // though nothing at all happens past 132px. Distance now gates the lookup,
      // and the result comes from the same memo table drawBonds uses.
      const SEPARATION_RANGE = 44;
      const ATTRACTION_RANGE = 132;
      const ATTRACTION_RANGE_SQUARED = ATTRACTION_RANGE * ATTRACTION_RANGE;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        if (a.heldByAstronaut) continue;
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          if (b.heldByAstronaut) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= ATTRACTION_RANGE_SQUARED) continue;
          const distance = Math.max(1, Math.sqrt(distanceSquared));
          if (distance < SEPARATION_RANGE) {
            const push = (SEPARATION_RANGE - distance) * 0.003;
            a.vx -= dx / distance * push;
            a.vy -= dy / distance * push;
            b.vx += dx / distance * push;
            b.vy += dy / distance * push;
          } else if (!a.selected && !b.selected && bondStyleFor(a.element, b.element)) {
            const pull = (ATTRACTION_RANGE - distance) * 0.00011;
            a.vx += dx / distance * pull;
            a.vy += dy / distance * pull;
            b.vx -= dx / distance * pull;
            b.vy -= dy / distance * pull;
          }
        }
      }

      compounds.forEach((compound) => {
        compound.x += compound.vx;
        compound.y += compound.vy + Math.sin(t * 0.002 + compound.phase) * 0.06;
        if (compound.x < 60 || compound.x > width - 60) compound.vx *= -1;
        if (compound.y < 120 || compound.y > height - 70) compound.vy *= -1;
      });
    }

    function updateAstronauts(t) {
      if (!astronauts.length) makeAstronauts();
      if (!nodes.length) return;

      astronauts.forEach((astronaut, index) => {
        if (astronaut.ridingUfo) {
          const seat = index === 0 ? -22 : 22;
          astronaut.x = spaceship.x + seat;
          astronaut.y = spaceship.y - 52 + Math.sin(t * 0.006 + astronaut.phase) * 2;
          astronaut.vx = spaceship.vx;
          astronaut.vy = spaceship.vy;
          astronaut.lookAngle = spaceship.angle;
          if (t > astronaut.rideUntil) leaveUfo(astronaut, t);
          return;
        }

        if (astronaut.holding && !nodes.includes(astronaut.holding)) {
          astronaut.holding = null;
          astronaut.partner = null;
        }
        if (astronaut.partner && !nodes.includes(astronaut.partner)) astronaut.partner = null;

        if (!astronaut.holding && t > astronaut.nextLookAt) {
          astronaut.targetIndex = (astronaut.targetIndex + 7 + index * 5) % nodes.length;
          astronaut.nextLookAt = t + randomBetween(2200, 4200);
        }

        let target = astronaut.holding ? astronaut.partner : nodes[astronaut.targetIndex % nodes.length];
        if (!astronaut.holding && (!target || !canAstronautUse(target))) {
          target = findPickupElement(index);
          if (target) astronaut.targetIndex = nodes.indexOf(target);
        }

        if (!astronaut.holding && target && canAstronautUse(target)) {
          const grabDistance = Math.hypot(target.x - astronaut.x, target.y - astronaut.y);
          if (grabDistance < 54) {
            pickupElement(astronaut, target, t);
            target = astronaut.partner || target;
          }
        }

        if (!spaceship.rider && !astronaut.holding && t > (astronaut.boardCooldownUntil || 0) && Math.hypot(spaceship.x - astronaut.x, spaceship.y - astronaut.y) < 82) {
          boardUfo(astronaut, t);
          return;
        }

        if (astronaut.holding) {
          if (!astronaut.partner || !canAstronautUse(astronaut.partner) || !reactionForElements(astronaut.holding.element, astronaut.partner.element)) {
            astronaut.partner = findReactionPartner(astronaut.holding);
          }
          target = astronaut.partner || astronaut.holding;
        }

        const desiredX = target
          ? target.x + (astronaut.holding ? (index === 0 ? -54 : 54) : index === 0 ? -72 : 72) + Math.sin(t * 0.001 + astronaut.phase) * 24
          : width * (index === 0 ? 0.38 : 0.68);
        const desiredY = target
          ? target.y - (astronaut.holding ? 28 : 54) + Math.cos(t * 0.0012 + astronaut.phase) * 22
          : height * 0.45;
        const dx = desiredX - astronaut.x;
        const dy = desiredY - astronaut.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const speed = Math.min(2.4, Math.max(0.6, distance * 0.018));

        astronaut.vx += ((dx / distance) * speed - astronaut.vx) * 0.035;
        astronaut.vy += ((dy / distance) * speed - astronaut.vy) * 0.035;

        nodes.forEach((node) => {
          if (node === astronaut.holding) return;
          const nx = astronaut.x - node.x;
          const ny = astronaut.y - node.y;
          const gap = Math.max(1, Math.hypot(nx, ny));
          if (gap < node.size * 0.68 + 42) {
            const push = (node.size * 0.68 + 42 - gap) * 0.006;
            astronaut.vx += (nx / gap) * push;
            astronaut.vy += (ny / gap) * push;
            node.vx -= (nx / gap) * push * 0.14;
            node.vy -= (ny / gap) * push * 0.14;
          }
        });

        astronaut.x += astronaut.vx + Math.sin(t * 0.002 + astronaut.phase) * 0.18;
        astronaut.y += astronaut.vy + Math.cos(t * 0.0017 + astronaut.phase) * 0.18;
        astronaut.x = Math.max(58, Math.min(width - 58, astronaut.x));
        astronaut.y = Math.max(122, Math.min(height - 66, astronaut.y));
        if (astronaut.x <= 58 || astronaut.x >= width - 58) astronaut.vx *= -0.65;
        if (astronaut.y <= 122 || astronaut.y >= height - 66) astronaut.vy *= -0.65;

        if (astronaut.holding) {
          const handAngle = astronaut.lookAngle || 0;
          astronaut.holding.x = astronaut.x + Math.cos(handAngle) * 42;
          astronaut.holding.y = astronaut.y + Math.sin(handAngle) * 42 - 6;
          astronaut.holding.vx = astronaut.vx;
          astronaut.holding.vy = astronaut.vy;
          astronaut.holding.selected = false;
        }

        if (astronaut.holding && astronaut.partner) {
          const distanceToPartner = Math.hypot(astronaut.holding.x - astronaut.partner.x, astronaut.holding.y - astronaut.partner.y);
          if (distanceToPartner < 66) {
            dropForReaction(astronaut, t);
          }
        }

        const lookTarget = astronaut.partner || astronaut.holding || target;
        if (lookTarget) astronaut.lookAngle = Math.atan2(lookTarget.y - astronaut.y, lookTarget.x - astronaut.x);
      });
    }

    function boardUfo(astronaut, t) {
      spaceship.rider = astronaut;
      astronaut.ridingUfo = true;
      astronaut.rideUntil = t + 14000;
      astronaut.holding = null;
      astronaut.partner = null;
      spaceship.lastRiderMessageAt = 0;
      effects.push({ type: "bump", x: spaceship.x, y: spaceship.y - 32, born: t });
      setAutoMessage(`${astronaut.name} boarded the UFO`, astronaut.name === "Clark"
        ? "Clark power online: the UFO shoots blue lasers and pulls mission elements."
        : "Bradley power online: the UFO shoots MEGABOOM blasts.");
    }

    function leaveUfo(astronaut, t) {
      if (spaceship.rider === astronaut) spaceship.rider = null;
      astronaut.ridingUfo = false;
      const angle = spaceship.angle + Math.PI + randomBetween(-0.55, 0.55);
      astronaut.x = spaceship.x + Math.cos(angle) * 118;
      astronaut.y = spaceship.y + Math.sin(angle) * 86;
      astronaut.vx = spaceship.vx * 0.35 + Math.cos(angle) * 2.6;
      astronaut.vy = spaceship.vy * 0.35 + Math.sin(angle) * 2.2;
      astronaut.nextLookAt = t + 900;
      astronaut.boardCooldownUntil = t + 2600;
      effects.push({ type: "bump", x: astronaut.x, y: astronaut.y, born: t });
      setAutoMessage(`${astronaut.name} left the UFO`, "Another astronaut can ride and unlock a different UFO power.");
    }

    function ejectCrew(t = performance.now()) {
      if (!spaceship?.rider) {
        setAutoMessage("No crew aboard", "Press 1 or 2 to let Clark or Bradley ride the UFO first.");
        return;
      }
      const astronaut = spaceship.rider;
      leaveUfo(astronaut, t);
      setMessage("Crew ejected", `${astronaut.name} is floating again. Press 1 or 2 to change pilots.`);
      playTone(320, 0.08);
    }

    function boardNamedAstronaut(name, t = performance.now()) {
      const astronaut = astronauts.find((item) => item.name === name);
      if (!astronaut || astronaut.ridingUfo) return;
      if (spaceship.rider) leaveUfo(spaceship.rider, t);
      if (astronaut.holding) {
        astronaut.holding.heldByAstronaut = null;
        astronaut.holding = null;
        astronaut.partner = null;
      }
      astronaut.x = spaceship.x + randomBetween(-32, 32);
      astronaut.y = spaceship.y - 76;
      astronaut.boardCooldownUntil = 0;
      boardUfo(astronaut, t);
    }

    function canAstronautUse(node) {
      return node && !node.trappedByTsunami && !node.heldByAstronaut && !node.swallowedByBlackHole;
    }

    function findPickupElement(offset = 0) {
      const usable = nodes.filter((node) => canAstronautUse(node) && findReactionPartner(node));
      if (usable.length) return usable[(Math.floor(performance.now() / 1200) + offset) % usable.length];
      const fallback = nodes.filter((node) => canAstronautUse(node));
      return fallback.length ? fallback[(Math.floor(performance.now() / 1400) + offset) % fallback.length] : null;
    }

    function findReactionPartner(held) {
      return nodes.find((node) => canAstronautUse(node) && node !== held && reactionForElements(held.element, node.element)) || null;
    }

    function pickupElement(astronaut, node, t) {
      astronaut.holding = node;
      astronaut.partner = findReactionPartner(node);
      node.heldByAstronaut = astronaut.name;
      node.selected = false;
      selected = selected.filter((item) => item.id !== node.id);
      updateSlots();
      effects.push({ type: "bump", x: node.x, y: node.y, born: t });
      setAutoMessage(`${astronaut.name} picked up ${node.element.symbol}`, astronaut.partner ? `Carrying it toward ${astronaut.partner.element.symbol}.` : "Looking for another element to try.");
    }

    function dropForReaction(astronaut, t) {
      const held = astronaut.holding;
      const partner = astronaut.partner;
      if (!held || !partner) return;

      held.heldByAstronaut = null;
      held.x = partner.x + randomBetween(-18, 18);
      held.y = partner.y + randomBetween(-18, 18);
      held.vx = randomBetween(-0.2, 0.2);
      held.vy = randomBetween(-0.2, 0.2);
      astronaut.holding = null;
      astronaut.partner = null;
      triggerReaction(held, partner, t, true);
      astronaut.nextLookAt = t + 900;
    }

    function periodicDreamPosition(node, sortedIndex) {
      const columns = Math.max(6, Math.min(18, Math.floor((width - 220) / 58)));
      const tileGap = Math.max(46, Math.min(58, (width - 180) / columns));
      const rows = Math.ceil(nodes.length / columns);
      const totalWidth = (columns - 1) * tileGap;
      const startX = width / 2 - totalWidth / 2;
      const startY = Math.max(130, Math.min(height * 0.28, height - rows * 44 - 120));
      const row = Math.floor(sortedIndex / columns);
      const col = sortedIndex % columns;
      return {
        x: startX + col * tileGap,
        y: startY + row * 44
      };
    }

    function canOrganizerArrange(node) {
      return node
        && !node.selected
        && !node.trappedByTsunami
        && !node.heldByAstronaut
        && !node.swallowedByBlackHole;
    }

    function updateOrganizer(t) {
      if (!organizer) makeOrganizer();
      if (!nodes.length) return;

      const arranged = [...nodes].sort((a, b) => a.element.n - b.element.n);
      const leadIndex = Math.floor(t / 1200) % arranged.length;
      const lead = arranged[leadIndex];
      const leadTarget = periodicDreamPosition(lead, leadIndex);
      const desiredX = leadTarget.x + Math.sin(t * 0.001 + organizer.phase) * 60;
      const desiredY = leadTarget.y - 74 + Math.cos(t * 0.0013 + organizer.phase) * 20;
      const dx = desiredX - organizer.x;
      const dy = desiredY - organizer.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const speed = Math.min(2.1, Math.max(0.5, distance * 0.016));
      organizer.vx += ((dx / distance) * speed - organizer.vx) * 0.045;
      organizer.vy += ((dy / distance) * speed - organizer.vy) * 0.045;
      organizer.x += organizer.vx;
      organizer.y += organizer.vy + Math.sin(t * 0.002 + organizer.phase) * 0.12;
      organizer.x = Math.max(58, Math.min(width - 58, organizer.x));
      organizer.y = Math.max(118, Math.min(height - 70, organizer.y));
      organizer.dreamPulse = 0.5 + Math.sin(t * 0.004) * 0.5;

      arranged.forEach((node, index) => {
        if (!canOrganizerArrange(node)) return;
        const target = periodicDreamPosition(node, index);
        const nx = target.x - node.x;
        const ny = target.y - node.y;
        const gap = Math.max(1, Math.hypot(nx, ny));
        const strength = Math.min(0.055, gap * 0.00011);
        node.vx += nx / gap * strength;
        node.vy += ny / gap * strength;
      });

      if (t - organizer.lastMessageAt > 7600) {
        organizer.lastMessageAt = t;
        setAutoMessage("Mendeleev's periodic dream", "Mendeleev is arranging elements in atomic-number order like the periodic table.");
      }
    }

    function updateTsunami(t) {
      if (!tsunami) makeTsunami();

      tsunami.x += tsunami.speed;
      tsunami.y = height * 0.64 + Math.sin(t * 0.0009 + tsunami.phase) * 36;
      if (tsunami.x > width + 240) {
        collapseTsunami(t);
        tsunami.x = -260;
        tsunami.speed = randomBetween(2.05, 2.85);
      }

      tsunami.captured = tsunami.captured.filter((item) => nodes.includes(item.node));
      tsunami.captured.forEach((item, index) => {
        const churn = t * item.mixSpeed + item.phase + Math.sin(t * 0.002 + index) * 0.9;
        const orbit = item.mixRadius + Math.sin(t * 0.003 + item.phase) * 18;
        const braid = Math.sin(t * 0.007 + index * 1.9) * 34;
        const targetX = tsunami.x - 18 + Math.cos(churn) * orbit + braid + item.offsetX * 0.08;
        const targetY = tsunami.y - 48 + Math.sin(churn * 1.35) * orbit * 0.72 + Math.cos(t * 0.005 + item.phase) * 18 + item.offsetY * 0.08;
        item.node.x += (targetX - item.node.x) * 0.22;
        item.node.y += (targetY - item.node.y) * 0.22;
        item.node.vx = (targetX - item.node.x) * 0.08 + tsunami.speed * 0.18;
        item.node.vy = (targetY - item.node.y) * 0.08;
        item.node.selected = false;
      });
      mixTsunamiElements(t);

      nodes.forEach((node) => {
        if (node.trappedByTsunami) return;

        const crestY = tsunami.y + Math.sin((node.x - tsunami.x) * 0.026 + t * 0.004) * 24;
        const dx = node.x - tsunami.x;
        const dy = node.y - crestY;
        const frontDistance = Math.abs(dx);
        const verticalDistance = Math.abs(dy);
        if (frontDistance > 190 || verticalDistance > tsunami.height * 0.62) return;

        const strength = (1 - frontDistance / 190) * (1 - verticalDistance / (tsunami.height * 0.62));
        node.vx += tsunami.speed * strength * 0.28;
        node.vy += (dy < 0 ? -0.12 : 0.22) * strength + Math.sin(t * 0.006 + node.phase) * strength * 0.12;

        if (frontDistance < 82 && verticalDistance < 76) {
          captureByTsunami(node, t);
        }

        if (frontDistance < 56 && verticalDistance < 48 && t - tsunami.lastSplashAt > 160) {
          tsunami.lastSplashAt = t;
          effects.push({ type: "water", x: node.x, y: node.y, born: t, drops: Array.from({ length: 18 }, () => ({
            angle: randomBetween(0, Math.PI * 2),
            speed: randomBetween(0.35, 1.8),
            radius: randomBetween(1.5, 4.2),
            wobble: randomBetween(0, Math.PI * 2)
          })) });
        }
      });

      astronauts.forEach((astronaut) => {
        if (spaceship.rider || astronaut.ridingUfo || astronaut.holding) return;
        if (t <= (astronaut.boardCooldownUntil || 0)) return;
        const distance = Math.hypot(astronaut.x - spaceship.x, astronaut.y - spaceship.y);
        if (distance < spaceship.radius + 34) boardUfo(astronaut, t);
      });

      applyRiderPower(t);
    }

    function neededMissionSymbols() {
      return new Set((parseFormula(currentMission().formula) || [])
        .filter((item) => item.element)
        .map((item) => item.symbol));
    }

    function applyRiderPower(t) {
      if (!spaceship.rider) return;
      if (spaceship.rider.name === "Clark") {
        const needed = neededMissionSymbols();
        nodes.forEach((node) => {
          if (!needed.has(node.element.symbol) || !canAstronautUse(node) || node.swallowedByBlackHole) return;
          const dx = spaceship.x - node.x;
          const dy = spaceship.y - node.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance > 240) return;
          const pull = (1 - distance / 240) * 0.18;
          node.vx += dx / distance * pull;
          node.vy += dy / distance * pull;
        });
        if (t - (spaceship.lastRiderMessageAt || 0) > 4200) {
          spaceship.lastRiderMessageAt = t;
          setAutoMessage("Clark power", "Clark rides the UFO: blue laser shots and mission-element pull are online.");
        }
      } else if (spaceship.rider.name === "Bradley" && t - (spaceship.lastRiderMessageAt || 0) > 4200) {
        spaceship.lastRiderMessageAt = t;
        setAutoMessage("Bradley power", "Bradley rides the UFO: megaboom shots explode on impact.");
      }
    }

    function mixTsunamiElements(t) {
      if (!tsunami || tsunami.captured.length < 2) return;

      for (let i = 0; i < tsunami.captured.length; i += 1) {
        for (let j = i + 1; j < tsunami.captured.length; j += 1) {
          const a = tsunami.captured[i].node;
          const b = tsunami.captured[j].node;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance > 58) continue;

          const push = (58 - distance) * 0.035;
          a.x -= dx / distance * push;
          a.y -= dy / distance * push;
          b.x += dx / distance * push;
          b.y += dy / distance * push;

          const known = reactionForElements(a.element, b.element);
          if (known && distance < 42 && t - tsunami.lastSplashAt > 260) {
            tsunami.lastSplashAt = t;
            effects.push({ type: "bump", x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, born: t });
          }
        }
      }
    }

    function captureByTsunami(node, t) {
      if (!tsunami || node.trappedByTsunami) return;
      node.trappedByTsunami = true;
      node.selected = false;
      selected = selected.filter((item) => item.id !== node.id);
      updateSlots();
      tsunami.captured.push({
        node,
        offsetX: node.x - tsunami.x,
        offsetY: node.y - tsunami.y,
        phase: randomBetween(0, Math.PI * 2),
        mixRadius: randomBetween(28, 78),
        mixSpeed: randomBetween(0.008, 0.016)
      });
      if (t - tsunami.lastSplashAt > 120) {
        tsunami.lastSplashAt = t;
        addWaterEffect(node.x, node.y, t);
      }
    }

    function collapseTsunami(t, force = false) {
      if (!tsunami || !tsunami.captured.length || (!force && t - tsunami.lastCollapseAt < 800)) return;
      tsunami.lastCollapseAt = t;
      const captured = [...tsunami.captured];
      tsunami.captured = [];
      const x = Math.max(120, Math.min(width - 120, tsunami.x - 90));
      const y = Math.max(150, Math.min(height - 120, tsunami.y - 20));

      captured.forEach((item, index) => {
        item.node.trappedByTsunami = false;
        item.node.x = x + Math.cos(index) * 42;
        item.node.y = y + Math.sin(index * 1.7) * 34;
        item.node.vx = randomBetween(-0.8, 0.8);
        item.node.vy = randomBetween(-0.6, 0.4);
      });

      const used = new Set();
      let combined = 0;
      for (let i = 0; i < captured.length; i += 1) {
        if (used.has(i)) continue;
        for (let j = i + 1; j < captured.length; j += 1) {
          if (used.has(j)) continue;
          const a = captured[i].node;
          const b = captured[j].node;
          if (!reactionForElements(a.element, b.element)) continue;
          triggerReaction(a, b, t, true);
          used.add(i);
          used.add(j);
          combined += 1;
          break;
        }
      }

      addWaterEffect(x, y, t);
      setAutoMessage(
        "Tsunami crest collapsed",
        combined
          ? `The trapped elements had no escape. ${combined} reaction${combined > 1 ? "s" : ""} formed inside the curl.`
          : "The crest swallowed the elements, but this group did not make a stable compound yet."
      );
    }

    function updateTornado(t) {
      if (!tornado) makeTornado();

      tornado.vx += Math.sin(t * 0.00055 + tornado.phase) * 0.018;
      tornado.vy += Math.cos(t * 0.0005 + tornado.phase) * 0.014;
      const speed = Math.max(0.01, Math.hypot(tornado.vx, tornado.vy));
      const maxSpeed = 1.55;
      if (speed > maxSpeed) {
        tornado.vx = tornado.vx / speed * maxSpeed;
        tornado.vy = tornado.vy / speed * maxSpeed;
      }
      tornado.x += tornado.vx;
      tornado.y += tornado.vy;

      const margin = tornado.influence * 0.32;
      if (tornado.x < margin || tornado.x > width - margin) tornado.vx *= -1;
      if (tornado.y < 120 || tornado.y > height - margin) tornado.vy *= -1;
      tornado.x = Math.max(margin, Math.min(width - margin, tornado.x));
      tornado.y = Math.max(120, Math.min(height - margin, tornado.y));

      nodes.forEach((node) => {
        const dx = node.x - tornado.x;
        const dy = node.y - tornado.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance > tornado.influence) return;

        const strength = 1 - distance / tornado.influence;
        node.vx += (-dy / distance) * strength * 0.18 + (dx / distance) * strength * 0.025;
        node.vy += (dx / distance) * strength * 0.18 - strength * 0.035;

        if (distance < tornado.radius + node.size * 0.48 && t - tornado.lastSparkAt > 220) {
          tornado.lastSparkAt = t;
          effects.push({ type: "bump", x: node.x, y: node.y, born: t });
        }
      });
    }

    function spawnMeteor(t) {
      meteors.push({
        x: randomBetween(width * 0.25, width + 160),
        y: randomBetween(-120, height * 0.18),
        vx: randomBetween(-5.8, -3.2),
        vy: randomBetween(3.5, 5.6),
        radius: randomBetween(11, 18),
        born: t,
        phase: randomBetween(0, Math.PI * 2),
        lastHitAt: 0
      });
    }

    function updateMeteors(t) {
      if (!meteors.length || t - meteors[meteors.length - 1].born > 720) spawnMeteor(t);

      meteors.forEach((meteor) => {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        nodes.forEach((node) => {
          const dx = node.x - meteor.x;
          const dy = node.y - meteor.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const hitRange = meteor.radius + node.size * 0.56;
          if (distance > hitRange) return;

          const force = (1 - distance / hitRange) * 4.2 + 1.4;
          node.vx += (dx / distance) * force + meteor.vx * 0.08;
          node.vy += (dy / distance) * force + meteor.vy * 0.08;
          if (t - meteor.lastHitAt > 160) {
            meteor.lastHitAt = t;
            effects.push({ type: "bump", x: node.x, y: node.y, born: t });
          }
        });
      });

      meteors = meteors.filter((meteor) => meteor.x > -180 && meteor.y < height + 180 && t - meteor.born < 5200);
    }

    function updateBlackHole(t) {
      if (!blackHole) makeBlackHole();

      if (blackHole.health <= 0) {
        const defeatedX = blackHole.x;
        const defeatedY = blackHole.y;
        miniBlackHoles = [];
        releaseSwallowedElements(t, true);
        game.score += 100;
        grantEnergy(35, "boss defeat", defeatedX, defeatedY, t);
        spawnEnergyOrbs(defeatedX, defeatedY, 10, 8, t);
        unlockAchievement("bossDefeat", t);
        addScoreEffect(defeatedX, defeatedY - 18, "+100", t);
        addExplosionEffect(defeatedX, defeatedY, t);
        setAutoMessage("Elements rescued", "The UFO destroyed the boss and released every trapped element. A new black hole appeared somewhere else.");
        playTone(980, 0.08);
        respawnBlackHoleAwayFrom(defeatedX, defeatedY);
        return;
      }

      growBlackHoleFromMeals();
      updateBossPhase(t);

      if (blackHole.enraged && spaceship) {
        const chaseDx = spaceship.x - blackHole.x;
        const chaseDy = spaceship.y - blackHole.y;
        const chaseDistance = Math.max(1, Math.hypot(chaseDx, chaseDy));
        const chasePower = 0.07 + blackHole.phaseIndex * 0.018;
        blackHole.vx += chaseDx / chaseDistance * chasePower;
        blackHole.vy += chaseDy / chaseDistance * chasePower;
        blackHole.vx += -chaseDy / chaseDistance * Math.sin(t * 0.006) * 0.018;
        blackHole.vy += chaseDx / chaseDistance * Math.sin(t * 0.006) * 0.018;
        if (t - blackHole.lastEnrageMessageAt > 3600) {
          blackHole.lastEnrageMessageAt = t;
          setAutoMessage("Boss chase", "The black hole is hunting the UFO. Destroy it to release the trapped elements.");
        }
      } else {
        blackHole.vx += Math.cos(t * 0.00041 + blackHole.phase) * 0.012;
        blackHole.vy += Math.sin(t * 0.00047 + blackHole.phase) * 0.012;
      }
      const speed = Math.max(0.01, Math.hypot(blackHole.vx, blackHole.vy));
      const maxSpeed = blackHole.enraged ? 2.55 + blackHole.phaseIndex * 0.22 : 1.12;
      if (speed > maxSpeed) {
        blackHole.vx = blackHole.vx / speed * maxSpeed;
        blackHole.vy = blackHole.vy / speed * maxSpeed;
      }
      blackHole.x += blackHole.vx;
      blackHole.y += blackHole.vy + Math.sin(t * 0.0012 + blackHole.phase) * 0.1;

      const margin = blackHole.influence * 0.3;
      if (blackHole.x < margin || blackHole.x > width - margin) blackHole.vx *= -1;
      if (blackHole.y < 126 || blackHole.y > height - margin) blackHole.vy *= -1;
      blackHole.x = Math.max(margin, Math.min(width - margin, blackHole.x));
      blackHole.y = Math.max(126, Math.min(height - margin, blackHole.y));

      updateBlackHoleUfoThreat(t);
      updateBlackHoleStationThreat(t);
      updateMiniBlackHoles(t);

      nodes.forEach((node) => {
        if (node.swallowedByBlackHole) return;
        const dx = blackHole.x - node.x;
        const dy = blackHole.y - node.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance > blackHole.influence) return;

        const pull = (1 - distance / blackHole.influence) * 0.065;
        const swirl = (1 - distance / blackHole.influence) * 0.022;
        node.vx += (dx / distance) * pull - (dy / distance) * swirl;
        node.vy += (dy / distance) * pull + (dx / distance) * swirl;

        if (distance < blackHole.radius + node.size * 0.45) {
          if (node.ufoCargoShotUntil > t && applyBlackHoleWeakness(node.element.symbol, node.x, node.y, t, "element")) {
            node.ufoCargoShotUntil = 0;
            node.vx -= (dx / distance) * 7.5;
            node.vy -= (dy / distance) * 7.5;
            return;
          }
          const trappedLimit = blackHole.maxTrapped;
          if (t - blackHole.lastEatAt > Math.max(140, 260 - blackHole.phaseIndex * 34) && blackHole.swallowed.length < trappedLimit) {
            swallowElement(node, t);
          } else {
            node.vx -= (dx / distance) * 1.25;
            node.vy -= (dy / distance) * 1.25;
          }
          if (t - blackHole.lastSparkAt > 180) {
            blackHole.lastSparkAt = t;
            effects.push({
              type: "bump",
              x: node.x,
              y: node.y,
              born: t
            });
          }
        }
      });
    }

    function updateBossPhase(t) {
      const hp = blackHole.health / blackHole.maxHealth;
      const nextPhase = hp <= 0.25 ? 3 : hp <= 0.45 ? 2 : hp <= 0.7 ? 1 : 0;
      if (nextPhase !== blackHole.phaseIndex) {
        blackHole.phaseIndex = nextPhase;
        blackHole.lastPhaseAt = t;
        setAutoMessage("Boss phase changed", `${bossPhaseNames[nextPhase]} phase. Weakness: ${currentBossWeaknessText()}.`);
        playTone(220 + nextPhase * 120, 0.12);
      }

      const miniLimit = blackHole.enraged ? Math.min(4, 2 + blackHole.phaseIndex) : blackHole.phaseIndex;
      const miniDelay = blackHole.enraged ? 3600 : 4200;
      if ((blackHole.phaseIndex >= 2 || blackHole.enraged) && t - blackHole.lastMiniSpawnAt > miniDelay && miniBlackHoles.length < miniLimit) {
        spawnMiniBlackHole(t);
        blackHole.lastMiniSpawnAt = t;
      }
    }

    function applyBlackHoleWeakness(key, x, y, t, source = "weakness") {
      if (!blackHole || blackHole.health <= 0) return false;
      const weakness = bossWeakness[key];
      if (!weakness) return false;
      if (!currentBossWeaknessKeys().includes(key)) {
        addScoreEffect(x, y - 18, "wrong weakness", t);
        setAutoMessage("Wrong weakness", `This phase wants ${currentBossWeaknessText()}.`);
        return false;
      }
      const upgradeBonus = 1 + (game.upgrades?.weapon || 0) * 0.18 + (game.evolutionTier || 0) * 0.08;
      const damage = weakness.damage * upgradeBonus;
      blackHole.health = Math.max(0, blackHole.health - damage);
      blackHole.hurtUntil = t + 360;
      blackHole.vx += randomBetween(-0.8, 0.8);
      blackHole.vy += randomBetween(-0.8, 0.8);
      addScoreEffect(x, y - 18, `-${Math.round(damage)}`, t);
      grantEnergy(12 + damage * 0.35, "boss weakness", x, y, t);
      effects.push({ type: "bump", x, y, born: t });
      setAutoMessage("Boss weakness hit", `${weakness.label} weakened the black hole.`);
      spurtSwallowedElements(t, source === "compound" ? 5 : 3, source === "compound" ? 1.15 : 1);
      unlockAchievement("bossWeakness", t);
      if (source === "compound") playTone(760, 0.09);
      return true;
    }

    function spawnMiniBlackHole(t) {
      const angle = randomBetween(0, Math.PI * 2);
      miniBlackHoles.push({
        x: blackHole.x + Math.cos(angle) * randomBetween(80, 130),
        y: blackHole.y + Math.sin(angle) * randomBetween(80, 130),
        vx: Math.cos(angle + Math.PI / 2) * 1.1,
        vy: Math.sin(angle + Math.PI / 2) * 1.1,
        radius: 15,
        influence: 104,
        born: t,
        phase: randomBetween(0, Math.PI * 2)
      });
      setAutoMessage("Mini black hole", "The boss summoned a small black hole. Keep moving.");
    }

    function updateMiniBlackHoles(t) {
      miniBlackHoles.forEach((mini) => {
        mini.vx += Math.cos(t * 0.0009 + mini.phase) * 0.015;
        mini.vy += Math.sin(t * 0.0008 + mini.phase) * 0.015;
        mini.x += mini.vx;
        mini.y += mini.vy;
        if (mini.x < 60 || mini.x > width - 60) mini.vx *= -1;
        if (mini.y < 120 || mini.y > height - 60) mini.vy *= -1;
        mini.x = Math.max(60, Math.min(width - 60, mini.x));
        mini.y = Math.max(120, Math.min(height - 60, mini.y));

        nodes.forEach((node) => {
          if (node.swallowedByBlackHole || node.heldByUfo || node.heldByAstronaut || node.trappedByTsunami) return;
          const dx = mini.x - node.x;
          const dy = mini.y - node.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance > mini.influence) return;
          const pull = (1 - distance / mini.influence) * 0.048;
          node.vx += dx / distance * pull;
          node.vy += dy / distance * pull;
        });

        if (spaceship) {
          const dx = mini.x - spaceship.x;
          const dy = mini.y - spaceship.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance < mini.influence) {
            const pull = (1 - distance / mini.influence) * 0.08;
            spaceship.vx += dx / distance * pull;
            spaceship.vy += dy / distance * pull;
          }
        }

        if (spaceStation) {
          const sx = mini.x - spaceStation.x;
          const sy = mini.y - spaceStation.y;
          const stationDistance = Math.max(1, Math.hypot(sx, sy));
          if (stationDistance < mini.influence * 0.76) {
            const pull = (1 - stationDistance / (mini.influence * 0.76)) * 0.018;
            mini.vx -= sx / stationDistance * pull;
            mini.vy -= sy / stationDistance * pull;
          }
          if (stationDistance < mini.radius + spaceStation.radius * 0.48) {
            damageSpaceStation(10, "Mini black hole", t);
            mini.vx += sx / stationDistance * 2.2;
            mini.vy += sy / stationDistance * 2.2;
          }
        }
      });
      miniBlackHoles = miniBlackHoles.filter((mini) => t - mini.born < 15000);
    }

    function updateBlackHoleStationThreat(t) {
      if (!spaceStation || !blackHole) return;
      const dx = blackHole.x - spaceStation.x;
      const dy = blackHole.y - spaceStation.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      if (distance < blackHole.influence * 0.68 && t - (spaceStation.lastThreatAt || 0) > 1600) {
        spaceStation.lastThreatAt = t;
        setAutoMessage("Station under threat", "The monster black hole is drifting toward the station. Push it back or weaken it.");
      }
      if (distance < blackHole.radius + spaceStation.radius * 0.48) {
        damageSpaceStation(18 + blackHole.phaseIndex * 4, "Monster black hole", t);
        blackHole.vx += dx / distance * 2.8;
        blackHole.vy += dy / distance * 2.8;
      }
    }

    function updateBlackHoleUfoThreat(t) {
      if (!spaceship) return;
      const dx = blackHole.x - spaceship.x;
      const dy = blackHole.y - spaceship.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const threatRange = blackHole.influence * (blackHole.enraged ? 1.14 : 0.9);
      if (distance > threatRange) return;

      const pull = (1 - distance / threatRange) * (blackHole.enraged ? 0.2 : 0.13);
      const swirl = (1 - distance / threatRange) * (blackHole.enraged ? 0.07 : 0.045);
      spaceship.vx += (dx / distance) * pull - (dy / distance) * swirl;
      spaceship.vy += (dy / distance) * pull + (dx / distance) * swirl;

      if (!spaceship.following && distance < blackHole.influence * 0.74) {
        spaceship.dodgeUntil = t + 420;
        const evade = (1 - distance / (blackHole.influence * 0.74)) * 0.9 + 0.12;
        spaceship.vx -= (dx / distance) * evade;
        spaceship.vy -= (dy / distance) * evade;
        spaceship.vx += (-dy / distance) * 0.26;
        spaceship.vy += (dx / distance) * 0.26;
      }

      if (distance < blackHole.radius + spaceship.radius * 0.62 && t - spaceship.lastDamageAt > 520) {
        spaceship.lastDamageAt = t;
        const shieldBonus = game.upgrades?.shield || 0;
        const damage = Math.max(8, (blackHole.enraged ? 34 : 25) - shieldBonus * 5);
        spaceship.health = Math.max(0, spaceship.health - damage);
        spaceship.vx -= (dx / distance) * 4.8;
        spaceship.vy -= (dy / distance) * 4.8;
        effects.push({ type: "bump", x: spaceship.x, y: spaceship.y, born: t });
        addScoreEffect(spaceship.x, spaceship.y - 18, `-${damage}`, t);
        setAutoMessage("UFO danger", blackHole.enraged ? "Boss chase impact. Dodge hard, then shoot it to rescue the trapped elements." : "The monster black hole is eating the UFO. Dodge away or shoot it.");
        playTone(180, 0.08);
        if (spaceship.health <= 0) {
          addExplosionEffect(spaceship.x, spaceship.y, t);
          respawnSpaceshipAwayFromBlackHole(t);
        }
      }
    }

    function respawnSpaceshipAwayFromBlackHole(t) {
      const oldFollowing = spaceship.following;
      spaceship.x = blackHole.x < width * 0.5 ? width - 120 : 120;
      spaceship.y = blackHole.y < height * 0.5 ? height - 120 : 150;
      spaceship.vx = blackHole.x < width * 0.5 ? -2.2 : 2.2;
      spaceship.vy = blackHole.y < height * 0.5 ? -1.4 : 1.4;
      spaceship.targetX = spaceship.x;
      spaceship.targetY = spaceship.y;
      spaceship.following = oldFollowing && pointer.active;
      spaceship.health = spaceship.maxHealth;
      spaceship.lastDamageAt = t + 1200;
      spaceship.dodgeUntil = t + 1200;
      setAutoMessage("UFO escaped", "The UFO blasted free. Keep it away from the monster black hole.");
    }

    function respawnBlackHoleAwayFrom(oldX, oldY) {
      makeBlackHole();
      for (let tries = 0; tries < 50; tries += 1) {
        const candidate = {
          x: randomBetween(90, width - 90),
          y: randomBetween(140, height - 90)
        };
        if (Math.hypot(candidate.x - oldX, candidate.y - oldY) > Math.min(width, height) * 0.32) {
          blackHole.x = candidate.x;
          blackHole.y = candidate.y;
          return;
        }
      }
      blackHole.x = oldX < width * 0.5 ? width - 120 : 120;
      blackHole.y = oldY < height * 0.5 ? height - 120 : 150;
    }

    function growBlackHoleFromMeals() {
      const meals = Math.min(38, blackHole.eatenCount * 0.55 + blackHole.swallowed.length * 0.26);
      const targetRadius = blackHole.baseRadius + meals * 3.35;
      const targetInfluence = blackHole.baseInfluence + meals * 10.5;
      blackHole.radius += (targetRadius - blackHole.radius) * 0.08;
      blackHole.influence += (targetInfluence - blackHole.influence) * 0.06;
    }

    function blackHoleBackAngle() {
      return Math.atan2(blackHole.vy || 0.1, blackHole.vx || 0.1) + Math.PI;
    }

    function swallowElement(node, t) {
      node.swallowedByBlackHole = true;
      node.selected = false;
      selected = selected.filter((item) => item.id !== node.id);
      updateSlots();
      blackHole.lastEatAt = t;
      blackHole.eatenCount += 1;
      blackHole.swallowed.push({
        node,
        eatenAt: t,
        spin: randomBetween(0, Math.PI * 2)
      });
      effects.push({ type: "bump", x: node.x, y: node.y, born: t });
      if (!blackHole.enraged && blackHole.eatenCount >= blackHole.enrageThreshold) {
        enrageBlackHole(t);
      } else {
        const remaining = Math.max(0, blackHole.enrageThreshold - blackHole.eatenCount);
        setAutoMessage("Black hole snack", `${node.element.symbol} got swallowed. ${remaining ? `${remaining} more before boss mode.` : "The monster is growing bigger."}`);
      }
    }

    function enrageBlackHole(t) {
      blackHole.enraged = true;
      blackHole.enrageAt = t;
      blackHole.lastEnrageMessageAt = t;
      blackHole.baseRadius += 18;
      blackHole.baseInfluence += 92;
      blackHole.maxHealth = Math.max(blackHole.maxHealth, 520);
      blackHole.health = Math.max(blackHole.health, blackHole.maxHealth);
      blackHole.vx *= 1.55;
      blackHole.vy *= 1.55;
      addExplosionEffect(blackHole.x, blackHole.y, t);
      spawnEnergyOrbs(blackHole.x, blackHole.y, 6, 3, t);
      setAutoMessage("Boss awakened", `The black hole trapped ${blackHole.swallowed.length} elements and is chasing the UFO. Destroy it to release them.`);
      playTone(132, 0.2);
    }

    function releaseSwallowedElements(t, scatter) {
      if (!blackHole || !blackHole.swallowed.length) return;
      blackHole.swallowed.forEach((item, index) => {
        const angle = scatter ? index * 2.399 + randomBetween(-0.3, 0.3) : blackHoleBackAngle();
        const speed = scatter ? randomBetween(2.8, 4.8) : randomBetween(2.2, 3.8);
        item.node.swallowedByBlackHole = false;
        item.node.x = blackHole.x + Math.cos(angle) * (blackHole.radius + item.node.size);
        item.node.y = blackHole.y + Math.sin(angle) * (blackHole.radius + item.node.size);
        item.node.vx = Math.cos(angle) * speed;
        item.node.vy = Math.sin(angle) * speed;
        item.node.blackHoleEjection = null;
        item.node.dangerousUntil = 0;
        effects.push({ type: "bump", x: item.node.x, y: item.node.y, born: t });
        addScoreEffect(item.node.x, item.node.y - 12, item.node.element.symbol, t);
      });
      blackHole.swallowed = [];
    }

    function spurtSwallowedElements(t, count = 2, power = 1) {
      if (!blackHole || !blackHole.swallowed.length) return 0;
      const amount = Math.min(blackHole.swallowed.length, Math.max(1, Math.round(count)));
      const released = blackHole.swallowed.splice(-amount);
      released.forEach((item, index) => {
        const baseAngle = Math.atan2(item.node.y - blackHole.y, item.node.x - blackHole.x);
        const angle = (Number.isFinite(baseAngle) ? baseAngle : blackHoleBackAngle()) + randomBetween(-0.5, 0.5) + index * 0.08;
        const speed = randomBetween(3.4, 6.2) * Math.max(0.75, power);
        item.node.swallowedByBlackHole = false;
        item.node.x = blackHole.x + Math.cos(angle) * (blackHole.radius + item.node.size + 4);
        item.node.y = blackHole.y + Math.sin(angle) * (blackHole.radius + item.node.size + 4);
        item.node.vx = Math.cos(angle) * speed + blackHole.vx * 0.25;
        item.node.vy = Math.sin(angle) * speed + blackHole.vy * 0.25;
        item.node.blackHoleEjection = {
          angle,
          born: t,
          until: t + randomBetween(520, 780),
          accel: randomBetween(0.035, 0.075) * Math.max(0.8, power)
        };
        item.node.dangerousUntil = 0;
        if (!lowPowerMode() || index < 3) {
          effects.push({ type: "bump", x: item.node.x, y: item.node.y, born: t });
        }
        addScoreEffect(item.node.x, item.node.y - 12, item.node.element.symbol, t);
      });
      setAutoMessage("Elements burst out", `${amount} trapped element${amount > 1 ? "s" : ""} spurted out of the black hole.`);
      return amount;
    }

    function applyBlackHoleEjectionBoost(node, t) {
      const boost = node.blackHoleEjection;
      if (!boost) return;
      if (t > boost.until) {
        node.blackHoleEjection = null;
        return;
      }
      const duration = Math.max(1, boost.until - boost.born);
      const p = Math.max(0, Math.min(1, (t - boost.born) / duration));
      const accel = boost.accel * (0.45 + p * 1.65);
      node.vx += Math.cos(boost.angle) * accel;
      node.vy += Math.sin(boost.angle) * accel;
    }

    function shootUfo(t = performance.now()) {
      if (!spaceship) makeSpaceship();
      if (shootCargoElement(t)) return;
      const riderName = spaceship.rider?.name;
      const weapon = selectedWeapon || "bolt";
      const spec = WEAPONS[weapon] || WEAPONS.bolt;
      if (t - spaceship.lastShotAt < spec.cooldown) return;
      const angle = Math.atan2(spaceship.vy, spaceship.vx);
      const speed = spec.speed + (game.evolutionTier || 0) * 0.6;
      const upgradePower = 1 + (game.upgrades?.weapon || 0) * 0.16 + (game.evolutionTier || 0) * 0.08;
      const riderPower = riderName === "Clark" && weapon === "laser" ? 1.22 : riderName === "Bradley" && weapon === "megaboom" ? 1.32 : 1;
      const makeShot = (shotAngle, powerScale = 1) => ({
        x: spaceship.x + Math.cos(shotAngle) * 68,
        y: spaceship.y + Math.sin(shotAngle) * 42,
        vx: Math.cos(shotAngle) * speed + spaceship.vx * 0.2,
        vy: Math.sin(shotAngle) * speed + spaceship.vy * 0.2,
        born: t,
        power: spec.power * upgradePower * riderPower * powerScale,
        kind: weapon,
        color: spec.color,
        hitNodes: new Set()
      });
      if (weapon === "spread") {
        [-0.22, 0, 0.22].forEach((offset, index) => shots.push(makeShot(angle + offset, index === 1 ? 1 : 0.82)));
      } else {
        shots.push(makeShot(angle));
      }
      spaceship.lastShotAt = t;
      addMuzzleFlash(
        spaceship.x + Math.cos(angle) * 62,
        spaceship.y + Math.sin(angle) * 38,
        angle, spec.color, t
      );
      if (weapon === "megaboom") addScreenShake(3.2, 160, t);
      playTone(spec.tone, spec.toneLength);
    }

    function shootCargoElement(t = performance.now()) {
      if (!spaceship?.cargo?.length) return false;
      if (t - spaceship.lastShotAt < 160) return true;
      const node = spaceship.cargo.shift();
      const angle = Math.atan2(spaceship.vy || Math.sin(spaceship.angle), spaceship.vx || Math.cos(spaceship.angle));
      const speed = 9.6 + (spaceship.rider?.name === "Bradley" ? 2.5 : 0) + (game.evolutionTier || 0) * 0.7;
      node.heldByUfo = false;
      node.ufoCargoShotUntil = t + 1200;
      node.x = spaceship.x + Math.cos(angle) * 76;
      node.y = spaceship.y + Math.sin(angle) * 48;
      node.vx = Math.cos(angle) * speed + spaceship.vx * 0.32;
      node.vy = Math.sin(angle) * speed + spaceship.vy * 0.32;
      effects.push({ type: "bump", x: node.x, y: node.y, born: t });
      addScoreEffect(node.x, node.y - 12, node.element.symbol, t);
      spaceship.lastShotAt = t;
      setAutoMessage("Element cannon", `The UFO shot ${node.element.symbol} out of its cargo bay.`);
      playTone(560, 0.06);
      return true;
    }

    function detonateMegaboom(x, y, t, power = 1) {
      const radius = 138;
      addExplosionEffect(x, y, t);
      addShockwave(x, y, radius, "#ffcf33", t);
      addScreenShake(7 + 2 * Math.min(power, 2), 340, t);
      addHitstop(70, t);
      if (blackHole && hazards.blackHole) {
        const distance = Math.hypot(x - blackHole.x, y - blackHole.y);
        if (distance < radius + blackHole.radius) {
          blackHole.health = Math.max(0, blackHole.health - 24 * power);
          blackHole.hurtUntil = t + 260;
          spurtSwallowedElements(t, 6 + power * 2, 1.2);
          spawnEnergyOrbs(x, y, 4, 5, t);
        }
      }
      nodes.forEach((node) => {
        if (node.swallowedByBlackHole || node.trappedByTsunami || node.heldByAstronaut) return;
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance > radius) return;
        const blast = (1 - distance / radius) * 9.5 * power + 1.2;
        node.vx += dx / distance * blast;
        node.vy += dy / distance * blast;
      });
      addScoreEffect(x, y - 20, "MEGABOOM", t);
    }

    function updateShots(t) {
      shots.forEach((shot) => {
        shot.x += shot.vx;
        shot.y += shot.vy;

        if (shot.kind === "megaboom" && t - shot.born > 1350 && !shot.hit) {
          shot.hit = true;
          detonateMegaboom(shot.x, shot.y, t, shot.power || 1);
          return;
        }

        if (!shot.hit && hazards.blackHole && blackHole) {
          const distance = Math.hypot(shot.x - blackHole.x, shot.y - blackHole.y);
          if (distance <= blackHole.radius + 30) {
            if (shot.kind === "megaboom") {
              shot.hit = true;
              detonateMegaboom(shot.x, shot.y, t, shot.power || 1);
            } else {
              if (shot.kind !== "laser") shot.hit = true;
              blackHole.health = Math.max(0, blackHole.health - 11 * (shot.power || 1));
              blackHole.hurtUntil = t + 180;
              if (shot.kind !== "laser" || t - (shot.lastSpurtAt || 0) > 240) {
                shot.lastSpurtAt = t;
                spurtSwallowedElements(t, shot.kind === "laser" ? 1 : 2 + (shot.power || 1), shot.power || 1);
              }
              effects.push({ type: "bump", x: shot.x, y: shot.y, born: t });
              // The laser fires constantly, so it gets a far gentler kick.
              if (shot.kind === "laser") {
                addScreenShake(1.6, 130, t);
              } else {
                addScreenShake(4.5, 200, t);
                addHitstop(28, t);
                addShockwave(shot.x, shot.y, 34, shot.color || "#fff4b8", t);
              }
              addScoreEffect(shot.x, shot.y - 10, shot.kind === "laser" ? "laser" : "hit", t);
            }
          }
        }

        if (shot.hit) return;
        nodes.forEach((node) => {
          if (shot.hit || node.swallowedByBlackHole || node.trappedByTsunami || node.heldByAstronaut) return;
          if (shot.hitNodes?.has(node.id)) return;
          const dx = node.x - shot.x;
          const dy = node.y - shot.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const hitRange = shot.kind === "megaboom" ? node.size * 0.72 + 12 : node.size * 0.62 + 6;
          if (distance > hitRange) return;

          if (shot.kind === "megaboom") {
            shot.hit = true;
            detonateMegaboom(shot.x, shot.y, t, shot.power || 1);
            return;
          }

          const shotSpeed = Math.max(1, Math.hypot(shot.vx, shot.vy));
          const nx = shot.vx / shotSpeed;
          const ny = shot.vy / shotSpeed;
          const power = shot.power || 1;
          node.vx += nx * 5.2 * power + dx / distance * 1.4;
          node.vy += ny * 5.2 * power + dy / distance * 1.4;
          shot.hitNodes?.add(node.id);
          if (shot.kind !== "laser") shot.hit = true;
          effects.push({ type: "bump", x: node.x, y: node.y, born: t });
          addScoreEffect(node.x, node.y - 12, shot.kind === "laser" ? "laser" : "push", t);
        });
      });

      shots = shots.filter((shot) => {
        const alive = t - shot.born < 1600;
        const onscreen = shot.x > -80 && shot.x < width + 80 && shot.y > -80 && shot.y < height + 80;
        return alive && onscreen && !shot.hit;
      });
    }

    function updateSpaceship(t) {
      if (!spaceship) makeSpaceship();
      const tractorTarget = spaceship.tractorActive ? 1 : 0;
      spaceship.tractorAnim += (tractorTarget - spaceship.tractorAnim) * 0.18;

      const keyX = (arrowKeys.ArrowRight ? 1 : 0) - (arrowKeys.ArrowLeft ? 1 : 0);
      const keyY = (arrowKeys.ArrowDown ? 1 : 0) - (arrowKeys.ArrowUp ? 1 : 0);
      spaceship.keyboardControl = keyX !== 0 || keyY !== 0;

      if (spaceship.keyboardControl) {
        const length = Math.max(1, Math.hypot(keyX, keyY));
        const accel = 0.58 + (game.upgrades?.engine || 0) * 0.08 + (game.evolutionTier || 0) * 0.04;
        spaceship.following = true;
        spaceship.vx += keyX / length * accel;
        spaceship.vy += keyY / length * accel;
        const speed = Math.max(0.01, Math.hypot(spaceship.vx, spaceship.vy));
        const maxSpeed = 7.2 + (game.upgrades?.engine || 0) * 0.6 + (game.evolutionTier || 0) * 0.35;
        if (speed > maxSpeed) {
          spaceship.vx = spaceship.vx / speed * maxSpeed;
          spaceship.vy = spaceship.vy / speed * maxSpeed;
        }
      } else if (spaceship.following) {
        const dx = spaceship.targetX - spaceship.x;
        const dy = spaceship.targetY - spaceship.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const speed = Math.min(7.5, Math.max(1.8, distance * 0.085));
        spaceship.vx += ((dx / distance) * speed - spaceship.vx) * 0.16;
        spaceship.vy += ((dy / distance) * speed - spaceship.vy) * 0.16;
      } else {
        const turn = Math.sin(t * 0.0008 + spaceship.wobble) * 0.018 + Math.cos(t * 0.00043) * 0.012;
        const speed = 1.9 + Math.sin(t * 0.0011 + spaceship.wobble) * 0.35;
        spaceship.angle += turn;
        spaceship.vx += Math.cos(spaceship.angle) * 0.028;
        spaceship.vy += Math.sin(spaceship.angle) * 0.028;

        const currentSpeed = Math.max(0.01, Math.hypot(spaceship.vx, spaceship.vy));
        spaceship.vx = (spaceship.vx / currentSpeed) * speed;
        spaceship.vy = (spaceship.vy / currentSpeed) * speed;
      }

      if (Math.hypot(spaceship.vx, spaceship.vy) > 0.2) {
        spaceship.angle = Math.atan2(spaceship.vy, spaceship.vx);
      }
      spaceship.x += spaceship.vx;
      spaceship.y += spaceship.vy + Math.sin(t * 0.002 + spaceship.wobble) * 0.22;

      const margin = spaceship.radius + 18;
      if (spaceship.x < margin || spaceship.x > width - margin) {
        spaceship.vx *= -1;
        spaceship.angle = Math.atan2(spaceship.vy, spaceship.vx);
      }
      if (spaceship.y < 112 || spaceship.y > height - margin) {
        spaceship.vy *= -1;
        spaceship.angle = Math.atan2(spaceship.vy, spaceship.vx);
      }
      spaceship.x = Math.max(margin, Math.min(width - margin, spaceship.x));
      spaceship.y = Math.max(112, Math.min(height - margin, spaceship.y));
      updateUfoCargoPositions(t);

      nodes.forEach((node) => {
        if (node.heldByUfo || node.swallowedByBlackHole || node.trappedByTsunami || node.heldByAstronaut) return;
        const dx = node.x - spaceship.x;
        const dy = node.y - spaceship.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const hitRange = spaceship.radius + node.size * 0.58;
        applyTractorBeamToNode(node, dx, dy, distance, t);
        if (node.heldByUfo) return;
        if (distance > hitRange) return;

        if (node.dangerousUntil > t && t - spaceship.lastDamageAt > 520) {
          spaceship.lastDamageAt = t;
          const damage = Math.max(4, 12 - (game.upgrades?.shield || 0) * 2);
          spaceship.health = Math.max(0, spaceship.health - damage);
          addScoreEffect(spaceship.x, spaceship.y - 18, `-${damage}`, t);
          setAutoMessage("Danger element", "This charged element is dangerous. Dodge or collect carefully.");
        }

        if (spaceStation && node.dangerousUntil > t) {
          const stationDistance = Math.hypot(node.x - spaceStation.x, node.y - spaceStation.y);
          if (stationDistance < spaceStation.radius * 0.78) {
            damageSpaceStation(12, `${node.element.symbol} danger element`, t);
            node.dangerousUntil = 0;
            node.vx += (node.x - spaceStation.x) / Math.max(1, stationDistance) * 5;
            node.vy += (node.y - spaceStation.y) / Math.max(1, stationDistance) * 5;
          }
        }

        const force = (1 - distance / hitRange) * 3.2 + 0.9;
        node.vx += (dx / distance) * force;
        node.vy += (dy / distance) * force;
        spaceship.vx -= (dx / distance) * 0.36;
        spaceship.vy -= (dy / distance) * 0.36;

        if (t - spaceship.lastBumpAt > 260) {
          spaceship.lastBumpAt = t;
          effects.push({
            type: "bump",
            x: (spaceship.x + node.x) / 2,
            y: (spaceship.y + node.y) / 2,
            born: t
          });
        }
      });
    }

    function angleDifference(a, b) {
      return Math.atan2(Math.sin(a - b), Math.cos(a - b));
    }

    function applyTractorBeamToNode(node, dx, dy, distance, t) {
      if (!spaceship.tractorActive || spaceship.tractorAnim < 0.18) return;
      if (spaceship.cargo.length >= spaceship.cargoCapacity || node.selected) return;
      const range = spaceship.tractorRange + (game.upgrades?.magnet || 0) * 22 + (game.evolutionTier || 0) * 7;
      if (distance > range) return;
      const targetAngle = Math.atan2(dy, dx);
      const facing = spaceship.angle;
      const cone = spaceship.tractorAngle * (0.82 + spaceship.tractorAnim * 0.18);
      if (Math.abs(angleDifference(targetAngle, facing)) > cone * 0.5) return;

      const aimFactor = 1 - Math.abs(angleDifference(targetAngle, facing)) / (cone * 0.5);
      const closeBoost = distance < spaceship.radius + node.size * 2.8 ? 1.85 : 1;
      const pullStrength = ((1 - distance / range) * 4.4 + 1.15) * (0.9 + spaceship.tractorAnim * 1.15) * Math.max(0.45, aimFactor) * closeBoost;
      node.vx -= (dx / distance) * pullStrength;
      node.vy -= (dy / distance) * pullStrength;
      node.vx *= 0.92;
      node.vy *= 0.92;
      node.vx += Math.cos(facing) * 0.05;
      node.vy += Math.sin(facing) * 0.05;
      if (distance < spaceship.radius + node.size * 1.18) {
        collectElementWithUfo(node, t);
      }
    }

    function setTractorBeam(active, t = performance.now()) {
      if (!spaceship) makeSpaceship();
      if (spaceship.tractorActive === active) return;
      spaceship.tractorActive = active;
      spaceship.lastTractorToggleAt = t;
      if (active) {
        effects.push({ type: "bump", x: spaceship.x + Math.cos(spaceship.angle) * 62, y: spaceship.y + Math.sin(spaceship.angle) * 62, born: t });
        setAutoMessage("Tractor beam on", "Hold C or Vacuum and point the UFO near an element. The beam will pull it into cargo.");
        playTone(720, 0.05);
      } else {
        setAutoMessage("Tractor beam off", "Release C to stop collecting elements.");
        playTone(260, 0.04);
      }
      updateGamePanel();
    }

    function isNearSpaceStation() {
      if (!spaceship || !spaceStation) return false;
      return Math.hypot(spaceship.x - spaceStation.x, spaceship.y - spaceStation.y) < spaceStation.dockRadius;
    }

    function elementBySymbol(symbol) {
      return elements.find((element) => element.symbol === symbol);
    }

    function storedItemPriority(item) {
      if (currentMissionSymbols().has(item.symbol)) return 3;
      if (currentBossWeaknessKeys().includes(item.symbol)) return 2;
      return 1;
    }

    function removeStoredItemAt(index) {
      return spaceStation.stored.splice(index, 1)[0];
    }

    function findStationReactionPair(preferredFormula = null) {
      if (!spaceStation?.stored?.length) return null;
      for (let i = 0; i < spaceStation.stored.length; i += 1) {
        for (let j = i + 1; j < spaceStation.stored.length; j += 1) {
          const a = elementBySymbol(spaceStation.stored[i].symbol);
          const b = elementBySymbol(spaceStation.stored[j].symbol);
          if (!a || !b) continue;
          const reaction = reactionForElements(a, b);
          if (!reaction) continue;
          if (!preferredFormula || reaction.formula === preferredFormula) {
            return { i, j, reaction };
          }
        }
      }
      return null;
    }

    function reactStationPair(pair, t) {
      const first = removeStoredItemAt(pair.j);
      const second = removeStoredItemAt(pair.i);
      const formula = pair.reaction.formula;
      spaceStation.products.push({ formula, madeAt: t });
      spaceStation.products = spaceStation.products.slice(-8);
      spaceStation.pulseUntil = t + 1100;
      addSimpleEffect(pair.reaction.animation || "spark", spaceStation.x, spaceStation.y, t);
      addScoreEffect(spaceStation.x, spaceStation.y - 96, `${first.symbol}+${second.symbol}->${formula}`, t);
      window.setTimeout(() => {
        recordCompound(formula, spaceStation?.x ?? null, spaceStation?.y ?? null, "station");
      }, 0);
      return formula;
    }

    function queueStationReactions(t = performance.now()) {
      if (stationReactionQueued) return;
      stationReactionQueued = true;
      window.requestAnimationFrame(() => {
        stationReactionQueued = false;
        processStationReactions(t);
      });
    }

    function processStationReactions(t = performance.now()) {
      if (!spaceStation) return;
      if (processingStation) return;
      processingStation = true;
      try {
        let reacted = false;
        const missionPair = findStationReactionPair(currentMission().formula);
        if (missionPair) {
          reactStationPair(missionPair, t);
          reacted = true;
        } else {
          const weaknessFormula = currentBossWeaknessKeys().find((key) => key.length > 1);
          const weaknessPair = weaknessFormula ? findStationReactionPair(weaknessFormula) : null;
          if (weaknessPair) {
            reactStationPair(weaknessPair, t + 80);
            reacted = true;
          }
        }

        let recycledCount = 0;
        while (spaceStation.stored.length > spaceStation.capacity && recycledCount < 4) {
          let index = 0;
          let bestPriority = Infinity;
          spaceStation.stored.forEach((item, itemIndex) => {
            const priority = storedItemPriority(item);
            if (priority < bestPriority) {
              bestPriority = priority;
              index = itemIndex;
            }
          });
          const recycled = removeStoredItemAt(index);
          grantEnergy(bestPriority > 1 ? 4 : 2, "station recycle", spaceStation.x, spaceStation.y, t);
          addScoreEffect(spaceStation.x, spaceStation.y + 82, `recycled ${recycled.symbol}`, t);
          recycledCount += 1;
        }

        if (!reacted && spaceStation.stored.length > Math.floor(spaceStation.capacity * 0.72)) {
          const overflowPair = findStationReactionPair();
          if (overflowPair) {
            reactStationPair(overflowPair, t + 120);
            setAutoMessage("Station lab", "The station auto-combined stored elements to free storage space.");
          }
        }

        if (spaceStation.stored.length > spaceStation.capacity) {
          queueStationReactions(t + 80);
        }
      } finally {
        processingStation = false;
      }
    }

    function damageSpaceStation(amount, label, t = performance.now()) {
      addScreenShake(6.5, 300, t);
      flashHitVignette();
      if (!spaceStation || t - (spaceStation.lastDamageAt || 0) < 500) return;
      spaceStation.lastDamageAt = t;
      spaceStation.health = Math.max(0, spaceStation.health - amount);
      spaceStation.pulseUntil = t + 900;
      addScoreEffect(spaceStation.x, spaceStation.y - 92, `-${amount} station`, t);
      effects.push({ type: "bump", x: spaceStation.x, y: spaceStation.y, born: t });
      setAutoMessage("Protect the station", `${label} hit the space station. Keep threats away from it.`);
      if (spaceStation.health <= 0) {
        spaceStation.health = Math.round(spaceStation.maxHealth * 0.55);
        spaceStation.stored = spaceStation.stored.slice(-4);
        spaceStation.products = [];
        setAutoMessage("Station emergency", "The station vented extra storage and restarted. Protect it to keep your lab progress.");
      }
      updateGamePanel();
    }

    function depositCargoToStation(t = performance.now()) {
      if (!spaceStation) makeSpaceStation();
      if (!spaceship?.cargo?.length) {
        setAutoMessage("Station cargo", "Collect elements first, then press D near the station to store them.");
        return;
      }
      if (!isNearSpaceStation()) {
        setAutoMessage("Station too far", "Fly close to the space station, then press D to deposit cargo.");
        return;
      }
      const deposited = spaceship.cargo.splice(0);
      const symbols = deposited.map((node) => node.element.symbol);
      deposited.forEach((node) => {
        node.heldByUfo = false;
        node.stationStored = true;
        node.selected = false;
        spaceStation.stored.push({
          symbol: node.element.symbol,
          name: node.element.name,
          family: node.element.family,
          storedAt: t
        });
      });
      nodes = nodes.filter((node) => !deposited.includes(node));
      selected = selected.filter((node) => !deposited.includes(node));
      updateSlots();
      spaceStation.pulseUntil = t + 900;
      effects.push({ type: "bump", x: spaceStation.x, y: spaceStation.y, born: t });
      addScoreEffect(spaceStation.x, spaceStation.y - 78, `stored ${symbols.join(" ")}`, t);
      const targetBonus = symbols.reduce((total, symbol) => total + (currentMissionSymbols().has(symbol) || currentBossWeaknessKeys().includes(symbol) ? 4 : 1), 0);
      grantEnergy(Math.max(2, targetBonus), "station storage", spaceStation.x, spaceStation.y, t);
      setAutoMessage("Station storage", `${symbols.join(", ")} deposited. The station will react matching elements automatically.`);
      queueStationReactions(t);
      playTone(840, 0.1);
      updateGamePanel();
    }

    function collectElementWithUfo(node, t) {
      if (spaceship.cargo.includes(node)) return;
      node.heldByUfo = true;
      node.selected = false;
      node.dangerousUntil = 0;
      node.ufoCargoShotUntil = 0;
      selected = selected.filter((item) => item.id !== node.id);
      updateSlots();
      spaceship.cargo.push(node);
      unlockAchievement("cargo", t);
      const energy = collectionEnergyForNode(node);
      grantEnergy(energy, energy > 4 ? "target collection" : "collection", node.x, node.y, t);
      effects.push({ type: "bump", x: node.x, y: node.y, born: t });
      setAutoMessage("UFO cargo", `${node.element.symbol} collected for ${energy} XP. Press Space to shoot collected elements out.`);
    }

    function updateUfoCargoPositions(t) {
      if (!spaceship.cargo?.length) return;
      spaceship.cargo = spaceship.cargo.filter((node) => nodes.includes(node) && node.heldByUfo);
      spaceship.cargo.forEach((node, index) => {
        const angle = spaceship.angle + Math.PI + (index - (spaceship.cargo.length - 1) / 2) * 0.55;
        const orbit = 42 + index * 4 + Math.sin(t * 0.006 + node.phase) * 2;
        node.x = spaceship.x + Math.cos(angle) * orbit;
        node.y = spaceship.y + Math.sin(angle) * orbit - 4;
        node.vx = spaceship.vx;
        node.vy = spaceship.vy;
      });
    }

    function autoReactNearby(now) {
      if (now - lastAutoReactionAt < 520) return;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          if (a.selected || b.selected || a.trappedByTsunami || b.trappedByTsunami || a.heldByAstronaut || b.heldByAstronaut || a.heldByUfo || b.heldByUfo || a.swallowedByBlackHole || b.swallowedByBlackHole) continue;

          const known = reactionForElements(a.element, b.element);
          if (!known) continue;

          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 62) continue;

          const id = nodePairId(a, b);
          const last = reactionCooldowns.get(id) || 0;
          if (now - last < 4200) continue;

          reactionCooldowns.set(id, now);
          lastAutoReactionAt = now;
          triggerReaction(a, b, now, true);
          return;
        }
      }
    }

    function drawBackground(t) {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const low = lowPowerMode();
      ctx.globalAlpha = low ? 0.1 : 0.18;
      const colors = ["#2aa8d8", "#0f9b8f", "#8067c8"];
      const glowCount = low ? 1 : 4;
      for (let i = 0; i < glowCount; i += 1) {
        const x = width * (0.18 + i * 0.2) + Math.sin(t * 0.00016 + i) * 28;
        const y = height * (0.2 + (i % 2) * 0.42) + Math.cos(t * 0.00018 + i) * 30;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height) * 0.18);
        gradient.addColorStop(0, `${colors[i % colors.length]}22`);
        gradient.addColorStop(1, `${colors[i % colors.length]}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(width, height) * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      if (low) {
        ctx.restore();
        return;
      }

      ctx.globalAlpha = 0.11;
      ctx.strokeStyle = "rgba(135, 218, 255, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i += 1) {
        const x = width * (0.22 + i * 0.24) + Math.sin(t * 0.00025 + i) * 26;
        const y = height * (0.3 + (i % 2) * 0.3) + Math.cos(t * 0.00022 + i) * 22;
        const r = 42 + Math.sin(t * 0.001 + i) * 8;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.9, r * 0.72, t * 0.00025 + i, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.72, r * 1.9, -t * 0.00022 + i, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(135, 218, 255, 0.28)";
        ctx.beginPath();
        ctx.arc(x + Math.cos(t * 0.001 + i) * r, y + Math.sin(t * 0.001 + i) * r * 0.55, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawSpaceStation(t) {
      if (!spaceStation) return;
      const pulse = spaceStation.pulseUntil > t ? 1 : 0;
      const dockDistance = spaceship ? Math.hypot(spaceship.x - spaceStation.x, spaceship.y - spaceStation.y) : Infinity;
      const dockReady = dockDistance < spaceStation.dockRadius;
      const bob = Math.sin(t * 0.0014 + spaceStation.phase) * 4;
      const low = lowPowerMode();

      ctx.save();
      ctx.translate(spaceStation.x, spaceStation.y + bob);
      ctx.scale(1.16, 1.16);
      ctx.shadowColor = dockReady ? "#ffcf33" : "#2aa8d8";
      ctx.shadowBlur = low ? dockReady ? 10 : 0 : dockReady ? 30 : 18;

      ctx.save();
      ctx.globalAlpha = dockReady ? 0.34 : 0.18;
      ctx.strokeStyle = dockReady ? "rgba(255, 207, 51, 0.72)" : "rgba(42, 168, 216, 0.46)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 9]);
      ctx.beginPath();
      ctx.arc(0, 0, spaceStation.dockRadius * 0.48 + Math.sin(t * 0.006) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.strokeStyle = "rgba(234, 248, 255, 0.52)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-72, 0);
      ctx.lineTo(72, 0);
      ctx.moveTo(0, -58);
      ctx.lineTo(0, 58);
      ctx.stroke();

      const core = ctx.createRadialGradient(-12, -12, 0, 0, 0, 46);
      core.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      core.addColorStop(0.45, "rgba(42, 168, 216, 0.82)");
      core.addColorStop(1, "rgba(8, 18, 34, 0.96)");
      ctx.fillStyle = core;
      ctx.strokeStyle = "rgba(234, 248, 255, 0.58)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 38 + pulse * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 207, 51, 0.84)";
      [-96, 96].forEach((x) => {
        roundRect(x - 26, -11, 52, 22, 5);
        ctx.fill();
      });
      ctx.fillStyle = "rgba(15, 155, 143, 0.82)";
      [0, Math.PI].forEach((angle) => {
        ctx.save();
        ctx.rotate(angle + Math.sin(t * 0.001) * 0.08);
        roundRect(46, -12, 48, 24, 5);
        ctx.fill();
        ctx.restore();
      });

      const stored = spaceStation.stored.slice(-6);
      stored.forEach((item, index) => {
        const angle = t * 0.001 + index / Math.max(1, stored.length) * Math.PI * 2;
        const x = Math.cos(angle) * 58;
        const y = Math.sin(angle) * 42;
        ctx.fillStyle = familyColors[item.family] || "#eaf8ff";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#07101b";
        ctx.font = "900 9px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.symbol, x, y + 0.5);
      });

      ctx.shadowBlur = 0;
      const hp = Math.max(0, spaceStation.health / spaceStation.maxHealth);
      ctx.fillStyle = "rgba(3, 8, 22, 0.72)";
      roundRect(-56, -92, 112, 8, 4);
      ctx.fill();
      ctx.fillStyle = hp > 0.5 ? "#0f9b8f" : "#e85d4f";
      roundRect(-56, -92, 112 * hp, 8, 4);
      ctx.fill();
      ctx.fillStyle = dockReady ? "#ffcf33" : "rgba(234, 248, 255, 0.78)";
      ctx.font = "900 11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(dockReady ? "PRESS D TO DOCK" : "SPACE STATION", 0, 76);
      ctx.restore();
    }

    // reactionForElements() builds strings and allocates a fresh object every
    // call, so drawBonds memoises the only two flags it actually needs.
    const bondStyleCache = new Map();
    function bondStyleFor(a, b) {
      const key = pairKey(a.symbol, b.symbol);
      let style = bondStyleCache.get(key);
      if (style === undefined) {
        const known = reactionForElements(a, b);
        style = known ? { explosive: Boolean(known.explosive), inferred: Boolean(known.inferred) } : null;
        bondStyleCache.set(key, style);
      }
      return style;
    }

    const BOND_RANGE = 148;
    const BOND_RANGE_SQUARED = BOND_RANGE * BOND_RANGE;

    function drawBonds() {
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          // Reject on cheap squared distance first — almost every pair fails here.
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= BOND_RANGE_SQUARED) continue;
          const known = bondStyleFor(a.element, b.element);
          const distance = Math.sqrt(distanceSquared);
          if (known) {
            const alpha = (1 - distance / 148) * 0.55;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = known.explosive ? "#e85d4f" : known.inferred ? "#2aa8d8" : "#11161b";
            ctx.lineWidth = known.explosive ? 2.8 : known.inferred ? 1.4 : 1.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = known.explosive ? "#e85d4f" : "#2aa8d8";
            ctx.beginPath();
            ctx.arc((a.x + b.x) / 2, (a.y + b.y) / 2, known.explosive ? 4 : 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function shouldHighlightMissionElement(node, missionSymbols) {
      if (!node?.element || !missionSymbols?.has(node.element.symbol)) return false;
      if (node.heldByUfo || node.heldByAstronaut || node.swallowedByBlackHole || node.trappedByTsunami) return false;
      return !stationHasSymbol(node.element.symbol);
    }

    // -- Element tile sprite cache -----------------------------------------
    // Every tile used to build a fresh linear gradient and lay out four runs of
    // text, every frame -- 118 tiles of that was the single biggest cost in the
    // frame. The face of a tile only depends on its element, so it is rendered
    // once into a small offscreen canvas and blitted from then on. Only the
    // state-dependent parts (glow, coloured border, mission beacon) are still
    // drawn live, and only for the handful of tiles that are in such a state.
    const TILE_SPRITE_SIZE = 64;
    const TILE_REFERENCE_SIZE = 38;          // the size the original constants were tuned at
    const TILE_K = TILE_SPRITE_SIZE / TILE_REFERENCE_SIZE;
    const tileSpriteCache = new Map();
    let tileSpriteScale = 0;

    function buildTileSprite(element) {
      const scale = Math.min(dpr || 1, 2);
      const sprite = document.createElement("canvas");
      sprite.width = Math.ceil(TILE_SPRITE_SIZE * scale);
      sprite.height = Math.ceil(TILE_SPRITE_SIZE * scale);
      const g = sprite.getContext("2d");
      g.setTransform(scale, 0, 0, scale, 0, 0);

      const color = familyColors[element.family];
      const S = TILE_SPRITE_SIZE;
      const inset = 0.5;                      // keeps the 1px border crisp inside the bitmap
      const w = S - inset * 2;
      const r = Math.min(7 * TILE_K, w / 2);

      g.beginPath();
      g.moveTo(inset + r, inset);
      g.lineTo(inset + w - r, inset);
      g.quadraticCurveTo(inset + w, inset, inset + w, inset + r);
      g.lineTo(inset + w, inset + w - r);
      g.quadraticCurveTo(inset + w, inset + w, inset + w - r, inset + w);
      g.lineTo(inset + r, inset + w);
      g.quadraticCurveTo(inset, inset + w, inset, inset + w - r);
      g.lineTo(inset, inset + r);
      g.quadraticCurveTo(inset, inset, inset + r, inset);
      g.closePath();

      const tileGradient = g.createLinearGradient(0, 0, S, S);
      tileGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      tileGradient.addColorStop(0.52, "rgba(255, 252, 244, 0.78)");
      tileGradient.addColorStop(1, color + "22");
      g.fillStyle = tileGradient;
      g.fill();
      g.lineWidth = 1;
      g.strokeStyle = "rgba(17, 22, 27, 0.25)";
      g.stroke();

      // family colour bar across the top, clipped to the rounded corners
      g.save();
      g.clip();
      g.fillStyle = color;
      g.fillRect(0, 0, S, 5 * TILE_K);
      g.restore();

      g.fillStyle = "rgba(17, 22, 27, 0.62)";
      g.font = "600 " + (8 * TILE_K) + "px SFMono-Regular, Consolas, monospace";
      g.textAlign = "left";
      g.fillText(String(element.n), 4 * TILE_K, 13 * TILE_K);

      g.textAlign = "center";
      g.fillStyle = "#11161b";
      g.font = "800 " + (18 * TILE_K) + "px Inter, system-ui, sans-serif";
      g.fillText(element.symbol, S / 2, S * 0.61);

      if (element.family === "radioactive") {
        g.fillStyle = color;
        g.font = "900 " + (9 * TILE_K) + "px Inter, system-ui, sans-serif";
        g.fillText("RAD", S / 2, S * 0.82);
      }

      g.fillStyle = "rgba(17, 22, 27, 0.52)";
      g.font = "600 " + (7 * TILE_K) + "px Inter, system-ui, sans-serif";
      g.fillText(element.family, S / 2, S - 5 * TILE_K);

      return sprite;
    }

    function tileSpriteFor(element) {
      const scale = Math.min(dpr || 1, 2);
      if (scale !== tileSpriteScale) {
        tileSpriteCache.clear();
        tileSpriteScale = scale;
      }
      let sprite = tileSpriteCache.get(element.symbol);
      if (!sprite) {
        sprite = buildTileSprite(element);
        tileSpriteCache.set(element.symbol, sprite);
      }
      return sprite;
    }

    function drawElementTile(node, t, missionSymbols) {
      if (node.swallowedByBlackHole) return;
      const color = familyColors[node.element.family];
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      const isTrapped = node.trappedByTsunami;
      const isHeld = Boolean(node.heldByAstronaut);
      const isCargo = Boolean(node.heldByUfo);
      const isDanger = node.dangerousUntil > t;
      const isMissionTarget = shouldHighlightMissionElement(node, missionSymbols);
      const isFamilyMatch = !activeFamily || node.element.family === activeFamily;
      const pulse = Math.sin(t * 0.003 + node.phase) * 0.04 + 1;
      const hoverScale = isHovered ? 1.18 : 1;
      const filterScale = isMissionTarget ? 1.16 : activeFamily && node.element.family === activeFamily ? 1.12 : 1;
      const size = node.size * pulse * filterScale;
      const visualSize = size * hoverScale;
      const x = node.x - visualSize / 2;
      const y = node.y - visualSize / 2;
      const low = lowPowerCached;
      const accent = isMissionTarget ? "#ffdf5f"
        : isDanger ? "#e85d4f"
        : isCargo ? "#ffcf33"
        : isHeld ? "#d49b2a"
        : isTrapped ? "#2aa8d8"
        : color;
      const highlighted = isMissionTarget || isDanger || isCargo || isHeld || isTrapped || node.selected || isHovered;
      const emphasised = highlighted || Boolean(activeFamily && isFamilyMatch);

      ctx.save();
      ctx.globalAlpha = isFamilyMatch ? 1 : 0.3;

      if (isMissionTarget) {
        const beacon = 0.62 + Math.sin(t * 0.006 + node.phase) * 0.22;
        ctx.globalAlpha = isFamilyMatch ? 1 : 0.55;
        ctx.shadowColor = "#ffdf5f";
        ctx.shadowBlur = low ? 14 : 28;
        ctx.strokeStyle = "rgba(255, 223, 95, " + beacon + ")";
        ctx.lineWidth = low ? 2 : 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, visualSize * (low ? 0.78 : 0.9), 0, Math.PI * 2);
        ctx.stroke();
        if (!low) {
          ctx.setLineDash([6, 8]);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(node.x, node.y, visualSize * 1.15, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Canvas shadows are expensive, so idle tiles no longer pay for one.
      if (emphasised) {
        ctx.shadowColor = accent;
        ctx.shadowBlur = low ? 10 : 24;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
      ctx.shadowOffsetY = 0;

      ctx.drawImage(tileSpriteFor(node.element), x, y, visualSize, visualSize);

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // The neutral border is baked into the sprite; anything else goes over it.
      if (emphasised) {
        roundRect(x, y, visualSize, visualSize, 7);
        ctx.lineWidth = 3;
        ctx.strokeStyle = accent;
        ctx.stroke();
      }
      if (isMissionTarget) {
        ctx.fillStyle = "#ffdf5f";
        ctx.fillRect(x, y, visualSize, 5);
      }

      if (isMissionTarget) {
        ctx.fillStyle = "rgba(11, 16, 25, 0.82)";
        ctx.shadowColor = "#ffdf5f";
        ctx.shadowBlur = low ? 0 : 10;
        ctx.font = "900 8px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        const tagWidth = Math.max(46, ctx.measureText("NEED").width + 16);
        roundRect(node.x - tagWidth / 2, y - 18, tagWidth, 14, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffdf5f";
        ctx.fillText("NEED", node.x, y - 8);
      }
      ctx.restore();
    }

    function drawCompound(compound, t) {
      const age = t - compound.createdAt;
      const alpha = Math.max(0, 1 - age / 9000);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = compound.color;
      ctx.shadowBlur = 28;
      ctx.font = "800 22px Inter, system-ui, sans-serif";
      const w = Math.max(74, ctx.measureText(compound.formula).width + 30);
      roundRect(compound.x - w / 2, compound.y - 22, w, 44, 8);
      const compoundGradient = ctx.createLinearGradient(compound.x - w / 2, compound.y - 22, compound.x + w / 2, compound.y + 22);
      compoundGradient.addColorStop(0, "rgba(255, 255, 255, 0.92)");
      compoundGradient.addColorStop(1, `${compound.color}2f`);
      ctx.fillStyle = compoundGradient;
      ctx.fill();
      ctx.strokeStyle = compound.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#11161b";
      ctx.textAlign = "center";
      ctx.fillText(compound.formula, compound.x, compound.y + 8);
      ctx.restore();
    }

    function addWaterEffect(x, y, now) {
      effects.push({ type: "water", x, y, born: now, drops: Array.from({ length: lowPowerMode() ? 14 : 34 }, () => ({
        angle: randomBetween(0, Math.PI * 2),
        speed: randomBetween(0.45, 2.4),
        radius: randomBetween(1.8, 5.8),
        wobble: randomBetween(0, Math.PI * 2)
      })) });
    }

    function addExplosionEffect(x, y, now) {
      effects.push({ type: "explosion", x, y, born: now, particles: Array.from({ length: lowPowerMode() ? 28 : 76 }, () => ({
        angle: randomBetween(0, Math.PI * 2),
        speed: randomBetween(2.1, 7.2),
        radius: randomBetween(1.8, 7),
        color: ["#ffcf33", "#ff6b35", "#e85d4f", "#11161b"][Math.floor(randomBetween(0, 4))]
      })) });
    }

    function addSimpleEffect(type, x, y, now) {
      if (lowPowerMode() && effects.length > 48) return;
      effects.push({ type, x, y, born: now });
    }

    function addScoreEffect(x, y, text, now) {
      if (lowPowerMode() && effects.length > 56) return;
      effects.push({ type: "score", x, y, text, born: now });
    }

    function addSynthesisEffect(x, y, now, formula, parsed, animation) {
      if (lowPowerMode() && effects.length > 42) return;
      const atoms = [];
      parsed.forEach((item) => {
        const count = Math.min(item.count, 4);
        for (let i = 0; i < count; i += 1) {
          atoms.push({
            symbol: item.symbol,
            color: familyColors[item.element.family],
            angle: randomBetween(0, Math.PI * 2),
            orbit: randomBetween(72, 138),
            phase: randomBetween(0, Math.PI * 2)
          });
        }
      });
      effects.push({ type: "synthesis", x, y, born: now, formula, animation, atoms });
    }

    function drawWaterEffect(effect, t) {
      const age = t - effect.born;
      const p = age / 2200;
      if (p > 1) return false;
      ctx.save();
      ctx.globalAlpha = 1 - p;
      for (let i = 0; i < 5; i += 1) {
        ctx.strokeStyle = i % 2 ? "rgba(46, 159, 219, 0.62)" : "rgba(15, 155, 143, 0.46)";
        ctx.lineWidth = 3 - i * 0.25;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 12 + p * 126 + i * 18, 0, Math.PI * 2);
        ctx.stroke();
      }
      const pool = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, 72 + p * 28);
      pool.addColorStop(0, `rgba(46, 159, 219, ${0.32 * (1 - p)})`);
      pool.addColorStop(1, "rgba(46, 159, 219, 0)");
      ctx.fillStyle = pool;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 96, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2e9fdb";
      effect.drops.forEach((drop) => {
        const d = p * drop.speed * 88;
        ctx.beginPath();
        ctx.arc(effect.x + Math.cos(drop.angle) * d, effect.y + Math.sin(drop.angle) * d + Math.sin(p * Math.PI + drop.wobble) * 22, drop.radius * (1 - p * 0.35), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      return true;
    }

    function drawExplosionEffect(effect, t) {
      const age = t - effect.born;
      const p = age / 1500;
      if (p > 1) return false;
      ctx.save();
      const flash = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, 150 * (1 - p + 0.2));
      flash.addColorStop(0, `rgba(255, 244, 190, ${0.9 * (1 - p)})`);
      flash.addColorStop(0.45, `rgba(255, 107, 53, ${0.55 * (1 - p)})`);
      flash.addColorStop(1, "rgba(232, 93, 79, 0)");
      ctx.fillStyle = flash;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 190, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.7 * (1 - p);
      ctx.strokeStyle = "#ffcf33";
      ctx.lineWidth = 5 * (1 - p) + 1;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 22 + p * 180, 0, Math.PI * 2);
      ctx.stroke();
      (effect.particles || []).forEach((particle) => {
        const d = p * particle.speed * 72;
        ctx.globalAlpha = 1 - p;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(effect.x + Math.cos(particle.angle) * d, effect.y + Math.sin(particle.angle) * d, particle.radius * (1 - p * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      return true;
    }

    function drawSynthesisEffect(effect, t) {
      const age = t - effect.born;
      const p = age / 2600;
      if (p > 1) return false;
      const gather = Math.min(1, p / 0.62);
      const bloom = Math.max(0, (p - 0.48) / 0.52);
      ctx.save();
      effect.atoms.forEach((atom, index) => {
        const orbit = atom.orbit * (1 - gather) + 22 * gather;
        const angle = atom.angle + p * 7 + index * 0.36;
        const x = effect.x + Math.cos(angle) * orbit;
        const y = effect.y + Math.sin(angle) * orbit * 0.62;
        ctx.globalAlpha = 1 - bloom * 0.45;
        ctx.strokeStyle = atom.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 252, 244, 0.9)";
        ctx.shadowColor = atom.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = atom.color;
        ctx.font = "800 13px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(atom.symbol, x, y + 5);
      });

      ctx.globalAlpha = Math.min(1, bloom * 1.2);
      ctx.shadowColor = effect.animation === "water" ? "#2e9fdb" : "#d49b2a";
      ctx.shadowBlur = 30;
      ctx.font = "900 28px Inter, system-ui, sans-serif";
      const w = Math.max(86, ctx.measureText(effect.formula).width + 36);
      roundRect(effect.x - w / 2, effect.y - 26, w, 52, 8);
      ctx.fillStyle = "rgba(255, 252, 244, 0.86)";
      ctx.fill();
      ctx.strokeStyle = effect.animation === "water" ? "#2e9fdb" : "#d49b2a";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#101418";
      ctx.textAlign = "center";
      ctx.fillText(effect.formula, effect.x, effect.y + 10);
      ctx.restore();
      return true;
    }

    function drawBumpEffect(effect, t) {
      const age = t - effect.born;
      const p = age / 520;
      if (p > 1) return false;
      ctx.save();
      ctx.globalAlpha = 1 - p;
      ctx.strokeStyle = "#2aa8d8";
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 7; i += 1) {
        const angle = i * Math.PI * 2 / 7 + p * 1.8;
        const inner = 8 + p * 10;
        const outer = 18 + p * 34;
        ctx.beginPath();
        ctx.moveTo(effect.x + Math.cos(angle) * inner, effect.y + Math.sin(angle) * inner);
        ctx.lineTo(effect.x + Math.cos(angle) * outer, effect.y + Math.sin(angle) * outer);
        ctx.stroke();
      }
      ctx.restore();
      return true;
    }

    function drawSimpleEffect(effect, t) {
      const age = t - effect.born;
      const p = age / 1400;
      if (p > 1) return false;
      ctx.save();
      ctx.globalAlpha = 1 - p;
      ctx.strokeStyle = effect.type === "gas" ? "#2e79bd" : "#d49b2a";
      ctx.fillStyle = effect.type === "gas" ? "rgba(46, 121, 189, 0.12)" : "rgba(212, 155, 42, 0.16)";
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.arc(effect.x + Math.cos(i) * p * 54, effect.y + Math.sin(i * 1.7) * p * 38, 10 + p * 22, 0, Math.PI * 2);
        if (effect.type === "gas") ctx.stroke();
        else ctx.fill();
      }
      ctx.restore();
      return true;
    }

    function drawScoreEffect(effect, t) {
      const age = t - effect.born;
      const p = age / 1300;
      if (p > 1) return false;
      ctx.save();
      ctx.globalAlpha = 1 - p;
      ctx.fillStyle = "#101418";
      ctx.strokeStyle = "rgba(255, 252, 244, 0.9)";
      ctx.lineWidth = 4;
      ctx.font = "900 24px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeText(effect.text, effect.x, effect.y - p * 46);
      ctx.fillText(effect.text, effect.x, effect.y - p * 46);
      ctx.restore();
      return true;
    }

    function drawShockwaveEffect(effect, t) {
      const age = t - effect.born;
      const k = age / 520;
      if (k > 1) return false;
      const eased = easeOutCubic(k);
      ctx.save();
      ctx.globalAlpha = (1 - k) * 0.75;
      ctx.strokeStyle = effect.color || "#ffcf33";
      ctx.lineWidth = Math.max(1, 7 * (1 - k));
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 8 + effect.radius * eased, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return true;
    }

    function drawMuzzleEffect(effect, t) {
      const age = t - effect.born;
      const k = age / 110;
      if (k > 1) return false;
      const size = 16 * (1 - k) + 5;
      ctx.save();
      ctx.globalAlpha = (1 - k) * 0.9;
      ctx.translate(effect.x, effect.y);
      ctx.rotate(effect.angle);
      ctx.fillStyle = effect.color || "#fff4b8";
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    }

    function drawEffects(t) {
      effects = effects.filter((effect) => {
        if (t < effect.born) return true;
        if (effect.type === "water") return drawWaterEffect(effect, t);
        if (effect.type === "explosion") return drawExplosionEffect(effect, t);
        if (effect.type === "synthesis") return drawSynthesisEffect(effect, t);
        if (effect.type === "bump") return drawBumpEffect(effect, t);
        if (effect.type === "score") return drawScoreEffect(effect, t);
        if (effect.type === "shockwave") return drawShockwaveEffect(effect, t);
        if (effect.type === "muzzle") return drawMuzzleEffect(effect, t);
        return drawSimpleEffect(effect, t);
      });
    }

    function drawSpaceship(t) {
      if (!spaceship) return;
      const angle = Math.atan2(spaceship.vy, spaceship.vx);
      const glow = 0.75 + Math.sin(t * 0.006) * 0.2;
      const tier = game.evolutionTier || 0;
      const evoColor = ["#2aa8d8", "#0f9b8f", "#ffcf33", "#e85d4f", "#8067c8", "#35d0ba", "#f77f5e", "#b7d12a", "#f2f7ff", "#b163ff"][Math.min(9, tier)];
      const low = lowPowerMode();

      ctx.save();
      ctx.translate(spaceship.x, spaceship.y);
      ctx.rotate(angle);
      ctx.shadowColor = evoColor;
      ctx.shadowBlur = low ? 8 + tier * 2 : 24 + tier * 8;

      if (tier > 0) {
        ctx.save();
        ctx.rotate(-angle);
        ctx.globalAlpha = 0.22 + tier * 0.035;
        ctx.strokeStyle = evoColor;
        ctx.lineWidth = 2 + tier * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, spaceship.radius + 34 + Math.sin(t * 0.008) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (spaceship.following) {
        ctx.save();
        ctx.rotate(-angle);
        ctx.globalAlpha = 0.78;
        ctx.strokeStyle = "#2aa8d8";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, spaceship.radius + 20 + Math.sin(t * 0.01) * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = 0.32 * glow;
      const beam = ctx.createRadialGradient(0, 34, 0, 0, 86, 86);
      beam.addColorStop(0, "rgba(42, 168, 216, 0.48)");
      beam.addColorStop(1, "rgba(42, 168, 216, 0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.ellipse(0, 62, 76, 44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.shadowBlur = 0;
      const hull = ctx.createLinearGradient(0, -24, 0, 30);
      hull.addColorStop(0, "rgba(255, 252, 244, 0.98)");
      hull.addColorStop(0.5, tier > 1 ? `${evoColor}cc` : "rgba(184, 208, 216, 0.96)");
      hull.addColorStop(1, "rgba(88, 112, 124, 0.92)");
      ctx.fillStyle = hull;
      ctx.strokeStyle = "rgba(17, 22, 27, 0.34)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, 10, 70, 24, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(16, 20, 24, 0.18)";
      ctx.beginPath();
      ctx.ellipse(0, 17, 54, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      const door = Math.max(0, Math.min(1, spaceship.tractorAnim ?? 0));
      ctx.save();
      ctx.translate(0, 28);
      ctx.fillStyle = spaceship.tractorActive ? "rgba(15, 155, 143, 0.72)" : "rgba(232, 93, 79, 0.58)";
      ctx.strokeStyle = "rgba(234, 248, 255, 0.42)";
      ctx.lineWidth = 1.4;
      ctx.shadowColor = spaceship.tractorActive ? "#0f9b8f" : "#e85d4f";
      ctx.shadowBlur = 10 + door * 10;
      roundRect(-28 - door * 13, -4, 24, 8, 4);
      ctx.fill();
      ctx.stroke();
      roundRect(4 + door * 13, -4, 24, 8, 4);
      ctx.fill();
      ctx.stroke();
      if (door > 0.08) {
        const range = spaceship.tractorRange * (0.42 + door * 0.58);
        const half = spaceship.tractorAngle * 0.5;
        ctx.globalAlpha = 0.12 + door * 0.32;
        const coneGradient = ctx.createLinearGradient(44, 0, range, 0);
        coneGradient.addColorStop(0, "rgba(15, 155, 143, 0.62)");
        coneGradient.addColorStop(0.55, "rgba(42, 168, 216, 0.28)");
        coneGradient.addColorStop(1, "rgba(42, 168, 216, 0)");
        ctx.fillStyle = coneGradient;
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.arc(50, 0, range, -half, half);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 0.4 + door * 0.3;
        ctx.strokeStyle = "rgba(135, 218, 255, 0.78)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(48, 0);
        ctx.lineTo(50 + Math.cos(-half) * range, Math.sin(-half) * range);
        ctx.moveTo(48, 0);
        ctx.lineTo(50 + Math.cos(half) * range, Math.sin(half) * range);
        ctx.stroke();
      }
      ctx.restore();

      const dome = ctx.createLinearGradient(0, -44, 0, 6);
      dome.addColorStop(0, "rgba(255, 255, 255, 0.92)");
      dome.addColorStop(0.42, "rgba(109, 193, 235, 0.72)");
      dome.addColorStop(1, "rgba(46, 121, 189, 0.64)");
      ctx.fillStyle = dome;
      ctx.strokeStyle = "rgba(17, 22, 27, 0.28)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-34, 3);
      ctx.quadraticCurveTo(-22, -36, 0, -40);
      ctx.quadraticCurveTo(27, -36, 34, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.ellipse(-10, -22, 11, 5, -0.35, 0, Math.PI * 2);
      ctx.fill();

      const lights = ["#e85d4f", "#d49b2a", "#0f9b8f", "#2aa8d8", "#8d6ab6"];
      lights.forEach((color, index) => {
        const x = -42 + index * 21;
        const pulse = 0.7 + Math.sin(t * 0.008 + index) * 0.25;
        ctx.shadowColor = color;
        ctx.shadowBlur = 14 * pulse;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, 18, 4.8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(17, 22, 27, 0.5)";
      ctx.font = "900 10px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(spaceship.rider ? `${spaceship.rider.name}` : "UFO", 0, 15);

      if (spaceship.rider) {
        ctx.fillStyle = spaceship.rider.name === "Clark" ? "#2aa8d8" : "#e85d4f";
        ctx.strokeStyle = "rgba(17, 22, 27, 0.2)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, -34, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "900 12px Inter, system-ui, sans-serif";
        ctx.fillText(spaceship.rider.initial, 0, -30);
      }
      ctx.restore();

      ctx.save();
      ctx.translate(spaceship.x, spaceship.y);
      if (spaceship.dodgeUntil > t) {
        ctx.globalAlpha = 0.72;
        ctx.strokeStyle = "#e85d4f";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 7]);
        ctx.beginPath();
        ctx.arc(0, 0, spaceship.radius + 28 + Math.sin(t * 0.012) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const hp = Math.max(0, spaceship.health / spaceship.maxHealth);
      ctx.fillStyle = "rgba(17, 22, 27, 0.18)";
      roundRect(-38, -72, 76, 7, 4);
      ctx.fill();
      ctx.fillStyle = hp > 0.45 ? "#2aa8d8" : "#e85d4f";
      roundRect(-38, -72, 76 * hp, 7, 4);
      ctx.fill();
      ctx.restore();
    }

    function drawShots(t) {
      shots.forEach((shot) => {
        const age = (t - shot.born) / 1600;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - age);
        ctx.strokeStyle = shot.color ? `${shot.color}88` : "rgba(42, 168, 216, 0.44)";
        ctx.lineWidth = shot.kind === "laser" ? 8 : shot.kind === "megaboom" ? 7 : 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        const tail = shot.kind === "laser" ? 7.8 : 2.2;
        ctx.moveTo(shot.x - shot.vx * tail, shot.y - shot.vy * tail);
        ctx.lineTo(shot.x, shot.y);
        ctx.stroke();
        if (shot.kind === "laser") {
          ctx.globalAlpha = Math.max(0, 0.46 - age * 0.2);
          ctx.strokeStyle = "rgba(255, 252, 244, 0.92)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shot.x - shot.vx * tail, shot.y - shot.vy * tail);
          ctx.lineTo(shot.x, shot.y);
          ctx.stroke();
        }
        ctx.shadowColor = shot.color || "#2aa8d8";
        ctx.shadowBlur = shot.kind === "megaboom" ? 24 : 14;
        ctx.fillStyle = shot.color || "#fff4b8";
        ctx.beginPath();
        ctx.arc(shot.x, shot.y, shot.kind === "megaboom" ? 10 : 5.5, 0, Math.PI * 2);
        ctx.fill();
        if (shot.kind === "megaboom") {
          ctx.strokeStyle = "rgba(255, 207, 51, 0.7)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(shot.x, shot.y, 16 + Math.sin(t * 0.02) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });
    }

    function drawEnergyOrbs(t) {
      energyOrbs.forEach((orb) => {
        const age = (t - orb.born) / 12000;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - age * 0.35);
        ctx.translate(orb.x, orb.y);
        ctx.shadowColor = "#ffcf33";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ffcf33";
        ctx.beginPath();
        ctx.arc(0, 0, 5 + Math.sin(t * 0.01 + orb.phase) * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 252, 244, 0.72)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawAstronauts(t) {
      astronauts.forEach((astronaut) => {
        const bob = Math.sin(t * 0.003 + astronaut.phase) * 3;
        ctx.save();
        ctx.translate(astronaut.x, astronaut.y + bob);
        ctx.rotate(Math.sin(t * 0.0017 + astronaut.phase) * 0.08);

        ctx.strokeStyle = "rgba(17, 22, 27, 0.18)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-15, 22);
        ctx.lineTo(-28, 38);
        ctx.moveTo(15, 22);
        ctx.lineTo(28, 38);
        ctx.moveTo(-20, 0);
        ctx.lineTo(-38, 13 + Math.sin(t * 0.004 + astronaut.phase) * 5);
        ctx.moveTo(20, 0);
        ctx.lineTo(38, 13 + Math.cos(t * 0.004 + astronaut.phase) * 5);
        ctx.stroke();

        ctx.fillStyle = "#2e79bd";
        ctx.strokeStyle = "rgba(17, 22, 27, 0.22)";
        ctx.lineWidth = 2;
        roundRect(-22, -6, 44, 42, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = astronaut.color;
        roundRect(-9, 4, 18, 10, 4);
        ctx.fill();

        ctx.save();
        ctx.translate(0, -34);
        ctx.rotate(astronaut.lookAngle - Math.PI / 2);
        ctx.fillStyle = "rgba(255, 252, 244, 0.96)";
        ctx.strokeStyle = "rgba(17, 22, 27, 0.24)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "rgba(16, 20, 24, 0.78)";
        ctx.beginPath();
        ctx.ellipse(0, -4, 15, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(42, 168, 216, 0.42)";
        ctx.beginPath();
        ctx.ellipse(-4, -7, 7, 3, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = astronaut.color;
        ctx.beginPath();
        ctx.arc(-18, 38, 7, 0, Math.PI * 2);
        ctx.arc(18, 38, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 252, 244, 0.9)";
        ctx.strokeStyle = "rgba(17, 22, 27, 0.16)";
        ctx.lineWidth = 1;
        roundRect(-38, 48, 76, 22, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#101418";
        ctx.font = "800 12px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(astronaut.name, 0, 63);
        ctx.restore();
      });
    }

    function drawOrganizer(t) {
      if (!organizer) return;

      ctx.save();
      ctx.translate(organizer.x, organizer.y + Math.sin(t * 0.003 + organizer.phase) * 3);
      ctx.rotate(Math.sin(t * 0.0016 + organizer.phase) * 0.07);

      ctx.globalAlpha = 0.72;
      ctx.strokeStyle = "rgba(128, 103, 200, 0.46)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 7]);
      ctx.beginPath();
      ctx.ellipse(0, -58, 58 + organizer.dreamPulse * 8, 24 + organizer.dreamPulse * 4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255, 252, 244, 0.72)";
      roundRect(-52, -74, 104, 30, 8);
      ctx.fill();
      ctx.fillStyle = "#8067c8";
      ctx.font = "900 10px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("1 2 3 ... table", 0, -55);

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(17, 22, 27, 0.18)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-17, 19);
      ctx.lineTo(-32, 32 + Math.sin(t * 0.005) * 4);
      ctx.moveTo(17, 19);
      ctx.lineTo(32, 32 + Math.cos(t * 0.005) * 4);
      ctx.stroke();

      ctx.fillStyle = "#8067c8";
      ctx.strokeStyle = "rgba(17, 22, 27, 0.22)";
      ctx.lineWidth = 2;
      roundRect(-20, -3, 40, 38, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 252, 244, 0.96)";
      ctx.beginPath();
      ctx.arc(0, -30, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(16, 20, 24, 0.72)";
      ctx.beginPath();
      ctx.arc(-7, -32, 2.4, 0, Math.PI * 2);
      ctx.arc(7, -32, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(16, 20, 24, 0.54)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, -26, 6, 0.15, Math.PI - 0.15);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 252, 244, 0.9)";
      ctx.strokeStyle = "rgba(17, 22, 27, 0.16)";
      ctx.lineWidth = 1;
      roundRect(-32, 42, 64, 22, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#101418";
      ctx.font = "900 12px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Mendeleev", 0, 57);
      ctx.restore();
    }

    function drawBlackHole(t) {
      if (!blackHole) return;

      ctx.save();
      ctx.translate(blackHole.x, blackHole.y);
      ctx.rotate(t * 0.0011 + blackHole.phase);

      const bossGlow = blackHole.enraged;
      const halo = ctx.createRadialGradient(0, 0, 8, 0, 0, blackHole.influence * 0.72);
      halo.addColorStop(0, bossGlow ? "rgba(28, 8, 8, 0.82)" : "rgba(16, 20, 24, 0.7)");
      halo.addColorStop(0.28, bossGlow ? "rgba(232, 93, 79, 0.28)" : "rgba(128, 103, 200, 0.24)");
      halo.addColorStop(0.62, bossGlow ? "rgba(255, 206, 45, 0.14)" : "rgba(42, 168, 216, 0.12)");
      halo.addColorStop(1, bossGlow ? "rgba(232, 93, 79, 0)" : "rgba(42, 168, 216, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, blackHole.influence * 0.72, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 3; i += 1) {
        ctx.save();
        ctx.rotate(i * Math.PI / 3 + t * (0.0018 + i * 0.00045));
        ctx.strokeStyle = bossGlow ? i === 0 ? "rgba(255, 70, 54, 0.95)" : i === 1 ? "rgba(255, 206, 45, 0.82)" : "rgba(232, 93, 79, 0.72)" : i === 0 ? "rgba(232, 93, 79, 0.8)" : i === 1 ? "rgba(212, 155, 42, 0.72)" : "rgba(42, 168, 216, 0.7)";
        ctx.lineWidth = (bossGlow ? 6 : 5) - i;
        ctx.beginPath();
        ctx.ellipse(0, 0, 74 + i * 15 + (bossGlow ? 18 : 0), 20 + i * 5 + (bossGlow ? 4 : 0), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.shadowColor = "rgba(17, 22, 27, 0.92)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#020307";
      ctx.beginPath();
      ctx.arc(0, 0, blackHole.radius, 0, Math.PI * 2);
      ctx.fill();

      if (blackHole.hurtUntil > t) {
        ctx.fillStyle = "rgba(232, 93, 79, 0.42)";
        ctx.beginPath();
        ctx.arc(0, 0, blackHole.radius + 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      const lookAngle = spaceship ? Math.atan2(spaceship.y - blackHole.y, spaceship.x - blackHole.x) - (t * 0.0011 + blackHole.phase) : 0;
      const pupilX = Math.cos(lookAngle) * 2.4;
      const pupilY = Math.sin(lookAngle) * 2.4;
      ctx.fillStyle = "rgba(255, 252, 244, 0.94)";
      ctx.beginPath();
      ctx.arc(-12, -10, 5.6, 0, Math.PI * 2);
      ctx.arc(12, -10, 5.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#020307";
      ctx.beginPath();
      ctx.arc(-12 + pupilX, -10 + pupilY, 2.4, 0, Math.PI * 2);
      ctx.arc(12 + pupilX, -10 + pupilY, 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#e85d4f";
      ctx.beginPath();
      ctx.ellipse(0, 13, 17, 8 + Math.sin(t * 0.009) * 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 252, 244, 0.95)";
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * 9 - 3, 8);
        ctx.lineTo(i * 9 + 3, 8);
        ctx.lineTo(i * 9, 15);
        ctx.closePath();
        ctx.fill();
      }

      if (blackHole.swallowed.length) {
        ctx.fillStyle = "rgba(255, 252, 244, 0.82)";
        ctx.font = "900 10px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        blackHole.swallowed.slice(0, 3).forEach((item, index) => {
          const angle = t * 0.01 + item.spin;
          ctx.fillText(item.node.element.symbol, Math.cos(angle) * (7 + index * 4), Math.sin(angle) * (5 + index * 3) + 1);
        });
      }

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 252, 244, 0.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, blackHole.radius + 4 + Math.sin(t * 0.004) * 2, 0, Math.PI * 2);
      ctx.stroke();
      if (blackHole.enraged) {
        ctx.strokeStyle = "rgba(255, 206, 45, 0.42)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, blackHole.radius + 14 + Math.sin(t * 0.014) * 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(blackHole.x, blackHole.y);
      const hp = Math.max(0, blackHole.health / blackHole.maxHealth);
      ctx.fillStyle = "rgba(17, 22, 27, 0.18)";
      roundRect(-44, -60, 88, 8, 4);
      ctx.fill();
      ctx.fillStyle = hp > 0.42 ? "#0f9b8f" : "#e85d4f";
      roundRect(-44, -60, 88 * hp, 8, 4);
      ctx.fill();
      ctx.fillStyle = "rgba(17, 22, 27, 0.72)";
      ctx.font = "900 10px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(blackHole.enraged ? "BOSS MODE: release trapped elements" : "monster black hole", 0, -66);
      ctx.restore();
    }

    function drawMiniBlackHoles(t) {
      miniBlackHoles.forEach((mini) => {
        ctx.save();
        ctx.translate(mini.x, mini.y);
        ctx.rotate(t * 0.002 + mini.phase);
        const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, mini.influence * 0.55);
        halo.addColorStop(0, "rgba(16, 20, 24, 0.62)");
        halo.addColorStop(0.45, "rgba(128, 103, 200, 0.2)");
        halo.addColorStop(1, "rgba(128, 103, 200, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, mini.influence * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(232, 93, 79, 0.7)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#020307";
        ctx.beginPath();
        ctx.arc(0, 0, mini.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    function drawTornado(t) {
      if (!tornado) return;

      ctx.save();
      ctx.translate(tornado.x, tornado.y);
      ctx.globalAlpha = 0.86;
      for (let i = 0; i < 7; i += 1) {
        const p = i / 6;
        const y = -58 + p * 118;
        const rx = 56 - p * 36 + Math.sin(t * 0.006 + i + tornado.phase) * 5;
        const ry = 12 - p * 5;
        ctx.strokeStyle = i % 2 ? "rgba(15, 155, 143, 0.66)" : "rgba(42, 168, 216, 0.58)";
        ctx.lineWidth = 4 - p * 1.8;
        ctx.beginPath();
        ctx.ellipse(Math.sin(t * 0.004 + i) * 9, y, rx, Math.max(4, ry), t * 0.002 + i * 0.52, 0, Math.PI * 2);
        ctx.stroke();
      }

      const funnel = ctx.createLinearGradient(-46, -60, 36, 60);
      funnel.addColorStop(0, "rgba(255, 252, 244, 0)");
      funnel.addColorStop(0.45, "rgba(42, 168, 216, 0.18)");
      funnel.addColorStop(1, "rgba(15, 155, 143, 0.32)");
      ctx.fillStyle = funnel;
      ctx.beginPath();
      ctx.moveTo(-50, -56);
      ctx.quadraticCurveTo(12, -10, 12, 58);
      ctx.quadraticCurveTo(-4, 66, -16, 58);
      ctx.quadraticCurveTo(-4, -8, 50, -56);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawMeteors(t) {
      meteors.forEach((meteor) => {
        ctx.save();
        ctx.translate(meteor.x, meteor.y);
        const angle = Math.atan2(meteor.vy, meteor.vx);
        ctx.rotate(angle);

        const trail = ctx.createLinearGradient(-86, 0, 18, 0);
        trail.addColorStop(0, "rgba(232, 93, 79, 0)");
        trail.addColorStop(0.45, "rgba(232, 93, 79, 0.42)");
        trail.addColorStop(1, "rgba(255, 207, 51, 0.88)");
        ctx.fillStyle = trail;
        ctx.beginPath();
        ctx.moveTo(-92, -meteor.radius * 0.55);
        ctx.lineTo(4, -meteor.radius * 0.9);
        ctx.lineTo(20, 0);
        ctx.lineTo(4, meteor.radius * 0.9);
        ctx.lineTo(-92, meteor.radius * 0.55);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = "#ff6b35";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ffcf33";
        ctx.beginPath();
        ctx.arc(14, 0, meteor.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e85d4f";
        ctx.beginPath();
        ctx.arc(9, -4, meteor.radius * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    function drawTsunami(t) {
      if (!tsunami) return;

      ctx.save();
      ctx.globalAlpha = 0.82;
      const topPoints = [];
      const startX = Math.max(-40, tsunami.x - 230);
      const endX = Math.min(width + 60, tsunami.x + 260);
      for (let x = startX; x <= endX; x += 18) {
        const local = x - tsunami.x;
        const crest = tsunami.y + Math.sin(local * 0.026 + t * 0.004 + tsunami.phase) * 24;
        const lift = Math.max(0, 1 - Math.abs(local) / 250) * 52;
        topPoints.push({ x, y: crest - lift });
      }

      const gradient = ctx.createLinearGradient(0, tsunami.y - tsunami.height, 0, tsunami.y + tsunami.height);
      gradient.addColorStop(0, "rgba(255, 252, 244, 0.52)");
      gradient.addColorStop(0.28, "rgba(42, 168, 216, 0.42)");
      gradient.addColorStop(1, "rgba(46, 121, 189, 0.16)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(startX, height + 40);
      topPoints.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.lineTo(endX, height + 40);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 252, 244, 0.82)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      topPoints.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      ctx.save();
      ctx.translate(tsunami.x - 24, tsunami.y - 48);
      ctx.rotate(Math.sin(t * 0.001 + tsunami.phase) * 0.12);
      ctx.strokeStyle = "rgba(255, 252, 244, 0.9)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let a = -0.25; a <= Math.PI * 1.72; a += 0.16) {
        const r = 18 + a * 24;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.72;
        if (a <= -0.24) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(42, 168, 216, 0.54)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 74 + Math.sin(t * 0.004) * 5, -0.35, Math.PI * 1.72);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(42, 168, 216, 0.46)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        const y = tsunami.y + i * 24 + Math.sin(t * 0.003 + i) * 8;
        ctx.beginPath();
        ctx.moveTo(startX + i * 18, y);
        ctx.quadraticCurveTo(tsunami.x, y + 18, endX - i * 10, y - 6);
        ctx.stroke();
      }

      if (tsunami.captured.length > 1) {
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = "rgba(255, 252, 244, 0.76)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 9]);
        ctx.beginPath();
        tsunami.captured.forEach((item, index) => {
          const next = tsunami.captured[(index + 1) % tsunami.captured.length];
          const wave = Math.sin(t * 0.008 + index) * 18;
          ctx.moveTo(item.node.x, item.node.y);
          ctx.quadraticCurveTo(
            (item.node.x + next.node.x) / 2,
            (item.node.y + next.node.y) / 2 + wave,
            next.node.x,
            next.node.y
          );
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    }

    function pushApart(a, b, strength) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const nx = dx / distance;
      const ny = dy / distance;
      a.vx -= nx * strength;
      a.vy -= ny * strength;
      b.vx += nx * strength;
      b.vy += ny * strength;
    }

    function triggerReaction(a, b, now, automatic = false) {
      const x = (a.x + b.x) / 2;
      const y = (a.y + b.y) / 2;
      const result = reactionForElements(a.element, b.element);
      const report = automatic ? setAutoMessage : setMessage;

      if (result?.explosive) {
        addExplosionEffect(x, y, now);
        compounds.push({
          formula: result.formula,
          x,
          y,
          vx: randomBetween(-0.18, 0.18),
          vy: randomBetween(-0.12, 0.12),
          phase: randomBetween(0, Math.PI * 2),
          color: "#e85d4f",
          createdAt: now
        });
        report(`${a.element.symbol} + ${b.element.symbol} -> ${result.formula}`, result.note);
        recordCompound(result.formula, x, y);
        pushApart(a, b, 1.45);
        return true;
      } else if (result) {
        if (result.animation === "water") addWaterEffect(x, y, now);
        else addSimpleEffect(result.animation, x, y, now);
        compounds.push({
          formula: result.formula,
          x,
          y,
          vx: randomBetween(-0.18, 0.18),
          vy: randomBetween(-0.12, 0.12),
          phase: randomBetween(0, Math.PI * 2),
          color: result.animation === "water" ? "#2e9fdb" : result.inferred ? "#2aa8d8" : "#d49b2a",
          createdAt: now
        });
        report(`${a.element.symbol} + ${b.element.symbol} -> ${result.formula}`, result.note);
        recordCompound(result.formula, x, y);
        pushApart(a, b, 0.88);
        return true;
      }

      if (!automatic) {
        addSimpleEffect("gas", x, y, now);
        setMessage(`${a.element.symbol} + ${b.element.symbol}`, "No stable compound in this mini lab yet. The elements drift apart.");
        pushApart(a, b, 0.8);
      }
      return false;
    }

    function runLookupReaction(now) {
      const pairInput = parseElementPair(lookupInput.value);
      if (pairInput) {
        const [a, b] = pairInput;
        const result = reactionForElements(a, b);
        const x = Math.max(width * 0.56, Math.min(width - 190, width * 0.62));
        const y = Math.max(160, Math.min(height - 160, height * 0.48));
        if (!result) {
          addSimpleEffect("gas", x, y, now);
          setMessage(`Lookup reaction: ${a.symbol} + ${b.symbol}`, "No simple rule prediction for this pair yet.");
          return;
        }
        const parsed = parseFormula(result.formula).filter((item) => item.element);
        addSynthesisEffect(x, y, now, result.formula, parsed, result.animation || "crystal");
        if (result.explosive) addExplosionEffect(x, y, now + 180);
        else if (result.animation === "water") addWaterEffect(x, y, now + 520);
        else addSimpleEffect(result.animation || "crystal", x, y, now + 520);
        setMessage(`Lookup reaction: ${a.symbol} + ${b.symbol} -> ${result.formula}`, result.note);
        compounds.push({
          formula: result.formula,
          x,
          y: y + 62,
          vx: randomBetween(-0.12, 0.12),
          vy: randomBetween(-0.08, 0.08),
          phase: randomBetween(0, Math.PI * 2),
          color: result.explosive ? "#e85d4f" : result.inferred ? "#2aa8d8" : "#d49b2a",
          createdAt: now
        });
        recordCompound(result.formula, x, y);
        return;
      }

      const result = resolveSubstance(lookupInput.value);
      if (!result.value || !result.parsed || result.unknown.length) {
        lookupSubstance(lookupInput.value);
        return;
      }

      const unique = result.parsed.map((item) => item.symbol);
      const x = Math.max(width * 0.56, Math.min(width - 190, width * 0.62));
      const y = Math.max(160, Math.min(height - 160, height * 0.48));
      const pair = unique.length >= 2 ? pairKey(unique[0], unique[1]) : `${unique[0]}+${unique[0]}`;
      const explosive = explosiveReactions[pair];
      const reaction = reactions[pair];
      const animation = reaction?.animation || (result.formula.includes("O") ? "spark" : "gas");
      const displayName = result.direct ? result.direct.name : result.formula;

      addSynthesisEffect(x, y, now, result.formula, result.parsed, animation);
      if (explosive) {
        addExplosionEffect(x, y, now + 180);
        setMessage(`Lookup reaction: ${result.formula}`, `${displayName} uses ${prettyElements(result.parsed)}. ${explosive.note}`);
      } else {
        if (animation === "water") addWaterEffect(x, y, now + 520);
        else addSimpleEffect(animation, x, y, now + 520);
        setMessage(`Lookup reaction: ${result.formula}`, `${displayName} uses ${prettyElements(result.parsed)}.`);
      }

      compounds.push({
        formula: result.formula,
        x,
        y: y + 62,
        vx: randomBetween(-0.12, 0.12),
        vy: randomBetween(-0.08, 0.08),
        phase: randomBetween(0, Math.PI * 2),
        color: animation === "water" ? "#2e9fdb" : explosive ? "#e85d4f" : "#d49b2a",
        createdAt: now
      });
      recordCompound(result.formula, x, y);
    }

    function combineSelection(now) {
      if (selected.length < 2) return;
      const a = selected[0];
      const b = selected[1];
      triggerReaction(a, b, now, false);
      a.selected = false;
      b.selected = false;
      selected = [];
      updateSlots();
    }

    function nodeAt(x, y) {
      if (spaceshipAt(x, y)) return null;
      for (let i = nodes.length - 1; i >= 0; i -= 1) {
        const node = nodes[i];
        if (node.trappedByTsunami || node.heldByAstronaut || node.heldByUfo || node.swallowedByBlackHole) continue;
        const half = node.size * (hoveredNode && hoveredNode.id === node.id ? 0.7 : 0.6);
        if (x >= node.x - half && x <= node.x + half && y >= node.y - half && y <= node.y + half) {
          return node;
        }
      }
      return null;
    }

    function spaceshipAt(x, y) {
      if (!spaceship) return false;
      return Math.abs(x - spaceship.x) <= spaceship.radius + 34 && Math.abs(y - spaceship.y) <= spaceship.radius + 16;
    }

    function chooseNode(node) {
      if (!node) return;
      if (node.selected) {
        node.selected = false;
        selected = selected.filter((item) => item.id !== node.id);
        updateSlots();
        return;
      }
      if (selected.length >= 2) {
        selected.forEach((item) => { item.selected = false; });
        selected = [];
      }
      node.selected = true;
      selected.push(node);
      updateSlots();
      if (selected.length === 1) {
        setMessage(`${node.element.name} selected`, `Pick one more element to combine with ${node.element.symbol}.`);
      }
      if (selected.length === 2) {
        combineSelection(performance.now());
      }
    }

    // The simulation integrates per call (node.x += node.vx), with no delta term,
    // so its speed was tied to the display refresh rate: on a 120Hz iPad Pro the
    // whole game ran at double speed. Physics is therefore stepped at a fixed
    // 60Hz and simply skipped on the extra frames, which leaves every existing
    // update function untouched while making the pace identical everywhere.
    const SIMULATION_STEP_MS = 1000 / 60;
    let nextSimulationAt = 0;

    function loop(t) {
      const low = lowPowerCached;
      // A little tolerance so a 60Hz display never skips a step to rounding.
      const shouldStep = t >= nextSimulationAt - 1 && t >= hitstopUntil;
      if (shouldStep) {
        // After a tab switch or a long stall, resync instead of catching up.
        nextSimulationAt = (t - nextSimulationAt > 250)
          ? t + SIMULATION_STEP_MS
          : nextSimulationAt + SIMULATION_STEP_MS;
      }
      drawBackground(t);
      // Everything after the backdrop rides the camera shake. The backdrop
      // itself stays put, which keeps the cleared area exact and reads fine.
      const shake = currentShakeOffset(t);
      if (shake) {
        ctx.save();
        ctx.translate(shake.x, shake.y);
      }
      if (running && shouldStep) {
        if (fireHeld) shootUfo(t);
        updateNodes(t);
        updateShots(t);
        updateEnergyOrbs(t);
        autoReactNearby(t);
      }
      if (!low) drawBonds();
      compounds = compounds.filter((compound) => t - compound.createdAt < 9500);
      compounds.forEach((compound) => drawCompound(compound, t));
      if (hazards.blackHole) drawBlackHole(t);
      if (hazards.blackHole) drawMiniBlackHoles(t);
      if (hazards.tornado) drawTornado(t);
      if (hazards.tsunami) drawTsunami(t);
      drawSpaceStation(t);
      const missionSymbols = currentMissionSymbols();
      nodes.forEach((node) => drawElementTile(node, t, missionSymbols));
      drawAstronauts(t);
      drawMeteors(t);
      drawEnergyOrbs(t);
      drawShots(t);
      drawSpaceship(t);
      drawEffects(t);
      if (shake) ctx.restore();
      updateGameTimer(t);
      updateTooltip();
      if (readout?.dataset.debug === "true" && t - lastReadoutUpdateAt > 500) {
        lastReadoutUpdateAt = t;
        const activeHazards = Object.entries(hazards).filter(([, active]) => active).map(([name]) => name).join(", ") || "off";
        readout.innerHTML = `elements: ${nodes.length}<br>compounds: ${compounds.length}<br>hazards: ${activeHazards}<br>effects: ${effects.length}`;
      }
      updateWeaponCooldowns(t);
      if (t - lastPanelUpdateAt > (low ? 180 : 100)) {
        lastPanelUpdateAt = t;
        updatePlayHud();
        // The old panel only needs refreshing while it is actually on screen.
        if (menuOpen) updateGamePanel();
      }
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", requestResize);
    window.addEventListener("orientationchange", requestResize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", requestResize);
    // -- Pointer / touch control -------------------------------------------
    // Previously the UFO could only be flown by grabbing the ship itself, which
    // is a small target and near-impossible for a child on a touch screen. Now a
    // press anywhere on the field flies the UFO to your finger, and a quick tap
    // (short, without moving) still selects an element tile. The same code path
    // serves mouse and touch, so behaviour cannot drift between them.
    const TAP_MOVE_TOLERANCE = 12;   // css px of slop still counted as a tap
    const TAP_TIME_LIMIT = 350;      // ms
    let activePointerId = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartAt = 0;
    let pointerDragging = false;
    let grabbedShip = false;

    const isCoarsePointer = () => lowPowerQuery.matches || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    function steerTowards(x, y) {
      if (!spaceship || spaceship.keyboardControl) return;
      spaceship.following = true;
      spaceship.targetX = x;
      spaceship.targetY = y;
    }

    function beginPointer(event) {
      if (activePointerId !== null) return;
      activePointerId = event.pointerId;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerStartAt = performance.now();
      pointerDragging = false;
      grabbedShip = Boolean(spaceshipAt(event.clientX, event.clientY));
      pointer = { x: event.clientX, y: event.clientY, active: true };

      if (grabbedShip) {
        // Grabbing the ship steers immediately, exactly as it always did.
        spaceshipPressed = true;
        pointerDragging = true;
        steerTowards(event.clientX, event.clientY);
        canvas.style.cursor = "grabbing";
      }
      if (canvas.setPointerCapture) {
        try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* ignore */ }
      }
    }

    function movePointer(event) {
      pointer = { x: event.clientX, y: event.clientY, active: true };

      if (activePointerId === event.pointerId && !pointerDragging) {
        const movedFar = Math.abs(event.clientX - pointerStartX) > TAP_MOVE_TOLERANCE
          || Math.abs(event.clientY - pointerStartY) > TAP_MOVE_TOLERANCE;
        if (movedFar) pointerDragging = true;
      }
      if (activePointerId === event.pointerId && pointerDragging) {
        steerTowards(event.clientX, event.clientY);
      }

      // Hover affordances only make sense for a mouse.
      if (event.pointerType === "mouse") {
        const overSpaceship = spaceshipAt(event.clientX, event.clientY);
        hoveredNode = overSpaceship ? null : nodeAt(event.clientX, event.clientY);
        canvas.style.cursor = spaceshipPressed ? "grabbing" : overSpaceship ? "grab" : hoveredNode ? "pointer" : "default";
        updateTooltip();
      }
    }

    function endPointer(event) {
      if (activePointerId !== event.pointerId) return;
      const heldFor = performance.now() - pointerStartAt;
      const wasTap = !pointerDragging && heldFor < TAP_TIME_LIMIT;

      if (wasTap && !grabbedShip) {
        const tappedNode = nodeAt(event.clientX, event.clientY);
        if (tappedNode) {
          chooseNode(tappedNode);
        } else if (isCoarsePointer()) {
          // On a touch screen an empty tap is the friendliest "go there" gesture.
          steerTowards(event.clientX, event.clientY);
        }
      }

      activePointerId = null;
      pointerDragging = false;
      grabbedShip = false;
      spaceshipPressed = false;
      if (spaceship && !spaceship.keyboardControl) spaceship.following = false;
      if (event.pointerType !== "mouse") {
        pointer.active = false;
        hoveredNode = null;
        updateTooltip();
      }
      canvas.style.cursor = "default";
      if (canvas.releasePointerCapture) {
        try { canvas.releasePointerCapture(event.pointerId); } catch (error) { /* ignore */ }
      }
    }

    canvas.addEventListener("pointerdown", beginPointer);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);
    window.addEventListener("pointerleave", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      pointer.active = false;
      spaceshipPressed = false;
      if (spaceship && !spaceship.keyboardControl) spaceship.following = false;
      hoveredNode = null;
      canvas.style.cursor = "default";
      updateTooltip();
    });

    // Stop iOS from turning game gestures into page zoom / rubber-band scroll.
    canvas.addEventListener("touchstart", (event) => event.preventDefault(), { passive: false });
    canvas.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
    document.addEventListener("gesturestart", (event) => event.preventDefault());
    document.addEventListener("dblclick", (event) => event.preventDefault());

    familyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveFamily(button.dataset.family);
      });
    });
    hazardButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.dataset.hazard;
        setHazardActive(name, !hazards[name]);
      });
    });
    lookupInput.addEventListener("input", () => {
      lookupSubstance(lookupInput.value);
    });
    lookupInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runLookupReaction(performance.now());
      }
    });
    startGameButton.addEventListener("click", startGame);
    nextMissionButton.addEventListener("click", nextMissionCard);
    resetGameButton.addEventListener("click", resetGame);
    toolButtons.forEach((button) => {
      button.addEventListener("click", () => setTool(button.dataset.tool));
    });
    weaponButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedWeapon = button.dataset.weapon || "bolt";
        setAutoMessage("Weapon selected", `UFO weapon: ${button.textContent}.`);
        updateGamePanel();
      });
    });
    clarkSkillButton.addEventListener("click", useClarkHelp);
    bradleySkillButton.addEventListener("click", useBradleyShip);
    kidsModeButton.addEventListener("click", toggleKidsMode);
    soundToggleButton.addEventListener("click", () => {
      game.sound = !game.sound;
      updateGamePanel();
      playTone(700, 0.08);
    });
    fireUfoButton.addEventListener("click", () => {
      shootUfo(performance.now());
      setMessage("UFO defense", "Use Fire or press Space to shoot the monster black hole.");
    });
    function holdVacuumButton(event) {
      event.preventDefault();
      vacuumUfoButton.classList.add("is-held");
      setTractorBeam(true);
    }

    function releaseVacuumButton(event) {
      event.preventDefault();
      vacuumUfoButton.classList.remove("is-held");
      setTractorBeam(false);
    }

    // ── Play HUD ──────────────────────────────────────────────────────────
    // The mission panels are not deleted, they are moved into the menu overlay.
    // Moving a node keeps its identity, so every listener and every cached
    // reference elsewhere in this file keeps working untouched.
    const playHud = document.querySelector("#playHud");
    const hudFormula = document.querySelector("#hudFormula");
    const hudChips = document.querySelector("#hudChips");
    const hudScore = document.querySelector("#hudScore");
    const hudTime = document.querySelector("#hudTime");
    const hudHull = document.querySelector("#hudHull");
    const hudEnergy = document.querySelector("#hudEnergy");
    const weaponBar = document.querySelector("#weaponBar");
    const menuOverlay = document.querySelector("#menuOverlay");
    const menuBody = document.querySelector("#menuBody");
    const openMenuButton = document.querySelector("#openMenu");
    const closeMenuButton = document.querySelector("#closeMenu");
    const startScreen = document.querySelector("#startScreen");
    const startPlayButton = document.querySelector("#startPlay");

    if (menuBody && labPanel && gamePanel) menuBody.append(labPanel, gamePanel);

    // -- weapon bar ---------------------------------------------------------
    const weaponSlots = new Map();

    function buildWeaponBar() {
      if (!weaponBar) return;
      weaponBar.innerHTML = "";
      WEAPON_ORDER.forEach((name) => {
        const spec = WEAPONS[name];
        const slot = document.createElement("button");
        slot.type = "button";
        slot.className = "weapon-slot";
        slot.style.setProperty("--weapon-color", spec.color);
        slot.dataset.weapon = name;
        slot.setAttribute("aria-label", `${spec.label} — ${spec.role} (key ${spec.key})`);
        slot.innerHTML = `
          <span class="weapon-key">${spec.key}</span>
          <span class="weapon-dot"></span>
          <span class="weapon-name">${spec.label}</span>
          <span class="weapon-role">${spec.role}</span>
          <span class="weapon-cooldown"></span>
        `;
        slot.addEventListener("click", () => selectWeapon(name));
        weaponBar.append(slot);
        weaponSlots.set(name, { slot, cooldown: slot.querySelector(".weapon-cooldown") });
      });
    }

    function selectWeapon(name) {
      if (!WEAPONS[name]) return;
      selectedWeapon = name;
      weaponSlots.forEach((parts, key) => parts.slot.classList.toggle("is-active", key === name));
      if (!reducedMotion) replayAnimation(weaponSlots.get(name)?.slot, "just-picked");
      weaponButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.weapon === name));
      setAutoMessage("Weapon selected", `${WEAPONS[name].label} — ${WEAPONS[name].role}.`);
      playTone(720, 0.05);
    }

    // Redrawn every frame: a weapon's readiness is the one thing that has to be
    // live, and it is only four transform writes.
    function updateWeaponCooldowns(t) {
      if (!spaceship) return;
      const cargoCount = spaceship.cargo?.length || 0;
      weaponSlots.forEach((parts, name) => {
        const spec = WEAPONS[name];
        const since = t - (spaceship.lastShotAt || 0);
        const limit = cargoCount ? CARGO_SHOT_COOLDOWN : spec.cooldown;
        const remaining = Math.max(0, 1 - since / limit);
        parts.cooldown.style.transform = `scaleX(${remaining.toFixed(3)})`;
      });
      if (weaponBar) {
        const cargoLabel = spaceship.cargo?.map((node) => node.element.symbol).join(" ") || "";
        weaponBar.classList.toggle("has-cargo", cargoCount > 0);
        if (cargoCount > 0) weaponBar.dataset.cargo = cargoLabel;
      }
    }

    // -- the rest of the HUD, refreshed on the same cadence as the panel ------
    let hudChipsKey = "";
    let lastHudScore = null;
    let previouslyCollected = new Set();
    const hitFlashLayer = document.querySelector("#hitFlash");

    // Restart a CSS animation by removing the class and forcing a reflow.
    function replayAnimation(element, className) {
      if (!element) return;
      element.classList.remove(className);
      void element.offsetWidth;
      element.classList.add(className);
    }

    function flashHitVignette() {
      if (reducedMotion) return;
      replayAnimation(hitFlashLayer, "is-firing");
    }

    function updatePlayHud() {
      const mission = currentMission();
      const targets = collectionTargetItems();
      const missionTargets = targets.filter((item) => item.type === "mission");
      if (hudFormula) hudFormula.textContent = missionTargets.map((item) => item.label).join(" + ") || mission.formula;

      const chipsKey = targets.map((item) => `${item.label}:${item.collected ? 1 : 0}`).join("|");
      if (hudChips && chipsKey !== hudChipsKey) {
        hudChipsKey = chipsKey;
        hudChips.innerHTML = targets
          .map((item) => `<span class="hud-chip ${item.collected ? "is-collected" : ""}">${item.label}</span>`)
          .join("");
        // Pop only the chips that became collected since the last render.
        const nowCollected = new Set(targets.filter((item) => item.collected).map((item) => item.label));
        if (!reducedMotion) {
          targets.forEach((item, index) => {
            if (item.collected && !previouslyCollected.has(item.label)) {
              hudChips.children[index]?.classList.add("just-collected");
            }
          });
        }
        previouslyCollected = nowCollected;
      }

      if (hudScore && game.score !== lastHudScore) {
        hudScore.textContent = game.score;
        if (lastHudScore !== null && game.score > lastHudScore) replayAnimation(hudScore, "is-bumped");
        lastHudScore = game.score;
      }
      if (hudTime) {
        const secondsLeft = Math.max(0, Math.ceil(game.timeLeft));
        hudTime.textContent = secondsLeft;
        hudTime.parentElement.classList.toggle("is-urgent", secondsLeft <= 15);
      }
      if (hudHull && spaceship) {
        const hullPercent = Math.max(0, Math.min(100, spaceship.health / spaceship.maxHealth * 100));
        hudHull.style.width = `${hullPercent}%`;
        hudHull.parentElement.parentElement.classList.toggle("is-critical", hullPercent <= 30);
      }
      if (hudEnergy) {
        const tier = game.evolutionTier || 0;
        const needed = energyNeededForEvolution();
        const atMax = tier >= evolutionNames.length - 1;
        hudEnergy.style.width = `${atMax ? 100 : Math.max(0, Math.min(100, game.energy / needed * 100))}%`;
      }
    }

    // -- menu ---------------------------------------------------------------
    let menuOpen = false;

    function setMenuOpen(open) {
      menuOpen = open;
      if (!menuOverlay) return;
      menuOverlay.hidden = !open;
      // Pausing while the menu is up keeps a child from being eaten mid-read.
      running = !open;
      if (open) {
        updateGamePanel();
        closeMenuButton?.focus();
      }
    }

    openMenuButton?.addEventListener("click", () => setMenuOpen(true));
    closeMenuButton?.addEventListener("click", () => setMenuOpen(false));
    menuOverlay?.addEventListener("click", (event) => {
      if (event.target === menuOverlay) setMenuOpen(false);
    });

    // -- start screen -------------------------------------------------------
    function dismissStartScreen() {
      if (!startScreen || startScreen.hidden) return;
      startScreen.hidden = true;
      startGame();
    }

    startPlayButton?.addEventListener("click", dismissStartScreen);

    buildWeaponBar();
    selectWeapon(selectedWeapon);

    // Thumb controls mirror the keyboard actions exactly; they are simply a
    // bigger target for a child on a tablet.
    const touchVacuumButton = document.querySelector("#touchVacuum");
    const touchFireButton = document.querySelector("#touchFire");
    const touchDockButton = document.querySelector("#touchDock");

    if (touchVacuumButton) {
      const holdTouchVacuum = (event) => {
        event.preventDefault();
        touchVacuumButton.classList.add("is-held");
        setTractorBeam(true);
      };
      const releaseTouchVacuum = (event) => {
        event.preventDefault();
        touchVacuumButton.classList.remove("is-held");
        setTractorBeam(false);
      };
      touchVacuumButton.addEventListener("pointerdown", holdTouchVacuum);
      touchVacuumButton.addEventListener("pointerup", releaseTouchVacuum);
      touchVacuumButton.addEventListener("pointercancel", releaseTouchVacuum);
      touchVacuumButton.addEventListener("pointerleave", releaseTouchVacuum);
    }

    if (touchFireButton) {
      touchFireButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        shootUfo(performance.now());
      });
    }

    if (touchDockButton) {
      touchDockButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        depositCargoToStation();
      });
    }

    vacuumUfoButton.addEventListener("pointerdown", holdVacuumButton);
    vacuumUfoButton.addEventListener("pointerup", releaseVacuumButton);
    vacuumUfoButton.addEventListener("pointercancel", releaseVacuumButton);
    vacuumUfoButton.addEventListener("pointerleave", releaseVacuumButton);
    window.addEventListener("keydown", (event) => {
      if (document.activeElement === lookupInput) return;
      if (event.key === "Escape" && guidePopover?.classList.contains("is-open")) {
        event.preventDefault();
        setGuideOpen(false);
        return;
      }
      if (event.key === "Escape" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        if (startScreen && !startScreen.hidden) dismissStartScreen();
        else setMenuOpen(!menuOpen);
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        // Holding the key keeps firing; the weapon cooldown still sets the rate.
        fireHeld = true;
        shootUfo(performance.now());
        return;
      }
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        setTractorBeam(true);
        return;
      }
      // Number keys now pick weapons, which is what a child reaches for first;
      // the crew swap moved to Z / X (and B still boards Bradley as before).
      const weaponByKey = WEAPON_ORDER.find((name) => WEAPONS[name].key === event.key);
      if (weaponByKey) {
        event.preventDefault();
        selectWeapon(weaponByKey);
        return;
      }
      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        boardNamedAstronaut("Clark");
        return;
      }
      if (event.key.toLowerCase() === "x" || event.key.toLowerCase() === "b") {
        event.preventDefault();
        boardNamedAstronaut("Bradley");
        return;
      }
      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        ejectCrew();
        return;
      }
      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        depositCargoToStation();
        return;
      }
      if (!(event.key in arrowKeys)) return;
      event.preventDefault();
      arrowKeys[event.key] = true;
      if (spaceship) {
        spaceship.following = true;
        spaceship.keyboardControl = true;
      }
      setMessage("Keyboard control", "Use arrow keys to fly the UFO. Press Space to shoot.");
    });
    window.addEventListener("keyup", (event) => {
      if (event.code === "Space") fireHeld = false;
      if (document.activeElement !== lookupInput && event.key.toLowerCase() === "c") {
        event.preventDefault();
        vacuumUfoButton.classList.remove("is-held");
        setTractorBeam(false);
        return;
      }
      if (!(event.key in arrowKeys)) return;
      event.preventDefault();
      arrowKeys[event.key] = false;
      const anyArrowDown = Object.values(arrowKeys).some(Boolean);
      if (spaceship && !anyArrowDown && !spaceshipPressed) {
        spaceship.keyboardControl = false;
        spaceship.following = false;
      }
    });
    openCodexButton.addEventListener("click", () => {
      updateCodex();
      codexModal.classList.add("is-open");
      codexModal.setAttribute("aria-hidden", "false");
    });
    closeCodexButton.addEventListener("click", () => {
      codexModal.classList.remove("is-open");
      codexModal.setAttribute("aria-hidden", "true");
    });
    function setGuideOpen(open) {
      guidePopover?.classList.toggle("is-open", open);
      guidePopover?.setAttribute("aria-hidden", open ? "false" : "true");
      guideToggleButton?.classList.toggle("is-active", open);
      guideToggleButton?.setAttribute("aria-expanded", open ? "true" : "false");
    }

    guideToggleButton?.addEventListener("click", () => {
      setGuideOpen(!guidePopover?.classList.contains("is-open"));
    });
    closeGuideButton?.addEventListener("click", () => setGuideOpen(false));
    techTree.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tech]");
      if (!button) return;
      spendTechPoint(button.dataset.tech);
    });

    shuffleButton.addEventListener("click", () => {
      makeNodes();
      setMessage("Shuffled.", "New floating elements are ready. Try H + O for water.");
      autoMessage.innerHTML = "<strong>Auto reaction</strong>Waiting for nearby elements to react.";
      autoMessage.classList.add("is-idle");
    });
    pauseButton.addEventListener("click", () => {
      running = !running;
      pauseButton.setAttribute("aria-label", running ? "Pause motion" : "Resume motion");
      pauseButton.setAttribute("title", running ? "Pause motion" : "Resume motion");
      pauseIcon.innerHTML = running
        ? '<path d="M10 4H6v16h4V4Z"></path><path d="M18 4h-4v16h4V4Z"></path>'
        : '<path d="M8 5v14l11-7L8 5Z"></path>';
    });

    resize();
    startMissionClock(performance.now());
    updateGamePanel();
    requestAnimationFrame(loop);
