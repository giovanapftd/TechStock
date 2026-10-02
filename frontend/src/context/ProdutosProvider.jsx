import { useEffect, useRef, useState } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { produtosApi, erroProduto } from "../services/produtos";

export default function ProdutosProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregando] = useState(true);
  const [erroProdutos, setErro] = useState("");
  const revisao = useRef(0);

  useEffect(() => {
    let ativo = true;
    const carregar = () => {
      const pedido = ++revisao.current;
      return produtosApi.listar().then((dados) => {
        if (ativo && pedido === revisao.current) { setProdutos(dados); setErro(""); }
      }).catch((erro) => { if (ativo && pedido === revisao.current) setErro(erroProduto(erro)); })
        .finally(() => { if (ativo && pedido === revisao.current) setCarregando(false); });
    };
    carregar();
    window.addEventListener("focus", carregar);
    return () => { ativo = false; window.removeEventListener("focus", carregar); };
  }, []);

  async function recarregarProdutos() {
    const pedido = ++revisao.current;
    setCarregando(true);
    try { const dados = await produtosApi.listar(); if (pedido === revisao.current) { setProdutos(dados); setErro(""); } }
    catch (erro) { if (pedido === revisao.current) setErro(erroProduto(erro)); }
    finally { if (pedido === revisao.current) setCarregando(false); }
  }

  async function adicionarProduto(dados) {
    const produto = await produtosApi.cadastrar(dados);
    ++revisao.current;
    setProdutos((atuais) => [...atuais.filter((item) => item.id !== produto.id), produto]);
  }
  async function atualizarProduto(id, dados) {
    const produto = await produtosApi.atualizar(id, dados);
    ++revisao.current;
    setProdutos((atuais) => atuais.map((item) => item.id === produto.id ? produto : item));
  }
  async function excluirProduto(id) {
    await produtosApi.excluir(id);
    ++revisao.current;
    setProdutos((atuais) => atuais.filter((item) => item.id !== id));
  }

  return <ProdutosContext.Provider value={{ produtos, carregandoProdutos, erroProdutos, recarregarProdutos, adicionarProduto, atualizarProduto, excluirProduto }}>{children}</ProdutosContext.Provider>;
}
