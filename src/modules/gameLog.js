import imageLoader from "../helpers/imageLoader";

const gameLog = ((aiGameboard, userGameboard, userName = "User") => {
  // Ref to log text
  const logText = document.querySelector(".log-text");

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

    // Set the image when you attack based on remaining ships
    if (
      logLower.includes(userName.toLowerCase()) &&
      logLower.includes("attacks")
    ) {
      console.log("USER ATTACK IMG");
    }

    // Set the image when an AI ship sinks

    // Set the image when your ship is hit or sinks

    // Set the image when there is a miss to gen of remaining ships
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
