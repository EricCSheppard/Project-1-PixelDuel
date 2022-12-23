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

// Set up class for fencers

class Fencer {
    
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.health = 100
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

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

const player1 = new Fencer(200, 450, 80, 120, 'green')
const player1Sword = new Sword(210, 490, 120, 20, 'green')

const player2 = new Fencer(900, 450, 80, 120, 'blue')
const player2Sword = new Sword(850, 510, 120, 20, 'green')


// Need to set up a movement handler for each player.

// MOVEMENT HANDLER -------------------------------

const movementHandler = (e) => {
    switch (e.keyCode) {
        // Player 1 move left
        case (65):
            player1.x -= 20
            player1Sword.x -= 20 
            break
        // Player 1 move right
        case (68):
            player1.x += 20
            player1Sword.x += 20
            break
        // Player 2 move left
        case (37):
            player2.x -= 20
            player2Sword.x -= 20
            break
        // Player 2 move right
        case (39):
            player2.x += 20
            player2Sword.x += 20
            break
    }
}

// ATTACK FUNCTION --------------------------



// GAME LOOP ---------------------------------

const gameLoop = () => {

 // first clear the screen
    ctx.clearRect(0,0, game.width, game.height)


    player1.render()
    player1Sword.render()

    player2.render()
    player2Sword.render()



}




// INTERVAL ----------------------------------

const gameInterval = setInterval(gameLoop, 30)

const stopGameLoop = () => { clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', movementHandler)
    
    // game loop interval
gameInterval    
})