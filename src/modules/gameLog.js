// Loads scene images for use
const sceneImages = { sp: {}, at: {}, vm: {}, ig: {}, l: {} };
const loadScenes = () => {
  // Urls for all scene images
  const urls = {
    sp: {
      gen: [
        "../scene-images/Sentinel Probe/sp_gen1",
        "../scene-images/Sentinel Probe/sp_gen2",
        "../scene-images/Sentinel Probe/sp_gen3",
        "../scene-images/Sentinel Probe/sp_gen4",
      ],
      attack: [
        "../scene-images/Sentinel Probe/sp_attack1",
        "../scene-images/Sentinel Probe/sp_attack2",
        "../scene-images/Sentinel Probe/sp_attack3",
        "../scene-images/Sentinel Probe/sp_attack4",
      ],
      hit: [
        "../scene-images/Sentinel Probe/sp_hit1",
        "../scene-images/Sentinel Probe/sp_hit2",
        "../scene-images/Sentinel Probe/sp_hit3",
      ],
    },
  };

  // Load sentinel probe images for use
  Object.keys(urls.sp).forEach((key) => {
    // stuff
  });
};

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

  // Sets the scene image based on params passed
  const scene = (unit, state) => {
    // Set the img based on params
  };

  return { erase, append };
})();

export default gameLog;
