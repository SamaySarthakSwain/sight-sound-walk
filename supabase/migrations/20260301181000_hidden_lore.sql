-- Add hidden_lore column to monuments
ALTER TABLE public.monuments 
ADD COLUMN IF NOT EXISTS hidden_lore TEXT;

-- Update sample monuments with hidden lore (optional, can be done later)
UPDATE public.monuments 
SET hidden_lore = 'Legend says this temple contains a secret chamber with ancient scrolls.'
WHERE title ILIKE '%Lingaraj%';

UPDATE public.monuments 
SET hidden_lore = 'Beneath these waters lies a lost city, visible only during the lunar eclipse.'
WHERE title ILIKE '%Bindu Sagar%';
