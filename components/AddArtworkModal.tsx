
import React, { useState, useRef } from 'react';
import { ArtworkRow, Translations } from '../types';
import { IconX, IconUpload, IconPlus, IconSparkles } from './Icons';
import { museumService } from '../services/museumService';

interface AddArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRow: ArtworkRow) => void;
  texts: Translations;
}

const AddArtworkModal: React.FC<AddArtworkModalProps> = ({ isOpen, onClose, onAdd, texts }) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleJa, setTitleJa] = useState('');
  const [artistEn, setArtistEn] = useState('');
  const [artistJa, setArtistJa] = useState('');
  const [year, setYear] = useState('');
  const [periodEn, setPeriodEn] = useState('');
  const [periodJa, setPeriodJa] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !artistEn || !imageFile) return;

    setIsSubmitting(true);
    
    try {
      const newRow = await museumService.uploadArtwork(imageFile, {
        title_en: titleEn,
        title_ja: titleJa || undefined,
        artist_en: artistEn,
        artist_ja: artistJa || undefined,
        year_created: year,
        period_en: periodEn,
        period_ja: periodJa || undefined
      });

      onAdd(newRow);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to archive artwork. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitleEn(''); setTitleJa('');
    setArtistEn(''); setArtistJa('');
    setYear('');
    setPeriodEn(''); setPeriodJa('');
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-museum-950/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-museum-900 border border-museum-800 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90dvh]">
        
        {/* Header */}
        <div className="p-6 border-b border-museum-800 flex justify-between items-center bg-museum-950">
          <h2 className="font-display text-xl text-museum-ivory tracking-wider">{texts.addArtwork}</h2>
          <button onClick={onClose} className="text-museum-muted hover:text-museum-gold transition-colors">
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-museum-700 scrollbar-track-transparent">
          <form id="add-art-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div 
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className={`relative w-full aspect-video border-2 border-dashed border-museum-700 rounded bg-museum-950 flex flex-col items-center justify-center cursor-pointer hover:border-museum-gold transition-colors group ${previewUrl ? 'border-solid border-museum-800' : ''} ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <IconUpload className="w-8 h-8 text-museum-muted group-hover:text-museum-gold mb-2" />
                  <span className="text-xs uppercase tracking-widest text-museum-muted group-hover:text-museum-ivory">{texts.uploadImage}</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formTitle} (EN)</label>
                <input 
                  type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required
                  className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-display text-lg focus:outline-none focus:border-museum-gold transition-colors"
                  placeholder="The Night Watch"
                />
              </div>
               <div className="group">
                <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formTitle} (JP)</label>
                <input 
                  type="text" value={titleJa} onChange={(e) => setTitleJa(e.target.value)}
                  className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-serif text-lg focus:outline-none focus:border-museum-gold transition-colors"
                  placeholder="夜警"
                />
              </div>
              
              <div className="group pt-2">
                <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formArtist} (EN)</label>
                <input 
                  type="text" value={artistEn} onChange={(e) => setArtistEn(e.target.value)} required
                  className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-serif italic text-lg focus:outline-none focus:border-museum-gold transition-colors"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formArtist} (JP)</label>
                <input 
                  type="text" value={artistJa} onChange={(e) => setArtistJa(e.target.value)}
                  className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-serif italic text-lg focus:outline-none focus:border-museum-gold transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <div className="group flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formYear}</label>
                    <input 
                    type="text" value={year} onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-serif text-md focus:outline-none focus:border-museum-gold transition-colors"
                    />
                </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="group flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formPeriod} (EN)</label>
                    <input 
                    type="text" value={periodEn} onChange={(e) => setPeriodEn(e.target.value)}
                    className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-serif text-md focus:outline-none focus:border-museum-gold transition-colors"
                    />
                </div>
                <div className="group flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formPeriod} (JP)</label>
                    <input 
                    type="text" value={periodJa} onChange={(e) => setPeriodJa(e.target.value)}
                    className="w-full bg-museum-950 border-b border-museum-800 py-2 text-museum-ivory font-serif text-md focus:outline-none focus:border-museum-gold transition-colors"
                    />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-museum-800 bg-museum-950 flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 border border-museum-800 text-museum-muted hover:bg-museum-900 transition-colors uppercase text-xs tracking-widest font-bold"
          >
            {texts.formCancel}
          </button>
          <button 
            type="submit" 
            form="add-art-form"
            disabled={!titleEn || !artistEn || isSubmitting}
            className="flex-[2] py-3 px-4 bg-museum-gold text-museum-950 hover:bg-amber-600 transition-colors uppercase text-xs tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
                <>
                    <IconSparkles className="w-4 h-4 animate-spin" />
                    Archiving...
                </>
            ) : (
                <>
                    <IconPlus className="w-4 h-4" />
                    {texts.formSubmit}
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddArtworkModal;
