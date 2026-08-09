/** Shared site behavior helpers for the compact layout (CUSA product JS). */

export function shouldHeaderBeOpaque(scrollY, headerHeight, windowWidth) {
  const threshold = headerHeight + 30;
  if (windowWidth > 768) {
    return scrollY > threshold;
  }
  // Narrow viewports: opaque once past header band, clear only when back above it.
  if (scrollY < threshold) return false;
  return true;
}

export function isContactSendSuccess(message) {
  return message === "Sent!";
}

export function contactErrorMessage(message) {
  if (!message) return "Something went wrong. Please try again.";
  return message;
}

export function shouldUseMobileNav(toggleVisible) {
  return Boolean(toggleVisible);
}
