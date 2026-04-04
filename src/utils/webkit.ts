const DISMISSED_WARNING_KEY = "dismissedWebKitWarning";

export function isWebKit() {
  // https://stackoverflow.com/a/9039885
  return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

export function wasLaunchedFromHomeScreen() {
  return "standalone" in navigator && navigator.standalone as boolean;
}

export function dismissedWebKitWarning() {
  return localStorage.getItem(DISMISSED_WARNING_KEY) === "true";
}

export function setDismissedWebKitWarning(dismissed: boolean) {
  localStorage.setItem(DISMISSED_WARNING_KEY, dismissed.toString());
}