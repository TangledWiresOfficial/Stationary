import {LazyStore} from "@tauri-apps/plugin-store";
import {isJourneyData, Journey, toJourney} from "./journey.ts";
import LZString from "lz-string";
import {isTauri} from "@tauri-apps/api/core";
import {CategoryId, VERSION as STATION_DATA_VERSION} from "@tangledwires/gb-station-data";
import {StateStore} from "oidc-client-ts";
import {ObtainedAchievement} from "./achievements.tsx";

const STATION_DATA_VERSION_KEY = "stationDataVersion";
const JOURNEYS_KEY = "journeys";
const DELETED_JOURNEY_UUIDS_KEY = "deletedJourneyUuids";
const OBTAINED_ACHIEVEMENTS_KEY = "obtainedAchievements";
const VISIBLE_CATEGORIES_KEY = "visibleCategories";

const DEFAULT_CATEGORIES = [
  "heavyRail",
  "metro",
  "lightRail",
  "trams",
  "other",
];

// Fields that are no longer used and should be removed from storage
const OLD_FIELDS = [
  "user",
];

export interface DataStorage {
  // Get the name of the storage implementation
  getImplName: () => string;

  // Get all data from storage
  getAllData: () => Promise<Record<string, unknown>>;

  // Create a StateStore for storing auth state
  createOidcStateStore: () => StateStore;

  // Remove old fields from storage
  removeOldFields: () => Promise<void>;

  // Get the list of journeys
  getJourneys: () => Promise<Journey[]>;

  // Set the list of journeys
  setJourneys: (journeys: Journey[]) => Promise<void>;

  // Get the last version of `@tangledwires/gb-station-data` used to store journey data
  getLastUsedStationDataVersion: () => Promise<string | undefined>;

  // Get the list of deleted journey UUIDs to be deleted from Stationary Sync later
  getDeletedJourneyUuids: () => Promise<string[]>;

  // Set the list of deleted journey UUIDs to be deleted from Stationary Sync later
  setDeletedJourneyUuids: (uuids: string[]) => Promise<void>;

  // Get the list of obtained achievements
  getObtainedAchievements: () => Promise<ObtainedAchievement[]>;

  // Set the list of obtained achievements
  setObtainedAchievements: (achievements: ObtainedAchievement[]) => Promise<void>;

  // Get the list of categories whose lines are visible to the user
  getVisibleCategories: () => Promise<CategoryId[]>;

  // Set the list of categories whose lines are visible to the user
  setVisibleCategories: (categories: CategoryId[]) => Promise<void>;
}

const TAURI_STORE_PATH = "userdata.json";
const TAURI_OIDC_STORE_PATH = "authstore.json";

export class TauriStorage implements DataStorage {
  private store;

  public constructor() {
    this.store = new LazyStore(TAURI_STORE_PATH);
  }

  public getImplName() {
    return "TauriStorage";
  }

  public async getAllData() {
    return Object.fromEntries(await this.store.entries());
  }

  public createOidcStateStore() {
    const oidcStore = new LazyStore(TAURI_OIDC_STORE_PATH);
    return {
      set: (key: string, value: string) => oidcStore.set(key, value),
      get: (key: string) => oidcStore.get(key) as Promise<string | null>,
      remove: async (key: string) => {
        const value = await oidcStore.get(key);
        await oidcStore.delete(key);
        return value as string | null;
      },
      getAllKeys: () => oidcStore.keys(),
    };
  }

  public async removeOldFields() {
    for (const field of OLD_FIELDS) {
      await this.store.delete(field);
    }
  }

  public async getJourneys() {
    const raw = await this.store.get(JOURNEYS_KEY);

    return parseRawJourneys(raw);
  }

  public async setJourneys(journeys: Journey[]) {
    await this.store.set(JOURNEYS_KEY, journeys);
    await this.store.set(STATION_DATA_VERSION_KEY, STATION_DATA_VERSION);
  }

  public async getLastUsedStationDataVersion() {
    return await this.store.get(STATION_DATA_VERSION_KEY) as string;
  }

  public async getDeletedJourneyUuids() {
    return await this.store.get(DELETED_JOURNEY_UUIDS_KEY) as string[] ?? [];
  }

