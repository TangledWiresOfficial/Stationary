import {createBrowserRouter, RouterProvider} from "react-router";
import {Root} from "./Root.tsx";
import {HomePage} from "./routes/HomePage.tsx";
import {NewJourneyPage} from "./routes/NewJourneyPage.tsx";
import {DevPage} from "./routes/DevPage.tsx";
import {JourneyHistoryPage} from "./routes/JourneyHistoryPage.tsx";
import {EditJourneyPage} from "./routes/EditJourneyPage.tsx";
import {AboutPage} from "./routes/AboutPage.tsx";
import {StationListPage} from "./routes/StationListPage.tsx";
import {SettingsPage} from "./routes/SettingsPage.tsx";
import {CallbackPage} from "./routes/auth/CallbackPage.tsx";
import {AchievementsPage} from "./routes/AchievementsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/newjourney",
        element: <NewJourneyPage />,
      },
      {
        path: "/journeyhistory",
        element: <JourneyHistoryPage />,
      },
      {
        path: "/editjourney/:uuid",
        element: <EditJourneyPage />,
      },
      {
        path: "/stationlist",
        element: <StationListPage />,
      },
      {
        path: "/achievements",
        element: <AchievementsPage />,
      },

      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },

      {
        path: "/dev",
        element: <DevPage />,
      },

      {
        path: "/auth/callback",
        element: <CallbackPage />,
      },
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}