<template>
  <div class="notfound-page">
    <div class="notfound-glow" aria-hidden="true"></div>

    <div class="notfound-content" :class="{ visible: mounted }">
      <h1 class="code">404</h1>
      <p class="title">This page doesn't exist.</p>

      <RouterLink to="/" class="cta-button">Back to home →</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Simple mount-triggered reveal (not scroll-triggered like the pricing
// cards — this page is short enough that everything's already in view).
const mounted = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})
</script>

<style scoped>
.notfound-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: var(--bg-color, #0a0a0a);
  color: var(--text-color, #ffffff);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.notfound-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(1100px, 160vw);
  height: min(1100px, 160vw);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 192, 203, 0.09), transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.notfound-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.notfound-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.code {
  font-size: clamp(8rem, 26vw, 18rem);
  font-weight: 100;
  line-height: 0.9;
  letter-spacing: 0.02em;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #ffd1dc 45%, #ffc0cb 65%, #ffffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: code-shimmer 8s ease-in-out infinite;
}
@keyframes code-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title {
  font-size: clamp(0.95rem, 2.2vw, 1.15rem);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin: 8px 0 48px;
}

/* same rotating conic-gradient treatment as the pricing CTA button, for
   visual continuity with the rest of the site */
.cta-button {
  position: relative;
  display: inline-block;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-color, #ffffff);
  padding: 18px 44px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  z-index: 1;
  transition: letter-spacing 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.2s;
}
.cta-button::before {
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
.cta-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(18, 18, 18, 0.7);
  z-index: -1;
}
.cta-button:hover {
  letter-spacing: 0.4em;
  transform: scale(1.02);
}
@keyframes rotate-gradient {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .code { animation: none !important; }
  .cta-button::before { animation: none !important; }
}
</style>
