import {PageHeader} from "./components/PageHeader.tsx";
import {isRouteErrorResponse, useRouteError} from "react-router";
import {Button, ExpandableSection, Page, PageSection} from "@patternfly/react-core";

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Page>
      <PageHeader title={`An error occurred on "${window.location.pathname}"`} />
      <PageSection>
        {isRouteErrorResponse(error) ? (
          <>
            <h1>{error.status} {error.statusText}</h1>
            <p>{error.data}</p>
          </>
        ) : error instanceof Error ? (
          <>
            <p>{error.message}</p>
            <ExpandableSection toggleText="Stack trace">
              <pre>{error.stack}</pre>
            </ExpandableSection>
          </>
        ) : (
          <p>An unknown error occurred.</p>
        )}
      </PageSection>
      <PageSection>
        <Button onClick={() => window.history.back()}>Go back</Button>
      </PageSection>
    </Page>
  );
}