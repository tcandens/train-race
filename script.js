// Contructor for creating each player, including main player and opponent
Railway = function(name) {
  this.name = name;
  this.beginningMiles = 0;
  this.currentMiles = 0;
  this.supplies = {
    wood: 0,
    steel: 0,
    labor: 0,
  };
  this.revenue = 0;
  // Method the adjusts the players mile count and progress
  this.adjustMiles = function(amount) {
    this.currentMiles += amount;
  };
  // Adjusts the amount of revenue either up or down
  this.adjustRevenue = function(amount) {
    this.revenue += amount;
  };
  // Initializes company supply stock, and can then be reused
  this.setSupplies = function(wood, steel, labor) {
    this.supplies.wood = wood;
    this.supplies.steel = steel;
    this.supplies.labor = labor;
  };
};

// Constructor for building materials
Material = function(name, price, consumptionRate) {
  this.name = name;
  this.price = price;
  this.consumptionRate = consumptionRate;
};

// Create material properties within object
var Materials = new Object();
Materials.wood = new Material("wood",5,100);
Materials.steel = new Material("steel",10,50);
Materials.labor = new Material("labor",100,0);

// Create object for Race holding all major methods
var Race = new Object();
// Initiate main players company
Race.buildCompany = function() {
  // Pick which company
  var companyName = prompt("Whats your companies name?");
  // Pick supplies
  var woodStock = prompt("How much wood?");
  var steelStock = prompt("How much steel?");
  var laborStock = prompt("How many workers?");
  // Build company
  Player = new Railway(companyName);
  // Grant contract deposit
  Player.adjustRevenue(Route.contractDeposit);
  // Set Supplies
  Player.setSupplies(woodStock,steelStock,laborStock);
  var totalCost = 0;
  // Loop through each material and add its cost to totalCost
  for ( key in Materials ) {
    totalCost += Materials[key].price * Player.supplies[key];
  };
  // Subtract total cost of supply order from base revenue
  Player.adjustRevenue(-totalCost);
};

// Initiate opponent company
Race.buildOpponent = function() {
  // Name company
  var opponentName = "Central"
  Opponent = new Railway(opponentName);
}


// Generic object for basic race route information
var Route = {
  distance: 1900,
  unit: "miles",
  contractDeposit: 20000
};


// Create Object to reference HTML elements and Classes
// Assets{}...
var Assets = new Object();
Assets.intro = document.getElementById('intro');
Assets.intro.innerHTML = Route.distance + " " + Route.unit
// var intro = document.getElementById('intro');
// intro.innerHTML = Route.distance
