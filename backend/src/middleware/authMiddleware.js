import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '访问令牌不存在'
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌格式错误'
      })
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '访问令牌已过期'
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      })
    }

    console.error('认证中间件错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
}

export default authMiddleware