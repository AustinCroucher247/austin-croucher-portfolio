/*
 * Space Invaders — originally written in 2023 for Retro Rumble, tidied up in 2026.
 *
 * What changed from the original: a frame-rate independent loop, start / pause /
 * restart states instead of a page reload, three lives, a fire-rate limit, waves
 * that ramp up, and entities removed safely (no setTimeout splices).
 */

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const livesEl = document.getElementById('lives');

const W = (canvas.width = 1024);
const H = (canvas.height = 576);

const sprite = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};
const shipImage = sprite('./spaceship.png');
const invaderImage = sprite('./invader.png');

const INVADER = { w: 31, h: 39, gap: 30 };
const PLAYER_SPEED = 7;
const FIRE_COOLDOWN = 14; // frames at 60fps
const BEST_KEY = 'retro-rumble.invaders.best';

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch (e) {
    return 0;
  }
};
const writeBest = (value) => {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch (e) {
    /* storage unavailable: the best score just lasts for this visit */
  }
};

const keys = { left: false, right: false, fire: false };
const stars = Array.from({ length: 110 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  r: Math.random() * 1.6 + 0.3,
  speed: Math.random() * 0.5 + 0.15,
}));

let state = 'ready'; // ready | playing | paused | over
let best = readBest();
let player, shots, bombs, grids, particles, score, lives, wave, spawnIn, cooldown, safeFor;

function reset() {
  player = { x: W / 2, y: H - 62, w: 60, h: 46, tilt: 0 };
  shots = [];
  bombs = [];
  grids = [];
  particles = [];
  score = 0;
  lives = 3;
  wave = 0;
  spawnIn = 30;
  cooldown = 0;
  safeFor = 0;
  updateHud();
}

function updateHud() {
  scoreEl.textContent = score;
  bestEl.textContent = Math.max(best, score);
  livesEl.textContent = '▲ '.repeat(Math.max(lives, 0)).trim() || '—';
}

function spawnGrid() {
  wave += 1;
  const columns = Math.floor(Math.random() * 5) + 5;
  const rows = Math.floor(Math.random() * 3) + 2;
  const invaders = [];
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      invaders.push({ x: col * INVADER.gap, y: row * INVADER.gap - rows * INVADER.gap });
    }
  }
  grids.push({
    invaders,
    vx: Math.min(2.2 + wave * 0.25, 5),
    drop: 0,
    shootIn: 60,
  });
}

function burst(x, y, color, count = 14) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      r: Math.random() * 2.6 + 0.6,
      life: 1,
      color,
    });
  }
}

function hitPlayer() {
  if (safeFor > 0) return;
  burst(player.x, player.y, '#ffffff', 26);
  lives -= 1;
  safeFor = 110;
  updateHud();
  if (lives <= 0) endGame();
}

function endGame() {
  state = 'over';
  if (score > best) {
    best = score;
    writeBest(best);
  }
  updateHud();
}

function update(dt) {
  stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > H) {
      star.y = 0;
      star.x = Math.random() * W;
    }
  });

  particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= 0.022 * dt;
  });
  particles = particles.filter((p) => p.life > 0);

  if (state !== 'playing') return;

  // Player
  const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x + dir * PLAYER_SPEED * dt));
  player.tilt += (dir * 0.15 - player.tilt) * Math.min(1, 0.25 * dt);
  safeFor = Math.max(0, safeFor - dt);

  cooldown -= dt;
  if (keys.fire && cooldown <= 0) {
    shots.push({ x: player.x, y: player.y - player.h / 2 });
    cooldown = FIRE_COOLDOWN;
  }

  shots.forEach((shot) => (shot.y -= 10 * dt));
  shots = shots.filter((shot) => shot.y > -10);

  bombs.forEach((bomb) => (bomb.y += bomb.vy * dt));
  bombs = bombs.filter((bomb) => bomb.y < H + 10);

  // Waves
  spawnIn -= dt;
  if (spawnIn <= 0 || grids.length === 0) {
    spawnGrid();
    spawnIn = Math.max(420, 900 - wave * 40) + Math.random() * 240;
  }

  grids.forEach((grid) => {
    const xs = grid.invaders.map((invader) => invader.x);
    const left = Math.min(...xs);
    const right = Math.max(...xs) + INVADER.w;
    let dy = 0;
    if ((right >= W && grid.vx > 0) || (left <= 0 && grid.vx < 0)) {
      grid.vx = -grid.vx;
      dy = INVADER.gap;
    }
    // Slide in from above the screen before starting the side-to-side march.
    const entering = Math.min(...grid.invaders.map((invader) => invader.y)) < 10;
    grid.invaders.forEach((invader) => {
      invader.x += grid.vx * dt;
      invader.y += dy + (entering ? 2.5 * dt : 0);
    });

    grid.shootIn -= dt;
    if (grid.shootIn <= 0 && !entering) {
      const shooter = grid.invaders[Math.floor(Math.random() * grid.invaders.length)];
      bombs.push({ x: shooter.x + INVADER.w / 2, y: shooter.y + INVADER.h, vy: 4 + Math.min(wave * 0.2, 3) });
      grid.shootIn = Math.max(45, 150 - wave * 8) + Math.random() * 60;
    }

    // Shots against invaders
    shots.forEach((shot) => {
      if (shot.dead) return;
      const target = grid.invaders.find(
        (invader) =>
          !invader.dead &&
          shot.x >= invader.x &&
          shot.x <= invader.x + INVADER.w &&
          shot.y >= invader.y &&
          shot.y <= invader.y + INVADER.h
      );
      if (!target) return;
      target.dead = true;
      shot.dead = true;
      score += 100;
      burst(target.x + INVADER.w / 2, target.y + INVADER.h / 2, '#baa0de');
    });
    grid.invaders = grid.invaders.filter((invader) => !invader.dead);

    // Invaders reaching the player's row ends the run.
    if (grid.invaders.some((invader) => invader.y + INVADER.h >= player.y - player.h / 2)) {
      lives = 0;
      burst(player.x, player.y, '#ffffff', 26);
      endGame();
    }
  });
  shots = shots.filter((shot) => !shot.dead);
  grids = grids.filter((grid) => grid.invaders.length > 0);

  // Bombs against the player
  bombs = bombs.filter((bomb) => {
    const hit =
      Math.abs(bomb.x - player.x) < player.w / 2 - 6 && Math.abs(bomb.y - player.y) < player.h / 2 - 4;
    if (hit) hitPlayer();
    return !hit;
  });

  updateHud();
}

