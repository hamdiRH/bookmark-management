import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Generates a Base64 image URI from a given URL.
 * @param {string} url - The URL of the image.
 * @param {number} width - The desired thumbnail width.
 * @param {number} height - The desired thumbnail height.
 * @returns {string | null} The Base64 image URI, or null if the image fails to load.
 */
export function generateThumbnailAsUri(url:string, width = 150, height = 150) {
  const img = new Image();
  img.crossOrigin = "anonymous"; // Handle CORS if the image is on a different domain.

  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set the canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Handle image loading
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);

    // Convert the canvas to a Base64 image URI
    const dataUri = canvas.toDataURL("image/png");
    console.log("Thumbnail URI:", dataUri); // Log or use the URI directly
    return dataUri;
  };

  img.onerror = () => {
    console.error("Failed to load image at", url);
    return null;
  };

  // Set the source of the image
  img.src = url;
}