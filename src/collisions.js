import globals from "./globals.js";
import { Block, State, Game, SpriteID } from "./constants.js";
import { Skull } from "./Sprite.js";

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


 //esta funcion calcula si las hitbox hacen colisiones
function rectIntersect (x1, y1, w1, h1, x2, y2, w2, h2)
{
    let isOverlap; 

    //Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2)
    {
        isOverlap = false;
    }
    else 
    {
        isOverlap = true;
    }
    
    return isOverlap;
}
export default function detectCollisions()
{
    //calcula y detecta si hay una colision entre sprites
    for (let i = 1; i < globals.sprites.length; ++i)
    {
        const sprite = globals.sprites[i];
        detectCollisionBetweenPlayerAndSprite(sprite);
    }
    // if (globals.sprites[4])
    // {
    //         detectCollisionBetweenSpriteandWorld();

    // }
    //Calculamos colision del player con los obstucalos del mapa
    detectCollisionBetweenPlayerAndObstacles();
    detectCollisionBetweenOrcandWorld();
    detectCollisionBetweenSkullandWorld ();
    detectCollisionBetweenBatandWorld ();


    
}
function detectCollisionBetweenPlayerAndSprite(sprite)
{
    //Reset collsion date 
    sprite.isCollidingWithPlayer = false; 

    const player = globals.sprites[0];
        // Check if player or sprite doesn't have a hitBox and skip collision if not
        if (!player.hitBox || !sprite.hitBox) {
            return;  // Skip the collision check for this pair if no hitBox is defined
        }

    //Datos del player

    const cameraOffsetX = globals.camera.xOffset;
    const cameraOffsetY = globals.camera.yOffset;
    
    // Apply camera offset when calculating positions
    const x1 = player.xPos + player.hitBox.xOffset - cameraOffsetX;
    const y1 = player.yPos + player.hitBox.yOffset - cameraOffsetY;
    const w1 = player.hitBox.xSize;
    const h1 = player.hitBox.ySize;
    
    const x2 = sprite.xPos + sprite.hitBox.xOffset - cameraOffsetX;
    const y2 = sprite.yPos + sprite.hitBox.yOffset - cameraOffsetY;
    const w2 = sprite.hitBox.xSize;
    const h2 = sprite.hitBox.ySize;
    

    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)

    if (isOverlap)
    {
        //hay colision
        sprite.isCollidingWithPlayer = true;

    }
}
//Devuelve el Ed del tile del mapa para las coordenadas xPos, yPos
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


// function getMapTileId(xPos, yPos) {

//     if (!globals.level || !globals.level.data) {
//         console.error("Level data is not initialized");
//         return null;
//     }

//     const brickSize = globals.level.imageSet.xGridWidth;
//     const levelData = globals.level.data;

//     console.log("xPos:", xPos, "yPos:", yPos);

//     const fil = Math.floor(yPos / brickSize);
//     const col = Math.floor(xPos / brickSize);
    
//     if (!levelData[fil] || levelData[fil][col] === undefined) {
//         console.error("Invalid tile coordinates:", fil, col);
//         return null;
//     }

//     return levelData[fil][col];
// }



