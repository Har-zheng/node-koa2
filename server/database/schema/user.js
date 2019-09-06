const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed  = Schema.Types.Mixed
const SALT_WORK_FATOR = 10
const MAX_LOGIN_ATTEMPTS = 5 // 设置最大登录次数
const LOCK_TIME = 2 * 60 * 60 * 1000
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  username: {
    unique: true,
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    unique: true,
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  role: {
    type: String,
    default: 'user'
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
userSchema.pre('save', function (next) {
  // isModified
  if (!this.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FATOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
  // 错误  之在这里直接 next()了
})
userSchema.virtual('isLocked').get(() => { // 虚拟字段  不会存数据库中
  return !(this.lockUntil && this.lockUntil > Date.now()) // 登录时间是否大于 当前时间
}) 
userSchema.methods = {
   // _password为网站提交来的明文password，第二个就是数据库中加盐后的hash密码
  comparePassworld: (_passworld, passworld) => {
    return new Promise((reslove, reject) => {
      bcrypt.compare(_passworld, passworld, (err, isMatch) => {
        if (!err) reslove(isMatch)
        else reject(err)
      })
    })
  },
  incLoginAttepts: (user) => {
    return new Promise((reslove, reject) => {
      // 设置的时间  是否大于当前时间
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: { // 原来mongoose的$set+$unset就是个原子操作
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          },
        }, (err) => {
          if (!err) reslove(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: { // 每次加1
            loginAttempts: 1
          }
        }
        // 登录的次数与 设置登录最大次数做对比 并且 
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && this.isLocked) {
          updates.$set = { // 设置登录时间 
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, (err) => {
          if (!err) reslove(true)
          else reject(err)
        })
      }
    })
  }
}


mongoose.model('User', userSchema)