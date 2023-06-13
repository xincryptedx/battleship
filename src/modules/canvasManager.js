import gridCanvas from "../helpers/gridCanvas";

/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. */
const canvasManager = (() => {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  const placementPH = document.querySelector(".placement-canvas-ph");
  const userPH = document.querySelector(".user-canvas-ph");
  const aiPH = document.querySelector(".ai-canvas-ph");

  // Create the ship placement canvas
  const placementCanvas = gridCanvas(300, 300, { type: "placement" });
  const userCanvas = gridCanvas(300, 300, { type: "user" });
  const aiCanvas = gridCanvas(300, 300, { type: "ai" });

  // Replace the place holders
  placementPH.parentNode.replaceChild(placementCanvas, placementPH);
  userPH.parentNode.replaceChild(userCanvas, userPH);
  aiPH.parentNode.replaceChild(aiCanvas, aiPH);
})();

export default canvasManager;
