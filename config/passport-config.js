module.exports = function () {
    var passport = require('passport');
    var passportLocal = require('passport-local');
    var bcrypt = require('bcryptjs');
    var userService = require('../services/user-service');
    
    passport.use(new passportLocal.Strategy({ usernameField: 'email' }, function (email, password, next) {
        userService.findUser(email, function (err, user) {
            if (err) {
                return next(err);
            }
            
            if (!user) {
                return next(null, null);
            }
            bcrypt.compare(password, user.password, function (err, same) {
                if (err) {
                    return next(err);
                }
                
                if (!same) {
                    return next();
                }
                next(null, user);//response para tela autenticado
            })
           
        })
    }));
    //funções para serialização e desserialização
    passport.serializeUser(function (user, next) {
        next(null, user.email);
    });

    passport.deserializeUser(function (email, next) {
        userService.findUser(email, function (err, user) {
            next(err, user);
        });
    });
};