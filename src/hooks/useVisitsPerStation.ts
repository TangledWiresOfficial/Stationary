import {getVisitsPerStation} from "../utils/station.ts";
import {useData} from "./useData.ts";

export function useVisitsPerStation() {
  return useData(getVisitsPerStation);
}