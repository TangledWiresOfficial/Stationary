import {UserManager} from "oidc-client-ts";
import {isTauri} from "@tauri-apps/api/core";
import {getStorage, parseRawJourneys} from "./storage.ts";
import {TauriNavigator} from "./tauriNavigator.ts";
import axios, {AxiosError} from "axios";
import {Journey} from "./journey.ts";

export const SYNC_URL = import.meta.env.VITE_STATIONARY_SYNC_URL ?? "https://stationary-sync.tangledwires.co.uk";

const MAX_SYNC_ATTEMPTS = 3;

const redirectNavigator = isTauri() ? new TauriNavigator() : undefined;

export const userManager = new UserManager({
  authority: "https://auth.tangledwires.co.uk/realms/master",
  client_id: "stationary-sync",
  redirect_uri: getRedirectURI(),
  response_type: "code",
  scope: "openid profile offline_access",
}, redirectNavigator);

export async function login() {
  await userManager.signinRedirect();
}

export async function handleCallback(url: string) {
  await getStorage().setUser(await userManager.signinCallback(url));
}

export function getRedirectURI() {
  if (!isTauri()) {
    return window.location.origin + "/auth/callback";
  } else {
    return "stationary://auth/callback";
  }
}

export class StationarySync {
  public static async sync() {
    const deletedUuids = await getStorage().getDeletedJourneyUuids();
    // Rails will refuse to accept an empty array, so if it's empty, add an empty string
    if (deletedUuids.length === 0) {
      deletedUuids.push("");
    }

    const journeys = await getStorage().getJourneys();
    // Same as above
    if (journeys.length === 0) {
      journeys.push({} as Journey);
    }

    let response;
    for (let i = 0; i < MAX_SYNC_ATTEMPTS; i++) {
      const axios = await StationarySync.getAxios();

      try {
        response = await axios.post(SYNC_URL + "/api/v1/journeys/sync", {
          deleted_uuids: deletedUuids,
          journeys: journeys.map((journey) => ({ uuid: journey.uuid, timestamp: journey.timestamp, parts_attributes: journey.parts })),
        });

        break;
      } catch (error) {
        // If we get a 401, it means that the user's token has expired, so renew it and try again
        if ((error as AxiosError).response?.status === 401) {
          await userManager.signinSilent();
        }

        console.error(error);
      }
    }

    if (!response) {
      alert(`Failed to sync after ${MAX_SYNC_ATTEMPTS} attempts. Try logging out and back in and check status.tangledwires.co.uk for service status.`);
      throw new Error(`Failed to sync after ${MAX_SYNC_ATTEMPTS} attempts`);
    }

    await getStorage().setDeletedJourneyUuids([]);
    await getStorage().setJourneys(parseRawJourneys(response.data));
    alert("Synced successfully");
  }

  private static async getAxios() {
    const user = await getStorage().getUser();

    console.log(user?.access_token);

    return axios.create({
      headers: {
        Authorization: "Bearer " + user?.access_token
      }
    });
  }
}
