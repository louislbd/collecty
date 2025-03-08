import React from 'react';
import GetUserAssets from '../components/GetUserAssets';

const Vault: React.FC = () => {

    return (
        <div>
            <h1 className='text-3xl font-bold'>Your Vault:</h1>
            <div className='w-full h-[2px] rounded-sm bg-[#27AE60] my-4'></div>
            <GetUserAssets />
        </div>
    );
};

export default Vault;