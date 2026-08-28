import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

app.use(router)

app.mount('#app')
