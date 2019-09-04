import { ok } from 'assert';

const mongoose = require('mongoose')
const {
  controller,
  get,
  post,
  put
} = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelatvieMovies
} = require('../service/movie')

@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovies(ctx, next) {
    const {
      type,
      year
    } = ctx.query
    let movieList = await getAllMovies(type, year)
    ctx.body = {
      movieList,
      success: 'ok'
    }
  }
  @get('/:id')
  async getMoviesDatel(ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelatvieMovies(movie)
    // 26909790
    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}