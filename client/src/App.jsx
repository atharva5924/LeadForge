import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import LeadsList from "./components/Leads/LeadsList";
import LeadForm from "./components/Leads/LeadForm";
import Layout from "./components/Layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Add request interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.log("User not authenticated");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    toast.success("Login successful!");
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !user ? (
              <Register onRegister={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="leads/new" element={<LeadForm />} />
          <Route path="leads/:id/edit" element={<LeadForm />} />
        </Route>

        {/* Catch all route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
