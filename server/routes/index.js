const Router = require('koa-router')
const mongoose = require('mongoose')


const router = new Router()

router.get('/movies/all', async (ctx, next) => {
  const Movie = mongoose.model('Movie');
  let movieList = await Movie.find({}).sort({
    'meta.createdAt': -1
  })
  ctx.body = {
    movieList
  }
  next()
})

router.get('/movies/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie');
  let movie = await Movie.findOne({
    doubanId: ctx.params.id
  })
  // 26909790
  ctx.body = {
    movie
  }
  next()
})

module.exports = router