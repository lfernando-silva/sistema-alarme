var Net = require('net');
var SocketEventHandler = require('./SocketEventHandler.js');

var HOST = '0.0.0.0';
var PORT = 3001;

SocketEventHandler.handleMongooseConnection();

var Server = Net.createServer(function (socket) {
    
    SocketEventHandler.handleNewConnection(socket);
    SocketEventHandler.handleSetKeepAlive(socket, 20);
     
    socket.on('data', function (data) {

        var options = {
            data: data,
            socket: socket
        }
        SocketEventHandler.handleData(options);
    });
    
    socket.setTimeout(240 * 1000, function (socket) {
        
        var options = {
            socket: socket,
            type: "timed out"
        }
        SocketEventHandler.handleSocketDestroy(options);
    });
    
    //fecha a conexão de fato
    socket.on('close', function () {
        var options = {
            socket: socket,
            type: "closed"
        }
        SocketEventHandler.handleSocketDestroy(options);
    });
    
    //fecha a conexão de fato
    socket.on('end', function () {
        var options = {
            socket: socket,
            type: "ended"
        }
        SocketEventHandler.handleSocketDestroy(options);
    });
    
    socket.on('error', function () {
        var options = {
            socket: socket,
            type: "failed"
        }
        SocketEventHandler.handleSocketDestroy(options);
    });
});

Server.listen(PORT, HOST, function () {
    console.log("Server Listening on " + HOST + ":" + PORT);
});