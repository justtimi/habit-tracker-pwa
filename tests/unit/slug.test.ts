import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("trims unnecessary spaces at the beginning and end for the habits name and collapses repeated internal spaces", () => {
    expect(getHabitSlug("   welcome   ")).toBe("welcome");
  });
  it("returns a lowercase hyphenated string of the habit name in a case of more than one word", () => {
    expect(getHabitSlug("Go to the Gym")).toBe("go-to-the-gym");
  });
   it("Removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug("Drink Water Today!!!!!!")).toBe("drink-water-today");
  });
});

