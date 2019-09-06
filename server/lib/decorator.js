import { request } from 'https';

const Router = require('koa-router')
const SymbolPrefix = Symbol('prefix') // 是函数 符号标识 返回Smble 值  有自己的静态属性和值 唯一的标识 不可修改  
const _ = require('lodash')
const R = require('ramda')
const routerMap = new Map()
const {
  resolve
} = require('path')

const glob = require('glob')
const isArray = c => _.isArray(c)? c: [c]

export class Route {
  //app=>  koa当前的实例 apiPath =>  路由文件的所在目录
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router() // koa 静态实力
  }
  init() {
    // 加载每个路由文件  同时初始化路由控制器 每个控制器都有 controller
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

    for(let [conf, controller] of routerMap){
      const controllers = isArray(controller)
      const prefixPath = conf.target[SymbolPrefix]
      if(prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())

  }
}
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)

  routerMap.set({
    target:target,
    ...conf
  }, target[key])

}

// es7 装饰器类的使用  传入path 参数 > target是类函数  => 利用 箭头函数的特性 返回一个函数内容 
export const controller = path => target => (target.prototype[SymbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'post',
  path: path
})
export const put = path => router({
  method: 'put',
  path: path
})
export const del = path => router({
  method: 'delete',
  path: path
})
export const use = path => router({
  method: 'use',
  path: path
})
export const all = path => router({
  method: 'all',
  path: path
})
const changeToArr = R.unless(
  R.is(isArray),
  R.of()
)
const decorate = (args, middleware) => {
  let [target, key, descriptor] = args
  target[key] = isArray(target[key])
  target[key].unshift(middleware)
  
  return descriptor
}
const convert = middleware => (...args) => decorate(args, middleware)

export const auth = convert(async (ctx, next) => {
  if(!ctx.session.user) {
    return (
      ctx.body ={
        success:false,
        code: 401,
        err: '登录信息失效, 重新登录'
      }
    )
  }
  await next()
})
export const admin = roleExpected => convert(async (ctx, next) => {
  const { role } = ctx.session.user
  // 权限组
  // const rules = {
  //   admin: [1,4,5],
  //   superAdmin: [1,2,3,4]
  // }
  if(!role || role !==roleExpected) {
    return (
      ctx.body ={
        success:false,
        code: 403,
        err: '你没有权限!'
      }
    )
  }
  await next()
})
// 判断权限有没有缺失  
export const required = rules => convert(async (ctx, next) => {
  let  errors = []
  const checkRules = R.forEachObjIndexed(
    (value, key) => {
      errors = R.filter(i => !R.has(i,ctx, ctx.request[key]))(value)
    }
  )
  checkRules(rules)

  if(errors.length){
    ctx.body = {
      success: false,
      code: 412,
      err: `${errors.join(',')} is required`
    }
  } 

  await next()
})