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

  return { lines };
};

export default draw;
