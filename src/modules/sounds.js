/* This module is used to play the games sound effects. As there are
not many sounds in total, each sound gets its own method for playing. */

import hitSound from "../Sound Effects/explosion.mp3";
import missSound from "../Sound Effects/miss.mp3";
import attackSound from "../Sound Effects/laser.mp3";

const attackAudio = new Audio(attackSound);
const hitAudio = new Audio(hitSound);
const missAudio = new Audio(missSound);

const sounds = () => {
  // Flag for muting
  let isMuted = false;

  const playHit = () => {
    if (isMuted) return;
    // Reset audio to beginning and play it
    hitAudio.currentTime = 0;
    hitAudio.play();
  };

  const playMiss = () => {
    if (isMuted) return;
    // Reset audio to beginning and play it
    missAudio.currentTime = 0;
    missAudio.play();
  };

  const playAttack = () => {
    if (isMuted) return;
    // Reset audio to beginning and play it
    attackAudio.currentTime = 0;
    attackAudio.play();
  };

  return {
    playHit,
    playMiss,
    playAttack,
    get isMuted() {
      return isMuted;
    },
    set isMuted(bool) {
      if (bool === true || bool === false) isMuted = bool;
    },
  };
};

export default sounds;
