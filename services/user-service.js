var bcrypt = require('bcryptjs');
var User = require('../models/user').User;

exports.addUser = function (user, next) {
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        var newUser = new User({
            nome: user.nome,
            cpf: user.cpf,
            privilegios: user.privilegios,
            email: user.email.toLowerCase(),//para garantir que todo email sempre estará minúsculo ao salvar
            password: hash, //senha criptografada
            veiculos: []
        });
        
        newUser.save(function (err) {
            if (err) {
                return next(err);
            }
            next(null);
        });
    });
};

exports.findUser = function (email, next) {
    User.findOne({ email: email }, function (err, user) {
        //    User.findOne({ email: email.toLowerCase() }, function (err, user) { não funciona
        next(err, user);
    });
};

exports.updateUserAddVeiculo = function (email, veiculo, next) {
    
    User.update({ email: email }, {
        $addToSet: {
            veiculos: {
                placa: veiculo.placa,
                marca: veiculo.marca,
                cor: veiculo.cor,
                dispositivo: {
                    numeroSerie: veiculo.numeroSerie,
                    status: veiculo.status
                }
            }
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        next(err, user);
    });
}

exports.updateUserRemoveVeiculo = function (email, placa, next) {
    
    var p = placa;
    
    User.update({ email: email }, {
        $pull: {
            veiculos: { placa: p }
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        next(err, user);
    });
}

exports.uptadeUserAcionaDispositivo = function (email, dispositivo, next) {
    
    if (dispositivo.status == 'DESATIVADO') {
        dispositivo.status = 'ATIVADO';
    } else {
        dispositivo.status = 'DESATIVADO';
    }
    
    //ESSE TRECHO SERÁ ONDE OCORRE A COMUNICAÇÃO COM O ARDUINO PARA O ACIONAMENTO
    //{

    //}

    User.update({'veiculos.dispositivo.numeroSerie': dispositivo.numeroSerie }, {
        $set: {
            'veiculos.$.dispositivo.status': dispositivo.status
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        next(err, user);
    });
}
