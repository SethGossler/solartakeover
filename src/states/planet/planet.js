var MOBA = MOBA || {};

MOBA.planet = function(){};

MOBA.planet.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {
    var self = this;
  },
  
  // Create the scene
  create: function() { 
    var self = this;
    self._tpl = $("#planet_tpl").html();
    self._tpl = _.template(self._tpl);
    console.log( MOBA.planets[MOBA.currentPlanet] );
    self.$el = $(self._tpl( MOBA.planets[MOBA.currentPlanet] ));
    //setup world and camera
    // game.world.setBounds(0, 0, 2500, 2500);
    // game.camera.x = 1000;
    // game.camera.y = 1000;
    //add space background
    self.Space = game.add.sprite(0, 0, 'space_bg'); //2500x25000
    //add our planet
    self.planet = game.add.sprite( (1366/2) - (608/2), 50, 'planet');

    self.bindings();
    self.renderLayout();
  },

  // JQuery event bindings
  bindings: function() {
    var self = this;
    self.$el.on("click", ".zoom-out", function(){  
      game.state.start('solar');
    });
  },

  // Create and show your view
  renderLayout: function() {
    var self = this;
    $("#game_view").append(self.$el);
    self.$el.show();
  },

  // update tick / redraw
  update: function() {
    var self = this;
    // on mouse move, move the camera
    // var x = game.input.mousePointer.x;
    // var y = game.input.mousePointer.y;
    // if( x < 100 ) {
    //   game.camera.x -= 4;
    // }
    // if( x > 1266 ) {
    //   game.camera.x += 4;
    // }
    // if( y > 668 ) {
    //   game.camera.y += 4;
    // }
    // if( y < 100 ) {
    //   game.camera.y -= 4;
    // }

    // self.planet.x += 1;
    // self.planet.y += 1;
  },

  shutdown: function() {
    var self = this;
    self.$el.remove();
  }

};