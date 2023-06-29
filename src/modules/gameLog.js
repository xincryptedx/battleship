import imageLoader from "../helpers/imageLoader";

const gameLog = ((userName = "User") => {
  // Flag for turning off scene updates
  let doUpdateScene = true;
  // Flag for locking the log
  let doLock = false;

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

  // Gets a random array entry
  function randomEntry(array) {
    const lastIndex = array.length - 1;
    const randomNumber = Math.floor(Math.random() * (lastIndex + 1));
    return randomNumber;
  }

  // Gets a random user ship that isn't destroyed
  const dirNames = { 1: "SP", 2: "AT", 3: "VM", 4: "IG", 5: "L" };
  function randomShipDir(gameboard = userGameboard) {
    const remainingShips = [];
    for (let i = 0; i < gameboard.ships.length; i += 1) {
      if (!gameboard.ships[i].isSunk())
        remainingShips.push(gameboard.ships[i].index);
    }

    // Handle the case when all ships are sunk
    if (remainingShips.length === 0) {
      const randomNumber = Math.floor(Math.random() * 5);
      return dirNames[randomNumber + 1]; // dirNames start at index 1
    }

    // Otherwise return random remaining ship
    const randomNumber = Math.floor(Math.random() * remainingShips.length);
    return dirNames[remainingShips[randomNumber]];
  }

  // Initializes scene image to gen image
  const initScene = () => {
    // get random ship dir
    const shipDir = dirNames[Math.floor(Math.random() * 5)];
    // get random array entry
    const entry = randomEntry(sceneImages[shipDir].gen);
    // set the image
    logImg.src = sceneImages[shipDir].gen[entry];
  };

  // Sets the scene image based on params passed
  const setScene = () => {
    // Return if log flag set to not update
    if (!doUpdateScene) return;
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

    // Helper for getting random ship type from those remaining

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
    if (doLock) return;
    logText.textContent = "";
  };

  // Add to log text
  const append = (stringToAppend) => {
    if (doLock) return;
    if (stringToAppend) {
      logText.innerHTML += `\n${stringToAppend.toString()}`;
    }
  };

  return {
    erase,
    append,
    setScene,
    loadScenes,
    setUserGameboard,
    initScene,
    get doUpdateScene() {
      return doUpdateScene;
    },
    set doUpdateScene(bool) {
      if (bool === true || bool === false) {
        doUpdateScene = bool;
      }
    },
    get doLock() {
      return doLock;
    },
    set doLock(bool) {
      if (bool === true || bool === false) {
        doLock = bool;
      }
    },
  };
})();

export default gameLog;
