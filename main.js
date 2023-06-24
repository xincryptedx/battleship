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



/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
var Gameboard = function Gameboard(gm) {
  var thisGameboard = {
    maxBoardX: 9,
    maxBoardY: 9,
    ships: [],
    allOccupiedCells: [],
    misses: [],
    hits: [],
    direction: 1,
    hitShipType: null,
    isAi: false,
    gameOver: false,
    canAttack: true,
    rivalBoard: null,
    canvas: null,
    addShip: null,
    receiveAttack: null,
    allSunk: null,
    logSunk: null,
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
// Contains the names for the ships based on index
var shipNames = {
  1: "Sentinel Probe",
  2: "Assault Titan",
  3: "Viper Mech",
  4: "Iron Goliath",
  5: "Leviathan"
};

// Factory that can create and return one of a variety of pre-determined ships.
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
/* harmony import */ var _cellProbs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cellProbs */ "./src/helpers/aiAttack/cellProbs.js");


// Module that allows ai to make attacks based on probability a cell will result
// in a hit. Uses Bayesian inference along with two Battleship game theories.
var probs = (0,_cellProbs__WEBPACK_IMPORTED_MODULE_0__["default"])();

// This helper will look at current hits and misses and then return an attack
var aiAttack = function aiAttack(gm, delay) {
  var gridHeight = 10;
  var gridWidth = 10;
  var attackCoords = [];

  // Update cell hit probabilities
  probs.updateProbs(gm);

  // Method for returning random attack
  var findRandomAttack = function findRandomAttack() {
    var x = Math.floor(Math.random() * gridWidth);
    var y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Method that finds largest value in 2d array
  var findGreatestProbAttack = function findGreatestProbAttack() {
    var allProbs = probs.probs;
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

  // Do an attack based on probabilities if ai difficulty is 2
  else if (gm.aiDifficulty === 2) {
    findGreatestProbAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findGreatestProbAttack();
    }
  }

  // Send attack to game manager
  gm.aiAttacking(attackCoords, delay);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiAttack);

/***/ }),

/***/ "./src/helpers/aiAttack/cellProbs.js":
/*!*******************************************!*\
  !*** ./src/helpers/aiAttack/cellProbs.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var cellProbs = function cellProbs() {
  // Probability modifiers
  var colorMod = 0.33; // Strong negative bias used to initialize all probs
  var adjacentMod = 4; // Medium positive bias for hit adjacent adjustments

  // Method that creates probs and defines initial probabilities
  var createProbs = function createProbs() {
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

    // Return the initialized probs
    return initialProbs;
  };

  // Method for normalizing the probabilities
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

  // Create the probs
  var nonNormalizedProbs = createProbs();
  // Normalize the probabilities
  var probs = normalizeProbs(nonNormalizedProbs);

  // Helper methods for updateProbs
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
        probs[hitX][hitY - i] *= adjacentMod * decrementFactor;
      }
      // South if on board
      if (hitY + i <= 9) {
        probs[hitX][hitY + i] *= adjacentMod * decrementFactor;
      }
      // West if on board
      if (hitX - i >= 0) {
        probs[hitX - i][hitY] *= adjacentMod * decrementFactor;
      }
      // East if on board
      if (hitX + i <= 9) {
        probs[hitX + i][hitY] *= adjacentMod * decrementFactor;
      }
    }
  };
  var checkDeadCells = function checkDeadCells() {
    // Set rows and cols
    var numRows = probs[0].length;
    var numCols = probs.length;
    // Helper that checks if valid cell on grid
    function isValidCell(row, col) {
      return row >= 0 && row < numRows && col >= 0 && col < numCols;
    }
    // Helper that checks if cell is a boundary or miss (-1 value)
    function isBoundaryOrMiss(row, col) {
      return !isValidCell(row, col) || probs[row][col] === -1;
    }
    // For every cell, check the cells around it. If they are all boundary or miss then set to -1
    for (var row = 0; row < numRows; row += 1) {
      for (var col = 0; col < numCols; col += 1) {
        // If the cell is an empty cell (> 0) and adjacent cells are boundary or miss
        if (probs[row][col] > 0 && isBoundaryOrMiss(row, col - 1) && isBoundaryOrMiss(row, col + 1) && isBoundaryOrMiss(row - 1, col) && isBoundaryOrMiss(row + 1, col)) {
          // Set that cell to a miss since it cannot be a hit
          probs[row][col] = -1;
          console.log("".concat(row, ", ").concat(col, " surrounded and cannot be a hit. Set to miss."));
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
    var largestShipLength = null;
    for (var i = Object.keys(gm.userBoard.sunkenShips).length; i >= 1; i -= 1) {
      if (!gm.userBoard.sunkenShips[i]) {
        largestShipLength = i;
        largestShipLength = i === 1 ? 2 : largestShipLength;
        largestShipLength = i === 2 ? 3 : largestShipLength;
        break;
      }
    }
    // Smallest ship length
    var smallestShipLength = null;
    for (var _i = 0; _i < Object.keys(gm.userBoard.sunkenShips).length; _i += 1) {
      if (!gm.userBoard.sunkenShips[_i]) {
        smallestShipLength = _i === 0 ? 2 : smallestShipLength;
        smallestShipLength = _i === 1 ? 3 : smallestShipLength;
        smallestShipLength = _i > 1 ? _i : smallestShipLength;
        break;
      }
    }
    console.log("Smallest length: ".concat(smallestShipLength));

    // Update values based on hits
    Object.values(hits).forEach(function (hit) {
      var _hit = _slicedToArray(hit, 2),
        x = _hit[0],
        y = _hit[1];
      // If the hit is new, and therefore the prob for that hit is not yet 0
      if (probs[x][y] !== 0) {
        // Apply the increase to adjacent cells
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

    /* Apply a secondary increase to groups of cells between hits that have a group length, when 
    added to 2, not greater than the greatest remaining ship length */

    /* Reduce the chance of groups of cells that are surrounded by misses or the edge of the board 
    if the group length is not less than or equal to the greatest remaining ship length. */
    checkDeadCells(smallestShipLength);

    /* Ignore cells with a probability of 0 when considering groups of cells to increase efficiency. */

    /* Set the probability of cells with hits and misses to 0 to prevent duplicate attacks. */
  };

  // Method for displaying the probs
  // eslint-disable-next-line no-unused-vars
  var logProbs = function logProbs(probsToLog) {
    // Log the probs
    // eslint-disable-next-line no-console
    console.table(probsToLog);
    // Log the toal of all probs
    // eslint-disable-next-line no-console
    console.log(probsToLog.reduce(function (sum, row) {
      return sum + row.reduce(function (rowSum, value) {
        return rowSum + value;
      }, 0);
    }, 0));
  };

  // logBoard(normalizedBoard);

  return {
    updateProbs: updateProbs,
    probs: probs
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cellProbs);

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
    0: "SP",
    1: "AT",
    2: "VM",
    3: "IG",
    4: "L"
  };
  function randomShipDir() {
    var gameboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : userGameboard;
    var randomNumber = Math.floor(Math.random() * 5);
    while (gameboard.ships[randomNumber].isSunk()) {
      randomNumber = Math.floor(Math.random() * 5);
    }
    return dirNames[randomNumber];
  }

  // Initializes scene image to gen image
  var initScene = function initScene() {
    // get random ship dir
    var shipDir = dirNames[Math.floor(Math.random() * 5)];
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


/* This module allows the various other game modules to communicate and offers
   high level methods to handle various game events. This object will be passed
   to other modules as prop so they can use these methods. */
var gameManager = function gameManager() {
  // Game settings
  var aiDifficulty = 2;

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
    // Log sunk user ships
    var sunkMsg = userBoard.logSunk();
    if (sunkMsg !== null) {
      gameLog.append(sunkMsg);
      // Update log scene
      gameLog.setScene();
    }
    userBoard.logSunk();
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
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2500;
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
          gameLog.erase();
          gameLog.append("Total AI attacks: ".concat(aiAttackCount));
          gameLog.doLock = true;
          return;
        }

        // Allow userBoard to attack again
        userBoard.canAttack = true;

        // If user board is AI controlled have it try an attack
        if (userBoard.isAi === true) {
          aiAttackCount += 1;
          userBoard.tryAiAttack(250);
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
        }, 1000);
      });
    }
  };

  // #endregion

  // Handle setting up an AI vs AI match
  var aiMatchClicked = function aiMatchClicked() {
    // Set user to ai
    userBoard.isAi = userBoard.isAi !== true;
    // Set game log to not update scene
    gameLog.doUpdateScene = false;
    // Set the sounds to muted
    soundPlayer.isMuted = soundPlayer.isMuted !== true;
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

  return {
    aiAttacking: aiAttacking,
    playerAttacking: playerAttacking,
    aiMatchClicked: aiMatchClicked,
    placementClicked: placementClicked,
    randomShipsClicked: randomShipsClicked,
    rotateClicked: rotateClicked,
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
/* This module has three primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
var webInterface = function webInterface(gm) {
  // References to main elements
  var title = document.querySelector(".title");
  var menu = document.querySelector(".menu");
  var placement = document.querySelector(".placement");
  var game = document.querySelector(".game");

  // Reference to btn elements
  var startBtn = document.querySelector(".start-btn");
  var aiMatchBtn = document.querySelector(".ai-match-btn");
  var randomShipsBtn = document.querySelector(".random-ships-btn");
  var rotateBtn = document.querySelector(".rotate-btn");

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
    if (gm.userBoard.isAi === false) aiMatchBtn.classList.add("active");else aiMatchBtn.classList.remove("active");
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

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  aiMatchBtn.addEventListener("click", handleAiMatchClick);
  randomShipsBtn.addEventListener("click", handleRandomShipsClick);
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

/* #endregion */
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"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","sourcesContent":["/* Color Rules */\n:root {\n  --colorA1: #722b94;\n  --colorA2: #a936e0;\n  --colorC: #37e02b;\n  --colorB1: #941d0d;\n  --colorB2: #e0361f;\n\n  --bg-color: hsl(0, 0%, 22%);\n  --bg-color2: hsl(0, 0%, 32%);\n  --text-color: hsl(0, 0%, 91%);\n  --link-color: hsl(36, 92%, 59%);\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.canvas-container {\n  display: grid;\n  grid-template: 1fr / 1fr;\n  width: fit-content;\n  height: fit-content;\n}\n\n.canvas-container > * {\n  grid-row: -1 / 1;\n  grid-column: -1 / 1;\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n  display: grid;\n  place-items: center;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: var(--bg-color2);\n  border-radius: 20px;\n}\n\n.title-text {\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  font-size: 4.8rem;\n  font-weight: bold;\n  text-shadow: 2px 2px 2px var(--colorB1);\n  color: var(--colorB2);\n\n  transition: font-size 0.8s ease-in-out;\n}\n\n.title.shrink {\n  transform: scale(0.5) translateY(-50%);\n}\n\n.title.shrink .title-text {\n  font-size: 3.5rem;\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  display: grid;\n  grid-template: 5% min-content 5% 1fr 5% 1fr 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"credits\"\n    \".\"\n    \"start-game\"\n    \".\"\n    \"ai-match\"\n    \".\"\n    \"options\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.menu.hidden {\n  transform: translateX(-150%);\n}\n\n.menu .credits {\n  grid-area: credits;\n}\n\n.menu .start {\n  grid-area: start-game;\n  align-self: end;\n}\n\n.menu .ai-match {\n  grid-area: ai-match;\n}\n\n.menu .options {\n  grid-area: options;\n  align-self: start;\n}\n\n.menu .start-btn,\n.menu .options-btn,\n.menu .ai-match-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.menu .start-btn:hover,\n.menu .options-btn:hover,\n.menu .ai-match-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.menu .ai-match-btn.active {\n  background-color: var(--colorB1);\n}\n\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 6 / 20;\n\n  display: grid;\n  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr 5% 1fr;\n  place-items: center;\n  grid-template-areas:\n    \". . .\"\n    \"instructions instructions instructions\"\n    \". . .\"\n    \"ships ships ships\"\n    \". . . \"\n    \"random . rotate\"\n    \". . .\"\n    \"canvas canvas canvas\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n}\n\n.placement .instructions {\n  grid-area: instructions;\n}\n\n.placement .instructions-text {\n  font-size: 2.3rem;\n  font-weight: bold;\n  text-shadow: 1px 1px 1px var(--bg-color);\n}\n\n.placement .ships-to-place {\n  grid-area: ships;\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.placement .random-ships {\n  grid-area: random;\n  justify-self: end;\n}\n\n.placement .rotate {\n  grid-area: rotate;\n  justify-self: start;\n}\n\n.placement .rotate-btn,\n.placement .random-ships-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.placement .rotate-btn:hover,\n.placement .random-ships-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.placement .rotate-btn:active,\n.placement .random-ships-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.placement .placement-canvas-container {\n  grid-area: canvas;\n  align-self: start;\n}\n\n.placement.hidden {\n  transform: translateY(150%);\n}\n\n.placement .canvas-container {\n  background-color: var(--colorC);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 5 / 20;\n  display: grid;\n  place-items: center;\n  grid-template:\n    repeat(2, minmax(10px, 1fr) min-content) minmax(10px, 1fr)\n    min-content 1fr / repeat(4, 1fr);\n  grid-template-areas:\n    \". . . .\"\n    \". log log .\"\n    \". . . .\"\n    \"user-board user-board ai-board ai-board\"\n    \". . . .\"\n    \"user-info user-info ai-info ai-info\"\n    \". . . .\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.game .canvas-container {\n  background-color: var(--colorA2);\n}\n\n.game .user-canvas-container {\n  grid-area: user-board;\n}\n\n.game .ai-canvas-container {\n  grid-area: ai-board;\n}\n\n.game .user-info {\n  grid-area: user-info;\n}\n\n.game .ai-info {\n  grid-area: ai-info;\n}\n\n.game .player-ships {\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.game .log {\n  grid-area: log;\n  display: grid;\n  grid-template: 1fr / min-content 10px 1fr;\n  grid-template-areas: \"scene . text\";\n\n  width: 500px;\n\n  border: 3px solid var(--colorB1);\n  border-radius: 6px;\n\n  background-color: var(--bg-color);\n}\n\n.game .log .scene {\n  grid-area: scene;\n\n  height: 150px;\n  width: 150px;\n  background-color: var(--colorB1);\n}\n\n.game .log .scene-img {\n  height: 100%;\n  width: 100%;\n}\n\n.game .log .log-text {\n  grid-area: text;\n  font-size: 1.15rem;\n  white-space: pre; /* Allows for \\n */\n}\n\n.game.hidden {\n  transform: translateX(150%);\n}\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
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
/* harmony import */ var _modules_gameManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/gameManager */ "./src/modules/gameManager.js");
/* harmony import */ var _factories_Player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./factories/Player */ "./src/factories/Player.js");
/* harmony import */ var _helpers_canvasAdder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/canvasAdder */ "./src/helpers/canvasAdder.js");
/* harmony import */ var _modules_webInterface__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/webInterface */ "./src/modules/webInterface.js");
/* harmony import */ var _helpers_placeAiShips__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/placeAiShips */ "./src/helpers/placeAiShips.js");
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/gameLog */ "./src/modules/gameLog.js");
/* harmony import */ var _modules_sounds__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/sounds */ "./src/modules/sounds.js");
/* eslint-disable no-unused-vars */
// Import style sheets



// Import modules








// #region Loading/Init
// Ref to game manager instance
var gm = (0,_modules_gameManager__WEBPACK_IMPORTED_MODULE_2__["default"])();

// Initialize the web interface with gm ref
var webInterface = (0,_modules_webInterface__WEBPACK_IMPORTED_MODULE_5__["default"])(gm);

// Initialize sound module
var soundPlayer = (0,_modules_sounds__WEBPACK_IMPORTED_MODULE_8__["default"])();

// Load scene images for game log
_modules_gameLog__WEBPACK_IMPORTED_MODULE_7__["default"].loadScenes();

// Initialization of Player objects for user and AI
var userPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_3__["default"])(gm); // Create players
var aiPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_3__["default"])(gm);
userPlayer.gameboard.rivalBoard = aiPlayer.gameboard; // Set rival boards
aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
userPlayer.gameboard.isAi = false; // Set ai or not
aiPlayer.gameboard.isAi = true;

// Set gameLog user game board for accurate scenes
_modules_gameLog__WEBPACK_IMPORTED_MODULE_7__["default"].setUserGameboard(userPlayer.gameboard);
// Init game log scene img
_modules_gameLog__WEBPACK_IMPORTED_MODULE_7__["default"].initScene();

// Add the canvas objects now that gameboards are created
var canvases = (0,_helpers_canvasAdder__WEBPACK_IMPORTED_MODULE_4__["default"])(userPlayer.gameboard, aiPlayer.gameboard, webInterface, gm);
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
gm.gameLog = _modules_gameLog__WEBPACK_IMPORTED_MODULE_7__["default"];
// #endregion

