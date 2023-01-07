// console.log('hiya world')

// SETUP ---------------------------------------------

// Grabs the canvas.

const game = document.getElementById('canvas')

//grabs the container background color
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
    constructor(x, y, width, height, imageSrc, scale, offset = {x: 0, y: 0}, sprites) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.health = 100
        this.invul = false
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.offset = offset
        this.sprites = sprites
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        // console.log(this.sprites)
        this.render = function () {
            // ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
        draw() {
            ctx.drawImage(
                this.image, 
                this.x - this.offset.x, 
                this.y - this.offset.y, 
                this.image.width * this.scale, 
                this.image.height * this.scale)
            }
        update() {
            this.draw()
            }
}


// class for swords

class Sword {
    constructor (x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.thrust = false
        this.render = function () {
            // ctx.fillstyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}


// SOUNDS ----------------------------------------------------  

function sound(src) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    this.sound.style.display = 'none'
    this.sound.volume = 1
    document.body.appendChild(this.sound)
    this.play = function(){
        this.sound.play()
    }
    this.stop = function(){
        this.sound.pause()
    }
}
// Define the sounds used in the game
const sndParry = new sound('sounds/Parry2.wav')
// const sndSwipe = new sound('sounds/Swipe.wav')
const sndHit = new sound('sounds/Hit1.wav')
const sndFlourish1 = new sound('sounds/Flourish1.wav')
const sndFlourish2 = new sound('sounds/Flourish2.wav')
const sndTheme = new sound('sounds/Theme2.mp3')
const sndTimer1 = new sound('sounds/Timer1.wav')
const sndTimer2 = new sound('sounds/Timer2.wav')
const sndCrowd = new sound('sounds/Crowd2.wav')

// PLAYERS -----------------------------------------

// creates the players and the swords
const player1 = new Fencer(
    300, 
    450, 
    80, 
    120, 
    './img/Fencer.png', 
    2, 
    offset = {x: 12, y: 65},
    sprites = {
    idle: {
        imageSrc: './img/Fencer.png'
    },
    thrust: {
        imageSrc: './img/FencerThrust.png'
    },
    defend: {
        imageSrc: './img/FencerDefend.png'
    }})

const player2 = new Fencer(
    900, 
    450, 
    80, 
    120, 
    './img/Fencer2.png', 
    2, 
    offset = {x: 210, y: 65},
    sprites = {
        idle: {
            imageSrc: './img/Fencer2.png'
        },
        thrust: {
            imageSrc: './img/FencerThrust2.png'
        },
        defend: {
            imageSrc: './img/FencerDefend2.png'
        }})

const player2Sword = new Sword(880, 511, 100, 20)
const player1Sword = new Sword(300, 490, 100, 20)


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
            player1Sword.x += 125
            player1Sword.thrust = true
            player1.image = player1.sprites.thrust.image
            // Play swish sound
            // sndSwipe.play()
        break
        case !isRepeating && 73:
            player2Sword.x -= 125
            player2Sword.thrust = true
            player2.image = player2.sprites.thrust.image
            // Play swish sound
            // sndSwipe.play()
        break
        // causes the swords to parry when pushed.
        case !isRepeating && 83:
            player1Sword.x += 80
            player1Sword.y -= 20
            player1Sword.width = 20
            player1Sword.height = 100
            player1.invul = true
            player1.image = player1.sprites.defend.image
        break
        case !isRepeating && 75:
            player2Sword.y -= 50
            player2Sword.width = 20
            player2Sword.height = 100
            player2.invul = true
            player2.image = player2.sprites.defend.image
        break
    }   
}

