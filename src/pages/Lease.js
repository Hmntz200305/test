import React, { useEffect, useState} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const Lease = () => {
    const { token, DataListAssetExcept, refreshAssetDataExcept, LocationOptions, refreshLocationList, refreshAdminList, AdminList, username, setNotification, setNotificationStatus } = useAuth();
    const [showTable, setShowTable] = useState(true);
    const [showFormulir, setShowFormulir] = useState(false);
    const [Name, setName] = useState('');
    const [Location, setLocation] = useState('');
    const [CheckoutDate, setCheckoutDate] = useState('');
    const [CheckinDate, setCheckinDate] = useState('');
    const [Email, setEmail] = useState(localStorage.getItem('email') || '');
    const [Note, setNote] = useState('');
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [selectedAssetsID, setSelectedAssetsID] = useState([]);
    const [selectedAdmin1, setSelectedAdmin1] = useState(''); // State untuk Admin 1
    const [selectedAdmin2, setSelectedAdmin2] = useState(''); // State untuk Admin 2
    const [isLoading, setIsLoading] = useState(false);

    

    useEffect(() => {
        refreshAssetDataExcept();
        refreshLocationList();
        refreshAdminList();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // Mengecek apakah sudah ada data pengguna
        if (username) {
          setName(username);
        }
      }, [username]);

    const handleRowSelected = (row) => {
        // Membersihkan semua aset yang ada dari `selectedAssets`
        setSelectedAssets([]);
        setSelectedAssetsID([]);
    
        // Menambahkan aset yang baru ke dalam `selectedAssets`
        setSelectedAssets([row]);
        setSelectedAssetsID([row.no]);  
    };
    
    const handleLeaseAsset = async (token) => {
        try {
          setIsLoading(true); // Atur status loading menjadi true
          const formData = new FormData();
  
          formData.append('AssetID', selectedAssetsID)
          formData.append('Name', Name);
          formData.append('CheckoutDate', CheckoutDate);
          formData.append('CheckinDate', CheckinDate);
          formData.append('Location', Location);
          formData.append('Email', Email);
          formData.append('Note', Note);
          formData.append('Admin1', selectedAdmin1)
          formData.append('Admin2', selectedAdmin2)
  
          const response = await fetch("http://sipanda.online:5000/api/leaseticket", {
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
            showTableHandler();
            refreshAssetDataExcept();
            setSelectedAssets([]);
            setSelectedAssetsID([]);
            setCheckoutDate('');
            setCheckinDate('');
            setLocation('');
            setNote('');
          } else {
            setNotification('Diharapkan mengisi semua Form');
            setNotificationStatus(true);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
            setIsLoading(false); // Atur status loading menjadi false
        }
      };
    

    const handleRowDeselected = (row) => {
      // Hapus baris yang dibatalkan pemilihannya dari state selectedAssets
      setSelectedAssets(selectedAssets.filter((asset) => asset.id !== row.id));
    };
      

    // Fungsi untuk menampilkan tabel dan menyembunyikan formulir
    const showTableHandler = () => {
        setSelectedAssets([]);
        setShowTable((prev) => !prev);
        setShowFormulir(false);
        setSelectedAssets([]);
    };
    const showFormulirHandler = () => {
        setShowTable(false);
        setShowFormulir((prev) => !prev);
    };



    const columns = [
        {
            name: 'No',
            selector: 'no',
            sortable: true,
            export: true
            },
            {
            name: 'ID Asset',
            selector: 'id',
            export: true
            },
            {
            name: 'Name',
            selector: 'name',
            export: true
            },
            {
            name: 'Description',
            selector: 'description',
            export: true
            },
            {
            name: 'Brand',
            selector: 'brand',
            export: true
            },
            {
            name: 'Model',
            selector: 'model',
            export: true
            },
            {
            name: 'Status',
            selector: 'status',
            export: true
            },
            {
            name: 'Location',
            selector: 'location',
            export: true
            },
            {
            name: 'Category',
            selector: 'category',
            export: true
            },
            {
            name: 'SN',
            selector: 'sn',
            export: true
            },
            {
            name: 'Photo',
            cell: (row) => (
                <div>
                  <img src={row.image_path} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
              ),
            export: true
            },
            
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <input 
                    type="radio" 
                    name="selected_assets" 
                    value="" 
                    onClick={() => {
                        if (selectedAssets.some((asset) => asset.id === row.id)) {
                            handleRowDeselected(row);
                        } else {
                            handleRowSelected(row);
                        }
                    }}
                    />
                </div>
            ),
            allowOverflow: true,
            button: true,
            width: '100px',
            omit: showFormulir,
            },
    ]

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Lease page :)</h2>
                </div>
            </div>

            {showTable && (
            <div className='p-2'>
                <div className='bg-white p-2'>
                    <DataTableExtensions
                    columns={columns}
                    data={DataListAssetExcept}
                    filter
                    print={false}
                    export={false}
                    filterPlaceholder='Filter Data'
                    >
                    <DataTable
                        noHeader
                        defaultSortField='no'
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                        onRowSelected={handleRowSelected}
                        onRowDeselected={handleRowDeselected}
                    />
                    </DataTableExtensions>
                    <div className='flex justify-end mt-5'>
                        <button className='main-btn' id='lanjut' onClick={showFormulirHandler} disabled={selectedAssets.length === 0}>Check Out</button>
                    </div>
                </div>
            </div>
            )}

            {showFormulir && (
            <div className='p-2' id='formulir'>
                <div className='bg-white p-5 rounded-xl'>
                    <div className='flex items-center justify-between'>
                        <h2 className=''>Berikut ini adalah Asset yang anda pinjam</h2>
                        <button className='main-btn' onClick={showTableHandler}>Back</button>
                    </div>
                    <DataTable className='bg-[#efefef] mt-5 border-black'
                        columns={columns}
                        data={selectedAssets}
                    />
                    <h2 className='border-t-[1px] border-black mt-4 pt-4'>Untuk melanjutkan tranasaksi peminjaman, silahkan isi formulir dibawah ini:</h2>
                    <div className='flex'>
                        <div className='form-group'>
                            <label className='label-text'>Nama Anda</label>
                            <input 
                            type="text" 
                            className='form-input cursor-not-allowed' 
                            id="nama" 
                            name="name" 
                            value={Name}
                            placeholder="Masukkan Nama Anda" 
                            onChange={(e) => setName(e.target.value)}
                            required disabled
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Lokasi</label>
                            <div className='dropdown-container'>
                                <select 
                                className='category-dropdown' 
                                name='lokasi'
                                value={Location}
                                onChange={(e) => setLocation(e.target.value)}  
                                required
                                >
                                <option value="" disabled selected>Select Location</option>
                                        {LocationOptions.map((location) => (
                                            <option key={location.id} value={location.location}>
                                              {location.location}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='form-group'>
                            <label className='label-text'>Checkout Date</label>
                            <input 
                            type="date" 
                            className='form-input' 
                            placeholder="Masukkan Nama Anda" 
                            onChange={(e) => setCheckoutDate(e.target.value)}  
                            required />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Checkin Date</label>
                            <input 
                            type="date" 
                            className='form-input' 
                            placeholder="Masukkan Nama Anda" 
                            onChange={(e) => setCheckinDate(e.target.value)}  
                            required />
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='form-group'>
                            <label className='label-text'>Email</label>
                            <input 
                            type="email" 
                            className='form-input' 
                            placeholder="Masukkan Email Anda" 
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}  
                            disabled />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Note</label>
                            <textarea 
                            className='form-input' 
                            placeholder="" required 
                            onChange={(e) => setNote(e.target.value)}  
                            />
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='form-group'>
                            <label className='label-text'>Admin 1</label>
                            <div className='dropdown-container'>
                                <select 
                                className='category-dropdown' 
                                name='Admin 1' 
                                onChange={(e) => {
                                    const selectedAdmin = e.target.value;
                                    setSelectedAdmin1(selectedAdmin);
                                }}
                                >
                                    <option value='' disable selected>Select Admin 1</option>
                                    {AdminList.map((admin) => (
                                        <option 
                                            key={admin.email} 
                                            value={admin.email} 
                                            disabled={admin.email === selectedAdmin2}
                                        >
                                            {admin.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Admin 2</label>
                            <div className='dropdown-container'>
                                <select 
                                className='category-dropdown' 
                                name='Admin 2'
                                value={selectedAdmin2}
                                onChange={(e) => {
                                    const selectedAdmin = e.target.value;
                                    setSelectedAdmin2(selectedAdmin);
                                }}
                                >
                                    <option value='' disable selected>Select Admin 2</option>
                                    {AdminList.map((admin) => (
                                        <option 
                                            key={admin.email} 
                                            value={admin.email} 
                                            disabled={admin.email === selectedAdmin1}
                                        >
                                            {admin.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end mt-4'>
                        <button
                            className='main-btn'
                            type='submit'
                            onClick={() => handleLeaseAsset(token)}
                            disabled={isLoading} // Tombol akan dinonaktifkan selama permintaan sedang diproses
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
            )}
            

        </>
    )
}
export default Lease