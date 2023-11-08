import React, { useState } from 'react'
import { Popover, PopoverHandler, PopoverContent, } from "@material-tailwind/react";


const Chat = () => {

  const [showExport, setShowExport] = useState(false);
  const [openCsvPopover, setOpenCsvPopover] = useState(false);
  const [openPdfPopover, setOpenPdfPopover] = useState(false);
  
  const triggersCsv = {
    onMouseEnter: () => setOpenCsvPopover(true),
    onMouseLeave: () => setOpenCsvPopover(false),
  };
  const triggersPdf = {
    onMouseEnter: () => setOpenPdfPopover(true),
    onMouseLeave: () => setOpenPdfPopover(false),
  };

  const showExportHandler = () => {
    setShowExport((prev) => !prev);
  }
  
    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Chat page :)</h2>
                </div>
            </div>

            <div className='flex space-x-4'>
              <div className='flex items-center p-8'>
                <button className='main-btn' onClick={showExportHandler}>Export</button>
              </div>
              {showExport && (
              <div className='flex flex-col space-y-1'>
                  <Popover open={openCsvPopover} handler={setOpenCsvPopover} placement='right' animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
                  <div className='flex'>
                    <PopoverHandler {...triggersCsv}>
                     <button className='main-btn'>CSV</button>
                    </PopoverHandler>
                    <PopoverContent {...triggersCsv} className='bg-indigo-500 shadow-none z-10 py-0.5 px-6 border-none'>
                      <div className='flex gap-2'>
                        <button className='main-btn'>1</button>
                        <button className='main-btn'>2</button>
                        <button className='main-btn'>3</button>
                      </div>
                    </PopoverContent>
                  </div>
                  </Popover>
                  <Popover open={openPdfPopover} handler={setOpenPdfPopover} placement='right' animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
                  <div className='flex'>
                    <PopoverHandler {...triggersPdf}>
                      <button className='main-btn'>PDF</button>
                    </PopoverHandler>
                    <PopoverContent {...triggersPdf} className='bg-indigo-500 shadow-none z-10 py-0.5 px-6 border-none'>
                      <div className='flex gap-2'>
                        <button className='main-btn'>4</button>
                        <button className='main-btn'>5</button>
                        <button className='main-btn'>6</button>
                      </div>
                    </PopoverContent>
                  </div>
                  </Popover>
              </div>
              )}
            </div>
        </>
    )
}
export default Chat