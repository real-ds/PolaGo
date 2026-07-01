import { describe, it, expect } from "vitest";
import { generateId, generateRoomSlug, generateFilename, clamp } from "../utils";

describe("utils", () => {
  describe("generateId", () => {
    it("should generate a non-empty string", () => {
      const id = generateId();
      expect(id).toBeDefined();
      expect(id.length).toBeGreaterThan(0);
    });

    it("should generate unique IDs", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  describe("generateRoomSlug", () => {
    it("should generate an 8-character slug", () => {
      const slug = generateRoomSlug();
      expect(slug).toHaveLength(8);
    });

    it("should only contain lowercase alphanumeric characters", () => {
      const slug = generateRoomSlug();
      expect(slug).toMatch(/^[a-z0-9]{8}$/);
    });
  });

  describe("generateFilename", () => {
    it("should include POLAGO prefix", () => {
      const name = generateFilename("png");
      expect(name).toMatch(/^POLAGO_/);
    });

    it("should have correct extension", () => {
      expect(generateFilename("png")).toMatch(/\.png$/);
      expect(generateFilename("jpeg")).toMatch(/\.jpeg$/);
      expect(generateFilename("jpg")).toMatch(/\.jpg$/);
    });
  });

  describe("clamp", () => {
    it("should clamp values within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
});
