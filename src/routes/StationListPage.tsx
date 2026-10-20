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
import {CheckCircleIcon, MinusCircleIcon} from "@patternfly/react-icons";
import {useVisitsPerStation} from "../hooks/useVisitsPerStation.ts";
import {Lines, StationId, stationIds, Stations} from "@tangledwires/gb-station-data";
import React, {useMemo, useState} from "react";
import {stationIsVisible} from "../utils/categories.ts";
import {useVisibleCategories} from "../hooks/useVisibleCategories.ts";

type ListVisibility = "all" | "visited" | "notVisited";

export function StationListPage() {
  const visitsPerStation = useVisitsPerStation();
  const visibleCategories = useVisibleCategories();

  const stationsVisited = useMemo(() => {
    if (!visitsPerStation.loading) {
      return Object.fromEntries(
        Object.entries(visitsPerStation.data!)
          .filter(([_station, data]) => data.total > 0)
          .filter(([stationId, _data]) => stationIsVisible(stationId as StationId, visibleCategories.data!))
      );
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

  const visibleStationsIds = useMemo(() => {
    if (!visibleCategories.loading) {
      return stationIds.filter((stationId) => stationIsVisible(stationId, visibleCategories.data!));
    }
  }, [stationIds, visibleCategories.data]);

  return (
    <>
      <PageHeader title="Station list" />
      <PageSection>
        {stationsVisited && visibleStationsIds && (
          <>
            Stations visited: {Object.entries(stationsVisited).length}/{visibleStationsIds.length} ({((Object.entries(stationsVisited).length / visibleStationsIds.length) * 100).toFixed(2)}%)
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
        {stationsVisited && !visibleCategories.loading && Object.entries(Stations)
          .filter(([key, _station]) => stationIsVisible(key as StationId, visibleCategories.data!))
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
                  {station.lines.every((v) => stationsVisited[key]?.perLine[v] > 0) ? (
                    <Icon status="success" isInline>
                      <CheckCircleIcon />
                    </Icon>
                  ) : stationsVisited[key]?.total > 0 && (
                    <Icon status="warning" isInline>
                      <MinusCircleIcon />
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