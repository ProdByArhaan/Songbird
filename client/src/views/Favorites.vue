//client/src/App.vue
<template>
  <div class="app-container">
    <!-- Authentication page -->
    <template v-if="!isAuthenticated">
      <div class="login-card">
        <div class="card">
          <div class="header">
            <div class="title">SongBird</div>
            <div class="subtitle">Your Music Companion</div>
          </div>

          <div class="content">
            <h1>Welcome Back!</h1>
            <p>Please sign in to continue</p>

            <a href="/api/auth/google" class="google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Sign in with Google
            </a>
          </div>
        </div>
      </div>
    </template>

    <!-- Main application -->
    <template v-else>
      <nav class="nav-bar">
        <div class="container">
          <div class="left">
            <router-link to="/" class="brand">SongBird</router-link>
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/favorites" class="nav-link">Favorites</router-link>
          </div>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </nav>

      <main class="container">
        <router-view></router-view>
      </main>
    </template>
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
  } catch (error) {
    console.error('Auth check error:', error)
  }
})
</script>

<style scoped>
.login-card {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.header {
  background: #FFE81A;
  padding: 24px;
  text-align: center;
}

.title {
  color: #000;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.subtitle {
  color: #333;
  font-size: 16px;
}

.content {
  padding: 24px;
  text-align: center;
}

.content h1 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}

.content p {
  color: #666;
  margin-bottom: 24px;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #FFE81A;
  color: #000;
  padding: 12px 24px;
  border-radius: 25px;
  width: 100%;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.google-btn:hover {
  background: #FFD700;
}

.google-btn img {
  width: 20px;
  height: 20px;
}

.nav-bar {
  background: #FFE81A;
  padding: 16px 0;
}

.nav-bar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  color: #000;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
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
</style>