import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DebugRoute from "./components/DebugRoute";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import CreatePin from "./pages/CreatePin";
import EnterPin from "./pages/EnterPin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Stocks from "./pages/Stocks";
import LoanAnalyzer from "./pages/LoanAnalyzer";
import Reports from "./pages/Reports";
import Learn from "./pages/Learn";
import Goals from "./pages/Goals";
import AddBankAccount from "./pages/AddBankAccount";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";
import BackgroundDemo from "./pages/BackgroundDemo";
import SaveButtonTest from "./pages/SaveButtonTest";
import ButtonAnimationTest from "./pages/ButtonAnimationTest";
import BentoGridDemo from "./pages/BentoGridDemo";
import SplineDemo from "./pages/SplineDemo";
import AIChatbot from "./components/layout/AIChatbot";
import AuthFlowDebugger from "./components/AuthFlowDebugger";
import { SplineBackground } from "@/components/ui/spline-background";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
        
        {/* Spline 3D Background - Re-enabled with pointer-events fixes */}
        <SplineBackground />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/background-demo" element={<BackgroundDemo />} />
          <Route path="/save-button-test" element={<SaveButtonTest />} />
          <Route path="/button-animation-test" element={<ButtonAnimationTest />} />
          <Route path="/bento-grid-demo" element={<BentoGridDemo />} />
          <Route path="/spline-demo" element={<SplineDemo />} />
          
          {/* Authentication Flow Routes */}
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route path="/enter-pin" element={<EnterPin />} />
          <Route path="/add-bank-account" element={<AddBankAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } />
          <Route path="/stocks" element={
            <ProtectedRoute>
              <Stocks />
            </ProtectedRoute>
          } />
          <Route path="/loan-analyzer" element={
            <ProtectedRoute>
              <LoanAnalyzer />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />

          {/* Legacy and other routes */}
          <Route path="/old" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AuthFlowDebugger />
        <AIChatbot />
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;