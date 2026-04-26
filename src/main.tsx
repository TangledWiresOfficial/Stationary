import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import '@patternfly/patternfly/patternfly-charts.css';
import "@patternfly/react-core/dist/styles/base.css";
import "@saurl/tauri-plugin-safe-area-insets-css-api";
import "./App.css";

import {getCurrent} from "@tauri-apps/plugin-deep-link";

const startUrls = await getCurrent();
if (startUrls) {
  window.location.href = startUrls[0].replace(/stationary:\/$/, "")
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
