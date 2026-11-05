<template>
  <div class="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
    <img
      :src="sketch.disegno"
      alt="sketch"
      class="aspect-square w-full object-cover bg-white border-b border-zinc-700"
    />
    <div class="p-3">
      <div class="flex items-center justify-between mb-2.5">
        <span class="text-xs text-zinc-500">
          by <span class="text-zinc-300 font-medium">{{ sketch.autore.username }}</span>
        </span>
        <span class="text-xs text-zinc-600">{{ dataFormattata }}</span>
      </div>
      <RouterLink
        v-if="sketch.autore.username !== utente?.username"
        :to="`/sketch/${sketch.id}`"
        class="block w-full text-center text-xs py-1.5 bg-green-950 text-green-400 rounded border border-green-800 hover:bg-green-900"
      >
        Guess
      </RouterLink>
            <RouterLink
        v-if="sketch.autore.username === utente?.username"
        :to="`/sketch/${sketch.id}`"
        class="block w-full text-center text-xs py-1.5 bg-green-950 text-green-400 rounded border border-green-800 hover:bg-green-900"
      >
        View
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const { utente } = inject('auth')

const props = defineProps({
  sketch: { type: Object, required: true },
})

const dataFormattata = computed(() =>
  new Date(props.sketch.data).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
)
</script>
