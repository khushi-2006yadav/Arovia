import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupComplete from "./pages/SignupComplete";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Records from "./pages/dashboard/Records";
import AddRecord from "./pages/dashboard/AddRecord";
import RecordDetail from "./pages/dashboard/RecordDetail";
import Medicines from "./pages/dashboard/Medicines";
import MedicineDetail from "./pages/dashboard/MedicineDetail";
import Insights from "./pages/dashboard/Insights";
import Timeline from "./pages/dashboard/Timeline";
import Profile from "./pages/dashboard/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/complete" element={<SignupComplete />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/new" element={<AddRecord />} />
            <Route path="/records/:id" element={<RecordDetail />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicines/:name" element={<MedicineDetail />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
