const axios = require('axios');

class GeniusClient {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseURL = 'https://api.genius.com';
    }

    async makeRequest(endpoint, method = 'GET', params = {}) {
        try {
            const response = await axios({
                method: method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                params: method === 'GET' ? params : undefined,
                data: method !== 'GET' ? params : undefined
            });
            return response.data;
        } catch (error) {
            console.error(`Error making request to ${endpoint}:`, error);
            throw error;
        }
    }

    async search(query) {
        return this.makeRequest('/search', 'GET', { q: query });
    }

    async getSong(id) {
        return this.makeRequest(`/songs/${id}`);
    }
}

module.exports = GeniusClient;