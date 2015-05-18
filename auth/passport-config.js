module.exports = function () {
    var passport = require('passport');
    var passportLocal = require('passport-local').Strategy;
    var userService = require('../services/usuario-service');
    
    passport.use(new passportLocal({ usernameField: 'login' }, function (login, senha, next) {    
        userService.findUser(login, function (err, usuario) {
            if (err) {
                return next(err);
            }
            
            if (!usuario || usuario.senha != senha) {
                return next(null, null);
            }
            next(null, usuario);//response para tela autenticado
        })
    }));
    //funções para serialização e desserialização
    passport.serializeUser(function (usuario, next) {
        next(null, usuario.login);
    });
    
    passport.deserializeUser(function (login, next) {
        userService.findUsuario(login, function (err, usuario) {
            next(err, usuario);
        });
    });
};