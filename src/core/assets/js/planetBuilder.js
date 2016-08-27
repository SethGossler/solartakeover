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
	this.minRadiusDist = 250;
	this.maxRadiusDist = 1200; //more ore less, the # of pixels from the sun.
	this.avgRadiusDist = 1200; // Where the "big" planets should live.
};

planetBuilder.prototype = {
	
	buildPlanets: function() {
		var newPlanets = [];

		// Build this new solar system of planets. The first one will be our home world.
		var numberOfPlanets = 7;//_.random(12);
		for( var i = 0; i < numberOfPlanets; i++ ) {
			newPlanets.push( this.buildNewPlanet(i) );
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

	buildNewPlanet: function(index) {
		var newPlanet = {};
		newPlanet.index = index;
		newPlanet.name = this.generatePlanetName();
		newPlanet.radius = this.generateRadius(newPlanet);
		newPlanet.scale = this.generateScale(newPlanet);
		newPlanet.image = this.generatePlanetImage();
		newPlanet.tint = this.generateTint();
		newPlanet.startOffset = this.generateOffset();
		newPlanet.period = this.generatePeriod(newPlanet);
		newPlanet.habitation = 0;
		newPlanet.upgrades = new this.UpgradeMechanism(newPlanet);
		newPlanet.level = 1;
		newPlanet.experience = 0;
		newPlanet.neededExperience = 2000;
		newPlanet.loyalty = 100;
		newPlanet.resourceGeneration = ""; //based on loyalty, happiness, item buffs, planet level, and planet upgrades
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

			// Gain xp, and level up.
			if( thisPlanet.happiness > 80 && this.loyalty > 80 ) {
				thisPlanet.experience += 10;
				if(thisPlanet.experience >= thisPlanet.neededExperience) {
					thisPlanet.level++;
					thisPlanet.experience = 0;
					thisPlanet.neededExperience += 500;
				}
			}

			thisPlanet.resourceGeneration = "rioting";

			// homework credits
			if( thisPlanet.happiness > 80 && this.loyalty > 80 && thisPlanet.habitation == 1 ) {
				MOBA.PlayerEmpire.addFoodCredits(2);
				MOBA.PlayerEmpire.addTechCredits(2);
				console.log('here');
				thisPlanet.resourceGeneration = "2 Food / 2 Tech";
			}

			// settlement colony credits
			if( thisPlanet.happiness > 80 && this.loyalty > 80 && thisPlanet.habitation == 2 ) {
				MOBA.PlayerEmpire.addFoodCredits(1);
				MOBA.PlayerEmpire.addTechCredits(1);
				thisPlanet.resourceGeneration = "1 Food / 1 Tech";
			}

			// mining coloy rdits
			if( thisPlanet.happiness > 80 && this.loyalty > 80 && thisPlanet.habitation == 3 ) {
				MOBA.PlayerEmpire.addFoodCredits(0);
				MOBA.PlayerEmpire.addTechCredits(2);
				thisPlanet.resourceGeneration = "2 Tech";
			}

			// farm colony credits
			if( thisPlanet.happiness > 80 && this.loyalty > 80 && thisPlanet.habitation == 4 ) {
				MOBA.PlayerEmpire.addFoodCredits(2);
				MOBA.PlayerEmpire.addTechCredits(0);
				thisPlanet.resourceGeneration = "2 Food"
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
			}else {
				console.error("Trying to add a bad type of item.")
			}
		};
		self.getItem = function(itemName) {
			var allItems = self.socialItems.concat(self.defenseItems, self.productionItems);
			var item = _.find( allItems, function(anItem){
				return anItem.name == itemName;
			});
			return item;
		};
		self.useItem = function(itemName) {
			var item = self.getItem(itemName);
			if( item != undefined ) {
				var itemList = null;
				if( item.type == "social" ) {
					itemList = self.socialItems;
				} else if( item.type == "defense" ) {
					itemList = self.defenseItems;
				} else if( item.type == "production" ) {
					itemList = self.productionItems;
				}
				var index = itemList.indexOf(item);
				console.log('ITEM USED!', item);
				return itemList.splice(index, 1);
			} else {
				console.log('Could not find item', itemName);
				return undefined;
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

	generateRadius: function(index) {
		var radius = _.random(this.minRadiusDist, this.maxRadiusDist);
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