const { json } = require('express');
const fetch = require('node-fetch');
const contenedores = require('./Contenedores');
var control =0
var puntoMasCercano = {
    coordenada:{lat:0.0,lng:0.0},
    distancia:0,
    index:1
}
var arrayDesordenado = {
    "coordenadas": [
      [
        -34.585804,
        -58.4035665
      ],
      [
        -34.585912,
        -58.4036097
      ],
      [
        -34.586312,
        -58.403286
      ],
      [
        -34.586268,
        -58.4026185
      ],
      [
        -34.586027,
        -58.402469
      ],
      [
        -34.585462,
        -58.40163
      ],
      [
        -34.583404,
        -58.4046354
      ],
      [
        -34.583408,
        -58.405492
      ],
      [
        -34.583505,
        -58.40708
      ],
      [
        -34.584337,
        -58.4060145
      ],
      [
        -34.584916,
        -58.405619
      ],
      [
        -34.584168,
        -58.40852
      ],
      [
        -34.584663,
        -58.409217
      ],
      [
        -34.585364,
        -58.4066975
      ],
      [
        -34.585727,
        -58.4068456
      ],
      [
        -34.586045,
        -58.40721
      ],
      [
        -34.5865556,
        -58.4063607
      ],
      [
        -34.587024,
        -58.405206
      ],
      [
        -34.587024,
        -58.404895
      ],
      [
        -34.586392,
        -58.405065
      ],
      [
        -34.585288,
        -58.409625
      ],
      [
        -34.58575,
        -58.408496
      ],
      [
        -34.586136,
        -58.408033
      ],
      [
        -34.586051,
        -58.4071617
      ],
      [
        -34.58666,
        -58.407366
      ],
      [
        -34.587051,
        -58.4064447
      ],
      [
        -34.586874,
        -58.406273
      ],
      [
        -34.587435,
        -58.406139
      ],
      [
        -34.587809,
        -58.405543
      ],
      [
        -34.587817,
        -58.404907
      ],
      [
        -34.587353,
        -58.404274
      ],
      [
        -34.586271,
        -58.4097224
      ],
      [
        -34.586824,
        -58.409112
      ],
      [
        -34.586903,
        -58.4079327
      ],
      [
        -34.586417,
        -58.407831
      ],
      [
        -34.587449,
        -58.4080017
      ],
      [
        -34.5877555,
        -58.4069941
      ],
      [
        -34.587776,
        -58.4067775
      ],
      [
        -34.587299,
        -58.4062165
      ],
      [
        -34.586771,
        -58.4094315
      ],
      [
        -34.58738,
        -58.410005
      ],
      [
        -34.5880422,
        -58.4091442
      ],
      [
        -34.587916,
        -58.4090085
      ],
      [
        -34.587916,
        -58.4090085
      ],
      [
        -34.588375,
        -58.409121
      ],
      [
        -34.588569,
        -58.408252
      ],
      [
        -34.588123,
        -58.407748
      ],
      [
        -34.589017,
        -58.4077305
      ],
      [
        -34.589397,
        -58.4074377
      ],
      [
        -34.589237,
        -58.406818
      ],
      [
        -34.587888,
        -58.4105666
      ],
      [
        -34.588378,
        -58.4102635
      ],
      [
        -34.588639,
        -58.4098067
      ],
      [
        -34.58859,
        -58.409775
      ],
      [
        -34.588285,
        -58.409501
      ],
      [
        -34.588581,
        -58.4098847
      ],
      [
        -34.588564,
        -58.4092135
      ]
    ]}
var arrayOrdenado = []
const api_key= "AIzaSyBdkQFmnElXImn5Po8QhlW2A4e8NZq3Vyw"
const url_base = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric"

async function buscarMasCercano (origen){
  var auxUrl = "&destinations="
  var conAux = 0 //esta variable la uso para restablecer el indice original

  for (let index = 0; index < arrayDesordenado.coordenadas.length; index++) {
      auxUrl=auxUrl+arrayDesordenado.coordenadas[index][0]+","+arrayDesordenado.coordenadas[index][1]+"|"
      if((index+1)%25==0||index==arrayDesordenado.coordenadas.length-1){
        if(auxUrl!="&destinations="){
          var url_Completa = url_base + `&origins=` + origen[0] + ","+origen[1] + auxUrl+`&key=` + api_key
          var response = await hacerRequest(url_Completa)
          for (let i = 0; i < response.rows[0].elements.length; i++) {//busco el punto mas cercano
            if(puntoMasCercano.coordenada.lng==0.0){
              puntoMasCercano.distancia=response.rows[0].elements[0].distance.value
              puntoMasCercano.index=0
              puntoMasCercano.coordenada.lat=arrayDesordenado.coordenadas[0][0]
              puntoMasCercano.coordenada.lng=arrayDesordenado.coordenadas[0][1]
            }else{
              if (response.rows[0].elements[i].distance.value<puntoMasCercano.distancia){
                puntoMasCercano.distancia=response.rows[0].elements[i].distance.value
                puntoMasCercano.index=25 * conAux + i
                puntoMasCercano.coordenada.lat=arrayDesordenado.coordenadas[25 * conAux + i][0]
                puntoMasCercano.coordenada.lng=arrayDesordenado.coordenadas[25 * conAux + i][1]
              }
            }
          }
          auxUrl = "&destinations="
          conAux++
        }
      }
    }
  arrayDesordenado.coordenadas.splice(puntoMasCercano.index, 1);
  arrayOrdenado.push({ 
      "lat"    : puntoMasCercano.coordenada.lat,
      "lng"  : puntoMasCercano.coordenada.lng,
      "distancia": puntoMasCercano.distancia
  });
  puntoMasCercano = {
    coordenada:{lat:0.0,lng:0.0},
    distancia:0,
    index:1
  }
}

async function devolverOrdenado (inicio){
  await buscarMasCercano(inicio)
  while(arrayDesordenado.coordenadas.length!=0)
  {  
    var ultimoPtoMasCercano = [arrayOrdenado[arrayOrdenado.length-1].lat,arrayOrdenado[arrayOrdenado.length-1].lng]
    await buscarMasCercano(ultimoPtoMasCercano)
    console.log("trabajando")
  }  
  console.log(arrayOrdenado)
  return arrayOrdenado
}

async function hacerRequest (url_Completa){
  var resGet= await fetch(url_Completa)
  return await resGet.json()
}
module.exports = {devolverOrdenado,buscarMasCercano};