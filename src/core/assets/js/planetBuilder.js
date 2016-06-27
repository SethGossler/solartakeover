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

	this.homeWorld = null; //will have it when construted.
	this.planets = []; //will add planets when constructed
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
		newPlanets[0].population = 8 * Math.pow(10, 9);
		newPlanets = this.sortByDist(newPlanets);
		this.planets = newPlanets;
		this.homeWorld = newPlanets[0];

		return newPlanets;
	},

	sortByDist: function(planets) {
		var sortedPlanets = planets.sort(function(planetA, planetB){
			return planetA.radius - planetB.radius;
		});
		return sortedPlanets;
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
		newPlanet.level = 0;
		newPlanet.loyalty = 100;
		newPlanet.resourceGeneration = 0; //based on loyalty, happiness, item buffs, planet level, and planet upgrades
		newPlanet.happiness = 100;
		newPlanet.population = 0;
		newPlanet.items = new this.ItemMechanism(newPlanet);
		newPlanet.process = this.process(newPlanet);
		return newPlanet;
	},

	process: function(thisPlanet) {
		return function(){
			if(thisPlanet.habitation == 0 ) {
				return -1; //no op;
			}

			// if too populated (> 5 billion), reduce happiness
			if( thisPlanet.population > (5 * Math.pow(10, 9)) ) {
				thisPlanet.happiness--;
			}

			if( thisPlanet.loyalty < 50 ) {
				thisPlanet.happiness--;
			}

			if ( thisPlanet.happiness >= 75 ) {
				thisPlanet.population++;
			} else if ( thisPlanet.happiness < 75 && thisPlanet.happiness > 50 ) {
				thisPlanet.population = thisPlanet.population;
			} else {
				thisPlanet.population--;
				thisPlanet.loyalty--;
			}

			if ( thisPlanet.habitation == 1 ) {
				thisPlanet.loyalty++;
				thisPlanet.happiness++;
			}

			thisPlanet.happiness = thisPlanet.happiness > 100 ? 100 : thisPlanet.happiness;
			thisPlanet.loyalty = thisPlanet.loyalty > 100 ? 100 : thisPlanet.loyalty;

			if( thisPlanet.happiness > 80 && this.loyalty > 80 ) {
				MOBA.PlayerEmpire.addFoodCredits(20);
				MOBA.PlayerEmpire.addTechCredits(20);
				console.log('Todos:\nBuild a "Store" for buying items.\nMake a planet Process object, or some way to handle complex game logic.\nMake colonizing more dynamic.')
			}

			console.log( 'process:', thisPlanet );

		};
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


	getHomeWorld: function() {
		return this.homeWorld;
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