const Sequelize = require("sequelize");
const connnection = require('../Database/database');
const Category = require('../Category/categories');
const User = require('../Admin/user');


const Articles = connnection.define('Artigos', {
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull:false
    },
    capa:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    body:{
        type:Sequelize.TEXT,
        allowNull:false
    }
    
});
Category.hasMany(Articles);
Articles.belongsTo(Category);
User.hasMany(Articles);
Articles.belongsTo(User);
Articles.sync({force:false});
module.exports =Articles;