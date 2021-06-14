const express = require("express");
const app = express();

const Ordenamiento = require('./routes/RutaOrdenamiento');
const Ruta = require('./routes/RutaObtenerRuta');

app.use('/api/ordenamiento', Ordenamiento);
app.use('/api/ruta', Ruta);

app.listen(3000, () => {
 console.log("El servidor est� inicializado en el puerto 3000");
});