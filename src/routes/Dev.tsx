import PageHeader from "../components/PageHeader.tsx";
import {Button, PageSection} from "@patternfly/react-core";
import {storage} from "../utils/storage.ts";
import {Journey} from "../utils/journey.ts";

export default function Dev() {
  const addTestJourney = async () => {
    await new Journey(Date.now(), ["actonTown", "aldgate"]).save()
  };

  return (
    <>
      <PageHeader title={"Dev tools"} description="These buttons can cause damage to your Stationary data that cannot be undone. Be careful." />
      <PageSection>
        <Button onClick={addTestJourney} variant="primary">Add test journey</Button>
        <Button onClick={() => storage.clearJourneys()} variant="danger">Clear journeys</Button>
      </PageSection>
    </>
  );
}