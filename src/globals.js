import {Game} from "./constants.js"

export default {

    //Acceso al canvas y context
    canvas:{},
    ctx:{},
    canvasHUD: {},
    ctxHUD: {},
    startScreen: {},
    ctxstartScreen: {},
    newGameScreen: {},
    ctxnewGameScreen: {},
    newGameScreen1: {},
    ctxnewGameScreen1: {},
    controls: {},
    ctxcontrols: {},
    highScore: {},
    ctxshightScore: {},
    gameover : {},
    ctxgameover: {},

    //Tiempo de juego
    gameTime: -1,

    //Life
    life: 0,
    damageInterval: 0.2, // Flicker interval (200 milliseconds)
    invincivility: 3, // Total duration of damage mode (4 seconds)
    invincivilityCounter: 0, // Counter for player's damage mode duration

    //Temporizacion nivel
    levelTime: {},

    //Estado de juego, Inicializamos a INVALIDO
    gameState: Game.INVALID,

    cycleRealTime : 0,
    
    //Tiempo de ciclo anterior (milliseconds)
    previousCycleMilliseconds: -1,

    //Tiempo de ciclo de juego real (seconds)
    deltaTime: 0,

    frameTimeObj: 0,

    // Datos de imagen (tileset)
    tileSets: [],
    bImages: [],

    objectTile: [],

    //Variables para gestionar la carga de activos
    assetsToLoad: [],
    assetsLoaded: 0,

    sprites: [],

    particles: [],

    particleImages: [],

    heartSprites: [], // Initialize as an empty array

    level: {},

    //Objecto que guarda el estado de la tecla pulsada
    action: {},

    isHealingActive: false,
    healCount: 0,
    healDuration: 2 // Duration in seconds

    
    
};
