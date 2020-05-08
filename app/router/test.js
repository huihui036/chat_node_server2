
const Router = require('koa-router')
var router = new Router();


router.post('/test', async ctx => {
   const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body
console.log(path, query, headers, body)


})

module.exports = { router }