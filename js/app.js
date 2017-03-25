/**
* Represent any character in the game
* @constructor
* @param {int} x - x cooridnate in the screen 
* @param {int} y - y cooridnate in the screen
* @param {string} sprite - relative path to character pic
*/
var Character =  function(x,y,sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};
/**
* Represent Gem in the game
* @constructor
* @param {int} x - x cooridnate in the screen 
* @param {int} y - y cooridnate in the screen
* @param {string} sprite - relative path to character pic
*/
var Gem = function(x,y,sprite){
    Character.call(this,x,y,sprite);
};
Gem.prototype = Object.create(Character.prototype);
Gem.prototype.constructor = Gem;
/**
* Represent Enemy in the game
* @constructor
* @param {int} x - x cooridnate in the screen 
* @param {int} y - y cooridnate in the screen
* @param {int} s - speed of the enemy
*/
var Enemy = function(x,y,s) {    
    Character.call(this,x,y,'images/enemy-bug.png');    
    this.speed = s;
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
/**
* Represent Player in the game
* @constructor
*/
var Player = function(){
    Character.call(this,200,400,'images/char-boy.png');    
    this.dir ='';
    this.move = 0;
    this.life = 3;
    this.lvl  = 1;
    this.blueGem = 0;
    this.greenGem = 0;
    this.orangeGem = 0;
};
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
var player = new Player();
// Gem functions and prototypes
Gem.spirites = ['images/Gem Blue.png','images/Gem Green.png','images/Gem Orange.png'];
/** 
* Draw a Gem on the screen
*/
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// all gems inside the game
var allGems = [];
/** 
* add Gems to the screen , max 3 Gems appears in different places
*/
function addGem(){
    if(allGems.length < 3){        
        var x = Math.floor(Math.random()*5)*ctx.cellWidth +30;
        var y = (Math.floor(Math.random()*5+1)*ctx.cellHeight) + 60;
        // prevent put 2 gem in the same position
        allGems.forEach(function(gem) {
            if(gem.x === x && gem.y === y)
                addGem();
                return;
        });
        allGems.push(new Gem(x,y,
                           Gem.spirites[Math.floor(Math.random()*3)]));
    }
}
/** 
* Call add game every 5 seconds
*/
window.setInterval(function(){
    addGem();
}, 5000);
/** 
* Check collision between the player and gems
* then we increase the counter of this gem
* and remove the gem from the screen
*/
Gem.prototype.checkCollisions = function(index){
    var gemY = (this.y - 75) , gemX = (this.x - 32); 
    if(gemX + ctx.cellWidth > player.x && gemX < player.x + ctx.cellWidth && (gemY + ctx.cellHeight > player.y && gemY < (player.y+ ctx.cellHeight) )){
        if(this.sprite === 'images/Gem Blue.png'){
            player.blueGem++;
            $('#blueGem').text(player.blueGem);
        }else if(this.sprite === 'images/Gem Green.png'){
            player.greenGem++;
            $('#greenGem').text(player.greenGem);
        }else if(this.sprite === 'images/Gem Orange.png'){
            player.orangeGem++;
            $('#orangeGem').text(player.orangeGem);
        }
        allGems.splice(index,1);
    }
};
// Enemy functions and prototypes
// enemies applicable y positions
Enemy.startHeights = [68,151,234];
// all enimes in the game
var allEnemies=[];
/** 
* Update the enemy's position
* @param {long} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {    
    this.x+=(this.speed*dt);
    if(this.x > 500){
        this.x  = -100;
        this.y  = Enemy.startHeights[Math.floor(Math.random()*Enemy.startHeights.length)];
        this.speed = Math.floor(Math.random()*100)+100;
    }
};
/** 
* Check collision between the player and enemies
* if exist we lose a heart
*/
Enemy.prototype.checkCollisions = function(){
    if(this.x + ctx.cellWidth > player.x && this.x < player.x + ctx.cellWidth && (this.y + ctx.cellHeight > player.y && this.y < player.y+ ctx.cellHeight)){

       console.log(this.y + " "+parseInt(this.y + ctx.cellHeight));
       console.log(player.y + " "+parseInt(player.y + ctx.cellHeight));

       Lose(); 
    }
};
/** 
* init all eneimes in the game, # of enimes = player level
*/
function initEnimes(){
    allEnemies.splice(0);
    for(var i = 0 ; i < player.lvl; i++){
        allEnemies.push(new Enemy(-100,Enemy.startHeights[Math.floor(Math.random()*Enemy.startHeights.length)],Math.floor(Math.random()*100)+100));
    }
}
initEnimes();
/** 
* Draw the enemy on the screen
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Player functions and prototypes
/** 
* reset player positions after each level
*/
var ResetPlayerPos = function(){
    player.x = 200;            
    player.y = 400;    
};
/** 
* update movement of player, not need to multiply with dt
*/
Player.prototype.update = function() {    
    if(this.move > 0){
        if(this.dir === 'up'){
            if(this.y > 90){
                    this.y-=this.move;
            }
            else{
            if(player.blueGem+player.greenGem+player.orangeGem >= player.lvl)
                Won();
            }                
        }
        if(this.dir === 'left' && this.x > 0)
            this.x-=this.move;
        else if(this.dir === 'right' && this.x < 400)
            this.x+=this.move;
        else if(this.dir === 'up'){
        }
        else if(this.dir === 'down' && this.y < 400)
            this.y+=this.move;       
    }
    this.move=0;
    this.dir='';
    console.log(this.x);
};
/** 
* Draw the player on the screen
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/** 
* Hanlde user inputs
*/
Player.prototype.handleInput = function(dir){
    this.dir = dir; 
    if(dir === 'left'||dir === 'right')
        this.move = ctx.cellWidth;
    else
        this.move = ctx.cellHeight;
};
// general functions
/** 
* Update player score
* update hearts if Lose
* update level if won
*/
var updateScores = function(){
    $('#lvl').text("Level: "+player.lvl);
    var sz = player.life-$('#hearts').children().length;
    for(var i = 0 ; i < sz;i++){
        $('#hearts').append(HTMLHEARTS);
    }
};
updateScores();
/** 
* inCase of collision with the enemy you lose
* your hearts will reduce by one
* if no more hearts the game will over
*/
var Lose = function(){
    player.life--;
    ResetPlayerPos();
    $('#hearts').children().last().remove();
    if(player.life === 0){
        confirm("Game Over!!!\n lvl:"+player.lvl+"\n Blue Gem: "+player.blueGem + "\n Green Gem: "+player.greenGem+"\n Orange Gem: "+player.orangeGem);
        location.reload();
    }
};
/** 
* won function inCase of crossing to river with required gems
*/
var Won = function(){
    player.lvl++;
    ResetPlayerPos();
    updateScores();
    initEnimes();
};
/** 
* This listens for key presses and sends the keys to
* Player.handleInput() method.
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});