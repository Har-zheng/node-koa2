const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const {connect, initSchemas,initAdmin } = require('../server/database/init')

const R = require('ramda')
const MIDDLEWARES = ['router']

;(async ()=> {
  await connect()
  initSchemas()
  await initAdmin()
  // require('../server/tasks/move')
  // require('../server/tasks/api')
  // require('../server/tasks/trailer')
  require('../server/tasks/qiniu')
})()
const app = new Koa()

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next)=> {
  await ctx.render('index', {
    you: 'ZHZ',
    me: 'HongZhen'
  })
})
const port = process.env.PORT || 8000

app.listen(port, () => {
   console.log(`Server runing on port  ${port}`)
})