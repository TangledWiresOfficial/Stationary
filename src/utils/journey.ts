import {StationId} from "./station.ts";
import {v4} from "uuid";
import {storage} from "./storage.ts";
import {LineId} from "./line.ts";

export type JourneyPart = {
  station: StationId;
  line: LineId;
};

export type JourneyData = {
  timestamp: number;
  parts: JourneyPart[];
  uuid?: string;
};

export function isJourneyData(data: any): data is JourneyData {
  return (
    data !== null && typeof data === "object" &&
    typeof data.timestamp === "number" &&
    Array.isArray(data.parts) && data.parts.every((p: any) => {
      return p !== null &&
      typeof p === "object" &&
      typeof p.station === "string" &&
      typeof p.line === "string";
    }) &&
    (data.uuid === undefined || typeof data.uuid === "string")
  );
}

export function toJourney(data: JourneyData) {
  const journey = new Journey(data.timestamp, data.parts);
  journey.uuid = data.uuid;

  return journey;
}

export class Journey {
  public readonly timestamp: number;
  public parts: JourneyPart[];

  // UUID will only be set once save() is called
  public uuid?: string;

  constructor(timestamp: number, parts: JourneyPart[]) {
    this.timestamp = timestamp;
    this.parts = parts;
  }

  public async save() {
    this.uuid = v4();

    let journeys = await storage.getJourneys();

    journeys.push(this);

    await storage.setJourneys(journeys);
  }
}