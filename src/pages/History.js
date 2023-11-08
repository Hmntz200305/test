import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable, } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, colors } from '@mui/material';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";
Modal.setAppElement('#root');

const History = () => {

    const LogContent = () => (
        <div className='p-0'>
            <div className='mt-4'>
                <MaterialReactTable 
                    columns={columnsNew}
                    data={HistoryTicket}
                    enableRowSelection={true}
                    enableClickToCopy={false}
                    columnFilterDisplayMode= 'popover'
                    paginationDisplayMode= 'pages'
                    positionToolbarAlertBanner= 'bottom'
                    renderTopToolbarCustomActions= {({ table }) => ( 
                        <div className='flex gap-1 flex-wrap p-2'>
                            <div className='bg-blue-200'>
                                <Button
                                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                                    onClick={() =>
                                        handleExportRowsCsvTicket(table.getPrePaginationRowModel().rows)
                                    }
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export All Rows CSV
                                </Button>
            
                                <Button
                                    disabled={table.getRowModel().rows.length === 0}
                                    onClick={() => handleExportRowsCsvTicket(table.getRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Page Rows CSV
                                </Button>
            
                                <Button
                                    disabled={
                                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    onClick={() => handleExportRowsCsvTicket(table.getSelectedRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Selected Rows CSV
                                </Button>
                            </div>
                            
                            <div className='bg-red-200'>
                                <Button
                                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                                    onClick={() =>
                                        handleExportRowsPdfTicket(table.getPrePaginationRowModel().rows)
                                    }
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export All Rows PDF
                                </Button>
            
                                <Button
                                    disabled={table.getRowModel().rows.length === 0}
                                    onClick={() => handleExportRowsPdfTicket(table.getRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Page Rows PDF
                                </Button>
            
                                <Button
                                    disabled={
                                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    onClick={() => handleExportRowsPdfTicket(table.getSelectedRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Selected Rows PDF
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
    const PeminjamanContent = () => (
        <div className='p-0'>
            <div className='mt-4'>
                <MaterialReactTable 
                    columns={Peminjaman}
                    data={HistoryLoanData}
                    enableRowSelection={true}
                    enableClickToCopy={false}
                    columnFilterDisplayMode= 'popover'
                    paginationDisplayMode= 'pages'
                    positionToolbarAlertBanner= 'bottom'
                    renderTopToolbarCustomActions= {({ table }) => ( 
                        <div className='flex gap-1 flex-wrap p-2'>
                            <div className='bg-blue-200'>
                                <Button
                                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                                    onClick={() =>
                                        handleExportRowsCsvPeminjaman(table.getPrePaginationRowModel().rows)
                                    }
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export All Rows CSV
                                </Button>
            
                                <Button
                                    disabled={table.getRowModel().rows.length === 0}
                                    onClick={() => handleExportRowsCsvPeminjaman(table.getRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Page Rows CSV
                                </Button>
            
                                <Button
                                    disabled={
                                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    onClick={() => handleExportRowsCsvPeminjaman(table.getSelectedRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Selected Rows CSV
                                </Button>
                            </div>
                            
                            <div className='bg-red-200'>
                                <Button
                                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                                    onClick={() =>
                                        handleExportRowsPdfPeminjaman(table.getPrePaginationRowModel().rows)
                                    }
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export All Rows PDF
                                </Button>
            
                                <Button
                                    disabled={table.getRowModel().rows.length === 0}
                                    onClick={() => handleExportRowsPdfPeminjaman(table.getRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Page Rows PDF
                                </Button>
            
                                <Button
                                    disabled={
                                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    onClick={() => handleExportRowsPdfPeminjaman(table.getSelectedRowModel().rows)}
                                    startIcon={<FileDownloadIcon />}
                                    >
                                    Export Selected Rows PDF
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
    

    const { refreshHistoryTicket, HistoryTicket, refreshHistoryLoanData, HistoryLoanData } = useAuth();
    const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);


    useEffect(() =>{
        refreshHistoryTicket();
        refreshHistoryLoanData();
        // eslint-disable-next-line
    }, [])

    const [activeTab, setActiveTab] = React.useState("log");
    const data = [
        {
        label: "Log",
        value: "log",
        content: <LogContent />,
        },
        {
        label: "Peminjaman",
        value: "peminjaman",
        content: <PeminjamanContent />,
        },
    ];

    // Modal
    const [showMoreDetail, setShowMoreDetail] = useState(false);

    const openMoreDetailHandler = (row) => {
        setShowMoreDetail(true);
        setSelectedAssetDetails([row]);
    };
    const closeMoreDetailHandler = (row) => {
        setShowMoreDetail(false)
    }

      
    const columnHelper = createMRTColumnHelper();

        const columnsNew = [
        columnHelper.accessor('no', {
            header: 'No',
            size: 40,
        }),
        columnHelper.accessor('idticket', {
            header: 'ID Ticket',
            size: 120,
        }),
        columnHelper.accessor('asset', {
            header: 'ID Asset',
            size: 120,
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            size: 120,
        }),
        columnHelper.accessor('leasedate', {
            header: 'Lease Date',
            size: 120,
        }),
        columnHelper.accessor('returndate', {
            header: 'Return Date',
            size: 120,
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            size: 120,
        }),
        columnHelper.accessor('note', {
            header: 'Note',
            size: 120,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            size: 120,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            size: 120,
        }),
        columnHelper.accessor('admin1', {
            header: 'Admin #1',
            size: 120,
        }),
        columnHelper.accessor('admin2', {
            header: 'Admin #2',
            size: 120,
        }),
        columnHelper.accessor('more', {
            header: 'More Detail',
            size: 120,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({row}) => (
                <div className='text-white flex items-center justify-center cursor-pointer'>
                    <button
                    className='bg-gray-800 p-1 rounded-lg'
                    onClick={() => openMoreDetailHandler(row.original)}
                    >
                    <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                    </button>
                </div>
              ),
            }),
        ];

        const Peminjaman = [
        columnHelper.accessor('no', {
            header: 'No',
            size: 40,
        }),
        columnHelper.accessor('idticket', {
            header: 'ID Ticket',
            size: 120,
        }),
        columnHelper.accessor('asset', {
            header: 'ID Asset',
            size: 120,
        }),
        columnHelper.accessor('assetname', {
            header: 'Name',
            size: 120,
        }),
        columnHelper.accessor('leasedate', {
            header: 'Lease Date',
            size: 120,
        }),
        columnHelper.accessor('returndate', {
            header: 'Return Date',
            size: 120,
        }),
        columnHelper.accessor('name', {
            header: 'Username',
            size: 120,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            size: 120,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            size: 120,
        }),
        columnHelper.accessor('more', {
            header: 'More Detail',
            size: 120,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({row}) => (
                <div className='text-white flex items-center justify-center cursor-pointer'>
                    <button
                    className='bg-gray-800 p-1 rounded-lg'
                    onClick={() => openMoreDetailHandler(row.original)}
                    >
                    <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                    </button>
                </div>
                ),
            }),
        ];

    const handleExportRowsCsvTicket = (rows) => {
        const rowData = rows.map((row) => {
          const dataRow = row.original;
          return {
            no: dataRow.no,
            id: dataRow.idticket,
            assset: dataRow.asset,
            name: dataRow.name,
            leasedatae: dataRow.leasedate,
            returndate: dataRow.returndate,
            location: dataRow.location,
            note: dataRow.note,
            email: dataRow.email,
            status: dataRow.status,
            admin1: dataRow.admin1,
            admin2: dataRow.admin2,
          };
        });
      
        const csvConfig = mkConfig({
          fieldSeparator: ',',
          decimalSeparator: '.',
          useKeysAsHeaders: true,
        });
      
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      };
      
        const handleExportRowsPdfTicket = (rows) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => {
          const dataRow = row.original;
          return [dataRow.no, dataRow.idticket, dataRow.asset, dataRow.name, dataRow.leasedate, dataRow.returndate, dataRow.location, dataRow.note, dataRow.email, dataRow.status, dataRow.admin1, dataRow.admin2];
        });
      
        const tableHeaders = ['No', 'ID Ticket', 'ID Asset', 'Name', 'Lease Date', 'Return Date', 'Location', 'Note', 'Email', 'Status', 'Admin #1', 'Admin #2'];
      
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
        });
      
        doc.save('mrt-pdf-example.pdf');
    };



    const handleExportRowsCsvPeminjaman = (rows) => {
        const rowData = rows.map((row) => {
          const dataRow = row.original;
          return {
            no: dataRow.no,
            id: dataRow.idticket,
            assset: dataRow.asset,
            assetname: dataRow.assetname,
            leasedatae: dataRow.leasedate,
            returndate: dataRow.returndate,
            name: dataRow.name,
            email: dataRow.email,
            status: dataRow.status,
          };
        });
      
        const csvConfig = mkConfig({
          fieldSeparator: ',',
          decimalSeparator: '.',
          useKeysAsHeaders: true,
        });
      
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      };
      
        const handleExportRowsPdfPeminjaman = (rows) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => {
          const dataRow = row.original;
          return [dataRow.no, dataRow.idticket, dataRow.asset, dataRow.assetname, dataRow.leasedate, dataRow.returndate, dataRow.name, dataRow.email, dataRow.status];
        });
      
        const tableHeaders = ['No', 'ID Ticket', 'ID Asset', 'Name', 'Lease Date', 'Return Date', 'Username', 'Email', 'Status'];
      
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
        });
      
        doc.save('mrt-pdf-example.pdf');
    };

    const HistoryMore = [
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
            <div className='bg-black rounded-2xl p-4 shadow'>
                <h2 className='text-white'>Selamat datang di History page :)</h2>
            </div>
            
            <div className='bg-white rounded mt-6 '>
                <div className='flex justify-center'>
                    <h1 className="text-2xl font-semibold mt-6">Select Menu</h1>
                </div>
                <Tabs value={activeTab}>
                    <TabsHeader
                    className="rounded-none p-0 border-b border-blue-gray-50 mt-4 bg-white"
                    indicatorProps={{
                        className:
                        "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                    }}
                    >
                    {data.map(({ label, value }) => (
                        <Tab
                        key={value}
                        value={value}
                        onClick={() => setActiveTab(value)}
                        className={activeTab === value ? "text-gray-800" : "hover:text-gray-500"}
                        >
                        {label}
                        </Tab>
                    ))}
                    </TabsHeader>
                    <TabsBody>
                    {data.map(({ value, content }) => (
                        <TabPanel key={value} value={value}>
                        {content}
                        </TabPanel>
                    ))}
                    </TabsBody>
                </Tabs>
            </div>

            

            <Modal
                isOpen={showMoreDetail}
                onRequestClose={closeMoreDetailHandler}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className="modal-content bg-white w-1/2 p-4 rounded shadow-md"
                shouldCloseOnOverlayClick={false}
                >
                <h1>Ini adalah detail lengkap asset HEHHE</h1>
                <DataTable
                    columns={HistoryMore}
                    data={selectedAssetDetails}
                    highlightOnHover
                />
                <button onClick={closeMoreDetailHandler} className="main-btn mt-4">
                    Close
                </button>
            </Modal>

            {/* Log */}
            
            {/* Peminjaman */}
            

        </>
    )
}
export default History