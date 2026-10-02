import AcessoConta from "./AcessoConta";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProdutos } from "../context/ProdutosContext";
import { useCarrinho } from "../context/CarrinhoContext";
import "./Produtos.css";

function Produtos() {

const navigate = useNavigate();
const { totalItens } = useCarrinho();
const { produtos, carregandoProdutos, erroProdutos, recarregarProdutos } = useProdutos();

const [busca, setBusca] = useState("");

const [categoriaSelecionada, setCategoriaSelecionada] =
useState("Todos");


const categorias = [
"Todos",
"Periféricos",
"Monitores",
"Áudio",
"Acessórios",
"Componentes",
"Sem categoria"
];


const produtosFiltrados = produtos.filter((produto) => {

const correspondeBusca =
    produto.nome
    .toLowerCase()
    .includes(busca.toLowerCase());


const correspondeCategoria =
    categoriaSelecionada === "Todos" ||
    produto.categoria === categoriaSelecionada;


return correspondeBusca && correspondeCategoria;
});


return (
<div className="produtos-page">

    {/* CABEÇALHO */}

    <header className="produtos-header">

    <div className="produtos-logo">
        TECH<span>STOCK</span>
    </div>


    <nav>

        <Link to="/">
        Início
        </Link>

        <Link to="/produtos">
        Produtos
        </Link>

        <a href="/#categorias">
        Categorias
        </a>

        <a href="/#sobre">
        Sobre
        </a>

    </nav>


    <div className="produtos-actions">

        <AcessoConta />

        <button className="cart-button" onClick={() => navigate("/carrinho")}>
        Carrinho ({totalItens})
        </button>

    </div>

    </header>


    {/* TÍTULO */}

    <section className="catalog-header">

    <span>CATÁLOGO</span>

    <h1>
        Produtos TechStock
    </h1>

    <p>
        Encontre produtos para montar seu setup.
    </p>

    </section>


    {/* FILTROS */}

    <section className="filters">

    <input
        type="text"
        placeholder="Pesquisar produto..."
        value={busca}
        onChange={(event) =>
        setBusca(event.target.value)
        }
    />


    <div className="category-filters">

        {categorias.map((categoria) => (

        <button
            key={categoria}
            className={
            categoriaSelecionada === categoria
                ? "selected"
                : ""
            }
            onClick={() =>
            setCategoriaSelecionada(categoria)
            }
        >
            {categoria}
        </button>

        ))}

    </div>

    </section>


    {/* PRODUTOS */}

    <section className="catalog">

    {carregandoProdutos ? <p role="status">Carregando produtos…</p> : erroProdutos ? <div><p role="alert">{erroProdutos}</p><button onClick={recarregarProdutos}>Tentar novamente</button></div> : produtosFiltrados.length === 0 ? (

        <div className="no-products">
        <h2>Nenhum produto encontrado</h2>

        <p>
            {produtos.length === 0 ? "Novos produtos aparecerão aqui quando forem cadastrados." : "Tente pesquisar por outro produto."}
        </p>
        </div>

    ) : (

        <div className="catalog-grid">

        {produtosFiltrados.map((produto) => (

            <article
            className="catalog-card"
            key={produto.id}
            >

            <div className="catalog-image">

                <img
                src={produto.imagem}
                alt={produto.nome}
                />

            </div>


            <div className="catalog-info">

                <span>
                {produto.categoria}
                </span>

                <h2>
                {produto.nome}
                </h2>

                <p>
                {produto.descricao}
                </p>

                <strong>
                R$ {produto.preco.toFixed(2)}
                </strong>

                <button className="details-button" onClick={() => navigate(`/produtos/${produto.id}`)}>
                Ver detalhes
                </button>

            </div>

            </article>

        ))}

        </div>

    )}

    </section>


    {/* RODAPÉ */}

    <footer className="catalog-footer">

    <strong>
        TECHSTOCK
    </strong>

    <p>
        Tecnologia para o seu dia a dia.
    </p>

    </footer>

</div>
);
}

export default Produtos;

