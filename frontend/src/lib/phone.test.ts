import { describe, it, expect } from "vitest";

import {
  formatKuwaitLocal,
  isValidKuwaitPhone,
  normalizeKuwaitLocal,
  toE164,
} from "./phone";

describe("kuwait phone", () => {
  it.each([
    ["50001234", true],
    ["60001234", true],
    ["90001234", true],
    ["+96550001234", true],
    ["009650 50001234".replace(/\s/g, ""), false], // double zero noise
    ["0096550001234", true],
    ["40001234", false], // starts with 4
    ["5000123", false], // only 7 digits
    ["500012345", false], // 9 digits
    ["", false],
  ])("validates %p -> %p", (input, expected) => {
    expect(isValidKuwaitPhone(input)).toBe(expected);
  });

  it("normalizes formats to local 8 digits", () => {
    expect(normalizeKuwaitLocal(" 5000 1234 ")).toBe("50001234");
    expect(normalizeKuwaitLocal("+965-5000-1234")).toBe("50001234");
    expect(normalizeKuwaitLocal("00965 6000 1234")).toBe("60001234");
  });

  it("converts to E.164", () => {
    expect(toE164("50001234")).toBe("+96550001234");
    expect(toE164("40001234")).toBeNull();
  });

  it("pretty prints", () => {
    expect(formatKuwaitLocal("50001234")).toBe("5000 1234");
    expect(formatKuwaitLocal("garbage")).toBe("garbage");
  });
});
