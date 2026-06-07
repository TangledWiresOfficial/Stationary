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
    for (const [idx, part] of journey.parts.entries()) {
      // In this example, Bank has been visited on both the Central Line (entering), and the Waterloo & City Line (exiting).
      // Without the next section, the app will only record Bank as being visited on the Central Line,
      // because JourneyPart only contains the station and the line used to enter the station
      //
      // () Ealing Broadway
      // |
      // |  Central
      // |
      // () Bank
      // |
      // |  Waterloo & City
      // |
      // () Waterloo
      if (journey.parts[idx - 1]) {
        // Get the previous part of the journey (in the example, this is `{ station: "bank", line: "central" }` and `part` is `{ station: "waterloo", line: "waterlooAndCity" }`)
        const previous = journey.parts[idx - 1];

        // Add 1 to the number of times that the previous station ("bank") has been visited on the current line ("waterlooAndCity")
        visitsPerStation[previous.station].perLine[part.line]++;
        visitsPerStation[previous.station].total++;
      }

      visitsPerStation[part.station].perLine[part.line]++;
      visitsPerStation[part.station].total++;
    }
  }

  return visitsPerStation;
}