import bodyParser from 'koa-bodyparser'
import logger  from 'koa-logger'

export const addBodyParser = app => {
  console.log('common')
  app.use(bodyParser())
}
export const addLogger = app => {
  app.use(logger())
}