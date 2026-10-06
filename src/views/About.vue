<template>
  <div class="spiral-wrapper" ref="wrapEl">
    <div class="scene">
      <div class="world" ref="worldEl">
        <article
          v-for="(c, i) in cards"
          :key="i"
          :ref="(el) => (cardEls[i] = el)"
          class="card"
          :class="{ 'card--fun': c.type === 'fun' }"
        >
          <!-- 01 — Bio -->
          <template v-if="c.type === 'bio'">
            <div class="label">01 / WHO</div>
            <h3 class="card-title">Maikl</h3>
            <p class="lead">Web developer &amp; cybersecurity student, based in Prague.</p>
            <div class="status"><i></i> Available for work</div>
          </template>

          <!-- 02 — Stack -->
          <template v-else-if="c.type === 'stack'">
            <div class="label">02 / STACK</div>
            <h3 class="card-title">Tools of the trade</h3>
            <div v-for="s in stack" :key="s.name" class="stack">
              <div class="stack-head">{{ s.name }}</div>
              <div class="chips">
                <span v-for="it in s.items" :key="it" class="chip">{{ it }}</span>
              </div>
            </div>
          </template>

          <!-- 03 — Journey -->
          <template v-else-if="c.type === 'journey'">
            <div class="label">03 / JOURNEY</div>
            <h3 class="card-title">The path so far</h3>
            <ul class="timeline">
              <li v-for="j in journey" :key="j.title">
                <span class="dot-mark"></span>
                <div>
                  <div class="t-title">{{ j.title }}</div>
                  <div class="t-desc">{{ j.desc }}</div>
                </div>
              </li>
            </ul>
          </template>

          <!-- 04 — Now -->
          <template v-else-if="c.type === 'now'">
            <div class="label">04 / NOW</div>
            <h3 class="card-title">Currently</h3>
            <ul class="now-list">
              <li v-for="n in now" :key="n.k">
                <span class="now-k">{{ n.k }}</span>
                <span class="now-v">{{ n.v }}</span>
              </li>
            </ul>
          </template>

          <!-- 05 — Services -->
          <template v-else-if="c.type === 'services'">
            <div class="label">05 / WHAT I DO</div>
            <h3 class="card-title">Services</h3>
            <div class="services-grid">
              <div v-for="s in services" :key="s" class="service">{{ s }}</div>
            </div>
          </template>

          <!-- 06 — Contact -->
          <template v-else-if="c.type === 'contact'">
            <div class="label">06 / CONTACT</div>
            <h3 class="card-title">Let's talk</h3>
            <div class="links">
              <a class="link-row" href="mailto:maiklstrnad@gmail.com">
                <span class="link-ico"><Icon icon="lucide:mail" aria-hidden="true" /></span>
                <span class="link-text">maiklstrnad@gmail.com</span>
                <span class="link-arrow"><Icon icon="lucide:arrow-up-right" aria-hidden="true" /></span>
              </a>
              <a class="link-row" href="https://github.com/MajklStrnad" target="_blank" rel="noopener">
                <span class="link-ico"><Icon icon="simple-icons:github" aria-hidden="true" /></span>
                <span class="link-text">github.com/MajklStrnad</span>
                <span class="link-arrow"><Icon icon="lucide:arrow-up-right" aria-hidden="true" /></span>
              </a>
              <a class="link-row" href="https://www.linkedin.com/in/michal-strnad-11aa763b9/" target="_blank" rel="noopener">
                <span class="link-ico"><Icon icon="simple-icons:linkedin" aria-hidden="true" /></span>
                <span class="link-text">linkedin.com/in/michal-strnad</span>
                <span class="link-arrow"><Icon icon="lucide:arrow-up-right" aria-hidden="true" /></span>
              </a>
              <a
                class="link-row"
                href="https://www.instagram.com/majkl_strnad/"
                target="_blank"
                rel="noopener"
                @click="openInstagram"
              >
                <span class="link-ico"><Icon icon="simple-icons:instagram" aria-hidden="true" /></span>
                <span class="link-text">@majkl_strnad</span>
                <span class="link-arrow"><Icon icon="lucide:arrow-up-right" aria-hidden="true" /></span>
              </a>
            </div>
            <RouterLink class="cta" to="/hire">START A PROJECT →</RouterLink>
          </template>

          <!-- 07 — Bonus -->
          <template v-else>
            <div class="label">07 / P.S.</div>
            <div class="ps-wrap">
              <Icon class="ps-heart" icon="mdi:heart" aria-label="Heart" />
              <span class="ps-glow"></span>
            </div>
            <p class="fun-text">// made with ♥ in Prague</p>
          </template>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

