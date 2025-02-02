import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import WalletPage from "@/pages/wallet";
import DashboardPage from "@/pages/dashboard";
import TransactionsPage from "@/pages/transactions";
import ContractsPage from "@/pages/contracts";
import AlertsPage from "@/pages/alerts";
import SettingsPage from "@/pages/settings";
import DeploymentPage from "@/pages/deployment";
import SupportPage from "@/pages/support";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/connect" component={WalletPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/transactions" component={TransactionsPage} />
      <Route path="/contracts" component={ContractsPage} />
      <Route path="/alerts" component={AlertsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/deployment" component={DeploymentPage} />
      <Route path="/support" component={SupportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}