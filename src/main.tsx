import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {isTauri} from "@tauri-apps/api/core";
import {onOpenUrl} from "@tauri-apps/plugin-deep-link";
import {migrateAll} from "./utils/migrations";
import {warn, debug, info, error} from '@tauri-apps/plugin-log';
import {Log} from "oidc-client-ts";

import '@patternfly/patternfly/patternfly-charts.css';
import "@patternfly/react-core/dist/styles/base.css";
import "@saurl/tauri-plugin-safe-area-insets-css-api";
import "./App.css";

// oidc-client-ts logging
Log.setLogger(console);

// Tauri only

if (isTauri()) {
  // Handle stationary:// links

  await onOpenUrl((urls) => {
    window.location.href = urls[0].replace(/^stationary:\//, "");
  });

  // Log console messages

  function forwardConsole(
    fnName: "log" | "debug" | "info" | "warn" | "error",
    logger: (message: string) => Promise<void>
  ) {
    const original = console[fnName];
    console[fnName] = (message) => {
      original(message);
      logger(message);
    };
  }

  forwardConsole("log", info);
  forwardConsole("debug", debug);
  forwardConsole("info", info);
  forwardConsole("warn", warn);
  forwardConsole("error", error);

  window.addEventListener("error", (event) => {
    error(`[Runtime Error] ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
  });

  window.addEventListener("unhandledrejection", (event) => {
    error(`[Unhandled Promise Rejection] Reason: ${event.reason}`);
  });
}

// Migrations

await migrateAll();


// React

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
