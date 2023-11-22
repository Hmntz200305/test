import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import 'webrtc-adapter';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable, } from 'material-react-table';
import { Box, Button, colors } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Modal from 'react-modal';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";


const editAsset = async (token) => {
  const formData = new FormData();

  formData.append('id', selectedAsset.id);
  formData.append('name', selectedAsset.name);
  formData.append('description', selectedAsset.description);
  formData.append('brand', selectedAsset.brand);
  formData.append('model', selectedAsset.model);
  formData.append('status', selectedAsset.status);
  formData.append('location', selectedAsset.location);
  formData.append('category', selectedAsset.category);
  formData.append('sn', selectedAsset.sn);

  if (fileInput) {
    formData.append('addAssetImage', fileInput); 
  }

  try {
    const response = await fetch(`http://103.148.77.238/api/edit-asset/${selectedAsset.no}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: formData,
    });
    
    if (response.status === 200) {
      const data = await response.json();
      setNotification(data.message);
      setNotificationStatus(true);
      setShowEdit(false);
      refreshAssetData();
    } else {
      const data = await response.json();
      setNotification(data.message);
      setNotificationStatus(true);
      setNotificationInfo('Error');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


const columnHelper = createMRTColumnHelper();
const columnsNew = [
  columnHelper.accessor('no', {
    header: 'No',
    size: 40,
  }),
  columnHelper.accessor('id', {
    header: 'ID Asset',
    size: 120,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    size: 120,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    size: 300,
  }),
  columnHelper.accessor('brand', {
    header: 'Brand',
  }),
  columnHelper.accessor('model', {
    header: 'Model',
    size: 220,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 220,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 220,
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    size: 220,
  }),
  columnHelper.accessor('sn', {
    header: 'SN',
    size: 220,
  }),
  columnHelper.accessor('image_path', {
    header: 'Photo',
    size: 200,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => (
      <img src={row.original.image_path} alt="Asset" style={{ width: '70px', height: 'auto' }} />
    ),
  }),
  columnHelper.accessor('action', {
    header: Role === 2 ? 'Action' : '',
    omit: Role !== 2,
    size: 120,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({row}) => (
      Role === 2 ? (
        <div className='text-white'>
          <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => showEditHandler(row.original)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => showDeleteHandler(row.original.no)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ) : null
      ),
    }),
];

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
