import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Perfil, Home, Eventos } from '../Paginas';
import Register from '../../Componentes/Register/Register';
import DetallesPerfil from '../Paginas/Perfil/DetallesPerfil';
import Login from '../../Componentes/Login/Login';
import NavBar from '../../Componentes/NavBar/NavBar';
import EleccionB from '../Paginas/Eventos/EleccionB';
import SuccessPage from '../../Componentes/sessionPage';

const Rutas = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="Eventos" element={<Eventos />} />
        <Route path="Perfil" element={<Perfil />} />
        <Route path="Register" element={<Register />} />
        <Route path="DetallesPerfil" element={<DetallesPerfil />} />
        <Route path="Login" element={<Login />} />
        <Route path="EleccionB" element={<EleccionB />} />
        <Route path="eleccionb/:eventId" element={<EleccionB />} />
        <Route path="success" element={<SuccessPage />} />
      </Route>
    </Routes>
  );
};

export default Rutas;
