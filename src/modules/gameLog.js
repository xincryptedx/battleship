import imageLoader from "../helpers/imageLoader";

const gameLog = (() => {
  // Ref to log text
  const logText = document.querySelector(".log-text");

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

  // Log scene handling
  let sceneImages = null;
  // Method for loading scene images. Must be run once in game manager.
  const loadScenes = () => {
    sceneImages = imageLoader();
  };

  // Sets the scene image based on params passed
  const setScene = () => {
    // Set the img based on log text
  };

  return { erase, append, loadScenes };
})();

export default gameLog;
