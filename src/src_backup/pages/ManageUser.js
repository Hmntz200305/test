import React, { useEffect, useState} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { faPenToSquare, faTrash, faLock, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';

const ManageUser = () => {
    // Tambahkan state untuk mengatur tampilan tabel dan formulir
    const { token, Role, refreshManageUser, ManageUserData } = useAuth();
    const [showTable, setShowTable] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showDelete, setShowDelete] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (Role === 2) {
            refreshManageUser();
        }
        // eslint-disable-next-line
    }, [Role]);
    
    
    const handleRegister = async (token) => {
        const selectedRole = roles || "0";
        try {
          const response = await fetch("http://sipanda.online:5000/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ username, email, password, roles: selectedRole }),
          });
    
          if (response.status === 200) {
            console.log("Registration Success")
            setUsername('');
            refreshManageUser();
            setEmail('');
            setPassword('');
            setRoles('0');
          } else {
            console.log("unauthorized.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const editUser = async (token) => {
        if (selectedUser.role === 'Super Admin') {
            selectedUser.role = 2;
        } else if (selectedUser.role === 'Admin') {
            selectedUser.role = 1;
        } else {
            selectedUser.role = 0;
        }
    
        const editedUser = {
            username: selectedUser.username,
            userrole: selectedUser.role,
        };
    
        fetch(`http://sipanda.online:5000/api/edit-user/${selectedUser.no}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify(editedUser),
        })
        .then((response) => {
            if (response.status === 200) {
                setShowEdit(false);
                refreshManageUser();
            } else {
                console.error('Failed to edit asset');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    

      const deleteUser = (no) => {
        fetch(`http://sipanda.online:5000/api/delete-user/${no}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.status === 200) {
                setShowDelete(false);
                refreshManageUser();
            } else {
              console.error('Failed to delete asset');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };
  
      
  // Fungsi untuk menampilkan tabel dan menyembunyikan formulir
  const showTableHandler = () => {
    setShowTable((prev) => !prev);
    setShowRegistrationForm(false);
    setShowEdit(false);
    setShowMain(false);
    setShowDelete(false);
  };

  // Fungsi untuk menampilkan formulir dan menyembunyikan tabel
  const showRegistrationFormHandler = () => {
    setShowTable(false);
    setShowRegistrationForm((prev) => !prev);
    setShowEdit(false);
    setShowMain(false);
    setShowDelete(false);
  };

  // Fungsi untuk menampilkan formulir dan menyembunyikan tabel
  const showEditHandler = (row) => {
    setSelectedUser(row);
    setShowTable(true);
    setShowRegistrationForm(false);
    setShowMain(false);
    setShowDelete(false);
    setShowEdit((prev) => !prev);
  };
  const showMainHandler = () => {
    setShowTable(false);
    setShowRegistrationForm(false);
    setShowEdit(false);
    setShowDelete(false);
    setShowMain((prev) => !prev);
  };
  const showDeleteHandler = (no) => {
    setSelectedUserId(no);
    setShowTable(true);
    setShowRegistrationForm(false);
    setShowEdit(false);
    setShowMain(false);
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
            name: 'Username',
            selector: 'username',
            export: true
            },
            {
            name: 'Email',
            selector: 'email',
            export: true
            },
            {
            name: 'Role',
            selector: 'role',
            export: true
            },
            {
            name: 'Created Date',
            selector: 'created_at',
            export: true
            },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => showEditHandler(row)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => showDeleteHandler(row.no)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
                )
            }
           
    ]

    return (
        <> 
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Manage User page :)</h2>
                </div>
            </div>

            {showMain && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 rounded-2xl">
                    <h1 className="text-2xl font-semibold mb-6">Select Action</h1>
                    <div className="flex space-x-4">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showRegistrationFormHandler}>Tambah Akun</button>
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showTableHandler}>Manage</button>
                    </div>
                </div>
            </div>
            )}
            
            {showDelete && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                        <h1 className="text-2xl font-semibold">Select Action</h1>
                        <p>Apakah anda yakin ingin menghapus User ini?</p>
                    </div>
                    <div className="flex space-x-4 mt-5">
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showDeleteHandler}>Cancel</button>
                        <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => deleteUser(selectedUserId)}>Delete</button>
                    </div>
                </div>
            </div>
            
            )}

            {showTable && (
            <div className='p-2 ' id='data tabel'>
                {showEdit && (
                <div className=''>
                    <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan inputkan data User yang baru</p>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>No</label>
                            <input className='form-input pl-5 cursor-not-allowed' placeholder='Masukan No' disabled/>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Username</label>
                            <input 
                            className='form-input pl-5' 
                            type='username' 
                            placeholder='Masukan Username' 
                            value={selectedUser?.username}
                            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Email</label>
                            <input className='form-input pl-5 cursor-not-allowed' type='email' placeholder='Masukan Email' disabled/>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Role</label>
                            <select 
                            id="role" 
                            name="role" 
                            className="category-dropdown" 
                            value={selectedUser?.role}
                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            required
                            >
                                <option value="Super Admin">Super Admin</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Created Date</label>
                            <input className='form-input pl-5 cursor-not-allowed' type='date' placeholder='Created Date' disabled/>
                        </div>
                        <div className="flex space-x-4 mt-5 mb-2">
                            <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={showEditHandler}>Cancel</button>
                            <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => editUser(token)}>Submit</button>
                        </div>
                    </div>
                </div>
                )}
                <div>
                    <DataTableExtensions
                    columns={columns}
                    data={ManageUserData}
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
                <div className='flex justify-end mt-3'>
                    <button className='main-btn' onClick={showMainHandler}>Close</button>
                </div>
            </div>
            )}
            
            {showRegistrationForm && (
                <div className=" flex justify-center items-center p-3">
                <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-12">REGISTRASI</h1>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-sm font-medium">Username</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FontAwesomeIcon icon={faUser} />
                                </i>
                                <input 
                                type="username" 
                                id="username" 
                                name="username" 
                                placeholder="Masukkan Username" 
                                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                required
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Email</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </i>
                                <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Masukkan email" 
                                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Password</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FontAwesomeIcon icon={faLock} />
                                </i>
                                <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Masukkan password" 
                                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Role</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FontAwesomeIcon icon={faUserShield} />
                                </i>
                                <select 
                                id="role" 
                                name="role" 
                                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={roles}
                                onChange={(e) => setRoles(e.target.value)} 
                                required
                                >
                                    <option value="0">User</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none" onClick={() => handleRegister(token)}>Submit</button>
                        <div className="text-center">
                            <button className="text-black hover:underline focus:outline-none" onClick={showMainHandler}>Close</button>
                        </div>
                    </div>
                    <div id="message"></div>
                </div>
            </div>
            )}
            
        </>
    )
}
export default ManageUser