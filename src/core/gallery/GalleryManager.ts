import { get, set, del, clear } from "idb-keyval";

export interface GalleryEntry {
  index: number;
  dataUrl: string;
  createdAt: number;
}

export class GalleryManager {
  private storeKey: string;
  private entries: GalleryEntry[] = [];

  constructor(roomId: string) {
    this.storeKey = `polago-gallery-${roomId}`;
  }

  async load(): Promise<GalleryEntry[]> {
    const stored = await get<GalleryEntry[]>(this.storeKey);
    this.entries = stored || [];
    return this.entries;
  }

  async add(entry: GalleryEntry): Promise<void> {
    this.entries.push(entry);
    await set(this.storeKey, this.entries);
  }

  async remove(index: number): Promise<void> {
    this.entries = this.entries.filter((e) => e.index !== index);
    await set(this.storeKey, this.entries);
  }

  async update(index: number, dataUrl: string): Promise<void> {
    const entry = this.entries.find((e) => e.index === index);
    if (entry) {
      entry.dataUrl = dataUrl;
      await set(this.storeKey, this.entries);
    }
  }

  async clearAll(): Promise<void> {
    this.entries = [];
    await del(this.storeKey);
  }

  getAll(): GalleryEntry[] {
    return [...this.entries];
  }
}
