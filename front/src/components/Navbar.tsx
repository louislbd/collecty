import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () =>{


    return (
        <>
            <div className='w-full h-full bg-[#1B1C1E] p-4 flex'>
                <div className='flex-1'>
                    <div className='flex text-white'>    
                        <div className='space-x-4'>
                            <NavLink to='/' className={({ isActive }) => `${isActive ? 'bg-[#27AE60]' : ''} p-1.5 rounded-md hover:bg-[#27AE60]`}>
                                Home
                            </NavLink>
                            <NavLink to='/about-us' className={({ isActive }) => `${isActive ? 'bg-[#27AE60]' : ''} p-1.5 rounded-md hover:bg-[#27AE60]`}>
                                About Us
                            </NavLink>
                            <NavLink to='/how-does-it-work' className={({ isActive }) => `${isActive ? 'bg-[#27AE60]' : ''} p-1.5 rounded-md hover:bg-[#27AE60]`}>
                                how does it work ?
                            </NavLink>
                        </div>
                        <div className='ml-auto'>
                            <NavLink to='/auth/login' className={({ isActive }) => `${isActive ? 'bg-[#27AE60] p-1.5 px-2 rounded-md' : ''} p-1.5 rounded-md hover:bg-[#27AE60] ring-2 ring-[#27AE60]`}>
                                Login / Regsiter
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;