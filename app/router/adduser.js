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
        firendsname: uemali.dataValues.username,
        stacode:0
    }

    const user = await AddUser.FindeslUser(adduser.username, adduser.firendsname)

    console.log("user：",user)

    if (user) {
        await AddUser.create(adduser)
        ctx.body = { "msg": "发送成功，等待好友验证","code":"201"}
    } else {

        ctx.body ={"msg": `${adduser.firendsname},已经是你的好友`,"code":"203"} 
    }


})


// 查询好友列表
 
 async function getriends(username,stacode){
 console.log(username,stacode)
 const fridendlist = await AddUser.Findlistuser(username,stacode) // 1表示通过添加请求 0 表示对方没有通过
 if(fridendlist.length<=0){
     return {
         "errs":"400",
         "firendsname":"你还还没有好友"
     }
 }else{
    
     return fridendlist
 }

}


router.get('/fiends/:names',async (ctx,next)=>{
   
    const username =ctx.params.names
   let datase = await getriends(username,1)
   ctx.body = datase
  
})

router.get('/passname/:names',async (ctx,next)=>{
   
    const username =ctx.params.names
   let datase = await getriends(username,0)
   ctx.body = datase
  
})

router.post('/passname/:id',async (ctx,next)=>{
   
    // const username =ctx.params.names
    console.log(ctx.params.id)
   let datase = await AddUser.Passuser(ctx.params.id)
  ctx.body = datase
  
})



   


module.exports = { router }