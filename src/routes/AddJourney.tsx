import {Content, PageSection} from "@patternfly/react-core";
import {Lines} from "../utils/data.ts";

export default function AddJourney({}) {
  return (
    <>
      <PageSection>
        <Content>
          <h1>Add journey</h1>
        </Content>
      </PageSection>
      <PageSection>
        {Object.entries(Lines).map(([key, line]) => (
          <div key={key} style={{ borderLeft: `4px solid ${line.colour}`, padding: "8px", marginBottom: "8px" }}>
            <Content>
              <h2>{line.displayName}</h2>
            </Content>
          </div>
        ))}
      </PageSection>
    </>
  )
}