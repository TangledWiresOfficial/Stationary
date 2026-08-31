import {UserManager} from "oidc-client-ts";
import {isTauri} from "@tauri-apps/api/core";
import {getStorage, parseRawJourneys} from "./storage.ts";
import {TauriNavigator} from "./tauriNavigator.ts";
import axios, {AxiosInstance} from "axios";

export const SYNC_URL = import.meta.env.VITE_STATIONARY_SYNC_URL ?? "https://stationary-sync.tangledwires.co.uk";

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
  private static axiosPromise?: Promise<AxiosInstance>;

  public static async getJourneys() {
    const axios = await this.getAxios();

    const response = await axios.get(SYNC_URL + "/api/v1/journeys");

    // If we get a 401, it means that the user's token has expired, so just log them out
    if (response.status === 401) {
      await getStorage().setUser(undefined);
      return null;
    } else {
      return parseRawJourneys(response.data);
    }
  }

  private static getAxios() {
    if (!this.axiosPromise) {
      this.axiosPromise = getStorage().getUser().then((user) => {
        return axios.create({
          headers: {
            Authorization: "Bearer " + user?.access_token
          }
        });
      });
    }

    return this.axiosPromise;
  }
}
