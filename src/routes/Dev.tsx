import {PageHeader} from "../components/PageHeader.tsx";
import {Button, Content, ExpandableSection, PageSection} from "@patternfly/react-core";
import {Journey} from "../utils/journey.ts";
import {stationIds, Stations} from "../utils/station.ts";
import {lineIds, Lines} from "../utils/line.ts";
import {getStorage} from "../utils/storage.ts";

export function Dev() {
  const storage = getStorage();

  const visitAllStations = async (times: number) => {
    for (let i = 0; i < times; i++) {
      await new Journey(Date.now(), stationIds
        .flatMap((stationId) => Stations[stationId].lines.map((lineId) => {
          return {
            station: stationId,
            line: lineId,
          };
        })))
        .save();
    }
  };

  return (
    <>
      <PageHeader title="Dev tools" description="This page can cause damage to your Stationary data that cannot be undone. Be careful." />
      <PageSection>
        <Button onClick={async () => visitAllStations(1)} variant="primary">Visit all stations</Button>
        <Button onClick={async () => visitAllStations(100)} variant="primary">Visit all stations 100 times</Button>
        <Button onClick={async () => console.log(await storage.getJourneys())} variant="primary">Log journeys to console</Button>
        <Button onClick={async () => await storage.clearJourneys()} variant="danger">Clear journeys</Button>
      </PageSection>
      <PageSection>
        <Content>
          <p>Number of lines: {lineIds.length}</p>
          <p>Number of stations: {stationIds.length}</p>
        </Content>
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