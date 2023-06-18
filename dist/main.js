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
  var addHit = function addHit(position, ship) {
    if (position) {
      thisGameboard.hits.push(position);
    }

    // Log if player's ship was hit
    if (!thisGameboard.isAi) {
      _modules_gameLog__WEBPACK_IMPORTED_MODULE_2__["default"].erase();
      _modules_gameLog__WEBPACK_IMPORTED_MODULE_2__["default"].append("AI attacks cell: ".concat(position, " \nAttack hit your ").concat(ship.type, "!"));
      _modules_gameLog__WEBPACK_IMPORTED_MODULE_2__["default"].setScene();
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
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_2__["default"].setScene();
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

"use strict";
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

/***/ "./src/helpers/aiAttack.js":
/*!*********************************!*\
  !*** ./src/helpers/aiAttack.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/gameLog */ "./src/modules/gameLog.js");
/* harmony import */ var _modules_sounds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/sounds */ "./src/modules/sounds.js");


var soundPlayer = (0,_modules_sounds__WEBPACK_IMPORTED_MODULE_1__["default"])();

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
        // Play hit sound
        soundPlayer.playHit();
        // Draw the hit to board
        rivalBoard.canvas.drawHit(attackCoords);
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
        // Play sound
        soundPlayer.playMiss();
        // Draw the miss to board
        rivalBoard.canvas.drawMiss(attackCoords);
        // Log the miss
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].erase();
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("AI attacks cell: ".concat(attackCoords, "\nAttack missed!"));
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].setScene();
      }
    });
    board.canAttack = true;
  }, 2500);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiAttack);

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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/gameLog */ "./src/modules/gameLog.js");
/* harmony import */ var _modules_sounds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/sounds */ "./src/modules/sounds.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// This module allows writing to the game log text


