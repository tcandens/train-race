// Contructor for creating each player, including main player and opponent
Railway = function(name) {
  this.name = name;
  this.currentMiles = 0;
  this.laborBonus = 0;
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
  this.setSupplies = function(orderObject) {
    this.supplies.wood = orderObject['wood'];
    this.supplies.steel = orderObject['steel'];
    this.supplies.labor = orderObject['labor'];
  };
  // Method for making orders that check if total cost of order exceeds available revenue
  // And then increments each order item down until cost is met
  this.makeOrder = function(orderObject) {
    var totalCost = 0;
    // Calculate totalCost of original order
    for ( key in orderObject ) {
      totalCost += orderObject[key] * Materials[key].price;
    };
    // When order exceeds revenue, increment order items downward and recalculate total cost
    while ( totalCost > this.revenue ) {
      console.log("Your order is too large!");
      for ( key in orderObject ) {
        // Make sure inventory is >= 0
        if ( orderObject[key] > 0 ) {
          // Increment order amount down by unit or rate
          orderObject[key] -= Materials[key].consumptionRate;
          // console.log(orderObject[key]);
          totalCost -= Materials[key].price;
          // console.log(totalCost);
        } else if ( orderObject[key] == 0 ) {
          orderObject[key] = 0;
        };
      };
    };
    // Assign supplies and subtract order
    this.adjustRevenue(-totalCost);
    this.setSupplies(orderObject);
    this.assignBonus();
  };

  // Check to see if supplies are depleted
  this.checkSupplies = function() {
    for ( key in this.supplies ) {
      if ( this.supplies[key] <= Materials[key].consumptionRate ) {
        return false;
        break;
      } else {
        return true;
      };
    };
  };

  // Assign laborBonus based on the amount of labor purchased
  this.assignBonus = function () {
    this.laborBonus = this.supplies['labor'] / 50;
  }

  // For building one mile of track. First, checks if supplies are depleted
  this.buildMile = function() {
    if ( this.checkSupplies() ) {
      if ( this.laborBonus > 0 && Race.progress() ) {
          this.currentMiles += this.laborBonus * Route.laborBonus;
          this.laborBonus--;
      }
      for ( key in this.supplies ) {
        this.supplies[key] -= Materials[key].consumptionRate;
      };
      this.currentMiles++;
      this.adjustRevenue(Route.mileReward);
      return true;
    } else {
      return false;
    };
  };

};

// Constructor for building materials
Material = function(name, price, consumptionRate) {
  this.name = name;
  this.price = price; // Price per unit
  this.consumptionRate = consumptionRate; // The amount of material needed to build one mile of track
};

// Generic order with an indexed array passes as an argument
Order = function(array) {
  this.wood = array[0];
  this.steel = array[1];
  this.labor = array[2];
}

<<<<<<< HEAD
=======
// Create material properties within object
var Materials = new Object();
Materials.wood = new Material("wood",5,10);
Materials.steel = new Material("steel",10,5);
Materials.labor = new Material("labor",100,0.002);

>>>>>>> optimization
// Create object for Race holding all major methods
var Race = new Object();

// Initiate main players company
Race.buildPlayer = function(name, wood, steel, labor) {

  var companyName = name;
  var companyOrder = [];
  companyOrder[0] = wood;
  companyOrder[1] = steel;
  companyOrder[2] = labor;
  // Create order object
  var order = new Order(companyOrder);
  // Build company
  Player = new Railway(companyName);
  // Grant contract deposit
  Player.adjustRevenue(Route.contractDeposit);

  Player.makeOrder(order);
  console.log(Player.supplies);
};

