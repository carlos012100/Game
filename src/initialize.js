import globals from "./globals.js";
import {Game, SpriteID, State, FPS, Tile} from "./constants.js";
import Sprite from "./Sprite.js";
import { Player, Bat, Orc } from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import {Level, level1} from "./Level.js";
import Timer from "./Timer.js";
import Physics from "./Physics.js";
import {keydownHandler, keyupHandler} from "./events.js";
import HitBox from "./HitBox.js";

//Function que incializa los elementos HTML
function initHTMLelements(){
    //Canvas
    globals.canvas = document.getElementById('gameScreen');

    //Context
    globals.ctx = globals.canvas.getContext('2d');

    //Canvas, context HUD
    globals.canvasHUD = document.getElementById('gameHUD');

    globals.ctxHUD = globals.canvasHUD.getContext('2d');

    //Eliminacion del Anti-Aliasing
    globals.ctx.imageSmoothingEnabled = false;

    // globals.startScreen = document.getElementById('mainMenuScreen');

    // globals.ctxstartScreen = globals.startScreen.getContext('2d'); // Add this

    // globals.newGameScreen = document.getElementById('newGame');

    // globals.ctxnewGameScreen = globals.newGameScreen.getContext('2d');

    // globals.newGameScreen1 = document.getElementById('newGame1');

    // globals.ctxnewGameScreen1 = globals.newGameScreen1.getContext('2d');

    // globals.highScore = document.getElementById('highscore');

    // globals.ctxshightScore = globals.highScore.getContext('2d');

    // globals.controls = document.getElementById('controls');

    // globals.ctxcontrols = globals.controls.getContext('2d');

    // globals.gameover = document.getElementById('controls');

    // globals.ctxgameover = globals.gameover.getContext('2d');


}
// function showScreen(gameScreen) {
//     // Hide all canvases
//     const screens = document.querySelectorAll('canvas');
//     screens.forEach(screen => screen.style.display = 'none');
    
//     // Show the selected canvas
//     document.getElementById(gameScreen).style.display = 'block';
// }
//Funcion que inicializa las variables del juego
//function que inicializa las variables de juego con la siguente espficicaiones: 

function initEvents()
{
    //Add the keyboard event listeners
    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);
}

