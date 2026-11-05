<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold text-zinc-100 mb-1">Leaderboard</h1>
    <p class="text-sm text-zinc-500 mb-6">The champions</p>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-zinc-700">
          <h2 class="text-sm font-medium text-zinc-200">Top drawers</h2>
          <p class="text-xs text-zinc-500 mt-0.5">sketches guessed by others</p>
        </div>
        <p v-if="!loading && drawers.length === 0" class="px-4 py-6 text-center text-xs text-zinc-500">
          No games played yet.
        </p>
        <div class="divide-y divide-zinc-700">
          <div v-for="(u, i) in drawers" :key="u.id" class="flex items-center gap-3 px-4 py-3">
            <span class="text-xs w-4 text-zinc-600 font-medium text-right">{{ i + 1 }}</span>
            <div class="w-7 h-7 rounded-full bg-green-900 flex items-center justify-center text-xs text-green-400 font-medium flex-shrink-0">
              {{ u.username[0].toUpperCase() }}
            </div>
            <span class="text-sm text-zinc-300 flex-1">{{ u.username }}</span>
            <span class="text-xs font-medium text-zinc-400">{{ u.indovinati }}</span>
          </div>
        </div>
      </div>

      <div class="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
        <div class="px-4 py-3 border-b border-zinc-700">
          <h2 class="text-sm font-medium text-zinc-200">Top players</h2>
          <p class="text-xs text-zinc-500 mt-0.5">number of words guessed</p>
        </div>
        <p v-if="!loading && players.length === 0" class="px-4 py-6 text-center text-xs text-zinc-500">
          No games played yet.
        </p>
        <div class="divide-y divide-zinc-700">
          <div v-for="(u, i) in players" :key="u.id" class="flex items-center gap-3 px-4 py-3">
            <span class="text-xs w-4 text-zinc-600 font-medium text-right">{{ i + 1 }}</span>
            <div class="w-7 h-7 rounded-full bg-sky-900 flex items-center justify-center text-xs text-sky-400 font-medium flex-shrink-0">
              {{ u.username[0].toUpperCase() }}
            </div>
            <span class="text-sm text-zinc-300 flex-1">{{ u.username }}</span>
            <span class="text-xs font-medium text-zinc-400">{{ u.indovinate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const api = inject('api')
const drawers = ref([])
const players = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [d, p] = await Promise.all([
      api.get('/leaderboard/drawers'),
      api.get('/leaderboard/players'),
    ])
    drawers.value = d.data
    players.value = p.data
  } catch (e) {
    console.error('Errore caricamento classifiche:', e)
  } finally {
    loading.value = false
  }
})
</script>
