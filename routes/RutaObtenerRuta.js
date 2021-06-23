var express = require('express');
var router = express.Router();

var Ruta = require('../controllers/Ruta');


router.get('/obtenerruta', async (req, res,next) => {
  var inicio = JSON.parse(req.query.inicio)
  var fin = JSON.parse(req.query.fin)
  var id = req.query.id
  res.send(await Ruta.obtenerRuta(id,inicio,fin));
});
router.get('/finalizarviaje', async (req, res,next) => {
  var inicio = JSON.parse(req.query.inicio)
  var fin = JSON.parse(req.query.fin)
  res.send(await Ruta.finalizarViaje(inicio,fin));
});

module.exports = router;