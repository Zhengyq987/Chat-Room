//our server code
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http'); //built in module, 不需要npm install
const { Socket } = require('dgram');

app.get('/', (req, res) => {
    // res.send('Hello');
    res.sendFile(`${__dirname}/chat.html`);
});

//launch our server and bind socket.io to it
const httpServer = http.createServer(app).listen(3000)
const io = socketIO(httpServer);


let connectedUsers = 0;

//set up our first Node event handler
io.on('connection', (socket) => {
    console.log('Client connected');
    connectedUsers++;
    io.emit('user_count', connectedUsers);

    //radical - make and trigger our own event
    socket.emit('welcome', 'Welcome to the Chat Server!')

    //handle new chat event from the client
    socket.on('message', (newChat) => {
        console.log(newChat);

        //broadcast this message to everyone in thr chat
        io.emit('new_message', newChat);
    });

    //seconde node event handler
    socket.on('disconnect', () => {
        console.log('Client disconnected')
        
        connectedUsers--;
    })

    
});

//outside client socket connectiion handler
setInterval(()=>{

    io.emit('server_time', new Date().toTimeString());
}, 1000);

