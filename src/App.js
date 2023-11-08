import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChalkboard,faComputer,faChevronDown,faChevronUp,faBook,faList,faPlus,faPaperPlane,faClockRotateLeft,faHandHolding,faRotateLeft, faBell, faThumbsUp, faThumbsDown, faTimes, faUsersGear, faTriangleExclamation, faEnvelope, faUserShield} from '@fortawesome/free-solid-svg-icons';
import { faComments, faFileLines } from '@fortawesome/free-regular-svg-icons';
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
import { Bounce, Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Home() {
  const { loggedIn, logout, username, Role, Roles, email, Notification, setNotification, setNotificationStatus, NotificationStatus, NotificationInfo, setNotificationInfo } = useAuth();

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


  const notify = () => {
    toast.success("Wow so easy !", {
      icon: "❤️"
    })
    toast.error("Wow so easy !", {
      icon: "😁"
    })
    toast.warning("Wow so easy !", {
      icon: "😎"
    })
  }

  // Notifikasi
  if (NotificationStatus) {
    setTimeout(() => {
      setNotificationStatus(false);
      setNotification('');
      setNotificationInfo('');
    }, 4000);
  } else {
    setNotificationStatus(false);
    setNotification('');
    setNotificationInfo('');
  }  

  // popover profile
  const [showPopoverProfile, setShowPopoverProfile] = useState(false);
  const togglePopoverProfile = () => {
    setShowPopoverProfile(!showPopoverProfile);
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
      {loggedIn ? (
        <div className='flex fixed text-white items-center w-full justify-between z-50 bg-gray-800 h-[60px] px-7'>
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
            {/* Profile */}
            {loggedIn ? (
              <div className='flex items-center cursor-default' onMouseEnter={togglePopoverProfile} onMouseLeave={togglePopoverProfile}>
                <img src={profile} alt='profile' className='w-9 h-9 rounded-full' />
                <div className='font-semibold ml-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[60px]'>
                  {username}
                  {showPopoverProfile && (
                    <div className="flex flex-col opacity-90 justify-center p-4 shadow-md rounded-xl lg:w-[300px] md:w-[250px] sm:w-[220px] bg-gray-900 dark:text-gray-100 absolute top-16 right-1">
                      <img src={profile} alt='profile' className="w-14 h-14 mx-auto rounded-full dark:bg-gray-500 aspect-square" />
                      <div className="space-y-2 text-center divide-y divide-gray-700">
                        <div className="my-1 space-y-1 break-all">
                          <h2 className=" font-semibold text-sm break-all">{username}</h2>
                        </div>
                        <div className="flex justify-center item-center content-center text-gray-400 pt-1 align-center">
                          <div className='tex-gray-400 text-xs pr-2'>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <h3 className='text-xs'>{email}</h3>
                          </div>
                          <div className='text-gray-400 text-xs pl-2'>
                            <FontAwesomeIcon icon={faUserShield} />
                            <h3 className='text-xs'>{Roles}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex items-center cursor-default' onMouseEnter={togglePopoverProfile} onMouseLeave={togglePopoverProfile}>
                <img src={profile} alt='profile' className='w-9 h-9 rounded-full' />
                <div className='font-semibold ml-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[60px]'>
                  Guest
                  {showPopoverProfile && (
                    <div className="flex flex-col opacity-90 justify-center p-4 shadow-md rounded-xl lg:w-[300px] md:w-[250px] sm:w-[220px] bg-gray-900 dark:text-gray-100 absolute top-16 right-1">
                      <img src={profile} alt='profile' className="w-14 h-14 mx-auto rounded-full dark:bg-gray-500 aspect-square" />
                      <div className="space-y-2 text-center divide-y divide-gray-700">
                        <div className="my-1 space-y-1 break-all">
                          <h2 className=" font-semibold text-sm break-all">Guest</h2>
                        </div>
                        <div className="flex justify-center item-center content-center text-gray-400 pt-1 align-center">
                          <div className='tex-gray-400 text-xs pr-2'>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <h3 className='text-xs'>guest@gmail.com</h3>
                          </div>
                          <div className='text-gray-400 text-xs pl-2'>
                            <FontAwesomeIcon icon={faUserShield} />
                            <h3 className='text-xs'>Guest</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          <div>
            <button onClick={notify}>Notify !</button>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Bounce}
            />
          </div>
            {NotificationStatus ? (
              <div className={`notification flex flex-col max-h-screen absolute top-16 right-1 gap-1 ${NotificationStatus ? 'slide-in' : 'slide-out'}`}>
                <div class="flex items-center lg:w-[300px] md:w-[250px] sm:w-[200px] p-4 opacity-90 rounded-lg shadow bg-gray-900">
                  {NotificationInfo == 'Error' ? (
                    <div class="flex bg-red-500 items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </div>
                  ) : (
                    <div class="flex bg-green-500 items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </div>
                  )}
                  <div class="ml-3 text-left text-sm font-normal break-all text-white">{Notification}</div>
                </div>
              </div>
            ) : null }
          </div>
        </div>
      ) : null }

      {/* CONTAINER */}
      {loggedIn ? (
      <div className='flex'>
        {/* SIDEBAR */}
        <div className={`sidebar text-white fixed z-50 bg-gray-800 w-[296px] h-screen mt-[61px] ${isSidebarOpen ? 'sidebar-opened' : 'sidebar-closed'}`} id='sidebar' style={sidebarStyles}>
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
                      {Role === 2 || Role === 1 ? (
                        <li className='submenu-item bg-gray-600'>
                          <Link to='/submitted'>
                            <button className='flex items-center'>
                              <FontAwesomeIcon icon={faPaperPlane} /><span className='pl-2'>Submitted</span>
                            </button>
                          </Link>
                        </li>
                      ) : null}
                      {Role === 2 || Role === 1 ? (
                        <li className='submenu-item bg-gray-600'>
                          <Link to='/history'>
                            <button className='flex items-center'>
                              <FontAwesomeIcon icon={faClockRotateLeft} /><span className='pl-2'>History</span>
                            </button>
                          </Link>
                        </li>
                      ) : null}
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
          {loggedIn ? (
            <Route path="/" element={<Dashboard />} />
          ) : (
            <Route path="/" element={<Login />} />
          )}
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
    ) : <Login /> }
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