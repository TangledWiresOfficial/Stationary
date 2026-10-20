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
import {LineId, Lines, StationId, TOCId, TOCs} from "@tangledwires/gb-station-data";
import {useVisitsPerToc} from "../hooks/useVisitsPerToc.ts";
import {TopVisitedList} from "../components/TopVisitedList.tsx";
import {getStation} from "../utils/station.ts";
import {useVisibleCategories} from "../hooks/useVisibleCategories.ts";
import {lineIsVisible, stationIsVisible, tocIsVisible} from "../utils/categories.ts";

export function HomePage() {
  const journeys = useJourneys();
  const visitsPerLine = useVisitsPerLine();
  const visitsPerStation = useVisitsPerStation();
  const journeysPerLine = useJourneysPerLine();
  const visitsPerToc = useVisitsPerToc();
  const visibleCategories = useVisibleCategories();

  return (
    <>
      <PageHeader title="Home" />
      <PageSection>
        {!visibleCategories.loading && !journeys.loading && journeys.data!.length > 0 ? (
          <>
            <Content component={ContentVariants.h4}>Total journeys: {journeys.data!.length}</Content>
            <Flex direction={{ default: 'column' }}>
              <Flex>
                {!journeysPerLine.loading && (
                  <HomePageChartDonut
                    title={"Journeys\nper line"}
                    data={Object.entries(journeysPerLine.data!)
                      .filter(([line, _visits]) => lineIsVisible(line as LineId, visibleCategories.data!))
                      .map(([line, visits]) => {
                        return {
                          x: line,
                          y: visits
                        };
                      })
                    }
                    getLabel={(datum) => `${Lines[datum.x as LineId].displayName}: ${datum.y}`}
                    getColour={(datum) => Lines[datum.x as LineId].colour}
                  />
                )}
                {!visitsPerLine.loading && (
                  <>
                    <HomePageChartDonut
                      title={"Station\nvisits\nper line"}
                      data={Object.entries(visitsPerLine.data!)
                        .filter(([line, _visits]) => lineIsVisible(line as LineId, visibleCategories.data!))
                        .map(([line, visits]) => {
                          return {
                            x: line,
                            y: visits
                          };
                        })
                      }
                      getLabel={(datum) => `${Lines[datum.x as LineId].displayName}: ${datum.y}`}
                      getColour={(datum) => Lines[datum.x as LineId].colour}
                    />
                    <HomePageChartDonut
                      title={"Lines\nvisited"}
                      data={Object.entries(visitsPerLine.data!)
                        .filter(([line, _visits]) => lineIsVisible(line as LineId, visibleCategories.data!))
                        .map(([line, visits]) => {
                          return {
                            x: line,
                            y: 1,
                            visits: visits
                          };
                        })
                      }
                      getLabel={(datum) => Lines[datum.x as LineId].displayName}
                      getColour={(datum) => datum.visits > 0 ? Lines[datum.x as LineId].colour : "var(--pf-t--color--gray--20)"}
                    />
                  </>
                )}
                {!visitsPerToc.loading && (
                  <HomePageChartDonut
                    title={"TOCs\nvisited"}
                    data={Object.entries(visitsPerToc.data!)
                      .filter(([toc, _visits]) => tocIsVisible(toc as TOCId, visibleCategories.data!))
                      .map(([toc, visits]) => {
                        return {
                          x: toc,
                          y: 1,
                          visits: visits
                        };
                      })
                    }
                    getLabel={(datum) => TOCs[datum.x as TOCId].displayName}
                    getColour={(datum) => datum.visits > 0 ? TOCs[datum.x as TOCId].colour : "var(--pf-t--color--gray--20)"}
                  />
                )}
              </Flex>
              <Flex>
                {!visitsPerStation.loading && (
                  <TopVisitedList
                    header="Top 10 most visited stations"
                    modalHeader="Most visited stations"
                    data={
                      Object.fromEntries(
                        Object.entries(visitsPerStation.data!)
                          .filter(([station, _data]) => stationIsVisible(station as StationId, visibleCategories.data!))
                          .map(([station, data]) => [station, data.total])
                      )
                    }
                    getDisplayName={(key) => getStation(key as StationId).displayName}
                  />
                )}
                {!visitsPerLine.loading && (
                  <TopVisitedList
                    header="Top 10 most visited lines"
                    modalHeader="Most visited lines"
                    data={Object.fromEntries(Object.entries(visitsPerLine.data!).filter(([line, _data]) => lineIsVisible(line as LineId, visibleCategories.data!)))}
                    getDisplayName={(key) => Lines[key as LineId].displayName}
                    getColour={(key) => Lines[key as LineId].colour}
                  />
                )}
                {!visitsPerToc.loading && (
                  <TopVisitedList
                    header="Top 10 most visited TOCs"
                    modalHeader="Most visited TOCs"
                    data={Object.fromEntries(Object.entries(visitsPerToc.data!).filter(([toc, _data]) => tocIsVisible(toc as TOCId, visibleCategories.data!)))}
                    getDisplayName={(key) => TOCs[key as TOCId].displayName}
                    getColour={(key) => TOCs[key as TOCId].colour}
                  />
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

function HomePageChartDonut({
  title,
  data,
  getLabel,
  getColour,
}: {
  readonly title: string,
  readonly data: any[],
  readonly getLabel: (datum: any) => string,
  readonly getColour: (datum: any) => string,
}) {
  return (
    <FlexItem style={{ height: "150px", width: "150px" }}>
      <ChartDonut
        constrainToVisibleArea
        style={{
          data: {
            fill: ({ datum }) => getColour(datum),
          },
        }}
        labels={({ datum }) => getLabel(datum)}
        height={150}
        width={150}
        title={title}
        titleComponent={
          <ChartLabel style={[{
            fontSize: 16
          }]} />
        }
        data={data}
      />
    </FlexItem>
  );
}