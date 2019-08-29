const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId , Mixed } = Schema.Types

const movieschema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },

  category: [{
    type: ObjectId,
    ref: 'Category'
  }],

  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,
  subtype: String,

  videoKey: String,
  coverKey: String,
  posterKey: String,


  rawTile: String,
  originalTitle: String,
  year: String,
  genres: [String],
  countries: [String],
  movieTypes: [String],
  pubdate: Mixed,  // 值可能是单一值，也有可能是数据
  year: Number,

  tags: [String],

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
movieschema.pre('save',function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieschema)