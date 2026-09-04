import { describe, expect, it } from "vitest";

// Temporary: proves the Vitest wiring works. Delete once real domain-layer
// tests land in rebuild step 2 (see REBUILD_DESIGN §9).
describe("scaffold", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
