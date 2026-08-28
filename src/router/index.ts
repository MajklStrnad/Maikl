import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Hire from '@/views/Hire.vue'
import Gallery from '@/views/Gallery.vue'
import Admin from '@/views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/hire', name: 'Hire', component: Hire },
    { path: '/gallery', name: 'Gallery', component: Gallery },
    { path: '/admin', name: 'Admin', component: Admin },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) => {
        const tryResolve = (attemptsLeft: number) => {
          const el = document.querySelector(to.hash)
          if (el) {
            resolve({ el: to.hash, top: -100 })
          } else if (attemptsLeft > 0) {
            requestAnimationFrame(() => tryResolve(attemptsLeft - 1))
          } else {
            resolve({ top: 0 }) // element never appeared — fail safe to top
          }
        }
        tryResolve(120) // ~2s ceiling at 60fps, well beyond any real transition
      })
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
