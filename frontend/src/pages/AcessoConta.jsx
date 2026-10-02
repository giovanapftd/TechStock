import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AcessoConta() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const administrador = usuario?.perfil === "ADMINISTRADOR";
  return <button className="login-button" onClick={() => navigate(administrador ? "/admin/dashboard" : "/login")}>{administrador ? "Dashboard" : usuario ? "Minha conta" : "Entrar"}</button>;
}
