import { createRoot } from "react-dom/client";

import { App } from "./app/App.tsx";
import { initTheme } from "./shared/hooks/useTheme.ts";

import "./shared/styles/global.scss";

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
