import React, { useState, useEffect } from 'react';
import 'react-data-table-component-extensions/dist/index.css';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, } from 'material-react-table';



const Chat = () => {
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

  // TABLE 2
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
      size: 220,
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
            <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => showDeleteHandler(row.original.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ) : null
        ),
      }),
  ];

// END TABLE 2

  return (
    <>
      <div className='p-2'>
        <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
          <h2 className='text-white'>Selamat datang di Chat page :)</h2>
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
        
      </div>
    </>
  );
};

export default Chat;
