/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import events from "../modules/events";
/* 
  Events subbed:
    returnUserShips
    directionChanged

  Events pubbed:
    placementClicked
    requestUserShips
  
*/

// Old implementation
/* const createGridCanvas = (sizeX, sizeY, options) => {

  // #region Methods for getting data via event
  // Sets info about user ships in response to event
  const ships = [];

  const setUserShips = (payload) => {
    payload.forEach((ship) => {
      ships.push(ship);
    });
  };
  events.on("returnUserShips", setUserShips);

  // Method that requests information about current user ships using event
  const requestUserShips = () => {
    events.emit("requestUserShips");
  };

  // Sets info about current placement direction in reponse to event
  let placementDirection = "N";

  const requestShipPlacementDirection = () => {
    events.emit("requestShipPlacementDirection"); // Emit event to request direction information
  };

  events.on("returnShipPlacementDirection", (direction) => {
    if (
      direction === "N" ||
      direction === "S" ||
      direction === "E" ||
      direction === "W"
    ) {
      placementDirection = direction;
    }
  });

  // #endregion

  // #region Create the canvas element and draw grid
  const canvas = document.createElement("canvas");
  canvas.width = sizeX;
  canvas.height = sizeY;
  const ctx = canvas.getContext("2d");

  // Set transparent background
  ctx.clearRect(0, 0, sizeX, sizeY);

  const drawLines = () => {
    // Draw grid lines
    const gridSize = Math.min(sizeX, sizeY) / 10;
    const lineColor = "black";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= sizeX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, sizeY);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= sizeY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(sizeX, y);
      ctx.stroke();
    }
  };

  // Draw original lines
  drawLines();

  // #endregion

  // Set the cell size refs
  const cellSizeX = canvas.width / 10; // Width of each cell
  const cellSizeY = canvas.height / 10; // Height of each cell

  // Helper for creating a grid showing occupied/empty cells
  const createShipGrid = (shipsToAdd, gridSize) => {
    const grid = [];

    // Initialize the grid with empty cells
    for (let i = 0; i < gridSize; i += 1) {
      const row = [];
      for (let j = 0; j < gridSize; j += 1) {
        row.push(false); // Mark cell as unoccupied
      }
      grid.push(row);
    }

    // Helper for marking occupied cells based on ship positions and returning in an array structure
    shipsToAdd.forEach((ship) => {
      ship.occupiedCells.forEach(([occupiedCellX, occupiedCellY]) => {
        grid[occupiedCellY][occupiedCellX] = true; // Mark cell as occupied
      });
    });

    return grid;
  };

  const shipGrid = createShipGrid(ships, 10);

  // Helper method for checking ship placement
  const isShipPlacementValid = (originX, originY, shipSize, direction) => {
    const directionX = direction === "W" ? -1 : direction === "E" ? 1 : 0;
    const directionY = direction === "N" ? -1 : direction === "S" ? 1 : 0;

    for (let i = 0; i < shipSize; i++) {
      const currentX = originX + i * directionX;
      const currentY = originY + i * directionY;

      if (
        currentX < 0 ||
        currentX >= shipGrid.length ||
        currentY < 0 ||
        currentY >= shipGrid[0].length ||
        shipGrid[currentY][currentX] !== false
      ) {
        return false; // Invalid placement
      }
    }

    return true; // Valid placement
  };

  // #region Add event handlers based on options
  if (options && options.options === "placement") {
    // #region Mouse
    // Add and handle event for canvas clicks
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const clickedCellX = Math.floor(mouseX / cellSizeX);
      const clickedCellY = Math.floor(mouseY / cellSizeY);

      events.emit("placementClicked", {
        position: [clickedCellX, clickedCellY],
      });
    };
    canvas.addEventListener("click", handleClick);

    // Add and handle event for mousemove
    const handleMousemove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const hoveredCellX = Math.floor(mouseX / cellSizeX);
      const hoveredCellY = Math.floor(mouseY / cellSizeY);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw the grid lines
      drawLines();

      for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 10; y += 1) {
          const cellX = x * cellSizeX;
          const cellY = y * cellSizeY;

          // Ship size can be inferred based on how many ships have been placed already
          const shipSize = () => {
            if (ships.length === 0) return 2;
            if (ships.length === 1) return 3;
            return ships.length;
          };

          if (x === hoveredCellX && y === hoveredCellY) {
            // Apply hover effect to the hovered cell
            ctx.fillStyle = "gray"; // Set a different color for the hovered cell
            ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);
          } else {
            const isValidPlacement = isShipPlacementValid(
              hoveredCellX,
              hoveredCellY,
              shipSize(),
              placementDirection
            );

            if (isValidPlacement && shipGrid[y][x] === false) {
              ctx.fillStyle = "blue"; // Set color for valid and unoccupied cells
            } else {
              ctx.fillStyle = "red"; // Set color for invalid or occupied cells
            }

            ctx.fillRect(cellX, cellY, cellSizeX, cellSizeY);
          }
        }
      }
    };

    canvas.addEventListener("mousemove", handleMousemove);

    // Add and handle event for mouseleave
    const handleMouseleave = () => {
      // const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Draw the grid
      for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 10; y += 1) {
          const cellX = x * cellSizeX;
          const cellY = y * cellSizeY;

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

    // #region Touch
    // Helper function to clear the canvas and redraw the grid
    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Draw the grid
      for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 10; y += 1) {
          const cellX = x * cellSizeX;
          const cellY = y * cellSizeY;

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
    const handleHover = (x, y) => {
      const hoveredCellX = Math.floor(x / cellSizeX);
      const hoveredCellY = Math.floor(y / cellSizeY);

      clearCanvas();

      // Draw the grid
      for (let a = 0; a < 10; a += 1) {
        for (let b = 0; b < 10; b += 1) {
          const cellX = a * cellSizeX;
          const cellY = b * cellSizeY;

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
    const handleTouchstart = (event) => {
      event.preventDefault();
      const touches = event.changedTouches;
      const touch = touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      handleHover(touchX, touchY);
    };
    document.addEventListener("touchstart", handleTouchstart, {
      passive: false,
    });

    // Add and handle event for touchmove
    const handleTouchmove = (event) => {
      event.preventDefault();
      const touches = event.changedTouches;
      const touch = touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      handleHover(touchX, touchY);
    };
    document.addEventListener("touchmove", handleTouchmove, { passive: false });

    // Add and handle event for touchend and touchcancel
    const handleTouchend = (event) => {
      event.preventDefault();
      const touches = event.changedTouches;
      const touch = touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      // Check if touch is within the canvas boundaries
      if (
        touchX >= 0 &&
        touchX < canvas.width &&
        touchY >= 0 &&
        touchY < canvas.height
      ) {
        const endedCellX = Math.floor(touchX / cellSizeX);
        const endedCellY = Math.floor(touchY / cellSizeY);

        console.log(`x: ${endedCellX}, y: ${endedCellY}`);
      }
      clearCanvas();
    };
    const handleTouchcancel = (event) => {
      event.preventDefault();
      clearCanvas();
    };
    document.addEventListener("touchend", handleTouchend, { passive: false });
    document.addEventListener("touchcancel", handleTouchcancel, {
      passive: false,
    });
    // #endregion
  } else if (options && options.options === "opponent") {
    // Variation for opponent grid
    // Implement specific functionality for opponent grid
  } else {
    // Variation for other grid type (if applicable)
    // Implement specific functionality for other grid type
  }

  // #endregion
  // #endregion

  return canvas;
};

export default createGridCanvas;
 */

