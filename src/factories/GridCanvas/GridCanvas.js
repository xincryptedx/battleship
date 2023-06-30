/* This module creates and returns a dual, layered canvas element. The bottom layer is the board
  canvas that represpents basic board elements that don't change often, such as ships, hits, misses
  and grid lines. The top layer is the overlay canvas that represents frequently changing elements
  like highlighting cells to indicate where attacks or ships will go. 
  
  It also sets up handlers for browser mouse events that allow the human user to interact with the
  program, such as placing ships and picking cells to attack. */

// Helper module for draw methods
import drawingModule from "./draw";

// Initialize it
const draw = drawingModule();

const createCanvas = (gm, canvasX, canvasY, options) => {
  // #region Set up basic element properties
  // Set the grid height and width and add ref to current cell
  const gridHeight = 10;
  const gridWidth = 10;
  let currentCell = null;

  // Create parent div that holds the canvases. This is the element returned.
  const canvasContainer = document.createElement("div");
  canvasContainer.classList.add("canvas-container");

  // Create the board canvas element to serve as the gameboard base
  const boardCanvas = document.createElement("canvas");
  canvasContainer.appendChild(boardCanvas);
  boardCanvas.width = canvasX;
  boardCanvas.height = canvasY;
  const boardCtx = boardCanvas.getContext("2d");

  // Create the overlay canvas for rendering ship placement and attack selection
  const overlayCanvas = document.createElement("canvas");
  canvasContainer.appendChild(overlayCanvas);
  overlayCanvas.width = canvasX;
  overlayCanvas.height = canvasY;
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

  // #region Assign static methods
  // Add methods on the container for drawing hits or misses
  canvasContainer.drawHit = (coordinates) =>
    draw.hitOrMiss(boardCtx, cellSizeX, cellSizeY, coordinates, 1);
  canvasContainer.drawMiss = (coordinates) =>
    draw.hitOrMiss(boardCtx, cellSizeX, cellSizeY, coordinates, 0);

  // Add method to container for ships to board canvas
  canvasContainer.drawShips = (userShips = true) => {
    draw.ships(boardCtx, cellSizeX, cellSizeY, gm, userShips);
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
          canvasX,
          canvasY,
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
          canvasX,
          canvasY,
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
  draw.lines(boardCtx, canvasX, canvasY);

  // Return completed canvases
  return canvasContainer;
};

export default createCanvas;
