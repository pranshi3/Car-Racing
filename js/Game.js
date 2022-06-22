class Game {
  constructor() {
this.resetTitle=createElement('h2')
this.resetButton=createButton('')

this.leaderBoardTitle=createElement('h2')
this.leader1=createElement('h2')
this.leader2=createElement('h2')

this.playerMoving=false
this.leftKeyActive=false
this.blast=false
  }

  getState(){
    var reference= database.ref('gameState')
    reference.on('value', function(data){
      gameState=data.val()
    })
  }

  updateState(state){
database.ref('/').update({
  gameState: state
})
  }


  start() {
    player = new Player();
    playerCount=player.getCount()

    form = new Form();
    form.display();

    car1=createSprite(width/2-180,height-100)
    car1.addImage('car1', car1img)
    car1.addImage('blast',blastImage)
    car1.scale=0.1
    car2=createSprite(width/2+230,height-100)
    car2.addImage('car2',car2img)
    car2.addImage('blast',blastImage)
    car2.scale=0.1
    cars=[car1,car2]
   



  //creating groups
  fuels=new Group()
  powerCoins=new Group()
obstacles=new Group()

  
  
  var obstaclesPositions=[
  {x:width/2+250,y:height-800,image:obstacle2Img},
  {x:width/2-150,y:height-1300,image:obstacle2Img},
  {x:width/2+250,y:height-1800,image:obstacle1Img},
  {x:width/2-180,y:height-2300,image:obstacle2Img},
  {x:width/2,y:height-2800,image:obstacle1Img},
  {x:width/2-180,y:height-3300,image:obstacle2Img},
  {x:width/2+180,y:height-3300,image:obstacle1Img},
  {x:width/2+250,y:height-3800,image:obstacle1Img},
  {x:width/2-150,y:height-4300,image:obstacle1Img},
  {x:width/2+250,y:height-4700,image:obstacle2Img},
  {x:width/2,y:height-4500,image:obstacle1Img},
  {x:width/2-180,y:height-3900,image:obstacle2Img},

]

//adding 4 fuel sprite in game
this.addSprites(fuels,4,fuelImg,0.02)
  
//adding 20 powerCoin sprites
this.addSprites(powerCoins,20,goldCoinImg,0.09)

  //adding obstacles
  this.addSprites(obstacles,obstaclesPositions.length,obstacle1Img,0.04,obstaclesPositions)

  }
  

  addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions=[]){
   for (var i=0; i<numberOfSprites; i++){
var x,y
if (positions.length>0){
x=positions[i].x
y=positions[i].y
spriteImage=positions[i].image

}
else {
  x=random(width/2-150,width/2+150)
  y=random(-height *4, height-400)
}

var sprite= createSprite(x,y)
sprite.addImage('sprite',spriteImage)
sprite.scale=scale
spriteGroup.add(sprite)
   } 
  }

  handleElements(){
    form.hide()
    form.titleImg.position(10,50)
    form.titleImg.class('gameTitleAfter')

    this.resetTitle.html('Reset Game')
    this.resetTitle.class('resetText')
    this.resetTitle.position(width/2+110, 40)

    this.resetButton.class('resetButton')
    this.resetButton.position(width/2+150, 100)

    this.leaderBoardTitle.html('Leader Board')
    this.leaderBoardTitle.position(width/3-70,40)
    this.leaderBoardTitle.class('resetText')

  
    this.leader1.class('leaderText')
    this.leader1.position(width/3-60,90)
 
    this.leader2.class('leaderText')
    this.leader2.position(width/3-60,130)

  }

  showLife(){
    push()
    image(heartImg,width/2-130,height-player.positionY-300,20,20)
    fill('white')
    rect(width/2-100,height-player.positionY-300,185,20)
    fill('red')
    rect(width/2-100,height-player.positionY-300,player.life,20)
    noStroke()
    pop()
    }
    
    showFuel(){
      push()
    image(fuelImg,width/2-130,height-player.positionY-250,20,20)
    fill('white')
    rect(width/2-100,height-player.positionY-250,185,20)
    fill('yellow')
    rect(width/2-100,height-player.positionY-250,player.fuel,20)
    noStroke()
    pop()
    }


  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref('/').set({
        playerCount:0,
        gameState:0,
        carsAtEnd: 0,
        players:{}
      })
      window.location.reload()
    })
  }




  handleFuel(index){
    //adding fuel back in the car when it touches tank
    
    cars[index-1].overlap(fuels,function(collector, collected){
      player.fuel=185
      //collected is the sprite in group collectables that triggered the touching event
      collected.remove()

    })

    //reducing player car fuel
    if (player.fuel>0 && this.playerMoving){
      player.fuel=player.fuel-0.5
    }

    if (player.fuel<=0){
      gameState=2
      this.gameOver()
    }
  }


  handlePowerCoins(index){
    cars[index-1].overlap(powerCoins,function(collector,collected){
      player.score=player.score+20
      player.update()
      collected.remove()

    })
  }

  handleObstacleCollision(index){
if (cars[index-1].collide(obstacles)){
  if (this.leftKeyActive){
    player.positionX=player.positionX+100
  }
  else {
    player.positionX=player.positionX-100 
  }
  if (player.life>0){
    player.life=player.life-(185/4)
  }
  player.update()
}
  }

  handleCarsCollision(index){
    if (index==1){
      if (cars[index-1].collide(cars[1])){
        if (this.leftKeyActive()){
          player.positionX=player.positionX+100
        }
      else{
        player.positionX=player.positionX-100
      }
      //reducing player life from bumping with other car
      if (player.life>0){
        player.life=player.life-185/4
      }
      player.update()
      }
    }
    if (index==2){
      if (cars[index-1].collide(cars[0])){
        if (this.leftKeyActive()){
          player.positionX=player.positionX+100
        }
      else{
        player.positionX=player.positionX-100
      }
      //reducing player life from bumping with other car
      if (player.life>0){
        player.life=player.life-185/4
      }
      player.update()
      }
    }
  }



