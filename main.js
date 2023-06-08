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


/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
var Gameboard = function Gameboard() {
  // Constraints for game board (10x10 grid, zero based)
  var maxBoardX = 9;
  var maxBoardY = 9;
  var thisGameboard = {
    ships: [],
    addShip: null,
    receiveAttack: null,
    misses: [],
    hits: [],
    allSunk: null,
    rivalBoard: null,
    get maxBoardX() {
      return maxBoardX;
    },
    get maxBoardY() {
      return maxBoardY;
    }
  };

  // Method that validates ship occupied cell coords
  var validateShip = function validateShip(ship) {
    // Flag for detecting invalid position value
    var isValid = false;

    // Check that ships occupied cells are all within map
    for (var i = 0; i < ship.occupiedCells.length; i += 1) {
      if (ship.occupiedCells[i][0] >= 0 && ship.occupiedCells[i][0] <= maxBoardX && ship.occupiedCells[i][1] >= 0 && ship.occupiedCells[i][1] <= maxBoardY) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    return isValid;
  };

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  thisGameboard.addShip = function (shipTypeIndex, position, direction) {
    // Create the desired ship
    var newShip = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(shipTypeIndex, position, direction);
    // Add it to ships if it has valid occupied cells
    if (validateShip(newShip)) thisGameboard.ships.push(newShip);
  };
  var addMiss = function addMiss(position) {
    thisGameboard.misses.push(position);
  };
  var addHit = function addHit(position) {
    thisGameboard.hits.push(position);
  };
  thisGameboard.receiveAttack = function (position) {
    var ships = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : thisGameboard.ships;
    // Validate position is 2 in array and ships is an array
    if (Array.isArray(position) && position.length === 2 && Number.isInteger(position[0]) && Number.isInteger(position[1]) && Array.isArray(ships)) {
      // Each ship in ships
      for (var i = 0; i < ships.length; i += 1) {
        if (
        // If the ship is not falsy, and occupiedCells prop exists and is an array
        ships[i] && ships[i].occupiedCells && Array.isArray(ships[i].occupiedCells)) {
          // For each of that ships occupied cells
          for (var j = 0; j < ships[0].occupiedCells.length; j += 1) {
            if (
            // If that cell matches the attack position
            ships[i].occupiedCells[j][0] === position[0] && ships[i].occupiedCells[j][1] === position[1]) {
              // Call that ships hit method and break out of loop
              ships[i].hit();
              addHit(position);
              return true;
            }
          }
        }
      }
    }
    addMiss(position);
    return false;
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

  // Turn direction into iterator
  var directionIterator = {
    N: [0, -1],
    S: [0, 1],
    E: [1, 0],
    W: [-1, 0]
  };

  // Use position and direction to add occupied cells coords
  if (Array.isArray(position) && position.length === 2 && Number.isInteger(position[0]) && Number.isInteger(position[1]) && Object.keys(directionIterator).includes(direction)) {
    for (var i = 0; i < thisShip.size; i += 1) {
      var newCoords = [position[0] + i * directionIterator[direction][0], position[1] + i * directionIterator[direction][1]];
      thisShip.occupiedCells.push(newCoords);
    }
  }
  return thisShip;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

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
function createGridCanvas(sizeX, sizeY) {
  // #region Create the canvas element and draw grid
  var canvas = document.createElement("canvas");
  canvas.width = sizeX;
  canvas.height = sizeY;
  var ctx = canvas.getContext("2d");

  // Set transparent background
  ctx.clearRect(0, 0, sizeX, sizeY);

  // Draw grid lines
  var gridSize = Math.min(sizeX, sizeY) / 10;
  var lineColor = "black";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (var x = 0; x <= sizeX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, sizeY);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (var y = 0; y <= sizeY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(sizeX, y);
    ctx.stroke();
  }

  // #endregion

  // #region Add event handlers for clicks, mousemove, and mouseleave
  // Set the cell size refs
  var cellSizeX = canvas.width / 10; // Width of each cell
  var cellSizeY = canvas.height / 10; // Height of each cell

  // Add and handle event for canvas clicks
  var handleClick = function handleClick(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var clickedCellX = Math.floor(mouseX / cellSizeX);
    var clickedCellY = Math.floor(mouseY / cellSizeY);
    console.log("x: ".concat(clickedCellX, ", y: ").concat(clickedCellY));
  };
  canvas.addEventListener("click", handleClick);

  // Add and handle event for mousemove
  var handleMousemove = function handleMousemove(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var hoveredCellX = Math.floor(mouseX / cellSizeX);
    var hoveredCellY = Math.floor(mouseY / cellSizeY);

    // Apply hover effect to the hovered cell
    // const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the grid
    for (var _x = 0; _x < 10; _x += 1) {
      for (var _y = 0; _y < 10; _y += 1) {
        var cellX = _x * cellSizeX;
        var cellY = _y * cellSizeY;
        if (_x === hoveredCellX && _y === hoveredCellY) {
          // Apply hover effect to the hovered cell
          ctx.fillStyle = "gray"; // Set a different color for the hovered cell
          ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);
        } else {
          // Draw the regular cells
          ctx.fillStyle = "lightgray"; // Set the color for regular cells
          ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);
        }

        // Draw grid lines
        ctx.strokeStyle = "black";
        ctx.strokeRect(cellX, cellY, cellSizeX, cellSizeY);
      }
    }
  };
  canvas.addEventListener("mousemove", handleMousemove);

  // Add and handle event for mouseleave
  var handleMouseleave = function handleMouseleave() {
    // const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the grid
    for (var _x2 = 0; _x2 < 10; _x2 += 1) {
      for (var _y2 = 0; _y2 < 10; _y2 += 1) {
        var cellX = _x2 * cellSizeX;
        var cellY = _y2 * cellSizeY;

        // Draw the regular cells
        ctx.fillStyle = "lightgray"; // Set the color for regular cells
        ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);

        // Draw grid lines
        ctx.strokeStyle = "black";
        ctx.strokeRect(cellX, cellY, cellSizeX, cellSizeY);
      }
    }
  };
  canvas.addEventListener("mouseleave", handleMouseleave);

  // #endregion

  // #region Add event handlers for touch start and touch end
  // Helper function to clear the canvas and redraw the grid
  var clearCanvas = function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the grid
    for (var _x3 = 0; _x3 < 10; _x3 += 1) {
      for (var _y3 = 0; _y3 < 10; _y3 += 1) {
        var cellX = _x3 * cellSizeX;
        var cellY = _y3 * cellSizeY;

        // Draw the regular cells
        ctx.fillStyle = "lightgray"; // Set the color for regular cells
        ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);

        // Draw grid lines
        ctx.strokeStyle = "black";
        ctx.strokeRect(cellX, cellY, cellSizeX, cellSizeY);
      }
    }
  };

  // Helper function to handle hover effect
  var handleHover = function handleHover(x, y) {
    var hoveredCellX = Math.floor(x / cellSizeX);
    var hoveredCellY = Math.floor(y / cellSizeY);
    clearCanvas();

    // Draw the grid
    for (var a = 0; a < 10; a += 1) {
      for (var b = 0; b < 10; b += 1) {
        var cellX = a * cellSizeX;
        var cellY = b * cellSizeY;
        if (a === hoveredCellX && b === hoveredCellY) {
          // Apply hover effect to the hovered cell
          ctx.fillStyle = "gray"; // Set a different color for the hovered cell
          ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);
        } else {
          // Draw the regular cells
          ctx.fillStyle = "lightgray"; // Set the color for regular cells
          ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);
        }

        // Draw grid lines
        ctx.strokeStyle = "black";
        ctx.strokeRect(cellX, cellY, cellSizeX, cellSizeY);
      }
    }
  };

  // Add and handle event for touchstart
  var handleTouchstart = function handleTouchstart(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    var touch = touches[0];
    var rect = canvas.getBoundingClientRect();
    var touchX = touch.clientX - rect.left;
    var touchY = touch.clientY - rect.top;
    handleHover(touchX, touchY);
  };
  document.addEventListener("touchstart", handleTouchstart, {
    passive: false
  });

  // Add and handle event for touchmove
  var handleTouchmove = function handleTouchmove(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    var touch = touches[0];
    var rect = canvas.getBoundingClientRect();
    var touchX = touch.clientX - rect.left;
    var touchY = touch.clientY - rect.top;
    handleHover(touchX, touchY);
  };
  document.addEventListener("touchmove", handleTouchmove, {
    passive: false
  });

  // Add and handle event for touchend and touchcancel
  var handleTouchend = function handleTouchend(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    var touch = touches[0];
    var rect = canvas.getBoundingClientRect();
    var touchX = touch.clientX - rect.left;
    var touchY = touch.clientY - rect.top;

    // Check if touch is within the canvas boundaries
    if (touchX >= 0 && touchX < canvas.width && touchY >= 0 && touchY < canvas.height) {
      var endedCellX = Math.floor(touchX / cellSizeX);
      var endedCellY = Math.floor(touchY / cellSizeY);
      console.log("x: ".concat(endedCellX, ", y: ").concat(endedCellY));
    }
    clearCanvas();
  };
  var handleTouchcancel = function handleTouchcancel(event) {
    event.preventDefault();
    clearCanvas();
  };
  document.addEventListener("touchend", handleTouchend, {
    passive: false
  });
  document.addEventListener("touchcancel", handleTouchcancel, {
    passive: false
  });
  // #endregion

  // #endregion

  return canvas;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createGridCanvas);

/***/ }),

/***/ "./src/modules/canvasManager.js":
/*!**************************************!*\
  !*** ./src/modules/canvasManager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_gridCanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/gridCanvas */ "./src/helpers/gridCanvas.js");


