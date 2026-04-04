import {PageHeader} from "../components/PageHeader.tsx";
import {PageSection} from "@patternfly/react-core";
import {VERSION} from "../version.ts";
import {getDevModeEnabled, setDevModeEnabled} from "../utils/devMode.ts";

export function About() {
  return (
    <>
      <PageHeader title="About Stationary" />
      <PageSection>
        <p>Stationary is an app for tracking which UK train stations you've visited.</p>
        <p>You are currently running version {VERSION} on {navigator.platform}.</p>
        <br />
        <p>Stationary is open source software. You can find the code at <a target="_blank" href="https://github.com/TangledWiresOfficial/Stationary">https://github.com/TangledWiresOfficial/Stationary</a></p>
        <p>Found a bug? Report it at <a target="_blank" href="https://github.com/TangledWiresOfficial/Stationary/issues">https://github.com/TangledWiresOfficial/Stationary/issues</a></p>
        <p>Missing stations/lines should be reported at <a target="_blank" href="https://github.com/TangledWiresOfficial/uk-station-data/issues">https://github.com/TangledWiresOfficial/uk-station-data/issues</a></p>
        <br />
        <p>&copy; 2026 TangledWires Ltd</p>
        <br />
        <img onClick={() => setDevModeEnabled(!getDevModeEnabled())} width="250px" src="tangledwires.png" alt="The word 'TangledWires' next to a computer terminal." />
      </PageSection>
    </>
  );
}