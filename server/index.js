const Koa = require('koa')
const mongoose = require('mongoose')
const router = require('./routes/index')


const views = require('koa-views')
const { resolve } = require('path')
const {connect, initSchemas,initAdmin } = require('./database/init')

;(async ()=> {
  await connect()
  initSchemas()
  await initAdmin()
  // require('./tasks/move')
  // require('./tasks/api')
  // require('./tasks/trailer')
  require('./tasks/qiniu')
})()
const app = new Koa()

app.use(router.routes())
.use(router.allowedMethods())

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