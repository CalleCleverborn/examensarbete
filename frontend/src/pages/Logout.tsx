import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
  setUser: (user: null) => void;
}

const Logout: React.FC<LogoutProps> = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/auth/logout", { credentials: "include" })
      .then(() => {
        setUser(null);

        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);

        setUser(null);
        navigate("/");
      });
  }, [navigate, setUser]);

  return <div>Logging you out...</div>;
};

export default Logout;
