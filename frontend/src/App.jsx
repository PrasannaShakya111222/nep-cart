import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";

import HelpCenterPage from "./footer/HelpCenterPage";
import TrackOrderPage from "./footer/TrackOrderPage";
import ReturnPolicyPage from "./footer/ReturnPolicyPage";
import PrivacyPolicyPage from "./footer/PrivacyPolicyPage";
import TermsPage from "./footer/TermsPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmailVerificationModal from "./components/EmailVerificationModal";

import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";
import { useUiStore } from "./stores/useUiStore";
import { useCartStore } from "./stores/useCartStore";

import LoadingSpinner from "./components/LoadingSpinner";

import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  const { getCartItems } = useCartStore();

  const theme = useUiStore((state) => state.theme);

  // IMPORTANT: connect Zustand theme with Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user || user.role === "admin") return;

    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="
        min-h-screen
        overflow-hidden

        bg-slate-100
        text-slate-950

        dark:bg-slate-950
        dark:text-white

        transition-colors
        duration-300
      "
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.16)_0%,rgba(59,130,246,0.1)_45%,rgba(15,23,42,0.15)_100%)]
          "
        />
      </div>

      <div
        className="
          relative
          z-50
          pt-28
        "
      >
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />

          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />

          <Route path="/category/:category" element={<CategoryPage />} />

          <Route
            path="/cart"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/secret-dashboard" />
                ) : (
                  <CartPage />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
          />

          <Route path="/help-center" element={<HelpCenterPage />} />

          <Route path="/track-order" element={<TrackOrderPage />} />

          <Route path="/return-policy" element={<ReturnPolicyPage />} />

          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          <Route path="/terms" element={<TermsPage />} />
        </Routes>

        <Footer />
      </div>

      <EmailVerificationModal />
      <Toaster />
    </div>
  );
}

export default App;
