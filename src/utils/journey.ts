import {StationId, Stations} from "./station.ts";
import {v4} from "uuid";
import {LineId, Lines} from "./line.ts";
import {getStorage} from "./storage.ts";

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

    const storage = getStorage();
    let journeys = await storage.getJourneys();
    journeys.push(this);
    await storage.setJourneys(journeys);
  }

  // Encode the journey in a shorter way so that it can be easily shared to other users and then reimported
  //
  // The journey will be encoded like this:
  //
  // `timestamp as hex|line,station|line,station|line,station`
  public toShareable() {
    return `${this.timestamp.toString(16)}|${this.parts.map((p) => `${p.line},${p.station}`).join("|")}`
  }

  // The opposite of toShareable()
  //
  // Returns a `Journey` if the shareable code was valid, or `null` if not
  public static fromShareable(shareable: string) {
    if (!shareable.includes("|")) return null;

    const sections = shareable.split("|");

    // The first "section" of a shareable code is the timestamp in hex
    const timestamp = parseInt(sections[0], 16);
    if (isNaN(timestamp)) return null;

    sections.shift();

    const parts = sections.map((s) => {
      if (!s.includes(",")) {
        return;
      }

      const split = s.split(",");

      if (!Object.keys(Lines).includes(split[0]) || !Object.keys(Stations).includes(split[1])) {
        return;
      }

      return {
        line: split[0] as LineId,
        station: split[1] as StationId,
      } satisfies JourneyPart;
    }).filter((s) => s !== undefined);

    if (parts.length < 1) {
      return null;
    }

    return new Journey(timestamp, parts);
  }
}