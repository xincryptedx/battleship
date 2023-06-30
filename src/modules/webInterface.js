/* eslint-disable no-param-reassign */
/* This module is responsible for setting up event handlers for the
  main UI buttons, and has methods used by those handlers that change
  the state of the UI by changing various element classes.
  
  This allows for methods that transition from one part of the game to the next. */
const webInterface = (gm) => {
  // References to main elements
  const title = document.querySelector(".title");
  const menu = document.querySelector(".menu");
  const placement = document.querySelector(".placement");
  const game = document.querySelector(".game");

  // Reference to btn elements
  const startBtn = document.querySelector(".start-btn");
  const aiMatchBtn = document.querySelector(".ai-match-btn");

  const randomShipsBtn = document.querySelector(".random-ships-btn");
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

  const handleAiMatchClick = () => {
    // Set style class based on if userBoard is ai (if false, set active b/c will be true after click)
    if (gm.aiBoard.isAutoAttacking === false)
      aiMatchBtn.classList.add("active");
    else aiMatchBtn.classList.remove("active");
    gm.aiMatchClicked();
  };

  // Handle clicks on the rotate button in the placement section
  const handleRotateClick = () => {
    rotateDirection();
  };

  // Handle random ships button click
  const handleRandomShipsClick = () => {
    gm.randomShipsClicked();
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  aiMatchBtn.addEventListener("click", handleAiMatchClick);
  randomShipsBtn.addEventListener("click", handleRandomShipsClick);

  return { showGame, showMenu, showPlacement };
};

export default webInterface;
