import {StationId} from "./station.ts";
import {v4} from "uuid";
import {storage} from "./storage.ts";

export class Journey {
  public readonly timestamp: number;
  public stations: StationId[];

  // UUID will only be defined once save() is called
  private uuid?: string;

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

  public getUUID() {
    return this.uuid;
  }
}