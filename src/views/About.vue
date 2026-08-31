<template>
  <div class="prism-wrapper">
    <div class="stage" :style="{ height: stageH + 'px', marginTop: topSpace + 'px' }">
      <div
        class="scene"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
        @pointerleave="onUp"
      >
        <div class="rotor" :class="{ dragging }" :style="rotorStyle">
          <article
            v-for="(c, i) in cards"
            :key="i"
            class="face"
            :class="{ 'face--fun': c.type === 'fun' }"
            :style="faceStyle(i)"
          >
            <!-- 01 — Bio -->
            <template v-if="c.type === 'bio'">
              <div class="label">01 / WHO</div>
              <h3 class="card-title">Hey, I'm Maikl.</h3>
              <p class="lead">
                A <strong>developer</strong> &amp; <span class="hl">security tinkerer</span>
                building motion-first web experiences from Prague.
              </p>
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

            <!-- 05 — Stats -->
            <template v-else-if="c.type === 'stats'">
              <div class="label">05 / BY THE NUMBERS</div>
              <h3 class="card-title">A few stats</h3>
              <div class="stats-grid">
                <div v-for="s in stats" :key="s.l" class="stat">
                  <span class="stat-n">{{ s.n }}</span>
                  <span class="stat-l">{{ s.l }}</span>
                </div>
              </div>
            </template>

            <!-- 06 — Contact -->
            <template v-else-if="c.type === 'contact'">
              <div class="label">06 / CONTACT</div>
              <h3 class="card-title">Let's talk</h3>
              <div class="links">
                <a class="link-row" href="mailto:your@email.com">
                  <span class="link-ico">@</span>
                  <span class="link-text">your@email.com</span>
                  <span class="link-arrow">→</span>
                </a>
                <a class="link-row" href="" target="_blank" rel="noopener">
                  <span class="link-ico">{ }</span>
                  <span class="link-text">github.com/you</span>
                  <span class="link-arrow">→</span>
                </a>
                <a class="link-row" href="" target="_blank" rel="noopener">
                  <span class="link-ico">in</span>
                  <span class="link-text">linkedin.com/in/you</span>
                  <span class="link-arrow">→</span>
                </a>
              </div>
              <RouterLink class="cta" to="/hire">START A PROJECT →</RouterLink>
            </template>

            <!-- 07 — Bonus -->
            <template v-else>
              <div class="label">07 / P.S.</div>
              <div class="ps-wrap">
                <svg class="ps-heart" viewBox="0 0 32 29.6" role="img" aria-label="Heart">
                  <path
                    fill="#ffd1dc"
                    d="M23.6 0c-3.4 0-6.3 2.7-7.6 5.6C14.7 2.7 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.4 9.5 11.9 16 21.2 6.1-9.3 16-12.1 16-21.2C32 3.8 28.2 0 23.6 0z"
                  />
                </svg>
                <span class="ps-glow"></span>
              </div>
              <p class="fun-text">// made with ♥ in Prague</p>
            </template>
          </article>
        </div>
      </div>
    </div>

    <div class="nav-row">
      <button class="arrow arrow-l" aria-label="Previous card" @click="prev">‹</button>
      <button class="arrow arrow-r" aria-label="Next card" @click="next">›</button>
    </div>

    <div class="dots">
      <button
        v-for="(_, i) in cards"
        :key="i"
        class="dot"
        :class="{ on: i === activeFace }"
        @click="goTo(i)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/* ── card content ───────────────────────────────────────── */
const stack = [
  { name: 'Frontend', items: ['Vue 3', 'TypeScript', 'Vite', 'CSS / Motion', 'WebGL / Canvas'] },
  { name: 'Backend',  items: ['FastAPI', 'Supabase', 'PostgreSQL', 'REST APIs'] },
  { name: 'Security', items: ['Pentesting', 'Recon', 'CTFs', 'Security research'] },
]
const journey = [
  { title: 'Studying cybersecurity', desc: 'Digging into systems, networks & how they break — in Prague.' },
  { title: 'Freelance web dev', desc: 'Shipping fast, animated sites for real clients.' },
  { title: 'Motion-first builds', desc: 'CSS 3D, canvas FX, the stuff that makes people look twice.' },
  { title: 'CTFs & research', desc: 'Sharpening the offensive-security edge, one flag at a time.' },
]
const now = [
  { k: 'Learning',  v: 'Offensive security & exploit dev' },
  { k: 'Building',  v: 'Client sites + this portfolio' },
  { k: 'Reading',   v: 'Replace me — your current book' },
  { k: 'Fueled by', v: 'Far too much coffee' },
]
const stats = [
  { n: '20+', l: 'Projects shipped' },
  { n: '30+', l: 'CTFs played' },
  { n: '5★',  l: 'Client rating' },
  { n: '∞',   l: 'Cups of coffee' },
]

