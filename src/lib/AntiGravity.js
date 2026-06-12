/**
 * AntiGravity.js — Browser-native physics animation library
 * Implements: bounce, disintegrate, explode, confetti, wobble, sparkle
 * Drop-in replacement for the AntiGravity API described in the BRIXO prompt.
 */

const DEFAULT_COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ec4899', '#3b82f6', '#ffffff'];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 108, g: 99, b: 255 };
}

// ─── Particle class ──────────────────────────────────────────
class Particle {
  constructor(x, y, color, vx, vy, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.size = size || randomBetween(4, 10);
    this.alpha = 1;
    this.rotation = randomBetween(0, Math.PI * 2);
    this.rotationSpeed = randomBetween(-0.2, 0.2);
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
  }

  update(gravity, friction) {
    this.vy += gravity;
    this.vx *= friction;
    this.vy *= friction;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= 0.012;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.5);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// ─── AntiGravity class ───────────────────────────────────────
class AntiGravity {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      mode: options.mode || 'bounce',
      gravity: options.gravity ?? 0.5,
      bounce: options.bounce ?? 0.4,
      friction: options.friction ?? 0.9,
      initialVelocityY: options.initialVelocityY ?? -8,
      duration: options.duration ?? 700,
      particleCount: options.particleCount ?? 30,
      particleColors: options.particleColors || DEFAULT_COLORS,
      spread: options.spread ?? 180,
      intensity: options.intensity ?? 0.3,
      frequency: options.frequency ?? 12,
      onComplete: options.onComplete || null,
      origin: options.origin || { x: 0.5, y: 0.5 },
    };

