// class Gems
var Gem = function(x,y,sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}
// class Enemy
var Enemy = function(x,y,s) {    
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = s;
};
// Player class
var Player = function(){
    this.sprite = "images/char-boy.png";
    this.x = 200;
    this.y = 400;
    this.dir ='';
    this.move = 0;
    this.life = 3;
    this.lvl  = 1;
    this.blueGem = 0;
    this.greenGem = 0;
    this.orangeGem = 0;
}
var player = new Player();
// Gem functions and prototypes
Gem.spirites = ['images/Gem Blue.png','images/Gem Green.png','images/Gem Orange.png'];
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// all gems inside the game
var allGems = [];

    function addGem(){
        if(allGems.length < 3){        
            var x = Math.floor(Math.random()*5)*ctx.cellWidth +30;
            var y = (Math.floor(Math.random()*5+1)*ctx.cellHeight) + 60;
            allGems.push(new Gem(x,y,
                               Gem.spirites[Math.floor(Math.random()*3)]));
        }
    }

    window.setInterval(function(){
        addGem();
    }, 5000);
// check collision of gem with the player
Gem.prototype.checkCollisions = function(index){
    var gemY = (this.y - 75) , gemX = (this.x - 32); 
    if(gemX + ctx.cellWidth > player.x && gemX < player.x + ctx.cellWidth
    &&(gemY + ctx.cellHeight > player.y && gemY < (player.y+ ctx.cellHeight) )){
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
}
// Enemy functions and prototypes
// enemies y positions
Enemy.startHeights = [68,151,234];
// all enimes in the game
var allEnemies=[];
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {    
    this.x+=(this.speed*dt);
    if(this.x > 500){
        this.x  = -100;
        this.y  = Enemy.startHeights[Math.floor(Math.random()*Enemy.startHeights.length)];
        this.speed = Math.floor(Math.random()*100)+100;
    }
};
// check collision of enemy with player
Enemy.prototype.checkCollisions = function(){
    if(this.x + ctx.cellWidth > player.x && this.x < player.x + ctx.cellWidth
    &&(this.y + ctx.cellHeight > player.y && this.y < player.y+ ctx.cellHeight)){

       console.log(this.y + " "+parseInt(this.y + ctx.cellHeight));
       console.log(player.y + " "+parseInt(player.y + ctx.cellHeight));

       Lose(); 
    }
}
// init all eneimes in the game, # of enimes = player level
function initEnimes(){
    allEnemies.splice(0);
    for(var i = 0 ; i < player.lvl; i++){
        allEnemies.push(new Enemy(-100,Enemy.startHeights[Math.floor(Math.random()*Enemy.startHeights.length)],Math.floor(Math.random()*100)+100));
    }
}
initEnimes();
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Player functions and prototypes
// reset player positions after each level
var ResetPlayerPos = function(){
    player.x = 200;            
    player.y = 400;    
}
// update movement of player, not need to multiply with dt
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
// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// handle user input
Player.prototype.handleInput = function(dir){
    this.dir = dir; 
    if(dir === 'left'||dir === 'right')
        this.move = ctx.cellWidth;
    else
        this.move = ctx.cellHeight;
}


// general functions
var updateScores = function(){
    $('#lvl').text("Level: "+player.lvl);
    // shift hearts
    var paddLeft = document.getElementsByTagName('canvas')[0].getBoundingClientRect().left +"px";
    console.log(paddLeft);    
    var sz = player.life-$('#hearts').children().length;
    for(var i = 0 ; i < sz;i++){
        $('#hearts').append(HTMLHEARTS);
    }
}
updateScores();
// lose function in case of collision player with enemy
var Lose = function(){
    player.life--;
    ResetPlayerPos();
    $('#hearts').children().last().remove();
    if(player.life === 0){
        confirm("Game Over!!!\n lvl:"+player.lvl+"\n Blue Gem: "+player.blueGem
                + "\n Green Gem: "+player.greenGem+"\n Orange Gem: "+player.orangeGem);
        location.reload();
    }
}
// won function incase player cross with required gems
var Won = function(){
    player.lvl++;
    ResetPlayerPos();
    updateScores();
    initEnimes();
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});