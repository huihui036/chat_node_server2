const bcry = require("bcryptjs")
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require("../../core/db/db")

class User extends Model {
  //登入检查
   async LoginPost (username, longpassword) {
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    if (!user) {
      return {"err":"用户不存在","ercode":"400"}
    }

    const correct = bcry.compareSync(longpassword, user.password)
    if (!correct) {
      return {"err":"密码错误","ercode":"400"}
    }
    return user

  }
  //注册检查--查找用户是否存在
   async RegisterUser(email){
    const emali = await User.findOne({
      where: {
        email: email
      }
    })
    if(emali){
      return '邮箱已经被使用l'
    }

  }
 
}

//用户表
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键  ==不能重复 不能为空
    autoIncrement: true  //自动增长
  },

  username: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128), 
    unique: true, // 唯一的
  },
  password: {
    type: Sequelize.STRING,
    set (val) {
      const slat = bcry.genSaltSync(10)
      const pws = bcry.hashSync(val, slat)
      this.setDataValue('password', pws)
    }
  },

}, {
  sequelize,
  tableName: 'user'
})
// 添加好友
class AddUser extends Model {
   async addUsers(username,fridensname){
    const fuser = await AddUser.findAll({
      where: {
        username: username,
        fridensname:fridensname
      }
    })
    console.log(fuser.length)
    if(fuser && fuser.length==0){
      return fuser
    }
  }
  //查询好友列表
   async Findlistuser(username,stacode){
    const listuser = await AddUser.findAll({
      where: {
        username,
        stacode:stacode
      }
    })
    return listuser
  }

  //添加您为好友但是还没有通过的列表
   async searchadduser(username,stacode){
    const listuser = await AddUser.findAll({
      where: {
        fridensname: username,
        stacode:stacode
      }
    })
    return listuser
  }

  // 通过好友请求 修改 stacode 0：未通过的
   async Passuser(id){
    const listuser = await AddUser.update({
      stacode: 1
    },{
      
      where: {
       id:id
      }
    })
    return listuser
  }

}

AddUser.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键  
    autoIncrement: true  //自动增长
  },
  username: Sequelize.STRING,
  fridensname: Sequelize.STRING,
  uid:Sequelize.INTEGER,
  stacode:Sequelize.INTEGER,
}, {
  sequelize,
  tableName: 'firend'
})

module.exports = { User,AddUser }