<template>
  <div class="login-screen">
    <form class="login-card" @submit.prevent="handleSubmit">
      <p class="title">Sign in</p>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="username"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true
  const error = await signIn(email.value, password.value)
  loading.value = false
  if (error) errorMsg.value = 'Wrong email or password.'
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #f0f0f5;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 14px;
  color: #f0f0f5;
  outline: none;
  font-family: inherit;
}

input:focus {
  border-color: rgba(139, 124, 246, 0.5);
}

button {
  margin-top: 4px;
  background: rgba(139, 124, 246, 0.15);
  color: #8b7cf6;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  font-size: 12.5px;
  color: #ff6b6b;
  text-align: center;
}
</style>
