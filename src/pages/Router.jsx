import { useRoutes, Navigate, BrowserRouter } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./dashboard/Dashboard";
import InsideOutlet from "./dashboard/InsideOutlet";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/login", element: <LoginPage /> },
    // Nested Routes
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { path: "", element: <Navigate to="inside-outlet" /> },
        { path: "inside-outlet", element: <InsideOutlet /> },
      ],
    },
  ]);
  return routes;
};

const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Router;