import AcessoConta from "./AcessoConta";
import { useCarrinho } from "../context/CarrinhoContext";
import { Link, useNavigate } from "react-router-dom";
import { useProdutos } from "../context/ProdutosContext";
import "./Loja.css";

function Loja() {
const navigate = useNavigate();
const { totalItens } = useCarrinho();
const { produtos, carregandoProdutos, erroProdutos, recarregarProdutos } = useProdutos();
const categorias = [
"Periféricos",
"Monitores",
"Áudio",
"Acessórios"
];

return (
<div className="loja">

    {/* CABEÇALHO */}
    <header className="loja-header">

    <div className="loja-logo">
        TECH<span>STOCK</span>
    </div>

    <nav className="loja-nav">
        <a href="#">Início</a>
        <a href="#categorias">Categorias</a>
        <a href="#produtos">Produtos</a>
        <a href="#sobre">Sobre</a>
    </nav>

    <div className="loja-actions">
        <AcessoConta />

        <button className="cart-button" onClick={() => navigate("/carrinho")}>
        Carrinho ({totalItens})
        </button>
    </div>

    </header>


    {/* BANNER PRINCIPAL */}
    <section className="hero">

    <div className="hero-content">

        <span className="hero-tag">
        TECHSTOCK
        </span>

        <h1>
        Tecnologia para
        <br />
        o seu dia a dia.
        </h1>

        <p>
        Encontre produtos de tecnologia,
        periféricos e acessórios para montar
        o seu setup.
        </p>

        <a
        href="#produtos"
        className="hero-button"
        >
        Ver produtos
        </a>

    </div>

    </section>


    {/* CATEGORIAS */}
    <section
    className="categories"
    id="categorias"
    >

    <div className="section-title">

        <span>CATEGORIAS</span>

        <h2>
        Encontre o que você precisa
        </h2>

    </div>


    <div className="category-grid">

        {categorias.map((categoria) => (

        <div
            className="category-card"
            key={categoria}
        >

            <div className="category-icon">

            {categoria === "Periféricos" && "⌨"}

            {categoria === "Monitores" && "▣"}

            {categoria === "Áudio" && "♫"}

            {categoria === "Acessórios" && "⚙"}

            </div>

            <h3>
            {categoria}
            </h3>

            <p>
            Confira os produtos dessa categoria.
            </p>

        </div>

        ))}

    </div>

    </section>


{/* PRODUTOS */}

<section
className="products"
id="produtos"
>

<div className="section-title">

<span>PRODUTOS</span>

<h2>
    Nosso catálogo
</h2>

</div>


<div className="home-products">
{carregandoProdutos && <p role="status">Carregando produtos…</p>}
{erroProdutos && <div><p role="alert">{erroProdutos}</p><button onClick={recarregarProdutos}>Tentar novamente</button></div>}
{!carregandoProdutos && !erroProdutos && produtos.length === 0 && <p>Nenhum produto disponível no momento.</p>}

{produtos.slice(0, 4).map((produto) => (

    <article
    className="home-product-card"
    key={produto.id}
    >

    <div className="home-product-image">

        <img
        src={produto.imagem}
        alt={produto.nome}
        />

    </div>


    <div className="home-product-info">

        <span>
        {produto.categoria}
        </span>

        <h3>
        {produto.nome}
        </h3>

        <strong>
        R$ {produto.preco.toFixed(2)}
        </strong>

        <Link
        to={`/produtos/${produto.id}`}
        className="home-product-button"
        >
        Ver detalhes
        </Link>

    </div>

    </article>

))}

</div>


<div className="view-all-products">

<Link to="/produtos">
    Ver todos os produtos
</Link>

</div>

</section>


    {/* SOBRE */}
    <section
    className="about"
    id="sobre"
    >

    <div>

        <span>TECHSTOCK</span>

        <h2>
        Tecnologia de um jeito simples.
        </h2>

        <p>
        A TechStock é uma loja de tecnologia
        criada para oferecer produtos para
        computadores, setups e acessórios.
        </p>

    </div>

    </section>


    {/* RODAPÉ */}
    <footer className="footer">

    <strong>
        TECHSTOCK
    </strong>

    <p>
        © 2026 TechStock. Todos os direitos reservados.
    </p>

    </footer>

</div>
);
}

export default Loja;

