<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold text-zinc-100 mb-2">Draw a new sketch</h1>

    <WordSelector v-if="step === 'select'" @start="startDrawing" />

    <div v-else>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-zinc-400">
          You are drawing: <span class="font-medium text-green-400">{{ word }}</span>
        </span>
      </div>
      <TimerBar @timeUp="publishSketch" />
      <SketchCanvas ref="sketchCanvas" />
      <div class="mt-4 flex items-center justify-between">
        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
                <button 
        @click="cancelSketch"
        :disabled="publishing"
        class="px-5 py-2 bg-red-700 text-white text-sm rounded hover:bg-red-600 disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          @click="publishSketch"
          :disabled="publishing"
          class="px-5 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-40"
        >
          Publish sketch
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter, onBeforeRouteLeave} from 'vue-router'
import WordSelector from '../components/WordSelector.vue'
import TimerBar from '../components/TimerBar.vue'
import SketchCanvas from '../components/SketchCanvas.vue'

const router = useRouter()
const api = inject('api')

const step = ref('select')
const word = ref('')
const sketchCanvas = ref(null)
const publishing = ref(false)
const error = ref('')

function startDrawing(w) {
  word.value = w
  step.value = 'draw'
}

onBeforeRouteLeave(() => {
  if (step.value === 'draw') {
    return window.confirm('You are still drawing: if you leave, you will lose your sketch. Leave anyway?')
  }
})
async function publishSketch() {
  error.value = ''

  const disegno = sketchCanvas.value?.getImage()
  if (!disegno) return

  publishing.value = true
  try {
    await api.post('/sketches', { parola: word.value, disegno })
    step.value = 'select'
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Publishing error'
  } finally {
    publishing.value = false
  }
}

async function cancelSketch() {
  if (!window.confirm('You are still drawing: if you leave, you will lose your sketch. Leave anyway?')) return
  step.value = 'select'
  sketchCanvas.value?.clear()
  router.push('/')
}

</script>
