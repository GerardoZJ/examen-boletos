import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import './DesingItemCard.css'; 
import { db } from '../../../firebase/credentials';
import { doc, getDoc } from "firebase/firestore";

const stripePromise = loadStripe('pk_test_51OwWETP0nhGqtxkR57T7dDnLPsm5wSwKeneyPEAMd2tbzjRzkeHxKsAgX8z0N96tjYMddFnDmXgN6otiL1VVaAQJ00VqSHaDU5');

const EleccionB = () => {
  const location = useLocation();
  const { event } = location.state;
  const stripe = useStripe();
  const elements = useElements();

  const [selectedTickets, setSelectedTickets] = useState({
    vip: 0,
    gold: 0,
    general: 0
  });

  const [ticketPricesIds, setTicketPricesIds] = useState({
    vip: [],
    gold: [],
    general: []
  });

  useEffect(() => {
    const fetchTicketPricesIds = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'eventos', event.id));
        if (eventDoc.exists) {
          const preciosBoletosIds = eventDoc.data().precios_boletos_ids;
          if (preciosBoletosIds) {
            setTicketPricesIds(preciosBoletosIds);
          } else {
            console.log('No se encontraron IDs de precios de boletos en el documento del evento');
          }
        } else {
          console.log('No se encontró el documento del evento');
        }
      } catch (error) {
        console.error('Error obteniendo IDs de precios de boletos:', error);
      }
    };

    fetchTicketPricesIds();
  }, [event.id]);

  const handleCheckboxChange = (ticketType) => {
    setSelectedTickets((prevSelectedTickets) => ({
      ...prevSelectedTickets,
      [ticketType]: prevSelectedTickets[ticketType] > 0 ? 0 : 1,
    }));
  };

  const handleQuantityChange = (ticketType, increment) => {
    setSelectedTickets((prevSelectedTickets) => ({
      ...prevSelectedTickets,
      [ticketType]: Math.max(prevSelectedTickets[ticketType] + increment, 0),
    }));
  };

  const handleBuyTicket = async () => {
    if (!stripe) return;

    const lineItems = Object.entries(selectedTickets)
      .filter(([ticketType, quantity]) => quantity > 0)
      .map(([ticketType, quantity]) => {
        const price = ticketPricesIds[ticketType]?.[0]; 
        if (!price) {
          console.error(`No se encontró un precio válido para el tipo de boleto: ${ticketType}`);
          return null;
        }
        return {
          price: price,
          quantity: quantity,
        };
      })
      .filter(lineItem => lineItem !== null); 

    if (lineItems.length === 0) {
      alert('Seleccione al menos un boleto con una cantidad válida.');
      return;
    }

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: 'payment',
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/cancel',
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error en la redirección al checkout:', error);
    }
  };

  const totalTickets = Object.values(selectedTickets).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="ItemCardContainer">
      <div className="ItemCardWrapper">
        <div className="ItemCard">
          <img
            src={event.imagen}
            alt="Event"
            className="ItemCardImage"
          />
          <div className="ItemCardDetails">
            <h2>{event.title}</h2>
            <p>Lugar: {event.lugar}</p>
            <p>Fecha: {event.fecha}</p>
            <p>Hora: {event.hora}</p>
            <div className="TicketOptions">
              {['general', 'gold', 'vip'].map(type => (
                <div className="TicketOption" key={type}>
                  <label>
                    <input className='checkbox'
                      type="checkbox"
                      checked={selectedTickets[type] > 0}
                      onChange={() => handleCheckboxChange(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                  {selectedTickets[type] > 0 && (
                    <div className="CountControl">
                      <button className="CountButton" onClick={() => handleQuantityChange(type, -1)}>-</button>
                      <input type="text" value={selectedTickets[type]} readOnly className="CountInput" />
                      <button className="CountButton" onClick={() => handleQuantityChange(type, 1)}>+</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="TotalTickets">
              <p>Cantidad: {totalTickets}</p>
              <button className="DetailButton" onClick={handleBuyTicket}>
                Comprar Boletos
              </button>
            </div>
            <div className="ItemCardButtons">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StripeWrapper = () => (
  <Elements stripe={stripePromise}>
    <EleccionB />
  </Elements>
);

export default StripeWrapper;
