import api from './api'

export const ratingService = {
  async submitRating(ratingData) {
    const response = await api.post('/ratings/submitRating', ratingData)
    return response.data
  },

  async getUserRatings() {
    const response = await api.get('/ratings/getUserRating');
    console.log("response data: ", response.data);
    return response.data
  },

  async getStoreWithUserRating(storeId) {
    const response = await api.get(`/ratings/store/rating/${storeId}`)
    return response.data
  },

  async updateRating(ratingId, ratingData) {
    const response = await api.put(`/ratings/${ratingId}`, ratingData)
    return response.data
  },

  async deleteRating(ratingId) {
    const response = await api.delete(`/ratings/${ratingId}`)
    return response.data
  },

  async getStoreRatings(storeId, filters = {}) {
    const response = await api.get(`/ratings/store/${storeId}`, {
      params: filters
    })
    return response.data
  },

  async getRatingStats(storeId) {
    const response = await api.get(`/ratings/store/${storeId}/stats`)
    return response.data
  }
}

export default ratingService