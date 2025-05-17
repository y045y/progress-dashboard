import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// main.jsx または App.jsx の先頭に追加
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ✅ 必要ならカスタムCSSもここで読み込み（Tailwindや独自スタイル）
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
