const Router = require('koa-router')


var request = require("request");

const { AddUser, User } = require('../module/uesr')

var router = new Router({

});

router.post("/adduser/:name", async (ctx, next) => {

    const path = ctx.params
    //   const query = ctx.request.query
    //   const headers = ctx.request.header
    const body = ctx.request.body
    //  console.log(path, body)
    // 查找用户是否存在

    if (!body.friendsemali) {
        ctx.body = { "msg": "请输入用户邮箱","code":"401"}
        return
    }

    const uemali = await User.findOne({
        where: {
            email: body.friendsemali
        }
    })

    if (uemali == null) {
        ctx.body = { "msg": "没有该用户" ,"code":"403"}
        return
    }

    const adduser = {
        username: path.name,
        uid : uemali.dataValues.id,
        firendsname: uemali.dataValues.username
    }

    const user = await AddUser.FindeslUser(adduser.username, adduser.firendsname)

    console.log("user：",user)

    if (user) {
      
        await AddUser.create(adduser)
        ctx.body = { "msg": "添加成功","code":"201"}
    } else {

        ctx.body ={"msg": `${adduser.firendsname},已经是你的好友`,"code":"203"} 
    }





})


// 查询好友列表

router.get('/fiends/:names',async (ctx,next)=>{

 

    const username =ctx.params.names

    const fridendlist = await AddUser.Findlistuser(username)

    if(fridendlist.length<=0){
        ctx.body={
            "errs":"400",
            "firendsname":"你还还没有好友"
        }
    }else{
        ctx.body=fridendlist
    }

  


})


   



module.exports = { router }