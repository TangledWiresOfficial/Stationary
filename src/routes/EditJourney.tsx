import {PageHeader} from "../components/PageHeader.tsx";
import {useParams} from "react-router";
import {useJourneys} from "../hooks/useJourneys.ts";
import {JourneyWizard} from "../components/JourneyWizard.tsx";

export function EditJourney() {
  const params = useParams();

  const { journeys, loading } = useJourneys();

  return (
    <>
      <PageHeader title="Edit journey" />
      {!loading && (
        <JourneyWizard initialJourney={journeys.find((j) => j.uuid === params.uuid)} />
      )}
    </>
  );
}