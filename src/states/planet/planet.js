var MOBA = MOBA || {};

MOBA.planet = function(){};

MOBA.planet.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {
    var self = this;
    self.isActive = false;
    $('body').on('back-hit', function(){
      console.log('listeing');
      if( self.isActive ) {
        self.zoomOut();
      }
    });
  },
  
  getColonyShipPlanet: function() {
    var self = this;

    var planetWithColonyShip = null;
    if( self.outerSibling && (self.outerSibling.items.getItem('colony-ship') != undefined )) {
      planetWithColonyShip = self.outerSibling;
    } 
    if( self.innerSibling && (self.innerSibling.items.getItem('colony-ship') != undefined )) {
      planetWithColonyShip = self.innerSibling;
    }
    return planetWithColonyShip;
  },

  // Create the scene
  create: function() { 
    var self = this;
    self.isActive = true;
    self.currentPlanet = MOBA.planets[MOBA.currentPlanet];
    self.outerSibling = MOBA.planets[MOBA.currentPlanet + 1];
    self.innerSibling = MOBA.planets[MOBA.currentPlanet - 1];
    self.siblingWithColonyShip = self.getColonyShipPlanet();
    self.possibleItems = MOBA.itemKeeper.getPlanetItems(self.currentPlanet);
    //frontend model -- turn this into a "get planet model" function.

    self.model = {
      techCredits: MOBA.PlayerEmpire.techCredits,
      foodCredits: MOBA.PlayerEmpire.foodCredits,
      mineralCredits: MOBA.PlayerEmpire.mineralCredits,
      colonizable: self.siblingWithColonyShip != null && self.currentPlanet.habitation == 0,
      planet: self.currentPlanet,
      items: self.possibleItems,
      ownedItems: self.currentPlanet.items,
      setStatus: function(){ self.setStatus(this); },
      setAbility: function(){ self.setAbility(this); },
      zoomOut: function(){ self.zoomOut(); },
      upgrade: function(){ var num = $(this).attr('data-upgrade-num'); self.upgradePlanet( num ); }
    };

    self.updaterInterval = setInterval(function(){
      mineralCredits: MOBA.PlayerEmpire.mineralCredits;
      self.model.techCredits = MOBA.PlayerEmpire.techCredits;
      self.model.foodCredits = MOBA.PlayerEmpire.foodCredits;
      self.model.colonizable = self.siblingWithColonyShip != null && self.currentPlanet.habitation == 0;
      self.possibleItems = MOBA.itemKeeper.getPlanetItems(self.currentPlanet);
      self.model.items = self.possibleItems;
    }, 100);

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
    var self = this;
    var $tile = $(abilityTile);
    var typeOfTile = $tile.attr('data-type');

    if(typeOfTile == 'item') {
      var itemName = $tile.attr('data-item');
      console.log('buy', itemName);      
      var item = MOBA.itemKeeper.buyPlanetItem(itemName, self.currentPlanet);
      if( item ) {
        console.log('got the item !', item);
        this.currentPlanet.items.addItem(item);
      } else {
        console.log('didnt get the item :(');
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
    if( self.siblingWithColonyShip.items.useItem('colony-ship') ) {
      console.log("colonized!");
      self.currentPlanet.habitation = status;
    } else {
      console.error('you tried to colonize without a colonship. Are you hacking?');
    }
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
    self.Space = game.add.tileSprite(-300, -100, 8000, 8000, 'space_bg'); //4000x40000
    
    var planetRadius = window.innerWidth * .4;
    planetRadius =  planetRadius + ( planetRadius * self.currentPlanet.scale );

    self.planet = game.add.sprite( (window.innerWidth/2), (window.innerHeight/2), self.currentPlanet.image);
    self.planet.anchor.setTo(0.5, 0.5);

    self.planet.inputEnabled = true;

    self.planet.events.onInputDown.add(function(planet){
      self.currentPlanet.clickProcess();
      game.add.tween(planet.scale).to({ x: 0.97, y: 0.97}, 150, Phaser.Easing.Back.Out, true, 0);
    }, this);

    self.planet.events.onInputUp.add(function(planet){
        game.add.tween(planet.scale).to({ x: 1, y: 1 }, 150, Phaser.Easing.Back.Out, true, 0);
    });
    
    self.planet.width = planetRadius;
    self.planet.height = planetRadius;
    self.planet.scale = {x: 1, y:1};
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
    self.isActive = false;
    self.$el.remove();
  }

};