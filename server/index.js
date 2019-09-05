const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')

const R = require('ramda')
const MIDDLEWARES = ['common','parcel','router']
console.log(MIDDLEWARES)

;(async () => {
    await connect()
    initSchemas()
    await initAdmin()
    // require('./tasks/move')
    // require('./tasks/api')
    // require('./tasks/trailer')
    // require('./tasks/qiniu')
    const app = new Koa()
    await useMiddlewares(app)
    const port = process.env.PORT || 8000
    app.listen(port, () => {
      console.log(`Server runing on port  ${port}`)
    })
  })()


const useMiddlewares = (app) => {
  R.map(R.compose(
    R.forEachObjIndexed(
      initWith => initWith(app)
    ),
    require,
    name => resolve(__dirname, `./middlewares/${name}`)
  )
  )(MIDDLEWARES)
}