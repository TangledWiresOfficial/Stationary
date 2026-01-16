import {useEffect, useState} from "react";
import {getStorage} from "../utils/storage.ts";

export function useStationDataVersion() {
  const [stationDataVersion, setStationDataVersion] = useState<string>();

  useEffect(() => {
    getStorage().getStationDataVersion().then(setStationDataVersion);
  }, []);

  return stationDataVersion;
}