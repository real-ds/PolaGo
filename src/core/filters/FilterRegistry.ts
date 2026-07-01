import { IFilter } from "./IFilter";

export class FilterRegistry {
  private static filters = new Map<string, IFilter>();

  static register(filter: IFilter): void {
    this.filters.set(filter.id, filter);
  }

  static get(id: string): IFilter | undefined {
    return this.filters.get(id);
  }

  static list(): IFilter[] {
    return Array.from(this.filters.values());
  }

  static clear(): void {
    this.filters.clear();
  }
}