var soundPlayer = (0,_modules_sounds__WEBPACK_IMPORTED_MODULE_1__["default"])();
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
        _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].setScene();
        // Play the sound
        soundPlayer.playAttack();
        // Send the attack
        gameboard.receiveAttack(mouseCell).then(function (result) {
          // Set a timeout for dramatic effect
          setTimeout(function () {
            // Attack hit
            if (result === true) {
              // Play sound
              soundPlayer.playHit();
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
              // Play sound
              soundPlayer.playMiss();
              // Draw miss to board
              boardCanvas.drawHitMiss(mouseCell, 0);
              // Log miss
              _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("Attack missed!");
              // Log the ai "thinking" about its attack
              _modules_gameLog__WEBPACK_IMPORTED_MODULE_0__["default"].append("AI detrmining attack...");
              // Have the ai attack if not gameOver
              gameboard.tryAiAttack();
            }
          }, 1000);
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_imageLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/imageLoader */ "./src/helpers/imageLoader.js");

var gameLog = function () {
  var userName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "User";
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
    append: append,
    setScene: setScene,
    loadScenes: loadScenes,
    setUserGameboard: setUserGameboard,
    initScene: initScene
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

  // Set gameLog user game board for accurate scenes
  _gameLog__WEBPACK_IMPORTED_MODULE_4__["default"].setUserGameboard(userPlayer.gameboard);
  // Init game log scene img
  _gameLog__WEBPACK_IMPORTED_MODULE_4__["default"].initScene();

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
  var playHit = function playHit() {
    // Reset audio to beginning and play it
    hitAudio.currentTime = 0;
    hitAudio.play();
  };
  var playMiss = function playMiss() {
    // Reset audio to beginning and play it
    missAudio.currentTime = 0;
    missAudio.play();
  };
  var playAttack = function playAttack() {
    // Reset audio to beginning and play it
    attackAudio.currentTime = 0;
    attackAudio.play();
  };
  return {
    playHit: playHit,
    playMiss: playMiss,
    playAttack: playAttack
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
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"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","sourcesContent":["/* Color Rules */\n:root {\n  --colorA1: #722b94;\n  --colorA2: #a936e0;\n  --colorC: #37e02b;\n  --colorB1: #941d0d;\n  --colorB2: #e0361f;\n\n  --bg-color: hsl(0, 0%, 22%);\n  --bg-color2: hsl(0, 0%, 32%);\n  --text-color: hsl(0, 0%, 91%);\n  --link-color: hsl(36, 92%, 59%);\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.canvas-container {\n  display: grid;\n  grid-template: 1fr / 1fr;\n  width: fit-content;\n  height: fit-content;\n}\n\n.canvas-container > * {\n  grid-row: -1 / 1;\n  grid-column: -1 / 1;\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n  display: grid;\n  place-items: center;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: var(--bg-color2);\n  border-radius: 20px;\n}\n\n.title-text {\n  display: flex;\n  justify-content: center;\n  text-align: center;\n  font-size: 4.8rem;\n  font-weight: bold;\n  text-shadow: 2px 2px 2px var(--colorB1);\n  color: var(--colorB2);\n\n  transition: font-size 0.8s ease-in-out;\n}\n\n.title.shrink {\n  transform: scale(0.5) translateY(-50%);\n}\n\n.title.shrink .title-text {\n  font-size: 3.5rem;\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  display: grid;\n  grid-template: 5% 15% 5% 1fr 5% 1fr / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"credits\"\n    \".\"\n    \"start-game\"\n    \".\"\n    \"options\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.menu.hidden {\n  transform: translateX(-150%);\n}\n\n.menu .credits {\n  grid-area: credits;\n}\n\n.menu .start {\n  grid-area: start-game;\n}\n\n.menu .options {\n  grid-area: options;\n  align-self: start;\n}\n\n.menu .start-btn,\n.menu .options-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.menu .start-btn:hover,\n.menu .options-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 6 / 20;\n\n  display: grid;\n  grid-template: 5% min-content 1fr min-content 1fr min-content 5% min-content 5% / 1fr;\n  place-items: center;\n  grid-template-areas:\n    \".\"\n    \"instructions\"\n    \".\"\n    \"ships\"\n    \".\"\n    \"rotate\"\n    \".\"\n    \"canvas\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n}\n\n.placement .instructions {\n  grid-area: instructions;\n}\n\n.placement .instructions-text {\n  font-size: 2.3rem;\n  font-weight: bold;\n  text-shadow: 1px 1px 1px var(--bg-color);\n}\n\n.placement .ships-to-place {\n  grid-area: ships;\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.placement .rotate {\n  grid-area: rotate;\n}\n\n.placement .rotate-btn {\n  height: 60px;\n  width: 180px;\n\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: var(--text-color);\n  transition: text-shadow 0.1s ease-in-out;\n\n  background-color: var(--colorA2);\n  border: 2px solid var(--colorC);\n  border-radius: 10px;\n}\n\n.placement .rotate-btn:hover {\n  text-shadow: 2px 2px 1px var(--colorC), -2px -2px 1px var(--colorB2);\n}\n\n.placement .rotate-btn:active {\n  text-shadow: 4px 4px 1px var(--colorC), -4px -4px 1px var(--colorB2);\n}\n\n.placement .placement-canvas-container {\n  grid-area: canvas;\n  align-self: start;\n}\n\n.placement.hidden {\n  transform: translateY(150%);\n}\n\n.placement .canvas-container {\n  background-color: var(--colorC);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 5 / 20;\n  display: grid;\n  place-items: center;\n  grid-template:\n    repeat(2, minmax(10px, 1fr) min-content) minmax(10px, 1fr)\n    min-content 1fr / repeat(4, 1fr);\n  grid-template-areas:\n    \". . . .\"\n    \". log log .\"\n    \". . . .\"\n    \"user-board user-board ai-board ai-board\"\n    \". . . .\"\n    \"user-info user-info ai-info ai-info\"\n    \". . . .\";\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: var(--colorA1);\n  border-radius: 20px;\n}\n\n.game .canvas-container {\n  background-color: var(--colorA2);\n}\n\n.game .user-canvas-container {\n  grid-area: user-board;\n}\n\n.game .ai-canvas-container {\n  grid-area: ai-board;\n}\n\n.game .user-info {\n  grid-area: user-info;\n}\n\n.game .ai-info {\n  grid-area: ai-info;\n}\n\n.game .player-ships {\n  display: grid;\n  grid-auto-flow: column;\n}\n\n.game .log {\n  grid-area: log;\n  display: grid;\n  grid-template: 1fr / min-content 10px 1fr;\n  grid-template-areas: \"scene . text\";\n\n  width: 500px;\n\n  border: 3px solid var(--colorB1);\n  border-radius: 6px;\n\n  background-color: var(--bg-color);\n}\n\n.game .log .scene {\n  grid-area: scene;\n\n  height: 150px;\n  width: 150px;\n  background-color: var(--colorB1);\n}\n\n.game .log .scene-img {\n  height: 100%;\n  width: 100%;\n}\n\n.game .log .log-text {\n  grid-area: text;\n  font-size: 1.15rem;\n  white-space: pre; /* Allows for \\n */\n}\n\n.game.hidden {\n  transform: translateX(150%);\n}\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
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
/* eslint-disable no-unused-vars */




// Initialize modules
(0,_modules_gameManager__WEBPACK_IMPORTED_MODULE_2__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPLDZGQUE2RixNQUFNLFlBQVksYUFBYSxhQUFhLGFBQWEsY0FBYyxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxXQUFXLFlBQVksTUFBTSxVQUFVLFlBQVksY0FBYyxXQUFXLFVBQVUsTUFBTSxVQUFVLEtBQUssWUFBWSxXQUFXLFVBQVUsYUFBYSxjQUFjLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUM1RkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDbEJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUMyQjtBQUNBO0FBQ3FCOztBQUVoRDtBQUNBeVMsZ0VBQVcsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2FpQXR0YWNrLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9jYW52YXNBZGRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvZ3JpZENhbnZhcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvaW1hZ2VMb2FkZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3BsYWNlQWlTaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUxvZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NvdW5kcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvd2ViSW50ZXJmYWNlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvcmVzZXQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcz80NDVlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzP2M5ZjAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjZW5lLWltYWdlcy8gc3luYyBcXC5qcGckLyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcbmltcG9ydCBhaUF0dGFjayBmcm9tIFwiLi4vaGVscGVycy9haUF0dGFja1wiO1xuaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZUxvZ1wiO1xuXG4vKiBGYWN0b3J5IHRoYXQgcmV0dXJucyBhIGdhbWVib2FyZCB0aGF0IGNhbiBwbGFjZSBzaGlwcyB3aXRoIFNoaXAoKSwgcmVjaWV2ZSBhdHRhY2tzIGJhc2VkIG9uIGNvb3JkcyBcbiAgIGFuZCB0aGVuIGRlY2lkZXMgd2hldGhlciB0byBoaXQoKSBpZiBzaGlwIGlzIGluIHRoYXQgc3BvdCwgcmVjb3JkcyBoaXRzIGFuZCBtaXNzZXMsIGFuZCByZXBvcnRzIGlmXG4gICBhbGwgaXRzIHNoaXBzIGhhdmUgYmVlbiBzdW5rLiAqL1xuY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICAvLyBDb25zdHJhaW50cyBmb3IgZ2FtZSBib2FyZCAoMTB4MTAgZ3JpZCwgemVybyBiYXNlZClcbiAgY29uc3QgbWF4Qm9hcmRYID0gOTtcbiAgY29uc3QgbWF4Qm9hcmRZID0gOTtcblxuICBjb25zdCB0aGlzR2FtZWJvYXJkID0ge1xuICAgIHNoaXBzOiBbXSxcbiAgICBkaXJlY3Rpb246IDEsXG4gICAgcmV0dXJuVXNlclNoaXBzOiBudWxsLFxuICAgIGFsbE9jY3VwaWVkQ2VsbHM6IFtdLFxuICAgIGFkZFNoaXA6IG51bGwsXG4gICAgcmVjZWl2ZUF0dGFjazogbnVsbCxcbiAgICBjYW5BdHRhY2s6IHRydWUsXG4gICAgbWlzc2VzOiBbXSxcbiAgICBoaXRzOiBbXSxcbiAgICBhbGxTdW5rOiBudWxsLFxuICAgIGxvZ1N1bms6IG51bGwsXG4gICAgcml2YWxCb2FyZDogbnVsbCxcbiAgICBnZXQgbWF4Qm9hcmRYKCkge1xuICAgICAgcmV0dXJuIG1heEJvYXJkWDtcbiAgICB9LFxuICAgIGdldCBtYXhCb2FyZFkoKSB7XG4gICAgICByZXR1cm4gbWF4Qm9hcmRZO1xuICAgIH0sXG4gICAgY2FudmFzOiBudWxsLFxuICAgIGlzQWk6IGZhbHNlLFxuICAgIGdhbWVPdmVyOiBmYWxzZSxcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgc2hpcCBvY2N1cGllZCBjZWxsIGNvb3Jkc1xuICBjb25zdCB2YWxpZGF0ZVNoaXAgPSAoc2hpcCkgPT4ge1xuICAgIGlmICghc2hpcCkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEZsYWcgZm9yIGRldGVjdGluZyBpbnZhbGlkIHBvc2l0aW9uIHZhbHVlXG4gICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCBzaGlwcyBvY2N1cGllZCBjZWxscyBhcmUgYWxsIHdpdGhpbiBtYXAgYW5kIG5vdCBhbHJlYWR5IG9jY3VwaWVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIC8vIE9uIHRoZSBtYXA/XG4gICAgICBpZiAoXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSA+PSAwICYmXG4gICAgICAgIHNoaXAub2NjdXBpZWRDZWxsc1tpXVswXSA8PSBtYXhCb2FyZFggJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzFdIDw9IG1heEJvYXJkWVxuICAgICAgKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrIG9jY3VwaWVkIGNlbGxzXG4gICAgICBjb25zdCBpc0NlbGxPY2N1cGllZCA9IHRoaXNHYW1lYm9hcmQuYWxsT2NjdXBpZWRDZWxscy5zb21lKFxuICAgICAgICAoY2VsbCkgPT5cbiAgICAgICAgICAvLyBDb29yZHMgZm91bmQgaW4gYWxsIG9jY3VwaWVkIGNlbGxzIGFscmVhZHlcbiAgICAgICAgICBjZWxsWzBdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMF0gJiZcbiAgICAgICAgICBjZWxsWzFdID09PSBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV1cbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0NlbGxPY2N1cGllZCkge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrOyAvLyBCcmVhayBvdXQgb2YgdGhlIGxvb3AgaWYgb2NjdXBpZWQgY2VsbCBpcyBmb3VuZFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGFkZHMgb2NjdXBpZWQgY2VsbHMgb2YgdmFsaWQgYm9hdCB0byBsaXN0XG4gIGNvbnN0IGFkZENlbGxzVG9MaXN0ID0gKHNoaXApID0+IHtcbiAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgdGhpc0dhbWVib2FyZC5hbGxPY2N1cGllZENlbGxzLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBhZGRpbmcgYSBzaGlwIGF0IGEgZ2l2ZW4gY29vcmRzIGluIGdpdmVuIGRpcmVjdGlvbiBpZiBzaGlwIHdpbGwgZml0IG9uIGJvYXJkXG4gIHRoaXNHYW1lYm9hcmQuYWRkU2hpcCA9IChcbiAgICBwb3NpdGlvbixcbiAgICBkaXJlY3Rpb24gPSB0aGlzR2FtZWJvYXJkLmRpcmVjdGlvbixcbiAgICBzaGlwVHlwZUluZGV4ID0gdGhpc0dhbWVib2FyZC5zaGlwcy5sZW5ndGggKyAxXG4gICkgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgZGVzaXJlZCBzaGlwXG4gICAgY29uc3QgbmV3U2hpcCA9IFNoaXAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbik7XG4gICAgLy8gQWRkIGl0IHRvIHNoaXBzIGlmIGl0IGhhcyB2YWxpZCBvY2N1cGllZCBjZWxsc1xuICAgIGlmICh2YWxpZGF0ZVNoaXAobmV3U2hpcCkpIHtcbiAgICAgIGFkZENlbGxzVG9MaXN0KG5ld1NoaXApO1xuICAgICAgdGhpc0dhbWVib2FyZC5zaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhZGRNaXNzID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLm1pc3Nlcy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYWRkSGl0ID0gKHBvc2l0aW9uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzR2FtZWJvYXJkLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gTG9nIGlmIHBsYXllcidzIHNoaXAgd2FzIGhpdFxuICAgIGlmICghdGhpc0dhbWVib2FyZC5pc0FpKSB7XG4gICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgICAgYEFJIGF0dGFja3MgY2VsbDogJHtwb3NpdGlvbn0gXFxuQXR0YWNrIGhpdCB5b3VyICR7c2hpcC50eXBlfSFgXG4gICAgICApO1xuICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBNZXRob2QgZm9yIHJlY2VpdmluZyBhbiBhdHRhY2sgZnJvbSBvcHBvbmVudFxuICB0aGlzR2FtZWJvYXJkLnJlY2VpdmVBdHRhY2sgPSAocG9zaXRpb24sIHNoaXBzID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVmFsaWRhdGUgcG9zaXRpb24gaXMgMiBpbiBhcnJheSBhbmQgc2hpcHMgaXMgYW4gYXJyYXksIGFuZCByaXZhbCBib2FyZCBjYW4gYXR0YWNrXG4gICAgICBpZiAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb24pICYmXG4gICAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzFdKSAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEVhY2ggc2hpcCBpbiBzaGlwc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gSWYgdGhlIHNoaXAgaXMgbm90IGZhbHN5LCBhbmQgb2NjdXBpZWRDZWxscyBwcm9wIGV4aXN0cyBhbmQgaXMgYW4gYXJyYXlcbiAgICAgICAgICAgIHNoaXBzW2ldICYmXG4gICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzICYmXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBvZiB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIC8vIElmIHRoYXQgY2VsbCBtYXRjaGVzIHRoZSBhdHRhY2sgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzW2pdWzBdID09PSBwb3NpdGlvblswXSAmJlxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLm9jY3VwaWVkQ2VsbHNbal1bMV0gPT09IHBvc2l0aW9uWzFdXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhhdCBzaGlwcyBoaXQgbWV0aG9kIGFuZCBicmVhayBvdXQgb2YgbG9vcFxuICAgICAgICAgICAgICAgIHNoaXBzW2ldLmhpdCgpO1xuICAgICAgICAgICAgICAgIGFkZEhpdChwb3NpdGlvbiwgc2hpcHNbaV0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhZGRNaXNzKHBvc2l0aW9uKTtcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gIC8vIE1ldGhvZCBmb3IgdHJ5aW5nIGFpIGF0dGFja3NcbiAgdGhpc0dhbWVib2FyZC50cnlBaUF0dGFjayA9ICgpID0+IHtcbiAgICAvLyBSZXR1cm4gaWYgbm90IGFpXG4gICAgaWYgKHRoaXNHYW1lYm9hcmQuaXNBaSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBhaUF0dGFjayh0aGlzR2FtZWJvYXJkLnJpdmFsQm9hcmQpO1xuICB9O1xuXG4gIC8vIE1ldGhvZCB0aGF0IGRldGVybWluZXMgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIG5vdFxuICB0aGlzR2FtZWJvYXJkLmFsbFN1bmsgPSAoc2hpcEFycmF5ID0gdGhpc0dhbWVib2FyZC5zaGlwcykgPT4ge1xuICAgIGlmICghc2hpcEFycmF5IHx8ICFBcnJheS5pc0FycmF5KHNoaXBBcnJheSkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IGFsbFN1bmsgPSB0cnVlO1xuICAgIHNoaXBBcnJheS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcCAmJiBzaGlwLmlzU3VuayAmJiAhc2hpcC5pc1N1bmsoKSkgYWxsU3VuayA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHJldHVybiBhbGxTdW5rO1xuICB9O1xuXG4gIC8vIE9iamVjdCBmb3IgdHJhY2tpbmcgYm9hcmQncyBzdW5rZW4gc2hpcHNcbiAgY29uc3Qgc3Vua2VuU2hpcHMgPSB7IDE6IGZhbHNlLCAyOiBmYWxzZSwgMzogZmFsc2UsIDQ6IGZhbHNlLCA1OiBmYWxzZSB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVwb3J0aW5nIHN1bmtlbiBzaGlwc1xuICB0aGlzR2FtZWJvYXJkLmxvZ1N1bmsgPSAoKSA9PiB7XG4gICAgT2JqZWN0LmtleXMoc3Vua2VuU2hpcHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKHN1bmtlblNoaXBzW2tleV0gPT09IGZhbHNlICYmIHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0uaXNTdW5rKCkpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IHRoaXNHYW1lYm9hcmQuc2hpcHNba2V5IC0gMV0udHlwZTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpc0dhbWVib2FyZC5pc0FpID8gXCJBSSdzXCIgOiBcIlVzZXInc1wiO1xuICAgICAgICBnYW1lTG9nLmFwcGVuZChcbiAgICAgICAgICBgPHNwYW4gc3R5bGU9XCJjb2xvcjogcmVkXCI+JHtwbGF5ZXJ9ICR7c2hpcH0gd2FzIGRlc3Ryb3llZCE8L3NwYW4+YFxuICAgICAgICApO1xuICAgICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgICAgIHN1bmtlblNoaXBzW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB0aGlzR2FtZWJvYXJkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcblxuLyogRmFjdG9yeSB0aGF0IGNyZWF0ZXMgYW5kIHJldHVybnMgYSBwbGF5ZXIgb2JqZWN0IHRoYXQgY2FuIHRha2UgYSBzaG90IGF0IG9wcG9uZW50J3MgZ2FtZSBib2FyZCAqL1xuY29uc3QgUGxheWVyID0gKCkgPT4ge1xuICBsZXQgcHJpdmF0ZU5hbWUgPSBcIlwiO1xuICBjb25zdCB0aGlzUGxheWVyID0ge1xuICAgIGdldCBuYW1lKCkge1xuICAgICAgcmV0dXJuIHByaXZhdGVOYW1lO1xuICAgIH0sXG4gICAgc2V0IG5hbWUobmV3TmFtZSkge1xuICAgICAgaWYgKG5ld05hbWUpIHtcbiAgICAgICAgcHJpdmF0ZU5hbWUgPSBuZXdOYW1lLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2UgcHJpdmF0ZU5hbWUgPSBcIlwiO1xuICAgIH0sXG4gICAgZ2FtZWJvYXJkOiBHYW1lYm9hcmQoKSxcbiAgICBzZW5kQXR0YWNrOiBudWxsLFxuICB9O1xuXG4gIC8vIEhlbHBlciBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhdHRhY2sgcG9zaXRpb24gaXMgb24gYm9hcmRcbiAgY29uc3QgdmFsaWRhdGVBdHRhY2sgPSAocG9zaXRpb24sIGdhbWVib2FyZCkgPT4ge1xuICAgIC8vIERvZXMgZ2FtZWJvYXJkIGV4aXN0IHdpdGggbWF4Qm9hcmRYL3kgcHJvcGVydGllcz9cbiAgICBpZiAoIWdhbWVib2FyZCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWCB8fCAhZ2FtZWJvYXJkLm1heEJvYXJkWSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBJcyBwb3NpdGlvbiBjb25zdHJhaW5lZCB0byBtYXhib2FyZFgvWSBhbmQgYm90aCBhcmUgaW50cyBpbiBhbiBhcnJheT9cbiAgICBpZiAoXG4gICAgICBwb3NpdGlvbiAmJlxuICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblswXSkgJiZcbiAgICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgICBwb3NpdGlvblswXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblswXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRYICYmXG4gICAgICBwb3NpdGlvblsxXSA+PSAwICYmXG4gICAgICBwb3NpdGlvblsxXSA8PSBnYW1lYm9hcmQubWF4Qm9hcmRZXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3Igc2VuZGluZyBhdHRhY2sgdG8gcml2YWwgZ2FtZWJvYXJkXG4gIHRoaXNQbGF5ZXIuc2VuZEF0dGFjayA9IChwb3NpdGlvbiwgcGxheWVyQm9hcmQgPSB0aGlzUGxheWVyLmdhbWVib2FyZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUF0dGFjayhwb3NpdGlvbiwgcGxheWVyQm9hcmQpKSB7XG4gICAgICBwbGF5ZXJCb2FyZC5yaXZhbEJvYXJkLnJlY2VpdmVBdHRhY2socG9zaXRpb24pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdGhpc1BsYXllcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIENvbnRhaW5zIHRoZSBuYW1lcyBmb3IgdGhlIHNoaXBzIGJhc2VkIG9uIGluZGV4XG5jb25zdCBzaGlwTmFtZXMgPSB7XG4gIDE6IFwiU2VudGluZWwgUHJvYmVcIixcbiAgMjogXCJBc3NhdWx0IFRpdGFuXCIsXG4gIDM6IFwiVmlwZXIgTWVjaFwiLFxuICA0OiBcIklyb24gR29saWF0aFwiLFxuICA1OiBcIkxldmlhdGhhblwiLFxufTtcblxuLy8gRmFjdG9yeSB0aGF0IGNhbiBjcmVhdGUgYW5kIHJldHVybiBvbmUgb2YgYSB2YXJpZXR5IG9mIHByZS1kZXRlcm1pbmVkIHNoaXBzLlxuY29uc3QgU2hpcCA9IChpbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbikgPT4ge1xuICAvLyBWYWxpZGF0ZSBpbmRleFxuICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpIHx8IGluZGV4ID4gNSB8fCBpbmRleCA8IDEpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgLy8gQ3JlYXRlIHRoZSBzaGlwIG9iamVjdCB0aGF0IHdpbGwgYmUgcmV0dXJuZWRcbiAgY29uc3QgdGhpc1NoaXAgPSB7XG4gICAgaW5kZXgsXG4gICAgc2l6ZTogbnVsbCxcbiAgICB0eXBlOiBudWxsLFxuICAgIGhpdHM6IDAsXG4gICAgaGl0OiBudWxsLFxuICAgIGlzU3VuazogbnVsbCxcbiAgICBvY2N1cGllZENlbGxzOiBbXSxcbiAgfTtcblxuICAvLyBTZXQgc2hpcCBzaXplXG4gIHN3aXRjaCAoaW5kZXgpIHtcbiAgICBjYXNlIDE6XG4gICAgICB0aGlzU2hpcC5zaXplID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSBpbmRleDtcbiAgfVxuXG4gIC8vIFNldCBzaGlwIG5hbWUgYmFzZWQgb24gaW5kZXhcbiAgdGhpc1NoaXAudHlwZSA9IHNoaXBOYW1lc1t0aGlzU2hpcC5pbmRleF07XG5cbiAgLy8gQWRkcyBhIGhpdCB0byB0aGUgc2hpcFxuICB0aGlzU2hpcC5oaXQgPSAoKSA9PiB7XG4gICAgdGhpc1NoaXAuaGl0cyArPSAxO1xuICB9O1xuXG4gIC8vIERldGVybWluZXMgaWYgc2hpcCBzdW5rIGlzIHRydWVcbiAgdGhpc1NoaXAuaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmICh0aGlzU2hpcC5oaXRzID49IHRoaXNTaGlwLnNpemUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBQbGFjZW1lbnQgZGlyZWN0aW9uIGlzIGVpdGhlciAwIGZvciBob3Jpem9udGFsIG9yIDEgZm9yIHZlcnRpY2FsXG4gIGxldCBwbGFjZW1lbnREaXJlY3Rpb25YID0gMDtcbiAgbGV0IHBsYWNlbWVudERpcmVjdGlvblkgPSAwO1xuICBpZiAoZGlyZWN0aW9uID09PSAwKSB7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDE7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDA7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAxKSB7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWCA9IDA7XG4gICAgcGxhY2VtZW50RGlyZWN0aW9uWSA9IDE7XG4gIH1cblxuICAvLyBVc2UgcG9zaXRpb24gYW5kIGRpcmVjdGlvbiB0byBhZGQgb2NjdXBpZWQgY2VsbHMgY29vcmRzXG4gIGlmIChcbiAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgIHBvc2l0aW9uLmxlbmd0aCA9PT0gMiAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMF0pICYmXG4gICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAoZGlyZWN0aW9uID09PSAxIHx8IGRpcmVjdGlvbiA9PT0gMClcbiAgKSB7XG4gICAgLy8gRGl2aWRlIGxlbmd0aCBpbnRvIGhhbGYgYW5kIHJlbWFpbmRlclxuICAgIGNvbnN0IGhhbGZTaXplID0gTWF0aC5mbG9vcih0aGlzU2hpcC5zaXplIC8gMik7XG4gICAgY29uc3QgcmVtYWluZGVyU2l6ZSA9IHRoaXNTaGlwLnNpemUgJSAyO1xuICAgIC8vIEFkZCBmaXJzdCBoYWxmIG9mIGNlbGxzIHBsdXMgcmVtYWluZGVyIGluIG9uZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZTaXplICsgcmVtYWluZGVyU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuZXdDb29yZHMgPSBbXG4gICAgICAgIHBvc2l0aW9uWzBdICsgaSAqIHBsYWNlbWVudERpcmVjdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWzFdICsgaSAqIHBsYWNlbWVudERpcmVjdGlvblksXG4gICAgICBdO1xuICAgICAgdGhpc1NoaXAub2NjdXBpZWRDZWxscy5wdXNoKG5ld0Nvb3Jkcyk7XG4gICAgfVxuICAgIC8vIEFkZCBzZWNvbmQgaGFsZiBvZiBjZWxsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZlNpemU7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV3Q29vcmRzID0gW1xuICAgICAgICBwb3NpdGlvblswXSAtIChpICsgMSkgKiBwbGFjZW1lbnREaXJlY3Rpb25YLFxuICAgICAgICBwb3NpdGlvblsxXSAtIChpICsgMSkgKiBwbGFjZW1lbnREaXJlY3Rpb25ZLFxuICAgICAgXTtcbiAgICAgIHRoaXNTaGlwLm9jY3VwaWVkQ2VsbHMucHVzaChuZXdDb29yZHMpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzU2hpcDtcbn07XG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IGdhbWVMb2cgZnJvbSBcIi4uL21vZHVsZXMvZ2FtZUxvZ1wiO1xuaW1wb3J0IHNvdW5kcyBmcm9tIFwiLi4vbW9kdWxlcy9zb3VuZHNcIjtcblxuY29uc3Qgc291bmRQbGF5ZXIgPSBzb3VuZHMoKTtcblxuLy8gVGhpcyBoZWxwZXIgd2lsbCBsb29rIGF0IGN1cnJlbnQgaGl0cyBhbmQgbWlzc2VzIGFuZCB0aGVuIHJldHVybiBhbiBhdHRhY2tcbmNvbnN0IGFpQXR0YWNrID0gKHJpdmFsQm9hcmQpID0+IHtcbiAgY29uc3QgZ3JpZEhlaWdodCA9IDEwO1xuICBjb25zdCBncmlkV2lkdGggPSAxMDtcbiAgY29uc3QgYm9hcmQgPSByaXZhbEJvYXJkO1xuICBjb25zdCB7IGhpdHMsIG1pc3NlcyB9ID0gcml2YWxCb2FyZDtcbiAgbGV0IGF0dGFja0Nvb3JkcyA9IFtdO1xuXG4gIC8vIE1ldGhvZCB0byBkZXRlcm1pbmUgaWYgY2VsbCBoYXMgYSBoaXQgb3IgbWlzcyBpbiBpdFxuICBjb25zdCBhbHJlYWR5QXR0YWNrZWQgPSAoY2VsbENvb3JkaW5hdGVzKSA9PiB7XG4gICAgbGV0IGF0dGFja2VkID0gZmFsc2U7XG5cbiAgICBoaXRzLmZvckVhY2goKGhpdCkgPT4ge1xuICAgICAgaWYgKGNlbGxDb29yZGluYXRlc1swXSA9PT0gaGl0WzBdICYmIGNlbGxDb29yZGluYXRlc1sxXSA9PT0gaGl0WzFdKSB7XG4gICAgICAgIGF0dGFja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBpZiAoY2VsbENvb3JkaW5hdGVzWzBdID09PSBtaXNzWzBdICYmIGNlbGxDb29yZGluYXRlc1sxXSA9PT0gbWlzc1sxXSkge1xuICAgICAgICBhdHRhY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXR0YWNrZWQ7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciByZXR1cm5pbmcgcmFuZG9tIGF0dGFja1xuICBjb25zdCByYW5kb21BdHRhY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRXaWR0aCk7XG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyaWRIZWlnaHQpO1xuICAgIGF0dGFja0Nvb3JkcyA9IFt4LCB5XTtcbiAgfTtcblxuICAvLyBUcnkgYSByYW5kb20gYXR0YWNrIHRoYXQgaGFzIG5vdCBiZWVuIHlldCB0cmllZFxuICByYW5kb21BdHRhY2soKTtcbiAgd2hpbGUgKGFscmVhZHlBdHRhY2tlZChhdHRhY2tDb29yZHMpKSB7XG4gICAgcmFuZG9tQXR0YWNrKCk7XG4gIH1cblxuICAvLyBUaW1lb3V0IHRvIHNpbXVsYXRlIFwidGhpbmtpbmdcIiBhbmQgdG8gbWFrZSBnYW1lIGZlZWwgYmV0dGVyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIC8vIFNlbmQgYXR0YWNrIHRvIHJpdmFsIGJvYXJkXG4gICAgcml2YWxCb2FyZFxuICAgICAgLnJlY2VpdmVBdHRhY2soYXR0YWNrQ29vcmRzKVxuICAgICAgLy8gVGhlbiBkcmF3IGhpdHMgb3IgbWlzc2VzXG4gICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAvLyBQbGF5IGhpdCBzb3VuZFxuICAgICAgICAgIHNvdW5kUGxheWVyLnBsYXlIaXQoKTtcbiAgICAgICAgICAvLyBEcmF3IHRoZSBoaXQgdG8gYm9hcmRcbiAgICAgICAgICByaXZhbEJvYXJkLmNhbnZhcy5kcmF3SGl0KGF0dGFja0Nvb3Jkcyk7XG4gICAgICAgICAgLy8gTG9nIHN1bmsgdXNlciBzaGlwc1xuICAgICAgICAgIHJpdmFsQm9hcmQubG9nU3VuaygpO1xuICAgICAgICAgIC8vIENoZWNrIGlmIEFJIHdvblxuICAgICAgICAgIGlmIChyaXZhbEJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgLy8gTG9nIHJlc3VsdHNcbiAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFxuICAgICAgICAgICAgICBcIkFsbCBVc2VyIHVuaXRzIGRlc3Ryb3llZC4gXFxuQUkgZG9taW5hbmNlIGlzIGFzc3VyZWQuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBTZXQgZ2FtZSBvdmVyIG9uIGJvYXJkc1xuICAgICAgICAgICAgYm9hcmQuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgYm9hcmQucml2YWxCb2FyZC5nYW1lT3ZlciA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBQbGF5IHNvdW5kXG4gICAgICAgICAgc291bmRQbGF5ZXIucGxheU1pc3MoKTtcbiAgICAgICAgICAvLyBEcmF3IHRoZSBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgcml2YWxCb2FyZC5jYW52YXMuZHJhd01pc3MoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAvLyBMb2cgdGhlIG1pc3NcbiAgICAgICAgICBnYW1lTG9nLmVyYXNlKCk7XG4gICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoYEFJIGF0dGFja3MgY2VsbDogJHthdHRhY2tDb29yZHN9XFxuQXR0YWNrIG1pc3NlZCFgKTtcbiAgICAgICAgICBnYW1lTG9nLnNldFNjZW5lKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgYm9hcmQuY2FuQXR0YWNrID0gdHJ1ZTtcbiAgfSwgMjUwMCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhaUF0dGFjaztcbiIsImltcG9ydCBncmlkQ2FudmFzIGZyb20gXCIuL2dyaWRDYW52YXNcIjtcblxuLyogVGhpcyBtb2R1bGUgY3JlYXRlcyBjYW52YXMgZWxlbWVudHMgYW5kIGFkZHMgdGhlbSB0byB0aGUgYXBwcm9wcmlhdGUgXG4gICBwbGFjZXMgaW4gdGhlIERPTS4gKi9cbmNvbnN0IGNhbnZhc0FkZGVyID0gKHVzZXJHYW1lYm9hcmQsIGFpR2FtZWJvYXJkLCB3ZWJJbnRlcmZhY2UpID0+IHtcbiAgLy8gUmVwbGFjZSB0aGUgdGhyZWUgZ3JpZCBwbGFjZWhvbGRlciBlbGVtZW50cyB3aXRoIHRoZSBwcm9wZXIgY2FudmFzZXNcbiAgLy8gUmVmcyB0byBET00gZWxlbWVudHNcbiAgY29uc3QgcGxhY2VtZW50UEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1jYW52YXMtcGhcIik7XG4gIGNvbnN0IHVzZXJQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlci1jYW52YXMtcGhcIik7XG4gIGNvbnN0IGFpUEggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFpLWNhbnZhcy1waFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGNhbnZhc2VzXG5cbiAgY29uc3QgdXNlckNhbnZhcyA9IGdyaWRDYW52YXMoXG4gICAgMzAwLFxuICAgIDMwMCxcbiAgICB7IHR5cGU6IFwidXNlclwiIH0sXG4gICAgdXNlckdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2VcbiAgKTtcbiAgY29uc3QgYWlDYW52YXMgPSBncmlkQ2FudmFzKFxuICAgIDMwMCxcbiAgICAzMDAsXG4gICAgeyB0eXBlOiBcImFpXCIgfSxcbiAgICBhaUdhbWVib2FyZCxcbiAgICB3ZWJJbnRlcmZhY2VcbiAgKTtcbiAgY29uc3QgcGxhY2VtZW50Q2FudmFzID0gZ3JpZENhbnZhcyhcbiAgICAzMDAsXG4gICAgMzAwLFxuICAgIHsgdHlwZTogXCJwbGFjZW1lbnRcIiB9LFxuICAgIHVzZXJHYW1lYm9hcmQsXG4gICAgd2ViSW50ZXJmYWNlLFxuICAgIHVzZXJDYW52YXNcbiAgKTtcblxuICAvLyBSZXBsYWNlIHRoZSBwbGFjZSBob2xkZXJzXG4gIHBsYWNlbWVudFBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBsYWNlbWVudENhbnZhcywgcGxhY2VtZW50UEgpO1xuICB1c2VyUEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodXNlckNhbnZhcywgdXNlclBIKTtcbiAgYWlQSC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChhaUNhbnZhcywgYWlQSCk7XG5cbiAgLy8gUmV0dXJuIHRoZSBjYW52YXNlc1xuICByZXR1cm4geyBwbGFjZW1lbnRDYW52YXMsIHVzZXJDYW52YXMsIGFpQ2FudmFzIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjYW52YXNBZGRlcjtcbiIsIi8vIFRoaXMgbW9kdWxlIGFsbG93cyB3cml0aW5nIHRvIHRoZSBnYW1lIGxvZyB0ZXh0XG5pbXBvcnQgZ2FtZUxvZyBmcm9tIFwiLi4vbW9kdWxlcy9nYW1lTG9nXCI7XG5pbXBvcnQgc291bmRzIGZyb20gXCIuLi9tb2R1bGVzL3NvdW5kc1wiO1xuY29uc3Qgc291bmRQbGF5ZXIgPSBzb3VuZHMoKTtcblxuY29uc3QgY3JlYXRlQ2FudmFzID0gKFxuICBzaXplWCxcbiAgc2l6ZVksXG4gIG9wdGlvbnMsXG4gIGdhbWVib2FyZCxcbiAgd2ViSW50ZXJmYWNlLFxuICB1c2VyQ2FudmFzXG4pID0+IHtcbiAgLy8gI3JlZ2lvbiBSZWZlcmVuY2VzXG4gIC8vIFNoaXBzIGFycmF5XG4gIGNvbnN0IHsgc2hpcHMgfSA9IGdhbWVib2FyZDtcblxuICBsZXQgdXNlckJvYXJkQ2FudmFzID0gbnVsbDtcbiAgaWYgKHVzZXJDYW52YXMpIHtcbiAgICBbdXNlckJvYXJkQ2FudmFzXSA9IHVzZXJDYW52YXMuY2hpbGROb2RlcztcbiAgfVxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIFNldCB1cCBiYXNpYyBlbGVtZW50IHByb3BlcnRpZXNcbiAgLy8gU2V0IHRoZSBncmlkIGhlaWdodCBhbmQgd2lkdGggYW5kIGFkZCByZWYgdG8gY3VycmVudCBjZWxsXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG4gIGxldCBjdXJyZW50Q2VsbCA9IG51bGw7XG5cbiAgLy8gQ3JlYXRlIHBhcmVudCBkaXYgdGhhdCBob2xkcyB0aGUgY2FudmFzZXMuIFRoaXMgaXMgdGhlIGVsZW1lbnQgcmV0dXJuZWQuXG4gIGNvbnN0IGNhbnZhc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY2FudmFzLWNvbnRhaW5lclwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGJvYXJkIGNhbnZhcyBlbGVtZW50IHRvIHNlcnZlIGFzIHRoZSBnYW1lYm9hcmQgYmFzZVxuICAvLyBTdGF0aWMgb3IgcmFyZWx5IHJlbmRlcmVkIHRoaW5ncyBzaG91bGQgZ28gaGVyZVxuICBjb25zdCBib2FyZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChib2FyZENhbnZhcyk7XG4gIGJvYXJkQ2FudmFzLndpZHRoID0gc2l6ZVg7XG4gIGJvYXJkQ2FudmFzLmhlaWdodCA9IHNpemVZO1xuICBjb25zdCBib2FyZEN0eCA9IGJvYXJkQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIG92ZXJsYXkgY2FudmFzIGZvciByZW5kZXJpbmcgc2hpcCBwbGFjZW1lbnQgYW5kIGF0dGFjayBzZWxlY3Rpb25cbiAgY29uc3Qgb3ZlcmxheUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChvdmVybGF5Q2FudmFzKTtcbiAgb3ZlcmxheUNhbnZhcy53aWR0aCA9IHNpemVYO1xuICBvdmVybGF5Q2FudmFzLmhlaWdodCA9IHNpemVZO1xuICBjb25zdCBvdmVybGF5Q3R4ID0gb3ZlcmxheUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gU2V0IHRoZSBcImNlbGwgc2l6ZVwiIGZvciB0aGUgZ3JpZCByZXByZXNlbnRlZCBieSB0aGUgY2FudmFzXG4gIGNvbnN0IGNlbGxTaXplWCA9IGJvYXJkQ2FudmFzLndpZHRoIC8gZ3JpZFdpZHRoOyAvLyBNb2R1bGUgY29uc3RcbiAgY29uc3QgY2VsbFNpemVZID0gYm9hcmRDYW52YXMuaGVpZ2h0IC8gZ3JpZEhlaWdodDsgLy8gTW9kdWxlIGNvbnN0XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gR2VuZXJhbCBoZWxwZXIgbWV0aG9kc1xuICAvLyBNZXRob2QgdGhhdCBnZXRzIHRoZSBtb3VzZSBwb3NpdGlvbiBiYXNlZCBvbiB3aGF0IGNlbGwgaXQgaXMgb3ZlclxuICBjb25zdCBnZXRNb3VzZUNlbGwgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gYm9hcmRDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCBjZWxsWCA9IE1hdGguZmxvb3IobW91c2VYIC8gY2VsbFNpemVYKTtcbiAgICBjb25zdCBjZWxsWSA9IE1hdGguZmxvb3IobW91c2VZIC8gY2VsbFNpemVZKTtcblxuICAgIHJldHVybiBbY2VsbFgsIGNlbGxZXTtcbiAgfTtcblxuICAvLyBNZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGNlbGwgaGFzIGEgaGl0IG9yIG1pc3MgaW4gaXRcbiAgY29uc3QgYWxyZWFkeUF0dGFja2VkID0gKGNlbGxDb29yZGluYXRlcykgPT4ge1xuICAgIGxldCBhdHRhY2tlZCA9IGZhbHNlO1xuICAgIGdhbWVib2FyZC5oaXRzLmZvckVhY2goKGhpdCkgPT4ge1xuICAgICAgaWYgKGNlbGxDb29yZGluYXRlc1swXSA9PT0gaGl0WzBdICYmIGNlbGxDb29yZGluYXRlc1sxXSA9PT0gaGl0WzFdKSB7XG4gICAgICAgIGF0dGFja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGdhbWVib2FyZC5taXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xuICAgICAgaWYgKGNlbGxDb29yZGluYXRlc1swXSA9PT0gbWlzc1swXSAmJiBjZWxsQ29vcmRpbmF0ZXNbMV0gPT09IG1pc3NbMV0pIHtcbiAgICAgICAgYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF0dGFja2VkO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIE1ldGhvZHMgZm9yIGRyYXdpbmcgdG8gY2FudmFzZXNcbiAgLy8gTWV0aG9kIGZvciBkcmF3aW5nIHRoZSBncmlkIGxpbmVzXG4gIGNvbnN0IGRyYXdMaW5lcyA9IChjb250ZXh0KSA9PiB7XG4gICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgY29uc3QgZ3JpZFNpemUgPSBNYXRoLm1pbihzaXplWCwgc2l6ZVkpIC8gMTA7XG4gICAgY29uc3QgbGluZUNvbG9yID0gXCJibGFja1wiO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBsaW5lQ29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuXG4gICAgLy8gRHJhdyB2ZXJ0aWNhbCBsaW5lc1xuICAgIGZvciAobGV0IHggPSAwOyB4IDw9IHNpemVYOyB4ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICBjb250ZXh0LmxpbmVUbyh4LCBzaXplWSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIC8vIERyYXcgaG9yaXpvbnRhbCBsaW5lc1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IHNpemVZOyB5ICs9IGdyaWRTaXplKSB7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhzaXplWCwgeSk7XG4gICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBEcmF3cyB0aGUgaGlnaGxpZ2h0ZWQgcGxhY2VtZW50IGNlbGxzIHRvIHRoZSBvdmVybGF5IGNhbnZhc1xuICBjb25zdCBoaWdobGlnaHRQbGFjZW1lbnRDZWxscyA9IChcbiAgICBjZWxsQ29vcmRpbmF0ZXMsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVksXG4gICAgc2hpcHNDb3VudCA9IHNoaXBzLmxlbmd0aCxcbiAgICBkaXJlY3Rpb24gPSBnYW1lYm9hcmQuZGlyZWN0aW9uXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gb3ZlcmxheVxuICAgIGZ1bmN0aW9uIGRyYXdDZWxsKHBvc1gsIHBvc1kpIHtcbiAgICAgIG92ZXJsYXlDdHguZmlsbFJlY3QocG9zWCAqIGNlbGxYLCBwb3NZICogY2VsbFksIGNlbGxYLCBjZWxsWSk7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIGN1cnJlbnQgc2hpcCBsZW5ndGggKGJhc2VkIG9uIGRlZmF1bHQgYmF0dGxlc2hpcCBydWxlcyBzaXplcywgc21hbGxlc3QgdG8gYmlnZ2VzdClcbiAgICBsZXQgZHJhd0xlbmd0aDtcbiAgICBpZiAoc2hpcHNDb3VudCA9PT0gMCkgZHJhd0xlbmd0aCA9IDI7XG4gICAgZWxzZSBpZiAoc2hpcHNDb3VudCA9PT0gMSB8fCBzaGlwc0NvdW50ID09PSAyKSBkcmF3TGVuZ3RoID0gMztcbiAgICBlbHNlIGRyYXdMZW5ndGggPSBzaGlwc0NvdW50ICsgMTtcblxuICAgIC8vIERldGVybWluZSBkaXJlY3Rpb24gdG8gZHJhdyBpblxuICAgIGxldCBkaXJlY3Rpb25YID0gMDtcbiAgICBsZXQgZGlyZWN0aW9uWSA9IDA7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAxKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMTtcbiAgICAgIGRpcmVjdGlvblggPSAwO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICBkaXJlY3Rpb25ZID0gMDtcbiAgICAgIGRpcmVjdGlvblggPSAxO1xuICAgIH1cblxuICAgIC8vIERpdmlkZSB0aGUgZHJhd0xlbmdodCBpbiBoYWxmIHdpdGggcmVtYWluZGVyXG4gICAgY29uc3QgaGFsZkRyYXdMZW5ndGggPSBNYXRoLmZsb29yKGRyYXdMZW5ndGggLyAyKTtcbiAgICBjb25zdCByZW1haW5kZXJMZW5ndGggPSBkcmF3TGVuZ3RoICUgMjtcblxuICAgIC8vIElmIGRyYXdpbmcgb2ZmIGNhbnZhcyBtYWtlIGNvbG9yIHJlZFxuICAgIC8vIENhbGN1bGF0ZSBtYXhpbXVtIGFuZCBtaW5pbXVtIGNvb3JkaW5hdGVzXG4gICAgY29uc3QgbWF4Q29vcmRpbmF0ZVggPVxuICAgICAgY2VsbENvb3JkaW5hdGVzWzBdICsgKGhhbGZEcmF3TGVuZ3RoICsgcmVtYWluZGVyTGVuZ3RoIC0gMSkgKiBkaXJlY3Rpb25YO1xuICAgIGNvbnN0IG1heENvb3JkaW5hdGVZID1cbiAgICAgIGNlbGxDb29yZGluYXRlc1sxXSArIChoYWxmRHJhd0xlbmd0aCArIHJlbWFpbmRlckxlbmd0aCAtIDEpICogZGlyZWN0aW9uWTtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWCA9IGNlbGxDb29yZGluYXRlc1swXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWDtcbiAgICBjb25zdCBtaW5Db29yZGluYXRlWSA9IGNlbGxDb29yZGluYXRlc1sxXSAtIGhhbGZEcmF3TGVuZ3RoICogZGlyZWN0aW9uWTtcblxuICAgIC8vIEFuZCB0cmFuc2xhdGUgaW50byBhbiBhY3R1YWwgY2FudmFzIHBvc2l0aW9uXG4gICAgY29uc3QgbWF4WCA9IG1heENvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWF4WSA9IG1heENvb3JkaW5hdGVZICogY2VsbFk7XG4gICAgY29uc3QgbWluWCA9IG1pbkNvb3JkaW5hdGVYICogY2VsbFg7XG4gICAgY29uc3QgbWluWSA9IG1pbkNvb3JkaW5hdGVZICogY2VsbFk7XG5cbiAgICAvLyBDaGVjayBpZiBhbnkgY2VsbHMgYXJlIG91dHNpZGUgdGhlIGNhbnZhcyBib3VuZGFyaWVzXG4gICAgY29uc3QgaXNPdXRPZkJvdW5kcyA9XG4gICAgICBtYXhYID49IG92ZXJsYXlDYW52YXMud2lkdGggfHxcbiAgICAgIG1heFkgPj0gb3ZlcmxheUNhbnZhcy5oZWlnaHQgfHxcbiAgICAgIG1pblggPCAwIHx8XG4gICAgICBtaW5ZIDwgMDtcblxuICAgIC8vIFNldCB0aGUgZmlsbCBjb2xvciBiYXNlZCBvbiB3aGV0aGVyIGNlbGxzIGFyZSBkcmF3biBvZmYgY2FudmFzXG4gICAgb3ZlcmxheUN0eC5maWxsU3R5bGUgPSBpc091dE9mQm91bmRzID8gXCJyZWRcIiA6IFwiYmx1ZVwiO1xuXG4gICAgLy8gRHJhdyB0aGUgbW91c2VkIG92ZXIgY2VsbCBmcm9tIHBhc3NlZCBjb29yZHNcbiAgICBkcmF3Q2VsbChjZWxsQ29vcmRpbmF0ZXNbMF0sIGNlbGxDb29yZGluYXRlc1sxXSk7XG5cbiAgICAvLyBEcmF3IHRoZSBmaXJzdCBoYWxmIG9mIGNlbGxzIGFuZCByZW1haW5kZXIgaW4gb25lIGRpcmVjdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFsZkRyYXdMZW5ndGggKyByZW1haW5kZXJMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmV4dFggPSBjZWxsQ29vcmRpbmF0ZXNbMF0gKyBpICogZGlyZWN0aW9uWDtcbiAgICAgIGNvbnN0IG5leHRZID0gY2VsbENvb3JkaW5hdGVzWzFdICsgaSAqIGRpcmVjdGlvblk7XG4gICAgICBkcmF3Q2VsbChuZXh0WCwgbmV4dFkpO1xuICAgIH1cblxuICAgIC8vIERyYXcgdGhlIHJlbWFpbmluZyBoYWxmXG4gICAgLy8gRHJhdyB0aGUgcmVtYWluaW5nIGNlbGxzIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZEcmF3TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5leHRYID0gY2VsbENvb3JkaW5hdGVzWzBdIC0gKGkgKyAxKSAqIGRpcmVjdGlvblg7XG4gICAgICBjb25zdCBuZXh0WSA9IGNlbGxDb29yZGluYXRlc1sxXSAtIChpICsgMSkgKiBkaXJlY3Rpb25ZO1xuICAgICAgZHJhd0NlbGwobmV4dFgsIG5leHRZKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRHJhdyBoaWdobGlnaHRlZCBhdHRhY2sgY2VsbFxuICBjb25zdCBoaWdobGlnaHRBdHRhY2sgPSAoXG4gICAgY2VsbENvb3JkaW5hdGVzLFxuICAgIGNlbGxYID0gY2VsbFNpemVYLFxuICAgIGNlbGxZID0gY2VsbFNpemVZXG4gICkgPT4ge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXNcbiAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICBvdmVybGF5Q3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG5cbiAgICAvLyBDaGVjayBpZiBjZWxsIGNvb3JkcyBpbiBnYW1lYm9hcmQgaGl0cyBvciBtaXNzZXNcbiAgICBpZiAoYWxyZWFkeUF0dGFja2VkKGNlbGxDb29yZGluYXRlcykpIHJldHVybjtcblxuICAgIC8vIEhpZ2hsaWdodCB0aGUgY2VsbFxuICAgIG92ZXJsYXlDdHguZmlsbFJlY3QoXG4gICAgICBjZWxsQ29vcmRpbmF0ZXNbMF0gKiBjZWxsWCxcbiAgICAgIGNlbGxDb29yZGluYXRlc1sxXSAqIGNlbGxZLFxuICAgICAgY2VsbFgsXG4gICAgICBjZWxsWVxuICAgICk7XG4gIH07XG5cbiAgLy8gQWRkIG1ldGhvZHMgb24gdGhlIGNvbnRhaW5lciBmb3IgZHJhd2luZyBoaXRzIG9yIG1pc3NlcyBmb3IgZWFzZSBvZiB1c2UgZWxzZXdoZXJlXG4gIGNhbnZhc0NvbnRhaW5lci5kcmF3SGl0ID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKGNvb3JkaW5hdGVzLCAxKTtcbiAgY2FudmFzQ29udGFpbmVyLmRyYXdNaXNzID0gKGNvb3JkaW5hdGVzKSA9PlxuICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKGNvb3JkaW5hdGVzLCAwKTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBc3NpZ24gc3RhdGljIGJlaGF2aW9yc1xuICAvLyBib2FyZENhbnZhc1xuICAvLyBEcmF3IHNoaXBzIHRvIGJvYXJkIGNhbnZhcyB1c2luZyBzaGlwc0NvcHlcbiAgYm9hcmRDYW52YXMuZHJhd1NoaXBzID0gKFxuICAgIHNoaXBzVG9EcmF3ID0gc2hpcHMsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVlcbiAgKSA9PiB7XG4gICAgLy8gRHJhdyBhIGNlbGwgdG8gYm9hcmRcbiAgICBmdW5jdGlvbiBkcmF3Q2VsbChwb3NYLCBwb3NZKSB7XG4gICAgICBib2FyZEN0eC5maWxsUmVjdChwb3NYICogY2VsbFgsIHBvc1kgKiBjZWxsWSwgY2VsbFgsIGNlbGxZKTtcbiAgICB9XG5cbiAgICBzaGlwc1RvRHJhdy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBzaGlwLm9jY3VwaWVkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBkcmF3Q2VsbChjZWxsWzBdLCBjZWxsWzFdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIERyYXcgaGl0IG9yIHRvIGJvYXJkIGNhbnZhc1xuICBib2FyZENhbnZhcy5kcmF3SGl0TWlzcyA9IChcbiAgICBjZWxsQ29vcmRpbmF0ZXMsXG4gICAgdHlwZSA9IDAsXG4gICAgY2VsbFggPSBjZWxsU2l6ZVgsXG4gICAgY2VsbFkgPSBjZWxsU2l6ZVlcbiAgKSA9PiB7XG4gICAgLy8gU2V0IHByb3BlciBmaWxsIGNvbG9yXG4gICAgYm9hcmRDdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgIGlmICh0eXBlID09PSAxKSBib2FyZEN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xuICAgIC8vIFNldCBhIHJhZGl1cyBmb3IgY2lyY2xlIHRvIGRyYXcgZm9yIFwicGVnXCIgdGhhdCB3aWxsIGFsd2F5cyBmaXQgaW4gY2VsbFxuICAgIGNvbnN0IHJhZGl1cyA9IGNlbGxYID4gY2VsbFkgPyBjZWxsWSAvIDIgOiBjZWxsWCAvIDI7XG4gICAgLy8gRHJhdyB0aGUgY2lyY2xlXG4gICAgYm9hcmRDdHguYmVnaW5QYXRoKCk7XG4gICAgYm9hcmRDdHguYXJjKFxuICAgICAgY2VsbENvb3JkaW5hdGVzWzBdICogY2VsbFggKyBjZWxsWCAvIDIsXG4gICAgICBjZWxsQ29vcmRpbmF0ZXNbMV0gKiBjZWxsWSArIGNlbGxZIC8gMixcbiAgICAgIHJhZGl1cyxcbiAgICAgIDAsXG4gICAgICAyICogTWF0aC5QSVxuICAgICk7XG4gICAgYm9hcmRDdHguc3Ryb2tlKCk7XG4gICAgYm9hcmRDdHguZmlsbCgpO1xuICB9O1xuXG4gIC8vIG92ZXJsYXlDYW52YXNcbiAgLy8gRm9yd2FyZCBjbGlja3MgdG8gYm9hcmQgY2FudmFzXG4gIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VDbGljayA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudChcImNsaWNrXCIsIHtcbiAgICAgIGJ1YmJsZXM6IGV2ZW50LmJ1YmJsZXMsXG4gICAgICBjYW5jZWxhYmxlOiBldmVudC5jYW5jZWxhYmxlLFxuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgfSk7XG4gICAgYm9hcmRDYW52YXMuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG4gIH07XG5cbiAgLy8gTW91c2VsZWF2ZVxuICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTGVhdmUgPSAoKSA9PiB7XG4gICAgb3ZlcmxheUN0eC5jbGVhclJlY3QoMCwgMCwgb3ZlcmxheUNhbnZhcy53aWR0aCwgb3ZlcmxheUNhbnZhcy5oZWlnaHQpO1xuICAgIGN1cnJlbnRDZWxsID0gbnVsbDtcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBc3NpZ24gYmVoYXZpb3IgdXNpbmcgYnJvd3NlciBldmVudCBoYW5kbGVycyBiYXNlZCBvbiBvcHRpb25zXG4gIC8vIFBsYWNlbWVudCBpcyB1c2VkIGZvciBwbGFjaW5nIHNoaXBzXG4gIGlmIChvcHRpb25zLnR5cGUgPT09IFwicGxhY2VtZW50XCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gY2FudmFzQ29udGFpbmVyIHRvIGRlbm90ZSBwbGFjZW1lbnQgY29udGFpbmVyXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtY2FudmFzLWNvbnRhaW5lclwiKTtcbiAgICAvLyBTZXQgdXAgb3ZlcmxheUNhbnZhcyB3aXRoIGJlaGF2aW9ycyB1bmlxdWUgdG8gcGxhY2VtZW50XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIEdldCB3aGF0IGNlbGwgdGhlIG1vdXNlIGlzIG92ZXJcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICAvLyBJZiB0aGUgJ29sZCcgY3VycmVudENlbGwgaXMgZXF1YWwgdG8gdGhlIG1vdXNlQ2VsbCBiZWluZyBldmFsdWF0ZWRcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBjdXJyZW50Q2VsbCAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzBdID09PSBtb3VzZUNlbGxbMF0gJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFsxXSA9PT0gbW91c2VDZWxsWzFdXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICAvLyBSZW5kZXIgdGhlIGNoYW5nZXNcbiAgICAgICAgaGlnaGxpZ2h0UGxhY2VtZW50Q2VsbHMobW91c2VDZWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSBjdXJyZW50Q2VsbCB0byB0aGUgbW91c2VDZWxsIGZvciBmdXR1cmUgY29tcGFyaXNvbnNcbiAgICAgIGN1cnJlbnRDZWxsID0gbW91c2VDZWxsO1xuICAgIH07XG5cbiAgICAvLyBCcm93c2VyIGNsaWNrIGV2ZW50c1xuICAgIGJvYXJkQ2FudmFzLmhhbmRsZU1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG5cbiAgICAgIC8vIFRyeSBwbGFjZW1lbnRcbiAgICAgIGdhbWVib2FyZC5hZGRTaGlwKG1vdXNlQ2VsbCk7XG4gICAgICBib2FyZENhbnZhcy5kcmF3U2hpcHMoKTtcbiAgICAgIHVzZXJCb2FyZENhbnZhcy5kcmF3U2hpcHMoKTtcbiAgICAgIHdlYkludGVyZmFjZS50cnlTdGFydEdhbWUoKTtcbiAgICB9O1xuICB9XG4gIC8vIFVzZXIgY2FudmFzIGZvciBkaXNwbGF5aW5nIGFpIGhpdHMgYW5kIG1pc3NlcyBhZ2FpbnN0IHVzZXIgYW5kIHVzZXIgc2hpcCBwbGFjZW1lbnRzXG4gIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAvLyBBZGQgY2xhc3MgdG8gZGVub3RlIHVzZXIgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ1c2VyLWNhbnZhcy1jb250YWluZXJcIik7XG4gICAgLy8gSGFuZGxlIGNhbnZhcyBtb3VzZSBtb3ZlXG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZU1vdmUgPSAoKSA9PiB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKCkgPT4ge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH07XG4gIH1cbiAgLy8gQUkgY2FudmFzIGZvciBkaXNwbGF5aW5nIHVzZXIgaGl0cyBhbmQgbWlzc2VzIGFnYWluc3QgYWksIGFuZCBhaSBzaGlwIHBsYWNlbWVudHMgaWYgdXNlciBsb3Nlc1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09IFwiYWlcIikge1xuICAgIC8vIEFkZCBjbGFzcyB0byBkZW5vdGUgYWkgY2FudmFzXG4gICAgY2FudmFzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhaS1jYW52YXMtY29udGFpbmVyXCIpO1xuICAgIC8vIEhhbmRsZSBjYW52YXMgbW91c2UgbW92ZVxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBHZXQgd2hhdCBjZWxsIHRoZSBtb3VzZSBpcyBvdmVyXG4gICAgICBjb25zdCBtb3VzZUNlbGwgPSBnZXRNb3VzZUNlbGwoZXZlbnQpO1xuXG4gICAgICAvLyBJZiB0aGUgJ29sZCcgY3VycmVudENlbGwgaXMgZXF1YWwgdG8gdGhlIG1vdXNlQ2VsbCBiZWluZyBldmFsdWF0ZWRcbiAgICAgIGlmIChcbiAgICAgICAgIShcbiAgICAgICAgICBjdXJyZW50Q2VsbCAmJlxuICAgICAgICAgIGN1cnJlbnRDZWxsWzBdID09PSBtb3VzZUNlbGxbMF0gJiZcbiAgICAgICAgICBjdXJyZW50Q2VsbFsxXSA9PT0gbW91c2VDZWxsWzFdXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIGN1cnJlbnQgY2VsbCBpbiByZWRcbiAgICAgICAgaGlnaGxpZ2h0QXR0YWNrKG1vdXNlQ2VsbCk7XG4gICAgICB9XG4gICAgICAvLyBEZW5vdGUgaWYgaXQgaXMgYSB2YWxpZCBhdHRhY2sgb3Igbm90IC0gTllJXG4gICAgfTtcbiAgICAvLyBIYW5kbGUgYm9hcmQgbW91c2UgY2xpY2tcbiAgICBib2FyZENhbnZhcy5oYW5kbGVNb3VzZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICAvLyBSZWYgdG8gZ2FtZWJvYXJkXG4gICAgICBjb25zdCBhaUJvYXJkID0gZ2FtZWJvYXJkO1xuICAgICAgLy8gUmV0dXJuIGlmIGdhbWVib2FyZCBjYW4ndCBhdHRhY2tcbiAgICAgIGlmIChhaUJvYXJkLnJpdmFsQm9hcmQuY2FuQXR0YWNrID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNlbGxcbiAgICAgIGNvbnN0IG1vdXNlQ2VsbCA9IGdldE1vdXNlQ2VsbChldmVudCk7XG4gICAgICAvLyBUcnkgYXR0YWNrIGF0IGN1cnJlbnQgY2VsbFxuICAgICAgaWYgKGFscmVhZHlBdHRhY2tlZChtb3VzZUNlbGwpKSB7XG4gICAgICAgIC8vIEJhZCB0aGluZy4gRXJyb3Igc291bmQgbWF5YmUuXG4gICAgICB9IGVsc2UgaWYgKGdhbWVib2FyZC5nYW1lT3ZlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgLy8gU2V0IGdhbWVib2FyZCB0byBub3QgYmUgYWJsZSB0byBhdHRhY2tcbiAgICAgICAgYWlCb2FyZC5yaXZhbEJvYXJkLmNhbkF0dGFjayA9IGZhbHNlO1xuICAgICAgICAvLyBMb2cgdGhlIHNlbnQgYXR0YWNrXG4gICAgICAgIGdhbWVMb2cuZXJhc2UoKTtcbiAgICAgICAgZ2FtZUxvZy5hcHBlbmQoYFVzZXIgYXR0YWNrcyBjZWxsOiAke21vdXNlQ2VsbH1gKTtcbiAgICAgICAgZ2FtZUxvZy5zZXRTY2VuZSgpO1xuICAgICAgICAvLyBQbGF5IHRoZSBzb3VuZFxuICAgICAgICBzb3VuZFBsYXllci5wbGF5QXR0YWNrKCk7XG4gICAgICAgIC8vIFNlbmQgdGhlIGF0dGFja1xuICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhtb3VzZUNlbGwpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIC8vIFNldCBhIHRpbWVvdXQgZm9yIGRyYW1hdGljIGVmZmVjdFxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gQXR0YWNrIGhpdFxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAvLyBQbGF5IHNvdW5kXG4gICAgICAgICAgICAgIHNvdW5kUGxheWVyLnBsYXlIaXQoKTtcbiAgICAgICAgICAgICAgLy8gRHJhdyBoaXQgdG8gYm9hcmRcbiAgICAgICAgICAgICAgYm9hcmRDYW52YXMuZHJhd0hpdE1pc3MobW91c2VDZWxsLCAxKTtcbiAgICAgICAgICAgICAgLy8gTG9nIGhpdFxuICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkF0dGFjayBoaXQhXCIpO1xuICAgICAgICAgICAgICAvLyBMb2cgc3Vua2VuIHNoaXBzXG4gICAgICAgICAgICAgIGFpQm9hcmQubG9nU3VuaygpO1xuICAgICAgICAgICAgICAvLyBDaGVjayBpZiBwbGF5ZXIgd29uXG4gICAgICAgICAgICAgIGlmIChhaUJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgICAgIC8vIExvZyByZXN1bHRzXG4gICAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICBcIkFsbCBBSSB1bml0cyBkZXN0cm95ZWQuIFxcbkh1bWFuaXR5IHN1cnZpdmVzIGFub3RoZXIgZGF5Li4uXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8vIFNldCBnYW1lb3ZlciBvbiBib2FyZHNcbiAgICAgICAgICAgICAgICBhaUJvYXJkLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhaUJvYXJkLnJpdmFsQm9hcmQuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgICAgICBnYW1lTG9nLmFwcGVuZChcIkFJIGRldHJtaW5pbmcgYXR0YWNrLi4uXCIpO1xuICAgICAgICAgICAgICAgIC8vIEhhdmUgdGhlIGFpIGF0dGFjayBpZiBub3QgZ2FtZU92ZXJcbiAgICAgICAgICAgICAgICBnYW1lYm9hcmQudHJ5QWlBdHRhY2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIC8vIFBsYXkgc291bmRcbiAgICAgICAgICAgICAgc291bmRQbGF5ZXIucGxheU1pc3MoKTtcbiAgICAgICAgICAgICAgLy8gRHJhdyBtaXNzIHRvIGJvYXJkXG4gICAgICAgICAgICAgIGJvYXJkQ2FudmFzLmRyYXdIaXRNaXNzKG1vdXNlQ2VsbCwgMCk7XG4gICAgICAgICAgICAgIC8vIExvZyBtaXNzXG4gICAgICAgICAgICAgIGdhbWVMb2cuYXBwZW5kKFwiQXR0YWNrIG1pc3NlZCFcIik7XG4gICAgICAgICAgICAgIC8vIExvZyB0aGUgYWkgXCJ0aGlua2luZ1wiIGFib3V0IGl0cyBhdHRhY2tcbiAgICAgICAgICAgICAgZ2FtZUxvZy5hcHBlbmQoXCJBSSBkZXRybWluaW5nIGF0dGFjay4uLlwiKTtcbiAgICAgICAgICAgICAgLy8gSGF2ZSB0aGUgYWkgYXR0YWNrIGlmIG5vdCBnYW1lT3ZlclxuICAgICAgICAgICAgICBnYW1lYm9hcmQudHJ5QWlBdHRhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENsZWFyIHRoZSBvdmVybGF5IHRvIHNob3cgaGl0L21pc3MgdW5kZXIgY3VycmVudCBoaWdoaWdodFxuICAgICAgICBvdmVybGF5Q3R4LmNsZWFyUmVjdCgwLCAwLCBvdmVybGF5Q2FudmFzLndpZHRoLCBvdmVybGF5Q2FudmFzLmhlaWdodCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gU3Vic2NyaWJlIHRvIGJyb3dzZXIgZXZlbnRzXG4gIC8vIGJvYXJkIGNsaWNrXG4gIGJvYXJkQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gYm9hcmRDYW52YXMuaGFuZGxlTW91c2VDbGljayhlKSk7XG4gIC8vIG92ZXJsYXkgY2xpY2tcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+XG4gICAgb3ZlcmxheUNhbnZhcy5oYW5kbGVNb3VzZUNsaWNrKGUpXG4gICk7XG4gIC8vIG92ZXJsYXkgbW91c2Vtb3ZlXG4gIG92ZXJsYXlDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT5cbiAgICBvdmVybGF5Q2FudmFzLmhhbmRsZU1vdXNlTW92ZShlKVxuICApO1xuICAvLyBvdmVybGF5IG1vdXNlbGVhdmVcbiAgb3ZlcmxheUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PlxuICAgIG92ZXJsYXlDYW52YXMuaGFuZGxlTW91c2VMZWF2ZSgpXG4gICk7XG5cbiAgLy8gRHJhdyBpbml0aWFsIGJvYXJkIGxpbmVzXG4gIGRyYXdMaW5lcyhib2FyZEN0eCk7XG5cbiAgLy8gUmV0dXJuIGNvbXBsZXRlZCBjYW52YXNlc1xuICByZXR1cm4gY2FudmFzQ29udGFpbmVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ2FudmFzO1xuIiwiY29uc3QgaW1hZ2VMb2FkZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGltYWdlUmVmcyA9IHtcbiAgICBTUDogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgQVQ6IHsgaGl0OiBbXSwgYXR0YWNrOiBbXSwgZ2VuOiBbXSB9LFxuICAgIFZNOiB7IGhpdDogW10sIGF0dGFjazogW10sIGdlbjogW10gfSxcbiAgICBJRzogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gICAgTDogeyBoaXQ6IFtdLCBhdHRhY2s6IFtdLCBnZW46IFtdIH0sXG4gIH07XG5cbiAgY29uc3QgaW1hZ2VDb250ZXh0ID0gcmVxdWlyZS5jb250ZXh0KFwiLi4vc2NlbmUtaW1hZ2VzXCIsIHRydWUsIC9cXC5qcGckL2kpO1xuICBjb25zdCBmaWxlcyA9IGltYWdlQ29udGV4dC5rZXlzKCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGltYWdlQ29udGV4dChmaWxlKTtcbiAgICBjb25zdCBmaWxlTmFtZSA9IGZpbGUudG9Mb3dlckNhc2UoKTtcblxuICAgIGNvbnN0IHN1YkRpciA9IGZpbGUuc3BsaXQoXCIvXCIpWzFdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAoZmlsZU5hbWUuaW5jbHVkZXMoXCJoaXRcIikpIHtcbiAgICAgIGltYWdlUmVmc1tzdWJEaXJdLmhpdC5wdXNoKGZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGZpbGVOYW1lLmluY2x1ZGVzKFwiYXR0YWNrXCIpKSB7XG4gICAgICBpbWFnZVJlZnNbc3ViRGlyXS5hdHRhY2sucHVzaChmaWxlUGF0aCk7XG4gICAgfSBlbHNlIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcImdlblwiKSkge1xuICAgICAgaW1hZ2VSZWZzW3N1YkRpcl0uZ2VuLnB1c2goZmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbWFnZVJlZnM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbWFnZUxvYWRlcjtcbiIsIi8vIFRoaXMgaGVscGVyIHdpbGwgYXR0ZW1wdCB0byBhZGQgc2hpcHMgdG8gdGhlIGFpIGdhbWVib2FyZCBpbiBhIHZhcmlldHkgb2Ygd2F5cyBmb3IgdmFyeWluZyBkaWZmaWN1bHR5XG5jb25zdCBwbGFjZUFpU2hpcHMgPSAocGFzc2VkRGlmZiwgYWlHYW1lYm9hcmQpID0+IHtcbiAgLy8gR3JpZCBzaXplXG4gIGNvbnN0IGdyaWRIZWlnaHQgPSAxMDtcbiAgY29uc3QgZ3JpZFdpZHRoID0gMTA7XG5cbiAgLy8gQ29weSBvZiB0aGUgYWkgc2hpcHMgYXJyYXkgYW5kIG1ldGhvZCB0byBnZXQgaXRcbiAgY29uc3QgYWlTaGlwcyA9IGFpR2FtZWJvYXJkLnNoaXBzO1xuXG4gIC8vIFBsYWNlIGEgc2hpcCByYW5kb21seVxuICBjb25zdCBwbGFjZVJhbmRvbVNoaXAgPSAoKSA9PiB7XG4gICAgLy8gR2V0IHJhbmRvbSBwbGFjZW1lbnRcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZFdpZHRoKTtcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ3JpZEhlaWdodCk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgICAvLyBUcnkgdGhlIHBsYWNlbWVudFxuXG4gICAgYWlHYW1lYm9hcmQuYWRkU2hpcChbeCwgeV0sIGRpcmVjdGlvbik7XG4gIH07XG4gIC8vIFBsYWNlIGEgc2hpcCBhbG9uZyBlZGdlcyB1bnRpbCBvbmUgc3VjY2Vzc2Z1bGx5IHBsYWNlZFxuICAvLyBQbGFjZSBhIHNoaXAgYmFzZWQgb24gcXVhZHJhbnRcblxuICAvLyBXYWl0cyBmb3IgYSBhaVNoaXBzU2V0IGV2ZW50XG4gIGZ1bmN0aW9uIHdhaXRGb3JBaVNoaXBzU2V0KCkge1xuICAgIC8vIFJlZmFjdG9yXG4gIH1cblxuICAvLyBDb21iaW5lIHBsYWNlbWVudCB0YWN0aWNzIHRvIGNyZWF0ZSB2YXJ5aW5nIGRpZmZpY3VsdGllc1xuICBjb25zdCBwbGFjZVNoaXBzID0gYXN5bmMgKGRpZmZpY3VsdHkpID0+IHtcbiAgICAvLyBUb3RhbGx5IHJhbmRvbSBwYWxjZW1lbnRcbiAgICBpZiAoZGlmZmljdWx0eSA9PT0gMSAmJiBhaVNoaXBzLmxlbmd0aCA8PSA0KSB7XG4gICAgICAvLyBUcnkgcmFuZG9tIHBsYWNlbWVudFxuICAgICAgcGxhY2VSYW5kb21TaGlwKCk7XG5cbiAgICAgIC8vIFdhaXQgZm9yIHJldHVybkFpU2hpcHNcbiAgICAgIGF3YWl0IHdhaXRGb3JBaVNoaXBzU2V0KCk7XG4gICAgICAvLyBSZWN1cnNpdmVseSBjYWxsIGZuIHVudGlsIHNoaXBzIHBsYWNlZFxuICAgICAgcGxhY2VTaGlwcyhkaWZmaWN1bHR5KTtcbiAgICB9XG4gIH07XG5cbiAgcGxhY2VTaGlwcyhwYXNzZWREaWZmKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlQWlTaGlwcztcbiIsImltcG9ydCBpbWFnZUxvYWRlciBmcm9tIFwiLi4vaGVscGVycy9pbWFnZUxvYWRlclwiO1xuXG5jb25zdCBnYW1lTG9nID0gKCh1c2VyTmFtZSA9IFwiVXNlclwiKSA9PiB7XG4gIC8vIEFkZCBhIHByb3BlcnR5IHRvIHN0b3JlIHRoZSBnYW1lYm9hcmRcbiAgbGV0IHVzZXJHYW1lYm9hcmQgPSBudWxsO1xuXG4gIC8vIFNldHRlciBtZXRob2QgdG8gc2V0IHRoZSBnYW1lYm9hcmRcbiAgY29uc3Qgc2V0VXNlckdhbWVib2FyZCA9IChnYW1lYm9hcmQpID0+IHtcbiAgICB1c2VyR2FtZWJvYXJkID0gZ2FtZWJvYXJkO1xuICB9O1xuXG4gIC8vIFJlZiB0byBsb2cgdGV4dFxuICBjb25zdCBsb2dUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2ctdGV4dFwiKTtcbiAgY29uc3QgbG9nSW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY2VuZS1pbWdcIik7XG5cbiAgLy8gTG9nIHNjZW5lIGhhbmRsaW5nXG4gIGxldCBzY2VuZUltYWdlcyA9IG51bGw7XG4gIC8vIE1ldGhvZCBmb3IgbG9hZGluZyBzY2VuZSBpbWFnZXMuIE11c3QgYmUgcnVuIG9uY2UgaW4gZ2FtZSBtYW5hZ2VyLlxuICBjb25zdCBsb2FkU2NlbmVzID0gKCkgPT4ge1xuICAgIHNjZW5lSW1hZ2VzID0gaW1hZ2VMb2FkZXIoKTtcbiAgfTtcblxuICAvLyBHZXRzIGEgcmFuZG9tIGFycmF5IGVudHJ5XG4gIGZ1bmN0aW9uIHJhbmRvbUVudHJ5KGFycmF5KSB7XG4gICAgY29uc3QgbGFzdEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobGFzdEluZGV4ICsgMSkpO1xuICAgIHJldHVybiByYW5kb21OdW1iZXI7XG4gIH1cblxuICAvLyBHZXRzIGEgcmFuZG9tIHVzZXIgc2hpcCB0aGF0IGlzbid0IGRlc3Ryb3llZFxuICBjb25zdCBkaXJOYW1lcyA9IHsgMDogXCJTUFwiLCAxOiBcIkFUXCIsIDI6IFwiVk1cIiwgMzogXCJJR1wiLCA0OiBcIkxcIiB9O1xuICBmdW5jdGlvbiByYW5kb21TaGlwRGlyKGdhbWVib2FyZCA9IHVzZXJHYW1lYm9hcmQpIHtcbiAgICBsZXQgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSk7XG4gICAgd2hpbGUgKGdhbWVib2FyZC5zaGlwc1tyYW5kb21OdW1iZXJdLmlzU3VuaygpKSB7XG4gICAgICByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KTtcbiAgICB9XG4gICAgcmV0dXJuIGRpck5hbWVzW3JhbmRvbU51bWJlcl07XG4gIH1cblxuICAvLyBJbml0aWFsaXplcyBzY2VuZSBpbWFnZSB0byBnZW4gaW1hZ2VcbiAgY29uc3QgaW5pdFNjZW5lID0gKCkgPT4ge1xuICAgIC8vIGdldCByYW5kb20gc2hpcCBkaXJcbiAgICBjb25zdCBzaGlwRGlyID0gZGlyTmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldO1xuICAgIC8vIGdldCByYW5kb20gYXJyYXkgZW50cnlcbiAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmdlbik7XG4gICAgLy8gc2V0IHRoZSBpbWFnZVxuICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW5bZW50cnldO1xuICB9O1xuXG4gIC8vIFNldHMgdGhlIHNjZW5lIGltYWdlIGJhc2VkIG9uIHBhcmFtcyBwYXNzZWRcbiAgY29uc3Qgc2V0U2NlbmUgPSAoKSA9PiB7XG4gICAgLy8gU2V0IHRoZSB0ZXh0IHRvIGxvd2VyY2FzZSBmb3IgY29tcGFyaXNvblxuICAgIGNvbnN0IGxvZ0xvd2VyID0gbG9nVGV4dC50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gUmVmcyB0byBzaGlwIHR5cGVzIGFuZCB0aGVpciBkaXJzXG4gICAgY29uc3Qgc2hpcFR5cGVzID0gW1wic2VudGluZWxcIiwgXCJhc3NhdWx0XCIsIFwidmlwZXJcIiwgXCJpcm9uXCIsIFwibGV2aWF0aGFuXCJdO1xuICAgIGNvbnN0IHR5cGVUb0RpciA9IHtcbiAgICAgIHNlbnRpbmVsOiBcIlNQXCIsXG4gICAgICBhc3NhdWx0OiBcIkFUXCIsXG4gICAgICB2aXBlcjogXCJWTVwiLFxuICAgICAgaXJvbjogXCJJR1wiLFxuICAgICAgbGV2aWF0aGFuOiBcIkxcIixcbiAgICB9O1xuXG4gICAgLy8gSGVscGVyIGZvciBnZXR0aW5nIHJhbmRvbSBzaGlwIHR5cGUgZnJvbSB0aG9zZSByZW1haW5pbmdcblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiB5b3UgYXR0YWNrIGJhc2VkIG9uIHJlbWFpbmluZyBzaGlwc1xuICAgIGlmIChcbiAgICAgIGxvZ0xvd2VyLmluY2x1ZGVzKHVzZXJOYW1lLnRvTG93ZXJDYXNlKCkpICYmXG4gICAgICBsb2dMb3dlci5pbmNsdWRlcyhcImF0dGFja3NcIilcbiAgICApIHtcbiAgICAgIC8vIEdldCByYW5kb20gc2hpcFxuICAgICAgY29uc3Qgc2hpcERpciA9IHJhbmRvbVNoaXBEaXIoKTtcbiAgICAgIC8vIEdldCByYW5kb20gaW1nIGZyb20gYXBwcm9wcmlhdGUgcGxhY2VcbiAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uYXR0YWNrKTtcbiAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5hdHRhY2tbZW50cnldO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgaW1hZ2Ugd2hlbiBzaGlwIGhpdFxuICAgIGlmIChsb2dMb3dlci5pbmNsdWRlcyhcImhpdCB5b3VyXCIpKSB7XG4gICAgICBzaGlwVHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICBpZiAobG9nTG93ZXIuaW5jbHVkZXModHlwZSkpIHtcbiAgICAgICAgICAvLyBTZXQgdGhlIHNoaXAgZGlyZWN0b3J5IGJhc2VkIG9uIHR5cGVcbiAgICAgICAgICBjb25zdCBzaGlwRGlyID0gdHlwZVRvRGlyW3R5cGVdO1xuICAgICAgICAgIC8vIEdldCBhIHJhbmRvbSBoaXQgZW50cnlcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IHJhbmRvbUVudHJ5KHNjZW5lSW1hZ2VzW3NoaXBEaXJdLmhpdCk7XG4gICAgICAgICAgLy8gU2V0IHRoZSBpbWFnZVxuICAgICAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5oaXRbZW50cnldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGltYWdlIHdoZW4gdGhlcmUgaXMgYW4gYWkgbWlzcyB0byBnZW4gb2YgcmVtYWluaW5nIHNoaXBzXG4gICAgaWYgKGxvZ0xvd2VyLmluY2x1ZGVzKFwiYWkgYXR0YWNrc1wiKSAmJiBsb2dMb3dlci5pbmNsdWRlcyhcIm1pc3NlZFwiKSkge1xuICAgICAgLy8gR2V0IHJhbmRvbSByZW1haW5pbmcgc2hpcCBkaXJcbiAgICAgIGNvbnN0IHNoaXBEaXIgPSByYW5kb21TaGlwRGlyKCk7XG4gICAgICAvLyBHZXQgcmFuZG9tIGVudHJ5IGZyb20gdGhlcmVcbiAgICAgIGNvbnN0IGVudHJ5ID0gcmFuZG9tRW50cnkoc2NlbmVJbWFnZXNbc2hpcERpcl0uZ2VuKTtcbiAgICAgIC8vIFNldCB0aGUgaW1hZ2VcbiAgICAgIGxvZ0ltZy5zcmMgPSBzY2VuZUltYWdlc1tzaGlwRGlyXS5nZW5bZW50cnldO1xuICAgIH1cbiAgfTtcblxuICAvLyBFcmFzZSB0aGUgbG9nIHRleHRcbiAgY29uc3QgZXJhc2UgPSAoKSA9PiB7XG4gICAgbG9nVGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gIH07XG5cbiAgLy8gQWRkIHRvIGxvZyB0ZXh0XG4gIGNvbnN0IGFwcGVuZCA9IChzdHJpbmdUb0FwcGVuZCkgPT4ge1xuICAgIGlmIChzdHJpbmdUb0FwcGVuZCkge1xuICAgICAgbG9nVGV4dC5pbm5lckhUTUwgKz0gYFxcbiR7c3RyaW5nVG9BcHBlbmQudG9TdHJpbmcoKX1gO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4geyBlcmFzZSwgYXBwZW5kLCBzZXRTY2VuZSwgbG9hZFNjZW5lcywgc2V0VXNlckdhbWVib2FyZCwgaW5pdFNjZW5lIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9nO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vZmFjdG9yaWVzL1BsYXllclwiO1xuaW1wb3J0IGNhbnZhc0FkZGVyIGZyb20gXCIuLi9oZWxwZXJzL2NhbnZhc0FkZGVyXCI7XG5pbXBvcnQgd2ViSW50ZXJmYWNlIGZyb20gXCIuL3dlYkludGVyZmFjZVwiO1xuaW1wb3J0IHBsYWNlQWlTaGlwcyBmcm9tIFwiLi4vaGVscGVycy9wbGFjZUFpU2hpcHNcIjtcbmltcG9ydCBnYW1lTG9nIGZyb20gXCIuL2dhbWVMb2dcIjtcblxuLyogVGhpcyBtb2R1bGUgaG9sZHMgdGhlIGdhbWUgbG9vcCBsb2dpYyBmb3Igc3RhcnRpbmcgZ2FtZXMsIGNyZWF0aW5nXG4gICByZXF1aXJlZCBvYmplY3RzLCBpdGVyYXRpbmcgdGhyb3VnaCB0dXJucywgcmVwb3J0aW5nIGdhbWUgb3V0Y29tZSB3aGVuXG4gICBhIHBsYXllciBsb3NlcywgYW5kIHJlc3RhcnQgdGhlIGdhbWUgKi9cbmNvbnN0IGdhbWVNYW5hZ2VyID0gKCkgPT4ge1xuICAvLyAjcmVnaW9uIExvYWRpbmcvSW5pdFxuICAvLyBMb2FkIHNjZW5lIGltYWdlcyBmb3IgZ2FtZSBsb2dcbiAgZ2FtZUxvZy5sb2FkU2NlbmVzKCk7XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gb2YgUGxheWVyIG9iamVjdHMgZm9yIHVzZXIgYW5kIEFJXG4gIGNvbnN0IHVzZXJQbGF5ZXIgPSBQbGF5ZXIoKTtcbiAgY29uc3QgYWlQbGF5ZXIgPSBQbGF5ZXIoKTtcbiAgdXNlclBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IGFpUGxheWVyLmdhbWVib2FyZDtcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSB1c2VyUGxheWVyLmdhbWVib2FyZDtcbiAgdXNlclBsYXllci5nYW1lYm9hcmQuaXNBaSA9IGZhbHNlO1xuICBhaVBsYXllci5nYW1lYm9hcmQuaXNBaSA9IHRydWU7XG5cbiAgLy8gU2V0IGdhbWVMb2cgdXNlciBnYW1lIGJvYXJkIGZvciBhY2N1cmF0ZSBzY2VuZXNcbiAgZ2FtZUxvZy5zZXRVc2VyR2FtZWJvYXJkKHVzZXJQbGF5ZXIuZ2FtZWJvYXJkKTtcbiAgLy8gSW5pdCBnYW1lIGxvZyBzY2VuZSBpbWdcbiAgZ2FtZUxvZy5pbml0U2NlbmUoKTtcblxuICAvLyBJbml0aWFsaXplIHRoZSB3ZWIgaW50ZXJmYWNlIHdpdGggZ2FtZWJvYXJkc1xuICBjb25zdCB3ZWJJbnQgPSB3ZWJJbnRlcmZhY2UodXNlclBsYXllci5nYW1lYm9hcmQsIGFpUGxheWVyLmdhbWVib2FyZCk7XG4gIC8vIEFkZCB0aGUgY2FudmFzIG9iamVjdHMgbm93IHRoYXQgZ2FtZWJvYXJkcyBhcmUgY3JlYXRlZFxuICBjb25zdCBjYW52YXNlcyA9IGNhbnZhc0FkZGVyKFxuICAgIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLFxuICAgIGFpUGxheWVyLmdhbWVib2FyZCxcbiAgICB3ZWJJbnRcbiAgKTtcbiAgLy8gQWRkIGNhbnZhc2VzIHRvIGdhbWVib2FyZHNcbiAgdXNlclBsYXllci5nYW1lYm9hcmQuY2FudmFzID0gY2FudmFzZXMudXNlckNhbnZhcztcbiAgYWlQbGF5ZXIuZ2FtZWJvYXJkLmNhbnZhcyA9IGNhbnZhc2VzLmFpQ2FudmFzO1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyBBZGQgYWkgc2hpcHNcbiAgcGxhY2VBaVNoaXBzKDEsIGFpUGxheWVyLmdhbWVib2FyZCk7XG4gIC8qIE1ldGhvZCB0byBkZXRlcm1pbmUgaWYgZ2FtZSBpcyBvdmVyIGFmdGVyIGV2ZXJ5IHR1cm4uIENoZWNrcyBhbGxTdW5rIG9uIHJpdmFsIGdhbWVib2FyZCBcbiAgICAgYW5kIHJldHVybnMgdHJ1ZSBvciBmYWxzZSAqL1xuXG4gIC8qIE1ldGhvZCB0aGF0IGZsaXBzIGEgdmlydHVhbCBjb2luIHRvIGRldGVybWluZSB3aG8gZ29lcyBmaXJzdCwgYW5kIHNldHMgdGhhdFxuICAgICBwbGF5ZXIgb2JqZWN0IHRvIGFuIGFjdGl2ZSBwbGF5ZXIgdmFyaWFibGUgKi9cblxuICAvLyBNZXRob2QgZm9yIGVuZGluZyB0aGUgZ2FtZSBieSByZXBvcnRpbmcgcmVzdWx0c1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVzdGFydGluZyB0aGUgZ2FtZVxuXG4gIC8qIEl0ZXJhdGUgYmV0d2VlbiBwbGF5ZXJzIGZvciBhdHRhY2tzIC0gaWYgYWJvdmUgbWV0aG9kIGRvZXNuJ3QgcmV0dXJuIHRydWUsIGNoZWNrIHRoZVxuICAgICBhY3RpdmUgcGxheWVyIGFuZCBxdWVyeSB0aGVtIGZvciB0aGVpciBtb3ZlLiBJZiBhYm92ZSBtZXRob2QgaXMgdHJ1ZSwgY2FsbCBtZXRob2RcbiAgICAgZm9yIGVuZGluZyB0aGUgZ2FtZSwgdGhlbiBtZXRob2QgZm9yIHJlc3RhcnRpbmcgdGhlIGdhbWUuXG4gICAgIFxuICAgICAtRm9yIHVzZXIgLSBzZXQgYSBvbmUgdGltZSBldmVudCB0cmlnZ2VyIGZvciB1c2VyIGNsaWNraW5nIG9uIHZhbGlkIGF0dGFjayBwb3NpdGlvbiBkaXZcbiAgICAgb24gdGhlIHdlYiBpbnRlcmZhY2UuIEl0IHdpbGwgdXNlIGdhbWVib2FyZC5yaXZhbEJvYXJkLnJlY2VpdmVBdHRhY2sgYW5kIGluZm8gZnJvbSB0aGUgZGl2XG4gICAgIGh0bWwgZGF0YSB0byBoYXZlIHRoZSBib2FyZCBhdHRlbXB0IHRoZSBhdHRhY2suIElmIHRoZSBhdHRhY2sgaXMgdHJ1ZSBvciBmYWxzZSB0aGVuIGEgdmFsaWRcbiAgICAgaGl0IG9yIHZhbGlkIG1pc3Mgb2NjdXJyZWQuIElmIHVuZGVmaW5lZCB0aGVuIGFuIGludmFsaWQgYXR0YWNrIHdhcyBtYWRlLCB0eXBpY2FsbHkgbWVhbmluZ1xuICAgICBhdHRhY2tpbmcgYSBjZWxsIHRoYXQgaGFzIGFscmVhZHkgaGFkIGEgaGl0IG9yIG1pc3Mgb2NjdXIgaW4gaXQuIElmIHRoZSBhdHRhY2sgaXMgaW52YWxpZCBcbiAgICAgdGhlbiByZXNldCB0aGUgdHJpZ2dlci4gQWZ0ZXIgYSBzdWNjZXNzZnVsIGF0dGFjayAodHJ1ZSBvciBmYWxzZSByZXR1cm5lZCkgdGhlbiBzZXQgdGhlIFxuICAgICBhY3RpdmUgcGxheWVyIHRvIHRoZSBBSSBhbmQgbG9vcFxuXG4gICAgIC1Gb3IgQUkgdXNlIEFJIG1vZHVsZSdzIHF1ZXJ5IG1ldGhvZCBhbmQgcGFzcyBpbiByZWxldmFudCBwYXJhbWV0ZXJzLiBBSSBtb2R1bGUgZG9lcyBpdHNcbiAgICAgbWFnaWMgYW5kIHJldHVybnMgYSBwb3NpdGlvbi4gVGhlbiB1c2UgZ2FtZWJvYXJkLnJpdmFsYm9hcmQucmVjZWl2ZWRBdHRhY2sgdG8gbWFrZSBhbmQgXG4gICAgIGNvbmZpcm0gdGhlIGF0dGFjayBzaW1pbGFyIHRvIHRoZSB1c2VycyBhdHRhY2tzICovXG5cbiAgLy8gVGhlIGxvZ2ljIG9mIHRoZSBnYW1lIG1hbmFnZXIgYW5kIGhvdyB0aGUgd2ViIGludGVyZmFjZSByZXNwb25kcyB0byBpdCB3aWxsIHJlbWFpblxuICAvLyBzZXBhcmF0ZWQgYnkgdXNpbmcgYSBwdWJzdWIgbW9kdWxlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTWFuYWdlcjtcbiIsImltcG9ydCBoaXRTb3VuZCBmcm9tIFwiLi4vU291bmQgRWZmZWN0cy9leHBsb3Npb24ubXAzXCI7XG5pbXBvcnQgbWlzc1NvdW5kIGZyb20gXCIuLi9Tb3VuZCBFZmZlY3RzL21pc3MubXAzXCI7XG5pbXBvcnQgYXR0YWNrU291bmQgZnJvbSBcIi4uL1NvdW5kIEVmZmVjdHMvbGFzZXIubXAzXCI7XG5cbmNvbnN0IGF0dGFja0F1ZGlvID0gbmV3IEF1ZGlvKGF0dGFja1NvdW5kKTtcbmNvbnN0IGhpdEF1ZGlvID0gbmV3IEF1ZGlvKGhpdFNvdW5kKTtcbmNvbnN0IG1pc3NBdWRpbyA9IG5ldyBBdWRpbyhtaXNzU291bmQpO1xuXG5jb25zdCBzb3VuZHMgPSAoKSA9PiB7XG4gIGNvbnN0IHBsYXlIaXQgPSAoKSA9PiB7XG4gICAgLy8gUmVzZXQgYXVkaW8gdG8gYmVnaW5uaW5nIGFuZCBwbGF5IGl0XG4gICAgaGl0QXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgIGhpdEF1ZGlvLnBsYXkoKTtcbiAgfTtcblxuICBjb25zdCBwbGF5TWlzcyA9ICgpID0+IHtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBtaXNzQXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgIG1pc3NBdWRpby5wbGF5KCk7XG4gIH07XG5cbiAgY29uc3QgcGxheUF0dGFjayA9ICgpID0+IHtcbiAgICAvLyBSZXNldCBhdWRpbyB0byBiZWdpbm5pbmcgYW5kIHBsYXkgaXRcbiAgICBhdHRhY2tBdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgYXR0YWNrQXVkaW8ucGxheSgpO1xuICB9O1xuXG4gIHJldHVybiB7IHBsYXlIaXQsIHBsYXlNaXNzLCBwbGF5QXR0YWNrIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzb3VuZHM7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLyogVGhpcyBtb2R1bGUgaGFzIHRocmVlIHByaW1hcnkgZnVuY3Rpb25zOlxuICAgMS4gR2V0IHNoaXAgcGxhY2VtZW50IGNvb3JkaW5hdGVzIGZyb20gdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgY2xpY2tzIG9uIHRoZSB3ZWIgaW50ZXJmYWNlXG4gICAyLiBHZXQgYXR0YWNrIHBsYWNlbWVudCBjb29yZGluYXRlcyBmcm9tIHRoZSB1c2VyIGJhc2VkIG9uIHRoZSBzYW1lXG4gICAzLiBPdGhlciBtaW5vciBpbnRlcmZhY2UgYWN0aW9ucyBzdWNoIGFzIGhhbmRsaW5nIGJ1dHRvbiBjbGlja3MgKHN0YXJ0IGdhbWUsIHJlc3RhcnQsIGV0YykgKi9cbmNvbnN0IHdlYkludGVyZmFjZSA9ICh1c2VyR2FtZWJvYXJkLCBhaUdhbWVib2FyZCkgPT4ge1xuICAvLyBSZWZlcmVuY2VzIHRvIG1haW4gZWxlbWVudHNcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xuICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51XCIpO1xuICBjb25zdCBwbGFjZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudFwiKTtcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcblxuICAvLyBSZWZlcmVuY2UgdG8gYnRuIGVsZW1lbnRzXG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydC1idG5cIik7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLWJ0blwiKTtcblxuICAvLyBNZXRob2QgZm9yIGl0ZXJhdGluZyB0aHJvdWdoIGRpcmVjdGlvbnNcbiAgY29uc3Qgcm90YXRlRGlyZWN0aW9uID0gKCkgPT4ge1xuICAgIHVzZXJHYW1lYm9hcmQuZGlyZWN0aW9uID0gdXNlckdhbWVib2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgICBhaUdhbWVib2FyZC5kaXJlY3Rpb24gPSBhaUdhbWVib2FyZC5kaXJlY3Rpb24gPT09IDAgPyAxIDogMDtcbiAgfTtcblxuICAvLyAjcmVnaW9uIEJhc2ljIG1ldGhvZHMgZm9yIHNob3dpbmcvaGlkaW5nIGVsZW1lbnRzXG4gIC8vIE1vdmUgYW55IGFjdGl2ZSBzZWN0aW9ucyBvZmYgdGhlIHNjcmVlblxuICBjb25zdCBoaWRlQWxsID0gKCkgPT4ge1xuICAgIG1lbnUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hvdyB0aGUgbWVudSBVSVxuICBjb25zdCBzaG93TWVudSA9ICgpID0+IHtcbiAgICBoaWRlQWxsKCk7XG4gICAgbWVudS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIHNoaXAgcGxhY2VtZW50IFVJXG4gIGNvbnN0IHNob3dQbGFjZW1lbnQgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIHBsYWNlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIGdhbWUgVUlcbiAgY29uc3Qgc2hvd0dhbWUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIGdhbWUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcbiAgLy8gSWYgdGhlIHVzZXIgZ2FtZWJvYXJkIGhhcyBmdWxsIHNoaXBzIHRoZW4gdGhlIGdhbWUgaXMgcmVhZHkgdG8gc3RhcnRcbiAgY29uc3QgdHJ5U3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGlmICh1c2VyR2FtZWJvYXJkLnNoaXBzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgc2hvd0dhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQWRkIGNsYXNzZXMgdG8gc2hpcCBkaXZzIHRvIHJlcHJlc2VudCBwbGFjZWQvZGVzdHJveWVkXG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vIEhhbmRsZSBicm93c2VyIGV2ZW50c1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVJvdGF0ZUNsaWNrKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVN0YXJ0Q2xpY2spO1xuXG4gIHJldHVybiB7IHRyeVN0YXJ0R2FtZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2ViSW50ZXJmYWNlO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxuICAgdjIuMCB8IDIwMTEwMTI2XG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxuKi9cblxuaHRtbCxcbmJvZHksXG5kaXYsXG5zcGFuLFxuYXBwbGV0LFxub2JqZWN0LFxuaWZyYW1lLFxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxucCxcbmJsb2NrcXVvdGUsXG5wcmUsXG5hLFxuYWJicixcbmFjcm9ueW0sXG5hZGRyZXNzLFxuYmlnLFxuY2l0ZSxcbmNvZGUsXG5kZWwsXG5kZm4sXG5lbSxcbmltZyxcbmlucyxcbmtiZCxcbnEsXG5zLFxuc2FtcCxcbnNtYWxsLFxuc3RyaWtlLFxuc3Ryb25nLFxuc3ViLFxuc3VwLFxudHQsXG52YXIsXG5iLFxudSxcbmksXG5jZW50ZXIsXG5kbCxcbmR0LFxuZGQsXG5vbCxcbnVsLFxubGksXG5maWVsZHNldCxcbmZvcm0sXG5sYWJlbCxcbmxlZ2VuZCxcbnRhYmxlLFxuY2FwdGlvbixcbnRib2R5LFxudGZvb3QsXG50aGVhZCxcbnRyLFxudGgsXG50ZCxcbmFydGljbGUsXG5hc2lkZSxcbmNhbnZhcyxcbmRldGFpbHMsXG5lbWJlZCxcbmZpZ3VyZSxcbmZpZ2NhcHRpb24sXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxub3V0cHV0LFxucnVieSxcbnNlY3Rpb24sXG5zdW1tYXJ5LFxudGltZSxcbm1hcmssXG5hdWRpbyxcbnZpZGVvIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3JkZXI6IDA7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbiAgZm9udDogaW5oZXJpdDtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xuYXJ0aWNsZSxcbmFzaWRlLFxuZGV0YWlscyxcbmZpZ2NhcHRpb24sXG5maWd1cmUsXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxuc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuYm9keSB7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxub2wsXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5ibG9ja3F1b3RlLFxucSB7XG4gIHF1b3Rlczogbm9uZTtcbn1cbmJsb2NrcXVvdGU6YmVmb3JlLFxuYmxvY2txdW90ZTphZnRlcixcbnE6YmVmb3JlLFxucTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNvbnRlbnQ6IG5vbmU7XG59XG50YWJsZSB7XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUvcmVzZXQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Q0FHQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUZFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsU0FBUztFQUNULGVBQWU7RUFDZixhQUFhO0VBQ2Isd0JBQXdCO0FBQzFCO0FBQ0EsZ0RBQWdEO0FBQ2hEOzs7Ozs7Ozs7OztFQVdFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxZQUFZO0FBQ2Q7QUFDQTs7OztFQUlFLFdBQVc7RUFDWCxhQUFhO0FBQ2Y7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixpQkFBaUI7QUFDbkJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsXFxuYm9keSxcXG5kaXYsXFxuc3BhbixcXG5hcHBsZXQsXFxub2JqZWN0LFxcbmlmcmFtZSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wLFxcbmJsb2NrcXVvdGUsXFxucHJlLFxcbmEsXFxuYWJicixcXG5hY3JvbnltLFxcbmFkZHJlc3MsXFxuYmlnLFxcbmNpdGUsXFxuY29kZSxcXG5kZWwsXFxuZGZuLFxcbmVtLFxcbmltZyxcXG5pbnMsXFxua2JkLFxcbnEsXFxucyxcXG5zYW1wLFxcbnNtYWxsLFxcbnN0cmlrZSxcXG5zdHJvbmcsXFxuc3ViLFxcbnN1cCxcXG50dCxcXG52YXIsXFxuYixcXG51LFxcbmksXFxuY2VudGVyLFxcbmRsLFxcbmR0LFxcbmRkLFxcbm9sLFxcbnVsLFxcbmxpLFxcbmZpZWxkc2V0LFxcbmZvcm0sXFxubGFiZWwsXFxubGVnZW5kLFxcbnRhYmxlLFxcbmNhcHRpb24sXFxudGJvZHksXFxudGZvb3QsXFxudGhlYWQsXFxudHIsXFxudGgsXFxudGQsXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5jYW52YXMsXFxuZGV0YWlscyxcXG5lbWJlZCxcXG5maWd1cmUsXFxuZmlnY2FwdGlvbixcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5vdXRwdXQsXFxucnVieSxcXG5zZWN0aW9uLFxcbnN1bW1hcnksXFxudGltZSxcXG5tYXJrLFxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICBmb250OiBpbmhlcml0O1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5kZXRhaWxzLFxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsXFxucSB7XFxuICBxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLFxcbmJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsXFxucTphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBDb2xvciBSdWxlcyAqL1xuOnJvb3Qge1xuICAtLWNvbG9yQTE6ICM3MjJiOTQ7XG4gIC0tY29sb3JBMjogI2E5MzZlMDtcbiAgLS1jb2xvckM6ICMzN2UwMmI7XG4gIC0tY29sb3JCMTogIzk0MWQwZDtcbiAgLS1jb2xvckIyOiAjZTAzNjFmO1xuXG4gIC0tYmctY29sb3I6IGhzbCgwLCAwJSwgMjIlKTtcbiAgLS1iZy1jb2xvcjI6IGhzbCgwLCAwJSwgMzIlKTtcbiAgLS10ZXh0LWNvbG9yOiBoc2woMCwgMCUsIDkxJSk7XG4gIC0tbGluay1jb2xvcjogaHNsKDM2LCA5MiUsIDU5JSk7XG59XG5cbi8qICNyZWdpb24gVW5pdmVyc2FsIGVsZW1lbnQgcnVsZXMgKi9cbmEge1xuICBjb2xvcjogdmFyKC0tbGluay1jb2xvcik7XG59XG5cbmJvZHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIDFmcjtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciA+ICoge1xuICBncmlkLXJvdzogLTEgLyAxO1xuICBncmlkLWNvbHVtbjogLTEgLyAxO1xufVxuXG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gbWFpbi1jb250ZW50ICovXG4ubWFpbi1jb250ZW50IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogcmVwZWF0KDIwLCA1JSkgLyByZXBlYXQoMjAsIDUlKTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi8qIHRpdGxlIGdyaWQgKi9cbi50aXRsZSB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiAyIC8gNjtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC44cyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcjIpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4udGl0bGUtdGV4dCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogNC44cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMnB4IHZhcigtLWNvbG9yQjEpO1xuICBjb2xvcjogdmFyKC0tY29sb3JCMik7XG5cbiAgdHJhbnNpdGlvbjogZm9udC1zaXplIDAuOHMgZWFzZS1pbi1vdXQ7XG59XG5cbi50aXRsZS5zaHJpbmsge1xuICB0cmFuc2Zvcm06IHNjYWxlKDAuNSkgdHJhbnNsYXRlWSgtNTAlKTtcbn1cblxuLnRpdGxlLnNocmluayAudGl0bGUtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMy41cmVtO1xufVxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cbi5tZW51IHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDggLyAxODtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiA1JSAxNSUgNSUgMWZyIDUlIDFmciAvIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi5cIlxuICAgIFwiY3JlZGl0c1wiXG4gICAgXCIuXCJcbiAgICBcInN0YXJ0LWdhbWVcIlxuICAgIFwiLlwiXG4gICAgXCJvcHRpb25zXCI7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG59XG5cbi5tZW51LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XG59XG5cbi5tZW51IC5jcmVkaXRzIHtcbiAgZ3JpZC1hcmVhOiBjcmVkaXRzO1xufVxuXG4ubWVudSAuc3RhcnQge1xuICBncmlkLWFyZWE6IHN0YXJ0LWdhbWU7XG59XG5cbi5tZW51IC5vcHRpb25zIHtcbiAgZ3JpZC1hcmVhOiBvcHRpb25zO1xuICBhbGlnbi1zZWxmOiBzdGFydDtcbn1cblxuLm1lbnUgLnN0YXJ0LWJ0bixcbi5tZW51IC5vcHRpb25zLWJ0biB7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDE4MHB4O1xuXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuXG4ubWVudSAuc3RhcnQtYnRuOmhvdmVyLFxuLm1lbnUgLm9wdGlvbnMtYnRuOmhvdmVyIHtcbiAgdGV4dC1zaGFkb3c6IDJweCAycHggMXB4IHZhcigtLWNvbG9yQyksIC0ycHggLTJweCAxcHggdmFyKC0tY29sb3JCMik7XG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBwbGFjZW1lbnQgc2VjdGlvbiAqL1xuLnBsYWNlbWVudCB7XG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XG4gIGdyaWQtcm93OiA2IC8gMjA7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCA1JSBtaW4tY29udGVudCA1JSAvIDFmcjtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcbiAgICBcIi5cIlxuICAgIFwiaW5zdHJ1Y3Rpb25zXCJcbiAgICBcIi5cIlxuICAgIFwic2hpcHNcIlxuICAgIFwiLlwiXG4gICAgXCJyb3RhdGVcIlxuICAgIFwiLlwiXG4gICAgXCJjYW52YXNcIjtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcbn1cblxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zIHtcbiAgZ3JpZC1hcmVhOiBpbnN0cnVjdGlvbnM7XG59XG5cbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucy10ZXh0IHtcbiAgZm9udC1zaXplOiAyLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXNoYWRvdzogMXB4IDFweCAxcHggdmFyKC0tYmctY29sb3IpO1xufVxuXG4ucGxhY2VtZW50IC5zaGlwcy10by1wbGFjZSB7XG4gIGdyaWQtYXJlYTogc2hpcHM7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZSB7XG4gIGdyaWQtYXJlYTogcm90YXRlO1xufVxuXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuIHtcbiAgaGVpZ2h0OiA2MHB4O1xuICB3aWR0aDogMTgwcHg7XG5cbiAgZm9udC1zaXplOiAxLjNyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XG4gIHRyYW5zaXRpb246IHRleHQtc2hhZG93IDAuMXMgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yQyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG59XG5cbi5wbGFjZW1lbnQgLnJvdGF0ZS1idG46aG92ZXIge1xuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUge1xuICB0ZXh0LXNoYWRvdzogNHB4IDRweCAxcHggdmFyKC0tY29sb3JDKSwgLTRweCAtNHB4IDFweCB2YXIoLS1jb2xvckIyKTtcbn1cblxuLnBsYWNlbWVudCAucGxhY2VtZW50LWNhbnZhcy1jb250YWluZXIge1xuICBncmlkLWFyZWE6IGNhbnZhcztcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XG59XG5cbi5wbGFjZW1lbnQuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xufVxuXG4ucGxhY2VtZW50IC5jYW52YXMtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JDKTtcbn1cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cbi5nYW1lIHtcbiAgZ3JpZC1jb2x1bW46IDIgLyAyMDtcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZ3JpZC10ZW1wbGF0ZTpcbiAgICByZXBlYXQoMiwgbWlubWF4KDEwcHgsIDFmcikgbWluLWNvbnRlbnQpIG1pbm1heCgxMHB4LCAxZnIpXG4gICAgbWluLWNvbnRlbnQgMWZyIC8gcmVwZWF0KDQsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCIuIC4gLiAuXCJcbiAgICBcIi4gbG9nIGxvZyAuXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXCJcbiAgICBcIi4gLiAuIC5cIlxuICAgIFwidXNlci1pbmZvIHVzZXItaW5mbyBhaS1pbmZvIGFpLWluZm9cIlxuICAgIFwiLiAuIC4gLlwiO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG4uZ2FtZSAuY2FudmFzLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xufVxuXG4uZ2FtZSAudXNlci1jYW52YXMtY29udGFpbmVyIHtcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xufVxuXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XG4gIGdyaWQtYXJlYTogYWktYm9hcmQ7XG59XG5cbi5nYW1lIC51c2VyLWluZm8ge1xuICBncmlkLWFyZWE6IHVzZXItaW5mbztcbn1cblxuLmdhbWUgLmFpLWluZm8ge1xuICBncmlkLWFyZWE6IGFpLWluZm87XG59XG5cbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLWF1dG8tZmxvdzogY29sdW1uO1xufVxuXG4uZ2FtZSAubG9nIHtcbiAgZ3JpZC1hcmVhOiBsb2c7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGU6IDFmciAvIG1pbi1jb250ZW50IDEwcHggMWZyO1xuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcInNjZW5lIC4gdGV4dFwiO1xuXG4gIHdpZHRoOiA1MDBweDtcblxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1jb2xvckIxKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbn1cblxuLmdhbWUgLmxvZyAuc2NlbmUge1xuICBncmlkLWFyZWE6IHNjZW5lO1xuXG4gIGhlaWdodDogMTUwcHg7XG4gIHdpZHRoOiAxNTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JCMSk7XG59XG5cbi5nYW1lIC5sb2cgLnNjZW5lLWltZyB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcbiAgZ3JpZC1hcmVhOiB0ZXh0O1xuICBmb250LXNpemU6IDEuMTVyZW07XG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cbn1cblxuLmdhbWUuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjZW5kcmVnaW9uICovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQ2hCO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGtCQUFrQjs7RUFFbEIsMkJBQTJCO0VBQzNCLDRCQUE0QjtFQUM1Qiw2QkFBNkI7RUFDN0IsK0JBQStCO0FBQ2pDOztBQUVBLG9DQUFvQztBQUNwQztFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGlDQUFpQztFQUNqQyx3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLFlBQVk7RUFDWixnQkFBZ0I7O0VBRWhCLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLGFBQWE7RUFDYix3QkFBd0I7RUFDeEIsa0JBQWtCO0VBQ2xCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixtQkFBbUI7QUFDckI7O0FBRUEsZUFBZTs7QUFFZix5QkFBeUI7QUFDekI7RUFDRSxhQUFhO0VBQ2IsOENBQThDO0VBQzlDLGtCQUFrQjs7RUFFbEIsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQSxlQUFlO0FBQ2Y7RUFDRSxtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLGFBQWE7RUFDYixtQkFB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UnVsZXMgKi9cXG46cm9vdCB7XFxuICAtLWNvbG9yQTE6ICM3MjJiOTQ7XFxuICAtLWNvbG9yQTI6ICNhOTM2ZTA7XFxuICAtLWNvbG9yQzogIzM3ZTAyYjtcXG4gIC0tY29sb3JCMTogIzk0MWQwZDtcXG4gIC0tY29sb3JCMjogI2UwMzYxZjtcXG5cXG4gIC0tYmctY29sb3I6IGhzbCgwLCAwJSwgMjIlKTtcXG4gIC0tYmctY29sb3IyOiBoc2woMCwgMCUsIDMyJSk7XFxuICAtLXRleHQtY29sb3I6IGhzbCgwLCAwJSwgOTElKTtcXG4gIC0tbGluay1jb2xvcjogaHNsKDM2LCA5MiUsIDU5JSk7XFxufVxcblxcbi8qICNyZWdpb24gVW5pdmVyc2FsIGVsZW1lbnQgcnVsZXMgKi9cXG5hIHtcXG4gIGNvbG9yOiB2YXIoLS1saW5rLWNvbG9yKTtcXG59XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcik7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG5cXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbn1cXG5cXG4uY2FudmFzLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gMWZyO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgaGVpZ2h0OiBmaXQtY29udGVudDtcXG59XFxuXFxuLmNhbnZhcy1jb250YWluZXIgPiAqIHtcXG4gIGdyaWQtcm93OiAtMSAvIDE7XFxuICBncmlkLWNvbHVtbjogLTEgLyAxO1xcbn1cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBtYWluLWNvbnRlbnQgKi9cXG4ubWFpbi1jb250ZW50IHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMjAsIDUlKSAvIHJlcGVhdCgyMCwgNSUpO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcblxcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi8qIHRpdGxlIGdyaWQgKi9cXG4udGl0bGUge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiAyIC8gNjtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuOHMgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iZy1jb2xvcjIpO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG59XFxuXFxuLnRpdGxlLXRleHQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiA0LjhyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDJweCB2YXIoLS1jb2xvckIxKTtcXG4gIGNvbG9yOiB2YXIoLS1jb2xvckIyKTtcXG5cXG4gIHRyYW5zaXRpb246IGZvbnQtc2l6ZSAwLjhzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4udGl0bGUuc2hyaW5rIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMC41KSB0cmFuc2xhdGVZKC01MCUpO1xcbn1cXG5cXG4udGl0bGUuc2hyaW5rIC50aXRsZS10ZXh0IHtcXG4gIGZvbnQtc2l6ZTogMy41cmVtO1xcbn1cXG4vKiAjcmVnaW9uIG1lbnUgc2VjdGlvbiAqL1xcbi5tZW51IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogOCAvIDE4O1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGU6IDUlIDE1JSA1JSAxZnIgNSUgMWZyIC8gMWZyO1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwiY3JlZGl0c1xcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJzdGFydC1nYW1lXFxcIlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcIm9wdGlvbnNcXFwiO1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckExKTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcblxcbi5tZW51LmhpZGRlbiB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTE1MCUpO1xcbn1cXG5cXG4ubWVudSAuY3JlZGl0cyB7XFxuICBncmlkLWFyZWE6IGNyZWRpdHM7XFxufVxcblxcbi5tZW51IC5zdGFydCB7XFxuICBncmlkLWFyZWE6IHN0YXJ0LWdhbWU7XFxufVxcblxcbi5tZW51IC5vcHRpb25zIHtcXG4gIGdyaWQtYXJlYTogb3B0aW9ucztcXG4gIGFsaWduLXNlbGY6IHN0YXJ0O1xcbn1cXG5cXG4ubWVudSAuc3RhcnQtYnRuLFxcbi5tZW51IC5vcHRpb25zLWJ0biB7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICB3aWR0aDogMTgwcHg7XFxuXFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xcbiAgdHJhbnNpdGlvbjogdGV4dC1zaGFkb3cgMC4xcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTIpO1xcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3JDKTtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi5tZW51IC5zdGFydC1idG46aG92ZXIsXFxuLm1lbnUgLm9wdGlvbnMtYnRuOmhvdmVyIHtcXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDFweCB2YXIoLS1jb2xvckMpLCAtMnB4IC0ycHggMXB4IHZhcigtLWNvbG9yQjIpO1xcbn1cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBwbGFjZW1lbnQgc2VjdGlvbiAqL1xcbi5wbGFjZW1lbnQge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiA2IC8gMjA7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogNSUgbWluLWNvbnRlbnQgMWZyIG1pbi1jb250ZW50IDFmciBtaW4tY29udGVudCA1JSBtaW4tY29udGVudCA1JSAvIDFmcjtcXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiLlxcXCJcXG4gICAgXFxcImluc3RydWN0aW9uc1xcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJzaGlwc1xcXCJcXG4gICAgXFxcIi5cXFwiXFxuICAgIFxcXCJyb3RhdGVcXFwiXFxuICAgIFxcXCIuXFxcIlxcbiAgICBcXFwiY2FudmFzXFxcIjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMSk7XFxufVxcblxcbi5wbGFjZW1lbnQgLmluc3RydWN0aW9ucyB7XFxuICBncmlkLWFyZWE6IGluc3RydWN0aW9ucztcXG59XFxuXFxuLnBsYWNlbWVudCAuaW5zdHJ1Y3Rpb25zLXRleHQge1xcbiAgZm9udC1zaXplOiAyLjNyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1iZy1jb2xvcik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnNoaXBzLXRvLXBsYWNlIHtcXG4gIGdyaWQtYXJlYTogc2hpcHM7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1hdXRvLWZsb3c6IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlIHtcXG4gIGdyaWQtYXJlYTogcm90YXRlO1xcbn1cXG5cXG4ucGxhY2VtZW50IC5yb3RhdGUtYnRuIHtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiAxODBweDtcXG5cXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICB0cmFuc2l0aW9uOiB0ZXh0LXNoYWRvdyAwLjFzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvckMpO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjpob3ZlciB7XFxuICB0ZXh0LXNoYWRvdzogMnB4IDJweCAxcHggdmFyKC0tY29sb3JDKSwgLTJweCAtMnB4IDFweCB2YXIoLS1jb2xvckIyKTtcXG59XFxuXFxuLnBsYWNlbWVudCAucm90YXRlLWJ0bjphY3RpdmUge1xcbiAgdGV4dC1zaGFkb3c6IDRweCA0cHggMXB4IHZhcigtLWNvbG9yQyksIC00cHggLTRweCAxcHggdmFyKC0tY29sb3JCMik7XFxufVxcblxcbi5wbGFjZW1lbnQgLnBsYWNlbWVudC1jYW52YXMtY29udGFpbmVyIHtcXG4gIGdyaWQtYXJlYTogY2FudmFzO1xcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XFxufVxcblxcbi5wbGFjZW1lbnQuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxNTAlKTtcXG59XFxuXFxuLnBsYWNlbWVudCAuY2FudmFzLWNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvckMpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cXG4uZ2FtZSB7XFxuICBncmlkLWNvbHVtbjogMiAvIDIwO1xcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBwbGFjZS1pdGVtczogY2VudGVyO1xcbiAgZ3JpZC10ZW1wbGF0ZTpcXG4gICAgcmVwZWF0KDIsIG1pbm1heCgxMHB4LCAxZnIpIG1pbi1jb250ZW50KSBtaW5tYXgoMTBweCwgMWZyKVxcbiAgICBtaW4tY29udGVudCAxZnIgLyByZXBlYXQoNCwgMWZyKTtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwiLiBsb2cgbG9nIC5cXFwiXFxuICAgIFxcXCIuIC4gLiAuXFxcIlxcbiAgICBcXFwidXNlci1ib2FyZCB1c2VyLWJvYXJkIGFpLWJvYXJkIGFpLWJvYXJkXFxcIlxcbiAgICBcXFwiLiAuIC4gLlxcXCJcXG4gICAgXFxcInVzZXItaW5mbyB1c2VyLWluZm8gYWktaW5mbyBhaS1pbmZvXFxcIlxcbiAgICBcXFwiLiAuIC4gLlxcXCI7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQTEpO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG59XFxuXFxuLmdhbWUgLmNhbnZhcy1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29sb3JBMik7XFxufVxcblxcbi5nYW1lIC51c2VyLWNhbnZhcy1jb250YWluZXIge1xcbiAgZ3JpZC1hcmVhOiB1c2VyLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAuYWktY2FudmFzLWNvbnRhaW5lciB7XFxuICBncmlkLWFyZWE6IGFpLWJvYXJkO1xcbn1cXG5cXG4uZ2FtZSAudXNlci1pbmZvIHtcXG4gIGdyaWQtYXJlYTogdXNlci1pbmZvO1xcbn1cXG5cXG4uZ2FtZSAuYWktaW5mbyB7XFxuICBncmlkLWFyZWE6IGFpLWluZm87XFxufVxcblxcbi5nYW1lIC5wbGF5ZXItc2hpcHMge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtYXV0by1mbG93OiBjb2x1bW47XFxufVxcblxcbi5nYW1lIC5sb2cge1xcbiAgZ3JpZC1hcmVhOiBsb2c7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZTogMWZyIC8gbWluLWNvbnRlbnQgMTBweCAxZnI7XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcXFwic2NlbmUgLiB0ZXh0XFxcIjtcXG5cXG4gIHdpZHRoOiA1MDBweDtcXG5cXG4gIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWNvbG9yQjEpO1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmctY29sb3IpO1xcbn1cXG5cXG4uZ2FtZSAubG9nIC5zY2VuZSB7XFxuICBncmlkLWFyZWE6IHNjZW5lO1xcblxcbiAgaGVpZ2h0OiAxNTBweDtcXG4gIHdpZHRoOiAxNTBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yQjEpO1xcbn1cXG5cXG4uZ2FtZSAubG9nIC5zY2VuZS1pbWcge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5nYW1lIC5sb2cgLmxvZy10ZXh0IHtcXG4gIGdyaWQtYXJlYTogdGV4dDtcXG4gIGZvbnQtc2l6ZTogMS4xNXJlbTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7IC8qIEFsbG93cyBmb3IgXFxcXG4gKi9cXG59XFxuXFxuLmdhbWUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNTAlKTtcXG59XFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwidmFyIG1hcCA9IHtcblx0XCIuL0FUL2F0X2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazEuanBnXCIsXG5cdFwiLi9BVC9hdF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vQVQvYXRfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfYXR0YWNrMy5qcGdcIixcblx0XCIuL0FUL2F0X2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2F0dGFjazQuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW4xLmpwZ1wiLFxuXHRcIi4vQVQvYXRfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfZ2VuMi5qcGdcIixcblx0XCIuL0FUL2F0X2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2dlbjMuanBnXCIsXG5cdFwiLi9BVC9hdF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9nZW40LmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0MS5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDIuanBnXCIsXG5cdFwiLi9BVC9hdF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9BVC9hdF9oaXQzLmpwZ1wiLFxuXHRcIi4vQVQvYXRfaGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvQVQvYXRfaGl0NC5qcGdcIixcblx0XCIuL0FUL2F0X2hpdDUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0FUL2F0X2hpdDUuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2sxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2sxLmpwZ1wiLFxuXHRcIi4vSUcvaWdfYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfYXR0YWNrMi5qcGdcIixcblx0XCIuL0lHL2lnX2F0dGFjazMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2F0dGFjazMuanBnXCIsXG5cdFwiLi9JRy9pZ19hdHRhY2s0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19hdHRhY2s0LmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuMS5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjIuanBnXCIsXG5cdFwiLi9JRy9pZ19nZW4zLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19nZW4zLmpwZ1wiLFxuXHRcIi4vSUcvaWdfZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfZ2VuNC5qcGdcIixcblx0XCIuL0lHL2lnX2dlbjUuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2dlbjUuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQxLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQxLmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0Mi5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDMuanBnXCIsXG5cdFwiLi9JRy9pZ19oaXQ0LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9JRy9pZ19oaXQ0LmpwZ1wiLFxuXHRcIi4vSUcvaWdfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvSUcvaWdfaGl0NS5qcGdcIixcblx0XCIuL0lHL2lnX2hpdDYuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL0lHL2lnX2hpdDYuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazEuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazIuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazMuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazQuanBnXCIsXG5cdFwiLi9ML2xfYXR0YWNrNS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2F0dGFjazUuanBnXCIsXG5cdFwiLi9ML2xfZ2VuMS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjEuanBnXCIsXG5cdFwiLi9ML2xfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjIuanBnXCIsXG5cdFwiLi9ML2xfZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjMuanBnXCIsXG5cdFwiLi9ML2xfZ2VuNC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2dlbjQuanBnXCIsXG5cdFwiLi9ML2xfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDEuanBnXCIsXG5cdFwiLi9ML2xfaGl0Mi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDIuanBnXCIsXG5cdFwiLi9ML2xfaGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDMuanBnXCIsXG5cdFwiLi9ML2xfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9sX2hpdDUuanBnXCIsXG5cdFwiLi9ML2xnZW41LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9ML2xnZW41LmpwZ1wiLFxuXHRcIi4vTC9saGl0NC5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvTC9saGl0NC5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazEuanBnXCIsXG5cdFwiLi9TUC9zcF9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vU1Avc3BfYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfYXR0YWNrMy5qcGdcIixcblx0XCIuL1NQL3NwX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2F0dGFjazQuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW4xLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW4xLmpwZ1wiLFxuXHRcIi4vU1Avc3BfZ2VuMi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfZ2VuMi5qcGdcIixcblx0XCIuL1NQL3NwX2dlbjMuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2dlbjMuanBnXCIsXG5cdFwiLi9TUC9zcF9nZW40LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9nZW40LmpwZ1wiLFxuXHRcIi4vU1Avc3BfaGl0MS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvU1Avc3BfaGl0MS5qcGdcIixcblx0XCIuL1NQL3NwX2hpdDIuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1NQL3NwX2hpdDIuanBnXCIsXG5cdFwiLi9TUC9zcF9oaXQzLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9TUC9zcF9oaXQzLmpwZ1wiLFxuXHRcIi4vVk0vbXZfaGl0NS5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vbXZfaGl0NS5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazEuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2syLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2syLmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrMy5qcGdcIixcblx0XCIuL1ZNL3ZtX2F0dGFjazQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2F0dGFjazQuanBnXCIsXG5cdFwiLi9WTS92bV9hdHRhY2s1LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9hdHRhY2s1LmpwZ1wiLFxuXHRcIi4vVk0vdm1fYXR0YWNrNi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fYXR0YWNrNi5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjEuanBnXCIsXG5cdFwiLi9WTS92bV9nZW4yLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW4yLmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuMy5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuMy5qcGdcIixcblx0XCIuL1ZNL3ZtX2dlbjQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2dlbjQuanBnXCIsXG5cdFwiLi9WTS92bV9nZW41LmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9nZW41LmpwZ1wiLFxuXHRcIi4vVk0vdm1fZ2VuNi5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1fZ2VuNi5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDEuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDEuanBnXCIsXG5cdFwiLi9WTS92bV9oaXQyLmpwZ1wiOiBcIi4vc3JjL3NjZW5lLWltYWdlcy9WTS92bV9oaXQyLmpwZ1wiLFxuXHRcIi4vVk0vdm1faGl0My5qcGdcIjogXCIuL3NyYy9zY2VuZS1pbWFnZXMvVk0vdm1faGl0My5qcGdcIixcblx0XCIuL1ZNL3ZtX2hpdDQuanBnXCI6IFwiLi9zcmMvc2NlbmUtaW1hZ2VzL1ZNL3ZtX2hpdDQuanBnXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL3NjZW5lLWltYWdlcyBzeW5jIHJlY3Vyc2l2ZSBcXFxcLmpwZyQvXCI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuaW1wb3J0IFwiLi9zdHlsZS9yZXNldC5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGUvc3R5bGUuY3NzXCI7XG5pbXBvcnQgZ2FtZU1hbmFnZXIgZnJvbSBcIi4vbW9kdWxlcy9nYW1lTWFuYWdlclwiO1xuXG4vLyBJbml0aWFsaXplIG1vZHVsZXNcbmdhbWVNYW5hZ2VyKCk7XG4iXSwibmFtZXMiOlsiU2hpcCIsImFpQXR0YWNrIiwiZ2FtZUxvZyIsIkdhbWVib2FyZCIsIm1heEJvYXJkWCIsIm1heEJvYXJkWSIsInRoaXNHYW1lYm9hcmQiLCJzaGlwcyIsImRpcmVjdGlvbiIsInJldHVyblVzZXJTaGlwcyIsImFsbE9jY3VwaWVkQ2VsbHMiLCJhZGRTaGlwIiwicmVjZWl2ZUF0dGFjayIsImNhbkF0dGFjayIsIm1pc3NlcyIsImhpdHMiLCJhbGxTdW5rIiwibG9nU3VuayIsInJpdmFsQm9hcmQiLCJjYW52YXMiLCJpc0FpIiwiZ2FtZU92ZXIiLCJ2YWxpZGF0ZVNoaXAiLCJzaGlwIiwiaXNWYWxpZCIsIl9sb29wIiwiaSIsIm9jY3VwaWVkQ2VsbHMiLCJpc0NlbGxPY2N1cGllZCIsInNvbWUiLCJjZWxsIiwibGVuZ3RoIiwiX3JldCIsImFkZENlbGxzVG9MaXN0IiwiZm9yRWFjaCIsInB1c2giLCJwb3NpdGlvbiIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsInNoaXBUeXBlSW5kZXgiLCJuZXdTaGlwIiwiYWRkTWlzcyIsImFkZEhpdCIsImVyYXNlIiwiYXBwZW5kIiwiY29uY2F0IiwidHlwZSIsInNldFNjZW5lIiwiUHJvbWlzZSIsInJlc29sdmUiLCJBcnJheSIsImlzQXJyYXkiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJqIiwiaGl0IiwidHJ5QWlBdHRhY2siLCJzaGlwQXJyYXkiLCJpc1N1bmsiLCJzdW5rZW5TaGlwcyIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJwbGF5ZXIiLCJQbGF5ZXIiLCJwcml2YXRlTmFtZSIsInRoaXNQbGF5ZXIiLCJuYW1lIiwibmV3TmFtZSIsInRvU3RyaW5nIiwiZ2FtZWJvYXJkIiwic2VuZEF0dGFjayIsInZhbGlkYXRlQXR0YWNrIiwicGxheWVyQm9hcmQiLCJzaGlwTmFtZXMiLCJpbmRleCIsInRoaXNTaGlwIiwic2l6ZSIsInBsYWNlbWVudERpcmVjdGlvblgiLCJwbGFjZW1lbnREaXJlY3Rpb25ZIiwiaGFsZlNpemUiLCJNYXRoIiwiZmxvb3IiLCJyZW1haW5kZXJTaXplIiwibmV3Q29vcmRzIiwic291bmRzIiwic291bmRQbGF5ZXIiLCJncmlkSGVpZ2h0IiwiZ3JpZFdpZHRoIiwiYm9hcmQiLCJhdHRhY2tDb29yZHMiLCJhbHJlYWR5QXR0YWNrZWQiLCJjZWxsQ29vcmRpbmF0ZXMiLCJhdHRhY2tlZCIsIm1pc3MiLCJyYW5kb21BdHRhY2siLCJ4IiwicmFuZG9tIiwieSIsInNldFRpbWVvdXQiLCJ0aGVuIiwicmVzdWx0IiwicGxheUhpdCIsImRyYXdIaXQiLCJwbGF5TWlzcyIsImRyYXdNaXNzIiwiZ3JpZENhbnZhcyIsImNhbnZhc0FkZGVyIiwidXNlckdhbWVib2FyZCIsImFpR2FtZWJvYXJkIiwid2ViSW50ZXJmYWNlIiwicGxhY2VtZW50UEgiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ1c2VyUEgiLCJhaVBIIiwidXNlckNhbnZhcyIsImFpQ2FudmFzIiwicGxhY2VtZW50Q2FudmFzIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsImNyZWF0ZUNhbnZhcyIsInNpemVYIiwic2l6ZVkiLCJvcHRpb25zIiwidXNlckJvYXJkQ2FudmFzIiwiX3VzZXJDYW52YXMkY2hpbGROb2RlIiwiX3NsaWNlZFRvQXJyYXkiLCJjaGlsZE5vZGVzIiwiY3VycmVudENlbGwiLCJjYW52YXNDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9hcmRDYW52YXMiLCJhcHBlbmRDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiYm9hcmRDdHgiLCJnZXRDb250ZXh0Iiwib3ZlcmxheUNhbnZhcyIsIm92ZXJsYXlDdHgiLCJjZWxsU2l6ZVgiLCJjZWxsU2l6ZVkiLCJnZXRNb3VzZUNlbGwiLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJtb3VzZVgiLCJjbGllbnRYIiwibGVmdCIsIm1vdXNlWSIsImNsaWVudFkiLCJ0b3AiLCJjZWxsWCIsImNlbGxZIiwiZHJhd0xpbmVzIiwiY29udGV4dCIsImdyaWRTaXplIiwibWluIiwibGluZUNvbG9yIiwic3Ryb2tlU3R5bGUiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJoaWdobGlnaHRQbGFjZW1lbnRDZWxscyIsInNoaXBzQ291bnQiLCJjbGVhclJlY3QiLCJkcmF3Q2VsbCIsInBvc1giLCJwb3NZIiwiZmlsbFJlY3QiLCJkcmF3TGVuZ3RoIiwiZGlyZWN0aW9uWCIsImRpcmVjdGlvblkiLCJoYWxmRHJhd0xlbmd0aCIsInJlbWFpbmRlckxlbmd0aCIsIm1heENvb3JkaW5hdGVYIiwibWF4Q29vcmRpbmF0ZVkiLCJtaW5Db29yZGluYXRlWCIsIm1pbkNvb3JkaW5hdGVZIiwibWF4WCIsIm1heFkiLCJtaW5YIiwibWluWSIsImlzT3V0T2ZCb3VuZHMiLCJmaWxsU3R5bGUiLCJuZXh0WCIsIm5leHRZIiwiaGlnaGxpZ2h0QXR0YWNrIiwiY29vcmRpbmF0ZXMiLCJkcmF3SGl0TWlzcyIsImRyYXdTaGlwcyIsInNoaXBzVG9EcmF3IiwicmFkaXVzIiwiYXJjIiwiUEkiLCJmaWxsIiwiaGFuZGxlTW91c2VDbGljayIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwibmV3RXZlbnQiLCJNb3VzZUV2ZW50IiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJkaXNwYXRjaEV2ZW50IiwiaGFuZGxlTW91c2VMZWF2ZSIsImhhbmRsZU1vdXNlTW92ZSIsIm1vdXNlQ2VsbCIsInRyeVN0YXJ0R2FtZSIsImFpQm9hcmQiLCJwbGF5QXR0YWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJpbWFnZUxvYWRlciIsImltYWdlUmVmcyIsIlNQIiwiYXR0YWNrIiwiZ2VuIiwiQVQiLCJWTSIsIklHIiwiTCIsImltYWdlQ29udGV4dCIsInJlcXVpcmUiLCJmaWxlcyIsImZpbGUiLCJmaWxlUGF0aCIsImZpbGVOYW1lIiwidG9Mb3dlckNhc2UiLCJzdWJEaXIiLCJzcGxpdCIsInRvVXBwZXJDYXNlIiwiaW5jbHVkZXMiLCJfcmVnZW5lcmF0b3JSdW50aW1lIiwiZXhwb3J0cyIsIk9wIiwicHJvdG90eXBlIiwiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJkZWZpbmVQcm9wZXJ0eSIsIm9iaiIsImRlc2MiLCJ2YWx1ZSIsIiRTeW1ib2wiLCJTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsIml0ZXJhdG9yIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZXJyIiwid3JhcCIsImlubmVyRm4iLCJvdXRlckZuIiwic2VsZiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJjcmVhdGUiLCJDb250ZXh0IiwibWFrZUludm9rZU1ldGhvZCIsInRyeUNhdGNoIiwiZm4iLCJhcmciLCJjYWxsIiwiQ29udGludWVTZW50aW5lbCIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJJdGVyYXRvclByb3RvdHlwZSIsImdldFByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJOYXRpdmVJdGVyYXRvclByb3RvdHlwZSIsInZhbHVlcyIsIkdwIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwibWV0aG9kIiwiX2ludm9rZSIsIkFzeW5jSXRlcmF0b3IiLCJQcm9taXNlSW1wbCIsImludm9rZSIsInJlamVjdCIsInJlY29yZCIsIl90eXBlb2YiLCJfX2F3YWl0IiwidW53cmFwcGVkIiwiZXJyb3IiLCJwcmV2aW91c1Byb21pc2UiLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsInN0YXRlIiwiRXJyb3IiLCJkb25lUmVzdWx0IiwiZGVsZWdhdGUiLCJkZWxlZ2F0ZVJlc3VsdCIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsImRvbmUiLCJtZXRob2ROYW1lIiwiVHlwZUVycm9yIiwiaW5mbyIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJlbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpdGVyYWJsZSIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwiY29uc3RydWN0b3IiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsImFzeW5jIiwiaXRlciIsInZhbCIsIm9iamVjdCIsInJldmVyc2UiLCJwb3AiLCJza2lwVGVtcFJlc2V0IiwicHJldiIsImNoYXJBdCIsInNsaWNlIiwic3RvcCIsInJvb3RSZWNvcmQiLCJydmFsIiwiZXhjZXB0aW9uIiwiaGFuZGxlIiwibG9jIiwiY2F1Z2h0IiwiaGFzQ2F0Y2giLCJoYXNGaW5hbGx5IiwiZmluYWxseUVudHJ5IiwiY29tcGxldGUiLCJmaW5pc2giLCJfY2F0Y2giLCJ0aHJvd24iLCJkZWxlZ2F0ZVlpZWxkIiwiYXN5bmNHZW5lcmF0b3JTdGVwIiwiX25leHQiLCJfdGhyb3ciLCJfYXN5bmNUb0dlbmVyYXRvciIsImFyZ3MiLCJhcHBseSIsInBsYWNlQWlTaGlwcyIsInBhc3NlZERpZmYiLCJhaVNoaXBzIiwicGxhY2VSYW5kb21TaGlwIiwicm91bmQiLCJ3YWl0Rm9yQWlTaGlwc1NldCIsInBsYWNlU2hpcHMiLCJfcmVmIiwiX2NhbGxlZSIsImRpZmZpY3VsdHkiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwiX3giLCJ1c2VyTmFtZSIsInNldFVzZXJHYW1lYm9hcmQiLCJsb2dUZXh0IiwibG9nSW1nIiwic2NlbmVJbWFnZXMiLCJsb2FkU2NlbmVzIiwicmFuZG9tRW50cnkiLCJhcnJheSIsImxhc3RJbmRleCIsInJhbmRvbU51bWJlciIsImRpck5hbWVzIiwicmFuZG9tU2hpcERpciIsImluaXRTY2VuZSIsInNoaXBEaXIiLCJzcmMiLCJsb2dMb3dlciIsInRleHRDb250ZW50Iiwic2hpcFR5cGVzIiwidHlwZVRvRGlyIiwic2VudGluZWwiLCJhc3NhdWx0IiwidmlwZXIiLCJpcm9uIiwibGV2aWF0aGFuIiwic3RyaW5nVG9BcHBlbmQiLCJpbm5lckhUTUwiLCJnYW1lTWFuYWdlciIsInVzZXJQbGF5ZXIiLCJhaVBsYXllciIsIndlYkludCIsImNhbnZhc2VzIiwiaGl0U291bmQiLCJtaXNzU291bmQiLCJhdHRhY2tTb3VuZCIsImF0dGFja0F1ZGlvIiwiQXVkaW8iLCJoaXRBdWRpbyIsIm1pc3NBdWRpbyIsImN1cnJlbnRUaW1lIiwicGxheSIsInRpdGxlIiwibWVudSIsInBsYWNlbWVudCIsImdhbWUiLCJzdGFydEJ0biIsInJvdGF0ZUJ0biIsInJvdGF0ZURpcmVjdGlvbiIsImhpZGVBbGwiLCJzaG93TWVudSIsInJlbW92ZSIsInNob3dQbGFjZW1lbnQiLCJzaG93R2FtZSIsInNocmlua1RpdGxlIiwiaGFuZGxlU3RhcnRDbGljayIsImhhbmRsZVJvdGF0ZUNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==