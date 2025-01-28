'use client'

import useAppShell from "@/store/use-app-shell";
import Image from "next/image";
import CarouselOrientation from "@/app/components/Carousel";
import EditorOptions from "@/app/components/EditorOptions";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Edit() {
  const { images } = useAppShell();
  const imageToEdit = images?.filter((image) => image.isEditing)[0];
  const [, setPreviousUrl] = useState('');
  const [url, setUrl] = useState(''); // Remove initial state that depends on imageToEdit
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { updateImageEditing } = useAppShell.getState();

  // Set URL when imageToEdit changes
  useEffect(() => {
    if (imageToEdit?.processedFile) {
      setUrl(URL.createObjectURL(imageToEdit.processedFile));
    }
  }, [imageToEdit]);

  function onSelectImage(id: number) {
    if (!images) return; // Add guard clause
    
    setPreviousUrl(url);
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (imageToEdit?.id) { // Add null check
        updateImageEditing(imageToEdit.id, false);
      }
      updateImageEditing(id, true);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 50);
  }

  // Add loading state
  if (!images) {
    return <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      Loading...
    </div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden z-10">
      <div className="h-full flex flex-col lg:flex-row p-4">
        <div className="flex-1 flex flex-col gap-4 min-w-0 h-full z-10">
          <div className="flex-1 min-h-0 relative rounded-none overflow-hidden z-10 bg-transparent" 
          style={{ viewTransitionName: 'editor-main' }}>
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #333 25%, transparent 25%),
                  linear-gradient(-45deg, #333 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #333 75%),
                  linear-gradient(-45deg, transparent 75%, #333 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            {url && (
              <div className="absolute inset-0 editor-image-container">
                <Image 
                  src={url}
                  alt="image to edit"
                  fill
                  className={`object-contain transition-all duration-250 ease-out ${
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}               
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          <Card className="h-[160px] shadow-none border-none bg-black" style={{ viewTransitionName: 'carousel' }}> 
            <CarouselOrientation images={images} onSelectImage={onSelectImage} />
          </Card>
        </div>
    
        <div style={{ viewTransitionName: 'editor-options' }} >
          {imageToEdit && <EditorOptions image={imageToEdit} setUrl={setUrl}/>}
        </div>
      </div>
    </div>
  );
}