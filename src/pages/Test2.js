import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import 'webrtc-adapter';
import 'react-data-table-component-extensions/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable, } from 'material-react-table';
import { Box, Button, colors } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Modal from 'react-modal';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [scannedData, setScannedData] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    console.log('MediaDevices didukung:', !!navigator.mediaDevices);
  }, []);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      // Kirim data ke API
      sendDataToApi(data);

      // Update scanned data
      setScannedData((prevData) => [...prevData, parseScannedData(data)]);
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

  const parseScannedData = (data) => {
    // Implement parsing logic based on your data structure
    // For simplicity, assuming data is a comma-separated string
    const [no, id, name, description, brand, model, status, location, category, sn] = data.split(',');
    return { no, id, name, description, brand, model, status, location, category, sn };
  };

  const startScan = () => {
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
  };

  // Define your table columns
  const columns = [
    { Header: 'No', accessor: 'no' },
    { Header: 'ID Asset', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Brand', accessor: 'brand' },
    { Header: 'Model', accessor: 'model' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Location', accessor: 'location' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'SN', accessor: 'sn' },
  ];

  return (
    <div>
      <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
      <form>
        {scanning ? (
          <div>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '40%' }}
            />
            <button type="button" onClick={stopScan} style={{ position: 'absolute', top: 0, right: 0 }}>
              Close
            </button>
          </div>
        ) : null}
        <p>Hasil: {result}</p>
        <button type="button" onClick={startScan}>
          Start
        </button>
        <button type="submit">Submit</button>

        {/* Render the table with the scanned data */}
        <Table columns={columns} data={scannedData} />
      </form>
    </div>
  );
};

// Assume you have a simple Table component
const Table = ({ columns, data }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.accessor}>{column.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.accessor}>{row[column.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QRScanner;
