import {useData} from "./useData.ts";
import {userManager} from "../utils/sync.ts";

export function useUser() {
  return useData(() => userManager.getUser());
}