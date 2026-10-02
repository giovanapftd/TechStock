import api from "./api";

export function normalizarProduto(produto) {
  return { ...produto, preco: Number(produto.preco), estoque: produto.quantidade,
    categoria: produto.categoria || "Sem categoria", imagemOriginal: produto.imagem || "",
    imagem: produto.imagem || "/produto-sem-imagem.svg" };
}

async function alterar(method, url, data) {
  const { data: csrf } = await api.get("/auth/csrf", { withCredentials: true });
  const resposta = await api.request({ method, url, data, withCredentials: true,
    headers: { [csrf.headerName]: csrf.token } });
  return method === "delete" ? undefined : normalizarProduto(resposta.data);
}

export const produtosApi = {
  listar: async () => (await api.get("/produtos")).data.map(normalizarProduto),
  cadastrar: (dados) => alterar("post", "/produtos", dados),
  atualizar: (id, dados) => alterar("put", `/produtos/${id}`, dados),
  excluir: (id) => alterar("delete", `/produtos/${id}`),
};

export function erroProduto(erro) {
  if (!erro.response) return "Não foi possível acessar o servidor. Tente novamente.";
  if (erro.response.status === 401) return "Sua sessão expirou. Entre novamente na conta.";
  if (erro.response.status === 403) return "A operação exige uma sessão de administrador válida. Entre novamente.";
  const campos = erro.response.data?.campos;
  return campos ? Object.entries(campos).map(([campo, mensagem]) => `${campo}: ${mensagem}`).join("; ")
    : erro.response.data?.mensagem || "Não foi possível concluir a operação.";
}
