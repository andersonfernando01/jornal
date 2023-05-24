const express = require('express');
const message = require('./messageController');
const router = express.Router();
const server = require('http').createServer(router);
const io = require('socket.io')(server);


router.get('/contacto',(req, res)=>{
res.render('Chat/index');
});

function renderMessage(mensagens) {
    
    $('#message').append('<div><strong>'+mensagens.autor+'</strong>:'+mensagens.message+'</div>');
}

var sms=[];

io.on('connection',socket=>{
    console.log('====================================');
    console.log(`SOCKET CONNECTION:${socket.id}`);
    console.log('====================================');
     
    socket.on('sendMessage',dados=>{

        sms.push(dados); 


        socket.broadcast.emit('receivedMessage',dados);
    });

});

module.exports = router;