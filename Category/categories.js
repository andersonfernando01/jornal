const  Sequelize = require("sequelize");
const connnection = require('../Database/database');

const Category = connnection.define('categorias',{
    title:{
        type: Sequelize.STRING,
        allowNUll:false
    },
    slug:{
        type: Sequelize.STRING,
        allowNUll:false
    }
    
});

Category.sync({force:false});

module.exports = Category;