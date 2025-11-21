import {LazyStore} from "@tauri-apps/plugin-store";
import {Journey} from "./journey.ts";

const STORE_PATH = "userdata.json";

const JOURNEYS_KEY = "journeys";

export class Storage {
  private store;

  public constructor() {
    this.store = new LazyStore(STORE_PATH);
  }

  // Get the list of journeys
  public async getJourneys() {
    return await this.store.get(JOURNEYS_KEY);
  }

  // Set the list of journeys
  public async setJourneys(journeys: Journey[]) {
    await this.store.set(JOURNEYS_KEY, journeys);
  }

  // Clear the list of journeys
  public async clearJourneys() {
    await this.setJourneys([]);
  }
}

export const storage = new Storage();