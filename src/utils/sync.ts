import {UserManager} from "oidc-client-ts";
import {isTauri} from "@tauri-apps/api/core";
import {type} from "@tauri-apps/plugin-os";
import {getStorage} from "./storage.ts";

export const SYNC_URL = "https://stationary-sync.tangledwires.co.uk";

export const userManager = new UserManager({
  authority: "https://accounts.tangledwires.co.uk/application/o/stationary-sync/",
  client_id: "OdZvDUTEsD7mArYdKAQbW2MbzyNtghk7pqEY26TA",
  redirect_uri: getRedirectURI(),
  response_type: "code",
  scope: "openid profile offline_access",
});

export async function login() {
  await userManager.signinRedirect();
}

export async function handleCallback(url: string) {
  await getStorage().setUser(await userManager.signinCallback(url));
  console.log(await fetch("http://localhost:3000/api/v1/journeys", {
    headers: {
      Authorization: "Bearer " +(await getStorage().getUser())!.access_token
    }
  }));
}

export function getRedirectURI() {
  if (!isTauri() || (type() === "ios" || type() === "android")) {
    return window.location.origin + "/auth/callback";
  } else {
    return "stationary://auth/callback";
  }
}