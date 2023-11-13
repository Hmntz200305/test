import React, { useState, useEffect, useRef } from 'react';
import 'react-data-table-component-extensions/dist/index.css';
import { faDownload, faFileCsv, faFileExport, faUpload, faFileImport, faPenToSquare, faPrint, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { useDropzone } from 'react-dropzone';
// 
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable, } from 'material-react-table';
import { Box, Button, colors } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataGrid } from '@mui/x-data-grid';
import Modal from 'react-modal';
import { Popover, PopoverHandler, PopoverContent, } from "@material-tailwind/react";
Modal.setAppElement('#root');

const ListAsset = () => {
  const { token, Role, DataListAsset, refreshAssetData, refreshStatusList, StatusOptions, LocationOptions, refreshLocationList, refreshCategoryList, CategoryOptions, setNotification, setNotificationInfo, setNotificationStatus } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [openCsvPopover, setOpenCsvPopover] = useState(false);
  const [openPdfPopover, setOpenPdfPopover] = useState(false);
  const tableRef = useRef(null)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const showEditHandler = (row) => {
    setSelectedAsset(row);
    setShowEdit(true);
    setShowDelete(false);
  };

  const hideEditHandler = () => {
    setSelectedAsset(null);
    setShowEdit(false);
  };

  const showDeleteHandler = (no) => {
    setSelectedAssetId(no);
    setShowEdit(false);
    setShowDelete(true);
  };

  const hideDeleteHandler = () => {
    setShowDelete(false);
  };

  const showExportHandler = () => {
    setShowExport((prev) => !prev);
  };

  const triggersCsv = {
    onMouseEnter: () => setOpenCsvPopover(true),
    onMouseLeave: () => setOpenCsvPopover(false),
  };
  const triggersPdf = {
    onMouseEnter: () => setOpenPdfPopover(true),
    onMouseLeave: () => setOpenPdfPopover(false),
  };
  
  useEffect(() => {
    refreshAssetData();
    refreshStatusList();
    refreshLocationList();
    refreshCategoryList();
    // eslint-disable-next-line
  }, []);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setNotification('Pilih File');
      setNotificationStatus(true);
      setNotificationInfo('Error');
      return;
    }
  
    const formData = new FormData();
    
    formData.append('csvFile', selectedFile);
  
    try {
      const response = await fetch('http://sipanda.online:5000/api/importcsv', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        refreshAssetData();
        setNotification(data.message);
        setNotificationStatus(true);
        closeModalImportHandler();
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

const handleExportRowsCsv = (rows) => {
  const rowData = rows.map((row) => {
    const dataRow = row.original;
    return {
      no: dataRow.no,
      id: dataRow.id,
      name: dataRow.name,
      description: dataRow.description,
      brand: dataRow.brand,
      model: dataRow.model,
      status: dataRow.status,
      location: dataRow.location,
      category: dataRow.category,
      sn: dataRow.sn,
    };
  });

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const csv = generateCsv(csvConfig)(rowData);
  download(csvConfig)(csv);
};


  const handleExportRowsPdf = (rows) => {
  const doc = new jsPDF();
  const tableData = rows.map((row) => {
    const dataRow = row.original;
    return [dataRow.no, dataRow.id, dataRow.name, dataRow.description, dataRow.brand, dataRow.model, dataRow.status, dataRow.location, dataRow.category, dataRow.sn,];
  });

  const tableHeaders = ['No', 'ID Asset', 'Name', 'Description', 'Brand', 'Model', 'Status', 'Location', 'Category', 'Serial Number'];

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
  });

  doc.save('mrt-pdf-example.pdf');
};
  // END NEW TABLE`


  // MODAL
  const [showModalImport, setShowModalImport] = useState(false);

    const showModalImportHandler = () => {
        setShowModalImport(true);
      };
    const closeModalImportHandler = () => {
        setShowModalImport(false);
    };


  return (
    <>
      <div className='p-2'>
        <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
          <h2 className='text-white'>Selamat datang di List of Asset page :)</h2>
        </div>
      </div>



      {showEdit && (
        <div className='p-2'>
            <div className='p-2 rounded-xl bg-white shadow-xl'> 
                <div className='form-group'>
                    <label className='label-text'>Asset ID</label>
                    <input 
                    className='form-input' 
                    placeholder='Masukan Asset ID' 
                    value={selectedAsset?.id}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, id: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <label className='label-text'>Asset Name</label>
                    <input 
                    className='form-input' 
                    placeholder='Masukan Asset Name' 
                    value={selectedAsset?.name}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, name: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <label className='label-text'>Description</label>
                    <input 
                    className='form-input' 
                    placeholder='Masukan Asset Deskripsi' 
                    value={selectedAsset?.description}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, description: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <label className='label-text'>Brand</label>
                    <input 
                    className='form-input' 
                    placeholder='Masukan Asset Brand' 
                    value={selectedAsset?.brand}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, brand: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <label className='label-text'>Model</label>
                    <input 
                    className='form-input' 
                    placeholder='Masukan Model Asset' 
                    value={selectedAsset?.model}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, model: e.target.value })}
                    />
                </div>
                <div class="form-group">
                    <label class="label-text">Status</label>
                    <div class="kategori-container">
                        <div class="dropdown-container">
                            <select 
                            class="category-dropdown" 
                            id="statusDropdown" 
                            name="status" 
                            value={selectedAsset?.status}
                            onChange={(e) => setSelectedAsset({ ...selectedAsset, status: e.target.value })}
                            required
                            >
                                <option value="" disabled selected>Pilih Status</option>
                                {StatusOptions.map((status) => (
                                    <option key={status.id} value={status.status}>
                                      {status.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="label-text">Location</label>
                    <div class="kategori-container">
                        <div class="dropdown-container">
                            <select 
                            class="category-dropdown" 
                            id="statusDropdown" 
                            name="status"
                            value={selectedAsset?.location}
                            onChange={(e) => setSelectedAsset({ ...selectedAsset, location: e.target.value })} 
                            required
                            >
                                <option value="" disabled selected>Pilih Lokasi</option>
                                {LocationOptions.map((location) => (
                                    <option key={location.id} value={location.location}>
                                      {location.location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="label-text">kategori</label>
                    <div class="kategori-container">
                        <div class="dropdown-container">
                            <select 
                            class="category-dropdown" 
                            id="statusDropdown" 
                            name="status" 
                            value={selectedAsset?.category}
                            onChange={(e) => setSelectedAsset({ ...selectedAsset, category: e.target.value })} 
                            required
                            >
                                <option value="" disabled selected>Pilih Kategori</option>
                                {CategoryOptions.map((category) => (
                                    <option key={category.id} value={category.category}>
                                      {category.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='label-text'>Serial Number</label>
                    <input 
                    className='form-input' 
                    placeholder='Masukan Serial Number' 
                    value={selectedAsset?.sn}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, sn: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <label for="photo_asset" class="label-text">Photo</label>
                    <input type="file" class="form-input" id="photo_asset" name="photo" accept="image/*" onChange={handleImageChange}/>
                </div>
                <div className='flex justify-end gap-1'>
                    <button type="button" className='main-btn' id="edit-button" onClick={hideEditHandler}>Cancel</button>
                    <button
                      type="button"
                      className="main-btn"
                      id="edit-button"
                      onClick={() => editAsset(token)}
                    >
                        Edit Asset
                    </button>

                </div>
            </div>
        </div>
        )}

      {showDelete && (
        <div className='p-2'>
          <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
            <div className='flex flex-col text-center mb-2'>
              <h1 className="text-2xl font-semibold">Select Action</h1>
              <p>Apakah anda yakin ingin menghapus Asset ini?</p>
            </div>
            <div className="flex space-x-4 mt-5">
              <button className="main-btn hover-bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={hideDeleteHandler}>
                Cancel
              </button>
              <button className="main-btn hover-bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => deleteAsset(selectedAssetId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT */}
      <div className='p-2 flex space-x-2 items-center'>
        <button className='main-btn' onClick={showModalImportHandler}>Import</button>
        <Modal 
          isOpen={showModalImport}
          onRequestClose={closeModalImportHandler}
          contentLabel="Contoh Modal"
          overlayClassName="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 flex items-center justify-center"
          className="modal-content bg-white w-1/2 p-4 rounded shadow-md"
          shouldCloseOnOverlayClick={false}
        >
          <div className='flex flex-col gap-1'>
              <button className='main-btn' onClick={handleDownload}>Download</button>
              <div class="flex items-center justify-center w-full">
                  <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-800 border-dashed rounded-lg cursor-pointer bg-gray-800 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div class="flex flex-col items-center justify-center pt-5 pb-6 px-2">
                          <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">Only XLSX (MAX. 5MB)</p>
                      </div>
                      <input className='' id="dropzone-file" type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
                  </label>
              </div>
              <button className='main-btn' onClick={handleFileUpload}>Upload</button>
          </div>
          <button className='main-btn mt-2' onClick={closeModalImportHandler}>Close</button>
        </Modal>
      </div>

      {/* EKSPORT */}
      <div className='flex space-x-4'>
        <div className='flex items-center py-8'>
          <button className='main-btn' onClick={showExportHandler}>Export</button>
        </div>
        {showExport && (
        <div className='flex flex-col space-y-1'>
            <Popover open={openCsvPopover} handler={setOpenCsvPopover} placement='right' animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
            <div className='flex'>
              <PopoverHandler {...triggersCsv}>
                <button className='main-btn'>
                  <FontAwesomeIcon icon={faFileCsv} size='xl' />
                </button>
              </PopoverHandler>
              <PopoverContent {...triggersCsv} className='bg-[#efefef] z-50 shadow-none py-0.5 px-2 border-none'>
                <div className='flex gap-2'>
                <Button
                    disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0}
                    onClick={() => handleExportRowsCsv(tableRef.current?.getPrePaginationRowModel().rows)}
                  >
                    All Rows
                  </Button>

                  <Button
                    disabled={tableRef.current?.getRowModel().rows.length === 0}
                    onClick={() => handleExportRowsCsv(tableRef.current?.getRowModel().rows)}
                  >
                    Page Rows
                  </Button>

                  <Button
                    disabled={
                      !tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()
                    }
                    onClick={() => handleExportRowsCsv(tableRef.current?.getSelectedRowModel().rows)}
                  >
                    Selected Rows
                  </Button>
                </div>
              </PopoverContent>
            </div>
            </Popover>
            <Popover open={openPdfPopover} handler={setOpenPdfPopover} placement='right' animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
            <div className='flex'>
              <PopoverHandler {...triggersPdf}>
                <button className='main-btn'>
                  <FontAwesomeIcon icon={faFilePdf} size='xl' />
                </button>
              </PopoverHandler>
              <PopoverContent {...triggersPdf} className='bg-[#efefef] z-50 shadow-none py-0.5 border-none px-2'>
                <div className='flex gap-2'>
                <Button
            disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0}
            onClick={() => handleExportRowsPdf(tableRef.current?.getPrePaginationRowModel().rows)}
          >
            All Rows
          </Button>

          <Button
            disabled={tableRef.current?.getRowModel().rows.length === 0}
            onClick={() => handleExportRowsPdf(tableRef.current?.getRowModel().rows)}
          >
            Page Rows
          </Button>

          <Button
            disabled={
              !tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()
            }
            onClick={() => handleExportRowsPdf(tableRef.current?.getSelectedRowModel().rows)}
          >
            Selected Rows
          </Button>
                </div>
              </PopoverContent>
            </div>
            </Popover>
        </div>
        )}
      </div>

      <div className='p-2'>
        <div className='mt-10'>
          <MaterialReactTable
              columns={columnsNew}
              data={DataListAsset}
              enableRowSelection={true}
              enableClickToCopy={false}
              columnFilterDisplayMode= 'popover'
              paginationDisplayMode= 'pages'
              positionToolbarAlertBanner= 'bottom'
              renderTopToolbarCustomActions= {({ table }) => {
                tableRef.current = table;
                return null; 
              }}
          />
        </div>
      </div>
    </>
  );
};

export default ListAsset;
