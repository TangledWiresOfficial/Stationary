import {Content, PageSection} from "@patternfly/react-core";
import {Lines, Stations} from "../utils/data.ts";

export default function AddJourney({}) {
  return (
    <>
      <PageSection>
        <Content>
          <h1>Add journey</h1>
        </Content>
      </PageSection>
      <PageSection>
        {Object.entries(Stations).map(([key, station]) => (
          <div key={key}>
            <Content style={{ marginBottom: "4px" }}>
              <h2>{station.displayName}</h2>
            </Content>
            <div style={{ paddingLeft: "8px" }}>
              {station.lines.map((line) => (
                <div key={line} style={{ borderLeft: `4px solid ${Lines[line].colour}`, padding: "4px", marginBottom: "8px" }}>
                  <Content>
                    <h3>{Lines[line].displayName}</h3>
                  </Content>
                </div>
              ))}
            </div>
          </div>
        ))}
      </PageSection>
    </>
  )
}