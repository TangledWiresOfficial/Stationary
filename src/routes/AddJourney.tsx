import {Content, PageSection} from "@patternfly/react-core";
import {PageHeader} from "../components/PageHeader.tsx";
import {useMemo, useState} from "react";
import {StationId, Stations} from "../utils/station.ts";
import {StationSearch} from "../components/StationSearch.tsx";

export function AddJourney() {
  const [stationIds, setStationIds] = useState<StationId[]>();
  const stations = useMemo(() => {
    if (stationIds === undefined) return [];
    return stationIds.map((id) => Stations[id]);
  }, [stationIds])

  return (
    <>
      <PageHeader title="Add journey" />
      <PageSection>
        {stations.map((s) => (
          <div key={s.displayName}>
            <Content>
              {s.displayName}
            </Content>
          </div>
        ))}
        <StationSearch onUpdate={(selectedId) => console.log(selectedId)} />
      </PageSection>
    </>
  )
}