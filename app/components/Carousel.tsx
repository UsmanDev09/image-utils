import { memo} from 'react';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImageFile } from '../page';

interface CarouselOrientationProps {
  images: ImageFile[],
  onSelectImage: (id: number) => void;
}

const CarouselOrientaiton  = memo(function Carousel({ images, onSelectImage }: CarouselOrientationProps) {
  if (!images || images.length === 0) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex gap-4">
        {images.map((image: ImageFile, index: number) => (
          <div
            key={index}
            onClick={() => onSelectImage(image.id)}
            className={cn(
              "relative inline-block h-[120px] w-[180px] flex-shrink-0 rounded-md overflow-hidden",
              "hover:border-primary transition-colors",
              image.isEditing ? "border border-green-500" : "border border-border"
            )}
          >
            <Image
              src={URL.createObjectURL(image.processedFile!)}
              alt={`Image ${index + 1}`}
              fill
              className="object-contain cursor-pointer"
              sizes="180px"
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
})

export default CarouselOrientaiton;