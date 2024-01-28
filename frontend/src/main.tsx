import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@styles/global.css";
// import { AuthProvider } from "@context/authContext.tsx";
import { MantineProvider } from "@mantine/core";
import { theme } from "@styles/theme.ts";
import { CampaignProvider } from "@context/campaignContext.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-2atjq86z1xxiu1u6.us.auth0.com"
      clientId="W9rRCsZhtVmrAIsvZciNxaTID4kollbv"
      authorizationParams={{
        redirect_uri: "http://localhost:5173/plan",
        scope: "read:current_user update:current_user_metadata",
        audience: "http://127.0.0.1:5000/auth/login",
      }}
      // useRefreshTokens={true}
      // cacheLocation="localstorage"
    >
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <CampaignProvider>
          <App />
        </CampaignProvider>
      </MantineProvider>
    </Auth0Provider>
  </React.StrictMode>
);
