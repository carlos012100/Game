import globals from "./globals.js";
import { Block, State, Game, SpriteID } from "./constants.js";

// Ensure Block.ladyNight3 is defined in constants.js or define it here if missing
// Example definition if missing:
// const Block = { ladyNight3: 'someValue' };

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
// function calculateCollisionWithBorders(sprite) {
//     let isCollision = false;

//     if (sprite.xPos + sprite.imageSet.xOffset < globals.camera.x)
//     {
//         sprite.xPos = globals.camera.x;
//         isCollision = true;
//     }
//     // Check for horizontal collision (consider camera position)
//     // if (sprite.xPos + sprite.imageSet.xSize > globals.camera.x + (globals.canvas.width) || sprite.xPos < globals.camera.x) {
//     //     isCollision = true;
//     // }

//     // // Check for vertical collision (consider camera position)
//     // if (sprite.yPos + sprite.imageSet.ySize > globals.camera.y + 2*(globals.canvas.height)  || sprite.yPos < globals.camera.y) {
//     //     isCollision = true;
//     // }

//     return isCollision;
// }


function rectIntersect (x1, y1, w1, h1, x2, y2, w2, h2)
{
    console.log("Checking overlap with:", { x1, y1, w1, h1, x2, y2, w2, h2 });

    if (x2 > x1 + w1 || x1 > x2 + w2 || y2 > y1 + h1 || y1 > y2 + h2) {

        console.log("❌ No overlap");

        return false;

    } else {

        console.log("✅ Overlap detected!");

        return true;
    }
}
export default function detectCollisions() {
    // globals.junktaken = false;
    const player = globals.sprites[0];  // Store the player reference

    for (let i = 1; i < globals.sprites.length; ++i) {
        const sprite = globals.sprites[i];

        sprite.isCollidingWithPlayer = false;

        detectCollisionBetweenPlayerAndSprite(sprite);

        

        console.log("Player attacking:", player.isPlayerAttacking);

        if (player.isPlayerAttacking) {
            CollisionAttackSprite(sprite);
        }

        if (player.isPlayerAttacking && player.lightState) {  
            CollisionAttacklight(sprite);
        }

        // Detect collision with sword
        if (sprite.id === SpriteID.SWORDLIGHT) {
            detectCollisionWithSword(sprite);
        }
    }

    // Other world object collision detections
    detectCollisionBetweenPlayerAndObstacles();
    detectCollisionBetweenOrcandWorld();
    detectCollisionBetweenSkullandWorld();
    detectCollisionBetweenBatandWorld();

}


