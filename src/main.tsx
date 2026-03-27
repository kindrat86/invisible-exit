import { createRoot } from "react-dom/client";
import './integrations/posthog';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
