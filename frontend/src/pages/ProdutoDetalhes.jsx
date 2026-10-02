import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import produtos from "../data/produtos";
import { useCarrinho } from "../context/CarrinhoContext";

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const produto = produtos.find((item) => String(item.id) === id);
  if (!produto) return <main className="compra-container"><h1>Produto não encontrado</h1><Link to="/produtos">Voltar para produtos</Link></main>;
  return <Detalhes key={produto.id} produto={produto} />;
}

function Detalhes({ produto }) {
  const { adicionar, itens, totalItens } = useCarrinho();
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const noCarrinho = itens.find((item) => item.id === produto.id)?.quantidade ?? 0;
  const disponivel = produto.estoque - noCarrinho;

  function adicionarProduto() {
    adicionar(produto.id, Math.min(quantidade, disponivel));
    setMensagem("Produto adicionado ao carrinho.");
  }

  return (
    <div className="compra-page">
      <header className="compra-header">
        <Link to="/" className="compra-logo">TECH<span>STOCK</span></Link>
        <nav aria-label="Navegação principal"><Link to="/">Início</Link><Link to="/produtos">Produtos</Link><Link to="/carrinho">Carrinho ({totalItens})</Link></nav>
      </header>
      <main className="compra-container">
        <Link to="/produtos">← Voltar para produtos</Link>
        <section className="detalhes-layout">
          <img className="detalhes-imagem" src={produto.imagem} alt={produto.nome} />
          <div className="compra-card">
            <span className="compra-categoria">{produto.categoria}</span>
            <h1>{produto.nome}</h1>
            <p>{produto.descricao}</p>
            <strong className="compra-preco">{moeda(produto.preco)}</strong>
            <p>{produto.estoque} unidades no estoque fictício</p>
            <div className="compra-quantidade" aria-label="Quantidade">
              <button aria-label="Diminuir quantidade" disabled={quantidade <= 1} onClick={() => setQuantidade(quantidade - 1)}>−</button>
              <output>{quantidade}</output>
              <button aria-label="Aumentar quantidade" disabled={quantidade >= disponivel} onClick={() => setQuantidade(quantidade + 1)}>+</button>
            </div>
            <button className="compra-primary" disabled={disponivel === 0} onClick={adicionarProduto}>{disponivel === 0 ? "Limite de estoque no carrinho" : "Adicionar ao carrinho"}</button>
            <p role="status">{mensagem}</p>
            <Link to="/carrinho">Ver meu carrinho</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function moeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
