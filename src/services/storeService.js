import api from './api'

export const storeService = {
  async getAllStores(filters = {}) {
    const response = await api.get('/stores/getAllStores', { params: filters })
    return response.data
  },

  async getStoreById(id) {
    const response = await api.get(`/stores/getStoreByid/${id}`)
    return response.data
  },

  async createStore(storeData) {
    const response = await api.post('/stores/create-store', storeData)
    return response.data
  },

  async getStoreOwnerDashboard() {
    const response = await api.get('/stores/owner/dashboard')
    return response.data
  },

  async updateStore(id, storeData) {
    const response = await api.put(`/stores/${id}`, storeData)
    return response.data
  },

  async deleteStore(id) {
    const response = await api.delete(`/stores/${id}`)
    return response.data
  },

  async searchStores(query, filters = {}) {
    const response = await api.get('/stores/search', {
      params: { query, ...filters }
    })
    return response.data
  },

  async getStoreStats(storeId) {
    const response = await api.get(`/stores/${storeId}/stats`)
    return response.data
  },

  async getStoreRatings(storeId, filters = {}) {
    const response = await api.get(`/stores/${storeId}/ratings`, {
      params: filters
    })
    return response.data
  }
}

export default storeService