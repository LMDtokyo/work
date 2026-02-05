import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/Landing";
import { LoginPage } from "../pages/Auth/Login";
import { SignupPage } from "../pages/Auth/Signup";
import { RecoveryPasswordPage } from "../pages/Auth/RecoveryPassword";
import { VerifyCodePage } from "../pages/Auth/VerifyCode";
import { OfferPage } from "../pages/Others/Offer";
import { PrivacyPolicy } from "../pages/Others/PrivacyPolicy/PrivacyPolicy";
import { NotFound } from "../pages/Others/NotFound/NotFoundPage";
import { ErrorPage } from "../pages/Others/Error";
import { App } from "../pages/Home/App/AppPage";
import { ChatsPage } from "../pages/Home/Chats";
import { ProfilePage } from "../pages/Home/Profile";
import { AccountsPage } from "../pages/Home/Accounts";
import { TransactionsPage } from "../pages/Home/Transactions";
import { GuestRoute } from "../shared/components/GuestRoute";
import { PrivateRoute } from "../shared/components/PrivateRoute";
import { SettingsPage } from "../pages/Home/Settings";
import { SubscriptionPage } from "../pages/Home/Subscription";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <GuestRoute>
        <LandingPage />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: (
      <GuestRoute>
        <SignupPage />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/recovery-password",
    element: (
      <GuestRoute>
        <RecoveryPasswordPage />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/verify-code",
    element: (
      <GuestRoute>
        <VerifyCodePage />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/offer",
    element: <OfferPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute> 
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/chats" replace />,
      },
      {
        path: "/app/chats",
        element: <ChatsPage />,
      },
      {
        path: "/app/chats/wildberries",
        element: <ChatsPage />,
      },
      {
        path: "/app/chats/avito",
        element: <ChatsPage />,
      },
      {
        path: "/app/chats/telegram",
        element: <ChatsPage />,
      },
      {
        path: "/app/chats/all-accounts",
        element: <ChatsPage />,
      },
      {
        path: "/app/profile",
        element: <ProfilePage />,
      },
      {
        path: "/app/settings",
        element: <SettingsPage />,
      },
      {
        path: "/app/subscription",
        element: <SubscriptionPage />,
      },
      {
        path: "/app/profile/accounts",
        element: <AccountsPage />,
      },
      {
        path: "/app/profile/transactions",
        element: <TransactionsPage />,
      },
    ],
  },
]);
