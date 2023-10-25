import React, { useState, useEffect} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { faCircleInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileCsv, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import foto from '../resources/img/aset2.jpg';
Modal.setAppElement('#root');

const MyReport = () => {

     const calculateRemainingTime = () => {
        const currentDate = new Date(); // Tanggal hari ini
        const dataWithRemainingTime = fakedata1.map((item) => {
            const returnDate = new Date(item.return);
            const timeDiff = returnDate - currentDate;
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Menghitung selisih hari
            return {
                ...item,
                time: `${daysRemaining} Hari`,
            };
        });
        setFakedata1(dataWithRemainingTime);
    };

    useEffect(() => {
        calculateRemainingTime();
    }, []);

    const [showDelete, setShowDelete] = useState(false);
    const showDeleteHandler = () => {
        setShowDelete((prev) => !prev);
    };

    // Modal
    const [showModalAsset, setShowModalAsset] = useState(false);

    const showModalAssetHandle = () => {
        setShowModalAsset(true);
    };
    const closeModalAssetHandle = () => {
        setShowModalAsset(false);
    };


    const morecolumn = [
        {
            name: 'ID Asset',
            selector: (row) => row.id,
            },
            {
            name: 'Name',
            selector: (row) => row.name,
            },
            {
            name: 'Description',
            selector: (row) => row.description,
            },
            {
            name: 'Brand',
            selector: (row) => row.brand,
            },
            {
            name: 'Model',
            selector: (row) => row.model,
            },
            {
            name: 'Status',
            selector: (row) => row.status,
            },
            {
            name: 'Location',
            selector: (row) => row.location,
            },
            {
            name: 'Category',
            selector: (row) => row.category,
            },
            {
            name: 'SN',
            selector: (row) => row.sn,
            },
            {
            name: 'Photo',
            cell: (row) => (
                <div>
                <img src={foto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
            ),
            },
    ]

    const moredata = [
        { id: 'Asset 0001', name: 'Laptop', description: 'leptop gemink gada obat', brand: 'Asus', model: 'Vivobook', status: 'Available', location: 'LMD', category: 'Laptop', sn: '123123123123', photo: '', action: '' },
    ]

    const columns = [
        {
            name: 'No',
            selector: (row) => row.no,
            },
            {
            name: 'ID Asset',
            selector: (row) => row.id,
            },
            {
                name: 'More Detail',
                cell: (row) => (
                    <div className='text-white flex items-center justify-center cursor-pointer'>
                      <button className='bg-gray-800 p-1 rounded-lg' onClick={showModalAssetHandle}>
                        <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                      </button>
                    </div>
                  ),
                },
            {
            name: 'Lease Date',
            selector: (row) => row.lease,
            },
            {
            name: 'Return Date',
            selector: (row) => row.return,
            },
            {
            name: 'Time Remaining',
            selector: (row) => row.time,
            },
            {
            name: 'Submitted #1',
            cell: (row) => (
                <div className='flex flex-col'>
                    <div>
                        <p>Still Submitted...</p>
                    </div>
                    <div>
                        <p>
                            <span>Super Admin</span>
                            <span> has</span>
                            <span className='text-green-500 font-semibold'> Approved</span>
                            <span className='text-red-500 font-semibold'> Declined</span>
                        </p>
                    </div>
                </div>
            ),
            },
            {
            name: 'Submitted #2',
            cell: (row) => (
                <div className='flex flex-col'>
                    <div>
                        <p>Still Submitted..</p>
                    </div>
                    <div>
                        <p>
                            <span>Admin</span>
                            <span> has</span>
                            <span className='text-green-500 font-semibold'> Approved</span>
                            <span className='text-red-500 font-semibold'> Declined</span>
                        </p>
                    </div>
                </div>
            ),
            },
            {
            name: 'Status',
            cell: (row) => (
                <div className='flex flex-col'>
                    <div>
                        <p>Still Submitted..</p>
                    </div>
                    <div>
                        <p>
                            <span className='text-green-500 font-semibold'> Approved</span>
                            <span className='text-red-500 font-semibold'> Declined</span>
                        </p>
                    </div>
                </div>
            ),
            },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={showDeleteHandler}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
                ),
            },
    ]
    
    const [fakedata1, setFakedata1] = useState([
        { no: '1', id: 'Laptop', lease: '2023-10-11', return: '2023-10-20', time: '10' },
        { no: '2', id: 'Printer', lease: '2023-10-12', return: '2023-10-21', time: '9' },
        { no: '3', id: 'Monitor', lease: '2023-10-13', return: '2023-10-22', time: '8' },
        { no: '4', id: 'Keyboard', lease: '2023-10-14', return: '2023-10-23', time: '7' },
        { no: '5', id: 'Mouse', lease: '2023-10-15', return: '2023-10-24', time: '6' },
        { no: '6', id: 'Tablet', lease: '2023-10-16', return: '2023-10-25', time: '5' },
        { no: '7', id: 'Smartphone', lease: '2023-10-17', return: '2023-10-26', time: '4' },
        { no: '8', id: 'Projector', lease: '2023-10-18', return: '2023-10-27', time: '3' },
        { no: '9', id: 'Scanner', lease: '2023-10-19', return: '2023-10-28', time: '2' },
        { no: '10', id: 'Headset', lease: '2023-10-20', return: '2023-10-29', time: '1' }
      ]);      

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di My Report page :)</h2>
                </div>
            </div>

            {showDelete && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                    <h1 className="text-2xl font-semibold">Select Action</h1>
                    <p>Apakah anda yakin ingin menghapus Report ini?</p>
                    </div>
                    
                    <div className="flex space-x-4 mt-5">
                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showDeleteHandler}>Cancel</button>
                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded">Delete</button>
                    </div>
                </div>
            </div>
            )}

            <div className='p-2'>
                <div className='p-2 bg-white'>
                    <div className='p-3 flex gap-1'>
                        <div className='flex gap-1'>
                            <h3>Jumlah Asset yang anda pinjam : </h3>
                            <h3 className='font-semibold bg-[#efefef] rounded'> eheheh</h3>
                        </div>   
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showModalAsset}
                onRequestClose={closeModalAssetHandle}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className="modal-content bg-white w-1/2 p-4 rounded shadow-md"
                shouldCloseOnOverlayClick={false}
                >
                <h1>Ini adalah detail lengkap asset</h1>
                <DataTable
                    columns={morecolumn}
                    data={moredata}
                    highlightOnHover
                />
                <button onClick={closeModalAssetHandle} className="main-btn mt-4">
                    Close
                </button>
            </Modal>
            <div className='p-2'>
                <DataTableExtensions
                columns={columns}
                data={fakedata1}
                fileName='hehe'
                filter
                print
                export
                exportHeaders
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
        </>
    )
}
export default MyReport