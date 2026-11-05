import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'
import api from './api.js'
import auth from './auth.js'

const app = createApp(App)

app.use(router)
app.provide('auth', auth)
app.provide('api', api)

app.mount('#app')