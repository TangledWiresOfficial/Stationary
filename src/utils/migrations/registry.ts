import {Journey} from "../journey.ts";
import {StationId} from "@tangledwires/gb-station-data";

export let migrators: { oldMajorVersion: number, newMajorVersion: number, migrator: (journey: Journey) => Journey }[] = [];

/**
 * Register a function that migrates a journey between two versions.
 *
 * @param oldMajorVersion The old major version of the journey
 * @param newMajorVersion The major version the journey will be migrated to
 * @param migrator The function that migrates the journey
 */
export function migration(oldMajorVersion: number, newMajorVersion: number, migrator: (journey: Journey) => Journey) {
  if (migrators.find((m) => m.oldMajorVersion === oldMajorVersion)) {
    throw new Error(`There is already a migrator registered with the same oldMajorVersion (${oldMajorVersion})`);
  } else if (migrators.find((m) => m.newMajorVersion === newMajorVersion)) {
    throw new Error(`There is already a migrator registered with the same newMajorVersion (${newMajorVersion})`);
  }

  migrators.push({ oldMajorVersion, newMajorVersion, migrator });
}

export function renameStation(journey: Journey, oldId: string, newId: string) {
  for (const p of journey.parts) {
    if (p.station === oldId) {
      p.station = newId as StationId;
      console.log(`Renamed station ${oldId} to ${newId}`);
    }
  }
}