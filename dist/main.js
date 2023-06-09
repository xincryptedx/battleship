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
/* harmony import */ var _modules_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/events */ "./src/modules/events.js");

/* Events pubbed:
    placementClicked
*/

var createGridCanvas = function createGridCanvas(sizeX, sizeY) {
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
    _modules_events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("placementClicked", {
      position: [clickedCellX, clickedCellY]
    });
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
};
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

/***/ "./src/modules/events.js":
/*!*******************************!*\
  !*** ./src/modules/events.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var eventsManager = function () {
  var events = {};
  return {
    emit: function emit(eventName, payload) {
      if (events[eventName]) {
        events[eventName].forEach(function (fn) {
          return fn(payload);
        });
      }
      return this;
    },
    on: function on(eventName, callbackFn) {
      if (typeof callbackFn !== "function") {
        throw new TypeError("Expected a function");
      }
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName].push(callbackFn);
      return this;
    },
    once: function once(eventName, callbackFn) {
      var _this = this;
      var fn = function fn() {
        _this.off(eventName, fn);
        callbackFn.apply(void 0, arguments);
      };
      return this.on(eventName, fn);
    },
    off: function off(eventName, callbackFn) {
      if (events[eventName]) {
        for (var i = 0; i < events[eventName].length; i += 1) {
          if (events[eventName][i] === callbackFn) {
            events[eventName].splice(i, 1);
            break;
          }
        }
      }
      return this;
    },
    offAll: function offAll() {
      Object.keys(events).forEach(function (eventName) {
        delete events[eventName];
      });
      return this;
    }
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (eventsManager);

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
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/modules/events.js");


/*  Events subbed:
      tryPlacement
*/

/* This module holds the game loop logic for starting games, creating
   required objects, iterating through turns, reporting game outcome when
   a player loses, and restart the game */
