import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import '@patternfly/patternfly/patternfly-charts.css';
import "@patternfly/react-core/dist/styles/base.css";
import "@saurl/tauri-plugin-safe-area-insets-css-api";
import "./App.css";

import {isTauri} from "@tauri-apps/api/core";
import {onOpenUrl} from "@tauri-apps/plugin-deep-link";
import {migrateAll} from "./utils/migrations";

if (isTauri()) {
  await onOpenUrl((urls) => {
    window.location.href = urls[0].replace(/^stationary:\//, "");
  });
}

await migrateAll();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
