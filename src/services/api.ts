import { supabase } from '@/lib/supabase';
import type { Track, Video, Event, Subscriber, Broadcast, Product, Order, DeliveryStatus, ContactMessage } from '@/lib/types';

export async function fetchTracks(): Promise<Track[]> {
  const { data, error } = await supabase.from('tracks').select('*').order('release_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function createTrack(track: Omit<Track, 'id' | 'created_at'>): Promise<Track> {
  const { data, error } = await supabase.from('tracks').insert(track).select().single();
  if (error) throw error;
  return data;
}
export async function updateTrack(id: string, updates: Partial<Track>): Promise<Track> {
  const { data, error } = await supabase.from('tracks').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteTrack(id: string): Promise<void> {
  const { error } = await supabase.from('tracks').delete().eq('id', id);
  if (error) throw error;
}
export async function fetchVideos(): Promise<Video[]> {
  const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function createVideo(video: Omit<Video, 'id' | 'created_at'>): Promise<Video> {
  const { data, error } = await supabase.from('videos').insert(video).select().single();
  if (error) throw error;
  return data;
}
export async function updateVideo(id: string, updates: Partial<Video>): Promise<Video> {
  const { data, error } = await supabase.from('videos').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) throw error;
}
export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}
export async function createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
  const { data, error } = await supabase.from('events').insert(event).select().single();
  if (error) throw error;
  return data;
}
export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}
export async function addSubscriber(email: string): Promise<{ error: string | null; alreadyExists: boolean }> {
  const { error } = await supabase.from('subscribers').insert({ email });
  if (error) {
    if (error.code === '23505') return { error: null, alreadyExists: true };
    return { error: error.message, alreadyExists: false };
  }
  return { error: null, alreadyExists: false };
}
export async function fetchSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function deleteSubscriber(id: string): Promise<void> {
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) throw error;
}
export async function fetchBroadcasts(): Promise<Broadcast[]> {
  const { data, error } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function sendBroadcast(subject: string, body: string, sentBy: string): Promise<void> {
  const { count } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });
  const { error } = await supabase.from('broadcasts').insert({ subject, body, sent_by: sentBy, recipient_count: count ?? 0 });
  if (error) throw error;
}
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
}
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function updateOrderDelivery(id: string, delivery_status: DeliveryStatus): Promise<void> {
  const { error } = await supabase.from('orders').update({ delivery_status }).eq('id', id);
  if (error) throw error;
}
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(msg);
  if (error) throw error;
}
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function markMessageRead(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
  if (error) throw error;
}
export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}
