import React from 'react';
import { Store, ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

const Chat = () => {
  return (
    <>
      <ReactNotifications />
      <div className='p-2'>
        <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
          <h2 className='text-white'>Selamat datang di Chat page :)</h2>
        </div>
      </div>
      <button
        onClick={() => {
          Store.addNotification({
            title: "Wonderful!",
            message: "teodosii@react-notifications-component",
            type: "success",
            insert: "top",
            container: "center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        }}
      >
        Add notification
      </button>
    </>
  );
}

export default Chat;