function detectCollisionWithSword(sprite) {
    const player = globals.sprites[0]; // Assuming the player is the first sprite

    // Check if the sword is colliding with the player
    if (sprite.isCollidingWithPlayer) {
        console.log("⚔️ Player collided with the sword!");
        globals.blessingActive = false;  // Disable new Blessing particles
        player.lightState = true;  // enable player light state
        

        // Remove the sword from the game using splice
        const index = globals.sprites.indexOf(sprite);
        if (index !== -1) {
            globals.sprites.splice(index, 1); // Remove sword from array
        }
    }
}



    function CollisionAttackSprite(sprite) {
        // Reset collision data
        sprite.isCollidingWithAttack = false;
    
        const player = globals.sprites[0];
    
        // Ensure player has an active attack hitbox
        if (!player.activeHitbox || !sprite.hitBox) { 
            console.warn("Missing hitbox! Active attack hitbox:", player.activeHitbox, "Enemy hitbox:", sprite.hitBox);
            return; 
        }
    
        // Get player active attack hitbox position & size
        const x1 = player.xPos + player.activeHitbox.xOffset;
        const y1 = player.yPos + player.activeHitbox.yOffset;
        const w1 = player.activeHitbox.xSize;
        const h1 = player.activeHitbox.ySize;
    
        // Get enemy hitbox position & size
        const x2 = sprite.xPos + sprite.hitBox.xOffset;
        const y2 = sprite.yPos + sprite.hitBox.yOffset;
        const w2 = sprite.hitBox.xSize;
        const h2 = sprite.hitBox.ySize;
    
        // Print hitbox values for debugging
        console.log("Player attack hitbox:", { x1, y1, w1, h1 });
        console.log("Enemy hitbox:", { x2, y2, w2, h2 });
    
        // Check for overlap using rectIntersect
        const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);
        if (isOverlap) {
            sprite.isCollidingWithAttack = true;
            console.log("⚔️ Attack hitbox collided with enemy!");
            
            // Add more debug here to ensure knockback is applied
            console.log("Sprite before knockback:", sprite.xPos, sprite.yPos);
        
            // Apply knockback based on the direction of the player
            switch (player.state) {
                case State.UP:
                    sprite.yPos -= 15; // Knock enemy upwards
                    console.log("Knockback UP: " + sprite.yPos);
                    break;
                case State.DOWN:
                    sprite.yPos += 15; // Knock enemy downwards
                    console.log("Knockback DOWN: " + sprite.yPos);
                    break;
                case State.LEFT:
                    sprite.xPos -= 15; // Knock enemy left
                    console.log("Knockback LEFT: " + sprite.xPos);
                    break;
                case State.RIGHT:
                    sprite.xPos += 15; // Knock enemy right
                    console.log("Knockback RIGHT: " + sprite.xPos);
                    break;
            }
        
            console.log("Sprite after knockback:", sprite.xPos, sprite.yPos);
        }
        
    }
    function CollisionAttacklight(sprite) {
        // Reset collision data
        sprite.isCollidingWithAttack = false;
    
        const player = globals.sprites[0];
    
        // Ensure player has an active attack hitbox
        if (!player.activeLight || !sprite.hitBox) { 
            console.warn("Missing hitbox! Active attack hitbox:", player.activeLight, "Enemy hitbox:", sprite.hitBox);
            return; 
        }
    
        // Get player active attack hitbox position & size
        const x1 = player.xPos + player.activeLight.xOffset;
        const y1 = player.yPos + player.activeLight.yOffset;
        const w1 = player.activeLight.xSize;
        const h1 = player.activeLight.ySize;
    
        // Get enemy hitbox position & size
        const x2 = sprite.xPos + sprite.hitBox.xOffset;
        const y2 = sprite.yPos + sprite.hitBox.yOffset;
        const w2 = sprite.hitBox.xSize;
        const h2 = sprite.hitBox.ySize;
    
        // Print hitbox values for debugging
        console.log("Player attack hitbox:", { x1, y1, w1, h1 });
        console.log("Enemy hitbox:", { x2, y2, w2, h2 });
    
        // Check for overlap using rectIntersect
        const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);
        if (isOverlap) {
            sprite.isCollidingWithAttack = true;
            console.log("⚔️ Attack hitbox collided with enemy!");
            
            // Add more debug here to ensure knockback is applied
            console.log("Sprite before knockback:", sprite.xPos, sprite.yPos);
        
            // Apply knockback based on the direction of the player
            switch (player.state) {
                case State.UP:
                    sprite.yPos -= 15; // Knock enemy upwards
                    console.log("Knockback UP: " + sprite.yPos);
                    break;
                case State.DOWN:
                    sprite.yPos += 15; // Knock enemy downwards
                    console.log("Knockback DOWN: " + sprite.yPos);
                    break;
                case State.LEFT:
                    sprite.xPos -= 15; // Knock enemy left
                    console.log("Knockback LEFT: " + sprite.xPos);
                    break;
                case State.RIGHT:
                    sprite.xPos += 15; // Knock enemy right
                    console.log("Knockback RIGHT: " + sprite.xPos);
                    break;
            }
        
            console.log("Sprite after knockback:", sprite.xPos, sprite.yPos);
        }
        
    }
    
    
    
  function detectCollisionBetweenPlayerAndSprite(sprite) {
    // Reset collision data
    sprite.isCollidingWithPlayer = false;

    const player = globals.sprites[0];
    let overlapX;
    let overlapY;

    // Check if player or sprite doesn't have a hitBox and skip collision if not
    if (!player.hitBox || !sprite.hitBox) {
        return; // Skip the collision check for this pair if no hitBox is defined
    }

    // Camera offset
    // const cameraOffsetX = globals.camera.xOffset;
    // const cameraOffsetY = globals.camera.yOffset;

    // Player hitbox coordinates
    const x1 = player.xPos + player.hitBox.xOffset;
    const y1 = player.yPos + player.hitBox.yOffset;
    const w1 = player.hitBox.xSize;
    const h1 = player.hitBox.ySize;

    // Sprite hitbox coordinates
    const x2 = sprite.xPos + sprite.hitBox.xOffset;
    const y2 = sprite.yPos + sprite.hitBox.yOffset;
    const w2 = sprite.hitBox.xSize;
    const h2 = sprite.hitBox.ySize;



    // Check for overlap
    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);

    if (isOverlap) {
        // There is a collision

        sprite.isCollidingWithPlayer = true;

        const direction = player.state;

        switch(direction) {

            case State.UP:
                overlapY =  Math.floor(sprite.yPos) % h2 + 10;
                player.yPos += overlapY;
             
                break;
        
            case State.DOWN:
                overlapY = Math.floor(sprite.yPos) % h2 + 10;
                player.yPos -= overlapY;
                break;
        
            case State.LEFT:
                overlapX = Math.floor(sprite.xPos) % w2 + 10;
                player.xPos += overlapX;
                break;
        
            case State.RIGHT:
                overlapX = Math.floor(sprite.xPos) % w2 + 10;
                player.xPos -= overlapX;
                break;
        
            case State.UP_RIGHT:
                for (let i = 0; i < globals.objectTile.length; i++) {
                    const obstacleId = globals.objectTile[i];
                    // Your logic here
                }
                break;
        
            case State.UP_LEFT:
                for (let i = 0; i < globals.objectTile.length; i++) {
                    const obstacleId = globals.objectTile[i];
                    // Your logic here
                }
                break;
        
            case State.DOWN_RIGHT:
                for (let i = 0; i < globals.objectTile.length; i++) {
                    const obstacleId = globals.objectTile[i];
                    // Your logic here
                }
                break;
        
            case State.DOWN_LEFT:
                for (let i = 0; i < globals.objectTile.length; i++) {
                    const obstacleId = globals.objectTile[i];
                    // Your logic here
                }
                break;
        
            default:
                break;
        }


    }
}
//Make sure you fix or debugg
function getMapTileId(xPos, yPos, layerIndex) {

    const brickSize = globals.level.imageSet.yGridHeight;  // Grid size

    const levelData = globals.level.data;

    const fil = Math.floor(yPos / brickSize);

    const col = Math.floor(xPos / brickSize);

    // Check if the layer, row, and column are within bounds
    if (
        layerIndex < 0 || layerIndex >= levelData.length ||  // Layer check

        fil < 0 || col < 0 || fil >= levelData[layerIndex].length || col >= levelData[layerIndex][0].length  // Row and column check
    ) {
        return null;  // Return null for out-of-bounds positions
    }

    return levelData[layerIndex][fil][col];  // Access the correct layer, row, and column
}