// Add ai ships
(0,_helpers_placeAiShips__WEBPACK_IMPORTED_MODULE_6__["default"])(1, aiPlayer.gameboard);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTyw2RkFBNkYsTUFBTSxZQUFZLGFBQWEsYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLFlBQVksTUFBTSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sV0FBVyxZQUFZLE1BQU0sVUFBVSxZQUFZLGNBQWMsV0FBVyxVQUFVLE1BQU0sVUFBVSxLQUFLLFlBQVksV0FBVyxVQUFVLGFBQWEsY0FBYyxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGNBQWMsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxNQUFNLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE9BQU8sVUFBVSxXQUFXLFlBQVksYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsT0FBTyxPQUFPLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxXQUFXLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxRQUFRLGNBQWMsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE1BQU0sVUFBVSxXQUFXLFlBQVksYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLFdBQVcsWUFBWSxNQUFNLFlBQVksYUFBYSxXQUFXLFlBQVksT0FBTyxPQUFPLFlBQVksTUFBTSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFP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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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R3FELFFBQVEsQ0FBQ3pILFFBQVE7QUFDeENsUSxFQUFFLENBQUN1VSx3QkFBd0IsR0FBR29ELFFBQVEsQ0FBQ3hILGVBQWU7O0FBRXREO0FBQ0FuUSxFQUFFLENBQUM0UCxZQUFZLEdBQUdBLFlBQVk7QUFDOUI1UCxFQUFFLENBQUN3VSxXQUFXLEdBQUdBLFdBQVc7QUFDNUJ4VSxFQUFFLENBQUNrUyxPQUFPLEdBQUdBLHdEQUFPO0FBQ3BCOztBQUVBO0FBQ0FQLGlFQUFZLENBQUMsQ0FBQyxFQUFFK0YsUUFBUSxDQUFDM00sU0FBUyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR3JpZENhbnZhcy9HcmlkQ2FudmFzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dyaWRDYW52YXMvZHJhdy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvYWlBdHRhY2svYWlBdHRhY2suanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2FpQXR0YWNrL2NlbGxQcm9icy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvY2FudmFzQWRkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2ltYWdlTG9hZGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9wbGFjZUFpU2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3JhbmRvbVNoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lTG9nLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc291bmRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy93ZWJJbnRlcmZhY2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9yZXNldC5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvcmVzZXQuY3NzPzQ0NWUiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9zdHlsZS5jc3M/YzlmMCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NlbmUtaW1hZ2VzLyBzeW5jIFxcLmpwZyQvIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSBcIi4vU2hpcFwiO1xuaW1wb3J0IGFpQXR0YWNrIGZyb20gXCIuLi9oZWxwZXJzL2FpQXR0YWNrL2FpQXR0YWNrXCI7XG5cbi8qIEZhY3RvcnkgdGhhdCByZXR1cm5zIGEgZ2FtZWJvYXJkIHRoYXQgY2FuIHBsYWNlIHNoaXBzIHdpdGggU2hpcCgpLCByZWNpZXZlIGF0dGFja3MgYmFzZWQgb24gY29vcmRzIFxuICAgYW5kIHRoZW4gZGVjaWRlcyB3aGV0aGVyIHRvIGhpdCgpIGlmIHNoaXAgaXMgaW4gdGhhdCBzcG90LCByZWNvcmRzIGhpdHMgYW5kIG1pc3NlcywgYW5kIHJlcG9ydHMgaWZcbiAgIGFsbCBpdHMgc2hpcHMgaGF2ZSBiZWVuIHN1bmsuICovXG5jb25zdCBHYW1lYm9hcmQgPSAoZ20pID0+IHtcbiAgY29uc3QgdGhpc0dhbWVib2FyZCA9IHtcbiAgICBtYXhCb2FyZFg6IDksXG4gICAgbWF4Qm9hcmRZOiA5LFxuICAgIHNoaXBzOiBbXSxcbiAgICBhbGxPY2N1cGllZENlbGxzOiBbXSxcbiAgICBtaXNzZXM6IFtdLFxuICAgIGhpdHM6IFtdLFxuICAgIGRpcmVjdGlvbjogMSxcbiAgICBoaXRTaGlwVHlwZTogbnVsbCxcbiAgICBpc0FpOiBmYWxzZSxcbiAgICBnYW1lT3ZlcjogZmFsc2UsXG4gICAgY2FuQXR0YWNrOiB0cnVlLFxuICAgIHJpdmFsQm9hcmQ6IG51bGwsXG4gICAgY2FudmFzOiBudWxsLFxuICAgIGFkZFNoaXA6IG51bGwsXG4gICAgcmVjZWl2ZUF0dGFjazogbnVsbCxcbiAgICBhbGxTdW5rOiBudWxsLFxuICAgIGxvZ1N1bms6IG51bGwsXG4gICAgYWxyZWFkeUF0dGFja2VkOiBudWxsLFxuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyBzaGlwIG9jY3VwaWVkIGNlbGwgY29vcmRzXG4gIGNvbnN0IHZhbGlkYXRlU2hpcCA9IChzaGlwKSA9PiB7XG4gICAgaWYgKCFzaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gRmxhZyBmb3IgZGV0ZWN0aW5nIGludmFsaWQgcG9zaXRpb24gdmFsdWVcbiAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG5cbiAgICAvLyBDaGVjayB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzIGFyZSBhbGwgd2l0aGluIG1hcCBhbmQgbm90IGFscmVhZHkgb2NjdXBpZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAub2NjdXBpZWRDZWxscy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgLy8gT24gdGhlIG1hcD9cbiAgICAgIGlmIChcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdIDw9IHRoaXNHYW1lYm9hcmQubWF4Qm9hcmRYICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXSA+PSAwICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXSA8PSB0aGlzR2FtZWJvYXJkLm1heEJvYXJkWVxuICAgICAgKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrIG9jY3VwaWVkIGNlbGxzXG4gICAgICBjb25zdCBpc0NlbGxPY2N1cGllZCA9IHRoaXNHYW1lYm9hcmQuYWxsT2NjdXBpZWRDZWxscy5zb21lKFxuICAgICAgICAoY2VsbCkgPT5cbiAgICAgICAgICAvLyBDb29yZHMgZm91bmQgaW4gYWxsIG9jY3VwaWVkIGNlbGxzIGFscmVhZHlcbiAgICAgICAgICBjZWxsWzBdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gJiZcbiAgICAgICAgICBjZWxsWzFdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV1cbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0NlbGxPY2N1cGllZCkge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrOyAvLyBCcmVhayBvdXQgb2YgdGhlIGxvb3AgaWYgb2NjdXBpZWQgY2VsbCBpcyBmb3VuZFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGFkZHMgb2NjdXBpZWQgY2VsbHMgb2YgdmFsaWQgYm9hdCB0byBsaXN0XG4gIGNvbnN0IGFkZENlbGxzVG9MaXN0ID0gKHNoaXApID0+IHtcbiAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgdGhpc0dhbWVib2FyZC5hbGxPY2N1cGllZENlbGxzLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBhZGRpbmcgYSBzaGlwIGF0IGEgZ2l2ZW4gY29vcmRzIGluIGdpdmVuIGRpcmVjdGlvbiBpZiBzaGlwIHdpbGwgZml0IG9uIGJvYXJkXG4gIHRoaXNHYW1lYm9hcmQuYWRkU2hpcCA9IChcbiAgICBwb3NpdGlvbixcbiAgICBkaXJlY3Rpb24gPSB0aGlzR2FtZWJvYXJkLmRpcmVjdGlvbixcbiAgICBzaGlwVHlwZUluZGV4ID0gdGhpc0dhbWVib2FyZC5zaGlwcy5sZW5ndGggKyAxXG4gICkgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgZGVzaXJlZCBzaGlwXG4gICAgY29uc3QgbmV3U2hpcCA9IFNoaXAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbik7XG4gICAgLy8gQWRkIGl0IHRvIHNoaXBzIGlmIGl0IGhhcyB2YWxpZCBvY2N1cGllZCBjZWxsc1xuICAgIGlmICh2YWxpZGF0ZVNoaXAobmV3U2hpcCkpIHtcbiAgICAgIGFkZENlbGxzVG9MaXN0KG5ld1NoaXApO1xuICAgICAgdGhpc0dhbWVib2FyZC5zaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhZGRNaXNzID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLm1pc3Nlcy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYWRkSGl0ID0gKHBvc2l0aW9uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBtb3N0IHJlY2VudGx5IGhpdCBzaGlwXG4gICAgdGhpc0dhbWVib2FyZC5oaXRTaGlwVHlwZSA9IHNoaXAudHlwZTtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlY2VpdmluZyBhbiBhdHRhY2sgZnJvbSBvcHBvbmVudFxuICB0aGlzR2FtZWJvYXJkLnJlY2VpdmVBdHRhY2sgPSAocG9zaXRpb24sIHNoaXBzID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVmFsaWRhdGUgcG9zaXRpb24gaXMgMiBpbiBhcnJheSBhbmQgc2hpcHMgaXMgYW4gYXJyYXksIGFuZCByaXZhbCBib2FyZCBjYW4gYXR0YWNrXG4gICAgICBpZiAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEVhY2ggc2hpcCBpbiBzaGlwc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gSWYgdGhlIHNoaXAgaXMgbm90IGZhbHN5LCBhbmQgb2NjdXBpZWRDZWxscyBwcm9wIGV4aXN0cyBhbmQgaXMgYW4gYXJyYXlcbiAgICAgICAgICAgIHNoaXBzW2ldICYmXG4gICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzICYmXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBvZiB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIC8vIElmIHRoYXQgY2VsbCBtYXRjaGVzIHRoZSBhdHRhY2sgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzW2pdWzBdID09PSBwb3NpdGlvblswXSAmJlxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMV0gPT09IHBvc2l0aW9uWzFdXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhhdCBzaGlwcyBoaXQgbWV0aG9kIGFuZCBicmVhayBvdXQgb2YgbG9vcFxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIGFkZEhpdChwb3NpdGlvbiwgc2hpcHNbaV0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhZGRNaXNzKHBvc2l0aW9uKTtcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gIC8vIE1ldGhvZCBmb3IgdHJ5aW5nIGFpIGF0dGFja3NcbiAgdGhpc0dhbWVib2FyZC50cnlBaUF0dGFjayA9IChkZWxheSkgPT4ge1xuICAgIC8vIFJldHVybiBpZiBub3QgYWkgb3IgZ2FtZSBpcyBvdmVyXG4gICAgaWYgKHRoaXNHYW1lYm9hcmQuaXNBaSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBhaUF0dGFjayhnbSwgZGVsYXkpO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGRldGVybWluZXMgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIG5vdFxuICB0aGlzR2FtZWJvYXJkLmFsbFN1bmsgPSAoc2hpcEFycmF5ID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT4ge1xuICAgIGlmICghc2hpcEFycmF5IHx8ICFBcnJheS5pc0FycmF5KHNoaXBBcnJheSkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIHNoaXBBcnJheS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcCAmJiBzaGlwLmlzU3VuayAmJiAhc2hpcC5pc1N1bmsoKSkgYWxsU3VuayA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHJldHVybiBhbGxTdW5rO1xuICB9O1xuXG4gIC8vIE9iamVjdCBmb3IgdHJhY2tpbmcgYm9hcmQncyBzdW5rZW4gc2hpcHNcbiAgdGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwcyA9IHtcbiAgICAxOiBmYWxzZSxcbiAgICAyOiBmYWxzZSxcbiAgICAzOiBmYWxzZSxcbiAgICA0OiBmYWxzZSxcbiAgICA1OiBmYWxzZSxcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlcG9ydGluZyBzdW5rZW4gc2hpcHNcbiAgdGhpc0dhbWVib2FyZC5sb2dTdW5rID0gKCkgPT4ge1xuICAgIGxldCBsb2dNc2cgPSBudWxsO1xuICAgIE9iamVjdC5rZXlzKHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzW2tleV0gPT09IGZhbHNlICYmXG4gICAgICAgIHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0uaXNTdW5rKClcbiAgICAgICkge1xuICAgICAgICBjb25zdCBzaGlwID0gdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS50eXBlO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzR2FtZWJvYXJkLmlzQWkgPyBcIkFJJ3NcIiA6IFwiVXNlcidzXCI7XG4gICAgICAgIGxvZ01zZyA9IGA8c3BhbiBzdHlsZT1cImNvbG9yOiByZWRcIj4ke3BsYXllcn0gJHtzaGlwfSB3YXMgZGVzdHJveWVkITwvc3Bhbj5gO1xuICAgICAgICB0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBsb2dNc2c7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBkZXRlcm1pbmluZyBpZiBhIHBvc2l0aW9uIGlzIGFscmVhZHkgYXR0YWNrZWRcbiAgdGhpc0dhbWVib2FyZC5hbHJlYWR5QXR0YWNrZWQgPSAoYXR0YWNrQ29vcmRzKSA9PiB7XG4gICAgbGV0IGF0dGFja2VkID0gZmFsc2U7XG5cbiAgICB0aGlzR2FtZWJvYXJkLmhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBpZiAoYXR0YWNrQ29vcmRzWzBdID09PSBoaXRbMF0gJiYgYXR0YWNrQ29vcmRzWzFdID09PSBoaXRbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpc0dhbWVib2FyZC5taXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xuICAgICAgaWYgKGF0dGFja0Nvb3Jkc1swXSA9PT0gbWlzc1swXSAmJiBhdHRhY2tDb29yZHNbMV0gPT09IG1pc3NbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF0dGFja2VkO1xuICB9O1xuXG4gIHJldHVybiB0aGlzR2FtZWJvYXJkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiLy8gSGVscGVyIG1vZHVsZSBmb3IgZHJhdyBtZXRob2RzXG5pbXBvcnQgZHJhd2luZ01vZHVsZSBmcm9tIFwiLi9kcmF3XCI7XG5cbi8vIEluaXRpYWxpemUgaXRcbmNvbnN0IGRyYXcgPSBkcmF3aW5nTW9kdWxlKCk7XG5cbmNvbnN0IGNyZWF0ZUNhbnZhcyA9IChnbSwgY2FudmFzWCwgY2FudmFzWSwgb3B0aW9ucykgPT4ge1xuICAvLyAjcmVnaW9uIFNldCB1cCBiYXNpYyBlbGVtZW50IHByb3BlcnRpZXNcbiAgLy8gU2V0IHRoZSBncmlkIGhlaWdodCBhbmQgd2lkdGggYW5kIGFkZCByZWYgdG8gY3VycmVudCBjZWxsXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGxldCBjdXJyZW50Q2VsbCA9IG51bGw7XG5cbiAgLy8gQ3JlYXRlIHBhcmVudCBkaXYgdGhhdCBob2xkcyB0aGUgY2FudmFzZXMuIFRoaXMgaXMgdGhlIGVsZW1lbnQgcmV0dXJuZWQuXG4gIGNvbnN0IGNhbnZhc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY2FudmFzLWNvbnRhaW5lclwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGJvYXJkIGNhbnZhcyBlbGVtZW50IHRvIHNlcnZlIGFzIHRoZSBnYW1lYm9hcmQgYmFzZVxuICBjb25zdCBib2FyZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChib2FyZENhbnZhcyk7XG4gIGJvYXJkQ2FudmFzLndpZHRoID0gY2FudmFzWDtcbiAgYm9hcmRDYW52YXMuaGVpZ2h0ID0gY2FudmFzWTtcbiAgY29uc3QgYm9hcmRDdHggPSBib2FyZENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBvdmVybGF5IGNhbnZhcyBmb3IgcmVuZGVyaW5nIHNoaXAgcGxhY2VtZW50IGFuZCBhdHRhY2sgc2VsZWN0aW9uXG4gIGNvbnN0IG92ZXJsYXlDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjYW52YXNDb250YWluZXIuYXBwZW5kQ2hpbGQob3ZlcmxheUNhbnZhcyk7XG4gIG92ZXJsYXlDYW52YXMud2lkdGggPSBjYW52YXNYO1xuICBvdmVybGF5Q2FudmFzLmhlaWdodCA9IGNhbnZhc1k7XG4gIGNvbnN0IG92ZXJsYXlDdHggPSBvdmVybGF5Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBTZXQgdGhlIFwiY2VsbCBzaXplXCIgZm9yIHRoZSBncmlkIHJlcHJlc2VudGVkIGJ5IHRoZSBjYW52YXNcbiAgY29uc3QgY2VsbFNpemVYID0gYm9hcmRDYW52YXMud2lkdGggLyBncmlkV2lkdGg7IC8vIE1vZHVsZSBjb25zdFxuICBjb25zdCBjZWxsU2l6ZVkgPSBib2FyZENhbnZhcy5oZWlnaHQgLyBncmlkSGVpZ2h0OyAvLyBNb2R1bGUgY29uc3RcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBHZW5lcmFsIGhlbHBlciBtZXRob2RzXG4gIC8vIE1ldGhvZCB0aGF0IGdldHMgdGhlIG1vdXNlIHBvc2l0aW9uIGJhc2VkIG9uIHdoYXQgY2VsbCBpdCBpcyBvdmVyXG4gIGNvbnN0IGdldE1vdXNlQ2VsbCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSBib2FyZENhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIGNvbnN0IGNlbGxYID0gTWF0aC5mbG9vcihtb3VzZVggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGNlbGxZID0gTWF0aC5mbG9vcihtb3VzZVkgLyBjZWxsU2l6ZVkpO1xuXG4gICAgcmV0dXJuIFtjZWxsWCwgY2VsbFldO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFzc2lnbiBzdGF0aWMgbWV0aG9kc1xuICAvLyBBZGQgbWV0aG9kcyBvbiB0aGUgY29udGFpbmVyIGZvciBkcmF3aW5nIGhpdHMgb3IgbWlzc2VzXG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3SGl0ID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGRyYXcuaGl0T3JNaXNzKGJvYXJkQ3R4LCBjZWxsU2l6ZVgsIGNlbGxTaXplWSwgY29vcmRpbmF0ZXMsIDEpO1xuICBjYW52YXNDb250YWluZXIuZHJhd01pc3MgPSAoY29vcmRpbmF0ZXMpID0+XG4gICAgZHJhdy5oaXRPck1pc3MoYm9hcmRDdHgsIGNlbGxTaXplWCwgY2VsbFNpemVZLCBjb29yZGluYXRlcywgMCk7XG5cbiAgLy8gQWRkIG1ldGhvZCB0byBjb250YWluZXIgZm9yIHNoaXBzIHRvIGJvYXJkIGNhbnZhc1xuICBjYW52YXNDb250YWluZXIuZHJhd1NoaXBzID0gKHVzZXJTaGlwcyA9IHRydWUpID0+IHtcbiAgICBkcmF3LnNoaXBzKGJvYXJkQ3R4LCBjZWxsU2l6ZVgsIGNlbGxTaXplWSwgZ20sIHVzZXJTaGlwcyk7XG4gIH07XG5cbiAgLy8gb3ZlcmxheUNhbnZhc1xuICAvLyBGb3J3YXJkIGNsaWNrcyB0byBib2FyZCBjYW52YXNcbiAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBuZXdFdmVudCA9IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwge1xuICAgICAgYnViYmxlczogZXZlbnQuYnViYmxlcyxcbiAgICAgIGNhbmNlbGFibGU6IGV2ZW50LmNhbmNlbGFibGUsXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICB9KTtcbiAgICBib2FyZENhbnZhcy5kaXNwYXRjaEV2ZW50KG5ld0V2ZW50KTtcbiAgfTtcblxuICAvLyBNb3VzZWxlYXZlXG4gIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgY3VycmVudENlbGwgPSBudWxsO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFzc2lnbiBiZWhhdmlvciB1c2luZyBicm93c2VyIGV2ZW50IGhhbmRsZXJzIGJhc2VkIG9uIG9wdGlvbnNcbiAgLy8gUGxhY2VtZW50IGlzIHVzZWQgZm9yIHBsYWNpbmcgc2hpcHNcbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJwbGFjZW1lbnRcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBjYW52YXNDb250YWluZXIgdG8gZGVub3RlIHBsYWNlbWVudCBjb250YWluZXJcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIFNldCB1cCBvdmVybGF5Q2FudmFzIHdpdGggYmVoYXZpb3JzIHVuaXF1ZSB0byBwbGFjZW1lbnRcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xuICAgICAgLy8gR2V0IHdoYXQgY2VsbCB0aGUgbW91c2UgaXMgb3ZlclxuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIC8vIElmIHRoZSAnb2xkJyBjdXJyZW50Q2VsbCBpcyBlcXVhbCB0byB0aGUgbW91c2VDZWxsIGJlaW5nIGV2YWx1YXRlZFxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIGN1cnJlbnRDZWxsICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMF0gPT09IG1vdXNlQ2VsbFswXSAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzFdID09PSBtb3VzZUNlbGxbMV1cbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFJlbmRlciB0aGUgY2hhbmdlc1xuICAgICAgICBkcmF3LnBsYWNlbWVudEhpZ2hsaWdodChcbiAgICAgICAgICBvdmVybGF5Q3R4LFxuICAgICAgICAgIGNhbnZhc1gsXG4gICAgICAgICAgY2FudmFzWSxcbiAgICAgICAgICBjZWxsU2l6ZVgsXG4gICAgICAgICAgY2VsbFNpemVZLFxuICAgICAgICAgIG1vdXNlQ2VsbCxcbiAgICAgICAgICBnbVxuICAgICAgICApO1xuICAgICAgICAvLyBoaWdobGlnaHRQbGFjZW1lbnRDZWxscyhtb3VzZUNlbGwpO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIGN1cnJlbnRDZWxsIHRvIHRoZSBtb3VzZUNlbGwgZm9yIGZ1dHVyZSBjb21wYXJpc29uc1xuICAgICAgY3VycmVudENlbGwgPSBtb3VzZUNlbGw7XG4gICAgfTtcblxuICAgIC8vIEJyb3dzZXIgY2xpY2sgZXZlbnRzXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG5cbiAgICAgIC8vIFRyeSBwbGFjZW1lbnRcbiAgICAgIGdtLnBsYWNlbWVudENsaWNrZWQoY2VsbCk7XG4gICAgfTtcbiAgfVxuICAvLyBVc2VyIGNhbnZhcyBmb3IgZGlzcGxheWluZyBhaSBoaXRzIGFuZCBtaXNzZXMgYWdhaW5zdCB1c2VyIGFuZCB1c2VyIHNoaXAgcGxhY2VtZW50c1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09IFwidXNlclwiKSB7XG4gICAgLy8gQWRkIGNsYXNzIHRvIGRlbm90ZSB1c2VyIGNhbnZhc1xuICAgIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidXNlci1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIEhhbmRsZSBjYW52YXMgbW91c2UgbW92ZVxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKCkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH07XG4gICAgLy8gSGFuZGxlIGJvYXJkIG1vdXNlIGNsaWNrXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9ICgpID0+IHtcbiAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9O1xuICB9XG4gIC8vIEFJIGNhbnZhcyBmb3IgZGlzcGxheWluZyB1c2VyIGhpdHMgYW5kIG1pc3NlcyBhZ2FpbnN0IGFpLCBhbmQgYWkgc2hpcCBwbGFjZW1lbnRzIGlmIHVzZXIgbG9zZXNcbiAgZWxzZSBpZiAob3B0aW9ucy50eXBlID09PSBcImFpXCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gZGVub3RlIGFpIGNhbnZhc1xuICAgIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWktY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBIYW5kbGUgY2FudmFzIG1vdXNlIG1vdmVcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xuICAgICAgLy8gR2V0IHdoYXQgY2VsbCB0aGUgbW91c2UgaXMgb3ZlclxuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIC8vIElmIHRoZSAnb2xkJyBjdXJyZW50Q2VsbCBpcyBlcXVhbCB0byB0aGUgbW91c2VDZWxsIGJlaW5nIGV2YWx1YXRlZFxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIGN1cnJlbnRDZWxsICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMF0gPT09IG1vdXNlQ2VsbFswXSAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzFdID09PSBtb3VzZUNlbGxbMV1cbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgY3VycmVudCBjZWxsIGluIHJlZFxuICAgICAgICBkcmF3LmF0dGFja0hpZ2hsaWdodChcbiAgICAgICAgICBvdmVybGF5Q3R4LFxuICAgICAgICAgIGNhbnZhc1gsXG4gICAgICAgICAgY2FudmFzWSxcbiAgICAgICAgICBjZWxsU2l6ZVgsXG4gICAgICAgICAgY2VsbFNpemVZLFxuICAgICAgICAgIG1vdXNlQ2VsbCxcbiAgICAgICAgICBnbVxuICAgICAgICApO1xuICAgICAgICAvLyBoaWdobGlnaHRBdHRhY2sobW91c2VDZWxsKTtcbiAgICAgIH1cbiAgICAgIC8vIERlbm90ZSBpZiBpdCBpcyBhIHZhbGlkIGF0dGFjayBvciBub3QgLSBOWUlcbiAgICB9O1xuICAgIC8vIEhhbmRsZSBib2FyZCBtb3VzZSBjbGlja1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGF0dGFja0Nvb3JkcyA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICBnbS5wbGF5ZXJBdHRhY2tpbmcoYXR0YWNrQ29vcmRzKTtcblxuICAgICAgLy8gQ2xlYXIgdGhlIG92ZXJsYXkgdG8gc2hvdyBoaXQvbWlzcyB1bmRlciBjdXJyZW50IGhpZ2hpZ2h0XG4gICAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gU3Vic2NyaWJlIHRvIGJyb3dzZXIgZXZlbnRzXG4gIC8vIGJvYXJkIGNsaWNrXG4gIGJvYXJkQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayhlKSk7XG4gIC8vIG92ZXJsYXkgY2xpY2tcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUNsaWNrKGUpXG4gICk7XG4gIC8vIG92ZXJsYXkgbW91c2Vtb3ZlXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZShlKVxuICApO1xuICAvLyBvdmVybGF5IG1vdXNlbGVhdmVcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VMZWF2ZSgpXG4gICk7XG5cbiAgLy8gRHJhdyBpbml0aWFsIGJvYXJkIGxpbmVzXG4gIGRyYXcubGluZXMoYm9hcmRDdHgsIGNhbnZhc1gsIGNhbnZhc1kpO1xuXG4gIC8vIFJldHVybiBjb21wbGV0ZWQgY2FudmFzZXNcbiAgcmV0dXJuIGNhbnZhc0NvbnRhaW5lcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNhbnZhcztcbiIsImNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gIC8vIERyYXdzIHRoZSBncmlkIGxpbmVzXG4gIGNvbnN0IGxpbmVzID0gKGNvbnRleHQsIGNhbnZhc1gsIGNhbnZhc1kpID0+IHtcbiAgICAvLyBEcmF3IGdyaWQgbGluZXNcbiAgICBjb25zdCBncmlkU2l6ZSA9IE1hdGgubWluKGNhbnZhc1gsIGNhbnZhc1kpIC8gMTA7XG4gICAgY29uc3QgbGluZUNvbG9yID0gXCJibGFja1wiO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBsaW5lQ29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuXG4gICAgLy8gRHJhdyB2ZXJ0aWNhbCBsaW5lc1xuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IGNhbnZhc1g7IHggKz0gZ3JpZFNpemUpIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyh4LCAwKTtcbiAgICAgIGNvbnRleHQubGluZVRvKHgsIGNhbnZhc1kpO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IGhvcml6b250YWwgbGluZXNcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8PSBjYW52YXNZOyB5ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhjYW52YXNYLCB5KTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIERyYXdzIHRoZSBzaGlwcy4gRGVmYXVsdCBkYXRhIHRvIHVzZSBpcyB1c2VyIHNoaXBzLCBidXQgYWkgY2FuIGJlIHVzZWQgdG9vXG4gIGNvbnN0IHNoaXBzID0gKGNvbnRleHQsIGNlbGxYLCBjZWxsWSwgZ20sIHVzZXJTaGlwcyA9IHRydWUpID0+IHtcbiAgICAvLyBEcmF3IGEgY2VsbCB0byBib2FyZFxuICAgIGZ1bmN0aW9uIGRyYXdDZWxsKHBvc1gsIHBvc1kpIHtcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QocG9zWCAqIGNlbGxYLCBwb3NZICogY2VsbFksIGNlbGxYLCBjZWxsWSk7XG4gICAgfVxuICAgIC8vIFdoaWNoIGJvYXJkIHRvIGdldCBzaGlwcyBkYXRhIGZyb21cbiAgICBjb25zdCBib2FyZCA9IHVzZXJTaGlwcyA9PT0gdHJ1ZSA/IGdtLnVzZXJCb2FyZCA6IGdtLmFpQm9hcmQ7XG4gICAgLy8gRHJhdyB0aGUgY2VsbHMgdG8gdGhlIGJvYXJkXG4gICAgYm9hcmQuc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5vY2N1cGllZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgZHJhd0NlbGwoY2VsbFswXSwgY2VsbFsxXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBEcmF3cyBhIGhpdCBvciBhIG1pc3MgZGVmYXVsdGluZyB0byBhIG1pc3MgaWYgbm8gdHlwZSBwYXNzZWRcbiAgY29uc3QgaGl0T3JNaXNzID0gKGNvbnRleHQsIGNlbGxYLCBjZWxsWSwgbW91c2VDb29yZHMsIHR5cGUgPSAwKSA9PiB7XG4gICAgLy8gU2V0IHByb3BlciBmaWxsIGNvbG9yXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgaWYgKHR5cGUgPT09IDEpIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZWRcIjtcbiAgICAvLyBTZXQgYSByYWRpdXMgZm9yIGNpcmNsZSB0byBkcmF3IGZvciBcInBlZ1wiIHRoYXQgd2lsbCBhbHdheXMgZml0IGluIGNlbGxcbiAgICBjb25zdCByYWRpdXMgPSBjZWxsWCA+IGNlbGxZID8gY2VsbFkgLyAyIDogY2VsbFggLyAyO1xuICAgIC8vIERyYXcgdGhlIGNpcmNsZVxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmMoXG4gICAgICBtb3VzZUNvb3Jkc1swXSAqIGNlbGxYICsgY2VsbFggLyAyLFxuICAgICAgbW91c2VDb29yZHNbMV0gKiBjZWxsWSArIGNlbGxZIC8gMixcbiAgICAgIHJhZGl1cyxcbiAgICAgIDAsXG4gICAgICAyICogTWF0aC5QSVxuICAgICk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfTtcblxuICBjb25zdCBwbGFjZW1lbnRIaWdobGlnaHQgPSAoXG4gICAgY29udGV4dCxcbiAgICBjYW52YXNYLFxuICAgIGNhbnZhc1ksXG4gICAgY2VsbFgsXG4gICAgY2VsbFksXG4gICAgbW91c2VDb29yZHMsXG4gICAgZ21cbiAgKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1gsIGNhbnZhc1kpO1xuICAgIC8vIERyYXcgYSBjZWxsIHRvIG92ZXJsYXlcbiAgICBmdW5jdGlvbiBkcmF3Q2VsbChwb3NYLCBwb3NZKSB7XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KHBvc1ggKiBjZWxsWCwgcG9zWSAqIGNlbGxZLCBjZWxsWCwgY2VsbFkpO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSBjdXJyZW50IHNoaXAgbGVuZ3RoIChiYXNlZCBvbiBkZWZhdWx0IGJhdHRsZXNoaXAgcnVsZXMgc2l6ZXMsIHNtYWxsZXN0IHRvIGJpZ2dlc3QpXG4gICAgbGV0IGRyYXdMZW5ndGg7XG4gICAgY29uc3Qgc2hpcHNDb3VudCA9IGdtLnVzZXJCb2FyZC5zaGlwcy5sZW5ndGg7XG4gICAgaWYgKHNoaXBzQ291bnQgPT09IDApIGRyYXdMZW5ndGggPSAyO1xuICAgIGVsc2UgaWYgKHNoaXBzQ291bnQgPT09IDEgfHwgc2hpcHNDb3VudCA9PT0gMikgZHJhd0xlbmd0aCA9IDM7XG4gICAgZWxzZSBkcmF3TGVuZ3RoID0gc2hpcHNDb3VudCArIDE7XG5cbiAgICAvLyBEZXRlcm1pbmUgZGlyZWN0aW9uIHRvIGRyYXcgaW5cbiAgICBsZXQgZGlyZWN0aW9uWCA9IDA7XG4gICAgbGV0IGRpcmVjdGlvblkgPSAwO1xuXG4gICAgaWYgKGdtLnVzZXJCb2FyZC5kaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgIGRpcmVjdGlvblkgPSAxO1xuICAgICAgZGlyZWN0aW9uWCA9IDA7XG4gICAgfSBlbHNlIGlmIChnbS51c2VyQm9hcmQuZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMDtcbiAgICAgIGRpcmVjdGlvblggPSAxO1xuICAgIH1cblxuICAgIC8vIERpdmlkZSB0aGUgZHJhd0xlbmdodCBpbiBoYWxmIHdpdGggcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZkRyYXdMZW5ndGggPSBNYXRoLmZsb29yKGRyYXdMZW5ndGggLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJMZW5ndGggPSBkcmF3TGVuZ3RoICUgMjtcblxuICAgIC8vIElmIGRyYXdpbmcgb2ZmIGNhbnZhcyBtYWtlIGNvbG9yIHJlZFxuICAgIC8vIENhbGN1bGF0ZSBtYXhpbXVtIGFuZCBtaW5pbXVtIGNvb3JkaW5hdGVzXG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVggPVxuICAgICAgbW91c2VDb29yZHNbMF0gKyAoaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGggLSAxKSAqIGRpcmVjdGlvblg7XG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVkgPVxuICAgICAgbW91c2VDb29yZHNbMV0gKyAoaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGggLSAxKSAqIGRpcmVjdGlvblk7XG4gICAgY29uc3QgbWluQ29vcmRpbmF0ZVggPSBtb3VzZUNvb3Jkc1swXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWDtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWSA9IG1vdXNlQ29vcmRzWzFdIC0gaGFsZkRyYXdMZW5ndGggKiBkaXJlY3Rpb25ZO1xuXG4gICAgLy8gQW5kIHRyYW5zbGF0ZSBpbnRvIGFuIGFjdHVhbCBjYW52YXMgcG9zaXRpb25cbiAgICBjb25zdCBtYXhYID0gbWF4Q29vcmRpbmF0ZVggKiBjZWxsWDtcbiAgICBjb25zdCBtYXhZID0gbWF4Q29vcmRpbmF0ZVkgKiBjZWxsWTtcbiAgICBjb25zdCBtaW5YID0gbWluQ29vcmRpbmF0ZVggKiBjZWxsWDtcbiAgICBjb25zdCBtaW5ZID0gbWluQ29vcmRpbmF0ZVkgKiBjZWxsWTtcblxuICAgIC8vIENoZWNrIGlmIGFueSBjZWxscyBhcmUgb3V0c2lkZSB0aGUgY2FudmFzIGJvdW5kYXJpZXNcbiAgICBjb25zdCBpc091dE9mQm91bmRzID1cbiAgICAgIG1heFggPj0gY2FudmFzWCB8fCBtYXhZID49IGNhbnZhc1kgfHwgbWluWCA8IDAgfHwgbWluWSA8IDA7XG5cbiAgICAvLyBTZXQgdGhlIGZpbGwgY29sb3IgYmFzZWQgb24gd2hldGhlciBjZWxscyBhcmUgZHJhd24gb2ZmIGNhbnZhc1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gaXNPdXRPZkJvdW5kcyA/IFwicmVkXCIgOiBcImJsdWVcIjtcblxuICAgIC8vIERyYXcgdGhlIG1vdXNlZCBvdmVyIGNlbGwgZnJvbSBwYXNzZWQgY29vcmRzXG4gICAgZHJhd0NlbGwobW91c2VDb29yZHNbMF0sIG1vdXNlQ29vcmRzWzFdKTtcblxuICAgIC8vIERyYXcgdGhlIGZpcnN0IGhhbGYgb2YgY2VsbHMgYW5kIHJlbWFpbmRlciBpbiBvbmUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXh0WCA9IG1vdXNlQ29vcmRzWzBdICsgaSAqIGRpcmVjdGlvblg7XG4gICAgICBjb25zdCBuZXh0WSA9IG1vdXNlQ29vcmRzWzFdICsgaSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cblxuICAgIC8vIERyYXcgdGhlIHJlbWFpbmluZyBoYWxmXG4gICAgLy8gRHJhdyB0aGUgcmVtYWluaW5nIGNlbGxzIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZEcmF3TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5leHRYID0gbW91c2VDb29yZHNbMF0gLSAoaSArIDEpICogZGlyZWN0aW9uWDtcbiAgICAgIGNvbnN0IG5leHRZID0gbW91c2VDb29yZHNbMV0gLSAoaSArIDEpICogZGlyZWN0aW9uWTtcbiAgICAgIGRyYXdDZWxsKG5leHRYLCBuZXh0WSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGF0dGFja0hpZ2hsaWdodCA9IChcbiAgICBjb250ZXh0LFxuICAgIGNhbnZhc1gsXG4gICAgY2FudmFzWSxcbiAgICBjZWxsWCxcbiAgICBjZWxsWSxcbiAgICBtb3VzZUNvb3JkcyxcbiAgICBnbVxuICApID0+IHtcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzXG4gICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzWCwgY2FudmFzWSk7XG5cbiAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmVkXCI7XG5cbiAgICAvLyBDaGVjayBpZiBjZWxsIGNvb3JkcyBpbiBnYW1lYm9hcmQgaGl0cyBvciBtaXNzZXNcbiAgICBpZiAoZ20uYWlCb2FyZC5hbHJlYWR5QXR0YWNrZWQobW91c2VDb29yZHMpKSByZXR1cm47XG5cbiAgICAvLyBIaWdobGlnaHQgdGhlIGNlbGxcbiAgICBjb250ZXh0LmZpbGxSZWN0KFxuICAgICAgbW91c2VDb29yZHNbMF0gKiBjZWxsWCxcbiAgICAgIG1vdXNlQ29vcmRzWzFdICogY2VsbFksXG4gICAgICBjZWxsWCxcbiAgICAgIGNlbGxZXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4geyBsaW5lcywgc2hpcHMsIGhpdE9yTWlzcywgcGxhY2VtZW50SGlnaGxpZ2h0LCBhdHRhY2tIaWdobGlnaHQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXc7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL0dhbWVib2FyZFwiO1xuXG4vKiBGYWN0b3J5IHRoYXQgY3JlYXRlcyBhbmQgcmV0dXJucyBhIHBsYXllciBvYmplY3QgdGhhdCBjYW4gdGFrZSBhIHNob3QgYXQgb3Bwb25lbnQncyBnYW1lIGJvYXJkLlxuICAgUmVxdWlyZXMgZ2FtZU1hbmFnZXIgZm9yIGdhbWVib2FyZCBtZXRob2RzICovXG5jb25zdCBQbGF5ZXIgPSAoZ20pID0+IHtcbiAgbGV0IHByaXZhdGVOYW1lID0gXCJcIjtcbiAgY29uc3QgdGhpc1BsYXllciA9IHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBwcml2YXRlTmFtZTtcbiAgICB9LFxuICAgIHNldCBuYW1lKG5ld05hbWUpIHtcbiAgICAgIGlmIChuZXdOYW1lKSB7XG4gICAgICAgIHByaXZhdGVOYW1lID0gbmV3TmFtZS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIHByaXZhdGVOYW1lID0gXCJcIjtcbiAgICB9LFxuICAgIGdhbWVib2FyZDogR2FtZWJvYXJkKGdtKSxcbiAgICBzZW5kQXR0YWNrOiBudWxsLFxuICB9O1xuXG4gIC8vIEhlbHBlciBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhdHRhY2sgcG9zaXRpb24gaXMgb24gYm9hcmRcbiAgY29uc3QgdmFsaWRhdGVBdHRhY2sgPSAocG9zaXRpb24sIGdhbWVib2FyZCkgPT4ge1xuICAgIC8vIERvZXMgZ2FtZWJvYXJkIGV4aXN0IHdpdGggbWF4Qm9hcmRYL3kgcHJvcGVydGllcz9cbiAgICBpZiAoIWdhbWVib2FyZCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBJcyBwb3NpdGlvbiBjb25zdHJhaW5lZCB0byBtYXhib2FyZFgvWSBhbmQgYm90aCBhcmUgaW50cyBpbiBhbiBhcnJheT9cbiAgICBpZiAoXG4gICAgICBwb3NpdGlvbiAmJlxuICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICBwb3NpdGlvblswXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblswXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRYICYmXG4gICAgICBwb3NpdGlvblsxXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblsxXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRZXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3Igc2VuZGluZyBhdHRhY2sgdG8gcml2YWwgZ2FtZWJvYXJkXG4gIHRoaXNQbGF5ZXIuc2VuZEF0dGFjayA9IChwb3NpdGlvbiwgcGxheWVyQm9hcmQgPSB0aGlzUGxheWVyLmdhbWVib2FyZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUF0dGFjayhwb3NpdGlvbiwgcGxheWVyQm9hcmQpKSB7XG4gICAgICBwbGF5ZXJCb2FyZC5yaXZhbEJvYXJkLnJlY2VpdmVBdHRhY2socG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdGhpc1BsYXllcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIENvbnRhaW5zIHRoZSBuYW1lcyBmb3IgdGhlIHNoaXBzIGJhc2VkIG9uIGluZGV4XG5jb25zdCBzaGlwTmFtZXMgPSB7XG4gIDE6IFwiU2VudGluZWwgUHJvYmVcIixcbiAgMjogXCJBc3NhdWx0IFRpdGFuXCIsXG4gIDM6IFwiVmlwZXIgTWVjaFwiLFxuICA0OiBcIklyb24gR29saWF0aFwiLFxuICA1OiBcIkxldmlhdGhhblwiLFxufTtcblxuLy8gRmFjdG9yeSB0aGF0IGNhbiBjcmVhdGUgYW5kIHJldHVybiBvbmUgb2YgYSB2YXJpZXR5IG9mIHByZS1kZXRlcm1pbmVkIHNoaXBzLlxuY29uc3QgU2hpcCA9IChpbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbikgPT4ge1xuICAvLyBWYWxpZGF0ZSBpbmRleFxuICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4ID4gNSB8fCBpbmRleCA8IDEpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzaGlwIG9iamVjdCB0aGF0IHdpbGwgYmUgcmV0dXJuZWRcbiAgY29uc3QgdGhpc1NoaXAgPSB7XG4gICAgaW5kZXgsXG4gICAgc2l6ZTogbnVsbCxcbiAgICB0eXBlOiBudWxsLFxuICAgIGhpdHM6IDAsXG4gICAgaGl0OiBudWxsLFxuICAgIGlzU3VuazogbnVsbCxcbiAgICBvY2N1cGllZENlbGxzOiBbXSxcbiAgfTtcblxuICAvLyBTZXQgc2hpcCBzaXplXG4gIHN3aXRjaCAoaW5kZXgpIHtcbiAgICBjYXNlIDE6XG4gICAgICB0aGlzU2hpcC5zaXplID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSBpbmRleDtcbiAgfVxuXG4gIC8vIFNldCBzaGlwIG5hbWUgYmFzZWQgb24gaW5kZXhcbiAgdGhpc1NoaXAudHlwZSA9IHNoaXBOYW1lc1t0aGlzU2hpcC5pbmRleF07XG5cbiAgLy8gQWRkcyBhIGhpdCB0byB0aGUgc2hpcFxuICB0aGlzU2hpcC5oaXQgPSAoKSA9PiB7XG4gICAgdGhpc1NoaXAuaGl0cyArPSAxO1xuICB9O1xuXG4gIC8vIERldGVybWluZXMgaWYgc2hpcCBzdW5rIGlzIHRydWVcbiAgdGhpc1NoaXAuaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmICh0aGlzU2hpcC5oaXRzID49IHRoaXNTaGlwLnNpemUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBQbGFjZW1lbnQgZGlyZWN0aW9uIGlzIGVpdGhlciAwIGZvciBob3Jpem9udGFsIG9yIDEgZm9yIHZlcnRpY2FsXG4gIGxldCBwbGFjZW1lbnREaXJlY3Rpb25YID0gMDtcbiAgbGV0IHBsYWNlbWVudERpcmVjdGlvblkgPSAwO1xuICBpZiAoZGlyZWN0aW9uID09PSAwKSB7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDE7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDA7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAxKSB7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDA7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDE7XG4gIH1cblxuICAvLyBVc2UgcG9zaXRpb24gYW5kIGRpcmVjdGlvbiB0byBhZGQgb2NjdXBpZWQgY2VsbHMgY29vcmRzXG4gIGlmIChcbiAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAoZGlyZWN0aW9uID09PSAxIHx8IGRpcmVjdGlvbiA9PT0gMClcbiAgKSB7XG4gICAgLy8gRGl2aWRlIGxlbmd0aCBpbnRvIGhhbGYgYW5kIHJlbWFpbmRlclxuICAgIGNvbnN0IGhhbGZTaXplID0gTWF0aC5mbG9vcih0aGlzU2hpcC5zaXplIC8gMik7XG4gICAgY29uc3QgcmVtYWluZGVyU2l6ZSA9IHRoaXNTaGlwLnNpemUgJSAyO1xuICAgIC8vIEFkZCBmaXJzdCBoYWxmIG9mIGNlbGxzIHBsdXMgcmVtYWluZGVyIGluIG9uZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZTaXplICsgcmVtYWluZGVyU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXdDb29yZHMgPSBbXG4gICAgICAgIHBvc2l0aW9uWzBdICsgaSAqIHBsYWNlbWVudERpcmVjdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWzFdICsgaSAqIHBsYWNlbWVudERpcmVjdGlvblksXG4gICAgICBdO1xuICAgICAgdGhpc1NoaXAub2NjdXBpZWRDZWxscy5wdXNoKG5ld0Nvb3Jkcyk7XG4gICAgfVxuICAgIC8vIEFkZCBzZWNvbmQgaGFsZiBvZiBjZWxsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZlNpemU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV3Q29vcmRzID0gW1xuICAgICAgICBwb3NpdGlvblswXSAtIChpICsgMSkgKiBwbGFjZW1lbnREaXJlY3Rpb25YLFxuICAgICAgICBwb3NpdGlvblsxXSAtIChpICsgMSkgKiBwbGFjZW1lbnREaXJlY3Rpb25ZLFxuICAgICAgXTtcbiAgICAgIHRoaXNTaGlwLm9jY3VwaWVkQ2VsbHMucHVzaChuZXdDb29yZHMpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzU2hpcDtcbn07XG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IGNlbGxQcm9icyBmcm9tIFwiLi9jZWxsUHJvYnNcIjtcblxuLy8gTW9kdWxlIHRoYXQgYWxsb3dzIGFpIHRvIG1ha2UgYXR0YWNrcyBiYXNlZCBvbiBwcm9iYWJpbGl0eSBhIGNlbGwgd2lsbCByZXN1bHRcbi8vIGluIGEgaGl0LiBVc2VzIEJheWVzaWFuIGluZmVyZW5jZSBhbG9uZyB3aXRoIHR3byBCYXR0bGVzaGlwIGdhbWUgdGhlb3JpZXMuXG5jb25zdCBwcm9icyA9IGNlbGxQcm9icygpO1xuXG4vLyBUaGlzIGhlbHBlciB3aWxsIGxvb2sgYXQgY3VycmVudCBoaXRzIGFuZCBtaXNzZXMgYW5kIHRoZW4gcmV0dXJuIGFuIGF0dGFja1xuY29uc3QgYWlBdHRhY2sgPSAoZ20sIGRlbGF5KSA9PiB7XG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGxldCBhdHRhY2tDb29yZHMgPSBbXTtcblxuICAvLyBVcGRhdGUgY2VsbCBoaXQgcHJvYmFiaWxpdGllc1xuICBwcm9icy51cGRhdGVQcm9icyhnbSk7XG5cbiAgLy8gTWV0aG9kIGZvciByZXR1cm5pbmcgcmFuZG9tIGF0dGFja1xuICBjb25zdCBmaW5kUmFuZG9tQXR0YWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkV2lkdGgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkSGVpZ2h0KTtcbiAgICBhdHRhY2tDb29yZHMgPSBbeCwgeV07XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZmluZHMgbGFyZ2VzdCB2YWx1ZSBpbiAyZCBhcnJheVxuICBjb25zdCBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGFsbFByb2JzID0gcHJvYnMucHJvYnM7XG4gICAgbGV0IG1heCA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvYnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYWxsUHJvYnNbaV0ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgaWYgKGFsbFByb2JzW2ldW2pdID4gbWF4KSB7XG4gICAgICAgICAgbWF4ID0gYWxsUHJvYnNbaV1bal07XG4gICAgICAgICAgYXR0YWNrQ29vcmRzID0gW2ksIGpdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJhbmRvbSBhdHRhY2sgaWYgYWkgZGlmZmljdWx0eSBpcyAxXG4gIGlmIChnbS5haURpZmZpY3VsdHkgPT09IDEpIHtcbiAgICAvLyBTZXQgcmFuZG9tIGF0dGFjayAgY29vcmRzIHRoYXQgaGF2ZSBub3QgYmVlbiBhdHRhY2tlZFxuICAgIGZpbmRSYW5kb21BdHRhY2soKTtcbiAgICB3aGlsZSAoZ20udXNlckJvYXJkLmFscmVhZHlBdHRhY2tlZChhdHRhY2tDb29yZHMpKSB7XG4gICAgICBmaW5kUmFuZG9tQXR0YWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRG8gYW4gYXR0YWNrIGJhc2VkIG9uIHByb2JhYmlsaXRpZXMgaWYgYWkgZGlmZmljdWx0eSBpcyAyXG4gIGVsc2UgaWYgKGdtLmFpRGlmZmljdWx0eSA9PT0gMikge1xuICAgIGZpbmRHcmVhdGVzdFByb2JBdHRhY2soKTtcbiAgICB3aGlsZSAoZ20udXNlckJvYXJkLmFscmVhZHlBdHRhY2tlZChhdHRhY2tDb29yZHMpKSB7XG4gICAgICBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gU2VuZCBhdHRhY2sgdG8gZ2FtZSBtYW5hZ2VyXG4gIGdtLmFpQXR0YWNraW5nKGF0dGFja0Nvb3JkcywgZGVsYXkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWlBdHRhY2s7XG4iLCJjb25zdCBjZWxsUHJvYnMgPSAoKSA9PiB7XG4gIC8vIFByb2JhYmlsaXR5IG1vZGlmaWVyc1xuICBjb25zdCBjb2xvck1vZCA9IDAuMzM7IC8vIFN0cm9uZyBuZWdhdGl2ZSBiaWFzIHVzZWQgdG8gaW5pdGlhbGl6ZSBhbGwgcHJvYnNcbiAgY29uc3QgYWRqYWNlbnRNb2QgPSA0OyAvLyBNZWRpdW0gcG9zaXRpdmUgYmlhcyBmb3IgaGl0IGFkamFjZW50IGFkanVzdG1lbnRzXG5cbiAgLy8gTWV0aG9kIHRoYXQgY3JlYXRlcyBwcm9icyBhbmQgZGVmaW5lcyBpbml0aWFsIHByb2JhYmlsaXRpZXNcbiAgY29uc3QgY3JlYXRlUHJvYnMgPSAoKSA9PiB7XG4gICAgLy8gQ3JlYXRlIHRoZSBwcm9icy4gSXQgaXMgYSAxMHgxMCBncmlkIG9mIGNlbGxzLlxuICAgIGNvbnN0IGluaXRpYWxQcm9icyA9IFtdO1xuXG4gICAgLy8gUmFuZG9tbHkgZGVjaWRlIHdoaWNoIFwiY29sb3JcIiBvbiB0aGUgcHJvYnMgdG8gZmF2b3IgYnkgcmFuZG9tbHkgaW5pdGlhbGl6aW5nIGNvbG9yIHdlaWdodFxuICAgIGNvbnN0IGluaXRpYWxDb2xvcldlaWdodCA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogY29sb3JNb2Q7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBwcm9icyB3aXRoIDAnc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgICAgaW5pdGlhbFByb2JzLnB1c2goQXJyYXkoMTApLmZpbGwoMCkpO1xuICAgIH1cblxuICAgIC8vIEFzc2lnbiBpbml0aWFsIHByb2JhYmlsaXRpZXMgYmFzZWQgb24gQWxlbWkncyB0aGVvcnkgKDAuMDggaW4gY29ybmVycywgMC4yIGluIDQgY2VudGVyIGNlbGxzKVxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgLy8gT24gZXZlbiByb3dzIHN0YXJ0IHdpdGggYWx0ZXJuYXRlIGNvbG9yIHdlaWdodFxuICAgICAgbGV0IGNvbG9yV2VpZ2h0ID0gaW5pdGlhbENvbG9yV2VpZ2h0O1xuICAgICAgaWYgKHJvdyAlIDIgPT09IDApIHtcbiAgICAgICAgY29sb3JXZWlnaHQgPSBpbml0aWFsQ29sb3JXZWlnaHQgPT09IDEgPyBjb2xvck1vZCA6IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IDQuNTtcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IDQuNTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tQ2VudGVyID0gTWF0aC5zcXJ0KFxuICAgICAgICAgIChyb3cgLSBjZW50ZXJYKSAqKiAyICsgKGNvbCAtIGNlbnRlclkpICoqIDJcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHByb2JhYmlsaXR5IGJhc2VkIG9uIEV1Y2xpZGVhbiBkaXN0YW5jZSBmcm9tIGNlbnRlclxuICAgICAgICBjb25zdCBtaW5Qcm9iYWJpbGl0eSA9IDAuMDg7XG4gICAgICAgIGNvbnN0IG1heFByb2JhYmlsaXR5ID0gMC4yO1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eSA9XG4gICAgICAgICAgbWluUHJvYmFiaWxpdHkgK1xuICAgICAgICAgIChtYXhQcm9iYWJpbGl0eSAtIG1pblByb2JhYmlsaXR5KSAqXG4gICAgICAgICAgICAoMSAtIGRpc3RhbmNlRnJvbUNlbnRlciAvIE1hdGguc3FydCg0LjUgKiogMiArIDQuNSAqKiAyKSk7XG5cbiAgICAgICAgLy8gQWRqdXN0IHRoZSB3ZWlnaHRzIGJhc2VkIG9uIEJhcnJ5J3MgdGhlb3J5IChpZiBwcm9icyBpcyBjaGVja2VyIHByb2JzLCBwcmVmZXIgb25lIGNvbG9yKVxuICAgICAgICBjb25zdCBiYXJyeVByb2JhYmlsaXR5ID0gcHJvYmFiaWxpdHkgKiBjb2xvcldlaWdodDtcblxuICAgICAgICAvLyBBc3NpZ24gcHJvYmFiaWx0eSB0byB0aGUgcHJvYnNcbiAgICAgICAgaW5pdGlhbFByb2JzW3Jvd11bY29sXSA9IGJhcnJ5UHJvYmFiaWxpdHk7XG5cbiAgICAgICAgLy8gRmxpcCB0aGUgY29sb3Igd2VpZ2h0XG4gICAgICAgIGNvbG9yV2VpZ2h0ID0gY29sb3JXZWlnaHQgPT09IDEgPyBjb2xvck1vZCA6IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBpbml0aWFsaXplZCBwcm9ic1xuICAgIHJldHVybiBpbml0aWFsUHJvYnM7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBub3JtYWxpemluZyB0aGUgcHJvYmFiaWxpdGllc1xuICBjb25zdCBub3JtYWxpemVQcm9icyA9IChwcm9icykgPT4ge1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBzdW0gb2YgcHJvYmFiaWxpdGllcyBpbiB0aGUgcHJvYnNcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBwcm9icy5sZW5ndGg7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBwcm9ic1tyb3ddLmxlbmd0aDsgY29sICs9IDEpIHtcbiAgICAgICAgc3VtICs9IHByb2JzW3Jvd11bY29sXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHByb2JhYmlsaXRpZXNcbiAgICBjb25zdCBub3JtYWxpemVkUHJvYnMgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBwcm9icy5sZW5ndGg7IHJvdyArPSAxKSB7XG4gICAgICBub3JtYWxpemVkUHJvYnNbcm93XSA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgcHJvYnNbcm93XS5sZW5ndGg7IGNvbCArPSAxKSB7XG4gICAgICAgIG5vcm1hbGl6ZWRQcm9ic1tyb3ddW2NvbF0gPSBwcm9ic1tyb3ddW2NvbF0gLyBzdW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRQcm9icztcbiAgfTtcblxuICAvLyBDcmVhdGUgdGhlIHByb2JzXG4gIGNvbnN0IG5vbk5vcm1hbGl6ZWRQcm9icyA9IGNyZWF0ZVByb2JzKCk7XG4gIC8vIE5vcm1hbGl6ZSB0aGUgcHJvYmFiaWxpdGllc1xuICBjb25zdCBwcm9icyA9IG5vcm1hbGl6ZVByb2JzKG5vbk5vcm1hbGl6ZWRQcm9icyk7XG5cbiAgLy8gSGVscGVyIG1ldGhvZHMgZm9yIHVwZGF0ZVByb2JzXG4gIGNvbnN0IGhpdEFkamFjZW50SW5jcmVhc2UgPSAoaGl0WCwgaGl0WSwgbGFyZ2VzdExlbmd0aCkgPT4ge1xuICAgIC8vIFZhcnMgZm9yIGNhbGN1bGF0aW5nIGRlY3JlbWVudCBmYWN0b3JcbiAgICBjb25zdCBzdGFydGluZ0RlYyA9IDE7XG4gICAgY29uc3QgZGVjUGVyY2VudGFnZSA9IDAuMTtcbiAgICBjb25zdCBtaW5EZWMgPSAwLjU7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBjZWxscyBhbmQgdXBkYXRlIHRoZW1cbiAgICAvLyBOb3J0aFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFyZ2VzdExlbmd0aDsgaSArPSAxKSB7XG4gICAgICBsZXQgZGVjcmVtZW50RmFjdG9yID0gc3RhcnRpbmdEZWMgLSBpICogZGVjUGVyY2VudGFnZTtcbiAgICAgIGlmIChkZWNyZW1lbnRGYWN0b3IgPCBtaW5EZWMpIGRlY3JlbWVudEZhY3RvciA9IG1pbkRlYztcbiAgICAgIC8vIE5vcnRoIGlmIG9uIGJvYXJkXG4gICAgICBpZiAoaGl0WSAtIGkgPj0gMCkge1xuICAgICAgICBwcm9ic1toaXRYXVtoaXRZIC0gaV0gKj0gYWRqYWNlbnRNb2QgKiBkZWNyZW1lbnRGYWN0b3I7XG4gICAgICB9XG4gICAgICAvLyBTb3V0aCBpZiBvbiBib2FyZFxuICAgICAgaWYgKGhpdFkgKyBpIDw9IDkpIHtcbiAgICAgICAgcHJvYnNbaGl0WF1baGl0WSArIGldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgfVxuICAgICAgLy8gV2VzdCBpZiBvbiBib2FyZFxuICAgICAgaWYgKGhpdFggLSBpID49IDApIHtcbiAgICAgICAgcHJvYnNbaGl0WCAtIGldW2hpdFldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgfVxuICAgICAgLy8gRWFzdCBpZiBvbiBib2FyZFxuICAgICAgaWYgKGhpdFggKyBpIDw9IDkpIHtcbiAgICAgICAgcHJvYnNbaGl0WCArIGldW2hpdFldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja0RlYWRDZWxscyA9ICgpID0+IHtcbiAgICAvLyBTZXQgcm93cyBhbmQgY29sc1xuICAgIGNvbnN0IG51bVJvd3MgPSBwcm9ic1swXS5sZW5ndGg7XG4gICAgY29uc3QgbnVtQ29scyA9IHByb2JzLmxlbmd0aDtcbiAgICAvLyBIZWxwZXIgdGhhdCBjaGVja3MgaWYgdmFsaWQgY2VsbCBvbiBncmlkXG4gICAgZnVuY3Rpb24gaXNWYWxpZENlbGwocm93LCBjb2wpIHtcbiAgICAgIHJldHVybiByb3cgPj0gMCAmJiByb3cgPCBudW1Sb3dzICYmIGNvbCA+PSAwICYmIGNvbCA8IG51bUNvbHM7XG4gICAgfVxuICAgIC8vIEhlbHBlciB0aGF0IGNoZWNrcyBpZiBjZWxsIGlzIGEgYm91bmRhcnkgb3IgbWlzcyAoLTEgdmFsdWUpXG4gICAgZnVuY3Rpb24gaXNCb3VuZGFyeU9yTWlzcyhyb3csIGNvbCkge1xuICAgICAgcmV0dXJuICFpc1ZhbGlkQ2VsbChyb3csIGNvbCkgfHwgcHJvYnNbcm93XVtjb2xdID09PSAtMTtcbiAgICB9XG4gICAgLy8gRm9yIGV2ZXJ5IGNlbGwsIGNoZWNrIHRoZSBjZWxscyBhcm91bmQgaXQuIElmIHRoZXkgYXJlIGFsbCBib3VuZGFyeSBvciBtaXNzIHRoZW4gc2V0IHRvIC0xXG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbnVtUm93czsgcm93ICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IG51bUNvbHM7IGNvbCArPSAxKSB7XG4gICAgICAgIC8vIElmIHRoZSBjZWxsIGlzIGFuIGVtcHR5IGNlbGwgKD4gMCkgYW5kIGFkamFjZW50IGNlbGxzIGFyZSBib3VuZGFyeSBvciBtaXNzXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwcm9ic1tyb3ddW2NvbF0gPiAwICYmXG4gICAgICAgICAgaXNCb3VuZGFyeU9yTWlzcyhyb3csIGNvbCAtIDEpICYmXG4gICAgICAgICAgaXNCb3VuZGFyeU9yTWlzcyhyb3csIGNvbCArIDEpICYmXG4gICAgICAgICAgaXNCb3VuZGFyeU9yTWlzcyhyb3cgLSAxLCBjb2wpICYmXG4gICAgICAgICAgaXNCb3VuZGFyeU9yTWlzcyhyb3cgKyAxLCBjb2wpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIFNldCB0aGF0IGNlbGwgdG8gYSBtaXNzIHNpbmNlIGl0IGNhbm5vdCBiZSBhIGhpdFxuICAgICAgICAgIHByb2JzW3Jvd11bY29sXSA9IC0xO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgYCR7cm93fSwgJHtjb2x9IHN1cnJvdW5kZWQgYW5kIGNhbm5vdCBiZSBhIGhpdC4gU2V0IHRvIG1pc3MuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgdXBkYXRlcyBwcm9iYWJpbGl0aWVzIGJhc2VkIG9uIGhpdHMsIG1pc3NlcywgYW5kIHJlbWFpbmluZyBzaGlwcycgbGVuZ3Roc1xuICBjb25zdCB1cGRhdGVQcm9icyA9IChnbSkgPT4ge1xuICAgIC8vIFRoZXNlIHZhbHVlcyBhcmUgdXNlZCBhcyB0aGUgZXZpZGVuY2UgdG8gdXBkYXRlIHRoZSBwcm9iYWJpbGl0aWVzIG9uIHRoZSBwcm9ic1xuICAgIGNvbnN0IHsgaGl0cywgbWlzc2VzIH0gPSBnbS51c2VyQm9hcmQ7XG4gICAgLy8gTGFyZ2VzdCBzaGlwIGxlbmd0aFxuICAgIGxldCBsYXJnZXN0U2hpcExlbmd0aCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IE9iamVjdC5rZXlzKGdtLnVzZXJCb2FyZC5zdW5rZW5TaGlwcykubGVuZ3RoOyBpID49IDE7IGkgLT0gMSkge1xuICAgICAgaWYgKCFnbS51c2VyQm9hcmQuc3Vua2VuU2hpcHNbaV0pIHtcbiAgICAgICAgbGFyZ2VzdFNoaXBMZW5ndGggPSBpO1xuICAgICAgICBsYXJnZXN0U2hpcExlbmd0aCA9IGkgPT09IDEgPyAyIDogbGFyZ2VzdFNoaXBMZW5ndGg7XG4gICAgICAgIGxhcmdlc3RTaGlwTGVuZ3RoID0gaSA9PT0gMiA/IDMgOiBsYXJnZXN0U2hpcExlbmd0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNtYWxsZXN0IHNoaXAgbGVuZ3RoXG4gICAgbGV0IHNtYWxsZXN0U2hpcExlbmd0aCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyhnbS51c2VyQm9hcmQuc3Vua2VuU2hpcHMpLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoIWdtLnVzZXJCb2FyZC5zdW5rZW5TaGlwc1tpXSkge1xuICAgICAgICBzbWFsbGVzdFNoaXBMZW5ndGggPSBpID09PSAwID8gMiA6IHNtYWxsZXN0U2hpcExlbmd0aDtcbiAgICAgICAgc21hbGxlc3RTaGlwTGVuZ3RoID0gaSA9PT0gMSA/IDMgOiBzbWFsbGVzdFNoaXBMZW5ndGg7XG4gICAgICAgIHNtYWxsZXN0U2hpcExlbmd0aCA9IGkgPiAxID8gaSA6IHNtYWxsZXN0U2hpcExlbmd0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBTbWFsbGVzdCBsZW5ndGg6ICR7c21hbGxlc3RTaGlwTGVuZ3RofWApO1xuXG4gICAgLy8gVXBkYXRlIHZhbHVlcyBiYXNlZCBvbiBoaXRzXG4gICAgT2JqZWN0LnZhbHVlcyhoaXRzKS5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGhpdDtcbiAgICAgIC8vIElmIHRoZSBoaXQgaXMgbmV3LCBhbmQgdGhlcmVmb3JlIHRoZSBwcm9iIGZvciB0aGF0IGhpdCBpcyBub3QgeWV0IDBcbiAgICAgIGlmIChwcm9ic1t4XVt5XSAhPT0gMCkge1xuICAgICAgICAvLyBBcHBseSB0aGUgaW5jcmVhc2UgdG8gYWRqYWNlbnQgY2VsbHNcbiAgICAgICAgaGl0QWRqYWNlbnRJbmNyZWFzZSh4LCB5LCBsYXJnZXN0U2hpcExlbmd0aCk7XG4gICAgICAgIC8vIFNldCB0aGUgcHJvYmFiaWxpdHkgb2YgdGhlIGhpdCB0byAwXG4gICAgICAgIHByb2JzW3hdW3ldID0gMDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB2YWx1ZXMgYmFzZWQgb24gbWlzc2VzXG4gICAgT2JqZWN0LnZhbHVlcyhtaXNzZXMpLmZvckVhY2goKG1pc3MpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IG1pc3M7XG4gICAgICAvLyBTZXQgdGhlIHByb2JhYmlsaXR5IG9mIGV2ZXJ5IG1pc3MgdG8gMCB0byBwcmV2ZW50IHRoYXQgY2VsbCBmcm9tIGJlaW5nIHRhcmdldGVkXG4gICAgICBwcm9ic1t4XVt5XSA9IC0xO1xuICAgIH0pO1xuXG4gICAgLyogQXBwbHkgYSBzZWNvbmRhcnkgaW5jcmVhc2UgdG8gZ3JvdXBzIG9mIGNlbGxzIGJldHdlZW4gaGl0cyB0aGF0IGhhdmUgYSBncm91cCBsZW5ndGgsIHdoZW4gXG4gICAgYWRkZWQgdG8gMiwgbm90IGdyZWF0ZXIgdGhhbiB0aGUgZ3JlYXRlc3QgcmVtYWluaW5nIHNoaXAgbGVuZ3RoICovXG5cbiAgICAvKiBSZWR1Y2UgdGhlIGNoYW5jZSBvZiBncm91cHMgb2YgY2VsbHMgdGhhdCBhcmUgc3Vycm91bmRlZCBieSBtaXNzZXMgb3IgdGhlIGVkZ2Ugb2YgdGhlIGJvYXJkIFxuICAgIGlmIHRoZSBncm91cCBsZW5ndGggaXMgbm90IGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgZ3JlYXRlc3QgcmVtYWluaW5nIHNoaXAgbGVuZ3RoLiAqL1xuICAgIGNoZWNrRGVhZENlbGxzKHNtYWxsZXN0U2hpcExlbmd0aCk7XG5cbiAgICAvKiBJZ25vcmUgY2VsbHMgd2l0aCBhIHByb2JhYmlsaXR5IG9mIDAgd2hlbiBjb25zaWRlcmluZyBncm91cHMgb2YgY2VsbHMgdG8gaW5jcmVhc2UgZWZmaWNpZW5jeS4gKi9cblxuICAgIC8qIFNldCB0aGUgcHJvYmFiaWxpdHkgb2YgY2VsbHMgd2l0aCBoaXRzIGFuZCBtaXNzZXMgdG8gMCB0byBwcmV2ZW50IGR1cGxpY2F0ZSBhdHRhY2tzLiAqL1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgZGlzcGxheWluZyB0aGUgcHJvYnNcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IGxvZ1Byb2JzID0gKHByb2JzVG9Mb2cpID0+IHtcbiAgICAvLyBMb2cgdGhlIHByb2JzXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLnRhYmxlKHByb2JzVG9Mb2cpO1xuICAgIC8vIExvZyB0aGUgdG9hbCBvZiBhbGwgcHJvYnNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgcHJvYnNUb0xvZy5yZWR1Y2UoXG4gICAgICAgIChzdW0sIHJvdykgPT4gc3VtICsgcm93LnJlZHVjZSgocm93U3VtLCB2YWx1ZSkgPT4gcm93U3VtICsgdmFsdWUsIDApLFxuICAgICAgICAwXG4gICAgICApXG4gICAgKTtcbiAgfTtcblxuICAvLyBsb2dCb2FyZChub3JtYWxpemVkQm9hcmQpO1xuXG4gIHJldHVybiB7IHVwZGF0ZVByb2JzLCBwcm9icyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2VsbFByb2JzO1xuIiwiaW1wb3J0IGdyaWRDYW52YXMgZnJvbSBcIi4uL2ZhY3Rvcmllcy9HcmlkQ2FudmFzL0dyaWRDYW52YXNcIjtcblxuLyogVGhpcyBtb2R1bGUgY3JlYXRlcyBjYW52YXMgZWxlbWVudHMgYW5kIGFkZHMgdGhlbSB0byB0aGUgYXBwcm9wcmlhdGUgXG4gICBwbGFjZXMgaW4gdGhlIERPTS4gKi9cbmNvbnN0IGNhbnZhc0FkZGVyID0gKHVzZXJHYW1lYm9hcmQsIGFpR2FtZWJvYXJkLCB3ZWJJbnRlcmZhY2UsIGdtKSA9PiB7XG4gIC8vIFJlcGxhY2UgdGhlIHRocmVlIGdyaWQgcGxhY2Vob2xkZXIgZWxlbWVudHMgd2l0aCB0aGUgcHJvcGVyIGNhbnZhc2VzXG4gIC8vIFJlZnMgdG8gRE9NIGVsZW1lbnRzXG4gIGNvbnN0IHBsYWNlbWVudFBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtY2FudmFzLXBoXCIpO1xuICBjb25zdCB1c2VyUEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVzZXItY2FudmFzLXBoXCIpO1xuICBjb25zdCBhaVBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1jYW52YXMtcGhcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBjYW52YXNlc1xuXG4gIGNvbnN0IHVzZXJDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIGdtLFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcInVzZXJcIiB9LFxuICAgIHVzZXJHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlXG4gICk7XG4gIGNvbnN0IGFpQ2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICBnbSxcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJhaVwiIH0sXG4gICAgYWlHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlXG4gICk7XG4gIGNvbnN0IHBsYWNlbWVudENhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgZ20sXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwicGxhY2VtZW50XCIgfSxcbiAgICB1c2VyR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZSxcbiAgICB1c2VyQ2FudmFzXG4gICk7XG5cbiAgLy8gUmVwbGFjZSB0aGUgcGxhY2UgaG9sZGVyc1xuICBwbGFjZW1lbnRQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwbGFjZW1lbnRDYW52YXMsIHBsYWNlbWVudFBIKTtcbiAgdXNlclBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVzZXJDYW52YXMsIHVzZXJQSCk7XG4gIGFpUEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYWlDYW52YXMsIGFpUEgpO1xuXG4gIC8vIFJldHVybiB0aGUgY2FudmFzZXNcbiAgcmV0dXJuIHsgcGxhY2VtZW50Q2FudmFzLCB1c2VyQ2FudmFzLCBhaUNhbnZhcyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2FudmFzQWRkZXI7XG4iLCJjb25zdCBpbWFnZUxvYWRlciA9ICgpID0+IHtcbiAgY29uc3QgaW1hZ2VSZWZzID0ge1xuICAgIFNQOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBBVDogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgVk06IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIElHOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBMOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgfTtcblxuICBjb25zdCBpbWFnZUNvbnRleHQgPSByZXF1aXJlLmNvbnRleHQoXCIuLi9zY2VuZS1pbWFnZXNcIiwgdHJ1ZSwgL1xcLmpwZyQvaSk7XG4gIGNvbnN0IGZpbGVzID0gaW1hZ2VDb250ZXh0LmtleXMoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gaW1hZ2VDb250ZXh0KGZpbGUpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gZmlsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgY29uc3Qgc3ViRGlyID0gZmlsZS5zcGxpdChcIi9cIilbMV0udG9VcHBlckNhc2UoKTtcblxuICAgIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcImhpdFwiKSkge1xuICAgICAgaW1hZ2VSZWZzW3N1YkRpcl0uaGl0LnB1c2goZmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCJhdHRhY2tcIikpIHtcbiAgICAgIGltYWdlUmVmc1tzdWJEaXJdLmF0dGFjay5wdXNoKGZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGZpbGVOYW1lLmluY2x1ZGVzKFwiZ2VuXCIpKSB7XG4gICAgICBpbWFnZVJlZnNbc3ViRGlyXS5nZW4ucHVzaChmaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGltYWdlUmVmcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGltYWdlTG9hZGVyO1xuIiwiaW1wb3J0IHJhbmRvbVNoaXBzIGZyb20gXCIuL3JhbmRvbVNoaXBzXCI7XG5cbi8vIFRoaXMgaGVscGVyIHdpbGwgYXR0ZW1wdCB0byBhZGQgc2hpcHMgdG8gdGhlIGFpIGdhbWVib2FyZCBpbiBhIHZhcmlldHkgb2Ygd2F5cyBmb3IgdmFyeWluZyBkaWZmaWN1bHR5XG5jb25zdCBwbGFjZUFpU2hpcHMgPSAocGFzc2VkRGlmZiwgYWlHYW1lYm9hcmQpID0+IHtcbiAgLy8gR3JpZCBzaXplXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG5cbiAgLy8gUGxhY2UgYSBzaGlwIGFsb25nIGVkZ2VzIHVudGlsIG9uZSBzdWNjZXNzZnVsbHkgcGxhY2VkID9cbiAgLy8gUGxhY2UgYSBzaGlwIGJhc2VkIG9uIHF1YWRyYW50ID9cblxuICAvLyBDb21iaW5lIHBsYWNlbWVudCB0YWN0aWNzIHRvIGNyZWF0ZSB2YXJ5aW5nIGRpZmZpY3VsdGllc1xuICBjb25zdCBwbGFjZVNoaXBzID0gKGRpZmZpY3VsdHkpID0+IHtcbiAgICAvLyBUb3RhbGx5IHJhbmRvbSBwYWxjZW1lbnRcbiAgICBpZiAoZGlmZmljdWx0eSA9PT0gMSkge1xuICAgICAgLy8gUGxhY2Ugc2hpcHMgcmFuZG9tbHlcbiAgICAgIHJhbmRvbVNoaXBzKGFpR2FtZWJvYXJkLCBncmlkV2lkdGgsIGdyaWRIZWlnaHQpO1xuICAgIH1cbiAgfTtcblxuICBwbGFjZVNoaXBzKHBhc3NlZERpZmYpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGxhY2VBaVNoaXBzO1xuIiwiY29uc3QgcmFuZG9tU2hpcHMgPSAoZ2FtZWJvYXJkLCBncmlkWCwgZ3JpZFkpID0+IHtcbiAgLy8gRXhpdCBmcm9tIHJlY3Vyc2lvblxuICBpZiAoZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCA+IDQpIHJldHVybjtcbiAgLy8gR2V0IHJhbmRvbSBwbGFjZW1lbnRcbiAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRYKTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRZKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcblxuICAvLyBUcnkgdGhlIHBsYWNlbWVudFxuICBnYW1lYm9hcmQuYWRkU2hpcChbeCwgeV0sIGRpcmVjdGlvbik7XG5cbiAgLy8gS2VlcCBkb2luZyBpdCB1bnRpbCBhbGwgc2hpcHMgYXJlIHBsYWNlZFxuICByYW5kb21TaGlwcyhnYW1lYm9hcmQsIGdyaWRYLCBncmlkWSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCByYW5kb21TaGlwcztcbiIsImltcG9ydCBpbWFnZUxvYWRlciBmcm9tIFwiLi4vaGVscGVycy9pbWFnZUxvYWRlclwiO1xuXG5jb25zdCBnYW1lTG9nID0gKCh1c2VyTmFtZSA9IFwiVXNlclwiKSA9PiB7XG4gIC8vIEZsYWcgZm9yIHR1cm5pbmcgb2ZmIHNjZW5lIHVwZGF0ZXNcbiAgbGV0IGRvVXBkYXRlU2NlbmUgPSB0cnVlO1xuICAvLyBGbGFnIGZvciBsb2NraW5nIHRoZSBsb2dcbiAgbGV0IGRvTG9jayA9IGZhbHNlO1xuXG4gIC8vIEFkZCBhIHByb3BlcnR5IHRvIHN0b3JlIHRoZSBnYW1lYm9hcmRcbiAgbGV0IHVzZXJHYW1lYm9hcmQgPSBudWxsO1xuXG4gIC8vIFNldHRlciBtZXRob2QgdG8gc2V0IHRoZSBnYW1lYm9hcmRcbiAgY29uc3Qgc2V0VXNlckdhbWVib2FyZCA9IChnYW1lYm9hcmQpID0+IHtcbiAgICB1c2VyR2FtZWJvYXJkID0gZ2FtZWJvYXJkO1xuICB9O1xuXG4gIC8vIFJlZiB0byBsb2cgdGV4dFxuICBjb25zdCBsb2dUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2ctdGV4dFwiKTtcbiAgY29uc3QgbG9nSW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY2VuZS1pbWdcIik7XG5cbiAgLy8gTG9nIHNjZW5lIGhhbmRsaW5nXG4gIGxldCBzY2VuZUltYWdlcyA9IG51bGw7XG4gIC8vIE1ldGhvZCBmb3IgbG9hZGluZyBzY2VuZSBpbWFnZXMuIE11c3QgYmUgcnVuIG9uY2UgaW4gZ2FtZSBtYW5hZ2VyLlxuICBjb25zdCBsb2FkU2NlbmVzID0gKCkgPT4ge1xuICAgIHNjZW5lSW1hZ2VzID0gaW1hZ2VMb2FkZXIoKTtcbiAgfTtcblxuICAvLyBHZXRzIGEgcmFuZG9tIGFycmF5IGVudHJ5XG4gIGZ1bmN0aW9uIHJhbmRvbUVudHJ5KGFycmF5KSB7XG4gICAgY29uc3QgbGFzdEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobGFzdEluZGV4ICsgMSkpO1xuICAgIHJldHVybiByYW5kb21OdW1iZXI7XG4gIH1cblxuICAvLyBHZXRzIGEgcmFuZG9tIHVzZXIgc2hpcCB0aGF0IGlzbid0IGRlc3Ryb3llZFxuICBjb25zdCBkaXJOYW1lcyA9IHsgMDogXCJTUFwiLCAxOiBcIkFUXCIsIDI6IFwiVk1cIiwgMzogXCJJR1wiLCA0OiBcIkxcIiB9O1xuICBmdW5jdGlvbiByYW5kb21TaGlwRGlyKGdhbWVib2FyZCA9IHVzZXJHYW1lYm9hcmQpIHtcbiAgICBsZXQgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSk7XG4gICAgd2hpbGUgKGdhbWVib2FyZC5zaGlwc1tyYW5kb21OdW1iZXJdLmlzU3VuaygpKSB7XG4gICAgICByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KTtcbiAgICB9XG4gICAgcmV0dXJuIGRpck5hbWVzW3JhbmRvbU51bWJlcl07XG4gIH1cblxuICAvLyBJbml0aWFsaXplcyBzY2VuZSBpbWFnZSB0byBnZW4gaW1hZ2VcbiAgY29uc3QgaW5pdFNjZW5lID0gKCkgPT4ge1xuICAgIC8vIGdldCByYW5kb20gc2hpcCBkaXJcbiAgICBjb25zdCBzaGlwRGlyID0gZGlyTmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldO1xuICAgIC8vIGdldCByYW5kb20gYXJyYXkgZW50cnlcbiAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbik7XG4gICAgLy8gc2V0IHRoZSBpbWFnZVxuICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW5bZW50cnldO1xuICB9O1xuXG4gIC8vIFNldHMgdGhlIHNjZW5lIGltYWdlIGJhc2VkIG9uIHBhcmFtcyBwYXNzZWRcbiAgY29uc3Qgc2V0U2NlbmUgPSAoKSA9PiB7XG4gICAgLy8gUmV0dXJuIGlmIGxvZyBmbGFnIHNldCB0byBub3QgdXBkYXRlXG4gICAgaWYgKCFkb1VwZGF0ZVNjZW5lKSByZXR1cm47XG4gICAgLy8gU2V0IHRoZSB0ZXh0IHRvIGxvd2VyY2FzZSBmb3IgY29tcGFyaXNvblxuICAgIGNvbnN0IGxvZ0xvd2VyID0gbG9nVGV4dC50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gUmVmcyB0byBzaGlwIHR5cGVzIGFuZCB0aGVpciBkaXJzXG4gICAgY29uc3Qgc2hpcFR5cGVzID0gW1wic2VudGluZWxcIiwgXCJhc3NhdWx0XCIsIFwidmlwZXJcIiwgXCJpcm9uXCIsIFwibGV2aWF0aGFuXCJdO1xuICAgIGNvbnN0IHR5cGVUb0RpciA9IHtcbiAgICAgIHNlbnRpbmVsOiBcIlNQXCIsXG4gICAgICBhc3NhdWx0OiBcIkFUXCIsXG4gICAgICB2aXBlcjogXCJWTVwiLFxuICAgICAgaXJvbjogXCJJR1wiLFxuICAgICAgbGV2aWF0aGFuOiBcIkxcIixcbiAgICB9O1xuXG4gICAgLy8gSGVscGVyIGZvciBnZXR0aW5nIHJhbmRvbSBzaGlwIHR5cGUgZnJvbSB0aG9zZSByZW1haW5pbmdcblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiB5b3UgYXR0YWNrIGJhc2VkIG9uIHJlbWFpbmluZyBzaGlwc1xuICAgIGlmIChcbiAgICAgIGxvZ0xvd2VyLmluY2x1ZGVzKHVzZXJOYW1lLnRvTG93ZXJDYXNlKCkpICYmXG4gICAgICBsb2dMb3dlci5pbmNsdWRlcyhcImF0dGFja3NcIilcbiAgICApIHtcbiAgICAgIC8vIEdldCByYW5kb20gc2hpcFxuICAgICAgY29uc3Qgc2hpcERpciA9IHJhbmRvbVNoaXBEaXIoKTtcbiAgICAgIC8vIEdldCByYW5kb20gaW1nIGZyb20gYXBwcm9wcmlhdGUgcGxhY2VcbiAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uYXR0YWNrKTtcbiAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5hdHRhY2tbZW50cnldO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiBzaGlwIGhpdFxuICAgIGlmIChsb2dMb3dlci5pbmNsdWRlcyhcImhpdCB5b3VyXCIpKSB7XG4gICAgICBzaGlwVHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICBpZiAobG9nTG93ZXIuaW5jbHVkZXModHlwZSkpIHtcbiAgICAgICAgICAvLyBTZXQgdGhlIHNoaXAgZGlyZWN0b3J5IGJhc2VkIG9uIHR5cGVcbiAgICAgICAgICBjb25zdCBzaGlwRGlyID0gdHlwZVRvRGlyW3R5cGVdO1xuICAgICAgICAgIC8vIEdldCBhIHJhbmRvbSBoaXQgZW50cnlcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmhpdCk7XG4gICAgICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5oaXRbZW50cnldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGltYWdlIHdoZW4gdGhlcmUgaXMgYW4gYWkgbWlzcyB0byBnZW4gb2YgcmVtYWluaW5nIHNoaXBzXG4gICAgaWYgKGxvZ0xvd2VyLmluY2x1ZGVzKFwiYWkgYXR0YWNrc1wiKSAmJiBsb2dMb3dlci5pbmNsdWRlcyhcIm1pc3NlZFwiKSkge1xuICAgICAgLy8gR2V0IHJhbmRvbSByZW1haW5pbmcgc2hpcCBkaXJcbiAgICAgIGNvbnN0IHNoaXBEaXIgPSByYW5kb21TaGlwRGlyKCk7XG4gICAgICAvLyBHZXQgcmFuZG9tIGVudHJ5IGZyb20gdGhlcmVcbiAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuKTtcbiAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW5bZW50cnldO1xuICAgIH1cbiAgfTtcblxuICAvLyBFcmFzZSB0aGUgbG9nIHRleHRcbiAgY29uc3QgZXJhc2UgPSAoKSA9PiB7XG4gICAgaWYgKGRvTG9jaykgcmV0dXJuO1xuICAgIGxvZ1RleHQudGV4dENvbnRlbnQgPSBcIlwiO1xuICB9O1xuXG4gIC8vIEFkZCB0byBsb2cgdGV4dFxuICBjb25zdCBhcHBlbmQgPSAoc3RyaW5nVG9BcHBlbmQpID0+IHtcbiAgICBpZiAoZG9Mb2NrKSByZXR1cm47XG4gICAgaWYgKHN0cmluZ1RvQXBwZW5kKSB7XG4gICAgICBsb2dUZXh0LmlubmVySFRNTCArPSBgXFxuJHtzdHJpbmdUb0FwcGVuZC50b1N0cmluZygpfWA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZXJhc2UsXG4gICAgYXBwZW5kLFxuICAgIHNldFNjZW5lLFxuICAgIGxvYWRTY2VuZXMsXG4gICAgc2V0VXNlckdhbWVib2FyZCxcbiAgICBpbml0U2NlbmUsXG4gICAgZ2V0IGRvVXBkYXRlU2NlbmUoKSB7XG4gICAgICByZXR1cm4gZG9VcGRhdGVTY2VuZTtcbiAgICB9LFxuICAgIHNldCBkb1VwZGF0ZVNjZW5lKGJvb2wpIHtcbiAgICAgIGlmIChib29sID09PSB0cnVlIHx8IGJvb2wgPT09IGZhbHNlKSB7XG4gICAgICAgIGRvVXBkYXRlU2NlbmUgPSBib29sO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0IGRvTG9jaygpIHtcbiAgICAgIHJldHVybiBkb0xvY2s7XG4gICAgfSxcbiAgICBzZXQgZG9Mb2NrKGJvb2wpIHtcbiAgICAgIGlmIChib29sID09PSB0cnVlIHx8IGJvb2wgPT09IGZhbHNlKSB7XG4gICAgICAgIGRvTG9jayA9IGJvb2w7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVMb2c7XG4iLCJpbXBvcnQgcmFuZG9tU2hpcHMgZnJvbSBcIi4uL2hlbHBlcnMvcmFuZG9tU2hpcHNcIjtcblxuLyogVGhpcyBtb2R1bGUgYWxsb3dzIHRoZSB2YXJpb3VzIG90aGVyIGdhbWUgbW9kdWxlcyB0byBjb21tdW5pY2F0ZSBhbmQgb2ZmZXJzXG4gICBoaWdoIGxldmVsIG1ldGhvZHMgdG8gaGFuZGxlIHZhcmlvdXMgZ2FtZSBldmVudHMuIFRoaXMgb2JqZWN0IHdpbGwgYmUgcGFzc2VkXG4gICB0byBvdGhlciBtb2R1bGVzIGFzIHByb3Agc28gdGhleSBjYW4gdXNlIHRoZXNlIG1ldGhvZHMuICovXG5jb25zdCBnYW1lTWFuYWdlciA9ICgpID0+IHtcbiAgLy8gR2FtZSBzZXR0aW5nc1xuICBsZXQgYWlEaWZmaWN1bHR5ID0gMjtcblxuICAvLyBSZWZzIHRvIHJlbGV2YW50IGdhbWUgb2JqZWN0c1xuICBsZXQgdXNlckJvYXJkID0gbnVsbDtcbiAgbGV0IGFpQm9hcmQgPSBudWxsO1xuICBsZXQgdXNlckNhbnZhc0NvbnRhaW5lciA9IG51bGw7XG4gIGxldCBhaUNhbnZhc0NvbnRhaW5lciA9IG51bGw7XG4gIGxldCBwbGFjZW1lbnRDYW52YXNDb250YWluZXIgPSBudWxsO1xuXG4gIC8vIFJlZnMgdG8gbW9kdWxlc1xuICBsZXQgc291bmRQbGF5ZXIgPSBudWxsO1xuICBsZXQgd2ViSW50ZXJmYWNlID0gbnVsbDtcbiAgbGV0IGdhbWVMb2cgPSBudWxsO1xuXG4gIC8vICNyZWdpb24gSGFuZGxlIEFJIEF0dGFja3NcbiAgLy8gQUkgQXR0YWNrIEhpdFxuICBjb25zdCBhaUF0dGFja0hpdCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAvLyBQbGF5IGhpdCBzb3VuZFxuICAgIHNvdW5kUGxheWVyLnBsYXlIaXQoKTtcbiAgICAvLyBEcmF3IHRoZSBoaXQgdG8gYm9hcmRcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAvLyBMb2cgdGhlIGhpdFxuICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgIGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfSBcXG5BdHRhY2sgaGl0IHlvdXIgJHt1c2VyQm9hcmQuaGl0U2hpcFR5cGV9IWBcbiAgICApO1xuICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgICAvLyBMb2cgc3VuayB1c2VyIHNoaXBzXG4gICAgY29uc3Qgc3Vua01zZyA9IHVzZXJCb2FyZC5sb2dTdW5rKCk7XG4gICAgaWYgKHN1bmtNc2cgIT09IG51bGwpIHtcbiAgICAgIGdhbWVMb2cuYXBwZW5kKHN1bmtNc2cpO1xuICAgICAgLy8gVXBkYXRlIGxvZyBzY2VuZVxuICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgIH1cbiAgICB1c2VyQm9hcmQubG9nU3VuaygpO1xuICAgIC8vIENoZWNrIGlmIEFJIHdvblxuICAgIGlmICh1c2VyQm9hcmQuYWxsU3VuaygpKSB7XG4gICAgICAvLyAnICAgICAgICAnXG4gICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBbGwgVXNlciB1bml0cyBkZXN0cm95ZWQuIFxcbkFJIGRvbWluYW5jZSBpcyBhc3N1cmVkLlwiKTtcbiAgICAgIC8vIFNldCBnYW1lIG92ZXIgb24gYm9hcmRzXG4gICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTsgLy8gQUkgYm9hcmRcbiAgICAgIHVzZXJCb2FyZC5nYW1lT3ZlciA9IHRydWU7IC8vIFVzZXIgYm9hcmRcbiAgICB9XG4gIH07XG5cbiAgLy8gQUkgQXR0YWNrIE1pc3NlZFxuICBjb25zdCBhaUF0dGFja01pc3NlZCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAvLyBQbGF5IHNvdW5kXG4gICAgc291bmRQbGF5ZXIucGxheU1pc3MoKTtcbiAgICAvLyBEcmF3IHRoZSBtaXNzIHRvIGJvYXJkXG4gICAgdXNlckNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgIC8vIExvZyB0aGUgbWlzc1xuICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICBnYW1lTG9nLmFwcGVuZChgQUkgYXR0YWNrcyBjZWxsOiAke2F0dGFja0Nvb3Jkc31cXG5BdHRhY2sgbWlzc2VkIWApO1xuICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgfTtcblxuICAvLyBBSSBpcyBhdHRhY2tpbmdcbiAgbGV0IGFpQXR0YWNrQ291bnQgPSAwO1xuICBjb25zdCBhaUF0dGFja2luZyA9IChhdHRhY2tDb29yZHMsIGRlbGF5ID0gMjUwMCkgPT4ge1xuICAgIC8vIFRpbWVvdXQgdG8gc2ltdWxhdGUgXCJ0aGlua2luZ1wiIGFuZCB0byBtYWtlIGdhbWUgZmVlbCBiZXR0ZXJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIFNlbmQgYXR0YWNrIHRvIHJpdmFsIGJvYXJkXG4gICAgICB1c2VyQm9hcmRcbiAgICAgICAgLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmRzKVxuICAgICAgICAvLyBUaGVuIGRyYXcgaGl0cyBvciBtaXNzZXNcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrSGl0KGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBhaUF0dGFja01pc3NlZChhdHRhY2tDb29yZHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEJyZWFrIG91dCBvZiByZWN1cnNpb24gaWYgZ2FtZSBpcyBvdmVyXG4gICAgICAgICAgaWYgKHVzZXJCb2FyZC5nYW1lT3ZlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoYFRvdGFsIEFJIGF0dGFja3M6ICR7YWlBdHRhY2tDb3VudH1gKTtcbiAgICAgICAgICAgIGdhbWVMb2cuZG9Mb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbGxvdyB1c2VyQm9hcmQgdG8gYXR0YWNrIGFnYWluXG4gICAgICAgICAgdXNlckJvYXJkLmNhbkF0dGFjayA9IHRydWU7XG5cbiAgICAgICAgICAvLyBJZiB1c2VyIGJvYXJkIGlzIEFJIGNvbnRyb2xsZWQgaGF2ZSBpdCB0cnkgYW4gYXR0YWNrXG4gICAgICAgICAgaWYgKHVzZXJCb2FyZC5pc0FpID09PSB0cnVlKSB7XG4gICAgICAgICAgICBhaUF0dGFja0NvdW50ICs9IDE7XG4gICAgICAgICAgICB1c2VyQm9hcmQudHJ5QWlBdHRhY2soMjUwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgUGxheWVyIEF0dGFja3NcbiAgY29uc3QgcGxheWVyQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFJldHVybiBpZiBnYW1lYm9hcmQgY2FuJ3QgYXR0YWNrXG4gICAgaWYgKGFpQm9hcmQucml2YWxCb2FyZC5jYW5BdHRhY2sgPT09IGZhbHNlKSByZXR1cm47XG4gICAgLy8gVHJ5IGF0dGFjayBhdCBjdXJyZW50IGNlbGxcbiAgICBpZiAoYWlCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgLy8gQmFkIHRoaW5nLiBFcnJvciBzb3VuZCBtYXliZS5cbiAgICB9IGVsc2UgaWYgKHVzZXJCb2FyZC5nYW1lT3ZlciA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIFNldCBnYW1lYm9hcmQgdG8gbm90IGJlIGFibGUgdG8gYXR0YWNrXG4gICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gZmFsc2U7XG4gICAgICAvLyBMb2cgdGhlIHNlbnQgYXR0YWNrXG4gICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICBnYW1lTG9nLmFwcGVuZChgVXNlciBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfWApO1xuICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgICAgLy8gUGxheSB0aGUgc291bmRcbiAgICAgIHNvdW5kUGxheWVyLnBsYXlBdHRhY2soKTtcbiAgICAgIC8vIFNlbmQgdGhlIGF0dGFja1xuICAgICAgYWlCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkcykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIFNldCBhIHRpbWVvdXQgZm9yIGRyYW1hdGljIGVmZmVjdFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBBdHRhY2sgaGl0XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gUGxheSBzb3VuZFxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheUhpdCgpO1xuICAgICAgICAgICAgLy8gRHJhdyBoaXQgdG8gYm9hcmRcbiAgICAgICAgICAgIGFpQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAgIC8vIExvZyBoaXRcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIGhpdCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgc3Vua2VuIHNoaXBzXG4gICAgICAgICAgICBjb25zdCBzdW5rTXNnID0gYWlCb2FyZC5sb2dTdW5rKCk7XG4gICAgICAgICAgICBpZiAoc3Vua01zZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChzdW5rTXNnKTtcbiAgICAgICAgICAgICAgLy8gVXBkYXRlIGxvZyBzY2VuZVxuICAgICAgICAgICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHBsYXllciB3b25cbiAgICAgICAgICAgIGlmIChhaUJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgICAgICAgICAgICBcIkFsbCBBSSB1bml0cyBkZXN0cm95ZWQuIFxcbkh1bWFuaXR5IHN1cnZpdmVzIGFub3RoZXIgZGF5Li4uXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgLy8gU2V0IGdhbWVvdmVyIG9uIGJvYXJkc1xuICAgICAgICAgICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBSSBkZXRybWluaW5nIGF0dGFjay4uLlwiKTtcbiAgICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgICBhaUJvYXJkLnRyeUFpQXR0YWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBQbGF5IHNvdW5kXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgICAgICAgICAgLy8gRHJhdyBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgICBhaUNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgICAgICAgICAgLy8gTG9nIG1pc3NcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIG1pc3NlZCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgYWlCb2FyZC50cnlBaUF0dGFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBzZXR0aW5nIHVwIGFuIEFJIHZzIEFJIG1hdGNoXG4gIGNvbnN0IGFpTWF0Y2hDbGlja2VkID0gKCkgPT4ge1xuICAgIC8vIFNldCB1c2VyIHRvIGFpXG4gICAgdXNlckJvYXJkLmlzQWkgPSB1c2VyQm9hcmQuaXNBaSAhPT0gdHJ1ZTtcbiAgICAvLyBTZXQgZ2FtZSBsb2cgdG8gbm90IHVwZGF0ZSBzY2VuZVxuICAgIGdhbWVMb2cuZG9VcGRhdGVTY2VuZSA9IGZhbHNlO1xuICAgIC8vIFNldCB0aGUgc291bmRzIHRvIG11dGVkXG4gICAgc291bmRQbGF5ZXIuaXNNdXRlZCA9IHNvdW5kUGxheWVyLmlzTXV0ZWQgIT09IHRydWU7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgU2hpcCBQbGFjZW1lbnQgYW5kIEdhbWUgU3RhcnRcbiAgLy8gQ2hlY2sgaWYgZ2FtZSBzaG91bGQgc3RhcnQgYWZ0ZXIgcGxhY2VtZW50XG4gIGNvbnN0IHRyeVN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgd2ViSW50ZXJmYWNlLnNob3dHYW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEhhbmRsZSByYW5kb20gc2hpcHMgYnV0dG9uIGNsaWNrXG4gIGNvbnN0IHJhbmRvbVNoaXBzQ2xpY2tlZCA9ICgpID0+IHtcbiAgICByYW5kb21TaGlwcyh1c2VyQm9hcmQsIHVzZXJCb2FyZC5tYXhCb2FyZFgsIHVzZXJCb2FyZC5tYXhCb2FyZFkpO1xuICAgIHVzZXJDYW52YXNDb250YWluZXIuZHJhd1NoaXBzKCk7XG4gICAgdHJ5U3RhcnRHYW1lKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJvdGF0ZSBidXR0b24gY2xpY2tzXG4gIGNvbnN0IHJvdGF0ZUNsaWNrZWQgPSAoKSA9PiB7XG4gICAgdXNlckJvYXJkLmRpcmVjdGlvbiA9IHVzZXJCb2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgICBhaUJvYXJkLmRpcmVjdGlvbiA9IGFpQm9hcmQuZGlyZWN0aW9uID09PSAwID8gMSA6IDA7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VtZW50Q2xpY2tlZCA9IChjZWxsKSA9PiB7XG4gICAgLy8gVHJ5IHBsYWNlbWVudFxuICAgIHVzZXJCb2FyZC5hZGRTaGlwKGNlbGwpO1xuICAgIHBsYWNlbWVudENhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMoKTtcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdTaGlwcygpO1xuICAgIHRyeVN0YXJ0R2FtZSgpO1xuICB9O1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgcmV0dXJuIHtcbiAgICBhaUF0dGFja2luZyxcbiAgICBwbGF5ZXJBdHRhY2tpbmcsXG4gICAgYWlNYXRjaENsaWNrZWQsXG4gICAgcGxhY2VtZW50Q2xpY2tlZCxcbiAgICByYW5kb21TaGlwc0NsaWNrZWQsXG4gICAgcm90YXRlQ2xpY2tlZCxcbiAgICBnZXQgYWlEaWZmaWN1bHR5KCkge1xuICAgICAgcmV0dXJuIGFpRGlmZmljdWx0eTtcbiAgICB9LFxuICAgIHNldCBhaURpZmZpY3VsdHkoZGlmZikge1xuICAgICAgaWYgKGRpZmYgPT09IDEgfHwgZGlmZiA9PT0gMiB8fCBkaWZmID09PSAzKSBhaURpZmZpY3VsdHkgPSBkaWZmO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJCb2FyZCgpIHtcbiAgICAgIHJldHVybiB1c2VyQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgdXNlckJvYXJkKGJvYXJkKSB7XG4gICAgICB1c2VyQm9hcmQgPSBib2FyZDtcbiAgICB9LFxuICAgIGdldCBhaUJvYXJkKCkge1xuICAgICAgcmV0dXJuIGFpQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgYWlCb2FyZChib2FyZCkge1xuICAgICAgYWlCb2FyZCA9IGJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJDYW52YXNDb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gdXNlckNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCB1c2VyQ2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgdXNlckNhbnZhc0NvbnRhaW5lciA9IGNhbnZhcztcbiAgICB9LFxuICAgIGdldCBhaUNhbnZhc0NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBhaUNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCBhaUNhbnZhc0NvbnRhaW5lcihjYW52YXMpIHtcbiAgICAgIGFpQ2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHBsYWNlbWVudENhbnZhc2NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBwbGFjZW1lbnRDYW52YXNDb250YWluZXI7XG4gICAgfSxcbiAgICBzZXQgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHNvdW5kUGxheWVyKCkge1xuICAgICAgcmV0dXJuIHNvdW5kUGxheWVyO1xuICAgIH0sXG4gICAgc2V0IHNvdW5kUGxheWVyKGFNb2R1bGUpIHtcbiAgICAgIHNvdW5kUGxheWVyID0gYU1vZHVsZTtcbiAgICB9LFxuICAgIGdldCB3ZWJJbnRlcmZhY2UoKSB7XG4gICAgICByZXR1cm4gd2ViSW50ZXJmYWNlO1xuICAgIH0sXG4gICAgc2V0IHdlYkludGVyZmFjZShhTW9kdWxlKSB7XG4gICAgICB3ZWJJbnRlcmZhY2UgPSBhTW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGdhbWVMb2coKSB7XG4gICAgICByZXR1cm4gZ2FtZUxvZztcbiAgICB9LFxuICAgIHNldCBnYW1lTG9nKGFNb2R1bGUpIHtcbiAgICAgIGdhbWVMb2cgPSBhTW9kdWxlO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTWFuYWdlcjtcbiIsImltcG9ydCBoaXRTb3VuZCBmcm9tIFwiLi4vU291bmQgRWZmZWN0cy9leHBsb3Npb24ubXAzXCI7XG5pbXBvcnQgbWlzc1NvdW5kIGZyb20gXCIuLi9Tb3VuZCBFZmZlY3RzL21pc3MubXAzXCI7XG5pbXBvcnQgYXR0YWNrU291bmQgZnJvbSBcIi4uL1NvdW5kIEVmZmVjdHMvbGFzZXIubXAzXCI7XG5cbmNvbnN0IGF0dGFja0F1ZGlvID0gbmV3IEF1ZGlvKGF0dGFja1NvdW5kKTtcbmNvbnN0IGhpdEF1ZGlvID0gbmV3IEF1ZGlvKGhpdFNvdW5kKTtcbmNvbnN0IG1pc3NBdWRpbyA9IG5ldyBBdWRpbyhtaXNzU291bmQpO1xuXG5jb25zdCBzb3VuZHMgPSAoKSA9PiB7XG4gIC8vIEZsYWcgZm9yIG11dGluZ1xuICBsZXQgaXNNdXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHBsYXlIaXQgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBoaXRBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgaGl0QXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlNaXNzID0gKCkgPT4ge1xuICAgIGlmIChpc011dGVkKSByZXR1cm47XG4gICAgLy8gUmVzZXQgYXVkaW8gdG8gYmVnaW5uaW5nIGFuZCBwbGF5IGl0XG4gICAgbWlzc0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICBtaXNzQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlBdHRhY2sgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBhdHRhY2tBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgYXR0YWNrQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxheUhpdCxcbiAgICBwbGF5TWlzcyxcbiAgICBwbGF5QXR0YWNrLFxuICAgIGdldCBpc011dGVkKCkge1xuICAgICAgcmV0dXJuIGlzTXV0ZWQ7XG4gICAgfSxcbiAgICBzZXQgaXNNdXRlZChib29sKSB7XG4gICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSkgaXNNdXRlZCA9IGJvb2w7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvdW5kcztcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vKiBUaGlzIG1vZHVsZSBoYXMgdGhyZWUgcHJpbWFyeSBmdW5jdGlvbnM6XG4gICAxLiBHZXQgc2hpcCBwbGFjZW1lbnQgY29vcmRpbmF0ZXMgZnJvbSB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciBjbGlja3Mgb24gdGhlIHdlYiBpbnRlcmZhY2VcbiAgIDIuIEdldCBhdHRhY2sgcGxhY2VtZW50IGNvb3JkaW5hdGVzIGZyb20gdGhlIHVzZXIgYmFzZWQgb24gdGhlIHNhbWVcbiAgIDMuIE90aGVyIG1pbm9yIGludGVyZmFjZSBhY3Rpb25zIHN1Y2ggYXMgaGFuZGxpbmcgYnV0dG9uIGNsaWNrcyAoc3RhcnQgZ2FtZSwgcmVzdGFydCwgZXRjKSAqL1xuY29uc3Qgd2ViSW50ZXJmYWNlID0gKGdtKSA9PiB7XG4gIC8vIFJlZmVyZW5jZXMgdG8gbWFpbiBlbGVtZW50c1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XG4gIGNvbnN0IHBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50XCIpO1xuICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuXG4gIC8vIFJlZmVyZW5jZSB0byBidG4gZWxlbWVudHNcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0LWJ0blwiKTtcbiAgY29uc3QgYWlNYXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktbWF0Y2gtYnRuXCIpO1xuXG4gIGNvbnN0IHJhbmRvbVNoaXBzQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yYW5kb20tc2hpcHMtYnRuXCIpO1xuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idG5cIik7XG5cbiAgLy8gTWV0aG9kIGZvciBpdGVyYXRpbmcgdGhyb3VnaCBkaXJlY3Rpb25zXG4gIGNvbnN0IHJvdGF0ZURpcmVjdGlvbiA9ICgpID0+IHtcbiAgICBnbS5yb3RhdGVDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBCYXNpYyBtZXRob2RzIGZvciBzaG93aW5nL2hpZGluZyBlbGVtZW50c1xuICAvLyBNb3ZlIGFueSBhY3RpdmUgc2VjdGlvbnMgb2ZmIHRoZSBzY3JlZW5cbiAgY29uc3QgaGlkZUFsbCA9ICgpID0+IHtcbiAgICBtZW51LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgcGxhY2VtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZ2FtZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIG1lbnUgVUlcbiAgY29uc3Qgc2hvd01lbnUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIG1lbnUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBzaGlwIHBsYWNlbWVudCBVSVxuICBjb25zdCBzaG93UGxhY2VtZW50ID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBnYW1lIFVJXG4gIGNvbnN0IHNob3dHYW1lID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQWlNYXRjaENsaWNrID0gKCkgPT4ge1xuICAgIC8vIFNldCBzdHlsZSBjbGFzcyBiYXNlZCBvbiBpZiB1c2VyQm9hcmQgaXMgYWkgKGlmIGZhbHNlLCBzZXQgYWN0aXZlIGIvYyB3aWxsIGJlIHRydWUgYWZ0ZXIgY2xpY2spXG4gICAgaWYgKGdtLnVzZXJCb2FyZC5pc0FpID09PSBmYWxzZSkgYWlNYXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGVsc2UgYWlNYXRjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIGdtLmFpTWF0Y2hDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJhbmRvbSBzaGlwcyBidXR0b24gY2xpY2tcbiAgY29uc3QgaGFuZGxlUmFuZG9tU2hpcHNDbGljayA9ICgpID0+IHtcbiAgICBnbS5yYW5kb21TaGlwc0NsaWNrZWQoKTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBZGQgY2xhc3NlcyB0byBzaGlwIGRpdnMgdG8gcmVwcmVzZW50IHBsYWNlZC9kZXN0cm95ZWRcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gSGFuZGxlIGJyb3dzZXIgZXZlbnRzXG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUm90YXRlQ2xpY2spO1xuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU3RhcnRDbGljayk7XG4gIGFpTWF0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUFpTWF0Y2hDbGljayk7XG4gIHJhbmRvbVNoaXBzQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVSYW5kb21TaGlwc0NsaWNrKTtcblxuICByZXR1cm4geyBzaG93R2FtZSwgc2hvd01lbnUsIHNob3dQbGFjZW1lbnQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdlYkludGVyZmFjZTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcbiAgIHYyLjAgfCAyMDExMDEyNlxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcbiovXG5cbmh0bWwsXG5ib2R5LFxuZGl2LFxuc3BhbixcbmFwcGxldCxcbm9iamVjdCxcbmlmcmFtZSxcbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnAsXG5ibG9ja3F1b3RlLFxucHJlLFxuYSxcbmFiYnIsXG5hY3JvbnltLFxuYWRkcmVzcyxcbmJpZyxcbmNpdGUsXG5jb2RlLFxuZGVsLFxuZGZuLFxuZW0sXG5pbWcsXG5pbnMsXG5rYmQsXG5xLFxucyxcbnNhbXAsXG5zbWFsbCxcbnN0cmlrZSxcbnN0cm9uZyxcbnN1YixcbnN1cCxcbnR0LFxudmFyLFxuYixcbnUsXG5pLFxuY2VudGVyLFxuZGwsXG5kdCxcbmRkLFxub2wsXG51bCxcbmxpLFxuZmllbGRzZXQsXG5mb3JtLFxubGFiZWwsXG5sZWdlbmQsXG50YWJsZSxcbmNhcHRpb24sXG50Ym9keSxcbnRmb290LFxudGhlYWQsXG50cixcbnRoLFxudGQsXG5hcnRpY2xlLFxuYXNpZGUsXG5jYW52YXMsXG5kZXRhaWxzLFxuZW1iZWQsXG5maWd1cmUsXG5maWdjYXB0aW9uLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbm91dHB1dCxcbnJ1YnksXG5zZWN0aW9uLFxuc3VtbWFyeSxcbnRpbWUsXG5tYXJrLFxuYXVkaW8sXG52aWRlbyB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyOiAwO1xuICBmb250LXNpemU6IDEwMCU7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cbmFydGljbGUsXG5hc2lkZSxcbmRldGFpbHMsXG5maWdjYXB0aW9uLFxuZmlndXJlLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbnNlY3Rpb24ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cbmJvZHkge1xuICBsaW5lLWhlaWdodDogMTtcbn1cbm9sLFxudWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuYmxvY2txdW90ZSxcbnEge1xuICBxdW90ZXM6IG5vbmU7XG59XG5ibG9ja3F1b3RlOmJlZm9yZSxcbmJsb2NrcXVvdGU6YWZ0ZXIsXG5xOmJlZm9yZSxcbnE6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBjb250ZW50OiBub25lO1xufVxudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlL3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0NBR0M7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlGRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLFNBQVM7RUFDVCxlQUFlO0VBQ2YsYUFBYTtFQUNiLHdCQUF3QjtBQUMxQjtBQUNBLGdEQUFnRDtBQUNoRDs7Ozs7Ozs7Ozs7RUFXRSxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCO0FBQ0E7O0VBRUUsZ0JBQWdCO0FBQ2xCO0FBQ0E7O0VBRUUsWUFBWTtBQUNkO0FBQ0E7Ozs7RUFJRSxXQUFXO0VBQ1gsYUFBYTtBQUNmO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIsaUJBQWlCO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxcbiAgIHYyLjAgfCAyMDExMDEyNlxcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXFxuKi9cXG5cXG5odG1sLFxcbmJvZHksXFxuZGl2LFxcbnNwYW4sXFxuYXBwbGV0LFxcbm9iamVjdCxcXG5pZnJhbWUsXFxuaDEsXFxuaDIsXFxuaDMsXFxuaDQsXFxuaDUsXFxuaDYsXFxucCxcXG5ibG9ja3F1b3RlLFxcbnByZSxcXG5hLFxcbmFiYnIsXFxuYWNyb255bSxcXG5hZGRyZXNzLFxcbmJpZyxcXG5jaXRlLFxcbmNvZGUsXFxuZGVsLFxcbmRmbixcXG5lbSxcXG5pbWcsXFxuaW5zLFxcbmtiZCxcXG5xLFxcbnMsXFxuc2FtcCxcXG5zbWFsbCxcXG5zdHJpa2UsXFxuc3Ryb25nLFxcbnN1YixcXG5zdXAsXFxudHQsXFxudmFyLFxcbmIsXFxudSxcXG5pLFxcbmNlbnRlcixcXG5kbCxcXG5kdCxcXG5kZCxcXG5vbCxcXG51bCxcXG5saSxcXG5maWVsZHNldCxcXG5mb3JtLFxcbmxhYmVsLFxcbmxlZ2VuZCxcXG50YWJsZSxcXG5jYXB0aW9uLFxcbnRib2R5LFxcbnRmb290LFxcbnRoZWFkLFxcbnRyLFxcbnRoLFxcbnRkLFxcbmFydGljbGUsXFxuYXNpZGUsXFxuY2FudmFzLFxcbmRldGFpbHMsXFxuZW1iZWQsXFxuZmlndXJlLFxcbmZpZ2NhcHRpb24sXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxub3V0cHV0LFxcbnJ1YnksXFxuc2VjdGlvbixcXG5zdW1tYXJ5LFxcbnRpbWUsXFxubWFyayxcXG5hdWRpbyxcXG52aWRlbyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xcbmFydGljbGUsXFxuYXNpZGUsXFxuZGV0YWlscyxcXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5ib2R5IHtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5vbCxcXG51bCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlLFxcbnEge1xcbiAgcXVvdGVzOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlOmJlZm9yZSxcXG5ibG9ja3F1b3RlOmFmdGVyLFxcbnE6YmVmb3JlLFxcbnE6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBjb250ZW50OiBub25lO1xcbn1cXG50YWJsZSB7XFxuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogQ29sb3IgUnVsZXMgKi9cbjpyb290IHtcbiAgLS1jb2xvckExOiAjNzIyYjk0O1xuICAtLWNvbG9yQTI6ICNhOTM2ZTA7XG4gIC0tY29sb3JDOiAjMzdlMDJiO1xuICAtLWNvbG9yQjE6ICM5NDFkMGQ7XG4gIC0tY29sb3JCMjogI2UwMzYxZjtcblxuICAtLWJnLWNvbG9yOiBoc2woMCwgMCUsIDIyJSk7XG4gIC0tYmctY29sb3IyOiBoc2woMCwgMCUsIDMyJSk7XG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xuICAtLWxpbmstY29sb3I6IGhzbCgzNiwgOTIlLCA1OSUpO1xufVxuXG4vKiAjcmVnaW9uIFVuaXZlcnNhbCBlbGVtZW50IHJ1bGVzICovXG5hIHtcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xufVxuXG5ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIGhlaWdodDogMTAwdmg7XG4gIHdpZHRoOiAxMDB2dztcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbn1cblxuLmNhbnZhcy1jb250YWluZXIge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbiAgaGVpZ2h0OiBmaXQtY29udGVudDtcbn1cblxuLmNhbnZhcy1jb250YWluZXIgPiAqIHtcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcbiAgZ3JpZC1jb2x1bW46IC0xIC8gMTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIG1haW4tY29udGVudCAqL1xuLm1haW4tY29udGVudCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyMCwgNSUpIC8gcmVwZWF0KDIwLCA1JSk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vKiB0aXRsZSBncmlkICovXG4udGl0bGUge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogMiAvIDY7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuOHMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcbn1cblxuLnRpdGxlLXRleHQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXNpemU6IDQuOHJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDJweCB2YXIoLS1jb2xvckIxKTtcbiAgY29sb3I6IHZhcigtLWNvbG9yQjIpO1xuXG4gIHRyYW5zaXRpb246IGZvbnQtc2l6ZSAwLjhzIGVhc2UtaW4tb3V0O1xufVxuXG4udGl0bGUuc2hyaW5rIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjUpIHRyYW5zbGF0ZVkoLTUwJSk7XG59XG5cbi50aXRsZS5zaHJpbmsgLnRpdGxlLXRleHQge1xuICBmb250LXNpemU6IDMuNXJlbTtcbn1cbi8qICNyZWdpb24gbWVudSBzZWN0aW9uICovXG4ubWVudSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiA4IC8gMTg7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgNSUgMWZyIDUlIDFmciA1JSAxZnIgLyAxZnI7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuXCJcbiAgICBcImNyZWRpdHNcIlxuICAgIFwiLlwiXG4gICAgXCJzdGFydC1nYW1lXCJcbiAgICBcIi5cIlxuICAgIFwiYWktbWF0Y2hcIlxuICAgIFwiLlwiXG4gICAgXCJvcHRpb25zXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5tZW51LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XG59XG5cbi5tZW51IC5jcmVkaXRzIHtcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xufVxuXG4ubWVudSAuc3RhcnQge1xuICBncmlkLWFyZWE6IHN0YXJ0LWdhbWU7XG4gIGFsaWduLXNlbGY6IGVuZDtcbn1cblxuLm1lbnUgLmFpLW1hdGNoIHtcbiAgZ3JpZC1hcmVhOiBhaS1tYXRjaDtcbn1cblxuLm1lbnUgLm9wdGlvbnMge1xuICBncmlkLWFyZWE6IG9wdGlvbnM7XG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xufVxuXG4ubWVudSAuc3RhcnQtYnRuLFxuLm1lbnUgLm9wdGlvbnMtYnRuLFxuLm1lbnUgLmFpLW1hdGNoLWJ0biB7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDE4MHB4O1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxuLm1lbnUgLm9wdGlvbnMtYnRuOmhvdmVyLFxuLm1lbnUgLmFpLW1hdGNoLWJ0bjpob3ZlciB7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ubWVudSAuYWktbWF0Y2gtYnRuLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQjEpO1xufVxuXG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cbi5wbGFjZW1lbnQge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogNiAvIDIwO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgNSUgbWluLWNvbnRlbnQgNSUgLyAxZnIgNSUgMWZyO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxuICAgIFwiLiAuIC5cIlxuICAgIFwiaW5zdHJ1Y3Rpb25zIGluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnNcIlxuICAgIFwiLiAuIC5cIlxuICAgIFwic2hpcHMgc2hpcHMgc2hpcHNcIlxuICAgIFwiLiAuIC4gXCJcbiAgICBcInJhbmRvbSAuIHJvdGF0ZVwiXG4gICAgXCIuIC4gLlwiXG4gICAgXCJjYW52YXMgY2FudmFzIGNhbnZhc1wiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xufVxuXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMge1xuICBncmlkLWFyZWE6IGluc3RydWN0aW9ucztcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zLXRleHQge1xuICBmb250LXNpemU6IDIuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XG59XG5cbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcbiAgZ3JpZC1hcmVhOiBzaGlwcztcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcbn1cblxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzIHtcbiAgZ3JpZC1hcmVhOiByYW5kb207XG4gIGp1c3RpZnktc2VsZjogZW5kO1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUge1xuICBncmlkLWFyZWE6IHJvdGF0ZTtcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bixcbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcy1idG4ge1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxODBweDtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3Zlcixcbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcy1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUsXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmFjdGl2ZSB7XG4gIHRleHQtc2hhZG93OiA0cHggNHB4IDFweCB2YXIoLS1jb2xvckMpLCAtNHB4IC00cHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ucGxhY2VtZW50IC5wbGFjZW1lbnQtY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogY2FudmFzO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLnBsYWNlbWVudC5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTUwJSk7XG59XG5cbi5wbGFjZW1lbnQgLmNhbnZhcy1jb250YWluZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckMpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIGdhbWUgc2VjdGlvbiAqL1xuLmdhbWUge1xuICBncmlkLWNvbHVtbjogMiAvIDIwO1xuICBncmlkLXJvdzogNSAvIDIwO1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlOlxuICAgIHJlcGVhdCgyLCBtaW5tYXgoMTBweCwgMWZyKSBtaW4tY29udGVudCkgbWlubWF4KDEwcHgsIDFmcilcbiAgICBtaW4tY29udGVudCAxZnIgLyByZXBlYXQoNCwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwiLiBsb2cgbG9nIC5cIlxuICAgIFwiLiAuIC4gLlwiXG4gICAgXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcIlxuICAgIFwiLiAuIC4gLlwiXG4gICAgXCJ1c2VyLWluZm8gdXNlci1pbmZvIGFpLWluZm8gYWktaW5mb1wiXG4gICAgXCIuIC4gLiAuXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5nYW1lIC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG59XG5cbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XG59XG5cbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiBhaS1ib2FyZDtcbn1cblxuLmdhbWUgLnVzZXItaW5mbyB7XG4gIGdyaWQtYXJlYTogdXNlci1pbmZvO1xufVxuXG4uZ2FtZSAuYWktaW5mbyB7XG4gIGdyaWQtYXJlYTogYWktaW5mbztcbn1cblxuLmdhbWUgLnBsYXllci1zaGlwcyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5nYW1lIC5sb2cge1xuICBncmlkLWFyZWE6IGxvZztcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gbWluLWNvbnRlbnQgMTBweCAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFwic2NlbmUgLiB0ZXh0XCI7XG5cbiAgd2lkdGg6IDUwMHB4O1xuXG4gIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWNvbG9yQjEpO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xufVxuXG4uZ2FtZSAubG9nIC5zY2VuZSB7XG4gIGdyaWQtYXJlYTogc2NlbmU7XG5cbiAgaGVpZ2h0OiAxNTBweDtcbiAgd2lkdGg6IDE1MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcbn1cblxuLmdhbWUgLmxvZyAuc2NlbmUtaW1nIHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmdhbWUgLmxvZyAubG9nLXRleHQge1xuICBncmlkLWFyZWE6IHRleHQ7XG4gIGZvbnQtc2l6ZTogMS4xNXJlbTtcbiAgd2hpdGUtc3BhY2U6IHByZTsgLyogQWxsb3dzIGZvciBcXFxcbiAqL1xufVxuXG4uZ2FtZS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTUwJSk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNlbmRyZWdpb24gKi9cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxnQkFBZ0I7QUFDaEI7RUFDRSxrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsa0JBQWtCOztFQUVsQiwyQkFBMkI7RUFDM0IsNEJBQTRCO0VBQzVCLDZCQUE2QjtFQUM3QiwrQkFBK0I7QUFDakM7O0FBRUEsb0NBQW9DO0FBQ3BDO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsaUNBQWlDO0VBQ2pDLHdCQUF3QjtFQUN4QixhQUFhO0VBQ2IsWUFBWTtFQUNaLGdCQUFnQjs7RUFFaEIseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHdCQUF3QjtFQUN4QixrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtBQUNyQjs7QUFFQSxlQUFlOztBQUVmLHlCQUF5QjtBQUN6QjtFQUNFLGFBQWE7RUFDYiw4Q0FBOEM7RUFDOUMsa0JBQWtCOztFQUVsQixZQUFZO0VBQ1osV0FBVztBQUNiOztBQUVBLGVBQWU7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QUVBO0VBQ0UsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7RUFDbEIsZ0JBQWdCLEVBQUUsa0JBQWtCO0FBQ3RDOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCO0FBQ0EsZUFBZTs7QUFFZixlQUFlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIENvbG9yIFJ1bGVzICovXFxuOnJvb3Qge1xcbiAgLS1jb2xvckExOiAjNzIyYjk0O1xcbiAgLS1jb2xvckEyOiAjYTkzNmUwO1xcbiAgLS1jb2xvckM6ICMzN2UwMmI7XFxuICAtLWNvbG9yQjE6ICM5NDFkMGQ7XFxuICAtLWNvbG9yQjI6ICNlMDM2MWY7XFxuXFxuICAtLWJnLWNvbG9yOiBoc2woMCwgMCUsIDIyJSk7XFxuICAtLWJnLWNvbG9yMjogaHNsKDAsIDAlLCAzMiUpO1xcbiAgLS10ZXh0LWNvbG9yOiBoc2woMCwgMCUsIDkxJSk7XFxuICAtLWxpbmstY29sb3I6IGhzbCgzNiwgOTIlLCA1OSUpO1xcbn1cXG5cXG4vKiAjcmVnaW9uIFVuaXZlcnNhbCBlbGVtZW50IHJ1bGVzICovXFxuYSB7XFxuICBjb2xvcjogdmFyKC0tbGluay1jb2xvcik7XFxufVxcblxcbmJvZHkge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuXFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG59XFxuXFxuLmNhbnZhcy1jb250YWluZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIDFmcjtcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5jYW52YXMtY29udGFpbmVyID4gKiB7XFxuICBncmlkLXJvdzogLTEgLyAxO1xcbiAgZ3JpZC1jb2x1bW46IC0xIC8gMTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXFxuLm1haW4tY29udGVudCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4vKiB0aXRsZSBncmlkICovXFxuLnRpdGxlIHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogMiAvIDY7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcblxcbi50aXRsZS10ZXh0IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogNC44cmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggdmFyKC0tY29sb3JCMSk7XFxuICBjb2xvcjogdmFyKC0tY29sb3JCMik7XFxuXFxuICB0cmFuc2l0aW9uOiBmb250LXNpemUgMC44cyBlYXNlLWluLW91dDtcXG59XFxuXFxuLnRpdGxlLnNocmluayB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDAuNSkgdHJhbnNsYXRlWSgtNTAlKTtcXG59XFxuXFxuLnRpdGxlLnNocmluayAudGl0bGUtdGV4dCB7XFxuICBmb250LXNpemU6IDMuNXJlbTtcXG59XFxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cXG4ubWVudSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDggLyAxODtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCA1JSAxZnIgNSUgMWZyIDUlIDFmciAvIDFmcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcImNyZWRpdHNcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwic3RhcnQtZ2FtZVxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJhaS1tYXRjaFxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJvcHRpb25zXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4ubWVudS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xNTAlKTtcXG59XFxuXFxuLm1lbnUgLmNyZWRpdHMge1xcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xcbn1cXG5cXG4ubWVudSAuc3RhcnQge1xcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xcbiAgYWxpZ24tc2VsZjogZW5kO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gge1xcbiAgZ3JpZC1hcmVhOiBhaS1tYXRjaDtcXG59XFxuXFxuLm1lbnUgLm9wdGlvbnMge1xcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG4sXFxuLm1lbnUgLm9wdGlvbnMtYnRuLFxcbi5tZW51IC5haS1tYXRjaC1idG4ge1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgd2lkdGg6IDE4MHB4O1xcblxcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxcbi5tZW51IC5vcHRpb25zLWJ0bjpob3ZlcixcXG4ubWVudSAuYWktbWF0Y2gtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gtYnRuLmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cXG4ucGxhY2VtZW50IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogNiAvIDIwO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgNSUgbWluLWNvbnRlbnQgNSUgLyAxZnIgNSUgMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLlxcXCJcXG4gICAgXFxcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXFxcIlxcbiAgICBcXFwiLiAuIC5cXFwiXFxuICAgIFxcXCJzaGlwcyBzaGlwcyBzaGlwc1xcXCJcXG4gICAgXFxcIi4gLiAuIFxcXCJcXG4gICAgXFxcInJhbmRvbSAuIHJvdGF0ZVxcXCJcXG4gICAgXFxcIi4gLiAuXFxcIlxcbiAgICBcXFwiY2FudmFzIGNhbnZhcyBjYW52YXNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcXG4gIGdyaWQtYXJlYTogaW5zdHJ1Y3Rpb25zO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMtdGV4dCB7XFxuICBmb250LXNpemU6IDIuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMXB4IHZhcigtLWJnLWNvbG9yKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuc2hpcHMtdG8tcGxhY2Uge1xcbiAgZ3JpZC1hcmVhOiBzaGlwcztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMge1xcbiAgZ3JpZC1hcmVhOiByYW5kb207XFxuICBqdXN0aWZ5LXNlbGY6IGVuZDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlIHtcXG4gIGdyaWQtYXJlYTogcm90YXRlO1xcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bixcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3ZlcixcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmFjdGl2ZSxcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmFjdGl2ZSB7XFxuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiBjYW52YXM7XFxuICBhbGlnbi1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudC5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQyk7XFxufVxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIGdhbWUgc2VjdGlvbiAqL1xcbi5nYW1lIHtcXG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XFxuICBncmlkLXJvdzogNSAvIDIwO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlOlxcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXFxuICAgIG1pbi1jb250ZW50IDFmciAvIHJlcGVhdCg0LCAxZnIpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCIuIGxvZyBsb2cgLlxcXCJcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG59XFxuXFxuLmdhbWUgLnVzZXItY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XFxufVxcblxcbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XFxufVxcblxcbi5nYW1lIC51c2VyLWluZm8ge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWluZm87XFxufVxcblxcbi5nYW1lIC5haS1pbmZvIHtcXG4gIGdyaWQtYXJlYTogYWktaW5mbztcXG59XFxuXFxuLmdhbWUgLnBsYXllci1zaGlwcyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLmdhbWUgLmxvZyB7XFxuICBncmlkLWFyZWE6IGxvZztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyBtaW4tY29udGVudCAxMHB4IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFxcXCJzY2VuZSAuIHRleHRcXFwiO1xcblxcbiAgd2lkdGg6IDUwMHB4O1xcblxcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tY29sb3JCMSk7XFxuICBib3JkZXItcmFkaXVzOiA2cHg7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lIHtcXG4gIGdyaWQtYXJlYTogc2NlbmU7XFxuXFxuICBoZWlnaHQ6IDE1MHB4O1xcbiAgd2lkdGg6IDE1MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lLWltZyB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLmdhbWUgLmxvZyAubG9nLXRleHQge1xcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xcbiAgZm9udC1zaXplOiAxLjE1cmVtO1xcbiAgd2hpdGUtc3BhY2U6IHByZTsgLyogQWxsb3dzIGZvciBcXFxcbiAqL1xcbn1cXG5cXG4uZ2FtZS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vQVQvYXRfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrMS5qcGdcIixcblx0XCIuL0FUL2F0X2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazIuanBnXCIsXG5cdFwiLi9BVC9hdF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vQVQvYXRfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrNC5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjEuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW4yLmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuMy5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjQuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQxLmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0Mi5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDMuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQ0LmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0NS5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazEuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2syLmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrMy5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazQuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW4xLmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuMi5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjMuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW40LmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuNS5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDEuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQyLmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0My5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDQuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQ1LmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0Ni5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0Ni5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMS5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMi5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMy5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrNC5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2s1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrNS5qcGdcIixcblx0XCIuL0wvbF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMS5qcGdcIixcblx0XCIuL0wvbF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMi5qcGdcIixcblx0XCIuL0wvbF9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMy5qcGdcIixcblx0XCIuL0wvbF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuNC5qcGdcIixcblx0XCIuL0wvbF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0MS5qcGdcIixcblx0XCIuL0wvbF9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0Mi5qcGdcIixcblx0XCIuL0wvbF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0My5qcGdcIixcblx0XCIuL0wvbF9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0NS5qcGdcIixcblx0XCIuL0wvbGdlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbGdlbjUuanBnXCIsXG5cdFwiLi9ML2xoaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xoaXQ0LmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrMS5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazIuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrNC5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjEuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW4yLmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuMy5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjQuanBnXCIsXG5cdFwiLi9TUC9zcF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9oaXQxLmpwZ1wiLFxuXHRcIi4vU1Avc3BfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfaGl0Mi5qcGdcIixcblx0XCIuL1NQL3NwX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2hpdDMuanBnXCIsXG5cdFwiLi9WTS9tdl9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS9tdl9oaXQ1LmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrMS5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazIuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrNC5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazUuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2s2LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2s2LmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuMS5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjIuanBnXCIsXG5cdFwiLi9WTS92bV9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW4zLmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuNC5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjUuanBnXCIsXG5cdFwiLi9WTS92bV9nZW42LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW42LmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0MS5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDIuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQzLmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0NC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvc2NlbmUtaW1hZ2VzIHN5bmMgcmVjdXJzaXZlIFxcXFwuanBnJC9cIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBJbXBvcnQgc3R5bGUgc2hlZXRzXG5pbXBvcnQgXCIuL3N0eWxlL3Jlc2V0LmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZS9zdHlsZS5jc3NcIjtcblxuLy8gSW1wb3J0IG1vZHVsZXNcbmltcG9ydCBnYW1lTWFuYWdlciBmcm9tIFwiLi9tb2R1bGVzL2dhbWVNYW5hZ2VyXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL2ZhY3Rvcmllcy9QbGF5ZXJcIjtcbmltcG9ydCBjYW52YXNBZGRlciBmcm9tIFwiLi9oZWxwZXJzL2NhbnZhc0FkZGVyXCI7XG5pbXBvcnQgd2ViSW50IGZyb20gXCIuL21vZHVsZXMvd2ViSW50ZXJmYWNlXCI7XG5pbXBvcnQgcGxhY2VBaVNoaXBzIGZyb20gXCIuL2hlbHBlcnMvcGxhY2VBaVNoaXBzXCI7XG5pbXBvcnQgZ2FtZUxvZyBmcm9tIFwiLi9tb2R1bGVzL2dhbWVMb2dcIjtcbmltcG9ydCBzb3VuZHMgZnJvbSBcIi4vbW9kdWxlcy9zb3VuZHNcIjtcblxuLy8gI3JlZ2lvbiBMb2FkaW5nL0luaXRcbi8vIFJlZiB0byBnYW1lIG1hbmFnZXIgaW5zdGFuY2VcbmNvbnN0IGdtID0gZ2FtZU1hbmFnZXIoKTtcblxuLy8gSW5pdGlhbGl6ZSB0aGUgd2ViIGludGVyZmFjZSB3aXRoIGdtIHJlZlxuY29uc3Qgd2ViSW50ZXJmYWNlID0gd2ViSW50KGdtKTtcblxuLy8gSW5pdGlhbGl6ZSBzb3VuZCBtb2R1bGVcbmNvbnN0IHNvdW5kUGxheWVyID0gc291bmRzKCk7XG5cbi8vIExvYWQgc2NlbmUgaW1hZ2VzIGZvciBnYW1lIGxvZ1xuZ2FtZUxvZy5sb2FkU2NlbmVzKCk7XG5cbi8vIEluaXRpYWxpemF0aW9uIG9mIFBsYXllciBvYmplY3RzIGZvciB1c2VyIGFuZCBBSVxuY29uc3QgdXNlclBsYXllciA9IFBsYXllcihnbSk7IC8vIENyZWF0ZSBwbGF5ZXJzXG5jb25zdCBhaVBsYXllciA9IFBsYXllcihnbSk7XG51c2VyUGxheWVyLmdhbWVib2FyZC5yaXZhbEJvYXJkID0gYWlQbGF5ZXIuZ2FtZWJvYXJkOyAvLyBTZXQgcml2YWwgYm9hcmRzXG5haVBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IHVzZXJQbGF5ZXIuZ2FtZWJvYXJkO1xudXNlclBsYXllci5nYW1lYm9hcmQuaXNBaSA9IGZhbHNlOyAvLyBTZXQgYWkgb3Igbm90XG5haVBsYXllci5nYW1lYm9hcmQuaXNBaSA9IHRydWU7XG5cbi8vIFNldCBnYW1lTG9nIHVzZXIgZ2FtZSBib2FyZCBmb3IgYWNjdXJhdGUgc2NlbmVzXG5nYW1lTG9nLnNldFVzZXJHYW1lYm9hcmQodXNlclBsYXllci5nYW1lYm9hcmQpO1xuLy8gSW5pdCBnYW1lIGxvZyBzY2VuZSBpbWdcbmdhbWVMb2cuaW5pdFNjZW5lKCk7XG5cbi8vIEFkZCB0aGUgY2FudmFzIG9iamVjdHMgbm93IHRoYXQgZ2FtZWJvYXJkcyBhcmUgY3JlYXRlZFxuY29uc3QgY2FudmFzZXMgPSBjYW52YXNBZGRlcihcbiAgdXNlclBsYXllci5nYW1lYm9hcmQsXG4gIGFpUGxheWVyLmdhbWVib2FyZCxcbiAgd2ViSW50ZXJmYWNlLFxuICBnbVxuKTtcbi8vIEFkZCBjYW52YXNlcyB0byBnYW1lYm9hcmRzXG51c2VyUGxheWVyLmdhbWVib2FyZC5jYW52YXMgPSBjYW52YXNlcy51c2VyQ2FudmFzO1xuYWlQbGF5ZXIuZ2FtZWJvYXJkLmNhbnZhcyA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuXG4vLyBBZGQgYm9hcmRzIGFuZCBjYW52YXNlcyB0byBnYW1lTWFuYWdlclxuZ20udXNlckJvYXJkID0gdXNlclBsYXllci5nYW1lYm9hcmQ7XG5nbS5haUJvYXJkID0gYWlQbGF5ZXIuZ2FtZWJvYXJkO1xuZ20udXNlckNhbnZhc0NvbnRhaW5lciA9IGNhbnZhc2VzLnVzZXJDYW52YXM7XG5nbS5haUNhbnZhc0NvbnRhaW5lciA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuZ20ucGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzZXMucGxhY2VtZW50Q2FudmFzO1xuXG4vLyBBZGQgbW9kdWxlcyB0byBnYW1lTWFuYWdlclxuZ20ud2ViSW50ZXJmYWNlID0gd2ViSW50ZXJmYWNlO1xuZ20uc291bmRQbGF5ZXIgPSBzb3VuZFBsYXllcjtcbmdtLmdhbWVMb2cgPSBnYW1lTG9nO1xuLy8gI2VuZHJlZ2lvblxuXG4vLyBBZGQgYWkgc2hpcHNcbnBsYWNlQWlTaGlwcygxLCBhaVBsYXllci5nYW1lYm9hcmQpO1xuIl0sIm5hbWVzIjpbIlNoaXAiLCJhaUF0dGFjayIsIkdhbWVib2FyZCIsImdtIiwidGhpc0dhbWVib2FyZCIsIm1heEJvYXJkWCIsIm1heEJvYXJkWSIsInNoaXBzIiwiYWxsT2NjdXBpZWRDZWxscyIsIm1pc3NlcyIsImhpdHMiLCJkaXJlY3Rpb24iLCJoaXRTaGlwVHlwZSIsImlzQWkiLCJnYW1lT3ZlciIsImNhbkF0dGFjayIsInJpdmFsQm9hcmQiLCJjYW52YXMiLCJhZGRTaGlwIiwicmVjZWl2ZUF0dGFjayIsImFsbFN1bmsiLCJsb2dTdW5rIiwiYWxyZWFkeUF0dGFja2VkIiwidmFsaWRhdGVTaGlwIiwic2hpcCIsImlzVmFsaWQiLCJfbG9vcCIsImkiLCJvY2N1cGllZENlbGxzIiwiaXNDZWxsT2NjdXBpZWQiLCJzb21lIiwiY2VsbCIsImxlbmd0aCIsIl9yZXQiLCJhZGRDZWxsc1RvTGlzdCIsImZvckVhY2giLCJwdXNoIiwicG9zaXRpb24iLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJzaGlwVHlwZUluZGV4IiwibmV3U2hpcCIsImFkZE1pc3MiLCJhZGRIaXQiLCJ0eXBlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJBcnJheSIsImlzQXJyYXkiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJqIiwiaGl0IiwidHJ5QWlBdHRhY2siLCJkZWxheSIsInNoaXBBcnJheSIsImlzU3VuayIsInN1bmtlblNoaXBzIiwibG9nTXNnIiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInBsYXllciIsImNvbmNhdCIsImF0dGFja0Nvb3JkcyIsImF0dGFja2VkIiwibWlzcyIsImRyYXdpbmdNb2R1bGUiLCJkcmF3IiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzWCIsImNhbnZhc1kiLCJvcHRpb25zIiwiZ3JpZEhlaWdodCIsImdyaWRXaWR0aCIsImN1cnJlbnRDZWxsIiwiY2FudmFzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9hcmRDYW52YXMiLCJhcHBlbmRDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9hcmRDdHgiLCJnZXRDb250ZXh0Iiwib3ZlcmxheUNhbnZhcyIsIm92ZXJsYXlDdHgiLCJjZWxsU2l6ZVgiLCJjZWxsU2l6ZVkiLCJnZXRNb3VzZUNlbGwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJtb3VzZVgiLCJjbGllbnRYIiwibGVmdCIsIm1vdXNlWSIsImNsaWVudFkiLCJ0b3AiLCJjZWxsWCIsIk1hdGgiLCJmbG9vciIsImNlbGxZIiwiZHJhd0hpdCIsImNvb3JkaW5hdGVzIiwiaGl0T3JNaXNzIiwiZHJhd01pc3MiLCJkcmF3U2hpcHMiLCJ1c2VyU2hpcHMiLCJoYW5kbGVNb3VzZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVNb3VzZUxlYXZlIiwiY2xlYXJSZWN0IiwiaGFuZGxlTW91c2VNb3ZlIiwibW91c2VDZWxsIiwicGxhY2VtZW50SGlnaGxpZ2h0IiwicGxhY2VtZW50Q2xpY2tlZCIsImF0dGFja0hpZ2hsaWdodCIsInBsYXllckF0dGFja2luZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibGluZXMiLCJjb250ZXh0IiwiZ3JpZFNpemUiLCJtaW4iLCJsaW5lQ29sb3IiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIngiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJ5IiwiZHJhd0NlbGwiLCJwb3NYIiwicG9zWSIsImZpbGxSZWN0IiwiYm9hcmQiLCJ1c2VyQm9hcmQiLCJhaUJvYXJkIiwibW91c2VDb29yZHMiLCJmaWxsU3R5bGUiLCJyYWRpdXMiLCJhcmMiLCJQSSIsImZpbGwiLCJkcmF3TGVuZ3RoIiwic2hpcHNDb3VudCIsImRpcmVjdGlvblgiLCJkaXJlY3Rpb25ZIiwiaGFsZkRyYXdMZW5ndGgiLCJyZW1haW5kZXJMZW5ndGgiLCJtYXhDb29yZGluYXRlWCIsIm1heENvb3JkaW5hdGVZIiwibWluQ29vcmRpbmF0ZVgiLCJtaW5Db29yZGluYXRlWSIsIm1heFgiLCJtYXhZIiwibWluWCIsIm1pblkiLCJpc091dE9mQm91bmRzIiwibmV4dFgiLCJuZXh0WSIsIlBsYXllciIsInByaXZhdGVOYW1lIiwidGhpc1BsYXllciIsIm5hbWUiLCJuZXdOYW1lIiwidG9TdHJpbmciLCJnYW1lYm9hcmQiLCJzZW5kQXR0YWNrIiwidmFsaWRhdGVBdHRhY2siLCJwbGF5ZXJCb2FyZCIsInNoaXBOYW1lcyIsImluZGV4IiwidGhpc1NoaXAiLCJzaXplIiwicGxhY2VtZW50RGlyZWN0aW9uWCIsInBsYWNlbWVudERpcmVjdGlvblkiLCJoYWxmU2l6ZSIsInJlbWFpbmRlclNpemUiLCJuZXdDb29yZHMiLCJjZWxsUHJvYnMiLCJwcm9icyIsInVwZGF0ZVByb2JzIiwiZmluZFJhbmRvbUF0dGFjayIsInJhbmRvbSIsImZpbmRHcmVhdGVzdFByb2JBdHRhY2siLCJhbGxQcm9icyIsIm1heCIsIk5FR0FUSVZFX0lORklOSVRZIiwiYWlEaWZmaWN1bHR5IiwiYWlBdHRhY2tpbmciLCJjb2xvck1vZCIsImFkamFjZW50TW9kIiwiY3JlYXRlUHJvYnMiLCJpbml0aWFsUHJvYnMiLCJpbml0aWFsQ29sb3JXZWlnaHQiLCJyb3ciLCJjb2xvcldlaWdodCIsImNvbCIsImNlbnRlclgiLCJjZW50ZXJZIiwiZGlzdGFuY2VGcm9tQ2VudGVyIiwic3FydCIsInBvdyIsIm1pblByb2JhYmlsaXR5IiwibWF4UHJvYmFiaWxpdHkiLCJwcm9iYWJpbGl0eSIsImJhcnJ5UHJvYmFiaWxpdHkiLCJub3JtYWxpemVQcm9icyIsInN1bSIsIm5vcm1hbGl6ZWRQcm9icyIsIm5vbk5vcm1hbGl6ZWRQcm9icyIsImhpdEFkamFjZW50SW5jcmVhc2UiLCJoaXRYIiwiaGl0WSIsImxhcmdlc3RMZW5ndGgiLCJzdGFydGluZ0RlYyIsImRlY1BlcmNlbnRhZ2UiLCJtaW5EZWMiLCJkZWNyZW1lbnRGYWN0b3IiLCJjaGVja0RlYWRDZWxscyIsIm51bVJvd3MiLCJudW1Db2xzIiwiaXNWYWxpZENlbGwiLCJpc0JvdW5kYXJ5T3JNaXNzIiwiY29uc29sZSIsImxvZyIsIl9nbSR1c2VyQm9hcmQiLCJsYXJnZXN0U2hpcExlbmd0aCIsInNtYWxsZXN0U2hpcExlbmd0aCIsInZhbHVlcyIsIl9oaXQiLCJfc2xpY2VkVG9BcnJheSIsIl9taXNzIiwibG9nUHJvYnMiLCJwcm9ic1RvTG9nIiwidGFibGUiLCJyZWR1Y2UiLCJyb3dTdW0iLCJ2YWx1ZSIsImdyaWRDYW52YXMiLCJjYW52YXNBZGRlciIsInVzZXJHYW1lYm9hcmQiLCJhaUdhbWVib2FyZCIsIndlYkludGVyZmFjZSIsInBsYWNlbWVudFBIIiwicXVlcnlTZWxlY3RvciIsInVzZXJQSCIsImFpUEgiLCJ1c2VyQ2FudmFzIiwiYWlDYW52YXMiLCJwbGFjZW1lbnRDYW52YXMiLCJwYXJlbnROb2RlIiwicmVwbGFjZUNoaWxkIiwiaW1hZ2VMb2FkZXIiLCJpbWFnZVJlZnMiLCJTUCIsImF0dGFjayIsImdlbiIsIkFUIiwiVk0iLCJJRyIsIkwiLCJpbWFnZUNvbnRleHQiLCJyZXF1aXJlIiwiZmlsZXMiLCJmaWxlIiwiZmlsZVBhdGgiLCJmaWxlTmFtZSIsInRvTG93ZXJDYXNlIiwic3ViRGlyIiwic3BsaXQiLCJ0b1VwcGVyQ2FzZSIsImluY2x1ZGVzIiwicmFuZG9tU2hpcHMiLCJwbGFjZUFpU2hpcHMiLCJwYXNzZWREaWZmIiwicGxhY2VTaGlwcyIsImRpZmZpY3VsdHkiLCJncmlkWCIsImdyaWRZIiwicm91bmQiLCJnYW1lTG9nIiwidXNlck5hbWUiLCJkb1VwZGF0ZVNjZW5lIiwiZG9Mb2NrIiwic2V0VXNlckdhbWVib2FyZCIsImxvZ1RleHQiLCJsb2dJbWciLCJzY2VuZUltYWdlcyIsImxvYWRTY2VuZXMiLCJyYW5kb21FbnRyeSIsImFycmF5IiwibGFzdEluZGV4IiwicmFuZG9tTnVtYmVyIiwiZGlyTmFtZXMiLCJyYW5kb21TaGlwRGlyIiwiaW5pdFNjZW5lIiwic2hpcERpciIsImVudHJ5Iiwic3JjIiwic2V0U2NlbmUiLCJsb2dMb3dlciIsInRleHRDb250ZW50Iiwic2hpcFR5cGVzIiwidHlwZVRvRGlyIiwic2VudGluZWwiLCJhc3NhdWx0IiwidmlwZXIiLCJpcm9uIiwibGV2aWF0aGFuIiwiZXJhc2UiLCJhcHBlbmQiLCJzdHJpbmdUb0FwcGVuZCIsImlubmVySFRNTCIsImJvb2wiLCJnYW1lTWFuYWdlciIsInVzZXJDYW52YXNDb250YWluZXIiLCJhaUNhbnZhc0NvbnRhaW5lciIsInBsYWNlbWVudENhbnZhc0NvbnRhaW5lciIsInNvdW5kUGxheWVyIiwiYWlBdHRhY2tIaXQiLCJwbGF5SGl0Iiwic3Vua01zZyIsImFpQXR0YWNrTWlzc2VkIiwicGxheU1pc3MiLCJhaUF0dGFja0NvdW50Iiwic2V0VGltZW91dCIsInRoZW4iLCJyZXN1bHQiLCJwbGF5QXR0YWNrIiwiYWlNYXRjaENsaWNrZWQiLCJpc011dGVkIiwidHJ5U3RhcnRHYW1lIiwic2hvd0dhbWUiLCJyYW5kb21TaGlwc0NsaWNrZWQiLCJyb3RhdGVDbGlja2VkIiwiZGlmZiIsInBsYWNlbWVudENhbnZhc2NvbnRhaW5lciIsImFNb2R1bGUiLCJoaXRTb3VuZCIsIm1pc3NTb3VuZCIsImF0dGFja1NvdW5kIiwiYXR0YWNrQXVkaW8iLCJBdWRpbyIsImhpdEF1ZGlvIiwibWlzc0F1ZGlvIiwic291bmRzIiwiY3VycmVudFRpbWUiLCJwbGF5IiwidGl0bGUiLCJtZW51IiwicGxhY2VtZW50IiwiZ2FtZSIsInN0YXJ0QnRuIiwiYWlNYXRjaEJ0biIsInJhbmRvbVNoaXBzQnRuIiwicm90YXRlQnRuIiwicm90YXRlRGlyZWN0aW9uIiwiaGlkZUFsbCIsInNob3dNZW51IiwicmVtb3ZlIiwic2hvd1BsYWNlbWVudCIsInNocmlua1RpdGxlIiwiaGFuZGxlU3RhcnRDbGljayIsImhhbmRsZUFpTWF0Y2hDbGljayIsImhhbmRsZVJvdGF0ZUNsaWNrIiwiaGFuZGxlUmFuZG9tU2hpcHNDbGljayIsIndlYkludCIsInVzZXJQbGF5ZXIiLCJhaVBsYXllciIsImNhbnZhc2VzIl0sInNvdXJjZVJvb3QiOiIifQ==