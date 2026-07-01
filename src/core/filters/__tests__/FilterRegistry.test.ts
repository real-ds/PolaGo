import { describe, it, expect, beforeEach } from "vitest";
import { FilterRegistry } from "../FilterRegistry";
import { IFilter } from "../IFilter";

class MockFilter implements IFilter {
  id = "mock-filter";
  label = "Mock Filter";
  thumbnail = "/mock.png";
  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {}
}

class AnotherFilter implements IFilter {
  id = "another";
  label = "Another";
  thumbnail = "/another.png";
  apply(ctx: CanvasRenderingContext2D, w: number, h: number): void {}
}

describe("FilterRegistry", () => {
  beforeEach(() => {
    FilterRegistry.clear();
  });

  it("should register and retrieve a filter", () => {
    const filter = new MockFilter();
    FilterRegistry.register(filter);
    expect(FilterRegistry.get("mock-filter")).toBe(filter);
  });

  it("should return undefined for unregistered filter", () => {
    expect(FilterRegistry.get("nonexistent")).toBeUndefined();
  });

  it("should list all registered filters", () => {
    FilterRegistry.register(new MockFilter());
    FilterRegistry.register(new AnotherFilter());
    const list = FilterRegistry.list();
    expect(list).toHaveLength(2);
  });

  it("should clear all filters", () => {
    FilterRegistry.register(new MockFilter());
    FilterRegistry.clear();
    expect(FilterRegistry.list()).toHaveLength(0);
  });

  it("should overwrite filter with same id", () => {
    const f1 = new MockFilter();
    const f2 = new MockFilter();
    FilterRegistry.register(f1);
    FilterRegistry.register(f2);
    expect(FilterRegistry.get("mock-filter")).toBe(f2);
  });
});
