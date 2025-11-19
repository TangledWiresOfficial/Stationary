import {NavItem, NavItemProps} from "@patternfly/react-core";
import React from "react";
import {Link} from "react-router";

type NavLinkProps = {
  readonly to: string
  readonly isActive?: boolean
  readonly children: React.ReactNode
} & Omit<NavItemProps, "component">;

type LinkComponentProps = {
  href: string
  children: React.ReactNode
};

const LinkComponent = React.forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ href, children, ...props }, ref) => (
    <Link ref={ref} to={href} {...props}>
      {children}
    </Link>
  )
);

export default function NavLink({ isActive, to, children, ...rest }: NavLinkProps) {
  return (
    <NavItem
      isActive={isActive}
      component={LinkComponent}
      {...rest}
      to={to}
    >
      {children}
    </NavItem>
  );
}