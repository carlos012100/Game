import globals from "./globals.js";
import { Block, State } from "./constants.js";

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
    //Calculamos colision del player con los obstucalos del mapa
    detectCollisionBetweenPlayerAndObstacles();

    
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

    const x1 = player.xPos + player.hitBox.xOffset;
    const y1 = player.yPos + player.hitBox.yOffset;
    const w1 = player.hitBox.xSize;
    const h1 = player.hitBox.ySize;

    //Datos de otros sprites

    const x2 = sprite.xPos + sprite.hitBox.xOffset;
    const y2 = sprite.yPos + sprite.hitBox.yOffset;
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
function getMapTileId (xPos, yPos)
{
    const brickSize = globals.level.imageSet.yGridHeight;
    const levelData = globals.level.data;

    const fil = Math.floor(yPos / brickSize);
    const col = Math.floor(xPos / brickSize);

    if (fil < 0 || col < 0 || fil >= levelData.length || col >= levelData[0].length) {
        console.error("Out-of-bounds tile access:", fil, col);
        return null;
    }
    console.log("Tile ID at (", xPos, ",", yPos, "):", levelData[fil][col]);
    console.log("Tile Indices -> Row:", fil, "Column:", col);
    console.log("Tile ID:", levelData[fil]?.[col]);



    return levelData[fil][col];
    

    
    
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



function isCollidingWithObstacleAt (xPos, yPos, obstacleId)
{
    let isColliding;

    const id = getMapTileId(xPos, yPos);


    //Calculamos colision con bloque
    if (id === obstacleId)

        isColliding = true;
    else 
        isColliding = false;
        console.log("Checking collision at tile:", { id, obstacleId });

    return isColliding;
    
}
//calculo de colision con los bloques del mapa
function detectCollisionBetweenPlayerAndObstacles()
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
    let overlap;
    player.isCollidingWithPlayer = false;
    player.isCollidingWithTopBLock = false;
    player.isCollidingWithLeftBlock = false;
    player.isCollidingWithBottomBlock = false;
    player.isCollidingWithRightBlock = false;

    const brickSize = globals.level.imageSet.xGridWidth;

    const direction = player.state;
    //ID del obstaculo 
    // const obstacleId = Block.GATE1;
    // const obstacleId2 = Block.GATE12;
    // const obstacleId3 = Block.GATE2;
    // const obstacleId4 = Block.GATE21;
    // const obstacleId5 = Block.FORT1;
    // const obstacleId6 = Block.FORT2;
    // const obstacleId7 = Block.FORT3;
    // const obstacleId8 = Block.FORT4;
    // const obstacleId9 = Block.FORT5;
    // const obstacleId10 = Block.FORT6;
    const obstacleId11 = Block.REDFLOOR;
    // FORT1: 1,
    // FORT2: 2,
    // FORT3: 13,
    // FORT4: 14,
    // FORT5: 25,
    // FORT6: 26,
    // GATE1: 37,
    // GATE12: 38,
    // GATE2: 49,
    // GATE21: 50,
    let objectTile = [Block.GATE1, Block.GATE2];

    // 6 ---------------------1
    //  ----------------------
    //  ----------------------
    // 5----------------------2
    //  ----------------------
    //  ----------------------
    // 4----------------------3

    let overlapX;
    let overlapY;

    //calculamos colisiones en los 6 puntos

    if (player.physics.vx > 0) //Movimiento derecha
    {
        //punto 6 
        //primera colision en (xPos, yPos)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11); 

        if (isCollidingOnPos2) //hay colision en punto 6
        {
            //Se trata de una esquina. puede haber overLap en X y en Y

            //Calculamos overlap solo en Y 

            overlapY = brickSize - Math.floor(yPos) % brickSize;

            //Colision en eje Y
            player.yPos += overlapY
            player.physics.vy = 0;
        }
        //PUnto 4 
        //Ultima colision en (xPos, yPos + ySize - 1)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
        isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);

        if (isCollidingOnPos4) //Hay colision en punto 4
        {
            //se trata de una esquina. Puede haber overLap en X y en Y

            //Calculamos overlap solo en Y
            overlapY = brickSize - Math.floor(yPos) % brickSize + 1;

            //Colision en eje Y

            player.yPos -= overlapY;
            player.isCollidingWithBottomBlock = true;
            player.physics.vy = 0;
        }
        //Punto 2
        // ... A completar
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset + brickSize;


        //Punto 1
        //Vemos si hay colision en (xPos + xSize  - 1, yPos)
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);

        if (isCollidingOnPos1) //hay colision en punto 1
        {
            //Se trata de una esquina. puede haber overLap en X y en Y

            //Calculamos overlap en X y en Y con el player
            overlapX = Math.floor(xPos) % brickSize + 1;
            overlapY = brickSize - Math.floor(yPos) % brickSize;

            if (overlapX <= overlapY)
            {
                //Colision en eje X
                player.xPos -= overlapX;
                player.physics.vx = 0;

            }
            else 
            {
                player.yPos += overlapY;
                player.physics.vy = 0;
            }
        }
        else //Movimiento izquierda (player.physicis.vx < 0)
        {
            //Punto 1
            //Primera colision en (xPos + xSize - 1, yPos)
            xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
            yPos = player.yPos + player.hitBox.yOffset;
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId11);


        }
        if (isCollidingOnPos1) //hay colision en punto 6
        {
            //solo existe overlap en vertical 
            //calculamos overla solo en Y 
            //Ajustamos vy y isCollidingWithObstacleOnTheBottom si procede
        }

    }
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

        yPos = player.yPos + player.hitBox.yOffset;
        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        yPos = player.yPos + player.hitBox.yOffset;
        xPos = player.xPos + player.hitBox.xOffset;

        isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

    
        isColliding = isCollidingOnPos1 || isCollidingOnPos2;

        if (isColliding)
            {
                
                player.isCollidingWithTopBlock = true;
    
    
                //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                overlap = Math.floor(yPos) % brickSize + 1;

    
                player.yPos += overlap/4;

            }
        }
            break;




        case State.RIGHT:
            for (let i = 0; i < objectTile.length; i++){
                const obstacleId = objectTile[i];
    

        // Primera colision (xPos + xSize -1, yPos)

        // xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        // yPos = player.yPos + player.hitBox.yOffset;
        
        // isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        
        // //Segunda colision

        // xPos = player.xPos + player.hitBox.xOffset;
        // yPos = player.yPos + player.hitBox.yOffset;
        

        // isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Primera colision (xPos + xSize -1, yPos)

        xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        // Segunda colision en (xPos + xSize -1, yPos + brickSize)

        yPos = player.yPos + player.hitBox.yOffset + brickSize;

        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Ultima colision en (xPos + xSize - 1, yPos + ySize -1)
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize -1;

        isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Habra colision si toca alguno de los 3 bloques
        isColliding = isCollidingOnPos3;



        if (isColliding)
        {
            //existe colision a la derecha
            //complimentar en el obstaculo 
            
            player.isCollidingWithRightBlock = true;


            //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
            overlap = Math.floor(xPos) % brickSize + 1;

            player.xPos -= overlap;
        }
        break;
        
        }
        case State.UP_RIGHT: 
        for (let i = 0; i < objectTile.length; i++)
            {

            const obstacleId = objectTile[i];

            xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;
            yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize -1;
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

            isColliding = isCollidingOnPos1;


            if (isColliding)
                {
                    //existe colision a la derecha
                    //complimentar en el obstaculo 
                    
                    player.isCollidingWithTopBlock = true;
        
        
                    //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
                    overlap = Math.floor(yPos) % brickSize + 1;
        
                    player.yPos += overlap/4;
                }
        }
        break;

        case State.UP_LEFT:
            for (let i = 0; i < objectTile.length; i++){
                const obstacleId = objectTile[i];
    

        // Primera colision (xPos + xSize -1, yPos)

        // xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        // yPos = player.yPos + player.hitBox.yOffset;
        
        // isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        
        // //Segunda colision

        // xPos = player.xPos + player.hitBox.xOffset;
        // yPos = player.yPos + player.hitBox.yOffset;
        

        // isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Primera colision (xPos + xSize -1, yPos)

        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        // Segunda colision en (xPos + xSize -1, yPos + brickSize)

        yPos = player.yPos + player.hitBox.yOffset + brickSize;

        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Ultima colision en (xPos + xSize - 1, yPos + ySize -1)
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize -1;

        isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Habra colision si toca alguno de los 3 bloques
        isColliding = isCollidingOnPos3;



        if (isColliding)
        {
            //existe colision a la derecha
            //complimentar en el obstaculo 
            
            player.isCollidingWithLeftBlock = true;


            //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
            overlap = Math.floor(yPos) % brickSize + 1;

            player.yPos += overlap/4;
        }
        break;
        
        }
        case State.LEFT:
            for (let i = 0; i < objectTile.length; i++){
                const obstacleId = objectTile[i];
    

        // Primera colision (xPos + xSize -1, yPos)

        // xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1;

        // yPos = player.yPos + player.hitBox.yOffset;
        
        // isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        
        // //Segunda colision

        // xPos = player.xPos + player.hitBox.xOffset;
        // yPos = player.yPos + player.hitBox.yOffset;
        

        // isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Primera colision (xPos + xSize -1, yPos)

        yPos = player.yPos + player.hitBox.yOffset;
        isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);


        // Segunda colision en (xPos + xSize -1, yPos + brickSize)

        yPos = player.yPos + player.hitBox.yOffset + brickSize;

        isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Ultima colision en (xPos + xSize - 1, yPos + ySize -1)
        xPos = player.xPos + player.hitBox.xOffset;
        yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize -1;

        isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleId);

        // Habra colision si toca alguno de los 3 bloques
        isColliding = isCollidingOnPos3;



        if (isColliding)
        {
            //existe colision a la derecha
            //complimentar en el obstaculo 
            
            player.isCollidingWithLeftBlock = true;


            //Ajuste: calculate overlap and eliminate it, this will move the character some pixels back
            overlap = Math.floor(xPos) % brickSize + 1;

            player.yPos += overlap/4;
        }
    }
        break;


        default: 
            //Resto de estados. a Rellenar
                break;
    

        }
}