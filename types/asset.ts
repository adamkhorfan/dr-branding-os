export type AssetType = "logo" | "image" | "font" | "video" | "document" | "other";

export interface BrandAsset {
  id: string;
  clientId: string;
  name: string;
  type: AssetType;
  url: string;           // data URL (base64) for localStorage, real URL for Supabase
  mimeType: string;
  sizeBytes: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
