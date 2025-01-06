import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyPlan from "./pages/MyPlan";
import About from "./pages/About";
import Logout from "./pages/Logout";

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
          element={user ? <Navigate to="/app/dashboard" replace /> : <Login />}
        />

        <Route
          path="/app"
          element={user ? <Layout /> : <Navigate to="/" replace />}
        >
          <Route
            path="dashboard"
            element={<Dashboard user={user || undefined} />}
          />
          <Route path="my-plan" element={<MyPlan user={user} />} />
          <Route path="about" element={<About />} />
          <Route path="logout" element={<Logout setUser={setUser} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
