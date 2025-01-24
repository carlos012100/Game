import globals from "./globals.js";
import {Game, SpriteID} from "./constants.js";
import {Tile,Back,State} from "./constants.js";
import { updateAnimationFrames } from "./gameLogic.js";


//Funcion que renderiza los graficos
export default function render()
{
    // globals.gameState = Game.MENU;

    switch(globals.gameState){

        case Game.LOADING:
            //Draw loading spinner
            break;

        case Game.PLAYING:
            drawGame();
            
            break;

        case Game.MENU:
            renderStartScreen();
            break;

        case Game.NEW_GAME:
            renderNewGame();  // Render the main menu screen
            break;
            
        case Game.NEW_GAME1:
            renderNewGame1();  // Render the main menu screen
            break;

        case Game.HIGHSCORE:
            renderHighScore();  // Render the main menu screen
            break;

        
        case Game.CONTROLS:
            renderControls();  // Render the main menu screen
            break;

        case Game.GAME_OVER:
            renderover();  // Render the main menu screen
            break;
        

        default:
            console.error("Error: Game State invalid");
    }
}

function drawGame(){

    //Borramos la pantalla entera

    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);



    //Dibujamos el mapa (nivel)
    renderMap();
    

    drawSprites();

    if (globals.gameState === Game.PLAYING){
        renderHUD();
    }


    //Pintamos los FPS en pantalla

    // globals.ctx.fillText("FPS: " + 1 / globals.deltaTime, 30, 30);


}


function renderSprite(sprite) {

    // Check if sprite is within the canvas bounds
    if (sprite.xPos < 0 || sprite.xPos > globals.canvas.width || sprite.yPos < 0 || sprite.yPos > globals.canvas.height) {
        return; // Skip rendering if sprite is out of bounds
    }

    // Calculate the initial tile position
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridWidth;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridHeight;
    // Calculate the tilemap position to draw
    const xTile = xPosInit + sprite.frames.framesCounter * sprite.imageSet.xGridWidth + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridHeight + sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    // Draw the sprite's frame at the calculated position

        globals.ctx.drawImage(
        globals.tileSets[Tile.PROTA_64],
        xTile, yTile,                                   // the source x and y position
        sprite.imageSet.xSize, sprite.imageSet.ySize,   // the source width and height
        xPos, yPos,                                     // the destination x and y position
        sprite.imageSet.xSize, sprite.imageSet.ySize    // the destination width and height
    )

}

function drawHitBox (sprite)
{
    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox.xOffset);

    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox.yOffset);

    const w1 = sprite.hitBox.xSize;

    console.log(sprite.hitBox.xOffset);  // Debugging line
    
    const h1 = sprite.hitBox.ySize;

    globals.ctx.strokeStyle = "red";

    globals.ctx.strokeRect(x1, y1, w1, h1);

}
// console.log(tileSet);
    function drawSprites(){

        for (let i = 0; i < globals.sprites.length; ++i){

        const sprite = globals.sprites[i];


        //TEST: DIbuja un rectangulo alrededor del sprite
        // drawSpriteRectangle(sprite);
        
        if (sprite.id !== SpriteID.HEART){
            renderSprite(sprite, globals.ctx);
            if (sprite.hitBox){
                drawHitBox (sprite)
            }
        }

        // if (sprite.hitBox) {
        //     drawHitBox(sprite);  // Only draw hitbox for sprites with hitBox
        //     // Other drawing logic for the sprite here
        // }


        }
        
        

    }
    function drawSpriteRectangle(sprite){

        //Dato del sprite
        const x1 = Math.floor(sprite.xPos);
        const y1 = Math.floor(sprite.yPos);
        const w1 = sprite.imageSet.xSize;
        const h1 = sprite.imageSet.ySize;

        globals.ctx.fillStyle = "green";
        globals.ctx.fillRect(x1, y1, w1, h1);

    }
    function renderMap() {
        const brickSize = globals.level.imageSet.xGridWidth;
        const levelData = globals.level.data; // 3D array with layers
        const numRows = levelData[0].length;  // Number of rows
        const numCols = levelData[0][0].length; // Number of columns
    
        // Loop through layers, rows, and columns in reverse for horizontal rendering
        for (let layer = 0; layer < 3; ++layer) {
            for (let row = 0; row < numRows; ++row) {
                for (let col = numCols - 1; col >= 0; --col) { // Reverse column order
                    const tileIndex = levelData[layer][row][col];
    
                    // Skip if the tile is empty (assuming 0 means empty)
                    if (tileIndex === 0) continue;
    
                    // Calculate the tile position on the tilesheet
                    const xTile = (tileIndex - 1) * brickSize;
                    const yTile = 0;
    
                    // Calculate the destination position on the canvas
                    const xPos = (numCols - col - 1) * brickSize; // Reverse the horizontal position
                    const yPos = row * brickSize;
    
                    // Draw the tile on the canvas
                    globals.ctx.drawImage(
                        globals.tileSets[Tile.SIZE_32], // Tile sheet image
                        xTile, yTile,                  // Source position on the tile sheet
                        brickSize, brickSize,          // Source width and height
                        xPos, yPos,                    // Destination position on the canvas
                        brickSize, brickSize           // Destination width and height
                    );
                }
            }
        }
    }
    

    let heartSprites = [];
    function updateHudHearts ()
    {
        const hearts = globals.sprites.filter(sprite => sprite.id === SpriteID.HEART);
        const destWidth = 25; // Adjust as needed for HUD scaling
        const destHeight = 25;  
        const startX = 0;
        const startY = 5;  

          // Clear the array of heart sprites and HUD area
        heartSprites = [];
        globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);


          // Repopulate the array and draw hearts based on the current life value
    for (let i = 0; i < globals.life; i++) {
        const destX = startX + i * 25;

        // Add a heart sprite's position to the heartSprites array
        heartSprites.push({ x: destX, y: startY });

        // Draw each heart sprite
        for (const sprite of hearts) {
            globals.ctxHUD.drawImage(
                globals.tileSets[Tile.PROTA_64],
                sprite.imageSet.initCol * sprite.imageSet.xGridWidth + sprite.frames.framesCounter * sprite.imageSet.xGridWidth + sprite.imageSet.xOffset,
                sprite.imageSet.initFil * sprite.imageSet.yGridHeight + sprite.state * sprite.imageSet.yGridHeight + sprite.imageSet.yOffset,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                destX, startY,
                destWidth, destHeight
            );
        }
    }
        // for ( let i = 0; )
        //     {

        //     }
    }
    function renderHUD(sprite){

        updateHudHearts();
        
        //TEST: Datos metidos en bruto
        // const life = 20;
        // const numHeart = 4;
        // const destWidth = 25; // Adjust as needed for HUD scaling
        // const destHeight = 25;  
        // const startX = 0;
        // const startY = 5;  
        const mana = 10;
        const madness = 20;
        const junk = 2;
        const score = 100;
        const highscore = 50000;
        const time = globals.levelTime.value;
           // Get all heart sprites
    // const hearts = globals.sprites.filter(sprite => sprite.id === SpriteID.HEART);

    // for (let i = 0; i < numHeart; i++) {
    //     const destX = startX + i * 25;
            
    //     // Filter out heart sprites for rendering
    //     for (const sprite of hearts) {

    //         // Draw the heart sprite
    //         globals.ctxHUD.drawImage(
    //             globals.tileSets[Tile.PROTA_64],
    //             sprite.imageSet.initCol * sprite.imageSet.xGridWidth + sprite.frames.framesCounter * sprite.imageSet.xGridWidth + sprite.imageSet.xOffset,
    //             sprite.imageSet.initFil * sprite.imageSet.yGridHeight + sprite.state * sprite.imageSet.yGridHeight + sprite.imageSet.yOffset,
    //             sprite.imageSet.xSize, sprite.imageSet.ySize,
    //             destX, startY,
    //             destWidth, destHeight           // Destination width, height
    //         );
    //     }
    // }

    //     //Draw life 

        globals.ctxHUD.font = '8px emulogic';
        globals.ctxHUD.fillStyle = 'darkred';
        globals.ctxHUD.fillText("Health", 10, 10);
        globals.ctxHUD.fillStyle = 'red';
        // globals.ctxHUD.fillText(" " + globals.life, 10, 25);
        // globals.ctxHUD.fillRect(10, 15 , life , 5);
        // const tileSize = 64; // Size of one tile in the tileset
        // const heartRow = 14; // Row of the heart sprite in the tileset (zero-based)
        
        // const srcWidth = tileSize;
        // const srcHeight = tileSize;
        // const destWidth = 32; // Adjust as needed for HUD scaling
        // const destHeight = 32;
        
        // let heartNum = 4; // Total number of hearts
        
        // // Draw each heart sprite
        // for (let i = 0; i < heartNum; i++) {
        //     const destX = 0 + i * 20; // Increment X position for each heart
        //     const destY = 5;          // Keep Y position constant
        
        //     let heartCol = (i === heartNum - 1) ? 3 : 1; // Use column 3 for the last heart, otherwise column 1
        //     const srcX = heartCol * tileSize;
        //     const srcY = heartRow * tileSize;
        
        //     globals.ctxHUD.drawImage(
        //         globals.tileSets[Tile.PROTA_64], // The tileset image
        //         srcX, srcY,                     // Source x, y
        //         srcWidth, srcHeight,            // Source width, height
        //         destX, destY,                   // Destination x, y
        //         destWidth, destHeight           // Destination width, height
        //     );
        // }
            // Check if sprite is within the canvas bounds
    // if (sprite.xPos < 0 || sprite.xPos > globals.canvas.width || sprite.yPos < 0 || sprite.yPos > globals.canvas.height) {
    //     return; // Skip rendering if sprite is out of bounds
    // }
        //Mana
        globals.ctxHUD.font = '8px emulogic';
        globals.ctxHUD.fillStyle = 'lightblue';
        globals.ctxHUD.fillText("Psynergy", 120, 10);
        globals.ctxHUD.fillStyle = 'navy';
        globals.ctxHUD.fillRect(120, 15, mana, 5);

        //Madness
        globals.ctxHUD.font = '8px emulogic';
        globals.ctxHUD.fillStyle = 'darkviolet';
        globals.ctxHUD.fillText("Madness", 200, 10);
        globals.ctxHUD.fillStyle = 'violet';
        globals.ctxHUD.fillRect(200, 15, madness, 5);

//         //JUNK
//         // Draw health icon
//         // Draw Heart Icon from Tileset
//     const tileSize = 64; // Size of one tile in the tileset
//     const heartCol = 0; // Column of the heart sprite in the tileset (zero-based)
//     const heartRow = 10; // Row of the heart sprite in the tileset (zero-based)

//     // Source position and size in the tileset
//     const srcX = heartCol * tileSize;
//     const srcY = heartRow * tileSize;
//     const srcWidth = tileSize;
//     const srcHeight = tileSize;

//     // Destination position and size on the HUD
//     const destX = 200;
//     const destY = 5;
//     const destWidth = 32; // Adjust as needed for HUD scaling
//     const destHeight = 32;

// // Draw the same sprite 4 times at different positions
// for (let i = 0; i < 4; i++) {
//     const destX = 200 + i * 15; // Increment X position for each sprite
//     const destY = 5;           // Keep Y position constant

//     globals.ctxHUD.drawImage(
//         globals.tileSets[Tile.PROTA_64], // The tileset image
//         srcX, srcY,                     // Source x, y
//         srcWidth, srcHeight,            // Source width, height
//         destX, destY,                   // Destination x, y
//         destWidth, destHeight           // Destination width, height
//     );
// }

        globals.ctxHUD.font = '8px emulogic';
        globals.ctxHUD.fillStyle = 'gray';
        globals.ctxHUD.fillText("JUNK", 280, 10);
        globals.ctxHUD.fillStyle = 'silver';
        globals.ctxHUD.fillText(" x " + junk, 280, 25);        
        

        // Draw score
        globals.ctxHUD.font = '8px emulogic';
        globals.ctxHUD.fillStyle = 'white';
        globals.ctxHUD.fillText("SCORE", 350, 10);
        globals.ctxHUD.fillStyle = 'lightgray'
        globals.ctxHUD.fillText(" " + score, 340, 25);

        //Draw Hight Score
        globals.ctxHUD.fillStyle = 'gold';
        globals.ctxHUD.fillText("HIGH SCORE", 410, 10);
        globals.ctxHUD.fillStyle = '#AA6C39';
        globals.ctxHUD.fillText(" " + highscore, 400, 25);

        //ROund corners. (Remove 1 pixel per corner)

        // globals.ctxHUD.fillStyle = 'black';
        // globals.ctxHUD.fillRect(168, 9, 1, 1);
        // globals.ctxHUD.fillRect(168, 15, 1, 1);
        // globals.ctxHUD.fillRect(168 + life - 1, 9, 1, 1);
        // globals.ctxHUD.fillRect(168 + life - 1, 15, 1, 1);



    }
    export function renderStartScreen() {

        
            // Draw the background image
            globals.ctx.drawImage(
                globals.bImages[Back.M], 0, 0, globals.canvas.width, globals.canvas.height);
        
            // Shadow properties for text
            globals.ctx.shadowColor = "black"; // Shadow color
            globals.ctx.shadowBlur = 4;       // Blur radius for shadow
            globals.ctx.shadowOffsetX = 2;    // Horizontal shadow offset
            globals.ctx.shadowOffsetY = 2;    // Vertical shadow offset
        
            // Draw the menu items
            globals.ctx.fillStyle = "white";  // Text color
            globals.ctx.font = "20px emulogic";
            globals.ctx.fillText("New Game", 100, 150);
            globals.ctx.fillText("Story", 100, 200);
            globals.ctx.fillText("Controls", 100, 250);
            globals.ctx.fillText("High Score", 100, 300);


        }

    export function renderNewGame() {    
    
    
        globals.ctx.drawImage(globals.bImages[Back.N], 0, 0, globals.canvas.width, globals.canvas.height);


        darkenBackground(globals.canvas, 0.3);  // Darkens only the background




        // Shadow properties
        globals.ctx.shadowColor = "black"; // Shadow color
        globals.ctx.shadowBlur = 5; // Blur radius for shadow
        globals.ctx.shadowOffsetX = 10; // Horizontal shadow offset
        globals.ctx.shadowOffsetY = 10; // Vertical shadow offset

        // Overlay text after the background is drawn
        globals.ctx.fillStyle = "gold";
        globals.ctx.font = "12px emulogic";
        globals.ctx.fillText("Chapter 2: Dreams Of Twilight", 90, 20);
        globals.ctx.font = "7.5px emulogic";
        globals.ctx.fillText("A decrepit man laid sick on a great throne. The throne stunk", 20, 50);
        globals.ctx.fillText("of black magic. Thousand of dried bones surrounded it,", 20, 80);
        globals.ctx.fillText("scattered, on brimstone that made up a regal hall worthy", 20, 110)
        globals.ctx.fillText("of a Dark lord. Glaring, pointing a finger at the lone shadow", 20, 140)
        globals.ctx.fillText("before him, the sick elder gasped\"Joseph is out of your reach.", 20, 170);
        globals.ctx.fillText( "And there is not much left of him. You, a sliver of his psyche,", 20, 200);
        globals.ctx.fillText("could never leave this terrible place. You could never reach me...", 20, 230);
        globals.ctx.fillText("YOU!!! THE NIGHTMARE WILL DEVOUR YOU!!!...\"", 20, 260);




    }   
    function darkenBackground(canvas, amount) {
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(0, 0, 0, ${amount})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';  // Reset the blending mode
    }
    
    
    

    export function renderNewGame1() {

        globals.ctx.drawImage(globals.bImages[Back.S], 0, 0, globals.canvas.width, globals.canvas.height);

    

        // Shadow properties
        globals.ctx.shadowColor = "black"; // Shadow color
        globals.ctx.shadowBlur = 4; // Blur radius for shadow
        globals.ctx.shadowOffsetX = 2; // Horizontal shadow offset
        globals.ctx.shadowOffsetY = 2; // Vertical shadow offset

        // Overlay text after the background is drawn
        globals.ctx.fillStyle = "white";
        globals.ctx.font = "7.5px emulogic";
        globals.ctx.fillText("JOE SLEPT...", 20, 100)
        globals.ctx.fillText("\"Back to sleep, Arent ya?\"", 20, 120);
        globals.ctx.fillText("\"...\"", 20, 140);
        globals.ctx.fillText("\"pst pst wake up!!!\", a voice whispered", 20, 160);
        globals.ctx.fillText("\"...\"", 20, 180);
        globals.ctx.fillText("\"such a pity. Little rest during the daylight\", another said", 20,200);
        globals.ctx.fillText("\"now, back again, succumbed in stirling shadows.\"", 20, 220);
        globals.ctx.fillText("\"for a new chapter…,\", two voices echoed", 20, 240);
        globals.ctx.font = "15px emulogic";
        globals.ctx.fillText("ARE YOU READY?", 280, 300);
        globals.ctx.fillText("PRESS ENTER", 280, 320);

    }

    export function renderHighScore() {
    

        globals.ctx.drawImage(globals.bImages[Back.H], 0, 0, globals.canvas.width, globals.canvas.height);

        // Shadow properties
        globals.ctx.shadowColor = "black"; // Shadow color
        globals.ctx.shadowBlur = 4; // Blur radius for shadow
        globals.ctx.shadowOffsetX = 2; // Horizontal shadow offset
        globals.ctx.shadowOffsetY = 2; // Vertical shadow offset

        // Overlay text after the background is drawn
        globals.ctx.fillStyle = "gold";
        globals.ctx.font = "30px emulogic"; // Change font size
        globals.ctx.fillText("HIGHSCORE", 140, 50);
        globals.ctx.fillStyle = "white";
        globals.ctx.font = "15px emulogic";
        globals.ctx.fillText("1. AAAA --------> 999999", 80, 120);
        globals.ctx.fillText("2. BBBB --------> 896546", 80, 160)
        globals.ctx.fillText("3. CCCC --------> 50000", 80, 200)
        globals.ctx.fillText("BACK", 350, 300)
        // ctx.fillText("PRESS ENTER", 400, 480)

        };

    export function renderControls() {
        // Draw everything initially
        drawControlsScreen();
        
        // Start the animation for the light
        animateLight(globals.ctx, 261, 70, 50); // Position: (400, 250), Radius: 100
    }
    
    function drawControlsScreen() {
        // Draw the background image
        globals.ctx.drawImage(globals.bImages[Back.CON], 0, 0, globals.canvas.width, globals.canvas.height);
        darkenBackground(globals.canvas, 0.3); // Darkens the background after it's redrawn

    
        // Apply shadow properties
        globals.ctx.shadowColor = "black";
        globals.ctx.shadowBlur = 2;
        globals.ctx.shadowOffsetX = 5;
        globals.ctx.shadowOffsetY = 10;
    
        // Draw overlay text
        globals.ctx.fillStyle = "lightblue";
        globals.ctx.font = "20px emulogic";
        globals.ctx.fillText("CONTROLS", 180, 50);
        globals.ctx.font = "12px emulogic";
        globals.ctx.fillText("W ----> UP", 50, 120);
        globals.ctx.fillText("S ----> DOWN", 50, 160);
        globals.ctx.fillText("A ----> LEFT", 50, 200);
        globals.ctx.fillText("D ----> RIGHT", 50, 240);
        globals.ctx.fillText("K ----> Attack", 300, 120);
        globals.ctx.fillText("J ----> Special", 300, 160);
        globals.ctx.fillText("E ----> Interact", 300, 200);
        globals.ctx.fillText("BACK", 400, 300);
    }
    
    // Light animation logic
    let lightIntensity = 0.8;
    let increasing = false;
    
    function animateLight(ctx, x, y, radius) {
        // Adjust light intensity
        if (increasing) {
            lightIntensity += 0.06;
            if (lightIntensity >= 1) increasing = false;
        } else {
            lightIntensity -= 0.06;
            if (lightIntensity <= 0.6) increasing = true;
        }
    
        // Clear the entire canvas (required for animation)
        globals.ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        // Redraw everything
        drawControlsScreen();
    
        // Draw the flashing light
        drawLightPost(ctx, x, y, radius, lightIntensity);
    
        // Request the next animation frame
        // requestAnimationFrame(() => animateLight(ctx, x, y, radius));
    }
    
    function drawLightPost(ctx, x, y, radius, intensity) {
        // Create radial gradient for the light effect
        const gradient = globals.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 100, ${intensity})`);
        gradient.addColorStop(1, `rgba(255, 255, 100, 0)`);
    
        // Draw the light effect
        globals.ctx.beginPath();
        globals.ctx.arc(x, y, radius, 0, Math.PI * 2);
        globals.ctx.fillStyle = gradient;
        globals.ctx.fill();
    }
    

    export function renderover() {
    
      
        globals.ctx.drawImage(globals.bImages[Back.OVER], 0, 0, globals.canvas.width, globals.canvas.height);
        darkenBackground(globals.canvas, 0.2);  // Darkens only the background

        // Shadow properties
        globals.ctx.shadowColor = "black"; // Shadow color
        globals.ctx.shadowBlur = 4; // Blur radius for shadow
        globals.ctx.shadowOffsetX = 2; // Horizontal shadow offset
        globals.ctx.shadowOffsetY = 10; // Vertical shadow offset

        // Overlay text after the background is drawn
        globals.ctx.fillStyle = "white";
        globals.ctx.font = "40px emulogic"; // Change font size
        globals.ctx.fillText("GAME OVER", 80, 100);
        globals.ctx.font = "9px emulogic";
        globals.ctx.fillText("\"Of all the things I've lost, I miss my mind", 100, 200);
        globals.ctx.fillText("the most.\"", 100, 220);
        globals.ctx.fillText("Gerald Way.", 360, 240);
        globals.ctx.font = "20px emulogic";
        globals.ctx.fillText("TRY AGAIN", 300, 300)

        };
    

    
    // export function showScreen(over) {
    //     // Hide all canvases
    //     const screens = document.querySelectorAll("canvas");
    //     screens.forEach(screen => (screen.style.display = "none"));
    
    //     // Show the selected canvas
    //     document.getElementById(over).style.display = "block";
    // }
