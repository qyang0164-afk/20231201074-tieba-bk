import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Layout } from 'antd'

import { getCurrentUser } from './store/slices/authSlice'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PostDetailPage from './pages/PostDetailPage'
import CreatePostPage from './pages/CreatePostPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/auth/ProtectedRoute'

const { Content, Footer } = Layout

const App: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // 应用启动时检查用户登录状态
    dispatch(getCurrentUser() as any)
  }, [dispatch])

  return (
    <Layout className="app-layout">
      <Header />
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Content>
      <Footer className="app-footer">
        校园贴吧系统 ©2024 版权所有
      </Footer>
    </Layout>
  )
}

export default App