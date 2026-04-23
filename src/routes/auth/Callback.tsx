import {useEffect} from "react";
import {handleCallback} from "../../utils/sync.ts";
import {PageHeader} from "../../components/PageHeader.tsx";

export function Callback() {
  useEffect(() => {
    handleCallback(window.location.href)
      .then(() => {
        window.location.href = "/";
      });
  }, []);

  return (
    <>
      <PageHeader title="Logging in..." />
    </>
  );
}