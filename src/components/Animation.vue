<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

type Phase = 'draw' | 'hold' | 'erase'

const props = withDefaults(
  defineProps<{
    words?: string[]
    timings?: { draw: number; hold: number; erase: number }
  }>(),
  {
    words: () => ['design', 'development', 'cybersecurity', 'style'],
    timings: () => ({ draw: 3600, hold: 1500, erase: 1700 }),
  }
)

const index = ref(0)
const phase = ref<Phase>('draw')
const len = ref(2400)
const textEl = ref<SVGTextElement | null>(null)

let timeoutId: ReturnType<typeof setTimeout> | null = null

const currentWord = computed(() => props.words[index.value])
// Changing this key forces Vue to destroy + recreate the <text> node,
// which restarts the CSS animation cleanly (replaces the old cloneNode hack).
const elKey = computed(() => `${currentWord.value}-${phase.value}`)

function measureLength() {
  nextTick(() => {
    requestAnimationFrame(() => {
      if (!textEl.value) return
      try {
        const l = textEl.value.getComputedTextLength() * 3.2
        len.value = l || 2400
      } catch {
        len.value = 2400
      }
    })
  })
}

function scheduleNext() {
  timeoutId = setTimeout(() => {
    if (phase.value === 'draw') {
      phase.value = 'hold'
    } else if (phase.value === 'hold') {
      phase.value = 'erase'
    } else {
      phase.value = 'draw'
      index.value = (index.value + 1) % props.words.length
    }
    measureLength()
    scheduleNext()
  }, props.timings[phase.value])
}

function start() {
  measureLength()
  scheduleNext()
}

onMounted(() => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start)
  } else {
    window.addEventListener('load', start, { once: true })
  }
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="sakura-root">
    <div class="sakura-bg" aria-hidden="true"></div>
    <section class="sakura-stage" aria-live="polite">
      <svg
        class="draw-svg"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        :aria-label="currentWord"
      >
        <text
          :key="elKey"
          ref="textEl"
          x="600"
          y="190"
          text-anchor="middle"
          :class="['draw-text', `draw-text--${phase}`]"
          :style="{ '--len': len }"
        >{{ currentWord }}</text>
      </svg>
    </section>
  </div>
</template>

<style scoped>
/* Load Caveat / Kalam from index.html instead if you'd rather avoid an
   @import here, e.g.:
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Kalam:wght@300;400&display=swap"> */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Kalam:wght@300;400&display=swap');

.sakura-root {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #0a0a0c;
  color: #f2dde3;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  isolation: isolate;
}

.sakura-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 500px at 20% 20%, rgba(232, 190, 200, 0.1) 0, transparent 55%),
    radial-gradient(700px 400px at 85% 80%, rgba(232, 190, 200, 0.08) 0, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.sakura-stage {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.draw-svg {
  width: min(92vw, 1100px);
  height: auto;
  overflow: visible;
}

.draw-text {
  font-family: 'Caveat', 'Kalam', cursive;
  font-size: 220px;
  font-weight: 500;
  letter-spacing: 0.005em;
  fill: transparent;
  stroke: rgba(244, 208, 218, 0.85);
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  paint-order: fill stroke;
  opacity: 0;
}

.draw-text--draw {
  animation: inkDraw 3.6s cubic-bezier(0.45, 0.02, 0.2, 1) forwards;
  transform-origin: 50% 55%;
}
.draw-text--hold {
  stroke-dashoffset: 0;
  fill: rgba(244, 208, 218, 0.85);
  stroke: transparent;
  stroke-width: 0;
  opacity: 1;
  transform-origin: 50% 55%;
  animation: inkBreathe 1.5s ease-in-out forwards;
}
.draw-text--erase {
  stroke-dashoffset: 0;
  fill: rgba(244, 208, 218, 0.85);
  stroke: transparent;
  stroke-width: 0;
  transform-origin: 50% 55%;
  animation: inkDissolve 1.7s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

@keyframes inkDraw {
  0% {
    stroke-dashoffset: var(--len);
    fill: transparent;
    stroke: rgba(244, 208, 218, 0.85);
    opacity: 0;
    transform: translateY(4px) scale(0.99);
    filter: blur(1px);
  }
  12% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
  80% {
    stroke-dashoffset: 0;
    fill: transparent;
    stroke: rgba(244, 208, 218, 0.85);
    stroke-width: 1.1;
    opacity: 1;
  }
  92% {
    stroke-dashoffset: 0;
    fill: rgba(244, 208, 218, 0.35);
    stroke: rgba(244, 208, 218, 0.55);
    stroke-width: 0.6;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    fill: rgba(244, 208, 218, 0.85);
    stroke: transparent;
    stroke-width: 0;
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
@keyframes inkBreathe {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.005);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes inkDissolve {
  0% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
    letter-spacing: 0.005em;
  }
  100% {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(-10px) scale(1.02);
    letter-spacing: 0.04em;
  }
}

@media (max-width: 720px) {
  .draw-text {
    font-size: 120px;
  }
}
</style>
