<template>
  <div class="mb-4">
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-xs text-zinc-500">Time left</span>
      <span class="text-xs font-medium text-zinc-300">{{ secondsLeft }}s</span>
    </div>
    <div class="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
      <div class="h-full bg-green-500 rounded-full" :style="{ width: barlenght + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['timeUp'])
const secondsLeft = ref(60);
const barlenght = ref(100);
const timer = setInterval(() => {
  if (secondsLeft.value > 0) {
    secondsLeft.value--;
    barlenght.value = (secondsLeft.value / 60) * 100;
  } else {
    clearInterval(timer);
    emit('timeUp')
  }
}, 1000);

</script>
