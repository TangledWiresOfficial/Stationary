import {useEffect, useState} from "react";
import {Journey} from "../utils/journey.ts";

import {getStorage} from "../utils/storage.ts";

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStorage().getJourneys().then((data) => {
      setJourneys(data);
      setLoading(false);
    });
  }, []);

  return { journeys, loading };
}