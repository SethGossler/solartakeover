var itemKeeper = function(){
	console.log( 'The Item Keeper is open for Business.' );

};

itemKeeper.prototype = {
	getPlanetItems(planet) {
		console.log('get getPlanetItems', planet);
		var possibleItems = _.filter(ITEMS, function(item) {
			var isPossible = false;
			// console.log('test',  item.levelRequirement < (planet.level+1));
			// console.log('test2', isPossible || item.habitationTypes[planet.habitation] > 0);
			isPossible = item.levelRequirement <= (planet.level+1); //returning items possible next level
			isPossible = isPossible && item.habitationTypes[planet.habitation] > 0;
			return isPossible;
		});
		return possibleItems;
	}, 

	buyPlanetItem(itemName, planet) {
		console.log('trying to buy a', itemName, ' from the planet ', planet, ' huh?')
		var item = _.find(ITEMS, function(item){
			return item.name ==itemName;
		});
		var correctLevel = item.levelRequirement <= planet.level; 
		var correctHabitat = item.habitationTypes[planet.habitation] > 0 
		var gotTheGoods = item.cost.tech <= MOBA.PlayerEmpire.techCredits;
		gotTheGoods = gotTheGoods && item.cost.food <= MOBA.PlayerEmpire.foodCredits;
		gotTheGoods = gotTheGoods && item.cost.happiness <= planet.happiness;
		gotTheGoods = gotTheGoods && item.cost.loyalty <= planet.loyalty;
		gotTheGoods = gotTheGoods && item.cost.people <= planet.population;
		if(correctHabitat && correctLevel && gotTheGoods) {
			MOBA.PlayerEmpire.techCredits -= item.cost.tech;
			MOBA.PlayerEmpire.foodCredits -= item.cost.food;
			planet.happiness -= item.cost.happiness;
			planet.loyalty -= item.cost.loyalty;
			planet.population -= item.cost.peope; 
			item.affect(planet, MOBA);
			return item;
		} else {
			console.log('You cant buy this!');
			return false;
		}
	}
}

var ITEMS = [
	{
		name:'colony-ship',
		alias:'Colony Ship',
		type:'production',
		levelRequirement: 2,
		habitationTypes: [1,2,3,4],
		cost: {
			food:100,
			tech: 100,
			loyalty: -5,
			happiness: -5,
			people: 2
		},
		description: "Provides a ship to colonize other planets",
		affect: function(){
			console.log('Colony ships dont have affects');
		}
	},
	{
		name:'space-port',
		alias:'Space Port',
		type:'production',
		levelRequirement: 2,
		habitationTypes: [1,2,3,4],
		cost: {
			food: 0,
			tech: 200,
			loyalty: 4,
			happiness: 5,
			people: 0
		},
		description: "Bumps a planets experience growth by 10.",
		affect: function(planet, MOBA){
			planet.experiencePerTick += 10;
			console.log('space ports will add more experience per sec');
		}
	}
]