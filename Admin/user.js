const  Sequelize = require("sequelize");
const connnection = require('../Database/database');

const Admin = connnection.define('usuario',{
    name:{
        type:Sequelize.STRING,
        allowNUll:false
    },
    email:{
       type: Sequelize.STRING,
        allowNUll:false
    },
    password:{
        
            type: Sequelize.STRING,
            allowNUll:false
        
    },
    perfil:{
        
        type: Sequelize.STRING,
        allowNUll:true,   
}
});

Admin.sync({force:false});

module.exports =Admin ;