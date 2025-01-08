export default class Frames{

    constructor(framesPerState, speed = 1){
        
        this.framesPerState = framesPerState; //Numero de frames que contiene un estado
        this.framesCounter = 0;    //numero de frame; incluye los movimientos del personaje, imagina cada paso del personaje, ejemplo: 8 pasos.
        this.speed = speed; //Velocidad de cambio de frame (Minimo: 1. a mayor numver, mas lento)
        this.framesChangeCounter = 0; //Contador de velocidad de cambio de frame
    }
}