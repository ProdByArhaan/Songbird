// views/Login.vue
<template>
  <div class="login-container">
    <div class="card">
      <div class="card-header">
        <div class="title">SongBird</div>
        <div class="subtitle">Your Music Companion</div>
      </div>

      <div class="card-body">
        <h2>Welcome Back!</h2>
        <p>Please sign in to continue</p>

        <a href="/api/auth/google" class="google-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 488 512">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>
          Sign in with Google
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

onMounted(async () => {
  if (store.state.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.login-container {
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

.card-header {
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
}

.card-body {
  padding: 24px;
  text-align: center;
}

.card-body h2 {
  font-size: 20px;
  margin: 0 0 8px;
  color: #333;
}

.card-body p {
  color: #666;
  margin: 0 0 24px;
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
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.google-btn:hover {
  background: #FFD700;
}

.google-btn svg {
  fill: currentColor;
}
</style>