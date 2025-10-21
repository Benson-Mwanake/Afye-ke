import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import CHVDashboard from "./components/chv/CHVDashboard";
import PatientList from "./components/chv/PatientList";
import ReportForm from "./components/chv/ReportForm";
import StatsOverview from "./components/chv/StatsOverview";
import { useAuth } from "./hooks/useAppHooks";


// Dummy ProtectedRoute handler
function ProtectedRouteHandler({ user, children }) {
  const isAuthRoute = window.location.pathname === "/";

  if (!user && !isAuthRoute) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}


export default function App() {
  const { user, login, logout } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F9FAFB] text-[#111827]">
        <main className="flex-grow px-4 sm:px-8 py-6">
          <Switch>
            <Route exact path="/">
              <div className="text-center text-gray-600 mt-10">
                <h1 className="text-2xl font-semibold mb-2">
                  Welcome to Afye KE
                </h1>
                <p>Login to continue.</p>
              </div>
            </Route>
            {/* CHV Routes */}
            <Route path="/chv/dashboard">
              <ProtectedRouteHandler user={user}>
                <CHVDashboard />
              </ProtectedRouteHandler>
            </Route>

            <Route path="/chv/patients">
              <ProtectedRouteHandler user={user}>
                <PatientList />
              </ProtectedRouteHandler>
            </Route>

            <Route path="/chv/reports">
              <ProtectedRouteHandler user={user}>
                <ReportForm />
              </ProtectedRouteHandler>
            </Route>

            <Route path="/chv/stats">
              <ProtectedRouteHandler user={user}>
                <StatsOverview />
              </ProtectedRouteHandler>
            </Route>

            {/* fallback */}
            <Route path="*">
              <Redirect to="/chv/dashboard" />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
