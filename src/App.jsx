import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { CustomerProvider } from './context/CustomerContext';

import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardLayout from './components/common/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ShipmentsPage from './pages/shipments/ShipmentsPage';
import CustomersPage from './pages/customers/CustomersPage';
import TrackingPage from './pages/tracking/TrackingPage';
import DeliveryStatusPage from './pages/delivery-status/DeliveryStatusPage';

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <CustomerProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                }
              />

              {/* Protected App Routes inside DashboardLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/shipments" element={<ShipmentsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/tracking" element={<TrackingPage />} />
                <Route path="/delivery-status" element={<DeliveryStatusPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Global Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </BrowserRouter>
        </CustomerProvider>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;
