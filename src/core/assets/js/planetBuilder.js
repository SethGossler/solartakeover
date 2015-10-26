var planetBuilder = function(){

	this.planetNames = [
		"Waswaetera",
		"Tetroyria",
		"Teplarth",
		"Xescypso",
		"Loumia",
		"Umia",
		"Brodotera",
		"Spodawei",
		"Glov",
		"Flilia",
		"Kesheanerth",
		"Nestiolara",
		"Othosie",
		"Vacrosie",
		"Tienov",
		"Zeunus",
		"Scodubos",
		"Smodastea",
		"Whara",
		"Storia"
	];

	this.maxRadiusDist = 1200; //more ore less, the # of pixels from the sun.
	this.avgRadiusDist = 700; // Where the "big" planets should live.
};

planetBuilder.prototype = {
	
	buildPlanets: function() {
		var newPlanets = [];

		// Build this new solar system of planets. The first one will be our home world.
		var numberOfPlanets = 7;//_.random(12);
		for( var i = 0; i < numberOfPlanets; i++ ) {
			newPlanets.push( this.buildNewPlanet() );
		}
		// first Planet is the "homeworld"
		newPlanets[0].habitation = 1;

		return newPlanets;
	},

	buildNewPlanet: function() {
		var newPlanet = {};
		newPlanet.name = this.generatePlanetName();
		newPlanet.radius = this.generateRadius(newPlanet);
		newPlanet.scale = this.generateScale(newPlanet);
		newPlanet.image = this.generatePlanetImage();
		newPlanet.tint = this.generateTint();
		newPlanet.startOffset = this.generateOffset();
		newPlanet.period = this.generatePeriod(newPlanet);
		newPlanet.habitation = 0;
		newPlanet.upgrades = new this.UpgradeMechanism(newPlanet);
		newPlanet.items = new this.ItemMechanism(newPlanet);
		return newPlanet;
	},


	UpgradeMechanism: function( newPlanet ) {
		var self = this;
		self.unlockUpgrade = function( upgradeNum ) {
			console.log( newPlanet.name );
			console.log( upgradeNum );
		};
	},

	ItemMechanism: function( newPlanet ) {
		var self = this;
		self.socialItems = [];
		self.defenseItems = [];
		self.productionItems = [];
		self.addItem = function( item ) {
			if( item.type == "social" ) {
				self.socialItems.push( item );
			} else if( item.type == "defense" ) {
				self.defenseItems.push( item );
			} else if( item.type == "production" ) {
				self.productionItems.push( item );
			}
		};

	},


	generatePlanetName: function() {
		return this.planetNames[ _.random(0, this.planetNames.length-1)];
	},

	generatePlanetImage: function() {
		return "planet"; // expand this to include new planet sprites
	},

	generateTint: function() {
		return '0x'+(Math.random()*0xFFFFFF<<0).toString(16);
	},

	generateScale: function(planet) {
		var value = planet.radius;
		var scale = this.deviation( value, this.avgRadiusDist);
		scale = scale - 0.6; // makes them all smaller (A scale of "1" is too big.)
		if( scale <= 0.22 ) {
			return 0.22;
		}
		return Math.abs(scale);
	},

	generateRadius: function() {
		var radius = _.random(250, this.maxRadiusDist);
		return radius;
	},

	generateOffset: function(){
		return (Math.random() * 2);
	},

	generatePeriod: function(planet) {
		var period = 1 - (planet.radius/this.maxRadiusDist);
		return period;
	},

	// old src = http://www.math.ucla.edu/~tom/distributions/normal.html
	deviation: function(x, avg, largestScale){   //HASTINGS.  MAX ERROR = .000001
		var deviation = 1 - (Math.abs(avg - x)/this.maxRadiusDist);
		return deviation;
	}

}