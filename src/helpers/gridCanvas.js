function createGridCanvas(sizeX, sizeY) {
  // #region Create the canvas element and draw grid
  const canvas = document.createElement("canvas");
  canvas.width = sizeX;
  canvas.height = sizeY;
  const ctx = canvas.getContext("2d");

  // Set transparent background
  ctx.clearRect(0, 0, sizeX, sizeY);

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

  // #endregion

  // #region Add event handlers for clicks, mousemove, and mouseleave
  // Set the cell size refs
  const cellSizeX = canvas.width / 10; // Width of each cell
  const cellSizeY = canvas.height / 10; // Height of each cell

  // Add and handle event for canvas clicks
  const handleClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedCellX = Math.floor(mouseX / cellSizeX);
    const clickedCellY = Math.floor(mouseY / cellSizeY);

    console.log(`x: ${clickedCellX}, y: ${clickedCellY}`);
  };
  canvas.addEventListener("click", handleClick);

  // Add and handle event for mousemove
  const handleMousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const hoveredCellX = Math.floor(mouseX / cellSizeX);
    const hoveredCellY = Math.floor(mouseY / cellSizeY);

    // Apply hover effect to the hovered cell
    // const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the grid
    for (let x = 0; x < 10; x += 1) {
      for (let y = 0; y < 10; y += 1) {
        const cellX = x * cellSizeX;
        const cellY = y * cellSizeY;

        if (x === hoveredCellX && y === hoveredCellY) {
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

  // #region Add event handlers for touch start and touch end
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
  document.addEventListener("touchstart", handleTouchstart);

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
  document.addEventListener("touchmove", handleTouchmove);

  // Add and handle event for touchend and touchcancel
  const handleTouchend = (event) => {
    event.preventDefault();
    const touches = event.changedTouches;
    const touch = touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    const endedCellX = Math.floor(touchX / cellSizeX);
    const endedCellY = Math.floor(touchY / cellSizeY);

    console.log(`x: ${endedCellX}, y: ${endedCellY}`);
    clearCanvas();
  };
  const handleTouchcancel = (event) => {
    event.preventDefault();
    clearCanvas();
  };
  document.addEventListener("touchend", handleTouchend);
  document.addEventListener("touchcancel", handleTouchcancel);

  // #endregion

  // #endregion

  return canvas;
}

export default createGridCanvas;
