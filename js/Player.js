class Player {
  constructor() {
    this.name=null
    this.index=null
    this.positionX=0
    this.positionY=0
    this.rank=0
    this.score=0
    this.fuel=185
    this.life=185
    
  }

  getCount(){
var reference=database.ref('playerCount')
reference.on('value', function(data){
  playerCount=data.val()
})
  }

  update(){
    var playerIndex='players/player'+this.index
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank:this.rank,
     score:this.score,
     life:this.life
    })
  }

/*getCarsAtEnd(){
var reference=database.ref('carsAtEnd')
reference.on('value',function(data){
this.rank=data.val()
})
}*/
//EDIT
getCarsAtEnd() {
  database.ref("carsAtEnd").on("value", data => {
    this.rank = data.val();
  });
}

static updateCarsAtEnd(rank){
  database.ref('/').update({
  carsAtEnd: rank
  })
}
  getDistance(){
    var reference=database.ref('players/player'+this.index)
    reference.on('value',data =>{
      var data=data.val()
      this.positionX=data.positionX
      this.positionY=data.positionY
    })
  }

  updateCount(count){
database.ref('/').update({
  playerCount:count
})

  }

addPlayer(){
  var playerIndex='players/player'+this.index
  if (this.index==1){
this.positionX=width/2-180
  }
  else {
    this.positionX=width/2+180
  }
  database.ref(playerIndex).set({
    name: this.name,
    positionX:this.positionX,
    positionY:this.positionY,
    rank:this.rank,
    score:this.score,
    life:this.life
  })
}

/*static getPlayersInfo(){
  var reference= database.ref('players')
  reference.on('value', function(data){
    allPlayers=data.val()
  })
}*/
//EDIT
static getPlayersInfo(){
  var reference= database.ref('players')
  reference.on('value', data=>{
    allPlayers=data.val()
  })
}
}
