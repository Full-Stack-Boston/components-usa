import { describe, expect, it } from "vitest";
import {
  applyMailChimpStatus,
  buildMailChimpJsonUrl,
  easeFunctions,
  getFieldValidationError,
  shouldMenuBeOpaque,
  shouldShowBackToTop,
  siteConfig,
  toggleMenuOpen,
} from "./site-behavior.js";

describe("prominent site-behavior", () => {
  it("uses documented scroll thresholds", () => {
    expect(siteConfig.menuOpaqueAfterPx).toBe(150);
    expect(shouldMenuBeOpaque(151)).toBe(true);
    expect(shouldMenuBeOpaque(150)).toBe(false);
    expect(shouldShowBackToTop(900)).toBe(true);
    expect(shouldShowBackToTop(899)).toBe(false);
  });

  it("validates email fields via HTML5 validity", () => {
    expect(
      getFieldValidationError({
        disabled: true,
        type: "email",
        validity: { valid: false },
      }),
    ).toBeNull();

    expect(
      getFieldValidationError({
        disabled: false,
        type: "email",
        validity: { valid: true },
        hasAttribute: () => false,
        getAttribute: () => null,
      }),
    ).toBeNull();

    expect(
      getFieldValidationError({
        disabled: false,
        type: "email",
        validity: {
          valid: false,
          valueMissing: true,
          typeMismatch: false,
          patternMismatch: false,
        },
        hasAttribute: () => false,
        getAttribute: () => null,
      }),
    ).toMatch(/email address/i);

    expect(
      getFieldValidationError({
        disabled: false,
        type: "email",
        validity: {
          valid: false,
          valueMissing: false,
          typeMismatch: true,
          patternMismatch: false,
        },
        hasAttribute: () => false,
        getAttribute: () => null,
      }),
    ).toMatch(/valid email/i);

    expect(
      getFieldValidationError({
        disabled: false,
        type: "text",
        validity: {
          valid: false,
          valueMissing: false,
          typeMismatch: false,
          patternMismatch: true,
        },
        hasAttribute: (name) => name === "title",
        getAttribute: () => "Custom pattern",
      }),
    ).toBe("Custom pattern");

    expect(
      getFieldValidationError({
        disabled: false,
        type: "text",
        validity: {
          valid: false,
          valueMissing: false,
          typeMismatch: false,
          patternMismatch: true,
        },
        hasAttribute: () => false,
        getAttribute: () => null,
      }),
    ).toMatch(/requested format/i);

    expect(
      getFieldValidationError({
        disabled: false,
        type: "text",
        validity: {
          valid: false,
          valueMissing: false,
          typeMismatch: false,
          patternMismatch: false,
        },
        hasAttribute: () => false,
        getAttribute: () => null,
      }),
    ).toMatch(/invalid/i);
  });

  it("builds MailChimp JSONP URLs", () => {
    expect(buildMailChimpJsonUrl("", "EMAIL", "a@b.com")).toBe("");
    expect(
      buildMailChimpJsonUrl(
        "https://example.com/post?u=abc",
        "EMAIL",
        "a@b.com",
      ),
    ).toBe(
      "https://example.com/post-json?u=abc&EMAIL=a%40b.com&c=displayMailChimpStatus",
    );
  });

  it("applies MailChimp status classes", () => {
    const el = { classList: { remove() {}, add() {} }, innerHTML: "" };
    const removed = [];
    const added = [];
    el.classList.remove = (...c) => removed.push(...c);
    el.classList.add = (...c) => added.push(...c);

    expect(applyMailChimpStatus(null, { result: "success", msg: "ok" })).toBe(
      false,
    );
    expect(applyMailChimpStatus(el, { result: "error", msg: "bad" })).toBe(
      false,
    );
    expect(el.innerHTML).toBe("bad");
    expect(added).toContain("error-message");

    expect(applyMailChimpStatus(el, { result: "success", msg: "good" })).toBe(
      true,
    );
    expect(added).toContain("success-message");
  });

  it("toggles offcanvas menu state", () => {
    const body = document.createElement("div");
    expect(toggleMenuOpen(body, true)).toBe(true);
    expect(body.classList.contains("menu-is-open")).toBe(true);
    expect(toggleMenuOpen(body, false)).toBe(false);
    expect(toggleMenuOpen(null, true)).toBe(false);
  });

  it("exposes easing helpers used by MoveTo", () => {
    expect(easeFunctions.easeInQuad(1, 0, 10, 2)).toBeCloseTo(2.5);
    expect(easeFunctions.easeOutQuad(1, 0, 10, 2)).toBeCloseTo(7.5);
    // First half of the curve (t < midpoint after normalize).
    expect(easeFunctions.easeInOutQuad(0.5, 0, 10, 2)).toBeCloseTo(1.25);
    expect(easeFunctions.easeInOutCubic(0.5, 0, 10, 2)).toBeCloseTo(0.625);
    // Midpoint and second half.
    expect(easeFunctions.easeInOutQuad(1, 0, 10, 2)).toBeCloseTo(5);
    expect(easeFunctions.easeInOutCubic(1, 0, 10, 2)).toBeCloseTo(5);
    expect(easeFunctions.easeInOutQuad(3, 0, 10, 2)).toBeCloseTo(5);
    expect(easeFunctions.easeInOutCubic(3, 0, 10, 2)).toBeCloseTo(15);
  });
});
