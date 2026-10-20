import {CategoryId, LineId, Lines, StationId, Stations, TOCId} from "@tangledwires/gb-station-data";

/**
 * Check if a station is visible based on the visible categories.
 *
 * @param station The station to check
 * @param visibleCategories Which categories are visible
 */
export function stationIsVisible(station: StationId, visibleCategories: CategoryId[]) {
  for (const lineId of Stations[station].lines) {
    if (visibleCategories.includes(Lines[lineId].category)) return true;
  }
  return false;
}

/**
 * Check if a line is visible based on the visible categories.
 *
 * @param line The line to check
 * @param visibleCategories Which categories are visible
 */
export function lineIsVisible(line: LineId, visibleCategories: CategoryId[]) {
  return visibleCategories.includes(Lines[line].category);
}

/**
 * Check if a TOC is visible based on the visible categories.
 *
 * @param toc The TOC to check
 * @param visibleCategories Which categories are visible
 */
export function tocIsVisible(toc: TOCId, visibleCategories: CategoryId[]) {
  for (const [lineId, line] of Object.entries(Lines)) {
    // If the line is operated by the TOC and the line is visible, the TOC should also be visible
    if (line.tocs.includes(toc as TOCId) && lineIsVisible(lineId as LineId, visibleCategories)) return true;
  }
  return false;
}