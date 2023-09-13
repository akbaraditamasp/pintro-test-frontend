import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Main from "./pages";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";

const routes = createBrowserRouter([
  {
    path: "/auth",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
        index: true,
      },
      {
        path: "/task",
        element: <TaskPage />,
      },
    ],
  },
]);

export default routes;
