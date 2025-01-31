import globals from "./globals.js";
import {Game, State, SpriteID} from "./constants.js";
import detectCollisions from "./collisions.js";
import {initVars} from "./initialize.js";

export default function update(){


    //Change what the game is doing based on the game state
    switch(globals.gameState){
        case Game.LOADING:
            console.log("Loading assets...");
            break;

        case Game.PLAYING:
            playGame();
            break;

        case Game.MENU:
            break;

        case Game.NEW_GAME:
            break;

        case Game.NEW_GAME1:
            break;

        case Game.HIGHSCORE:
            break;

        case Game.CONTROLS:
            break;

        case Game.GAME_OVER:
            break;

        default:
            console.error("Error: Game State invalid");
    }
}
function readKeyboardAndAssignState(sprite)
{

    sprite.state =  globals.action.attack && globals.action.moveRight ? State.RIGHT_ATTACK :
                    globals.action.attack && globals.action.moveLeft ? State.LEFT_ATTACK :
                    globals.action.moveLeft && globals.action.moveUp ? State.UP_LEFT :
                    globals.action.moveLeft && globals.action.moveDown ? State.DOWN_LEFT :
                    globals.action.moveRight && globals.action.moveUp ? State.UP_RIGHT :
                    globals.action.moveRight && globals.action.moveDown ? State.DOWN_RIGHT :
                    globals.action.moveLeft ? State.LEFT : //Left key
                    globals.action.moveRight ? State.RIGHT : //Right key
                    globals.action.moveUp ? State.UP : //Up key
                    globals.action.moveDown ? State.DOWN : //Down key
                    sprite.state === State.RIGHT_ATTACK ? State.RIGHT_STILL :
                    sprite.state === State.LEFT_ATTACK ? State.LEFT_STILL :
                    sprite.state === State.UP_LEFT ? State.UP_STILL :
                    sprite.state === State.DOWN_LEFT ? State.DOWN_STILL :
                    sprite.state === State.UP_RIGHT ? State.UP_STILL :
                    sprite.state === State.DOWN_RIGHT ? State.UP_STILL :
                    sprite.state === State.LEFT ? State.LEFT_STILL: //no key pressed after LEFT Key
                    sprite.state === State.RIGHT ? State.RIGHT_STILL : //no key pressed after RIGHT key
                    sprite.state === State.UP ? State.UP_STILL : //no key pressed after UP key
                    sprite.state === State.DOWN ? State.DOWN_STILL : //no key pressed after DOWN key
                    sprite.state;
                    console.log(`moveLeft: ${globals.action.moveLeft}, right attack: ${globals.action.attackRight}`);
                    console.log(`moveUp: ${globals.action.moveUp}, moveDown: ${globals.action.moveDown}`);


}

function updateLevelTime()
{
    //Incrementamos el contador de cambio de valor

    globals.levelTime.timeChangeCounter += globals.deltaTime;
    //SI ha pasado el tiempo necesario, cambiamos el valor del timer
    if (globals.levelTime.timeChangeCounter > globals.levelTime.timeChangeValue)
    {
        globals.levelTime.value--;
        //Reseteamos timeChangerCounter
        globals.levelTime.timeChangeCounter = 0;
    }

}

function updateGameTime()
{
    //Incrementamos el contador
    globals.gameTime += globals.deltaTime;
}

function playGame(){

    updateSprites();
    detectCollisions();
    updateGameTime();
    updateLevelTime();
    // updateLife();    
     // Update and redraw the HUD (e.g., hearts)
     globals.sprites.forEach(sprite => {
        if (sprite.id === SpriteID.HEART) {
            updateHearts(sprite);
        }
    });
    updateCamera();

}

function swapDirection(sprite)
{
    switch(sprite.id)
    {
        case SpriteID.PLAYER:
            sprite.state = sprite.state === State.RIGHT ? State.LEFT : State.RIGHT;
            break;

        case SpriteID.BAT:
            sprite.state = sprite.state === State.RIGHT_BAT ? State.LEFT_BAT : State.RIGHT_BAT;
            break;

        case SpriteID.ORC:
            sprite.state = sprite.state === State.ORC_DOWNRUN ? State.ORC_UPRUN : State.ORC_DOWNRUN;
            break;
        case SpriteID.SKULL1:
            sprite.state = sprite.state === State.DOWN_SKULLWALK ? State.UP_SKULLWALK: State.DOWN_SKULLWALK;
            break;
    }
}
function updateDirectionRandom(sprite)
{
    //Incrementamos el tiempo para cambio de direccion
    sprite.directionChangeCounter += globals.deltaTime;

    if (sprite.directionChangeCounter > sprite.maxTimeToChangeDirection)
        {
            //Reseteamos el contador
            sprite.directionChangeCounter = 0;

            //Actualizamos el tiempo de cambio de direccion aleatoriamente, entre 1 y 8 segundos
            sprite.maxTimeToChangeDirection = Math.floor(Math.random() * 8) + 1;

            //Cambiamos la direccion
            // swapDirection(sprite);
        }
}


