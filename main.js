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

  // Do an attack based on probabilities if ai difficulty is 2 and is seeking
  else if (gm.aiDifficulty === 2 && gm.aiBoard.isAiSeeking) {
    // First ensure that empty cells are set to their initialized probs when seeking
    probs.resetHitAdjacentIncreases();
    // Then find the best attack
    findGreatestProbAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findGreatestProbAttack();
    }
  }

  // Do an attack based on destroy behavior after a hit is found
  else if (gm.aiDifficulty === 2 && !gm.aiBoard.isAiSeeking) {
    // Get coords using destroy method
    var coords = probs.destroyModeCoords(gm);
    // If no coords are returned instead use seeking strat
    if (!coords) {
      // First ensure that empty cells are set to their initialized probs when seeking
      probs.resetHitAdjacentIncreases();
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

  // Return the probs for gm access
  return {
    get probs() {
      return probs;
    }
  };
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
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var cellProbs = function cellProbs() {
  // Probability modifiers
  var colorMod = 0.33; // Strong negative bias used to initialize all probs
  var adjacentMod = 4; // Medium positive bias for hit adjacent adjustments

  // #region Create the initial probs
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
  // Copy the initial probs for later use
  var initialProbs = probs.map(function (row) {
    return _toConsumableArray(row);
  });

  // #endregion

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

    // Ref to found empty
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
          // Else if it is empty try to set foundEmpty to it
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

  // #region Helper methods for updateProbs
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

  return {
    updateProbs: updateProbs,
    resetHitAdjacentIncreases: resetHitAdjacentIncreases,
    destroyModeCoords: destroyModeCoords,
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
    var remainingShips = Object.values(gameboard.ships).filter(function (ship) {
      return !ship.isSunk();
    });
    if (remainingShips.length === 0) {
      // Handle the case when all ships are sunk
      var _randomNumber = Math.floor(Math.random() * 5);
      return dirNames[_randomNumber];
    }
    var randomNumber = Math.floor(Math.random() * remainingShips.length);
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
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


/* This module allows the various other game modules to communicate and offers
   high level methods to handle various game events. This object will be passed
   to other modules as prop so they can use these methods. */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU8sNkZBQTZGLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxjQUFjLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxZQUFZLE1BQU0sWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLFdBQVcsWUFBWSxNQUFNLFVBQVUsWUFBWSxjQUFjLFdBQVcsVUFBVSxNQUFNLFVBQVUsS0FBSyxZQUFZLFdBQVcsVUFBVSxhQUFhLGNBQWMsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxjQUFjLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxZQUFZLE1BQU0sWUFBWSxjQUFjLFdBQVcsWUFBWSxhQUFhLGFBQWEsTUFBTSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxPQUFPLFVBQVUsV0FBVyxZQUFZLGFBQWEsYUFBYSxjQUFjLGFBQWEsYUFBYSxhQUFhLE9BQU8sT0FBTyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sV0FBVyxZQUFZLE1BQU0sWUFBWSxjQUFjLFdBQVcsWUFBWSxhQUFhLGFBQWEsUUFBUSxjQUFjLGFBQWEsT0FBTyxL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QTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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alEsU0FBUyxFQUNwQmtRLFFBQVEsQ0FBQ2xRLFNBQVMsRUFDbEIwSCxZQUFZLEVBQ1poVCxFQUNGLENBQUM7QUFDRDtBQUNBdWIsVUFBVSxDQUFDalEsU0FBUyxDQUFDckssTUFBTSxHQUFHd2EsUUFBUSxDQUFDcEksVUFBVTtBQUNqRG1JLFFBQVEsQ0FBQ2xRLFNBQVMsQ0FBQ3JLLE1BQU0sR0FBR3dhLFFBQVEsQ0FBQ25JLFFBQVE7O0FBRTdDO0FBQ0F0VCxFQUFFLENBQUN1SixTQUFTLEdBQUdnUyxVQUFVLENBQUNqUSxTQUFTO0FBQ25DdEwsRUFBRSxDQUFDd0osT0FBTyxHQUFHZ1MsUUFBUSxDQUFDbFEsU0FBUztBQUMvQnRMLEVBQUUsQ0FBQzZYLG1CQUFtQixHQUFHNEQsUUFBUSxDQUFDcEksVUFBVTtBQUM1Q3JULEVBQUUsQ0FBQzhYLGlCQUFpQixHQUFHMkQsUUFBUSxDQUFDbkksUUFBUTtBQUN4Q3RULEVBQUUsQ0FBQytYLHdCQUF3QixHQUFHMEQsUUFBUSxDQUFDbEksZUFBZTs7QUFFdEQ7QUFDQXZULEVBQUUsQ0FBQ2dULFlBQVksR0FBR0EsWUFBWTtBQUM5QmhULEVBQUUsQ0FBQ2dZLFdBQVcsR0FBR0EsV0FBVztBQUM1QmhZLEVBQUUsQ0FBQ3NWLE9BQU8sR0FBR0Esd0RBQU87QUFDcEI7O0FBRUE7QUFDQVAsaUVBQVksQ0FBQyxDQUFDLEVBQUV5RyxRQUFRLENBQUNsUSxTQUFTLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HcmlkQ2FudmFzL0dyaWRDYW52YXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR3JpZENhbnZhcy9kcmF3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9haUF0dGFjay9haUF0dGFjay5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvYWlBdHRhY2svY2VsbFByb2JzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9jYW52YXNBZGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvaW1hZ2VMb2FkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3BsYWNlQWlTaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvcmFuZG9tU2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVMb2cuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVNYW5hZ2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zb3VuZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3dlYkludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9yZXNldC5jc3M/NDQ1ZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcz9jOWYwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY2VuZS1pbWFnZXMvIHN5bmMgXFwuanBnJC8iLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5pbXBvcnQgYWlBdHRhY2sgZnJvbSBcIi4uL2hlbHBlcnMvYWlBdHRhY2svYWlBdHRhY2tcIjtcblxuLyogRmFjdG9yeSB0aGF0IHJldHVybnMgYSBnYW1lYm9hcmQgdGhhdCBjYW4gcGxhY2Ugc2hpcHMgd2l0aCBTaGlwKCksIHJlY2lldmUgYXR0YWNrcyBiYXNlZCBvbiBjb29yZHMgXG4gICBhbmQgdGhlbiBkZWNpZGVzIHdoZXRoZXIgdG8gaGl0KCkgaWYgc2hpcCBpcyBpbiB0aGF0IHNwb3QsIHJlY29yZHMgaGl0cyBhbmQgbWlzc2VzLCBhbmQgcmVwb3J0cyBpZlxuICAgYWxsIGl0cyBzaGlwcyBoYXZlIGJlZW4gc3Vuay4gKi9cbmNvbnN0IEdhbWVib2FyZCA9IChnbSkgPT4ge1xuICBjb25zdCB0aGlzR2FtZWJvYXJkID0ge1xuICAgIG1heEJvYXJkWDogOSxcbiAgICBtYXhCb2FyZFk6IDksXG4gICAgc2hpcHM6IFtdLFxuICAgIGFsbE9jY3VwaWVkQ2VsbHM6IFtdLFxuICAgIGNlbGxzVG9DaGVjazogW10sXG4gICAgbWlzc2VzOiBbXSxcbiAgICBoaXRzOiBbXSxcbiAgICBkaXJlY3Rpb246IDEsXG4gICAgaGl0U2hpcFR5cGU6IG51bGwsXG4gICAgaXNBaTogZmFsc2UsXG4gICAgaXNBdXRvQXR0YWNraW5nOiBmYWxzZSxcbiAgICBpc0FpU2Vla2luZzogdHJ1ZSxcbiAgICBnYW1lT3ZlcjogZmFsc2UsXG4gICAgY2FuQXR0YWNrOiB0cnVlLFxuICAgIHJpdmFsQm9hcmQ6IG51bGwsXG4gICAgY2FudmFzOiBudWxsLFxuICAgIGFkZFNoaXA6IG51bGwsXG4gICAgcmVjZWl2ZUF0dGFjazogbnVsbCxcbiAgICBhbGxTdW5rOiBudWxsLFxuICAgIGxvZ1N1bms6IG51bGwsXG4gICAgaXNDZWxsU3VuazogbnVsbCxcbiAgICBhbHJlYWR5QXR0YWNrZWQ6IG51bGwsXG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHNoaXAgb2NjdXBpZWQgY2VsbCBjb29yZHNcbiAgY29uc3QgdmFsaWRhdGVTaGlwID0gKHNoaXApID0+IHtcbiAgICBpZiAoIXNoaXApIHJldHVybiBmYWxzZTtcbiAgICAvLyBGbGFnIGZvciBkZXRlY3RpbmcgaW52YWxpZCBwb3NpdGlvbiB2YWx1ZVxuICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgIC8vIENoZWNrIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHMgYXJlIGFsbCB3aXRoaW4gbWFwIGFuZCBub3QgYWxyZWFkeSBvY2N1cGllZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5vY2N1cGllZENlbGxzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAvLyBPbiB0aGUgbWFwP1xuICAgICAgaWYgKFxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gPj0gMCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gPD0gdGhpc0dhbWVib2FyZC5tYXhCb2FyZFggJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdIDw9IHRoaXNHYW1lYm9hcmQubWF4Qm9hcmRZXG4gICAgICApIHtcbiAgICAgICAgLy8gRG8gbm90aGluZ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQ2hlY2sgb2NjdXBpZWQgY2VsbHNcbiAgICAgIGNvbnN0IGlzQ2VsbE9jY3VwaWVkID0gdGhpc0dhbWVib2FyZC5hbGxPY2N1cGllZENlbGxzLnNvbWUoXG4gICAgICAgIChjZWxsKSA9PlxuICAgICAgICAgIC8vIENvb3JkcyBmb3VuZCBpbiBhbGwgb2NjdXBpZWQgY2VsbHMgYWxyZWFkeVxuICAgICAgICAgIGNlbGxbMF0gPT09IHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSAmJlxuICAgICAgICAgIGNlbGxbMV0gPT09IHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXVxuICAgICAgKTtcblxuICAgICAgaWYgKGlzQ2VsbE9jY3VwaWVkKSB7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7IC8vIEJyZWFrIG91dCBvZiB0aGUgbG9vcCBpZiBvY2N1cGllZCBjZWxsIGlzIGZvdW5kXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgYWRkcyBvY2N1cGllZCBjZWxscyBvZiB2YWxpZCBib2F0IHRvIGxpc3RcbiAgY29uc3QgYWRkQ2VsbHNUb0xpc3QgPSAoc2hpcCkgPT4ge1xuICAgIHNoaXAub2NjdXBpZWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICB0aGlzR2FtZWJvYXJkLmFsbE9jY3VwaWVkQ2VsbHMucHVzaChjZWxsKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIGFkZGluZyBhIHNoaXAgYXQgYSBnaXZlbiBjb29yZHMgaW4gZ2l2ZW4gZGlyZWN0aW9uIGlmIHNoaXAgd2lsbCBmaXQgb24gYm9hcmRcbiAgdGhpc0dhbWVib2FyZC5hZGRTaGlwID0gKFxuICAgIHBvc2l0aW9uLFxuICAgIGRpcmVjdGlvbiA9IHRoaXNHYW1lYm9hcmQuZGlyZWN0aW9uLFxuICAgIHNoaXBUeXBlSW5kZXggPSB0aGlzR2FtZWJvYXJkLnNoaXBzLmxlbmd0aCArIDFcbiAgKSA9PiB7XG4gICAgLy8gQ3JlYXRlIHRoZSBkZXNpcmVkIHNoaXBcbiAgICBjb25zdCBuZXdTaGlwID0gU2hpcChzaGlwVHlwZUluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKTtcbiAgICAvLyBBZGQgaXQgdG8gc2hpcHMgaWYgaXQgaGFzIHZhbGlkIG9jY3VwaWVkIGNlbGxzXG4gICAgaWYgKHZhbGlkYXRlU2hpcChuZXdTaGlwKSkge1xuICAgICAgYWRkQ2VsbHNUb0xpc3QobmV3U2hpcCk7XG4gICAgICB0aGlzR2FtZWJvYXJkLnNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFkZE1pc3MgPSAocG9zaXRpb24pID0+IHtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHRoaXNHYW1lYm9hcmQubWlzc2VzLnB1c2gocG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhZGRIaXQgPSAocG9zaXRpb24sIHNoaXApID0+IHtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHRoaXNHYW1lYm9hcmQuaGl0cy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG1vc3QgcmVjZW50bHkgaGl0IHNoaXBcbiAgICB0aGlzR2FtZWJvYXJkLmhpdFNoaXBUeXBlID0gc2hpcC50eXBlO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVjZWl2aW5nIGFuIGF0dGFjayBmcm9tIG9wcG9uZW50XG4gIHRoaXNHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayA9IChwb3NpdGlvbiwgc2hpcHMgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBWYWxpZGF0ZSBwb3NpdGlvbiBpcyAyIGluIGFycmF5IGFuZCBzaGlwcyBpcyBhbiBhcnJheSwgYW5kIHJpdmFsIGJvYXJkIGNhbiBhdHRhY2tcbiAgICAgIGlmIChcbiAgICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHMpXG4gICAgICApIHtcbiAgICAgICAgLy8gRWFjaCBzaGlwIGluIHNoaXBzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBJZiB0aGUgc2hpcCBpcyBub3QgZmFsc3ksIGFuZCBvY2N1cGllZENlbGxzIHByb3AgZXhpc3RzIGFuZCBpcyBhbiBhcnJheVxuICAgICAgICAgICAgc2hpcHNbaV0gJiZcbiAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMgJiZcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHNbaV0ub2NjdXBpZWRDZWxscylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIG9mIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHNcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcHNbaV0ub2NjdXBpZWRDZWxscy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhhdCBjZWxsIG1hdGNoZXMgdGhlIGF0dGFjayBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMF0gPT09IHBvc2l0aW9uWzBdICYmXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGF0IHNoaXBzIGhpdCBtZXRob2QgYW5kIGJyZWFrIG91dCBvZiBsb29wXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgICAgYWRkSGl0KHBvc2l0aW9uLCBzaGlwc1tpXSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFkZE1pc3MocG9zaXRpb24pO1xuICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgLy8gTWV0aG9kIGZvciB0cnlpbmcgYWkgYXR0YWNrc1xuICB0aGlzR2FtZWJvYXJkLnRyeUFpQXR0YWNrID0gKGRlbGF5KSA9PiB7XG4gICAgLy8gUmV0dXJuIGlmIG5vdCBhaSBvciBnYW1lIGlzIG92ZXJcbiAgICBpZiAodGhpc0dhbWVib2FyZC5pc0FpID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIGFpQXR0YWNrKGdtLCBkZWxheSk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3Igbm90XG4gIHRoaXNHYW1lYm9hcmQuYWxsU3VuayA9IChzaGlwQXJyYXkgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgaWYgKCFzaGlwQXJyYXkgfHwgIUFycmF5LmlzQXJyYXkoc2hpcEFycmF5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgc2hpcEFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rICYmICFzaGlwLmlzU3VuaygpKSBhbGxTdW5rID0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH07XG5cbiAgLy8gT2JqZWN0IGZvciB0cmFja2luZyBib2FyZCdzIHN1bmtlbiBzaGlwc1xuICB0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzID0ge1xuICAgIDE6IGZhbHNlLFxuICAgIDI6IGZhbHNlLFxuICAgIDM6IGZhbHNlLFxuICAgIDQ6IGZhbHNlLFxuICAgIDU6IGZhbHNlLFxuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVwb3J0aW5nIHN1bmtlbiBzaGlwc1xuICB0aGlzR2FtZWJvYXJkLmxvZ1N1bmsgPSAoKSA9PiB7XG4gICAgbGV0IGxvZ01zZyA9IG51bGw7XG4gICAgT2JqZWN0LmtleXModGhpc0dhbWVib2FyZC5zdW5rZW5TaGlwcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHNba2V5XSA9PT0gZmFsc2UgJiZcbiAgICAgICAgdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS5pc1N1bmsoKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSB0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdLnR5cGU7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXNHYW1lYm9hcmQuaXNBaSA/IFwiQUknc1wiIDogXCJVc2VyJ3NcIjtcbiAgICAgICAgbG9nTXNnID0gYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7cGxheWVyfSAke3NoaXB9IHdhcyBkZXN0cm95ZWQhPC9zcGFuPmA7XG4gICAgICAgIHRoaXNHYW1lYm9hcmQuc3Vua2VuU2hpcHNba2V5XSA9IHRydWU7XG4gICAgICAgIC8vIENhbGwgdGhlIG1ldGhvZCBmb3IgcmVzcG9uZGluZyB0byB1c2VyIHNoaXAgc3VuayBvbiBnYW1lIG1hbmFnZXJcbiAgICAgICAgaWYgKCF0aGlzR2FtZWJvYXJkLmlzQWkpIGdtLnVzZXJTaGlwU3Vuayh0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbG9nTXNnO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgZGV0ZXJtaW5pbmcgaWYgYSBwb3NpdGlvbiBpcyBhbHJlYWR5IGF0dGFja2VkXG4gIHRoaXNHYW1lYm9hcmQuYWxyZWFkeUF0dGFja2VkID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIGxldCBhdHRhY2tlZCA9IGZhbHNlO1xuXG4gICAgdGhpc0dhbWVib2FyZC5oaXRzLmZvckVhY2goKGhpdCkgPT4ge1xuICAgICAgaWYgKGF0dGFja0Nvb3Jkc1swXSA9PT0gaGl0WzBdICYmIGF0dGFja0Nvb3Jkc1sxXSA9PT0gaGl0WzFdKSB7XG4gICAgICAgIGF0dGFja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXNHYW1lYm9hcmQubWlzc2VzLmZvckVhY2goKG1pc3MpID0+IHtcbiAgICAgIGlmIChhdHRhY2tDb29yZHNbMF0gPT09IG1pc3NbMF0gJiYgYXR0YWNrQ29vcmRzWzFdID09PSBtaXNzWzFdKSB7XG4gICAgICAgIGF0dGFja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhdHRhY2tlZDtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJldHVybmluZyBib29sIGZvciBpZiBjZWxsIG9jY3VwaWVkIGJ5IHN1bmsgc2hpcFxuICB0aGlzR2FtZWJvYXJkLmlzQ2VsbFN1bmsgPSAoY2VsbFRvQ2hlY2spID0+IHtcbiAgICBsZXQgaXNDZWxsU3VuayA9IGZhbHNlOyAvLyBGbGFnIHZhcmlhYmxlXG5cbiAgICBPYmplY3Qua2V5cyh0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzR2FtZWJvYXJkLnN1bmtlblNoaXBzW2tleV0gPT09IHRydWUgJiYgIWlzQ2VsbFN1bmspIHtcbiAgICAgICAgY29uc3QgaGFzTWF0Y2hpbmdDZWxsID0gdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS5vY2N1cGllZENlbGxzLnNvbWUoXG4gICAgICAgICAgKGNlbGwpID0+IGNlbGxUb0NoZWNrWzBdID09PSBjZWxsWzBdICYmIGNlbGxUb0NoZWNrWzFdID09PSBjZWxsWzFdXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGhhc01hdGNoaW5nQ2VsbCkge1xuICAgICAgICAgIGlzQ2VsbFN1bmsgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXNDZWxsU3VuaztcbiAgfTtcblxuICByZXR1cm4gdGhpc0dhbWVib2FyZDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsIi8vIEhlbHBlciBtb2R1bGUgZm9yIGRyYXcgbWV0aG9kc1xuaW1wb3J0IGRyYXdpbmdNb2R1bGUgZnJvbSBcIi4vZHJhd1wiO1xuXG4vLyBJbml0aWFsaXplIGl0XG5jb25zdCBkcmF3ID0gZHJhd2luZ01vZHVsZSgpO1xuXG5jb25zdCBjcmVhdGVDYW52YXMgPSAoZ20sIGNhbnZhc1gsIGNhbnZhc1ksIG9wdGlvbnMpID0+IHtcbiAgLy8gI3JlZ2lvbiBTZXQgdXAgYmFzaWMgZWxlbWVudCBwcm9wZXJ0aWVzXG4gIC8vIFNldCB0aGUgZ3JpZCBoZWlnaHQgYW5kIHdpZHRoIGFuZCBhZGQgcmVmIHRvIGN1cnJlbnQgY2VsbFxuICBjb25zdCBncmlkSGVpZ2h0ID0gMTA7XG4gIGNvbnN0IGdyaWRXaWR0aCA9IDEwO1xuICBsZXQgY3VycmVudENlbGwgPSBudWxsO1xuXG4gIC8vIENyZWF0ZSBwYXJlbnQgZGl2IHRoYXQgaG9sZHMgdGhlIGNhbnZhc2VzLiBUaGlzIGlzIHRoZSBlbGVtZW50IHJldHVybmVkLlxuICBjb25zdCBjYW52YXNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNhbnZhcy1jb250YWluZXJcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBib2FyZCBjYW52YXMgZWxlbWVudCB0byBzZXJ2ZSBhcyB0aGUgZ2FtZWJvYXJkIGJhc2VcbiAgY29uc3QgYm9hcmRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjYW52YXNDb250YWluZXIuYXBwZW5kQ2hpbGQoYm9hcmRDYW52YXMpO1xuICBib2FyZENhbnZhcy53aWR0aCA9IGNhbnZhc1g7XG4gIGJvYXJkQ2FudmFzLmhlaWdodCA9IGNhbnZhc1k7XG4gIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgb3ZlcmxheSBjYW52YXMgZm9yIHJlbmRlcmluZyBzaGlwIHBsYWNlbWVudCBhbmQgYXR0YWNrIHNlbGVjdGlvblxuICBjb25zdCBvdmVybGF5Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzQ29udGFpbmVyLmFwcGVuZENoaWxkKG92ZXJsYXlDYW52YXMpO1xuICBvdmVybGF5Q2FudmFzLndpZHRoID0gY2FudmFzWDtcbiAgb3ZlcmxheUNhbnZhcy5oZWlnaHQgPSBjYW52YXNZO1xuICBjb25zdCBvdmVybGF5Q3R4ID0gb3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gU2V0IHRoZSBcImNlbGwgc2l6ZVwiIGZvciB0aGUgZ3JpZCByZXByZXNlbnRlZCBieSB0aGUgY2FudmFzXG4gIGNvbnN0IGNlbGxTaXplWCA9IGJvYXJkQ2FudmFzLndpZHRoIC8gZ3JpZFdpZHRoOyAvLyBNb2R1bGUgY29uc3RcbiAgY29uc3QgY2VsbFNpemVZID0gYm9hcmRDYW52YXMuaGVpZ2h0IC8gZ3JpZEhlaWdodDsgLy8gTW9kdWxlIGNvbnN0XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gR2VuZXJhbCBoZWxwZXIgbWV0aG9kc1xuICAvLyBNZXRob2QgdGhhdCBnZXRzIHRoZSBtb3VzZSBwb3NpdGlvbiBiYXNlZCBvbiB3aGF0IGNlbGwgaXQgaXMgb3ZlclxuICBjb25zdCBnZXRNb3VzZUNlbGwgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gYm9hcmRDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCBjZWxsWCA9IE1hdGguZmxvb3IobW91c2VYIC8gY2VsbFNpemVYKTtcbiAgICBjb25zdCBjZWxsWSA9IE1hdGguZmxvb3IobW91c2VZIC8gY2VsbFNpemVZKTtcblxuICAgIHJldHVybiBbY2VsbFgsIGNlbGxZXTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBc3NpZ24gc3RhdGljIG1ldGhvZHNcbiAgLy8gQWRkIG1ldGhvZHMgb24gdGhlIGNvbnRhaW5lciBmb3IgZHJhd2luZyBoaXRzIG9yIG1pc3Nlc1xuICBjYW52YXNDb250YWluZXIuZHJhd0hpdCA9IChjb29yZGluYXRlcykgPT5cbiAgICBkcmF3LmhpdE9yTWlzcyhib2FyZEN0eCwgY2VsbFNpemVYLCBjZWxsU2l6ZVksIGNvb3JkaW5hdGVzLCAxKTtcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdNaXNzID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGRyYXcuaGl0T3JNaXNzKGJvYXJkQ3R4LCBjZWxsU2l6ZVgsIGNlbGxTaXplWSwgY29vcmRpbmF0ZXMsIDApO1xuXG4gIC8vIEFkZCBtZXRob2QgdG8gY29udGFpbmVyIGZvciBzaGlwcyB0byBib2FyZCBjYW52YXNcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdTaGlwcyA9ICh1c2VyU2hpcHMgPSB0cnVlKSA9PiB7XG4gICAgZHJhdy5zaGlwcyhib2FyZEN0eCwgY2VsbFNpemVYLCBjZWxsU2l6ZVksIGdtLCB1c2VyU2hpcHMpO1xuICB9O1xuXG4gIC8vIG92ZXJsYXlDYW52YXNcbiAgLy8gRm9yd2FyZCBjbGlja3MgdG8gYm9hcmQgY2FudmFzXG4gIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudChcImNsaWNrXCIsIHtcbiAgICAgIGJ1YmJsZXM6IGV2ZW50LmJ1YmJsZXMsXG4gICAgICBjYW5jZWxhYmxlOiBldmVudC5jYW5jZWxhYmxlLFxuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgfSk7XG4gICAgYm9hcmRDYW52YXMuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG4gIH07XG5cbiAgLy8gTW91c2VsZWF2ZVxuICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTGVhdmUgPSAoKSA9PiB7XG4gICAgb3ZlcmxheUN0eC5jbGVhclJlY3QoMCwgMCwgb3ZlcmxheUNhbnZhcy53aWR0aCwgb3ZlcmxheUNhbnZhcy5oZWlnaHQpO1xuICAgIGN1cnJlbnRDZWxsID0gbnVsbDtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBc3NpZ24gYmVoYXZpb3IgdXNpbmcgYnJvd3NlciBldmVudCBoYW5kbGVycyBiYXNlZCBvbiBvcHRpb25zXG4gIC8vIFBsYWNlbWVudCBpcyB1c2VkIGZvciBwbGFjaW5nIHNoaXBzXG4gIGlmIChvcHRpb25zLnR5cGUgPT09IFwicGxhY2VtZW50XCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gY2FudmFzQ29udGFpbmVyIHRvIGRlbm90ZSBwbGFjZW1lbnQgY29udGFpbmVyXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBTZXQgdXAgb3ZlcmxheUNhbnZhcyB3aXRoIGJlaGF2aW9ycyB1bmlxdWUgdG8gcGxhY2VtZW50XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIEdldCB3aGF0IGNlbGwgdGhlIG1vdXNlIGlzIG92ZXJcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICAvLyBJZiB0aGUgJ29sZCcgY3VycmVudENlbGwgaXMgZXF1YWwgdG8gdGhlIG1vdXNlQ2VsbCBiZWluZyBldmFsdWF0ZWRcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBjdXJyZW50Q2VsbCAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzBdID09PSBtb3VzZUNlbGxbMF0gJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFsxXSA9PT0gbW91c2VDZWxsWzFdXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICAvLyBSZW5kZXIgdGhlIGNoYW5nZXNcbiAgICAgICAgZHJhdy5wbGFjZW1lbnRIaWdobGlnaHQoXG4gICAgICAgICAgb3ZlcmxheUN0eCxcbiAgICAgICAgICBjYW52YXNYLFxuICAgICAgICAgIGNhbnZhc1ksXG4gICAgICAgICAgY2VsbFNpemVYLFxuICAgICAgICAgIGNlbGxTaXplWSxcbiAgICAgICAgICBtb3VzZUNlbGwsXG4gICAgICAgICAgZ21cbiAgICAgICAgKTtcbiAgICAgICAgLy8gaGlnaGxpZ2h0UGxhY2VtZW50Q2VsbHMobW91c2VDZWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSBjdXJyZW50Q2VsbCB0byB0aGUgbW91c2VDZWxsIGZvciBmdXR1cmUgY29tcGFyaXNvbnNcbiAgICAgIGN1cnJlbnRDZWxsID0gbW91c2VDZWxsO1xuICAgIH07XG5cbiAgICAvLyBCcm93c2VyIGNsaWNrIGV2ZW50c1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuXG4gICAgICAvLyBUcnkgcGxhY2VtZW50XG4gICAgICBnbS5wbGFjZW1lbnRDbGlja2VkKGNlbGwpO1xuICAgIH07XG4gIH1cbiAgLy8gVXNlciBjYW52YXMgZm9yIGRpc3BsYXlpbmcgYWkgaGl0cyBhbmQgbWlzc2VzIGFnYWluc3QgdXNlciBhbmQgdXNlciBzaGlwIHBsYWNlbWVudHNcbiAgZWxzZSBpZiAob3B0aW9ucy50eXBlID09PSBcInVzZXJcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBkZW5vdGUgdXNlciBjYW52YXNcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInVzZXItY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBIYW5kbGUgY2FudmFzIG1vdXNlIG1vdmVcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9ICgpID0+IHtcbiAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9O1xuICAgIC8vIEhhbmRsZSBib2FyZCBtb3VzZSBjbGlja1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfTtcbiAgfVxuICAvLyBBSSBjYW52YXMgZm9yIGRpc3BsYXlpbmcgdXNlciBoaXRzIGFuZCBtaXNzZXMgYWdhaW5zdCBhaSwgYW5kIGFpIHNoaXAgcGxhY2VtZW50cyBpZiB1c2VyIGxvc2VzXG4gIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJhaVwiKSB7XG4gICAgLy8gQWRkIGNsYXNzIHRvIGRlbm90ZSBhaSBjYW52YXNcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFpLWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gSGFuZGxlIGNhbnZhcyBtb3VzZSBtb3ZlXG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIEdldCB3aGF0IGNlbGwgdGhlIG1vdXNlIGlzIG92ZXJcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICAvLyBJZiB0aGUgJ29sZCcgY3VycmVudENlbGwgaXMgZXF1YWwgdG8gdGhlIG1vdXNlQ2VsbCBiZWluZyBldmFsdWF0ZWRcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBjdXJyZW50Q2VsbCAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzBdID09PSBtb3VzZUNlbGxbMF0gJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFsxXSA9PT0gbW91c2VDZWxsWzFdXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICAgICAgZHJhdy5hdHRhY2tIaWdobGlnaHQoXG4gICAgICAgICAgb3ZlcmxheUN0eCxcbiAgICAgICAgICBjYW52YXNYLFxuICAgICAgICAgIGNhbnZhc1ksXG4gICAgICAgICAgY2VsbFNpemVYLFxuICAgICAgICAgIGNlbGxTaXplWSxcbiAgICAgICAgICBtb3VzZUNlbGwsXG4gICAgICAgICAgZ21cbiAgICAgICAgKTtcbiAgICAgICAgLy8gaGlnaGxpZ2h0QXR0YWNrKG1vdXNlQ2VsbCk7XG4gICAgICB9XG4gICAgICAvLyBEZW5vdGUgaWYgaXQgaXMgYSB2YWxpZCBhdHRhY2sgb3Igbm90IC0gTllJXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBhdHRhY2tDb29yZHMgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuICAgICAgZ20ucGxheWVyQXR0YWNraW5nKGF0dGFja0Nvb3Jkcyk7XG5cbiAgICAgIC8vIENsZWFyIHRoZSBvdmVybGF5IHRvIHNob3cgaGl0L21pc3MgdW5kZXIgY3VycmVudCBoaWdoaWdodFxuICAgICAgb3ZlcmxheUN0eC5jbGVhclJlY3QoMCwgMCwgb3ZlcmxheUNhbnZhcy53aWR0aCwgb3ZlcmxheUNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIFN1YnNjcmliZSB0byBicm93c2VyIGV2ZW50c1xuICAvLyBib2FyZCBjbGlja1xuICBib2FyZENhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2soZSkpO1xuICAvLyBvdmVybGF5IGNsaWNrXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VDbGljayhlKVxuICApO1xuICAvLyBvdmVybGF5IG1vdXNlbW92ZVxuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUoZSlcbiAgKTtcbiAgLy8gb3ZlcmxheSBtb3VzZWxlYXZlXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTGVhdmUoKVxuICApO1xuXG4gIC8vIERyYXcgaW5pdGlhbCBib2FyZCBsaW5lc1xuICBkcmF3LmxpbmVzKGJvYXJkQ3R4LCBjYW52YXNYLCBjYW52YXNZKTtcblxuICAvLyBSZXR1cm4gY29tcGxldGVkIGNhbnZhc2VzXG4gIHJldHVybiBjYW52YXNDb250YWluZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDYW52YXM7XG4iLCJjb25zdCBkcmF3ID0gKCkgPT4ge1xuICAvLyBEcmF3cyB0aGUgZ3JpZCBsaW5lc1xuICBjb25zdCBsaW5lcyA9IChjb250ZXh0LCBjYW52YXNYLCBjYW52YXNZKSA9PiB7XG4gICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgY29uc3QgZ3JpZFNpemUgPSBNYXRoLm1pbihjYW52YXNYLCBjYW52YXNZKSAvIDEwO1xuICAgIGNvbnN0IGxpbmVDb2xvciA9IFwiYmxhY2tcIjtcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gbGluZUNvbG9yO1xuICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcblxuICAgIC8vIERyYXcgdmVydGljYWwgbGluZXNcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSBjYW52YXNYOyB4ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICBjb250ZXh0LmxpbmVUbyh4LCBjYW52YXNZKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyBob3Jpem9udGFsIGxpbmVzXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gY2FudmFzWTsgeSArPSBncmlkU2l6ZSkge1xuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgY29udGV4dC5saW5lVG8oY2FudmFzWCwgeSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBEcmF3cyB0aGUgc2hpcHMuIERlZmF1bHQgZGF0YSB0byB1c2UgaXMgdXNlciBzaGlwcywgYnV0IGFpIGNhbiBiZSB1c2VkIHRvb1xuICBjb25zdCBzaGlwcyA9IChjb250ZXh0LCBjZWxsWCwgY2VsbFksIGdtLCB1c2VyU2hpcHMgPSB0cnVlKSA9PiB7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gYm9hcmRcbiAgICBmdW5jdGlvbiBkcmF3Q2VsbChwb3NYLCBwb3NZKSB7XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KHBvc1ggKiBjZWxsWCwgcG9zWSAqIGNlbGxZLCBjZWxsWCwgY2VsbFkpO1xuICAgIH1cbiAgICAvLyBXaGljaCBib2FyZCB0byBnZXQgc2hpcHMgZGF0YSBmcm9tXG4gICAgY29uc3QgYm9hcmQgPSB1c2VyU2hpcHMgPT09IHRydWUgPyBnbS51c2VyQm9hcmQgOiBnbS5haUJvYXJkO1xuICAgIC8vIERyYXcgdGhlIGNlbGxzIHRvIHRoZSBib2FyZFxuICAgIGJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAub2NjdXBpZWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgIGRyYXdDZWxsKGNlbGxbMF0sIGNlbGxbMV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gRHJhd3MgYSBoaXQgb3IgYSBtaXNzIGRlZmF1bHRpbmcgdG8gYSBtaXNzIGlmIG5vIHR5cGUgcGFzc2VkXG4gIGNvbnN0IGhpdE9yTWlzcyA9IChjb250ZXh0LCBjZWxsWCwgY2VsbFksIG1vdXNlQ29vcmRzLCB0eXBlID0gMCkgPT4ge1xuICAgIC8vIFNldCBwcm9wZXIgZmlsbCBjb2xvclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgIGlmICh0eXBlID09PSAxKSBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgLy8gU2V0IGEgcmFkaXVzIGZvciBjaXJjbGUgdG8gZHJhdyBmb3IgXCJwZWdcIiB0aGF0IHdpbGwgYWx3YXlzIGZpdCBpbiBjZWxsXG4gICAgY29uc3QgcmFkaXVzID0gY2VsbFggPiBjZWxsWSA/IGNlbGxZIC8gMiA6IGNlbGxYIC8gMjtcbiAgICAvLyBEcmF3IHRoZSBjaXJjbGVcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQuYXJjKFxuICAgICAgbW91c2VDb29yZHNbMF0gKiBjZWxsWCArIGNlbGxYIC8gMixcbiAgICAgIG1vdXNlQ29vcmRzWzFdICogY2VsbFkgKyBjZWxsWSAvIDIsXG4gICAgICByYWRpdXMsXG4gICAgICAwLFxuICAgICAgMiAqIE1hdGguUElcbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VtZW50SGlnaGxpZ2h0ID0gKFxuICAgIGNvbnRleHQsXG4gICAgY2FudmFzWCxcbiAgICBjYW52YXNZLFxuICAgIGNlbGxYLFxuICAgIGNlbGxZLFxuICAgIG1vdXNlQ29vcmRzLFxuICAgIGdtXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNYLCBjYW52YXNZKTtcbiAgICAvLyBEcmF3IGEgY2VsbCB0byBvdmVybGF5XG4gICAgZnVuY3Rpb24gZHJhd0NlbGwocG9zWCwgcG9zWSkge1xuICAgICAgY29udGV4dC5maWxsUmVjdChwb3NYICogY2VsbFgsIHBvc1kgKiBjZWxsWSwgY2VsbFgsIGNlbGxZKTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgY3VycmVudCBzaGlwIGxlbmd0aCAoYmFzZWQgb24gZGVmYXVsdCBiYXR0bGVzaGlwIHJ1bGVzIHNpemVzLCBzbWFsbGVzdCB0byBiaWdnZXN0KVxuICAgIGxldCBkcmF3TGVuZ3RoO1xuICAgIGNvbnN0IHNoaXBzQ291bnQgPSBnbS51c2VyQm9hcmQuc2hpcHMubGVuZ3RoO1xuICAgIGlmIChzaGlwc0NvdW50ID09PSAwKSBkcmF3TGVuZ3RoID0gMjtcbiAgICBlbHNlIGlmIChzaGlwc0NvdW50ID09PSAxIHx8IHNoaXBzQ291bnQgPT09IDIpIGRyYXdMZW5ndGggPSAzO1xuICAgIGVsc2UgZHJhd0xlbmd0aCA9IHNoaXBzQ291bnQgKyAxO1xuXG4gICAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiB0byBkcmF3IGluXG4gICAgbGV0IGRpcmVjdGlvblggPSAwO1xuICAgIGxldCBkaXJlY3Rpb25ZID0gMDtcblxuICAgIGlmIChnbS51c2VyQm9hcmQuZGlyZWN0aW9uID09PSAxKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMTtcbiAgICAgIGRpcmVjdGlvblggPSAwO1xuICAgIH0gZWxzZSBpZiAoZ20udXNlckJvYXJkLmRpcmVjdGlvbiA9PT0gMCkge1xuICAgICAgZGlyZWN0aW9uWSA9IDA7XG4gICAgICBkaXJlY3Rpb25YID0gMTtcbiAgICB9XG5cbiAgICAvLyBEaXZpZGUgdGhlIGRyYXdMZW5naHQgaW4gaGFsZiB3aXRoIHJlbWFpbmRlclxuICAgIGNvbnN0IGhhbGZEcmF3TGVuZ3RoID0gTWF0aC5mbG9vcihkcmF3TGVuZ3RoIC8gMik7XG4gICAgY29uc3QgcmVtYWluZGVyTGVuZ3RoID0gZHJhd0xlbmd0aCAlIDI7XG5cbiAgICAvLyBJZiBkcmF3aW5nIG9mZiBjYW52YXMgbWFrZSBjb2xvciByZWRcbiAgICAvLyBDYWxjdWxhdGUgbWF4aW11bSBhbmQgbWluaW11bSBjb29yZGluYXRlc1xuICAgIGNvbnN0IG1heENvb3JkaW5hdGVYID1cbiAgICAgIG1vdXNlQ29vcmRzWzBdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25YO1xuICAgIGNvbnN0IG1heENvb3JkaW5hdGVZID1cbiAgICAgIG1vdXNlQ29vcmRzWzFdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25ZO1xuICAgIGNvbnN0IG1pbkNvb3JkaW5hdGVYID0gbW91c2VDb29yZHNbMF0gLSBoYWxmRHJhd0xlbmd0aCAqIGRpcmVjdGlvblg7XG4gICAgY29uc3QgbWluQ29vcmRpbmF0ZVkgPSBtb3VzZUNvb3Jkc1sxXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWTtcblxuICAgIC8vIEFuZCB0cmFuc2xhdGUgaW50byBhbiBhY3R1YWwgY2FudmFzIHBvc2l0aW9uXG4gICAgY29uc3QgbWF4WCA9IG1heENvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWF4WSA9IG1heENvb3JkaW5hdGVZICogY2VsbFk7XG4gICAgY29uc3QgbWluWCA9IG1pbkNvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWluWSA9IG1pbkNvb3JkaW5hdGVZICogY2VsbFk7XG5cbiAgICAvLyBDaGVjayBpZiBhbnkgY2VsbHMgYXJlIG91dHNpZGUgdGhlIGNhbnZhcyBib3VuZGFyaWVzXG4gICAgY29uc3QgaXNPdXRPZkJvdW5kcyA9XG4gICAgICBtYXhYID49IGNhbnZhc1ggfHwgbWF4WSA+PSBjYW52YXNZIHx8IG1pblggPCAwIHx8IG1pblkgPCAwO1xuXG4gICAgLy8gU2V0IHRoZSBmaWxsIGNvbG9yIGJhc2VkIG9uIHdoZXRoZXIgY2VsbHMgYXJlIGRyYXduIG9mZiBjYW52YXNcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGlzT3V0T2ZCb3VuZHMgPyBcInJlZFwiIDogXCJibHVlXCI7XG5cbiAgICAvLyBEcmF3IHRoZSBtb3VzZWQgb3ZlciBjZWxsIGZyb20gcGFzc2VkIGNvb3Jkc1xuICAgIGRyYXdDZWxsKG1vdXNlQ29vcmRzWzBdLCBtb3VzZUNvb3Jkc1sxXSk7XG5cbiAgICAvLyBEcmF3IHRoZSBmaXJzdCBoYWxmIG9mIGNlbGxzIGFuZCByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV4dFggPSBtb3VzZUNvb3Jkc1swXSArIGkgKiBkaXJlY3Rpb25YO1xuICAgICAgY29uc3QgbmV4dFkgPSBtb3VzZUNvb3Jkc1sxXSArIGkgKiBkaXJlY3Rpb25ZO1xuICAgICAgZHJhd0NlbGwobmV4dFgsIG5leHRZKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IHRoZSByZW1haW5pbmcgaGFsZlxuICAgIC8vIERyYXcgdGhlIHJlbWFpbmluZyBjZWxscyBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmRHJhd0xlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXh0WCA9IG1vdXNlQ29vcmRzWzBdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblg7XG4gICAgICBjb25zdCBuZXh0WSA9IG1vdXNlQ29vcmRzWzFdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhdHRhY2tIaWdobGlnaHQgPSAoXG4gICAgY29udGV4dCxcbiAgICBjYW52YXNYLFxuICAgIGNhbnZhc1ksXG4gICAgY2VsbFgsXG4gICAgY2VsbFksXG4gICAgbW91c2VDb29yZHMsXG4gICAgZ21cbiAgKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1gsIGNhbnZhc1kpO1xuXG4gICAgLy8gSGlnaGxpZ2h0IHRoZSBjdXJyZW50IGNlbGwgaW4gcmVkXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJlZFwiO1xuXG4gICAgLy8gQ2hlY2sgaWYgY2VsbCBjb29yZHMgaW4gZ2FtZWJvYXJkIGhpdHMgb3IgbWlzc2VzXG4gICAgaWYgKGdtLmFpQm9hcmQuYWxyZWFkeUF0dGFja2VkKG1vdXNlQ29vcmRzKSkgcmV0dXJuO1xuXG4gICAgLy8gSGlnaGxpZ2h0IHRoZSBjZWxsXG4gICAgY29udGV4dC5maWxsUmVjdChcbiAgICAgIG1vdXNlQ29vcmRzWzBdICogY2VsbFgsXG4gICAgICBtb3VzZUNvb3Jkc1sxXSAqIGNlbGxZLFxuICAgICAgY2VsbFgsXG4gICAgICBjZWxsWVxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHsgbGluZXMsIHNoaXBzLCBoaXRPck1pc3MsIHBsYWNlbWVudEhpZ2hsaWdodCwgYXR0YWNrSGlnaGxpZ2h0IH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkcmF3O1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcblxuLyogRmFjdG9yeSB0aGF0IGNyZWF0ZXMgYW5kIHJldHVybnMgYSBwbGF5ZXIgb2JqZWN0IHRoYXQgY2FuIHRha2UgYSBzaG90IGF0IG9wcG9uZW50J3MgZ2FtZSBib2FyZC5cbiAgIFJlcXVpcmVzIGdhbWVNYW5hZ2VyIGZvciBnYW1lYm9hcmQgbWV0aG9kcyAqL1xuY29uc3QgUGxheWVyID0gKGdtKSA9PiB7XG4gIGxldCBwcml2YXRlTmFtZSA9IFwiXCI7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSB7XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gcHJpdmF0ZU5hbWU7XG4gICAgfSxcbiAgICBzZXQgbmFtZShuZXdOYW1lKSB7XG4gICAgICBpZiAobmV3TmFtZSkge1xuICAgICAgICBwcml2YXRlTmFtZSA9IG5ld05hbWUudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBwcml2YXRlTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBnYW1lYm9hcmQ6IEdhbWVib2FyZChnbSksXG4gICAgc2VuZEF0dGFjazogbnVsbCxcbiAgfTtcblxuICAvLyBIZWxwZXIgbWV0aG9kIGZvciB2YWxpZGF0aW5nIHRoYXQgYXR0YWNrIHBvc2l0aW9uIGlzIG9uIGJvYXJkXG4gIGNvbnN0IHZhbGlkYXRlQXR0YWNrID0gKHBvc2l0aW9uLCBnYW1lYm9hcmQpID0+IHtcbiAgICAvLyBEb2VzIGdhbWVib2FyZCBleGlzdCB3aXRoIG1heEJvYXJkWC95IHByb3BlcnRpZXM/XG4gICAgaWYgKCFnYW1lYm9hcmQgfHwgIWdhbWVib2FyZC5tYXhCb2FyZFggfHwgIWdhbWVib2FyZC5tYXhCb2FyZFkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gSXMgcG9zaXRpb24gY29uc3RyYWluZWQgdG8gbWF4Ym9hcmRYL1kgYW5kIGJvdGggYXJlIGludHMgaW4gYW4gYXJyYXk/XG4gICAgaWYgKFxuICAgICAgcG9zaXRpb24gJiZcbiAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgICAgcG9zaXRpb25bMF0gPj0gMCAmJlxuICAgICAgcG9zaXRpb25bMF0gPD0gZ2FtZWJvYXJkLm1heEJvYXJkWCAmJlxuICAgICAgcG9zaXRpb25bMV0gPj0gMCAmJlxuICAgICAgcG9zaXRpb25bMV0gPD0gZ2FtZWJvYXJkLm1heEJvYXJkWVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHNlbmRpbmcgYXR0YWNrIHRvIHJpdmFsIGdhbWVib2FyZFxuICB0aGlzUGxheWVyLnNlbmRBdHRhY2sgPSAocG9zaXRpb24sIHBsYXllckJvYXJkID0gdGhpc1BsYXllci5nYW1lYm9hcmQpID0+IHtcbiAgICBpZiAodmFsaWRhdGVBdHRhY2socG9zaXRpb24sIHBsYXllckJvYXJkKSkge1xuICAgICAgcGxheWVyQm9hcmQucml2YWxCb2FyZC5yZWNlaXZlQXR0YWNrKHBvc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNQbGF5ZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCIvLyBDb250YWlucyB0aGUgbmFtZXMgZm9yIHRoZSBzaGlwcyBiYXNlZCBvbiBpbmRleFxuY29uc3Qgc2hpcE5hbWVzID0ge1xuICAxOiBcIlNlbnRpbmVsIFByb2JlXCIsXG4gIDI6IFwiQXNzYXVsdCBUaXRhblwiLFxuICAzOiBcIlZpcGVyIE1lY2hcIixcbiAgNDogXCJJcm9uIEdvbGlhdGhcIixcbiAgNTogXCJMZXZpYXRoYW5cIixcbn07XG5cbi8vIEZhY3RvcnkgdGhhdCBjYW4gY3JlYXRlIGFuZCByZXR1cm4gb25lIG9mIGEgdmFyaWV0eSBvZiBwcmUtZGV0ZXJtaW5lZCBzaGlwcy5cbmNvbnN0IFNoaXAgPSAoaW5kZXgsIHBvc2l0aW9uLCBkaXJlY3Rpb24pID0+IHtcbiAgLy8gVmFsaWRhdGUgaW5kZXhcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGluZGV4KSB8fCBpbmRleCA+IDUgfHwgaW5kZXggPCAxKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIC8vIENyZWF0ZSB0aGUgc2hpcCBvYmplY3QgdGhhdCB3aWxsIGJlIHJldHVybmVkXG4gIGNvbnN0IHRoaXNTaGlwID0ge1xuICAgIGluZGV4LFxuICAgIHNpemU6IG51bGwsXG4gICAgdHlwZTogbnVsbCxcbiAgICBoaXRzOiAwLFxuICAgIGhpdDogbnVsbCxcbiAgICBpc1N1bms6IG51bGwsXG4gICAgb2NjdXBpZWRDZWxsczogW10sXG4gIH07XG5cbiAgLy8gU2V0IHNoaXAgc2l6ZVxuICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgY2FzZSAxOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICB0aGlzU2hpcC5zaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzU2hpcC5zaXplID0gaW5kZXg7XG4gIH1cblxuICAvLyBTZXQgc2hpcCBuYW1lIGJhc2VkIG9uIGluZGV4XG4gIHRoaXNTaGlwLnR5cGUgPSBzaGlwTmFtZXNbdGhpc1NoaXAuaW5kZXhdO1xuXG4gIC8vIEFkZHMgYSBoaXQgdG8gdGhlIHNoaXBcbiAgdGhpc1NoaXAuaGl0ID0gKCkgPT4ge1xuICAgIHRoaXNTaGlwLmhpdHMgKz0gMTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmVzIGlmIHNoaXAgc3VuayBpcyB0cnVlXG4gIHRoaXNTaGlwLmlzU3VuayA9ICgpID0+IHtcbiAgICBpZiAodGhpc1NoaXAuaGl0cyA+PSB0aGlzU2hpcC5zaXplKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gUGxhY2VtZW50IGRpcmVjdGlvbiBpcyBlaXRoZXIgMCBmb3IgaG9yaXpvbnRhbCBvciAxIGZvciB2ZXJ0aWNhbFxuICBsZXQgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDA7XG4gIGxldCBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMDtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gMCkge1xuICAgIHBsYWNlbWVudERpcmVjdGlvblggPSAxO1xuICAgIHBsYWNlbWVudERpcmVjdGlvblkgPSAwO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gMSkge1xuICAgIHBsYWNlbWVudERpcmVjdGlvblggPSAwO1xuICAgIHBsYWNlbWVudERpcmVjdGlvblkgPSAxO1xuICB9XG5cbiAgLy8gVXNlIHBvc2l0aW9uIGFuZCBkaXJlY3Rpb24gdG8gYWRkIG9jY3VwaWVkIGNlbGxzIGNvb3Jkc1xuICBpZiAoXG4gICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgKGRpcmVjdGlvbiA9PT0gMSB8fCBkaXJlY3Rpb24gPT09IDApXG4gICkge1xuICAgIC8vIERpdmlkZSBsZW5ndGggaW50byBoYWxmIGFuZCByZW1haW5kZXJcbiAgICBjb25zdCBoYWxmU2l6ZSA9IE1hdGguZmxvb3IodGhpc1NoaXAuc2l6ZSAvIDIpO1xuICAgIGNvbnN0IHJlbWFpbmRlclNpemUgPSB0aGlzU2hpcC5zaXplICUgMjtcbiAgICAvLyBBZGQgZmlyc3QgaGFsZiBvZiBjZWxscyBwbHVzIHJlbWFpbmRlciBpbiBvbmUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmU2l6ZSArIHJlbWFpbmRlclNpemU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV3Q29vcmRzID0gW1xuICAgICAgICBwb3NpdGlvblswXSArIGkgKiBwbGFjZW1lbnREaXJlY3Rpb25YLFxuICAgICAgICBwb3NpdGlvblsxXSArIGkgKiBwbGFjZW1lbnREaXJlY3Rpb25ZLFxuICAgICAgXTtcbiAgICAgIHRoaXNTaGlwLm9jY3VwaWVkQ2VsbHMucHVzaChuZXdDb29yZHMpO1xuICAgIH1cbiAgICAvLyBBZGQgc2Vjb25kIGhhbGYgb2YgY2VsbHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZTaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gLSAoaSArIDEpICogcGxhY2VtZW50RGlyZWN0aW9uWCxcbiAgICAgICAgcG9zaXRpb25bMV0gLSAoaSArIDEpICogcGxhY2VtZW50RGlyZWN0aW9uWSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1NoaXA7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBjZWxsUHJvYnMgZnJvbSBcIi4vY2VsbFByb2JzXCI7XG5cbi8vIE1vZHVsZSB0aGF0IGFsbG93cyBhaSB0byBtYWtlIGF0dGFja3MgYmFzZWQgb24gcHJvYmFiaWxpdHkgYSBjZWxsIHdpbGwgcmVzdWx0XG4vLyBpbiBhIGhpdC4gVXNlcyBCYXllc2lhbiBpbmZlcmVuY2UgYWxvbmcgd2l0aCB0d28gQmF0dGxlc2hpcCBnYW1lIHRoZW9yaWVzLlxuY29uc3QgcHJvYnMgPSBjZWxsUHJvYnMoKTtcblxuLy8gVGhpcyBoZWxwZXIgd2lsbCBsb29rIGF0IGN1cnJlbnQgaGl0cyBhbmQgbWlzc2VzIGFuZCB0aGVuIHJldHVybiBhbiBhdHRhY2tcbmNvbnN0IGFpQXR0YWNrID0gKGdtLCBkZWxheSkgPT4ge1xuICBjb25zdCBncmlkSGVpZ2h0ID0gMTA7XG4gIGNvbnN0IGdyaWRXaWR0aCA9IDEwO1xuICBsZXQgYXR0YWNrQ29vcmRzID0gW107XG5cbiAgLy8gVXBkYXRlIGNlbGwgaGl0IHByb2JhYmlsaXRpZXNcbiAgcHJvYnMudXBkYXRlUHJvYnMoZ20pO1xuXG4gIC8vIE1ldGhvZCBmb3IgcmV0dXJuaW5nIHJhbmRvbSBhdHRhY2tcbiAgY29uc3QgZmluZFJhbmRvbUF0dGFjayA9ICgpID0+IHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZFdpZHRoKTtcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZEhlaWdodCk7XG4gICAgYXR0YWNrQ29vcmRzID0gW3gsIHldO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGZpbmRzIGxhcmdlc3QgdmFsdWUgaW4gMmQgYXJyYXlcbiAgY29uc3QgZmluZEdyZWF0ZXN0UHJvYkF0dGFjayA9ICgpID0+IHtcbiAgICBjb25zdCBhbGxQcm9icyA9IHByb2JzLnByb2JzO1xuICAgIGxldCBtYXggPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbFByb2JzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFsbFByb2JzW2ldLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGlmIChhbGxQcm9ic1tpXVtqXSA+IG1heCkge1xuICAgICAgICAgIG1heCA9IGFsbFByb2JzW2ldW2pdO1xuICAgICAgICAgIGF0dGFja0Nvb3JkcyA9IFtpLCBqXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBSYW5kb20gYXR0YWNrIGlmIGFpIGRpZmZpY3VsdHkgaXMgMVxuICBpZiAoZ20uYWlEaWZmaWN1bHR5ID09PSAxKSB7XG4gICAgLy8gU2V0IHJhbmRvbSBhdHRhY2sgIGNvb3JkcyB0aGF0IGhhdmUgbm90IGJlZW4gYXR0YWNrZWRcbiAgICBmaW5kUmFuZG9tQXR0YWNrKCk7XG4gICAgd2hpbGUgKGdtLnVzZXJCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgZmluZFJhbmRvbUF0dGFjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIERvIGFuIGF0dGFjayBiYXNlZCBvbiBwcm9iYWJpbGl0aWVzIGlmIGFpIGRpZmZpY3VsdHkgaXMgMiBhbmQgaXMgc2Vla2luZ1xuICBlbHNlIGlmIChnbS5haURpZmZpY3VsdHkgPT09IDIgJiYgZ20uYWlCb2FyZC5pc0FpU2Vla2luZykge1xuICAgIC8vIEZpcnN0IGVuc3VyZSB0aGF0IGVtcHR5IGNlbGxzIGFyZSBzZXQgdG8gdGhlaXIgaW5pdGlhbGl6ZWQgcHJvYnMgd2hlbiBzZWVraW5nXG4gICAgcHJvYnMucmVzZXRIaXRBZGphY2VudEluY3JlYXNlcygpO1xuICAgIC8vIFRoZW4gZmluZCB0aGUgYmVzdCBhdHRhY2tcbiAgICBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrKCk7XG4gICAgd2hpbGUgKGdtLnVzZXJCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgZmluZEdyZWF0ZXN0UHJvYkF0dGFjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIERvIGFuIGF0dGFjayBiYXNlZCBvbiBkZXN0cm95IGJlaGF2aW9yIGFmdGVyIGEgaGl0IGlzIGZvdW5kXG4gIGVsc2UgaWYgKGdtLmFpRGlmZmljdWx0eSA9PT0gMiAmJiAhZ20uYWlCb2FyZC5pc0FpU2Vla2luZykge1xuICAgIC8vIEdldCBjb29yZHMgdXNpbmcgZGVzdHJveSBtZXRob2RcbiAgICBjb25zdCBjb29yZHMgPSBwcm9icy5kZXN0cm95TW9kZUNvb3JkcyhnbSk7XG4gICAgLy8gSWYgbm8gY29vcmRzIGFyZSByZXR1cm5lZCBpbnN0ZWFkIHVzZSBzZWVraW5nIHN0cmF0XG4gICAgaWYgKCFjb29yZHMpIHtcbiAgICAgIC8vIEZpcnN0IGVuc3VyZSB0aGF0IGVtcHR5IGNlbGxzIGFyZSBzZXQgdG8gdGhlaXIgaW5pdGlhbGl6ZWQgcHJvYnMgd2hlbiBzZWVraW5nXG4gICAgICBwcm9icy5yZXNldEhpdEFkamFjZW50SW5jcmVhc2VzKCk7XG4gICAgICAvLyBUaGVuIGZpbmQgdGhlIGJlc3QgYXR0YWNrXG4gICAgICBmaW5kR3JlYXRlc3RQcm9iQXR0YWNrKCk7XG4gICAgICB3aGlsZSAoZ20udXNlckJvYXJkLmFscmVhZHlBdHRhY2tlZChhdHRhY2tDb29yZHMpKSB7XG4gICAgICAgIGZpbmRHcmVhdGVzdFByb2JBdHRhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRWxzZSBpZiBjb29yZHMgcmV0dXJuZWQsIHVzZSB0aG9zZSBmb3IgYXR0YWNrXG4gICAgZWxzZSBpZiAoY29vcmRzKSB7XG4gICAgICBhdHRhY2tDb29yZHMgPSBjb29yZHM7XG4gICAgfVxuICB9XG4gIC8vIFNlbmQgYXR0YWNrIHRvIGdhbWUgbWFuYWdlclxuICBnbS5haUF0dGFja2luZyhhdHRhY2tDb29yZHMsIGRlbGF5KTtcblxuICAvLyBSZXR1cm4gdGhlIHByb2JzIGZvciBnbSBhY2Nlc3NcbiAgcmV0dXJuIHtcbiAgICBnZXQgcHJvYnMoKSB7XG4gICAgICByZXR1cm4gcHJvYnM7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFpQXR0YWNrO1xuIiwiY29uc3QgY2VsbFByb2JzID0gKCkgPT4ge1xuICAvLyBQcm9iYWJpbGl0eSBtb2RpZmllcnNcbiAgY29uc3QgY29sb3JNb2QgPSAwLjMzOyAvLyBTdHJvbmcgbmVnYXRpdmUgYmlhcyB1c2VkIHRvIGluaXRpYWxpemUgYWxsIHByb2JzXG4gIGNvbnN0IGFkamFjZW50TW9kID0gNDsgLy8gTWVkaXVtIHBvc2l0aXZlIGJpYXMgZm9yIGhpdCBhZGphY2VudCBhZGp1c3RtZW50c1xuXG4gIC8vICNyZWdpb24gQ3JlYXRlIHRoZSBpbml0aWFsIHByb2JzXG4gIC8vIE1ldGhvZCB0aGF0IGNyZWF0ZXMgcHJvYnMgYW5kIGRlZmluZXMgaW5pdGlhbCBwcm9iYWJpbGl0aWVzXG4gIGNvbnN0IGNyZWF0ZVByb2JzID0gKCkgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgcHJvYnMuIEl0IGlzIGEgMTB4MTAgZ3JpZCBvZiBjZWxscy5cbiAgICBjb25zdCBpbml0aWFsUHJvYnMgPSBbXTtcblxuICAgIC8vIFJhbmRvbWx5IGRlY2lkZSB3aGljaCBcImNvbG9yXCIgb24gdGhlIHByb2JzIHRvIGZhdm9yIGJ5IHJhbmRvbWx5IGluaXRpYWxpemluZyBjb2xvciB3ZWlnaHRcbiAgICBjb25zdCBpbml0aWFsQ29sb3JXZWlnaHQgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IGNvbG9yTW9kO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgcHJvYnMgd2l0aCAwJ3NcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgIGluaXRpYWxQcm9icy5wdXNoKEFycmF5KDEwKS5maWxsKDApKTtcbiAgICB9XG5cbiAgICAvLyBBc3NpZ24gaW5pdGlhbCBwcm9iYWJpbGl0aWVzIGJhc2VkIG9uIEFsZW1pJ3MgdGhlb3J5ICgwLjA4IGluIGNvcm5lcnMsIDAuMiBpbiA0IGNlbnRlciBjZWxscylcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93ICs9IDEpIHtcbiAgICAgIC8vIE9uIGV2ZW4gcm93cyBzdGFydCB3aXRoIGFsdGVybmF0ZSBjb2xvciB3ZWlnaHRcbiAgICAgIGxldCBjb2xvcldlaWdodCA9IGluaXRpYWxDb2xvcldlaWdodDtcbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSB7XG4gICAgICAgIGNvbG9yV2VpZ2h0ID0gaW5pdGlhbENvbG9yV2VpZ2h0ID09PSAxID8gY29sb3JNb2QgOiAxO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCArPSAxKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSA0LjU7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSA0LjU7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbUNlbnRlciA9IE1hdGguc3FydChcbiAgICAgICAgICAocm93IC0gY2VudGVyWCkgKiogMiArIChjb2wgLSBjZW50ZXJZKSAqKiAyXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBwcm9iYWJpbGl0eSBiYXNlZCBvbiBFdWNsaWRlYW4gZGlzdGFuY2UgZnJvbSBjZW50ZXJcbiAgICAgICAgY29uc3QgbWluUHJvYmFiaWxpdHkgPSAwLjA4O1xuICAgICAgICBjb25zdCBtYXhQcm9iYWJpbGl0eSA9IDAuMjtcbiAgICAgICAgY29uc3QgcHJvYmFiaWxpdHkgPVxuICAgICAgICAgIG1pblByb2JhYmlsaXR5ICtcbiAgICAgICAgICAobWF4UHJvYmFiaWxpdHkgLSBtaW5Qcm9iYWJpbGl0eSkgKlxuICAgICAgICAgICAgKDEgLSBkaXN0YW5jZUZyb21DZW50ZXIgLyBNYXRoLnNxcnQoNC41ICoqIDIgKyA0LjUgKiogMikpO1xuXG4gICAgICAgIC8vIEFkanVzdCB0aGUgd2VpZ2h0cyBiYXNlZCBvbiBCYXJyeSdzIHRoZW9yeSAoaWYgcHJvYnMgaXMgY2hlY2tlciBwcm9icywgcHJlZmVyIG9uZSBjb2xvcilcbiAgICAgICAgY29uc3QgYmFycnlQcm9iYWJpbGl0eSA9IHByb2JhYmlsaXR5ICogY29sb3JXZWlnaHQ7XG5cbiAgICAgICAgLy8gQXNzaWduIHByb2JhYmlsdHkgdG8gdGhlIHByb2JzXG4gICAgICAgIGluaXRpYWxQcm9ic1tyb3ddW2NvbF0gPSBiYXJyeVByb2JhYmlsaXR5O1xuXG4gICAgICAgIC8vIEZsaXAgdGhlIGNvbG9yIHdlaWdodFxuICAgICAgICBjb2xvcldlaWdodCA9IGNvbG9yV2VpZ2h0ID09PSAxID8gY29sb3JNb2QgOiAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgaW5pdGlhbGl6ZWQgcHJvYnNcbiAgICByZXR1cm4gaW5pdGlhbFByb2JzO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3Igbm9ybWFsaXppbmcgdGhlIHByb2JhYmlsaXRpZXNcbiAgY29uc3Qgbm9ybWFsaXplUHJvYnMgPSAocHJvYnMpID0+IHtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgc3VtIG9mIHByb2JhYmlsaXRpZXMgaW4gdGhlIHByb2JzXG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcHJvYnMubGVuZ3RoOyByb3cgKz0gMSkge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgcHJvYnNbcm93XS5sZW5ndGg7IGNvbCArPSAxKSB7XG4gICAgICAgIHN1bSArPSBwcm9ic1tyb3ddW2NvbF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwcm9iYWJpbGl0aWVzXG4gICAgY29uc3Qgbm9ybWFsaXplZFByb2JzID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcHJvYnMubGVuZ3RoOyByb3cgKz0gMSkge1xuICAgICAgbm9ybWFsaXplZFByb2JzW3Jvd10gPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHByb2JzW3Jvd10ubGVuZ3RoOyBjb2wgKz0gMSkge1xuICAgICAgICBub3JtYWxpemVkUHJvYnNbcm93XVtjb2xdID0gcHJvYnNbcm93XVtjb2xdIC8gc3VtO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3JtYWxpemVkUHJvYnM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIHRoZSBwcm9ic1xuICBjb25zdCBub25Ob3JtYWxpemVkUHJvYnMgPSBjcmVhdGVQcm9icygpO1xuICAvLyBOb3JtYWxpemUgdGhlIHByb2JhYmlsaXRpZXNcbiAgY29uc3QgcHJvYnMgPSBub3JtYWxpemVQcm9icyhub25Ob3JtYWxpemVkUHJvYnMpO1xuICAvLyBDb3B5IHRoZSBpbml0aWFsIHByb2JzIGZvciBsYXRlciB1c2VcbiAgY29uc3QgaW5pdGlhbFByb2JzID0gcHJvYnMubWFwKChyb3cpID0+IFsuLi5yb3ddKTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBHZW5lcmFsIHVzZSBoZWxwZXJzXG4gIC8vIEhlbHBlciB0aGF0IGNoZWNrcyBpZiB2YWxpZCBjZWxsIG9uIGdyaWRcbiAgZnVuY3Rpb24gaXNWYWxpZENlbGwocm93LCBjb2wpIHtcbiAgICAvLyBTZXQgcm93cyBhbmQgY29sc1xuICAgIGNvbnN0IG51bVJvd3MgPSBwcm9ic1swXS5sZW5ndGg7XG4gICAgY29uc3QgbnVtQ29scyA9IHByb2JzLmxlbmd0aDtcbiAgICByZXR1cm4gcm93ID49IDAgJiYgcm93IDwgbnVtUm93cyAmJiBjb2wgPj0gMCAmJiBjb2wgPCBudW1Db2xzO1xuICB9XG5cbiAgLy8gSGVscGVyIHRoYXQgY2hlY2tzIGlmIGNlbGwgaXMgYSBib3VuZGFyeSBvciBtaXNzICgtMSB2YWx1ZSlcbiAgZnVuY3Rpb24gaXNCb3VuZGFyeU9yTWlzcyhyb3csIGNvbCkge1xuICAgIHJldHVybiAhaXNWYWxpZENlbGwocm93LCBjb2wpIHx8IHByb2JzW3Jvd11bY29sXSA9PT0gLTE7XG4gIH1cblxuICAvLyBIZWxwZXJzIGZvciBnZXR0aW5nIHJlbWFpbmluZyBzaGlwIGxlbmd0aHNcbiAgY29uc3QgZ2V0TGFyZ2VzdFJlbWFpbmluZ0xlbmd0aCA9IChnbSkgPT4ge1xuICAgIC8vIExhcmdlc3Qgc2hpcCBsZW5ndGhcbiAgICBsZXQgbGFyZ2VzdFNoaXBMZW5ndGggPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSBPYmplY3Qua2V5cyhnbS51c2VyQm9hcmQuc3Vua2VuU2hpcHMpLmxlbmd0aDsgaSA+PSAxOyBpIC09IDEpIHtcbiAgICAgIGlmICghZ20udXNlckJvYXJkLnN1bmtlblNoaXBzW2ldKSB7XG4gICAgICAgIGxhcmdlc3RTaGlwTGVuZ3RoID0gaTtcbiAgICAgICAgbGFyZ2VzdFNoaXBMZW5ndGggPSBpID09PSAxID8gMiA6IGxhcmdlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBsYXJnZXN0U2hpcExlbmd0aCA9IGkgPT09IDIgPyAzIDogbGFyZ2VzdFNoaXBMZW5ndGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGFyZ2VzdFNoaXBMZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgZ2V0U21hbGxlc3RSZW1haW5pbmdMZW5ndGggPSAoZ20pID0+IHtcbiAgICBsZXQgc21hbGxlc3RTaGlwTGVuZ3RoID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE9iamVjdC5rZXlzKGdtLnVzZXJCb2FyZC5zdW5rZW5TaGlwcykubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmICghZ20udXNlckJvYXJkLnN1bmtlblNoaXBzW2ldKSB7XG4gICAgICAgIHNtYWxsZXN0U2hpcExlbmd0aCA9IGkgPT09IDAgPyAyIDogc21hbGxlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBzbWFsbGVzdFNoaXBMZW5ndGggPSBpID09PSAxID8gMyA6IHNtYWxsZXN0U2hpcExlbmd0aDtcbiAgICAgICAgc21hbGxlc3RTaGlwTGVuZ3RoID0gaSA+IDEgPyBpIDogc21hbGxlc3RTaGlwTGVuZ3RoO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNtYWxsZXN0U2hpcExlbmd0aDtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBEZXN0b3J5IG1vZGUgbW92ZSBkZXRlcm1pbmF0aW9uXG5cbiAgLy8gSGVscGVyIGZvciBsb2FkaW5nIGFkamFjZW50IGNlbGxzIGludG8gYXBwcm9wcmlhdGUgYXJyYXlzXG4gIGNvbnN0IGxvYWRBZGphY2VudENlbGxzID0gKGNlbnRlckNlbGwsIGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzLCBnbSkgPT4ge1xuICAgIC8vIENlbnRlciBDZWxsIHggYW5kIHlcbiAgICBjb25zdCBbY2VudGVyWCwgY2VudGVyWV0gPSBjZW50ZXJDZWxsO1xuICAgIC8vIEFkamFjZW50IHZhbHVlcyByb3cgZmlyc3QsIHRoZW4gY29sXG4gICAgY29uc3QgdG9wID0gW2NlbnRlclkgLSAxLCBjZW50ZXJYLCBcInRvcFwiXTtcbiAgICBjb25zdCBib3R0b20gPSBbY2VudGVyWSArIDEsIGNlbnRlclgsIFwiYm90dG9tXCJdO1xuICAgIGNvbnN0IGxlZnQgPSBbY2VudGVyWSwgY2VudGVyWCAtIDEsIFwibGVmdFwiXTtcbiAgICBjb25zdCByaWdodCA9IFtjZW50ZXJZLCBjZW50ZXJYICsgMSwgXCJyaWdodFwiXTtcblxuICAgIC8vIEZuIHRoYXQgY2hlY2tzIHRoZSBjZWxscyBhbmQgYWRkcyB0aGVtIHRvIGFycmF5c1xuICAgIGZ1bmN0aW9uIGNoZWNrQ2VsbChjZWxsWSwgY2VsbFgsIGRpcmVjdGlvbikge1xuICAgICAgaWYgKGlzVmFsaWRDZWxsKGNlbGxZLCBjZWxsWCkpIHtcbiAgICAgICAgLy8gSWYgaGl0IGFuZCBub3Qgb2NjdXBpZWQgYnkgc3Vua2VuIHNoaXAgYWRkIHRvIGhpdHNcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByb2JzW2NlbGxYXVtjZWxsWV0gPT09IDAgJiZcbiAgICAgICAgICAhZ20udXNlckJvYXJkLmlzQ2VsbFN1bmsoW2NlbGxYLCBjZWxsWV0pXG4gICAgICAgICkge1xuICAgICAgICAgIGFkamFjZW50SGl0cy5wdXNoKFtjZWxsWCwgY2VsbFksIGRpcmVjdGlvbl0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGVtcHR5IGFkZCB0byBlbXBpdGVzXG4gICAgICAgIGVsc2UgaWYgKHByb2JzW2NlbGxYXVtjZWxsWV0gPiAwKSB7XG4gICAgICAgICAgYWRqYWNlbnRFbXB0aWVzLnB1c2goW2NlbGxYLCBjZWxsWSwgZGlyZWN0aW9uXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0NlbGwoLi4udG9wKTtcbiAgICBjaGVja0NlbGwoLi4uYm90dG9tKTtcbiAgICBjaGVja0NlbGwoLi4ubGVmdCk7XG4gICAgY2hlY2tDZWxsKC4uLnJpZ2h0KTtcbiAgfTtcblxuICAvLyBIZWxwZXIgdGhhdCByZXR1cm5zIGhpZ2hlc3QgcHJvYiBhZGphY2VudCBlbXB0eVxuICBjb25zdCByZXR1cm5CZXN0QWRqYWNlbnRFbXB0eSA9IChhZGphY2VudEVtcHRpZXMpID0+IHtcbiAgICBsZXQgYXR0YWNrQ29vcmRzID0gbnVsbDtcbiAgICAvLyBDaGVjayBlYWNoIGVtcHR5IGNlbGwgYW5kIHJldHVybiB0aGUgbW9zdCBsaWtlbHkgaGl0IGJhc2VkIG9uIHByb2JzXG4gICAgbGV0IG1heFZhbHVlID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRqYWNlbnRFbXB0aWVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBhZGphY2VudEVtcHRpZXNbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2JzW3hdW3ldO1xuICAgICAgLy8gVXBkYXRlIG1heFZhbHVlIGlmIGZvdW5kIHZhbHVlIGJpZ2dlciwgYWxvbmcgd2l0aCBhdHRhY2sgY29vcmRzXG4gICAgICBpZiAodmFsdWUgPiBtYXhWYWx1ZSkge1xuICAgICAgICBtYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBhdHRhY2tDb29yZHMgPSBbeCwgeV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRhY2tDb29yZHM7XG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgaGFuZGxpbmcgYWRqYWNlbnQgaGl0cyByZWN1cnNpdmVseVxuICBjb25zdCBoYW5kbGVBZGphY2VudEhpdCA9IChcbiAgICBnbSxcbiAgICBhZGphY2VudEhpdHMsXG4gICAgYWRqYWNlbnRFbXB0aWVzLFxuICAgIGNlbGxDb3VudCA9IDBcbiAgKSA9PiB7XG4gICAgLy8gSW5jcmVtZW50IGNlbGwgY291bnRcbiAgICBsZXQgdGhpc0NvdW50ID0gY2VsbENvdW50ICsgMTtcblxuICAgIC8vIEJpZ2dlc3Qgc2hpcCBsZW5ndGhcbiAgICBjb25zdCBsYXJnZXN0U2hpcExlbmd0aCA9IGdldExhcmdlc3RSZW1haW5pbmdMZW5ndGgoZ20pO1xuXG4gICAgLy8gSWYgdGhpc0NvdW50IGlzIGJpZ2dlciB0aGFuIHRoZSBiaWdnZXN0IHBvc3NpYmxlIGxpbmUgb2Ygc2hpcHNcbiAgICBpZiAodGhpc0NvdW50ID4gbGFyZ2VzdFNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgYWRqYWNlbnQgaGl0IHRvIGNvbnNpZGVyXG4gICAgY29uc3QgaGl0ID0gYWRqYWNlbnRIaXRzWzBdO1xuICAgIGNvbnN0IFtoaXRYLCBoaXRZLCBkaXJlY3Rpb25dID0gaGl0O1xuXG4gICAgLy8gVGhlIG5leHQgY2VsbCBpbiB0aGUgc2FtZSBkaXJlY3Rpb25cbiAgICBsZXQgbmV4dENlbGwgPSBudWxsO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwidG9wXCIpIG5leHRDZWxsID0gW2hpdFgsIGhpdFkgLSAxXTtcbiAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwiYm90dG9tXCIpIG5leHRDZWxsID0gW2hpdFgsIGhpdFkgKyAxXTtcbiAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwibGVmdFwiKSBuZXh0Q2VsbCA9IFtoaXRYIC0gMSwgaGl0WV07XG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIG5leHRDZWxsID0gW2hpdFggKyAxLCBoaXRZXTtcbiAgICBjb25zdCBbbmV4dFgsIG5leHRZXSA9IG5leHRDZWxsO1xuXG4gICAgLy8gUmVmIHRvIGZvdW5kIGVtcHR5XG4gICAgbGV0IGZvdW5kRW1wdHkgPSBudWxsO1xuXG4gICAgLy8gSWYgY2VsbCBjb3VudCBpcyBub3QgbGFyZ2VyIHRoYW4gdGhlIGJpZ2dlc3QgcmVtYWluaW5nIHNoaXBcbiAgICBjb25zdCBjaGVja05leHRDZWxsID0gKG5YLCBuWSkgPT4ge1xuICAgICAgaWYgKHRoaXNDb3VudCA8PSBsYXJnZXN0U2hpcExlbmd0aCkge1xuICAgICAgICAvLyBJZiBuZXh0IGNlbGwgaXMgYSBtaXNzIHN0b3AgY2hlY2tpbmcgaW4gdGhpcyBkaXJlY3Rpb24gYnkgcmVtb3ZpbmcgdGhlIGFkamFjZW50SGl0XG4gICAgICAgIGlmIChwcm9ic1tuWF1bblldID09PSAtMSB8fCAhaXNWYWxpZENlbGwoblksIG5YKSkge1xuICAgICAgICAgIGFkamFjZW50SGl0cy5zaGlmdCgpO1xuICAgICAgICAgIC8vIFRoZW4gaWYgYWRqYWNlbnQgaGl0cyBpc24ndCBlbXB0eSB0cnkgdG8gaGFuZGxlIHRoZSBuZXh0IGFkamFjZW50IGhpdFxuICAgICAgICAgIGlmIChhZGphY2VudEhpdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm91bmRFbXB0eSA9IGhhbmRsZUFkamFjZW50SGl0KGdtLCBhZGphY2VudEhpdHMsIGFkamFjZW50RW1wdGllcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEVsc2UgaWYgaXQgaXMgZW1wdHkgdHJ5IHRvIHNldCBmb3VuZEVtcHR5IHRvIGl0XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3VuZEVtcHR5ID0gcmV0dXJuQmVzdEFkamFjZW50RW1wdHkoYWRqYWNlbnRFbXB0aWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlIGNlbGwgaXMgYSBoaXRcbiAgICAgICAgZWxzZSBpZiAocHJvYnNbblhdW25ZXSA9PT0gMCkge1xuICAgICAgICAgIC8vIEluY3JlbWVudCB0aGUgY2VsbCBjb3VudFxuICAgICAgICAgIHRoaXNDb3VudCArPSAxO1xuICAgICAgICAgIC8vIE5ldyBuZXh0IGNlbGwgcmVmXG4gICAgICAgICAgbGV0IG5ld05leHQgPSBudWxsO1xuICAgICAgICAgIC8vIEluY3JlbWVudCB0aGUgbmV4dENlbGwgaW4gdGhlIHNhbWUgZGlyZWN0aW9uIGFzIGFkamFjZW50IGhpdCBiZWluZyBjaGVja2VkXG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJ0b3BcIikgbmV3TmV4dCA9IFtuWCwgblkgLSAxXTtcbiAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwiYm90dG9tXCIpIG5ld05leHQgPSBbblgsIG5ZICsgMV07XG4gICAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcImxlZnRcIikgbmV3TmV4dCA9IFtuWCAtIDEsIG5ZXTtcbiAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwicmlnaHRcIikgbmV3TmV4dCA9IFtuWCArIDEsIG5ZXTtcbiAgICAgICAgICAvLyBTZXQgbmV4dFggYW5kIG5leHRZIHRvIHRoZSBjb29yZHMgb2YgdGhpcyBpbmNyZW1lbnRlZCBuZXh0IGNlbGxcbiAgICAgICAgICBjb25zdCBbbmV3WCwgbmV3WV0gPSBuZXdOZXh0O1xuICAgICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNoZWNrIHRoZSBuZXh0IGNlbGxcbiAgICAgICAgICBjaGVja05leHRDZWxsKG5ld1gsIG5ld1kpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBjZWxsIGlzIGVtcHR5IGFuZCB2YWxpZFxuICAgICAgICBlbHNlIGlmIChpc1ZhbGlkQ2VsbChuWSwgblgpICYmIHByb2JzW25YXVtuWV0gPiAwKSB7XG4gICAgICAgICAgZm91bmRFbXB0eSA9IFtuWCwgblldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIEluaXRpYWwgY2FsbCB0byBhYm92ZSByZWN1cnNpdmUgaGVscGVyXG4gICAgaWYgKHRoaXNDb3VudCA8PSBsYXJnZXN0U2hpcExlbmd0aCkge1xuICAgICAgY2hlY2tOZXh0Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3VuZEVtcHR5O1xuICB9O1xuXG4gIC8vIEhlbHBlciBtZXRob2QgZm9yIGNoZWNraW5nIHRoZSBhZGphY2VudCBoaXRzIGZvciBuZWFyYnkgZW1wdGllc1xuICBjb25zdCBjaGVja0FkamFjZW50Q2VsbHMgPSAoYWRqYWNlbnRIaXRzLCBhZGphY2VudEVtcHRpZXMsIGdtKSA9PiB7XG4gICAgLy8gVmFyaWFibGUgZm9yIGNvb3JkaWF0ZXMgdG8gcmV0dXJuXG4gICAgbGV0IGF0dGFja0Nvb3JkcyA9IG51bGw7XG5cbiAgICAvLyBJZiBubyBoaXRzIHRoZW4gc2V0IGF0dGFja0Nvb3JkcyB0byBhbiBlbXB0eSBjZWxsIGlmIG9uZSBleGlzdHNcbiAgICBpZiAoYWRqYWNlbnRIaXRzLmxlbmd0aCA9PT0gMCAmJiBhZGphY2VudEVtcHRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgYXR0YWNrQ29vcmRzID0gcmV0dXJuQmVzdEFkamFjZW50RW1wdHkoYWRqYWNlbnRFbXB0aWVzKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgaGl0cyB0aGVuIGhhbmRsZSBjaGVja2luZyBjZWxscyBhZnRlciB0aGVtIHRvIGZpbmQgZW1wdHkgZm9yIGF0dGFja1xuICAgIGlmIChhZGphY2VudEhpdHMubGVuZ3RoID4gMCkge1xuICAgICAgYXR0YWNrQ29vcmRzID0gaGFuZGxlQWRqYWNlbnRIaXQoZ20sIGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0YWNrQ29vcmRzO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgZGVzdHJ5aW5nIGZvdW5kIHNoaXBzXG4gIGNvbnN0IGRlc3Ryb3lNb2RlQ29vcmRzID0gKGdtKSA9PiB7XG4gICAgLy8gTG9vayBhdCBmaXJzdCBjZWxsIHRvIGNoZWNrIHdoaWNoIHdpbGwgYmUgdGhlIG9sZGVzdCBhZGRlZCBjZWxsXG4gICAgY29uc3QgY2VsbFRvQ2hlY2sgPSBnbS5haUJvYXJkLmNlbGxzVG9DaGVja1swXTtcblxuICAgIC8vIFB1dCBhbGwgYWRqYWNlbnQgY2VsbHMgaW4gYWRqYWNlbnRFbXB0aWVzL2FkamFjZW50SGl0c1xuICAgIGNvbnN0IGFkamFjZW50SGl0cyA9IFtdO1xuICAgIGNvbnN0IGFkamFjZW50RW1wdGllcyA9IFtdO1xuICAgIGxvYWRBZGphY2VudENlbGxzKGNlbGxUb0NoZWNrLCBhZGphY2VudEhpdHMsIGFkamFjZW50RW1wdGllcywgZ20pO1xuXG4gICAgY29uc3QgYXR0YWNrQ29vcmRzID0gY2hlY2tBZGphY2VudENlbGxzKGFkamFjZW50SGl0cywgYWRqYWNlbnRFbXB0aWVzLCBnbSk7XG5cbiAgICAvLyBJZiBhamRhY2VudEVtcHRpZXMgYW5kIGFkamFjZW50SGl0cyBhcmUgYm90aCBlbXB0eSBhbmQgYXR0YWNrIGNvb3JkcyBudWxsXG4gICAgaWYgKFxuICAgICAgYXR0YWNrQ29vcmRzID09PSBudWxsICYmXG4gICAgICBhZGphY2VudEhpdHMubGVuZ3RoID09PSAwICYmXG4gICAgICBhZGphY2VudEVtcHRpZXMubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IGVudHJ5IG9mIGNlbGxzIHRvIGNoZWNrXG4gICAgICBnbS5haUJvYXJkLmNlbGxzVG9DaGVjay5zaGlmdCgpO1xuICAgICAgLy8gSWYgY2VsbHMgcmVtYWluIHRvIGJlIGNoZWNrZWRcbiAgICAgIGlmIChnbS5haUJvYXJkLmNlbGxzVG9DaGVjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRyeSB1c2luZyB0aGUgbmV4dCBjZWxsIHRvIGNoZWNrIGZvciBkZXN0cm95TW9kZUNvb3Jkc1xuICAgICAgICBkZXN0cm95TW9kZUNvb3JkcyhnbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coYERlc3Ryb3kgdGFyZ2V0IGZvdW5kISAke2F0dGFja0Nvb3Jkc31gKTtcbiAgICByZXR1cm4gYXR0YWNrQ29vcmRzO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhlbHBlciBtZXRob2RzIGZvciB1cGRhdGVQcm9ic1xuICAvLyBSZWNvcmRzIHdpY2ggY2VsbHMgd2VyZSBhbHRlcmVkIHdpdGggaGlkQWRqYWNlbnRJbmNyZWFzZVxuICBjb25zdCBpbmNyZWFzZWRBZGphY2VudENlbGxzID0gW107XG4gIC8vIEluY3JlYXNlIGFkamFjZW50IGNlbGxzIHRvIG5ldyBoaXRzXG4gIGNvbnN0IGhpdEFkamFjZW50SW5jcmVhc2UgPSAoaGl0WCwgaGl0WSwgbGFyZ2VzdExlbmd0aCkgPT4ge1xuICAgIC8vIFZhcnMgZm9yIGNhbGN1bGF0aW5nIGRlY3JlbWVudCBmYWN0b3JcbiAgICBjb25zdCBzdGFydGluZ0RlYyA9IDE7XG4gICAgY29uc3QgZGVjUGVyY2VudGFnZSA9IDAuMTtcbiAgICBjb25zdCBtaW5EZWMgPSAwLjU7XG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIGNlbGxzIGFuZCB1cGRhdGUgdGhlbVxuICAgIC8vIE5vcnRoXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXJnZXN0TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBkZWNyZW1lbnRGYWN0b3IgPSBzdGFydGluZ0RlYyAtIGkgKiBkZWNQZXJjZW50YWdlO1xuICAgICAgaWYgKGRlY3JlbWVudEZhY3RvciA8IG1pbkRlYykgZGVjcmVtZW50RmFjdG9yID0gbWluRGVjO1xuICAgICAgLy8gTm9ydGggaWYgb24gYm9hcmRcbiAgICAgIGlmIChoaXRZIC0gaSA+PSAwKSB7XG4gICAgICAgIC8vIEluY3JlYXNlIHRoZSBwcm9iYWJpbGl0eVxuICAgICAgICBwcm9ic1toaXRYXVtoaXRZIC0gaV0gKj0gYWRqYWNlbnRNb2QgKiBkZWNyZW1lbnRGYWN0b3I7XG4gICAgICAgIC8vIFJlY29yZCB0aGUgY2VsbCB0byBpbmNyZWFzZWQgYWRqYWNlbnQgY2VsbHMgZm9yIGxhdGVyIHVzZVxuICAgICAgICBpbmNyZWFzZWRBZGphY2VudENlbGxzLnB1c2goW2hpdFgsIGhpdFkgLSBpXSk7XG4gICAgICB9XG4gICAgICAvLyBTb3V0aCBpZiBvbiBib2FyZFxuICAgICAgaWYgKGhpdFkgKyBpIDw9IDkpIHtcbiAgICAgICAgcHJvYnNbaGl0WF1baGl0WSArIGldICo9IGFkamFjZW50TW9kICogZGVjcmVtZW50RmFjdG9yO1xuICAgICAgICBpbmNyZWFzZWRBZGphY2VudENlbGxzLnB1c2goW2hpdFgsIGhpdFkgKyBpXSk7XG4gICAgICB9XG4gICAgICAvLyBXZXN0IGlmIG9uIGJvYXJkXG4gICAgICBpZiAoaGl0WCAtIGkgPj0gMCkge1xuICAgICAgICBwcm9ic1toaXRYIC0gaV1baGl0WV0gKj0gYWRqYWNlbnRNb2QgKiBkZWNyZW1lbnRGYWN0b3I7XG4gICAgICAgIGluY3JlYXNlZEFkamFjZW50Q2VsbHMucHVzaChbaGl0WCAtIGksIGhpdFldKTtcbiAgICAgIH1cbiAgICAgIC8vIEVhc3QgaWYgb24gYm9hcmRcbiAgICAgIGlmIChoaXRYICsgaSA8PSA5KSB7XG4gICAgICAgIHByb2JzW2hpdFggKyBpXVtoaXRZXSAqPSBhZGphY2VudE1vZCAqIGRlY3JlbWVudEZhY3RvcjtcbiAgICAgICAgaW5jcmVhc2VkQWRqYWNlbnRDZWxscy5wdXNoKFtoaXRYICsgaSwgaGl0WV0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZXNldEhpdEFkamFjZW50SW5jcmVhc2VzID0gKCkgPT4ge1xuICAgIC8vIElmIGxpc3QgZW1wdHkgdGhlbiBqdXN0IHJldHVyblxuICAgIGlmIChpbmNyZWFzZWRBZGphY2VudENlbGxzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIC8vIElmIHRoZSB2YWx1ZXMgaW4gdGhlIGxpc3QgYXJlIHN0aWxsIGVtcHR5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmNyZWFzZWRBZGphY2VudENlbGxzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBpbmNyZWFzZWRBZGphY2VudENlbGxzW2ldO1xuICAgICAgaWYgKHByb2JzW3hdW3ldID4gMCkge1xuICAgICAgICAvLyBSZS1pbml0aWFsaXplIHRoZWlyIHByb2IgdmFsdWVcbiAgICAgICAgcHJvYnNbeF1beV0gPSBpbml0aWFsUHJvYnNbeF1beV07XG4gICAgICAgIC8vIEFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBsaXN0XG4gICAgICAgIGluY3JlYXNlZEFkamFjZW50Q2VsbHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAvLyBSZXNldCB0aGUgaXRlcmF0b3JcbiAgICAgICAgaSA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja0RlYWRDZWxscyA9ICgpID0+IHtcbiAgICAvLyBTZXQgcm93cyBhbmQgY29sc1xuICAgIGNvbnN0IG51bVJvd3MgPSBwcm9ic1swXS5sZW5ndGg7XG4gICAgY29uc3QgbnVtQ29scyA9IHByb2JzLmxlbmd0aDtcblxuICAgIC8vIEZvciBldmVyeSBjZWxsLCBjaGVjayB0aGUgY2VsbHMgYXJvdW5kIGl0LiBJZiB0aGV5IGFyZSBhbGwgYm91bmRhcnkgb3IgbWlzcyB0aGVuIHNldCB0byAtMVxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG51bVJvd3M7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBudW1Db2xzOyBjb2wgKz0gMSkge1xuICAgICAgICAvLyBJZiB0aGUgY2VsbCBpcyBhbiBlbXB0eSBjZWxsICg+IDApIGFuZCBhZGphY2VudCBjZWxscyBhcmUgYm91bmRhcnkgb3IgbWlzc1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcHJvYnNbcm93XVtjb2xdID4gMCAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93LCBjb2wgLSAxKSAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93LCBjb2wgKyAxKSAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93IC0gMSwgY29sKSAmJlxuICAgICAgICAgIGlzQm91bmRhcnlPck1pc3Mocm93ICsgMSwgY29sKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBTZXQgdGhhdCBjZWxsIHRvIGEgbWlzcyBzaW5jZSBpdCBjYW5ub3QgYmUgYSBoaXRcbiAgICAgICAgICBwcm9ic1tyb3ddW2NvbF0gPSAtMTtcbiAgICAgICAgICAvKiBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGAke3Jvd30sICR7Y29sfSBzdXJyb3VuZGVkIGFuZCBjYW5ub3QgYmUgYSBoaXQuIFNldCB0byBtaXNzLmBcbiAgICAgICAgICApOyAqL1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIE1ldGhvZCBhbmQgaGVscGVyIGZvciBsb2dnaW5nIHByb2JzXG4gIC8vIEhlbHBlciB0byB0cmFuc3Bvc2UgYXJyYXkgZm9yIGNvbnNvbGUudGFibGUncyBhbm5veWluZyBjb2wgZmlyc3QgYXBwcm9hY2hcbiAgY29uc3QgdHJhbnNwb3NlQXJyYXkgPSAoYXJyYXkpID0+XG4gICAgYXJyYXlbMF0ubWFwKChfLCBjb2xJbmRleCkgPT4gYXJyYXkubWFwKChyb3cpID0+IHJvd1tjb2xJbmRleF0pKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IGxvZ1Byb2JzID0gKHByb2JzVG9Mb2cpID0+IHtcbiAgICAvLyBMb2cgdGhlIHByb2JzXG4gICAgY29uc3QgdHJhbnNwb3NlZFByb2JzID0gdHJhbnNwb3NlQXJyYXkocHJvYnNUb0xvZyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLnRhYmxlKHRyYW5zcG9zZWRQcm9icyk7XG4gICAgLy8gTG9nIHRoZSB0b2FsIG9mIGFsbCBwcm9ic1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coXG4gICAgICBwcm9ic1RvTG9nLnJlZHVjZShcbiAgICAgICAgKHN1bSwgcm93KSA9PiBzdW0gKyByb3cucmVkdWNlKChyb3dTdW0sIHZhbHVlKSA9PiByb3dTdW0gKyB2YWx1ZSwgMCksXG4gICAgICAgIDBcbiAgICAgIClcbiAgICApO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBNZXRob2QgdGhhdCB1cGRhdGVzIHByb2JhYmlsaXRpZXMgYmFzZWQgb24gaGl0cywgbWlzc2VzLCBhbmQgcmVtYWluaW5nIHNoaXBzJyBsZW5ndGhzXG4gIGNvbnN0IHVwZGF0ZVByb2JzID0gKGdtKSA9PiB7XG4gICAgLy8gVGhlc2UgdmFsdWVzIGFyZSB1c2VkIGFzIHRoZSBldmlkZW5jZSB0byB1cGRhdGUgdGhlIHByb2JhYmlsaXRpZXMgb24gdGhlIHByb2JzXG4gICAgY29uc3QgeyBoaXRzLCBtaXNzZXMgfSA9IGdtLnVzZXJCb2FyZDtcblxuICAgIC8vIExhcmdlc3Qgc2hpcCBsZW5ndGhcbiAgICBjb25zdCBsYXJnZXN0U2hpcExlbmd0aCA9IGdldExhcmdlc3RSZW1haW5pbmdMZW5ndGgoZ20pO1xuICAgIC8vIFNtYWxsZXN0IHNoaXAgbGVuZ3RoXG4gICAgY29uc3Qgc21hbGxlc3RTaGlwTGVuZ3RoID0gZ2V0U21hbGxlc3RSZW1haW5pbmdMZW5ndGgoZ20pO1xuXG4gICAgLy8gVXBkYXRlIHZhbHVlcyBiYXNlZCBvbiBoaXRzXG4gICAgT2JqZWN0LnZhbHVlcyhoaXRzKS5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGhpdDtcbiAgICAgIC8vIElmIHRoZSBoaXQgaXMgbmV3LCBhbmQgdGhlcmVmb3JlIHRoZSBwcm9iIGZvciB0aGF0IGhpdCBpcyBub3QgeWV0IDBcbiAgICAgIGlmIChwcm9ic1t4XVt5XSAhPT0gMCkge1xuICAgICAgICAvLyBBcHBseSB0aGUgaW5jcmVhc2UgdG8gYWRqYWNlbnQgY2VsbHMuIFRoaXMgd2lsbCBiZSByZWR1Y2VkIHRvIGluaXRhbCBwcm9icyBvbiBzZWVrIG1vZGUuXG4gICAgICAgIGhpdEFkamFjZW50SW5jcmVhc2UoeCwgeSwgbGFyZ2VzdFNoaXBMZW5ndGgpO1xuICAgICAgICAvLyBTZXQgdGhlIHByb2JhYmlsaXR5IG9mIHRoZSBoaXQgdG8gMFxuICAgICAgICBwcm9ic1t4XVt5XSA9IDA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdmFsdWVzIGJhc2VkIG9uIG1pc3Nlc1xuICAgIE9iamVjdC52YWx1ZXMobWlzc2VzKS5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBjb25zdCBbeCwgeV0gPSBtaXNzO1xuICAgICAgLy8gU2V0IHRoZSBwcm9iYWJpbGl0eSBvZiBldmVyeSBtaXNzIHRvIDAgdG8gcHJldmVudCB0aGF0IGNlbGwgZnJvbSBiZWluZyB0YXJnZXRlZFxuICAgICAgcHJvYnNbeF1beV0gPSAtMTtcbiAgICB9KTtcblxuICAgIC8qIFJlZHVjZSB0aGUgY2hhbmNlIG9mIGdyb3VwcyBvZiBjZWxscyB0aGF0IGFyZSBzdXJyb3VuZGVkIGJ5IG1pc3NlcyBvciB0aGUgZWRnZSBvZiB0aGUgYm9hcmQgXG4gICAgaWYgdGhlIGdyb3VwIGxlbmd0aCBpcyBub3QgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBncmVhdGVzdCByZW1haW5pbmcgc2hpcCBsZW5ndGguICovXG4gICAgY2hlY2tEZWFkQ2VsbHMoc21hbGxlc3RTaGlwTGVuZ3RoKTtcblxuICAgIC8vIE9wdGlvbmFsbHkgbG9nIHRoZSByZXN1bHRzXG4gICAgLy8gbG9nUHJvYnMocHJvYnMpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdXBkYXRlUHJvYnMsXG4gICAgcmVzZXRIaXRBZGphY2VudEluY3JlYXNlcyxcbiAgICBkZXN0cm95TW9kZUNvb3JkcyxcbiAgICBwcm9icyxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNlbGxQcm9icztcbiIsImltcG9ydCBncmlkQ2FudmFzIGZyb20gXCIuLi9mYWN0b3JpZXMvR3JpZENhbnZhcy9HcmlkQ2FudmFzXCI7XG5cbi8qIFRoaXMgbW9kdWxlIGNyZWF0ZXMgY2FudmFzIGVsZW1lbnRzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIGFwcHJvcHJpYXRlIFxuICAgcGxhY2VzIGluIHRoZSBET00uICovXG5jb25zdCBjYW52YXNBZGRlciA9ICh1c2VyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCwgd2ViSW50ZXJmYWNlLCBnbSkgPT4ge1xuICAvLyBSZXBsYWNlIHRoZSB0aHJlZSBncmlkIHBsYWNlaG9sZGVyIGVsZW1lbnRzIHdpdGggdGhlIHByb3BlciBjYW52YXNlc1xuICAvLyBSZWZzIHRvIERPTSBlbGVtZW50c1xuICBjb25zdCBwbGFjZW1lbnRQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWNhbnZhcy1waFwiKTtcbiAgY29uc3QgdXNlclBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyLWNhbnZhcy1waFwiKTtcbiAgY29uc3QgYWlQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktY2FudmFzLXBoXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgY2FudmFzZXNcblxuICBjb25zdCB1c2VyQ2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICBnbSxcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJ1c2VyXCIgfSxcbiAgICB1c2VyR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZVxuICApO1xuICBjb25zdCBhaUNhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgZ20sXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwiYWlcIiB9LFxuICAgIGFpR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZVxuICApO1xuICBjb25zdCBwbGFjZW1lbnRDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIGdtLFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcInBsYWNlbWVudFwiIH0sXG4gICAgdXNlckdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2UsXG4gICAgdXNlckNhbnZhc1xuICApO1xuXG4gIC8vIFJlcGxhY2UgdGhlIHBsYWNlIGhvbGRlcnNcbiAgcGxhY2VtZW50UEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGxhY2VtZW50Q2FudmFzLCBwbGFjZW1lbnRQSCk7XG4gIHVzZXJQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1c2VyQ2FudmFzLCB1c2VyUEgpO1xuICBhaVBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGFpQ2FudmFzLCBhaVBIKTtcblxuICAvLyBSZXR1cm4gdGhlIGNhbnZhc2VzXG4gIHJldHVybiB7IHBsYWNlbWVudENhbnZhcywgdXNlckNhbnZhcywgYWlDYW52YXMgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNhbnZhc0FkZGVyO1xuIiwiY29uc3QgaW1hZ2VMb2FkZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGltYWdlUmVmcyA9IHtcbiAgICBTUDogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgQVQ6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIFZNOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBJRzogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgTDogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gIH07XG5cbiAgY29uc3QgaW1hZ2VDb250ZXh0ID0gcmVxdWlyZS5jb250ZXh0KFwiLi4vc2NlbmUtaW1hZ2VzXCIsIHRydWUsIC9cXC5qcGckL2kpO1xuICBjb25zdCBmaWxlcyA9IGltYWdlQ29udGV4dC5rZXlzKCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGltYWdlQ29udGV4dChmaWxlKTtcbiAgICBjb25zdCBmaWxlTmFtZSA9IGZpbGUudG9Mb3dlckNhc2UoKTtcblxuICAgIGNvbnN0IHN1YkRpciA9IGZpbGUuc3BsaXQoXCIvXCIpWzFdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCJoaXRcIikpIHtcbiAgICAgIGltYWdlUmVmc1tzdWJEaXJdLmhpdC5wdXNoKGZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGZpbGVOYW1lLmluY2x1ZGVzKFwiYXR0YWNrXCIpKSB7XG4gICAgICBpbWFnZVJlZnNbc3ViRGlyXS5hdHRhY2sucHVzaChmaWxlUGF0aCk7XG4gICAgfSBlbHNlIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcImdlblwiKSkge1xuICAgICAgaW1hZ2VSZWZzW3N1YkRpcl0uZ2VuLnB1c2goZmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbWFnZVJlZnM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbWFnZUxvYWRlcjtcbiIsImltcG9ydCByYW5kb21TaGlwcyBmcm9tIFwiLi9yYW5kb21TaGlwc1wiO1xuXG4vLyBUaGlzIGhlbHBlciB3aWxsIGF0dGVtcHQgdG8gYWRkIHNoaXBzIHRvIHRoZSBhaSBnYW1lYm9hcmQgaW4gYSB2YXJpZXR5IG9mIHdheXMgZm9yIHZhcnlpbmcgZGlmZmljdWx0eVxuY29uc3QgcGxhY2VBaVNoaXBzID0gKHBhc3NlZERpZmYsIGFpR2FtZWJvYXJkKSA9PiB7XG4gIC8vIEdyaWQgc2l6ZVxuICBjb25zdCBncmlkSGVpZ2h0ID0gMTA7XG4gIGNvbnN0IGdyaWRXaWR0aCA9IDEwO1xuXG4gIC8vIFBsYWNlIGEgc2hpcCBhbG9uZyBlZGdlcyB1bnRpbCBvbmUgc3VjY2Vzc2Z1bGx5IHBsYWNlZCA/XG4gIC8vIFBsYWNlIGEgc2hpcCBiYXNlZCBvbiBxdWFkcmFudCA/XG5cbiAgLy8gQ29tYmluZSBwbGFjZW1lbnQgdGFjdGljcyB0byBjcmVhdGUgdmFyeWluZyBkaWZmaWN1bHRpZXNcbiAgY29uc3QgcGxhY2VTaGlwcyA9IChkaWZmaWN1bHR5KSA9PiB7XG4gICAgLy8gVG90YWxseSByYW5kb20gcGFsY2VtZW50XG4gICAgaWYgKGRpZmZpY3VsdHkgPT09IDEpIHtcbiAgICAgIC8vIFBsYWNlIHNoaXBzIHJhbmRvbWx5XG4gICAgICByYW5kb21TaGlwcyhhaUdhbWVib2FyZCwgZ3JpZFdpZHRoLCBncmlkSGVpZ2h0KTtcbiAgICB9XG4gIH07XG5cbiAgcGxhY2VTaGlwcyhwYXNzZWREaWZmKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlQWlTaGlwcztcbiIsImNvbnN0IHJhbmRvbVNoaXBzID0gKGdhbWVib2FyZCwgZ3JpZFgsIGdyaWRZKSA9PiB7XG4gIC8vIEV4aXQgZnJvbSByZWN1cnNpb25cbiAgaWYgKGdhbWVib2FyZC5zaGlwcy5sZW5ndGggPiA0KSByZXR1cm47XG4gIC8vIEdldCByYW5kb20gcGxhY2VtZW50XG4gIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkWCk7XG4gIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkWSk7XG4gIGNvbnN0IGRpcmVjdGlvbiA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG5cbiAgLy8gVHJ5IHRoZSBwbGFjZW1lbnRcbiAgZ2FtZWJvYXJkLmFkZFNoaXAoW3gsIHldLCBkaXJlY3Rpb24pO1xuXG4gIC8vIEtlZXAgZG9pbmcgaXQgdW50aWwgYWxsIHNoaXBzIGFyZSBwbGFjZWRcbiAgcmFuZG9tU2hpcHMoZ2FtZWJvYXJkLCBncmlkWCwgZ3JpZFkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmFuZG9tU2hpcHM7XG4iLCJpbXBvcnQgaW1hZ2VMb2FkZXIgZnJvbSBcIi4uL2hlbHBlcnMvaW1hZ2VMb2FkZXJcIjtcblxuY29uc3QgZ2FtZUxvZyA9ICgodXNlck5hbWUgPSBcIlVzZXJcIikgPT4ge1xuICAvLyBGbGFnIGZvciB0dXJuaW5nIG9mZiBzY2VuZSB1cGRhdGVzXG4gIGxldCBkb1VwZGF0ZVNjZW5lID0gdHJ1ZTtcbiAgLy8gRmxhZyBmb3IgbG9ja2luZyB0aGUgbG9nXG4gIGxldCBkb0xvY2sgPSBmYWxzZTtcblxuICAvLyBBZGQgYSBwcm9wZXJ0eSB0byBzdG9yZSB0aGUgZ2FtZWJvYXJkXG4gIGxldCB1c2VyR2FtZWJvYXJkID0gbnVsbDtcblxuICAvLyBTZXR0ZXIgbWV0aG9kIHRvIHNldCB0aGUgZ2FtZWJvYXJkXG4gIGNvbnN0IHNldFVzZXJHYW1lYm9hcmQgPSAoZ2FtZWJvYXJkKSA9PiB7XG4gICAgdXNlckdhbWVib2FyZCA9IGdhbWVib2FyZDtcbiAgfTtcblxuICAvLyBSZWYgdG8gbG9nIHRleHRcbiAgY29uc3QgbG9nVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9nLXRleHRcIik7XG4gIGNvbnN0IGxvZ0ltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2NlbmUtaW1nXCIpO1xuXG4gIC8vIExvZyBzY2VuZSBoYW5kbGluZ1xuICBsZXQgc2NlbmVJbWFnZXMgPSBudWxsO1xuICAvLyBNZXRob2QgZm9yIGxvYWRpbmcgc2NlbmUgaW1hZ2VzLiBNdXN0IGJlIHJ1biBvbmNlIGluIGdhbWUgbWFuYWdlci5cbiAgY29uc3QgbG9hZFNjZW5lcyA9ICgpID0+IHtcbiAgICBzY2VuZUltYWdlcyA9IGltYWdlTG9hZGVyKCk7XG4gIH07XG5cbiAgLy8gR2V0cyBhIHJhbmRvbSBhcnJheSBlbnRyeVxuICBmdW5jdGlvbiByYW5kb21FbnRyeShhcnJheSkge1xuICAgIGNvbnN0IGxhc3RJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGxhc3RJbmRleCArIDEpKTtcbiAgICByZXR1cm4gcmFuZG9tTnVtYmVyO1xuICB9XG5cbiAgLy8gR2V0cyBhIHJhbmRvbSB1c2VyIHNoaXAgdGhhdCBpc24ndCBkZXN0cm95ZWRcbiAgY29uc3QgZGlyTmFtZXMgPSB7IDA6IFwiU1BcIiwgMTogXCJBVFwiLCAyOiBcIlZNXCIsIDM6IFwiSUdcIiwgNDogXCJMXCIgfTtcbiAgZnVuY3Rpb24gcmFuZG9tU2hpcERpcihnYW1lYm9hcmQgPSB1c2VyR2FtZWJvYXJkKSB7XG4gICAgY29uc3QgcmVtYWluaW5nU2hpcHMgPSBPYmplY3QudmFsdWVzKGdhbWVib2FyZC5zaGlwcykuZmlsdGVyKFxuICAgICAgKHNoaXApID0+ICFzaGlwLmlzU3VuaygpXG4gICAgKTtcblxuICAgIGlmIChyZW1haW5pbmdTaGlwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVuIGFsbCBzaGlwcyBhcmUgc3Vua1xuICAgICAgY29uc3QgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSk7XG4gICAgICByZXR1cm4gZGlyTmFtZXNbcmFuZG9tTnVtYmVyXTtcbiAgICB9XG5cbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZW1haW5pbmdTaGlwcy5sZW5ndGgpO1xuICAgIHJldHVybiBkaXJOYW1lc1tyYW5kb21OdW1iZXJdO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZXMgc2NlbmUgaW1hZ2UgdG8gZ2VuIGltYWdlXG4gIGNvbnN0IGluaXRTY2VuZSA9ICgpID0+IHtcbiAgICAvLyBnZXQgcmFuZG9tIHNoaXAgZGlyXG4gICAgY29uc3Qgc2hpcERpciA9IGRpck5hbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpXTtcbiAgICAvLyBnZXQgcmFuZG9tIGFycmF5IGVudHJ5XG4gICAgY29uc3QgZW50cnkgPSByYW5kb21FbnRyeShzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW4pO1xuICAgIC8vIHNldCB0aGUgaW1hZ2VcbiAgICBsb2dJbWcuc3JjID0gc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuW2VudHJ5XTtcbiAgfTtcblxuICAvLyBTZXRzIHRoZSBzY2VuZSBpbWFnZSBiYXNlZCBvbiBwYXJhbXMgcGFzc2VkXG4gIGNvbnN0IHNldFNjZW5lID0gKCkgPT4ge1xuICAgIC8vIFJldHVybiBpZiBsb2cgZmxhZyBzZXQgdG8gbm90IHVwZGF0ZVxuICAgIGlmICghZG9VcGRhdGVTY2VuZSkgcmV0dXJuO1xuICAgIC8vIFNldCB0aGUgdGV4dCB0byBsb3dlcmNhc2UgZm9yIGNvbXBhcmlzb25cbiAgICBjb25zdCBsb2dMb3dlciA9IGxvZ1RleHQudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIFJlZnMgdG8gc2hpcCB0eXBlcyBhbmQgdGhlaXIgZGlyc1xuICAgIGNvbnN0IHNoaXBUeXBlcyA9IFtcInNlbnRpbmVsXCIsIFwiYXNzYXVsdFwiLCBcInZpcGVyXCIsIFwiaXJvblwiLCBcImxldmlhdGhhblwiXTtcbiAgICBjb25zdCB0eXBlVG9EaXIgPSB7XG4gICAgICBzZW50aW5lbDogXCJTUFwiLFxuICAgICAgYXNzYXVsdDogXCJBVFwiLFxuICAgICAgdmlwZXI6IFwiVk1cIixcbiAgICAgIGlyb246IFwiSUdcIixcbiAgICAgIGxldmlhdGhhbjogXCJMXCIsXG4gICAgfTtcblxuICAgIC8vIEhlbHBlciBmb3IgZ2V0dGluZyByYW5kb20gc2hpcCB0eXBlIGZyb20gdGhvc2UgcmVtYWluaW5nXG5cbiAgICAvLyBTZXQgdGhlIGltYWdlIHdoZW4geW91IGF0dGFjayBiYXNlZCBvbiByZW1haW5pbmcgc2hpcHNcbiAgICBpZiAoXG4gICAgICBsb2dMb3dlci5pbmNsdWRlcyh1c2VyTmFtZS50b0xvd2VyQ2FzZSgpKSAmJlxuICAgICAgbG9nTG93ZXIuaW5jbHVkZXMoXCJhdHRhY2tzXCIpXG4gICAgKSB7XG4gICAgICAvLyBHZXQgcmFuZG9tIHNoaXBcbiAgICAgIGNvbnN0IHNoaXBEaXIgPSByYW5kb21TaGlwRGlyKCk7XG4gICAgICAvLyBHZXQgcmFuZG9tIGltZyBmcm9tIGFwcHJvcHJpYXRlIHBsYWNlXG4gICAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmF0dGFjayk7XG4gICAgICAvLyBTZXQgdGhlIGltYWdlXG4gICAgICBsb2dJbWcuc3JjID0gc2NlbmVJbWFnZXNbc2hpcERpcl0uYXR0YWNrW2VudHJ5XTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGltYWdlIHdoZW4gc2hpcCBoaXRcbiAgICBpZiAobG9nTG93ZXIuaW5jbHVkZXMoXCJoaXQgeW91clwiKSkge1xuICAgICAgc2hpcFR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgaWYgKGxvZ0xvd2VyLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgICAgICAgLy8gU2V0IHRoZSBzaGlwIGRpcmVjdG9yeSBiYXNlZCBvbiB0eXBlXG4gICAgICAgICAgY29uc3Qgc2hpcERpciA9IHR5cGVUb0Rpclt0eXBlXTtcbiAgICAgICAgICAvLyBHZXQgYSByYW5kb20gaGl0IGVudHJ5XG4gICAgICAgICAgY29uc3QgZW50cnkgPSByYW5kb21FbnRyeShzY2VuZUltYWdlc1tzaGlwRGlyXS5oaXQpO1xuICAgICAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgICAgICBsb2dJbWcuc3JjID0gc2NlbmVJbWFnZXNbc2hpcERpcl0uaGl0W2VudHJ5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBpbWFnZSB3aGVuIHRoZXJlIGlzIGFuIGFpIG1pc3MgdG8gZ2VuIG9mIHJlbWFpbmluZyBzaGlwc1xuICAgIGlmIChsb2dMb3dlci5pbmNsdWRlcyhcImFpIGF0dGFja3NcIikgJiYgbG9nTG93ZXIuaW5jbHVkZXMoXCJtaXNzZWRcIikpIHtcbiAgICAgIC8vIEdldCByYW5kb20gcmVtYWluaW5nIHNoaXAgZGlyXG4gICAgICBjb25zdCBzaGlwRGlyID0gcmFuZG9tU2hpcERpcigpO1xuICAgICAgLy8gR2V0IHJhbmRvbSBlbnRyeSBmcm9tIHRoZXJlXG4gICAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbik7XG4gICAgICAvLyBTZXQgdGhlIGltYWdlXG4gICAgICBsb2dJbWcuc3JjID0gc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuW2VudHJ5XTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRXJhc2UgdGhlIGxvZyB0ZXh0XG4gIGNvbnN0IGVyYXNlID0gKCkgPT4ge1xuICAgIGlmIChkb0xvY2spIHJldHVybjtcbiAgICBsb2dUZXh0LnRleHRDb250ZW50ID0gXCJcIjtcbiAgfTtcblxuICAvLyBBZGQgdG8gbG9nIHRleHRcbiAgY29uc3QgYXBwZW5kID0gKHN0cmluZ1RvQXBwZW5kKSA9PiB7XG4gICAgaWYgKGRvTG9jaykgcmV0dXJuO1xuICAgIGlmIChzdHJpbmdUb0FwcGVuZCkge1xuICAgICAgbG9nVGV4dC5pbm5lckhUTUwgKz0gYFxcbiR7c3RyaW5nVG9BcHBlbmQudG9TdHJpbmcoKX1gO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGVyYXNlLFxuICAgIGFwcGVuZCxcbiAgICBzZXRTY2VuZSxcbiAgICBsb2FkU2NlbmVzLFxuICAgIHNldFVzZXJHYW1lYm9hcmQsXG4gICAgaW5pdFNjZW5lLFxuICAgIGdldCBkb1VwZGF0ZVNjZW5lKCkge1xuICAgICAgcmV0dXJuIGRvVXBkYXRlU2NlbmU7XG4gICAgfSxcbiAgICBzZXQgZG9VcGRhdGVTY2VuZShib29sKSB7XG4gICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSkge1xuICAgICAgICBkb1VwZGF0ZVNjZW5lID0gYm9vbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldCBkb0xvY2soKSB7XG4gICAgICByZXR1cm4gZG9Mb2NrO1xuICAgIH0sXG4gICAgc2V0IGRvTG9jayhib29sKSB7XG4gICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSkge1xuICAgICAgICBkb0xvY2sgPSBib29sO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9nO1xuIiwiaW1wb3J0IHJhbmRvbVNoaXBzIGZyb20gXCIuLi9oZWxwZXJzL3JhbmRvbVNoaXBzXCI7XG5cbi8qIFRoaXMgbW9kdWxlIGFsbG93cyB0aGUgdmFyaW91cyBvdGhlciBnYW1lIG1vZHVsZXMgdG8gY29tbXVuaWNhdGUgYW5kIG9mZmVyc1xuICAgaGlnaCBsZXZlbCBtZXRob2RzIHRvIGhhbmRsZSB2YXJpb3VzIGdhbWUgZXZlbnRzLiBUaGlzIG9iamVjdCB3aWxsIGJlIHBhc3NlZFxuICAgdG8gb3RoZXIgbW9kdWxlcyBhcyBwcm9wIHNvIHRoZXkgY2FuIHVzZSB0aGVzZSBtZXRob2RzLiAqL1xuY29uc3QgZ2FtZU1hbmFnZXIgPSAoKSA9PiB7XG4gIC8vIEdhbWUgc2V0dGluZ3NcbiAgbGV0IGFpRGlmZmljdWx0eSA9IDI7XG4gIGNvbnN0IHVzZXJBdHRhY2tEZWxheSA9IDEwMDA7XG4gIGNvbnN0IGFpQXR0YWNrRGVsYXkgPSAyMjAwO1xuICBjb25zdCBhaUF1dG9EZWxheSA9IDI1MDtcblxuICAvLyBSZWZzIHRvIHJlbGV2YW50IGdhbWUgb2JqZWN0c1xuICBsZXQgdXNlckJvYXJkID0gbnVsbDtcbiAgbGV0IGFpQm9hcmQgPSBudWxsO1xuICBsZXQgdXNlckNhbnZhc0NvbnRhaW5lciA9IG51bGw7XG4gIGxldCBhaUNhbnZhc0NvbnRhaW5lciA9IG51bGw7XG4gIGxldCBwbGFjZW1lbnRDYW52YXNDb250YWluZXIgPSBudWxsO1xuXG4gIC8vIFJlZnMgdG8gbW9kdWxlc1xuICBsZXQgc291bmRQbGF5ZXIgPSBudWxsO1xuICBsZXQgd2ViSW50ZXJmYWNlID0gbnVsbDtcbiAgbGV0IGdhbWVMb2cgPSBudWxsO1xuXG4gIC8vICNyZWdpb24gSGFuZGxlIEFJIEF0dGFja3NcbiAgLy8gQUkgQXR0YWNrIEhpdFxuICBjb25zdCBhaUF0dGFja0hpdCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAvLyBQbGF5IGhpdCBzb3VuZFxuICAgIHNvdW5kUGxheWVyLnBsYXlIaXQoKTtcbiAgICAvLyBEcmF3IHRoZSBoaXQgdG8gYm9hcmRcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAvLyBMb2cgdGhlIGhpdFxuICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgIGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfSBcXG5BdHRhY2sgaGl0IHlvdXIgJHt1c2VyQm9hcmQuaGl0U2hpcFR5cGV9IWBcbiAgICApO1xuICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgICAvLyBTZXQgYWkgdG8gZGVzdHJveSBtb2RlXG4gICAgYWlCb2FyZC5pc0FpU2Vla2luZyA9IGZhbHNlO1xuICAgIC8vIEFkZCBoaXQgdG8gY2VsbHMgdG8gY2hlY2tcbiAgICBhaUJvYXJkLmNlbGxzVG9DaGVjay5wdXNoKGF0dGFja0Nvb3Jkcyk7XG4gICAgLy8gTG9nIHN1bmsgdXNlciBzaGlwc1xuICAgIGNvbnN0IHN1bmtNc2cgPSB1c2VyQm9hcmQubG9nU3VuaygpO1xuICAgIGlmIChzdW5rTXNnICE9PSBudWxsKSB7XG4gICAgICBnYW1lTG9nLmFwcGVuZChzdW5rTXNnKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2cgc2NlbmVcbiAgICAgIGdhbWVMb2cuc2V0U2NlbmUoKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgQUkgd29uXG4gICAgaWYgKHVzZXJCb2FyZC5hbGxTdW5rKCkpIHtcbiAgICAgIC8vICcgICAgICAgICdcbiAgICAgIC8vIExvZyByZXN1bHRzXG4gICAgICBnYW1lTG9nLmFwcGVuZChcIkFsbCBVc2VyIHVuaXRzIGRlc3Ryb3llZC4gXFxuQUkgZG9taW5hbmNlIGlzIGFzc3VyZWQuXCIpO1xuICAgICAgLy8gU2V0IGdhbWUgb3ZlciBvbiBib2FyZHNcbiAgICAgIGFpQm9hcmQuZ2FtZU92ZXIgPSB0cnVlOyAvLyBBSSBib2FyZFxuICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTsgLy8gVXNlciBib2FyZFxuICAgIH1cbiAgfTtcblxuICAvLyBBSSBBdHRhY2sgTWlzc2VkXG4gIGNvbnN0IGFpQXR0YWNrTWlzc2VkID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFBsYXkgc291bmRcbiAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgIC8vIERyYXcgdGhlIG1pc3MgdG8gYm9hcmRcbiAgICB1c2VyQ2FudmFzQ29udGFpbmVyLmRyYXdNaXNzKGF0dGFja0Nvb3Jkcyk7XG4gICAgLy8gTG9nIHRoZSBtaXNzXG4gICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgIGdhbWVMb2cuYXBwZW5kKGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfVxcbkF0dGFjayBtaXNzZWQhYCk7XG4gICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICB9O1xuXG4gIC8vIEFJIGlzIGF0dGFja2luZ1xuICBsZXQgYWlBdHRhY2tDb3VudCA9IDA7XG4gIGNvbnN0IGFpQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcywgZGVsYXkgPSBhaUF0dGFja0RlbGF5KSA9PiB7XG4gICAgLy8gVGltZW91dCB0byBzaW11bGF0ZSBcInRoaW5raW5nXCIgYW5kIHRvIG1ha2UgZ2FtZSBmZWVsIGJldHRlclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gU2VuZCBhdHRhY2sgdG8gcml2YWwgYm9hcmRcbiAgICAgIHVzZXJCb2FyZFxuICAgICAgICAucmVjZWl2ZUF0dGFjayhhdHRhY2tDb29yZHMpXG4gICAgICAgIC8vIFRoZW4gZHJhdyBoaXRzIG9yIG1pc3Nlc1xuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYWlBdHRhY2tIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrTWlzc2VkKGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQnJlYWsgb3V0IG9mIHJlY3Vyc2lvbiBpZiBnYW1lIGlzIG92ZXJcbiAgICAgICAgICBpZiAodXNlckJvYXJkLmdhbWVPdmVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyBMb2cgdG90YWwgaGl0cyBpZiBhaSBhdXRvIGF0dGFja2luZ1xuICAgICAgICAgICAgaWYgKGFpQm9hcmQuaXNBdXRvQXR0YWNraW5nKSB7XG4gICAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKGBUb3RhbCBBSSBhdHRhY2tzOiAke2FpQXR0YWNrQ291bnR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnYW1lTG9nLmRvTG9jayA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgYWkgYm9hcmQgaXMgYXV0b2F0dGFja2luZyBoYXZlIGl0IHRyeSBhbiBhdHRhY2tcbiAgICAgICAgICBpZiAoYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFpQXR0YWNrQ291bnQgKz0gMTtcbiAgICAgICAgICAgIGFpQm9hcmQudHJ5QWlBdHRhY2soYWlBdXRvRGVsYXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWxsb3cgdGhlIHVzZXIgdG8gYXR0YWNrIGFnYWluXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBIYW5kbGUgUGxheWVyIEF0dGFja3NcbiAgY29uc3QgcGxheWVyQXR0YWNraW5nID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgIC8vIFJldHVybiBpZiBnYW1lYm9hcmQgY2FuJ3QgYXR0YWNrXG4gICAgaWYgKGFpQm9hcmQucml2YWxCb2FyZC5jYW5BdHRhY2sgPT09IGZhbHNlKSByZXR1cm47XG4gICAgLy8gVHJ5IGF0dGFjayBhdCBjdXJyZW50IGNlbGxcbiAgICBpZiAoYWlCb2FyZC5hbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgLy8gQmFkIHRoaW5nLiBFcnJvciBzb3VuZCBtYXliZS5cbiAgICB9IGVsc2UgaWYgKHVzZXJCb2FyZC5nYW1lT3ZlciA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIFNldCBnYW1lYm9hcmQgdG8gbm90IGJlIGFibGUgdG8gYXR0YWNrXG4gICAgICB1c2VyQm9hcmQuY2FuQXR0YWNrID0gZmFsc2U7XG4gICAgICAvLyBMb2cgdGhlIHNlbnQgYXR0YWNrXG4gICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICBnYW1lTG9nLmFwcGVuZChgVXNlciBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfWApO1xuICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgICAgLy8gUGxheSB0aGUgc291bmRcbiAgICAgIHNvdW5kUGxheWVyLnBsYXlBdHRhY2soKTtcbiAgICAgIC8vIFNlbmQgdGhlIGF0dGFja1xuICAgICAgYWlCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkcykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIC8vIFNldCBhIHRpbWVvdXQgZm9yIGRyYW1hdGljIGVmZmVjdFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBBdHRhY2sgaGl0XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gUGxheSBzb3VuZFxuICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheUhpdCgpO1xuICAgICAgICAgICAgLy8gRHJhdyBoaXQgdG8gYm9hcmRcbiAgICAgICAgICAgIGFpQ2FudmFzQ29udGFpbmVyLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAgIC8vIExvZyBoaXRcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIGhpdCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgc3Vua2VuIHNoaXBzXG4gICAgICAgICAgICBjb25zdCBzdW5rTXNnID0gYWlCb2FyZC5sb2dTdW5rKCk7XG4gICAgICAgICAgICBpZiAoc3Vua01zZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChzdW5rTXNnKTtcbiAgICAgICAgICAgICAgLy8gVXBkYXRlIGxvZyBzY2VuZVxuICAgICAgICAgICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHBsYXllciB3b25cbiAgICAgICAgICAgIGlmIChhaUJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgICAgICAgICAgICBcIkFsbCBBSSB1bml0cyBkZXN0cm95ZWQuIFxcbkh1bWFuaXR5IHN1cnZpdmVzIGFub3RoZXIgZGF5Li4uXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgLy8gU2V0IGdhbWVvdmVyIG9uIGJvYXJkc1xuICAgICAgICAgICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdXNlckJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBSSBkZXRybWluaW5nIGF0dGFjay4uLlwiKTtcbiAgICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgICBhaUJvYXJkLnRyeUFpQXR0YWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBQbGF5IHNvdW5kXG4gICAgICAgICAgICBzb3VuZFBsYXllci5wbGF5TWlzcygpO1xuICAgICAgICAgICAgLy8gRHJhdyBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgICBhaUNhbnZhc0NvbnRhaW5lci5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgICAgICAgICAgLy8gTG9nIG1pc3NcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIG1pc3NlZCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgYWlCb2FyZC50cnlBaUF0dGFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdXNlckF0dGFja0RlbGF5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gSGFuZGxlIHNldHRpbmcgdXAgYW4gQUkgdnMgQUkgbWF0Y2hcbiAgY29uc3QgYWlNYXRjaENsaWNrZWQgPSAoKSA9PiB7XG4gICAgLy8gVG9nZ2xlIGFpIGF1dG8gYXR0YWNrXG4gICAgYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmcgPSAhYWlCb2FyZC5pc0F1dG9BdHRhY2tpbmc7XG4gICAgLy8gVG9nZ2xlIGxvZyB0byBub3QgdXBkYXRlIHNjZW5lXG4gICAgZ2FtZUxvZy5kb1VwZGF0ZVNjZW5lID0gIWdhbWVMb2cuZG9VcGRhdGVTY2VuZTtcbiAgICAvLyBTZXQgdGhlIHNvdW5kcyB0byBtdXRlZFxuICAgIHNvdW5kUGxheWVyLmlzTXV0ZWQgPSAhc291bmRQbGF5ZXIuaXNNdXRlZDtcbiAgfTtcblxuICAvLyAjcmVnaW9uIEhhbmRsZSBTaGlwIFBsYWNlbWVudCBhbmQgR2FtZSBTdGFydFxuICAvLyBDaGVjayBpZiBnYW1lIHNob3VsZCBzdGFydCBhZnRlciBwbGFjZW1lbnRcbiAgY29uc3QgdHJ5U3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGlmICh1c2VyQm9hcmQuc2hpcHMubGVuZ3RoID09PSA1KSB7XG4gICAgICB3ZWJJbnRlcmZhY2Uuc2hvd0dhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSGFuZGxlIHJhbmRvbSBzaGlwcyBidXR0b24gY2xpY2tcbiAgY29uc3QgcmFuZG9tU2hpcHNDbGlja2VkID0gKCkgPT4ge1xuICAgIHJhbmRvbVNoaXBzKHVzZXJCb2FyZCwgdXNlckJvYXJkLm1heEJvYXJkWCwgdXNlckJvYXJkLm1heEJvYXJkWSk7XG4gICAgdXNlckNhbnZhc0NvbnRhaW5lci5kcmF3U2hpcHMoKTtcbiAgICB0cnlTdGFydEdhbWUoKTtcbiAgfTtcblxuICAvLyBIYW5kbGUgcm90YXRlIGJ1dHRvbiBjbGlja3NcbiAgY29uc3Qgcm90YXRlQ2xpY2tlZCA9ICgpID0+IHtcbiAgICB1c2VyQm9hcmQuZGlyZWN0aW9uID0gdXNlckJvYXJkLmRpcmVjdGlvbiA9PT0gMCA/IDEgOiAwO1xuICAgIGFpQm9hcmQuZGlyZWN0aW9uID0gYWlCb2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgfTtcblxuICBjb25zdCBwbGFjZW1lbnRDbGlja2VkID0gKGNlbGwpID0+IHtcbiAgICAvLyBUcnkgcGxhY2VtZW50XG4gICAgdXNlckJvYXJkLmFkZFNoaXAoY2VsbCk7XG4gICAgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyLmRyYXdTaGlwcygpO1xuICAgIHVzZXJDYW52YXNDb250YWluZXIuZHJhd1NoaXBzKCk7XG4gICAgdHJ5U3RhcnRHYW1lKCk7XG4gIH07XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBXaGVuIGEgdXNlciBzaGlwIGlzIHN1bmtcbiAgY29uc3QgdXNlclNoaXBTdW5rID0gKHNoaXApID0+IHtcbiAgICAvLyBSZW1vdmUgdGhlIHN1bmtlbiBzaGlwIGNlbGxzIGZyb20gY2VsbHMgdG8gY2hlY2tcbiAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgLy8gT2NjdXBpZWQgY2VsbCB4IGFuZCB5XG4gICAgICBjb25zdCBbb3gsIG95XSA9IGNlbGw7XG4gICAgICAvLyBSZW1vdmUgaXQgZnJvbSBjZWxscyB0byBjaGVjayBpZiBpdCBleGlzdHNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWlCb2FyZC5jZWxsc1RvQ2hlY2subGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgLy8gQ2VsbCB0byBjaGVjayB4IGFuZCB5XG4gICAgICAgIGNvbnN0IFtjeCwgY3ldID0gYWlCb2FyZC5jZWxsc1RvQ2hlY2tbaV07XG4gICAgICAgIC8vIFJlbW92ZSBpZiBtYXRjaCBmb3VuZFxuICAgICAgICBpZiAob3ggPT09IGN4ICYmIG95ID09PSBjeSkge1xuICAgICAgICAgIGFpQm9hcmQuY2VsbHNUb0NoZWNrLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gSWYgY2VsbHMgdG8gY2hlY2sgaXMgZW1wdHkgdGhlbiBzdG9wIGRlc3RvcnkgbW9kZVxuICAgIGlmIChhaUJvYXJkLmNlbGxzVG9DaGVjay5sZW5ndGggPT09IDApIHtcbiAgICAgIGFpQm9hcmQuaXNBaVNlZWtpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFpQXR0YWNraW5nLFxuICAgIHBsYXllckF0dGFja2luZyxcbiAgICBhaU1hdGNoQ2xpY2tlZCxcbiAgICBwbGFjZW1lbnRDbGlja2VkLFxuICAgIHJhbmRvbVNoaXBzQ2xpY2tlZCxcbiAgICByb3RhdGVDbGlja2VkLFxuICAgIHVzZXJTaGlwU3VuayxcbiAgICBnZXQgYWlEaWZmaWN1bHR5KCkge1xuICAgICAgcmV0dXJuIGFpRGlmZmljdWx0eTtcbiAgICB9LFxuICAgIHNldCBhaURpZmZpY3VsdHkoZGlmZikge1xuICAgICAgaWYgKGRpZmYgPT09IDEgfHwgZGlmZiA9PT0gMiB8fCBkaWZmID09PSAzKSBhaURpZmZpY3VsdHkgPSBkaWZmO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJCb2FyZCgpIHtcbiAgICAgIHJldHVybiB1c2VyQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgdXNlckJvYXJkKGJvYXJkKSB7XG4gICAgICB1c2VyQm9hcmQgPSBib2FyZDtcbiAgICB9LFxuICAgIGdldCBhaUJvYXJkKCkge1xuICAgICAgcmV0dXJuIGFpQm9hcmQ7XG4gICAgfSxcbiAgICBzZXQgYWlCb2FyZChib2FyZCkge1xuICAgICAgYWlCb2FyZCA9IGJvYXJkO1xuICAgIH0sXG4gICAgZ2V0IHVzZXJDYW52YXNDb250YWluZXIoKSB7XG4gICAgICByZXR1cm4gdXNlckNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCB1c2VyQ2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgdXNlckNhbnZhc0NvbnRhaW5lciA9IGNhbnZhcztcbiAgICB9LFxuICAgIGdldCBhaUNhbnZhc0NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBhaUNhbnZhc0NvbnRhaW5lcjtcbiAgICB9LFxuICAgIHNldCBhaUNhbnZhc0NvbnRhaW5lcihjYW52YXMpIHtcbiAgICAgIGFpQ2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHBsYWNlbWVudENhbnZhc2NvbnRhaW5lcigpIHtcbiAgICAgIHJldHVybiBwbGFjZW1lbnRDYW52YXNDb250YWluZXI7XG4gICAgfSxcbiAgICBzZXQgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyKGNhbnZhcykge1xuICAgICAgcGxhY2VtZW50Q2FudmFzQ29udGFpbmVyID0gY2FudmFzO1xuICAgIH0sXG4gICAgZ2V0IHNvdW5kUGxheWVyKCkge1xuICAgICAgcmV0dXJuIHNvdW5kUGxheWVyO1xuICAgIH0sXG4gICAgc2V0IHNvdW5kUGxheWVyKGFNb2R1bGUpIHtcbiAgICAgIHNvdW5kUGxheWVyID0gYU1vZHVsZTtcbiAgICB9LFxuICAgIGdldCB3ZWJJbnRlcmZhY2UoKSB7XG4gICAgICByZXR1cm4gd2ViSW50ZXJmYWNlO1xuICAgIH0sXG4gICAgc2V0IHdlYkludGVyZmFjZShhTW9kdWxlKSB7XG4gICAgICB3ZWJJbnRlcmZhY2UgPSBhTW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGdhbWVMb2coKSB7XG4gICAgICByZXR1cm4gZ2FtZUxvZztcbiAgICB9LFxuICAgIHNldCBnYW1lTG9nKGFNb2R1bGUpIHtcbiAgICAgIGdhbWVMb2cgPSBhTW9kdWxlO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTWFuYWdlcjtcbiIsImltcG9ydCBoaXRTb3VuZCBmcm9tIFwiLi4vU291bmQgRWZmZWN0cy9leHBsb3Npb24ubXAzXCI7XG5pbXBvcnQgbWlzc1NvdW5kIGZyb20gXCIuLi9Tb3VuZCBFZmZlY3RzL21pc3MubXAzXCI7XG5pbXBvcnQgYXR0YWNrU291bmQgZnJvbSBcIi4uL1NvdW5kIEVmZmVjdHMvbGFzZXIubXAzXCI7XG5cbmNvbnN0IGF0dGFja0F1ZGlvID0gbmV3IEF1ZGlvKGF0dGFja1NvdW5kKTtcbmNvbnN0IGhpdEF1ZGlvID0gbmV3IEF1ZGlvKGhpdFNvdW5kKTtcbmNvbnN0IG1pc3NBdWRpbyA9IG5ldyBBdWRpbyhtaXNzU291bmQpO1xuXG5jb25zdCBzb3VuZHMgPSAoKSA9PiB7XG4gIC8vIEZsYWcgZm9yIG11dGluZ1xuICBsZXQgaXNNdXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHBsYXlIaXQgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBoaXRBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgaGl0QXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlNaXNzID0gKCkgPT4ge1xuICAgIGlmIChpc011dGVkKSByZXR1cm47XG4gICAgLy8gUmVzZXQgYXVkaW8gdG8gYmVnaW5uaW5nIGFuZCBwbGF5IGl0XG4gICAgbWlzc0F1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICBtaXNzQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlBdHRhY2sgPSAoKSA9PiB7XG4gICAgaWYgKGlzTXV0ZWQpIHJldHVybjtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBhdHRhY2tBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgYXR0YWNrQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxheUhpdCxcbiAgICBwbGF5TWlzcyxcbiAgICBwbGF5QXR0YWNrLFxuICAgIGdldCBpc011dGVkKCkge1xuICAgICAgcmV0dXJuIGlzTXV0ZWQ7XG4gICAgfSxcbiAgICBzZXQgaXNNdXRlZChib29sKSB7XG4gICAgICBpZiAoYm9vbCA9PT0gdHJ1ZSB8fCBib29sID09PSBmYWxzZSkgaXNNdXRlZCA9IGJvb2w7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvdW5kcztcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vKiBUaGlzIG1vZHVsZSBoYXMgdGhyZWUgcHJpbWFyeSBmdW5jdGlvbnM6XG4gICAxLiBHZXQgc2hpcCBwbGFjZW1lbnQgY29vcmRpbmF0ZXMgZnJvbSB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciBjbGlja3Mgb24gdGhlIHdlYiBpbnRlcmZhY2VcbiAgIDIuIEdldCBhdHRhY2sgcGxhY2VtZW50IGNvb3JkaW5hdGVzIGZyb20gdGhlIHVzZXIgYmFzZWQgb24gdGhlIHNhbWVcbiAgIDMuIE90aGVyIG1pbm9yIGludGVyZmFjZSBhY3Rpb25zIHN1Y2ggYXMgaGFuZGxpbmcgYnV0dG9uIGNsaWNrcyAoc3RhcnQgZ2FtZSwgcmVzdGFydCwgZXRjKSAqL1xuY29uc3Qgd2ViSW50ZXJmYWNlID0gKGdtKSA9PiB7XG4gIC8vIFJlZmVyZW5jZXMgdG8gbWFpbiBlbGVtZW50c1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XG4gIGNvbnN0IHBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50XCIpO1xuICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuXG4gIC8vIFJlZmVyZW5jZSB0byBidG4gZWxlbWVudHNcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0LWJ0blwiKTtcbiAgY29uc3QgYWlNYXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktbWF0Y2gtYnRuXCIpO1xuXG4gIGNvbnN0IHJhbmRvbVNoaXBzQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yYW5kb20tc2hpcHMtYnRuXCIpO1xuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1idG5cIik7XG5cbiAgLy8gTWV0aG9kIGZvciBpdGVyYXRpbmcgdGhyb3VnaCBkaXJlY3Rpb25zXG4gIGNvbnN0IHJvdGF0ZURpcmVjdGlvbiA9ICgpID0+IHtcbiAgICBnbS5yb3RhdGVDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBCYXNpYyBtZXRob2RzIGZvciBzaG93aW5nL2hpZGluZyBlbGVtZW50c1xuICAvLyBNb3ZlIGFueSBhY3RpdmUgc2VjdGlvbnMgb2ZmIHRoZSBzY3JlZW5cbiAgY29uc3QgaGlkZUFsbCA9ICgpID0+IHtcbiAgICBtZW51LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgcGxhY2VtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZ2FtZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIG1lbnUgVUlcbiAgY29uc3Qgc2hvd01lbnUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIG1lbnUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBzaGlwIHBsYWNlbWVudCBVSVxuICBjb25zdCBzaG93UGxhY2VtZW50ID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBnYW1lIFVJXG4gIGNvbnN0IHNob3dHYW1lID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQWlNYXRjaENsaWNrID0gKCkgPT4ge1xuICAgIC8vIFNldCBzdHlsZSBjbGFzcyBiYXNlZCBvbiBpZiB1c2VyQm9hcmQgaXMgYWkgKGlmIGZhbHNlLCBzZXQgYWN0aXZlIGIvYyB3aWxsIGJlIHRydWUgYWZ0ZXIgY2xpY2spXG4gICAgaWYgKGdtLmFpQm9hcmQuaXNBdXRvQXR0YWNraW5nID09PSBmYWxzZSlcbiAgICAgIGFpTWF0Y2hCdG4uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICBlbHNlIGFpTWF0Y2hCdG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICBnbS5haU1hdGNoQ2xpY2tlZCgpO1xuICB9O1xuXG4gIC8vIEhhbmRsZSBjbGlja3Mgb24gdGhlIHJvdGF0ZSBidXR0b24gaW4gdGhlIHBsYWNlbWVudCBzZWN0aW9uXG4gIGNvbnN0IGhhbmRsZVJvdGF0ZUNsaWNrID0gKCkgPT4ge1xuICAgIHJvdGF0ZURpcmVjdGlvbigpO1xuICB9O1xuXG4gIC8vIEhhbmRsZSByYW5kb20gc2hpcHMgYnV0dG9uIGNsaWNrXG4gIGNvbnN0IGhhbmRsZVJhbmRvbVNoaXBzQ2xpY2sgPSAoKSA9PiB7XG4gICAgZ20ucmFuZG9tU2hpcHNDbGlja2VkKCk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQWRkIGNsYXNzZXMgdG8gc2hpcCBkaXZzIHRvIHJlcHJlc2VudCBwbGFjZWQvZGVzdHJveWVkXG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBicm93c2VyIGV2ZW50c1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVJvdGF0ZUNsaWNrKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVN0YXJ0Q2xpY2spO1xuICBhaU1hdGNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVBaU1hdGNoQ2xpY2spO1xuICByYW5kb21TaGlwc0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUmFuZG9tU2hpcHNDbGljayk7XG5cbiAgcmV0dXJuIHsgc2hvd0dhbWUsIHNob3dNZW51LCBzaG93UGxhY2VtZW50IH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB3ZWJJbnRlcmZhY2U7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXG4gICB2Mi4wIHwgMjAxMTAxMjZcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXG4qL1xuXG5odG1sLFxuYm9keSxcbmRpdixcbnNwYW4sXG5hcHBsZXQsXG5vYmplY3QsXG5pZnJhbWUsXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYsXG5wLFxuYmxvY2txdW90ZSxcbnByZSxcbmEsXG5hYmJyLFxuYWNyb255bSxcbmFkZHJlc3MsXG5iaWcsXG5jaXRlLFxuY29kZSxcbmRlbCxcbmRmbixcbmVtLFxuaW1nLFxuaW5zLFxua2JkLFxucSxcbnMsXG5zYW1wLFxuc21hbGwsXG5zdHJpa2UsXG5zdHJvbmcsXG5zdWIsXG5zdXAsXG50dCxcbnZhcixcbmIsXG51LFxuaSxcbmNlbnRlcixcbmRsLFxuZHQsXG5kZCxcbm9sLFxudWwsXG5saSxcbmZpZWxkc2V0LFxuZm9ybSxcbmxhYmVsLFxubGVnZW5kLFxudGFibGUsXG5jYXB0aW9uLFxudGJvZHksXG50Zm9vdCxcbnRoZWFkLFxudHIsXG50aCxcbnRkLFxuYXJ0aWNsZSxcbmFzaWRlLFxuY2FudmFzLFxuZGV0YWlscyxcbmVtYmVkLFxuZmlndXJlLFxuZmlnY2FwdGlvbixcbmZvb3RlcixcbmhlYWRlcixcbmhncm91cCxcbm1lbnUsXG5uYXYsXG5vdXRwdXQsXG5ydWJ5LFxuc2VjdGlvbixcbnN1bW1hcnksXG50aW1lLFxubWFyayxcbmF1ZGlvLFxudmlkZW8ge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJvcmRlcjogMDtcbiAgZm9udC1zaXplOiAxMDAlO1xuICBmb250OiBpbmhlcml0O1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXG5hcnRpY2xlLFxuYXNpZGUsXG5kZXRhaWxzLFxuZmlnY2FwdGlvbixcbmZpZ3VyZSxcbmZvb3RlcixcbmhlYWRlcixcbmhncm91cCxcbm1lbnUsXG5uYXYsXG5zZWN0aW9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5ib2R5IHtcbiAgbGluZS1oZWlnaHQ6IDE7XG59XG5vbCxcbnVsIHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbn1cbmJsb2NrcXVvdGUsXG5xIHtcbiAgcXVvdGVzOiBub25lO1xufVxuYmxvY2txdW90ZTpiZWZvcmUsXG5ibG9ja3F1b3RlOmFmdGVyLFxucTpiZWZvcmUsXG5xOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgY29udGVudDogbm9uZTtcbn1cbnRhYmxlIHtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9yZXNldC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7OztDQUdDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpRkUsU0FBUztFQUNULFVBQVU7RUFDVixTQUFTO0VBQ1QsZUFBZTtFQUNmLGFBQWE7RUFDYix3QkFBd0I7QUFDMUI7QUFDQSxnREFBZ0Q7QUFDaEQ7Ozs7Ozs7Ozs7O0VBV0UsY0FBYztBQUNoQjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBOztFQUVFLGdCQUFnQjtBQUNsQjtBQUNBOztFQUVFLFlBQVk7QUFDZDtBQUNBOzs7O0VBSUUsV0FBVztFQUNYLGFBQWE7QUFDZjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLGlCQUFpQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcXG4gICB2Mi4wIHwgMjAxMTAxMjZcXG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxcbiovXFxuXFxuaHRtbCxcXG5ib2R5LFxcbmRpdixcXG5zcGFuLFxcbmFwcGxldCxcXG5vYmplY3QsXFxuaWZyYW1lLFxcbmgxLFxcbmgyLFxcbmgzLFxcbmg0LFxcbmg1LFxcbmg2LFxcbnAsXFxuYmxvY2txdW90ZSxcXG5wcmUsXFxuYSxcXG5hYmJyLFxcbmFjcm9ueW0sXFxuYWRkcmVzcyxcXG5iaWcsXFxuY2l0ZSxcXG5jb2RlLFxcbmRlbCxcXG5kZm4sXFxuZW0sXFxuaW1nLFxcbmlucyxcXG5rYmQsXFxucSxcXG5zLFxcbnNhbXAsXFxuc21hbGwsXFxuc3RyaWtlLFxcbnN0cm9uZyxcXG5zdWIsXFxuc3VwLFxcbnR0LFxcbnZhcixcXG5iLFxcbnUsXFxuaSxcXG5jZW50ZXIsXFxuZGwsXFxuZHQsXFxuZGQsXFxub2wsXFxudWwsXFxubGksXFxuZmllbGRzZXQsXFxuZm9ybSxcXG5sYWJlbCxcXG5sZWdlbmQsXFxudGFibGUsXFxuY2FwdGlvbixcXG50Ym9keSxcXG50Zm9vdCxcXG50aGVhZCxcXG50cixcXG50aCxcXG50ZCxcXG5hcnRpY2xlLFxcbmFzaWRlLFxcbmNhbnZhcyxcXG5kZXRhaWxzLFxcbmVtYmVkLFxcbmZpZ3VyZSxcXG5maWdjYXB0aW9uLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbm91dHB1dCxcXG5ydWJ5LFxcbnNlY3Rpb24sXFxuc3VtbWFyeSxcXG50aW1lLFxcbm1hcmssXFxuYXVkaW8sXFxudmlkZW8ge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJvcmRlcjogMDtcXG4gIGZvbnQtc2l6ZTogMTAwJTtcXG4gIGZvbnQ6IGluaGVyaXQ7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cXG5hcnRpY2xlLFxcbmFzaWRlLFxcbmRldGFpbHMsXFxuZmlnY2FwdGlvbixcXG5maWd1cmUsXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxuc2VjdGlvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuYm9keSB7XFxuICBsaW5lLWhlaWdodDogMTtcXG59XFxub2wsXFxudWwge1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG59XFxuYmxvY2txdW90ZSxcXG5xIHtcXG4gIHF1b3Rlczogbm9uZTtcXG59XFxuYmxvY2txdW90ZTpiZWZvcmUsXFxuYmxvY2txdW90ZTphZnRlcixcXG5xOmJlZm9yZSxcXG5xOmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgY29udGVudDogbm9uZTtcXG59XFxudGFibGUge1xcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIENvbG9yIFJ1bGVzICovXG46cm9vdCB7XG4gIC0tY29sb3JBMTogIzcyMmI5NDtcbiAgLS1jb2xvckEyOiAjYTkzNmUwO1xuICAtLWNvbG9yQzogIzM3ZTAyYjtcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xuICAtLWNvbG9yQjI6ICNlMDM2MWY7XG5cbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xuICAtLWJnLWNvbG9yMjogaHNsKDAsIDAlLCAzMiUpO1xuICAtLXRleHQtY29sb3I6IGhzbCgwLCAwJSwgOTElKTtcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcbn1cblxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xuYSB7XG4gIGNvbG9yOiB2YXIoLS1saW5rLWNvbG9yKTtcbn1cblxuYm9keSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICBoZWlnaHQ6IDEwMHZoO1xuICB3aWR0aDogMTAwdnc7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG59XG5cbi5jYW52YXMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gMWZyO1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XG59XG5cbi5jYW52YXMtY29udGFpbmVyID4gKiB7XG4gIGdyaWQtcm93OiAtMSAvIDE7XG4gIGdyaWQtY29sdW1uOiAtMSAvIDE7XG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBtYWluLWNvbnRlbnQgKi9cbi5tYWluLWNvbnRlbnQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMjAsIDUlKSAvIHJlcGVhdCgyMCwgNSUpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLyogdGl0bGUgZ3JpZCAqL1xuLnRpdGxlIHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDIgLyA2O1xuICBkaXNwbGF5OiBncmlkO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yMik7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi50aXRsZS10ZXh0IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiA0LjhyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAycHggdmFyKC0tY29sb3JCMSk7XG4gIGNvbG9yOiB2YXIoLS1jb2xvckIyKTtcblxuICB0cmFuc2l0aW9uOiBmb250LXNpemUgMC44cyBlYXNlLWluLW91dDtcbn1cblxuLnRpdGxlLnNocmluayB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC41KSB0cmFuc2xhdGVZKC01MCUpO1xufVxuXG4udGl0bGUuc2hyaW5rIC50aXRsZS10ZXh0IHtcbiAgZm9udC1zaXplOiAzLjVyZW07XG59XG4vKiAjcmVnaW9uIG1lbnUgc2VjdGlvbiAqL1xuLm1lbnUge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogOCAvIDE4O1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDUlIDFmciA1JSAxZnIgNSUgMWZyIC8gMWZyO1xuICBwbGFjZS1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxuICAgIFwiLlwiXG4gICAgXCJjcmVkaXRzXCJcbiAgICBcIi5cIlxuICAgIFwic3RhcnQtZ2FtZVwiXG4gICAgXCIuXCJcbiAgICBcImFpLW1hdGNoXCJcbiAgICBcIi5cIlxuICAgIFwib3B0aW9uc1wiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4ubWVudS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTE1MCUpO1xufVxuXG4ubWVudSAuY3JlZGl0cyB7XG4gIGdyaWQtYXJlYTogY3JlZGl0cztcbn1cblxuLm1lbnUgLnN0YXJ0IHtcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xuICBhbGlnbi1zZWxmOiBlbmQ7XG59XG5cbi5tZW51IC5haS1tYXRjaCB7XG4gIGdyaWQtYXJlYTogYWktbWF0Y2g7XG59XG5cbi5tZW51IC5vcHRpb25zIHtcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bixcbi5tZW51IC5vcHRpb25zLWJ0bixcbi5tZW51IC5haS1tYXRjaC1idG4ge1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxODBweDtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bjpob3Zlcixcbi5tZW51IC5vcHRpb25zLWJ0bjpob3Zlcixcbi5tZW51IC5haS1tYXRjaC1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLm1lbnUgLmFpLW1hdGNoLWJ0bi5hY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckIxKTtcbn1cblxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjcmVnaW9uIHBsYWNlbWVudCBzZWN0aW9uICovXG4ucGxhY2VtZW50IHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDYgLyAyMDtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDUlIG1pbi1jb250ZW50IDUlIC8gMWZyIDUlIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuXCJcbiAgICBcImluc3RydWN0aW9ucyBpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zXCJcbiAgICBcIi4gLiAuXCJcbiAgICBcInNoaXBzIHNoaXBzIHNoaXBzXCJcbiAgICBcIi4gLiAuIFwiXG4gICAgXCJyYW5kb20gLiByb3RhdGVcIlxuICAgIFwiLiAuIC5cIlxuICAgIFwiY2FudmFzIGNhbnZhcyBjYW52YXNcIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcbiAgZ3JpZC1hcmVhOiBpbnN0cnVjdGlvbnM7XG59XG5cbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucy10ZXh0IHtcbiAgZm9udC1zaXplOiAyLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMXB4IDFweCAxcHggdmFyKC0tYmctY29sb3IpO1xufVxuXG4ucGxhY2VtZW50IC5zaGlwcy10by1wbGFjZSB7XG4gIGdyaWQtYXJlYTogc2hpcHM7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5wbGFjZW1lbnQgLnJhbmRvbS1zaGlwcyB7XG4gIGdyaWQtYXJlYTogcmFuZG9tO1xuICBqdXN0aWZ5LXNlbGY6IGVuZDtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlIHtcbiAgZ3JpZC1hcmVhOiByb3RhdGU7XG4gIGp1c3RpZnktc2VsZjogc3RhcnQ7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG4sXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuIHtcbiAgaGVpZ2h0OiA2MHB4O1xuICB3aWR0aDogMTgwcHg7XG5cbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46aG92ZXIsXG4ucGxhY2VtZW50IC5yYW5kb20tc2hpcHMtYnRuOmhvdmVyIHtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46YWN0aXZlLFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjphY3RpdmUge1xuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IGNhbnZhcztcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XG59XG5cbi5wbGFjZW1lbnQuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xufVxuXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JDKTtcbn1cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cbi5nYW1lIHtcbiAgZ3JpZC1jb2x1bW46IDIgLyAyMDtcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZTpcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXG4gICAgbWluLWNvbnRlbnQgMWZyIC8gcmVwZWF0KDQsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuIC4gLiAuXCJcbiAgICBcIi4gbG9nIGxvZyAuXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cIlxuICAgIFwiLiAuIC4gLlwiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xufVxuXG4uZ2FtZSAudXNlci1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xufVxuXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XG59XG5cbi5nYW1lIC51c2VyLWluZm8ge1xuICBncmlkLWFyZWE6IHVzZXItaW5mbztcbn1cblxuLmdhbWUgLmFpLWluZm8ge1xuICBncmlkLWFyZWE6IGFpLWluZm87XG59XG5cbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xufVxuXG4uZ2FtZSAubG9nIHtcbiAgZ3JpZC1hcmVhOiBsb2c7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIG1pbi1jb250ZW50IDEwcHggMWZyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcInNjZW5lIC4gdGV4dFwiO1xuXG4gIHdpZHRoOiA1MDBweDtcblxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1jb2xvckIxKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbn1cblxuLmdhbWUgLmxvZyAuc2NlbmUge1xuICBncmlkLWFyZWE6IHNjZW5lO1xuXG4gIGhlaWdodDogMTUwcHg7XG4gIHdpZHRoOiAxNTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XG59XG5cbi5nYW1lIC5sb2cgLnNjZW5lLWltZyB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xuICBmb250LXNpemU6IDEuMTVyZW07XG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cbn1cblxuLmdhbWUuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjZW5kcmVnaW9uICovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQ2hCO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGtCQUFrQjs7RUFFbEIsMkJBQTJCO0VBQzNCLDRCQUE0QjtFQUM1Qiw2QkFBNkI7RUFDN0IsK0JBQStCO0FBQ2pDOztBQUVBLG9DQUFvQztBQUNwQztFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGlDQUFpQztFQUNqQyx3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLFlBQVk7RUFDWixnQkFBZ0I7O0VBRWhCLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLGFBQWE7RUFDYix3QkFBd0I7RUFDeEIsa0JBQWtCO0VBQ2xCLG1CQUFt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YUFBYTtFQUNiLHlDQUF5QztFQUN6QyxtQ0FBbUM7O0VBRW5DLFlBQVk7O0VBRVosZ0NBQWdDO0VBQ2hDLGtCQUFrQjs7RUFFbEIsaUNBQWlDO0FBQ25DOztBQUVBO0VBQ0UsZ0JBQWdCOztFQUVoQixhQUFhO0VBQ2IsWUFBWTtFQUNaLGdDQUFnQztBQUNsQzs7QUFFQTtFQUNFLFlBQVk7RUFDWixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLGdCQUFnQixFQUFFLGtCQUFrQjtBQUN0Qzs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3QjtBQUNBLGVBQWU7O0FBRWYsZUFBZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBDb2xvciBSdWxlcyAqL1xcbjpyb290IHtcXG4gIC0tY29sb3JBMTogIzcyMmI5NDtcXG4gIC0tY29sb3JBMjogI2E5MzZlMDtcXG4gIC0tY29sb3JDOiAjMzdlMDJiO1xcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xcblxcbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcXG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcXG59XFxuXFxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xcbmEge1xcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcblxcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxufVxcblxcbi5jYW52YXMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcXG4gIGdyaWQtY29sdW1uOiAtMSAvIDE7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIG1haW4tY29udGVudCAqL1xcbi5tYWluLWNvbnRlbnQge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyMCwgNSUpIC8gcmVwZWF0KDIwLCA1JSk7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLyogdGl0bGUgZ3JpZCAqL1xcbi50aXRsZSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDIgLyA2O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC44cyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yMik7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4udGl0bGUtdGV4dCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDQuOHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yQjIpO1xcblxcbiAgdHJhbnNpdGlvbjogZm9udC1zaXplIDAuOHMgZWFzZS1pbi1vdXQ7XFxufVxcblxcbi50aXRsZS5zaHJpbmsge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjUpIHRyYW5zbGF0ZVkoLTUwJSk7XFxufVxcblxcbi50aXRsZS5zaHJpbmsgLnRpdGxlLXRleHQge1xcbiAgZm9udC1zaXplOiAzLjVyZW07XFxufVxcbi8qICNyZWdpb24gbWVudSBzZWN0aW9uICovXFxuLm1lbnUge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiA4IC8gMTg7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgNSUgMWZyIDUlIDFmciA1JSAxZnIgLyAxZnI7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJjcmVkaXRzXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcInN0YXJ0LWdhbWVcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwiYWktbWF0Y2hcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwib3B0aW9uc1xcXCI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG59XFxuXFxuLm1lbnUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XFxufVxcblxcbi5tZW51IC5jcmVkaXRzIHtcXG4gIGdyaWQtYXJlYTogY3JlZGl0cztcXG59XFxuXFxuLm1lbnUgLnN0YXJ0IHtcXG4gIGdyaWQtYXJlYTogc3RhcnQtZ2FtZTtcXG4gIGFsaWduLXNlbGY6IGVuZDtcXG59XFxuXFxuLm1lbnUgLmFpLW1hdGNoIHtcXG4gIGdyaWQtYXJlYTogYWktbWF0Y2g7XFxufVxcblxcbi5tZW51IC5vcHRpb25zIHtcXG4gIGdyaWQtYXJlYTogb3B0aW9ucztcXG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuLFxcbi5tZW51IC5vcHRpb25zLWJ0bixcXG4ubWVudSAuYWktbWF0Y2gtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLm1lbnUgLnN0YXJ0LWJ0bjpob3ZlcixcXG4ubWVudSAub3B0aW9ucy1idG46aG92ZXIsXFxuLm1lbnUgLmFpLW1hdGNoLWJ0bjpob3ZlciB7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLm1lbnUgLmFpLW1hdGNoLWJ0bi5hY3RpdmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIHBsYWNlbWVudCBzZWN0aW9uICovXFxuLnBsYWNlbWVudCB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDYgLyAyMDtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDUlIG1pbi1jb250ZW50IDUlIC8gMWZyIDUlIDFmcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLiAuIC5cXFwiXFxuICAgIFxcXCJpbnN0cnVjdGlvbnMgaW5zdHJ1Y3Rpb25zIGluc3RydWN0aW9uc1xcXCJcXG4gICAgXFxcIi4gLiAuXFxcIlxcbiAgICBcXFwic2hpcHMgc2hpcHMgc2hpcHNcXFwiXFxuICAgIFxcXCIuIC4gLiBcXFwiXFxuICAgIFxcXCJyYW5kb20gLiByb3RhdGVcXFwiXFxuICAgIFxcXCIuIC4gLlxcXCJcXG4gICAgXFxcImNhbnZhcyBjYW52YXMgY2FudmFzXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxufVxcblxcbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucyB7XFxuICBncmlkLWFyZWE6IGluc3RydWN0aW9ucztcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zLXRleHQge1xcbiAgZm9udC1zaXplOiAyLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcXG4gIGdyaWQtYXJlYTogc2hpcHM7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzIHtcXG4gIGdyaWQtYXJlYTogcmFuZG9tO1xcbiAganVzdGlmeS1zZWxmOiBlbmQ7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZSB7XFxuICBncmlkLWFyZWE6IHJvdGF0ZTtcXG4gIGp1c3RpZnktc2VsZjogc3RhcnQ7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG4sXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0biB7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTgwcHg7XFxuXFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46aG92ZXIsXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjpob3ZlciB7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUsXFxuLnBsYWNlbWVudCAucmFuZG9tLXNoaXBzLWJ0bjphY3RpdmUge1xcbiAgdGV4dC1zaGFkb3c6IDRweCA0cHggMXB4IHZhcigtLWNvbG9yQyksIC00cHggLTRweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogY2FudmFzO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5wbGFjZW1lbnQuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNTAlKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckMpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cXG4uZ2FtZSB7XFxuICBncmlkLWNvbHVtbjogMiAvIDIwO1xcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbiAgZ3JpZC10ZW1wbGF0ZTpcXG4gICAgcmVwZWF0KDIsIG1pbm1heCgxMHB4LCAxZnIpIG1pbi1jb250ZW50KSBtaW5tYXgoMTBweCwgMWZyKVxcbiAgICBtaW4tY29udGVudCAxZnIgLyByZXBlYXQoNCwgMWZyKTtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwiLiBsb2cgbG9nIC5cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXFxcIlxcbiAgICBcXFwiLiAuIC4gLlxcXCJcXG4gICAgXFxcInVzZXItaW5mbyB1c2VyLWluZm8gYWktaW5mbyBhaS1pbmZvXFxcIlxcbiAgICBcXFwiLiAuIC4gLlxcXCI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG59XFxuXFxuLmdhbWUgLmNhbnZhcy1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxufVxcblxcbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IGFpLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAudXNlci1pbmZvIHtcXG4gIGdyaWQtYXJlYTogdXNlci1pbmZvO1xcbn1cXG5cXG4uZ2FtZSAuYWktaW5mbyB7XFxuICBncmlkLWFyZWE6IGFpLWluZm87XFxufVxcblxcbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XFxufVxcblxcbi5nYW1lIC5sb2cge1xcbiAgZ3JpZC1hcmVhOiBsb2c7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gbWluLWNvbnRlbnQgMTBweCAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcXFwic2NlbmUgLiB0ZXh0XFxcIjtcXG5cXG4gIHdpZHRoOiA1MDBweDtcXG5cXG4gIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWNvbG9yQjEpO1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xcbn1cXG5cXG4uZ2FtZSAubG9nIC5zY2VuZSB7XFxuICBncmlkLWFyZWE6IHNjZW5lO1xcblxcbiAgaGVpZ2h0OiAxNTBweDtcXG4gIHdpZHRoOiAxNTBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQjEpO1xcbn1cXG5cXG4uZ2FtZSAubG9nIC5zY2VuZS1pbWcge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcXG4gIGdyaWQtYXJlYTogdGV4dDtcXG4gIGZvbnQtc2l6ZTogMS4xNXJlbTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cXG59XFxuXFxuLmdhbWUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNTAlKTtcXG59XFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwidmFyIG1hcCA9IHtcblx0XCIuL0FUL2F0X2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazEuanBnXCIsXG5cdFwiLi9BVC9hdF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vQVQvYXRfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrMy5qcGdcIixcblx0XCIuL0FUL2F0X2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazQuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW4xLmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuMi5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjMuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW40LmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0MS5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDIuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQzLmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0NC5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDUuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2sxLmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrMi5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazMuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2s0LmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuMS5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjIuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW4zLmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuNC5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjUuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQxLmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0Mi5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDMuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQ0LmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0NS5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDYuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDYuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazEuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazIuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazMuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazQuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazUuanBnXCIsXG5cdFwiLi9ML2xfZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjEuanBnXCIsXG5cdFwiLi9ML2xfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjIuanBnXCIsXG5cdFwiLi9ML2xfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjMuanBnXCIsXG5cdFwiLi9ML2xfZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjQuanBnXCIsXG5cdFwiLi9ML2xfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDEuanBnXCIsXG5cdFwiLi9ML2xfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDIuanBnXCIsXG5cdFwiLi9ML2xfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDMuanBnXCIsXG5cdFwiLi9ML2xfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDUuanBnXCIsXG5cdFwiLi9ML2xnZW41LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xnZW41LmpwZ1wiLFxuXHRcIi4vTC9saGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9saGl0NC5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazEuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrMy5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazQuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW4xLmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuMi5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjMuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW40LmpwZ1wiLFxuXHRcIi4vU1Avc3BfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfaGl0MS5qcGdcIixcblx0XCIuL1NQL3NwX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2hpdDIuanBnXCIsXG5cdFwiLi9TUC9zcF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9oaXQzLmpwZ1wiLFxuXHRcIi4vVk0vbXZfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vbXZfaGl0NS5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazEuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrMy5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazQuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2s1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2s1LmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrNi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrNi5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjEuanBnXCIsXG5cdFwiLi9WTS92bV9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW4yLmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuMy5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjQuanBnXCIsXG5cdFwiLi9WTS92bV9nZW41LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW41LmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuNi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuNi5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDEuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQyLmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0My5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDQuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL3NjZW5lLWltYWdlcyBzeW5jIHJlY3Vyc2l2ZSBcXFxcLmpwZyQvXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLy8gSW1wb3J0IHN0eWxlIHNoZWV0c1xuaW1wb3J0IFwiLi9zdHlsZS9yZXNldC5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGUvc3R5bGUuY3NzXCI7XG5cbi8vIEltcG9ydCBtb2R1bGVzXG5pbXBvcnQgZ2FtZU1hbmFnZXIgZnJvbSBcIi4vbW9kdWxlcy9nYW1lTWFuYWdlclwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9mYWN0b3JpZXMvUGxheWVyXCI7XG5pbXBvcnQgY2FudmFzQWRkZXIgZnJvbSBcIi4vaGVscGVycy9jYW52YXNBZGRlclwiO1xuaW1wb3J0IHdlYkludCBmcm9tIFwiLi9tb2R1bGVzL3dlYkludGVyZmFjZVwiO1xuaW1wb3J0IHBsYWNlQWlTaGlwcyBmcm9tIFwiLi9oZWxwZXJzL3BsYWNlQWlTaGlwc1wiO1xuaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4vbW9kdWxlcy9nYW1lTG9nXCI7XG5pbXBvcnQgc291bmRzIGZyb20gXCIuL21vZHVsZXMvc291bmRzXCI7XG5cbi8vICNyZWdpb24gTG9hZGluZy9Jbml0XG4vLyBSZWYgdG8gZ2FtZSBtYW5hZ2VyIGluc3RhbmNlXG5jb25zdCBnbSA9IGdhbWVNYW5hZ2VyKCk7XG5cbi8vIEluaXRpYWxpemUgdGhlIHdlYiBpbnRlcmZhY2Ugd2l0aCBnbSByZWZcbmNvbnN0IHdlYkludGVyZmFjZSA9IHdlYkludChnbSk7XG5cbi8vIEluaXRpYWxpemUgc291bmQgbW9kdWxlXG5jb25zdCBzb3VuZFBsYXllciA9IHNvdW5kcygpO1xuXG4vLyBMb2FkIHNjZW5lIGltYWdlcyBmb3IgZ2FtZSBsb2dcbmdhbWVMb2cubG9hZFNjZW5lcygpO1xuXG4vLyBJbml0aWFsaXphdGlvbiBvZiBQbGF5ZXIgb2JqZWN0cyBmb3IgdXNlciBhbmQgQUlcbmNvbnN0IHVzZXJQbGF5ZXIgPSBQbGF5ZXIoZ20pOyAvLyBDcmVhdGUgcGxheWVyc1xuY29uc3QgYWlQbGF5ZXIgPSBQbGF5ZXIoZ20pO1xudXNlclBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IGFpUGxheWVyLmdhbWVib2FyZDsgLy8gU2V0IHJpdmFsIGJvYXJkc1xuYWlQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSB1c2VyUGxheWVyLmdhbWVib2FyZDtcbnVzZXJQbGF5ZXIuZ2FtZWJvYXJkLmlzQWkgPSBmYWxzZTsgLy8gU2V0IGFpIG9yIG5vdFxuYWlQbGF5ZXIuZ2FtZWJvYXJkLmlzQWkgPSB0cnVlO1xuXG4vLyBTZXQgZ2FtZUxvZyB1c2VyIGdhbWUgYm9hcmQgZm9yIGFjY3VyYXRlIHNjZW5lc1xuZ2FtZUxvZy5zZXRVc2VyR2FtZWJvYXJkKHVzZXJQbGF5ZXIuZ2FtZWJvYXJkKTtcbi8vIEluaXQgZ2FtZSBsb2cgc2NlbmUgaW1nXG5nYW1lTG9nLmluaXRTY2VuZSgpO1xuXG4vLyBBZGQgdGhlIGNhbnZhcyBvYmplY3RzIG5vdyB0aGF0IGdhbWVib2FyZHMgYXJlIGNyZWF0ZWRcbmNvbnN0IGNhbnZhc2VzID0gY2FudmFzQWRkZXIoXG4gIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLFxuICBhaVBsYXllci5nYW1lYm9hcmQsXG4gIHdlYkludGVyZmFjZSxcbiAgZ21cbik7XG4vLyBBZGQgY2FudmFzZXMgdG8gZ2FtZWJvYXJkc1xudXNlclBsYXllci5nYW1lYm9hcmQuY2FudmFzID0gY2FudmFzZXMudXNlckNhbnZhcztcbmFpUGxheWVyLmdhbWVib2FyZC5jYW52YXMgPSBjYW52YXNlcy5haUNhbnZhcztcblxuLy8gQWRkIGJvYXJkcyBhbmQgY2FudmFzZXMgdG8gZ2FtZU1hbmFnZXJcbmdtLnVzZXJCb2FyZCA9IHVzZXJQbGF5ZXIuZ2FtZWJvYXJkO1xuZ20uYWlCb2FyZCA9IGFpUGxheWVyLmdhbWVib2FyZDtcbmdtLnVzZXJDYW52YXNDb250YWluZXIgPSBjYW52YXNlcy51c2VyQ2FudmFzO1xuZ20uYWlDYW52YXNDb250YWluZXIgPSBjYW52YXNlcy5haUNhbnZhcztcbmdtLnBsYWNlbWVudENhbnZhc0NvbnRhaW5lciA9IGNhbnZhc2VzLnBsYWNlbWVudENhbnZhcztcblxuLy8gQWRkIG1vZHVsZXMgdG8gZ2FtZU1hbmFnZXJcbmdtLndlYkludGVyZmFjZSA9IHdlYkludGVyZmFjZTtcbmdtLnNvdW5kUGxheWVyID0gc291bmRQbGF5ZXI7XG5nbS5nYW1lTG9nID0gZ2FtZUxvZztcbi8vICNlbmRyZWdpb25cblxuLy8gQWRkIGFpIHNoaXBzXG5wbGFjZUFpU2hpcHMoMSwgYWlQbGF5ZXIuZ2FtZWJvYXJkKTtcbiJdLCJuYW1lcyI6WyJTaGlwIiwiYWlBdHRhY2siLCJHYW1lYm9hcmQiLCJnbSIsInRoaXNHYW1lYm9hcmQiLCJtYXhCb2FyZFgiLCJtYXhCb2FyZFkiLCJzaGlwcyIsImFsbE9jY3VwaWVkQ2VsbHMiLCJjZWxsc1RvQ2hlY2siLCJtaXNzZXMiLCJoaXRzIiwiZGlyZWN0aW9uIiwiaGl0U2hpcFR5cGUiLCJpc0FpIiwiaXNBdXRvQXR0YWNraW5nIiwiaXNBaVNlZWtpbmciLCJnYW1lT3ZlciIsImNhbkF0dGFjayIsInJpdmFsQm9hcmQiLCJjYW52YXMiLCJhZGRTaGlwIiwicmVjZWl2ZUF0dGFjayIsImFsbFN1bmsiLCJsb2dTdW5rIiwiaXNDZWxsU3VuayIsImFscmVhZHlBdHRhY2tlZCIsInZhbGlkYXRlU2hpcCIsInNoaXAiLCJpc1ZhbGlkIiwiX2xvb3AiLCJpIiwib2NjdXBpZWRDZWxscyIsImlzQ2VsbE9jY3VwaWVkIiwic29tZSIsImNlbGwiLCJsZW5ndGgiLCJfcmV0IiwiYWRkQ2VsbHNUb0xpc3QiLCJmb3JFYWNoIiwicHVzaCIsInBvc2l0aW9uIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwic2hpcFR5cGVJbmRleCIsIm5ld1NoaXAiLCJhZGRNaXNzIiwiYWRkSGl0IiwidHlwZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiQXJyYXkiLCJpc0FycmF5IiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiaiIsImhpdCIsInRyeUFpQXR0YWNrIiwiZGVsYXkiLCJzaGlwQXJyYXkiLCJpc1N1bmsiLCJzdW5rZW5TaGlwcyIsImxvZ01zZyIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJwbGF5ZXIiLCJjb25jYXQiLCJ1c2VyU2hpcFN1bmsiLCJhdHRhY2tDb29yZHMiLCJhdHRhY2tlZCIsIm1pc3MiLCJjZWxsVG9DaGVjayIsImhhc01hdGNoaW5nQ2VsbCIsImRyYXdpbmdNb2R1bGUiLCJkcmF3IiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzWCIsImNhbnZhc1kiLCJvcHRpb25zIiwiZ3JpZEhlaWdodCIsImdyaWRXaWR0aCIsImN1cnJlbnRDZWxsIiwiY2FudmFzQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9hcmRDYW52YXMiLCJhcHBlbmRDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9hcmRDdHgiLCJnZXRDb250ZXh0Iiwib3ZlcmxheUNhbnZhcyIsIm92ZXJsYXlDdHgiLCJjZWxsU2l6ZVgiLCJjZWxsU2l6ZVkiLCJnZXRNb3VzZUNlbGwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJtb3VzZVgiLCJjbGllbnRYIiwibGVmdCIsIm1vdXNlWSIsImNsaWVudFkiLCJ0b3AiLCJjZWxsWCIsIk1hdGgiLCJmbG9vciIsImNlbGxZIiwiZHJhd0hpdCIsImNvb3JkaW5hdGVzIiwiaGl0T3JNaXNzIiwiZHJhd01pc3MiLCJkcmF3U2hpcHMiLCJ1c2VyU2hpcHMiLCJoYW5kbGVNb3VzZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVNb3VzZUxlYXZlIiwiY2xlYXJSZWN0IiwiaGFuZGxlTW91c2VNb3ZlIiwibW91c2VDZWxsIiwicGxhY2VtZW50SGlnaGxpZ2h0IiwicGxhY2VtZW50Q2xpY2tlZCIsImF0dGFja0hpZ2hsaWdodCIsInBsYXllckF0dGFja2luZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibGluZXMiLCJjb250ZXh0IiwiZ3JpZFNpemUiLCJtaW4iLCJsaW5lQ29sb3IiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIngiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJ5IiwiZHJhd0NlbGwiLCJwb3NYIiwicG9zWSIsImZpbGxSZWN0IiwiYm9hcmQiLCJ1c2VyQm9hcmQiLCJhaUJvYXJkIiwibW91c2VDb29yZHMiLCJmaWxsU3R5bGUiLCJyYWRpdXMiLCJhcmMiLCJQSSIsImZpbGwiLCJkcmF3TGVuZ3RoIiwic2hpcHNDb3VudCIsImRpcmVjdGlvblgiLCJkaXJlY3Rpb25ZIiwiaGFsZkRyYXdMZW5ndGgiLCJyZW1haW5kZXJMZW5ndGgiLCJtYXhDb29yZGluYXRlWCIsIm1heENvb3JkaW5hdGVZIiwibWluQ29vcmRpbmF0ZVgiLCJtaW5Db29yZGluYXRlWSIsIm1heFgiLCJtYXhZIiwibWluWCIsIm1pblkiLCJpc091dE9mQm91bmRzIiwibmV4dFgiLCJuZXh0WSIsIlBsYXllciIsInByaXZhdGVOYW1lIiwidGhpc1BsYXllciIsIm5hbWUiLCJuZXdOYW1lIiwidG9TdHJpbmciLCJnYW1lYm9hcmQiLCJzZW5kQXR0YWNrIiwidmFsaWRhdGVBdHRhY2siLCJwbGF5ZXJCb2FyZCIsInNoaXBOYW1lcyIsImluZGV4IiwidGhpc1NoaXAiLCJzaXplIiwicGxhY2VtZW50RGlyZWN0aW9uWCIsInBsYWNlbWVudERpcmVjdGlvblkiLCJoYWxmU2l6ZSIsInJlbWFpbmRlclNpemUiLCJuZXdDb29yZHMiLCJjZWxsUHJvYnMiLCJwcm9icyIsInVwZGF0ZVByb2JzIiwiZmluZFJhbmRvbUF0dGFjayIsInJhbmRvbSIsImZpbmRHcmVhdGVzdFByb2JBdHRhY2siLCJhbGxQcm9icyIsIm1heCIsIk5FR0FUSVZFX0lORklOSVRZIiwiYWlEaWZmaWN1bHR5IiwicmVzZXRIaXRBZGphY2VudEluY3JlYXNlcyIsImNvb3JkcyIsImRlc3Ryb3lNb2RlQ29vcmRzIiwiYWlBdHRhY2tpbmciLCJjb2xvck1vZCIsImFkamFjZW50TW9kIiwiY3JlYXRlUHJvYnMiLCJpbml0aWFsUHJvYnMiLCJpbml0aWFsQ29sb3JXZWlnaHQiLCJyb3ciLCJjb2xvcldlaWdodCIsImNvbCIsImNlbnRlclgiLCJjZW50ZXJZIiwiZGlzdGFuY2VGcm9tQ2VudGVyIiwic3FydCIsInBvdyIsIm1pblByb2JhYmlsaXR5IiwibWF4UHJvYmFiaWxpdHkiLCJwcm9iYWJpbGl0eSIsImJhcnJ5UHJvYmFiaWxpdHkiLCJub3JtYWxpemVQcm9icyIsInN1bSIsIm5vcm1hbGl6ZWRQcm9icyIsIm5vbk5vcm1hbGl6ZWRQcm9icyIsIm1hcCIsIl90b0NvbnN1bWFibGVBcnJheSIsImlzVmFsaWRDZWxsIiwibnVtUm93cyIsIm51bUNvbHMiLCJpc0JvdW5kYXJ5T3JNaXNzIiwiZ2V0TGFyZ2VzdFJlbWFpbmluZ0xlbmd0aCIsImxhcmdlc3RTaGlwTGVuZ3RoIiwiZ2V0U21hbGxlc3RSZW1haW5pbmdMZW5ndGgiLCJzbWFsbGVzdFNoaXBMZW5ndGgiLCJsb2FkQWRqYWNlbnRDZWxscyIsImNlbnRlckNlbGwiLCJhZGphY2VudEhpdHMiLCJhZGphY2VudEVtcHRpZXMiLCJfY2VudGVyQ2VsbCIsIl9zbGljZWRUb0FycmF5IiwiYm90dG9tIiwicmlnaHQiLCJjaGVja0NlbGwiLCJhcHBseSIsInJldHVybkJlc3RBZGphY2VudEVtcHR5IiwibWF4VmFsdWUiLCJfYWRqYWNlbnRFbXB0aWVzJGkiLCJ2YWx1ZSIsImhhbmRsZUFkamFjZW50SGl0IiwiY2VsbENvdW50IiwidGhpc0NvdW50IiwiX2hpdCIsImhpdFgiLCJoaXRZIiwibmV4dENlbGwiLCJfbmV4dENlbGwiLCJfbmV4dENlbGwyIiwiZm91bmRFbXB0eSIsImNoZWNrTmV4dENlbGwiLCJuWCIsIm5ZIiwic2hpZnQiLCJuZXdOZXh0IiwiX25ld05leHQiLCJfbmV3TmV4dDIiLCJuZXdYIiwibmV3WSIsImNoZWNrQWRqYWNlbnRDZWxscyIsImluY3JlYXNlZEFkamFjZW50Q2VsbHMiLCJoaXRBZGphY2VudEluY3JlYXNlIiwibGFyZ2VzdExlbmd0aCIsInN0YXJ0aW5nRGVjIiwiZGVjUGVyY2VudGFnZSIsIm1pbkRlYyIsImRlY3JlbWVudEZhY3RvciIsIl9pbmNyZWFzZWRBZGphY2VudENlbCIsInNwbGljZSIsImNoZWNrRGVhZENlbGxzIiwidHJhbnNwb3NlQXJyYXkiLCJhcnJheSIsIl8iLCJjb2xJbmRleCIsImxvZ1Byb2JzIiwicHJvYnNUb0xvZyIsInRyYW5zcG9zZWRQcm9icyIsImNvbnNvbGUiLCJ0YWJsZSIsImxvZyIsInJlZHVjZSIsInJvd1N1bSIsIl9nbSR1c2VyQm9hcmQiLCJ2YWx1ZXMiLCJfaGl0MiIsIl9taXNzIiwiZ3JpZENhbnZhcyIsImNhbnZhc0FkZGVyIiwidXNlckdhbWVib2FyZCIsImFpR2FtZWJvYXJkIiwid2ViSW50ZXJmYWNlIiwicGxhY2VtZW50UEgiLCJxdWVyeVNlbGVjdG9yIiwidXNlclBIIiwiYWlQSCIsInVzZXJDYW52YXMiLCJhaUNhbnZhcyIsInBsYWNlbWVudENhbnZhcyIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJpbWFnZUxvYWRlciIsImltYWdlUmVmcyIsIlNQIiwiYXR0YWNrIiwiZ2VuIiwiQVQiLCJWTSIsIklHIiwiTCIsImltYWdlQ29udGV4dCIsInJlcXVpcmUiLCJmaWxlcyIsImZpbGUiLCJmaWxlUGF0aCIsImZpbGVOYW1lIiwidG9Mb3dlckNhc2UiLCJzdWJEaXIiLCJzcGxpdCIsInRvVXBwZXJDYXNlIiwiaW5jbHVkZXMiLCJyYW5kb21TaGlwcyIsInBsYWNlQWlTaGlwcyIsInBhc3NlZERpZmYiLCJwbGFjZVNoaXBzIiwiZGlmZmljdWx0eSIsImdyaWRYIiwiZ3JpZFkiLCJyb3VuZCIsImdhbWVMb2ciLCJ1c2VyTmFtZSIsImRvVXBkYXRlU2NlbmUiLCJkb0xvY2siLCJzZXRVc2VyR2FtZWJvYXJkIiwibG9nVGV4dCIsImxvZ0ltZyIsInNjZW5lSW1hZ2VzIiwibG9hZFNjZW5lcyIsInJhbmRvbUVudHJ5IiwibGFzdEluZGV4IiwicmFuZG9tTnVtYmVyIiwiZGlyTmFtZXMiLCJyYW5kb21TaGlwRGlyIiwicmVtYWluaW5nU2hpcHMiLCJmaWx0ZXIiLCJpbml0U2NlbmUiLCJzaGlwRGlyIiwiZW50cnkiLCJzcmMiLCJzZXRTY2VuZSIsImxvZ0xvd2VyIiwidGV4dENvbnRlbnQiLCJzaGlwVHlwZXMiLCJ0eXBlVG9EaXIiLCJzZW50aW5lbCIsImFzc2F1bHQiLCJ2aXBlciIsImlyb24iLCJsZXZpYXRoYW4iLCJlcmFzZSIsImFwcGVuZCIsInN0cmluZ1RvQXBwZW5kIiwiaW5uZXJIVE1MIiwiYm9vbCIsImdhbWVNYW5hZ2VyIiwidXNlckF0dGFja0RlbGF5IiwiYWlBdHRhY2tEZWxheSIsImFpQXV0b0RlbGF5IiwidXNlckNhbnZhc0NvbnRhaW5lciIsImFpQ2FudmFzQ29udGFpbmVyIiwicGxhY2VtZW50Q2FudmFzQ29udGFpbmVyIiwic291bmRQbGF5ZXIiLCJhaUF0dGFja0hpdCIsInBsYXlIaXQiLCJzdW5rTXNnIiwiYWlBdHRhY2tNaXNzZWQiLCJwbGF5TWlzcyIsImFpQXR0YWNrQ291bnQiLCJzZXRUaW1lb3V0IiwidGhlbiIsInJlc3VsdCIsInBsYXlBdHRhY2siLCJhaU1hdGNoQ2xpY2tlZCIsImlzTXV0ZWQiLCJ0cnlTdGFydEdhbWUiLCJzaG93R2FtZSIsInJhbmRvbVNoaXBzQ2xpY2tlZCIsInJvdGF0ZUNsaWNrZWQiLCJfY2VsbCIsIm94Iiwib3kiLCJfYWlCb2FyZCRjZWxsc1RvQ2hlY2siLCJjeCIsImN5IiwiZGlmZiIsInBsYWNlbWVudENhbnZhc2NvbnRhaW5lciIsImFNb2R1bGUiLCJoaXRTb3VuZCIsIm1pc3NTb3VuZCIsImF0dGFja1NvdW5kIiwiYXR0YWNrQXVkaW8iLCJBdWRpbyIsImhpdEF1ZGlvIiwibWlzc0F1ZGlvIiwic291bmRzIiwiY3VycmVudFRpbWUiLCJwbGF5IiwidGl0bGUiLCJtZW51IiwicGxhY2VtZW50IiwiZ2FtZSIsInN0YXJ0QnRuIiwiYWlNYXRjaEJ0biIsInJhbmRvbVNoaXBzQnRuIiwicm90YXRlQnRuIiwicm90YXRlRGlyZWN0aW9uIiwiaGlkZUFsbCIsInNob3dNZW51IiwicmVtb3ZlIiwic2hvd1BsYWNlbWVudCIsInNocmlua1RpdGxlIiwiaGFuZGxlU3RhcnRDbGljayIsImhhbmRsZUFpTWF0Y2hDbGljayIsImhhbmRsZVJvdGF0ZUNsaWNrIiwiaGFuZGxlUmFuZG9tU2hpcHNDbGljayIsIndlYkludCIsInVzZXJQbGF5ZXIiLCJhaVBsYXllciIsImNhbnZhc2VzIl0sInNvdXJjZVJvb3QiOiIifQ==