handlePlayerControls(){

  if (!this.blast){

  
  if (keyIsDown(UP_ARROW)){
    this.playerMoving=true
    player.positionY+=20
    player.update()
    
  }

  if (keyIsDown(RIGHT_ARROW) && player.positionX<width/2+280){
    this.leftKeyActive=false
    this.playerMoving=true
    player.positionX+=5
    player.update()
    
  }

  if (keyIsDown(LEFT_ARROW)&& player.positionX>width/3){
    this.leftKeyActive=true
    this.playerMoving=true
    player.positionX-=5
    player.update()
  }
}
  }



showLeaderBoard(){
  var leader1, leader2
  var players=Object.values(allPlayers)
  if ((players[0].rank==0 && players[1].rank==0) || players[0].rank==1){
// &emsp; This tag is used for displaying 4 consecutive spaces
leader1= players[0].rank+ '&emsp;'+ players[0].name+'&emsp;' +players[0].score
leader2= players[1].rank+ '&emsp;'+ players[1].name+'&emsp;' +players[1].score
  }
if (players[1].rank==1){
  leader1= players[1].rank+ '&emsp;'+ players[1].name+'&emsp;' +players[1].score
leader2= players[0].rank+ '&emsp;'+ players[0].name+'&emsp;' +players[0].score

}
this.leader1.html(leader1)
this.leader2.html(leader2)
}



showRank(){
  swal({
    title: `Awesome!!!${'\n'}Rank${'\n'}${player.rank}`,
   text: 'You Reached the Finish Line',
   imageUrl: 'https://us.123rf.com/450wm/jabkitticha/jabkitticha1607/jabkitticha160700396/60094332-vector-trophy-cup-flat-icon.jpg?ver=6',
   imageSize: '200x200',
   confirmButtonText: 'Ok'
  },
  ) 
}

gameOver(){
  swal({
    title: `Game Over!!!`,
   text: 'Oops You Lost the Race',
   imageUrl: 'https://us.123rf.com/450wm/martialred/martialred1606/martialred160600173/58945132-red-heartbreak-heart-break-or-divorce-flat-icon-for-apps-and-websites.jpg?ver=6',
   imageSize: '200x200',
   confirmButtonText: 'Thanks for Playing'
  },
  )  
}

  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if (allPlayers!==undefined){
      image(track,0,-height *5,width,height*6)
      this.showLife()
      this.showFuel()
      this.showLeaderBoard()
      var index=0
      for (var i in allPlayers){
        index=index+1
        var x= allPlayers[i].positionX
        var y= height-allPlayers[i].positionY
      //saving value of player.life in temporary variable
      var currentLife=allPlayers[i].life
      if (currentLife<=0){
          cars[index-1].changeImage('blast')
      }
        cars[index-1].position.x=x
        cars[index-1].position.y=y

        //checking if the active car is on the active screen
        if (index==player.index){
          push()

          textAlign(CENTER)
          stroke(10)
          textSize(20)
          text(allPlayers[i].name,x,y-100)
          fill('blue')
          ellipse(x+3,y,80,80)
          pop()
          this.handleFuel(index)
          this.handlePowerCoins(index)
          this.handleObstacleCollision(index)
          this.handleCarsCollision(index)
          if (player.life<=0){
            this.blast=true
            this.playerMoving=false
          }
          //changing camera position in y direction for active car
          camera.position.y=cars[index-1].position.y
        }
      }

      //EDIT
      if(this.playerMoving){
        player.positionY+=5
        player.update()
      }
      this.handlePlayerControls()

      const finishLine=(height *6)
      if (player.positionY>finishLine){
        gameState=2
        player.rank=player.rank+1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      drawSprites()
    }
   
  }
}
