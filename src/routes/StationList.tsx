import {PageHeader} from "../components/PageHeader.tsx";
import {
  Content,
  Dropdown, DropdownItem,
  DropdownList,
  Icon,
  MenuToggle,
  MenuToggleElement,
  PageSection
} from "@patternfly/react-core";
import {CheckCircleIcon} from "@patternfly/react-icons";
import {useVisitsPerStation} from "../hooks/useVisitsPerStation.ts";
import {Lines, stationIds, Stations} from "@tangledwires/gb-station-data";
import React, {useMemo, useState} from "react";

type ListVisibility = "all" | "visited" | "notVisited";

export function StationList() {
  const visitsPerStation = useVisitsPerStation();

  const stationsVisited = useMemo(() => {
    // const stations = [];
    //
    // if (!visitsPerStation.loading) {
    //   for (const [station, data] of Object.entries(visitsPerStation.data!)) {
    //     if (data.total > 0) stations.push(station);
    //   }
    // }
    //
    // return stations;
    if (!visitsPerStation.loading) {
      return Object.fromEntries(Object.entries(visitsPerStation.data!).filter(([_station, data]) => data.total > 0));
    }
  }, [visitsPerStation]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [listVisibility, setListVisibility] = useState<ListVisibility>("all");

  const getListVisibilityText = (visibility: ListVisibility) => {
    switch (visibility) {
      case "all": return "Show all";
      case "visited": return "Show visited only";
      case "notVisited": return "Show not visited only";
    }
  }

  return (
    <>
      <PageHeader title="Station list" />
      <PageSection>
        {stationsVisited && (
          <>
            Stations visited: {Object.entries(stationsVisited).length}/{stationIds.length} ({((Object.entries(stationsVisited).length / stationIds.length) * 100).toFixed(2)}%)
          </>
        )}
      </PageSection>
      <PageSection>
        <Dropdown
          isOpen={isDropdownOpen}
          onSelect={() => setIsDropdownOpen(false)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)} isExpanded={isDropdownOpen}>
              {getListVisibilityText(listVisibility)}
            </MenuToggle>
          )}
          shouldFocusToggleOnSelect
        >
          <DropdownList>
            <DropdownItem isActive={listVisibility === "all"} onClick={() => setListVisibility("all")}>
              {getListVisibilityText("all")}
            </DropdownItem>
            <DropdownItem isActive={listVisibility === "visited"} onClick={() => setListVisibility("visited")}>
              {getListVisibilityText("visited")}
            </DropdownItem>
            <DropdownItem isActive={listVisibility === "notVisited"} onClick={() => setListVisibility("notVisited")}>
              {getListVisibilityText("notVisited")}
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      </PageSection>
      <PageSection>
        {stationsVisited && Object.entries(Stations)
          .filter(([key, _station]) => {
            switch (listVisibility) {
              case "all": return true;
              case "visited": return !!stationsVisited[key];
              case "notVisited": return !stationsVisited[key];
            }
          })
          .map(([key, station]) => (
            <div key={key}>
              <Content style={{ marginBottom: "4px" }}>
                <h2>
                  {station.displayName}
                  {" "}
                  {stationsVisited[key] && (
                    <Icon status="success" isInline>
                      <CheckCircleIcon />
                    </Icon>
                  )}
                </h2>
              </Content>
              <div style={{ paddingLeft: "8px" }}>
                {station.lines.map((line) => (
                  <div key={line} style={{ borderLeft: `4px solid ${Lines[line].colour}`, padding: "4px", marginBottom: "8px" }}>
                    <Content>
                      <h3>
                        {Lines[line].displayName}
                        {" "}
                        {stationsVisited[key] && stationsVisited[key].perLine[line] > 0 && (
                          <Icon status="success" isInline>
                            <CheckCircleIcon />
                          </Icon>
                        )}
                      </h3>
                    </Content>
                  </div>
                ))}
              </div>
            </div>
        ))}
      </PageSection>
    </>
  );
}