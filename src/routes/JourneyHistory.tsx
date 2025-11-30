import {PageHeader} from "../components/PageHeader.tsx";
import {Card, CardBody, CardFooter, CardTitle, Icon, List, ListItem, PageSection} from "@patternfly/react-core";
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import {storage} from "../utils/storage.ts";
import {Stations} from "../utils/station.ts";
import {useEffect, useState} from "react";
import {Journey} from "../utils/journey.ts";

export function JourneyHistory() {
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    storage.getJourneys().then(setJourneys);
  }, []);

  return (
    <>
      <PageHeader title="Journey history" />
      <PageSection>
        <List isPlain>
          {journeys.map((j) => (
            <ListItem>
              <Card key={j.uuid}>
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
          ))}
        </List>
      </PageSection>
    </>
  );
}