import React, { useState, useRef } from 'react';
import { ArtworkRow, Translations } from '../types';
import { IconX, IconUpload, IconPlus, IconSparkles } from './Icons';
import { museumService } from '../services/museumService';
import {
  validateArtworkForm,
  ArtworkFormField,
  ArtworkFormValues,
} from '../schemas/artworkForm';

interface AddArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRow: ArtworkRow) => void;
  texts: Translations;
}

const defaultFormValues: ArtworkFormValues = {
  titleEn: '',
  titleJa: '',
  artistEn: '',
  artistJa: '',
  year: '',
  periodEn: '',
  periodJa: '',
  level: 3,
};

const AddArtworkModal: React.FC<AddArtworkModalProps> = ({ isOpen, onClose, onAdd, texts }) => {
  const [formValues, setFormValues] = useState<ArtworkFormValues>(defaultFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ArtworkFormField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ArtworkFormField, boolean>>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validationMessages: Record<string, string> = {
    titleEn: texts.validationRequired,
    titleJa: texts.validationRequired,
    artistEn: texts.validationRequired,
    artistJa: texts.validationRequired,
    year: texts.validationRequired,
    yearFormat: texts.validationYearFormat,
    periodEn: texts.validationRequired,
    periodJa: texts.validationRequired,
    levelRange: texts.validationLevelRange,
    imageFile: texts.validationImageFile,
    imageType: texts.validationImageType,
    imageSize: texts.validationImageSize,
  };

  const getErrorText = (field: ArtworkFormField): string | undefined => {
    const code = errors[field];
    if (!code || !touched[field]) return undefined;
    return validationMessages[code] ?? texts.validationRequired;
  };

  const inputClass = (field: ArtworkFormField) =>
    `w-full bg-museum-950 border-b pl-2 py-2 text-museum-ivory focus:outline-none transition-colors ${
      getErrorText(field)
        ? 'border-red-500/70 focus:border-red-400'
        : 'border-museum-800 focus:border-museum-gold'
    }`;

  const updateField = <K extends keyof ArtworkFormValues>(key: K, value: ArtworkFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setTouched((prev) => ({ ...prev, imageFile: true }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.imageFile;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(defaultFormValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      { imageFile: true } as Partial<Record<ArtworkFormField, boolean>>
    );
    setTouched(allTouched);

    const validationErrors = validateArtworkForm(formValues, imageFile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!imageFile) return;

    setIsSubmitting(true);

    try {
      const newRow = await museumService.uploadArtwork(imageFile, {
        title_en: formValues.titleEn,
        title_ja: formValues.titleJa,
        artist_en: formValues.artistEn,
        artist_ja: formValues.artistJa,
        year_created: formValues.year,
        period_en: formValues.periodEn,
        period_ja: formValues.periodJa,
        level: formValues.level,
      });

      onAdd(newRow);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Upload failed', error);
      alert(texts.errorUploading);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormValues(defaultFormValues);
    setImageFile(null);
    setPreviewUrl(null);
    setErrors({});
    setTouched({});
  };

  const imageError = getErrorText('imageFile');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-museum-950/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-museum-900 border border-museum-800 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90dvh]">

        <div className="p-6 border-b border-museum-800 flex justify-between items-center bg-museum-950">
          <h2 className="font-display text-xl text-museum-ivory tracking-wider">{texts.addArtwork}</h2>
          <button onClick={onClose} className="text-museum-muted hover:text-museum-gold transition-colors">
            <IconX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-museum-700 scrollbar-track-transparent">
          <form id="add-art-form" onSubmit={handleSubmit} className="space-y-6" noValidate>

            <div>
              <div
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className={`relative w-full aspect-video border-2 border-dashed rounded bg-museum-950 flex flex-col items-center justify-center cursor-pointer hover:border-museum-gold transition-colors group ${
                  previewUrl ? 'border-solid border-museum-800' : 'border-museum-700'
                } ${imageError ? 'border-red-500/70' : ''} ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
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
              {imageError && <p className="mt-1 text-xs text-red-400 font-serif">{imageError}</p>}
            </div>

            <div className="space-y-4">
              {([
                ['titleEn', texts.formTitle + ' (EN)', 'font-display text-lg'],
                ['titleJa', texts.formTitle + ' (JP)', 'font-serif text-lg'],
                ['artistEn', texts.formArtist + ' (EN)', 'font-serif italic text-lg'],
                ['artistJa', texts.formArtist + ' (JP)', 'font-serif italic text-lg'],
              ] as const).map(([field, label, textClass]) => (
                <div key={field} className="group">
                  <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{label}</label>
                  <input
                    type="text"
                    value={formValues[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, [field]: true }))}
                    className={`${inputClass(field)} ${textClass}`}
                  />
                  {getErrorText(field) && (
                    <p className="mt-1 text-xs text-red-400 font-serif">{getErrorText(field)}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-2">
                <div className="group flex-1">
                  <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formYear}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formValues.year}
                    onChange={(e) => updateField('year', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, year: true }))}
                    className={`${inputClass('year')} font-serif text-md`}
                  />
                  {getErrorText('year') && (
                    <p className="mt-1 text-xs text-red-400 font-serif">{getErrorText('year')}</p>
                  )}
                </div>
                <div className="group flex-1">
                  <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{texts.formLevel}</label>
                  <select
                    value={formValues.level}
                    onChange={(e) => updateField('level', Number(e.target.value))}
                    onBlur={() => setTouched((prev) => ({ ...prev, level: true }))}
                    className={`${inputClass('level')} font-serif text-md cursor-pointer`}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        Lv.{n}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-museum-muted font-serif">{texts.formLevelHint}</p>
                  {getErrorText('level') && (
                    <p className="mt-1 text-xs text-red-400 font-serif">{getErrorText('level')}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                {([
                  ['periodEn', texts.formPeriod + ' (EN)'],
                  ['periodJa', texts.formPeriod + ' (JP)'],
                ] as const).map(([field, label]) => (
                  <div key={field} className="group flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-museum-muted mb-1">{label}</label>
                    <input
                      type="text"
                      value={formValues[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, [field]: true }))}
                      className={`${inputClass(field)} font-serif text-md`}
                    />
                    {getErrorText(field) && (
                      <p className="mt-1 text-xs text-red-400 font-serif">{getErrorText(field)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

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
            disabled={isSubmitting}
            className="flex-[2] py-3 px-4 bg-museum-gold text-museum-950 hover:bg-amber-600 transition-colors uppercase text-xs tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <IconSparkles className="w-4 h-4 animate-spin" />
                {texts.uploading}
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
