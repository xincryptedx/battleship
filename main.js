/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/factories/Gameboard.js":
/*!************************************!*\
  !*** ./src/factories/Gameboard.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship */ "./src/factories/Ship.js");
/* harmony import */ var _helpers_aiAttack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/aiAttack */ "./src/helpers/aiAttack.js");
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/gameLog */ "./src/modules/gameLog.js");




/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
var Gameboard = function Gameboard() {
  // Constraints for game board (10x10 grid, zero based)
  var maxBoardX = 9;
  var maxBoardY = 9;
  var thisGameboard = {
    ships: [],
    direction: 1,
    returnUserShips: null,
    allOccupiedCells: [],
    addShip: null,
    receiveAttack: null,
    canAttack: true,
    misses: [],
    hits: [],
    allSunk: null,
    logSunk: null,
    rivalBoard: null,
    get maxBoardX() {
      return maxBoardX;
    },
    get maxBoardY() {
      return maxBoardY;
    },
    canvas: null,
    isAi: false,
    gameOver: false
  };

  // Method that validates ship occupied cell coords
  var validateShip = function validateShip(ship) {
    if (!ship) return false;
    // Flag for detecting invalid position value
    var isValid = true;

    // Check that ships occupied cells are all within map and not already occupied
    var _loop = function _loop(i) {
      // On the map?
      if (ship.occupiedCells[i][0] >= 0 && ship.occupiedCells[i][0] <= maxBoardX && ship.occupiedCells[i][1] >= 0 && ship.occupiedCells[i][1] <= maxBoardY) {
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
  var addHit = function addHit(position) {
    if (position) {
      thisGameboard.hits.push(position);
    }
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
                addHit(position);
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
  thisGameboard.tryAiAttack = function () {
    // Return if not ai
    if (thisGameboard.isAi === false) return;
    (0,_helpers_aiAttack__WEBPACK_IMPORTED_MODULE_1__["default"])(thisGameboard.rivalBoard);
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
  var sunkenShips = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  };

  // Method for reporting sunken ships
  thisGameboard.logSunk = function () {
    Object.keys(sunkenShips).forEach(function (key) {
      if (sunkenShips[key] === false && thisGameboard.ships[key - 1].isSunk()) {
        var ship = thisGameboard.ships[key - 1].type;
        var player = thisGameboard.isAi ? "AI's" : "User's";
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_2__["default"].append("<span style=\"color: red\">".concat(player, " ").concat(ship, " was destroyed!</span>"));
        sunkenShips[key] = true;
      }
    });
  };
  return thisGameboard;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/factories/Player.js":
/*!*********************************!*\
  !*** ./src/factories/Player.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/factories/Gameboard.js");


/* Factory that creates and returns a player object that can take a shot at opponent's game board */
var Player = function Player() {
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
    gameboard: (0,_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])(),
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

/***/ "./src/helpers/aiAttack.js":
/*!*********************************!*\
  !*** ./src/helpers/aiAttack.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/gameLog */ "./src/modules/gameLog.js");


// This helper will look at current hits and misses and then return an attack
var aiAttack = function aiAttack(rivalBoard) {
  var gridHeight = 10;
  var gridWidth = 10;
  var board = rivalBoard;
  var hits = rivalBoard.hits,
    misses = rivalBoard.misses;
  var attackCoords = [];

  // Method to determine if cell has a hit or miss in it
  var alreadyAttacked = function alreadyAttacked(cellCoordinates) {
    var attacked = false;
    hits.forEach(function (hit) {
      if (cellCoordinates[0] === hit[0] && cellCoordinates[1] === hit[1]) {
        attacked = true;
      }
    });
    misses.forEach(function (miss) {
      if (cellCoordinates[0] === miss[0] && cellCoordinates[1] === miss[1]) {
        attacked = true;
      }
    });
    return attacked;
  };

  // Method for returning random attack
  var randomAttack = function randomAttack() {
    var x = Math.floor(Math.random() * gridWidth);
    var y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Try a random attack that has not been yet tried
  randomAttack();
  while (alreadyAttacked(attackCoords)) {
    randomAttack();
  }

  // Timeout to simulate "thinking" and to make game feel better
  setTimeout(function () {
    // Send attack to rival board
    rivalBoard.receiveAttack(attackCoords)
    // Then draw hits or misses
    .then(function (result) {
      if (result === true) {
        // Draw the hit to board
        rivalBoard.canvas.drawHit(attackCoords);
        // Log the hit
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("AI attacks cell: ".concat(attackCoords, "\nAttack hit!"));
        // Log sunk user ships
        rivalBoard.logSunk();
        // Check if AI won
        if (rivalBoard.allSunk()) {
          // Log results
          _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("All User units destroyed. AI dominance is assured.");
          // Set game over on boards
          board.gameOver = true;
          board.rivalBoard.gameOver = true;
        }
      } else if (result === false) {
        // Draw the miss to board
        rivalBoard.canvas.drawMiss(attackCoords);
        // Log the miss
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("AI attacks cell: ".concat(attackCoords, "\nAttack missed!"));
      }
    });
    board.canAttack = true;
  }, 10);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiAttack);

/***/ }),

/***/ "./src/helpers/canvasAdder.js":
/*!************************************!*\
  !*** ./src/helpers/canvasAdder.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gridCanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gridCanvas */ "./src/helpers/gridCanvas.js");


/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. */
var canvasAdder = function canvasAdder(userGameboard, aiGameboard, webInterface) {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  var placementPH = document.querySelector(".placement-canvas-ph");
  var userPH = document.querySelector(".user-canvas-ph");
  var aiPH = document.querySelector(".ai-canvas-ph");

  // Create the canvases

  var userCanvas = (0,_gridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(300, 300, {
    type: "user"
  }, userGameboard, webInterface);
  var aiCanvas = (0,_gridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(300, 300, {
    type: "ai"
  }, aiGameboard, webInterface);
  var placementCanvas = (0,_gridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(300, 300, {
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

/***/ "./src/helpers/gridCanvas.js":
/*!***********************************!*\
  !*** ./src/helpers/gridCanvas.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/gameLog */ "./src/modules/gameLog.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// This module allows writing to the game log text

var createCanvas = function createCanvas(sizeX, sizeY, options, gameboard, webInterface, userCanvas) {
  // #region References
  // Ships array
  var ships = gameboard.ships;
  var userBoardCanvas = null;
  if (userCanvas) {
    var _userCanvas$childNode = _slicedToArray(userCanvas.childNodes, 1);
    userBoardCanvas = _userCanvas$childNode[0];
  }

  // #endregion

  // #region Set up basic element properties
  // Set the grid height and width and add ref to current cell
  var gridHeight = 10;
  var gridWidth = 10;
  var currentCell = null;

  // Create parent div that holds the canvases. This is the element returned.
  var canvasContainer = document.createElement("div");
  canvasContainer.classList.add("canvas-container");

  // Create the board canvas element to serve as the gameboard base
  // Static or rarely rendered things should go here
  var boardCanvas = document.createElement("canvas");
  canvasContainer.appendChild(boardCanvas);
  boardCanvas.width = sizeX;
  boardCanvas.height = sizeY;
  var boardCtx = boardCanvas.getContext("2d");

  // Create the overlay canvas for rendering ship placement and attack selection
  var overlayCanvas = document.createElement("canvas");
  canvasContainer.appendChild(overlayCanvas);
  overlayCanvas.width = sizeX;
  overlayCanvas.height = sizeY;
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

  // Method to determine if cell has a hit or miss in it
  var alreadyAttacked = function alreadyAttacked(cellCoordinates) {
    var attacked = false;
    gameboard.hits.forEach(function (hit) {
      if (cellCoordinates[0] === hit[0] && cellCoordinates[1] === hit[1]) {
        attacked = true;
      }
    });
    gameboard.misses.forEach(function (miss) {
      if (cellCoordinates[0] === miss[0] && cellCoordinates[1] === miss[1]) {
        attacked = true;
      }
    });
    return attacked;
  };

  // #endregion

  // #region Methods for drawing to canvases
  // Method for drawing the grid lines
  var drawLines = function drawLines(context) {
    // Draw grid lines
    var gridSize = Math.min(sizeX, sizeY) / 10;
    var lineColor = "black";
    context.strokeStyle = lineColor;
    context.lineWidth = 1;

    // Draw vertical lines
    for (var x = 0; x <= sizeX; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, sizeY);
      context.stroke();
    }

    // Draw horizontal lines
    for (var y = 0; y <= sizeY; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(sizeX, y);
      context.stroke();
    }
  };

  // Draws the highlighted placement cells to the overlay canvas
  var highlightPlacementCells = function highlightPlacementCells(cellCoordinates) {
    var cellX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cellSizeX;
    var cellY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : cellSizeY;
    var shipsCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ships.length;
    var direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : gameboard.direction;
    // Clear the canvas
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    // Draw a cell to overlay
    function drawCell(posX, posY) {
      overlayCtx.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }

    // Determine current ship length (based on default battleship rules sizes, smallest to biggest)
    var drawLength;
    if (shipsCount === 0) drawLength = 2;else if (shipsCount === 1 || shipsCount === 2) drawLength = 3;else drawLength = shipsCount + 1;

    // Determine direction to draw in
    var directionX = 0;
    var directionY = 0;
    if (direction === 1) {
      directionY = 1;
      directionX = 0;
    } else if (direction === 0) {
      directionY = 0;
      directionX = 1;
    }

    // Divide the drawLenght in half with remainder
    var halfDrawLength = Math.floor(drawLength / 2);
    var remainderLength = drawLength % 2;

    // If drawing off canvas make color red
    // Calculate maximum and minimum coordinates
    var maxCoordinateX = cellCoordinates[0] + (halfDrawLength + remainderLength - 1) * directionX;
    var maxCoordinateY = cellCoordinates[1] + (halfDrawLength + remainderLength - 1) * directionY;
    var minCoordinateX = cellCoordinates[0] - halfDrawLength * directionX;
    var minCoordinateY = cellCoordinates[1] - halfDrawLength * directionY;

    // And translate into an actual canvas position
    var maxX = maxCoordinateX * cellX;
    var maxY = maxCoordinateY * cellY;
    var minX = minCoordinateX * cellX;
    var minY = minCoordinateY * cellY;

    // Check if any cells are outside the canvas boundaries
    var isOutOfBounds = maxX >= overlayCanvas.width || maxY >= overlayCanvas.height || minX < 0 || minY < 0;

    // Set the fill color based on whether cells are drawn off canvas
    overlayCtx.fillStyle = isOutOfBounds ? "red" : "blue";

    // Draw the moused over cell from passed coords
    drawCell(cellCoordinates[0], cellCoordinates[1]);

    // Draw the first half of cells and remainder in one direction
    for (var i = 0; i < halfDrawLength + remainderLength; i += 1) {
      var nextX = cellCoordinates[0] + i * directionX;
      var nextY = cellCoordinates[1] + i * directionY;
      drawCell(nextX, nextY);
    }

    // Draw the remaining half
    // Draw the remaining cells in the opposite direction
    for (var _i2 = 0; _i2 < halfDrawLength; _i2 += 1) {
      var _nextX = cellCoordinates[0] - (_i2 + 1) * directionX;
      var _nextY = cellCoordinates[1] - (_i2 + 1) * directionY;
      drawCell(_nextX, _nextY);
    }
  };

  // Draw highlighted attack cell
  var highlightAttack = function highlightAttack(cellCoordinates) {
    var cellX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cellSizeX;
    var cellY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : cellSizeY;
    // Clear the canvas
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Highlight the current cell in red
    overlayCtx.fillStyle = "red";

    // Check if cell coords in gameboard hits or misses
    if (alreadyAttacked(cellCoordinates)) return;

    // Highlight the cell
    overlayCtx.fillRect(cellCoordinates[0] * cellX, cellCoordinates[1] * cellY, cellX, cellY);
  };

  // Add methods on the container for drawing hits or misses for ease of use elsewhere
  canvasContainer.drawHit = function (coordinates) {
    return boardCanvas.drawHitMiss(coordinates, 1);
  };
  canvasContainer.drawMiss = function (coordinates) {
    return boardCanvas.drawHitMiss(coordinates, 0);
  };

  // #endregion

  // #region Assign static behaviors
  // boardCanvas
  // Draw ships to board canvas using shipsCopy
  boardCanvas.drawShips = function () {
    var shipsToDraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ships;
    var cellX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cellSizeX;
    var cellY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : cellSizeY;
    // Draw a cell to board
    function drawCell(posX, posY) {
      boardCtx.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }
    shipsToDraw.forEach(function (ship) {
      ship.occupiedCells.forEach(function (cell) {
        drawCell(cell[0], cell[1]);
      });
    });
  };

  // Draw hit or to board canvas
  boardCanvas.drawHitMiss = function (cellCoordinates) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var cellX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : cellSizeX;
    var cellY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : cellSizeY;
    // Set proper fill color
    boardCtx.fillStyle = "white";
    if (type === 1) boardCtx.fillStyle = "red";
    // Set a radius for circle to draw for "peg" that will always fit in cell
    var radius = cellX > cellY ? cellY / 2 : cellX / 2;
    // Draw the circle
    boardCtx.beginPath();
    boardCtx.arc(cellCoordinates[0] * cellX + cellX / 2, cellCoordinates[1] * cellY + cellY / 2, radius, 0, 2 * Math.PI);
    boardCtx.stroke();
    boardCtx.fill();
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
        highlightPlacementCells(mouseCell);
      }

      // Set the currentCell to the mouseCell for future comparisons
      currentCell = mouseCell;
    };

    // Browser click events
    boardCanvas.handleMouseClick = function (event) {
      var mouseCell = getMouseCell(event);

      // Try placement
      gameboard.addShip(mouseCell);
      boardCanvas.drawShips();
      userBoardCanvas.drawShips();
      webInterface.tryStartGame();
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
        highlightAttack(mouseCell);
      }
      // Denote if it is a valid attack or not - NYI
    };
    // Handle board mouse click
    boardCanvas.handleMouseClick = function (event) {
      // Ref to gameboard
      var aiBoard = gameboard;
      // Return if gameboard can't attack
      if (aiBoard.rivalBoard.canAttack === false) return;
      // Get the current cell
      var mouseCell = getMouseCell(event);
      // Try attack at current cell
      if (alreadyAttacked(mouseCell)) {
        // Bad thing. Error sound maybe.
      } else if (gameboard.gameOver === false) {
        // Set gameboard to not be able to attack
        aiBoard.rivalBoard.canAttack = false;
        // Log the sent attack
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].erase();
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("User attacks cell: ".concat(mouseCell));
        // Send the attack
        gameboard.receiveAttack(mouseCell).then(function (result) {
          // Attack hit
          if (result === true) {
            // Draw hit to board
            boardCanvas.drawHitMiss(mouseCell, 1);
            // Log hit
            _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("Attack hit!");
            // Log sunken ships
            aiBoard.logSunk();
            // Check if player won
            if (aiBoard.allSunk()) {
              // Log results
              _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("All AI units destroyed. Humanity survives another day...");
              // Set gameover on boards
              aiBoard.gameOver = true;
              aiBoard.rivalBoard.gameOver = true;
            } else {
              // Log the ai "thinking" about its attack
              _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("AI detrmining attack...");
              // Have the ai attack if not gameOver
              gameboard.tryAiAttack();
            }
          } else if (result === false) {
            // Draw miss to board
            boardCanvas.drawHitMiss(mouseCell, 0);
            // Log miss
            _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("Attack missed!");
            // Log the ai "thinking" about its attack
            _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("AI detrmining attack...");
            // Have the ai attack if not gameOver
            gameboard.tryAiAttack();
          }
        });
        // Clear the overlay to show hit/miss under current highight
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      }
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
  drawLines(boardCtx);

  // Return completed canvases
  return canvasContainer;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCanvas);

/***/ }),

/***/ "./src/helpers/placeAiShips.js":
/*!*************************************!*\
  !*** ./src/helpers/placeAiShips.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// This helper will attempt to add ships to the ai gameboard in a variety of ways for varying difficulty
var placeAiShips = function placeAiShips(passedDiff, aiGameboard) {
  // Grid size
  var gridHeight = 10;
  var gridWidth = 10;

  // Copy of the ai ships array and method to get it
  var aiShips = aiGameboard.ships;

  // Place a ship randomly
  var placeRandomShip = function placeRandomShip() {
    // Get random placement
    var x = Math.floor(Math.random() * gridWidth);
    var y = Math.floor(Math.random() * gridHeight);
    var direction = Math.round(Math.random());
    // Try the placement

    aiGameboard.addShip([x, y], direction);
  };
  // Place a ship along edges until one successfully placed
  // Place a ship based on quadrant

  // Waits for a aiShipsSet event
  function waitForAiShipsSet() {
    // Refactor
  }

  // Combine placement tactics to create varying difficulties
  var placeShips = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(difficulty) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(difficulty === 1 && aiShips.length <= 4)) {
              _context.next = 5;
              break;
            }
            // Try random placement
            placeRandomShip();

            // Wait for returnAiShips
            _context.next = 4;
            return waitForAiShipsSet();
          case 4:
            // Recursively call fn until ships placed
            placeShips(difficulty);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function placeShips(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  placeShips(passedDiff);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (placeAiShips);

/***/ }),

/***/ "./src/modules/gameLog.js":
/*!********************************!*\
  !*** ./src/modules/gameLog.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var gameLog = function () {
  // Ref to log text
  var logText = document.querySelector(".log-text");

  // Erase the log text
  var erase = function erase() {
    logText.textContent = "";
  };

  // Add to log text
  var append = function append(stringToAppend) {
    if (stringToAppend) {
      logText.innerHTML += "\n".concat(stringToAppend.toString());
    }
  };
  return {
    erase: erase,
    append: append
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameLog);

/***/ }),

/***/ "./src/modules/gameManager.js":
/*!************************************!*\
  !*** ./src/modules/gameManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _factories_Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factories/Player */ "./src/factories/Player.js");
/* harmony import */ var _helpers_canvasAdder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/canvasAdder */ "./src/helpers/canvasAdder.js");
/* harmony import */ var _webInterface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./webInterface */ "./src/modules/webInterface.js");
/* harmony import */ var _helpers_placeAiShips__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/placeAiShips */ "./src/helpers/placeAiShips.js");





/* This module holds the game loop logic for starting games, creating
   required objects, iterating through turns, reporting game outcome when
   a player loses, and restart the game */
var gameManager = function gameManager() {
  // Initialization of Player objects for user and AI
  var userPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  var aiPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  userPlayer.gameboard.rivalBoard = aiPlayer.gameboard;
  aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
  userPlayer.gameboard.isAi = false;
  aiPlayer.gameboard.isAi = true;

  // Initialize the web interface with gameboards
  var webInt = (0,_webInterface__WEBPACK_IMPORTED_MODULE_2__["default"])(userPlayer.gameboard, aiPlayer.gameboard);
  // Add the canvas objects now that gameboards are created
  var canvases = (0,_helpers_canvasAdder__WEBPACK_IMPORTED_MODULE_1__["default"])(userPlayer.gameboard, aiPlayer.gameboard, webInt);
  // Add canvases to gameboards
  userPlayer.gameboard.canvas = canvases.userCanvas;
  aiPlayer.gameboard.canvas = canvases.aiCanvas;

  // Add ai ships
  (0,_helpers_placeAiShips__WEBPACK_IMPORTED_MODULE_3__["default"])(1, aiPlayer.gameboard);
  /* Method to determine if game is over after every turn. Checks allSunk on rival gameboard 
     and returns true or false */

  /* Method that flips a virtual coin to determine who goes first, and sets that
     player object to an active player variable */

  // Method for ending the game by reporting results

  // Method for restarting the game

  /* Iterate between players for attacks - if above method doesn't return true, check the
     active player and query them for their move. If above method is true, call method
     for ending the game, then method for restarting the game.
     
     -For user - set a one time event trigger for user clicking on valid attack position div
     on the web interface. It will use gameboard.rivalBoard.receiveAttack and info from the div
     html data to have the board attempt the attack. If the attack is true or false then a valid
     hit or valid miss occurred. If undefined then an invalid attack was made, typically meaning
     attacking a cell that has already had a hit or miss occur in it. If the attack is invalid 
     then reset the trigger. After a successful attack (true or false returned) then set the 
     active player to the AI and loop
      -For AI use AI module's query method and pass in relevant parameters. AI module does its
     magic and returns a position. Then use gameboard.rivalboard.receivedAttack to make and 
     confirm the attack similar to the users attacks */

  // The logic of the game manager and how the web interface responds to it will remain
  // separated by using a pubsub module
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameManager);

/***/ }),

/***/ "./src/modules/webInterface.js":
/*!*************************************!*\
  !*** ./src/modules/webInterface.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable no-param-reassign */
/* This module has three primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
var webInterface = function webInterface(userGameboard, aiGameboard) {
  // References to main elements
  var title = document.querySelector(".title");
  var menu = document.querySelector(".menu");
  var placement = document.querySelector(".placement");
  var game = document.querySelector(".game");

  // Reference to btn elements
  var startBtn = document.querySelector(".start-btn");
  var rotateBtn = document.querySelector(".rotate-btn");

  // Method for iterating through directions
  var rotateDirection = function rotateDirection() {
    userGameboard.direction = userGameboard.direction === 0 ? 1 : 0;
    aiGameboard.direction = aiGameboard.direction === 0 ? 1 : 0;
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
  // If the user gameboard has full ships then the game is ready to start
  var tryStartGame = function tryStartGame() {
    if (userGameboard.ships.length === 5) {
      showGame();
    }
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

  // Handle clicks on the rotate button in the placement section
  var handleRotateClick = function handleRotateClick() {
    rotateDirection();
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  return {
    tryStartGame: tryStartGame
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (webInterface);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style/reset.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style/reset.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

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
  font-size: 5.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 2px var(--colorB1);
  color: var(--colorB2);
}

.title.shrink {
  transform: scale(0.5) translateY(-50%);
}
/* #region menu section */
.menu {
  grid-column: 3 / 19;
  grid-row: 8 / 18;

  display: grid;
  grid-template: 5% 15% 5% 1fr 5% 1fr / 1fr;
  place-items: center;
  grid-template-areas:
    "."
    "credits"
    "."
    "start-game"
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
}

.menu .options {
  grid-area: options;
  align-self: start;
}

.menu .start-btn,
.menu .options-btn {
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
.menu .options-btn:hover {
  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);
}

/* #endregion */

/* #region placement section */
.placement {
  grid-column: 3 / 19;
  grid-row: 6 / 20;

  display: grid;
  grid-template: 5% min-content 8% min-content 8% min-content 5% 1fr / 1fr;
  place-items: center;
  grid-template-areas:
    "."
    "instructions"
    "."
    "ships"
    "."
    "rotate"
    "."
    "canvas";

  transition: transform 0.3s ease-in-out;

  background-color: var(--colorA1);
}

.placement .instructions {
  grid-area: instructions;
}

.placement .instructions-text {
  font-size: 2.75rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px var(--bg-color);
}

.placement .ships-to-place {
  grid-area: ships;
  display: grid;
  grid-auto-flow: column;
}

.placement .rotate {
  grid-area: rotate;
}

.placement .rotate-btn {
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

.placement .rotate-btn:hover {
  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);
}

.placement .rotate-btn:active {
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
  grid-template: repeat(4, 5% min-content) / repeat(4, 1fr);
  grid-template-areas:
    ". . . ."
    "user-board user-board ai-board ai-board"
    ". . . ."
    "user-info user-info ai-info ai-info"
    ". . . ."
    ". log log ."
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
  white-space: pre;
  text-align: center;
}

.game.hidden {
  transform: translateX(150%);
}
/* #endregion */

/* #endregion */
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"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","sourcesContent":["/* Color Rules */\n:root {\n  --colorA1: #722b94;\n  --colorA2: #a936e0;\n  --colorC: #37e02b;\n  --colorB1: #941d0d;\n  --colorB2: #e0361f;\n\n  --bg-color: hsl(0, 0%, 22%);\n  --bg-color2: hsl(0, 0%, 32%);\n  --text-color: hsl(0, 0%, 91%);\n  --link-color: hsl(36, 92%, 59%);\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.canvas-container {\n  display: grid;\n  grid-template: 1fr / 1fr;\n  width: fit-content;\n  height: fit-content;\n}\n\n.canvas-container > * {\n  grid-row: -1 / 1;\n  grid-column: -1 / 1;\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n  display: grid;\n  place-items: center;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: var(--bg-color2);\n  border-radius: 20px;\n}\n\n.title-text {\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  font-size: 5.5rem;\n  font-weight: bold;\n  text-shadow: 2px 2px 2px var(--colorB1);\n  color: var(--colorB2);\n}\n\n.title.shrink {\n  transform: scale(0.5) translateY(-50%);\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  display: grid;\n  grid-template: 5% 15% 5% 1fr 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"credits\"\n    \".\"\n    \"start-game\"\n    \".\"\n    \"options\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.menu.hidden {\n  transform: translateX(-150%);\n}\n\n.menu .credits {\n  grid-area: credits;\n}\n\n.menu .start {\n  grid-area: start-game;\n}\n\n.menu .options {\n  grid-area: options;\n  align-self: start;\n}\n\n.menu .start-btn,\n.menu .options-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.menu .start-btn:hover,\n.menu .options-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 6 / 20;\n\n  display: grid;\n  grid-template: 5% min-content 8% min-content 8% min-content 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"instructions\"\n    \".\"\n    \"ships\"\n    \".\"\n    \"rotate\"\n    \".\"\n    \"canvas\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n}\n\n.placement .instructions {\n  grid-area: instructions;\n}\n\n.placement .instructions-text {\n  font-size: 2.75rem;\n  font-weight: bold;\n  text-shadow: 1px 1px 1px var(--bg-color);\n}\n\n.placement .ships-to-place {\n  grid-area: ships;\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.placement .rotate {\n  grid-area: rotate;\n}\n\n.placement .rotate-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.placement .rotate-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.placement .rotate-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.placement .placement-canvas-container {\n  grid-area: canvas;\n  align-self: start;\n}\n\n.placement.hidden {\n  transform: translateY(150%);\n}\n\n.placement .canvas-container {\n  background-color: var(--colorC);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 5 / 20;\n  display: grid;\n  place-items: center;\n  grid-template: repeat(4, 5% min-content) / repeat(4, 1fr);\n  grid-template-areas:\n    \". . . .\"\n    \"user-board user-board ai-board ai-board\"\n    \". . . .\"\n    \"user-info user-info ai-info ai-info\"\n    \". . . .\"\n    \". log log .\"\n    \". . . .\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.game .canvas-container {\n  background-color: var(--colorA2);\n}\n\n.game .user-canvas-container {\n  grid-area: user-board;\n}\n\n.game .ai-canvas-container {\n  grid-area: ai-board;\n}\n\n.game .user-info {\n  grid-area: user-info;\n}\n\n.game .ai-info {\n  grid-area: ai-info;\n}\n\n.game .player-ships {\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.game .log {\n  grid-area: log;\n  white-space: pre;\n  text-align: center;\n}\n\n.game.hidden {\n  transform: translateX(150%);\n}\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/reset.css */ "./src/style/reset.css");
/* harmony import */ var _style_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/style.css */ "./src/style/style.css");
/* harmony import */ var _modules_gameManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/gameManager */ "./src/modules/gameManager.js");
/* eslint-disable no-unused-vars */




