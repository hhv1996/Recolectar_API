var  polylines  =  require ( '@mapbox/polyline' ) ;
//const Utils_ordenamiento = require('./Ordenamiento');
const Utils_contenedores = require('./Contenedores');
const api_key= "AIzaSyAq3eIR9LqZHzoH0F0qUsW2_oAXixVBd2g"
const url_base = "https://maps.googleapis.com/maps/api/directions/json?key="
const fetch = require('node-fetch');


async function finalizarViaje(inicio,fin){
    var url="https://maps.googleapis.com/maps/api/directions/json?origin="+inicio.latitude+","+inicio.longitude+"&destination="+fin.latitude+","+fin.longitude+"&key="+api_key
    var response = await hacerRequest(url)
    var retorno = obtenerCoordenadasRuta(response)
     return({"coordenadaDecodificada":retorno.coordenadas,
             "instrucciones": retorno.intruccion,
    })
}

async function obtenerRuta(id,inicio,fin){
    var contenedores= await Utils_contenedores.byZone(id)
    var ubicacionesContenedores = obtenerUbicaciones(contenedores)
    var auxCoor
    //ubicacionesContenedores = await Utils_ordenamiento.devolverOrdenado(inicio,ubicacionesContenedores)
    var URLS = crearURLS(inicio,fin,ubicacionesContenedores)
    for (let i = 0; i < URLS.length; i++) {
        var response = await hacerRequest(URLS[i])
        if (i==0) {
            auxCoor=obtenerCoordenadasRuta(response)
        }else{
            var aux = obtenerCoordenadasRuta(response)
            auxCoor.waypoint_order.push(aux.waypoint_order)
            for (let j = 0; j < aux.intruccion.length; j++) {
                var element =aux.intruccion[j]
                auxCoor.intruccion.push(element)
            }
            for (let k = 0; k < aux.coordenadas.length; k++) {
                var element =aux.coordenadas[k]
                auxCoor.coordenadas.push(element)
            }
        }        
    }
    return({"coordenadaDecodificada":auxCoor.coordenadas,
            "contenedores": contenedores,
            "ubicacionesContenedores": ubicacionesContenedores,
            "instrucciones": auxCoor.intruccion,
            "kmTotales": auxCoor.kmTotales,
            "waoypointsOrder": auxCoor.waypoint_order
            })
}
function crearURLS(inicio,fin,ubicacionesContenedores){
    var URLS = []
    var auxContenedores = ubicacionesContenedores.slice()
    console.log(auxContenedores.length)
    while (auxContenedores.length!=0) {
        var subArray
        if (auxContenedores.length<=25&&URLS.length<1) {
            subArray = auxContenedores.splice(0,auxContenedores.length)
            console.log(auxContenedores.length)
            URLS.push(crear1URL(subArray,inicio,fin))
        }else{
            if (auxContenedores.length<=25&&URLS.length>=1) {
                subArray = auxContenedores.splice(0,auxContenedores.length)
                URLS.push(crear1URL(subArray,ubicacionesContenedores[(URLS.length*25)],fin))
            }else{
                if (auxContenedores.length>25&&URLS.length<1) {
                    subArray = auxContenedores.splice(0,25)
                    console.log(ubicacionesContenedores[25])
                    auxFin = auxContenedores.splice(0,1)[0]
                    console.log (auxFin)
                    URLS.push(crear1URL(subArray,inicio,auxFin))
                }else{
                    if (auxContenedores.length>25&&URLS.length>=1) {
                        subArray = auxContenedores.splice(0,25)
                        URLS.push(crear1URL(subArray,ubicacionesContenedores[(URLS.length*25)],auxContenedores.splice(0,1)))
                    }
                }
            }
        }
    }
    return URLS
}
function crear1URL(arrayCoordenadas,inicio,fin){
    var URLCompleta = url_base + api_key + "&language=es-419&origin=" 
    + inicio.latitude + "," + inicio.longitude
    + "&destination="+ fin.latitude + "," + fin.longitude
    + "&waypoints=optimize:true"
    arrayCoordenadas.forEach(element => {
        console.log(element)
        URLCompleta = URLCompleta + "|" + element.latitude + "," + element.longitude
    });
    return URLCompleta
}
function obtenerCoordenadasRuta (response){
    var coordenadasDecodificadas=[]
    var instrucciones=[]
    var kmTotales = 0
    var waypointsOrder 
    var jRoutes =[]
    var jLegs =[]
    var jSteps =[]
    try {
        jRoutes = response.routes
        for (let i = 0; i < jRoutes.length; i++) {
            jLegs = jRoutes[0].legs
            for (let j = 0; j < jLegs.length; j++) {
                jSteps = jLegs[j].steps
                for (let k = 0; k < jSteps.length; k++) {
                    var polyline = jSteps[k].polyline.points
                    var list = polylines.decode(polyline)
                    list.forEach(element => {
                        coordenadasDecodificadas.push({
                            "latitude":element[0],
                            "longitude":element[1]
                        })
                    });

                    //obtengo las instrucciones 
                    var latInicio = jSteps[k].start_location.lat  
                    var lngInicio = jSteps[k].start_location.lng 
                    var inicio = {"latitude":latInicio,"longitude":lngInicio}

                    var latFin = jSteps[k].end_location.lat
                    var lngFin = jSteps[k].end_location.lng 
                    var fin = {"latitude":latFin,"longitude":lngFin}

                    var instruccion =jSteps[k].html_instructions
                    var accion=""
                    if((jSteps[k].hasOwnProperty("maneuver")))
                        accion = jSteps[k].maneuver
                    
                    instrucciones.push({
                        "inicio": inicio,
                        "fin": fin,
                        "accion": accion,
                        "intruccion": instruccion,
                        "inclinacionMapa": ""
                    })
                }
                kmTotales=kmTotales+ jLegs[j].distance.value
            }
            waypointsOrder = jRoutes[0].waypoint_order
        }
    } catch (error) {
        console.error(error);
    }
    return {"intruccion":instrucciones,"coordenadas":coordenadasDecodificadas,"kmTotales":kmTotales,"waypoint_order":waypointsOrder}
}
async function hacerRequest (url_Completa){
    var resGet= await fetch(url_Completa)
    return await resGet.json()
}
function obtenerUbicaciones (contenedores){
    var ubicacionesContenedores=[]
    contenedores.forEach(contenedor => {
        ubicacionesContenedores.push({
            "latitude":contenedor.location.coordinates[0],
            "longitude":contenedor.location.coordinates[1]
        })
      });
    return ubicacionesContenedores
}

module.exports = {obtenerRuta,finalizarViaje};