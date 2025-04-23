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
export async function processImageFiles(files, existingFiles = []) {
  const processedFiles = [];
  let error = null;

  // Count how many mushroomX.jpg names are in the existing files
  const existingNames = existingFiles.map(f => f.name);
  let index = 1;

  function getUniqueMushroomName() {
    while (existingNames.includes(`mushroom${index}.jpg`)) {
      index++;
    }
    const name = `mushroom${index}.jpg`;
    existingNames.push(name);
    return name;
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      error = 'Only image files are allowed.';
      console.warn('Rejected file: Not an image file', file.name);
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
      console.error('Error: Unable to create blob for', file.name);
      continue;
    }

    const newFileName = getUniqueMushroomName();
    const newFile = new File([blob], newFileName, { type: 'image/jpeg' });

    const strippedExif = await checkExif(newFile);

    // Check for sensitive tags
    const sensitiveTags = [
      'GPSLatitude', 'GPSLongitude', 'DateTimeOriginal',
      'Make', 'Model', 'Software', 'Artist'
    ];

    const stillPresent = sensitiveTags.filter(tag => tag in strippedExif);

    if (stillPresent.length === 0) {
      console.log(`${newFile.name} has successfully been stripped of metadata.`);
    } else {
      console.warn(`${newFile.name} still contains sensitive metadata:`, stillPresent);
    }

    processedFiles.push(newFile);
  }

  return { processedFiles, error };
}
