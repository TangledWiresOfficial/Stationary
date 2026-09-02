import {DatePicker, Form, FormGroup, TextArea, Wizard, WizardStep} from "@patternfly/react-core";
import {StationSearch} from "./StationSearch.tsx";
import {useNavigate} from "react-router";
import {useMemo, useState} from "react";
import {Journey, JourneyPart} from "../utils/journey.ts";
import {JourneyRoute} from "./JourneyRoute.tsx";

export function JourneyWizard({ initialJourney } : { initialJourney?: Journey }) {
  const navigate = useNavigate();

  const [journeyParts, setJourneyParts] = useState<JourneyPart[]>(initialJourney?.parts ?? []);
  const excludedStations = useMemo(() => {
    if (journeyParts.length > 0) {
      return [journeyParts[journeyParts.length - 1].station];
    }
    return [];
  }, [journeyParts]);

  const isStepOneValid = useMemo(() => {
    return journeyParts.length > 0;
  }, [journeyParts]);

  const [journeyDate, setJourneyDate] = useState<Date | undefined>(initialJourney && new Date(initialJourney.timestamp));
  const [journeyDescription, setJourneyDescription] = useState<string | undefined>(initialJourney?.description);

  const isStepTwoValid = useMemo(() => {
    return journeyDate !== undefined;
  }, [journeyDate]);

  const saveJourney = async () => {
    const journey = new Journey(journeyDate!.getTime(), journeyParts, journeyDescription);
    journey.uuid = initialJourney?.uuid;
    await journey.save();
    navigate("/journeyhistory");
  };

  return (
    <Wizard
      id="journey-wizard"
      height="75vh"
      onClose={() => navigate("/journeyhistory")}
      onSave={saveJourney}
    >
      <WizardStep name="Add stations" id="add-stations" footer={{ isNextDisabled: !isStepOneValid }}>
        <StationSearch exclude={excludedStations} onUpdate={(selected) => setJourneyParts([...journeyParts, selected])} />
        <br />
        <JourneyRoute parts={journeyParts} onRemove={(idx) => setJourneyParts(journeyParts.filter((_, i) => i !== idx))} />
      </WizardStep>
      <WizardStep name="Other details" id="other-details" isDisabled={!isStepOneValid} footer={{ isNextDisabled: !isStepTwoValid }}>
        <Form isWidthLimited>
          <FormGroup label="Description">
            <TextArea value={journeyDescription} onChange={(_event, value) => setJourneyDescription(value)} />
          </FormGroup>
          <FormGroup label="Date of journey" isRequired>
            <DatePicker
              value={journeyDate?.toISOString().split("T")[0]}
              appendTo={document.getElementById("journey-wizard")!}
              requiredDateOptions={{ isRequired: true }}

              /* We have to use `value` instead of `date` here and convert it to a `Date` ourselves because `date` can sometimes be a day ahead or behind when the timezone is not UTC */
              onChange={(_event, value, _date) => setJourneyDate(new Date(value))}
            />
          </FormGroup>
        </Form>
      </WizardStep>
    </Wizard>
  );
}