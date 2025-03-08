import React, { useEffect, useState } from 'react';
import { apiService } from '../service/api';
import { useSelector } from 'react-redux';
import { RootState } from '../service/store';
import PopUpCreateOffer from './PopUpBuyNftOffer';
import { showSuccess } from './Tostify/PopUp';
import { OffersDetailsProps } from '../pages/Shop';
import { AssetDetailsProps } from './GetUserAssets';

interface GetOfferDetailsPopUpProps {
    offers: OffersDetailsProps;
    closeModal: (isOpen: boolean) => void;
}


const GetOfferDetailsPopUp: React.FC<GetOfferDetailsPopUpProps> = ({ offers, closeModal }) => {
    const [assets, setAssets] = useState<AssetDetailsProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [assetDetails, setAssetDetails] = useState<AssetDetailsProps[]>([]);
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchAssets = () => {
        if (!userId) return;
        setLoading(true);

        apiService.get({
            url: `assets/${userId}/${offers.nft_id}/get-asset-from-uuid`,
            store: { token: token, user_id: userId },
            needAuth: true
        })
            .then(response => {
                setAssets(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
                setLoading(false);
                setAssetDetails([]);
            }).finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!userId) return;
        if (!loading) return;
        fetchAssets();
        // eslint-disable-next-line
    }, [offers.nft_id]);

    const closeModalFunc = () => {
        setAssetDetails([]);
        closeModal(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 p-2 rounded-lg shadow-md flex justify-center items-center' onClick={closeModalFunc}>
            <div className='relative z-50 bg-gray-800 w-3/5 h-[70%] p-1 rounded-lg shadow-md' onClick={(e) => e.stopPropagation()}>
                <div className='w-full h-full p-4 text-white font-semibold'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-4xl font-normal'>Offer: {offers.offer_id}</h2>
                        <button onClick={closeModalFunc} className='text-2xl font-semibold text-collecty-p hover:font-bold'>X</button>
                    </div>
                    <div className='w-full h-0.5 my-3 rounded-sm bg-collecty-p'></div>
                    <div className='space-y-10 h-full w-auto flex flex-col'>
                        <img src={`${assetDetails[0].image_url}`} alt="" />
                        <ul>
                            <li>Offer ID: {offers.offer_id}</li>
                            <li>Offer Price: {offers.price}</li>
                            <li>Offer Created At: {offers.created_at}</li>
                            <li>Offer Description: {assetDetails[0].asset_description}</li>

                        </ul>                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetOfferDetailsPopUp;