import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { db } from '../firebase/credentials';
import { getDoc, setDoc, doc } from "firebase/firestore";  
import './sessionPage.css'

export const QRE = () => {
  const [qrValue, setQrValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const uniqueId = `qr_${Date.now()}`;
    setQrValue(uniqueId);
  }, []); 

  const verifyQR = async () => {
    try {
      const qrDocRef = doc(db, 'qrcodes', qrValue);
      const qrDoc = await getDoc(qrDocRef);

      if (qrDoc.exists() && qrDoc.data().used) {
        setMessage('Tus boletos ya han sido escaneados.');
      } else {
        await setDoc(qrDocRef, { used: true }, { merge: true });
        setMessage('Tus boletos están disponibles.');
      }
    } catch (error) {
      console.error("Error verifying QR code: ", error);
    }
  };

  return (
    <div className="containeer">
      <h2>Codigo QR</h2>
      <div className="qrCode">
        <QRCode value={qrValue} />
      </div>
      <button className="verifyButtonn" onClick={verifyQR}>Verifica tus boletos</button>
      {message && <p className="messagee">{message}</p>}
    </div>
  );
};

export default QRE;