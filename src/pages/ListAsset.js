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

const ListAsset = () => {
  const { token, Role, DataListAsset, refreshAssetData, refreshStatusList, StatusOptions, LocationOptions, refreshLocationList, refreshCategoryList, CategoryOptions } = useAuth();
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

    fetch(`http://sipanda.online:5000/api/edit-asset/${selectedAsset.no}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          setShowEdit(false);
          refreshAssetData();
        } else {
          console.error('Failed to edit asset');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };  

  const deleteAsset = (id) => {
    fetch(`http://sipanda.online:5000/api/delete-asset/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setShowDelete(false);
          refreshAssetData();
        } else {
          console.error('Failed to delete asset');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
  
  
  const showEditHandler = (row) => {
    setSelectedAsset(row);
    setShowEdit(true);
    setShowDelete(false);
  };

  const hideEditHandler = () => {
    setSelectedAsset(null);
    setShowEdit(false);
  };

  const showDeleteHandler = (id) => {
    setSelectedAssetId(id);
    setShowEdit(false);
    setShowDelete(true);
  };

  const hideDeleteHandler = () => {
    setShowDelete(false);
  };

  const columns = [
    {
      name: 'No',
      selector: (row) => row.no,
      export: true,
    },
    {
      name: 'ID Asset',
      selector: (row) => row.id,
      export: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      export: true,
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      export: true,
    },
    {
      name: 'Brand',
      selector: (row) => row.brand,
      export: true,
    },
    {
      name: 'Model',
      selector: (row) => row.model,
      export: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      export: true,
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      export: true,
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      export: true,
    },
    {
      name: 'SN',
      selector: (row) => row.sn,
      export: true,
    },
    {
      name: 'Photo',
      selector: 'photo',
      cell: (row) => {
        return (
          <div>
            <img src={row.image_path} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
          </div>
        );
      },
      export: true,
    },
    {
      name: 'Action',
      omit: Role !== 2,
      export: false,
      selector: 'action',
      cell: (row) => (
        Role === 2 ? (
          <div className='text-white'>
            <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => showEditHandler(row)}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => showDeleteHandler(row.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ) : null
      ),
    },
  ];

  const fakedata1 = [
    { no: '2', id: 'ASSET0002', name: 'Monitor', description: 'Ultra HD', brand: 'Dell', model: 'U2719D', status: 'Available', location: 'LMD', category: 'monitor', sn: '453434343', photo: '', },
    { no: '3', id: 'ASSET0003', name: 'Keyboard', description: 'Mechanical', brand: 'Logitech', model: 'G Pro X', status: 'Available', location: 'LMD', category: 'keyboard', sn: '876543210', photo: '', },
    { no: '4', id: 'ASSET0004', name: 'Mouse', description: 'Wireless', brand: 'Logitech', model: 'MX Master 3', status: 'Available', location: 'LMD', category: 'mouse', sn: '112233445', photo: '', },
    { no: '5', id: 'ASSET0005', name: 'Desk', description: 'Wooden', brand: 'IKEA', model: 'Linnmon', status: 'Available', location: 'LMD', category: 'furniture', sn: '998877665', photo: '' },
    { no: '6', id: 'ASSET0006', name: 'Printer', description: 'Color LaserJet', brand: 'HP', model: 'LaserJet Pro M454dw', status: 'Available', location: 'LMD', category: 'printer', sn: '998877665', photo: '', },
    { no: '7', id: 'ASSET0007', name: 'Chair', description: 'Ergonomic', brand: 'Steelcase', model: 'Gesture', status: 'Available', location: 'LMD', category: 'furniture', sn: '334455667', photo: '',  },
    { no: '8', id: 'ASSET0008', name: 'Projector', description: 'HD', brand: 'Epson', model: 'PowerLite 1781W', status: 'Available', location: 'LMD', category: 'projector', sn: '009988776', photo: '',  },
    { no: '9', id: 'ASSET0009', name: 'Scanner', description: 'Flatbed', brand: 'Canon', model: 'CanoScan LiDE 300', status: 'Available', location: 'LMD', category: 'scanner', sn: '667788990', photo: '',  },
    { no: '10', id: 'ASSET0010', name: 'Headphones', description: 'Over-Ear', brand: 'Sony', model: 'WH-1000XM4', status: 'Available', location: 'LMD', category: 'headphones', sn: '554433221', photo: '', },
  ]

  const filteredData = fakedata1.map(item => {
    return {
      no: item.no,
      id: item.id,
      name: item.name,
      description: item.description,
      brand: item.brand,
      model: item.model,
      status: item.status,
      location: item.location,
      category: item.category,
      sn: item.sn,
      photo: item.photo,
      action: item.action
    }
  })

  const columnsWithout = columns.filter(column => column.selector !== 'photo' && column.selector !== 'action');
  const headersWithout = columnsWithout.map(column => ({ label: column.name, key: column.selector }));

  const customElement = (
    <button onClick={() => alert('Tombol Kustom Ditekan')}>Tombol Kustom</button>
  );
  
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


      
      <div className='p-2'>
        <div>
        <DataTableExtensions
          columns={columns}
          data={DataListAsset}
          // fileName='hehe'
          filter
          print={true}
          export={true}
          exportHeaders={true}
          filterPlaceholder='Filter Data'
        >
          
          <DataTable
            noHeader
            defaultSortField='no'
            defaultSortAsc={false}
            pagination
            highlightOnHover
          />
        </DataTableExtensions>
        </div>
        
      </div>
    </>
  );
};

export default ListAsset;
