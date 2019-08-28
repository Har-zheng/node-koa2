const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const movieschema = new Schema({
  doubanId: {
    required:true,
    type: String
  },
  rate: Number,
  title: String,
  summary: String,
  video: String,
  cover: String,
  poster: String,

  videokey: String,
  coverkey: String,
  posterkey: String,

  rawTitle: String,
  MovieTypes: [String], //数组类型  里面的每一个值都是字符串类型
  pubdate: Mixed, // 可以是单一的字符串值 也可以是数组
  year: Number,

  tags: [String],

  meta: {
    createdAt: {
      type:Date,
      default:Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
   }
}) 
movieschema.pre('save' ,next => {
  if(this.isNew){
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  }else{
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieschema)