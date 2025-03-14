// store/index.js
import { createStore } from 'vuex'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.withCredentials = true

export default createStore({
    state: {
        user: null,
        isAuthenticated: false,
        authChecking: true,
        searchResults: [],
        recentActivity: [],
        favorites: []
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            state.isAuthenticated = !!user
        },
        setAuthChecking(state, value) {
            state.authChecking = value
        },
        setSearchResults(state, results) {
            state.searchResults = results
        },
        setRecentActivity(state, activities) {
            state.recentActivity = activities
        },
        addRecentActivity(state, activity) {
            state.recentActivity.unshift(activity)
            // Keep only the last 10 activities
            state.recentActivity = state.recentActivity.slice(0, 10)
        },
        setFavorites(state, favorites) {
            state.favorites = favorites
        },
        addFavorite(state, song) {
            if (!state.favorites.find(f => f.id === song.id)) {
                state.favorites.push(song)
            }
        },
        removeFavorite(state, songId) {
            state.favorites = state.favorites.filter(song => song.id !== songId)
        }
    },
    actions: {
        async checkAuthStatus({ commit }) {
            try {
                commit('setAuthChecking', true)
                const response = await axios.get('/auth/status')
                commit('setUser', response.data.user)
                return response.data
            } catch (error) {
                commit('setUser', null)
                throw error
            } finally {
                commit('setAuthChecking', false)
            }
        },
        async logout({ commit }) {
            try {
                await axios.post('/auth/logout')
                commit('setUser', null)
                commit('setFavorites', [])
                localStorage.removeItem('favorites')
            } catch (error) {
                console.error('Logout error:', error)
                throw error
            }
        },
        async searchSongs({ commit, dispatch }, { query, remember }) {
            try {
                const response = await axios.get('/search', {
                    params: {
                        q: query,
                        remember: remember
                    }
                })
                commit('setSearchResults', response.data.response.hits)
                // Add to recent activity
                commit('addRecentActivity', {
                    type: 'search',
                    query: query,
                    timestamp: new Date().toISOString()
                })
                return response.data
            } catch (error) {
                console.error('Search error:', error)
                throw error
            }
        },
        async fetchSongDetails({ commit }, songId) {
            try {
                const response = await axios.get(`/song/${songId}`)
                // Add to recent activity
                commit('addRecentActivity', {
                    type: 'view',
                    song: response.data.response.song,
                    timestamp: new Date().toISOString()
                })
                return response.data
            } catch (error) {
                console.error('Error fetching song details:', error)
                throw error
            }
        },
        async loadRecentActivity({ commit }) {
            try {
                const response = await axios.get('/recent-activity')
                commit('setRecentActivity', response.data)
                return response.data
            } catch (error) {
                console.error('Error loading recent activity:', error)
                throw error
            }
        },
        async addToFavorites({ commit, state }, song) {
            try {
                commit('addFavorite', song)
                localStorage.setItem('favorites', JSON.stringify(state.favorites))
                // Add to recent activity
                commit('addRecentActivity', {
                    type: 'favorite',
                    song: song,
                    timestamp: new Date().toISOString()
                })
            } catch (error) {
                console.error('Error adding to favorites:', error)
                throw error
            }
        },
        async removeFromFavorites({ commit, state }, songId) {
            try {
                commit('removeFavorite', songId)
                localStorage.setItem('favorites', JSON.stringify(state.favorites))
            } catch (error) {
                console.error('Error removing from favorites:', error)
                throw error
            }
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        currentUser: state => state.user,
        searchResults: state => state.searchResults,
        recentActivity: state => state.recentActivity,
        favorites: state => state.favorites
    }
})