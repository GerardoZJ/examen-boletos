import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './DesingPerfil.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { signOut, getAuth } from 'firebase/auth';

const Perfil = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      navigate('/Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal((prev) => !prev);
  };

  return (
    <div className="PerfilContainer">
      <div className="Perfil">
        <h1>Bienvenido!</h1>
        <h1>{user.name}</h1>
        <div className="separator" />
        <div>
          <FaUser /> Perfil
          <Link to="/DetallesPerfil">Detalles de Perfil</Link>
        </div>
      </div>
      <button className="cerrarSesionButton" onClick={toggleLogoutModal}>
        Cerrar Sesión
      </button>
      {showLogoutModal && (
        <div className="logout-modal">
          <p>¿Estás seguro de que quieres cerrar sesión?</p>
          <div className="modal-buttons">
            <button onClick={handleLogout}>Cerrar Sesión</button>
            <button onClick={toggleLogoutModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;