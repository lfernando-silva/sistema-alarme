var User = require('../models/user').User;

exports.addUser = function (user, next) {
    var newUser = new User({
        nome: user.nome,
        cpf: user.cpf,
        privilegios: user.privilegios,
        email: user.email.toLowerCase(),//para garantir que todo email sempre estará minúsculo ao salvar
        password: user.password
    });

    newUser.save(function (err){
        if (err) {
            return next(err);
        }
        next(null);
    })
};

exports.findUser = function (email, next) {
    User.findOne({ email: email }, function (err, user) {
        //    User.findOne({ email: email.toLowerCase() }, function (err, user) { não funciona
        next(err, user);
    });
};
