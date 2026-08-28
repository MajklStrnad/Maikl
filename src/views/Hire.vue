<template>
  <section class="contact">
    <div class="frame">
      <form class="form" @submit.prevent>

        <!-- Name -->
        <div class="ufield" :class="{ err: errors.name, focused: activeField === 'name' }">
          <label for="inp-name">Your name</label>
          <input
            id="inp-name" v-model="form.name" type="text"
            @focus="activeField = 'name'"
            @blur="activeField = null; validate('name')"
          />
          <span class="uline"></span>
          <p class="err-msg">{{ errors.name }}</p>
        </div>

        <!-- Contact -->
        <div class="contact-block">
          <div class="contact-tabs">
            <button 
              type="button" 
              :class="{ active: form.contactType === 'phone' }" 
              @click="switchContact('phone')"
            >Phone</button>
            <div class="tab-divider"></div>
            <button 
              type="button" 
              :class="{ active: form.contactType === 'email' }" 
              @click="switchContact('email')"
            >Email</button>
          </div>

          <div class="ufield" :class="{ err: errors.contact, focused: activeField === 'contact' }" ref="contactFieldRef">
            <label for="inp-contact">{{ form.contactType === 'phone' ? 'Phone number' : 'Email address' }}</label>

            <div class="input-group">
              <button
                v-if="form.contactType === 'phone'"
                type="button"
                class="cc-chip"
                :class="{ open: ccMenuOpen }"
                @click="toggleCcMenu"
              >
                <span>{{ selectedCountry.flag }}</span>
                <span>{{ selectedCountry.dial }}</span>
                <svg class="chev" viewBox="0 0 10 6" width="9" height="6">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <input
                id="inp-contact" v-model="form.contact"
                :type="form.contactType === 'phone' ? 'tel' : 'email'"
                @focus="activeField = 'contact'"
                @blur="activeField = null; validate('contact')"
              />
            </div>

            <span class="uline"></span>
            <p class="err-msg">{{ errors.contact }}</p>

            <Transition name="cc-pop">
              <div v-if="ccMenuOpen" class="cc-panel" @click.stop>
                <input
                  v-model="ccSearch" type="text" class="cc-search"
                  placeholder="Search country or code" ref="ccSearchRef"
                />
                <div class="cc-list">
                  <button
                    v-for="c in filteredCountries" :key="c.code"
                    type="button" class="cc-item"
                    :class="{ sel: c.code === selectedCountry.code }"
                    @click="selectCountry(c)"
                  >
                    <span class="cc-flag">{{ c.flag }}</span>
                    <span class="cc-name">{{ c.name }}</span>
                    <span class="cc-dial">{{ c.dial }}</span>
                  </button>
                  <p v-if="!filteredCountries.length" class="cc-empty">No match</p>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Package -->
        <div class="pkg-block">
          <p class="group-label">Package</p>
          <div class="package-cards">
            <div 
              v-for="pkg in packages" 
              :key="pkg.value"
              class="pkg-card"
              :class="{ active: form.package === pkg.value }"
              @click="form.package = pkg.value; errors.package = ''"
            >
              <div class="pkg-radio">
                <div class="pkg-radio-inner" v-if="form.package === pkg.value"></div>
              </div>
              <div class="pkg-info">
                <span class="pkg-name">{{ pkg.label }}</span>
                <span class="pkg-price">{{ pkg.price }}</span>
              </div>
            </div>
          </div>
          <p class="err-msg">{{ errors.package }}</p>
        </div>

        <!-- Message -->
        <div class="ufield" :class="{ err: errors.message, focused: activeField === 'message' }">
          <label for="inp-msg">Tell me about your project</label>
          <textarea
            id="inp-msg" v-model="form.message"
            @focus="activeField = 'message'"
            @blur="activeField = null; validate('message')"
          />
          <span class="uline"></span>
          <p class="err-msg">{{ errors.message }}</p>
        </div>

        <button class="send" :disabled="status === 'loading'" @click="handleSubmit" type="button">
          <span class="send-text">{{ status === 'loading' ? 'Sending...' : 'Send message' }}</span>
        </button>

        <p v-if="status === 'success'" class="status-ok">Got it — I'll be in touch soon.</p>
        <p v-if="status === 'error'" class="status-fail">Something went wrong. Try again.</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const packages = [
  { value: 'single', label: 'Single Page', price: '€600' },
  { value: 'multi',  label: 'Multi-Page',  price: '€1,200' },
  { value: 'custom', label: 'Custom Build', price: '€2,000' },
]