function initVars(){

    //Inicializamos las variables de gestion de tiempo
    globals.previousCycleMilliseconds = 0;
    globals.deltaTime = 0;
    globals.frameTimeObj = 1 / FPS; //Frame time in second.

    //Inicializamos el estado del juego
    globals.gameState = Game.LOADING;

    //Inicializamos el contaodr del juego
    globals.gameTime = 0;
    
    //Inicializamos los estados de las acciones
    globals.action = {
        moveLeft: false,
        moveRight: false,
        moveUp: false,
        moveDown: false,
        attackRight : false
    }

    //Variables logica juego
    globals.life = 400;

}
function initTimer()
{
    //Creamos timer de valor 200, con cambios cada 0.5 segundos
    globals.levelTime = new Timer(200, 0.5);
}
    //Exportamos las funciones
    export {
        initHTMLelements,
        initVars,
        loadAssets,
        initSprites,
        initHeart,
        initLevel,
        initTimer,
        initEvents,
        createFire

    }
    //Carga de activos: TILEMAPS, IMAGES,SOUNDS 

    //Carga de activos: TILEMAPS, IMAGES,SOUNDS 

    function loadAssets(){

        let tileSet;
        let bImage;

        //load the tileSet image
        tileSet = new Image();
        tileSet.addEventListener("load", loadHandler, false);
        tileSet.src = "./images/protagonist2.png";
        globals.tileSets.push(tileSet);
        globals.assetsToLoad.push(tileSet);
        // tileSet = new Image();
        // tileSet.addEventListener("load", loadHandler, false);
        // tileSet.src = "./images/protagonist.png"; //ruta es relativa al HTML, no al JS 
        // globals.tileSets.push(tileSet);
        // globals.assetsToLoad.push(tileSet);

        // tileSet = new Image();
        // tileSet.addEventListener("load", loadHandler, false);
        // tileSet.src = "./images/ORC.png"; //ruta es relativa al HTML, no al JS 
        // globals.tileSets.push(tileSet);
        // globals.assetsToLoad.push(tileSet);

        // tileSet = new Image();
        // tileSet.addEventListener("load", loadHandler, false);
        // tileSet.src = "./images/Skull.png"; //ruta es relativa al HTML, no al JS 
        // globals.tileSets.push(tileSet);
        // globals.assetsToLoad.push(tileSet);

        // tileSet = new Image();
        // tileSet.addEventListener("load", loadHandler, false);
        // tileSet.src = "./images/boss.png"; //ruta es relativa al HTML, no al JS 
        // globals.tileSets.push(tileSet);
        // globals.assetsToLoad.push(tileSet);

        // tileSet = new Image();
        // tileSet.addEventListener("load", loadHandler, false);
        // tileSet.src = "./images/bat.png"; //ruta es relativa al HTML, no al JS 
        // globals.tileSets.push(tileSet);
        // globals.assetsToLoad.push(tileSet);        

        //Load the map image
        tileSet = new Image();
        tileSet.addEventListener("load", loadHandler, false);
        tileSet.src = "./images/mapsmall.png"; //ruta es relativa al HTML, no al JS 
        globals.tileSets.push(tileSet);
        globals.assetsToLoad.push(tileSet);

        //Background images 

        bImage = new Image();
        bImage.addEventListener("load", loadHandler, false);
        bImage.src = './images/mainscreen.jpeg';
        globals.bImages.push(bImage);
        globals.assetsToLoad.push(bImage);

        bImage = new Image();
        bImage.addEventListener("load", loadHandler, false);
        bImage.src = './images/newGame.jpeg';
        globals.bImages.push(bImage);
        globals.assetsToLoad.push(bImage);

        bImage = new Image();
        bImage.addEventListener("load", loadHandler, false);
        bImage.src = './images/castle.png';
        globals.bImages.push(bImage);
        globals.assetsToLoad.push(bImage);
   

        bImage = new Image();
        bImage.addEventListener("load", loadHandler, false);
        bImage.src = './images/controls.jpeg';
        globals.bImages.push(bImage);
        globals.assetsToLoad.push(bImage);

        bImage = new Image();
        bImage.addEventListener("load", loadHandler, false);
        bImage.src = './images/highscore.jpeg';
        globals.bImages.push(bImage);
        globals.assetsToLoad.push(bImage);

        bImage = new Image();
        bImage.addEventListener("load", loadHandler, false);
        bImage.src = './images/gameover.png';
        globals.bImages.push(bImage);
        globals.assetsToLoad.push(bImage);


    }

    //FUncion que se llama cada vez que se carga un activo 
    function loadHandler(){

        globals.assetsLoaded++;

        //Una vez se han cargado todo los activos pasamos
        if (globals.assetsLoaded === globals.assetsToLoad.length){

            //Update. remove the load event listener
            for (let i = 0; i < globals.tileSets.length; i++){

                globals.tileSets[i].removeEventListener("load", loadHandler, false);
            }
            console.log("Assets finished loading");


            //Start the game
            globals.gameState = Game.PLAYING;
        }
    }

    function createFire()
    {
        const imageSet = ImageSet(15, 0, 50, 50, 64, 64, 6, 6)
        
        const frames = new Frames(10, 8);

        const physics = new Physics (60);

        const bullet = new Sprite(SpriteID.BULLET, State.BULLET_LEFT,260, 170, frames, physics)

        globals.sprites.push(bullet);
    }
    
    function initPlayer(){

        //Creamos las propiedades de las imagenes: xSize, ySize, gridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 0, 64, 56, 64, 64, 0, 0); 

        //Creamos los datos de la animacion. 8 frames / state y tambien velocidad de animacion
        const frames = new Frames(4, 6);

        //Creamos nuestro objecto physics con vLimit = 40 pixels/seconds

        const physics = new Physics(60); // Replace 40 with the appropriate vLimit

        const hitBox = new HitBox(12, 30, 25, 16);
        
        const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;

        //Creamos nuestro sprite
        const player = new Player(SpriteID.PLAYER, State.RIGHT_ATTACK, 270, 170, imageSet, frames, physics, initTimeToChangeDirection, hitBox);

        //Añadimos el player al array de sprites

        globals.sprites.push(player);
        console.log(player);  // Logs the entire player object to check if hitBox is assigned


    }
    function initSKULL1(){

        const imageSet =new ImageSet(51, 0, 50, 50, 64, 64, 5, 6);

        const frames = new Frames(7);

        const physics = new Physics(20); // Replace 40 with the appropriate vLimit


        const skull = new Sprite(SpriteID.SKULL1, State.DOWN_1, 10, 250, imageSet, frames, physics);

        globals.sprites.push(skull);
    }
    function initBAT(){

        const imageSet = new ImageSet(48, 0, 25, 25, 64, 64, 5, 6);

        const frames = new Frames(4, 3);

        const physics = new Physics(40); // Replace 40 with the appropriate vLimit

        const hitBox = new HitBox (10, 18, 8, 3);

        const initTimeToChangeDirection = Math.floor(Math.random() * 6) + 1;

        const bat = new Bat(SpriteID.BAT, State.RIGHT_BAT, 50, 260, imageSet, frames, physics, initTimeToChangeDirection, hitBox);

        bat.tileSetIndex = Tile.BAT_64; ; // Assign the correct tile set index for the orc

        globals.sprites.push(bat);

    }
    function initBOSS(){

        const imageSet = new ImageSet(30, 1, 128, 128, 128, 64, 5, 0);

        const frames = new Frames(7);

        const physics = new Physics(20); // Replace 40 with the appropriate vLimit

        const boss = new Sprite(SpriteID.BOSS, State.RIGHT_FINAL, 400, 200, imageSet, frames, physics);

        globals.sprites.push(boss);
 
        
    }
    console.log(globals.level.imageSet); // Should log the ImageSet instance

    function initORC(){

        const imageSet = new ImageSet(19, 0, 50, 50, 64, 64, 10, 6);

        const frames = new Frames(10, 3);

        const physics = new Physics(30); // Replace 40 with the appropriate vLimit

        const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;

        const orc = new Orc(SpriteID.ORC, State.ORC_UPRUN, 90, 205, imageSet, frames, physics, initTimeToChangeDirection);

        globals.sprites.push(orc);



    }
    function initHeart() {

        const imageSet = new ImageSet(15, 0, 50, 50, 64, 64, 0, 0);

        const frames = new Frames(6, 2);

        const physics = new Physics(20); // Replace 40 with the appropriate vLimit

        const heart = new Sprite(SpriteID.HEART, State.BEATING, 0,0 , imageSet, frames, physics);

        globals.sprites.push(heart);

    }
    function initLevel(){

        //Creamos las propiedades de las images del mapa: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 0, 32, 32, 32, 32, 0, 0);

        //Creamos y guardamos nuestro nivel
        globals.level = new Level(level1, imageSet);
        
    }  


    

    function initSprites(){
        
        initPlayer();
        initSKULL1();
        initBOSS();
        initBAT();
        initORC();


        
    }