const mongoose = require('mongooes')
const db = 'mongodb://localhost/douban-trailer'

mongoose.Promise = global.Promise

exports.connect = () => {
  if(process.env.NODE_ENV !== 'production'){
    mongoose.set('debug', true)
  }

  mongoose.connect(db)
}