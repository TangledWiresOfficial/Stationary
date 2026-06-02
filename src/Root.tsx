import {
  Alert,
  AlertActionCloseButton, Avatar, Dropdown, DropdownItem, DropdownList,
  Masthead, MastheadContent,
  MastheadMain,
  MastheadToggle, MenuToggle, MenuToggleElement,
  Nav,
  NavList,
  Page,
  PageBody,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem
} from "@patternfly/react-core";
import avatarImg from '@patternfly/react-core/src/components/assets/avatarImg.svg';
import {Outlet} from "react-router";
import React, {useState} from "react";
import {NavLink} from "./components/NavLink.tsx";
import {
  dismissedWebKitWarning,
  isWebKit,
  setDismissedWebKitWarning,
  wasLaunchedFromHomeScreen
} from "./utils/webkit.ts";
import {getDevModeEnabled} from "./utils/devMode.ts";
import {useUser} from "./hooks/useUser.ts";
import {getStorage} from "./utils/storage.ts";
import {login} from "./utils/sync.ts";

export function Root() {
  const user = useUser();

  const webkitWarningBanner = (
    <p>
      A feature in iOS means that if you don't use Stationary for 7 days, your journeys will be deleted.
      You can avoid this by following <a href="https://support.apple.com/en-gb/guide/iphone/iphea86e5236/26/ios/26" target="_blank">this guide from Apple</a> and opening Stationary from your home screen instead.
    </p>
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = async () => {
    await getStorage().setUser(undefined);
    await user.refresh();
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
      <MastheadContent>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup className="pf-m-align-end pf-m-spacer-none pf-m-spacer-md-on-md pf-m-action-group-plain">
              <ToolbarItem>
                <Dropdown
                  isOpen={isUserDropdownOpen}
                  onSelect={() => setIsUserDropdownOpen(false)}
                  onOpenChange={setIsUserDropdownOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      isExpanded={isUserDropdownOpen}
                      icon={<Avatar src={avatarImg} size="sm" alt="Avatar" />}
                      aria-label="User"
                    >
                      {!user.loading && user.data && user.data.profile.name}
                    </MenuToggle>
                  )}
                  shouldFocusToggleOnSelect
                >
                  <DropdownList>
                    {!user.loading && user.data ? (
                      <DropdownItem onClick={logout}>
                        Logout
                      </DropdownItem>
                    ) : (
                      <DropdownItem onClick={login}>
                        Login
                      </DropdownItem>
                    )}
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
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
              <NavLink to="/stationlist">Station list</NavLink>
            </div>

            {/* Footer */}
            <div>
              <NavLink to="/settings">Settings</NavLink>
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
      // Temporary workaround for https://github.com/patternfly/patternfly-react/issues/12439
      onPageResize={() => {}}

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