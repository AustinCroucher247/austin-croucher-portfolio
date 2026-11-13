import ashesKeyart from '../assets/ashes-keyart.webp';
import ashesNight from '../assets/ashes-night.webp';
import ashesBuild from '../assets/ashes-build.webp';
import ashesFlora from '../assets/ashes-flora.webp';
import ashesPlacing from '../assets/ashes-placing.webp';
import ashesCrafting from '../assets/ashes-crafting.webp';
import ashesOutpost from '../assets/ashes-outpost.webp';
import ashesColony from '../assets/ashes-colony.webp';
import ashesFireworks from '../assets/ashes-fireworks.webp';
import hollowCorridor from '../assets/hollow-corridor.webp';
import hollowRedLight from '../assets/hollow-red-light.webp';
import hollowRoom from '../assets/hollow-room.webp';
import hollowBed from '../assets/hollow-bed.webp';
import hollowTreatment from '../assets/hollow-treatment.webp';
import hollowCage from '../assets/hollow-cage.webp';
import hollowInventory from '../assets/hollow-inventory.webp';
import hollowKeypad from '../assets/hollow-keypad.webp';
import retroHome from '../assets/retro-home.webp';
import retroTetris from '../assets/retro-tetris.webp';
import planetJumper from '../assets/planet-jumper.webp';
import woodshop from '../assets/woodshop.webp';

// In-engine captures of Hollow Ward, saved by the project's own play-mode capture tests.
const hollowShots = [
  { src: hollowCorridor, caption: 'The main corridor, lights out', alt: 'A dark hospital corridor seen in first person, with a red light at the far end.' },
  { src: hollowRedLight, caption: 'Floor two, east corridor', alt: 'A corridor lit by a red emergency light, with a wheelchair against the wall.' },
  { src: hollowRoom, caption: 'Waking up in the patient room', alt: 'A bare patient room with a stained bed, a bedside cabinet and an IV stand.' },
  { src: hollowBed, caption: 'Flashlight on the bed', alt: 'A flashlight beam on a hospital bed with restraint straps.' },
  { src: hollowTreatment, caption: 'The treatment room', alt: 'An old treatment chair and its control machine in a dark tiled room.' },
  { src: hollowCage, caption: 'The records cage', alt: 'Filing cabinets behind a barred cage in the archive.' },
  { src: hollowInventory, caption: 'Inventory, with the heartbeat monitor', alt: 'The inventory screen showing a flashlight, its description and a heartbeat line reading caution.' },
  { src: hollowKeypad, caption: 'A locker keypad puzzle', alt: 'A flashlight beam on a keypad fitted to a metal locker.' },
];

export const profile = {
  name: 'Austin Croucher',
  role: 'Web Developer',
  location: 'Toronto area, Canada',
  email: 'austin.croucher@gmail.com',
  linkedin: 'https://www.linkedin.com/in/austincroucher/',
  github: 'https://github.com/AustinCroucher247',
  resume: '/Austin-Croucher-Resume.pdf',
};

export const facts = [
  { label: 'Now', value: 'Web Developer at The Design Cell' },
  { label: 'Based', value: 'Toronto area, Ontario' },
  { label: 'Works in', value: 'React, JavaScript, PHP, Node' },
  { label: 'Open to', value: 'Web development roles' },
];

/**
 * Featured work. `media.type` decides how the case study is illustrated:
 *   'hub'    – a live, coded miniature of the app (no private data shown)
 *   'images' – a lead image plus supporting screenshots
 *   'video'  – a muted, looping clip
 */
