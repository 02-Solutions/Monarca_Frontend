import { describe, it, expect } from "vitest";
import { historialData } from "./../../pages/Historial/local/dummyData.ts";

describe("historialData", () => {
  it("exports array with 3 items", () => {
    expect(Array.isArray(historialData)).toBe(true);
    expect(historialData).toHaveLength(3);
  });

  it("contains required properties", () => {
    const requiredProps = ["id", "title", "travelDate", "destination", "requestDate"];
    
    historialData.forEach(item => {
      requiredProps.forEach(prop => {
        expect(item).toHaveProperty(prop);
        expect(typeof (item as any)[prop]).toBe("string");
      });
    });
  });

  it("contains expected data", () => {
    expect(historialData[0]).toEqual({
      id: "0001",
      title: "Viaje a Cancún",
      travelDate: "14/09/2020",
      destination: "Cancún, MX",
      requestDate: "10/09/2020",
    });
  });
});
