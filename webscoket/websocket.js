const ws = require("nodejs-websocket");
let users = [];
let conns = {};
let boardcastDate
// Judgment--文件类型判断   Setflie--文件上传, ReturnJosn---返回到前端的数据
const { ReturnJosn} = require('./files/globalclass')

//const { Chat } = require('./module/chat')
const { Chat } = require('../app/module/chat')
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
      boardcastDate = data
        let BoardDate =new ReturnJosn().retunjson(data)
        switch (data.type) {
            // 用户名  --用户登入进入到聊天页面
            case 'setname':   
                conn.nicname = data.nickname
                boardcast(BoardDate)
                break
            // 用户聊天发送文字/表情信息
            case 'textsay':
                // 聊天信息保存到数据库
                Chat.create({ username: data.nickname, saytext:data.text, friend:data.fridensname })
                //广播出去
                BoardDate.statacode = data.statacode
                boardcast(BoardDate)
                break
            // --用户撤回聊天信息
            case 'withdrawtex':
                BoardDate.statacode = data.statacode
                boardcast(BoardDate)
                break
        }

    })
    conn.on('error',(e)=>{
        console.log('服务出错')
    })
    conn.on('close',()=>{
        console.log('退出')
       
    })

})

// boardcastDate(接收到的前端用户发送过来的信息) 暴露出去
function Retunboardcastdata(){
 return new Promise((resolve,reject)=>{
    resolve(boardcastDate)
 })

}

//消息广播出去方法
async function boardcast(obj) {
    //obj.bridge 前端发送有携带 bridge为私聊--否则进入群聊（发送信息所有在线用户可见）

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

module.exports = {server,Retunboardcastdata,boardcast}

