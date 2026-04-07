import {getStorage} from "../utils/storage.ts";
import {useData} from "./useData.ts";

export function useStationDataVersion() {
  return useData(() => getStorage().getStationDataVersion());
}