export const projects = [
  {
    id: 'household-hq',
    title: 'Household HQ',
    kind: 'Web app · PWA',
    year: '2026',
    status: 'In daily use · private',
    summary:
      'A private home platform: six small apps behind one login, synced live between two phones.',
    body:
      'It started as a replacement for a budget spreadsheet and grew into the place my household plans meals, picks movies, splits the credit card bill and keeps the grocery list. It is plain HTML, CSS and JavaScript with no build step, which keeps it fast and easy to change on a weeknight.',
    highlights: [
      {
        title: 'Real-time sync',
        text: 'Firebase Auth gates every page and Firestore keeps both devices current, with local storage as the offline fallback.',
      },
      {
        title: 'A budget engine that reads bank exports',
        text: 'It sorts each purchase into mine, theirs or shared, learns merchant rules as it goes, and keeps a rolling ledger of who owes whom.',
      },
      {
        title: 'An assistant that returns data, not prose',
        text: 'Recipe and movie suggestions come back from the LLM as tool calls, so they render as cards you can save in one tap.',
      },
      {
        title: 'Built for one thumb',
        text: 'Ticking a grocery item updates it in place. The list never reorders under your finger mid-shop.',
      },
    ],
    stack: ['JavaScript', 'HTML', 'CSS', 'Firebase Auth', 'Firestore', 'PWA', 'Claude API', 'TMDB API', 'Netlify'],
    media: { type: 'hub' },
    stats: [
      { value: 6, label: 'apps behind one login' },
      { value: 18, suffix: 'k', label: 'lines of JavaScript' },
      { value: 0, label: 'build steps or frameworks' },
      { value: 2, label: 'very demanding users' },
    ],
    flow: [
      { title: 'Two phones', text: 'An installable PWA. Works offline from local storage.' },
      { title: 'Sign-in gate', text: 'Firebase Auth on every page, two allowed accounts.' },
      { title: 'Firestore', text: 'One shared store. Changes reach the other phone live.' },
      { title: 'Assistant', text: 'LLM calls return tool results that render as cards.' },
    ],
  },
  {
    id: 'ashes-to-orbit',
    title: 'From Ashes to Orbit',
    kind: 'Game · Unity',
    year: '2026',
    status: 'In development',
    summary:
      'An isometric sci-fi colony sim. One crash survivor grows a settlement, then builds a rocket to bring the sleeping crew down from orbit.',
    body:
      'My long-running systems project. Every mechanic has to earn its place by serving the rocket: resource chains, power, research and defence all exist because the launch needs them.',
    highlights: [
      {
        title: 'One task system, from one unit to many',
        text: 'The player designates work; units claim jobs, path to them and carry them out. The system that moves a lone survivor on day one runs the whole colony later.',
      },
      {
        title: 'Six regions simulating at once',
        text: 'A 720 m home map and five outposts share one scene on a sparse grid, with scenery drawn as GPU instances to keep load times short.',
      },
      {
        title: 'Tested like software',
        text: 'Saves, autosaves, crafting, research and raids are covered by edit-mode and play-mode test suites.',
      },
    ],
    stack: ['Unity 6', 'C#', 'URP', 'NavMesh', 'Blender', 'Claude Code'],
    stats: [
      { value: 328, label: 'C# scripts' },
      { value: 62, suffix: 'k', label: 'lines of C#' },
      { value: 254, label: 'automated tests' },
      { value: 6, label: 'regions simulated at once' },
    ],
    media: {
      type: 'gallery',
      images: [
        { src: ashesKeyart, caption: 'Main menu', alt: 'From Ashes to Orbit main menu: a crashed colony ship burning on a volcanic plain under a large moon.' },
        { src: ashesNight, caption: 'First night, with the salvage mech online', alt: 'Night-time gameplay: a salvage mech beside two base modules, with the mech status panel open.' },
        { src: ashesBuild, caption: 'Construction catalogue', alt: 'The construction menu listing base modules such as Cargo Bay, Power Plant and Hydroponics Lab.' },
        { src: ashesFlora, caption: 'Alien flora near the crash site', alt: 'Glowing alien trees and small creatures near the crash site.' },
        { src: ashesPlacing, caption: 'Levelling a build pad', alt: 'A blue build pad being levelled by the mech at night, with a progress ring.' },
        { src: ashesCrafting, caption: 'Field crafting', alt: 'The field crafting window with an oxygen filter recipe selected.' },
        { src: ashesOutpost, caption: 'An outpost in a second region', alt: 'A small base of modules in an orange desert region.' },
        { src: ashesColony, caption: 'Colony overview across all regions', alt: 'The colony screen, a table listing each region with its crew, power and storage.' },
        { src: ashesFireworks, caption: 'Night at the crash site', alt: 'The crash site at night with fireworks in the corner of the sky.' },
      ],
    },
  },
  {
    id: 'hollow-ward',
    title: 'Hollow Ward',
    kind: 'Game · Unity',
    year: '2026',
    status: 'In development · chapter one',
    summary:
      'A first-person survival-horror puzzle game set in a hospital ward that should not be there.',
    body:
      'She follows a dropped wedding ring down a service stair, falls, and wakes in a ward she has never seen. There is a flashlight, no health bar, and puzzles you solve by reading the room.',
    highlights: [
      {
        title: 'Modular by design',
        text: 'Player, interaction, puzzles, enemies, save, audio and UI each live in their own assembly, so systems stay decoupled and testable.',
      },
      {
        title: 'The whole world saves',
        text: 'Autosaves at milestones and a Continue option restore every door, drawer and puzzle exactly as you left it.',
      },
      {
        title: 'Keyboard and controller together',
        text: 'Both work at all times, and on-screen prompts switch to match whichever one you touched last.',
      },
      {
        title: 'Health without a HUD',
        text: 'Getting hurt darkens the edges of the view and slows you down. The only readout is a heartbeat line in the inventory.',
      },
    ],
    stack: ['Unity 6', 'C#', 'URP', 'Blender', 'Claude Code'],
    stats: [
      { value: 199, label: 'C# scripts' },
      { value: 31, suffix: 'k', label: 'lines of C#' },
      { value: 166, label: 'automated tests' },
      { value: 17, label: 'separate assemblies' },
    ],
    media: {
      type: 'gallery',
      flashlight: true,
      // To lead with a gameplay clip, add: video: { src: '/media/hollow-ward.mp4', label: '...' }
      images: hollowShots,
    },
  },
];

