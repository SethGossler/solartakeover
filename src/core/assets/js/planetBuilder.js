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
		newPlanet.experiencePerTick = 1;
		newPlanet.neededExperience = 200;
		newPlanet.loyalty = 100;
		newPlanet.resourceGeneration = ""; //based on loyalty, happiness, item buffs, planet level, and planet upgrades
		newPlanet.happiness = 100;
		newPlanet.population = 0;
		newPlanet.items = new this.ItemMechanism(newPlanet);
		newPlanet.process = this.process(newPlanet);
		newPlanet.homeWorldProcess = this.homeWorldProcess;
		newPlanet.settlementProcess = this.settlementProcess;
		newPlanet.miningProcess = this.miningProcess;
		newPlanet.farmingProcess = this.farmingProcess;
		newPlanet.clickProcess = this.clickProcess(newPlanet);


		return newPlanet;
	},

	clickProcess: function(thisPlanet) {
		return function() {
			console.log("test", thisPlanet);
			for( var i = 0; i < thisPlanet.items.productionItems.length; i++ ) {
				if( thisPlanet.items && thisPlanet.items.productionItems[i] && thisPlanet.items.productionItems[i].clickAffect ) {
					thisPlanet.items.productionItems[i].clickAffect(thisPlanet, MOBA);
				}
			};
		};
	},

	process: function(thisPlanet) {
		return function(){
			if(thisPlanet.habitation == 0 ) {
				return -1; //no op;
			}
			//
			// Generic Planet Processing
			//

			// Planet needs to be mostly loyal, else they lose happiness
			if( thisPlanet.loyalty < 50 ) {
				thisPlanet.happiness--;
			}

			// Planet population changes based on happiness.
			if ( thisPlanet.happiness >= 75 ) {
				thisPlanet.population++;
			} else if ( thisPlanet.happiness < 75 && thisPlanet.happiness > 50 ) {
				thisPlanet.population = thisPlanet.population;
			} else {
				thisPlanet.population--;
				thisPlanet.loyalty--;
			}
			// Gain xp
			if( thisPlanet.happiness > 80 && this.loyalty > 80 ) {
				thisPlanet.experience += thisPlanet.experiencePerTick;
			}
			//Level up
			if(thisPlanet.experience >= thisPlanet.neededExperience) {
				thisPlanet.level++;
				thisPlanet.experience = 0;
				thisPlanet.neededExperience += thisPlanet.level * 500;
			}

			//
			// Specific planet processing.
			//
			// homework credits
			if( thisPlanet.habitation == 1) {
				thisPlanet = thisPlanet.homeWorldProcess(thisPlanet);
			}
			if( thisPlanet.habitation == 2 ) {
				thisPlanet = thisPlanet.settlementProcess(thisPlanet);
			}
			if( thisPlanet.habitation == 3 ) {
				thisPlanet = thisPlanet.miningProcess(thisPlanet);
			}
			if( thisPlanet.habitation == 4 ) {
				thisPlanet = thisPlanet.farmingProcess(thisPlanet);
			}

			// Keep happiness and loyalty and 100;
			thisPlanet.happiness = thisPlanet.happiness > 100 ? 100 : thisPlanet.happiness;
			thisPlanet.loyalty = thisPlanet.loyalty > 100 ? 100 : thisPlanet.loyalty;
		};
	},

	homeWorldProcess: function(thisPlanet) {
		// settlement colony credits
		var satisfaction = ((thisPlanet.happiness/100) + (thisPlanet.loyalty/100)) /2;
		var potentialTech = Math.ceil( (thisPlanet.population * 0.00000000012)*satisfaction );
		var potentialFood = Math.ceil( (thisPlanet.population * 0.00000000012) * satisfaction );

		if( true ) {
			MOBA.PlayerEmpire.addFoodCredits( potentialFood );
			MOBA.PlayerEmpire.addTechCredits( potentialTech );
			thisPlanet.resourceGeneration = potentialTech+" Tech / "+potentialFood+" Food";
		} else {
			thisPlanet.resourceGeneration = "Not Happy Enough.";
		}

		return thisPlanet;
	},

	settlementProcess: function(thisPlanet) {
		// settlement colony credits
		var satisfaction = ((thisPlanet.happiness/100) + (thisPlanet.loyalty/100)) /2;
		var potentialTech = Math.ceil( (thisPlanet.population * 0.25)*satisfaction );
		var mineralsNeeded = Math.ceil( potentialTech * 2 );

		if( MOBA.PlayerEmpire.mineralCredits >= mineralsNeeded) {
			MOBA.PlayerEmpire.addMineralCredits(-mineralsNeeded);
			MOBA.PlayerEmpire.addTechCredits(potentialTech);
			thisPlanet.resourceGeneration = potentialTech+" Tech / -"+mineralsNeeded+" Mineral";
		} else {
			thisPlanet.resourceGeneration = "Not Enough Minerals.";
		}

		return thisPlanet;
	},

	miningProcess: function(thisPlanet) {
		// mining coloy rdits
		var satisfaction = ((thisPlanet.happiness/100) + (thisPlanet.loyalty/100)) /2;
		var potentialMineral =  Math.ceil( (thisPlanet.population * 0.4)*satisfaction );
    var foodNeeded = Math.ceil( (thisPlanet.population * 0.4)*satisfaction );
	
		if( MOBA.PlayerEmpire.foodCredits >= foodNeeded ) {
			MOBA.PlayerEmpire.addMineralCredits(potentialMineral);
			MOBA.PlayerEmpire.addFoodCredits(-foodNeeded);
			thisPlanet.resourceGeneration = potentialMineral +" Mineral / -"+foodNeeded+" Food";
		} else {
			thisPlanet.resourceGeneration = "Not Enough Food.";
		}

		return thisPlanet;
	},

	farmingProcess: function(thisPlanet) {
		var satisfaction = ((thisPlanet.happiness/100) + (thisPlanet.loyalty/100)) /2;
		var potentialFood =  Math.ceil( (thisPlanet.population * 0.6) * satisfaction );

		if( true ) {
			MOBA.PlayerEmpire.addFoodCredits(potentialFood);
			thisPlanet.resourceGeneration = potentialFood +" Food";
		} else {
			thisPlanet.resourceGeneration = "Not Happy Enough.";
		}

		return thisPlanet;
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
		var index = _.random(0, this.planetNames.length-1);
		return this.planetNames.splice(index, 1);
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