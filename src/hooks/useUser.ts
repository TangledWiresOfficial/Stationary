import {useData} from "./useData.ts";
import {getStorage} from "../utils/storage.ts";

export function useUser() {
  return useData(() => getStorage().getUser());
}