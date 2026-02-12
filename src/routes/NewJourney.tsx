import {
  PageSection,
  PageSectionTypes
} from "@patternfly/react-core";
import {PageHeader} from "../components/PageHeader.tsx";
import {JourneyWizard} from "../components/JourneyWizard.tsx";

export function NewJourney() {
  return (
    <>
      <PageHeader title="New journey" />
      <PageSection isFilled hasBodyWrapper={false} type={PageSectionTypes.wizard}>
        <JourneyWizard />
      </PageSection>
    </>
  )
}
