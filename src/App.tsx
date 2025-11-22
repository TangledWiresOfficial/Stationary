import {createBrowserRouter, RouterProvider} from "react-router";
import Root from "./Root.tsx";
import Index from "./routes/Index.tsx";
import AddJourney from "./routes/AddJourney.tsx";
import Dev from "./routes/Dev.tsx";
import JourneyHistory from "./routes/JourneyHistory.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/addjourney",
        element: <AddJourney />,
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