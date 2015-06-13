var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service')

var userSchema = new Schema({
    nome: { type: String, required: "Insira seu primeiro nome" },
    cpf: {type:String, required: "Insira seu sobrenome" },
    email: {type:String, required: "Insira seu email" },
    password: { type: String, required: "Insira a senha" },
    veiculos: {type: Array, default: []},
    created: {type: Date, default: Date.now}
});

//validar email, chamada a função definida no user-service.js
userSchema.path('email').validate(function (value, next) {
    userService.findUser(value, function (err, user) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, "Email já existente!");

//userSchema.path('veiculos').validate(function (value, next) {
//    userService.findUser(value, function (err, user) {
//        if (err) {
//            console.log(err);
//            return next(false);
//        }
//        next(!user);
//    });
//}, "Dispositivo já está em uso!");

var User = mongoose.model("User", userSchema);

module.exports = {
    User : User
}