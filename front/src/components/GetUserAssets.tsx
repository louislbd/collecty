import React, { useEffect, useState } from 'react';
import { apiService } from '../service/api';
import { useSelector } from 'react-redux';
import { RootState } from '../service/store';
import PopUpCreateOffer from './PopUpCreateOffer';
import { showSuccess } from './Tostify/PopUp';

export interface AssetDetailsProps {
    asset_name: string;
    asset_description: string;
    asset_price: number;
    created_at: string;
    asset_id: string;
    user_id: string;
    nftoken_id: string;
    xrp_address: string;
    image_url: string;

}


const GetUserAssets: React.FC = () => {
    const [assets, setAssets] = useState<AssetDetailsProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [assetDetails, setAssetDetails] = useState<AssetDetailsProps[]>([]);
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchAssets = () => {
        if (!userId) return;
        setLoading(true);

        apiService.get({
            url: `assets/${userId}`,
            store: { token: token, user_id: userId },
            needAuth: true
        })
            .then(response => {
                setAssets(response.data);
                setLoading(false);
                console.log(response.data);
                if (response.data.length > 0) showSuccess('Assets fetched!');
            })
            .catch(error => {
                console.error('There was an error!', error);
                setLoading(false);
                setAssetDetails([]);
            }).finally(() => {
                setLoading(false);
            });
    };


    function openCreateOfferModal(currentAsset: AssetDetailsProps) {
        setOpenCreateModal(true);
        setAssetDetails([currentAsset]);
    };

    useEffect(() => {
        if (!userId) return;
        if (!loading) return;
        fetchAssets();
        // eslint-disable-next-line
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Assets</h1>
            <div className='w-full h-full flex flex-wrap'>
                {assets && assets.length > 0 ? assets.map((asset: AssetDetailsProps) => (
                    <div className='ring-2 ring-collecty-p m-3 rounded-md w-72 h-auto' key={`asssets-${asset.asset_name}`}>
                        <div className='w-auto h-auto'>
                            <img src={`http://localhost:8080/${asset.image_url}`} alt={asset.asset_name} className='w-auto h-auto' />
                        </div>
                        <div className='p-2'>
                            <h1 className='font-semibold pl-2 py-3'>{asset.asset_name}</h1>
                            <div className='p-2 space-x-3 flex'>
                                <button className="w-2/4 h-full rounded-md cursor-pointer ring-1 bg-collecty-p p-2" onClick={() => openCreateOfferModal(asset)}>Create Offer</button>
                            </div>
                        </div>
                    </div>
                )) : <p>No assets</p>
                }
            </div>
            <div>
                {openCreateModal ? (
                    <PopUpCreateOffer assetsDetails={assetDetails} closeModal={() => setOpenCreateModal(false)} />
                ) : <></>}
            </div>
        </div>
    );
};

export default GetUserAssets;