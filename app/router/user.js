
const Router = require('koa-router')
const jwt = require('jsonwebtoken');

const { User } = require('../module/uesr')

const privateKey = require("../../config/config").privateKey
var router = new Router({

});

// 注册路由
router.post('/register', async (ctx, next) => {
  const body = ctx.request.body
  const user = {
    email: body.email,
    username: body.username,
    password: body.password,

  }
  const reemail = await User.findeEmali(user.email)
  console.log(reemail)
  if (reemail) {
  
    ctx.body = { "msg": "邮箱已经被使用", "code": "401" }
  } else {
    await User.create(user)
    ctx.body = { "msg": "注册成功", "code": "201" }
  }

})
// 登入路由
router.post('/login', async (ctx, next) => {
  const body = ctx.request.body
  const user = {
    username: body.username,
    password: body.password,
  }
  console.log(user)
  const users = await User.veriyEmali(user.username, user.password)
  let token = jwt.sign({ username: body.username, password: body.password, }, privateKey, { expiresIn: 60 * 60 });
  // console.log(users);
  if (users.username) {
    let returnuser = {
      uid: users.id,
      user: users.username,
      msg: 'Bearer ' + token
    }
    ctx.body = returnuser
  } else {
    ctx.body = users
  }

})



module.exports = { router }