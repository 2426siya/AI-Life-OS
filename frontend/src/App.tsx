import { useState } from "react";
import Dashboard from "./components/Dashboard";
import AuthGateway from "./components/AuthGateway";

// Intercept global fetch statically at module load time to avoid React parent-child mount race conditions
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : (input as Request).url;
  
  // Inject token for all backend api requests except the auth endpoints
  if (url.includes("/api") && !url.includes("/api/auth")) {
    const token = localStorage.getItem("token");
    if (token) {
      init = init || {};
      const headers = new Headers(init.headers || {});
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      init.headers = headers;
    }
  }
  return originalFetch(input, init);
};

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");

  const handleLoginSuccess = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
  };

  if (!token) {
    return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onBack={handleLogout} />;
}

export default App;