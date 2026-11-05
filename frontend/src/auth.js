import { ref } from 'vue'
import api from './api.js'


export const utente = ref(null)

let pronto = false

export async function initAuth() {
  if (pronto) return
  pronto = true
  await fetchUtente()
}

export async function fetchUtente() {
  try {
    const res = await api.get('/auth/me')
    utente.value = res.data
  } catch {
    utente.value = null
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } finally {
    utente.value = null
  }
}

const auth = { utente, initAuth, fetchUtente, logout }

export default auth
