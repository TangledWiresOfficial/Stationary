import {getStorage} from "../utils/storage.ts";
import {useData} from "./useData.ts";

export function useJourneys() {
  return useData(() => getStorage().getJourneys());
}