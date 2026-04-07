import {getVisitsPerToc} from "../utils/toc.ts";
import {useData} from "./useData.ts";

export function useVisitsPerToc() {
  return useData(getVisitsPerToc);
}