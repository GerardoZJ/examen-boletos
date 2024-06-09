import React, { useState } from 'react';
import './DesingRegister.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/credentials';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [numero, setNumero] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        nombre,
        correo,
        numero
      });

      setError(null);
      navigate('/Perfil');
    } catch (error) {
      setError(`Error al crear el usuario: ${error.message}`);
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <p>Crear una cuenta</p>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            placeholder="Ingresa tu nombre" 
            className="form-input" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo" className="form-label">Correo:</label>
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
          <label htmlFor="numero" className="form-label">Número de Teléfono:</label>
          <input 
            type="tel" 
            id="numero" 
            name="numero" 
            placeholder="Ingresa tu número de teléfono" 
            className="form-input" 
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contrasena" className="form-label">Contraseña:</label>
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

        <div className="form-group">
          <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña:</label>
          <input 
            type="password" 
            id="confirmarContrasena" 
            name="confirmarContrasena" 
            placeholder="Confirma tu contraseña" 
            className="form-input" 
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
          />
        </div>

        <button type="submit" className="register-button">Crear Cuenta</button>
      </form>
    </div>
  );
};

export default Register;