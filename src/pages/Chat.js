import React, { useState, useEffect, useRef } from 'react';
import 'react-data-table-component-extensions/dist/index.css';
import { faFileCsv,faPenToSquare, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, } from 'material-react-table';
import {  Button, } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Popover, PopoverHandler, PopoverContent, } from "@material-tailwind/react";

const Chat = () => {
  const {  Role, DataListAsset} = useAuth();
  const [showExport, setShowExport] = useState(false);
  const [openCsvPopover, setOpenCsvPopover] = useState(false);
  const [openPdfPopover, setOpenPdfPopover] = useState(false);
  const tableRef = useRef(null);

  const showExportHandler = () => {
    setShowExport((prev) => !prev);
  };

  const triggersCsv = {
    onMouseEnter: () => setOpenCsvPopover(true),
    onMouseLeave: () => setOpenCsvPopover(false),
  };
  const triggersPdf = {
    onMouseEnter: () => setOpenPdfPopover(true),
    onMouseLeave: () => setOpenPdfPopover(false),
  };

  // NEW TABLE
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
    header: Role === 2 ? 'Action' : '',
    omit: Role !== 2,
    size: 120,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({row}) => (
      Role === 2 ? (
        <div className='text-white'>
          <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5'>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5'>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ) : null
      ),
    }),
];

const handleExportRowsCsv = (rows) => {
  const rowData = rows.map((row) => {
    const dataRow = row.original;
    return {
      no: dataRow.no,
      id: dataRow.id,
      name: dataRow.name,
      description: dataRow.description,
      brand: dataRow.brand,
      model: dataRow.model,
      status: dataRow.status,
      location: dataRow.location,
      category: dataRow.category,
      sn: dataRow.sn,
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


  const handleExportRowsPdf = (rows) => {
  const doc = new jsPDF();
  const tableData = rows.map((row) => {
    const dataRow = row.original;
    return [dataRow.no, dataRow.id, dataRow.name, dataRow.description, dataRow.brand, dataRow.model, dataRow.status, dataRow.location, dataRow.category, dataRow.sn,];
  });

  const tableHeaders = ['No', 'ID Asset', 'Name', 'Description', 'Brand', 'Model', 'Status', 'Location', 'Category', 'Serial Number'];

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
  });

  doc.save('mrt-pdf-example.pdf');
};

  return (
    <>
      <div className='p-2'>
        <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
          <h2 className='text-white'>Selamat datang di Chat page :)</h2>
        </div>
      </div>
      
      <div className='flex space-x-4'>
        <div className='flex items-center py-8'>
          <button className='main-btn' onClick={showExportHandler}>Export</button>
        </div>
        {showExport && (
        <div className='flex flex-col space-y-1'>
            <Popover open={openCsvPopover} handler={setOpenCsvPopover} placement='right' animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
            <div className='flex'>
              <PopoverHandler {...triggersCsv}>
                <button className='main-btn'>
                  <FontAwesomeIcon icon={faFileCsv} size='xl' />
                </button>
              </PopoverHandler>
              <PopoverContent {...triggersCsv} className='bg-[#efefef] z-50 shadow-none py-0.5 px-2 border-none'>
                <div className='flex gap-2'>
                <Button
                    disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0}
                    onClick={() => handleExportRowsCsv(tableRef.current?.getPrePaginationRowModel().rows)}
                  >
                    All Rows
                  </Button>

                  <Button
                    disabled={tableRef.current?.getRowModel().rows.length === 0}
                    onClick={() => handleExportRowsCsv(tableRef.current?.getRowModel().rows)}
                  >
                    Page Rows
                  </Button>

                  <Button
                    disabled={
                      !tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()
                    }
                    onClick={() => handleExportRowsCsv(tableRef.current?.getSelectedRowModel().rows)}
                  >
                    Selected Rows
                  </Button>
                </div>
              </PopoverContent>
            </div>
            </Popover>
            <Popover open={openPdfPopover} handler={setOpenPdfPopover} placement='right' animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
            <div className='flex'>
              <PopoverHandler {...triggersPdf}>
                <button className='main-btn'>
                  <FontAwesomeIcon icon={faFilePdf} size='xl' />
                </button>
              </PopoverHandler>
              <PopoverContent {...triggersPdf} className='bg-[#efefef] z-50 shadow-none py-0.5 border-none px-2'>
                <div className='flex gap-2'>
                <Button
            disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0}
            onClick={() => handleExportRowsPdf(tableRef.current?.getPrePaginationRowModel().rows)}
          >
            All Rows
          </Button>

          <Button
            disabled={tableRef.current?.getRowModel().rows.length === 0}
            onClick={() => handleExportRowsPdf(tableRef.current?.getRowModel().rows)}
          >
            Page Rows
          </Button>

          <Button
            disabled={
              !tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()
            }
            onClick={() => handleExportRowsPdf(tableRef.current?.getSelectedRowModel().rows)}
          >
            Selected Rows
          </Button>
                </div>
              </PopoverContent>
            </div>
            </Popover>
        </div>
        )}
      </div>

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
              renderTopToolbarCustomActions= {({ table }) => {
                tableRef.current = table;
                return null;
              }}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
