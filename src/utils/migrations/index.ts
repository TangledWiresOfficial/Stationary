import {getStorage} from "../storage.ts";
import {migrators} from "./registry.ts";
import {Journey} from "../journey.ts";

import "./8-9.ts";
import "./9-10.ts";

/**
 * Migrate all stored journeys to the latest version.
 */
export async function migrateAll() {
  const storage = getStorage();
  const journeys = await storage.getJourneys();
  const lastUsedMajorStationDataVersion = await storage.getLastUsedStationDataVersion();

  // If lastUsedMajorStationDataVersion is undefined, then no journeys have been saved before and there's nothing to migrate
  if (!lastUsedMajorStationDataVersion) return;

  const migrated = await migrate(journeys, lastUsedMajorStationDataVersion);

  await storage.setJourneys(migrated);
}

export async function migrate(journeys: Journey[], currentVersion: string) {
  const lastUsedMajorStationDataVersion = parseInt(currentVersion.split(".")[0]);
  for (const m of migrators.toSorted((a, b) => a.oldMajorVersion - b.oldMajorVersion)) {
    // Skip this migrator if the target isn't higher than the current version
    if (m.newMajorVersion <= lastUsedMajorStationDataVersion) continue;

    console.log(`Migrating version ${m.oldMajorVersion} data to version ${m.newMajorVersion}.`);

    journeys = journeys.map(m.migrator);
  }

  return journeys;
}
