import imageLoader from "../helpers/imageLoader";

const gameLog = ((aiGameboard, userGameboard, userName = "User") => {
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

    // Refs to ship types
    const shipTypes = ["sentinel", "assault", "viper", "iron", "leviathan"];

    // Helper for getting random array entry
    function randomEntry(array) {
      const lastIndex = array.length - 1;
      const randomNumber = Math.floor(Math.random() * (lastIndex + 1));
      return randomNumber;
    }

    // Helper for getting random ship type from those remaining
    const dirNames = { 1: "SP", 2: "AT", 3: "VM", 4: "IG", 5: "L" };
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
      console.log("USER ATTACK IMG");
      // Get random ship
      const shipDir = randomShipDir();
      // Get random img from appropriate place
      const entry = randomEntry(sceneImages[shipDir].attack);
      // Check user remaining ships
      logImg.src = sceneImages.SP.attack[entry];
    }

    // Set the image when ship hit
    if (logLower.includes("hit your")) {
      shipTypes.forEach((type) => {
        if (logLower.includes(type)) {
          console.log(`HIT YOUR ${type} IMG`);
        }
      });
    }

    // Set the image when ship sinks
    if (logLower.includes("destroyed")) {
      shipTypes.forEach((type) => {
        if (logLower.includes(type)) {
          console.log(`DESTROYED ${type} IMG`);
        }
      });
    }

    // Set the image when there is an ai miss to gen of remaining ships
    if (logLower.includes("ai attacks") && logLower.includes("missed")) {
      console.log("MISSED USER IMG");
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

  return { erase, append, setScene, loadScenes };
})();

export default gameLog;
