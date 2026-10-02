import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loja from "./pages/Loja";
import Produtos from "./pages/Produtos";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Loja />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;