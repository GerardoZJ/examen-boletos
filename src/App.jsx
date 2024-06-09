import React from "react";
import Rutas from "../src/Rutas/Route/Rutas";
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Rutas />
    </AuthContextProvider>
  );
}

export default App;
