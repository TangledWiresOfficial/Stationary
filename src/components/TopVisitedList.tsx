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

function TopVisitedListItem<K extends PropertyKey>({
  idx,
  itemKey,
  visits,
  getDisplayName,
  getColour
}: {
  idx: number,
  itemKey: string,
  visits: number,
  getDisplayName: TopVisitedListProps<K>["getDisplayName"],
  getColour: TopVisitedListProps<K>["getColour"]
}) {
  return (
    <ListItem key={itemKey}>
      <Flex>
        {getColour && (
          <FlexItem style={{ width: "6px", height: "100%" }}>
            <span style={{
              marginLeft: "4px",
              width: "6px",
              borderLeftStyle: "solid",
              borderWidth: "6px",
              borderColor: getColour(itemKey as K)
            }}></span>
          </FlexItem>
        )}
        <FlexItem grow={{ default: 'grow' }}>
          {idx + 1}. {getDisplayName(itemKey as K)}
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
            getDisplayName={getDisplayName}
            getColour={getColour}
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
            getDisplayName={getDisplayName}
            getColour={getColour}
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
