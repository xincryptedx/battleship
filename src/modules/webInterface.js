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
  const reset = document.querySelector(".reset");

  // References to btn elements
  const startBtn = document.querySelector(".start-btn");
  const aiMatchBtn = document.querySelector(".ai-match-btn");

  const randomShipsBtn = document.querySelector(".random-ships-btn");
  const rotateBtn = document.querySelector(".rotate-btn");

  const resetBtn = document.querySelector(".reset-btn");

  // References to ship info icons and text
  const placementIcons = document.querySelectorAll(".ships-to-place .icon");
  const placementShipName = document.querySelector(
    ".ships-to-place .ship-name-text"
  );

  const userIcons = document.querySelectorAll(".user-info .icon");
  const aiIcons = document.querySelectorAll(".ai-info .icon");

  // Method for iterating through directions
  const rotateDirection = () => {
    gm.rotateClicked();
  };

  // #region Add/remove classes to ship divs to represent placed/destroyed
  // Indicate what ship is being placed by the user
  const updatePlacementName = (shipToPlaceNum) => {
    let shipName = null;
    switch (shipToPlaceNum) {
      case 0:
        shipName = "Sentinel Probe";
        break;
      case 1:
        shipName = "Assault Titan";
        break;
      case 2:
        shipName = "Viper Mech";
        break;
      case 3:
        shipName = "Iron Goliath";
        break;
      case 4:
        shipName = "Leviathan";
        break;
      default:
        shipName = "Ship Name";
    }

    placementShipName.textContent = shipName;
  };

  const updatePlacementIcons = (shipToPlaceNum) => {
    for (let i = 0; i < placementIcons.length; i += 1) {
      // If the index = ship to place num then highlight that icon by removing class
      if (shipToPlaceNum === i) {
        placementIcons[i].classList.remove("inactive");
      }
      // Else it is not the active ship icon so make it inactive
      else {
        placementIcons[i].classList.add("inactive");
      }
    }
  };

  // #endregion

  // #region Basic methods for showing/hiding elements
  // Move any active sections off the screen
  const hideAll = () => {
    menu.classList.add("hidden");
    placement.classList.add("hidden");
    game.classList.add("hidden");
    reset.classList.add("hidden");
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
    // Update icons and text to first ship as that is always first placed
    updatePlacementIcons(0);
    updatePlacementName(0);
  };

  // Show the game UI
  const showGame = () => {
    hideAll();
    game.classList.remove("hidden");
    reset.classList.remove("hidden");
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

  // Handle reset button click
  const handleResetClick = () => {
    window.location.reload();
  };

  // #endregion

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
  startBtn.addEventListener("click", handleStartClick);
  aiMatchBtn.addEventListener("click", handleAiMatchClick);
  randomShipsBtn.addEventListener("click", handleRandomShipsClick);
  resetBtn.addEventListener("click", handleResetClick);

  return {
    showGame,
    showMenu,
    showPlacement,
    updatePlacementIcons,
    updatePlacementName,
  };
};

export default webInterface;
