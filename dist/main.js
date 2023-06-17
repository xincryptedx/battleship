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
          _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("All User units destroyed. \nAI dominance is assured.");
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
              _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("All AI units destroyed. \nHumanity survives another day...");
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

  // Set the scene image in the log
  // Loads scene images for use
  var sceneImages = {
    sp: {},
    at: {},
    vm: {},
    ig: {},
    l: {}
  };
  var loadScenes = function loadScenes() {
    // Urls for all scene images
    var urls = {
      sp: {
        gen: ["../scene-images/Sentinel Probe/sp_gen1.jpg", "../scene-images/Sentinel Probe/sp_gen2.jpg", "../scene-images/Sentinel Probe/sp_gen3.jpg", "../scene-images/Sentinel Probe/sp_gen4.jpg"],
        attack: ["../scene-images/Sentinel Probe/sp_attack1.jpg", "../scene-images/Sentinel Probe/sp_attack2.jpg", "../scene-images/Sentinel Probe/sp_attack3.jpg", "../scene-images/Sentinel Probe/sp_attack4.jpg"],
        hit: ["../scene-images/Sentinel Probe/sp_hit1.jpg", "../scene-images/Sentinel Probe/sp_hit2.jpg", "../scene-images/Sentinel Probe/sp_hit3.jpg"]
      }
    };

    // Load sentinel probe images for use
    Object.keys(urls.sp).forEach(function (key) {
      // Set the property that holds imgs to array
      sceneImages.sp[key] = [];
      // Add imgs to that array
      urls.sp[key].forEach(function (url) {
        var image = new Image();
        image.src = url;
        sceneImages.sp[key].push(image);
      });
    });
  };

  // Sets the scene image based on params passed
  var scene = function scene(unit, state) {
    // Set the img based on params
  };
  return {
    erase: erase,
    append: append,
    loadScenes: loadScenes
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
/* harmony import */ var _gameLog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gameLog */ "./src/modules/gameLog.js");






/* This module holds the game loop logic for starting games, creating
   required objects, iterating through turns, reporting game outcome when
   a player loses, and restart the game */
