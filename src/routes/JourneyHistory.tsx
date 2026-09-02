import {PageHeader} from "../components/PageHeader.tsx";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  ClipboardCopy,
  Content,
  ContentVariants,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody, ExpandableSection, Flex, FlexItem,
  Icon,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection
} from "@patternfly/react-core";
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import {useState} from "react";
import {getStorage} from "../utils/storage.ts";
import {Journey} from "../utils/journey.ts";
import {KebabDropdown} from "../components/KebabDropdown.tsx";
import {Stations} from "@tangledwires/gb-station-data";
import {useNavigate} from "react-router";
import {JourneyRoute} from "../components/JourneyRoute.tsx";

export function JourneyHistory() {
  const navigate = useNavigate();

  const { data: journeys, loading, refresh } = useJourneys();
  const storage = getStorage();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Journey>();

  const [newJourneyCodePopupOpen, setNewJourneyCodePopupOpen] = useState(false);
  const [newJourneyCode, setNewJourneyCode] = useState<string>();

  const deleteJourney = async () => {
    await storage.setJourneys(journeys!.filter((j) => j.uuid !== toBeDeleted!.uuid));
    await storage.setDeletedJourneyUuids([...(await storage.getDeletedJourneyUuids()), toBeDeleted!.uuid!]);

    await refresh();
    setDeleteConfirmationOpen(false);
  };

  const shareJourney = (journey: Journey) => {
    setNewJourneyCode(journey.toShareable());
    setNewJourneyCodePopupOpen(true);
  };

  const deleteConfirmation = (
    <Modal isOpen={deleteConfirmationOpen} variant={ModalVariant.small}>
      <ModalHeader title="Delete this journey?" />
      <ModalBody>This cannot be undone.</ModalBody>
      <ModalFooter>
        <Button key="confirm" variant="danger" onClick={() => deleteJourney()}>Confirm</Button>
        <Button key="cancel" variant="link" onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );

  const newJourneyCodePopup = (
    <Modal isOpen={newJourneyCodePopupOpen} variant={ModalVariant.small}>
      <ModalHeader title="Share journey" />
      <ModalBody>
        <Content component={ContentVariants.p}>
          This code can be imported by other users using the 'Import journey' button on the 'New journey' page.
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
        <Content component={ContentVariants.h4}>Total journeys: {!loading && journeys!.length}</Content>
      </PageSection>
      <PageSection>
        <List isPlain>
          {!loading && journeys!.length > 0 ? journeys!
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((j) => (
              <ListItem key={j.uuid}>
                <Card>
                  <CardHeader actions={{ actions: (
                    <KebabDropdown>
                      <DropdownList>
                        <DropdownItem onClick={() => navigate(`/editjourney/${j.uuid}`)}>
                          Edit
                        </DropdownItem>
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
                  ) }}>
                    <CardTitle>
                      {Stations[j.parts[0]?.station]?.displayName} <Icon><AngleRightIcon /></Icon> {Stations[j.parts[j.parts.length - 1]?.station]?.displayName}
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Flex direction={{ default: "column" }}>
                      {j.description && (
                        <FlexItem>
                          <Content>
                            <blockquote>{j.description}</blockquote>
                          </Content>
                        </FlexItem>
                      )}
                      <FlexItem>
                        Stations: {j.parts.map((p) => Stations[p.station].displayName).join(", ")}
                      </FlexItem>
                      <FlexItem>
                        <ExpandableSection toggleText="Route">
                          <JourneyRoute parts={j.parts} />
                        </ExpandableSection>
                      </FlexItem>
                    </Flex>
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
        {newJourneyCodePopup}
      </PageSection>
    </>
  );
}
