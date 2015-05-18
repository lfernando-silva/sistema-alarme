var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.usuario) {
        return res.redirect('/veiculos');
    }
    var vm = {
        title: 'Sistema de Alarme - Login',
        error: req.flash('error')
    }
    res.render('index', vm);
});

module.exports = router;