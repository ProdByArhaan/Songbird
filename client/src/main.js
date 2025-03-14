// client/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(store)
app.use(router)

// Initial auth check
store.dispatch('checkAuthStatus').finally(() => {
    // Mount app after auth check
    app.mount('#app')
})