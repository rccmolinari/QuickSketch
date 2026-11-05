<template>
  <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
    <div v-if="isAutore">
      <p class="text-sm font-medium text-zinc-200 mb-3">Your sketch</p>
      <div class="px-3 py-3 bg-green-950 border border-green-800 rounded">
        <p class="text-xs text-green-600">
          The word is: <span class="font-semibold text-green-400">{{ sketch.parola }}</span>
        </p>
      </div>
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium text-zinc-200">Guess the word</span>
        <span class="text-xs text-zinc-500">
          <span class="font-medium text-zinc-300">{{ stato.parole.length }}</span> / 10 attempts
        </span>
      </div>

      <div v-if="!stato.finito" class="flex gap-2 mb-4">
        <input
          v-model="parola"
          @keyup.enter="invia"
          type="text"
          placeholder="Your guess..."
          class="flex-1 min-w-0 px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100 placeholder-zinc-500"
        />
        <button
          @click="invia"
          :disabled="inviando"
          class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-40"
        >
          Send
        </button>
      </div>

      <p v-if="errore" class="text-sm text-red-400 mb-3">{{ errore }}</p>

      <div class="space-y-1.5">
        <div
          v-for="(p, i) in tentativiSbagliati"
          :key="i"
          class="flex items-center gap-2 px-2.5 py-1.5 bg-red-950 border border-red-900 rounded text-sm text-rose-400"
        >
          <span class="text-base leading-none">&times;</span>
          <span>{{ p }}</span>
        </div>
      </div>

      <div v-if="stato.indovinato" class="mt-4 px-3 py-3 bg-green-950 border border-green-800 rounded">
        <p class="text-sm font-medium text-green-400">You guessed it!</p>
        <p class="text-xs text-green-600 mt-0.5">The word was: <span class="font-semibold">{{ stato.parola }}</span></p>
      </div>

      <div v-else-if="stato.finito" class="mt-4 px-3 py-3 bg-zinc-700 border border-zinc-600 rounded">
        <p class="text-sm font-medium text-zinc-300">Out of attempts</p>
        <p class="text-xs text-zinc-500 mt-0.5">The word was: <span class="font-semibold text-zinc-300">{{ stato.parola }}</span></p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
const api = inject('api')
const { utente } = inject('auth')
const props = defineProps({
  sketch: { type: Object, required: true },
})

const isAutore = computed(() => utente.value?.username === props.sketch.autore.username)

const stato = ref({ parole: [], indovinato: false, rimasti: 10, finito: false })
const parola = ref('')
const errore = ref('')
const inviando = ref(false)

const tentativiSbagliati = computed(() =>
  stato.value.indovinato ? stato.value.parole.slice(0, -1) : stato.value.parole
)

onMounted(async () => {
  if (isAutore.value) return

  try {
    const res = await api.get(`/sketches/${props.sketch.id}/guesses`)
    stato.value = res.data
  } catch (e) {
    console.error('Errore caricamento stato:', e)
  }
})

async function invia() {
  errore.value = ''

  const guess = parola.value.trim()
  if (!guess) return

  inviando.value = true
  try {
    const res = await api.post(`/sketches/${props.sketch.id}/guesses`, { parola: guess })
    stato.value = res.data
    parola.value = ''
  } catch (e) {
    errore.value = e.response?.data?.message || 'Send error'
  } finally {
    inviando.value = false
  }
}
</script>
