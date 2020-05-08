const { Sequelize, Model } = require('sequelize')
const { sequelize } = require("../../core/db/db")

class Emoji extends Model {}

Emoji.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, 
      autoIncrement: true  //自动增长
    },
    index:Sequelize.INTEGER,
    type:Sequelize.INTEGER,
    title:Sequelize.STRING,
    icon:Sequelize.STRING,
    emoji:Sequelize.STRING,
    unified:Sequelize.STRING
  
  }, {
    sequelize,
    tableName: 'emoji'
  })

  module.exports = {Emoji}