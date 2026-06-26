import { describe, it, expect } from "vitest";

import { formatKwd, formatPerPiece } from "./currency";

const strip = (s: string) => s.replace(/[\u2066\u2069]/g, "");

describe("currency", () => {
  it("formats whole KWD without decimals", () => {
    expect(strip(formatKwd(29))).toBe("29 KWD");
    expect(strip(formatKwd(19))).toBe("19 KWD");
  });

  it("formats fractional KWD with 3 decimals", () => {
    expect(strip(formatKwd(14.5))).toBe("14.500 KWD");
    expect(strip(formatKwd(0.001))).toBe("0.001 KWD");
  });

  it("supports symbol-less display", () => {
    expect(strip(formatKwd(29, { withSymbol: false }))).toBe("29");
  });

  it("computes per-piece display", () => {
    expect(strip(formatPerPiece(29, 2))).toBe("14.500 KWD للقطعة");
    expect(strip(formatPerPiece(39, 3))).toBe("13 KWD للقطعة");
  });
});
