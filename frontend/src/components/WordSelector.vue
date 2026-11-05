<template>
  <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-6 my-8">
    <h2 class="text-base font-medium text-zinc-100 mb-1">Pick a word</h2>
    <p class="text-sm text-zinc-500 mb-5">You'll have 60 seconds to draw it.</p>

    <p v-if="words?.length === 0" class="text-sm text-zinc-500 mb-5">Loading words...</p>

    <div v-else class="grid grid-cols-3 gap-2 sm:grid-cols-3 mb-5">
      <button
        v-for="w in words"
        :key="w"
        @click="selected = w"
        class="px-3 py-2.5 text-sm border rounded capitalize"
        :class="selected === w
          ? 'border-green-600 text-green-400 bg-green-950'
          : 'border-zinc-600 text-zinc-300 hover:border-green-600 hover:bg-green-950'"
      >
        {{ w }}
      </button>
    </div>

    <button
      @click="start"
      :disabled="!selected"
      class="w-full py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Start drawing
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const api = inject('api')
const emit = defineEmits(['start'])

const words = ref([])
const selected = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/words/random')
    words.value = res.data
  } catch (e) {
    console.error('Errore caricamento parole:', e)
  }
})

function start() {
  if (!selected.value) return
  emit('start', selected.value)
}
</script>
