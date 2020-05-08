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
        ctx.body = { "err": "请输入用户邮箱" }
        return
    }

    const uemali = await User.findOne({
        where: {
            email: body.friendsemali
        }
    })

    if (uemali == null) {
        ctx.body = { "err": "没有该用户" }
        return
    }

    const adduser = {
       // username: path.name,
          username: 'e',
        firendsname: uemali.dataValues.username
    }

    const user = await AddUser.FindeslUser(adduser.username, adduser.firendsname)

    //console.log("user："+user)

    if (user) {
        await AddUser.create(adduser)
        ctx.body = '添加好友成功'
    } else {
        ctx.body = `${adduser.firendsname},已经是你的好友`
    }



    //ctx.body = user
    // await AddUser.create(adduser)



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