import {PageHeader} from "../components/PageHeader.tsx";
import {Button, PageSection} from "@patternfly/react-core";
import {useJourneys} from "../hooks/useJourneys.ts";
import {isTauri} from "@tauri-apps/api/core";
import {open as openDialog, save as saveDialog} from "@tauri-apps/plugin-dialog";
import {create, readTextFile} from "@tauri-apps/plugin-fs";
import {downloadText} from "../utils/download.ts";
import {useStationDataVersion} from "../hooks/useStationDataVersion.ts";
import {getStorage, parseRawJourneys} from "../utils/storage.ts";
import {v4} from "uuid";

export function Settings() {
  const journeys = useJourneys();
  const stationDataVersion = useStationDataVersion();

  const journeysToJson = () => {
    return JSON.stringify({
      stationDataVersion: stationDataVersion.data!,
      journeys: journeys.data!.map((j) => {
        return {
          timestamp: j.timestamp,
          parts: j.parts,
        };
      }),
    }, null, 2);
  };

  const exportJourneys = async () => {
    if (isTauri()) {
      const path = await saveDialog({
        filters: [
          {
            name: "JSON",
            extensions: ["json"]
          }
        ]
      });

      if (!path) return;

      const file = await create(path);
      await file.write(new TextEncoder().encode(journeysToJson()));
      await file.close();
    } else {
      downloadText("journeys.json", journeysToJson());
    }
  };

  const importJourneys = async () => {
    if (isTauri()) {
      const path = await openDialog({
        multiple: false,
        directory: false,
      });

      if (!path) return;

      const data = JSON.parse(await readTextFile(path));

      if (data.stationDataVersion !== stationDataVersion.data) {
        alert("The selected journey file is incompatible with the current version of Stationary.");
        return;
      }

      await getStorage().setJourneys(parseRawJourneys(data.journeys.map((j: any) => {
        return {
          timestamp: j.timestamp,
          parts: j.parts,
          uuid: v4(),
        };
      })).concat(journeys.data!));
    }
  }

  return (
    <>
      <PageHeader title="Settings" />
      <PageSection>
        {!journeys.loading && !stationDataVersion.loading && (
          <>
            <Button onClick={exportJourneys}>Export journeys to file</Button>
            <br />
            <br />
            <Button onClick={importJourneys}>Import journeys from file</Button>
          </>
        )}
      </PageSection>
    </>
  );
}