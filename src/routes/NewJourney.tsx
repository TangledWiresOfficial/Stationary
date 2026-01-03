import {
  Button,
  Content,
  DatePicker,
  PageSection,
  PageSectionTypes,
  Wizard,
  WizardStep
} from "@patternfly/react-core";
import {PageHeader} from "../components/PageHeader.tsx";
import {useMemo, useState} from "react";
import {StationSearch} from "../components/StationSearch.tsx";
import {Journey, JourneyPart} from "../utils/journey.ts";
import {Stations} from "../utils/station.ts";
import {Lines} from "../utils/line.ts";
import {useNavigate} from "react-router";
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

export function NewJourney() {
  const navigate = useNavigate();

  const [journeyParts, setJourneyParts] = useState<JourneyPart[]>([]);
  const excludedStations = useMemo(() => {
    if (journeyParts.length > 0) {
      return [journeyParts[journeyParts.length - 1].station];
    }
    return [];
  }, [journeyParts]);

  const isStepOneValid = useMemo(() => {
    return journeyParts.length > 0;
  }, [journeyParts]);

  const [journeyDate, setJourneyDate] = useState<Date>();

  const isStepTwoValid = useMemo(() => {
    return journeyDate !== undefined;
  }, [journeyDate]);

  const saveJourney = async () => {
    const journey = new Journey(journeyDate!.getTime(), journeyParts);
    await journey.save();
    navigate("/journeyhistory");
  };

  return (
    <>
      <PageHeader title="New journey" />
      <PageSection isFilled hasBodyWrapper={false} type={PageSectionTypes.wizard}>
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
                    <div style={{
                      marginLeft: "4px",
                      width: "25px",
                      height: "50px",
                      borderLeftStyle: "solid",
                      borderWidth: "6px",
                      borderColor: Lines[p.line].colour
                    }}></div>
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
            <DatePicker appendTo={document.body} requiredDateOptions={{ isRequired: true }} onChange={(_event, _str, date) => setJourneyDate(date)} />
          </WizardStep>
        </Wizard>
      </PageSection>
    </>
  )
}