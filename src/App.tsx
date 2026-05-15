import {createBrowserRouter, RouterProvider} from "react-router";
import {Root} from "./Root.tsx";
import {Home} from "./routes/Home.tsx";
import {NewJourney} from "./routes/NewJourney.tsx";
import {Dev} from "./routes/Dev.tsx";
import {JourneyHistory} from "./routes/JourneyHistory.tsx";
import {EditJourney} from "./routes/EditJourney.tsx";
import {About} from "./routes/About.tsx";
import {StationList} from "./routes/StationList.tsx";
import {Settings} from "./routes/Settings.tsx";
import {Callback} from "./routes/auth/Callback.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/newjourney",
        element: <NewJourney />,
      },
      {
        path: "/journeyhistory",
        element: <JourneyHistory />,
      },
      {
        path: "/editjourney/:uuid",
        element: <EditJourney />,
      },
      {
        path: "/stationlist",
        element: <StationList />,
      },

      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/about",
        element: <About />,
      },

      {
        path: "/dev",
        element: <Dev />,
      },

      {
        path: "/auth/callback",
        element: <Callback />,
      },
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}