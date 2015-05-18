var express = require('express');
var router = express.Router();
var userService = require('../services/usuario-service');
var passport = require('passport');

/* GET usuarios listing. */
router.get('/', function (req, res) {
    res.send('USUÁRIOS');
});

/* GET usuarios/create listing. */
router.get('/create', function (req, res) {
    //nessa variável, podemos setar qualquer tag na página destino
    var vm = {
        title: 'Criar uma conta'
    };
    res.render('usuarios/create', vm);
});

/* GET users/view listing. */
router.post('/create', function (req, res) {
    //se algo estiver errado, então crie um usuário
    //var algoErrado = false;
    //if (algoErrado) {
    userService.addUsuario(req.body, function (err) {
        if (err) {
            var vm = {
                title: 'Criar uma conta',
                input: req.body,
                error: err
            };
            delete vm.input.senha;
            return res.render('usuarios/create', vm);
        }
        req.login(req.body, function (err) {   
            //loginUsuario: userService.findUsuario(req.body.loginUsuario, {})
            //habilite os pedidos
            res.redirect('/veiculos')
        });
    });
});

router.post('/login', 
    passport.authenticate('local', 
        {
    failureRedirect: '/', 
    successRedirect: '/veiculos',
    failureFlash: 'Credenciais inválidas' //mensagem de login nao autorizado
}));

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});
module.exports = router;