// ── Country codes ─────────────────────────────────────────────────
const countries = [
  { code: 'CZ', name: 'Czech Republic',         dial: '+420', flag: '🇨🇿' },
  { code: 'SK', name: 'Slovakia',                dial: '+421', flag: '🇸🇰' },
  { code: 'DE', name: 'Germany',                 dial: '+49',  flag: '🇩🇪' },
  { code: 'AT', name: 'Austria',                 dial: '+43',  flag: '🇦🇹' },
  { code: 'PL', name: 'Poland',                  dial: '+48',  flag: '🇵🇱' },
  { code: 'GB', name: 'United Kingdom',          dial: '+44',  flag: '🇬🇧' },
  { code: 'IE', name: 'Ireland',                 dial: '+353', flag: '🇮🇪' },
  { code: 'US', name: 'United States',           dial: '+1',   flag: '🇺🇸' },
  { code: 'CA', name: 'Canada',                  dial: '+1',   flag: '🇨🇦' },
  { code: 'FR', name: 'France',                  dial: '+33',  flag: '🇫🇷' },
  { code: 'ES', name: 'Spain',                   dial: '+34',  flag: '🇪🇸' },
  { code: 'IT', name: 'Italy',                   dial: '+39',  flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal',                dial: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands',             dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium',                 dial: '+32',  flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland',             dial: '+41',  flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden',                  dial: '+46',  flag: '🇸🇪' },
  { code: 'NO', name: 'Norway',                  dial: '+47',  flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark',                 dial: '+45',  flag: '🇩🇰' },
  { code: 'FI', name: 'Finland',                 dial: '+358', flag: '🇫🇮' },
  { code: 'GR', name: 'Greece',                  dial: '+30',  flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary',                 dial: '+36',  flag: '🇭🇺' },
  { code: 'RO', name: 'Romania',                 dial: '+40',  flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria',                dial: '+359', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia',                 dial: '+385', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovenia',                dial: '+386', flag: '🇸🇮' },
  { code: 'UA', name: 'Ukraine',                 dial: '+380', flag: '🇺🇦' },
  { code: 'EE', name: 'Estonia',                 dial: '+372', flag: '🇪🇪' },
  { code: 'LV', name: 'Latvia',                  dial: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania',               dial: '+370', flag: '🇱🇹' },
  { code: 'IS', name: 'Iceland',                 dial: '+354', flag: '🇮🇸' },
  { code: 'TR', name: 'Turkey',                  dial: '+90',  flag: '🇹🇷' },
  { code: 'IL', name: 'Israel',                  dial: '+972', flag: '🇮🇱' },
  { code: 'AE', name: 'United Arab Emirates',    dial: '+971', flag: '🇦🇪' },
  { code: 'IN', name: 'India',                   dial: '+91',  flag: '🇮🇳' },
  { code: 'CN', name: 'China',                   dial: '+86',  flag: '🇨🇳' },
  { code: 'JP', name: 'Japan',                   dial: '+81',  flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea',             dial: '+82',  flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore',               dial: '+65',  flag: '🇸🇬' },
  { code: 'AU', name: 'Australia',               dial: '+61',  flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand',             dial: '+64',  flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil',                  dial: '+55',  flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico',                  dial: '+52',  flag: '🇲🇽' },
  { code: 'ZA', name: 'South Africa',            dial: '+27',  flag: '🇿🇦' },
]

const selectedCountry = ref(countries[0])
const ccMenuOpen      = ref(false)
const ccSearch        = ref('')
const contactFieldRef = ref(null)
const ccSearchRef     = ref(null)
let   countryAutoDetected = false

const filteredCountries = computed(() => {
  const q = ccSearch.value.trim().toLowerCase()
  if (!q) return countries
  return countries.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.dial.replace('+', '').includes(q.replace('+', ''))
  )
})

function toggleCcMenu() {
  ccMenuOpen.value = !ccMenuOpen.value
  if (ccMenuOpen.value) {
    ccSearch.value = ''
    nextTick(() => ccSearchRef.value?.focus())
  }
}

function selectCountry(c) {
  selectedCountry.value = c
  countryAutoDetected   = true
  ccMenuOpen.value = false
}

function onCcDocClick(e) {
  if (ccMenuOpen.value && contactFieldRef.value && !contactFieldRef.value.contains(e.target)) {
    ccMenuOpen.value = false
  }
}
function onCcEsc(e) {
  if (e.key === 'Escape') ccMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onCcDocClick)
  document.addEventListener('keydown', onCcEsc)
})
onUnmounted(() => {
  document.removeEventListener('click', onCcDocClick)
  document.removeEventListener('keydown', onCcEsc)
})

// ── Best-effort country auto-detect ────────────────────────────────
const GEO_PROVIDERS = [
  { name: 'ipwho.is', url: 'https://ipwho.is/',                       getCode: d => (d?.success !== false ? d?.country_code : null) },
  { name: 'geojs.io', url: 'https://get.geojs.io/v1/ip/geo.json',     getCode: d => d?.country_code ?? null },
]

onMounted(async () => {
  for (const provider of GEO_PROVIDERS) {
    if (countryAutoDetected) return
    try {
      const res  = await fetch(provider.url)
      const data = await res.json()
      if (countryAutoDetected) return
      const code  = provider.getCode(data)
      const match = code && countries.find(c => c.code === code)
      if (match) {
        selectedCountry.value = match
        return
      }
      console.warn(`[country-detect] ${provider.name} responded but gave no usable/matching country code:`, data)
    } catch (err) {
      console.warn(`[country-detect] ${provider.name} request failed — likely blocked by an ad-blocker/privacy extension, or offline:`, err)
    }
  }
  console.warn('[country-detect] all providers failed — keeping the default (Czech Republic)')
})

// ── Form state ─────────────────────────────────────────────────────
const form        = reactive({ name: '', contact: '', contactType: 'phone', package: '', message: '' })
const errors      = reactive({ name: '', contact: '', package: '', message: '' })
const status      = ref('idle')
const activeField = ref(null)

function switchContact(type) {
  form.contactType = type
  form.contact = ''
  errors.contact = ''
  ccMenuOpen.value = false
}

function validate(field) {
  switch (field) {
    case 'name':
      errors.name = form.name.trim() ? '' : 'Name is required'; break
    case 'contact':
      if (!form.contact.trim()) errors.contact = (form.contactType === 'phone' ? 'Phone' : 'Email') + ' is required'
      else if (form.contactType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)) errors.contact = 'Enter a valid email'
      else errors.contact = ''
      break
    case 'package':
      errors.package = form.package ? '' : 'Please pick a package'; break
    case 'message':
      errors.message = form.message.trim() ? '' : 'Message is required'; break
  }
}

function validateAll() {
  ;['name', 'contact', 'package', 'message'].forEach(validate)
  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!validateAll()) return
  status.value = 'loading'
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name:         form.name.trim(),
        contact:      form.contactType === 'phone'
                        ? `${selectedCountry.value.dial} ${form.contact.trim()}`
                        : form.contact.trim(),
        contact_type: form.contactType,
        package:      form.package,
        message:      form.message.trim(),
      }),
    })
    if (!res.ok) throw new Error()
    status.value = 'success'
    Object.assign(form, { name: '', contact: '', contactType: 'phone', package: '', message: '' })
  } catch {
    status.value = 'error'
  }
}
</script>

