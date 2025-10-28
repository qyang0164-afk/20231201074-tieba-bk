import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Card, Button, Input, Pagination, Spin, Empty } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import { RootState, AppDispatch } from '../store/store'
import { fetchPosts, searchPosts } from '../store/slices/postSlice'
import PostCard from '../components/posts/PostCard'

const { Search } = Input

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { posts, isLoading, total, currentPage } = useSelector((state: RootState) => state.posts)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    // 加载帖子列表
    dispatch(fetchPosts({ page: 1, limit: 10 }))
  }, [dispatch])

  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    if (value.trim()) {
      dispatch(searchPosts({ keyword: value, page: 1, limit: 10 }))
    } else {
      dispatch(fetchPosts({ page: 1, limit: 10 }))
    }
  }

  const handlePageChange = (page: number) => {
    if (searchKeyword) {
      dispatch(searchPosts({ keyword: searchKeyword, page, limit: 10 }))
    } else {
      dispatch(fetchPosts({ page, limit: 10 }))
    }
  }

  return (
    <div className="home-page">
      {/* 页面标题和操作区 */}
      <Row justify="space-between" align="middle" className="mb-16">
        <Col>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
            校园贴吧
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            分享校园生活，交流学习心得
          </p>
        </Col>
        <Col>
          {isAuthenticated && (
            <Link to="/create-post">
              <Button type="primary" icon={<PlusOutlined />} size="large">
                发布帖子
              </Button>
            </Link>
          )}
        </Col>
      </Row>

      {/* 搜索框 */}
      <Card className="mb-16">
        <Search
          placeholder="搜索帖子标题或内容..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: '500px' }}
        />
      </Card>

      {/* 帖子列表 */}
      <div className="posts-section">
        {isLoading ? (
          <div className="loading-spinner">
            <Spin size="large" />
          </div>
        ) : posts.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {posts.map((post) => (
                <Col xs={24} sm={24} md={12} lg={8} key={post.id}>
                  <PostCard post={post} />
                </Col>
              ))}
            </Row>
            
            {/* 分页 */}
            {total > 10 && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={10}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        ) : (
          <Card>
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchKeyword ? '没有找到相关的帖子' : '暂无帖子，快来发布第一个帖子吧！'
              }
            >
              {!searchKeyword && isAuthenticated && (
                <Link to="/create-post">
                  <Button type="primary">发布帖子</Button>
                </Link>
              )}
            </Empty>
          </Card>
        )}
      </div>
    </div>
  )
}

export default HomePage