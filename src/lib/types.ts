export type TrackType = 'single' | 'album' | 'beat';
export interface Track { id: string; title: string; type: TrackType; genre: string; release_date: string; cover_url: string; audio_url: string; streaming_links: Record<string, string>; created_at: string; }
export type VideoType = 'music_video' | 'behind_scenes' | 'live';
export interface Video { id: string; title: string; type: VideoType; video_url: string; thumbnail_url: string; created_at: string; }
export type TicketStatus = 'available' | 'sold_out' | 'limited';
export interface Event { id: string; date: string; venue: string; city: string; country: string; ticket_url: string; ticket_status: TicketStatus; created_at: string; }
export interface Subscriber { id: string; email: string; created_at: string; }
export interface Broadcast { id: string; subject: string; body: string; recipient_count: number; sent_by: string; created_at: string; }

export type ProductCategory = 'merch' | 'digital';
export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  product_type: string;
  price: number;
  currency: string;
  image_url: string;
  sizes: string[];
  stock: number;
  audio_url: string;
  file_url: string;
  created_at: string;
}
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered' | 'not_applicable';
export type OrderType = 'physical' | 'digital' | 'mixed';

export interface Customer {
  id: string; email: string; full_name: string; address: string; city: string; country: string; postal_code: string; created_at: string;
}
export interface OrderItem {
  id: string; order_id: string; product_id: string; product_title: string; quantity: number;
  unit_price: number; selected_variant: string; has_download_access: boolean; download_url: string; created_at: string;
}
export interface Order {
  id: string; customer_id: string | null; customer_email: string; total_amount: number; currency: string;
  payment_status: PaymentStatus; delivery_status: DeliveryStatus; order_type: OrderType; stripe_session_id: string;
  shipping_full_name: string; shipping_address: string; shipping_city: string; shipping_country: string; shipping_postal_code: string;
  created_at: string; order_items?: OrderItem[];
}

export interface ContactMessage {
  id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string;
}