/* ── prism geometry ─────────────────────────────────────── */
const cards = [
  { type: 'bio' },
  { type: 'stack' },
  { type: 'journey' },
  { type: 'now' },
  { type: 'stats' },
  { type: 'contact' },
  { type: 'fun' },
]
const N = cards.length
const baseStep = 360 / N

const cardW = ref(300)
const cardH = ref(410)
const stageH = ref(540)
const topSpace = ref(0)

const radius = computed(() => (cardW.value / 2) / Math.tan(Math.PI / N) * 1.12)

function faceStyle(slot) {
  return {
    width: cardW.value + 'px',
    height: cardH.value + 'px',
    transform: `translate(-50%, -50%) rotateY(${baseStep * slot}deg) translateZ(${radius.value}px)`,
  }
}

/* ── rotation state ─────────────────────────────────────── */
const index = ref(0)
const rotation = ref(0)
const dragging = ref(false)

const rotorStyle = computed(() => ({
  transform: `translateZ(${-radius.value}px) rotateY(${rotation.value}deg)`,
}))

const activeFace = computed(() => ((index.value % N) + N) % N)

function go(d) {
  index.value += d
  rotation.value -= baseStep * d
}
const next = () => go(1)
const prev = () => go(-1)

function goTo(i) {
  let d = ((i - activeFace.value) % N + N) % N
  if (d > N / 2) d -= N
  go(d)
}

/* ── drag to spin (mouse + finger) ───────────────────────── */
let startX = 0
let baseRotation = 0
let pressing = false
let pointerId = null
let history = [] // recent {x, t} samples, for flick-velocity detection
const DRAG_THRESHOLD = 6
const FLICK_VELOCITY = 0.45 // px/ms — a quick short swipe still counts as one full slide

// degrees-per-pixel scales with card width so a "full swipe" always
// feels like roughly the same angular throw, on a phone or a wide screen
const degPerPx = computed(() => 60 / cardW.value)

function onDown(e) {
  pressing = true
  startX = e.clientX
  baseRotation = rotation.value
  pointerId = e.pointerId
  history = [{ x: e.clientX, t: performance.now() }]
  // Capture the pointer immediately on press (not after the drag threshold
  // is crossed). On touch, browsers decide "this is a scroll gesture" from
  // the very first few pixels of movement — waiting to capture meant a
  // slightly-diagonal swipe could be claimed by native scrolling before our
  // dx threshold ever fired, killing the drag before it started.
  e.currentTarget.setPointerCapture?.(pointerId)
}
function onMove(e) {
  if (!pressing) return
  const dx = e.clientX - startX
  if (!dragging.value && Math.abs(dx) > DRAG_THRESHOLD) {
    dragging.value = true
  }
  if (dragging.value) {
    // Stop the browser from fighting the drag with native scroll/refresh
    // gestures once we've committed to handling this as a spin.
    e.preventDefault()
    rotation.value = baseRotation + dx * degPerPx.value
    history.push({ x: e.clientX, t: performance.now() })
    if (history.length > 6) history.shift()
  }
}
function onUp() {
  if (!pressing) return
  pressing = false
  if (!dragging.value) {
    history = []
    return
  }
  dragging.value = false

  // Velocity from the recent sample window — lets a quick short flick
  // (common on touch) trigger a full slide change even if the finger
  // didn't travel a full card-width worth of drag.
  let velocity = 0
  if (history.length >= 2) {
    const first = history[0]
    const last = history[history.length - 1]
    const dt = last.t - first.t
    if (dt > 0) velocity = (last.x - first.x) / dt
  }
  history = []

  if (Math.abs(velocity) > FLICK_VELOCITY) {
    index.value += velocity > 0 ? -1 : 1
  } else {
    index.value = Math.round(-rotation.value / baseStep)
  }
  rotation.value = -index.value * baseStep
}