const swordReturn = function (key) {
    // returns swords after attack
    if (key.toLowerCase() == 'w') { 
        player1Sword.x -= 125, 
        player1Sword.thrust = false, 
        player1.image = player1.sprites.idle.image
    }
    if (key.toLowerCase() == 'i') { 
        player2Sword.x += 125, 
        player2Sword.thrust = false, 
        player2.image = player2.sprites.idle.image
    }
    // returns swords after parry
    if (key.toLowerCase() == 's') { 
        player1Sword.x -= 80, 
        player1Sword.y += 20, 
        player1Sword.width = 100, 
        player1Sword.height = 20, 
        player1.invul = false, 
        player1.image = player1.sprites.idle.image
    }
    if (key.toLowerCase() == 'k') { 
        player2Sword.y += 50, 
        player2Sword.width = 100, 
        player2Sword.height = 20, 
        player2.invul = false, 
        player2.image = player2.sprites.idle.image
    }   
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
            player2.x += 130
            player2Sword.x += 130
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
        player1.x -= 130
        player1Sword.x -= 130
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

    document.getElementById('Player1Health').style.width = player1.health + '%'
    // Update player 2 health bar
    document.getElementById('Player2Health').style.width = player2.health + '%'
    // Update player 1 health bar

    // render player1
    player1.update()
    // render player2
    player2.update()

    // Update player 1 points
    document.getElementById('player1wins').innerText = 'Player 1 Points: ' + player1Wins
    // Update player 2 points
    document.getElementById('player2wins').innerText = 'Player 2 Points: ' + player2Wins

    if (player1.health > 0) {
    // player1.render()
    // player1Sword.render()
    detectHit1()
    checkOffStage(player1)
    } 
    // code to tally player wins
    else {
        player2Wins += 1
        if (player2Wins == 3) {
            sndCrowd.play()
            sndFlourish2.play()
            stopGameLoop()
            document.getElementById('msg').innerText = 'Player 2 Wins!'
            player1Wins = 0
            player2Wins = 0
        } else {
            document.getElementById('Player1Health').style.width = player1.health + '%'
            sndCrowd.play()
            sndFlourish1.play()
            stopGameLoop()
            document.getElementById('msg').innerText = 'Point for Player 2!'
            setTimeout(()=> {
            resetGame()
            }
            , 1500)
        }
    }
    if (player2.health > 0) {
    // player2.render()
    // player2Sword.render()
    detectHit2()
    checkOffStage(player2)
    } 
    // code to tally player wins
    else {
        player1Wins += 1
        if (player1Wins == 3) {
            sndCrowd.play()
            document.getElementById('Player2Health').style.width = player2.health + '%'
            sndFlourish2.play()
            stopGameLoop()
            document.getElementById('msg').innerText = 'Player 1 Wins!'
            player1Wins = 0
            player2Wins = 0
        } else {
            sndCrowd.play()
            document.getElementById('Player2Health').style.width = player2.health + '%'
            sndFlourish1.play()
            stopGameLoop()
            document.getElementById('msg').innerText = 'Point for Player 1!'
            setTimeout(()=> {
            resetGame()
            }
            , 1500)
        }
    }      
}

const music = (e) => {
    switch (e.keyCode) {
        case 77:
            sndTheme.play()
            break
    }
}

// EVENT LISTENERS --------------------------

document.addEventListener('keydown', movementHandler)
document.addEventListener('keydown', music)
document.addEventListener('keydown', attackHandler)

document.addEventListener('keyup', (e) => {
    if (['w', 's', 'i', 'k'].includes(e.key)) {
        swordReturn(e.key)
        // clears list of pressed keys when key is released.
        pressedKeys[e.keyCode] = false
        
    }
})



// INTERVAL ----------------------------------

let gameInterval

const stopGameLoop = () => { 
    clearInterval(gameInterval)
}

const runGameLoop = () => { 
    gameInterval = setInterval(gameLoop, 20)
    reset.addEventListener('click', resetGame)
}

// Stops current loop, counts down, and then starts a new round
const resetGame = () => {
    sndTheme.stop()
    stopGameLoop()
    countDown()
}

// Countdown timer to starting a new game
timeLeft = 4;
const countDown = () => {
	timeLeft--
	document.getElementById('msg').innerText = timeLeft
	if (timeLeft > 0) {
        sndTimer1.play()
		setTimeout(countDown, 1000)
	} else {
        sndTimer2.play()
        document.getElementById('msg').innerText = 'En garde!'
        timeLeft = 4
        newRound()
    }
}

// The rest of the new round actions after the delay
const newRound = () => {
    document.getElementById('mainscreen').style.visibility = 'hidden'
    document.getElementById('canvas').style.backgroundImage = 'url("../img/StadiumBG.png")'
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

addEventListener('DOMContentLoaded', () => {
});

reset.addEventListener('click', resetGame)
