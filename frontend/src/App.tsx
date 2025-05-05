import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { getCookie } from "./utils/cookies";
import { Loader2 } from "lucide-react";

const Home = lazy(() => import("@/app/home/page"));
const Dashboard = lazy(() => import("@/app/dashboard/page"));
const AuthPage = lazy(() => import("@/app/auth-page/page"));
const NotFoundPage = lazy(() => import("@/app/no-page/page"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin m-auto" size={96} />
              <h1 className="mt-4 text-2xl">Loading...</h1>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign-in" element={<AuthPage method="sign-in" />} />
          <Route path="/sign-up" element={<AuthPage method="sign-up" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${getCookie("token")}`;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      !["Invalid or expired token", "No token provided"].includes(
        error.response.data.message
      )
    ) {
      toast(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default App;
