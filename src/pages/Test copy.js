import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import 'webrtc-adapter';

const QRScanner = () => {
  const [result, setResult] = useState('');

  useEffect(() => {
    console.log('MediaDevices supported:', !!navigator.mediaDevices);
  }, []);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      // Kirim data ke API
      sendDataToApi(data);
    } else {
      console.log('Tidak ada data terdeteksi.');
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const sendDataToApi = (data) => {
    // Implementasi pengiriman data ke API
    console.log('Data terbaca:', data);
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>Hasil: {result}</p>
    </div>
  );
};

export default QRScanner;
