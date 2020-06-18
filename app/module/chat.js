const { Sequelize, Model } = require('sequelize')
const { sequelize } = require("../../core/db/db")

class Chat extends Model {

  static async Findlistfiles(fielsmd5) {
    const fiels = await Chat.findAll({
      where: {
        fielsmd5: fielsmd5
      }
    })
    return fiels
  }
  // 未读的消息
  static async unreaddata(userdata) {
    const unread = await Chat.findAll({
      where: {
        friend: userdata.friend,
        username: userdata.user,
        chatnumber: 0,
      },
  //    attributes: ['fusername', 'saytext','friend','chatnumber','fielsmd5']
    })
    return unread
  }

   // 删除  未读 ===》已读 
   static async deletemassage(userdata) {
    const unread = await Chat.destroy({
      where: {
        friend: userdata.friend,
        username: userdata.user,
        chatnumber: 0,
      },

    })
    return unread
  }

}

Chat.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true  //自动增长
  },
  username: Sequelize.STRING,
  saytext: Sequelize.STRING,
  friend: Sequelize.STRING,
  chatnumber: Sequelize.INTEGER,
  fielsmd5: Sequelize.STRING,

}, {
  sequelize,
  tableName: 'chat'
})

module.exports = { Chat }