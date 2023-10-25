import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const Return = () => {
    const { token, Role, refreshDataLoan, DataLoan } = useAuth();
    const [dataWithRemainingTime, setDataWithRemainingTime] = useState([]);
    const [selectedLoanID, setselectedLoanID] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const refreshData = async () => {
            if (Role === 0 || Role === 1 || Role === 2) {
                await refreshDataLoan();
            }
        };

        refreshData();

        window.addEventListener("beforeunload", refreshData);

        return () => {
            window.removeEventListener("beforeunload", refreshData);
        };
        // eslint-disable-next-line
    }, [Role]);

    useEffect(() => {
        if (DataLoan.data) {
            const currentDate = new Date();
            const dataWithTimeRemaining = DataLoan.data.map((item) => {
                const returnDate = new Date(item.returndate);
                const timeDiff = returnDate - currentDate;
                const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                return {
                    ...item,
                    timeRemaining: `${daysRemaining} Hari (otomatis)`,
                };
            });
            setDataWithRemainingTime(dataWithTimeRemaining);
        }
    }, [DataLoan.data]);

    const handleRowSelected = (row) => {
        setselectedLoanID([]);
        setselectedLoanID([row.id]);
        console.log(selectedLoanID);
        
    };

    const handleRowDeselected = (row) => {
        setselectedLoanID(selectedLoanID.filter((loan) => loan.id !== row.id));
        console.log(selectedLoanID);
      };

      const handleReturnAsset = async (token, selectedLoanID) => {
        try {
          setIsLoading(true); // Atur status loading menjadi true
      
          const response = await fetch(`http://sipanda.online:5000/api/returnsloan/${selectedLoanID}`, {
            method: "POST",
            headers: {
              Authorization: token,
            },
          });
      
          if (response.status === 200) {
            // Berhasil mengembalikan, sekarang kita perbarui data peminjaman
            await refreshDataLoan();
            setIsLoading(false); // Atur status loading menjadi false
          } else {
            console.log("unauthorized.");
            setIsLoading(false); // Atur status loading menjadi false
          }
        } catch (error) {
          console.error("Error:", error);
          setIsLoading(false); // Atur status loading menjadi false
        }
      };
      

    const columns = [
        {
            name: 'No',
            selector: (row) => row.row,
            sortable: true,
            export: true,
        },
        {
            name: 'ID Asset',
            selector: (row) => row.idasset,
            export: true,
        },
        {
            name: 'Name',
            selector: (row) => row.nameasset,
            export: true,
        },
        {
            name: 'Lease Date',
            selector: (row) => row.leasedate,
            export: true,
        },
        {
            name: 'Return Date',
            selector: (row) => row.returndate,
            export: true,
        },
        {
            name: 'Time Remaining',
            selector: (row) => row.timeRemaining,
            export: true,
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
                        if (selectedLoanID.some((loan) => loan.id === row.id)) {
                            handleRowDeselected(row);
                        } else {
                            handleRowSelected(row);
                        }
                    }} />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Return page :)</h2>
                </div>
            </div>
            <div className='p-2'>
                <div className='p-2 bg-white'>
                    <div className='p-3 flex gap-1'>
                        <div className='flex gap-1'>
                            <h3>Jumlah Asset yang anda pinjam : </h3>
                            <h3 className='font-semibold bg-[#efefef] rounded'>{DataLoan.loancount}</h3>
                        </div>   
                    </div>
                </div>
            </div>
            <div className='p-2'>
                <DataTable
                    columns={columns}
                    data={dataWithRemainingTime}
                    noHeader
                    defaultSortField='id'
                    defaultSortAsc={false}
                    pagination
                    highlightOnHover
                />
            </div>
            <div className='flex justify-end p-2'>
                <button
                    className='main-btn'
                    type='submit'
                    onClick={() => handleReturnAsset(token, selectedLoanID)}
                    disabled={isLoading} 
                >
                    {isLoading ? 'Returning...' : 'Return'}
                </button>
            </div>
        </>
    )
};

export default Return;
