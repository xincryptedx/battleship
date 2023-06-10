import gridCanvas from "../helpers/gridCanvas";

/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. */
const canvasManager = (() => {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  const placementPH = document.querySelector(".placement-canvas-ph");

  // Create the ship placement canvas
  const placementCanvas = gridCanvas(300, 300, { type: "placement" });

  // Replace the place holders
  placementPH.parentNode.replaceChild(placementCanvas, placementPH);
})();

export default canvasManager;
