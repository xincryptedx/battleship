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
          "../scene-images/Sentinel Probe/sp_gen1.jpg",
          "../scene-images/Sentinel Probe/sp_gen2.jpg",
          "../scene-images/Sentinel Probe/sp_gen3.jpg",
          "../scene-images/Sentinel Probe/sp_gen4.jpg",
        ],
        attack: [
          "../scene-images/Sentinel Probe/sp_attack1.jpg",
          "../scene-images/Sentinel Probe/sp_attack2.jpg",
          "../scene-images/Sentinel Probe/sp_attack3.jpg",
          "../scene-images/Sentinel Probe/sp_attack4.jpg",
        ],
        hit: [
          "../scene-images/Sentinel Probe/sp_hit1.jpg",
          "../scene-images/Sentinel Probe/sp_hit2.jpg",
          "../scene-images/Sentinel Probe/sp_hit3.jpg",
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
