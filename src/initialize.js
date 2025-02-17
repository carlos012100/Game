import globals from "./globals.js";
import {Game, SpriteID, State, FPS, Block, ParticleID, ParticleState, Maps} from "./constants.js";
import { Player, Bat, Orc, Skull, Boss, Heart } from "./Sprite.js";
import Sprite from "./Sprite.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import {Level, levelCell1, levelx} from "./Level.js";
import Timer from "./Timer.js";
import Physics from "./Physics.js";
import {keydownHandler, keyupHandler} from "./events.js";
import HitBox from "./HitBox.js";
import Camera from "./Camera.js";
import {ExplotionParticle, FireParticle, FireParticleHeal, Shining} from "./Particle.js";

function initParticles() {
    initFire();
    // initShining();
}

function initFire() {
    const numParticles = 50;
    for (let i = 0; i < numParticles; ++i) {
        createFireParticle();
    }
}

function createFireParticle() {
    const alpha = 0.1;
    const velocity = Math.random() * 20;
    const physics = new Physics(velocity);

    const xInit = Math.random() * 50 + 155;
    const yInit = 210;

    const radius = 2 * Math.random() + 20;

    const particle = new FireParticle(ParticleID.FIRE, ParticleState.ON, xInit, yInit, radius, alpha, physics);

    const randomAngle = Math.PI / 2; // 90 degrees, straight up
    particle.physics.vx = particle.physics.vLimit * Math.cos(randomAngle); // Small horizontal movement
    particle.physics.vy = -Math.abs(particle.physics.vLimit * Math.sin(randomAngle)); // Always upward

    globals.particles.push(particle);
}

function createFireParticleHeal() {
    const numParticles = 50;
    const alpha = 0.2;
    const timeqToFadeMax = 2; // Max time for fade
    const xInit = 175;
    const yInit = 240;

    const radius = 2 * Math.random() + 15;  // Random radius

    for (let i = 0; i < numParticles; ++i) {
        // Randomize time to fade within a range
        const timeToFade = timeqToFadeMax * Math.random() + 1;

        const velocity = Math.random() * 200;  // Random velocity
        const physics = new Physics(velocity);

        // Create a new FireParticleHeal instance
        const particleHeal = new FireParticleHeal(
            ParticleID.FIREHEAL, 
            ParticleState.ON, 
            xInit, 
            yInit, 
            radius, 
            alpha, 
            physics, 
            timeToFade
        );

        // Random direction: Moving straight up
        const randomAngle = Math.PI / 2;
        particleHeal.physics.vx = particleHeal.physics.vLimit * Math.cos(randomAngle);
        particleHeal.physics.vy = -Math.abs(particleHeal.physics.vLimit * Math.sin(randomAngle));

        // Add the particle to the global particles array
        globals.particles.push(particleHeal);
    }
}

function initExplotion(x, y) {
    const numParticles = 300;
    const radius = 5;
    const timeToFadeMax = 10;
    const alpha = 0.5;

    for (let i = 0; i < numParticles; ++i) {
        const velocity = Math.random() * 25 + 80;
        const physics = new Physics(velocity);
        const timeToFade = timeToFadeMax * Math.random() + 1;
        const particle = new ExplotionParticle(ParticleID.EXPLOTION, ParticleState.ON, x, y, radius, alpha, physics, timeToFade);

        const randomAngle = Math.random() * 2 * Math.PI;
        particle.physics.vx = particle.physics.vLimit * Math.cos(randomAngle);
        particle.physics.vy = particle.physics.vLimit * Math.sin(randomAngle);

        globals.particles.push(particle);
    }
}

// function initShining() {
//     const numParticles = 10;  // Number of waves to create
//     const radius = 20;        // Initial radius of each wave
//     const timeToFadeMax = 5; // Maximum time before the particle fades
//     const alpha = 1;         // Initial transparency of the wave

//     // Create particles that represent sound waves
//     for (let i = 0; i < numParticles; ++i) {
//         const velocity = Math.random() * 25 + 10;  // Random velocity for variation
//         const physics = new Physics(velocity);
//         const timeToFade = timeToFadeMax * Math.random() + 1; // Random fade time

//         // Create a new sound wave particle
//         const blessing = new Shining(
//             ParticleID.BLESSING,
//             ParticleState.ON,
//             150,  // xPos (Central point)
//             50,   // yPos (Central point)
//             radius,  // Initial radius of the wave
//             alpha,   // Initial alpha (opacity)
//             physics,
//             timeToFade
//         );

//         // Random angle for the direction the wave will expand in
//         const randomAngle = Math.random() * 2 * Math.PI;
//         blessing.physics.vx = blessing.physics.vLimit * Math.cos(randomAngle);
//         blessing.physics.vy = blessing.physics.vLimit * Math.sin(randomAngle);

