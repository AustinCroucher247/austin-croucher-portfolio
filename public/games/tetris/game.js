/*
 * Tetris — originally a set of React components and hooks in Retro Rumble (2023),
 * rebuilt in 2026 as one small canvas game.
 *
 * Kept from the original: the 10 x 20 board, the piece shapes and colours, the ghost
 * piece, three previews, and the Level / Lines To Level / Points panel.
 * New: a 7-bag randomiser, wall kicks, lock delay, soft and hard drop scoring,
 * pause, restart and a saved best score.
 */

const COLS = 10;
const ROWS = 20;
const CELL = 30;
const LINES_PER_LEVEL = 10;
const LOCK_DELAY = 450; // ms a piece may rest before it locks
const BEST_KEY = 'retro-rumble.tetris.best';

const PIECES = {
  I: { color: '#48e0e4', shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  J: { color: '#4a63e0', shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { color: '#deab22', shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
  O: { color: '#e0dc22', shape: [[1, 1], [1, 1]] },
  S: { color: '#2bd43c', shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  T: { color: '#8a3fc9', shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  Z: { color: '#f04fc2', shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
};
const LINE_POINTS = [0, 100, 300, 500, 800];

const board = document.getElementById('board');
const ctx = board.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');
const el = {
  level: document.getElementById('level'),
  lines: document.getElementById('lines'),
  points: document.getElementById('points'),
  best: document.getElementById('best'),
  overlay: document.getElementById('overlay'),
  title: document.getElementById('overlay-title'),
  hint: document.getElementById('overlay-hint'),
};

board.width = COLS * CELL;
board.height = ROWS * CELL;

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch (e) {
    return 0;
  }
};

let state = 'ready'; // ready | playing | paused | over
let best = readBest();
let grid, piece, queue, bag, level, lines, points, dropTimer, lockTimer;

const emptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// 7-bag: every piece appears once before any repeats, so no long droughts.
function draw7() {
  if (bag.length === 0) {
    bag = Object.keys(PIECES);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  return bag.pop();
}

function spawn() {
  const type = queue.shift();
  queue.push(draw7());
  const shape = PIECES[type].shape.map((row) => [...row]);
  piece = { type, shape, row: 0, col: Math.floor((COLS - shape[0].length) / 2) };
  dropTimer = 0;
  lockTimer = 0;
  if (collides(piece.shape, piece.row, piece.col)) gameOver();
}

function collides(shape, row, col) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const r = row + y;
      const cl = col + x;
      if (cl < 0 || cl >= COLS || r >= ROWS) return true;
      if (r >= 0 && grid[r][cl]) return true;
    }
  }
  return false;
}

const rotated = (shape) => shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

function tryMove(dRow, dCol) {
  if (collides(piece.shape, piece.row + dRow, piece.col + dCol)) return false;
  piece.row += dRow;
  piece.col += dCol;
  if (dCol !== 0) lockTimer = 0;
  return true;
}

function tryRotate() {
  const shape = rotated(piece.shape);
  // Wall kicks: if the turn does not fit, nudge sideways or up before giving up.
  const kicks = [[0, 0], [0, -1], [0, 1], [0, -2], [0, 2], [-1, 0]];
  for (const [dRow, dCol] of kicks) {
    if (!collides(shape, piece.row + dRow, piece.col + dCol)) {
      piece.shape = shape;
      piece.row += dRow;
      piece.col += dCol;
      lockTimer = 0;
      return;
    }
  }
}

function ghostRow() {
  let row = piece.row;
  while (!collides(piece.shape, row + 1, piece.col)) row++;
  return row;
}

function hardDrop() {
  const row = ghostRow();
  points += (row - piece.row) * 2;
  piece.row = row;
  lock();
}

function lock() {
  piece.shape.forEach((line, y) =>
    line.forEach((filled, x) => {
      if (filled && piece.row + y >= 0) grid[piece.row + y][piece.col + x] = PIECES[piece.type].color;
    })
  );

  const kept = grid.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - kept.length;
  if (cleared > 0) {
    grid = [...Array.from({ length: cleared }, () => Array(COLS).fill(null)), ...kept];
    points += LINE_POINTS[cleared] * level;
    lines += cleared;
    level = Math.floor(lines / LINES_PER_LEVEL) + 1;
  }
  updatePanel();
  spawn();
}

// Milliseconds per row; gets faster each level and bottoms out at 70ms.
const dropInterval = () => Math.max(70, 800 * Math.pow(0.84, level - 1));

function update(dt) {
  if (state !== 'playing') return;
  dropTimer += dt;
  if (dropTimer >= dropInterval()) {
    dropTimer = 0;
    tryMove(1, 0);
  }
  if (collides(piece.shape, piece.row + 1, piece.col)) {
    lockTimer += dt;
    if (lockTimer >= LOCK_DELAY) lock();
  } else {
    lockTimer = 0;
  }
}

function cell(context, x, y, size, color, alpha = 1) {
  const pad = 1.5;
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.beginPath();
  context.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, size * 0.18);
  context.fill();
  // A soft highlight along the top edge, like the original CSS blocks.
  context.globalAlpha = alpha * 0.28;
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.roundRect(x + pad + 2, y + pad + 2, size - pad * 2 - 4, size * 0.22, size * 0.1);
  context.fill();
  context.globalAlpha = 1;
}

function draw() {
  ctx.fillStyle = '#22003f';
  ctx.fillRect(0, 0, board.width, board.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
  ctx.lineWidth = 1;
  for (let x = 1; x < COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL + 0.5, 0);
    ctx.lineTo(x * CELL + 0.5, board.height);
    ctx.stroke();
  }

  grid.forEach((row, y) => row.forEach((color, x) => color && cell(ctx, x * CELL, y * CELL, CELL, color)));

  if (piece && state !== 'ready') {
    const color = PIECES[piece.type].color;
    const ghost = ghostRow();
    piece.shape.forEach((line, y) =>
      line.forEach((filled, x) => {
        if (!filled) return;
        cell(ctx, (piece.col + x) * CELL, (ghost + y) * CELL, CELL, color, 0.2);
        cell(ctx, (piece.col + x) * CELL, (piece.row + y) * CELL, CELL, color);
      })
    );
  }

  drawNext();
}

function drawNext() {
  const size = 22;
  const slot = nextCanvas.height / 3;
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  queue.slice(0, 3).forEach((type, i) => {
    const { shape, color } = PIECES[type];
    const rows = shape.filter((row) => row.some(Boolean));
    const width = shape[0].length * size;
    const offsetX = (nextCanvas.width - width) / 2;
    const offsetY = i * slot + (slot - rows.length * size) / 2;
    rows.forEach((row, y) =>
      row.forEach((filled, x) => filled && cell(nextCtx, offsetX + x * size, offsetY + y * size, size, color))
    );
  });
}

function updatePanel() {
  el.level.textContent = level;
  el.lines.textContent = LINES_PER_LEVEL - (lines % LINES_PER_LEVEL);
  el.points.textContent = points;
  el.best.textContent = Math.max(best, points);
}

function showOverlay(title, hint) {
  el.title.textContent = title;
  el.hint.textContent = hint;
  el.overlay.hidden = false;
}

function start() {
  grid = emptyGrid();
  bag = [];
  queue = [draw7(), draw7(), draw7(), draw7()];
  level = 1;
  lines = 0;
  points = 0;
  state = 'playing';
  el.overlay.hidden = true;
  updatePanel();
  spawn();
}

function gameOver() {
  state = 'over';
  if (points > best) {
    best = points;
    try {
      localStorage.setItem(BEST_KEY, String(best));
    } catch (e) {
      /* storage unavailable */
    }
  }
  updatePanel();
  showOverlay('Game over', `${points} points. Press Enter to play again.`);
}

function togglePause() {
  if (state === 'playing') {
    state = 'paused';
    showOverlay('Paused', 'Press P to carry on.');
  } else if (state === 'paused') {
    state = 'playing';
    el.overlay.hidden = true;
  }
}

function press(code, repeat = false) {

  if (state === 'ready' || state === 'over') {
    // Enter only, so a hard drop that ends the game cannot restart it by accident.
    if (code === 'Enter' && !repeat) start();
    return;
  }
  if (code === 'KeyP' && !repeat) return togglePause();
  if (state !== 'playing') return;

  if (code === 'ArrowLeft') tryMove(0, -1);
  else if (code === 'ArrowRight') tryMove(0, 1);
  else if (code === 'ArrowDown') {
    if (tryMove(1, 0)) points += 1;
    dropTimer = 0;
    updatePanel();
  } else if (code === 'ArrowUp' && !repeat) tryRotate();
  else if (code === 'Space' && !repeat) hardDrop();
}

addEventListener('keydown', (event) => {
  if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) event.preventDefault();
  press(event.code, event.repeat);
});

// Touch: on-screen buttons send the same codes, and a tap on the overlay starts or resumes.
document.querySelectorAll('.touch button').forEach((button) =>
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    press(button.dataset.code);
  })
);
el.overlay.addEventListener('pointerdown', () => press(state === 'paused' ? 'KeyP' : 'Enter'));

addEventListener('blur', () => state === 'playing' && togglePause());
addEventListener('pointerdown', () => window.focus());

let last = performance.now();
function frame(now) {
  update(Math.min(now - last, 100));
  last = now;
  draw();
  requestAnimationFrame(frame);
}

grid = emptyGrid();
bag = [];
queue = [draw7(), draw7(), draw7(), draw7()];
level = 1;
lines = 0;
points = 0;
updatePanel();
showOverlay('Tetris', 'Press Enter to start.');
requestAnimationFrame(frame);
