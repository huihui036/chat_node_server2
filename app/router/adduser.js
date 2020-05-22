const Router = require('koa-router')

var request = require("request");

const { AddUser, User } = require('../module/uesr')

var router = new Router({

});


// 添加好友
router.post("/adduser/:name", async (ctx, next) => {

    const path = ctx.params
    const body = ctx.request.body

    if (!body.friendsemali) {
        ctx.body = { "msg": "请输入用户邮箱", "code": "401" }
        return
    }
    const uemali = await User.findOne({
        where: {
            email: body.friendsemali
        }
    })

    if (uemali == null) {
        ctx.body = { "msg": "没有该用户", "code": "403" }
        return
    }
    const adduser = {
        username: path.name,
        uid: uemali.dataValues.id,
        firendsname: uemali.dataValues.username,
        stacode: 0
    }

    const user = await new AddUser().addUsers(adduser.username, adduser.firendsname)

    console.log("user：", user)

    if (user) {
        await AddUser.create(adduser)
        ctx.body = { "msg": "发送成功，等待好友验证", "code": "201" }
    } else {

        ctx.body = { "msg": `${adduser.firendsname},已经是你的好友`, "code": "203" }
    }

})

// 查询好友列表
async function findeuser(username, stacode) {
    console.log(username, stacode)
    const fridendlist = await new AddUser().Findlistuser(username, stacode) // 1表示通过添加请求 0 表示对方没有通过
    if (fridendlist.length <= 0) {
        return {
            "errs": "400",
            "firendsname": "你还还没有好友"
        }
    } else {

        return fridendlist
    }

}

//获取已经通过好友请求的 好友列表
router.get('/fiends/:names', async (ctx, next) => {

    const username = ctx.params.names
    let datase = await findeuser(username, 1)
    ctx.body = datase

})

//获取对方添加您为好友但是还没有通过的
router.get('/passname/:names', async (ctx, next) => {
    const firendsname = ctx.params.names
    //searchadduser
    let datase = await new AddUser().searchadduser(firendsname, 0)
    ctx.body = datase

})


// 通过好友申请添加好友请求
router.post('/passname/:id', async (ctx, next) => {
    // const username =ctx.params.names
    console.log(ctx.params.id)
    let datase = await new AddUser().Passuser(ctx.params.id)
    ctx.body = datase

})


module.exports = { router }