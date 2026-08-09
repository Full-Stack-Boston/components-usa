import {
  firebaseConfig,
  isValidFirebaseWebConfig,
} from "./firebase-config.js";

/**
 * Initialize Firebase with injectable SDK functions (testable without CDN).
 */
export function initFirebase({
  initializeAppFn,
  getAnalyticsFn,
  config = firebaseConfig,
} = {}) {
  if (typeof initializeAppFn !== "function" || typeof getAnalyticsFn !== "function") {
    throw new Error("Firebase SDK functions are required");
  }
  if (!isValidFirebaseWebConfig(config)) {
    throw new Error("Invalid Firebase web config");
  }
  const app = initializeAppFn(config);
  const analytics = getAnalyticsFn(app);
  return { app, analytics };
}
