import {PageHeader} from "../components/PageHeader.tsx";
import {
  Button,
  FileUpload,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection
} from "@patternfly/react-core";
import {useJourneys} from "../hooks/useJourneys.ts";
import {isTauri} from "@tauri-apps/api/core";
import {save as saveDialog} from "@tauri-apps/plugin-dialog";
import {create} from "@tauri-apps/plugin-fs";
import {downloadText} from "../utils/download.ts";
import {useLastUsedStationDataVersion} from "../hooks/useLastUsedStationDataVersion.ts";
import {getStorage, parseRawJourneys} from "../utils/storage.ts";
import {v4} from "uuid";
import {useState} from "react";
import {AndroidFs, isAndroid} from "tauri-plugin-android-fs-api";
import {migrate} from "../utils/migrations";

export function Settings() {
  const journeys = useJourneys();
  const stationDataVersion = useLastUsedStationDataVersion();

  const [journeysImporterOpen, setJourneysImporterOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>();
  const [dataToImport, setDataToImport] = useState<any>();

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
      if (isAndroid()) {
        const uri = await AndroidFs.showSaveFilePicker("journeys.json", null);
        if (!uri) return;
        await AndroidFs.writeTextFile(uri, journeysToJson());
      } else {
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
      }
    } else {
      downloadText("journeys.json", journeysToJson());
    }
  };

  const importJourneys = async () => {
    const parsed = parseRawJourneys(dataToImport.journeys.map((j: any) => {
      return {
        timestamp: j.timestamp,
        parts: j.parts,
        uuid: v4(),
      };
    }));

    const migrated = await migrate(parsed, dataToImport.stationDataVersion);

    await getStorage().setJourneys(migrated.concat(journeys.data!));

    closeImporter();
  };

  const closeImporter = () => {
    setFileToImport(null);
    setDataToImport(null);
    setJourneysImporterOpen(false);
  }

  const journeysImporter = (
    <Modal isOpen={journeysImporterOpen} variant={ModalVariant.small}>
      <ModalHeader title="Import journeys from file" />
      <ModalBody>
        <FileUpload
          id="journeys-importer"
          filenamePlaceholder="Select a file"
          filename={fileToImport?.name}
          onFileInputChange={async (_, file) => {
            setFileToImport(file);
            setDataToImport(JSON.parse(await file.text()));
          }}
          onClearClick={() => {
            setFileToImport(null);
            setDataToImport(null);
          }}
          hideDefaultPreview
          dropzoneProps={{
            accept: {
              "application/json": [".json"]
            },
            maxFiles: 1,
          }}
        >
          {dataToImport?.journeys.length ?? 0} journeys to import.
        </FileUpload>
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" isDisabled={!dataToImport} onClick={importJourneys}>Import</Button>
        <Button key="cancel" variant="link" onClick={closeImporter}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <>
      <PageHeader title="Settings" />
      <PageSection>
        {!journeys.loading && !stationDataVersion.loading && (
          <>
            <Button onClick={exportJourneys}>Export journeys to file</Button>
            <br />
            <br />
            <Button onClick={() => setJourneysImporterOpen(true)}>Import journeys from file</Button>
          </>
        )}
      </PageSection>
      {journeysImporter}
    </>
  );
}