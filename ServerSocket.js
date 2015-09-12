var Net = require('net');

var Server = Net.createServer(function (socket) {
    //Apenas informações sobre o socket
    socket.setKeepAlive(true, 20);
    var socketAtual = {
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    }
    
    console.log('Connection from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort);
    
    socket.on('data', function (data) {
        if (data == '01') {
            console.log("Consulta no banco de dados por " + data);
            console.log(typeof data);
        } else {
            console.log("Não fazer nada ->" + data)
            console.log(typeof data);
        }
    });
    
    socket.setTimeout(120 * 10000, function () {
        console.log('Connection timeout de ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort);
        socket.destroy();
    });
    
    //fecha a conexão de fato
    socket.on('close', function () {
        console.log('Connection closed de ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort);
        socket.destroy();
    });
    
    socket.on('error', function () {
        console.log('Connection error de ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort);
        socket.destroy();
    });
});

module.exports = Server;