var gameManager = function gameManager() {
  // Initialization of Player objects for user and AI
  var userPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  var aiPlayer = (0,_factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  userPlayer.gameboard.rivalBoard = aiPlayer.gameboard;
  aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;

  // Have the user's gameboard listen for tryPlacement events
  _events__WEBPACK_IMPORTED_MODULE_1__["default"].on("tryPlacement", userPlayer.gameboard.addShip());

  // Have AI place their ships
  /* Need a module that automatically adds ships
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
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/modules/events.js");

/* Events subbed: 
    hideAll showMenu  showPlacement
    showGame  shrinkTitle startClicked
    rotateClicked placementClicked

   Events pubbed:
    tryPlacement
*/

/* This module has three primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
var webInterface = function webInterface() {
  // References to main elements
  var title = document.querySelector(".title");
  var menu = document.querySelector(".menu");
  var placement = document.querySelector(".placement");
  var game = document.querySelector(".game");

  // Reference to current direction for placing ships and to object for turning it into string
  var placementDirection = 0;
  var directions = {
    0: "N",
    1: "E",
    2: "S",
    3: "W"
  };
  // Method for iterating through directions
  var rotateDirection = function rotateDirection() {
    placementDirection = (placementDirection + 1) % 4;
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

  // Handle clicks on the rotate button in the placement section
  var handleRotateClick = function handleRotateClick() {
    rotateDirection();
  };

  // Handle clicks on the ship placement grid by using payload.position
  var handlePlacementClick = function handlePlacementClick(payload) {
    // Send an event trying to place the ship
    _events__WEBPACK_IMPORTED_MODULE_0__["default"].emit("tryPlacement", {
      position: payload.position,
      direction: directions[placementDirection]
    });
  };

  // Handle clicks on the enemy
  var handleAttackClick = function handleAttackClick() {
    // Send event that will attempt to send an attack based on clicked cell
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Sub to event listeners
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("hideAll", hideAll);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("showMenu", showMenu);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("showPlacement", showPlacement);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("showGame", showGame);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("shrinkTitle", shrinkTitle);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("rotateClicked", handleRotateClick);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("startClicked", handleStartClick);
  _events__WEBPACK_IMPORTED_MODULE_0__["default"].on("placementClicked", handlePlacementClick);
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
  --bg-color: hsl(0, 0%, 22%);
  --text-color: hsl(0, 0%, 77%);
  --link-color: hsl(98, 72%, 59%);
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

  transition: transform 0.8s ease-in-out;

  background-color: hsla(165, 72%, 59%, 0.5);
}

.title.shrink {
  transform: scale(0.5) translateY(-50%);
}
/* #region menu section */
.menu {
  grid-column: 3 / 19;
  grid-row: 8 / 18;

  transition: transform 0.3s ease-in-out;

  background-color: hsla(300, 72%, 59%, 0.5);
}

.menu.hidden {
  transform: translateX(-150%);
}
/* #endregion */

/* #region placement section */
.placement {
  grid-column: 3 / 19;
  grid-row: 6 / 20;

  transition: transform 0.3s ease-in-out;

  background-color: hsla(276, 72%, 59%, 0.5);
}

.placement.hidden {
  transform: translateY(150%);
}
/* #endregion */

/* #region game section */
.game {
  grid-column: 2 / 20;
  grid-row: 5 / 20;

  transition: transform 0.3s ease-in-out;

  background-color: hsla(106, 100%, 51%, 0.5);
}

.game.hidden {
  transform: translateX(150%);
}
/* #endregion */

/* #endregion */
`, "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"AAAA,gBAAgB;AAChB;EACE,2BAA2B;EAC3B,6BAA6B;EAC7B,+BAA+B;AACjC;;AAEA,oCAAoC;AACpC;EACE,wBAAwB;AAC1B;;AAEA;EACE,iCAAiC;EACjC,wBAAwB;EACxB,aAAa;EACb,YAAY;EACZ,gBAAgB;AAClB;;AAEA,eAAe;;AAEf,yBAAyB;AACzB;EACE,aAAa;EACb,8CAA8C;EAC9C,kBAAkB;;EAElB,YAAY;EACZ,WAAW;AACb;;AAEA,eAAe;AACf;EACE,mBAAmB;EACnB,eAAe;;EAEf,sCAAsC;;EAEtC,0CAA0C;AAC5C;;AAEA;EACE,sCAAsC;AACxC;AACA,yBAAyB;AACzB;EACE,mBAAmB;EACnB,gBAAgB;;EAEhB,sCAAsC;;EAEtC,0CAA0C;AAC5C;;AAEA;EACE,4BAA4B;AAC9B;AACA,eAAe;;AAEf,8BAA8B;AAC9B;EACE,mBAAmB;EACnB,gBAAgB;;EAEhB,sCAAsC;;EAEtC,0CAA0C;AAC5C;;AAEA;EACE,2BAA2B;AAC7B;AACA,eAAe;;AAEf,yBAAyB;AACzB;EACE,mBAAmB;EACnB,gBAAgB;;EAEhB,sCAAsC;;EAEtC,2CAA2C;AAC7C;;AAEA;EACE,2BAA2B;AAC7B;AACA,eAAe;;AAEf,eAAe","sourcesContent":["/* Color Rules */\n:root {\n  --bg-color: hsl(0, 0%, 22%);\n  --text-color: hsl(0, 0%, 77%);\n  --link-color: hsl(98, 72%, 59%);\n}\n\n/* #region Universal element rules */\na {\n  color: var(--link-color);\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n}\n\n/* #endregion */\n\n/* #region main-content */\n.main-content {\n  display: grid;\n  grid-template: repeat(20, 5%) / repeat(20, 5%);\n  position: relative;\n\n  height: 100%;\n  width: 100%;\n}\n\n/* title grid */\n.title {\n  grid-column: 3 / 19;\n  grid-row: 2 / 6;\n\n  transition: transform 0.8s ease-in-out;\n\n  background-color: hsla(165, 72%, 59%, 0.5);\n}\n\n.title.shrink {\n  transform: scale(0.5) translateY(-50%);\n}\n/* #region menu section */\n.menu {\n  grid-column: 3 / 19;\n  grid-row: 8 / 18;\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: hsla(300, 72%, 59%, 0.5);\n}\n\n.menu.hidden {\n  transform: translateX(-150%);\n}\n/* #endregion */\n\n/* #region placement section */\n.placement {\n  grid-column: 3 / 19;\n  grid-row: 6 / 20;\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: hsla(276, 72%, 59%, 0.5);\n}\n\n.placement.hidden {\n  transform: translateY(150%);\n}\n/* #endregion */\n\n/* #region game section */\n.game {\n  grid-column: 2 / 20;\n  grid-row: 5 / 20;\n\n  transition: transform 0.3s ease-in-out;\n\n  background-color: hsla(106, 100%, 51%, 0.5);\n}\n\n.game.hidden {\n  transform: translateX(150%);\n}\n/* #endregion */\n\n/* #endregion */\n"],"sourceRoot":""}]);
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
/* harmony import */ var _modules_canvasManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/canvasManager */ "./src/modules/canvasManager.js");
/* harmony import */ var _modules_webInterface__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/webInterface */ "./src/modules/webInterface.js");
/* harmony import */ var _modules_events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/events */ "./src/modules/events.js");
/* eslint-disable no-unused-vars */






// import events for testing in dev tools

window.events = _modules_events__WEBPACK_IMPORTED_MODULE_5__["default"];

// Initialize modules
(0,_modules_webInterface__WEBPACK_IMPORTED_MODULE_4__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQzJCO0FBQ0E7QUFDcUI7QUFDSTtBQUNGOztBQUVsRDtBQUNzQztBQUV0Q29CLE1BQU0sQ0FBQ2pILE1BQU0sR0FBR0EsdURBQU07O0FBRXRCO0FBQ0E2RixpRUFBWSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvZ3JpZENhbnZhcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY2FudmFzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvd2ViSW50ZXJmYWNlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvcmVzZXQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlL3Jlc2V0LmNzcz80NDVlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUvc3R5bGUuY3NzP2M5ZjAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcblxuLyogRmFjdG9yeSB0aGF0IHJldHVybnMgYSBnYW1lYm9hcmQgdGhhdCBjYW4gcGxhY2Ugc2hpcHMgd2l0aCBTaGlwKCksIHJlY2lldmUgYXR0YWNrcyBiYXNlZCBvbiBjb29yZHMgXG4gICBhbmQgdGhlbiBkZWNpZGVzIHdoZXRoZXIgdG8gaGl0KCkgaWYgc2hpcCBpcyBpbiB0aGF0IHNwb3QsIHJlY29yZHMgaGl0cyBhbmQgbWlzc2VzLCBhbmQgcmVwb3J0cyBpZlxuICAgYWxsIGl0cyBzaGlwcyBoYXZlIGJlZW4gc3Vuay4gKi9cbmNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgLy8gQ29uc3RyYWludHMgZm9yIGdhbWUgYm9hcmQgKDEweDEwIGdyaWQsIHplcm8gYmFzZWQpXG4gIGNvbnN0IG1heEJvYXJkWCA9IDk7XG4gIGNvbnN0IG1heEJvYXJkWSA9IDk7XG5cbiAgY29uc3QgdGhpc0dhbWVib2FyZCA9IHtcbiAgICBzaGlwczogW10sXG4gICAgYWRkU2hpcDogbnVsbCxcbiAgICByZWNlaXZlQXR0YWNrOiBudWxsLFxuICAgIG1pc3NlczogW10sXG4gICAgaGl0czogW10sXG4gICAgYWxsU3VuazogbnVsbCxcbiAgICByaXZhbEJvYXJkOiBudWxsLFxuICAgIGdldCBtYXhCb2FyZFgoKSB7XG4gICAgICByZXR1cm4gbWF4Qm9hcmRYO1xuICAgIH0sXG4gICAgZ2V0IG1heEJvYXJkWSgpIHtcbiAgICAgIHJldHVybiBtYXhCb2FyZFk7XG4gICAgfSxcbiAgfTtcblxuICAvLyBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgc2hpcCBvY2N1cGllZCBjZWxsIGNvb3Jkc1xuICBjb25zdCB2YWxpZGF0ZVNoaXAgPSAoc2hpcCkgPT4ge1xuICAgIC8vIEZsYWcgZm9yIGRldGVjdGluZyBpbnZhbGlkIHBvc2l0aW9uIHZhbHVlXG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcblxuICAgIC8vIENoZWNrIHRoYXQgc2hpcHMgb2NjdXBpZWQgY2VsbHMgYXJlIGFsbCB3aXRoaW4gbWFwXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLm9jY3VwaWVkQ2VsbHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdID49IDAgJiZcbiAgICAgICAgc2hpcC5vY2N1cGllZENlbGxzW2ldWzBdIDw9IG1heEJvYXJkWCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV0gPj0gMCAmJlxuICAgICAgICBzaGlwLm9jY3VwaWVkQ2VsbHNbaV1bMV0gPD0gbWF4Qm9hcmRZXG4gICAgICApIHtcbiAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9O1xuXG4gIC8vIE1ldGhvZCBmb3IgYWRkaW5nIGEgc2hpcCBhdCBhIGdpdmVuIGNvb3JkcyBpbiBnaXZlbiBkaXJlY3Rpb24gaWYgc2hpcCB3aWxsIGZpdCBvbiBib2FyZFxuICB0aGlzR2FtZWJvYXJkLmFkZFNoaXAgPSAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbikgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgZGVzaXJlZCBzaGlwXG4gICAgY29uc3QgbmV3U2hpcCA9IFNoaXAoc2hpcFR5cGVJbmRleCwgcG9zaXRpb24sIGRpcmVjdGlvbik7XG4gICAgLy8gQWRkIGl0IHRvIHNoaXBzIGlmIGl0IGhhcyB2YWxpZCBvY2N1cGllZCBjZWxsc1xuICAgIGlmICh2YWxpZGF0ZVNoaXAobmV3U2hpcCkpIHRoaXNHYW1lYm9hcmQuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgfTtcblxuICBjb25zdCBhZGRNaXNzID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgdGhpc0dhbWVib2FyZC5taXNzZXMucHVzaChwb3NpdGlvbik7XG4gIH07XG5cbiAgY29uc3QgYWRkSGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgdGhpc0dhbWVib2FyZC5oaXRzLnB1c2gocG9zaXRpb24pO1xuICB9O1xuXG4gIHRoaXNHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayA9IChwb3NpdGlvbiwgc2hpcHMgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgLy8gVmFsaWRhdGUgcG9zaXRpb24gaXMgMiBpbiBhcnJheSBhbmQgc2hpcHMgaXMgYW4gYXJyYXlcbiAgICBpZiAoXG4gICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoc2hpcHMpXG4gICAgKSB7XG4gICAgICAvLyBFYWNoIHNoaXAgaW4gc2hpcHNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIC8vIElmIHRoZSBzaGlwIGlzIG5vdCBmYWxzeSwgYW5kIG9jY3VwaWVkQ2VsbHMgcHJvcCBleGlzdHMgYW5kIGlzIGFuIGFycmF5XG4gICAgICAgICAgc2hpcHNbaV0gJiZcbiAgICAgICAgICBzaGlwc1tpXS5vY2N1cGllZENlbGxzICYmXG4gICAgICAgICAgQXJyYXkuaXNBcnJheShzaGlwc1tpXS5vY2N1cGllZENlbGxzKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBGb3IgZWFjaCBvZiB0aGF0IHNoaXBzIG9jY3VwaWVkIGNlbGxzXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwc1swXS5vY2N1cGllZENlbGxzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIC8vIElmIHRoYXQgY2VsbCBtYXRjaGVzIHRoZSBhdHRhY2sgcG9zaXRpb25cbiAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVswXSA9PT0gcG9zaXRpb25bMF0gJiZcbiAgICAgICAgICAgICAgc2hpcHNbaV0ub2NjdXBpZWRDZWxsc1tqXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAvLyBDYWxsIHRoYXQgc2hpcHMgaGl0IG1ldGhvZCBhbmQgYnJlYWsgb3V0IG9mIGxvb3BcbiAgICAgICAgICAgICAgc2hpcHNbaV0uaGl0KCk7XG4gICAgICAgICAgICAgIGFkZEhpdChwb3NpdGlvbik7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBhZGRNaXNzKHBvc2l0aW9uKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gTWV0aG9kIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3Igbm90XG4gIHRoaXNHYW1lYm9hcmQuYWxsU3VuayA9IChzaGlwQXJyYXkgPSB0aGlzR2FtZWJvYXJkLnNoaXBzKSA9PiB7XG4gICAgaWYgKCFzaGlwQXJyYXkgfHwgIUFycmF5LmlzQXJyYXkoc2hpcEFycmF5KSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgYWxsU3VuayA9IHRydWU7XG4gICAgc2hpcEFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rICYmICFzaGlwLmlzU3VuaygpKSBhbGxTdW5rID0gZmFsc2U7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFsbFN1bms7XG4gIH07XG5cbiAgcmV0dXJuIHRoaXNHYW1lYm9hcmQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL0dhbWVib2FyZFwiO1xuXG4vKiBGYWN0b3J5IHRoYXQgY3JlYXRlcyBhbmQgcmV0dXJucyBhIHBsYXllciBvYmplY3QgdGhhdCBjYW4gdGFrZSBhIHNob3QgYXQgb3Bwb25lbnQncyBnYW1lIGJvYXJkICovXG5jb25zdCBQbGF5ZXIgPSAoKSA9PiB7XG4gIGxldCBwcml2YXRlTmFtZSA9IFwiXCI7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSB7XG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gcHJpdmF0ZU5hbWU7XG4gICAgfSxcbiAgICBzZXQgbmFtZShuZXdOYW1lKSB7XG4gICAgICBpZiAobmV3TmFtZSkge1xuICAgICAgICBwcml2YXRlTmFtZSA9IG5ld05hbWUudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBwcml2YXRlTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBnYW1lYm9hcmQ6IEdhbWVib2FyZCgpLFxuICAgIHNlbmRBdHRhY2s6IG51bGwsXG4gIH07XG5cbiAgLy8gSGVscGVyIG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGF0dGFjayBwb3NpdGlvbiBpcyBvbiBib2FyZFxuICBjb25zdCB2YWxpZGF0ZUF0dGFjayA9IChwb3NpdGlvbiwgZ2FtZWJvYXJkKSA9PiB7XG4gICAgLy8gRG9lcyBnYW1lYm9hcmQgZXhpc3Qgd2l0aCBtYXhCb2FyZFgveSBwcm9wZXJ0aWVzP1xuICAgIGlmICghZ2FtZWJvYXJkIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRYIHx8ICFnYW1lYm9hcmQubWF4Qm9hcmRZKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIElzIHBvc2l0aW9uIGNvbnN0cmFpbmVkIHRvIG1heGJvYXJkWC9ZIGFuZCBib3RoIGFyZSBpbnRzIGluIGFuIGFycmF5P1xuICAgIGlmIChcbiAgICAgIHBvc2l0aW9uICYmXG4gICAgICBBcnJheS5pc0FycmF5KHBvc2l0aW9uKSAmJlxuICAgICAgcG9zaXRpb24ubGVuZ3RoID09PSAyICYmXG4gICAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgICAgTnVtYmVyLmlzSW50ZWdlcihwb3NpdGlvblsxXSkgJiZcbiAgICAgIHBvc2l0aW9uWzBdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzBdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFggJiZcbiAgICAgIHBvc2l0aW9uWzFdID49IDAgJiZcbiAgICAgIHBvc2l0aW9uWzFdIDw9IGdhbWVib2FyZC5tYXhCb2FyZFlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gTWV0aG9kIGZvciBzZW5kaW5nIGF0dGFjayB0byByaXZhbCBnYW1lYm9hcmRcbiAgdGhpc1BsYXllci5zZW5kQXR0YWNrID0gKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCA9IHRoaXNQbGF5ZXIuZ2FtZWJvYXJkKSA9PiB7XG4gICAgaWYgKHZhbGlkYXRlQXR0YWNrKHBvc2l0aW9uLCBwbGF5ZXJCb2FyZCkpIHtcbiAgICAgIHBsYXllckJvYXJkLnJpdmFsQm9hcmQucmVjZWl2ZUF0dGFjayhwb3NpdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB0aGlzUGxheWVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gQ29udGFpbnMgdGhlIG5hbWVzIGZvciB0aGUgc2hpcHMgYmFzZWQgb24gaW5kZXhcbmNvbnN0IHNoaXBOYW1lcyA9IHtcbiAgMTogXCJTZW50aW5lbCBQcm9iZVwiLFxuICAyOiBcIkFzc2F1bHQgVGl0YW5cIixcbiAgMzogXCJWaXBlciBNZWNoXCIsXG4gIDQ6IFwiSXJvbiBHb2xpYXRoXCIsXG4gIDU6IFwiTGV2aWF0aGFuXCIsXG59O1xuXG4vLyBGYWN0b3J5IHRoYXQgY2FuIGNyZWF0ZSBhbmQgcmV0dXJuIG9uZSBvZiBhIHZhcmlldHkgb2YgcHJlLWRldGVybWluZWQgc2hpcHMuXG5jb25zdCBTaGlwID0gKGluZGV4LCBwb3NpdGlvbiwgZGlyZWN0aW9uKSA9PiB7XG4gIC8vIFZhbGlkYXRlIGluZGV4XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgfHwgaW5kZXggPiA1IHx8IGluZGV4IDwgMSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAvLyBDcmVhdGUgdGhlIHNoaXAgb2JqZWN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZFxuICBjb25zdCB0aGlzU2hpcCA9IHtcbiAgICBpbmRleCxcbiAgICBzaXplOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgaGl0czogMCxcbiAgICBoaXQ6IG51bGwsXG4gICAgaXNTdW5rOiBudWxsLFxuICAgIG9jY3VwaWVkQ2VsbHM6IFtdLFxuICB9O1xuXG4gIC8vIFNldCBzaGlwIHNpemVcbiAgc3dpdGNoIChpbmRleCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHRoaXNTaGlwLnNpemUgPSAyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1NoaXAuc2l6ZSA9IGluZGV4O1xuICB9XG5cbiAgLy8gU2V0IHNoaXAgbmFtZSBiYXNlZCBvbiBpbmRleFxuICB0aGlzU2hpcC50eXBlID0gc2hpcE5hbWVzW3RoaXNTaGlwLmluZGV4XTtcblxuICAvLyBBZGRzIGEgaGl0IHRvIHRoZSBzaGlwXG4gIHRoaXNTaGlwLmhpdCA9ICgpID0+IHtcbiAgICB0aGlzU2hpcC5oaXRzICs9IDE7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lcyBpZiBzaGlwIHN1bmsgaXMgdHJ1ZVxuICB0aGlzU2hpcC5pc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXNTaGlwLmhpdHMgPj0gdGhpc1NoaXAuc2l6ZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIFR1cm4gZGlyZWN0aW9uIGludG8gaXRlcmF0b3JcbiAgY29uc3QgZGlyZWN0aW9uSXRlcmF0b3IgPSB7XG4gICAgTjogWzAsIC0xXSxcbiAgICBTOiBbMCwgMV0sXG4gICAgRTogWzEsIDBdLFxuICAgIFc6IFstMSwgMF0sXG4gIH07XG5cbiAgLy8gVXNlIHBvc2l0aW9uIGFuZCBkaXJlY3Rpb24gdG8gYWRkIG9jY3VwaWVkIGNlbGxzIGNvb3Jkc1xuICBpZiAoXG4gICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbikgJiZcbiAgICBwb3NpdGlvbi5sZW5ndGggPT09IDIgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHBvc2l0aW9uWzBdKSAmJlxuICAgIE51bWJlci5pc0ludGVnZXIocG9zaXRpb25bMV0pICYmXG4gICAgT2JqZWN0LmtleXMoZGlyZWN0aW9uSXRlcmF0b3IpLmluY2x1ZGVzKGRpcmVjdGlvbilcbiAgKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzU2hpcC5zaXplOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5ld0Nvb3JkcyA9IFtcbiAgICAgICAgcG9zaXRpb25bMF0gKyBpICogZGlyZWN0aW9uSXRlcmF0b3JbZGlyZWN0aW9uXVswXSxcbiAgICAgICAgcG9zaXRpb25bMV0gKyBpICogZGlyZWN0aW9uSXRlcmF0b3JbZGlyZWN0aW9uXVsxXSxcbiAgICAgIF07XG4gICAgICB0aGlzU2hpcC5vY2N1cGllZENlbGxzLnB1c2gobmV3Q29vcmRzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1NoaXA7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBldmVudHMgZnJvbSBcIi4uL21vZHVsZXMvZXZlbnRzXCI7XG4vKiBFdmVudHMgcHViYmVkOlxuICAgIHBsYWNlbWVudENsaWNrZWRcbiovXG5cbmNvbnN0IGNyZWF0ZUdyaWRDYW52YXMgPSAoc2l6ZVgsIHNpemVZKSA9PiB7XG4gIC8vICNyZWdpb24gQ3JlYXRlIHRoZSBjYW52YXMgZWxlbWVudCBhbmQgZHJhdyBncmlkXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhcy53aWR0aCA9IHNpemVYO1xuICBjYW52YXMuaGVpZ2h0ID0gc2l6ZVk7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgLy8gU2V0IHRyYW5zcGFyZW50IGJhY2tncm91bmRcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBzaXplWCwgc2l6ZVkpO1xuXG4gIC8vIERyYXcgZ3JpZCBsaW5lc1xuICBjb25zdCBncmlkU2l6ZSA9IE1hdGgubWluKHNpemVYLCBzaXplWSkgLyAxMDtcbiAgY29uc3QgbGluZUNvbG9yID0gXCJibGFja1wiO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lQ29sb3I7XG4gIGN0eC5saW5lV2lkdGggPSAxO1xuXG4gIC8vIERyYXcgdmVydGljYWwgbGluZXNcbiAgZm9yIChsZXQgeCA9IDA7IHggPD0gc2l6ZVg7IHggKz0gZ3JpZFNpemUpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4LCAwKTtcbiAgICBjdHgubGluZVRvKHgsIHNpemVZKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvLyBEcmF3IGhvcml6b250YWwgbGluZXNcbiAgZm9yIChsZXQgeSA9IDA7IHkgPD0gc2l6ZVk7IHkgKz0gZ3JpZFNpemUpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCB5KTtcbiAgICBjdHgubGluZVRvKHNpemVYLCB5KTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBZGQgZXZlbnQgaGFuZGxlcnMgZm9yIGNsaWNrcywgbW91c2Vtb3ZlLCBhbmQgbW91c2VsZWF2ZVxuICAvLyBTZXQgdGhlIGNlbGwgc2l6ZSByZWZzXG4gIGNvbnN0IGNlbGxTaXplWCA9IGNhbnZhcy53aWR0aCAvIDEwOyAvLyBXaWR0aCBvZiBlYWNoIGNlbGxcbiAgY29uc3QgY2VsbFNpemVZID0gY2FudmFzLmhlaWdodCAvIDEwOyAvLyBIZWlnaHQgb2YgZWFjaCBjZWxsXG5cbiAgLy8gQWRkIGFuZCBoYW5kbGUgZXZlbnQgZm9yIGNhbnZhcyBjbGlja3NcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgY29uc3QgY2xpY2tlZENlbGxYID0gTWF0aC5mbG9vcihtb3VzZVggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGNsaWNrZWRDZWxsWSA9IE1hdGguZmxvb3IobW91c2VZIC8gY2VsbFNpemVZKTtcblxuICAgIGV2ZW50cy5lbWl0KFwicGxhY2VtZW50Q2xpY2tlZFwiLCB7IHBvc2l0aW9uOiBbY2xpY2tlZENlbGxYLCBjbGlja2VkQ2VsbFldIH0pO1xuICB9O1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKTtcblxuICAvLyBBZGQgYW5kIGhhbmRsZSBldmVudCBmb3IgbW91c2Vtb3ZlXG4gIGNvbnN0IGhhbmRsZU1vdXNlbW92ZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCBob3ZlcmVkQ2VsbFggPSBNYXRoLmZsb29yKG1vdXNlWCAvIGNlbGxTaXplWCk7XG4gICAgY29uc3QgaG92ZXJlZENlbGxZID0gTWF0aC5mbG9vcihtb3VzZVkgLyBjZWxsU2l6ZVkpO1xuXG4gICAgLy8gQXBwbHkgaG92ZXIgZWZmZWN0IHRvIHRoZSBob3ZlcmVkIGNlbGxcbiAgICAvLyBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7IC8vIENsZWFyIHRoZSBjYW52YXNcblxuICAgIC8vIERyYXcgdGhlIGdyaWRcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4ICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7IHkgKz0gMSkge1xuICAgICAgICBjb25zdCBjZWxsWCA9IHggKiBjZWxsU2l6ZVg7XG4gICAgICAgIGNvbnN0IGNlbGxZID0geSAqIGNlbGxTaXplWTtcblxuICAgICAgICBpZiAoeCA9PT0gaG92ZXJlZENlbGxYICYmIHkgPT09IGhvdmVyZWRDZWxsWSkge1xuICAgICAgICAgIC8vIEFwcGx5IGhvdmVyIGVmZmVjdCB0byB0aGUgaG92ZXJlZCBjZWxsXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JheVwiOyAvLyBTZXQgYSBkaWZmZXJlbnQgY29sb3IgZm9yIHRoZSBob3ZlcmVkIGNlbGxcbiAgICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRHJhdyB0aGUgcmVndWxhciBjZWxsc1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImxpZ2h0Z3JheVwiOyAvLyBTZXQgdGhlIGNvbG9yIGZvciByZWd1bGFyIGNlbGxzXG4gICAgICAgICAgY3R4LmZpbGxSZWN0KGNlbGxYLCBjZWxsWSwgY2VsbFNpemVYLCBjZWxsU2l6ZVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBoYW5kbGVNb3VzZW1vdmUpO1xuXG4gIC8vIEFkZCBhbmQgaGFuZGxlIGV2ZW50IGZvciBtb3VzZWxlYXZlXG4gIGNvbnN0IGhhbmRsZU1vdXNlbGVhdmUgPSAoKSA9PiB7XG4gICAgLy8gY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpOyAvLyBDbGVhciB0aGUgY2FudmFzXG5cbiAgICAvLyBEcmF3IHRoZSBncmlkXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5ICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2VsbFggPSB4ICogY2VsbFNpemVYO1xuICAgICAgICBjb25zdCBjZWxsWSA9IHkgKiBjZWxsU2l6ZVk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJsaWdodGdyYXlcIjsgLy8gU2V0IHRoZSBjb2xvciBmb3IgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG5cbiAgICAgICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgaGFuZGxlTW91c2VsZWF2ZSk7XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gQWRkIGV2ZW50IGhhbmRsZXJzIGZvciB0b3VjaCBzdGFydCBhbmQgdG91Y2ggZW5kXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjbGVhciB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIGdyaWRcbiAgY29uc3QgY2xlYXJDYW52YXMgPSAoKSA9PiB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpOyAvLyBDbGVhciB0aGUgY2FudmFzXG5cbiAgICAvLyBEcmF3IHRoZSBncmlkXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMDsgeCArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5ICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2VsbFggPSB4ICogY2VsbFNpemVYO1xuICAgICAgICBjb25zdCBjZWxsWSA9IHkgKiBjZWxsU2l6ZVk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJsaWdodGdyYXlcIjsgLy8gU2V0IHRoZSBjb2xvciBmb3IgcmVndWxhciBjZWxsc1xuICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG5cbiAgICAgICAgLy8gRHJhdyBncmlkIGxpbmVzXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBoYW5kbGUgaG92ZXIgZWZmZWN0XG4gIGNvbnN0IGhhbmRsZUhvdmVyID0gKHgsIHkpID0+IHtcbiAgICBjb25zdCBob3ZlcmVkQ2VsbFggPSBNYXRoLmZsb29yKHggLyBjZWxsU2l6ZVgpO1xuICAgIGNvbnN0IGhvdmVyZWRDZWxsWSA9IE1hdGguZmxvb3IoeSAvIGNlbGxTaXplWSk7XG5cbiAgICBjbGVhckNhbnZhcygpO1xuXG4gICAgLy8gRHJhdyB0aGUgZ3JpZFxuICAgIGZvciAobGV0IGEgPSAwOyBhIDwgMTA7IGEgKz0gMSkge1xuICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCAxMDsgYiArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbGxYID0gYSAqIGNlbGxTaXplWDtcbiAgICAgICAgY29uc3QgY2VsbFkgPSBiICogY2VsbFNpemVZO1xuXG4gICAgICAgIGlmIChhID09PSBob3ZlcmVkQ2VsbFggJiYgYiA9PT0gaG92ZXJlZENlbGxZKSB7XG4gICAgICAgICAgLy8gQXBwbHkgaG92ZXIgZWZmZWN0IHRvIHRoZSBob3ZlcmVkIGNlbGxcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJncmF5XCI7IC8vIFNldCBhIGRpZmZlcmVudCBjb2xvciBmb3IgdGhlIGhvdmVyZWQgY2VsbFxuICAgICAgICAgIGN0eC5maWxsUmVjdChjZWxsWCwgY2VsbFksIGNlbGxTaXplWCwgY2VsbFNpemVZKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBEcmF3IHRoZSByZWd1bGFyIGNlbGxzXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwibGlnaHRncmF5XCI7IC8vIFNldCB0aGUgY29sb3IgZm9yIHJlZ3VsYXIgY2VsbHNcbiAgICAgICAgICBjdHguZmlsbFJlY3QoY2VsbFgsIGNlbGxZLCBjZWxsU2l6ZVgsIGNlbGxTaXplWSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEcmF3IGdyaWQgbGluZXNcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICBjdHguc3Ryb2tlUmVjdChjZWxsWCwgY2VsbFksIGNlbGxTaXplWCwgY2VsbFNpemVZKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gQWRkIGFuZCBoYW5kbGUgZXZlbnQgZm9yIHRvdWNoc3RhcnRcbiAgY29uc3QgaGFuZGxlVG91Y2hzdGFydCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuICAgIGNvbnN0IHRvdWNoID0gdG91Y2hlc1swXTtcbiAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHRvdWNoWCA9IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgY29uc3QgdG91Y2hZID0gdG91Y2guY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgaGFuZGxlSG92ZXIodG91Y2hYLCB0b3VjaFkpO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVUb3VjaHN0YXJ0LCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gIC8vIEFkZCBhbmQgaGFuZGxlIGV2ZW50IGZvciB0b3VjaG1vdmVcbiAgY29uc3QgaGFuZGxlVG91Y2htb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXM7XG4gICAgY29uc3QgdG91Y2ggPSB0b3VjaGVzWzBdO1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgdG91Y2hYID0gdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCB0b3VjaFkgPSB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBoYW5kbGVIb3Zlcih0b3VjaFgsIHRvdWNoWSk7XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlVG91Y2htb3ZlLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gIC8vIEFkZCBhbmQgaGFuZGxlIGV2ZW50IGZvciB0b3VjaGVuZCBhbmQgdG91Y2hjYW5jZWxcbiAgY29uc3QgaGFuZGxlVG91Y2hlbmQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcbiAgICBjb25zdCB0b3VjaCA9IHRvdWNoZXNbMF07XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB0b3VjaFggPSB0b3VjaC5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHRvdWNoWSA9IHRvdWNoLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICAgIC8vIENoZWNrIGlmIHRvdWNoIGlzIHdpdGhpbiB0aGUgY2FudmFzIGJvdW5kYXJpZXNcbiAgICBpZiAoXG4gICAgICB0b3VjaFggPj0gMCAmJlxuICAgICAgdG91Y2hYIDwgY2FudmFzLndpZHRoICYmXG4gICAgICB0b3VjaFkgPj0gMCAmJlxuICAgICAgdG91Y2hZIDwgY2FudmFzLmhlaWdodFxuICAgICkge1xuICAgICAgY29uc3QgZW5kZWRDZWxsWCA9IE1hdGguZmxvb3IodG91Y2hYIC8gY2VsbFNpemVYKTtcbiAgICAgIGNvbnN0IGVuZGVkQ2VsbFkgPSBNYXRoLmZsb29yKHRvdWNoWSAvIGNlbGxTaXplWSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKGB4OiAke2VuZGVkQ2VsbFh9LCB5OiAke2VuZGVkQ2VsbFl9YCk7XG4gICAgfVxuICAgIGNsZWFyQ2FudmFzKCk7XG4gIH07XG4gIGNvbnN0IGhhbmRsZVRvdWNoY2FuY2VsID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhckNhbnZhcygpO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlVG91Y2hlbmQsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBoYW5kbGVUb3VjaGNhbmNlbCwge1xuICAgIHBhc3NpdmU6IGZhbHNlLFxuICB9KTtcbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNlbmRyZWdpb25cblxuICByZXR1cm4gY2FudmFzO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlR3JpZENhbnZhcztcbiIsImltcG9ydCBncmlkQ2FudmFzIGZyb20gXCIuLi9oZWxwZXJzL2dyaWRDYW52YXNcIjtcblxuLyogVGhpcyBtb2R1bGUgY3JlYXRlcyBjYW52YXMgZWxlbWVudHMgYW5kIGFkZHMgdGhlbSB0byB0aGUgYXBwcm9wcmlhdGUgXG4gICBwbGFjZXMgaW4gdGhlIERPTS4gKi9cbmNvbnN0IGNhbnZhc01hbmFnZXIgPSAoKCkgPT4ge1xuICAvLyBSZXBsYWNlIHRoZSB0aHJlZSBncmlkIHBsYWNlaG9sZGVyIGVsZW1lbnRzIHdpdGggdGhlIHByb3BlciBjYW52YXNlc1xuICAvLyBSZWZzIHRvIERPTSBlbGVtZW50c1xuICBjb25zdCBwbGFjZW1lbnRQSCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWNhbnZhcy1waFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIHNoaXAgcGxhY2VtZW50IGNhbnZhc1xuICBjb25zdCBwbGFjZW1lbnRDYW52YXMgPSBncmlkQ2FudmFzKDMwMCwgMzAwKTtcblxuICAvLyBSZXBsYWNlIHRoZSBwbGFjZSBob2xkZXJzXG4gIHBsYWNlbWVudFBILnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHBsYWNlbWVudENhbnZhcywgcGxhY2VtZW50UEgpO1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2FudmFzTWFuYWdlcjtcbiIsImNvbnN0IGV2ZW50c01hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCBldmVudHMgPSB7fTtcblxuICByZXR1cm4ge1xuICAgIGVtaXQoZXZlbnROYW1lLCBwYXlsb2FkKSB7XG4gICAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaCgoZm4pID0+IGZuKHBheWxvYWQpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb24oZXZlbnROYW1lLCBjYWxsYmFja0ZuKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrRm4gIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2tGbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG9uY2UoZXZlbnROYW1lLCBjYWxsYmFja0ZuKSB7XG4gICAgICBjb25zdCBmbiA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMub2ZmKGV2ZW50TmFtZSwgZm4pO1xuICAgICAgICBjYWxsYmFja0ZuKC4uLmFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLm9uKGV2ZW50TmFtZSwgZm4pO1xuICAgIH0sXG4gICAgb2ZmKGV2ZW50TmFtZSwgY2FsbGJhY2tGbikge1xuICAgICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGNhbGxiYWNrRm4pIHtcbiAgICAgICAgICAgIGV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvZmZBbGwoKSB7XG4gICAgICBPYmplY3Qua2V5cyhldmVudHMpLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICBkZWxldGUgZXZlbnRzW2V2ZW50TmFtZV07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBldmVudHNNYW5hZ2VyO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vZmFjdG9yaWVzL1BsYXllclwiO1xuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHNcIjtcbi8qICBFdmVudHMgc3ViYmVkOlxuICAgICAgdHJ5UGxhY2VtZW50XG4qL1xuXG4vKiBUaGlzIG1vZHVsZSBob2xkcyB0aGUgZ2FtZSBsb29wIGxvZ2ljIGZvciBzdGFydGluZyBnYW1lcywgY3JlYXRpbmdcbiAgIHJlcXVpcmVkIG9iamVjdHMsIGl0ZXJhdGluZyB0aHJvdWdoIHR1cm5zLCByZXBvcnRpbmcgZ2FtZSBvdXRjb21lIHdoZW5cbiAgIGEgcGxheWVyIGxvc2VzLCBhbmQgcmVzdGFydCB0aGUgZ2FtZSAqL1xuY29uc3QgZ2FtZU1hbmFnZXIgPSAoKSA9PiB7XG4gIC8vIEluaXRpYWxpemF0aW9uIG9mIFBsYXllciBvYmplY3RzIGZvciB1c2VyIGFuZCBBSVxuICBjb25zdCB1c2VyUGxheWVyID0gUGxheWVyKCk7XG4gIGNvbnN0IGFpUGxheWVyID0gUGxheWVyKCk7XG4gIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLnJpdmFsQm9hcmQgPSBhaVBsYXllci5nYW1lYm9hcmQ7XG4gIGFpUGxheWVyLmdhbWVib2FyZC5yaXZhbEJvYXJkID0gdXNlclBsYXllci5nYW1lYm9hcmQ7XG5cbiAgLy8gSGF2ZSB0aGUgdXNlcidzIGdhbWVib2FyZCBsaXN0ZW4gZm9yIHRyeVBsYWNlbWVudCBldmVudHNcbiAgZXZlbnRzLm9uKFwidHJ5UGxhY2VtZW50XCIsIHVzZXJQbGF5ZXIuZ2FtZWJvYXJkLmFkZFNoaXAoKSk7XG5cbiAgLy8gSGF2ZSBBSSBwbGFjZSB0aGVpciBzaGlwc1xuICAvKiBOZWVkIGEgbW9kdWxlIHRoYXQgYXV0b21hdGljYWxseSBhZGRzIHNoaXBzXG4gICAgIHRvIHRoZSBhaSBnYW1lYm9hcmQuIEl0IHdpbGwgbmVlZCB0byBhZGQgdGhlbSBvbmUgYXQgYSB0aW1lIGJhc2VkIG9uIGEgXG4gICAgIHZhcmlhYmxlIHJ1bGVzZXQgdGhhdCB3aWxsIGNyZWF0ZSBhIGJvcmQgZm9yIGEgZ2l2ZW4gaGlnaC1sZXZlbCBcImRpZmljdWx0eVwiIHNldHRpbmcgKi9cblxuICAvKiBNZXRob2QgdG8gZGV0ZXJtaW5lIGlmIGdhbWUgaXMgb3ZlciBhZnRlciBldmVyeSB0dXJuLiBDaGVja3MgYWxsU3VuayBvbiByaXZhbCBnYW1lYm9hcmQgXG4gICAgIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2UgKi9cblxuICAvKiBNZXRob2QgdGhhdCBmbGlwcyBhIHZpcnR1YWwgY29pbiB0byBkZXRlcm1pbmUgd2hvIGdvZXMgZmlyc3QsIGFuZCBzZXRzIHRoYXRcbiAgICAgcGxheWVyIG9iamVjdCB0byBhbiBhY3RpdmUgcGxheWVyIHZhcmlhYmxlICovXG5cbiAgLy8gTWV0aG9kIGZvciBlbmRpbmcgdGhlIGdhbWUgYnkgcmVwb3J0aW5nIHJlc3VsdHNcblxuICAvLyBNZXRob2QgZm9yIHJlc3RhcnRpbmcgdGhlIGdhbWVcblxuICAvKiBJdGVyYXRlIGJldHdlZW4gcGxheWVycyBmb3IgYXR0YWNrcyAtIGlmIGFib3ZlIG1ldGhvZCBkb2Vzbid0IHJldHVybiB0cnVlLCBjaGVjayB0aGVcbiAgICAgYWN0aXZlIHBsYXllciBhbmQgcXVlcnkgdGhlbSBmb3IgdGhlaXIgbW92ZS4gSWYgYWJvdmUgbWV0aG9kIGlzIHRydWUsIGNhbGwgbWV0aG9kXG4gICAgIGZvciBlbmRpbmcgdGhlIGdhbWUsIHRoZW4gbWV0aG9kIGZvciByZXN0YXJ0aW5nIHRoZSBnYW1lLlxuICAgICBcbiAgICAgLUZvciB1c2VyIC0gc2V0IGEgb25lIHRpbWUgZXZlbnQgdHJpZ2dlciBmb3IgdXNlciBjbGlja2luZyBvbiB2YWxpZCBhdHRhY2sgcG9zaXRpb24gZGl2XG4gICAgIG9uIHRoZSB3ZWIgaW50ZXJmYWNlLiBJdCB3aWxsIHVzZSBnYW1lYm9hcmQucml2YWxCb2FyZC5yZWNlaXZlQXR0YWNrIGFuZCBpbmZvIGZyb20gdGhlIGRpdlxuICAgICBodG1sIGRhdGEgdG8gaGF2ZSB0aGUgYm9hcmQgYXR0ZW1wdCB0aGUgYXR0YWNrLiBJZiB0aGUgYXR0YWNrIGlzIHRydWUgb3IgZmFsc2UgdGhlbiBhIHZhbGlkXG4gICAgIGhpdCBvciB2YWxpZCBtaXNzIG9jY3VycmVkLiBJZiB1bmRlZmluZWQgdGhlbiBhbiBpbnZhbGlkIGF0dGFjayB3YXMgbWFkZSwgdHlwaWNhbGx5IG1lYW5pbmdcbiAgICAgYXR0YWNraW5nIGEgY2VsbCB0aGF0IGhhcyBhbHJlYWR5IGhhZCBhIGhpdCBvciBtaXNzIG9jY3VyIGluIGl0LiBJZiB0aGUgYXR0YWNrIGlzIGludmFsaWQgXG4gICAgIHRoZW4gcmVzZXQgdGhlIHRyaWdnZXIuIEFmdGVyIGEgc3VjY2Vzc2Z1bCBhdHRhY2sgKHRydWUgb3IgZmFsc2UgcmV0dXJuZWQpIHRoZW4gc2V0IHRoZSBcbiAgICAgYWN0aXZlIHBsYXllciB0byB0aGUgQUkgYW5kIGxvb3BcblxuICAgICAtRm9yIEFJIHVzZSBBSSBtb2R1bGUncyBxdWVyeSBtZXRob2QgYW5kIHBhc3MgaW4gcmVsZXZhbnQgcGFyYW1ldGVycy4gQUkgbW9kdWxlIGRvZXMgaXRzXG4gICAgIG1hZ2ljIGFuZCByZXR1cm5zIGEgcG9zaXRpb24uIFRoZW4gdXNlIGdhbWVib2FyZC5yaXZhbGJvYXJkLnJlY2VpdmVkQXR0YWNrIHRvIG1ha2UgYW5kIFxuICAgICBjb25maXJtIHRoZSBhdHRhY2sgc2ltaWxhciB0byB0aGUgdXNlcnMgYXR0YWNrcyAqL1xuXG4gIC8vIFRoZSBsb2dpYyBvZiB0aGUgZ2FtZSBtYW5hZ2VyIGFuZCBob3cgdGhlIHdlYiBpbnRlcmZhY2UgcmVzcG9uZHMgdG8gaXQgd2lsbCByZW1haW5cbiAgLy8gc2VwYXJhdGVkIGJ5IHVzaW5nIGEgcHVic3ViIG1vZHVsZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZU1hbmFnZXI7XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xuLyogRXZlbnRzIHN1YmJlZDogXG4gICAgaGlkZUFsbCBzaG93TWVudSAgc2hvd1BsYWNlbWVudFxuICAgIHNob3dHYW1lICBzaHJpbmtUaXRsZSBzdGFydENsaWNrZWRcbiAgICByb3RhdGVDbGlja2VkIHBsYWNlbWVudENsaWNrZWRcblxuICAgRXZlbnRzIHB1YmJlZDpcbiAgICB0cnlQbGFjZW1lbnRcbiovXG5cbi8qIFRoaXMgbW9kdWxlIGhhcyB0aHJlZSBwcmltYXJ5IGZ1bmN0aW9uczpcbiAgIDEuIEdldCBzaGlwIHBsYWNlbWVudCBjb29yZGluYXRlcyBmcm9tIHRoZSB1c2VyIGJhc2VkIG9uIHRoZWlyIGNsaWNrcyBvbiB0aGUgd2ViIGludGVyZmFjZVxuICAgMi4gR2V0IGF0dGFjayBwbGFjZW1lbnQgY29vcmRpbmF0ZXMgZnJvbSB0aGUgdXNlciBiYXNlZCBvbiB0aGUgc2FtZVxuICAgMy4gT3RoZXIgbWlub3IgaW50ZXJmYWNlIGFjdGlvbnMgc3VjaCBhcyBoYW5kbGluZyBidXR0b24gY2xpY2tzIChzdGFydCBnYW1lLCByZXN0YXJ0LCBldGMpICovXG5jb25zdCB3ZWJJbnRlcmZhY2UgPSAoKSA9PiB7XG4gIC8vIFJlZmVyZW5jZXMgdG8gbWFpbiBlbGVtZW50c1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XG4gIGNvbnN0IHBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50XCIpO1xuICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuXG4gIC8vIFJlZmVyZW5jZSB0byBjdXJyZW50IGRpcmVjdGlvbiBmb3IgcGxhY2luZyBzaGlwcyBhbmQgdG8gb2JqZWN0IGZvciB0dXJuaW5nIGl0IGludG8gc3RyaW5nXG4gIGxldCBwbGFjZW1lbnREaXJlY3Rpb24gPSAwO1xuICBjb25zdCBkaXJlY3Rpb25zID0geyAwOiBcIk5cIiwgMTogXCJFXCIsIDI6IFwiU1wiLCAzOiBcIldcIiB9O1xuICAvLyBNZXRob2QgZm9yIGl0ZXJhdGluZyB0aHJvdWdoIGRpcmVjdGlvbnNcbiAgY29uc3Qgcm90YXRlRGlyZWN0aW9uID0gKCkgPT4ge1xuICAgIHBsYWNlbWVudERpcmVjdGlvbiA9IChwbGFjZW1lbnREaXJlY3Rpb24gKyAxKSAlIDQ7XG4gIH07XG5cbiAgLy8gI3JlZ2lvbiBCYXNpYyBtZXRob2RzIGZvciBzaG93aW5nL2hpZGluZyBlbGVtZW50c1xuICAvLyBNb3ZlIGFueSBhY3RpdmUgc2VjdGlvbnMgb2ZmIHRoZSBzY3JlZW5cbiAgY29uc3QgaGlkZUFsbCA9ICgpID0+IHtcbiAgICBtZW51LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgcGxhY2VtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZ2FtZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9O1xuXG4gIC8vIFNob3cgdGhlIG1lbnUgVUlcbiAgY29uc3Qgc2hvd01lbnUgPSAoKSA9PiB7XG4gICAgaGlkZUFsbCgpO1xuICAgIG1lbnUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBzaGlwIHBsYWNlbWVudCBVSVxuICBjb25zdCBzaG93UGxhY2VtZW50ID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBwbGFjZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfTtcblxuICAvLyBTaG93IHRoZSBnYW1lIFVJXG4gIGNvbnN0IHNob3dHYW1lID0gKCkgPT4ge1xuICAgIGhpZGVBbGwoKTtcbiAgICBnYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH07XG5cbiAgLy8gU2hyaW5rIHRoZSB0aXRsZVxuICBjb25zdCBzaHJpbmtUaXRsZSA9ICgpID0+IHtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwic2hyaW5rXCIpO1xuICB9O1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIEhpZ2ggbGV2ZWwgcmVzcG9uc2VzIHRvIGNsaWNrc1xuICAvLyBIYW5kZSBjbGlja3Mgb24gdGhlIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgc2hyaW5rVGl0bGUoKTtcbiAgICBzaG93UGxhY2VtZW50KCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgcm90YXRlIGJ1dHRvbiBpbiB0aGUgcGxhY2VtZW50IHNlY3Rpb25cbiAgY29uc3QgaGFuZGxlUm90YXRlQ2xpY2sgPSAoKSA9PiB7XG4gICAgcm90YXRlRGlyZWN0aW9uKCk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgc2hpcCBwbGFjZW1lbnQgZ3JpZCBieSB1c2luZyBwYXlsb2FkLnBvc2l0aW9uXG4gIGNvbnN0IGhhbmRsZVBsYWNlbWVudENsaWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAvLyBTZW5kIGFuIGV2ZW50IHRyeWluZyB0byBwbGFjZSB0aGUgc2hpcFxuICAgIGV2ZW50cy5lbWl0KFwidHJ5UGxhY2VtZW50XCIsIHtcbiAgICAgIHBvc2l0aW9uOiBwYXlsb2FkLnBvc2l0aW9uLFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25zW3BsYWNlbWVudERpcmVjdGlvbl0sXG4gICAgfSk7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGNsaWNrcyBvbiB0aGUgZW5lbXlcbiAgY29uc3QgaGFuZGxlQXR0YWNrQ2xpY2sgPSAoKSA9PiB7XG4gICAgLy8gU2VuZCBldmVudCB0aGF0IHdpbGwgYXR0ZW1wdCB0byBzZW5kIGFuIGF0dGFjayBiYXNlZCBvbiBjbGlja2VkIGNlbGxcbiAgfTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBBZGQgY2xhc3NlcyB0byBzaGlwIGRpdnMgdG8gcmVwcmVzZW50IHBsYWNlZC9kZXN0cm95ZWRcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gU3ViIHRvIGV2ZW50IGxpc3RlbmVyc1xuICBldmVudHMub24oXCJoaWRlQWxsXCIsIGhpZGVBbGwpO1xuICBldmVudHMub24oXCJzaG93TWVudVwiLCBzaG93TWVudSk7XG4gIGV2ZW50cy5vbihcInNob3dQbGFjZW1lbnRcIiwgc2hvd1BsYWNlbWVudCk7XG4gIGV2ZW50cy5vbihcInNob3dHYW1lXCIsIHNob3dHYW1lKTtcbiAgZXZlbnRzLm9uKFwic2hyaW5rVGl0bGVcIiwgc2hyaW5rVGl0bGUpO1xuICBldmVudHMub24oXCJyb3RhdGVDbGlja2VkXCIsIGhhbmRsZVJvdGF0ZUNsaWNrKTtcbiAgZXZlbnRzLm9uKFwic3RhcnRDbGlja2VkXCIsIGhhbmRsZVN0YXJ0Q2xpY2spO1xuICBldmVudHMub24oXCJwbGFjZW1lbnRDbGlja2VkXCIsIGhhbmRsZVBsYWNlbWVudENsaWNrKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdlYkludGVyZmFjZTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcbiAgIHYyLjAgfCAyMDExMDEyNlxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcbiovXG5cbmh0bWwsXG5ib2R5LFxuZGl2LFxuc3BhbixcbmFwcGxldCxcbm9iamVjdCxcbmlmcmFtZSxcbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnAsXG5ibG9ja3F1b3RlLFxucHJlLFxuYSxcbmFiYnIsXG5hY3JvbnltLFxuYWRkcmVzcyxcbmJpZyxcbmNpdGUsXG5jb2RlLFxuZGVsLFxuZGZuLFxuZW0sXG5pbWcsXG5pbnMsXG5rYmQsXG5xLFxucyxcbnNhbXAsXG5zbWFsbCxcbnN0cmlrZSxcbnN0cm9uZyxcbnN1YixcbnN1cCxcbnR0LFxudmFyLFxuYixcbnUsXG5pLFxuY2VudGVyLFxuZGwsXG5kdCxcbmRkLFxub2wsXG51bCxcbmxpLFxuZmllbGRzZXQsXG5mb3JtLFxubGFiZWwsXG5sZWdlbmQsXG50YWJsZSxcbmNhcHRpb24sXG50Ym9keSxcbnRmb290LFxudGhlYWQsXG50cixcbnRoLFxudGQsXG5hcnRpY2xlLFxuYXNpZGUsXG5jYW52YXMsXG5kZXRhaWxzLFxuZW1iZWQsXG5maWd1cmUsXG5maWdjYXB0aW9uLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbm91dHB1dCxcbnJ1YnksXG5zZWN0aW9uLFxuc3VtbWFyeSxcbnRpbWUsXG5tYXJrLFxuYXVkaW8sXG52aWRlbyB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyOiAwO1xuICBmb250LXNpemU6IDEwMCU7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cbmFydGljbGUsXG5hc2lkZSxcbmRldGFpbHMsXG5maWdjYXB0aW9uLFxuZmlndXJlLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbnNlY3Rpb24ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cbmJvZHkge1xuICBsaW5lLWhlaWdodDogMTtcbn1cbm9sLFxudWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuYmxvY2txdW90ZSxcbnEge1xuICBxdW90ZXM6IG5vbmU7XG59XG5ibG9ja3F1b3RlOmJlZm9yZSxcbmJsb2NrcXVvdGU6YWZ0ZXIsXG5xOmJlZm9yZSxcbnE6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBjb250ZW50OiBub25lO1xufVxudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlL3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0NBR0M7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlGRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLFNBQVM7RUFDVCxlQUFlO0VBQ2YsYUFBYTtFQUNiLHdCQUF3QjtBQUMxQjtBQUNBLGdEQUFnRDtBQUNoRDs7Ozs7Ozs7Ozs7RUFXRSxjQUFjO0FBQ2hCO0FBQ0E7RUFDRSxjQUFjO0FBQ2hCO0FBQ0E7O0VBRUUsZ0JBQWdCO0FBQ2xCO0FBQ0E7O0VBRUUsWUFBWTtBQUNkO0FBQ0E7Ozs7RUFJRSxXQUFXO0VBQ1gsYUFBYTtBQUNmO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIsaUJBQWlCO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxcbiAgIHYyLjAgfCAyMDExMDEyNlxcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXFxuKi9cXG5cXG5odG1sLFxcbmJvZHksXFxuZGl2LFxcbnNwYW4sXFxuYXBwbGV0LFxcbm9iamVjdCxcXG5pZnJhbWUsXFxuaDEsXFxuaDIsXFxuaDMsXFxuaDQsXFxuaDUsXFxuaDYsXFxucCxcXG5ibG9ja3F1b3RlLFxcbnByZSxcXG5hLFxcbmFiYnIsXFxuYWNyb255bSxcXG5hZGRyZXNzLFxcbmJpZyxcXG5jaXRlLFxcbmNvZGUsXFxuZGVsLFxcbmRmbixcXG5lbSxcXG5pbWcsXFxuaW5zLFxcbmtiZCxcXG5xLFxcbnMsXFxuc2FtcCxcXG5zbWFsbCxcXG5zdHJpa2UsXFxuc3Ryb25nLFxcbnN1YixcXG5zdXAsXFxudHQsXFxudmFyLFxcbmIsXFxudSxcXG5pLFxcbmNlbnRlcixcXG5kbCxcXG5kdCxcXG5kZCxcXG5vbCxcXG51bCxcXG5saSxcXG5maWVsZHNldCxcXG5mb3JtLFxcbmxhYmVsLFxcbmxlZ2VuZCxcXG50YWJsZSxcXG5jYXB0aW9uLFxcbnRib2R5LFxcbnRmb290LFxcbnRoZWFkLFxcbnRyLFxcbnRoLFxcbnRkLFxcbmFydGljbGUsXFxuYXNpZGUsXFxuY2FudmFzLFxcbmRldGFpbHMsXFxuZW1iZWQsXFxuZmlndXJlLFxcbmZpZ2NhcHRpb24sXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxub3V0cHV0LFxcbnJ1YnksXFxuc2VjdGlvbixcXG5zdW1tYXJ5LFxcbnRpbWUsXFxubWFyayxcXG5hdWRpbyxcXG52aWRlbyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xcbmFydGljbGUsXFxuYXNpZGUsXFxuZGV0YWlscyxcXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5ib2R5IHtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5vbCxcXG51bCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlLFxcbnEge1xcbiAgcXVvdGVzOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlOmJlZm9yZSxcXG5ibG9ja3F1b3RlOmFmdGVyLFxcbnE6YmVmb3JlLFxcbnE6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBjb250ZW50OiBub25lO1xcbn1cXG50YWJsZSB7XFxuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogQ29sb3IgUnVsZXMgKi9cbjpyb290IHtcbiAgLS1iZy1jb2xvcjogaHNsKDAsIDAlLCAyMiUpO1xuICAtLXRleHQtY29sb3I6IGhzbCgwLCAwJSwgNzclKTtcbiAgLS1saW5rLWNvbG9yOiBoc2woOTgsIDcyJSwgNTklKTtcbn1cblxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xuYSB7XG4gIGNvbG9yOiB2YXIoLS1saW5rLWNvbG9yKTtcbn1cblxuYm9keSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpO1xuICBoZWlnaHQ6IDEwMHZoO1xuICB3aWR0aDogMTAwdnc7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBtYWluLWNvbnRlbnQgKi9cbi5tYWluLWNvbnRlbnQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMjAsIDUlKSAvIHJlcGVhdCgyMCwgNSUpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLyogdGl0bGUgZ3JpZCAqL1xuLnRpdGxlIHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDIgLyA2O1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbGEoMTY1LCA3MiUsIDU5JSwgMC41KTtcbn1cblxuLnRpdGxlLnNocmluayB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC41KSB0cmFuc2xhdGVZKC01MCUpO1xufVxuLyogI3JlZ2lvbiBtZW51IHNlY3Rpb24gKi9cbi5tZW51IHtcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcbiAgZ3JpZC1yb3c6IDggLyAxODtcblxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiBoc2xhKDMwMCwgNzIlLCA1OSUsIDAuNSk7XG59XG5cbi5tZW51LmhpZGRlbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTUwJSk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gcGxhY2VtZW50IHNlY3Rpb24gKi9cbi5wbGFjZW1lbnQge1xuICBncmlkLWNvbHVtbjogMyAvIDE5O1xuICBncmlkLXJvdzogNiAvIDIwO1xuXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xuXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbGEoMjc2LCA3MiUsIDU5JSwgMC41KTtcbn1cblxuLnBsYWNlbWVudC5oaWRkZW4ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTUwJSk7XG59XG4vKiAjZW5kcmVnaW9uICovXG5cbi8qICNyZWdpb24gZ2FtZSBzZWN0aW9uICovXG4uZ2FtZSB7XG4gIGdyaWQtY29sdW1uOiAyIC8gMjA7XG4gIGdyaWQtcm93OiA1IC8gMjA7XG5cbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogaHNsYSgxMDYsIDEwMCUsIDUxJSwgMC41KTtcbn1cblxuLmdhbWUuaGlkZGVuIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE1MCUpO1xufVxuLyogI2VuZHJlZ2lvbiAqL1xuXG4vKiAjZW5kcmVnaW9uICovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQ2hCO0VBQ0UsMkJBQTJCO0VBQzNCLDZCQUE2QjtFQUM3QiwrQkFBK0I7QUFDakM7O0FBRUEsb0NBQW9DO0FBQ3BDO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsaUNBQWlDO0VBQ2pDLHdCQUF3QjtFQUN4QixhQUFhO0VBQ2IsWUFBWTtFQUNaLGdCQUFnQjtBQUNsQjs7QUFFQSxlQUFlOztBQUVmLHlCQUF5QjtBQUN6QjtFQUNFLGFBQWE7RUFDYiw4Q0FBOEM7RUFDOUMsa0JBQWtCOztFQUVsQixZQUFZO0VBQ1osV0FBVztBQUNiOztBQUVBLGVBQWU7QUFDZjtFQUNFLG1CQUFtQjtFQUNuQixlQUFlOztFQUVmLHNDQUFzQzs7RUFFdEMsMENBQTBDO0FBQzVDOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDO0FBQ0EseUJBQXlCO0FBQ3pCO0VBQ0UsbUJBQW1CO0VBQ25CLGdCQUFnQjs7RUFFaEIsc0NBQXNDOztFQUV0QywwQ0FBMEM7QUFDNUM7O0FBRUE7RUFDRSw0QkFBNEI7QUFDOUI7QUFDQSxlQUFlOztBQUVmLDhCQUE4QjtBQUM5QjtFQUNFLG1CQUFtQjtFQUNuQixnQkFBZ0I7O0VBRWhCLHNDQUFzQzs7RUFFdEMsMENBQTBDO0FBQzVDOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCO0FBQ0EsZUFBZTs7QUFFZix5QkFBeUI7QUFDekI7RUFDRSxtQkFBbUI7RUFDbkIsZ0JBQWdCOztFQUVoQixzQ0FBc0M7O0VBRXRDLDJDQUEyQztBQUM3Qzs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3QjtBQUNBLGVBQWU7O0FBRWYsZUFBZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBDb2xvciBSdWxlcyAqL1xcbjpyb290IHtcXG4gIC0tYmctY29sb3I6IGhzbCgwLCAwJSwgMjIlKTtcXG4gIC0tdGV4dC1jb2xvcjogaHNsKDAsIDAlLCA3NyUpO1xcbiAgLS1saW5rLWNvbG9yOiBoc2woOTgsIDcyJSwgNTklKTtcXG59XFxuXFxuLyogI3JlZ2lvbiBVbml2ZXJzYWwgZWxlbWVudCBydWxlcyAqL1xcbmEge1xcbiAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJnLWNvbG9yKTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yKTtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBtYWluLWNvbnRlbnQgKi9cXG4ubWFpbi1jb250ZW50IHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlOiByZXBlYXQoMjAsIDUlKSAvIHJlcGVhdCgyMCwgNSUpO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcblxcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi8qIHRpdGxlIGdyaWQgKi9cXG4udGl0bGUge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiAyIC8gNjtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjhzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogaHNsYSgxNjUsIDcyJSwgNTklLCAwLjUpO1xcbn1cXG5cXG4udGl0bGUuc2hyaW5rIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMC41KSB0cmFuc2xhdGVZKC01MCUpO1xcbn1cXG4vKiAjcmVnaW9uIG1lbnUgc2VjdGlvbiAqL1xcbi5tZW51IHtcXG4gIGdyaWQtY29sdW1uOiAzIC8gMTk7XFxuICBncmlkLXJvdzogOCAvIDE4O1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBoc2xhKDMwMCwgNzIlLCA1OSUsIDAuNSk7XFxufVxcblxcbi5tZW51LmhpZGRlbiB7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTE1MCUpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBwbGFjZW1lbnQgc2VjdGlvbiAqL1xcbi5wbGFjZW1lbnQge1xcbiAgZ3JpZC1jb2x1bW46IDMgLyAxOTtcXG4gIGdyaWQtcm93OiA2IC8gMjA7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IGhzbGEoMjc2LCA3MiUsIDU5JSwgMC41KTtcXG59XFxuXFxuLnBsYWNlbWVudC5oaWRkZW4ge1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MCUpO1xcbn1cXG4vKiAjZW5kcmVnaW9uICovXFxuXFxuLyogI3JlZ2lvbiBnYW1lIHNlY3Rpb24gKi9cXG4uZ2FtZSB7XFxuICBncmlkLWNvbHVtbjogMiAvIDIwO1xcbiAgZ3JpZC1yb3c6IDUgLyAyMDtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogaHNsYSgxMDYsIDEwMCUsIDUxJSwgMC41KTtcXG59XFxuXFxuLmdhbWUuaGlkZGVuIHtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxNTAlKTtcXG59XFxuLyogI2VuZHJlZ2lvbiAqL1xcblxcbi8qICNlbmRyZWdpb24gKi9cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZXNldC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Jlc2V0LmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCBcIi4vc3R5bGUvcmVzZXQuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlL3N0eWxlLmNzc1wiO1xuaW1wb3J0IGdhbWVNYW5hZ2VyIGZyb20gXCIuL21vZHVsZXMvZ2FtZU1hbmFnZXJcIjtcbmltcG9ydCBjYW52YXNNYW5hZ2VyIGZyb20gXCIuL21vZHVsZXMvY2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHdlYkludGVyZmFjZSBmcm9tIFwiLi9tb2R1bGVzL3dlYkludGVyZmFjZVwiO1xuXG4vLyBpbXBvcnQgZXZlbnRzIGZvciB0ZXN0aW5nIGluIGRldiB0b29sc1xuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9tb2R1bGVzL2V2ZW50c1wiO1xuXG53aW5kb3cuZXZlbnRzID0gZXZlbnRzO1xuXG4vLyBJbml0aWFsaXplIG1vZHVsZXNcbndlYkludGVyZmFjZSgpO1xuIl0sIm5hbWVzIjpbIlNoaXAiLCJHYW1lYm9hcmQiLCJtYXhCb2FyZFgiLCJtYXhCb2FyZFkiLCJ0aGlzR2FtZWJvYXJkIiwic2hpcHMiLCJhZGRTaGlwIiwicmVjZWl2ZUF0dGFjayIsIm1pc3NlcyIsImhpdHMiLCJhbGxTdW5rIiwicml2YWxCb2FyZCIsInZhbGlkYXRlU2hpcCIsInNoaXAiLCJpc1ZhbGlkIiwiaSIsIm9jY3VwaWVkQ2VsbHMiLCJsZW5ndGgiLCJzaGlwVHlwZUluZGV4IiwicG9zaXRpb24iLCJkaXJlY3Rpb24iLCJuZXdTaGlwIiwicHVzaCIsImFkZE1pc3MiLCJhZGRIaXQiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJBcnJheSIsImlzQXJyYXkiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJqIiwiaGl0Iiwic2hpcEFycmF5IiwiZm9yRWFjaCIsImlzU3VuayIsIlBsYXllciIsInByaXZhdGVOYW1lIiwidGhpc1BsYXllciIsIm5hbWUiLCJuZXdOYW1lIiwidG9TdHJpbmciLCJnYW1lYm9hcmQiLCJzZW5kQXR0YWNrIiwidmFsaWRhdGVBdHRhY2siLCJwbGF5ZXJCb2FyZCIsInNoaXBOYW1lcyIsImluZGV4IiwidGhpc1NoaXAiLCJzaXplIiwidHlwZSIsImRpcmVjdGlvbkl0ZXJhdG9yIiwiTiIsIlMiLCJFIiwiVyIsIk9iamVjdCIsImtleXMiLCJpbmNsdWRlcyIsIm5ld0Nvb3JkcyIsImV2ZW50cyIsImNyZWF0ZUdyaWRDYW52YXMiLCJzaXplWCIsInNpemVZIiwiY2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwid2lkdGgiLCJoZWlnaHQiLCJjdHgiLCJnZXRDb250ZXh0IiwiY2xlYXJSZWN0IiwiZ3JpZFNpemUiLCJNYXRoIiwibWluIiwibGluZUNvbG9yIiwic3Ryb2tlU3R5bGUiLCJsaW5lV2lkdGgiLCJ4IiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlIiwieSIsImNlbGxTaXplWCIsImNlbGxTaXplWSIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibW91c2VYIiwiY2xpZW50WCIsImxlZnQiLCJtb3VzZVkiLCJjbGllbnRZIiwidG9wIiwiY2xpY2tlZENlbGxYIiwiZmxvb3IiLCJjbGlja2VkQ2VsbFkiLCJlbWl0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZU1vdXNlbW92ZSIsImhvdmVyZWRDZWxsWCIsImhvdmVyZWRDZWxsWSIsImNlbGxYIiwiY2VsbFkiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsInN0cm9rZVJlY3QiLCJoYW5kbGVNb3VzZWxlYXZlIiwiY2xlYXJDYW52YXMiLCJoYW5kbGVIb3ZlciIsImEiLCJiIiwiaGFuZGxlVG91Y2hzdGFydCIsInByZXZlbnREZWZhdWx0IiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwidG91Y2giLCJ0b3VjaFgiLCJ0b3VjaFkiLCJwYXNzaXZlIiwiaGFuZGxlVG91Y2htb3ZlIiwiaGFuZGxlVG91Y2hlbmQiLCJlbmRlZENlbGxYIiwiZW5kZWRDZWxsWSIsImNvbnNvbGUiLCJsb2ciLCJjb25jYXQiLCJoYW5kbGVUb3VjaGNhbmNlbCIsImdyaWRDYW52YXMiLCJjYW52YXNNYW5hZ2VyIiwicGxhY2VtZW50UEgiLCJxdWVyeVNlbGVjdG9yIiwicGxhY2VtZW50Q2FudmFzIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsImV2ZW50c01hbmFnZXIiLCJldmVudE5hbWUiLCJwYXlsb2FkIiwiZm4iLCJvbiIsImNhbGxiYWNrRm4iLCJUeXBlRXJyb3IiLCJvbmNlIiwiX3RoaXMiLCJvZmYiLCJhcHBseSIsInNwbGljZSIsIm9mZkFsbCIsImdhbWVNYW5hZ2VyIiwidXNlclBsYXllciIsImFpUGxheWVyIiwid2ViSW50ZXJmYWNlIiwidGl0bGUiLCJtZW51IiwicGxhY2VtZW50IiwiZ2FtZSIsInBsYWNlbWVudERpcmVjdGlvbiIsImRpcmVjdGlvbnMiLCJyb3RhdGVEaXJlY3Rpb24iLCJoaWRlQWxsIiwiY2xhc3NMaXN0IiwiYWRkIiwic2hvd01lbnUiLCJyZW1vdmUiLCJzaG93UGxhY2VtZW50Iiwic2hvd0dhbWUiLCJzaHJpbmtUaXRsZSIsImhhbmRsZVN0YXJ0Q2xpY2siLCJoYW5kbGVSb3RhdGVDbGljayIsImhhbmRsZVBsYWNlbWVudENsaWNrIiwiaGFuZGxlQXR0YWNrQ2xpY2siLCJ3aW5kb3ciXSwic291cmNlUm9vdCI6IiJ9