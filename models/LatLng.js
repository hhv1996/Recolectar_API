class LatLng
{
    constructor()
    {
        //Variables que estaran disponibles en el scope global
        //de la clase
        this.valor_a = 0;
        this.valor_b = 0;
        console.log("Se genero la instancia de CalculadoraUsandoClass");
    }
    setValores(valor_a, valor_b)
    {
        this.valor_a = valor_a;
        this.valor_b = valor_b;
        console.log(`El valor de a es => ${this.valor_a}`);
        console.log(`El valor de b es => ${this.valor_b}`);
    }//setValores

}