function isCollidingWithObstacleAt(xPos, yPos, obstacleId) {
    let isColliding;  // Default to no collision

    const layerNum = 2;       // Total number of layers to check

    for (let layerIndex = 0; layerIndex < layerNum; layerIndex++) {

        const id = getMapTileId(xPos, yPos, layerIndex);  // Get the tile ID for the specified layer


        if (id === obstacleId && id !== 0) {

            isColliding = true;

        } 
        if (layerIndex === 0 && id === obstacleId && id === 0) {

            // globals.gameState = Game.GAME_OVER; // Set the game state to GAME_OVER
            console.log("Game Over triggered!");
            
            break;  // Exit the loop early if GAME_OVER condition is met
        }
    }

    return isColliding;  // Return whether any collision was detected
}

function detectCollisionBetweenBatandWorld ()
{
      // Loop through all sprites and filter only the orcs
      for (let i = 0; i < globals.sprites.length; i++) {
        const bat = globals.sprites[i];

        if (bat.id !== SpriteID.BAT) {
            continue; 

    }
    
    // Reset collision flags for the current orc
        // bat.isCollidingWithPlayer = false;
        bat.isCollidingWithTopBlock = false;
        bat.isCollidingWithLeftBlock = false;
        bat.isCollidingWithBottomBlock = false;
        bat.isCollidingWithRightBlock = false;

        const brickSize = globals.level.imageSet.xGridWidth;
        const direction = bat.state;
        let xPos, yPos, isCollidingOnPos1, isCollidingOnPos2, isColliding, overlapY, overlapX;

        switch (direction) {

            case State.RIGHT_BAT:
                // updateDirectionRandom(bat);
                for (let j = 0; j < globals.objectTile.length; j++) {
                    const obstacleId = globals.objectTile[j];

                    xPos = bat.xPos + bat.hitBox.xOffset + bat.hitBox.xSize - 1;
                    yPos = bat.yPos + bat.hitBox.yOffset;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = bat.yPos + bat.hitBox.yOffset + bat.hitBox.ySize - 1;
                    xPos = bat.xPos + bat.hitBox.xOffset;
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;

                    if (isColliding) {
                        bat.isCollidingWithRightBlock = true;
                        overlapX = Math.floor(yPos) % brickSize - 10;
                        bat.xPos += overlapX;
                        swapDirection(bat);
                    }
                }
                break;

            case State.LEFT_BAT:
                updateDirectionRandom(bat);
 
                for (let j = 0; j < globals.objectTile.length; j++) {
                    const obstacleId = globals.objectTile[j];

                    yPos = bat.yPos + bat.hitBox.yOffset;
                    xPos = bat.xPos + bat.hitBox.xOffset;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = bat.yPos + bat.hitBox.yOffset + bat.hitBox.ySize - 1;
                    xPos = bat.xPos + bat.hitBox.xOffset;
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;

                    if (isColliding) {
                        bat.isCollidingWithLeftBlock = true;
                        overlapY = Math.floor(yPos) % brickSize + 1;
                        bat.yPos -= overlapY / 4;
                        swapDirection(bat);
                    }
                }
                break;

            default:
                console.error("Error: State invalid for ORC:", bat.state);
        }

        // Update direction randomly for this specific orc
    }
}

