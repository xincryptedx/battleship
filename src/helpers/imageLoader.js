/* This helper module is used to load images into arrays for use in the
game log. */

const imageLoader = () => {
  const imageRefs = {
    SP: { hit: [], attack: [], gen: [] },
    AT: { hit: [], attack: [], gen: [] },
    VM: { hit: [], attack: [], gen: [] },
    IG: { hit: [], attack: [], gen: [] },
    L: { hit: [], attack: [], gen: [] },
  };

  const imageContext = require.context("../scene-images", true, /\.jpg$/i);
  const files = imageContext.keys();

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const filePath = imageContext(file);
    const fileName = file.toLowerCase();

    const subDir = file.split("/")[1].toUpperCase();

    if (fileName.includes("hit")) {
      imageRefs[subDir].hit.push(filePath);
    } else if (fileName.includes("attack")) {
      imageRefs[subDir].attack.push(filePath);
    } else if (fileName.includes("gen")) {
      imageRefs[subDir].gen.push(filePath);
    }
  }

  return imageRefs;
};

export default imageLoader;
