import { useEffect, useState } from "react";
import { useProdutos } from "./ProdutosContext";
import { CarrinhoContext } from "./CarrinhoContext";

const CHAVE_CARRINHO = "techstock:carrinho:v1";

function carregarCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || "[]");
    if (!Array.isArray(dados)) return [];
    const ids = new Set();
    return dados.filter((item) => {
      if (!item || !Number.isSafeInteger(item.id) || item.id < 1 ||
        !Number.isSafeInteger(item.quantidade) || item.quantidade < 1 || ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    }).map(({ id, quantidade }) => ({ id, quantidade }));
  } catch {
    return [];
  }
}

// Somente IDs e quantidades ficam no navegador. Preços e estoque vêm do banco.
export default function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(carregarCarrinho);
  const { produtos, carregandoProdutos, erroProdutos } = useProdutos();

  useEffect(() => {
    // Não apagar a seleção enquanto o catálogo carrega ou o servidor está indisponível.
    if (carregandoProdutos || erroProdutos) return;
    const disponiveis = itens.flatMap((item) => {
      const produto = produtos.find((produto) => produto.id === item.id);
      return produto && produto.estoque > 0
        ? [{ id: item.id, quantidade: Math.min(item.quantidade, produto.estoque) }] : [];
    });
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(disponiveis));
    } catch {
      // Se o navegador bloquear o armazenamento, o carrinho continua nesta sessão.
    }
  }, [itens, produtos, carregandoProdutos, erroProdutos]);

  function adicionar(id, quantidade = 1) {
    const produto = produtos.find((item) => item.id === id);
    if (!produto || produto.estoque < 1 || !Number.isInteger(quantidade) || quantidade < 1) return;
    setItens((atuais) => {
      const existente = atuais.find((item) => item.id === id);
      const novaQuantidade = Math.min((existente?.quantidade ?? 0) + quantidade, produto.estoque);
      return existente
        ? atuais.map((item) => item.id === id ? { ...item, quantidade: novaQuantidade } : item)
        : [...atuais, { id, quantidade: novaQuantidade }];
    });
  }

  function alterarQuantidade(id, quantidade) {
    const produto = produtos.find((item) => item.id === id);
    if (!produto || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > produto.estoque) return;
    setItens((atuais) => atuais.map((item) => item.id === id ? { ...item, quantidade } : item));
  }

  function remover(id) {
    setItens((atuais) => atuais.filter((item) => item.id !== id));
  }

  // Quantidade e disponibilidade são reavaliadas quando o catálogo é atualizado.
  const itensComProdutos = itens.flatMap((item) => {
    const produto = produtos.find((produto) => produto.id === item.id);
    return produto && produto.estoque > 0 ? [{ ...produto, quantidade: Math.min(item.quantidade, produto.estoque) }] : [];
  });
  const totalCentavos = itensComProdutos.reduce((total, item) => total + Math.round(item.preco * 100) * item.quantidade, 0);
  const totalItens = itensComProdutos.reduce((total, item) => total + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{ itens: itensComProdutos, adicionar, alterarQuantidade, remover, total: totalCentavos / 100, totalItens }}>
      {children}
    </CarrinhoContext.Provider>
  );
}
