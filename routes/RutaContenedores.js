var express = require('express');
var router = express.Router();

var Contenedor = require('../controllers/Contenedores');


router.get('/establecerminimo', async (req, res,next) => {
  var minimo = req.query.minimo
  res.send(await Contenedor.establecerMinimo(minimo));
});

router.get('/getminimo', async (req, res,next) => {
    res.send(await Contenedor.getMinimo());
  });

module.exports = router;