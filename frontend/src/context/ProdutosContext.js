import { createContext, useContext } from "react";
export const ProdutosContext = createContext(null);
export function useProdutos() {
  const contexto = useContext(ProdutosContext);
  if (!contexto) throw new Error("Use produtos dentro de ProdutosProvider.");
  return contexto;
}
