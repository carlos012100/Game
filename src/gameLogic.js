import globals from "./globals.js";
import {Game, State, SpriteID, ParticleState, ParticleID, MAX_HEARTS} from "./constants.js";
import detectCollisions from "./collisions.js";
import { createFireParticle, createFireParticleHeal, initExplotion, initSwordLight, initShining } from './initialize.js';


export default function update(){

    if(globals.timerToInsanity.value <= 0)
        {
            globals.gameState = Game.GAME_OVER;
        }
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
function readKeyboardAndAssignState(sprite) {
    if (!sprite.isPlayerAttacking && !sprite.spriteIsDead) {

        sprite.state = globals.action.moveLeft && globals.action.moveUp ? State.UP_LEFT :
                       globals.action.moveLeft && globals.action.moveDown ? State.DOWN_LEFT :
                       globals.action.moveRight && globals.action.moveUp ? State.UP_RIGHT :
                       globals.action.moveRight && globals.action.moveDown ? State.DOWN_RIGHT :
                       globals.action.moveLeft ? State.LEFT :
                       globals.action.moveRight ? State.RIGHT :
                       globals.action.moveUp ? State.UP :
                       globals.action.moveDown ? State.DOWN :
                       sprite.state === State.UP_LEFT ? State.UP_STILL :
                       sprite.state === State.DOWN_LEFT ? State.DOWN_STILL :
                       sprite.state === State.UP_RIGHT ? State.UP_STILL :
                       sprite.state === State.DOWN_RIGHT ? State.DOWN_STILL :
                       sprite.state === State.LEFT ? State.LEFT_STILL :
                       sprite.state === State.RIGHT ? State.RIGHT_STILL :
                       sprite.state === State.UP ? State.UP_STILL :
                       sprite.state === State.DOWN ? State.DOWN_STILL :
                       sprite.state;
    }

    // **Check Light State FIRST**
    if (globals.sprites[0].lightState) {  
        if (globals.action.attack && !sprite.isPlayerAttacking) {
            sprite.isPlayerAttacking = true;
            sprite.attackTimer = 0;

            // Set Light Attack State
            sprite.state = sprite.state === State.RIGHT || sprite.state === State.RIGHT_STILL ? State.RIGHT_ATTACK2 :
                           sprite.state === State.LEFT || sprite.state === State.LEFT_STILL ? State.LEFT_ATTACK2 :
                           sprite.state === State.UP || sprite.state === State.UP_LEFT || sprite.state === State.UP_RIGHT || sprite.state === State.UP_STILL ? State.UP_ATTACK2 :
                           sprite.state === State.DOWN || sprite.state === State.DOWN_LEFT || sprite.state === State.DOWN_RIGHT || sprite.state === State.DOWN_STILL ? State.DOWN_ATTACK2 :
                           sprite.state;
        globals.manapoints = Math.max(0, globals.manapoints - 20); // Ensure manapoints do not go below 0
                           if (globals.manapoints <= 0) {
                               globals.manapoints = 0;
                               sprite.lightState = false;
                           }
        }

        // **Handle Light Attack Animation**
        if (sprite.isPlayerAttacking) {
            sprite.attackTimer += globals.deltaTime;

            if (sprite.attackTimer >= sprite.attackDuration) {
                sprite.isPlayerAttacking = false;

                // Return to last movement's idle state
                sprite.state = sprite.state === State.RIGHT_ATTACK2 ? State.RIGHT_STILL :
                               sprite.state === State.LEFT_ATTACK2 ? State.LEFT_STILL :
                               sprite.state === State.UP_ATTACK2 ? State.UP_STILL :
                               sprite.state === State.DOWN_ATTACK2 ? State.DOWN_STILL :
                               sprite.state;
            }
        }
        return; // ✅ Prevents the normal attack logic from running
    }

    // **Trigger Normal Attack**
    if (globals.action.attack && !sprite.isPlayerAttacking) {
        sprite.isPlayerAttacking = true;
        sprite.attackTimer = 0;

        // Set Normal Attack State
        sprite.state = sprite.state === State.RIGHT || sprite.state === State.RIGHT_STILL ? State.RIGHT_ATTACK :
                       sprite.state === State.LEFT || sprite.state === State.LEFT_STILL ? State.LEFT_ATTACK :
                       sprite.state === State.UP || sprite.state === State.UP_LEFT || sprite.state === State.UP_RIGHT || sprite.state === State.UP_STILL ? State.UP_ATTACK :
                       sprite.state === State.DOWN || sprite.state === State.DOWN_LEFT || sprite.state === State.DOWN_RIGHT || sprite.state === State.DOWN_STILL ? State.DOWN_ATTACK :
                       sprite.state;
    }

    // **Handle Normal Attack Animation**
    if (sprite.isPlayerAttacking) {
        sprite.attackTimer += globals.deltaTime;

        if (sprite.attackTimer >= sprite.attackDuration) {
            sprite.isPlayerAttacking = false;

            // Return to last movement's idle state
            sprite.state = sprite.state === State.RIGHT_ATTACK ? State.RIGHT_STILL :
                           sprite.state === State.LEFT_ATTACK ? State.LEFT_STILL :
                           sprite.state === State.UP_ATTACK ? State.UP_STILL :
                           sprite.state === State.DOWN_ATTACK ? State.DOWN_STILL :
                           sprite.state;
        }
    }
}

function updateParticles() {
    for (let i = 0; i < globals.particles.length; ++i) {
        const particle = globals.particles[i];

        if (particle.id === ParticleID.FIRE && particle.state === ParticleState.OFF) {
            globals.particles.splice(i, 1);
            i--;
            createFireParticle();
        } else if (particle.id === ParticleID.FIREHEAL && particle.state === ParticleState.OFF) {
            globals.particles.splice(i, 1);
            i--;
        }
        else if (particle.id === ParticleID.BLESSING && particle.state === ParticleState.OFF) {
        // else if (particle.id === ParticleID.BLESSING && particle.state === ParticleState.OFF) {
            globals.particles.splice(i, 1);
            i--;
            if (globals.blessingActive) {  // Only spawn if the effect is still active
                initShining();
            }

        }
        // else if (globals.sprites[6].isCollidingWithPlayer && particle.id === ParticleID.BLESSING && particle.state === ParticleState.ON) 
        //     {
        //         globals.particles.splice(i, 1);
        //         i--;
        //     }
    
        else {
            updateParticle(particle);
        }
    }
}

function updateParticle(particle) {
    const type = particle.id;
    switch (type) {
        case ParticleID.EXPLOTION:
            if (globals.sprites[0].state === State.FAINT) {
                updateExplotionParticle(particle);
            }
            break;
        case ParticleID.FIRE:
            updateFireParticle(particle);
            break;
        case ParticleID.FIREHEAL:
            updateFireParticleHeal(particle);
            break;
        case ParticleID.BLESSING:
            updateBlessingParticle(particle);
            break;
    }
}
function updateBlessingParticle(particle) {
    if (particle.state === ParticleState.ON) {
        // Update the angle to make the particle move in a circle
        particle.physics.angle += 0.05; // Change the angle increment to adjust speed of rotation
        particle.physics.vx = particle.physics.vLimit * Math.cos(particle.physics.angle); // Update X velocity
        particle.physics.vy = particle.physics.vLimit * Math.sin(particle.physics.angle); // Update Y velocity

        // Move the particle based on the circular motion
        particle.xPos += particle.physics.vx * globals.deltaTime;
        particle.yPos += particle.physics.vy * globals.deltaTime;

        // Optionally, fade the particle and check its state
        particle.alpha -= 0.01; // Fade over time
        if (particle.alpha <= 0) {
            particle.state = ParticleState.OFF;  // Turn off the particle when fully faded
        }
        if (globals.sprites[6].isCollidingWithPlayer) {
            globals.blessingActive = false
            particle.state = ParticleState.OFF;
        }

    }
}



// function resetBlessingParticle(particle) {
//     // Reset to spawn position
//     let someSpawnX = 100;
//     let someSpawnY = 100;
//     particle.xPos = someSpawnX;
//     particle.yPos = someSpawnY;

//     // Reset transparency and other properties
//     particle.alpha = 1;
//     particle.fadeCounter = 0;

//     // Randomize new movement
//     particle.physics.vx = (Math.random() - 0.5) * 2;  // Random X velocity
//     particle.physics.vy = (Math.random() - 0.5) * 2;  // Random Y velocity

//     // Set back to ON state to start the cycle again
//     particle.state = ParticleState.ON;
// }

function updateExplotionParticle(particle) {
    particle.fadeCounter += globals.deltaTime;

    switch (particle.state) {
        case ParticleState.ON:
            if (particle.fadeCounter > particle.timeToFade) {
                particle.fadeCounter = 0;
                particle.state = ParticleState.FADE;
            }
            break;
        case ParticleState.FADE:
            particle.alpha -= 0.01;
            if (particle.alpha <= 0) {
                particle.state = ParticleState.OFF;
            }
            break;
        case ParticleState.OFF:
            break;
    }

    particle.xPos += particle.physics.vx * globals.deltaTime;
    particle.yPos += particle.physics.vy * globals.deltaTime;
}


function updateFireParticleHeal(particle) {
    // Increment the fade counter using deltaTime
    particle.fadeCounter += globals.deltaTime;

    switch (particle.state) {
        case ParticleState.ON:
            // Reduce the particle's radius as it "heals"
            particle.radius -= 0.1;

            // Transition from ON to FADE state when fade counter exceeds timeToFade
            if (particle.fadeCounter > particle.timeToFade) {
                particle.fadeCounter = 0; // Reset the fade counter
                particle.state = ParticleState.FADE; // Transition to FADE state
            }
            break;

        case ParticleState.FADE:
            // Gradually reduce alpha for fading effect
            particle.alpha -= 0.3;

            // Transition to OFF state when alpha reaches zero
            if (particle.alpha <= 0) {
                particle.state = ParticleState.OFF; // Particle is off
            }
            break;

        case ParticleState.OFF:
            // The particle is no longer active, nothing to update
            break;
    }

    // Update particle's position based on its velocity
    particle.xPos += particle.physics.vx * globals.deltaTime;
    particle.yPos += particle.physics.vy * globals.deltaTime;
}



function updateFireParticle(particle) {
    if (globals.sprites[0].isCollidingWithHealingPlace === true) {
        particle.state = ParticleState.OFF;
    }
    switch (particle.state) {
        case ParticleState.ON:
            particle.radius -= 0.1;
            if (particle.radius < 2) {
                particle.state = ParticleState.FADE;
            }
            break;
        case ParticleState.FADE:
            particle.alpha -= 0.3;
            if (particle.alpha <= 0) {
                particle.state = ParticleState.OFF;
            }
            break;
        case ParticleState.OFF:
            break;
    }
    particle.xPos += particle.physics.vx * globals.deltaTime;
    particle.yPos += particle.physics.vy * globals.deltaTime;
}

function updateLevelTime()
{
    //Incrementamos el contador de cambio de valor

    globals.timerToInsanity.timeChangeCounter += globals.deltaTime;
    //SI ha pasado el tiempo necesario, cambiamos el valor del timer
    if (globals.timerToInsanity.timeChangeCounter > globals.timerToInsanity.timeChangeValue)
    {
        globals.timerToInsanity.value--;
        //Reseteamos timeChangerCounter
        globals.timerToInsanity.timeChangeCounter = 0;
    }

}

function updateGameTime()
{
    //Incrementamos el contador
    globals.gameTime += globals.deltaTime;
}

function playGame(){
    if (globals.sprites[0].isCollidingWithHealingPlace && !globals.sprites[0].hasHealed) {
        initSwordLight();
        initShining();
        globals.blessingActive = true;  // This controls whether new Blessing particles should spawn
        // globals.sprites[0].hasHealed = true; // Prevents spawning multiple times
    }
    updateSprites();
    updateParticles();
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
function updateAttackHitbox(sprite) {
    switch (sprite.state) {
        case State.UP_ATTACK:
            sprite.activeHitbox = sprite.attackHitbox.up;
            break;
        case State.DOWN_ATTACK:
            sprite.activeHitbox = sprite.attackHitbox.down;
            break;
        case State.LEFT_ATTACK:
            sprite.activeHitbox = sprite.attackHitbox.left;
            break;
        case State.RIGHT_ATTACK:
            sprite.activeHitbox = sprite.attackHitbox.right;
            break;
        case State.UP_ATTACK2:
            sprite.activeLight = sprite.lightHitbox.up;
            break;
        case State.DOWN_ATTACK2:
            sprite.activeLight = sprite.lightHitbox.down;
            break;
        case State.LEFT_ATTACK2:
            sprite.activeLight = sprite.lightHitbox.left;
            break;  
        case State.RIGHT_ATTACK2:
            sprite.activeLight = sprite.lightHitbox.right;
            break;
        default:
            sprite.activeHitbox = null; // No attack hitbox active
            sprite.activeLight = null;
            break;


    }
}


function updatePlayer(sprite) {
    let points = 1000;

    if (globals.score >= globals.highscore) {
        globals.highscore += points; // ✅ Increase highscore by points
    }
    

    updateAttackHitbox(sprite);

    readKeyboardAndAssignState(sprite);

    if( sprite.state !== State.FAINT){

    
    const speed = sprite.physics.vLimit; // Constant speed
    const diagonalSpeed = speed / Math.SQRT2; // Normalized diagonal speed
    
    switch (sprite.state) {   
        case State.UP:
            sprite.physics.vx = 0;
            sprite.physics.vy = -speed;

            break;
    
        case State.DOWN:
            sprite.physics.vx = 0;
            sprite.physics.vy = speed;
            break;
    
        case State.LEFT:
            sprite.physics.vx = -speed;
            sprite.physics.vy = 0;
            break;
    
        case State.RIGHT:
            sprite.physics.vx = speed;
            sprite.physics.vy = 0;
            break;
    
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
    

}

else if (sprite.spriteIsDead && sprite.state === State.FAINT || globals.timerToInsanity.value <= 0) {
    const lastBreaths = 10;

    sprite.breathCount += globals.deltaTime;

    if (sprite.breathCount >= lastBreaths) {
        globals.gameState = Game.GAME_OVER;
    }

    const xDeath = globals.sprites[0].xPos + globals.level.imageSet.xGridWidth;
    const yDeath = globals.sprites[0].yPos + globals.level.imageSet.yGridHeight;
    initExplotion(xDeath, yDeath);
}

    updateLife(sprite);
    resetHealingFlag(sprite);
    


    // if (sprite.isCollidingWithPlayer)
    //     {
    //         //Si hay colision reducimos la vida
    //         globals.life--;

    //     }

    updateAnimationFrames(sprite);

    
    updateDamage(sprite);


    // //Cambio de direccion aleatoria
    // updateDirectionRandom(sprite);

    // //Calculamos colision con los borders de la pantalla
    // const isCollision = calculateCollisionWithBorders(sprite);
    // if (isCollision)
    // {
    //     swapDirection(sprite);
    // }

}
    

function updateSprites() {
    for (let i = 1; i < globals.sprites.length; ++i) { // Start from 1 to skip player
        const sprite = globals.sprites[i];

        // If sprite is dead, remove it immediately
        if (sprite.spriteIsDead) {
            globals.sprites.splice(i, 1);
            i--; // Adjust index to avoid skipping next element
            continue;
        }

        // Otherwise, update normally
        updateSprite(sprite);
    }

    // Ensure player (index 0) is always updated
    updateSprite(globals.sprites[0]);
}

    function updateSprite(sprite){
    
        const type = sprite.id;
        switch (type){
            //caso del jugador
            case SpriteID.PLAYER:
                updatePlayer(sprite);
                break;
    
            //Caso del SKULL1
            // case "Reaper":
            //     updateSKULL1(sprite);
            //     break;
            // case "Bonecrusher":
            //     updateSKULL1(sprite);
            //     break;
            // case "Ghoul":
            //     updateSKULL1(sprite);
            //     break;
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

            case SpriteID.SCRAP_METAL:
                updateJunk(sprite);
                break;
      
            // Caso del enemigo
            default:
                break;
    
        }
    }
   function updateJunk(sprite)
   {
    // if (globals.junktaken)
    // {
    //     globals.junk += 1;
    //     globals.junktaken = false;
    // }
    if (sprite.isCollidingWithPlayer) {  
        globals.junktaken = true; // Mark it first before deleting
        
        // Remove the junk from the game
        const index = globals.sprites.indexOf(sprite);
        if (index !== -1) {
            globals.sprites.splice(index, 1);
        }
    }
    
            if (globals.junktaken)
            {
                globals.junk += 1;
                globals.junktaken = false;
            }
    
   }
  
    function updateHearts(sprite) {
    // Get all heart sprites
    const hearts = globals.sprites.filter(s => s.id === SpriteID.HEART);

    // If there are hearts, get the last one
    if (hearts.length > 0) {
        const lastHeart = hearts[hearts.length - 1];


        // Check if the current sprite is the last heart
        if (sprite === lastHeart && sprite.state === State.BEATING) {
            updateAnimationFrames(sprite);  // Update only the last heart's animation
        }
    }
        
    }

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
        updateDamage(sprite);


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
         // Apply unique behavior based on the SKULL's name
    switch (sprite.name) {
        case "Reaper":
            if(globals.sanity <= 60){
                sprite.physics.vy *= 2; // Reaper moves faster
            }
            break;
        case "Bonecrusher":
            sprite.physics.vx *= 0.8; // Bonecrusher moves slower
            break;
        case "Ghoul":
            sprite.physics.velChangeValue = 0.5; // Ghoul changes direction more often
            break;
        default:
            break; // Default behavior for normal SKULL1
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
    
    
        }
    
        // Update position based on velocity
        sprite.yPos += sprite.physics.vy * globals.deltaTime;
    

    
        // Update animation frames
        updateAnimationFrames(sprite);
        updateDirectionRandom(sprite);

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
// if (sprite.isCollidingWithAttack)
// {
//     sprite.life--;
//     console.log("attack sprite: " + sprite.isCollidingWithAttack)
// }
updateDamage(sprite);
}

   

function updateDamage(sprite) {
    
    const player = globals.sprites[0]; // Assuming the player is the first sprite

    // Handle damage mode and blinking for the player
    if (player.modeDAMAGE) {
        // Increment the damage counter for flickering
        player.damageCounter += globals.deltaTime;
      // Increment the damage mode duration counter only once per frame
    if (!player.hasIncrementedThisFrame) {
        player.damageCounter += globals.deltaTime;

        player.invincivilityCounter += globals.deltaTime;
        player.hasIncrementedThisFrame = true; // Mark as incremented
    }

        // Check if it's time to toggle visibility (flickering)
        if (player.damageCounter >= player.damageInterval) {
            player.damageCounter = 0; // Reset the flickering counter
            player.isDrawn = !player.isDrawn; // Toggle visibility
        }

        // Check if damage mode should end (after 4 seconds)
        if (player.invincivilityCounter >= player.invincivility) {
            player.invincivilityCounter = 0; // Reset the duration counter
            player.isDrawn = true; // Ensure the player is visible
            player.modeDAMAGE = false; // End damage mode
        }
    }

    // Check for collision between the sprite and the player
    if (sprite.isCollidingWithPlayer && !player.modeDAMAGE) {
        // Reduce player's life
        globals.life--;

        if(globals.life == 0)
            {
                player.spriteIsDead = true;

                
            }

        if (player.spriteIsDead){
            player.state = State.FAINT;
        }

        // Enter damage mode for the player
        player.modeDAMAGE = true;
        player.damageCounter = 0; // Reset the flickering counter
        player.InvincivilityCounter = 0; // Reset the duration counter
    }



   // Handle damage mode and blinking for the sprite (e.g., Skull, Orc)
   if (sprite.modeDAMAGE) {
    // Increment the damage counter for flickering
    sprite.damageCounter += globals.deltaTime;

    // Increment the damage mode duration counter
    sprite.invincivilityCounter += globals.deltaTime;

    // Debug logs
    // console.log("Sprite Damage Counter: " + sprite.damageCounter);
    // console.log("Sprite Invincibility Counter: " + sprite.invincivilityCounter);

    // Check if it's time to toggle visibility (flickering)
    if (sprite.damageCounter >= globals.damageInterval) {
        sprite.damageCounter = 0; // Reset the flickering counter
        sprite.isDrawn = !sprite.isDrawn; // Toggle visibility
    }

    // Check if damage mode should end (after 4 seconds)
    if (sprite.invincivilityCounter >= globals.invincivility) {
        sprite.invincivilityCounter = 0; // Reset the duration counter
        sprite.isDrawn = true; // Ensure the sprite is visible
        sprite.modeDAMAGE = false; // End damage mode
    }
}



if (sprite.isCollidingWithAttack && !sprite.modeDAMAGE && sprite.lightState) {
    sprite.life -= 2;
}

else if (sprite.isCollidingWithAttack && !sprite.modeDAMAGE) {
    sprite.life -= 1;
}

if (sprite.isCollidingWithAttack && !sprite.modeDAMAGE) {
    // if (sprite.life === 0) {
    //     globals.score += 100; // Increase score
    //     const index = globals.sprites.indexOf(sprite);
    //     if (index > -1) {
    //         globals.sprites.splice(index, 1); // Remove dead enemy
    //     }
    // }

    // Enter damage mode
    sprite.modeDAMAGE = true;
    sprite.damageCounter = 0;
    sprite.invincivilityCounter = 0;
}

}

    
function updateORC(sprite) {
    // 🔹 Check life before doing anything else
    if (sprite.life <= 0) {
        console.log(`Removing enemy at index: ${globals.sprites.indexOf(sprite)}`);
        
        const index = globals.sprites.indexOf(sprite);
        if (index > -1) {
            globals.sprites.splice(index, 1); // ✅ Remove enemy instantly
        }
        return; // ✅ Stop updating this enemy
    }

    switch (sprite.state) {
        case State.ORC_DOWNRUN:
            sprite.physics.vy = sprite.physics.vLimit;
            break;
        case State.ORC_UPRUN:
            sprite.physics.vy = -sprite.physics.vLimit;
            break;
        case State.ORC_IDLE:
        case State.ORC_IDLEUP:
            sprite.physics.vy = 0;  
            break;
        default:
            console.error("Error: State invalid");
    }

    sprite.yPos += sprite.physics.vy * globals.deltaTime;
    updateAnimationFrames(sprite);
    updateDamage(sprite);
}

    function updateBATosc(sprite)
    {
        const amplitude = 10; // Amplitude of the oscillation

        sprite.physics.vx = +sprite.physics.vLimit;

        sprite.physics.angle += sprite.physics.omega * globals.deltaTime; // Increment angle

        sprite.xPos += sprite.physics.vx * globals.deltaTime;

        sprite.yPos = sprite.physics.yRef + amplitude * Math.sin(sprite.angle); // Apply sine wave




        updateAnimationFrames(sprite);






    }
    function resetHealingFlag(sprite) {
        if (!sprite.isCollidingWithHealingPlace) {
            sprite.hasHealed = false;
        }
    }
    function updateLife(sprite) {
        if (sprite.isCollidingWithHealingPlace && !sprite.hasHealed) {
            globals.life = MAX_HEARTS; // ✅ Fully heal the player
            sprite.hasHealed = true; // ✅ Prevent multiple heals
    
            createFireParticleHeal();
            globals.timerToInsanity.value += 50;
            globals.manapoints += 80;
    
        }
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
    updateDamage(sprite);

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