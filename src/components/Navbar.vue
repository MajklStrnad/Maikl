<template>
  <nav
    class="navbar navbar-scrolled"
    :class="{
      'navbar-hidden': shouldHideNavbar
    }"
  >
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        <span class="logo-text">MAIKL</span>
      </router-link>

      <div class="nav-links">
        <a href="/" class="nav-link" :class="{ active: route.path === '/' }" @click="goHome">
          <span class="link-text">Home</span>
          <span class="link-line"></span>
        </a>
        <router-link to="/gallery" class="nav-link" active-class="active">
          <span class="link-text">Gallery</span>
          <span class="link-line"></span>
        </router-link>
        <router-link to="/about" class="nav-link" active-class="active">
          <span class="link-text">About Maikl</span>
          <span class="link-line"></span>
        </router-link>
        <router-link to="/hire" class="nav-hire-btn">
          <span class="btn-text">START A PROJECT</span>
        </router-link>
      </div>

      <button class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span class="toggle-line" :class="{ 'open': isMobileMenuOpen }"></span>
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <a href="/" class="mobile-link" @click="goHome">Home</a>
        <router-link to="/gallery" class="mobile-link" @click="isMobileMenuOpen = false">Gallery</router-link>
        <router-link to="/about" class="mobile-link" @click="isMobileMenuOpen = false">About Maikl</router-link>
        <router-link to="/hire" class="mobile-link hire" @click="isMobileMenuOpen = false">START A PROJECT</router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isMobileMenuOpen = ref(false);
const isHeroVisible = ref(true);

// Navbar always uses the solid style — no transparent/pink variant.

// Only hide if we are on the Home page AND the hero is visible.
// route.hash === '#pricing' means we're navigating straight to pricing —
// don't hide the navbar just because the scroll hasn't caught up yet.
const shouldHideNavbar = computed(() => {
  const isHomePage = route.path === '/';
  const headingToPricing = route.hash === '#pricing';
  return isHomePage && isHeroVisible.value && !isMobileMenuOpen.value && !headingToPricing;
});

const handleScroll = () => {
  isHeroVisible.value = window.scrollY < window.innerHeight * 0.8;
};

// Same offset the router's scrollBehavior uses for hash navigation (index.ts),
// so "Home" lands in the same spot whether you're already on / or coming from elsewhere.
const PRICING_SCROLL_OFFSET = 100;

const goHome = (e: MouseEvent) => {
  e.preventDefault();
  isMobileMenuOpen.value = false;

  if (route.path === '/') {
    // Already home — the hash won't change, so router scrollBehavior won't fire.
    // Scroll directly to the same target it would have used, and set the
    // hash ourselves so shouldHideNavbar's check above stays accurate.
    router.replace({ hash: '#pricing' });
    const el = document.getElementById('pricing');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY + PRICING_SCROLL_OFFSET;
    }
  } else {
    router.push({ path: '/', hash: '#pricing' });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 15px 0;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 192, 203, 0.1);
}

.navbar-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  text-decoration: none;
  z-index: 101;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 100;
  letter-spacing: 0.5em;
  color: var(--text-color);
  transition: all 0.5s ease;
}

.nav-logo:hover .logo-text {
  letter-spacing: 0.7em;
  color: #ffd1dc;
  text-shadow: 0 0 20px rgba(255, 192, 203, 0.5);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.6;
  transition: all 0.3s ease;
  padding: 5px 0;
  cursor: pointer;
}

.nav-link:hover, .nav-link.active {
  opacity: 1;
  color: #ffd1dc;
}

.link-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #ffd1dc;
  transition: width 0.3s ease;
}

.nav-link:hover .link-line, .nav-link.active .link-line {
  width: 100%;
}

.nav-hire-btn {
  position: relative;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-color);
  padding: 12px 30px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  text-decoration: none;
  display: block;
  overflow: hidden;
  z-index: 1;
  transform-origin: left center;
}

.nav-hire-btn::before {
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
  transition: opacity 0.6s ease;
}

.nav-hire-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(18, 18, 18, 0.7);
  z-index: -1;
  transition: opacity 0.6s ease;
}

.nav-hire-btn:hover {
  transform: scale(1.05);
  border-color: rgba(255, 192, 203, 0.5);
}

@keyframes rotate-gradient {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 101;
}

.toggle-line {
  display: block;
  width: 25px;
  height: 1px;
  background: var(--text-color);
  position: relative;
  transition: all 0.3s ease;
}

.toggle-line::before, .toggle-line::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background: var(--text-color);
  transition: all 0.3s ease;
}

.toggle-line::before { top: -8px; }
.toggle-line::after { bottom: -8px; }

.toggle-line.open { background: transparent; }
.toggle-line.open::before { transform: rotate(45deg); top: 0; }
.toggle-line.open::after { transform: rotate(-45deg); bottom: 0; }

@media (max-width: 992px) {
  .nav-links { display: none; }
  .mobile-toggle { display: block; }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    z-index: 100;
  }

  .mobile-link {
    text-decoration: none;
    color: var(--text-color);
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    opacity: 0.6;
    cursor: pointer;
  }

  .mobile-link.hire {
    color: #ffd1dc;
    opacity: 1;
    border: 1px solid rgba(255, 192, 203, 0.3);
    padding: 15px 40px;
    margin-top: 20px;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
