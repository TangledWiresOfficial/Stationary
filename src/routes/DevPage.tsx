import {PageHeader} from "../components/PageHeader.tsx";
import {Button, Content, ExpandableSection, PageSection} from "@patternfly/react-core";
import {Journey} from "../utils/journey.ts";
import {getStorage} from "../utils/storage.ts";
import {isTauri} from "@tauri-apps/api/core";
import {lineIds, Lines, stationIds, Stations, tocIds} from "@tangledwires/gb-station-data";
import {useLastUsedStationDataVersion} from "../hooks/useLastUsedStationDataVersion.ts";
import {dismissedWebKitWarning, isWebKit, wasLaunchedFromHomeScreen} from "../utils/webkit.ts";
import {Table, Tbody, Td, Tr} from "@patternfly/react-table";
import {VERSION} from "../version.ts";
import {getDevModeEnabled} from "../utils/devMode.ts";
import {getRedirectURI, SYNC_URL} from "../utils/sync.ts";
import {achievementIds, Achievements} from "../utils/achievements.tsx";

export function DevPage() {
  const storage = getStorage();

  const stationDataVersion = useLastUsedStationDataVersion();

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

  const grantAllAchievements = async () => {
    const existingAchievements = await storage.getObtainedAchievements();
    const newAchievements = Object.keys(Achievements)
      .filter((a) => !existingAchievements.some((ea) => ea.achievementId === a))
      .map((a) => ({ achievementId: a, obtainedAt: new Date() }));

    await storage.setObtainedAchievements([...existingAchievements, ...newAchievements]);
  };

  return (
    <>
      <PageHeader title="Dev tools" description="This page can cause damage to your Stationary data that cannot be undone. Be careful. You can hide this page by tapping the TangledWires logo in 'About Stationary'." />
      <PageSection>
        <Button onClick={async () => visitAllStations(1)} variant="primary">Visit all stations</Button>
        <Button onClick={async () => visitAllStations(100)} variant="primary">Visit all stations 100 times</Button>
        <Button onClick={async () => console.log(await storage.getJourneys())} variant="primary">Log journeys to console</Button>
        <Button onClick={async () => console.log(await storage.getUser())} variant="primary">Log user to console</Button>
        <Button onClick={storage.clearJourneys} variant="danger">Clear journeys</Button>
        <Button onClick={grantAllAchievements} variant="primary">Grant all achievements</Button>
      </PageSection>
      <PageSection>
        <Table variant="compact">
          <Tbody>
            <Tr><Td>Version</Td><Td>{VERSION}</Td></Tr>
            <Tr><Td>Number of lines</Td><Td>{lineIds.length}</Td></Tr>
            <Tr><Td>Number of stations</Td><Td>{stationIds.length}</Td></Tr>
            <Tr><Td>Number of TOCs</Td><Td>{tocIds.length}</Td></Tr>
            <Tr><Td>Number of Achievements</Td><Td>{achievementIds.length}</Td></Tr>
            <Tr><Td>Is Tauri</Td><Td>{isTauri().toString()}</Td></Tr>
            <Tr><Td>Storage backend</Td><Td>{storage.getBackendName()}</Td></Tr>
            <Tr><Td>Last used station data version</Td><Td>{stationDataVersion.data}</Td></Tr>
            <Tr><Td>Is WebKit</Td><Td>{isWebKit().toString()}</Td></Tr>
            <Tr><Td>Was launched from Home Screen</Td><Td>{wasLaunchedFromHomeScreen().toString()}</Td></Tr>
            <Tr><Td>Has dismissed WebKit warning</Td><Td>{dismissedWebKitWarning().toString()}</Td></Tr>
            <Tr><Td>Dev mode activated</Td><Td>{getDevModeEnabled().toString()}</Td></Tr>
            <Tr><Td>Sync URL</Td><Td>{SYNC_URL}</Td></Tr>
            <Tr><Td>Sync redirect URI</Td><Td>{getRedirectURI()}</Td></Tr>
          </Tbody>
        </Table>
      </PageSection>
      <PageSection>
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
