const Koa = require('koa')
const app = new Koa()
const { normal } = require('./tpl/normal')

app.use(async (ctx, next)=> {
  ctx.type = 'text/html; charset = utf-8'
  ctx.body = normal
  // await next()
})
// app.use(async (ctx, next)=> {
//   ctx.body = '123'
// })

// const port = process.env.PORT || 8000

app.listen(8000, () => {
  //  console.log(`Server runing on port  ${port}`)
})