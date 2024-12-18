import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Se till att detta är rätt sökväg
import Login from "./pages/Login";

interface User {
  name?: string;
  email?: string;
  subscriptionPlan?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("Not logged in");
      })
      .then((data: User) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
