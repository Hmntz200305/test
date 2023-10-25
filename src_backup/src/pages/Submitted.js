import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';

const Submitted = () => {
    const { token, Role, SubmitedList, refreshSubmitedList } = useAuth();
    const [showApprove, setShowApprove] = useState(false);
    const [showDecline, setShowDecline] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicketSenderName, setSelectedTicketSenderName] = useState(null);
    const [SelectedTicketingAdmin, setSelectedTicketingAdmin] = useState(null);

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
        const formData = new FormData();

        formData.append('SelectedTicketingAdmin', SelectedTicketingAdmin);

        fetch(`http://sipanda.online:5000/api/ticketapprove/${selectedTicketId}`, {
          method: 'PUT',
          headers: {
            Authorization: token,
          },
          body: formData,
        })
          .then((response) => {
            if (response.status === 200) {
              setShowApprove(false);
              refreshSubmitedList();
              setSelectedTicketId(null);
              setSelectedTicketingAdmin(null);
              setSelectedTicketSenderName(null);
            } else {
              console.error('Failed to edit asset');
              refreshSubmitedList();
              setSelectedTicketId(null);
              setSelectedTicketingAdmin(null);
              setSelectedTicketSenderName(null);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };  

    const handleDecline = async (token) => {
        fetch(`http://sipanda.online:5000/api/ticketdecline/${selectedTicketId}`, {
          method: 'PUT',
          headers: {
            Authorization: token,
          },
        })
          .then((response) => {
            if (response.status === 200) {
              setShowDecline(false);
              refreshSubmitedList();
              setSelectedTicketId(null);
              setSelectedTicketingAdmin(null);
              setSelectedTicketSenderName(null);
            } else {
              console.error('Failed to edit asset');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            refreshSubmitedList();
            setSelectedTicketId(null);
            setSelectedTicketingAdmin(null);
            setSelectedTicketSenderName(null);
          });
      };  

    const columns = [
        {
            name: 'No Ticket',
            selector: (row) => row.idticket,
            sortable: true,
            export: true
            },
            {
            name: 'ID Asset',
            selector: (row) => row.assets,
            export: true
            },
            {
            name: 'Pengaju',
            selector: (row) => row.name,
            export: true
            },
            {
            name: 'CheckOut Date',
            selector: (row) => row.leasedate,
            export: true
            },
            {
            name: 'CheckIn Date',
            selector: (row) => row.returndate,
            export: true
            },
            {
            name: 'Lokasi',
            selector: (row) => row.location,
            export: true
            },
            {
            name: 'Email',
            selector: (row) => row.email,
            export: true
            },
            {
            name: 'Note',
            selector: (row) => row.note,
            export: true
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
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleApprove(token)}>Approve</button>
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
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDecline(token)}>Decline</button>
                    </div>
                </div>
            </div>
            )}
            
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