export const earlier = {
  feature: {
    id: 'retro-rumble',
    title: 'Retro Rumble',
    year: '2023',
    kind: 'BrainStation capstone',
    summary:
      'An arcade in the browser. Tetris and Space Invaders, with accounts, leaderboards and live streams of other players’ games over WebSockets.',
    stack: ['React', 'Node', 'Express', 'MySQL', 'Socket.IO', 'Canvas'],
    images: [
      { src: retroHome, alt: 'Retro Rumble home page with a live Space Invaders stream in the centre.' },
      { src: retroTetris, alt: 'Tetris in play, with level, lines and points beside the board.' },
    ],
    games: [
      { title: 'Space Invaders', src: '/games/space-invaders/index.html' },
      { title: 'Tetris', src: '/games/tetris/index.html' },
    ],
    video: { title: 'Retro Rumble demo', src: '/media/retro-rumble.mp4' },
  },
  rest: [
    {
      id: 'planet-jumper',
      title: 'Planet Jumper',
      year: '2023',
      kind: 'Game',
      summary: 'A space-education platformer where gravity changes with the planet you land on.',
      stack: ['JavaScript', 'Canvas'],
      image: { src: planetJumper, alt: 'Planet Jumper title art.' },
      video: { title: 'Planet Jumper demo', src: '/media/planet-jumper.mp4' },
    },
    {
      id: 'croucher-woodshop',
      title: 'Croucher Woodshop',
      year: '2023',
      kind: 'Client site',
      summary: 'A portfolio site for a woodworking shop, with every page editable through a Strapi CMS.',
      stack: ['React', 'Strapi', 'Headless CMS'],
      image: { src: woodshop, alt: 'Croucher Woodshop home page.' },
      video: { title: 'Croucher Woodshop demo', src: '/media/woodshop.mp4' },
    },
  ],
};

export const experience = [
  {
    dates: '2023 — Now',
    role: 'Web Developer',
    org: 'The Design Cell',
    meta: 'Full-time · Burlington, ON',
    text: 'Agency development across the full life of a project: CMS-driven websites, contest and rebate platforms, learning modules and internal dashboards, built and maintained for client brands.',
  },
  {
    dates: '2026 — Now',
    role: 'Sales & Partnerships',
    org: 'Adver.Games',
    meta: 'Part-time contract · Toronto',
    text: 'Outbound and partnership development for interactive and experiential gaming projects. I run early discovery calls and demos, and translate what a client wants into something a team can build.',
  },
  {
    dates: '2019 — Now',
    role: 'Web Developer',
    org: 'GTA Mac Repair',
    meta: 'On call · Toronto',
    text: 'Contract builds and troubleshooting for small businesses: sites from scratch in PHP and MySQL, others on WordPress and Wix.',
  },
  {
    dates: '2020 — 2023',
    role: 'General Manager',
    org: 'Café Landwer',
    meta: 'Full-time · Toronto',
    text: 'Ran a $3M-a-year restaurant and a team of 85. It is where I learned to stay calm, plan ahead and talk to people when things go sideways.',
  },
  {
    dates: '2015 — 2019',
    role: 'Bar Manager',
    org: 'Milestones',
    meta: 'Full-time · Richmond Hill, ON',
    text: 'Designed an inventory system that produced the highest alcohol sales and lowest cost of any Ontario location, by a 10% margin.',
  },
];

export const education = [
  { dates: '2023', title: 'Diploma, Software Engineering', org: 'BrainStation' },
  { dates: '2014', title: 'BA (Honours), Philosophy', org: 'York University' },
  { dates: '2015', title: 'Certificate, Conflict Resolution', org: 'York University' },
];

export const toolbox = [
  { label: 'Front end', items: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS / Sass', 'Tailwind'] },
  { label: 'Back end', items: ['Node', 'Express', 'PHP', 'MySQL', 'Firebase'] },
  { label: 'Content', items: ['WordPress', 'Strapi', 'Sanity'] },
  { label: 'Also', items: ['Unity / C#', 'LLM APIs and tool use', 'Git', 'Netlify'] },
];
