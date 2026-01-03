import {createBrowserRouter, RouterProvider} from "react-router";
import {Root} from "./Root.tsx";
import {Home} from "./routes/Home.tsx";
import {NewJourney} from "./routes/NewJourney.tsx";
import {Dev} from "./routes/Dev.tsx";
import {JourneyHistory} from "./routes/JourneyHistory.tsx";

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
        path: "/dev",
        element: <Dev />,
      },
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}