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
        if (!thisGameboard.isAi) {
          gm.userShipSunk(thisGameboard.ships[key - 1]);
        }
        // Else call the method for responding to ai ship sunk
        else if (thisGameboard.isAi) {
          gm.aiShipSunk(thisGameboard.ships[key - 1]);
        }
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
    // Update the canvases
    placementCanvasContainer.drawShips();
    userCanvasContainer.drawShips();
    // Update placement icons and text
    if (userBoard.ships.length < 5) {
      webInterface.updatePlacementIcons(userBoard.ships.length);
      webInterface.updatePlacementName(userBoard.ships.length);
    }
    // Try to start the game
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

    // Set the sunk icon to inactive
    webInterface.updateInfoIcons(ship.index - 1, true); // -1 bc Ships are indexed at 1 not 0
  };

  var aiShipSunk = function aiShipSunk(ship) {
    // Set the sunk icon to inactive
    webInterface.updateInfoIcons(ship.index - 1, false); // -1 bc Ships are indexed at 1 not 0
  };

  return {
    aiAttacking: aiAttacking,
    playerAttacking: playerAttacking,
    aiMatchClicked: aiMatchClicked,
    placementClicked: placementClicked,
    randomShipsClicked: randomShipsClicked,
    rotateClicked: rotateClicked,
    userShipSunk: userShipSunk,
    aiShipSunk: aiShipSunk,
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

  // References to btn elements
  var startBtn = document.querySelector(".start-btn");
  var aiMatchBtn = document.querySelector(".ai-match-btn");
  var randomShipsBtn = document.querySelector(".random-ships-btn");
  var rotateBtn = document.querySelector(".rotate-btn");
  var resetBtn = document.querySelector(".reset-btn");

  // References to ship info icons and text
  var placementIcons = document.querySelectorAll(".ships-to-place .icon");
  var placementShipName = document.querySelector(".ships-to-place .ship-name-text");
  var userIcons = document.querySelectorAll(".user-info .icon");
  var aiIcons = document.querySelectorAll(".ai-info .icon");

  // Method for iterating through directions
  var rotateDirection = function rotateDirection() {
    gm.rotateClicked();
  };

  // #region Add/remove classes to ship divs to represent placed/destroyed
  // Indicate what ship is being placed by the user
  var updatePlacementName = function updatePlacementName(shipToPlaceNum) {
    var shipName = null;
    switch (shipToPlaceNum) {
      case 0:
        shipName = "Sentinel Probe";
        break;
      case 1:
        shipName = "Assault Titan";
        break;
      case 2:
        shipName = "Viper Mech";
        break;
      case 3:
        shipName = "Iron Goliath";
        break;
      case 4:
        shipName = "Leviathan";
        break;
      default:
        shipName = "Ship Name";
    }
    placementShipName.textContent = shipName;
  };
  var updatePlacementIcons = function updatePlacementIcons(shipToPlaceNum) {
    for (var i = 0; i < placementIcons.length; i += 1) {
      // If the index = ship to place num then highlight that icon by removing class
      if (shipToPlaceNum === i) {
        placementIcons[i].classList.remove("inactive");
      }
      // Else it is not the active ship icon so make it inactive
      else {
        placementIcons[i].classList.add("inactive");
      }
    }
  };
  var updateInfoIcons = function updateInfoIcons(shipThatSunkNum) {
    var forUser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (forUser) {
      userIcons[shipThatSunkNum].classList.add("inactive");
    } else if (!forUser) {
      aiIcons[shipThatSunkNum].classList.add("inactive");
    }
  };

  // #endregion

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
    // Update icons and text to first ship as that is always first placed
    updatePlacementIcons(0);
    updatePlacementName(0);
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

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  aiMatchBtn.addEventListener("click", handleAiMatchClick);
  randomShipsBtn.addEventListener("click", handleRandomShipsClick);
  resetBtn.addEventListener("click", handleResetClick);
  return {
    showGame: showGame,
    showMenu: showMenu,
    showPlacement: showPlacement,
    updatePlacementIcons: updatePlacementIcons,
    updatePlacementName: updatePlacementName,
    updateInfoIcons: updateInfoIcons
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
___CSS_LOADER_EXPORT___.push([module.id, `/* Global Vars */
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

  --canvas-size: 300;
}

/* #region Universal element rules */
a {
  color: var(--link-color);
}

html {
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow-y: scroll;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar {
  display: none;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  height: 100%;
  width: 100%;

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

.icon.inactive {
  filter: grayscale(80%) brightness(50%);
}

.section {
  max-width: 900px;
  min-width: 600px;
}
/* #endregion */

/* #region loading-screen */
.loading-screen {
  transition: transform 0.3s ease-in-out;
}

.loading-screen.hidden {
  transform: translateY(200%);
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
  width: 100%;

  justify-self: center;
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
  transform: translateY(-200%);
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

  width: 100%;
  min-height: 275px;

  justify-self: center;
}

.menu.hidden {
  transform: translateX(-200%);
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
  grid-row: 3 / 20;

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

  width: 100%;
  min-height: 650px;

  justify-self: center;
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
  grid-template: 5% 1fr 10% min-content / 10% repeat(5, 1fr) 10%;
  grid-template-areas:
    ". . . . . . ."
    ". sp at vm ig l ."
    ". . . . . . ."
    ". n n n n n .";
}

.ships-to-place .ship {
  display: grid;
  place-items: center;
}

.ships-to-place .icon {
  width: 90%;
}

.ships-to-place .ship-name {
  grid-area: n;
  display: grid;
  place-items: center;

  font-size: 1.5rem;
  font-weight: bold;
}

.ships-to-place .ship-one {
  grid-area: sp;
}

.ships-to-place .ship-two {
  grid-area: at;
}

.ships-to-place .ship-three {
  grid-area: vm;
}

.ships-to-place .ship-four {
  grid-area: ig;
}

.ships-to-place .ship-five {
  grid-area: l;
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
  transform: translateY(200%);
}

.placement .canvas-container {
  background-color: var(--colorC);
}
/* #endregion */

/* #region game section */
.game {
  grid-column: 2 / 20;
  grid-row: 3 / 20;
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

  min-height: 600px;

  justify-self: center;
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

.game .info {
  display: grid;
  grid-template: min-content 10px 1fr / 5% repeat(5, 1fr) 5%;
  grid-template-areas:
    ". n n n n n ."
    ". . . . . . ."
    ". sp at vm ig l .";

  place-items: center;
}

.info .name {
  grid-area: n;

  font-size: 1.3rem;
  font-weight: bold;
}

.info .ship {
  display: grid;
  place-items: center;
}

.info .icon {
  width: 80%;
}

.info .ship-one {
  grid-area: sp;
}

.info .ship-two {
  grid-area: at;
}

.info .ship-three {
  grid-area: vm;
}

.info .ship-four {
  grid-area: ig;
}

.info .ship-five {
  grid-area: l;
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
  transform: translateX(200%);
}
/* #endregion */

/* #region Reset */
.reset {
  grid-column: 9 / 13;
  grid-row: 1 / 3;

  display: grid;

  place-items: center;

  height: 90%;
  max-height: 60px;
  width: 90%;
  max-width: 180px;
  place-self: center;

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
  transform: translateY(-200%);
}

/* #endregion */

/* #endregion */
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"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","sourcesContent":["/* Global Vars */\n:root {\n  --colorA1: #722b94;\n  --colorA2: #a936e0;\n  --colorC: #37e02b;\n  --colorB1: #941d0d;\n  --colorB2: #e0361f;\n\n  --bg-color: hsl(0, 0%, 22%);\n  --bg-color2: hsl(0, 0%, 32%);\n  --text-color: hsl(0, 0%, 91%);\n  --link-color: hsl(36, 92%, 59%);\n\n  --canvas-size: 300;\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nhtml {\n  height: 100vh;\n  width: 100vw;\n  position: fixed;\n  overflow-y: scroll;\n\n  -ms-overflow-style: none; /* IE and Edge */\n  scrollbar-width: none; /* Firefox */\n}\n\nhtml::-webkit-scrollbar {\n  display: none;\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100%;\n  width: 100%;\n\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.canvas-container {\n  display: grid;\n  grid-template: 1fr / 1fr;\n  width: fit-content;\n  height: fit-content;\n}\n\n.canvas-container > * {\n  grid-row: -1 / 1;\n  grid-column: -1 / 1;\n}\n\n.icon.inactive {\n  filter: grayscale(80%) brightness(50%);\n}\n\n.section {\n  max-width: 900px;\n  min-width: 600px;\n}\n/* #endregion */\n\n/* #region loading-screen */\n.loading-screen {\n  transition: transform 0.3s ease-in-out;\n}\n\n.loading-screen.hidden {\n  transform: translateY(200%);\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n  display: grid;\n  place-items: center;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: var(--bg-color2);\n  border-radius: 20px;\n  width: 100%;\n\n  justify-self: center;\n}\n\n.title-text {\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  font-size: 4.8rem;\n  font-weight: bold;\n  text-shadow: 2px 2px 2px var(--colorB1);\n  color: var(--colorB2);\n\n  transition: font-size 0.8s ease-in-out;\n}\n\n.title.shrink {\n  transform: translateY(-200%);\n}\n\n.title.shrink .title-text {\n  font-size: 3.5rem;\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  display: grid;\n  grid-template: 5% min-content 5% 1fr 5% 1fr 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"credits\"\n    \".\"\n    \"start-game\"\n    \".\"\n    \"ai-match\"\n    \".\"\n    \"options\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n\n  width: 100%;\n  min-height: 275px;\n\n  justify-self: center;\n}\n\n.menu.hidden {\n  transform: translateX(-200%);\n}\n\n.menu .credits {\n  grid-area: credits;\n}\n\n.menu .start {\n  grid-area: start-game;\n  align-self: end;\n}\n\n.menu .ai-match {\n  grid-area: ai-match;\n}\n\n.menu .options {\n  grid-area: options;\n  align-self: start;\n}\n\n.menu .start-btn,\n.menu .options-btn,\n.menu .ai-match-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.menu .start-btn:hover,\n.menu .options-btn:hover,\n.menu .ai-match-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.menu .ai-match-btn.active {\n  background-color: var(--colorB1);\n}\n\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 3 / 20;\n\n  display: grid;\n  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr 5% 1fr;\n  place-items: center;\n  grid-template-areas:\n    \". . .\"\n    \"instructions instructions instructions\"\n    \". . .\"\n    \"ships ships ships\"\n    \". . . \"\n    \"random . rotate\"\n    \". . .\"\n    \"canvas canvas canvas\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n\n  width: 100%;\n  min-height: 650px;\n\n  justify-self: center;\n}\n\n.placement .instructions {\n  grid-area: instructions;\n}\n\n.placement .instructions-text {\n  font-size: 2.3rem;\n  font-weight: bold;\n  text-shadow: 1px 1px 1px var(--bg-color);\n}\n\n.placement .ships-to-place {\n  grid-area: ships;\n  display: grid;\n  grid-template: 5% 1fr 10% min-content / 10% repeat(5, 1fr) 10%;\n  grid-template-areas:\n    \". . . . . . .\"\n    \". sp at vm ig l .\"\n    \". . . . . . .\"\n    \". n n n n n .\";\n}\n\n.ships-to-place .ship {\n  display: grid;\n  place-items: center;\n}\n\n.ships-to-place .icon {\n  width: 90%;\n}\n\n.ships-to-place .ship-name {\n  grid-area: n;\n  display: grid;\n  place-items: center;\n\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.ships-to-place .ship-one {\n  grid-area: sp;\n}\n\n.ships-to-place .ship-two {\n  grid-area: at;\n}\n\n.ships-to-place .ship-three {\n  grid-area: vm;\n}\n\n.ships-to-place .ship-four {\n  grid-area: ig;\n}\n\n.ships-to-place .ship-five {\n  grid-area: l;\n}\n\n.placement .random-ships {\n  grid-area: random;\n  justify-self: end;\n}\n\n.placement .rotate {\n  grid-area: rotate;\n  justify-self: start;\n}\n\n.placement .rotate-btn,\n.placement .random-ships-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.placement .rotate-btn:hover,\n.placement .random-ships-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.placement .rotate-btn:active,\n.placement .random-ships-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.placement .placement-canvas-container {\n  grid-area: canvas;\n  align-self: start;\n}\n\n.placement.hidden {\n  transform: translateY(200%);\n}\n\n.placement .canvas-container {\n  background-color: var(--colorC);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 3 / 20;\n  display: grid;\n  place-items: center;\n  grid-template:\n    repeat(2, minmax(10px, 1fr) min-content) minmax(10px, 1fr)\n    min-content 1fr / repeat(4, 1fr);\n  grid-template-areas:\n    \". . . .\"\n    \". log log .\"\n    \". . . .\"\n    \"user-board user-board ai-board ai-board\"\n    \". . . .\"\n    \"user-info user-info ai-info ai-info\"\n    \". . . .\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n\n  min-height: 600px;\n\n  justify-self: center;\n}\n\n.game .canvas-container {\n  background-color: var(--colorA2);\n}\n\n.game .user-canvas-container {\n  grid-area: user-board;\n}\n\n.game .ai-canvas-container {\n  grid-area: ai-board;\n}\n\n.game .info {\n  display: grid;\n  grid-template: min-content 10px 1fr / 5% repeat(5, 1fr) 5%;\n  grid-template-areas:\n    \". n n n n n .\"\n    \". . . . . . .\"\n    \". sp at vm ig l .\";\n\n  place-items: center;\n}\n\n.info .name {\n  grid-area: n;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n}\n\n.info .ship {\n  display: grid;\n  place-items: center;\n}\n\n.info .icon {\n  width: 80%;\n}\n\n.info .ship-one {\n  grid-area: sp;\n}\n\n.info .ship-two {\n  grid-area: at;\n}\n\n.info .ship-three {\n  grid-area: vm;\n}\n\n.info .ship-four {\n  grid-area: ig;\n}\n\n.info .ship-five {\n  grid-area: l;\n}\n\n.game .user-info {\n  grid-area: user-info;\n}\n\n.game .ai-info {\n  grid-area: ai-info;\n}\n\n.game .player-ships {\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.game .log {\n  grid-area: log;\n  display: grid;\n  grid-template: 1fr / min-content 10px 1fr;\n  grid-template-areas: \"scene . text\";\n\n  width: 500px;\n\n  border: 3px solid var(--colorB1);\n  border-radius: 6px;\n\n  background-color: var(--bg-color);\n}\n\n.game .log .scene {\n  grid-area: scene;\n\n  height: 150px;\n  width: 150px;\n  background-color: var(--colorB1);\n}\n\n.game .log .scene-img {\n  height: 100%;\n  width: 100%;\n}\n\n.game .log .log-text {\n  grid-area: text;\n  font-size: 1.15rem;\n  white-space: pre; /* Allows for \\n */\n}\n\n.game.hidden {\n  transform: translateX(200%);\n}\n/* #endregion */\n\n/* #region Reset */\n.reset {\n  grid-column: 9 / 13;\n  grid-row: 1 / 3;\n\n  display: grid;\n\n  place-items: center;\n\n  height: 90%;\n  max-height: 60px;\n  width: 90%;\n  max-width: 180px;\n  place-self: center;\n\n  transition: transform 0.3s ease-in-out;\n}\n\n.reset .reset-btn {\n  height: 100%;\n  width: 100%;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.reset .reset-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.reset .reset-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.reset.hidden {\n  transform: translateY(-200%);\n}\n\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1Qix5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsT0FBTyw2RkFBNkYsTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsY0FBYyxhQUFhLE9BQU8sWUFBWSxNQUFNLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLGFBQWEseUJBQXlCLHVCQUF1QixPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxNQUFNLFdBQVcsWUFBWSxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxXQUFXLFlBQVksTUFBTSxVQUFVLFlBQVksY0FBYyxXQUFXLFVBQVUsTUFBTSxVQUFVLEtBQUssWUFBWSxXQUFXLFVBQVUsYUFBYSxjQUFjLGFBQWEsYUFBYSxZQUFZLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGNBQWMsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxNQUFNLGFBQWEsYUFBYSxjQUFjLFdBQVcsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE9BQU8sVUFBVSxXQUFXLFlBQVksYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsT0FBTyxPQUFPLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxXQUFXLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxRQUFRLGNBQWMsYUFBYSxjQUFjLFdBQVcsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksU0FBUyxPQUFPLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxNQUFNLFVBQVUsV0FBVyxZQUFZLGFBQWEsYUFBYSxjQUFjLGFBQWEsYUFBYSxhQUFhLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxXQUFXLFlBQVksTUFBTSxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sT0FBTyxZQUFZLE1BQU0sYUFBYSxhQUFhLGNBQWMsY0FBYyxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksUUFBUSxRQUFRLGFBQWEsT0FBTyxLQUFLLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFVB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Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQzVGQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NsQkE7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDMkI7QUFDQTtBQUMyQjtBQUV0RG1DLG1FQUFjLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dyaWRDYW52YXMvR3JpZENhbnZhcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HcmlkQ2FudmFzL2RyYXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2FpQXR0YWNrL2FpQXR0YWNrLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9haUF0dGFjay9haUJyYWluLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9haUF0dGFjay9jcmVhdGVQcm9icy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvY2FudmFzQWRkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2ltYWdlTG9hZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9pbml0aWFsaXplR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvcGxhY2VBaVNoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9yYW5kb21TaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUxvZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NvdW5kcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvd2ViSW50ZXJmYWNlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvcmVzZXQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcz80NDVlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzP2M5ZjAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjZW5lLWltYWdlcy8gc3luYyBcXC5qcGckLyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgbW9kdWxlIGlzIHVzZWQgYnkgdGhlIFBsYXllciBmYWN0b3J5IHRvIGNyZWF0ZSBnYW1lYm9hcmRzIGZvciB0aGUgdXNlciBhbmQgYWlcbiAgcGxheWVycy4gVGhlIGdhbWVib2FyZCBpcyByZXNwb25zaWJsZSBmb3IgaG9sZGluZyBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoZSBzdGF0ZSBvZlxuICBhIHBsYXllcnMgc2hpcHMsIGhpdHMgYW5kIG1pc3NlcywgcmVmZXJlbmNlcyByZXByZXNlbnRpbmcgdGhlIGJvYXJkIHN0YXRlLCBhbmQgdmFyaW91c1xuICBtZXRob2RzIGZvciBhbHRlcmluZyB0aGUgYm9hcmQgb3IgZ2V0dGluZyBpbmZvcm1hdGlvbiBhYm91dCBpdC4gKi9cblxuaW1wb3J0IFNoaXAgZnJvbSBcIi4vU2hpcFwiO1xuaW1wb3J0IGFpQXR0YWNrIGZyb20gXCIuLi9oZWxwZXJzL2FpQXR0YWNrL2FpQXR0YWNrXCI7XG5cbi8vIEdhbWVib2FyZCBmYWN0b3J5XG5jb25zdCBHYW1lYm9hcmQgPSAoZ20pID0+IHtcbiAgY29uc3QgdGhpc0dhbWVib2FyZCA9IHtcbiAgICBtYXhCb2FyZFg6IDksXG4gICAgbWF4Qm9hcmRZOiA5LFxuICAgIHNoaXBzOiBbXSxcbiAgICBhbGxPY2N1cGllZENlbGxzOiBbXSxcbiAgICBjZWxsc1RvQ2hlY2s6IFtdLFxuICAgIG1pc3NlczogW10sXG4gICAgaGl0czogW10sXG4gICAgZGlyZWN0aW9uOiAxLFxuICAgIGhpdFNoaXBUeXBlOiBudWxsLFxuICAgIGlzQWk6IGZhbHNlLFxuICAgIGlzQXV0b0F0dGFja2luZzogZmFsc2UsXG4gICAgaXNBaVNlZWtpbmc6IHRydWUsXG4gICAgZ2FtZU92ZXI6IGZhbHNlLFxuICAgIGNhbkF0dGFjazogdHJ1ZSxcbiAgICByaXZhbEJvYXJkOiBudWxsLFxuICAgIGNhbnZhczogbnVsbCxcbiAgICBhZGRTaGlwOiBudWxsLFxuICAgIHJlY2VpdmVBdHRhY2s6IG51bGwsXG4gICAgYWxsU3VuazogbnVsbCxcbiAgICBsb2dTdW5rOiBudWxsLFxuICAgIGlzQ2VsbFN1bms6IG51bGwsXG4gICAgYWxyZWFkeUF0dGFja2VkOiBudWxsLFxuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyBzaGlwIG9jY3VwaWVkIGNlbGwgY29vcmRzXG4gIGNvbnN0IHZhbGlkYXRlU2hpcCA9IChzaGlwKSA9PiB7XG4gICAgaWYgKCFzaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gRmxhZyBmb3IgZGV0ZWN0aW5nIGludmFsaWQgcG9zaXRpb24gdmFsdWVcbiAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG5cbiAgICAvLyBDaGVjayB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzIGFyZSBhbGwgd2l0aGluIG1hcCBhbmQgbm90IGFscmVhZHkgb2NjdXBpZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAub2NjdXBpZWRDZWxscy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgLy8gT24gdGhlIG1hcD9cbiAgICAgIGlmIChcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdIDw9IHRoaXNHYW1lYm9hcmQubWF4Qm9hcmRYICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXSA+PSAwICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXSA8PSB0aGlzR2FtZWJvYXJkLm1heEJvYXJkWVxuICAgICAgKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrIG9jY3VwaWVkIGNlbGxzXG4gICAgICBjb25zdCBpc0NlbGxPY2N1cGllZCA9IHRoaXNHYW1lYm9hcmQuYWxsT2NjdXBpZWRDZWxscy5zb21lKFxuICAgICAgICAoY2VsbCkgPT5cbiAgICAgICAgICAvLyBDb29yZHMgZm91bmQgaW4gYWxsIG9jY3VwaWVkIGNlbGxzIGFscmVhZHlcbiAgICAgICAgICBjZWxsWzBdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gJiZcbiAgICAgICAgICBjZWxsWzFdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV1cbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0NlbGxPY2N1cGllZCkge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrOyAvLyBCcmVhayBvdXQgb2YgdGhlIGxvb3AgaWYgb2NjdXBpZWQgY2VsbCBpcyBmb3VuZFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGFkZHMgb2NjdXBpZWQgY2VsbHMgb2YgdmFsaWQgYm9hdCB0byBsaXN0XG4gIGNvbnN0IGFkZENlbGxzVG9MaXN0ID0gKHNoaXApID0+IHtcbiAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgdGhpc0dhbWVib2FyZC5hbGxPY2N1cGllZENlbGxzLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBhZGRpbmcgYSBzaGlwIGF0IGEgZ2l2ZW4gY29vcmRzIGluIGdpdmVuIGRpcmVjdGlvbiBpZiBzaGlwIHdpbGwgZml0IG9uIGJvYXJkXG4gIHRoaXNHYW1lYm9hcmQuYWRkU2hpcCA9IChcbiAgICBwb3NpdGlvbixcbiAgICBkaXJlY3Rpb24gPSB0aGlzR2FtZWJvYXJkLmRpcmVjdGlvbixcbiAgICBzaGlwVHlwZUluZGV4ID0gdGhpc0dhbWVib2FyZC5zaGlwcy5sZW5ndGggKyAxXG4gICkgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgZGVzaXJlZCBzaGlwXG4gICAgY29uc3QgbmV3U2hpcCA9IFNoaXAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbik7XG4gICAgLy8gQWRkIGl0IHRvIHNoaXBzIGlmIGl0IGhhcyB2YWxpZCBvY2N1cGllZCBjZWxsc1xuICAgIGlmICh2YWxpZGF0ZVNoaXAobmV3U2hpcCkpIHtcbiAgICAgIGFkZENlbGxzVG9MaXN0KG5ld1NoaXApO1xuICAgICAgdGhpc0dhbWVib2FyZC5zaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhZGRNaXNzID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLm1pc3Nlcy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYWRkSGl0ID0gKHBvc2l0aW9uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBtb3N0IHJlY2VudGx5IGhpdCBzaGlwXG4gICAgdGhpc0dhbWVib2FyZC5oaXRTaGlwVHlwZSA9IHNoaXAudHlwZTtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlY2VpdmluZyBhbiBhdHRhY2sgZnJvbSBvcHBvbmVudFxuICB0aGlzR2FtZWJvYXJkLnJlY2VpdmVBdHRhY2sgPSAocG9zaXRpb24sIHNoaXBzID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVmFsaWRhdGUgcG9zaXRpb24gaXMgMiBpbiBhcnJheSBhbmQgc2hpcHMgaXMgYW4gYXJyYXksIGFuZCByaXZhbCBib2FyZCBjYW4gYXR0YWNrXG4gICAgICBpZiAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEVhY2ggc2hpcCBpbiBzaGlwc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gSWYgdGhlIHNoaXAgaXMgbm90IGZhbHN5LCBhbmQgb2NjdXBpZWRDZWxscyBwcm9wIGV4aXN0cyBhbmQgaXMgYW4gYXJyYXlcbiAgICAgICAgICAgIHNoaXBzW2ldICYmXG4gICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzICYmXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBvZiB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIC8vIElmIHRoYXQgY2VsbCBtYXRjaGVzIHRoZSBhdHRhY2sgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzW2pdWzBdID09PSBwb3NpdGlvblswXSAmJlxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMV0gPT09IHBvc2l0aW9uWzFdXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhhdCBzaGlwcyBoaXQgbWV0aG9kIGFuZCBicmVhayBvdXQgb2YgbG9vcFxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIGFkZEhpdChwb3NpdGlvbiwgc2hpcHNbaV0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhZGRNaXNzKHBvc2l0aW9uKTtcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gIC8vIE1ldGhvZCBmb3IgdHJ5aW5nIGFpIGF0dGFja3NcbiAgdGhpc0dhbWVib2FyZC50cnlBaUF0dGFjayA9IChkZWxheSkgPT4ge1xuICAgIC8vIFJldHVybiBpZiBub3QgYWkgb3IgZ2FtZSBpcyBvdmVyXG4gICAgaWYgKHRoaXNHYW1lYm9hcmQuaXNBaSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBhaUF0dGFjayhnbSwgZGVsYXkpO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGRldGVybWluZXMgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIG5vdFxuICB0aGlzR2FtZWJvYXJkLmFsbFN1bmsgPSAoc2hpcEFycmF5ID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT4ge1xuICAgIGlmICghc2hpcEFycmF5IHx8ICFBcnJheS5pc0FycmF5KHNoaXBBcnJheSkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIHNoaXBBcnJheS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcCAmJiBzaGlwLmlzU3VuayAmJiAhc2hpcC5pc1N1bmsoKSkgYWxsU3VuayA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHJldHVybiBhbGxTdW5rO1xuICB9O1xuXG4gIC8vIE9iamVjdCBmb3IgdHJhY2tpbmcgYm9hcmQncyBzdW5rZW4gc2hpcHNcbiAgdGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwcyA9IHtcbiAgICAxOiBmYWxzZSxcbiAgICAyOiBmYWxzZSxcbiAgICAzOiBmYWxzZSxcbiAgICA0OiBmYWxzZSxcbiAgICA1OiBmYWxzZSxcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlcG9ydGluZyBzdW5rZW4gc2hpcHNcbiAgdGhpc0dhbWVib2FyZC5sb2dTdW5rID0gKCkgPT4ge1xuICAgIGxldCBsb2dNc2cgPSBudWxsO1xuICAgIE9iamVjdC5rZXlzKHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzW2tleV0gPT09IGZhbHNlICYmXG4gICAgICAgIHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0uaXNTdW5rKClcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzaGlwID0gdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS50eXBlO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzR2FtZWJvYXJkLmlzQWkgPyBcIkFJJ3NcIiA6IFwiVXNlcidzXCI7XG4gICAgICAgIGxvZ01zZyA9IGA8c3BhbiBzdHlsZT1cImNvbG9yOiByZWRcIj4ke3BsYXllcn0gJHtzaGlwfSB3YXMgZGVzdHJveWVkITwvc3Bhbj5gO1xuICAgICAgICB0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzW2tleV0gPSB0cnVlO1xuICAgICAgICAvLyBDYWxsIHRoZSBtZXRob2QgZm9yIHJlc3BvbmRpbmcgdG8gdXNlciBzaGlwIHN1bmsgb24gZ2FtZSBtYW5hZ2VyXG4gICAgICAgIGlmICghdGhpc0dhbWVib2FyZC5pc0FpKSB7XG4gICAgICAgICAgZ20udXNlclNoaXBTdW5rKHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVsc2UgY2FsbCB0aGUgbWV0aG9kIGZvciByZXNwb25kaW5nIHRvIGFpIHNoaXAgc3Vua1xuICAgICAgICBlbHNlIGlmICh0aGlzR2FtZWJvYXJkLmlzQWkpIHtcbiAgICAgICAgICBnbS5haVNoaXBTdW5rKHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxvZ01zZztcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIGRldGVybWluaW5nIGlmIGEgcG9zaXRpb24gaXMgYWxyZWFkeSBhdHRhY2tlZFxuICB0aGlzR2FtZWJvYXJkLmFscmVhZHlBdHRhY2tlZCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICBsZXQgYXR0YWNrZWQgPSBmYWxzZTtcblxuICAgIHRoaXNHYW1lYm9hcmQuaGl0cy5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgIGlmIChhdHRhY2tDb29yZHNbMF0gPT09IGhpdFswXSAmJiBhdHRhY2tDb29yZHNbMV0gPT09IGhpdFsxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzR2FtZWJvYXJkLm1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBpZiAoYXR0YWNrQ29vcmRzWzBdID09PSBtaXNzWzBdICYmIGF0dGFja0Nvb3Jkc1sxXSA9PT0gbWlzc1sxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXR0YWNrZWQ7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciByZXR1cm5pbmcgYm9vbCBmb3IgaWYgY2VsbCBvY2N1cGllZCBieSBzdW5rIHNoaXBcbiAgdGhpc0dhbWVib2FyZC5pc0NlbGxTdW5rID0gKGNlbGxUb0NoZWNrKSA9PiB7XG4gICAgbGV0IGlzQ2VsbFN1bmsgPSBmYWxzZTsgLy8gRmxhZyB2YXJpYWJsZVxuXG4gICAgT2JqZWN0LmtleXModGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAodGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwc1trZXldID09PSB0cnVlICYmICFpc0NlbGxTdW5rKSB7XG4gICAgICAgIGNvbnN0IGhhc01hdGNoaW5nQ2VsbCA9IHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0ub2NjdXBpZWRDZWxscy5zb21lKFxuICAgICAgICAgIChjZWxsKSA9PiBjZWxsVG9DaGVja1swXSA9PT0gY2VsbFswXSAmJiBjZWxsVG9DaGVja1sxXSA9PT0gY2VsbFsxXVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChoYXNNYXRjaGluZ0NlbGwpIHtcbiAgICAgICAgICBpc0NlbGxTdW5rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlzQ2VsbFN1bms7XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNHYW1lYm9hcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCIvKiBUaGlzIG1vZHVsZSBjcmVhdGVzIGFuZCByZXR1cm5zIGEgZHVhbCwgbGF5ZXJlZCBjYW52YXMgZWxlbWVudC4gVGhlIGJvdHRvbSBsYXllciBpcyB0aGUgYm9hcmRcbiAgY2FudmFzIHRoYXQgcmVwcmVzcGVudHMgYmFzaWMgYm9hcmQgZWxlbWVudHMgdGhhdCBkb24ndCBjaGFuZ2Ugb2Z0ZW4sIHN1Y2ggYXMgc2hpcHMsIGhpdHMsIG1pc3Nlc1xuICBhbmQgZ3JpZCBsaW5lcy4gVGhlIHRvcCBsYXllciBpcyB0aGUgb3ZlcmxheSBjYW52YXMgdGhhdCByZXByZXNlbnRzIGZyZXF1ZW50bHkgY2hhbmdpbmcgZWxlbWVudHNcbiAgbGlrZSBoaWdobGlnaHRpbmcgY2VsbHMgdG8gaW5kaWNhdGUgd2hlcmUgYXR0YWNrcyBvciBzaGlwcyB3aWxsIGdvLiBcbiAgXG4gIEl0IGFsc28gc2V0cyB1cCBoYW5kbGVycyBmb3IgYnJvd3NlciBtb3VzZSBldmVudHMgdGhhdCBhbGxvdyB0aGUgaHVtYW4gdXNlciB0byBpbnRlcmFjdCB3aXRoIHRoZVxuICBwcm9ncmFtLCBzdWNoIGFzIHBsYWNpbmcgc2hpcHMgYW5kIHBpY2tpbmcgY2VsbHMgdG8gYXR0YWNrLiAqL1xuXG4vLyBIZWxwZXIgbW9kdWxlIGZvciBkcmF3IG1ldGhvZHNcbmltcG9ydCBkcmF3aW5nTW9kdWxlIGZyb20gXCIuL2RyYXdcIjtcblxuLy8gSW5pdGlhbGl6ZSBpdFxuY29uc3QgZHJhdyA9IGRyYXdpbmdNb2R1bGUoKTtcblxuY29uc3QgY3JlYXRlQ2FudmFzID0gKGdtLCBjYW52YXNYLCBjYW52YXNZLCBvcHRpb25zKSA9PiB7XG4gIC8vICNyZWdpb24gU2V0IHVwIGJhc2ljIGVsZW1lbnQgcHJvcGVydGllc1xuICAvLyBTZXQgdGhlIGdyaWQgaGVpZ2h0IGFuZCB3aWR0aCBhbmQgYWRkIHJlZiB0byBjdXJyZW50IGNlbGxcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcbiAgbGV0IGN1cnJlbnRDZWxsID0gbnVsbDtcblxuICAvLyBDcmVhdGUgcGFyZW50IGRpdiB0aGF0IGhvbGRzIHRoZSBjYW52YXNlcy4gVGhpcyBpcyB0aGUgZWxlbWVudCByZXR1cm5lZC5cbiAgY29uc3QgY2FudmFzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjYW52YXMtY29udGFpbmVyXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgYm9hcmQgY2FudmFzIGVsZW1lbnQgdG8gc2VydmUgYXMgdGhlIGdhbWVib2FyZCBiYXNlXG4gIGNvbnN0IGJvYXJkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzQ29udGFpbmVyLmFwcGVuZENoaWxkKGJvYXJkQ2FudmFzKTtcbiAgYm9hcmRDYW52YXMud2lkdGggPSBjYW52YXNYO1xuICBib2FyZENhbnZhcy5oZWlnaHQgPSBjYW52YXNZO1xuICBjb25zdCBib2FyZEN0eCA9IGJvYXJkQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIG92ZXJsYXkgY2FudmFzIGZvciByZW5kZXJpbmcgc2hpcCBwbGFjZW1lbnQgYW5kIGF0dGFjayBzZWxlY3Rpb25cbiAgY29uc3Qgb3ZlcmxheUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChvdmVybGF5Q2FudmFzKTtcbiAgb3ZlcmxheUNhbnZhcy53aWR0aCA9IGNhbnZhc1g7XG4gIG92ZXJsYXlDYW52YXMuaGVpZ2h0ID0gY2FudmFzWTtcbiAgY29uc3Qgb3ZlcmxheUN0eCA9IG92ZXJsYXlDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIC8vIFNldCB0aGUgXCJjZWxsIHNpemVcIiBmb3IgdGhlIGdyaWQgcmVwcmVzZW50ZWQgYnkgdGhlIGNhbnZhc1xuICBjb25zdCBjZWxsU2l6ZVggPSBib2FyZENhbnZhcy53aWR0aCAvIGdyaWRXaWR0aDsgLy8gTW9kdWxlIGNvbnN0XG4gIGNvbnN0IGNlbGxTaXplWSA9IGJvYXJkQ2FudmFzLmhlaWdodCAvIGdyaWRIZWlnaHQ7IC8vIE1vZHVsZSBjb25zdFxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEdlbmVyYWwgaGVscGVyIG1ldGhvZHNcbiAgLy8gTWV0aG9kIHRoYXQgZ2V0cyB0aGUgbW91c2UgcG9zaXRpb24gYmFzZWQgb24gd2hhdCBjZWxsIGl0IGlzIG92ZXJcbiAgY29uc3QgZ2V0TW91c2VDZWxsID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IGJvYXJkQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgY29uc3QgY2VsbFggPSBNYXRoLmZsb29yKG1vdXNlWCAvIGNlbGxTaXplWCk7XG4gICAgY29uc3QgY2VsbFkgPSBNYXRoLmZsb29yKG1vdXNlWSAvIGNlbGxTaXplWSk7XG5cbiAgICByZXR1cm4gW2NlbGxYLCBjZWxsWV07XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQXNzaWduIHN0YXRpYyBtZXRob2RzXG4gIC8vIEFkZCBtZXRob2RzIG9uIHRoZSBjb250YWluZXIgZm9yIGRyYXdpbmcgaGl0cyBvciBtaXNzZXNcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdIaXQgPSAoY29vcmRpbmF0ZXMpID0+XG4gICAgZHJhdy5oaXRPck1pc3MoYm9hcmRDdHgsIGNlbGxTaXplWCwgY2VsbFNpemVZLCBjb29yZGluYXRlcywgMSk7XG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyA9IChjb29yZGluYXRlcykgPT5cbiAgICBkcmF3LmhpdE9yTWlzcyhib2FyZEN0eCwgY2VsbFNpemVYLCBjZWxsU2l6ZVksIGNvb3JkaW5hdGVzLCAwKTtcblxuICAvLyBBZGQgbWV0aG9kIHRvIGNvbnRhaW5lciBmb3Igc2hpcHMgdG8gYm9hcmQgY2FudmFzXG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMgPSAodXNlclNoaXBzID0gdHJ1ZSkgPT4ge1xuICAgIGRyYXcuc2hpcHMoYm9hcmRDdHgsIGNlbGxTaXplWCwgY2VsbFNpemVZLCBnbSwgdXNlclNoaXBzKTtcbiAgfTtcblxuICAvLyBvdmVybGF5Q2FudmFzXG4gIC8vIEZvcndhcmQgY2xpY2tzIHRvIGJvYXJkIGNhbnZhc1xuICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IG5ld0V2ZW50ID0gbmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiLCB7XG4gICAgICBidWJibGVzOiBldmVudC5idWJibGVzLFxuICAgICAgY2FuY2VsYWJsZTogZXZlbnQuY2FuY2VsYWJsZSxcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgIH0pO1xuICAgIGJvYXJkQ2FudmFzLmRpc3BhdGNoRXZlbnQobmV3RXZlbnQpO1xuICB9O1xuXG4gIC8vIE1vdXNlbGVhdmVcbiAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUxlYXZlID0gKCkgPT4ge1xuICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcbiAgICBjdXJyZW50Q2VsbCA9IG51bGw7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQXNzaWduIGJlaGF2aW9yIHVzaW5nIGJyb3dzZXIgZXZlbnQgaGFuZGxlcnMgYmFzZWQgb24gb3B0aW9uc1xuICAvLyBQbGFjZW1lbnQgaXMgdXNlZCBmb3IgcGxhY2luZyBzaGlwc1xuICBpZiAob3B0aW9ucy50eXBlID09PSBcInBsYWNlbWVudFwiKSB7XG4gICAgLy8gQWRkIGNsYXNzIHRvIGNhbnZhc0NvbnRhaW5lciB0byBkZW5vdGUgcGxhY2VtZW50IGNvbnRhaW5lclxuICAgIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gU2V0IHVwIG92ZXJsYXlDYW52YXMgd2l0aCBiZWhhdmlvcnMgdW5pcXVlIHRvIHBsYWNlbWVudFxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBHZXQgd2hhdCBjZWxsIHRoZSBtb3VzZSBpcyBvdmVyXG4gICAgICBjb25zdCBtb3VzZUNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuICAgICAgLy8gSWYgdGhlICdvbGQnIGN1cnJlbnRDZWxsIGlzIGVxdWFsIHRvIHRoZSBtb3VzZUNlbGwgYmVpbmcgZXZhbHVhdGVkXG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgY3VycmVudENlbGwgJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFswXSA9PT0gbW91c2VDZWxsWzBdICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMV0gPT09IG1vdXNlQ2VsbFsxXVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBjaGFuZ2VzXG4gICAgICAgIGRyYXcucGxhY2VtZW50SGlnaGxpZ2h0KFxuICAgICAgICAgIG92ZXJsYXlDdHgsXG4gICAgICAgICAgY2FudmFzWCxcbiAgICAgICAgICBjYW52YXNZLFxuICAgICAgICAgIGNlbGxTaXplWCxcbiAgICAgICAgICBjZWxsU2l6ZVksXG4gICAgICAgICAgbW91c2VDZWxsLFxuICAgICAgICAgIGdtXG4gICAgICAgICk7XG4gICAgICAgIC8vIGhpZ2hsaWdodFBsYWNlbWVudENlbGxzKG1vdXNlQ2VsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldCB0aGUgY3VycmVudENlbGwgdG8gdGhlIG1vdXNlQ2VsbCBmb3IgZnV0dXJlIGNvbXBhcmlzb25zXG4gICAgICBjdXJyZW50Q2VsbCA9IG1vdXNlQ2VsbDtcbiAgICB9O1xuXG4gICAgLy8gQnJvd3NlciBjbGljayBldmVudHNcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBjZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcblxuICAgICAgLy8gVHJ5IHBsYWNlbWVudFxuICAgICAgZ20ucGxhY2VtZW50Q2xpY2tlZChjZWxsKTtcbiAgICB9O1xuICB9XG4gIC8vIFVzZXIgY2FudmFzIGZvciBkaXNwbGF5aW5nIGFpIGhpdHMgYW5kIG1pc3NlcyBhZ2FpbnN0IHVzZXIgYW5kIHVzZXIgc2hpcCBwbGFjZW1lbnRzXG4gIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gZGVub3RlIHVzZXIgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ1c2VyLWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gSGFuZGxlIGNhbnZhcyBtb3VzZSBtb3ZlXG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKCkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH07XG4gIH1cbiAgLy8gQUkgY2FudmFzIGZvciBkaXNwbGF5aW5nIHVzZXIgaGl0cyBhbmQgbWlzc2VzIGFnYWluc3QgYWksIGFuZCBhaSBzaGlwIHBsYWNlbWVudHMgaWYgdXNlciBsb3Nlc1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09IFwiYWlcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBkZW5vdGUgYWkgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhaS1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIEhhbmRsZSBjYW52YXMgbW91c2UgbW92ZVxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBHZXQgd2hhdCBjZWxsIHRoZSBtb3VzZSBpcyBvdmVyXG4gICAgICBjb25zdCBtb3VzZUNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuICAgICAgLy8gSWYgdGhlICdvbGQnIGN1cnJlbnRDZWxsIGlzIGVxdWFsIHRvIHRoZSBtb3VzZUNlbGwgYmVpbmcgZXZhbHVhdGVkXG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgY3VycmVudENlbGwgJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFswXSA9PT0gbW91c2VDZWxsWzBdICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMV0gPT09IG1vdXNlQ2VsbFsxXVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBjdXJyZW50IGNlbGwgaW4gcmVkXG4gICAgICAgIGRyYXcuYXR0YWNrSGlnaGxpZ2h0KFxuICAgICAgICAgIG92ZXJsYXlDdHgsXG4gICAgICAgICAgY2FudmFzWCxcbiAgICAgICAgICBjYW52YXNZLFxuICAgICAgICAgIGNlbGxTaXplWCxcbiAgICAgICAgICBjZWxsU2l6ZVksXG4gICAgICAgICAgbW91c2VDZWxsLFxuICAgICAgICAgIGdtXG4gICAgICAgICk7XG4gICAgICAgIC8vIGhpZ2hsaWdodEF0dGFjayhtb3VzZUNlbGwpO1xuICAgICAgfVxuICAgICAgLy8gRGVub3RlIGlmIGl0IGlzIGEgdmFsaWQgYXR0YWNrIG9yIG5vdCAtIE5ZSVxuICAgIH07XG4gICAgLy8gSGFuZGxlIGJvYXJkIG1vdXNlIGNsaWNrXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgYXR0YWNrQ29vcmRzID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIGdtLnBsYXllckF0dGFja2luZyhhdHRhY2tDb29yZHMpO1xuXG4gICAgICAvLyBDbGVhciB0aGUgb3ZlcmxheSB0byBzaG93IGhpdC9taXNzIHVuZGVyIGN1cnJlbnQgaGlnaGlnaHRcbiAgICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICB9XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBTdWJzY3JpYmUgdG8gYnJvd3NlciBldmVudHNcbiAgLy8gYm9hcmQgY2xpY2tcbiAgYm9hcmRDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrKGUpKTtcbiAgLy8gb3ZlcmxheSBjbGlja1xuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlQ2xpY2soZSlcbiAgKTtcbiAgLy8gb3ZlcmxheSBtb3VzZW1vdmVcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlKGUpXG4gICk7XG4gIC8vIG92ZXJsYXkgbW91c2VsZWF2ZVxuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUxlYXZlKClcbiAgKTtcblxuICAvLyBEcmF3IGluaXRpYWwgYm9hcmQgbGluZXNcbiAgZHJhdy5saW5lcyhib2FyZEN0eCwgY2FudmFzWCwgY2FudmFzWSk7XG5cbiAgLy8gUmV0dXJuIGNvbXBsZXRlZCBjYW52YXNlc1xuICByZXR1cm4gY2FudmFzQ29udGFpbmVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ2FudmFzO1xuIiwiLyogVGhpcyBtb2R1bGUgY29udGFpbnMgdGhlIG1ldGhvZHMgdXNlZCBieSBHcmlkQ2FudmFzIHRvIGFjdHVhbGwgZHJhdyBlbGVtZW50c1xuICB0byB0aGUgYm9hcmQgYW5kIG92ZXJsYXkgY2FudmFzIGVsZW1lbnRzLiBUaGlzIGluY2x1ZGVzIGdyaWQgbGluZXMsIHNoaXAgcGxhY2VtZW50cyxcbiAgaGl0cywgbWlzc2VzIGFuZCB2YXJpb3VzIGNlbGwgaGlnaGxpZ2h0IGVmZmVjdHMuICovXG5cbmNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIC8vIERyYXdzIHRoZSBncmlkIGxpbmVzXG4gIGNvbnN0IGxpbmVzID0gKGNvbnRleHQsIGNhbnZhc1gsIGNhbnZhc1kpID0+IHtcbiAgICAvLyBEcmF3IGdyaWQgbGluZXNcbiAgICBjb25zdCBncmlkU2l6ZSA9IE1hdGgubWluKGNhbnZhc1gsIGNhbnZhc1kpIC8gMTA7XG4gICAgY29uc3QgbGluZUNvbG9yID0gXCJibGFja1wiO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBsaW5lQ29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuXG4gICAgLy8gRHJhdyB2ZXJ0aWNhbCBsaW5lc1xuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IGNhbnZhc1g7IHggKz0gZ3JpZFNpemUpIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyh4LCAwKTtcbiAgICAgIGNvbnRleHQubGluZVRvKHgsIGNhbnZhc1kpO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IGhvcml6b250YWwgbGluZXNcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8PSBjYW52YXNZOyB5ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjYW52YXNYLCB5KTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIERyYXdzIHRoZSBzaGlwcy4gRGVmYXVsdCBkYXRhIHRvIHVzZSBpcyB1c2VyIHNoaXBzLCBidXQgYWkgY2FuIGJlIHVzZWQgdG9vXG4gIGNvbnN0IHNoaXBzID0gKGNvbnRleHQsIGNlbGxYLCBjZWxsWSwgZ20sIHVzZXJTaGlwcyA9IHRydWUpID0+IHtcbiAgICAvLyBEcmF3IGEgY2VsbCB0byBib2FyZFxuICAgIGZ1bmN0aW9uIGRyYXdDZWxsKHBvc1gsIHBvc1kpIHtcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QocG9zWCAqIGNlbGxYLCBwb3NZICogY2VsbFksIGNlbGxYLCBjZWxsWSk7XG4gICAgfVxuICAgIC8vIFdoaWNoIGJvYXJkIHRvIGdldCBzaGlwcyBkYXRhIGZyb21cbiAgICBjb25zdCBib2FyZCA9IHVzZXJTaGlwcyA9PT0gdHJ1ZSA/IGdtLnVzZXJCb2FyZCA6IGdtLmFpQm9hcmQ7XG4gICAgLy8gRHJhdyB0aGUgY2VsbHMgdG8gdGhlIGJvYXJkXG4gICAgYm9hcmQuc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5vY2N1cGllZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgZHJhd0NlbGwoY2VsbFswXSwgY2VsbFsxXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBEcmF3cyBhIGhpdCBvciBhIG1pc3MgZGVmYXVsdGluZyB0byBhIG1pc3MgaWYgbm8gdHlwZSBwYXNzZWRcbiAgY29uc3QgaGl0T3JNaXNzID0gKGNvbnRleHQsIGNlbGxYLCBjZWxsWSwgbW91c2VDb29yZHMsIHR5cGUgPSAwKSA9PiB7XG4gICAgLy8gU2V0IHByb3BlciBmaWxsIGNvbG9yXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgaWYgKHR5cGUgPT09IDEpIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZWRcIjtcbiAgICAvLyBTZXQgYSByYWRpdXMgZm9yIGNpcmNsZSB0byBkcmF3IGZvciBcInBlZ1wiIHRoYXQgd2lsbCBhbHdheXMgZml0IGluIGNlbGxcbiAgICBjb25zdCByYWRpdXMgPSBjZWxsWCA+IGNlbGxZID8gY2VsbFkgLyAyIDogY2VsbFggLyAyO1xuICAgIC8vIERyYXcgdGhlIGNpcmNsZVxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmMoXG4gICAgICBtb3VzZUNvb3Jkc1swXSAqIGNlbGxYICsgY2VsbFggLyAyLFxuICAgICAgbW91c2VDb29yZHNbMV0gKiBjZWxsWSArIGNlbGxZIC8gMixcbiAgICAgIHJhZGl1cyxcbiAgICAgIDAsXG4gICAgICAyICogTWF0aC5QSVxuICAgICk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfTtcblxuICBjb25zdCBwbGFjZW1lbnRIaWdobGlnaHQgPSAoXG4gICAgY29udGV4dCxcbiAgICBjYW52YXNYLFxuICAgIGNhbnZhc1ksXG4gICAgY2VsbFgsXG4gICAgY2VsbFksXG4gICAgbW91c2VDb29yZHMsXG4gICAgZ21cbiAgKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1gsIGNhbnZhc1kpO1xuICAgIC8vIERyYXcgYSBjZWxsIHRvIG92ZXJsYXlcbiAgICBmdW5jdGlvbiBkcmF3Q2VsbChwb3NYLCBwb3NZKSB7XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KHBvc1ggKiBjZWxsWCwgcG9zWSAqIGNlbGxZLCBjZWxsWCwgY2VsbFkpO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSBjdXJyZW50IHNoaXAgbGVuZ3RoIChiYXNlZCBvbiBkZWZhdWx0IGJhdHRsZXNoaXAgcnVsZXMgc2l6ZXMsIHNtYWxsZXN0IHRvIGJpZ2dlc3QpXG4gICAgbGV0IGRyYXdMZW5ndGg7XG4gICAgY29uc3Qgc2hpcHNDb3VudCA9IGdtLnVzZXJCb2FyZC5zaGlwcy5sZW5ndGg7XG4gICAgaWYgKHNoaXBzQ291bnQgPT09IDApIGRyYXdMZW5ndGggPSAyO1xuICAgIGVsc2UgaWYgKHNoaXBzQ291bnQgPT09IDEgfHwgc2hpcHNDb3VudCA9PT0gMikgZHJhd0xlbmd0aCA9IDM7XG4gICAgZWxzZSBkcmF3TGVuZ3RoID0gc2hpcHNDb3VudCArIDE7XG5cbiAgICAvLyBEZXRlcm1pbmUgZGlyZWN0aW9uIHRvIGRyYXcgaW5cbiAgICBsZXQgZGlyZWN0aW9uWCA9IDA7XG4gICAgbGV0IGRpcmVjdGlvblkgPSAwO1xuXG4gICAgaWYgKGdtLnVzZXJCb2FyZC5kaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgIGRpcmVjdGlvblkgPSAxO1xuICAgICAgZGlyZWN0aW9uWCA9IDA7XG4gICAgfSBlbHNlIGlmIChnbS51c2VyQm9hcmQuZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMDtcbiAgICAgIGRpcmVjdGlvblggPSAxO1xuICAgIH1cblxuICAgIC8vIERpdmlkZSB0aGUgZHJhd0xlbmdodCBpbiBoYWxmIHdpdGggcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZkRyYXdMZW5ndGggPSBNYXRoLmZsb29yKGRyYXdMZW5ndGggLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJMZW5ndGggPSBkcmF3TGVuZ3RoICUgMjtcblxuICAgIC8vIElmIGRyYXdpbmcgb2ZmIGNhbnZhcyBtYWtlIGNvbG9yIHJlZFxuICAgIC8vIENhbGN1bGF0ZSBtYXhpbXVtIGFuZCBtaW5pbXVtIGNvb3JkaW5hdGVzXG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVggPVxuICAgICAgbW91c2VDb29yZHNbMF0gKyAoaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGggLSAxKSAqIGRpcmVjdGlvblg7XG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVkgPVxuICAgICAgbW91c2VDb29yZHNbMV0gKyAoaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGggLSAxKSAqIGRpcmVjdGlvblk7XG4gICAgY29uc3QgbWluQ29vcmRpbmF0ZVggPSBtb3VzZUNvb3Jkc1swXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWDtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWSA9IG1vdXNlQ29vcmRzWzFdIC0gaGFsZkRyYXdMZW5ndGggKiBkaXJlY3Rpb25ZO1xuXG4gICAgLy8gQW5kIHRyYW5zbGF0ZSBpbnRvIGFuIGFjdHVhbCBjYW52YXMgcG9zaXRpb25cbiAgICBjb25zdCBtYXhYID0gbWF4Q29vcmRpbmF0ZVggKiBjZWxsWDtcbiAgICBjb25zdCBtYXhZID0gbWF4Q29vcmRpbmF0ZVkgKiBjZWxsWTtcbiAgICBjb25zdCBtaW5YID0gbWluQ29vcmRpbmF0ZVggKiBjZWxsWDtcbiAgICBjb25zdCBtaW5ZID0gbWluQ29vcmRpbmF0ZVkgKiBjZWxsWTtcblxuICAgIC8vIENoZWNrIGlmIGFueSBjZWxscyBhcmUgb3V0c2lkZSB0aGUgY2FudmFzIGJvdW5kYXJpZXNcbiAgICBjb25zdCBpc091dE9mQm91bmRzID1cbiAgICAgIG1heFggPj0gY2FudmFzWCB8fCBtYXhZID49IGNhbnZhc1kgfHwgbWluWCA8IDAgfHwgbWluWSA8IDA7XG5cbiAgICAvLyBTZXQgdGhlIGZpbGwgY29sb3IgYmFzZWQgb24gd2hldGhlciBjZWxscyBhcmUgZHJhd24gb2ZmIGNhbnZhc1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gaXNPdXRPZkJvdW5kcyA/IFwicmVkXCIgOiBcImJsdWVcIjtcblxuICAgIC8vIERyYXcgdGhlIG1vdXNlZCBvdmVyIGNlbGwgZnJvbSBwYXNzZWQgY29vcmRzXG4gICAgZHJhd0NlbGwobW91c2VDb29yZHNbMF0sIG1vdXNlQ29vcmRzWzFdKTtcblxuICAgIC8vIERyYXcgdGhlIGZpcnN0IGhhbGYgb2YgY2VsbHMgYW5kIHJlbWFpbmRlciBpbiBvbmUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXh0WCA9IG1vdXNlQ29vcmRzWzBdICsgaSAqIGRpcmVjdGlvblg7XG4gICAgICBjb25zdCBuZXh0WSA9IG1vdXNlQ29vcmRzWzFdICsgaSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cblxuICAgIC8vIERyYXcgdGhlIHJlbWFpbmluZyBoYWxmXG4gICAgLy8gRHJhdyB0aGUgcmVtYWluaW5nIGNlbGxzIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZEcmF3TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5leHRYID0gbW91c2VDb29yZHNbMF0gLSAoaSArIDEpICogZGlyZWN0aW9uWDtcbiAgICAgIGNvbnN0IG5leHRZID0gbW91c2VDb29yZHNbMV0gLSAoaSArIDEpICogZGlyZWN0aW9uWTtcbiAgICAgIGRyYXdDZWxsKG5leHRYLCBuZXh0WSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGF0dGFja0hpZ2hsaWdodCA9IChcbiAgICBjb250ZXh0LFxuICAgIGNhbnZhc1gsXG4gICAgY2FudmFzWSxcbiAgICBjZWxsWCxcbiAgICBjZWxsWSxcbiAgICBtb3VzZUNvb3JkcyxcbiAgICBnbVxuICApID0+IHtcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzXG4gICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzWCwgY2FudmFzWSk7XG5cbiAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmVkXCI7XG5cbiAgICAvLyBDaGVjayBpZiBjZWxsIGNvb3JkcyBpbiBnYW1lYm9hcmQgaGl0cyBvciBtaXNzZXNcbiAgICBpZiAoZ20uYWlCb2FyZC5hbHJlYWR5QXR0YWNrZWQobW91c2VDb29yZHMpKSByZXR1cm47XG5cbiAgICAvLyBIaWdobGlnaHQgdGhlIGNlbGxcbiAgICBjb250ZXh0LmZpbGxSZWN0KFxuICAgICAgbW91c2VDb29yZHNbMF0gKiBjZWxsWCxcbiAgICAgIG1vdXNlQ29vcmRzWzFdICogY2VsbFksXG4gICAgICBjZWxsWCxcbiAgICAgIGNlbGxZXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4geyBsaW5lcywgc2hpcHMsIGhpdE9yTWlzcywgcGxhY2VtZW50SGlnaGxpZ2h0LCBhdHRhY2tIaWdobGlnaHQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXc7XG4iLCIvKiBUaGlzIG1vZHVsZSBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgcGxheWVyIG9iamVjdHMgdGhhdCBzdG9yZSBvdGhlciBvYmplY3RzIGFuZCBpbmZvIHJlbGF0ZWRcbiAgdG8gdGhlIHVzZXIgcGxheWVyIGFuZCBBSSBwbGF5ZXIuIFRoaXMgaW5jbHVkZXMgdGhlaXIgZ2FtZWJvYXJkcywgbmFtZXMsIGFuZCBhIG1ldGhvZCBmb3JcbiAgc2VuZGluZyBhdHRhY2tzIHRvIGEgZ2FtZWJvYXJkLiAqL1xuXG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL0dhbWVib2FyZFwiO1xuXG4vKiBGYWN0b3J5IHRoYXQgY3JlYXRlcyBhbmQgcmV0dXJucyBhIHBsYXllciBvYmplY3QgdGhhdCBjYW4gdGFrZSBhIHNob3QgYXQgb3Bwb25lbnQncyBnYW1lIGJvYXJkLlxuICAgUmVxdWlyZXMgZ2FtZU1hbmFnZXIgZm9yIGdhbWVib2FyZCBtZXRob2RzICovXG5jb25zdCBQbGF5ZXIgPSAoZ20pID0+IHtcbiAgbGV0IHByaXZhdGVOYW1lID0gXCJcIjtcbiAgY29uc3QgdGhpc1BsYXllciA9IHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBwcml2YXRlTmFtZTtcbiAgICB9LFxuICAgIHNldCBuYW1lKG5ld05hbWUpIHtcbiAgICAgIGlmIChuZXdOYW1lKSB7XG4gICAgICAgIHByaXZhdGVOYW1lID0gbmV3TmFtZS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIHByaXZhdGVOYW1lID0gXCJcIjtcbiAgICB9LFxuICAgIGdhbWVib2FyZDogR2FtZWJvYXJkKGdtKSxcbiAgICBzZW5kQXR0YWNrOiBudWxsLFxuICB9O1xuXG4gIC8vIEhlbHBlciBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhdHRhY2sgcG9zaXRpb24gaXMgb24gYm9hcmRcbiAgY29uc3QgdmFsaWRhdGVBdHRhY2sgPSAocG9zaXRpb24sIGdhbWVib2FyZCkgPT4ge1xuICAgIC8vIERvZXMgZ2FtZWJvYXJkIGV4aXN0IHdpdGggbWF4Qm9hcmRYL3kgcHJvcGVydGllcz9cbiAgICBpZiAoIWdhbWVib2FyZCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBJcyBwb3NpdGlvbiBjb25zdHJhaW5lZCB0byBtYXhib2FyZFgvWSBhbmQgYm90aCBhcmUgaW50cyBpbiBhbiBhcnJheT9cbiAgICBpZiAoXG4gICAgICBwb3NpdGlvbiAmJlxuICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICBwb3NpdGlvblswXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblswXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRYICYmXG4gICAgICBwb3NpdGlvblsxXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblsxXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRZXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3Igc2VuZGluZyBhdHRhY2sgdG8gcml2YWwgZ2FtZWJvYXJkXG4gIHRoaXNQbGF5ZXIuc2VuZEF0dGFjayA9IChwb3NpdGlvbiwgcGxheWVyQm9hcmQgPSB0aGlzUGxheWVyLmdhbWVib2FyZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUF0dGFjayhwb3NpdGlvbiwgcGxheWVyQm9hcmQpKSB7XG4gICAgICBwbGF5ZXJCb2FyZC5yaXZhbEJvYXJkLnJlY2VpdmVBdHRhY2socG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdGhpc1BsYXllcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8qIFRoaXMgbW9kdWxlIGlzIGEgZmFjdG9yeSB1c2VkIGJ5IHRoZSBHYW1lYm9hcmQgZmFjdG9yeSBtb2R1bGUgdG8gcG9wdWxhdGUgZ2FtZWJvYXJkcyB3aXRoXG4gIHNoaXBzLiBBIHNoaXAgb2JqZWN0IHdpbGwgYmUgcmV0dXJuZWQgdGhhdCBpbmNsdWRlcyB2YXJpb3VzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdGF0ZVxuICBvZiB0aGUgc2hpcCBzdWNoIGFzIHdoYXQgY2VsbHMgaXQgb2NjdXBpZXMsIGl0cyBzaXplLCB0eXBlLCBldGMuICovXG5cbi8vIENvbnRhaW5zIHRoZSBuYW1lcyBmb3IgdGhlIHNoaXBzIGJhc2VkIG9uIGluZGV4XG5jb25zdCBzaGlwTmFtZXMgPSB7XG4gIDE6IFwiU2VudGluZWwgUHJvYmVcIixcbiAgMjogXCJBc3NhdWx0IFRpdGFuXCIsXG4gIDM6IFwiVmlwZXIgTWVjaFwiLFxuICA0OiBcIklyb24gR29saWF0aFwiLFxuICA1OiBcIkxldmlhdGhhblwiLFxufTtcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgc2hpcHNcbmNvbnN0IFNoaXAgPSAoaW5kZXgsIHBvc2l0aW9uLCBkaXJlY3Rpb24pID0+IHtcbiAgLy8gVmFsaWRhdGUgaW5kZXhcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGluZGV4KSB8fCBpbmRleCA+IDUgfHwgaW5kZXggPCAxKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIC8vIENyZWF0ZSB0aGUgc2hpcCBvYmplY3QgdGhhdCB3aWxsIGJlIHJldHVybmVkXG4gIGNvbnN0IHRoaXNTaGlwID0ge1xuICAgIGluZGV4LFxuICAgIHNpemU6IG51bGwsXG4gICAgdHlwZTogbnVsbCxcbiAgICBoaXRzOiAwLFxuICAgIGhpdDogbnVsbCxcbiAgICBpc1N1bms6IG51bGwsXG4gICAgb2NjdXBpZWRDZWxsczogW10sXG4gIH07XG5cbiAgLy8gU2V0IHNoaXAgc2l6ZVxuICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgY2FzZSAxOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICB0aGlzU2hpcC5zaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzU2hpcC5zaXplID0gaW5kZXg7XG4gIH1cblxuICAvLyBTZXQgc2hpcCBuYW1lIGJhc2VkIG9uIGluZGV4XG4gIHRoaXNTaGlwLnR5cGUgPSBzaGlwTmFtZXNbdGhpc1NoaXAuaW5kZXhdO1xuXG4gIC8vIEFkZHMgYSBoaXQgdG8gdGhlIHNoaXBcbiAgdGhpc1NoaXAuaGl0ID0gKCkgPT4ge1xuICAgIHRoaXNTaGlwLmhpdHMgKz0gMTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmVzIGlmIHNoaXAgc3VuayBpcyB0cnVlXG4gIHRoaXNTaGlwLmlzU3VuayA9ICgpID0+IHtcbiAgICBpZiAodGhpc1NoaXAuaGl0cyA+PSB0aGlzU2hpcC5zaXplKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gUGxhY2VtZW50IGRpcmVjdGlvbiBpcyBlaXRoZXIgMCBmb3IgaG9yaXpvbnRhbCBvciAxIGZvciB2ZXJ0aWNhbFxuICBsZXQgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDA7XG4gIGxldCBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMDtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gMCkge1xuICAgIHBsYWNlbWVudERpcmVjdGlvblggPSAxO1xuICAgIHBsYWNlbWVudERpcmVjdGlvblkgPSAwO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gMSkge1xuICAgIHBsYWNlbWVudERpcmVjdGlvblggPSAwO1xuICAgIHBsYWNlbWVudERpcmVjdGlvblkgPSAxO1xuICB9XG5cbiAgLy8gVXNlIHBvc2l0aW9uIGFuZCBkaXJlY3Rpb24gdG8gYWRkIG9jY3VwaWVkIGNlbGxzIGNvb3Jkc1xuICBpZiAoXG4gICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgKGRpcmVjdGlvbiA9PT0gMSB8fCBkaXJlY3Rpb24gPT09IDApXG4gICkge1xuICAgIC8vIERpdmlkZSBsZW5ndGggaW50byBoYWxmIGFuZCByZW1haW5kZXJcbiAgICBjb25zdCBoYWxmU2l6ZSA9IE1hdGguZmxvb3IodGhpc1NoaXAuc2l6ZSAvIDIpO1xuICAgIGNvbnN0IHJlbWFpbmRlclNpemUgPSB0aGlzU2hpcC5zaXplICUgMjtcbiAgICAvLyBBZGQgZmlyc3QgaGFsZiBvZiBjZWxscyBwbHVzIHJlbWFpbmRlciBpbiBvbmUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmU2l6ZSArIHJlbWFpbmRlclNpemU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV3Q29vcmRzID0gW1xuICAgICAgICBwb3NpdGlvblswXSArIGkgKiBwbGFjZW1lbnREaXJlY3Rpb25YLFxuICAgICAgICBwb3NpdGlvblsxXSArIGkgKiBwbGFjZW1lbnREaXJlY3Rpb25ZLFxuICAgICAgXTtcbiAgICAgIHRoaXNTaGlwLm9jY3VwaWVkQ2VsbHMucHVzaChuZXdDb29yZHMpO1xuICAgIH1cbiAgICAvLyBBZGQgc2Vjb25kIGhhbGYgb2YgY2VsbHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZTaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gLSAoaSArIDEpICogcGxhY2VtZW50RGlyZWN0aW9uWCxcbiAgICAgICAgcG9zaXRpb25bMV0gLSAoaSArIDEpICogcGxhY2VtZW50RGlyZWN0aW9uWSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1NoaXA7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8qIFRoaXMgbW9kdWxlIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoYXQgY2VsbHMgdGhlIEFJIHNob3VsZCBhdHRhY2suIEl0IGNob29zZXMgYXR0YWNrIFxuICBzdGFydGVnaWVzIGJhc2VkIG9uIHRoZSBhaSBkaWZmaWN1bHR5IHNldHRpbmcgb24gdGhlIGdhbWVNYW5hZ2VyLiBBZnRlciBhdHRhY2sgY29vcmRzXG4gIGFyZSBmb3VuZCB0aGV5IGFyZSBzZW50IG9mZiB0byB0aGUgZ2FtZU1hbmFnZXIgdG8gaGFuZGxlIHRoZSBhaUF0dGFja2luZyBsb2dpYyBmb3IgdGhlXG4gIHJlc3Qgb2YgdGhlIHByb2dyYW0uICovXG5cbmltcG9ydCBhaUJyYWluIGZyb20gXCIuL2FpQnJhaW5cIjtcblxuLy8gTW9kdWxlIHRoYXQgYWxsb3dzIGFpIHRvIG1ha2UgYXR0YWNrcyBiYXNlZCBvbiBwcm9iYWJpbGl0eSBhbmQgaGV1cmlzdGljc1xuY29uc3QgYnJhaW4gPSBhaUJyYWluKCk7XG5cbi8vIFRoaXMgaGVscGVyIHdpbGwgbG9vayBhdCBjdXJyZW50IGhpdHMgYW5kIG1pc3NlcyBhbmQgdGhlbiByZXR1cm4gYW4gYXR0YWNrXG5jb25zdCBhaUF0dGFjayA9IChnbSwgZGVsYXkpID0+IHtcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcbiAgbGV0IGF0dGFja0Nvb3JkcyA9IFtdO1xuXG4gIC8vIFVwZGF0ZSBjZWxsIGhpdCBwcm9iYWJpbGl0aWVzXG4gIGJyYWluLnVwZGF0ZVByb2JzKGdtKTtcblxuICAvLyBNZXRob2QgZm9yIHJldHVybmluZyByYW5kb20gYXR0YWNrXG4gIGNvbnN0IGZpbmRSYW5kb21BdHRhY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRXaWR0aCk7XG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRIZWlnaHQpO1xuICAgIGF0dGFja0Nvb3JkcyA9IFt4LCB5XTtcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCBmaW5kcyBsYXJnZXN0IHZhbHVlIGluIDJkIGFycmF5XG4gIGNvbnN0IGZpbmRHcmVhdGVzdFByb2JBdHRhY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgYWxsUHJvYnMgPSBicmFpbi5wcm9icztcbiAgICBsZXQgbWF4ID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxQcm9icy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhbGxQcm9ic1tpXS5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBpZiAoYWxsUHJvYnNbaV1bal0gPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSBhbGxQcm9ic1tpXVtqXTtcbiAgICAgICAgICBhdHRhY2tDb29yZHMgPSBbaSwgal07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmFuZG9tIGF0dGFjayBpZiBhaSBkaWZmaWN1bHR5IGlzIDFcbiAgaWYgKGdtLmFpRGlmZmljdWx0eSA9PT0gMSkge1xuICAgIC8vIFNldCByYW5kb20gYXR0YWNrICBjb29yZHMgdGhhdCBoYXZlIG5vdCBiZWVuIGF0dGFja2VkXG4gICAgZmluZFJhbmRvbUF0dGFjaygpO1xuICAgIHdoaWxlIChnbS51c2VyQm9hcmQuYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICAgIGZpbmRSYW5kb21BdHRhY2soKTtcbiAgICB9XG4gIH1cblxuICAvLyBEbyBhbiBhdHRhY2sgYmFzZWQgb24gcHJvYmFiaWxpdGllcyBpZiBhaSBkaWZmaWN1bHR5IGlzIDIgYW5kIGlzIHNlZWtpbmdcbiAgZWxzZSBpZiAoZ20uYWlEaWZmaWN1bHR5ID09PSAyICYmIGdtLmFpQm9hcmQuaXNBaVNlZWtpbmcpIHtcbiAgICAvLyBGaXJzdCBlbnN1cmUgdGhhdCBlbXB0eSBjZWxscyBhcmUgc2V0IHRvIHRoZWlyIGluaXRpYWxpemVkIHByb2JzIHdoZW4gc2Vla2luZ1xuICAgIGJyYWluLnJlc2V0SGl0QWRqYWNlbnRJbmNyZWFzZXMoKTtcbiAgICAvLyBUaGVuIGZpbmQgdGhlIGJlc3QgYXR0YWNrXG4gICAgZmluZEdyZWF0ZXN0UHJvYkF0dGFjaygpO1xuICAgIHdoaWxlIChnbS51c2VyQm9hcmQuYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICAgIGZpbmRHcmVhdGVzdFByb2JBdHRhY2soKTtcbiAgICB9XG4gIH1cblxuICAvLyBEbyBhbiBhdHRhY2sgYmFzZWQgb24gZGVzdHJveSBiZWhhdmlvciBhZnRlciBhIGhpdCBpcyBmb3VuZFxuICBlbHNlIGlmIChnbS5haURpZmZpY3VsdHkgPT09IDIgJiYgIWdtLmFpQm9hcmQuaXNBaVNlZWtpbmcpIHtcbiAgICAvLyBHZXQgY29vcmRzIHVzaW5nIGRlc3Ryb3kgbWV0aG9kXG4gICAgY29uc3QgY29vcmRzID0gYnJhaW4uZGVzdHJveU1vZGVDb29yZHMoZ20pO1xuICAgIC8vIElmIG5vIGNvb3JkcyBhcmUgcmV0dXJuZWQgaW5zdGVhZCB1c2Ugc2Vla2luZyBzdHJhdFxuICAgIGlmICghY29vcmRzKSB7XG4gICAgICAvLyBGaXJzdCBlbnN1cmUgdGhhdCBlbXB0eSBjZWxscyBhcmUgc2V0IHRvIHRoZWlyIGluaXRpYWxpemVkIHByb2JzIHdoZW4gc2Vla2luZ1xuICAgICAgYnJhaW4ucmVzZXRIaXRBZGphY2VudEluY3JlYXNlcygpO1xuICAgICAgLy8gVGhlbiBmaW5kIHRoZSBiZXN0IGF0dGFja1xuICAgICAgZmluZEdyZWF0ZXN0UHJvYkF0dGFjaygpO1xuICAgICAgd2hpbGUgKGdtLnVzZXJCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgICBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEVsc2UgaWYgY29vcmRzIHJldHVybmVkLCB1c2UgdGhvc2UgZm9yIGF0dGFja1xuICAgIGVsc2UgaWYgKGNvb3Jkcykge1xuICAgICAgYXR0YWNrQ29vcmRzID0gY29vcmRzO1xuICAgIH1cbiAgfVxuICAvLyBTZW5kIGF0dGFjayB0byBnYW1lIG1hbmFnZXJcbiAgZ20uYWlBdHRhY2tpbmcoYXR0YWNrQ29vcmRzLCBkZWxheSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhaUF0dGFjaztcbiIsIi8qIFRoaXMgbW9kdWxlIHNlcnZlcyBhcyB0aGUgaW50ZWxsaWdlbmNlIG9mIHRoZSBBSSBwbGF5ZXIuIEl0IHVzZXMgYSAyZCBhcnJheSBvZiBoaXQgXG5wcm9iYWJpbGl0aWVzLCBtYWRlIGF2YWlsYWJsZSB0byBhaUF0dGFjaywgdG8gZGV0ZXJtaW5lIGF0dGFjayBjb29yZHMgd2hlbiB0aGUgQUkgaXMgaW4gXG5zZWVrIG1vZGUuIFdoZW4gYSBuZXcgaGl0IGlzIGZvdW5kIGFuZCB0aGUgQUkgc3dpdGNoZXMgdG8gZGVzdHJveSBtb2RlIGEgZGlmZmVyZW50IHNldCBvZlxubWV0aG9kcyBhcmUgdXNlZCB0byBkZXN0cm95IGZvdW5kIHNoaXBzIHF1aWNrbHkgYW5kIGxvZ2ljYWxseS4gVGhlcmUgaXMgYWxzbyBhIHNldCBvZiBtZXRob2RzXG5mb3IgdXBkYXRpbmcgdGhlIHByb2JhYmlsaXRpZXMgaW4gcmVzcG9uc2UgdG8gaGl0cyBhbmQgc2hpcHMgYmVpbmcgc3VuayBpbiBvcmRlciB0byBiZXR0ZXJcbmRldGVybWluZSBhdHRhY2tzIHdoaWxlIGluIGRlc3Ryb3kgbW9kZS4gKi9cblxuaW1wb3J0IGNyZWF0ZVByb2JzIGZyb20gXCIuL2NyZWF0ZVByb2JzXCI7XG5cbmNvbnN0IGFpQnJhaW4gPSAoKSA9PiB7XG4gIC8vIFByb2JhYmlsaXR5IG1vZGlmaWVyc1xuICBjb25zdCBjb2xvck1vZCA9IDAuMzM7IC8vIFN0cm9uZyBuZWdhdGl2ZSBiaWFzIHVzZWQgdG8gaW5pdGlhbGl6ZSBhbGwgcHJvYnNcbiAgY29uc3QgYWRqYWNlbnRNb2QgPSA0OyAvLyBNZWRpdW0gcG9zaXRpdmUgYmlhcyBmb3IgaGl0IGFkamFjZW50IGFkanVzdG1lbnRzXG5cbiAgLy8gQ3JlYXRlIHRoZSBwcm9ic1xuICBjb25zdCBwcm9icyA9IGNyZWF0ZVByb2JzKGNvbG9yTW9kKTtcblxuICAvLyBDb3B5IHRoZSBpbml0aWFsIHByb2JzIGZvciBsYXRlciB1c2VcbiAgY29uc3QgaW5pdGlhbFByb2JzID0gcHJvYnMubWFwKChyb3cpID0+IFsuLi5yb3ddKTtcblxuICAvLyAjcmVnaW9uIEdlbmVyYWwgdXNlIGhlbHBlcnNcbiAgLy8gSGVscGVyIHRoYXQgY2hlY2tzIGlmIHZhbGlkIGNlbGwgb24gZ3JpZFxuICBmdW5jdGlvbiBpc1ZhbGlkQ2VsbChyb3csIGNvbCkge1xuICAgIC8vIFNldCByb3dzIGFuZCBjb2xzXG4gICAgY29uc3QgbnVtUm93cyA9IHByb2JzWzBdLmxlbmd0aDtcbiAgICBjb25zdCBudW1Db2xzID0gcHJvYnMubGVuZ3RoO1xuICAgIHJldHVybiByb3cgPj0gMCAmJiByb3cgPCBudW1Sb3dzICYmIGNvbCA+PSAwICYmIGNvbCA8IG51bUNvbHM7XG4gIH1cblxuICAvLyBIZWxwZXIgdGhhdCBjaGVja3MgaWYgY2VsbCBpcyBhIGJvdW5kYXJ5IG9yIG1pc3MgKC0xIHZhbHVlKVxuICBmdW5jdGlvbiBpc0JvdW5kYXJ5T3JNaXNzKHJvdywgY29sKSB7XG4gICAgcmV0dXJuICFpc1ZhbGlkQ2VsbChyb3csIGNvbCkgfHwgcHJvYnNbcm93XVtjb2xdID09PSAtMTtcbiAgfVxuXG4gIC8vIEhlbHBlcnMgZm9yIGdldHRpbmcgcmVtYWluaW5nIHNoaXAgbGVuZ3Roc1xuICBjb25zdCBnZXRMYXJnZXN0UmVtYWluaW5nTGVuZ3RoID0gKGdtKSA9PiB7XG4gICAgLy8gTGFyZ2VzdCBzaGlwIGxlbmd0aFxuICAgIGxldCBsYXJnZXN0U2hpcExlbmd0aCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IE9iamVjdC5rZXlzKGdtLnVzZXJCb2FyZC5zdW5rZW5TaGlwcykubGVuZ3RoOyBpID49IDE7IGkgLT0gMSkge1xuICAgICAgaWYgKCFnbS51c2VyQm9hcmQuc3Vua2VuU2hpcHNbaV0pIHtcbiAgICAgICAgbGFyZ2VzdFNoaXBMZW5ndGggPSBpO1xuICAgICAgICBsYXJnZXN0U2hpcExlbmd0aCA9IGkgPT09IDEgPyAyIDogbGFyZ2VzdFNoaXBMZW5ndGg7XG4gICAgICAgIGxhcmdlc3RTaGlwTGVuZ3RoID0gaSA9PT0gMiA/IDMgOiBsYXJnZXN0U2hpcExlbmd0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsYXJnZXN0U2hpcExlbmd0aDtcbiAgfTtcblxuICBjb25zdCBnZXRTbWFsbGVzdFJlbWFpbmluZ0xlbmd0aCA9IChnbSkgPT4ge1xuICAgIGxldCBzbWFsbGVzdFNoaXBMZW5ndGggPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgT2JqZWN0LmtleXMoZ20udXNlckJvYXJkLnN1bmtlblNoaXBzKS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKCFnbS51c2VyQm9hcmQuc3Vua2VuU2hpcHNbaV0pIHtcbiAgICAgICAgc21hbGxlc3RTaGlwTGVuZ3RoID0gaSA9PT0gMCA/IDIgOiBzbWFsbGVzdFNoaXBMZW5ndGg7XG4gICAgICAgIHNtYWxsZXN0U2hpcExlbmd0aCA9IGkgPT09IDEgPyAzIDogc21hbGxlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBzbWFsbGVzdFNoaXBMZW5ndGggPSBpID4gMSA/IGkgOiBzbWFsbGVzdFNoaXBMZW5ndGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc21hbGxlc3RTaGlwTGVuZ3RoO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIERlc3RvcnkgbW9kZSBtb3ZlIGRldGVybWluYXRpb25cblxuICAvKiBUaGUgZ2VuZXJhbCBpZGVhIGhlcmUgaXMgdG8gY2F1c2UgdGhlIEFJIHRvIGRvIHdoYXQgaHVtYW4gcGxheWVycyBkbyB1cG9uIGZpbmRpbmdcbiAgICBhIG5ldyBzaGlwLiBUeXBpY2FsbHkgd2hlbiB5b3UgZmluZCBhIHNoaXAgeW91IHN0YXJ0IGF0dGFja2luZyBhZGphY2VudCBjZWxscyB0byBcbiAgICBmaW5kIHRoZSBcIm5leHQgcGFydFwiIG9mIHRoZSBzaGlwLCBjaGFuZ2luZyB0byBvdGhlciBhZGphY2VudCBjZWxscyB3aGVuIGZpbmRpbmcgYSBtaXNzLFxuICAgIG9yIGdvaW5nIGluIHRoZSBvdGhlciBkaXJlY3Rpb24gd2hlbiBhIG1pcyBpcyBmb3VuZCBhZnRlciBhIGhpdCwgZXRjLlxuICAgIFxuICAgIFRoaXMgaXMgYWNjb21wbGlzaGVkIHVzaW5nIGxpc3RzIG9mIGNlbGxzIHRvIGNoZWNrIGFuZCByZWN1cnNpdmUgbG9naWMgdG8ga2VlcCBjaGVja2luZ1xuICAgIHRoZSBcIm5leHQgY2VsbFwiIGFmdGVyIGFuIGFkamFjZW50IGhpdCBpcyBmb3VuZCwgYXMgd2VsbCBhcyB0byByZWN1cnNpdmVseSBrZWVwIGNoZWNraW5nXG4gICAgaWYgYSBzaGlwIGlzIHN1bmssIGJ1dCBvdGhlciBoaXRzIGV4aXN0IHRoYXQgYXJlbid0IHBhcnQgb2YgdGhlIHN1bmtlbiBzaGlwLCB3aGljaFxuICAgIGluZGljYXRlcyBtb3JlIHNoaXBzIHRoYXQgaGF2ZSBiZWVuIGRpc2NvdmVyZWQgYnV0IG5vdCB5ZXQgc3Vuay4gKi9cblxuICAvLyBIZWxwZXIgZm9yIGxvYWRpbmcgYWRqYWNlbnQgY2VsbHMgaW50byBhcHByb3ByaWF0ZSBhcnJheXNcbiAgY29uc3QgbG9hZEFkamFjZW50Q2VsbHMgPSAoY2VudGVyQ2VsbCwgYWRqYWNlbnRIaXRzLCBhZGphY2VudEVtcHRpZXMsIGdtKSA9PiB7XG4gICAgLy8gQ2VudGVyIENlbGwgeCBhbmQgeVxuICAgIGNvbnN0IFtjZW50ZXJYLCBjZW50ZXJZXSA9IGNlbnRlckNlbGw7XG4gICAgLy8gQWRqYWNlbnQgdmFsdWVzIHJvdyBmaXJzdCwgdGhlbiBjb2xcbiAgICBjb25zdCB0b3AgPSBbY2VudGVyWSAtIDEsIGNlbnRlclgsIFwidG9wXCJdO1xuICAgIGNvbnN0IGJvdHRvbSA9IFtjZW50ZXJZICsgMSwgY2VudGVyWCwgXCJib3R0b21cIl07XG4gICAgY29uc3QgbGVmdCA9IFtjZW50ZXJZLCBjZW50ZXJYIC0gMSwgXCJsZWZ0XCJdO1xuICAgIGNvbnN0IHJpZ2h0ID0gW2NlbnRlclksIGNlbnRlclggKyAxLCBcInJpZ2h0XCJdO1xuXG4gICAgLy8gRm4gdGhhdCBjaGVja3MgdGhlIGNlbGxzIGFuZCBhZGRzIHRoZW0gdG8gYXJyYXlzXG4gICAgZnVuY3Rpb24gY2hlY2tDZWxsKGNlbGxZLCBjZWxsWCwgZGlyZWN0aW9uKSB7XG4gICAgICBpZiAoaXNWYWxpZENlbGwoY2VsbFksIGNlbGxYKSkge1xuICAgICAgICAvLyBJZiBoaXQgYW5kIG5vdCBvY2N1cGllZCBieSBzdW5rZW4gc2hpcCBhZGQgdG8gaGl0c1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcHJvYnNbY2VsbFhdW2NlbGxZXSA9PT0gMCAmJlxuICAgICAgICAgICFnbS51c2VyQm9hcmQuaXNDZWxsU3VuayhbY2VsbFgsIGNlbGxZXSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgYWRqYWNlbnRIaXRzLnB1c2goW2NlbGxYLCBjZWxsWSwgZGlyZWN0aW9uXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgZW1wdHkgYWRkIHRvIGVtcGl0ZXNcbiAgICAgICAgZWxzZSBpZiAocHJvYnNbY2VsbFhdW2NlbGxZXSA+IDApIHtcbiAgICAgICAgICBhZGphY2VudEVtcHRpZXMucHVzaChbY2VsbFgsIGNlbGxZLCBkaXJlY3Rpb25dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrQ2VsbCguLi50b3ApO1xuICAgIGNoZWNrQ2VsbCguLi5ib3R0b20pO1xuICAgIGNoZWNrQ2VsbCguLi5sZWZ0KTtcbiAgICBjaGVja0NlbGwoLi4ucmlnaHQpO1xuICB9O1xuXG4gIC8vIEhlbHBlciB0aGF0IHJldHVybnMgaGlnaGVzdCBwcm9iIGFkamFjZW50IGVtcHR5XG4gIGNvbnN0IHJldHVybkJlc3RBZGphY2VudEVtcHR5ID0gKGFkamFjZW50RW1wdGllcykgPT4ge1xuICAgIGxldCBhdHRhY2tDb29yZHMgPSBudWxsO1xuICAgIC8vIENoZWNrIGVhY2ggZW1wdHkgY2VsbCBhbmQgcmV0dXJuIHRoZSBtb3N0IGxpa2VseSBoaXQgYmFzZWQgb24gcHJvYnNcbiAgICBsZXQgbWF4VmFsdWUgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGphY2VudEVtcHRpZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGFkamFjZW50RW1wdGllc1tpXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcHJvYnNbeF1beV07XG4gICAgICAvLyBVcGRhdGUgbWF4VmFsdWUgaWYgZm91bmQgdmFsdWUgYmlnZ2VyLCBhbG9uZyB3aXRoIGF0dGFjayBjb29yZHNcbiAgICAgIGlmICh2YWx1ZSA+IG1heFZhbHVlKSB7XG4gICAgICAgIG1heFZhbHVlID0gdmFsdWU7XG4gICAgICAgIGF0dGFja0Nvb3JkcyA9IFt4LCB5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF0dGFja0Nvb3JkcztcbiAgfTtcblxuICAvLyBIZWxwZXIgbWV0aG9kIGZvciBoYW5kbGluZyBhZGphY2VudCBoaXRzIHJlY3Vyc2l2ZWx5XG4gIGNvbnN0IGhhbmRsZUFkamFjZW50SGl0ID0gKFxuICAgIGdtLFxuICAgIGFkamFjZW50SGl0cyxcbiAgICBhZGphY2VudEVtcHRpZXMsXG4gICAgY2VsbENvdW50ID0gMFxuICApID0+IHtcbiAgICAvLyBJbmNyZW1lbnQgY2VsbCBjb3VudFxuICAgIGxldCB0aGlzQ291bnQgPSBjZWxsQ291bnQgKyAxO1xuXG4gICAgLy8gQmlnZ2VzdCBzaGlwIGxlbmd0aFxuICAgIGNvbnN0IGxhcmdlc3RTaGlwTGVuZ3RoID0gZ2V0TGFyZ2VzdFJlbWFpbmluZ0xlbmd0aChnbSk7XG5cbiAgICAvLyBJZiB0aGlzQ291bnQgaXMgYmlnZ2VyIHRoYW4gdGhlIGJpZ2dlc3QgcG9zc2libGUgbGluZSBvZiBzaGlwc1xuICAgIGlmICh0aGlzQ291bnQgPiBsYXJnZXN0U2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gR2V0IHRoZSBhZGphY2VudCBoaXQgdG8gY29uc2lkZXJcbiAgICBjb25zdCBoaXQgPSBhZGphY2VudEhpdHNbMF07XG4gICAgY29uc3QgW2hpdFgsIGhpdFksIGRpcmVjdGlvbl0gPSBoaXQ7XG5cbiAgICAvLyBUaGUgbmV4dCBjZWxsIGluIHRoZSBzYW1lIGRpcmVjdGlvblxuICAgIGxldCBuZXh0Q2VsbCA9IG51bGw7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJ0b3BcIikgbmV4dENlbGwgPSBbaGl0WCwgaGl0WSAtIDFdO1xuICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJib3R0b21cIikgbmV4dENlbGwgPSBbaGl0WCwgaGl0WSArIDFdO1xuICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJsZWZ0XCIpIG5leHRDZWxsID0gW2hpdFggLSAxLCBoaXRZXTtcbiAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwicmlnaHRcIikgbmV4dENlbGwgPSBbaGl0WCArIDEsIGhpdFldO1xuICAgIGNvbnN0IFtuZXh0WCwgbmV4dFldID0gbmV4dENlbGw7XG5cbiAgICAvLyBSZWYgdG8gZm91bmQgZW1wdHkgY2VsbFxuICAgIGxldCBmb3VuZEVtcHR5ID0gbnVsbDtcblxuICAgIC8vIElmIGNlbGwgY291bnQgaXMgbm90IGxhcmdlciB0aGFuIHRoZSBiaWdnZXN0IHJlbWFpbmluZyBzaGlwXG4gICAgY29uc3QgY2hlY2tOZXh0Q2VsbCA9IChuWCwgblkpID0+IHtcbiAgICAgIGlmICh0aGlzQ291bnQgPD0gbGFyZ2VzdFNoaXBMZW5ndGgpIHtcbiAgICAgICAgLy8gSWYgbmV4dCBjZWxsIGlzIGEgbWlzcyBzdG9wIGNoZWNraW5nIGluIHRoaXMgZGlyZWN0aW9uIGJ5IHJlbW92aW5nIHRoZSBhZGphY2VudEhpdFxuICAgICAgICBpZiAocHJvYnNbblhdW25ZXSA9PT0gLTEgfHwgIWlzVmFsaWRDZWxsKG5ZLCBuWCkpIHtcbiAgICAgICAgICBhZGphY2VudEhpdHMuc2hpZnQoKTtcbiAgICAgICAgICAvLyBUaGVuIGlmIGFkamFjZW50IGhpdHMgaXNuJ3QgZW1wdHkgdHJ5IHRvIGhhbmRsZSB0aGUgbmV4dCBhZGphY2VudCBoaXRcbiAgICAgICAgICBpZiAoYWRqYWNlbnRIaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvdW5kRW1wdHkgPSBoYW5kbGVBZGphY2VudEhpdChnbSwgYWRqYWNlbnRIaXRzLCBhZGphY2VudEVtcHRpZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBFbHNlIGlmIGl0IGlzIGVtcHR5IHRyeSB0byByZXR1cm4gdGhlIGJlc3QgYWRqYWNlbnQgZW1wdHkgY2VsbFxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm91bmRFbXB0eSA9IHJldHVybkJlc3RBZGphY2VudEVtcHR5KGFkamFjZW50RW1wdGllcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZSBjZWxsIGlzIGEgaGl0XG4gICAgICAgIGVsc2UgaWYgKHByb2JzW25YXVtuWV0gPT09IDApIHtcbiAgICAgICAgICAvLyBJbmNyZW1lbnQgdGhlIGNlbGwgY291bnRcbiAgICAgICAgICB0aGlzQ291bnQgKz0gMTtcbiAgICAgICAgICAvLyBOZXcgbmV4dCBjZWxsIHJlZlxuICAgICAgICAgIGxldCBuZXdOZXh0ID0gbnVsbDtcbiAgICAgICAgICAvLyBJbmNyZW1lbnQgdGhlIG5leHRDZWxsIGluIHRoZSBzYW1lIGRpcmVjdGlvbiBhcyBhZGphY2VudCBoaXQgYmVpbmcgY2hlY2tlZFxuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwidG9wXCIpIG5ld05leHQgPSBbblgsIG5ZIC0gMV07XG4gICAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcImJvdHRvbVwiKSBuZXdOZXh0ID0gW25YLCBuWSArIDFdO1xuICAgICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJsZWZ0XCIpIG5ld05leHQgPSBbblggLSAxLCBuWV07XG4gICAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIG5ld05leHQgPSBbblggKyAxLCBuWV07XG4gICAgICAgICAgLy8gU2V0IG5leHRYIGFuZCBuZXh0WSB0byB0aGUgY29vcmRzIG9mIHRoaXMgaW5jcmVtZW50ZWQgbmV4dCBjZWxsXG4gICAgICAgICAgY29uc3QgW25ld1gsIG5ld1ldID0gbmV3TmV4dDtcbiAgICAgICAgICAvLyBSZWN1cnNpdmVseSBjaGVjayB0aGUgbmV4dCBjZWxsXG4gICAgICAgICAgY2hlY2tOZXh0Q2VsbChuZXdYLCBuZXdZKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGUgY2VsbCBpcyBlbXB0eSBhbmQgdmFsaWRcbiAgICAgICAgZWxzZSBpZiAoaXNWYWxpZENlbGwoblksIG5YKSAmJiBwcm9ic1tuWF1bblldID4gMCkge1xuICAgICAgICAgIGZvdW5kRW1wdHkgPSBbblgsIG5ZXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBJbml0aWFsIGNhbGwgdG8gYWJvdmUgcmVjdXJzaXZlIGhlbHBlclxuICAgIGlmICh0aGlzQ291bnQgPD0gbGFyZ2VzdFNoaXBMZW5ndGgpIHtcbiAgICAgIGNoZWNrTmV4dENlbGwobmV4dFgsIG5leHRZKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmRFbXB0eTtcbiAgfTtcblxuICAvLyBIZWxwZXIgbWV0aG9kIGZvciBjaGVja2luZyB0aGUgYWRqYWNlbnQgaGl0cyBmb3IgbmVhcmJ5IGVtcHRpZXNcbiAgY29uc3QgY2hlY2tBZGphY2VudENlbGxzID0gKGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzLCBnbSkgPT4ge1xuICAgIC8vIFZhcmlhYmxlIGZvciBjb29yZGlhdGVzIHRvIHJldHVyblxuICAgIGxldCBhdHRhY2tDb29yZHMgPSBudWxsO1xuXG4gICAgLy8gSWYgbm8gaGl0cyB0aGVuIHNldCBhdHRhY2tDb29yZHMgdG8gYW4gZW1wdHkgY2VsbCBpZiBvbmUgZXhpc3RzXG4gICAgaWYgKGFkamFjZW50SGl0cy5sZW5ndGggPT09IDAgJiYgYWRqYWNlbnRFbXB0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF0dGFja0Nvb3JkcyA9IHJldHVybkJlc3RBZGphY2VudEVtcHR5KGFkamFjZW50RW1wdGllcyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIGhpdHMgdGhlbiBoYW5kbGUgY2hlY2tpbmcgY2VsbHMgYWZ0ZXIgdGhlbSB0byBmaW5kIGVtcHR5IGZvciBhdHRhY2tcbiAgICBpZiAoYWRqYWNlbnRIaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF0dGFja0Nvb3JkcyA9IGhhbmRsZUFkamFjZW50SGl0KGdtLCBhZGphY2VudEhpdHMsIGFkamFjZW50RW1wdGllcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dGFja0Nvb3JkcztcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIGRlc3RyeWluZyBmb3VuZCBzaGlwc1xuICBjb25zdCBkZXN0cm95TW9kZUNvb3JkcyA9IChnbSkgPT4ge1xuICAgIC8vIExvb2sgYXQgZmlyc3QgY2VsbCB0byBjaGVjayB3aGljaCB3aWxsIGJlIHRoZSBvbGRlc3QgYWRkZWQgY2VsbFxuICAgIGNvbnN0IGNlbGxUb0NoZWNrID0gZ20uYWlCb2FyZC5jZWxsc1RvQ2hlY2tbMF07XG5cbiAgICAvLyBQdXQgYWxsIGFkamFjZW50IGNlbGxzIGluIGFkamFjZW50RW1wdGllcy9hZGphY2VudEhpdHNcbiAgICBjb25zdCBhZGphY2VudEhpdHMgPSBbXTtcbiAgICBjb25zdCBhZGphY2VudEVtcHRpZXMgPSBbXTtcbiAgICBsb2FkQWRqYWNlbnRDZWxscyhjZWxsVG9DaGVjaywgYWRqYWNlbnRIaXRzLCBhZGphY2VudEVtcHRpZXMsIGdtKTtcblxuICAgIGNvbnN0IGF0dGFja0Nvb3JkcyA9IGNoZWNrQWRqYWNlbnRDZWxscyhhZGphY2VudEhpdHMsIGFkamFjZW50RW1wdGllcywgZ20pO1xuXG4gICAgLy8gSWYgYWpkYWNlbnRFbXB0aWVzIGFuZCBhZGphY2VudEhpdHMgYXJlIGJvdGggZW1wdHkgYW5kIGF0dGFjayBjb29yZHMgbnVsbFxuICAgIGlmIChcbiAgICAgIGF0dGFja0Nvb3JkcyA9PT0gbnVsbCAmJlxuICAgICAgYWRqYWNlbnRIaXRzLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgYWRqYWNlbnRFbXB0aWVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBlbnRyeSBvZiBjZWxscyB0byBjaGVja1xuICAgICAgZ20uYWlCb2FyZC5jZWxsc1RvQ2hlY2suc2hpZnQoKTtcbiAgICAgIC8vIElmIGNlbGxzIHJlbWFpbiB0byBiZSBjaGVja2VkXG4gICAgICBpZiAoZ20uYWlCb2FyZC5jZWxsc1RvQ2hlY2subGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUcnkgdXNpbmcgdGhlIG5leHQgY2VsbCB0byBjaGVjayBmb3IgZGVzdHJveU1vZGVDb29yZHNcbiAgICAgICAgZGVzdHJveU1vZGVDb29yZHMoZ20pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKGBEZXN0cm95IHRhcmdldCBmb3VuZCEgJHthdHRhY2tDb29yZHN9YCk7XG4gICAgcmV0dXJuIGF0dGFja0Nvb3JkcztcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBNZXRob2RzIGZvciB1cGRhdGluZyBwcm9icyBvbiBoaXQgYW5kIG1pc3NcblxuICAvKiBXaGVuIGEgaGl0IGlzIGZpcnN0IGRpc2NvdmVyZWQsIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGNlbGxzIGdldCBhIHN0YWNraW5nLFxuICAgIHRlbXBvcmFyaXkgcHJvYmFiaWxpdHkgaW5jcmVhc2UuIFRoaXMgaXMgdG8gaGVscCBkaXJlY3QgdGhlIGRlc3Ryb3kgcHJvY2VzcyB0b1xuICAgIGNob29zZSB0aGUgYmVzdCBjZWxscyB3aGlsZSBkZXN0cm95aW5nLCBmb3IgZXhhbXBsZSBvbmx5IGF0dGFja2luZyBlbXB0eSBjZWxsc1xuICAgIGluIHRoZSBzYW1lIGRpcmVjdGlvbiBhcyB0aGUgbGlrZWx5IHNoaXAgcGxhY2VtZW50LlxuICAgIFxuICAgIEFmdGVyIGFsbCBjdXJyZW50bHkgZGlzY292ZXJlZCBzaGlwcyBhcmUgZGVzdHJveWVkLCB0aGUgcHJvYmFiaWxpdGllcyBvZiByZW1haW5pbmdcbiAgICBlbXB0eSBjZWxscyBhcmUgYnJvdWdodCBiYWNrIHRvIHRoZWlyIGluaXRpYWwgdmFsdWVzIHNvIGFzIHRvIG5vdCBkaXNydXB0IHRoZSBvcHRpbWFsXG4gICAgc2Vla2luZyBwcm9jZXNzIHdoZW4gbG9va2luZyBmb3IgdGhlIG5leHQgc2hpcC4gKi9cblxuICAvLyBSZWNvcmRzIHdpY2ggY2VsbHMgd2VyZSBhbHRlcmVkIHdpdGggaGlkQWRqYWNlbnRJbmNyZWFzZVxuICBjb25zdCBpbmNyZWFzZWRBZGphY2VudENlbGxzID0gW107XG4gIC8vIEluY3JlYXNlIGFkamFjZW50IGNlbGxzIHRvIG5ldyBoaXRzXG4gIGNvbnN0IGhpdEFkamFjZW50SW5jcmVhc2UgPSAoaGl0WCwgaGl0WSwgbGFyZ2VzdExlbmd0aCkgPT4ge1xuICAgIC8vIFZhcnMgZm9yIGNhbGN1bGF0aW5nIGRlY3JlbWVudCBmYWN0b3JcbiAgICBjb25zdCBzdGFydGluZ0RlYyA9IDE7XG4gICAgY29uc3QgZGVjUGVyY2VudGFnZSA9IDAuMTtcbiAgICBjb25zdCBtaW5EZWMgPSAwLjU7XG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIGNlbGxzIGFuZCB1cGRhdGUgdGhlbVxuICAgIC8vIE5vcnRoXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXJnZXN0TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBkZWNyZW1lbnRGYWN0b3IgPSBzdGFydGluZ0RlYyAtIGkgKiBkZWNQZXJjZW50YWdlO1xuICAgICAgaWYgKGRlY3JlbWVudEZhY3RvciA8IG1pbkRlYykgZGVjcmVtZW50RmFjdG9yID0gbWluRGVjO1xuICAgICAgLy8gTm9ydGggaWYgb24gYm9hcmRcbiAgICAgIGlmIChoaXRZIC0gaSA+PSAwKSB7XG4gICAgICAgIC8vIEluY3JlYXNlIHRoZSBwcm9iYWJpbGl0eVxuICAgICAgICBwcm9ic1toaXRYXVtoaXRZIC0gaV0gKj0gYWRqYWNlbnRNb2QgKiBkZWNyZW1lbnRGYWN0b3I7XG4gICAgICAgIC8vIFJlY29yZCB0aGUgY2VsbCB0byBpbmNyZWFzZWQgYWRqYWNlbnQgY2VsbHMgZm9yIGxhdGVyIHVzZVxuICAgICAgICBpbmNyZWFzZWRBZGphY2VudENlbGxzLnB1c2goW2hpdFgsIGhpdFkgLSBpXSk7XG4gICAgICB9XG4gICAgICAvLyBTb3V0aCBpZiBvbiBib2FyZFxuICAgICAgaWYgKGhpdFkgKyBpIDw9IDkpIHtcbiAgICAgICAgcHJvYnNbaGl0WF1baGl0WSArIGldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgICBpbmNyZWFzZWRBZGphY2VudENlbGxzLnB1c2goW2hpdFgsIGhpdFkgKyBpXSk7XG4gICAgICB9XG4gICAgICAvLyBXZXN0IGlmIG9uIGJvYXJkXG4gICAgICBpZiAoaGl0WCAtIGkgPj0gMCkge1xuICAgICAgICBwcm9ic1toaXRYIC0gaV1baGl0WV0gKj0gYWRqYWNlbnRNb2QgKiBkZWNyZW1lbnRGYWN0b3I7XG4gICAgICAgIGluY3JlYXNlZEFkamFjZW50Q2VsbHMucHVzaChbaGl0WCAtIGksIGhpdFldKTtcbiAgICAgIH1cbiAgICAgIC8vIEVhc3QgaWYgb24gYm9hcmRcbiAgICAgIGlmIChoaXRYICsgaSA8PSA5KSB7XG4gICAgICAgIHByb2JzW2hpdFggKyBpXVtoaXRZXSAqPSBhZGphY2VudE1vZCAqIGRlY3JlbWVudEZhY3RvcjtcbiAgICAgICAgaW5jcmVhc2VkQWRqYWNlbnRDZWxscy5wdXNoKFtoaXRYICsgaSwgaGl0WV0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZXNldEhpdEFkamFjZW50SW5jcmVhc2VzID0gKCkgPT4ge1xuICAgIC8vIElmIGxpc3QgZW1wdHkgdGhlbiBqdXN0IHJldHVyblxuICAgIGlmIChpbmNyZWFzZWRBZGphY2VudENlbGxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIC8vIElmIHRoZSB2YWx1ZXMgaW4gdGhlIGxpc3QgYXJlIHN0aWxsIGVtcHR5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmNyZWFzZWRBZGphY2VudENlbGxzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBpbmNyZWFzZWRBZGphY2VudENlbGxzW2ldO1xuICAgICAgaWYgKHByb2JzW3hdW3ldID4gMCkge1xuICAgICAgICAvLyBSZS1pbml0aWFsaXplIHRoZWlyIHByb2IgdmFsdWVcbiAgICAgICAgcHJvYnNbeF1beV0gPSBpbml0aWFsUHJvYnNbeF1beV07XG4gICAgICAgIC8vIEFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBsaXN0XG4gICAgICAgIGluY3JlYXNlZEFkamFjZW50Q2VsbHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAvLyBSZXNldCB0aGUgaXRlcmF0b3JcbiAgICAgICAgaSA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja0RlYWRDZWxscyA9ICgpID0+IHtcbiAgICAvLyBTZXQgcm93cyBhbmQgY29sc1xuICAgIGNvbnN0IG51bVJvd3MgPSBwcm9ic1swXS5sZW5ndGg7XG4gICAgY29uc3QgbnVtQ29scyA9IHByb2JzLmxlbmd0aDtcblxuICAgIC8vIEZvciBldmVyeSBjZWxsLCBjaGVjayB0aGUgY2VsbHMgYXJvdW5kIGl0LiBJZiB0aGV5IGFyZSBhbGwgYm91bmRhcnkgb3IgbWlzcyB0aGVuIHNldCB0byAtMVxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG51bVJvd3M7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBudW1Db2xzOyBjb2wgKz0gMSkge1xuICAgICAgICAvLyBJZiB0aGUgY2VsbCBpcyBhbiBlbXB0eSBjZWxsICg+IDApIGFuZCBhZGphY2VudCBjZWxscyBhcmUgYm91bmRhcnkgb3IgbWlzc1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcHJvYnNbcm93XVtjb2xdID4gMCAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93LCBjb2wgLSAxKSAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93LCBjb2wgKyAxKSAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93IC0gMSwgY29sKSAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93ICsgMSwgY29sKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBTZXQgdGhhdCBjZWxsIHRvIGEgbWlzcyBzaW5jZSBpdCBjYW5ub3QgYmUgYSBoaXRcbiAgICAgICAgICBwcm9ic1tyb3ddW2NvbF0gPSAtMTtcbiAgICAgICAgICAvKiBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGAke3Jvd30sICR7Y29sfSBzdXJyb3VuZGVkIGFuZCBjYW5ub3QgYmUgYSBoaXQuIFNldCB0byBtaXNzLmBcbiAgICAgICAgICApOyAqL1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IHVwZGF0ZXMgcHJvYmFiaWxpdGllcyBiYXNlZCBvbiBoaXRzLCBtaXNzZXMsIGFuZCByZW1haW5pbmcgc2hpcHMnIGxlbmd0aHNcbiAgY29uc3QgdXBkYXRlUHJvYnMgPSAoZ20pID0+IHtcbiAgICAvLyBUaGVzZSB2YWx1ZXMgYXJlIHVzZWQgYXMgdGhlIGV2aWRlbmNlIHRvIHVwZGF0ZSB0aGUgcHJvYmFiaWxpdGllcyBvbiB0aGUgcHJvYnNcbiAgICBjb25zdCB7IGhpdHMsIG1pc3NlcyB9ID0gZ20udXNlckJvYXJkO1xuXG4gICAgLy8gTGFyZ2VzdCBzaGlwIGxlbmd0aFxuICAgIGNvbnN0IGxhcmdlc3RTaGlwTGVuZ3RoID0gZ2V0TGFyZ2VzdFJlbWFpbmluZ0xlbmd0aChnbSk7XG4gICAgLy8gU21hbGxlc3Qgc2hpcCBsZW5ndGhcbiAgICBjb25zdCBzbWFsbGVzdFNoaXBMZW5ndGggPSBnZXRTbWFsbGVzdFJlbWFpbmluZ0xlbmd0aChnbSk7XG5cbiAgICAvLyBVcGRhdGUgdmFsdWVzIGJhc2VkIG9uIGhpdHNcbiAgICBPYmplY3QudmFsdWVzKGhpdHMpLmZvckVhY2goKGhpdCkgPT4ge1xuICAgICAgY29uc3QgW3gsIHldID0gaGl0O1xuICAgICAgLy8gSWYgdGhlIGhpdCBpcyBuZXcsIGFuZCB0aGVyZWZvcmUgdGhlIHByb2IgZm9yIHRoYXQgaGl0IGlzIG5vdCB5ZXQgMFxuICAgICAgaWYgKHByb2JzW3hdW3ldICE9PSAwKSB7XG4gICAgICAgIC8vIEFwcGx5IHRoZSBpbmNyZWFzZSB0byBhZGphY2VudCBjZWxscy4gVGhpcyB3aWxsIGJlIHJlZHVjZWQgdG8gaW5pdGFsIHByb2JzIG9uIHNlZWsgbW9kZS5cbiAgICAgICAgaGl0QWRqYWNlbnRJbmNyZWFzZSh4LCB5LCBsYXJnZXN0U2hpcExlbmd0aCk7XG4gICAgICAgIC8vIFNldCB0aGUgcHJvYmFiaWxpdHkgb2YgdGhlIGhpdCB0byAwXG4gICAgICAgIHByb2JzW3hdW3ldID0gMDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB2YWx1ZXMgYmFzZWQgb24gbWlzc2VzXG4gICAgT2JqZWN0LnZhbHVlcyhtaXNzZXMpLmZvckVhY2goKG1pc3MpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IG1pc3M7XG4gICAgICAvLyBTZXQgdGhlIHByb2JhYmlsaXR5IG9mIGV2ZXJ5IG1pc3MgdG8gMCB0byBwcmV2ZW50IHRoYXQgY2VsbCBmcm9tIGJlaW5nIHRhcmdldGVkXG4gICAgICBwcm9ic1t4XVt5XSA9IC0xO1xuICAgIH0pO1xuXG4gICAgLyogUmVkdWNlIHRoZSBjaGFuY2Ugb2YgZ3JvdXBzIG9mIGNlbGxzIHRoYXQgYXJlIHN1cnJvdW5kZWQgYnkgbWlzc2VzIG9yIHRoZSBlZGdlIG9mIHRoZSBib2FyZCBcbiAgICAgIGlmIHRoZSBncm91cCBsZW5ndGggaXMgbm90IGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgZ3JlYXRlc3QgcmVtYWluaW5nIHNoaXAgbGVuZ3RoLiAqL1xuICAgIGNoZWNrRGVhZENlbGxzKHNtYWxsZXN0U2hpcExlbmd0aCk7XG5cbiAgICAvLyBPcHRpb25hbGx5IGxvZyB0aGUgcmVzdWx0c1xuICAgIC8vIGxvZ1Byb2JzKHByb2JzKTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBNZXRob2QgYW5kIGhlbHBlciBmb3IgbG9nZ2luZyBwcm9ic1xuICAvLyBIZWxwZXIgdG8gdHJhbnNwb3NlIGFycmF5IGZvciBjb25zb2xlLnRhYmxlJ3MgYW5ub3lpbmcgY29sIGZpcnN0IGFwcHJvYWNoXG4gIGNvbnN0IHRyYW5zcG9zZUFycmF5ID0gKGFycmF5KSA9PlxuICAgIGFycmF5WzBdLm1hcCgoXywgY29sSW5kZXgpID0+IGFycmF5Lm1hcCgocm93KSA9PiByb3dbY29sSW5kZXhdKSk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBjb25zdCBsb2dQcm9icyA9IChwcm9ic1RvTG9nKSA9PiB7XG4gICAgLy8gTG9nIHRoZSBwcm9ic1xuICAgIGNvbnN0IHRyYW5zcG9zZWRQcm9icyA9IHRyYW5zcG9zZUFycmF5KHByb2JzVG9Mb2cpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS50YWJsZSh0cmFuc3Bvc2VkUHJvYnMpO1xuICAgIC8vIExvZyB0aGUgdG9hbCBvZiBhbGwgcHJvYnNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgcHJvYnNUb0xvZy5yZWR1Y2UoXG4gICAgICAgIChzdW0sIHJvdykgPT4gc3VtICsgcm93LnJlZHVjZSgocm93U3VtLCB2YWx1ZSkgPT4gcm93U3VtICsgdmFsdWUsIDApLFxuICAgICAgICAwXG4gICAgICApXG4gICAgKTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgcmV0dXJuIHtcbiAgICB1cGRhdGVQcm9icyxcbiAgICByZXNldEhpdEFkamFjZW50SW5jcmVhc2VzLFxuICAgIGRlc3Ryb3lNb2RlQ29vcmRzLFxuICAgIHByb2JzLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWlCcmFpbjtcbiIsIi8qIFRoaXMgbW9kdWxlIGlzIHVzZWQgdG8gY3JlYXRlIHRoZSBpbml0aWFsIHByb2JhYmlsaXR5IGFycmF5IGZvciBhaUJyYWluLlxuICBJdCBkb2VzIHRoaXMgYnkgZmlyc3QgaW5pdGlhbGl6aW5nIHRoZSBwcm9iYWJpbGl0ZXMgd2l0aCBhIGJpYXMgdG93YXJkcyBjZW50cmFsXG4gIGNlbGxzLCBhbmQgdGhlbiBmdXJ0aGVyIGFkanVzdHMgdGhlc2UgaW5pdGlhbCB3ZWlnaHRzIHRvIGNyZWF0ZSBhIFwiY2hlc3MgYm9hcmRcIiBcbiAgcGF0dGVybiBvZiBjZWxscyB0aGF0IGhhdmUgbXVjaCBoaWdoZXIgYW5kIG11Y2ggbG93ZXIgcHJpb3JpdGllcywgYXQgcmFuZG9tLiBTbyBmb3JcbiAgZXhhbXBsZSwgaW4gb25lIGdhbWUgXCJ3aGl0ZVwiIGNlbGxzIG1pZ2h0IGJlIGhlYXZpbHkgd2VpZ2h0ZWQgY29tcGFyZWQgdG8gXCJibGFja1wiIGNlbGxzLlxuICBcbiAgVGhlIHJlYXNvbmluZyBmb3IgZG9pbmcgYm90aCBvZiB0aGVzZSB0aGluZ3MgaXMgZXhwbGFpbmVkIGhlcmU6IFxuICBodHRwczovL2Jsb2dzLmdsb3dzY290bGFuZC5vcmcudWsvZ2xvd2Jsb2dzL25qb2xkZmllbGRlcG9ydGZvbGlvMS8yMDE1LzEyLzAxL21hdGhlbWF0aWNzLWJlaGluZC1iYXR0bGVzaGlwLyBcbiAgXG4gIEluIGEgbnV0c2hlbGwsIGNoZWNrZXJib2FyZCBiZWNhdXNlIGFsbCBib2F0cyBhcmUgYXQgbGVhc3QgMiBzcGFjZXMgbG9uZywgc28geW91IGNhbiBpZ25vcmUgZXZlcnlcbiAgb3RoZXIgc3BhY2Ugd2hpbGUgc2Vla2luZyBhIG5ldyBzaGlwLiBDZW50cmFsIGJpYXMgZHVlIHRvIHRoZSBuYXR1cmUgb2YgaG93IHNoaXBzIHRha2UgdXBcbiAgc3BhY2Ugb24gdGhlIGJvYXJkLiBDb3JuZXJzIHdpbGwgYWx3YXlzIGJlIHRoZSBsZWFzdCBsaWtlbHkgdG8gaGF2ZSBhIHNoaXAsIGNlbnRyYWwgdGhlIGhpZ2hlc3QuICovXG5cbi8vIEhlbHBlciBtZXRob2QgZm9yIG5vcm1hbGl6aW5nIHRoZSBwcm9iYWJpbGl0aWVzXG5jb25zdCBub3JtYWxpemVQcm9icyA9IChwcm9icykgPT4ge1xuICBsZXQgc3VtID0gMDtcblxuICAvLyBDYWxjdWxhdGUgdGhlIHN1bSBvZiBwcm9iYWJpbGl0aWVzIGluIHRoZSBwcm9ic1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBwcm9icy5sZW5ndGg7IHJvdyArPSAxKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgcHJvYnNbcm93XS5sZW5ndGg7IGNvbCArPSAxKSB7XG4gICAgICBzdW0gKz0gcHJvYnNbcm93XVtjb2xdO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcHJvYmFiaWxpdGllc1xuICBjb25zdCBub3JtYWxpemVkUHJvYnMgPSBbXTtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcHJvYnMubGVuZ3RoOyByb3cgKz0gMSkge1xuICAgIG5vcm1hbGl6ZWRQcm9ic1tyb3ddID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgcHJvYnNbcm93XS5sZW5ndGg7IGNvbCArPSAxKSB7XG4gICAgICBub3JtYWxpemVkUHJvYnNbcm93XVtjb2xdID0gcHJvYnNbcm93XVtjb2xdIC8gc3VtO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkUHJvYnM7XG59O1xuXG4vLyBNZXRob2QgdGhhdCBjcmVhdGVzIHByb2JzIGFuZCBkZWZpbmVzIGluaXRpYWwgcHJvYmFiaWxpdGllc1xuY29uc3QgY3JlYXRlUHJvYnMgPSAoY29sb3JNb2QpID0+IHtcbiAgLy8gQ3JlYXRlIHRoZSBwcm9icy4gSXQgaXMgYSAxMHgxMCBncmlkIG9mIGNlbGxzLlxuICBjb25zdCBpbml0aWFsUHJvYnMgPSBbXTtcblxuICAvLyBSYW5kb21seSBkZWNpZGUgd2hpY2ggXCJjb2xvclwiIG9uIHRoZSBwcm9icyB0byBmYXZvciBieSByYW5kb21seSBpbml0aWFsaXppbmcgY29sb3Igd2VpZ2h0XG4gIGNvbnN0IGluaXRpYWxDb2xvcldlaWdodCA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogY29sb3JNb2Q7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgcHJvYnMgd2l0aCAwJ3NcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgaW5pdGlhbFByb2JzLnB1c2goQXJyYXkoMTApLmZpbGwoMCkpO1xuICB9XG5cbiAgLy8gQXNzaWduIGluaXRpYWwgcHJvYmFiaWxpdGllcyBiYXNlZCBvbiBBbGVtaSdzIHRoZW9yeSAoMC4wOCBpbiBjb3JuZXJzLCAwLjIgaW4gNCBjZW50ZXIgY2VsbHMpXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgIC8vIE9uIGV2ZW4gcm93cyBzdGFydCB3aXRoIGFsdGVybmF0ZSBjb2xvciB3ZWlnaHRcbiAgICBsZXQgY29sb3JXZWlnaHQgPSBpbml0aWFsQ29sb3JXZWlnaHQ7XG4gICAgaWYgKHJvdyAlIDIgPT09IDApIHtcbiAgICAgIGNvbG9yV2VpZ2h0ID0gaW5pdGlhbENvbG9yV2VpZ2h0ID09PSAxID8gY29sb3JNb2QgOiAxO1xuICAgIH1cbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyXG4gICAgICBjb25zdCBjZW50ZXJYID0gNC41O1xuICAgICAgY29uc3QgY2VudGVyWSA9IDQuNTtcbiAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbUNlbnRlciA9IE1hdGguc3FydChcbiAgICAgICAgKHJvdyAtIGNlbnRlclgpICoqIDIgKyAoY29sIC0gY2VudGVyWSkgKiogMlxuICAgICAgKTtcblxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBwcm9iYWJpbGl0eSBiYXNlZCBvbiBFdWNsaWRlYW4gZGlzdGFuY2UgZnJvbSBjZW50ZXJcbiAgICAgIGNvbnN0IG1pblByb2JhYmlsaXR5ID0gMC4wODtcbiAgICAgIGNvbnN0IG1heFByb2JhYmlsaXR5ID0gMC4yO1xuICAgICAgY29uc3QgcHJvYmFiaWxpdHkgPVxuICAgICAgICBtaW5Qcm9iYWJpbGl0eSArXG4gICAgICAgIChtYXhQcm9iYWJpbGl0eSAtIG1pblByb2JhYmlsaXR5KSAqXG4gICAgICAgICAgKDEgLSBkaXN0YW5jZUZyb21DZW50ZXIgLyBNYXRoLnNxcnQoNC41ICoqIDIgKyA0LjUgKiogMikpO1xuXG4gICAgICAvLyBBZGp1c3QgdGhlIHdlaWdodHMgYmFzZWQgb24gQmFycnkncyB0aGVvcnkgKGlmIHByb2JzIGlzIGNoZWNrZXIgcHJvYnMsIHByZWZlciBvbmUgY29sb3IpXG4gICAgICBjb25zdCBiYXJyeVByb2JhYmlsaXR5ID0gcHJvYmFiaWxpdHkgKiBjb2xvcldlaWdodDtcblxuICAgICAgLy8gQXNzaWduIHByb2JhYmlsdHkgdG8gdGhlIHByb2JzXG4gICAgICBpbml0aWFsUHJvYnNbcm93XVtjb2xdID0gYmFycnlQcm9iYWJpbGl0eTtcblxuICAgICAgLy8gRmxpcCB0aGUgY29sb3Igd2VpZ2h0XG4gICAgICBjb2xvcldlaWdodCA9IGNvbG9yV2VpZ2h0ID09PSAxID8gY29sb3JNb2QgOiAxO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5vcm1hbGl6ZWQgcHJvYnNcbiAgY29uc3Qgbm9ybWFsaXplZFByb2JzID0gbm9ybWFsaXplUHJvYnMoaW5pdGlhbFByb2JzKTtcblxuICAvLyBSZXR1cm4gdGhlIG5vcm1hbGl6ZWQgcHJvYnNcbiAgcmV0dXJuIG5vcm1hbGl6ZWRQcm9icztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVByb2JzO1xuIiwiLyogVGhpcyBoZWxwZXIgbW9kdWxlIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgZ3JpZENhbnZhcyBjb21wb3VuZCBlbGVtZW50cyBhbmQgXG5yZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVycyBmb3IgdGhlbSBpbiB0aGUgaHRtbCB3aXRoIHRoZSBuZXcgZWxlbWVudHMgKi9cblxuaW1wb3J0IGdyaWRDYW52YXMgZnJvbSBcIi4uL2ZhY3Rvcmllcy9HcmlkQ2FudmFzL0dyaWRDYW52YXNcIjtcblxuLyogVGhpcyBtb2R1bGUgY3JlYXRlcyBjYW52YXMgZWxlbWVudHMgYW5kIGFkZHMgdGhlbSB0byB0aGUgYXBwcm9wcmlhdGUgXG4gICBwbGFjZXMgaW4gdGhlIERPTS4gKi9cbmNvbnN0IGNhbnZhc0FkZGVyID0gKHVzZXJHYW1lYm9hcmQsIGFpR2FtZWJvYXJkLCB3ZWJJbnRlcmZhY2UsIGdtKSA9PiB7XG4gIC8vIFJlcGxhY2UgdGhlIHRocmVlIGdyaWQgcGxhY2Vob2xkZXIgZWxlbWVudHMgd2l0aCB0aGUgcHJvcGVyIGNhbnZhc2VzXG4gIC8vIFJlZnMgdG8gRE9NIGVsZW1lbnRzXG4gIGNvbnN0IHBsYWNlbWVudFBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtY2FudmFzLXBoXCIpO1xuICBjb25zdCB1c2VyUEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVzZXItY2FudmFzLXBoXCIpO1xuICBjb25zdCBhaVBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1jYW52YXMtcGhcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBjYW52YXNlc1xuXG4gIGNvbnN0IHVzZXJDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIGdtLFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcInVzZXJcIiB9LFxuICAgIHVzZXJHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlXG4gICk7XG4gIGNvbnN0IGFpQ2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICBnbSxcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJhaVwiIH0sXG4gICAgYWlHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlXG4gICk7XG4gIGNvbnN0IHBsYWNlbWVudENhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgZ20sXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwicGxhY2VtZW50XCIgfSxcbiAgICB1c2VyR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZSxcbiAgICB1c2VyQ2FudmFzXG4gICk7XG5cbiAgLy8gUmVwbGFjZSB0aGUgcGxhY2UgaG9sZGVyc1xuICBwbGFjZW1lbnRQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwbGFjZW1lbnRDYW52YXMsIHBsYWNlbWVudFBIKTtcbiAgdXNlclBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVzZXJDYW52YXMsIHVzZXJQSCk7XG4gIGFpUEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYWlDYW52YXMsIGFpUEgpO1xuXG4gIC8vIFJldHVybiB0aGUgY2FudmFzZXNcbiAgcmV0dXJuIHsgcGxhY2VtZW50Q2FudmFzLCB1c2VyQ2FudmFzLCBhaUNhbnZhcyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2FudmFzQWRkZXI7XG4iLCIvKiBUaGlzIGhlbHBlciBtb2R1bGUgaXMgdXNlZCB0byBsb2FkIGltYWdlcyBpbnRvIGFycmF5cyBmb3IgdXNlIGluIHRoZVxuZ2FtZSBsb2cuICovXG5cbmNvbnN0IGltYWdlTG9hZGVyID0gKCkgPT4ge1xuICBjb25zdCBpbWFnZVJlZnMgPSB7XG4gICAgU1A6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIEFUOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBWTTogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgSUc6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIEw6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICB9O1xuXG4gIGNvbnN0IGltYWdlQ29udGV4dCA9IHJlcXVpcmUuY29udGV4dChcIi4uL3NjZW5lLWltYWdlc1wiLCB0cnVlLCAvXFwuanBnJC9pKTtcbiAgY29uc3QgZmlsZXMgPSBpbWFnZUNvbnRleHQua2V5cygpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XG4gICAgY29uc3QgZmlsZVBhdGggPSBpbWFnZUNvbnRleHQoZmlsZSk7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBjb25zdCBzdWJEaXIgPSBmaWxlLnNwbGl0KFwiL1wiKVsxXS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgaWYgKGZpbGVOYW1lLmluY2x1ZGVzKFwiaGl0XCIpKSB7XG4gICAgICBpbWFnZVJlZnNbc3ViRGlyXS5oaXQucHVzaChmaWxlUGF0aCk7XG4gICAgfSBlbHNlIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcImF0dGFja1wiKSkge1xuICAgICAgaW1hZ2VSZWZzW3N1YkRpcl0uYXR0YWNrLnB1c2goZmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCJnZW5cIikpIHtcbiAgICAgIGltYWdlUmVmc1tzdWJEaXJdLmdlbi5wdXNoKGZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW1hZ2VSZWZzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW1hZ2VMb2FkZXI7XG4iLCIvKiBUaGlzIG1vZHVsZSBpcyByZXNwb25zaWJsZSBmb3IgaW5pdGlhbGl6aW5nIHRoZSBnYW1lIGJ5IGNyZWF0aW5nXG4gIGluc3RhbmNlcyBvZiByZWxldmFudCBnYW1lIG9iamVjdHMgYW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemluZyB0aGVtXG4gIHdpdGggcHJvcGVyIHZhbHVlcy4gVGhlbiBpdCBoaWRlcyB0aGUgbG9hZGluZyBzY3JlZW4uICovXG5cbi8vIEltcG9ydCBtb2R1bGVzXG5pbXBvcnQgZ2FtZU1hbmFnZXIgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZU1hbmFnZXJcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2ZhY3Rvcmllcy9QbGF5ZXJcIjtcbmltcG9ydCBjYW52YXNBZGRlciBmcm9tIFwiLi9jYW52YXNBZGRlclwiO1xuaW1wb3J0IHdlYkludCBmcm9tIFwiLi4vbW9kdWxlcy93ZWJJbnRlcmZhY2VcIjtcbmltcG9ydCBwbGFjZUFpU2hpcHMgZnJvbSBcIi4vcGxhY2VBaVNoaXBzXCI7XG5pbXBvcnQgZ2FtZUxvZyBmcm9tIFwiLi4vbW9kdWxlcy9nYW1lTG9nXCI7XG5pbXBvcnQgc291bmRzIGZyb20gXCIuLi9tb2R1bGVzL3NvdW5kc1wiO1xuXG5jb25zdCBpbml0aWFsaXplR2FtZSA9ICgpID0+IHtcbiAgLy8gI3JlZ2lvbiBMb2FkaW5nL0luaXRcbiAgLy8gUmVmIHRvIGxvYWRpbmcgc2NyZWVuXG4gIGNvbnN0IGxvYWRpbmdTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvYWRpbmctc2NyZWVuXCIpO1xuXG4gIC8vIFJlZiB0byBnYW1lIG1hbmFnZXIgaW5zdGFuY2VcbiAgY29uc3QgZ20gPSBnYW1lTWFuYWdlcigpO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlIHdlYiBpbnRlcmZhY2Ugd2l0aCBnbSByZWZcbiAgY29uc3Qgd2ViSW50ZXJmYWNlID0gd2ViSW50KGdtKTtcblxuICAvLyBJbml0aWFsaXplIHNvdW5kIG1vZHVsZVxuICBjb25zdCBzb3VuZFBsYXllciA9IHNvdW5kcygpO1xuXG4gIC8vIExvYWQgc2NlbmUgaW1hZ2VzIGZvciBnYW1lIGxvZ1xuICBnYW1lTG9nLmxvYWRTY2VuZXMoKTtcblxuICAvLyBJbml0aWFsaXphdGlvbiBvZiBQbGF5ZXIgb2JqZWN0cyBmb3IgdXNlciBhbmQgQUlcbiAgY29uc3QgdXNlclBsYXllciA9IFBsYXllcihnbSk7IC8vIENyZWF0ZSBwbGF5ZXJzXG4gIGNvbnN0IGFpUGxheWVyID0gUGxheWVyKGdtKTtcbiAgdXNlclBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IGFpUGxheWVyLmdhbWVib2FyZDsgLy8gU2V0IHJpdmFsIGJvYXJkc1xuICBhaVBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IHVzZXJQbGF5ZXIuZ2FtZWJvYXJkO1xuICB1c2VyUGxheWVyLmdhbWVib2FyZC5pc0FpID0gZmFsc2U7IC8vIFNldCBhaSBvciBub3RcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLmlzQWkgPSB0cnVlO1xuXG4gIC8vIFNldCBnYW1lTG9nIHVzZXIgZ2FtZSBib2FyZCBmb3IgYWNjdXJhdGUgc2NlbmVzXG4gIGdhbWVMb2cuc2V0VXNlckdhbWVib2FyZCh1c2VyUGxheWVyLmdhbWVib2FyZCk7XG4gIC8vIEluaXQgZ2FtZSBsb2cgc2NlbmUgaW1nXG4gIGdhbWVMb2cuaW5pdFNjZW5lKCk7XG5cbiAgLy8gQWRkIHRoZSBjYW52YXMgb2JqZWN0cyBub3cgdGhhdCBnYW1lYm9hcmRzIGFyZSBjcmVhdGVkXG4gIGNvbnN0IGNhbnZhc2VzID0gY2FudmFzQWRkZXIoXG4gICAgdXNlclBsYXllci5nYW1lYm9hcmQsXG4gICAgYWlQbGF5ZXIuZ2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZSxcbiAgICBnbVxuICApO1xuICAvLyBBZGQgY2FudmFzZXMgdG8gZ2FtZWJvYXJkc1xuICB1c2VyUGxheWVyLmdhbWVib2FyZC5jYW52YXMgPSBjYW52YXNlcy51c2VyQ2FudmFzO1xuICBhaVBsYXllci5nYW1lYm9hcmQuY2FudmFzID0gY2FudmFzZXMuYWlDYW52YXM7XG5cbiAgLy8gQWRkIGJvYXJkcyBhbmQgY2FudmFzZXMgdG8gZ2FtZU1hbmFnZXJcbiAgZ20udXNlckJvYXJkID0gdXNlclBsYXllci5nYW1lYm9hcmQ7XG4gIGdtLmFpQm9hcmQgPSBhaVBsYXllci5nYW1lYm9hcmQ7XG4gIGdtLnVzZXJDYW52YXNDb250YWluZXIgPSBjYW52YXNlcy51c2VyQ2FudmFzO1xuICBnbS5haUNhbnZhc0NvbnRhaW5lciA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuICBnbS5wbGFjZW1lbnRDYW52YXNDb250YWluZXIgPSBjYW52YXNlcy5wbGFjZW1lbnRDYW52YXM7XG5cbiAgLy8gQWRkIG1vZHVsZXMgdG8gZ2FtZU1hbmFnZXJcbiAgZ20ud2ViSW50ZXJmYWNlID0gd2ViSW50ZXJmYWNlO1xuICBnbS5zb3VuZFBsYXllciA9IHNvdW5kUGxheWVyO1xuICBnbS5nYW1lTG9nID0gZ2FtZUxvZztcbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEFkZCBhaSBzaGlwc1xuICBwbGFjZUFpU2hpcHMoMSwgYWlQbGF5ZXIuZ2FtZWJvYXJkKTtcblxuICAvLyBIaWRlIHRoZSBsb2FkaW5nIHNjcmVlbiBhZnRlciBtaW4gdGltZW91dFxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBsb2FkaW5nU2NyZWVuLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH0sIDEwMDApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5pdGlhbGl6ZUdhbWU7XG4iLCIvKiBUaGlzIGhlbHBlciBtb2R1bGUgd2lsbCBwbGFjZSB0aGUgYWkgc2hpcHMgb24gdGhlIGFpIGdhbWVib2FyZC4gVGhleSBhcmUgY3VycmVudGx5XG4gIGFsd2F5cyBwbGFjZWQgcmFuZG9tbHksIGJ1dCB0aGUgZnJhbWV3b3JrIGV4aXN0cyBmb3IgY3JlYXRpbmcgZGlmZmVyZW50IHBsYWNlbWVudFxuICBtZXRob2RzIGJhc2VkIG9uIHRoZSBnYW1lTWFuYWdlcidzIGFpRGlmZmljdWx0eSBzZXR0aW5nLiAqL1xuXG5pbXBvcnQgcmFuZG9tU2hpcHMgZnJvbSBcIi4vcmFuZG9tU2hpcHNcIjtcblxuLy8gVGhpcyBoZWxwZXIgd2lsbCBhdHRlbXB0IHRvIGFkZCBzaGlwcyB0byB0aGUgYWkgZ2FtZWJvYXJkIGluIGEgdmFyaWV0eSBvZiB3YXlzIGZvciB2YXJ5aW5nIGRpZmZpY3VsdHlcbmNvbnN0IHBsYWNlQWlTaGlwcyA9IChwYXNzZWREaWZmLCBhaUdhbWVib2FyZCkgPT4ge1xuICAvLyBHcmlkIHNpemVcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcblxuICAvLyBQbGFjZSBhIHNoaXAgYWxvbmcgZWRnZXMgdW50aWwgb25lIHN1Y2Nlc3NmdWxseSBwbGFjZWQgP1xuICAvLyBQbGFjZSBhIHNoaXAgYmFzZWQgb24gcXVhZHJhbnQgP1xuXG4gIC8vIENvbWJpbmUgcGxhY2VtZW50IHRhY3RpY3MgdG8gY3JlYXRlIHZhcnlpbmcgZGlmZmljdWx0aWVzXG4gIGNvbnN0IHBsYWNlU2hpcHMgPSAoZGlmZmljdWx0eSkgPT4ge1xuICAgIC8vIFRvdGFsbHkgcmFuZG9tIHBhbGNlbWVudFxuICAgIGlmIChkaWZmaWN1bHR5ID09PSAxKSB7XG4gICAgICAvLyBQbGFjZSBzaGlwcyByYW5kb21seVxuICAgICAgcmFuZG9tU2hpcHMoYWlHYW1lYm9hcmQsIGdyaWRXaWR0aCwgZ3JpZEhlaWdodCk7XG4gICAgfVxuICB9O1xuXG4gIHBsYWNlU2hpcHMocGFzc2VkRGlmZik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwbGFjZUFpU2hpcHM7XG4iLCIvKiBUaGlzIGhlbHBlciBwbGFjZXMgc2hpcHMgcmFuZG9tbHkgb24gYSBnYW1lYm9hcmQgdW50aWwgYWxsIFxuNSBzaGlwcyBoYXZlIGJlZW4gcGxhY2VkLiBJdCB1c2VzIHJlY3Vyc2lvbiB0byBkbyB0aGlzLCBlbnN1cmluZ1xudGhlIG1ldGhvZCBpcyB0cmllZCBvdmVyIGFuZCBvdmVyIHVudGlsIGEgc3VmZmljaWVudCBib2FyZCBjb25maWd1cmF0aW9uXG5pcyByZXR1cm5lZC4gKi9cblxuY29uc3QgcmFuZG9tU2hpcHMgPSAoZ2FtZWJvYXJkLCBncmlkWCwgZ3JpZFkpID0+IHtcbiAgLy8gRXhpdCBmcm9tIHJlY3Vyc2lvblxuICBpZiAoZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCA+IDQpIHJldHVybjtcbiAgLy8gR2V0IHJhbmRvbSBwbGFjZW1lbnRcbiAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRYKTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRZKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcblxuICAvLyBUcnkgdGhlIHBsYWNlbWVudFxuICBnYW1lYm9hcmQuYWRkU2hpcChbeCwgeV0sIGRpcmVjdGlvbik7XG5cbiAgLy8gS2VlcCBkb2luZyBpdCB1bnRpbCBhbGwgc2hpcHMgYXJlIHBsYWNlZFxuICByYW5kb21TaGlwcyhnYW1lYm9hcmQsIGdyaWRYLCBncmlkWSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCByYW5kb21TaGlwcztcbiIsIi8qIFRoaXMgbW9kdWxlIGhhbmRsZXMgdXBkYXRpbmcgdGhlIGdhbWUgbG9nIHVpIGVsZW1lbnRzIHRvIGRpc3BsYXkgcmVsZXZhbnRcbiAgaW5mb3JtYXRpb24gc3VjaCBhcyBhdHRhY2tzIG1hZGUsIHNoaXBzIHN1bmssIGFuZCBwaWN0dXJlcyBvZiB2YXJpb3VzIHVuaXRzXG4gIGluIHZhcmlvdXMgc3RhdGVzLlxuICBcbiAgSXQgcmV0dXJucyB0aHJlZSBwcmltYXJpbHkgdXNlZCBtZXRob2RzLCBiZWluZyBlcmFzZSwgYXBwZW5kLCBhbmQgc2V0U2NlbmUuXG4gIFRoZSBmaXJzdCB0d28gYXJlIHNlbGYgb2J2aW91cy4gc2V0U2NlbmUgd2lsbCBjaGVjayB0aHJvdWdoIHRoZSBjdXJyZW50IGxvZyB0ZXh0LFxuICBsb29raW5nIGZvciBrZXl3b3JkcywgYW5kIHRoZW4gY2hvb3NlIGFuIGltYWdlIHRvIGRpc3BsYXkgaW4gdGhlIGxvZyBiYXNlZCBvblxuICBmb3VuZCBrZXl3b3Jkcy4gKi9cblxuaW1wb3J0IGltYWdlTG9hZGVyIGZyb20gXCIuLi9oZWxwZXJzL2ltYWdlTG9hZGVyXCI7XG5cbmNvbnN0IGdhbWVMb2cgPSAoKHVzZXJOYW1lID0gXCJVc2VyXCIpID0+IHtcbiAgLy8gRmxhZyBmb3IgdHVybmluZyBvZmYgc2NlbmUgdXBkYXRlc1xuICBsZXQgZG9VcGRhdGVTY2VuZSA9IHRydWU7XG4gIC8vIEZsYWcgZm9yIGxvY2tpbmcgdGhlIGxvZ1xuICBsZXQgZG9Mb2NrID0gZmFsc2U7XG5cbiAgLy8gQWRkIGEgcHJvcGVydHkgdG8gc3RvcmUgdGhlIGdhbWVib2FyZFxuICBsZXQgdXNlckdhbWVib2FyZCA9IG51bGw7XG5cbiAgLy8gU2V0dGVyIG1ldGhvZCB0byBzZXQgdGhlIGdhbWVib2FyZFxuICBjb25zdCBzZXRVc2VyR2FtZWJvYXJkID0gKGdhbWVib2FyZCkgPT4ge1xuICAgIHVzZXJHYW1lYm9hcmQgPSBnYW1lYm9hcmQ7XG4gIH07XG5cbiAgLy8gUmVmIHRvIGxvZyB0ZXh0XG4gIGNvbnN0IGxvZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZy10ZXh0XCIpO1xuICBjb25zdCBsb2dJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjZW5lLWltZ1wiKTtcblxuICAvLyBMb2cgc2NlbmUgaGFuZGxpbmdcbiAgbGV0IHNjZW5lSW1hZ2VzID0gbnVsbDtcbiAgLy8gTWV0aG9kIGZvciBsb2FkaW5nIHNjZW5lIGltYWdlcy4gTXVzdCBiZSBydW4gb25jZSBpbiBnYW1lIG1hbmFnZXIuXG4gIGNvbnN0IGxvYWRTY2VuZXMgPSAoKSA9PiB7XG4gICAgc2NlbmVJbWFnZXMgPSBpbWFnZUxvYWRlcigpO1xuICB9O1xuXG4gIC8vIEdldHMgYSByYW5kb20gYXJyYXkgZW50cnlcbiAgZnVuY3Rpb24gcmFuZG9tRW50cnkoYXJyYXkpIHtcbiAgICBjb25zdCBsYXN0SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChsYXN0SW5kZXggKyAxKSk7XG4gICAgcmV0dXJuIHJhbmRvbU51bWJlcjtcbiAgfVxuXG4gIC8vIEdldHMgYSByYW5kb20gdXNlciBzaGlwIHRoYXQgaXNuJ3QgZGVzdHJveWVkXG4gIGNvbnN0IGRpck5hbWVzID0geyAxOiBcIlNQXCIsIDI6IFwiQVRcIiwgMzogXCJWTVwiLCA0OiBcIklHXCIsIDU6IFwiTFwiIH07XG4gIGZ1bmN0aW9uIHJhbmRvbVNoaXBEaXIoZ2FtZWJvYXJkID0gdXNlckdhbWVib2FyZCkge1xuICAgIGNvbnN0IHJlbWFpbmluZ1NoaXBzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYW1lYm9hcmQuc2hpcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmICghZ2FtZWJvYXJkLnNoaXBzW2ldLmlzU3VuaygpKVxuICAgICAgICByZW1haW5pbmdTaGlwcy5wdXNoKGdhbWVib2FyZC5zaGlwc1tpXS5pbmRleCk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZW4gYWxsIHNoaXBzIGFyZSBzdW5rXG4gICAgaWYgKHJlbWFpbmluZ1NoaXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSk7XG4gICAgICByZXR1cm4gZGlyTmFtZXNbcmFuZG9tTnVtYmVyICsgMV07IC8vIGRpck5hbWVzIHN0YXJ0IGF0IGluZGV4IDFcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgcmV0dXJuIHJhbmRvbSByZW1haW5pbmcgc2hpcFxuICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbWFpbmluZ1NoaXBzLmxlbmd0aCk7XG4gICAgcmV0dXJuIGRpck5hbWVzW3JlbWFpbmluZ1NoaXBzW3JhbmRvbU51bWJlcl1dO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZXMgc2NlbmUgaW1hZ2UgdG8gZ2VuIGltYWdlXG4gIGNvbnN0IGluaXRTY2VuZSA9ICgpID0+IHtcbiAgICAvLyBnZXQgcmFuZG9tIHNoaXAgZGlyXG4gICAgY29uc3Qgc2hpcERpciA9IGRpck5hbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpICsgMV07XG4gICAgLy8gZ2V0IHJhbmRvbSBhcnJheSBlbnRyeVxuICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuKTtcbiAgICAvLyBzZXQgdGhlIGltYWdlXG4gICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbltlbnRyeV07XG4gIH07XG5cbiAgLy8gU2V0cyB0aGUgc2NlbmUgaW1hZ2UgYmFzZWQgb24gcGFyYW1zIHBhc3NlZFxuICBjb25zdCBzZXRTY2VuZSA9ICgpID0+IHtcbiAgICAvLyBSZXR1cm4gaWYgbG9nIGZsYWcgc2V0IHRvIG5vdCB1cGRhdGVcbiAgICBpZiAoIWRvVXBkYXRlU2NlbmUpIHJldHVybjtcbiAgICAvLyBTZXQgdGhlIHRleHQgdG8gbG93ZXJjYXNlIGZvciBjb21wYXJpc29uXG4gICAgY29uc3QgbG9nTG93ZXIgPSBsb2dUZXh0LnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBSZWZzIHRvIHNoaXAgdHlwZXMgYW5kIHRoZWlyIGRpcnNcbiAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJzZW50aW5lbFwiLCBcImFzc2F1bHRcIiwgXCJ2aXBlclwiLCBcImlyb25cIiwgXCJsZXZpYXRoYW5cIl07XG4gICAgY29uc3QgdHlwZVRvRGlyID0ge1xuICAgICAgc2VudGluZWw6IFwiU1BcIixcbiAgICAgIGFzc2F1bHQ6IFwiQVRcIixcbiAgICAgIHZpcGVyOiBcIlZNXCIsXG4gICAgICBpcm9uOiBcIklHXCIsXG4gICAgICBsZXZpYXRoYW46IFwiTFwiLFxuICAgIH07XG5cbiAgICAvLyBIZWxwZXIgZm9yIGdldHRpbmcgcmFuZG9tIHNoaXAgdHlwZSBmcm9tIHRob3NlIHJlbWFpbmluZ1xuXG4gICAgLy8gU2V0IHRoZSBpbWFnZSB3aGVuIHlvdSBhdHRhY2sgYmFzZWQgb24gcmVtYWluaW5nIHNoaXBzXG4gICAgaWYgKFxuICAgICAgbG9nTG93ZXIuaW5jbHVkZXModXNlck5hbWUudG9Mb3dlckNhc2UoKSkgJiZcbiAgICAgIGxvZ0xvd2VyLmluY2x1ZGVzKFwiYXR0YWNrc1wiKVxuICAgICkge1xuICAgICAgLy8gR2V0IHJhbmRvbSBzaGlwXG4gICAgICBjb25zdCBzaGlwRGlyID0gcmFuZG9tU2hpcERpcigpO1xuICAgICAgLy8gR2V0IHJhbmRvbSBpbWcgZnJvbSBhcHByb3ByaWF0ZSBwbGFjZVxuICAgICAgY29uc3QgZW50cnkgPSByYW5kb21FbnRyeShzY2VuZUltYWdlc1tzaGlwRGlyXS5hdHRhY2spO1xuICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmF0dGFja1tlbnRyeV07XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBpbWFnZSB3aGVuIHNoaXAgaGl0XG4gICAgaWYgKGxvZ0xvd2VyLmluY2x1ZGVzKFwiaGl0IHlvdXJcIikpIHtcbiAgICAgIHNoaXBUeXBlcy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIGlmIChsb2dMb3dlci5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgICAgIC8vIFNldCB0aGUgc2hpcCBkaXJlY3RvcnkgYmFzZWQgb24gdHlwZVxuICAgICAgICAgIGNvbnN0IHNoaXBEaXIgPSB0eXBlVG9EaXJbdHlwZV07XG4gICAgICAgICAgLy8gR2V0IGEgcmFuZG9tIGhpdCBlbnRyeVxuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uaGl0KTtcbiAgICAgICAgICAvLyBTZXQgdGhlIGltYWdlXG4gICAgICAgICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmhpdFtlbnRyeV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiB0aGVyZSBpcyBhbiBhaSBtaXNzIHRvIGdlbiBvZiByZW1haW5pbmcgc2hpcHNcbiAgICBpZiAobG9nTG93ZXIuaW5jbHVkZXMoXCJhaSBhdHRhY2tzXCIpICYmIGxvZ0xvd2VyLmluY2x1ZGVzKFwibWlzc2VkXCIpKSB7XG4gICAgICAvLyBHZXQgcmFuZG9tIHJlbWFpbmluZyBzaGlwIGRpclxuICAgICAgY29uc3Qgc2hpcERpciA9IHJhbmRvbVNoaXBEaXIoKTtcbiAgICAgIC8vIEdldCByYW5kb20gZW50cnkgZnJvbSB0aGVyZVxuICAgICAgY29uc3QgZW50cnkgPSByYW5kb21FbnRyeShzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW4pO1xuICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbltlbnRyeV07XG4gICAgfVxuICB9O1xuXG4gIC8vIEVyYXNlIHRoZSBsb2cgdGV4dFxuICBjb25zdCBlcmFzZSA9ICgpID0+IHtcbiAgICBpZiAoZG9Mb2NrKSByZXR1cm47XG4gICAgbG9nVGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gIH07XG5cbiAgLy8gQWRkIHRvIGxvZyB0ZXh0XG4gIGNvbnN0IGFwcGVuZCA9IChzdHJpbmdUb0FwcGVuZCkgPT4ge1xuICAgIGlmIChkb0xvY2spIHJldHVybjtcbiAgICBpZiAoc3RyaW5nVG9BcHBlbmQpIHtcbiAgICAgIGxvZ1RleHQuaW5uZXJIVE1MICs9IGBcXG4ke3N0cmluZ1RvQXBwZW5kLnRvU3RyaW5nKCl9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBlcmFzZSxcbiAgICBhcHBlbmQsXG4gICAgc2V0U2NlbmUsXG4gICAgbG9hZFNjZW5lcyxcbiAgICBzZXRVc2VyR2FtZWJvYXJkLFxuICAgIGluaXRTY2VuZSxcbiAgICBnZXQgZG9VcGRhdGVTY2VuZSgpIHtcbiAgICAgIHJldHVybiBkb1VwZGF0ZVNjZW5lO1xuICAgIH0sXG4gICAgc2V0IGRvVXBkYXRlU2NlbmUoYm9vbCkge1xuICAgICAgaWYgKGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZG9VcGRhdGVTY2VuZSA9IGJvb2w7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQgZG9Mb2NrKCkge1xuICAgICAgcmV0dXJuIGRvTG9jaztcbiAgICB9LFxuICAgIHNldCBkb0xvY2soYm9vbCkge1xuICAgICAgaWYgKGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZG9Mb2NrID0gYm9vbDtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvZztcbiIsIi8qIFRoaXMgbW9kdWxlIGFjdHMgYXMgdGhlIGNlbnRyYWwgY29tbXVuaWNhdGlvbnMgaHViIGZvciBhbGwgdGhlIGRpZmZlcmVudCBtb2R1bGVzLlxuICBJdCBoYXMgbWV0aG9kcyBmb3IgcmVzcG9uZGluZyB0byB2YXJpb3VzIGdhbWUgZXZlbnRzLCBhcyB3ZWxsIGFzIHJlZnMgdG8gZ2FtZSBzZXR0aW5ncyxcbiAgZ2FtZSBvYmplY3RzLCBhbmQgdGhlIG90aGVyIG1haW4gbW9kdWxlcy5cbiAgXG4gIElmIHNvbWV0aGluZyBuZWVkcyB0byBoYXBwZW4gdGhhdCBpbnZvbHZlcyB2YXJpb3VzIHVuLXJlbGF0ZWQgcGFydHMgb2YgdGhlIGNvZGViYXNlIFxuICB3b3JraW5nIHRvZ2V0aGVyIHRoZW4gaXQgd2lsbCBiZSBoYW5kbGVkIGJ5IHRoaXMgbW9kdWxlLiAqL1xuXG5pbXBvcnQgcmFuZG9tU2hpcHMgZnJvbSBcIi4uL2hlbHBlcnMvcmFuZG9tU2hpcHNcIjtcblxuY29uc3QgZ2FtZU1hbmFnZXIgPSAoKSA9PiB7XG4gIC8vIEdhbWUgc2V0dGluZ3NcbiAgbGV0IGFpRGlmZmljdWx0eSA9IDI7XG4gIGNvbnN0IHVzZXJBdHRhY2tEZWxheSA9IDEwMDA7XG4gIGNvbnN0IGFpQXR0YWNrRGVsYXkgPSAyMjAwO1xuICBjb25zdCBhaUF1dG9EZWxheSA9IDI1MDtcblxuICAvLyBSZWZzIHRvIHJlbGV2YW50IGdhbWUgb2JqZWN0c1xuICBsZXQgdXNlckJvYXJkID0gbnVsbDtcbiAgbGV0IGFpQm9hcmQgPSBudWxsO1xuICBsZXQgdXNlckNhbnZhc0NvbnRhaW5lciA9IG51bGw7XG4gIGxldCBhaUNhbnZhc0NvbnRhaW5lciA9IG51bGw7XG4gIGxldCBwbGFjZW1lbnRDYW52YXNDb250YWluZXIgPSBudWxsO1xuXG4gIC8vIFJlZnMgdG8gbW9kdWxlc1xuICBsZXQgc291bmRQbGF5ZXIgPSBudWxsO1xuICBsZXQgd2ViSW50ZXJmYWNlID0gbnVsbDtcbiAgbGV0IGdhbWVMb2cgPSBudWxsO1xuXG4gIC8vICNyZWdpb24gSGFuZGxlIEFJIEF0dGFja3NcbiAgLy8gQUkgQXR0YWNrIEhpdFxuICBjb25zdCBhaUF0dGFja0hpdCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAvLyBQbGF5IGhpdCBzb3VuZFxuICAgIHNvdW5kUGxheWVyLnBsYXlIaXQoKTtcbiAgICAvLyBEcmF3IHRoZSBoaXQgdG8gYm9hcmRcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAvLyBMb2cgdGhlIGhpdFxuICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgIGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfSBcXG5BdHRhY2sgaGl0IHlvdXIgJHt1c2VyQm9hcmQuaGl0U2hpcFR5cGV9IWBcbiAgICApO1xuICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgICAvLyBTZXQgYWkgdG8gZGVzdHJveSBtb2RlXG4gICAgYWlCb2FyZC5pc0FpU2Vla2luZyA9IGZhbHNlO1xuICAgIC8vIEFkZCBoaXQgdG8gY2VsbHMgdG8gY2hlY2tcbiAgICBhaUJvYXJkLmNlbGxzVG9DaGVjay5wdXNoKGF0dGFja0Nvb3Jkcyk7XG4gICAgLy8gTG9nIHN1bmsgdXNlciBzaGlwc1xuICAgIGNvbnN0IHN1bmtNc2cgPSB1c2VyQm9hcmQubG9nU3VuaygpO1xuICAgIGlmIChzdW5rTXNnICE9PSBudWxsKSB7XG4gICAgICBnYW1lTG9nLmFwcGVuZChzdW5rTXNnKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2cgc2NlbmVcbiAgICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgQUkgd29uXG4gICAgaWYgKHVzZXJCb2FyZC5hbGxTdW5rKCkpIHtcbiAgICAgIC8vICcgICAgICAgICdcbiAgICAgIC8vIExvZyByZXN1bHRzXG4gICAgICBnYW1lTG9nLmFwcGVuZChcIkFsbCBVc2VyIHVuaXRzIGRlc3Ryb3llZC4gXFxuQUkgZG9taW5hbmNlIGlzIGFzc3VyZWQuXCIpO1xuICAgICAgLy8gU2V0IGdhbWUgb3ZlciBvbiBib2FyZHNcbiAgICAgIGFpQm9hcmQuZ2FtZU92ZXIgPSB0cnVlOyAvLyBBSSBib2FyZFxuICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTsgLy8gVXNlciBib2FyZFxuICAgIH1cbiAgfTtcblxuICAvLyBBSSBBdHRhY2sgTWlzc2VkXG4gIGNvbnN0IGFpQXR0YWNrTWlzc2VkID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFBsYXkgc291bmRcbiAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgIC8vIERyYXcgdGhlIG1pc3MgdG8gYm9hcmRcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdNaXNzKGF0dGFja0Nvb3Jkcyk7XG4gICAgLy8gTG9nIHRoZSBtaXNzXG4gICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgIGdhbWVMb2cuYXBwZW5kKGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfVxcbkF0dGFjayBtaXNzZWQhYCk7XG4gICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICB9O1xuXG4gIC8vIEFJIGlzIGF0dGFja2luZ1xuICBsZXQgYWlBdHRhY2tDb3VudCA9IDA7XG4gIGNvbnN0IGFpQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcywgZGVsYXkgPSBhaUF0dGFja0RlbGF5KSA9PiB7XG4gICAgLy8gVGltZW91dCB0byBzaW11bGF0ZSBcInRoaW5raW5nXCIgYW5kIHRvIG1ha2UgZ2FtZSBmZWVsIGJldHRlclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gU2VuZCBhdHRhY2sgdG8gcml2YWwgYm9hcmRcbiAgICAgIHVzZXJCb2FyZFxuICAgICAgICAucmVjZWl2ZUF0dGFjayhhdHRhY2tDb29yZHMpXG4gICAgICAgIC8vIFRoZW4gZHJhdyBoaXRzIG9yIG1pc3Nlc1xuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYWlBdHRhY2tIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrTWlzc2VkKGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQnJlYWsgb3V0IG9mIHJlY3Vyc2lvbiBpZiBnYW1lIGlzIG92ZXJcbiAgICAgICAgICBpZiAodXNlckJvYXJkLmdhbWVPdmVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyBMb2cgdG90YWwgaGl0cyBpZiBhaSBhdXRvIGF0dGFja2luZ1xuICAgICAgICAgICAgaWYgKGFpQm9hcmQuaXNBdXRvQXR0YWNraW5nKSB7XG4gICAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKGBUb3RhbCBBSSBhdHRhY2tzOiAke2FpQXR0YWNrQ291bnR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnYW1lTG9nLmRvTG9jayA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgYWkgYm9hcmQgaXMgYXV0b2F0dGFja2luZyBoYXZlIGl0IHRyeSBhbiBhdHRhY2tcbiAgICAgICAgICBpZiAoYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrQ291bnQgKz0gMTtcbiAgICAgICAgICAgIGFpQm9hcmQudHJ5QWlBdHRhY2soYWlBdXRvRGVsYXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWxsb3cgdGhlIHVzZXIgdG8gYXR0YWNrIGFnYWluXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgUGxheWVyIEF0dGFja3NcbiAgY29uc3QgcGxheWVyQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFJldHVybiBpZiBnYW1lYm9hcmQgY2FuJ3QgYXR0YWNrXG4gICAgaWYgKGFpQm9hcmQucml2YWxCb2FyZC5jYW5BdHRhY2sgPT09IGZhbHNlKSByZXR1cm47XG4gICAgLy8gVHJ5IGF0dGFjayBhdCBjdXJyZW50IGNlbGxcbiAgICBpZiAoYWlCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgLy8gQmFkIHRoaW5nLiBFcnJvciBzb3VuZCBtYXliZS5cbiAgICB9IGVsc2UgaWYgKHVzZXJCb2FyZC5nYW1lT3ZlciA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIFNldCBnYW1lYm9hcmQgdG8gbm90IGJlIGFibGUgdG8gYXR0YWNrXG4gICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gZmFsc2U7XG4gICAgICAvLyBMb2cgdGhlIHNlbnQgYXR0YWNrXG4gICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICBnYW1lTG9nLmFwcGVuZChgVXNlciBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfWApO1xuICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgICAgLy8gUGxheSB0aGUgc291bmRcbiAgICAgIHNvdW5kUGxheWVyLnBsYXlBdHRhY2soKTtcbiAgICAgIC8vIFNlbmQgdGhlIGF0dGFja1xuICAgICAgYWlCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkcykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIFNldCBhIHRpbWVvdXQgZm9yIGRyYW1hdGljIGVmZmVjdFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBBdHRhY2sgaGl0XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gUGxheSBzb3VuZFxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheUhpdCgpO1xuICAgICAgICAgICAgLy8gRHJhdyBoaXQgdG8gYm9hcmRcbiAgICAgICAgICAgIGFpQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAgIC8vIExvZyBoaXRcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIGhpdCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgc3Vua2VuIHNoaXBzXG4gICAgICAgICAgICBjb25zdCBzdW5rTXNnID0gYWlCb2FyZC5sb2dTdW5rKCk7XG4gICAgICAgICAgICBpZiAoc3Vua01zZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChzdW5rTXNnKTtcbiAgICAgICAgICAgICAgLy8gVXBkYXRlIGxvZyBzY2VuZVxuICAgICAgICAgICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHBsYXllciB3b25cbiAgICAgICAgICAgIGlmIChhaUJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgICAgICAgICAgICBcIkFsbCBBSSB1bml0cyBkZXN0cm95ZWQuIFxcbkh1bWFuaXR5IHN1cnZpdmVzIGFub3RoZXIgZGF5Li4uXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgLy8gU2V0IGdhbWVvdmVyIG9uIGJvYXJkc1xuICAgICAgICAgICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBSSBkZXRybWluaW5nIGF0dGFjay4uLlwiKTtcbiAgICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgICBhaUJvYXJkLnRyeUFpQXR0YWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBQbGF5IHNvdW5kXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgICAgICAgICAgLy8gRHJhdyBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgICBhaUNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgICAgICAgICAgLy8gTG9nIG1pc3NcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIG1pc3NlZCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgYWlCb2FyZC50cnlBaUF0dGFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdXNlckF0dGFja0RlbGF5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gSGFuZGxlIHNldHRpbmcgdXAgYW4gQUkgdnMgQUkgbWF0Y2hcbiAgY29uc3QgYWlNYXRjaENsaWNrZWQgPSAoKSA9PiB7XG4gICAgLy8gVG9nZ2xlIGFpIGF1dG8gYXR0YWNrXG4gICAgYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmcgPSAhYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmc7XG4gICAgLy8gVG9nZ2xlIGxvZyB0byBub3QgdXBkYXRlIHNjZW5lXG4gICAgZ2FtZUxvZy5kb1VwZGF0ZVNjZW5lID0gIWdhbWVMb2cuZG9VcGRhdGVTY2VuZTtcbiAgICAvLyBTZXQgdGhlIHNvdW5kcyB0byBtdXRlZFxuICAgIHNvdW5kUGxheWVyLmlzTXV0ZWQgPSAhc291bmRQbGF5ZXIuaXNNdXRlZDtcbiAgfTtcblxuICAvLyAjcmVnaW9uIEhhbmRsZSBTaGlwIFBsYWNlbWVudCBhbmQgR2FtZSBTdGFydFxuICAvLyBDaGVjayBpZiBnYW1lIHNob3VsZCBzdGFydCBhZnRlciBwbGFjZW1lbnRcbiAgY29uc3QgdHJ5U3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGlmICh1c2VyQm9hcmQuc2hpcHMubGVuZ3RoID09PSA1KSB7XG4gICAgICB3ZWJJbnRlcmZhY2Uuc2hvd0dhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJhbmRvbSBzaGlwcyBidXR0b24gY2xpY2tcbiAgY29uc3QgcmFuZG9tU2hpcHNDbGlja2VkID0gKCkgPT4ge1xuICAgIHJhbmRvbVNoaXBzKHVzZXJCb2FyZCwgdXNlckJvYXJkLm1heEJvYXJkWCwgdXNlckJvYXJkLm1heEJvYXJkWSk7XG4gICAgdXNlckNhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMoKTtcbiAgICB0cnlTdGFydEdhbWUoKTtcbiAgfTtcblxuICAvLyBIYW5kbGUgcm90YXRlIGJ1dHRvbiBjbGlja3NcbiAgY29uc3Qgcm90YXRlQ2xpY2tlZCA9ICgpID0+IHtcbiAgICB1c2VyQm9hcmQuZGlyZWN0aW9uID0gdXNlckJvYXJkLmRpcmVjdGlvbiA9PT0gMCA/IDEgOiAwO1xuICAgIGFpQm9hcmQuZGlyZWN0aW9uID0gYWlCb2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgfTtcblxuICBjb25zdCBwbGFjZW1lbnRDbGlja2VkID0gKGNlbGwpID0+IHtcbiAgICAvLyBUcnkgcGxhY2VtZW50XG4gICAgdXNlckJvYXJkLmFkZFNoaXAoY2VsbCk7XG4gICAgLy8gVXBkYXRlIHRoZSBjYW52YXNlc1xuICAgIHBsYWNlbWVudENhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMoKTtcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdTaGlwcygpO1xuICAgIC8vIFVwZGF0ZSBwbGFjZW1lbnQgaWNvbnMgYW5kIHRleHRcbiAgICBpZiAodXNlckJvYXJkLnNoaXBzLmxlbmd0aCA8IDUpIHtcbiAgICAgIHdlYkludGVyZmFjZS51cGRhdGVQbGFjZW1lbnRJY29ucyh1c2VyQm9hcmQuc2hpcHMubGVuZ3RoKTtcbiAgICAgIHdlYkludGVyZmFjZS51cGRhdGVQbGFjZW1lbnROYW1lKHVzZXJCb2FyZC5zaGlwcy5sZW5ndGgpO1xuICAgIH1cbiAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGdhbWVcbiAgICB0cnlTdGFydEdhbWUoKTtcbiAgfTtcbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIFdoZW4gYSB1c2VyIHNoaXAgaXMgc3Vua1xuICBjb25zdCB1c2VyU2hpcFN1bmsgPSAoc2hpcCkgPT4ge1xuICAgIC8vIFJlbW92ZSB0aGUgc3Vua2VuIHNoaXAgY2VsbHMgZnJvbSBjZWxscyB0byBjaGVja1xuICAgIHNoaXAub2NjdXBpZWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAvLyBPY2N1cGllZCBjZWxsIHggYW5kIHlcbiAgICAgIGNvbnN0IFtveCwgb3ldID0gY2VsbDtcbiAgICAgIC8vIFJlbW92ZSBpdCBmcm9tIGNlbGxzIHRvIGNoZWNrIGlmIGl0IGV4aXN0c1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhaUJvYXJkLmNlbGxzVG9DaGVjay5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAvLyBDZWxsIHRvIGNoZWNrIHggYW5kIHlcbiAgICAgICAgY29uc3QgW2N4LCBjeV0gPSBhaUJvYXJkLmNlbGxzVG9DaGVja1tpXTtcbiAgICAgICAgLy8gUmVtb3ZlIGlmIG1hdGNoIGZvdW5kXG4gICAgICAgIGlmIChveCA9PT0gY3ggJiYgb3kgPT09IGN5KSB7XG4gICAgICAgICAgYWlCb2FyZC5jZWxsc1RvQ2hlY2suc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBJZiBjZWxscyB0byBjaGVjayBpcyBlbXB0eSB0aGVuIHN0b3AgZGVzdG9yeSBtb2RlXG4gICAgaWYgKGFpQm9hcmQuY2VsbHNUb0NoZWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWlCb2FyZC5pc0FpU2Vla2luZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBzdW5rIGljb24gdG8gaW5hY3RpdmVcbiAgICB3ZWJJbnRlcmZhY2UudXBkYXRlSW5mb0ljb25zKHNoaXAuaW5kZXggLSAxLCB0cnVlKTsgLy8gLTEgYmMgU2hpcHMgYXJlIGluZGV4ZWQgYXQgMSBub3QgMFxuICB9O1xuXG4gIGNvbnN0IGFpU2hpcFN1bmsgPSAoc2hpcCkgPT4ge1xuICAgIC8vIFNldCB0aGUgc3VuayBpY29uIHRvIGluYWN0aXZlXG4gICAgd2ViSW50ZXJmYWNlLnVwZGF0ZUluZm9JY29ucyhzaGlwLmluZGV4IC0gMSwgZmFsc2UpOyAvLyAtMSBiYyBTaGlwcyBhcmUgaW5kZXhlZCBhdCAxIG5vdCAwXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhaUF0dGFja2luZyxcbiAgICBwbGF5ZXJBdHRhY2tpbmcsXG4gICAgYWlNYXRjaENsaWNrZWQsXG4gICAgcGxhY2VtZW50Q2xpY2tlZCxcbiAgICByYW5kb21TaGlwc0NsaWNrZWQsXG4gICAgcm90YXRlQ2xpY2tlZCxcbiAgICB1c2VyU2hpcFN1bmssXG4gICAgYWlTaGlwU3VuayxcbiAgICBnZXQgYWlEaWZmaWN1bHR5KCkge1xuICAgICAgcmV0dXJuIGFpRGlmZmljdWx0eTtcbiAgICB9LFxuICAgIHNldCBhaURpZmZpY3VsdHkoZGlmZikge1xuICAgICAgaWYgKGRpZmYgPT09IDEgfHwgZGlmZiA9PT0gMiB8fCBkaWZmID09PSAzKSBhaURpZmZpY3VsdHkgPSBkaWZmO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJCb2FyZCgpIHtcbiAgICAgIHJldHVybiB1c2VyQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgdXNlckJvYXJkKGJvYXJkKSB7XG4gICAgICB1c2VyQm9hcmQgPSBib2FyZDtcbiAgICB9LFxuICAgIGdldCBhaUJvYXJkKCkge1xuICAgICAgcmV0dXJuIGFpQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgYWlCb2FyZChib2FyZCkge1xuICAgICAgYWlCb2FyZCA9IGJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJDYW52YXNDb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gdXNlckNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCB1c2VyQ2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgdXNlckNhbnZhc0NvbnRhaW5lciA9IGNhbnZhcztcbiAgICB9LFxuICAgIGdldCBhaUNhbnZhc0NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBhaUNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCBhaUNhbnZhc0NvbnRhaW5lcihjYW52YXMpIHtcbiAgICAgIGFpQ2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHBsYWNlbWVudENhbnZhc2NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBwbGFjZW1lbnRDYW52YXNDb250YWluZXI7XG4gICAgfSxcbiAgICBzZXQgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHNvdW5kUGxheWVyKCkge1xuICAgICAgcmV0dXJuIHNvdW5kUGxheWVyO1xuICAgIH0sXG4gICAgc2V0IHNvdW5kUGxheWVyKGFNb2R1bGUpIHtcbiAgICAgIHNvdW5kUGxheWVyID0gYU1vZHVsZTtcbiAgICB9LFxuICAgIGdldCB3ZWJJbnRlcmZhY2UoKSB7XG4gICAgICByZXR1cm4gd2ViSW50ZXJmYWNlO1xuICAgIH0sXG4gICAgc2V0IHdlYkludGVyZmFjZShhTW9kdWxlKSB7XG4gICAgICB3ZWJJbnRlcmZhY2UgPSBhTW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGdhbWVMb2coKSB7XG4gICAgICByZXR1cm4gZ2FtZUxvZztcbiAgICB9LFxuICAgIHNldCBnYW1lTG9nKGFNb2R1bGUpIHtcbiAgICAgIGdhbWVMb2cgPSBhTW9kdWxlO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTWFuYWdlcjtcbiIsIi8qIFRoaXMgbW9kdWxlIGlzIHVzZWQgdG8gcGxheSB0aGUgZ2FtZXMgc291bmQgZWZmZWN0cy4gQXMgdGhlcmUgYXJlXG5ub3QgbWFueSBzb3VuZHMgaW4gdG90YWwsIGVhY2ggc291bmQgZ2V0cyBpdHMgb3duIG1ldGhvZCBmb3IgcGxheWluZy4gKi9cblxuaW1wb3J0IGhpdFNvdW5kIGZyb20gXCIuLi9Tb3VuZCBFZmZlY3RzL2V4cGxvc2lvbi5tcDNcIjtcbmltcG9ydCBtaXNzU291bmQgZnJvbSBcIi4uL1NvdW5kIEVmZmVjdHMvbWlzcy5tcDNcIjtcbmltcG9ydCBhdHRhY2tTb3VuZCBmcm9tIFwiLi4vU291bmQgRWZmZWN0cy9sYXNlci5tcDNcIjtcblxuY29uc3QgYXR0YWNrQXVkaW8gPSBuZXcgQXVkaW8oYXR0YWNrU291bmQpO1xuY29uc3QgaGl0QXVkaW8gPSBuZXcgQXVkaW8oaGl0U291bmQpO1xuY29uc3QgbWlzc0F1ZGlvID0gbmV3IEF1ZGlvKG1pc3NTb3VuZCk7XG5cbmNvbnN0IHNvdW5kcyA9ICgpID0+IHtcbiAgLy8gRmxhZyBmb3IgbXV0aW5nXG4gIGxldCBpc011dGVkID0gZmFsc2U7XG5cbiAgY29uc3QgcGxheUhpdCA9ICgpID0+IHtcbiAgICBpZiAoaXNNdXRlZCkgcmV0dXJuO1xuICAgIC8vIFJlc2V0IGF1ZGlvIHRvIGJlZ2lubmluZyBhbmQgcGxheSBpdFxuICAgIGhpdEF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICBoaXRBdWRpby5wbGF5KCk7XG4gIH07XG5cbiAgY29uc3QgcGxheU1pc3MgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBtaXNzQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgIG1pc3NBdWRpby5wbGF5KCk7XG4gIH07XG5cbiAgY29uc3QgcGxheUF0dGFjayA9ICgpID0+IHtcbiAgICBpZiAoaXNNdXRlZCkgcmV0dXJuO1xuICAgIC8vIFJlc2V0IGF1ZGlvIHRvIGJlZ2lubmluZyBhbmQgcGxheSBpdFxuICAgIGF0dGFja0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICBhdHRhY2tBdWRpby5wbGF5KCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGF5SGl0LFxuICAgIHBsYXlNaXNzLFxuICAgIHBsYXlBdHRhY2ssXG4gICAgZ2V0IGlzTXV0ZWQoKSB7XG4gICAgICByZXR1cm4gaXNNdXRlZDtcbiAgICB9LFxuICAgIHNldCBpc011dGVkKGJvb2wpIHtcbiAgICAgIGlmIChib29sID09PSB0cnVlIHx8IGJvb2wgPT09IGZhbHNlKSBpc011dGVkID0gYm9vbDtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc291bmRzO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbi8qIFRoaXMgbW9kdWxlIGlzIHJlc3BvbnNpYmxlIGZvciBzZXR0aW5nIHVwIGV2ZW50IGhhbmRsZXJzIGZvciB0aGVcbiAgbWFpbiBVSSBidXR0b25zLCBhbmQgaGFzIG1ldGhvZHMgdXNlZCBieSB0aG9zZSBoYW5kbGVycyB0aGF0IGNoYW5nZVxuICB0aGUgc3RhdGUgb2YgdGhlIFVJIGJ5IGNoYW5naW5nIHZhcmlvdXMgZWxlbWVudCBjbGFzc2VzLlxuICBcbiAgVGhpcyBhbGxvd3MgZm9yIG1ldGhvZHMgdGhhdCB0cmFuc2l0aW9uIGZyb20gb25lIHBhcnQgb2YgdGhlIGdhbWUgdG8gdGhlIG5leHQuICovXG5jb25zdCB3ZWJJbnRlcmZhY2UgPSAoZ20pID0+IHtcbiAgLy8gUmVmZXJlbmNlcyB0byBtYWluIGVsZW1lbnRzXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aXRsZVwiKTtcbiAgY29uc3QgbWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudVwiKTtcbiAgY29uc3QgcGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnRcIik7XG4gIGNvbnN0IGdhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XG4gIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXNldFwiKTtcblxuICAvLyBSZWZlcmVuY2VzIHRvIGJ0biBlbGVtZW50c1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnQtYnRuXCIpO1xuICBjb25zdCBhaU1hdGNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1tYXRjaC1idG5cIik7XG5cbiAgY29uc3QgcmFuZG9tU2hpcHNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJhbmRvbS1zaGlwcy1idG5cIik7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ0blwiKTtcblxuICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzZXQtYnRuXCIpO1xuXG4gIC8vIFJlZmVyZW5jZXMgdG8gc2hpcCBpbmZvIGljb25zIGFuZCB0ZXh0XG4gIGNvbnN0IHBsYWNlbWVudEljb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zaGlwcy10by1wbGFjZSAuaWNvblwiKTtcbiAgY29uc3QgcGxhY2VtZW50U2hpcE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLnNoaXBzLXRvLXBsYWNlIC5zaGlwLW5hbWUtdGV4dFwiXG4gICk7XG5cbiAgY29uc3QgdXNlckljb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi51c2VyLWluZm8gLmljb25cIik7XG4gIGNvbnN0IGFpSWNvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFpLWluZm8gLmljb25cIik7XG5cbiAgLy8gTWV0aG9kIGZvciBpdGVyYXRpbmcgdGhyb3VnaCBkaXJlY3Rpb25zXG4gIGNvbnN0IHJvdGF0ZURpcmVjdGlvbiA9ICgpID0+IHtcbiAgICBnbS5yb3RhdGVDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBBZGQvcmVtb3ZlIGNsYXNzZXMgdG8gc2hpcCBkaXZzIHRvIHJlcHJlc2VudCBwbGFjZWQvZGVzdHJveWVkXG4gIC8vIEluZGljYXRlIHdoYXQgc2hpcCBpcyBiZWluZyBwbGFjZWQgYnkgdGhlIHVzZXJcbiAgY29uc3QgdXBkYXRlUGxhY2VtZW50TmFtZSA9IChzaGlwVG9QbGFjZU51bSkgPT4ge1xuICAgIGxldCBzaGlwTmFtZSA9IG51bGw7XG4gICAgc3dpdGNoIChzaGlwVG9QbGFjZU51bSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBzaGlwTmFtZSA9IFwiU2VudGluZWwgUHJvYmVcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNoaXBOYW1lID0gXCJBc3NhdWx0IFRpdGFuXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzaGlwTmFtZSA9IFwiVmlwZXIgTWVjaFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgc2hpcE5hbWUgPSBcIklyb24gR29saWF0aFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgc2hpcE5hbWUgPSBcIkxldmlhdGhhblwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHNoaXBOYW1lID0gXCJTaGlwIE5hbWVcIjtcbiAgICB9XG5cbiAgICBwbGFjZW1lbnRTaGlwTmFtZS50ZXh0Q29udGVudCA9IHNoaXBOYW1lO1xuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVBsYWNlbWVudEljb25zID0gKHNoaXBUb1BsYWNlTnVtKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGFjZW1lbnRJY29ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgLy8gSWYgdGhlIGluZGV4ID0gc2hpcCB0byBwbGFjZSBudW0gdGhlbiBoaWdobGlnaHQgdGhhdCBpY29uIGJ5IHJlbW92aW5nIGNsYXNzXG4gICAgICBpZiAoc2hpcFRvUGxhY2VOdW0gPT09IGkpIHtcbiAgICAgICAgcGxhY2VtZW50SWNvbnNbaV0uY2xhc3NMaXN0LnJlbW92ZShcImluYWN0aXZlXCIpO1xuICAgICAgfVxuICAgICAgLy8gRWxzZSBpdCBpcyBub3QgdGhlIGFjdGl2ZSBzaGlwIGljb24gc28gbWFrZSBpdCBpbmFjdGl2ZVxuICAgICAgZWxzZSB7XG4gICAgICAgIHBsYWNlbWVudEljb25zW2ldLmNsYXNzTGlzdC5hZGQoXCJpbmFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlSW5mb0ljb25zID0gKHNoaXBUaGF0U3Vua051bSwgZm9yVXNlciA9IHRydWUpID0+IHtcbiAgICBpZiAoZm9yVXNlcikge1xuICAgICAgdXNlckljb25zW3NoaXBUaGF0U3Vua051bV0uY2xhc3NMaXN0LmFkZChcImluYWN0aXZlXCIpO1xuICAgIH0gZWxzZSBpZiAoIWZvclVzZXIpIHtcbiAgICAgIGFpSWNvbnNbc2hpcFRoYXRTdW5rTnVtXS5jbGFzc0xpc3QuYWRkKFwiaW5hY3RpdmVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEJhc2ljIG1ldGhvZHMgZm9yIHNob3dpbmcvaGlkaW5nIGVsZW1lbnRzXG4gIC8vIE1vdmUgYW55IGFjdGl2ZSBzZWN0aW9ucyBvZmYgdGhlIHNjcmVlblxuICBjb25zdCBoaWRlQWxsID0gKCkgPT4ge1xuICAgIG1lbnUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgcmVzZXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBtZW51IFVJXG4gIGNvbnN0IHNob3dNZW51ID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBtZW51LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hvdyB0aGUgc2hpcCBwbGFjZW1lbnQgVUlcbiAgY29uc3Qgc2hvd1BsYWNlbWVudCA9ICgpID0+IHtcbiAgICBoaWRlQWxsKCk7XG4gICAgcGxhY2VtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgLy8gVXBkYXRlIGljb25zIGFuZCB0ZXh0IHRvIGZpcnN0IHNoaXAgYXMgdGhhdCBpcyBhbHdheXMgZmlyc3QgcGxhY2VkXG4gICAgdXBkYXRlUGxhY2VtZW50SWNvbnMoMCk7XG4gICAgdXBkYXRlUGxhY2VtZW50TmFtZSgwKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBnYW1lIFVJXG4gIGNvbnN0IHNob3dHYW1lID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgcmVzZXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaHJpbmsgdGhlIHRpdGxlXG4gIGNvbnN0IHNocmlua1RpdGxlID0gKCkgPT4ge1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoXCJzaHJpbmtcIik7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gSGlnaCBsZXZlbCByZXNwb25zZXMgdG8gY2xpY2tzXG4gIC8vIEhhbmRlIGNsaWNrcyBvbiB0aGUgc3RhcnQgZ2FtZSBidXR0b25cbiAgY29uc3QgaGFuZGxlU3RhcnRDbGljayA9ICgpID0+IHtcbiAgICBzaHJpbmtUaXRsZSgpO1xuICAgIHNob3dQbGFjZW1lbnQoKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVBaU1hdGNoQ2xpY2sgPSAoKSA9PiB7XG4gICAgLy8gU2V0IHN0eWxlIGNsYXNzIGJhc2VkIG9uIGlmIHVzZXJCb2FyZCBpcyBhaSAoaWYgZmFsc2UsIHNldCBhY3RpdmUgYi9jIHdpbGwgYmUgdHJ1ZSBhZnRlciBjbGljaylcbiAgICBpZiAoZ20uYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmcgPT09IGZhbHNlKVxuICAgICAgYWlNYXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGVsc2UgYWlNYXRjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIGdtLmFpTWF0Y2hDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJhbmRvbSBzaGlwcyBidXR0b24gY2xpY2tcbiAgY29uc3QgaGFuZGxlUmFuZG9tU2hpcHNDbGljayA9ICgpID0+IHtcbiAgICBnbS5yYW5kb21TaGlwc0NsaWNrZWQoKTtcbiAgfTtcblxuICAvLyBIYW5kbGUgcmVzZXQgYnV0dG9uIGNsaWNrXG4gIGNvbnN0IGhhbmRsZVJlc2V0Q2xpY2sgPSAoKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBIYW5kbGUgYnJvd3NlciBldmVudHNcbiAgcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVSb3RhdGVDbGljayk7XG4gIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVTdGFydENsaWNrKTtcbiAgYWlNYXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQWlNYXRjaENsaWNrKTtcbiAgcmFuZG9tU2hpcHNCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVJhbmRvbVNoaXBzQ2xpY2spO1xuICByZXNldEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUmVzZXRDbGljayk7XG5cbiAgcmV0dXJuIHtcbiAgICBzaG93R2FtZSxcbiAgICBzaG93TWVudSxcbiAgICBzaG93UGxhY2VtZW50LFxuICAgIHVwZGF0ZVBsYWNlbWVudEljb25zLFxuICAgIHVwZGF0ZVBsYWNlbWVudE5hbWUsXG4gICAgdXBkYXRlSW5mb0ljb25zLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2ViSW50ZXJmYWNlO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxuICAgdjIuMCB8IDIwMTEwMTI2XG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxuKi9cblxuaHRtbCxcbmJvZHksXG5kaXYsXG5zcGFuLFxuYXBwbGV0LFxub2JqZWN0LFxuaWZyYW1lLFxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxucCxcbmJsb2NrcXVvdGUsXG5wcmUsXG5hLFxuYWJicixcbmFjcm9ueW0sXG5hZGRyZXNzLFxuYmlnLFxuY2l0ZSxcbmNvZGUsXG5kZWwsXG5kZm4sXG5lbSxcbmltZyxcbmlucyxcbmtiZCxcbnEsXG5zLFxuc2FtcCxcbnNtYWxsLFxuc3RyaWtlLFxuc3Ryb25nLFxuc3ViLFxuc3VwLFxudHQsXG52YXIsXG5iLFxudSxcbmksXG5jZW50ZXIsXG5kbCxcbmR0LFxuZGQsXG5vbCxcbnVsLFxubGksXG5maWVsZHNldCxcbmZvcm0sXG5sYWJlbCxcbmxlZ2VuZCxcbnRhYmxlLFxuY2FwdGlvbixcbnRib2R5LFxudGZvb3QsXG50aGVhZCxcbnRyLFxudGgsXG50ZCxcbmFydGljbGUsXG5hc2lkZSxcbmNhbnZhcyxcbmRldGFpbHMsXG5lbWJlZCxcbmZpZ3VyZSxcbmZpZ2NhcHRpb24sXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxub3V0cHV0LFxucnVieSxcbnNlY3Rpb24sXG5zdW1tYXJ5LFxudGltZSxcbm1hcmssXG5hdWRpbyxcbnZpZGVvIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3JkZXI6IDA7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbiAgZm9udDogaW5oZXJpdDtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xuYXJ0aWNsZSxcbmFzaWRlLFxuZGV0YWlscyxcbmZpZ2NhcHRpb24sXG5maWd1cmUsXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxuc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuYm9keSB7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxub2wsXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5ibG9ja3F1b3RlLFxucSB7XG4gIHF1b3Rlczogbm9uZTtcbn1cbmJsb2NrcXVvdGU6YmVmb3JlLFxuYmxvY2txdW90ZTphZnRlcixcbnE6YmVmb3JlLFxucTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNvbnRlbnQ6IG5vbmU7XG59XG50YWJsZSB7XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Q0FHQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUZFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsU0FBUztFQUNULGVBQWU7RUFDZixhQUFhO0VBQ2Isd0JBQXdCO0FBQzFCO0FBQ0EsZ0RBQWdEO0FBQ2hEOzs7Ozs7Ozs7OztFQVdFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxZQUFZO0FBQ2Q7QUFDQTs7OztFQUlFLFdBQVc7RUFDWCxhQUFhO0FBQ2Y7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixpQkFBaUI7QUFDbkJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsXFxuYm9keSxcXG5kaXYsXFxuc3BhbixcXG5hcHBsZXQsXFxub2JqZWN0LFxcbmlmcmFtZSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wLFxcbmJsb2NrcXVvdGUsXFxucHJlLFxcbmEsXFxuYWJicixcXG5hY3JvbnltLFxcbmFkZHJlc3MsXFxuYmlnLFxcbmNpdGUsXFxuY29kZSxcXG5kZWwsXFxuZGZuLFxcbmVtLFxcbmltZyxcXG5pbnMsXFxua2JkLFxcbnEsXFxucyxcXG5zYW1wLFxcbnNtYWxsLFxcbnN0cmlrZSxcXG5zdHJvbmcsXFxuc3ViLFxcbnN1cCxcXG50dCxcXG52YXIsXFxuYixcXG51LFxcbmksXFxuY2VudGVyLFxcbmRsLFxcbmR0LFxcbmRkLFxcbm9sLFxcbnVsLFxcbmxpLFxcbmZpZWxkc2V0LFxcbmZvcm0sXFxubGFiZWwsXFxubGVnZW5kLFxcbnRhYmxlLFxcbmNhcHRpb24sXFxudGJvZHksXFxudGZvb3QsXFxudGhlYWQsXFxudHIsXFxudGgsXFxudGQsXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5jYW52YXMsXFxuZGV0YWlscyxcXG5lbWJlZCxcXG5maWd1cmUsXFxuZmlnY2FwdGlvbixcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5vdXRwdXQsXFxucnVieSxcXG5zZWN0aW9uLFxcbnN1bW1hcnksXFxudGltZSxcXG5tYXJrLFxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICBmb250OiBpbmhlcml0O1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5kZXRhaWxzLFxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsXFxucSB7XFxuICBxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLFxcbmJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsXFxucTphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBHbG9iYWwgVmFycyAqL1xuOnJvb3Qge1xuICAtLWNvbG9yQTE6ICM3MjJiOTQ7XG4gIC0tY29sb3JBMjogI2E5MzZlMDtcbiAgLS1jb2xvckM6ICMzN2UwMmI7XG4gIC0tY29sb3JCMTogIzk0MWQwZDtcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xuXG4gIC0tYmctY29sb3I6IGhzbCgwLCAwJSwgMjIlKTtcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcbiAgLS10ZXh0LWNvbG9yOiBoc2woMCwgMCUsIDkxJSk7XG4gIC0tbGluay1jb2xvcjogaHNsKDM2LCA5MiUsIDU5JSk7XG5cbiAgLS1jYW52YXMtc2l6ZTogMzAwO1xufVxuXG4vKiAjcmVnaW9uIFVuaXZlcnNhbCBlbGVtZW50IHJ1bGVzICovXG5hIHtcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xufVxuXG5odG1sIHtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIG92ZXJmbG93LXk6IHNjcm9sbDtcblxuICAtbXMtb3ZlcmZsb3ctc3R5bGU6IG5vbmU7IC8qIElFIGFuZCBFZGdlICovXG4gIHNjcm9sbGJhci13aWR0aDogbm9uZTsgLyogRmlyZWZveCAqL1xufVxuXG5odG1sOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbmJvZHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcblxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbn1cblxuLmNhbnZhcy1jb250YWluZXIge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbiAgaGVpZ2h0OiBmaXQtY29udGVudDtcbn1cblxuLmNhbnZhcy1jb250YWluZXIgPiAqIHtcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcbiAgZ3JpZC1jb2x1bW46IC0xIC8gMTtcbn1cblxuLmljb24uaW5hY3RpdmUge1xuICBmaWx0ZXI6IGdyYXlzY2FsZSg4MCUpIGJyaWdodG5lc3MoNTAlKTtcbn1cblxuLnNlY3Rpb24ge1xuICBtYXgtd2lkdGg6IDkwMHB4O1xuICBtaW4td2lkdGg6IDYwMHB4O1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIGxvYWRpbmctc2NyZWVuICovXG4ubG9hZGluZy1zY3JlZW4ge1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcbn1cblxuLmxvYWRpbmctc2NyZWVuLmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMDAlKTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIG1haW4tY29udGVudCAqL1xuLm1haW4tY29udGVudCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyMCwgNSUpIC8gcmVwZWF0KDIwLCA1JSk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vKiB0aXRsZSBncmlkICovXG4udGl0bGUge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogMiAvIDY7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuOHMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgd2lkdGg6IDEwMCU7XG5cbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG59XG5cbi50aXRsZS10ZXh0IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiA0LjhyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggdmFyKC0tY29sb3JCMSk7XG4gIGNvbG9yOiB2YXIoLS1jb2xvckIyKTtcblxuICB0cmFuc2l0aW9uOiBmb250LXNpemUgMC44cyBlYXNlLWluLW91dDtcbn1cblxuLnRpdGxlLnNocmluayB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjAwJSk7XG59XG5cbi50aXRsZS5zaHJpbmsgLnRpdGxlLXRleHQge1xuICBmb250LXNpemU6IDMuNXJlbTtcbn1cbi8qICNyZWdpb24gbWVudSBzZWN0aW9uICovXG4ubWVudSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiA4IC8gMTg7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgNSUgMWZyIDUlIDFmciA1JSAxZnIgLyAxZnI7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuXCJcbiAgICBcImNyZWRpdHNcIlxuICAgIFwiLlwiXG4gICAgXCJzdGFydC1nYW1lXCJcbiAgICBcIi5cIlxuICAgIFwiYWktbWF0Y2hcIlxuICAgIFwiLlwiXG4gICAgXCJvcHRpb25zXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG5cbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi1oZWlnaHQ6IDI3NXB4O1xuXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xufVxuXG4ubWVudS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTIwMCUpO1xufVxuXG4ubWVudSAuY3JlZGl0cyB7XG4gIGdyaWQtYXJlYTogY3JlZGl0cztcbn1cblxuLm1lbnUgLnN0YXJ0IHtcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xuICBhbGlnbi1zZWxmOiBlbmQ7XG59XG5cbi5tZW51IC5haS1tYXRjaCB7XG4gIGdyaWQtYXJlYTogYWktbWF0Y2g7XG59XG5cbi5tZW51IC5vcHRpb25zIHtcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bixcbi5tZW51IC5vcHRpb25zLWJ0bixcbi5tZW51IC5haS1tYXRjaC1idG4ge1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxODBweDtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bjpob3Zlcixcbi5tZW51IC5vcHRpb25zLWJ0bjpob3Zlcixcbi5tZW51IC5haS1tYXRjaC1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLm1lbnUgLmFpLW1hdGNoLWJ0bi5hY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIHBsYWNlbWVudCBzZWN0aW9uICovXG4ucGxhY2VtZW50IHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDMgLyAyMDtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDUlIG1pbi1jb250ZW50IDUlIC8gMWZyIDUlIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuXCJcbiAgICBcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXCJcbiAgICBcIi4gLiAuXCJcbiAgICBcInNoaXBzIHNoaXBzIHNoaXBzXCJcbiAgICBcIi4gLiAuIFwiXG4gICAgXCJyYW5kb20gLiByb3RhdGVcIlxuICAgIFwiLiAuIC5cIlxuICAgIFwiY2FudmFzIGNhbnZhcyBjYW52YXNcIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcblxuICB3aWR0aDogMTAwJTtcbiAgbWluLWhlaWdodDogNjUwcHg7XG5cbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG59XG5cbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucyB7XG4gIGdyaWQtYXJlYTogaW5zdHJ1Y3Rpb25zO1xufVxuXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMi4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMXB4IHZhcigtLWJnLWNvbG9yKTtcbn1cblxuLnBsYWNlbWVudCAuc2hpcHMtdG8tcGxhY2Uge1xuICBncmlkLWFyZWE6IHNoaXBzO1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA1JSAxZnIgMTAlIG1pbi1jb250ZW50IC8gMTAlIHJlcGVhdCg1LCAxZnIpIDEwJTtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuIC4gLiAuIC5cIlxuICAgIFwiLiBzcCBhdCB2bSBpZyBsIC5cIlxuICAgIFwiLiAuIC4gLiAuIC4gLlwiXG4gICAgXCIuIG4gbiBuIG4gbiAuXCI7XG59XG5cbi5zaGlwcy10by1wbGFjZSAuc2hpcCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5zaGlwcy10by1wbGFjZSAuaWNvbiB7XG4gIHdpZHRoOiA5MCU7XG59XG5cbi5zaGlwcy10by1wbGFjZSAuc2hpcC1uYW1lIHtcbiAgZ3JpZC1hcmVhOiBuO1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLnNoaXBzLXRvLXBsYWNlIC5zaGlwLW9uZSB7XG4gIGdyaWQtYXJlYTogc3A7XG59XG5cbi5zaGlwcy10by1wbGFjZSAuc2hpcC10d28ge1xuICBncmlkLWFyZWE6IGF0O1xufVxuXG4uc2hpcHMtdG8tcGxhY2UgLnNoaXAtdGhyZWUge1xuICBncmlkLWFyZWE6IHZtO1xufVxuXG4uc2hpcHMtdG8tcGxhY2UgLnNoaXAtZm91ciB7XG4gIGdyaWQtYXJlYTogaWc7XG59XG5cbi5zaGlwcy10by1wbGFjZSAuc2hpcC1maXZlIHtcbiAgZ3JpZC1hcmVhOiBsO1xufVxuXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMge1xuICBncmlkLWFyZWE6IHJhbmRvbTtcbiAganVzdGlmeS1zZWxmOiBlbmQ7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZSB7XG4gIGdyaWQtYXJlYTogcm90YXRlO1xuICBqdXN0aWZ5LXNlbGY6IHN0YXJ0O1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuLFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0biB7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDE4MHB4O1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmhvdmVyLFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjpob3ZlciB7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmFjdGl2ZSxcbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcy1idG46YWN0aXZlIHtcbiAgdGV4dC1zaGFkb3c6IDRweCA0cHggMXB4IHZhcigtLWNvbG9yQyksIC00cHggLTRweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi5wbGFjZW1lbnQgLnBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiBjYW52YXM7XG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xufVxuXG4ucGxhY2VtZW50LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMDAlKTtcbn1cblxuLnBsYWNlbWVudCAuY2FudmFzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQyk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gZ2FtZSBzZWN0aW9uICovXG4uZ2FtZSB7XG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XG4gIGdyaWQtcm93OiAzIC8gMjA7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGdyaWQtdGVtcGxhdGU6XG4gICAgcmVwZWF0KDIsIG1pbm1heCgxMHB4LCAxZnIpIG1pbi1jb250ZW50KSBtaW5tYXgoMTBweCwgMWZyKVxuICAgIG1pbi1jb250ZW50IDFmciAvIHJlcGVhdCg0LCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxuICAgIFwiLiAuIC4gLlwiXG4gICAgXCIuIGxvZyBsb2cgLlwiXG4gICAgXCIuIC4gLiAuXCJcbiAgICBcInVzZXItYm9hcmQgdXNlci1ib2FyZCBhaS1ib2FyZCBhaS1ib2FyZFwiXG4gICAgXCIuIC4gLiAuXCJcbiAgICBcInVzZXItaW5mbyB1c2VyLWluZm8gYWktaW5mbyBhaS1pbmZvXCJcbiAgICBcIi4gLiAuIC5cIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcblxuICBtaW4taGVpZ2h0OiA2MDBweDtcblxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcbn1cblxuLmdhbWUgLmNhbnZhcy1jb250YWluZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbn1cblxuLmdhbWUgLnVzZXItY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogdXNlci1ib2FyZDtcbn1cblxuLmdhbWUgLmFpLWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IGFpLWJvYXJkO1xufVxuXG4uZ2FtZSAuaW5mbyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IG1pbi1jb250ZW50IDEwcHggMWZyIC8gNSUgcmVwZWF0KDUsIDFmcikgNSU7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuIG4gbiBuIG4gbiAuXCJcbiAgICBcIi4gLiAuIC4gLiAuIC5cIlxuICAgIFwiLiBzcCBhdCB2bSBpZyBsIC5cIjtcblxuICBwbGFjZS1pdGVtczogY2VudGVyO1xufVxuXG4uaW5mbyAubmFtZSB7XG4gIGdyaWQtYXJlYTogbjtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi5pbmZvIC5zaGlwIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbn1cblxuLmluZm8gLmljb24ge1xuICB3aWR0aDogODAlO1xufVxuXG4uaW5mbyAuc2hpcC1vbmUge1xuICBncmlkLWFyZWE6IHNwO1xufVxuXG4uaW5mbyAuc2hpcC10d28ge1xuICBncmlkLWFyZWE6IGF0O1xufVxuXG4uaW5mbyAuc2hpcC10aHJlZSB7XG4gIGdyaWQtYXJlYTogdm07XG59XG5cbi5pbmZvIC5zaGlwLWZvdXIge1xuICBncmlkLWFyZWE6IGlnO1xufVxuXG4uaW5mbyAuc2hpcC1maXZlIHtcbiAgZ3JpZC1hcmVhOiBsO1xufVxuXG4uZ2FtZSAudXNlci1pbmZvIHtcbiAgZ3JpZC1hcmVhOiB1c2VyLWluZm87XG59XG5cbi5nYW1lIC5haS1pbmZvIHtcbiAgZ3JpZC1hcmVhOiBhaS1pbmZvO1xufVxuXG4uZ2FtZSAucGxheWVyLXNoaXBzIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcbn1cblxuLmdhbWUgLmxvZyB7XG4gIGdyaWQtYXJlYTogbG9nO1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiAxZnIgLyBtaW4tY29udGVudCAxMHB4IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczogXCJzY2VuZSAuIHRleHRcIjtcblxuICB3aWR0aDogNTAwcHg7XG5cbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tY29sb3JCMSk7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XG59XG5cbi5nYW1lIC5sb2cgLnNjZW5lIHtcbiAgZ3JpZC1hcmVhOiBzY2VuZTtcblxuICBoZWlnaHQ6IDE1MHB4O1xuICB3aWR0aDogMTUwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQjEpO1xufVxuXG4uZ2FtZSAubG9nIC5zY2VuZS1pbWcge1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uZ2FtZSAubG9nIC5sb2ctdGV4dCB7XG4gIGdyaWQtYXJlYTogdGV4dDtcbiAgZm9udC1zaXplOiAxLjE1cmVtO1xuICB3aGl0ZS1zcGFjZTogcHJlOyAvKiBBbGxvd3MgZm9yIFxcXFxuICovXG59XG5cbi5nYW1lLmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyMDAlKTtcbn1cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBSZXNldCAqL1xuLnJlc2V0IHtcbiAgZ3JpZC1jb2x1bW46IDkgLyAxMztcbiAgZ3JpZC1yb3c6IDEgLyAzO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG5cbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICBoZWlnaHQ6IDkwJTtcbiAgbWF4LWhlaWdodDogNjBweDtcbiAgd2lkdGg6IDkwJTtcbiAgbWF4LXdpZHRoOiAxODBweDtcbiAgcGxhY2Utc2VsZjogY2VudGVyO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xufVxuXG4ucmVzZXQgLnJlc2V0LWJ0biB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG5cbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG59XG5cbi5yZXNldCAucmVzZXQtYnRuOmhvdmVyIHtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi5yZXNldCAucmVzZXQtYnRuOmFjdGl2ZSB7XG4gIHRleHQtc2hhZG93OiA0cHggNHB4IDFweCB2YXIoLS1jb2xvckMpLCAtNHB4IC00cHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ucmVzZXQuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0yMDAlKTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjZW5kcmVnaW9uICovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQ2hCO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGtCQUFrQjs7RUFFbEIsMkJBQTJCO0VBQzNCLDRCQUE0QjtFQUM1Qiw2QkFBNkI7RUFDN0IsK0JBQStCOztFQUUvQixrQkFBa0I7QUFDcEI7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QUFhO0FBQ2Y7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsY0FBYztFQUNkLGFBQWE7RUFDYix5Q0FBeUM7RUFDekMsbUNBQW1DOztFQUVuQyxZQUFZOztFQUVaLGdDQUFnQztFQUNoQyxrQkFBa0I7O0VBRWxCLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLGdCQUFnQjs7RUFFaEIsYUFBYTtFQUNiLFlBQVk7RUFDWixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVztBQUNiOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixnQkFBZ0IsRUFBRSxrQkFBa0I7QUFDdEM7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7QUFDQSxlQUFlOztBQUVmLGtCQUFrQjtBQUNsQjtFQUNFLG1CQUFtQjtFQUNuQixlQUFlOztFQUVmLGFBQWE7O0VBRWIsbUJBQW1COztFQUVuQixXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLFVBQVU7RUFDVixnQkFBZ0I7RUFDaEIsa0JBQWtCOztFQUVsQixzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSxZQUFZO0VBQ1osV0FBVzs7RUFFWCxpQkFBaUI7RUFDakIsaUJBQWlCO0VBQ2pCLHdCQUF3QjtFQUN4Qix3Q0FBd0M7O0VBRXhDLGdDQUFnQztFQUNoQywrQkFBK0I7RUFDL0IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usb0VBQW9FO0FBQ3RFOztBQUVBO0VBQ0Usb0VBQW9FO0FBQ3RFOztBQUVBO0VBQ0UsNEJBQTRCO0FBQzlCOztBQUVBLGVBQWU7O0FBRWYsZUFBZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBHbG9iYWwgVmFycyAqL1xcbjpyb290IHtcXG4gIC0tY29sb3JBMTogIzcyMmI5NDtcXG4gIC0tY29sb3JBMjogI2E5MzZlMDtcXG4gIC0tY29sb3JDOiAjMzdlMDJiO1xcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xcblxcbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcXG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcXG5cXG4gIC0tY2FudmFzLXNpemU6IDMwMDtcXG59XFxuXFxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xcbmEge1xcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xcbn1cXG5cXG5odG1sIHtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICBvdmVyZmxvdy15OiBzY3JvbGw7XFxuXFxuICAtbXMtb3ZlcmZsb3ctc3R5bGU6IG5vbmU7IC8qIElFIGFuZCBFZGdlICovXFxuICBzY3JvbGxiYXItd2lkdGg6IG5vbmU7IC8qIEZpcmVmb3ggKi9cXG59XFxuXFxuaHRtbDo6LXdlYmtpdC1zY3JvbGxiYXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG5cXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbn1cXG5cXG4uY2FudmFzLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gMWZyO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgaGVpZ2h0OiBmaXQtY29udGVudDtcXG59XFxuXFxuLmNhbnZhcy1jb250YWluZXIgPiAqIHtcXG4gIGdyaWQtcm93OiAtMSAvIDE7XFxuICBncmlkLWNvbHVtbjogLTEgLyAxO1xcbn1cXG5cXG4uaWNvbi5pbmFjdGl2ZSB7XFxuICBmaWx0ZXI6IGdyYXlzY2FsZSg4MCUpIGJyaWdodG5lc3MoNTAlKTtcXG59XFxuXFxuLnNlY3Rpb24ge1xcbiAgbWF4LXdpZHRoOiA5MDBweDtcXG4gIG1pbi13aWR0aDogNjAwcHg7XFxufVxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIGxvYWRpbmctc2NyZWVuICovXFxuLmxvYWRpbmctc2NyZWVuIHtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4ubG9hZGluZy1zY3JlZW4uaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMDAlKTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXFxuLm1haW4tY29udGVudCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4vKiB0aXRsZSBncmlkICovXFxuLnRpdGxlIHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogMiAvIDY7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxuICB3aWR0aDogMTAwJTtcXG5cXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcbn1cXG5cXG4udGl0bGUtdGV4dCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDQuOHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yQjIpO1xcblxcbiAgdHJhbnNpdGlvbjogZm9udC1zaXplIDAuOHMgZWFzZS1pbi1vdXQ7XFxufVxcblxcbi50aXRsZS5zaHJpbmsge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0yMDAlKTtcXG59XFxuXFxuLnRpdGxlLnNocmluayAudGl0bGUtdGV4dCB7XFxuICBmb250LXNpemU6IDMuNXJlbTtcXG59XFxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cXG4ubWVudSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDggLyAxODtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCA1JSAxZnIgNSUgMWZyIDUlIDFmciAvIDFmcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcImNyZWRpdHNcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwic3RhcnQtZ2FtZVxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJhaS1tYXRjaFxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJvcHRpb25zXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcblxcbiAgd2lkdGg6IDEwMCU7XFxuICBtaW4taGVpZ2h0OiAyNzVweDtcXG5cXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcbn1cXG5cXG4ubWVudS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0yMDAlKTtcXG59XFxuXFxuLm1lbnUgLmNyZWRpdHMge1xcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xcbn1cXG5cXG4ubWVudSAuc3RhcnQge1xcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xcbiAgYWxpZ24tc2VsZjogZW5kO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gge1xcbiAgZ3JpZC1hcmVhOiBhaS1tYXRjaDtcXG59XFxuXFxuLm1lbnUgLm9wdGlvbnMge1xcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG4sXFxuLm1lbnUgLm9wdGlvbnMtYnRuLFxcbi5tZW51IC5haS1tYXRjaC1idG4ge1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgd2lkdGg6IDE4MHB4O1xcblxcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxcbi5tZW51IC5vcHRpb25zLWJ0bjpob3ZlcixcXG4ubWVudSAuYWktbWF0Y2gtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gtYnRuLmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cXG4ucGxhY2VtZW50IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogMyAvIDIwO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgNSUgbWluLWNvbnRlbnQgNSUgLyAxZnIgNSUgMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLlxcXCJcXG4gICAgXFxcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXFxcIlxcbiAgICBcXFwiLiAuIC5cXFwiXFxuICAgIFxcXCJzaGlwcyBzaGlwcyBzaGlwc1xcXCJcXG4gICAgXFxcIi4gLiAuIFxcXCJcXG4gICAgXFxcInJhbmRvbSAuIHJvdGF0ZVxcXCJcXG4gICAgXFxcIi4gLiAuXFxcIlxcbiAgICBcXFwiY2FudmFzIGNhbnZhcyBjYW52YXNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxuXFxuICB3aWR0aDogMTAwJTtcXG4gIG1pbi1oZWlnaHQ6IDY1MHB4O1xcblxcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucyB7XFxuICBncmlkLWFyZWE6IGluc3RydWN0aW9ucztcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zLXRleHQge1xcbiAgZm9udC1zaXplOiAyLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcXG4gIGdyaWQtYXJlYTogc2hpcHM7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgMWZyIDEwJSBtaW4tY29udGVudCAvIDEwJSByZXBlYXQoNSwgMWZyKSAxMCU7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLiAuIC4gLiAuIC4gLlxcXCJcXG4gICAgXFxcIi4gc3AgYXQgdm0gaWcgbCAuXFxcIlxcbiAgICBcXFwiLiAuIC4gLiAuIC4gLlxcXCJcXG4gICAgXFxcIi4gbiBuIG4gbiBuIC5cXFwiO1xcbn1cXG5cXG4uc2hpcHMtdG8tcGxhY2UgLnNoaXAge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwcy10by1wbGFjZSAuaWNvbiB7XFxuICB3aWR0aDogOTAlO1xcbn1cXG5cXG4uc2hpcHMtdG8tcGxhY2UgLnNoaXAtbmFtZSB7XFxuICBncmlkLWFyZWE6IG47XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG5cXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblxcbi5zaGlwcy10by1wbGFjZSAuc2hpcC1vbmUge1xcbiAgZ3JpZC1hcmVhOiBzcDtcXG59XFxuXFxuLnNoaXBzLXRvLXBsYWNlIC5zaGlwLXR3byB7XFxuICBncmlkLWFyZWE6IGF0O1xcbn1cXG5cXG4uc2hpcHMtdG8tcGxhY2UgLnNoaXAtdGhyZWUge1xcbiAgZ3JpZC1hcmVhOiB2bTtcXG59XFxuXFxuLnNoaXBzLXRvLXBsYWNlIC5zaGlwLWZvdXIge1xcbiAgZ3JpZC1hcmVhOiBpZztcXG59XFxuXFxuLnNoaXBzLXRvLXBsYWNlIC5zaGlwLWZpdmUge1xcbiAgZ3JpZC1hcmVhOiBsO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMge1xcbiAgZ3JpZC1hcmVhOiByYW5kb207XFxuICBqdXN0aWZ5LXNlbGY6IGVuZDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlIHtcXG4gIGdyaWQtYXJlYTogcm90YXRlO1xcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bixcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3ZlcixcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmFjdGl2ZSxcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmFjdGl2ZSB7XFxuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiBjYW52YXM7XFxuICBhbGlnbi1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudC5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDIwMCUpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQyk7XFxufVxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIGdhbWUgc2VjdGlvbiAqL1xcbi5nYW1lIHtcXG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XFxuICBncmlkLXJvdzogMyAvIDIwO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlOlxcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXFxuICAgIG1pbi1jb250ZW50IDFmciAvIHJlcGVhdCg0LCAxZnIpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCIuIGxvZyBsb2cgLlxcXCJcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcblxcbiAgbWluLWhlaWdodDogNjAwcHg7XFxuXFxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmdhbWUgLmNhbnZhcy1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxufVxcblxcbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IGFpLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAuaW5mbyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogbWluLWNvbnRlbnQgMTBweCAxZnIgLyA1JSByZXBlYXQoNSwgMWZyKSA1JTtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIG4gbiBuIG4gbiAuXFxcIlxcbiAgICBcXFwiLiAuIC4gLiAuIC4gLlxcXCJcXG4gICAgXFxcIi4gc3AgYXQgdm0gaWcgbCAuXFxcIjtcXG5cXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5pbmZvIC5uYW1lIHtcXG4gIGdyaWQtYXJlYTogbjtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblxcbi5pbmZvIC5zaGlwIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uaW5mbyAuaWNvbiB7XFxuICB3aWR0aDogODAlO1xcbn1cXG5cXG4uaW5mbyAuc2hpcC1vbmUge1xcbiAgZ3JpZC1hcmVhOiBzcDtcXG59XFxuXFxuLmluZm8gLnNoaXAtdHdvIHtcXG4gIGdyaWQtYXJlYTogYXQ7XFxufVxcblxcbi5pbmZvIC5zaGlwLXRocmVlIHtcXG4gIGdyaWQtYXJlYTogdm07XFxufVxcblxcbi5pbmZvIC5zaGlwLWZvdXIge1xcbiAgZ3JpZC1hcmVhOiBpZztcXG59XFxuXFxuLmluZm8gLnNoaXAtZml2ZSB7XFxuICBncmlkLWFyZWE6IGw7XFxufVxcblxcbi5nYW1lIC51c2VyLWluZm8ge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWluZm87XFxufVxcblxcbi5nYW1lIC5haS1pbmZvIHtcXG4gIGdyaWQtYXJlYTogYWktaW5mbztcXG59XFxuXFxuLmdhbWUgLnBsYXllci1zaGlwcyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLmdhbWUgLmxvZyB7XFxuICBncmlkLWFyZWE6IGxvZztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyBtaW4tY29udGVudCAxMHB4IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFxcXCJzY2VuZSAuIHRleHRcXFwiO1xcblxcbiAgd2lkdGg6IDUwMHB4O1xcblxcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tY29sb3JCMSk7XFxuICBib3JkZXItcmFkaXVzOiA2cHg7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lIHtcXG4gIGdyaWQtYXJlYTogc2NlbmU7XFxuXFxuICBoZWlnaHQ6IDE1MHB4O1xcbiAgd2lkdGg6IDE1MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lLWltZyB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLmdhbWUgLmxvZyAubG9nLXRleHQge1xcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xcbiAgZm9udC1zaXplOiAxLjE1cmVtO1xcbiAgd2hpdGUtc3BhY2U6IHByZTsgLyogQWxsb3dzIGZvciBcXFxcbiAqL1xcbn1cXG5cXG4uZ2FtZS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDIwMCUpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBSZXNldCAqL1xcbi5yZXNldCB7XFxuICBncmlkLWNvbHVtbjogOSAvIDEzO1xcbiAgZ3JpZC1yb3c6IDEgLyAzO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG5cXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICBoZWlnaHQ6IDkwJTtcXG4gIG1heC1oZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogOTAlO1xcbiAgbWF4LXdpZHRoOiAxODBweDtcXG4gIHBsYWNlLXNlbGY6IGNlbnRlcjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4ucmVzZXQgLnJlc2V0LWJ0biB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnJlc2V0IC5yZXNldC1idG46aG92ZXIge1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi5yZXNldCAucmVzZXQtYnRuOmFjdGl2ZSB7XFxuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnJlc2V0LmhpZGRlbiB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTIwMCUpO1xcbn1cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vQVQvYXRfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrMS5qcGdcIixcblx0XCIuL0FUL2F0X2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazIuanBnXCIsXG5cdFwiLi9BVC9hdF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vQVQvYXRfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrNC5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjEuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW4yLmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuMy5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjQuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQxLmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0Mi5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDMuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQ0LmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0NS5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazEuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2syLmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrMy5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazQuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW4xLmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuMi5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjMuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW40LmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuNS5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDEuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQyLmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0My5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDQuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQ1LmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0Ni5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0Ni5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMS5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMi5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMy5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrNC5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2s1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrNS5qcGdcIixcblx0XCIuL0wvbF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMS5qcGdcIixcblx0XCIuL0wvbF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMi5qcGdcIixcblx0XCIuL0wvbF9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMy5qcGdcIixcblx0XCIuL0wvbF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuNC5qcGdcIixcblx0XCIuL0wvbF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0MS5qcGdcIixcblx0XCIuL0wvbF9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0Mi5qcGdcIixcblx0XCIuL0wvbF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0My5qcGdcIixcblx0XCIuL0wvbF9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0NS5qcGdcIixcblx0XCIuL0wvbGdlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbGdlbjUuanBnXCIsXG5cdFwiLi9ML2xoaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xoaXQ0LmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrMS5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazIuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrNC5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjEuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW4yLmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuMy5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjQuanBnXCIsXG5cdFwiLi9TUC9zcF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9oaXQxLmpwZ1wiLFxuXHRcIi4vU1Avc3BfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfaGl0Mi5qcGdcIixcblx0XCIuL1NQL3NwX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2hpdDMuanBnXCIsXG5cdFwiLi9WTS9tdl9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS9tdl9oaXQ1LmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrMS5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazIuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrNC5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazUuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2s2LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2s2LmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuMS5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjIuanBnXCIsXG5cdFwiLi9WTS92bV9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW4zLmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuNC5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjUuanBnXCIsXG5cdFwiLi9WTS92bV9nZW42LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW42LmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0MS5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDIuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQzLmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0NC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvc2NlbmUtaW1hZ2VzIHN5bmMgcmVjdXJzaXZlIFxcXFwuanBnJC9cIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBJbXBvcnQgc3R5bGUgc2hlZXRzXG5pbXBvcnQgXCIuL3N0eWxlL3Jlc2V0LmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZS9zdHlsZS5jc3NcIjtcbmltcG9ydCBpbml0aWFsaXplR2FtZSBmcm9tIFwiLi9oZWxwZXJzL2luaXRpYWxpemVHYW1lXCI7XG5cbmluaXRpYWxpemVHYW1lKCk7XG4iXSwibmFtZXMiOlsiU2hpcCIsImFpQXR0YWNrIiwiR2FtZWJvYXJkIiwiZ20iLCJ0aGlzR2FtZWJvYXJkIiwibWF4Qm9hcmRYIiwibWF4Qm9hcmRZIiwic2hpcHMiLCJhbGxPY2N1cGllZENlbGxzIiwiY2VsbHNUb0NoZWNrIiwibWlzc2VzIiwiaGl0cyIsImRpcmVjdGlvbiIsImhpdFNoaXBUeXBlIiwiaXNBaSIsImlzQXV0b0F0dGFja2luZyIsImlzQWlTZWVraW5nIiwiZ2FtZU92ZXIiLCJjYW5BdHRhY2siLCJyaXZhbEJvYXJkIiwiY2FudmFzIiwiYWRkU2hpcCIsInJlY2VpdmVBdHRhY2siLCJhbGxTdW5rIiwibG9nU3VuayIsImlzQ2VsbFN1bmsiLCJhbHJlYWR5QXR0YWNrZWQiLCJ2YWxpZGF0ZVNoaXAiLCJzaGlwIiwiaXNWYWxpZCIsIl9sb29wIiwiaSIsIm9jY3VwaWVkQ2VsbHMiLCJpc0NlbGxPY2N1cGllZCIsInNvbWUiLCJjZWxsIiwibGVuZ3RoIiwiX3JldCIsImFkZENlbGxzVG9MaXN0IiwiZm9yRWFjaCIsInB1c2giLCJwb3NpdGlvbiIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsInNoaXBUeXBlSW5kZXgiLCJuZXdTaGlwIiwiYWRkTWlzcyIsImFkZEhpdCIsInR5cGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsIkFycmF5IiwiaXNBcnJheSIsIk51bWJlciIsImlzSW50ZWdlciIsImoiLCJoaXQiLCJ0cnlBaUF0dGFjayIsImRlbGF5Iiwic2hpcEFycmF5IiwiaXNTdW5rIiwic3Vua2VuU2hpcHMiLCJsb2dNc2ciLCJPYmplY3QiLCJrZXlzIiwia2V5IiwicGxheWVyIiwiY29uY2F0IiwidXNlclNoaXBTdW5rIiwiYWlTaGlwU3VuayIsImF0dGFja0Nvb3JkcyIsImF0dGFja2VkIiwibWlzcyIsImNlbGxUb0NoZWNrIiwiaGFzTWF0Y2hpbmdDZWxsIiwiZHJhd2luZ01vZHVsZSIsImRyYXciLCJjcmVhdGVDYW52YXMiLCJjYW52YXNYIiwiY2FudmFzWSIsIm9wdGlvbnMiLCJncmlkSGVpZ2h0IiwiZ3JpZFdpZHRoIiwiY3VycmVudENlbGwiLCJjYW52YXNDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJib2FyZENhbnZhcyIsImFwcGVuZENoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJib2FyZEN0eCIsImdldENvbnRleHQiLCJvdmVybGF5Q2FudmFzIiwib3ZlcmxheUN0eCIsImNlbGxTaXplWCIsImNlbGxTaXplWSIsImdldE1vdXNlQ2VsbCIsImV2ZW50IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm1vdXNlWCIsImNsaWVudFgiLCJsZWZ0IiwibW91c2VZIiwiY2xpZW50WSIsInRvcCIsImNlbGxYIiwiTWF0aCIsImZsb29yIiwiY2VsbFkiLCJkcmF3SGl0IiwiY29vcmRpbmF0ZXMiLCJoaXRPck1pc3MiLCJkcmF3TWlzcyIsImRyYXdTaGlwcyIsInVzZXJTaGlwcyIsImhhbmRsZU1vdXNlQ2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsIm5ld0V2ZW50IiwiTW91c2VFdmVudCIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiZGlzcGF0Y2hFdmVudCIsImhhbmRsZU1vdXNlTGVhdmUiLCJjbGVhclJlY3QiLCJoYW5kbGVNb3VzZU1vdmUiLCJtb3VzZUNlbGwiLCJwbGFjZW1lbnRIaWdobGlnaHQiLCJwbGFjZW1lbnRDbGlja2VkIiwiYXR0YWNrSGlnaGxpZ2h0IiwicGxheWVyQXR0YWNraW5nIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJsaW5lcyIsImNvbnRleHQiLCJncmlkU2l6ZSIsIm1pbiIsImxpbmVDb2xvciIsInN0cm9rZVN0eWxlIiwibGluZVdpZHRoIiwieCIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsInN0cm9rZSIsInkiLCJkcmF3Q2VsbCIsInBvc1giLCJwb3NZIiwiZmlsbFJlY3QiLCJib2FyZCIsInVzZXJCb2FyZCIsImFpQm9hcmQiLCJtb3VzZUNvb3JkcyIsImZpbGxTdHlsZSIsInJhZGl1cyIsImFyYyIsIlBJIiwiZmlsbCIsImRyYXdMZW5ndGgiLCJzaGlwc0NvdW50IiwiZGlyZWN0aW9uWCIsImRpcmVjdGlvblkiLCJoYWxmRHJhd0xlbmd0aCIsInJlbWFpbmRlckxlbmd0aCIsIm1heENvb3JkaW5hdGVYIiwibWF4Q29vcmRpbmF0ZVkiLCJtaW5Db29yZGluYXRlWCIsIm1pbkNvb3JkaW5hdGVZIiwibWF4WCIsIm1heFkiLCJtaW5YIiwibWluWSIsImlzT3V0T2ZCb3VuZHMiLCJuZXh0WCIsIm5leHRZIiwiUGxheWVyIiwicHJpdmF0ZU5hbWUiLCJ0aGlzUGxheWVyIiwibmFtZSIsIm5ld05hbWUiLCJ0b1N0cmluZyIsImdhbWVib2FyZCIsInNlbmRBdHRhY2siLCJ2YWxpZGF0ZUF0dGFjayIsInBsYXllckJvYXJkIiwic2hpcE5hbWVzIiwiaW5kZXgiLCJ0aGlzU2hpcCIsInNpemUiLCJwbGFjZW1lbnREaXJlY3Rpb25YIiwicGxhY2VtZW50RGlyZWN0aW9uWSIsImhhbGZTaXplIiwicmVtYWluZGVyU2l6ZSIsIm5ld0Nvb3JkcyIsImFpQnJhaW4iLCJicmFpbiIsInVwZGF0ZVByb2JzIiwiZmluZFJhbmRvbUF0dGFjayIsInJhbmRvbSIsImZpbmRHcmVhdGVzdFByb2JBdHRhY2siLCJhbGxQcm9icyIsInByb2JzIiwibWF4IiwiTkVHQVRJVkVfSU5GSU5JVFkiLCJhaURpZmZpY3VsdHkiLCJyZXNldEhpdEFkamFjZW50SW5jcmVhc2VzIiwiY29vcmRzIiwiZGVzdHJveU1vZGVDb29yZHMiLCJhaUF0dGFja2luZyIsImNyZWF0ZVByb2JzIiwiY29sb3JNb2QiLCJhZGphY2VudE1vZCIsImluaXRpYWxQcm9icyIsIm1hcCIsInJvdyIsIl90b0NvbnN1bWFibGVBcnJheSIsImlzVmFsaWRDZWxsIiwiY29sIiwibnVtUm93cyIsIm51bUNvbHMiLCJpc0JvdW5kYXJ5T3JNaXNzIiwiZ2V0TGFyZ2VzdFJlbWFpbmluZ0xlbmd0aCIsImxhcmdlc3RTaGlwTGVuZ3RoIiwiZ2V0U21hbGxlc3RSZW1haW5pbmdMZW5ndGgiLCJzbWFsbGVzdFNoaXBMZW5ndGgiLCJsb2FkQWRqYWNlbnRDZWxscyIsImNlbnRlckNlbGwiLCJhZGphY2VudEhpdHMiLCJhZGphY2VudEVtcHRpZXMiLCJfY2VudGVyQ2VsbCIsIl9zbGljZWRUb0FycmF5IiwiY2VudGVyWCIsImNlbnRlclkiLCJib3R0b20iLCJyaWdodCIsImNoZWNrQ2VsbCIsImFwcGx5IiwicmV0dXJuQmVzdEFkamFjZW50RW1wdHkiLCJtYXhWYWx1ZSIsIl9hZGphY2VudEVtcHRpZXMkaSIsInZhbHVlIiwiaGFuZGxlQWRqYWNlbnRIaXQiLCJjZWxsQ291bnQiLCJ0aGlzQ291bnQiLCJfaGl0IiwiaGl0WCIsImhpdFkiLCJuZXh0Q2VsbCIsIl9uZXh0Q2VsbCIsIl9uZXh0Q2VsbDIiLCJmb3VuZEVtcHR5IiwiY2hlY2tOZXh0Q2VsbCIsIm5YIiwiblkiLCJzaGlmdCIsIm5ld05leHQiLCJfbmV3TmV4dCIsIl9uZXdOZXh0MiIsIm5ld1giLCJuZXdZIiwiY2hlY2tBZGphY2VudENlbGxzIiwiaW5jcmVhc2VkQWRqYWNlbnRDZWxscyIsImhpdEFkamFjZW50SW5jcmVhc2UiLCJsYXJnZXN0TGVuZ3RoIiwic3RhcnRpbmdEZWMiLCJkZWNQZXJjZW50YWdlIiwibWluRGVjIiwiZGVjcmVtZW50RmFjdG9yIiwiX2luY3JlYXNlZEFkamFjZW50Q2VsIiwic3BsaWNlIiwiY2hlY2tEZWFkQ2VsbHMiLCJfZ20kdXNlckJvYXJkIiwidmFsdWVzIiwiX2hpdDIiLCJfbWlzcyIsInRyYW5zcG9zZUFycmF5IiwiYXJyYXkiLCJfIiwiY29sSW5kZXgiLCJsb2dQcm9icyIsInByb2JzVG9Mb2ciLCJ0cmFuc3Bvc2VkUHJvYnMiLCJjb25zb2xlIiwidGFibGUiLCJsb2ciLCJyZWR1Y2UiLCJzdW0iLCJyb3dTdW0iLCJub3JtYWxpemVQcm9icyIsIm5vcm1hbGl6ZWRQcm9icyIsImluaXRpYWxDb2xvcldlaWdodCIsImNvbG9yV2VpZ2h0IiwiZGlzdGFuY2VGcm9tQ2VudGVyIiwic3FydCIsInBvdyIsIm1pblByb2JhYmlsaXR5IiwibWF4UHJvYmFiaWxpdHkiLCJwcm9iYWJpbGl0eSIsImJhcnJ5UHJvYmFiaWxpdHkiLCJncmlkQ2FudmFzIiwiY2FudmFzQWRkZXIiLCJ1c2VyR2FtZWJvYXJkIiwiYWlHYW1lYm9hcmQiLCJ3ZWJJbnRlcmZhY2UiLCJwbGFjZW1lbnRQSCIsInF1ZXJ5U2VsZWN0b3IiLCJ1c2VyUEgiLCJhaVBIIiwidXNlckNhbnZhcyIsImFpQ2FudmFzIiwicGxhY2VtZW50Q2FudmFzIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsImltYWdlTG9hZGVyIiwiaW1hZ2VSZWZzIiwiU1AiLCJhdHRhY2siLCJnZW4iLCJBVCIsIlZNIiwiSUciLCJMIiwiaW1hZ2VDb250ZXh0IiwicmVxdWlyZSIsImZpbGVzIiwiZmlsZSIsImZpbGVQYXRoIiwiZmlsZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsInN1YkRpciIsInNwbGl0IiwidG9VcHBlckNhc2UiLCJpbmNsdWRlcyIsImdhbWVNYW5hZ2VyIiwid2ViSW50IiwicGxhY2VBaVNoaXBzIiwiZ2FtZUxvZyIsInNvdW5kcyIsImluaXRpYWxpemVHYW1lIiwibG9hZGluZ1NjcmVlbiIsInNvdW5kUGxheWVyIiwibG9hZFNjZW5lcyIsInVzZXJQbGF5ZXIiLCJhaVBsYXllciIsInNldFVzZXJHYW1lYm9hcmQiLCJpbml0U2NlbmUiLCJjYW52YXNlcyIsInVzZXJDYW52YXNDb250YWluZXIiLCJhaUNhbnZhc0NvbnRhaW5lciIsInBsYWNlbWVudENhbnZhc0NvbnRhaW5lciIsInNldFRpbWVvdXQiLCJyYW5kb21TaGlwcyIsInBhc3NlZERpZmYiLCJwbGFjZVNoaXBzIiwiZGlmZmljdWx0eSIsImdyaWRYIiwiZ3JpZFkiLCJyb3VuZCIsInVzZXJOYW1lIiwiZG9VcGRhdGVTY2VuZSIsImRvTG9jayIsImxvZ1RleHQiLCJsb2dJbWciLCJzY2VuZUltYWdlcyIsInJhbmRvbUVudHJ5IiwibGFzdEluZGV4IiwicmFuZG9tTnVtYmVyIiwiZGlyTmFtZXMiLCJyYW5kb21TaGlwRGlyIiwicmVtYWluaW5nU2hpcHMiLCJzaGlwRGlyIiwiZW50cnkiLCJzcmMiLCJzZXRTY2VuZSIsImxvZ0xvd2VyIiwidGV4dENvbnRlbnQiLCJzaGlwVHlwZXMiLCJ0eXBlVG9EaXIiLCJzZW50aW5lbCIsImFzc2F1bHQiLCJ2aXBlciIsImlyb24iLCJsZXZpYXRoYW4iLCJlcmFzZSIsImFwcGVuZCIsInN0cmluZ1RvQXBwZW5kIiwiaW5uZXJIVE1MIiwiYm9vbCIsInVzZXJBdHRhY2tEZWxheSIsImFpQXR0YWNrRGVsYXkiLCJhaUF1dG9EZWxheSIsImFpQXR0YWNrSGl0IiwicGxheUhpdCIsInN1bmtNc2ciLCJhaUF0dGFja01pc3NlZCIsInBsYXlNaXNzIiwiYWlBdHRhY2tDb3VudCIsInRoZW4iLCJyZXN1bHQiLCJwbGF5QXR0YWNrIiwiYWlNYXRjaENsaWNrZWQiLCJpc011dGVkIiwidHJ5U3RhcnRHYW1lIiwic2hvd0dhbWUiLCJyYW5kb21TaGlwc0NsaWNrZWQiLCJyb3RhdGVDbGlja2VkIiwidXBkYXRlUGxhY2VtZW50SWNvbnMiLCJ1cGRhdGVQbGFjZW1lbnROYW1lIiwiX2NlbGwiLCJveCIsIm95IiwiX2FpQm9hcmQkY2VsbHNUb0NoZWNrIiwiY3giLCJjeSIsInVwZGF0ZUluZm9JY29ucyIsImRpZmYiLCJwbGFjZW1lbnRDYW52YXNjb250YWluZXIiLCJhTW9kdWxlIiwiaGl0U291bmQiLCJtaXNzU291bmQiLCJhdHRhY2tTb3VuZCIsImF0dGFja0F1ZGlvIiwiQXVkaW8iLCJoaXRBdWRpbyIsIm1pc3NBdWRpbyIsImN1cnJlbnRUaW1lIiwicGxheSIsInRpdGxlIiwibWVudSIsInBsYWNlbWVudCIsImdhbWUiLCJyZXNldCIsInN0YXJ0QnRuIiwiYWlNYXRjaEJ0biIsInJhbmRvbVNoaXBzQnRuIiwicm90YXRlQnRuIiwicmVzZXRCdG4iLCJwbGFjZW1lbnRJY29ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwbGFjZW1lbnRTaGlwTmFtZSIsInVzZXJJY29ucyIsImFpSWNvbnMiLCJyb3RhdGVEaXJlY3Rpb24iLCJzaGlwVG9QbGFjZU51bSIsInNoaXBOYW1lIiwicmVtb3ZlIiwic2hpcFRoYXRTdW5rTnVtIiwiZm9yVXNlciIsImhpZGVBbGwiLCJzaG93TWVudSIsInNob3dQbGFjZW1lbnQiLCJzaHJpbmtUaXRsZSIsImhhbmRsZVN0YXJ0Q2xpY2siLCJoYW5kbGVBaU1hdGNoQ2xpY2siLCJoYW5kbGVSb3RhdGVDbGljayIsImhhbmRsZVJhbmRvbVNoaXBzQ2xpY2siLCJoYW5kbGVSZXNldENsaWNrIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiXSwic291cmNlUm9vdCI6IiJ9