<style scoped>
.contact {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-color);
  background: var(--bg-color);
}

.frame {
  max-width: 520px;
  margin: 0 auto;
  padding: 130px 28px;
}

.form { display: flex; flex-direction: column; gap: 40px; }

/* ── Underline fields ───────────────────────────────────────────── */
.ufield { position: relative; }

.ufield label {
  display: block;
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 14px;
  transition: color 0.25s ease;
}
.ufield.focused label { color: #ffd1dc; }
.ufield.err label { color: rgba(220, 90, 90, 0.75); }

.ufield input,
.ufield textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 300;
  padding: 4px 2px 14px;
  font-family: inherit;
  resize: none;
}
.ufield textarea { min-height: 88px; }

.uline {
  position: relative;
  display: block;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}
.uline::after {
  content: '';
  position: absolute;
  left: 0; top: 0;
  height: 1px;
  width: 0;
  background: #ffd1dc;
  transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ufield.focused .uline::after { width: 100%; }
.ufield.err .uline { background: rgba(220, 90, 90, 0.4); }

.err-msg {
  font-size: 0.68rem;
  color: rgba(220, 90, 90, 0.75);
  margin-top: 8px;
  min-height: 14px;
  letter-spacing: 0.02em;
}

/* ── Contact block ────────────────────────────────────────────── */
.contact-block { display: flex; flex-direction: column; gap: 18px; }

/* Minimal tab toggle */
.contact-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}