function detectCollisionBetweenSkullandWorld ()
{
      // Loop through all sprites and filter only the orcs
      for (let i = 0; i < globals.sprites.length; i++) {
        const skull = globals.sprites[i];

        if (skull.id !== SpriteID.SKULL1) {
            continue; // Skip non-orc sprites
        }

        // Reset collision flags for the current orc
        // skull.isCollidingWithPlayer = false;
        skull.isCollidingWithTopBlock = false;
        skull.isCollidingWithLeftBlock = false;
        skull.isCollidingWithBottomBlock = false;
        skull.isCollidingWithRightBlock = false;

        const brickSize = globals.level.imageSet.xGridWidth;
        const direction = skull.state;
        let xPos, yPos, isCollidingOnPos1, isCollidingOnPos2, isColliding, overlapY;

        switch (direction) {
            // case State.ORC_IDLE:
            //     // Handle idle state (no movement, no collision detection)
            //     // You can add specific logic here if needed
            //     break;

            //     case State.ORC_IDLEUP:
            //         // Handle idle state (no movement, no collision detection)
            //         // You can add specific logic here if needed
            //         break;

            case State.UP_SKULLWALK:
                updateDirectionRandom(skull);

                for (let j = 0; j < globals.objectTile.length; j++) {
                    const obstacleId = globals.objectTile[j];

                    yPos = skull.yPos + skull.hitBox.yOffset + skull.hitBox.ySize - 1;
                    xPos = skull.xPos + skull.hitBox.xOffset + skull.hitBox.xSize - 1;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = skull.yPos + skull.hitBox.yOffset + skull.hitBox.ySize - 1;
                    xPos = skull.xPos + skull.hitBox.xOffset;
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;

                    if (isColliding) {
                        skull.isCollidingWithTopBLock = true;
                        overlapY = Math.floor(yPos) % brickSize + 1;
                        skull.yPos += overlapY;
                        swapDirection(skull);
                    }
                }
                break;

            case State.DOWN_SKULLWALK:
                updateDirectionRandom(skull);
 
                for (let j = 0; j < globals.objectTile.length; j++) {
                    const obstacleId = globals.objectTile[j];

                    yPos = skull.yPos + skull.hitBox.yOffset + skull.hitBox.ySize - 1;
                    xPos = skull.xPos + skull.hitBox.xOffset + skull.hitBox.xSize - 1;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = skull.yPos + skull.hitBox.yOffset + skull.hitBox.ySize - 1;
                    xPos = skull.xPos + skull.hitBox.xOffset;
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;

                    if (isColliding) {
                        skull.isCollidingWithBottomBlock = true;
                        overlapY = Math.floor(yPos) % brickSize + 10;
                        skull.yPos -= overlapY;
                        swapDirection(skull);

                    }
                }
                break;

            default:
                console.error("Error: State invalid for ORC:", skull.state);
        }

        // Update direction randomly for this specific orc
    }
}

