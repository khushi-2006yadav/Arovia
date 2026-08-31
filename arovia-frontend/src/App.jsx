import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OAuthSuccess from "./pages/OAuthSuccess";
import CompleteProfile from "./pages/CompleteProfile";
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
import { AroviaProvider } from "./context";

function App() {
  return (
    <AroviaProvider>
      <BrowserRouter basename="/Arovia">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />

          {/* Sidebar ke items*/}
          <Route path="timeline" element={<Timeline />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="records" element={<Records />} />
          <Route path="settings" element={<Settings />} />

          {/* Dashboard options*/}
          <Route path="user-details" element={<UserDetails />} />
          <Route path="health-analysis" element={<HealthAnalysis />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="suggestions" element={<Suggestions />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </AroviaProvider>
  );
}

export default App;
