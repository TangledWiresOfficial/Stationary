import {getStorage} from "./storage.ts";
import {LineId, Lines, StationId, Stations} from "@tangledwires/gb-station-data";

export type VisitsPerStation = {
  [K in StationId]: {
    total: number;
    perLine: {
      [K in LineId]: number;
    };
  };
};

// Get how many times each station has been visited
export async function getVisitsPerStation() {
  const journeys = await getStorage().getJourneys();
  const visitsPerStation = Object.fromEntries(Object.keys(Stations).map((id) => [id, {
    total: 0,
    perLine: Object.fromEntries(Object.keys(Lines).map((id) => [id, 0])),
  }])) as VisitsPerStation;

  for (const journey of journeys) {
    for (const part of journey.parts) {
      visitsPerStation[part.station].total += 1;
      visitsPerStation[part.station].perLine[part.line] += 1;
    }
  }

  return visitsPerStation;
}