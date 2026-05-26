import {UserManager} from "oidc-client-ts";
import {isTauri} from "@tauri-apps/api/core";
import {getStorage, parseRawJourneys} from "./storage.ts";
import {TauriNavigator} from "./tauriNavigator.ts";
import axios, {AxiosInstance} from "axios";

export const SYNC_URL = import.meta.env.VITE_STATIONARY_SYNC_URL ?? "https://stationary-sync.tangledwires.co.uk";

const redirectNavigator = isTauri() ? new TauriNavigator() : undefined;

export const userManager = new UserManager({
  authority: "https://accounts.tangledwires.co.uk/application/o/stationary-sync/",
  client_id: "OdZvDUTEsD7mArYdKAQbW2MbzyNtghk7pqEY26TA",
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
  private static axios: AxiosInstance;

  static {
    getStorage().getUser().then((user) => {
      this.axios = axios.create({
        headers: {
          Authorization: "Bearer " + user?.access_token
        }
      });
    });
  }

  public static async getJourneys() {
    const response = await this.axios.get(SYNC_URL + "/api/v1/journeys");

    if (response.status === 401) {
      await getStorage().setUser(undefined);
      return null;
    } else {
      return parseRawJourneys(response.data);
    }
  }
}