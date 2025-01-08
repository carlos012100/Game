export default class ImageSet
{

    constructor(initFil, initCol, xSize, ySize, xGridWidth, yGridHeight, xOffset, yOffset)
    {
        this.initFil = initFil; //Fila de inicio de nuestro ImageSet
        this.initCol = initCol; //Columna de inicio de nuestro ImageSet
        this.xSize = xSize; //tamanio en pixeles de la imagen (x)
        this.ySize = ySize; // tamanio en pixeles de la imagen 
        this.xGridWidth = xGridWidth;
        this.yGridHeight = yGridHeight;
        this.xOffset = xOffset; //offset en X de comienzo de dibujo de personaje en respecto a la rejilla
        this.yOffset = yOffset;
        //tamanio en pixeles de la rejilla contenedora de la imagen

        // export default class ImageSet {

        //     constructor(initFil, initCol, xSize, ySize, rowHeight, colWidth, xOffset, yOffset) {
        //         this.initFil = initFil; // Fila de inicio de nuestro ImageSet
        //         this.initCol = initCol; // Columna de inicio de nuestro ImageSet
        //         this.xSize = xSize;     // Tamaño en píxeles de la imagen (x)
        //         this.ySize = ySize;     // Tamaño en píxeles de la imagen (y)
        //         this.xOffset = xOffset; // Offset en X respecto a la rejilla
        //         this.yOffset = yOffset; // Offset en Y respecto a la rejilla
        //         this.rowHeight = rowHeight; // Altura de cada celda de la rejilla en píxeles
        //         this.colWidth = colWidth;   // Ancho de cada celda de la rejilla en píxeles
        //     }
        // }
        

    }
}