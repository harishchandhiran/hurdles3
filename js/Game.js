class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state,
      CarsAtEnd: 0
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,100,30,30);
    car2 = createSprite(200,100,30,30);
    car3 = createSprite(300,100,30,30);
    car4 = createSprite(400,100,30,30);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, -displayHeight*4,0,displayWidth*5, displayHeight);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x;
      var y = 0;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //use data form the database to display the cars in y direction
        y = y + 150;
        cars[index-1].y = y;

        //position the cars a little away from each other in x direction
        x = allPlayers[plr].distance;        
        cars[index-1].x = x;

        //creating hudles and the required condition
        hurdle1 = createSprite(300, y, 20, 10);
        hurdle1.shapeColor = "black";
        hurdle2 = createSprite(800, y, 20, 10);
        hurdle2.shapeColor = "black";
        if(keyIsDown(UP_ARROW)){    
          cars[index-1].y-=60;
        }
        if(cars[index-1].collide(hurdle1) || cars[index-1].collide(hurdle2)){    
          if(cars[index-1].y%150===0){    
            player.distance = 0;
            player.update();
          }
        }

        if (index === player.index){
          cars[index - 1].shapeColor = "black";
          camera.position.x = cars[index-1].x;
          camera.position.y = displayHeight/2;
        }
      }
    }

    if(keyIsDown(RIGHT_ARROW) && player.index !== null){
      Player.getPlayerInfo();
      console.log(player.distance);
      player.distance +=20
      player.update();
    }

    if(player.distance > 1200){
      gameState = 2;
      player.rank +=1;
      Player.updateCarsAtEnd(player.rank);
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
