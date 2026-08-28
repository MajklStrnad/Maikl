<template>
  <div class="viewport-wrapper">
    <section
      class="hero-container"
      :class="{ 'is-mobile': isMobile }"
      id="hero"
      :style="{
        '--x': pos.x + 'px',
        '--y': pos.y + 'px',
        '--mask-scale': pos.scale,
        '--scroll-progress': scrollProgress,
      }"
    >
      <div class="layer layer-bloomed">
        <img
          :src="isMobile ? '/blooming-mobile.png' : '/blooming.png'"
          alt=""
          loading="lazy"
          fetchpriority="low"
          decoding="async"
        />
      </div>
      <div class="layer layer-bare">
        <img
          :src="isMobile ? '/bare-mobile.png' : '/bare.png'"
          alt=""
          loading="lazy"
          fetchpriority="low"
          decoding="async"
        />
      </div>
      <div class="cursor-glow"></div>

      <div class="overlay-text">
        <h1>MAIKL</h1>
      </div>

      <div class="scroll-indicator">Scroll to Explore</div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';

const scrollProgress = ref(0);
const isMobile = ref(false);

const pos = reactive({
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  scale: 1,
});

let mouseX = pos.x;
let mouseY = pos.y;
let targetScale = 1;
let rafId = null;

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

const handleMouseMove = (e) => {
  const dx = e.clientX - mouseX;
  const dy = e.clientY - mouseY;
  const velocity = Math.sqrt(dx * dx + dy * dy);
  mouseX = e.clientX;
  mouseY = e.clientY;
  targetScale = 1 + Math.min(velocity / 100, 0.5);
};

const handleScroll = () => {
  scrollProgress.value = Math.min(window.scrollY / window.innerHeight, 1);
};

const update = () => {
  pos.x = lerp(pos.x, mouseX, 0.1);
  pos.y = lerp(pos.y, mouseY, 0.1);
  pos.scale = lerp(pos.scale, targetScale, 0.1);
  rafId = requestAnimationFrame(update);
};

const checkMobile = () => {
  const next = window.innerWidth <= 768;
  if (next === isMobile.value) return;

  isMobile.value = next;

  if (isMobile.value) {
    window.removeEventListener('mousemove', handleMouseMove);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  } else {
    window.addEventListener('mousemove', handleMouseMove);
    if (!rafId) update();
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  if (!isMobile.value) {
    window.addEventListener('mousemove', handleMouseMove);
    update();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('scroll', handleScroll);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.overlay-text p {
  display: flex;
  align-items: center;
}

.overlay-text p span {
  font-size: 1.5rem;
  margin: 0 20px;
}

.viewport-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

.hero-container {
  --mask-radius: 220px;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
  transform: scale(calc(1 + var(--scroll-progress) * 0.5));
  opacity: calc(1 - var(--scroll-progress) * 2);
  pointer-events: auto;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.layer-bloomed {
  z-index: 1;
}

.layer-bare {
  z-index: 2;
  mask-image: radial-gradient(
    circle calc(var(--mask-radius) * var(--mask-scale)) at var(--x) var(--y),
    transparent 0%,
    rgba(0, 0, 0, 0.4) 60%,
    black 100%
  );
  -webkit-mask-image: radial-gradient(
    circle calc(var(--mask-radius) * var(--mask-scale)) at var(--x) var(--y),
    transparent 0%,
    rgba(0, 0, 0, 0.4) 60%,
    black 100%
  );
}

/* Mobile: static reveal from top-left, ~half page, with matching pink glow */
.hero-container.is-mobile .layer-bare {
  mask-image: radial-gradient(
    circle 75vh at top left,
    transparent 0%,
    rgba(0, 0, 0, 0.4) 50%,
    black 100%
  );
  -webkit-mask-image: radial-gradient(
    circle 75vh at top left,
    transparent 0%,
    rgba(0, 0, 0, 0.4) 50%,
    black 100%
  );
}

.cursor-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--mask-radius) * 2.5);
  height: calc(var(--mask-radius) * 2.5);
  background: radial-gradient(circle, rgba(255, 192, 203, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
  transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(var(--mask-scale));
  mix-blend-mode: screen;
  opacity: 0.6;
}

/* Mobile: static pink glow anchored to top-left, reaching ~half the page */
.hero-container.is-mobile .cursor-glow {
  width: 90vh;
  height: 90vh;
  top: -55vw;
  left: -55vw;
  transform: none;
}

.overlay-text {
  position: relative;
  z-index: 10;
  text-align: center;
  pointer-events: none;
  text-transform: uppercase;
  transform: translateY(calc(var(--scroll-progress) * -100px));
}

.overlay-text h1 {
  font-size: clamp(2.5rem, 10vw, 6rem);
  font-weight: 100;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5em;
  margin-right: -0.5em;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  opacity: calc(0.5 - var(--scroll-progress) * 5);
  transition: opacity 0.3s ease;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.4em;
}

@media (max-width: 768px) {
  .hero-container {
    --mask-radius: 150px;
  }
}
</style>
