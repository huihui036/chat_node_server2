const ws = require("nodejs-websocket");

const Koa = require('koa'); // Koa 为一个class

const app = new Koa();


var cors = require('koa-cors');

let users = [];
let conns = {};
let Mydata
// Judgment--文件类型判断   Setflie--文件上传, ReturnJosn---返回到前端的数据
const { ReturnJosn} = require('./files/Judgment')
const { Mpuploads } = require('./router/mpuploads')
const {router} = require('./index')

// //设置允许跨域访问该服务.
app.use(cors({
    origin:"*"
}));

const { Chat } = require('./module/chat')
const server = ws.createServer(function (conn) {
    console.log("启动服务器连接")
    conn.on("text", async function (str) {
        //  接收前端发送过来的数据--str
        data = JSON.parse(str)  
        conns['' + data.uid + ''] = conn;
        let isuser = users.some(item => {
            return item.uid === data.uid
        })
        if (!isuser) {
            users.push({
                nickname: data.nickname,
                uid: data.uid,
                saytext: data.text
            });
        }

        Mydata = data
        let BoardDate =new ReturnJosn().retunjson(data)
        
        switch (data.type) {
            // 用户名
            case 'setname':   
                conn.nicname = data.nickname
                boardcast(BoardDate)
                break
            // 聊天文字信息
            case 'textsay':
                Chat.create({ username: data.nickname, saytext:data.text, friend:data.fridensname })
                //广播出去
                BoardDate.statacode = data.statacode
                boardcast(BoardDate)
                break
            case 'withdrawtex':
                BoardDate.statacode = data.statacode
                boardcast(BoardDate)
                break
        }
    })

})


app.use(router.routes())

//上传语音
// router.post('/uploads', async (ctx, next)=> {
//        let BoardDate =await new Mpuploads().mp3upada(ctx.req,Mydata) 
//        boardcast(BoardDate)
//        // ctx.body=''  没有多大意义但是不写前端发送请求会报404错误
//        console.log("1233")
//        ctx.body='123'
       
// })
// // 单图/文件上传
// router.post('/upload', async (ctx,next)=> {
//     let BoardDate = await new Mpuploads().filesupload(ctx.req,Mydata)
//     boardcast(BoardDate)
//     ctx.body=''
// });

function boardcast(obj) {
    if (obj.bridge && obj.bridge.length == 2) {
        obj.bridge.forEach(item => {
            try {
                conns[item.toString()].sendText(JSON.stringify(obj));
            } catch (error) {
                console.log("对方不在线")
            }
        })
        return;
    } else {
        server.connections.forEach((conn, index) => {
            conn.sendText(JSON.stringify(obj));
        })
    }
}

//app.use(router.routes());
server.listen(3002)
app.listen(3006); 