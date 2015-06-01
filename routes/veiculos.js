var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');
var veiculoService = require('../services/veiculo-service');
var userService = require('../services/user-service');

/* GET veiculos/ */
router.get('/', restrict, function (req, res) {
    var vm = {
        title: 'Veículos',
        nome: req.user ? req.user.nome : null, // se autenticou, exibir primeiro nome, senão, null
        veiculos: req.user.veiculos
    }
    res.render('veiculos/index', vm);
});

router.get('/create', restrict, function (req, res) {
    var vm = {
        title: 'Veículos',
        nome: req.user ? req.user.nome : null // se autenticou, exibir primeiro nome, senão, null
    }
    res.render('veiculos/create', vm);
});

/* GET users/view listing. */
router.post('/create', function (req, res) {
    //se algo estiver errado, então crie um usuário
    //var algoErrado = false;
    //if (algoErrado) {
    userService.updateUser(req.user.email, req.body, function (err) {
        if (err) {
            var vm = {
                title: 'Novo Veículo',
                input: req.body,
                error: err
            };
            return res.render('veiculos/create', vm);
        }
        res.redirect('/veiculos');
    });
});


module.exports = router;