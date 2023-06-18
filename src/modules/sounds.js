import hitSound from "../Sound Effects/explosion.mp3";
import missSound from "../Sound Effects/miss.mp3";
import attackSound from "../Sound Effects/laser.mp3";

const attackAudio = new Audio(attackSound);
const hitAudio = new Audio(hitSound);
const missAudio = new Audio(missSound);

const sounds = () => {
  const playHit = () => {
    // Reset audio to beginning and play it
    attackAudio.currentTime = 0;
    attackAudio.play();
  };

  return { playHit };
};

export default sounds;
