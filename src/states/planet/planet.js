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
    self.currentPlanet = MOBA.planets[MOBA.currentPlanet];
    self.model = {
      planet: self.currentPlanet,
      setStatus: function(){ self.setStatus(this); },
      zoomOut: function(){ self.zoomOut(); }
    };
    rivets.formatters.statustext = function(value) {
      if( value == 0 ) {
        return "Uninhabited";
      }
      if( value == 1 ) {
        return "Homeworld";
      }
      if( value == 2 ) {
        return "Settlement";
      }
      if( value == 3 ) {
        return "Mining Corp";
      }
      if( value == 4 ) {
        return "Farming Colony";
      }
    };
    self.renderLayout();
  },

  setStatus: function(el) {
    var self = this;
    var status = $(el).data("status");
    self.currentPlanet.habitation = status;
  },

  zoomOut: function() {
    game.state.start('solar');
  },

  // Create and show your view
  renderLayout: function() {
    var self = this;
    self.$el = $($("#planet_tpl").html());
    rivets.bind(self.$el, self.model);
    $("#game_view").append(self.$el);
    self.Space = game.add.sprite(0, 0, 'space_bg'); //2500x25000
    self.planet = game.add.sprite( (1366/2) - (608/2), 50, self.currentPlanet.image);
    if( self.currentPlanet.tint ) {
      self.planet.tint = self.currentPlanet.tint;
    }
    game.world.scale.set(1);
    self.$el.show();
  },

  // update tick / redraw
  update: function() {
    var self = this;
  },

  shutdown: function() {
    var self = this;
    self.$el.remove();
  }

};