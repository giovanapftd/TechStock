import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import ConfirmarExclusao from "./ConfirmarExclusao";

export default function ProdutosAdmin() {
  const { produtos, carregandoProdutos, erroProdutos, recarregarProdutos, excluirProduto, mensagem } = useOutletContext();
  const [busca, setBusca] = useState("");
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const filtrados = produtos.filter((produto) => produto.nome.toLocaleLowerCase("pt-BR").includes(busca.toLocaleLowerCase("pt-BR")));
  if (carregandoProdutos) return <p role="status">Carregando produtos…</p>;
  if (erroProdutos) return <section><p role="alert">{erroProdutos}</p><button onClick={recarregarProdutos}>Tentar novamente</button></section>;
  return (
    <section className="admin-produtos">
      <div className="admin-produtos-topo">
        <div><h2>Lista de produtos</h2><p>Organize os produtos da TechStock.</p></div>
        <Link className="compra-primary" to="/admin/produtos/novo">+ Novo produto</Link>
      </div>
      {mensagem && <p className="admin-produto-status" role="status">{mensagem}</p>}
      <label className="admin-busca-label" htmlFor="admin-busca">Pesquisar produto</label>
      <input className="admin-busca" id="admin-busca" type="search" placeholder="Digite o nome do produto" value={busca} onChange={(event) => setBusca(event.target.value)} />
      {produtos.length === 0 ? <div className="admin-lista-vazia"><h3>Nenhum produto cadastrado</h3><p>Clique em Novo produto para começar.</p></div> : filtrados.length === 0 ? <p role="status">Nenhum produto encontrado para essa pesquisa.</p> : (
        <div className="admin-tabela-container">
          <table><caption>Produtos cadastrados</caption><thead><tr><th scope="col">Produto</th><th scope="col">Categoria</th><th scope="col">Preço</th><th scope="col">Estoque</th><th scope="col">Status</th><th scope="col">Ações</th></tr></thead>
            <tbody>{filtrados.map((produto) => <tr key={produto.id}><td><strong>{produto.nome}</strong></td><td>{produto.categoria}</td><td>{produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td><td>{produto.quantidade}</td><td><span className={produto.quantidade <= 5 ? "admin-status admin-status-baixo" : "admin-status"}>{produto.quantidade === 0 ? "Sem estoque" : produto.quantidade <= 5 ? "Estoque baixo" : "Disponível"}</span></td><td><div className="admin-acoes-produto"><Link to={`/admin/produtos/${produto.id}/editar`} aria-label={`Editar ${produto.nome}`}>Editar</Link><button type="button" aria-label={`Excluir ${produto.nome}`} onClick={() => setProdutoParaExcluir(produto)}>Excluir</button></div></td></tr>)}</tbody>
          </table>
        </div>
      )}
      {produtoParaExcluir && <ConfirmarExclusao produto={produtoParaExcluir} cancelar={() => setProdutoParaExcluir(null)} confirmar={async () => { await excluirProduto(produtoParaExcluir.id); setProdutoParaExcluir(null); }} />}
    </section>
  );
}
