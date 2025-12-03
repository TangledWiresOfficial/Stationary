import {useEffect, useState} from "react";
import {getVisitsPerStation, VisitsPerStation} from "../utils/station.ts";

export function useVisitsPerStation() {
  const [visitsPerStation, setVisitsPerStation] = useState<VisitsPerStation>();

  useEffect(() => {
    getVisitsPerStation().then(setVisitsPerStation);
  }, []);

  return visitsPerStation;
}