import {PageHeader} from "../components/PageHeader.tsx";
import {EmptyState, EmptyStateBody, PageSection} from "@patternfly/react-core";
import {ChartDonut, ChartLabel} from "@patternfly/react-charts/victory";
import {VictoryStyleInterface} from "victory-core";
import {LineId, Lines} from "../utils/line.ts";
import {useVisitsPerLine} from "../hooks/useVisitsPerLine.ts";
import {useJourneys} from "../hooks/useJourneys.ts";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';

const stationChartStyle: VictoryStyleInterface = {
  data: {
    fill: ({ datum }) => Lines[datum.x as LineId].colour,
  },
};

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
              <div style={{ height: '150px', width: '150px' }}>
                <ChartDonut
                  constrainToVisibleArea
                  style={stationChartStyle}
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
              </div>
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