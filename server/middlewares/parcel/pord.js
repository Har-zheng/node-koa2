// 生产环境
/**
 * 有必要写个说明
 * 1 这里是配置一个到打包工具
 */
const views = require('koa-views')

const serve = require('koa-static')
const { reslove } = require('path')

const r = path => reslove(__dirname, path)

export const dev = async app => {
  app.use(serve(r('../../../dist')))
  app.use(views(r('../../../dist')),{
    extension: 'html'
  })
  app.use(async (ctx)=> {
    await ctx.render('index.html')
  })
}
