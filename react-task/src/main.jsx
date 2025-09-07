import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import ClassSelect from "./pages/ClassSelect";
import Home from "./pages/Home";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/class", element: <ClassSelect /> },
  { path: "/home", element: <Home /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}