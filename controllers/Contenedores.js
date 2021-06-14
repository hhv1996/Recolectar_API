var contenedores = []
const URL = 'http://46.17.108.122:1026/v2/entities/?type=WasteContainer&options=keyValues&limit=1000'
const fetch = require('node-fetch');
const umbral_recoleccion = 0.4
async function byZone(id){
  await hacerRequest(URL)
  return await obtenerContenedoresXZonaRecolectables(id)
}
async function hacerRequest (url_Completa){
  var resGet= await fetch(url_Completa)
  contenedores=await resGet.json()
}
async function obtenerContenedoresXZonaRecolectables (id){
  var auxContenedores=[]
  contenedores.forEach(contenedor => {
    if (contenedor.refZona==id&&contenedor.fillingLevel>=umbral_recoleccion) {
      auxContenedores.push(contenedor)
    }
  });
  return auxContenedores
}
module.exports = {byZone};