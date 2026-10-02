import { useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { erroProduto } from "../services/produtos";

export default function CadastroProduto() {
  const { id } = useParams();
  const { produtos, carregandoProdutos, erroProdutos, recarregarProdutos } = useOutletContext();
  const produto = produtos.find((item) => String(item.id) === id);
  if (carregandoProdutos) return <p role="status">Carregando produtos…</p>;
  if (erroProdutos) return <section><p role="alert">{erroProdutos}</p><button onClick={recarregarProdutos}>Tentar novamente</button></section>;
  if (id && !produto) {
    return <section className="admin-produtos"><h2>Produto não encontrado</h2><p>O produto não está mais disponível.</p><Link to="/admin/produtos">Voltar para produtos</Link></section>;
  }
  return <FormularioProduto key={id ?? "novo"} produto={produto} />;
}

function FormularioProduto({ produto }) {
  const { adicionarProduto, atualizarProduto } = useOutletContext();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function cadastrar(event) {
    event.preventDefault();
    if (salvando) return;
    const dados = new FormData(event.currentTarget);
    const nome = dados.get("nome").trim();
    const descricao = dados.get("descricao").trim();
    const preco = Number(dados.get("preco"));
    const quantidade = Number(dados.get("quantidade"));
    if (!nome || !descricao || !Number.isFinite(preco) || preco <= 0 || !Number.isSafeInteger(quantidade) || quantidade < 0) {
      setErro("Confira os campos: nome e descrição são obrigatórios, o preço deve ser maior que zero e o estoque deve ser um número inteiro não negativo.");
      return;
    }
    const valores = { nome, descricao, categoria: dados.get("categoria"), imagem: dados.get("imagem").trim(), preco: Math.round(preco * 100) / 100, quantidade };
    setSalvando(true);
    setErro("");
    try {
      if (produto) await atualizarProduto(produto.id, valores);
      else await adicionarProduto(valores);
      navigate("/admin/produtos");
    } catch (falha) { setErro(erroProduto(falha)); }
    finally { setSalvando(false); }
  }

  return (
    <section className="admin-produtos admin-formulario">
      <h2>Dados do produto</h2>
      <form onSubmit={cadastrar}>
        <fieldset disabled={salvando} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <label htmlFor="produto-nome">Nome do produto</label>
        <input id="produto-nome" name="nome" required maxLength={100} placeholder="Informe o nome" defaultValue={produto?.nome ?? ""} />
        <label htmlFor="produto-descricao">Descrição</label>
        <textarea id="produto-descricao" name="descricao" required maxLength={1000} rows={4} placeholder="Descreva o produto" defaultValue={produto?.descricao ?? ""} />
        <label htmlFor="produto-categoria">Categoria</label>
        <select id="produto-categoria" name="categoria" required defaultValue={produto?.categoria ?? ""}><option value="" disabled>Selecione uma categoria</option>{["Periféricos", "Monitores", "Áudio", "Acessórios", "Componentes", "Sem categoria"].map((categoria) => <option key={categoria}>{categoria}</option>)}</select>
        <label htmlFor="produto-imagem">URL da imagem (opcional)</label>
        <input id="produto-imagem" name="imagem" type="url" pattern="https?://.*" maxLength={2048} placeholder="https://exemplo.com/produto.jpg" defaultValue={produto?.imagemOriginal ?? ""} />
        <div className="admin-formulario-linha">
          <div><label htmlFor="produto-preco">Preço (R$)</label><input id="produto-preco" name="preco" type="number" required min="0.01" max="999999999.99" step="0.01" placeholder="0,00" defaultValue={produto?.preco ?? ""} /></div>
          <div><label htmlFor="produto-quantidade">Quantidade em estoque</label><input id="produto-quantidade" name="quantidade" type="number" required min="0" max="2147483647" step="1" defaultValue={produto?.quantidade ?? 0} /></div>
        </div>
        {erro && <p className="admin-erro" role="alert">{erro}</p>}
        <div className="admin-formulario-acoes"><button className="compra-primary" type="submit">{salvando ? "Salvando…" : produto ? "Salvar alterações" : "Cadastrar produto"}</button>{!salvando && <Link to="/admin/produtos">Cancelar</Link>}</div>
        </fieldset>
      </form>
    </section>
  );
}
