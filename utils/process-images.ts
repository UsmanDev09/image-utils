import { processImage } from "./process-image";

export async function processImages(images: File[]): Promise<File[]> {
    console.log("Processing images...");
    const processedFiles: File[] = [];
    
    for (const image of images) {
      try {
        const processedFile = await processImage(image);
        processedFiles.push(processedFile);
        console.log("Successfully processed image", image.name);
      } catch (error) {
        console.error("Error processing image", image.name, error);
      }
    }
    
    console.log("Processing images done");
    return processedFiles;
  }