export function updateAnimationFrames(sprite) {

    // Handle animations based on the mapped animation state
    // switch (sprite.state) {
    //     case State.UP_STILL:
    //     case State.LEFT_STILL:
    //     case State.DOWN_STILL:
        // case State.RIGHT_ATTACK:
        //     sprite.frames.framesCounter = 1;
        //     sprite.frames.framesChangeCounter = 0;
        //     break;
        // default:
            // Increment the frame change counter
            sprite.frames.framesChangeCounter++;
        

            // Change frame when the frame change counter reaches the animation speed
            if (sprite.frames.framesChangeCounter === sprite.frames.speed) {
                // Change frame and reset the frame change counter
                sprite.frames.framesCounter++;
                sprite.frames.framesChangeCounter = 0;
            }

            // If we've reached the maximum frames, reset the counter (circular animation)
            if (sprite.frames.framesCounter === sprite.frames.framesPerState) {
                sprite.frames.framesCounter = 0;
            }
        // }



    }
// }

// }
function calculateCollisionWithBorders(sprite) {
    let isCollision = false;

    if (sprite.xPos + sprite.imageSet.xOffset < globals.camera.x)
    {
        sprite.xPos = globals.camera.x;
        isCollision = true;
    }
    // Check for horizontal collision (consider camera position)
    // if (sprite.xPos + sprite.imageSet.xSize > globals.camera.x + (globals.canvas.width) || sprite.xPos < globals.camera.x) {
    //     isCollision = true;
    // }

    // // Check for vertical collision (consider camera position)
    // if (sprite.yPos + sprite.imageSet.ySize > globals.camera.y + 2*(globals.canvas.height)  || sprite.yPos < globals.camera.y) {
    //     isCollision = true;
    // }

    return isCollision;
}


