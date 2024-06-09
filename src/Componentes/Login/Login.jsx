import React, { useState, useEffect } from 'react';
import './DesingLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/credentials';
import { useAuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;
      setUser({ uid: user.uid, name: user.email }); // Ajusta esto según la estructura de tu usuario
      setError(null);
      navigate('/Perfil');
    } catch (error) {
      setError(`Error al iniciar sesión: ${error.message}`);
      console.error('Error signing in:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({ uid: user.uid, name: user.email });
        navigate('/Perfil');
      }
    });

    return () => unsubscribe();
  }, [setUser, navigate]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="login-title">Iniciar Sesion</p>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="Ingresa tu correo"
            className="form-input"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            placeholder="Ingresa tu contraseña"
            className="form-input"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Iniciar Sesion</button>
        <Link to="/Register" className="option-link">No tienes una cuenta?</Link>
      </form>
    </div>
  );
};

export default Login;