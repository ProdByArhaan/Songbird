// Home.vue
<template>
  <div class="container">
    <!-- Fixed Search Section -->
    <div class="top-section">
      <h1 class="welcome">Welcome to SongBird</h1>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-container">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for songs..."
              @keyup.enter="handleSearch"
              class="search-input"
          >
          <button @click="handleSearch" class="search-button">
            Search
          </button>
        </div>
        <div class="remember-section">
          <label class="remember-label">
            <input
                type="checkbox"
                v-model="rememberSearch"
            >
            Remember
          </label>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="main-content">
      <!-- Main Content Area -->
      <div class="results-area">
        <div v-if="isLoading" class="loading-spinner">
          Loading...
        </div>

        <!-- Song Details View -->
        <div v-else-if="currentSong" class="song-details">
          <div class="details-header">
            <button @click="closeDetails" class="back-button">← Back to Results</button>
          </div>

          <div class="details-content">
            <img
                :src="currentSong.song_art_image_url"
                :alt="currentSong.title"
                class="details-image"
                @error="handleImageError"
            >
            <div class="details-info">
              <h2>{{ currentSong.title }}</h2>
              <p><strong>Artist:</strong> {{ currentSong.primary_artist.name }}</p>
              <p><strong>Album:</strong> {{ currentSong.album?.name || 'N/A' }}</p>
              <p><strong>Release Date:</strong> {{ formatDate(currentSong.release_date) }}</p>
              <div class="details-actions">
                <a
                    :href="currentSong.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="action-button"
                >
                  View Lyrics on Genius
                </a>
                <button
                    @click="addToFavorites(currentSong)"
                    class="action-button"
                >
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Results -->
        <div v-else-if="searchResults.length" class="results-grid">
          <div
              v-for="song in searchResults"
              :key="song.result.id"
              class="song-card"
          >
            <img
                :src="song.result.song_art_image_thumbnail_url"
                :alt="song.result.title"
                @error="handleImageError"
                class="song-image"
            >
            <div class="song-info">
              <h3>{{ song.result.title }}</h3>
              <p>by {{ song.result.primary_artist.name }}</p>
              <button
                  @click="viewSongDetails(song.result.id)"
                  class="view-button"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Sidebar -->
      <div class="sidebar">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-if="recentActivity.length">
            <div
                v-for="activity in recentActivity"
                :key="activity.timestamp"
                class="activity-item"
            >
              <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
              <div class="activity-content">
                <template v-if="activity.type === 'search'">
                  Searched for: "{{ activity.query }}"
                </template>
                <template v-else-if="activity.type === 'view'">
                  <img
                      v-if="activity.albumCover"
                      :src="activity.albumCover"
                      :alt="activity.songTitle"
                      class="activity-image"
                      @error="handleImageError"
                  >
                  <div class="activity-text">
                    {{ activity.songTitle }}
                    <div class="activity-subtitle">by {{ activity.artistName }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div v-else class="no-activity">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'

const store = useStore()
const searchQuery = ref('')
const rememberSearch = ref(false)
const currentSong = ref(null)
const isLoading = ref(false)

const searchResults = computed(() => store.state.searchResults)
const recentActivity = computed(() => store.state.recentActivity)

const loadRecentActivity = async () => {
  await store.dispatch('loadRecentActivity')
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  currentSong.value = null

  try {
    await store.dispatch('searchSongs', {
      query: searchQuery.value,
      remember: rememberSearch.value
    })
    await loadRecentActivity()
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
  }
}

const viewSongDetails = async (songId) => {
  isLoading.value = true
  try {
    const response = await store.dispatch('fetchSongDetails', songId)
    currentSong.value = response.response.song
    await loadRecentActivity()
  } catch (error) {
    console.error('Error fetching song details:', error)
  } finally {
    isLoading.value = false
  }
}

const closeDetails = () => {
  currentSong.value = null
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.jpg'
}

const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (timestamp) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const addToFavorites = async (song) => {
  await store.dispatch('addToFavorites', song)
  await loadRecentActivity()
}

onMounted(() => {
  loadRecentActivity()
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-section {
  position: sticky;
  top: 80px;
  background: white;
  padding: 20px 0;
  z-index: 10;
  margin-bottom: 20px;
}

.welcome {
  margin-bottom: 24px;
  color: #333;
}

.search-section {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 15px;
}

.search-container {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
}

.search-button {
  background: #FFE81A;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  color: #000;
  transition: background-color 0.2s;
}

.search-button:hover {
  background: #FFD700;
}

.remember-section {
  margin-top: 12px;
  margin-left: 12px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  margin-top: 24px;
}

.loading-spinner {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.song-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.song-card:hover {
  transform: translateY(-2px);
}

.song-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.song-info {
  padding: 16px;
}

.song-info h3 {
  margin: 0 0 8px;
  color: #333;
}

.song-info p {
  color: #666;
  margin: 0 0 12px;
}

.view-button {
  background: #FFE81A;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  color: #000;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.view-button:hover {
  background: #FFD700;
}

.sidebar {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: fit-content;
}

.song-details {
  background: white;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.details-header {
  margin-bottom: 20px;
}

.back-button {
  background: #FFE81A;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #FFD700;
}

.details-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.details-image {
  width: 100%;
  border-radius: 10px;
}

.details-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-button {
  background: #FFE81A;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  color: #000;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background: #FFD700;
}

.activity-list {
  margin-top: 12px;
}

.activity-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.activity-time {
  font-size: 0.9em;
  color: #666;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.activity-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.activity-text {
  flex: 1;
}

.activity-subtitle {
  font-size: 0.9em;
  color: #666;
  margin-top: 4px;
}

.no-activity {
  color: #666;
  text-align: center;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .details-content {
    grid-template-columns: 1fr;
  }

  .details-image {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>