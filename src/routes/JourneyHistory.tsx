import {PageHeader} from "../components/PageHeader.tsx";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Icon,
  List,
  ListItem,
  PageSection
} from "@patternfly/react-core";
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import {Stations} from "../utils/station.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";

export function JourneyHistory() {
  const { journeys, loading } = useJourneys();

  return (
    <>
      <PageHeader title="Journey history" />
      <PageSection>
        <List isPlain>
          {journeys.length > 0 ? journeys.map((j) => (
            <ListItem key={j.uuid}>
              <Card>
                <CardTitle>
                  {Stations[j.parts[0].station].displayName} <Icon><AngleRightIcon /></Icon> {Stations[j.parts[j.parts.length - 1].station].displayName}
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
      </PageSection>
    </>
  );
}