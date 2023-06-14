const createCanvas = (
  sizeX,
  sizeY,
  options,
  gameboard,
  webInterface,
  userCanvas
) => {
  // #region References
  // Ships array
  const { ships } = gameboard;

  let userBoardCanvas = null;
  if (userCanvas) {
    [userBoardCanvas] = userCanvas.childNodes;
  }

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

  // #region Methods for drawing to canvases
  // Method for drawing the grid lines
  const drawLines = (context) => {
    // Draw grid lines
    const gridSize = Math.min(sizeX, sizeY) / 10;
    const lineColor = "black";
    context.strokeStyle = lineColor;
    context.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= sizeX; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, sizeY);
      context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= sizeY; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(sizeX, y);
      context.stroke();
    }
  };

  // Draws the highlighted placement cells to the overlay canvas
  const highlightPlacementCells = (
    cellCoordinates,
    cellX = cellSizeX,
    cellY = cellSizeY,
    shipsCount = ships.length,
    direction = gameboard.direction
  ) => {
    // Clear the canvas
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    // Draw a cell to overlay
    function drawCell(posX, posY) {
      overlayCtx.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }

    // Determine current ship length (based on default battleship rules sizes, smallest to biggest)
    let drawLength;
    if (shipsCount === 0) drawLength = 2;
    else if (shipsCount === 1 || shipsCount === 2) drawLength = 3;
    else drawLength = shipsCount + 1;

    // Determine direction to draw in
    let directionX = 0;
    let directionY = 0;

    if (direction === 1) {
      directionY = 1;
      directionX = 0;
    } else if (direction === 0) {
      directionY = 0;
      directionX = 1;
    }

    // Divide the drawLenght in half with remainder
    const halfDrawLength = Math.floor(drawLength / 2);
    const remainderLength = drawLength % 2;

    // If drawing off canvas make color red
    // Calculate maximum and minimum coordinates
    const maxCoordinateX =
      cellCoordinates[0] + (halfDrawLength + remainderLength - 1) * directionX;
    const maxCoordinateY =
      cellCoordinates[1] + (halfDrawLength + remainderLength - 1) * directionY;
    const minCoordinateX = cellCoordinates[0] - halfDrawLength * directionX;
    const minCoordinateY = cellCoordinates[1] - halfDrawLength * directionY;

    // And translate into an actual canvas position
    const maxX = maxCoordinateX * cellX;
    const maxY = maxCoordinateY * cellY;
    const minX = minCoordinateX * cellX;
    const minY = minCoordinateY * cellY;

    // Check if any cells are outside the canvas boundaries
    const isOutOfBounds =
      maxX >= overlayCanvas.width ||
      maxY >= overlayCanvas.height ||
      minX < 0 ||
      minY < 0;

    // Set the fill color based on whether cells are drawn off canvas
    overlayCtx.fillStyle = isOutOfBounds ? "red" : "blue";

    // Draw the moused over cell from passed coords
    drawCell(cellCoordinates[0], cellCoordinates[1]);

    // Draw the first half of cells and remainder in one direction
    for (let i = 0; i < halfDrawLength + remainderLength; i += 1) {
      const nextX = cellCoordinates[0] + i * directionX;
      const nextY = cellCoordinates[1] + i * directionY;
      drawCell(nextX, nextY);
    }

    // Draw the remaining half
    // Draw the remaining cells in the opposite direction
    for (let i = 0; i < halfDrawLength; i += 1) {
      const nextX = cellCoordinates[0] - (i + 1) * directionX;
      const nextY = cellCoordinates[1] - (i + 1) * directionY;
      drawCell(nextX, nextY);
    }
  };

  // Draw highlighted attack cell
  const highlightAttack = (
    cellCoordinates,
    cellX = cellSizeX,
    cellY = cellSizeY
  ) => {
    // Clear the canvas
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Highlight the current cell in red
    overlayCtx.fillStyle = "red";
    overlayCtx.fillRect(
      cellCoordinates[0] * cellX,
      cellCoordinates[1] * cellY,
      cellX,
      cellY
    );
  };

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

  // Draw ships to board canvas using shipsCopy
  boardCanvas.drawShips = (
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

  // #endregion

  // #region Assign static behaviors
  // boardCanvas
  // Draw hit or to board canvas
  boardCanvas.drawHitMiss = (
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
        highlightPlacementCells(mouseCell);
      }

      // Set the currentCell to the mouseCell for future comparisons
      currentCell = mouseCell;
    };

    // Browser click events
    boardCanvas.handleMouseClick = (event) => {
      const mouseCell = getMouseCell(event);

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
        highlightAttack(mouseCell);
      }
      // Denote if it is a valid attack or not - NYI
    };
    // Handle board mouse click
    boardCanvas.handleMouseClick = (event) => {
      // Get the current cell
      const mouseCell = getMouseCell(event);
      // Try attack at current cell
      const attackHit = gameboard.receiveAttack(mouseCell);
      if (attackHit === true) boardCanvas.drawHitMiss(mouseCell, 1);
      else if (attackHit === false) boardCanvas.drawHitMiss(mouseCell, 0);
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

  // Testing calls
  drawLines(boardCtx); // Remove this later

  // Return completed canvases
  return canvasContainer;
};

export default createCanvas;
