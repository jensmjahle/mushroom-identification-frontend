// utils/imageUtils.js
import ExifReader from 'exifreader';

/**
 * Checks EXIF data in an image file
 */
async function checkExif(file) {
  const arrayBuffer = await file.arrayBuffer();
  const tags = ExifReader.load(arrayBuffer);
  return tags;
}

/**
 * Removes metadata from image files and renames them to mushroomX.jpg
 * based on existing file names in uploadedFiles
 */
export async function processImageFiles(files, existingFiles = [], customNames = []) {
  const processedFiles = [];
  let error = null;

  const existingNames = existingFiles.map(f => f.name);
  let index = 1;

  function getUniqueMushroomName(defaultName) {
    while (existingNames.includes(defaultName)) {
      defaultName = defaultName.replace(/(\d+)?\.jpg$/, `${index++}.jpg`);
    }
    existingNames.push(defaultName);
    return defaultName;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) {
      error = 'Only image files are allowed.';
      continue;
    }

    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) {
      error = 'Could not process image.';
      continue;
    }

    const preferredName = customNames[i] ?? `mushroom${index}.jpg`;
    const newFileName = getUniqueMushroomName(preferredName);
    const newFile = new File([blob], newFileName, { type: 'image/jpeg' });

    processedFiles.push(newFile);
  }

  return { processedFiles, error };
}
