import {
  Alert,
  AlertActionCloseButton,
  Masthead,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavList,
  Page,
  PageBody,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton
} from "@patternfly/react-core";
import {Outlet} from "react-router";
import {useState} from "react";
import {NavLink} from "./components/NavLink.tsx";
import {
  dismissedWebKitWarning,
  isWebKit,
  setDismissedWebKitWarning,
  wasLaunchedFromHomeScreen
} from "./utils/webkit.ts";
import {getDevModeEnabled} from "./utils/devMode.ts";

export function Root() {
  const webkitWarningBanner = (
    <p>
      A feature in iOS means that if you don't use Stationary for 7 days, your journeys will be deleted.
      You can avoid this by following <a href="https://support.apple.com/en-gb/guide/iphone/iphea86e5236/26/ios/26" target="_blank">this guide from Apple</a> and opening Stationary from your home screen instead.
    </p>
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            isHamburgerButton
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={onSidebarToggle}
          />
        </MastheadToggle>
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav style={{ height: "100%" }} onSelect={() => setIsSidebarOpen(false)}>
          <NavList style={{ gridTemplateRows: "1fr auto" }}>
            <div>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/newjourney">New journey</NavLink>
              <NavLink to="/journeyhistory">Journey history</NavLink>
            </div>

            {/* Footer */}
            <div>
              <NavLink to="/about">About Stationary</NavLink>

              {getDevModeEnabled() && (
                <NavLink to="/dev">Dev tools</NavLink>
              )}
            </div>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page
      masthead={masthead}
      sidebar={sidebar}
      isContentFilled
    >
      {isWebKit() && !wasLaunchedFromHomeScreen() && !dismissedWebKitWarning() && (
        <Alert
          variant="warning"
          title={webkitWarningBanner}
          actionClose={(
            <AlertActionCloseButton onClose={() => setDismissedWebKitWarning(true)} />
          )}
        />
      )}
      <PageBody>
        <Outlet />
      </PageBody>
    </Page>
  );
}