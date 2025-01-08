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

// Identificador de estado de sprite (dirección)
export const State = {
    DOWN_STILL: 0,
    DOWN: 1,
    LEFT: 2,
    LEFT_STILL: 3,
    RIGHT: 4,
    RIGHT_STILL: 5,
    UP: 6,
    UP_STILL: 7,
    DOWN_RIGHT: 8,
    UP_LEFT: 9,
    DOWN_LEFT: 10,
    UP_RIGHT: 11,
    RIGHT_ATTACK: 12,
    LEFT_ATTACK: 13,
    // PUMP: 14,
    // BULLET_LEFT: 15,
    // BULLET_RIGHT: 16,
    // EXPLOTION: 17,

    // // //Estados SKULLS
    DOWN_1: 0,
    DOWN_SKULLWALK: 1,

    // // //Estados ORC
    ORC_DOWNRUN : 0,
    ORC_UPRUN: 6,
    // LEFT_3: 0

    //ESTADOS DE BOSS
    RIGHT_FINAL:0,

    //ESTADOS DE BAT
    RIGHT_BAT: 1,
    LEFT_BAT: 2,
    RIGHT_BATIDLE: 0,

    //PUMPING HEARTS
    BEATING: -1,
    
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
    EMPTY: 3,
    EMPTY2: 4,
    EMPTY3: 15,
    EMPTY4: 16,
    EMPTY5: 5,
    FORT1: 1,
    FORT2: 2,
    FORT3: 13,
    FORT4: 14,
    FORT5: 25,
    FORT6: 26,
    GATE1: 37,
    GATE12: 38,
    GATE2: 49,
    GATE21: 50,
    REDFLOOR: 121
}
export const Key = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,   
    ATTACK : 75,
    

};