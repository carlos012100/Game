export default class HitBox
{
    constructor (xSize, ySize, xOffset, yOffset)
    {
        this.xSize = xSize;     //Tamano en pixeles del hitbox (x)
        this.ySize = ySize;     //Tamano en pixeles del hitbos (y)
        this.xOffset = xOffset; //Offset en X de comienzo de dibujo del hitbox respecto de xPos
        this.yOffset = yOffset; //Offset en Y de comienzo de dibujo del hitbox respecto de ypos
    }
}