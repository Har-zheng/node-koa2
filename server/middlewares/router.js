import { Route } from "../lib/decorator";
import { resolve } from "path";

export const router = app => {
  const apiPath = resolve(__dirname, '../routers')
  console.log(app)
  const router = new Route(app, apiPath)
  router.init()
}