<template>
  <header class="bg-zinc-800 border-b border-zinc-700">
    <div class="max-w-6xl mx-auto px-4 py-2.5 sm:py-0 sm:h-14 flex flex-wrap items-center justify-between gap-y-2">
      <RouterLink to="/" class="text-green-400 font-semibold text-lg tracking-tight">
        QuickSketch
      </RouterLink>

      <nav class="order-last w-full sm:order-none sm:w-auto flex items-center gap-5 sm:gap-6">
        <RouterLink to="/" class="text-sm text-zinc-400 hover:text-zinc-100">Gallery</RouterLink>
        <RouterLink to="/leaderboard" class="text-sm text-zinc-400 hover:text-zinc-100">Leaderboard</RouterLink>
        <RouterLink to="/create" class="text-sm text-zinc-400 hover:text-zinc-100">Draw</RouterLink>
      </nav>

      <div v-if="utente" class="flex items-center gap-2">
        <RouterLink to="/profile" class="text-sm text-green-400 hover:text-green-300 font-medium">
          {{ utente.username }}
        </RouterLink>
        <button
          @click="handleLogout"
          class="text-sm px-3 py-1.5 border border-zinc-600 rounded text-zinc-300 hover:bg-zinc-700"
        >
          Logout
        </button>
      </div>

      <div v-else class="flex items-center gap-2">
        <RouterLink to="/login" class="text-sm px-3 py-1.5 border border-zinc-600 rounded text-zinc-300 hover:bg-zinc-700">Log in</RouterLink>
        <RouterLink to="/register" class="text-sm px-3 py-1.5 bg-green-500 rounded text-white hover:bg-green-600">Sign up</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { utente, logout } = inject('auth')

async function handleLogout() {
  await logout()
  router.push('/')
}
</script>
