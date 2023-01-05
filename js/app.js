// console.log('hiya world')

// SETUP ---------------------------------------------

// Grabs the canvas.

const game = document.getElementById('canvas')

//grabs the background color
const background = document.getElementById('container').style.backgroundColor

// set player wins to 0
let player1Wins = 0
let player2Wins = 0

// Set context of game to 2d

const ctx = game.getContext('2d')

// Set computed size of canvas

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

game.height = 600   


// class for fencers

class Fencer {
    
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.health = 100
        this.invul = false
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// class for sword

class Sword {

    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.thrust = false
        this.render = function () {
            ctx.fillstyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// SOUNDS ----------------------------------------------------  

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// Define the sounds used in the game
const sndParry = new sound('sounds/parry.wav')
// const sndSwish = new sound('sounds/Swish2.wav')
const sndHit = new sound('sounds/Hit.wav')

// creates the players and the swords

const player1 = new Fencer(300, 450, 80, 120, 'black')
const player1Sword = new Sword(300, 490, 100, 20, 'black')

const player2 = new Fencer(900, 450, 80, 120, 'brown')
const player2Sword = new Sword(880, 511, 100, 20, 'brown')



// MOVEMENT HANDLER -------------------------------

const movementHandler = (e) => {
    switch (e.keyCode) {
        // Player 1 plus sword move left
        case (65):
            player1.x -= 20
            player1Sword.x -= 20 
            break
        // Player 1 plus sword move right
        case (68):
            player1.x += 20
            player1Sword.x += 20
            break
        // Player 2 plus sword move left
        case (74):
            player2.x -= 20
            player2Sword.x -= 20
            break
        // Player 2 plus sword move right
        case (76):
            player2.x += 20
            player2Sword.x += 20
            break
    }
}

// ATTACK / DEFEND FUNCTIONS --------------------------

//create array for pressed keys to stop repeating keystrokes
let pressedKeys = [];

const attackHandler = (e) => {
    const isRepeating = !!pressedKeys[e.keyCode]
    pressedKeys[e.keyCode] = true
    switch (e.keyCode) {
        // causes the swords to thrust when pushed.
        case !isRepeating && 87:
            player1Sword.x += 70
            player1Sword.thrust = true
            // Play swish sound
            // sndSwish.play()
        break
        case !isRepeating && 73:
            player2Sword.x -= 70
            player2Sword.thrust = true
            // Play swish sound
            // sndSwish.play()
        break
        // causes the swords to parry when pushed.
        case !isRepeating && 83:
            player1Sword.x += 80
            player1Sword.y -= 20
            player1Sword.width = 20
            player1Sword.height = 100
            player1.invul = true
        break
        case !isRepeating && 75:
            player2Sword.y -= 50
            player2Sword.width = 20
            player2Sword.height = 100
            player2.invul = true
        break
    }   
}

const swordReturn = function (key) {
    // returns swords after attack
    if (key.toLowerCase() == 'w') { player1Sword.x -= 70, player1Sword.thrust = false }
    if (key.toLowerCase() == 'i') { player2Sword.x += 70, player2Sword.thrust = false }
    // returns swords after parry
    if (key.toLowerCase() == 's') { player1Sword.x -= 80, player1Sword.y += 20, player1Sword.width = 100, player1Sword.height = 20, player1.invul = false}
    if (key.toLowerCase() == 'k') { player2Sword.y += 50, player2Sword.width = 100, player2Sword.height = 20, player2.invul = false}   
}


// HIT DETECTION------------------------------------------

// Universal hit detection for swords on bodies (probably won't work due to having to move the players in different directions.)

// const detectHit = (attackerSword, defender) => {
//     if (attackerSword.x < defender.x + defender.width
//         && attackerSword.x + attackerSword.width > defender.x
//         && attackerSword.y < defender.y + defender.height
//         && attackerSword.y + attackerSword.height > defender.y
//         && defender.invul == false ) {
//         console.log('HIT!') 
//         }
// }

// Individual hit detection for either player

const detectHit1 = () => {
    // player 1 hits player 2
    if (player1Sword.x < player2.x + player2.width
        && player1Sword.x + player1Sword.width > player2.x
        && player1Sword.y < player2.y + player2.height
        && player1Sword.y + player1Sword.height > player2.y
        // negates the body hit box if player is parrying
        && player2.invul == false
        // makes sure player is attacking so there is no hit when players simply walk into each other.
        && player1Sword.thrust == true ) {
            sndHit.play()
            // console.log('Player 2 HIT!')
            player2.x += 100
            player2Sword.x += 100
            player2.health -= 20
            // flash screen red when there is a hit
            document.getElementById('container').style.backgroundColor = 'red'
            // console.log(`Player 2's health is now ${player2.health}`)
            // resets background color after flash
            setTimeout(()=> {
                document.getElementById('container').style.backgroundColor = background
            }
            , 150)
        }
    // two swords connecting equals a parry
    if (player2Sword.x < player1Sword.x + player1Sword.width
        && player2Sword.x + player2Sword.width > player1Sword.x
        && player2Sword.y < player1Sword.y + player1Sword.height
        && player2Sword.y + player2Sword.height > player1Sword.y) {
            // console.log('Parry!')
            sndParry.play()
            player1.x -= 70
            player1Sword.x -= 70
            player2.x += 70
            player2Sword.x += 70
            // Flashes background grey for a parry.
            document.getElementById('container').style.backgroundColor = 'grey'
            // resets background color after flash
            setTimeout(()=> {
                document.getElementById('container').style.backgroundColor = background
            }
            , 150)
        }    
    // two players colliding while not attacking or defending to stop them from crossing
    if (player1.x < player2.x + player2.width
        && player1.x + player1.width > player2.x
        && player1.y < player2.y + player2.height
        && player1.y + player1.height > player2.y) {
            player1.x -= 70
            player1Sword.x -= 70
            player2.x += 70
            player2Sword.x += 70
        }
}

const detectHit2 = () => {

    // player 2 hits player 1
    if (player2Sword.x < player1.x + player1.width
        && player2Sword.x + player2Sword.width > player1.x
        && player2Sword.y < player1.y + player1.height
        && player2Sword.y + player2Sword.height > player1.y
        && player1.invul == false
        && player2Sword.thrust == true ) {
            sndHit.play()
            // console.log('Player 1 HIT!')
            player1.x -= 100
            player1Sword.x -= 100
            player1.health -= 20
            // flash screen red when there is a hit
            document.getElementById('container').style.backgroundColor = 'red'
            // console.log (`Player 1's health is now ${player1.health}`)
            // resets background color after flash
            setTimeout(()=> {
                document.getElementById('container').style.backgroundColor = background
            }
            , 150)
        }
        // parry hit detection in detectHit1 works for both players
        // body collision hit detection in detectHit1 works for both players
}

const checkOffStage = (player) => {
    // checks if a player is offstage and deducts health
    if (player.x < 0 || player.x + player.width > game.width) {
        // console.log('Return to stage!')
        player.health -= .5
    }
}

// GAME LOOP ---------------------------------------

const gameLoop = () => {
    
    // clear the screen
    ctx.clearRect(0,0, game.width, game.height)

    // Update player 2 health bar
    document.getElementById('Player2Health').style.width = player2.health + '%'
    // Update player 1 health bar
    document.getElementById('Player1Health').style.width = player1.health + '%'

    // Update player 1 points
    document.getElementById('player1wins').innerText = 'Player 1 Points: ' + player1Wins
    // Update player 2 points
    document.getElementById('player2wins').innerText = 'Player 2 Points: ' + player2Wins

    // Old method of displaying player health as a number
    // document.getElementById('player1status').innerText = `* Player 1 - ${player1.health} *`
    // document.getElementById('player1status').style.color = player1.color
    
    // document.getElementById('player2status').innerText = `* Player 2 - ${player2.health} *`
    // document.getElementById('player2status').style.color = player2.color

    if (player1.health > 0) {
    // render player1 and sword
    player1.render()
    player1Sword.render()
    detectHit1()
    checkOffStage(player1)
    } 
    // code to tally player wins
    else {
        player2Wins += 1
        if (player2Wins == 3) {
            stopGameLoop()
            document.getElementById('msg').innerText = 'Player 2 Wins!'
            player1Wins = 0
            player2Wins = 0
            // document.getElementById('container').style.backgroundColor = player2.color
        } else {
        stopGameLoop()
        document.getElementById('msg').innerText = 'Point for Player 2!'
        setTimeout(()=> {
            resetGame()
        }
        , 1500)
    }
    }
    if (player2.health > 0) {
    // render player2 and sword
    player2.render()
    player2Sword.render()
    detectHit2()
    checkOffStage(player2)
    } 
    // code to tally player wins
    else {
        player1Wins += 1
        if (player1Wins == 3) {
            stopGameLoop()
            document.getElementById('msg').innerText = 'Player 1 Wins!'
            player1Wins = 0
            player2Wins = 0
            // document.getElementById('container').style.backgroundColor = player1.color
        } else {
        stopGameLoop()
        document.getElementById('msg').innerText = 'Point for Player 1!'
        setTimeout(()=> {
            resetGame()
        }
        , 1500)
        }
    }      
}

// EVENT LISTENERS --------------------------

document.addEventListener('keydown', movementHandler)
document.addEventListener('keydown', attackHandler)

document.addEventListener('keyup', (e) => {
    if (['w', 's', 'i', 'k'].includes(e.key)) {
        swordReturn(e.key)
        // clears list of pressed keys when key is released.
        pressedKeys[e.keyCode] = false;
        
    }
})

// INTERVAL ----------------------------------

let gameInterval

const stopGameLoop = () => { clearInterval(gameInterval)}

const runGameLoop = () => { 
    gameInterval = setInterval(gameLoop, 25)
    reset.addEventListener('click', resetGame)
}

// Game starts on button press so this is not necessary
// document.addEventListener('DOMContentLoaded', runGameLoop)

const resetGame = () => {
    stopGameLoop()
    countDown()
    setTimeout(gameDelay, 3000)
}

timeLeft = 4;

const countDown = () => {
	timeLeft--;
	document.getElementById('msg').innerText = timeLeft
	if (timeLeft > 0) {
		setTimeout(countDown, 1000);
	} else {
        document.getElementById('msg').innerText = 'En garde!'
        timeLeft = 4
    }
}

const gameDelay = () => {
    document.getElementById('container').style.backgroundColor = background
    // console.log('clicked reset')
    // document.getElementById('msg').innerText = 'En garde!'
    player1.health = 100
    player1.x = 300
    player1Sword.x = 300
    player2.health = 100
    player2.x = 900
    player2Sword.x = 880
    pressedKeys = []
    reset.removeEventListener('click', resetGame)
    runGameLoop()
}

reset.addEventListener('click', resetGame)
