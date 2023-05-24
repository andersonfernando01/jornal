const Sequelize = require('sequelize');

const connnection = new Sequelize('jornal','root','master27',{

    host:'localhost',
    dialect:'mysql',
    timezone:'+01:00'

})


module.exports =  connnection;