const Router = require('koa-router')

var router = new Router({});

const { Filesupload } = require('../../webscoket/files/Filesupload')
// Retunboardcastdata：广播的数据  boardcast：广播方法
const { Retunboardcastdata, boardcast } = require('../../webscoket/websocket')


// 上传语音
router.post('/uploads', async (ctx, next) => {
    let boarddate = await Retunboardcastdata()
    let BoardDate = await new Filesupload().mp3upload(ctx.req, boarddate)
    boardcast(BoardDate)
    // ctx.body=''  没有多大意义但是不写前端发送请求会报404错误
    ctx.body = ''

})
// 单图/文件上传
router.post('/upload', async (ctx, next) => {
    let boarddate = await Retunboardcastdata()
    let BoardDate = await new Filesupload().filesupload(ctx.req, boarddate)
    boardcast(BoardDate)
    ctx.body = ''
});

module.exports = { router }