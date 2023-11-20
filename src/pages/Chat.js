import React from 'react';
import { Input, } from "@material-tailwind/react";

const Chat = () => {

    return (
        <>
            <div className='p-2'>
                <div className='bg-white mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-xl font-semibold'>Chat</h2>
                </div>
            </div>

            <div className='p-2'>
                <div className='p-2 bg-white rounded'>
                    <div className="flex w-72 p-2 flex-col gap-6">
                        <Input variant="static" label="Static" placeholder="Static" />
                        <Input variant="standard" label="Standard" />
                        <Input variant="outlined" label="Outlined" />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Chat