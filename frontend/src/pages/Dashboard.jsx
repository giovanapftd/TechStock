import { Link, useOutletContext } from "react-router-dom";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Dashboard() {
  const { produtos, carregandoProdutos, erroProdutos, recarregarProdutos } = useOutletContext();

  if (carregandoProdutos) return <p role="status">Carregando os dados do estoque…</p>;
  if (erroProdutos) return (
    <section>
      <p className="admin-erro" role="alert">{erroProdutos}</p>
      <button type="button" onClick={recarregarProdutos}>Tentar novamente</button>
    </section>
  );

  const unidades = produtos.reduce((total, produto) => total + produto.quantidade, 0);
  const estoqueBaixo = produtos.filter((produto) => produto.quantidade <= 5).length;
  // Os IDs são gerados em sequência pelo banco; os maiores representam os últimos cadastros.
  const recentes = [...produtos].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <>
      <div className="dashboard-acoes">
        <p>Resumo dos produtos cadastrados no banco de dados.</p>
        <button type="button" onClick={recarregarProdutos}>Atualizar dados</button>
      </div>
      <section className="admin-cards" aria-label="Resumo do estoque">
        <article><span>Produtos cadastrados</span><strong>{produtos.length}</strong></article>
        <article><span>Unidades em estoque</span><strong>{unidades}</strong></article>
        <article><span>Estoque baixo (até 5 unidades)</span><strong>{estoqueBaixo}</strong></article>
      </section>
      <section className="admin-produtos" aria-labelledby="cadastros-recentes">
        <div className="admin-produtos-topo">
          <div><h2 id="cadastros-recentes">Cadastros mais recentes</h2><p>Últimos cinco produtos cadastrados.</p></div>
          <Link to="/admin/produtos">Gerenciar produtos</Link>
        </div>
        {recentes.length === 0 ? (
          <div className="admin-lista-vazia">
            <p>Nenhum produto cadastrado ainda.</p>
            <Link to="/admin/produtos/novo">Cadastrar primeiro produto</Link>
          </div>
        ) : (
          <div className="admin-tabela-container">
            <table>
              <caption>O estoque baixo inclui produtos sem estoque.</caption>
              <thead><tr><th scope="col">Produto</th><th scope="col">Categoria</th><th scope="col">Preço</th><th scope="col">Quantidade</th><th scope="col">Estoque</th><th scope="col">Ação</th></tr></thead>
              <tbody>{recentes.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td><td>{produto.categoria}</td><td>{moeda.format(produto.preco)}</td><td>{produto.quantidade}</td>
                  <td><span className={`admin-status${produto.quantidade <= 5 ? " admin-status-baixo" : ""}`}>{produto.quantidade === 0 ? "Sem estoque" : produto.quantidade <= 5 ? "Estoque baixo" : "Disponível"}</span></td>
                  <td><Link to={`/admin/produtos/${produto.id}/editar`} aria-label={`Editar ${produto.nome}`}>Editar</Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
