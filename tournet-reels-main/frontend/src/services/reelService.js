import api from './api';

export const reelService = {
  getFeed: (page = 1, limit = 10) =>
    api.get('/reels', { params: { page, limit } }).then((r) => r.data),

  getReel: (id) => api.get(`/reels/${id}`).then((r) => r.data),

  search: (q) => api.get('/reels/search', { params: { q } }).then((r) => r.data),

  upload: (formData, onProgress) =>
    api
      .post('/reels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      })
      .then((r) => r.data),

  deleteReel: (id) => api.delete(`/reels/${id}`).then((r) => r.data),

  like: (id) => api.post(`/reels/${id}/like`).then((r) => r.data),
  unlike: (id) => api.delete(`/reels/${id}/like`).then((r) => r.data),

  save: (id) => api.post(`/reels/${id}/save`).then((r) => r.data),
  unsave: (id) => api.delete(`/reels/${id}/save`).then((r) => r.data),
  getMySaved: () => api.get('/users/me/saved').then((r) => r.data),

  getComments: (id) => api.get(`/reels/${id}/comments`).then((r) => r.data),
  addComment: (id, text) => api.post(`/reels/${id}/comments`, { text }).then((r) => r.data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`).then((r) => r.data),

  getProfile: (username) => api.get(`/users/${username}`).then((r) => r.data),
  getProfileReels: (username) => api.get(`/users/${username}/reels`).then((r) => r.data),
  follow: (userId) => api.post(`/users/${userId}/follow`).then((r) => r.data),
  unfollow: (userId) => api.delete(`/users/${userId}/follow`).then((r) => r.data)
};
