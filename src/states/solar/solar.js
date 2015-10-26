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
    self._tpl = $("#solar_tpl");
    self.$el = $(self._tpl.html());
    self.bindings();
    self.renderLayout();
    self.worldScale = 1;

    //setup world and camera
    game.world.setBounds(0, 0, 2500, 2500);

    if(MOBA.currentPlanet >= 0 ) {
      var prevPlanet = MOBA.planets[ MOBA.currentPlanet ];
      self.update();

      var x = prevPlanet.x - 650;
      var y = prevPlanet.y - 380;
      
      console.log( x );
      console.log( y );

      game.camera.x = x;
      game.camera.y = y;

      MOBA.currentPlanet = null;
    } else {
      game.camera.x = 600;
      game.camera.y = 900;
    }

    //add space background
    self.Space = game.add.sprite(0, 0, 'space_bg'); //2500x25000
    self.Space.scale.x = 1;
    self.Space.scale.y = 1;
    //add planets
    self.addPlanets();
    //add our star
    self.Star  = game.add.sprite(2500/2, 2500/2, 'solar-star');

    self.bindings();
    self.renderLayout();
  },

  addPlanets: function() {
    var self = this;

    self.planets = [];
    _.each(MOBA.planets, function(item, index){
      var newPlanet = game.add.sprite( 0, 0, item.image);
      newPlanet.anchor.setTo(0.5, 0.5);

      newPlanet.index = index;
      newPlanet.radius = item.radius;
      newPlanet.period = item.period;
      newPlanet.startOffset = item.startOffset;
      newPlanet.scale.x = item.scale - 0.15;
      newPlanet.scale.y = item.scale - 0.15;
      if( item.tint ) {
        newPlanet.tint = item.tint;
      }
      newPlanet.inputEnabled = true;
      newPlanet.model = item;
      newPlanet.events.onInputDown.add(function(sprite){
        self.showPlanetDetail(sprite);
      }, this);
      self.planets.push(newPlanet);
    });

  },

  showPlanetDetail: function(planetSprite) {
    MOBA.currentPlanet = planetSprite.index;
    console.log( MOBA.currentPlanet );
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

    if( x > 0 && y > 0 ){
      if( x < 100 ) {
        game.camera.x -= 4;
      }
      if( x > 1266 ) {
        game.camera.x += 4;
      }
      if( y > 668 ) {
        game.camera.y += 4;
      }
      if( y < 100 ) {
        game.camera.y -= 4;
      }
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

    // Planet Rotation of this states planet sprites (not to be confused with MOBA.planets);
    _.each(self.planets, function(planetSprite){
      var relativeTimePeriod = ( game.time.now * (planetSprite.period * 0.0001) ) + ( planetSprite.startOffset * 3.14159265359 );
      planetSprite.x = game.world.centerX + Math.cos(relativeTimePeriod) * planetSprite.radius;
      planetSprite.y = game.world.centerY + Math.sin(relativeTimePeriod) * planetSprite.radius;
      // planetSprite.angle += 0.8 - (1 * planetSprite.model.scale);
      // console.log( planetSprite.angle );
      planetSprite.model.x = planetSprite.x;
      planetSprite.model.y = planetSprite.y;

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
  }

};