import React, { useEffect, useState } from 'react';
import './DesingHome.css';
import EventImage from './EventImage';
import { db } from '../../../firebase/credentials';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [newEvents, setNewEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const newEventsCollection = collection(db, 'eventos');
        const newEventsSnapshot = await getDocs(newEventsCollection);
        const newEventsList = newEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setNewEvents(newEventsList);
        setPastEvents(pastEventsList);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };

    fetchEvents();
  }, []);


  return (
    <div className="container">
      <div className="bottom-box1">
        <div className="events-container">
          <p className="past-events">Eventos Nuevos</p>
          <div className="image-grid">
            {newEvents.map(event => (
              <EventImage 
                key={event.id} 
                event={event} 
                fecha={event.fecha}
                hora={event.hora}
                lugar={event.lugar}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>Promotora deportiva, especialista en Box y Lucha Libre Profesional</p>
            <p>Promotor deportivo</p>
            <p>San Luis Río Colorado, Sonora, México</p>
            <p>Correo: loschavas200980@gmail.com</p>
          </div>
          <a href="https://www.facebook.com/profile.php?id=100063469895455" target="_blank" rel="noopener noreferrer">
            <img className="facebook-icon" src="https://cdn.pixabay.com/photo/2020/08/25/02/16/facebook-5515461_1280.png" alt="Facebook Icon" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
