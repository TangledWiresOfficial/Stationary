import {getStorage} from "./storage.ts";
import {StationId, Stations} from "@tangledwires/uk-station-data";

export type NumberPerStation = {
  [K in StationId]: number;
};

// Get how many times each station has been visited
export async function getVisitsPerStation() {
  const journeys = await getStorage().getJourneys();
  const visitsPerStation = Object.fromEntries(Object.keys(Stations).map((id) => [id, 0])) as NumberPerStation;

  for (const journey of journeys) {
    for (const part of journey.parts) {
      visitsPerStation[part.station as keyof typeof Stations] += 1;
    }
  }

  return visitsPerStation;
}