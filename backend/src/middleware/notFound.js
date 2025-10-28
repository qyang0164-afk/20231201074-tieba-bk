const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`
  })
}

export default notFound