/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. */
var canvasManager = function () {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  var placementPH = document.querySelector(".placement-canvas-ph");

  // Create the ship placement canvas
  var placementCanvas = (0,_helpers_gridCanvas__WEBPACK_IMPORTED_MODULE_0__["default"])(300, 300);

  // Replace the place holders
  placementPH.parentNode.replaceChild(placementCanvas, placementPH);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (canvasManager);

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


/* This module holds the game loop logic for starting games, creating
   required objects, iterating through turns, reporting game outcome when
   a player loses, and restart the game */
var gameManager = function () {
  // Initialization of Player objects for user and AI
  var userPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  var aiPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  userPlayer.gameboard.rivalBoard = aiPlayer.gameboard;
  aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
  // Start a game
  /* -Have user add ships - method on interface module 
  
     -Have AI add ships - Need a module that automatically adds ships
     to the ai gameboard. It will need to add them one at a time based on a 
     variable ruleset that will create a bord for a given high-level "dificulty" setting */

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
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameManager);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
  background-color: lightgrey;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;EACE,2BAA2B;AAC7B","sourcesContent":["body {\n  background-color: lightgrey;\n}\n"],"sourceRoot":""}]);
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

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

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
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _modules_gameManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/gameManager */ "./src/modules/gameManager.js");
/* harmony import */ var _modules_canvasManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/canvasManager */ "./src/modules/canvasManager.js");
/* eslint-disable no-unused-vars */



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBLElBQU1DLFNBQVMsR0FBRyxTQUFaQSxTQUFTQSxDQUFBLEVBQVM7RUFDdEI7RUFDQSxJQUFNQyxTQUFTLEdBQUcsQ0FBQztFQUNuQixJQUFNQyxTQUFTLEdBQUcsQ0FBQztFQUVuQixJQUFNQyxhQUFhLEdBQUc7SUFDcEJDLEtBQUssRUFBRSxFQUFFO0lBQ1RDLE9BQU8sRUFBRSxJQUFJO0lBQ2JDLGFBQWEsRUFBRSxJQUFJO0lBQ25CQyxNQUFNLEVBQUUsRUFBRTtJQUNWQyxJQUFJLEVBQUUsRUFBRTtJQUNSQyxPQUFPLEVBQUUsSUFBSTtJQUNiQyxVQUFVLEVBQUUsSUFBSTtJQUNoQixJQUFJVCxTQUFTQSxDQUFBLEVBQUc7TUFDZCxPQUFPQSxTQUFTO0lBQ2xCLENBQUM7SUFDRCxJQUFJQyxTQUFTQSxDQUFBLEVBQUc7TUFDZCxPQUFPQSxTQUFTO0lBQ2xCO0VBQ0YsQ0FBQzs7RUFFRDtFQUNBLElBQU1TLFlBQVksR0FBRyxTQUFmQSxZQUFZQSxDQUFJQyxJQUFJLEVBQUs7SUFDN0I7SUFDQSxJQUFJQyxPQUFPLEdBQUcsS0FBSzs7SUFFbkI7SUFDQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0YsSUFBSSxDQUFDRyxhQUFhLENBQUNDLE1BQU0sRUFBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNyRCxJQUNFRixJQUFJLENBQUNHLGFBQWEsQ0FBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM3QkYsSUFBSSxDQUFDRyxhQUFhLENBQUNELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJYixTQUFTLElBQ3JDVyxJQUFJLENBQUNHLGFBQWEsQ0FBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM3QkYsSUFBSSxDQUFDRyxhQUFhLENBQUNELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJWixTQUFTLEVBQ3JDO1FBQ0FXLE9BQU8sR0FBRyxJQUFJO01BQ2hCLENBQUMsTUFBTTtRQUNMQSxPQUFPLEdBQUcsS0FBSztNQUNqQjtJQUNGO0lBQ0EsT0FBT0EsT0FBTztFQUNoQixDQUFDOztFQUVEO0VBQ0FWLGFBQWEsQ0FBQ0UsT0FBTyxHQUFHLFVBQUNZLGFBQWEsRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUs7SUFDOUQ7SUFDQSxJQUFNQyxPQUFPLEdBQUdyQixpREFBSSxDQUFDa0IsYUFBYSxFQUFFQyxRQUFRLEVBQUVDLFNBQVMsQ0FBQztJQUN4RDtJQUNBLElBQUlSLFlBQVksQ0FBQ1MsT0FBTyxDQUFDLEVBQUVqQixhQUFhLENBQUNDLEtBQUssQ0FBQ2lCLElBQUksQ0FBQ0QsT0FBTyxDQUFDO0VBQzlELENBQUM7RUFFRCxJQUFNRSxPQUFPLEdBQUcsU0FBVkEsT0FBT0EsQ0FBSUosUUFBUSxFQUFLO0lBQzVCZixhQUFhLENBQUNJLE1BQU0sQ0FBQ2MsSUFBSSxDQUFDSCxRQUFRLENBQUM7RUFDckMsQ0FBQztFQUVELElBQU1LLE1BQU0sR0FBRyxTQUFUQSxNQUFNQSxDQUFJTCxRQUFRLEVBQUs7SUFDM0JmLGFBQWEsQ0FBQ0ssSUFBSSxDQUFDYSxJQUFJLENBQUNILFFBQVEsQ0FBQztFQUNuQyxDQUFDO0VBRURmLGFBQWEsQ0FBQ0csYUFBYSxHQUFHLFVBQUNZLFFBQVEsRUFBa0M7SUFBQSxJQUFoQ2QsS0FBSyxHQUFBb0IsU0FBQSxDQUFBUixNQUFBLFFBQUFRLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUdyQixhQUFhLENBQUNDLEtBQUs7SUFDbEU7SUFDQSxJQUNFc0IsS0FBSyxDQUFDQyxPQUFPLENBQUNULFFBQVEsQ0FBQyxJQUN2QkEsUUFBUSxDQUFDRixNQUFNLEtBQUssQ0FBQyxJQUNyQlksTUFBTSxDQUFDQyxTQUFTLENBQUNYLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUM3QlUsTUFBTSxDQUFDQyxTQUFTLENBQUNYLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUM3QlEsS0FBSyxDQUFDQyxPQUFPLENBQUN2QixLQUFLLENBQUMsRUFDcEI7TUFDQTtNQUNBLEtBQUssSUFBSVUsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHVixLQUFLLENBQUNZLE1BQU0sRUFBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QztRQUNFO1FBQ0FWLEtBQUssQ0FBQ1UsQ0FBQyxDQUFDLElBQ1JWLEtBQUssQ0FBQ1UsQ0FBQyxDQUFDLENBQUNDLGFBQWEsSUFDdEJXLEtBQUssQ0FBQ0MsT0FBTyxDQUFDdkIsS0FBSyxDQUFDVSxDQUFDLENBQUMsQ0FBQ0MsYUFBYSxDQUFDLEVBQ3JDO1VBQ0E7VUFDQSxLQUFLLElBQUllLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzFCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ1csYUFBYSxDQUFDQyxNQUFNLEVBQUVjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekQ7WUFDRTtZQUNBMUIsS0FBSyxDQUFDVSxDQUFDLENBQUMsQ0FBQ0MsYUFBYSxDQUFDZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS1osUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUM1Q2QsS0FBSyxDQUFDVSxDQUFDLENBQUMsQ0FBQ0MsYUFBYSxDQUFDZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBS1osUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUM1QztjQUNBO2NBQ0FkLEtBQUssQ0FBQ1UsQ0FBQyxDQUFDLENBQUNpQixHQUFHLENBQUMsQ0FBQztjQUNkUixNQUFNLENBQUNMLFFBQVEsQ0FBQztjQUNoQixPQUFPLElBQUk7WUFDYjtVQUNGO1FBQ0Y7TUFDRjtJQUNGO0lBQ0FJLE9BQU8sQ0FBQ0osUUFBUSxDQUFDO0lBQ2pCLE9BQU8sS0FBSztFQUNkLENBQUM7O0VBRUQ7RUFDQWYsYUFBYSxDQUFDTSxPQUFPLEdBQUcsWUFBcUM7SUFBQSxJQUFwQ3VCLFNBQVMsR0FBQVIsU0FBQSxDQUFBUixNQUFBLFFBQUFRLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUdyQixhQUFhLENBQUNDLEtBQUs7SUFDdEQsSUFBSSxDQUFDNEIsU0FBUyxJQUFJLENBQUNOLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSyxTQUFTLENBQUMsRUFBRSxPQUFPUCxTQUFTO0lBQzdELElBQUloQixPQUFPLEdBQUcsSUFBSTtJQUNsQnVCLFNBQVMsQ0FBQ0MsT0FBTyxDQUFDLFVBQUNyQixJQUFJLEVBQUs7TUFDMUIsSUFBSUEsSUFBSSxJQUFJQSxJQUFJLENBQUNzQixNQUFNLElBQUksQ0FBQ3RCLElBQUksQ0FBQ3NCLE1BQU0sQ0FBQyxDQUFDLEVBQUV6QixPQUFPLEdBQUcsS0FBSztJQUM1RCxDQUFDLENBQUM7SUFDRixPQUFPQSxPQUFPO0VBQ2hCLENBQUM7RUFFRCxPQUFPTixhQUFhO0FBQ3RCLENBQUM7QUFFRCxpRUFBZUgsU0FBUzs7Ozs7Ozs7Ozs7Ozs7O0FDakhZOztBQUVwQztBQUNBLElBQU1tQyxNQUFNLEdBQUcsU0FBVEEsTUFBTUEsQ0FBQSxFQUFTO0VBQ25CLElBQUlDLFdBQVcsR0FBRyxFQUFFO0VBQ3BCLElBQU1DLFVBQVUsR0FBRztJQUNqQixJQUFJQyxJQUFJQSxDQUFBLEVBQUc7TUFDVCxPQUFPRixXQUFXO0lBQ3BCLENBQUM7SUFDRCxJQUFJRSxJQUFJQSxDQUFDQyxPQUFPLEVBQUU7TUFDaEIsSUFBSUEsT0FBTyxFQUFFO1FBQ1hILFdBQVcsR0FBR0csT0FBTyxDQUFDQyxRQUFRLENBQUMsQ0FBQztNQUNsQyxDQUFDLE1BQU1KLFdBQVcsR0FBRyxFQUFFO0lBQ3pCLENBQUM7SUFDREssU0FBUyxFQUFFekMsc0RBQVMsQ0FBQyxDQUFDO0lBQ3RCMEMsVUFBVSxFQUFFO0VBQ2QsQ0FBQzs7RUFFRDtFQUNBLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBY0EsQ0FBSXpCLFFBQVEsRUFBRXVCLFNBQVMsRUFBSztJQUM5QztJQUNBLElBQUksQ0FBQ0EsU0FBUyxJQUFJLENBQUNBLFNBQVMsQ0FBQ3hDLFNBQVMsSUFBSSxDQUFDd0MsU0FBUyxDQUFDdkMsU0FBUyxFQUFFO01BQzlELE9BQU8sS0FBSztJQUNkO0lBQ0E7SUFDQSxJQUNFZ0IsUUFBUSxJQUNSUSxLQUFLLENBQUNDLE9BQU8sQ0FBQ1QsUUFBUSxDQUFDLElBQ3ZCQSxRQUFRLENBQUNGLE1BQU0sS0FBSyxDQUFDLElBQ3JCWSxNQUFNLENBQUNDLFNBQVMsQ0FBQ1gsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQzdCVSxNQUFNLENBQUNDLFNBQVMsQ0FBQ1gsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQzdCQSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUNoQkEsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJdUIsU0FBUyxDQUFDeEMsU0FBUyxJQUNsQ2lCLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQ2hCQSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUl1QixTQUFTLENBQUN2QyxTQUFTLEVBQ2xDO01BQ0EsT0FBTyxJQUFJO0lBQ2I7SUFDQSxPQUFPLEtBQUs7RUFDZCxDQUFDOztFQUVEO0VBQ0FtQyxVQUFVLENBQUNLLFVBQVUsR0FBRyxVQUFDeEIsUUFBUSxFQUF5QztJQUFBLElBQXZDMEIsV0FBVyxHQUFBcEIsU0FBQSxDQUFBUixNQUFBLFFBQUFRLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUdhLFVBQVUsQ0FBQ0ksU0FBUztJQUNuRSxJQUFJRSxjQUFjLENBQUN6QixRQUFRLEVBQUUwQixXQUFXLENBQUMsRUFBRTtNQUN6Q0EsV0FBVyxDQUFDbEMsVUFBVSxDQUFDSixhQUFhLENBQUNZLFFBQVEsQ0FBQztJQUNoRDtFQUNGLENBQUM7RUFFRCxPQUFPbUIsVUFBVTtBQUNuQixDQUFDO0FBRUQsaUVBQWVGLE1BQU07Ozs7Ozs7Ozs7Ozs7O0FDbkRyQjtBQUNBLElBQU1VLFNBQVMsR0FBRztFQUNoQixDQUFDLEVBQUUsZ0JBQWdCO0VBQ25CLENBQUMsRUFBRSxlQUFlO0VBQ2xCLENBQUMsRUFBRSxZQUFZO0VBQ2YsQ0FBQyxFQUFFLGNBQWM7RUFDakIsQ0FBQyxFQUFFO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBLElBQU05QyxJQUFJLEdBQUcsU0FBUEEsSUFBSUEsQ0FBSStDLEtBQUssRUFBRTVCLFFBQVEsRUFBRUMsU0FBUyxFQUFLO0VBQzNDO0VBQ0EsSUFBSSxDQUFDUyxNQUFNLENBQUNDLFNBQVMsQ0FBQ2lCLEtBQUssQ0FBQyxJQUFJQSxLQUFLLEdBQUcsQ0FBQyxJQUFJQSxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU9yQixTQUFTOztFQUV4RTtFQUNBLElBQU1zQixRQUFRLEdBQUc7SUFDZkQsS0FBSyxFQUFMQSxLQUFLO0lBQ0xFLElBQUksRUFBRSxJQUFJO0lBQ1ZDLElBQUksRUFBRSxJQUFJO0lBQ1Z6QyxJQUFJLEVBQUUsQ0FBQztJQUNQdUIsR0FBRyxFQUFFLElBQUk7SUFDVEcsTUFBTSxFQUFFLElBQUk7SUFDWm5CLGFBQWEsRUFBRTtFQUNqQixDQUFDOztFQUVEO0VBQ0EsUUFBUStCLEtBQUs7SUFDWCxLQUFLLENBQUM7TUFDSkMsUUFBUSxDQUFDQyxJQUFJLEdBQUcsQ0FBQztNQUNqQjtJQUNGLEtBQUssQ0FBQztNQUNKRCxRQUFRLENBQUNDLElBQUksR0FBRyxDQUFDO01BQ2pCO0lBQ0Y7TUFDRUQsUUFBUSxDQUFDQyxJQUFJLEdBQUdGLEtBQUs7RUFDekI7O0VBRUE7RUFDQUMsUUFBUSxDQUFDRSxJQUFJLEdBQUdKLFNBQVMsQ0FBQ0UsUUFBUSxDQUFDRCxLQUFLLENBQUM7O0VBRXpDO0VBQ0FDLFFBQVEsQ0FBQ2hCLEdBQUcsR0FBRyxZQUFNO0lBQ25CZ0IsUUFBUSxDQUFDdkMsSUFBSSxJQUFJLENBQUM7RUFDcEIsQ0FBQzs7RUFFRDtFQUNBdUMsUUFBUSxDQUFDYixNQUFNLEdBQUcsWUFBTTtJQUN0QixJQUFJYSxRQUFRLENBQUN2QyxJQUFJLElBQUl1QyxRQUFRLENBQUNDLElBQUksRUFBRSxPQUFPLElBQUk7SUFDL0MsT0FBTyxLQUFLO0VBQ2QsQ0FBQzs7RUFFRDtFQUNBLElBQU1FLGlCQUFpQixHQUFHO0lBQ3hCQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDVkMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNUQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1RDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDWCxDQUFDOztFQUVEO0VBQ0EsSUFDRTVCLEtBQUssQ0FBQ0MsT0FBTyxDQUFDVCxRQUFRLENBQUMsSUFDdkJBLFFBQVEsQ0FBQ0YsTUFBTSxLQUFLLENBQUMsSUFDckJZLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JVLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDWCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFDN0JxQyxNQUFNLENBQUNDLElBQUksQ0FBQ04saUJBQWlCLENBQUMsQ0FBQ08sUUFBUSxDQUFDdEMsU0FBUyxDQUFDLEVBQ2xEO0lBQ0EsS0FBSyxJQUFJTCxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdpQyxRQUFRLENBQUNDLElBQUksRUFBRWxDLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDekMsSUFBTTRDLFNBQVMsR0FBRyxDQUNoQnhDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBR0osQ0FBQyxHQUFHb0MsaUJBQWlCLENBQUMvQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDakRELFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBR0osQ0FBQyxHQUFHb0MsaUJBQWlCLENBQUMvQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbEQ7TUFDRDRCLFFBQVEsQ0FBQ2hDLGFBQWEsQ0FBQ00sSUFBSSxDQUFDcUMsU0FBUyxDQUFDO0lBQ3hDO0VBQ0Y7RUFFQSxPQUFPWCxRQUFRO0FBQ2pCLENBQUM7QUFDRCxpRUFBZWhELElBQUk7Ozs7Ozs7Ozs7Ozs7O0FDOUVuQixTQUFTNEQsZ0JBQWdCQSxDQUFDQyxLQUFLLEVBQUVDLEtBQUssRUFBRTtFQUN0QztFQUNBLElBQU1DLE1BQU0sR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0VBQy9DRixNQUFNLENBQUNHLEtBQUssR0FBR0wsS0FBSztFQUNwQkUsTUFBTSxDQUFDSSxNQUFNLEdBQUdMLEtBQUs7RUFDckIsSUFBTU0sR0FBRyxHQUFHTCxNQUFNLENBQUNNLFVBQVUsQ0FBQyxJQUFJLENBQUM7O0VBRW5DO0VBQ0FELEdBQUcsQ0FBQ0UsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUVULEtBQUssRUFBRUMsS0FBSyxDQUFDOztFQUVqQztFQUNBLElBQU1TLFFBQVEsR0FBR0MsSUFBSSxDQUFDQyxHQUFHLENBQUNaLEtBQUssRUFBRUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtFQUM1QyxJQUFNWSxTQUFTLEdBQUcsT0FBTztFQUN6Qk4sR0FBRyxDQUFDTyxXQUFXLEdBQUdELFNBQVM7RUFDM0JOLEdBQUcsQ0FBQ1EsU0FBUyxHQUFHLENBQUM7O0VBRWpCO0VBQ0EsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLElBQUloQixLQUFLLEVBQUVnQixDQUFDLElBQUlOLFFBQVEsRUFBRTtJQUN6Q0gsR0FBRyxDQUFDVSxTQUFTLENBQUMsQ0FBQztJQUNmVixHQUFHLENBQUNXLE1BQU0sQ0FBQ0YsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQlQsR0FBRyxDQUFDWSxNQUFNLENBQUNILENBQUMsRUFBRWYsS0FBSyxDQUFDO0lBQ3BCTSxHQUFHLENBQUNhLE1BQU0sQ0FBQyxDQUFDO0VBQ2Q7O0VBRUE7RUFDQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsSUFBSXBCLEtBQUssRUFBRW9CLENBQUMsSUFBSVgsUUFBUSxFQUFFO0lBQ3pDSCxHQUFHLENBQUNVLFNBQVMsQ0FBQyxDQUFDO0lBQ2ZWLEdBQUcsQ0FBQ1csTUFBTSxDQUFDLENBQUMsRUFBRUcsQ0FBQyxDQUFDO0lBQ2hCZCxHQUFHLENBQUNZLE1BQU0sQ0FBQ25CLEtBQUssRUFBRXFCLENBQUMsQ0FBQztJQUNwQmQsR0FBRyxDQUFDYSxNQUFNLENBQUMsQ0FBQztFQUNkOztFQUVBOztFQUVBO0VBQ0E7RUFDQSxJQUFNRSxTQUFTLEdBQUdwQixNQUFNLENBQUNHLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQztFQUNyQyxJQUFNa0IsU0FBUyxHQUFHckIsTUFBTSxDQUFDSSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7O0VBRXRDO0VBQ0EsSUFBTWtCLFdBQVcsR0FBRyxTQUFkQSxXQUFXQSxDQUFJQyxLQUFLLEVBQUs7SUFDN0IsSUFBTUMsSUFBSSxHQUFHeEIsTUFBTSxDQUFDeUIscUJBQXFCLENBQUMsQ0FBQztJQUMzQyxJQUFNQyxNQUFNLEdBQUdILEtBQUssQ0FBQ0ksT0FBTyxHQUFHSCxJQUFJLENBQUNJLElBQUk7SUFDeEMsSUFBTUMsTUFBTSxHQUFHTixLQUFLLENBQUNPLE9BQU8sR0FBR04sSUFBSSxDQUFDTyxHQUFHO0lBRXZDLElBQU1DLFlBQVksR0FBR3ZCLElBQUksQ0FBQ3dCLEtBQUssQ0FBQ1AsTUFBTSxHQUFHTixTQUFTLENBQUM7SUFDbkQsSUFBTWMsWUFBWSxHQUFHekIsSUFBSSxDQUFDd0IsS0FBSyxDQUFDSixNQUFNLEdBQUdSLFNBQVMsQ0FBQztJQUVuRGMsT0FBTyxDQUFDQyxHQUFHLE9BQUFDLE1BQUEsQ0FBT0wsWUFBWSxXQUFBSyxNQUFBLENBQVFILFlBQVksQ0FBRSxDQUFDO0VBQ3ZELENBQUM7RUFDRGxDLE1BQU0sQ0FBQ3NDLGdCQUFnQixDQUFDLE9BQU8sRUFBRWhCLFdBQVcsQ0FBQzs7RUFFN0M7RUFDQSxJQUFNaUIsZUFBZSxHQUFHLFNBQWxCQSxlQUFlQSxDQUFJaEIsS0FBSyxFQUFLO0lBQ2pDLElBQU1DLElBQUksR0FBR3hCLE1BQU0sQ0FBQ3lCLHFCQUFxQixDQUFDLENBQUM7SUFDM0MsSUFBTUMsTUFBTSxHQUFHSCxLQUFLLENBQUNJLE9BQU8sR0FBR0gsSUFBSSxDQUFDSSxJQUFJO0lBQ3hDLElBQU1DLE1BQU0sR0FBR04sS0FBSyxDQUFDTyxPQUFPLEdBQUdOLElBQUksQ0FBQ08sR0FBRztJQUV2QyxJQUFNUyxZQUFZLEdBQUcvQixJQUFJLENBQUN3QixLQUFLLENBQUNQLE1BQU0sR0FBR04sU0FBUyxDQUFDO0lBQ25ELElBQU1xQixZQUFZLEdBQUdoQyxJQUFJLENBQUN3QixLQUFLLENBQUNKLE1BQU0sR0FBR1IsU0FBUyxDQUFDOztJQUVuRDtJQUNBO0lBQ0FoQixHQUFHLENBQUNFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFUCxNQUFNLENBQUNHLEtBQUssRUFBRUgsTUFBTSxDQUFDSSxNQUFNLENBQUMsQ0FBQyxDQUFDOztJQUVsRDtJQUNBLEtBQUssSUFBSVUsRUFBQyxHQUFHLENBQUMsRUFBRUEsRUFBQyxHQUFHLEVBQUUsRUFBRUEsRUFBQyxJQUFJLENBQUMsRUFBRTtNQUM5QixLQUFLLElBQUlLLEVBQUMsR0FBRyxDQUFDLEVBQUVBLEVBQUMsR0FBRyxFQUFFLEVBQUVBLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFDOUIsSUFBTXVCLEtBQUssR0FBRzVCLEVBQUMsR0FBR00sU0FBUztRQUMzQixJQUFNdUIsS0FBSyxHQUFHeEIsRUFBQyxHQUFHRSxTQUFTO1FBRTNCLElBQUlQLEVBQUMsS0FBSzBCLFlBQVksSUFBSXJCLEVBQUMsS0FBS3NCLFlBQVksRUFBRTtVQUM1QztVQUNBcEMsR0FBRyxDQUFDdUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1VBQ3hCdkMsR0FBRyxDQUFDd0MsUUFBUSxDQUFDSCxLQUFLLEVBQUVDLEtBQUssRUFBRXZCLFNBQVMsRUFBRUMsU0FBUyxDQUFDO1FBQ2xELENBQUMsTUFBTTtVQUNMO1VBQ0FoQixHQUFHLENBQUN1QyxTQUFTLEdBQUcsV0FBVyxDQUFDLENBQUM7VUFDN0J2QyxHQUFHLENBQUN3QyxRQUFRLENBQUNILEtBQUssRUFBRUMsS0FBSyxFQUFFdkIsU0FBUyxFQUFFQyxTQUFTLENBQUM7UUFDbEQ7O1FBRUE7UUFDQWhCLEdBQUcsQ0FBQ08sV0FBVyxHQUFHLE9BQU87UUFDekJQLEdBQUcsQ0FBQ3lDLFVBQVUsQ0FBQ0osS0FBSyxFQUFFQyxLQUFLLEVBQUV2QixTQUFTLEVBQUVDLFNBQVMsQ0FBQztNQUNwRDtJQUNGO0VBQ0YsQ0FBQztFQUNEckIsTUFBTSxDQUFDc0MsZ0JBQWdCLENBQUMsV0FBVyxFQUFFQyxlQUFlLENBQUM7O0VBRXJEO0VBQ0EsSUFBTVEsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFnQkEsQ0FBQSxFQUFTO0lBQzdCO0lBQ0ExQyxHQUFHLENBQUNFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFUCxNQUFNLENBQUNHLEtBQUssRUFBRUgsTUFBTSxDQUFDSSxNQUFNLENBQUMsQ0FBQyxDQUFDOztJQUVsRDtJQUNBLEtBQUssSUFBSVUsR0FBQyxHQUFHLENBQUMsRUFBRUEsR0FBQyxHQUFHLEVBQUUsRUFBRUEsR0FBQyxJQUFJLENBQUMsRUFBRTtNQUM5QixLQUFLLElBQUlLLEdBQUMsR0FBRyxDQUFDLEVBQUVBLEdBQUMsR0FBRyxFQUFFLEVBQUVBLEdBQUMsSUFBSSxDQUFDLEVBQUU7UUFDOUIsSUFBTXVCLEtBQUssR0FBRzVCLEdBQUMsR0FBR00sU0FBUztRQUMzQixJQUFNdUIsS0FBSyxHQUFHeEIsR0FBQyxHQUFHRSxTQUFTOztRQUUzQjtRQUNBaEIsR0FBRyxDQUFDdUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBQzdCdkMsR0FBRyxDQUFDd0MsUUFBUSxDQUFDSCxLQUFLLEVBQUVDLEtBQUssRUFBRXZCLFNBQVMsRUFBRUMsU0FBUyxDQUFDOztRQUVoRDtRQUNBaEIsR0FBRyxDQUFDTyxXQUFXLEdBQUcsT0FBTztRQUN6QlAsR0FBRyxDQUFDeUMsVUFBVSxDQUFDSixLQUFLLEVBQUVDLEtBQUssRUFBRXZCLFNBQVMsRUFBRUMsU0FBUyxDQUFDO01BQ3BEO0lBQ0Y7RUFDRixDQUFDO0VBQ0RyQixNQUFNLENBQUNzQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUVTLGdCQUFnQixDQUFDOztFQUV2RDs7RUFFQTtFQUNBO0VBQ0EsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQVdBLENBQUEsRUFBUztJQUN4QjNDLEdBQUcsQ0FBQ0UsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUVQLE1BQU0sQ0FBQ0csS0FBSyxFQUFFSCxNQUFNLENBQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0lBRWxEO0lBQ0EsS0FBSyxJQUFJVSxHQUFDLEdBQUcsQ0FBQyxFQUFFQSxHQUFDLEdBQUcsRUFBRSxFQUFFQSxHQUFDLElBQUksQ0FBQyxFQUFFO01BQzlCLEtBQUssSUFBSUssR0FBQyxHQUFHLENBQUMsRUFBRUEsR0FBQyxHQUFHLEVBQUUsRUFBRUEsR0FBQyxJQUFJLENBQUMsRUFBRTtRQUM5QixJQUFNdUIsS0FBSyxHQUFHNUIsR0FBQyxHQUFHTSxTQUFTO1FBQzNCLElBQU11QixLQUFLLEdBQUd4QixHQUFDLEdBQUdFLFNBQVM7O1FBRTNCO1FBQ0FoQixHQUFHLENBQUN1QyxTQUFTLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDN0J2QyxHQUFHLENBQUN3QyxRQUFRLENBQUNILEtBQUssRUFBRUMsS0FBSyxFQUFFdkIsU0FBUyxFQUFFQyxTQUFTLENBQUM7O1FBRWhEO1FBQ0FoQixHQUFHLENBQUNPLFdBQVcsR0FBRyxPQUFPO1FBQ3pCUCxHQUFHLENBQUN5QyxVQUFVLENBQUNKLEtBQUssRUFBRUMsS0FBSyxFQUFFdkIsU0FBUyxFQUFFQyxTQUFTLENBQUM7TUFDcEQ7SUFDRjtFQUNGLENBQUM7O0VBRUQ7RUFDQSxJQUFNNEIsV0FBVyxHQUFHLFNBQWRBLFdBQVdBLENBQUluQyxDQUFDLEVBQUVLLENBQUMsRUFBSztJQUM1QixJQUFNcUIsWUFBWSxHQUFHL0IsSUFBSSxDQUFDd0IsS0FBSyxDQUFDbkIsQ0FBQyxHQUFHTSxTQUFTLENBQUM7SUFDOUMsSUFBTXFCLFlBQVksR0FBR2hDLElBQUksQ0FBQ3dCLEtBQUssQ0FBQ2QsQ0FBQyxHQUFHRSxTQUFTLENBQUM7SUFFOUMyQixXQUFXLENBQUMsQ0FBQzs7SUFFYjtJQUNBLEtBQUssSUFBSUUsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLEVBQUUsRUFBRUEsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUM5QixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRyxFQUFFLEVBQUVBLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDOUIsSUFBTVQsS0FBSyxHQUFHUSxDQUFDLEdBQUc5QixTQUFTO1FBQzNCLElBQU11QixLQUFLLEdBQUdRLENBQUMsR0FBRzlCLFNBQVM7UUFFM0IsSUFBSTZCLENBQUMsS0FBS1YsWUFBWSxJQUFJVyxDQUFDLEtBQUtWLFlBQVksRUFBRTtVQUM1QztVQUNBcEMsR0FBRyxDQUFDdUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1VBQ3hCdkMsR0FBRyxDQUFDd0MsUUFBUSxDQUFDSCxLQUFLLEVBQUVDLEtBQUssRUFBRXZCLFNBQVMsRUFBRUMsU0FBUyxDQUFDO1FBQ2xELENBQUMsTUFBTTtVQUNMO1VBQ0FoQixHQUFHLENBQUN1QyxTQUFTLEdBQUcsV0FBVyxDQUFDLENBQUM7VUFDN0J2QyxHQUFHLENBQUN3QyxRQUFRLENBQUNILEtBQUssRUFBRUMsS0FBSyxFQUFFdkIsU0FBUyxFQUFFQyxTQUFTLENBQUM7UUFDbEQ7O1FBRUE7UUFDQWhCLEdBQUcsQ0FBQ08sV0FBVyxHQUFHLE9BQU87UUFDekJQLEdBQUcsQ0FBQ3lDLFVBQVUsQ0FBQ0osS0FBSyxFQUFFQyxLQUFLLEVBQUV2QixTQUFTLEVBQUVDLFNBQVMsQ0FBQztNQUNwRDtJQUNGO0VBQ0YsQ0FBQzs7RUFFRDtFQUNBLElBQU0rQixnQkFBZ0IsR0FBRyxTQUFuQkEsZ0JBQWdCQSxDQUFJN0IsS0FBSyxFQUFLO0lBQ2xDQSxLQUFLLENBQUM4QixjQUFjLENBQUMsQ0FBQztJQUN0QixJQUFNQyxPQUFPLEdBQUcvQixLQUFLLENBQUNnQyxjQUFjO0lBQ3BDLElBQU1DLEtBQUssR0FBR0YsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFNOUIsSUFBSSxHQUFHeEIsTUFBTSxDQUFDeUIscUJBQXFCLENBQUMsQ0FBQztJQUMzQyxJQUFNZ0MsTUFBTSxHQUFHRCxLQUFLLENBQUM3QixPQUFPLEdBQUdILElBQUksQ0FBQ0ksSUFBSTtJQUN4QyxJQUFNOEIsTUFBTSxHQUFHRixLQUFLLENBQUMxQixPQUFPLEdBQUdOLElBQUksQ0FBQ08sR0FBRztJQUV2Q2tCLFdBQVcsQ0FBQ1EsTUFBTSxFQUFFQyxNQUFNLENBQUM7RUFDN0IsQ0FBQztFQUNEekQsUUFBUSxDQUFDcUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFYyxnQkFBZ0IsRUFBRTtJQUFFTyxPQUFPLEVBQUU7RUFBTSxDQUFDLENBQUM7O0VBRTdFO0VBQ0EsSUFBTUMsZUFBZSxHQUFHLFNBQWxCQSxlQUFlQSxDQUFJckMsS0FBSyxFQUFLO0lBQ2pDQSxLQUFLLENBQUM4QixjQUFjLENBQUMsQ0FBQztJQUN0QixJQUFNQyxPQUFPLEdBQUcvQixLQUFLLENBQUNnQyxjQUFjO0lBQ3BDLElBQU1DLEtBQUssR0FBR0YsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFNOUIsSUFBSSxHQUFHeEIsTUFBTSxDQUFDeUIscUJBQXFCLENBQUMsQ0FBQztJQUMzQyxJQUFNZ0MsTUFBTSxHQUFHRCxLQUFLLENBQUM3QixPQUFPLEdBQUdILElBQUksQ0FBQ0ksSUFBSTtJQUN4QyxJQUFNOEIsTUFBTSxHQUFHRixLQUFLLENBQUMxQixPQUFPLEdBQUdOLElBQUksQ0FBQ08sR0FBRztJQUV2Q2tCLFdBQVcsQ0FBQ1EsTUFBTSxFQUFFQyxNQUFNLENBQUM7RUFDN0IsQ0FBQztFQUNEekQsUUFBUSxDQUFDcUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFc0IsZUFBZSxFQUFFO0lBQUVELE9BQU8sRUFBRTtFQUFNLENBQUMsQ0FBQzs7RUFFM0U7RUFDQSxJQUFNRSxjQUFjLEdBQUcsU0FBakJBLGNBQWNBLENBQUl0QyxLQUFLLEVBQUs7SUFDaENBLEtBQUssQ0FBQzhCLGNBQWMsQ0FBQyxDQUFDO0lBQ3RCLElBQU1DLE9BQU8sR0FBRy9CLEtBQUssQ0FBQ2dDLGNBQWM7SUFDcEMsSUFBTUMsS0FBSyxHQUFHRixPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQU05QixJQUFJLEdBQUd4QixNQUFNLENBQUN5QixxQkFBcUIsQ0FBQyxDQUFDO0lBQzNDLElBQU1nQyxNQUFNLEdBQUdELEtBQUssQ0FBQzdCLE9BQU8sR0FBR0gsSUFBSSxDQUFDSSxJQUFJO0lBQ3hDLElBQU04QixNQUFNLEdBQUdGLEtBQUssQ0FBQzFCLE9BQU8sR0FBR04sSUFBSSxDQUFDTyxHQUFHOztJQUV2QztJQUNBLElBQ0UwQixNQUFNLElBQUksQ0FBQyxJQUNYQSxNQUFNLEdBQUd6RCxNQUFNLENBQUNHLEtBQUssSUFDckJ1RCxNQUFNLElBQUksQ0FBQyxJQUNYQSxNQUFNLEdBQUcxRCxNQUFNLENBQUNJLE1BQU0sRUFDdEI7TUFDQSxJQUFNMEQsVUFBVSxHQUFHckQsSUFBSSxDQUFDd0IsS0FBSyxDQUFDd0IsTUFBTSxHQUFHckMsU0FBUyxDQUFDO01BQ2pELElBQU0yQyxVQUFVLEdBQUd0RCxJQUFJLENBQUN3QixLQUFLLENBQUN5QixNQUFNLEdBQUdyQyxTQUFTLENBQUM7TUFFakRjLE9BQU8sQ0FBQ0MsR0FBRyxPQUFBQyxNQUFBLENBQU95QixVQUFVLFdBQUF6QixNQUFBLENBQVEwQixVQUFVLENBQUUsQ0FBQztJQUNuRDtJQUNBZixXQUFXLENBQUMsQ0FBQztFQUNmLENBQUM7RUFDRCxJQUFNZ0IsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFpQkEsQ0FBSXpDLEtBQUssRUFBSztJQUNuQ0EsS0FBSyxDQUFDOEIsY0FBYyxDQUFDLENBQUM7SUFDdEJMLFdBQVcsQ0FBQyxDQUFDO0VBQ2YsQ0FBQztFQUNEL0MsUUFBUSxDQUFDcUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFdUIsY0FBYyxFQUFFO0lBQUVGLE9BQU8sRUFBRTtFQUFNLENBQUMsQ0FBQztFQUN6RTFELFFBQVEsQ0FBQ3FDLGdCQUFnQixDQUFDLGFBQWEsRUFBRTBCLGlCQUFpQixFQUFFO0lBQzFETCxPQUFPLEVBQUU7RUFDWCxDQUFDLENBQUM7RUFDRjs7RUFFQTs7RUFFQSxPQUFPM0QsTUFBTTtBQUNmO0FBRUEsaUVBQWVILGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7O0FDdE9nQjs7QUFFL0M7QUFDQTtBQUNBLElBQU1xRSxhQUFhLEdBQUksWUFBTTtFQUMzQjtFQUNBO0VBQ0EsSUFBTUMsV0FBVyxHQUFHbEUsUUFBUSxDQUFDbUUsYUFBYSxDQUFDLHNCQUFzQixDQUFDOztFQUVsRTtFQUNBLElBQU1DLGVBQWUsR0FBR0osK0RBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDOztFQUU1QztFQUNBRSxXQUFXLENBQUNHLFVBQVUsQ0FBQ0MsWUFBWSxDQUFDRixlQUFlLEVBQUVGLFdBQVcsQ0FBQztBQUNuRSxDQUFDLENBQUUsQ0FBQztBQUVKLGlFQUFlRCxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7QUNoQmE7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBLElBQU1NLFdBQVcsR0FBSSxZQUFNO0VBQ3pCO0VBQ0EsSUFBTUMsVUFBVSxHQUFHcEcsNkRBQU0sQ0FBQyxDQUFDO0VBQzNCLElBQU1xRyxRQUFRLEdBQUdyRyw2REFBTSxDQUFDLENBQUM7RUFDekJvRyxVQUFVLENBQUM5RixTQUFTLENBQUMvQixVQUFVLEdBQUc4SCxRQUFRLENBQUMvRixTQUFTO0VBQ3BEK0YsUUFBUSxDQUFDL0YsU0FBUyxDQUFDL0IsVUFBVSxHQUFHNkgsVUFBVSxDQUFDOUYsU0FBUztFQUNwRDtFQUNBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0VBRUU7QUFDRjs7RUFFRTtBQUNGOztFQUVFOztFQUVBOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBR0U7RUFDQTtBQUNGLENBQUMsQ0FBRSxDQUFDOztBQUVKLGlFQUFlNkYsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEQxQjtBQUMwRztBQUNqQjtBQUN6Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnRkFBZ0YsWUFBWSxnQ0FBZ0MsZ0NBQWdDLEdBQUcscUJBQXFCO0FBQzNMO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7O0FDVjFCOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQSxNQUErRjtBQUMvRixNQUFxRjtBQUNyRixNQUE0RjtBQUM1RixNQUErRztBQUMvRyxNQUF3RztBQUN4RyxNQUF3RztBQUN4RyxNQUFtRztBQUNuRztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLHNGQUFPOzs7O0FBSTZDO0FBQ3JFLE9BQU8saUVBQWUsc0ZBQU8sSUFBSSxzRkFBTyxVQUFVLHNGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7OztBQzFCaEU7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuRmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNxQjtBQUMyQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvZ3JpZENhbnZhcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY2FudmFzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcblxuLyogRmFjdG9yeSB0aGF0IHJldHVybnMgYSBnYW1lYm9hcmQgdGhhdCBjYW4gcGxhY2Ugc2hpcHMgd2l0aCBTaGlwKCksIHJlY2lldmUgYXR0YWNrcyBiYXNlZCBvbiBjb29yZHMgXG4gICBhbmQgdGhlbiBkZWNpZGVzIHdoZXRoZXIgdG8gaGl0KCkgaWYgc2hpcCBpcyBpbiB0aGF0IHNwb3QsIHJlY29yZHMgaGl0cyBhbmQgbWlzc2VzLCBhbmQgcmVwb3J0cyBpZlxuICAgYWxsIGl0cyBzaGlwcyBoYXZlIGJlZW4gc3Vuay4gKi9cbmNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgLy8gQ29uc3RyYWludHMgZm9yIGdhbWUgYm9hcmQgKDEweDEwIGdyaWQsIHplcm8gYmFzZWQpXG4gIGNvbnN0IG1heEJvYXJkWCA9IDk7XG4gIGNvbnN0IG1heEJvYXJkWSA9IDk7XG5cbiAgY29uc3QgdGhpc0dhbWVib2FyZCA9IHtcbiAgICBzaGlwczogW10sXG4gICAgYWRkU2hpcDogbnVsbCxcbiAgICByZWNlaXZlQXR0YWNrOiBudWxsLFxuICAgIG1pc3NlczogW10sXG4gICAgaGl0czogW10sXG4gICAgYWxsU3VuazogbnVsbCxcbiAgICByaXZhbEJvYXJkOiBudWxsLFxuICAgIGdldCBtYXhCb2FyZFgoKSB7XG4gICAgICByZXR1cm4gbWF4Qm9hcmRYO1xuICAgIH0sXG4gICAgZ2V0IG1heEJvYXJkWSgpIHtcbiAgICAgIHJldHVybiBtYXhCb2FyZFk7XG4gICAgfSxcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgc2hpcCBvY2N1cGllZCBjZWxsIGNvb3Jkc1xuICBjb25zdCB2YWxpZGF0ZVNoaXAgPSAoc2hpcCkgPT4ge1xuICAgIC8vIEZsYWcgZm9yIGRldGVjdGluZyBpbnZhbGlkIHBvc2l0aW9uIHZhbHVlXG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcblxuICAgIC8vIENoZWNrIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHMgYXJlIGFsbCB3aXRoaW4gbWFwXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdIDw9IG1heEJvYXJkWCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV0gPj0gMCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV0gPD0gbWF4Qm9hcmRZXG4gICAgICApIHtcbiAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgYWRkaW5nIGEgc2hpcCBhdCBhIGdpdmVuIGNvb3JkcyBpbiBnaXZlbiBkaXJlY3Rpb24gaWYgc2hpcCB3aWxsIGZpdCBvbiBib2FyZFxuICB0aGlzR2FtZWJvYXJkLmFkZFNoaXAgPSAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbikgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgZGVzaXJlZCBzaGlwXG4gICAgY29uc3QgbmV3U2hpcCA9IFNoaXAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbik7XG4gICAgLy8gQWRkIGl0IHRvIHNoaXBzIGlmIGl0IGhhcyB2YWxpZCBvY2N1cGllZCBjZWxsc1xuICAgIGlmICh2YWxpZGF0ZVNoaXAobmV3U2hpcCkpIHRoaXNHYW1lYm9hcmQuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgfTtcblxuICBjb25zdCBhZGRNaXNzID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgdGhpc0dhbWVib2FyZC5taXNzZXMucHVzaChwb3NpdGlvbik7XG4gIH07XG5cbiAgY29uc3QgYWRkSGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgdGhpc0dhbWVib2FyZC5oaXRzLnB1c2gocG9zaXRpb24pO1xuICB9O1xuXG4gIHRoaXNHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayA9IChwb3NpdGlvbiwgc2hpcHMgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgLy8gVmFsaWRhdGUgcG9zaXRpb24gaXMgMiBpbiBhcnJheSBhbmQgc2hpcHMgaXMgYW4gYXJyYXlcbiAgICBpZiAoXG4gICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHMpXG4gICAgKSB7XG4gICAgICAvLyBFYWNoIHNoaXAgaW4gc2hpcHNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIC8vIElmIHRoZSBzaGlwIGlzIG5vdCBmYWxzeSwgYW5kIG9jY3VwaWVkQ2VsbHMgcHJvcCBleGlzdHMgYW5kIGlzIGFuIGFycmF5XG4gICAgICAgICAgc2hpcHNbaV0gJiZcbiAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzICYmXG4gICAgICAgICAgQXJyYXkuaXNBcnJheShzaGlwc1tpXS5vY2N1cGllZENlbGxzKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBGb3IgZWFjaCBvZiB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwc1swXS5vY2N1cGllZENlbGxzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIC8vIElmIHRoYXQgY2VsbCBtYXRjaGVzIHRoZSBhdHRhY2sgcG9zaXRpb25cbiAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVswXSA9PT0gcG9zaXRpb25bMF0gJiZcbiAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAvLyBDYWxsIHRoYXQgc2hpcHMgaGl0IG1ldGhvZCBhbmQgYnJlYWsgb3V0IG9mIGxvb3BcbiAgICAgICAgICAgICAgc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgIGFkZEhpdChwb3NpdGlvbik7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBhZGRNaXNzKHBvc2l0aW9uKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3Igbm90XG4gIHRoaXNHYW1lYm9hcmQuYWxsU3VuayA9IChzaGlwQXJyYXkgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgaWYgKCFzaGlwQXJyYXkgfHwgIUFycmF5LmlzQXJyYXkoc2hpcEFycmF5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgc2hpcEFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rICYmICFzaGlwLmlzU3VuaygpKSBhbGxTdW5rID0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNHYW1lYm9hcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL0dhbWVib2FyZFwiO1xuXG4vKiBGYWN0b3J5IHRoYXQgY3JlYXRlcyBhbmQgcmV0dXJucyBhIHBsYXllciBvYmplY3QgdGhhdCBjYW4gdGFrZSBhIHNob3QgYXQgb3Bwb25lbnQncyBnYW1lIGJvYXJkICovXG5jb25zdCBQbGF5ZXIgPSAoKSA9PiB7XG4gIGxldCBwcml2YXRlTmFtZSA9IFwiXCI7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSB7XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gcHJpdmF0ZU5hbWU7XG4gICAgfSxcbiAgICBzZXQgbmFtZShuZXdOYW1lKSB7XG4gICAgICBpZiAobmV3TmFtZSkge1xuICAgICAgICBwcml2YXRlTmFtZSA9IG5ld05hbWUudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBwcml2YXRlTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBnYW1lYm9hcmQ6IEdhbWVib2FyZCgpLFxuICAgIHNlbmRBdHRhY2s6IG51bGwsXG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGF0dGFjayBwb3NpdGlvbiBpcyBvbiBib2FyZFxuICBjb25zdCB2YWxpZGF0ZUF0dGFjayA9IChwb3NpdGlvbiwgZ2FtZWJvYXJkKSA9PiB7XG4gICAgLy8gRG9lcyBnYW1lYm9hcmQgZXhpc3Qgd2l0aCBtYXhCb2FyZFgveSBwcm9wZXJ0aWVzP1xuICAgIGlmICghZ2FtZWJvYXJkIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRYIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRZKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIElzIHBvc2l0aW9uIGNvbnN0cmFpbmVkIHRvIG1heGJvYXJkWC9ZIGFuZCBib3RoIGFyZSBpbnRzIGluIGFuIGFycmF5P1xuICAgIGlmIChcbiAgICAgIHBvc2l0aW9uICYmXG4gICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgIHBvc2l0aW9uWzBdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzBdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFggJiZcbiAgICAgIHBvc2l0aW9uWzFdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzFdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBzZW5kaW5nIGF0dGFjayB0byByaXZhbCBnYW1lYm9hcmRcbiAgdGhpc1BsYXllci5zZW5kQXR0YWNrID0gKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCA9IHRoaXNQbGF5ZXIuZ2FtZWJvYXJkKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRlQXR0YWNrKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCkpIHtcbiAgICAgIHBsYXllckJvYXJkLnJpdmFsQm9hcmQucmVjZWl2ZUF0dGFjayhwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB0aGlzUGxheWVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gQ29udGFpbnMgdGhlIG5hbWVzIGZvciB0aGUgc2hpcHMgYmFzZWQgb24gaW5kZXhcbmNvbnN0IHNoaXBOYW1lcyA9IHtcbiAgMTogXCJTZW50aW5lbCBQcm9iZVwiLFxuICAyOiBcIkFzc2F1bHQgVGl0YW5cIixcbiAgMzogXCJWaXBlciBNZWNoXCIsXG4gIDQ6IFwiSXJvbiBHb2xpYXRoXCIsXG4gIDU6IFwiTGV2aWF0aGFuXCIsXG59O1xuXG4vLyBGYWN0b3J5IHRoYXQgY2FuIGNyZWF0ZSBhbmQgcmV0dXJuIG9uZSBvZiBhIHZhcmlldHkgb2YgcHJlLWRldGVybWluZWQgc2hpcHMuXG5jb25zdCBTaGlwID0gKGluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKSA9PiB7XG4gIC8vIFZhbGlkYXRlIGluZGV4XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPiA1IHx8IGluZGV4IDwgMSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAvLyBDcmVhdGUgdGhlIHNoaXAgb2JqZWN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZFxuICBjb25zdCB0aGlzU2hpcCA9IHtcbiAgICBpbmRleCxcbiAgICBzaXplOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgaGl0czogMCxcbiAgICBoaXQ6IG51bGwsXG4gICAgaXNTdW5rOiBudWxsLFxuICAgIG9jY3VwaWVkQ2VsbHM6IFtdLFxuICB9O1xuXG4gIC8vIFNldCBzaGlwIHNpemVcbiAgc3dpdGNoIChpbmRleCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IGluZGV4O1xuICB9XG5cbiAgLy8gU2V0IHNoaXAgbmFtZSBiYXNlZCBvbiBpbmRleFxuICB0aGlzU2hpcC50eXBlID0gc2hpcE5hbWVzW3RoaXNTaGlwLmluZGV4XTtcblxuICAvLyBBZGRzIGEgaGl0IHRvIHRoZSBzaGlwXG4gIHRoaXNTaGlwLmhpdCA9ICgpID0+IHtcbiAgICB0aGlzU2hpcC5oaXRzICs9IDE7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lcyBpZiBzaGlwIHN1bmsgaXMgdHJ1ZVxuICB0aGlzU2hpcC5pc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXNTaGlwLmhpdHMgPj0gdGhpc1NoaXAuc2l6ZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIFR1cm4gZGlyZWN0aW9uIGludG8gaXRlcmF0b3JcbiAgY29uc3QgZGlyZWN0aW9uSXRlcmF0b3IgPSB7XG4gICAgTjogWzAsIC0xXSxcbiAgICBTOiBbMCwgMV0sXG4gICAgRTogWzEsIDBdLFxuICAgIFc6IFstMSwgMF0sXG4gIH07XG5cbiAgLy8gVXNlIHBvc2l0aW9uIGFuZCBkaXJlY3Rpb24gdG8gYWRkIG9jY3VwaWVkIGNlbGxzIGNvb3Jkc1xuICBpZiAoXG4gICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgT2JqZWN0LmtleXMoZGlyZWN0aW9uSXRlcmF0b3IpLmluY2x1ZGVzKGRpcmVjdGlvbilcbiAgKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzU2hpcC5zaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gKyBpICogZGlyZWN0aW9uSXRlcmF0b3JbZGlyZWN0aW9uXVswXSxcbiAgICAgICAgcG9zaXRpb25bMV0gKyBpICogZGlyZWN0aW9uSXRlcmF0b3JbZGlyZWN0aW9uXVsxXSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1NoaXA7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImZ1bmN0aW9uIGNyZWF0ZUdyaWRDYW52YXMoc2l6ZVgsIHNpemVZKSB7XG4gIC8vICNyZWdpb24gQ3JlYXRlIHRoZSBjYW52YXMgZWxlbWVudCBhbmQgZHJhdyBncmlkXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhcy53aWR0aCA9IHNpemVYO1xuICBjYW52YXMuaGVpZ2h0ID0gc2l6ZVk7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gU2V0IHRyYW5zcGFyZW50IGJhY2tncm91bmRcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBzaXplWCwgc2l6ZVkpO1xuXG4gIC8vIERyYXcgZ3JpZCBsaW5lc1xuICBjb25zdCBncmlkU2l6ZSA9IE1hdGgubWluKHNpemVYLCBzaXplWSkgLyAxMDtcbiAgY29uc3QgbGluZUNvbG9yID0gXCJibGFja1wiO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lQ29sb3I7XG4gIGN0eC5saW5lV2lkdGggPSAxO1xuXG4gIC8vIERyYXcgdmVydGljYWwgbGluZXNcbiAgZm9yIChsZXQgeCA9IDA7IHggPD0gc2l6ZVg7IHggKz0gZ3JpZFNpemUpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4LCAwKTtcbiAgICBjdHgubGluZVRvKHgsIHNpemVZKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvLyBEcmF3IGhvcml6b250YWwgbGluZXNcbiAgZm9yIChsZXQgeSA9IDA7IHkgPD0gc2l6ZVk7IHkgKz0gZ3JpZFNpemUpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCB5KTtcbiAgICBjdHgubGluZVRvKHNpemVYLCB5KTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBZGQgZXZlbnQgaGFuZGxlcnMgZm9yIGNsaWNrcywgbW91c2Vtb3ZlLCBhbmQgbW91c2VsZWF2ZVxuICAvLyBTZXQgdGhlIGNlbGwgc2l6ZSByZWZzXG4gIGNvbnN0IGNlbGxTaXplWCA9IGNhbnZhcy53aWR0aCAvIDEwOyAvLyBXaWR0aCBvZiBlYWNoIGNlbGxcbiAgY29uc3QgY2VsbFNpemVZID0gY2FudmFzLmhlaWdodCAvIDEwOyAvLyBIZWlnaHQgb2YgZWFjaCBjZWxsXG5cbiAgLy8gQWRkIGFuZCBoYW5kbGUgZXZlbnQgZm9yIGNhbnZhcyBjbGlja3NcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgY29uc3QgY2xpY2tlZENlbGxYID0gTWF0aC5mbG9vcihtb3VzZVggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGNsaWNrZWRDZWxsWSA9IE1hdGguZmxvb3IobW91c2VZIC8gY2VsbFNpemVZKTtcblxuICAgIGNvbnNvbGUubG9nKGB4OiAke2NsaWNrZWRDZWxsWH0sIHk6ICR7Y2xpY2tlZENlbGxZfWApO1xuICB9O1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKTtcblxuICAvLyBBZGQgYW5kIGhhbmRsZSBldmVudCBmb3IgbW91c2Vtb3ZlXG4gIGNvbnN0IGhhbmRsZU1vdXNlbW92ZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCBob3ZlcmVkQ2VsbFggPSBNYXRoLmZsb29yKG1vdXNlWCAvIGNlbGxTaXplWCk7XG4gICAgY29uc3QgaG92ZXJlZENlbGxZID0gTWF0aC5mbG9vcihtb3VzZVkgLyBjZWxsU2l6ZVkpO1xuXG4gICAgLy8gQXBwbHkgaG92ZXIgZWZmZWN0IHRvIHRoZSBob3ZlcmVkIGNlbGxcbiAgICAvLyBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7IC8vIENsZWFyIHRoZSBjYW52YXNcblxuICAgIC8vIERyYXcgdGhlIGdyaWRcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4ICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7IHkgKz0gMSkge1xuICAgICAgICBjb25zdCBjZWxsWCA9IHggKiBjZWxsU2l6ZVg7XG4gICAgICAgIGNvbnN0IGNlbGxZID0geSAqIGNlbGxTaXplWTtcblxuICAgICAgICBpZiAoeCA9PT0gaG92ZXJlZENlbGxYICYmIHkgPT09IGhvdmVyZWRDZWxsWSkge1xuICAgICAgICAgIC8vIEFwcGx5IGhvdmVyIGVmZmVjdCB0byB0aGUgaG92ZXJlZCBjZWxsXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JheVwiOyAvLyBTZXQgYSBkaWZmZXJlbnQgY29sb3IgZm9yIHRoZSBob3ZlcmVkIGNlbGxcbiAgICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRHJhdyB0aGUgcmVndWxhciBjZWxsc1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImxpZ2h0Z3JheVwiOyAvLyBTZXQgdGhlIGNvbG9yIGZvciByZWd1bGFyIGNlbGxzXG4gICAgICAgICAgY3R4LmZpbGxSZWN0KGNlbGxYLCBjZWxsWSwgY2VsbFNpemVYLCBjZWxsU2l6ZVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBoYW5kbGVNb3VzZW1vdmUpO1xuXG4gIC8vIEFkZCBhbmQgaGFuZGxlIGV2ZW50IGZvciBtb3VzZWxlYXZlXG4gIGNvbnN0IGhhbmRsZU1vdXNlbGVhdmUgPSAoKSA9PiB7XG4gICAgLy8gY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpOyAvLyBDbGVhciB0aGUgY2FudmFzXG5cbiAgICAvLyBEcmF3IHRoZSBncmlkXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5ICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2VsbFggPSB4ICogY2VsbFNpemVYO1xuICAgICAgICBjb25zdCBjZWxsWSA9IHkgKiBjZWxsU2l6ZVk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJsaWdodGdyYXlcIjsgLy8gU2V0IHRoZSBjb2xvciBmb3IgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG5cbiAgICAgICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgaGFuZGxlTW91c2VsZWF2ZSk7XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQWRkIGV2ZW50IGhhbmRsZXJzIGZvciB0b3VjaCBzdGFydCBhbmQgdG91Y2ggZW5kXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjbGVhciB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIGdyaWRcbiAgY29uc3QgY2xlYXJDYW52YXMgPSAoKSA9PiB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpOyAvLyBDbGVhciB0aGUgY2FudmFzXG5cbiAgICAvLyBEcmF3IHRoZSBncmlkXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5ICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2VsbFggPSB4ICogY2VsbFNpemVYO1xuICAgICAgICBjb25zdCBjZWxsWSA9IHkgKiBjZWxsU2l6ZVk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJsaWdodGdyYXlcIjsgLy8gU2V0IHRoZSBjb2xvciBmb3IgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG5cbiAgICAgICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBoYW5kbGUgaG92ZXIgZWZmZWN0XG4gIGNvbnN0IGhhbmRsZUhvdmVyID0gKHgsIHkpID0+IHtcbiAgICBjb25zdCBob3ZlcmVkQ2VsbFggPSBNYXRoLmZsb29yKHggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGhvdmVyZWRDZWxsWSA9IE1hdGguZmxvb3IoeSAvIGNlbGxTaXplWSk7XG5cbiAgICBjbGVhckNhbnZhcygpO1xuXG4gICAgLy8gRHJhdyB0aGUgZ3JpZFxuICAgIGZvciAobGV0IGEgPSAwOyBhIDwgMTA7IGEgKz0gMSkge1xuICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCAxMDsgYiArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbGxYID0gYSAqIGNlbGxTaXplWDtcbiAgICAgICAgY29uc3QgY2VsbFkgPSBiICogY2VsbFNpemVZO1xuXG4gICAgICAgIGlmIChhID09PSBob3ZlcmVkQ2VsbFggJiYgYiA9PT0gaG92ZXJlZENlbGxZKSB7XG4gICAgICAgICAgLy8gQXBwbHkgaG92ZXIgZWZmZWN0IHRvIHRoZSBob3ZlcmVkIGNlbGxcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJncmF5XCI7IC8vIFNldCBhIGRpZmZlcmVudCBjb2xvciBmb3IgdGhlIGhvdmVyZWQgY2VsbFxuICAgICAgICAgIGN0eC5maWxsUmVjdChjZWxsWCwgY2VsbFksIGNlbGxTaXplWCwgY2VsbFNpemVZKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBEcmF3IHRoZSByZWd1bGFyIGNlbGxzXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwibGlnaHRncmF5XCI7IC8vIFNldCB0aGUgY29sb3IgZm9yIHJlZ3VsYXIgY2VsbHNcbiAgICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEcmF3IGdyaWQgbGluZXNcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICBjdHguc3Ryb2tlUmVjdChjZWxsWCwgY2VsbFksIGNlbGxTaXplWCwgY2VsbFNpemVZKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gQWRkIGFuZCBoYW5kbGUgZXZlbnQgZm9yIHRvdWNoc3RhcnRcbiAgY29uc3QgaGFuZGxlVG91Y2hzdGFydCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuICAgIGNvbnN0IHRvdWNoID0gdG91Y2hlc1swXTtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRvdWNoWCA9IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgdG91Y2hZID0gdG91Y2guY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgaGFuZGxlSG92ZXIodG91Y2hYLCB0b3VjaFkpO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVUb3VjaHN0YXJ0LCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gIC8vIEFkZCBhbmQgaGFuZGxlIGV2ZW50IGZvciB0b3VjaG1vdmVcbiAgY29uc3QgaGFuZGxlVG91Y2htb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXM7XG4gICAgY29uc3QgdG91Y2ggPSB0b3VjaGVzWzBdO1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdG91Y2hYID0gdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCB0b3VjaFkgPSB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBoYW5kbGVIb3Zlcih0b3VjaFgsIHRvdWNoWSk7XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlVG91Y2htb3ZlLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gIC8vIEFkZCBhbmQgaGFuZGxlIGV2ZW50IGZvciB0b3VjaGVuZCBhbmQgdG91Y2hjYW5jZWxcbiAgY29uc3QgaGFuZGxlVG91Y2hlbmQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcbiAgICBjb25zdCB0b3VjaCA9IHRvdWNoZXNbMF07XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b3VjaFggPSB0b3VjaC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHRvdWNoWSA9IHRvdWNoLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIC8vIENoZWNrIGlmIHRvdWNoIGlzIHdpdGhpbiB0aGUgY2FudmFzIGJvdW5kYXJpZXNcbiAgICBpZiAoXG4gICAgICB0b3VjaFggPj0gMCAmJlxuICAgICAgdG91Y2hYIDwgY2FudmFzLndpZHRoICYmXG4gICAgICB0b3VjaFkgPj0gMCAmJlxuICAgICAgdG91Y2hZIDwgY2FudmFzLmhlaWdodFxuICAgICkge1xuICAgICAgY29uc3QgZW5kZWRDZWxsWCA9IE1hdGguZmxvb3IodG91Y2hYIC8gY2VsbFNpemVYKTtcbiAgICAgIGNvbnN0IGVuZGVkQ2VsbFkgPSBNYXRoLmZsb29yKHRvdWNoWSAvIGNlbGxTaXplWSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKGB4OiAke2VuZGVkQ2VsbFh9LCB5OiAke2VuZGVkQ2VsbFl9YCk7XG4gICAgfVxuICAgIGNsZWFyQ2FudmFzKCk7XG4gIH07XG4gIGNvbnN0IGhhbmRsZVRvdWNoY2FuY2VsID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhckNhbnZhcygpO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlVG91Y2hlbmQsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBoYW5kbGVUb3VjaGNhbmNlbCwge1xuICAgIHBhc3NpdmU6IGZhbHNlLFxuICB9KTtcbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNlbmRyZWdpb25cblxuICByZXR1cm4gY2FudmFzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVHcmlkQ2FudmFzO1xuIiwiaW1wb3J0IGdyaWRDYW52YXMgZnJvbSBcIi4uL2hlbHBlcnMvZ3JpZENhbnZhc1wiO1xuXG4vKiBUaGlzIG1vZHVsZSBjcmVhdGVzIGNhbnZhcyBlbGVtZW50cyBhbmQgYWRkcyB0aGVtIHRvIHRoZSBhcHByb3ByaWF0ZSBcbiAgIHBsYWNlcyBpbiB0aGUgRE9NLiAqL1xuY29uc3QgY2FudmFzTWFuYWdlciA9ICgoKSA9PiB7XG4gIC8vIFJlcGxhY2UgdGhlIHRocmVlIGdyaWQgcGxhY2Vob2xkZXIgZWxlbWVudHMgd2l0aCB0aGUgcHJvcGVyIGNhbnZhc2VzXG4gIC8vIFJlZnMgdG8gRE9NIGVsZW1lbnRzXG4gIGNvbnN0IHBsYWNlbWVudFBIID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtY2FudmFzLXBoXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgc2hpcCBwbGFjZW1lbnQgY2FudmFzXG4gIGNvbnN0IHBsYWNlbWVudENhbnZhcyA9IGdyaWRDYW52YXMoMzAwLCAzMDApO1xuXG4gIC8vIFJlcGxhY2UgdGhlIHBsYWNlIGhvbGRlcnNcbiAgcGxhY2VtZW50UEgucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocGxhY2VtZW50Q2FudmFzLCBwbGFjZW1lbnRQSCk7XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBjYW52YXNNYW5hZ2VyO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vZmFjdG9yaWVzL1BsYXllclwiO1xuXG4vKiBUaGlzIG1vZHVsZSBob2xkcyB0aGUgZ2FtZSBsb29wIGxvZ2ljIGZvciBzdGFydGluZyBnYW1lcywgY3JlYXRpbmdcbiAgIHJlcXVpcmVkIG9iamVjdHMsIGl0ZXJhdGluZyB0aHJvdWdoIHR1cm5zLCByZXBvcnRpbmcgZ2FtZSBvdXRjb21lIHdoZW5cbiAgIGEgcGxheWVyIGxvc2VzLCBhbmQgcmVzdGFydCB0aGUgZ2FtZSAqL1xuY29uc3QgZ2FtZU1hbmFnZXIgPSAoKCkgPT4ge1xuICAvLyBJbml0aWFsaXphdGlvbiBvZiBQbGF5ZXIgb2JqZWN0cyBmb3IgdXNlciBhbmQgQUlcbiAgY29uc3QgdXNlclBsYXllciA9IFBsYXllcigpO1xuICBjb25zdCBhaVBsYXllciA9IFBsYXllcigpO1xuICB1c2VyUGxheWVyLmdhbWVib2FyZC5yaXZhbEJvYXJkID0gYWlQbGF5ZXIuZ2FtZWJvYXJkO1xuICBhaVBsYXllci5nYW1lYm9hcmQucml2YWxCb2FyZCA9IHVzZXJQbGF5ZXIuZ2FtZWJvYXJkO1xuICAvLyBTdGFydCBhIGdhbWVcbiAgLyogLUhhdmUgdXNlciBhZGQgc2hpcHMgLSBtZXRob2Qgb24gaW50ZXJmYWNlIG1vZHVsZSBcbiAgXG4gICAgIC1IYXZlIEFJIGFkZCBzaGlwcyAtIE5lZWQgYSBtb2R1bGUgdGhhdCBhdXRvbWF0aWNhbGx5IGFkZHMgc2hpcHNcbiAgICAgdG8gdGhlIGFpIGdhbWVib2FyZC4gSXQgd2lsbCBuZWVkIHRvIGFkZCB0aGVtIG9uZSBhdCBhIHRpbWUgYmFzZWQgb24gYSBcbiAgICAgdmFyaWFibGUgcnVsZXNldCB0aGF0IHdpbGwgY3JlYXRlIGEgYm9yZCBmb3IgYSBnaXZlbiBoaWdoLWxldmVsIFwiZGlmaWN1bHR5XCIgc2V0dGluZyAqL1xuXG4gIC8qIE1ldGhvZCB0byBkZXRlcm1pbmUgaWYgZ2FtZSBpcyBvdmVyIGFmdGVyIGV2ZXJ5IHR1cm4uIENoZWNrcyBhbGxTdW5rIG9uIHJpdmFsIGdhbWVib2FyZCBcbiAgICAgYW5kIHJldHVybnMgdHJ1ZSBvciBmYWxzZSAqL1xuXG4gIC8qIE1ldGhvZCB0aGF0IGZsaXBzIGEgdmlydHVhbCBjb2luIHRvIGRldGVybWluZSB3aG8gZ29lcyBmaXJzdCwgYW5kIHNldHMgdGhhdFxuICAgICBwbGF5ZXIgb2JqZWN0IHRvIGFuIGFjdGl2ZSBwbGF5ZXIgdmFyaWFibGUgKi9cblxuICAvLyBNZXRob2QgZm9yIGVuZGluZyB0aGUgZ2FtZSBieSByZXBvcnRpbmcgcmVzdWx0c1xuXG4gIC8vIE1ldGhvZCBmb3IgcmVzdGFydGluZyB0aGUgZ2FtZVxuXG4gIC8qIEl0ZXJhdGUgYmV0d2VlbiBwbGF5ZXJzIGZvciBhdHRhY2tzIC0gaWYgYWJvdmUgbWV0aG9kIGRvZXNuJ3QgcmV0dXJuIHRydWUsIGNoZWNrIHRoZVxuICAgICBhY3RpdmUgcGxheWVyIGFuZCBxdWVyeSB0aGVtIGZvciB0aGVpciBtb3ZlLiBJZiBhYm92ZSBtZXRob2QgaXMgdHJ1ZSwgY2FsbCBtZXRob2RcbiAgICAgZm9yIGVuZGluZyB0aGUgZ2FtZSwgdGhlbiBtZXRob2QgZm9yIHJlc3RhcnRpbmcgdGhlIGdhbWUuXG4gICAgIFxuICAgICAtRm9yIHVzZXIgLSBzZXQgYSBvbmUgdGltZSBldmVudCB0cmlnZ2VyIGZvciB1c2VyIGNsaWNraW5nIG9uIHZhbGlkIGF0dGFjayBwb3NpdGlvbiBkaXZcbiAgICAgb24gdGhlIHdlYiBpbnRlcmZhY2UuIEl0IHdpbGwgdXNlIGdhbWVib2FyZC5yaXZhbEJvYXJkLnJlY2VpdmVBdHRhY2sgYW5kIGluZm8gZnJvbSB0aGUgZGl2XG4gICAgIGh0bWwgZGF0YSB0byBoYXZlIHRoZSBib2FyZCBhdHRlbXB0IHRoZSBhdHRhY2suIElmIHRoZSBhdHRhY2sgaXMgdHJ1ZSBvciBmYWxzZSB0aGVuIGEgdmFsaWRcbiAgICAgaGl0IG9yIHZhbGlkIG1pc3Mgb2NjdXJyZWQuIElmIHVuZGVmaW5lZCB0aGVuIGFuIGludmFsaWQgYXR0YWNrIHdhcyBtYWRlLCB0eXBpY2FsbHkgbWVhbmluZ1xuICAgICBhdHRhY2tpbmcgYSBjZWxsIHRoYXQgaGFzIGFscmVhZHkgaGFkIGEgaGl0IG9yIG1pc3Mgb2NjdXIgaW4gaXQuIElmIHRoZSBhdHRhY2sgaXMgaW52YWxpZCBcbiAgICAgdGhlbiByZXNldCB0aGUgdHJpZ2dlci4gQWZ0ZXIgYSBzdWNjZXNzZnVsIGF0dGFjayAodHJ1ZSBvciBmYWxzZSByZXR1cm5lZCkgdGhlbiBzZXQgdGhlIFxuICAgICBhY3RpdmUgcGxheWVyIHRvIHRoZSBBSSBhbmQgbG9vcFxuXG4gICAgIC1Gb3IgQUkgdXNlIEFJIG1vZHVsZSdzIHF1ZXJ5IG1ldGhvZCBhbmQgcGFzcyBpbiByZWxldmFudCBwYXJhbWV0ZXJzLiBBSSBtb2R1bGUgZG9lcyBpdHNcbiAgICAgbWFnaWMgYW5kIHJldHVybnMgYSBwb3NpdGlvbi4gVGhlbiB1c2UgZ2FtZWJvYXJkLnJpdmFsYm9hcmQucmVjZWl2ZWRBdHRhY2sgdG8gbWFrZSBhbmQgXG4gICAgIGNvbmZpcm0gdGhlIGF0dGFjayBzaW1pbGFyIHRvIHRoZSB1c2VycyBhdHRhY2tzICovXG5cbiAgLy8gVGhlIGxvZ2ljIG9mIHRoZSBnYW1lIG1hbmFnZXIgYW5kIGhvdyB0aGUgd2ViIGludGVyZmFjZSByZXNwb25kcyB0byBpdCB3aWxsIHJlbWFpblxuICAvLyBzZXBhcmF0ZWQgYnkgdXNpbmcgYSBwdWJzdWIgbW9kdWxlXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTWFuYWdlcjtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmV5O1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsMkJBQTJCO0FBQzdCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJvZHkge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmV5O1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5pbXBvcnQgZ2FtZU1hbmFnZXIgZnJvbSBcIi4vbW9kdWxlcy9nYW1lTWFuYWdlclwiO1xuaW1wb3J0IGNhbnZhc01hbmFnZXIgZnJvbSBcIi4vbW9kdWxlcy9jYW52YXNNYW5hZ2VyXCI7XG4iXSwibmFtZXMiOlsiU2hpcCIsIkdhbWVib2FyZCIsIm1heEJvYXJkWCIsIm1heEJvYXJkWSIsInRoaXNHYW1lYm9hcmQiLCJzaGlwcyIsImFkZFNoaXAiLCJyZWNlaXZlQXR0YWNrIiwibWlzc2VzIiwiaGl0cyIsImFsbFN1bmsiLCJyaXZhbEJvYXJkIiwidmFsaWRhdGVTaGlwIiwic2hpcCIsImlzVmFsaWQiLCJpIiwib2NjdXBpZWRDZWxscyIsImxlbmd0aCIsInNoaXBUeXBlSW5kZXgiLCJwb3NpdGlvbiIsImRpcmVjdGlvbiIsIm5ld1NoaXAiLCJwdXNoIiwiYWRkTWlzcyIsImFkZEhpdCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsIk51bWJlciIsImlzSW50ZWdlciIsImoiLCJoaXQiLCJzaGlwQXJyYXkiLCJmb3JFYWNoIiwiaXNTdW5rIiwiUGxheWVyIiwicHJpdmF0ZU5hbWUiLCJ0aGlzUGxheWVyIiwibmFtZSIsIm5ld05hbWUiLCJ0b1N0cmluZyIsImdhbWVib2FyZCIsInNlbmRBdHRhY2siLCJ2YWxpZGF0ZUF0dGFjayIsInBsYXllckJvYXJkIiwic2hpcE5hbWVzIiwiaW5kZXgiLCJ0aGlzU2hpcCIsInNpemUiLCJ0eXBlIiwiZGlyZWN0aW9uSXRlcmF0b3IiLCJOIiwiUyIsIkUiLCJXIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwibmV3Q29vcmRzIiwiY3JlYXRlR3JpZENhbnZhcyIsInNpemVYIiwic2l6ZVkiLCJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ3aWR0aCIsImhlaWdodCIsImN0eCIsImdldENvbnRleHQiLCJjbGVhclJlY3QiLCJncmlkU2l6ZSIsIk1hdGgiLCJtaW4iLCJsaW5lQ29sb3IiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIngiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJ5IiwiY2VsbFNpemVYIiwiY2VsbFNpemVZIiwiaGFuZGxlQ2xpY2siLCJldmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJtb3VzZVgiLCJjbGllbnRYIiwibGVmdCIsIm1vdXNlWSIsImNsaWVudFkiLCJ0b3AiLCJjbGlja2VkQ2VsbFgiLCJmbG9vciIsImNsaWNrZWRDZWxsWSIsImNvbnNvbGUiLCJsb2ciLCJjb25jYXQiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlTW91c2Vtb3ZlIiwiaG92ZXJlZENlbGxYIiwiaG92ZXJlZENlbGxZIiwiY2VsbFgiLCJjZWxsWSIsImZpbGxTdHlsZSIsImZpbGxSZWN0Iiwic3Ryb2tlUmVjdCIsImhhbmRsZU1vdXNlbGVhdmUiLCJjbGVhckNhbnZhcyIsImhhbmRsZUhvdmVyIiwiYSIsImIiLCJoYW5kbGVUb3VjaHN0YXJ0IiwicHJldmVudERlZmF1bHQiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJ0b3VjaCIsInRvdWNoWCIsInRvdWNoWSIsInBhc3NpdmUiLCJoYW5kbGVUb3VjaG1vdmUiLCJoYW5kbGVUb3VjaGVuZCIsImVuZGVkQ2VsbFgiLCJlbmRlZENlbGxZIiwiaGFuZGxlVG91Y2hjYW5jZWwiLCJncmlkQ2FudmFzIiwiY2FudmFzTWFuYWdlciIsInBsYWNlbWVudFBIIiwicXVlcnlTZWxlY3RvciIsInBsYWNlbWVudENhbnZhcyIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJnYW1lTWFuYWdlciIsInVzZXJQbGF5ZXIiLCJhaVBsYXllciJdLCJzb3VyY2VSb290IjoiIn0=