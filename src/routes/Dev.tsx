import {PageHeader} from "../components/PageHeader.tsx";
import {Button, Content, ExpandableSection, PageSection} from "@patternfly/react-core";
import {storage} from "../utils/storage.ts";
import {Journey} from "../utils/journey.ts";
import {Stations} from "../utils/station.ts";
import {Lines} from "../utils/line.ts";

export function Dev() {
  const addTestJourney = async () => {
    await new Journey(Date.now(), [
      {
        station: "paddington",
        line: "circle"
      },
      {
        station: "bakerStreet",
        line: "circle",
      },
      {
        station: "stratford",
        line: "jubilee"
      }
    ]).save()
  };

  return (
    <>
      <PageHeader title="Dev tools" description="This page can cause damage to your Stationary data that cannot be undone. Be careful." />
      <PageSection>
        <Button onClick={addTestJourney} variant="primary">Add test journey</Button>
        <Button onClick={async () => console.log(await storage.getJourneys())} variant="primary">Log journeys to console</Button>
        <Button onClick={async () => await storage.clearJourneys()} variant="danger">Clear journeys</Button>
        <ExpandableSection toggleText="Station list">
          {Object.entries(Stations).map(([key, station]) => (
            <div key={key}>
              <Content style={{ marginBottom: "4px" }}>
                <h2>{station.displayName}</h2>
              </Content>
              <div style={{ paddingLeft: "8px" }}>
                {station.lines.map((line) => (
                  <div key={line} style={{ borderLeft: `4px solid ${Lines[line].colour}`, padding: "4px", marginBottom: "8px" }}>
                    <Content>
                      <h3>{Lines[line].displayName}</h3>
                    </Content>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ExpandableSection>
      </PageSection>
    </>
  );
}