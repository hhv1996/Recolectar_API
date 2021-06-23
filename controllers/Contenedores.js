const URL = 'http://46.17.108.122:1026/v2/entities/?type=WasteContainer&options=keyValues&limit=1000'
const fetch = require('node-fetch');
var umbral_recoleccion = 0.3
var metro_cubrico_contenedor = 0.76
var metro_cubrico_vehiculo = 20
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
   return await umbral_recoleccion
}

async function obtenerContenedoresXZonaRecolectables (id,contenedores){
  var auxContenedores=[]
  var auxContenedoresFueraMinimo=[]
  var volumenTotalViaje=0.0
  contenedores.forEach(contenedor => {
    if (contenedor.refZona==id&&contenedor.fillingLevel>=umbral_recoleccion) {
      volumenTotalViaje = volumenTotalViaje + (((contenedor.fillingLevel*100)*metro_cubrico_contenedor)/100)
      auxContenedores.push(contenedor)
      console.log(volumenTotalViaje)
    }else{
      auxContenedoresFueraMinimo.push(contenedor)
    }
  });
  auxContenedoresFueraMinimo.forEach(contenedor => {
    var m3Contenedor=(((contenedor.fillingLevel*100)*metro_cubrico_contenedor)/100)
    if (contenedor.refZona==id&&volumenTotalViaje+m3Contenedor<metro_cubrico_vehiculo) {
      volumenTotalViaje = volumenTotalViaje + m3Contenedor
      auxContenedores.push(contenedor)
    }
  });
  console.log(volumenTotalViaje)
  return auxContenedores
}
module.exports = {byZone,establecerMinimo,getMinimo};