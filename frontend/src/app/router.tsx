import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/Landing";
import { LoginPage } from "../pages/Auth/Login";
import { SignupPage } from "../pages/Auth/Signup";
import { RecoveryPasswordPage } from "../pages/Auth/RecoveryPassword";
import { VerifyCodePage } from "../pages/Auth/VerifyCode";
import { OfferPage } from "../pages/Others/Offer";
import { PrivacyPolicy } from "../pages/Others/PrivacyPolicy/PrivacyPolicy";
import { NotFound } from "../pages/Others/NotFound/NotFoundPage";
import { App } from "../pages/Home/App/AppPage";
import { ChatsPage } from "../pages/Home/Chats";
import { ProfilePage } from "../pages/Home/Profile";
import { AccountsPage } from "../pages/Home/Accounts";
import { TransactionsPage } from "../pages/Home/Transactions";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/recovery-password",
    element: <RecoveryPasswordPage />,
  },
  {
    path: "/verify-code",
    element: <VerifyCodePage />,
  },
  {
    path: "/offer",
    element: <OfferPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/app",
    element: <App />,
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
        path: "/app/profile",
        element: <ProfilePage />,
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
