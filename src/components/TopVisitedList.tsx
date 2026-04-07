import {
  Divider,
  Flex,
  FlexItem,
  List,
  ListItem,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody
} from "@patternfly/react-core";
import React from "react";

export type TopVisitedListProps<K extends PropertyKey> = {
  readonly header: React.ReactNode;
  readonly data: Record<K, number>;
  readonly getDisplayName: (key: K) => string;
};

export function TopVisitedList<K extends PropertyKey>({ header, data, getDisplayName }: TopVisitedListProps<K>) {
  return (
    <Panel isScrollable variant="bordered">
      <PanelHeader>{header}</PanelHeader>
      <Divider />
      <PanelMain>
        <PanelMainBody>
          <List isPlain isBordered>
            {Object.entries(data)
              .filter(([_key, visits]) => visits as number > 0)
              .sort(([_keyA, visitsA], [_keyB, visitsB]) => visitsB as number - (visitsA as number))
              .slice(0, 10)
              .map(([key, visits]) => (
                <ListItem key={key}>
                  <Flex>
                    <FlexItem grow={{ default: 'grow' }}>
                      {getDisplayName(key as K)}
                    </FlexItem>
                    <FlexItem>
                      {visits as string}
                    </FlexItem>
                  </Flex>
                </ListItem>
              ))}
          </List>
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
}