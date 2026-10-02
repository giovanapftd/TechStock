import api from "./api";

// O cookie de sessão é enviado pelo navegador; senhas e tokens não são salvos no localStorage.
async function enviar(path, dados = {}) {
  const { data: csrf } = await api.get("/auth/csrf", { withCredentials: true });
  return api.post(path, dados, {
    withCredentials: true,
    headers: { [csrf.headerName]: csrf.token },
  });
}

export const auth = {
  cadastrar: (dados) => enviar("/auth/cadastro", dados),
  login: (dados) => enviar("/auth/login", dados),
  sair: () => enviar("/auth/sair"),
  conta: () => api.get("/auth/me", { withCredentials: true }),
  admin: () => api.get("/auth/admin", { withCredentials: true }),
};

export function mensagemErro(erro) {
  if (!erro.response) return "Não foi possível acessar o servidor. Verifique se o backend está rodando.";
  if (erro.response.status === 403) return "Sua sessão expirou. Tente novamente.";
  return erro.response.data?.mensagem || "Não foi possível concluir a operação. Tente novamente.";
}
