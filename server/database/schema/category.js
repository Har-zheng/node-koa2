const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const categoryschema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: Object,
    ref: 'Movie'
  }],
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
categoryschema.pre('save' ,function (next) {
  if(this.isNew){
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  }else{
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Category', categoryschema)