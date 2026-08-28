<template>
  <div class="item" :class="{ unread: !inquiry.read, open: expanded }" @click="handleClick">
    <span class="unread-edge" aria-hidden="true"></span>

    <div class="item-row">
      <div class="item-main">
        <span class="dot" v-if="!inquiry.read" aria-hidden="true"></span>
        <span class="name">{{ inquiry.name }}</span>
        <span class="package-tag" :class="inquiry.package">{{ packageLabel }}</span>
      </div>
      <span class="time">{{ relativeTime }}</span>
    </div>

    <p class="preview" v-if="!expanded">{{ inquiry.message }}</p>

    <div v-else class="expanded-content">
      <div class="detail-row">
        <span class="detail-label">{{ inquiry.contact_type === 'phone' ? 'Phone' : 'Email' }}</span>
        <a
          class="detail-value link"
          :href="inquiry.contact_type === 'phone' ? `tel:${inquiry.contact}` : `mailto:${inquiry.contact}`"
          @click.stop
        >{{ inquiry.contact }}</a>
      </div>
      <div class="detail-row">
        <span class="detail-label">Message</span>
        <p class="detail-value message-full">{{ inquiry.message }}</p>
      </div>
      <div class="detail-row">
        <span class="detail-label">Received</span>
        <span class="detail-value muted">{{ fullDate }}</span>
      </div>

      <div class="detail-footer">
        <button
          class="delete-btn"
          :class="{ confirming: confirmDelete }"
          @click.stop="handleDelete"
        >
          {{ confirmDelete ? 'Confirm delete?' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { Inquiry } from '../composables/useInquiries'

const props = defineProps<{ inquiry: Inquiry }>()

const emit = defineEmits<{ 'mark-read': [id: string]; 'delete': [id: string] }>()

const expanded = ref(false)

const packageLabel = computed(() => {
  return { simple: 'Simple', animated: 'Animated', unsure: 'Undecided' }[props.inquiry.package] || props.inquiry.package
})

const relativeTime = computed(() => {
  const diff = Date.now() - new Date(props.inquiry.created_at).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return new Date(props.inquiry.created_at).toLocaleDateString()
})

const fullDate = computed(() => {
  return new Date(props.inquiry.created_at).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
})

function handleClick() {
  expanded.value = !expanded.value
  if (!props.inquiry.read) {
    emit('mark-read', props.inquiry.id)
  }
}

// Two-step delete — first click arms it, second click within 3s confirms.
// Avoids a jarring native confirm() dialog while still preventing accidents.
const confirmDelete = ref(false)
let confirmTimer: ReturnType<typeof setTimeout> | null = null

function handleDelete() {
  if (!confirmDelete.value) {
    confirmDelete.value = true
    confirmTimer = setTimeout(() => { confirmDelete.value = false }, 3000)
    return
  }
  if (confirmTimer) clearTimeout(confirmTimer)
  emit('delete', props.inquiry.id)
}

onUnmounted(() => {
  if (confirmTimer) clearTimeout(confirmTimer)
})
</script>

<style scoped>
.item {
  /* Same tokens as Admin.vue — redeclared here so this row is self-sufficient
     if ever mounted elsewhere. Background stays transparent (the list owns it). */
  --border-color: rgba(255, 255, 255, 0.08);
  --text-color: #ffffff;
  --text-soft: rgba(255, 255, 255, 0.5);
  --text-dim: rgba(255, 255, 255, 0.42);
  --text-faint: rgba(255, 255, 255, 0.3);
  --accent: #ffd1dc;
  --accent-soft: rgba(255, 192, 203, 0.1);
  --accent-line: rgba(255, 192, 203, 0.55);
  --danger: #e08585;
  --danger-soft: rgba(224, 133, 133, 0.12);

  position: relative;
  padding: 16px 18px 17px;
  cursor: pointer;
  background: transparent;
  transition: background 0.25s ease;
  -webkit-font-smoothing: antialiased;
}

.item:hover { background: rgba(255, 255, 255, 0.02); }
.item:active { background: rgba(255, 255, 255, 0.04); }

.item.unread {
  background: linear-gradient(90deg, rgba(255, 192, 203, 0.05), rgba(255, 192, 203, 0) 55%);
}
.item.unread:hover {
  background: linear-gradient(90deg, rgba(255, 192, 203, 0.08), rgba(255, 192, 203, 0.01) 60%);
}

/* pink edge-marker that lights the left rail on unread rows */
.unread-edge {
  position: absolute;
  left: 0;
  top: 50%;
  height: 0;
  width: 2px;
  border-radius: 0 2px 2px 0;
  background: var(--accent);
  transform: translateY(-50%);
  transition: height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.item.unread .unread-edge {
  height: 26px;
  box-shadow: 0 0 12px var(--accent-line);
}
.item.open .unread-edge { height: calc(100% - 30px); }

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px 1px var(--accent-line);
  animation: pulse 3s ease-in-out infinite;
}

.name {
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.005em;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}
.item.unread .name { font-weight: 600; color: var(--text-color); }

.package-tag {
  font-size: 0.58rem;
  font-weight: 500;
  padding: 3px 8px 2px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  flex-shrink: 0;
  border: 1px solid transparent;
}
.package-tag.simple {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-dim);
  border-color: var(--border-color);
}
.package-tag.animated {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: rgba(255, 192, 203, 0.3);
}
.package-tag.unsure {
  background: transparent;
  color: var(--text-faint);
  border-color: var(--border-color);
}

.time {
  font-size: 0.68rem;
  color: var(--text-faint);
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.preview {
  margin-top: 6px;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item.unread .preview { color: var(--text-soft); }

/* ———————————————————————————— Expanded view ———————————————————————————— */

.expanded-content {
  margin-top: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  animation: expand 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes expand {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-row { display: flex; flex-direction: column; gap: 5px; }

.detail-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--accent);
  opacity: 0.85;
  font-weight: 500;
}

.detail-value { font-size: 0.85rem; line-height: 1.5; color: var(--text-color); font-weight: 300; }
.detail-value.muted { color: var(--text-dim); }

.detail-value.link {
  position: relative;
  color: var(--accent);
  text-decoration: none;
  width: fit-content;
  font-weight: 400;
}
.detail-value.link::after {
  content: '';
  position: absolute;
  left: 0; bottom: -2px;
  width: 100%;
  height: 1px;
  background: var(--accent-line);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.detail-value.link:hover::after { transform: scaleX(1); }

.message-full {
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--text-soft);
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
  border-top: 1px solid var(--border-color);
  margin-top: 2px;
}

.delete-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-faint);
  font-family: inherit;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.delete-btn:hover {
  color: var(--danger);
  border-color: rgba(224, 133, 133, 0.35);
  background: var(--danger-soft);
}
.delete-btn.confirming {
  color: var(--danger);
  border-color: rgba(224, 133, 133, 0.5);
  background: var(--danger-soft);
  animation: confirm-pulse 1.1s ease-in-out infinite;
}

@keyframes confirm-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
