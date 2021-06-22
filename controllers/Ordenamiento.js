const { json } = require('express');
const fetch = require('node-fetch');


const api_key= "AIzaSyAq3eIR9LqZHzoH0F0qUsW2_oAXixVBd2g"
const url_base = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric"

async function buscarMasCercano (origen,arrayDesordenado,arrayOrdenado){
  var auxUrl = "&destinations="
  var conAux = 0 //esta variable la uso para restablecer el indice original
  var puntoMasCercano = {
    coordenada:{lat:0.0,lng:0.0},
    distancia:0,
    index:1
  }

  for (let index = 0; index < arrayDesordenado.length; index++) {
      auxUrl=auxUrl+arrayDesordenado[index].latitude+","+arrayDesordenado[index].longitude+"|"
      if((index+1)%25==0||index==arrayDesordenado.length-1){
        if(auxUrl!="&destinations="){
          var url_Completa = url_base + `&origins=` + origen.latitude + ","+origen.longitude + auxUrl+`&key=` + api_key
          var response = await hacerRequest(url_Completa)
          for (let i = 0; i < response.rows[0].elements.length; i++) {//busco el punto mas cercano
            if(puntoMasCercano.coordenada.lng==0.0){
              puntoMasCercano.distancia=response.rows[0].elements[0].distance.value
              puntoMasCercano.index=0
              puntoMasCercano.coordenada.lat=arrayDesordenado[0].latitude
              puntoMasCercano.coordenada.lng=arrayDesordenado[0].longitude
            }else{
              if (response.rows[0].elements[i].distance.value<puntoMasCercano.distancia){
                puntoMasCercano.distancia=response.rows[0].elements[i].distance.value
                puntoMasCercano.index=25 * conAux + i
                puntoMasCercano.coordenada.lat=arrayDesordenado[25 * conAux + i].latitude
                puntoMasCercano.coordenada.lng=arrayDesordenado[25 * conAux + i].longitude
              }
            }
          }
          auxUrl = "&destinations="
          conAux++
        }
      }
    }
  arrayDesordenado.splice(puntoMasCercano.index, 1);
  arrayOrdenado.push({ 
      "latitude"    : puntoMasCercano.coordenada.lat,
      "longitude"  : puntoMasCercano.coordenada.lng
  });
  puntoMasCercano = {
    coordenada:{lat:0.0,lng:0.0},
    distancia:0,
    index:1
  }
}

async function devolverOrdenado (inicio,ubicaciones){
  var arrayOrdenado = []
  var arrayDesordenado=ubicaciones
  await buscarMasCercano(inicio,arrayDesordenado,arrayOrdenado)
  while(arrayDesordenado.length!=0)
  {  
    var ultimoPtoMasCercano = {"latitude":arrayOrdenado[arrayOrdenado.length-1].latitude,
                              "longitude":arrayOrdenado[arrayOrdenado.length-1].longitude}
    await buscarMasCercano(ultimoPtoMasCercano,arrayDesordenado,arrayOrdenado)
    console.log("trabajando")
  }  
  console.log(arrayOrdenado)
  return arrayOrdenado
}


async function hacerRequest (url_Completa){
  var resGet= await fetch(url_Completa)
  return await resGet.json()
}
module.exports = {devolverOrdenado};