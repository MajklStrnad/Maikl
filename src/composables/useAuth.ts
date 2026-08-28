import { ref, onMounted } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabase'

const session = ref<Session | null>(null)
const loading = ref(true)
let initialized = false

export function useAuth() {
  async function init() {
    if (initialized) return
    initialized = true

    const { data } = await supabase.auth.getSession()
    session.value = data.session
    loading.value = false

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
    })
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  onMounted(init)

  return { session, loading, signIn, signOut }
}
