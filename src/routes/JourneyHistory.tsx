import {PageHeader} from "../components/PageHeader.tsx";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
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
import {Stations} from "../utils/station.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import {useState} from "react";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";
import {getStorage} from "../utils/storage.ts";
import {Journey} from "../utils/journey.ts";

export function JourneyHistory() {
  const { journeys, loading, refresh } = useJourneys();
  const storage = getStorage();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Journey>();

  const deleteJourney = async () => {
    await storage.setJourneys(journeys.filter((j) => j.uuid !== toBeDeleted!.uuid));
    await refresh();
    setDeleteConfirmationOpen(false);
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

  return (
    <>
      <PageHeader title="Journey history" />
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
                      <Button onClick={() => {
                        setToBeDeleted(j);
                        setDeleteConfirmationOpen(true);
                      }} variant="plain" aria-label="Delete" icon={<TimesIcon />} />
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
                You haven't added any journeys yet. Go to <BarsIcon /> then 'Add journey' to begin.
              </EmptyStateBody>
            </EmptyState>
          )}
        </List>
        {deleteConfirmation}
      </PageSection>
    </>
  );
}