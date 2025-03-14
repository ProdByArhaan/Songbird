//client/src/components/SongDetail.vue
<template>
  <div class="song-detail">
    <div class="card">
      <div class="row g-0">
        <div class="col-md-4">
          <img
              :src="song.song_art_image_url"
              class="img-fluid rounded-start"
              :alt="song.title"
              @error="handleImageError"
          >
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ song.title }}</h5>
            <p class="card-text">
              <strong>Artist:</strong> {{ song.primary_artist.name }}
            </p>
            <p class="card-text" v-if="song.album">
              <strong>Album:</strong> {{ song.album.name }}
            </p>
            <p class="card-text" v-if="song.release_date">
              <strong>Release Date:</strong> {{ formatDate(song.release_date) }}
            </p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
              <a
                  :href="song.url"
                  target="_blank"
                  class="btn btn-primary"
              >
                View Lyrics on Genius
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongDetail',
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300';
    }
  }
}
</script>

<style scoped>
.song-detail {
  margin-top: 2rem;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.5rem;
}

img {
  object-fit: cover;
  height: 100%;
  min-height: 300px;
}
</style>