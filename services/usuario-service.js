var Usuario = require('../model/usuario').Usuario;

exports.addUsuario = function (usuario, next) {
    var newUsuario = new Usuario({
        nome: usuario.nome,
        cpf: usuario.cpf,
        privilegios: usuario.privilegios,
        login: usuario.login.toLowerCase(),//para garantir que todo email sempre estará minúsculo ao salvar
        senha: usuario.senha
    });
    
    newUsuario.save(function (err) {
        if (err) {
            return next(err);
        }
        next(null);
    })
};

//método que verifica se login já existe no banco
exports.findUsuario = function (login, next) {
    Usuario.findOne({ login: login }, function (err, usuario) {
        next(err, usuario);
    });
};