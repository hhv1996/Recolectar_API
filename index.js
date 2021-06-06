const express = require("express");
const app = express();

const Ordenamiento = require('./routes/RutaOrdenamiento');

app.use('/api/ordenamiento', Ordenamiento);

app.listen(3000, () => {
 console.log("El servidor est� inicializado en el puerto 3000");
});