/* ── card content ───────────────────────────────────────── */
const stack = [
  { name: 'Frontend', items: ['Vue 3', 'TypeScript', 'Vite', 'CSS / Motion', 'WebGL / Canvas'] },
  { name: 'Backend',  items: ['FastAPI', 'Supabase', 'PostgreSQL', 'REST APIs'] },
  { name: 'Security', items: ['Pentesting', 'Recon', 'CTFs', 'Security research'] },
]
const journey = [
  { title: 'Cybersecurity student', desc: 'Systems, networks, how they break.' },
  { title: 'Freelance web dev', desc: 'Building sites for clients.' },
  { title: 'Motion-first builds', desc: 'Animation & interaction detail.' },
  { title: 'CTFs & research', desc: 'Independent security research.' },
]
const now = [
  { k: 'Learning', v: 'Offensive security & exploit dev' },
  { k: 'Building', v: 'Client sites + this portfolio' },
]
const services = [
  'Web Design',
  'Frontend Development',
  'Security Review',
  'Ongoing Support',
]

const baseCards = [
  { type: 'bio' },
  { type: 'stack' },
  { type: 'journey' },
  { type: 'now' },
  { type: 'services' },
  { type: 'contact' },
  { type: 'fun' },
]
const cards = [...baseCards, ...baseCards] // 14 slots, denser helix

/* ── instagram: try the app, fall back to the web page ───── */
function openInstagram(e) {
  const username = 'majkl_strnad'
  const appUrl = `instagram://user?username=${username}`
  const webUrl = `https://www.instagram.com/${username}/`

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (!isMobile) return

  e.preventDefault()
  let leftPage = false
  const onVisibilityChange = () => { if (document.hidden) leftPage = true }
  document.addEventListener('visibilitychange', onVisibilityChange)

  window.location.href = appUrl
  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (!leftPage) window.location.href = webUrl
  }, 1000)
}

/* ── spiral ─────────────────────────────────────────────── */
const N = cards.length
const STEP = 0.52          // angle between cards (rad)
const SNAP = true          // settle onto a card when idle
const ACTIVE_RANGE = 0.5   // how close to the front a card must be to count as active
const INTRO_MS = 1800
const EASE_RATE = 8        // how quickly p chases the target

const wrapEl = ref(null)
const worldEl = ref(null)
const cardEls = []
const activeFlags = [] // last applied active state per card, so the DOM is only touched on change

let R = 760                // helix radius, scaled to card width in updateGeometry()
let DY = 190               // vertical spacing, ~56% of card height
let cardScale = 0.8        // visual card size multiplier (set in updateGeometry)
let dir = 0                // direction of the last input, used to page on snap
let snapped = true
let p = N / 2              // current position (N/2 = first card in front)
let tp = N / 2             // target position
let touchY = null
let lastInput = 0
let t0 = 0
let last = 0
let raf = null
let visible = true
let io = null

const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3) // capped at 1 once the intro is done
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// the reference was tuned for 360px cards, so scale radius + perspective with card width
function updateGeometry() {
  const desktop = window.innerWidth >= 900
  const cw = desktop ? 540 : 340
  const ch = desktop ? 340 : 440
  cardScale = desktop ? 0.8 : 0.9 // shrinks the whole card, content included
  const k = (cw * cardScale) / 360
  R = 760 * k
  DY = ch * cardScale * 0.5625
  if (wrapEl.value) wrapEl.value.style.setProperty('--persp', `${1300 * k}px`)
}

