var express = require('express');
var router = express.Router();
var Contenedores = require('../controllers/Contenedores');

router.get('/contenedoresXzona', async (req, res,next) => {
    console.log(req.query.id)
    res.send(await Contenedores.byZone(req.query.id));
  });