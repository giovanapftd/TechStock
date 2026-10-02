import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CarrinhoProvider from "./context/CarrinhoProvider";
import Loja from "./pages/Loja";
import Produtos from "./pages/Produtos";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import Carrinho from "./pages/Carrinho";
import "./pages/Compra.css";

function App() {
  return (
    <BrowserRouter>
      <CarrinhoProvider>
        <Routes>
          <Route path="/" element={<Loja />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhes />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="*" element={<main className="compra-container"><h1>Página não encontrada</h1><Link to="/">Voltar para a loja</Link></main>} />
        </Routes>
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

export default App;