//         // Add the particle to the global particles array
//         globals.particles.push(blessing);
//     }
// }
function initShining() {
    const numParticles = 5;  // Number of particles
    const radius = 4;        // Initial radius of each particle
    const timeToFadeMax = 5; // Maximum time before the particle fades
    const alpha = 2;         // Initial transparency of the particle

    // Central point for circular motion
    const centerX = 125;
    const centerY = 720;

    // Create particles
    for (let i = 0; i < numParticles; ++i) {
        const velocity = Math.random() * 25 + 50;  // Random velocity for variation
        const physics = new Physics(velocity);
        const timeToFade = timeToFadeMax * Math.random() + 1; // Random fade time

        // Create the particle
        const blessing = new Shining(
            ParticleID.BLESSING,
            ParticleState.ON,
            centerX,  // Central x position
            centerY,  // Central y position
            radius,   // Initial radius of the particle
            alpha,    // Initial alpha (opacity)
            physics,
            timeToFade
        );

        // Initial angle for the circular motion
        blessing.physics.angle = Math.random() * 2 * Math.PI; // Random starting angle

        // Set the velocity based on the circular path
        blessing.physics.vx = velocity * Math.cos(blessing.physics.angle); // X velocity for circular motion
        blessing.physics.vy = velocity * Math.sin(blessing.physics.angle); // Y velocity for circular motion

        globals.particles.push(blessing);
    }
}

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



}

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

    globals.manapoints = 0;

    globals.sanity = globals.levelTime.value;

    globals.score = 0;


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
            // Block.coloredBlock,
            // Block.coloredBlock2,
            Block.chestLayered,
            // Block.bloodBlock,
            // Block.unkown,
        
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
    globals.levelTime = new Timer(100, 0.5);

}
    //Exportamos las funciones
    export {
        initHTMLelements,
        initVars,
        loadAssets,
        initSprites,
        initHeart,
        initLevel,
        initCell1,
        initTimer,
        initEvents,
        // createFire,
        initCamera,
        initParticles,
        initExplotion,
        createFireParticle,
        createFireParticleHeal,
        initSwordLight,
        initShining,

    }
    //Carga de activos: TILEMAPS, IMAGES,SOUNDS 

    //Carga de activos: TILEMAPS, IMAGES,SOUNDS 

    function loadAssets(){

        let tileSet;
        let bImage;
        let particleImage;

        //load the tileSet image
        tileSet = new Image();
        tileSet.addEventListener("load", loadHandler, false);
        tileSet.src = "./images/protagonist2.png";
        globals.tileSets.push(tileSet);
        globals.assetsToLoad.push(tileSet);

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

        particleImage = new Image();
        particleImage.addEventListener("load", loadHandler, false);
        particleImage.src = "./images/sparkle.png"; // Ensure the path is correct
        globals.particleImages.push(particleImage);
        globals.assetsToLoad.push(particleImage);

        particleImage = new Image();
        particleImage.addEventListener("load", loadHandler, false);
        particleImage.src = "./images/nova.png"; // Ensure the path is correct
        globals.particleImages.push(particleImage);
        globals.assetsToLoad.push(particleImage);
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
    // function createFire()
    // {
    //     const imageSet = ImageSet(15, 0, 50, 50, 64, 64, 6, 6)
        
    //     const frames = new Frames(10, 8);

    //     const physics = new Physics (60);

    //     const bullet = new Sprite(SpriteID.BULLET, State.BULLET_LEFT,260, 170, frames, physics)

    //     globals.sprites.push(bullet);
    // }

    function initPlayer(){

        //Creamos las propiedades de las imagenes: xSize, ySize, gridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 0, 64, 64, 64, 64, 0, 0); 

        //Creamos los datos de la animacion. 8 frames / state y tambien velocidad de animacion
        const frames = new Frames(2, 3);

        //Creamos nuestro objecto physics con vLimit = 40 pixels/seconds

        const physics = new Physics(200, 0, 0, 0, 0, 0, 0); // Replace 40 with the appropriate vLimit

        const hitBox = new HitBox(10, 15, 26, 30);

        // const attackHitboxRight = new HitBox(15, 32 ,8, 18);

        // const attackHitboxLeft =  new HitBox(15, 32 ,8, 18);
 6
        // const attackHitboxUp =  new HitBox(15, 32 ,8, 18);
 
        // const attackHitboxDown =  new HitBox(15, 32 ,8, 18);
        const lightHitbox = {
            right: new HitBox(30, 60, 38, 5),
            left: new HitBox(30, 55, -6, 5),
            up: new HitBox(60, 30, 6, -2),
            down: new HitBox(60, 30, 5, 40)
        };

        const attackHitbox = {
            right: new HitBox(15, 32, 38, 18),
            left: new HitBox(15, 32, 8, 18),
            up: new HitBox(35, 15, 12, 12),
            down: new HitBox(35, 15, 15, 38)
        };        
        const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;

        //Creamos nuestro sprite
        const player = new Player(SpriteID.PLAYER, State.DOWN_STILL, 900, 180, imageSet, frames, physics, initTimeToChangeDirection, hitBox, attackHitbox, lightHitbox);

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
        const velsY = [10, 40, 0, 60, 0, 100];
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
    function initSwordLight() {

        const imageSet = new ImageSet(64, 0, 50, 50, 64, 64, 6, 6);

        const frames = new Frames(0, 1);

        const physics = new Physics(0);
        
        const hitBox = new HitBox(30, 25, 12, 6);

        const swordLight = new Sprite(SpriteID.SWORDLIGHT, State.LIGHT, 100, 700, imageSet, frames, physics, hitBox);

        globals.sprites.push(swordLight);
    }
    // function initChest()
    // {

    //     const imageSet = new ImageSet(73, 0, 48, 48, 64, 64, 0, 0);

    //     const frames = new Frames(4, 5);

    //     const physics = new Physics(0);

    //     const hitBox = new HitBox(22, 25, 12, 15);

    //     const chest = new Sprite(SpriteID.CHEST, State.CHEST_CLOSED, 85, 12, imageSet, frames, physics, hitBox);
        
    //     globals.sprites.push(chest);

    // }

    function initLevel(){

        //Creamos las propiedades de las images del mapa: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 0, 32, 32, 32, 32, 0, 0);

        //Creamos y guardamos nuestro nivel
        // globals.level = new Level(level1, imageSet);

        globals.level = new Level (levelx, imageSet);
        
        
    }  
    function initCell1()
    {
        const imageSet = new ImageSet(0,0,32,32,32,32,0,0)

        globals.levelCell = new Level (levelCell1, imageSet);
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
        // initChest();
        // initShining();


    }
