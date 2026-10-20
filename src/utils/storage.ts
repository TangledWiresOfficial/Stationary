import {LazyStore} from "@tauri-apps/plugin-store";
import {isJourneyData, Journey, toJourney} from "./journey.ts";
import LZString from "lz-string";
import {isTauri} from "@tauri-apps/api/core";
import {CategoryId, VERSION as STATION_DATA_VERSION} from "@tangledwires/gb-station-data";
import {User} from "oidc-client-ts";
import {ObtainedAchievement} from "./achievements.tsx";

const STATION_DATA_VERSION_KEY = "stationDataVersion";
const JOURNEYS_KEY = "journeys";
const USER_KEY = "user";
const DELETED_JOURNEY_UUIDS_KEY = "deletedJourneyUuids";
const OBTAINED_ACHIEVEMENTS_KEY = "obtainedAchievements";
const VISIBLE_CATEGORIES_KEY = "visibleCategories";

export interface DataStorage {
  // Get the name of the storage implementation
  getImplName: () => string;

  // Get the list of journeys
  getJourneys: () => Promise<Journey[]>;

  // Set the list of journeys
  setJourneys: (journeys: Journey[]) => Promise<void>;

  // Get the last version of `@tangledwires/gb-station-data` used to store journey data
  getLastUsedStationDataVersion: () => Promise<string | undefined>;

  // Get the Stationary Sync user data
  getUser: () => Promise<User | undefined>;

  // Set the Stationary Sync user data
  setUser: (user: User | undefined) => Promise<void>;

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

export class TauriStorage implements DataStorage {
  private store;

  public constructor() {
    this.store = new LazyStore(TAURI_STORE_PATH);
  }

  public getImplName() {
    return "TauriStorage";
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

  public async getUser() {
    const storageString = await this.store.get(USER_KEY) as string;

    if (!storageString) return undefined;

    return User.fromStorageString(storageString);
  }

  public async setUser(user: User | undefined) {
    if (user === undefined) {
      await this.store.delete(USER_KEY);
    } else {
      await this.store.set(USER_KEY, user?.toStorageString());
    }
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
    return await this.store.get(VISIBLE_CATEGORIES_KEY) as CategoryId[] ?? [];
  }

  public async setVisibleCategories(categories: CategoryId[]) {
    await this.store.set(VISIBLE_CATEGORIES_KEY, categories);
  }
}

const BROWSER_DATA_KEY = "data";

export class BrowserStorage implements DataStorage {
  public getImplName() {
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

  public async getLastUsedStationDataVersion() {
    return this.getData()[STATION_DATA_VERSION_KEY];
  }

  public async getUser() {
    const storageString = this.getData()[USER_KEY];

    if (!storageString) return undefined;

    return User.fromStorageString(storageString);
  }

  public async setUser(user: User | undefined) {
    const data = this.getData();

    data[USER_KEY] = user?.toStorageString();

    this.setData(data);
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
    return this.getData()[VISIBLE_CATEGORIES_KEY] ?? [];
  }

  public async setVisibleCategories(categories: CategoryId[]) {
    const data = this.getData();

    data[VISIBLE_CATEGORIES_KEY] = categories;

    this.setData(data);
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
