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
  // Method that creates probs and defines initial probabilities
  var createProbs = function createProbs() {
    // Create the probs. It is a 10x10 grid of cells.
    var initialProbs = [];

    // How much to modify the unfocused color probabilities
    var colorMod = 0.5;

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

  // These values are used as the evidence to update the probabilities on the probs
  var sunkenShips;
  var hits;
  var misses;
  // Method for updating these values from the game manager
  var updateEvidence = function updateEvidence(gm) {
    sunkenShips = gm.userBoard.sunkenShips;
    hits = gm.userBoard.hits;
    misses = gm.userBoard.misses;
  };

  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  var updateProbs = function updateProbs(gm) {
    // First get the updated evidence
    updateEvidence(gm);
    // Set the probability of every hit and missed cell to 0 to prevent that cell from being targeted
    Object.values(hits).forEach(function (hit) {
      var _hit = _slicedToArray(hit, 2),
        x = _hit[0],
        y = _hit[1];
      probs[x][y] = 0;
    });
    Object.values(misses).forEach(function (miss) {
      var _miss = _slicedToArray(miss, 2),
        x = _miss[0],
        y = _miss[1];
      probs[x][y] = 0;
    });
    // Update probability of cells adjacent to hit
    /* If hit surrounded by non-attacked cells then increase adjacent probabilities based
       on sunkenShips, where more cells away from the hit are affected if larger ships remain.
       This should be done by having a prob mod that is reduced based on how many cells away.
       If hit has another hit next to it then only increase the probability of the cells on that
       axis, and decrease the probability of adjacent cells not on that axis to account for previous
       increase that now should be discounted. */
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
          userBoard.tryAiAttack(0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPLDZGQUE2RixNQUFNLFlBQVksYUFBYSxhQUFhLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxXQUFXLFlBQVksTUFBTSxVQUFVLFlBQVksY0FBYyxXQUFXLFVBQVUsTUFBTSxVQUFVLEtBQUssWUFBWSxXQUFXLFVBQVUsYUFBYSxjQUFjLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsY0FBYyxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE1BQU0sWUFBWSxNQUFNLFlBQVksY0FBYyxXQUFXLFlBQVksYUFBYSxhQUFhLE1BQU0sYUFBYSxhQUFhLGFBQWEsT0FBTyxL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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUM1RkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7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ZmFjdG9yaWVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HcmlkQ2FudmFzL0dyaWRDYW52YXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR3JpZENhbnZhcy9kcmF3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9haUF0dGFjay9haUF0dGFjay5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvYWlBdHRhY2svY2VsbFByb2JzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9jYW52YXNBZGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvaW1hZ2VMb2FkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3BsYWNlQWlTaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvcmFuZG9tU2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVMb2cuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVNYW5hZ2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zb3VuZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3dlYkludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9yZXNldC5jc3M/NDQ1ZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcz9jOWYwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY2VuZS1pbWFnZXMvIHN5bmMgXFwuanBnJC8iLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5pbXBvcnQgYWlBdHRhY2sgZnJvbSBcIi4uL2hlbHBlcnMvYWlBdHRhY2svYWlBdHRhY2tcIjtcblxuLyogRmFjdG9yeSB0aGF0IHJldHVybnMgYSBnYW1lYm9hcmQgdGhhdCBjYW4gcGxhY2Ugc2hpcHMgd2l0aCBTaGlwKCksIHJlY2lldmUgYXR0YWNrcyBiYXNlZCBvbiBjb29yZHMgXG4gICBhbmQgdGhlbiBkZWNpZGVzIHdoZXRoZXIgdG8gaGl0KCkgaWYgc2hpcCBpcyBpbiB0aGF0IHNwb3QsIHJlY29yZHMgaGl0cyBhbmQgbWlzc2VzLCBhbmQgcmVwb3J0cyBpZlxuICAgYWxsIGl0cyBzaGlwcyBoYXZlIGJlZW4gc3Vuay4gKi9cbmNvbnN0IEdhbWVib2FyZCA9IChnbSkgPT4ge1xuICBjb25zdCB0aGlzR2FtZWJvYXJkID0ge1xuICAgIG1heEJvYXJkWDogOSxcbiAgICBtYXhCb2FyZFk6IDksXG4gICAgc2hpcHM6IFtdLFxuICAgIGFsbE9jY3VwaWVkQ2VsbHM6IFtdLFxuICAgIG1pc3NlczogW10sXG4gICAgaGl0czogW10sXG4gICAgZGlyZWN0aW9uOiAxLFxuICAgIGhpdFNoaXBUeXBlOiBudWxsLFxuICAgIGlzQWk6IGZhbHNlLFxuICAgIGdhbWVPdmVyOiBmYWxzZSxcbiAgICBjYW5BdHRhY2s6IHRydWUsXG4gICAgcml2YWxCb2FyZDogbnVsbCxcbiAgICBjYW52YXM6IG51bGwsXG4gICAgYWRkU2hpcDogbnVsbCxcbiAgICByZWNlaXZlQXR0YWNrOiBudWxsLFxuICAgIGFsbFN1bms6IG51bGwsXG4gICAgbG9nU3VuazogbnVsbCxcbiAgICBhbHJlYWR5QXR0YWNrZWQ6IG51bGwsXG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHNoaXAgb2NjdXBpZWQgY2VsbCBjb29yZHNcbiAgY29uc3QgdmFsaWRhdGVTaGlwID0gKHNoaXApID0+IHtcbiAgICBpZiAoIXNoaXApIHJldHVybiBmYWxzZTtcbiAgICAvLyBGbGFnIGZvciBkZXRlY3RpbmcgaW52YWxpZCBwb3NpdGlvbiB2YWx1ZVxuICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgIC8vIENoZWNrIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHMgYXJlIGFsbCB3aXRoaW4gbWFwIGFuZCBub3QgYWxyZWFkeSBvY2N1cGllZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5vY2N1cGllZENlbGxzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAvLyBPbiB0aGUgbWFwP1xuICAgICAgaWYgKFxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gPj0gMCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gPD0gdGhpc0dhbWVib2FyZC5tYXhCb2FyZFggJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdIDw9IHRoaXNHYW1lYm9hcmQubWF4Qm9hcmRZXG4gICAgICApIHtcbiAgICAgICAgLy8gRG8gbm90aGluZ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQ2hlY2sgb2NjdXBpZWQgY2VsbHNcbiAgICAgIGNvbnN0IGlzQ2VsbE9jY3VwaWVkID0gdGhpc0dhbWVib2FyZC5hbGxPY2N1cGllZENlbGxzLnNvbWUoXG4gICAgICAgIChjZWxsKSA9PlxuICAgICAgICAgIC8vIENvb3JkcyBmb3VuZCBpbiBhbGwgb2NjdXBpZWQgY2VsbHMgYWxyZWFkeVxuICAgICAgICAgIGNlbGxbMF0gPT09IHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSAmJlxuICAgICAgICAgIGNlbGxbMV0gPT09IHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXVxuICAgICAgKTtcblxuICAgICAgaWYgKGlzQ2VsbE9jY3VwaWVkKSB7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7IC8vIEJyZWFrIG91dCBvZiB0aGUgbG9vcCBpZiBvY2N1cGllZCBjZWxsIGlzIGZvdW5kXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgYWRkcyBvY2N1cGllZCBjZWxscyBvZiB2YWxpZCBib2F0IHRvIGxpc3RcbiAgY29uc3QgYWRkQ2VsbHNUb0xpc3QgPSAoc2hpcCkgPT4ge1xuICAgIHNoaXAub2NjdXBpZWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICB0aGlzR2FtZWJvYXJkLmFsbE9jY3VwaWVkQ2VsbHMucHVzaChjZWxsKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIGFkZGluZyBhIHNoaXAgYXQgYSBnaXZlbiBjb29yZHMgaW4gZ2l2ZW4gZGlyZWN0aW9uIGlmIHNoaXAgd2lsbCBmaXQgb24gYm9hcmRcbiAgdGhpc0dhbWVib2FyZC5hZGRTaGlwID0gKFxuICAgIHBvc2l0aW9uLFxuICAgIGRpcmVjdGlvbiA9IHRoaXNHYW1lYm9hcmQuZGlyZWN0aW9uLFxuICAgIHNoaXBUeXBlSW5kZXggPSB0aGlzR2FtZWJvYXJkLnNoaXBzLmxlbmd0aCArIDFcbiAgKSA9PiB7XG4gICAgLy8gQ3JlYXRlIHRoZSBkZXNpcmVkIHNoaXBcbiAgICBjb25zdCBuZXdTaGlwID0gU2hpcChzaGlwVHlwZUluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKTtcbiAgICAvLyBBZGQgaXQgdG8gc2hpcHMgaWYgaXQgaGFzIHZhbGlkIG9jY3VwaWVkIGNlbGxzXG4gICAgaWYgKHZhbGlkYXRlU2hpcChuZXdTaGlwKSkge1xuICAgICAgYWRkQ2VsbHNUb0xpc3QobmV3U2hpcCk7XG4gICAgICB0aGlzR2FtZWJvYXJkLnNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFkZE1pc3MgPSAocG9zaXRpb24pID0+IHtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHRoaXNHYW1lYm9hcmQubWlzc2VzLnB1c2gocG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhZGRIaXQgPSAocG9zaXRpb24sIHNoaXApID0+IHtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHRoaXNHYW1lYm9hcmQuaGl0cy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG1vc3QgcmVjZW50bHkgaGl0IHNoaXBcbiAgICB0aGlzR2FtZWJvYXJkLmhpdFNoaXBUeXBlID0gc2hpcC50eXBlO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVjZWl2aW5nIGFuIGF0dGFjayBmcm9tIG9wcG9uZW50XG4gIHRoaXNHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayA9IChwb3NpdGlvbiwgc2hpcHMgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBWYWxpZGF0ZSBwb3NpdGlvbiBpcyAyIGluIGFycmF5IGFuZCBzaGlwcyBpcyBhbiBhcnJheSwgYW5kIHJpdmFsIGJvYXJkIGNhbiBhdHRhY2tcbiAgICAgIGlmIChcbiAgICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHMpXG4gICAgICApIHtcbiAgICAgICAgLy8gRWFjaCBzaGlwIGluIHNoaXBzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBJZiB0aGUgc2hpcCBpcyBub3QgZmFsc3ksIGFuZCBvY2N1cGllZENlbGxzIHByb3AgZXhpc3RzIGFuZCBpcyBhbiBhcnJheVxuICAgICAgICAgICAgc2hpcHNbaV0gJiZcbiAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMgJiZcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHNbaV0ub2NjdXBpZWRDZWxscylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIG9mIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHNcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcHNbaV0ub2NjdXBpZWRDZWxscy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhhdCBjZWxsIG1hdGNoZXMgdGhlIGF0dGFjayBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMF0gPT09IHBvc2l0aW9uWzBdICYmXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGF0IHNoaXBzIGhpdCBtZXRob2QgYW5kIGJyZWFrIG91dCBvZiBsb29wXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgICAgYWRkSGl0KHBvc2l0aW9uLCBzaGlwc1tpXSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFkZE1pc3MocG9zaXRpb24pO1xuICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgLy8gTWV0aG9kIGZvciB0cnlpbmcgYWkgYXR0YWNrc1xuICB0aGlzR2FtZWJvYXJkLnRyeUFpQXR0YWNrID0gKGRlbGF5KSA9PiB7XG4gICAgLy8gUmV0dXJuIGlmIG5vdCBhaSBvciBnYW1lIGlzIG92ZXJcbiAgICBpZiAodGhpc0dhbWVib2FyZC5pc0FpID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIGFpQXR0YWNrKGdtLCBkZWxheSk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3Igbm90XG4gIHRoaXNHYW1lYm9hcmQuYWxsU3VuayA9IChzaGlwQXJyYXkgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgaWYgKCFzaGlwQXJyYXkgfHwgIUFycmF5LmlzQXJyYXkoc2hpcEFycmF5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgc2hpcEFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rICYmICFzaGlwLmlzU3VuaygpKSBhbGxTdW5rID0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH07XG5cbiAgLy8gT2JqZWN0IGZvciB0cmFja2luZyBib2FyZCdzIHN1bmtlbiBzaGlwc1xuICB0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzID0ge1xuICAgIDE6IGZhbHNlLFxuICAgIDI6IGZhbHNlLFxuICAgIDM6IGZhbHNlLFxuICAgIDQ6IGZhbHNlLFxuICAgIDU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVwb3J0aW5nIHN1bmtlbiBzaGlwc1xuICB0aGlzR2FtZWJvYXJkLmxvZ1N1bmsgPSAoKSA9PiB7XG4gICAgbGV0IGxvZ01zZyA9IG51bGw7XG4gICAgT2JqZWN0LmtleXModGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHNba2V5XSA9PT0gZmFsc2UgJiZcbiAgICAgICAgdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS5pc1N1bmsoKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSB0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdLnR5cGU7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXNHYW1lYm9hcmQuaXNBaSA/IFwiQUknc1wiIDogXCJVc2VyJ3NcIjtcbiAgICAgICAgbG9nTXNnID0gYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7cGxheWVyfSAke3NoaXB9IHdhcyBkZXN0cm95ZWQhPC9zcGFuPmA7XG4gICAgICAgIHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHNba2V5XSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxvZ01zZztcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIGRldGVybWluaW5nIGlmIGEgcG9zaXRpb24gaXMgYWxyZWFkeSBhdHRhY2tlZFxuICB0aGlzR2FtZWJvYXJkLmFscmVhZHlBdHRhY2tlZCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICBsZXQgYXR0YWNrZWQgPSBmYWxzZTtcblxuICAgIHRoaXNHYW1lYm9hcmQuaGl0cy5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgIGlmIChhdHRhY2tDb29yZHNbMF0gPT09IGhpdFswXSAmJiBhdHRhY2tDb29yZHNbMV0gPT09IGhpdFsxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzR2FtZWJvYXJkLm1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBpZiAoYXR0YWNrQ29vcmRzWzBdID09PSBtaXNzWzBdICYmIGF0dGFja0Nvb3Jkc1sxXSA9PT0gbWlzc1sxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXR0YWNrZWQ7XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNHYW1lYm9hcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCIvLyBIZWxwZXIgbW9kdWxlIGZvciBkcmF3IG1ldGhvZHNcbmltcG9ydCBkcmF3aW5nTW9kdWxlIGZyb20gXCIuL2RyYXdcIjtcblxuLy8gSW5pdGlhbGl6ZSBpdFxuY29uc3QgZHJhdyA9IGRyYXdpbmdNb2R1bGUoKTtcblxuY29uc3QgY3JlYXRlQ2FudmFzID0gKGdtLCBjYW52YXNYLCBjYW52YXNZLCBvcHRpb25zKSA9PiB7XG4gIC8vICNyZWdpb24gU2V0IHVwIGJhc2ljIGVsZW1lbnQgcHJvcGVydGllc1xuICAvLyBTZXQgdGhlIGdyaWQgaGVpZ2h0IGFuZCB3aWR0aCBhbmQgYWRkIHJlZiB0byBjdXJyZW50IGNlbGxcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcbiAgbGV0IGN1cnJlbnRDZWxsID0gbnVsbDtcblxuICAvLyBDcmVhdGUgcGFyZW50IGRpdiB0aGF0IGhvbGRzIHRoZSBjYW52YXNlcy4gVGhpcyBpcyB0aGUgZWxlbWVudCByZXR1cm5lZC5cbiAgY29uc3QgY2FudmFzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjYW52YXMtY29udGFpbmVyXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgYm9hcmQgY2FudmFzIGVsZW1lbnQgdG8gc2VydmUgYXMgdGhlIGdhbWVib2FyZCBiYXNlXG4gIGNvbnN0IGJvYXJkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzQ29udGFpbmVyLmFwcGVuZENoaWxkKGJvYXJkQ2FudmFzKTtcbiAgYm9hcmRDYW52YXMud2lkdGggPSBjYW52YXNYO1xuICBib2FyZENhbnZhcy5oZWlnaHQgPSBjYW52YXNZO1xuICBjb25zdCBib2FyZEN0eCA9IGJvYXJkQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIG92ZXJsYXkgY2FudmFzIGZvciByZW5kZXJpbmcgc2hpcCBwbGFjZW1lbnQgYW5kIGF0dGFjayBzZWxlY3Rpb25cbiAgY29uc3Qgb3ZlcmxheUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChvdmVybGF5Q2FudmFzKTtcbiAgb3ZlcmxheUNhbnZhcy53aWR0aCA9IGNhbnZhc1g7XG4gIG92ZXJsYXlDYW52YXMuaGVpZ2h0ID0gY2FudmFzWTtcbiAgY29uc3Qgb3ZlcmxheUN0eCA9IG92ZXJsYXlDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIC8vIFNldCB0aGUgXCJjZWxsIHNpemVcIiBmb3IgdGhlIGdyaWQgcmVwcmVzZW50ZWQgYnkgdGhlIGNhbnZhc1xuICBjb25zdCBjZWxsU2l6ZVggPSBib2FyZENhbnZhcy53aWR0aCAvIGdyaWRXaWR0aDsgLy8gTW9kdWxlIGNvbnN0XG4gIGNvbnN0IGNlbGxTaXplWSA9IGJvYXJkQ2FudmFzLmhlaWdodCAvIGdyaWRIZWlnaHQ7IC8vIE1vZHVsZSBjb25zdFxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEdlbmVyYWwgaGVscGVyIG1ldGhvZHNcbiAgLy8gTWV0aG9kIHRoYXQgZ2V0cyB0aGUgbW91c2UgcG9zaXRpb24gYmFzZWQgb24gd2hhdCBjZWxsIGl0IGlzIG92ZXJcbiAgY29uc3QgZ2V0TW91c2VDZWxsID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgcmVjdCA9IGJvYXJkQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgY29uc3QgY2VsbFggPSBNYXRoLmZsb29yKG1vdXNlWCAvIGNlbGxTaXplWCk7XG4gICAgY29uc3QgY2VsbFkgPSBNYXRoLmZsb29yKG1vdXNlWSAvIGNlbGxTaXplWSk7XG5cbiAgICByZXR1cm4gW2NlbGxYLCBjZWxsWV07XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQXNzaWduIHN0YXRpYyBtZXRob2RzXG4gIC8vIEFkZCBtZXRob2RzIG9uIHRoZSBjb250YWluZXIgZm9yIGRyYXdpbmcgaGl0cyBvciBtaXNzZXNcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdIaXQgPSAoY29vcmRpbmF0ZXMpID0+XG4gICAgZHJhdy5oaXRPck1pc3MoYm9hcmRDdHgsIGNlbGxTaXplWCwgY2VsbFNpemVZLCBjb29yZGluYXRlcywgMSk7XG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyA9IChjb29yZGluYXRlcykgPT5cbiAgICBkcmF3LmhpdE9yTWlzcyhib2FyZEN0eCwgY2VsbFNpemVYLCBjZWxsU2l6ZVksIGNvb3JkaW5hdGVzLCAwKTtcblxuICAvLyBBZGQgbWV0aG9kIHRvIGNvbnRhaW5lciBmb3Igc2hpcHMgdG8gYm9hcmQgY2FudmFzXG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMgPSAodXNlclNoaXBzID0gdHJ1ZSkgPT4ge1xuICAgIGRyYXcuc2hpcHMoYm9hcmRDdHgsIGNlbGxTaXplWCwgY2VsbFNpemVZLCBnbSwgdXNlclNoaXBzKTtcbiAgfTtcblxuICAvLyBvdmVybGF5Q2FudmFzXG4gIC8vIEZvcndhcmQgY2xpY2tzIHRvIGJvYXJkIGNhbnZhc1xuICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IG5ld0V2ZW50ID0gbmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiLCB7XG4gICAgICBidWJibGVzOiBldmVudC5idWJibGVzLFxuICAgICAgY2FuY2VsYWJsZTogZXZlbnQuY2FuY2VsYWJsZSxcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgIH0pO1xuICAgIGJvYXJkQ2FudmFzLmRpc3BhdGNoRXZlbnQobmV3RXZlbnQpO1xuICB9O1xuXG4gIC8vIE1vdXNlbGVhdmVcbiAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUxlYXZlID0gKCkgPT4ge1xuICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcbiAgICBjdXJyZW50Q2VsbCA9IG51bGw7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQXNzaWduIGJlaGF2aW9yIHVzaW5nIGJyb3dzZXIgZXZlbnQgaGFuZGxlcnMgYmFzZWQgb24gb3B0aW9uc1xuICAvLyBQbGFjZW1lbnQgaXMgdXNlZCBmb3IgcGxhY2luZyBzaGlwc1xuICBpZiAob3B0aW9ucy50eXBlID09PSBcInBsYWNlbWVudFwiKSB7XG4gICAgLy8gQWRkIGNsYXNzIHRvIGNhbnZhc0NvbnRhaW5lciB0byBkZW5vdGUgcGxhY2VtZW50IGNvbnRhaW5lclxuICAgIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gU2V0IHVwIG92ZXJsYXlDYW52YXMgd2l0aCBiZWhhdmlvcnMgdW5pcXVlIHRvIHBsYWNlbWVudFxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBHZXQgd2hhdCBjZWxsIHRoZSBtb3VzZSBpcyBvdmVyXG4gICAgICBjb25zdCBtb3VzZUNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuICAgICAgLy8gSWYgdGhlICdvbGQnIGN1cnJlbnRDZWxsIGlzIGVxdWFsIHRvIHRoZSBtb3VzZUNlbGwgYmVpbmcgZXZhbHVhdGVkXG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgY3VycmVudENlbGwgJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFswXSA9PT0gbW91c2VDZWxsWzBdICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMV0gPT09IG1vdXNlQ2VsbFsxXVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgLy8gUmVuZGVyIHRoZSBjaGFuZ2VzXG4gICAgICAgIGRyYXcucGxhY2VtZW50SGlnaGxpZ2h0KFxuICAgICAgICAgIG92ZXJsYXlDdHgsXG4gICAgICAgICAgY2FudmFzWCxcbiAgICAgICAgICBjYW52YXNZLFxuICAgICAgICAgIGNlbGxTaXplWCxcbiAgICAgICAgICBjZWxsU2l6ZVksXG4gICAgICAgICAgbW91c2VDZWxsLFxuICAgICAgICAgIGdtXG4gICAgICAgICk7XG4gICAgICAgIC8vIGhpZ2hsaWdodFBsYWNlbWVudENlbGxzKG1vdXNlQ2VsbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldCB0aGUgY3VycmVudENlbGwgdG8gdGhlIG1vdXNlQ2VsbCBmb3IgZnV0dXJlIGNvbXBhcmlzb25zXG4gICAgICBjdXJyZW50Q2VsbCA9IG1vdXNlQ2VsbDtcbiAgICB9O1xuXG4gICAgLy8gQnJvd3NlciBjbGljayBldmVudHNcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBjZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcblxuICAgICAgLy8gVHJ5IHBsYWNlbWVudFxuICAgICAgZ20ucGxhY2VtZW50Q2xpY2tlZChjZWxsKTtcbiAgICB9O1xuICB9XG4gIC8vIFVzZXIgY2FudmFzIGZvciBkaXNwbGF5aW5nIGFpIGhpdHMgYW5kIG1pc3NlcyBhZ2FpbnN0IHVzZXIgYW5kIHVzZXIgc2hpcCBwbGFjZW1lbnRzXG4gIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gZGVub3RlIHVzZXIgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ1c2VyLWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gSGFuZGxlIGNhbnZhcyBtb3VzZSBtb3ZlXG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKCkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH07XG4gIH1cbiAgLy8gQUkgY2FudmFzIGZvciBkaXNwbGF5aW5nIHVzZXIgaGl0cyBhbmQgbWlzc2VzIGFnYWluc3QgYWksIGFuZCBhaSBzaGlwIHBsYWNlbWVudHMgaWYgdXNlciBsb3Nlc1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09IFwiYWlcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBkZW5vdGUgYWkgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhaS1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIEhhbmRsZSBjYW52YXMgbW91c2UgbW92ZVxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBHZXQgd2hhdCBjZWxsIHRoZSBtb3VzZSBpcyBvdmVyXG4gICAgICBjb25zdCBtb3VzZUNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuICAgICAgLy8gSWYgdGhlICdvbGQnIGN1cnJlbnRDZWxsIGlzIGVxdWFsIHRvIHRoZSBtb3VzZUNlbGwgYmVpbmcgZXZhbHVhdGVkXG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgY3VycmVudENlbGwgJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFswXSA9PT0gbW91c2VDZWxsWzBdICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMV0gPT09IG1vdXNlQ2VsbFsxXVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBjdXJyZW50IGNlbGwgaW4gcmVkXG4gICAgICAgIGRyYXcuYXR0YWNrSGlnaGxpZ2h0KFxuICAgICAgICAgIG92ZXJsYXlDdHgsXG4gICAgICAgICAgY2FudmFzWCxcbiAgICAgICAgICBjYW52YXNZLFxuICAgICAgICAgIGNlbGxTaXplWCxcbiAgICAgICAgICBjZWxsU2l6ZVksXG4gICAgICAgICAgbW91c2VDZWxsLFxuICAgICAgICAgIGdtXG4gICAgICAgICk7XG4gICAgICAgIC8vIGhpZ2hsaWdodEF0dGFjayhtb3VzZUNlbGwpO1xuICAgICAgfVxuICAgICAgLy8gRGVub3RlIGlmIGl0IGlzIGEgdmFsaWQgYXR0YWNrIG9yIG5vdCAtIE5ZSVxuICAgIH07XG4gICAgLy8gSGFuZGxlIGJvYXJkIG1vdXNlIGNsaWNrXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgYXR0YWNrQ29vcmRzID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIGdtLnBsYXllckF0dGFja2luZyhhdHRhY2tDb29yZHMpO1xuXG4gICAgICAvLyBDbGVhciB0aGUgb3ZlcmxheSB0byBzaG93IGhpdC9taXNzIHVuZGVyIGN1cnJlbnQgaGlnaGlnaHRcbiAgICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICB9XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBTdWJzY3JpYmUgdG8gYnJvd3NlciBldmVudHNcbiAgLy8gYm9hcmQgY2xpY2tcbiAgYm9hcmRDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrKGUpKTtcbiAgLy8gb3ZlcmxheSBjbGlja1xuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlQ2xpY2soZSlcbiAgKTtcbiAgLy8gb3ZlcmxheSBtb3VzZW1vdmVcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlKGUpXG4gICk7XG4gIC8vIG92ZXJsYXkgbW91c2VsZWF2ZVxuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUxlYXZlKClcbiAgKTtcblxuICAvLyBEcmF3IGluaXRpYWwgYm9hcmQgbGluZXNcbiAgZHJhdy5saW5lcyhib2FyZEN0eCwgY2FudmFzWCwgY2FudmFzWSk7XG5cbiAgLy8gUmV0dXJuIGNvbXBsZXRlZCBjYW52YXNlc1xuICByZXR1cm4gY2FudmFzQ29udGFpbmVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ2FudmFzO1xuIiwiY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgLy8gRHJhd3MgdGhlIGdyaWQgbGluZXNcbiAgY29uc3QgbGluZXMgPSAoY29udGV4dCwgY2FudmFzWCwgY2FudmFzWSkgPT4ge1xuICAgIC8vIERyYXcgZ3JpZCBsaW5lc1xuICAgIGNvbnN0IGdyaWRTaXplID0gTWF0aC5taW4oY2FudmFzWCwgY2FudmFzWSkgLyAxMDtcbiAgICBjb25zdCBsaW5lQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGxpbmVDb2xvcjtcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cbiAgICAvLyBEcmF3IHZlcnRpY2FsIGxpbmVzXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gY2FudmFzWDsgeCArPSBncmlkU2l6ZSkge1xuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKHgsIDApO1xuICAgICAgY29udGV4dC5saW5lVG8oeCwgY2FudmFzWSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIC8vIERyYXcgaG9yaXpvbnRhbCBsaW5lc1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IGNhbnZhc1k7IHkgKz0gZ3JpZFNpemUpIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbygwLCB5KTtcbiAgICAgIGNvbnRleHQubGluZVRvKGNhbnZhc1gsIHkpO1xuICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRHJhd3MgdGhlIHNoaXBzLiBEZWZhdWx0IGRhdGEgdG8gdXNlIGlzIHVzZXIgc2hpcHMsIGJ1dCBhaSBjYW4gYmUgdXNlZCB0b29cbiAgY29uc3Qgc2hpcHMgPSAoY29udGV4dCwgY2VsbFgsIGNlbGxZLCBnbSwgdXNlclNoaXBzID0gdHJ1ZSkgPT4ge1xuICAgIC8vIERyYXcgYSBjZWxsIHRvIGJvYXJkXG4gICAgZnVuY3Rpb24gZHJhd0NlbGwocG9zWCwgcG9zWSkge1xuICAgICAgY29udGV4dC5maWxsUmVjdChwb3NYICogY2VsbFgsIHBvc1kgKiBjZWxsWSwgY2VsbFgsIGNlbGxZKTtcbiAgICB9XG4gICAgLy8gV2hpY2ggYm9hcmQgdG8gZ2V0IHNoaXBzIGRhdGEgZnJvbVxuICAgIGNvbnN0IGJvYXJkID0gdXNlclNoaXBzID09PSB0cnVlID8gZ20udXNlckJvYXJkIDogZ20uYWlCb2FyZDtcbiAgICAvLyBEcmF3IHRoZSBjZWxscyB0byB0aGUgYm9hcmRcbiAgICBib2FyZC5zaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBkcmF3Q2VsbChjZWxsWzBdLCBjZWxsWzFdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIERyYXdzIGEgaGl0IG9yIGEgbWlzcyBkZWZhdWx0aW5nIHRvIGEgbWlzcyBpZiBubyB0eXBlIHBhc3NlZFxuICBjb25zdCBoaXRPck1pc3MgPSAoY29udGV4dCwgY2VsbFgsIGNlbGxZLCBtb3VzZUNvb3JkcywgdHlwZSA9IDApID0+IHtcbiAgICAvLyBTZXQgcHJvcGVyIGZpbGwgY29sb3JcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICBpZiAodHlwZSA9PT0gMSkgY29udGV4dC5maWxsU3R5bGUgPSBcInJlZFwiO1xuICAgIC8vIFNldCBhIHJhZGl1cyBmb3IgY2lyY2xlIHRvIGRyYXcgZm9yIFwicGVnXCIgdGhhdCB3aWxsIGFsd2F5cyBmaXQgaW4gY2VsbFxuICAgIGNvbnN0IHJhZGl1cyA9IGNlbGxYID4gY2VsbFkgPyBjZWxsWSAvIDIgOiBjZWxsWCAvIDI7XG4gICAgLy8gRHJhdyB0aGUgY2lyY2xlXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyhcbiAgICAgIG1vdXNlQ29vcmRzWzBdICogY2VsbFggKyBjZWxsWCAvIDIsXG4gICAgICBtb3VzZUNvb3Jkc1sxXSAqIGNlbGxZICsgY2VsbFkgLyAyLFxuICAgICAgcmFkaXVzLFxuICAgICAgMCxcbiAgICAgIDIgKiBNYXRoLlBJXG4gICAgKTtcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlbWVudEhpZ2hsaWdodCA9IChcbiAgICBjb250ZXh0LFxuICAgIGNhbnZhc1gsXG4gICAgY2FudmFzWSxcbiAgICBjZWxsWCxcbiAgICBjZWxsWSxcbiAgICBtb3VzZUNvb3JkcyxcbiAgICBnbVxuICApID0+IHtcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzXG4gICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzWCwgY2FudmFzWSk7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gb3ZlcmxheVxuICAgIGZ1bmN0aW9uIGRyYXdDZWxsKHBvc1gsIHBvc1kpIHtcbiAgICAgIGNvbnRleHQuZmlsbFJlY3QocG9zWCAqIGNlbGxYLCBwb3NZICogY2VsbFksIGNlbGxYLCBjZWxsWSk7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIGN1cnJlbnQgc2hpcCBsZW5ndGggKGJhc2VkIG9uIGRlZmF1bHQgYmF0dGxlc2hpcCBydWxlcyBzaXplcywgc21hbGxlc3QgdG8gYmlnZ2VzdClcbiAgICBsZXQgZHJhd0xlbmd0aDtcbiAgICBjb25zdCBzaGlwc0NvdW50ID0gZ20udXNlckJvYXJkLnNoaXBzLmxlbmd0aDtcbiAgICBpZiAoc2hpcHNDb3VudCA9PT0gMCkgZHJhd0xlbmd0aCA9IDI7XG4gICAgZWxzZSBpZiAoc2hpcHNDb3VudCA9PT0gMSB8fCBzaGlwc0NvdW50ID09PSAyKSBkcmF3TGVuZ3RoID0gMztcbiAgICBlbHNlIGRyYXdMZW5ndGggPSBzaGlwc0NvdW50ICsgMTtcblxuICAgIC8vIERldGVybWluZSBkaXJlY3Rpb24gdG8gZHJhdyBpblxuICAgIGxldCBkaXJlY3Rpb25YID0gMDtcbiAgICBsZXQgZGlyZWN0aW9uWSA9IDA7XG5cbiAgICBpZiAoZ20udXNlckJvYXJkLmRpcmVjdGlvbiA9PT0gMSkge1xuICAgICAgZGlyZWN0aW9uWSA9IDE7XG4gICAgICBkaXJlY3Rpb25YID0gMDtcbiAgICB9IGVsc2UgaWYgKGdtLnVzZXJCb2FyZC5kaXJlY3Rpb24gPT09IDApIHtcbiAgICAgIGRpcmVjdGlvblkgPSAwO1xuICAgICAgZGlyZWN0aW9uWCA9IDE7XG4gICAgfVxuXG4gICAgLy8gRGl2aWRlIHRoZSBkcmF3TGVuZ2h0IGluIGhhbGYgd2l0aCByZW1haW5kZXJcbiAgICBjb25zdCBoYWxmRHJhd0xlbmd0aCA9IE1hdGguZmxvb3IoZHJhd0xlbmd0aCAvIDIpO1xuICAgIGNvbnN0IHJlbWFpbmRlckxlbmd0aCA9IGRyYXdMZW5ndGggJSAyO1xuXG4gICAgLy8gSWYgZHJhd2luZyBvZmYgY2FudmFzIG1ha2UgY29sb3IgcmVkXG4gICAgLy8gQ2FsY3VsYXRlIG1heGltdW0gYW5kIG1pbmltdW0gY29vcmRpbmF0ZXNcbiAgICBjb25zdCBtYXhDb29yZGluYXRlWCA9XG4gICAgICBtb3VzZUNvb3Jkc1swXSArIChoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aCAtIDEpICogZGlyZWN0aW9uWDtcbiAgICBjb25zdCBtYXhDb29yZGluYXRlWSA9XG4gICAgICBtb3VzZUNvb3Jkc1sxXSArIChoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aCAtIDEpICogZGlyZWN0aW9uWTtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWCA9IG1vdXNlQ29vcmRzWzBdIC0gaGFsZkRyYXdMZW5ndGggKiBkaXJlY3Rpb25YO1xuICAgIGNvbnN0IG1pbkNvb3JkaW5hdGVZID0gbW91c2VDb29yZHNbMV0gLSBoYWxmRHJhd0xlbmd0aCAqIGRpcmVjdGlvblk7XG5cbiAgICAvLyBBbmQgdHJhbnNsYXRlIGludG8gYW4gYWN0dWFsIGNhbnZhcyBwb3NpdGlvblxuICAgIGNvbnN0IG1heFggPSBtYXhDb29yZGluYXRlWCAqIGNlbGxYO1xuICAgIGNvbnN0IG1heFkgPSBtYXhDb29yZGluYXRlWSAqIGNlbGxZO1xuICAgIGNvbnN0IG1pblggPSBtaW5Db29yZGluYXRlWCAqIGNlbGxYO1xuICAgIGNvbnN0IG1pblkgPSBtaW5Db29yZGluYXRlWSAqIGNlbGxZO1xuXG4gICAgLy8gQ2hlY2sgaWYgYW55IGNlbGxzIGFyZSBvdXRzaWRlIHRoZSBjYW52YXMgYm91bmRhcmllc1xuICAgIGNvbnN0IGlzT3V0T2ZCb3VuZHMgPVxuICAgICAgbWF4WCA+PSBjYW52YXNYIHx8IG1heFkgPj0gY2FudmFzWSB8fCBtaW5YIDwgMCB8fCBtaW5ZIDwgMDtcblxuICAgIC8vIFNldCB0aGUgZmlsbCBjb2xvciBiYXNlZCBvbiB3aGV0aGVyIGNlbGxzIGFyZSBkcmF3biBvZmYgY2FudmFzXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBpc091dE9mQm91bmRzID8gXCJyZWRcIiA6IFwiYmx1ZVwiO1xuXG4gICAgLy8gRHJhdyB0aGUgbW91c2VkIG92ZXIgY2VsbCBmcm9tIHBhc3NlZCBjb29yZHNcbiAgICBkcmF3Q2VsbChtb3VzZUNvb3Jkc1swXSwgbW91c2VDb29yZHNbMV0pO1xuXG4gICAgLy8gRHJhdyB0aGUgZmlyc3QgaGFsZiBvZiBjZWxscyBhbmQgcmVtYWluZGVyIGluIG9uZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5leHRYID0gbW91c2VDb29yZHNbMF0gKyBpICogZGlyZWN0aW9uWDtcbiAgICAgIGNvbnN0IG5leHRZID0gbW91c2VDb29yZHNbMV0gKyBpICogZGlyZWN0aW9uWTtcbiAgICAgIGRyYXdDZWxsKG5leHRYLCBuZXh0WSk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyB0aGUgcmVtYWluaW5nIGhhbGZcbiAgICAvLyBEcmF3IHRoZSByZW1haW5pbmcgY2VsbHMgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZkRyYXdMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV4dFggPSBtb3VzZUNvb3Jkc1swXSAtIChpICsgMSkgKiBkaXJlY3Rpb25YO1xuICAgICAgY29uc3QgbmV4dFkgPSBtb3VzZUNvb3Jkc1sxXSAtIChpICsgMSkgKiBkaXJlY3Rpb25ZO1xuICAgICAgZHJhd0NlbGwobmV4dFgsIG5leHRZKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXR0YWNrSGlnaGxpZ2h0ID0gKFxuICAgIGNvbnRleHQsXG4gICAgY2FudmFzWCxcbiAgICBjYW52YXNZLFxuICAgIGNlbGxYLFxuICAgIGNlbGxZLFxuICAgIG1vdXNlQ29vcmRzLFxuICAgIGdtXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNYLCBjYW52YXNZKTtcblxuICAgIC8vIEhpZ2hsaWdodCB0aGUgY3VycmVudCBjZWxsIGluIHJlZFxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZWRcIjtcblxuICAgIC8vIENoZWNrIGlmIGNlbGwgY29vcmRzIGluIGdhbWVib2FyZCBoaXRzIG9yIG1pc3Nlc1xuICAgIGlmIChnbS5haUJvYXJkLmFscmVhZHlBdHRhY2tlZChtb3VzZUNvb3JkcykpIHJldHVybjtcblxuICAgIC8vIEhpZ2hsaWdodCB0aGUgY2VsbFxuICAgIGNvbnRleHQuZmlsbFJlY3QoXG4gICAgICBtb3VzZUNvb3Jkc1swXSAqIGNlbGxYLFxuICAgICAgbW91c2VDb29yZHNbMV0gKiBjZWxsWSxcbiAgICAgIGNlbGxYLFxuICAgICAgY2VsbFlcbiAgICApO1xuICB9O1xuXG4gIHJldHVybiB7IGxpbmVzLCBzaGlwcywgaGl0T3JNaXNzLCBwbGFjZW1lbnRIaWdobGlnaHQsIGF0dGFja0hpZ2hsaWdodCB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZHJhdztcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vR2FtZWJvYXJkXCI7XG5cbi8qIEZhY3RvcnkgdGhhdCBjcmVhdGVzIGFuZCByZXR1cm5zIGEgcGxheWVyIG9iamVjdCB0aGF0IGNhbiB0YWtlIGEgc2hvdCBhdCBvcHBvbmVudCdzIGdhbWUgYm9hcmQuXG4gICBSZXF1aXJlcyBnYW1lTWFuYWdlciBmb3IgZ2FtZWJvYXJkIG1ldGhvZHMgKi9cbmNvbnN0IFBsYXllciA9IChnbSkgPT4ge1xuICBsZXQgcHJpdmF0ZU5hbWUgPSBcIlwiO1xuICBjb25zdCB0aGlzUGxheWVyID0ge1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgcmV0dXJuIHByaXZhdGVOYW1lO1xuICAgIH0sXG4gICAgc2V0IG5hbWUobmV3TmFtZSkge1xuICAgICAgaWYgKG5ld05hbWUpIHtcbiAgICAgICAgcHJpdmF0ZU5hbWUgPSBuZXdOYW1lLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2UgcHJpdmF0ZU5hbWUgPSBcIlwiO1xuICAgIH0sXG4gICAgZ2FtZWJvYXJkOiBHYW1lYm9hcmQoZ20pLFxuICAgIHNlbmRBdHRhY2s6IG51bGwsXG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGF0dGFjayBwb3NpdGlvbiBpcyBvbiBib2FyZFxuICBjb25zdCB2YWxpZGF0ZUF0dGFjayA9IChwb3NpdGlvbiwgZ2FtZWJvYXJkKSA9PiB7XG4gICAgLy8gRG9lcyBnYW1lYm9hcmQgZXhpc3Qgd2l0aCBtYXhCb2FyZFgveSBwcm9wZXJ0aWVzP1xuICAgIGlmICghZ2FtZWJvYXJkIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRYIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRZKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIElzIHBvc2l0aW9uIGNvbnN0cmFpbmVkIHRvIG1heGJvYXJkWC9ZIGFuZCBib3RoIGFyZSBpbnRzIGluIGFuIGFycmF5P1xuICAgIGlmIChcbiAgICAgIHBvc2l0aW9uICYmXG4gICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgIHBvc2l0aW9uWzBdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzBdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFggJiZcbiAgICAgIHBvc2l0aW9uWzFdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzFdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBzZW5kaW5nIGF0dGFjayB0byByaXZhbCBnYW1lYm9hcmRcbiAgdGhpc1BsYXllci5zZW5kQXR0YWNrID0gKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCA9IHRoaXNQbGF5ZXIuZ2FtZWJvYXJkKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRlQXR0YWNrKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCkpIHtcbiAgICAgIHBsYXllckJvYXJkLnJpdmFsQm9hcmQucmVjZWl2ZUF0dGFjayhwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB0aGlzUGxheWVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gQ29udGFpbnMgdGhlIG5hbWVzIGZvciB0aGUgc2hpcHMgYmFzZWQgb24gaW5kZXhcbmNvbnN0IHNoaXBOYW1lcyA9IHtcbiAgMTogXCJTZW50aW5lbCBQcm9iZVwiLFxuICAyOiBcIkFzc2F1bHQgVGl0YW5cIixcbiAgMzogXCJWaXBlciBNZWNoXCIsXG4gIDQ6IFwiSXJvbiBHb2xpYXRoXCIsXG4gIDU6IFwiTGV2aWF0aGFuXCIsXG59O1xuXG4vLyBGYWN0b3J5IHRoYXQgY2FuIGNyZWF0ZSBhbmQgcmV0dXJuIG9uZSBvZiBhIHZhcmlldHkgb2YgcHJlLWRldGVybWluZWQgc2hpcHMuXG5jb25zdCBTaGlwID0gKGluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKSA9PiB7XG4gIC8vIFZhbGlkYXRlIGluZGV4XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPiA1IHx8IGluZGV4IDwgMSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAvLyBDcmVhdGUgdGhlIHNoaXAgb2JqZWN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZFxuICBjb25zdCB0aGlzU2hpcCA9IHtcbiAgICBpbmRleCxcbiAgICBzaXplOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgaGl0czogMCxcbiAgICBoaXQ6IG51bGwsXG4gICAgaXNTdW5rOiBudWxsLFxuICAgIG9jY3VwaWVkQ2VsbHM6IFtdLFxuICB9O1xuXG4gIC8vIFNldCBzaGlwIHNpemVcbiAgc3dpdGNoIChpbmRleCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IGluZGV4O1xuICB9XG5cbiAgLy8gU2V0IHNoaXAgbmFtZSBiYXNlZCBvbiBpbmRleFxuICB0aGlzU2hpcC50eXBlID0gc2hpcE5hbWVzW3RoaXNTaGlwLmluZGV4XTtcblxuICAvLyBBZGRzIGEgaGl0IHRvIHRoZSBzaGlwXG4gIHRoaXNTaGlwLmhpdCA9ICgpID0+IHtcbiAgICB0aGlzU2hpcC5oaXRzICs9IDE7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lcyBpZiBzaGlwIHN1bmsgaXMgdHJ1ZVxuICB0aGlzU2hpcC5pc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXNTaGlwLmhpdHMgPj0gdGhpc1NoaXAuc2l6ZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIFBsYWNlbWVudCBkaXJlY3Rpb24gaXMgZWl0aGVyIDAgZm9yIGhvcml6b250YWwgb3IgMSBmb3IgdmVydGljYWxcbiAgbGV0IHBsYWNlbWVudERpcmVjdGlvblggPSAwO1xuICBsZXQgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDA7XG4gIGlmIChkaXJlY3Rpb24gPT09IDApIHtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25YID0gMTtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMDtcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDEpIHtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25YID0gMDtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMTtcbiAgfVxuXG4gIC8vIFVzZSBwb3NpdGlvbiBhbmQgZGlyZWN0aW9uIHRvIGFkZCBvY2N1cGllZCBjZWxscyBjb29yZHNcbiAgaWYgKFxuICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgIChkaXJlY3Rpb24gPT09IDEgfHwgZGlyZWN0aW9uID09PSAwKVxuICApIHtcbiAgICAvLyBEaXZpZGUgbGVuZ3RoIGludG8gaGFsZiBhbmQgcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZlNpemUgPSBNYXRoLmZsb29yKHRoaXNTaGlwLnNpemUgLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJTaXplID0gdGhpc1NoaXAuc2l6ZSAlIDI7XG4gICAgLy8gQWRkIGZpcnN0IGhhbGYgb2YgY2VsbHMgcGx1cyByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZlNpemUgKyByZW1haW5kZXJTaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gKyBpICogcGxhY2VtZW50RGlyZWN0aW9uWCxcbiAgICAgICAgcG9zaXRpb25bMV0gKyBpICogcGxhY2VtZW50RGlyZWN0aW9uWSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gICAgLy8gQWRkIHNlY29uZCBoYWxmIG9mIGNlbGxzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXdDb29yZHMgPSBbXG4gICAgICAgIHBvc2l0aW9uWzBdIC0gKGkgKyAxKSAqIHBsYWNlbWVudERpcmVjdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWzFdIC0gKGkgKyAxKSAqIHBsYWNlbWVudERpcmVjdGlvblksXG4gICAgICBdO1xuICAgICAgdGhpc1NoaXAub2NjdXBpZWRDZWxscy5wdXNoKG5ld0Nvb3Jkcyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNTaGlwO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgY2VsbFByb2JzIGZyb20gXCIuL2NlbGxQcm9ic1wiO1xuXG4vLyBNb2R1bGUgdGhhdCBhbGxvd3MgYWkgdG8gbWFrZSBhdHRhY2tzIGJhc2VkIG9uIHByb2JhYmlsaXR5IGEgY2VsbCB3aWxsIHJlc3VsdFxuLy8gaW4gYSBoaXQuIFVzZXMgQmF5ZXNpYW4gaW5mZXJlbmNlIGFsb25nIHdpdGggdHdvIEJhdHRsZXNoaXAgZ2FtZSB0aGVvcmllcy5cbmNvbnN0IHByb2JzID0gY2VsbFByb2JzKCk7XG5cbi8vIFRoaXMgaGVscGVyIHdpbGwgbG9vayBhdCBjdXJyZW50IGhpdHMgYW5kIG1pc3NlcyBhbmQgdGhlbiByZXR1cm4gYW4gYXR0YWNrXG5jb25zdCBhaUF0dGFjayA9IChnbSwgZGVsYXkpID0+IHtcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcbiAgbGV0IGF0dGFja0Nvb3JkcyA9IFtdO1xuXG4gIC8vIFVwZGF0ZSBjZWxsIGhpdCBwcm9iYWJpbGl0aWVzXG4gIHByb2JzLnVwZGF0ZVByb2JzKGdtKTtcblxuICAvLyBNZXRob2QgZm9yIHJldHVybmluZyByYW5kb20gYXR0YWNrXG4gIGNvbnN0IGZpbmRSYW5kb21BdHRhY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRXaWR0aCk7XG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRIZWlnaHQpO1xuICAgIGF0dGFja0Nvb3JkcyA9IFt4LCB5XTtcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCBmaW5kcyBsYXJnZXN0IHZhbHVlIGluIDJkIGFycmF5XG4gIGNvbnN0IGZpbmRHcmVhdGVzdFByb2JBdHRhY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgYWxsUHJvYnMgPSBwcm9icy5wcm9icztcbiAgICBsZXQgbWF4ID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxQcm9icy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhbGxQcm9ic1tpXS5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBpZiAoYWxsUHJvYnNbaV1bal0gPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSBhbGxQcm9ic1tpXVtqXTtcbiAgICAgICAgICBhdHRhY2tDb29yZHMgPSBbaSwgal07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmFuZG9tIGF0dGFjayBpZiBhaSBkaWZmaWN1bHR5IGlzIDFcbiAgaWYgKGdtLmFpRGlmZmljdWx0eSA9PT0gMSkge1xuICAgIC8vIFNldCByYW5kb20gYXR0YWNrICBjb29yZHMgdGhhdCBoYXZlIG5vdCBiZWVuIGF0dGFja2VkXG4gICAgZmluZFJhbmRvbUF0dGFjaygpO1xuICAgIHdoaWxlIChnbS51c2VyQm9hcmQuYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICAgIGZpbmRSYW5kb21BdHRhY2soKTtcbiAgICB9XG4gIH1cblxuICAvLyBEbyBhbiBhdHRhY2sgYmFzZWQgb24gcHJvYmFiaWxpdGllcyBpZiBhaSBkaWZmaWN1bHR5IGlzIDJcbiAgZWxzZSBpZiAoZ20uYWlEaWZmaWN1bHR5ID09PSAyKSB7XG4gICAgZmluZEdyZWF0ZXN0UHJvYkF0dGFjaygpO1xuICAgIHdoaWxlIChnbS51c2VyQm9hcmQuYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICAgIGZpbmRHcmVhdGVzdFByb2JBdHRhY2soKTtcbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGF0dGFjayB0byBnYW1lIG1hbmFnZXJcbiAgZ20uYWlBdHRhY2tpbmcoYXR0YWNrQ29vcmRzLCBkZWxheSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhaUF0dGFjaztcbiIsImNvbnN0IGNlbGxQcm9icyA9ICgpID0+IHtcbiAgLy8gTWV0aG9kIHRoYXQgY3JlYXRlcyBwcm9icyBhbmQgZGVmaW5lcyBpbml0aWFsIHByb2JhYmlsaXRpZXNcbiAgY29uc3QgY3JlYXRlUHJvYnMgPSAoKSA9PiB7XG4gICAgLy8gQ3JlYXRlIHRoZSBwcm9icy4gSXQgaXMgYSAxMHgxMCBncmlkIG9mIGNlbGxzLlxuICAgIGNvbnN0IGluaXRpYWxQcm9icyA9IFtdO1xuXG4gICAgLy8gSG93IG11Y2ggdG8gbW9kaWZ5IHRoZSB1bmZvY3VzZWQgY29sb3IgcHJvYmFiaWxpdGllc1xuICAgIGNvbnN0IGNvbG9yTW9kID0gMC41O1xuXG4gICAgLy8gUmFuZG9tbHkgZGVjaWRlIHdoaWNoIFwiY29sb3JcIiBvbiB0aGUgcHJvYnMgdG8gZmF2b3IgYnkgcmFuZG9tbHkgaW5pdGlhbGl6aW5nIGNvbG9yIHdlaWdodFxuICAgIGNvbnN0IGluaXRpYWxDb2xvcldlaWdodCA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogY29sb3JNb2Q7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBwcm9icyB3aXRoIDAnc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgICAgaW5pdGlhbFByb2JzLnB1c2goQXJyYXkoMTApLmZpbGwoMCkpO1xuICAgIH1cblxuICAgIC8vIEFzc2lnbiBpbml0aWFsIHByb2JhYmlsaXRpZXMgYmFzZWQgb24gQWxlbWkncyB0aGVvcnkgKDAuMDggaW4gY29ybmVycywgMC4yIGluIDQgY2VudGVyIGNlbGxzKVxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgLy8gT24gZXZlbiByb3dzIHN0YXJ0IHdpdGggYWx0ZXJuYXRlIGNvbG9yIHdlaWdodFxuICAgICAgbGV0IGNvbG9yV2VpZ2h0ID0gaW5pdGlhbENvbG9yV2VpZ2h0O1xuICAgICAgaWYgKHJvdyAlIDIgPT09IDApIHtcbiAgICAgICAgY29sb3JXZWlnaHQgPSBpbml0aWFsQ29sb3JXZWlnaHQgPT09IDEgPyBjb2xvck1vZCA6IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IDQuNTtcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IDQuNTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tQ2VudGVyID0gTWF0aC5zcXJ0KFxuICAgICAgICAgIChyb3cgLSBjZW50ZXJYKSAqKiAyICsgKGNvbCAtIGNlbnRlclkpICoqIDJcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHByb2JhYmlsaXR5IGJhc2VkIG9uIEV1Y2xpZGVhbiBkaXN0YW5jZSBmcm9tIGNlbnRlclxuICAgICAgICBjb25zdCBtaW5Qcm9iYWJpbGl0eSA9IDAuMDg7XG4gICAgICAgIGNvbnN0IG1heFByb2JhYmlsaXR5ID0gMC4yO1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eSA9XG4gICAgICAgICAgbWluUHJvYmFiaWxpdHkgK1xuICAgICAgICAgIChtYXhQcm9iYWJpbGl0eSAtIG1pblByb2JhYmlsaXR5KSAqXG4gICAgICAgICAgICAoMSAtIGRpc3RhbmNlRnJvbUNlbnRlciAvIE1hdGguc3FydCg0LjUgKiogMiArIDQuNSAqKiAyKSk7XG5cbiAgICAgICAgLy8gQWRqdXN0IHRoZSB3ZWlnaHRzIGJhc2VkIG9uIEJhcnJ5J3MgdGhlb3J5IChpZiBwcm9icyBpcyBjaGVja2VyIHByb2JzLCBwcmVmZXIgb25lIGNvbG9yKVxuICAgICAgICBjb25zdCBiYXJyeVByb2JhYmlsaXR5ID0gcHJvYmFiaWxpdHkgKiBjb2xvcldlaWdodDtcblxuICAgICAgICAvLyBBc3NpZ24gcHJvYmFiaWx0eSB0byB0aGUgcHJvYnNcbiAgICAgICAgaW5pdGlhbFByb2JzW3Jvd11bY29sXSA9IGJhcnJ5UHJvYmFiaWxpdHk7XG5cbiAgICAgICAgLy8gRmxpcCB0aGUgY29sb3Igd2VpZ2h0XG4gICAgICAgIGNvbG9yV2VpZ2h0ID0gY29sb3JXZWlnaHQgPT09IDEgPyBjb2xvck1vZCA6IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBpbml0aWFsaXplZCBwcm9ic1xuICAgIHJldHVybiBpbml0aWFsUHJvYnM7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBub3JtYWxpemluZyB0aGUgcHJvYmFiaWxpdGllc1xuICBjb25zdCBub3JtYWxpemVQcm9icyA9IChwcm9icykgPT4ge1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBzdW0gb2YgcHJvYmFiaWxpdGllcyBpbiB0aGUgcHJvYnNcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBwcm9icy5sZW5ndGg7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBwcm9ic1tyb3ddLmxlbmd0aDsgY29sICs9IDEpIHtcbiAgICAgICAgc3VtICs9IHByb2JzW3Jvd11bY29sXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHByb2JhYmlsaXRpZXNcbiAgICBjb25zdCBub3JtYWxpemVkUHJvYnMgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBwcm9icy5sZW5ndGg7IHJvdyArPSAxKSB7XG4gICAgICBub3JtYWxpemVkUHJvYnNbcm93XSA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgcHJvYnNbcm93XS5sZW5ndGg7IGNvbCArPSAxKSB7XG4gICAgICAgIG5vcm1hbGl6ZWRQcm9ic1tyb3ddW2NvbF0gPSBwcm9ic1tyb3ddW2NvbF0gLyBzdW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRQcm9icztcbiAgfTtcblxuICAvLyBDcmVhdGUgdGhlIHByb2JzXG4gIGNvbnN0IG5vbk5vcm1hbGl6ZWRQcm9icyA9IGNyZWF0ZVByb2JzKCk7XG4gIC8vIE5vcm1hbGl6ZSB0aGUgcHJvYmFiaWxpdGllc1xuICBjb25zdCBwcm9icyA9IG5vcm1hbGl6ZVByb2JzKG5vbk5vcm1hbGl6ZWRQcm9icyk7XG5cbiAgLy8gVGhlc2UgdmFsdWVzIGFyZSB1c2VkIGFzIHRoZSBldmlkZW5jZSB0byB1cGRhdGUgdGhlIHByb2JhYmlsaXRpZXMgb24gdGhlIHByb2JzXG4gIGxldCBzdW5rZW5TaGlwcztcbiAgbGV0IGhpdHM7XG4gIGxldCBtaXNzZXM7XG4gIC8vIE1ldGhvZCBmb3IgdXBkYXRpbmcgdGhlc2UgdmFsdWVzIGZyb20gdGhlIGdhbWUgbWFuYWdlclxuICBjb25zdCB1cGRhdGVFdmlkZW5jZSA9IChnbSkgPT4ge1xuICAgIHN1bmtlblNoaXBzID0gZ20udXNlckJvYXJkLnN1bmtlblNoaXBzO1xuICAgIGhpdHMgPSBnbS51c2VyQm9hcmQuaGl0cztcbiAgICBtaXNzZXMgPSBnbS51c2VyQm9hcmQubWlzc2VzO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IHVwZGF0ZXMgcHJvYmFiaWxpdGllcyBiYXNlZCBvbiBoaXRzLCBtaXNzZXMsIGFuZCByZW1haW5pbmcgc2hpcHMnIGxlbmd0aHNcbiAgY29uc3QgdXBkYXRlUHJvYnMgPSAoZ20pID0+IHtcbiAgICAvLyBGaXJzdCBnZXQgdGhlIHVwZGF0ZWQgZXZpZGVuY2VcbiAgICB1cGRhdGVFdmlkZW5jZShnbSk7XG4gICAgLy8gU2V0IHRoZSBwcm9iYWJpbGl0eSBvZiBldmVyeSBoaXQgYW5kIG1pc3NlZCBjZWxsIHRvIDAgdG8gcHJldmVudCB0aGF0IGNlbGwgZnJvbSBiZWluZyB0YXJnZXRlZFxuICAgIE9iamVjdC52YWx1ZXMoaGl0cykuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBoaXQ7XG4gICAgICBwcm9ic1t4XVt5XSA9IDA7XG4gICAgfSk7XG4gICAgT2JqZWN0LnZhbHVlcyhtaXNzZXMpLmZvckVhY2goKG1pc3MpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IG1pc3M7XG4gICAgICBwcm9ic1t4XVt5XSA9IDA7XG4gICAgfSk7XG4gICAgLy8gVXBkYXRlIHByb2JhYmlsaXR5IG9mIGNlbGxzIGFkamFjZW50IHRvIGhpdFxuICAgIC8qIElmIGhpdCBzdXJyb3VuZGVkIGJ5IG5vbi1hdHRhY2tlZCBjZWxscyB0aGVuIGluY3JlYXNlIGFkamFjZW50IHByb2JhYmlsaXRpZXMgYmFzZWRcbiAgICAgICBvbiBzdW5rZW5TaGlwcywgd2hlcmUgbW9yZSBjZWxscyBhd2F5IGZyb20gdGhlIGhpdCBhcmUgYWZmZWN0ZWQgaWYgbGFyZ2VyIHNoaXBzIHJlbWFpbi5cbiAgICAgICBUaGlzIHNob3VsZCBiZSBkb25lIGJ5IGhhdmluZyBhIHByb2IgbW9kIHRoYXQgaXMgcmVkdWNlZCBiYXNlZCBvbiBob3cgbWFueSBjZWxscyBhd2F5LlxuICAgICAgIElmIGhpdCBoYXMgYW5vdGhlciBoaXQgbmV4dCB0byBpdCB0aGVuIG9ubHkgaW5jcmVhc2UgdGhlIHByb2JhYmlsaXR5IG9mIHRoZSBjZWxscyBvbiB0aGF0XG4gICAgICAgYXhpcywgYW5kIGRlY3JlYXNlIHRoZSBwcm9iYWJpbGl0eSBvZiBhZGphY2VudCBjZWxscyBub3Qgb24gdGhhdCBheGlzIHRvIGFjY291bnQgZm9yIHByZXZpb3VzXG4gICAgICAgaW5jcmVhc2UgdGhhdCBub3cgc2hvdWxkIGJlIGRpc2NvdW50ZWQuICovXG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBkaXNwbGF5aW5nIHRoZSBwcm9ic1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgY29uc3QgbG9nUHJvYnMgPSAocHJvYnNUb0xvZykgPT4ge1xuICAgIC8vIExvZyB0aGUgcHJvYnNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUudGFibGUocHJvYnNUb0xvZyk7XG4gICAgLy8gTG9nIHRoZSB0b2FsIG9mIGFsbCBwcm9ic1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coXG4gICAgICBwcm9ic1RvTG9nLnJlZHVjZShcbiAgICAgICAgKHN1bSwgcm93KSA9PiBzdW0gKyByb3cucmVkdWNlKChyb3dTdW0sIHZhbHVlKSA9PiByb3dTdW0gKyB2YWx1ZSwgMCksXG4gICAgICAgIDBcbiAgICAgIClcbiAgICApO1xuICB9O1xuXG4gIC8vIGxvZ0JvYXJkKG5vcm1hbGl6ZWRCb2FyZCk7XG5cbiAgcmV0dXJuIHsgdXBkYXRlUHJvYnMsIHByb2JzIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjZWxsUHJvYnM7XG4iLCJpbXBvcnQgZ3JpZENhbnZhcyBmcm9tIFwiLi4vZmFjdG9yaWVzL0dyaWRDYW52YXMvR3JpZENhbnZhc1wiO1xuXG4vKiBUaGlzIG1vZHVsZSBjcmVhdGVzIGNhbnZhcyBlbGVtZW50cyBhbmQgYWRkcyB0aGVtIHRvIHRoZSBhcHByb3ByaWF0ZSBcbiAgIHBsYWNlcyBpbiB0aGUgRE9NLiAqL1xuY29uc3QgY2FudmFzQWRkZXIgPSAodXNlckdhbWVib2FyZCwgYWlHYW1lYm9hcmQsIHdlYkludGVyZmFjZSwgZ20pID0+IHtcbiAgLy8gUmVwbGFjZSB0aGUgdGhyZWUgZ3JpZCBwbGFjZWhvbGRlciBlbGVtZW50cyB3aXRoIHRoZSBwcm9wZXIgY2FudmFzZXNcbiAgLy8gUmVmcyB0byBET00gZWxlbWVudHNcbiAgY29uc3QgcGxhY2VtZW50UEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1jYW52YXMtcGhcIik7XG4gIGNvbnN0IHVzZXJQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlci1jYW52YXMtcGhcIik7XG4gIGNvbnN0IGFpUEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFpLWNhbnZhcy1waFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGNhbnZhc2VzXG5cbiAgY29uc3QgdXNlckNhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgZ20sXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwidXNlclwiIH0sXG4gICAgdXNlckdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2VcbiAgKTtcbiAgY29uc3QgYWlDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIGdtLFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcImFpXCIgfSxcbiAgICBhaUdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2VcbiAgKTtcbiAgY29uc3QgcGxhY2VtZW50Q2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICBnbSxcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJwbGFjZW1lbnRcIiB9LFxuICAgIHVzZXJHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlLFxuICAgIHVzZXJDYW52YXNcbiAgKTtcblxuICAvLyBSZXBsYWNlIHRoZSBwbGFjZSBob2xkZXJzXG4gIHBsYWNlbWVudFBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBsYWNlbWVudENhbnZhcywgcGxhY2VtZW50UEgpO1xuICB1c2VyUEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodXNlckNhbnZhcywgdXNlclBIKTtcbiAgYWlQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChhaUNhbnZhcywgYWlQSCk7XG5cbiAgLy8gUmV0dXJuIHRoZSBjYW52YXNlc1xuICByZXR1cm4geyBwbGFjZW1lbnRDYW52YXMsIHVzZXJDYW52YXMsIGFpQ2FudmFzIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjYW52YXNBZGRlcjtcbiIsImNvbnN0IGltYWdlTG9hZGVyID0gKCkgPT4ge1xuICBjb25zdCBpbWFnZVJlZnMgPSB7XG4gICAgU1A6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIEFUOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBWTTogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgSUc6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIEw6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICB9O1xuXG4gIGNvbnN0IGltYWdlQ29udGV4dCA9IHJlcXVpcmUuY29udGV4dChcIi4uL3NjZW5lLWltYWdlc1wiLCB0cnVlLCAvXFwuanBnJC9pKTtcbiAgY29uc3QgZmlsZXMgPSBpbWFnZUNvbnRleHQua2V5cygpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XG4gICAgY29uc3QgZmlsZVBhdGggPSBpbWFnZUNvbnRleHQoZmlsZSk7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBjb25zdCBzdWJEaXIgPSBmaWxlLnNwbGl0KFwiL1wiKVsxXS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgaWYgKGZpbGVOYW1lLmluY2x1ZGVzKFwiaGl0XCIpKSB7XG4gICAgICBpbWFnZVJlZnNbc3ViRGlyXS5oaXQucHVzaChmaWxlUGF0aCk7XG4gICAgfSBlbHNlIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcImF0dGFja1wiKSkge1xuICAgICAgaW1hZ2VSZWZzW3N1YkRpcl0uYXR0YWNrLnB1c2goZmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCJnZW5cIikpIHtcbiAgICAgIGltYWdlUmVmc1tzdWJEaXJdLmdlbi5wdXNoKGZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW1hZ2VSZWZzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW1hZ2VMb2FkZXI7XG4iLCJpbXBvcnQgcmFuZG9tU2hpcHMgZnJvbSBcIi4vcmFuZG9tU2hpcHNcIjtcblxuLy8gVGhpcyBoZWxwZXIgd2lsbCBhdHRlbXB0IHRvIGFkZCBzaGlwcyB0byB0aGUgYWkgZ2FtZWJvYXJkIGluIGEgdmFyaWV0eSBvZiB3YXlzIGZvciB2YXJ5aW5nIGRpZmZpY3VsdHlcbmNvbnN0IHBsYWNlQWlTaGlwcyA9IChwYXNzZWREaWZmLCBhaUdhbWVib2FyZCkgPT4ge1xuICAvLyBHcmlkIHNpemVcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcblxuICAvLyBQbGFjZSBhIHNoaXAgYWxvbmcgZWRnZXMgdW50aWwgb25lIHN1Y2Nlc3NmdWxseSBwbGFjZWQgP1xuICAvLyBQbGFjZSBhIHNoaXAgYmFzZWQgb24gcXVhZHJhbnQgP1xuXG4gIC8vIENvbWJpbmUgcGxhY2VtZW50IHRhY3RpY3MgdG8gY3JlYXRlIHZhcnlpbmcgZGlmZmljdWx0aWVzXG4gIGNvbnN0IHBsYWNlU2hpcHMgPSAoZGlmZmljdWx0eSkgPT4ge1xuICAgIC8vIFRvdGFsbHkgcmFuZG9tIHBhbGNlbWVudFxuICAgIGlmIChkaWZmaWN1bHR5ID09PSAxKSB7XG4gICAgICAvLyBQbGFjZSBzaGlwcyByYW5kb21seVxuICAgICAgcmFuZG9tU2hpcHMoYWlHYW1lYm9hcmQsIGdyaWRXaWR0aCwgZ3JpZEhlaWdodCk7XG4gICAgfVxuICB9O1xuXG4gIHBsYWNlU2hpcHMocGFzc2VkRGlmZik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwbGFjZUFpU2hpcHM7XG4iLCJjb25zdCByYW5kb21TaGlwcyA9IChnYW1lYm9hcmQsIGdyaWRYLCBncmlkWSkgPT4ge1xuICAvLyBFeGl0IGZyb20gcmVjdXJzaW9uXG4gIGlmIChnYW1lYm9hcmQuc2hpcHMubGVuZ3RoID4gNCkgcmV0dXJuO1xuICAvLyBHZXQgcmFuZG9tIHBsYWNlbWVudFxuICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZFgpO1xuICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZFkpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuXG4gIC8vIFRyeSB0aGUgcGxhY2VtZW50XG4gIGdhbWVib2FyZC5hZGRTaGlwKFt4LCB5XSwgZGlyZWN0aW9uKTtcblxuICAvLyBLZWVwIGRvaW5nIGl0IHVudGlsIGFsbCBzaGlwcyBhcmUgcGxhY2VkXG4gIHJhbmRvbVNoaXBzKGdhbWVib2FyZCwgZ3JpZFgsIGdyaWRZKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJhbmRvbVNoaXBzO1xuIiwiaW1wb3J0IGltYWdlTG9hZGVyIGZyb20gXCIuLi9oZWxwZXJzL2ltYWdlTG9hZGVyXCI7XG5cbmNvbnN0IGdhbWVMb2cgPSAoKHVzZXJOYW1lID0gXCJVc2VyXCIpID0+IHtcbiAgLy8gRmxhZyBmb3IgdHVybmluZyBvZmYgc2NlbmUgdXBkYXRlc1xuICBsZXQgZG9VcGRhdGVTY2VuZSA9IHRydWU7XG4gIC8vIEZsYWcgZm9yIGxvY2tpbmcgdGhlIGxvZ1xuICBsZXQgZG9Mb2NrID0gZmFsc2U7XG5cbiAgLy8gQWRkIGEgcHJvcGVydHkgdG8gc3RvcmUgdGhlIGdhbWVib2FyZFxuICBsZXQgdXNlckdhbWVib2FyZCA9IG51bGw7XG5cbiAgLy8gU2V0dGVyIG1ldGhvZCB0byBzZXQgdGhlIGdhbWVib2FyZFxuICBjb25zdCBzZXRVc2VyR2FtZWJvYXJkID0gKGdhbWVib2FyZCkgPT4ge1xuICAgIHVzZXJHYW1lYm9hcmQgPSBnYW1lYm9hcmQ7XG4gIH07XG5cbiAgLy8gUmVmIHRvIGxvZyB0ZXh0XG4gIGNvbnN0IGxvZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZy10ZXh0XCIpO1xuICBjb25zdCBsb2dJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjZW5lLWltZ1wiKTtcblxuICAvLyBMb2cgc2NlbmUgaGFuZGxpbmdcbiAgbGV0IHNjZW5lSW1hZ2VzID0gbnVsbDtcbiAgLy8gTWV0aG9kIGZvciBsb2FkaW5nIHNjZW5lIGltYWdlcy4gTXVzdCBiZSBydW4gb25jZSBpbiBnYW1lIG1hbmFnZXIuXG4gIGNvbnN0IGxvYWRTY2VuZXMgPSAoKSA9PiB7XG4gICAgc2NlbmVJbWFnZXMgPSBpbWFnZUxvYWRlcigpO1xuICB9O1xuXG4gIC8vIEdldHMgYSByYW5kb20gYXJyYXkgZW50cnlcbiAgZnVuY3Rpb24gcmFuZG9tRW50cnkoYXJyYXkpIHtcbiAgICBjb25zdCBsYXN0SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChsYXN0SW5kZXggKyAxKSk7XG4gICAgcmV0dXJuIHJhbmRvbU51bWJlcjtcbiAgfVxuXG4gIC8vIEdldHMgYSByYW5kb20gdXNlciBzaGlwIHRoYXQgaXNuJ3QgZGVzdHJveWVkXG4gIGNvbnN0IGRpck5hbWVzID0geyAwOiBcIlNQXCIsIDE6IFwiQVRcIiwgMjogXCJWTVwiLCAzOiBcIklHXCIsIDQ6IFwiTFwiIH07XG4gIGZ1bmN0aW9uIHJhbmRvbVNoaXBEaXIoZ2FtZWJvYXJkID0gdXNlckdhbWVib2FyZCkge1xuICAgIGxldCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KTtcbiAgICB3aGlsZSAoZ2FtZWJvYXJkLnNoaXBzW3JhbmRvbU51bWJlcl0uaXNTdW5rKCkpIHtcbiAgICAgIHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpO1xuICAgIH1cbiAgICByZXR1cm4gZGlyTmFtZXNbcmFuZG9tTnVtYmVyXTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemVzIHNjZW5lIGltYWdlIHRvIGdlbiBpbWFnZVxuICBjb25zdCBpbml0U2NlbmUgPSAoKSA9PiB7XG4gICAgLy8gZ2V0IHJhbmRvbSBzaGlwIGRpclxuICAgIGNvbnN0IHNoaXBEaXIgPSBkaXJOYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KV07XG4gICAgLy8gZ2V0IHJhbmRvbSBhcnJheSBlbnRyeVxuICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuKTtcbiAgICAvLyBzZXQgdGhlIGltYWdlXG4gICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbltlbnRyeV07XG4gIH07XG5cbiAgLy8gU2V0cyB0aGUgc2NlbmUgaW1hZ2UgYmFzZWQgb24gcGFyYW1zIHBhc3NlZFxuICBjb25zdCBzZXRTY2VuZSA9ICgpID0+IHtcbiAgICAvLyBSZXR1cm4gaWYgbG9nIGZsYWcgc2V0IHRvIG5vdCB1cGRhdGVcbiAgICBpZiAoIWRvVXBkYXRlU2NlbmUpIHJldHVybjtcbiAgICAvLyBTZXQgdGhlIHRleHQgdG8gbG93ZXJjYXNlIGZvciBjb21wYXJpc29uXG4gICAgY29uc3QgbG9nTG93ZXIgPSBsb2dUZXh0LnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBSZWZzIHRvIHNoaXAgdHlwZXMgYW5kIHRoZWlyIGRpcnNcbiAgICBjb25zdCBzaGlwVHlwZXMgPSBbXCJzZW50aW5lbFwiLCBcImFzc2F1bHRcIiwgXCJ2aXBlclwiLCBcImlyb25cIiwgXCJsZXZpYXRoYW5cIl07XG4gICAgY29uc3QgdHlwZVRvRGlyID0ge1xuICAgICAgc2VudGluZWw6IFwiU1BcIixcbiAgICAgIGFzc2F1bHQ6IFwiQVRcIixcbiAgICAgIHZpcGVyOiBcIlZNXCIsXG4gICAgICBpcm9uOiBcIklHXCIsXG4gICAgICBsZXZpYXRoYW46IFwiTFwiLFxuICAgIH07XG5cbiAgICAvLyBIZWxwZXIgZm9yIGdldHRpbmcgcmFuZG9tIHNoaXAgdHlwZSBmcm9tIHRob3NlIHJlbWFpbmluZ1xuXG4gICAgLy8gU2V0IHRoZSBpbWFnZSB3aGVuIHlvdSBhdHRhY2sgYmFzZWQgb24gcmVtYWluaW5nIHNoaXBzXG4gICAgaWYgKFxuICAgICAgbG9nTG93ZXIuaW5jbHVkZXModXNlck5hbWUudG9Mb3dlckNhc2UoKSkgJiZcbiAgICAgIGxvZ0xvd2VyLmluY2x1ZGVzKFwiYXR0YWNrc1wiKVxuICAgICkge1xuICAgICAgLy8gR2V0IHJhbmRvbSBzaGlwXG4gICAgICBjb25zdCBzaGlwRGlyID0gcmFuZG9tU2hpcERpcigpO1xuICAgICAgLy8gR2V0IHJhbmRvbSBpbWcgZnJvbSBhcHByb3ByaWF0ZSBwbGFjZVxuICAgICAgY29uc3QgZW50cnkgPSByYW5kb21FbnRyeShzY2VuZUltYWdlc1tzaGlwRGlyXS5hdHRhY2spO1xuICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmF0dGFja1tlbnRyeV07XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBpbWFnZSB3aGVuIHNoaXAgaGl0XG4gICAgaWYgKGxvZ0xvd2VyLmluY2x1ZGVzKFwiaGl0IHlvdXJcIikpIHtcbiAgICAgIHNoaXBUeXBlcy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIGlmIChsb2dMb3dlci5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgICAgIC8vIFNldCB0aGUgc2hpcCBkaXJlY3RvcnkgYmFzZWQgb24gdHlwZVxuICAgICAgICAgIGNvbnN0IHNoaXBEaXIgPSB0eXBlVG9EaXJbdHlwZV07XG4gICAgICAgICAgLy8gR2V0IGEgcmFuZG9tIGhpdCBlbnRyeVxuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uaGl0KTtcbiAgICAgICAgICAvLyBTZXQgdGhlIGltYWdlXG4gICAgICAgICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmhpdFtlbnRyeV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiB0aGVyZSBpcyBhbiBhaSBtaXNzIHRvIGdlbiBvZiByZW1haW5pbmcgc2hpcHNcbiAgICBpZiAobG9nTG93ZXIuaW5jbHVkZXMoXCJhaSBhdHRhY2tzXCIpICYmIGxvZ0xvd2VyLmluY2x1ZGVzKFwibWlzc2VkXCIpKSB7XG4gICAgICAvLyBHZXQgcmFuZG9tIHJlbWFpbmluZyBzaGlwIGRpclxuICAgICAgY29uc3Qgc2hpcERpciA9IHJhbmRvbVNoaXBEaXIoKTtcbiAgICAgIC8vIEdldCByYW5kb20gZW50cnkgZnJvbSB0aGVyZVxuICAgICAgY29uc3QgZW50cnkgPSByYW5kb21FbnRyeShzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW4pO1xuICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgbG9nSW1nLnNyYyA9IHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbltlbnRyeV07XG4gICAgfVxuICB9O1xuXG4gIC8vIEVyYXNlIHRoZSBsb2cgdGV4dFxuICBjb25zdCBlcmFzZSA9ICgpID0+IHtcbiAgICBpZiAoZG9Mb2NrKSByZXR1cm47XG4gICAgbG9nVGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gIH07XG5cbiAgLy8gQWRkIHRvIGxvZyB0ZXh0XG4gIGNvbnN0IGFwcGVuZCA9IChzdHJpbmdUb0FwcGVuZCkgPT4ge1xuICAgIGlmIChkb0xvY2spIHJldHVybjtcbiAgICBpZiAoc3RyaW5nVG9BcHBlbmQpIHtcbiAgICAgIGxvZ1RleHQuaW5uZXJIVE1MICs9IGBcXG4ke3N0cmluZ1RvQXBwZW5kLnRvU3RyaW5nKCl9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBlcmFzZSxcbiAgICBhcHBlbmQsXG4gICAgc2V0U2NlbmUsXG4gICAgbG9hZFNjZW5lcyxcbiAgICBzZXRVc2VyR2FtZWJvYXJkLFxuICAgIGluaXRTY2VuZSxcbiAgICBnZXQgZG9VcGRhdGVTY2VuZSgpIHtcbiAgICAgIHJldHVybiBkb1VwZGF0ZVNjZW5lO1xuICAgIH0sXG4gICAgc2V0IGRvVXBkYXRlU2NlbmUoYm9vbCkge1xuICAgICAgaWYgKGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZG9VcGRhdGVTY2VuZSA9IGJvb2w7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQgZG9Mb2NrKCkge1xuICAgICAgcmV0dXJuIGRvTG9jaztcbiAgICB9LFxuICAgIHNldCBkb0xvY2soYm9vbCkge1xuICAgICAgaWYgKGJvb2wgPT09IHRydWUgfHwgYm9vbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZG9Mb2NrID0gYm9vbDtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvZztcbiIsImltcG9ydCByYW5kb21TaGlwcyBmcm9tIFwiLi4vaGVscGVycy9yYW5kb21TaGlwc1wiO1xuXG4vKiBUaGlzIG1vZHVsZSBhbGxvd3MgdGhlIHZhcmlvdXMgb3RoZXIgZ2FtZSBtb2R1bGVzIHRvIGNvbW11bmljYXRlIGFuZCBvZmZlcnNcbiAgIGhpZ2ggbGV2ZWwgbWV0aG9kcyB0byBoYW5kbGUgdmFyaW91cyBnYW1lIGV2ZW50cy4gVGhpcyBvYmplY3Qgd2lsbCBiZSBwYXNzZWRcbiAgIHRvIG90aGVyIG1vZHVsZXMgYXMgcHJvcCBzbyB0aGV5IGNhbiB1c2UgdGhlc2UgbWV0aG9kcy4gKi9cbmNvbnN0IGdhbWVNYW5hZ2VyID0gKCkgPT4ge1xuICAvLyBHYW1lIHNldHRpbmdzXG4gIGxldCBhaURpZmZpY3VsdHkgPSAyO1xuXG4gIC8vIFJlZnMgdG8gcmVsZXZhbnQgZ2FtZSBvYmplY3RzXG4gIGxldCB1c2VyQm9hcmQgPSBudWxsO1xuICBsZXQgYWlCb2FyZCA9IG51bGw7XG4gIGxldCB1c2VyQ2FudmFzQ29udGFpbmVyID0gbnVsbDtcbiAgbGV0IGFpQ2FudmFzQ29udGFpbmVyID0gbnVsbDtcbiAgbGV0IHBsYWNlbWVudENhbnZhc0NvbnRhaW5lciA9IG51bGw7XG5cbiAgLy8gUmVmcyB0byBtb2R1bGVzXG4gIGxldCBzb3VuZFBsYXllciA9IG51bGw7XG4gIGxldCB3ZWJJbnRlcmZhY2UgPSBudWxsO1xuICBsZXQgZ2FtZUxvZyA9IG51bGw7XG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgQUkgQXR0YWNrc1xuICAvLyBBSSBBdHRhY2sgSGl0XG4gIGNvbnN0IGFpQXR0YWNrSGl0ID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFBsYXkgaGl0IHNvdW5kXG4gICAgc291bmRQbGF5ZXIucGxheUhpdCgpO1xuICAgIC8vIERyYXcgdGhlIGhpdCB0byBib2FyZFxuICAgIHVzZXJDYW52YXNDb250YWluZXIuZHJhd0hpdChhdHRhY2tDb29yZHMpO1xuICAgIC8vIExvZyB0aGUgaGl0XG4gICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgIGdhbWVMb2cuYXBwZW5kKFxuICAgICAgYEFJIGF0dGFja3MgY2VsbDogJHthdHRhY2tDb29yZHN9IFxcbkF0dGFjayBoaXQgeW91ciAke3VzZXJCb2FyZC5oaXRTaGlwVHlwZX0hYFxuICAgICk7XG4gICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgIC8vIExvZyBzdW5rIHVzZXIgc2hpcHNcbiAgICBjb25zdCBzdW5rTXNnID0gdXNlckJvYXJkLmxvZ1N1bmsoKTtcbiAgICBpZiAoc3Vua01zZyAhPT0gbnVsbCkge1xuICAgICAgZ2FtZUxvZy5hcHBlbmQoc3Vua01zZyk7XG4gICAgICAvLyBVcGRhdGUgbG9nIHNjZW5lXG4gICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgfVxuICAgIHVzZXJCb2FyZC5sb2dTdW5rKCk7XG4gICAgLy8gQ2hlY2sgaWYgQUkgd29uXG4gICAgaWYgKHVzZXJCb2FyZC5hbGxTdW5rKCkpIHtcbiAgICAgIC8vICcgICAgICAgICdcbiAgICAgIC8vIExvZyByZXN1bHRzXG4gICAgICBnYW1lTG9nLmFwcGVuZChcIkFsbCBVc2VyIHVuaXRzIGRlc3Ryb3llZC4gXFxuQUkgZG9taW5hbmNlIGlzIGFzc3VyZWQuXCIpO1xuICAgICAgLy8gU2V0IGdhbWUgb3ZlciBvbiBib2FyZHNcbiAgICAgIGFpQm9hcmQuZ2FtZU92ZXIgPSB0cnVlOyAvLyBBSSBib2FyZFxuICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTsgLy8gVXNlciBib2FyZFxuICAgIH1cbiAgfTtcblxuICAvLyBBSSBBdHRhY2sgTWlzc2VkXG4gIGNvbnN0IGFpQXR0YWNrTWlzc2VkID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFBsYXkgc291bmRcbiAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgIC8vIERyYXcgdGhlIG1pc3MgdG8gYm9hcmRcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdNaXNzKGF0dGFja0Nvb3Jkcyk7XG4gICAgLy8gTG9nIHRoZSBtaXNzXG4gICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgIGdhbWVMb2cuYXBwZW5kKGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfVxcbkF0dGFjayBtaXNzZWQhYCk7XG4gICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICB9O1xuXG4gIC8vIEFJIGlzIGF0dGFja2luZ1xuICBsZXQgYWlBdHRhY2tDb3VudCA9IDA7XG4gIGNvbnN0IGFpQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcywgZGVsYXkgPSAyNTAwKSA9PiB7XG4gICAgLy8gVGltZW91dCB0byBzaW11bGF0ZSBcInRoaW5raW5nXCIgYW5kIHRvIG1ha2UgZ2FtZSBmZWVsIGJldHRlclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gU2VuZCBhdHRhY2sgdG8gcml2YWwgYm9hcmRcbiAgICAgIHVzZXJCb2FyZFxuICAgICAgICAucmVjZWl2ZUF0dGFjayhhdHRhY2tDb29yZHMpXG4gICAgICAgIC8vIFRoZW4gZHJhdyBoaXRzIG9yIG1pc3Nlc1xuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYWlBdHRhY2tIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrTWlzc2VkKGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQnJlYWsgb3V0IG9mIHJlY3Vyc2lvbiBpZiBnYW1lIGlzIG92ZXJcbiAgICAgICAgICBpZiAodXNlckJvYXJkLmdhbWVPdmVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChgVG90YWwgQUkgYXR0YWNrczogJHthaUF0dGFja0NvdW50fWApO1xuICAgICAgICAgICAgZ2FtZUxvZy5kb0xvY2sgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFsbG93IHVzZXJCb2FyZCB0byBhdHRhY2sgYWdhaW5cbiAgICAgICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIElmIHVzZXIgYm9hcmQgaXMgQUkgY29udHJvbGxlZCBoYXZlIGl0IHRyeSBhbiBhdHRhY2tcbiAgICAgICAgICBpZiAodXNlckJvYXJkLmlzQWkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrQ291bnQgKz0gMTtcbiAgICAgICAgICAgIHVzZXJCb2FyZC50cnlBaUF0dGFjaygwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgUGxheWVyIEF0dGFja3NcbiAgY29uc3QgcGxheWVyQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFJldHVybiBpZiBnYW1lYm9hcmQgY2FuJ3QgYXR0YWNrXG4gICAgaWYgKGFpQm9hcmQucml2YWxCb2FyZC5jYW5BdHRhY2sgPT09IGZhbHNlKSByZXR1cm47XG4gICAgLy8gVHJ5IGF0dGFjayBhdCBjdXJyZW50IGNlbGxcbiAgICBpZiAoYWlCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgLy8gQmFkIHRoaW5nLiBFcnJvciBzb3VuZCBtYXliZS5cbiAgICB9IGVsc2UgaWYgKHVzZXJCb2FyZC5nYW1lT3ZlciA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIFNldCBnYW1lYm9hcmQgdG8gbm90IGJlIGFibGUgdG8gYXR0YWNrXG4gICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gZmFsc2U7XG4gICAgICAvLyBMb2cgdGhlIHNlbnQgYXR0YWNrXG4gICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICBnYW1lTG9nLmFwcGVuZChgVXNlciBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfWApO1xuICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgICAgLy8gUGxheSB0aGUgc291bmRcbiAgICAgIHNvdW5kUGxheWVyLnBsYXlBdHRhY2soKTtcbiAgICAgIC8vIFNlbmQgdGhlIGF0dGFja1xuICAgICAgYWlCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkcykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIFNldCBhIHRpbWVvdXQgZm9yIGRyYW1hdGljIGVmZmVjdFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBBdHRhY2sgaGl0XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gUGxheSBzb3VuZFxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheUhpdCgpO1xuICAgICAgICAgICAgLy8gRHJhdyBoaXQgdG8gYm9hcmRcbiAgICAgICAgICAgIGFpQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAgIC8vIExvZyBoaXRcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIGhpdCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgc3Vua2VuIHNoaXBzXG4gICAgICAgICAgICBjb25zdCBzdW5rTXNnID0gYWlCb2FyZC5sb2dTdW5rKCk7XG4gICAgICAgICAgICBpZiAoc3Vua01zZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChzdW5rTXNnKTtcbiAgICAgICAgICAgICAgLy8gVXBkYXRlIGxvZyBzY2VuZVxuICAgICAgICAgICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHBsYXllciB3b25cbiAgICAgICAgICAgIGlmIChhaUJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgICAgICAgICAgICBcIkFsbCBBSSB1bml0cyBkZXN0cm95ZWQuIFxcbkh1bWFuaXR5IHN1cnZpdmVzIGFub3RoZXIgZGF5Li4uXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgLy8gU2V0IGdhbWVvdmVyIG9uIGJvYXJkc1xuICAgICAgICAgICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBSSBkZXRybWluaW5nIGF0dGFjay4uLlwiKTtcbiAgICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgICBhaUJvYXJkLnRyeUFpQXR0YWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBQbGF5IHNvdW5kXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgICAgICAgICAgLy8gRHJhdyBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgICBhaUNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgICAgICAgICAgLy8gTG9nIG1pc3NcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIG1pc3NlZCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgYWlCb2FyZC50cnlBaUF0dGFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBzZXR0aW5nIHVwIGFuIEFJIHZzIEFJIG1hdGNoXG4gIGNvbnN0IGFpTWF0Y2hDbGlja2VkID0gKCkgPT4ge1xuICAgIC8vIFNldCB1c2VyIHRvIGFpXG4gICAgdXNlckJvYXJkLmlzQWkgPSB1c2VyQm9hcmQuaXNBaSAhPT0gdHJ1ZTtcbiAgICAvLyBTZXQgZ2FtZSBsb2cgdG8gbm90IHVwZGF0ZSBzY2VuZVxuICAgIGdhbWVMb2cuZG9VcGRhdGVTY2VuZSA9IGZhbHNlO1xuICAgIC8vIFNldCB0aGUgc291bmRzIHRvIG11dGVkXG4gICAgc291bmRQbGF5ZXIuaXNNdXRlZCA9IHNvdW5kUGxheWVyLmlzTXV0ZWQgIT09IHRydWU7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgU2hpcCBQbGFjZW1lbnQgYW5kIEdhbWUgU3RhcnRcbiAgLy8gQ2hlY2sgaWYgZ2FtZSBzaG91bGQgc3RhcnQgYWZ0ZXIgcGxhY2VtZW50XG4gIGNvbnN0IHRyeVN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgd2ViSW50ZXJmYWNlLnNob3dHYW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEhhbmRsZSByYW5kb20gc2hpcHMgYnV0dG9uIGNsaWNrXG4gIGNvbnN0IHJhbmRvbVNoaXBzQ2xpY2tlZCA9ICgpID0+IHtcbiAgICByYW5kb21TaGlwcyh1c2VyQm9hcmQsIHVzZXJCb2FyZC5tYXhCb2FyZFgsIHVzZXJCb2FyZC5tYXhCb2FyZFkpO1xuICAgIHVzZXJDYW52YXNDb250YWluZXIuZHJhd1NoaXBzKCk7XG4gICAgdHJ5U3RhcnRHYW1lKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJvdGF0ZSBidXR0b24gY2xpY2tzXG4gIGNvbnN0IHJvdGF0ZUNsaWNrZWQgPSAoKSA9PiB7XG4gICAgdXNlckJvYXJkLmRpcmVjdGlvbiA9IHVzZXJCb2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgICBhaUJvYXJkLmRpcmVjdGlvbiA9IGFpQm9hcmQuZGlyZWN0aW9uID09PSAwID8gMSA6IDA7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VtZW50Q2xpY2tlZCA9IChjZWxsKSA9PiB7XG4gICAgLy8gVHJ5IHBsYWNlbWVudFxuICAgIHVzZXJCb2FyZC5hZGRTaGlwKGNlbGwpO1xuICAgIHBsYWNlbWVudENhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMoKTtcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdTaGlwcygpO1xuICAgIHRyeVN0YXJ0R2FtZSgpO1xuICB9O1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgcmV0dXJuIHtcbiAgICBhaUF0dGFja2luZyxcbiAgICBwbGF5ZXJBdHRhY2tpbmcsXG4gICAgYWlNYXRjaENsaWNrZWQsXG4gICAgcGxhY2VtZW50Q2xpY2tlZCxcbiAgICByYW5kb21TaGlwc0NsaWNrZWQsXG4gICAgcm90YXRlQ2xpY2tlZCxcbiAgICBnZXQgYWlEaWZmaWN1bHR5KCkge1xuICAgICAgcmV0dXJuIGFpRGlmZmljdWx0eTtcbiAgICB9LFxuICAgIHNldCBhaURpZmZpY3VsdHkoZGlmZikge1xuICAgICAgaWYgKGRpZmYgPT09IDEgfHwgZGlmZiA9PT0gMiB8fCBkaWZmID09PSAzKSBhaURpZmZpY3VsdHkgPSBkaWZmO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJCb2FyZCgpIHtcbiAgICAgIHJldHVybiB1c2VyQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgdXNlckJvYXJkKGJvYXJkKSB7XG4gICAgICB1c2VyQm9hcmQgPSBib2FyZDtcbiAgICB9LFxuICAgIGdldCBhaUJvYXJkKCkge1xuICAgICAgcmV0dXJuIGFpQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgYWlCb2FyZChib2FyZCkge1xuICAgICAgYWlCb2FyZCA9IGJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJDYW52YXNDb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gdXNlckNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCB1c2VyQ2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgdXNlckNhbnZhc0NvbnRhaW5lciA9IGNhbnZhcztcbiAgICB9LFxuICAgIGdldCBhaUNhbnZhc0NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBhaUNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCBhaUNhbnZhc0NvbnRhaW5lcihjYW52YXMpIHtcbiAgICAgIGFpQ2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHBsYWNlbWVudENhbnZhc2NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBwbGFjZW1lbnRDYW52YXNDb250YWluZXI7XG4gICAgfSxcbiAgICBzZXQgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHNvdW5kUGxheWVyKCkge1xuICAgICAgcmV0dXJuIHNvdW5kUGxheWVyO1xuICAgIH0sXG4gICAgc2V0IHNvdW5kUGxheWVyKGFNb2R1bGUpIHtcbiAgICAgIHNvdW5kUGxheWVyID0gYU1vZHVsZTtcbiAgICB9LFxuICAgIGdldCB3ZWJJbnRlcmZhY2UoKSB7XG4gICAgICByZXR1cm4gd2ViSW50ZXJmYWNlO1xuICAgIH0sXG4gICAgc2V0IHdlYkludGVyZmFjZShhTW9kdWxlKSB7XG4gICAgICB3ZWJJbnRlcmZhY2UgPSBhTW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGdhbWVMb2coKSB7XG4gICAgICByZXR1cm4gZ2FtZUxvZztcbiAgICB9LFxuICAgIHNldCBnYW1lTG9nKGFNb2R1bGUpIHtcbiAgICAgIGdhbWVMb2cgPSBhTW9kdWxlO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTWFuYWdlcjtcbiIsImltcG9ydCBoaXRTb3VuZCBmcm9tIFwiLi4vU291bmQgRWZmZWN0cy9leHBsb3Npb24ubXAzXCI7XG5pbXBvcnQgbWlzc1NvdW5kIGZyb20gXCIuLi9Tb3VuZCBFZmZlY3RzL21pc3MubXAzXCI7XG5pbXBvcnQgYXR0YWNrU291bmQgZnJvbSBcIi4uL1NvdW5kIEVmZmVjdHMvbGFzZXIubXAzXCI7XG5cbmNvbnN0IGF0dGFja0F1ZGlvID0gbmV3IEF1ZGlvKGF0dGFja1NvdW5kKTtcbmNvbnN0IGhpdEF1ZGlvID0gbmV3IEF1ZGlvKGhpdFNvdW5kKTtcbmNvbnN0IG1pc3NBdWRpbyA9IG5ldyBBdWRpbyhtaXNzU291bmQpO1xuXG5jb25zdCBzb3VuZHMgPSAoKSA9PiB7XG4gIC8vIEZsYWcgZm9yIG11dGluZ1xuICBsZXQgaXNNdXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHBsYXlIaXQgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBoaXRBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgaGl0QXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlNaXNzID0gKCkgPT4ge1xuICAgIGlmIChpc011dGVkKSByZXR1cm47XG4gICAgLy8gUmVzZXQgYXVkaW8gdG8gYmVnaW5uaW5nIGFuZCBwbGF5IGl0XG4gICAgbWlzc0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICBtaXNzQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlBdHRhY2sgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBhdHRhY2tBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgYXR0YWNrQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxheUhpdCxcbiAgICBwbGF5TWlzcyxcbiAgICBwbGF5QXR0YWNrLFxuICAgIGdldCBpc011dGVkKCkge1xuICAgICAgcmV0dXJuIGlzTXV0ZWQ7XG4gICAgfSxcbiAgICBzZXQgaXNNdXRlZChib29sKSB7XG4gICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSkgaXNNdXRlZCA9IGJvb2w7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvdW5kcztcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vKiBUaGlzIG1vZHVsZSBoYXMgdGhyZWUgcHJpbWFyeSBmdW5jdGlvbnM6XG4gICAxLiBHZXQgc2hpcCBwbGFjZW1lbnQgY29vcmRpbmF0ZXMgZnJvbSB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciBjbGlja3Mgb24gdGhlIHdlYiBpbnRlcmZhY2VcbiAgIDIuIEdldCBhdHRhY2sgcGxhY2VtZW50IGNvb3JkaW5hdGVzIGZyb20gdGhlIHVzZXIgYmFzZWQgb24gdGhlIHNhbWVcbiAgIDMuIE90aGVyIG1pbm9yIGludGVyZmFjZSBhY3Rpb25zIHN1Y2ggYXMgaGFuZGxpbmcgYnV0dG9uIGNsaWNrcyAoc3RhcnQgZ2FtZSwgcmVzdGFydCwgZXRjKSAqL1xuY29uc3Qgd2ViSW50ZXJmYWNlID0gKGdtKSA9PiB7XG4gIC8vIFJlZmVyZW5jZXMgdG8gbWFpbiBlbGVtZW50c1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XG4gIGNvbnN0IHBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50XCIpO1xuICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuXG4gIC8vIFJlZmVyZW5jZSB0byBidG4gZWxlbWVudHNcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0LWJ0blwiKTtcbiAgY29uc3QgYWlNYXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktbWF0Y2gtYnRuXCIpO1xuXG4gIGNvbnN0IHJhbmRvbVNoaXBzQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yYW5kb20tc2hpcHMtYnRuXCIpO1xuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idG5cIik7XG5cbiAgLy8gTWV0aG9kIGZvciBpdGVyYXRpbmcgdGhyb3VnaCBkaXJlY3Rpb25zXG4gIGNvbnN0IHJvdGF0ZURpcmVjdGlvbiA9ICgpID0+IHtcbiAgICBnbS5yb3RhdGVDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBCYXNpYyBtZXRob2RzIGZvciBzaG93aW5nL2hpZGluZyBlbGVtZW50c1xuICAvLyBNb3ZlIGFueSBhY3RpdmUgc2VjdGlvbnMgb2ZmIHRoZSBzY3JlZW5cbiAgY29uc3QgaGlkZUFsbCA9ICgpID0+IHtcbiAgICBtZW51LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgcGxhY2VtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZ2FtZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIG1lbnUgVUlcbiAgY29uc3Qgc2hvd01lbnUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIG1lbnUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBzaGlwIHBsYWNlbWVudCBVSVxuICBjb25zdCBzaG93UGxhY2VtZW50ID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBnYW1lIFVJXG4gIGNvbnN0IHNob3dHYW1lID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQWlNYXRjaENsaWNrID0gKCkgPT4ge1xuICAgIC8vIFNldCBzdHlsZSBjbGFzcyBiYXNlZCBvbiBpZiB1c2VyQm9hcmQgaXMgYWkgKGlmIGZhbHNlLCBzZXQgYWN0aXZlIGIvYyB3aWxsIGJlIHRydWUgYWZ0ZXIgY2xpY2spXG4gICAgaWYgKGdtLnVzZXJCb2FyZC5pc0FpID09PSBmYWxzZSkgYWlNYXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIGVsc2UgYWlNYXRjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIGdtLmFpTWF0Y2hDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJhbmRvbSBzaGlwcyBidXR0b24gY2xpY2tcbiAgY29uc3QgaGFuZGxlUmFuZG9tU2hpcHNDbGljayA9ICgpID0+IHtcbiAgICBnbS5yYW5kb21TaGlwc0NsaWNrZWQoKTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBZGQgY2xhc3NlcyB0byBzaGlwIGRpdnMgdG8gcmVwcmVzZW50IHBsYWNlZC9kZXN0cm95ZWRcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gSGFuZGxlIGJyb3dzZXIgZXZlbnRzXG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUm90YXRlQ2xpY2spO1xuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU3RhcnRDbGljayk7XG4gIGFpTWF0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUFpTWF0Y2hDbGljayk7XG4gIHJhbmRvbVNoaXBzQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVSYW5kb21TaGlwc0NsaWNrKTtcblxuICByZXR1cm4geyBzaG93R2FtZSwgc2hvd01lbnUsIHNob3dQbGFjZW1lbnQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdlYkludGVyZmFjZTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcbiAgIHYyLjAgfCAyMDExMDEyNlxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcbiovXG5cbmh0bWwsXG5ib2R5LFxuZGl2LFxuc3BhbixcbmFwcGxldCxcbm9iamVjdCxcbmlmcmFtZSxcbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnAsXG5ibG9ja3F1b3RlLFxucHJlLFxuYSxcbmFiYnIsXG5hY3JvbnltLFxuYWRkcmVzcyxcbmJpZyxcbmNpdGUsXG5jb2RlLFxuZGVsLFxuZGZuLFxuZW0sXG5pbWcsXG5pbnMsXG5rYmQsXG5xLFxucyxcbnNhbXAsXG5zbWFsbCxcbnN0cmlrZSxcbnN0cm9uZyxcbnN1YixcbnN1cCxcbnR0LFxudmFyLFxuYixcbnUsXG5pLFxuY2VudGVyLFxuZGwsXG5kdCxcbmRkLFxub2wsXG51bCxcbmxpLFxuZmllbGRzZXQsXG5mb3JtLFxubGFiZWwsXG5sZWdlbmQsXG50YWJsZSxcbmNhcHRpb24sXG50Ym9keSxcbnRmb290LFxudGhlYWQsXG50cixcbnRoLFxudGQsXG5hcnRpY2xlLFxuYXNpZGUsXG5jYW52YXMsXG5kZXRhaWxzLFxuZW1iZWQsXG5maWd1cmUsXG5maWdjYXB0aW9uLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbm91dHB1dCxcbnJ1YnksXG5zZWN0aW9uLFxuc3VtbWFyeSxcbnRpbWUsXG5tYXJrLFxuYXVkaW8sXG52aWRlbyB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyOiAwO1xuICBmb250LXNpemU6IDEwMCU7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cbmFydGljbGUsXG5hc2lkZSxcbmRldGFpbHMsXG5maWdjYXB0aW9uLFxuZmlndXJlLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbnNlY3Rpb24ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cbmJvZHkge1xuICBsaW5lLWhlaWdodDogMTtcbn1cbm9sLFxudWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuYmxvY2txdW90ZSxcbnEge1xuICBxdW90ZXM6IG5vbmU7XG59XG5ibG9ja3F1b3RlOmJlZm9yZSxcbmJsb2NrcXVvdGU6YWZ0ZXIsXG5xOmJlZm9yZSxcbnE6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBjb250ZW50OiBub25lO1xufVxudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlL3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0NBR0M7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlGRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLFNBQVM7RUFDVCxlQUFlO0VBQ2YsYUFBYTtFQUNiLHdCQUF3QjtBQUMxQjtBQUNBLGdEQUFnRDtBQUNoRDs7Ozs7Ozs7Ozs7RUFXRSxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCO0FBQ0E7O0VBRUUsZ0JBQWdCO0FBQ2xCO0FBQ0E7O0VBRUUsWUFBWTtBQUNkO0FBQ0E7Ozs7RUFJRSxXQUFXO0VBQ1gsYUFBYTtBQUNmO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIsaUJBQWlCO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxcbiAgIHYyLjAgfCAyMDExMDEyNlxcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXFxuKi9cXG5cXG5odG1sLFxcbmJvZHksXFxuZGl2LFxcbnNwYW4sXFxuYXBwbGV0LFxcbm9iamVjdCxcXG5pZnJhbWUsXFxuaDEsXFxuaDIsXFxuaDMsXFxuaDQsXFxuaDUsXFxuaDYsXFxucCxcXG5ibG9ja3F1b3RlLFxcbnByZSxcXG5hLFxcbmFiYnIsXFxuYWNyb255bSxcXG5hZGRyZXNzLFxcbmJpZyxcXG5jaXRlLFxcbmNvZGUsXFxuZGVsLFxcbmRmbixcXG5lbSxcXG5pbWcsXFxuaW5zLFxcbmtiZCxcXG5xLFxcbnMsXFxuc2FtcCxcXG5zbWFsbCxcXG5zdHJpa2UsXFxuc3Ryb25nLFxcbnN1YixcXG5zdXAsXFxudHQsXFxudmFyLFxcbmIsXFxudSxcXG5pLFxcbmNlbnRlcixcXG5kbCxcXG5kdCxcXG5kZCxcXG5vbCxcXG51bCxcXG5saSxcXG5maWVsZHNldCxcXG5mb3JtLFxcbmxhYmVsLFxcbmxlZ2VuZCxcXG50YWJsZSxcXG5jYXB0aW9uLFxcbnRib2R5LFxcbnRmb290LFxcbnRoZWFkLFxcbnRyLFxcbnRoLFxcbnRkLFxcbmFydGljbGUsXFxuYXNpZGUsXFxuY2FudmFzLFxcbmRldGFpbHMsXFxuZW1iZWQsXFxuZmlndXJlLFxcbmZpZ2NhcHRpb24sXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxub3V0cHV0LFxcbnJ1YnksXFxuc2VjdGlvbixcXG5zdW1tYXJ5LFxcbnRpbWUsXFxubWFyayxcXG5hdWRpbyxcXG52aWRlbyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xcbmFydGljbGUsXFxuYXNpZGUsXFxuZGV0YWlscyxcXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5ib2R5IHtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5vbCxcXG51bCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlLFxcbnEge1xcbiAgcXVvdGVzOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlOmJlZm9yZSxcXG5ibG9ja3F1b3RlOmFmdGVyLFxcbnE6YmVmb3JlLFxcbnE6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBjb250ZW50OiBub25lO1xcbn1cXG50YWJsZSB7XFxuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogQ29sb3IgUnVsZXMgKi9cbjpyb290IHtcbiAgLS1jb2xvckExOiAjNzIyYjk0O1xuICAtLWNvbG9yQTI6ICNhOTM2ZTA7XG4gIC0tY29sb3JDOiAjMzdlMDJiO1xuICAtLWNvbG9yQjE6ICM5NDFkMGQ7XG4gIC0tY29sb3JCMjogI2UwMzYxZjtcblxuICAtLWJnLWNvbG9yOiBoc2woMCwgMCUsIDIyJSk7XG4gIC0tYmctY29sb3IyOiBoc2woMCwgMCUsIDMyJSk7XG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xuICAtLWxpbmstY29sb3I6IGhzbCgzNiwgOTIlLCA1OSUpO1xufVxuXG4vKiAjcmVnaW9uIFVuaXZlcnNhbCBlbGVtZW50IHJ1bGVzICovXG5hIHtcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xufVxuXG5ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIGhlaWdodDogMTAwdmg7XG4gIHdpZHRoOiAxMDB2dztcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbn1cblxuLmNhbnZhcy1jb250YWluZXIge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbiAgaGVpZ2h0OiBmaXQtY29udGVudDtcbn1cblxuLmNhbnZhcy1jb250YWluZXIgPiAqIHtcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcbiAgZ3JpZC1jb2x1bW46IC0xIC8gMTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIG1haW4tY29udGVudCAqL1xuLm1haW4tY29udGVudCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyMCwgNSUpIC8gcmVwZWF0KDIwLCA1JSk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vKiB0aXRsZSBncmlkICovXG4udGl0bGUge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogMiAvIDY7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuOHMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcbn1cblxuLnRpdGxlLXRleHQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXNpemU6IDQuOHJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDJweCB2YXIoLS1jb2xvckIxKTtcbiAgY29sb3I6IHZhcigtLWNvbG9yQjIpO1xuXG4gIHRyYW5zaXRpb246IGZvbnQtc2l6ZSAwLjhzIGVhc2UtaW4tb3V0O1xufVxuXG4udGl0bGUuc2hyaW5rIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjUpIHRyYW5zbGF0ZVkoLTUwJSk7XG59XG5cbi50aXRsZS5zaHJpbmsgLnRpdGxlLXRleHQge1xuICBmb250LXNpemU6IDMuNXJlbTtcbn1cbi8qICNyZWdpb24gbWVudSBzZWN0aW9uICovXG4ubWVudSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiA4IC8gMTg7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgNSUgMWZyIDUlIDFmciA1JSAxZnIgLyAxZnI7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuXCJcbiAgICBcImNyZWRpdHNcIlxuICAgIFwiLlwiXG4gICAgXCJzdGFydC1nYW1lXCJcbiAgICBcIi5cIlxuICAgIFwiYWktbWF0Y2hcIlxuICAgIFwiLlwiXG4gICAgXCJvcHRpb25zXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5tZW51LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XG59XG5cbi5tZW51IC5jcmVkaXRzIHtcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xufVxuXG4ubWVudSAuc3RhcnQge1xuICBncmlkLWFyZWE6IHN0YXJ0LWdhbWU7XG4gIGFsaWduLXNlbGY6IGVuZDtcbn1cblxuLm1lbnUgLmFpLW1hdGNoIHtcbiAgZ3JpZC1hcmVhOiBhaS1tYXRjaDtcbn1cblxuLm1lbnUgLm9wdGlvbnMge1xuICBncmlkLWFyZWE6IG9wdGlvbnM7XG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xufVxuXG4ubWVudSAuc3RhcnQtYnRuLFxuLm1lbnUgLm9wdGlvbnMtYnRuLFxuLm1lbnUgLmFpLW1hdGNoLWJ0biB7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDE4MHB4O1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxuLm1lbnUgLm9wdGlvbnMtYnRuOmhvdmVyLFxuLm1lbnUgLmFpLW1hdGNoLWJ0bjpob3ZlciB7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ubWVudSAuYWktbWF0Y2gtYnRuLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQjEpO1xufVxuXG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cbi5wbGFjZW1lbnQge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogNiAvIDIwO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgNSUgbWluLWNvbnRlbnQgNSUgLyAxZnIgNSUgMWZyO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxuICAgIFwiLiAuIC5cIlxuICAgIFwiaW5zdHJ1Y3Rpb25zIGluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnNcIlxuICAgIFwiLiAuIC5cIlxuICAgIFwic2hpcHMgc2hpcHMgc2hpcHNcIlxuICAgIFwiLiAuIC4gXCJcbiAgICBcInJhbmRvbSAuIHJvdGF0ZVwiXG4gICAgXCIuIC4gLlwiXG4gICAgXCJjYW52YXMgY2FudmFzIGNhbnZhc1wiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xufVxuXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMge1xuICBncmlkLWFyZWE6IGluc3RydWN0aW9ucztcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zLXRleHQge1xuICBmb250LXNpemU6IDIuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XG59XG5cbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcbiAgZ3JpZC1hcmVhOiBzaGlwcztcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcbn1cblxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzIHtcbiAgZ3JpZC1hcmVhOiByYW5kb207XG4gIGp1c3RpZnktc2VsZjogZW5kO1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUge1xuICBncmlkLWFyZWE6IHJvdGF0ZTtcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bixcbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcy1idG4ge1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxODBweDtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3Zlcixcbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcy1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUsXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmFjdGl2ZSB7XG4gIHRleHQtc2hhZG93OiA0cHggNHB4IDFweCB2YXIoLS1jb2xvckMpLCAtNHB4IC00cHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4ucGxhY2VtZW50IC5wbGFjZW1lbnQtY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogY2FudmFzO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLnBsYWNlbWVudC5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTUwJSk7XG59XG5cbi5wbGFjZW1lbnQgLmNhbnZhcy1jb250YWluZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckMpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIGdhbWUgc2VjdGlvbiAqL1xuLmdhbWUge1xuICBncmlkLWNvbHVtbjogMiAvIDIwO1xuICBncmlkLXJvdzogNSAvIDIwO1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlOlxuICAgIHJlcGVhdCgyLCBtaW5tYXgoMTBweCwgMWZyKSBtaW4tY29udGVudCkgbWlubWF4KDEwcHgsIDFmcilcbiAgICBtaW4tY29udGVudCAxZnIgLyByZXBlYXQoNCwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwiLiBsb2cgbG9nIC5cIlxuICAgIFwiLiAuIC4gLlwiXG4gICAgXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcIlxuICAgIFwiLiAuIC4gLlwiXG4gICAgXCJ1c2VyLWluZm8gdXNlci1pbmZvIGFpLWluZm8gYWktaW5mb1wiXG4gICAgXCIuIC4gLiAuXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5nYW1lIC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG59XG5cbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XG59XG5cbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiBhaS1ib2FyZDtcbn1cblxuLmdhbWUgLnVzZXItaW5mbyB7XG4gIGdyaWQtYXJlYTogdXNlci1pbmZvO1xufVxuXG4uZ2FtZSAuYWktaW5mbyB7XG4gIGdyaWQtYXJlYTogYWktaW5mbztcbn1cblxuLmdhbWUgLnBsYXllci1zaGlwcyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5nYW1lIC5sb2cge1xuICBncmlkLWFyZWE6IGxvZztcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gbWluLWNvbnRlbnQgMTBweCAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFwic2NlbmUgLiB0ZXh0XCI7XG5cbiAgd2lkdGg6IDUwMHB4O1xuXG4gIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWNvbG9yQjEpO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xufVxuXG4uZ2FtZSAubG9nIC5zY2VuZSB7XG4gIGdyaWQtYXJlYTogc2NlbmU7XG5cbiAgaGVpZ2h0OiAxNTBweDtcbiAgd2lkdGg6IDE1MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcbn1cblxuLmdhbWUgLmxvZyAuc2NlbmUtaW1nIHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmdhbWUgLmxvZyAubG9nLXRleHQge1xuICBncmlkLWFyZWE6IHRleHQ7XG4gIGZvbnQtc2l6ZTogMS4xNXJlbTtcbiAgd2hpdGUtc3BhY2U6IHByZTsgLyogQWxsb3dzIGZvciBcXFxcbiAqL1xufVxuXG4uZ2FtZS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTUwJSk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNlbmRyZWdpb24gKi9cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxnQkFBZ0I7QUFDaEI7RUFDRSxrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsa0JBQWtCOztFQUVsQiwyQkFBMkI7RUFDM0IsNEJBQTRCO0VBQzVCLDZCQUE2QjtFQUM3QiwrQkFBK0I7QUFDakM7O0FBRUEsb0NBQW9DO0FBQ3BDO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsaUNBQWlDO0VBQ2pDLHdCQUF3QjtFQUN4QixhQUFhO0VBQ2IsWUFBWTtFQUNaLGdCQUFnQjs7RUFFaEIseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHdCQUF3QjtFQUN4QixrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtBQUNyQjs7QUFFQSxlQUFlOztBQUVmLHlCQUF5QjtBQUN6QjtFQUNFLGFBQWE7RUFDYiw4Q0FBOEM7RUFDOUMsa0JBQWtCOztFQUVsQixZQUFZO0VBQ1os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O0VBQ1osZ0NBQWdDO0FBQ2xDOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7RUFDbEIsZ0JBQWdCLEVBQUUsa0JBQWtCO0FBQ3RDOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCO0FBQ0EsZUFBZTs7QUFFZixlQUFlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIENvbG9yIFJ1bGVzICovXFxuOnJvb3Qge1xcbiAgLS1jb2xvckExOiAjNzIyYjk0O1xcbiAgLS1jb2xvckEyOiAjYTkzNmUwO1xcbiAgLS1jb2xvckM6ICMzN2UwMmI7XFxuICAtLWNvbG9yQjE6ICM5NDFkMGQ7XFxuICAtLWNvbG9yQjI6ICNlMDM2MWY7XFxuXFxuICAtLWJnLWNvbG9yOiBoc2woMCwgMCUsIDIyJSk7XFxuICAtLWJnLWNvbG9yMjogaHNsKDAsIDAlLCAzMiUpO1xcbiAgLS10ZXh0LWNvbG9yOiBoc2woMCwgMCUsIDkxJSk7XFxuICAtLWxpbmstY29sb3I6IGhzbCgzNiwgOTIlLCA1OSUpO1xcbn1cXG5cXG4vKiAjcmVnaW9uIFVuaXZlcnNhbCBlbGVtZW50IHJ1bGVzICovXFxuYSB7XFxuICBjb2xvcjogdmFyKC0tbGluay1jb2xvcik7XFxufVxcblxcbmJvZHkge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuXFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG59XFxuXFxuLmNhbnZhcy1jb250YWluZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIDFmcjtcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5jYW52YXMtY29udGFpbmVyID4gKiB7XFxuICBncmlkLXJvdzogLTEgLyAxO1xcbiAgZ3JpZC1jb2x1bW46IC0xIC8gMTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXFxuLm1haW4tY29udGVudCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4vKiB0aXRsZSBncmlkICovXFxuLnRpdGxlIHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogMiAvIDY7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IyKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcblxcbi50aXRsZS10ZXh0IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogNC44cmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggdmFyKC0tY29sb3JCMSk7XFxuICBjb2xvcjogdmFyKC0tY29sb3JCMik7XFxuXFxuICB0cmFuc2l0aW9uOiBmb250LXNpemUgMC44cyBlYXNlLWluLW91dDtcXG59XFxuXFxuLnRpdGxlLnNocmluayB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDAuNSkgdHJhbnNsYXRlWSgtNTAlKTtcXG59XFxuXFxuLnRpdGxlLnNocmluayAudGl0bGUtdGV4dCB7XFxuICBmb250LXNpemU6IDMuNXJlbTtcXG59XFxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cXG4ubWVudSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDggLyAxODtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCA1JSAxZnIgNSUgMWZyIDUlIDFmciAvIDFmcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcImNyZWRpdHNcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwic3RhcnQtZ2FtZVxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJhaS1tYXRjaFxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJvcHRpb25zXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4ubWVudS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xNTAlKTtcXG59XFxuXFxuLm1lbnUgLmNyZWRpdHMge1xcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xcbn1cXG5cXG4ubWVudSAuc3RhcnQge1xcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xcbiAgYWxpZ24tc2VsZjogZW5kO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gge1xcbiAgZ3JpZC1hcmVhOiBhaS1tYXRjaDtcXG59XFxuXFxuLm1lbnUgLm9wdGlvbnMge1xcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG4sXFxuLm1lbnUgLm9wdGlvbnMtYnRuLFxcbi5tZW51IC5haS1tYXRjaC1idG4ge1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgd2lkdGg6IDE4MHB4O1xcblxcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxcbi5tZW51IC5vcHRpb25zLWJ0bjpob3ZlcixcXG4ubWVudSAuYWktbWF0Y2gtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ubWVudSAuYWktbWF0Y2gtYnRuLmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcXG59XFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cXG4ucGxhY2VtZW50IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogNiAvIDIwO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgNSUgbWluLWNvbnRlbnQgNSUgLyAxZnIgNSUgMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLlxcXCJcXG4gICAgXFxcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXFxcIlxcbiAgICBcXFwiLiAuIC5cXFwiXFxuICAgIFxcXCJzaGlwcyBzaGlwcyBzaGlwc1xcXCJcXG4gICAgXFxcIi4gLiAuIFxcXCJcXG4gICAgXFxcInJhbmRvbSAuIHJvdGF0ZVxcXCJcXG4gICAgXFxcIi4gLiAuXFxcIlxcbiAgICBcXFwiY2FudmFzIGNhbnZhcyBjYW52YXNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcXG4gIGdyaWQtYXJlYTogaW5zdHJ1Y3Rpb25zO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMtdGV4dCB7XFxuICBmb250LXNpemU6IDIuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMXB4IHZhcigtLWJnLWNvbG9yKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuc2hpcHMtdG8tcGxhY2Uge1xcbiAgZ3JpZC1hcmVhOiBzaGlwcztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMge1xcbiAgZ3JpZC1hcmVhOiByYW5kb207XFxuICBqdXN0aWZ5LXNlbGY6IGVuZDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlIHtcXG4gIGdyaWQtYXJlYTogcm90YXRlO1xcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bixcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3ZlcixcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmFjdGl2ZSxcXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmFjdGl2ZSB7XFxuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiBjYW52YXM7XFxuICBhbGlnbi1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudC5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQyk7XFxufVxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIGdhbWUgc2VjdGlvbiAqL1xcbi5nYW1lIHtcXG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XFxuICBncmlkLXJvdzogNSAvIDIwO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlOlxcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXFxuICAgIG1pbi1jb250ZW50IDFmciAvIHJlcGVhdCg0LCAxZnIpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCIuIGxvZyBsb2cgLlxcXCJcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG59XFxuXFxuLmdhbWUgLnVzZXItY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XFxufVxcblxcbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XFxufVxcblxcbi5nYW1lIC51c2VyLWluZm8ge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWluZm87XFxufVxcblxcbi5nYW1lIC5haS1pbmZvIHtcXG4gIGdyaWQtYXJlYTogYWktaW5mbztcXG59XFxuXFxuLmdhbWUgLnBsYXllci1zaGlwcyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLmdhbWUgLmxvZyB7XFxuICBncmlkLWFyZWE6IGxvZztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyBtaW4tY29udGVudCAxMHB4IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFxcXCJzY2VuZSAuIHRleHRcXFwiO1xcblxcbiAgd2lkdGg6IDUwMHB4O1xcblxcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tY29sb3JCMSk7XFxuICBib3JkZXItcmFkaXVzOiA2cHg7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lIHtcXG4gIGdyaWQtYXJlYTogc2NlbmU7XFxuXFxuICBoZWlnaHQ6IDE1MHB4O1xcbiAgd2lkdGg6IDE1MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lLWltZyB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLmdhbWUgLmxvZyAubG9nLXRleHQge1xcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xcbiAgZm9udC1zaXplOiAxLjE1cmVtO1xcbiAgd2hpdGUtc3BhY2U6IHByZTsgLyogQWxsb3dzIGZvciBcXFxcbiAqL1xcbn1cXG5cXG4uZ2FtZS5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI2VuZHJlZ2lvbiAqL1xcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vQVQvYXRfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrMS5qcGdcIixcblx0XCIuL0FUL2F0X2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazIuanBnXCIsXG5cdFwiLi9BVC9hdF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vQVQvYXRfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrNC5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjEuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW4yLmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuMy5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjQuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQxLmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0Mi5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDMuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQ0LmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0NS5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazEuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2syLmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrMy5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazQuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW4xLmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuMi5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjMuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW40LmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuNS5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDEuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQyLmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0My5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDQuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQ1LmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0Ni5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0Ni5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMS5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMi5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrMy5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrNC5qcGdcIixcblx0XCIuL0wvbF9hdHRhY2s1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfYXR0YWNrNS5qcGdcIixcblx0XCIuL0wvbF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMS5qcGdcIixcblx0XCIuL0wvbF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMi5qcGdcIixcblx0XCIuL0wvbF9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuMy5qcGdcIixcblx0XCIuL0wvbF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfZ2VuNC5qcGdcIixcblx0XCIuL0wvbF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0MS5qcGdcIixcblx0XCIuL0wvbF9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0Mi5qcGdcIixcblx0XCIuL0wvbF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0My5qcGdcIixcblx0XCIuL0wvbF9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xfaGl0NS5qcGdcIixcblx0XCIuL0wvbGdlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0wvbGdlbjUuanBnXCIsXG5cdFwiLi9ML2xoaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xoaXQ0LmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrMS5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazIuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrNC5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjEuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW4yLmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuMy5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjQuanBnXCIsXG5cdFwiLi9TUC9zcF9oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9oaXQxLmpwZ1wiLFxuXHRcIi4vU1Avc3BfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfaGl0Mi5qcGdcIixcblx0XCIuL1NQL3NwX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2hpdDMuanBnXCIsXG5cdFwiLi9WTS9tdl9oaXQ1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS9tdl9oaXQ1LmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrMS5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazIuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2szLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2szLmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrNC5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazUuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2s2LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2s2LmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuMS5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjIuanBnXCIsXG5cdFwiLi9WTS92bV9nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW4zLmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuNC5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjUuanBnXCIsXG5cdFwiLi9WTS92bV9nZW42LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW42LmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0MS5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDIuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQzLmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0NC5qcGdcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvc2NlbmUtaW1hZ2VzIHN5bmMgcmVjdXJzaXZlIFxcXFwuanBnJC9cIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBJbXBvcnQgc3R5bGUgc2hlZXRzXG5pbXBvcnQgXCIuL3N0eWxlL3Jlc2V0LmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZS9zdHlsZS5jc3NcIjtcblxuLy8gSW1wb3J0IG1vZHVsZXNcbmltcG9ydCBnYW1lTWFuYWdlciBmcm9tIFwiLi9tb2R1bGVzL2dhbWVNYW5hZ2VyXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL2ZhY3Rvcmllcy9QbGF5ZXJcIjtcbmltcG9ydCBjYW52YXNBZGRlciBmcm9tIFwiLi9oZWxwZXJzL2NhbnZhc0FkZGVyXCI7XG5pbXBvcnQgd2ViSW50IGZyb20gXCIuL21vZHVsZXMvd2ViSW50ZXJmYWNlXCI7XG5pbXBvcnQgcGxhY2VBaVNoaXBzIGZyb20gXCIuL2hlbHBlcnMvcGxhY2VBaVNoaXBzXCI7XG5pbXBvcnQgZ2FtZUxvZyBmcm9tIFwiLi9tb2R1bGVzL2dhbWVMb2dcIjtcbmltcG9ydCBzb3VuZHMgZnJvbSBcIi4vbW9kdWxlcy9zb3VuZHNcIjtcblxuLy8gI3JlZ2lvbiBMb2FkaW5nL0luaXRcbi8vIFJlZiB0byBnYW1lIG1hbmFnZXIgaW5zdGFuY2VcbmNvbnN0IGdtID0gZ2FtZU1hbmFnZXIoKTtcblxuLy8gSW5pdGlhbGl6ZSB0aGUgd2ViIGludGVyZmFjZSB3aXRoIGdtIHJlZlxuY29uc3Qgd2ViSW50ZXJmYWNlID0gd2ViSW50KGdtKTtcblxuLy8gSW5pdGlhbGl6ZSBzb3VuZCBtb2R1bGVcbmNvbnN0IHNvdW5kUGxheWVyID0gc291bmRzKCk7XG5cbi8vIExvYWQgc2NlbmUgaW1hZ2VzIGZvciBnYW1lIGxvZ1xuZ2FtZUxvZy5sb2FkU2NlbmVzKCk7XG5cbi8vIEluaXRpYWxpemF0aW9uIG9mIFBsYXllciBvYmplY3RzIGZvciB1c2VyIGFuZCBBSVxuY29uc3QgdXNlclBsYXllciA9IFBsYXllcihnbSk7IC8vIENyZWF0ZSBwbGF5ZXJzXG5jb25zdCBhaVBsYXllciA9IFBsYXllcihnbSk7XG51c2VyUGxheWVyLmdhbWVib2FyZC5yaXZhbEJvYXJkID0gYWlQbGF5ZXIuZ2FtZWJvYXJkOyAvLyBTZXQgcml2YWwgYm9hcmRzXG5haVBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IHVzZXJQbGF5ZXIuZ2FtZWJvYXJkO1xudXNlclBsYXllci5nYW1lYm9hcmQuaXNBaSA9IGZhbHNlOyAvLyBTZXQgYWkgb3Igbm90XG5haVBsYXllci5nYW1lYm9hcmQuaXNBaSA9IHRydWU7XG5cbi8vIFNldCBnYW1lTG9nIHVzZXIgZ2FtZSBib2FyZCBmb3IgYWNjdXJhdGUgc2NlbmVzXG5nYW1lTG9nLnNldFVzZXJHYW1lYm9hcmQodXNlclBsYXllci5nYW1lYm9hcmQpO1xuLy8gSW5pdCBnYW1lIGxvZyBzY2VuZSBpbWdcbmdhbWVMb2cuaW5pdFNjZW5lKCk7XG5cbi8vIEFkZCB0aGUgY2FudmFzIG9iamVjdHMgbm93IHRoYXQgZ2FtZWJvYXJkcyBhcmUgY3JlYXRlZFxuY29uc3QgY2FudmFzZXMgPSBjYW52YXNBZGRlcihcbiAgdXNlclBsYXllci5nYW1lYm9hcmQsXG4gIGFpUGxheWVyLmdhbWVib2FyZCxcbiAgd2ViSW50ZXJmYWNlLFxuICBnbVxuKTtcbi8vIEFkZCBjYW52YXNlcyB0byBnYW1lYm9hcmRzXG51c2VyUGxheWVyLmdhbWVib2FyZC5jYW52YXMgPSBjYW52YXNlcy51c2VyQ2FudmFzO1xuYWlQbGF5ZXIuZ2FtZWJvYXJkLmNhbnZhcyA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuXG4vLyBBZGQgYm9hcmRzIGFuZCBjYW52YXNlcyB0byBnYW1lTWFuYWdlclxuZ20udXNlckJvYXJkID0gdXNlclBsYXllci5nYW1lYm9hcmQ7XG5nbS5haUJvYXJkID0gYWlQbGF5ZXIuZ2FtZWJvYXJkO1xuZ20udXNlckNhbnZhc0NvbnRhaW5lciA9IGNhbnZhc2VzLnVzZXJDYW52YXM7XG5nbS5haUNhbnZhc0NvbnRhaW5lciA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuZ20ucGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzZXMucGxhY2VtZW50Q2FudmFzO1xuXG4vLyBBZGQgbW9kdWxlcyB0byBnYW1lTWFuYWdlclxuZ20ud2ViSW50ZXJmYWNlID0gd2ViSW50ZXJmYWNlO1xuZ20uc291bmRQbGF5ZXIgPSBzb3VuZFBsYXllcjtcbmdtLmdhbWVMb2cgPSBnYW1lTG9nO1xuLy8gI2VuZHJlZ2lvblxuXG4vLyBBZGQgYWkgc2hpcHNcbnBsYWNlQWlTaGlwcygxLCBhaVBsYXllci5nYW1lYm9hcmQpO1xuIl0sIm5hbWVzIjpbIlNoaXAiLCJhaUF0dGFjayIsIkdhbWVib2FyZCIsImdtIiwidGhpc0dhbWVib2FyZCIsIm1heEJvYXJkWCIsIm1heEJvYXJkWSIsInNoaXBzIiwiYWxsT2NjdXBpZWRDZWxscyIsIm1pc3NlcyIsImhpdHMiLCJkaXJlY3Rpb24iLCJoaXRTaGlwVHlwZSIsImlzQWkiLCJnYW1lT3ZlciIsImNhbkF0dGFjayIsInJpdmFsQm9hcmQiLCJjYW52YXMiLCJhZGRTaGlwIiwicmVjZWl2ZUF0dGFjayIsImFsbFN1bmsiLCJsb2dTdW5rIiwiYWxyZWFkeUF0dGFja2VkIiwidmFsaWRhdGVTaGlwIiwic2hpcCIsImlzVmFsaWQiLCJfbG9vcCIsImkiLCJvY2N1cGllZENlbGxzIiwiaXNDZWxsT2NjdXBpZWQiLCJzb21lIiwiY2VsbCIsImxlbmd0aCIsIl9yZXQiLCJhZGRDZWxsc1RvTGlzdCIsImZvckVhY2giLCJwdXNoIiwicG9zaXRpb24iLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJzaGlwVHlwZUluZGV4IiwibmV3U2hpcCIsImFkZE1pc3MiLCJhZGRIaXQiLCJ0eXBlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJBcnJheSIsImlzQXJyYXkiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJqIiwiaGl0IiwidHJ5QWlBdHRhY2siLCJkZWxheSIsInNoaXBBcnJheSIsImlzU3VuayIsInN1bmtlblNoaXBzIiwibG9nTXNnIiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInBsYXllciIsImNvbmNhdCIsImF0dGFja0Nvb3JkcyIsImF0dGFja2VkIiwibWlzcyIsImRyYXdpbmdNb2R1bGUiLCJkcmF3IiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzWCIsImNhbnZhc1kiLCJvcHRpb25zIiwiZ3JpZEhlaWdodCIsImdyaWRXaWR0aCIsImN1cnJlbnRDZWxsIiwiY2FudmFzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9hcmRDYW52YXMiLCJhcHBlbmRDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9hcmRDdHgiLCJnZXRDb250ZXh0Iiwib3ZlcmxheUNhbnZhcyIsIm92ZXJsYXlDdHgiLCJjZWxsU2l6ZVgiLCJjZWxsU2l6ZVkiLCJnZXRNb3VzZUNlbGwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJtb3VzZVgiLCJjbGllbnRYIiwibGVmdCIsIm1vdXNlWSIsImNsaWVudFkiLCJ0b3AiLCJjZWxsWCIsIk1hdGgiLCJmbG9vciIsImNlbGxZIiwiZHJhd0hpdCIsImNvb3JkaW5hdGVzIiwiaGl0T3JNaXNzIiwiZHJhd01pc3MiLCJkcmF3U2hpcHMiLCJ1c2VyU2hpcHMiLCJoYW5kbGVNb3VzZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVNb3VzZUxlYXZlIiwiY2xlYXJSZWN0IiwiaGFuZGxlTW91c2VNb3ZlIiwibW91c2VDZWxsIiwicGxhY2VtZW50SGlnaGxpZ2h0IiwicGxhY2VtZW50Q2xpY2tlZCIsImF0dGFja0hpZ2hsaWdodCIsInBsYXllckF0dGFja2luZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibGluZXMiLCJjb250ZXh0IiwiZ3JpZFNpemUiLCJtaW4iLCJsaW5lQ29sb3IiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIngiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJ5IiwiZHJhd0NlbGwiLCJwb3NYIiwicG9zWSIsImZpbGxSZWN0IiwiYm9hcmQiLCJ1c2VyQm9hcmQiLCJhaUJvYXJkIiwibW91c2VDb29yZHMiLCJmaWxsU3R5bGUiLCJyYWRpdXMiLCJhcmMiLCJQSSIsImZpbGwiLCJkcmF3TGVuZ3RoIiwic2hpcHNDb3VudCIsImRpcmVjdGlvblgiLCJkaXJlY3Rpb25ZIiwiaGFsZkRyYXdMZW5ndGgiLCJyZW1haW5kZXJMZW5ndGgiLCJtYXhDb29yZGluYXRlWCIsIm1heENvb3JkaW5hdGVZIiwibWluQ29vcmRpbmF0ZVgiLCJtaW5Db29yZGluYXRlWSIsIm1heFgiLCJtYXhZIiwibWluWCIsIm1pblkiLCJpc091dE9mQm91bmRzIiwibmV4dFgiLCJuZXh0WSIsIlBsYXllciIsInByaXZhdGVOYW1lIiwidGhpc1BsYXllciIsIm5hbWUiLCJuZXdOYW1lIiwidG9TdHJpbmciLCJnYW1lYm9hcmQiLCJzZW5kQXR0YWNrIiwidmFsaWRhdGVBdHRhY2siLCJwbGF5ZXJCb2FyZCIsInNoaXBOYW1lcyIsImluZGV4IiwidGhpc1NoaXAiLCJzaXplIiwicGxhY2VtZW50RGlyZWN0aW9uWCIsInBsYWNlbWVudERpcmVjdGlvblkiLCJoYWxmU2l6ZSIsInJlbWFpbmRlclNpemUiLCJuZXdDb29yZHMiLCJjZWxsUHJvYnMiLCJwcm9icyIsInVwZGF0ZVByb2JzIiwiZmluZFJhbmRvbUF0dGFjayIsInJhbmRvbSIsImZpbmRHcmVhdGVzdFByb2JBdHRhY2siLCJhbGxQcm9icyIsIm1heCIsIk5FR0FUSVZFX0lORklOSVRZIiwiYWlEaWZmaWN1bHR5IiwiYWlBdHRhY2tpbmciLCJjcmVhdGVQcm9icyIsImluaXRpYWxQcm9icyIsImNvbG9yTW9kIiwiaW5pdGlhbENvbG9yV2VpZ2h0Iiwicm93IiwiY29sb3JXZWlnaHQiLCJjb2wiLCJjZW50ZXJYIiwiY2VudGVyWSIsImRpc3RhbmNlRnJvbUNlbnRlciIsInNxcnQiLCJwb3ciLCJtaW5Qcm9iYWJpbGl0eSIsIm1heFByb2JhYmlsaXR5IiwicHJvYmFiaWxpdHkiLCJiYXJyeVByb2JhYmlsaXR5Iiwibm9ybWFsaXplUHJvYnMiLCJzdW0iLCJub3JtYWxpemVkUHJvYnMiLCJub25Ob3JtYWxpemVkUHJvYnMiLCJ1cGRhdGVFdmlkZW5jZSIsInZhbHVlcyIsIl9oaXQiLCJfc2xpY2VkVG9BcnJheSIsIl9taXNzIiwibG9nUHJvYnMiLCJwcm9ic1RvTG9nIiwiY29uc29sZSIsInRhYmxlIiwibG9nIiwicmVkdWNlIiwicm93U3VtIiwidmFsdWUiLCJncmlkQ2FudmFzIiwiY2FudmFzQWRkZXIiLCJ1c2VyR2FtZWJvYXJkIiwiYWlHYW1lYm9hcmQiLCJ3ZWJJbnRlcmZhY2UiLCJwbGFjZW1lbnRQSCIsInF1ZXJ5U2VsZWN0b3IiLCJ1c2VyUEgiLCJhaVBIIiwidXNlckNhbnZhcyIsImFpQ2FudmFzIiwicGxhY2VtZW50Q2FudmFzIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsImltYWdlTG9hZGVyIiwiaW1hZ2VSZWZzIiwiU1AiLCJhdHRhY2siLCJnZW4iLCJBVCIsIlZNIiwiSUciLCJMIiwiaW1hZ2VDb250ZXh0IiwicmVxdWlyZSIsImZpbGVzIiwiZmlsZSIsImZpbGVQYXRoIiwiZmlsZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsInN1YkRpciIsInNwbGl0IiwidG9VcHBlckNhc2UiLCJpbmNsdWRlcyIsInJhbmRvbVNoaXBzIiwicGxhY2VBaVNoaXBzIiwicGFzc2VkRGlmZiIsInBsYWNlU2hpcHMiLCJkaWZmaWN1bHR5IiwiZ3JpZFgiLCJncmlkWSIsInJvdW5kIiwiZ2FtZUxvZyIsInVzZXJOYW1lIiwiZG9VcGRhdGVTY2VuZSIsImRvTG9jayIsInNldFVzZXJHYW1lYm9hcmQiLCJsb2dUZXh0IiwibG9nSW1nIiwic2NlbmVJbWFnZXMiLCJsb2FkU2NlbmVzIiwicmFuZG9tRW50cnkiLCJhcnJheSIsImxhc3RJbmRleCIsInJhbmRvbU51bWJlciIsImRpck5hbWVzIiwicmFuZG9tU2hpcERpciIsImluaXRTY2VuZSIsInNoaXBEaXIiLCJlbnRyeSIsInNyYyIsInNldFNjZW5lIiwibG9nTG93ZXIiLCJ0ZXh0Q29udGVudCIsInNoaXBUeXBlcyIsInR5cGVUb0RpciIsInNlbnRpbmVsIiwiYXNzYXVsdCIsInZpcGVyIiwiaXJvbiIsImxldmlhdGhhbiIsImVyYXNlIiwiYXBwZW5kIiwic3RyaW5nVG9BcHBlbmQiLCJpbm5lckhUTUwiLCJib29sIiwiZ2FtZU1hbmFnZXIiLCJ1c2VyQ2FudmFzQ29udGFpbmVyIiwiYWlDYW52YXNDb250YWluZXIiLCJwbGFjZW1lbnRDYW52YXNDb250YWluZXIiLCJzb3VuZFBsYXllciIsImFpQXR0YWNrSGl0IiwicGxheUhpdCIsInN1bmtNc2ciLCJhaUF0dGFja01pc3NlZCIsInBsYXlNaXNzIiwiYWlBdHRhY2tDb3VudCIsInNldFRpbWVvdXQiLCJ0aGVuIiwicmVzdWx0IiwicGxheUF0dGFjayIsImFpTWF0Y2hDbGlja2VkIiwiaXNNdXRlZCIsInRyeVN0YXJ0R2FtZSIsInNob3dHYW1lIiwicmFuZG9tU2hpcHNDbGlja2VkIiwicm90YXRlQ2xpY2tlZCIsImRpZmYiLCJwbGFjZW1lbnRDYW52YXNjb250YWluZXIiLCJhTW9kdWxlIiwiaGl0U291bmQiLCJtaXNzU291bmQiLCJhdHRhY2tTb3VuZCIsImF0dGFja0F1ZGlvIiwiQXVkaW8iLCJoaXRBdWRpbyIsIm1pc3NBdWRpbyIsInNvdW5kcyIsImN1cnJlbnRUaW1lIiwicGxheSIsInRpdGxlIiwibWVudSIsInBsYWNlbWVudCIsImdhbWUiLCJzdGFydEJ0biIsImFpTWF0Y2hCdG4iLCJyYW5kb21TaGlwc0J0biIsInJvdGF0ZUJ0biIsInJvdGF0ZURpcmVjdGlvbiIsImhpZGVBbGwiLCJzaG93TWVudSIsInJlbW92ZSIsInNob3dQbGFjZW1lbnQiLCJzaHJpbmtUaXRsZSIsImhhbmRsZVN0YXJ0Q2xpY2siLCJoYW5kbGVBaU1hdGNoQ2xpY2siLCJoYW5kbGVSb3RhdGVDbGljayIsImhhbmRsZVJhbmRvbVNoaXBzQ2xpY2siLCJ3ZWJJbnQiLCJ1c2VyUGxheWVyIiwiYWlQbGF5ZXIiLCJjYW52YXNlcyJdLCJzb3VyY2VSb290IjoiIn0=