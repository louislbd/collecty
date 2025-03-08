import React from 'react';
import { Painting } from '../datas/Painting';

const PaintingCard: React.FC<{ painting: Painting }> = ({ painting }) => {
    return (
        <>
            <div key={painting.id} className='bg-black w-56 h-auto p-2 rounded-md overflow-hidden'>
                <div className='flex flex-col text-[#27AE60] font-semibold'>
                    <p>{painting.author}</p>
                    <p>{painting.name}</p>
                    <img alt={painting.name} src={painting.imageUrl} className='w-auto h-fit object-center' />
                </div>
            </div>
        </>
    );
}

export default PaintingCard;