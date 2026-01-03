import {useEffect, useState} from "react";
import {getJourneysPerLine, JourneysPerLine} from "../utils/line.ts";

export function useJourneysPerLine() {
  const [journeysPerLine, setJourneysPerLine] = useState<JourneysPerLine>();

  useEffect(() => {
    getJourneysPerLine().then(setJourneysPerLine);
  }, []);

  return journeysPerLine;
}