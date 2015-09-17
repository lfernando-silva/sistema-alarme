var Net = require('net');
var userService = require('./services/user-service.js');
var config = require('./config/config.js');
var mongoose = require('mongoose');

var HOST = '0.0.0.0';
var PORT = 3001;

var Server = Net.createServer(function (socket) {
    mongoose.connect(config.mongoUri);
    socket.setKeepAlive(true, 20);
    
    //Informações sobre o socket
    
    
    var socketAtual = {
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    }
    
    console.log('Connection from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort);
    
    socket.on('data', function (data) {
        var serial = data.toString();
        userService.findUserDispositivo(serial, function (err, result) {
            if (err || !result) {
                console.log("Não encontrado");
            } else {
                console.log("Enviando status no socket");
                var status = getStatus(result.veiculos, serial)
                //escrever o status no socket
                socket.write(new Buffer(getWriteMessage()));
            }
        })
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

Server.listen(PORT, HOST, function () {
    console.log("Server Listening on " + HOST + ":" + PORT);
});

function getStatus(veiculos, serial) {
    for (var i in veiculos) {
        if (veiculos[i].dispositivo.numeroSerie == serial) {
            return veiculos[i].dispositivo.ativacoes[0].status;
        }
    }
}

function getWriteMessage(status){
    if (status == "ATIVADO") {
        return "1";
    } else {
        return "2";
    }
}