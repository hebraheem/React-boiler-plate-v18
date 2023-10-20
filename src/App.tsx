import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline } from "@mui/material";

import "./App.css";
import Routes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";
import { TableRecordProvider } from "./reusables/common/Table";

const queryClient = new QueryClient();
function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <TableRecordProvider>
            <Routes />
          </TableRecordProvider>
          <CssBaseline />
        </ErrorBoundary>
      </QueryClientProvider>
    </div>
  );
}

export default App;
