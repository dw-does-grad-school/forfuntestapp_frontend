import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import App from "./App";
import "./styles.css";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!clerkKey || !convexUrl) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <div className="setup-notice">
      <div className="setup-card">
        <span className="wordmark">FORME<span>.</span></span>
        <p className="eyebrow">One start line. Three disciplines.</p>
        <h1>Your training base is almost ready.</h1>
        <p>Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> and <code>VITE_CONVEX_URL</code> to <code>.env.local</code>, then restart the dev server.</p>
      </div>
    </div>,
  );
} else {
  const convex = new ConvexReactClient(convexUrl);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={clerkKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </React.StrictMode>,
  );
}
