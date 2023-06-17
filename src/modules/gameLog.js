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

  // Set the scene image in the log
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
      // Set the property that holds imgs to array
      sceneImages.sp[key] = [];
      // Add imgs to that array
      urls.sp[key].forEach((url) => {
        const image = new Image();
        image.src = url;
        sceneImages.sp[key].push(image);
      });
    });
  };

  // Sets the scene image based on params passed
  const scene = (unit, state) => {
    // Set the img based on params
  };

  return { erase, append, loadScenes };
})();

export default gameLog;
