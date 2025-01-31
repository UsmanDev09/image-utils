import { RawImage } from "@huggingface/transformers";
import useAppShell from "../store/use-app-shell";

export async function processImage(image: File): Promise<File> {
    const { model, processor } = useAppShell.getState();

    if (!model || !processor) {
      throw new Error("Model not initialized. Call initializeModel() first.");
    }
  
    console.log('Image', image);
  
    const img = await RawImage.fromURL(URL.createObjectURL(image));
    
    console.log('URL.createObjectUrl', URL.createObjectURL(image))
    console.log('RAW image', img)
  
    try {
      // Pre-process image
      const { pixel_values } = await processor(img);
      console.log('pixel values', pixel_values)
      
      // Predict alpha matte
      const { output } = await model({ input: pixel_values });
      console.log('predict alpha matte', output)
  
      // Resize mask back to original size
      const maskData = (
        await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
          img.width,
          img.height,
        )
      ).data;
  
      console.log('mask data', maskData)
  
      // Create new canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if(!ctx) throw new Error("Could not get 2d context");
      
      // Draw original image output to canvas
      ctx.drawImage(img.toCanvas(), 0, 0);
  
      // Update alpha channel
      const pixelData = ctx.getImageData(0, 0, img.width, img.height);
      for (let i = 0; i < maskData.length; ++i) {
        pixelData.data[4 * i + 3] = maskData[i];
      }
      ctx.putImageData(pixelData, 0, 0);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => 
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("Failed to create blob")), 
          "image/png"
        )
      );
      
      const [fileName] = image.name.split(".");
      const processedFile = new File([blob], `${fileName}-bg-blasted.png`, { type: "image/png" });
      return processedFile;
    } catch (error) {
      console.error("Error processing image:", error);
      throw new Error("Failed to process image");
    }
  }