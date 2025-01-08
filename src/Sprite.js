//Clase gestora de los sprites
export default class Sprite 
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics)
    {
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
        this.physics = physics;
    }
}
//Clase Player
export class Player extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
    }
}
export class Bat extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
    }
}
export class Orc extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
    }
}