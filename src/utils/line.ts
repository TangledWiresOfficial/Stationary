import {getStorage} from "./storage.ts";
import {LineId, lineIds} from "@tangledwires/uk-station-data";

// Returned from `getVisitsPerLine`
export type VisitsPerLine = {
  [K in LineId]: number;
};

// Get how many times each line has been visited
export async function getVisitsPerLine() {
  const journeys = await getStorage().getJourneys();
  const visitsPerLine = Object.fromEntries(lineIds.map((id) => [id, 0])) as VisitsPerLine;

  for (const journey of journeys) {
    for (const part of journey.parts) {
      visitsPerLine[part.line]++;
    }
  }

  return visitsPerLine;
}

// Returned from `getJourneysPerLine`
export type JourneysPerLine = {
  [K in LineId]: number;
};

// Get how many journeys each line appears in
export async function getJourneysPerLine() {
  const journeys = await getStorage().getJourneys();
  const journeysPerLine = Object.fromEntries(lineIds.map((id) => [id, 0])) as JourneysPerLine;

  for (const journey of journeys) {
    for (const line of new Set(journey.parts.map((p) => p.line))) {
      journeysPerLine[line]++;
    }
  }

  return journeysPerLine;
}