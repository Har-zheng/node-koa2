const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-test'
const { resolve } = require('path')

const glob = require('glob')


mongoose.Promise = global.Promise
exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}
exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) =>{
    if(process.env.NODE_ENV !== 'production'){
      mongoose.set('debug', true)
      mongoose.set('useCreateIndex', true)
    }
    mongoose.connect(db, { useNewUrlParser: true })
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if(maxConnectTimes < 5){
        mongoose.connect(db, { useNewUrlParser: true })
        resolve()
      }else{
        throw new Error('数据库连接失败!!')
      }
    })
    mongoose.connection.on('error',err => {
      maxConnectTimes++
      if(maxConnectTimes < 5){
        mongoose.connect(db, { useNewUrlParser: true })
        resolve()
      }else{
        reject(err)
        throw new Error('数据库连接失败!!')
      }
    })
    mongoose.connection.once('open', () => {
      const Dog = mongoose.model('Dog', {name: String})
      const doga = new Dog({name: '阿尔法'})
      doga.save().then(() => {
        console.log('ok!')
      })
      resolve()
      console.log('MongooDB Connected successfuly!')
    })
  })
}