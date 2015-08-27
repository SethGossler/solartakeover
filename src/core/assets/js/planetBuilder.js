var planetBuilder = function(){
	this.testPlanets = [
		{
			name: "Earth",
			habitation: 1,
			scale: 0.15,
			image: "planet",
			tint: 0xaaddee,
			radius: 400,
			period: 1,
			startOffset: 0
		},
		{
			name: "Nepture",
			habitation: 0,
			scale: 0.3,
			image: "planet",
			tint: 0xbbbbaa,
			radius: 900,
			period: 0.5,
			startOffset: 1
		}
	];

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

	this.maxRadiusDist = 1000; //more ore less, the # of pixels from the sun.
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
		newPlanets[0].habitation = 1;
		console.log( newPlanets );
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
		return newPlanet;
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
		scale = scale - 0.3; // makes them all smaller (A scale of "1" is too big.)
		return Math.abs(scale);
	},

	generateRadius: function() {
		var radius = _.random(150, this.maxRadiusDist);
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