// Initialize modules
(0,_modules_gameManager__WEBPACK_IMPORTED_MODULE_2__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU8sNkZBQTZGLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxjQUFjLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxZQUFZLE1BQU0sWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLFdBQVcsWUFBWSxNQUFNLFVBQVUsWUFBWSxjQUFjLFdBQVcsVUFBVSxNQUFNLFVBQVUsS0FBSyxZQUFZLFdBQVcsVUFBVSxhQUFhLGNBQWMsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE1BQU0sWUFBWSxNQUFNLFlBQVksY0FBYyxXQUFXLFlBQVksYUFBYSxXQUFXLE1BQU0sYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE1BQU0sVUFBVSxXQUFXLFlBQVksYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsT0FBTyxNQUFNLFlBQVksT0FBTyxXQUFXLFlBQVksTUFBTSxZQUFZLGNBQWMsV0FBVyxZQUFZLGFBQWEsYUFBYSxNQUFNLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFdBQVcsWUFBWSxhQUFhLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE1BQU0sV0FBVyxZQUFZLE1BQU0sWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLFlBQVksTUFBTSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVks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YjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDMkI7QUFDQTtBQUNxQjs7QUFFaEQ7QUFDQWdRLGdFQUFXLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9haUF0dGFjay5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvY2FudmFzQWRkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2dyaWRDYW52YXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3BsYWNlQWlTaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUxvZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3dlYkludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9yZXNldC5jc3M/NDQ1ZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3N0eWxlLmNzcz9jOWYwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5pbXBvcnQgYWlBdHRhY2sgZnJvbSBcIi4uL2hlbHBlcnMvYWlBdHRhY2tcIjtcbmltcG9ydCBnYW1lTG9nIGZyb20gXCIuLi9tb2R1bGVzL2dhbWVMb2dcIjtcblxuLyogRmFjdG9yeSB0aGF0IHJldHVybnMgYSBnYW1lYm9hcmQgdGhhdCBjYW4gcGxhY2Ugc2hpcHMgd2l0aCBTaGlwKCksIHJlY2lldmUgYXR0YWNrcyBiYXNlZCBvbiBjb29yZHMgXG4gICBhbmQgdGhlbiBkZWNpZGVzIHdoZXRoZXIgdG8gaGl0KCkgaWYgc2hpcCBpcyBpbiB0aGF0IHNwb3QsIHJlY29yZHMgaGl0cyBhbmQgbWlzc2VzLCBhbmQgcmVwb3J0cyBpZlxuICAgYWxsIGl0cyBzaGlwcyBoYXZlIGJlZW4gc3Vuay4gKi9cbmNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgLy8gQ29uc3RyYWludHMgZm9yIGdhbWUgYm9hcmQgKDEweDEwIGdyaWQsIHplcm8gYmFzZWQpXG4gIGNvbnN0IG1heEJvYXJkWCA9IDk7XG4gIGNvbnN0IG1heEJvYXJkWSA9IDk7XG5cbiAgY29uc3QgdGhpc0dhbWVib2FyZCA9IHtcbiAgICBzaGlwczogW10sXG4gICAgZGlyZWN0aW9uOiAxLFxuICAgIHJldHVyblVzZXJTaGlwczogbnVsbCxcbiAgICBhbGxPY2N1cGllZENlbGxzOiBbXSxcbiAgICBhZGRTaGlwOiBudWxsLFxuICAgIHJlY2VpdmVBdHRhY2s6IG51bGwsXG4gICAgY2FuQXR0YWNrOiB0cnVlLFxuICAgIG1pc3NlczogW10sXG4gICAgaGl0czogW10sXG4gICAgYWxsU3VuazogbnVsbCxcbiAgICBsb2dTdW5rOiBudWxsLFxuICAgIHJpdmFsQm9hcmQ6IG51bGwsXG4gICAgZ2V0IG1heEJvYXJkWCgpIHtcbiAgICAgIHJldHVybiBtYXhCb2FyZFg7XG4gICAgfSxcbiAgICBnZXQgbWF4Qm9hcmRZKCkge1xuICAgICAgcmV0dXJuIG1heEJvYXJkWTtcbiAgICB9LFxuICAgIGNhbnZhczogbnVsbCxcbiAgICBpc0FpOiBmYWxzZSxcbiAgICBnYW1lT3ZlcjogZmFsc2UsXG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHNoaXAgb2NjdXBpZWQgY2VsbCBjb29yZHNcbiAgY29uc3QgdmFsaWRhdGVTaGlwID0gKHNoaXApID0+IHtcbiAgICBpZiAoIXNoaXApIHJldHVybiBmYWxzZTtcbiAgICAvLyBGbGFnIGZvciBkZXRlY3RpbmcgaW52YWxpZCBwb3NpdGlvbiB2YWx1ZVxuICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgIC8vIENoZWNrIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHMgYXJlIGFsbCB3aXRoaW4gbWFwIGFuZCBub3QgYWxyZWFkeSBvY2N1cGllZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5vY2N1cGllZENlbGxzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAvLyBPbiB0aGUgbWFwP1xuICAgICAgaWYgKFxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gPj0gMCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gPD0gbWF4Qm9hcmRYICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXSA+PSAwICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVsxXSA8PSBtYXhCb2FyZFlcbiAgICAgICkge1xuICAgICAgICAvLyBEbyBub3RoaW5nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBDaGVjayBvY2N1cGllZCBjZWxsc1xuICAgICAgY29uc3QgaXNDZWxsT2NjdXBpZWQgPSB0aGlzR2FtZWJvYXJkLmFsbE9jY3VwaWVkQ2VsbHMuc29tZShcbiAgICAgICAgKGNlbGwpID0+XG4gICAgICAgICAgLy8gQ29vcmRzIGZvdW5kIGluIGFsbCBvY2N1cGllZCBjZWxscyBhbHJlYWR5XG4gICAgICAgICAgY2VsbFswXSA9PT0gc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdICYmXG4gICAgICAgICAgY2VsbFsxXSA9PT0gc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdXG4gICAgICApO1xuXG4gICAgICBpZiAoaXNDZWxsT2NjdXBpZWQpIHtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICBicmVhazsgLy8gQnJlYWsgb3V0IG9mIHRoZSBsb29wIGlmIG9jY3VwaWVkIGNlbGwgaXMgZm91bmRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCBhZGRzIG9jY3VwaWVkIGNlbGxzIG9mIHZhbGlkIGJvYXQgdG8gbGlzdFxuICBjb25zdCBhZGRDZWxsc1RvTGlzdCA9IChzaGlwKSA9PiB7XG4gICAgc2hpcC5vY2N1cGllZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIHRoaXNHYW1lYm9hcmQuYWxsT2NjdXBpZWRDZWxscy5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgYWRkaW5nIGEgc2hpcCBhdCBhIGdpdmVuIGNvb3JkcyBpbiBnaXZlbiBkaXJlY3Rpb24gaWYgc2hpcCB3aWxsIGZpdCBvbiBib2FyZFxuICB0aGlzR2FtZWJvYXJkLmFkZFNoaXAgPSAoXG4gICAgcG9zaXRpb24sXG4gICAgZGlyZWN0aW9uID0gdGhpc0dhbWVib2FyZC5kaXJlY3Rpb24sXG4gICAgc2hpcFR5cGVJbmRleCA9IHRoaXNHYW1lYm9hcmQuc2hpcHMubGVuZ3RoICsgMVxuICApID0+IHtcbiAgICAvLyBDcmVhdGUgdGhlIGRlc2lyZWQgc2hpcFxuICAgIGNvbnN0IG5ld1NoaXAgPSBTaGlwKHNoaXBUeXBlSW5kZXgsIHBvc2l0aW9uLCBkaXJlY3Rpb24pO1xuICAgIC8vIEFkZCBpdCB0byBzaGlwcyBpZiBpdCBoYXMgdmFsaWQgb2NjdXBpZWQgY2VsbHNcbiAgICBpZiAodmFsaWRhdGVTaGlwKG5ld1NoaXApKSB7XG4gICAgICBhZGRDZWxsc1RvTGlzdChuZXdTaGlwKTtcbiAgICAgIHRoaXNHYW1lYm9hcmQuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYWRkTWlzcyA9IChwb3NpdGlvbikgPT4ge1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgdGhpc0dhbWVib2FyZC5taXNzZXMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFkZEhpdCA9IChwb3NpdGlvbikgPT4ge1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgdGhpc0dhbWVib2FyZC5oaXRzLnB1c2gocG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlY2VpdmluZyBhbiBhdHRhY2sgZnJvbSBvcHBvbmVudFxuICB0aGlzR2FtZWJvYXJkLnJlY2VpdmVBdHRhY2sgPSAocG9zaXRpb24sIHNoaXBzID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVmFsaWRhdGUgcG9zaXRpb24gaXMgMiBpbiBhcnJheSBhbmQgc2hpcHMgaXMgYW4gYXJyYXksIGFuZCByaXZhbCBib2FyZCBjYW4gYXR0YWNrXG4gICAgICBpZiAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEVhY2ggc2hpcCBpbiBzaGlwc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gSWYgdGhlIHNoaXAgaXMgbm90IGZhbHN5LCBhbmQgb2NjdXBpZWRDZWxscyBwcm9wIGV4aXN0cyBhbmQgaXMgYW4gYXJyYXlcbiAgICAgICAgICAgIHNoaXBzW2ldICYmXG4gICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzICYmXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBvZiB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIC8vIElmIHRoYXQgY2VsbCBtYXRjaGVzIHRoZSBhdHRhY2sgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzW2pdWzBdID09PSBwb3NpdGlvblswXSAmJlxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMV0gPT09IHBvc2l0aW9uWzFdXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhhdCBzaGlwcyBoaXQgbWV0aG9kIGFuZCBicmVhayBvdXQgb2YgbG9vcFxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIGFkZEhpdChwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFkZE1pc3MocG9zaXRpb24pO1xuICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgLy8gTWV0aG9kIGZvciB0cnlpbmcgYWkgYXR0YWNrc1xuICB0aGlzR2FtZWJvYXJkLnRyeUFpQXR0YWNrID0gKCkgPT4ge1xuICAgIC8vIFJldHVybiBpZiBub3QgYWlcbiAgICBpZiAodGhpc0dhbWVib2FyZC5pc0FpID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIGFpQXR0YWNrKHRoaXNHYW1lYm9hcmQucml2YWxCb2FyZCk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3Igbm90XG4gIHRoaXNHYW1lYm9hcmQuYWxsU3VuayA9IChzaGlwQXJyYXkgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgaWYgKCFzaGlwQXJyYXkgfHwgIUFycmF5LmlzQXJyYXkoc2hpcEFycmF5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgc2hpcEFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rICYmICFzaGlwLmlzU3VuaygpKSBhbGxTdW5rID0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH07XG5cbiAgLy8gT2JqZWN0IGZvciB0cmFja2luZyBib2FyZCdzIHN1bmtlbiBzaGlwc1xuICBjb25zdCBzdW5rZW5TaGlwcyA9IHsgMTogZmFsc2UsIDI6IGZhbHNlLCAzOiBmYWxzZSwgNDogZmFsc2UsIDU6IGZhbHNlIH07XG5cbiAgLy8gTWV0aG9kIGZvciByZXBvcnRpbmcgc3Vua2VuIHNoaXBzXG4gIHRoaXNHYW1lYm9hcmQubG9nU3VuayA9ICgpID0+IHtcbiAgICBPYmplY3Qua2V5cyhzdW5rZW5TaGlwcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAoc3Vua2VuU2hpcHNba2V5XSA9PT0gZmFsc2UgJiYgdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS5pc1N1bmsoKSkge1xuICAgICAgICBjb25zdCBzaGlwID0gdGhpc0dhbWVib2FyZC5zaGlwc1trZXkgLSAxXS50eXBlO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzR2FtZWJvYXJkLmlzQWkgPyBcIkFJJ3NcIiA6IFwiVXNlcidzXCI7XG4gICAgICAgIGdhbWVMb2cuYXBwZW5kKFxuICAgICAgICAgIGA8c3BhbiBzdHlsZT1cImNvbG9yOiByZWRcIj4ke3BsYXllcn0gJHtzaGlwfSB3YXMgZGVzdHJveWVkITwvc3Bhbj5gXG4gICAgICAgICk7XG4gICAgICAgIHN1bmtlblNoaXBzW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB0aGlzR2FtZWJvYXJkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcblxuLyogRmFjdG9yeSB0aGF0IGNyZWF0ZXMgYW5kIHJldHVybnMgYSBwbGF5ZXIgb2JqZWN0IHRoYXQgY2FuIHRha2UgYSBzaG90IGF0IG9wcG9uZW50J3MgZ2FtZSBib2FyZCAqL1xuY29uc3QgUGxheWVyID0gKCkgPT4ge1xuICBsZXQgcHJpdmF0ZU5hbWUgPSBcIlwiO1xuICBjb25zdCB0aGlzUGxheWVyID0ge1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgcmV0dXJuIHByaXZhdGVOYW1lO1xuICAgIH0sXG4gICAgc2V0IG5hbWUobmV3TmFtZSkge1xuICAgICAgaWYgKG5ld05hbWUpIHtcbiAgICAgICAgcHJpdmF0ZU5hbWUgPSBuZXdOYW1lLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2UgcHJpdmF0ZU5hbWUgPSBcIlwiO1xuICAgIH0sXG4gICAgZ2FtZWJvYXJkOiBHYW1lYm9hcmQoKSxcbiAgICBzZW5kQXR0YWNrOiBudWxsLFxuICB9O1xuXG4gIC8vIEhlbHBlciBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhdHRhY2sgcG9zaXRpb24gaXMgb24gYm9hcmRcbiAgY29uc3QgdmFsaWRhdGVBdHRhY2sgPSAocG9zaXRpb24sIGdhbWVib2FyZCkgPT4ge1xuICAgIC8vIERvZXMgZ2FtZWJvYXJkIGV4aXN0IHdpdGggbWF4Qm9hcmRYL3kgcHJvcGVydGllcz9cbiAgICBpZiAoIWdhbWVib2FyZCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBJcyBwb3NpdGlvbiBjb25zdHJhaW5lZCB0byBtYXhib2FyZFgvWSBhbmQgYm90aCBhcmUgaW50cyBpbiBhbiBhcnJheT9cbiAgICBpZiAoXG4gICAgICBwb3NpdGlvbiAmJlxuICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICBwb3NpdGlvblswXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblswXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRYICYmXG4gICAgICBwb3NpdGlvblsxXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblsxXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRZXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3Igc2VuZGluZyBhdHRhY2sgdG8gcml2YWwgZ2FtZWJvYXJkXG4gIHRoaXNQbGF5ZXIuc2VuZEF0dGFjayA9IChwb3NpdGlvbiwgcGxheWVyQm9hcmQgPSB0aGlzUGxheWVyLmdhbWVib2FyZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUF0dGFjayhwb3NpdGlvbiwgcGxheWVyQm9hcmQpKSB7XG4gICAgICBwbGF5ZXJCb2FyZC5yaXZhbEJvYXJkLnJlY2VpdmVBdHRhY2socG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdGhpc1BsYXllcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIENvbnRhaW5zIHRoZSBuYW1lcyBmb3IgdGhlIHNoaXBzIGJhc2VkIG9uIGluZGV4XG5jb25zdCBzaGlwTmFtZXMgPSB7XG4gIDE6IFwiU2VudGluZWwgUHJvYmVcIixcbiAgMjogXCJBc3NhdWx0IFRpdGFuXCIsXG4gIDM6IFwiVmlwZXIgTWVjaFwiLFxuICA0OiBcIklyb24gR29saWF0aFwiLFxuICA1OiBcIkxldmlhdGhhblwiLFxufTtcblxuLy8gRmFjdG9yeSB0aGF0IGNhbiBjcmVhdGUgYW5kIHJldHVybiBvbmUgb2YgYSB2YXJpZXR5IG9mIHByZS1kZXRlcm1pbmVkIHNoaXBzLlxuY29uc3QgU2hpcCA9IChpbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbikgPT4ge1xuICAvLyBWYWxpZGF0ZSBpbmRleFxuICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4ID4gNSB8fCBpbmRleCA8IDEpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzaGlwIG9iamVjdCB0aGF0IHdpbGwgYmUgcmV0dXJuZWRcbiAgY29uc3QgdGhpc1NoaXAgPSB7XG4gICAgaW5kZXgsXG4gICAgc2l6ZTogbnVsbCxcbiAgICB0eXBlOiBudWxsLFxuICAgIGhpdHM6IDAsXG4gICAgaGl0OiBudWxsLFxuICAgIGlzU3VuazogbnVsbCxcbiAgICBvY2N1cGllZENlbGxzOiBbXSxcbiAgfTtcblxuICAvLyBTZXQgc2hpcCBzaXplXG4gIHN3aXRjaCAoaW5kZXgpIHtcbiAgICBjYXNlIDE6XG4gICAgICB0aGlzU2hpcC5zaXplID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSBpbmRleDtcbiAgfVxuXG4gIC8vIFNldCBzaGlwIG5hbWUgYmFzZWQgb24gaW5kZXhcbiAgdGhpc1NoaXAudHlwZSA9IHNoaXBOYW1lc1t0aGlzU2hpcC5pbmRleF07XG5cbiAgLy8gQWRkcyBhIGhpdCB0byB0aGUgc2hpcFxuICB0aGlzU2hpcC5oaXQgPSAoKSA9PiB7XG4gICAgdGhpc1NoaXAuaGl0cyArPSAxO1xuICB9O1xuXG4gIC8vIERldGVybWluZXMgaWYgc2hpcCBzdW5rIGlzIHRydWVcbiAgdGhpc1NoaXAuaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmICh0aGlzU2hpcC5oaXRzID49IHRoaXNTaGlwLnNpemUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBQbGFjZW1lbnQgZGlyZWN0aW9uIGlzIGVpdGhlciAwIGZvciBob3Jpem9udGFsIG9yIDEgZm9yIHZlcnRpY2FsXG4gIGxldCBwbGFjZW1lbnREaXJlY3Rpb25YID0gMDtcbiAgbGV0IHBsYWNlbWVudERpcmVjdGlvblkgPSAwO1xuICBpZiAoZGlyZWN0aW9uID09PSAwKSB7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDE7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDA7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAxKSB7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDA7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDE7XG4gIH1cblxuICAvLyBVc2UgcG9zaXRpb24gYW5kIGRpcmVjdGlvbiB0byBhZGQgb2NjdXBpZWQgY2VsbHMgY29vcmRzXG4gIGlmIChcbiAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAoZGlyZWN0aW9uID09PSAxIHx8IGRpcmVjdGlvbiA9PT0gMClcbiAgKSB7XG4gICAgLy8gRGl2aWRlIGxlbmd0aCBpbnRvIGhhbGYgYW5kIHJlbWFpbmRlclxuICAgIGNvbnN0IGhhbGZTaXplID0gTWF0aC5mbG9vcih0aGlzU2hpcC5zaXplIC8gMik7XG4gICAgY29uc3QgcmVtYWluZGVyU2l6ZSA9IHRoaXNTaGlwLnNpemUgJSAyO1xuICAgIC8vIEFkZCBmaXJzdCBoYWxmIG9mIGNlbGxzIHBsdXMgcmVtYWluZGVyIGluIG9uZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZTaXplICsgcmVtYWluZGVyU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXdDb29yZHMgPSBbXG4gICAgICAgIHBvc2l0aW9uWzBdICsgaSAqIHBsYWNlbWVudERpcmVjdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWzFdICsgaSAqIHBsYWNlbWVudERpcmVjdGlvblksXG4gICAgICBdO1xuICAgICAgdGhpc1NoaXAub2NjdXBpZWRDZWxscy5wdXNoKG5ld0Nvb3Jkcyk7XG4gICAgfVxuICAgIC8vIEFkZCBzZWNvbmQgaGFsZiBvZiBjZWxsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZlNpemU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV3Q29vcmRzID0gW1xuICAgICAgICBwb3NpdGlvblswXSAtIChpICsgMSkgKiBwbGFjZW1lbnREaXJlY3Rpb25YLFxuICAgICAgICBwb3NpdGlvblsxXSAtIChpICsgMSkgKiBwbGFjZW1lbnREaXJlY3Rpb25ZLFxuICAgICAgXTtcbiAgICAgIHRoaXNTaGlwLm9jY3VwaWVkQ2VsbHMucHVzaChuZXdDb29yZHMpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzU2hpcDtcbn07XG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZUxvZ1wiO1xuXG4vLyBUaGlzIGhlbHBlciB3aWxsIGxvb2sgYXQgY3VycmVudCBoaXRzIGFuZCBtaXNzZXMgYW5kIHRoZW4gcmV0dXJuIGFuIGF0dGFja1xuY29uc3QgYWlBdHRhY2sgPSAocml2YWxCb2FyZCkgPT4ge1xuICBjb25zdCBncmlkSGVpZ2h0ID0gMTA7XG4gIGNvbnN0IGdyaWRXaWR0aCA9IDEwO1xuICBjb25zdCBib2FyZCA9IHJpdmFsQm9hcmQ7XG4gIGNvbnN0IHsgaGl0cywgbWlzc2VzIH0gPSByaXZhbEJvYXJkO1xuICBsZXQgYXR0YWNrQ29vcmRzID0gW107XG5cbiAgLy8gTWV0aG9kIHRvIGRldGVybWluZSBpZiBjZWxsIGhhcyBhIGhpdCBvciBtaXNzIGluIGl0XG4gIGNvbnN0IGFscmVhZHlBdHRhY2tlZCA9IChjZWxsQ29vcmRpbmF0ZXMpID0+IHtcbiAgICBsZXQgYXR0YWNrZWQgPSBmYWxzZTtcblxuICAgIGhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBpZiAoY2VsbENvb3JkaW5hdGVzWzBdID09PSBoaXRbMF0gJiYgY2VsbENvb3JkaW5hdGVzWzFdID09PSBoaXRbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbWlzc2VzLmZvckVhY2goKG1pc3MpID0+IHtcbiAgICAgIGlmIChjZWxsQ29vcmRpbmF0ZXNbMF0gPT09IG1pc3NbMF0gJiYgY2VsbENvb3JkaW5hdGVzWzFdID09PSBtaXNzWzFdKSB7XG4gICAgICAgIGF0dGFja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBhdHRhY2tlZDtcbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJldHVybmluZyByYW5kb20gYXR0YWNrXG4gIGNvbnN0IHJhbmRvbUF0dGFjayA9ICgpID0+IHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZFdpZHRoKTtcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZEhlaWdodCk7XG4gICAgYXR0YWNrQ29vcmRzID0gW3gsIHldO1xuICB9O1xuXG4gIC8vIFRyeSBhIHJhbmRvbSBhdHRhY2sgdGhhdCBoYXMgbm90IGJlZW4geWV0IHRyaWVkXG4gIHJhbmRvbUF0dGFjaygpO1xuICB3aGlsZSAoYWxyZWFkeUF0dGFja2VkKGF0dGFja0Nvb3JkcykpIHtcbiAgICByYW5kb21BdHRhY2soKTtcbiAgfVxuXG4gIC8vIFRpbWVvdXQgdG8gc2ltdWxhdGUgXCJ0aGlua2luZ1wiIGFuZCB0byBtYWtlIGdhbWUgZmVlbCBiZXR0ZXJcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgLy8gU2VuZCBhdHRhY2sgdG8gcml2YWwgYm9hcmRcbiAgICByaXZhbEJvYXJkXG4gICAgICAucmVjZWl2ZUF0dGFjayhhdHRhY2tDb29yZHMpXG4gICAgICAvLyBUaGVuIGRyYXcgaGl0cyBvciBtaXNzZXNcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIERyYXcgdGhlIGhpdCB0byBib2FyZFxuICAgICAgICAgIHJpdmFsQm9hcmQuY2FudmFzLmRyYXdIaXQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAvLyBMb2cgdGhlIGhpdFxuICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfVxcbkF0dGFjayBoaXQhYCk7XG4gICAgICAgICAgLy8gTG9nIHN1bmsgdXNlciBzaGlwc1xuICAgICAgICAgIHJpdmFsQm9hcmQubG9nU3VuaygpO1xuICAgICAgICAgIC8vIENoZWNrIGlmIEFJIHdvblxuICAgICAgICAgIGlmIChyaXZhbEJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgLy8gTG9nIHJlc3VsdHNcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFxuICAgICAgICAgICAgICBcIkFsbCBVc2VyIHVuaXRzIGRlc3Ryb3llZC4gQUkgZG9taW5hbmNlIGlzIGFzc3VyZWQuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBTZXQgZ2FtZSBvdmVyIG9uIGJvYXJkc1xuICAgICAgICAgICAgYm9hcmQuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgYm9hcmQucml2YWxCb2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBEcmF3IHRoZSBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgcml2YWxCb2FyZC5jYW52YXMuZHJhd01pc3MoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAvLyBMb2cgdGhlIG1pc3NcbiAgICAgICAgICBnYW1lTG9nLmFwcGVuZChgQUkgYXR0YWNrcyBjZWxsOiAke2F0dGFja0Nvb3Jkc31cXG5BdHRhY2sgbWlzc2VkIWApO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGJvYXJkLmNhbkF0dGFjayA9IHRydWU7XG4gIH0sIDEwKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFpQXR0YWNrO1xuIiwiaW1wb3J0IGdyaWRDYW52YXMgZnJvbSBcIi4vZ3JpZENhbnZhc1wiO1xuXG4vKiBUaGlzIG1vZHVsZSBjcmVhdGVzIGNhbnZhcyBlbGVtZW50cyBhbmQgYWRkcyB0aGVtIHRvIHRoZSBhcHByb3ByaWF0ZSBcbiAgIHBsYWNlcyBpbiB0aGUgRE9NLiAqL1xuY29uc3QgY2FudmFzQWRkZXIgPSAodXNlckdhbWVib2FyZCwgYWlHYW1lYm9hcmQsIHdlYkludGVyZmFjZSkgPT4ge1xuICAvLyBSZXBsYWNlIHRoZSB0aHJlZSBncmlkIHBsYWNlaG9sZGVyIGVsZW1lbnRzIHdpdGggdGhlIHByb3BlciBjYW52YXNlc1xuICAvLyBSZWZzIHRvIERPTSBlbGVtZW50c1xuICBjb25zdCBwbGFjZW1lbnRQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWNhbnZhcy1waFwiKTtcbiAgY29uc3QgdXNlclBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyLWNhbnZhcy1waFwiKTtcbiAgY29uc3QgYWlQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktY2FudmFzLXBoXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgY2FudmFzZXNcblxuICBjb25zdCB1c2VyQ2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJ1c2VyXCIgfSxcbiAgICB1c2VyR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZVxuICApO1xuICBjb25zdCBhaUNhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwiYWlcIiB9LFxuICAgIGFpR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZVxuICApO1xuICBjb25zdCBwbGFjZW1lbnRDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcInBsYWNlbWVudFwiIH0sXG4gICAgdXNlckdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2UsXG4gICAgdXNlckNhbnZhc1xuICApO1xuXG4gIC8vIFJlcGxhY2UgdGhlIHBsYWNlIGhvbGRlcnNcbiAgcGxhY2VtZW50UEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGxhY2VtZW50Q2FudmFzLCBwbGFjZW1lbnRQSCk7XG4gIHVzZXJQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1c2VyQ2FudmFzLCB1c2VyUEgpO1xuICBhaVBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGFpQ2FudmFzLCBhaVBIKTtcblxuICAvLyBSZXR1cm4gdGhlIGNhbnZhc2VzXG4gIHJldHVybiB7IHBsYWNlbWVudENhbnZhcywgdXNlckNhbnZhcywgYWlDYW52YXMgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNhbnZhc0FkZGVyO1xuIiwiLy8gVGhpcyBtb2R1bGUgYWxsb3dzIHdyaXRpbmcgdG8gdGhlIGdhbWUgbG9nIHRleHRcbmltcG9ydCBnYW1lTG9nIGZyb20gXCIuLi9tb2R1bGVzL2dhbWVMb2dcIjtcblxuY29uc3QgY3JlYXRlQ2FudmFzID0gKFxuICBzaXplWCxcbiAgc2l6ZVksXG4gIG9wdGlvbnMsXG4gIGdhbWVib2FyZCxcbiAgd2ViSW50ZXJmYWNlLFxuICB1c2VyQ2FudmFzXG4pID0+IHtcbiAgLy8gI3JlZ2lvbiBSZWZlcmVuY2VzXG4gIC8vIFNoaXBzIGFycmF5XG4gIGNvbnN0IHsgc2hpcHMgfSA9IGdhbWVib2FyZDtcblxuICBsZXQgdXNlckJvYXJkQ2FudmFzID0gbnVsbDtcbiAgaWYgKHVzZXJDYW52YXMpIHtcbiAgICBbdXNlckJvYXJkQ2FudmFzXSA9IHVzZXJDYW52YXMuY2hpbGROb2RlcztcbiAgfVxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIFNldCB1cCBiYXNpYyBlbGVtZW50IHByb3BlcnRpZXNcbiAgLy8gU2V0IHRoZSBncmlkIGhlaWdodCBhbmQgd2lkdGggYW5kIGFkZCByZWYgdG8gY3VycmVudCBjZWxsXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGxldCBjdXJyZW50Q2VsbCA9IG51bGw7XG5cbiAgLy8gQ3JlYXRlIHBhcmVudCBkaXYgdGhhdCBob2xkcyB0aGUgY2FudmFzZXMuIFRoaXMgaXMgdGhlIGVsZW1lbnQgcmV0dXJuZWQuXG4gIGNvbnN0IGNhbnZhc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY2FudmFzLWNvbnRhaW5lclwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGJvYXJkIGNhbnZhcyBlbGVtZW50IHRvIHNlcnZlIGFzIHRoZSBnYW1lYm9hcmQgYmFzZVxuICAvLyBTdGF0aWMgb3IgcmFyZWx5IHJlbmRlcmVkIHRoaW5ncyBzaG91bGQgZ28gaGVyZVxuICBjb25zdCBib2FyZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChib2FyZENhbnZhcyk7XG4gIGJvYXJkQ2FudmFzLndpZHRoID0gc2l6ZVg7XG4gIGJvYXJkQ2FudmFzLmhlaWdodCA9IHNpemVZO1xuICBjb25zdCBib2FyZEN0eCA9IGJvYXJkQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIG92ZXJsYXkgY2FudmFzIGZvciByZW5kZXJpbmcgc2hpcCBwbGFjZW1lbnQgYW5kIGF0dGFjayBzZWxlY3Rpb25cbiAgY29uc3Qgb3ZlcmxheUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChvdmVybGF5Q2FudmFzKTtcbiAgb3ZlcmxheUNhbnZhcy53aWR0aCA9IHNpemVYO1xuICBvdmVybGF5Q2FudmFzLmhlaWdodCA9IHNpemVZO1xuICBjb25zdCBvdmVybGF5Q3R4ID0gb3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gU2V0IHRoZSBcImNlbGwgc2l6ZVwiIGZvciB0aGUgZ3JpZCByZXByZXNlbnRlZCBieSB0aGUgY2FudmFzXG4gIGNvbnN0IGNlbGxTaXplWCA9IGJvYXJkQ2FudmFzLndpZHRoIC8gZ3JpZFdpZHRoOyAvLyBNb2R1bGUgY29uc3RcbiAgY29uc3QgY2VsbFNpemVZID0gYm9hcmRDYW52YXMuaGVpZ2h0IC8gZ3JpZEhlaWdodDsgLy8gTW9kdWxlIGNvbnN0XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gR2VuZXJhbCBoZWxwZXIgbWV0aG9kc1xuICAvLyBNZXRob2QgdGhhdCBnZXRzIHRoZSBtb3VzZSBwb3NpdGlvbiBiYXNlZCBvbiB3aGF0IGNlbGwgaXQgaXMgb3ZlclxuICBjb25zdCBnZXRNb3VzZUNlbGwgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gYm9hcmRDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCBjZWxsWCA9IE1hdGguZmxvb3IobW91c2VYIC8gY2VsbFNpemVYKTtcbiAgICBjb25zdCBjZWxsWSA9IE1hdGguZmxvb3IobW91c2VZIC8gY2VsbFNpemVZKTtcblxuICAgIHJldHVybiBbY2VsbFgsIGNlbGxZXTtcbiAgfTtcblxuICAvLyBNZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGNlbGwgaGFzIGEgaGl0IG9yIG1pc3MgaW4gaXRcbiAgY29uc3QgYWxyZWFkeUF0dGFja2VkID0gKGNlbGxDb29yZGluYXRlcykgPT4ge1xuICAgIGxldCBhdHRhY2tlZCA9IGZhbHNlO1xuICAgIGdhbWVib2FyZC5oaXRzLmZvckVhY2goKGhpdCkgPT4ge1xuICAgICAgaWYgKGNlbGxDb29yZGluYXRlc1swXSA9PT0gaGl0WzBdICYmIGNlbGxDb29yZGluYXRlc1sxXSA9PT0gaGl0WzFdKSB7XG4gICAgICAgIGF0dGFja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGdhbWVib2FyZC5taXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xuICAgICAgaWYgKGNlbGxDb29yZGluYXRlc1swXSA9PT0gbWlzc1swXSAmJiBjZWxsQ29vcmRpbmF0ZXNbMV0gPT09IG1pc3NbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF0dGFja2VkO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIE1ldGhvZHMgZm9yIGRyYXdpbmcgdG8gY2FudmFzZXNcbiAgLy8gTWV0aG9kIGZvciBkcmF3aW5nIHRoZSBncmlkIGxpbmVzXG4gIGNvbnN0IGRyYXdMaW5lcyA9IChjb250ZXh0KSA9PiB7XG4gICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgY29uc3QgZ3JpZFNpemUgPSBNYXRoLm1pbihzaXplWCwgc2l6ZVkpIC8gMTA7XG4gICAgY29uc3QgbGluZUNvbG9yID0gXCJibGFja1wiO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBsaW5lQ29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuXG4gICAgLy8gRHJhdyB2ZXJ0aWNhbCBsaW5lc1xuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IHNpemVYOyB4ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICBjb250ZXh0LmxpbmVUbyh4LCBzaXplWSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIC8vIERyYXcgaG9yaXpvbnRhbCBsaW5lc1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IHNpemVZOyB5ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhzaXplWCwgeSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBEcmF3cyB0aGUgaGlnaGxpZ2h0ZWQgcGxhY2VtZW50IGNlbGxzIHRvIHRoZSBvdmVybGF5IGNhbnZhc1xuICBjb25zdCBoaWdobGlnaHRQbGFjZW1lbnRDZWxscyA9IChcbiAgICBjZWxsQ29vcmRpbmF0ZXMsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVksXG4gICAgc2hpcHNDb3VudCA9IHNoaXBzLmxlbmd0aCxcbiAgICBkaXJlY3Rpb24gPSBnYW1lYm9hcmQuZGlyZWN0aW9uXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gb3ZlcmxheVxuICAgIGZ1bmN0aW9uIGRyYXdDZWxsKHBvc1gsIHBvc1kpIHtcbiAgICAgIG92ZXJsYXlDdHguZmlsbFJlY3QocG9zWCAqIGNlbGxYLCBwb3NZICogY2VsbFksIGNlbGxYLCBjZWxsWSk7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIGN1cnJlbnQgc2hpcCBsZW5ndGggKGJhc2VkIG9uIGRlZmF1bHQgYmF0dGxlc2hpcCBydWxlcyBzaXplcywgc21hbGxlc3QgdG8gYmlnZ2VzdClcbiAgICBsZXQgZHJhd0xlbmd0aDtcbiAgICBpZiAoc2hpcHNDb3VudCA9PT0gMCkgZHJhd0xlbmd0aCA9IDI7XG4gICAgZWxzZSBpZiAoc2hpcHNDb3VudCA9PT0gMSB8fCBzaGlwc0NvdW50ID09PSAyKSBkcmF3TGVuZ3RoID0gMztcbiAgICBlbHNlIGRyYXdMZW5ndGggPSBzaGlwc0NvdW50ICsgMTtcblxuICAgIC8vIERldGVybWluZSBkaXJlY3Rpb24gdG8gZHJhdyBpblxuICAgIGxldCBkaXJlY3Rpb25YID0gMDtcbiAgICBsZXQgZGlyZWN0aW9uWSA9IDA7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAxKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMTtcbiAgICAgIGRpcmVjdGlvblggPSAwO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMDtcbiAgICAgIGRpcmVjdGlvblggPSAxO1xuICAgIH1cblxuICAgIC8vIERpdmlkZSB0aGUgZHJhd0xlbmdodCBpbiBoYWxmIHdpdGggcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZkRyYXdMZW5ndGggPSBNYXRoLmZsb29yKGRyYXdMZW5ndGggLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJMZW5ndGggPSBkcmF3TGVuZ3RoICUgMjtcblxuICAgIC8vIElmIGRyYXdpbmcgb2ZmIGNhbnZhcyBtYWtlIGNvbG9yIHJlZFxuICAgIC8vIENhbGN1bGF0ZSBtYXhpbXVtIGFuZCBtaW5pbXVtIGNvb3JkaW5hdGVzXG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVggPVxuICAgICAgY2VsbENvb3JkaW5hdGVzWzBdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25YO1xuICAgIGNvbnN0IG1heENvb3JkaW5hdGVZID1cbiAgICAgIGNlbGxDb29yZGluYXRlc1sxXSArIChoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aCAtIDEpICogZGlyZWN0aW9uWTtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWCA9IGNlbGxDb29yZGluYXRlc1swXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWDtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWSA9IGNlbGxDb29yZGluYXRlc1sxXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWTtcblxuICAgIC8vIEFuZCB0cmFuc2xhdGUgaW50byBhbiBhY3R1YWwgY2FudmFzIHBvc2l0aW9uXG4gICAgY29uc3QgbWF4WCA9IG1heENvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWF4WSA9IG1heENvb3JkaW5hdGVZICogY2VsbFk7XG4gICAgY29uc3QgbWluWCA9IG1pbkNvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWluWSA9IG1pbkNvb3JkaW5hdGVZICogY2VsbFk7XG5cbiAgICAvLyBDaGVjayBpZiBhbnkgY2VsbHMgYXJlIG91dHNpZGUgdGhlIGNhbnZhcyBib3VuZGFyaWVzXG4gICAgY29uc3QgaXNPdXRPZkJvdW5kcyA9XG4gICAgICBtYXhYID49IG92ZXJsYXlDYW52YXMud2lkdGggfHxcbiAgICAgIG1heFkgPj0gb3ZlcmxheUNhbnZhcy5oZWlnaHQgfHxcbiAgICAgIG1pblggPCAwIHx8XG4gICAgICBtaW5ZIDwgMDtcblxuICAgIC8vIFNldCB0aGUgZmlsbCBjb2xvciBiYXNlZCBvbiB3aGV0aGVyIGNlbGxzIGFyZSBkcmF3biBvZmYgY2FudmFzXG4gICAgb3ZlcmxheUN0eC5maWxsU3R5bGUgPSBpc091dE9mQm91bmRzID8gXCJyZWRcIiA6IFwiYmx1ZVwiO1xuXG4gICAgLy8gRHJhdyB0aGUgbW91c2VkIG92ZXIgY2VsbCBmcm9tIHBhc3NlZCBjb29yZHNcbiAgICBkcmF3Q2VsbChjZWxsQ29vcmRpbmF0ZXNbMF0sIGNlbGxDb29yZGluYXRlc1sxXSk7XG5cbiAgICAvLyBEcmF3IHRoZSBmaXJzdCBoYWxmIG9mIGNlbGxzIGFuZCByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV4dFggPSBjZWxsQ29vcmRpbmF0ZXNbMF0gKyBpICogZGlyZWN0aW9uWDtcbiAgICAgIGNvbnN0IG5leHRZID0gY2VsbENvb3JkaW5hdGVzWzFdICsgaSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cblxuICAgIC8vIERyYXcgdGhlIHJlbWFpbmluZyBoYWxmXG4gICAgLy8gRHJhdyB0aGUgcmVtYWluaW5nIGNlbGxzIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZEcmF3TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5leHRYID0gY2VsbENvb3JkaW5hdGVzWzBdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblg7XG4gICAgICBjb25zdCBuZXh0WSA9IGNlbGxDb29yZGluYXRlc1sxXSAtIChpICsgMSkgKiBkaXJlY3Rpb25ZO1xuICAgICAgZHJhd0NlbGwobmV4dFgsIG5leHRZKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRHJhdyBoaWdobGlnaHRlZCBhdHRhY2sgY2VsbFxuICBjb25zdCBoaWdobGlnaHRBdHRhY2sgPSAoXG4gICAgY2VsbENvb3JkaW5hdGVzLFxuICAgIGNlbGxYID0gY2VsbFNpemVYLFxuICAgIGNlbGxZID0gY2VsbFNpemVZXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICBvdmVybGF5Q3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG5cbiAgICAvLyBDaGVjayBpZiBjZWxsIGNvb3JkcyBpbiBnYW1lYm9hcmQgaGl0cyBvciBtaXNzZXNcbiAgICBpZiAoYWxyZWFkeUF0dGFja2VkKGNlbGxDb29yZGluYXRlcykpIHJldHVybjtcblxuICAgIC8vIEhpZ2hsaWdodCB0aGUgY2VsbFxuICAgIG92ZXJsYXlDdHguZmlsbFJlY3QoXG4gICAgICBjZWxsQ29vcmRpbmF0ZXNbMF0gKiBjZWxsWCxcbiAgICAgIGNlbGxDb29yZGluYXRlc1sxXSAqIGNlbGxZLFxuICAgICAgY2VsbFgsXG4gICAgICBjZWxsWVxuICAgICk7XG4gIH07XG5cbiAgLy8gQWRkIG1ldGhvZHMgb24gdGhlIGNvbnRhaW5lciBmb3IgZHJhd2luZyBoaXRzIG9yIG1pc3NlcyBmb3IgZWFzZSBvZiB1c2UgZWxzZXdoZXJlXG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3SGl0ID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKGNvb3JkaW5hdGVzLCAxKTtcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdNaXNzID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKGNvb3JkaW5hdGVzLCAwKTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBc3NpZ24gc3RhdGljIGJlaGF2aW9yc1xuICAvLyBib2FyZENhbnZhc1xuICAvLyBEcmF3IHNoaXBzIHRvIGJvYXJkIGNhbnZhcyB1c2luZyBzaGlwc0NvcHlcbiAgYm9hcmRDYW52YXMuZHJhd1NoaXBzID0gKFxuICAgIHNoaXBzVG9EcmF3ID0gc2hpcHMsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVlcbiAgKSA9PiB7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gYm9hcmRcbiAgICBmdW5jdGlvbiBkcmF3Q2VsbChwb3NYLCBwb3NZKSB7XG4gICAgICBib2FyZEN0eC5maWxsUmVjdChwb3NYICogY2VsbFgsIHBvc1kgKiBjZWxsWSwgY2VsbFgsIGNlbGxZKTtcbiAgICB9XG5cbiAgICBzaGlwc1RvRHJhdy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBkcmF3Q2VsbChjZWxsWzBdLCBjZWxsWzFdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIERyYXcgaGl0IG9yIHRvIGJvYXJkIGNhbnZhc1xuICBib2FyZENhbnZhcy5kcmF3SGl0TWlzcyA9IChcbiAgICBjZWxsQ29vcmRpbmF0ZXMsXG4gICAgdHlwZSA9IDAsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVlcbiAgKSA9PiB7XG4gICAgLy8gU2V0IHByb3BlciBmaWxsIGNvbG9yXG4gICAgYm9hcmRDdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgIGlmICh0eXBlID09PSAxKSBib2FyZEN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xuICAgIC8vIFNldCBhIHJhZGl1cyBmb3IgY2lyY2xlIHRvIGRyYXcgZm9yIFwicGVnXCIgdGhhdCB3aWxsIGFsd2F5cyBmaXQgaW4gY2VsbFxuICAgIGNvbnN0IHJhZGl1cyA9IGNlbGxYID4gY2VsbFkgPyBjZWxsWSAvIDIgOiBjZWxsWCAvIDI7XG4gICAgLy8gRHJhdyB0aGUgY2lyY2xlXG4gICAgYm9hcmRDdHguYmVnaW5QYXRoKCk7XG4gICAgYm9hcmRDdHguYXJjKFxuICAgICAgY2VsbENvb3JkaW5hdGVzWzBdICogY2VsbFggKyBjZWxsWCAvIDIsXG4gICAgICBjZWxsQ29vcmRpbmF0ZXNbMV0gKiBjZWxsWSArIGNlbGxZIC8gMixcbiAgICAgIHJhZGl1cyxcbiAgICAgIDAsXG4gICAgICAyICogTWF0aC5QSVxuICAgICk7XG4gICAgYm9hcmRDdHguc3Ryb2tlKCk7XG4gICAgYm9hcmRDdHguZmlsbCgpO1xuICB9O1xuXG4gIC8vIG92ZXJsYXlDYW52YXNcbiAgLy8gRm9yd2FyZCBjbGlja3MgdG8gYm9hcmQgY2FudmFzXG4gIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudChcImNsaWNrXCIsIHtcbiAgICAgIGJ1YmJsZXM6IGV2ZW50LmJ1YmJsZXMsXG4gICAgICBjYW5jZWxhYmxlOiBldmVudC5jYW5jZWxhYmxlLFxuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgfSk7XG4gICAgYm9hcmRDYW52YXMuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG4gIH07XG5cbiAgLy8gTW91c2VsZWF2ZVxuICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTGVhdmUgPSAoKSA9PiB7XG4gICAgb3ZlcmxheUN0eC5jbGVhclJlY3QoMCwgMCwgb3ZlcmxheUNhbnZhcy53aWR0aCwgb3ZlcmxheUNhbnZhcy5oZWlnaHQpO1xuICAgIGN1cnJlbnRDZWxsID0gbnVsbDtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBc3NpZ24gYmVoYXZpb3IgdXNpbmcgYnJvd3NlciBldmVudCBoYW5kbGVycyBiYXNlZCBvbiBvcHRpb25zXG4gIC8vIFBsYWNlbWVudCBpcyB1c2VkIGZvciBwbGFjaW5nIHNoaXBzXG4gIGlmIChvcHRpb25zLnR5cGUgPT09IFwicGxhY2VtZW50XCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gY2FudmFzQ29udGFpbmVyIHRvIGRlbm90ZSBwbGFjZW1lbnQgY29udGFpbmVyXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBTZXQgdXAgb3ZlcmxheUNhbnZhcyB3aXRoIGJlaGF2aW9ycyB1bmlxdWUgdG8gcGxhY2VtZW50XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIEdldCB3aGF0IGNlbGwgdGhlIG1vdXNlIGlzIG92ZXJcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICAvLyBJZiB0aGUgJ29sZCcgY3VycmVudENlbGwgaXMgZXF1YWwgdG8gdGhlIG1vdXNlQ2VsbCBiZWluZyBldmFsdWF0ZWRcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBjdXJyZW50Q2VsbCAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzBdID09PSBtb3VzZUNlbGxbMF0gJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFsxXSA9PT0gbW91c2VDZWxsWzFdXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICAvLyBSZW5kZXIgdGhlIGNoYW5nZXNcbiAgICAgICAgaGlnaGxpZ2h0UGxhY2VtZW50Q2VsbHMobW91c2VDZWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSBjdXJyZW50Q2VsbCB0byB0aGUgbW91c2VDZWxsIGZvciBmdXR1cmUgY29tcGFyaXNvbnNcbiAgICAgIGN1cnJlbnRDZWxsID0gbW91c2VDZWxsO1xuICAgIH07XG5cbiAgICAvLyBCcm93c2VyIGNsaWNrIGV2ZW50c1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG5cbiAgICAgIC8vIFRyeSBwbGFjZW1lbnRcbiAgICAgIGdhbWVib2FyZC5hZGRTaGlwKG1vdXNlQ2VsbCk7XG4gICAgICBib2FyZENhbnZhcy5kcmF3U2hpcHMoKTtcbiAgICAgIHVzZXJCb2FyZENhbnZhcy5kcmF3U2hpcHMoKTtcbiAgICAgIHdlYkludGVyZmFjZS50cnlTdGFydEdhbWUoKTtcbiAgICB9O1xuICB9XG4gIC8vIFVzZXIgY2FudmFzIGZvciBkaXNwbGF5aW5nIGFpIGhpdHMgYW5kIG1pc3NlcyBhZ2FpbnN0IHVzZXIgYW5kIHVzZXIgc2hpcCBwbGFjZW1lbnRzXG4gIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gZGVub3RlIHVzZXIgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ1c2VyLWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gSGFuZGxlIGNhbnZhcyBtb3VzZSBtb3ZlXG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKCkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH07XG4gIH1cbiAgLy8gQUkgY2FudmFzIGZvciBkaXNwbGF5aW5nIHVzZXIgaGl0cyBhbmQgbWlzc2VzIGFnYWluc3QgYWksIGFuZCBhaSBzaGlwIHBsYWNlbWVudHMgaWYgdXNlciBsb3Nlc1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09IFwiYWlcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBkZW5vdGUgYWkgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhaS1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIEhhbmRsZSBjYW52YXMgbW91c2UgbW92ZVxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBHZXQgd2hhdCBjZWxsIHRoZSBtb3VzZSBpcyBvdmVyXG4gICAgICBjb25zdCBtb3VzZUNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuXG4gICAgICAvLyBJZiB0aGUgJ29sZCcgY3VycmVudENlbGwgaXMgZXF1YWwgdG8gdGhlIG1vdXNlQ2VsbCBiZWluZyBldmFsdWF0ZWRcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBjdXJyZW50Q2VsbCAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzBdID09PSBtb3VzZUNlbGxbMF0gJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFsxXSA9PT0gbW91c2VDZWxsWzFdXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICAgICAgaGlnaGxpZ2h0QXR0YWNrKG1vdXNlQ2VsbCk7XG4gICAgICB9XG4gICAgICAvLyBEZW5vdGUgaWYgaXQgaXMgYSB2YWxpZCBhdHRhY2sgb3Igbm90IC0gTllJXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBSZWYgdG8gZ2FtZWJvYXJkXG4gICAgICBjb25zdCBhaUJvYXJkID0gZ2FtZWJvYXJkO1xuICAgICAgLy8gUmV0dXJuIGlmIGdhbWVib2FyZCBjYW4ndCBhdHRhY2tcbiAgICAgIGlmIChhaUJvYXJkLnJpdmFsQm9hcmQuY2FuQXR0YWNrID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNlbGxcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICAvLyBUcnkgYXR0YWNrIGF0IGN1cnJlbnQgY2VsbFxuICAgICAgaWYgKGFscmVhZHlBdHRhY2tlZChtb3VzZUNlbGwpKSB7XG4gICAgICAgIC8vIEJhZCB0aGluZy4gRXJyb3Igc291bmQgbWF5YmUuXG4gICAgICB9IGVsc2UgaWYgKGdhbWVib2FyZC5nYW1lT3ZlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgLy8gU2V0IGdhbWVib2FyZCB0byBub3QgYmUgYWJsZSB0byBhdHRhY2tcbiAgICAgICAgYWlCb2FyZC5yaXZhbEJvYXJkLmNhbkF0dGFjayA9IGZhbHNlO1xuICAgICAgICAvLyBMb2cgdGhlIHNlbnQgYXR0YWNrXG4gICAgICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICAgICAgZ2FtZUxvZy5hcHBlbmQoYFVzZXIgYXR0YWNrcyBjZWxsOiAke21vdXNlQ2VsbH1gKTtcbiAgICAgICAgLy8gU2VuZCB0aGUgYXR0YWNrXG4gICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKG1vdXNlQ2VsbCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgLy8gQXR0YWNrIGhpdFxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIERyYXcgaGl0IHRvIGJvYXJkXG4gICAgICAgICAgICBib2FyZENhbnZhcy5kcmF3SGl0TWlzcyhtb3VzZUNlbGwsIDEpO1xuICAgICAgICAgICAgLy8gTG9nIGhpdFxuICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBdHRhY2sgaGl0IVwiKTtcbiAgICAgICAgICAgIC8vIExvZyBzdW5rZW4gc2hpcHNcbiAgICAgICAgICAgIGFpQm9hcmQubG9nU3VuaygpO1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcGxheWVyIHdvblxuICAgICAgICAgICAgaWYgKGFpQm9hcmQuYWxsU3VuaygpKSB7XG4gICAgICAgICAgICAgIC8vIExvZyByZXN1bHRzXG4gICAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFxuICAgICAgICAgICAgICAgIFwiQWxsIEFJIHVuaXRzIGRlc3Ryb3llZC4gSHVtYW5pdHkgc3Vydml2ZXMgYW5vdGhlciBkYXkuLi5cIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAvLyBTZXQgZ2FtZW92ZXIgb24gYm9hcmRzXG4gICAgICAgICAgICAgIGFpQm9hcmQuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICBhaUJvYXJkLnJpdmFsQm9hcmQuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gTG9nIHRoZSBhaSBcInRoaW5raW5nXCIgYWJvdXQgaXRzIGF0dGFja1xuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgICAvLyBIYXZlIHRoZSBhaSBhdHRhY2sgaWYgbm90IGdhbWVPdmVyXG4gICAgICAgICAgICAgIGdhbWVib2FyZC50cnlBaUF0dGFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gRHJhdyBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgICBib2FyZENhbnZhcy5kcmF3SGl0TWlzcyhtb3VzZUNlbGwsIDApO1xuICAgICAgICAgICAgLy8gTG9nIG1pc3NcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIG1pc3NlZCFcIik7XG4gICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgZ2FtZWJvYXJkLnRyeUFpQXR0YWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIG92ZXJsYXkgdG8gc2hvdyBoaXQvbWlzcyB1bmRlciBjdXJyZW50IGhpZ2hpZ2h0XG4gICAgICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBTdWJzY3JpYmUgdG8gYnJvd3NlciBldmVudHNcbiAgLy8gYm9hcmQgY2xpY2tcbiAgYm9hcmRDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrKGUpKTtcbiAgLy8gb3ZlcmxheSBjbGlja1xuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlQ2xpY2soZSlcbiAgKTtcbiAgLy8gb3ZlcmxheSBtb3VzZW1vdmVcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlKGUpXG4gICk7XG4gIC8vIG92ZXJsYXkgbW91c2VsZWF2ZVxuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUxlYXZlKClcbiAgKTtcblxuICAvLyBEcmF3IGluaXRpYWwgYm9hcmQgbGluZXNcbiAgZHJhd0xpbmVzKGJvYXJkQ3R4KTtcblxuICAvLyBSZXR1cm4gY29tcGxldGVkIGNhbnZhc2VzXG4gIHJldHVybiBjYW52YXNDb250YWluZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDYW52YXM7XG4iLCIvLyBUaGlzIGhlbHBlciB3aWxsIGF0dGVtcHQgdG8gYWRkIHNoaXBzIHRvIHRoZSBhaSBnYW1lYm9hcmQgaW4gYSB2YXJpZXR5IG9mIHdheXMgZm9yIHZhcnlpbmcgZGlmZmljdWx0eVxuY29uc3QgcGxhY2VBaVNoaXBzID0gKHBhc3NlZERpZmYsIGFpR2FtZWJvYXJkKSA9PiB7XG4gIC8vIEdyaWQgc2l6ZVxuICBjb25zdCBncmlkSGVpZ2h0ID0gMTA7XG4gIGNvbnN0IGdyaWRXaWR0aCA9IDEwO1xuXG4gIC8vIENvcHkgb2YgdGhlIGFpIHNoaXBzIGFycmF5IGFuZCBtZXRob2QgdG8gZ2V0IGl0XG4gIGNvbnN0IGFpU2hpcHMgPSBhaUdhbWVib2FyZC5zaGlwcztcblxuICAvLyBQbGFjZSBhIHNoaXAgcmFuZG9tbHlcbiAgY29uc3QgcGxhY2VSYW5kb21TaGlwID0gKCkgPT4ge1xuICAgIC8vIEdldCByYW5kb20gcGxhY2VtZW50XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRXaWR0aCk7XG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRIZWlnaHQpO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gICAgLy8gVHJ5IHRoZSBwbGFjZW1lbnRcblxuICAgIGFpR2FtZWJvYXJkLmFkZFNoaXAoW3gsIHldLCBkaXJlY3Rpb24pO1xuICB9O1xuICAvLyBQbGFjZSBhIHNoaXAgYWxvbmcgZWRnZXMgdW50aWwgb25lIHN1Y2Nlc3NmdWxseSBwbGFjZWRcbiAgLy8gUGxhY2UgYSBzaGlwIGJhc2VkIG9uIHF1YWRyYW50XG5cbiAgLy8gV2FpdHMgZm9yIGEgYWlTaGlwc1NldCBldmVudFxuICBmdW5jdGlvbiB3YWl0Rm9yQWlTaGlwc1NldCgpIHtcbiAgICAvLyBSZWZhY3RvclxuICB9XG5cbiAgLy8gQ29tYmluZSBwbGFjZW1lbnQgdGFjdGljcyB0byBjcmVhdGUgdmFyeWluZyBkaWZmaWN1bHRpZXNcbiAgY29uc3QgcGxhY2VTaGlwcyA9IGFzeW5jIChkaWZmaWN1bHR5KSA9PiB7XG4gICAgLy8gVG90YWxseSByYW5kb20gcGFsY2VtZW50XG4gICAgaWYgKGRpZmZpY3VsdHkgPT09IDEgJiYgYWlTaGlwcy5sZW5ndGggPD0gNCkge1xuICAgICAgLy8gVHJ5IHJhbmRvbSBwbGFjZW1lbnRcbiAgICAgIHBsYWNlUmFuZG9tU2hpcCgpO1xuXG4gICAgICAvLyBXYWl0IGZvciByZXR1cm5BaVNoaXBzXG4gICAgICBhd2FpdCB3YWl0Rm9yQWlTaGlwc1NldCgpO1xuICAgICAgLy8gUmVjdXJzaXZlbHkgY2FsbCBmbiB1bnRpbCBzaGlwcyBwbGFjZWRcbiAgICAgIHBsYWNlU2hpcHMoZGlmZmljdWx0eSk7XG4gICAgfVxuICB9O1xuXG4gIHBsYWNlU2hpcHMocGFzc2VkRGlmZik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwbGFjZUFpU2hpcHM7XG4iLCJjb25zdCBnYW1lTG9nID0gKCgpID0+IHtcbiAgLy8gUmVmIHRvIGxvZyB0ZXh0XG4gIGNvbnN0IGxvZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZy10ZXh0XCIpO1xuXG4gIC8vIEVyYXNlIHRoZSBsb2cgdGV4dFxuICBjb25zdCBlcmFzZSA9ICgpID0+IHtcbiAgICBsb2dUZXh0LnRleHRDb250ZW50ID0gXCJcIjtcbiAgfTtcblxuICAvLyBBZGQgdG8gbG9nIHRleHRcbiAgY29uc3QgYXBwZW5kID0gKHN0cmluZ1RvQXBwZW5kKSA9PiB7XG4gICAgaWYgKHN0cmluZ1RvQXBwZW5kKSB7XG4gICAgICBsb2dUZXh0LmlubmVySFRNTCArPSBgXFxuJHtzdHJpbmdUb0FwcGVuZC50b1N0cmluZygpfWA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7IGVyYXNlLCBhcHBlbmQgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVMb2c7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi9mYWN0b3JpZXMvUGxheWVyXCI7XG5pbXBvcnQgY2FudmFzQWRkZXIgZnJvbSBcIi4uL2hlbHBlcnMvY2FudmFzQWRkZXJcIjtcbmltcG9ydCB3ZWJJbnRlcmZhY2UgZnJvbSBcIi4vd2ViSW50ZXJmYWNlXCI7XG5pbXBvcnQgcGxhY2VBaVNoaXBzIGZyb20gXCIuLi9oZWxwZXJzL3BsYWNlQWlTaGlwc1wiO1xuXG4vKiBUaGlzIG1vZHVsZSBob2xkcyB0aGUgZ2FtZSBsb29wIGxvZ2ljIGZvciBzdGFydGluZyBnYW1lcywgY3JlYXRpbmdcbiAgIHJlcXVpcmVkIG9iamVjdHMsIGl0ZXJhdGluZyB0aHJvdWdoIHR1cm5zLCByZXBvcnRpbmcgZ2FtZSBvdXRjb21lIHdoZW5cbiAgIGEgcGxheWVyIGxvc2VzLCBhbmQgcmVzdGFydCB0aGUgZ2FtZSAqL1xuY29uc3QgZ2FtZU1hbmFnZXIgPSAoKSA9PiB7XG4gIC8vIEluaXRpYWxpemF0aW9uIG9mIFBsYXllciBvYmplY3RzIGZvciB1c2VyIGFuZCBBSVxuICBjb25zdCB1c2VyUGxheWVyID0gUGxheWVyKCk7XG4gIGNvbnN0IGFpUGxheWVyID0gUGxheWVyKCk7XG4gIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSBhaVBsYXllci5nYW1lYm9hcmQ7XG4gIGFpUGxheWVyLmdhbWVib2FyZC5yaXZhbEJvYXJkID0gdXNlclBsYXllci5nYW1lYm9hcmQ7XG4gIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLmlzQWkgPSBmYWxzZTtcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLmlzQWkgPSB0cnVlO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlIHdlYiBpbnRlcmZhY2Ugd2l0aCBnYW1lYm9hcmRzXG4gIGNvbnN0IHdlYkludCA9IHdlYkludGVyZmFjZSh1c2VyUGxheWVyLmdhbWVib2FyZCwgYWlQbGF5ZXIuZ2FtZWJvYXJkKTtcbiAgLy8gQWRkIHRoZSBjYW52YXMgb2JqZWN0cyBub3cgdGhhdCBnYW1lYm9hcmRzIGFyZSBjcmVhdGVkXG4gIGNvbnN0IGNhbnZhc2VzID0gY2FudmFzQWRkZXIoXG4gICAgdXNlclBsYXllci5nYW1lYm9hcmQsXG4gICAgYWlQbGF5ZXIuZ2FtZWJvYXJkLFxuICAgIHdlYkludFxuICApO1xuICAvLyBBZGQgY2FudmFzZXMgdG8gZ2FtZWJvYXJkc1xuICB1c2VyUGxheWVyLmdhbWVib2FyZC5jYW52YXMgPSBjYW52YXNlcy51c2VyQ2FudmFzO1xuICBhaVBsYXllci5nYW1lYm9hcmQuY2FudmFzID0gY2FudmFzZXMuYWlDYW52YXM7XG5cbiAgLy8gQWRkIGFpIHNoaXBzXG4gIHBsYWNlQWlTaGlwcygxLCBhaVBsYXllci5nYW1lYm9hcmQpO1xuICAvKiBNZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGdhbWUgaXMgb3ZlciBhZnRlciBldmVyeSB0dXJuLiBDaGVja3MgYWxsU3VuayBvbiByaXZhbCBnYW1lYm9hcmQgXG4gICAgIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2UgKi9cblxuICAvKiBNZXRob2QgdGhhdCBmbGlwcyBhIHZpcnR1YWwgY29pbiB0byBkZXRlcm1pbmUgd2hvIGdvZXMgZmlyc3QsIGFuZCBzZXRzIHRoYXRcbiAgICAgcGxheWVyIG9iamVjdCB0byBhbiBhY3RpdmUgcGxheWVyIHZhcmlhYmxlICovXG5cbiAgLy8gTWV0aG9kIGZvciBlbmRpbmcgdGhlIGdhbWUgYnkgcmVwb3J0aW5nIHJlc3VsdHNcblxuICAvLyBNZXRob2QgZm9yIHJlc3RhcnRpbmcgdGhlIGdhbWVcblxuICAvKiBJdGVyYXRlIGJldHdlZW4gcGxheWVycyBmb3IgYXR0YWNrcyAtIGlmIGFib3ZlIG1ldGhvZCBkb2Vzbid0IHJldHVybiB0cnVlLCBjaGVjayB0aGVcbiAgICAgYWN0aXZlIHBsYXllciBhbmQgcXVlcnkgdGhlbSBmb3IgdGhlaXIgbW92ZS4gSWYgYWJvdmUgbWV0aG9kIGlzIHRydWUsIGNhbGwgbWV0aG9kXG4gICAgIGZvciBlbmRpbmcgdGhlIGdhbWUsIHRoZW4gbWV0aG9kIGZvciByZXN0YXJ0aW5nIHRoZSBnYW1lLlxuICAgICBcbiAgICAgLUZvciB1c2VyIC0gc2V0IGEgb25lIHRpbWUgZXZlbnQgdHJpZ2dlciBmb3IgdXNlciBjbGlja2luZyBvbiB2YWxpZCBhdHRhY2sgcG9zaXRpb24gZGl2XG4gICAgIG9uIHRoZSB3ZWIgaW50ZXJmYWNlLiBJdCB3aWxsIHVzZSBnYW1lYm9hcmQucml2YWxCb2FyZC5yZWNlaXZlQXR0YWNrIGFuZCBpbmZvIGZyb20gdGhlIGRpdlxuICAgICBodG1sIGRhdGEgdG8gaGF2ZSB0aGUgYm9hcmQgYXR0ZW1wdCB0aGUgYXR0YWNrLiBJZiB0aGUgYXR0YWNrIGlzIHRydWUgb3IgZmFsc2UgdGhlbiBhIHZhbGlkXG4gICAgIGhpdCBvciB2YWxpZCBtaXNzIG9jY3VycmVkLiBJZiB1bmRlZmluZWQgdGhlbiBhbiBpbnZhbGlkIGF0dGFjayB3YXMgbWFkZSwgdHlwaWNhbGx5IG1lYW5pbmdcbiAgICAgYXR0YWNraW5nIGEgY2VsbCB0aGF0IGhhcyBhbHJlYWR5IGhhZCBhIGhpdCBvciBtaXNzIG9jY3VyIGluIGl0LiBJZiB0aGUgYXR0YWNrIGlzIGludmFsaWQgXG4gICAgIHRoZW4gcmVzZXQgdGhlIHRyaWdnZXIuIEFmdGVyIGEgc3VjY2Vzc2Z1bCBhdHRhY2sgKHRydWUgb3IgZmFsc2UgcmV0dXJuZWQpIHRoZW4gc2V0IHRoZSBcbiAgICAgYWN0aXZlIHBsYXllciB0byB0aGUgQUkgYW5kIGxvb3BcblxuICAgICAtRm9yIEFJIHVzZSBBSSBtb2R1bGUncyBxdWVyeSBtZXRob2QgYW5kIHBhc3MgaW4gcmVsZXZhbnQgcGFyYW1ldGVycy4gQUkgbW9kdWxlIGRvZXMgaXRzXG4gICAgIG1hZ2ljIGFuZCByZXR1cm5zIGEgcG9zaXRpb24uIFRoZW4gdXNlIGdhbWVib2FyZC5yaXZhbGJvYXJkLnJlY2VpdmVkQXR0YWNrIHRvIG1ha2UgYW5kIFxuICAgICBjb25maXJtIHRoZSBhdHRhY2sgc2ltaWxhciB0byB0aGUgdXNlcnMgYXR0YWNrcyAqL1xuXG4gIC8vIFRoZSBsb2dpYyBvZiB0aGUgZ2FtZSBtYW5hZ2VyIGFuZCBob3cgdGhlIHdlYiBpbnRlcmZhY2UgcmVzcG9uZHMgdG8gaXQgd2lsbCByZW1haW5cbiAgLy8gc2VwYXJhdGVkIGJ5IHVzaW5nIGEgcHVic3ViIG1vZHVsZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZU1hbmFnZXI7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLyogVGhpcyBtb2R1bGUgaGFzIHRocmVlIHByaW1hcnkgZnVuY3Rpb25zOlxuICAgMS4gR2V0IHNoaXAgcGxhY2VtZW50IGNvb3JkaW5hdGVzIGZyb20gdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgY2xpY2tzIG9uIHRoZSB3ZWIgaW50ZXJmYWNlXG4gICAyLiBHZXQgYXR0YWNrIHBsYWNlbWVudCBjb29yZGluYXRlcyBmcm9tIHRoZSB1c2VyIGJhc2VkIG9uIHRoZSBzYW1lXG4gICAzLiBPdGhlciBtaW5vciBpbnRlcmZhY2UgYWN0aW9ucyBzdWNoIGFzIGhhbmRsaW5nIGJ1dHRvbiBjbGlja3MgKHN0YXJ0IGdhbWUsIHJlc3RhcnQsIGV0YykgKi9cbmNvbnN0IHdlYkludGVyZmFjZSA9ICh1c2VyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCkgPT4ge1xuICAvLyBSZWZlcmVuY2VzIHRvIG1haW4gZWxlbWVudHNcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xuICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpO1xuICBjb25zdCBwbGFjZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudFwiKTtcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcblxuICAvLyBSZWZlcmVuY2UgdG8gYnRuIGVsZW1lbnRzXG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydC1idG5cIik7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ0blwiKTtcblxuICAvLyBNZXRob2QgZm9yIGl0ZXJhdGluZyB0aHJvdWdoIGRpcmVjdGlvbnNcbiAgY29uc3Qgcm90YXRlRGlyZWN0aW9uID0gKCkgPT4ge1xuICAgIHVzZXJHYW1lYm9hcmQuZGlyZWN0aW9uID0gdXNlckdhbWVib2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgICBhaUdhbWVib2FyZC5kaXJlY3Rpb24gPSBhaUdhbWVib2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgfTtcblxuICAvLyAjcmVnaW9uIEJhc2ljIG1ldGhvZHMgZm9yIHNob3dpbmcvaGlkaW5nIGVsZW1lbnRzXG4gIC8vIE1vdmUgYW55IGFjdGl2ZSBzZWN0aW9ucyBvZmYgdGhlIHNjcmVlblxuICBjb25zdCBoaWRlQWxsID0gKCkgPT4ge1xuICAgIG1lbnUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hvdyB0aGUgbWVudSBVSVxuICBjb25zdCBzaG93TWVudSA9ICgpID0+IHtcbiAgICBoaWRlQWxsKCk7XG4gICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIHNoaXAgcGxhY2VtZW50IFVJXG4gIGNvbnN0IHNob3dQbGFjZW1lbnQgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIHBsYWNlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIGdhbWUgVUlcbiAgY29uc3Qgc2hvd0dhbWUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIGdhbWUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcbiAgLy8gSWYgdGhlIHVzZXIgZ2FtZWJvYXJkIGhhcyBmdWxsIHNoaXBzIHRoZW4gdGhlIGdhbWUgaXMgcmVhZHkgdG8gc3RhcnRcbiAgY29uc3QgdHJ5U3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGlmICh1c2VyR2FtZWJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgc2hvd0dhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQWRkIGNsYXNzZXMgdG8gc2hpcCBkaXZzIHRvIHJlcHJlc2VudCBwbGFjZWQvZGVzdHJveWVkXG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBicm93c2VyIGV2ZW50c1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVJvdGF0ZUNsaWNrKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVN0YXJ0Q2xpY2spO1xuXG4gIHJldHVybiB7IHRyeVN0YXJ0R2FtZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2ViSW50ZXJmYWNlO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxuICAgdjIuMCB8IDIwMTEwMTI2XG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxuKi9cblxuaHRtbCxcbmJvZHksXG5kaXYsXG5zcGFuLFxuYXBwbGV0LFxub2JqZWN0LFxuaWZyYW1lLFxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxucCxcbmJsb2NrcXVvdGUsXG5wcmUsXG5hLFxuYWJicixcbmFjcm9ueW0sXG5hZGRyZXNzLFxuYmlnLFxuY2l0ZSxcbmNvZGUsXG5kZWwsXG5kZm4sXG5lbSxcbmltZyxcbmlucyxcbmtiZCxcbnEsXG5zLFxuc2FtcCxcbnNtYWxsLFxuc3RyaWtlLFxuc3Ryb25nLFxuc3ViLFxuc3VwLFxudHQsXG52YXIsXG5iLFxudSxcbmksXG5jZW50ZXIsXG5kbCxcbmR0LFxuZGQsXG5vbCxcbnVsLFxubGksXG5maWVsZHNldCxcbmZvcm0sXG5sYWJlbCxcbmxlZ2VuZCxcbnRhYmxlLFxuY2FwdGlvbixcbnRib2R5LFxudGZvb3QsXG50aGVhZCxcbnRyLFxudGgsXG50ZCxcbmFydGljbGUsXG5hc2lkZSxcbmNhbnZhcyxcbmRldGFpbHMsXG5lbWJlZCxcbmZpZ3VyZSxcbmZpZ2NhcHRpb24sXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxub3V0cHV0LFxucnVieSxcbnNlY3Rpb24sXG5zdW1tYXJ5LFxudGltZSxcbm1hcmssXG5hdWRpbyxcbnZpZGVvIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3JkZXI6IDA7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbiAgZm9udDogaW5oZXJpdDtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xuYXJ0aWNsZSxcbmFzaWRlLFxuZGV0YWlscyxcbmZpZ2NhcHRpb24sXG5maWd1cmUsXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxuc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuYm9keSB7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxub2wsXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5ibG9ja3F1b3RlLFxucSB7XG4gIHF1b3Rlczogbm9uZTtcbn1cbmJsb2NrcXVvdGU6YmVmb3JlLFxuYmxvY2txdW90ZTphZnRlcixcbnE6YmVmb3JlLFxucTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNvbnRlbnQ6IG5vbmU7XG59XG50YWJsZSB7XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Q0FHQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUZFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsU0FBUztFQUNULGVBQWU7RUFDZixhQUFhO0VBQ2Isd0JBQXdCO0FBQzFCO0FBQ0EsZ0RBQWdEO0FBQ2hEOzs7Ozs7Ozs7OztFQVdFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxZQUFZO0FBQ2Q7QUFDQTs7OztFQUlFLFdBQVc7RUFDWCxhQUFhO0FBQ2Y7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixpQkFBaUI7QUFDbkJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsXFxuYm9keSxcXG5kaXYsXFxuc3BhbixcXG5hcHBsZXQsXFxub2JqZWN0LFxcbmlmcmFtZSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wLFxcbmJsb2NrcXVvdGUsXFxucHJlLFxcbmEsXFxuYWJicixcXG5hY3JvbnltLFxcbmFkZHJlc3MsXFxuYmlnLFxcbmNpdGUsXFxuY29kZSxcXG5kZWwsXFxuZGZuLFxcbmVtLFxcbmltZyxcXG5pbnMsXFxua2JkLFxcbnEsXFxucyxcXG5zYW1wLFxcbnNtYWxsLFxcbnN0cmlrZSxcXG5zdHJvbmcsXFxuc3ViLFxcbnN1cCxcXG50dCxcXG52YXIsXFxuYixcXG51LFxcbmksXFxuY2VudGVyLFxcbmRsLFxcbmR0LFxcbmRkLFxcbm9sLFxcbnVsLFxcbmxpLFxcbmZpZWxkc2V0LFxcbmZvcm0sXFxubGFiZWwsXFxubGVnZW5kLFxcbnRhYmxlLFxcbmNhcHRpb24sXFxudGJvZHksXFxudGZvb3QsXFxudGhlYWQsXFxudHIsXFxudGgsXFxudGQsXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5jYW52YXMsXFxuZGV0YWlscyxcXG5lbWJlZCxcXG5maWd1cmUsXFxuZmlnY2FwdGlvbixcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5vdXRwdXQsXFxucnVieSxcXG5zZWN0aW9uLFxcbnN1bW1hcnksXFxudGltZSxcXG5tYXJrLFxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICBmb250OiBpbmhlcml0O1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5kZXRhaWxzLFxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsXFxucSB7XFxuICBxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLFxcbmJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsXFxucTphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBDb2xvciBSdWxlcyAqL1xuOnJvb3Qge1xuICAtLWNvbG9yQTE6ICM3MjJiOTQ7XG4gIC0tY29sb3JBMjogI2E5MzZlMDtcbiAgLS1jb2xvckM6ICMzN2UwMmI7XG4gIC0tY29sb3JCMTogIzk0MWQwZDtcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xuXG4gIC0tYmctY29sb3I6IGhzbCgwLCAwJSwgMjIlKTtcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcbiAgLS10ZXh0LWNvbG9yOiBoc2woMCwgMCUsIDkxJSk7XG4gIC0tbGluay1jb2xvcjogaHNsKDM2LCA5MiUsIDU5JSk7XG59XG5cbi8qICNyZWdpb24gVW5pdmVyc2FsIGVsZW1lbnQgcnVsZXMgKi9cbmEge1xuICBjb2xvcjogdmFyKC0tbGluay1jb2xvcik7XG59XG5cbmJvZHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIDFmcjtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xuICBncmlkLXJvdzogLTEgLyAxO1xuICBncmlkLWNvbHVtbjogLTEgLyAxO1xufVxuXG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXG4ubWFpbi1jb250ZW50IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi8qIHRpdGxlIGdyaWQgKi9cbi50aXRsZSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiAyIC8gNjtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC44cyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcjIpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4udGl0bGUtdGV4dCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogNS41cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xuICBjb2xvcjogdmFyKC0tY29sb3JCMik7XG59XG5cbi50aXRsZS5zaHJpbmsge1xuICB0cmFuc2Zvcm06IHNjYWxlKDAuNSkgdHJhbnNsYXRlWSgtNTAlKTtcbn1cbi8qICNyZWdpb24gbWVudSBzZWN0aW9uICovXG4ubWVudSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiA4IC8gMTg7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgMTUlIDUlIDFmciA1JSAxZnIgLyAxZnI7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuXCJcbiAgICBcImNyZWRpdHNcIlxuICAgIFwiLlwiXG4gICAgXCJzdGFydC1nYW1lXCJcbiAgICBcIi5cIlxuICAgIFwib3B0aW9uc1wiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4ubWVudS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTE1MCUpO1xufVxuXG4ubWVudSAuY3JlZGl0cyB7XG4gIGdyaWQtYXJlYTogY3JlZGl0cztcbn1cblxuLm1lbnUgLnN0YXJ0IHtcbiAgZ3JpZC1hcmVhOiBzdGFydC1nYW1lO1xufVxuXG4ubWVudSAub3B0aW9ucyB7XG4gIGdyaWQtYXJlYTogb3B0aW9ucztcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XG59XG5cbi5tZW51IC5zdGFydC1idG4sXG4ubWVudSAub3B0aW9ucy1idG4ge1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxODBweDtcblxuICBmb250LXNpemU6IDEuM3JlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bjpob3Zlcixcbi5tZW51IC5vcHRpb25zLWJ0bjpob3ZlciB7XG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xufVxuXG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cbi5wbGFjZW1lbnQge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogNiAvIDIwO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDUlIG1pbi1jb250ZW50IDglIG1pbi1jb250ZW50IDglIG1pbi1jb250ZW50IDUlIDFmciAvIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi5cIlxuICAgIFwiaW5zdHJ1Y3Rpb25zXCJcbiAgICBcIi5cIlxuICAgIFwic2hpcHNcIlxuICAgIFwiLlwiXG4gICAgXCJyb3RhdGVcIlxuICAgIFwiLlwiXG4gICAgXCJjYW52YXNcIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcbiAgZ3JpZC1hcmVhOiBpbnN0cnVjdGlvbnM7XG59XG5cbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucy10ZXh0IHtcbiAgZm9udC1zaXplOiAyLjc1cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMXB4IHZhcigtLWJnLWNvbG9yKTtcbn1cblxuLnBsYWNlbWVudCAuc2hpcHMtdG8tcGxhY2Uge1xuICBncmlkLWFyZWE6IHNoaXBzO1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUge1xuICBncmlkLWFyZWE6IHJvdGF0ZTtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0biB7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDE4MHB4O1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmhvdmVyIHtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46YWN0aXZlIHtcbiAgdGV4dC1zaGFkb3c6IDRweCA0cHggMXB4IHZhcigtLWNvbG9yQyksIC00cHggLTRweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi5wbGFjZW1lbnQgLnBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiBjYW52YXM7XG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xufVxuXG4ucGxhY2VtZW50LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNTAlKTtcbn1cblxuLnBsYWNlbWVudCAuY2FudmFzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQyk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gZ2FtZSBzZWN0aW9uICovXG4uZ2FtZSB7XG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XG4gIGdyaWQtcm93OiA1IC8gMjA7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCg0LCA1JSBtaW4tY29udGVudCkgLyByZXBlYXQoNCwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cIlxuICAgIFwiLiAuIC4gLlwiXG4gICAgXCIuIGxvZyBsb2cgLlwiXG4gICAgXCIuIC4gLiAuXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5nYW1lIC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG59XG5cbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XG59XG5cbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiBhaS1ib2FyZDtcbn1cblxuLmdhbWUgLnVzZXItaW5mbyB7XG4gIGdyaWQtYXJlYTogdXNlci1pbmZvO1xufVxuXG4uZ2FtZSAuYWktaW5mbyB7XG4gIGdyaWQtYXJlYTogYWktaW5mbztcbn1cblxuLmdhbWUgLnBsYXllci1zaGlwcyB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5nYW1lIC5sb2cge1xuICBncmlkLWFyZWE6IGxvZztcbiAgd2hpdGUtc3BhY2U6IHByZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uZ2FtZS5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTUwJSk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNlbmRyZWdpb24gKi9cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxnQkFBZ0I7QUFDaEI7RUFDRSxrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsa0JBQWtCOztFQUVsQiwyQkFBMkI7RUFDM0IsNEJBQTRCO0VBQzVCLDZCQUE2QjtFQUM3QiwrQkFBK0I7QUFDakM7O0FBRUEsb0NBQW9DO0FBQ3BDO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsaUNBQWlDO0VBQ2pDLHdCQUF3QjtFQUN4QixhQUFhO0VBQ2IsWUFBWTtFQUNaLGdCQUFnQjs7RUFFaEIseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHdCQUF3QjtFQUN4QixrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtBQUNyQjs7QUFFQSxlQUFlOztBQUVmLHlCQUF5QjtBQUN6QjtFQUNFLGFBQWE7RUFDYiw4Q0FBOEM7RUFDOUMsa0JBQWtCOztFQUVsQixZQUFZO0VBQ1osV0FBVztBQUNiOztBQUVBLGVBQWU7QUFDZjtFQUNFLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsYUFBYTtFQUNiLG1CQUFtQjs7RUFFbkIsc0NBQXNDOztFQUV0QyxrQ0FBa0M7RUFDbEMsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixrQkFBa0I7RUFDbEIsaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQix1Q0FBdUM7RUFDdkMscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDO0FBQ0EseUJBQXlCO0FBQ3pCO0VBQ0UsbUJBQW1CO0VBQ25CLGdCQUFnQjs7RUFFaEIsYUFBYTtFQUNiLHlDQUF5QztFQUN6QyxtQkFBbUI7RUFDbkI7Ozs7OzthQU1XOztFQUVYLHNDQUFzQzs7RUFFdEMsZ0NBQWdDO0VBQ2hDLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLDRCQUE0QjtBQUM5Qjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixpQkFBaUI7QUFDbkI7O0FBRUE7O0VBRUUsWUFBWTtFQUNaLFlBQVk7O0VBRVosaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQix3QkFBd0I7RUFDeEIsd0NBQXdDOztFQUV4QyxnQ0FBZ0M7RUFDaEMsK0JBQStCO0VBQy9CLG1CQUFtQjtBQUNyQjs7QUFFQTs7RUFFRSxvRUFBb0U7QUFDdEU7O0FBRUEsZUFBZTs7QUFFZiw4QkFBOEI7QUFDOUI7RUFDRSxtQkFBbUI7RUFDbkIsZ0JBQWdCOztFQUVoQixhQUFhO0VBQ2Isd0VBQXdFO0VBQ3hFLG1CQUFtQjtFQUNuQjs7Ozs7Ozs7WUFRVTs7RUFFVixzQ0FBc0M7O0VBRXRDLGdDQUFnQztBQUNsQzs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsd0NBQXdDO0FBQzFDOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osWUFBWTs7RUFFWixpQkFBaUI7RUFDakIsaUJBQWlCO0VBQ2pCLHdCQUF3QjtFQUN4Qix3Q0FBd0M7O0VBRXhDLGdDQUFnQztFQUNoQywrQkFBK0I7RUFDL0IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usb0VBQW9FO0FBQ3RFOztBQUVBO0VBQ0Usb0VBQW9FO0FBQ3RFOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLCtCQUErQjtBQUNqQztBQUNBLGVBQWU7O0FBRWYseUJBQXlCO0FBQ3pCO0VBQ0UsbUJBQW1CO0VBQ25CLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHlEQUF5RDtFQUN6RDs7Ozs7OzthQU9XOztFQUVYLHNDQUFzQzs7RUFFdEMsZ0NBQWdDO0VBQ2hDLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdDQUFnQztBQUNsQzs7QUFFQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3QjtBQUNBLGVBQWU7O0FBRWYsZUFBZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBDb2xvciBSdWxlcyAqL1xcbjpyb290IHtcXG4gIC0tY29sb3JBMTogIzcyMmI5NDtcXG4gIC0tY29sb3JBMjogI2E5MzZlMDtcXG4gIC0tY29sb3JDOiAjMzdlMDJiO1xcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xcblxcbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcXG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcXG59XFxuXFxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xcbmEge1xcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcblxcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxufVxcblxcbi5jYW52YXMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcXG4gIGdyaWQtY29sdW1uOiAtMSAvIDE7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIG1haW4tY29udGVudCAqL1xcbi5tYWluLWNvbnRlbnQge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyMCwgNSUpIC8gcmVwZWF0KDIwLCA1JSk7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLyogdGl0bGUgZ3JpZCAqL1xcbi50aXRsZSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDIgLyA2O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC44cyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yMik7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4udGl0bGUtdGV4dCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDUuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4udGl0bGUuc2hyaW5rIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMC41KSB0cmFuc2xhdGVZKC01MCUpO1xcbn1cXG4vKiAjcmVnaW9uIG1lbnUgc2VjdGlvbiAqL1xcbi5tZW51IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogOCAvIDE4O1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDUlIDE1JSA1JSAxZnIgNSUgMWZyIC8gMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwiY3JlZGl0c1xcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJzdGFydC1nYW1lXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcIm9wdGlvbnNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcblxcbi5tZW51LmhpZGRlbiB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTE1MCUpO1xcbn1cXG5cXG4ubWVudSAuY3JlZGl0cyB7XFxuICBncmlkLWFyZWE6IGNyZWRpdHM7XFxufVxcblxcbi5tZW51IC5zdGFydCB7XFxuICBncmlkLWFyZWE6IHN0YXJ0LWdhbWU7XFxufVxcblxcbi5tZW51IC5vcHRpb25zIHtcXG4gIGdyaWQtYXJlYTogb3B0aW9ucztcXG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuLFxcbi5tZW51IC5vcHRpb25zLWJ0biB7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTgwcHg7XFxuXFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG46aG92ZXIsXFxuLm1lbnUgLm9wdGlvbnMtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBwbGFjZW1lbnQgc2VjdGlvbiAqL1xcbi5wbGFjZW1lbnQge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiA2IC8gMjA7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgOCUgbWluLWNvbnRlbnQgOCUgbWluLWNvbnRlbnQgNSUgMWZyIC8gMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwiaW5zdHJ1Y3Rpb25zXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcInNoaXBzXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcInJvdGF0ZVxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJjYW52YXNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcXG4gIGdyaWQtYXJlYTogaW5zdHJ1Y3Rpb25zO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMtdGV4dCB7XFxuICBmb250LXNpemU6IDIuNzVyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcXG4gIGdyaWQtYXJlYTogc2hpcHM7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlIHtcXG4gIGdyaWQtYXJlYTogcm90YXRlO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3ZlciB7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUge1xcbiAgdGV4dC1zaGFkb3c6IDRweCA0cHggMXB4IHZhcigtLWNvbG9yQyksIC00cHggLTRweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogY2FudmFzO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5wbGFjZW1lbnQuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNTAlKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckMpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cXG4uZ2FtZSB7XFxuICBncmlkLWNvbHVtbjogMiAvIDIwO1xcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDQsIDUlIG1pbi1jb250ZW50KSAvIHJlcGVhdCg0LCAxZnIpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwiLiBsb2cgbG9nIC5cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG59XFxuXFxuLmdhbWUgLnVzZXItY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XFxufVxcblxcbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XFxufVxcblxcbi5nYW1lIC51c2VyLWluZm8ge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWluZm87XFxufVxcblxcbi5nYW1lIC5haS1pbmZvIHtcXG4gIGdyaWQtYXJlYTogYWktaW5mbztcXG59XFxuXFxuLmdhbWUgLnBsYXllci1zaGlwcyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLmdhbWUgLmxvZyB7XFxuICBncmlkLWFyZWE6IGxvZztcXG4gIHdoaXRlLXNwYWNlOiBwcmU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5nYW1lLmhpZGRlbiB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTUwJSk7XFxufVxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVzZXQuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQgXCIuL3N0eWxlL3Jlc2V0LmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZS9zdHlsZS5jc3NcIjtcbmltcG9ydCBnYW1lTWFuYWdlciBmcm9tIFwiLi9tb2R1bGVzL2dhbWVNYW5hZ2VyXCI7XG5cbi8vIEluaXRpYWxpemUgbW9kdWxlc1xuZ2FtZU1hbmFnZXIoKTtcbiJdLCJuYW1lcyI6WyJTaGlwIiwiYWlBdHRhY2siLCJnYW1lTG9nIiwiR2FtZWJvYXJkIiwibWF4Qm9hcmRYIiwibWF4Qm9hcmRZIiwidGhpc0dhbWVib2FyZCIsInNoaXBzIiwiZGlyZWN0aW9uIiwicmV0dXJuVXNlclNoaXBzIiwiYWxsT2NjdXBpZWRDZWxscyIsImFkZFNoaXAiLCJyZWNlaXZlQXR0YWNrIiwiY2FuQXR0YWNrIiwibWlzc2VzIiwiaGl0cyIsImFsbFN1bmsiLCJsb2dTdW5rIiwicml2YWxCb2FyZCIsImNhbnZhcyIsImlzQWkiLCJnYW1lT3ZlciIsInZhbGlkYXRlU2hpcCIsInNoaXAiLCJpc1ZhbGlkIiwiX2xvb3AiLCJpIiwib2NjdXBpZWRDZWxscyIsImlzQ2VsbE9jY3VwaWVkIiwic29tZSIsImNlbGwiLCJsZW5ndGgiLCJfcmV0IiwiYWRkQ2VsbHNUb0xpc3QiLCJmb3JFYWNoIiwicHVzaCIsInBvc2l0aW9uIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwic2hpcFR5cGVJbmRleCIsIm5ld1NoaXAiLCJhZGRNaXNzIiwiYWRkSGl0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJBcnJheSIsImlzQXJyYXkiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJqIiwiaGl0IiwidHJ5QWlBdHRhY2siLCJzaGlwQXJyYXkiLCJpc1N1bmsiLCJzdW5rZW5TaGlwcyIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJ0eXBlIiwicGxheWVyIiwiYXBwZW5kIiwiY29uY2F0IiwiUGxheWVyIiwicHJpdmF0ZU5hbWUiLCJ0aGlzUGxheWVyIiwibmFtZSIsIm5ld05hbWUiLCJ0b1N0cmluZyIsImdhbWVib2FyZCIsInNlbmRBdHRhY2siLCJ2YWxpZGF0ZUF0dGFjayIsInBsYXllckJvYXJkIiwic2hpcE5hbWVzIiwiaW5kZXgiLCJ0aGlzU2hpcCIsInNpemUiLCJwbGFjZW1lbnREaXJlY3Rpb25YIiwicGxhY2VtZW50RGlyZWN0aW9uWSIsImhhbGZTaXplIiwiTWF0aCIsImZsb29yIiwicmVtYWluZGVyU2l6ZSIsIm5ld0Nvb3JkcyIsImdyaWRIZWlnaHQiLCJncmlkV2lkdGgiLCJib2FyZCIsImF0dGFja0Nvb3JkcyIsImFscmVhZHlBdHRhY2tlZCIsImNlbGxDb29yZGluYXRlcyIsImF0dGFja2VkIiwibWlzcyIsInJhbmRvbUF0dGFjayIsIngiLCJyYW5kb20iLCJ5Iiwic2V0VGltZW91dCIsInRoZW4iLCJyZXN1bHQiLCJkcmF3SGl0IiwiZHJhd01pc3MiLCJncmlkQ2FudmFzIiwiY2FudmFzQWRkZXIiLCJ1c2VyR2FtZWJvYXJkIiwiYWlHYW1lYm9hcmQiLCJ3ZWJJbnRlcmZhY2UiLCJwbGFjZW1lbnRQSCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVzZXJQSCIsImFpUEgiLCJ1c2VyQ2FudmFzIiwiYWlDYW52YXMiLCJwbGFjZW1lbnRDYW52YXMiLCJwYXJlbnROb2RlIiwicmVwbGFjZUNoaWxkIiwiY3JlYXRlQ2FudmFzIiwic2l6ZVgiLCJzaXplWSIsIm9wdGlvbnMiLCJ1c2VyQm9hcmRDYW52YXMiLCJfdXNlckNhbnZhcyRjaGlsZE5vZGUiLCJfc2xpY2VkVG9BcnJheSIsImNoaWxkTm9kZXMiLCJjdXJyZW50Q2VsbCIsImNhbnZhc0NvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJib2FyZENhbnZhcyIsImFwcGVuZENoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJib2FyZEN0eCIsImdldENvbnRleHQiLCJvdmVybGF5Q2FudmFzIiwib3ZlcmxheUN0eCIsImNlbGxTaXplWCIsImNlbGxTaXplWSIsImdldE1vdXNlQ2VsbCIsImV2ZW50IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm1vdXNlWCIsImNsaWVudFgiLCJsZWZ0IiwibW91c2VZIiwiY2xpZW50WSIsInRvcCIsImNlbGxYIiwiY2VsbFkiLCJkcmF3TGluZXMiLCJjb250ZXh0IiwiZ3JpZFNpemUiLCJtaW4iLCJsaW5lQ29sb3IiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsInN0cm9rZSIsImhpZ2hsaWdodFBsYWNlbWVudENlbGxzIiwic2hpcHNDb3VudCIsImNsZWFyUmVjdCIsImRyYXdDZWxsIiwicG9zWCIsInBvc1kiLCJmaWxsUmVjdCIsImRyYXdMZW5ndGgiLCJkaXJlY3Rpb25YIiwiZGlyZWN0aW9uWSIsImhhbGZEcmF3TGVuZ3RoIiwicmVtYWluZGVyTGVuZ3RoIiwibWF4Q29vcmRpbmF0ZVgiLCJtYXhDb29yZGluYXRlWSIsIm1pbkNvb3JkaW5hdGVYIiwibWluQ29vcmRpbmF0ZVkiLCJtYXhYIiwibWF4WSIsIm1pblgiLCJtaW5ZIiwiaXNPdXRPZkJvdW5kcyIsImZpbGxTdHlsZSIsIm5leHRYIiwibmV4dFkiLCJoaWdobGlnaHRBdHRhY2siLCJjb29yZGluYXRlcyIsImRyYXdIaXRNaXNzIiwiZHJhd1NoaXBzIiwic2hpcHNUb0RyYXciLCJyYWRpdXMiLCJhcmMiLCJQSSIsImZpbGwiLCJoYW5kbGVNb3VzZUNsaWNrIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVNb3VzZUxlYXZlIiwiaGFuZGxlTW91c2VNb3ZlIiwibW91c2VDZWxsIiwidHJ5U3RhcnRHYW1lIiwiYWlCb2FyZCIsImVyYXNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJfcmVnZW5lcmF0b3JSdW50aW1lIiwiZXhwb3J0cyIsIk9wIiwicHJvdG90eXBlIiwiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJkZWZpbmVQcm9wZXJ0eSIsIm9iaiIsImRlc2MiLCJ2YWx1ZSIsIiRTeW1ib2wiLCJTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsIml0ZXJhdG9yIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZXJyIiwid3JhcCIsImlubmVyRm4iLCJvdXRlckZuIiwic2VsZiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJjcmVhdGUiLCJDb250ZXh0IiwibWFrZUludm9rZU1ldGhvZCIsInRyeUNhdGNoIiwiZm4iLCJhcmciLCJjYWxsIiwiQ29udGludWVTZW50aW5lbCIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJJdGVyYXRvclByb3RvdHlwZSIsImdldFByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJOYXRpdmVJdGVyYXRvclByb3RvdHlwZSIsInZhbHVlcyIsIkdwIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwibWV0aG9kIiwiX2ludm9rZSIsIkFzeW5jSXRlcmF0b3IiLCJQcm9taXNlSW1wbCIsImludm9rZSIsInJlamVjdCIsInJlY29yZCIsIl90eXBlb2YiLCJfX2F3YWl0IiwidW53cmFwcGVkIiwiZXJyb3IiLCJwcmV2aW91c1Byb21pc2UiLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsInN0YXRlIiwiRXJyb3IiLCJkb25lUmVzdWx0IiwiZGVsZWdhdGUiLCJkZWxlZ2F0ZVJlc3VsdCIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsImRvbmUiLCJtZXRob2ROYW1lIiwiVHlwZUVycm9yIiwiaW5mbyIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJlbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpdGVyYWJsZSIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwiY29uc3RydWN0b3IiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsImFzeW5jIiwiaXRlciIsInZhbCIsIm9iamVjdCIsInJldmVyc2UiLCJwb3AiLCJza2lwVGVtcFJlc2V0IiwicHJldiIsImNoYXJBdCIsInNsaWNlIiwic3RvcCIsInJvb3RSZWNvcmQiLCJydmFsIiwiZXhjZXB0aW9uIiwiaGFuZGxlIiwibG9jIiwiY2F1Z2h0IiwiaGFzQ2F0Y2giLCJoYXNGaW5hbGx5IiwiZmluYWxseUVudHJ5IiwiY29tcGxldGUiLCJmaW5pc2giLCJfY2F0Y2giLCJ0aHJvd24iLCJkZWxlZ2F0ZVlpZWxkIiwiYXN5bmNHZW5lcmF0b3JTdGVwIiwiZ2VuIiwiX25leHQiLCJfdGhyb3ciLCJfYXN5bmNUb0dlbmVyYXRvciIsImFyZ3MiLCJhcHBseSIsInBsYWNlQWlTaGlwcyIsInBhc3NlZERpZmYiLCJhaVNoaXBzIiwicGxhY2VSYW5kb21TaGlwIiwicm91bmQiLCJ3YWl0Rm9yQWlTaGlwc1NldCIsInBsYWNlU2hpcHMiLCJfcmVmIiwiX2NhbGxlZSIsImRpZmZpY3VsdHkiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwiX3giLCJsb2dUZXh0IiwidGV4dENvbnRlbnQiLCJzdHJpbmdUb0FwcGVuZCIsImlubmVySFRNTCIsImdhbWVNYW5hZ2VyIiwidXNlclBsYXllciIsImFpUGxheWVyIiwid2ViSW50IiwiY2FudmFzZXMiLCJ0aXRsZSIsIm1lbnUiLCJwbGFjZW1lbnQiLCJnYW1lIiwic3RhcnRCdG4iLCJyb3RhdGVCdG4iLCJyb3RhdGVEaXJlY3Rpb24iLCJoaWRlQWxsIiwic2hvd01lbnUiLCJyZW1vdmUiLCJzaG93UGxhY2VtZW50Iiwic2hvd0dhbWUiLCJzaHJpbmtUaXRsZSIsImhhbmRsZVN0YXJ0Q2xpY2siLCJoYW5kbGVSb3RhdGVDbGljayJdLCJzb3VyY2VSb290IjoiIn0=