function nudge(d) {
  tp += d
  dir = Math.sign(d) || dir
  snapped = false
  lastInput = performance.now()
}

function onWheel(e) {
  e.preventDefault() // the spiral owns the wheel while the cursor is over it
  const unit = e.deltaMode === 1 ? 33 : 1
  nudge(-clamp(e.deltaY * unit, -120, 120) * 0.0035)
}
function onTouchStart(e) { touchY = e.touches[0].clientY }
function onTouchMove(e) {
  const y = e.touches[0].clientY
  nudge((y - touchY) * 0.006)
  touchY = y
}
function onTouchEnd() { touchY = null; lastInput = performance.now() }
function onKey(e) {
  if (!visible) return
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { nudge(-1); e.preventDefault() }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { nudge(1); e.preventDefault() }
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  const dt = clamp(now - last, 0, 50) / 1000
  last = now
  if (!visible) return

  const intro = ease((now - t0) / INTRO_MS)

  // idle: aim the target at the nearest card so content stays readable
  // lean the rounding toward the scroll direction so a single wheel notch still pages one card
  if (SNAP && !snapped && touchY === null && now - lastInput > 140) {
    tp = Math.round(tp - N / 2 + dir * 0.4) + N / 2
    snapped = true
  }
  p += (tp - p) * (1 - Math.exp(-dt * EASE_RATE))

  if (worldEl.value) worldEl.value.style.transform = `translateZ(${-R}px) rotateX(-6deg)`

  for (let i = 0; i < N; i++) {
    const el = cardEls[i]
    if (!el) continue
    // s: signed position along the helix, wraps -N/2..N/2
    const s = ((((i + p) % N) + N) % N) - N / 2
    const ang = s * STEP * intro
    const y = s * DY * intro
    const d = Math.abs(s) / (N / 2)
    const o = clamp((1 - d) / 0.25, 0, 1) * intro

    // the card facing the viewer gets the "hover" look and is the only one that takes clicks
    const active = intro > 0.98 && Math.abs(s) < ACTIVE_RANGE
    if (active !== activeFlags[i]) {
      activeFlags[i] = active
      el.classList.toggle('is-active', active)
    }

    el.style.transform = `translateY(${y}px) rotateY(${ang}rad) translateZ(${R}px) scale(${cardScale})`
    el.style.pointerEvents = active ? 'auto' : 'none'
    el.style.opacity = o
    el.style.visibility = o > 0.01 ? 'visible' : 'hidden'
    el.style.zIndex = Math.round(1000 - Math.abs(s) * 10)
    el.style.filter = `brightness(${(1 - d * 0.5).toFixed(2)})`
  }
}

