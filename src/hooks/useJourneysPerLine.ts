import {getJourneysPerLine} from "../utils/line.ts";
import {useData} from "./useData.ts";

export function useJourneysPerLine() {
  return useData(getJourneysPerLine);
}