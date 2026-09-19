import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import NewReviewPage from "./pages/NewReviewPage.tsx";
import ReviewDetailPage from "./pages/ReviewDetailPage.tsx";
import HistoryPage from "./pages/HistoryPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import OAuthCallBack from "./pages/OAuthCallBack.tsx";
import SampleReviewPage from "./pages/SampleReviewPage.tsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<LoginPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallBack />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review/new"
            element={
              <ProtectedRoute>
                <NewReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review/:id"
            element={
              <ProtectedRoute>
                <ReviewDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/sample-review" element={<SampleReviewPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

{
  /*DBLUMQWI*/
}
