import {createBrowserRouter, RouterProvider} from "react-router";
import Root from "./Root.tsx";
import Index from "./routes/Index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Index />
      }
    ],
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}