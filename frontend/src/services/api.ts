import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { username: string; email: string; password: string; nickname: string }) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  updateProfile: (profileData: any) => api.put('/auth/profile', profileData),
}

// 帖子相关API
export const postAPI = {
  getPosts: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/posts', { params }),
  
  getPost: (id: string) => api.get(`/posts/${id}`),
  
  createPost: (postData: { title: string; content: string; images?: File[] }) => {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('content', postData.content)
    
    if (postData.images) {
      postData.images.forEach((image) => {
        formData.append('images', image)
      })
    }
    
    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  updatePost: (id: string, postData: { title?: string; content?: string }) =>
    api.put(`/posts/${id}`, postData),
  
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  
  likePost: (id: string) => api.post(`/posts/${id}/like`),
}

// 评论相关API
export const commentAPI = {
  getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
  
  createComment: (postId: string, content: string) =>
    api.post(`/posts/${postId}/comments`, { content }),
  
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
  
  likeComment: (id: string) => api.post(`/comments/${id}/like`),
}

// 用户相关API
export const userAPI = {
  getUser: (id: string) => api.get(`/users/${id}`),
  
  getUserPosts: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/users/${id}/posts`, { params }),
}

export default api