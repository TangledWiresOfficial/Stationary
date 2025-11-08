import {
  Masthead,
  MastheadMain, MastheadToggle,
  Nav,
  NavList,
  Page,
  PageBody,
  PageSidebar,
  PageSidebarBody, PageToggleButton
} from "@patternfly/react-core";
import {NavLink, Outlet} from "react-router";
import {useState} from "react";

export default function Root() {
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
        <Nav>
          <NavList>
            <NavLink to="/">Home</NavLink>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page
      masthead={masthead}
      sidebar={sidebar}
    >
      <PageBody>
        <Outlet />
      </PageBody>
    </Page>
  );
}