import { z } from 'zod';

export const artworkFormSchema = z.object({
  titleEn: z.string().trim().min(1, 'titleEn'),
  titleJa: z.string().trim().min(1, 'titleJa'),
  artistEn: z.string().trim().min(1, 'artistEn'),
  artistJa: z.string().trim().min(1, 'artistJa'),
  year: z
    .string()
    .trim()
    .min(1, 'year')
    .regex(/^-?\d{1,4}$/, 'yearFormat'),
  periodEn: z.string().trim().min(1, 'periodEn'),
  periodJa: z.string().trim().min(1, 'periodJa'),
  level: z.coerce.number().int().min(1, 'levelRange').max(5, 'levelRange'),
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

export type ArtworkFormField = keyof ArtworkFormValues | 'imageFile';

export const artworkImageSchema = z
  .instanceof(File, { message: 'imageFile' })
  .refine((file) => file.type.startsWith('image/'), { message: 'imageType' })
  .refine((file) => file.size <= 10 * 1024 * 1024, { message: 'imageSize' });

export const validateArtworkForm = (
  values: ArtworkFormValues,
  imageFile: File | null
): Partial<Record<ArtworkFormField, string>> => {
  const errors: Partial<Record<ArtworkFormField, string>> = {};

  const formResult = artworkFormSchema.safeParse(values);
  if (!formResult.success) {
    for (const issue of formResult.error.issues) {
      const field = issue.path[0] as ArtworkFormField;
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  if (!imageFile) {
    errors.imageFile = 'imageFile';
  } else {
    const imageResult = artworkImageSchema.safeParse(imageFile);
    if (!imageResult.success) {
      errors.imageFile = imageResult.error.issues[0]?.message ?? 'imageFile';
    }
  }

  return errors;
};
