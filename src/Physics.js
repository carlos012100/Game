export default class Physics {
    constructor(vLimit, omega = 0, angle = 0, yRef = 0, velsX, velsY, velChangeValue, acceleration) {
        this.vx = 0; // Ensure vx is initialized
        this.vy = 0;
        this.vLimit = vLimit;
        this.omega = omega; // Angular velocity
        this.angle = angle; // Current angle
        this.yRef = yRef; // Reference Y position
        this.velsX = velsX; //Array de velocidades en X
        this.velsY = velsY; //Array de velocidades en Y 
        this.velChangeCounter = 0; //Contador de cambio de velocidad
        this.velChangeValue = velChangeValue; //Valor de cambio de velocidad (segundos)
        this.velPos = 0; //Posicion en el array de velocidades
        this.acceleration = acceleration; // Adjust this value for faster/slower acceleration

    }
}