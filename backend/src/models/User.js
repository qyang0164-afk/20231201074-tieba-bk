import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符'],
    match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符']
  },
  nickname: {
    type: String,
    required: [true, '昵称不能为空'],
    trim: true,
    maxlength: [20, '昵称最多20个字符']
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [200, '个人简介最多200个字符'],
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
})

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// 转换为JSON时排除密码
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

// 静态方法：通过用户名查找用户
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: new RegExp('^' + username + '$', 'i') })
}

// 静态方法：通过邮箱查找用户
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: new RegExp('^' + email + '$', 'i') })
}

export default mongoose.model('User', userSchema)