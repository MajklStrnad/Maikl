<template>
  <div class="petals-container" ref="petalsContainer"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const petalsContainer = ref(null);
const svgNS = 'http://www.w3.org/2000/svg';
let mounted = true;
const pendingTimeouts = new Set();

const scheduleTimeout = (fn, ms) => {
  const id = setTimeout(() => {
    pendingTimeouts.delete(id);
    fn();
  }, ms);
  pendingTimeouts.add(id);
  return id;
};

const buildPetalSVG = () => {
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  const defs = document.createElementNS(svgNS, 'defs');
  const gradientId = 'pg-' + Math.random().toString(36).slice(2, 9);
  const gradient = document.createElementNS(svgNS, 'radialGradient');
  gradient.setAttribute('id', gradientId);
  gradient.setAttribute('cx', '50%');
  gradient.setAttribute('cy', '30%');
  gradient.setAttribute('r', '70%');

  const stops = [
    ['0%', 'oklch(0.98 0.03 20)'],
    ['55%', 'oklch(0.88 0.09 15)'],
    ['100%', 'oklch(0.72 0.14 10)'],
  ];
  stops.forEach(([offset, color]) => {
    const stop = document.createElementNS(svgNS, 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    gradient.appendChild(stop);
  });
  defs.appendChild(gradient);
  svg.appendChild(defs);

  const petalPath = document.createElementNS(svgNS, 'path');
  petalPath.setAttribute(
    'd',
    'M16 2 C 22 8, 26 14, 22 22 C 20 26, 18 28, 16 30 C 14 28, 12 26, 10 22 C 6 14, 10 8, 16 2 Z'
  );
  petalPath.setAttribute('fill', `url(#${gradientId})`);
  petalPath.setAttribute('stroke', 'oklch(0.6 0.13 10 / 0.5)');
  petalPath.setAttribute('stroke-width', '0.5');

  const veinPath = document.createElementNS(svgNS, 'path');
  veinPath.setAttribute('d', 'M16 6 Q 15 18, 16 28');
  veinPath.setAttribute('stroke', 'oklch(0.55 0.14 10 / 0.55)');
  veinPath.setAttribute('stroke-width', '0.6');
  veinPath.setAttribute('fill', 'none');

  svg.appendChild(petalPath);
  svg.appendChild(veinPath);
  return svg;
};

const createPetal = () => {
  if (!mounted || !petalsContainer.value) return;

  const size = 10 + Math.random() * 18;
  const left = Math.random() * 100;
  const duration = 14 + Math.random() * 18;
  const delay = Math.random() * duration;
  const drift = (Math.random() * 200 - 100).toFixed(0) + 'px';
  const opacity = 0.5 + Math.random() * 0.45;
  const swayDuration = 4 + Math.random() * 4;

  const wrapper = document.createElement('div');
  wrapper.classList.add('petal');
  wrapper.style.left = `${left}%`;
  wrapper.style.width = `${size}px`;
  wrapper.style.height = `${size}px`;
  wrapper.style.opacity = opacity;
  wrapper.style.animationDuration = `${duration}s`;
  wrapper.style.animationDelay = `-${delay}s`;
  wrapper.style.setProperty('--drift', drift);
  wrapper.style.filter = 'drop-shadow(0 2px 4px oklch(0.7 0.1 15 / 0.35))';

  const sway = document.createElement('div');
  sway.classList.add('petal-sway');
  sway.style.animationDuration = `${swayDuration}s`;
  sway.appendChild(buildPetalSVG());

  wrapper.appendChild(sway);
  petalsContainer.value.appendChild(wrapper);

  scheduleTimeout(() => {
    if (wrapper.parentNode) wrapper.remove();
    createPetal();
  }, (duration - delay) * 1000);
};

onMounted(() => {
  mounted = true;
  for (let i = 0; i < 35; i++) {
    scheduleTimeout(createPetal, Math.random() * 5000);
  }
});

onUnmounted(() => {
  mounted = false;
  pendingTimeouts.forEach(clearTimeout);
  pendingTimeouts.clear();
});
</script>

<style scoped>
.petals-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
  opacity: .6;
}
:deep(.petal) {
  position: absolute;
  top: 0;
  will-change: transform, opacity;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
:deep(.petal-sway) {
  width: 100%;
  height: 100%;
  animation-name: sway;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
:deep(.petal svg) {
  display: block;
  width: 100%;
  height: 100%;
}
@keyframes fall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  100% {
    transform: translate3d(var(--drift, 40px), 110vh, 0) rotate(720deg);
    opacity: 0;
  }
}
@keyframes sway {
  0%, 100% {
    transform: translateX(-14px);
  }
  50% {
    transform: translateX(14px);
  }
}
</style>
