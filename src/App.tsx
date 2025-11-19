import {createBrowserRouter, RouterProvider} from "react-router";
import Root from "./Root.tsx";
import Index from "./routes/Index.tsx";
import AddJourney from "./routes/AddJourney.tsx";

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
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}