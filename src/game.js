import globals from "./globals.js";
import {initHTMLelements, loadAssets, initSprites, initVars, initLevel, initTimer, initEvents, initCamera} from "./initialize.js";
import update from "./gameLogic.js";
import render from "./gameRender.js";


//GAME INIT

window.onload = init;



function init(){

    //Inicializamos los elementos HTML: Canvas, Context, Caja de txto de pruebas
    initHTMLelements();

    //Cargamos todos los activos: TILEMAPS, IMAGES, SOUNDS
    loadAssets();

    initCamera();


    //Inicializamos los sprites
    initSprites();

    //Initializacion de variables del juego
    initVars();

    //Inicializamos el mapa del juego
    initLevel();

    initTimer();

    initEvents();


    //Start the first frame request
    window.requestAnimationFrame(gameLoop);

}

//GAME EXECUTE

//Bucle principal de ejecucion
function gameLoop(timeStamp){
 

    //Keep requesting new frames
    window.requestAnimationFrame(gameLoop, globals.canvas);

    globals.sprites[0].hasIncrementedThisFrame = false;


    //Tiempo real de ciclo de ejecicion
    const elapsedCycleSeconds = (timeStamp - globals.previousCycleMilliseconds)/1000; //seconds

    //Tiempo anterior de ciclo de ejecucion
    globals.previousCycleMilliseconds = timeStamp;

    //Variable que corrige el tiempo de frame debido a retrasos con respecto al tiempo objectivo (frameTimeObj)
    globals.deltaTime += elapsedCycleSeconds;

    //changes
    globals.cycleRealTime += elapsedCycleSeconds;

    if (globals.cycleRealTime >= globals.frameTimeObj){
        //update the game logic. gameLogic.js
        update();

        //Perform the drawing operation. gameRender.js
        render();
        
        //Corregimos los excesos de tiempo
        globals.cycleRealTime -= globals.frameTimeObj;
        globals.deltaTime = 0;
        
        
    }
}