import { createRouter, createWebHistory } from 'vue-router'
import { initAuth, utente } from '../auth.js'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreateSketchView from '../views/CreateSketchView.vue'
import SketchDetailView from '../views/SketchDetailView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/create', component: CreateSketchView, meta: { requiresAuth: true } },
  { path: '/sketch/:id', component: SketchDetailView, meta: { requiresAuth: true } },
  { path: '/leaderboard', component: LeaderboardView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  await initAuth()

  if (to.meta.requiresAuth && !utente.value) {
    next('/login')
  } else {
    next()
  }
})

export default router