    this.canvas = null;
    this.ctx = null;
    this.raf = null;
    this.particles = [];
    this.startTime = null;
    this._destroyed = false;
    this._originalTransform = '';
    this._bounceVy = 0;
    this._bounceY = 0;
  }

  // ── Create overlay canvas ──
  _createCanvas() {
    const rect = this.element.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:fixed',
      `left:${rect.left}px`,
      `top:${rect.top}px`,
      `width:${Math.max(rect.width, window.innerWidth)}px`,
      `height:${Math.max(rect.height, window.innerHeight)}px`,
      'pointer-events:none',
      'z-index:99999',
    ].join(';');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    return { rect };
  }

  // ── Spawn particles ──
  _spawnParticles(cx, cy) {
    const { particleCount, particleColors, spread, gravity: g } = this.options;
    for (let i = 0; i < particleCount; i++) {
      const color = particleColors[i % particleColors.length];
      const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
      const speed = randomBetween(2, 8);
      const vx = Math.sin(angle) * speed;
      const vy = -Math.cos(angle) * speed;
      this.particles.push(new Particle(cx, cy, color, vx, vy));
    }
  }

  // ── MODES ─────────────────────────────────────────────────

  _runParticles() {
    const { duration, gravity, onComplete } = this.options;
    const loop = (ts) => {
      if (this._destroyed) return;
      if (!this.startTime) this.startTime = ts;
      const elapsed = ts - this.startTime;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach((p) => {
        p.update(gravity * 0.4, 0.97);
        p.draw(this.ctx);
      });
      this.particles = this.particles.filter((p) => p.alpha > 0);
      if (elapsed < duration && this.particles.length > 0) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this._cleanup();
        onComplete && onComplete();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  _modeBounce() {
    const { duration, gravity, bounce, friction, initialVelocityY, onComplete } = this.options;
    this._bounceVy = initialVelocityY;
    this._bounceY = 0;
    const originalTransform = this.element.style.transform;
    const loop = (ts) => {
      if (this._destroyed) return;
      if (!this.startTime) this.startTime = ts;
      const elapsed = ts - this.startTime;
      this._bounceVy += gravity * 0.5;
      this._bounceY += this._bounceVy;
      if (this._bounceY > 0) {
        this._bounceY = 0;
        this._bounceVy *= -bounce;
        if (Math.abs(this._bounceVy) < 0.5) {
          this.element.style.transform = originalTransform;
          this._cleanup();
          onComplete && onComplete();
          return;
        }
      }
      this.element.style.transform = `${originalTransform} translateY(${this._bounceY}px)`;
      if (elapsed < duration) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this.element.style.transform = originalTransform;
        this._cleanup();
        onComplete && onComplete();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  _modeWobble() {
    const { duration, intensity, frequency, onComplete } = this.options;
    const originalTransform = this.element.style.transform;
    const loop = (ts) => {
      if (this._destroyed) return;
      if (!this.startTime) this.startTime = ts;
      const elapsed = ts - this.startTime;
      const progress = elapsed / duration;
      const decay = 1 - progress;
      const wobble = Math.sin(elapsed * frequency * 0.01) * intensity * decay * 10;
      this.element.style.transform = `${originalTransform} rotate(${wobble}deg)`;
      if (elapsed < duration) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this.element.style.transform = originalTransform;
        this._cleanup();
        onComplete && onComplete();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  _modeExplode() {
    const { origin } = this.options;
    const { rect } = this._createCanvas();
    const cx = rect.left + rect.width * (origin.x || 0.5);
    const cy = rect.top + rect.height * (origin.y || 0.5);
    this._spawnParticles(cx, cy);
    this._runParticles();
  }

  _modeDisintegrate() {
    const { duration, gravity, onComplete, particleCount } = this.options;
    const rect = this.element.getBoundingClientRect();
    this._createCanvas();
    const colors = this.options.particleColors;
    for (let i = 0; i < particleCount; i++) {
      const px = rect.left + Math.random() * rect.width;
      const py = rect.top + Math.random() * rect.height;
      const color = colors[i % colors.length];
      const vx = randomBetween(-3, 3);
      const vy = randomBetween(-2, 1);
      this.particles.push(new Particle(px, py, color, vx, vy, randomBetween(3, 7)));
    }
    // Hide element while disintegrating
    const origOpacity = this.element.style.opacity;
    const origVisibility = this.element.style.visibility;
    let fadeFraction = 1;
    const loop = (ts) => {
      if (this._destroyed) return;
      if (!this.startTime) this.startTime = ts;
      const elapsed = ts - this.startTime;
      fadeFraction = Math.max(0, 1 - elapsed / (duration * 0.5));
      this.element.style.opacity = fadeFraction;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach((p) => {
        p.update(gravity * 0.3, 0.96);
        p.draw(this.ctx);
      });
      this.particles = this.particles.filter((p) => p.alpha > 0);
      if (elapsed < duration) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this.element.style.opacity = origOpacity;
        this._cleanup();
        onComplete && onComplete();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  _modeConfetti() {
    const { particleCount, particleColors, duration, gravity, onComplete, origin } = this.options;
    this._createCanvas();
    const spawnX = this.canvas.width * (origin?.x ?? 0.5);
    const spawnY = this.canvas.height * (origin?.y ?? 0);
    for (let i = 0; i < particleCount; i++) {
      const color = particleColors[i % particleColors.length];
      const vx = randomBetween(-5, 5);
      const vy = randomBetween(1, 6);
      this.particles.push(new Particle(spawnX + randomBetween(-50, 50), spawnY, color, vx, vy, randomBetween(6, 12)));
    }
    const loop = (ts) => {
      if (this._destroyed) return;
      if (!this.startTime) this.startTime = ts;
      const elapsed = ts - this.startTime;
      // Continuously spawn more confetti for the first 1/3 of duration
      if (elapsed < duration / 3 && this.particles.length < particleCount * 3) {
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.particles.push(new Particle(
          spawnX + randomBetween(-80, 80), spawnY - 10, color,
          randomBetween(-4, 4), randomBetween(2, 5), randomBetween(6, 12)
        ));
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach((p) => {
        p.update(gravity * 0.25, 0.99);
        p.draw(this.ctx);
      });
      this.particles = this.particles.filter((p) => p.alpha > 0 && p.y < this.canvas.height + 20);
      if (elapsed < duration) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this._cleanup();
        onComplete && onComplete();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  _modeSparkle() {
    const { particleCount, particleColors, duration, onComplete } = this.options;
    const rect = this.element.getBoundingClientRect();
    this._createCanvas();
    for (let i = 0; i < particleCount; i++) {
      const px = rect.left + Math.random() * rect.width;
      const py = rect.top + Math.random() * rect.height;
      const color = particleColors[i % particleColors.length];
      const speed = randomBetween(0.5, 2.5);
      const angle = Math.random() * Math.PI * 2;
      this.particles.push(new Particle(px, py, color, Math.cos(angle) * speed, Math.sin(angle) * speed - 1, randomBetween(3, 7)));
    }
    this._runParticles();
  }

  // ── Cleanup ──
  _cleanup() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }

  // ── Public API ───────────────────────────────────────────
  play() {
    const mode = this.options.mode;
    switch (mode) {
      case 'bounce':       return this._modeBounce();
      case 'wobble':       return this._modeWobble();
      case 'explode':      return this._modeExplode();
      case 'disintegrate': return this._modeDisintegrate();
      case 'confetti':     return this._modeConfetti();
      case 'sparkle':      return this._modeSparkle();
      default:             return this._modeBounce();
    }
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  destroy() {
    this._destroyed = true;
    this.stop();
    this._cleanup();
    // Restore any transform changes
    if (this.element && this._originalTransform !== undefined) {
      // No-op — transforms restored inline in mode handlers
    }
  }
}

export default AntiGravity;
