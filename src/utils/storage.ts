import {LazyStore} from "@tauri-apps/plugin-store";
import {isJourneyData, Journey, toJourney} from "./journey.ts";
import LZString from "lz-string";
import {isTauri} from "@tauri-apps/api/core";

const JOURNEYS_KEY = "journeys";

export interface DataStorage {
  // Get the list of journeys
  getJourneys: () => Promise<Journey[]>;

  // Set the list of journeys
  setJourneys: (journeys: Journey[]) => Promise<void>;

  // Clear the list of journeys
  clearJourneys: () => Promise<void>;
}

const TAURI_STORE_PATH = "userdata.json";

export class TauriStorage implements DataStorage {
  private store;

  public constructor() {
    this.store = new LazyStore(TAURI_STORE_PATH);
  }

  public async getJourneys() {
    const raw = await this.store.get(JOURNEYS_KEY);

    return parseRawJourneys(raw)
  }

  public async setJourneys(journeys: Journey[]) {
    await this.store.set(JOURNEYS_KEY, journeys);
  }

  public async clearJourneys() {
    await this.setJourneys([]);
  }
}

const BROWSER_DATA_KEY = "data";

export class BrowserStorage implements DataStorage {
  public async getJourneys() {
    const raw = this.getData()[JOURNEYS_KEY];

    return parseRawJourneys(raw);
  }

  public async setJourneys(journeys: Journey[]) {
    const data = this.getData();

    data[JOURNEYS_KEY] = journeys;

    this.setData(data);
  }

  public async clearJourneys() {
    await this.setJourneys([]);
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