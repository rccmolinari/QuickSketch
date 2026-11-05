<template>
  <div class="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
    <div ref="wrapper" class="h-80 bg-white">
      <canvas ref="canvasEl"></canvas>
    </div>
    <div class="px-3 py-2.5 border-t border-zinc-700 flex items-center gap-2">
      <button
        @click="clearCanvas"
        class="px-2.5 py-1 text-xs border border-zinc-600 rounded text-zinc-400 hover:bg-zinc-700"
      >
        Clear
      </button>
      <input
        type="range"
        min="1"
        max="30"
        v-model="brushSize"
        @input="setBrushSize"
        class="w-30 h-6 border-0 bg-transparent cursor-pointer"
      />
      <div class="flex items-center gap-1.5 ml-auto">
      <input
        type="color"
        v-model="activeColor"
        @input="setColor"
        class="w-6 h-6 border-0 bg-transparent cursor-pointer"
      />
        <div class="w-px h-4 bg-zinc-600 mx-1"></div>
        <button
          @click="setEraser('#ffffff')"
          class="w-5 h-5 rounded-full bg-white border border-zinc-400 ring-zinc-400 ring-offset-zinc-800 ring-offset-1"
          :class="activeColor === '#ffffff' ? 'ring-2' : 'hover:ring-2'"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Canvas, PencilBrush } from 'fabric'

const wrapper = ref(null)
const canvasEl = ref(null)
const brushSize = ref(3)
const activeColor = ref('#18181b')
let canvas = null

function setColor() {
  if (canvas) {
    canvas.freeDrawingBrush.color = activeColor.value
  }
}
function setEraser(color) {
  if (canvas) {
    activeColor.value = color
    setColor()
  }
}
onMounted(() => {
  canvas = new Canvas(canvasEl.value, {
    isDrawingMode: true,
    backgroundColor: '#ffffff',
  })

  canvas.freeDrawingBrush = new PencilBrush(canvas)

  canvas.freeDrawingBrush.color = activeColor.value
  canvas.freeDrawingBrush.width = brushSize.value

  resize()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (canvas) canvas.dispose()
})

function resize() {
  canvas.setDimensions({
    width: wrapper.value.clientWidth,
    height: 320,
  })
}

function setBrushSize() {
  if (canvas) {
    canvas.freeDrawingBrush.width = Number(brushSize.value)
  }
}
function clearCanvas() {
  canvas.clear()
  canvas.backgroundColor = '#ffffff'
  canvas.renderAll()
}

function getImage() {
  return canvas.toDataURL({ format: 'png' })
}

defineExpose({ getImage, clear: clearCanvas })
</script>
