import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../service/store';
import { apiService } from '../service/api';
import { AssetDetailsProps } from './GetUserAssets';
import GlobalInput from './Inputs/GlobalInput';
import { showError, showSuccess } from './Tostify/PopUp';

interface PopUpAssetDetailsProps {
    assetsDetails: AssetDetailsProps[];
    closeModal: (isOpen: boolean) => void;
}

const PopUpCreateOffer: React.FC<PopUpAssetDetailsProps> = ({
    assetsDetails,
    closeModal,
}) => {

    const [secret, setSecret] = useState<string>('');
    const [assetDetailss, setAssetDetailss] = useState({
        assetId: assetsDetails[0].asset_id || '',
        assetName: assetsDetails[0].asset_name || '',
        assetDescription: assetsDetails[0].asset_description || '',
        price: assetsDetails[0].asset_price || 0,
        xrpAddress: assetsDetails[0].xrp_address || '',
        nftoken_id: assetsDetails[0].nftoken_id || '',
        nft_url: assetsDetails[0].image_url || '',
    });
    const [status, setStatus] = useState<string>('');
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const token = useSelector((state: RootState) => state.auth.token);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'secret') {
            setSecret(value);
        } else {
            setAssetDetailss((prev) => ({ ...prev, [id]: value }));
        }
    };

    const closeModalFunc = () => {
        closeModal(false);
    };

    const handleCreateOffer = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Preparing transaction...');


        const data = {
            'asset_id': assetDetailss.assetId,
            'user_id': userId,
            'asset_name': assetDetailss.assetName,
            'asset_description': assetDetailss.assetDescription,
            'price': assetDetailss.price,
            'xrp_address': assetDetailss.xrpAddress,
            'nft_token_id': assetDetailss.nftoken_id,
            'client_secret': secret,
            'nft_url': assetDetailss.nft_url
        };

        console.log(data);
        apiService.post({
            url: 'tokens/create-offer',
            data: data,
            store: { token: token, user_id: userId },
            needAuth: true
        })
            .then((response: any) => {
                showSuccess('Transaction submitted successfully!');
            })
            .catch((error: any) => {
                console.error(error);
                setStatus(`Error: ${error.message}`);
                showError(`${error.message}`);
            });

    }


    return (
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 p-2 rounded-lg shadow-md flex justify-center items-center' onClick={closeModalFunc}>
            <div className='relative z-50 bg-gray-800 w-3/5 h-[70%] p-1 rounded-lg shadow-md' onClick={(e) => e.stopPropagation()}>
                <div className='w-full h-full p-4 text-white font-semibold'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-4xl font-normal'>Asset: {assetsDetails[0].asset_name}</h2>
                        <button onClick={closeModalFunc} className='text-2xl font-semibold text-collecty-p hover:font-bold'>X</button>
                    </div>
                    <div className='w-full h-0.5 my-3 rounded-sm bg-collecty-p'></div>
                    <div className='space-y-10 h-full w-auto flex flex-col'>
                        <div>
                            <GlobalInput
                                id='assetName'
                                placeholder='Asset Name'
                                type='text'
                                label='Asset Name'
                                value={assetDetailss.assetName}
                                disabled={false}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <GlobalInput
                                id='assetName'
                                placeholder='Asset Description'
                                type='text'
                                label='Asset Name'
                                value={assetDetailss.assetDescription}
                                disabled={false}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <GlobalInput
                                id='xrpAddress'
                                placeholder='XRP Address'
                                type='text'
                                label='XRP Address'
                                value={assetDetailss.xrpAddress}
                                disabled={false}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <GlobalInput
                                id='price'
                                placeholder='Price'
                                type='number'
                                label='Price'
                                value={assetDetailss.price}
                                disabled={false}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <GlobalInput
                                id='secret'
                                placeholder='Secret'
                                type='password'
                                label='Secret'
                                value={secret}
                                disabled={false}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex justify-center gap-4 mt-auto'>
                            <button onClick={handleCreateOffer} className='p-2 ring-1 bg-collecty-p rounded-md' type="submit">Create Offer</button>
                        </div>
                        {status && <p>{status}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUpCreateOffer;