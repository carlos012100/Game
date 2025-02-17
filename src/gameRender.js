import globals from "./globals.js";
import {Game, SpriteID} from "./constants.js";
import {ParticleState, Tile, ParticleID, Back, State} from "./constants.js";


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

function renderParticles() {
    for (let i = 0; i < globals.particles.length; ++i) {
        const particle = globals.particles[i];
        renderParticle(particle);
    }
}

function renderFireParticleHeal(particle) {
    if (particle.state != ParticleState.OFF) {
        globals.ctx.save();

        globals.ctx.globalAlpha = particle.alpha; // Set transparency

        // Draw white tint
        globals.ctx.globalCompositeOperation = "source-atop";
        globals.ctx.fillStyle = "lightblue";
        globals.ctx.filter = 'blur(2px) saturated(500%)';
        globals.ctx.fillRect(particle.xPos - particle.radius, particle.yPos - particle.radius, particle.radius * 2, particle.radius * 2);

        // Reset composite operation
        globals.ctx.globalCompositeOperation = "source-over";

        // Draw the particle image
        const particleImage = globals.particleImages[0]; // Get the preloaded image
        globals.ctx.drawImage(particleImage, particle.xPos - particle.radius, particle.yPos - particle.radius, particle.radius * 2, particle.radius * 2);

        globals.ctx.restore();
    }
}

function renderBlessingParticle(particle) {
    if (particle.state === ParticleState.ON) {
        globals.ctx.save();
        globals.ctx.globalAlpha = particle.alpha;  // Set transparency
        // Make the particle brighter using a stronger color and glow effect
        globals.ctx.fillStyle = "rgba(255, 215, 0, 0.8)";  // Brighter gold color (increased opacity)

        // Optional: Add a glow effect
        globals.ctx.shadowColor = "rgba(255, 215, 0, 1)";  // Same gold color for glow
        globals.ctx.shadowBlur = 200;  // Apply glow blur effect

        // Draw the particle (circle)
        globals.ctx.beginPath();
        globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, 2 * Math.PI);
        globals.ctx.fill();
        globals.ctx.restore();
    }
}

function renderFireParticle(particle) {
    if (particle.state != ParticleState.OFF) {
        globals.ctx.save();

        globals.ctx.globalAlpha = particle.alpha; // Set transparency

        // Draw white tint
        globals.ctx.globalCompositeOperation = "source-atop";
        globals.ctx.fillStyle = "lightblue";
        globals.ctx.filter = 'blur(2px) saturated(500%)';
        // globals.ctx.filter = 'hue-rotate(180deg)'; // Change the color
        globals.ctx.fillRect(particle.xPos - particle.radius, particle.yPos - particle.radius, particle.radius * 2, particle.radius * 2);

        // Reset composite operation
        globals.ctx.globalCompositeOperation = "source-over";

        // Draw the particle image
        const particleImage = globals.particleImages[0]; // Get the preloaded image
        globals.ctx.drawImage(particleImage, particle.xPos - particle.radius, particle.yPos - particle.radius, particle.radius * 2, particle.radius * 2);

        globals.ctx.restore();
    }
}

function renderParticle(particle) {
    const type = particle.id;
    switch (type) {
        case ParticleID.EXPLOTION:
            if (globals.sprites[0].state === State.FAINT) {
                renderExplotionParticle(particle);
            }
            break;
        case ParticleID.FIRE:
            renderFireParticle(particle);
            break;
        case ParticleID.FIREHEAL:
            renderFireParticleHeal(particle);
            break;
        case ParticleID.BLESSING:
            renderBlessingParticle(particle);
            
    }
}

function renderExplotionParticle(particle) {
    if (particle.state != ParticleState.OFF) {
        globals.ctx.fillStyle = "black";
        globals.ctx.globalAlpha = particle.alpha; // Set alpha
        globals.ctx.beginPath();
        globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2);
        globals.ctx.fill();
        globals.ctx.globalAlpha = 0.5; // Reset alpha
    }
}

// function drawGame(){

//     //Borramos la pantalla entera
//     if (particle.state != ParticleState.OFF)
//     {
//         globals.ctx.fillStyle = "black";
//         globals.ctx.globalAlpha = particle.alpha; //Set alpha
//         globals.ctx.beginPath();
//         globals.ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2);
//         globals.ctx.fill();
//         globals.ctx.globalAlpha = 0.5 //Reset alpha
//     }
// }

function drawGame(){

    //Borramos la pantalla entera

    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);

    moveCamara();

    //Dibujamos el mapa (nivel)
    renderMap();
    
    drawSprites();

    renderParticles();

    restoreCamara();

    if (globals.gameState === Game.PLAYING){
        renderHUD();
    }



    //Pintamos los FPS en pantalla

    // globals.ctx.fillText("FPS: " + 1 / globals.deltaTime, 30, 30);


}


function renderSprite(sprite) {
    // Check if the sprite is the player or an enemy
    const isPlayer = sprite === globals.player; // Assuming globals.player is the player object
    
    // For the player, adjust position by the camera
    const screenX = isPlayer ? Math.round(sprite.xPos - globals.camera.x) : Math.round(sprite.xPos);
    const screenY = isPlayer ? Math.round(sprite.yPos - globals.camera.y) : Math.round(sprite.yPos);
    
    // Calculate the initial tile position
    const xPosInit = sprite.imageSet.initCol * sprite.imageSet.xGridWidth;
    const yPosInit = sprite.imageSet.initFil * sprite.imageSet.yGridHeight;

    // Calculate the tilemap position to draw
    const xTile = xPosInit + sprite.frames.framesCounter * sprite.imageSet.xGridWidth + sprite.imageSet.xOffset;
    const yTile = yPosInit + sprite.state * sprite.imageSet.yGridHeight + sprite.imageSet.yOffset;

    // Draw the sprite's frame at the calculated position
    globals.ctx.drawImage(
        globals.tileSets[Tile.PROTA_64], // Assuming you are using the PROTA_64 tile set
        xTile, yTile,                   // Source X and Y (from tile sheet)
        sprite.imageSet.xSize,          // Source width
        sprite.imageSet.ySize,          // Source height
        screenX, screenY,               // Destination on canvas (with or without camera adjustment)
        sprite.imageSet.xSize,          // Destination width
        sprite.imageSet.ySize           // Destination height

    );

}


function drawHitBox (sprite)
{
    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox.xOffset);

    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox.yOffset);

    const w1 = sprite.hitBox.xSize;
    
    const h1 = sprite.hitBox.ySize;

    globals.ctx.strokeStyle = "red";

    globals.ctx.strokeRect(x1, y1, w1, h1);

}

function drawAttackBox (sprite){


    sprite.hitBox.x1 = Math.floor(sprite.xPos) + Math.floor(sprite.activeHitbox.xOffset); 
    sprite.hitBox.y1 = Math.floor(sprite.yPos) + Math.floor(sprite.activeHitbox.yOffset);
    sprite.hitBox.w1 = sprite.activeHitbox.xSize;
    sprite.hitBox.h1 = sprite.activeHitbox.ySize;
    globals.ctx.strokeStyle = "red";
    globals.ctx.strokeRect(sprite.hitBox.x1, sprite.hitBox.y1, sprite.hitBox.w1, sprite.hitBox.h1);

}
function drawlightbox(sprite) {
    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.activeLight.xOffset); 
    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.activeLight.yOffset);
    const w1 = sprite.activeLight.xSize;
    const h1 = sprite.activeLight.ySize;

    console.log(`Drawing Light Hitbox at: x=${x1}, y=${y1}, w=${w1}, h=${h1}`);

    if (w1 > 0 && h1 > 0) { // Ensure valid dimensions
        globals.ctx.strokeStyle = "yellow"; 
        globals.ctx.lineWidth = 3; // Make it more visible
        globals.ctx.strokeRect(x1, y1, w1, h1);
    } else {
        console.log("Invalid hitbox size, not drawing.");
    }
}


