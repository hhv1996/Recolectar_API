var express = require('express');
var router = express.Router();
var Contenedor = require('../controllers/Contenedores');




router.post('/setminimo', async (req, res,next) => {
  var minimo = req.body.minimo
  await Contenedor.establecerMinimo(minimo)
  res.send("Ok");
});

router.get('/getminimo', async (req, res,next) => {
    var minimo=await  Contenedor.getMinimo()
    res.send({umbral_minimo:minimo});
  });

module.exports = router;