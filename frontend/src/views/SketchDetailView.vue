<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <p v-if="!sketch" class="text-sm text-zinc-500 text-center">Loading...</p>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
      <div>
        <div class="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden mb-3">
          <img :src="sketch.disegno" alt="sketch" class="w-full bg-white" />
        </div>
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>by <span class="text-zinc-300 font-medium">{{ sketch.autore.username }}</span></span>
          <span>{{ dataFormattata }}</span>
        </div>
      </div>

      <div class="space-y-4">
        <GuessForm :sketch="sketch" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
import GuessForm from '../components/GuessForm.vue'

const route = useRoute()
const sketch = ref(null)
const api = inject('api')

const dataFormattata = computed(() =>
  sketch.value
    ? new Date(sketch.value.data).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
)

onMounted(async () => {
  try {
    const res = await api.get(`/sketches/${route.params.id}`)
    sketch.value = res.data
  } catch (e) {
    console.error('Errore caricamento sketch:', e)
  }
})
</script>
