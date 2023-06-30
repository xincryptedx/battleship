/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/factories/Gameboard.js":
/*!************************************!*\
  !*** ./src/factories/Gameboard.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship */ "./src/factories/Ship.js");
/* harmony import */ var _helpers_aiAttack_aiAttack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/aiAttack/aiAttack */ "./src/helpers/aiAttack/aiAttack.js");
/* This module is used by the Player factory to create gameboards for the user and ai
  players. The gameboard is responsible for holding information related to the state of
  a players ships, hits and misses, references representing the board state, and various
  methods for altering the board or getting information about it. */




// Gameboard factory
var Gameboard = function Gameboard(gm) {
  var thisGameboard = {
    maxBoardX: 9,
    maxBoardY: 9,
    ships: [],
    allOccupiedCells: [],
    cellsToCheck: [],
    misses: [],
    hits: [],
    direction: 1,
    hitShipType: null,
    isAi: false,
    isAutoAttacking: false,
    isAiSeeking: true,
    gameOver: false,
    canAttack: true,
    rivalBoard: null,
    canvas: null,
    addShip: null,
    receiveAttack: null,
    allSunk: null,
    logSunk: null,
    isCellSunk: null,
    alreadyAttacked: null
  };

  // Method that validates ship occupied cell coords
  var validateShip = function validateShip(ship) {
    if (!ship) return false;
    // Flag for detecting invalid position value
    var isValid = true;

    // Check that ships occupied cells are all within map and not already occupied
    var _loop = function _loop(i) {
      // On the map?
      if (ship.occupiedCells[i][0] >= 0 && ship.occupiedCells[i][0] <= thisGameboard.maxBoardX && ship.occupiedCells[i][1] >= 0 && ship.occupiedCells[i][1] <= thisGameboard.maxBoardY) {
        // Do nothing
      } else {
        isValid = false;
      }
      // Check occupied cells
      var isCellOccupied = thisGameboard.allOccupiedCells.some(function (cell) {
        return (
          // Coords found in all occupied cells already
          cell[0] === ship.occupiedCells[i][0] && cell[1] === ship.occupiedCells[i][1]
        );
      });
      if (isCellOccupied) {
        isValid = false;
        return "break"; // Break out of the loop if occupied cell is found
      }
    };
    for (var i = 0; i < ship.occupiedCells.length; i += 1) {
      var _ret = _loop(i);
      if (_ret === "break") break;
    }
    return isValid;
  };

  // Method that adds occupied cells of valid boat to list
  var addCellsToList = function addCellsToList(ship) {
    ship.occupiedCells.forEach(function (cell) {
      thisGameboard.allOccupiedCells.push(cell);
    });
  };

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  thisGameboard.addShip = function (position) {
    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : thisGameboard.direction;
    var shipTypeIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : thisGameboard.ships.length + 1;
    // Create the desired ship
    var newShip = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(shipTypeIndex, position, direction);
    // Add it to ships if it has valid occupied cells
    if (validateShip(newShip)) {
      addCellsToList(newShip);
      thisGameboard.ships.push(newShip);
    }
  };
  var addMiss = function addMiss(position) {
    if (position) {
      thisGameboard.misses.push(position);
    }
  };
  var addHit = function addHit(position, ship) {
    if (position) {
      thisGameboard.hits.push(position);
    }

    // Set the most recently hit ship
    thisGameboard.hitShipType = ship.type;
  };

  // Method for receiving an attack from opponent
  thisGameboard.receiveAttack = function (position) {
    var ships = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : thisGameboard.ships;
    return new Promise(function (resolve) {
      // Validate position is 2 in array and ships is an array, and rival board can attack
      if (Array.isArray(position) && position.length === 2 && Number.isInteger(position[0]) && Number.isInteger(position[1]) && Array.isArray(ships)) {
        // Each ship in ships
        for (var i = 0; i < ships.length; i += 1) {
          if (
          // If the ship is not falsy, and occupiedCells prop exists and is an array
          ships[i] && ships[i].occupiedCells && Array.isArray(ships[i].occupiedCells)) {
            // For each of that ships occupied cells
            for (var j = 0; j < ships[i].occupiedCells.length; j += 1) {
              if (
              // If that cell matches the attack position
              ships[i].occupiedCells[j][0] === position[0] && ships[i].occupiedCells[j][1] === position[1]) {
                // Call that ships hit method and break out of loop
                ships[i].hit();
                addHit(position, ships[i]);
                resolve(true);
                return;
              }
            }
          }
        }
      }
      addMiss(position);
      resolve(false);
    });
  };

  // Method for trying ai attacks
  thisGameboard.tryAiAttack = function (delay) {
    // Return if not ai or game is over
    if (thisGameboard.isAi === false) return;
    (0,_helpers_aiAttack_aiAttack__WEBPACK_IMPORTED_MODULE_1__["default"])(gm, delay);
  };

  // Method that determines if all ships are sunk or not
  thisGameboard.allSunk = function () {
    var shipArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : thisGameboard.ships;
    if (!shipArray || !Array.isArray(shipArray)) return undefined;
    var allSunk = true;
    shipArray.forEach(function (ship) {
      if (ship && ship.isSunk && !ship.isSunk()) allSunk = false;
    });
    return allSunk;
  };

  // Object for tracking board's sunken ships
  thisGameboard.sunkenShips = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  };

  // Method for reporting sunken ships
  thisGameboard.logSunk = function () {
    var logMsg = null;
    Object.keys(thisGameboard.sunkenShips).forEach(function (key) {
      if (thisGameboard.sunkenShips[key] === false && thisGameboard.ships[key - 1].isSunk()) {
        var ship = thisGameboard.ships[key - 1].type;
        var player = thisGameboard.isAi ? "AI's" : "User's";
        logMsg = "<span style=\"color: red\">".concat(player, " ").concat(ship, " was destroyed!</span>");
        thisGameboard.sunkenShips[key] = true;
        // Call the method for responding to user ship sunk on game manager
        if (!thisGameboard.isAi) gm.userShipSunk(thisGameboard.ships[key - 1]);
      }
    });
    return logMsg;
  };

  // Method for determining if a position is already attacked
  thisGameboard.alreadyAttacked = function (attackCoords) {
    var attacked = false;
    thisGameboard.hits.forEach(function (hit) {
      if (attackCoords[0] === hit[0] && attackCoords[1] === hit[1]) {
        attacked = true;
      }
    });
    thisGameboard.misses.forEach(function (miss) {
      if (attackCoords[0] === miss[0] && attackCoords[1] === miss[1]) {
        attacked = true;
      }
    });
    return attacked;
  };

  // Method for returning bool for if cell occupied by sunk ship
  thisGameboard.isCellSunk = function (cellToCheck) {
    var isCellSunk = false; // Flag variable

    Object.keys(thisGameboard.sunkenShips).forEach(function (key) {
      if (thisGameboard.sunkenShips[key] === true && !isCellSunk) {
        var hasMatchingCell = thisGameboard.ships[key - 1].occupiedCells.some(function (cell) {
          return cellToCheck[0] === cell[0] && cellToCheck[1] === cell[1];
        });
        if (hasMatchingCell) {
          isCellSunk = true;
        }
      }
    });
    return isCellSunk;
  };
  return thisGameboard;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/factories/GridCanvas/GridCanvas.js":
/*!************************************************!*\
  !*** ./src/factories/GridCanvas/GridCanvas.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw */ "./src/factories/GridCanvas/draw.js");
/* This module creates and returns a dual, layered canvas element. The bottom layer is the board
  canvas that represpents basic board elements that don't change often, such as ships, hits, misses
  and grid lines. The top layer is the overlay canvas that represents frequently changing elements
  like highlighting cells to indicate where attacks or ships will go. 
  
  It also sets up handlers for browser mouse events that allow the human user to interact with the
  program, such as placing ships and picking cells to attack. */

// Helper module for draw methods


// Initialize it
var draw = (0,_draw__WEBPACK_IMPORTED_MODULE_0__["default"])();
var createCanvas = function createCanvas(gm, canvasX, canvasY, options) {
  // #region Set up basic element properties
  // Set the grid height and width and add ref to current cell
  var gridHeight = 10;
  var gridWidth = 10;
  var currentCell = null;

  // Create parent div that holds the canvases. This is the element returned.
  var canvasContainer = document.createElement("div");
  canvasContainer.classList.add("canvas-container");

  // Create the board canvas element to serve as the gameboard base
  var boardCanvas = document.createElement("canvas");
  canvasContainer.appendChild(boardCanvas);
  boardCanvas.width = canvasX;
  boardCanvas.height = canvasY;
  var boardCtx = boardCanvas.getContext("2d");

  // Create the overlay canvas for rendering ship placement and attack selection
  var overlayCanvas = document.createElement("canvas");
  canvasContainer.appendChild(overlayCanvas);
  overlayCanvas.width = canvasX;
  overlayCanvas.height = canvasY;
  var overlayCtx = overlayCanvas.getContext("2d");

  // Set the "cell size" for the grid represented by the canvas
  var cellSizeX = boardCanvas.width / gridWidth; // Module const
  var cellSizeY = boardCanvas.height / gridHeight; // Module const

  // #endregion

  // #region General helper methods
  // Method that gets the mouse position based on what cell it is over
  var getMouseCell = function getMouseCell(event) {
    var rect = boardCanvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var cellX = Math.floor(mouseX / cellSizeX);
    var cellY = Math.floor(mouseY / cellSizeY);
    return [cellX, cellY];
  };

  // #endregion

  // #region Assign static methods
  // Add methods on the container for drawing hits or misses
  canvasContainer.drawHit = function (coordinates) {
    return draw.hitOrMiss(boardCtx, cellSizeX, cellSizeY, coordinates, 1);
  };
  canvasContainer.drawMiss = function (coordinates) {
    return draw.hitOrMiss(boardCtx, cellSizeX, cellSizeY, coordinates, 0);
  };

  // Add method to container for ships to board canvas
  canvasContainer.drawShips = function () {
    var userShips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    draw.ships(boardCtx, cellSizeX, cellSizeY, gm, userShips);
  };

  // overlayCanvas
  // Forward clicks to board canvas
  overlayCanvas.handleMouseClick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var newEvent = new MouseEvent("click", {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      clientX: event.clientX,
      clientY: event.clientY
    });
    boardCanvas.dispatchEvent(newEvent);
  };

  // Mouseleave
  overlayCanvas.handleMouseLeave = function () {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    currentCell = null;
  };

  // #endregion

  // #region Assign behavior using browser event handlers based on options
  // Placement is used for placing ships
  if (options.type === "placement") {
    // Add class to canvasContainer to denote placement container
    canvasContainer.classList.add("placement-canvas-container");
    // Set up overlayCanvas with behaviors unique to placement
    overlayCanvas.handleMouseMove = function (event) {
      // Get what cell the mouse is over
      var mouseCell = getMouseCell(event);
      // If the 'old' currentCell is equal to the mouseCell being evaluated
      if (!(currentCell && currentCell[0] === mouseCell[0] && currentCell[1] === mouseCell[1])) {
        // Render the changes
        draw.placementHighlight(overlayCtx, canvasX, canvasY, cellSizeX, cellSizeY, mouseCell, gm);
        // highlightPlacementCells(mouseCell);
      }

      // Set the currentCell to the mouseCell for future comparisons
      currentCell = mouseCell;
    };

    // Browser click events
    boardCanvas.handleMouseClick = function (event) {
      var cell = getMouseCell(event);

      // Try placement
      gm.placementClicked(cell);
    };
  }
  // User canvas for displaying ai hits and misses against user and user ship placements
  else if (options.type === "user") {
    // Add class to denote user canvas
    canvasContainer.classList.add("user-canvas-container");
    // Handle canvas mouse move
    overlayCanvas.handleMouseMove = function () {
      // Do nothing
    };
    // Handle board mouse click
    boardCanvas.handleMouseClick = function () {
      // Do nothing
    };
  }
  // AI canvas for displaying user hits and misses against ai, and ai ship placements if user loses
  else if (options.type === "ai") {
    // Add class to denote ai canvas
    canvasContainer.classList.add("ai-canvas-container");
    // Handle canvas mouse move
    overlayCanvas.handleMouseMove = function (event) {
      // Get what cell the mouse is over
      var mouseCell = getMouseCell(event);
      // If the 'old' currentCell is equal to the mouseCell being evaluated
      if (!(currentCell && currentCell[0] === mouseCell[0] && currentCell[1] === mouseCell[1])) {
        // Highlight the current cell in red
        draw.attackHighlight(overlayCtx, canvasX, canvasY, cellSizeX, cellSizeY, mouseCell, gm);
        // highlightAttack(mouseCell);
      }
      // Denote if it is a valid attack or not - NYI
    };
    // Handle board mouse click
    boardCanvas.handleMouseClick = function (event) {
      var attackCoords = getMouseCell(event);
      gm.playerAttacking(attackCoords);

      // Clear the overlay to show hit/miss under current highight
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    };
  }
  // #endregion

  // Subscribe to browser events
  // board click
  boardCanvas.addEventListener("click", function (e) {
    return boardCanvas.handleMouseClick(e);
  });
  // overlay click
  overlayCanvas.addEventListener("click", function (e) {
    return overlayCanvas.handleMouseClick(e);
  });
  // overlay mousemove
  overlayCanvas.addEventListener("mousemove", function (e) {
    return overlayCanvas.handleMouseMove(e);
  });
  // overlay mouseleave
  overlayCanvas.addEventListener("mouseleave", function () {
    return overlayCanvas.handleMouseLeave();
  });

  // Draw initial board lines
  draw.lines(boardCtx, canvasX, canvasY);

  // Return completed canvases
  return canvasContainer;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCanvas);

/***/ }),

/***/ "./src/factories/GridCanvas/draw.js":
/*!******************************************!*\
  !*** ./src/factories/GridCanvas/draw.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* This module contains the methods used by GridCanvas to actuall draw elements
  to the board and overlay canvas elements. This includes grid lines, ship placements,
  hits, misses and various cell highlight effects. */

var draw = function draw() {
  // Draws the grid lines
  var lines = function lines(context, canvasX, canvasY) {
    // Draw grid lines
    var gridSize = Math.min(canvasX, canvasY) / 10;
    var lineColor = "black";
    context.strokeStyle = lineColor;
    context.lineWidth = 1;

    // Draw vertical lines
    for (var x = 0; x <= canvasX; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasY);
      context.stroke();
    }

    // Draw horizontal lines
    for (var y = 0; y <= canvasY; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasX, y);
      context.stroke();
    }
  };

  // Draws the ships. Default data to use is user ships, but ai can be used too
  var ships = function ships(context, cellX, cellY, gm) {
    var userShips = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    // Draw a cell to board
    function drawCell(posX, posY) {
      context.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }
    // Which board to get ships data from
    var board = userShips === true ? gm.userBoard : gm.aiBoard;
    // Draw the cells to the board
    board.ships.forEach(function (ship) {
      ship.occupiedCells.forEach(function (cell) {
        drawCell(cell[0], cell[1]);
      });
    });
  };

  // Draws a hit or a miss defaulting to a miss if no type passed
  var hitOrMiss = function hitOrMiss(context, cellX, cellY, mouseCoords) {
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    // Set proper fill color
    context.fillStyle = "white";
    if (type === 1) context.fillStyle = "red";
    // Set a radius for circle to draw for "peg" that will always fit in cell
    var radius = cellX > cellY ? cellY / 2 : cellX / 2;
    // Draw the circle
    context.beginPath();
    context.arc(mouseCoords[0] * cellX + cellX / 2, mouseCoords[1] * cellY + cellY / 2, radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  };
  var placementHighlight = function placementHighlight(context, canvasX, canvasY, cellX, cellY, mouseCoords, gm) {
    // Clear the canvas
    context.clearRect(0, 0, canvasX, canvasY);
    // Draw a cell to overlay
    function drawCell(posX, posY) {
      context.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }

    // Determine current ship length (based on default battleship rules sizes, smallest to biggest)
    var drawLength;
    var shipsCount = gm.userBoard.ships.length;
    if (shipsCount === 0) drawLength = 2;else if (shipsCount === 1 || shipsCount === 2) drawLength = 3;else drawLength = shipsCount + 1;

    // Determine direction to draw in
    var directionX = 0;
    var directionY = 0;
    if (gm.userBoard.direction === 1) {
      directionY = 1;
      directionX = 0;
    } else if (gm.userBoard.direction === 0) {
      directionY = 0;
      directionX = 1;
    }

    // Divide the drawLenght in half with remainder
    var halfDrawLength = Math.floor(drawLength / 2);
    var remainderLength = drawLength % 2;

    // If drawing off canvas make color red
    // Calculate maximum and minimum coordinates
    var maxCoordinateX = mouseCoords[0] + (halfDrawLength + remainderLength - 1) * directionX;
    var maxCoordinateY = mouseCoords[1] + (halfDrawLength + remainderLength - 1) * directionY;
    var minCoordinateX = mouseCoords[0] - halfDrawLength * directionX;
    var minCoordinateY = mouseCoords[1] - halfDrawLength * directionY;

    // And translate into an actual canvas position
    var maxX = maxCoordinateX * cellX;
    var maxY = maxCoordinateY * cellY;
    var minX = minCoordinateX * cellX;
    var minY = minCoordinateY * cellY;

    // Check if any cells are outside the canvas boundaries
    var isOutOfBounds = maxX >= canvasX || maxY >= canvasY || minX < 0 || minY < 0;

    // Set the fill color based on whether cells are drawn off canvas
    context.fillStyle = isOutOfBounds ? "red" : "blue";

    // Draw the moused over cell from passed coords
    drawCell(mouseCoords[0], mouseCoords[1]);

    // Draw the first half of cells and remainder in one direction
    for (var i = 0; i < halfDrawLength + remainderLength; i += 1) {
      var nextX = mouseCoords[0] + i * directionX;
      var nextY = mouseCoords[1] + i * directionY;
      drawCell(nextX, nextY);
    }

    // Draw the remaining half
    // Draw the remaining cells in the opposite direction
    for (var _i = 0; _i < halfDrawLength; _i += 1) {
      var _nextX = mouseCoords[0] - (_i + 1) * directionX;
      var _nextY = mouseCoords[1] - (_i + 1) * directionY;
      drawCell(_nextX, _nextY);
    }
  };
  var attackHighlight = function attackHighlight(context, canvasX, canvasY, cellX, cellY, mouseCoords, gm) {
    // Clear the canvas
    context.clearRect(0, 0, canvasX, canvasY);

    // Highlight the current cell in red
    context.fillStyle = "red";

    // Check if cell coords in gameboard hits or misses
    if (gm.aiBoard.alreadyAttacked(mouseCoords)) return;

    // Highlight the cell
    context.fillRect(mouseCoords[0] * cellX, mouseCoords[1] * cellY, cellX, cellY);
  };
  return {
    lines: lines,
    ships: ships,
    hitOrMiss: hitOrMiss,
    placementHighlight: placementHighlight,
    attackHighlight: attackHighlight
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (draw);

/***/ }),

/***/ "./src/factories/Player.js":
/*!*********************************!*\
  !*** ./src/factories/Player.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/factories/Gameboard.js");
/* This module is used to create the player objects that store other objects and info related
  to the user player and AI player. This includes their gameboards, names, and a method for
  sending attacks to a gameboard. */



/* Factory that creates and returns a player object that can take a shot at opponent's game board.
   Requires gameManager for gameboard methods */
var Player = function Player(gm) {
  var privateName = "";
  var thisPlayer = {
    get name() {
      return privateName;
    },
    set name(newName) {
      if (newName) {
        privateName = newName.toString();
      } else privateName = "";
    },
    gameboard: (0,_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])(gm),
    sendAttack: null
  };

  // Helper method for validating that attack position is on board
  var validateAttack = function validateAttack(position, gameboard) {
    // Does gameboard exist with maxBoardX/y properties?
    if (!gameboard || !gameboard.maxBoardX || !gameboard.maxBoardY) {
      return false;
    }
    // Is position constrained to maxboardX/Y and both are ints in an array?
    if (position && Array.isArray(position) && position.length === 2 && Number.isInteger(position[0]) && Number.isInteger(position[1]) && position[0] >= 0 && position[0] <= gameboard.maxBoardX && position[1] >= 0 && position[1] <= gameboard.maxBoardY) {
      return true;
    }
    return false;
  };

  // Method for sending attack to rival gameboard
  thisPlayer.sendAttack = function (position) {
    var playerBoard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : thisPlayer.gameboard;
    if (validateAttack(position, playerBoard)) {
      playerBoard.rivalBoard.receiveAttack(position);
    }
  };
  return thisPlayer;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/factories/Ship.js":
/*!*******************************!*\
  !*** ./src/factories/Ship.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* This module is a factory used by the Gameboard factory module to populate gameboards with
  ships. A ship object will be returned that includes various information about the state
  of the ship such as what cells it occupies, its size, type, etc. */

// Contains the names for the ships based on index
var shipNames = {
  1: "Sentinel Probe",
  2: "Assault Titan",
  3: "Viper Mech",
  4: "Iron Goliath",
  5: "Leviathan"
};

// Factory for creating ships
var Ship = function Ship(index, position, direction) {
  // Validate index
  if (!Number.isInteger(index) || index > 5 || index < 1) return undefined;

  // Create the ship object that will be returned
  var thisShip = {
    index: index,
    size: null,
    type: null,
    hits: 0,
    hit: null,
    isSunk: null,
    occupiedCells: []
  };

  // Set ship size
  switch (index) {
    case 1:
      thisShip.size = 2;
      break;
    case 2:
      thisShip.size = 3;
      break;
    default:
      thisShip.size = index;
  }

  // Set ship name based on index
  thisShip.type = shipNames[thisShip.index];

  // Adds a hit to the ship
  thisShip.hit = function () {
    thisShip.hits += 1;
  };

  // Determines if ship sunk is true
  thisShip.isSunk = function () {
    if (thisShip.hits >= thisShip.size) return true;
    return false;
  };

  // Placement direction is either 0 for horizontal or 1 for vertical
  var placementDirectionX = 0;
  var placementDirectionY = 0;
  if (direction === 0) {
    placementDirectionX = 1;
    placementDirectionY = 0;
  } else if (direction === 1) {
    placementDirectionX = 0;
    placementDirectionY = 1;
  }

  // Use position and direction to add occupied cells coords
  if (Array.isArray(position) && position.length === 2 && Number.isInteger(position[0]) && Number.isInteger(position[1]) && (direction === 1 || direction === 0)) {
    // Divide length into half and remainder
    var halfSize = Math.floor(thisShip.size / 2);
    var remainderSize = thisShip.size % 2;
    // Add first half of cells plus remainder in one direction
    for (var i = 0; i < halfSize + remainderSize; i += 1) {
      var newCoords = [position[0] + i * placementDirectionX, position[1] + i * placementDirectionY];
      thisShip.occupiedCells.push(newCoords);
    }
    // Add second half of cells
    for (var _i = 0; _i < halfSize; _i += 1) {
      var _newCoords = [position[0] - (_i + 1) * placementDirectionX, position[1] - (_i + 1) * placementDirectionY];
      thisShip.occupiedCells.push(_newCoords);
    }
  }
  return thisShip;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./src/helpers/aiAttack/aiAttack.js":
/*!******************************************!*\
  !*** ./src/helpers/aiAttack/aiAttack.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aiBrain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./aiBrain */ "./src/helpers/aiAttack/aiBrain.js");
/* This module is used to determine what cells the AI should attack. It chooses attack 
  startegies based on the ai difficulty setting on the gameManager. After attack coords
  are found they are sent off to the gameManager to handle the aiAttacking logic for the
  rest of the program. */



// Module that allows ai to make attacks based on probability and heuristics
var brain = (0,_aiBrain__WEBPACK_IMPORTED_MODULE_0__["default"])();

// This helper will look at current hits and misses and then return an attack
var aiAttack = function aiAttack(gm, delay) {
  var gridHeight = 10;
  var gridWidth = 10;
  var attackCoords = [];

  // Update cell hit probabilities
  brain.updateProbs(gm);

  // Method for returning random attack
  var findRandomAttack = function findRandomAttack() {
    var x = Math.floor(Math.random() * gridWidth);
    var y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Method that finds largest value in 2d array
  var findGreatestProbAttack = function findGreatestProbAttack() {
    var allProbs = brain.probs;
    var max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < allProbs.length; i += 1) {
      for (var j = 0; j < allProbs[i].length; j += 1) {
        if (allProbs[i][j] > max) {
          max = allProbs[i][j];
          attackCoords = [i, j];
        }
      }
    }
  };

  // Random attack if ai difficulty is 1
  if (gm.aiDifficulty === 1) {
    // Set random attack  coords that have not been attacked
    findRandomAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findRandomAttack();
    }
  }

  // Do an attack based on probabilities if ai difficulty is 2 and is seeking
  else if (gm.aiDifficulty === 2 && gm.aiBoard.isAiSeeking) {
    // First ensure that empty cells are set to their initialized probs when seeking
    brain.resetHitAdjacentIncreases();
    // Then find the best attack
    findGreatestProbAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findGreatestProbAttack();
    }
  }

  // Do an attack based on destroy behavior after a hit is found
  else if (gm.aiDifficulty === 2 && !gm.aiBoard.isAiSeeking) {
    // Get coords using destroy method
    var coords = brain.destroyModeCoords(gm);
    // If no coords are returned instead use seeking strat
    if (!coords) {
      // First ensure that empty cells are set to their initialized probs when seeking
      brain.resetHitAdjacentIncreases();
      // Then find the best attack
      findGreatestProbAttack();
      while (gm.userBoard.alreadyAttacked(attackCoords)) {
        findGreatestProbAttack();
      }
    }
    // Else if coords returned, use those for attack
    else if (coords) {
      attackCoords = coords;
    }
  }
  // Send attack to game manager
  gm.aiAttacking(attackCoords, delay);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiAttack);

/***/ }),

/***/ "./src/helpers/aiAttack/aiBrain.js":
/*!*****************************************!*\
  !*** ./src/helpers/aiAttack/aiBrain.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createProbs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createProbs */ "./src/helpers/aiAttack/createProbs.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* This module serves as the intelligence of the AI player. It uses a 2d array of hit 
probabilities, made available to aiAttack, to determine attack coords when the AI is in 
seek mode. When a new hit is found and the AI switches to destroy mode a different set of
methods are used to destroy found ships quickly and logically. There is also a set of methods
for updating the probabilities in response to hits and ships being sunk in order to better
determine attacks while in destroy mode. */


var aiBrain = function aiBrain() {
  // Probability modifiers
  var colorMod = 0.33; // Strong negative bias used to initialize all probs
  var adjacentMod = 4; // Medium positive bias for hit adjacent adjustments

  // Create the probs
  var probs = (0,_createProbs__WEBPACK_IMPORTED_MODULE_0__["default"])(colorMod);

  // Copy the initial probs for later use
  var initialProbs = probs.map(function (row) {
    return _toConsumableArray(row);
  });

  // #region General use helpers
  // Helper that checks if valid cell on grid
  function isValidCell(row, col) {
    // Set rows and cols
    var numRows = probs[0].length;
    var numCols = probs.length;
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
  }

  // Helper that checks if cell is a boundary or miss (-1 value)
  function isBoundaryOrMiss(row, col) {
    return !isValidCell(row, col) || probs[row][col] === -1;
  }

  // Helpers for getting remaining ship lengths
  var getLargestRemainingLength = function getLargestRemainingLength(gm) {
    // Largest ship length
    var largestShipLength = null;
    for (var i = Object.keys(gm.userBoard.sunkenShips).length; i >= 1; i -= 1) {
      if (!gm.userBoard.sunkenShips[i]) {
        largestShipLength = i;
        largestShipLength = i === 1 ? 2 : largestShipLength;
        largestShipLength = i === 2 ? 3 : largestShipLength;
        break;
      }
    }
    return largestShipLength;
  };
  var getSmallestRemainingLength = function getSmallestRemainingLength(gm) {
    var smallestShipLength = null;
    for (var i = 0; i < Object.keys(gm.userBoard.sunkenShips).length; i += 1) {
      if (!gm.userBoard.sunkenShips[i]) {
        smallestShipLength = i === 0 ? 2 : smallestShipLength;
        smallestShipLength = i === 1 ? 3 : smallestShipLength;
        smallestShipLength = i > 1 ? i : smallestShipLength;
        break;
      }
    }
    return smallestShipLength;
  };

  // #endregion

  // #region Destory mode move determination

  /* The general idea here is to cause the AI to do what human players do upon finding
    a new ship. Typically when you find a ship you start attacking adjacent cells to 
    find the "next part" of the ship, changing to other adjacent cells when finding a miss,
    or going in the other direction when a mis is found after a hit, etc.
    
    This is accomplished using lists of cells to check and recursive logic to keep checking
    the "next cell" after an adjacent hit is found, as well as to recursively keep checking
    if a ship is sunk, but other hits exist that aren't part of the sunken ship, which
    indicates more ships that have been discovered but not yet sunk. */

  // Helper for loading adjacent cells into appropriate arrays
  var loadAdjacentCells = function loadAdjacentCells(centerCell, adjacentHits, adjacentEmpties, gm) {
    // Center Cell x and y
    var _centerCell = _slicedToArray(centerCell, 2),
      centerX = _centerCell[0],
      centerY = _centerCell[1];
    // Adjacent values row first, then col
    var top = [centerY - 1, centerX, "top"];
    var bottom = [centerY + 1, centerX, "bottom"];
    var left = [centerY, centerX - 1, "left"];
    var right = [centerY, centerX + 1, "right"];

    // Fn that checks the cells and adds them to arrays
    function checkCell(cellY, cellX, direction) {
      if (isValidCell(cellY, cellX)) {
        // If hit and not occupied by sunken ship add to hits
        if (probs[cellX][cellY] === 0 && !gm.userBoard.isCellSunk([cellX, cellY])) {
          adjacentHits.push([cellX, cellY, direction]);
        }
        // If empty add to empites
        else if (probs[cellX][cellY] > 0) {
          adjacentEmpties.push([cellX, cellY, direction]);
        }
      }
    }
    checkCell.apply(void 0, top);
    checkCell.apply(void 0, bottom);
    checkCell.apply(void 0, left);
    checkCell.apply(void 0, right);
  };

  // Helper that returns highest prob adjacent empty
  var returnBestAdjacentEmpty = function returnBestAdjacentEmpty(adjacentEmpties) {
    var attackCoords = null;
    // Check each empty cell and return the most likely hit based on probs
    var maxValue = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < adjacentEmpties.length; i += 1) {
      var _adjacentEmpties$i = _slicedToArray(adjacentEmpties[i], 2),
        x = _adjacentEmpties$i[0],
        y = _adjacentEmpties$i[1];
      var value = probs[x][y];
      // Update maxValue if found value bigger, along with attack coords
      if (value > maxValue) {
        maxValue = value;
        attackCoords = [x, y];
      }
    }
    return attackCoords;
  };

  // Helper method for handling adjacent hits recursively
  var handleAdjacentHit = function handleAdjacentHit(gm, adjacentHits, adjacentEmpties) {
    var cellCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    // Increment cell count
    var thisCount = cellCount + 1;

    // Biggest ship length
    var largestShipLength = getLargestRemainingLength(gm);

    // If thisCount is bigger than the biggest possible line of ships
    if (thisCount > largestShipLength) {
      return null;
    }

    // Get the adjacent hit to consider
    var hit = adjacentHits[0];
    var _hit = _slicedToArray(hit, 3),
      hitX = _hit[0],
      hitY = _hit[1],
      direction = _hit[2];

    // The next cell in the same direction
    var nextCell = null;
    if (direction === "top") nextCell = [hitX, hitY - 1];else if (direction === "bottom") nextCell = [hitX, hitY + 1];else if (direction === "left") nextCell = [hitX - 1, hitY];else if (direction === "right") nextCell = [hitX + 1, hitY];
    var _nextCell = nextCell,
      _nextCell2 = _slicedToArray(_nextCell, 2),
      nextX = _nextCell2[0],
      nextY = _nextCell2[1];

    // Ref to found empty cell
    var foundEmpty = null;

    // If cell count is not larger than the biggest remaining ship
    var checkNextCell = function checkNextCell(nX, nY) {
      if (thisCount <= largestShipLength) {
        // If next cell is a miss stop checking in this direction by removing the adjacentHit
        if (probs[nX][nY] === -1 || !isValidCell(nY, nX)) {
          adjacentHits.shift();
          // Then if adjacent hits isn't empty try to handle the next adjacent hit
          if (adjacentHits.length > 0) {
            foundEmpty = handleAdjacentHit(gm, adjacentHits, adjacentEmpties);
          }
          // Else if it is empty try to return the best adjacent empty cell
          else {
            foundEmpty = returnBestAdjacentEmpty(adjacentEmpties);
          }
        }
        // If the cell is a hit
        else if (probs[nX][nY] === 0) {
          // Increment the cell count
          thisCount += 1;
          // New next cell ref
          var newNext = null;
          // Increment the nextCell in the same direction as adjacent hit being checked
          if (direction === "top") newNext = [nX, nY - 1];else if (direction === "bottom") newNext = [nX, nY + 1];else if (direction === "left") newNext = [nX - 1, nY];else if (direction === "right") newNext = [nX + 1, nY];
          // Set nextX and nextY to the coords of this incremented next cell
          var _newNext = newNext,
            _newNext2 = _slicedToArray(_newNext, 2),
            newX = _newNext2[0],
            newY = _newNext2[1];
          // Recursively check the next cell
          checkNextCell(newX, newY);
        }
        // The cell is empty and valid
        else if (isValidCell(nY, nX) && probs[nX][nY] > 0) {
          foundEmpty = [nX, nY];
        }
      }
    };

    // Initial call to above recursive helper
    if (thisCount <= largestShipLength) {
      checkNextCell(nextX, nextY);
    }
    return foundEmpty;
  };

  // Helper method for checking the adjacent hits for nearby empties
  var checkAdjacentCells = function checkAdjacentCells(adjacentHits, adjacentEmpties, gm) {
    // Variable for coordiates to return
    var attackCoords = null;

    // If no hits then set attackCoords to an empty cell if one exists
    if (adjacentHits.length === 0 && adjacentEmpties.length > 0) {
      attackCoords = returnBestAdjacentEmpty(adjacentEmpties);
    }

    // If there are hits then handle checking cells after them to find empty for attack
    if (adjacentHits.length > 0) {
      attackCoords = handleAdjacentHit(gm, adjacentHits, adjacentEmpties);
    }
    return attackCoords;
  };

  // Method for destrying found ships
  var destroyModeCoords = function destroyModeCoords(gm) {
    // Look at first cell to check which will be the oldest added cell
    var cellToCheck = gm.aiBoard.cellsToCheck[0];

    // Put all adjacent cells in adjacentEmpties/adjacentHits
    var adjacentHits = [];
    var adjacentEmpties = [];
    loadAdjacentCells(cellToCheck, adjacentHits, adjacentEmpties, gm);
    var attackCoords = checkAdjacentCells(adjacentHits, adjacentEmpties, gm);

    // If ajdacentEmpties and adjacentHits are both empty and attack coords null
    if (attackCoords === null && adjacentHits.length === 0 && adjacentEmpties.length === 0) {
      // Remove the first entry of cells to check
      gm.aiBoard.cellsToCheck.shift();
      // If cells remain to be checked
      if (gm.aiBoard.cellsToCheck.length > 0) {
        // Try using the next cell to check for destroyModeCoords
        destroyModeCoords(gm);
      }
    }

    // console.log(`Destroy target found! ${attackCoords}`);
    return attackCoords;
  };

  // #endregion

  // #region Methods for updating probs on hit and miss

  /* When a hit is first discovered, horizontal and vertical cells get a stacking,
    temporariy probability increase. This is to help direct the destroy process to
    choose the best cells while destroying, for example only attacking empty cells
    in the same direction as the likely ship placement.
    
    After all currently discovered ships are destroyed, the probabilities of remaining
    empty cells are brought back to their initial values so as to not disrupt the optimal
    seeking process when looking for the next ship. */

  // Records wich cells were altered with hidAdjacentIncrease
  var increasedAdjacentCells = [];
  // Increase adjacent cells to new hits
  var hitAdjacentIncrease = function hitAdjacentIncrease(hitX, hitY, largestLength) {
    // Vars for calculating decrement factor
    var startingDec = 1;
    var decPercentage = 0.1;
    var minDec = 0.5;

    // Iterate through the cells and update them
    // North
    for (var i = 0; i < largestLength; i += 1) {
      var decrementFactor = startingDec - i * decPercentage;
      if (decrementFactor < minDec) decrementFactor = minDec;
      // North if on board
      if (hitY - i >= 0) {
        // Increase the probability
        probs[hitX][hitY - i] *= adjacentMod * decrementFactor;
        // Record the cell to increased adjacent cells for later use
        increasedAdjacentCells.push([hitX, hitY - i]);
      }
      // South if on board
      if (hitY + i <= 9) {
        probs[hitX][hitY + i] *= adjacentMod * decrementFactor;
        increasedAdjacentCells.push([hitX, hitY + i]);
      }
      // West if on board
      if (hitX - i >= 0) {
        probs[hitX - i][hitY] *= adjacentMod * decrementFactor;
        increasedAdjacentCells.push([hitX - i, hitY]);
      }
      // East if on board
      if (hitX + i <= 9) {
        probs[hitX + i][hitY] *= adjacentMod * decrementFactor;
        increasedAdjacentCells.push([hitX + i, hitY]);
      }
    }
  };
  var resetHitAdjacentIncreases = function resetHitAdjacentIncreases() {
    // If list empty then just return
    if (increasedAdjacentCells.length === 0) return;
    // If the values in the list are still empty
    for (var i = 0; i < increasedAdjacentCells.length; i += 1) {
      var _increasedAdjacentCel = _slicedToArray(increasedAdjacentCells[i], 2),
        x = _increasedAdjacentCel[0],
        y = _increasedAdjacentCel[1];
      if (probs[x][y] > 0) {
        // Re-initialize their prob value
        probs[x][y] = initialProbs[x][y];
        // And remove them from the list
        increasedAdjacentCells.splice(i, 1);
        // Reset the iterator
        i = -1;
      }
    }
  };
  var checkDeadCells = function checkDeadCells() {
    // Set rows and cols
    var numRows = probs[0].length;
    var numCols = probs.length;

    // For every cell, check the cells around it. If they are all boundary or miss then set to -1
    for (var row = 0; row < numRows; row += 1) {
      for (var col = 0; col < numCols; col += 1) {
        // If the cell is an empty cell (> 0) and adjacent cells are boundary or miss
        if (probs[row][col] > 0 && isBoundaryOrMiss(row, col - 1) && isBoundaryOrMiss(row, col + 1) && isBoundaryOrMiss(row - 1, col) && isBoundaryOrMiss(row + 1, col)) {
          // Set that cell to a miss since it cannot be a hit
          probs[row][col] = -1;
          /* console.log(
            `${row}, ${col} surrounded and cannot be a hit. Set to miss.`
          ); */
        }
      }
    }
  };

  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  var updateProbs = function updateProbs(gm) {
    // These values are used as the evidence to update the probabilities on the probs
    var _gm$userBoard = gm.userBoard,
      hits = _gm$userBoard.hits,
      misses = _gm$userBoard.misses;

    // Largest ship length
    var largestShipLength = getLargestRemainingLength(gm);
    // Smallest ship length
    var smallestShipLength = getSmallestRemainingLength(gm);

    // Update values based on hits
    Object.values(hits).forEach(function (hit) {
      var _hit2 = _slicedToArray(hit, 2),
        x = _hit2[0],
        y = _hit2[1];
      // If the hit is new, and therefore the prob for that hit is not yet 0
      if (probs[x][y] !== 0) {
        // Apply the increase to adjacent cells. This will be reduced to inital probs on seek mode.
        hitAdjacentIncrease(x, y, largestShipLength);
        // Set the probability of the hit to 0
        probs[x][y] = 0;
      }
    });

    // Update values based on misses
    Object.values(misses).forEach(function (miss) {
      var _miss = _slicedToArray(miss, 2),
        x = _miss[0],
        y = _miss[1];
      // Set the probability of every miss to 0 to prevent that cell from being targeted
      probs[x][y] = -1;
    });

    /* Reduce the chance of groups of cells that are surrounded by misses or the edge of the board 
      if the group length is not less than or equal to the greatest remaining ship length. */
    checkDeadCells(smallestShipLength);

    // Optionally log the results
    // logProbs(probs);
  };

  // #endregion

  // #region Method and helper for logging probs
  // Helper to transpose array for console.table's annoying col first approach
  var transposeArray = function transposeArray(array) {
    return array[0].map(function (_, colIndex) {
      return array.map(function (row) {
        return row[colIndex];
      });
    });
  };
  // eslint-disable-next-line no-unused-vars
  var logProbs = function logProbs(probsToLog) {
    // Log the probs
    var transposedProbs = transposeArray(probsToLog);
    // eslint-disable-next-line no-console
    console.table(transposedProbs);
    // Log the toal of all probs
    // eslint-disable-next-line no-console
    console.log(probsToLog.reduce(function (sum, row) {
      return sum + row.reduce(function (rowSum, value) {
        return rowSum + value;
      }, 0);
    }, 0));
  };

  // #endregion

  return {
    updateProbs: updateProbs,
    resetHitAdjacentIncreases: resetHitAdjacentIncreases,
    destroyModeCoords: destroyModeCoords,
    probs: probs
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiBrain);

