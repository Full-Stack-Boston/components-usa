import { describe, expect, it } from "vitest";
import {
  contactErrorMessage,
  isContactSendSuccess,
  shouldHeaderBeOpaque,
  shouldUseMobileNav,
} from "./site-behavior.js";

describe("compact site-behavior", () => {
  it("computes header opacity from scroll and viewport", () => {
    expect(shouldHeaderBeOpaque(200, 100, 1024)).toBe(true);
    expect(shouldHeaderBeOpaque(50, 100, 1024)).toBe(false);
    expect(shouldHeaderBeOpaque(50, 100, 500)).toBe(false);
    expect(shouldHeaderBeOpaque(200, 100, 500)).toBe(true);
  });

  it("classifies contact form responses", () => {
    expect(isContactSendSuccess("Sent!")).toBe(true);
    expect(isContactSendSuccess("Error")).toBe(false);
    expect(contactErrorMessage("Nope")).toBe("Nope");
    expect(contactErrorMessage("")).toMatch(/try again/i);
  });

  it("flags mobile nav when toggle is visible", () => {
    expect(shouldUseMobileNav(true)).toBe(true);
    expect(shouldUseMobileNav(false)).toBe(false);
  });
});
