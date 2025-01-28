import { ImageFile } from '@/store/use-app-shell';
import React, { useEffect, useState,  } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Slider } from '@/components/ui/slider';

import ColorPicker from './ColorPicker';

interface EditModalProps {
  image: ImageFile;
  setUrl: (url: string) => void;
}

const backgroundOptions = [
  { id: 'color', label: 'Solid Color' },
  { id: 'image', label: 'Image' }
];

const effectOptions = [
  { id: 'none', label: 'None' },
  { id: 'blur', label: 'Blur' },
  { id: 'brightness', label: 'Bright' },
  { id: 'contrast', label: 'Contrast' }
];

const EditorOptions = ({ image, setUrl }: EditModalProps) => {

      const [color, setColor] = useState('#000');
      const [bgType, setBgType] = useState('color');
      const [bgColor, setBgColor] = useState('#000000');
      const [customBgImage, setCustomBgImage] = useState<File | null>(null);
      const [selectedEffect, setSelectedEffect] = useState('none');
      const [blurValue, setBlurValue] = useState(50);
      const [brightnessValue, setBrightnessValue] = useState(50);
      const [contrastValue, setContrastValue] = useState(50);
      const [exportUrl, setExportUrl] = useState('');
      const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
    
      const processedURL = image.processedFile ? URL.createObjectURL(image.processedFile) : '';
    
      useEffect(() => {
        if (image.processedFile) {
          applyChanges();
        }
      }, [bgType, bgColor, customBgImage, selectedEffect, blurValue, brightnessValue, contrastValue]);
    
      const getCurrentEffectValue = () => {
        switch (selectedEffect) {
          case 'blur':
            return blurValue;
          case 'brightness':
            return brightnessValue;
          case 'contrast':
            return contrastValue;
          default:
            return 50;
        }
      };
    
      const handleEffectValueChange = (value: number) => {
        switch (selectedEffect) {
          case 'blur':
            setBlurValue(value);
            break;
          case 'brightness':
            setBrightnessValue(value);
            break;
          case 'contrast':
            setContrastValue(value);
            break;
        }
      };
    
      const applyChanges = async () => {
        if (!image.processedFile) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img = new window.Image();
        img.src = processedURL;
        await new Promise(resolve => img.onload = resolve);
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply background
        if (bgType === 'color') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgType === 'image' && customBgImage) {
          const bgImg = new window.Image();
          bgImg.src = URL.createObjectURL(customBgImage);
          await new Promise(resolve => bgImg.onload = resolve);
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        }
        
        // Draw the processed image
        ctx.drawImage(img, 0, 0);
        
        // Apply effects
        if (selectedEffect !== 'none') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          switch (selectedEffect) {
            case 'blur':
              // Create a temporary canvas for blur effect
              const tempCanvas = document.createElement('canvas');
              const tempCtx = tempCanvas.getContext('2d');
              if (!tempCtx) break;
              
              tempCanvas.width = canvas.width;
              tempCanvas.height = canvas.height;
              
              // Draw current state to temp canvas
              tempCtx.drawImage(canvas, 0, 0);
              
              // Clear main canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Apply blur using CSS filter
              ctx.filter = `blur(${blurValue / 10}px)`;
              ctx.drawImage(tempCanvas, 0, 0);
              ctx.filter = 'none';
              break;
              
            case 'brightness':
              for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i]! * (brightnessValue / 50));
                data[i + 1] = Math.min(255, data[i + 1]! * (brightnessValue / 50));
                data[i + 2] = Math.min(255, data[i + 2]! * (brightnessValue / 50));
              }
              ctx.putImageData(imageData, 0, 0);
              break;
              
            case 'contrast':
              const factor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));
              for (let i = 0; i < data.length; i += 4) {
                data[i] = factor * (data[i]! - 128) + 128;
                data[i + 1] = factor * (data[i + 1]! - 128) + 128;
                data[i + 2] = factor * (data[i + 2]! - 128) + 128;
              }
              ctx.putImageData(imageData, 0, 0);
              break;
          }
        }
        
        const dataUrl = canvas.toDataURL('image/png');
        setUrl(dataUrl);
      };
    
      const handleSave = () => {
        // onSave(exportUrl);
      };


    return (
      <div className="flex flex-col justify-center ml-4 p-4 pt-2 w-[300px]  bg-[#242627] rounded-md" style={{ viewTransitionName: 'control-panel' }}>
          {/* <Tabs defaultValue="color">
            <TabsList>
              <TabsTrigger value="color">Color</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
            <TabsContent value="color">
              <ColorPicker onChange={(c: { hex: string }) => setBgColor(c.hex)} color={bgColor} />
            </TabsContent>
            <TabsContent value="image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCustomBgImage(e.target.files?.[0] || null)}
                className="w-full"
              />
            </TabsContent>
          </Tabs> */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className='text-white text-xs p-2 pl-0'>Background Color</AccordionTrigger>
              <AccordionContent>
                <ColorPicker onChange={(c: { hex: string }) => setBgColor(c.hex)} color={bgColor} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className='mt-2'>
            <AccordionItem value="item-1">
              <AccordionTrigger className='text-white text-xs p-2 pl-0'>Background Image</AccordionTrigger>
              <AccordionContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setBgType('image')
                    setCustomBgImage(e.target.files?.[0] || null)
                  }}
                  className="w-full"
                />             
              </AccordionContent>
            </AccordionItem>
          </Accordion>


          <Accordion type="single" collapsible className='mt-2'>
            <AccordionItem value="item-1">
              <AccordionTrigger className='text-white text-xs p-2 pl-0'>Effects</AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                  <p className='text-white text-xs'> Blur </p>
                  <Slider defaultValue={[33]} max={100} step={1} onValueChange={(e) => { 
                    console.log(e)
                    setSelectedEffect('blur')
                     handleEffectValueChange(Number(e)) 
                    }}
                  />          
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-white text-xs'> Brightness </p>
                  <Slider defaultValue={[33]} max={100} step={1} onValueChange={
                    (e) => {
                      setSelectedEffect('brightness')
                      handleEffectValueChange(Number(e)) 
                    }
                  }/>           
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-white text-xs'> Contrast </p>
                  <Slider defaultValue={[33]} max={100} step={1} onValueChange={
                    (e) => {
                      setSelectedEffect('contrast')
                      handleEffectValueChange(Number(e)) 
                    }
                  } />          
                </div> 
              </AccordionContent>
            </AccordionItem>
          </Accordion>
         

      </div>
              
    );
    }

export default EditorOptions;