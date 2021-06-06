export default class unRequest {
    URL=""
    puntos=[]
    ptoMasCercano=[]
    indexPtoMasCercano=0
    fetch = require('node-fetch');


    obtenerURLApi (inicio){
        var auxURL=""
        for (let i = 0; i < array.length; i++){
            auxURL=auxURL+puntos[i].punto.latitude+","+puntos[i].punto.longitude+"|"
        }
        auxURL ="https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+inicio.latitude+","+inicio.longitude&"destinations="+auxURL+"key=AIzaSyBdkQFmnElXImn5Po8QhlW2A4e8NZq3Vyw"
        URL=auxURL
    }
    obtenerDistancias(){
        fetch(this.URL)
        .then(res => res.json())
        .then(json => console.log(json));
    }
    parsearRequestGuardarDistancias (response){
        var jRows
        var jElements
        var jDistance = 0
        try {
            jRows = response.rows
           for (let i = 0; i < jRows.length; i++)  {
                jElements = jRows[i].elements
                for (let j = 0; j < jElements.length; j++){
                    jDistance = jElements[j].distance.value
                    puntos[j].distancia=jDistance
                }
            }
        } catch (error) {
            console.error(error);

        }
    }
    obtenerPtoMasCercano (){
        var auxPtoMasCercano=puntos[0]
        var auxIndexPtoMasCercano=0
        for(let i = 0; i < this.puntos.length; i++){
            if(puntos[i].distancia<auxPtoMasCercano.distancia){
                auxPtoMasCercano=puntos[i]
                auxIndexPtoMasCercano=i
            }
        }
        ptoMasCercano=auxPtoMasCercano
        indexPtoMasCercano=auxIndexPtoMasCercano
    }
}
export default class PuntoDistancia{

}