function updatePlayer(sprite){

    readKeyboardAndAssignState(sprite);
    
    const diagonalSpeed = sprite.physics.vLimit / Math.SQRT2; // Adjust speed for diagonal movement

    // sprite.state = State.RIGHT;
        
//   Maquina de estdos del pirata
    switch (sprite.state)
    {   
        case State.UP:
            sprite.physics.vx = 0;
            sprite.physics.vy = -sprite.physics.vLimit;
            break;
        case State.DOWN:
            sprite.physics.vx = 0;
            sprite.physics.vy = sprite.physics.vLimit;
            break;
        case State.RIGHT:
        //si se mueve a la derecha asignamos velocidad en x posiiva
            sprite.physics.vx = sprite.physics.vLimit;
            sprite.physics.vy = 0;
            break;
    
        case State.LEFT:
        //Si se mueve a la izquierda asignamos velocidad en X negativa
            sprite.physics.vx = -sprite.physics.vLimit;
            sprite.physics.vy = 0;
            break;
        // case State.RIGHT_STILL:
        //     break;
        case State.UP_LEFT:
            sprite.physics.vx = -diagonalSpeed;
            sprite.physics.vy = -diagonalSpeed;
            break;
        case State.DOWN_LEFT:
            sprite.physics.vx = -diagonalSpeed;
            sprite.physics.vy = diagonalSpeed;
            break;

        case State.UP_RIGHT:
            sprite.physics.vx = diagonalSpeed;
            sprite.physics.vy = -diagonalSpeed;
            break;

        case State.DOWN_RIGHT:
            sprite.physics.vx = diagonalSpeed;
            sprite.physics.vy = diagonalSpeed;
            break;

        default:
           sprite.physics.vx = 0;
           sprite.physics.vy = 0;
    }


    
// Calculamos distancia que se mueve (X = X - Vt)
    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    // if (sprite.isCollidingWithPlayer)
    //     {
    //         //Si hay colision reducimos la vida
    //         globals.life--;

    //     }

    updateAnimationFrames(sprite);

    


    // //Cambio de direccion aleatoria
    // updateDirectionRandom(sprite);

    // //Calculamos colision con los borders de la pantalla
    // const isCollision = calculateCollisionWithBorders(sprite);
    // if (isCollision)
    // {
    //     swapDirection(sprite);
    // }
}
    
    
    // function updatePlayer(sprite) {

    //     sprite.xPos = 290;
    //     sprite.yPos = 180;

    //     // Update the sprite's state (e.g., still or moving) - assuming idle animation starts from a still state
    //     sprite.frames.framesCounter++;
        
    //     // Loop the animation frames if needed
    //     if (sprite.framesCounter >= sprite.frames) {
    //         sprite.frames.framesCounter = 0; // Reset to the first frame
    //     }
    
    //     // Ensure the sprite does not move off-screen
    //     // sprite.xPos = Math.max(0, Math.min(sprite.xPos, globals.canvas.width - sprite.imageSet.xSize));
    //     // sprite.yPos = Math.max(0, Math.min(sprite.yPos, globals.canvas.height - sprite.imageSet.ySize));
    // }
    

    function updateSprites(){
    
        for (let i = 0; i < globals.sprites.length; ++i)
            {
            const sprite = globals.sprites[i];
            updateSprite(sprite);
            }
    }
    function updateSprite(sprite){
    
        const type = sprite.id;
        switch (type){
            //caso del jugador
            case SpriteID.PLAYER:
                updatePlayer(sprite);
                break;
    
            //Caso del SKULL1
            case SpriteID.SKULL1:
                updateSKULL1(sprite);
                // updateSkullFree(sprite)
                break;
            //Caso del SKULL1
            case SpriteID.ORC:       
                updateORC(sprite);
                break;
            
            case SpriteID.BAT:
                updateBAT(sprite);
                // updateBATosc(sprite);
                break;

            case SpriteID.HEART:
                updateHearts(sprite);
                break;
            
            case SpriteID.BOSS:
                updateBoss(sprite);
                break;
      
            // Caso del enemigo
            default:
                break;
    
        }
    }
  
    function updateHearts(sprite) {
    // Get all heart sprites
    const hearts = globals.sprites.filter(s => s.id === SpriteID.HEART);

    // If there are hearts, get the last one
    if (hearts.length > 0) {
        const lastHeart = hearts[hearts.length - 1];
        console.log(`Animating heart: ${sprite === lastHeart ? 'Last heart' : 'Not last heart'}`);

        // Check if the current sprite is the last heart
        if (sprite === lastHeart && sprite.state === State.BEATING) {
            updateAnimationFrames(sprite);  // Update only the last heart's animation
        }
    }
        
    }
    // function updateSkullFree(sprite)
    // {
    //     sprite.physics.velChangeCounter += globals.deltaTime;

    //     sprite.physics.vx = sprite.physics.velsX[sprite.physics.velPos];
    //     sprite.physics.vy = sprite.physics.velsY[sprite.physics.velPos];

    //     if (sprite.physics.velChangeCounter > sprite.physics.velChangeCounter)
    //         {
    //             sprite.physics.velChangeCounter = 0;
    //             sprite.physics.velPos++;
    //         }
    //     if (sprite.physics.velPos === sprite.physics.velsX.length)
    //     {
    //         sprite.physics.velPos = 0;
    //     }

    //     sprite.xPos += sprite.physics.vx * globals.deltaTime;
    //     sprite.yPos += sprite.physics.vy * globals.deltaTime;

    //     updateAnimationFrames(sprite);

    // }
    function updateBoss(sprite)
    {
        switch (sprite.state)
        {
        case State.BOSS_LEFTIDLE:
            sprite.physics.vy = 0;
            sprite.physics.vx = 0;

            break;
        
        case State.BOSS_RIGHTIDLE:
            sprite.physics.vy = 0;
            sprite.physics.vx = 0;

            break;

        case State.BOSS_RIGHT:
            sprite.physics.vx = sprite.physics.vLimit;
            break;

        case State.BOSS_LEFT:
            sprite.physics.vx = -sprite.physics.vLimit;

            break;

        case State.BOSS_SPECIAL:
            break;  

            default:
                console.error("Error: State invalid");
        }
        sprite.xPos += sprite.physics.vx * globals.deltaTime;


        updateAnimationFrames(sprite);

    }
    function updateSKULL1(sprite) {
   
        // State machine for the Skull
        switch (sprite.state) {
            case State.DOWN_SKULLWALK:
                // Move down
                sprite.physics.vy = sprite.physics.velsY[sprite.physics.velPos];
                break;
    
            case State.UP_SKULLWALK:
                // Move up
                sprite.physics.vy = -sprite.physics.velsY[sprite.physics.velPos];
                break;
    
            default:
                console.error("Error: State invalid");
        }
    
        // Update velocity change counter
        sprite.physics.velChangeCounter += globals.deltaTime;
    
        // Check if it's time to change velocity
        if (sprite.physics.velChangeCounter > sprite.physics.velChangeValue) {
            sprite.physics.velChangeCounter = 0; // Reset the counter
            sprite.physics.velPos++; // Move to the next velocity in the array
    
            // If we've reached the end of the array, loop back to the start
            if (sprite.physics.velPos === sprite.physics.velsY.length) {
                sprite.physics.velPos = 0;
            }
    
            // Debugging log
            console.log("Velocity changed! New velPos:", sprite.physics.velPos);
        }
    
        // Update position based on velocity
        sprite.yPos += sprite.physics.vy * globals.deltaTime;
    
        // Debugging log
        console.log("Updated yPos:", sprite.yPos);
    
        // Update animation frames
        updateAnimationFrames(sprite);

   // //Cambio de direccion aleatoria
//    updateDirectionRandom(sprite);
   // console.log(sprite.maxTimeToChangeDirection)
   // //Calculamos colision con los borders de la pantalla
//    const isCollision = calculateCollisionWithBorders(sprite);

//    if (sprite.isCollidingWithTopBorder)
//    {
//     //changeLevel
//    }

//    if (sprite.isColligingwithBottomBlock)
//    {
//     swapDirection(sprite);
// }

//    if (sprite.isCollidingWithTopBlock)
//     {
//         swapDirection(sprite);
//     }
//    if (sprite.)
//    if (isCollision)
//    {
//        swapDirection(sprite);
//    }
updateDamage(sprite);
}

   
function updateDamage(sprite) {
    const player = globals.sprites[0];

    // Handle damage mode and blinking
    if (player.modeDAMAGE) {
        // Increment the damage counter for flickering
        globals.invincivilityCounter += globals.deltaTime;

        // Increment the damage mode duration counter
        globals.damageCounter += globals.deltaTime;

        // Check if it's time to toggle visibility (flickering)
        if (globals.damageCounter >= globals.damageInterval) {
            globals.damageCounter = 0; // Reset the flickering counter
            player.isDrawn = !player.isDrawn; // Toggle visibility
            console.log("drawn: " + player.isDrawn);
        }

        // Check if damage mode should end (after 4 seconds)
        if (globals.invincivilityCounter >= 4) {
            globals.damageCounter = 0; // Reset the duration counter
            globals.invincivilityCounter = 0; // Reset the flickering counter
            player.isDrawn = true; // Ensure the player is visible
            player.modeDAMAGE = false; // End damage mode
            console.log("damagemode: " + player.modeDAMAGE);
        }
    }

    // Check for collision with the player
    if (sprite.isCollidingWithPlayer && !player.modeDAMAGE) {
        // Reduce life
        globals.life--;

        // Enter damage mode
        player.modeDAMAGE = true;
        globals.damageCounter = 0; // Reset the duration counter
        globals.invincivilityCounter = 0; // Reset the flickering counter
        console.log("damage: " + player.modeDAMAGE);
    }
}
    
    function updateORC(sprite){

        switch (sprite.state) {       
            case State.ORC_DOWNRUN:
                sprite.physics.vy = sprite.physics.vLimit;
                break;
            case State.ORC_UPRUN:
                sprite.physics.vy = -sprite.physics.vLimit;
                break;
            case State.ORC_IDLE:
                sprite.physics.vy = 0;  // Orc does not move
                break;
            case State.ORC_IDLEUP:
                sprite.physics.vy = 0;
                break;
            default:
                console.error("Error: State invalid");
        }
    
        sprite.yPos += sprite.physics.vy * globals.deltaTime;
        updateAnimationFrames(sprite);

    // //Cambio de direccion aleatoria

    // updateDirectionRandom(sprite);
    // console.log(sprite.maxTimeToChangeDirection)
    // //Calculamos colision con los borders de la pantalla

    // const isCollision = calculateCollisionWithBorders(sprite);
    // if (sprite.isCollidingWithTopBLock)
    // {
    //     swapDirection(sprite);
    //     console.log("orc change: " + sprite.isCollidingWithTopBLock)
        
    // }
    // if (sprite.isCollidingWithBottomBLock)
    //     {
    //         swapDirection(sprite);
            
    //     }
    if (sprite.isCollidingWithPlayer)
        {
            //Si hay colision reducimos la vida
            globals.life--;
            sprite.modeDAMAGE = true;
    


        }
    
    }
    function updateBATosc(sprite)
    {
        const amplitude = 10; // Amplitude of the oscillation

        sprite.physics.vx = +sprite.physics.vLimit;

        sprite.physics.angle += sprite.physics.omega * globals.deltaTime; // Increment angle

        sprite.xPos += sprite.physics.vx * globals.deltaTime;

        sprite.yPos = sprite.physics.yRef + amplitude * Math.sin(sprite.angle); // Apply sine wave

        console.log("amp: " + amplitude)

        console.log("yref: " + sprite.physics.yRef)

        console.log("deltatime: " + globals.deltaTime)

        console.log("deltatime: " + sprite)


        updateAnimationFrames(sprite);

        //  Debugging logs
        console.log("Angle:", sprite.physics.angle);
        console.log("Y Position:", sprite.yPos);
        console.log("X Position:", sprite.xPos);

                console.log("Velocity: " + sprite.physics.vx);
        console.log("X Position: " + sprite.xPos);
        console.log("Y Position: " + sprite.yPos);
    console.log(sprite.maxTimeToChangeDirection)




    }
    
    function updateBAT(sprite) {
    
        // State machine for the Bat
        switch (sprite.state) {
            case State.RIGHT_BAT:
                // Move right
                sprite.physics.vx = sprite.physics.vLimit;
                break;
    
            case State.LEFT_BAT:
                // Move left
                sprite.physics.vx = -sprite.physics.vLimit;
                break;
    
            default:
                console.error("Error: Invalid state");
        }
        const amplitude = 10; // Amplitude of the oscillation

        // Update position based on velocity
        sprite.physics.angle += sprite.physics.omega * globals.deltaTime; // Increment angle

        sprite.xPos += sprite.physics.vx * globals.deltaTime;

        sprite.yPos = sprite.physics.yRef + amplitude *Math.sin(sprite.physics.angle); // Apply sine wave 

        console.log("Angle:" + sprite.physics.angle);
        console.log("Angle:" + sprite.physics.angle);

        console.log("Angle:" + Math.sin(sprite.physics.angle));

        console.log("Y Position:" + sprite.yPos);
        console.log("X Position:" + sprite.xPos);
        console.log("Velocity: " + sprite.physics.vx);



    
        // Oscillatory movement in the Y-axis
        // sprite.physics.angle += sprite.physics.omega * globals.deltaTime; // Increment angle
        // sprite.yPos = sprite.physics.yRef + amplitude * Math.sin(sprite.angle); // Apply sine wave
    
        // Debugging logs
        // console.log("Angle:", sprite.physics.angle);
        // console.log("Y Position:", sprite.yPos);
        // console.log("X Position:", sprite.xPos);
    
        // Update animation frames
        updateAnimationFrames(sprite);
    
        // Debugging logs
    //     console.log("Velocity: " + sprite.physics.vx);
    //     console.log("X Position: " + sprite.xPos);
    //     console.log("Y Position: " + sprite.yPos);
    // console.log(sprite.maxTimeToChangeDirection)
    //Calculamos colision con los borders de la pantalla
    // const isCollision = calculateCollisionWithBorders(sprite);
    // if (isCollision)
    // {
    //     swapDirection(sprite);
    // }
    if (sprite.isCollidingWithPlayer)
        {
            //Si hay colision reducimos la vida
            globals.life--;
            console.log("collision with enemy: " + sprite.isCollidingWithPlayer);


        }
}
    
    function updateLife()
    {
        for (let i = 1; i < globals.sprites.length; ++i)
        {
            const sprite = globals.sprites[i];
            
            if (sprite.isCollidingWithPlayer)
            {
                //Si hay colision reducimos la vida
                globals.life--;

            }

        }
    }
 function updateCamera()
 {
    //Centramos la camara en el player
    const player = globals.sprites[0];

    globals.camera.x = Math.floor(player.xPos) + Math.floor((player.imageSet.xSize - globals.canvas.width)/2);
    globals.camera.y = Math.floor(player.yPos) + Math.floor((player.imageSet.ySize - globals.canvas.height)/2);

 }
