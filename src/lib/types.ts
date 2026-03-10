// Types mirroring Supabase Schema

export type Company = {
  id: string;
  name: string;
  logo_url?: string;
};

export type EventType = {
  id: string;
  client_id: string;
  name: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  cover_image_url: string;
  expiry_date: string;
  created_at: string;
};

export type AssetCategory = string;
export type AssetType = string;

export type MediaAsset = {
  id: string;
  event_id: string;
  type: AssetType;
  category: AssetCategory;
  url: string;
  filename: string;
  format?: string;
  size_mb: number;
  width?: number;
  height?: number;
  duration_sec?: number;
  day_number?: number;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  event_id: string;
  action: string;
  timestamp: string;
};
