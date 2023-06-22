/* eslint-disable no-param-reassign */
/* This module has three primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
const webInterface = (gm) => {
  // References to main elements
  const title = document.querySelector(".title");
  const menu = document.querySelector(".menu");
  const placement = document.querySelector(".placement");
  const game = document.querySelector(".game");

  // Reference to btn elements
  const startBtn = document.querySelector(".start-btn");
  const aiMatchBtn = document.querySelector(".ai-match-btn");
  const rotateBtn = document.querySelector(".rotate-btn");

  // Method for iterating through directions
  const rotateDirection = () => {
    gm.rotateClicked();
  };

  // #region Basic methods for showing/hiding elements
  // Move any active sections off the screen
  const hideAll = () => {
    menu.classList.add("hidden");
    placement.classList.add("hidden");
    game.classList.add("hidden");
  };

  // Show the menu UI
  const showMenu = () => {
    hideAll();
    menu.classList.remove("hidden");
  };

  // Show the ship placement UI
  const showPlacement = () => {
    hideAll();
    placement.classList.remove("hidden");
  };

  // Show the game UI
  const showGame = () => {
    hideAll();
    game.classList.remove("hidden");
  };

  // Shrink the title
  const shrinkTitle = () => {
    title.classList.add("shrink");
  };

  // #endregion

  // #region High level responses to clicks
  // Hande clicks on the start game button
  const handleStartClick = () => {
    shrinkTitle();
    showPlacement();
  };

  // Handle clicks on the rotate button in the placement section
  const handleRotateClick = () => {
    rotateDirection();
  };

  const handleAiMatchClick = () => {
    // Set style class based on if userBoard is ai (if false, set active b/c will be true after click)
    if (gm.userBoard.isAi === false) aiMatchBtn.classList.add("active");
    else aiMatchBtn.classList.remove("active");
    gm.aiMatchClicked();
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  aiMatchBtn.addEventListener("click", handleAiMatchClick);

  return { showGame, showMenu, showPlacement };
};

export default webInterface;
