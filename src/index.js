/* eslint-disable no-unused-vars */
import "./style/reset.css";
import "./style/style.css";
import gameManager from "./modules/gameManager";
import canvasManager from "./modules/canvasManager";
import webInterface from "./modules/webInterface";

// import events for testing in dev tools
import events from "./modules/events";
// Import events logger
import eventsLogger from "./helpers/eventLogger";

eventsLogger();
window.events = events;

// Initialize modules
gameManager();
webInterface();
