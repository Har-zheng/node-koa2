import {
  Symbol
} from 'core-js';
import {
  normalize
} from 'upath';
import { isArray } from 'util';

const Router = require('koa-router')
const SymbolPrefix = Symbol('prefix')
const _ = require('lodash')
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
    this.router = new Router()
  }
  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

    for(let [conf, controller] of routerMap){
      const controllers = isArray(controller)
      const prefixPath = conf.target[SymbolPrefix]
      if(prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.all())

  }
}
const normalizePath = path => path.startWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)

  routerMap.set({
    target:target,
    ...conf
  }, target[key])

}

// es7 装饰器类的使用  传入path 参数 > target是类函数  => 利用 箭头函数的特性 返回一个函数内容
const controller = path => target => (target.prototype[SymbolPrefix] = path)

export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'get',
  path: path
})
export const put = path => router({
  method: 'get',
  path: path
})
export const del = path => router({
  method: 'get',
  path: path
})
export const use = path => router({
  method: 'get',
  path: path
})
export const all = path => router({
  method: 'get',
  path: path
})