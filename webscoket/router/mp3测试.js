var express = require('express');
var express = require('express');
var router = express.Router();
var fs = require('fs');
const { Chat } = require('../module/chat')
// Judgment--文件类型判断   Setflie--文件上传, ReturnJosn---返回到前端的数据
const {Setflie, ReturnJosn} = require('../files/Judgment')


router.post('/uploads', async function (req, res, next) {
        // 上传的
    let form =  await Setflie.fliespath('../public/mp3')
   
   // let BoardDate = retunjson(Mydata)
    let BoardDate = ReturnJosn.retunjson(Mydata)
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw err;
        }
        //  console.log(fields, files)
        console.log(files)
        let path = files.file.path.split('public')[1]
        fs.readFile(files.file.path, (err, datas) => {
            console.log(datas.duration)
        })
        let names = path.split('mp3')[1]
        console.log(names)
        console.log("usernamepath", usernamepath)
        Chat.create({ username: usernamepath, saytext: dourls + path, friend: firdensname })
        BoardDate.urls = dourls + path
        BoardDate.type = 'mp3'
     //   boardcast(BoardDate)

    })
})
module.exports =router

