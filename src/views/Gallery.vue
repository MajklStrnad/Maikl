<template>
  <div class="gallery-page">
    <header class="gallery-head">
      <p class="eyebrow">Selected Work</p>
      <h1>Gallery</h1>
    </header>

    <div
      ref="fanWrapEl"
      class="fan-wrap"
      @mouseenter="fanOpen = true"
      @mouseleave="fanOpen = false; hovered = null"
    >
      <component
        :is="item.real ? 'a' : 'RouterLink'"
        v-for="(item, i) in projects"
        :key="item.id"
        class="proj-card"
        :class="{ 'proj-card--open': !item.real }"
        :style="!isMobile ? cardStyle(i) : undefined"
        :href="item.real ? item.url : undefined"
        :to="item.real ? undefined : '/hire'"
        :target="item.real ? '_blank' : undefined"
        :rel="item.real ? 'noopener' : undefined"
        tabindex="0"
        role="button"
        :aria-label="item.real ? `${item.title} — ${item.category}` : 'Open project slot — get in touch'"
        @mouseenter="hovered = i"
        @focus="fanOpen = true; hovered = i"
        @blur="if (hovered === i) { fanOpen = false; hovered = null }"
      >
        <div class="proj-thumb">
          <template v-if="item.real">
            <img class="proj-photo" :src="item.image" :alt="`${item.title} preview`" />
            <span class="proj-external" aria-hidden="true">↗</span>
          </template>

          <template v-else>
            <img class="proj-sakura" :src="sakuraBranch" alt="" aria-hidden="true" />
          </template>

          <span class="proj-sheen"></span>
        </div>

        <div class="proj-info">
          <template v-if="item.real">
            <p class="proj-cat">{{ item.category }}</p>
            <h3 class="proj-title">{{ item.title }}</h3>
            <span class="proj-link">{{ item.linkLabel || 'Visit site →' }}</span>
          </template>
          <template v-else>
            <p class="proj-cat">Open Slot</p>
            <h3 class="proj-title">Nothing here (yet)</h3>
            <span class="proj-link">Want to be next? →</span>
          </template>
        </div>
      </component>
    </div>

    <p class="fan-hint" :class="{ hidden: fanOpen }">Hover to explore</p>

    <!-- mobile-only: hidden by default (see .mobile-nav), shown under the
         700px breakpoint since the desktop hover-fan has no touch equivalent -->
    <div class="mobile-nav">
      <p class="mobile-hint">Tap a card to visit</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import massageAcademyThumb from '@/assets/massage-academy-thumb.png'
import lashesThumb from '@/assets/lashes-thumb.png'
import zeroHourThumb from '@/assets/0hour-thumb.png'
import sakuraBranch from '@/assets/sakura-branch.png'

// Only real, shipped projects get `real: true` + full details. Everything
// else renders as an open "want to be next?" slot — swap these in as you
// ship more work.
const projects = [
  {
    id: 1,
    real: true,
    title: 'Lashes',
    category: 'Animation',
    url: '/lashes.html',
    image: lashesThumb,
    linkLabel: 'View animation →',
  },
  {
    id: 2,
    real: true,
    title: '0hour',
    category: 'Web App',
    url: 'https://0hour.app/',
    image: zeroHourThumb,
  },
  {
    id: 3,
    real: true,
    title: 'Massage Academy',
    category: 'Booking Platform',
    url: 'https://massage-academy.onrender.com/',
    image: massageAcademyThumb,
  },
  { id: 4 },
  { id: 5 },
]

// ── Fan-out deck (desktop hover) ─────────────────────────────────
// At rest the cards sit in a tight, slightly-tilted stack (like a closed
// hand of cards). Hovering — or, for keyboard users, focusing a card via
// Tab — spreads them into an arc; the active card lifts in front of its
// neighbors with extra shadow depth so the stacking reads as solid, not flat.
const fanOpen = ref(false)
const hovered = ref(null)

const CENTER = (projects.length - 1) / 2 // 2, for 5 cards

function cardStyle(i) {
  const offset = i - CENTER
  const angle  = fanOpen.value ? offset * 13 : offset * 5
  const x      = fanOpen.value ? offset * 150 : offset * 20
  const isHovered = hovered.value === i
  const y      = fanOpen.value ? (isHovered ? -48 : -12) : 0
  const scale  = fanOpen.value && isHovered ? 1.07 : 1
  const z      = isHovered ? 20 : 10 - Math.abs(offset)

  const shadow = isHovered
    ? '0 32px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 192, 203, 0.15), 0 0 40px rgba(255, 192, 203, 0.12)'
    : fanOpen.value
      ? '0 18px 34px rgba(0, 0, 0, 0.45)'
      : `0 ${6 + Math.abs(offset) * 2}px ${16 + Math.abs(offset) * 4}px rgba(0, 0, 0, 0.4)`

  return {
    transform: `translate(-50%, 0) translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})`,
    zIndex: z,
    boxShadow: shadow,
    transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease',
  }
}

// ── Mobile: plain grid, no expand logic ───────────────────────────
const isMobile = ref(false)

let mql
function handleMqlChange(e) {
  isMobile.value = e.matches
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 700px)')
  isMobile.value = mql.matches
  mql.addEventListener('change', handleMqlChange)
})

onBeforeUnmount(() => {
  mql?.removeEventListener('change', handleMqlChange)
})
</script>

