import globals from "./globals.js"

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
        isOverlap = true;
    
        return isOverlap;
}
export default function detectCollisions()
{
    //calcula y detecta si hay una colision entre sprites
    for (let i = 1; i < globals.sprites.lenght; ++i)
    {
        const sprite = globals.sprites[i];
        detectCollisionBetweenPlayerAndSprite(sprite);
    }
}
function detectCollisionBetweenPlayerAndSprite(sprite)
{
    //Reset collsion date 
    sprite.isCollidingWithPlayer = false; 

    const player = globals.sprites[0];

    const x1 = player.xPos + player.hitBox.xOffset;
    const y1 = player.yPos + player.hitBox.y0ffset;
    const w1 = player.hitBox.xSize;
    const h1 = player.hitBox.ySize;

    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
    if (isOverlap)
    {
        //hay colision
        sprite.isCollidingWithPlayer = true;
    }
}