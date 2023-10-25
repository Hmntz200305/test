import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [DataListAsset, setDataListAsset] = useState([]);
  const [DataListAssetExcept, setDataListAssetExcept] = useState([]);
  const [StatusOptions, setStatusOptions] = useState([]);
  const [LocationOptions ,setLocationOptions] = useState([]);
  const [CategoryOptions, setCategoryOptions] = useState([]);
  const [ManageUserData, setManageUserData] = useState([]);
  const [Role, setRole] = useState([]);
  const [AdminList, setAdminList] = useState([]);
  const [SubmitedList, setSubmitedList] = useState([]);
  const [DashboardInfo, setDashboardInfo] = useState([]);
  const [onRequest, setOnRequest] = useState([]);
  const [inLoans, setInLoans] = useState([]);
  const [CountinLoans, setCountinLoans] = useState([]);
  const [DataLoan, setDataLoan] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Cek apakah ada token yang tersimpan di localStorage
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");
      const storedUsername = localStorage.getItem("username");
  
      if (storedToken && storedEmail && storedUsername ) {
        setToken(storedToken); // Set token dari localStorage
        setEmail(storedEmail); // Set email dari localStorage
        setUsername(storedUsername); // Set username dari localStorage
        setLoggedIn(true);
        try {
          const response = await fetch("http://sipanda.online:5000/api/authentication", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: storedToken,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
            setCountinLoans(data.data);
          } else {
            console.error("Error:", response.status, response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        } 
      }
    }
  
    fetchData();
    // eslint-disable-next-line
  }, [Role]);
  
  

  const login = (data) => {
    setToken(data.token);
    setEmail(data.email);
    setUsername(data.username);
    setRole(data.role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("username", data.username);
    setLoggedIn(true);
  };

  const logout = () => {
    setToken("");
    setEmail("");
    setUsername("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setLoggedIn(false);
  };

  const refreshAssetData = () => {
    fetch('http://sipanda.online:5000/api/getdata-listasset')
      .then((response) => response.json())
      .then((data) => {
        setDataListAsset(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshAssetDataExcept = () => {
    fetch('http://sipanda.online:5000/api/getdata-listassetexcept')
      .then((response) => response.json())
      .then((data) => {
        setDataListAssetExcept(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshStatusList = () => {
    fetch('http://sipanda.online:5000/api/getdata-statuslist')
      .then((response) => response.json())
      .then((data) => {
        setStatusOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshLocationList = () => {
    fetch('http://sipanda.online:5000/api/getdata-locationlist')
      .then((response) => response.json())
      .then((data) => {
        setLocationOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshCategoryList = () => {
    fetch('http://sipanda.online:5000/api/getdata-categorylist')
      .then((response) => response.json())
      .then((data) => {
        setCategoryOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshManageUser = () => {
    fetch('http://sipanda.online:5000/api/manageuser')
      .then((response) => response.json())
      .then((data) => {
        setManageUserData(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshAdminList = () => {
    fetch('http://sipanda.online:5000/api/adminlist')
      .then((response) => response.json())
      .then((data) => {
        setAdminList(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshSubmitedList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };
    
    fetch('http://sipanda.online:5000/api/leasesubmited', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setSubmitedList(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshDashboardInfo = () => {
    fetch('http://sipanda.online:5000/api/DashboardInfo')
      .then((response) => response.json())
      .then((data) => {
        setDashboardInfo(data);
        setOnRequest(data['on request']);
        setInLoans(data['in loans']);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshDataLoan = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };
    
    fetch('http://sipanda.online:5000/api/dataloan', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDataLoan(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }
  
  return (
    <AuthContext.Provider value={{ token, email, username, loggedIn, login, logout, refreshAssetData, DataListAsset, refreshStatusList, StatusOptions, refreshLocationList, LocationOptions, refreshCategoryList, CategoryOptions, refreshManageUser, ManageUserData, Role, DataListAssetExcept, refreshAssetDataExcept, AdminList, refreshAdminList, SubmitedList, refreshSubmitedList, refreshDashboardInfo, DashboardInfo, onRequest, inLoans, CountinLoans, refreshDataLoan, DataLoan }}>
      {children}
    </AuthContext.Provider>
  );
};
