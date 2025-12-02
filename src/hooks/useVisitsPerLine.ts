import {useEffect, useState} from "react";
import {getVisitsPerLine, VisitsPerLine} from "../utils/line.ts";

export function useVisitsPerLine() {
  const [visitsPerLine, setVisitsPerLine] = useState<VisitsPerLine>();

  useEffect(() => {
    getVisitsPerLine().then(setVisitsPerLine);
  }, []);

  return visitsPerLine;
}