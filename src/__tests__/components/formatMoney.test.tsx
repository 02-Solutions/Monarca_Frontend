import { describe, it, expect } from "vitest";
import formatMoney from "./../../utils/formatMoney";

describe("formatMoney", () => {
  it("formats valid numbers correctly", () => {
    expect(formatMoney(1234.56)).toBe("$1,234.56");
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(999999.99)).toBe("$999,999.99");
  });

  it("handles invalid inputs", () => {
    expect(formatMoney(NaN)).toBe("$0.00");
    expect(formatMoney("invalid" as any)).toBe("$0.00");
    expect(formatMoney(null as any)).toBe("$0.00");
    expect(formatMoney(undefined as any)).toBe("$0.00");
  });

  it("handles edge cases", () => {
    expect(formatMoney(-100)).toBe("-$100.00");
    expect(formatMoney(0.01)).toBe("$0.01");
    expect(formatMoney(Infinity)).toBe("$∞");
  });
});