function draw() {
  c.fillStyle = '#000';
  c.fillRect(0, 0, W, H);

  c.fillStyle = '#fff';
  stars.forEach((star) => {
    c.globalAlpha = 0.35 + star.r / 3;
    c.beginPath();
    c.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    c.fill();
  });
  c.globalAlpha = 1;

  grids.forEach((grid) =>
    grid.invaders.forEach((invader) => c.drawImage(invaderImage, invader.x, invader.y, INVADER.w, INVADER.h))
  );

  c.fillStyle = '#ff4b4b';
  shots.forEach((shot) => {
    c.beginPath();
    c.arc(shot.x, shot.y, 4, 0, Math.PI * 2);
    c.fill();
  });

  c.fillStyle = '#ffffff';
  bombs.forEach((bomb) => c.fillRect(bomb.x - 1.5, bomb.y, 3, 12));

  particles.forEach((p) => {
    c.globalAlpha = Math.max(p.life, 0);
    c.fillStyle = p.color;
    c.beginPath();
    c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    c.fill();
  });
  c.globalAlpha = 1;

  if (state !== 'over' && state !== 'ready') {
    // Blink while invulnerable after a hit.
    if (safeFor <= 0 || Math.floor(safeFor / 6) % 2 === 0) {
      c.save();
      c.translate(player.x, player.y);
      c.rotate(player.tilt);
      c.drawImage(shipImage, -player.w / 2, -player.h / 2, player.w, player.h);
      c.restore();
    }
  }

  if (state === 'ready') overlay('SPACE INVADERS', 'Press Enter or tap to start');
  if (state === 'paused') overlay('PAUSED', 'Press P or tap to carry on');
  if (state === 'over') overlay('GAME OVER', `Score ${score}  ·  Best ${best}  ·  Enter or tap to play again`);
}

function overlay(title, hint) {
  c.fillStyle = 'rgba(0, 0, 0, 0.62)';
  c.fillRect(0, 0, W, H);
  c.fillStyle = '#fff';
  c.textAlign = 'center';
  c.font = '500 44px ui-monospace, Menlo, Consolas, monospace';
  c.fillText(title, W / 2, H / 2 - 10);
  c.font = '16px ui-monospace, Menlo, Consolas, monospace';
  c.globalAlpha = 0.75;
  c.fillText(hint, W / 2, H / 2 + 34);
  c.globalAlpha = 1;
}

let last = performance.now();
function frame(now) {
  // dt is measured in 60fps frames and capped so a background tab cannot skip ahead.
  const dt = Math.min((now - last) / (1000 / 60), 3);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

function start() {
  reset();
  state = 'playing';
}

addEventListener('keydown', (event) => {
  const { code } = event;
  if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(code)) event.preventDefault();

  if (code === 'KeyA' || code === 'ArrowLeft') keys.left = true;
  if (code === 'KeyD' || code === 'ArrowRight') keys.right = true;
  if (code === 'Space') keys.fire = true;

  if (event.repeat) return;
  if ((code === 'Space' || code === 'Enter') && state === 'ready') start();
  else if (code === 'Enter' && state === 'over') start();
  else if (code === 'KeyP' && state === 'playing') state = 'paused';
  else if (code === 'KeyP' && state === 'paused') state = 'playing';
});

addEventListener('keyup', ({ code }) => {
  if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
  if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
  if (code === 'Space') keys.fire = false;
});

addEventListener('blur', () => {
  keys.left = keys.right = keys.fire = false;
  if (state === 'playing') state = 'paused';
});
addEventListener('pointerdown', () => window.focus());

// Touch: hold the on-screen buttons, and tap the screen to start, resume or play again.
document.querySelectorAll('.touch button').forEach((button) => {
  const set = (value) => (event) => {
    event.preventDefault();
    keys[button.dataset.key] = value;
  };
  button.addEventListener('pointerdown', set(true));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((type) => button.addEventListener(type, set(false)));
});
canvas.addEventListener('pointerdown', () => {
  if (state === 'ready' || state === 'over') start();
  else if (state === 'paused') state = 'playing';
});

reset();
requestAnimationFrame(frame);
