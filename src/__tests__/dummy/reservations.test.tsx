import { describe, it, expect } from "vitest";
import { TravelAgencyFormData } from "./../../pages/Reservations/local/dummyData.ts";

describe("TravelAgencyFormData", () => {
 it("exports array with correct structure", () => {
   expect(Array.isArray(TravelAgencyFormData)).toBe(true);
   expect(TravelAgencyFormData).toHaveLength(3);
 });

 it("contains required properties", () => {
   const requiredProps = ["id", "title", "travelDate", "destination", "requestDate", "days", "passengers", "transport", "price", "status"];
   
   TravelAgencyFormData.forEach(item => {
     requiredProps.forEach(prop => {
       expect(item).toHaveProperty(prop);
     });
   });
 });

 it("has correct data types", () => {
   TravelAgencyFormData.forEach(item => {
     expect(typeof item.id).toBe("string");
     expect(typeof item.title).toBe("string");
     expect(typeof item.days).toBe("number");
     expect(typeof item.passengers).toBe("number");
     expect(typeof item.price).toBe("number");
   });
 });

 it("contains expected first item", () => {
   expect(TravelAgencyFormData[0]).toEqual({
     id: "0001",
     title: "Viaje a Cancún",
     travelDate: "14/09/2020",
     destination: "Cancún, MX",
     requestDate: "10/09/2020",
     days: 5,
     passengers: 2,
     transport: "Avión",
     price: 12000,
     status: "Aprobado",
   });
 });
});
