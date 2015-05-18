var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    nome: { type: String, required: "Insira seu nome" },
    cpf: { type: String, required: "Insira seu CPF" },
    privilegios: { type: Number, required: "Insira o privilegio"},
    login: { type: String, required: "Insira seu login" },
    senha: { type: String, required: "Insira a senha" },
    created: { type: Date, default: Date.now }
});

//validar email, chamada a função definida no user-service.js
userSchema.path('login').validate(function (value, next) {
    userService.findUsuario(value, function (err, usuario) {
        if (err) {
            console.log(err);
            return next(false);
        }
        next(!usuario);
    });
}, "Email já existente");

var Usuario = mongoose.model("Usuario", userSchema);

module.exports = {
    Usuario : Usuario
}