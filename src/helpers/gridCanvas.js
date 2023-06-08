function createGridCanvas(sizeX, sizeY) {
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

  return canvas;
}

export default createGridCanvas;
