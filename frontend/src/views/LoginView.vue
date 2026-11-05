<template>
  <div class="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <h1 class="text-xl font-semibold text-zinc-100 mb-1 text-center">Log in</h1>
      <p class="text-sm text-zinc-500 text-center mb-6">Welcome back to QuickSketch.</p>

      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs text-zinc-400 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="name@example.com"
              class="w-full px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100 placeholder-zinc-500"
            />
          </div>
          <div>
            <label class="block text-xs text-zinc-400 mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100 placeholder-zinc-500"
            />
          </div>
          
          <button type="submit" class="w-full py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600">
            Log in
          </button>
          <p v-if="error" id="errorMessage" class="text-red-400 text-sm text-center mt-3">
          {{ error }}
        </p>
        </form>

        <p class="text-xs text-zinc-500 text-center mt-4">
          Don't have an account?
          <RouterLink to="/register" class="text-green-400 hover:underline">Sign up</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { fetchUtente } from '../auth.js'

const router = useRouter()
const api = inject('api')
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    await fetchUtente()
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Connection error'
  }
}
</script>