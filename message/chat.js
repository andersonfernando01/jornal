const Sequelize = require('sequelize');
const connection = require('../Database/database');
const benef = require('../Admin/user');

const message = connection.define('message',{
    sms:{
        type: Sequelize.STRING,
        allowNUll:false
    },
    
});


benef.hasMany(message);
message.belongsTo(benef);
message.sync({force:false});

module.exports = message;