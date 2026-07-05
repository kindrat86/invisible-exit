import { createRoot } from "react-dom/client";
import './integrations/posthog';
import "./i18n"; // Initialize i18next before app renders
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
