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

exports.findUserDispositivo = function (email, dispositivo, next) {
    User.findOne({ email: email, "veiculos.dispositivo.numeroSerie": dispositivo }, function (err, user) {
        //    User.findOne({ email: email.toLowerCase() }, function (err, user) { não funciona
        next(err, user);
    });
};

exports.validaVeiculo = function (email, veiculo, next) {
    //procurar por um usuario que tenha
    //'veiculos.dispositivo.numeroSerie '= veiculo.numeroSerie
    //ou
    //veiculos.placa = veiculo.placa E  email: email
    User.findOne(
        {
            $or: [
                { 'veiculos.dispositivo.numeroSerie': veiculo.numeroSerie },
                { $and: [{ email: email }, { 'veiculos.placa': veiculo.placa }] }
            ]
        }, 
        function (err, user) {
        next(err, user);
    });
}

exports.updateUserAddVeiculo = function (email, veiculo, next) {
    
    var dateTime = getDateTime();

    var ativacoes = [];
    var ativacao = {
        status: veiculo.status,
        horario: dateTime.horario,
        data: dateTime.data
    }

    ativacoes.push(ativacao);
  
    this.validaVeiculo(email,veiculo, function (err, user) {
        if (err) {
            next(err, user);
        }
        if (user) {
            next(null);
        } else {
            User.update({ email: email }, {
                $addToSet: {
                    veiculos: {
                        placa: veiculo.placa,
                        marca: veiculo.marca,
                        cor: veiculo.cor,
                        dispositivo: {
                            numeroSerie: veiculo.numeroSerie,
                            ativacoes: ativacoes
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
    
    var dateTime = getDateTime();  
    var status = dispositivo.status;

    if (status == 'DESATIVADO') {
        status = 'ATIVADO';
    } else {
        status = 'DESATIVADO';
    }
    
    //ESSE TRECHO SERÁ ONDE OCORRE A COMUNICAÇÃO COM O ARDUINO PARA O ACIONAMENTO
    //{
    
    //}
    
    var ativacao = {
        status: status,
        horario: dateTime.horario,
        data: dateTime.data
    }

    User.update({ 'veiculos.dispositivo.numeroSerie': dispositivo.numeroSerie }, {
        $push: {
            'veiculos.$.dispositivo.ativacoes': { $each: [ativacao], $position: 0 }
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        next(err, user);
    });
}

function getDateTime(){
    var now = new Date();
    var hora = now.getHours();
    var minutos = now.getMinutes();
    var dia = now.getDate();
    var mes = now.getUTCMonth() + 1;
    var ano = now.getFullYear();
    
    var stringDateTime = {
        horario: hora + ":" + minutos,
        data: dia + "/" + mes + "/" + ano
    }
    
    return stringDateTime;
}
