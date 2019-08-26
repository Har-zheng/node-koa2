const Koa = require('koa')
const { resolve } = require('path')
const serve = require('koa-static')
const app = new Koa()

app.use(serve(resolve(__dirname, './')))

const port = process.env.PORT || 8000

app.listen(port, () => {
   console.log(`Server runing on port  ${port}`)
})