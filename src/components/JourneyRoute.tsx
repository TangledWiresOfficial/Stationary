import {Button, Content, Popover} from "@patternfly/react-core";
import {Lines, Stations} from "@tangledwires/gb-station-data";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";
import {JourneyPart} from "../utils/journey.ts";

export function JourneyRoute({ parts, onRemove }: { parts: JourneyPart[], onRemove?: (removedIdx: number) => void }) {
  return (
    <div>
      {parts.map((p, idx) => (
        <div key={idx}>
          <Content>
            {idx > 0 && (
              <Popover
                triggerAction="hover"
                position="right"
                bodyContent={Lines[p.line].displayName}
              >
                <div style={{
                  marginLeft: "4px",
                  width: "6px",
                  height: "50px",
                  borderLeftStyle: "solid",
                  borderWidth: "6px",
                  borderColor: Lines[p.line].colour
                }}></div>
              </Popover>
            )}
            <span style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              borderStyle: "solid",
              borderWidth: "3px",
              borderColor: "black",
              backgroundColor: "rgba(0, 0, 0, 0)"
            }}></span>
            <h2 style={{
              display: "inline"
            }}> {Stations[p.station].displayName} </h2>
            {onRemove && <Button onClick={() => onRemove(idx)} variant="plain" aria-label="Remove" icon={<TimesIcon />} />}
          </Content>
        </div>
      ))}
    </div>
  );
}