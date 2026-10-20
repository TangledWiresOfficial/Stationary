import {useData} from "./useData.ts";
import {getStorage} from "../utils/storage.ts";

export function useVisibleCategories() {
  return useData(() => getStorage().getVisibleCategories());
}
