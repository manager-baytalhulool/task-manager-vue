import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/scss/app.scss'
import '@/assets/js/vendor'

import App from './App.vue'
import router from './router'

import './plugins/axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
