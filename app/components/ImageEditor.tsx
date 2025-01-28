import React, { useState } from 'react';
import { ImageFile } from '../page';

interface ImageEditorProps {
  images: ImageFile[];
  currentImage: ImageFile | null;
  onClose: () => void;
}

const ImageEditor = ({ images } : { images: ImageFile[]}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [showResizePanel, setShowResizePanel] = useState(false);
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
  
  // State for image dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);

  const startViewTransition = () => {
    if (!document.startViewTransition) return null;
    
    return document.startViewTransition(async () => {
      setIsEditing(!isEditing);
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div 
        className={`w-64 bg-gray-100 p-4 transform transition-transform ${
          isEditing ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ viewTransitionName: 'sidebar' }}
      >
        <div className="space-y-4">
          <button
            onClick={() => setShowResizePanel(prev => !prev)}
            className="w-full p-2 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <svg className="w-6 h-6" /* Add resize icon SVG */ />
            Resize
          </button>
          
          <button
            onClick={() => setShowBackgroundPanel(prev => !prev)}
            className="w-full p-2 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <svg className="w-6 h-6" /* Add edit background icon SVG */ />
            Edit Background
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {isEditing ? (
          <div className="flex gap-4">
            {/* Main Image */}
            <div 
              className="flex-1"
              style={{ 
                viewTransitionName: `image-${currentImage?.id}`,
                backgroundColor,
                filter: `blur(${blur}px) brightness(${brightness}%)`
              }}
            >
              <img
                src={currentImage?.processedFile ? URL.createObjectURL(currentImage.processedFile) : ''}
                alt="Edited image"
                className="w-full h-auto"
              />
            </div>

            {/* Right Panel - Other Images */}
            <div 
              className="w-64 overflow-y-auto"
              style={{ viewTransitionName: 'image-list' }}
            >
              {images.map(img => (
                <div 
                  key={img.id}
                  className="mb-4 cursor-pointer"
                  onClick={() => setCurrentImage(img)}
                >
                  <img
                    src={img.processedFile ? URL.createObjectURL(img.processedFile) : ''}
                    alt="Thumbnail"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(img => (
              <div 
                key={img.id}
                className="relative group"
                style={{ viewTransitionName: `image-${img.id}` }}
              >
                <img
                  src={img.processedFile ? URL.createObjectURL(img.processedFile) : ''}
                  alt="Gallery image"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => {
                    setCurrentImage(img);
                    startViewTransition();
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" /* Add edit icon SVG */ />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Control Panel - Conditional Render */}
      {(showResizePanel || showBackgroundPanel) && (
        <div 
          className="w-64 bg-white p-4 shadow-lg"
          style={{ viewTransitionName: 'control-panel' }}
        >
          {showResizePanel && (
            <div className="space-y-4">
              <h3 className="font-semibold">Resize Image</h3>
              <div>
                <label className="block text-sm">Width</label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={e => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm">Height</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={e => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}

          {showBackgroundPanel && (
            <div className="space-y-4">
              <h3 className="font-semibold">Edit Background</h3>
              <div>
                <label className="block text-sm">Background Color</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={e => setBackgroundColor(e.target.value)}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="block text-sm">Blur</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={blur}
                  onChange={e => setBlur(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="block text-sm">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={e => setBrightness(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageEditor;