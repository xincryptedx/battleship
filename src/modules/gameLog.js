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
  const loadScenes = () => {
    sceneImages = imageLoader();
  };

  // Sets the scene image based on params passed
  const scene = (unit, state) => {
    // Set the img based on params
  };

  return { erase, append, loadScenes };
})();

export default gameLog;
