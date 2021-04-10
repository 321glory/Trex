var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex_running, trex_collided, dieSound, jumpSound, gameOver, restart;
var ground, invisibleGround, groundImage, gameOverImg, restartImg;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running =               loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  
  gameOver = createSprite(300, 100, 20, 20);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;
  restart = createSprite(300, 150, 20, 20);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
  trex.setCollider("circle", 0, 0, 35);
}

function draw() {
  background("white");
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(5 + score/500);
    score = score + Math.round(getFrameRate()/60);
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -14;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8
    spawnClouds();
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  }
  
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided");
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    gameOver.visible = true;
    restart.visible = true;
      if(mousePressedOver(restart)) {
        reset();
      }
  }
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(5 + score/500);

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3 + score/500);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}

function reset(){
  trex.changeAnimation("running");
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  gameState = PLAY;
}