var MOBA = MOBA || {};

MOBA.mainMenu = function(){};

MOBA.mainMenu.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {

  },
  // Create the scene
  create: function() { 
    var self = this;
    self._tpl = $("#mainMenu_tpl");
    self.$el = $(self._tpl.html());
    self.bindings();
    self.renderLayout();
    // Add background
    self.bgSprite = game.add.sprite(0, 0, 'menu_bg');

  },

  // Create and show your view
  renderLayout: function() {
    var self = this;
    $("#game_view").append(self.$el);
    self.$el.show();
  },

  bindings: function() {
    var self = this;
    self.$el.on('click', '.start.btn', function(){
      self.state.start('solar');  
    });

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