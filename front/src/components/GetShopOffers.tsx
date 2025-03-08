import React, { useEffect, useState } from 'react';
import { apiService } from '../service/api';
import { useSelector } from 'react-redux';
import { RootState } from '../service/store';
import { showSuccess } from './Tostify/PopUp';
import { AssetDetailsProps } from './GetUserAssets';
import { OffersDetailsProps } from '../pages/Shop';
import PopUpBuyNftOffer from './PopUpBuyNftOffer';

interface ShopOffersProps {
    offers: any[];
    isLoading: boolean;
}

const GetShopOffers: React.FC<ShopOffersProps> = ({
    offers,
    isLoading
}) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [assetDetails, setAssetDetails] = useState<OffersDetailsProps[]>([]);
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const token = useSelector((state: RootState) => state.auth.token);


    const openCreateOfferModal = (currentAsset: OffersDetailsProps) => {
        setOpenCreateModal(true);
        setAssetDetails([currentAsset]);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(offers);

    return (
        <div>
            <div className='w-full h-full flex flex-wrap'>
                {offers && offers.length > 0 ? offers.map((offer: any) => (
                    <div className='ring-2 ring-collecty-p m-3 rounded-md w-72 h-auto overflow-hidden' key={`asssets-${offer.nftId}`}>
                        <div className='w-auto h-auto'>
                            <img src={`http://localhost:8080/${offer.nft_url}`} alt={offer.nftId} className='w-auto h-auto' />
                        </div>
                        <div className='p-2'>
                            <h1 className='font-semibold pl-2 py-3'>Name: {offer.asset_name}</h1>
                            <h1 className='font-semibold pl-2 py-3'>Price: {offer.price}</h1>
                            <div className='p-2 space-x-3 flex justify-center'>
                                <button className="w-2/4 h-full rounded-md cursor-pointer ring-1 bg-collecty-p p-2" onClick={() => openCreateOfferModal(offer)}>Buy NFT</button>
                            </div>
                        </div>
                    </div>
                )) : <p>No Offers</p>
                }
            </div>
            <div>
                {openCreateModal ? (
                    <PopUpBuyNftOffer offerDetails={assetDetails} closeModal={() => setOpenCreateModal(false)} />
                ) : <></>}
            </div>
        </div>
    );
};

export default GetShopOffers;