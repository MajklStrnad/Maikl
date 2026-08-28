<template>
  <div class="home-wrapper">
    <Hero />

    <div class="content-wrapper">
      <section class="pricing-section" id="pricing">
        <div class="pricing-header" ref="pricingHeader">
          <h2>Select Your Plan</h2>
        </div>

        <div class="pricing-container">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="pricing-card"
            :class="{ 'is-expanded': expandedStates[index] }"
            :style="{ transitionDelay: `${index * 0.06}s` }"
            ref="pricingCards"
          >
            <div class="card-header" @click="toggleCard(index)">
              <h3>
                {{ plan.name }}
                <span class="collapse-icon" aria-hidden="true"></span>
              </h3>
            </div>
            <div class="pricing-collapse">
              <div class="price">
                {{ plan.price }}<span>{{ plan.period }}</span>
              </div>
              <ul class="features">
                <li v-for="(feature, fIndex) in plan.features" :key="fIndex">
                  {{ feature }}
                </li>
              </ul>
            </div>
            <a href="#" class="cta-button" @click.stop.prevent>{{ plan.cta }}</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Hero from '@/components/Hero.vue';

const pricingHeader = ref(null);
const pricingCards = ref([]);

const plans = [
  {
    name: 'Single Page',
    price: '€600',
    period: '',
    features: [
      'One custom landing page',
      'Hero animations & scroll effects',
      'Contact form (emails you directly)',
      'Mobile responsive',
      'Basic SEO setup',
      '1 round of revisions',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Multi-Page',
    price: '€1,200',
    period: '',
    features: [
      'Up to 4 pages',
      'Animations throughout',
      'Simple content editor',
      'Contact form',
      'Mobile responsive',
      '2 rounds of revisions',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Custom Build',
    price: '€2,000',
    period: '',
    features: [
      'Up to 6 pages or 1 complex page',
      'Advanced animations / WebGL',
      'Custom features we agree on',
      'Content editor included',
      'Mobile responsive',
      '3 rounds of revisions',
    ],
    cta: 'Inquire Now',
  },
];

const expandedStates = ref(plans.map(() => false));

function smoothScrollTo(targetY, duration = 350) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    return;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function toggleCard(index) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) return;

  const wasExpanded = expandedStates.value[index];
  const el = pricingCards.value[index];
  if (!el) return;

  if (wasExpanded) {
    expandedStates.value[index] = false;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const rect = el.getBoundingClientRect();
  const targetY = Math.max(0, window.scrollY + rect.top - 200);

  expandedStates.value[index] = true;

  requestAnimationFrame(() => {
    smoothScrollTo(targetY);
  });
}

onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  if (pricingHeader.value) revealObserver.observe(pricingHeader.value);
  pricingCards.value.forEach((el) => {
    if (el) revealObserver.observe(el);
  });
});
</script>

<style>
:root {
  --bg-color: #0a0a0a;
  --card-bg: #141414;
  --text-color: #ffffff;
  --accent-pink: rgba(255, 192, 203, 0.3);
  --border-color: rgba(255, 255, 255, 0.05);
}
</style>

<style scoped>
.home-wrapper {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding-top: 100vh;
}

.pricing-section {
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  min-height: 100vh;
  position: relative;
}

.pricing-header {
  text-align: center;
  margin-bottom: 100px;
  transform: translateY(50px);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pricing-header.visible {
  transform: translateY(0);
  opacity: 1;
}

.pricing-header h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 100;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.pricing-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1200px;
  width: 100%;
}

.pricing-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #161616, #0d0d0d);
  border: 1px solid var(--border-color);
  padding: 60px 40px;
  border-radius: 2px;
  text-align: center;
  transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(80px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(10px);
}

.pricing-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    transparent 47%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 53%
  );
  transform: translate(-60%, -60%);
  animation: shimmer-sweep 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer-sweep {
  0% {
    transform: translate(-60%, -60%);
  }
  20%, 100% {
    transform: translate(60%, 60%);
  }
}

.pricing-card.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (hover: hover) and (pointer: fine) {
  .pricing-card:hover {
    border-color: rgba(255, 192, 203, 0.3);
    transform: translateY(-15px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 192, 203, 0.12),
      0 0 50px rgba(255, 192, 203, 0.08), 0 0 100px rgba(255, 192, 203, 0.04);
  }

  .pricing-card:hover .features li {
    opacity: 0.8;
  }
}

.pricing-card h3 {
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 30px;
  color: #ffd1dc;
}

.price {
  font-size: 3.5rem;
  font-weight: 100;
  margin-bottom: 40px;
}

.price span {
  font-size: 0.9rem;
  opacity: 0.4;
  letter-spacing: 0.1em;
}

.features {
  list-style: none;
  margin-bottom: 50px;
  text-align: left;
  border-top: 1px solid var(--border-color);
  padding-top: 30px;
}

.features li {
  font-size: 0.85rem;
  font-weight: 300;
  margin-bottom: 18px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.collapse-icon {
  display: none;
}

.cta-button {
  position: relative;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-color);
  padding: 18px 0;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  text-decoration: none;
  width: 100%;
  display: block;
  overflow: hidden;
  z-index: 1;
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
  transition: opacity 0.6s ease, filter 0.6s ease;
}

.cta-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(18, 18, 18, 0.7);
  z-index: -1;
  transition: opacity 0.6s ease;
}

.cta-button:hover {
  letter-spacing: 0.4em;
  transform: scale(1.02);
}

@keyframes rotate-gradient {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .pricing-container {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
  }

  .pricing-card,
  .pricing-card.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  .pricing-card {
    width: 100%;
    max-width: 380px;
    padding: 22px 30px;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: border-color 0.3s ease, padding 0.3s ease;
  }

  .card-header {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 0;
  }

  .pricing-card.is-expanded .card-header {
    margin-bottom: 4px;
  }

  .pricing-card h3 {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .collapse-icon {
    display: inline-block;
    position: relative;
    width: 10px;
    height: 10px;
    flex: 0 0 auto;
  }
  .collapse-icon::before,
  .collapse-icon::after {
    content: '';
    position: absolute;
    background: #ffd1dc;
    transition: transform 0.3s ease;
  }
  .collapse-icon::before {
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    transform: translateY(-50%);
  }
  .collapse-icon::after {
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    transform: translateX(-50%);
  }
  .pricing-card.is-expanded .collapse-icon::after {
    transform: translateX(-50%) rotate(90deg);
    opacity: 0;
  }

  .pricing-collapse {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    margin-top: 0;
    transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.22s ease, margin-top 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .pricing-card.is-expanded .pricing-collapse {
    max-height: 420px;
    opacity: 1;
    margin-top: 30px;
    transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.28s ease 0.06s, margin-top 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cta-button {
    max-height: 0;
    opacity: 0;
    padding: 0;
    border: none;
    margin-top: 0;
    overflow: hidden;
    transition: max-height 0.28s ease, opacity 0.18s ease,
      padding 0.22s ease, margin-top 0.22s ease;
  }
  .pricing-card.is-expanded .cta-button {
    max-height: 60px;
    opacity: 1;
    padding: 18px 0;
    border: 1px solid rgba(255, 255, 255, 0.15);
    margin-top: 24px;
    transition: max-height 0.28s ease, opacity 0.24s ease 0.1s,
      padding 0.22s ease, margin-top 0.22s ease;
  }

  .pricing-card.is-expanded {
    padding: 36px 30px;
  }
  .pricing-card.is-expanded h3 {
    margin-bottom: 4px;
  }
}
</style>
