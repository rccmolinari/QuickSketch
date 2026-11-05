<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-zinc-100 mb-1">Gallery</h1>
      <p class="text-sm text-zinc-500">Sketches created by the users</p>
    </div>

    <div class="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <SketchCard v-for="sketch in sketches" :key="sketch.id" :sketch="sketch" />
    </div>
  </div>
</template>

<script setup>
import SketchCard from '../components/SketchCard.vue'
import { ref, onMounted, inject } from 'vue'
const api = inject('api')
const sketches = ref([])
onMounted(async () => {
  try {
    const res = await api.get('/sketches/')
    sketches.value = res.data
  } catch (e) {
    console.error('Errore caricamento sketch:', e)
  }
})
</script>
