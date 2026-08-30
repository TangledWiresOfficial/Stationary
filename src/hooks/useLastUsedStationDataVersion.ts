import {getStorage} from "../utils/storage.ts";
import {useData} from "./useData.ts";

export function useLastUsedStationDataVersion() {
  return useData(() => getStorage().getLastUsedStationDataVersion());
}