/***/ }),

/***/ "./src/helpers/aiAttack/createProbs.js":
/*!*********************************************!*\
  !*** ./src/helpers/aiAttack/createProbs.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* This module is used to create the initial probability array for aiBrain.
  It does this by first initializing the probabilites with a bias towards central
  cells, and then further adjusts these initial weights to create a "chess board" 
  pattern of cells that have much higher and much lower priorities, at random. So for
  example, in one game "white" cells might be heavily weighted compared to "black" cells.
  
  The reasoning for doing both of these things is explained here: 
  https://blogs.glowscotland.org.uk/glowblogs/njoldfieldeportfolio1/2015/12/01/mathematics-behind-battleship/ 
  
  In a nutshell, checkerboard because all boats are at least 2 spaces long, so you can ignore every
  other space while seeking a new ship. Central bias due to the nature of how ships take up
  space on the board. Corners will always be the least likely to have a ship, central the highest. */

// Helper method for normalizing the probabilities
var normalizeProbs = function normalizeProbs(probs) {
  var sum = 0;

  // Calculate the sum of probabilities in the probs
  for (var row = 0; row < probs.length; row += 1) {
    for (var col = 0; col < probs[row].length; col += 1) {
      sum += probs[row][col];
    }
  }

  // Normalize the probabilities
  var normalizedProbs = [];
  for (var _row = 0; _row < probs.length; _row += 1) {
    normalizedProbs[_row] = [];
    for (var _col = 0; _col < probs[_row].length; _col += 1) {
      normalizedProbs[_row][_col] = probs[_row][_col] / sum;
    }
  }
  return normalizedProbs;
};

// Method that creates probs and defines initial probabilities
var createProbs = function createProbs(colorMod) {
  // Create the probs. It is a 10x10 grid of cells.
  var initialProbs = [];

  // Randomly decide which "color" on the probs to favor by randomly initializing color weight
  var initialColorWeight = Math.random() < 0.5 ? 1 : colorMod;

  // Initialize the probs with 0's
  for (var i = 0; i < 10; i += 1) {
    initialProbs.push(Array(10).fill(0));
  }

  // Assign initial probabilities based on Alemi's theory (0.08 in corners, 0.2 in 4 center cells)
  for (var row = 0; row < 10; row += 1) {
    // On even rows start with alternate color weight
    var colorWeight = initialColorWeight;
    if (row % 2 === 0) {
      colorWeight = initialColorWeight === 1 ? colorMod : 1;
    }
    for (var col = 0; col < 10; col += 1) {
      // Calculate the distance from the center
      var centerX = 4.5;
      var centerY = 4.5;
      var distanceFromCenter = Math.sqrt(Math.pow(row - centerX, 2) + Math.pow(col - centerY, 2));

      // Calculate the probability based on Euclidean distance from center
      var minProbability = 0.08;
      var maxProbability = 0.2;
      var probability = minProbability + (maxProbability - minProbability) * (1 - distanceFromCenter / Math.sqrt(Math.pow(4.5, 2) + Math.pow(4.5, 2)));

      // Adjust the weights based on Barry's theory (if probs is checker probs, prefer one color)
      var barryProbability = probability * colorWeight;

      // Assign probabilty to the probs
      initialProbs[row][col] = barryProbability;

      // Flip the color weight
      colorWeight = colorWeight === 1 ? colorMod : 1;
    }
  }

  // Create a normalized probs
  var normalizedProbs = normalizeProbs(initialProbs);

  // Return the normalized probs
  return normalizedProbs;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createProbs);

/***/ }),

/***/ "./src/helpers/canvasAdder.js":
/*!************************************!*\
  !*** ./src/helpers/canvasAdder.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _factories_GridCanvas_GridCanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factories/GridCanvas/GridCanvas */ "./src/factories/GridCanvas/GridCanvas.js");
/* This helper module is responsible for creating the gridCanvas compound elements and 
replacing the placeholders for them in the html with the new elements */



/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. */
var canvasAdder = function canvasAdder(userGameboard, aiGameboard, webInterface, gm) {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  var placementPH = document.querySelector(".placement-canvas-ph");
  var userPH = document.querySelector(".user-canvas-ph");
  var aiPH = document.querySelector(".ai-canvas-ph");

  // Create the canvases

  var userCanvas = (0,_factories_GridCanvas_GridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(gm, 300, 300, {
    type: "user"
  }, userGameboard, webInterface);
  var aiCanvas = (0,_factories_GridCanvas_GridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(gm, 300, 300, {
    type: "ai"
  }, aiGameboard, webInterface);
  var placementCanvas = (0,_factories_GridCanvas_GridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(gm, 300, 300, {
    type: "placement"
  }, userGameboard, webInterface, userCanvas);

  // Replace the place holders
  placementPH.parentNode.replaceChild(placementCanvas, placementPH);
  userPH.parentNode.replaceChild(userCanvas, userPH);
  aiPH.parentNode.replaceChild(aiCanvas, aiPH);

  // Return the canvases
  return {
    placementCanvas: placementCanvas,
    userCanvas: userCanvas,
    aiCanvas: aiCanvas
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (canvasAdder);

/***/ }),

/***/ "./src/helpers/imageLoader.js":
/*!************************************!*\
  !*** ./src/helpers/imageLoader.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* This helper module is used to load images into arrays for use in the
game log. */

var imageLoader = function imageLoader() {
  var imageRefs = {
    SP: {
      hit: [],
      attack: [],
      gen: []
    },
    AT: {
      hit: [],
      attack: [],
      gen: []
    },
    VM: {
      hit: [],
      attack: [],
      gen: []
    },
    IG: {
      hit: [],
      attack: [],
      gen: []
    },
    L: {
      hit: [],
      attack: [],
      gen: []
    }
  };
  var imageContext = __webpack_require__("./src/scene-images sync recursive \\.jpg$/");
  var files = imageContext.keys();
  for (var i = 0; i < files.length; i += 1) {
    var file = files[i];
    var filePath = imageContext(file);
    var fileName = file.toLowerCase();
    var subDir = file.split("/")[1].toUpperCase();
    if (fileName.includes("hit")) {
      imageRefs[subDir].hit.push(filePath);
    } else if (fileName.includes("attack")) {
      imageRefs[subDir].attack.push(filePath);
    } else if (fileName.includes("gen")) {
      imageRefs[subDir].gen.push(filePath);
    }
  }
  return imageRefs;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (imageLoader);

/***/ }),

/***/ "./src/helpers/initializeGame.js":
/*!***************************************!*\
  !*** ./src/helpers/initializeGame.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_gameManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/gameManager */ "./src/modules/gameManager.js");
/* harmony import */ var _factories_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../factories/Player */ "./src/factories/Player.js");
/* harmony import */ var _canvasAdder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvasAdder */ "./src/helpers/canvasAdder.js");
/* harmony import */ var _modules_webInterface__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modules/webInterface */ "./src/modules/webInterface.js");
/* harmony import */ var _placeAiShips__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./placeAiShips */ "./src/helpers/placeAiShips.js");
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../modules/gameLog */ "./src/modules/gameLog.js");
/* harmony import */ var _modules_sounds__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../modules/sounds */ "./src/modules/sounds.js");
/* This module is responsible for initializing the game by creating
  instances of relevant game objects and modules and initializing them
  with proper values. Then it hides the loading screen. */

// Import modules







var initializeGame = function initializeGame() {
  // #region Loading/Init
  // Ref to loading screen
  var loadingScreen = document.querySelector(".loading-screen");

  // Ref to game manager instance
  var gm = (0,_modules_gameManager__WEBPACK_IMPORTED_MODULE_0__["default"])();

  // Initialize the web interface with gm ref
  var webInterface = (0,_modules_webInterface__WEBPACK_IMPORTED_MODULE_3__["default"])(gm);

  // Initialize sound module
  var soundPlayer = (0,_modules_sounds__WEBPACK_IMPORTED_MODULE_6__["default"])();

  // Load scene images for game log
  _modules_gameLog__WEBPACK_IMPORTED_MODULE_5__["default"].loadScenes();

  // Initialization of Player objects for user and AI
  var userPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_1__["default"])(gm); // Create players
  var aiPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_1__["default"])(gm);
  userPlayer.gameboard.rivalBoard = aiPlayer.gameboard; // Set rival boards
  aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
  userPlayer.gameboard.isAi = false; // Set ai or not
  aiPlayer.gameboard.isAi = true;

  // Set gameLog user game board for accurate scenes
  _modules_gameLog__WEBPACK_IMPORTED_MODULE_5__["default"].setUserGameboard(userPlayer.gameboard);
  // Init game log scene img
  _modules_gameLog__WEBPACK_IMPORTED_MODULE_5__["default"].initScene();

  // Add the canvas objects now that gameboards are created
  var canvases = (0,_canvasAdder__WEBPACK_IMPORTED_MODULE_2__["default"])(userPlayer.gameboard, aiPlayer.gameboard, webInterface, gm);
  // Add canvases to gameboards
  userPlayer.gameboard.canvas = canvases.userCanvas;
  aiPlayer.gameboard.canvas = canvases.aiCanvas;

  // Add boards and canvases to gameManager
  gm.userBoard = userPlayer.gameboard;
  gm.aiBoard = aiPlayer.gameboard;
  gm.userCanvasContainer = canvases.userCanvas;
  gm.aiCanvasContainer = canvases.aiCanvas;
  gm.placementCanvasContainer = canvases.placementCanvas;

  // Add modules to gameManager
  gm.webInterface = webInterface;
  gm.soundPlayer = soundPlayer;
  gm.gameLog = _modules_gameLog__WEBPACK_IMPORTED_MODULE_5__["default"];
  // #endregion

  // Add ai ships
  (0,_placeAiShips__WEBPACK_IMPORTED_MODULE_4__["default"])(1, aiPlayer.gameboard);

  // Hide the loading screen after min timeout
  setTimeout(function () {
    loadingScreen.classList.add("hidden");
  }, 1000);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initializeGame);

/***/ }),

/***/ "./src/helpers/placeAiShips.js":
/*!*************************************!*\
  !*** ./src/helpers/placeAiShips.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _randomShips__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./randomShips */ "./src/helpers/randomShips.js");
/* This helper module will place the ai ships on the ai gameboard. They are currently
  always placed randomly, but the framework exists for creating different placement
  methods based on the gameManager's aiDifficulty setting. */



// This helper will attempt to add ships to the ai gameboard in a variety of ways for varying difficulty
var placeAiShips = function placeAiShips(passedDiff, aiGameboard) {
  // Grid size
  var gridHeight = 10;
  var gridWidth = 10;

  // Place a ship along edges until one successfully placed ?
  // Place a ship based on quadrant ?

  // Combine placement tactics to create varying difficulties
  var placeShips = function placeShips(difficulty) {
    // Totally random palcement
    if (difficulty === 1) {
      // Place ships randomly
      (0,_randomShips__WEBPACK_IMPORTED_MODULE_0__["default"])(aiGameboard, gridWidth, gridHeight);
    }
  };
  placeShips(passedDiff);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (placeAiShips);

/***/ }),

/***/ "./src/helpers/randomShips.js":
/*!************************************!*\
  !*** ./src/helpers/randomShips.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* This helper places ships randomly on a gameboard until all 
5 ships have been placed. It uses recursion to do this, ensuring
the method is tried over and over until a sufficient board configuration
is returned. */

var randomShips = function randomShips(gameboard, gridX, gridY) {
  // Exit from recursion
  if (gameboard.ships.length > 4) return;
  // Get random placement
  var x = Math.floor(Math.random() * gridX);
  var y = Math.floor(Math.random() * gridY);
  var direction = Math.round(Math.random());

  // Try the placement
  gameboard.addShip([x, y], direction);

  // Keep doing it until all ships are placed
  randomShips(gameboard, gridX, gridY);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (randomShips);

/***/ }),

/***/ "./src/modules/gameLog.js":
/*!********************************!*\
  !*** ./src/modules/gameLog.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_imageLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/imageLoader */ "./src/helpers/imageLoader.js");
/* This module handles updating the game log ui elements to display relevant
  information such as attacks made, ships sunk, and pictures of various units
  in various states.
  
  It returns three primarily used methods, being erase, append, and setScene.
  The first two are self obvious. setScene will check through the current log text,
  looking for keywords, and then choose an image to display in the log based on
  found keywords. */


var gameLog = function () {
  var userName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "User";
  // Flag for turning off scene updates
  var doUpdateScene = true;
  // Flag for locking the log
  var doLock = false;

  // Add a property to store the gameboard
  var userGameboard = null;

  // Setter method to set the gameboard
  var setUserGameboard = function setUserGameboard(gameboard) {
    userGameboard = gameboard;
  };

  // Ref to log text
  var logText = document.querySelector(".log-text");
  var logImg = document.querySelector(".scene-img");

  // Log scene handling
  var sceneImages = null;
  // Method for loading scene images. Must be run once in game manager.
  var loadScenes = function loadScenes() {
    sceneImages = (0,_helpers_imageLoader__WEBPACK_IMPORTED_MODULE_0__["default"])();
  };

  // Gets a random array entry
  function randomEntry(array) {
    var lastIndex = array.length - 1;
    var randomNumber = Math.floor(Math.random() * (lastIndex + 1));
    return randomNumber;
  }

  // Gets a random user ship that isn't destroyed
  var dirNames = {
    1: "SP",
    2: "AT",
    3: "VM",
    4: "IG",
    5: "L"
  };
  function randomShipDir() {
    var gameboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : userGameboard;
    var remainingShips = [];
    for (var i = 0; i < gameboard.ships.length; i += 1) {
      if (!gameboard.ships[i].isSunk()) remainingShips.push(gameboard.ships[i].index);
    }

    // Handle the case when all ships are sunk
    if (remainingShips.length === 0) {
      var _randomNumber = Math.floor(Math.random() * 5);
      return dirNames[_randomNumber + 1]; // dirNames start at index 1
    }

    // Otherwise return random remaining ship
    var randomNumber = Math.floor(Math.random() * remainingShips.length);
    return dirNames[remainingShips[randomNumber]];
  }

  // Initializes scene image to gen image
  var initScene = function initScene() {
    // get random ship dir
    var shipDir = dirNames[Math.floor(Math.random() * 5) + 1];
    // get random array entry
    var entry = randomEntry(sceneImages[shipDir].gen);
    // set the image
    logImg.src = sceneImages[shipDir].gen[entry];
  };

  // Sets the scene image based on params passed
  var setScene = function setScene() {
    // Return if log flag set to not update
    if (!doUpdateScene) return;
    // Set the text to lowercase for comparison
    var logLower = logText.textContent.toLowerCase();

    // Refs to ship types and their dirs
    var shipTypes = ["sentinel", "assault", "viper", "iron", "leviathan"];
    var typeToDir = {
      sentinel: "SP",
      assault: "AT",
      viper: "VM",
      iron: "IG",
      leviathan: "L"
    };

    // Helper for getting random ship type from those remaining

    // Set the image when you attack based on remaining ships
    if (logLower.includes(userName.toLowerCase()) && logLower.includes("attacks")) {
      // Get random ship
      var shipDir = randomShipDir();
      // Get random img from appropriate place
      var entry = randomEntry(sceneImages[shipDir].attack);
      // Set the image
      logImg.src = sceneImages[shipDir].attack[entry];
    }

    // Set the image when ship hit
    if (logLower.includes("hit your")) {
      shipTypes.forEach(function (type) {
        if (logLower.includes(type)) {
          // Set the ship directory based on type
          var _shipDir = typeToDir[type];
          // Get a random hit entry
          var _entry = randomEntry(sceneImages[_shipDir].hit);
          // Set the image
          logImg.src = sceneImages[_shipDir].hit[_entry];
        }
      });
    }

    // Set the image when there is an ai miss to gen of remaining ships
    if (logLower.includes("ai attacks") && logLower.includes("missed")) {
      // Get random remaining ship dir
      var _shipDir2 = randomShipDir();
      // Get random entry from there
      var _entry2 = randomEntry(sceneImages[_shipDir2].gen);
      // Set the image
      logImg.src = sceneImages[_shipDir2].gen[_entry2];
    }
  };

  // Erase the log text
  var erase = function erase() {
    if (doLock) return;
    logText.textContent = "";
  };

  // Add to log text
  var append = function append(stringToAppend) {
    if (doLock) return;
    if (stringToAppend) {
      logText.innerHTML += "\n".concat(stringToAppend.toString());
    }
  };
  return {
    erase: erase,
    append: append,
    setScene: setScene,
    loadScenes: loadScenes,
    setUserGameboard: setUserGameboard,
    initScene: initScene,
    get doUpdateScene() {
      return doUpdateScene;
    },
    set doUpdateScene(bool) {
      if (bool === true || bool === false) {
        doUpdateScene = bool;
      }
    },
    get doLock() {
      return doLock;
    },
    set doLock(bool) {
      if (bool === true || bool === false) {
        doLock = bool;
      }
    }
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameLog);

/***/ }),

/***/ "./src/modules/gameManager.js":
/*!************************************!*\
  !*** ./src/modules/gameManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_randomShips__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/randomShips */ "./src/helpers/randomShips.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/* This module acts as the central communications hub for all the different modules.
  It has methods for responding to various game events, as well as refs to game settings,
  game objects, and the other main modules.
  
  If something needs to happen that involves various un-related parts of the codebase 
  working together then it will be handled by this module. */


var gameManager = function gameManager() {
  // Game settings
  var aiDifficulty = 2;
  var userAttackDelay = 1000;
  var aiAttackDelay = 2200;
  var aiAutoDelay = 250;

  // Refs to relevant game objects
  var userBoard = null;
  var aiBoard = null;
  var userCanvasContainer = null;
  var aiCanvasContainer = null;
  var placementCanvasContainer = null;

  // Refs to modules
  var soundPlayer = null;
  var webInterface = null;
  var gameLog = null;

  // #region Handle AI Attacks
  // AI Attack Hit
  var aiAttackHit = function aiAttackHit(attackCoords) {
    // Play hit sound
    soundPlayer.playHit();
    // Draw the hit to board
    userCanvasContainer.drawHit(attackCoords);
    // Log the hit
    gameLog.erase();
    gameLog.append("AI attacks cell: ".concat(attackCoords, " \nAttack hit your ").concat(userBoard.hitShipType, "!"));
    gameLog.setScene();
    // Set ai to destroy mode
    aiBoard.isAiSeeking = false;
    // Add hit to cells to check
    aiBoard.cellsToCheck.push(attackCoords);
    // Log sunk user ships
    var sunkMsg = userBoard.logSunk();
    if (sunkMsg !== null) {
      gameLog.append(sunkMsg);
      // Update log scene
      gameLog.setScene();
    }
    // Check if AI won
    if (userBoard.allSunk()) {
      // '        '
      // Log results
      gameLog.append("All User units destroyed. \nAI dominance is assured.");
      // Set game over on boards
      aiBoard.gameOver = true; // AI board
      userBoard.gameOver = true; // User board
    }
  };

  // AI Attack Missed
  var aiAttackMissed = function aiAttackMissed(attackCoords) {
    // Play sound
    soundPlayer.playMiss();
    // Draw the miss to board
    userCanvasContainer.drawMiss(attackCoords);
    // Log the miss
    gameLog.erase();
    gameLog.append("AI attacks cell: ".concat(attackCoords, "\nAttack missed!"));
    gameLog.setScene();
  };

  // AI is attacking
  var aiAttackCount = 0;
  var aiAttacking = function aiAttacking(attackCoords) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : aiAttackDelay;
    // Timeout to simulate "thinking" and to make game feel better
    setTimeout(function () {
      // Send attack to rival board
      userBoard.receiveAttack(attackCoords)
      // Then draw hits or misses
      .then(function (result) {
        if (result === true) {
          aiAttackHit(attackCoords);
        } else if (result === false) {
          aiAttackMissed(attackCoords);
        }

        // Break out of recursion if game is over
        if (userBoard.gameOver === true) {
          // Log total hits if ai auto attacking
          if (aiBoard.isAutoAttacking) {
            gameLog.append("Total AI attacks: ".concat(aiAttackCount));
          }
          gameLog.doLock = true;
          return;
        }

        // If ai board is autoattacking have it try an attack
        if (aiBoard.isAutoAttacking === true) {
          aiAttackCount += 1;
          aiBoard.tryAiAttack(aiAutoDelay);
        }
        // Otherwise allow the user to attack again
        else {
          userBoard.canAttack = true;
        }
      });
    }, delay);
  };

  // #endregion

  // #region Handle Player Attacks
  var playerAttacking = function playerAttacking(attackCoords) {
    // Return if gameboard can't attack
    if (aiBoard.rivalBoard.canAttack === false) return;
    // Try attack at current cell
    if (aiBoard.alreadyAttacked(attackCoords)) {
      // Bad thing. Error sound maybe.
    } else if (userBoard.gameOver === false) {
      // Set gameboard to not be able to attack
      userBoard.canAttack = false;
      // Log the sent attack
      gameLog.erase();
      gameLog.append("User attacks cell: ".concat(attackCoords));
      gameLog.setScene();
      // Play the sound
      soundPlayer.playAttack();
      // Send the attack
      aiBoard.receiveAttack(attackCoords).then(function (result) {
        // Set a timeout for dramatic effect
        setTimeout(function () {
          // Attack hit
          if (result === true) {
            // Play sound
            soundPlayer.playHit();
            // Draw hit to board
            aiCanvasContainer.drawHit(attackCoords);
            // Log hit
            gameLog.append("Attack hit!");
            // Log sunken ships
            var sunkMsg = aiBoard.logSunk();
            if (sunkMsg !== null) {
              gameLog.append(sunkMsg);
              // Update log scene
              gameLog.setScene();
            }

            // Check if player won
            if (aiBoard.allSunk()) {
              // Log results
              gameLog.append("All AI units destroyed. \nHumanity survives another day...");
              // Set gameover on boards
              aiBoard.gameOver = true;
              userBoard.gameOver = true;
            } else {
              // Log the ai "thinking" about its attack
              gameLog.append("AI detrmining attack...");
              // Have the ai attack if not gameOver
              aiBoard.tryAiAttack();
            }
          } else if (result === false) {
            // Play sound
            soundPlayer.playMiss();
            // Draw miss to board
            aiCanvasContainer.drawMiss(attackCoords);
            // Log miss
            gameLog.append("Attack missed!");
            // Log the ai "thinking" about its attack
            gameLog.append("AI detrmining attack...");
            // Have the ai attack if not gameOver
            aiBoard.tryAiAttack();
          }
        }, userAttackDelay);
      });
    }
  };

  // #endregion

  // Handle setting up an AI vs AI match
  var aiMatchClicked = function aiMatchClicked() {
    // Toggle ai auto attack
    aiBoard.isAutoAttacking = !aiBoard.isAutoAttacking;
    // Toggle log to not update scene
    gameLog.doUpdateScene = !gameLog.doUpdateScene;
    // Set the sounds to muted
    soundPlayer.isMuted = !soundPlayer.isMuted;
  };

  // #region Handle Ship Placement and Game Start
  // Check if game should start after placement
  var tryStartGame = function tryStartGame() {
    if (userBoard.ships.length === 5) {
      webInterface.showGame();
    }
  };

  // Handle random ships button click
  var randomShipsClicked = function randomShipsClicked() {
    (0,_helpers_randomShips__WEBPACK_IMPORTED_MODULE_0__["default"])(userBoard, userBoard.maxBoardX, userBoard.maxBoardY);
    userCanvasContainer.drawShips();
    tryStartGame();
  };

  // Handle rotate button clicks
  var rotateClicked = function rotateClicked() {
    userBoard.direction = userBoard.direction === 0 ? 1 : 0;
    aiBoard.direction = aiBoard.direction === 0 ? 1 : 0;
  };
  var placementClicked = function placementClicked(cell) {
    // Try placement
    userBoard.addShip(cell);
    placementCanvasContainer.drawShips();
    userCanvasContainer.drawShips();
    tryStartGame();
  };
  // #endregion

  // When a user ship is sunk
  var userShipSunk = function userShipSunk(ship) {
    // Remove the sunken ship cells from cells to check
    ship.occupiedCells.forEach(function (cell) {
      // Occupied cell x and y
      var _cell = _slicedToArray(cell, 2),
        ox = _cell[0],
        oy = _cell[1];
      // Remove it from cells to check if it exists
      for (var i = 0; i < aiBoard.cellsToCheck.length; i += 1) {
        // Cell to check x and y
        var _aiBoard$cellsToCheck = _slicedToArray(aiBoard.cellsToCheck[i], 2),
          cx = _aiBoard$cellsToCheck[0],
          cy = _aiBoard$cellsToCheck[1];
        // Remove if match found
        if (ox === cx && oy === cy) {
          aiBoard.cellsToCheck.splice(i, 1);
        }
      }
    });

    // If cells to check is empty then stop destory mode
    if (aiBoard.cellsToCheck.length === 0) {
      aiBoard.isAiSeeking = true;
    }
  };
  return {
    aiAttacking: aiAttacking,
    playerAttacking: playerAttacking,
    aiMatchClicked: aiMatchClicked,
    placementClicked: placementClicked,
    randomShipsClicked: randomShipsClicked,
    rotateClicked: rotateClicked,
    userShipSunk: userShipSunk,
    get aiDifficulty() {
      return aiDifficulty;
    },
    set aiDifficulty(diff) {
      if (diff === 1 || diff === 2 || diff === 3) aiDifficulty = diff;
    },
    get userBoard() {
      return userBoard;
    },
    set userBoard(board) {
      userBoard = board;
    },
    get aiBoard() {
      return aiBoard;
    },
    set aiBoard(board) {
      aiBoard = board;
    },
    get userCanvasContainer() {
      return userCanvasContainer;
    },
    set userCanvasContainer(canvas) {
      userCanvasContainer = canvas;
    },
    get aiCanvasContainer() {
      return aiCanvasContainer;
    },
    set aiCanvasContainer(canvas) {
      aiCanvasContainer = canvas;
    },
    get placementCanvascontainer() {
      return placementCanvasContainer;
    },
    set placementCanvasContainer(canvas) {
      placementCanvasContainer = canvas;
    },
    get soundPlayer() {
      return soundPlayer;
    },
    set soundPlayer(aModule) {
      soundPlayer = aModule;
    },
    get webInterface() {
      return webInterface;
    },
    set webInterface(aModule) {
      webInterface = aModule;
    },
    get gameLog() {
      return gameLog;
    },
    set gameLog(aModule) {
      gameLog = aModule;
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameManager);

/***/ }),

/***/ "./src/modules/sounds.js":
/*!*******************************!*\
  !*** ./src/modules/sounds.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Sound_Effects_explosion_mp3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Sound Effects/explosion.mp3 */ "./src/Sound Effects/explosion.mp3");
/* harmony import */ var _Sound_Effects_miss_mp3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Sound Effects/miss.mp3 */ "./src/Sound Effects/miss.mp3");
/* harmony import */ var _Sound_Effects_laser_mp3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Sound Effects/laser.mp3 */ "./src/Sound Effects/laser.mp3");
/* This module is used to play the games sound effects. As there are
not many sounds in total, each sound gets its own method for playing. */




var attackAudio = new Audio(_Sound_Effects_laser_mp3__WEBPACK_IMPORTED_MODULE_2__);
var hitAudio = new Audio(_Sound_Effects_explosion_mp3__WEBPACK_IMPORTED_MODULE_0__);
var missAudio = new Audio(_Sound_Effects_miss_mp3__WEBPACK_IMPORTED_MODULE_1__);
var sounds = function sounds() {
  // Flag for muting
  var isMuted = false;
  var playHit = function playHit() {
    if (isMuted) return;
    // Reset audio to beginning and play it
    hitAudio.currentTime = 0;
    hitAudio.play();
  };
  var playMiss = function playMiss() {
    if (isMuted) return;
    // Reset audio to beginning and play it
    missAudio.currentTime = 0;
    missAudio.play();
  };
  var playAttack = function playAttack() {
    if (isMuted) return;
    // Reset audio to beginning and play it
    attackAudio.currentTime = 0;
    attackAudio.play();
  };
  return {
    playHit: playHit,
    playMiss: playMiss,
    playAttack: playAttack,
    get isMuted() {
      return isMuted;
    },
    set isMuted(bool) {
      if (bool === true || bool === false) isMuted = bool;
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sounds);

/***/ }),

/***/ "./src/modules/webInterface.js":
/*!*************************************!*\
  !*** ./src/modules/webInterface.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable no-param-reassign */
/* This module is responsible for setting up event handlers for the
  main UI buttons, and has methods used by those handlers that change
  the state of the UI by changing various element classes.
  
  This allows for methods that transition from one part of the game to the next. */
