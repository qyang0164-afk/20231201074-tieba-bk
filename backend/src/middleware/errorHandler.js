const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', err)

  // Mongoose验证错误
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }))

    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors
    })
  }

  // Mongoose重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field}已存在`
    })
  }

  // Mongoose CastError (无效的ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: '无效的ID格式'
    })
  }

  // 默认服务器错误
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  })
}

export default errorHandler