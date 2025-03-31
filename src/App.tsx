
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/graphql-client';
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import ReportIncident from "./pages/ReportIncident";
import Cases from "./pages/Cases";
import People from "./pages/People";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen overflow-hidden">
    <div className="hidden md:block md:w-64">
      <Sidebar />
    </div>
    <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </div>
);

const App = () => (
  <ApolloProvider client={client}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <AppLayout>
                  <Index />
                </AppLayout>
              } 
            />
            <Route 
              path="/report-incident" 
              element={
                <AppLayout>
                  <ReportIncident />
                </AppLayout>
              } 
            />
            <Route 
              path="/cases" 
              element={
                <AppLayout>
                  <Cases />
                </AppLayout>
              } 
            />
            <Route 
              path="/people" 
              element={
                <AppLayout>
                  <People />
                </AppLayout>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <AppLayout>
                  <Reports />
                </AppLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;
