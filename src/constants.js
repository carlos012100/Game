// Estados del juego 
export const Game = {
    INVALID: -1,
    LOADING: 0,
    PLAYING: 1,
    OVER: 2,
    MENU: 3,  // Add this state for the main menu
    NEW_GAME: 4,
    NEW_GAME1: 5,
    HIGHSCORE: 6,
    CONTROLS: 7,
    GAME_OVER: 8
    

};
// Velocidad del juego 
export const FPS = 30;

export const SpriteID = {
    PLAYER: 0, // Added space after colon for readability
    SKULL1: 1,
    BAT: 2,
    BOSS:3,
    ORC: 4,
    HEART: 7,
    BULLET: 6
};

// Identificador de Estado de sprite
export const State = {
    DOWN_STILL: 0,
    LEFT_STILL: 1,
    RIGHT_STILL: 2,
    UP_STILL: 3,
    DOWN: 4,
    RIGHT: 6,
    LEFT: 5,
    UP: 7,
    DOWN_RIGHT: 14,
    UP_LEFT: 15,
    DOWN_LEFT: 16,
    UP_RIGHT: 17,
    UP_ATTACK: 11,
    RIGHT_ATTACK: 10,
    LEFT_ATTACK: 9,
    DOWN_ATTACK: 8,
    FAINT : 12,
    // BEATING: 14,
    // BULLET_LEFT: 15,
    // BULLET_RIGHT: 16,
    // EXPLOTION: 17,

    // // //Estados SKULLS
    DOWN_1: 0,
    DOWN_SKULLWALK: 1,
    UP_SKULLWALK: 6,

    // // //Estados ORC
    ORC_IDLE: -1,
    ORC_DOWNRUN : 0,
    ORC_IDLEUP: 5,
    ORC_UPRUN: 6,
    // LEFT_3: 0

    //ESTADOS DE BAT
    RIGHT_BAT: 1,
    LEFT_BAT: 2,
    RIGHT_BATIDLE: 0,

    //BEATING HEARTS
    BEATING: 0,

    //BOSS
    BOSS_LEFTIDLE:-0,
    BOSS_RIGHTIDLE: 1,
    BOSS_RIGHT: 2,
    BOSS_LEFT: 3,
    BOSS_SPECIAL: 4,

    
};

export const Tile = {
    PROTA_64: 0,
    SIZE_32: 1
};
 export const Back = {
    M: 0,
    N: 1,
    S: 2,
    CON: 3,
    H: 4,
    OVER: 5

};
export const Block = {





    // EMPTY: 3,
    // EMPTY2: 4,
    // EMPTY3: 1,
    // EMPTY4: 1,
    // EMPTY5: 5,
    // //need to make collisions from this point on//
    // FORT1: 1,
    // FORT2: 2,
    // FORT3: 13,
    // FORT4: 14,
    // FORT5: 25,
    // FORT6: 26,
    // GATE1: 15,
    // GATE12: 38,
    // GATE2: 14,
    // GATE21: 50,
    // //until up here//
    // REDFLOOR: 16,

    // EMPTY: 3,
    // EMPTY2: 4,
    // EMPTY3: 15,
    // EMPTY4: 1,
    // EMPTY5: 5,
    // //need to make collisions from this point on//
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
    // //until up here//
    // REDFLOOR: 16
    Darkness: 0,
pillar_North1: 68,
pillar_North2: 69,
Wall_Up: 70,
Wall_Up2: 71,
pillar_South: 66,
pillar_South2: 67,
wall_Straight2: 72,
wall_Straight: 6,
wall_Pilar: 7,
pilar1: 8,
pilar12: 9,
pilar15: 10,
pilar_16: 11,
pilar_18: 13,
pilarS1: 53,
pilarS2: 52,
pilarS3: 54,
pilarS4: 55,
pilarS5: 56,
pilarS6: 57,
openGate: 16,
openGateRight: 79,
openGateLeft: 78,
openGateSouth: 49,
closeGate: 15,
gateUpperSteel: 13,
coloredFloor: 25,
coloredFloorSouth: 59,
coloredFloorSouth2: 61,
// coloredFloor2: 3221225497,
gateUpperDSteel: 50,
gateUpperDWood:51,
hole: 5,
hole1: 63,
hole2: 65, 
hole3: 64,
floor1: 1,
chest: 21,

// layer 1

holyStone1: 29,
holyStone2: 30,
holyStone3: 31,
holyStone4: 48,
holyStone5: 32,
holyStone6: 33,
holyStone7: 34,
holyStone8: 35,
holyStone9: 36,
coloredBlock: 60,
unkown:58,
coloredBlock2: 68,
chestLayered: 21,
bloodBlock: 62,

//Layer 2

ladyNight: 39,
ladyNight2: 38,
ladyNight3: 37,
bloodBlock: 47,
bloodBlock2: 62,
emptySpace: 203,




}
// export const attackHitbox = {
//     RIGHT: 0,
//     LEFT: 1,
//     UP: 2,
//     DOWN: 3,
// }
export const Key = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,   
    ATTACK : 75,
    

};
export const ParticleID = {

    EXPLOSION: 0,
    FIRE: 1,
    
}
export const ParticleState = {
    ON : 0,
    FADE: 1,
    OFF: -1
}