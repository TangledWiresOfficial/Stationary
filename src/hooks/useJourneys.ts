import {useEffect, useState} from "react";
import {Journey} from "../utils/journey.ts";
import {storage} from "../utils/storage.ts";

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.getJourneys().then((data) => {
      setJourneys(data);
      setLoading(false);
    });
  }, []);

  return { journeys, loading };
}