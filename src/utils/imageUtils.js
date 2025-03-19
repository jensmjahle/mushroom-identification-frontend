export const removeMetadataAndConvertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("File reading failed"));
        return;
      }

      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]); // Remove metadata & convert to Base64
      };

      img.onerror = () => reject(new Error("Image loading failed"));
    };

    reader.onerror = (error) => reject(error);
  });
};