var gameManager = function gameManager() {
  // #region Loading/Init
  // Load scene images for game log
  _gameLog__WEBPACK_IMPORTED_MODULE_4__["default"].loadScenes();

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

  // #endregion

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
  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr;
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
  font-size: 2.3rem;
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
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"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","sourcesContent":["/* Color Rules */\n:root {\n  --colorA1: #722b94;\n  --colorA2: #a936e0;\n  --colorC: #37e02b;\n  --colorB1: #941d0d;\n  --colorB2: #e0361f;\n\n  --bg-color: hsl(0, 0%, 22%);\n  --bg-color2: hsl(0, 0%, 32%);\n  --text-color: hsl(0, 0%, 91%);\n  --link-color: hsl(36, 92%, 59%);\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.canvas-container {\n  display: grid;\n  grid-template: 1fr / 1fr;\n  width: fit-content;\n  height: fit-content;\n}\n\n.canvas-container > * {\n  grid-row: -1 / 1;\n  grid-column: -1 / 1;\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n  display: grid;\n  place-items: center;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: var(--bg-color2);\n  border-radius: 20px;\n}\n\n.title-text {\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  font-size: 4.8rem;\n  font-weight: bold;\n  text-shadow: 2px 2px 2px var(--colorB1);\n  color: var(--colorB2);\n\n  transition: font-size 0.8s ease-in-out;\n}\n\n.title.shrink {\n  transform: scale(0.5) translateY(-50%);\n}\n\n.title.shrink .title-text {\n  font-size: 3.5rem;\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  display: grid;\n  grid-template: 5% 15% 5% 1fr 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"credits\"\n    \".\"\n    \"start-game\"\n    \".\"\n    \"options\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.menu.hidden {\n  transform: translateX(-150%);\n}\n\n.menu .credits {\n  grid-area: credits;\n}\n\n.menu .start {\n  grid-area: start-game;\n}\n\n.menu .options {\n  grid-area: options;\n  align-self: start;\n}\n\n.menu .start-btn,\n.menu .options-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.menu .start-btn:hover,\n.menu .options-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 6 / 20;\n\n  display: grid;\n  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"instructions\"\n    \".\"\n    \"ships\"\n    \".\"\n    \"rotate\"\n    \".\"\n    \"canvas\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n}\n\n.placement .instructions {\n  grid-area: instructions;\n}\n\n.placement .instructions-text {\n  font-size: 2.3rem;\n  font-weight: bold;\n  text-shadow: 1px 1px 1px var(--bg-color);\n}\n\n.placement .ships-to-place {\n  grid-area: ships;\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.placement .rotate {\n  grid-area: rotate;\n}\n\n.placement .rotate-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.placement .rotate-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.placement .rotate-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.placement .placement-canvas-container {\n  grid-area: canvas;\n  align-self: start;\n}\n\n.placement.hidden {\n  transform: translateY(150%);\n}\n\n.placement .canvas-container {\n  background-color: var(--colorC);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 5 / 20;\n  display: grid;\n  place-items: center;\n  grid-template:\n    repeat(2, minmax(10px, 1fr) min-content) minmax(10px, 1fr)\n    min-content 1fr / repeat(4, 1fr);\n  grid-template-areas:\n    \". . . .\"\n    \". log log .\"\n    \". . . .\"\n    \"user-board user-board ai-board ai-board\"\n    \". . . .\"\n    \"user-info user-info ai-info ai-info\"\n    \". . . .\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.game .canvas-container {\n  background-color: var(--colorA2);\n}\n\n.game .user-canvas-container {\n  grid-area: user-board;\n}\n\n.game .ai-canvas-container {\n  grid-area: ai-board;\n}\n\n.game .user-info {\n  grid-area: user-info;\n}\n\n.game .ai-info {\n  grid-area: ai-info;\n}\n\n.game .player-ships {\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.game .log {\n  grid-area: log;\n  display: grid;\n  grid-template: 1fr / min-content 10px 1fr;\n  grid-template-areas: \"scene . text\";\n\n  width: 500px;\n\n  border: 3px solid var(--colorB1);\n  border-radius: 6px;\n\n  background-color: var(--bg-color);\n}\n\n.game .log .scene {\n  grid-area: scene;\n\n  height: 150px;\n  width: 150px;\n  background-color: var(--colorB1);\n}\n\n.game .log .log-text {\n  grid-area: text;\n  font-size: 1.15rem;\n  white-space: pre; /* Allows for \\n */\n}\n\n.game.hidden {\n  transform: translateX(150%);\n}\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUEwQjtBQUNpQjtBQUNGOztBQUV6QztBQUNBO0FBQ0E7QUFDQSxJQUFNRyxTQUFTLEdBQUcsU0FBWkEsU0FBU0EsQ0FBQSxFQUFTO0VBQ3RCO0VBQ0EsSUFBTUMsU0FBUyxHQUFHLENBQUM7RUFDbkIsSUFBTUMsU0FBUyxHQUFHLENBQUM7RUFFbkIsSUFBTUMsYUFBYSxHQUFHO0lBQ3BCQyxLQUFLLEVBQUUsRUFBRTtJQUNUQyxTQUFTLEVBQUUsQ0FBQztJQUNaQyxlQUFlLEVBQUUsSUFBSTtJQUNyQkMsZ0JBQWdCLEVBQUUsRUFBRTtJQUNwQkMsT0FBTyxFQUFFLElBQUk7SUFDYkMsYUFBYSxFQUFFLElBQUk7SUFDbkJDLFNBQVMsRUFBRSxJQUFJO0lBQ2ZDLE1BQU0sRUFBRSxFQUFFO0lBQ1ZDLElBQUksRUFBRSxFQUFFO0lBQ1JDLE9BQU8sRUFBRSxJQUFJO0lBQ2JDLE9BQU8sRUFBRSxJQUFJO0lBQ2JDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLElBQUlkLFNBQVNBLENBQUEsRUFBRztNQUNkLE9BQU9BLFNBQVM7SUFDbEIsQ0FBQztJQUNELElBQUlDLFNBQVNBLENBQUEsRUFBRztNQUNkLE9BQU9BLFNBQVM7SUFDbEIsQ0FBQztJQUNEYyxNQUFNLEVBQUUsSUFBSTtJQUNaQyxJQUFJLEVBQUUsS0FBSztJQUNYQyxRQUFRLEVBQUU7RUFDWixDQUFDOztFQUVEO0VBQ0EsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQVlBLENBQUlDLElBQUksRUFBSztJQUM3QixJQUFJLENBQUNBLElBQUksRUFBRSxPQUFPLEtBQUs7SUFDdkI7SUFDQSxJQUFJQyxPQUFPLEdBQUcsSUFBSTs7SUFFbEI7SUFBQSxJQUFBQyxLQUFBLFlBQUFBLE1BQUFDLENBQUEsRUFDdUQ7TUFDckQ7TUFDQSxJQUNFSCxJQUFJLENBQUNJLGFBQWEsQ0FBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM3QkgsSUFBSSxDQUFDSSxhQUFhLENBQUNELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJdEIsU0FBUyxJQUNyQ21CLElBQUksQ0FBQ0ksYUFBYSxDQUFDRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQzdCSCxJQUFJLENBQUNJLGFBQWEsQ0FBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUlyQixTQUFTLEVBQ3JDO1FBQ0E7TUFBQSxDQUNELE1BQU07UUFDTG1CLE9BQU8sR0FBRyxLQUFLO01BQ2pCO01BQ0E7TUFDQSxJQUFNSSxjQUFjLEdBQUd0QixhQUFhLENBQUNJLGdCQUFnQixDQUFDbUIsSUFBSSxDQUN4RCxVQUFDQyxJQUFJO1FBQUE7VUFDSDtVQUNBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUtQLElBQUksQ0FBQ0ksYUFBYSxDQUFDRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDcENJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBS1AsSUFBSSxDQUFDSSxhQUFhLENBQUNELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQztNQUFBLENBQ3hDLENBQUM7TUFFRCxJQUFJRSxjQUFjLEVBQUU7UUFDbEJKLE9BQU8sR0FBRyxLQUFLO1FBQUMsZ0JBQ1Q7TUFDVDtJQUNGLENBQUM7SUF4QkQsS0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdILElBQUksQ0FBQ0ksYUFBYSxDQUFDSSxNQUFNLEVBQUVMLENBQUMsSUFBSSxDQUFDO01BQUEsSUFBQU0sSUFBQSxHQUFBUCxLQUFBLENBQUFDLENBQUE7TUFBQSxJQUFBTSxJQUFBLGNBc0JqRDtJQUFNO0lBSVYsT0FBT1IsT0FBTztFQUNoQixDQUFDOztFQUVEO0VBQ0EsSUFBTVMsY0FBYyxHQUFHLFNBQWpCQSxjQUFjQSxDQUFJVixJQUFJLEVBQUs7SUFDL0JBLElBQUksQ0FBQ0ksYUFBYSxDQUFDTyxPQUFPLENBQUMsVUFBQ0osSUFBSSxFQUFLO01BQ25DeEIsYUFBYSxDQUFDSSxnQkFBZ0IsQ0FBQ3lCLElBQUksQ0FBQ0wsSUFBSSxDQUFDO0lBQzNDLENBQUMsQ0FBQztFQUNKLENBQUM7O0VBRUQ7RUFDQXhCLGFBQWEsQ0FBQ0ssT0FBTyxHQUFHLFVBQ3RCeUIsUUFBUSxFQUdMO0lBQUEsSUFGSDVCLFNBQVMsR0FBQTZCLFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHL0IsYUFBYSxDQUFDRSxTQUFTO0lBQUEsSUFDbkMrQixhQUFhLEdBQUFGLFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHL0IsYUFBYSxDQUFDQyxLQUFLLENBQUN3QixNQUFNLEdBQUcsQ0FBQztJQUU5QztJQUNBLElBQU1TLE9BQU8sR0FBR3hDLGlEQUFJLENBQUN1QyxhQUFhLEVBQUVILFFBQVEsRUFBRTVCLFNBQVMsQ0FBQztJQUN4RDtJQUNBLElBQUljLFlBQVksQ0FBQ2tCLE9BQU8sQ0FBQyxFQUFFO01BQ3pCUCxjQUFjLENBQUNPLE9BQU8sQ0FBQztNQUN2QmxDLGFBQWEsQ0FBQ0MsS0FBSyxDQUFDNEIsSUFBSSxDQUFDSyxPQUFPLENBQUM7SUFDbkM7RUFDRixDQUFDO0VBRUQsSUFBTUMsT0FBTyxHQUFHLFNBQVZBLE9BQU9BLENBQUlMLFFBQVEsRUFBSztJQUM1QixJQUFJQSxRQUFRLEVBQUU7TUFDWjlCLGFBQWEsQ0FBQ1EsTUFBTSxDQUFDcUIsSUFBSSxDQUFDQyxRQUFRLENBQUM7SUFDckM7RUFDRixDQUFDO0VBRUQsSUFBTU0sTUFBTSxHQUFHLFNBQVRBLE1BQU1BLENBQUlOLFFBQVEsRUFBSztJQUMzQixJQUFJQSxRQUFRLEVBQUU7TUFDWjlCLGFBQWEsQ0FBQ1MsSUFBSSxDQUFDb0IsSUFBSSxDQUFDQyxRQUFRLENBQUM7SUFDbkM7RUFDRixDQUFDOztFQUVEO0VBQ0E5QixhQUFhLENBQUNNLGFBQWEsR0FBRyxVQUFDd0IsUUFBUTtJQUFBLElBQUU3QixLQUFLLEdBQUE4QixTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRy9CLGFBQWEsQ0FBQ0MsS0FBSztJQUFBLE9BQ2xFLElBQUlvQyxPQUFPLENBQUMsVUFBQ0MsT0FBTyxFQUFLO01BQ3ZCO01BQ0EsSUFDRUMsS0FBSyxDQUFDQyxPQUFPLENBQUNWLFFBQVEsQ0FBQyxJQUN2QkEsUUFBUSxDQUFDTCxNQUFNLEtBQUssQ0FBQyxJQUNyQmdCLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JXLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JTLEtBQUssQ0FBQ0MsT0FBTyxDQUFDdkMsS0FBSyxDQUFDLEVBQ3BCO1FBQ0E7UUFDQSxLQUFLLElBQUltQixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUduQixLQUFLLENBQUN3QixNQUFNLEVBQUVMLENBQUMsSUFBSSxDQUFDLEVBQUU7VUFDeEM7VUFDRTtVQUNBbkIsS0FBSyxDQUFDbUIsQ0FBQyxDQUFDLElBQ1JuQixLQUFLLENBQUNtQixDQUFDLENBQUMsQ0FBQ0MsYUFBYSxJQUN0QmtCLEtBQUssQ0FBQ0MsT0FBTyxDQUFDdkMsS0FBSyxDQUFDbUIsQ0FBQyxDQUFDLENBQUNDLGFBQWEsQ0FBQyxFQUNyQztZQUNBO1lBQ0EsS0FBSyxJQUFJc0IsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHMUMsS0FBSyxDQUFDbUIsQ0FBQyxDQUFDLENBQUNDLGFBQWEsQ0FBQ0ksTUFBTSxFQUFFa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtjQUN6RDtjQUNFO2NBQ0ExQyxLQUFLLENBQUNtQixDQUFDLENBQUMsQ0FBQ0MsYUFBYSxDQUFDc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtiLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFDNUM3QixLQUFLLENBQUNtQixDQUFDLENBQUMsQ0FBQ0MsYUFBYSxDQUFDc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUtiLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDNUM7Z0JBQ0E7Z0JBQ0E3QixLQUFLLENBQUNtQixDQUFDLENBQUMsQ0FBQ3dCLEdBQUcsQ0FBQyxDQUFDO2dCQUNkUixNQUFNLENBQUNOLFFBQVEsQ0FBQztnQkFDaEJRLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2I7Y0FDRjtZQUNGO1VBQ0Y7UUFDRjtNQUNGO01BQ0FILE9BQU8sQ0FBQ0wsUUFBUSxDQUFDO01BQ2pCUSxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQztFQUFBOztFQUVKO0VBQ0F0QyxhQUFhLENBQUM2QyxXQUFXLEdBQUcsWUFBTTtJQUNoQztJQUNBLElBQUk3QyxhQUFhLENBQUNjLElBQUksS0FBSyxLQUFLLEVBQUU7SUFDbENuQiw2REFBUSxDQUFDSyxhQUFhLENBQUNZLFVBQVUsQ0FBQztFQUNwQyxDQUFDOztFQUVEO0VBQ0FaLGFBQWEsQ0FBQ1UsT0FBTyxHQUFHLFlBQXFDO0lBQUEsSUFBcENvQyxTQUFTLEdBQUFmLFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHL0IsYUFBYSxDQUFDQyxLQUFLO0lBQ3RELElBQUksQ0FBQzZDLFNBQVMsSUFBSSxDQUFDUCxLQUFLLENBQUNDLE9BQU8sQ0FBQ00sU0FBUyxDQUFDLEVBQUUsT0FBT2QsU0FBUztJQUM3RCxJQUFJdEIsT0FBTyxHQUFHLElBQUk7SUFDbEJvQyxTQUFTLENBQUNsQixPQUFPLENBQUMsVUFBQ1gsSUFBSSxFQUFLO01BQzFCLElBQUlBLElBQUksSUFBSUEsSUFBSSxDQUFDOEIsTUFBTSxJQUFJLENBQUM5QixJQUFJLENBQUM4QixNQUFNLENBQUMsQ0FBQyxFQUFFckMsT0FBTyxHQUFHLEtBQUs7SUFDNUQsQ0FBQyxDQUFDO0lBQ0YsT0FBT0EsT0FBTztFQUNoQixDQUFDOztFQUVEO0VBQ0EsSUFBTXNDLFdBQVcsR0FBRztJQUFFLENBQUMsRUFBRSxLQUFLO0lBQUUsQ0FBQyxFQUFFLEtBQUs7SUFBRSxDQUFDLEVBQUUsS0FBSztJQUFFLENBQUMsRUFBRSxLQUFLO0lBQUUsQ0FBQyxFQUFFO0VBQU0sQ0FBQzs7RUFFeEU7RUFDQWhELGFBQWEsQ0FBQ1csT0FBTyxHQUFHLFlBQU07SUFDNUJzQyxNQUFNLENBQUNDLElBQUksQ0FBQ0YsV0FBVyxDQUFDLENBQUNwQixPQUFPLENBQUMsVUFBQ3VCLEdBQUcsRUFBSztNQUN4QyxJQUFJSCxXQUFXLENBQUNHLEdBQUcsQ0FBQyxLQUFLLEtBQUssSUFBSW5ELGFBQWEsQ0FBQ0MsS0FBSyxDQUFDa0QsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDSixNQUFNLENBQUMsQ0FBQyxFQUFFO1FBQ3ZFLElBQU05QixJQUFJLEdBQUdqQixhQUFhLENBQUNDLEtBQUssQ0FBQ2tELEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsSUFBSTtRQUM5QyxJQUFNQyxNQUFNLEdBQUdyRCxhQUFhLENBQUNjLElBQUksR0FBRyxNQUFNLEdBQUcsUUFBUTtRQUNyRGxCLHdEQUFPLENBQUMwRCxNQUFNLCtCQUFBQyxNQUFBLENBQ2dCRixNQUFNLE9BQUFFLE1BQUEsQ0FBSXRDLElBQUksMkJBQzVDLENBQUM7UUFDRCtCLFdBQVcsQ0FBQ0csR0FBRyxDQUFDLEdBQUcsSUFBSTtNQUN6QjtJQUNGLENBQUMsQ0FBQztFQUNKLENBQUM7RUFFRCxPQUFPbkQsYUFBYTtBQUN0QixDQUFDO0FBRUQsaUVBQWVILFNBQVM7Ozs7Ozs7Ozs7Ozs7OztBQ3ZMWTs7QUFFcEM7QUFDQSxJQUFNMkQsTUFBTSxHQUFHLFNBQVRBLE1BQU1BLENBQUEsRUFBUztFQUNuQixJQUFJQyxXQUFXLEdBQUcsRUFBRTtFQUNwQixJQUFNQyxVQUFVLEdBQUc7SUFDakIsSUFBSUMsSUFBSUEsQ0FBQSxFQUFHO01BQ1QsT0FBT0YsV0FBVztJQUNwQixDQUFDO0lBQ0QsSUFBSUUsSUFBSUEsQ0FBQ0MsT0FBTyxFQUFFO01BQ2hCLElBQUlBLE9BQU8sRUFBRTtRQUNYSCxXQUFXLEdBQUdHLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDLENBQUM7TUFDbEMsQ0FBQyxNQUFNSixXQUFXLEdBQUcsRUFBRTtJQUN6QixDQUFDO0lBQ0RLLFNBQVMsRUFBRWpFLHNEQUFTLENBQUMsQ0FBQztJQUN0QmtFLFVBQVUsRUFBRTtFQUNkLENBQUM7O0VBRUQ7RUFDQSxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWNBLENBQUlsQyxRQUFRLEVBQUVnQyxTQUFTLEVBQUs7SUFDOUM7SUFDQSxJQUFJLENBQUNBLFNBQVMsSUFBSSxDQUFDQSxTQUFTLENBQUNoRSxTQUFTLElBQUksQ0FBQ2dFLFNBQVMsQ0FBQy9ELFNBQVMsRUFBRTtNQUM5RCxPQUFPLEtBQUs7SUFDZDtJQUNBO0lBQ0EsSUFDRStCLFFBQVEsSUFDUlMsS0FBSyxDQUFDQyxPQUFPLENBQUNWLFFBQVEsQ0FBQyxJQUN2QkEsUUFBUSxDQUFDTCxNQUFNLEtBQUssQ0FBQyxJQUNyQmdCLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JXLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JBLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQ2hCQSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUlnQyxTQUFTLENBQUNoRSxTQUFTLElBQ2xDZ0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFDaEJBLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSWdDLFNBQVMsQ0FBQy9ELFNBQVMsRUFDbEM7TUFDQSxPQUFPLElBQUk7SUFDYjtJQUNBLE9BQU8sS0FBSztFQUNkLENBQUM7O0VBRUQ7RUFDQTJELFVBQVUsQ0FBQ0ssVUFBVSxHQUFHLFVBQUNqQyxRQUFRLEVBQXlDO0lBQUEsSUFBdkNtQyxXQUFXLEdBQUFsQyxTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRzJCLFVBQVUsQ0FBQ0ksU0FBUztJQUNuRSxJQUFJRSxjQUFjLENBQUNsQyxRQUFRLEVBQUVtQyxXQUFXLENBQUMsRUFBRTtNQUN6Q0EsV0FBVyxDQUFDckQsVUFBVSxDQUFDTixhQUFhLENBQUN3QixRQUFRLENBQUM7SUFDaEQ7RUFDRixDQUFDO0VBRUQsT0FBTzRCLFVBQVU7QUFDbkIsQ0FBQztBQUVELGlFQUFlRixNQUFNOzs7Ozs7Ozs7Ozs7OztBQ25EckI7QUFDQSxJQUFNVSxTQUFTLEdBQUc7RUFDaEIsQ0FBQyxFQUFFLGdCQUFnQjtFQUNuQixDQUFDLEVBQUUsZUFBZTtFQUNsQixDQUFDLEVBQUUsWUFBWTtFQUNmLENBQUMsRUFBRSxjQUFjO0VBQ2pCLENBQUMsRUFBRTtBQUNMLENBQUM7O0FBRUQ7QUFDQSxJQUFNeEUsSUFBSSxHQUFHLFNBQVBBLElBQUlBLENBQUl5RSxLQUFLLEVBQUVyQyxRQUFRLEVBQUU1QixTQUFTLEVBQUs7RUFDM0M7RUFDQSxJQUFJLENBQUN1QyxNQUFNLENBQUNDLFNBQVMsQ0FBQ3lCLEtBQUssQ0FBQyxJQUFJQSxLQUFLLEdBQUcsQ0FBQyxJQUFJQSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU9uQyxTQUFTOztFQUV4RTtFQUNBLElBQU1vQyxRQUFRLEdBQUc7SUFDZkQsS0FBSyxFQUFMQSxLQUFLO0lBQ0xFLElBQUksRUFBRSxJQUFJO0lBQ1ZqQixJQUFJLEVBQUUsSUFBSTtJQUNWM0MsSUFBSSxFQUFFLENBQUM7SUFDUG1DLEdBQUcsRUFBRSxJQUFJO0lBQ1RHLE1BQU0sRUFBRSxJQUFJO0lBQ1oxQixhQUFhLEVBQUU7RUFDakIsQ0FBQzs7RUFFRDtFQUNBLFFBQVE4QyxLQUFLO0lBQ1gsS0FBSyxDQUFDO01BQ0pDLFFBQVEsQ0FBQ0MsSUFBSSxHQUFHLENBQUM7TUFDakI7SUFDRixLQUFLLENBQUM7TUFDSkQsUUFBUSxDQUFDQyxJQUFJLEdBQUcsQ0FBQztNQUNqQjtJQUNGO01BQ0VELFFBQVEsQ0FBQ0MsSUFBSSxHQUFHRixLQUFLO0VBQ3pCOztFQUVBO0VBQ0FDLFFBQVEsQ0FBQ2hCLElBQUksR0FBR2MsU0FBUyxDQUFDRSxRQUFRLENBQUNELEtBQUssQ0FBQzs7RUFFekM7RUFDQUMsUUFBUSxDQUFDeEIsR0FBRyxHQUFHLFlBQU07SUFDbkJ3QixRQUFRLENBQUMzRCxJQUFJLElBQUksQ0FBQztFQUNwQixDQUFDOztFQUVEO0VBQ0EyRCxRQUFRLENBQUNyQixNQUFNLEdBQUcsWUFBTTtJQUN0QixJQUFJcUIsUUFBUSxDQUFDM0QsSUFBSSxJQUFJMkQsUUFBUSxDQUFDQyxJQUFJLEVBQUUsT0FBTyxJQUFJO0lBQy9DLE9BQU8sS0FBSztFQUNkLENBQUM7O0VBRUQ7RUFDQSxJQUFJQyxtQkFBbUIsR0FBRyxDQUFDO0VBQzNCLElBQUlDLG1CQUFtQixHQUFHLENBQUM7RUFDM0IsSUFBSXJFLFNBQVMsS0FBSyxDQUFDLEVBQUU7SUFDbkJvRSxtQkFBbUIsR0FBRyxDQUFDO0lBQ3ZCQyxtQkFBbUIsR0FBRyxDQUFDO0VBQ3pCLENBQUMsTUFBTSxJQUFJckUsU0FBUyxLQUFLLENBQUMsRUFBRTtJQUMxQm9FLG1CQUFtQixHQUFHLENBQUM7SUFDdkJDLG1CQUFtQixHQUFHLENBQUM7RUFDekI7O0VBRUE7RUFDQSxJQUNFaEMsS0FBSyxDQUFDQyxPQUFPLENBQUNWLFFBQVEsQ0FBQyxJQUN2QkEsUUFBUSxDQUFDTCxNQUFNLEtBQUssQ0FBQyxJQUNyQmdCLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JXLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FDNUI1QixTQUFTLEtBQUssQ0FBQyxJQUFJQSxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQ3BDO0lBQ0E7SUFDQSxJQUFNc0UsUUFBUSxHQUFHQyxJQUFJLENBQUNDLEtBQUssQ0FBQ04sUUFBUSxDQUFDQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLElBQU1NLGFBQWEsR0FBR1AsUUFBUSxDQUFDQyxJQUFJLEdBQUcsQ0FBQztJQUN2QztJQUNBLEtBQUssSUFBSWpELENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR29ELFFBQVEsR0FBR0csYUFBYSxFQUFFdkQsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNwRCxJQUFNd0QsU0FBUyxHQUFHLENBQ2hCOUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHVixDQUFDLEdBQUdrRCxtQkFBbUIsRUFDckN4QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUdWLENBQUMsR0FBR21ELG1CQUFtQixDQUN0QztNQUNESCxRQUFRLENBQUMvQyxhQUFhLENBQUNRLElBQUksQ0FBQytDLFNBQVMsQ0FBQztJQUN4QztJQUNBO0lBQ0EsS0FBSyxJQUFJeEQsRUFBQyxHQUFHLENBQUMsRUFBRUEsRUFBQyxHQUFHb0QsUUFBUSxFQUFFcEQsRUFBQyxJQUFJLENBQUMsRUFBRTtNQUNwQyxJQUFNd0QsVUFBUyxHQUFHLENBQ2hCOUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNWLEVBQUMsR0FBRyxDQUFDLElBQUlrRCxtQkFBbUIsRUFDM0N4QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQ1YsRUFBQyxHQUFHLENBQUMsSUFBSW1ELG1CQUFtQixDQUM1QztNQUNESCxRQUFRLENBQUMvQyxhQUFhLENBQUNRLElBQUksQ0FBQytDLFVBQVMsQ0FBQztJQUN4QztFQUNGO0VBRUEsT0FBT1IsUUFBUTtBQUNqQixDQUFDO0FBQ0QsaUVBQWUxRSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUM3RnNCOztBQUV6QztBQUNBLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFRQSxDQUFJaUIsVUFBVSxFQUFLO0VBQy9CLElBQU1pRSxVQUFVLEdBQUcsRUFBRTtFQUNyQixJQUFNQyxTQUFTLEdBQUcsRUFBRTtFQUNwQixJQUFNQyxLQUFLLEdBQUduRSxVQUFVO0VBQ3hCLElBQVFILElBQUksR0FBYUcsVUFBVSxDQUEzQkgsSUFBSTtJQUFFRCxNQUFNLEdBQUtJLFVBQVUsQ0FBckJKLE1BQU07RUFDcEIsSUFBSXdFLFlBQVksR0FBRyxFQUFFOztFQUVyQjtFQUNBLElBQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBZUEsQ0FBSUMsZUFBZSxFQUFLO0lBQzNDLElBQUlDLFFBQVEsR0FBRyxLQUFLO0lBRXBCMUUsSUFBSSxDQUFDbUIsT0FBTyxDQUFDLFVBQUNnQixHQUFHLEVBQUs7TUFDcEIsSUFBSXNDLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBS3RDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSXNDLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBS3RDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsRXVDLFFBQVEsR0FBRyxJQUFJO01BQ2pCO0lBQ0YsQ0FBQyxDQUFDO0lBRUYzRSxNQUFNLENBQUNvQixPQUFPLENBQUMsVUFBQ3dELElBQUksRUFBSztNQUN2QixJQUFJRixlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUtFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSUYsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDcEVELFFBQVEsR0FBRyxJQUFJO01BQ2pCO0lBQ0YsQ0FBQyxDQUFDO0lBRUYsT0FBT0EsUUFBUTtFQUNqQixDQUFDOztFQUVEO0VBQ0EsSUFBTUUsWUFBWSxHQUFHLFNBQWZBLFlBQVlBLENBQUEsRUFBUztJQUN6QixJQUFNQyxDQUFDLEdBQUdiLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNjLE1BQU0sQ0FBQyxDQUFDLEdBQUdULFNBQVMsQ0FBQztJQUMvQyxJQUFNVSxDQUFDLEdBQUdmLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNjLE1BQU0sQ0FBQyxDQUFDLEdBQUdWLFVBQVUsQ0FBQztJQUNoREcsWUFBWSxHQUFHLENBQUNNLENBQUMsRUFBRUUsQ0FBQyxDQUFDO0VBQ3ZCLENBQUM7O0VBRUQ7RUFDQUgsWUFBWSxDQUFDLENBQUM7RUFDZCxPQUFPSixlQUFlLENBQUNELFlBQVksQ0FBQyxFQUFFO0lBQ3BDSyxZQUFZLENBQUMsQ0FBQztFQUNoQjs7RUFFQTtFQUNBSSxVQUFVLENBQUMsWUFBTTtJQUNmO0lBQ0E3RSxVQUFVLENBQ1BOLGFBQWEsQ0FBQzBFLFlBQVk7SUFDM0I7SUFBQSxDQUNDVSxJQUFJLENBQUMsVUFBQ0MsTUFBTSxFQUFLO01BQ2hCLElBQUlBLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDbkI7UUFDQS9FLFVBQVUsQ0FBQ0MsTUFBTSxDQUFDK0UsT0FBTyxDQUFDWixZQUFZLENBQUM7UUFDdkM7UUFDQXBGLHdEQUFPLENBQUMwRCxNQUFNLHFCQUFBQyxNQUFBLENBQXFCeUIsWUFBWSxrQkFBZSxDQUFDO1FBQy9EO1FBQ0FwRSxVQUFVLENBQUNELE9BQU8sQ0FBQyxDQUFDO1FBQ3BCO1FBQ0EsSUFBSUMsVUFBVSxDQUFDRixPQUFPLENBQUMsQ0FBQyxFQUFFO1VBQ3hCO1VBQ0FkLHdEQUFPLENBQUMwRCxNQUFNLENBQ1osc0RBQ0YsQ0FBQztVQUNEO1VBQ0F5QixLQUFLLENBQUNoRSxRQUFRLEdBQUcsSUFBSTtVQUNyQmdFLEtBQUssQ0FBQ25FLFVBQVUsQ0FBQ0csUUFBUSxHQUFHLElBQUk7UUFDbEM7TUFDRixDQUFDLE1BQU0sSUFBSTRFLE1BQU0sS0FBSyxLQUFLLEVBQUU7UUFDM0I7UUFDQS9FLFVBQVUsQ0FBQ0MsTUFBTSxDQUFDZ0YsUUFBUSxDQUFDYixZQUFZLENBQUM7UUFDeEM7UUFDQXBGLHdEQUFPLENBQUMwRCxNQUFNLHFCQUFBQyxNQUFBLENBQXFCeUIsWUFBWSxxQkFBa0IsQ0FBQztNQUNwRTtJQUNGLENBQUMsQ0FBQztJQUVKRCxLQUFLLENBQUN4RSxTQUFTLEdBQUcsSUFBSTtFQUN4QixDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ1IsQ0FBQztBQUVELGlFQUFlWixRQUFROzs7Ozs7Ozs7Ozs7Ozs7QUM5RWU7O0FBRXRDO0FBQ0E7QUFDQSxJQUFNb0csV0FBVyxHQUFHLFNBQWRBLFdBQVdBLENBQUlDLGFBQWEsRUFBRUMsV0FBVyxFQUFFQyxZQUFZLEVBQUs7RUFDaEU7RUFDQTtFQUNBLElBQU1DLFdBQVcsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsc0JBQXNCLENBQUM7RUFDbEUsSUFBTUMsTUFBTSxHQUFHRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztFQUN4RCxJQUFNRSxJQUFJLEdBQUdILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGVBQWUsQ0FBQzs7RUFFcEQ7O0VBRUEsSUFBTUcsVUFBVSxHQUFHVix1REFBVSxDQUMzQixHQUFHLEVBQ0gsR0FBRyxFQUNIO0lBQUUxQyxJQUFJLEVBQUU7RUFBTyxDQUFDLEVBQ2hCNEMsYUFBYSxFQUNiRSxZQUNGLENBQUM7RUFDRCxJQUFNTyxRQUFRLEdBQUdYLHVEQUFVLENBQ3pCLEdBQUcsRUFDSCxHQUFHLEVBQ0g7SUFBRTFDLElBQUksRUFBRTtFQUFLLENBQUMsRUFDZDZDLFdBQVcsRUFDWEMsWUFDRixDQUFDO0VBQ0QsSUFBTVEsZUFBZSxHQUFHWix1REFBVSxDQUNoQyxHQUFHLEVBQ0gsR0FBRyxFQUNIO0lBQUUxQyxJQUFJLEVBQUU7RUFBWSxDQUFDLEVBQ3JCNEMsYUFBYSxFQUNiRSxZQUFZLEVBQ1pNLFVBQ0YsQ0FBQzs7RUFFRDtFQUNBTCxXQUFXLENBQUNRLFVBQVUsQ0FBQ0MsWUFBWSxDQUFDRixlQUFlLEVBQUVQLFdBQVcsQ0FBQztFQUNqRUcsTUFBTSxDQUFDSyxVQUFVLENBQUNDLFlBQVksQ0FBQ0osVUFBVSxFQUFFRixNQUFNLENBQUM7RUFDbERDLElBQUksQ0FBQ0ksVUFBVSxDQUFDQyxZQUFZLENBQUNILFFBQVEsRUFBRUYsSUFBSSxDQUFDOztFQUU1QztFQUNBLE9BQU87SUFBRUcsZUFBZSxFQUFmQSxlQUFlO0lBQUVGLFVBQVUsRUFBVkEsVUFBVTtJQUFFQyxRQUFRLEVBQVJBO0VBQVMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsaUVBQWVWLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDMUI7QUFDeUM7QUFFekMsSUFBTWMsWUFBWSxHQUFHLFNBQWZBLFlBQVlBLENBQ2hCQyxLQUFLLEVBQ0xDLEtBQUssRUFDTEMsT0FBTyxFQUNQbEQsU0FBUyxFQUNUb0MsWUFBWSxFQUNaTSxVQUFVLEVBQ1A7RUFDSDtFQUNBO0VBQ0EsSUFBUXZHLEtBQUssR0FBSzZELFNBQVMsQ0FBbkI3RCxLQUFLO0VBRWIsSUFBSWdILGVBQWUsR0FBRyxJQUFJO0VBQzFCLElBQUlULFVBQVUsRUFBRTtJQUFBLElBQUFVLHFCQUFBLEdBQUFDLGNBQUEsQ0FDTVgsVUFBVSxDQUFDWSxVQUFVO0lBQXhDSCxlQUFlLEdBQUFDLHFCQUFBO0VBQ2xCOztFQUVBOztFQUVBO0VBQ0E7RUFDQSxJQUFNckMsVUFBVSxHQUFHLEVBQUU7RUFDckIsSUFBTUMsU0FBUyxHQUFHLEVBQUU7RUFDcEIsSUFBSXVDLFdBQVcsR0FBRyxJQUFJOztFQUV0QjtFQUNBLElBQU1DLGVBQWUsR0FBR2xCLFFBQVEsQ0FBQ21CLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDckRELGVBQWUsQ0FBQ0UsU0FBUyxDQUFDQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7O0VBRWpEO0VBQ0E7RUFDQSxJQUFNQyxXQUFXLEdBQUd0QixRQUFRLENBQUNtQixhQUFhLENBQUMsUUFBUSxDQUFDO0VBQ3BERCxlQUFlLENBQUNLLFdBQVcsQ0FBQ0QsV0FBVyxDQUFDO0VBQ3hDQSxXQUFXLENBQUNFLEtBQUssR0FBR2QsS0FBSztFQUN6QlksV0FBVyxDQUFDRyxNQUFNLEdBQUdkLEtBQUs7RUFDMUIsSUFBTWUsUUFBUSxHQUFHSixXQUFXLENBQUNLLFVBQVUsQ0FBQyxJQUFJLENBQUM7O0VBRTdDO0VBQ0EsSUFBTUMsYUFBYSxHQUFHNUIsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUN0REQsZUFBZSxDQUFDSyxXQUFXLENBQUNLLGFBQWEsQ0FBQztFQUMxQ0EsYUFBYSxDQUFDSixLQUFLLEdBQUdkLEtBQUs7RUFDM0JrQixhQUFhLENBQUNILE1BQU0sR0FBR2QsS0FBSztFQUM1QixJQUFNa0IsVUFBVSxHQUFHRCxhQUFhLENBQUNELFVBQVUsQ0FBQyxJQUFJLENBQUM7O0VBRWpEO0VBQ0EsSUFBTUcsU0FBUyxHQUFHUixXQUFXLENBQUNFLEtBQUssR0FBRzlDLFNBQVMsQ0FBQyxDQUFDO0VBQ2pELElBQU1xRCxTQUFTLEdBQUdULFdBQVcsQ0FBQ0csTUFBTSxHQUFHaEQsVUFBVSxDQUFDLENBQUM7O0VBRW5EOztFQUVBO0VBQ0E7RUFDQSxJQUFNdUQsWUFBWSxHQUFHLFNBQWZBLFlBQVlBLENBQUlDLEtBQUssRUFBSztJQUM5QixJQUFNQyxJQUFJLEdBQUdaLFdBQVcsQ0FBQ2EscUJBQXFCLENBQUMsQ0FBQztJQUNoRCxJQUFNQyxNQUFNLEdBQUdILEtBQUssQ0FBQ0ksT0FBTyxHQUFHSCxJQUFJLENBQUNJLElBQUk7SUFDeEMsSUFBTUMsTUFBTSxHQUFHTixLQUFLLENBQUNPLE9BQU8sR0FBR04sSUFBSSxDQUFDTyxHQUFHO0lBRXZDLElBQU1DLEtBQUssR0FBR3JFLElBQUksQ0FBQ0MsS0FBSyxDQUFDOEQsTUFBTSxHQUFHTixTQUFTLENBQUM7SUFDNUMsSUFBTWEsS0FBSyxHQUFHdEUsSUFBSSxDQUFDQyxLQUFLLENBQUNpRSxNQUFNLEdBQUdSLFNBQVMsQ0FBQztJQUU1QyxPQUFPLENBQUNXLEtBQUssRUFBRUMsS0FBSyxDQUFDO0VBQ3ZCLENBQUM7O0VBRUQ7RUFDQSxJQUFNOUQsZUFBZSxHQUFHLFNBQWxCQSxlQUFlQSxDQUFJQyxlQUFlLEVBQUs7SUFDM0MsSUFBSUMsUUFBUSxHQUFHLEtBQUs7SUFDcEJyQixTQUFTLENBQUNyRCxJQUFJLENBQUNtQixPQUFPLENBQUMsVUFBQ2dCLEdBQUcsRUFBSztNQUM5QixJQUFJc0MsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLdEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJc0MsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLdEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xFdUMsUUFBUSxHQUFHLElBQUk7TUFDakI7SUFDRixDQUFDLENBQUM7SUFFRnJCLFNBQVMsQ0FBQ3RELE1BQU0sQ0FBQ29CLE9BQU8sQ0FBQyxVQUFDd0QsSUFBSSxFQUFLO01BQ2pDLElBQUlGLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBS0UsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJRixlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUtFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNwRUQsUUFBUSxHQUFHLElBQUk7TUFDakI7SUFDRixDQUFDLENBQUM7SUFFRixPQUFPQSxRQUFRO0VBQ2pCLENBQUM7O0VBRUQ7O0VBRUE7RUFDQTtFQUNBLElBQU02RCxTQUFTLEdBQUcsU0FBWkEsU0FBU0EsQ0FBSUMsT0FBTyxFQUFLO0lBQzdCO0lBQ0EsSUFBTUMsUUFBUSxHQUFHekUsSUFBSSxDQUFDMEUsR0FBRyxDQUFDckMsS0FBSyxFQUFFQyxLQUFLLENBQUMsR0FBRyxFQUFFO0lBQzVDLElBQU1xQyxTQUFTLEdBQUcsT0FBTztJQUN6QkgsT0FBTyxDQUFDSSxXQUFXLEdBQUdELFNBQVM7SUFDL0JILE9BQU8sQ0FBQ0ssU0FBUyxHQUFHLENBQUM7O0lBRXJCO0lBQ0EsS0FBSyxJQUFJaEUsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxJQUFJd0IsS0FBSyxFQUFFeEIsQ0FBQyxJQUFJNEQsUUFBUSxFQUFFO01BQ3pDRCxPQUFPLENBQUNNLFNBQVMsQ0FBQyxDQUFDO01BQ25CTixPQUFPLENBQUNPLE1BQU0sQ0FBQ2xFLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDcEIyRCxPQUFPLENBQUNRLE1BQU0sQ0FBQ25FLENBQUMsRUFBRXlCLEtBQUssQ0FBQztNQUN4QmtDLE9BQU8sQ0FBQ1MsTUFBTSxDQUFDLENBQUM7SUFDbEI7O0lBRUE7SUFDQSxLQUFLLElBQUlsRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLElBQUl1QixLQUFLLEVBQUV2QixDQUFDLElBQUkwRCxRQUFRLEVBQUU7TUFDekNELE9BQU8sQ0FBQ00sU0FBUyxDQUFDLENBQUM7TUFDbkJOLE9BQU8sQ0FBQ08sTUFBTSxDQUFDLENBQUMsRUFBRWhFLENBQUMsQ0FBQztNQUNwQnlELE9BQU8sQ0FBQ1EsTUFBTSxDQUFDM0MsS0FBSyxFQUFFdEIsQ0FBQyxDQUFDO01BQ3hCeUQsT0FBTyxDQUFDUyxNQUFNLENBQUMsQ0FBQztJQUNsQjtFQUNGLENBQUM7O0VBRUQ7RUFDQSxJQUFNQyx1QkFBdUIsR0FBRyxTQUExQkEsdUJBQXVCQSxDQUMzQnpFLGVBQWUsRUFLWjtJQUFBLElBSkg0RCxLQUFLLEdBQUEvRyxTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBR21HLFNBQVM7SUFBQSxJQUNqQmEsS0FBSyxHQUFBaEgsU0FBQSxDQUFBTixNQUFBLFFBQUFNLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUdvRyxTQUFTO0lBQUEsSUFDakJ5QixVQUFVLEdBQUE3SCxTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRzlCLEtBQUssQ0FBQ3dCLE1BQU07SUFBQSxJQUN6QnZCLFNBQVMsR0FBQTZCLFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHK0IsU0FBUyxDQUFDNUQsU0FBUztJQUUvQjtJQUNBK0gsVUFBVSxDQUFDNEIsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU3QixhQUFhLENBQUNKLEtBQUssRUFBRUksYUFBYSxDQUFDSCxNQUFNLENBQUM7SUFDckU7SUFDQSxTQUFTaUMsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU7TUFDNUIvQixVQUFVLENBQUNnQyxRQUFRLENBQUNGLElBQUksR0FBR2pCLEtBQUssRUFBRWtCLElBQUksR0FBR2pCLEtBQUssRUFBRUQsS0FBSyxFQUFFQyxLQUFLLENBQUM7SUFDL0Q7O0lBRUE7SUFDQSxJQUFJbUIsVUFBVTtJQUNkLElBQUlOLFVBQVUsS0FBSyxDQUFDLEVBQUVNLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FDaEMsSUFBSU4sVUFBVSxLQUFLLENBQUMsSUFBSUEsVUFBVSxLQUFLLENBQUMsRUFBRU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUN6REEsVUFBVSxHQUFHTixVQUFVLEdBQUcsQ0FBQzs7SUFFaEM7SUFDQSxJQUFJTyxVQUFVLEdBQUcsQ0FBQztJQUNsQixJQUFJQyxVQUFVLEdBQUcsQ0FBQztJQUVsQixJQUFJbEssU0FBUyxLQUFLLENBQUMsRUFBRTtNQUNuQmtLLFVBQVUsR0FBRyxDQUFDO01BQ2RELFVBQVUsR0FBRyxDQUFDO0lBQ2hCLENBQUMsTUFBTSxJQUFJakssU0FBUyxLQUFLLENBQUMsRUFBRTtNQUMxQmtLLFVBQVUsR0FBRyxDQUFDO01BQ2RELFVBQVUsR0FBRyxDQUFDO0lBQ2hCOztJQUVBO0lBQ0EsSUFBTUUsY0FBYyxHQUFHNUYsSUFBSSxDQUFDQyxLQUFLLENBQUN3RixVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELElBQU1JLGVBQWUsR0FBR0osVUFBVSxHQUFHLENBQUM7O0lBRXRDO0lBQ0E7SUFDQSxJQUFNSyxjQUFjLEdBQ2xCckYsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUNtRixjQUFjLEdBQUdDLGVBQWUsR0FBRyxDQUFDLElBQUlILFVBQVU7SUFDMUUsSUFBTUssY0FBYyxHQUNsQnRGLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDbUYsY0FBYyxHQUFHQyxlQUFlLEdBQUcsQ0FBQyxJQUFJRixVQUFVO0lBQzFFLElBQU1LLGNBQWMsR0FBR3ZGLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBR21GLGNBQWMsR0FBR0YsVUFBVTtJQUN2RSxJQUFNTyxjQUFjLEdBQUd4RixlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUdtRixjQUFjLEdBQUdELFVBQVU7O0lBRXZFO0lBQ0EsSUFBTU8sSUFBSSxHQUFHSixjQUFjLEdBQUd6QixLQUFLO0lBQ25DLElBQU04QixJQUFJLEdBQUdKLGNBQWMsR0FBR3pCLEtBQUs7SUFDbkMsSUFBTThCLElBQUksR0FBR0osY0FBYyxHQUFHM0IsS0FBSztJQUNuQyxJQUFNZ0MsSUFBSSxHQUFHSixjQUFjLEdBQUczQixLQUFLOztJQUVuQztJQUNBLElBQU1nQyxhQUFhLEdBQ2pCSixJQUFJLElBQUkzQyxhQUFhLENBQUNKLEtBQUssSUFDM0JnRCxJQUFJLElBQUk1QyxhQUFhLENBQUNILE1BQU0sSUFDNUJnRCxJQUFJLEdBQUcsQ0FBQyxJQUNSQyxJQUFJLEdBQUcsQ0FBQzs7SUFFVjtJQUNBN0MsVUFBVSxDQUFDK0MsU0FBUyxHQUFHRCxhQUFhLEdBQUcsS0FBSyxHQUFHLE1BQU07O0lBRXJEO0lBQ0FqQixRQUFRLENBQUM1RSxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUVBLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFFaEQ7SUFDQSxLQUFLLElBQUk5RCxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdpSixjQUFjLEdBQUdDLGVBQWUsRUFBRWxKLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDNUQsSUFBTTZKLEtBQUssR0FBRy9GLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRzlELENBQUMsR0FBRytJLFVBQVU7TUFDakQsSUFBTWUsS0FBSyxHQUFHaEcsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHOUQsQ0FBQyxHQUFHZ0osVUFBVTtNQUNqRE4sUUFBUSxDQUFDbUIsS0FBSyxFQUFFQyxLQUFLLENBQUM7SUFDeEI7O0lBRUE7SUFDQTtJQUNBLEtBQUssSUFBSTlKLEdBQUMsR0FBRyxDQUFDLEVBQUVBLEdBQUMsR0FBR2lKLGNBQWMsRUFBRWpKLEdBQUMsSUFBSSxDQUFDLEVBQUU7TUFDMUMsSUFBTTZKLE1BQUssR0FBRy9GLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOUQsR0FBQyxHQUFHLENBQUMsSUFBSStJLFVBQVU7TUFDdkQsSUFBTWUsTUFBSyxHQUFHaEcsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM5RCxHQUFDLEdBQUcsQ0FBQyxJQUFJZ0osVUFBVTtNQUN2RE4sUUFBUSxDQUFDbUIsTUFBSyxFQUFFQyxNQUFLLENBQUM7SUFDeEI7RUFDRixDQUFDOztFQUVEO0VBQ0EsSUFBTUMsZUFBZSxHQUFHLFNBQWxCQSxlQUFlQSxDQUNuQmpHLGVBQWUsRUFHWjtJQUFBLElBRkg0RCxLQUFLLEdBQUEvRyxTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBR21HLFNBQVM7SUFBQSxJQUNqQmEsS0FBSyxHQUFBaEgsU0FBQSxDQUFBTixNQUFBLFFBQUFNLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUdvRyxTQUFTO0lBRWpCO0lBQ0FGLFVBQVUsQ0FBQzRCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFN0IsYUFBYSxDQUFDSixLQUFLLEVBQUVJLGFBQWEsQ0FBQ0gsTUFBTSxDQUFDOztJQUVyRTtJQUNBSSxVQUFVLENBQUMrQyxTQUFTLEdBQUcsS0FBSzs7SUFFNUI7SUFDQSxJQUFJL0YsZUFBZSxDQUFDQyxlQUFlLENBQUMsRUFBRTs7SUFFdEM7SUFDQStDLFVBQVUsQ0FBQ2dDLFFBQVEsQ0FDakIvRSxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUc0RCxLQUFLLEVBQzFCNUQsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHNkQsS0FBSyxFQUMxQkQsS0FBSyxFQUNMQyxLQUNGLENBQUM7RUFDSCxDQUFDOztFQUVEO0VBQ0F6QixlQUFlLENBQUMxQixPQUFPLEdBQUcsVUFBQ3dGLFdBQVc7SUFBQSxPQUNwQzFELFdBQVcsQ0FBQzJELFdBQVcsQ0FBQ0QsV0FBVyxFQUFFLENBQUMsQ0FBQztFQUFBO0VBQ3pDOUQsZUFBZSxDQUFDekIsUUFBUSxHQUFHLFVBQUN1RixXQUFXO0lBQUEsT0FDckMxRCxXQUFXLENBQUMyRCxXQUFXLENBQUNELFdBQVcsRUFBRSxDQUFDLENBQUM7RUFBQTs7RUFFekM7O0VBRUE7RUFDQTtFQUNBO0VBQ0ExRCxXQUFXLENBQUM0RCxTQUFTLEdBQUcsWUFJbkI7SUFBQSxJQUhIQyxXQUFXLEdBQUF4SixTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRzlCLEtBQUs7SUFBQSxJQUNuQjZJLEtBQUssR0FBQS9HLFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHbUcsU0FBUztJQUFBLElBQ2pCYSxLQUFLLEdBQUFoSCxTQUFBLENBQUFOLE1BQUEsUUFBQU0sU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBR29HLFNBQVM7SUFFakI7SUFDQSxTQUFTMkIsUUFBUUEsQ0FBQ0MsSUFBSSxFQUFFQyxJQUFJLEVBQUU7TUFDNUJsQyxRQUFRLENBQUNtQyxRQUFRLENBQUNGLElBQUksR0FBR2pCLEtBQUssRUFBRWtCLElBQUksR0FBR2pCLEtBQUssRUFBRUQsS0FBSyxFQUFFQyxLQUFLLENBQUM7SUFDN0Q7SUFFQXdDLFdBQVcsQ0FBQzNKLE9BQU8sQ0FBQyxVQUFDWCxJQUFJLEVBQUs7TUFDNUJBLElBQUksQ0FBQ0ksYUFBYSxDQUFDTyxPQUFPLENBQUMsVUFBQ0osSUFBSSxFQUFLO1FBQ25Dc0ksUUFBUSxDQUFDdEksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFQSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0VBQ0osQ0FBQzs7RUFFRDtFQUNBa0csV0FBVyxDQUFDMkQsV0FBVyxHQUFHLFVBQ3hCbkcsZUFBZSxFQUlaO0lBQUEsSUFISDlCLElBQUksR0FBQXJCLFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHLENBQUM7SUFBQSxJQUNSK0csS0FBSyxHQUFBL0csU0FBQSxDQUFBTixNQUFBLFFBQUFNLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUdtRyxTQUFTO0lBQUEsSUFDakJhLEtBQUssR0FBQWhILFNBQUEsQ0FBQU4sTUFBQSxRQUFBTSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHb0csU0FBUztJQUVqQjtJQUNBTCxRQUFRLENBQUNrRCxTQUFTLEdBQUcsT0FBTztJQUM1QixJQUFJNUgsSUFBSSxLQUFLLENBQUMsRUFBRTBFLFFBQVEsQ0FBQ2tELFNBQVMsR0FBRyxLQUFLO0lBQzFDO0lBQ0EsSUFBTVEsTUFBTSxHQUFHMUMsS0FBSyxHQUFHQyxLQUFLLEdBQUdBLEtBQUssR0FBRyxDQUFDLEdBQUdELEtBQUssR0FBRyxDQUFDO0lBQ3BEO0lBQ0FoQixRQUFRLENBQUN5QixTQUFTLENBQUMsQ0FBQztJQUNwQnpCLFFBQVEsQ0FBQzJELEdBQUcsQ0FDVnZHLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRzRELEtBQUssR0FBR0EsS0FBSyxHQUFHLENBQUMsRUFDdEM1RCxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUc2RCxLQUFLLEdBQUdBLEtBQUssR0FBRyxDQUFDLEVBQ3RDeUMsTUFBTSxFQUNOLENBQUMsRUFDRCxDQUFDLEdBQUcvRyxJQUFJLENBQUNpSCxFQUNYLENBQUM7SUFDRDVELFFBQVEsQ0FBQzRCLE1BQU0sQ0FBQyxDQUFDO0lBQ2pCNUIsUUFBUSxDQUFDNkQsSUFBSSxDQUFDLENBQUM7RUFDakIsQ0FBQzs7RUFFRDtFQUNBO0VBQ0EzRCxhQUFhLENBQUM0RCxnQkFBZ0IsR0FBRyxVQUFDdkQsS0FBSyxFQUFLO0lBQzFDQSxLQUFLLENBQUN3RCxjQUFjLENBQUMsQ0FBQztJQUN0QnhELEtBQUssQ0FBQ3lELGVBQWUsQ0FBQyxDQUFDO0lBQ3ZCLElBQU1DLFFBQVEsR0FBRyxJQUFJQyxVQUFVLENBQUMsT0FBTyxFQUFFO01BQ3ZDQyxPQUFPLEVBQUU1RCxLQUFLLENBQUM0RCxPQUFPO01BQ3RCQyxVQUFVLEVBQUU3RCxLQUFLLENBQUM2RCxVQUFVO01BQzVCekQsT0FBTyxFQUFFSixLQUFLLENBQUNJLE9BQU87TUFDdEJHLE9BQU8sRUFBRVAsS0FBSyxDQUFDTztJQUNqQixDQUFDLENBQUM7SUFDRmxCLFdBQVcsQ0FBQ3lFLGFBQWEsQ0FBQ0osUUFBUSxDQUFDO0VBQ3JDLENBQUM7O0VBRUQ7RUFDQS9ELGFBQWEsQ0FBQ29FLGdCQUFnQixHQUFHLFlBQU07SUFDckNuRSxVQUFVLENBQUM0QixTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTdCLGFBQWEsQ0FBQ0osS0FBSyxFQUFFSSxhQUFhLENBQUNILE1BQU0sQ0FBQztJQUNyRVIsV0FBVyxHQUFHLElBQUk7RUFDcEIsQ0FBQzs7RUFFRDs7RUFFQTtFQUNBO0VBQ0EsSUFBSUwsT0FBTyxDQUFDNUQsSUFBSSxLQUFLLFdBQVcsRUFBRTtJQUNoQztJQUNBa0UsZUFBZSxDQUFDRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQztJQUMzRDtJQUNBTyxhQUFhLENBQUNxRSxlQUFlLEdBQUcsVUFBQ2hFLEtBQUssRUFBSztNQUN6QztNQUNBLElBQU1pRSxTQUFTLEdBQUdsRSxZQUFZLENBQUNDLEtBQUssQ0FBQztNQUNyQztNQUNBLElBQ0UsRUFDRWhCLFdBQVcsSUFDWEEsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLaUYsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUMvQmpGLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBS2lGLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FDaEMsRUFDRDtRQUNBO1FBQ0EzQyx1QkFBdUIsQ0FBQzJDLFNBQVMsQ0FBQztNQUNwQzs7TUFFQTtNQUNBakYsV0FBVyxHQUFHaUYsU0FBUztJQUN6QixDQUFDOztJQUVEO0lBQ0E1RSxXQUFXLENBQUNrRSxnQkFBZ0IsR0FBRyxVQUFDdkQsS0FBSyxFQUFLO01BQ3hDLElBQU1pRSxTQUFTLEdBQUdsRSxZQUFZLENBQUNDLEtBQUssQ0FBQzs7TUFFckM7TUFDQXZFLFNBQVMsQ0FBQ3pELE9BQU8sQ0FBQ2lNLFNBQVMsQ0FBQztNQUM1QjVFLFdBQVcsQ0FBQzRELFNBQVMsQ0FBQyxDQUFDO01BQ3ZCckUsZUFBZSxDQUFDcUUsU0FBUyxDQUFDLENBQUM7TUFDM0JwRixZQUFZLENBQUNxRyxZQUFZLENBQUMsQ0FBQztJQUM3QixDQUFDO0VBQ0g7RUFDQTtFQUFBLEtBQ0ssSUFBSXZGLE9BQU8sQ0FBQzVELElBQUksS0FBSyxNQUFNLEVBQUU7SUFDaEM7SUFDQWtFLGVBQWUsQ0FBQ0UsU0FBUyxDQUFDQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7SUFDdEQ7SUFDQU8sYUFBYSxDQUFDcUUsZUFBZSxHQUFHLFlBQU07TUFDcEM7SUFBQSxDQUNEO0lBQ0Q7SUFDQTNFLFdBQVcsQ0FBQ2tFLGdCQUFnQixHQUFHLFlBQU07TUFDbkM7SUFBQSxDQUNEO0VBQ0g7RUFDQTtFQUFBLEtBQ0ssSUFBSTVFLE9BQU8sQ0FBQzVELElBQUksS0FBSyxJQUFJLEVBQUU7SUFDOUI7SUFDQWtFLGVBQWUsQ0FBQ0UsU0FBUyxDQUFDQyxHQUFHLENBQUMscUJBQXFCLENBQUM7SUFDcEQ7SUFDQU8sYUFBYSxDQUFDcUUsZUFBZSxHQUFHLFVBQUNoRSxLQUFLLEVBQUs7TUFDekM7TUFDQSxJQUFNaUUsU0FBUyxHQUFHbEUsWUFBWSxDQUFDQyxLQUFLLENBQUM7O01BRXJDO01BQ0EsSUFDRSxFQUNFaEIsV0FBVyxJQUNYQSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUtpRixTQUFTLENBQUMsQ0FBQyxDQUFDLElBQy9CakYsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLaUYsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUNoQyxFQUNEO1FBQ0E7UUFDQW5CLGVBQWUsQ0FBQ21CLFNBQVMsQ0FBQztNQUM1QjtNQUNBO0lBQ0YsQ0FBQztJQUNEO0lBQ0E1RSxXQUFXLENBQUNrRSxnQkFBZ0IsR0FBRyxVQUFDdkQsS0FBSyxFQUFLO01BQ3hDO01BQ0EsSUFBTW1FLE9BQU8sR0FBRzFJLFNBQVM7TUFDekI7TUFDQSxJQUFJMEksT0FBTyxDQUFDNUwsVUFBVSxDQUFDTCxTQUFTLEtBQUssS0FBSyxFQUFFO01BQzVDO01BQ0EsSUFBTStMLFNBQVMsR0FBR2xFLFlBQVksQ0FBQ0MsS0FBSyxDQUFDO01BQ3JDO01BQ0EsSUFBSXBELGVBQWUsQ0FBQ3FILFNBQVMsQ0FBQyxFQUFFO1FBQzlCO01BQUEsQ0FDRCxNQUFNLElBQUl4SSxTQUFTLENBQUMvQyxRQUFRLEtBQUssS0FBSyxFQUFFO1FBQ3ZDO1FBQ0F5TCxPQUFPLENBQUM1TCxVQUFVLENBQUNMLFNBQVMsR0FBRyxLQUFLO1FBQ3BDO1FBQ0FYLHdEQUFPLENBQUM2TSxLQUFLLENBQUMsQ0FBQztRQUNmN00sd0RBQU8sQ0FBQzBELE1BQU0sdUJBQUFDLE1BQUEsQ0FBdUIrSSxTQUFTLENBQUUsQ0FBQztRQUNqRDtRQUNBeEksU0FBUyxDQUFDeEQsYUFBYSxDQUFDZ00sU0FBUyxDQUFDLENBQUM1RyxJQUFJLENBQUMsVUFBQ0MsTUFBTSxFQUFLO1VBQ2xEO1VBQ0EsSUFBSUEsTUFBTSxLQUFLLElBQUksRUFBRTtZQUNuQjtZQUNBK0IsV0FBVyxDQUFDMkQsV0FBVyxDQUFDaUIsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNyQztZQUNBMU0sd0RBQU8sQ0FBQzBELE1BQU0sQ0FBQyxhQUFhLENBQUM7WUFDN0I7WUFDQWtKLE9BQU8sQ0FBQzdMLE9BQU8sQ0FBQyxDQUFDO1lBQ2pCO1lBQ0EsSUFBSTZMLE9BQU8sQ0FBQzlMLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Y0FDckI7Y0FDQWQsd0RBQU8sQ0FBQzBELE1BQU0sQ0FDWiw0REFDRixDQUFDO2NBQ0Q7Y0FDQWtKLE9BQU8sQ0FBQ3pMLFFBQVEsR0FBRyxJQUFJO2NBQ3ZCeUwsT0FBTyxDQUFDNUwsVUFBVSxDQUFDRyxRQUFRLEdBQUcsSUFBSTtZQUNwQyxDQUFDLE1BQU07Y0FDTDtjQUNBbkIsd0RBQU8sQ0FBQzBELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztjQUN6QztjQUNBUSxTQUFTLENBQUNqQixXQUFXLENBQUMsQ0FBQztZQUN6QjtVQUNGLENBQUMsTUFBTSxJQUFJOEMsTUFBTSxLQUFLLEtBQUssRUFBRTtZQUMzQjtZQUNBK0IsV0FBVyxDQUFDMkQsV0FBVyxDQUFDaUIsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNyQztZQUNBMU0sd0RBQU8sQ0FBQzBELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztZQUNoQztZQUNBMUQsd0RBQU8sQ0FBQzBELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztZQUN6QztZQUNBUSxTQUFTLENBQUNqQixXQUFXLENBQUMsQ0FBQztVQUN6QjtRQUNGLENBQUMsQ0FBQztRQUNGO1FBQ0FvRixVQUFVLENBQUM0QixTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTdCLGFBQWEsQ0FBQ0osS0FBSyxFQUFFSSxhQUFhLENBQUNILE1BQU0sQ0FBQztNQUN2RTtJQUNGLENBQUM7RUFDSDtFQUNBOztFQUVBO0VBQ0E7RUFDQUgsV0FBVyxDQUFDZ0YsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNDLENBQUM7SUFBQSxPQUFLakYsV0FBVyxDQUFDa0UsZ0JBQWdCLENBQUNlLENBQUMsQ0FBQztFQUFBLEVBQUM7RUFDN0U7RUFDQTNFLGFBQWEsQ0FBQzBFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDQyxDQUFDO0lBQUEsT0FDeEMzRSxhQUFhLENBQUM0RCxnQkFBZ0IsQ0FBQ2UsQ0FBQyxDQUFDO0VBQUEsQ0FDbkMsQ0FBQztFQUNEO0VBQ0EzRSxhQUFhLENBQUMwRSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQ0MsQ0FBQztJQUFBLE9BQzVDM0UsYUFBYSxDQUFDcUUsZUFBZSxDQUFDTSxDQUFDLENBQUM7RUFBQSxDQUNsQyxDQUFDO0VBQ0Q7RUFDQTNFLGFBQWEsQ0FBQzBFLGdCQUFnQixDQUFDLFlBQVksRUFBRTtJQUFBLE9BQzNDMUUsYUFBYSxDQUFDb0UsZ0JBQWdCLENBQUMsQ0FBQztFQUFBLENBQ2xDLENBQUM7O0VBRUQ7RUFDQXBELFNBQVMsQ0FBQ2xCLFFBQVEsQ0FBQzs7RUFFbkI7RUFDQSxPQUFPUixlQUFlO0FBQ3hCLENBQUM7QUFFRCxpRUFBZVQsWUFBWTs7Ozs7Ozs7Ozs7Ozs7OytDQzdiM0IscUpBQUErRixtQkFBQSxZQUFBQSxvQkFBQSxXQUFBQyxPQUFBLFNBQUFBLE9BQUEsT0FBQUMsRUFBQSxHQUFBN0osTUFBQSxDQUFBOEosU0FBQSxFQUFBQyxNQUFBLEdBQUFGLEVBQUEsQ0FBQUcsY0FBQSxFQUFBQyxjQUFBLEdBQUFqSyxNQUFBLENBQUFpSyxjQUFBLGNBQUFDLEdBQUEsRUFBQWhLLEdBQUEsRUFBQWlLLElBQUEsSUFBQUQsR0FBQSxDQUFBaEssR0FBQSxJQUFBaUssSUFBQSxDQUFBQyxLQUFBLEtBQUFDLE9BQUEsd0JBQUFDLE1BQUEsR0FBQUEsTUFBQSxPQUFBQyxjQUFBLEdBQUFGLE9BQUEsQ0FBQUcsUUFBQSxrQkFBQUMsbUJBQUEsR0FBQUosT0FBQSxDQUFBSyxhQUFBLHVCQUFBQyxpQkFBQSxHQUFBTixPQUFBLENBQUFPLFdBQUEsOEJBQUFDLE9BQUFYLEdBQUEsRUFBQWhLLEdBQUEsRUFBQWtLLEtBQUEsV0FBQXBLLE1BQUEsQ0FBQWlLLGNBQUEsQ0FBQUMsR0FBQSxFQUFBaEssR0FBQSxJQUFBa0ssS0FBQSxFQUFBQSxLQUFBLEVBQUFVLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFNBQUFkLEdBQUEsQ0FBQWhLLEdBQUEsV0FBQTJLLE1BQUEsbUJBQUFJLEdBQUEsSUFBQUosTUFBQSxZQUFBQSxPQUFBWCxHQUFBLEVBQUFoSyxHQUFBLEVBQUFrSyxLQUFBLFdBQUFGLEdBQUEsQ0FBQWhLLEdBQUEsSUFBQWtLLEtBQUEsZ0JBQUFjLEtBQUFDLE9BQUEsRUFBQUMsT0FBQSxFQUFBQyxJQUFBLEVBQUFDLFdBQUEsUUFBQUMsY0FBQSxHQUFBSCxPQUFBLElBQUFBLE9BQUEsQ0FBQXRCLFNBQUEsWUFBQTBCLFNBQUEsR0FBQUosT0FBQSxHQUFBSSxTQUFBLEVBQUFDLFNBQUEsR0FBQXpMLE1BQUEsQ0FBQTBMLE1BQUEsQ0FBQUgsY0FBQSxDQUFBekIsU0FBQSxHQUFBOUQsT0FBQSxPQUFBMkYsT0FBQSxDQUFBTCxXQUFBLGdCQUFBckIsY0FBQSxDQUFBd0IsU0FBQSxlQUFBckIsS0FBQSxFQUFBd0IsZ0JBQUEsQ0FBQVQsT0FBQSxFQUFBRSxJQUFBLEVBQUFyRixPQUFBLE1BQUF5RixTQUFBLGFBQUFJLFNBQUFDLEVBQUEsRUFBQTVCLEdBQUEsRUFBQTZCLEdBQUEsbUJBQUE1TCxJQUFBLFlBQUE0TCxHQUFBLEVBQUFELEVBQUEsQ0FBQUUsSUFBQSxDQUFBOUIsR0FBQSxFQUFBNkIsR0FBQSxjQUFBZCxHQUFBLGFBQUE5SyxJQUFBLFdBQUE0TCxHQUFBLEVBQUFkLEdBQUEsUUFBQXJCLE9BQUEsQ0FBQXNCLElBQUEsR0FBQUEsSUFBQSxNQUFBZSxnQkFBQSxnQkFBQVQsVUFBQSxjQUFBVSxrQkFBQSxjQUFBQywyQkFBQSxTQUFBQyxpQkFBQSxPQUFBdkIsTUFBQSxDQUFBdUIsaUJBQUEsRUFBQTdCLGNBQUEscUNBQUE4QixRQUFBLEdBQUFyTSxNQUFBLENBQUFzTSxjQUFBLEVBQUFDLHVCQUFBLEdBQUFGLFFBQUEsSUFBQUEsUUFBQSxDQUFBQSxRQUFBLENBQUFHLE1BQUEsUUFBQUQsdUJBQUEsSUFBQUEsdUJBQUEsS0FBQTFDLEVBQUEsSUFBQUUsTUFBQSxDQUFBaUMsSUFBQSxDQUFBTyx1QkFBQSxFQUFBaEMsY0FBQSxNQUFBNkIsaUJBQUEsR0FBQUcsdUJBQUEsT0FBQUUsRUFBQSxHQUFBTiwwQkFBQSxDQUFBckMsU0FBQSxHQUFBMEIsU0FBQSxDQUFBMUIsU0FBQSxHQUFBOUosTUFBQSxDQUFBMEwsTUFBQSxDQUFBVSxpQkFBQSxZQUFBTSxzQkFBQTVDLFNBQUEsZ0NBQUFuTCxPQUFBLFdBQUFnTyxNQUFBLElBQUE5QixNQUFBLENBQUFmLFNBQUEsRUFBQTZDLE1BQUEsWUFBQVosR0FBQSxnQkFBQWEsT0FBQSxDQUFBRCxNQUFBLEVBQUFaLEdBQUEsc0JBQUFjLGNBQUFwQixTQUFBLEVBQUFxQixXQUFBLGFBQUFDLE9BQUFKLE1BQUEsRUFBQVosR0FBQSxFQUFBMU0sT0FBQSxFQUFBMk4sTUFBQSxRQUFBQyxNQUFBLEdBQUFwQixRQUFBLENBQUFKLFNBQUEsQ0FBQWtCLE1BQUEsR0FBQWxCLFNBQUEsRUFBQU0sR0FBQSxtQkFBQWtCLE1BQUEsQ0FBQTlNLElBQUEsUUFBQXVDLE1BQUEsR0FBQXVLLE1BQUEsQ0FBQWxCLEdBQUEsRUFBQTNCLEtBQUEsR0FBQTFILE1BQUEsQ0FBQTBILEtBQUEsU0FBQUEsS0FBQSxnQkFBQThDLE9BQUEsQ0FBQTlDLEtBQUEsS0FBQUwsTUFBQSxDQUFBaUMsSUFBQSxDQUFBNUIsS0FBQSxlQUFBMEMsV0FBQSxDQUFBek4sT0FBQSxDQUFBK0ssS0FBQSxDQUFBK0MsT0FBQSxFQUFBMUssSUFBQSxXQUFBMkgsS0FBQSxJQUFBMkMsTUFBQSxTQUFBM0MsS0FBQSxFQUFBL0ssT0FBQSxFQUFBMk4sTUFBQSxnQkFBQS9CLEdBQUEsSUFBQThCLE1BQUEsVUFBQTlCLEdBQUEsRUFBQTVMLE9BQUEsRUFBQTJOLE1BQUEsUUFBQUYsV0FBQSxDQUFBek4sT0FBQSxDQUFBK0ssS0FBQSxFQUFBM0gsSUFBQSxXQUFBMkssU0FBQSxJQUFBMUssTUFBQSxDQUFBMEgsS0FBQSxHQUFBZ0QsU0FBQSxFQUFBL04sT0FBQSxDQUFBcUQsTUFBQSxnQkFBQTJLLEtBQUEsV0FBQU4sTUFBQSxVQUFBTSxLQUFBLEVBQUFoTyxPQUFBLEVBQUEyTixNQUFBLFNBQUFBLE1BQUEsQ0FBQUMsTUFBQSxDQUFBbEIsR0FBQSxTQUFBdUIsZUFBQSxFQUFBckQsY0FBQSxvQkFBQUcsS0FBQSxXQUFBQSxNQUFBdUMsTUFBQSxFQUFBWixHQUFBLGFBQUF3QiwyQkFBQSxlQUFBVCxXQUFBLFdBQUF6TixPQUFBLEVBQUEyTixNQUFBLElBQUFELE1BQUEsQ0FBQUosTUFBQSxFQUFBWixHQUFBLEVBQUExTSxPQUFBLEVBQUEyTixNQUFBLGdCQUFBTSxlQUFBLEdBQUFBLGVBQUEsR0FBQUEsZUFBQSxDQUFBN0ssSUFBQSxDQUFBOEssMEJBQUEsRUFBQUEsMEJBQUEsSUFBQUEsMEJBQUEscUJBQUEzQixpQkFBQVQsT0FBQSxFQUFBRSxJQUFBLEVBQUFyRixPQUFBLFFBQUF3SCxLQUFBLHNDQUFBYixNQUFBLEVBQUFaLEdBQUEsd0JBQUF5QixLQUFBLFlBQUFDLEtBQUEsc0RBQUFELEtBQUEsb0JBQUFiLE1BQUEsUUFBQVosR0FBQSxTQUFBMkIsVUFBQSxXQUFBMUgsT0FBQSxDQUFBMkcsTUFBQSxHQUFBQSxNQUFBLEVBQUEzRyxPQUFBLENBQUErRixHQUFBLEdBQUFBLEdBQUEsVUFBQTRCLFFBQUEsR0FBQTNILE9BQUEsQ0FBQTJILFFBQUEsTUFBQUEsUUFBQSxRQUFBQyxjQUFBLEdBQUFDLG1CQUFBLENBQUFGLFFBQUEsRUFBQTNILE9BQUEsT0FBQTRILGNBQUEsUUFBQUEsY0FBQSxLQUFBM0IsZ0JBQUEsbUJBQUEyQixjQUFBLHFCQUFBNUgsT0FBQSxDQUFBMkcsTUFBQSxFQUFBM0csT0FBQSxDQUFBOEgsSUFBQSxHQUFBOUgsT0FBQSxDQUFBK0gsS0FBQSxHQUFBL0gsT0FBQSxDQUFBK0YsR0FBQSxzQkFBQS9GLE9BQUEsQ0FBQTJHLE1BQUEsNkJBQUFhLEtBQUEsUUFBQUEsS0FBQSxnQkFBQXhILE9BQUEsQ0FBQStGLEdBQUEsRUFBQS9GLE9BQUEsQ0FBQWdJLGlCQUFBLENBQUFoSSxPQUFBLENBQUErRixHQUFBLHVCQUFBL0YsT0FBQSxDQUFBMkcsTUFBQSxJQUFBM0csT0FBQSxDQUFBaUksTUFBQSxXQUFBakksT0FBQSxDQUFBK0YsR0FBQSxHQUFBeUIsS0FBQSxvQkFBQVAsTUFBQSxHQUFBcEIsUUFBQSxDQUFBVixPQUFBLEVBQUFFLElBQUEsRUFBQXJGLE9BQUEsb0JBQUFpSCxNQUFBLENBQUE5TSxJQUFBLFFBQUFxTixLQUFBLEdBQUF4SCxPQUFBLENBQUFrSSxJQUFBLG1DQUFBakIsTUFBQSxDQUFBbEIsR0FBQSxLQUFBRSxnQkFBQSxxQkFBQTdCLEtBQUEsRUFBQTZDLE1BQUEsQ0FBQWxCLEdBQUEsRUFBQW1DLElBQUEsRUFBQWxJLE9BQUEsQ0FBQWtJLElBQUEsa0JBQUFqQixNQUFBLENBQUE5TSxJQUFBLEtBQUFxTixLQUFBLGdCQUFBeEgsT0FBQSxDQUFBMkcsTUFBQSxZQUFBM0csT0FBQSxDQUFBK0YsR0FBQSxHQUFBa0IsTUFBQSxDQUFBbEIsR0FBQSxtQkFBQThCLG9CQUFBRixRQUFBLEVBQUEzSCxPQUFBLFFBQUFtSSxVQUFBLEdBQUFuSSxPQUFBLENBQUEyRyxNQUFBLEVBQUFBLE1BQUEsR0FBQWdCLFFBQUEsQ0FBQW5ELFFBQUEsQ0FBQTJELFVBQUEsT0FBQXBQLFNBQUEsS0FBQTROLE1BQUEsU0FBQTNHLE9BQUEsQ0FBQTJILFFBQUEscUJBQUFRLFVBQUEsSUFBQVIsUUFBQSxDQUFBbkQsUUFBQSxlQUFBeEUsT0FBQSxDQUFBMkcsTUFBQSxhQUFBM0csT0FBQSxDQUFBK0YsR0FBQSxHQUFBaE4sU0FBQSxFQUFBOE8sbUJBQUEsQ0FBQUYsUUFBQSxFQUFBM0gsT0FBQSxlQUFBQSxPQUFBLENBQUEyRyxNQUFBLGtCQUFBd0IsVUFBQSxLQUFBbkksT0FBQSxDQUFBMkcsTUFBQSxZQUFBM0csT0FBQSxDQUFBK0YsR0FBQSxPQUFBcUMsU0FBQSx1Q0FBQUQsVUFBQSxpQkFBQWxDLGdCQUFBLE1BQUFnQixNQUFBLEdBQUFwQixRQUFBLENBQUFjLE1BQUEsRUFBQWdCLFFBQUEsQ0FBQW5ELFFBQUEsRUFBQXhFLE9BQUEsQ0FBQStGLEdBQUEsbUJBQUFrQixNQUFBLENBQUE5TSxJQUFBLFNBQUE2RixPQUFBLENBQUEyRyxNQUFBLFlBQUEzRyxPQUFBLENBQUErRixHQUFBLEdBQUFrQixNQUFBLENBQUFsQixHQUFBLEVBQUEvRixPQUFBLENBQUEySCxRQUFBLFNBQUExQixnQkFBQSxNQUFBb0MsSUFBQSxHQUFBcEIsTUFBQSxDQUFBbEIsR0FBQSxTQUFBc0MsSUFBQSxHQUFBQSxJQUFBLENBQUFILElBQUEsSUFBQWxJLE9BQUEsQ0FBQTJILFFBQUEsQ0FBQVcsVUFBQSxJQUFBRCxJQUFBLENBQUFqRSxLQUFBLEVBQUFwRSxPQUFBLENBQUF1SSxJQUFBLEdBQUFaLFFBQUEsQ0FBQWEsT0FBQSxlQUFBeEksT0FBQSxDQUFBMkcsTUFBQSxLQUFBM0csT0FBQSxDQUFBMkcsTUFBQSxXQUFBM0csT0FBQSxDQUFBK0YsR0FBQSxHQUFBaE4sU0FBQSxHQUFBaUgsT0FBQSxDQUFBMkgsUUFBQSxTQUFBMUIsZ0JBQUEsSUFBQW9DLElBQUEsSUFBQXJJLE9BQUEsQ0FBQTJHLE1BQUEsWUFBQTNHLE9BQUEsQ0FBQStGLEdBQUEsT0FBQXFDLFNBQUEsc0NBQUFwSSxPQUFBLENBQUEySCxRQUFBLFNBQUExQixnQkFBQSxjQUFBd0MsYUFBQUMsSUFBQSxRQUFBQyxLQUFBLEtBQUFDLE1BQUEsRUFBQUYsSUFBQSxZQUFBQSxJQUFBLEtBQUFDLEtBQUEsQ0FBQUUsUUFBQSxHQUFBSCxJQUFBLFdBQUFBLElBQUEsS0FBQUMsS0FBQSxDQUFBRyxVQUFBLEdBQUFKLElBQUEsS0FBQUMsS0FBQSxDQUFBSSxRQUFBLEdBQUFMLElBQUEsV0FBQU0sVUFBQSxDQUFBcFEsSUFBQSxDQUFBK1AsS0FBQSxjQUFBTSxjQUFBTixLQUFBLFFBQUExQixNQUFBLEdBQUEwQixLQUFBLENBQUFPLFVBQUEsUUFBQWpDLE1BQUEsQ0FBQTlNLElBQUEsb0JBQUE4TSxNQUFBLENBQUFsQixHQUFBLEVBQUE0QyxLQUFBLENBQUFPLFVBQUEsR0FBQWpDLE1BQUEsYUFBQXRCLFFBQUFMLFdBQUEsU0FBQTBELFVBQUEsTUFBQUosTUFBQSxhQUFBdEQsV0FBQSxDQUFBM00sT0FBQSxDQUFBOFAsWUFBQSxjQUFBVSxLQUFBLGlCQUFBM0MsT0FBQTRDLFFBQUEsUUFBQUEsUUFBQSxRQUFBQyxjQUFBLEdBQUFELFFBQUEsQ0FBQTdFLGNBQUEsT0FBQThFLGNBQUEsU0FBQUEsY0FBQSxDQUFBckQsSUFBQSxDQUFBb0QsUUFBQSw0QkFBQUEsUUFBQSxDQUFBYixJQUFBLFNBQUFhLFFBQUEsT0FBQUUsS0FBQSxDQUFBRixRQUFBLENBQUE1USxNQUFBLFNBQUFMLENBQUEsT0FBQW9RLElBQUEsWUFBQUEsS0FBQSxhQUFBcFEsQ0FBQSxHQUFBaVIsUUFBQSxDQUFBNVEsTUFBQSxPQUFBdUwsTUFBQSxDQUFBaUMsSUFBQSxDQUFBb0QsUUFBQSxFQUFBalIsQ0FBQSxVQUFBb1EsSUFBQSxDQUFBbkUsS0FBQSxHQUFBZ0YsUUFBQSxDQUFBalIsQ0FBQSxHQUFBb1EsSUFBQSxDQUFBTCxJQUFBLE9BQUFLLElBQUEsU0FBQUEsSUFBQSxDQUFBbkUsS0FBQSxHQUFBckwsU0FBQSxFQUFBd1AsSUFBQSxDQUFBTCxJQUFBLE9BQUFLLElBQUEsWUFBQUEsSUFBQSxDQUFBQSxJQUFBLEdBQUFBLElBQUEsZUFBQUEsSUFBQSxFQUFBYixVQUFBLGVBQUFBLFdBQUEsYUFBQXRELEtBQUEsRUFBQXJMLFNBQUEsRUFBQW1QLElBQUEsaUJBQUFoQyxpQkFBQSxDQUFBcEMsU0FBQSxHQUFBcUMsMEJBQUEsRUFBQWxDLGNBQUEsQ0FBQXdDLEVBQUEsbUJBQUFyQyxLQUFBLEVBQUErQiwwQkFBQSxFQUFBcEIsWUFBQSxTQUFBZCxjQUFBLENBQUFrQywwQkFBQSxtQkFBQS9CLEtBQUEsRUFBQThCLGlCQUFBLEVBQUFuQixZQUFBLFNBQUFtQixpQkFBQSxDQUFBcUQsV0FBQSxHQUFBMUUsTUFBQSxDQUFBc0IsMEJBQUEsRUFBQXhCLGlCQUFBLHdCQUFBZixPQUFBLENBQUE0RixtQkFBQSxhQUFBQyxNQUFBLFFBQUFDLElBQUEsd0JBQUFELE1BQUEsSUFBQUEsTUFBQSxDQUFBRSxXQUFBLFdBQUFELElBQUEsS0FBQUEsSUFBQSxLQUFBeEQsaUJBQUEsNkJBQUF3RCxJQUFBLENBQUFILFdBQUEsSUFBQUcsSUFBQSxDQUFBaFAsSUFBQSxPQUFBa0osT0FBQSxDQUFBZ0csSUFBQSxhQUFBSCxNQUFBLFdBQUF6UCxNQUFBLENBQUE2UCxjQUFBLEdBQUE3UCxNQUFBLENBQUE2UCxjQUFBLENBQUFKLE1BQUEsRUFBQXRELDBCQUFBLEtBQUFzRCxNQUFBLENBQUFLLFNBQUEsR0FBQTNELDBCQUFBLEVBQUF0QixNQUFBLENBQUE0RSxNQUFBLEVBQUE5RSxpQkFBQSx5QkFBQThFLE1BQUEsQ0FBQTNGLFNBQUEsR0FBQTlKLE1BQUEsQ0FBQTBMLE1BQUEsQ0FBQWUsRUFBQSxHQUFBZ0QsTUFBQSxLQUFBN0YsT0FBQSxDQUFBbUcsS0FBQSxhQUFBaEUsR0FBQSxhQUFBb0IsT0FBQSxFQUFBcEIsR0FBQSxPQUFBVyxxQkFBQSxDQUFBRyxhQUFBLENBQUEvQyxTQUFBLEdBQUFlLE1BQUEsQ0FBQWdDLGFBQUEsQ0FBQS9DLFNBQUEsRUFBQVcsbUJBQUEsaUNBQUFiLE9BQUEsQ0FBQWlELGFBQUEsR0FBQUEsYUFBQSxFQUFBakQsT0FBQSxDQUFBb0csS0FBQSxhQUFBN0UsT0FBQSxFQUFBQyxPQUFBLEVBQUFDLElBQUEsRUFBQUMsV0FBQSxFQUFBd0IsV0FBQSxlQUFBQSxXQUFBLEtBQUFBLFdBQUEsR0FBQTFOLE9BQUEsT0FBQTZRLElBQUEsT0FBQXBELGFBQUEsQ0FBQTNCLElBQUEsQ0FBQUMsT0FBQSxFQUFBQyxPQUFBLEVBQUFDLElBQUEsRUFBQUMsV0FBQSxHQUFBd0IsV0FBQSxVQUFBbEQsT0FBQSxDQUFBNEYsbUJBQUEsQ0FBQXBFLE9BQUEsSUFBQTZFLElBQUEsR0FBQUEsSUFBQSxDQUFBMUIsSUFBQSxHQUFBOUwsSUFBQSxXQUFBQyxNQUFBLFdBQUFBLE1BQUEsQ0FBQXdMLElBQUEsR0FBQXhMLE1BQUEsQ0FBQTBILEtBQUEsR0FBQTZGLElBQUEsQ0FBQTFCLElBQUEsV0FBQTdCLHFCQUFBLENBQUFELEVBQUEsR0FBQTVCLE1BQUEsQ0FBQTRCLEVBQUEsRUFBQTlCLGlCQUFBLGdCQUFBRSxNQUFBLENBQUE0QixFQUFBLEVBQUFsQyxjQUFBLGlDQUFBTSxNQUFBLENBQUE0QixFQUFBLDZEQUFBN0MsT0FBQSxDQUFBM0osSUFBQSxhQUFBaVEsR0FBQSxRQUFBQyxNQUFBLEdBQUFuUSxNQUFBLENBQUFrUSxHQUFBLEdBQUFqUSxJQUFBLGdCQUFBQyxHQUFBLElBQUFpUSxNQUFBLEVBQUFsUSxJQUFBLENBQUFyQixJQUFBLENBQUFzQixHQUFBLFVBQUFELElBQUEsQ0FBQW1RLE9BQUEsYUFBQTdCLEtBQUEsV0FBQXRPLElBQUEsQ0FBQXpCLE1BQUEsU0FBQTBCLEdBQUEsR0FBQUQsSUFBQSxDQUFBb1EsR0FBQSxRQUFBblEsR0FBQSxJQUFBaVEsTUFBQSxTQUFBNUIsSUFBQSxDQUFBbkUsS0FBQSxHQUFBbEssR0FBQSxFQUFBcU8sSUFBQSxDQUFBTCxJQUFBLE9BQUFLLElBQUEsV0FBQUEsSUFBQSxDQUFBTCxJQUFBLE9BQUFLLElBQUEsUUFBQTNFLE9BQUEsQ0FBQTRDLE1BQUEsR0FBQUEsTUFBQSxFQUFBYixPQUFBLENBQUE3QixTQUFBLEtBQUE2RixXQUFBLEVBQUFoRSxPQUFBLEVBQUF3RCxLQUFBLFdBQUFBLE1BQUFtQixhQUFBLGFBQUFDLElBQUEsV0FBQWhDLElBQUEsV0FBQVQsSUFBQSxRQUFBQyxLQUFBLEdBQUFoUCxTQUFBLE9BQUFtUCxJQUFBLFlBQUFQLFFBQUEsY0FBQWhCLE1BQUEsZ0JBQUFaLEdBQUEsR0FBQWhOLFNBQUEsT0FBQWlRLFVBQUEsQ0FBQXJRLE9BQUEsQ0FBQXNRLGFBQUEsSUFBQXFCLGFBQUEsV0FBQTVQLElBQUEsa0JBQUFBLElBQUEsQ0FBQThQLE1BQUEsT0FBQXpHLE1BQUEsQ0FBQWlDLElBQUEsT0FBQXRMLElBQUEsTUFBQTRPLEtBQUEsRUFBQTVPLElBQUEsQ0FBQStQLEtBQUEsY0FBQS9QLElBQUEsSUFBQTNCLFNBQUEsTUFBQTJSLElBQUEsV0FBQUEsS0FBQSxTQUFBeEMsSUFBQSxXQUFBeUMsVUFBQSxRQUFBM0IsVUFBQSxJQUFBRSxVQUFBLGtCQUFBeUIsVUFBQSxDQUFBeFEsSUFBQSxRQUFBd1EsVUFBQSxDQUFBNUUsR0FBQSxjQUFBNkUsSUFBQSxLQUFBNUMsaUJBQUEsV0FBQUEsa0JBQUE2QyxTQUFBLGFBQUEzQyxJQUFBLFFBQUEyQyxTQUFBLE1BQUE3SyxPQUFBLGtCQUFBOEssT0FBQUMsR0FBQSxFQUFBQyxNQUFBLFdBQUEvRCxNQUFBLENBQUE5TSxJQUFBLFlBQUE4TSxNQUFBLENBQUFsQixHQUFBLEdBQUE4RSxTQUFBLEVBQUE3SyxPQUFBLENBQUF1SSxJQUFBLEdBQUF3QyxHQUFBLEVBQUFDLE1BQUEsS0FBQWhMLE9BQUEsQ0FBQTJHLE1BQUEsV0FBQTNHLE9BQUEsQ0FBQStGLEdBQUEsR0FBQWhOLFNBQUEsS0FBQWlTLE1BQUEsYUFBQTdTLENBQUEsUUFBQTZRLFVBQUEsQ0FBQXhRLE1BQUEsTUFBQUwsQ0FBQSxTQUFBQSxDQUFBLFFBQUF3USxLQUFBLFFBQUFLLFVBQUEsQ0FBQTdRLENBQUEsR0FBQThPLE1BQUEsR0FBQTBCLEtBQUEsQ0FBQU8sVUFBQSxpQkFBQVAsS0FBQSxDQUFBQyxNQUFBLFNBQUFrQyxNQUFBLGFBQUFuQyxLQUFBLENBQUFDLE1BQUEsU0FBQTJCLElBQUEsUUFBQVUsUUFBQSxHQUFBbEgsTUFBQSxDQUFBaUMsSUFBQSxDQUFBMkMsS0FBQSxlQUFBdUMsVUFBQSxHQUFBbkgsTUFBQSxDQUFBaUMsSUFBQSxDQUFBMkMsS0FBQSxxQkFBQXNDLFFBQUEsSUFBQUMsVUFBQSxhQUFBWCxJQUFBLEdBQUE1QixLQUFBLENBQUFFLFFBQUEsU0FBQWlDLE1BQUEsQ0FBQW5DLEtBQUEsQ0FBQUUsUUFBQSxnQkFBQTBCLElBQUEsR0FBQTVCLEtBQUEsQ0FBQUcsVUFBQSxTQUFBZ0MsTUFBQSxDQUFBbkMsS0FBQSxDQUFBRyxVQUFBLGNBQUFtQyxRQUFBLGFBQUFWLElBQUEsR0FBQTVCLEtBQUEsQ0FBQUUsUUFBQSxTQUFBaUMsTUFBQSxDQUFBbkMsS0FBQSxDQUFBRSxRQUFBLHFCQUFBcUMsVUFBQSxZQUFBekQsS0FBQSxxREFBQThDLElBQUEsR0FBQTVCLEtBQUEsQ0FBQUcsVUFBQSxTQUFBZ0MsTUFBQSxDQUFBbkMsS0FBQSxDQUFBRyxVQUFBLFlBQUFiLE1BQUEsV0FBQUEsT0FBQTlOLElBQUEsRUFBQTRMLEdBQUEsYUFBQTVOLENBQUEsUUFBQTZRLFVBQUEsQ0FBQXhRLE1BQUEsTUFBQUwsQ0FBQSxTQUFBQSxDQUFBLFFBQUF3USxLQUFBLFFBQUFLLFVBQUEsQ0FBQTdRLENBQUEsT0FBQXdRLEtBQUEsQ0FBQUMsTUFBQSxTQUFBMkIsSUFBQSxJQUFBeEcsTUFBQSxDQUFBaUMsSUFBQSxDQUFBMkMsS0FBQSx3QkFBQTRCLElBQUEsR0FBQTVCLEtBQUEsQ0FBQUcsVUFBQSxRQUFBcUMsWUFBQSxHQUFBeEMsS0FBQSxhQUFBd0MsWUFBQSxpQkFBQWhSLElBQUEsbUJBQUFBLElBQUEsS0FBQWdSLFlBQUEsQ0FBQXZDLE1BQUEsSUFBQTdDLEdBQUEsSUFBQUEsR0FBQSxJQUFBb0YsWUFBQSxDQUFBckMsVUFBQSxLQUFBcUMsWUFBQSxjQUFBbEUsTUFBQSxHQUFBa0UsWUFBQSxHQUFBQSxZQUFBLENBQUFqQyxVQUFBLGNBQUFqQyxNQUFBLENBQUE5TSxJQUFBLEdBQUFBLElBQUEsRUFBQThNLE1BQUEsQ0FBQWxCLEdBQUEsR0FBQUEsR0FBQSxFQUFBb0YsWUFBQSxTQUFBeEUsTUFBQSxnQkFBQTRCLElBQUEsR0FBQTRDLFlBQUEsQ0FBQXJDLFVBQUEsRUFBQTdDLGdCQUFBLFNBQUFtRixRQUFBLENBQUFuRSxNQUFBLE1BQUFtRSxRQUFBLFdBQUFBLFNBQUFuRSxNQUFBLEVBQUE4QixRQUFBLG9CQUFBOUIsTUFBQSxDQUFBOU0sSUFBQSxRQUFBOE0sTUFBQSxDQUFBbEIsR0FBQSxxQkFBQWtCLE1BQUEsQ0FBQTlNLElBQUEsbUJBQUE4TSxNQUFBLENBQUE5TSxJQUFBLFFBQUFvTyxJQUFBLEdBQUF0QixNQUFBLENBQUFsQixHQUFBLGdCQUFBa0IsTUFBQSxDQUFBOU0sSUFBQSxTQUFBeVEsSUFBQSxRQUFBN0UsR0FBQSxHQUFBa0IsTUFBQSxDQUFBbEIsR0FBQSxPQUFBWSxNQUFBLGtCQUFBNEIsSUFBQSx5QkFBQXRCLE1BQUEsQ0FBQTlNLElBQUEsSUFBQTRPLFFBQUEsVUFBQVIsSUFBQSxHQUFBUSxRQUFBLEdBQUE5QyxnQkFBQSxLQUFBb0YsTUFBQSxXQUFBQSxPQUFBdkMsVUFBQSxhQUFBM1EsQ0FBQSxRQUFBNlEsVUFBQSxDQUFBeFEsTUFBQSxNQUFBTCxDQUFBLFNBQUFBLENBQUEsUUFBQXdRLEtBQUEsUUFBQUssVUFBQSxDQUFBN1EsQ0FBQSxPQUFBd1EsS0FBQSxDQUFBRyxVQUFBLEtBQUFBLFVBQUEsY0FBQXNDLFFBQUEsQ0FBQXpDLEtBQUEsQ0FBQU8sVUFBQSxFQUFBUCxLQUFBLENBQUFJLFFBQUEsR0FBQUUsYUFBQSxDQUFBTixLQUFBLEdBQUExQyxnQkFBQSx5QkFBQXFGLE9BQUExQyxNQUFBLGFBQUF6USxDQUFBLFFBQUE2USxVQUFBLENBQUF4USxNQUFBLE1BQUFMLENBQUEsU0FBQUEsQ0FBQSxRQUFBd1EsS0FBQSxRQUFBSyxVQUFBLENBQUE3USxDQUFBLE9BQUF3USxLQUFBLENBQUFDLE1BQUEsS0FBQUEsTUFBQSxRQUFBM0IsTUFBQSxHQUFBMEIsS0FBQSxDQUFBTyxVQUFBLGtCQUFBakMsTUFBQSxDQUFBOU0sSUFBQSxRQUFBb1IsTUFBQSxHQUFBdEUsTUFBQSxDQUFBbEIsR0FBQSxFQUFBa0QsYUFBQSxDQUFBTixLQUFBLFlBQUE0QyxNQUFBLGdCQUFBOUQsS0FBQSw4QkFBQStELGFBQUEsV0FBQUEsY0FBQXBDLFFBQUEsRUFBQWQsVUFBQSxFQUFBRSxPQUFBLGdCQUFBYixRQUFBLEtBQUFuRCxRQUFBLEVBQUFnQyxNQUFBLENBQUE0QyxRQUFBLEdBQUFkLFVBQUEsRUFBQUEsVUFBQSxFQUFBRSxPQUFBLEVBQUFBLE9BQUEsb0JBQUE3QixNQUFBLFVBQUFaLEdBQUEsR0FBQWhOLFNBQUEsR0FBQWtOLGdCQUFBLE9BQUFyQyxPQUFBO0FBQUEsU0FBQTZILG1CQUFBQyxHQUFBLEVBQUFyUyxPQUFBLEVBQUEyTixNQUFBLEVBQUEyRSxLQUFBLEVBQUFDLE1BQUEsRUFBQTFSLEdBQUEsRUFBQTZMLEdBQUEsY0FBQXNDLElBQUEsR0FBQXFELEdBQUEsQ0FBQXhSLEdBQUEsRUFBQTZMLEdBQUEsT0FBQTNCLEtBQUEsR0FBQWlFLElBQUEsQ0FBQWpFLEtBQUEsV0FBQWlELEtBQUEsSUFBQUwsTUFBQSxDQUFBSyxLQUFBLGlCQUFBZ0IsSUFBQSxDQUFBSCxJQUFBLElBQUE3TyxPQUFBLENBQUErSyxLQUFBLFlBQUFoTCxPQUFBLENBQUFDLE9BQUEsQ0FBQStLLEtBQUEsRUFBQTNILElBQUEsQ0FBQWtQLEtBQUEsRUFBQUMsTUFBQTtBQUFBLFNBQUFDLGtCQUFBL0YsRUFBQSw2QkFBQVQsSUFBQSxTQUFBeUcsSUFBQSxHQUFBaFQsU0FBQSxhQUFBTSxPQUFBLFdBQUFDLE9BQUEsRUFBQTJOLE1BQUEsUUFBQTBFLEdBQUEsR0FBQTVGLEVBQUEsQ0FBQWlHLEtBQUEsQ0FBQTFHLElBQUEsRUFBQXlHLElBQUEsWUFBQUgsTUFBQXZILEtBQUEsSUFBQXFILGtCQUFBLENBQUFDLEdBQUEsRUFBQXJTLE9BQUEsRUFBQTJOLE1BQUEsRUFBQTJFLEtBQUEsRUFBQUMsTUFBQSxVQUFBeEgsS0FBQSxjQUFBd0gsT0FBQTNHLEdBQUEsSUFBQXdHLGtCQUFBLENBQUFDLEdBQUEsRUFBQXJTLE9BQUEsRUFBQTJOLE1BQUEsRUFBQTJFLEtBQUEsRUFBQUMsTUFBQSxXQUFBM0csR0FBQSxLQUFBMEcsS0FBQSxDQUFBNVMsU0FBQTtBQURBO0FBQ0EsSUFBTWlULFlBQVksR0FBRyxTQUFmQSxZQUFZQSxDQUFJQyxVQUFVLEVBQUVqUCxXQUFXLEVBQUs7RUFDaEQ7RUFDQSxJQUFNcEIsVUFBVSxHQUFHLEVBQUU7RUFDckIsSUFBTUMsU0FBUyxHQUFHLEVBQUU7O0VBRXBCO0VBQ0EsSUFBTXFRLE9BQU8sR0FBR2xQLFdBQVcsQ0FBQ2hHLEtBQUs7O0VBRWpDO0VBQ0EsSUFBTW1WLGVBQWUsR0FBRyxTQUFsQkEsZUFBZUEsQ0FBQSxFQUFTO0lBQzVCO0lBQ0EsSUFBTTlQLENBQUMsR0FBR2IsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ2MsTUFBTSxDQUFDLENBQUMsR0FBR1QsU0FBUyxDQUFDO0lBQy9DLElBQU1VLENBQUMsR0FBR2YsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ2MsTUFBTSxDQUFDLENBQUMsR0FBR1YsVUFBVSxDQUFDO0lBQ2hELElBQU0zRSxTQUFTLEdBQUd1RSxJQUFJLENBQUM0USxLQUFLLENBQUM1USxJQUFJLENBQUNjLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDM0M7O0lBRUFVLFdBQVcsQ0FBQzVGLE9BQU8sQ0FBQyxDQUFDaUYsQ0FBQyxFQUFFRSxDQUFDLENBQUMsRUFBRXRGLFNBQVMsQ0FBQztFQUN4QyxDQUFDO0VBQ0Q7RUFDQTs7RUFFQTtFQUNBLFNBQVNvVixpQkFBaUJBLENBQUEsRUFBRztJQUMzQjtFQUFBOztFQUdGO0VBQ0EsSUFBTUMsVUFBVTtJQUFBLElBQUFDLElBQUEsR0FBQVYsaUJBQUEsZUFBQWxJLG1CQUFBLEdBQUFpRyxJQUFBLENBQUcsU0FBQTRDLFFBQU9DLFVBQVU7TUFBQSxPQUFBOUksbUJBQUEsR0FBQXVCLElBQUEsVUFBQXdILFNBQUFDLFFBQUE7UUFBQSxrQkFBQUEsUUFBQSxDQUFBcEMsSUFBQSxHQUFBb0MsUUFBQSxDQUFBcEUsSUFBQTtVQUFBO1lBQUEsTUFFOUJrRSxVQUFVLEtBQUssQ0FBQyxJQUFJUCxPQUFPLENBQUMxVCxNQUFNLElBQUksQ0FBQztjQUFBbVUsUUFBQSxDQUFBcEUsSUFBQTtjQUFBO1lBQUE7WUFDekM7WUFDQTRELGVBQWUsQ0FBQyxDQUFDOztZQUVqQjtZQUFBUSxRQUFBLENBQUFwRSxJQUFBO1lBQUEsT0FDTThELGlCQUFpQixDQUFDLENBQUM7VUFBQTtZQUN6QjtZQUNBQyxVQUFVLENBQUNHLFVBQVUsQ0FBQztVQUFDO1VBQUE7WUFBQSxPQUFBRSxRQUFBLENBQUFqQyxJQUFBO1FBQUE7TUFBQSxHQUFBOEIsT0FBQTtJQUFBLENBRTFCO0lBQUEsZ0JBWEtGLFVBQVVBLENBQUFNLEVBQUE7TUFBQSxPQUFBTCxJQUFBLENBQUFSLEtBQUEsT0FBQWpULFNBQUE7SUFBQTtFQUFBLEdBV2Y7RUFFRHdULFVBQVUsQ0FBQ0wsVUFBVSxDQUFDO0FBQ3hCLENBQUM7QUFFRCxpRUFBZUQsWUFBWTs7Ozs7Ozs7Ozs7Ozs7QUM1QzNCLElBQU1yVixPQUFPLEdBQUksWUFBTTtFQUNyQjtFQUNBLElBQU1rVyxPQUFPLEdBQUcxUCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxXQUFXLENBQUM7O0VBRW5EO0VBQ0EsSUFBTW9HLEtBQUssR0FBRyxTQUFSQSxLQUFLQSxDQUFBLEVBQVM7SUFDbEJxSixPQUFPLENBQUNDLFdBQVcsR0FBRyxFQUFFO0VBQzFCLENBQUM7O0VBRUQ7RUFDQSxJQUFNelMsTUFBTSxHQUFHLFNBQVRBLE1BQU1BLENBQUkwUyxjQUFjLEVBQUs7SUFDakMsSUFBSUEsY0FBYyxFQUFFO01BQ2xCRixPQUFPLENBQUNHLFNBQVMsU0FBQTFTLE1BQUEsQ0FBU3lTLGNBQWMsQ0FBQ25TLFFBQVEsQ0FBQyxDQUFDLENBQUU7SUFDdkQ7RUFDRixDQUFDOztFQUVEO0VBQ0E7RUFDQSxJQUFNcVMsV0FBVyxHQUFHO0lBQUVDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFBRUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUFFQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQUVDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFBRUMsQ0FBQyxFQUFFLENBQUM7RUFBRSxDQUFDO0VBQzdELElBQU1DLFVBQVUsR0FBRyxTQUFiQSxVQUFVQSxDQUFBLEVBQVM7SUFDdkI7SUFDQSxJQUFNQyxJQUFJLEdBQUc7TUFDWE4sRUFBRSxFQUFFO1FBQ0Z4QixHQUFHLEVBQUUsQ0FDSCw0Q0FBNEMsRUFDNUMsNENBQTRDLEVBQzVDLDRDQUE0QyxFQUM1Qyw0Q0FBNEMsQ0FDN0M7UUFDRCtCLE1BQU0sRUFBRSxDQUNOLCtDQUErQyxFQUMvQywrQ0FBK0MsRUFDL0MsK0NBQStDLEVBQy9DLCtDQUErQyxDQUNoRDtRQUNEOVQsR0FBRyxFQUFFLENBQ0gsNENBQTRDLEVBQzVDLDRDQUE0QyxFQUM1Qyw0Q0FBNEM7TUFFaEQ7SUFDRixDQUFDOztJQUVEO0lBQ0FLLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDdVQsSUFBSSxDQUFDTixFQUFFLENBQUMsQ0FBQ3ZVLE9BQU8sQ0FBQyxVQUFDdUIsR0FBRyxFQUFLO01BQ3BDO01BQ0ErUyxXQUFXLENBQUNDLEVBQUUsQ0FBQ2hULEdBQUcsQ0FBQyxHQUFHLEVBQUU7TUFDeEI7TUFDQXNULElBQUksQ0FBQ04sRUFBRSxDQUFDaFQsR0FBRyxDQUFDLENBQUN2QixPQUFPLENBQUMsVUFBQytVLEdBQUcsRUFBSztRQUM1QixJQUFNQyxLQUFLLEdBQUcsSUFBSUMsS0FBSyxDQUFDLENBQUM7UUFDekJELEtBQUssQ0FBQ0UsR0FBRyxHQUFHSCxHQUFHO1FBQ2ZULFdBQVcsQ0FBQ0MsRUFBRSxDQUFDaFQsR0FBRyxDQUFDLENBQUN0QixJQUFJLENBQUMrVSxLQUFLLENBQUM7TUFDakMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0VBQ0osQ0FBQzs7RUFFRDtFQUNBLElBQU1HLEtBQUssR0FBRyxTQUFSQSxLQUFLQSxDQUFJQyxJQUFJLEVBQUV2RyxLQUFLLEVBQUs7SUFDN0I7RUFBQSxDQUNEO0VBRUQsT0FBTztJQUFFaEUsS0FBSyxFQUFMQSxLQUFLO0lBQUVuSixNQUFNLEVBQU5BLE1BQU07SUFBRWtULFVBQVUsRUFBVkE7RUFBVyxDQUFDO0FBQ3RDLENBQUMsQ0FBRSxDQUFDO0FBRUosaUVBQWU1VyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEVtQjtBQUNRO0FBQ1A7QUFDUztBQUNuQjs7QUFFaEM7QUFDQTtBQUNBO0FBQ0EsSUFBTXFYLFdBQVcsR0FBRyxTQUFkQSxXQUFXQSxDQUFBLEVBQVM7RUFDeEI7RUFDQTtFQUNBclgsZ0RBQU8sQ0FBQzRXLFVBQVUsQ0FBQyxDQUFDOztFQUVwQjtFQUNBLElBQU1VLFVBQVUsR0FBRzFULDZEQUFNLENBQUMsQ0FBQztFQUMzQixJQUFNMlQsUUFBUSxHQUFHM1QsNkRBQU0sQ0FBQyxDQUFDO0VBQ3pCMFQsVUFBVSxDQUFDcFQsU0FBUyxDQUFDbEQsVUFBVSxHQUFHdVcsUUFBUSxDQUFDclQsU0FBUztFQUNwRHFULFFBQVEsQ0FBQ3JULFNBQVMsQ0FBQ2xELFVBQVUsR0FBR3NXLFVBQVUsQ0FBQ3BULFNBQVM7RUFDcERvVCxVQUFVLENBQUNwVCxTQUFTLENBQUNoRCxJQUFJLEdBQUcsS0FBSztFQUNqQ3FXLFFBQVEsQ0FBQ3JULFNBQVMsQ0FBQ2hELElBQUksR0FBRyxJQUFJOztFQUU5QjtFQUNBLElBQU1zVyxNQUFNLEdBQUdsUix5REFBWSxDQUFDZ1IsVUFBVSxDQUFDcFQsU0FBUyxFQUFFcVQsUUFBUSxDQUFDclQsU0FBUyxDQUFDO0VBQ3JFO0VBQ0EsSUFBTXVULFFBQVEsR0FBR3RSLGdFQUFXLENBQzFCbVIsVUFBVSxDQUFDcFQsU0FBUyxFQUNwQnFULFFBQVEsQ0FBQ3JULFNBQVMsRUFDbEJzVCxNQUNGLENBQUM7RUFDRDtFQUNBRixVQUFVLENBQUNwVCxTQUFTLENBQUNqRCxNQUFNLEdBQUd3VyxRQUFRLENBQUM3USxVQUFVO0VBQ2pEMlEsUUFBUSxDQUFDclQsU0FBUyxDQUFDakQsTUFBTSxHQUFHd1csUUFBUSxDQUFDNVEsUUFBUTs7RUFFN0M7O0VBRUE7RUFDQXdPLGlFQUFZLENBQUMsQ0FBQyxFQUFFa0MsUUFBUSxDQUFDclQsU0FBUyxDQUFDO0VBQ25DO0FBQ0Y7O0VBRUU7QUFDRjs7RUFFRTs7RUFFQTs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztFQUdFO0VBQ0E7QUFDRixDQUFDOztBQUVELGlFQUFlbVQsV0FBVzs7Ozs7Ozs7Ozs7Ozs7QUNwRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNL1EsWUFBWSxHQUFHLFNBQWZBLFlBQVlBLENBQUlGLGFBQWEsRUFBRUMsV0FBVyxFQUFLO0VBQ25EO0VBQ0EsSUFBTXFSLEtBQUssR0FBR2xSLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUM5QyxJQUFNa1IsSUFBSSxHQUFHblIsUUFBUSxDQUFDQyxhQUFhLENBQUMsT0FBTyxDQUFDO0VBQzVDLElBQU1tUixTQUFTLEdBQUdwUixRQUFRLENBQUNDLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFDdEQsSUFBTW9SLElBQUksR0FBR3JSLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE9BQU8sQ0FBQzs7RUFFNUM7RUFDQSxJQUFNcVIsUUFBUSxHQUFHdFIsUUFBUSxDQUFDQyxhQUFhLENBQUMsWUFBWSxDQUFDO0VBQ3JELElBQU1zUixTQUFTLEdBQUd2UixRQUFRLENBQUNDLGFBQWEsQ0FBQyxhQUFhLENBQUM7O0VBRXZEO0VBQ0EsSUFBTXVSLGVBQWUsR0FBRyxTQUFsQkEsZUFBZUEsQ0FBQSxFQUFTO0lBQzVCNVIsYUFBYSxDQUFDOUYsU0FBUyxHQUFHOEYsYUFBYSxDQUFDOUYsU0FBUyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUMvRCtGLFdBQVcsQ0FBQy9GLFNBQVMsR0FBRytGLFdBQVcsQ0FBQy9GLFNBQVMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDN0QsQ0FBQzs7RUFFRDtFQUNBO0VBQ0EsSUFBTTJYLE9BQU8sR0FBRyxTQUFWQSxPQUFPQSxDQUFBLEVBQVM7SUFDcEJOLElBQUksQ0FBQy9QLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM1QitQLFNBQVMsQ0FBQ2hRLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNqQ2dRLElBQUksQ0FBQ2pRLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztFQUM5QixDQUFDOztFQUVEO0VBQ0EsSUFBTXFRLFFBQVEsR0FBRyxTQUFYQSxRQUFRQSxDQUFBLEVBQVM7SUFDckJELE9BQU8sQ0FBQyxDQUFDO0lBQ1ROLElBQUksQ0FBQy9QLFNBQVMsQ0FBQ3VRLE1BQU0sQ0FBQyxRQUFRLENBQUM7RUFDakMsQ0FBQzs7RUFFRDtFQUNBLElBQU1DLGFBQWEsR0FBRyxTQUFoQkEsYUFBYUEsQ0FBQSxFQUFTO0lBQzFCSCxPQUFPLENBQUMsQ0FBQztJQUNUTCxTQUFTLENBQUNoUSxTQUFTLENBQUN1USxNQUFNLENBQUMsUUFBUSxDQUFDO0VBQ3RDLENBQUM7O0VBRUQ7RUFDQSxJQUFNRSxRQUFRLEdBQUcsU0FBWEEsUUFBUUEsQ0FBQSxFQUFTO0lBQ3JCSixPQUFPLENBQUMsQ0FBQztJQUNUSixJQUFJLENBQUNqUSxTQUFTLENBQUN1USxNQUFNLENBQUMsUUFBUSxDQUFDO0VBQ2pDLENBQUM7RUFDRDtFQUNBLElBQU14TCxZQUFZLEdBQUcsU0FBZkEsWUFBWUEsQ0FBQSxFQUFTO0lBQ3pCLElBQUl2RyxhQUFhLENBQUMvRixLQUFLLENBQUN3QixNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ3BDd1csUUFBUSxDQUFDLENBQUM7SUFDWjtFQUNGLENBQUM7O0VBRUQ7RUFDQSxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBV0EsQ0FBQSxFQUFTO0lBQ3hCWixLQUFLLENBQUM5UCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7RUFDL0IsQ0FBQzs7RUFFRDs7RUFFQTtFQUNBO0VBQ0EsSUFBTTBRLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBZ0JBLENBQUEsRUFBUztJQUM3QkQsV0FBVyxDQUFDLENBQUM7SUFDYkYsYUFBYSxDQUFDLENBQUM7RUFDakIsQ0FBQzs7RUFFRDtFQUNBLElBQU1JLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBaUJBLENBQUEsRUFBUztJQUM5QlIsZUFBZSxDQUFDLENBQUM7RUFDbkIsQ0FBQzs7RUFFRDs7RUFFQTs7RUFFQTs7RUFFQTtFQUNBRCxTQUFTLENBQUNqTCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUwTCxpQkFBaUIsQ0FBQztFQUN0RFYsUUFBUSxDQUFDaEwsZ0JBQWdCLENBQUMsT0FBTyxFQUFFeUwsZ0JBQWdCLENBQUM7RUFFcEQsT0FBTztJQUFFNUwsWUFBWSxFQUFaQTtFQUFhLENBQUM7QUFDekIsQ0FBQztBQUVELGlFQUFlckcsWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEYzQjtBQUM2RztBQUNqQjtBQUM1Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLHdGQUF3RixNQUFNLHFGQUFxRixXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxNQUFNLFlBQVksZ0JBQWdCLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLFVBQVUsS0FBSyxRQUFRLFVBQVUsVUFBVSxLQUFLLEtBQUssWUFBWSxhQUFhLGlzQkFBaXNCLGNBQWMsZUFBZSxjQUFjLG9CQUFvQixrQkFBa0IsNkJBQTZCLEdBQUcsd0pBQXdKLG1CQUFtQixHQUFHLFFBQVEsbUJBQW1CLEdBQUcsV0FBVyxxQkFBcUIsR0FBRyxrQkFBa0IsaUJBQWlCLEdBQUcsNkRBQTZELGtCQUFrQixrQkFBa0IsR0FBRyxTQUFTLDhCQUE4QixzQkFBc0IsR0FBRyxxQkFBcUI7QUFDNXFEO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4SXZDO0FBQzZHO0FBQ2pCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FB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QUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUMyQjtBQUNBO0FBQ3FCOztBQUVoRDtBQUNBK1EsZ0VBQVcsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2FpQXR0YWNrLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9jYW52YXNBZGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvZ3JpZENhbnZhcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvcGxhY2VBaVNoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lTG9nLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvd2ViSW50ZXJmYWNlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvcmVzZXQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcz80NDVlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzP2M5ZjAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcbmltcG9ydCBhaUF0dGFjayBmcm9tIFwiLi4vaGVscGVycy9haUF0dGFja1wiO1xuaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZUxvZ1wiO1xuXG4vKiBGYWN0b3J5IHRoYXQgcmV0dXJucyBhIGdhbWVib2FyZCB0aGF0IGNhbiBwbGFjZSBzaGlwcyB3aXRoIFNoaXAoKSwgcmVjaWV2ZSBhdHRhY2tzIGJhc2VkIG9uIGNvb3JkcyBcbiAgIGFuZCB0aGVuIGRlY2lkZXMgd2hldGhlciB0byBoaXQoKSBpZiBzaGlwIGlzIGluIHRoYXQgc3BvdCwgcmVjb3JkcyBoaXRzIGFuZCBtaXNzZXMsIGFuZCByZXBvcnRzIGlmXG4gICBhbGwgaXRzIHNoaXBzIGhhdmUgYmVlbiBzdW5rLiAqL1xuY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICAvLyBDb25zdHJhaW50cyBmb3IgZ2FtZSBib2FyZCAoMTB4MTAgZ3JpZCwgemVybyBiYXNlZClcbiAgY29uc3QgbWF4Qm9hcmRYID0gOTtcbiAgY29uc3QgbWF4Qm9hcmRZID0gOTtcblxuICBjb25zdCB0aGlzR2FtZWJvYXJkID0ge1xuICAgIHNoaXBzOiBbXSxcbiAgICBkaXJlY3Rpb246IDEsXG4gICAgcmV0dXJuVXNlclNoaXBzOiBudWxsLFxuICAgIGFsbE9jY3VwaWVkQ2VsbHM6IFtdLFxuICAgIGFkZFNoaXA6IG51bGwsXG4gICAgcmVjZWl2ZUF0dGFjazogbnVsbCxcbiAgICBjYW5BdHRhY2s6IHRydWUsXG4gICAgbWlzc2VzOiBbXSxcbiAgICBoaXRzOiBbXSxcbiAgICBhbGxTdW5rOiBudWxsLFxuICAgIGxvZ1N1bms6IG51bGwsXG4gICAgcml2YWxCb2FyZDogbnVsbCxcbiAgICBnZXQgbWF4Qm9hcmRYKCkge1xuICAgICAgcmV0dXJuIG1heEJvYXJkWDtcbiAgICB9LFxuICAgIGdldCBtYXhCb2FyZFkoKSB7XG4gICAgICByZXR1cm4gbWF4Qm9hcmRZO1xuICAgIH0sXG4gICAgY2FudmFzOiBudWxsLFxuICAgIGlzQWk6IGZhbHNlLFxuICAgIGdhbWVPdmVyOiBmYWxzZSxcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgc2hpcCBvY2N1cGllZCBjZWxsIGNvb3Jkc1xuICBjb25zdCB2YWxpZGF0ZVNoaXAgPSAoc2hpcCkgPT4ge1xuICAgIGlmICghc2hpcCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEZsYWcgZm9yIGRldGVjdGluZyBpbnZhbGlkIHBvc2l0aW9uIHZhbHVlXG4gICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCBzaGlwcyBvY2N1cGllZCBjZWxscyBhcmUgYWxsIHdpdGhpbiBtYXAgYW5kIG5vdCBhbHJlYWR5IG9jY3VwaWVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIC8vIE9uIHRoZSBtYXA/XG4gICAgICBpZiAoXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSA+PSAwICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSA8PSBtYXhCb2FyZFggJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdIDw9IG1heEJvYXJkWVxuICAgICAgKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrIG9jY3VwaWVkIGNlbGxzXG4gICAgICBjb25zdCBpc0NlbGxPY2N1cGllZCA9IHRoaXNHYW1lYm9hcmQuYWxsT2NjdXBpZWRDZWxscy5zb21lKFxuICAgICAgICAoY2VsbCkgPT5cbiAgICAgICAgICAvLyBDb29yZHMgZm91bmQgaW4gYWxsIG9jY3VwaWVkIGNlbGxzIGFscmVhZHlcbiAgICAgICAgICBjZWxsWzBdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gJiZcbiAgICAgICAgICBjZWxsWzFdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV1cbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0NlbGxPY2N1cGllZCkge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrOyAvLyBCcmVhayBvdXQgb2YgdGhlIGxvb3AgaWYgb2NjdXBpZWQgY2VsbCBpcyBmb3VuZFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGFkZHMgb2NjdXBpZWQgY2VsbHMgb2YgdmFsaWQgYm9hdCB0byBsaXN0XG4gIGNvbnN0IGFkZENlbGxzVG9MaXN0ID0gKHNoaXApID0+IHtcbiAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgdGhpc0dhbWVib2FyZC5hbGxPY2N1cGllZENlbGxzLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBhZGRpbmcgYSBzaGlwIGF0IGEgZ2l2ZW4gY29vcmRzIGluIGdpdmVuIGRpcmVjdGlvbiBpZiBzaGlwIHdpbGwgZml0IG9uIGJvYXJkXG4gIHRoaXNHYW1lYm9hcmQuYWRkU2hpcCA9IChcbiAgICBwb3NpdGlvbixcbiAgICBkaXJlY3Rpb24gPSB0aGlzR2FtZWJvYXJkLmRpcmVjdGlvbixcbiAgICBzaGlwVHlwZUluZGV4ID0gdGhpc0dhbWVib2FyZC5zaGlwcy5sZW5ndGggKyAxXG4gICkgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgZGVzaXJlZCBzaGlwXG4gICAgY29uc3QgbmV3U2hpcCA9IFNoaXAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbik7XG4gICAgLy8gQWRkIGl0IHRvIHNoaXBzIGlmIGl0IGhhcyB2YWxpZCBvY2N1cGllZCBjZWxsc1xuICAgIGlmICh2YWxpZGF0ZVNoaXAobmV3U2hpcCkpIHtcbiAgICAgIGFkZENlbGxzVG9MaXN0KG5ld1NoaXApO1xuICAgICAgdGhpc0dhbWVib2FyZC5zaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhZGRNaXNzID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLm1pc3Nlcy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYWRkSGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVjZWl2aW5nIGFuIGF0dGFjayBmcm9tIG9wcG9uZW50XG4gIHRoaXNHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayA9IChwb3NpdGlvbiwgc2hpcHMgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBWYWxpZGF0ZSBwb3NpdGlvbiBpcyAyIGluIGFycmF5IGFuZCBzaGlwcyBpcyBhbiBhcnJheSwgYW5kIHJpdmFsIGJvYXJkIGNhbiBhdHRhY2tcbiAgICAgIGlmIChcbiAgICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHMpXG4gICAgICApIHtcbiAgICAgICAgLy8gRWFjaCBzaGlwIGluIHNoaXBzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBJZiB0aGUgc2hpcCBpcyBub3QgZmFsc3ksIGFuZCBvY2N1cGllZENlbGxzIHByb3AgZXhpc3RzIGFuZCBpcyBhbiBhcnJheVxuICAgICAgICAgICAgc2hpcHNbaV0gJiZcbiAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMgJiZcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHNbaV0ub2NjdXBpZWRDZWxscylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIG9mIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHNcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcHNbaV0ub2NjdXBpZWRDZWxscy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhhdCBjZWxsIG1hdGNoZXMgdGhlIGF0dGFjayBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMF0gPT09IHBvc2l0aW9uWzBdICYmXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGF0IHNoaXBzIGhpdCBtZXRob2QgYW5kIGJyZWFrIG91dCBvZiBsb29wXG4gICAgICAgICAgICAgICAgc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgICAgYWRkSGl0KHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYWRkTWlzcyhwb3NpdGlvbik7XG4gICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICB9KTtcblxuICAvLyBNZXRob2QgZm9yIHRyeWluZyBhaSBhdHRhY2tzXG4gIHRoaXNHYW1lYm9hcmQudHJ5QWlBdHRhY2sgPSAoKSA9PiB7XG4gICAgLy8gUmV0dXJuIGlmIG5vdCBhaVxuICAgIGlmICh0aGlzR2FtZWJvYXJkLmlzQWkgPT09IGZhbHNlKSByZXR1cm47XG4gICAgYWlBdHRhY2sodGhpc0dhbWVib2FyZC5yaXZhbEJvYXJkKTtcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCBkZXRlcm1pbmVzIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBub3RcbiAgdGhpc0dhbWVib2FyZC5hbGxTdW5rID0gKHNoaXBBcnJheSA9IHRoaXNHYW1lYm9hcmQuc2hpcHMpID0+IHtcbiAgICBpZiAoIXNoaXBBcnJheSB8fCAhQXJyYXkuaXNBcnJheShzaGlwQXJyYXkpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCBhbGxTdW5rID0gdHJ1ZTtcbiAgICBzaGlwQXJyYXkuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXAgJiYgc2hpcC5pc1N1bmsgJiYgIXNoaXAuaXNTdW5rKCkpIGFsbFN1bmsgPSBmYWxzZTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWxsU3VuaztcbiAgfTtcblxuICAvLyBPYmplY3QgZm9yIHRyYWNraW5nIGJvYXJkJ3Mgc3Vua2VuIHNoaXBzXG4gIGNvbnN0IHN1bmtlblNoaXBzID0geyAxOiBmYWxzZSwgMjogZmFsc2UsIDM6IGZhbHNlLCA0OiBmYWxzZSwgNTogZmFsc2UgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlcG9ydGluZyBzdW5rZW4gc2hpcHNcbiAgdGhpc0dhbWVib2FyZC5sb2dTdW5rID0gKCkgPT4ge1xuICAgIE9iamVjdC5rZXlzKHN1bmtlblNoaXBzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChzdW5rZW5TaGlwc1trZXldID09PSBmYWxzZSAmJiB0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdLmlzU3VuaygpKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSB0aGlzR2FtZWJvYXJkLnNoaXBzW2tleSAtIDFdLnR5cGU7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXNHYW1lYm9hcmQuaXNBaSA/IFwiQUknc1wiIDogXCJVc2VyJ3NcIjtcbiAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXG4gICAgICAgICAgYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7cGxheWVyfSAke3NoaXB9IHdhcyBkZXN0cm95ZWQhPC9zcGFuPmBcbiAgICAgICAgKTtcbiAgICAgICAgc3Vua2VuU2hpcHNba2V5XSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNHYW1lYm9hcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL0dhbWVib2FyZFwiO1xuXG4vKiBGYWN0b3J5IHRoYXQgY3JlYXRlcyBhbmQgcmV0dXJucyBhIHBsYXllciBvYmplY3QgdGhhdCBjYW4gdGFrZSBhIHNob3QgYXQgb3Bwb25lbnQncyBnYW1lIGJvYXJkICovXG5jb25zdCBQbGF5ZXIgPSAoKSA9PiB7XG4gIGxldCBwcml2YXRlTmFtZSA9IFwiXCI7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSB7XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gcHJpdmF0ZU5hbWU7XG4gICAgfSxcbiAgICBzZXQgbmFtZShuZXdOYW1lKSB7XG4gICAgICBpZiAobmV3TmFtZSkge1xuICAgICAgICBwcml2YXRlTmFtZSA9IG5ld05hbWUudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBwcml2YXRlTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBnYW1lYm9hcmQ6IEdhbWVib2FyZCgpLFxuICAgIHNlbmRBdHRhY2s6IG51bGwsXG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGF0dGFjayBwb3NpdGlvbiBpcyBvbiBib2FyZFxuICBjb25zdCB2YWxpZGF0ZUF0dGFjayA9IChwb3NpdGlvbiwgZ2FtZWJvYXJkKSA9PiB7XG4gICAgLy8gRG9lcyBnYW1lYm9hcmQgZXhpc3Qgd2l0aCBtYXhCb2FyZFgveSBwcm9wZXJ0aWVzP1xuICAgIGlmICghZ2FtZWJvYXJkIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRYIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRZKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIElzIHBvc2l0aW9uIGNvbnN0cmFpbmVkIHRvIG1heGJvYXJkWC9ZIGFuZCBib3RoIGFyZSBpbnRzIGluIGFuIGFycmF5P1xuICAgIGlmIChcbiAgICAgIHBvc2l0aW9uICYmXG4gICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgIHBvc2l0aW9uWzBdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzBdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFggJiZcbiAgICAgIHBvc2l0aW9uWzFdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzFdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBzZW5kaW5nIGF0dGFjayB0byByaXZhbCBnYW1lYm9hcmRcbiAgdGhpc1BsYXllci5zZW5kQXR0YWNrID0gKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCA9IHRoaXNQbGF5ZXIuZ2FtZWJvYXJkKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRlQXR0YWNrKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCkpIHtcbiAgICAgIHBsYXllckJvYXJkLnJpdmFsQm9hcmQucmVjZWl2ZUF0dGFjayhwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB0aGlzUGxheWVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gQ29udGFpbnMgdGhlIG5hbWVzIGZvciB0aGUgc2hpcHMgYmFzZWQgb24gaW5kZXhcbmNvbnN0IHNoaXBOYW1lcyA9IHtcbiAgMTogXCJTZW50aW5lbCBQcm9iZVwiLFxuICAyOiBcIkFzc2F1bHQgVGl0YW5cIixcbiAgMzogXCJWaXBlciBNZWNoXCIsXG4gIDQ6IFwiSXJvbiBHb2xpYXRoXCIsXG4gIDU6IFwiTGV2aWF0aGFuXCIsXG59O1xuXG4vLyBGYWN0b3J5IHRoYXQgY2FuIGNyZWF0ZSBhbmQgcmV0dXJuIG9uZSBvZiBhIHZhcmlldHkgb2YgcHJlLWRldGVybWluZWQgc2hpcHMuXG5jb25zdCBTaGlwID0gKGluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKSA9PiB7XG4gIC8vIFZhbGlkYXRlIGluZGV4XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPiA1IHx8IGluZGV4IDwgMSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAvLyBDcmVhdGUgdGhlIHNoaXAgb2JqZWN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZFxuICBjb25zdCB0aGlzU2hpcCA9IHtcbiAgICBpbmRleCxcbiAgICBzaXplOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgaGl0czogMCxcbiAgICBoaXQ6IG51bGwsXG4gICAgaXNTdW5rOiBudWxsLFxuICAgIG9jY3VwaWVkQ2VsbHM6IFtdLFxuICB9O1xuXG4gIC8vIFNldCBzaGlwIHNpemVcbiAgc3dpdGNoIChpbmRleCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IGluZGV4O1xuICB9XG5cbiAgLy8gU2V0IHNoaXAgbmFtZSBiYXNlZCBvbiBpbmRleFxuICB0aGlzU2hpcC50eXBlID0gc2hpcE5hbWVzW3RoaXNTaGlwLmluZGV4XTtcblxuICAvLyBBZGRzIGEgaGl0IHRvIHRoZSBzaGlwXG4gIHRoaXNTaGlwLmhpdCA9ICgpID0+IHtcbiAgICB0aGlzU2hpcC5oaXRzICs9IDE7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lcyBpZiBzaGlwIHN1bmsgaXMgdHJ1ZVxuICB0aGlzU2hpcC5pc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXNTaGlwLmhpdHMgPj0gdGhpc1NoaXAuc2l6ZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIFBsYWNlbWVudCBkaXJlY3Rpb24gaXMgZWl0aGVyIDAgZm9yIGhvcml6b250YWwgb3IgMSBmb3IgdmVydGljYWxcbiAgbGV0IHBsYWNlbWVudERpcmVjdGlvblggPSAwO1xuICBsZXQgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDA7XG4gIGlmIChkaXJlY3Rpb24gPT09IDApIHtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25YID0gMTtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMDtcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDEpIHtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25YID0gMDtcbiAgICBwbGFjZW1lbnREaXJlY3Rpb25ZID0gMTtcbiAgfVxuXG4gIC8vIFVzZSBwb3NpdGlvbiBhbmQgZGlyZWN0aW9uIHRvIGFkZCBvY2N1cGllZCBjZWxscyBjb29yZHNcbiAgaWYgKFxuICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgIChkaXJlY3Rpb24gPT09IDEgfHwgZGlyZWN0aW9uID09PSAwKVxuICApIHtcbiAgICAvLyBEaXZpZGUgbGVuZ3RoIGludG8gaGFsZiBhbmQgcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZlNpemUgPSBNYXRoLmZsb29yKHRoaXNTaGlwLnNpemUgLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJTaXplID0gdGhpc1NoaXAuc2l6ZSAlIDI7XG4gICAgLy8gQWRkIGZpcnN0IGhhbGYgb2YgY2VsbHMgcGx1cyByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZlNpemUgKyByZW1haW5kZXJTaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gKyBpICogcGxhY2VtZW50RGlyZWN0aW9uWCxcbiAgICAgICAgcG9zaXRpb25bMV0gKyBpICogcGxhY2VtZW50RGlyZWN0aW9uWSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gICAgLy8gQWRkIHNlY29uZCBoYWxmIG9mIGNlbGxzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXdDb29yZHMgPSBbXG4gICAgICAgIHBvc2l0aW9uWzBdIC0gKGkgKyAxKSAqIHBsYWNlbWVudERpcmVjdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWzFdIC0gKGkgKyAxKSAqIHBsYWNlbWVudERpcmVjdGlvblksXG4gICAgICBdO1xuICAgICAgdGhpc1NoaXAub2NjdXBpZWRDZWxscy5wdXNoKG5ld0Nvb3Jkcyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNTaGlwO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgZ2FtZUxvZyBmcm9tIFwiLi4vbW9kdWxlcy9nYW1lTG9nXCI7XG5cbi8vIFRoaXMgaGVscGVyIHdpbGwgbG9vayBhdCBjdXJyZW50IGhpdHMgYW5kIG1pc3NlcyBhbmQgdGhlbiByZXR1cm4gYW4gYXR0YWNrXG5jb25zdCBhaUF0dGFjayA9IChyaXZhbEJvYXJkKSA9PiB7XG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGNvbnN0IGJvYXJkID0gcml2YWxCb2FyZDtcbiAgY29uc3QgeyBoaXRzLCBtaXNzZXMgfSA9IHJpdmFsQm9hcmQ7XG4gIGxldCBhdHRhY2tDb29yZHMgPSBbXTtcblxuICAvLyBNZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGNlbGwgaGFzIGEgaGl0IG9yIG1pc3MgaW4gaXRcbiAgY29uc3QgYWxyZWFkeUF0dGFja2VkID0gKGNlbGxDb29yZGluYXRlcykgPT4ge1xuICAgIGxldCBhdHRhY2tlZCA9IGZhbHNlO1xuXG4gICAgaGl0cy5mb3JFYWNoKChoaXQpID0+IHtcbiAgICAgIGlmIChjZWxsQ29vcmRpbmF0ZXNbMF0gPT09IGhpdFswXSAmJiBjZWxsQ29vcmRpbmF0ZXNbMV0gPT09IGhpdFsxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtaXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xuICAgICAgaWYgKGNlbGxDb29yZGluYXRlc1swXSA9PT0gbWlzc1swXSAmJiBjZWxsQ29vcmRpbmF0ZXNbMV0gPT09IG1pc3NbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF0dGFja2VkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmV0dXJuaW5nIHJhbmRvbSBhdHRhY2tcbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkV2lkdGgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBncmlkSGVpZ2h0KTtcbiAgICBhdHRhY2tDb29yZHMgPSBbeCwgeV07XG4gIH07XG5cbiAgLy8gVHJ5IGEgcmFuZG9tIGF0dGFjayB0aGF0IGhhcyBub3QgYmVlbiB5ZXQgdHJpZWRcbiAgcmFuZG9tQXR0YWNrKCk7XG4gIHdoaWxlIChhbHJlYWR5QXR0YWNrZWQoYXR0YWNrQ29vcmRzKSkge1xuICAgIHJhbmRvbUF0dGFjaygpO1xuICB9XG5cbiAgLy8gVGltZW91dCB0byBzaW11bGF0ZSBcInRoaW5raW5nXCIgYW5kIHRvIG1ha2UgZ2FtZSBmZWVsIGJldHRlclxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAvLyBTZW5kIGF0dGFjayB0byByaXZhbCBib2FyZFxuICAgIHJpdmFsQm9hcmRcbiAgICAgIC5yZWNlaXZlQXR0YWNrKGF0dGFja0Nvb3JkcylcbiAgICAgIC8vIFRoZW4gZHJhdyBoaXRzIG9yIG1pc3Nlc1xuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8gRHJhdyB0aGUgaGl0IHRvIGJvYXJkXG4gICAgICAgICAgcml2YWxCb2FyZC5jYW52YXMuZHJhd0hpdChhdHRhY2tDb29yZHMpO1xuICAgICAgICAgIC8vIExvZyB0aGUgaGl0XG4gICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoYEFJIGF0dGFja3MgY2VsbDogJHthdHRhY2tDb29yZHN9XFxuQXR0YWNrIGhpdCFgKTtcbiAgICAgICAgICAvLyBMb2cgc3VuayB1c2VyIHNoaXBzXG4gICAgICAgICAgcml2YWxCb2FyZC5sb2dTdW5rKCk7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgQUkgd29uXG4gICAgICAgICAgaWYgKHJpdmFsQm9hcmQuYWxsU3VuaygpKSB7XG4gICAgICAgICAgICAvLyBMb2cgcmVzdWx0c1xuICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXG4gICAgICAgICAgICAgIFwiQWxsIFVzZXIgdW5pdHMgZGVzdHJveWVkLiBcXG5BSSBkb21pbmFuY2UgaXMgYXNzdXJlZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIFNldCBnYW1lIG92ZXIgb24gYm9hcmRzXG4gICAgICAgICAgICBib2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgICBib2FyZC5yaXZhbEJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIC8vIERyYXcgdGhlIG1pc3MgdG8gYm9hcmRcbiAgICAgICAgICByaXZhbEJvYXJkLmNhbnZhcy5kcmF3TWlzcyhhdHRhY2tDb29yZHMpO1xuICAgICAgICAgIC8vIExvZyB0aGUgbWlzc1xuICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKGBBSSBhdHRhY2tzIGNlbGw6ICR7YXR0YWNrQ29vcmRzfVxcbkF0dGFjayBtaXNzZWQhYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgYm9hcmQuY2FuQXR0YWNrID0gdHJ1ZTtcbiAgfSwgMTApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWlBdHRhY2s7XG4iLCJpbXBvcnQgZ3JpZENhbnZhcyBmcm9tIFwiLi9ncmlkQ2FudmFzXCI7XG5cbi8qIFRoaXMgbW9kdWxlIGNyZWF0ZXMgY2FudmFzIGVsZW1lbnRzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIGFwcHJvcHJpYXRlIFxuICAgcGxhY2VzIGluIHRoZSBET00uICovXG5jb25zdCBjYW52YXNBZGRlciA9ICh1c2VyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCwgd2ViSW50ZXJmYWNlKSA9PiB7XG4gIC8vIFJlcGxhY2UgdGhlIHRocmVlIGdyaWQgcGxhY2Vob2xkZXIgZWxlbWVudHMgd2l0aCB0aGUgcHJvcGVyIGNhbnZhc2VzXG4gIC8vIFJlZnMgdG8gRE9NIGVsZW1lbnRzXG4gIGNvbnN0IHBsYWNlbWVudFBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtY2FudmFzLXBoXCIpO1xuICBjb25zdCB1c2VyUEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVzZXItY2FudmFzLXBoXCIpO1xuICBjb25zdCBhaVBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1jYW52YXMtcGhcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBjYW52YXNlc1xuXG4gIGNvbnN0IHVzZXJDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcInVzZXJcIiB9LFxuICAgIHVzZXJHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlXG4gICk7XG4gIGNvbnN0IGFpQ2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJhaVwiIH0sXG4gICAgYWlHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlXG4gICk7XG4gIGNvbnN0IHBsYWNlbWVudENhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwicGxhY2VtZW50XCIgfSxcbiAgICB1c2VyR2FtZWJvYXJkLFxuICAgIHdlYkludGVyZmFjZSxcbiAgICB1c2VyQ2FudmFzXG4gICk7XG5cbiAgLy8gUmVwbGFjZSB0aGUgcGxhY2UgaG9sZGVyc1xuICBwbGFjZW1lbnRQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwbGFjZW1lbnRDYW52YXMsIHBsYWNlbWVudFBIKTtcbiAgdXNlclBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVzZXJDYW52YXMsIHVzZXJQSCk7XG4gIGFpUEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYWlDYW52YXMsIGFpUEgpO1xuXG4gIC8vIFJldHVybiB0aGUgY2FudmFzZXNcbiAgcmV0dXJuIHsgcGxhY2VtZW50Q2FudmFzLCB1c2VyQ2FudmFzLCBhaUNhbnZhcyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2FudmFzQWRkZXI7XG4iLCIvLyBUaGlzIG1vZHVsZSBhbGxvd3Mgd3JpdGluZyB0byB0aGUgZ2FtZSBsb2cgdGV4dFxuaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZUxvZ1wiO1xuXG5jb25zdCBjcmVhdGVDYW52YXMgPSAoXG4gIHNpemVYLFxuICBzaXplWSxcbiAgb3B0aW9ucyxcbiAgZ2FtZWJvYXJkLFxuICB3ZWJJbnRlcmZhY2UsXG4gIHVzZXJDYW52YXNcbikgPT4ge1xuICAvLyAjcmVnaW9uIFJlZmVyZW5jZXNcbiAgLy8gU2hpcHMgYXJyYXlcbiAgY29uc3QgeyBzaGlwcyB9ID0gZ2FtZWJvYXJkO1xuXG4gIGxldCB1c2VyQm9hcmRDYW52YXMgPSBudWxsO1xuICBpZiAodXNlckNhbnZhcykge1xuICAgIFt1c2VyQm9hcmRDYW52YXNdID0gdXNlckNhbnZhcy5jaGlsZE5vZGVzO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gU2V0IHVwIGJhc2ljIGVsZW1lbnQgcHJvcGVydGllc1xuICAvLyBTZXQgdGhlIGdyaWQgaGVpZ2h0IGFuZCB3aWR0aCBhbmQgYWRkIHJlZiB0byBjdXJyZW50IGNlbGxcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcbiAgbGV0IGN1cnJlbnRDZWxsID0gbnVsbDtcblxuICAvLyBDcmVhdGUgcGFyZW50IGRpdiB0aGF0IGhvbGRzIHRoZSBjYW52YXNlcy4gVGhpcyBpcyB0aGUgZWxlbWVudCByZXR1cm5lZC5cbiAgY29uc3QgY2FudmFzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjYW52YXMtY29udGFpbmVyXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgYm9hcmQgY2FudmFzIGVsZW1lbnQgdG8gc2VydmUgYXMgdGhlIGdhbWVib2FyZCBiYXNlXG4gIC8vIFN0YXRpYyBvciByYXJlbHkgcmVuZGVyZWQgdGhpbmdzIHNob3VsZCBnbyBoZXJlXG4gIGNvbnN0IGJvYXJkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzQ29udGFpbmVyLmFwcGVuZENoaWxkKGJvYXJkQ2FudmFzKTtcbiAgYm9hcmRDYW52YXMud2lkdGggPSBzaXplWDtcbiAgYm9hcmRDYW52YXMuaGVpZ2h0ID0gc2l6ZVk7XG4gIGNvbnN0IGJvYXJkQ3R4ID0gYm9hcmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgb3ZlcmxheSBjYW52YXMgZm9yIHJlbmRlcmluZyBzaGlwIHBsYWNlbWVudCBhbmQgYXR0YWNrIHNlbGVjdGlvblxuICBjb25zdCBvdmVybGF5Q2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzQ29udGFpbmVyLmFwcGVuZENoaWxkKG92ZXJsYXlDYW52YXMpO1xuICBvdmVybGF5Q2FudmFzLndpZHRoID0gc2l6ZVg7XG4gIG92ZXJsYXlDYW52YXMuaGVpZ2h0ID0gc2l6ZVk7XG4gIGNvbnN0IG92ZXJsYXlDdHggPSBvdmVybGF5Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBTZXQgdGhlIFwiY2VsbCBzaXplXCIgZm9yIHRoZSBncmlkIHJlcHJlc2VudGVkIGJ5IHRoZSBjYW52YXNcbiAgY29uc3QgY2VsbFNpemVYID0gYm9hcmRDYW52YXMud2lkdGggLyBncmlkV2lkdGg7IC8vIE1vZHVsZSBjb25zdFxuICBjb25zdCBjZWxsU2l6ZVkgPSBib2FyZENhbnZhcy5oZWlnaHQgLyBncmlkSGVpZ2h0OyAvLyBNb2R1bGUgY29uc3RcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBHZW5lcmFsIGhlbHBlciBtZXRob2RzXG4gIC8vIE1ldGhvZCB0aGF0IGdldHMgdGhlIG1vdXNlIHBvc2l0aW9uIGJhc2VkIG9uIHdoYXQgY2VsbCBpdCBpcyBvdmVyXG4gIGNvbnN0IGdldE1vdXNlQ2VsbCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSBib2FyZENhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIGNvbnN0IGNlbGxYID0gTWF0aC5mbG9vcihtb3VzZVggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGNlbGxZID0gTWF0aC5mbG9vcihtb3VzZVkgLyBjZWxsU2l6ZVkpO1xuXG4gICAgcmV0dXJuIFtjZWxsWCwgY2VsbFldO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0byBkZXRlcm1pbmUgaWYgY2VsbCBoYXMgYSBoaXQgb3IgbWlzcyBpbiBpdFxuICBjb25zdCBhbHJlYWR5QXR0YWNrZWQgPSAoY2VsbENvb3JkaW5hdGVzKSA9PiB7XG4gICAgbGV0IGF0dGFja2VkID0gZmFsc2U7XG4gICAgZ2FtZWJvYXJkLmhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBpZiAoY2VsbENvb3JkaW5hdGVzWzBdID09PSBoaXRbMF0gJiYgY2VsbENvb3JkaW5hdGVzWzFdID09PSBoaXRbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ2FtZWJvYXJkLm1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBpZiAoY2VsbENvb3JkaW5hdGVzWzBdID09PSBtaXNzWzBdICYmIGNlbGxDb29yZGluYXRlc1sxXSA9PT0gbWlzc1sxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXR0YWNrZWQ7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gTWV0aG9kcyBmb3IgZHJhd2luZyB0byBjYW52YXNlc1xuICAvLyBNZXRob2QgZm9yIGRyYXdpbmcgdGhlIGdyaWQgbGluZXNcbiAgY29uc3QgZHJhd0xpbmVzID0gKGNvbnRleHQpID0+IHtcbiAgICAvLyBEcmF3IGdyaWQgbGluZXNcbiAgICBjb25zdCBncmlkU2l6ZSA9IE1hdGgubWluKHNpemVYLCBzaXplWSkgLyAxMDtcbiAgICBjb25zdCBsaW5lQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGxpbmVDb2xvcjtcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cbiAgICAvLyBEcmF3IHZlcnRpY2FsIGxpbmVzXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gc2l6ZVg7IHggKz0gZ3JpZFNpemUpIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyh4LCAwKTtcbiAgICAgIGNvbnRleHQubGluZVRvKHgsIHNpemVZKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyBob3Jpem9udGFsIGxpbmVzXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gc2l6ZVk7IHkgKz0gZ3JpZFNpemUpIHtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbygwLCB5KTtcbiAgICAgIGNvbnRleHQubGluZVRvKHNpemVYLCB5KTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIERyYXdzIHRoZSBoaWdobGlnaHRlZCBwbGFjZW1lbnQgY2VsbHMgdG8gdGhlIG92ZXJsYXkgY2FudmFzXG4gIGNvbnN0IGhpZ2hsaWdodFBsYWNlbWVudENlbGxzID0gKFxuICAgIGNlbGxDb29yZGluYXRlcyxcbiAgICBjZWxsWCA9IGNlbGxTaXplWCxcbiAgICBjZWxsWSA9IGNlbGxTaXplWSxcbiAgICBzaGlwc0NvdW50ID0gc2hpcHMubGVuZ3RoLFxuICAgIGRpcmVjdGlvbiA9IGdhbWVib2FyZC5kaXJlY3Rpb25cbiAgKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcbiAgICAvLyBEcmF3IGEgY2VsbCB0byBvdmVybGF5XG4gICAgZnVuY3Rpb24gZHJhd0NlbGwocG9zWCwgcG9zWSkge1xuICAgICAgb3ZlcmxheUN0eC5maWxsUmVjdChwb3NYICogY2VsbFgsIHBvc1kgKiBjZWxsWSwgY2VsbFgsIGNlbGxZKTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgY3VycmVudCBzaGlwIGxlbmd0aCAoYmFzZWQgb24gZGVmYXVsdCBiYXR0bGVzaGlwIHJ1bGVzIHNpemVzLCBzbWFsbGVzdCB0byBiaWdnZXN0KVxuICAgIGxldCBkcmF3TGVuZ3RoO1xuICAgIGlmIChzaGlwc0NvdW50ID09PSAwKSBkcmF3TGVuZ3RoID0gMjtcbiAgICBlbHNlIGlmIChzaGlwc0NvdW50ID09PSAxIHx8IHNoaXBzQ291bnQgPT09IDIpIGRyYXdMZW5ndGggPSAzO1xuICAgIGVsc2UgZHJhd0xlbmd0aCA9IHNoaXBzQ291bnQgKyAxO1xuXG4gICAgLy8gRGV0ZXJtaW5lIGRpcmVjdGlvbiB0byBkcmF3IGluXG4gICAgbGV0IGRpcmVjdGlvblggPSAwO1xuICAgIGxldCBkaXJlY3Rpb25ZID0gMDtcblxuICAgIGlmIChkaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgIGRpcmVjdGlvblkgPSAxO1xuICAgICAgZGlyZWN0aW9uWCA9IDA7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDApIHtcbiAgICAgIGRpcmVjdGlvblkgPSAwO1xuICAgICAgZGlyZWN0aW9uWCA9IDE7XG4gICAgfVxuXG4gICAgLy8gRGl2aWRlIHRoZSBkcmF3TGVuZ2h0IGluIGhhbGYgd2l0aCByZW1haW5kZXJcbiAgICBjb25zdCBoYWxmRHJhd0xlbmd0aCA9IE1hdGguZmxvb3IoZHJhd0xlbmd0aCAvIDIpO1xuICAgIGNvbnN0IHJlbWFpbmRlckxlbmd0aCA9IGRyYXdMZW5ndGggJSAyO1xuXG4gICAgLy8gSWYgZHJhd2luZyBvZmYgY2FudmFzIG1ha2UgY29sb3IgcmVkXG4gICAgLy8gQ2FsY3VsYXRlIG1heGltdW0gYW5kIG1pbmltdW0gY29vcmRpbmF0ZXNcbiAgICBjb25zdCBtYXhDb29yZGluYXRlWCA9XG4gICAgICBjZWxsQ29vcmRpbmF0ZXNbMF0gKyAoaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGggLSAxKSAqIGRpcmVjdGlvblg7XG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVkgPVxuICAgICAgY2VsbENvb3JkaW5hdGVzWzFdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25ZO1xuICAgIGNvbnN0IG1pbkNvb3JkaW5hdGVYID0gY2VsbENvb3JkaW5hdGVzWzBdIC0gaGFsZkRyYXdMZW5ndGggKiBkaXJlY3Rpb25YO1xuICAgIGNvbnN0IG1pbkNvb3JkaW5hdGVZID0gY2VsbENvb3JkaW5hdGVzWzFdIC0gaGFsZkRyYXdMZW5ndGggKiBkaXJlY3Rpb25ZO1xuXG4gICAgLy8gQW5kIHRyYW5zbGF0ZSBpbnRvIGFuIGFjdHVhbCBjYW52YXMgcG9zaXRpb25cbiAgICBjb25zdCBtYXhYID0gbWF4Q29vcmRpbmF0ZVggKiBjZWxsWDtcbiAgICBjb25zdCBtYXhZID0gbWF4Q29vcmRpbmF0ZVkgKiBjZWxsWTtcbiAgICBjb25zdCBtaW5YID0gbWluQ29vcmRpbmF0ZVggKiBjZWxsWDtcbiAgICBjb25zdCBtaW5ZID0gbWluQ29vcmRpbmF0ZVkgKiBjZWxsWTtcblxuICAgIC8vIENoZWNrIGlmIGFueSBjZWxscyBhcmUgb3V0c2lkZSB0aGUgY2FudmFzIGJvdW5kYXJpZXNcbiAgICBjb25zdCBpc091dE9mQm91bmRzID1cbiAgICAgIG1heFggPj0gb3ZlcmxheUNhbnZhcy53aWR0aCB8fFxuICAgICAgbWF4WSA+PSBvdmVybGF5Q2FudmFzLmhlaWdodCB8fFxuICAgICAgbWluWCA8IDAgfHxcbiAgICAgIG1pblkgPCAwO1xuXG4gICAgLy8gU2V0IHRoZSBmaWxsIGNvbG9yIGJhc2VkIG9uIHdoZXRoZXIgY2VsbHMgYXJlIGRyYXduIG9mZiBjYW52YXNcbiAgICBvdmVybGF5Q3R4LmZpbGxTdHlsZSA9IGlzT3V0T2ZCb3VuZHMgPyBcInJlZFwiIDogXCJibHVlXCI7XG5cbiAgICAvLyBEcmF3IHRoZSBtb3VzZWQgb3ZlciBjZWxsIGZyb20gcGFzc2VkIGNvb3Jkc1xuICAgIGRyYXdDZWxsKGNlbGxDb29yZGluYXRlc1swXSwgY2VsbENvb3JkaW5hdGVzWzFdKTtcblxuICAgIC8vIERyYXcgdGhlIGZpcnN0IGhhbGYgb2YgY2VsbHMgYW5kIHJlbWFpbmRlciBpbiBvbmUgZGlyZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXh0WCA9IGNlbGxDb29yZGluYXRlc1swXSArIGkgKiBkaXJlY3Rpb25YO1xuICAgICAgY29uc3QgbmV4dFkgPSBjZWxsQ29vcmRpbmF0ZXNbMV0gKyBpICogZGlyZWN0aW9uWTtcbiAgICAgIGRyYXdDZWxsKG5leHRYLCBuZXh0WSk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyB0aGUgcmVtYWluaW5nIGhhbGZcbiAgICAvLyBEcmF3IHRoZSByZW1haW5pbmcgY2VsbHMgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZkRyYXdMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV4dFggPSBjZWxsQ29vcmRpbmF0ZXNbMF0gLSAoaSArIDEpICogZGlyZWN0aW9uWDtcbiAgICAgIGNvbnN0IG5leHRZID0gY2VsbENvb3JkaW5hdGVzWzFdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cbiAgfTtcblxuICAvLyBEcmF3IGhpZ2hsaWdodGVkIGF0dGFjayBjZWxsXG4gIGNvbnN0IGhpZ2hsaWdodEF0dGFjayA9IChcbiAgICBjZWxsQ29vcmRpbmF0ZXMsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVlcbiAgKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuICAgIG92ZXJsYXlDdHguY2xlYXJSZWN0KDAsIDAsIG92ZXJsYXlDYW52YXMud2lkdGgsIG92ZXJsYXlDYW52YXMuaGVpZ2h0KTtcblxuICAgIC8vIEhpZ2hsaWdodCB0aGUgY3VycmVudCBjZWxsIGluIHJlZFxuICAgIG92ZXJsYXlDdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcblxuICAgIC8vIENoZWNrIGlmIGNlbGwgY29vcmRzIGluIGdhbWVib2FyZCBoaXRzIG9yIG1pc3Nlc1xuICAgIGlmIChhbHJlYWR5QXR0YWNrZWQoY2VsbENvb3JkaW5hdGVzKSkgcmV0dXJuO1xuXG4gICAgLy8gSGlnaGxpZ2h0IHRoZSBjZWxsXG4gICAgb3ZlcmxheUN0eC5maWxsUmVjdChcbiAgICAgIGNlbGxDb29yZGluYXRlc1swXSAqIGNlbGxYLFxuICAgICAgY2VsbENvb3JkaW5hdGVzWzFdICogY2VsbFksXG4gICAgICBjZWxsWCxcbiAgICAgIGNlbGxZXG4gICAgKTtcbiAgfTtcblxuICAvLyBBZGQgbWV0aG9kcyBvbiB0aGUgY29udGFpbmVyIGZvciBkcmF3aW5nIGhpdHMgb3IgbWlzc2VzIGZvciBlYXNlIG9mIHVzZSBlbHNld2hlcmVcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdIaXQgPSAoY29vcmRpbmF0ZXMpID0+XG4gICAgYm9hcmRDYW52YXMuZHJhd0hpdE1pc3MoY29vcmRpbmF0ZXMsIDEpO1xuICBjYW52YXNDb250YWluZXIuZHJhd01pc3MgPSAoY29vcmRpbmF0ZXMpID0+XG4gICAgYm9hcmRDYW52YXMuZHJhd0hpdE1pc3MoY29vcmRpbmF0ZXMsIDApO1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFzc2lnbiBzdGF0aWMgYmVoYXZpb3JzXG4gIC8vIGJvYXJkQ2FudmFzXG4gIC8vIERyYXcgc2hpcHMgdG8gYm9hcmQgY2FudmFzIHVzaW5nIHNoaXBzQ29weVxuICBib2FyZENhbnZhcy5kcmF3U2hpcHMgPSAoXG4gICAgc2hpcHNUb0RyYXcgPSBzaGlwcyxcbiAgICBjZWxsWCA9IGNlbGxTaXplWCxcbiAgICBjZWxsWSA9IGNlbGxTaXplWVxuICApID0+IHtcbiAgICAvLyBEcmF3IGEgY2VsbCB0byBib2FyZFxuICAgIGZ1bmN0aW9uIGRyYXdDZWxsKHBvc1gsIHBvc1kpIHtcbiAgICAgIGJvYXJkQ3R4LmZpbGxSZWN0KHBvc1ggKiBjZWxsWCwgcG9zWSAqIGNlbGxZLCBjZWxsWCwgY2VsbFkpO1xuICAgIH1cblxuICAgIHNoaXBzVG9EcmF3LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAub2NjdXBpZWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgIGRyYXdDZWxsKGNlbGxbMF0sIGNlbGxbMV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gRHJhdyBoaXQgb3IgdG8gYm9hcmQgY2FudmFzXG4gIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzID0gKFxuICAgIGNlbGxDb29yZGluYXRlcyxcbiAgICB0eXBlID0gMCxcbiAgICBjZWxsWCA9IGNlbGxTaXplWCxcbiAgICBjZWxsWSA9IGNlbGxTaXplWVxuICApID0+IHtcbiAgICAvLyBTZXQgcHJvcGVyIGZpbGwgY29sb3JcbiAgICBib2FyZEN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgaWYgKHR5cGUgPT09IDEpIGJvYXJkQ3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgLy8gU2V0IGEgcmFkaXVzIGZvciBjaXJjbGUgdG8gZHJhdyBmb3IgXCJwZWdcIiB0aGF0IHdpbGwgYWx3YXlzIGZpdCBpbiBjZWxsXG4gICAgY29uc3QgcmFkaXVzID0gY2VsbFggPiBjZWxsWSA/IGNlbGxZIC8gMiA6IGNlbGxYIC8gMjtcbiAgICAvLyBEcmF3IHRoZSBjaXJjbGVcbiAgICBib2FyZEN0eC5iZWdpblBhdGgoKTtcbiAgICBib2FyZEN0eC5hcmMoXG4gICAgICBjZWxsQ29vcmRpbmF0ZXNbMF0gKiBjZWxsWCArIGNlbGxYIC8gMixcbiAgICAgIGNlbGxDb29yZGluYXRlc1sxXSAqIGNlbGxZICsgY2VsbFkgLyAyLFxuICAgICAgcmFkaXVzLFxuICAgICAgMCxcbiAgICAgIDIgKiBNYXRoLlBJXG4gICAgKTtcbiAgICBib2FyZEN0eC5zdHJva2UoKTtcbiAgICBib2FyZEN0eC5maWxsKCk7XG4gIH07XG5cbiAgLy8gb3ZlcmxheUNhbnZhc1xuICAvLyBGb3J3YXJkIGNsaWNrcyB0byBib2FyZCBjYW52YXNcbiAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBuZXdFdmVudCA9IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwge1xuICAgICAgYnViYmxlczogZXZlbnQuYnViYmxlcyxcbiAgICAgIGNhbmNlbGFibGU6IGV2ZW50LmNhbmNlbGFibGUsXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICB9KTtcbiAgICBib2FyZENhbnZhcy5kaXNwYXRjaEV2ZW50KG5ld0V2ZW50KTtcbiAgfTtcblxuICAvLyBNb3VzZWxlYXZlXG4gIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgY3VycmVudENlbGwgPSBudWxsO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEFzc2lnbiBiZWhhdmlvciB1c2luZyBicm93c2VyIGV2ZW50IGhhbmRsZXJzIGJhc2VkIG9uIG9wdGlvbnNcbiAgLy8gUGxhY2VtZW50IGlzIHVzZWQgZm9yIHBsYWNpbmcgc2hpcHNcbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJwbGFjZW1lbnRcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBjYW52YXNDb250YWluZXIgdG8gZGVub3RlIHBsYWNlbWVudCBjb250YWluZXJcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIFNldCB1cCBvdmVybGF5Q2FudmFzIHdpdGggYmVoYXZpb3JzIHVuaXF1ZSB0byBwbGFjZW1lbnRcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xuICAgICAgLy8gR2V0IHdoYXQgY2VsbCB0aGUgbW91c2UgaXMgb3ZlclxuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIC8vIElmIHRoZSAnb2xkJyBjdXJyZW50Q2VsbCBpcyBlcXVhbCB0byB0aGUgbW91c2VDZWxsIGJlaW5nIGV2YWx1YXRlZFxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIGN1cnJlbnRDZWxsICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMF0gPT09IG1vdXNlQ2VsbFswXSAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzFdID09PSBtb3VzZUNlbGxbMV1cbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFJlbmRlciB0aGUgY2hhbmdlc1xuICAgICAgICBoaWdobGlnaHRQbGFjZW1lbnRDZWxscyhtb3VzZUNlbGwpO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIGN1cnJlbnRDZWxsIHRvIHRoZSBtb3VzZUNlbGwgZm9yIGZ1dHVyZSBjb21wYXJpc29uc1xuICAgICAgY3VycmVudENlbGwgPSBtb3VzZUNlbGw7XG4gICAgfTtcblxuICAgIC8vIEJyb3dzZXIgY2xpY2sgZXZlbnRzXG4gICAgYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcblxuICAgICAgLy8gVHJ5IHBsYWNlbWVudFxuICAgICAgZ2FtZWJvYXJkLmFkZFNoaXAobW91c2VDZWxsKTtcbiAgICAgIGJvYXJkQ2FudmFzLmRyYXdTaGlwcygpO1xuICAgICAgdXNlckJvYXJkQ2FudmFzLmRyYXdTaGlwcygpO1xuICAgICAgd2ViSW50ZXJmYWNlLnRyeVN0YXJ0R2FtZSgpO1xuICAgIH07XG4gIH1cbiAgLy8gVXNlciBjYW52YXMgZm9yIGRpc3BsYXlpbmcgYWkgaGl0cyBhbmQgbWlzc2VzIGFnYWluc3QgdXNlciBhbmQgdXNlciBzaGlwIHBsYWNlbWVudHNcbiAgZWxzZSBpZiAob3B0aW9ucy50eXBlID09PSBcInVzZXJcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBkZW5vdGUgdXNlciBjYW52YXNcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInVzZXItY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBIYW5kbGUgY2FudmFzIG1vdXNlIG1vdmVcbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZSA9ICgpID0+IHtcbiAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9O1xuICAgIC8vIEhhbmRsZSBib2FyZCBtb3VzZSBjbGlja1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfTtcbiAgfVxuICAvLyBBSSBjYW52YXMgZm9yIGRpc3BsYXlpbmcgdXNlciBoaXRzIGFuZCBtaXNzZXMgYWdhaW5zdCBhaSwgYW5kIGFpIHNoaXAgcGxhY2VtZW50cyBpZiB1c2VyIGxvc2VzXG4gIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJhaVwiKSB7XG4gICAgLy8gQWRkIGNsYXNzIHRvIGRlbm90ZSBhaSBjYW52YXNcbiAgICBjYW52YXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFpLWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gSGFuZGxlIGNhbnZhcyBtb3VzZSBtb3ZlXG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIEdldCB3aGF0IGNlbGwgdGhlIG1vdXNlIGlzIG92ZXJcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG5cbiAgICAgIC8vIElmIHRoZSAnb2xkJyBjdXJyZW50Q2VsbCBpcyBlcXVhbCB0byB0aGUgbW91c2VDZWxsIGJlaW5nIGV2YWx1YXRlZFxuICAgICAgaWYgKFxuICAgICAgICAhKFxuICAgICAgICAgIGN1cnJlbnRDZWxsICYmXG4gICAgICAgICAgY3VycmVudENlbGxbMF0gPT09IG1vdXNlQ2VsbFswXSAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzFdID09PSBtb3VzZUNlbGxbMV1cbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgY3VycmVudCBjZWxsIGluIHJlZFxuICAgICAgICBoaWdobGlnaHRBdHRhY2sobW91c2VDZWxsKTtcbiAgICAgIH1cbiAgICAgIC8vIERlbm90ZSBpZiBpdCBpcyBhIHZhbGlkIGF0dGFjayBvciBub3QgLSBOWUlcbiAgICB9O1xuICAgIC8vIEhhbmRsZSBib2FyZCBtb3VzZSBjbGlja1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIFJlZiB0byBnYW1lYm9hcmRcbiAgICAgIGNvbnN0IGFpQm9hcmQgPSBnYW1lYm9hcmQ7XG4gICAgICAvLyBSZXR1cm4gaWYgZ2FtZWJvYXJkIGNhbid0IGF0dGFja1xuICAgICAgaWYgKGFpQm9hcmQucml2YWxCb2FyZC5jYW5BdHRhY2sgPT09IGZhbHNlKSByZXR1cm47XG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgY2VsbFxuICAgICAgY29uc3QgbW91c2VDZWxsID0gZ2V0TW91c2VDZWxsKGV2ZW50KTtcbiAgICAgIC8vIFRyeSBhdHRhY2sgYXQgY3VycmVudCBjZWxsXG4gICAgICBpZiAoYWxyZWFkeUF0dGFja2VkKG1vdXNlQ2VsbCkpIHtcbiAgICAgICAgLy8gQmFkIHRoaW5nLiBFcnJvciBzb3VuZCBtYXliZS5cbiAgICAgIH0gZWxzZSBpZiAoZ2FtZWJvYXJkLmdhbWVPdmVyID09PSBmYWxzZSkge1xuICAgICAgICAvLyBTZXQgZ2FtZWJvYXJkIHRvIG5vdCBiZSBhYmxlIHRvIGF0dGFja1xuICAgICAgICBhaUJvYXJkLnJpdmFsQm9hcmQuY2FuQXR0YWNrID0gZmFsc2U7XG4gICAgICAgIC8vIExvZyB0aGUgc2VudCBhdHRhY2tcbiAgICAgICAgZ2FtZUxvZy5lcmFzZSgpO1xuICAgICAgICBnYW1lTG9nLmFwcGVuZChgVXNlciBhdHRhY2tzIGNlbGw6ICR7bW91c2VDZWxsfWApO1xuICAgICAgICAvLyBTZW5kIHRoZSBhdHRhY2tcbiAgICAgICAgZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2sobW91c2VDZWxsKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAvLyBBdHRhY2sgaGl0XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gRHJhdyBoaXQgdG8gYm9hcmRcbiAgICAgICAgICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKG1vdXNlQ2VsbCwgMSk7XG4gICAgICAgICAgICAvLyBMb2cgaGl0XG4gICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkF0dGFjayBoaXQhXCIpO1xuICAgICAgICAgICAgLy8gTG9nIHN1bmtlbiBzaGlwc1xuICAgICAgICAgICAgYWlCb2FyZC5sb2dTdW5rKCk7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBwbGF5ZXIgd29uXG4gICAgICAgICAgICBpZiAoYWlCb2FyZC5hbGxTdW5rKCkpIHtcbiAgICAgICAgICAgICAgLy8gTG9nIHJlc3VsdHNcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgXCJBbGwgQUkgdW5pdHMgZGVzdHJveWVkLiBcXG5IdW1hbml0eSBzdXJ2aXZlcyBhbm90aGVyIGRheS4uLlwiXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIC8vIFNldCBnYW1lb3ZlciBvbiBib2FyZHNcbiAgICAgICAgICAgICAgYWlCb2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgICAgIGFpQm9hcmQucml2YWxCb2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBMb2cgdGhlIGFpIFwidGhpbmtpbmdcIiBhYm91dCBpdHMgYXR0YWNrXG4gICAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQUkgZGV0cm1pbmluZyBhdHRhY2suLi5cIik7XG4gICAgICAgICAgICAgIC8vIEhhdmUgdGhlIGFpIGF0dGFjayBpZiBub3QgZ2FtZU92ZXJcbiAgICAgICAgICAgICAgZ2FtZWJvYXJkLnRyeUFpQXR0YWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBEcmF3IG1pc3MgdG8gYm9hcmRcbiAgICAgICAgICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKG1vdXNlQ2VsbCwgMCk7XG4gICAgICAgICAgICAvLyBMb2cgbWlzc1xuICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBdHRhY2sgbWlzc2VkIVwiKTtcbiAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQUkgZGV0cm1pbmluZyBhdHRhY2suLi5cIik7XG4gICAgICAgICAgICAvLyBIYXZlIHRoZSBhaSBhdHRhY2sgaWYgbm90IGdhbWVPdmVyXG4gICAgICAgICAgICBnYW1lYm9hcmQudHJ5QWlBdHRhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDbGVhciB0aGUgb3ZlcmxheSB0byBzaG93IGhpdC9taXNzIHVuZGVyIGN1cnJlbnQgaGlnaGlnaHRcbiAgICAgICAgb3ZlcmxheUN0eC5jbGVhclJlY3QoMCwgMCwgb3ZlcmxheUNhbnZhcy53aWR0aCwgb3ZlcmxheUNhbnZhcy5oZWlnaHQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIFN1YnNjcmliZSB0byBicm93c2VyIGV2ZW50c1xuICAvLyBib2FyZCBjbGlja1xuICBib2FyZENhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2soZSkpO1xuICAvLyBvdmVybGF5IGNsaWNrXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VDbGljayhlKVxuICApO1xuICAvLyBvdmVybGF5IG1vdXNlbW92ZVxuICBvdmVybGF5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUoZSlcbiAgKTtcbiAgLy8gb3ZlcmxheSBtb3VzZWxlYXZlXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTGVhdmUoKVxuICApO1xuXG4gIC8vIERyYXcgaW5pdGlhbCBib2FyZCBsaW5lc1xuICBkcmF3TGluZXMoYm9hcmRDdHgpO1xuXG4gIC8vIFJldHVybiBjb21wbGV0ZWQgY2FudmFzZXNcbiAgcmV0dXJuIGNhbnZhc0NvbnRhaW5lcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNhbnZhcztcbiIsIi8vIFRoaXMgaGVscGVyIHdpbGwgYXR0ZW1wdCB0byBhZGQgc2hpcHMgdG8gdGhlIGFpIGdhbWVib2FyZCBpbiBhIHZhcmlldHkgb2Ygd2F5cyBmb3IgdmFyeWluZyBkaWZmaWN1bHR5XG5jb25zdCBwbGFjZUFpU2hpcHMgPSAocGFzc2VkRGlmZiwgYWlHYW1lYm9hcmQpID0+IHtcbiAgLy8gR3JpZCBzaXplXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG5cbiAgLy8gQ29weSBvZiB0aGUgYWkgc2hpcHMgYXJyYXkgYW5kIG1ldGhvZCB0byBnZXQgaXRcbiAgY29uc3QgYWlTaGlwcyA9IGFpR2FtZWJvYXJkLnNoaXBzO1xuXG4gIC8vIFBsYWNlIGEgc2hpcCByYW5kb21seVxuICBjb25zdCBwbGFjZVJhbmRvbVNoaXAgPSAoKSA9PiB7XG4gICAgLy8gR2V0IHJhbmRvbSBwbGFjZW1lbnRcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZFdpZHRoKTtcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZEhlaWdodCk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgICAvLyBUcnkgdGhlIHBsYWNlbWVudFxuXG4gICAgYWlHYW1lYm9hcmQuYWRkU2hpcChbeCwgeV0sIGRpcmVjdGlvbik7XG4gIH07XG4gIC8vIFBsYWNlIGEgc2hpcCBhbG9uZyBlZGdlcyB1bnRpbCBvbmUgc3VjY2Vzc2Z1bGx5IHBsYWNlZFxuICAvLyBQbGFjZSBhIHNoaXAgYmFzZWQgb24gcXVhZHJhbnRcblxuICAvLyBXYWl0cyBmb3IgYSBhaVNoaXBzU2V0IGV2ZW50XG4gIGZ1bmN0aW9uIHdhaXRGb3JBaVNoaXBzU2V0KCkge1xuICAgIC8vIFJlZmFjdG9yXG4gIH1cblxuICAvLyBDb21iaW5lIHBsYWNlbWVudCB0YWN0aWNzIHRvIGNyZWF0ZSB2YXJ5aW5nIGRpZmZpY3VsdGllc1xuICBjb25zdCBwbGFjZVNoaXBzID0gYXN5bmMgKGRpZmZpY3VsdHkpID0+IHtcbiAgICAvLyBUb3RhbGx5IHJhbmRvbSBwYWxjZW1lbnRcbiAgICBpZiAoZGlmZmljdWx0eSA9PT0gMSAmJiBhaVNoaXBzLmxlbmd0aCA8PSA0KSB7XG4gICAgICAvLyBUcnkgcmFuZG9tIHBsYWNlbWVudFxuICAgICAgcGxhY2VSYW5kb21TaGlwKCk7XG5cbiAgICAgIC8vIFdhaXQgZm9yIHJldHVybkFpU2hpcHNcbiAgICAgIGF3YWl0IHdhaXRGb3JBaVNoaXBzU2V0KCk7XG4gICAgICAvLyBSZWN1cnNpdmVseSBjYWxsIGZuIHVudGlsIHNoaXBzIHBsYWNlZFxuICAgICAgcGxhY2VTaGlwcyhkaWZmaWN1bHR5KTtcbiAgICB9XG4gIH07XG5cbiAgcGxhY2VTaGlwcyhwYXNzZWREaWZmKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlQWlTaGlwcztcbiIsImNvbnN0IGdhbWVMb2cgPSAoKCkgPT4ge1xuICAvLyBSZWYgdG8gbG9nIHRleHRcbiAgY29uc3QgbG9nVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9nLXRleHRcIik7XG5cbiAgLy8gRXJhc2UgdGhlIGxvZyB0ZXh0XG4gIGNvbnN0IGVyYXNlID0gKCkgPT4ge1xuICAgIGxvZ1RleHQudGV4dENvbnRlbnQgPSBcIlwiO1xuICB9O1xuXG4gIC8vIEFkZCB0byBsb2cgdGV4dFxuICBjb25zdCBhcHBlbmQgPSAoc3RyaW5nVG9BcHBlbmQpID0+IHtcbiAgICBpZiAoc3RyaW5nVG9BcHBlbmQpIHtcbiAgICAgIGxvZ1RleHQuaW5uZXJIVE1MICs9IGBcXG4ke3N0cmluZ1RvQXBwZW5kLnRvU3RyaW5nKCl9YDtcbiAgICB9XG4gIH07XG5cbiAgLy8gU2V0IHRoZSBzY2VuZSBpbWFnZSBpbiB0aGUgbG9nXG4gIC8vIExvYWRzIHNjZW5lIGltYWdlcyBmb3IgdXNlXG4gIGNvbnN0IHNjZW5lSW1hZ2VzID0geyBzcDoge30sIGF0OiB7fSwgdm06IHt9LCBpZzoge30sIGw6IHt9IH07XG4gIGNvbnN0IGxvYWRTY2VuZXMgPSAoKSA9PiB7XG4gICAgLy8gVXJscyBmb3IgYWxsIHNjZW5lIGltYWdlc1xuICAgIGNvbnN0IHVybHMgPSB7XG4gICAgICBzcDoge1xuICAgICAgICBnZW46IFtcbiAgICAgICAgICBcIi4uL3NjZW5lLWltYWdlcy9TZW50aW5lbCBQcm9iZS9zcF9nZW4xLmpwZ1wiLFxuICAgICAgICAgIFwiLi4vc2NlbmUtaW1hZ2VzL1NlbnRpbmVsIFByb2JlL3NwX2dlbjIuanBnXCIsXG4gICAgICAgICAgXCIuLi9zY2VuZS1pbWFnZXMvU2VudGluZWwgUHJvYmUvc3BfZ2VuMy5qcGdcIixcbiAgICAgICAgICBcIi4uL3NjZW5lLWltYWdlcy9TZW50aW5lbCBQcm9iZS9zcF9nZW40LmpwZ1wiLFxuICAgICAgICBdLFxuICAgICAgICBhdHRhY2s6IFtcbiAgICAgICAgICBcIi4uL3NjZW5lLWltYWdlcy9TZW50aW5lbCBQcm9iZS9zcF9hdHRhY2sxLmpwZ1wiLFxuICAgICAgICAgIFwiLi4vc2NlbmUtaW1hZ2VzL1NlbnRpbmVsIFByb2JlL3NwX2F0dGFjazIuanBnXCIsXG4gICAgICAgICAgXCIuLi9zY2VuZS1pbWFnZXMvU2VudGluZWwgUHJvYmUvc3BfYXR0YWNrMy5qcGdcIixcbiAgICAgICAgICBcIi4uL3NjZW5lLWltYWdlcy9TZW50aW5lbCBQcm9iZS9zcF9hdHRhY2s0LmpwZ1wiLFxuICAgICAgICBdLFxuICAgICAgICBoaXQ6IFtcbiAgICAgICAgICBcIi4uL3NjZW5lLWltYWdlcy9TZW50aW5lbCBQcm9iZS9zcF9oaXQxLmpwZ1wiLFxuICAgICAgICAgIFwiLi4vc2NlbmUtaW1hZ2VzL1NlbnRpbmVsIFByb2JlL3NwX2hpdDIuanBnXCIsXG4gICAgICAgICAgXCIuLi9zY2VuZS1pbWFnZXMvU2VudGluZWwgUHJvYmUvc3BfaGl0My5qcGdcIixcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8vIExvYWQgc2VudGluZWwgcHJvYmUgaW1hZ2VzIGZvciB1c2VcbiAgICBPYmplY3Qua2V5cyh1cmxzLnNwKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIC8vIFNldCB0aGUgcHJvcGVydHkgdGhhdCBob2xkcyBpbWdzIHRvIGFycmF5XG4gICAgICBzY2VuZUltYWdlcy5zcFtrZXldID0gW107XG4gICAgICAvLyBBZGQgaW1ncyB0byB0aGF0IGFycmF5XG4gICAgICB1cmxzLnNwW2tleV0uZm9yRWFjaCgodXJsKSA9PiB7XG4gICAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGltYWdlLnNyYyA9IHVybDtcbiAgICAgICAgc2NlbmVJbWFnZXMuc3Bba2V5XS5wdXNoKGltYWdlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFNldHMgdGhlIHNjZW5lIGltYWdlIGJhc2VkIG9uIHBhcmFtcyBwYXNzZWRcbiAgY29uc3Qgc2NlbmUgPSAodW5pdCwgc3RhdGUpID0+IHtcbiAgICAvLyBTZXQgdGhlIGltZyBiYXNlZCBvbiBwYXJhbXNcbiAgfTtcblxuICByZXR1cm4geyBlcmFzZSwgYXBwZW5kLCBsb2FkU2NlbmVzIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9nO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vZmFjdG9yaWVzL1BsYXllclwiO1xuaW1wb3J0IGNhbnZhc0FkZGVyIGZyb20gXCIuLi9oZWxwZXJzL2NhbnZhc0FkZGVyXCI7XG5pbXBvcnQgd2ViSW50ZXJmYWNlIGZyb20gXCIuL3dlYkludGVyZmFjZVwiO1xuaW1wb3J0IHBsYWNlQWlTaGlwcyBmcm9tIFwiLi4vaGVscGVycy9wbGFjZUFpU2hpcHNcIjtcbmltcG9ydCBnYW1lTG9nIGZyb20gXCIuL2dhbWVMb2dcIjtcblxuLyogVGhpcyBtb2R1bGUgaG9sZHMgdGhlIGdhbWUgbG9vcCBsb2dpYyBmb3Igc3RhcnRpbmcgZ2FtZXMsIGNyZWF0aW5nXG4gICByZXF1aXJlZCBvYmplY3RzLCBpdGVyYXRpbmcgdGhyb3VnaCB0dXJucywgcmVwb3J0aW5nIGdhbWUgb3V0Y29tZSB3aGVuXG4gICBhIHBsYXllciBsb3NlcywgYW5kIHJlc3RhcnQgdGhlIGdhbWUgKi9cbmNvbnN0IGdhbWVNYW5hZ2VyID0gKCkgPT4ge1xuICAvLyAjcmVnaW9uIExvYWRpbmcvSW5pdFxuICAvLyBMb2FkIHNjZW5lIGltYWdlcyBmb3IgZ2FtZSBsb2dcbiAgZ2FtZUxvZy5sb2FkU2NlbmVzKCk7XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gb2YgUGxheWVyIG9iamVjdHMgZm9yIHVzZXIgYW5kIEFJXG4gIGNvbnN0IHVzZXJQbGF5ZXIgPSBQbGF5ZXIoKTtcbiAgY29uc3QgYWlQbGF5ZXIgPSBQbGF5ZXIoKTtcbiAgdXNlclBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IGFpUGxheWVyLmdhbWVib2FyZDtcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSB1c2VyUGxheWVyLmdhbWVib2FyZDtcbiAgdXNlclBsYXllci5nYW1lYm9hcmQuaXNBaSA9IGZhbHNlO1xuICBhaVBsYXllci5nYW1lYm9hcmQuaXNBaSA9IHRydWU7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgd2ViIGludGVyZmFjZSB3aXRoIGdhbWVib2FyZHNcbiAgY29uc3Qgd2ViSW50ID0gd2ViSW50ZXJmYWNlKHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLCBhaVBsYXllci5nYW1lYm9hcmQpO1xuICAvLyBBZGQgdGhlIGNhbnZhcyBvYmplY3RzIG5vdyB0aGF0IGdhbWVib2FyZHMgYXJlIGNyZWF0ZWRcbiAgY29uc3QgY2FudmFzZXMgPSBjYW52YXNBZGRlcihcbiAgICB1c2VyUGxheWVyLmdhbWVib2FyZCxcbiAgICBhaVBsYXllci5nYW1lYm9hcmQsXG4gICAgd2ViSW50XG4gICk7XG4gIC8vIEFkZCBjYW52YXNlcyB0byBnYW1lYm9hcmRzXG4gIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLmNhbnZhcyA9IGNhbnZhc2VzLnVzZXJDYW52YXM7XG4gIGFpUGxheWVyLmdhbWVib2FyZC5jYW52YXMgPSBjYW52YXNlcy5haUNhbnZhcztcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gQWRkIGFpIHNoaXBzXG4gIHBsYWNlQWlTaGlwcygxLCBhaVBsYXllci5nYW1lYm9hcmQpO1xuICAvKiBNZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGdhbWUgaXMgb3ZlciBhZnRlciBldmVyeSB0dXJuLiBDaGVja3MgYWxsU3VuayBvbiByaXZhbCBnYW1lYm9hcmQgXG4gICAgIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2UgKi9cblxuICAvKiBNZXRob2QgdGhhdCBmbGlwcyBhIHZpcnR1YWwgY29pbiB0byBkZXRlcm1pbmUgd2hvIGdvZXMgZmlyc3QsIGFuZCBzZXRzIHRoYXRcbiAgICAgcGxheWVyIG9iamVjdCB0byBhbiBhY3RpdmUgcGxheWVyIHZhcmlhYmxlICovXG5cbiAgLy8gTWV0aG9kIGZvciBlbmRpbmcgdGhlIGdhbWUgYnkgcmVwb3J0aW5nIHJlc3VsdHNcblxuICAvLyBNZXRob2QgZm9yIHJlc3RhcnRpbmcgdGhlIGdhbWVcblxuICAvKiBJdGVyYXRlIGJldHdlZW4gcGxheWVycyBmb3IgYXR0YWNrcyAtIGlmIGFib3ZlIG1ldGhvZCBkb2Vzbid0IHJldHVybiB0cnVlLCBjaGVjayB0aGVcbiAgICAgYWN0aXZlIHBsYXllciBhbmQgcXVlcnkgdGhlbSBmb3IgdGhlaXIgbW92ZS4gSWYgYWJvdmUgbWV0aG9kIGlzIHRydWUsIGNhbGwgbWV0aG9kXG4gICAgIGZvciBlbmRpbmcgdGhlIGdhbWUsIHRoZW4gbWV0aG9kIGZvciByZXN0YXJ0aW5nIHRoZSBnYW1lLlxuICAgICBcbiAgICAgLUZvciB1c2VyIC0gc2V0IGEgb25lIHRpbWUgZXZlbnQgdHJpZ2dlciBmb3IgdXNlciBjbGlja2luZyBvbiB2YWxpZCBhdHRhY2sgcG9zaXRpb24gZGl2XG4gICAgIG9uIHRoZSB3ZWIgaW50ZXJmYWNlLiBJdCB3aWxsIHVzZSBnYW1lYm9hcmQucml2YWxCb2FyZC5yZWNlaXZlQXR0YWNrIGFuZCBpbmZvIGZyb20gdGhlIGRpdlxuICAgICBodG1sIGRhdGEgdG8gaGF2ZSB0aGUgYm9hcmQgYXR0ZW1wdCB0aGUgYXR0YWNrLiBJZiB0aGUgYXR0YWNrIGlzIHRydWUgb3IgZmFsc2UgdGhlbiBhIHZhbGlkXG4gICAgIGhpdCBvciB2YWxpZCBtaXNzIG9jY3VycmVkLiBJZiB1bmRlZmluZWQgdGhlbiBhbiBpbnZhbGlkIGF0dGFjayB3YXMgbWFkZSwgdHlwaWNhbGx5IG1lYW5pbmdcbiAgICAgYXR0YWNraW5nIGEgY2VsbCB0aGF0IGhhcyBhbHJlYWR5IGhhZCBhIGhpdCBvciBtaXNzIG9jY3VyIGluIGl0LiBJZiB0aGUgYXR0YWNrIGlzIGludmFsaWQgXG4gICAgIHRoZW4gcmVzZXQgdGhlIHRyaWdnZXIuIEFmdGVyIGEgc3VjY2Vzc2Z1bCBhdHRhY2sgKHRydWUgb3IgZmFsc2UgcmV0dXJuZWQpIHRoZW4gc2V0IHRoZSBcbiAgICAgYWN0aXZlIHBsYXllciB0byB0aGUgQUkgYW5kIGxvb3BcblxuICAgICAtRm9yIEFJIHVzZSBBSSBtb2R1bGUncyBxdWVyeSBtZXRob2QgYW5kIHBhc3MgaW4gcmVsZXZhbnQgcGFyYW1ldGVycy4gQUkgbW9kdWxlIGRvZXMgaXRzXG4gICAgIG1hZ2ljIGFuZCByZXR1cm5zIGEgcG9zaXRpb24uIFRoZW4gdXNlIGdhbWVib2FyZC5yaXZhbGJvYXJkLnJlY2VpdmVkQXR0YWNrIHRvIG1ha2UgYW5kIFxuICAgICBjb25maXJtIHRoZSBhdHRhY2sgc2ltaWxhciB0byB0aGUgdXNlcnMgYXR0YWNrcyAqL1xuXG4gIC8vIFRoZSBsb2dpYyBvZiB0aGUgZ2FtZSBtYW5hZ2VyIGFuZCBob3cgdGhlIHdlYiBpbnRlcmZhY2UgcmVzcG9uZHMgdG8gaXQgd2lsbCByZW1haW5cbiAgLy8gc2VwYXJhdGVkIGJ5IHVzaW5nIGEgcHVic3ViIG1vZHVsZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZU1hbmFnZXI7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLyogVGhpcyBtb2R1bGUgaGFzIHRocmVlIHByaW1hcnkgZnVuY3Rpb25zOlxuICAgMS4gR2V0IHNoaXAgcGxhY2VtZW50IGNvb3JkaW5hdGVzIGZyb20gdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgY2xpY2tzIG9uIHRoZSB3ZWIgaW50ZXJmYWNlXG4gICAyLiBHZXQgYXR0YWNrIHBsYWNlbWVudCBjb29yZGluYXRlcyBmcm9tIHRoZSB1c2VyIGJhc2VkIG9uIHRoZSBzYW1lXG4gICAzLiBPdGhlciBtaW5vciBpbnRlcmZhY2UgYWN0aW9ucyBzdWNoIGFzIGhhbmRsaW5nIGJ1dHRvbiBjbGlja3MgKHN0YXJ0IGdhbWUsIHJlc3RhcnQsIGV0YykgKi9cbmNvbnN0IHdlYkludGVyZmFjZSA9ICh1c2VyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCkgPT4ge1xuICAvLyBSZWZlcmVuY2VzIHRvIG1haW4gZWxlbWVudHNcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xuICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpO1xuICBjb25zdCBwbGFjZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudFwiKTtcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcblxuICAvLyBSZWZlcmVuY2UgdG8gYnRuIGVsZW1lbnRzXG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydC1idG5cIik7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ0blwiKTtcblxuICAvLyBNZXRob2QgZm9yIGl0ZXJhdGluZyB0aHJvdWdoIGRpcmVjdGlvbnNcbiAgY29uc3Qgcm90YXRlRGlyZWN0aW9uID0gKCkgPT4ge1xuICAgIHVzZXJHYW1lYm9hcmQuZGlyZWN0aW9uID0gdXNlckdhbWVib2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgICBhaUdhbWVib2FyZC5kaXJlY3Rpb24gPSBhaUdhbWVib2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgfTtcblxuICAvLyAjcmVnaW9uIEJhc2ljIG1ldGhvZHMgZm9yIHNob3dpbmcvaGlkaW5nIGVsZW1lbnRzXG4gIC8vIE1vdmUgYW55IGFjdGl2ZSBzZWN0aW9ucyBvZmYgdGhlIHNjcmVlblxuICBjb25zdCBoaWRlQWxsID0gKCkgPT4ge1xuICAgIG1lbnUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hvdyB0aGUgbWVudSBVSVxuICBjb25zdCBzaG93TWVudSA9ICgpID0+IHtcbiAgICBoaWRlQWxsKCk7XG4gICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIHNoaXAgcGxhY2VtZW50IFVJXG4gIGNvbnN0IHNob3dQbGFjZW1lbnQgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIHBsYWNlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIGdhbWUgVUlcbiAgY29uc3Qgc2hvd0dhbWUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIGdhbWUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcbiAgLy8gSWYgdGhlIHVzZXIgZ2FtZWJvYXJkIGhhcyBmdWxsIHNoaXBzIHRoZW4gdGhlIGdhbWUgaXMgcmVhZHkgdG8gc3RhcnRcbiAgY29uc3QgdHJ5U3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGlmICh1c2VyR2FtZWJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgc2hvd0dhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQWRkIGNsYXNzZXMgdG8gc2hpcCBkaXZzIHRvIHJlcHJlc2VudCBwbGFjZWQvZGVzdHJveWVkXG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBicm93c2VyIGV2ZW50c1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVJvdGF0ZUNsaWNrKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVN0YXJ0Q2xpY2spO1xuXG4gIHJldHVybiB7IHRyeVN0YXJ0R2FtZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2ViSW50ZXJmYWNlO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxuICAgdjIuMCB8IDIwMTEwMTI2XG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxuKi9cblxuaHRtbCxcbmJvZHksXG5kaXYsXG5zcGFuLFxuYXBwbGV0LFxub2JqZWN0LFxuaWZyYW1lLFxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxucCxcbmJsb2NrcXVvdGUsXG5wcmUsXG5hLFxuYWJicixcbmFjcm9ueW0sXG5hZGRyZXNzLFxuYmlnLFxuY2l0ZSxcbmNvZGUsXG5kZWwsXG5kZm4sXG5lbSxcbmltZyxcbmlucyxcbmtiZCxcbnEsXG5zLFxuc2FtcCxcbnNtYWxsLFxuc3RyaWtlLFxuc3Ryb25nLFxuc3ViLFxuc3VwLFxudHQsXG52YXIsXG5iLFxudSxcbmksXG5jZW50ZXIsXG5kbCxcbmR0LFxuZGQsXG5vbCxcbnVsLFxubGksXG5maWVsZHNldCxcbmZvcm0sXG5sYWJlbCxcbmxlZ2VuZCxcbnRhYmxlLFxuY2FwdGlvbixcbnRib2R5LFxudGZvb3QsXG50aGVhZCxcbnRyLFxudGgsXG50ZCxcbmFydGljbGUsXG5hc2lkZSxcbmNhbnZhcyxcbmRldGFpbHMsXG5lbWJlZCxcbmZpZ3VyZSxcbmZpZ2NhcHRpb24sXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxub3V0cHV0LFxucnVieSxcbnNlY3Rpb24sXG5zdW1tYXJ5LFxudGltZSxcbm1hcmssXG5hdWRpbyxcbnZpZGVvIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3JkZXI6IDA7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbiAgZm9udDogaW5oZXJpdDtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xuYXJ0aWNsZSxcbmFzaWRlLFxuZGV0YWlscyxcbmZpZ2NhcHRpb24sXG5maWd1cmUsXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxuc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuYm9keSB7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxub2wsXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5ibG9ja3F1b3RlLFxucSB7XG4gIHF1b3Rlczogbm9uZTtcbn1cbmJsb2NrcXVvdGU6YmVmb3JlLFxuYmxvY2txdW90ZTphZnRlcixcbnE6YmVmb3JlLFxucTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNvbnRlbnQ6IG5vbmU7XG59XG50YWJsZSB7XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Q0FHQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUZFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsU0FBUztFQUNULGVBQWU7RUFDZixhQUFhO0VBQ2Isd0JBQXdCO0FBQzFCO0FBQ0EsZ0RBQWdEO0FBQ2hEOzs7Ozs7Ozs7OztFQVdFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxZQUFZO0FBQ2Q7QUFDQTs7OztFQUlFLFdBQVc7RUFDWCxhQUFhO0FBQ2Y7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixpQkFBaUI7QUFDbkJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsXFxuYm9keSxcXG5kaXYsXFxuc3BhbixcXG5hcHBsZXQsXFxub2JqZWN0LFxcbmlmcmFtZSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wLFxcbmJsb2NrcXVvdGUsXFxucHJlLFxcbmEsXFxuYWJicixcXG5hY3JvbnltLFxcbmFkZHJlc3MsXFxuYmlnLFxcbmNpdGUsXFxuY29kZSxcXG5kZWwsXFxuZGZuLFxcbmVtLFxcbmltZyxcXG5pbnMsXFxua2JkLFxcbnEsXFxucyxcXG5zYW1wLFxcbnNtYWxsLFxcbnN0cmlrZSxcXG5zdHJvbmcsXFxuc3ViLFxcbnN1cCxcXG50dCxcXG52YXIsXFxuYixcXG51LFxcbmksXFxuY2VudGVyLFxcbmRsLFxcbmR0LFxcbmRkLFxcbm9sLFxcbnVsLFxcbmxpLFxcbmZpZWxkc2V0LFxcbmZvcm0sXFxubGFiZWwsXFxubGVnZW5kLFxcbnRhYmxlLFxcbmNhcHRpb24sXFxudGJvZHksXFxudGZvb3QsXFxudGhlYWQsXFxudHIsXFxudGgsXFxudGQsXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5jYW52YXMsXFxuZGV0YWlscyxcXG5lbWJlZCxcXG5maWd1cmUsXFxuZmlnY2FwdGlvbixcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5vdXRwdXQsXFxucnVieSxcXG5zZWN0aW9uLFxcbnN1bW1hcnksXFxudGltZSxcXG5tYXJrLFxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICBmb250OiBpbmhlcml0O1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5kZXRhaWxzLFxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsXFxucSB7XFxuICBxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLFxcbmJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsXFxucTphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBDb2xvciBSdWxlcyAqL1xuOnJvb3Qge1xuICAtLWNvbG9yQTE6ICM3MjJiOTQ7XG4gIC0tY29sb3JBMjogI2E5MzZlMDtcbiAgLS1jb2xvckM6ICMzN2UwMmI7XG4gIC0tY29sb3JCMTogIzk0MWQwZDtcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xuXG4gIC0tYmctY29sb3I6IGhzbCgwLCAwJSwgMjIlKTtcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcbiAgLS10ZXh0LWNvbG9yOiBoc2woMCwgMCUsIDkxJSk7XG4gIC0tbGluay1jb2xvcjogaHNsKDM2LCA5MiUsIDU5JSk7XG59XG5cbi8qICNyZWdpb24gVW5pdmVyc2FsIGVsZW1lbnQgcnVsZXMgKi9cbmEge1xuICBjb2xvcjogdmFyKC0tbGluay1jb2xvcik7XG59XG5cbmJvZHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIDFmcjtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xuICBncmlkLXJvdzogLTEgLyAxO1xuICBncmlkLWNvbHVtbjogLTEgLyAxO1xufVxuXG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXG4ubWFpbi1jb250ZW50IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi8qIHRpdGxlIGdyaWQgKi9cbi50aXRsZSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiAyIC8gNjtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC44cyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcjIpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4udGl0bGUtdGV4dCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogNC44cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xuICBjb2xvcjogdmFyKC0tY29sb3JCMik7XG5cbiAgdHJhbnNpdGlvbjogZm9udC1zaXplIDAuOHMgZWFzZS1pbi1vdXQ7XG59XG5cbi50aXRsZS5zaHJpbmsge1xuICB0cmFuc2Zvcm06IHNjYWxlKDAuNSkgdHJhbnNsYXRlWSgtNTAlKTtcbn1cblxuLnRpdGxlLnNocmluayAudGl0bGUtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMy41cmVtO1xufVxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cbi5tZW51IHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDggLyAxODtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA1JSAxNSUgNSUgMWZyIDUlIDFmciAvIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi5cIlxuICAgIFwiY3JlZGl0c1wiXG4gICAgXCIuXCJcbiAgICBcInN0YXJ0LWdhbWVcIlxuICAgIFwiLlwiXG4gICAgXCJvcHRpb25zXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5tZW51LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XG59XG5cbi5tZW51IC5jcmVkaXRzIHtcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xufVxuXG4ubWVudSAuc3RhcnQge1xuICBncmlkLWFyZWE6IHN0YXJ0LWdhbWU7XG59XG5cbi5tZW51IC5vcHRpb25zIHtcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bixcbi5tZW51IC5vcHRpb25zLWJ0biB7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDE4MHB4O1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxuLm1lbnUgLm9wdGlvbnMtYnRuOmhvdmVyIHtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBwbGFjZW1lbnQgc2VjdGlvbiAqL1xuLnBsYWNlbWVudCB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiA2IC8gMjA7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCA1JSBtaW4tY29udGVudCA1JSAvIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi5cIlxuICAgIFwiaW5zdHJ1Y3Rpb25zXCJcbiAgICBcIi5cIlxuICAgIFwic2hpcHNcIlxuICAgIFwiLlwiXG4gICAgXCJyb3RhdGVcIlxuICAgIFwiLlwiXG4gICAgXCJjYW52YXNcIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcbiAgZ3JpZC1hcmVhOiBpbnN0cnVjdGlvbnM7XG59XG5cbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucy10ZXh0IHtcbiAgZm9udC1zaXplOiAyLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMXB4IDFweCAxcHggdmFyKC0tYmctY29sb3IpO1xufVxuXG4ucGxhY2VtZW50IC5zaGlwcy10by1wbGFjZSB7XG4gIGdyaWQtYXJlYTogc2hpcHM7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZSB7XG4gIGdyaWQtYXJlYTogcm90YXRlO1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuIHtcbiAgaGVpZ2h0OiA2MHB4O1xuICB3aWR0aDogMTgwcHg7XG5cbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUge1xuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IGNhbnZhcztcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XG59XG5cbi5wbGFjZW1lbnQuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xufVxuXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JDKTtcbn1cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cbi5nYW1lIHtcbiAgZ3JpZC1jb2x1bW46IDIgLyAyMDtcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZTpcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXG4gICAgbWluLWNvbnRlbnQgMWZyIC8gcmVwZWF0KDQsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuIC4gLiAuXCJcbiAgICBcIi4gbG9nIGxvZyAuXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cIlxuICAgIFwiLiAuIC4gLlwiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xufVxuXG4uZ2FtZSAudXNlci1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xufVxuXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XG59XG5cbi5nYW1lIC51c2VyLWluZm8ge1xuICBncmlkLWFyZWE6IHVzZXItaW5mbztcbn1cblxuLmdhbWUgLmFpLWluZm8ge1xuICBncmlkLWFyZWE6IGFpLWluZm87XG59XG5cbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xufVxuXG4uZ2FtZSAubG9nIHtcbiAgZ3JpZC1hcmVhOiBsb2c7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIG1pbi1jb250ZW50IDEwcHggMWZyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcInNjZW5lIC4gdGV4dFwiO1xuXG4gIHdpZHRoOiA1MDBweDtcblxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1jb2xvckIxKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbn1cblxuLmdhbWUgLmxvZyAuc2NlbmUge1xuICBncmlkLWFyZWE6IHNjZW5lO1xuXG4gIGhlaWdodDogMTUwcHg7XG4gIHdpZHRoOiAxNTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XG59XG5cbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xuICBmb250LXNpemU6IDEuMTVyZW07XG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cbn1cblxuLmdhbWUuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjZW5kcmVnaW9uICovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQ2hCO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGtCQUFrQjs7RUFFbEIsMkJBQTJCO0VBQzNCLDRCQUE0QjtFQUM1Qiw2QkFBNkI7RUFDN0IsK0JBQStCO0FBQ2pDOztBQUVBLG9DQUFvQztBQUNwQztFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGlDQUFpQztFQUNqQyx3QkFBd0I7RUFDeEIsYUFBYTtF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QW1DOztFQUVuQyxZQUFZOztFQUVaLGdDQUFnQztFQUNoQyxrQkFBa0I7O0VBRWxCLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLGdCQUFnQjs7RUFFaEIsYUFBYTtFQUNiLFlBQVk7RUFDWixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLGdCQUFnQixFQUFFLGtCQUFrQjtBQUN0Qzs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3QjtBQUNBLGVBQWU7O0FBRWYsZUFBZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBDb2xvciBSdWxlcyAqL1xcbjpyb290IHtcXG4gIC0tY29sb3JBMTogIzcyMmI5NDtcXG4gIC0tY29sb3JBMjogI2E5MzZlMDtcXG4gIC0tY29sb3JDOiAjMzdlMDJiO1xcbiAgLS1jb2xvckIxOiAjOTQxZDBkO1xcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xcblxcbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcXG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA5MSUpO1xcbiAgLS1saW5rLWNvbG9yOiBoc2woMzYsIDkyJSwgNTklKTtcXG59XFxuXFxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xcbmEge1xcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcblxcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxufVxcblxcbi5jYW52YXMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyAxZnI7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xcbiAgZ3JpZC1yb3c6IC0xIC8gMTtcXG4gIGdyaWQtY29sdW1uOiAtMSAvIDE7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIG1haW4tY29udGVudCAqL1xcbi5tYWluLWNvbnRlbnQge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IHJlcGVhdCgyMCwgNSUpIC8gcmVwZWF0KDIwLCA1JSk7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLyogdGl0bGUgZ3JpZCAqL1xcbi50aXRsZSB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDIgLyA2O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC44cyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yMik7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4udGl0bGUtdGV4dCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDQuOHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xcbiAgY29sb3I6IHZhcigtLWNvbG9yQjIpO1xcblxcbiAgdHJhbnNpdGlvbjogZm9udC1zaXplIDAuOHMgZWFzZS1pbi1vdXQ7XFxufVxcblxcbi50aXRsZS5zaHJpbmsge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjUpIHRyYW5zbGF0ZVkoLTUwJSk7XFxufVxcblxcbi50aXRsZS5zaHJpbmsgLnRpdGxlLXRleHQge1xcbiAgZm9udC1zaXplOiAzLjVyZW07XFxufVxcbi8qICNyZWdpb24gbWVudSBzZWN0aW9uICovXFxuLm1lbnUge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiA4IC8gMTg7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgMTUlIDUlIDFmciA1JSAxZnIgLyAxZnI7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJjcmVkaXRzXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcInN0YXJ0LWdhbWVcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwib3B0aW9uc1xcXCI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG59XFxuXFxuLm1lbnUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XFxufVxcblxcbi5tZW51IC5jcmVkaXRzIHtcXG4gIGdyaWQtYXJlYTogY3JlZGl0cztcXG59XFxuXFxuLm1lbnUgLnN0YXJ0IHtcXG4gIGdyaWQtYXJlYTogc3RhcnQtZ2FtZTtcXG59XFxuXFxuLm1lbnUgLm9wdGlvbnMge1xcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG4sXFxuLm1lbnUgLm9wdGlvbnMtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLm1lbnUgLnN0YXJ0LWJ0bjpob3ZlcixcXG4ubWVudSAub3B0aW9ucy1idG46aG92ZXIge1xcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIHBsYWNlbWVudCBzZWN0aW9uICovXFxuLnBsYWNlbWVudCB7XFxuICBncmlkLWNvbHVtbjogMyAvIDE5O1xcbiAgZ3JpZC1yb3c6IDYgLyAyMDtcXG5cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiA1JSBtaW4tY29udGVudCAxZnIgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDUlIG1pbi1jb250ZW50IDUlIC8gMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwiaW5zdHJ1Y3Rpb25zXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcInNoaXBzXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcInJvdGF0ZVxcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJjYW52YXNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcXG4gIGdyaWQtYXJlYTogaW5zdHJ1Y3Rpb25zO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5pbnN0cnVjdGlvbnMtdGV4dCB7XFxuICBmb250LXNpemU6IDIuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMXB4IHZhcigtLWJnLWNvbG9yKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuc2hpcHMtdG8tcGxhY2Uge1xcbiAgZ3JpZC1hcmVhOiBzaGlwcztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUge1xcbiAgZ3JpZC1hcmVhOiByb3RhdGU7XFxufVxcblxcbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG4ge1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgd2lkdGg6IDE4MHB4O1xcblxcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuOmFjdGl2ZSB7XFxuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiBjYW52YXM7XFxuICBhbGlnbi1zZWxmOiBzdGFydDtcXG59XFxuXFxuLnBsYWNlbWVudC5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQyk7XFxufVxcbi8qICNlbmRyZWdpb24gKi9cXG5cXG4vKiAjcmVnaW9uIGdhbWUgc2VjdGlvbiAqL1xcbi5nYW1lIHtcXG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XFxuICBncmlkLXJvdzogNSAvIDIwO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlOlxcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXFxuICAgIG1pbi1jb250ZW50IDFmciAvIHJlcGVhdCg0LCAxZnIpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCIuIGxvZyBsb2cgLlxcXCJcXG4gICAgXFxcIi4gLiAuIC5cXFwiXFxuICAgIFxcXCJ1c2VyLWJvYXJkIHVzZXItYm9hcmQgYWktYm9hcmQgYWktYm9hcmRcXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbn1cXG5cXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckEyKTtcXG59XFxuXFxuLmdhbWUgLnVzZXItY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IHVzZXItYm9hcmQ7XFxufVxcblxcbi5nYW1lIC5haS1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XFxufVxcblxcbi5nYW1lIC51c2VyLWluZm8ge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWluZm87XFxufVxcblxcbi5nYW1lIC5haS1pbmZvIHtcXG4gIGdyaWQtYXJlYTogYWktaW5mbztcXG59XFxuXFxuLmdhbWUgLnBsYXllci1zaGlwcyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLmdhbWUgLmxvZyB7XFxuICBncmlkLWFyZWE6IGxvZztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiAxZnIgLyBtaW4tY29udGVudCAxMHB4IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6IFxcXCJzY2VuZSAuIHRleHRcXFwiO1xcblxcbiAgd2lkdGg6IDUwMHB4O1xcblxcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tY29sb3JCMSk7XFxuICBib3JkZXItcmFkaXVzOiA2cHg7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5nYW1lIC5sb2cgLnNjZW5lIHtcXG4gIGdyaWQtYXJlYTogc2NlbmU7XFxuXFxuICBoZWlnaHQ6IDE1MHB4O1xcbiAgd2lkdGg6IDE1MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XFxufVxcblxcbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcXG4gIGdyaWQtYXJlYTogdGV4dDtcXG4gIGZvbnQtc2l6ZTogMS4xNXJlbTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cXG59XFxuXFxuLmdhbWUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNTAlKTtcXG59XFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCBcIi4vc3R5bGUvcmVzZXQuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlL3N0eWxlLmNzc1wiO1xuaW1wb3J0IGdhbWVNYW5hZ2VyIGZyb20gXCIuL21vZHVsZXMvZ2FtZU1hbmFnZXJcIjtcblxuLy8gSW5pdGlhbGl6ZSBtb2R1bGVzXG5nYW1lTWFuYWdlcigpO1xuIl0sIm5hbWVzIjpbIlNoaXAiLCJhaUF0dGFjayIsImdhbWVMb2ciLCJHYW1lYm9hcmQiLCJtYXhCb2FyZFgiLCJtYXhCb2FyZFkiLCJ0aGlzR2FtZWJvYXJkIiwic2hpcHMiLCJkaXJlY3Rpb24iLCJyZXR1cm5Vc2VyU2hpcHMiLCJhbGxPY2N1cGllZENlbGxzIiwiYWRkU2hpcCIsInJlY2VpdmVBdHRhY2siLCJjYW5BdHRhY2siLCJtaXNzZXMiLCJoaXRzIiwiYWxsU3VuayIsImxvZ1N1bmsiLCJyaXZhbEJvYXJkIiwiY2FudmFzIiwiaXNBaSIsImdhbWVPdmVyIiwidmFsaWRhdGVTaGlwIiwic2hpcCIsImlzVmFsaWQiLCJfbG9vcCIsImkiLCJvY2N1cGllZENlbGxzIiwiaXNDZWxsT2NjdXBpZWQiLCJzb21lIiwiY2VsbCIsImxlbmd0aCIsIl9yZXQiLCJhZGRDZWxsc1RvTGlzdCIsImZvckVhY2giLCJwdXNoIiwicG9zaXRpb24iLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJzaGlwVHlwZUluZGV4IiwibmV3U2hpcCIsImFkZE1pc3MiLCJhZGRIaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIkFycmF5IiwiaXNBcnJheSIsIk51bWJlciIsImlzSW50ZWdlciIsImoiLCJoaXQiLCJ0cnlBaUF0dGFjayIsInNoaXBBcnJheSIsImlzU3VuayIsInN1bmtlblNoaXBzIiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInR5cGUiLCJwbGF5ZXIiLCJhcHBlbmQiLCJjb25jYXQiLCJQbGF5ZXIiLCJwcml2YXRlTmFtZSIsInRoaXNQbGF5ZXIiLCJuYW1lIiwibmV3TmFtZSIsInRvU3RyaW5nIiwiZ2FtZWJvYXJkIiwic2VuZEF0dGFjayIsInZhbGlkYXRlQXR0YWNrIiwicGxheWVyQm9hcmQiLCJzaGlwTmFtZXMiLCJpbmRleCIsInRoaXNTaGlwIiwic2l6ZSIsInBsYWNlbWVudERpcmVjdGlvblgiLCJwbGFjZW1lbnREaXJlY3Rpb25ZIiwiaGFsZlNpemUiLCJNYXRoIiwiZmxvb3IiLCJyZW1haW5kZXJTaXplIiwibmV3Q29vcmRzIiwiZ3JpZEhlaWdodCIsImdyaWRXaWR0aCIsImJvYXJkIiwiYXR0YWNrQ29vcmRzIiwiYWxyZWFkeUF0dGFja2VkIiwiY2VsbENvb3JkaW5hdGVzIiwiYXR0YWNrZWQiLCJtaXNzIiwicmFuZG9tQXR0YWNrIiwieCIsInJhbmRvbSIsInkiLCJzZXRUaW1lb3V0IiwidGhlbiIsInJlc3VsdCIsImRyYXdIaXQiLCJkcmF3TWlzcyIsImdyaWRDYW52YXMiLCJjYW52YXNBZGRlciIsInVzZXJHYW1lYm9hcmQiLCJhaUdhbWVib2FyZCIsIndlYkludGVyZmFjZSIsInBsYWNlbWVudFBIIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwidXNlclBIIiwiYWlQSCIsInVzZXJDYW52YXMiLCJhaUNhbnZhcyIsInBsYWNlbWVudENhbnZhcyIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJjcmVhdGVDYW52YXMiLCJzaXplWCIsInNpemVZIiwib3B0aW9ucyIsInVzZXJCb2FyZENhbnZhcyIsIl91c2VyQ2FudmFzJGNoaWxkTm9kZSIsIl9zbGljZWRUb0FycmF5IiwiY2hpbGROb2RlcyIsImN1cnJlbnRDZWxsIiwiY2FudmFzQ29udGFpbmVyIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImJvYXJkQ2FudmFzIiwiYXBwZW5kQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImJvYXJkQ3R4IiwiZ2V0Q29udGV4dCIsIm92ZXJsYXlDYW52YXMiLCJvdmVybGF5Q3R4IiwiY2VsbFNpemVYIiwiY2VsbFNpemVZIiwiZ2V0TW91c2VDZWxsIiwiZXZlbnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibW91c2VYIiwiY2xpZW50WCIsImxlZnQiLCJtb3VzZVkiLCJjbGllbnRZIiwidG9wIiwiY2VsbFgiLCJjZWxsWSIsImRyYXdMaW5lcyIsImNvbnRleHQiLCJncmlkU2l6ZSIsIm1pbiIsImxpbmVDb2xvciIsInN0cm9rZVN0eWxlIiwibGluZVdpZHRoIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlIiwiaGlnaGxpZ2h0UGxhY2VtZW50Q2VsbHMiLCJzaGlwc0NvdW50IiwiY2xlYXJSZWN0IiwiZHJhd0NlbGwiLCJwb3NYIiwicG9zWSIsImZpbGxSZWN0IiwiZHJhd0xlbmd0aCIsImRpcmVjdGlvblgiLCJkaXJlY3Rpb25ZIiwiaGFsZkRyYXdMZW5ndGgiLCJyZW1haW5kZXJMZW5ndGgiLCJtYXhDb29yZGluYXRlWCIsIm1heENvb3JkaW5hdGVZIiwibWluQ29vcmRpbmF0ZVgiLCJtaW5Db29yZGluYXRlWSIsIm1heFgiLCJtYXhZIiwibWluWCIsIm1pblkiLCJpc091dE9mQm91bmRzIiwiZmlsbFN0eWxlIiwibmV4dFgiLCJuZXh0WSIsImhpZ2hsaWdodEF0dGFjayIsImNvb3JkaW5hdGVzIiwiZHJhd0hpdE1pc3MiLCJkcmF3U2hpcHMiLCJzaGlwc1RvRHJhdyIsInJhZGl1cyIsImFyYyIsIlBJIiwiZmlsbCIsImhhbmRsZU1vdXNlQ2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsIm5ld0V2ZW50IiwiTW91c2VFdmVudCIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiZGlzcGF0Y2hFdmVudCIsImhhbmRsZU1vdXNlTGVhdmUiLCJoYW5kbGVNb3VzZU1vdmUiLCJtb3VzZUNlbGwiLCJ0cnlTdGFydEdhbWUiLCJhaUJvYXJkIiwiZXJhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIl9yZWdlbmVyYXRvclJ1bnRpbWUiLCJleHBvcnRzIiwiT3AiLCJwcm90b3R5cGUiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmluZVByb3BlcnR5Iiwib2JqIiwiZGVzYyIsInZhbHVlIiwiJFN5bWJvbCIsIlN5bWJvbCIsIml0ZXJhdG9yU3ltYm9sIiwiaXRlcmF0b3IiLCJhc3luY0l0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvciIsInRvU3RyaW5nVGFnU3ltYm9sIiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlcnIiLCJ3cmFwIiwiaW5uZXJGbiIsIm91dGVyRm4iLCJzZWxmIiwidHJ5TG9jc0xpc3QiLCJwcm90b0dlbmVyYXRvciIsIkdlbmVyYXRvciIsImdlbmVyYXRvciIsImNyZWF0ZSIsIkNvbnRleHQiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJmbiIsImFyZyIsImNhbGwiLCJDb250aW51ZVNlbnRpbmVsIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiZ2V0UHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwidmFsdWVzIiwiR3AiLCJkZWZpbmVJdGVyYXRvck1ldGhvZHMiLCJtZXRob2QiLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsIlByb21pc2VJbXBsIiwiaW52b2tlIiwicmVqZWN0IiwicmVjb3JkIiwiX3R5cGVvZiIsIl9fYXdhaXQiLCJ1bndyYXBwZWQiLCJlcnJvciIsInByZXZpb3VzUHJvbWlzZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwic3RhdGUiLCJFcnJvciIsImRvbmVSZXN1bHQiLCJkZWxlZ2F0ZSIsImRlbGVnYXRlUmVzdWx0IiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiZG9uZSIsIm1ldGhvZE5hbWUiLCJUeXBlRXJyb3IiLCJpbmZvIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwibG9jcyIsImVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsIml0ZXJhYmxlIiwiaXRlcmF0b3JNZXRob2QiLCJpc05hTiIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImdlbkZ1biIsImN0b3IiLCJjb25zdHJ1Y3RvciIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJpdGVyIiwidmFsIiwib2JqZWN0IiwicmV2ZXJzZSIsInBvcCIsInNraXBUZW1wUmVzZXQiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicm9vdFJlY29yZCIsInJ2YWwiLCJleGNlcHRpb24iLCJoYW5kbGUiLCJsb2MiLCJjYXVnaHQiLCJoYXNDYXRjaCIsImhhc0ZpbmFsbHkiLCJmaW5hbGx5RW50cnkiLCJjb21wbGV0ZSIsImZpbmlzaCIsIl9jYXRjaCIsInRocm93biIsImRlbGVnYXRlWWllbGQiLCJhc3luY0dlbmVyYXRvclN0ZXAiLCJnZW4iLCJfbmV4dCIsIl90aHJvdyIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJncyIsImFwcGx5IiwicGxhY2VBaVNoaXBzIiwicGFzc2VkRGlmZiIsImFpU2hpcHMiLCJwbGFjZVJhbmRvbVNoaXAiLCJyb3VuZCIsIndhaXRGb3JBaVNoaXBzU2V0IiwicGxhY2VTaGlwcyIsIl9yZWYiLCJfY2FsbGVlIiwiZGlmZmljdWx0eSIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJfeCIsImxvZ1RleHQiLCJ0ZXh0Q29udGVudCIsInN0cmluZ1RvQXBwZW5kIiwiaW5uZXJIVE1MIiwic2NlbmVJbWFnZXMiLCJzcCIsImF0Iiwidm0iLCJpZyIsImwiLCJsb2FkU2NlbmVzIiwidXJscyIsImF0dGFjayIsInVybCIsImltYWdlIiwiSW1hZ2UiLCJzcmMiLCJzY2VuZSIsInVuaXQiLCJnYW1lTWFuYWdlciIsInVzZXJQbGF5ZXIiLCJhaVBsYXllciIsIndlYkludCIsImNhbnZhc2VzIiwidGl0bGUiLCJtZW51IiwicGxhY2VtZW50IiwiZ2FtZSIsInN0YXJ0QnRuIiwicm90YXRlQnRuIiwicm90YXRlRGlyZWN0aW9uIiwiaGlkZUFsbCIsInNob3dNZW51IiwicmVtb3ZlIiwic2hvd1BsYWNlbWVudCIsInNob3dHYW1lIiwic2hyaW5rVGl0bGUiLCJoYW5kbGVTdGFydENsaWNrIiwiaGFuZGxlUm90YXRlQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9