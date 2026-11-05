<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center text-green-400 font-semibold text-lg flex-shrink-0">
        {{ utente?.username[0].toUpperCase() }}
      </div>
      <div>
        <h1 class="text-xl font-semibold text-zinc-100">{{ utente?.username }}</h1>
        <p class="text-sm text-zinc-500">{{ utente?.email }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-semibold text-zinc-100 mb-1">{{ stats?.disegniProdotti ?? '—' }}</div>
        <div class="text-xs text-zinc-500">Sketches created</div>
      </div>
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-semibold text-zinc-100 mb-1">{{ stats?.paroleIndovinate ?? '—' }}</div>
        <div class="text-xs text-zinc-500">Words guessed</div>
      </div>
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-semibold text-zinc-100 mb-1">{{ stats?.tentativiUtilizzati ?? '—' }}</div>
        <div class="text-xs text-zinc-500">Total attempts</div>
      </div>
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
        <div class="text-2xl font-semibold text-zinc-100 mb-1">{{ stats?.paroleNonIndovinate ?? '—' }}</div>
        <div class="text-xs text-zinc-500">Not guessed</div>
      </div>
    </div>

    <h2 class="text-base font-medium text-zinc-300 mb-4">My sketches</h2>
    <p v-if="mySketches.length === 0" class="text-sm text-zinc-500">
      You haven't published any sketches yet.
    </p>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <SketchCard v-for="s in mySketches" :key="s.id" :sketch="s" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import SketchCard from '../components/SketchCard.vue'

const api = inject('api')
const { utente } = inject('auth')
const stats = ref(null)
const mySketches = ref([])

onMounted(async () => {
  try {
    const [s, sk] = await Promise.all([
      api.get('/users/me/stats'),
      api.get('/users/me/sketches'),
    ])
    stats.value = s.data
    mySketches.value = sk.data
  } catch (e) {
    console.error('Errore caricamento profilo:', e)
  }
})
</script>
