import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AuthGateway from "./components/AuthGateway";

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");


  // Intercept global fetch to automatically add JWT authorization headers to API requests
  useEffect(() => {
    if (!token) return;

    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      
      // Inject token for all backend api requests except the auth endpoints
      if (url.includes("/api") && !url.includes("/api/auth")) {
        init = init || {};
        const headers = new Headers(init.headers || {});
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        init.headers = headers;
      }
      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

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