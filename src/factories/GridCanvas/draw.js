const draw = () => {
  // Draws the grid lines
  const lines = (context, canvasX, canvasY) => {
    // Draw grid lines
    const gridSize = Math.min(canvasX, canvasY) / 10;
    const lineColor = "black";
    context.strokeStyle = lineColor;
    context.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= canvasX; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasY);
      context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvasY; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasX, y);
      context.stroke();
    }
  };

  const placementHighlight = (
    context,
    canvasX,
    canvasY,
    cellX,
    cellY,
    mouseCoords,
    gm
  ) => {
    // Clear the canvas
    context.clearRect(0, 0, canvasX, canvasY);
    // Draw a cell to overlay
    function drawCell(posX, posY) {
      context.fillRect(posX * cellX, posY * cellY, cellX, cellY);
    }

    // Determine current ship length (based on default battleship rules sizes, smallest to biggest)
    let drawLength;
    const shipsCount = gm.userBoard.ships.length;
    if (shipsCount === 0) drawLength = 2;
    else if (shipsCount === 1 || shipsCount === 2) drawLength = 3;
    else drawLength = shipsCount + 1;

    // Determine direction to draw in
    let directionX = 0;
    let directionY = 0;

    if (gm.userBoard.direction === 1) {
      directionY = 1;
      directionX = 0;
    } else if (gm.userBoard.direction === 0) {
      directionY = 0;
      directionX = 1;
    }

    // Divide the drawLenght in half with remainder
    const halfDrawLength = Math.floor(drawLength / 2);
    const remainderLength = drawLength % 2;

    // If drawing off canvas make color red
    // Calculate maximum and minimum coordinates
    const maxCoordinateX =
      mouseCoords[0] + (halfDrawLength + remainderLength - 1) * directionX;
    const maxCoordinateY =
      mouseCoords[1] + (halfDrawLength + remainderLength - 1) * directionY;
    const minCoordinateX = mouseCoords[0] - halfDrawLength * directionX;
    const minCoordinateY = mouseCoords[1] - halfDrawLength * directionY;

    // And translate into an actual canvas position
    const maxX = maxCoordinateX * cellX;
    const maxY = maxCoordinateY * cellY;
    const minX = minCoordinateX * cellX;
    const minY = minCoordinateY * cellY;

    // Check if any cells are outside the canvas boundaries
    const isOutOfBounds =
      maxX >= canvasX || maxY >= canvasY || minX < 0 || minY < 0;

    // Set the fill color based on whether cells are drawn off canvas
    context.fillStyle = isOutOfBounds ? "red" : "blue";

    // Draw the moused over cell from passed coords
    drawCell(mouseCoords[0], mouseCoords[1]);

    // Draw the first half of cells and remainder in one direction
    for (let i = 0; i < halfDrawLength + remainderLength; i += 1) {
      const nextX = mouseCoords[0] + i * directionX;
      const nextY = mouseCoords[1] + i * directionY;
      drawCell(nextX, nextY);
    }

    // Draw the remaining half
    // Draw the remaining cells in the opposite direction
    for (let i = 0; i < halfDrawLength; i += 1) {
      const nextX = mouseCoords[0] - (i + 1) * directionX;
      const nextY = mouseCoords[1] - (i + 1) * directionY;
      drawCell(nextX, nextY);
    }
  };

  const attackHighlight = (
    context,
    canvasX,
    canvasY,
    cellX,
    cellY,
    mouseCoords,
    gm
  ) => {
    // Clear the canvas
    context.clearRect(0, 0, canvasX, canvasY);

    // Highlight the current cell in red
    context.fillStyle = "red";

    // Check if cell coords in gameboard hits or misses
    if (gm.aiBoard.alreadyAttacked(mouseCoords)) return;

    // Highlight the cell
    context.fillRect(
      mouseCoords[0] * cellX,
      mouseCoords[1] * cellY,
      cellX,
      cellY
    );
  };

  return { lines, placementHighlight, attackHighlight };
};

export default draw;
