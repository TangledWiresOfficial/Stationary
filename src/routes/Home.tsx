import {PageHeader} from "../components/PageHeader.tsx";
import {PageSection} from "@patternfly/react-core";
import {ChartDonut, ChartLabel} from "@patternfly/react-charts/victory";
import {VictoryStyleInterface} from "victory-core";
import {LineId, Lines} from "../utils/line.ts";
import {useVisitsPerLine} from "../hooks/useVisitsPerLine.ts";

const stationChartStyle: VictoryStyleInterface = {
  data: {
    fill: ({ datum }) => Lines[datum.x as LineId].colour,
  },
};

export function Home() {
  const visitsPerLine = useVisitsPerLine();

  return (
    <>
      <PageHeader title="Home" />
      <PageSection>
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
      </PageSection>
    </>
  );
}