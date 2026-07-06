import {
  Button,
  Divider,
  Flex,
  FlexItem,
  List,
  ListItem, Modal, ModalBody, ModalFooter, ModalHeader,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody
} from "@patternfly/react-core";
import React, {useState} from "react";

export type TopVisitedListProps<K extends PropertyKey> = {
  readonly header: React.ReactNode;
  readonly modalHeader: React.ReactNode;
  readonly data: Record<K, number>;
  readonly getDisplayName: (key: K) => string;
  readonly getColour?: (key: K) => string;
};

function TopVisitedListItem({
  idx,
  itemKey,
  visits,
  displayName,
  colour
}: {
  idx: number,
  itemKey: string,
  visits: number,
  displayName: string,
  colour?: string
}) {
  return (
    <ListItem key={itemKey}>
      <Flex>
        {colour && (
          <FlexItem style={{ width: "6px", height: "100%" }}>
            <span style={{
              marginLeft: "4px",
              width: "6px",
              borderLeftStyle: "solid",
              borderWidth: "6px",
              borderColor: colour
            }}></span>
          </FlexItem>
        )}
        <FlexItem grow={{ default: 'grow' }}>
          {idx + 1}. {displayName}
        </FlexItem>
        <FlexItem>
          {visits.toString()}
        </FlexItem>
      </Flex>
    </ListItem>
  );
}

export function TopVisitedList<K extends PropertyKey>({ header, modalHeader, data, getDisplayName, getColour }: TopVisitedListProps<K>) {
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = Object.entries(data)
    .filter(([_key, visits]) => visits as number > 0)
    .sort(([_keyA, visitsA], [_keyB, visitsB]) => visitsB as number - (visitsA as number));

  const unslicedList = (
    <List isPlain isBordered>
      {sorted
        .map(([key, visits], idx) => (
          <TopVisitedListItem
            idx={idx}
            itemKey={key}
            visits={visits as number}
            displayName={getDisplayName(key as K)}
            colour={getColour?.(key as K)}
          />
        ))}
    </List>
  );

  const slicedList = (
    <List isPlain isBordered>
      {sorted
        .slice(0, 10)
        .map(([key, visits], idx) => (
          <TopVisitedListItem
            idx={idx}
            itemKey={key}
            visits={visits as number}
            displayName={getDisplayName(key as K)}
            colour={getColour?.(key as K)}
          />
        ))}
    </List>
  );

  const modal = (
    <Modal isOpen={modalOpen} variant="small">
      <ModalHeader title={modalHeader} />
      <ModalBody>
        {unslicedList}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <>
      <Panel isScrollable variant="bordered">
        <PanelHeader>
          <Flex>
            <FlexItem grow={{ default: "grow" }}>
              {header}
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" onClick={() => setModalOpen(true)}>Show all</Button>
            </FlexItem>
          </Flex>
        </PanelHeader>
        <Divider />
        <PanelMain>
          <PanelMainBody>
            {slicedList}
          </PanelMainBody>
        </PanelMain>
      </Panel>
      {modal}
    </>
  );
}