.contact-tabs button {
  position: relative;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.contact-tabs button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #ffd1dc;
  transform: scaleX(0);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.contact-tabs button.active {
  color: #ffd1dc;
}

.contact-tabs button.active::after {
  transform: scaleX(1);
}

.tab-divider {
  width: 1px;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 18px;
  align-self: center;
}

.input-group {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
.cc-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.55);
  font-family: inherit;
  font-size: 0.85rem;
  padding: 4px 0 14px;
  cursor: pointer;
  transition: color 0.15s;
  white-space: nowrap;
}
.cc-chip:hover { color: #ffd1dc; }
.cc-chip .chev {
  color: rgba(255, 255, 255, 0.3);
  transition: transform 0.18s ease, color 0.15s;
}
.cc-chip.open .chev { transform: rotate(180deg); color: #ffd1dc; }

.input-group input { flex: 1; min-width: 0; }

.cc-panel {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: min(280px, 100%);
  max-height: 248px;
  background: #141414;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 8px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cc-search {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  outline: none;
  border-radius: 2px;
  padding: 8px 10px;
  font-size: 0.75rem;
  font-family: inherit;
  color: var(--text-color);
  flex-shrink: 0;
}
.cc-search::placeholder { color: rgba(255, 255, 255, 0.3); }
.cc-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
.cc-list::-webkit-scrollbar { width: 5px; }
.cc-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
.cc-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%;
  background: transparent; border: none;
  border-radius: 2px;
  padding: 7px 9px;
  font-family: inherit;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;
}
.cc-item:hover { background: rgba(255, 255, 255, 0.06); color: var(--text-color); }
.cc-item.sel { background: rgba(255, 192, 203, 0.08); color: var(--text-color); }
.cc-item .cc-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cc-item .cc-dial { color: rgba(255, 255, 255, 0.35); font-size: 0.7rem; }
.cc-item.sel .cc-dial { color: #ffd1dc; }
.cc-empty { text-align: center; font-size: 0.72rem; color: rgba(255, 255, 255, 0.3); padding: 14px 0; }

.cc-pop-enter-active, .cc-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.cc-pop-enter-from, .cc-pop-leave-to { opacity: 0; transform: translateY(-4px); }

/* ── Package: card selector ───────────────────────────────────── */
.group-label {
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 14px;
}

.package-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pkg-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: linear-gradient(145deg, #161616, #0d0d0d);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.pkg-card:hover {
  border-color: rgba(255, 192, 203, 0.15);
}

.pkg-card.active {
  border-color: rgba(255, 192, 203, 0.3);
  box-shadow: 0 0 30px rgba(255, 192, 203, 0.06), inset 0 0 0 1px rgba(255, 192, 203, 0.05);
}

.pkg-radio {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

.pkg-card.active .pkg-radio {
  border-color: #ffd1dc;
}

.pkg-radio-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffd1dc;
}

.pkg-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pkg-name {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.3s ease;
}

.pkg-card.active .pkg-name {
  color: #ffd1dc;
}

.pkg-price {
  font-size: 0.85rem;
  font-weight: 100;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.pkg-card.active .pkg-price {
  color: rgba(255, 255, 255, 0.6);
}

/* ── Submit ───────────────────────────────────────────────────── */
.send {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 19px 0;
  background: linear-gradient(135deg, rgba(255, 192, 203, 0.14), rgba(255, 192, 203, 0.04));
  border: 1px solid rgba(255, 192, 203, 0.3);
  border-radius: 3px;
  color: var(--text-color);
  font-family: inherit;
  font-size: 0.72rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease, letter-spacing 0.3s ease;
}
.send::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: linear-gradient(135deg, transparent 45%, rgba(255, 255, 255, 0.22) 50%, transparent 55%);
  transform: translate(-60%, -60%);
  animation: send-shimmer 3.4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes send-shimmer {
  0% { transform: translate(-60%, -60%); }
  25%, 100% { transform: translate(60%, 60%); }
}
.send:hover:not(:disabled) {
  border-color: rgba(255, 192, 203, 0.6);
  background: linear-gradient(135deg, rgba(255, 192, 203, 0.2), rgba(255, 192, 203, 0.06));
  letter-spacing: 0.38em;
}
.send:disabled { opacity: 0.4; cursor: not-allowed; }
.send-text { position: relative; z-index: 1; }

.status-ok   { text-align: center; font-size: 0.75rem; color: #ffd1dc; letter-spacing: 0.02em; }
.status-fail { text-align: center; font-size: 0.75rem; color: rgba(220, 90, 90, 0.8); }

@media (max-width: 480px) {
  .frame { padding: 100px 20px; }
  .pkg-card { padding: 16px 14px; }
}
</style>
