import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
Modal.setAppElement('#root');

const History = () => {
    const { refreshHistoryTicket, HistoryTicket, refreshHistoryLoanData, HistoryLoanData } = useAuth();
    const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);


    useEffect(() =>{
        refreshHistoryTicket();
        refreshHistoryLoanData();
        // eslint-disable-next-line
    }, [])

    // Menu
    const [showMain, setShowMain] = useState(true);
    const [showTicket, setShowTicket] = useState(false);
    const [showPeminjaman, setShowPeminjaman] = useState(false);
  
    const showTicketHandler = () => {
      setShowMain(true);
      setShowTicket((prev) => !prev);
      setShowPeminjaman(false);
    };
    const showPeminjamanHandler = () => {
      setShowMain(true);
      setShowTicket(false);
      setShowPeminjaman((prev) => !prev);
    };

    // Modal
    const [showModalTicket, setShowModalTicket] = useState(false);
    const [showModalPeminjaman, setShowModalPeminjaman] = useState(false);

    const closeModalTicketHandle = () => {
      setShowModalTicket(false);
    };

    const closeModalPeminjamanHandle = () => {
      setShowModalPeminjaman(false);
    };

    const showMoreDetailHandler = (row) => {
        setSelectedAssetDetails([row]);
        setShowModalTicket(true);
    };
      
    const Ticket = [
        {
            name: 'No',
            selector: (row) => row.no,
        },
        {
            name: 'ID Ticket',
            selector: (row) => row.idticket,
        },
        {
            name: 'ID Asset',
            selector: (row) => row.asset,
        },
        {
            name: 'Name',
            selector: (row) => row.name,
        },
        {
            name: 'Lease Date',
            selector: (row) => row.leasedate,
        },
        {
            name: 'Return Date',
            selector: (row) => row.returndate,
        },
        {
            name: 'Location',
            selector: (row) => row.location,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
        },
        {
            name: 'Note',
            selector: (row) => row.note,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
        },
        {
            name: 'Admin #1',
            selector: (row) => row.admin1,
        },
        {
            name: 'Admin #2',
            selector: (row) => row.admin2,
        },
        {
            name: 'More Detail',
            cell: (row) => (
              <div className='text-white flex items-center justify-center cursor-pointer'>
                <button
                  className='bg-gray-800 p-1 rounded-lg'
                  onClick={() => showMoreDetailHandler(row)}
                >
                  <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                </button>
              </div>
            ),
          },          
    ]
    
    const Loan = [
        {
            name: 'No',
            selector: (row) => row.no,
        },
        {
            name: 'ID Ticket',
            selector: (row) => row.idticket,
        },
        {
            name: 'ID Asset',
            selector: (row) => row.asset,
        },
        {
            name: 'Name',
            selector: (row) => row.assetname,
        },
        {
            name: 'Lease Date',
            selector: (row) => row.leasedate,
        },
        {
            name: 'Return Date',
            selector: (row) => row.returndate,
        },
        {
            name: 'Username',
            selector: (row) => row.name,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
        },
        {
            name: 'More Detail',
            cell: (row) => (
                <div className='text-white flex items-center justify-center cursor-pointer'>
                  <button 
                    className='bg-gray-800 p-1 rounded-lg' 
                    onClick={() => showMoreDetailHandler(row)}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                  </button>
                </div>
            ),
        }
    ]

    const HistoryTicketMore = [
        {
            name: 'ID Asset',
            selector: (row) => row.asset,
            },
            {
            name: 'Name',
            selector: (row) => row.assetname,
            },
            {
            name: 'Description',
            selector: (row) => row.assetdescription,
            },
            {
            name: 'Brand',
            selector: (row) => row.assetbrand,
            },
            {
            name: 'Model',
            selector: (row) => row.assetmodel,
            },
            {
            name: 'Status',
            selector: (row) => row.assetstatus,
            },
            {
            name: 'Location',
            selector: (row) => row.assetlocation,
            },
            {
            name: 'Category',
            selector: (row) => row.assetcategory,
            },
            {
            name: 'SN',
            selector: (row) => row.assetsn,
            },
            {
            name: 'Photo',
            cell: (row) => (
                <div>
                  <img src={row.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
              ),
            },
    ]

    const HistoryLoanMore = [
        {
            name: 'ID Asset',
            selector: (row) => row.asset,
            },
            {
            name: 'Name',
            selector: (row) => row.assetname,
            },
            {
            name: 'Description',
            selector: (row) => row.assetdescription,
            },
            {
            name: 'Brand',
            selector: (row) => row.assetbrand,
            },
            {
            name: 'Model',
            selector: (row) => row.assetmodel,
            },
            {
            name: 'Status',
            selector: (row) => row.assetstatus,
            },
            {
            name: 'Location',
            selector: (row) => row.assetlocation,
            },
            {
            name: 'Category',
            selector: (row) => row.assetcategory,
            },
            {
            name: 'SN',
            selector: (row) => row.assetsn,
            },
            {
            name: 'Photo',
            cell: (row) => (
                <div>
                  <img src={row.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
              ),
            },
    ]
    return (
        <>
            <div className='p-2'>
                <div className='bg-black rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di History page :)</h2>
                </div>
                {showMain && (
                <div className="flex flex-col items-center justify-center bg-white p-2 rounded-2xl">
                    <h1 className="text-2xl font-semibold mb-6">Select Menu</h1>
                    <div className="flex space-x-4">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded w-32" onClick={showTicketHandler}>Ticket</button>
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded w-32" onClick={showPeminjamanHandler}>Peminjaman</button>
                    </div>
                </div>
                )}
            </div>

            {/* Ticket */}
            <Modal
                isOpen={showModalTicket}
                onRequestClose={closeModalTicketHandle}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className="modal-content bg-white w-1/2 p-4 rounded shadow-md"
                shouldCloseOnOverlayClick={false}
                >
                <h1>Ini adalah detail lengkap asset TICKET</h1>
                <DataTable
                    columns={HistoryTicketMore}
                    data={selectedAssetDetails}
                    highlightOnHover
                />
                <button onClick={closeModalTicketHandle} className="main-btn mt-4">
                    Close
                </button>
            </Modal>
            {showTicket && (
            <div className='p-2'>
                ticket
                <DataTableExtensions
                columns={Ticket}
                data={HistoryTicket}
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
            )}

            {/* Peminjaman */}
            <Modal
                isOpen={showModalPeminjaman}
                onRequestClose={closeModalPeminjamanHandle}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className="modal-content bg-white w-1/2 p-4 rounded shadow-md"
                shouldCloseOnOverlayClick={false}
                >
                <h1>Ini adalah detail lengkap asset peminjaman</h1>
                <DataTable
                    columns={HistoryLoanMore}
                    data={selectedAssetDetails}
                    highlightOnHover
                />
                <button onClick={closeModalPeminjamanHandle} className="main-btn mt-4">
                    Close
                </button>
            </Modal>
            {showPeminjaman && (
            <div className='p-2'>
                peminjaman
                <DataTableExtensions
                    columns={Loan}
                    data={HistoryLoanData}
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
            )}
        </>
    )
}
export default History