// Initiate opponent company
Race.buildOpponent = function() {
  // Name company
  var opponentName = "Central"
  var oppOrder = [];
  Opponent = new Railway(opponentName);
  // Grant contract deposit
  Opponent.adjustRevenue(Route.contractDeposit);
  // Select amount of supplies to order based on Players order plus/minus a randomized coeffient
  // Loop through the number of materials in Players supply
  for ( key in Player.supplies ) {
    // How much of this material did the player buy
    var playerSupply = Player.supplies[key];
    // What are the properties of this material
    var mat = Materials[key];
    var rate = mat.consumptionRate;
    var price = mat.price;
    var unitPrice = rate * price;
    // How much of this material is need to complete the route
    var remainingMat = ( Route.distance * rate ) - playerSupply;
    var reasonableAmt = ( Route.distance * rate ) / 2;
    if ( remainingMat > reasonableAmt ) {
      remainingMat = reasonableAmt;
    } else if ( remainingMat < 0 ) {
      remainingMat = 0;
    }
    // Switch that decides whether to increment up or down
    var plusMinus = Math.round(Math.random());
    var rand = Math.random();

    // Build order array
    // NOTICE: You are looping with for..in and then hacking around a lack of indeces and counter
    // with the switch/case. There might be a better way of doing this without switching back and forth
    //
    if ( plusMinus ) {
      // console.log("Plus!")
      switch ( key ) {
        case "wood":
          oppOrder[0] = Math.floor(remainingMat * ( 1 + rand ));
          console.log(oppOrder[0])
          break;
        case 'steel':
          oppOrder[1] = Math.floor(remainingMat * ( 1 + rand ));
          console.log(oppOrder[1])
          break;
        case 'labor':
          oppOrder[2] = Math.floor(remainingMat * ( 1 + rand ));
          console.log(oppOrder[2])
          break;
      };
    } else {
      // console.log("Minus!");
      switch ( key ) {
        case "wood":
          oppOrder[0] = Math.floor(remainingMat * ( 1 - rand ));
          console.log(oppOrder[0])
          break;
        case 'steel':
          oppOrder[1] = Math.floor(remainingMat * ( 1 - rand ));
          console.log(oppOrder[1])
          break;
        case 'labor':
          oppOrder[2] = Math.floor(remainingMat * ( 1 - rand ));
          console.log(oppOrder[2])
          break;
      };
    };
  };

  // Build order object from order array
  var order = new Order(oppOrder);
  // Submit order
  // console.log(oppOrder);
  Opponent.makeOrder(order);
  // console.log(Opponent.supplies);
};

// Race method to check progress. Sum of players current miles
Race.progress = function () {
  return Player.currentMiles + Opponent.currentMiles;
};

// Main Race Method | Takes bother Player and Opponent objects as arguments
Race.turn = function (player, opponent) {

  if ( this.progress() < Route.distance ) {
    player.buildMile();
    opponent.buildMile();
  } else {
    console.log("Race over!");
  };
};

Race.run = function () {

  for ( i = 0; i < Route.distance; i++ ) {
    this.turn(Player, Opponent);
    console.log(this.progress());
  };

};

Race.init = function () {
<<<<<<< HEAD
  var wood = prompt("Wood?");
  var steel = prompt("Steel?");
  var labor = prompt("Labor?");
  this.buildPlayer("Eastern", wood,steel,labor);
=======
  this.buildPlayer("Eastern", 10000,12000,100);
>>>>>>> optimization
  this.buildOpponent();
  this.run();
}

// Create material properties within object
// new Material(NAME, PRICE, RATE)
var Materials = new Object();
Materials.wood = new Material("wood", 1, 50);
Materials.steel = new Material("steel", 5, 5);
Materials.labor = new Material("labor", 100, 0.5);

// Generic object for basic race route information
var Route = {
  distance: 1900,
  unit: "miles",
<<<<<<< HEAD
  contractDeposit: 200000,
  mileReward: 1000,
  laborBonus: 10,
  reportNeeds: function() {
    var wood = Materials.wood.consumptionRate * this.distance;
    var woodPrice = wood * Materials.wood.price;
    var steel = Materials.steel.consumptionRate * this.distance;
    var steelPrice = steel * Materials.steel.price;
    var labor = Materials.labor.consumptionRate * this.distance;
    var laborPrice = labor * Materials.labor.price;
    console.log("Route Requires");
    console.log("wood: " + wood + " @ " + woodPrice );
    console.log("steel: " + steel + " @ " + steelPrice );
    console.log("labor: " + labor + " @ " + laborPrice );
    var totalPrice = woodPrice + steelPrice + laborPrice;
    console.log("TOTAL COST: " + totalPrice );
  }
=======
  contractDeposit: 2000000,
  mileReward: 100
>>>>>>> optimization
};


// Create Object to reference HTML elements and Classes
// Assets{}...
var Assets = new Object();
