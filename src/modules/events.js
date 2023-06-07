const eventsManager = (() => {
  const events = {};

  return {
    emit(eventName, payload) {
      if (events[eventName]) {
        events[eventName].forEach((fn) => fn(payload));
      }
      return this;
    },
    on(eventName, callbackFn) {
      if (typeof callbackFn !== "function") {
        throw new TypeError("Expected a function");
      }
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName].push(callbackFn);
      return this;
    },
    once(eventName, callbackFn) {
      const fn = (...args) => {
        this.off(eventName, fn);
        callbackFn(...args);
      };
      return this.on(eventName, fn);
    },
    off(eventName, callbackFn) {
      if (events[eventName]) {
        for (let i = 0; i < events[eventName].length; i += 1) {
          if (events[eventName][i] === callbackFn) {
            events[eventName].splice(i, 1);
            break;
          }
        }
      }
      return this;
    },
    offAll() {
      Object.keys(events).forEach((eventName) => {
        delete events[eventName];
      });
      return this;
    },
  };
})();

export default eventsManager;
