var Veiculo = require('../models/veiculo').Veiculo;

exports.addVeiculo = function (veiculo, next) {
    
    var newVeiculo = new Veiculo({
        placa: veiculo.placa.toLowerCase(),
        cor: veiculo.cor,
        marca: veiculo.marca,
        //dispositivo
        numeroSerie: veiculo.numeroSerie,
        status: 0
    });
    
    newVeiculo.save(function (err) {
        if (err) {
            return next(err);
        }
        next(null);
    });
};

//exports.find() = function (veiculos, next){
//    Veiculo.findOne({}, function (err) {
//        next(err);
//    });
    
//}