// client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: { guest: true }
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: () => import('../views/Favorites.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    // Wait for initial auth check if it's in progress
    if (store.state.authChecking) {
        await new Promise(resolve => {
            const unwatch = store.watch(
                state => state.authChecking,
                isChecking => {
                    if (!isChecking) {
                        unwatch()
                        resolve()
                    }
                }
            )
        })
    }

    const isAuthenticated = store.state.isAuthenticated

    // Handle protected routes
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'login' })
        } else {
            next()
        }
    }
    // Handle guest-only routes
    else if (to.matched.some(record => record.meta.guest)) {
        if (isAuthenticated) {
            next({ name: 'home' })
        } else {
            next()
        }
    }
    else {
        next()
    }
})

export default router