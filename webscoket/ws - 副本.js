const ws = require("nodejs-websocket");
var fs = require('fs');
let users = [];
let conns = {};
var express = require('express');
var app = express();
// Judgment--文件类型判断   Setflie--文件上传, ReturnJosn---返回到前端的数据
const { ReturnJosn} = require('./files/Judgment')
const { Mpuploads } = require('./router/mpuploads')

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
const path = require('path')
const { Chat } = require('./module/chat')
let Mydata
const server = ws.createServer(function (conn) {
    console.log("启动服务器连接")
    //Judgment.Judgment()
    conn.on("text", async function (str) {
        //  console.log("接收前端发送过来的数据：" + str)
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
    // let BoardDate = retunjson(data)
        let BoardDate = ReturnJosn.retunjson(data)
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

    // conn.on("close", function () {
    //     boardcast({
    //         'nickname': data.nickname,
    //         'msg': '退出了聊天'
    //     })
    // })
    conn.on("error", function (err) {
        console.log(err)
    })

})

  // 上传语音
app.post('/uploads', async function (req, res, next) {
       let BoardDate = await Mpuploads.mp3upada(req,Mydata)
       boardcast(BoardDate)
})

// 单图/文件上传
app.post('/upload', async function (req, res, next) {
    let BoardDate = await Mpuploads.filesupload(req,Mydata)
    boardcast(BoardDate)
});
// console.log(fies)
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

//require("./module/chat")
server.listen(3002)
app.listen(3006); 