/* Determine the variation and take appropriate actions:
    For the "placement" variation:
      Subscribe to an event for the placementDirection change, emitted by a different module.
      Define a method that will be called when the placementDirection changes.
      Define a method that will be called when the mouseLeave event occurs:
        Remove the highlighted origin cell, green cells, red cells, and blue cells.
      Define a method that will be called when the click event occurs:
        Log a console message with the coordinates of the clicked cell.
        Emit an event to request the ships array from another module.
      Define a method that will be called when the ships array is received:
        Draw the ships on the grid using the occupiedCells parameter of each ship object.
      Highlight the origin cell (being hovered over) as yellow.
      Determine the ship size based on the length of the array containing ship objects.
      Determine the cells that should be green or red based on occupiedCells of existing ships and placementDirection.
      Mark those cells as green or red, ensuring they don't overlap with other ships.
      Mark the cells representing placed ships as blue.
 */

const createCanvas = (sizeX, sizeY, options) => {
  // #region Methods for getting/setting needed data via event
  // Sets info about user ships in response to event
  const shipsCopy = [];

  const setUserShips = (ships) => {
    ships.forEach((ship) => {
      shipsCopy.push(ship);
    });
  };

  // Method that requests information about current user ships using event
  const requestUserShips = () => {
    events.emit("requestUserShips");
  };

  // Sets info about current placement direction in reponse to event
  let placementDirection = "N";

  const setPlacementDirection = (direction) => {
    if (
      direction === "N" ||
      direction === "S" ||
      direction === "E" ||
      direction === "W"
    ) {
      placementDirection = direction;
    }
  };

  // #endregion
  // Module scoped variables and constants
  const gridHeight = 10;
  const gridWidth = 10;

  // Create the base canvas element
  const canvas = document.createElement("canvas");
  canvas.width = sizeX;
  canvas.height = sizeY;
  const ctx = canvas.getContext("2d");

  // Method for drawing the grid lines
  const drawLines = () => {
    // Draw grid lines
    const gridSize = Math.min(sizeX, sizeY) / 10;
    const lineColor = "black";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= sizeX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, sizeY);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= sizeY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(sizeX, y);
      ctx.stroke();
    }
  };

  // #region Assign behavior using browser event handlers based on options
  if (options.type === "placement") {
    canvas.handleMouseMove = () => {
      // Code
    };
    canvas.handleMouseLeave = () => {
      // Code
    };
    canvas.handleMouseClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const cellSizeX = canvas.width / gridWidth;
      const cellSizeY = canvas.height / gridHeight;

      const cellX = Math.floor(mouseX / cellSizeX);
      const cellY = Math.floor(mouseY / cellSizeY);

      console.log(`Clicked cell: (${cellX}, ${cellY})`);
    };
  }

  // Subscribe to events for getting data
  events.on("returnUserShips", setUserShips);
  events.on("directionChanged", setPlacementDirection);
  // Subscribe to events for browser event handling
  canvas.addEventListener("click", () => canvas.handleMouseClick());

  drawLines();

  // Return completed canvas
  return canvas;
};

export default createCanvas;
