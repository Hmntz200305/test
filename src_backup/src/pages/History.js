import React from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import foto from '../resources/img/aset2.jpg';

const History = () => {

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
            name: 'Submitted #1',
            selector: 'submitted1',
            export: true
            },
            {
            name: 'Submitted #2',
            selector: 'submitted2',
            export: true
            },
            {
            name: 'Accepted by',
            selector: 'accepted',
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
            name: 'Status',
            selector: 'status',
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
                  <img src={foto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
              ),
            export: true
            },
    ]
    
    const fakedata1 = [
        { no: '1', id: 'Asset 0001', name: 'Laptop', description: 'leptop gemink gada obat', brand: 'Asus', model: 'Vivobook', status: 'Available', location: 'LMD', category: 'Laptop', sn: '123123123123', photo: '', submitted1: 'Admin',submitted2: 'Super Admin', accepted: 'Admin', lease: '2023-09-20', return: '2023-09-22',},
      ];

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di History page :)</h2>
                </div>
            </div>
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
export default History