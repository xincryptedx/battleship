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
      logText.textContent += `\n${stringToAppend.toString()}`;
    }
  };

  return { erase, append };
})();

export default gameLog;
