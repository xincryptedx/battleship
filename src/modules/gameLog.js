import imageLoader from "../helpers/imageLoader";

const gameLog = ((userName = "User") => {
  // Add a property to store the gameboard
  let userGameboard = null;

  // Setter method to set the gameboard
  const setUserGameboard = (gameboard) => {
    userGameboard = gameboard;
  };

  // Ref to log text
  const logText = document.querySelector(".log-text");
  const logImg = document.querySelector(".scene-img");

  // Log scene handling
  let sceneImages = null;
  // Method for loading scene images. Must be run once in game manager.
  const loadScenes = () => {
    sceneImages = imageLoader();
  };

  // Sets the scene image based on params passed
  const setScene = () => {
    // Set the text to lowercase for comparison
    const logLower = logText.textContent.toLowerCase();

    // Refs to ship types and their dirs
    const shipTypes = ["sentinel", "assault", "viper", "iron", "leviathan"];
    const typeToDir = {
      sentinel: "SP",
      assault: "AT",
      viper: "VM",
      iron: "IG",
      leviathan: "L",
    };

    // Helper for getting random array entry
    function randomEntry(array) {
      const lastIndex = array.length - 1;
      const randomNumber = Math.floor(Math.random() * (lastIndex + 1));
      return randomNumber;
    }

    // Helper for getting random ship type from those remaining
    const dirNames = { 0: "SP", 1: "AT", 2: "VM", 3: "IG", 4: "L" };
    function randomShipDir(gameboard = userGameboard) {
      let randomNumber = Math.floor(Math.random() * 5);
      while (gameboard.ships[randomNumber].isSunk()) {
        randomNumber = Math.floor(Math.random() * 5);
      }
      return dirNames[randomNumber];
    }

    // Set the image when you attack based on remaining ships
    if (
      logLower.includes(userName.toLowerCase()) &&
      logLower.includes("attacks")
    ) {
      // Get random ship
      const shipDir = randomShipDir();
      // Get random img from appropriate place
      const entry = randomEntry(sceneImages[shipDir].attack);
      // Set the image
      logImg.src = sceneImages[shipDir].attack[entry];
    }

    // Set the image when ship hit
    if (logLower.includes("hit your")) {
      shipTypes.forEach((type) => {
        if (logLower.includes(type)) {
          // Set the ship directory based on type
          const shipDir = typeToDir[type];
          // Get a random hit entry
          const entry = randomEntry(sceneImages[shipDir].hit);
          // Set the image
          logImg.src = sceneImages[shipDir].hit[entry];
        }
      });
    }

    // Set the image when there is an ai miss to gen of remaining ships
    if (logLower.includes("ai attacks") && logLower.includes("missed")) {
      // Get random remaining ship dir
      const shipDir = randomShipDir();
      // Get random entry from there
      const entry = randomEntry(sceneImages[shipDir].gen);
      // Set the image
      logImg.src = sceneImages[shipDir].gen[entry];
    }
  };

  // Erase the log text
  const erase = () => {
    logText.textContent = "";
  };

  // Add to log text
  const append = (stringToAppend) => {
    if (stringToAppend) {
      logText.innerHTML += `\n${stringToAppend.toString()}`;
    }
  };

  return { erase, append, setScene, loadScenes, setUserGameboard };
})();

export default gameLog;
