//App.vue
<template>
  <div class="app-container">
    <!-- Navbar - only show when authenticated -->
    <nav v-if="isAuthenticated" class="navbar">
      <div class="container">
        <router-link to="/" class="brand">SongBird</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/favorites" class="nav-link">Favorites</router-link>
        </div>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const isAuthenticated = computed(() => store.state.isAuthenticated)

const handleLogout = async () => {
  try {
    await store.dispatch('logout')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(async () => {
  try {
    await store.dispatch('checkAuthStatus')
    if (!isAuthenticated.value && router.currentRoute.value.meta.requiresAuth) {
      router.push('/login')
    }
  } catch (error) {
    console.error('Auth check error:', error)
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push('/login')
    }
  }
})
</script>

<style>
.app-container {
  min-height: 100vh;
  background: #fff;
}

.navbar {
  background: #FFE81A;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  color: #000;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: #000;
}

.logout-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #1557b0;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>