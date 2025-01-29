import globals from "./globals.js";
import { Block, State, Game } from "./constants.js";

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
    detectCollisionBetweenSpriteandWorld();
    // detectCollisionBetweenSpriteandWorld();


    
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
        globals.gameState = Game.GAME_OVER; // Set the game state to GAME_OVER

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

        if (id === obstacleId && id !== 0) {
            isColliding = true;
            console.log("Collision detected on layer:", layerIndex, "with obstacle ID:", obstacleId);
        }
        else if (layerIndex === 0 && id === obstacleId && id === 0) {
                globals.gameState = Game.GAME_OVER; // Set the game state to GAME_OVER
                console.log("Game Over triggered!");
                break;  // Exit the loop early if GAME_OVER condition is met
            }
    }

    return isColliding;  // Return whether any collision was detected
}
//calculo de colision con los bloques del mapa
function detectCollisionBetweenSpriteandWorld()
{
    const orc = globals.sprites[4];

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
    orc.isCollidingWithPlayer = false;
    orc.isCollidingWithTopBLock = false;
    orc.isCollidingWithLeftBlock = false;
    orc.isCollidingWithBottomBlock = false;
    orc.isCollidingWithRightBlock = false;

    const brickSize = globals.level.imageSet.xGridWidth;

    const direction = orc.state;

    let objectTile = [ 
        Block.Darkness,
        Block.pillar_North1,
        Block.pillar_North2,
        Block.Wall_Up,
        Block.Wall_Up2,
        Block.pillar_South,
        Block.pillar_South2,
        Block.wall_Straight2,
        Block.wall_Straight,
        Block.wall_Pilar,
        Block.pilar1,
        Block.pilar12,
        Block.pilar15,
        Block.pilar_16,
        Block.pilar_18,
        Block.pilarS1,
        Block.pilarS2,
        Block.pilarS3,
        Block.pilarS4,
        Block.pilarS5,
        Block.pilarS6,
        Block.openGate,
        Block.openGateRight,
        Block.openGateLeft,
        Block.openGateSouth,
        Block.closeGate,
        Block.gateUpperSteel,
        // Block.coloredFloor,
        // Block.coloredFloorSouth,
        // Block.coloredFloorSouth2,
        Block.gateUpperDSteel,
        Block.gateUpperDWood,
        Block.hole,
        Block.hole1,
        Block.hole2,
        Block.hole3,
        Block.chest,
        // Block.floor1
        // Block.holyStone1,
        // Block.holyStone2,
        // Block.holyStone3,
        Block.holyStone4,
        // Block.holyStone5,
        // Block.holyStone6,
        // Block.holyStone7,
        // Block.holyStone8,
        // Block.holyStone9,
        Block.coloredBlock,
        Block.coloredBlock2,
        Block.chestLayered,
        Block.bloodBlock,
        Block.unkown,
    
        // Layer 2
        Block.ladyNight,
        Block.ladyNight2,
        Block.ladyNight3,
        // Block.bloodBlock2,
        // Block.emptySpace
    ];
     //   Maquina de estdos del pirata
     switch(direction)
     {       
         case State.ORC_DOWNRUN:
            for (let i = 0; i < objectTile.length; i++){
                const obstacleId = objectTile[i];
    
            //lets define colision points 
    
            //Primera colision a la derecha a los pies
    
            yPos = orc.yPos + orc.hitBox.yOffset + orc.hitBox.ySize - 1;
            xPos = orc.xPos + orc.hitBox.xOffset + orc.hitBox.xSize - 1;
    
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
    
    
            //segundo colision a la izquierda a los pies
    
            yPos = orc.yPos + orc.hitBox.yOffset + orc.hitBox.ySize - 1;
            xPos = orc.xPos + orc.hitBox.xOffset;
    
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
                    
                    orc.isCollidingWithBottomBlock = true;
        
        
                    //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                    overlapY = Math.floor(yPos) % brickSize + 1;
    
        
                    orc.yPos = overlapY/4;
    
                }
            }
                break;

         case State.ORC_UPRUN:
            for (let i = 0; i < objectTile.length; i++){
                const obstacleId = objectTile[i];
    
            //lets define colision points 
    
            //Primera colision a la derecha a los pies
    
            yPos = orc.yPos + orc.hitBox.yOffset + orc.hitBox.ySize - 1;
            xPos = orc.xPos + orc.hitBox.xOffset + orc.hitBox.xSize - 1;
    
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
    
    
            //segundo colision a la izquierda a los pies
    
            yPos = orc.yPos + orc.hitBox.yOffset + orc.hitBox.ySize - 1;
            xPos = orc.xPos + orc.hitBox.xOffset;
    
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
                    
                    orc.isCollidingWithTopBlock = true;
        
        
                    //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                    overlapY = Math.floor(yPos) % brickSize + 1;
    
        
                    orc.yPos += overlapY/4;
    
                }
            }
                break;

         default:
             console.error("Error: State invalid");
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
    // const obstacleId1 = Block.pillar_North1
    // const obstacleId2 = Block.pillar_North2
    // const obstacleId3 = Block.Wall_Up
    // const obstacleId4 = Block.Wall_Up2
    // const obstacleId5 = Block.pillar_South
    // const obstacleId6 = Block.pillar_South2
    // const obstacleId7 = Block.wall_Straight2
    // const obstacleId8 = Block.wall_Straight
    // const obstacleId9 = Block.wall_Pilar
    // const obstacleId10 = Block.pilar1
    // const obstacleId11 = Block.pilar12
    // const obstacleId12 = Block.pilar15
    // const obstacleId13 = Block.pilar_16
    // const obstacleId14 = Block.pilar_18
    // const obstacleId15 = Block.pilarS1
    // const obstacleId16 = Block.pilarS2
    // const obstacleId17 = Block.pilarS3
    // const obstacleId18 = Block.pilarS4
    // const obstacleId19 = Block.pilarS5
    // const obstacleId20 = Block.pilarS6
    // const obstacleId21 = Block.openGate
    // const obstacleId22 = Block.openGateRight
    // const obstacleId23 = Block.openGateLeft
    // const obstacleId24 = Block.openGateSouth
    // const obstacleId25 = Block.closeGate
    // const obstacleId26 = Block.gateUpperSteel
    // const obstacleId27 = Block.coloredFloor
    // const obstacleId28 = Block.coloredFloorSouth
    // const obstacleId29 = Block.coloredFloorSouth2
    // const obstacleId31 = Block.gateUpperDSteel
    // const obstacleId32 = Block.gateUpperDWood
    // const obstacleId33 = Block.hole
    // const obstacleId34 = Block.hole1
    // const obstacleId35 = Block.hole2
    // const obstacleId36 = Block.hole3
    // const obstacleId37 = Block.floor1
    // const obstacleId38 = Block.chest
    // holyStone1: 29,
    // holyStone2: 30,
    // holyStone3: 31,
    // holyStone4: 48,
    // holyStone5: 32,
    // holyStone6: 33,
    // holyStone7: 34,
    // holyStone8: 35,
    // holyStone9: 36,
    // coloredBlock: 60,
    // coloredBlock2: 68,
    // chestLayered: 21,
    // bloodBlock: 62,

    // //Layer 2

    // ladyNight: 39,
    // ladyNight2: 38,
    // ladyNight3: 37,
    // bloodBlock: 47,
    // bloodBlock2: 62,
    // emptySpace: 203,

        
    
    // const obstacleId11 = Block.REDFLOOR;

    let objectTile = [ 
        Block.Darkness,
        Block.pillar_North1,
        Block.pillar_North2,
        Block.Wall_Up,
        Block.Wall_Up2,
        Block.pillar_South,
        Block.pillar_South2,
        Block.wall_Straight2,
        Block.wall_Straight,
        Block.wall_Pilar,
        Block.pilar1,
        Block.pilar12,
        Block.pilar15,
        Block.pilar_16,
        Block.pilar_18,
        Block.pilarS1,
        Block.pilarS2,
        Block.pilarS3,
        Block.pilarS4,
        Block.pilarS5,
        Block.pilarS6,
        Block.openGate,
        Block.openGateRight,
        Block.openGateLeft,
        Block.openGateSouth,
        Block.closeGate,
        Block.gateUpperSteel,
        // Block.coloredFloor,
        // Block.coloredFloorSouth,
        // Block.coloredFloorSouth2,
        Block.gateUpperDSteel,
        Block.gateUpperDWood,
        Block.hole,
        Block.hole1,
        Block.hole2,
        Block.hole3,
        Block.chest,
        // Block.floor1
        // Block.holyStone1,
        // Block.holyStone2,
        // Block.holyStone3,
        Block.holyStone4,
        // Block.holyStone5,
        // Block.holyStone6,
        // Block.holyStone7,
        // Block.holyStone8,
        // Block.holyStone9,
        Block.coloredBlock,
        Block.coloredBlock2,
        Block.chestLayered,
        Block.bloodBlock,
        Block.unkown,
    
        // Layer 2
        Block.ladyNight,
        Block.ladyNight2,
        Block.ladyNight3,
        // Block.bloodBlock2,
        // Block.emptySpace
    ];

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
    switch(direction)
    {

        case State.UP:

        for (let i = 0; i < objectTile.length; i++){
            const obstacleId = objectTile[i];

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
                
                player.isCollidingWithTopBlock = true;
    
    
                //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                overlapY = Math.floor(yPos) % brickSize + 1;

    
                player.yPos += overlapY/4;

            }
        }
            break;

        case State.DOWN:

        for (let i = 0; i < objectTile.length; i++){
            const obstacleId = objectTile[i];

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

    
                player.yPos -= overlapY * 1.5;

            }
        }
            break;
            case State.DOWN_RIGHT:
                for (let i = 0; i < objectTile.length; i++) {
                    const obstacleId = objectTile[i];
            
                    // Bottom-right corner
                    xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    isColliding = isCollidingOnPos1;
            
                    if (isColliding) {
                        player.isCollidingWithBottomBlock = true;
                        player.isCollidingWithRightBlock = true;
            
                        // Calculate and apply overlap adjustments
                        overlapY = Math.floor(yPos) % brickSize + 1;
                        overlapX = Math.floor(xPos) % brickSize + 1;
            
                        player.yPos -= overlapY; // Move up to fix vertical overlap
                        player.xPos -= overlapX; // Move left to fix horizontal overlap
                    }
                }
                break;
                case State.DOWN_LEFT:
                    for (let i = 0; i < objectTile.length; i++) {
                        const obstacleId = objectTile[i];
                
                        // Bottom-left corner
                        xPos = player.xPos + player.hitBox.xOffset;
                        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
                
                        isColliding = isCollidingOnPos1;
                
                        if (isColliding) {
                            player.isCollidingWithBottomBlock = true;
                            player.isCollidingWithLeftBlock = true;
                
                            // Calculate and apply overlap adjustments
                            overlapY = Math.floor(yPos) % brickSize + 1;
                            overlapX = Math.floor(xPos) % brickSize + 1;
                
                            player.yPos -= overlapY/4; // Move up to fix vertical overlap
                            player.xPos += 0.075 *overlapX; // Move right to fix horizontal overlap
                        }
                    }
                    break;


            case State.LEFT:
                for (let i = 0; i < objectTile.length; i++) {
                    const obstacleId = objectTile[i];
            
                    // Collision at the bottom-left corner (feet area)
                    xPos = player.xPos + player.hitBox.xOffset;
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    isColliding = isCollidingOnPos3;
            
                    if (isColliding) {
                        player.isCollidingWithLeftBlock = true;
            
                        // Adjust overlap and eliminate it
                        overlapX = Math.floor(xPos) % brickSize + 1; // Adjusting overlap
                        player.xPos += overlapX / 4; // Move player back slightly
                    }
                }
                break;
            
            case State.RIGHT:
                for (let i = 0; i < objectTile.length; i++) {
                    const obstacleId = objectTile[i];
            
                    // Collision at the bottom-right corner (feet area)
                    xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
                    yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
                    isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);
            
                    isColliding = isCollidingOnPos3;
            
                    if (isColliding) {
                        player.isCollidingWithRightBlock = true;
            
                        // Adjust overlap and eliminate it
                        overlapX = Math.floor(xPos) % brickSize + 1; // Adjusting overlap
                        player.xPos -= overlapX / 4; // Move player back slightly
                    }
                }
                break;
                case State.UP_RIGHT:
                    for (let i = 0; i < objectTile.length; i++) {
                        const obstacleId = objectTile[i];
                
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
                    for (let i = 0; i < objectTile.length; i++) {
                        const obstacleId = objectTile[i];
                
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

}