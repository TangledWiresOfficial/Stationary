import {useData} from "./useData.ts";
import {getStorage} from "../utils/storage.ts";

export function useObtainedAchievements() {
  return useData(() => getStorage().getObtainedAchievements());
}