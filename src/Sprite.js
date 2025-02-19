//Clase gestora de los sprites
export default class Sprite 
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox)
    {
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
        this.physics = physics;
        this.hitBox = hitBox;
        this.isCollidingWithPlayer = false;
        this.isCollidingWithAttack = false;
        this.isCollidingWithTopBLock = false;
        this.isCollidingWithLeftBlock = false;
        this.isCollidingWithBottomBlock = false;
        this.isCollidingWithRightBlock = false;
        this.isCollidingWithHealingPlace = false;
        this.spriteIsDead = false;
        this.isDrawn = true;
        this.damageCounter = 0;
        // In the player initialization
        this.hasIncrementedThisFrame = false;



    }
}
//Clase Player
export class Player extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox, attackHitbox, lightHitbox)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
        this.modeDAMAGE = false;
        this.invincivilityCounter = 0; // Counter for damage mode duration
        this.invincivility = 24;
        this.damageInterval = 8;
        this.isPlayerAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.2;
        this.attackHitbox = attackHitbox;
        this.activeHitbox = null;
        this.breathCount = 0;
        this.hasHealed = false;
        this.lightHitbox = lightHitbox;
        this.lightState = false;
        this.activeLight = null;
        
    }
}
export class Bat extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox, life)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
        // this.attackHitbox = attackHitbox;
        this.modeDAMAGE = false;
        this.life = life;
        this.invincivilityCounter = 0; // Counter for damage mode duration
        this.invincivility = 24;
        this.damageInterval = 8;



    }
}
export class Orc extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox, life)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
        // this.attackHitbox = attackHitbox;
        this.modeDAMAGE = false;
        this.life = life;
        this.invincivilityCounter = 0; // Counter for damage mode duration
        this.invincivility = 24;
        this.damageInterval = 8;


    }
}
export class Skull extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox, life)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
        // this.attackHitbox = attackHitbox;
        this.modeDAMAGE = false;
        this.life = life;
        this.invincivilityCounter = 0; // Counter for damage mode duration
        this.invincivility = 24;
        this.damageInterval = 8;


    }
}
export class Heart extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)

    }
    
}

export class Boss extends Sprite
{
    constructor (id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox, life)
    {
        //Llamamos al constructor de la clase Sprite
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.directionChangeCounter = 0; //Contador para cambia de direccion (second)
        this.maxTimeToChangeDirection = maxTimeToChangeDirection; //Maximo tiempo para cambio de direccion (seconds)
        // this.attackHitbox = attackHitbox;
        this.modeDAMAGE = false;

        this.life = life;



    }
}