//calculo de colision con los bloques del mapa
function detectCollisionBetweenOrcandWorld() {
    // Loop through all sprites and filter only the orcs
    for (let i = 0; i < globals.sprites.length; i++) {
        const orc = globals.sprites[i];

        if (orc.id !== SpriteID.ORC) {
            continue; // Skip non-orc sprites
        }

        // Reset collision flags for the current orc
        // orc.isCollidingWithPlayer = false;
        orc.isCollidingWithTopBlock = false;
        orc.isCollidingWithLeftBlock = false;
        orc.isCollidingWithBottomBlock = false;
        orc.isCollidingWithRightBlock = false;

        const brickSize = globals.level.imageSet.xGridWidth;
        const direction = orc.state;
        let xPos, yPos, isCollidingOnPos1, isCollidingOnPos2, isColliding, overlapY;

        switch (direction) {
            case State.ORC_IDLE:
                // Handle idle state (no movement, no collision detection)
                // You can add specific logic here if needed
                break;

                case State.ORC_IDLEUP:
                    // Handle idle state (no movement, no collision detection)
                    // You can add specific logic here if needed
                    break;

            case State.ORC_DOWNRUN:
                // updateDirectionRandom(orc);

                for (let j = 0; j < globals.objectTile.length; j++) {
                    const obstacleId = globals.objectTile[j];

                    yPos = orc.yPos + orc.hitBox.yOffset + orc.hitBox.ySize - 1;
                    xPos = orc.xPos + orc.hitBox.xOffset + orc.hitBox.xSize - 1;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = orc.yPos + orc.hitBox.yOffset + orc.hitBox.ySize - 1;
                    xPos = orc.xPos + orc.hitBox.xOffset;
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;

                    if (isColliding) {
                        orc.isCollidingWithBottomBlock = true;
                        overlapY = Math.floor(yPos) % brickSize + 1;
                        orc.yPos -= overlapY;
                        swapDirection(orc);
                    }
                }
                break;

            case State.ORC_UPRUN:
                // updateDirectionRandom(orc);

                for (let j = 0; j < globals.objectTile.length; j++) {
                    const obstacleId = globals.objectTile[j];

                    yPos = orc.yPos + orc.hitBox.yOffset;
                    xPos = orc.xPos + orc.hitBox.xOffset + orc.hitBox.xSize - 1;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = orc.yPos + orc.hitBox.yOffset;
                    xPos = orc.xPos + orc.hitBox.xOffset;
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;

                    if (isColliding) {
                        orc.isCollidingWithTopBlock = true;
                        overlapY = Math.floor(yPos) % brickSize + 1;
                        orc.yPos += overlapY / 4;
                        swapDirection(orc);
                    }
                }
                break;

            default:
                console.error("Error: State invalid for ORC:", orc.state);
        }

        // Update direction randomly for this specific orc
    }
}
function  detectCollisionBetweenPlayerAndObstacles()
{
    const player = globals.sprites[0];

    player.isCollidingWithPlayer = false;
    player.isCollidingWithTopBLock = false;
    player.isCollidingWithLeftBlock = false;
    player.isCollidingWithBottomBlock = false;
    player.isCollidingWithRightBlock = false;



    //Variables to use
    let xPos;
    let yPos;
    let isCollidingOnPos1;
    let isCollidingOnPos2;
    let isCollidingOnPos3;
    let isCollidingOnPos4;
    let IscollidingOnPosMid;
    let IscollidingOnPosMidBack;
    let isColliding;
    let overlapY;
    let overlapX;

    const brickSize = globals.level.imageSet.xGridWidth;

    const direction = player.state;



    switch(direction)
    {

        case State.UP:

        for (let i = 0; i < globals.objectTile.length; i++){
            const obstacleId = globals.objectTile[i];

        yPos = player.yPos + player.hitBox.yOffset;
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        yPos = player.yPos + player.hitBox.yOffset;
        xPos = player.xPos + player.hitBox.xOffset;

        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

    
        isColliding = isCollidingOnPos1 || isCollidingOnPos2;

        if (isColliding)
            {
       
                if(obstacleId === Block.holyStone4)
                    {
                        player.isCollidingWithHealingPlace = true;
                        console.log("Healing place detected!" + player.isCollidingWithHealingPlace);
                    }
                    // else if (!player.isCollidingWithHealingPlace) {
                    //     player.isCollidingWithHealingPlace = false;  // Only reset if it was never `true`
                    // }
                player.isCollidingWithTopBlock = true;
                // const id = getMapTileId(xPos, yPos, layerIndex);  // Get the tile ID for the specified laye
                //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                overlapY = brickSize - (yPos % brickSize);
                if(overlapY === brickSize) 
                    overlapY = 0;
                player.yPos += overlapY;

            }

        }
            break;

        case State.DOWN:

        for (let i = 0; i < globals.objectTile.length; i++){
            const obstacleId = globals.objectTile[i];

        //lets define colision points 

        //Primera colision a la derecha a los pies

        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        //segundo colision a la izquierda a los pies

        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        xPos = player.xPos + player.hitBox.xOffset;

        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

 
    
        isColliding = isCollidingOnPos1 || isCollidingOnPos2;

        if (isColliding)
            {
                
                player.isCollidingWithBottomBlock = true;
    
    
                //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                overlapY = Math.floor(yPos) % brickSize + 1;

    
                player.yPos -= overlapY;
                player.physics.vy = 0;


            }
        }
            break;
 

                    case State.LEFT:
                        for (let i = 0; i < globals.objectTile.length; i++){
                            const obstacleId = globals.objectTile[i];
                    
                            xPos = player.xPos + player.hitBox.xOffset;
                            yPos = player.yPos + player.hitBox.yOffset;
                            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                            //Collision at the center left (chest area)
                            xPos = player.xPos + player.hitBox.xOffset; // Fix: No +1 here
                            yPos = player.yPos + player.hitBox.yOffset + brickSize;
                            isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                            // Collision at the bottom-left corner (feet area)
                            xPos = player.xPos + player.hitBox.xOffset; // Fix: No +1 here
                            yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                            isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                        

                
                            isColliding = isCollidingOnPos2 || isCollidingOnPos1;;
                            // || isCollidingOnPos2 || isCollidingOnPos3;
                    
                            if (isColliding) {
                                player.isCollidingWithLeftBlock = true;
                    
                                // Adjust overlap and eliminate it
                                overlapX = brickSize - (xPos % brickSize);
                                if (overlapX === brickSize)
                                    overlapX = 0;
                                player.xPos += overlapX;
           
                            }
                        }
                        break;
            
            case State.RIGHT:
                for (let i = 0; i < globals.objectTile.length; i++){
                    
                    const obstacleId = globals.objectTile[i];
            
                    // Collision at the bottom-right corner (feet area)
                    xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
            
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    isColliding = isCollidingOnPos3 || isCollidingOnPos1;
            
                    if (isColliding) {
                        player.isCollidingWithRightBlock = true;
            
                        // Adjust overlap and eliminate it
                        overlapX = Math.floor(xPos) % brickSize + 1; // Adjusting overlap
                        player.xPos -= overlapX ; // Move player back slightly
                        player.physics.vx =  - 1;

                    }
                }
                break;

        default: 
            //Resto de estados. a Rellenar
                break;
    

        }
    // 6 ---------------------1
    //  ----------------------
    //  ----------------------
    // 5----------------------2
    //  ----------------------
    //  ----------------------
    // 4----------------------3

    // let overlapX;
    // let overlapY;

    //calculamos colisiones en los 4 puntos
if (player.physics.vx > 0) {
    for (let i = 0; i < globals.objectTile.length; i++) {
        const obstacleId = globals.objectTile[i];


        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        let isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos4) {
            overlapY = (Math.floor(yPos) % brickSize) + 1;
            overlapX = (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos -= overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                    player.physics.vy = 0;
                } else if (player.physics.vy < 0) {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Bottom-Right Corner (3)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        let isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos3) {
            overlapY = (Math.floor(yPos) % brickSize) + 1;
            overlapX = (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos -= overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                    player.physics.vy = 0;
                } else if (player.physics.vy < 0) {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Top-Left Corner (6)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset;
        let isCollidingOnPos6 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos6) {
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            overlapX = (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos -= overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                } else {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Top-Right Corner (1)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset;
        let isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos1) {
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            overlapX = (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos -= overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                } else {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }
    }
}
if (player.physics.vx < 0) 
{
    for (let i = 0; i < globals.objectTile.length; i++) {
        const obstacleId = globals.objectTile[i];

        // Bottom-Left Corner (4)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        let isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos4) {
            overlapY = (Math.floor(yPos) % brickSize) + 1;
            overlapX = brickSize - (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                    player.physics.vy = 0;
                } else if (player.physics.vy < 0) {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Bottom-Right Corner (3)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        let isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos3) {
            overlapY = (Math.floor(yPos) % brickSize) + 1;
            overlapX = (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                    player.physics.vy = 0;
                } else if (player.physics.vy < 0) {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Top-Left Corner (6)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset;
        let isCollidingOnPos6 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos6) {
            overlapY = brickSize - Math.floor(yPos) % brickSize + 1;
            overlapX = brickSize - (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                } else {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Top-Right Corner (1)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset;
        let isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos1) {
            overlapY = brickSize - Math.floor(yPos) % brickSize + 1;
            overlapX = brickSize - (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                } else {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }
    


        // Bottom-Left Corner (4)
    
        xPos = player.xPos + player.hitBox.xOffset;
        
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;

        isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos4) {
            overlapY = (Math.floor(yPos) % brickSize) + 1;

            overlapX = brickSize - (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {

                player.xPos += overlapX;

                player.physics.vx = 0;
            } 
            else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;

                    player.physics.vy = 0;
                } 
                else if (player.physics.vy < 0) {
                    player.yPos += overlapY;

                    player.physics.vy = 0;
                }
            }
        }

        // Top-Left Corner (6)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos6 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos6) {
            overlapY = brickSize - Math.floor(yPos) % brickSize;
            overlapX = brickSize - (Math.floor(xPos) % brickSize);

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                } else {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Bottom-Right Corner (3)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos3) {
            overlapY = (Math.floor(yPos) % brickSize) + 1;
            overlapX = (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                    player.physics.vy = 0;
                } else if (player.physics.vy < 0) {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }

        // Top-Right Corner (1)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        if (isCollidingOnPos1) {
            overlapY = Math.floor(yPos) % brickSize + 1;
            overlapX = brickSize - (Math.floor(xPos) % brickSize) + 1;

            if (overlapX <= overlapY) {
                player.xPos += overlapX;
                player.physics.vx = 0;
            } else {
                if (player.physics.vy > 0) {
                    player.yPos -= overlapY;
                } else {
                    player.yPos += overlapY;
                    player.physics.vy = 0;
                }
            }
        }
    }
}



}
