const fs = require("fs");
const path = require("path");

const imageLoader = () => {
  const imageRefs = {
    sp: { hit: [], attack: [], gen: [] },
    at: { hit: [], attack: [], gen: [] },
    vm: { hit: [], attack: [], gen: [] },
    ig: { hit: [], attack: [], gen: [] },
    l: { hit: [], attack: [], gen: [] },
  };

  const sceneImagesDir = path.join(__dirname, "../scene-images");

  const subDirs = ["SP", "AT", "VM", "IG", "L"];

  for (let i = 0; i < subDirs.length; i += 1) {
    const subDir = subDirs[i];
    const subDirPath = path.join(sceneImagesDir, subDir);

    const files = fs.readdirSync(subDirPath);

    for (let j = 0; j < files.length; j += 1) {
      const file = files[j];
      if (file.endsWith(".jpg")) {
        const filePath = path.join(subDirPath, file);
        const fileName = file.toLowerCase();

        if (fileName.includes("hit")) {
          imageRefs[subDir.toLowerCase()].hit.push(filePath);
        } else if (fileName.includes("attack")) {
          imageRefs[subDir.toLowerCase()].attack.push(filePath);
        } else if (fileName.includes("gen")) {
          imageRefs[subDir.toLowerCase()].gen.push(filePath);
        }
      }
    }
  }

  return imageRefs;
};

export default imageLoader;
