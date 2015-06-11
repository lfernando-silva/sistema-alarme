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
            veiculos: 
            {
                placa: veiculo.placa,
                marca: veiculo.marca,
                cor: veiculo.cor,
                numeroSerie: veiculo.numeroSerie,
                status: 'DESATIVADO'
            }
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        next(err, user);
    });
}
