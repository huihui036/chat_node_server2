const { Sequelize, Model } = require('sequelize')
const { sequelize } = require("../core/db/db")

class Chat extends Model {


  static async Findlistuser(fielsmd5){
    const fiels = await Chat.findAll({
      where: {
        fielsmd5: fielsmd5
      }
    })
    return fiels
  }
}

Chat.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, 
      autoIncrement: true  //自动增长
    },
    
    username:Sequelize.STRING,
    saytext:Sequelize.STRING,
    friend:Sequelize.STRING,
    fielsmd5:Sequelize.STRING,
   
  }, {
    sequelize,
    tableName: 'chat'
  })

  module.exports = {Chat}