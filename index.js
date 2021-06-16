const express = require("express");
const app = express();
const Ruta = require('./routes/RutaObtenerRuta');

app.use('/api/ruta', Ruta);

app.listen(3000, () => {
 console.log("El servidor est� inicializado en el puerto 3000");
});



