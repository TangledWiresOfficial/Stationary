import {StationId} from "./station.ts";
import {v4} from "uuid";
import {storage} from "./storage.ts";

export type JourneyData = {
  timestamp: number;
  stations: StationId[];
  uuid?: string;
};

export function isJourneyData(data: any): data is JourneyData {
  return (
    data !== null && typeof data === "object" &&
    typeof data.timestamp === "number" &&
    Array.isArray(data.stations) && data.stations.every((s: any) => typeof s === "string") &&
    (data.uuid === undefined || typeof data.uuid === "string")
  );
}

export function toJourney(data: JourneyData) {
  const journey = new Journey(data.timestamp, data.stations);
  journey.uuid = data.uuid;

  return journey;
}

export class Journey {
  public readonly timestamp: number;
  public stations: StationId[];

  // UUID will only be set once save() is called
  public uuid?: string;

  constructor(timestamp: number, stations: StationId[]) {
    this.timestamp = timestamp;
    this.stations = stations;
  }

  public async save() {
    this.uuid = v4();

    let journeys = (await storage.getJourneys()) as Journey[];

    journeys.push(this);

    await storage.setJourneys(journeys);
  }
}