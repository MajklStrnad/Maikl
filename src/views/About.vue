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
              <h3 class="card-title">Maikl Strnad</h3>
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
                  <span class="link-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <span class="link-text">maiklstrnad@gmail.com</span>
                  <span class="link-arrow">→</span>
                </a>
                <a class="link-row" href="https://github.com/MajklStrnad" target="_blank" rel="noopener">
                  <span class="link-ico">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/></svg>
                  </span>
                  <span class="link-text">github.com/MajklStrnad</span>
                  <span class="link-arrow">→</span>
                </a>
                <a class="link-row" href="https://www.linkedin.com/in/michal-strnad-11aa763b9/" target="_blank" rel="noopener">
                  <span class="link-ico">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </span>
                  <span class="link-text">linkedin.com/in/michal-strnad</span>
                  <span class="link-arrow">→</span>
                </a>
                <a
                  class="link-row"
                  href="https://www.instagram.com/majkl_strnad/"
                  target="_blank"
                  rel="noopener"
                  @click="openInstagram"
                >
                  <span class="link-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </span>
                  <span class="link-text">@majkl_strnad</span>
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

/* ── prism geometry ─────────────────────────────────────── */
const cards = [
  { type: 'bio' },
  { type: 'stack' },
  { type: 'journey' },
  { type: 'now' },
  { type: 'services' },
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

function faceStyle(idx) {
  return {
    width: cardW.value + 'px',
    height: cardH.value + 'px',
    transform: `translate(-50%, -50%) rotateY(${baseStep * idx}deg) translateZ(${radius.value}px)`,
  }
}

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
let startY = 0
let baseRotation = 0
let pressing = false
let pointerId = null
let history = []
const DRAG_THRESHOLD = 6
const FLICK_VELOCITY = 0.45

const degPerPx = computed(() => 60 / cardW.value)

function onDown(e) {
  if (e.target.closest('a, button')) return
  pressing = true
  startX = e.clientX
  startY = e.clientY
  baseRotation = rotation.value
  pointerId = e.pointerId
  history = [{ x: e.clientX, t: performance.now() }]
  e.currentTarget.setPointerCapture?.(pointerId)
}

function onMove(e) {
  if (!pressing || e.pointerId !== pointerId) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (!dragging.value) {
    // If vertical movement dominates, abort and let the browser scroll
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > DRAG_THRESHOLD) {
      pressing = false
      pointerId = null
      history = []
      return
    }
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      dragging.value = true
      e.preventDefault()
    } else {
      return
    }
  }

  if (dragging.value) {
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
let resizeRaf = null
const MOBILE_BREAKPOINT = 480
const MOBILE_TOP_SPACE = 60
const MOBILE_HEIGHT_CAP = 420
const DESKTOP_HEIGHT_CAP = 560

function computeSize() {
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight

  const isMobile = vw < MOBILE_BREAKPOINT
  const extraTop = isMobile ? MOBILE_TOP_SPACE : 0

  const chromeH = 170
  const availH = Math.max(200, vh - chromeH - extraTop)
  const availW = Math.max(160, vw - 24)

  let w
  if (vw < 480) {
    w = vw * 0.72
  } else if (vw < 900) {
    w = Math.min(320, vw * 0.42)
  } else {
    w = 350
  }
  w = Math.min(w, availW)

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
:global(html),
:global(body) {
  overflow-x: hidden;
  max-width: 100%;
}

.prism-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  min-height: 100vh;
  max-width: 100vw;
  padding: 20px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
  background-color: var(--bg-color, #111);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
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

.scene {
  position: absolute;
  inset: 0;
  perspective: 1200px;
  perspective-origin: 50% 50%;
  touch-action: pan-y;
  cursor: grab;
  padding: 20px;
  -webkit-tap-highlight-color: transparent;
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
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
  background: linear-gradient(145deg, #161616, #0d0d0d);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  -webkit-tap-highlight-color: transparent;
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

.services-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 3vw, 14px); margin-top: 6px; }
.service {
  padding: clamp(14px, 4.5vw, 20px) clamp(10px, 3.6vw, 14px);
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

@media (max-width: 600px) {
  .arrow { width: 44px; height: 44px; font-size: 21px; }
}

@media (max-width: 380px) {
  .arrow { width: 40px; height: 40px; font-size: 18px; }
}

@media (max-height: 480px) {
  .prism-wrapper { padding-top: 10px; padding-bottom: 10px; }
  .nav-row { margin-top: 8px; }
  .dots { margin-top: 8px; }
}

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
