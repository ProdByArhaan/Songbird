// client/src/components/RecentActivityList.vue
<template>
  <div class="recent-activity-list">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="!activities.length" class="text-muted">
      No recent activity
    </div>

    <div v-else>
      <div v-for="activity in activities" :key="activity.timestamp" class="activity-item">
        <small class="text-muted">{{ formatTime(activity.timestamp) }}</small>

        <!-- Search Activity -->
        <template v-if="activity.type === 'search'">
          <div class="mt-1">
            Searched for: "{{ activity.query }}"
          </div>
        </template>

        <!-- View Activity -->
        <template v-if="activity.type === 'view'">
          <div class="d-flex align-items-start mt-1">
            <img
                :src="activity.albumCover"
                :alt="activity.songTitle"
                class="activity-image me-2"
                @error="handleImageError"
            >
            <div>
              <div class="fw-bold">{{ activity.songTitle }}</div>
              <small class="text-muted">by {{ activity.artistName }}</small>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RecentActivityList',
  setup() {
    const store = useStore()
    const loading = ref(true)
    const activities = ref([])

    onMounted(async () => {
      try {
        const data = await store.dispatch('loadRecentActivity')
        activities.value = data
      } catch (error) {
        console.error('Error loading recent activity:', error)
      } finally {
        loading.value = false
      }
    })

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString()
    }

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/40'
    }

    return {
      loading,
      activities,
      formatTime,
      handleImageError
    }
  }
}
</script>

<style scoped>
.activity-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.activity-item small {
  font-size: 0.8rem;
}

.fw-bold {
  font-size: 0.9rem;
}
</style>