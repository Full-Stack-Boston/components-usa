/** Shared site behavior helpers for the prominent layout (CUSA product JS). */

export const siteConfig = {
  mailChimpURL: "",
  menuOpaqueAfterPx: 150,
  backToTopAfterPx: 900,
};

export function shouldMenuBeOpaque(scrollY, triggerHeight = siteConfig.menuOpaqueAfterPx) {
  return scrollY > triggerHeight;
}

export function shouldShowBackToTop(scrollY, pxShow = siteConfig.backToTopAfterPx) {
  return scrollY >= pxShow;
}

/**
 * HTML5 validity helper used by the MailChimp email field.
 * @param {Pick<HTMLInputElement, 'disabled'|'type'|'validity'|'hasAttribute'|'getAttribute'>} field
 */
export function getFieldValidationError(field) {
  if (
    field.disabled ||
    field.type === "file" ||
    field.type === "reset" ||
    field.type === "submit" ||
    field.type === "button"
  ) {
    return null;
  }

  const validity = field.validity;
  if (validity.valid) return null;
  if (validity.valueMissing) return "Please enter an email address.";
  if (validity.typeMismatch && field.type === "email") {
    return "Please enter a valid email address.";
  }
  if (validity.patternMismatch) {
    if (field.hasAttribute("title")) return field.getAttribute("title");
    return "Please match the requested format.";
  }
  return "The value you entered for this field is invalid.";
}

export function buildMailChimpJsonUrl(baseUrl, emailFieldName, emailValue) {
  if (!baseUrl) return "";
  const serialize =
    "&" +
    encodeURIComponent(emailFieldName) +
    "=" +
    encodeURIComponent(emailValue);
  return (
    baseUrl.replace("/post?u=", "/post-json?u=") +
    serialize +
    "&c=displayMailChimpStatus"
  );
}

export function applyMailChimpStatus(statusEl, data) {
  if (!statusEl || !data?.result || !data?.msg) return false;
  statusEl.innerHTML = data.msg;
  if (data.result === "error") {
    statusEl.classList.remove("success-message");
    statusEl.classList.add("error-message");
    return false;
  }
  statusEl.classList.remove("error-message");
  statusEl.classList.add("success-message");
  return true;
}

export const easeFunctions = {
  easeInQuad(t, b, c, d) {
    t /= d;
    return c * t * t + b;
  },
  easeOutQuad(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
  },
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  },
  easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  },
};

export function toggleMenuOpen(bodyEl, open) {
  if (!bodyEl) return false;
  bodyEl.classList.toggle("menu-is-open", open);
  return bodyEl.classList.contains("menu-is-open");
}
