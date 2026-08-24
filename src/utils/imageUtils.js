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

// Longest edge a processed photo is allowed to keep, and the JPEG quality it's
// re-encoded at. Phone cameras routinely produce 4000px+, multi-megabyte
// originals; mushroom identification doesn't need anywhere near that much
// detail, so downscaling here keeps uploads fast and small without a
// meaningfully worse photo to work from.
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

/**
 * Removes metadata from image files, downscales them to a sensible size, and
 * renames them to mushroomX.jpg based on existing file names in uploadedFiles
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
    const scale = Math.min(1, MAX_DIMENSION / Math.max(imageBitmap.width, imageBitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(imageBitmap.width * scale);
    canvas.height = Math.round(imageBitmap.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
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
