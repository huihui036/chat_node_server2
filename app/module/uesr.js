const bcry = require("bcryptjs")
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require("../../core/db/db")

class User extends Model {
  //登入检查
  static async veriyEmali (username, longpassword) {
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
  //注册检查
  static async findeEmali(email){

    const emali = await User.findOne({
      where: {
        email: email
      }
    })
    if(emali){
      return '邮箱已经被使用'
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

class AddUser extends Model {
  static async FindeslUser(username,firendsname){
    const fuser = await AddUser.findAll({
      where: {
        username: username,
        firendsname:firendsname
      }
    })
    console.log(fuser.length)
    if(fuser && fuser.length==0){
      return fuser
    }
  }
  
  static async Findlistuser(username){
    const listuser = await AddUser.findAll({
      where: {
        username: username
      }
    })
    return listuser
  }
  

}
// 用户好友表

AddUser.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键  ==不能重复 不能为空
    autoIncrement: true  //自动增长
  },
  username: Sequelize.STRING,
  firendsname: Sequelize.STRING,
  uid:Sequelize.INTEGER
}, {
  sequelize,
  tableName: 'firend'
})

module.exports = { User,AddUser }