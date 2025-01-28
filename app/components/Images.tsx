import React, { useState } from "react";
import { EditModal } from "./EditModal";
import Image from "next/image";
import ShineBorder from "@/components/ui/shine-border";
import { DockIcons } from "./DockIcons";

interface ImageFile {
    id: number;
    file: File;
    processedFile?: File;
    isEditing: boolean;
  }

interface ImagesProps {
  images: ImageFile[];
  onDelete: (id: number) => void;
}

export function Images({ images, onDelete }: ImagesProps) {
  return (
    <div>
      <h2 className="hidden text-gray-800 text-xl font-semibold mb-4">Images: {images.length}</h2>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => {
          if(image.file.type.includes("video")) {
            return <Video video={image} key={image.id} />;
          } else {
            return <ImageSpot image={image} onDelete={onDelete} key={image.id} />;
          }
        })}
      </div>
    </div>
  );
}

function Video({ video }: { video: ImageFile }) {
  const url = URL.createObjectURL(video.file);
  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      <video
        className="rounded-lg aspect-square object-cover"
        loop
        muted
        autoPlay
        src={url}
      ></video>
    </div>
  );
}

interface ImageSpotProps {
  image: ImageFile;
  onDelete: (id: number) => void;
}

function ImageSpot({ image, onDelete }: ImageSpotProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState("");

  const url = URL.createObjectURL(image.file);
  const processedURL = image.processedFile ? URL.createObjectURL(image.processedFile) : "";
  const isProcessing = !image.processedFile;

  const handleEditSave = (editedImageUrl: string) => {
    setProcessedImageUrl(editedImageUrl);
  };

  const transparentBg = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==")`;

  return (
    <div className="bg-black rounded-lg shadow-md">
      <div className="relative">
        {isProcessing ? (
          <div className="relative">
            <ShineBorder
              className="text-center text-2xl font-bold capitalize z-50"
              color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            >
              <Image
                className="w-full aspect-square object-cover opacity-50 transition-opacity duration-200"
                src={url}
                alt={`Processing image ${image.id}`}
                width={300}
                height={300}
              />
            </ShineBorder>
          </div>
        ) : (
          <div 
            className="w-full aspect-square"
            style={{ 
              background: transparentBg,
              backgroundRepeat: 'repeat'
            }}
          >
            <Image
              className="w-full h-full object-cover transition-opacity duration-200"
              src={processedImageUrl || processedURL}
              alt={`Processed image ${image.id}`}
              width={100}
              height={100}
            />
          </div>
        )}
      </div>      

      {!isProcessing && (
        <div className="flex justify-center items-center">
          <DockIcons image={image} onDelete={onDelete} setIsEditModalOpen={setIsEditModalOpen} processedImageUrl={processedImageUrl} processedURL={processedURL} />
        </div>
      )}

      <EditModal
        image={image}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  );
}
