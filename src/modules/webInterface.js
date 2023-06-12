import events from "./events";
/* Events subbed: 
    hideAll showMenu  showPlacement
    showGame  shrinkTitle startClicked
    rotateClicked

    Events pubbed:
    directionChanged
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

  // Reference to sub elements
  const rotateBtn = document.querySelector(".rotate-btn");

  // Reference to current direction for placing ships
  let placementDirection = 1; // Vertical by default

  // Method for iterating through directions
  const rotateDirection = () => {
    placementDirection = placementDirection === 0 ? 1 : 0;
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
    events.emit("directionChanged", placementDirection);
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

  // Handle browser events
  rotateBtn.addEventListener("click", handleRotateClick);
};

export default webInterface;
