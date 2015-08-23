var MOBA = MOBA || {};

MOBA.stateName = function(){};

MOBA.stateName.prototype = {
  // preload any files you didn't preload in the preload state.
  preload: function() {
    var self = this;
  },
  
  // Create the scene
  create: function() { 
    var self = this;
    self._tpl = ("#stateName_tpl");
    self.$el = $(self._tpl.html());
    self.bindings();
    self.renderLayout();
  },

  // JQuery event bindings
  bindings: function() {
    var self = this;
    //$().on("click",function(){  });
  },

  // Create and show your view
  renderLayout: function() {
    var self = this;
    $("#moba").append(self.$el);
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