import {PageHeader} from "../components/PageHeader.tsx";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  ClipboardCopy,
  Content,
  ContentVariants,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  Form,
  FormAlert,
  FormGroup,
  Icon,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  TextInput
} from "@patternfly/react-core";
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import {Stations} from "../utils/station.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import {useState} from "react";
import {getStorage} from "../utils/storage.ts";
import {Journey} from "../utils/journey.ts";
import {KebabDropdown} from "../components/KebabDropdown.tsx";

export function JourneyHistory() {
  const { journeys, loading, refresh } = useJourneys();
  const storage = getStorage();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Journey>();

  const [journeyImporterOpen, setJourneyImporterOpen] = useState(false);
  const [toBeImported, setToBeImported] = useState<string>();
  const [importFailed, setImportFailed] = useState(false);

  const [newJourneyCodePopupOpen, setNewJourneyCodePopupOpen] = useState(false);
  const [newJourneyCode, setNewJourneyCode] = useState<string>();

  const closeJourneyImporter = () => {
    setImportFailed(false);
    setJourneyImporterOpen(false);
  };

  const deleteJourney = async () => {
    await storage.setJourneys(journeys.filter((j) => j.uuid !== toBeDeleted!.uuid));
    await refresh();
    setDeleteConfirmationOpen(false);
  };

  const shareJourney = (journey: Journey) => {
    setNewJourneyCode(journey.toShareable());
    setNewJourneyCodePopupOpen(true);
  };

  const importJourney = async () => {
    const journey = Journey.fromShareable(toBeImported!);

    if (!journey) {
      setImportFailed(true);
    } else {
      await journey.save();
      closeJourneyImporter();
      await refresh();
    }
  };

  const deleteConfirmation = (
    <Modal isOpen={deleteConfirmationOpen} variant={ModalVariant.small}>
      <ModalHeader title="Delete this journey?" />
      <ModalBody>This cannot be undone.</ModalBody>
      <ModalFooter>
        <Button key="confirm" variant="danger" onClick={() => deleteJourney()}>Confirm</Button>
        <Button key="cancel" variant="link" onClick={closeJourneyImporter}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );

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

  const newJourneyCodePopup = (
    <Modal isOpen={newJourneyCodePopupOpen} variant={ModalVariant.small}>
      <ModalHeader title="Share journey" />
      <ModalBody>
        <Content component={ContentVariants.p}>
          This code can be imported by other users using the 'Import journey' button on the 'Journey history' page.
        </Content>
        <ClipboardCopy copyAriaLabel="Copy journey code" isReadOnly hoverTip="Copy" clickTip="Copied">
          {newJourneyCode!}
        </ClipboardCopy>
      </ModalBody>
      <ModalFooter>
        <Button key="done" onClick={() => setNewJourneyCodePopupOpen(false)}>Done</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <>
      <PageHeader title="Journey history" />
      <PageSection>
        <Button variant="secondary" onClick={() => setJourneyImporterOpen(true)}>Import journey</Button>
      </PageSection>
      <PageSection>
        <List isPlain>
          {journeys.length > 0 ? journeys.map((j) => (
            <ListItem key={j.uuid}>
              <Card>
                <CardTitle>
                  <Flex direction={{ default: "row" }}>
                    <FlexItem grow={{ default: "grow" }}>
                      {Stations[j.parts[0].station].displayName} <Icon><AngleRightIcon /></Icon> {Stations[j.parts[j.parts.length - 1].station].displayName}
                    </FlexItem>
                    <FlexItem>
                      <KebabDropdown>
                        <DropdownList>
                          <DropdownItem onClick={() => shareJourney(j)}>
                            Share
                          </DropdownItem>
                          <DropdownItem isDanger onClick={() => {
                            setToBeDeleted(j);
                            setDeleteConfirmationOpen(true);
                          }}>
                            Delete
                          </DropdownItem>
                        </DropdownList>
                      </KebabDropdown>
                    </FlexItem>
                  </Flex>
                </CardTitle>
                <CardBody>
                  Stations: {j.parts.map((p) => Stations[p.station].displayName).join(", ")}
                </CardBody>
                <CardFooter>
                  {new Date(j.timestamp).toLocaleDateString("en-GB")}
                </CardFooter>
              </Card>
            </ListItem>
          )) : !loading && (
            <EmptyState titleText="No journeys" icon={CubesIcon}>
              <EmptyStateBody>
                You haven't added any journeys yet. Go to <BarsIcon /> then 'New journey' or press 'Import journey' above to begin.
              </EmptyStateBody>
            </EmptyState>
          )}
        </List>
        {deleteConfirmation}
        {journeyImporter}
        {newJourneyCodePopup}
      </PageSection>
    </>
  );
}