function isCollidingWithObstacleAt(xPos, yPos, obstacleId) {
    let isColliding = false;  // Default to no collision
    const layerNum = 2;       // Total number of layers to check

    for (let layerIndex = 0; layerIndex < layerNum; layerIndex++) {
        const id = getMapTileId(xPos, yPos, layerIndex);  // Get the tile ID for the specified layer

        if (id === null) {
            // Out-of-bounds position, no collision
            continue;
        }

        if (id === obstacleId && id !== 0) {
            isColliding = true;
            console.log("Collision detected on layer:", layerIndex, "with obstacle ID:", obstacleId);
        } else if (layerIndex === 0 && id === obstacleId && id === 0 && globals.sprites[0]) {
            globals.gameState = Game.GAME_OVER; // Set the game state to GAME_OVER
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
            continue; // Skip non-orc sprites

    }
    
    // Reset collision flags for the current orc
        bat.isCollidingWithTopBlock = false;
        bat.isCollidingWithPlayer = false;
        bat.isCollidingWithLeftBlock = false;
        bat.isCollidingWithBottomBlock = false;
        bat.isCollidingWithRightBlock = false;

        const brickSize = globals.level.imageSet.xGridWidth;
        const direction = bat.state;
        let xPos, yPos, isCollidingOnPos1, isCollidingOnPos2, isColliding, overlapY, overlapX;

        switch (direction) {
            // case State.ORC_IDLE:
            //     // Handle idle state (no movement, no collision detection)
            //     // You can add specific logic here if needed
            //     break;

            //     case State.ORC_IDLEUP:
            //         // Handle idle state (no movement, no collision detection)
            //         // You can add specific logic here if needed
            //         break;

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
                // updateDirectionRandom(bat);
 
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
        skull.isCollidingWithPlayer = false;
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
        orc.isCollidingWithPlayer = false;
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
    let overlapX
    player.isCollidingWithPlayer = false;
    player.isCollidingWithTopBLock = false;
    player.isCollidingWithLeftBlock = false;
    player.isCollidingWithBottomBlock = false;
    player.isCollidingWithRightBlock = false;
    

    const brickSize = globals.level.imageSet.xGridWidth;

    const direction = player.state;



    switch(direction)
    {

        case State.UP:

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

        //tercer punto de colision a cabeza 

        // yPos = player.yPos + player.hitBox.yOffset;
        // xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        // isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // yPos = player.yPos + player.hitBox.yOffset;
        // xPos = player.xPos + player.hitBox.xOffset;

        // isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

    
        isColliding = isCollidingOnPos1 || isCollidingOnPos2;

        if (isColliding)
            {
                
                player.isCollidingWithTopBlock = true;
    
    
                //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                overlapY = Math.floor(yPos) % brickSize + 1;

    
                player.yPos += overlapY/2;
                player.physics.vy = 0;


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

        //tercer punto de colision a cabeza 

        // yPos = player.yPos + player.hitBox.yOffset;
        // xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        // isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // yPos = player.yPos + player.hitBox.yOffset;
        // xPos = player.xPos + player.hitBox.xOffset;

        // isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

    
        isColliding = isCollidingOnPos1 || isCollidingOnPos2;

        if (isColliding)
            {
                
                player.isCollidingWithBottomBlock = true;
    
    
                //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                overlapY = Math.floor(yPos) % brickSize + 1;

    
                player.yPos -= overlapY/2;
                player.physics.vy = 0;


            }
        }
            break;
            case State.DOWN_RIGHT:
                for (let i = 0; i < globals.objectTile.length; i++){
                    const obstacleId = globals.objectTile[i];
            
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
            
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
            
                    //segundo colision a la izquierda a los pies
            
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    xPos = player.xPos + player.hitBox.xOffset;
            
                    isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    //tercer punto de colision a cabeza 
            
                    // yPos = player.yPos + player.hitBox.yOffset;
                    // xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
            
                    // isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    // yPos = player.yPos + player.hitBox.yOffset;
                    // xPos = player.xPos + player.hitBox.xOffset;
            
                    // isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                
                    isColliding = isCollidingOnPos1 || isCollidingOnPos2;
            
            
                    if (isColliding) {
                        player.isCollidingWithBottomBlock = true;
                        player.isCollidingWithRightBlock = true;
            
                        // Calculate and apply overlap adjustments
                        overlapY = Math.floor(yPos) % brickSize - 1;
                        overlapX = Math.floor(xPos) % brickSize - 1;
            
                        player.yPos -= overlapY/2; // Move up to fix vertical overlap
                        player.xPos -= overlapX/2; // Move left to fix horizontal overlap
                    }
                }
                break;
                case State.DOWN_LEFT:
                    for (let i = 0; i < globals.objectTile.length; i++){
                        const obstacleId = globals.objectTile[i];
                
                        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
                
                        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
                
                
                        //segundo colision a la izquierda a los pies
                
                        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                        xPos = player.xPos + player.hitBox.xOffset;
                
                        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
                
                        isColliding = isCollidingOnPos1 || isCollidingOnPos2;
                
                        if (isColliding) {
                            player.isCollidingWithBottomBlock = true;
                            player.isCollidingWithLeftBlock = true;
                
                            // Calculate and apply overlap adjustments
                            overlapY = Math.floor(yPos) % brickSize + 1;
                            overlapX = Math.floor(xPos) % brickSize  + 1;
                
                            player.yPos -= overlapY/2; // Move up to fix vertical overlap
                            player.xPos += overlapX/2; // Move right to fix horizontal overlap
                        }
                    }
                    break;


            case State.LEFT:
                for (let i = 0; i < globals.objectTile.length; i++){
                    const obstacleId = globals.objectTile[i];
            
                    // Collision at the bottom-left corner (feet area)
                    xPos = player.xPos + player.hitBox.xOffset;
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    isColliding = isCollidingOnPos3;
            
                    if (isColliding) {
                        player.isCollidingWithLeftBlock = true;
            
                        // Adjust overlap and eliminate it
                        overlapX = Math.floor(xPos) % brickSize - 18.; // Adjusting overlap
                        player.xPos += overlapX; // Move player back slightly
                        player.physics.vx = 0;

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
            
                    isColliding = isCollidingOnPos3;
            
                    if (isColliding) {
                        player.isCollidingWithRightBlock = true;
            
                        // Adjust overlap and eliminate it
                        overlapX = Math.floor(xPos) % brickSize + 1; // Adjusting overlap
                        player.xPos -= overlapX ; // Move player back slightly
                        player.physics.vx =  - 1;

                    }
                }
                break;
                case State.UP_RIGHT:
                    for (let i = 0; i < globals.objectTile.length; i++){
                        const obstacleId = globals.objectTile[i];
                
                        // Collision at the top-right corner
                        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
                        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
                
                        isColliding = isCollidingOnPos1;
                
                        if (isColliding) {
                            player.isCollidingWithTopBlock = true;
                            player.isCollidingWithRightBlock = true;
                
                            // Calculate overlap and adjust position to prevent further movement upwards
                            overlapY = Math.floor(yPos) % brickSize + 1;
                            overlapX = Math.floor(xPos) % brickSize + 1;
                            player.yPos += overlapY / 4;
                            player.xPos -= overlapX/4;

                        }
                    }
                    break;
                
                case State.UP_LEFT:
                    for (let i = 0; i < globals.objectTile.length; i++){
                        const obstacleId = globals.objectTile[i];
                
                        // Collision at the top-left corner
                        xPos = player.xPos + player.hitBox.xOffset;
                        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

                
                        isColliding = isCollidingOnPos1
                
                        if (isColliding) {
                            player.isCollidingWithTopBlock = true;
                            player.isCollidingWithLeftBlock = true;
                
                            // Calculate overlap and adjust position to prevent further movement upwards
                            overlapY = Math.floor(yPos) % brickSize + 1;
                            overlapX = Math.floor(xPos) % brickSize + 1;
                            player.yPos += overlapY/ 4;
                            player.xPos += overlapX/4;
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

    // //calculamos colisiones en los 6 puntos

    // if (player.physics.vx > 0) //Movimiento derecha
    // {
    //     //punto 6 
    //     //primera colision en (xPos, yPos)
    //     xPos = player.xPos + player.hitBox.xOffset;
    //     yPos = player.yPos + player.hitBox.yOffset;
    //     isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11); 

    //     if (isCollidingOnPos2) //hay colision en punto 6
    //     {
    //         //Se trata de una esquina. puede haber overLap en X y en Y

    //         //Calculamos overlap solo en Y 

    //         overlapY = brickSize - Math.floor(yPos) % brickSize;

    //         //Colision en eje Y
    //         player.yPos += overlapY
    //         player.physics.vy = 0;
    //     }
    //     //PUnto 4 
    //     //Ultima colision en (xPos, yPos + ySize - 1)
    //     xPos = player.xPos + player.hitBox.xOffset;
    //     yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
    //     isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);

    //     if (isCollidingOnPos4) //Hay colision en punto 4
    //     {
    //         //se trata de una esquina. Puede haber overLap en X y en Y

    //         //Calculamos overlap solo en Y
    //         overlapY = brickSize - Math.floor(yPos) % brickSize + 1;

    //         //Colision en eje Y

    //         player.yPos -= overlapY;
    //         player.isCollidingWithBottomBlock = true;
    //         player.physics.vy = 0;
    //     }
    //     //Punto 2
    //     // ... A completar
    //     xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
    //     yPos = player.yPos + player.hitBox.yOffset + brickSize;

    //     IscollidingOnPosMid = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);

    //     if (IscollidingOnPosMid)
    //     {
    //         overlapX = Math.floor(xPos) % brickSize - 1;

    //         player.xPos -= overlapX;
    //         player.physics.vx = 0;
    //     }


    //     // //Punto 1
    //     // //Vemos si hay colision en (xPos + xSize  - 1, yPos)
    //     xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
    //     yPos = player.yPos + player.hitBox.yOffset;
    //     isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);

    //     if (isCollidingOnPos1) //hay colision en punto 1
    //     {
    //         //Se trata de una esquina. puede haber overLap en X y en Y

    //         //Calculamos overlap en X y en Y con el player
    //         overlapX = Math.floor(xPos) % brickSize + 1;
    //         overlapY = brickSize - Math.floor(yPos) % brickSize;

    //         if (overlapX <= overlapY)
    //         {
    //             //Colision en eje X
    //             player.xPos -= overlapX;
    //             player.physics.vx = 0;

    //         }
    //         else 
    //         {
    //             //colision en eje Y
    //             if (player.physics.vy > 0)
    //             {
    //                 player.yPos -= overlapY;
    //             }
    //             else 
    //             {
    //                 player.yPos += overlapY;
    //                 player.physics.vy = 0;
    //             }

    //         }
    //     }
    
    //     else //Movimiento izquierda (player.physicis.vx < 0)
    //     {
    //         //Punto 1
    //         //Primera colision en (xPos + xSize - 1, yPos)
    //         xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
    //         yPos = player.yPos + player.hitBox.yOffset;
    //         isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);

    //         if (isCollidingOnPos1) //Hay colision en punto 6
    //         {
                
    //         }

    //     }
    //     if (isCollidingOnPos1) //hay colision en punto 6
    //     {
    //         //solo existe overlap en vertical 
    //         //calculamos overla solo en Y 
    //         //Ajustamos vy y isCollidingWithObstacleOnTheBottom si procede
    //     }

    // }
}