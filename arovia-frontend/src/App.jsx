import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Records from "./pages/dashboard/Records";
import Medicines from "./pages/dashboard/Medicines";
import Timeline from "./pages/dashboard/Timeline";
import Settings from "./pages/dashboard/Settings";
import UserDetails from "./pages/dashboard/UserDetails";
import HealthAnalysis from "./pages/dashboard/HealthAnalysis";
import Comparison from "./pages/dashboard/Comparison";
import Suggestions from "./pages/dashboard/Suggestions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />

          {/* Sidebar items */}
          <Route path="timeline" element={<Timeline />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="records" element={<Records />} />
          <Route path="settings" element={<Settings />} />

          {/* Dashboard option cards */}
          <Route path="user-details" element={<UserDetails />} />
          <Route path="health-analysis" element={<HealthAnalysis />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="suggestions" element={<Suggestions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
