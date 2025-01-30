'use client'

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Images } from "./components/Images";
import { processImages } from "@/utils/process-images";
import { initializeModel } from "@/utils/initialize-model";
import { getModelInfo } from "@/utils/get-model-info";
import { isMobileSafari } from "@/utils/is-mobile-safari";
import Image from "next/image";
import useAppShell from "@/store/use-app-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ColorPicker from "./components/ColorPicker";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload, Lock, Wifi } from "lucide-react";

interface AppError {
  message: string;
}

export interface ImageFile {
  id: number;
  file: File;
  processedFile?: File;
  isEditing: boolean;
}

// Sample images from Unsplash
const sampleImages = [
  "https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1513013156887-d2bf241c8c82?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1643490745745-e8ca9a3a1c90?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3"
];

const features = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "100% Private",
    description: "All processing happens locally on your device. No data ever leaves your browser."
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "Offline Support",
    description: "Works without internet once loaded. Perfect for processing sensitive images."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Single click background removal",
    description: "Compress images and videos while maintaining quality."
  }
];


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [, setIsWebGPU] = useState(false);
  const [, setIsIOS] = useState(false);
  const [currentModel, setCurrentModel] = useState<'briaai/RMBG-1.4' | 'Xenova/modnet'>('briaai/RMBG-1.4');
  const [isModelSwitching, setIsModelSwitching] = useState(false);

  const images = useAppShell(state => state.images);
  const addImage = useAppShell(state => state.addImage);
  const updateProcessedImage = useAppShell(state => state.updateProcessedImage);
  
  useEffect(() => {
    if (isMobileSafari()) {
      window.location.href = 'https://bg-mobile.addy.ie';
      return;
    }

    (async () => {
      try {
        const initialized = await initializeModel();
        if (!initialized) {
          throw new Error("Failed to initialize background removal model");
        }
        const { isWebGPUSupported, isIOS: isIOSDevice } = getModelInfo();
        setIsWebGPU(isWebGPUSupported);
        setIsIOS(isIOSDevice);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "An unknown error occurred"
        });
      }
      setIsLoading(false);
    })();
  }, []);

  const handleModelChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value as typeof currentModel;
    setIsModelSwitching(true);
    setError(null);
    try {
      const initialized = await initializeModel(newModel);
      if (!initialized) {
        throw new Error("Failed to initialize new model");
      }
      setCurrentModel(newModel);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Falling back")) {
        setCurrentModel('briaai/RMBG-1.4');
      } else {
        setError({
          message: err instanceof Error ? err.message : "Failed to switch models"
        });
      }
    } finally {
      setIsModelSwitching(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      processedFile: undefined,
      isEditing: false
    }));

    newImages.forEach(image => addImage(image));
    
    for (const image of newImages) {
      try {
        const result = await processImages([image.file]);
        if (result && result.length > 0) {
          updateProcessedImage(image.id, result[0]);
          console.log('result', result[0])
          console.log('images', images)
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  }, [addImage, updateProcessedImage]);

  const handleSampleImageClick = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'sample-image.jpg', { type: 'image/jpeg' });
      onDrop([file]);
    } catch (error) {
      console.error('Error loading sample image:', error);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".mp4"],
    },
  });

  console.log(images)

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl mb-2 font-bold text-red-600">Error</h2>
          <p className="text-xl max-w-[500px] mb-4">{error.message}</p>
          {currentModel === 'Xenova/modnet' && (
            <button
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => handleModelChange({ target: { value: 'briaai/RMBG-1.4' }} as any)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Switch to Cross-browser Version
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading || isModelSwitching) {
    return (
      <div className="min-h-screen text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 mb-4"></div>
          <p className="text-lg text-white">
            {isModelSwitching ? 'Switching models...' : 'Loading background removal model...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center flex flex-col  mb-4 mx-2">
          <span className="text-5xl sm:text-7xl pb-6 font-medium bg-gradient-to-b from-[#FAF7FF] to-[#C3C3C7] bg-clip-text text-transparent">
            Edit Images Privately
          </span>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional-grade image editing powered by AI, running entirely in your browser. 
            No uploads to server, no compromises.
          </p>
        </div>

        {/* Features Grid */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-green-400">
                  {feature.icon}
                </div>
                <span className="text-gray-500">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>

        {/* Upload Section */}
        <div className="flex flex-wrap gap-4 w-full justify-center">
          <div className="flex gap-2">   
            <div className="flex h-[200px] gap-2 border-[hsl(0,0,17)]">
              <label
                htmlFor="image"
                className="group relative flex w-[600px] h-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray shadow-sm transition-all"
              >
                <div
                  {...getRootProps()}
                  className="z-[5] rounded-md flex h-full w-full items-center justify-center border-2 border-[hsl(0,0,17)]"                     
                >
                  <input {...getInputProps()} className="hidden" />
                  <div className={`
                    absolute z-[3] w-full h-full flex flex-col items-center opacity-100 justify-center rounded-md bg-black border-[hsl(0,0,17)] transition-all 
                    ${isDragAccept ? "border-green-500 bg-green-50" : ""}
                    ${isDragReject ? "border-red-500 bg-red-50" : ""}
                    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"}                        
                  `}>
                    <Upload className="h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95 opacity-80" />
                    <p className="mt-2 text-center text-md text-white">
                      Drag and drop images
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      Or click to select files
                    </p>
                  </div>
                </div>
              </label>  
            </div>
          </div>

          {/* Sample Images Section */}
          {images.length === 0 && (
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-800">
              <h3 className="text-xl text-white font-semibold mb-4">No image? Try one of these:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sampleImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleImageClick(url)}
                    className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Image
                      src={url}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                All images are processed locally on your device and are not uploaded to any server.
              </p>
            </div>
          )}
        </div>

        <Images images={images} onDelete={() => {}} />
      </main>
    </div>
  );
}
