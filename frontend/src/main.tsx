import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { QueryProvider } from "./context/query-provider.tsx";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryProvider>
            <NuqsAdapter>
                <App />
            </NuqsAdapter>
            <Toaster />
        </QueryProvider>
    </StrictMode>,
);
