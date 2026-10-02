import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, mensagemErro } from "../services/auth";
import "./Login.css";

export default function ContaFormulario({ cadastro = false }) {
  const { usuario, carregando, entrar, sair } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarFormulario(event) {
    event.preventDefault();
    if (enviando) return;
    setErro("");
    setMensagem("");
    if (cadastro && senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (cadastro && !nome.trim()) {
      setErro("Informe seu nome.");
      return;
    }
    setEnviando(true);
    const dados = { email: email.trim().toLowerCase(), senha };
    try {
      if (cadastro) {
        await auth.cadastrar({ ...dados, nome: nome.trim() });
        setMensagem("Conta criada! Clique em Entrar para acessar sua conta.");
        setNome("");
      } else {
        await entrar(dados);
      }
      setSenha("");
      setConfirmacao("");
      setMostrarSenha(false);
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setEnviando(false);
    }
  }

  async function encerrarSessao() {
    setEnviando(true);
    setErro("");
    try {
      await sair();
      navigate("/");
    } catch (falha) {
      setErro(mensagemErro(falha));
    } finally {
      setEnviando(false);
    }
  }

  // Administradores com sessão ativa seguem diretamente para o painel.
  if (!carregando && usuario?.perfil === "ADMINISTRADOR") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="compra-page login-page">
      <header className="compra-header">
        <Link to="/" className="compra-logo">TECH<span>STOCK</span></Link>
        <nav aria-label="Navegação principal"><Link to="/">Início</Link><Link to="/produtos">Produtos</Link><Link to="/carrinho">Carrinho</Link></nav>
      </header>
      <main className="login-container">
        <section className="login-apresentacao" aria-labelledby="login-boas-vindas">
          <span className="login-tag">BEM-VINDO À TECHSTOCK</span>
          <h1 id="login-boas-vindas">Seu próximo setup começa aqui.</h1>
          <p>Tecnologia, periféricos e acessórios para o seu dia a dia.</p>
          <Link to="/produtos">Explorar o catálogo →</Link>
        </section>
        <section className="compra-card login-card" aria-labelledby="login-titulo">
          {carregando ? <h2 id="login-titulo">Verificando sessão…</h2> : usuario ? (
            <>
              <h2 id="login-titulo">Minha conta</h2>
              <p>Olá, {usuario.nome}!</p>
              <p>{usuario.email}</p>
              <p>Perfil: {usuario.perfil === "ADMINISTRADOR" ? "Administrador" : "Usuário"}</p>
              <Link to="/produtos">Continuar comprando</Link>
              <button className="compra-primary login-enviar" disabled={enviando} onClick={encerrarSessao}>{enviando ? "Saindo…" : "Sair da conta"}</button>
            </>
          ) : (
            <>
              <h2 id="login-titulo">{cadastro ? "Criar minha conta" : "Entrar na minha conta"}</h2>
              <p>{cadastro ? "Cadastre seus dados para começar." : "Preencha seu e-mail e sua senha."}</p>
              <form onSubmit={enviarFormulario}>
                <fieldset disabled={enviando} className="conta-campos">
                  {cadastro && <><label htmlFor="conta-nome">Nome</label><input id="conta-nome" autoComplete="name" required maxLength={100} value={nome} onChange={(event) => setNome(event.target.value)} /></>}
                  <label htmlFor="login-email">E-mail</label>
                  <input id="login-email" name="email" type="email" autoComplete="username" placeholder="voce@exemplo.com" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
                  <label htmlFor="login-senha">Senha</label>
                  <div className="login-senha">
                    <input id="login-senha" name="senha" type={mostrarSenha ? "text" : "password"} autoComplete={cadastro ? "new-password" : "current-password"} required minLength={cadastro ? 8 : undefined} maxLength={128} aria-describedby={cadastro ? "senha-ajuda" : undefined} value={senha} onChange={(event) => setSenha(event.target.value)} />
                    <button type="button" aria-controls="login-senha" aria-pressed={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button>
                  </div>
                  {cadastro && <><p id="senha-ajuda" className="login-cadastro">Use entre 8 e 128 caracteres.</p><label htmlFor="conta-confirmacao">Confirmar senha</label><input id="conta-confirmacao" type={mostrarSenha ? "text" : "password"} autoComplete="new-password" required maxLength={128} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} /></>}
                  <button type="submit" className="compra-primary login-enviar">{enviando ? "Aguarde…" : cadastro ? "Criar conta" : "Entrar"}</button>
                </fieldset>
              </form>
              <p className="login-status" role="status">{mensagem}</p>
              <p className="login-cadastro">{cadastro ? "Já tem uma conta? " : "Ainda não tem uma conta? "}<Link to={cadastro ? "/login" : "/cadastro"}>{cadastro ? "Entrar" : "Criar conta"}</Link></p>
            </>
          )}
          {erro && <p role="alert" className="conta-erro">{erro}</p>}
          <Link className="login-voltar" to="/">← Voltar para a loja</Link>
        </section>
      </main>
      <footer className="login-footer">TECHSTOCK · Tecnologia para o seu dia a dia.</footer>
    </div>
  );
}
