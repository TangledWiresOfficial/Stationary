import {PageHeader} from "../components/PageHeader.tsx";
import {EmptyState, EmptyStateBody, Flex, FlexItem, PageSection} from "@patternfly/react-core";
import {ChartDonut, ChartLabel} from "@patternfly/react-charts/victory";
import {LineId, Lines} from "../utils/line.ts";
import {useVisitsPerLine} from "../hooks/useVisitsPerLine.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';

export function Home() {
  const { journeys, loading } = useJourneys();
  const visitsPerLine = useVisitsPerLine();

  return (
    <>
      <PageHeader title="Home" />
      <PageSection>
        {journeys.length > 0 ? (
          <>
            {visitsPerLine && (
              <Flex>
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
              </Flex>
            )}
          </>
        ) : !loading && (
          <EmptyState titleText="Welcome to Stationary" icon={CubesIcon}>
            <EmptyStateBody>
              You haven't added any journeys yet. Go to <BarsIcon /> then 'Add journey' to begin.
            </EmptyStateBody>
          </EmptyState>
        )}
      </PageSection>
    </>
  );
}