const URL = 'http://46.17.108.122:1026/v2/entities/?type=WasteContainer&options=keyValues&limit=1000'
const fetch = require('node-fetch');
var umbral_recoleccion = 0.3
async function byZone(id){
  var contenedores = await hacerRequest(URL)
  return await obtenerContenedoresXZonaRecolectables(id,contenedores)
}
async function hacerRequest (url_Completa){
  var resGet= await fetch(url_Completa)
  return await resGet.json()
}
async function establecerMinimo (minimo){
  umbral_recoleccion=minimo
}

async function getMinimo (){
  return umbral_recoleccion
}

async function obtenerContenedoresXZonaRecolectables (id,contenedores){
  var auxContenedores=[]
  contenedores.forEach(contenedor => {
    if (contenedor.refZona==id&&contenedor.fillingLevel>=umbral_recoleccion) {
      auxContenedores.push(contenedor)
    }
  });
  return auxContenedores
}
module.exports = {byZone,establecerMinimo,getMinimo};