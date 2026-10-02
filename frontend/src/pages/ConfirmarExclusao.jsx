import { useEffect, useRef, useState } from "react";
import { erroProduto } from "../services/produtos";

export default function ConfirmarExclusao({ produto, cancelar, confirmar }) {
  const dialogRef = useRef(null);
  const cancelarRef = useRef(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function excluir() {
    if (excluindo) return;
    setExcluindo(true);
    setErro("");
    try { await confirmar(); }
    catch (falha) { setErro(erroProduto(falha)); setExcluindo(false); }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    cancelarRef.current.focus();
    return () => dialog.close();
  }, []);

  return (
    <dialog className="admin-confirmacao" ref={dialogRef} aria-labelledby="exclusao-titulo" aria-describedby="exclusao-descricao" onCancel={(event) => { event.preventDefault(); if (!excluindo) cancelar(); }}>
      <h2 id="exclusao-titulo">Excluir produto?</h2>
      <p id="exclusao-descricao">O produto <strong>{produto.nome}</strong> será removido da lista.</p>
      {erro && <p role="alert" className="admin-erro">{erro}</p>}
      <div className="admin-confirmacao-acoes"><button type="button" ref={cancelarRef} disabled={excluindo} onClick={cancelar}>Cancelar</button><button type="button" disabled={excluindo} className="admin-confirmar-exclusao" onClick={excluir}>{excluindo ? "Excluindo…" : "Excluir produto"}</button></div>
    </dialog>
  );
}
