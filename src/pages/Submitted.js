import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { faCheck, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import Modal from 'react-modal';
import foto from '../resources/img/aset2.jpg';
Modal.setAppElement('#root');

const Submitted = () => {
    const { token, Role, SubmitedList, refreshSubmitedList } = useAuth();
    const [showApprove, setShowApprove] = useState(false);
    const [showDecline, setShowDecline] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicketSenderName, setSelectedTicketSenderName] = useState(null);
    const [SelectedTicketingAdmin, setSelectedTicketingAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const refreshData = async () => {
          if (Role === 1 || Role === 2) {
            await refreshSubmitedList();
          }
        };
    
        refreshData();
    
        window.addEventListener("beforeunload", refreshData);
    
        return () => {
          window.removeEventListener("beforeunload", refreshData);
        };
        // eslint-disable-next-line
      }, [Role]);

    // Fungsi untuk menampilkan tabel dan menyembunyikan formulir
    const showApproveHandler = (idticketadmin, idticket, name) => {
        setSelectedTicketId(idticket);
        setSelectedTicketSenderName(name);
        setSelectedTicketingAdmin(idticketadmin);
        setShowDecline(false);
        setShowApprove((prev) => !prev);
    };
    const showDeclineHandler = (idticket, name) => {
        setSelectedTicketId(idticket);
        setSelectedTicketSenderName(name);
        setShowApprove(false);
        setShowDecline((prev) => !prev);
    };

    const handleApprove = async (token) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
  
        formData.append('SelectedTicketingAdmin', SelectedTicketingAdmin);
  
        const response = await fetch(
          `http://sipanda.online:5000/api/ticketapprove/${selectedTicketId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: token,
            },
            body: formData,
          }
        );
  
        if (response.status === 200) {
          setShowApprove(false);
          refreshSubmitedList();
          setSelectedTicketId(null);
          setSelectedTicketingAdmin(null);
          setSelectedTicketSenderName(null);
        } else {
          console.error('Failed to approve');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDecline = async (token) => {
      try {
        setIsLoading(true);
  
        const response = await fetch(
          `http://sipanda.online:5000/api/ticketdecline/${selectedTicketId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (response.status === 200) {
          setShowDecline(false);
          refreshSubmitedList();
          setSelectedTicketId(null);
          setSelectedTicketingAdmin(null);
          setSelectedTicketSenderName(null);
        } else {
          console.error('Failed to decline');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
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
            name: 'No Ticket',
            selector: (row) => row.idticket,
            },
            {
            name: 'ID Asset',
            selector: (row) => row.assets,
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
            name: 'Pengaju',
            selector: (row) => row.name,
            },
            {
            name: 'CheckOut Date',
            selector: (row) => row.leasedate,
            },
            {
            name: 'CheckIn Date',
            selector: (row) => row.returndate,
            },
            {
            name: 'Lokasi',
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
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => showApproveHandler(row.idticketadmin, row.idticket, row.name)}>
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => showDeclineHandler(row.idticket, row.name)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                )
            },
    ]
    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Submitted page :)</h2>
                </div>
            </div>

            {showApprove && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                        <h1 className="text-2xl font-semibold">Select Action</h1>
                        <p>Apakah anda yakin <u>Ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p> {/*Kasih nama user yang minjemnya*/}
                    </div>
                    <div className="flex space-x-4 mt-5">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showApproveHandler}>Close</button>
                        <button 
                          className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
                          onClick={() => handleApprove(token)}
                          disabled={isLoading}
                        >
                            {isLoading ? 'Proses...' : 'Approve'}
                        </button>
                    </div>
                </div>
            </div>
            )}
            
            {showDecline && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                        <h1 className="text-2xl font-semibold">Select Action</h1>
                        <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p> {/*Kasih nama user yang minjemnya*/}
                    </div>
                    <div className="flex space-x-4 mt-5">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showDeclineHandler}>Close</button>
                        <button 
                          className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
                          onClick={() => handleDecline(token)}
                          disabled={isLoading}
                        >
                            {isLoading ? 'Proses...' : 'Decline'}
                        </button>
                    </div>
                </div>
            </div>
            )}
            
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
                <DataTable 
                columns={columns}
                data={SubmitedList}
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
export default Submitted