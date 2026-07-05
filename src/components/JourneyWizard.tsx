import {Content, DatePicker, Wizard, WizardStep} from "@patternfly/react-core";
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

  const isStepTwoValid = useMemo(() => {
    return journeyDate !== undefined;
  }, [journeyDate]);

  const saveJourney = async () => {
    const journey = new Journey(journeyDate!.getTime(), journeyParts);
    journey.uuid = initialJourney?.uuid;
    await journey.save();
    navigate("/journeyhistory");
  };

  return (
    <Wizard
      height="75vh"
      onClose={() => navigate("/journeyhistory")}
      onSave={saveJourney}
    >
      <WizardStep name="Add stations" id="add-stations" footer={{ isNextDisabled: !isStepOneValid }}>
        <StationSearch exclude={excludedStations} onUpdate={(selected) => setJourneyParts([...journeyParts, selected])} />
        <br />
        <JourneyRoute parts={journeyParts} onRemove={(idx) => setJourneyParts(journeyParts.filter((_, i) => i !== idx))} />
      </WizardStep>
      <WizardStep name="Date of journey" id="date-and-time" isDisabled={!isStepOneValid} footer={{ isNextDisabled: !isStepTwoValid }}>
        <Content>
          <h4>Date of journey</h4>
        </Content>
        <DatePicker
          value={journeyDate?.toISOString().split("T")[0]}
          appendTo={document.body}
          requiredDateOptions={{ isRequired: true }}
          onChange={(_event, _str, date) => setJourneyDate(date)}
        />
      </WizardStep>
    </Wizard>
  );
}