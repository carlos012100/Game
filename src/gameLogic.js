import globals from "./globals.js";
import {Game, State, SpriteID} from "./constants.js";
import detectCollisions from "./collisions.js";
import {createFire} from "./initialize.js";


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
    updateGameTime();
    updateLevelTime();
    detectCollisions();
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
            swapDirection(sprite);
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

    // Check for horizontal collision (consider camera position)
    if (sprite.xPos + sprite.imageSet.xSize > globals.camera.x + globals.canvas.width || sprite.xPos < globals.camera.x) {
        isCollision = true;
    }

    // Check for vertical collision (consider camera position)
    if (sprite.yPos + sprite.imageSet.ySize > globals.camera.y + globals.canvas.height/2 || sprite.yPos < globals.camera.y) {
        isCollision = true;
    }

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
                break;
            //Caso del SKULL1
            case SpriteID.ORC:       

                updateORC(sprite);
                break;
            
            case SpriteID.BAT:
                updateBAT(sprite);
                break;

            case SpriteID.HEART:
                updateHearts(sprite);
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
    function updateSKULL1(sprite){
    
        //  Maquina de estdos del pirata
       switch (sprite.state)
       {       
           case State.DOWN_SKULLWALK:
   //si se mueve a la derecha asignamos velocidad en x posiiva
               sprite.physics.vy = sprite.physics.vLimit;
               break;

           case State.UP_SKULLWALK:
           //Si se mueve a la izquierda asignamos velocidad en X negativa
               sprite.physics.vy = -sprite.physics.vLimit;
               break;

           default:
               console.error("Error: State invalid");
       }

   // Calculamos distancia que se mueve (X = X - Vt)
   sprite.yPos += sprite.physics.vy * globals.deltaTime;
   // sprite.xPos = 20;
   // sprite.yPos = 200;

   // sprite.state = State.ORC_DOWNRUN;

//    sprite.frames.framesCounter = 0;



   updateAnimationFrames(sprite);
       

   // //Cambio de direccion aleatoria
   updateDirectionRandom(sprite);
   // console.log(sprite.maxTimeToChangeDirection)
   // //Calculamos colision con los borders de la pantalla
   const isCollision = calculateCollisionWithBorders(sprite);
   if (isCollision)
   {
       swapDirection(sprite);
   }

//    if (sprite.isCollidingWithPlayer)
//     {
//         //Si hay colision reducimos la vida
//         globals.life--;

//     }
   
       }

    
    function updateORC(sprite){

        //   Maquina de estdos del pirata
        switch (sprite.state)
        {       
            case State.ORC_DOWNRUN:
    //si se mueve a la derecha asignamos velocidad en x posiiva
                sprite.physics.vy = sprite.physics.vLimit;
                break;

            case State.ORC_UPRUN:
            //Si se mueve a la izquierda asignamos velocidad en X negativa
                sprite.physics.vy = sprite.physics.vLimit;
                break;

            default:
                console.error("Error: State invalid");
        }


    // // Calculamos distancia que se mueve (X = X - Vt)
    sprite.yPos += sprite.physics.vy * globals.deltaTime;
    // sprite.xPos = 20;
    // sprite.yPos = 200;

    // sprite.state = State.ORC_DOWNRUN;

    // sprite.frames.framesCounter = 0;

    //sprite.frames.framesCounter = this needs to change as the frames goes. remember to include it as the for loop advances. 



    updateAnimationFrames(sprite);
        

    // //Cambio de direccion aleatoria

    updateDirectionRandom(sprite);
    // console.log(sprite.maxTimeToChangeDirection)
    // //Calculamos colision con los borders de la pantalla

    // const isCollision = calculateCollisionWithBorders(sprite);
    // if (isCollision)
    // {
    //     swapDirection(sprite);
    // }
    // if (sprite.isCollidingWithPlayer)
    //     {
    //         //Si hay colision reducimos la vida
    //         globals.life--;

    //     }
    
    }

    
    function updateBAT(sprite){

    //     //   Maquina de estdos del pirata
        switch (sprite.state)
        {       
            case State.RIGHT_BAT:

    //si se mueve a la derecha asignamos velocidad en x posiiva
                sprite.physics.vx = sprite.physics.vLimit;
                console.log("velocity: " + sprite.physics.vx)
                break;

            case State.LEFT_BAT:
            //Si se mueve a la izquierda asignamos velocidad en X negativa
                sprite.physics.vx = -sprite.physics.vLimit;

                break;

            default:
                console.error("Error: State invalid");
        }

    // Calculamos distancia que se mueve (X = X - Vt)
    sprite.xPos += sprite.physics.vx * globals.deltaTime;

    updateAnimationFrames(sprite);

    //Cambio de direccion aleatoria
    updateDirectionRandom(sprite);
    console.log(sprite.maxTimeToChangeDirection)
    //Calculamos colision con los borders de la pantalla
    const isCollision = calculateCollisionWithBorders(sprite);
    if (isCollision)
    {
        swapDirection(sprite);
    }
    // if (sprite.isCollidingWithPlayer)
    //     {
    //         //Si hay colision reducimos la vida
    //         globals.life--;

    //     }
    }
    
    // function updateLife()
    // {
    //     for (let i = 1; i < globals.sprites.length; ++i)
    //     {
    //         const sprite = globals.sprites[i];
            
    //         if (sprite.isCollidingWithPlayer)
    //         {
    //             //Si hay colision reducimos la vida
    //             globals.life--;

    //         }

    //     }
    // }
 function updateCamera()
 {
    //Centramos la camara en el player
    const player = globals.sprites[0];

    globals.camera.x = Math.floor(player.xPos) + Math.floor((player.imageSet.xSize - globals.canvas.width)/2);
    globals.camera.y = Math.floor(player.yPos) + Math.floor((player.imageSet.ySize - globals.canvas.height)/2);

 }
