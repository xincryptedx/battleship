import events from "./events";

/* This module has three primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
const webInterface = (() => {
  // References to main elements
  const title = document.querySelector(".title");
  const menu = document.querySelector(".menu");
  const placement = document.querySelector(".placement");
  const game = document.querySelector(".game");

  // Reference to current direction for placing ships
  let placementDirection = 0;
  // Method for iterating through directions
  const rotateDirection = () => {
    placementDirection = (placementDirection + 1) % 4;
  };

  // #region Basic methods for showing/hiding elements
  // Move any active sections off the screen
  const hideAll = () => {
    menu.classList.add("hidden");
    placement.classList.add("hidden");
    game.classList.add("hidden");
  };
  events.on("hideAll", hideAll);

  // Show the menu UI
  const showMenu = () => {
    hideAll();
    menu.classList.remove("hidden");
  };
  events.on("showMenu", showMenu);

  // Show the ship placement UI
  const showPlacement = () => {
    hideAll();
    placement.classList.remove("hidden");
  };
  events.on("showPlacement", showPlacement);

  // Show the game UI
  const showGame = () => {
    hideAll();
    game.classList.remove("hidden");
  };
  events.on("showGame", showGame);

  // Shrink the title
  const shrinkTitle = () => {
    title.classList.add("shrink");
  };
  events.on("shrinkTitle", shrinkTitle);
  // #endregion

  // #region High level responses to clicks
  // Hande clicks on the start game button
  const handleStartClick = () => {
    shrinkTitle();
    showPlacement();
  };
  events.on("startClicked", handleStartClick);

  // Handle clicks on the rotate button in the placement section
  const handleRotateClick = () => {
    rotateDirection();
  };
  events.on("rotateClicked", handleRotateClick);

  // Handle clicks on the ship placement grid
  const handlePlacementClick = () => {
    // Send an even trying to place the ship
    // Check the ship placement so the current ship for placement is updated properly
  };

  // Handle clicks on the enemy
  const handleAttackClick = () => {
    // Send event that will attempt to send an attack based on clicked cell
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion
})();

export default webInterface;
