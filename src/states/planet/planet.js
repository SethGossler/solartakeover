var MOBA = MOBA || {};

MOBA.planet = function(){};

MOBA.planet.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {
    var self = this;
  },
  
  getIsColonizable: function() {

    // console.log('currplanet: ', MOBA.currentPlanet);
    // console.log('lengthplanet: ', MOBA.planets.length);


    if( MOBA.currentPlanet == MOBA.planets.length-1 ) {
      var outerSibling = 0;
    } else {
      var outerSibling = MOBA.planets[MOBA.currentPlanet + 1].habitation;
    }

    if( MOBA.currentPlanet == 0 ) {
      var innerSibling = 0;
    } else {
      var innerSibling = MOBA.planets[MOBA.currentPlanet - 1].habitation;
    }

    // console.log('outerSibling: ', MOBA.planets[MOBA.currentPlanet + 1].name, outerSibling, outerSibling > 0);
    // console.log('innerSibling: ', MOBA.planets[MOBA.currentPlanet - 1].name, innerSibling, innerSibling > 0);

      var isColonizable = (outerSibling > 0) || (innerSibling > 0); 

    console.log('isColonizable', isColonizable);
    return isColonizable;
  },

  // Create the scene
  create: function() { 
    var self = this;
    self.currentPlanet = MOBA.planets[MOBA.currentPlanet];
    
    self.model = {
      colonizable: self.getIsColonizable(),
      planet: self.currentPlanet,
      setStatus: function(){ self.setStatus(this); },
      setAbility: function(){ self.setAbility(this); },
      zoomOut: function(){ self.zoomOut(); },
      upgrade: function(){ var num = $(this).attr('data-upgrade-num'); self.upgradePlanet( num ); }
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

    rivets.formatters.typeStatusClass = function(value) {
      if( value == 0 ) {
        return "uninhabited";
      }
      if( value == 1 ) {
        return "homeworld";
      }
      if( value == 2 ) {
        return "settlement";
      }
      if( value == 3 ) {
        return "mining-corp";
      }
      if( value == 4 ) {
        return "farming-colony";
      }
    };

    self.renderLayout();

  },

  setAbility: function(abilityTile) {
    var $tile = $(abilityTile);
    var typeOfTile = $tile.attr('data-type');

    if(typeOfTile == 'item') {
      var itemName = $tile.attr('data-item');
      
      if( itemName == 'colony-ship' ) { //buying a colony ship
        if(MOBA.PlayerEmpire.techCredits >= 100 && MOBA.PlayerEmpire.foodCredits >= 100 ) {
          MOBA.PlayerEmpire.techCredits = MOBA.PlayerEmpire.techCredits - 100;
          MOBA.PlayerEmpire.foodCredits = MOBA.PlayerEmpire.foodCredits - 100;
          this.currentPlanet.items.addItem({
            name: 'colony-ship',
            alias: 'Colony Ship',
            type: 'production'
          }) 
        } else {
          console.log( 'cant buy ship!' );
        }
      }

    }
  },

  upgradePlanet: function( upgradeNum ) {
    var self = this;
    self.currentPlanet.upgrades.unlockUpgrade( upgradeNum );
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

  // render tick / redraw
  render: function() {
    var self = this;
  },

  shutdown: function() {
    var self = this;
    self.$el.remove();
  }

};