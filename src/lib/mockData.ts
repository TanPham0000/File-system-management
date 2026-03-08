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
  cover_image_url: string;
  expiry_date: string;
  created_at: string;
};

export type AssetCategory = "Photos" | "Social Clips" | "Speaker Highlights" | "Full Recap";
export type AssetType = "image" | "video";

export type MediaAsset = {
  id: string;
  event_id: string;
  type: AssetType;
  category: AssetCategory;
  url: string; // Acts as the presigned S3 url in this mock
  filename: string;
  size_mb: number;
  width?: number;
  height?: number;
  duration_sec?: number;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string; // Who accessed
  event_id: string;
  action: string;
  timestamp: string;
};

// --- Mock Data ---

export const mockCompanies: Company[] = [
  { id: "comp-1", name: "TechSummit Inc." },
  { id: "comp-2", name: "Innovate Finance" },
];

export const mockEvents: EventType[] = [
  {
    id: "evt-101",
    client_id: "comp-1",
    name: "TechSummit 2026",
    cover_image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    expiry_date: "2027-03-07T00:00:00Z",
    created_at: "2026-03-07T00:00:00Z",
  },
];

export const mockAssets: MediaAsset[] = [
  {
    id: "asset-1",
    event_id: "evt-101",
    type: "image",
    category: "Photos",
    url: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
    filename: "TS26_MainStage_001.jpg",
    size_mb: 4.2,
    width: 3840,
    height: 2160,
    created_at: "2026-03-07T10:15:00Z",
  },
  {
    id: "asset-2",
    event_id: "evt-101",
    type: "video",
    category: "Social Clips",
    url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
    filename: "TS26_Social_Vertical_01.mp4",
    size_mb: 12.5,
    duration_sec: 15,
    created_at: "2026-03-07T11:00:00Z",
  }
];

export const mockLogs: ActivityLog[] = [
  {
    id: "log-1",
    user_id: "sarah@techsummit.com",
    event_id: "evt-101",
    action: "downloaded TS26_Social_Vertical_01.mp4",
    timestamp: "2026-03-07T12:05:00Z",
  }
];
