import {useEffect} from "react";
import {handleCallback} from "../../utils/sync.ts";
import {PageHeader} from "../../components/PageHeader.tsx";

export function CallbackPage() {
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