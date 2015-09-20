var Net = require('net');
var userService = require('./services/user-service.js');
var config = require('./config/config.js');
var mongoose = require('mongoose');

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
    
    console.log('Connection from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
    
    socket.on('data', function (data) {
        var serial = data.toString();
        userService.findUserDispositivo(serial, function (err, result) {
            if (err || !result) {
                console.log("Não encontrado "+serial);
            } else {
                
                var veiculoAtual = getStatus(result.veiculos, serial)
                
                console.log("Atualizando status de "+veiculoAtual.placa+" : "+veiculoAtual.status);
                
                //escrever o status no socket
                socket.write(new Buffer(getWriteMessage()));
            }
        })
    });
    
    socket.setTimeout(120*1000, function () {
        console.log('Connection timeout from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
        socket.destroy();
    });
    
    //fecha a conexão de fato
    socket.on('close', function () {
        console.log('Connection closed from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort + " at " + new Date());
        socket.destroy();
    });
      
    socket.on('error', function () {
        console.log('Connection error from ' + socketAtual.remoteAddress + ":" + socketAtual.remotePort+" at "+new Date());
        socket.destroy();
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

function getWriteMessage(status){
    if (status == "ATIVADO") {
        return "1";
    } else {
        return "2";
    }
}