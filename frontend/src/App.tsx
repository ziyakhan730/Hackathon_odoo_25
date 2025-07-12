import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import MyItems from './pages/MyItems';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('access');
  return token ? children : <Navigate to="/auth" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes with layout */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/browse" element={<PrivateRoute><Layout><Browse /></Layout></PrivateRoute>} />
          <Route path="/item/:id" element={<PrivateRoute><Layout><ItemDetail /></Layout></PrivateRoute>} />
          <Route path="/add-item" element={<PrivateRoute><Layout><AddItem /></Layout></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Layout><Admin /></Layout></PrivateRoute>} />
          <Route path="/my-items" element={<PrivateRoute><Layout><MyItems /></Layout></PrivateRoute>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
