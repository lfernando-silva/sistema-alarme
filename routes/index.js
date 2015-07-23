var userService = require('../services/user-service');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.user) {
        return res.redirect('/veiculos');
    }
    var vm = {
        title: 'Login',
        error: req.flash('error')
    }
    res.render('index', vm);
});

router.get('/dispositivo/:usuario/:veiculo/:dispositivo', function (req, res) {
    var email = req.params.usuario;
    var dispositivo = req.params.dispositivo;
    var veiculo = req.params.veiculo;
    var vm = {};
    
    userService.findUserDispositivo(email, dispositivo, function (err, user) {
        if (user != null) {
            for (var i = 0; i < user.veiculos.length; i++) {
                if ((user.veiculos[i].dispositivo.numeroSerie == dispositivo) && (veiculo == i)) {
                    vm = {
                        title: dispositivo,
                        dispositivo: user.veiculos[veiculo].dispositivo.numeroSerie,
                        status: user.veiculos[veiculo].dispositivo.ativacoes[0].status
                    }
                    break;
                }
            }
        }
        res.render('veiculos/veiculo', vm);
    })
});

module.exports = router;