<template>
  <div id="app-container">
    <!-- 1. Add the Navbar here -->
    <Navbar />
    
    <!-- The Petals stay global as well -->
    <Petals />
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// 2. Import the components
import Navbar from './components/Navbar.vue';
import Petals from './components/Petals.vue';
import { onMounted } from 'vue'

const RENDER_APP_URL = 'https://massage-academy.onrender.com/'

onMounted(() => {
  fetch(RENDER_APP_URL, { mode: 'no-cors' }).catch(() => {})
})
</script>

<style scoped>
#app-container {
  position: relative;
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
