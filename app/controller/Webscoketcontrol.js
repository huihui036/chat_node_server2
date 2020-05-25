const { Filesupload } = require('../../webscoket/files/Filesupload')
// Retunboardcastdata：广播的数据  boardcast：广播方法
const { Retunboardcastdata, boardcast } = require('../../webscoket/websocket')
class Websockfiles {
    //语音上传
  async  voiceupload(ctx) {
    let boarddate = await Retunboardcastdata()
    let BoardDate = await new Filesupload().mp3upload(ctx.req, boarddate)
    boardcast(BoardDate)
    // ctx.body=''  没有多大意义但是不写前端发送请求会报404错误
    ctx.body = ''
    }
     //图片文件上传
    async filesupload(ctx){
        let boarddate = await Retunboardcastdata()
        let BoardDate = await new Filesupload().filesupload(ctx.req, boarddate)
        boardcast(BoardDate)
        ctx.body = ''
    }
}
module.exports = { Websockfiles }