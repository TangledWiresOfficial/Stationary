import {useEffect, useState} from "react";
import {Journey} from "../utils/journey.ts";
import {getStorage} from "../utils/storage.ts";

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getStorage().getJourneys();
    setJourneys(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return { journeys, loading, refresh: load };
}