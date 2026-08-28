import { ref, watch } from 'vue'
import { supabase } from '../supabase'
import { useAuth } from './useAuth'

export interface Inquiry {
  id: string
  created_at: string
  name: string
  contact: string
  contact_type: 'phone' | 'email'
  package: 'simple' | 'animated' | 'unsure'
  message: string
  read: boolean
}

export function useInquiries() {
  const { session } = useAuth()
  const inquiries = ref<Inquiry[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  let channel: ReturnType<typeof supabase.channel> | null = null

  async function fetchInquiries() {
    loading.value = true
    const { data, error: fetchError } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      error.value = fetchError.message
    } else {
      inquiries.value = data as Inquiry[]
    }
    loading.value = false
  }

  async function markAsRead(id: string) {
    const item = inquiries.value.find(i => i.id === id)
    if (item) item.read = true

    const { error: updateError } = await supabase
      .from('inquiries')
      .update({ read: true })
      .eq('id', id)

    if (updateError && item) {
      item.read = false
    }
  }

  function notifyNewInquiry(row: Inquiry) {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    const pkgLabel = { simple: 'Simple', animated: 'Animated', unsure: 'Undecided' }[row.package] || row.package

    new Notification('New inquiry', {
      body: `${row.name} — ${pkgLabel}`,
      tag: row.id
    })
  }

  function start() {
    fetchInquiries()

    channel = supabase
      .channel('inquiries-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'inquiries' },
        (payload) => {
          inquiries.value.unshift(payload.new as Inquiry)
          notifyNewInquiry(payload.new as Inquiry)
        }
      )
      .subscribe()
  }

  function stop() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
    inquiries.value = []
  }

  // React to login/logout rather than mount/unmount, since this composable
  // is instantiated as soon as Admin.vue mounts — before auth resolves.
  watch(
    () => !!session.value,
    (isAuthed) => {
      if (isAuthed) start()
      else stop()
    },
    { immediate: true }
  )

  return { inquiries, loading, error, fetchInquiries, markAsRead }
}
