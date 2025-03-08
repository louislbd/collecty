import React from 'react';
import GetUserOffers from '../components/GetUserOffers';

const YourOffers: React.FC = () => {

    return (
        <div>
            <h1 className='text-3xl font-bold'>Your Offers:</h1>
            <div className='w-full h-[2px] rounded-sm bg-[#27AE60] my-4'></div>
            <GetUserOffers />
        </div>
    );
};

export default YourOffers;