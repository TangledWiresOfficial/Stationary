import {LazyStore} from "@tauri-apps/plugin-store";
import {isJourneyData, Journey, toJourney} from "./journey.ts";
import LZString from "lz-string";
import {isTauri} from "@tauri-apps/api/core";
import {VERSION as STATION_DATA_VERSION} from "@tangledwires/uk-station-data";

const STATION_DATA_VERSION_KEY = "stationDataVersion";
const JOURNEYS_KEY = "journeys";

export interface DataStorage {
  // Get the name of the storage backend
  getBackendName: () => string;

  // Get the list of journeys
  getJourneys: () => Promise<Journey[]>;

  // Set the list of journeys
  setJourneys: (journeys: Journey[]) => Promise<void>;

  // Clear the list of journeys
  clearJourneys: () => Promise<void>;

  // Get the last version of `@tangledwires/uk-station-data` used to store journey data
  getStationDataVersion: () => Promise<string>;
}

const TAURI_STORE_PATH = "userdata.json";

export class TauriStorage implements DataStorage {
  private store;

  public constructor() {
    this.store = new LazyStore(TAURI_STORE_PATH);
  }

  public getBackendName() {
    return "TauriStorage";
}

  public async getJourneys() {
    const raw = await this.store.get(JOURNEYS_KEY);

    return parseRawJourneys(raw)
  }

  public async setJourneys(journeys: Journey[]) {
    await this.store.set(JOURNEYS_KEY, journeys);
    await this.store.set(STATION_DATA_VERSION_KEY, STATION_DATA_VERSION);
  }

  public async clearJourneys() {
    await this.setJourneys([]);
  }

  public async getStationDataVersion() {
    return await this.store.get(STATION_DATA_VERSION_KEY) as string;
  }
}

const BROWSER_DATA_KEY = "data";

export class BrowserStorage implements DataStorage {
  public getBackendName() {
    return "BrowserStorage";
  }

  public async getJourneys() {
    const raw = this.getData()[JOURNEYS_KEY];

    return parseRawJourneys(raw);
  }

  public async setJourneys(journeys: Journey[]) {
    const data = this.getData();

    data[JOURNEYS_KEY] = journeys;
    data[STATION_DATA_VERSION_KEY] = STATION_DATA_VERSION;

    this.setData(data);
  }

  public async clearJourneys() {
    await this.setJourneys([]);
  }

  public async getStationDataVersion() {
    return this.getData()[STATION_DATA_VERSION_KEY].toString();
  }

  private getData() {
    const compressed = localStorage.getItem(BROWSER_DATA_KEY);
    if (!compressed) return {};

    const json = LZString.decompress(compressed);
    return json ? JSON.parse(json) : {};
  }

  private setData(data: object) {
    const json = JSON.stringify(data);
    const compressed = LZString.compress(json);

    localStorage.setItem(BROWSER_DATA_KEY, compressed);
  }
}

function parseRawJourneys(raw: unknown) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((e) => {
      if (!isJourneyData(e)) {
        console.error("Invalid journey data found: " + JSON.stringify(e))
        return false;
      }

      return true;
    })
    .map(toJourney);
}

let storage: DataStorage;

export function getStorage() {
  if (!storage) storage = isTauri() ? new TauriStorage() : new BrowserStorage();

  return storage;
}