onMounted(() => {
  const w = wrapEl.value
  updateGeometry()
  window.addEventListener('resize', updateGeometry)
  w.addEventListener('wheel', onWheel, { passive: false })
  w.addEventListener('touchstart', onTouchStart, { passive: true })
  w.addEventListener('touchmove', onTouchMove, { passive: true })
  w.addEventListener('touchend', onTouchEnd, { passive: true })
  w.addEventListener('touchcancel', onTouchEnd, { passive: true })
  window.addEventListener('keydown', onKey)
  io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
  io.observe(w)
  t0 = last = performance.now()
  raf = requestAnimationFrame(frame)
})
onBeforeUnmount(() => {
  const w = wrapEl.value
  if (w) {
    w.removeEventListener('wheel', onWheel)
    w.removeEventListener('touchstart', onTouchStart)
    w.removeEventListener('touchmove', onTouchMove)
    w.removeEventListener('touchend', onTouchEnd)
    w.removeEventListener('touchcancel', onTouchEnd)
  }
  window.removeEventListener('resize', updateGeometry)
  window.removeEventListener('keydown', onKey)
  if (io) io.disconnect()
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style>
/* registered globally so the browser can animate the angle */
@property --border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 135deg;
}
</style>

<style scoped>
.spiral-wrapper {
  --cw: 340px;
  --ch: 440px;
  position: relative;
  width: 100%;
  touch-action: none;
  height: 100vh;
  height: 100svh;
  background-color: var(--bg-color, #111);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.scene {
  position: absolute;
  inset: 0;
  perspective: var(--persp, 1300px);
  perspective-origin: 50% 50%;
  pointer-events: none;
}
.world {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

.card {
  position: absolute;
  width: var(--cw);
  height: var(--ch);
  margin: calc(var(--ch) / -2) 0 0 calc(var(--cw) / -2);
  box-sizing: border-box;
  overflow: hidden;
  will-change: transform, opacity, filter;
  backface-visibility: visible;
  pointer-events: none;
  border-radius: 2px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: linear-gradient(145deg, #161616, #0d0d0d);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  /* `translate` is separate from `transform`, so the lift eases
     independently of the per-frame transform set from JS */
  transition: border-color 0.3s ease, translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

/* rotating gradient border (same as the pricing cards' hover) */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(
    var(--border-angle),
    rgba(255, 192, 203, 0.9) 0%,
    rgba(255, 192, 203, 0.7) 15%,
    rgba(255, 192, 203, 0.15) 30%,
    rgba(255, 192, 203, 0) 36%,
    rgba(255, 192, 203, 0) 64%,
    rgba(255, 192, 203, 0.15) 70%,
    rgba(255, 192, 203, 0.7) 85%,
    rgba(255, 192, 203, 0.9) 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  animation: border-spin 4.6s infinite;
  animation-play-state: paused;
}

@keyframes border-spin {
  0%   { --border-angle: 135deg; animation-timing-function: cubic-bezier(0.6, 0, 0.4, 1); }
  50%  { --border-angle: 315deg; animation-timing-function: cubic-bezier(0.6, 0, 0.4, 1); }
  100% { --border-angle: 495deg; }
}

/* the card currently facing the viewer */
.card.is-active { translate: 0 -15px; }
.card.is-active::after {
  opacity: 1;
  animation-play-state: running;
}

.label {
  font-size: 0.72rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ffd1dc;
  flex: 0 0 auto;
}
.card-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 100;
  letter-spacing: 0.04em;
  line-height: 1.3;
  color: #ffffff;
  flex: 0 0 auto;
}
.lead { margin: 0; font-size: 15px; line-height: 1.6; font-weight: 300; color: rgba(255, 255, 255, 0.75); }

.status {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  flex: 0 0 auto;
}
.status i {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #ffc0cb;
  box-shadow: 0 0 10px rgba(255, 192, 203, 0.7);
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.7); }
}

.stack { display: flex; flex-direction: column; gap: 7px; flex: 0 0 auto; }
.stack-head {
  font-size: 0.68rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
}
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  font-size: 11.5px;
  font-weight: 300;
  padding: 5px 11px;
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.25s, color 0.25s;
}
.chip:hover { color: #fff; border-color: rgba(255, 192, 203, 0.4); }

.timeline { list-style: none; display: flex; flex-direction: column; gap: 15px; margin: 4px 0 0; padding: 0; }
.timeline li { position: relative; display: flex; gap: 14px; }
.timeline li::after {
  content: '';
  position: absolute;
  left: 3px; top: 16px;
  width: 1px; height: calc(100% + 5px);
  background: linear-gradient(rgba(255, 192, 203, 0.35), rgba(255, 192, 203, 0));
}
.timeline li:last-child::after { display: none; }
.dot-mark {
  flex: 0 0 auto;
  width: 8px; height: 8px;
  margin-top: 4px;
  border-radius: 50%;
  background: #ffc0cb;
  box-shadow: 0 0 10px rgba(255, 192, 203, 0.6);
}
.t-title { font-size: 14px; font-weight: 400; color: #f2f2f2; }
.t-desc { font-size: 12.5px; line-height: 1.5; font-weight: 300; color: rgba(255, 255, 255, 0.5); }

.now-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin: 4px 0 0; padding: 0; }
.now-list li {
  display: flex; flex-direction: column; gap: 2px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.now-list li:last-child { border-bottom: none; }
.now-k {
  font-size: 0.68rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 300;
  color: #ffd1dc;
}
.now-v { font-size: 14px; font-weight: 300; color: rgba(255, 255, 255, 0.8); }

.services-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 6px; }
.service {
  padding: 20px 14px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  min-width: 0;
  transition: border-color 0.25s, color 0.25s;
}
.service:hover { color: #fff; border-color: rgba(255, 192, 203, 0.35); }

.links { display: flex; flex-direction: column; gap: 10px; margin-top: 2px; flex: 0 0 auto; }
.link-row {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px;
  border-radius: 2px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  min-width: 0;
}
.link-row:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 192, 203, 0.35);
  transform: translateX(3px);
}
.link-ico {
  flex: 0 0 30px; height: 30px;
  display: grid; place-items: center;
  color: #ffd1dc;
}
.link-ico :deep(svg),
.link-arrow :deep(svg) {
  width: 18px;
  height: 18px;
}
.link-text {
  flex: 1;
  font-size: 13px;
  font-weight: 300;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.link-arrow { color: rgba(255, 255, 255, 0.35); flex: 0 0 auto; }

.cta {
  position: relative;
  margin-top: auto;
  display: block;
  text-align: center;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 16px 0;
  border-radius: 2px;
  color: #fff;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  transition: letter-spacing 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.2s;
  z-index: 1;
  flex: 0 0 auto;
}
.cta::before {
  content: '';
  position: absolute;
  top: -250%;
  left: -250%;
  width: 600%;
  height: 600%;
  background: conic-gradient(
    from 0deg,
    rgba(255, 192, 203, 0.8),
    rgba(255, 182, 193, 0.8),
    rgba(255, 218, 224, 0.8),
    rgba(255, 192, 203, 0.8)
  );
  animation: rotate-gradient 12s linear infinite;
  z-index: -2;
  filter: blur(40px);
  opacity: 0.6;
}
.cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(18, 18, 18, 0.7);
  z-index: -1;
}
.cta:hover { letter-spacing: 0.4em; transform: scale(1.02); }
@keyframes rotate-gradient {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.card--fun { align-items: center; justify-content: center; }
.card--fun .label { position: absolute; top: 40px; left: 32px; }

.ps-wrap { position: relative; display: grid; place-items: center; }
.ps-heart {
  position: relative;
  z-index: 1;
  width: 110px;
  height: auto;
  color: #ffd1dc;
  fill: currentColor;
  filter: drop-shadow(0 0 16px rgba(255, 192, 203, 0.4));
  transform-origin: center;
  animation: heartbeat 1.5s ease-in-out infinite;
}
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  12%      { transform: scale(1.14); }
  24%      { transform: scale(1); }
  36%      { transform: scale(1.09); }
  50%      { transform: scale(1); }
}
.ps-glow {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 192, 203, 0.3), transparent 68%);
  pointer-events: none;
  animation: psGlow 1.5s ease-in-out infinite;
}
@keyframes psGlow {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50%      { opacity: 0.7;  transform: scale(1.1); }
}
.fun-text {
  position: absolute;
  left: 0; right: 0;
  bottom: 36px;
  margin: 0;
  text-align: center;
  font-family: monospace;
  font-size: 12.5px;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.5);
}

/* ── desktop: wider, lower cards ── */
@media (min-width: 900px) {
  .spiral-wrapper { --cw: 540px; --ch: 340px; }
  .card { padding: 30px 38px; gap: 12px; }
  .card--fun .label { top: 30px; left: 38px; }
  .fun-text { bottom: 26px; }
  .ps-heart { width: 84px; }
  .services-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .service { padding: 26px 12px; }
  .timeline { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 24px; }
  .timeline li::after { display: none; }
  .links { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .link-row { padding: 10px 12px; }
  .link-row:hover { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cta::before, .status i, .ps-heart, .ps-glow { animation: none !important; }
  .card::after { animation: none !important; }
  .card { transition: border-color 0.3s ease; }
}
</style>
