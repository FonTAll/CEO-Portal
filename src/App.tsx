/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VisibilityProvider } from './context/ModuleVisibilityContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import AiCopilot from './pages/AiCopilot';
import DevPermit from './pages/DevPermit';
import SystemConfig from './pages/SystemConfig';
import SystemLogs from './pages/SystemLogs';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import GoogleSheetsSync from './pages/GoogleSheetsSync';
import AutoSync from './pages/AutoSync';
import SaleRevenue from './pages/SaleRevenue';
import CostExpense from './pages/CostExpense';
import Margin from './pages/Margin';
import SaleAnalysis from './pages/SaleAnalysis';
import ExpenseAnalysis from './pages/ExpenseAnalysis';
import MarginAnalysis from './pages/MarginAnalysis';
import BreakEvenAnalysis from './pages/BreakEven';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <VisibilityProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/copilot" element={
                  <ProtectedRoute>
                    <AiCopilot />
                  </ProtectedRoute>
                } />
                
                {/* General Modules (Read-only by default) */}
                <Route path="/core/margin" element={
                  <ProtectedRoute>
                    <Margin />
                  </ProtectedRoute>
                } />
                <Route path="/core/sale-revenue" element={
                  <ProtectedRoute>
                    <SaleRevenue />
                  </ProtectedRoute>
                } />
                <Route path="/core/cost-expense" element={
                  <ProtectedRoute>
                    <CostExpense />
                  </ProtectedRoute>
                } />
                
                <Route path="/data/sale" element={
                  <ProtectedRoute>
                    <SaleAnalysis />
                  </ProtectedRoute>
                } />
                <Route path="/data/expense" element={
                  <ProtectedRoute>
                    <ExpenseAnalysis />
                  </ProtectedRoute>
                } />
                <Route path="/data/margin" element={
                  <ProtectedRoute>
                    <MarginAnalysis />
                  </ProtectedRoute>
                } />
                <Route path="/data/break-even" element={
                  <ProtectedRoute>
                    <BreakEvenAnalysis />
                  </ProtectedRoute>
                } />

                {/* Confidential Modules */}
                <Route path="/google-sheets" element={
                  <ProtectedRoute isConfidential>
                    <GoogleSheetsSync />
                  </ProtectedRoute>
                } />
                <Route path="/dev-permit" element={
                  <ProtectedRoute>
                    <DevPermit />
                  </ProtectedRoute>
                } />
                <Route path="/dev-logs" element={
                  <ProtectedRoute>
                    <SystemLogs />
                  </ProtectedRoute>
                } />
                <Route path="/auto-sync" element={
                  <ProtectedRoute isConfidential>
                    <AutoSync />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute isConfidential>
                    <SystemConfig />
                  </ProtectedRoute>
                } />
                <Route path="/permissions" element={
                  <ProtectedRoute isConfidential>
                    <UserPermissions />
                  </ProtectedRoute>
                } />
                
                {/* Catch all */}
                <Route path="*" element={<PlaceholderPage title="Module Loading" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </VisibilityProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

