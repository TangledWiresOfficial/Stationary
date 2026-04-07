import {getVisitsPerLine} from "../utils/line.ts";
import {useData} from "./useData.ts";

export function useVisitsPerLine() {
  return useData(getVisitsPerLine);
}