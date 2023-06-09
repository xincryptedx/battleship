import events from "./events";
/* Events subbed: 
    hideAll showMenu  showPlacement
    showGame  shrinkTitle startClicked
    rotateClicked placementClicked

   Events pubbed:
    tryPlacement
*/

/* This module has three primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
const webInterface = () => {
  // References to main elements
  const title = document.querySelector(".title");
  const menu = document.querySelector(".menu");
  const placement = document.querySelector(".placement");
  const game = document.querySelector(".game");

  // Reference to current direction for placing ships and to object for turning it into string
  let placementDirection = 0;
  const directions = { 0: "N", 1: "E", 2: "S", 3: "W" };
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

  // Handle clicks on the ship placement grid by using payload.position
  const handlePlacementClick = (payload) => {
    // Send an event trying to place the ship
    events.emit("tryPlacement", {
      position: payload.position,
      direction: directions[placementDirection],
    });
  };

  // Handle clicks on the enemy
  const handleAttackClick = () => {
    // Send event that will attempt to send an attack based on clicked cell
  };

  // #endregion

  // #region Add classes to ship divs to represent placed/destroyed

  // #endregion

  // Sub to event listeners
  events.on("hideAll", hideAll);
  events.on("showMenu", showMenu);
  events.on("showPlacement", showPlacement);
  events.on("showGame", showGame);
  events.on("shrinkTitle", shrinkTitle);
  events.on("rotateClicked", handleRotateClick);
  events.on("startClicked", handleStartClick);
  events.on("placementClicked", handlePlacementClick);
};

export default webInterface;
