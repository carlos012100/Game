export default class HitBox
{
    constructor (xSize, ySize, xOffset, yOffset)
    {
        this.xSize = xSize;     //Tamano en pixeles del hitbox (x)
        this.ySize = ySize;     //Tamano en pixeles del hitbos (y)
        this.xOffset = xOffset; //Offset en X de comienzo de dibujo del hitbox respecto de xPos
        this.yOffset = yOffset; //Offset en Y de comienzo de dibujo del hitbox respecto de ypos
        this.x1 = 0,
        this.y1 = 0,
        this.w1 = 0,
        this.h1 = 0,

        // Initial position for the hitbox (will be updated later)
        this.xPos = 0;  // Will be set dynamically during gameplay
        this.yPos = 0;  // Will be set dynamically during gameplay
    }
}