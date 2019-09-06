import { del } from '../lib/decorator';

const mongoose = require('mongoose')
const {
  controller,
  get,
  post,
  put,
  auth,
  admin,
  required
} = require('../lib/decorator')
const {
  checkPassword
} = require('../service/admin')
const {
  getAllMovies,
  findAndRemove
} = require('../service/movie')

@controller('/admin')
export class adminController {
  @get('/movie/list')
  @auth
  @admin('admin')
  async getMoviesList(ctx, next) {
    let movies = await getAllMovies()
    ctx.body = {
      data: movies,
      success: true
    }
  }


  @post('/login')
  @required({
    body: ['email', 'password']
  })
  async login(ctx, next) {
    const {
      email,
      password
    } = ctx.request.body
    console.log(email)
    console.log(password)
    let matchData = await checkPassword(email, password)
    console.log(matchData)
    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }
    if (matchData.match) {
      ctx.session.user = {
        _id: matchData.user._id,
        email: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }
      return (ctx.body = {
        success: true
      })
    }
    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })
  }

  @del('/movies')
  @required({
    query: ['id']
  })
  async remove (ctx,next){
    const id = ctx.query.id
    const movie = await findAndRemove(id)
    const movies = await getAllMovies()
    ctx.body ={
      data: movies,
      success: true
    }
  }

}