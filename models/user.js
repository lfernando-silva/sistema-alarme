﻿var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service')

var userSchema = new Schema({
    nome: { type: String, required: "Insira seu primeiro nome" },
    cpf: {type:String, required: "Insira seu sobrenome" },
    privilegios: {type:Number, required: "Insira o privilégio"},
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
}, "Email já existente");


var User = mongoose.model("User", userSchema);

module.exports = {
    User : User
}