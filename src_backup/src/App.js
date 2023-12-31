import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faFileInvoice,faChalkboard,faComputer,faChevronDown,faChevronUp,faBook,faList,faPlus,faPaperPlane,faClockRotateLeft,faBullhorn,faHandHolding,faRotateLeft, faBell, faThumbsUp, faThumbsDown, faTimes, faUsersGear} from '@fortawesome/free-solid-svg-icons';
import { faComments, faNewspaper, faFileLines } from '@fortawesome/free-regular-svg-icons';
import lmd from './resources/img/logo.png';
import profile from './resources/profile/p14.png';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import ListAsset from './pages/ListAsset';
import AddAsset from './pages/AddAsset';
import Return from './pages/Return';
import Lease from './pages/Lease';
import Submitted from './pages/Submitted';
import History from './pages/History';
import ManageUser from './pages/ManageUser';
import Login from './Login';
import Notfound from './pages/Notfound';
import MyReport from './pages/MyReport';
import Test from './pages/Test';
import { AuthProvider, useAuth } from './AuthContext';

function Home() {
  const { loggedIn, logout, username, Role } = useAuth();

  // Declare Variable
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [showPopoverNotif, setShowPopoverNotif] = useState(false);
  const [isPopoverLocked, setIsPopoverLocked] = useState(false);

  const handleMouseEnter = () => {
    if (!isPopoverLocked) {
      setShowPopoverNotif(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPopoverLocked && !isPopoverLocked) {
      setShowPopoverNotif(false);
    }
  };

  const handleClick = () => {
    if (showPopoverNotif) {
      setIsPopoverLocked(!isPopoverLocked );
      // handleMouseEnter (false);
    } else {
      setShowPopoverNotif(true);
    }
  };

  const [showPopoverNotifDeleteBerhasil, setShowPopoverNotifDeleteBerhasil] = useState(false);
  const togglePopoverNotifDeleteBerhasil = () => {
    setShowPopoverNotifDeleteBerhasil(!showPopoverNotifDeleteBerhasil);
  };
  const [showPopoverNotifDeleteGagal, setShowPopoverNotifDeleteGagal] = useState(false);
  const togglePopoverNotifDeleteGagal = () => {
    setShowPopoverNotifDeleteGagal(!showPopoverNotifDeleteGagal);
  };


  const sidebarStyles = {
    left: isSidebarOpen ? '0' : '-296px',
    transition: 'left 0.5s ease-in-out',
  };

  const mainContentStyles = {
    marginLeft: isSidebarOpen ? '296px' : '0',
    width: isSidebarOpen ? 'calc(100% - 296px)' : '100%',
    transition: 'margin 0.5s ease-in-out, width 0.5s ease-in-out',
  };

  const toggleIconStyles = {
    transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: 'transform 0.3s ease',
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      {/* NAVBAR */}
      <div className='flex fixed text-white items-center w-full justify-between z-10 bg-gray-800 h-[60px] px-7'>
        <div className='flex justify-between items-center'>
          <div id='sidebarToggle' className={`navbar-toggle flex items-center justify-center bg-slate-600 w-[40px] h-[40px] rounded-lg cursor-pointer ease-in-out duration-300 ml-0 ${isSidebarOpen ? '' : 'sidebar-closed'}`} onClick={toggleSidebar}>
            <button className='toggle-box'>
              <FontAwesomeIcon icon={faArrowLeft} className='toggle-icon' style={toggleIconStyles} />
            </button>
          </div>
          <div className='logo pl-6'>
            <img src={lmd} alt='logohe' className='w-[150px] h-auto flex m-auto items-center' />
          </div>
        </div>
        <div className='flex items-center'>
          <img src={profile} alt='profile' className='w-9 h-9 rounded-full' />
          {username ? (
          <div className='font-semibold ml-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[100px]'>{username}</div>
          ) : (
          <div className='font-semibold ml-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[100px]'>Guest</div>
          )}

          { /* Notif */}
          <div className='ml-4'>
              <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} className='bg-slate-600 w-[40px] h-[40px] rounded-lg'>
                <FontAwesomeIcon icon={faBell} shake size='lg' />
              </button>
          </div>
          {showPopoverNotif && (
            <div className='flex flex-col max-h-screen overflow-y-scroll absolute top-16 right-1 gap-1'>
              {/* - Berhasil- */}
              <div class="relative">
                <div class="flex items-center lg:w-[300px] md:w-[250px] sm:w-[200px] p-4 opacity-90 rounded-lg shadow bg-gray-800">
                  <div class="flex bg-green-500 items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </div>
                  <div class="ml-3 text-left text-sm font-normal break-all">Asset berhasil diajukan :)</div>
                  <button type="button" class="text-gray-400 hover:text-gray-900 rounded-lg p-2 absolute top-0 right-1 inline-flex h-6 w-6" onClick={togglePopoverNotifDeleteBerhasil}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                {showPopoverNotifDeleteBerhasil && (
                <div class="flex flex-col items-center lg:w-[300px] md:w-[250px] sm:w-[200px]  opacity-90 rounded-lg shadow bg-gray-800">
                  <div class="ml-3 text-left text-sm font-normal break-all">Ingin menghapus notifikasi ini?</div>
                  <div class="flex justify-center space-x-4 p-2">
                    <button type="button" class="text-green-400 hover:text-green-900 rounded-lg w-auto flex-grow">Yes</button>
                    <button type="button" class="text-red-400 hover:text-red-900 rounded-lg w-auto flex-grow" onClick={togglePopoverNotifDeleteBerhasil}>No</button>
                  </div>
                </div>
                )}
              </div>
              {/* -Berhasil- */}
              {/* -Gagal- */}
              <div class="relative">
                <div class="flex items-center lg:w-[300px] md:w-[250px] sm:w-[200px] p-4 opacity-90 rounded-lg shadow bg-gray-800">
                  <div class="flex bg-red-500 items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </div>
                  <div class="ml-3 text-left text-sm font-normal break-all">Asset gagal diajukan :(</div>
                  <button type="button" class="text-gray-400 hover:text-gray-900 rounded-lg p-2 absolute top-0 right-1 inline-flex h-6 w-6" onClick={togglePopoverNotifDeleteGagal}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                {showPopoverNotifDeleteGagal && (
                <div class="flex flex-col items-center lg:w-[300px] md:w-[250px] sm:w-[200px]  opacity-90 rounded-lg shadow bg-gray-800">
                  <div class="ml-3 text-left text-sm font-normal break-all">Ingin menghapus notifikasi ini?</div>
                  <div class="flex justify-center space-x-4 p-2">
                    <button type="button" class="text-green-400 hover:text-green-900 rounded-lg w-auto flex-grow">Yes</button>
                    <button type="button" class="text-red-400 hover:text-red-900 rounded-lg w-auto flex-grow" onClick={togglePopoverNotifDeleteGagal}>No</button>
                  </div>
                </div>
                )}
              </div>
              {/* -Gagal- */}
            </div>      
              )}
        </div>
      </div>
      {/* CONTAINER */}
      <div className='flex'>
        {/* SIDEBAR */}
        <div className={`sidebar text-white fixed z-20 bg-gray-800 w-[296px] h-screen mt-[61px] ${isSidebarOpen ? 'sidebar-opened' : 'sidebar-closed'}`} id='sidebar' style={sidebarStyles}>
          <div className='flex mt-5 justify-center mb-5'>
            <div className='flex text-center font-bold uppercase text-2xl mt-4 tracking-wider'>Asset<br />Management</div>
          </div>
          <div className='mt-14 p-4'>
            <ul className='space-y-2'>
              {/* Dashboard */}
              <li className='menu-item'>
                <Link to='/'>
                  <button className='flex items-center'>
                    <FontAwesomeIcon icon={faChalkboard} /><span className='pl-2 dashboard-menu'>Dashboard</span>
                  </button>
                </Link>
              </li>
              {/* Chat */}
              <li className='menu-item'>
                <Link to='/chat'>
                  <button className='flex items-center'>
                    <FontAwesomeIcon icon={faComments} /><span className='pl-2 chat-menu'>Chat</span>
                  </button>
                </Link>
              </li>
              {/* Asset */}
              <li className='menu-item'>
                <button className='flex items-center justify-between px-5' onClick={() => toggleMenu('asset')}>
                  <div>
                    <FontAwesomeIcon icon={faComputer} />
                    <span className='pl-2'>Assets</span>
                  </div>
                  <FontAwesomeIcon icon={activeMenu === 'asset' ? faChevronUp : faChevronDown} className='drop-arrow' />
                </button>
                {activeMenu === 'asset' && (
                  <ul className='mt-2 ease-in-out'>
                    <li className='submenu-item bg-gray-600'>
                      <Link to='/listasset'>
                        <button className='flex items-center'>
                          <FontAwesomeIcon icon={faList} /><span className='pl-2'>List of Asset</span>
                        </button>
                      </Link>
                    </li>
                    {Role === 2 || Role === 1 ? (
                      <li className='submenu-item bg-gray-600'>
                        <Link to='/addasset'>
                          <button className='flex items-center'>
                            <FontAwesomeIcon icon={faPlus} /><span className='pl-2'>Add an Asset</span>
                          </button>
                        </Link>
                      </li>
                    ) : null}
                    {loggedIn ? (
                      <li className='submenu-item bg-gray-600'>
                        <Link to='/lease'>
                          <button className='flex items-center'>
                            <FontAwesomeIcon icon={faHandHolding} /><span className='pl-2'>Lease</span>
                          </button>
                        </Link>
                      </li>
                    ) : null}
                    {loggedIn ? (
                      <li className='submenu-item bg-gray-600'>
                        <Link to='/return'>
                          <button className='flex items-center'>
                            <FontAwesomeIcon icon={faRotateLeft} /><span className='pl-2'>Return</span>
                          </button>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
              {/* Report */}
              {Role === 2 || Role === 1 ? (
                <li className='menu-item'>
                  <button className='flex items-center justify-between px-5' onClick={() => toggleMenu('report')}>
                    <div>
                      <FontAwesomeIcon icon={faBook} />
                      <span className='pl-2'>Reports</span>
                    </div>
                    <FontAwesomeIcon icon={activeMenu === 'report' ? faChevronUp : faChevronDown} className='drop-arrow' />
                  </button>
                  {activeMenu === 'report' && (
                    <ul className='mt-2'>
                      <li className='submenu-item bg-gray-600'>
                        <Link to='/submitted'>
                          <button className='flex items-center'>
                            <FontAwesomeIcon icon={faPaperPlane} /><span className='pl-2'>Submitted</span>
                          </button>
                        </Link>
                      </li>
                      <li className='submenu-item bg-gray-600'>
                        <Link to='/history'>
                          <button className='flex items-center'>
                            <FontAwesomeIcon icon={faClockRotateLeft} /><span className='pl-2'>History</span>
                          </button>
                        </Link>
                      </li>
                      <li className='submenu-item bg-gray-600'>
                        <Link to='/myreport'>
                          <button className='flex items-center'>
                            <FontAwesomeIcon icon={faFileLines} /><span className='pl-2'>My Report</span>
                          </button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ) : null}
              {/* Manage User */}
              {Role === 2 &&(
                <li className='menu-item'>
                  <Link to='/manageuser'>
                    <button className='flex items-center'>
                      <FontAwesomeIcon icon={faUsersGear} />
                      <span className='pl-2 chat-menu'>Manage User</span>
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          {loggedIn ? (
            <div className='px-7 py-1'>
            <Link to='/Login'>
              <button onClick={logout} className='bg-gray-600 rounded-lg text-sm hover:bg-[#323b49]'>Log Out</button>
            </Link>
            </div>
          ) : (
            <div className='px-7 py-0.5'>
            <Link to='/Login'>
              <button className='bg-gray-600 rounded-lg text-sm hover:bg-[#323b49]'>Sign In</button>
            </Link>
            </div>
          )}
        </div>
        {/* MAIN CONTENT */}
        <div className='bg-[#efefef] p-[20px] flex flex-col min-h-screen w-screen mt-[60px]' style={mainContentStyles}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/listasset" element={<ListAsset />} />
            <Route 
              path="/addasset" 
              element={Role === 2 || Role === 1 ? <AddAsset /> : <Dashboard />}
            />
            <Route 
              path="/lease" 
              element={loggedIn ? <Lease /> : <Login />} />
            <Route 
              path="/return" 
              element={loggedIn ? <Return /> : <Login />} />
            <Route 
              path="/submitted" 
              element={Role === 2 || Role === 1 ? <Submitted /> : <Dashboard />} />
            <Route 
              path="/history" 
              element={Role === 2 || Role === 1 ? <History /> : <Dashboard />} />
            <Route 
              path="/manageuser" 
              element={Role === 2 ? <ManageUser /> : <Dashboard />}
            />
            <Route
              path="/login"
              element={loggedIn ? <Navigate to="/" /> : <Login />}
            />
            <Route path="/myreport" element={<MyReport />} />
            <Route path="*" element={<Notfound />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;