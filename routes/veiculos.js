var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');

/* GET veiculos/ */
router.get('/', restrict, function (req, res) {
    var vm = {
        title: 'Veículos',
        nome: req.user ? req.user.nome : null // se autenticou, exibir primeiro nome, senão, null
    }
    res.render('veiculos/index', vm);
});

module.exports = router;