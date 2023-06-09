/* eslint-disable no-console */
import events from "../modules/events";

const logger = () => {
  const useLogger = true; // set to false if you don't want to use the logger, or just dont' import it in index

  const log = () => {
    console.log(`an event fired`);
  };

  if (useLogger) {
    events.on("hideAll", log);
    events.on("showMenu", log);
    events.on("showPlacement", log);
    events.on("showGame", log);
    events.on("shrinkTitle", log);
    events.on("rotateClicked", log);
    events.on("startClicked", log);
    events.on("placementClicked", log);
  }
};

export default logger;
