import {
  Alert,
  Button,
  Form,
  FormAlert,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  PageSectionTypes,
  TextInput
} from "@patternfly/react-core";
import {PageHeader} from "../components/PageHeader.tsx";
import {JourneyWizard} from "../components/JourneyWizard.tsx";
import {useState} from "react";
import {Journey} from "../utils/journey.ts";
import {useNavigate} from "react-router";

export function NewJourney() {
  const navigate = useNavigate();

  const [journeyImporterOpen, setJourneyImporterOpen] = useState(false);
  const [toBeImported, setToBeImported] = useState<string>();
  const [importFailed, setImportFailed] = useState(false);

  const closeJourneyImporter = () => {
    setImportFailed(false);
    setJourneyImporterOpen(false);
  };

  const importJourney = async () => {
    const journey = Journey.fromShareable(toBeImported!);

    if (!journey) {
      setImportFailed(true);
    } else {
      await journey.save();
      navigate("/journeyhistory");
    }
  };

  const journeyImporter = (
    <Modal isOpen={journeyImporterOpen} variant={ModalVariant.small}>
      <ModalHeader title="Import journey" />
      <ModalBody>
        <Form>
          {importFailed && (
            <FormAlert>
              <Alert variant="danger" title="That code is invalid." aria-live="polite" isInline />
            </FormAlert>
          )}
          <FormGroup label="Journey code" isRequired>
            <TextInput
              isRequired
              type="text"
              onChange={(_, value) => {
                setImportFailed(false);
                setToBeImported(value);
              }}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" isDisabled={!toBeImported} onClick={importJourney}>Import</Button>
        <Button key="cancel" variant="link" onClick={closeJourneyImporter}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <>
      <PageHeader title="New journey">
        <Button variant="secondary" onClick={() => setJourneyImporterOpen(true)}>Import journey</Button>
      </PageHeader>
      <PageSection isFilled hasBodyWrapper={false} type={PageSectionTypes.wizard}>
        <JourneyWizard />
        {journeyImporter}
      </PageSection>
    </>
  );
}
