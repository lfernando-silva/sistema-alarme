var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');
var passport = require('passport');
var config = require('../config/config.js');

/* GET users listing. */
router.get('/', function (req, res) {
    -res.send('USERS');
});

router.get('/help', function (req, res) {
    var nome = req.user.nome;
    var vm = {
        title: 'Ajuda',
        nome: nome
    };
    res.render('users/help', vm);
});

router.get('/about', function (req, res) {
    var nome = req.user.nome;
    var vm = {
        title: 'Sobre',
        nome: nome
    };
    res.render('users/about', vm);
});

/* GET users/view listing. */
router.get('/create', function (req, res) {
    //nessa variável, podemos setar qualquer tag na página destino
    var vm = {
        title: 'Criar uma conta'
    };
    res.render('users/create', vm);
});

router.post('/create', function (req, res) {
    //se algo estiver errado, então crie um usuário
    //var algoErrado = false;
    //if (algoErrado) {
    userService.addUser(req.body, function (err) {
        if (err) {
            var vm = {
                title: 'Criar uma conta',
                input: req.body,
                error: err
            };
            delete vm.input.password;
            return res.render('users/create', vm);
        }
        req.login(req.body, function (err) {
            //habilite os veiculos
            res.redirect('/veiculos');
        });
    });
});

router.post('/login', 
    function (req, res, next) {
    if (req.body.rememberMe) {
        req.session.cookie.maxAge = config.cookieMaxAge;
    }
    next();
},
    passport.authenticate('local', 
        {
    failureRedirect: '/', 
    successRedirect: '/veiculos',
    failureFlash: 'Credenciais inválidas' //mensagem de login nao autorizado
}));

router.get('/logout', function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/update', function (req, res) {
    //nessa variável, podemos setar qualquer tag na página destino
    var email = req.user.email;
    var nome = req.user.nome;
    var cpf = req.user.cpf;
    userService.findUser(email, function (err) {
        if (!err) {
            var vm = {
                title: 'Atualizar Dados',
                email: email,
                cpf: cpf,
                nome: nome
            };
            res.render('users/update', vm);
        }
    })   
});

router.post('/update', function (req, res) {
    userService.updateUser(req.body, function (err){
        if (!err) {
            res.redirect('/veiculos');
        }
    })
});

router.get('/delete', function (req, res) {
    var email = req.user.email;
    var nome = req.user.nome;
    userService.findUser(email, function (err) {
        if (!err) {
            var vm = {
                title: 'Excluir Conta',
                nome: nome
            };
            res.render('users/delete', vm);
        }
    })
});

router.post('/delete', function (req, res) {
    var email = req.user.email;
    userService.deleteUser(email, function (err) {
        if (!err) {
            req.session.destroy();
            res.redirect('/');
        }
    })
});

module.exports = router;