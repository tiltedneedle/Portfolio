import { describe, expect, it } from "vitest";
import { cleanPath, isRoomPath, roomPath } from "@/lib/room-paths";

describe("roomPath", () => {
  it("puts a clean path inside the client's tree", () => {
    expect(roomPath("/", "demo")).toBe("/c/demo");
    expect(roomPath("/create/hooks", "demo")).toBe("/c/demo/create/hooks");
    expect(roomPath("/content/scripts/3", "template")).toBe("/c/template/content/scripts/3");
  });
});

describe("isRoomPath", () => {
  it("recognises the tree and nothing that merely starts with c", () => {
    expect(isRoomPath("/c")).toBe(true);
    expect(isRoomPath("/c/demo")).toBe(true);
    expect(isRoomPath("/c/demo/create")).toBe(true);
    expect(isRoomPath("/create")).toBe(false);
    expect(isRoomPath("/create/hooks")).toBe(false);
    expect(isRoomPath("/client/logo.png")).toBe(false);
  });
});

describe("cleanPath", () => {
  it("strips the tree prefix and the slug", () => {
    expect(cleanPath("/c/demo/create/hooks")).toBe("/create/hooks");
    expect(cleanPath("/c/demo/audit")).toBe("/audit");
    expect(cleanPath("/c/demo")).toBe("/");
    expect(cleanPath("/c")).toBe("/");
  });

  it("round-trips with roomPath", () => {
    for (const p of ["/", "/audit", "/create/hooks", "/content/scripts/12"]) {
      expect(cleanPath(roomPath(p, "demo"))).toBe(p);
    }
  });
});