/* ── keyboard ───────────────────────────────────────────── */
function onKey(e) {
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

/* ── responsive sizing ──────────────────────────────────── */
// Sizes the card off BOTH the viewport width and height, so it fits
// perfectly on tall phones, short landscape phones, tablets, and
// desktop alike — never overflowing and never shrinking needlessly.
let resizeRaf = null

// On mobile we reserve extra room at the top so the stage sits lower
// on the screen, and cap the card shorter than on larger viewports.
const MOBILE_BREAKPOINT = 480
const MOBILE_TOP_SPACE = 60
const MOBILE_HEIGHT_CAP = 420
const DESKTOP_HEIGHT_CAP = 560

function computeSize() {
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight

  const isMobile = vw < MOBILE_BREAKPOINT
  const extraTop = isMobile ? MOBILE_TOP_SPACE : 0

  // Reserve room for the bottom arrow row + dots row + vertical padding,
  // plus any extra top space we're pushing the stage down by.
  const chromeH = 170
  const availH = Math.max(200, vh - chromeH - extraTop)
  const availW = Math.max(160, vw - 24)

  // Width target stays deliberately narrow: the angled side faces of the
  // prism project out roughly ~1.2x the card width on each side, so
  // sizing the card any wider pushes those tilted neighbors off-screen.
  let w
  if (vw < 480) {
    w = vw * 0.54
  } else if (vw < 900) {
    w = Math.min(320, vw * 0.42)
  } else {
    w = 350
  }
  w = Math.min(w, availW)

  // Height is decoupled from width and fills the remaining vertical
  // space, but capped more conservatively so the card reads as a card
  // rather than stretching edge to edge. Mobile gets a shorter cap.
  const heightCap = isMobile ? MOBILE_HEIGHT_CAP : DESKTOP_HEIGHT_CAP
  const h = Math.min(availH, heightCap)

  cardW.value = Math.round(Math.max(180, w))
  cardH.value = Math.round(Math.max(240, h))
  stageH.value = cardH.value
  topSpace.value = extraTop
}

function onResize() {
  if (resizeRaf) cancelAnimationFrame(resizeRaf)
  resizeRaf = requestAnimationFrame(computeSize)
}

onMounted(() => {
  computeSize()
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  window.visualViewport?.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('orientationchange', onResize)
  window.visualViewport?.removeEventListener('resize', onResize)
  if (resizeRaf) cancelAnimationFrame(resizeRaf)
})
</script>

<style scoped>
/* ── global page guards (unscoped) ──────────────────────── */
/* Selecting text while dragging the carousel looks broken, and the
   3D perspective transforms can otherwise poke past the viewport —
   these two rules stop both, page-wide, not just on this component. */
:global(html),
:global(body) {
  overflow-x: hidden;
  max-width: 100%;
}

/* ── layout ─────────────────────────────────────────────── */
.prism-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  min-height: 100vh; /* fallback for browsers without svh support */
  max-width: 100vw;
  padding: 20px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
  background-color: var(--bg-color, #111);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  /* user-select is inherited, so setting it once here disables text
     selection across every element in this component (buttons, cards,
     nav dots, etc.) without needing it repeated on each of them. */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* iOS Safari: stop the callout/copy menu on long-press too */
  -webkit-touch-callout: none;
}

.stage {
  position: relative;
  width: min(960px, 100%);
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: margin-top 0.2s ease;
}

/* ── perspective container + rotor ──────────────────────── */
.scene {
  position: absolute;
  inset: 0;
  perspective: 1200px;
  perspective-origin: 50% 50%;
  /* CHANGED: was `pan-y`. On touch, a browser decides the gesture type
     (scroll vs. custom) from the very first few pixels of movement — any
     slightly-diagonal swipe could get claimed as a vertical pan before our
     drag threshold fired, which fully broke touch-dragging. `none` hands
     all gesture handling to the pointer listeners below. */
  touch-action: none;
  cursor: grab;
  padding: 20px;
}
.scene:active { cursor: grabbing; }

.rotor {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: transform 680ms cubic-bezier(0.23, 1, 0.32, 1);
}
.rotor.dragging { transition: none; }

/* ── faces (pricing-card treatment) ─────────────────────── */
.face {
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  user-select: none;
  border-radius: 2px;
  padding: clamp(24px, 9%, 44px) clamp(18px, 9%, 36px);
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 3vw, 15px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: none; /* ← added: without this, touches on the card itself
                           are claimed by native scroll before pointermove
                           ever fires, same root cause as the .scene fix */
  background: linear-gradient(145deg, #161616, #0d0d0d);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.face::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.face:hover {
  border-color: rgba(255, 192, 203, 0.3);
}

.label {
  font-size: clamp(0.62rem, 1.6vw, 0.72rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ffd1dc;
  flex: 0 0 auto;
}

.card-title {
  font-size: clamp(1.1rem, 4vw, 1.35rem);
  font-weight: 100;
  letter-spacing: 0.04em;
  line-height: 1.3;
  color: #ffffff;
  flex: 0 0 auto;
}

.lead { font-size: clamp(13px, 3.4vw, 15px); line-height: 1.6; font-weight: 300; color: rgba(255, 255, 255, 0.75); }
.lead strong { color: #fff; font-weight: 500; }
.lead .hl { color: #ffd1dc; }

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

.timeline { list-style: none; display: flex; flex-direction: column; gap: 15px; margin-top: 4px; padding: 0; }
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

.now-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 4px; padding: 0; }
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

.stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 3vw, 14px); margin-top: 6px; }
.stat {
  display: flex; flex-direction: column; gap: 4px;
  padding: clamp(12px, 4vw, 18px) clamp(10px, 3.6vw, 14px);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-width: 0;
}
.stat-n {
  font-size: clamp(1.5rem, 6vw, 2rem);
  font-weight: 100;
  line-height: 1;
  color: #ffffff;
}
.stat-l {
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  line-height: 1.4;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
}

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
  border-radius: 2px;
  font-size: 10px;
  font-weight: 300;
  color: #ffd1dc;
  background: rgba(255, 192, 203, 0.08);
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

/* pricing cta-button treatment, ported for the "START A PROJECT" link */
.cta {
  position: relative;
  margin-top: auto;
  display: block;
  text-align: center;
  text-decoration: none;
  font-size: clamp(0.66rem, 2vw, 0.75rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: clamp(13px, 4vw, 16px) 0;
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

.face--fun { align-items: center; justify-content: center; }
.face--fun .label { position: absolute; top: clamp(24px, 9%, 44px); left: clamp(18px, 9%, 36px); }

.ps-wrap { position: relative; display: grid; place-items: center; }
.ps-heart {
  position: relative;
  z-index: 1;
  width: clamp(70px, 24vw, 110px);
  height: auto;
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
  width: clamp(100px, 32vw, 150px);
  height: clamp(100px, 32vw, 150px);
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
  bottom: clamp(20px, 8%, 36px);
  text-align: center;
  font-family: monospace;
  font-size: 12.5px;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.5);
}

.arrow {
  position: relative;
  z-index: 30;
  width: 50px; height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  font-weight: 200;
  line-height: 1;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: border-color 0.25s, color 0.25s, transform 0.2s, background 0.2s;
  flex: 0 0 auto;
}
.arrow:hover {
  color: #fff;
  border-color: rgba(255, 192, 203, 0.4);
  background: rgba(20, 20, 20, 0.85);
  transform: scale(1.08);
}
.arrow:active { transform: scale(0.95); }

.nav-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-top: clamp(14px, 3vw, 24px);
  flex: 0 0 auto;
}

.dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: clamp(12px, 2.6vw, 18px);
  padding: 0 8px;
}
.dot {
  width: 8px; height: 8px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  flex: 0 0 auto;
}
.dot.on {
  width: 26px;
  border-radius: 100px;
  border-color: transparent;
  background: #ffc0cb;
  box-shadow: 0 0 10px rgba(255, 192, 203, 0.5);
}

/* ── responsive breakpoints ──────────────────────────────── */
@media (max-width: 600px) {
  .arrow { width: 44px; height: 44px; font-size: 21px; }
}

@media (max-width: 380px) {
  .arrow { width: 40px; height: 40px; font-size: 18px; }
  .stats-grid { gap: 8px; }
}

/* short viewports (landscape phones): trim outer padding so the
   card has more room to breathe vertically */
@media (max-height: 480px) {
  .prism-wrapper { padding-top: 10px; padding-bottom: 10px; }
  .nav-row { margin-top: 8px; }
  .dots { margin-top: 8px; }
}

/* larger screens: let the card sit a bit larger and roomier */
@media (min-width: 1200px) {
  .face { padding: 48px 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .cta::before, .status i, .ps-heart, .ps-glow { animation: none !important; }
  .rotor { transition-duration: 200ms; }
}

@media (hover: none) {
  .arrow:hover { transform: none; }
}
</style>