function drawSprites() {
    for (let i = 0; i < globals.sprites.length; ++i) {
        const sprite = globals.sprites[i];

        // Only apply `isDrawn` check to the player
        if (sprite.id === SpriteID.PLAYER) {  
            if (sprite.isDrawn) {
                renderSprite(sprite, globals.ctx);
            }
        } else if (sprite.id !== SpriteID.HEART) {
            renderSprite(sprite, globals.ctx);
        }

        // Draw hitboxes if they exist
        if (sprite.hitBox) {
            drawHitBox(sprite);
        }

        if (sprite.activeHitbox && sprite.isPlayerAttacking) {
            drawAttackBox(sprite);
            console.log("Active attack hitbox: ", sprite.activeHitbox);
        }

        if (sprite.activeLight && sprite.lightState) {
            drawlightbox(sprite);
            console.log("Light hitbox drawn: ", sprite.lightHitbox);
        }  
    }
}


        // if (sprite.hitBox) {
        //     drawHitBox(sprite);  // Only draw hitbox for sprites with hitBox
        //     // Other drawing logic for the sprite here
        // }

        
        

    
    // function drawSpriteRectangle(sprite){

    //     //Dato del sprite
    //     const x1 = Math.floor(sprite.xPos);
    //     const y1 = Math.floor(sprite.yPos);
    //     const w1 = sprite.imageSet.xSize;
    //     const h1 = sprite.imageSet.ySize;

    //     globals.ctx.fillStyle = "green";
    //     globals.ctx.fillRect(x1, y1, w1, h1);

    // }
    
    function moveCamara()
    {
        const xTranslation = -globals.camera.x;
        const yTranslation = -globals.camera.y;
    
        globals.ctx.translate(xTranslation, yTranslation);
    }
    function restoreCamara()
    {
        globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function renderMap() {
        const brickSize = globals.level.imageSet.xGridWidth;
        const levelData = globals.level.data;  // Assuming levelData is now a 3D array with layers
        const num_fil = levelData[0].length;   // Height (rows)
        const num_col = levelData[0][0].length; // Width (columns)
    
        // Loop through the level data and draw each tile
        for (let layer = 0; layer < 3; ++layer) {
            for (let i = 0; i < num_fil; ++i) {
                for (let j = 0; j < num_col; ++j) {
                    const tileIndex = levelData[layer][i][j];
    
                    // Skip if the tile is empty (0 or some value you use for empty tiles)
                    if (tileIndex === 0) continue;
    
                    let xTile, yTile;
    
                    // Adjust this based on where the modified tiles are on your sheet
                    if (tileIndex === Tile.FLIPPED_TILE_1) {
                        xTile = 3 * brickSize;  // For example, the flipped tile is at column 4 on the sheet
                        yTile = 0;              // If the flipped tile is in the first row
                    } else if (tileIndex === Tile.FLIPPED_TILE_2) {
                        xTile = 4 * brickSize;
                        yTile = 0;
                    } else if (tileIndex === Tile.FLIPPED_TILE_3) {
                        xTile = 5 * brickSize;
                        yTile = 0;
                    } else {
                        // For other tiles
                        xTile = (tileIndex - 1) * brickSize;
                        yTile = 0;
                    }
    
                    const xPos = j * brickSize;
                    const yPos = i * brickSize;
    
                    globals.ctx.drawImage(
                        globals.tileSets[Tile.SIZE_32],  // The image file containing the tiles
                        xTile, yTile,                    // Source position on the tile sheet
                        brickSize, brickSize,            // Source width and height of the tile
                        xPos, yPos,                      // Position on the canvas
                        brickSize, brickSize             // Destination width and height on the canvas
                    );
                }
            }
        }
  
    }
    
    

    function updateHudHearts ()
    {
        const hearts = globals.sprites.filter(sprite => sprite.id === SpriteID.HEART);
        const destWidth = 25; // Adjust as needed for HUD scaling
        const destHeight = 28;  
        const startX = 0;
        const startY = 10;  

          // Clear the array of heart sprites and HUD area
        globals.heartSprites = []; // Clear the array
        globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);


          // Repopulate the array and draw hearts based on the current life value
    for (let i = 0; i < globals.life; i++) {
        const destX = startX + i * 28;

        // Add a heart sprite's position to the heartSprites array
        globals.heartSprites.push({ x: destX, y: startY });

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
        const mana = globals.manapoints;
        const madness = 20;
        const junk = 2;
        const score = globals.score;
        const highscore = globals.highscore;
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
        globals.ctxHUD.fillStyle = '#B22222';
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
        globals.ctxHUD.fillStyle = '#navy';
        globals.ctxHUD.fillRect(120, 15, mana, 5);
        404040
        //Madness
        globals.ctxHUD.font = '8px emulogic';
        globals.ctxHUD.fillStyle = 'lightblue';
        globals.ctxHUD.fillText("Sanity", 120, 35);
        globals.ctxHUD.fillStyle = '#8A2BE2';
        globals.ctxHUD.fillRect(120, 40, time/2, 5);

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
        globals.ctxHUD.fillStyle = 'lightblue';
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
        globals.ctx.fillText("GAME OVER", 80, 50);
        globals.ctx.font = "9px emulogic";
        globals.ctx.fillText("\"Of all the things I've lost, I miss my mind", 100, 100);
        globals.ctx.fillText("the most.\"", 100, 120);
        globals.ctx.fillText("Gerald Way.", 360, 140);
        globals.ctx.font = "20px emulogic";
        globals.ctx.fillText("TRY AGAIN", 300, 200)

        };

