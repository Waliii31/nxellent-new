// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Leaderboard from "./pages/Leaderboard";
import Pricing from "./pages/Pricing";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import MyProjects from "./pages/MyProjects";
import ProjectSettings from "./pages/ProjectSettings";
import DeFiProtocolSecurityReport from "./pages/DeFiProtocolSecurityReport";
import AccountsAndBilling from "./pages/AccountsAndBilling";
import CompareProjects from "./pages/CompareProjects";
import MyPortfolio from "./pages/MyPortfolio";
import ProjectDetails from "./pages/ProjectDetails";
import PortfolioRiskAnalysis from "./pages/PortfolioRiskAnalysis";
import GithubCallback from "./pages/GithubCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Scanner from "./pages/Scanner";
import Profile from "./pages/Profile";
import BillingSuccess from "./pages/BillingSuccess";
import BillingCancel from "./pages/BillingCancel";
import BatchScanner from "./pages/BatchScanner";
import InvestorPortfolio from "./pages/InvestorPortfolio";
import RoleGuard from "./components/RoleGuard";
import SharedProjectCard from "./pages/SharedProjectCard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/callback" element={<GithubCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
        <Route path="/project/:projectId/card" element={<SharedProjectCard />} />
        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <Scanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/projects/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/settings"
          element={
            <ProtectedRoute>
              <ProjectSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/defi-protocol-security-report"
          element={
            <ProtectedRoute>
              <DeFiProtocolSecurityReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/accounts-and-billing"
          element={
            <ProtectedRoute>
              <AccountsAndBilling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/success"
          element={
            <ProtectedRoute>
              <BillingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/cancel"
          element={
            <ProtectedRoute>
              <BillingCancel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare-projects"
          element={
            <ProtectedRoute>
              <RoleGuard forbiddenRoles={["founder"]}>
                <CompareProjects />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio-risk-analysis"
          element={
            <ProtectedRoute>
              <PortfolioRiskAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-portfolio"
          element={
            <ProtectedRoute>
              <MyPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/batch-scanner"
          element={
            <ProtectedRoute>
              <RoleGuard forbiddenRoles={["founder"]}>
                <BatchScanner />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor-portfolio"
          element={
            <ProtectedRoute>
              <RoleGuard forbiddenRoles={["founder"]}>
                <InvestorPortfolio />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router >
  );
}

export default App;
