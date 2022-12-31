// console.log('hiya world')

// Grabbing all of the elements for reference.

const game = document.getElementById('canvas')
const playerOneStatus = document.getElementById('player1status')
const playerTwoStatus = document.getElementById('player2status')

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

// creates the players and the swords

const player1 = new Fencer(200, 450, 80, 120, 'green')
const player1Sword = new Sword(200, 490, 100, 20, 'green')

const player2 = new Fencer(900, 450, 80, 120, 'blue')
const player2Sword = new Sword(880, 511, 100, 20, 'blue')



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
        case (37):
            player2.x -= 20
            player2Sword.x -= 20
            break
        // Player 2 plus sword move right
        case (39):
            player2.x += 20
            player2Sword.x += 20
            break
    }
}

// ATTACK / DEFEND FUNCTIONS --------------------------


const attackHandler = (e) => {
    switch (e.keyCode) {
        // causes the swords to thrust when pushed.
        case (86):
            player1Sword.x += 70
        break
        case (190):
            player2Sword.x -= 70
        break
        // causes the swords to parry when pushed.
        case (67):
            player1Sword.x += 80
            player1Sword.y -= 20
            player1Sword.width = 20
            player1Sword.height = 100
            player1.invul = true
        break
        case (191):
            // player2Sword.x += 40
            player2Sword.y -= 50
            player2Sword.width = 20
            player2Sword.height = 100
            player2.invul = true
        break
    }   
}

const swordReturn = function (key) {
    // returns swords after attack
    if (key.toLowerCase() == 'v') { player1Sword.x -= 70 }
    if (key.toLowerCase() == '.') { player2Sword.x += 70 }
    // returns swords after parry
    if (key.toLowerCase() == 'c') { player1Sword.x -= 80, player1Sword.y += 20, player1Sword.width = 100, player1Sword.height = 20}
    if (key.toLowerCase() == '/') { player2Sword.y += 50, player2Sword.width = 100, player2Sword.height = 20}
}


// GAME LOOP ---------------------------------

const gameLoop = () => {

 // first clear the screen
    ctx.clearRect(0,0, game.width, game.height)


    player1.render()
    player1Sword.render()

    player2.render()
    player2Sword.render()



}

// EVENT LISTENERS --------------------------

document.addEventListener('keydown', movementHandler)
document.addEventListener('keydown', attackHandler)

document.addEventListener('keyup', (e) => {
    if (['v', 'c', '.', '/'].includes(e.key)) {
        swordReturn(e.key)
    }
})



// INTERVAL ----------------------------------

const gameInterval = setInterval(gameLoop, 30)

const stopGameLoop = () => { clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    
    
    // game loop interval
gameInterval    
})