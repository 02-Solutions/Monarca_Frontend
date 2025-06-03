import { describe, it, expect } from "vitest";
import { approvalsData } from "./../../pages/Approvals/local/dummyData.ts";

describe("Approvals Dummy Data", () => {
  it("should contain 8 approval records", () => {
    expect(approvalsData).toHaveLength(8);
  });

  it("should have unique IDs", () => {
    const ids = approvalsData.map((record) => record.id);
    const uniqueIds = [...new Set(ids)];
    expect(uniqueIds).toHaveLength(approvalsData.length);
  });

  it("should have unique codes", () => {
    const codes = approvalsData.map((record) => record.code);
    const uniqueCodes = [...new Set(codes)];
    expect(uniqueCodes).toHaveLength(approvalsData.length);
  });

  it("should have valid authorization statuses", () => {
    const validStatuses = ["Pendiente", "Autorizado", "Rechazado"];
    approvalsData.forEach((record) => {
      expect(validStatuses).toContain(record.authorization);
    });
  });

  it("should have valid checking statuses", () => {
    const validChecking = [
      "A liquidar",
      "Liquidado",
      "No aplica",
      "En proceso",
    ];
    approvalsData.forEach((record) => {
      expect(validChecking).toContain(record.checking);
    });
  });

  it("should have MXN currency for all records", () => {
    approvalsData.forEach((record) => {
      expect(record.currency).toBe("MXN");
    });
  });

  it("should have valid email formats", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    approvalsData.forEach((record) => {
      expect(record.email).toMatch(emailRegex);
    });
  });

  it("should have refund amounts with $ prefix", () => {
    approvalsData.forEach((record) => {
      expect(record.refund).toMatch(/^\$\d+$/);
    });
  });

  it("should have consistent data types", () => {
    approvalsData.forEach((record) => {
      expect(typeof record.id).toBe("number");
      expect(typeof record.code).toBe("string");
      expect(typeof record.departureDate).toBe("string");
      expect(typeof record.city).toBe("string");
      expect(typeof record.country).toBe("string");
      expect(typeof record.reason).toBe("string");
      expect(typeof record.authorization).toBe("string");
      expect(typeof record.checking).toBe("string");
      expect(typeof record.refund).toBe("string");
      expect(typeof record.currency).toBe("string");
      expect(typeof record.employee).toBe("string");
      expect(typeof record.position).toBe("string");
      expect(typeof record.name).toBe("string");
      expect(typeof record.email).toBe("string");
      expect(typeof record.creditor).toBe("string");
      expect(typeof record.company).toBe("string");
    });
  });

  it('should have rejected records with $0 refund and "No aplica" checking', () => {
    const rejectedRecords = approvalsData.filter(
      (record) => record.authorization === "Rechazado",
    );
    rejectedRecords.forEach((record) => {
      expect(record.refund).toBe("$0");
      expect(record.checking).toBe("No aplica");
    });
  });

  it('should have authorized records with "Liquidado" checking', () => {
    const authorizedRecords = approvalsData.filter(
      (record) => record.authorization === "Autorizado",
    );
    authorizedRecords.forEach((record) => {
      expect(record.checking).toBe("Liquidado");
    });
  });

  it("should have valid date format (DD/MM/YYYY)", () => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    approvalsData.forEach((record) => {
      expect(record.departureDate).toMatch(dateRegex);
    });
  });

  it("should contain specific test records", () => {
    // Test first record
    expect(approvalsData[0]).toEqual({
      id: 1,
      code: "0001",
      departureDate: "14/09/2025",
      city: "Cancún",
      country: "MX",
      reason: "Viaje de negocios",
      authorization: "Pendiente",
      checking: "A liquidar",
      refund: "$100",
      currency: "MXN",
      employee: "000001",
      position: "Gerente",
      name: "Juan Pérez",
      email: "juan.perez@mail.com",
      creditor: "123456",
      company: "EmpresaX",
    });

    // Test last record
    expect(approvalsData[7]).toEqual({
      id: 8,
      code: "0008",
      departureDate: "25/10/2025",
      city: "Chihuahua",
      country: "MX",
      reason: "Visita técnica",
      authorization: "Autorizado",
      checking: "Liquidado",
      refund: "$170",
      currency: "MXN",
      employee: "000008",
      position: "Técnico",
      name: "Elena Torres",
      email: "elena.torres@mail.com",
      creditor: "123463",
      company: "EmpresaE",
    });
  });
});