  public async setDeletedJourneyUuids(uuids: string[]) {
    await this.store.set(DELETED_JOURNEY_UUIDS_KEY, uuids);
  }

  public async getObtainedAchievements() {
    const obtainedAchievements = await this.store.get(OBTAINED_ACHIEVEMENTS_KEY) as any[] ?? [];

    for (const a of obtainedAchievements) {
      a.obtainedAt = new Date(a.obtainedAt);
    }

    return obtainedAchievements as ObtainedAchievement[];
  }

  public async setObtainedAchievements(achievements: ObtainedAchievement[]) {
    await this.store.set(OBTAINED_ACHIEVEMENTS_KEY, achievements);
  }

  public async getVisibleCategories() {
    return await this.store.get(VISIBLE_CATEGORIES_KEY) as CategoryId[] ?? DEFAULT_CATEGORIES;
  }

  public async setVisibleCategories(categories: CategoryId[]) {
    await this.store.set(VISIBLE_CATEGORIES_KEY, categories);
  }
}

const BROWSER_DATA_KEY = "data";
const BROWSER_OIDC_STORE_KEY = "oidc";

export class BrowserStorage implements DataStorage {
  public getImplName() {
    return "BrowserStorage";
  }

  public async getAllData() {
    return this.getData();
  }

  public createOidcStateStore() {
    return {
      set: async (key: string, value: string) => {
        const data = this.getOidcData();
        data[key] = value;
        this.setOidcData(data);
      },
      get: async (key: string) => {
        return this.getOidcData()[key];
      },
      remove: async (key: string) => {
        const data = this.getOidcData();
        const value = data[key];
        delete data[key];
        this.setOidcData(data);
        return value;
      },
      getAllKeys: async () => {
        return Object.keys(this.getOidcData());
      },
    };
  }

  public async removeOldFields() {
    const data = this.getData();
    for (const key in data) {
      delete data[key];
    }
    this.setData(data);
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

  public async getLastUsedStationDataVersion() {
    return this.getData()[STATION_DATA_VERSION_KEY];
  }

  public async getDeletedJourneyUuids() {
    return this.getData()[DELETED_JOURNEY_UUIDS_KEY] ?? [];
  }

  public async setDeletedJourneyUuids(uuids: string[]) {
    const data = this.getData();

    data[DELETED_JOURNEY_UUIDS_KEY] = uuids;

    this.setData(data);
  }

  public async getObtainedAchievements() {
    const obtainedAchievements = this.getData()[OBTAINED_ACHIEVEMENTS_KEY] ?? [];

    for (const a of obtainedAchievements) {
      a.obtainedAt = new Date(a.obtainedAt);
    }

    return obtainedAchievements;
  }

  public async setObtainedAchievements(achievements: ObtainedAchievement[]) {
    const data = this.getData();

    data[OBTAINED_ACHIEVEMENTS_KEY] = achievements;

    this.setData(data);
  }

  public async getVisibleCategories() {
    return this.getData()[VISIBLE_CATEGORIES_KEY] ?? DEFAULT_CATEGORIES;
  }

  public async setVisibleCategories(categories: CategoryId[]) {
    const data = this.getData();

    data[VISIBLE_CATEGORIES_KEY] = categories;

    this.setData(data);
  }

  private getData() {
    return this.getCompressedJsonData(BROWSER_DATA_KEY);
  }

  private setData(data: object) {
    this.setCompressedJsonData(BROWSER_DATA_KEY, data);
  }

  private getOidcData() {
    return this.getCompressedJsonData(BROWSER_OIDC_STORE_KEY);
  }

  private setOidcData(data: object) {
    this.setCompressedJsonData(BROWSER_OIDC_STORE_KEY, data);
  }

  private getCompressedJsonData(key: string) {
    const compressed = localStorage.getItem(key);
    if (!compressed) return {};

    const json = LZString.decompress(compressed);
    return json ? JSON.parse(json) : {};
  }

  private setCompressedJsonData(key: string, data: object) {
    const json = JSON.stringify(data);
    const compressed = LZString.compress(json);

    localStorage.setItem(key, compressed);
  }
}

export function parseRawJourneys(raw: unknown) {
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
