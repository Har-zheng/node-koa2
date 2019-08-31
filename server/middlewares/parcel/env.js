/**
 * 有必要写个说明
 * 1 这里是配置一个到打包工具
 */
const Bundler = require('parcel-bundler')

const views = require('koa-views')

const serve = require('koa-static')
const { reslove } = require('path')

const r = path => reslove(__dirname, path)

const bundler = new Bundler(r('../../../src/index.html'), {
  publicUrl: '/',
  watch: true
})

export const dev = async app => {
  await bundler.bundle()

  app.use(serve(r('../../../dist')))
  app.use(views(r('../../../dist')),{
    extension: 'html'
  })
  app.use(async (ctx)=> {
    await ctx.render('index.html')
  })
}
