var express = require('express');
var router = express.Router();

var Ordenamiento = require('../controllers/Ordenamiento');


router.get('/byZone', async (req, res,next) => {
  res.send(await Ordenamiento.devolverOrdenado([-34.585232,-58.4039075]));
});

module.exports = router;
