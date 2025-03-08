import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/store';

const AuthLayout: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const navigate = useNavigate();

    useEffect(() => {
        if (token || userId) {
            navigate('/', { replace: true });
        }
    }, [token, userId, navigate]);

    if (token || userId) {
        return null;
    }

    console.log('auth layout', token, userId);

    return (
        <div className="w-full h-screen bg-[#222831]">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-3xl p-10 font-semibold text-white">Welcome to Collecty</h1>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
