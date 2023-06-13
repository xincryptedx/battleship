import gridCanvas from "./gridCanvas";

/* This module creates canvas elements and adds them to the appropriate 
   places in the DOM. */
const canvasAdder = (userGameboard, aiGameboard) => {
  // Replace the three grid placeholder elements with the proper canvases
  // Refs to DOM elements
  const placementPH = document.querySelector(".placement-canvas-ph");
  const userPH = document.querySelector(".user-canvas-ph");
  const aiPH = document.querySelector(".ai-canvas-ph");

  // Create the ship placement canvas
  const placementCanvas = gridCanvas(
    300,
    300,
    { type: "placement" },
    userGameboard
  );
  const userCanvas = gridCanvas(300, 300, { type: "user" }, userGameboard);
  const aiCanvas = gridCanvas(300, 300, { type: "ai" }, aiGameboard);

  // Replace the place holders
  placementPH.parentNode.replaceChild(placementCanvas, placementPH);
  userPH.parentNode.replaceChild(userCanvas, userPH);
  aiPH.parentNode.replaceChild(aiCanvas, aiPH);
};

export default canvasAdder;