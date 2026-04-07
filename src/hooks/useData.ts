import {useEffect, useState} from "react";

export function useData<T>(getData: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getData();
    setData(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return { data, loading, refresh: load };
}