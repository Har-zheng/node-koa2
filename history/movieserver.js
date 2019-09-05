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
  // require('../server/tasks/move') // 电影的列表页
  // require('../server/tasks/api') // 每个电影的详细信息
  // require('../server/tasks/trailer') // 爬取电影的 海报 预告片地址
  require('../server/tasks/qiniu') // 豆瓣信息上传 七牛云
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
const port = process.env.PORT || 6000

app.listen(port, () => {
   console.log(`Server runing on port  ${port}`)
})