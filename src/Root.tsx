import {
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

export function Root() {
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
        <Nav onSelect={() => setIsSidebarOpen(false)}>
          <NavList>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/newjourney">New journey</NavLink>
            <NavLink to="/journeyhistory">Journey history</NavLink>

            {import.meta.env.DEV && (
              <NavLink to="/dev">Dev tools</NavLink>
            )}
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
      <PageBody>
        <Outlet />
      </PageBody>
    </Page>
  );
}