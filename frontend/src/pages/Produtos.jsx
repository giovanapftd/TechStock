import { useState } from "react";
import "./Produtos.css";

function Produtos() {

const produtos = [
{
    id: 1,
    nome: "Mouse Gamer RGB",
    categoria: "Periféricos",
    preco: 129.90,
    descricao: "Mouse gamer com iluminação RGB e alta precisão.",
    imagem: "https://placehold.co/600x400?text=Mouse+Gamer"
},
{
    id: 2,
    nome: "Teclado Mecânico RGB",
    categoria: "Periféricos",
    preco: 249.90,
    descricao: "Teclado mecânico RGB ideal para jogos e trabalho.",
    imagem: "https://placehold.co/600x400?text=Teclado"
},
{
    id: 3,
    nome: "Monitor 24 Polegadas",
    categoria: "Monitores",
    preco: 899.90,
    descricao: "Monitor Full HD de 24 polegadas.",
    imagem: "https://placehold.co/600x400?text=Monitor"
},
{
    id: 4,
    nome: "Headset Gamer",
    categoria: "Áudio",
    preco: 199.90,
    descricao: "Headset com microfone e áudio de alta qualidade.",
    imagem: "https://placehold.co/600x400?text=Headset"
},
{
    id: 5,
    nome: "Webcam Full HD",
    categoria: "Acessórios",
    preco: 179.90,
    descricao: "Webcam Full HD para reuniões e transmissões.",
    imagem: "https://placehold.co/600x400?text=Webcam"
},
{
    id: 6,
    nome: "Mousepad Gamer",
    categoria: "Acessórios",
    preco: 79.90,
    descricao: "Mousepad grande para setups gamer.",
    imagem: "https://placehold.co/600x400?text=Mousepad"
},
{
    id: 7,
    nome: "Cadeira Gamer",
    categoria: "Acessórios",
    preco: 999.90,
    descricao: "Cadeira confortável para longas sessões.",
    imagem: "https://placehold.co/600x400?text=Cadeira"
},
{
    id: 8,
    nome: "SSD 1TB",
    categoria: "Componentes",
    preco: 459.90,
    descricao: "SSD de 1TB para armazenamento rápido.",
    imagem: "https://placehold.co/600x400?text=SSD"
}
];


const [busca, setBusca] = useState("");

const [categoriaSelecionada, setCategoriaSelecionada] =
useState("Todos");


const categorias = [
"Todos",
"Periféricos",
"Monitores",
"Áudio",
"Acessórios",
"Componentes"
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

        <a href="/">
        Início
        </a>

        <a href="/produtos">
        Produtos
        </a>

        <a href="/#categorias">
        Categorias
        </a>

        <a href="/#sobre">
        Sobre
        </a>

    </nav>


    <div className="produtos-actions">

        <button>
        Entrar
        </button>

        <button className="cart-button">
        Carrinho
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

    {produtosFiltrados.length === 0 ? (

        <div className="no-products">
        <h2>Nenhum produto encontrado</h2>

        <p>
            Tente pesquisar por outro produto.
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

                <button className="details-button">
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