import {Button, Content, DatePicker, Popover, Wizard, WizardStep} from "@patternfly/react-core";
import {StationSearch} from "./StationSearch.tsx";
import {Lines, Stations} from "@tangledwires/uk-station-data";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";
import {useNavigate} from "react-router";
import {useMemo, useState} from "react";
import {Journey, JourneyPart} from "../utils/journey.ts";

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
        {journeyParts.map((p, idx) => (
          <div key={idx}>
            <Content>
              {idx > 0 && (
                <Popover
                  triggerAction="hover"
                  position="right"
                  bodyContent={Lines[p.line].displayName}
                >
                  <div style={{
                    marginLeft: "4px",
                    width: "6px",
                    height: "50px",
                    borderLeftStyle: "solid",
                    borderWidth: "6px",
                    borderColor: Lines[p.line].colour
                  }}></div>
                </Popover>
              )}
              <span style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                borderStyle: "solid",
                borderWidth: "3px",
                borderColor: "black",
                backgroundColor: "rgba(0, 0, 0, 0)"
              }}></span>
              <h2 style={{
                display: "inline"
              }}> {Stations[p.station].displayName} </h2>
              <Button onClick={() => setJourneyParts(journeyParts.filter((_, i) => i !== idx))} variant="plain" aria-label="Remove" icon={<TimesIcon />} />
            </Content>
          </div>
        ))}
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