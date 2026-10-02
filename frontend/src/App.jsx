import "./App.css";

// A lista receberá os produtos cadastrados quando a API for conectada.
const produtos = [];

function App() {

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) => total + produto.quantidade,
    0
  );

  const estoqueBaixo = produtos.filter(
    (produto) => produto.quantidade <= 5
  ).length;


  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          TECH<span>STOCK</span>
        </div>

        <nav aria-label="Menu principal">

          <button type="button" className="menu-item active" aria-current="page">
            Dashboard
          </button>

          <button type="button" className="menu-item" disabled title="Disponível em uma próxima etapa">
            Produtos
          </button>

          <button type="button" className="menu-item" disabled title="Disponível em uma próxima etapa">
            Categorias
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button type="button" className="menu-item" disabled title="Disponível em uma próxima etapa">
            Configurações
          </button>

          <button type="button" className="menu-item" disabled title="Disponível em uma próxima etapa">
            Sair
          </button>

        </div>

      </aside>


      <main className="main">

        <header className="topbar">

          <div>
            <h1>Dashboard</h1>
            <p>Visão geral do seu estoque</p>
          </div>

          <div className="user">
            <div className="user-avatar">
              A
            </div>

            <div>
              <strong>Administrador</strong>
              <small>Administrador</small>
            </div>
          </div>

        </header>


        <section className="cards">

          <div className="card">

            <div>
              <span className="card-title">
                Total de produtos
              </span>

              <strong>
                {totalProdutos}
              </strong>
            </div>

          </div>


          <div className="card">

            <div>
              <span className="card-title">
                Itens em estoque
              </span>

              <strong>
                {totalEstoque}
              </strong>
            </div>

          </div>


          <div className="card">

            <div>
              <span className="card-title">
                Estoque baixo
              </span>

              <strong>
                {estoqueBaixo}
              </strong>
            </div>

          </div>

        </section>


        <section className="products-section">

          <div className="section-header">

            <div>
              <h2>Produtos recentes</h2>
              <p>Confira os produtos cadastrados no estoque.</p>
            </div>

            <button type="button" className="primary-button" disabled title="Cadastro disponível em uma próxima etapa">
              + Novo produto
            </button>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th scope="col">Produto</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Estoque</th>
                  <th scope="col">Status</th>
                </tr>

              </thead>


              <tbody>

                {produtos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                )}

                {produtos.map((produto) => (

                  <tr key={produto.id}>

                    <td>
                      <strong>{produto.nome}</strong>
                    </td>

                    <td>
                      {produto.categoria}
                    </td>

                    <td>
                      {produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>

                    <td>
                      {produto.quantidade}
                    </td>

                    <td>

                      {produto.quantidade <= 5 ? (
                        <span className="status low">
                          Estoque baixo
                        </span>
                      ) : (
                        <span className="status available">
                          Disponível
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;
