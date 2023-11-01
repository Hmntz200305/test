import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import foto from '../resources/img/aset2.jpg';
import { faDownload, faFileCsv, faFileExport, faUpload, faFileImport, faPenToSquare, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { CSVLink } from 'react-csv';
import { useDropzone } from 'react-dropzone';

// 
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable, } from 'material-react-table';
import { Box, Button, colors } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';


const ListAsset = () => {
  const { token, Role, DataListAsset, refreshAssetData, refreshStatusList, StatusOptions, LocationOptions, refreshLocationList, refreshCategoryList, CategoryOptions, setNotification, setNotificationInfo, setNotificationStatus } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (allowedExtensions.test(file.name)) {
        setFileInput(file);
      } else {
        alert('Invalid file type. Please select a valid image file.');
        e.target.value = null;
        setFileInput(null);
      }
    }
  };  

  useEffect(() => {
    refreshAssetData();
    refreshStatusList();
    refreshLocationList();
    refreshCategoryList();
    // eslint-disable-next-line
  }, []);

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
      const response = await fetch(`http://sipanda.online:5000/api/edit-asset/${selectedAsset.no}`, {
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
    
  const deleteAsset = async (id) => {
    try {
      const response = await fetch(`http://sipanda.online:5000/api/delete-asset/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setNotification(data.message);
        setNotificationStatus(true);
        setShowDelete(false);
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
  };

  const [uploadedFile, setUploadedFile] = useState(null);
  const handleUpload = (acceptedFiles) => {
    // Mengambil file yang diunggah dan mengatur state uploadedFile
    const file = acceptedFiles[0];
    setUploadedFile(file);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleUpload,
    multiple: false, // Hanya izinkan unggah satu file
    accept: '.csv, .xlsx',
  });


  const handleDownload = () => {
    // Membuat URL sumber file yang akan diunduh
    const fileURL = 'http://sipanda.online:5000/static/template/MyReport.csv'; // Gantilah dengan URL file yang sesuai
    
    // Membuat anchor element
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = 'MyReport.csv'; // Gantilah dengan nama file yang sesuai
    document.body.appendChild(a);
    
    // Mengklik tombol secara otomatis untuk memulai unduhan
    a.click();
    
    // Menghapus anchor element dari dokumen
    document.body.removeChild(a);
};


  // NEW TABLE
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
    header: 'Action',
    size: 120,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({row}) => (
      <div className='text-white'>
        <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5'>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5'>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      ),
    }),
];


// END NEW TABLE

  return (
    <>
      <div className='p-2'>
        <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
          <h2 className='text-white'>Selamat datang di List of Asset page :)</h2>
        </div>
      </div>


        <div className='mt-10'>
          <MaterialReactTable
              columns={columnsNew}
              data={DataListAsset}
              enableRowSelection={true}
              enableClickToCopy={false}
              columnFilterDisplayMode= 'popover'
              paginationDisplayMode= 'pages'
              positionToolbarAlertBanner= 'bottom'
          />
        </div>
        
    </>
  );
};

export default ListAsset;
