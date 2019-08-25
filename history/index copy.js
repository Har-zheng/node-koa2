const koa = require('koa')
const logger =require('koa-logger')
const session = require('koa-session')
const app = new koa()

app.keys = ['Hi ZHZ']
app.use(logger())
app.use(session(app))

app.use(ctx => {
  if(ctx.path === '/'){
    let n = ctx.session.views || 0
    ctx.session.views = ++n;
    ctx.body = n + ' views';
  }else if(ctx.path == '/hi'){
    ctx.body = 'HI ZHZ'
  }else{
     ctx.body = '404'
  }
})
app.listen(5000)
console.log('localhost:5000')