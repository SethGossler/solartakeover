var MOBA = MOBA || {};

MOBA.solar = function(){};

MOBA.solar.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {
    var self = this;
  },
  
  // Create the scene
  create: function() { 
    var self = this;
    self.model = {
      techCredits: MOBA.PlayerEmpire.techCredits,
      foodCredits: MOBA.PlayerEmpire.foodCredits,
      mineralCredits: MOBA.PlayerEmpire.mineralCredits,
      planets: MOBA.planets,
      showPlanet: function(evt) {
        var el = this;
        var name = $(el).find('.name').html();
        var planet = _.find(MOBA.planets, function(planet) {
          return planet.name == name;
        });
        self.showPlanetDetail(MOBA.planets.indexOf(planet));
       }
    };
    self.updaterInterval = setInterval(function(){
      self.model.techCredits = MOBA.PlayerEmpire.techCredits;
      self.model.foodCredits = MOBA.PlayerEmpire.foodCredits;
      self.model.mineralCredits = MOBA.PlayerEmpire.mineralCredits;
    },500);

    self._tpl = $("#solar_tpl");
    self.$el = $(self._tpl.html());
    self.bindings();
    self.renderLayout();
    self.worldScale = 1;
    MOBA.startGame();
    //setup world and camera
    game.world.setBounds(0, 0, 4000, 4000);

    if(MOBA.currentPlanet >= 0 ) {
      var prevPlanet = MOBA.planets[ MOBA.currentPlanet ];
      console.log(MOBA.planets);
      self.update();

      var x = prevPlanet.x - 650;
      var y = prevPlanet.y - 380;
      
      // console.log( x );
      // console.log( y );

      game.camera.x = x;
      game.camera.y = y;

      MOBA.currentPlanet = null;
    } else {
      game.camera.x = 2000 - window.innerWidth/2;
      game.camera.y = 2000 - window.innerHeight/2;
    }

    //add space background
    self.Space = game.add.tileSprite(-300, -100, 8000, 8000, 'space_bg'); //4000x40000
    //add planets
    self.addPlanets();
    //add our star
    self.Star  = game.add.sprite(4000/2, 4000/2, 'solar-star');

    self.bindings();
    self.renderLayout();
  },

  addPlanets: function() {
    var self = this;

    self.planets = [];
    _.each(MOBA.planets, function(item, index){
      var thisPlanetGroup = game.add.group();
      var planetGlow = game.add.sprite( 0, 0, 'circle');
      var newPlanet = game.add.sprite( 0, 0, item.image);


      thisPlanetGroup.add(planetGlow);
      thisPlanetGroup.add(newPlanet);

      newPlanet.anchor.setTo(0.5, 0.5);
      planetGlow.anchor.setTo(0.5, 0.5);

      thisPlanetGroup.index = index;
      thisPlanetGroup.radius = item.radius;
      thisPlanetGroup.period = item.period;
      thisPlanetGroup.startOffset = item.startOffset;
      thisPlanetGroup.model = item;

      newPlanet.scale.x = item.scale - 0.15;
      newPlanet.scale.y = item.scale - 0.15;
      planetGlow.scale.x = item.scale - 0.16;
      planetGlow.scale.y = item.scale - 0.16;

      var habitationTints = {
        0:"0x333333", //nothing - gray
        1:"0xffffff", //homeworld - white
        2:"0x3333aa", //settlement - blue
        3:"0xaa3333", //mining - red
        4:"0x33aa33" //farms - green
      };
      planetGlow.tint = habitationTints[item.habitation];
      

      newPlanet.tint = item.tint;  

      newPlanet.inputEnabled = true;
      newPlanet.events.onInputDown.add(function(planet){
        self.showPlanetDetail(thisPlanetGroup.index);
      }, this);


      self.planets.push(thisPlanetGroup);
    });

  },

  showPlanetDetail: function(index) {
    MOBA.currentPlanet = index;
    // MOBA.pauseGame();
    game.state.start('planet');
  },

  // JQuery event bindings
  bindings: function() {
    var self = this;
    //$().on("click",function(){  });
  },

  // Create and show your view
  renderLayout: function() {
    var self = this;
    rivets.bind(self.$el, self.model);
    $("#game_view").append(self.$el);
    self.$el.show();
  },

  update: function() {
    
  },

  // render tick / redraw
  render: function() {
    var self = this;
    //on mouse move, move the camera
    var x = game.input.mousePointer.x;
    var y = game.input.mousePointer.y;

    // if( x > 0 && y > 0 ){
    //   if( x < 100 ) {
    //     game.camera.x -= 4;
    //   }
    //   if( x > 1266 ) {
    //     game.camera.x += 4;
    //   }
    //   if( y > 668 ) {
    //     game.camera.y += 4;
    //   }
    //   if( y < 100 ) {
    //     game.camera.y -= 4;
    //   }
    // }

    if (this.game.input.activePointer.isDown) {  
      if (this.game.origDragPoint) {    
        // move the camera by the amount the mouse has moved since last update
        this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;   
        this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;  
      }  // set new drag origin to current position  
      this.game.origDragPoint = this.game.input.activePointer.position.clone();
    } else {  
      this.game.origDragPoint = null;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        game.camera.y -= 4;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        game.camera.y += 4;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        game.camera.x -= 4;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        game.camera.x += 4;
    }

    // Planet Rotation of this states planet groups (not to be confused with MOBA.planets);
    _.each(self.planets, function(planetGroup){
      var relativeTimePeriod = ( game.time.now * (planetGroup.period * 0.0001) ) + ( planetGroup.startOffset * 3.14159265359 );
      planetGroup.x = game.world.centerX + Math.cos(relativeTimePeriod) * planetGroup.radius;
      planetGroup.y = game.world.centerY + Math.sin(relativeTimePeriod) * planetGroup.radius;
      // planetGroup.angle += 0.8 - (1 * planetGroup.model.scale); //disabled until there's dynamic lighting
      planetGroup.model.x = planetGroup.x;
      planetGroup.model.y = planetGroup.y;
    });

    // zoom
    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
        self.worldScale += 0.002;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        self.worldScale -= 0.002;
    }
    // set a minimum and maximum scale value
    self.worldScale = Phaser.Math.clamp(self.worldScale, 0.5, 3);
    // set our world scale as needed
    game.world.scale.set(self.worldScale);


  },

  shutdown: function() {
    var self = this;
    self.$el.remove();
    clearInterval( self.updaterInterval );
  }

};