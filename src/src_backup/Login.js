import React, { useState } from 'react'
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // POST ke API
    const handleLogin = async () => {
        try {
          const response = await fetch("http://sipanda.online:5000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
    
          if (response.status === 200) {
            const data = await response.json();
            login(data);
            console.log("Login Success");
          } else {
            console.log("Login failed. Please check your credentials.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

    return (
        <div className=''>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Login page :)</h2>
                </div>
            </div>
            <div className=" flex justify-center items-center p-3">
                <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-12">LOGIN</h1>
                    <div className="space-y-4">
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
                                  placeholder="Enter your email"
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
                                  placeholder="Enter your password"
                                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                />
                            </div>
                        </div>
                        <button
                          type="submit"
                          onClick={handleLogin}
                          className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none"
                        >
                          Login
                        </button>
                        <div className="text-center">
                            <a href='/'><button className="text-black hover:underline focus:outline-none">Back</button></a>
                        </div>
                    </div>
                    <div id="message"></div>
                </div>
            </div>
        </div>
    )
}
export default Login