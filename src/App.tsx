import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAdmin } from "@/components/RequireAdmin";
import Index from "./pages/Index.tsx";
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const Sales = lazy(() => import("./pages/admin/Sales.tsx"));
const Editor = lazy(() => import("./pages/admin/Editor.tsx"));
const Promos = lazy(() => import("./pages/admin/Promos.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<Index />} />
            <Route path="/checkout" element={<Index />} />
            <Route path="/p/:slug" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Sales />} />
              <Route path="editor" element={<Editor />} />
              <Route path="promos" element={<Promos />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