<style scoped>
.gallery-page {
  position: relative;
  background: var(--bg-color, #0a0a0a);
  color: var(--text-color, #ffffff);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  padding: 160px 40px 120px;
  overflow: hidden;
}

.gallery-head {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto 80px;
  text-align: center;
}
.eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ffd1dc;
  font-weight: 300;
  margin-bottom: 16px;
}
.gallery-head h1 {
  font-size: clamp(2.4rem, 7vw, 4rem);
  font-weight: 100;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 16px;
  margin-right: -0.3em; /* balance the letter-spacing so the heading looks centered */
}
.sub {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
}

.fan-wrap {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  height: 500px;
}

.proj-card {
  position: absolute;
  top: 0;
  left: 50%;
  width: 268px;
  transform-origin: bottom center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  background: linear-gradient(160deg, #1a1a1a 0%, #121212 55%, #0b0b0b 100%);
  cursor: pointer;
  outline: none;
  text-decoration: none;
  color: inherit;
  display: block;
}
.proj-card:hover,
.proj-card:focus-visible {
  border-color: rgba(255, 192, 203, 0.4);
}
.proj-card:focus-visible {
  box-shadow: 0 0 0 2px rgba(255, 192, 203, 0.5), 0 32px 60px rgba(0, 0, 0, 0.55) !important;
}
.proj-card:active {
  transform-origin: bottom center;
  filter: brightness(0.96);
}

.proj-thumb {
  position: relative;
  height: 224px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #171717 0%, #101010 100%);
}
.proj-thumb::after {
  /* subtle bottom fade so titles always read cleanly over the photo */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, transparent 40%);
  pointer-events: none;
  z-index: 1;
}
.proj-sheen {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
  pointer-events: none;
}

.proj-photo {
  position: relative;
  z-index: 0;
  max-width: 92%;
  max-height: 92%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.proj-card:hover .proj-photo {
  transform: scale(1.04);
}

/* sakura-branch illustration for open slots — subdued at rest, blooms on hover.
   max-width/max-height (not a fixed width) means the browser always scales
   to whichever dimension is the tighter fit, so the branch's wide aspect
   ratio can never get vertically cropped by the thumb's overflow:hidden. */
.proj-sakura {
  position: relative;
  z-index: 1;
  max-width: 88%;
  max-height: 88%;
  width: auto;
  height: auto;
  object-fit: contain;
  opacity: 0.6;
  filter: brightness(0.85) saturate(0.75);
  transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
}
.proj-card:hover .proj-sakura {
  opacity: 0.95;
  filter: brightness(1) saturate(1.05);
  transform: translateY(-2px) scale(1.03);
}

.proj-external {
  position: absolute;
  z-index: 2;
  top: 14px;
  right: 14px;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(6px);
  transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.proj-card:hover .proj-external {
  color: #ffd1dc;
  border-color: rgba(255, 192, 203, 0.4);
  background: rgba(255, 192, 203, 0.08);
}

.proj-card--open .proj-cat { color: rgba(255, 255, 255, 0.3); }
.proj-card--open .proj-title { color: rgba(255, 255, 255, 0.6); font-style: italic; }

.proj-info {
  position: relative;
  z-index: 1;
  padding: 22px 24px 26px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.proj-cat {
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 8px;
  font-weight: 300;
}
.proj-title {
  font-size: 1.1rem;
  font-weight: 100;
  letter-spacing: 0.02em;
  color: var(--text-color);
  margin-bottom: 14px;
}
.proj-link {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 300;
  color: #ffd1dc;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  display: inline-block;
}
.proj-card:hover .proj-link {
  opacity: 1;
  transform: translateX(0);
}

.fan-hint {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-top: 24px;
  font-size: 0.62rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  transition: opacity 0.4s ease;
}
.fan-hint.hidden { opacity: 0; }

/* mobile-only nav hint — hidden by default so desktop never sees it;
   flipped to visible inside the 700px breakpoint below */
.mobile-nav {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
}
.mobile-hint {
  font-size: 0.62rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 700px) {
  .gallery-page { padding: 130px 20px 60px; }

  /* plain 2-column grid, no fan or expand logic */
  .fan-wrap {
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* hide the very last card on mobile */
  .fan-wrap > :nth-last-child(1) {
    display: none;
  }

  .proj-card {
    position: relative;
    top: auto; left: auto;
    width: 100%;
    transition: box-shadow 0.35s ease;
  }
  .proj-thumb { height: 120px; }
  .proj-info { padding: 10px 12px 12px; }
  .proj-cat { font-size: 0.5rem; margin-bottom: 4px; }
  .proj-title { font-size: 0.78rem; margin-bottom: 0; letter-spacing: 0; }
  .proj-link { display: none; }
  .proj-external { width: 20px; height: 20px; font-size: 10px; top: 8px; right: 8px; }

  /* nothing on a touchscreen ever triggers :hover, so the sakura
     illustration and external icon need to just be permanently visible */
  .proj-sakura {
    opacity: 0.95 !important;
    filter: brightness(1) saturate(1.05) !important;
  }
  .proj-external {
    color: #ffd1dc !important;
    border-color: rgba(255, 192, 203, 0.35) !important;
    background: rgba(255, 192, 203, 0.06) !important;
  }

  .fan-hint { display: none; }
  .mobile-nav { display: flex; }
}
</style>
