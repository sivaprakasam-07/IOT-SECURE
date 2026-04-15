import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import Alerts from "../pages/alerts/Alerts";
import Logs from "../pages/logs/Logs";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute allowedRoles={["admin", "user"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/logs" element={<Logs />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default AppRoutes;