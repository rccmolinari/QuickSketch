<template>
  <div class="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <h1 class="text-xl font-semibold text-zinc-100 mb-1 text-center">
        Sign up
      </h1>

      <p class="text-sm text-zinc-500 text-center mb-6">
        Create your QuickSketch account.
      </p>

      <form
        @submit.prevent="register"
        class="bg-zinc-800 border border-zinc-700 rounded-lg p-6"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-xs text-zinc-400 mb-1">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              placeholder="your_username"
              class="w-full px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100"
            />
          </div>

          <div>
            <label class="block text-xs text-zinc-400 mb-1">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="name@example.com"
              class="w-full px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100"
            />
          </div>

          <div>
            <label class="block text-xs text-zinc-400 mb-1">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100"
            />
          </div>

          <div>
            <label class="block text-xs text-zinc-400 mb-1">
              Confirm password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 rounded outline-none focus:border-green-500 text-zinc-100"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Create account
          </button>
        </div>

        <p
          v-if="error"
          class="text-red-400 text-sm mt-4 text-center"
        >
          {{ error }}
        </p>

        <p class="text-xs text-zinc-500 text-center mt-4">
          Already have an account?
          <RouterLink
            to="/login"
            class="text-green-400 hover:underline"
          >
            Log in
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const api = inject('api')
const { fetchUtente } = inject('auth')

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const register = async () => {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  const payload = {
    username: username.value,
    email: email.value,
    password: password.value
  }

  try {
    await api.post('/auth/register', payload)
    await fetchUtente()
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Connection error'
  }
}
</script>