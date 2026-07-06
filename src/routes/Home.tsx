import {PageHeader} from "../components/PageHeader.tsx";
import {
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  PageSection
} from "@patternfly/react-core";
import {ChartDonut, ChartLabel} from "@patternfly/react-charts/victory";
import {useVisitsPerLine} from "../hooks/useVisitsPerLine.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import {useVisitsPerStation} from "../hooks/useVisitsPerStation.ts";
import {useJourneysPerLine} from "../hooks/useJourneysPerLine.ts";
import {LineId, Lines, Stations, TOCs} from "@tangledwires/gb-station-data";
import {useVisitsPerToc} from "../hooks/useVisitsPerToc.ts";
import {TopVisitedList} from "../components/TopVisitedList.tsx";

export function Home() {
  const journeys = useJourneys();
  const visitsPerLine = useVisitsPerLine();
  const visitsPerStation = useVisitsPerStation();
  const journeysPerLine = useJourneysPerLine();
  const visitsPerToc = useVisitsPerToc();

  return (
    <>
      <PageHeader title="Home" />
      <PageSection>
        {!journeys.loading && journeys.data!.length > 0 ? (
          <>
            <Content component={ContentVariants.h4}>Total journeys: {journeys.data!.length}</Content>
            <Flex direction={{ default: 'column' }}>
              <Flex>
                {!journeysPerLine.loading && (
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
                      data={Object.entries(journeysPerLine.data!).map(([line, visits]) => {
                        return {
                          x: line,
                          y: visits
                        };
                      })}
                    />
                  </FlexItem>
                )}
                {!visitsPerLine.loading && (
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
                        data={Object.entries(visitsPerLine.data!).map(([line, visits]) => {
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
                        data={Object.entries(visitsPerLine.data!).map(([line, visits]) => {
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
                {!visitsPerStation.loading && (
                  <FlexItem style={{ maxHeight: '400px', width: '400px' }}>
                    <TopVisitedList
                      header="Top 10 most visited stations"
                      modalHeader="Most visited stations"
                      data={Object.fromEntries(Object.entries(visitsPerStation.data!).map(([station, data]) => [station, data.total]))}
                      getDisplayName={(key) => Stations[key as keyof typeof Stations].displayName}
                    />
                  </FlexItem>
                )}
                {!visitsPerLine.loading && (
                  <FlexItem style={{ maxHeight: '400px', width: '400px' }}>
                    <TopVisitedList
                      header="Top 10 most visited lines"
                      modalHeader="Most visited lines"
                      data={visitsPerLine.data!}
                      getDisplayName={(key) => Lines[key].displayName}
                      getColour={(key) => Lines[key].colour}
                    />
                  </FlexItem>
                )}
                {!visitsPerToc.loading && (
                  <FlexItem style={{ maxHeight: '400px', width: '400px' }}>
                    <TopVisitedList
                      header="Top 10 most visited TOCs"
                      modalHeader="Most visited TOCs"
                      data={visitsPerToc.data!}
                      getDisplayName={(key) => TOCs[key].displayName}
                      getColour={(key) => TOCs[key].colour}
                    />
                  </FlexItem>
                )}
              </Flex>
            </Flex>
          </>
        ) : (
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