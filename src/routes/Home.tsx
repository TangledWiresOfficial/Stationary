import {PageHeader} from "../components/PageHeader.tsx";
import {
  Content,
  ContentVariants,
  Divider,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  List,
  ListItem,
  PageSection,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody
} from "@patternfly/react-core";
import {ChartDonut, ChartLabel} from "@patternfly/react-charts/victory";
import {LineId, Lines} from "../utils/line.ts";
import {useVisitsPerLine} from "../hooks/useVisitsPerLine.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import {useVisitsPerStation} from "../hooks/useVisitsPerStation.ts";
import {StationId, Stations} from "../utils/station.ts";
import {useJourneysPerLine} from "../hooks/useJourneysPerLine.ts";

export function Home() {
  const { journeys, loading } = useJourneys();
  const visitsPerLine = useVisitsPerLine();
  const visitsPerStation = useVisitsPerStation();
  const journeysPerLine = useJourneysPerLine();

  return (
    <>
      <PageHeader title="Home" />
      <PageSection>
        {journeys.length > 0 ? (
          <>
            <Content component={ContentVariants.h4}>Total journeys: {journeys.length}</Content>
            <Flex direction={{ default: 'column' }}>
              <Flex>
                {journeysPerLine && (
                  <FlexItem style={{ height: '150px', width: '150px' }}>
                    <ChartDonut
                      constrainToVisibleArea
                      style={{
                        data: {
                          fill: ({ datum }) => Lines[datum.x as LineId].colour,
                        },
                      }}
                      labels={({ datum }) => `${Lines[datum.x as LineId].displayName}: ${datum.y}`}
                      height={150}
                      width={150}
                      title={`Journeys\nper line`}
                      titleComponent={
                        <ChartLabel style={[{
                          fontSize: 16
                        }]} />
                      }
                      data={Object.entries(journeysPerLine).map(([line, visits]) => {
                        return {
                          x: line,
                          y: visits
                        };
                      })}
                    />
                  </FlexItem>
                )}
                {visitsPerLine && (
                  <>
                    <FlexItem style={{ height: '150px', width: '150px' }}>
                      <ChartDonut
                        constrainToVisibleArea
                        style={{
                          data: {
                            fill: ({ datum }) => Lines[datum.x as LineId].colour,
                          },
                        }}
                        labels={({ datum }) => `${Lines[datum.x as LineId].displayName}: ${datum.y}`}
                        height={150}
                        width={150}
                        title={`Station\nvisits\nper line`}
                        titleComponent={
                          <ChartLabel style={[{
                            fontSize: 16
                          }]} />
                        }
                        data={Object.entries(visitsPerLine).map(([line, visits]) => {
                          return {
                            x: line,
                            y: visits
                          };
                        })}
                      />
                    </FlexItem>
                    <FlexItem style={{ height: '150px', width: '150px' }}>
                      <ChartDonut
                        constrainToVisibleArea
                        style={{
                          data: {
                            fill: ({ datum }) => datum.visits > 0 ? Lines[datum.x as LineId].colour : "var(--pf-t--color--gray--20)",
                          },
                        }}
                        labels={({ datum }) => Lines[datum.x as LineId].displayName}
                        height={150}
                        width={150}
                        title={`Lines\nvisited`}
                        titleComponent={
                          <ChartLabel style={[{
                            fontSize: 16
                          }]} />
                        }
                        data={Object.entries(visitsPerLine).map(([line, visits]) => {
                          return {
                            x: line,
                            y: 1,
                            visits: visits
                          };
                        })}
                      />
                    </FlexItem>
                  </>
                )}
              </Flex>
              <Flex>
                <FlexItem style={{ height: '400px', width: '400px' }}>
                  <Panel isScrollable variant="bordered">
                    <PanelHeader>Top 10 most visited stations</PanelHeader>
                    <Divider />
                    <PanelMain>
                      <PanelMainBody>
                        <List isPlain isBordered>
                          {visitsPerStation && Object.entries(visitsPerStation)
                            .filter(([_station, visits]) => visits > 0)
                            .sort(([_stationA, visitsA], [_stationB, visitsB]) => visitsB - visitsA)
                            .slice(0, 10)
                            .map(([station, visits]) => (
                              <ListItem key={station}>
                                <Flex>
                                  <FlexItem grow={{ default: 'grow' }}>
                                    {Stations[station as StationId].displayName}
                                  </FlexItem>
                                  <FlexItem>
                                    {visits}
                                  </FlexItem>
                                </Flex>
                              </ListItem>
                            ))}
                        </List>
                      </PanelMainBody>
                    </PanelMain>
                  </Panel>
                </FlexItem>
              </Flex>
            </Flex>
          </>
        ) : !loading && (
          <EmptyState titleText="Welcome to Stationary" icon={CubesIcon}>
            <EmptyStateBody>
              You haven't added any journeys yet. Go to <BarsIcon /> then 'New journey' to begin.
            </EmptyStateBody>
          </EmptyState>
        )}
      </PageSection>
    </>
  );
}