import {Content, Flex, FlexItem, PageSection} from "@patternfly/react-core";
import React from "react";

export function PageHeader({ title, description, children }: { title: string, description?: string, children?: React.ReactNode }) {
  return (
    <PageSection>
      <Flex>
        <FlexItem>
          <Content>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </Content>
        </FlexItem>
        <FlexItem align={{ default: "alignRight" }}>
          {children}
        </FlexItem>
      </Flex>
    </PageSection>
  )
}