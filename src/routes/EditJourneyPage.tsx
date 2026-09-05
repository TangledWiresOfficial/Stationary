import {PageHeader} from "../components/PageHeader.tsx";
import {useNavigate, useParams} from "react-router";
import {useJourneys} from "../hooks/useJourneys.ts";
import {JourneyWizard} from "../components/JourneyWizard.tsx";
import {Journey} from "../utils/journey.ts";

export function EditJourneyPage() {
  const navigate = useNavigate();
  const params = useParams();

  const { data: journeys, loading } = useJourneys();
  let journey: Journey | undefined;

  if (!loading) {
    journey = journeys!.find((j) => j.uuid === params.uuid);
    if (!journey) navigate("/journeyhistory")
  }

  return (
    <>
      <PageHeader title="Edit journey" />
      {!loading && (
        <JourneyWizard initialJourney={journey} />
      )}
    </>
  );
}