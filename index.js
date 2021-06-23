const express = require("express");
const app = express();
const Ruta = require('./routes/RutaObtenerRuta');
const Contenedor = require('./routes/RutaContenedores');
var bodyParser = require('body-parser')

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use('/api/ruta', Ruta);
app.use('/api/contenedor', Contenedor);
app.get('/api', async (req, res,next) => {
    res.send("RecolecAR API");
  });
app.listen(process.env.PORT || 5000, () => {
 console.log("El servidor est� inicializado en el puerto 3000");
});



