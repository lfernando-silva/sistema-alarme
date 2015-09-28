var Net = require('net');
var userService = require('./services/user-service.js');
var config = require('./config/config.js');
var mongoose = require('mongoose');
var Message = require('./messages/Message.js');

var HOST = '0.0.0.0';
var PORT = 3001;

mongoose.connect(config.mongoUri);

var Server = Net.createServer(function (socket) {
    
    socket.setKeepAlive(true, 20);
    
    //Informações sobre o socket
    
    var socketAtual = {
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    }
    
    var serial;
    
    console.log('Connection from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
    
    socket.on('data', function (data) {
        var checkout = Message.getIsDisparadoStatus(data.toString());
        serial = checkout.serial;
        
        userService.findUserDispositivo(serial, function (err, result) {
            if (err || !result) {
                console.log("Não encontrado " + serial);
            } else {
                userService.updateUserIsConectado(serial, "1", function (err) {
                    var veiculoAtual = getStatus(result.veiculos, checkout.serial)
                    
                    console.log("Updating car status from " + veiculoAtual.placa + " : " + veiculoAtual.status + " at " + new Date());
                    
                    var writeMessage = getWriteMessage(veiculoAtual.status);
                    
                    //sistema só mostra "alarme disparado" se o status é ativado e o led amarelo estiver aceso.
                    if ((writeMessage == '1') && (checkout.ledStatus == "1")) {
                        userService.updateUserIsAberto(serial, "1", function () {
                            socket.write(writeMessage);
                        })
                    } else {
                        userService.updateUserIsAberto(serial, null, function () {
                            socket.write(writeMessage);
                        })
                    }
                })
            }
        })
    });
    
    socket.setTimeout(240 * 1000, function () {
        userService.updateUserIsConectado(serial, null, function (err) {
            console.log('Connection timeout from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
            socket.destroy();
        })
    });
    
    //fecha a conexão de fato
    socket.on('close', function () {
        userService.updateUserIsConectado(serial, null, function (err) {
            console.log('Connection closed from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
            socket.destroy();
        });
    });
    
    //fecha a conexão de fato
    socket.on('end', function () {
        userService.updateUserIsConectado(serial, null, function (err) {
            console.log('Connection ended from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
            socket.destroy();
        });
    });
    
    socket.on('error', function () {
        userService.updateUserIsConectado(serial, null, function (err) {
            console.log('Connection error from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
            socket.destroy();
        });
    });
});

Server.listen(PORT, HOST, function () {
    console.log("Server Listening on " + HOST + ":" + PORT);
});

function getStatus(veiculos, serial) {
    
    var veiculo = {};
    for (var i in veiculos) {
        if (veiculos[i].dispositivo.numeroSerie == serial) {
            
            veiculo = {
                status: veiculos[i].dispositivo.ativacoes[0].status,
                placa: veiculos[i].placa
            }
            
            return veiculo;
        }
    }
}

function getWriteMessage(status) {
    if (status == "ATIVADO") {
        return '1';
    } else {
        return '2';
    }
}