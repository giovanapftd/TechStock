import { useEffect, useState } from "react";
import api from "./services/api";

function App() {

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const resposta = await api.get("/produtos");

      setProdutos(resposta.data);

    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  }

  return (
    <div>
      <h1>TechStock</h1>

      <h2>Produtos em estoque</h2>

      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              {produto.nome} - R$ {produto.preco} -
              Quantidade: {produto.quantidade}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;