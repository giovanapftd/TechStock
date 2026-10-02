import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../services/auth";

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    auth.conta().then(({ data }) => { if (ativo) setUsuario(data); })
      .catch(() => { if (ativo) setUsuario(null); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  async function entrar(dados) {
    const { data } = await auth.login(dados);
    setUsuario(data);
  }

  async function sair() {
    await auth.sair();
    setUsuario(null);
  }

  return <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>{children}</AuthContext.Provider>;
}
