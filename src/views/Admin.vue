<template>
  <Login v-if="!loading && !session" />

  <div v-else-if="!loading" class="admin">
    <header class="header">
      <div class="header-inner">
        <div class="header-top">
          <h1>
            <span class="h1-mark" aria-hidden="true"></span>
            <span class="h1-word">Inquiries</span>
          </h1>
          <div class="header-actions">
            <button
              v-if="notifPermission === 'default'"
              class="enable-notif-btn"
              @click="requestNotifications"
            >
              <span class="bell-dot" aria-hidden="true"></span>
              Enable alerts
            </button>
            <span v-else-if="notifPermission === 'denied'" class="notif-blocked">
              Alerts blocked
            </span>
            <button class="signout-btn" @click="signOut">Sign out</button>
          </div>
        </div>
        <div class="tabs">
          <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
            All
          </button>
          <button :class="{ active: filter === 'unread' }" @click="filter = 'unread'">
            Unread<span v-if="unreadCount" class="tab-count">{{ unreadCount }}</span>
          </button>
          <span class="tab-rule" aria-hidden="true"></span>
        </div>
      </div>
    </header>

    <main class="list">
      <div class="list-card">
        <div v-if="loadingInquiries" class="state-msg">
          <span class="spinner" aria-hidden="true"></span>
          Loading
        </div>
        <div v-else-if="error" class="state-msg error">{{ error }}</div>
        <div v-else-if="filtered.length === 0" class="state-msg empty">
          <span class="empty-glyph" aria-hidden="true">✦</span>
          {{ filter === 'unread' ? 'Nothing unread.' : 'No inquiries yet.' }}
        </div>
        <InquiryItem
          v-for="inquiry in filtered"
          :key="inquiry.id"
          :inquiry="inquiry"
          @mark-read="markAsRead"
          @delete="deleteInquiry"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInquiries } from '../composables/useInquiries'
import { useAuth } from '../composables/useAuth'
import InquiryItem from '../components/InquiryItem.vue'
import Login from '../components/Login.vue'

const { session, loading, signOut } = useAuth()
const { inquiries, loading: loadingInquiries, error, markAsRead } = useInquiries()

const filter = ref<'all' | 'unread'>('all')
const notifPermission = ref<NotificationPermission>('default')

const unreadCount = computed(() => inquiries.value.filter(i => !i.read).length)

const filtered = computed(() => {
  if (filter.value === 'unread') return inquiries.value.filter(i => !i.read)
  return inquiries.value
})

async function requestNotifications() {
  if (!('Notification' in window)) return
  notifPermission.value = await Notification.requestPermission()
}

// NOTE: useInquiries doesn't currently expose a delete method, so this talks
// to Supabase directly here — same REST pattern ContactForm.vue uses for its
// insert. If you later add a deleteInquiry() to the composable, swap this
// out for that instead, so all Supabase access lives in one place.
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function deleteInquiry(id: string) {
  const prev = inquiries.value
  inquiries.value = inquiries.value.filter(i => i.id !== id) // optimistic

  const accessToken = session.value?.access_token
  if (!accessToken) {
    // Not actually signed in (shouldn't happen here, but fail loudly rather
    // than silently — this is the state that made the earlier bug invisible).
    inquiries.value = prev
    console.error('[delete-inquiry] no session access token — are you signed in?')
    return
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/inquiries?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        // The authenticated user's token, not the anon key — RLS policies
        // for delete are almost always scoped to an authenticated admin,
        // so deleting with the anon key gets silently blocked by RLS.
        'Authorization': `Bearer ${accessToken}`,
        // Ask PostgREST to return the row(s) actually deleted. Without this,
        // Supabase returns 204 "success" even when RLS matched zero rows —
        // there's no way to tell a real delete from a silently blocked one.
        'Prefer': 'return=representation',
      },
    })
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
    const deletedRows = await res.json()
    if (!Array.isArray(deletedRows) || deletedRows.length === 0) {
      // Request "succeeded" but matched nothing — almost certainly RLS
      // silently blocking the delete rather than the row not existing.
      throw new Error('Delete matched 0 rows — likely blocked by a row level security policy')
    }
  } catch (err) {
    inquiries.value = prev // roll back — the row is still there in Supabase
    console.error('[delete-inquiry]', err)
  }
}

onMounted(() => {
  if ('Notification' in window) {
    notifPermission.value = Notification.permission
  }
})
</script>

<style scoped>
.admin {
  /* Same tokens as the rest of the site (see :root in Home.vue) —
     kept local here too since the admin panel is a separate route/bundle. */
  --bg-color: #0a0a0a;
  --card-bg: #141414;
  --text-color: #ffffff;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-bright: rgba(255, 192, 203, 0.35);
  --text-soft: rgba(255, 255, 255, 0.5);
  --text-faint: rgba(255, 255, 255, 0.3);
  --accent: #ffd1dc;
  --accent-line: rgba(255, 192, 203, 0.55);
  --accent-soft: rgba(255, 192, 203, 0.1);
  --danger: rgba(220, 90, 90, 0.85);

  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-color);
  color: var(--text-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ——————————————————————————————— Header ——————————————————————————————— */

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 22px;
  padding-top: env(safe-area-inset-top);

  background: rgba(10, 10, 10, 0.85);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);

  animation: drop-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.header-inner {
  max-width: 760px;
  margin: 0 auto;
  padding-top: 22px;
}

/* pink hairline riding the header's lower edge — same idea as the
   nav-hire-btn glow elsewhere, kept quiet here since this is a work tool */
.header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-line) 30%, var(--accent-line) 70%, transparent);
  opacity: 0.6;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--text-color);
}

.h1-word {
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s both;
}

.h1-mark {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px 1px var(--accent-line);
  animation: pulse-mark 3.4s ease-in-out infinite;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.16s both;
}

button { font-family: inherit; }

.enable-notif-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid rgba(255, 192, 203, 0.28);
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.25s ease, border-color 0.25s ease;
}
.enable-notif-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 192, 203, 0.18);
  border-color: rgba(255, 192, 203, 0.45);
}
.enable-notif-btn:active { transform: translateY(0); }

.bell-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse-mark 2s ease-in-out infinite;
}

.signout-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-faint);
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.signout-btn:hover {
  color: var(--text-color);
  border-color: var(--border-bright);
  background: rgba(255, 255, 255, 0.04);
}

.notif-blocked {
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--text-faint);
}

/* ———————————————————————————————— Tabs ———————————————————————————————— */
/* Same "grow the underline from 0" language as the nav links and the
   contact form's field underlines — one motif, reused everywhere. */

.tabs {
  position: relative;
  display: flex;
  gap: 28px;
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.24s both;
}

.tabs button {
  position: relative;
  background: transparent;
  border: none;
  color: var(--text-faint);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 4px 1px 13px;
  cursor: pointer;
  transition: color 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.tabs button:hover { color: var(--text-soft); }
.tabs button.active { color: var(--text-color); }

.tabs button::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.tabs button.active::after { transform: scaleX(1); }

.tab-count {
  font-size: 0.6rem;
  font-weight: 500;
  line-height: 1;
  padding: 3px 6px 2px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
}

.tab-rule {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--border-color);
}

/* ———————————————————————————————— List ———————————————————————————————— */

.list {
  max-width: 760px;
  margin: 36px auto 100px;
  padding: 0 22px;
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.32s both;
}

.list-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(145deg, #141414, #0d0d0d);
}

.list-card :deep(> *) {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
}
.list-card :deep(> *:last-child) { border-bottom: none; }
.list-card :deep(> *:hover) { background: rgba(255, 192, 203, 0.03); }

.state-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 90px 24px;
  text-align: center;
  color: var(--text-faint);
  font-size: 0.85rem;
  letter-spacing: 0.01em;
}
.state-msg.error { color: var(--danger); }

.empty-glyph {
  font-size: 1.3rem;
  color: var(--accent);
  opacity: 0.6;
  animation: pulse-mark 3.4s ease-in-out infinite;
}

.spinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}

/* —————————————————————————————— Keyframes —————————————————————————————— */

@keyframes drop-in {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-mark {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
