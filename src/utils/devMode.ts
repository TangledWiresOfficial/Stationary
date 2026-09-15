let devModeEnabled = false;

export function getDevModeEnabled() {
  return devModeEnabled;
}

export function setDevModeEnabled(enabled: boolean) {
  devModeEnabled = enabled;
  console.log(`devModeEnabled set to ${devModeEnabled}`);
}
