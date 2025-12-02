import {useEffect, useState} from "react";
import {Journey} from "../utils/journey.ts";
import {storage} from "../utils/storage.ts";

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    storage.getJourneys().then(setJourneys);
  }, []);

  return journeys;
}