const jwt = require('jsonwebtoken');

//const { User } = require('../module/uesr')
const { HttpException } = require('../../core/http-exception')
const privateKey = require("../../config/config").privateKey

const { AddUserError } = require('../../core/http-exception')

const { User, AddUser } = require('../module/uesr')

class UserController {
    // 注册
    async register(ctx) {
        console.log("2113")
        const body = ctx.request.body
        const user = {
            email: body.email,
            username: body.username,
            password: body.password,

        }
        const Register = await new User().RegisterUser(user.email)
        console.log(Register)
        if (Register) {
            const error = new HttpException('邮箱已经被使用', 101, 401)
            throw error
            //ctx.body = { "msg": "邮箱已经被使用", "code": "401" }
        } else {
            await User.create(user)
            const error = new HttpException('注册成功', 101, 201)
            throw error
            //ctx.body = { "msg": "注册成功", "code": "201" }
        }
    }
    // 登入
    async login(ctx) {
        const body = ctx.request.body
        const user = {
            username: body.username,
            password: body.password,
        }
        console.log(user)

        const users = await new User().LoginPost(user.username, user.password)
        // 生成tolen
        let token = jwt.sign({ username: body.username, password: body.password, }, privateKey, { expiresIn: 60 * 60 });
        // console.log(users);
        if (users.username) {
            let returnuser = {
                uid: users.id,
                user: users.username,
                msg: 'Bearer ' + token
            }
            ctx.body = returnuser
        } else {
            const error = new HttpException('用户名或密码错误', 101, 400)
            throw error
            //  ctx.body = users
        }
    }

}

class AdduserFriend {
    // 添加好友
    async Addusers(ctx) {
        const path = ctx.params
        const body = ctx.request.body

        if (!body.friendsemali) {
            const error = new AddUserError('参数错误', 102, 401)
            throw error

        }
        const uemali = await User.findOne({
            where: {
                email: body.friendsemali
            }
        })

        if (uemali == null) {
            const error = new AddUserError('没有该用户', 102, 403)
            throw error

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
            const error = new AddUserError('发送成功，等待好友验证', 102, 201)
            throw error
            //  ctx.body = { "msg": "发送成功，等待好友验证", "code": "201" }
        } else {
            const error = new AddUserError(`${adduser.firendsname},已经是你的好友`, 102, 203)
            throw error

        }
    }

    async findeuser(username, stacode) {
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
    async goodfiends(ctx) {
        const username = ctx.params.names
        let datase = await this.findeuser(username, 1)
        ctx.body = datase
    }
    // 未通过好友列表
    async userfiend(ctx) {
        const firendsname = ctx.params.names
        //searchadduser
        let datase = await new AddUser().searchadduser(firendsname, 0)
        ctx.body = datase
    }
    // 执行通过好友申请添加请求
    async passusername(ctx){
        let datase = await new AddUser().Passuser(ctx.params.id)
        ctx.body = datase
    }

}




module.exports = { UserController, AdduserFriend }