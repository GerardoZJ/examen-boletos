import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/credentials';
import styles from './DesingDetalles.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetallesPerfil = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    correo: '',
    numero: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFormValues({
            nombre: data.nombre || '',
            correo: data.correo || '',
            numero: data.numero || ''
          });
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, formValues);
      toast.success('¡Tus datos se actualizaron correctamente!', {
        position: toast.POSITION.TOP_CENTER
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      toast.error('¡Ocurrió un error al actualizar tus datos!', {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  if (!user) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Detalles Del Perfil</h2>
      {userData && (
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formValues.nombre}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formValues.correo}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="numero">Número de Teléfono:</label>
            <input
              type="tel"
              id="numero"
              name="numero"
              value={formValues.numero}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.updateButton}>Actualizar Datos</button>
        </form>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default DetallesPerfil;
