import React, { useEffect, useState } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';

const AddAsset = () => {
    const { token, Role, refreshAssetData, refreshStatusList, StatusOptions, refreshLocationList, LocationOptions, refreshCategoryList, CategoryOptions, setNotification, setNotificationStatus, setNotificationInfo } = useAuth();
    const [showStatus, setShowStatus] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [newStatus, setnewStatus] = useState("");
    const [newLocation, setnewLocation] = useState("");
    const [newCategory, setnewCategory] = useState("");
    const [addAssetID, setaddAssetID] = useState("");
    const [addAssetName, setaddAssetName] = useState("");
    const [addAssetDesc, setaddAssetDesc] = useState("");
    const [addAssetBrand, setaddAssetBrand] = useState("");
    const [addAssetModel, setaddAssetModel] = useState("");
    const [addAssetStatus, setaddAssetStatus] = useState("");
    const [addAssetLocation, setaddAssetLocation] = useState("");
    const [addAssetCategory, setaddAssetCategory] = useState("");
    const [addAssetSN, setaddAssetSN] = useState("");
    const [fileInput, setFileInput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


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
        refreshStatusList();
        refreshLocationList();
        refreshCategoryList();
        // eslint-disable-next-line
      },[]);


    const handleAddAsset = async (token) => {
      try {
        setIsLoading(true); // Atur status loading menjadi true
        const formData = new FormData();

        formData.append('addAssetID', addAssetID);
        formData.append('addAssetName', addAssetName);
        formData.append('addAssetDesc', addAssetDesc);
        formData.append('addAssetBrand', addAssetBrand);
        formData.append('addAssetModel', addAssetModel);
        formData.append('addAssetStatus', addAssetStatus);
        formData.append('addAssetLocation', addAssetLocation);
        formData.append('addAssetCategory', addAssetCategory);
        formData.append('addAssetSN', addAssetSN);

        if (fileInput) {
          formData.append('addAssetImage', fileInput); 
        }

        const response = await fetch("https://sipanda.online:8443/api/addasset", {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        });

        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          refreshAssetData();
          setaddAssetID('');
          setaddAssetName('');
          setaddAssetDesc('');
          setaddAssetBrand('');
          setaddAssetModel('');
          setaddAssetStatus('');
          setaddAssetLocation('');
          setaddAssetCategory('');
          setaddAssetSN('');
          setFileInput('');
          setFileInput(null);
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo('Error');
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false); // Atur status loading menjadi false
      }
    };
      

    const handleNewStatus = async (token) => {
      try {
        const response = await fetch("https://sipanda.online:8443/api/addstatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ newStatus }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          refreshStatusList();
          setnewStatus('');
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo('Error');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handleNewLocation = async (token) => {
      try {
        const response = await fetch("https://sipanda.online:8443/api/addlocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ newLocation }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          refreshLocationList();
          setnewLocation('');
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo('Error');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handleNewCategory = async (token) => {
      try {
        const response = await fetch("https://sipanda.online:8443/api/addcategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ newCategory }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          refreshCategoryList();
          setnewCategory('');
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo('Error');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Fungsi untuk menampilkan tabel dan menyembunyikan formulir
    const showStatusHandler = () => {
        setShowStatus((prev) => !prev);
        setShowLocation(false);
        setShowCategory(false);
    };
    const showLocationHandler = () => {
        setShowStatus(false);
        setShowLocation((prev) => !prev);
        setShowCategory(false);
    };
    const showCategoryHandler = () => {
        setShowStatus(false);
        setShowLocation(false);
        setShowCategory((prev) => !prev);
    };

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Add an Asset page :)</h2>
                </div>
            </div>

            {showStatus && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                        <h1 className="text-2xl font-semibold">Select Action</h1>
                        <p>Silahkan masukan Status yang ingin ditambahkan</p>
                    </div>
                    <div className='form-group'>
                        <label className='label-text'>Status</label>
                        <input 
                        className='form-input pl-5' 
                        placeholder='Masukan Status' 
                        value={newStatus}
                        onChange={(e) => setnewStatus(e.target.value)}
                        required
                        />
                    </div>
                    <div className="flex space-x-4 mt-5 mb-2">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showStatusHandler}>Cancel</button>
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleNewStatus(token)}>Tambah</button>
                    </div>
                </div>
            </div>
            )}

            {showLocation && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                        <h1 className="text-2xl font-semibold">Select Action</h1>
                        <p>Silahkan masukan Lokasi yang ingin ditambahkan</p>
                    </div>
                    <div className='form-group'>
                        <label className='label-text'>Location</label>
                        <input 
                        className='form-input pl-5' 
                        placeholder='Masukan Lokasi' 
                        value={newLocation}
                        onChange={(e) => setnewLocation(e.target.value)}
                        required
                        />
                    </div>
                    <div className="flex space-x-4 mt-5 mb-2">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showLocationHandler}>Cancel</button>
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleNewLocation(token)}>Tambah</button>
                    </div>
                </div>
            </div>
            )}

            {showCategory && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                        <h1 className="text-2xl font-semibold">Select Action</h1>
                        <p>Silahkan masukan Kategori yang ingin ditambahkan</p>
                    </div>
                    <div className='form-group'>
                        <label className='label-text'>Category</label>
                        <input 
                        className='form-input pl-5' 
                        placeholder='Masukan Category' 
                        value={newCategory}
                        onChange={(e) => setnewCategory(e.target.value)}
                        required
                        />
                    </div>
                    <div className="flex space-x-4 mt-5 mb-2">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showCategoryHandler}>Cancel</button>
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleNewCategory(token)}>Tambah</button>
                    </div>
                </div>
            </div>
            )}
            
            <div className='p-2'>
                <div className='p-2 bg-white rounded-xl'>
                    <form>
                        <div className='form-group'>
                            <label className='label-text'>Asset ID</label>
                            <input 
                            className='form-input' 
                            placeholder='Masukan Asset ID'
                            value={addAssetID}
                            onChange={(e) => setaddAssetID(e.target.value)} 
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Asset Name</label>
                            <input 
                            className='form-input' 
                            placeholder='Masukan Asset Name' 
                            value={addAssetName}
                            onChange={(e) => setaddAssetName(e.target.value)} 
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Description</label>
                            <input 
                            className='form-input' 
                            placeholder='Masukan Deskripsi Asset' 
                            value={addAssetDesc}
                            onChange={(e) => setaddAssetDesc(e.target.value)} 
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Brand</label>
                            <input 
                            className='form-input' 
                            placeholder='Masukan Brand Asset' 
                            value={addAssetBrand}
                            onChange={(e) => setaddAssetBrand(e.target.value)} 
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Model</label>
                            <input 
                            className='form-input' 
                            placeholder='Masukan Model Asset'
                            value={addAssetModel}
                            onChange={(e) => setaddAssetModel(e.target.value)}  
                            required
                            />
                        </div>
                        <div class="form-group">
                            <label class="label-text">Status</label>
                            <div class="kategori-container">
                                <div className="dropdown-container">
                                    <select 
                                    class="category-dropdown" 
                                    id="statusDropdown" 
                                    name="status" 
                                    value={addAssetStatus}
                                    onChange={(e) => setaddAssetStatus(e.target.value)}  
                                    required
                                    >
                                        <option value="" className='' disabled selected>Select Status</option>
                                        {StatusOptions.map((status) => (
                                            <option key={status.id} value={status.status}>
                                              {status.status}
                                            </option>
                                        ))}
                                    </select>
                                    {Role === 2 && (
                                        <button type="button" className='addtoggle-btn' onClick={showStatusHandler}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    )}
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
                                    value={addAssetLocation}
                                    onChange={(e) => setaddAssetLocation(e.target.value)}  
                                    required
                                    >
                                        <option value="" disabled selected>Select Location</option>
                                        {LocationOptions.map((location) => (
                                            <option key={location.id} value={location.location}>
                                              {location.location}
                                            </option>
                                        ))}
                                    </select>
                                    {Role === 2 && (
                                        <button type="button" className='addtoggle-btn' onClick={showLocationHandler}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="label-text">Category</label>
                            <div class="kategori-container">
                                <div class="dropdown-container">
                                    <select 
                                    class="category-dropdown" 
                                    id="statusDropdown" 
                                    name="status" 
                                    value={addAssetCategory}
                                    onChange={(e) => setaddAssetCategory(e.target.value)} 
                                    required
                                    >
                                        <option value="" disabled selected>Select Category</option>
                                        {CategoryOptions.map((category) => (
                                            <option key={category.id} value={category.category}>
                                              {category.category}
                                            </option>
                                        ))}
                                    </select>
                                    {Role === 2 && (
                                        <button type="button" className='addtoggle-btn' onClick={showCategoryHandler}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Serial Number</label>
                            <input 
                            className='form-input' 
                            placeholder='Masukan Serial Number'
                            value={addAssetSN}
                            onChange={(e) => setaddAssetSN(e.target.value)}  
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label for="photo_asset" class="label-text">Photo</label>
                            <input type="file" class="form-input" id="photo_asset" name="photo" accept="image/*" onChange={handleImageChange}/>
                        </div>
                        <div className='flex justify-end gap-1 mb-3 p-2'>
                            <button type="button" className='main-btn' id="edit-button" onClick={() => handleAddAsset(token)} disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Asset'}</button>
                        </div>
                    </form>
                </div>
            </div>            
        </>
    )
}
export default AddAsset