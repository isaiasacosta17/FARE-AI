import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ChurnSimulation from "./pages/ChurnSimulation";
import SalesSimulation from "./pages/SalesSimulation";
import LeadsSimulation from "./pages/LeadsSimulation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/churn" component={ChurnSimulation} />
      <Route path="/ventas" component={SalesSimulation} />
      <Route path="/leads" component={LeadsSimulation} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
