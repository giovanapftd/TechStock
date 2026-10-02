import AuthProvider from "./context/AuthProvider";
import Cadastro from "./pages/Cadastro";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CarrinhoProvider from "./context/CarrinhoProvider";
import Loja from "./pages/Loja";
import Produtos from "./pages/Produtos";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import Carrinho from "./pages/Carrinho";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./pages/Compra.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider><CarrinhoProvider>
        <Routes>
          <Route path="/" element={<Loja />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhes />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="*" element={<main className="compra-container"><h1>Página não encontrada</h1><Link to="/">Voltar para a loja</Link></main>} />
        </Routes>
      </CarrinhoProvider></AuthProvider>
    </BrowserRouter>
  );
}

export default App;

