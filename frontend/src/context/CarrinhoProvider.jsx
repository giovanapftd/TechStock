import { useState } from "react";
import { useProdutos } from "./ProdutosContext";
import { CarrinhoContext } from "./CarrinhoContext";

// O estado é compartilhado entre as páginas e dura enquanto o site está aberto.
export default function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  const { produtos } = useProdutos();

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
