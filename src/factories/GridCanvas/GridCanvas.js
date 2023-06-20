// Helper module for draw methods
import drawingModule from "./draw";

// Initialize it
const draw = drawingModule();

const createCanvas = (gm, sizeX, sizeY, options, gameboard) => {
  // #region References
  // Ships array
  const { ships } = gameboard;

  // #endregion

  // #region Set up basic element properties
  // Set the grid height and width and add ref to current cell
  const gridHeight = 10;
  const gridWidth = 10;
  let currentCell = null;

  // Create parent div that holds the canvases. This is the element returned.
  const canvasContainer = document.createElement("div");
  canvasContainer.classList.add("canvas-container");

  // Create the board canvas element to serve as the gameboard base
  // Static or rarely rendered things should go here
  const boardCanvas = document.createElement("canvas");
  canvasContainer.appendChild(boardCanvas);
  boardCanvas.width = sizeX;
  boardCanvas.height = sizeY;
  const boardCtx = boardCanvas.getContext("2d");

  // Create the overlay canvas for rendering ship placement and attack selection
  const overlayCanvas = document.createElement("canvas");
  canvasContainer.appendChild(overlayCanvas);
  overlayCanvas.width = sizeX;
  overlayCanvas.height = sizeY;
  const overlayCtx = overlayCanvas.getContext("2d");

  // Set the "cell size" for the grid represented by the canvas
  const cellSizeX = boardCanvas.width / gridWidth; // Module const
  const cellSizeY = boardCanvas.height / gridHeight; // Module const

  // #endregion

  // #region General helper methods
  // Method that gets the mouse position based on what cell it is over
  const getMouseCell = (event) => {
    const rect = boardCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const cellX = Math.floor(mouseX / cellSizeX);
    const cellY = Math.floor(mouseY / cellSizeY);

    return [cellX, cellY];
  };

  // #endregion

  // Add methods on the container for drawing hits or misses for ease of use elsewhere
  canvasContainer.drawHit = (coordinates) =>
    canvasContainer.drawHitMiss(coordinates, 1);
  canvasContainer.drawMiss = (coordinates) =>
    canvasContainer.drawHitMiss(coordinates, 0);

  // #region Assign static behaviors
  // Draw ships to board canvas using shipsCopy
  canvasContainer.drawShips = (
    shipsToDraw = ships,
    cellX = cellSizeX,
    cellY = cellSizeY
  ) => {
    // Draw a cell to board
    function drawCell(posX, posY) {
      boardCtx.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }

    shipsToDraw.forEach((ship) => {
      ship.occupiedCells.forEach((cell) => {
        drawCell(cell[0], cell[1]);
      });
    });
  };

  // Draw hit or to board canvas
  canvasContainer.drawHitMiss = (
    cellCoordinates,
    type = 0,
    cellX = cellSizeX,
    cellY = cellSizeY
  ) => {
    // Set proper fill color
    boardCtx.fillStyle = "white";
    if (type === 1) boardCtx.fillStyle = "red";
    // Set a radius for circle to draw for "peg" that will always fit in cell
    const radius = cellX > cellY ? cellY / 2 : cellX / 2;
    // Draw the circle
    boardCtx.beginPath();
    boardCtx.arc(
      cellCoordinates[0] * cellX + cellX / 2,
      cellCoordinates[1] * cellY + cellY / 2,
      radius,
      0,
      2 * Math.PI
    );
    boardCtx.stroke();
    boardCtx.fill();
  };

  // overlayCanvas
  // Forward clicks to board canvas
  overlayCanvas.handleMouseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newEvent = new MouseEvent("click", {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    boardCanvas.dispatchEvent(newEvent);
  };

  // Mouseleave
  overlayCanvas.handleMouseLeave = () => {
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
    overlayCanvas.handleMouseMove = (event) => {
      // Get what cell the mouse is over
      const mouseCell = getMouseCell(event);
      // If the 'old' currentCell is equal to the mouseCell being evaluated
      if (
        !(
          currentCell &&
          currentCell[0] === mouseCell[0] &&
          currentCell[1] === mouseCell[1]
        )
      ) {
        // Render the changes
        draw.placementHighlight(
          overlayCtx,
          sizeX,
          sizeY,
          cellSizeX,
          cellSizeY,
          mouseCell,
          gm
        );
        // highlightPlacementCells(mouseCell);
      }

      // Set the currentCell to the mouseCell for future comparisons
      currentCell = mouseCell;
    };

    // Browser click events
    boardCanvas.handleMouseClick = (event) => {
      const cell = getMouseCell(event);

      // Try placement
      gm.placementClicked(cell);
      /*       gameboard.addShip(mouseCell);
      boardCanvas.drawShips();
      userBoardCanvas.drawShips();
      webInterface.tryStartGame(); */
    };
  }
  // User canvas for displaying ai hits and misses against user and user ship placements
  else if (options.type === "user") {
    // Add class to denote user canvas
    canvasContainer.classList.add("user-canvas-container");
    // Handle canvas mouse move
    overlayCanvas.handleMouseMove = () => {
      // Do nothing
    };
    // Handle board mouse click
    boardCanvas.handleMouseClick = () => {
      // Do nothing
    };
  }
  // AI canvas for displaying user hits and misses against ai, and ai ship placements if user loses
  else if (options.type === "ai") {
    // Add class to denote ai canvas
    canvasContainer.classList.add("ai-canvas-container");
    // Handle canvas mouse move
    overlayCanvas.handleMouseMove = (event) => {
      // Get what cell the mouse is over
      const mouseCell = getMouseCell(event);

      // If the 'old' currentCell is equal to the mouseCell being evaluated
      if (
        !(
          currentCell &&
          currentCell[0] === mouseCell[0] &&
          currentCell[1] === mouseCell[1]
        )
      ) {
        // Highlight the current cell in red
        draw.attackHighlight(
          overlayCtx,
          sizeX,
          sizeY,
          cellSizeX,
          cellSizeY,
          mouseCell,
          gm
        );
        // highlightAttack(mouseCell);
      }
      // Denote if it is a valid attack or not - NYI
    };
    // Handle board mouse click
    boardCanvas.handleMouseClick = (event) => {
      const attackCoords = getMouseCell(event);
      gm.playerAttacking(attackCoords);

      // Clear the overlay to show hit/miss under current highight
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    };
  }
  // #endregion

  // Subscribe to browser events
  // board click
  boardCanvas.addEventListener("click", (e) => boardCanvas.handleMouseClick(e));
  // overlay click
  overlayCanvas.addEventListener("click", (e) =>
    overlayCanvas.handleMouseClick(e)
  );
  // overlay mousemove
  overlayCanvas.addEventListener("mousemove", (e) =>
    overlayCanvas.handleMouseMove(e)
  );
  // overlay mouseleave
  overlayCanvas.addEventListener("mouseleave", () =>
    overlayCanvas.handleMouseLeave()
  );

  // Draw initial board lines
  draw.lines(boardCtx, sizeX, sizeY);

  // Return completed canvases
  return canvasContainer;
};

export default createCanvas;
