import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import "./Carrinho.css";

const moeda = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Carrinho() {
  const { itens, alterarQuantidade, remover, total, totalItens } = useCarrinho();
  return (
    <div className="compra-page">
      <header className="compra-header">
        <Link to="/" className="compra-logo">TECH<span>STOCK</span></Link>
        <nav aria-label="Navegação principal"><Link to="/">Início</Link><Link to="/produtos">Produtos</Link><Link to="/carrinho" aria-current="page">Carrinho ({totalItens})</Link></nav>
      </header>
      <main className="compra-container">
        <span className="compra-categoria">SUA SELEÇÃO</span>
        <h1>Meu carrinho</h1>
        <p>Revise os produtos e as quantidades antes de continuar.</p>
        {itens.length === 0 ? (
          <section className="compra-card carrinho-vazio">
            <h2>Seu carrinho está vazio</h2>
            <p>Explore nosso catálogo e escolha produtos para seu setup.</p>
            <Link className="compra-primary" to="/produtos">Explorar produtos</Link>
          </section>
        ) : (
          <div className="carrinho-layout">
            <section aria-label="Produtos no carrinho" className="carrinho-itens">
              {itens.map((item) => (
                <article key={item.id} className="compra-card carrinho-item">
                  <img src={item.imagem} alt={item.nome} />
                  <div>
                    <span className="compra-categoria">{item.categoria}</span>
                    <h2><Link to={`/produtos/${item.id}`}>{item.nome}</Link></h2>
                    <p>{moeda(item.preco)} por unidade</p>
                    <div className="compra-quantidade">
                      <button aria-label={`Diminuir quantidade de ${item.nome}`} disabled={item.quantidade <= 1} onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}>−</button>
                      <output aria-label={`Quantidade de ${item.nome}`}>{item.quantidade}</output>
                      <button aria-label={`Aumentar quantidade de ${item.nome}`} disabled={item.quantidade >= item.estoque} onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}>+</button>
                    </div>
                    <button className="carrinho-remover" aria-label={`Remover ${item.nome}`} onClick={() => remover(item.id)}>Remover</button>
                  </div>
                  <strong>{moeda(Math.round(item.preco * 100) * item.quantidade / 100)}</strong>
                </article>
              ))}
              <Link to="/produtos">← Continuar comprando</Link>
            </section>
            <aside className="compra-card carrinho-resumo" aria-label="Resumo do carrinho">
              <h2>Resumo</h2>
              <p>{totalItens} {totalItens === 1 ? "item" : "itens"}</p>
              <div><span>Subtotal</span><strong>{moeda(total)}</strong></div>
              <p>Frete será calculado na etapa de finalização.</p>
              <div className="carrinho-total" aria-live="polite"><span>Total dos produtos</span><strong>{moeda(total)}</strong></div>
              <button className="compra-primary" disabled>Finalizar compra</button>
              <small>A finalização será disponibilizada na próxima etapa.</small>
            </aside>
          </div>
        )}
        <p className="carrinho-nota">Carrinho demonstrativo: os itens ficam salvos enquanto o site está aberto. Ao recarregar a página, o carrinho será esvaziado.</p>
      </main>
    </div>
  );
}
