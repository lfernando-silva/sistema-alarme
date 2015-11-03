var Message = {
    
    getIsDisparadoStatus: function (arduinoCheckout) {
        var ledStatus = arduinoCheckout.slice(15);
        var serial = arduinoCheckout.slice(0, 15);
        
        if (ledStatus == "0") {
            ledStatus = null;
        } else {
            ledStatus = "1";
        }
        
        var checkout = {
            ledStatus: ledStatus,
            serial: serial
        }
        
        return checkout;
    },
    
    getWriteMessage: function (status) {
        if (status == "ATIVADO") {
            return '1';
        } else {
            return '2';
        }
    },
    
    getStatus: function (veiculos, serial) {
        
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
}

module.exports = Message;