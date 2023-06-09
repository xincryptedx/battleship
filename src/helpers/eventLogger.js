/* eslint-disable no-console */
import events from "../modules/events";

const useLogger = true; // set to false if you don't want to use the logger, or just dont' import it in index

if (useLogger) {
  events.on("hideAll", console.log("hideALl fired"));
  events.on("showMenu", console.log("showMenu fired"));
  events.on("showPlacement", console.log("showPlacement fired"));
  events.on("showGame", console.log("showGame fired"));
  events.on("shrinkTitle", console.log("shrinkTitle fired"));
  events.on("rotateClicked", console.log("rotateClicked fired"));
  events.on("startClicked", console.log("startClicked fired"));
  events.on("placementClicked", console.log("placementClicked fired"));
}
