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
  this.adjustRevenue = function(amount) {
    this.revenue += amount;
  };
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
  // Set Supplies
  Player.setSupplies(woodStock,steelStock,laborStock);
};


// Generic object for basic race route information
var Route = {
  distance: 1900,
  unit: "miles"
};


// Create Object to reference HTML elements and Classes
// Assets[]...
