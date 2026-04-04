// let devModeEnabled = import.meta.env.DEV;
let devModeEnabled = false;

export function getDevModeEnabled() {
  return devModeEnabled;
}

export function setDevModeEnabled(enabled: boolean) {
  devModeEnabled = enabled;
}