import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/store';
import Navbar from '../Navbar';
import UserSidebar from '../Sidebar';
import { ToastContainer } from 'react-toastify';

const GlobalUserLayout: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);

    return (
        <div className='h-full w-screen'>
            <ToastContainer />
            {!token && token == null ?
            
            <div className='bg-blue w-full h-16'>
                <div className='w-full h-full flex flex-col'>
                    <Navbar />
                    <div>
                        <Outlet />
                    </div>
                </div>
            </div>
            
            :

            <div className='h-screen w-full overflow-hidden'>
                <div className='w-full h-full flex'>
                    <div className='w-[18rem] h-full'>
                        <UserSidebar />
                    </div>
                    <div className='w-full h-full text-white p-4 overflow-x-hidden overflow-y-scroll bg-gray-800'>
                        <Outlet />
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default GlobalUserLayout;