import PageHeader from "../components/PageHeader.tsx";
import {Card, CardBody, CardFooter, CardTitle, Icon, PageSection} from "@patternfly/react-core";
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import {storage} from "../utils/storage.ts";
import {Stations} from "../utils/station.ts";

export default async function JourneyHistory() {
  return (
    <>
      <PageHeader title="Journey history" />
      <PageSection>
        {(await storage.getJourneys()).map((j) => (
          <Card key={j.uuid}>
            <CardTitle>
              {Stations[j.stations[0]].displayName} <Icon><AngleRightIcon /></Icon> {Stations[j.stations[j.stations.length - 1]].displayName}
            </CardTitle>
            <CardBody>
              Stations: {j.stations.map((s) => Stations[s].displayName).join(", ")}
            </CardBody>
            <CardFooter>
              {new Date(j.timestamp).toLocaleDateString("en-GB")}
            </CardFooter>
          </Card>
        ))}
      </PageSection>
    </>
  );
}