const Koa = require('koa')
const app = new Koa()
const { htmlTpl,ejsTpl,pugTpl } = require('./tpl/index')
const ejs = require('ejs')
const pug = require('pug')

app.use(async (ctx, next)=> {
  ctx.type = 'text/html; charset = utf-8'
  ctx.body = pug.render(pugTpl, {
    you: 'lanlan',
    me: 'zhz',
  })
  // ctx.body = htmlTpl
  // await next()
})
const port = process.env.PORT || 8000

app.listen(port, () => {
   console.log(`Server runing on port  ${port}`)
})