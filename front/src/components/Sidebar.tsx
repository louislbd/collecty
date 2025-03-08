import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setLogout } from "../service/store";
import { NavLink } from "react-router"
import React from 'react';

const UserSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function logout() {
        dispatch(setLogout());
        navigate('/');
    }

    return (
        <>
            <div className='w-full h-full bg-[#1B1C1E] p-4 flex flex-col'>
                <div>
                    <p className='font-bold text-lg text-[#27AE60]'>
                        Collecty Inc.
                    </p>
                </div>
                <div className='w-full h-[2px] bg-[#27AE60] text-center my-2 rounded-sm'></div>
                <div className='flex-1'>
                    <div className='p-3 flex flex-col h-full justify-between w-full text-white'>    
                        <div className='flex flex-col h-full space-y-6 mt-4 text-center'>
                            <NavLink to='/shop' className={({ isActive }) => `${isActive ? 'bg-[#27AE60] font-bold' : ''} p-1.5 rounded-md hover:bg-[#27ae5fa0]`}>
                                Shop
                            </NavLink>
                            <NavLink to='/create-painting' className={({ isActive }) => `${isActive ? 'bg-[#27AE60] font-bold' : ''} p-1.5 rounded-md hover:bg-[#27ae5fa0]`}>
                                Create painting
                            </NavLink>
                            <NavLink to='/your-offers' className={({ isActive }) => `${isActive ? 'bg-[#27AE60] font-bold' : ''} p-1.5 rounded-md hover:bg-[#27ae5fa0]`}>
                                Your Offers
                            </NavLink>
                            <NavLink to='/your-collecty-vault' className={({ isActive }) => `${isActive ? 'bg-[#27AE60] font-bold' : ''} p-1.5 rounded-md hover:bg-[#27ae5fa0]`}>
                                Your Vault
                            </NavLink>
                        </div>
                        <div className='mt-auto'>
                            <button className='p-1.5 px-2 rounded-md ring-2 ring-[#27AE60] hover:bg-[#27AE60]' onClick={() => logout()}>
                                Logout
                         </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserSidebar;