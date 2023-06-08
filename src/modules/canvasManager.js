import gridCanvas from "../helpers/gridCanvas";

/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. It also draws symbols for hits or misses. */
const canvasManager = (() => {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  const placementPH = document.querySelector(".placement-canvas-ph");

  // Create the ship placement canvas
  const placementCanvas = gridCanvas(300, 300);

  // Add and handle event for canvas clicks
  const cellSizeX = placementCanvas.width / 10; // Width of each cell
  const cellSizeY = placementCanvas.height / 10; // Height of each cell

  const handleClick = (event) => {
    const rect = placementCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedCellX = Math.floor(mouseX / cellSizeX);
    const clickedCellY = Math.floor(mouseY / cellSizeY);

    console.log(`x: ${clickedCellX}, y: ${clickedCellY}`);
  };
  placementCanvas.addEventListener("click", handleClick);

  // Replace the place holders
  placementPH.parentNode.replaceChild(placementCanvas, placementPH);
})();

export default canvasManager;
