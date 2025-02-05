import globals from "./globals.js";
import {Game, SpriteID, State, FPS, Block} from "./constants.js";
import { Player, Bat, Orc, Skull, Boss, Heart } from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import {Level, levelx} from "./Level.js";
import Timer from "./Timer.js";
import Physics from "./Physics.js";
import {keydownHandler, keyupHandler} from "./events.js";
import HitBox from "./HitBox.js";
import Camera from "./Camera.js";

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

    //varables de damage

    globals.life = 4;


    globals.objectTile = [ 
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
        createFire,
        initCamera,

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
        // tileSet = new Image();
        // tileSet.addEventListener("load", loadHandler, false);
        // tileSet.src = "./images/mapsmall.png"; //ruta es relativa al HTML, no al JS 
        // globals.tileSets.push(tileSet);
        // globals.assetsToLoad.push(tileSet);

        tileSet = new Image();
        tileSet.addEventListener("load", loadHandler, false);
        tileSet.src = "./images/fantasymapx.png"; //ruta es relativa al HTML, no al JS 
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
    function initCamera()
    {
        globals.camera = new Camera(0,0);
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
        const imageSet = new ImageSet(0, 0, 64, 64, 64, 64, 0, 0); 

        //Creamos los datos de la animacion. 8 frames / state y tambien velocidad de animacion
        const frames = new Frames(3, 3);

        //Creamos nuestro objecto physics con vLimit = 40 pixels/seconds

        const physics = new Physics(200,0,0,0,0,0,0); // Replace 40 with the appropriate vLimit

        const hitBox = new HitBox(12, 30, 25, 16);

        const attackHitbox = new HitBox(15, 32 ,8, 18);
        
        const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;

        //Creamos nuestro sprite
        const player = new Player(SpriteID.PLAYER, State.DOWN_STILL, 900, 600, imageSet, frames, physics, initTimeToChangeDirection, hitBox, attackHitbox);

        //Añadimos el player al array de sprites

        globals.sprites.push(player);


    }
    // function initSKULL1(skullData) {
    //     for (let i = 0; i < skullData.length; i++) {
    //         const { x, y, state } = skullData[i]; // Extract the position and state
    
    //         const imageSet = new ImageSet(56, 0, 50, 50, 64, 64, 5, 6);
    //         const frames = new Frames(4, 5);
    
    //         const velsX = [20, 40, 0, 60, 0, 100];
    //         const velsY = [10, 40, 0, 60, 0, 400];
    //         const velChangeValue = 1;
    
    //         const physics = new Physics(100, 0, 0, 0, velsX, velsY, velChangeValue);
    
    //         const hitBox = new HitBox(30, 25, 12, 6);
    
    //         const initTimeToChangeDirection = Math.floor(Math.random() * 6) + 1;
    
    //         // Give each skull a unique ID
    //         const uniqueID = `SKULL1_${i + 1}`;
    
    //         const skull = new Skull(uniqueID, state, x, y, imageSet, frames, physics, initTimeToChangeDirection, hitBox, 2);
    
    //         globals.sprites.push(skull);
    //     }
    // }
    const skullNames = ["Reaper", "Bonecrusher", "Ghoul", "Shadowfang", "Phantom", "Wraith"];

function initSKULL1(skullData) {
    for (let i = 0; i < skullData.length; i++) {
        const { x, y, state } = skullData[i];

        const imageSet = new ImageSet(56, 0, 50, 50, 64, 64, 5, 6);
        const frames = new Frames(4, 5);
        const velsX = [20, 40, 0, 60, 0, 100];
        const velsY = [10, 40, 0, 60, 0, 400];
        const velChangeValue = 1;
        const physics = new Physics(100, 0, 0, 0, velsX, velsY, velChangeValue);
        const hitBox = new HitBox(30, 25, 12, 6);
        const initTimeToChangeDirection = Math.floor(Math.random() * 6) + 1;

        // Assign a name from the array (looping if necessary)
        const name = skullNames[i % skullNames.length];

        const skull = new Skull(SpriteID.SKULL1, state, x, y, imageSet, frames, physics, initTimeToChangeDirection, hitBox, 2);
        skull.name = name;  // Assign from the list

        globals.sprites.push(skull);
    }
}

    
    function initBAT() {
        const imageSet = new ImageSet(52, 0, 25, 25, 64, 64, 5, 6);

        const frames = new Frames(4, 4);
    
        // Initialize physics
        const initAngle = 60 * Math.PI/180; // Start at 0 radians
        const omega = 20; // Angular velocity
        const yRef = 600; // Reference Y position
        const physics = new Physics(40, omega, initAngle, yRef);
    
        const hitBox = new HitBox(8, 18, 8, 3);

        const initTimeToChangeDirection = Math.floor(Math.random() * 6) + 1;
    
        const bat = new Bat(SpriteID.BAT, State.RIGHT_BAT, 100, 600, imageSet, frames, physics, initTimeToChangeDirection, hitBox, 2);

        globals.sprites.push(bat);
    }
    function initBOSS(){

        const imageSet = new ImageSet(34, 0, 128, 128, 128, 62, 0, 0);

        const frames = new Frames(8,16);

        const physics = new Physics(0); // Replace 40 with the appropriate vLimit

        const hitBox = new HitBox(30, 25, 12, 6);

        const initTimeToChangeDirection = Math.floor(Math.random() * 6) + 1;

        const boss = new Boss(SpriteID.BOSS, State.BOSS_RIGHTIDLE, 1000, 500, imageSet, frames, physics, initTimeToChangeDirection, hitBox, 2);

        globals.sprites.push(boss);
 
        
    }

    function initORC(orcsData) {
        // for (let i = 0; i < count; i++) {
        //     const x = 650 + i * 100; // Adjust positions dynamically
        //     const y = 180;
        //     const imageSet = new ImageSet(19, 0, 50, 50, 64, 64, 10, 6);
        //     const frames = new Frames(10, 3);
        //     const physics = new Physics(40);
        //     const hitBox = new HitBox(30, 25, 12, 6);
        //     const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;
    
            for (let i = 0; i < orcsData.length; i++) {
                const { x, y, state } = orcsData[i]; // Extract the position and state
        
                const imageSet = new ImageSet(23, 0, 50, 50, 64, 64, 10, 6);
                const frames = new Frames(8, 6);
                const physics = new Physics(100,0,0,0);
                const hitBox = new HitBox(22, 25, 12, 15);
                const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;
        
                // Create the orc with the predefined state and position
                const orc = new Orc(SpriteID.ORC, state, x, y, imageSet, frames, physics, initTimeToChangeDirection, hitBox, 2);
                
                globals.sprites.push(orc);
            }
        }
        
    
    

    function initHeart() {

        const imageSet = new ImageSet(18, 0, 62, 62, 64, 64, 0, 0);

        const frames = new Frames(6, 18);

        const physics = new Physics(20); // Replace 40 with the appropriate vLimit

        const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;


        const heart = new Heart(SpriteID.HEART, State.BEATING, 0, 5, imageSet, frames, physics, initTimeToChangeDirection);

        globals.sprites.push(heart);

    }
    function initLevel(){

        //Creamos las propiedades de las images del mapa: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 0, 32, 32, 32, 32, 0, 0);

        //Creamos y guardamos nuestro nivel
        // globals.level = new Level(level1, imageSet);

        globals.level = new Level (levelx, imageSet);
        
        
    }  
    

    function initSprites(){
        
        initPlayer();
        initSKULL1([
            { x: 500, y: 400, state: State.DOWN_SKULLWALK },
            { x: 400, y: 700, state: State.ORC_UPRUN },
            { x: 350, y: 500, state: State.ORC_UPRUN },
        ]);
        initBOSS();
        initBAT();
        initORC([
            { x: 650, y: 180, state: State.ORC_DOWNRUN },
            { x: 800, y: 200, state: State.ORC_UPRUN },
            { x: 185, y: 400, state: State.ORC_IDLE },
            { x: 185, y: 360, state: State.ORC_IDLEUP }
        ]);
        initHeart();


    }