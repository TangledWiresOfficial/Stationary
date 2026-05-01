import {Lines, TOCId, tocIds} from "@tangledwires/gb-station-data";
import {getStorage} from "./storage.ts";

export type NumberPerToc = {
  [K in TOCId]: number;
};

// Get how many times each TOC has been visited
export async function getVisitsPerToc() {
  const journeys = await getStorage().getJourneys();
  const visitsPerToc = Object.fromEntries(tocIds.map((id) => [id, 0])) as NumberPerToc;

  for (const journey of journeys) {
    for (const part of journey.parts) {
      for (const toc of Lines[part.line].tocs) {
        visitsPerToc[toc]++;
      }
    }
  }

  return visitsPerToc;
}