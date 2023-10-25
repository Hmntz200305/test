import React, { useState, useEffect} from 'react'
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { faCheck, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MyReport = () => {

     // Fungsi untuk menghitung sisa waktu
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

    const columns = [
        {
            name: 'No',
            selector: 'no',
            sortable: true,
            export: true
            },
            {
            name: 'Nama Asset',
            selector: 'nama',
            export: true
            },
            {
            name: 'Lease Date',
            selector: 'lease',
            export: true
            },
            {
            name: 'Return Date',
            selector: 'return',
            export: true
            },
            {
            name: 'Time Remaining',
            selector: 'time',
            export: true
            },
            {
            name: 'Submitted #1',
            selector: 'admin1',
            export: true
            },
            {
            name: 'Submitted #2',
            selector: 'admin2',
            export: true
            },
            {
            name: 'Status',
            selector: 'status',
            export: true
            },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={showDeleteHandler}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
                )
            },
    ]
    
    const [fakedata1, setFakedata1] = useState([
        { no: '1', nama: 'Laptop', lease: '2023-10-11', return: '2023-10-20', time: '10', admin1: 'Approved', admin2: 'Submitted', status: 'Still Submitted' },
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
                <DataTable 
                columns={columns}
                data={fakedata1}
                noHeader
                defaultSortField='no'
                defaultSortAsc={false}
                pagination
                highlightOnHover
                />
            </div>
        </>
    )
}
export default MyReport