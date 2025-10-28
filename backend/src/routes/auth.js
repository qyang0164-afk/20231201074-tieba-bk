import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// 用户注册
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少需要6个字符'),
  body('nickname')
    .isLength({ min: 1, max: 20 })
    .withMessage('昵称长度必须在1-20个字符之间')
], async (req, res) => {
  try {
    // 检查验证错误
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const { username, email, password, nickname } = req.body

    // 检查用户名是否已存在
    const existingUserByUsername = await User.findByUsername(username)
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      })
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await User.findByEmail(email)
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册'
      })
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      nickname
    })

    await user.save()

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt
        },
        token
      }
    })

  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

// 用户登录
router.post('/login', [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const { username, password } = req.body

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      $or: [
        { username: new RegExp('^' + username + '$', 'i') },
        { email: new RegExp('^' + username + '$', 'i') }
      ]
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt
        },
        token
      }
    })

  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

// 获取当前用户信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

// 更新用户信息
router.put('/profile', authMiddleware, [
  body('nickname')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('昵称长度必须在1-20个字符之间'),
  body('bio')
    .optional()
    .isLength({ max: 200 })
    .withMessage('个人简介最多200个字符')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const { nickname, bio } = req.body
    const updateData = {}

    if (nickname) updateData.nickname = nickname
    if (bio !== undefined) updateData.bio = bio

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: '个人信息更新成功',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('更新用户信息错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

export default router