var webInterface = function webInterface(gm) {
  // References to main elements
  var title = document.querySelector(".title");
  var menu = document.querySelector(".menu");
  var placement = document.querySelector(".placement");
  var game = document.querySelector(".game");
  var reset = document.querySelector(".reset");

  // Reference to btn elements
  var startBtn = document.querySelector(".start-btn");
  var aiMatchBtn = document.querySelector(".ai-match-btn");
  var randomShipsBtn = document.querySelector(".random-ships-btn");
  var rotateBtn = document.querySelector(".rotate-btn");
  var resetBtn = document.querySelector(".reset-btn");

  // Method for iterating through directions
  var rotateDirection = function rotateDirection() {
    gm.rotateClicked();
  };

  // #region Basic methods for showing/hiding elements
  // Move any active sections off the screen
  var hideAll = function hideAll() {
    menu.classList.add("hidden");
    placement.classList.add("hidden");
    game.classList.add("hidden");
    reset.classList.add("hidden");
  };

  // Show the menu UI
  var showMenu = function showMenu() {
    hideAll();
    menu.classList.remove("hidden");
  };

  // Show the ship placement UI
  var showPlacement = function showPlacement() {
    hideAll();
    placement.classList.remove("hidden");
  };

  // Show the game UI
  var showGame = function showGame() {
    hideAll();
    game.classList.remove("hidden");
    reset.classList.remove("hidden");
  };

  // Shrink the title
  var shrinkTitle = function shrinkTitle() {
    title.classList.add("shrink");
  };

  // #endregion

  // #region High level responses to clicks
  // Hande clicks on the start game button
  var handleStartClick = function handleStartClick() {
    shrinkTitle();
    showPlacement();
  };
  var handleAiMatchClick = function handleAiMatchClick() {
    // Set style class based on if userBoard is ai (if false, set active b/c will be true after click)
    if (gm.aiBoard.isAutoAttacking === false) aiMatchBtn.classList.add("active");else aiMatchBtn.classList.remove("active");
    gm.aiMatchClicked();
  };

  // Handle clicks on the rotate button in the placement section
  var handleRotateClick = function handleRotateClick() {
    rotateDirection();
  };

  // Handle random ships button click
  var handleRandomShipsClick = function handleRandomShipsClick() {
    gm.randomShipsClicked();
  };

  // Handle reset button click
  var handleResetClick = function handleResetClick() {
    window.location.reload();
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  aiMatchBtn.addEventListener("click", handleAiMatchClick);
  randomShipsBtn.addEventListener("click", handleRandomShipsClick);
  resetBtn.addEventListener("click", handleResetClick);
  return {
    showGame: showGame,
    showMenu: showMenu,
    showPlacement: showPlacement
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (webInterface);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style/reset.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style/reset.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
`, "",{"version":3,"sources":["webpack://./src/style/reset.css"],"names":[],"mappings":"AAAA;;;CAGC;;AAED;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;EAiFE,SAAS;EACT,UAAU;EACV,SAAS;EACT,eAAe;EACf,aAAa;EACb,wBAAwB;AAC1B;AACA,gDAAgD;AAChD;;;;;;;;;;;EAWE,cAAc;AAChB;AACA;EACE,cAAc;AAChB;AACA;;EAEE,gBAAgB;AAClB;AACA;;EAEE,YAAY;AACd;AACA;;;;EAIE,WAAW;EACX,aAAa;AACf;AACA;EACE,yBAAyB;EACzB,iBAAiB;AACnB","sourcesContent":["/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol,\nul {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \"\";\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style/style.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style/style.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Color Rules */
:root {
  --colorA1: #722b94;
  --colorA2: #a936e0;
  --colorC: #37e02b;
  --colorB1: #941d0d;
  --colorB2: #e0361f;

  --bg-color: hsl(0, 0%, 22%);
  --bg-color2: hsl(0, 0%, 32%);
  --text-color: hsl(0, 0%, 91%);
  --link-color: hsl(36, 92%, 59%);
}

/* #region Universal element rules */
a {
  color: var(--link-color);
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  font-family: Arial, Helvetica, sans-serif;
}

.canvas-container {
  display: grid;
  grid-template: 1fr / 1fr;
  width: fit-content;
  height: fit-content;
}

.canvas-container > * {
  grid-row: -1 / 1;
  grid-column: -1 / 1;
}

/* #endregion */

/* #region loading-screen */
.loading-screen {
  transition: transform 0.3s ease-in-out;
}

.loading-screen.hidden {
  transform: translateY(150%);
}

/* #endregion */

/* #region main-content */
.main-content {
  display: grid;
  grid-template: repeat(20, 5%) / repeat(20, 5%);
  position: relative;

  height: 100%;
  width: 100%;
}

/* title grid */
.title {
  grid-column: 3 / 19;
  grid-row: 2 / 6;
  display: grid;
  place-items: center;

  transition: transform 0.8s ease-in-out;

  background-color: var(--bg-color2);
  border-radius: 20px;
}

.title-text {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 4.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 2px var(--colorB1);
  color: var(--colorB2);

  transition: font-size 0.8s ease-in-out;
}

.title.shrink {
  transform: scale(0.5) translateY(-50%);
}

.title.shrink .title-text {
  font-size: 3.5rem;
}
/* #region menu section */
.menu {
  grid-column: 3 / 19;
  grid-row: 8 / 18;

  display: grid;
  grid-template: 5% min-content 5% 1fr 5% 1fr 5% 1fr / 1fr;
  place-items: center;
  grid-template-areas:
    "."
    "credits"
    "."
    "start-game"
    "."
    "ai-match"
    "."
    "options";

  transition: transform 0.3s ease-in-out;

  background-color: var(--colorA1);
  border-radius: 20px;
}

.menu.hidden {
  transform: translateX(-150%);
}

.menu .credits {
  grid-area: credits;
}

.menu .start {
  grid-area: start-game;
  align-self: end;
}

.menu .ai-match {
  grid-area: ai-match;
}

.menu .options {
  grid-area: options;
  align-self: start;
}

.menu .start-btn,
.menu .options-btn,
.menu .ai-match-btn {
  height: 60px;
  width: 180px;

  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-color);
  transition: text-shadow 0.1s ease-in-out;

  background-color: var(--colorA2);
  border: 2px solid var(--colorC);
  border-radius: 10px;
}

.menu .start-btn:hover,
.menu .options-btn:hover,
.menu .ai-match-btn:hover {
  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);
}

.menu .ai-match-btn.active {
  background-color: var(--colorB1);
}

/* #endregion */

/* #region placement section */
.placement {
  grid-column: 3 / 19;
  grid-row: 6 / 20;

  display: grid;
  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr 5% 1fr;
  place-items: center;
  grid-template-areas:
    ". . ."
    "instructions instructions instructions"
    ". . ."
    "ships ships ships"
    ". . . "
    "random . rotate"
    ". . ."
    "canvas canvas canvas";

  transition: transform 0.3s ease-in-out;

  background-color: var(--colorA1);
  border-radius: 20px;
}

.placement .instructions {
  grid-area: instructions;
}

.placement .instructions-text {
  font-size: 2.3rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px var(--bg-color);
}

.placement .ships-to-place {
  grid-area: ships;
  display: grid;
  grid-auto-flow: column;
}

.placement .random-ships {
  grid-area: random;
  justify-self: end;
}

.placement .rotate {
  grid-area: rotate;
  justify-self: start;
}

.placement .rotate-btn,
.placement .random-ships-btn {
  height: 60px;
  width: 180px;

  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-color);
  transition: text-shadow 0.1s ease-in-out;

  background-color: var(--colorA2);
  border: 2px solid var(--colorC);
  border-radius: 10px;
}

.placement .rotate-btn:hover,
.placement .random-ships-btn:hover {
  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);
}

.placement .rotate-btn:active,
.placement .random-ships-btn:active {
  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);
}

.placement .placement-canvas-container {
  grid-area: canvas;
  align-self: start;
}

.placement.hidden {
  transform: translateY(150%);
}

.placement .canvas-container {
  background-color: var(--colorC);
}
/* #endregion */

/* #region game section */
.game {
  grid-column: 2 / 20;
  grid-row: 5 / 20;
  display: grid;
  place-items: center;
  grid-template:
    repeat(2, minmax(10px, 1fr) min-content) minmax(10px, 1fr)
    min-content 1fr / repeat(4, 1fr);
  grid-template-areas:
    ". . . ."
    ". log log ."
    ". . . ."
    "user-board user-board ai-board ai-board"
    ". . . ."
    "user-info user-info ai-info ai-info"
    ". . . .";

  transition: transform 0.3s ease-in-out;

  background-color: var(--colorA1);
  border-radius: 20px;
}

.game .canvas-container {
  background-color: var(--colorA2);
}

.game .user-canvas-container {
  grid-area: user-board;
}

.game .ai-canvas-container {
  grid-area: ai-board;
}

.game .user-info {
  grid-area: user-info;
}

.game .ai-info {
  grid-area: ai-info;
}

.game .player-ships {
  display: grid;
  grid-auto-flow: column;
}

.game .log {
  grid-area: log;
  display: grid;
  grid-template: 1fr / min-content 10px 1fr;
  grid-template-areas: "scene . text";

  width: 500px;

  border: 3px solid var(--colorB1);
  border-radius: 6px;

  background-color: var(--bg-color);
}

.game .log .scene {
  grid-area: scene;

  height: 150px;
  width: 150px;
  background-color: var(--colorB1);
}

.game .log .scene-img {
  height: 100%;
  width: 100%;
}

.game .log .log-text {
  grid-area: text;
  font-size: 1.15rem;
  white-space: pre; /* Allows for \\n */
}

.game.hidden {
  transform: translateX(150%);
}
/* #endregion */

/* #region Reset */
.reset {
  grid-column: 17 / 20;
  grid-row: 2 / 4;

  display: grid;

  place-items: center;

  transition: transform 0.3s ease-in-out;
}

.reset .reset-btn {
  height: 100%;
  width: 100%;

  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-color);
  transition: text-shadow 0.1s ease-in-out;

  background-color: var(--colorA2);
  border: 2px solid var(--colorC);
  border-radius: 10px;
}

.reset .reset-btn:hover {
  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);
}

.reset .reset-btn:active {
  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);
}

.reset.hidden {
  transform: translateX(150%);
}

/* #endregion */

/* #endregion */
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"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","sourcesContent":["/* Color Rules */\n:root {\n  --colorA1: #722b94;\n  --colorA2: #a936e0;\n  --colorC: #37e02b;\n  --colorB1: #941d0d;\n  --colorB2: #e0361f;\n\n  --bg-color: hsl(0, 0%, 22%);\n  --bg-color2: hsl(0, 0%, 32%);\n  --text-color: hsl(0, 0%, 91%);\n  --link-color: hsl(36, 92%, 59%);\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.canvas-container {\n  display: grid;\n  grid-template: 1fr / 1fr;\n  width: fit-content;\n  height: fit-content;\n}\n\n.canvas-container > * {\n  grid-row: -1 / 1;\n  grid-column: -1 / 1;\n}\n\n/* #endregion */\n\n/* #region loading-screen */\n.loading-screen {\n  transition: transform 0.3s ease-in-out;\n}\n\n.loading-screen.hidden {\n  transform: translateY(150%);\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n  display: grid;\n  place-items: center;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: var(--bg-color2);\n  border-radius: 20px;\n}\n\n.title-text {\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  font-size: 4.8rem;\n  font-weight: bold;\n  text-shadow: 2px 2px 2px var(--colorB1);\n  color: var(--colorB2);\n\n  transition: font-size 0.8s ease-in-out;\n}\n\n.title.shrink {\n  transform: scale(0.5) translateY(-50%);\n}\n\n.title.shrink .title-text {\n  font-size: 3.5rem;\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  display: grid;\n  grid-template: 5% min-content 5% 1fr 5% 1fr 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"credits\"\n    \".\"\n    \"start-game\"\n    \".\"\n    \"ai-match\"\n    \".\"\n    \"options\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.menu.hidden {\n  transform: translateX(-150%);\n}\n\n.menu .credits {\n  grid-area: credits;\n}\n\n.menu .start {\n  grid-area: start-game;\n  align-self: end;\n}\n\n.menu .ai-match {\n  grid-area: ai-match;\n}\n\n.menu .options {\n  grid-area: options;\n  align-self: start;\n}\n\n.menu .start-btn,\n.menu .options-btn,\n.menu .ai-match-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.menu .start-btn:hover,\n.menu .options-btn:hover,\n.menu .ai-match-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.menu .ai-match-btn.active {\n  background-color: var(--colorB1);\n}\n\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 6 / 20;\n\n  display: grid;\n  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr 5% 1fr;\n  place-items: center;\n  grid-template-areas:\n    \". . .\"\n    \"instructions instructions instructions\"\n    \". . .\"\n    \"ships ships ships\"\n    \". . . \"\n    \"random . rotate\"\n    \". . .\"\n    \"canvas canvas canvas\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.placement .instructions {\n  grid-area: instructions;\n}\n\n.placement .instructions-text {\n  font-size: 2.3rem;\n  font-weight: bold;\n  text-shadow: 1px 1px 1px var(--bg-color);\n}\n\n.placement .ships-to-place {\n  grid-area: ships;\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.placement .random-ships {\n  grid-area: random;\n  justify-self: end;\n}\n\n.placement .rotate {\n  grid-area: rotate;\n  justify-self: start;\n}\n\n.placement .rotate-btn,\n.placement .random-ships-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.placement .rotate-btn:hover,\n.placement .random-ships-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.placement .rotate-btn:active,\n.placement .random-ships-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.placement .placement-canvas-container {\n  grid-area: canvas;\n  align-self: start;\n}\n\n.placement.hidden {\n  transform: translateY(150%);\n}\n\n.placement .canvas-container {\n  background-color: var(--colorC);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 5 / 20;\n  display: grid;\n  place-items: center;\n  grid-template:\n    repeat(2, minmax(10px, 1fr) min-content) minmax(10px, 1fr)\n    min-content 1fr / repeat(4, 1fr);\n  grid-template-areas:\n    \". . . .\"\n    \". log log .\"\n    \". . . .\"\n    \"user-board user-board ai-board ai-board\"\n    \". . . .\"\n    \"user-info user-info ai-info ai-info\"\n    \". . . .\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.game .canvas-container {\n  background-color: var(--colorA2);\n}\n\n.game .user-canvas-container {\n  grid-area: user-board;\n}\n\n.game .ai-canvas-container {\n  grid-area: ai-board;\n}\n\n.game .user-info {\n  grid-area: user-info;\n}\n\n.game .ai-info {\n  grid-area: ai-info;\n}\n\n.game .player-ships {\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.game .log {\n  grid-area: log;\n  display: grid;\n  grid-template: 1fr / min-content 10px 1fr;\n  grid-template-areas: \"scene . text\";\n\n  width: 500px;\n\n  border: 3px solid var(--colorB1);\n  border-radius: 6px;\n\n  background-color: var(--bg-color);\n}\n\n.game .log .scene {\n  grid-area: scene;\n\n  height: 150px;\n  width: 150px;\n  background-color: var(--colorB1);\n}\n\n.game .log .scene-img {\n  height: 100%;\n  width: 100%;\n}\n\n.game .log .log-text {\n  grid-area: text;\n  font-size: 1.15rem;\n  white-space: pre; /* Allows for \\n */\n}\n\n.game.hidden {\n  transform: translateX(150%);\n}\n/* #endregion */\n\n/* #region Reset */\n.reset {\n  grid-column: 17 / 20;\n  grid-row: 2 / 4;\n\n  display: grid;\n\n  place-items: center;\n\n  transition: transform 0.3s ease-in-out;\n}\n\n.reset .reset-btn {\n  height: 100%;\n  width: 100%;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.reset .reset-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.reset .reset-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.reset.hidden {\n  transform: translateX(150%);\n}\n\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style/reset.css":
/*!*****************************!*\
  !*** ./src/style/reset.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./reset.css */ "./node_modules/css-loader/dist/cjs.js!./src/style/reset.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_reset_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style/style.css":
/*!*****************************!*\
  !*** ./src/style/style.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/scene-images sync recursive \\.jpg$/":
/*!****************************************!*\
  !*** ./src/scene-images/ sync \.jpg$/ ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./AT/at_attack1.jpg": "./src/scene-images/AT/at_attack1.jpg",
	"./AT/at_attack2.jpg": "./src/scene-images/AT/at_attack2.jpg",
	"./AT/at_attack3.jpg": "./src/scene-images/AT/at_attack3.jpg",
	"./AT/at_attack4.jpg": "./src/scene-images/AT/at_attack4.jpg",
	"./AT/at_gen1.jpg": "./src/scene-images/AT/at_gen1.jpg",
	"./AT/at_gen2.jpg": "./src/scene-images/AT/at_gen2.jpg",
	"./AT/at_gen3.jpg": "./src/scene-images/AT/at_gen3.jpg",
	"./AT/at_gen4.jpg": "./src/scene-images/AT/at_gen4.jpg",
	"./AT/at_hit1.jpg": "./src/scene-images/AT/at_hit1.jpg",
	"./AT/at_hit2.jpg": "./src/scene-images/AT/at_hit2.jpg",
	"./AT/at_hit3.jpg": "./src/scene-images/AT/at_hit3.jpg",
	"./AT/at_hit4.jpg": "./src/scene-images/AT/at_hit4.jpg",
	"./AT/at_hit5.jpg": "./src/scene-images/AT/at_hit5.jpg",
	"./IG/ig_attack1.jpg": "./src/scene-images/IG/ig_attack1.jpg",
	"./IG/ig_attack2.jpg": "./src/scene-images/IG/ig_attack2.jpg",
	"./IG/ig_attack3.jpg": "./src/scene-images/IG/ig_attack3.jpg",
	"./IG/ig_attack4.jpg": "./src/scene-images/IG/ig_attack4.jpg",
	"./IG/ig_gen1.jpg": "./src/scene-images/IG/ig_gen1.jpg",
	"./IG/ig_gen2.jpg": "./src/scene-images/IG/ig_gen2.jpg",
	"./IG/ig_gen3.jpg": "./src/scene-images/IG/ig_gen3.jpg",
	"./IG/ig_gen4.jpg": "./src/scene-images/IG/ig_gen4.jpg",
	"./IG/ig_gen5.jpg": "./src/scene-images/IG/ig_gen5.jpg",
	"./IG/ig_hit1.jpg": "./src/scene-images/IG/ig_hit1.jpg",
	"./IG/ig_hit2.jpg": "./src/scene-images/IG/ig_hit2.jpg",
	"./IG/ig_hit3.jpg": "./src/scene-images/IG/ig_hit3.jpg",
	"./IG/ig_hit4.jpg": "./src/scene-images/IG/ig_hit4.jpg",
	"./IG/ig_hit5.jpg": "./src/scene-images/IG/ig_hit5.jpg",
	"./IG/ig_hit6.jpg": "./src/scene-images/IG/ig_hit6.jpg",
	"./L/l_attack1.jpg": "./src/scene-images/L/l_attack1.jpg",
	"./L/l_attack2.jpg": "./src/scene-images/L/l_attack2.jpg",
	"./L/l_attack3.jpg": "./src/scene-images/L/l_attack3.jpg",
	"./L/l_attack4.jpg": "./src/scene-images/L/l_attack4.jpg",
	"./L/l_attack5.jpg": "./src/scene-images/L/l_attack5.jpg",
	"./L/l_gen1.jpg": "./src/scene-images/L/l_gen1.jpg",
	"./L/l_gen2.jpg": "./src/scene-images/L/l_gen2.jpg",
	"./L/l_gen3.jpg": "./src/scene-images/L/l_gen3.jpg",
	"./L/l_gen4.jpg": "./src/scene-images/L/l_gen4.jpg",
	"./L/l_hit1.jpg": "./src/scene-images/L/l_hit1.jpg",
	"./L/l_hit2.jpg": "./src/scene-images/L/l_hit2.jpg",
	"./L/l_hit3.jpg": "./src/scene-images/L/l_hit3.jpg",
	"./L/l_hit5.jpg": "./src/scene-images/L/l_hit5.jpg",
	"./L/lgen5.jpg": "./src/scene-images/L/lgen5.jpg",
	"./L/lhit4.jpg": "./src/scene-images/L/lhit4.jpg",
	"./SP/sp_attack1.jpg": "./src/scene-images/SP/sp_attack1.jpg",
	"./SP/sp_attack2.jpg": "./src/scene-images/SP/sp_attack2.jpg",
	"./SP/sp_attack3.jpg": "./src/scene-images/SP/sp_attack3.jpg",
	"./SP/sp_attack4.jpg": "./src/scene-images/SP/sp_attack4.jpg",
	"./SP/sp_gen1.jpg": "./src/scene-images/SP/sp_gen1.jpg",
	"./SP/sp_gen2.jpg": "./src/scene-images/SP/sp_gen2.jpg",
	"./SP/sp_gen3.jpg": "./src/scene-images/SP/sp_gen3.jpg",
	"./SP/sp_gen4.jpg": "./src/scene-images/SP/sp_gen4.jpg",
	"./SP/sp_hit1.jpg": "./src/scene-images/SP/sp_hit1.jpg",
	"./SP/sp_hit2.jpg": "./src/scene-images/SP/sp_hit2.jpg",
	"./SP/sp_hit3.jpg": "./src/scene-images/SP/sp_hit3.jpg",
	"./VM/mv_hit5.jpg": "./src/scene-images/VM/mv_hit5.jpg",
	"./VM/vm_attack1.jpg": "./src/scene-images/VM/vm_attack1.jpg",
	"./VM/vm_attack2.jpg": "./src/scene-images/VM/vm_attack2.jpg",
	"./VM/vm_attack3.jpg": "./src/scene-images/VM/vm_attack3.jpg",
	"./VM/vm_attack4.jpg": "./src/scene-images/VM/vm_attack4.jpg",
	"./VM/vm_attack5.jpg": "./src/scene-images/VM/vm_attack5.jpg",
	"./VM/vm_attack6.jpg": "./src/scene-images/VM/vm_attack6.jpg",
	"./VM/vm_gen1.jpg": "./src/scene-images/VM/vm_gen1.jpg",
	"./VM/vm_gen2.jpg": "./src/scene-images/VM/vm_gen2.jpg",
	"./VM/vm_gen3.jpg": "./src/scene-images/VM/vm_gen3.jpg",
	"./VM/vm_gen4.jpg": "./src/scene-images/VM/vm_gen4.jpg",
	"./VM/vm_gen5.jpg": "./src/scene-images/VM/vm_gen5.jpg",
	"./VM/vm_gen6.jpg": "./src/scene-images/VM/vm_gen6.jpg",
	"./VM/vm_hit1.jpg": "./src/scene-images/VM/vm_hit1.jpg",
	"./VM/vm_hit2.jpg": "./src/scene-images/VM/vm_hit2.jpg",
	"./VM/vm_hit3.jpg": "./src/scene-images/VM/vm_hit3.jpg",
	"./VM/vm_hit4.jpg": "./src/scene-images/VM/vm_hit4.jpg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/scene-images sync recursive \\.jpg$/";

/***/ }),

/***/ "./src/Sound Effects/explosion.mp3":
/*!*****************************************!*\
  !*** ./src/Sound Effects/explosion.mp3 ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "bf95f61e3daf59e6184f.mp3";

/***/ }),

/***/ "./src/Sound Effects/laser.mp3":
/*!*************************************!*\
  !*** ./src/Sound Effects/laser.mp3 ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8bdf1ef724a4bc2fae3d.mp3";

/***/ }),

/***/ "./src/Sound Effects/miss.mp3":
/*!************************************!*\
  !*** ./src/Sound Effects/miss.mp3 ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f64defd82cf58a333b87.mp3";

/***/ }),

/***/ "./src/scene-images/AT/at_attack1.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/AT/at_attack1.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "aad5359b479b02e964a7.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_attack2.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/AT/at_attack2.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ea3a9b64bb8be9da8361.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_attack3.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/AT/at_attack3.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "82f8502d230ad135a03d.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_attack4.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/AT/at_attack4.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fc747156f95230a334c0.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_gen1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_gen1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "43750737c32ed79bbb61.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_gen2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_gen2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "51241f7aa04e1df29e71.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_gen3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_gen3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4f1fd1abe76b6f251293.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_gen4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_gen4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fa5463315e20414c4c3f.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_hit1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_hit1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "86bd0c6325127be7bb50.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_hit2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_hit2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "789e79dee628b0a3d41d.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_hit3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_hit3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "49d943cfb0952e3d5744.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_hit4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_hit4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c51b5bbca12b3be7057a.jpg";

/***/ }),

/***/ "./src/scene-images/AT/at_hit5.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/AT/at_hit5.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6f6e2a6766b8940d6724.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_attack1.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/IG/ig_attack1.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "3ab243959add3a2e476f.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_attack2.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/IG/ig_attack2.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6257697a2b5f15a3af80.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_attack3.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/IG/ig_attack3.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "d87de3ca8d2de69060d5.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_attack4.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/IG/ig_attack4.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0dd171313c2c6ac9ae4b.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_gen1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_gen1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "88fb49ebedcae52f0218.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_gen2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_gen2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4e28295f5e029a89a563.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_gen3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_gen3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "bfc5361a9e869c2c16bf.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_gen4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_gen4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "501319eb50362eedad11.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_gen5.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_gen5.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "163f847b338fe96c25ec.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_hit1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_hit1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a39b5347a8a91f42feb9.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_hit2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_hit2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5331e4ed54175f683691.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_hit3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_hit3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "43a140e2ca3b60f5e752.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_hit4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_hit4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6b6168febb2cd0bb9f78.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_hit5.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_hit5.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "458030b4be630a794b0a.jpg";

/***/ }),

/***/ "./src/scene-images/IG/ig_hit6.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/IG/ig_hit6.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8079a4186d2e47ec9d4a.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_attack1.jpg":
/*!******************************************!*\
  !*** ./src/scene-images/L/l_attack1.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6df43bf424a111fc0f70.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_attack2.jpg":
/*!******************************************!*\
  !*** ./src/scene-images/L/l_attack2.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "734730210d2e1afd92e1.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_attack3.jpg":
/*!******************************************!*\
  !*** ./src/scene-images/L/l_attack3.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fefae07cb01f06d2f492.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_attack4.jpg":
/*!******************************************!*\
  !*** ./src/scene-images/L/l_attack4.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "71a0f7a250879d12474d.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_attack5.jpg":
/*!******************************************!*\
  !*** ./src/scene-images/L/l_attack5.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "3f6ee35ea9fc6c96fa96.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_gen1.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_gen1.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ca0c12932b27cfd1dab2.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_gen2.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_gen2.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eb13c0ea10126385a10c.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_gen3.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_gen3.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "56c235a0f4467998aff3.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_gen4.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_gen4.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2c7e827d0a8e2fa16b72.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_hit1.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_hit1.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "57f96ae697b2a244b6ca.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_hit2.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_hit2.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fcf12d7390645c8ae778.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_hit3.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_hit3.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cd1e88a8e84e1f5f3766.jpg";

/***/ }),

/***/ "./src/scene-images/L/l_hit5.jpg":
/*!***************************************!*\
  !*** ./src/scene-images/L/l_hit5.jpg ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "bee38d11c94627ba5f8c.jpg";

/***/ }),

/***/ "./src/scene-images/L/lgen5.jpg":
/*!**************************************!*\
  !*** ./src/scene-images/L/lgen5.jpg ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "29382d02d52a1efc54da.jpg";

/***/ }),

/***/ "./src/scene-images/L/lhit4.jpg":
/*!**************************************!*\
  !*** ./src/scene-images/L/lhit4.jpg ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "814d161cf3b995e4a83b.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_attack1.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/SP/sp_attack1.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0ffb5d3e6711b944792e.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_attack2.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/SP/sp_attack2.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "3233ff0a3621f1d6bd00.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_attack3.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/SP/sp_attack3.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c1c0e2c9b819f0f703ac.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_attack4.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/SP/sp_attack4.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "d60cb3187c1cfd4d3dc3.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_gen1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_gen1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fffcd235d8672aa9850b.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_gen2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_gen2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "306a683bd1c594130d21.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_gen3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_gen3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a66d2f917ac43187adec.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_gen4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_gen4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f69c351192798616a11d.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_hit1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_hit1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "9847bbe5d478b9968b86.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_hit2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_hit2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cb2c94724d66c81440d9.jpg";

/***/ }),

/***/ "./src/scene-images/SP/sp_hit3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/SP/sp_hit3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2a439c2f58ade488fbfd.jpg";

/***/ }),

/***/ "./src/scene-images/VM/mv_hit5.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/mv_hit5.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "57d1cb7b3421bddea016.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_attack1.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/VM/vm_attack1.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6342a657c4e8ae7c9150.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_attack2.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/VM/vm_attack2.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fed21c9eb3c11ad3b850.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_attack3.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/VM/vm_attack3.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eb0f6efee17bfd74a6c9.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_attack4.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/VM/vm_attack4.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fe2e890040466ae1faff.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_attack5.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/VM/vm_attack5.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b8f7662459b33dea73ca.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_attack6.jpg":
/*!********************************************!*\
  !*** ./src/scene-images/VM/vm_attack6.jpg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8f55c03c47f791b78093.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_gen1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_gen1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "73b004fad3833ba195f3.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_gen2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_gen2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "dc66c8cb10b71597ac0b.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_gen3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_gen3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ce7320217cec66f03d9f.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_gen4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_gen4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "28cce5d282f302f03679.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_gen5.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_gen5.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "09fa88836648b1c6aec1.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_gen6.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_gen6.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ab9252fe51f9bb0d82c1.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_hit1.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_hit1.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c07f7323d0c53477423d.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_hit2.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_hit2.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "578ac4c6b924af6da544.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_hit3.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_hit3.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "983b4194bafaca1ded08.jpg";

/***/ }),

/***/ "./src/scene-images/VM/vm_hit4.jpg":
/*!*****************************************!*\
  !*** ./src/scene-images/VM/vm_hit4.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4e7549f67c59bedb0270.jpg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/reset.css */ "./src/style/reset.css");
/* harmony import */ var _style_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/style.css */ "./src/style/style.css");
/* harmony import */ var _helpers_initializeGame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/initializeGame */ "./src/helpers/initializeGame.js");
/* eslint-disable no-unused-vars */
// Import style sheets



(0,_helpers_initializeGame__WEBPACK_IMPORTED_MODULE_2__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxPQUFPLDZGQUE2RixNQUFNLFlBQVksYUFBYSxhQUFhLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxXQUFXLFlBQVksTUFBTSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sV0FBVyxZQUFZLE1BQU0sVUFBVSxZQUFZLGNBQWMsV0FBVyxVQUFVLE1BQU0sVUFBVSxLQUFLLFlBQVksV0FBVyxVQUFVLGFBQWEsY0FBYyxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGNBQWMsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxNQUFNLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE9BQU8sVUFBVSxXQUFXLFlBQVksYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsT0FBTyxPQUFPLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxXQUFXLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxRQUFRLGNBQWMsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sTUFBTSxVQUFVLFdBQVcsWUFBWSxhQUFhLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxPQUFPLE1BQU0sWUFBWSxPQUFPLE1BQU0sWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE1BQU0sV0FBVyxZQUFZLE1BQU0sWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLE9BQU8sWUFBWSxNQUFNLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGNBQWMsWUFBWSxZQUFZLGNBQWMsYUFBYSxPQUFPLEtBQUssYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVkseUJBQXlCLE9BQU8sS0FBSyxZQUFZLE1BQU0sV0FBVyxZQUFZLE1BQU0sWUFBWSxZQUFZLFdBQVcsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFdBQVcsWUFBWSxhQUFhLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLFdBQVcsd0RBQXdELHVCQUF1Qix1QkFBdUIsc0JBQXNCLHVCQUF1Qix1QkFBdUIsa0NB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUM1RkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDbEJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQzJCO0FBQ0E7QUFDMkI7QUFFdERtQyxtRUFBYyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HcmlkQ2FudmFzL0dyaWRDYW52YXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR3JpZENhbnZhcy9kcmF3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9haUF0dGFjay9haUF0dGFjay5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvYWlBdHRhY2svYWlCcmFpbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvYWlBdHRhY2svY3JlYXRlUHJvYnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2NhbnZhc0FkZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9pbWFnZUxvYWRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvaW5pdGlhbGl6ZUdhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3BsYWNlQWlTaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvcmFuZG9tU2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVMb2cuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVNYW5hZ2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zb3VuZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3dlYkludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9yZXNldC5jc3M/NDQ1ZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcz9jOWYwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY2VuZS1pbWFnZXMvIHN5bmMgXFwuanBnJC8iLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIG1vZHVsZSBpcyB1c2VkIGJ5IHRoZSBQbGF5ZXIgZmFjdG9yeSB0byBjcmVhdGUgZ2FtZWJvYXJkcyBmb3IgdGhlIHVzZXIgYW5kIGFpXG4gIHBsYXllcnMuIFRoZSBnYW1lYm9hcmQgaXMgcmVzcG9uc2libGUgZm9yIGhvbGRpbmcgaW5mb3JtYXRpb24gcmVsYXRlZCB0byB0aGUgc3RhdGUgb2ZcbiAgYSBwbGF5ZXJzIHNoaXBzLCBoaXRzIGFuZCBtaXNzZXMsIHJlZmVyZW5jZXMgcmVwcmVzZW50aW5nIHRoZSBib2FyZCBzdGF0ZSwgYW5kIHZhcmlvdXNcbiAgbWV0aG9kcyBmb3IgYWx0ZXJpbmcgdGhlIGJvYXJkIG9yIGdldHRpbmcgaW5mb3JtYXRpb24gYWJvdXQgaXQuICovXG5cbmltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcbmltcG9ydCBhaUF0dGFjayBmcm9tIFwiLi4vaGVscGVycy9haUF0dGFjay9haUF0dGFja1wiO1xuXG4vLyBHYW1lYm9hcmQgZmFjdG9yeVxuY29uc3QgR2FtZWJvYXJkID0gKGdtKSA9PiB7XG4gIGNvbnN0IHRoaXNHYW1lYm9hcmQgPSB7XG4gICAgbWF4Qm9hcmRYOiA5LFxuICAgIG1heEJvYXJkWTogOSxcbiAgICBzaGlwczogW10sXG4gICAgYWxsT2NjdXBpZWRDZWxsczogW10sXG4gICAgY2VsbHNUb0NoZWNrOiBbXSxcbiAgICBtaXNzZXM6IFtdLFxuICAgIGhpdHM6IFtdLFxuICAgIGRpcmVjdGlvbjogMSxcbiAgICBoaXRTaGlwVHlwZTogbnVsbCxcbiAgICBpc0FpOiBmYWxzZSxcbiAgICBpc0F1dG9BdHRhY2tpbmc6IGZhbHNlLFxuICAgIGlzQWlTZWVraW5nOiB0cnVlLFxuICAgIGdhbWVPdmVyOiBmYWxzZSxcbiAgICBjYW5BdHRhY2s6IHRydWUsXG4gICAgcml2YWxCb2FyZDogbnVsbCxcbiAgICBjYW52YXM6IG51bGwsXG4gICAgYWRkU2hpcDogbnVsbCxcbiAgICByZWNlaXZlQXR0YWNrOiBudWxsLFxuICAgIGFsbFN1bms6IG51bGwsXG4gICAgbG9nU3VuazogbnVsbCxcbiAgICBpc0NlbGxTdW5rOiBudWxsLFxuICAgIGFscmVhZHlBdHRhY2tlZDogbnVsbCxcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgc2hpcCBvY2N1cGllZCBjZWxsIGNvb3Jkc1xuICBjb25zdCB2YWxpZGF0ZVNoaXAgPSAoc2hpcCkgPT4ge1xuICAgIGlmICghc2hpcCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEZsYWcgZm9yIGRldGVjdGluZyBpbnZhbGlkIHBvc2l0aW9uIHZhbHVlXG4gICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCBzaGlwcyBvY2N1cGllZCBjZWxscyBhcmUgYWxsIHdpdGhpbiBtYXAgYW5kIG5vdCBhbHJlYWR5IG9jY3VwaWVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIC8vIE9uIHRoZSBtYXA/XG4gICAgICBpZiAoXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSA+PSAwICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSA8PSB0aGlzR2FtZWJvYXJkLm1heEJvYXJkWCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV0gPj0gMCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV0gPD0gdGhpc0dhbWVib2FyZC5tYXhCb2FyZFlcbiAgICAgICkge1xuICAgICAgICAvLyBEbyBub3RoaW5nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBDaGVjayBvY2N1cGllZCBjZWxsc1xuICAgICAgY29uc3QgaXNDZWxsT2NjdXBpZWQgPSB0aGlzR2FtZWJvYXJkLmFsbE9jY3VwaWVkQ2VsbHMuc29tZShcbiAgICAgICAgKGNlbGwpID0+XG4gICAgICAgICAgLy8gQ29vcmRzIGZvdW5kIGluIGFsbCBvY2N1cGllZCBjZWxscyBhbHJlYWR5XG4gICAgICAgICAgY2VsbFswXSA9PT0gc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdICYmXG4gICAgICAgICAgY2VsbFsxXSA9PT0gc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdXG4gICAgICApO1xuXG4gICAgICBpZiAoaXNDZWxsT2NjdXBpZWQpIHtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICBicmVhazsgLy8gQnJlYWsgb3V0IG9mIHRoZSBsb29wIGlmIG9jY3VwaWVkIGNlbGwgaXMgZm91bmRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCBhZGRzIG9jY3VwaWVkIGNlbGxzIG9mIHZhbGlkIGJvYXQgdG8gbGlzdFxuICBjb25zdCBhZGRDZWxsc1RvTGlzdCA9IChzaGlwKSA9PiB7XG4gICAgc2hpcC5vY2N1cGllZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIHRoaXNHYW1lYm9hcmQuYWxsT2NjdXBpZWRDZWxscy5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgYWRkaW5nIGEgc2hpcCBhdCBhIGdpdmVuIGNvb3JkcyBpbiBnaXZlbiBkaXJlY3Rpb24gaWYgc2hpcCB3aWxsIGZpdCBvbiBib2FyZFxuICB0aGlzR2FtZWJvYXJkLmFkZFNoaXAgPSAoXG4gICAgcG9zaXRpb24sXG4gICAgZGlyZWN0aW9uID0gdGhpc0dhbWVib2FyZC5kaXJlY3Rpb24sXG4gICAgc2hpcFR5cGVJbmRleCA9IHRoaXNHYW1lYm9hcmQuc2hpcHMubGVuZ3RoICsgMVxuICApID0+IHtcbiAgICAvLyBDcmVhdGUgdGhlIGRlc2lyZWQgc2hpcFxuICAgIGNvbnN0IG5ld1NoaXAgPSBTaGlwKHNoaXBUeXBlSW5kZXgsIHBvc2l0aW9uLCBkaXJlY3Rpb24pO1xuICAgIC8vIEFkZCBpdCB0byBzaGlwcyBpZiBpdCBoYXMgdmFsaWQgb2NjdXBpZWQgY2VsbHNcbiAgICBpZiAodmFsaWRhdGVTaGlwKG5ld1NoaXApKSB7XG4gICAgICBhZGRDZWxsc1RvTGlzdChuZXdTaGlwKTtcbiAgICAgIHRoaXNHYW1lYm9hcmQuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYWRkTWlzcyA9IChwb3NpdGlvbikgPT4ge1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgdGhpc0dhbWVib2FyZC5taXNzZXMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFkZEhpdCA9IChwb3NpdGlvbiwgc2hpcCkgPT4ge1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgdGhpc0dhbWVib2FyZC5oaXRzLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgbW9zdCByZWNlbnRseSBoaXQgc2hpcFxuICAgIHRoaXNHYW1lYm9hcmQuaGl0U2hpcFR5cGUgPSBzaGlwLnR5cGU7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciByZWNlaXZpbmcgYW4gYXR0YWNrIGZyb20gb3Bwb25lbnRcbiAgdGhpc0dhbWVib2FyZC5yZWNlaXZlQXR0YWNrID0gKHBvc2l0aW9uLCBzaGlwcyA9IHRoaXNHYW1lYm9hcmQuc2hpcHMpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIC8vIFZhbGlkYXRlIHBvc2l0aW9uIGlzIDIgaW4gYXJyYXkgYW5kIHNoaXBzIGlzIGFuIGFycmF5LCBhbmQgcml2YWwgYm9hcmQgY2FuIGF0dGFja1xuICAgICAgaWYgKFxuICAgICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheShzaGlwcylcbiAgICAgICkge1xuICAgICAgICAvLyBFYWNoIHNoaXAgaW4gc2hpcHNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIElmIHRoZSBzaGlwIGlzIG5vdCBmYWxzeSwgYW5kIG9jY3VwaWVkQ2VsbHMgcHJvcCBleGlzdHMgYW5kIGlzIGFuIGFycmF5XG4gICAgICAgICAgICBzaGlwc1tpXSAmJlxuICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxscyAmJlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShzaGlwc1tpXS5vY2N1cGllZENlbGxzKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gRm9yIGVhY2ggb2YgdGhhdCBzaGlwcyBvY2N1cGllZCBjZWxsc1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwc1tpXS5vY2N1cGllZENlbGxzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGF0IGNlbGwgbWF0Y2hlcyB0aGUgYXR0YWNrIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVswXSA9PT0gcG9zaXRpb25bMF0gJiZcbiAgICAgICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzW2pdWzFdID09PSBwb3NpdGlvblsxXVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoYXQgc2hpcHMgaGl0IG1ldGhvZCBhbmQgYnJlYWsgb3V0IG9mIGxvb3BcbiAgICAgICAgICAgICAgICBzaGlwc1tpXS5oaXQoKTtcbiAgICAgICAgICAgICAgICBhZGRIaXQocG9zaXRpb24sIHNoaXBzW2ldKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYWRkTWlzcyhwb3NpdGlvbik7XG4gICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICB9KTtcblxuICAvLyBNZXRob2QgZm9yIHRyeWluZyBhaSBhdHRhY2tzXG4gIHRoaXNHYW1lYm9hcmQudHJ5QWlBdHRhY2sgPSAoZGVsYXkpID0+IHtcbiAgICAvLyBSZXR1cm4gaWYgbm90IGFpIG9yIGdhbWUgaXMgb3ZlclxuICAgIGlmICh0aGlzR2FtZWJvYXJkLmlzQWkgPT09IGZhbHNlKSByZXR1cm47XG4gICAgYWlBdHRhY2soZ20sIGRlbGF5KTtcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCBkZXRlcm1pbmVzIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBub3RcbiAgdGhpc0dhbWVib2FyZC5hbGxTdW5rID0gKHNoaXBBcnJheSA9IHRoaXNHYW1lYm9hcmQuc2hpcHMpID0+IHtcbiAgICBpZiAoIXNoaXBBcnJheSB8fCAhQXJyYXkuaXNBcnJheShzaGlwQXJyYXkpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICBzaGlwQXJyYXkuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXAgJiYgc2hpcC5pc1N1bmsgJiYgIXNoaXAuaXNTdW5rKCkpIGFsbFN1bmsgPSBmYWxzZTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfTtcblxuICAvLyBPYmplY3QgZm9yIHRyYWNraW5nIGJvYXJkJ3Mgc3Vua2VuIHNoaXBzXG4gIHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHMgPSB7XG4gICAgMTogZmFsc2UsXG4gICAgMjogZmFsc2UsXG4gICAgMzogZmFsc2UsXG4gICAgNDogZmFsc2UsXG4gICAgNTogZmFsc2UsXG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciByZXBvcnRpbmcgc3Vua2VuIHNoaXBzXG4gIHRoaXNHYW1lYm9hcmQubG9nU3VuayA9ICgpID0+IHtcbiAgICBsZXQgbG9nTXNnID0gbnVsbDtcbiAgICBPYmplY3Qua2V5cyh0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwc1trZXldID09PSBmYWxzZSAmJlxuICAgICAgICB0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdLmlzU3VuaygpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0udHlwZTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpc0dhbWVib2FyZC5pc0FpID8gXCJBSSdzXCIgOiBcIlVzZXInc1wiO1xuICAgICAgICBsb2dNc2cgPSBgPHNwYW4gc3R5bGU9XCJjb2xvcjogcmVkXCI+JHtwbGF5ZXJ9ICR7c2hpcH0gd2FzIGRlc3Ryb3llZCE8L3NwYW4+YDtcbiAgICAgICAgdGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwc1trZXldID0gdHJ1ZTtcbiAgICAgICAgLy8gQ2FsbCB0aGUgbWV0aG9kIGZvciByZXNwb25kaW5nIHRvIHVzZXIgc2hpcCBzdW5rIG9uIGdhbWUgbWFuYWdlclxuICAgICAgICBpZiAoIXRoaXNHYW1lYm9hcmQuaXNBaSkgZ20udXNlclNoaXBTdW5rKHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBsb2dNc2c7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBkZXRlcm1pbmluZyBpZiBhIHBvc2l0aW9uIGlzIGFscmVhZHkgYXR0YWNrZWRcbiAgdGhpc0dhbWVib2FyZC5hbHJlYWR5QXR0YWNrZWQgPSAoYXR0YWNrQ29vcmRzKSA9PiB7XG4gICAgbGV0IGF0dGFja2VkID0gZmFsc2U7XG5cbiAgICB0aGlzR2FtZWJvYXJkLmhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBpZiAoYXR0YWNrQ29vcmRzWzBdID09PSBoaXRbMF0gJiYgYXR0YWNrQ29vcmRzWzFdID09PSBoaXRbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpc0dhbWVib2FyZC5taXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xuICAgICAgaWYgKGF0dGFja0Nvb3Jkc1swXSA9PT0gbWlzc1swXSAmJiBhdHRhY2tDb29yZHNbMV0gPT09IG1pc3NbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF0dGFja2VkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmV0dXJuaW5nIGJvb2wgZm9yIGlmIGNlbGwgb2NjdXBpZWQgYnkgc3VuayBzaGlwXG4gIHRoaXNHYW1lYm9hcmQuaXNDZWxsU3VuayA9IChjZWxsVG9DaGVjaykgPT4ge1xuICAgIGxldCBpc0NlbGxTdW5rID0gZmFsc2U7IC8vIEZsYWcgdmFyaWFibGVcblxuICAgIE9iamVjdC5rZXlzKHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHNba2V5XSA9PT0gdHJ1ZSAmJiAhaXNDZWxsU3Vuaykge1xuICAgICAgICBjb25zdCBoYXNNYXRjaGluZ0NlbGwgPSB0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdLm9jY3VwaWVkQ2VsbHMuc29tZShcbiAgICAgICAgICAoY2VsbCkgPT4gY2VsbFRvQ2hlY2tbMF0gPT09IGNlbGxbMF0gJiYgY2VsbFRvQ2hlY2tbMV0gPT09IGNlbGxbMV1cbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoaGFzTWF0Y2hpbmdDZWxsKSB7XG4gICAgICAgICAgaXNDZWxsU3VuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpc0NlbGxTdW5rO1xuICB9O1xuXG4gIHJldHVybiB0aGlzR2FtZWJvYXJkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiLyogVGhpcyBtb2R1bGUgY3JlYXRlcyBhbmQgcmV0dXJucyBhIGR1YWwsIGxheWVyZWQgY2FudmFzIGVsZW1lbnQuIFRoZSBib3R0b20gbGF5ZXIgaXMgdGhlIGJvYXJkXG4gIGNhbnZhcyB0aGF0IHJlcHJlc3BlbnRzIGJhc2ljIGJvYXJkIGVsZW1lbnRzIHRoYXQgZG9uJ3QgY2hhbmdlIG9mdGVuLCBzdWNoIGFzIHNoaXBzLCBoaXRzLCBtaXNzZXNcbiAgYW5kIGdyaWQgbGluZXMuIFRoZSB0b3AgbGF5ZXIgaXMgdGhlIG92ZXJsYXkgY2FudmFzIHRoYXQgcmVwcmVzZW50cyBmcmVxdWVudGx5IGNoYW5naW5nIGVsZW1lbnRzXG4gIGxpa2UgaGlnaGxpZ2h0aW5nIGNlbGxzIHRvIGluZGljYXRlIHdoZXJlIGF0dGFja3Mgb3Igc2hpcHMgd2lsbCBnby4gXG4gIFxuICBJdCBhbHNvIHNldHMgdXAgaGFuZGxlcnMgZm9yIGJyb3dzZXIgbW91c2UgZXZlbnRzIHRoYXQgYWxsb3cgdGhlIGh1bWFuIHVzZXIgdG8gaW50ZXJhY3Qgd2l0aCB0aGVcbiAgcHJvZ3JhbSwgc3VjaCBhcyBwbGFjaW5nIHNoaXBzIGFuZCBwaWNraW5nIGNlbGxzIHRvIGF0dGFjay4gKi9cblxuLy8gSGVscGVyIG1vZHVsZSBmb3IgZHJhdyBtZXRob2RzXG5pbXBvcnQgZHJhd2luZ01vZHVsZSBmcm9tIFwiLi9kcmF3XCI7XG5cbi8vIEluaXRpYWxpemUgaXRcbmNvbnN0IGRyYXcgPSBkcmF3aW5nTW9kdWxlKCk7XG5cbmNvbnN0IGNyZWF0ZUNhbnZhcyA9IChnbSwgY2FudmFzWCwgY2FudmFzWSwgb3B0aW9ucykgPT4ge1xuICAvLyAjcmVnaW9uIFNldCB1cCBiYXNpYyBlbGVtZW50IHByb3BlcnRpZXNcbiAgLy8gU2V0IHRoZSBncmlkIGhlaWdodCBhbmQgd2lkdGggYW5kIGFkZCByZWYgdG8gY3VycmVudCBjZWxsXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGxldCBjdXJyZW50Q2VsbCA9IG51bGw7XG5cbiAgLy8gQ3JlYXRlIHBhcmVudCBkaXYgdGhhdCBob2xkcyB0aGUgY2FudmFzZXMuIFRoaXMgaXMgdGhlIGVsZW1lbnQgcmV0dXJuZWQuXG4gIGNvbnN0IGNhbnZhc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY2FudmFzLWNvbnRhaW5lclwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGJvYXJkIGNhbnZhcyBlbGVtZW50IHRvIHNlcnZlIGFzIHRoZSBnYW1lYm9hcmQgYmFzZVxuICBjb25zdCBib2FyZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChib2FyZENhbnZhcyk7XG4gIGJvYXJkQ2FudmFzLndpZHRoID0gY2FudmFzWDtcbiAgYm9hcmRDYW52YXMuaGVpZ2h0ID0gY2FudmFzWTtcbiAgY29uc3QgYm9hcmRDdHggPSBib2FyZENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBvdmVybGF5IGNhbnZhcyBmb3IgcmVuZGVyaW5nIHNoaXAgcGxhY2VtZW50IGFuZCBhdHRhY2sgc2VsZWN0aW9uXG4gIGNvbnN0IG92ZXJsYXlDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjYW52YXNDb250YWluZXIuYXBwZW5kQ2hpbGQob3ZlcmxheUNhbnZhcyk7XG4gIG92ZXJsYXlDYW52YXMud2lkdGggPSBjYW52YXNYO1xuICBvdmVybGF5Q2FudmFzLmhlaWdodCA9IGNhbnZhc1k7XG4gIGNvbnN0IG92ZXJsYXlDdHggPSBvdmVybGF5Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBTZXQgdGhlIFwiY2VsbCBzaXplXCIgZm9yIHRoZSBncmlkIHJlcHJlc2VudGVkIGJ5IHRoZSBjYW52YXNcbiAgY29uc3QgY2VsbFNpemVYID0gYm9hcmRDYW52YXMud2lkdGggLyBncmlkV2lkdGg7IC8vIE1vZHVsZSBjb25zdFxuICBjb25zdCBjZWxsU2l6ZVkgPSBib2FyZENhbnZhcy5oZWlnaHQgLyBncmlkSGVpZ2h0OyAvLyBNb2R1bGUgY29uc3RcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBHZW5lcmFsIGhlbHBlciBtZXRob2RzXG4gIC8vIE1ldGhvZCB0aGF0IGdldHMgdGhlIG1vdXNlIHBvc2l0aW9uIGJhc2VkIG9uIHdoYXQgY2VsbCBpdCBpcyBvdmVyXG4gIGNvbnN0IGdldE1vdXNlQ2VsbCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSBib2FyZENhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIGNvbnN0IGNlbGxYID0gTWF0aC5mbG9vcihtb3VzZVggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGNlbGxZID0gTWF0aC5mbG9vcihtb3VzZVkgLyBjZWxsU2l6ZVkpO1xuXG4gICAgcmV0dXJuIFtjZWxsWCwgY2VsbFldO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFzc2lnbiBzdGF0aWMgbWV0aG9kc1xuICAvLyBBZGQgbWV0aG9kcyBvbiB0aGUgY29udGFpbmVyIGZvciBkcmF3aW5nIGhpdHMgb3IgbWlzc2VzXG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3SGl0ID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGRyYXcuaGl0T3JNaXNzKGJvYXJkQ3R4LCBjZWxsU2l6ZVgsIGNlbGxTaXplWSwgY29vcmRpbmF0ZXMsIDEpO1xuICBjYW52YXNDb250YWluZXIuZHJhd01pc3MgPSAoY29vcmRpbmF0ZXMpID0+XG4gICAgZHJhdy5oaXRPck1pc3MoYm9hcmRDdHgsIGNlbGxTaXplWCwgY2VsbFNpemVZLCBjb29yZGluYXRlcywgMCk7XG5cbiAgLy8gQWRkIG1ldGhvZCB0byBjb250YWluZXIgZm9yIHNoaXBzIHRvIGJvYXJkIGNhbnZhc1xuICBjYW52YXNDb250YWluZXIuZHJhd1NoaXBzID0gKHVzZXJTaGlwcyA9IHRydWUpID0+IHtcbiAgICBkcmF3LnNoaXBzKGJvYXJkQ3R4LCBjZWxsU2l6ZVgsIGNlbGxTaXplWSwgZ20sIHVzZXJTaGlwcyk7XG4gIH07XG5cbiAgLy8gb3ZlcmxheUNhbnZhc1xuICAvLyBGb3J3YXJkIGNsaWNrcyB0byBib2FyZCBjYW52YXNcbiAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBuZXdFdmVudCA9IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwge1xuICAgICAgYnViYmxlczogZXZlbnQuYnViYmxlcyxcbiAgICAgIGNhbmNlbGFibGU6IGV2ZW50LmNhbmNlbGFibGUsXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICB9KTtcbiAgICBib2FyZENhbnZhcy5kaXNwYXRjaEV2ZW50KG5ld0V2ZW50KTtcbiAgfTtcblxuICAvLyBNb3VzZWxlYXZlXG4gIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgY3VycmVudENlbGwgPSBudWxsO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFzc2lnbiBiZWhhdmlvciB1c2luZyBicm93c2VyIGV2ZW50IGhhbmRsZXJzIGJhc2VkIG9uIG9wdGlvbnNcbiAgLy8gUGxhY2VtZW50IGlzIHVzZWQgZm9yIHBsYWNpbmcgc2hpcHNcbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJwbGFjZW1lbnRcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBjYW52YXNDb250YWluZXIgdG8gZGVub3RlIHBsYWNlbWVudCBjb250YWluZXJcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIFNldCB1cCBvdmVybGF5Q2FudmFzIHdpdGggYmVoYXZpb3JzIHVuaXF1ZSB0byBwbGFjZW1lbnRcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xuICAgICAgLy8gR2V0IHdoYXQgY2VsbCB0aGUgbW91c2UgaXMgb3ZlclxuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIC8vIElmIHRoZSAnb2xkJyBjdXJyZW50Q2VsbCBpcyBlcXVhbCB0byB0aGUgbW91c2VDZWxsIGJlaW5nIGV2YWx1YXRlZFxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIGN1cnJlbnRDZWxsICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMF0gPT09IG1vdXNlQ2VsbFswXSAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzFdID09PSBtb3VzZUNlbGxbMV1cbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFJlbmRlciB0aGUgY2hhbmdlc1xuICAgICAgICBkcmF3LnBsYWNlbWVudEhpZ2hsaWdodChcbiAgICAgICAgICBvdmVybGF5Q3R4LFxuICAgICAgICAgIGNhbnZhc1gsXG4gICAgICAgICAgY2FudmFzWSxcbiAgICAgICAgICBjZWxsU2l6ZVgsXG4gICAgICAgICAgY2VsbFNpemVZLFxuICAgICAgICAgIG1vdXNlQ2VsbCxcbiAgICAgICAgICBnbVxuICAgICAgICApO1xuICAgICAgICAvLyBoaWdobGlnaHRQbGFjZW1lbnRDZWxscyhtb3VzZUNlbGwpO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIGN1cnJlbnRDZWxsIHRvIHRoZSBtb3VzZUNlbGwgZm9yIGZ1dHVyZSBjb21wYXJpc29uc1xuICAgICAgY3VycmVudENlbGwgPSBtb3VzZUNlbGw7XG4gICAgfTtcblxuICAgIC8vIEJyb3dzZXIgY2xpY2sgZXZlbnRzXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG5cbiAgICAgIC8vIFRyeSBwbGFjZW1lbnRcbiAgICAgIGdtLnBsYWNlbWVudENsaWNrZWQoY2VsbCk7XG4gICAgfTtcbiAgfVxuICAvLyBVc2VyIGNhbnZhcyBmb3IgZGlzcGxheWluZyBhaSBoaXRzIGFuZCBtaXNzZXMgYWdhaW5zdCB1c2VyIGFuZCB1c2VyIHNoaXAgcGxhY2VtZW50c1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09IFwidXNlclwiKSB7XG4gICAgLy8gQWRkIGNsYXNzIHRvIGRlbm90ZSB1c2VyIGNhbnZhc1xuICAgIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidXNlci1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIEhhbmRsZSBjYW52YXMgbW91c2UgbW92ZVxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKCkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH07XG4gICAgLy8gSGFuZGxlIGJvYXJkIG1vdXNlIGNsaWNrXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9ICgpID0+IHtcbiAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9O1xuICB9XG4gIC8vIEFJIGNhbnZhcyBmb3IgZGlzcGxheWluZyB1c2VyIGhpdHMgYW5kIG1pc3NlcyBhZ2FpbnN0IGFpLCBhbmQgYWkgc2hpcCBwbGFjZW1lbnRzIGlmIHVzZXIgbG9zZXNcbiAgZWxzZSBpZiAob3B0aW9ucy50eXBlID09PSBcImFpXCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gZGVub3RlIGFpIGNhbnZhc1xuICAgIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWktY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBIYW5kbGUgY2FudmFzIG1vdXNlIG1vdmVcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xuICAgICAgLy8gR2V0IHdoYXQgY2VsbCB0aGUgbW91c2UgaXMgb3ZlclxuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIC8vIElmIHRoZSAnb2xkJyBjdXJyZW50Q2VsbCBpcyBlcXVhbCB0byB0aGUgbW91c2VDZWxsIGJlaW5nIGV2YWx1YXRlZFxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIGN1cnJlbnRDZWxsICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMF0gPT09IG1vdXNlQ2VsbFswXSAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzFdID09PSBtb3VzZUNlbGxbMV1cbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgY3VycmVudCBjZWxsIGluIHJlZFxuICAgICAgICBkcmF3LmF0dGFja0hpZ2hsaWdodChcbiAgICAgICAgICBvdmVybGF5Q3R4LFxuICAgICAgICAgIGNhbnZhc1gsXG4gICAgICAgICAgY2FudmFzWSxcbiAgICAgICAgICBjZWxsU2l6ZVgsXG4gICAgICAgICAgY2VsbFNpemVZLFxuICAgICAgICAgIG1vdXNlQ2VsbCxcbiAgICAgICAgICBnbVxuICAgICAgICApO1xuICAgICAgICAvLyBoaWdobGlnaHRBdHRhY2sobW91c2VDZWxsKTtcbiAgICAgIH1cbiAgICAgIC8vIERlbm90ZSBpZiBpdCBpcyBhIHZhbGlkIGF0dGFjayBvciBub3QgLSBOWUlcbiAgICB9O1xuICAgIC8vIEhhbmRsZSBib2FyZCBtb3VzZSBjbGlja1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGF0dGFja0Nvb3JkcyA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICBnbS5wbGF5ZXJBdHRhY2tpbmcoYXR0YWNrQ29vcmRzKTtcblxuICAgICAgLy8gQ2xlYXIgdGhlIG92ZXJsYXkgdG8gc2hvdyBoaXQvbWlzcyB1bmRlciBjdXJyZW50IGhpZ2hpZ2h0XG4gICAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gU3Vic2NyaWJlIHRvIGJyb3dzZXIgZXZlbnRzXG4gIC8vIGJvYXJkIGNsaWNrXG4gIGJvYXJkQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayhlKSk7XG4gIC8vIG92ZXJsYXkgY2xpY2tcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUNsaWNrKGUpXG4gICk7XG4gIC8vIG92ZXJsYXkgbW91c2Vtb3ZlXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZShlKVxuICApO1xuICAvLyBvdmVybGF5IG1vdXNlbGVhdmVcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VMZWF2ZSgpXG4gICk7XG5cbiAgLy8gRHJhdyBpbml0aWFsIGJvYXJkIGxpbmVzXG4gIGRyYXcubGluZXMoYm9hcmRDdHgsIGNhbnZhc1gsIGNhbnZhc1kpO1xuXG4gIC8vIFJldHVybiBjb21wbGV0ZWQgY2FudmFzZXNcbiAgcmV0dXJuIGNhbnZhc0NvbnRhaW5lcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNhbnZhcztcbiIsIi8qIFRoaXMgbW9kdWxlIGNvbnRhaW5zIHRoZSBtZXRob2RzIHVzZWQgYnkgR3JpZENhbnZhcyB0byBhY3R1YWxsIGRyYXcgZWxlbWVudHNcbiAgdG8gdGhlIGJvYXJkIGFuZCBvdmVybGF5IGNhbnZhcyBlbGVtZW50cy4gVGhpcyBpbmNsdWRlcyBncmlkIGxpbmVzLCBzaGlwIHBsYWNlbWVudHMsXG4gIGhpdHMsIG1pc3NlcyBhbmQgdmFyaW91cyBjZWxsIGhpZ2hsaWdodCBlZmZlY3RzLiAqL1xuXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xuICAvLyBEcmF3cyB0aGUgZ3JpZCBsaW5lc1xuICBjb25zdCBsaW5lcyA9IChjb250ZXh0LCBjYW52YXNYLCBjYW52YXNZKSA9PiB7XG4gICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgY29uc3QgZ3JpZFNpemUgPSBNYXRoLm1pbihjYW52YXNYLCBjYW52YXNZKSAvIDEwO1xuICAgIGNvbnN0IGxpbmVDb2xvciA9IFwiYmxhY2tcIjtcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gbGluZUNvbG9yO1xuICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcblxuICAgIC8vIERyYXcgdmVydGljYWwgbGluZXNcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSBjYW52YXNYOyB4ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICBjb250ZXh0LmxpbmVUbyh4LCBjYW52YXNZKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyBob3Jpem9udGFsIGxpbmVzXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gY2FudmFzWTsgeSArPSBncmlkU2l6ZSkge1xuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgY29udGV4dC5saW5lVG8oY2FudmFzWCwgeSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBEcmF3cyB0aGUgc2hpcHMuIERlZmF1bHQgZGF0YSB0byB1c2UgaXMgdXNlciBzaGlwcywgYnV0IGFpIGNhbiBiZSB1c2VkIHRvb1xuICBjb25zdCBzaGlwcyA9IChjb250ZXh0LCBjZWxsWCwgY2VsbFksIGdtLCB1c2VyU2hpcHMgPSB0cnVlKSA9PiB7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gYm9hcmRcbiAgICBmdW5jdGlvbiBkcmF3Q2VsbChwb3NYLCBwb3NZKSB7XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KHBvc1ggKiBjZWxsWCwgcG9zWSAqIGNlbGxZLCBjZWxsWCwgY2VsbFkpO1xuICAgIH1cbiAgICAvLyBXaGljaCBib2FyZCB0byBnZXQgc2hpcHMgZGF0YSBmcm9tXG4gICAgY29uc3QgYm9hcmQgPSB1c2VyU2hpcHMgPT09IHRydWUgPyBnbS51c2VyQm9hcmQgOiBnbS5haUJvYXJkO1xuICAgIC8vIERyYXcgdGhlIGNlbGxzIHRvIHRoZSBib2FyZFxuICAgIGJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAub2NjdXBpZWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgIGRyYXdDZWxsKGNlbGxbMF0sIGNlbGxbMV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gRHJhd3MgYSBoaXQgb3IgYSBtaXNzIGRlZmF1bHRpbmcgdG8gYSBtaXNzIGlmIG5vIHR5cGUgcGFzc2VkXG4gIGNvbnN0IGhpdE9yTWlzcyA9IChjb250ZXh0LCBjZWxsWCwgY2VsbFksIG1vdXNlQ29vcmRzLCB0eXBlID0gMCkgPT4ge1xuICAgIC8vIFNldCBwcm9wZXIgZmlsbCBjb2xvclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgIGlmICh0eXBlID09PSAxKSBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgLy8gU2V0IGEgcmFkaXVzIGZvciBjaXJjbGUgdG8gZHJhdyBmb3IgXCJwZWdcIiB0aGF0IHdpbGwgYWx3YXlzIGZpdCBpbiBjZWxsXG4gICAgY29uc3QgcmFkaXVzID0gY2VsbFggPiBjZWxsWSA/IGNlbGxZIC8gMiA6IGNlbGxYIC8gMjtcbiAgICAvLyBEcmF3IHRoZSBjaXJjbGVcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQuYXJjKFxuICAgICAgbW91c2VDb29yZHNbMF0gKiBjZWxsWCArIGNlbGxYIC8gMixcbiAgICAgIG1vdXNlQ29vcmRzWzFdICogY2VsbFkgKyBjZWxsWSAvIDIsXG4gICAgICByYWRpdXMsXG4gICAgICAwLFxuICAgICAgMiAqIE1hdGguUElcbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VtZW50SGlnaGxpZ2h0ID0gKFxuICAgIGNvbnRleHQsXG4gICAgY2FudmFzWCxcbiAgICBjYW52YXNZLFxuICAgIGNlbGxYLFxuICAgIGNlbGxZLFxuICAgIG1vdXNlQ29vcmRzLFxuICAgIGdtXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNYLCBjYW52YXNZKTtcbiAgICAvLyBEcmF3IGEgY2VsbCB0byBvdmVybGF5XG4gICAgZnVuY3Rpb24gZHJhd0NlbGwocG9zWCwgcG9zWSkge1xuICAgICAgY29udGV4dC5maWxsUmVjdChwb3NYICogY2VsbFgsIHBvc1kgKiBjZWxsWSwgY2VsbFgsIGNlbGxZKTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgY3VycmVudCBzaGlwIGxlbmd0aCAoYmFzZWQgb24gZGVmYXVsdCBiYXR0bGVzaGlwIHJ1bGVzIHNpemVzLCBzbWFsbGVzdCB0byBiaWdnZXN0KVxuICAgIGxldCBkcmF3TGVuZ3RoO1xuICAgIGNvbnN0IHNoaXBzQ291bnQgPSBnbS51c2VyQm9hcmQuc2hpcHMubGVuZ3RoO1xuICAgIGlmIChzaGlwc0NvdW50ID09PSAwKSBkcmF3TGVuZ3RoID0gMjtcbiAgICBlbHNlIGlmIChzaGlwc0NvdW50ID09PSAxIHx8IHNoaXBzQ291bnQgPT09IDIpIGRyYXdMZW5ndGggPSAzO1xuICAgIGVsc2UgZHJhd0xlbmd0aCA9IHNoaXBzQ291bnQgKyAxO1xuXG4gICAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiB0byBkcmF3IGluXG4gICAgbGV0IGRpcmVjdGlvblggPSAwO1xuICAgIGxldCBkaXJlY3Rpb25ZID0gMDtcblxuICAgIGlmIChnbS51c2VyQm9hcmQuZGlyZWN0aW9uID09PSAxKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMTtcbiAgICAgIGRpcmVjdGlvblggPSAwO1xuICAgIH0gZWxzZSBpZiAoZ20udXNlckJvYXJkLmRpcmVjdGlvbiA9PT0gMCkge1xuICAgICAgZGlyZWN0aW9uWSA9IDA7XG4gICAgICBkaXJlY3Rpb25YID0gMTtcbiAgICB9XG5cbiAgICAvLyBEaXZpZGUgdGhlIGRyYXdMZW5naHQgaW4gaGFsZiB3aXRoIHJlbWFpbmRlclxuICAgIGNvbnN0IGhhbGZEcmF3TGVuZ3RoID0gTWF0aC5mbG9vcihkcmF3TGVuZ3RoIC8gMik7XG4gICAgY29uc3QgcmVtYWluZGVyTGVuZ3RoID0gZHJhd0xlbmd0aCAlIDI7XG5cbiAgICAvLyBJZiBkcmF3aW5nIG9mZiBjYW52YXMgbWFrZSBjb2xvciByZWRcbiAgICAvLyBDYWxjdWxhdGUgbWF4aW11bSBhbmQgbWluaW11bSBjb29yZGluYXRlc1xuICAgIGNvbnN0IG1heENvb3JkaW5hdGVYID1cbiAgICAgIG1vdXNlQ29vcmRzWzBdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25YO1xuICAgIGNvbnN0IG1heENvb3JkaW5hdGVZID1cbiAgICAgIG1vdXNlQ29vcmRzWzFdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25ZO1xuICAgIGNvbnN0IG1pbkNvb3JkaW5hdGVYID0gbW91c2VDb29yZHNbMF0gLSBoYWxmRHJhd0xlbmd0aCAqIGRpcmVjdGlvblg7XG4gICAgY29uc3QgbWluQ29vcmRpbmF0ZVkgPSBtb3VzZUNvb3Jkc1sxXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWTtcblxuICAgIC8vIEFuZCB0cmFuc2xhdGUgaW50byBhbiBhY3R1YWwgY2FudmFzIHBvc2l0aW9uXG4gICAgY29uc3QgbWF4WCA9IG1heENvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWF4WSA9IG1heENvb3JkaW5hdGVZICogY2VsbFk7XG4gICAgY29uc3QgbWluWCA9IG1pbkNvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWluWSA9IG1pbkNvb3JkaW5hdGVZICogY2VsbFk7XG5cbiAgICAvLyBDaGVjayBpZiBhbnkgY2VsbHMgYXJlIG91dHNpZGUgdGhlIGNhbnZhcyBib3VuZGFyaWVzXG4gICAgY29uc3QgaXNPdXRPZkJvdW5kcyA9XG4gICAgICBtYXhYID49IGNhbnZhc1ggfHwgbWF4WSA+PSBjYW52YXNZIHx8IG1pblggPCAwIHx8IG1pblkgPCAwO1xuXG4gICAgLy8gU2V0IHRoZSBmaWxsIGNvbG9yIGJhc2VkIG9uIHdoZXRoZXIgY2VsbHMgYXJlIGRyYXduIG9mZiBjYW52YXNcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGlzT3V0T2ZCb3VuZHMgPyBcInJlZFwiIDogXCJibHVlXCI7XG5cbiAgICAvLyBEcmF3IHRoZSBtb3VzZWQgb3ZlciBjZWxsIGZyb20gcGFzc2VkIGNvb3Jkc1xuICAgIGRyYXdDZWxsKG1vdXNlQ29vcmRzWzBdLCBtb3VzZUNvb3Jkc1sxXSk7XG5cbiAgICAvLyBEcmF3IHRoZSBmaXJzdCBoYWxmIG9mIGNlbGxzIGFuZCByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV4dFggPSBtb3VzZUNvb3Jkc1swXSArIGkgKiBkaXJlY3Rpb25YO1xuICAgICAgY29uc3QgbmV4dFkgPSBtb3VzZUNvb3Jkc1sxXSArIGkgKiBkaXJlY3Rpb25ZO1xuICAgICAgZHJhd0NlbGwobmV4dFgsIG5leHRZKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IHRoZSByZW1haW5pbmcgaGFsZlxuICAgIC8vIERyYXcgdGhlIHJlbWFpbmluZyBjZWxscyBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmRHJhd0xlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXh0WCA9IG1vdXNlQ29vcmRzWzBdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblg7XG4gICAgICBjb25zdCBuZXh0WSA9IG1vdXNlQ29vcmRzWzFdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhdHRhY2tIaWdobGlnaHQgPSAoXG4gICAgY29udGV4dCxcbiAgICBjYW52YXNYLFxuICAgIGNhbnZhc1ksXG4gICAgY2VsbFgsXG4gICAgY2VsbFksXG4gICAgbW91c2VDb29yZHMsXG4gICAgZ21cbiAgKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1gsIGNhbnZhc1kpO1xuXG4gICAgLy8gSGlnaGxpZ2h0IHRoZSBjdXJyZW50IGNlbGwgaW4gcmVkXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJlZFwiO1xuXG4gICAgLy8gQ2hlY2sgaWYgY2VsbCBjb29yZHMgaW4gZ2FtZWJvYXJkIGhpdHMgb3IgbWlzc2VzXG4gICAgaWYgKGdtLmFpQm9hcmQuYWxyZWFkeUF0dGFja2VkKG1vdXNlQ29vcmRzKSkgcmV0dXJuO1xuXG4gICAgLy8gSGlnaGxpZ2h0IHRoZSBjZWxsXG4gICAgY29udGV4dC5maWxsUmVjdChcbiAgICAgIG1vdXNlQ29vcmRzWzBdICogY2VsbFgsXG4gICAgICBtb3VzZUNvb3Jkc1sxXSAqIGNlbGxZLFxuICAgICAgY2VsbFgsXG4gICAgICBjZWxsWVxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHsgbGluZXMsIHNoaXBzLCBoaXRPck1pc3MsIHBsYWNlbWVudEhpZ2hsaWdodCwgYXR0YWNrSGlnaGxpZ2h0IH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkcmF3O1xuIiwiLyogVGhpcyBtb2R1bGUgaXMgdXNlZCB0byBjcmVhdGUgdGhlIHBsYXllciBvYmplY3RzIHRoYXQgc3RvcmUgb3RoZXIgb2JqZWN0cyBhbmQgaW5mbyByZWxhdGVkXG4gIHRvIHRoZSB1c2VyIHBsYXllciBhbmQgQUkgcGxheWVyLiBUaGlzIGluY2x1ZGVzIHRoZWlyIGdhbWVib2FyZHMsIG5hbWVzLCBhbmQgYSBtZXRob2QgZm9yXG4gIHNlbmRpbmcgYXR0YWNrcyB0byBhIGdhbWVib2FyZC4gKi9cblxuaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcblxuLyogRmFjdG9yeSB0aGF0IGNyZWF0ZXMgYW5kIHJldHVybnMgYSBwbGF5ZXIgb2JqZWN0IHRoYXQgY2FuIHRha2UgYSBzaG90IGF0IG9wcG9uZW50J3MgZ2FtZSBib2FyZC5cbiAgIFJlcXVpcmVzIGdhbWVNYW5hZ2VyIGZvciBnYW1lYm9hcmQgbWV0aG9kcyAqL1xuY29uc3QgUGxheWVyID0gKGdtKSA9PiB7XG4gIGxldCBwcml2YXRlTmFtZSA9IFwiXCI7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSB7XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gcHJpdmF0ZU5hbWU7XG4gICAgfSxcbiAgICBzZXQgbmFtZShuZXdOYW1lKSB7XG4gICAgICBpZiAobmV3TmFtZSkge1xuICAgICAgICBwcml2YXRlTmFtZSA9IG5ld05hbWUudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBwcml2YXRlTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBnYW1lYm9hcmQ6IEdhbWVib2FyZChnbSksXG4gICAgc2VuZEF0dGFjazogbnVsbCxcbiAgfTtcblxuICAvLyBIZWxwZXIgbWV0aG9kIGZvciB2YWxpZGF0aW5nIHRoYXQgYXR0YWNrIHBvc2l0aW9uIGlzIG9uIGJvYXJkXG4gIGNvbnN0IHZhbGlkYXRlQXR0YWNrID0gKHBvc2l0aW9uLCBnYW1lYm9hcmQpID0+IHtcbiAgICAvLyBEb2VzIGdhbWVib2FyZCBleGlzdCB3aXRoIG1heEJvYXJkWC95IHByb3BlcnRpZXM/XG4gICAgaWYgKCFnYW1lYm9hcmQgfHwgIWdhbWVib2FyZC5tYXhCb2FyZFggfHwgIWdhbWVib2FyZC5tYXhCb2FyZFkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gSXMgcG9zaXRpb24gY29uc3RyYWluZWQgdG8gbWF4Ym9hcmRYL1kgYW5kIGJvdGggYXJlIGludHMgaW4gYW4gYXJyYXk/XG4gICAgaWYgKFxuICAgICAgcG9zaXRpb24gJiZcbiAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgICAgcG9zaXRpb25bMF0gPj0gMCAmJlxuICAgICAgcG9zaXRpb25bMF0gPD0gZ2FtZWJvYXJkLm1heEJvYXJkWCAmJlxuICAgICAgcG9zaXRpb25bMV0gPj0gMCAmJlxuICAgICAgcG9zaXRpb25bMV0gPD0gZ2FtZWJvYXJkLm1heEJvYXJkWVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHNlbmRpbmcgYXR0YWNrIHRvIHJpdmFsIGdhbWVib2FyZFxuICB0aGlzUGxheWVyLnNlbmRBdHRhY2sgPSAocG9zaXRpb24sIHBsYXllckJvYXJkID0gdGhpc1BsYXllci5nYW1lYm9hcmQpID0+IHtcbiAgICBpZiAodmFsaWRhdGVBdHRhY2socG9zaXRpb24sIHBsYXllckJvYXJkKSkge1xuICAgICAgcGxheWVyQm9hcmQucml2YWxCb2FyZC5yZWNlaXZlQXR0YWNrKHBvc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNQbGF5ZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCIvKiBUaGlzIG1vZHVsZSBpcyBhIGZhY3RvcnkgdXNlZCBieSB0aGUgR2FtZWJvYXJkIGZhY3RvcnkgbW9kdWxlIHRvIHBvcHVsYXRlIGdhbWVib2FyZHMgd2l0aFxuICBzaGlwcy4gQSBzaGlwIG9iamVjdCB3aWxsIGJlIHJldHVybmVkIHRoYXQgaW5jbHVkZXMgdmFyaW91cyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhdGVcbiAgb2YgdGhlIHNoaXAgc3VjaCBhcyB3aGF0IGNlbGxzIGl0IG9jY3VwaWVzLCBpdHMgc2l6ZSwgdHlwZSwgZXRjLiAqL1xuXG4vLyBDb250YWlucyB0aGUgbmFtZXMgZm9yIHRoZSBzaGlwcyBiYXNlZCBvbiBpbmRleFxuY29uc3Qgc2hpcE5hbWVzID0ge1xuICAxOiBcIlNlbnRpbmVsIFByb2JlXCIsXG4gIDI6IFwiQXNzYXVsdCBUaXRhblwiLFxuICAzOiBcIlZpcGVyIE1lY2hcIixcbiAgNDogXCJJcm9uIEdvbGlhdGhcIixcbiAgNTogXCJMZXZpYXRoYW5cIixcbn07XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHNoaXBzXG5jb25zdCBTaGlwID0gKGluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKSA9PiB7XG4gIC8vIFZhbGlkYXRlIGluZGV4XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPiA1IHx8IGluZGV4IDwgMSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAvLyBDcmVhdGUgdGhlIHNoaXAgb2JqZWN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZFxuICBjb25zdCB0aGlzU2hpcCA9IHtcbiAgICBpbmRleCxcbiAgICBzaXplOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgaGl0czogMCxcbiAgICBoaXQ6IG51bGwsXG4gICAgaXNTdW5rOiBudWxsLFxuICAgIG9jY3VwaWVkQ2VsbHM6IFtdLFxuICB9O1xuXG4gIC8vIFNldCBzaGlwIHNpemVcbiAgc3dpdGNoIChpbmRleCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IGluZGV4O1xuICB9XG5cbiAgLy8gU2V0IHNoaXAgbmFtZSBiYXNlZCBvbiBpbmRleFxuICB0aGlzU2hpcC50eXBlID0gc2hpcE5hbWVzW3RoaXNTaGlwLmluZGV4XTtcblxuICAvLyBBZGRzIGEgaGl0IHRvIHRoZSBzaGlwXG4gIHRoaXNTaGlwLmhpdCA9ICgpID0+IHtcbiAgICB0aGlzU2hpcC5oaXRzICs9IDE7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lcyBpZiBzaGlwIHN1bmsgaXMgdHJ1ZVxuICB0aGlzU2hpcC5pc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXNTaGlwLmhpdHMgPj0gdGhpc1NoaXAuc2l6ZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIFBsYWNlbWVudCBkaXJlY3Rpb24gaXMgZWl0aGVyIDAgZm9yIGhvcml6b250YWwgb3IgMSBmb3IgdmVydGljYWxcbiAgbGV0IHBsYWNlbWVudERpcmVjdGlvblggPSAwO1xuICBsZXQgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDA7XG4gIGlmIChkaXJlY3Rpb24gPT09IDApIHtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25YID0gMTtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMDtcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDEpIHtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25YID0gMDtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMTtcbiAgfVxuXG4gIC8vIFVzZSBwb3NpdGlvbiBhbmQgZGlyZWN0aW9uIHRvIGFkZCBvY2N1cGllZCBjZWxscyBjb29yZHNcbiAgaWYgKFxuICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgIChkaXJlY3Rpb24gPT09IDEgfHwgZGlyZWN0aW9uID09PSAwKVxuICApIHtcbiAgICAvLyBEaXZpZGUgbGVuZ3RoIGludG8gaGFsZiBhbmQgcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZlNpemUgPSBNYXRoLmZsb29yKHRoaXNTaGlwLnNpemUgLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJTaXplID0gdGhpc1NoaXAuc2l6ZSAlIDI7XG4gICAgLy8gQWRkIGZpcnN0IGhhbGYgb2YgY2VsbHMgcGx1cyByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZlNpemUgKyByZW1haW5kZXJTaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gKyBpICogcGxhY2VtZW50RGlyZWN0aW9uWCxcbiAgICAgICAgcG9zaXRpb25bMV0gKyBpICogcGxhY2VtZW50RGlyZWN0aW9uWSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gICAgLy8gQWRkIHNlY29uZCBoYWxmIG9mIGNlbGxzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXdDb29yZHMgPSBbXG4gICAgICAgIHBvc2l0aW9uWzBdIC0gKGkgKyAxKSAqIHBsYWNlbWVudERpcmVjdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWzFdIC0gKGkgKyAxKSAqIHBsYWNlbWVudERpcmVjdGlvblksXG4gICAgICBdO1xuICAgICAgdGhpc1NoaXAub2NjdXBpZWRDZWxscy5wdXNoKG5ld0Nvb3Jkcyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNTaGlwO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvKiBUaGlzIG1vZHVsZSBpcyB1c2VkIHRvIGRldGVybWluZSB3aGF0IGNlbGxzIHRoZSBBSSBzaG91bGQgYXR0YWNrLiBJdCBjaG9vc2VzIGF0dGFjayBcbiAgc3RhcnRlZ2llcyBiYXNlZCBvbiB0aGUgYWkgZGlmZmljdWx0eSBzZXR0aW5nIG9uIHRoZSBnYW1lTWFuYWdlci4gQWZ0ZXIgYXR0YWNrIGNvb3Jkc1xuICBhcmUgZm91bmQgdGhleSBhcmUgc2VudCBvZmYgdG8gdGhlIGdhbWVNYW5hZ2VyIHRvIGhhbmRsZSB0aGUgYWlBdHRhY2tpbmcgbG9naWMgZm9yIHRoZVxuICByZXN0IG9mIHRoZSBwcm9ncmFtLiAqL1xuXG5pbXBvcnQgYWlCcmFpbiBmcm9tIFwiLi9haUJyYWluXCI7XG5cbi8vIE1vZHVsZSB0aGF0IGFsbG93cyBhaSB0byBtYWtlIGF0dGFja3MgYmFzZWQgb24gcHJvYmFiaWxpdHkgYW5kIGhldXJpc3RpY3NcbmNvbnN0IGJyYWluID0gYWlCcmFpbigpO1xuXG4vLyBUaGlzIGhlbHBlciB3aWxsIGxvb2sgYXQgY3VycmVudCBoaXRzIGFuZCBtaXNzZXMgYW5kIHRoZW4gcmV0dXJuIGFuIGF0dGFja1xuY29uc3QgYWlBdHRhY2sgPSAoZ20sIGRlbGF5KSA9PiB7XG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGxldCBhdHRhY2tDb29yZHMgPSBbXTtcblxuICAvLyBVcGRhdGUgY2VsbCBoaXQgcHJvYmFiaWxpdGllc1xuICBicmFpbi51cGRhdGVQcm9icyhnbSk7XG5cbiAgLy8gTWV0aG9kIGZvciByZXR1cm5pbmcgcmFuZG9tIGF0dGFja1xuICBjb25zdCBmaW5kUmFuZG9tQXR0YWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkV2lkdGgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkSGVpZ2h0KTtcbiAgICBhdHRhY2tDb29yZHMgPSBbeCwgeV07XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZmluZHMgbGFyZ2VzdCB2YWx1ZSBpbiAyZCBhcnJheVxuICBjb25zdCBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGFsbFByb2JzID0gYnJhaW4ucHJvYnM7XG4gICAgbGV0IG1heCA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvYnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYWxsUHJvYnNbaV0ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgaWYgKGFsbFByb2JzW2ldW2pdID4gbWF4KSB7XG4gICAgICAgICAgbWF4ID0gYWxsUHJvYnNbaV1bal07XG4gICAgICAgICAgYXR0YWNrQ29vcmRzID0gW2ksIGpdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJhbmRvbSBhdHRhY2sgaWYgYWkgZGlmZmljdWx0eSBpcyAxXG4gIGlmIChnbS5haURpZmZpY3VsdHkgPT09IDEpIHtcbiAgICAvLyBTZXQgcmFuZG9tIGF0dGFjayAgY29vcmRzIHRoYXQgaGF2ZSBub3QgYmVlbiBhdHRhY2tlZFxuICAgIGZpbmRSYW5kb21BdHRhY2soKTtcbiAgICB3aGlsZSAoZ20udXNlckJvYXJkLmFscmVhZHlBdHRhY2tlZChhdHRhY2tDb29yZHMpKSB7XG4gICAgICBmaW5kUmFuZG9tQXR0YWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRG8gYW4gYXR0YWNrIGJhc2VkIG9uIHByb2JhYmlsaXRpZXMgaWYgYWkgZGlmZmljdWx0eSBpcyAyIGFuZCBpcyBzZWVraW5nXG4gIGVsc2UgaWYgKGdtLmFpRGlmZmljdWx0eSA9PT0gMiAmJiBnbS5haUJvYXJkLmlzQWlTZWVraW5nKSB7XG4gICAgLy8gRmlyc3QgZW5zdXJlIHRoYXQgZW1wdHkgY2VsbHMgYXJlIHNldCB0byB0aGVpciBpbml0aWFsaXplZCBwcm9icyB3aGVuIHNlZWtpbmdcbiAgICBicmFpbi5yZXNldEhpdEFkamFjZW50SW5jcmVhc2VzKCk7XG4gICAgLy8gVGhlbiBmaW5kIHRoZSBiZXN0IGF0dGFja1xuICAgIGZpbmRHcmVhdGVzdFByb2JBdHRhY2soKTtcbiAgICB3aGlsZSAoZ20udXNlckJvYXJkLmFscmVhZHlBdHRhY2tlZChhdHRhY2tDb29yZHMpKSB7XG4gICAgICBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRG8gYW4gYXR0YWNrIGJhc2VkIG9uIGRlc3Ryb3kgYmVoYXZpb3IgYWZ0ZXIgYSBoaXQgaXMgZm91bmRcbiAgZWxzZSBpZiAoZ20uYWlEaWZmaWN1bHR5ID09PSAyICYmICFnbS5haUJvYXJkLmlzQWlTZWVraW5nKSB7XG4gICAgLy8gR2V0IGNvb3JkcyB1c2luZyBkZXN0cm95IG1ldGhvZFxuICAgIGNvbnN0IGNvb3JkcyA9IGJyYWluLmRlc3Ryb3lNb2RlQ29vcmRzKGdtKTtcbiAgICAvLyBJZiBubyBjb29yZHMgYXJlIHJldHVybmVkIGluc3RlYWQgdXNlIHNlZWtpbmcgc3RyYXRcbiAgICBpZiAoIWNvb3Jkcykge1xuICAgICAgLy8gRmlyc3QgZW5zdXJlIHRoYXQgZW1wdHkgY2VsbHMgYXJlIHNldCB0byB0aGVpciBpbml0aWFsaXplZCBwcm9icyB3aGVuIHNlZWtpbmdcbiAgICAgIGJyYWluLnJlc2V0SGl0QWRqYWNlbnRJbmNyZWFzZXMoKTtcbiAgICAgIC8vIFRoZW4gZmluZCB0aGUgYmVzdCBhdHRhY2tcbiAgICAgIGZpbmRHcmVhdGVzdFByb2JBdHRhY2soKTtcbiAgICAgIHdoaWxlIChnbS51c2VyQm9hcmQuYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICAgICAgZmluZEdyZWF0ZXN0UHJvYkF0dGFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBFbHNlIGlmIGNvb3JkcyByZXR1cm5lZCwgdXNlIHRob3NlIGZvciBhdHRhY2tcbiAgICBlbHNlIGlmIChjb29yZHMpIHtcbiAgICAgIGF0dGFja0Nvb3JkcyA9IGNvb3JkcztcbiAgICB9XG4gIH1cbiAgLy8gU2VuZCBhdHRhY2sgdG8gZ2FtZSBtYW5hZ2VyXG4gIGdtLmFpQXR0YWNraW5nKGF0dGFja0Nvb3JkcywgZGVsYXkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWlBdHRhY2s7XG4iLCIvKiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgdGhlIGludGVsbGlnZW5jZSBvZiB0aGUgQUkgcGxheWVyLiBJdCB1c2VzIGEgMmQgYXJyYXkgb2YgaGl0IFxucHJvYmFiaWxpdGllcywgbWFkZSBhdmFpbGFibGUgdG8gYWlBdHRhY2ssIHRvIGRldGVybWluZSBhdHRhY2sgY29vcmRzIHdoZW4gdGhlIEFJIGlzIGluIFxuc2VlayBtb2RlLiBXaGVuIGEgbmV3IGhpdCBpcyBmb3VuZCBhbmQgdGhlIEFJIHN3aXRjaGVzIHRvIGRlc3Ryb3kgbW9kZSBhIGRpZmZlcmVudCBzZXQgb2Zcbm1ldGhvZHMgYXJlIHVzZWQgdG8gZGVzdHJveSBmb3VuZCBzaGlwcyBxdWlja2x5IGFuZCBsb2dpY2FsbHkuIFRoZXJlIGlzIGFsc28gYSBzZXQgb2YgbWV0aG9kc1xuZm9yIHVwZGF0aW5nIHRoZSBwcm9iYWJpbGl0aWVzIGluIHJlc3BvbnNlIHRvIGhpdHMgYW5kIHNoaXBzIGJlaW5nIHN1bmsgaW4gb3JkZXIgdG8gYmV0dGVyXG5kZXRlcm1pbmUgYXR0YWNrcyB3aGlsZSBpbiBkZXN0cm95IG1vZGUuICovXG5cbmltcG9ydCBjcmVhdGVQcm9icyBmcm9tIFwiLi9jcmVhdGVQcm9ic1wiO1xuXG5jb25zdCBhaUJyYWluID0gKCkgPT4ge1xuICAvLyBQcm9iYWJpbGl0eSBtb2RpZmllcnNcbiAgY29uc3QgY29sb3JNb2QgPSAwLjMzOyAvLyBTdHJvbmcgbmVnYXRpdmUgYmlhcyB1c2VkIHRvIGluaXRpYWxpemUgYWxsIHByb2JzXG4gIGNvbnN0IGFkamFjZW50TW9kID0gNDsgLy8gTWVkaXVtIHBvc2l0aXZlIGJpYXMgZm9yIGhpdCBhZGphY2VudCBhZGp1c3RtZW50c1xuXG4gIC8vIENyZWF0ZSB0aGUgcHJvYnNcbiAgY29uc3QgcHJvYnMgPSBjcmVhdGVQcm9icyhjb2xvck1vZCk7XG5cbiAgLy8gQ29weSB0aGUgaW5pdGlhbCBwcm9icyBmb3IgbGF0ZXIgdXNlXG4gIGNvbnN0IGluaXRpYWxQcm9icyA9IHByb2JzLm1hcCgocm93KSA9PiBbLi4ucm93XSk7XG5cbiAgLy8gI3JlZ2lvbiBHZW5lcmFsIHVzZSBoZWxwZXJzXG4gIC8vIEhlbHBlciB0aGF0IGNoZWNrcyBpZiB2YWxpZCBjZWxsIG9uIGdyaWRcbiAgZnVuY3Rpb24gaXNWYWxpZENlbGwocm93LCBjb2wpIHtcbiAgICAvLyBTZXQgcm93cyBhbmQgY29sc1xuICAgIGNvbnN0IG51bVJvd3MgPSBwcm9ic1swXS5sZW5ndGg7XG4gICAgY29uc3QgbnVtQ29scyA9IHByb2JzLmxlbmd0aDtcbiAgICByZXR1cm4gcm93ID49IDAgJiYgcm93IDwgbnVtUm93cyAmJiBjb2wgPj0gMCAmJiBjb2wgPCBudW1Db2xzO1xuICB9XG5cbiAgLy8gSGVscGVyIHRoYXQgY2hlY2tzIGlmIGNlbGwgaXMgYSBib3VuZGFyeSBvciBtaXNzICgtMSB2YWx1ZSlcbiAgZnVuY3Rpb24gaXNCb3VuZGFyeU9yTWlzcyhyb3csIGNvbCkge1xuICAgIHJldHVybiAhaXNWYWxpZENlbGwocm93LCBjb2wpIHx8IHByb2JzW3Jvd11bY29sXSA9PT0gLTE7XG4gIH1cblxuICAvLyBIZWxwZXJzIGZvciBnZXR0aW5nIHJlbWFpbmluZyBzaGlwIGxlbmd0aHNcbiAgY29uc3QgZ2V0TGFyZ2VzdFJlbWFpbmluZ0xlbmd0aCA9IChnbSkgPT4ge1xuICAgIC8vIExhcmdlc3Qgc2hpcCBsZW5ndGhcbiAgICBsZXQgbGFyZ2VzdFNoaXBMZW5ndGggPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSBPYmplY3Qua2V5cyhnbS51c2VyQm9hcmQuc3Vua2VuU2hpcHMpLmxlbmd0aDsgaSA+PSAxOyBpIC09IDEpIHtcbiAgICAgIGlmICghZ20udXNlckJvYXJkLnN1bmtlblNoaXBzW2ldKSB7XG4gICAgICAgIGxhcmdlc3RTaGlwTGVuZ3RoID0gaTtcbiAgICAgICAgbGFyZ2VzdFNoaXBMZW5ndGggPSBpID09PSAxID8gMiA6IGxhcmdlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBsYXJnZXN0U2hpcExlbmd0aCA9IGkgPT09IDIgPyAzIDogbGFyZ2VzdFNoaXBMZW5ndGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGFyZ2VzdFNoaXBMZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgZ2V0U21hbGxlc3RSZW1haW5pbmdMZW5ndGggPSAoZ20pID0+IHtcbiAgICBsZXQgc21hbGxlc3RTaGlwTGVuZ3RoID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGdtLnVzZXJCb2FyZC5zdW5rZW5TaGlwcykubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmICghZ20udXNlckJvYXJkLnN1bmtlblNoaXBzW2ldKSB7XG4gICAgICAgIHNtYWxsZXN0U2hpcExlbmd0aCA9IGkgPT09IDAgPyAyIDogc21hbGxlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBzbWFsbGVzdFNoaXBMZW5ndGggPSBpID09PSAxID8gMyA6IHNtYWxsZXN0U2hpcExlbmd0aDtcbiAgICAgICAgc21hbGxlc3RTaGlwTGVuZ3RoID0gaSA+IDEgPyBpIDogc21hbGxlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNtYWxsZXN0U2hpcExlbmd0aDtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBEZXN0b3J5IG1vZGUgbW92ZSBkZXRlcm1pbmF0aW9uXG5cbiAgLyogVGhlIGdlbmVyYWwgaWRlYSBoZXJlIGlzIHRvIGNhdXNlIHRoZSBBSSB0byBkbyB3aGF0IGh1bWFuIHBsYXllcnMgZG8gdXBvbiBmaW5kaW5nXG4gICAgYSBuZXcgc2hpcC4gVHlwaWNhbGx5IHdoZW4geW91IGZpbmQgYSBzaGlwIHlvdSBzdGFydCBhdHRhY2tpbmcgYWRqYWNlbnQgY2VsbHMgdG8gXG4gICAgZmluZCB0aGUgXCJuZXh0IHBhcnRcIiBvZiB0aGUgc2hpcCwgY2hhbmdpbmcgdG8gb3RoZXIgYWRqYWNlbnQgY2VsbHMgd2hlbiBmaW5kaW5nIGEgbWlzcyxcbiAgICBvciBnb2luZyBpbiB0aGUgb3RoZXIgZGlyZWN0aW9uIHdoZW4gYSBtaXMgaXMgZm91bmQgYWZ0ZXIgYSBoaXQsIGV0Yy5cbiAgICBcbiAgICBUaGlzIGlzIGFjY29tcGxpc2hlZCB1c2luZyBsaXN0cyBvZiBjZWxscyB0byBjaGVjayBhbmQgcmVjdXJzaXZlIGxvZ2ljIHRvIGtlZXAgY2hlY2tpbmdcbiAgICB0aGUgXCJuZXh0IGNlbGxcIiBhZnRlciBhbiBhZGphY2VudCBoaXQgaXMgZm91bmQsIGFzIHdlbGwgYXMgdG8gcmVjdXJzaXZlbHkga2VlcCBjaGVja2luZ1xuICAgIGlmIGEgc2hpcCBpcyBzdW5rLCBidXQgb3RoZXIgaGl0cyBleGlzdCB0aGF0IGFyZW4ndCBwYXJ0IG9mIHRoZSBzdW5rZW4gc2hpcCwgd2hpY2hcbiAgICBpbmRpY2F0ZXMgbW9yZSBzaGlwcyB0aGF0IGhhdmUgYmVlbiBkaXNjb3ZlcmVkIGJ1dCBub3QgeWV0IHN1bmsuICovXG5cbiAgLy8gSGVscGVyIGZvciBsb2FkaW5nIGFkamFjZW50IGNlbGxzIGludG8gYXBwcm9wcmlhdGUgYXJyYXlzXG4gIGNvbnN0IGxvYWRBZGphY2VudENlbGxzID0gKGNlbnRlckNlbGwsIGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzLCBnbSkgPT4ge1xuICAgIC8vIENlbnRlciBDZWxsIHggYW5kIHlcbiAgICBjb25zdCBbY2VudGVyWCwgY2VudGVyWV0gPSBjZW50ZXJDZWxsO1xuICAgIC8vIEFkamFjZW50IHZhbHVlcyByb3cgZmlyc3QsIHRoZW4gY29sXG4gICAgY29uc3QgdG9wID0gW2NlbnRlclkgLSAxLCBjZW50ZXJYLCBcInRvcFwiXTtcbiAgICBjb25zdCBib3R0b20gPSBbY2VudGVyWSArIDEsIGNlbnRlclgsIFwiYm90dG9tXCJdO1xuICAgIGNvbnN0IGxlZnQgPSBbY2VudGVyWSwgY2VudGVyWCAtIDEsIFwibGVmdFwiXTtcbiAgICBjb25zdCByaWdodCA9IFtjZW50ZXJZLCBjZW50ZXJYICsgMSwgXCJyaWdodFwiXTtcblxuICAgIC8vIEZuIHRoYXQgY2hlY2tzIHRoZSBjZWxscyBhbmQgYWRkcyB0aGVtIHRvIGFycmF5c1xuICAgIGZ1bmN0aW9uIGNoZWNrQ2VsbChjZWxsWSwgY2VsbFgsIGRpcmVjdGlvbikge1xuICAgICAgaWYgKGlzVmFsaWRDZWxsKGNlbGxZLCBjZWxsWCkpIHtcbiAgICAgICAgLy8gSWYgaGl0IGFuZCBub3Qgb2NjdXBpZWQgYnkgc3Vua2VuIHNoaXAgYWRkIHRvIGhpdHNcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByb2JzW2NlbGxYXVtjZWxsWV0gPT09IDAgJiZcbiAgICAgICAgICAhZ20udXNlckJvYXJkLmlzQ2VsbFN1bmsoW2NlbGxYLCBjZWxsWV0pXG4gICAgICAgICkge1xuICAgICAgICAgIGFkamFjZW50SGl0cy5wdXNoKFtjZWxsWCwgY2VsbFksIGRpcmVjdGlvbl0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGVtcHR5IGFkZCB0byBlbXBpdGVzXG4gICAgICAgIGVsc2UgaWYgKHByb2JzW2NlbGxYXVtjZWxsWV0gPiAwKSB7XG4gICAgICAgICAgYWRqYWNlbnRFbXB0aWVzLnB1c2goW2NlbGxYLCBjZWxsWSwgZGlyZWN0aW9uXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0NlbGwoLi4udG9wKTtcbiAgICBjaGVja0NlbGwoLi4uYm90dG9tKTtcbiAgICBjaGVja0NlbGwoLi4ubGVmdCk7XG4gICAgY2hlY2tDZWxsKC4uLnJpZ2h0KTtcbiAgfTtcblxuICAvLyBIZWxwZXIgdGhhdCByZXR1cm5zIGhpZ2hlc3QgcHJvYiBhZGphY2VudCBlbXB0eVxuICBjb25zdCByZXR1cm5CZXN0QWRqYWNlbnRFbXB0eSA9IChhZGphY2VudEVtcHRpZXMpID0+IHtcbiAgICBsZXQgYXR0YWNrQ29vcmRzID0gbnVsbDtcbiAgICAvLyBDaGVjayBlYWNoIGVtcHR5IGNlbGwgYW5kIHJldHVybiB0aGUgbW9zdCBsaWtlbHkgaGl0IGJhc2VkIG9uIHByb2JzXG4gICAgbGV0IG1heFZhbHVlID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRFbXB0aWVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBhZGphY2VudEVtcHRpZXNbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2JzW3hdW3ldO1xuICAgICAgLy8gVXBkYXRlIG1heFZhbHVlIGlmIGZvdW5kIHZhbHVlIGJpZ2dlciwgYWxvbmcgd2l0aCBhdHRhY2sgY29vcmRzXG4gICAgICBpZiAodmFsdWUgPiBtYXhWYWx1ZSkge1xuICAgICAgICBtYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBhdHRhY2tDb29yZHMgPSBbeCwgeV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRhY2tDb29yZHM7XG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgaGFuZGxpbmcgYWRqYWNlbnQgaGl0cyByZWN1cnNpdmVseVxuICBjb25zdCBoYW5kbGVBZGphY2VudEhpdCA9IChcbiAgICBnbSxcbiAgICBhZGphY2VudEhpdHMsXG4gICAgYWRqYWNlbnRFbXB0aWVzLFxuICAgIGNlbGxDb3VudCA9IDBcbiAgKSA9PiB7XG4gICAgLy8gSW5jcmVtZW50IGNlbGwgY291bnRcbiAgICBsZXQgdGhpc0NvdW50ID0gY2VsbENvdW50ICsgMTtcblxuICAgIC8vIEJpZ2dlc3Qgc2hpcCBsZW5ndGhcbiAgICBjb25zdCBsYXJnZXN0U2hpcExlbmd0aCA9IGdldExhcmdlc3RSZW1haW5pbmdMZW5ndGgoZ20pO1xuXG4gICAgLy8gSWYgdGhpc0NvdW50IGlzIGJpZ2dlciB0aGFuIHRoZSBiaWdnZXN0IHBvc3NpYmxlIGxpbmUgb2Ygc2hpcHNcbiAgICBpZiAodGhpc0NvdW50ID4gbGFyZ2VzdFNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgYWRqYWNlbnQgaGl0IHRvIGNvbnNpZGVyXG4gICAgY29uc3QgaGl0ID0gYWRqYWNlbnRIaXRzWzBdO1xuICAgIGNvbnN0IFtoaXRYLCBoaXRZLCBkaXJlY3Rpb25dID0gaGl0O1xuXG4gICAgLy8gVGhlIG5leHQgY2VsbCBpbiB0aGUgc2FtZSBkaXJlY3Rpb25cbiAgICBsZXQgbmV4dENlbGwgPSBudWxsO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwidG9wXCIpIG5leHRDZWxsID0gW2hpdFgsIGhpdFkgLSAxXTtcbiAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwiYm90dG9tXCIpIG5leHRDZWxsID0gW2hpdFgsIGhpdFkgKyAxXTtcbiAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwibGVmdFwiKSBuZXh0Q2VsbCA9IFtoaXRYIC0gMSwgaGl0WV07XG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIG5leHRDZWxsID0gW2hpdFggKyAxLCBoaXRZXTtcbiAgICBjb25zdCBbbmV4dFgsIG5leHRZXSA9IG5leHRDZWxsO1xuXG4gICAgLy8gUmVmIHRvIGZvdW5kIGVtcHR5IGNlbGxcbiAgICBsZXQgZm91bmRFbXB0eSA9IG51bGw7XG5cbiAgICAvLyBJZiBjZWxsIGNvdW50IGlzIG5vdCBsYXJnZXIgdGhhbiB0aGUgYmlnZ2VzdCByZW1haW5pbmcgc2hpcFxuICAgIGNvbnN0IGNoZWNrTmV4dENlbGwgPSAoblgsIG5ZKSA9PiB7XG4gICAgICBpZiAodGhpc0NvdW50IDw9IGxhcmdlc3RTaGlwTGVuZ3RoKSB7XG4gICAgICAgIC8vIElmIG5leHQgY2VsbCBpcyBhIG1pc3Mgc3RvcCBjaGVja2luZyBpbiB0aGlzIGRpcmVjdGlvbiBieSByZW1vdmluZyB0aGUgYWRqYWNlbnRIaXRcbiAgICAgICAgaWYgKHByb2JzW25YXVtuWV0gPT09IC0xIHx8ICFpc1ZhbGlkQ2VsbChuWSwgblgpKSB7XG4gICAgICAgICAgYWRqYWNlbnRIaXRzLnNoaWZ0KCk7XG4gICAgICAgICAgLy8gVGhlbiBpZiBhZGphY2VudCBoaXRzIGlzbid0IGVtcHR5IHRyeSB0byBoYW5kbGUgdGhlIG5leHQgYWRqYWNlbnQgaGl0XG4gICAgICAgICAgaWYgKGFkamFjZW50SGl0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3VuZEVtcHR5ID0gaGFuZGxlQWRqYWNlbnRIaXQoZ20sIGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRWxzZSBpZiBpdCBpcyBlbXB0eSB0cnkgdG8gcmV0dXJuIHRoZSBiZXN0IGFkamFjZW50IGVtcHR5IGNlbGxcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvdW5kRW1wdHkgPSByZXR1cm5CZXN0QWRqYWNlbnRFbXB0eShhZGphY2VudEVtcHRpZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgY2VsbCBpcyBhIGhpdFxuICAgICAgICBlbHNlIGlmIChwcm9ic1tuWF1bblldID09PSAwKSB7XG4gICAgICAgICAgLy8gSW5jcmVtZW50IHRoZSBjZWxsIGNvdW50XG4gICAgICAgICAgdGhpc0NvdW50ICs9IDE7XG4gICAgICAgICAgLy8gTmV3IG5leHQgY2VsbCByZWZcbiAgICAgICAgICBsZXQgbmV3TmV4dCA9IG51bGw7XG4gICAgICAgICAgLy8gSW5jcmVtZW50IHRoZSBuZXh0Q2VsbCBpbiB0aGUgc2FtZSBkaXJlY3Rpb24gYXMgYWRqYWNlbnQgaGl0IGJlaW5nIGNoZWNrZWRcbiAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBcInRvcFwiKSBuZXdOZXh0ID0gW25YLCBuWSAtIDFdO1xuICAgICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJib3R0b21cIikgbmV3TmV4dCA9IFtuWCwgblkgKyAxXTtcbiAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwibGVmdFwiKSBuZXdOZXh0ID0gW25YIC0gMSwgblldO1xuICAgICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSBuZXdOZXh0ID0gW25YICsgMSwgblldO1xuICAgICAgICAgIC8vIFNldCBuZXh0WCBhbmQgbmV4dFkgdG8gdGhlIGNvb3JkcyBvZiB0aGlzIGluY3JlbWVudGVkIG5leHQgY2VsbFxuICAgICAgICAgIGNvbnN0IFtuZXdYLCBuZXdZXSA9IG5ld05leHQ7XG4gICAgICAgICAgLy8gUmVjdXJzaXZlbHkgY2hlY2sgdGhlIG5leHQgY2VsbFxuICAgICAgICAgIGNoZWNrTmV4dENlbGwobmV3WCwgbmV3WSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIGNlbGwgaXMgZW1wdHkgYW5kIHZhbGlkXG4gICAgICAgIGVsc2UgaWYgKGlzVmFsaWRDZWxsKG5ZLCBuWCkgJiYgcHJvYnNbblhdW25ZXSA+IDApIHtcbiAgICAgICAgICBmb3VuZEVtcHR5ID0gW25YLCBuWV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSW5pdGlhbCBjYWxsIHRvIGFib3ZlIHJlY3Vyc2l2ZSBoZWxwZXJcbiAgICBpZiAodGhpc0NvdW50IDw9IGxhcmdlc3RTaGlwTGVuZ3RoKSB7XG4gICAgICBjaGVja05leHRDZWxsKG5leHRYLCBuZXh0WSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvdW5kRW1wdHk7XG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgY2hlY2tpbmcgdGhlIGFkamFjZW50IGhpdHMgZm9yIG5lYXJieSBlbXB0aWVzXG4gIGNvbnN0IGNoZWNrQWRqYWNlbnRDZWxscyA9IChhZGphY2VudEhpdHMsIGFkamFjZW50RW1wdGllcywgZ20pID0+IHtcbiAgICAvLyBWYXJpYWJsZSBmb3IgY29vcmRpYXRlcyB0byByZXR1cm5cbiAgICBsZXQgYXR0YWNrQ29vcmRzID0gbnVsbDtcblxuICAgIC8vIElmIG5vIGhpdHMgdGhlbiBzZXQgYXR0YWNrQ29vcmRzIHRvIGFuIGVtcHR5IGNlbGwgaWYgb25lIGV4aXN0c1xuICAgIGlmIChhZGphY2VudEhpdHMubGVuZ3RoID09PSAwICYmIGFkamFjZW50RW1wdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBhdHRhY2tDb29yZHMgPSByZXR1cm5CZXN0QWRqYWNlbnRFbXB0eShhZGphY2VudEVtcHRpZXMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBoaXRzIHRoZW4gaGFuZGxlIGNoZWNraW5nIGNlbGxzIGFmdGVyIHRoZW0gdG8gZmluZCBlbXB0eSBmb3IgYXR0YWNrXG4gICAgaWYgKGFkamFjZW50SGl0cy5sZW5ndGggPiAwKSB7XG4gICAgICBhdHRhY2tDb29yZHMgPSBoYW5kbGVBZGphY2VudEhpdChnbSwgYWRqYWNlbnRIaXRzLCBhZGphY2VudEVtcHRpZXMpO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRhY2tDb29yZHM7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBkZXN0cnlpbmcgZm91bmQgc2hpcHNcbiAgY29uc3QgZGVzdHJveU1vZGVDb29yZHMgPSAoZ20pID0+IHtcbiAgICAvLyBMb29rIGF0IGZpcnN0IGNlbGwgdG8gY2hlY2sgd2hpY2ggd2lsbCBiZSB0aGUgb2xkZXN0IGFkZGVkIGNlbGxcbiAgICBjb25zdCBjZWxsVG9DaGVjayA9IGdtLmFpQm9hcmQuY2VsbHNUb0NoZWNrWzBdO1xuXG4gICAgLy8gUHV0IGFsbCBhZGphY2VudCBjZWxscyBpbiBhZGphY2VudEVtcHRpZXMvYWRqYWNlbnRIaXRzXG4gICAgY29uc3QgYWRqYWNlbnRIaXRzID0gW107XG4gICAgY29uc3QgYWRqYWNlbnRFbXB0aWVzID0gW107XG4gICAgbG9hZEFkamFjZW50Q2VsbHMoY2VsbFRvQ2hlY2ssIGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzLCBnbSk7XG5cbiAgICBjb25zdCBhdHRhY2tDb29yZHMgPSBjaGVja0FkamFjZW50Q2VsbHMoYWRqYWNlbnRIaXRzLCBhZGphY2VudEVtcHRpZXMsIGdtKTtcblxuICAgIC8vIElmIGFqZGFjZW50RW1wdGllcyBhbmQgYWRqYWNlbnRIaXRzIGFyZSBib3RoIGVtcHR5IGFuZCBhdHRhY2sgY29vcmRzIG51bGxcbiAgICBpZiAoXG4gICAgICBhdHRhY2tDb29yZHMgPT09IG51bGwgJiZcbiAgICAgIGFkamFjZW50SGl0cy5sZW5ndGggPT09IDAgJiZcbiAgICAgIGFkamFjZW50RW1wdGllcy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZmlyc3QgZW50cnkgb2YgY2VsbHMgdG8gY2hlY2tcbiAgICAgIGdtLmFpQm9hcmQuY2VsbHNUb0NoZWNrLnNoaWZ0KCk7XG4gICAgICAvLyBJZiBjZWxscyByZW1haW4gdG8gYmUgY2hlY2tlZFxuICAgICAgaWYgKGdtLmFpQm9hcmQuY2VsbHNUb0NoZWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gVHJ5IHVzaW5nIHRoZSBuZXh0IGNlbGwgdG8gY2hlY2sgZm9yIGRlc3Ryb3lNb2RlQ29vcmRzXG4gICAgICAgIGRlc3Ryb3lNb2RlQ29vcmRzKGdtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgRGVzdHJveSB0YXJnZXQgZm91bmQhICR7YXR0YWNrQ29vcmRzfWApO1xuICAgIHJldHVybiBhdHRhY2tDb29yZHM7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gTWV0aG9kcyBmb3IgdXBkYXRpbmcgcHJvYnMgb24gaGl0IGFuZCBtaXNzXG5cbiAgLyogV2hlbiBhIGhpdCBpcyBmaXJzdCBkaXNjb3ZlcmVkLCBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBjZWxscyBnZXQgYSBzdGFja2luZyxcbiAgICB0ZW1wb3Jhcml5IHByb2JhYmlsaXR5IGluY3JlYXNlLiBUaGlzIGlzIHRvIGhlbHAgZGlyZWN0IHRoZSBkZXN0cm95IHByb2Nlc3MgdG9cbiAgICBjaG9vc2UgdGhlIGJlc3QgY2VsbHMgd2hpbGUgZGVzdHJveWluZywgZm9yIGV4YW1wbGUgb25seSBhdHRhY2tpbmcgZW1wdHkgY2VsbHNcbiAgICBpbiB0aGUgc2FtZSBkaXJlY3Rpb24gYXMgdGhlIGxpa2VseSBzaGlwIHBsYWNlbWVudC5cbiAgICBcbiAgICBBZnRlciBhbGwgY3VycmVudGx5IGRpc2NvdmVyZWQgc2hpcHMgYXJlIGRlc3Ryb3llZCwgdGhlIHByb2JhYmlsaXRpZXMgb2YgcmVtYWluaW5nXG4gICAgZW1wdHkgY2VsbHMgYXJlIGJyb3VnaHQgYmFjayB0byB0aGVpciBpbml0aWFsIHZhbHVlcyBzbyBhcyB0byBub3QgZGlzcnVwdCB0aGUgb3B0aW1hbFxuICAgIHNlZWtpbmcgcHJvY2VzcyB3aGVuIGxvb2tpbmcgZm9yIHRoZSBuZXh0IHNoaXAuICovXG5cbiAgLy8gUmVjb3JkcyB3aWNoIGNlbGxzIHdlcmUgYWx0ZXJlZCB3aXRoIGhpZEFkamFjZW50SW5jcmVhc2VcbiAgY29uc3QgaW5jcmVhc2VkQWRqYWNlbnRDZWxscyA9IFtdO1xuICAvLyBJbmNyZWFzZSBhZGphY2VudCBjZWxscyB0byBuZXcgaGl0c1xuICBjb25zdCBoaXRBZGphY2VudEluY3JlYXNlID0gKGhpdFgsIGhpdFksIGxhcmdlc3RMZW5ndGgpID0+IHtcbiAgICAvLyBWYXJzIGZvciBjYWxjdWxhdGluZyBkZWNyZW1lbnQgZmFjdG9yXG4gICAgY29uc3Qgc3RhcnRpbmdEZWMgPSAxO1xuICAgIGNvbnN0IGRlY1BlcmNlbnRhZ2UgPSAwLjE7XG4gICAgY29uc3QgbWluRGVjID0gMC41O1xuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBjZWxscyBhbmQgdXBkYXRlIHRoZW1cbiAgICAvLyBOb3J0aFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFyZ2VzdExlbmd0aDsgaSArPSAxKSB7XG4gICAgICBsZXQgZGVjcmVtZW50RmFjdG9yID0gc3RhcnRpbmdEZWMgLSBpICogZGVjUGVyY2VudGFnZTtcbiAgICAgIGlmIChkZWNyZW1lbnRGYWN0b3IgPCBtaW5EZWMpIGRlY3JlbWVudEZhY3RvciA9IG1pbkRlYztcbiAgICAgIC8vIE5vcnRoIGlmIG9uIGJvYXJkXG4gICAgICBpZiAoaGl0WSAtIGkgPj0gMCkge1xuICAgICAgICAvLyBJbmNyZWFzZSB0aGUgcHJvYmFiaWxpdHlcbiAgICAgICAgcHJvYnNbaGl0WF1baGl0WSAtIGldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgICAvLyBSZWNvcmQgdGhlIGNlbGwgdG8gaW5jcmVhc2VkIGFkamFjZW50IGNlbGxzIGZvciBsYXRlciB1c2VcbiAgICAgICAgaW5jcmVhc2VkQWRqYWNlbnRDZWxscy5wdXNoKFtoaXRYLCBoaXRZIC0gaV0pO1xuICAgICAgfVxuICAgICAgLy8gU291dGggaWYgb24gYm9hcmRcbiAgICAgIGlmIChoaXRZICsgaSA8PSA5KSB7XG4gICAgICAgIHByb2JzW2hpdFhdW2hpdFkgKyBpXSAqPSBhZGphY2VudE1vZCAqIGRlY3JlbWVudEZhY3RvcjtcbiAgICAgICAgaW5jcmVhc2VkQWRqYWNlbnRDZWxscy5wdXNoKFtoaXRYLCBoaXRZICsgaV0pO1xuICAgICAgfVxuICAgICAgLy8gV2VzdCBpZiBvbiBib2FyZFxuICAgICAgaWYgKGhpdFggLSBpID49IDApIHtcbiAgICAgICAgcHJvYnNbaGl0WCAtIGldW2hpdFldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgICBpbmNyZWFzZWRBZGphY2VudENlbGxzLnB1c2goW2hpdFggLSBpLCBoaXRZXSk7XG4gICAgICB9XG4gICAgICAvLyBFYXN0IGlmIG9uIGJvYXJkXG4gICAgICBpZiAoaGl0WCArIGkgPD0gOSkge1xuICAgICAgICBwcm9ic1toaXRYICsgaV1baGl0WV0gKj0gYWRqYWNlbnRNb2QgKiBkZWNyZW1lbnRGYWN0b3I7XG4gICAgICAgIGluY3JlYXNlZEFkamFjZW50Q2VsbHMucHVzaChbaGl0WCArIGksIGhpdFldKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVzZXRIaXRBZGphY2VudEluY3JlYXNlcyA9ICgpID0+IHtcbiAgICAvLyBJZiBsaXN0IGVtcHR5IHRoZW4ganVzdCByZXR1cm5cbiAgICBpZiAoaW5jcmVhc2VkQWRqYWNlbnRDZWxscy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAvLyBJZiB0aGUgdmFsdWVzIGluIHRoZSBsaXN0IGFyZSBzdGlsbCBlbXB0eVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5jcmVhc2VkQWRqYWNlbnRDZWxscy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgW3gsIHldID0gaW5jcmVhc2VkQWRqYWNlbnRDZWxsc1tpXTtcbiAgICAgIGlmIChwcm9ic1t4XVt5XSA+IDApIHtcbiAgICAgICAgLy8gUmUtaW5pdGlhbGl6ZSB0aGVpciBwcm9iIHZhbHVlXG4gICAgICAgIHByb2JzW3hdW3ldID0gaW5pdGlhbFByb2JzW3hdW3ldO1xuICAgICAgICAvLyBBbmQgcmVtb3ZlIHRoZW0gZnJvbSB0aGUgbGlzdFxuICAgICAgICBpbmNyZWFzZWRBZGphY2VudENlbGxzLnNwbGljZShpLCAxKTtcbiAgICAgICAgLy8gUmVzZXQgdGhlIGl0ZXJhdG9yXG4gICAgICAgIGkgPSAtMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tEZWFkQ2VsbHMgPSAoKSA9PiB7XG4gICAgLy8gU2V0IHJvd3MgYW5kIGNvbHNcbiAgICBjb25zdCBudW1Sb3dzID0gcHJvYnNbMF0ubGVuZ3RoO1xuICAgIGNvbnN0IG51bUNvbHMgPSBwcm9icy5sZW5ndGg7XG5cbiAgICAvLyBGb3IgZXZlcnkgY2VsbCwgY2hlY2sgdGhlIGNlbGxzIGFyb3VuZCBpdC4gSWYgdGhleSBhcmUgYWxsIGJvdW5kYXJ5IG9yIG1pc3MgdGhlbiBzZXQgdG8gLTFcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBudW1Sb3dzOyByb3cgKz0gMSkge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbnVtQ29sczsgY29sICs9IDEpIHtcbiAgICAgICAgLy8gSWYgdGhlIGNlbGwgaXMgYW4gZW1wdHkgY2VsbCAoPiAwKSBhbmQgYWRqYWNlbnQgY2VsbHMgYXJlIGJvdW5kYXJ5IG9yIG1pc3NcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByb2JzW3Jvd11bY29sXSA+IDAgJiZcbiAgICAgICAgICBpc0JvdW5kYXJ5T3JNaXNzKHJvdywgY29sIC0gMSkgJiZcbiAgICAgICAgICBpc0JvdW5kYXJ5T3JNaXNzKHJvdywgY29sICsgMSkgJiZcbiAgICAgICAgICBpc0JvdW5kYXJ5T3JNaXNzKHJvdyAtIDEsIGNvbCkgJiZcbiAgICAgICAgICBpc0JvdW5kYXJ5T3JNaXNzKHJvdyArIDEsIGNvbClcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gU2V0IHRoYXQgY2VsbCB0byBhIG1pc3Mgc2luY2UgaXQgY2Fubm90IGJlIGEgaGl0XG4gICAgICAgICAgcHJvYnNbcm93XVtjb2xdID0gLTE7XG4gICAgICAgICAgLyogY29uc29sZS5sb2coXG4gICAgICAgICAgICBgJHtyb3d9LCAke2NvbH0gc3Vycm91bmRlZCBhbmQgY2Fubm90IGJlIGEgaGl0LiBTZXQgdG8gbWlzcy5gXG4gICAgICAgICAgKTsgKi9cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCB1cGRhdGVzIHByb2JhYmlsaXRpZXMgYmFzZWQgb24gaGl0cywgbWlzc2VzLCBhbmQgcmVtYWluaW5nIHNoaXBzJyBsZW5ndGhzXG4gIGNvbnN0IHVwZGF0ZVByb2JzID0gKGdtKSA9PiB7XG4gICAgLy8gVGhlc2UgdmFsdWVzIGFyZSB1c2VkIGFzIHRoZSBldmlkZW5jZSB0byB1cGRhdGUgdGhlIHByb2JhYmlsaXRpZXMgb24gdGhlIHByb2JzXG4gICAgY29uc3QgeyBoaXRzLCBtaXNzZXMgfSA9IGdtLnVzZXJCb2FyZDtcblxuICAgIC8vIExhcmdlc3Qgc2hpcCBsZW5ndGhcbiAgICBjb25zdCBsYXJnZXN0U2hpcExlbmd0aCA9IGdldExhcmdlc3RSZW1haW5pbmdMZW5ndGgoZ20pO1xuICAgIC8vIFNtYWxsZXN0IHNoaXAgbGVuZ3RoXG4gICAgY29uc3Qgc21hbGxlc3RTaGlwTGVuZ3RoID0gZ2V0U21hbGxlc3RSZW1haW5pbmdMZW5ndGgoZ20pO1xuXG4gICAgLy8gVXBkYXRlIHZhbHVlcyBiYXNlZCBvbiBoaXRzXG4gICAgT2JqZWN0LnZhbHVlcyhoaXRzKS5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGhpdDtcbiAgICAgIC8vIElmIHRoZSBoaXQgaXMgbmV3LCBhbmQgdGhlcmVmb3JlIHRoZSBwcm9iIGZvciB0aGF0IGhpdCBpcyBub3QgeWV0IDBcbiAgICAgIGlmIChwcm9ic1t4XVt5XSAhPT0gMCkge1xuICAgICAgICAvLyBBcHBseSB0aGUgaW5jcmVhc2UgdG8gYWRqYWNlbnQgY2VsbHMuIFRoaXMgd2lsbCBiZSByZWR1Y2VkIHRvIGluaXRhbCBwcm9icyBvbiBzZWVrIG1vZGUuXG4gICAgICAgIGhpdEFkamFjZW50SW5jcmVhc2UoeCwgeSwgbGFyZ2VzdFNoaXBMZW5ndGgpO1xuICAgICAgICAvLyBTZXQgdGhlIHByb2JhYmlsaXR5IG9mIHRoZSBoaXQgdG8gMFxuICAgICAgICBwcm9ic1t4XVt5XSA9IDA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdmFsdWVzIGJhc2VkIG9uIG1pc3Nlc1xuICAgIE9iamVjdC52YWx1ZXMobWlzc2VzKS5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBtaXNzO1xuICAgICAgLy8gU2V0IHRoZSBwcm9iYWJpbGl0eSBvZiBldmVyeSBtaXNzIHRvIDAgdG8gcHJldmVudCB0aGF0IGNlbGwgZnJvbSBiZWluZyB0YXJnZXRlZFxuICAgICAgcHJvYnNbeF1beV0gPSAtMTtcbiAgICB9KTtcblxuICAgIC8qIFJlZHVjZSB0aGUgY2hhbmNlIG9mIGdyb3VwcyBvZiBjZWxscyB0aGF0IGFyZSBzdXJyb3VuZGVkIGJ5IG1pc3NlcyBvciB0aGUgZWRnZSBvZiB0aGUgYm9hcmQgXG4gICAgICBpZiB0aGUgZ3JvdXAgbGVuZ3RoIGlzIG5vdCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIGdyZWF0ZXN0IHJlbWFpbmluZyBzaGlwIGxlbmd0aC4gKi9cbiAgICBjaGVja0RlYWRDZWxscyhzbWFsbGVzdFNoaXBMZW5ndGgpO1xuXG4gICAgLy8gT3B0aW9uYWxseSBsb2cgdGhlIHJlc3VsdHNcbiAgICAvLyBsb2dQcm9icyhwcm9icyk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gTWV0aG9kIGFuZCBoZWxwZXIgZm9yIGxvZ2dpbmcgcHJvYnNcbiAgLy8gSGVscGVyIHRvIHRyYW5zcG9zZSBhcnJheSBmb3IgY29uc29sZS50YWJsZSdzIGFubm95aW5nIGNvbCBmaXJzdCBhcHByb2FjaFxuICBjb25zdCB0cmFuc3Bvc2VBcnJheSA9IChhcnJheSkgPT5cbiAgICBhcnJheVswXS5tYXAoKF8sIGNvbEluZGV4KSA9PiBhcnJheS5tYXAoKHJvdykgPT4gcm93W2NvbEluZGV4XSkpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgY29uc3QgbG9nUHJvYnMgPSAocHJvYnNUb0xvZykgPT4ge1xuICAgIC8vIExvZyB0aGUgcHJvYnNcbiAgICBjb25zdCB0cmFuc3Bvc2VkUHJvYnMgPSB0cmFuc3Bvc2VBcnJheShwcm9ic1RvTG9nKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUudGFibGUodHJhbnNwb3NlZFByb2JzKTtcbiAgICAvLyBMb2cgdGhlIHRvYWwgb2YgYWxsIHByb2JzXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIHByb2JzVG9Mb2cucmVkdWNlKFxuICAgICAgICAoc3VtLCByb3cpID0+IHN1bSArIHJvdy5yZWR1Y2UoKHJvd1N1bSwgdmFsdWUpID0+IHJvd1N1bSArIHZhbHVlLCAwKSxcbiAgICAgICAgMFxuICAgICAgKVxuICAgICk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIHJldHVybiB7XG4gICAgdXBkYXRlUHJvYnMsXG4gICAgcmVzZXRIaXRBZGphY2VudEluY3JlYXNlcyxcbiAgICBkZXN0cm95TW9kZUNvb3JkcyxcbiAgICBwcm9icyxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFpQnJhaW47XG4iLCIvKiBUaGlzIG1vZHVsZSBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgaW5pdGlhbCBwcm9iYWJpbGl0eSBhcnJheSBmb3IgYWlCcmFpbi5cbiAgSXQgZG9lcyB0aGlzIGJ5IGZpcnN0IGluaXRpYWxpemluZyB0aGUgcHJvYmFiaWxpdGVzIHdpdGggYSBiaWFzIHRvd2FyZHMgY2VudHJhbFxuICBjZWxscywgYW5kIHRoZW4gZnVydGhlciBhZGp1c3RzIHRoZXNlIGluaXRpYWwgd2VpZ2h0cyB0byBjcmVhdGUgYSBcImNoZXNzIGJvYXJkXCIgXG4gIHBhdHRlcm4gb2YgY2VsbHMgdGhhdCBoYXZlIG11Y2ggaGlnaGVyIGFuZCBtdWNoIGxvd2VyIHByaW9yaXRpZXMsIGF0IHJhbmRvbS4gU28gZm9yXG4gIGV4YW1wbGUsIGluIG9uZSBnYW1lIFwid2hpdGVcIiBjZWxscyBtaWdodCBiZSBoZWF2aWx5IHdlaWdodGVkIGNvbXBhcmVkIHRvIFwiYmxhY2tcIiBjZWxscy5cbiAgXG4gIFRoZSByZWFzb25pbmcgZm9yIGRvaW5nIGJvdGggb2YgdGhlc2UgdGhpbmdzIGlzIGV4cGxhaW5lZCBoZXJlOiBcbiAgaHR0cHM6Ly9ibG9ncy5nbG93c2NvdGxhbmQub3JnLnVrL2dsb3dibG9ncy9uam9sZGZpZWxkZXBvcnRmb2xpbzEvMjAxNS8xMi8wMS9tYXRoZW1hdGljcy1iZWhpbmQtYmF0dGxlc2hpcC8gXG4gIFxuICBJbiBhIG51dHNoZWxsLCBjaGVja2VyYm9hcmQgYmVjYXVzZSBhbGwgYm9hdHMgYXJlIGF0IGxlYXN0IDIgc3BhY2VzIGxvbmcsIHNvIHlvdSBjYW4gaWdub3JlIGV2ZXJ5XG4gIG90aGVyIHNwYWNlIHdoaWxlIHNlZWtpbmcgYSBuZXcgc2hpcC4gQ2VudHJhbCBiaWFzIGR1ZSB0byB0aGUgbmF0dXJlIG9mIGhvdyBzaGlwcyB0YWtlIHVwXG4gIHNwYWNlIG9uIHRoZSBib2FyZC4gQ29ybmVycyB3aWxsIGFsd2F5cyBiZSB0aGUgbGVhc3QgbGlrZWx5IHRvIGhhdmUgYSBzaGlwLCBjZW50cmFsIHRoZSBoaWdoZXN0LiAqL1xuXG4vLyBIZWxwZXIgbWV0aG9kIGZvciBub3JtYWxpemluZyB0aGUgcHJvYmFiaWxpdGllc1xuY29uc3Qgbm9ybWFsaXplUHJvYnMgPSAocHJvYnMpID0+IHtcbiAgbGV0IHN1bSA9IDA7XG5cbiAgLy8gQ2FsY3VsYXRlIHRoZSBzdW0gb2YgcHJvYmFiaWxpdGllcyBpbiB0aGUgcHJvYnNcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcHJvYnMubGVuZ3RoOyByb3cgKz0gMSkge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHByb2JzW3Jvd10ubGVuZ3RoOyBjb2wgKz0gMSkge1xuICAgICAgc3VtICs9IHByb2JzW3Jvd11bY29sXTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3JtYWxpemUgdGhlIHByb2JhYmlsaXRpZXNcbiAgY29uc3Qgbm9ybWFsaXplZFByb2JzID0gW107XG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHByb2JzLmxlbmd0aDsgcm93ICs9IDEpIHtcbiAgICBub3JtYWxpemVkUHJvYnNbcm93XSA9IFtdO1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHByb2JzW3Jvd10ubGVuZ3RoOyBjb2wgKz0gMSkge1xuICAgICAgbm9ybWFsaXplZFByb2JzW3Jvd11bY29sXSA9IHByb2JzW3Jvd11bY29sXSAvIHN1bTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9ybWFsaXplZFByb2JzO1xufTtcblxuLy8gTWV0aG9kIHRoYXQgY3JlYXRlcyBwcm9icyBhbmQgZGVmaW5lcyBpbml0aWFsIHByb2JhYmlsaXRpZXNcbmNvbnN0IGNyZWF0ZVByb2JzID0gKGNvbG9yTW9kKSA9PiB7XG4gIC8vIENyZWF0ZSB0aGUgcHJvYnMuIEl0IGlzIGEgMTB4MTAgZ3JpZCBvZiBjZWxscy5cbiAgY29uc3QgaW5pdGlhbFByb2JzID0gW107XG5cbiAgLy8gUmFuZG9tbHkgZGVjaWRlIHdoaWNoIFwiY29sb3JcIiBvbiB0aGUgcHJvYnMgdG8gZmF2b3IgYnkgcmFuZG9tbHkgaW5pdGlhbGl6aW5nIGNvbG9yIHdlaWdodFxuICBjb25zdCBpbml0aWFsQ29sb3JXZWlnaHQgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IGNvbG9yTW9kO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlIHByb2JzIHdpdGggMCdzXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgIGluaXRpYWxQcm9icy5wdXNoKEFycmF5KDEwKS5maWxsKDApKTtcbiAgfVxuXG4gIC8vIEFzc2lnbiBpbml0aWFsIHByb2JhYmlsaXRpZXMgYmFzZWQgb24gQWxlbWkncyB0aGVvcnkgKDAuMDggaW4gY29ybmVycywgMC4yIGluIDQgY2VudGVyIGNlbGxzKVxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93ICs9IDEpIHtcbiAgICAvLyBPbiBldmVuIHJvd3Mgc3RhcnQgd2l0aCBhbHRlcm5hdGUgY29sb3Igd2VpZ2h0XG4gICAgbGV0IGNvbG9yV2VpZ2h0ID0gaW5pdGlhbENvbG9yV2VpZ2h0O1xuICAgIGlmIChyb3cgJSAyID09PSAwKSB7XG4gICAgICBjb2xvcldlaWdodCA9IGluaXRpYWxDb2xvcldlaWdodCA9PT0gMSA/IGNvbG9yTW9kIDogMTtcbiAgICB9XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCArPSAxKSB7XG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlclxuICAgICAgY29uc3QgY2VudGVyWCA9IDQuNTtcbiAgICAgIGNvbnN0IGNlbnRlclkgPSA0LjU7XG4gICAgICBjb25zdCBkaXN0YW5jZUZyb21DZW50ZXIgPSBNYXRoLnNxcnQoXG4gICAgICAgIChyb3cgLSBjZW50ZXJYKSAqKiAyICsgKGNvbCAtIGNlbnRlclkpICoqIDJcbiAgICAgICk7XG5cbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgcHJvYmFiaWxpdHkgYmFzZWQgb24gRXVjbGlkZWFuIGRpc3RhbmNlIGZyb20gY2VudGVyXG4gICAgICBjb25zdCBtaW5Qcm9iYWJpbGl0eSA9IDAuMDg7XG4gICAgICBjb25zdCBtYXhQcm9iYWJpbGl0eSA9IDAuMjtcbiAgICAgIGNvbnN0IHByb2JhYmlsaXR5ID1cbiAgICAgICAgbWluUHJvYmFiaWxpdHkgK1xuICAgICAgICAobWF4UHJvYmFiaWxpdHkgLSBtaW5Qcm9iYWJpbGl0eSkgKlxuICAgICAgICAgICgxIC0gZGlzdGFuY2VGcm9tQ2VudGVyIC8gTWF0aC5zcXJ0KDQuNSAqKiAyICsgNC41ICoqIDIpKTtcblxuICAgICAgLy8gQWRqdXN0IHRoZSB3ZWlnaHRzIGJhc2VkIG9uIEJhcnJ5J3MgdGhlb3J5IChpZiBwcm9icyBpcyBjaGVja2VyIHByb2JzLCBwcmVmZXIgb25lIGNvbG9yKVxuICAgICAgY29uc3QgYmFycnlQcm9iYWJpbGl0eSA9IHByb2JhYmlsaXR5ICogY29sb3JXZWlnaHQ7XG5cbiAgICAgIC8vIEFzc2lnbiBwcm9iYWJpbHR5IHRvIHRoZSBwcm9ic1xuICAgICAgaW5pdGlhbFByb2JzW3Jvd11bY29sXSA9IGJhcnJ5UHJvYmFiaWxpdHk7XG5cbiAgICAgIC8vIEZsaXAgdGhlIGNvbG9yIHdlaWdodFxuICAgICAgY29sb3JXZWlnaHQgPSBjb2xvcldlaWdodCA9PT0gMSA/IGNvbG9yTW9kIDogMTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGUgYSBub3JtYWxpemVkIHByb2JzXG4gIGNvbnN0IG5vcm1hbGl6ZWRQcm9icyA9IG5vcm1hbGl6ZVByb2JzKGluaXRpYWxQcm9icyk7XG5cbiAgLy8gUmV0dXJuIHRoZSBub3JtYWxpemVkIHByb2JzXG4gIHJldHVybiBub3JtYWxpemVkUHJvYnM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQcm9icztcbiIsIi8qIFRoaXMgaGVscGVyIG1vZHVsZSBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGdyaWRDYW52YXMgY29tcG91bmQgZWxlbWVudHMgYW5kIFxucmVwbGFjaW5nIHRoZSBwbGFjZWhvbGRlcnMgZm9yIHRoZW0gaW4gdGhlIGh0bWwgd2l0aCB0aGUgbmV3IGVsZW1lbnRzICovXG5cbmltcG9ydCBncmlkQ2FudmFzIGZyb20gXCIuLi9mYWN0b3JpZXMvR3JpZENhbnZhcy9HcmlkQ2FudmFzXCI7XG5cbi8qIFRoaXMgbW9kdWxlIGNyZWF0ZXMgY2FudmFzIGVsZW1lbnRzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIGFwcHJvcHJpYXRlIFxuICAgcGxhY2VzIGluIHRoZSBET00uICovXG5jb25zdCBjYW52YXNBZGRlciA9ICh1c2VyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCwgd2ViSW50ZXJmYWNlLCBnbSkgPT4ge1xuICAvLyBSZXBsYWNlIHRoZSB0aHJlZSBncmlkIHBsYWNlaG9sZGVyIGVsZW1lbnRzIHdpdGggdGhlIHByb3BlciBjYW52YXNlc1xuICAvLyBSZWZzIHRvIERPTSBlbGVtZW50c1xuICBjb25zdCBwbGFjZW1lbnRQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWNhbnZhcy1waFwiKTtcbiAgY29uc3QgdXNlclBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyLWNhbnZhcy1waFwiKTtcbiAgY29uc3QgYWlQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktY2FudmFzLXBoXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgY2FudmFzZXNcblxuICBjb25zdCB1c2VyQ2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICBnbSxcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJ1c2VyXCIgfSxcbiAgICB1c2VyR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZVxuICApO1xuICBjb25zdCBhaUNhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgZ20sXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwiYWlcIiB9LFxuICAgIGFpR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZVxuICApO1xuICBjb25zdCBwbGFjZW1lbnRDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIGdtLFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcInBsYWNlbWVudFwiIH0sXG4gICAgdXNlckdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2UsXG4gICAgdXNlckNhbnZhc1xuICApO1xuXG4gIC8vIFJlcGxhY2UgdGhlIHBsYWNlIGhvbGRlcnNcbiAgcGxhY2VtZW50UEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGxhY2VtZW50Q2FudmFzLCBwbGFjZW1lbnRQSCk7XG4gIHVzZXJQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1c2VyQ2FudmFzLCB1c2VyUEgpO1xuICBhaVBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGFpQ2FudmFzLCBhaVBIKTtcblxuICAvLyBSZXR1cm4gdGhlIGNhbnZhc2VzXG4gIHJldHVybiB7IHBsYWNlbWVudENhbnZhcywgdXNlckNhbnZhcywgYWlDYW52YXMgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNhbnZhc0FkZGVyO1xuIiwiLyogVGhpcyBoZWxwZXIgbW9kdWxlIGlzIHVzZWQgdG8gbG9hZCBpbWFnZXMgaW50byBhcnJheXMgZm9yIHVzZSBpbiB0aGVcbmdhbWUgbG9nLiAqL1xuXG5jb25zdCBpbWFnZUxvYWRlciA9ICgpID0+IHtcbiAgY29uc3QgaW1hZ2VSZWZzID0ge1xuICAgIFNQOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBBVDogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgVk06IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIElHOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBMOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgfTtcblxuICBjb25zdCBpbWFnZUNvbnRleHQgPSByZXF1aXJlLmNvbnRleHQoXCIuLi9zY2VuZS1pbWFnZXNcIiwgdHJ1ZSwgL1xcLmpwZyQvaSk7XG4gIGNvbnN0IGZpbGVzID0gaW1hZ2VDb250ZXh0LmtleXMoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gaW1hZ2VDb250ZXh0KGZpbGUpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gZmlsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgY29uc3Qgc3ViRGlyID0gZmlsZS5zcGxpdChcIi9cIilbMV0udG9VcHBlckNhc2UoKTtcblxuICAgIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcImhpdFwiKSkge1xuICAgICAgaW1hZ2VSZWZzW3N1YkRpcl0uaGl0LnB1c2goZmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCJhdHRhY2tcIikpIHtcbiAgICAgIGltYWdlUmVmc1tzdWJEaXJdLmF0dGFjay5wdXNoKGZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGZpbGVOYW1lLmluY2x1ZGVzKFwiZ2VuXCIpKSB7XG4gICAgICBpbWFnZVJlZnNbc3ViRGlyXS5nZW4ucHVzaChmaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGltYWdlUmVmcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGltYWdlTG9hZGVyO1xuIiwiLyogVGhpcyBtb2R1bGUgaXMgcmVzcG9uc2libGUgZm9yIGluaXRpYWxpemluZyB0aGUgZ2FtZSBieSBjcmVhdGluZ1xuICBpbnN0YW5jZXMgb2YgcmVsZXZhbnQgZ2FtZSBvYmplY3RzIGFuZCBtb2R1bGVzIGFuZCBpbml0aWFsaXppbmcgdGhlbVxuICB3aXRoIHByb3BlciB2YWx1ZXMuIFRoZW4gaXQgaGlkZXMgdGhlIGxvYWRpbmcgc2NyZWVuLiAqL1xuXG4vLyBJbXBvcnQgbW9kdWxlc1xuaW1wb3J0IGdhbWVNYW5hZ2VyIGZyb20gXCIuLi9tb2R1bGVzL2dhbWVNYW5hZ2VyXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9mYWN0b3JpZXMvUGxheWVyXCI7XG5pbXBvcnQgY2FudmFzQWRkZXIgZnJvbSBcIi4vY2FudmFzQWRkZXJcIjtcbmltcG9ydCB3ZWJJbnQgZnJvbSBcIi4uL21vZHVsZXMvd2ViSW50ZXJmYWNlXCI7XG5pbXBvcnQgcGxhY2VBaVNoaXBzIGZyb20gXCIuL3BsYWNlQWlTaGlwc1wiO1xuaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZUxvZ1wiO1xuaW1wb3J0IHNvdW5kcyBmcm9tIFwiLi4vbW9kdWxlcy9zb3VuZHNcIjtcblxuY29uc3QgaW5pdGlhbGl6ZUdhbWUgPSAoKSA9PiB7XG4gIC8vICNyZWdpb24gTG9hZGluZy9Jbml0XG4gIC8vIFJlZiB0byBsb2FkaW5nIHNjcmVlblxuICBjb25zdCBsb2FkaW5nU2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2FkaW5nLXNjcmVlblwiKTtcblxuICAvLyBSZWYgdG8gZ2FtZSBtYW5hZ2VyIGluc3RhbmNlXG4gIGNvbnN0IGdtID0gZ2FtZU1hbmFnZXIoKTtcblxuICAvLyBJbml0aWFsaXplIHRoZSB3ZWIgaW50ZXJmYWNlIHdpdGggZ20gcmVmXG4gIGNvbnN0IHdlYkludGVyZmFjZSA9IHdlYkludChnbSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzb3VuZCBtb2R1bGVcbiAgY29uc3Qgc291bmRQbGF5ZXIgPSBzb3VuZHMoKTtcblxuICAvLyBMb2FkIHNjZW5lIGltYWdlcyBmb3IgZ2FtZSBsb2dcbiAgZ2FtZUxvZy5sb2FkU2NlbmVzKCk7XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gb2YgUGxheWVyIG9iamVjdHMgZm9yIHVzZXIgYW5kIEFJXG4gIGNvbnN0IHVzZXJQbGF5ZXIgPSBQbGF5ZXIoZ20pOyAvLyBDcmVhdGUgcGxheWVyc1xuICBjb25zdCBhaVBsYXllciA9IFBsYXllcihnbSk7XG4gIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSBhaVBsYXllci5nYW1lYm9hcmQ7IC8vIFNldCByaXZhbCBib2FyZHNcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSB1c2VyUGxheWVyLmdhbWVib2FyZDtcbiAgdXNlclBsYXllci5nYW1lYm9hcmQuaXNBaSA9IGZhbHNlOyAvLyBTZXQgYWkgb3Igbm90XG4gIGFpUGxheWVyLmdhbWVib2FyZC5pc0FpID0gdHJ1ZTtcblxuICAvLyBTZXQgZ2FtZUxvZyB1c2VyIGdhbWUgYm9hcmQgZm9yIGFjY3VyYXRlIHNjZW5lc1xuICBnYW1lTG9nLnNldFVzZXJHYW1lYm9hcmQodXNlclBsYXllci5nYW1lYm9hcmQpO1xuICAvLyBJbml0IGdhbWUgbG9nIHNjZW5lIGltZ1xuICBnYW1lTG9nLmluaXRTY2VuZSgpO1xuXG4gIC8vIEFkZCB0aGUgY2FudmFzIG9iamVjdHMgbm93IHRoYXQgZ2FtZWJvYXJkcyBhcmUgY3JlYXRlZFxuICBjb25zdCBjYW52YXNlcyA9IGNhbnZhc0FkZGVyKFxuICAgIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLFxuICAgIGFpUGxheWVyLmdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2UsXG4gICAgZ21cbiAgKTtcbiAgLy8gQWRkIGNhbnZhc2VzIHRvIGdhbWVib2FyZHNcbiAgdXNlclBsYXllci5nYW1lYm9hcmQuY2FudmFzID0gY2FudmFzZXMudXNlckNhbnZhcztcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLmNhbnZhcyA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuXG4gIC8vIEFkZCBib2FyZHMgYW5kIGNhbnZhc2VzIHRvIGdhbWVNYW5hZ2VyXG4gIGdtLnVzZXJCb2FyZCA9IHVzZXJQbGF5ZXIuZ2FtZWJvYXJkO1xuICBnbS5haUJvYXJkID0gYWlQbGF5ZXIuZ2FtZWJvYXJkO1xuICBnbS51c2VyQ2FudmFzQ29udGFpbmVyID0gY2FudmFzZXMudXNlckNhbnZhcztcbiAgZ20uYWlDYW52YXNDb250YWluZXIgPSBjYW52YXNlcy5haUNhbnZhcztcbiAgZ20ucGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzZXMucGxhY2VtZW50Q2FudmFzO1xuXG4gIC8vIEFkZCBtb2R1bGVzIHRvIGdhbWVNYW5hZ2VyXG4gIGdtLndlYkludGVyZmFjZSA9IHdlYkludGVyZmFjZTtcbiAgZ20uc291bmRQbGF5ZXIgPSBzb3VuZFBsYXllcjtcbiAgZ20uZ2FtZUxvZyA9IGdhbWVMb2c7XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBBZGQgYWkgc2hpcHNcbiAgcGxhY2VBaVNoaXBzKDEsIGFpUGxheWVyLmdhbWVib2FyZCk7XG5cbiAgLy8gSGlkZSB0aGUgbG9hZGluZyBzY3JlZW4gYWZ0ZXIgbWluIHRpbWVvdXRcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbG9hZGluZ1NjcmVlbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9LCAxMDAwKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpemVHYW1lO1xuIiwiLyogVGhpcyBoZWxwZXIgbW9kdWxlIHdpbGwgcGxhY2UgdGhlIGFpIHNoaXBzIG9uIHRoZSBhaSBnYW1lYm9hcmQuIFRoZXkgYXJlIGN1cnJlbnRseVxuICBhbHdheXMgcGxhY2VkIHJhbmRvbWx5LCBidXQgdGhlIGZyYW1ld29yayBleGlzdHMgZm9yIGNyZWF0aW5nIGRpZmZlcmVudCBwbGFjZW1lbnRcbiAgbWV0aG9kcyBiYXNlZCBvbiB0aGUgZ2FtZU1hbmFnZXIncyBhaURpZmZpY3VsdHkgc2V0dGluZy4gKi9cblxuaW1wb3J0IHJhbmRvbVNoaXBzIGZyb20gXCIuL3JhbmRvbVNoaXBzXCI7XG5cbi8vIFRoaXMgaGVscGVyIHdpbGwgYXR0ZW1wdCB0byBhZGQgc2hpcHMgdG8gdGhlIGFpIGdhbWVib2FyZCBpbiBhIHZhcmlldHkgb2Ygd2F5cyBmb3IgdmFyeWluZyBkaWZmaWN1bHR5XG5jb25zdCBwbGFjZUFpU2hpcHMgPSAocGFzc2VkRGlmZiwgYWlHYW1lYm9hcmQpID0+IHtcbiAgLy8gR3JpZCBzaXplXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG5cbiAgLy8gUGxhY2UgYSBzaGlwIGFsb25nIGVkZ2VzIHVudGlsIG9uZSBzdWNjZXNzZnVsbHkgcGxhY2VkID9cbiAgLy8gUGxhY2UgYSBzaGlwIGJhc2VkIG9uIHF1YWRyYW50ID9cblxuICAvLyBDb21iaW5lIHBsYWNlbWVudCB0YWN0aWNzIHRvIGNyZWF0ZSB2YXJ5aW5nIGRpZmZpY3VsdGllc1xuICBjb25zdCBwbGFjZVNoaXBzID0gKGRpZmZpY3VsdHkpID0+IHtcbiAgICAvLyBUb3RhbGx5IHJhbmRvbSBwYWxjZW1lbnRcbiAgICBpZiAoZGlmZmljdWx0eSA9PT0gMSkge1xuICAgICAgLy8gUGxhY2Ugc2hpcHMgcmFuZG9tbHlcbiAgICAgIHJhbmRvbVNoaXBzKGFpR2FtZWJvYXJkLCBncmlkV2lkdGgsIGdyaWRIZWlnaHQpO1xuICAgIH1cbiAgfTtcblxuICBwbGFjZVNoaXBzKHBhc3NlZERpZmYpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGxhY2VBaVNoaXBzO1xuIiwiLyogVGhpcyBoZWxwZXIgcGxhY2VzIHNoaXBzIHJhbmRvbWx5IG9uIGEgZ2FtZWJvYXJkIHVudGlsIGFsbCBcbjUgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZC4gSXQgdXNlcyByZWN1cnNpb24gdG8gZG8gdGhpcywgZW5zdXJpbmdcbnRoZSBtZXRob2QgaXMgdHJpZWQgb3ZlciBhbmQgb3ZlciB1bnRpbCBhIHN1ZmZpY2llbnQgYm9hcmQgY29uZmlndXJhdGlvblxuaXMgcmV0dXJuZWQuICovXG5cbmNvbnN0IHJhbmRvbVNoaXBzID0gKGdhbWVib2FyZCwgZ3JpZFgsIGdyaWRZKSA9PiB7XG4gIC8vIEV4aXQgZnJvbSByZWN1cnNpb25cbiAgaWYgKGdhbWVib2FyZC5zaGlwcy5sZW5ndGggPiA0KSByZXR1cm47XG4gIC8vIEdldCByYW5kb20gcGxhY2VtZW50XG4gIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkWCk7XG4gIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkWSk7XG4gIGNvbnN0IGRpcmVjdGlvbiA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG5cbiAgLy8gVHJ5IHRoZSBwbGFjZW1lbnRcbiAgZ2FtZWJvYXJkLmFkZFNoaXAoW3gsIHldLCBkaXJlY3Rpb24pO1xuXG4gIC8vIEtlZXAgZG9pbmcgaXQgdW50aWwgYWxsIHNoaXBzIGFyZSBwbGFjZWRcbiAgcmFuZG9tU2hpcHMoZ2FtZWJvYXJkLCBncmlkWCwgZ3JpZFkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmFuZG9tU2hpcHM7XG4iLCIvKiBUaGlzIG1vZHVsZSBoYW5kbGVzIHVwZGF0aW5nIHRoZSBnYW1lIGxvZyB1aSBlbGVtZW50cyB0byBkaXNwbGF5IHJlbGV2YW50XG4gIGluZm9ybWF0aW9uIHN1Y2ggYXMgYXR0YWNrcyBtYWRlLCBzaGlwcyBzdW5rLCBhbmQgcGljdHVyZXMgb2YgdmFyaW91cyB1bml0c1xuICBpbiB2YXJpb3VzIHN0YXRlcy5cbiAgXG4gIEl0IHJldHVybnMgdGhyZWUgcHJpbWFyaWx5IHVzZWQgbWV0aG9kcywgYmVpbmcgZXJhc2UsIGFwcGVuZCwgYW5kIHNldFNjZW5lLlxuICBUaGUgZmlyc3QgdHdvIGFyZSBzZWxmIG9idmlvdXMuIHNldFNjZW5lIHdpbGwgY2hlY2sgdGhyb3VnaCB0aGUgY3VycmVudCBsb2cgdGV4dCxcbiAgbG9va2luZyBmb3Iga2V5d29yZHMsIGFuZCB0aGVuIGNob29zZSBhbiBpbWFnZSB0byBkaXNwbGF5IGluIHRoZSBsb2cgYmFzZWQgb25cbiAgZm91bmQga2V5d29yZHMuICovXG5cbmltcG9ydCBpbWFnZUxvYWRlciBmcm9tIFwiLi4vaGVscGVycy9pbWFnZUxvYWRlclwiO1xuXG5jb25zdCBnYW1lTG9nID0gKCh1c2VyTmFtZSA9IFwiVXNlclwiKSA9PiB7XG4gIC8vIEZsYWcgZm9yIHR1cm5pbmcgb2ZmIHNjZW5lIHVwZGF0ZXNcbiAgbGV0IGRvVXBkYXRlU2NlbmUgPSB0cnVlO1xuICAvLyBGbGFnIGZvciBsb2NraW5nIHRoZSBsb2dcbiAgbGV0IGRvTG9jayA9IGZhbHNlO1xuXG4gIC8vIEFkZCBhIHByb3BlcnR5IHRvIHN0b3JlIHRoZSBnYW1lYm9hcmRcbiAgbGV0IHVzZXJHYW1lYm9hcmQgPSBudWxsO1xuXG4gIC8vIFNldHRlciBtZXRob2QgdG8gc2V0IHRoZSBnYW1lYm9hcmRcbiAgY29uc3Qgc2V0VXNlckdhbWVib2FyZCA9IChnYW1lYm9hcmQpID0+IHtcbiAgICB1c2VyR2FtZWJvYXJkID0gZ2FtZWJvYXJkO1xuICB9O1xuXG4gIC8vIFJlZiB0byBsb2cgdGV4dFxuICBjb25zdCBsb2dUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2ctdGV4dFwiKTtcbiAgY29uc3QgbG9nSW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY2VuZS1pbWdcIik7XG5cbiAgLy8gTG9nIHNjZW5lIGhhbmRsaW5nXG4gIGxldCBzY2VuZUltYWdlcyA9IG51bGw7XG4gIC8vIE1ldGhvZCBmb3IgbG9hZGluZyBzY2VuZSBpbWFnZXMuIE11c3QgYmUgcnVuIG9uY2UgaW4gZ2FtZSBtYW5hZ2VyLlxuICBjb25zdCBsb2FkU2NlbmVzID0gKCkgPT4ge1xuICAgIHNjZW5lSW1hZ2VzID0gaW1hZ2VMb2FkZXIoKTtcbiAgfTtcblxuICAvLyBHZXRzIGEgcmFuZG9tIGFycmF5IGVudHJ5XG4gIGZ1bmN0aW9uIHJhbmRvbUVudHJ5KGFycmF5KSB7XG4gICAgY29uc3QgbGFzdEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobGFzdEluZGV4ICsgMSkpO1xuICAgIHJldHVybiByYW5kb21OdW1iZXI7XG4gIH1cblxuICAvLyBHZXRzIGEgcmFuZG9tIHVzZXIgc2hpcCB0aGF0IGlzbid0IGRlc3Ryb3llZFxuICBjb25zdCBkaXJOYW1lcyA9IHsgMTogXCJTUFwiLCAyOiBcIkFUXCIsIDM6IFwiVk1cIiwgNDogXCJJR1wiLCA1OiBcIkxcIiB9O1xuICBmdW5jdGlvbiByYW5kb21TaGlwRGlyKGdhbWVib2FyZCA9IHVzZXJHYW1lYm9hcmQpIHtcbiAgICBjb25zdCByZW1haW5pbmdTaGlwcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoIWdhbWVib2FyZC5zaGlwc1tpXS5pc1N1bmsoKSlcbiAgICAgICAgcmVtYWluaW5nU2hpcHMucHVzaChnYW1lYm9hcmQuc2hpcHNbaV0uaW5kZXgpO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVuIGFsbCBzaGlwcyBhcmUgc3Vua1xuICAgIGlmIChyZW1haW5pbmdTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpO1xuICAgICAgcmV0dXJuIGRpck5hbWVzW3JhbmRvbU51bWJlciArIDFdOyAvLyBkaXJOYW1lcyBzdGFydCBhdCBpbmRleCAxXG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIHJldHVybiByYW5kb20gcmVtYWluaW5nIHNoaXBcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZW1haW5pbmdTaGlwcy5sZW5ndGgpO1xuICAgIHJldHVybiBkaXJOYW1lc1tyZW1haW5pbmdTaGlwc1tyYW5kb21OdW1iZXJdXTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemVzIHNjZW5lIGltYWdlIHRvIGdlbiBpbWFnZVxuICBjb25zdCBpbml0U2NlbmUgPSAoKSA9PiB7XG4gICAgLy8gZ2V0IHJhbmRvbSBzaGlwIGRpclxuICAgIGNvbnN0IHNoaXBEaXIgPSBkaXJOYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KSArIDFdO1xuICAgIC8vIGdldCByYW5kb20gYXJyYXkgZW50cnlcbiAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbik7XG4gICAgLy8gc2V0IHRoZSBpbWFnZVxuICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW5bZW50cnldO1xuICB9O1xuXG4gIC8vIFNldHMgdGhlIHNjZW5lIGltYWdlIGJhc2VkIG9uIHBhcmFtcyBwYXNzZWRcbiAgY29uc3Qgc2V0U2NlbmUgPSAoKSA9PiB7XG4gICAgLy8gUmV0dXJuIGlmIGxvZyBmbGFnIHNldCB0byBub3QgdXBkYXRlXG4gICAgaWYgKCFkb1VwZGF0ZVNjZW5lKSByZXR1cm47XG4gICAgLy8gU2V0IHRoZSB0ZXh0IHRvIGxvd2VyY2FzZSBmb3IgY29tcGFyaXNvblxuICAgIGNvbnN0IGxvZ0xvd2VyID0gbG9nVGV4dC50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gUmVmcyB0byBzaGlwIHR5cGVzIGFuZCB0aGVpciBkaXJzXG4gICAgY29uc3Qgc2hpcFR5cGVzID0gW1wic2VudGluZWxcIiwgXCJhc3NhdWx0XCIsIFwidmlwZXJcIiwgXCJpcm9uXCIsIFwibGV2aWF0aGFuXCJdO1xuICAgIGNvbnN0IHR5cGVUb0RpciA9IHtcbiAgICAgIHNlbnRpbmVsOiBcIlNQXCIsXG4gICAgICBhc3NhdWx0OiBcIkFUXCIsXG4gICAgICB2aXBlcjogXCJWTVwiLFxuICAgICAgaXJvbjogXCJJR1wiLFxuICAgICAgbGV2aWF0aGFuOiBcIkxcIixcbiAgICB9O1xuXG4gICAgLy8gSGVscGVyIGZvciBnZXR0aW5nIHJhbmRvbSBzaGlwIHR5cGUgZnJvbSB0aG9zZSByZW1haW5pbmdcblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiB5b3UgYXR0YWNrIGJhc2VkIG9uIHJlbWFpbmluZyBzaGlwc1xuICAgIGlmIChcbiAgICAgIGxvZ0xvd2VyLmluY2x1ZGVzKHVzZXJOYW1lLnRvTG93ZXJDYXNlKCkpICYmXG4gICAgICBsb2dMb3dlci5pbmNsdWRlcyhcImF0dGFja3NcIilcbiAgICApIHtcbiAgICAgIC8vIEdldCByYW5kb20gc2hpcFxuICAgICAgY29uc3Qgc2hpcERpciA9IHJhbmRvbVNoaXBEaXIoKTtcbiAgICAgIC8vIEdldCByYW5kb20gaW1nIGZyb20gYXBwcm9wcmlhdGUgcGxhY2VcbiAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uYXR0YWNrKTtcbiAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5hdHRhY2tbZW50cnldO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiBzaGlwIGhpdFxuICAgIGlmIChsb2dMb3dlci5pbmNsdWRlcyhcImhpdCB5b3VyXCIpKSB7XG4gICAgICBzaGlwVHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICBpZiAobG9nTG93ZXIuaW5jbHVkZXModHlwZSkpIHtcbiAgICAgICAgICAvLyBTZXQgdGhlIHNoaXAgZGlyZWN0b3J5IGJhc2VkIG9uIHR5cGVcbiAgICAgICAgICBjb25zdCBzaGlwRGlyID0gdHlwZVRvRGlyW3R5cGVdO1xuICAgICAgICAgIC8vIEdldCBhIHJhbmRvbSBoaXQgZW50cnlcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmhpdCk7XG4gICAgICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5oaXRbZW50cnldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGltYWdlIHdoZW4gdGhlcmUgaXMgYW4gYWkgbWlzcyB0byBnZW4gb2YgcmVtYWluaW5nIHNoaXBzXG4gICAgaWYgKGxvZ0xvd2VyLmluY2x1ZGVzKFwiYWkgYXR0YWNrc1wiKSAmJiBsb2dMb3dlci5pbmNsdWRlcyhcIm1pc3NlZFwiKSkge1xuICAgICAgLy8gR2V0IHJhbmRvbSByZW1haW5pbmcgc2hpcCBkaXJcbiAgICAgIGNvbnN0IHNoaXBEaXIgPSByYW5kb21TaGlwRGlyKCk7XG4gICAgICAvLyBHZXQgcmFuZG9tIGVudHJ5IGZyb20gdGhlcmVcbiAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuKTtcbiAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW5bZW50cnldO1xuICAgIH1cbiAgfTtcblxuICAvLyBFcmFzZSB0aGUgbG9nIHRleHRcbiAgY29uc3QgZXJhc2UgPSAoKSA9PiB7XG4gICAgaWYgKGRvTG9jaykgcmV0dXJuO1xuICAgIGxvZ1RleHQudGV4dENvbnRlbnQgPSBcIlwiO1xuICB9O1xuXG4gIC8vIEFkZCB0byBsb2cgdGV4dFxuICBjb25zdCBhcHBlbmQgPSAoc3RyaW5nVG9BcHBlbmQpID0+IHtcbiAgICBpZiAoZG9Mb2NrKSByZXR1cm47XG4gICAgaWYgKHN0cmluZ1RvQXBwZW5kKSB7XG4gICAgICBsb2dUZXh0LmlubmVySFRNTCArPSBgXFxuJHtzdHJpbmdUb0FwcGVuZC50b1N0cmluZygpfWA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZXJhc2UsXG4gICAgYXBwZW5kLFxuICAgIHNldFNjZW5lLFxuICAgIGxvYWRTY2VuZXMsXG4gICAgc2V0VXNlckdhbWVib2FyZCxcbiAgICBpbml0U2NlbmUsXG4gICAgZ2V0IGRvVXBkYXRlU2NlbmUoKSB7XG4gICAgICByZXR1cm4gZG9VcGRhdGVTY2VuZTtcbiAgICB9LFxuICAgIHNldCBkb1VwZGF0ZVNjZW5lKGJvb2wpIHtcbiAgICAgIGlmIChib29sID09PSB0cnVlIHx8IGJvb2wgPT09IGZhbHNlKSB7XG4gICAgICAgIGRvVXBkYXRlU2NlbmUgPSBib29sO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0IGRvTG9jaygpIHtcbiAgICAgIHJldHVybiBkb0xvY2s7XG4gICAgfSxcbiAgICBzZXQgZG9Mb2NrKGJvb2wpIHtcbiAgICAgIGlmIChib29sID09PSB0cnVlIHx8IGJvb2wgPT09IGZhbHNlKSB7XG4gICAgICAgIGRvTG9jayA9IGJvb2w7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVMb2c7XG4iLCIvKiBUaGlzIG1vZHVsZSBhY3RzIGFzIHRoZSBjZW50cmFsIGNvbW11bmljYXRpb25zIGh1YiBmb3IgYWxsIHRoZSBkaWZmZXJlbnQgbW9kdWxlcy5cbiAgSXQgaGFzIG1ldGhvZHMgZm9yIHJlc3BvbmRpbmcgdG8gdmFyaW91cyBnYW1lIGV2ZW50cywgYXMgd2VsbCBhcyByZWZzIHRvIGdhbWUgc2V0dGluZ3MsXG4gIGdhbWUgb2JqZWN0cywgYW5kIHRoZSBvdGhlciBtYWluIG1vZHVsZXMuXG4gIFxuICBJZiBzb21ldGhpbmcgbmVlZHMgdG8gaGFwcGVuIHRoYXQgaW52b2x2ZXMgdmFyaW91cyB1bi1yZWxhdGVkIHBhcnRzIG9mIHRoZSBjb2RlYmFzZSBcbiAgd29ya2luZyB0b2dldGhlciB0aGVuIGl0IHdpbGwgYmUgaGFuZGxlZCBieSB0aGlzIG1vZHVsZS4gKi9cblxuaW1wb3J0IHJhbmRvbVNoaXBzIGZyb20gXCIuLi9oZWxwZXJzL3JhbmRvbVNoaXBzXCI7XG5cbmNvbnN0IGdhbWVNYW5hZ2VyID0gKCkgPT4ge1xuICAvLyBHYW1lIHNldHRpbmdzXG4gIGxldCBhaURpZmZpY3VsdHkgPSAyO1xuICBjb25zdCB1c2VyQXR0YWNrRGVsYXkgPSAxMDAwO1xuICBjb25zdCBhaUF0dGFja0RlbGF5ID0gMjIwMDtcbiAgY29uc3QgYWlBdXRvRGVsYXkgPSAyNTA7XG5cbiAgLy8gUmVmcyB0byByZWxldmFudCBnYW1lIG9iamVjdHNcbiAgbGV0IHVzZXJCb2FyZCA9IG51bGw7XG4gIGxldCBhaUJvYXJkID0gbnVsbDtcbiAgbGV0IHVzZXJDYW52YXNDb250YWluZXIgPSBudWxsO1xuICBsZXQgYWlDYW52YXNDb250YWluZXIgPSBudWxsO1xuICBsZXQgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gbnVsbDtcblxuICAvLyBSZWZzIHRvIG1vZHVsZXNcbiAgbGV0IHNvdW5kUGxheWVyID0gbnVsbDtcbiAgbGV0IHdlYkludGVyZmFjZSA9IG51bGw7XG4gIGxldCBnYW1lTG9nID0gbnVsbDtcblxuICAvLyAjcmVnaW9uIEhhbmRsZSBBSSBBdHRhY2tzXG4gIC8vIEFJIEF0dGFjayBIaXRcbiAgY29uc3QgYWlBdHRhY2tIaXQgPSAoYXR0YWNrQ29vcmRzKSA9PiB7XG4gICAgLy8gUGxheSBoaXQgc291bmRcbiAgICBzb3VuZFBsYXllci5wbGF5SGl0KCk7XG4gICAgLy8gRHJhdyB0aGUgaGl0IHRvIGJvYXJkXG4gICAgdXNlckNhbnZhc0NvbnRhaW5lci5kcmF3SGl0KGF0dGFja0Nvb3Jkcyk7XG4gICAgLy8gTG9nIHRoZSBoaXRcbiAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgZ2FtZUxvZy5hcHBlbmQoXG4gICAgICBgQUkgYXR0YWNrcyBjZWxsOiAke2F0dGFja0Nvb3Jkc30gXFxuQXR0YWNrIGhpdCB5b3VyICR7dXNlckJvYXJkLmhpdFNoaXBUeXBlfSFgXG4gICAgKTtcbiAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgLy8gU2V0IGFpIHRvIGRlc3Ryb3kgbW9kZVxuICAgIGFpQm9hcmQuaXNBaVNlZWtpbmcgPSBmYWxzZTtcbiAgICAvLyBBZGQgaGl0IHRvIGNlbGxzIHRvIGNoZWNrXG4gICAgYWlCb2FyZC5jZWxsc1RvQ2hlY2sucHVzaChhdHRhY2tDb29yZHMpO1xuICAgIC8vIExvZyBzdW5rIHVzZXIgc2hpcHNcbiAgICBjb25zdCBzdW5rTXNnID0gdXNlckJvYXJkLmxvZ1N1bmsoKTtcbiAgICBpZiAoc3Vua01zZyAhPT0gbnVsbCkge1xuICAgICAgZ2FtZUxvZy5hcHBlbmQoc3Vua01zZyk7XG4gICAgICAvLyBVcGRhdGUgbG9nIHNjZW5lXG4gICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIEFJIHdvblxuICAgIGlmICh1c2VyQm9hcmQuYWxsU3VuaygpKSB7XG4gICAgICAvLyAnICAgICAgICAnXG4gICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBbGwgVXNlciB1bml0cyBkZXN0cm95ZWQuIFxcbkFJIGRvbWluYW5jZSBpcyBhc3N1cmVkLlwiKTtcbiAgICAgIC8vIFNldCBnYW1lIG92ZXIgb24gYm9hcmRzXG4gICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTsgLy8gQUkgYm9hcmRcbiAgICAgIHVzZXJCb2FyZC5nYW1lT3ZlciA9IHRydWU7IC8vIFVzZXIgYm9hcmRcbiAgICB9XG4gIH07XG5cbiAgLy8gQUkgQXR0YWNrIE1pc3NlZFxuICBjb25zdCBhaUF0dGFja01pc3NlZCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAvLyBQbGF5IHNvdW5kXG4gICAgc291bmRQbGF5ZXIucGxheU1pc3MoKTtcbiAgICAvLyBEcmF3IHRoZSBtaXNzIHRvIGJvYXJkXG4gICAgdXNlckNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgIC8vIExvZyB0aGUgbWlzc1xuICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICBnYW1lTG9nLmFwcGVuZChgQUkgYXR0YWNrcyBjZWxsOiAke2F0dGFja0Nvb3Jkc31cXG5BdHRhY2sgbWlzc2VkIWApO1xuICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgfTtcblxuICAvLyBBSSBpcyBhdHRhY2tpbmdcbiAgbGV0IGFpQXR0YWNrQ291bnQgPSAwO1xuICBjb25zdCBhaUF0dGFja2luZyA9IChhdHRhY2tDb29yZHMsIGRlbGF5ID0gYWlBdHRhY2tEZWxheSkgPT4ge1xuICAgIC8vIFRpbWVvdXQgdG8gc2ltdWxhdGUgXCJ0aGlua2luZ1wiIGFuZCB0byBtYWtlIGdhbWUgZmVlbCBiZXR0ZXJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIFNlbmQgYXR0YWNrIHRvIHJpdmFsIGJvYXJkXG4gICAgICB1c2VyQm9hcmRcbiAgICAgICAgLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmRzKVxuICAgICAgICAvLyBUaGVuIGRyYXcgaGl0cyBvciBtaXNzZXNcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrSGl0KGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBhaUF0dGFja01pc3NlZChhdHRhY2tDb29yZHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEJyZWFrIG91dCBvZiByZWN1cnNpb24gaWYgZ2FtZSBpcyBvdmVyXG4gICAgICAgICAgaWYgKHVzZXJCb2FyZC5nYW1lT3ZlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gTG9nIHRvdGFsIGhpdHMgaWYgYWkgYXV0byBhdHRhY2tpbmdcbiAgICAgICAgICAgIGlmIChhaUJvYXJkLmlzQXV0b0F0dGFja2luZykge1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChgVG90YWwgQUkgYXR0YWNrczogJHthaUF0dGFja0NvdW50fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2FtZUxvZy5kb0xvY2sgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIGFpIGJvYXJkIGlzIGF1dG9hdHRhY2tpbmcgaGF2ZSBpdCB0cnkgYW4gYXR0YWNrXG4gICAgICAgICAgaWYgKGFpQm9hcmQuaXNBdXRvQXR0YWNraW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBhaUF0dGFja0NvdW50ICs9IDE7XG4gICAgICAgICAgICBhaUJvYXJkLnRyeUFpQXR0YWNrKGFpQXV0b0RlbGF5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFsbG93IHRoZSB1c2VyIHRvIGF0dGFjayBhZ2FpblxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXNlckJvYXJkLmNhbkF0dGFjayA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gSGFuZGxlIFBsYXllciBBdHRhY2tzXG4gIGNvbnN0IHBsYXllckF0dGFja2luZyA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAvLyBSZXR1cm4gaWYgZ2FtZWJvYXJkIGNhbid0IGF0dGFja1xuICAgIGlmIChhaUJvYXJkLnJpdmFsQm9hcmQuY2FuQXR0YWNrID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIC8vIFRyeSBhdHRhY2sgYXQgY3VycmVudCBjZWxsXG4gICAgaWYgKGFpQm9hcmQuYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICAgIC8vIEJhZCB0aGluZy4gRXJyb3Igc291bmQgbWF5YmUuXG4gICAgfSBlbHNlIGlmICh1c2VyQm9hcmQuZ2FtZU92ZXIgPT09IGZhbHNlKSB7XG4gICAgICAvLyBTZXQgZ2FtZWJvYXJkIHRvIG5vdCBiZSBhYmxlIHRvIGF0dGFja1xuICAgICAgdXNlckJvYXJkLmNhbkF0dGFjayA9IGZhbHNlO1xuICAgICAgLy8gTG9nIHRoZSBzZW50IGF0dGFja1xuICAgICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgICAgZ2FtZUxvZy5hcHBlbmQoYFVzZXIgYXR0YWNrcyBjZWxsOiAke2F0dGFja0Nvb3Jkc31gKTtcbiAgICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgICAgIC8vIFBsYXkgdGhlIHNvdW5kXG4gICAgICBzb3VuZFBsYXllci5wbGF5QXR0YWNrKCk7XG4gICAgICAvLyBTZW5kIHRoZSBhdHRhY2tcbiAgICAgIGFpQm9hcmQucmVjZWl2ZUF0dGFjayhhdHRhY2tDb29yZHMpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAvLyBTZXQgYSB0aW1lb3V0IGZvciBkcmFtYXRpYyBlZmZlY3RcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgLy8gQXR0YWNrIGhpdFxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIFBsYXkgc291bmRcbiAgICAgICAgICAgIHNvdW5kUGxheWVyLnBsYXlIaXQoKTtcbiAgICAgICAgICAgIC8vIERyYXcgaGl0IHRvIGJvYXJkXG4gICAgICAgICAgICBhaUNhbnZhc0NvbnRhaW5lci5kcmF3SGl0KGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgICAvLyBMb2cgaGl0XG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkF0dGFjayBoaXQhXCIpO1xuICAgICAgICAgICAgLy8gTG9nIHN1bmtlbiBzaGlwc1xuICAgICAgICAgICAgY29uc3Qgc3Vua01zZyA9IGFpQm9hcmQubG9nU3VuaygpO1xuICAgICAgICAgICAgaWYgKHN1bmtNc2cgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoc3Vua01zZyk7XG4gICAgICAgICAgICAgIC8vIFVwZGF0ZSBsb2cgc2NlbmVcbiAgICAgICAgICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBwbGF5ZXIgd29uXG4gICAgICAgICAgICBpZiAoYWlCb2FyZC5hbGxTdW5rKCkpIHtcbiAgICAgICAgICAgICAgLy8gTG9nIHJlc3VsdHNcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgXCJBbGwgQUkgdW5pdHMgZGVzdHJveWVkLiBcXG5IdW1hbml0eSBzdXJ2aXZlcyBhbm90aGVyIGRheS4uLlwiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIC8vIFNldCBnYW1lb3ZlciBvbiBib2FyZHNcbiAgICAgICAgICAgICAgYWlCb2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgICAgIHVzZXJCb2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQUkgZGV0cm1pbmluZyBhdHRhY2suLi5cIik7XG4gICAgICAgICAgICAgIC8vIEhhdmUgdGhlIGFpIGF0dGFjayBpZiBub3QgZ2FtZU92ZXJcbiAgICAgICAgICAgICAgYWlCb2FyZC50cnlBaUF0dGFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gUGxheSBzb3VuZFxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheU1pc3MoKTtcbiAgICAgICAgICAgIC8vIERyYXcgbWlzcyB0byBib2FyZFxuICAgICAgICAgICAgYWlDYW52YXNDb250YWluZXIuZHJhd01pc3MoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAgIC8vIExvZyBtaXNzXG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkF0dGFjayBtaXNzZWQhXCIpO1xuICAgICAgICAgICAgLy8gTG9nIHRoZSBhaSBcInRoaW5raW5nXCIgYWJvdXQgaXRzIGF0dGFja1xuICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBSSBkZXRybWluaW5nIGF0dGFjay4uLlwiKTtcbiAgICAgICAgICAgIC8vIEhhdmUgdGhlIGFpIGF0dGFjayBpZiBub3QgZ2FtZU92ZXJcbiAgICAgICAgICAgIGFpQm9hcmQudHJ5QWlBdHRhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHVzZXJBdHRhY2tEZWxheSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBzZXR0aW5nIHVwIGFuIEFJIHZzIEFJIG1hdGNoXG4gIGNvbnN0IGFpTWF0Y2hDbGlja2VkID0gKCkgPT4ge1xuICAgIC8vIFRvZ2dsZSBhaSBhdXRvIGF0dGFja1xuICAgIGFpQm9hcmQuaXNBdXRvQXR0YWNraW5nID0gIWFpQm9hcmQuaXNBdXRvQXR0YWNraW5nO1xuICAgIC8vIFRvZ2dsZSBsb2cgdG8gbm90IHVwZGF0ZSBzY2VuZVxuICAgIGdhbWVMb2cuZG9VcGRhdGVTY2VuZSA9ICFnYW1lTG9nLmRvVXBkYXRlU2NlbmU7XG4gICAgLy8gU2V0IHRoZSBzb3VuZHMgdG8gbXV0ZWRcbiAgICBzb3VuZFBsYXllci5pc011dGVkID0gIXNvdW5kUGxheWVyLmlzTXV0ZWQ7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgU2hpcCBQbGFjZW1lbnQgYW5kIEdhbWUgU3RhcnRcbiAgLy8gQ2hlY2sgaWYgZ2FtZSBzaG91bGQgc3RhcnQgYWZ0ZXIgcGxhY2VtZW50XG4gIGNvbnN0IHRyeVN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgd2ViSW50ZXJmYWNlLnNob3dHYW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEhhbmRsZSByYW5kb20gc2hpcHMgYnV0dG9uIGNsaWNrXG4gIGNvbnN0IHJhbmRvbVNoaXBzQ2xpY2tlZCA9ICgpID0+IHtcbiAgICByYW5kb21TaGlwcyh1c2VyQm9hcmQsIHVzZXJCb2FyZC5tYXhCb2FyZFgsIHVzZXJCb2FyZC5tYXhCb2FyZFkpO1xuICAgIHVzZXJDYW52YXNDb250YWluZXIuZHJhd1NoaXBzKCk7XG4gICAgdHJ5U3RhcnRHYW1lKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJvdGF0ZSBidXR0b24gY2xpY2tzXG4gIGNvbnN0IHJvdGF0ZUNsaWNrZWQgPSAoKSA9PiB7XG4gICAgdXNlckJvYXJkLmRpcmVjdGlvbiA9IHVzZXJCb2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgICBhaUJvYXJkLmRpcmVjdGlvbiA9IGFpQm9hcmQuZGlyZWN0aW9uID09PSAwID8gMSA6IDA7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VtZW50Q2xpY2tlZCA9IChjZWxsKSA9PiB7XG4gICAgLy8gVHJ5IHBsYWNlbWVudFxuICAgIHVzZXJCb2FyZC5hZGRTaGlwKGNlbGwpO1xuICAgIHBsYWNlbWVudENhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMoKTtcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdTaGlwcygpO1xuICAgIHRyeVN0YXJ0R2FtZSgpO1xuICB9O1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gV2hlbiBhIHVzZXIgc2hpcCBpcyBzdW5rXG4gIGNvbnN0IHVzZXJTaGlwU3VuayA9IChzaGlwKSA9PiB7XG4gICAgLy8gUmVtb3ZlIHRoZSBzdW5rZW4gc2hpcCBjZWxscyBmcm9tIGNlbGxzIHRvIGNoZWNrXG4gICAgc2hpcC5vY2N1cGllZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIC8vIE9jY3VwaWVkIGNlbGwgeCBhbmQgeVxuICAgICAgY29uc3QgW294LCBveV0gPSBjZWxsO1xuICAgICAgLy8gUmVtb3ZlIGl0IGZyb20gY2VsbHMgdG8gY2hlY2sgaWYgaXQgZXhpc3RzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFpQm9hcmQuY2VsbHNUb0NoZWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIC8vIENlbGwgdG8gY2hlY2sgeCBhbmQgeVxuICAgICAgICBjb25zdCBbY3gsIGN5XSA9IGFpQm9hcmQuY2VsbHNUb0NoZWNrW2ldO1xuICAgICAgICAvLyBSZW1vdmUgaWYgbWF0Y2ggZm91bmRcbiAgICAgICAgaWYgKG94ID09PSBjeCAmJiBveSA9PT0gY3kpIHtcbiAgICAgICAgICBhaUJvYXJkLmNlbGxzVG9DaGVjay5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIElmIGNlbGxzIHRvIGNoZWNrIGlzIGVtcHR5IHRoZW4gc3RvcCBkZXN0b3J5IG1vZGVcbiAgICBpZiAoYWlCb2FyZC5jZWxsc1RvQ2hlY2subGVuZ3RoID09PSAwKSB7XG4gICAgICBhaUJvYXJkLmlzQWlTZWVraW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhaUF0dGFja2luZyxcbiAgICBwbGF5ZXJBdHRhY2tpbmcsXG4gICAgYWlNYXRjaENsaWNrZWQsXG4gICAgcGxhY2VtZW50Q2xpY2tlZCxcbiAgICByYW5kb21TaGlwc0NsaWNrZWQsXG4gICAgcm90YXRlQ2xpY2tlZCxcbiAgICB1c2VyU2hpcFN1bmssXG4gICAgZ2V0IGFpRGlmZmljdWx0eSgpIHtcbiAgICAgIHJldHVybiBhaURpZmZpY3VsdHk7XG4gICAgfSxcbiAgICBzZXQgYWlEaWZmaWN1bHR5KGRpZmYpIHtcbiAgICAgIGlmIChkaWZmID09PSAxIHx8IGRpZmYgPT09IDIgfHwgZGlmZiA9PT0gMykgYWlEaWZmaWN1bHR5ID0gZGlmZjtcbiAgICB9LFxuICAgIGdldCB1c2VyQm9hcmQoKSB7XG4gICAgICByZXR1cm4gdXNlckJvYXJkO1xuICAgIH0sXG4gICAgc2V0IHVzZXJCb2FyZChib2FyZCkge1xuICAgICAgdXNlckJvYXJkID0gYm9hcmQ7XG4gICAgfSxcbiAgICBnZXQgYWlCb2FyZCgpIHtcbiAgICAgIHJldHVybiBhaUJvYXJkO1xuICAgIH0sXG4gICAgc2V0IGFpQm9hcmQoYm9hcmQpIHtcbiAgICAgIGFpQm9hcmQgPSBib2FyZDtcbiAgICB9LFxuICAgIGdldCB1c2VyQ2FudmFzQ29udGFpbmVyKCkge1xuICAgICAgcmV0dXJuIHVzZXJDYW52YXNDb250YWluZXI7XG4gICAgfSxcbiAgICBzZXQgdXNlckNhbnZhc0NvbnRhaW5lcihjYW52YXMpIHtcbiAgICAgIHVzZXJDYW52YXNDb250YWluZXIgPSBjYW52YXM7XG4gICAgfSxcbiAgICBnZXQgYWlDYW52YXNDb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gYWlDYW52YXNDb250YWluZXI7XG4gICAgfSxcbiAgICBzZXQgYWlDYW52YXNDb250YWluZXIoY2FudmFzKSB7XG4gICAgICBhaUNhbnZhc0NvbnRhaW5lciA9IGNhbnZhcztcbiAgICB9LFxuICAgIGdldCBwbGFjZW1lbnRDYW52YXNjb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyO1xuICAgIH0sXG4gICAgc2V0IHBsYWNlbWVudENhbnZhc0NvbnRhaW5lcihjYW52YXMpIHtcbiAgICAgIHBsYWNlbWVudENhbnZhc0NvbnRhaW5lciA9IGNhbnZhcztcbiAgICB9LFxuICAgIGdldCBzb3VuZFBsYXllcigpIHtcbiAgICAgIHJldHVybiBzb3VuZFBsYXllcjtcbiAgICB9LFxuICAgIHNldCBzb3VuZFBsYXllcihhTW9kdWxlKSB7XG4gICAgICBzb3VuZFBsYXllciA9IGFNb2R1bGU7XG4gICAgfSxcbiAgICBnZXQgd2ViSW50ZXJmYWNlKCkge1xuICAgICAgcmV0dXJuIHdlYkludGVyZmFjZTtcbiAgICB9LFxuICAgIHNldCB3ZWJJbnRlcmZhY2UoYU1vZHVsZSkge1xuICAgICAgd2ViSW50ZXJmYWNlID0gYU1vZHVsZTtcbiAgICB9LFxuICAgIGdldCBnYW1lTG9nKCkge1xuICAgICAgcmV0dXJuIGdhbWVMb2c7XG4gICAgfSxcbiAgICBzZXQgZ2FtZUxvZyhhTW9kdWxlKSB7XG4gICAgICBnYW1lTG9nID0gYU1vZHVsZTtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZU1hbmFnZXI7XG4iLCIvKiBUaGlzIG1vZHVsZSBpcyB1c2VkIHRvIHBsYXkgdGhlIGdhbWVzIHNvdW5kIGVmZmVjdHMuIEFzIHRoZXJlIGFyZVxubm90IG1hbnkgc291bmRzIGluIHRvdGFsLCBlYWNoIHNvdW5kIGdldHMgaXRzIG93biBtZXRob2QgZm9yIHBsYXlpbmcuICovXG5cbmltcG9ydCBoaXRTb3VuZCBmcm9tIFwiLi4vU291bmQgRWZmZWN0cy9leHBsb3Npb24ubXAzXCI7XG5pbXBvcnQgbWlzc1NvdW5kIGZyb20gXCIuLi9Tb3VuZCBFZmZlY3RzL21pc3MubXAzXCI7XG5pbXBvcnQgYXR0YWNrU291bmQgZnJvbSBcIi4uL1NvdW5kIEVmZmVjdHMvbGFzZXIubXAzXCI7XG5cbmNvbnN0IGF0dGFja0F1ZGlvID0gbmV3IEF1ZGlvKGF0dGFja1NvdW5kKTtcbmNvbnN0IGhpdEF1ZGlvID0gbmV3IEF1ZGlvKGhpdFNvdW5kKTtcbmNvbnN0IG1pc3NBdWRpbyA9IG5ldyBBdWRpbyhtaXNzU291bmQpO1xuXG5jb25zdCBzb3VuZHMgPSAoKSA9PiB7XG4gIC8vIEZsYWcgZm9yIG11dGluZ1xuICBsZXQgaXNNdXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHBsYXlIaXQgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBoaXRBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgaGl0QXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlNaXNzID0gKCkgPT4ge1xuICAgIGlmIChpc011dGVkKSByZXR1cm47XG4gICAgLy8gUmVzZXQgYXVkaW8gdG8gYmVnaW5uaW5nIGFuZCBwbGF5IGl0XG4gICAgbWlzc0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICBtaXNzQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlBdHRhY2sgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBhdHRhY2tBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgYXR0YWNrQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxheUhpdCxcbiAgICBwbGF5TWlzcyxcbiAgICBwbGF5QXR0YWNrLFxuICAgIGdldCBpc011dGVkKCkge1xuICAgICAgcmV0dXJuIGlzTXV0ZWQ7XG4gICAgfSxcbiAgICBzZXQgaXNNdXRlZChib29sKSB7XG4gICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSkgaXNNdXRlZCA9IGJvb2w7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvdW5kcztcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vKiBUaGlzIG1vZHVsZSBpcyByZXNwb25zaWJsZSBmb3Igc2V0dGluZyB1cCBldmVudCBoYW5kbGVycyBmb3IgdGhlXG4gIG1haW4gVUkgYnV0dG9ucywgYW5kIGhhcyBtZXRob2RzIHVzZWQgYnkgdGhvc2UgaGFuZGxlcnMgdGhhdCBjaGFuZ2VcbiAgdGhlIHN0YXRlIG9mIHRoZSBVSSBieSBjaGFuZ2luZyB2YXJpb3VzIGVsZW1lbnQgY2xhc3Nlcy5cbiAgXG4gIFRoaXMgYWxsb3dzIGZvciBtZXRob2RzIHRoYXQgdHJhbnNpdGlvbiBmcm9tIG9uZSBwYXJ0IG9mIHRoZSBnYW1lIHRvIHRoZSBuZXh0LiAqL1xuY29uc3Qgd2ViSW50ZXJmYWNlID0gKGdtKSA9PiB7XG4gIC8vIFJlZmVyZW5jZXMgdG8gbWFpbiBlbGVtZW50c1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XG4gIGNvbnN0IHBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50XCIpO1xuICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzZXRcIik7XG5cbiAgLy8gUmVmZXJlbmNlIHRvIGJ0biBlbGVtZW50c1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnQtYnRuXCIpO1xuICBjb25zdCBhaU1hdGNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1tYXRjaC1idG5cIik7XG5cbiAgY29uc3QgcmFuZG9tU2hpcHNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJhbmRvbS1zaGlwcy1idG5cIik7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ0blwiKTtcblxuICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzZXQtYnRuXCIpO1xuXG4gIC8vIE1ldGhvZCBmb3IgaXRlcmF0aW5nIHRocm91Z2ggZGlyZWN0aW9uc1xuICBjb25zdCByb3RhdGVEaXJlY3Rpb24gPSAoKSA9PiB7XG4gICAgZ20ucm90YXRlQ2xpY2tlZCgpO1xuICB9O1xuXG4gIC8vICNyZWdpb24gQmFzaWMgbWV0aG9kcyBmb3Igc2hvd2luZy9oaWRpbmcgZWxlbWVudHNcbiAgLy8gTW92ZSBhbnkgYWN0aXZlIHNlY3Rpb25zIG9mZiB0aGUgc2NyZWVuXG4gIGNvbnN0IGhpZGVBbGwgPSAoKSA9PiB7XG4gICAgbWVudS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIHBsYWNlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGdhbWUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICByZXNldC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIG1lbnUgVUlcbiAgY29uc3Qgc2hvd01lbnUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIG1lbnUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBzaGlwIHBsYWNlbWVudCBVSVxuICBjb25zdCBzaG93UGxhY2VtZW50ID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBnYW1lIFVJXG4gIGNvbnN0IHNob3dHYW1lID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgcmVzZXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaHJpbmsgdGhlIHRpdGxlXG4gIGNvbnN0IHNocmlua1RpdGxlID0gKCkgPT4ge1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoXCJzaHJpbmtcIik7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gSGlnaCBsZXZlbCByZXNwb25zZXMgdG8gY2xpY2tzXG4gIC8vIEhhbmRlIGNsaWNrcyBvbiB0aGUgc3RhcnQgZ2FtZSBidXR0b25cbiAgY29uc3QgaGFuZGxlU3RhcnRDbGljayA9ICgpID0+IHtcbiAgICBzaHJpbmtUaXRsZSgpO1xuICAgIHNob3dQbGFjZW1lbnQoKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVBaU1hdGNoQ2xpY2sgPSAoKSA9PiB7XG4gICAgLy8gU2V0IHN0eWxlIGNsYXNzIGJhc2VkIG9uIGlmIHVzZXJCb2FyZCBpcyBhaSAoaWYgZmFsc2UsIHNldCBhY3RpdmUgYi9jIHdpbGwgYmUgdHJ1ZSBhZnRlciBjbGljaylcbiAgICBpZiAoZ20uYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmcgPT09IGZhbHNlKVxuICAgICAgYWlNYXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGVsc2UgYWlNYXRjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIGdtLmFpTWF0Y2hDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJhbmRvbSBzaGlwcyBidXR0b24gY2xpY2tcbiAgY29uc3QgaGFuZGxlUmFuZG9tU2hpcHNDbGljayA9ICgpID0+IHtcbiAgICBnbS5yYW5kb21TaGlwc0NsaWNrZWQoKTtcbiAgfTtcblxuICAvLyBIYW5kbGUgcmVzZXQgYnV0dG9uIGNsaWNrXG4gIGNvbnN0IGhhbmRsZVJlc2V0Q2xpY2sgPSAoKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFkZCBjbGFzc2VzIHRvIHNoaXAgZGl2cyB0byByZXByZXNlbnQgcGxhY2VkL2Rlc3Ryb3llZFxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBIYW5kbGUgYnJvd3NlciBldmVudHNcbiAgcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVSb3RhdGVDbGljayk7XG4gIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVTdGFydENsaWNrKTtcbiAgYWlNYXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQWlNYXRjaENsaWNrKTtcbiAgcmFuZG9tU2hpcHNCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVJhbmRvbVNoaXBzQ2xpY2spO1xuICByZXNldEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUmVzZXRDbGljayk7XG5cbiAgcmV0dXJuIHsgc2hvd0dhbWUsIHNob3dNZW51LCBzaG93UGxhY2VtZW50IH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB3ZWJJbnRlcmZhY2U7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXG4gICB2Mi4wIHwgMjAxMTAxMjZcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXG4qL1xuXG5odG1sLFxuYm9keSxcbmRpdixcbnNwYW4sXG5hcHBsZXQsXG5vYmplY3QsXG5pZnJhbWUsXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYsXG5wLFxuYmxvY2txdW90ZSxcbnByZSxcbmEsXG5hYmJyLFxuYWNyb255bSxcbmFkZHJlc3MsXG5iaWcsXG5jaXRlLFxuY29kZSxcbmRlbCxcbmRmbixcbmVtLFxuaW1nLFxuaW5zLFxua2JkLFxucSxcbnMsXG5zYW1wLFxuc21hbGwsXG5zdHJpa2UsXG5zdHJvbmcsXG5zdWIsXG5zdXAsXG50dCxcbnZhcixcbmIsXG51LFxuaSxcbmNlbnRlcixcbmRsLFxuZHQsXG5kZCxcbm9sLFxudWwsXG5saSxcbmZpZWxkc2V0LFxuZm9ybSxcbmxhYmVsLFxubGVnZW5kLFxudGFibGUsXG5jYXB0aW9uLFxudGJvZHksXG50Zm9vdCxcbnRoZWFkLFxudHIsXG50aCxcbnRkLFxuYXJ0aWNsZSxcbmFzaWRlLFxuY2FudmFzLFxuZGV0YWlscyxcbmVtYmVkLFxuZmlndXJlLFxuZmlnY2FwdGlvbixcbmZvb3RlcixcbmhlYWRlcixcbmhncm91cCxcbm1lbnUsXG5uYXYsXG5vdXRwdXQsXG5ydWJ5LFxuc2VjdGlvbixcbnN1bW1hcnksXG50aW1lLFxubWFyayxcbmF1ZGlvLFxudmlkZW8ge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJvcmRlcjogMDtcbiAgZm9udC1zaXplOiAxMDAlO1xuICBmb250OiBpbmhlcml0O1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXG5hcnRpY2xlLFxuYXNpZGUsXG5kZXRhaWxzLFxuZmlnY2FwdGlvbixcbmZpZ3VyZSxcbmZvb3RlcixcbmhlYWRlcixcbmhncm91cCxcbm1lbnUsXG5uYXYsXG5zZWN0aW9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5ib2R5IHtcbiAgbGluZS1oZWlnaHQ6IDE7XG59XG5vbCxcbnVsIHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbn1cbmJsb2NrcXVvdGUsXG5xIHtcbiAgcXVvdGVzOiBub25lO1xufVxuYmxvY2txdW90ZTpiZWZvcmUsXG5ibG9ja3F1b3RlOmFmdGVyLFxucTpiZWZvcmUsXG5xOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgY29udGVudDogbm9uZTtcbn1cbnRhYmxlIHtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9yZXNldC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7OztDQUdDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpRkUsU0FBUztFQUNULFVBQVU7RUFDVixTQUFTO0VBQ1QsZUFBZTtFQUNmLGFBQWE7RUFDYix3QkFBd0I7QUFDMUI7QUFDQSxnREFBZ0Q7QUFDaEQ7Ozs7Ozs7Ozs7O0VBV0UsY0FBYztBQUNoQjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBOztFQUVFLGdCQUFnQjtBQUNsQjtBQUNBOztFQUVFLFlBQVk7QUFDZDtBQUNBOzs7O0VBSUUsV0FBVztFQUNYLGFBQWE7QUFDZjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLGlCQUFpQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcXG4gICB2Mi4wIHwgMjAxMTAxMjZcXG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxcbiovXFxuXFxuaHRtbCxcXG5ib2R5LFxcbmRpdixcXG5zcGFuLFxcbmFwcGxldCxcXG5vYmplY3QsXFxuaWZyYW1lLFxcbmgxLFxcbmgyLFxcbmgzLFxcbmg0LFxcbmg1LFxcbmg2LFxcbnAsXFxuYmxvY2txdW90ZSxcXG5wcmUsXFxuYSxcXG5hYmJyLFxcbmFjcm9ueW0sXFxuYWRkcmVzcyxcXG5iaWcsXFxuY2l0ZSxcXG5jb2RlLFxcbmRlbCxcXG5kZm4sXFxuZW0sXFxuaW1nLFxcbmlucyxcXG5rYmQsXFxucSxcXG5zLFxcbnNhbXAsXFxuc21hbGwsXFxuc3RyaWtlLFxcbnN0cm9uZyxcXG5zdWIsXFxuc3VwLFxcbnR0LFxcbnZhcixcXG5iLFxcbnUsXFxuaSxcXG5jZW50ZXIsXFxuZGwsXFxuZHQsXFxuZGQsXFxub2wsXFxudWwsXFxubGksXFxuZmllbGRzZXQsXFxuZm9ybSxcXG5sYWJlbCxcXG5sZWdlbmQsXFxudGFibGUsXFxuY2FwdGlvbixcXG50Ym9keSxcXG50Zm9vdCxcXG50aGVhZCxcXG50cixcXG50aCxcXG50ZCxcXG5hcnRpY2xlLFxcbmFzaWRlLFxcbmNhbnZhcyxcXG5kZXRhaWxzLFxcbmVtYmVkLFxcbmZpZ3VyZSxcXG5maWdjYXB0aW9uLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbm91dHB1dCxcXG5ydWJ5LFxcbnNlY3Rpb24sXFxuc3VtbWFyeSxcXG50aW1lLFxcbm1hcmssXFxuYXVkaW8sXFxudmlkZW8ge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJvcmRlcjogMDtcXG4gIGZvbnQtc2l6ZTogMTAwJTtcXG4gIGZvbnQ6IGluaGVyaXQ7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cXG5hcnRpY2xlLFxcbmFzaWRlLFxcbmRldGFpbHMsXFxuZmlnY2FwdGlvbixcXG5maWd1cmUsXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxuc2VjdGlvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuYm9keSB7XFxuICBsaW5lLWhlaWdodDogMTtcXG59XFxub2wsXFxudWwge1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG59XFxuYmxvY2txdW90ZSxcXG5xIHtcXG4gIHF1b3Rlczogbm9uZTtcXG59XFxuYmxvY2txdW90ZTpiZWZvcmUsXFxuYmxvY2txdW90ZTphZnRlcixcXG5xOmJlZm9yZSxcXG5xOmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgY29udGVudDogbm9uZTtcXG59XFxudGFibGUge1xcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIENvbG9yIFJ1bGVzICovXG46cm9vdCB7XG4gIC0tY29sb3JBMTogIzcyMmI5NDtcbiAgLS1jb2xvckEyOiAjYTkzNmUwO1xuICAtLWNvbG9yQzogIzM3ZTAyYjtcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xuICAtLWNvbG9yQjI6ICNlMDM2MWY7XG5cbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xuICAtLWJnLWNvbG9yMjogaHNsKDAsIDAlLCAzMiUpO1xuICAtLXRleHQtY29sb3I6IGhzbCgwLCAwJSwgOTElKTtcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcbn1cblxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xuYSB7XG4gIGNvbG9yOiB2YXIoLS1saW5rLWNvbG9yKTtcbn1cblxuYm9keSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICBoZWlnaHQ6IDEwMHZoO1xuICB3aWR0aDogMTAwdnc7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG59XG5cbi5jYW52YXMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gMWZyO1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XG59XG5cbi5jYW52YXMtY29udGFpbmVyID4gKiB7XG4gIGdyaWQtcm93OiAtMSAvIDE7XG4gIGdyaWQtY29sdW1uOiAtMSAvIDE7XG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBsb2FkaW5nLXNjcmVlbiAqL1xuLmxvYWRpbmctc2NyZWVuIHtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG59XG5cbi5sb2FkaW5nLXNjcmVlbi5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTUwJSk7XG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBtYWluLWNvbnRlbnQgKi9cbi5tYWluLWNvbnRlbnQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMjAsIDUlKSAvIHJlcGVhdCgyMCwgNSUpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLyogdGl0bGUgZ3JpZCAqL1xuLnRpdGxlIHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDIgLyA2O1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yMik7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi50aXRsZS10ZXh0IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiA0LjhyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggdmFyKC0tY29sb3JCMSk7XG4gIGNvbG9yOiB2YXIoLS1jb2xvckIyKTtcblxuICB0cmFuc2l0aW9uOiBmb250LXNpemUgMC44cyBlYXNlLWluLW91dDtcbn1cblxuLnRpdGxlLnNocmluayB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC41KSB0cmFuc2xhdGVZKC01MCUpO1xufVxuXG4udGl0bGUuc2hyaW5rIC50aXRsZS10ZXh0IHtcbiAgZm9udC1zaXplOiAzLjVyZW07XG59XG4vKiAjcmVnaW9uIG1lbnUgc2VjdGlvbiAqL1xuLm1lbnUge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogOCAvIDE4O1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDUlIDFmciA1JSAxZnIgNSUgMWZyIC8gMWZyO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxuICAgIFwiLlwiXG4gICAgXCJjcmVkaXRzXCJcbiAgICBcIi5cIlxuICAgIFwic3RhcnQtZ2FtZVwiXG4gICAgXCIuXCJcbiAgICBcImFpLW1hdGNoXCJcbiAgICBcIi5cIlxuICAgIFwib3B0aW9uc1wiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4ubWVudS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTE1MCUpO1xufVxuXG4ubWVudSAuY3JlZGl0cyB7XG4gIGdyaWQtYXJlYTogY3JlZGl0cztcbn1cblxuLm1lbnUgLnN0YXJ0IHtcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xuICBhbGlnbi1zZWxmOiBlbmQ7XG59XG5cbi5tZW51IC5haS1tYXRjaCB7XG4gIGdyaWQtYXJlYTogYWktbWF0Y2g7XG59XG5cbi5tZW51IC5vcHRpb25zIHtcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bixcbi5tZW51IC5vcHRpb25zLWJ0bixcbi5tZW51IC5haS1tYXRjaC1idG4ge1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxODBweDtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bjpob3Zlcixcbi5tZW51IC5vcHRpb25zLWJ0bjpob3Zlcixcbi5tZW51IC5haS1tYXRjaC1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLm1lbnUgLmFpLW1hdGNoLWJ0bi5hY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIHBsYWNlbWVudCBzZWN0aW9uICovXG4ucGxhY2VtZW50IHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDYgLyAyMDtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDUlIG1pbi1jb250ZW50IDUlIC8gMWZyIDUlIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuXCJcbiAgICBcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXCJcbiAgICBcIi4gLiAuXCJcbiAgICBcInNoaXBzIHNoaXBzIHNoaXBzXCJcbiAgICBcIi4gLiAuIFwiXG4gICAgXCJyYW5kb20gLiByb3RhdGVcIlxuICAgIFwiLiAuIC5cIlxuICAgIFwiY2FudmFzIGNhbnZhcyBjYW52YXNcIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcbiAgZ3JpZC1hcmVhOiBpbnN0cnVjdGlvbnM7XG59XG5cbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucy10ZXh0IHtcbiAgZm9udC1zaXplOiAyLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMXB4IDFweCAxcHggdmFyKC0tYmctY29sb3IpO1xufVxuXG4ucGxhY2VtZW50IC5zaGlwcy10by1wbGFjZSB7XG4gIGdyaWQtYXJlYTogc2hpcHM7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcyB7XG4gIGdyaWQtYXJlYTogcmFuZG9tO1xuICBqdXN0aWZ5LXNlbGY6IGVuZDtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlIHtcbiAgZ3JpZC1hcmVhOiByb3RhdGU7XG4gIGp1c3RpZnktc2VsZjogc3RhcnQ7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG4sXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuIHtcbiAgaGVpZ2h0OiA2MHB4O1xuICB3aWR0aDogMTgwcHg7XG5cbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46aG92ZXIsXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmhvdmVyIHtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46YWN0aXZlLFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjphY3RpdmUge1xuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IGNhbnZhcztcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XG59XG5cbi5wbGFjZW1lbnQuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xufVxuXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JDKTtcbn1cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cbi5nYW1lIHtcbiAgZ3JpZC1jb2x1bW46IDIgLyAyMDtcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZTpcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXG4gICAgbWluLWNvbnRlbnQgMWZyIC8gcmVwZWF0KDQsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuIC4gLiAuXCJcbiAgICBcIi4gbG9nIGxvZyAuXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cIlxuICAgIFwiLiAuIC4gLlwiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xufVxuXG4uZ2FtZSAudXNlci1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xufVxuXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XG59XG5cbi5nYW1lIC51c2VyLWluZm8ge1xuICBncmlkLWFyZWE6IHVzZXItaW5mbztcbn1cblxuLmdhbWUgLmFpLWluZm8ge1xuICBncmlkLWFyZWE6IGFpLWluZm87XG59XG5cbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xufVxuXG4uZ2FtZSAubG9nIHtcbiAgZ3JpZC1hcmVhOiBsb2c7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIG1pbi1jb250ZW50IDEwcHggMWZyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcInNjZW5lIC4gdGV4dFwiO1xuXG4gIHdpZHRoOiA1MDBweDtcblxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1jb2xvckIxKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbn1cblxuLmdhbWUgLmxvZyAuc2NlbmUge1xuICBncmlkLWFyZWE6IHNjZW5lO1xuXG4gIGhlaWdodDogMTUwcHg7XG4gIHdpZHRoOiAxNTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XG59XG5cbi5nYW1lIC5sb2cgLnNjZW5lLWltZyB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xuICBmb250LXNpemU6IDEuMTVyZW07XG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cbn1cblxuLmdhbWUuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIFJlc2V0ICovXG4ucmVzZXQge1xuICBncmlkLWNvbHVtbjogMTcgLyAyMDtcbiAgZ3JpZC1yb3c6IDIgLyA0O1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG5cbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcbn1cblxuLnJlc2V0IC5yZXNldC1idG4ge1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ucmVzZXQgLnJlc2V0LWJ0bjpob3ZlciB7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ucmVzZXQgLnJlc2V0LWJ0bjphY3RpdmUge1xuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnJlc2V0LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNTAlKTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjZW5kcmVnaW9uICovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQ2hCO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGtCQUFrQjs7RUFFbEIsMkJBQTJCO0VBQzNCLDRCQUE0QjtFQUM1Qiw2QkFBNkI7RUFDN0IsK0JBQStCO0FBQ2pDOztBQUVBLG9DQUFvQztBQUNwQztFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGlDQUFpQztFQUNqQyx3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLFlBQVk7RUFDWixnQkFBZ0I7O0VBRWhCLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLGFBQWE7RUFDYix3QkFBd0I7RUFDeEIsa0JBQWtCO0VBQ2xCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixtQkFBbUI7QUFDckI7O0FBRUEsZUFBZTs7QUFFZiwyQkFBMkI7QUFDM0I7RUFDRSxzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUEsZUFBZTs7QUFFZix5QkFBeUI7QUFDekI7RUFDRSxhQUFhO0VBQ2IsOENBQThDO0VBQzlDLGtCQUFrQjs7RUFFbEIsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQSxlQUFlO0FBQ2Y7RUFDRSxtQkFBbUI7RUFDbkIsZUFB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O0VBQ1osV0FBVztBQUNiOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixnQkFBZ0IsRUFBRSxrQkFBa0I7QUFDdEM7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7QUFDQSxlQUFlOztBQUVmLGtCQUFrQjtBQUNsQjtFQUNFLG9CQUFvQjtFQUNwQixlQUFlOztFQUVmLGFBQWE7O0VBRWIsbUJBQW1COztFQUVuQixzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVzs7RUFFWCxpQkFBaUI7RUFDakIsaUJBQWlCO0VBQ2pCLHdCQUF3QjtFQUN4Qix3Q0FBd0M7O0VBRXhDLGdDQUFnQztFQUNoQywrQkFBK0I7RUFDL0IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usb0VBQW9FO0FBQ3RFOztBQUVBO0VBQ0Usb0VBQW9FO0FBQ3RFOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCOztBQUVBLGVBQWU7O0FBRWYsZUFBZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBDb2xvciBSdWxlcyAqL1xcbjpyb290IHtcXG4gIC0tY29sb3JBMTogIzcyMmI5NDtcXG4gIC0tY29sb3JBMjogI2E5MzZlMDtcXG4gIC0tY29sb3JDOiAjMzdlMDJiO1xcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xcblxcbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcXG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcXG59XFxuXFxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xcbmEge1xcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcblxcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxufVxcblxcbi5jYW52YXMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcXG4gIGdyaWQtY29sdW1uOiAtMSAvIDE7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIGxvYWRpbmctc2NyZWVuICovXFxuLmxvYWRpbmctc2NyZWVuIHtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4ubG9hZGluZy1zY3JlZW4uaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNTAlKTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXFxuLm1haW4tY29udGVudCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4vKiB0aXRsZSBncmlkICovXFxuLnRpdGxlIHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogMiAvIDY7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcblxcbi50aXRsZS10ZXh0IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogNC44cmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggdmFyKC0tY29sb3JCMSk7XFxuICBjb2xvcjogdmFyKC0tY29sb3JCMik7XFxuXFxuICB0cmFuc2l0aW9uOiBmb250LXNpemUgMC44cyBlYXNlLWluLW91dDtcXG59XFxuXFxuLnRpdGxlLnNocmluayB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDAuNSkgdHJhbnNsYXRlWSgtNTAlKTtcXG59XFxuXFxuLnRpdGxlLnNocmluayAudGl0bGUtdGV4dCB7XFxuICBmb250LXNpemU6IDMuNXJlbTtcXG59XFxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cXG4ubWVudSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDggLyAxODtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCA1JSAxZnIgNSUgMWZyIDUlIDFmciAvIDFmcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcImNyZWRpdHNcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwic3RhcnQtZ2FtZVxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJhaS1tYXRjaFxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJvcHRpb25zXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4ubWVudS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xNTAlKTtcXG59XFxuXFxuLm1lbnUgLmNyZWRpdHMge1xcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xcbn1cXG5cXG4ubWVudSAuc3RhcnQge1xcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xcbiAgYWxpZ24tc2VsZjogZW5kO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gge1xcbiAgZ3JpZC1hcmVhOiBhaS1tYXRjaDtcXG59XFxuXFxuLm1lbnUgLm9wdGlvbnMge1xcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG4sXFxuLm1lbnUgLm9wdGlvbnMtYnRuLFxcbi5tZW51IC5haS1tYXRjaC1idG4ge1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgd2lkdGg6IDE4MHB4O1xcblxcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxcbi5tZW51IC5vcHRpb25zLWJ0bjpob3ZlcixcXG4ubWVudSAuYWktbWF0Y2gtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gtYnRuLmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cXG4ucGxhY2VtZW50IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogNiAvIDIwO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgNSUgbWluLWNvbnRlbnQgNSUgLyAxZnIgNSUgMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLlxcXCJcXG4gICAgXFxcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXFxcIlxcbiAgICBcXFwiLiAuIC5cXFwiXFxuICAgIFxcXCJzaGlwcyBzaGlwcyBzaGlwc1xcXCJcXG4gICAgXFxcIi4gLiAuIFxcXCJcXG4gICAgXFxcInJhbmRvbSAuIHJvdGF0ZVxcXCJcXG4gICAgXFxcIi4gLiAuXFxcIlxcbiAgICBcXFwiY2FudmFzIGNhbnZhcyBjYW52YXNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcblxcbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucyB7XFxuICBncmlkLWFyZWE6IGluc3RydWN0aW9ucztcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zLXRleHQge1xcbiAgZm9udC1zaXplOiAyLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcXG4gIGdyaWQtYXJlYTogc2hpcHM7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzIHtcXG4gIGdyaWQtYXJlYTogcmFuZG9tO1xcbiAganVzdGlmeS1zZWxmOiBlbmQ7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZSB7XFxuICBncmlkLWFyZWE6IHJvdGF0ZTtcXG4gIGp1c3RpZnktc2VsZjogc3RhcnQ7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG4sXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0biB7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTgwcHg7XFxuXFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46aG92ZXIsXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjpob3ZlciB7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUsXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjphY3RpdmUge1xcbiAgdGV4dC1zaGFkb3c6IDRweCA0cHggMXB4IHZhcigtLWNvbG9yQyksIC00cHggLTRweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogY2FudmFzO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5wbGFjZW1lbnQuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNTAlKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckMpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cXG4uZ2FtZSB7XFxuICBncmlkLWNvbHVtbjogMiAvIDIwO1xcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbiAgZ3JpZC10ZW1wbGF0ZTpcXG4gICAgcmVwZWF0KDIsIG1pbm1heCgxMHB4LCAxZnIpIG1pbi1jb250ZW50KSBtaW5tYXgoMTBweCwgMWZyKVxcbiAgICBtaW4tY29udGVudCAxZnIgLyByZXBlYXQoNCwgMWZyKTtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwiLiBsb2cgbG9nIC5cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXFxcIlxcbiAgICBcXFwiLiAuIC4gLlxcXCJcXG4gICAgXFxcInVzZXItaW5mbyB1c2VyLWluZm8gYWktaW5mbyBhaS1pbmZvXFxcIlxcbiAgICBcXFwiLiAuIC4gLlxcXCI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG59XFxuXFxuLmdhbWUgLmNhbnZhcy1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxufVxcblxcbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IGFpLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAudXNlci1pbmZvIHtcXG4gIGdyaWQtYXJlYTogdXNlci1pbmZvO1xcbn1cXG5cXG4uZ2FtZSAuYWktaW5mbyB7XFxuICBncmlkLWFyZWE6IGFpLWluZm87XFxufVxcblxcbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XFxufVxcblxcbi5nYW1lIC5sb2cge1xcbiAgZ3JpZC1hcmVhOiBsb2c7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gbWluLWNvbnRlbnQgMTBweCAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcXFwic2NlbmUgLiB0ZXh0XFxcIjtcXG5cXG4gIHdpZHRoOiA1MDBweDtcXG5cXG4gIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWNvbG9yQjEpO1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xcbn1cXG5cXG4uZ2FtZSAubG9nIC5zY2VuZSB7XFxuICBncmlkLWFyZWE6IHNjZW5lO1xcblxcbiAgaGVpZ2h0OiAxNTBweDtcXG4gIHdpZHRoOiAxNTBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQjEpO1xcbn1cXG5cXG4uZ2FtZSAubG9nIC5zY2VuZS1pbWcge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcXG4gIGdyaWQtYXJlYTogdGV4dDtcXG4gIGZvbnQtc2l6ZTogMS4xNXJlbTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cXG59XFxuXFxuLmdhbWUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNTAlKTtcXG59XFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gUmVzZXQgKi9cXG4ucmVzZXQge1xcbiAgZ3JpZC1jb2x1bW46IDE3IC8gMjA7XFxuICBncmlkLXJvdzogMiAvIDQ7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcblxcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4ucmVzZXQgLnJlc2V0LWJ0biB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnJlc2V0IC5yZXNldC1idG46aG92ZXIge1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi5yZXNldCAucmVzZXQtYnRuOmFjdGl2ZSB7XFxuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnJlc2V0LmhpZGRlbiB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTUwJSk7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsInZhciBtYXAgPSB7XG5cdFwiLi9BVC9hdF9hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2sxLmpwZ1wiLFxuXHRcIi4vQVQvYXRfYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrMi5qcGdcIixcblx0XCIuL0FUL2F0X2F0dGFjazMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazMuanBnXCIsXG5cdFwiLi9BVC9hdF9hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2s0LmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuMS5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjIuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW4zLmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuNC5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDEuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQyLmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0My5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDQuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQ1LmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrMS5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazIuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2szLmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrNC5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjEuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW4yLmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuMy5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjQuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW41LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW41LmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0MS5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDIuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQzLmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0NC5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDUuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQ2LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQ2LmpwZ1wiLFxuXHRcIi4vTC9sX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9hdHRhY2sxLmpwZ1wiLFxuXHRcIi4vTC9sX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vTC9sX2F0dGFjazMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vTC9sX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9hdHRhY2s0LmpwZ1wiLFxuXHRcIi4vTC9sX2F0dGFjazUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9hdHRhY2s1LmpwZ1wiLFxuXHRcIi4vTC9sX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9nZW4xLmpwZ1wiLFxuXHRcIi4vTC9sX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9nZW4yLmpwZ1wiLFxuXHRcIi4vTC9sX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9nZW4zLmpwZ1wiLFxuXHRcIi4vTC9sX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9nZW40LmpwZ1wiLFxuXHRcIi4vTC9sX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9oaXQxLmpwZ1wiLFxuXHRcIi4vTC9sX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9oaXQyLmpwZ1wiLFxuXHRcIi4vTC9sX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9oaXQzLmpwZ1wiLFxuXHRcIi4vTC9sX2hpdDUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbF9oaXQ1LmpwZ1wiLFxuXHRcIi4vTC9sZ2VuNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sZ2VuNS5qcGdcIixcblx0XCIuL0wvbGhpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbGhpdDQuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2sxLmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrMi5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazMuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2s0LmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuMS5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjIuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW4zLmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuNC5qcGdcIixcblx0XCIuL1NQL3NwX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2hpdDEuanBnXCIsXG5cdFwiLi9TUC9zcF9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9oaXQyLmpwZ1wiLFxuXHRcIi4vU1Avc3BfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfaGl0My5qcGdcIixcblx0XCIuL1ZNL212X2hpdDUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL212X2hpdDUuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2sxLmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrMi5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazMuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2s0LmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrNS5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazYuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazYuanBnXCIsXG5cdFwiLi9WTS92bV9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW4xLmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuMi5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjMuanBnXCIsXG5cdFwiLi9WTS92bV9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW40LmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuNS5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjYuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjYuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQxLmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0Mi5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDMuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQ0LmpwZ1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9zY2VuZS1pbWFnZXMgc3luYyByZWN1cnNpdmUgXFxcXC5qcGckL1wiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgIXNjcmlwdFVybCkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEltcG9ydCBzdHlsZSBzaGVldHNcbmltcG9ydCBcIi4vc3R5bGUvcmVzZXQuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlL3N0eWxlLmNzc1wiO1xuaW1wb3J0IGluaXRpYWxpemVHYW1lIGZyb20gXCIuL2hlbHBlcnMvaW5pdGlhbGl6ZUdhbWVcIjtcblxuaW5pdGlhbGl6ZUdhbWUoKTtcbiJdLCJuYW1lcyI6WyJTaGlwIiwiYWlBdHRhY2siLCJHYW1lYm9hcmQiLCJnbSIsInRoaXNHYW1lYm9hcmQiLCJtYXhCb2FyZFgiLCJtYXhCb2FyZFkiLCJzaGlwcyIsImFsbE9jY3VwaWVkQ2VsbHMiLCJjZWxsc1RvQ2hlY2siLCJtaXNzZXMiLCJoaXRzIiwiZGlyZWN0aW9uIiwiaGl0U2hpcFR5cGUiLCJpc0FpIiwiaXNBdXRvQXR0YWNraW5nIiwiaXNBaVNlZWtpbmciLCJnYW1lT3ZlciIsImNhbkF0dGFjayIsInJpdmFsQm9hcmQiLCJjYW52YXMiLCJhZGRTaGlwIiwicmVjZWl2ZUF0dGFjayIsImFsbFN1bmsiLCJsb2dTdW5rIiwiaXNDZWxsU3VuayIsImFscmVhZHlBdHRhY2tlZCIsInZhbGlkYXRlU2hpcCIsInNoaXAiLCJpc1ZhbGlkIiwiX2xvb3AiLCJpIiwib2NjdXBpZWRDZWxscyIsImlzQ2VsbE9jY3VwaWVkIiwic29tZSIsImNlbGwiLCJsZW5ndGgiLCJfcmV0IiwiYWRkQ2VsbHNUb0xpc3QiLCJmb3JFYWNoIiwicHVzaCIsInBvc2l0aW9uIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwic2hpcFR5cGVJbmRleCIsIm5ld1NoaXAiLCJhZGRNaXNzIiwiYWRkSGl0IiwidHlwZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiQXJyYXkiLCJpc0FycmF5IiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiaiIsImhpdCIsInRyeUFpQXR0YWNrIiwiZGVsYXkiLCJzaGlwQXJyYXkiLCJpc1N1bmsiLCJzdW5rZW5TaGlwcyIsImxvZ01zZyIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJwbGF5ZXIiLCJjb25jYXQiLCJ1c2VyU2hpcFN1bmsiLCJhdHRhY2tDb29yZHMiLCJhdHRhY2tlZCIsIm1pc3MiLCJjZWxsVG9DaGVjayIsImhhc01hdGNoaW5nQ2VsbCIsImRyYXdpbmdNb2R1bGUiLCJkcmF3IiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzWCIsImNhbnZhc1kiLCJvcHRpb25zIiwiZ3JpZEhlaWdodCIsImdyaWRXaWR0aCIsImN1cnJlbnRDZWxsIiwiY2FudmFzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9hcmRDYW52YXMiLCJhcHBlbmRDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9hcmRDdHgiLCJnZXRDb250ZXh0Iiwib3ZlcmxheUNhbnZhcyIsIm92ZXJsYXlDdHgiLCJjZWxsU2l6ZVgiLCJjZWxsU2l6ZVkiLCJnZXRNb3VzZUNlbGwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJtb3VzZVgiLCJjbGllbnRYIiwibGVmdCIsIm1vdXNlWSIsImNsaWVudFkiLCJ0b3AiLCJjZWxsWCIsIk1hdGgiLCJmbG9vciIsImNlbGxZIiwiZHJhd0hpdCIsImNvb3JkaW5hdGVzIiwiaGl0T3JNaXNzIiwiZHJhd01pc3MiLCJkcmF3U2hpcHMiLCJ1c2VyU2hpcHMiLCJoYW5kbGVNb3VzZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVNb3VzZUxlYXZlIiwiY2xlYXJSZWN0IiwiaGFuZGxlTW91c2VNb3ZlIiwibW91c2VDZWxsIiwicGxhY2VtZW50SGlnaGxpZ2h0IiwicGxhY2VtZW50Q2xpY2tlZCIsImF0dGFja0hpZ2hsaWdodCIsInBsYXllckF0dGFja2luZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibGluZXMiLCJjb250ZXh0IiwiZ3JpZFNpemUiLCJtaW4iLCJsaW5lQ29sb3IiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIngiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJ5IiwiZHJhd0NlbGwiLCJwb3NYIiwicG9zWSIsImZpbGxSZWN0IiwiYm9hcmQiLCJ1c2VyQm9hcmQiLCJhaUJvYXJkIiwibW91c2VDb29yZHMiLCJmaWxsU3R5bGUiLCJyYWRpdXMiLCJhcmMiLCJQSSIsImZpbGwiLCJkcmF3TGVuZ3RoIiwic2hpcHNDb3VudCIsImRpcmVjdGlvblgiLCJkaXJlY3Rpb25ZIiwiaGFsZkRyYXdMZW5ndGgiLCJyZW1haW5kZXJMZW5ndGgiLCJtYXhDb29yZGluYXRlWCIsIm1heENvb3JkaW5hdGVZIiwibWluQ29vcmRpbmF0ZVgiLCJtaW5Db29yZGluYXRlWSIsIm1heFgiLCJtYXhZIiwibWluWCIsIm1pblkiLCJpc091dE9mQm91bmRzIiwibmV4dFgiLCJuZXh0WSIsIlBsYXllciIsInByaXZhdGVOYW1lIiwidGhpc1BsYXllciIsIm5hbWUiLCJuZXdOYW1lIiwidG9TdHJpbmciLCJnYW1lYm9hcmQiLCJzZW5kQXR0YWNrIiwidmFsaWRhdGVBdHRhY2siLCJwbGF5ZXJCb2FyZCIsInNoaXBOYW1lcyIsImluZGV4IiwidGhpc1NoaXAiLCJzaXplIiwicGxhY2VtZW50RGlyZWN0aW9uWCIsInBsYWNlbWVudERpcmVjdGlvblkiLCJoYWxmU2l6ZSIsInJlbWFpbmRlclNpemUiLCJuZXdDb29yZHMiLCJhaUJyYWluIiwiYnJhaW4iLCJ1cGRhdGVQcm9icyIsImZpbmRSYW5kb21BdHRhY2siLCJyYW5kb20iLCJmaW5kR3JlYXRlc3RQcm9iQXR0YWNrIiwiYWxsUHJvYnMiLCJwcm9icyIsIm1heCIsIk5FR0FUSVZFX0lORklOSVRZIiwiYWlEaWZmaWN1bHR5IiwicmVzZXRIaXRBZGphY2VudEluY3JlYXNlcyIsImNvb3JkcyIsImRlc3Ryb3lNb2RlQ29vcmRzIiwiYWlBdHRhY2tpbmciLCJjcmVhdGVQcm9icyIsImNvbG9yTW9kIiwiYWRqYWNlbnRNb2QiLCJpbml0aWFsUHJvYnMiLCJtYXAiLCJyb3ciLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJpc1ZhbGlkQ2VsbCIsImNvbCIsIm51bVJvd3MiLCJudW1Db2xzIiwiaXNCb3VuZGFyeU9yTWlzcyIsImdldExhcmdlc3RSZW1haW5pbmdMZW5ndGgiLCJsYXJnZXN0U2hpcExlbmd0aCIsImdldFNtYWxsZXN0UmVtYWluaW5nTGVuZ3RoIiwic21hbGxlc3RTaGlwTGVuZ3RoIiwibG9hZEFkamFjZW50Q2VsbHMiLCJjZW50ZXJDZWxsIiwiYWRqYWNlbnRIaXRzIiwiYWRqYWNlbnRFbXB0aWVzIiwiX2NlbnRlckNlbGwiLCJfc2xpY2VkVG9BcnJheSIsImNlbnRlclgiLCJjZW50ZXJZIiwiYm90dG9tIiwicmlnaHQiLCJjaGVja0NlbGwiLCJhcHBseSIsInJldHVybkJlc3RBZGphY2VudEVtcHR5IiwibWF4VmFsdWUiLCJfYWRqYWNlbnRFbXB0aWVzJGkiLCJ2YWx1ZSIsImhhbmRsZUFkamFjZW50SGl0IiwiY2VsbENvdW50IiwidGhpc0NvdW50IiwiX2hpdCIsImhpdFgiLCJoaXRZIiwibmV4dENlbGwiLCJfbmV4dENlbGwiLCJfbmV4dENlbGwyIiwiZm91bmRFbXB0eSIsImNoZWNrTmV4dENlbGwiLCJuWCIsIm5ZIiwic2hpZnQiLCJuZXdOZXh0IiwiX25ld05leHQiLCJfbmV3TmV4dDIiLCJuZXdYIiwibmV3WSIsImNoZWNrQWRqYWNlbnRDZWxscyIsImluY3JlYXNlZEFkamFjZW50Q2VsbHMiLCJoaXRBZGphY2VudEluY3JlYXNlIiwibGFyZ2VzdExlbmd0aCIsInN0YXJ0aW5nRGVjIiwiZGVjUGVyY2VudGFnZSIsIm1pbkRlYyIsImRlY3JlbWVudEZhY3RvciIsIl9pbmNyZWFzZWRBZGphY2VudENlbCIsInNwbGljZSIsImNoZWNrRGVhZENlbGxzIiwiX2dtJHVzZXJCb2FyZCIsInZhbHVlcyIsIl9oaXQyIiwiX21pc3MiLCJ0cmFuc3Bvc2VBcnJheSIsImFycmF5IiwiXyIsImNvbEluZGV4IiwibG9nUHJvYnMiLCJwcm9ic1RvTG9nIiwidHJhbnNwb3NlZFByb2JzIiwiY29uc29sZSIsInRhYmxlIiwibG9nIiwicmVkdWNlIiwic3VtIiwicm93U3VtIiwibm9ybWFsaXplUHJvYnMiLCJub3JtYWxpemVkUHJvYnMiLCJpbml0aWFsQ29sb3JXZWlnaHQiLCJjb2xvcldlaWdodCIsImRpc3RhbmNlRnJvbUNlbnRlciIsInNxcnQiLCJwb3ciLCJtaW5Qcm9iYWJpbGl0eSIsIm1heFByb2JhYmlsaXR5IiwicHJvYmFiaWxpdHkiLCJiYXJyeVByb2JhYmlsaXR5IiwiZ3JpZENhbnZhcyIsImNhbnZhc0FkZGVyIiwidXNlckdhbWVib2FyZCIsImFpR2FtZWJvYXJkIiwid2ViSW50ZXJmYWNlIiwicGxhY2VtZW50UEgiLCJxdWVyeVNlbGVjdG9yIiwidXNlclBIIiwiYWlQSCIsInVzZXJDYW52YXMiLCJhaUNhbnZhcyIsInBsYWNlbWVudENhbnZhcyIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJpbWFnZUxvYWRlciIsImltYWdlUmVmcyIsIlNQIiwiYXR0YWNrIiwiZ2VuIiwiQVQiLCJWTSIsIklHIiwiTCIsImltYWdlQ29udGV4dCIsInJlcXVpcmUiLCJmaWxlcyIsImZpbGUiLCJmaWxlUGF0aCIsImZpbGVOYW1lIiwidG9Mb3dlckNhc2UiLCJzdWJEaXIiLCJzcGxpdCIsInRvVXBwZXJDYXNlIiwiaW5jbHVkZXMiLCJnYW1lTWFuYWdlciIsIndlYkludCIsInBsYWNlQWlTaGlwcyIsImdhbWVMb2ciLCJzb3VuZHMiLCJpbml0aWFsaXplR2FtZSIsImxvYWRpbmdTY3JlZW4iLCJzb3VuZFBsYXllciIsImxvYWRTY2VuZXMiLCJ1c2VyUGxheWVyIiwiYWlQbGF5ZXIiLCJzZXRVc2VyR2FtZWJvYXJkIiwiaW5pdFNjZW5lIiwiY2FudmFzZXMiLCJ1c2VyQ2FudmFzQ29udGFpbmVyIiwiYWlDYW52YXNDb250YWluZXIiLCJwbGFjZW1lbnRDYW52YXNDb250YWluZXIiLCJzZXRUaW1lb3V0IiwicmFuZG9tU2hpcHMiLCJwYXNzZWREaWZmIiwicGxhY2VTaGlwcyIsImRpZmZpY3VsdHkiLCJncmlkWCIsImdyaWRZIiwicm91bmQiLCJ1c2VyTmFtZSIsImRvVXBkYXRlU2NlbmUiLCJkb0xvY2siLCJsb2dUZXh0IiwibG9nSW1nIiwic2NlbmVJbWFnZXMiLCJyYW5kb21FbnRyeSIsImxhc3RJbmRleCIsInJhbmRvbU51bWJlciIsImRpck5hbWVzIiwicmFuZG9tU2hpcERpciIsInJlbWFpbmluZ1NoaXBzIiwic2hpcERpciIsImVudHJ5Iiwic3JjIiwic2V0U2NlbmUiLCJsb2dMb3dlciIsInRleHRDb250ZW50Iiwic2hpcFR5cGVzIiwidHlwZVRvRGlyIiwic2VudGluZWwiLCJhc3NhdWx0IiwidmlwZXIiLCJpcm9uIiwibGV2aWF0aGFuIiwiZXJhc2UiLCJhcHBlbmQiLCJzdHJpbmdUb0FwcGVuZCIsImlubmVySFRNTCIsImJvb2wiLCJ1c2VyQXR0YWNrRGVsYXkiLCJhaUF0dGFja0RlbGF5IiwiYWlBdXRvRGVsYXkiLCJhaUF0dGFja0hpdCIsInBsYXlIaXQiLCJzdW5rTXNnIiwiYWlBdHRhY2tNaXNzZWQiLCJwbGF5TWlzcyIsImFpQXR0YWNrQ291bnQiLCJ0aGVuIiwicmVzdWx0IiwicGxheUF0dGFjayIsImFpTWF0Y2hDbGlja2VkIiwiaXNNdXRlZCIsInRyeVN0YXJ0R2FtZSIsInNob3dHYW1lIiwicmFuZG9tU2hpcHNDbGlja2VkIiwicm90YXRlQ2xpY2tlZCIsIl9jZWxsIiwib3giLCJveSIsIl9haUJvYXJkJGNlbGxzVG9DaGVjayIsImN4IiwiY3kiLCJkaWZmIiwicGxhY2VtZW50Q2FudmFzY29udGFpbmVyIiwiYU1vZHVsZSIsImhpdFNvdW5kIiwibWlzc1NvdW5kIiwiYXR0YWNrU291bmQiLCJhdHRhY2tBdWRpbyIsIkF1ZGlvIiwiaGl0QXVkaW8iLCJtaXNzQXVkaW8iLCJjdXJyZW50VGltZSIsInBsYXkiLCJ0aXRsZSIsIm1lbnUiLCJwbGFjZW1lbnQiLCJnYW1lIiwicmVzZXQiLCJzdGFydEJ0biIsImFpTWF0Y2hCdG4iLCJyYW5kb21TaGlwc0J0biIsInJvdGF0ZUJ0biIsInJlc2V0QnRuIiwicm90YXRlRGlyZWN0aW9uIiwiaGlkZUFsbCIsInNob3dNZW51IiwicmVtb3ZlIiwic2hvd1BsYWNlbWVudCIsInNocmlua1RpdGxlIiwiaGFuZGxlU3RhcnRDbGljayIsImhhbmRsZUFpTWF0Y2hDbGljayIsImhhbmRsZVJvdGF0ZUNsaWNrIiwiaGFuZGxlUmFuZG9tU2hpcHNDbGljayIsImhhbmRsZVJlc2V0Q2xpY2siLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCJdLCJzb3VyY2VSb290IjoiIn0=