/* eslint-disable no-unused-vars */
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { DueProvider } from "./context/dueContext.jsx";
import { CertificateProvider } from "./context/certificateContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <DueProvider>
          <CertificateProvider>
            <App />
          </CertificateProvider>
        </DueProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
