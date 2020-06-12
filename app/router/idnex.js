
const Router = require('koa-router')
const fs = require('fs')
var formidable = require('formidable');

const {Emoji} = require('../module/emoji')
const {UserController, AdduserFriend} = require('../controller/Usercontroller')

const { Qrimage } = require('../controller/QrimageControl')
const { Websockfiles } = require('../controller/Webscoketcontrol')

var router = new Router({});

// 注册路由
router.post('/register', async (ctx) => await new UserController().register(ctx))

// 登入路由
router.post('/login', async (ctx, next) => await new UserController().login(ctx))



//添加好友
router.post("/adduser/:name", async (ctx, next) => await new AdduserFriend().Addusers(ctx))


 //获取已经通过好友请求的 好友列表
router.get('/fiends/:names', async (ctx, next) => await new AdduserFriend().goodfiends(ctx))


 //获取已经通过好友请求的但未通过的好友列表
 router.get('/passname/:names', async (ctx, next) =>await new AdduserFriend().userfiend(ctx))

 //通过好友请求
 router.post('/passname/:id', async (ctx, next) => await new AdduserFriend().passusername(ctx))

 
 //二维码生成
 router.get('/getqr/:username/:email', async (ctx,next) => await new Qrimage().getqrimage(ctx))

 // 聊天语音上传
 router.post('/uploads', async (ctx, next) => await new Websockfiles().voiceupload(ctx))


 // 聊天图片，文件上传
 router.post('/upload', async (ctx, next) => await new Websockfiles().filesupload(ctx))

 //临时测试


 //router.post('/viode', async (ctx, next) =>await new Websockfiles().viodece(ctx))




//表情包
router.get("/emoji", async(ctx,next)=>{
  const Emojidata =  await Emoji.findAll()
  ctx.body = Emojidata
})

module.exports = { router }