import { addMinutes } from 'date-fns';
import { log } from 'util';

const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  @login
  @addMinutes(['development'])
  @log
  async getMovies(ctx, next) {
    const Movie = mongoose.model('Movie');
    let movieList = await Movie.find({}).sort({
      'meta.createdAt': -1
    })
    ctx.body = {
      movieList
    }
  }
  @get('/:id')
  async getMoviesDatel(ctx, next) {
    const Movie = mongoose.model('Movie');
    let movie = await Movie.findOne({
      doubanId: ctx.params.id
    })
    // 26909790
    ctx.body = {
      movie
    }
  }
}

module.exports = router