const koa = require('koa')
const logger =require('koa-logger')
const session = require('koa-session')
const app = new koa()

const mid1 = async (ctx, next) => {
  // koa 把 reuest respones 封装到了  ctx中调用
  ctx.type = 'text/html; charset=utf-8'
  // 异步流执行  最后必须调用next()  如果某个中间件使用中  未调用  next() 那么他将不生效 
  // 1 可以在后面完成后 再回头调用
  await next()
}
const mid2 = async (ctx, next) => {
  ctx.body = 'Hi'
  await next() // ...   控制权 交出  所有执行完  再执行 这个下面的
  ctx.body = ctx.body + 'There'
}
const mid3 = async (ctx, next) => {
  ctx.body = ctx.body + 'zhz'
  await next()
}
app.use(logger())
app.use(mid1)
app.use(mid2)
app.use(mid3)
app.listen(5000)
console.log('localhost:5000')