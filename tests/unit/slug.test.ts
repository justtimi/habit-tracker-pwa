import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug("   welcome   ")).toBe("welcome");
  });
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Go to the Gym")).toBe("go-to-the-gym");
  });
   it("removes non alphanumeric characters except hyphens ", () => {
    expect(getHabitSlug("Drink Water Today!!!!!!")).toBe("drink-water-today");
  });
});

