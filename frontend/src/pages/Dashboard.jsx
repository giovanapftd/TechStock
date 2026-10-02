import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, mensagemErro } from "../services/auth";
import "./Dashboard.css";

export default function Dashboard() {
  const { usuario, carregando } = useAuth();
  if (carregando) return <main className="compra-container" role="status">Verificando sessão…</main>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.perfil !== "ADMINISTRADOR") return <Navigate to="/produtos" replace />;
  return <DashboardAutorizado key={usuario.id} />;
}

function DashboardAutorizado() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const [acesso, setAcesso] = useState("verificando");
  const [erro, setErro] = useState("");
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    let ativo = true;
    // O servidor confirma o perfil antes de exibir o painel administrativo.
    auth.admin().then(() => { if (ativo) setAcesso("autorizado"); })
      .catch((falha) => {
        if (!ativo) return;
        setAcesso("negado");
        setErro(mensagemErro(falha));
      });
    return () => { ativo = false; };
  }, []);

  async function encerrarSessao() {
    setSaindo(true);
    setErro("");
    try {
      await sair();
      navigate("/", { replace: true });
    } catch (falha) {
      setErro(mensagemErro(falha));
      setSaindo(false);
    }
  }

  if (acesso === "verificando") return <main className="compra-container" role="status">Verificando acesso ao Dashboard…</main>;
  if (acesso === "negado") return <main className="compra-container"><h1>Não foi possível abrir o Dashboard</h1><p role="alert">{erro}</p><a href="/login">Verificar minha sessão novamente</a></main>;

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <Link to="/admin/dashboard" className="admin-logo">TECH<span>STOCK</span></Link>
        <span className="admin-tag">ADMINISTRAÇÃO</span>
        <nav aria-label="Navegação administrativa">
          <Link to="/admin/dashboard" aria-current="page" className="admin-menu-ativo">Dashboard</Link>
          <Link to="/">Visitar loja</Link>
        </nav>
        <button className="admin-sair" disabled={saindo} onClick={encerrarSessao}>{saindo ? "Saindo…" : "Sair da conta"}</button>
      </aside>
      <main className="admin-main">
        <header className="admin-topo">
          <div><h1>Dashboard</h1><p>Painel administrativo</p></div>
          <div className="admin-identidade"><span aria-hidden="true">{usuario.nome.slice(0, 1).toUpperCase()}</span><div><strong>{usuario.nome}</strong><small>Administrador</small></div></div>
        </header>
        {erro && <p role="alert" className="admin-erro">{erro}</p>}
      </main>
    </div>
  );
}
