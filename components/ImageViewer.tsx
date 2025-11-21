
import React, { useState } from 'react';
import { IconX, IconZoomIn, IconZoomOut } from './Icons';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const toggleZoom = () => {
    setScale(prev => prev === 1 ? 2.5 : 1);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Controls */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-[80]">
        <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1 text-museum-ivory/80 text-xs font-mono uppercase tracking-widest border border-white/10">
          Viewer Mode
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
        >
          <IconX className="w-6 h-6" />
        </button>
      </div>

      {/* Image Container */}
      <div 
        className="w-full h-full overflow-auto flex items-center justify-center cursor-zoom-in"
        onClick={toggleZoom}
      >
        <img 
          src={src} 
          alt={alt} 
          className="transition-transform duration-500 ease-out max-w-none md:max-w-full"
          style={{ 
            transform: `scale(${scale})`,
            maxHeight: scale === 1 ? '90vh' : 'none',
            maxWidth: scale === 1 ? '95vw' : 'none',
            cursor: scale === 1 ? 'zoom-in' : 'zoom-out'
          }}
          draggable={false}
        />
      </div>

      {/* Bottom Controls (Zoom Hint) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-[80]">
        <button 
           onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
           className="p-3 bg-museum-900/80 backdrop-blur-md border border-museum-700 rounded-full text-museum-gold hover:text-museum-ivory transition-all shadow-xl"
        >
           {scale === 1 ? <IconZoomIn className="w-6 h-6" /> : <IconZoomOut className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
