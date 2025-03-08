import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../service/store';
import { apiService } from '../service/api';
import GlobalInput from './Inputs/GlobalInput';
import { showError, showSuccess } from './Tostify/PopUp';
import { OffersDetailsProps } from '../pages/Shop';
import { AssetDetailsProps } from './GetUserAssets';
import { useNavigate } from 'react-router-dom';

interface OffersDetailsToBuyProps {
    offerId: string;
    assetName: string;
    assetDescription: string;
    price: number;
    nft_url: string;
    nftoken_id: string;
    seller_user_id: string;
    buyer_user_id: string;
    buyer_xrpAddress: string;

}

interface PopUpAssetDetailsProps {
    offerDetails: OffersDetailsProps[];
    closeModal: (isOpen: boolean) => void;
}

const PopUpBuyNftOffer: React.FC<PopUpAssetDetailsProps> = ({
    offerDetails,
    closeModal,
}) => {

    console.log(offerDetails);
    const navigate = useNavigate();
    const [secret, setSecret] = useState<string>('');
    const [requestDoing, setRequestDoing] = useState<boolean>(false);
    const [userInputs, setUserInputs] = useState({
        xrpAddress: '',
    });
    /*const [assetDetailss, setAssetDetailss] = useState<AssetDetailsProps>({
        assetId: offerDetails[0] || '',
        assetName: offerDetails[0].asset_name || '',
        price: offerDetails[0].asset_price || 0,
        xrpAddress: offerDetails[0].xrp_address || '',
        nftoken_id: offerDetails[0].nftoken_id || '',
        nft_url: offerDetails[0].image_url || '',
    });*/
    /*const [offerDetailsToBuy, setOfferDetailsToBuy] = useState<OffersDetailsToBuyProps>({
        offerId: offerDetails[0] || '',
        assetName: offerDetails[0].asset_name || '',
        price: offerDetails[0].asset_price || 0,
        xrpAddress: offerDetails[0].xrp_address || '',
        nftoken_id: offerDetails[0].nftoken_id || '',
        nft_url: offerDetails[0].image_url || '',
    });*/
    const [isLoading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('');
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const token = useSelector((state: RootState) => state.auth.token);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'secret') {
            setSecret(value);
        } else {
            setUserInputs((prev) => ({ ...prev, [id]: value }));
        }
    };




    const closeModalFunc = () => {
        closeModal(false);
    };

    const handleBuyNFT = (e: React.FormEvent) => {
        setRequestDoing(true);
        e.preventDefault();
        setStatus('Preparing transaction...');


        const data = {
            'offer_id': offerDetails[0].offer_id,
            'buyer_user_id': userId,
            'seller_user_id': offerDetails[0].user_id,
            'buyer_xrp_address': userInputs.xrpAddress,
            'seller_xrp_address': offerDetails[0].account,
            'nft_id': offerDetails[0].nft_id,
            'client_secret': secret,
        };

        apiService.post({
            url: 'tokens/buy',
            data: data,
            store: { token: token, user_id: userId },
            needAuth: true
        })
            .then((response: any) => {
                showSuccess('Transaction submitted successfully!');
                setRequestDoing(false);
                navigate('/your-collecty-vault');
            })
            .catch((error: any) => {
                console.error(error);
                setStatus(`Error: ${error.message}`);
                showError(`${error.message}`);
                setRequestDoing(false);
            });
    }

    console.log('offerDetails', offerDetails);

    return (
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 p-2 rounded-lg shadow-md flex justify-center items-center' onClick={closeModalFunc}>
            <div className='relative z-50 bg-gray-800 w-3/5 h-[70%] p-1 rounded-lg shadow-md' onClick={(e) => e.stopPropagation()}>
                <div className='w-full h-full p-4 text-white font-semibold'>
                    {offerDetails && offerDetails.length > 0 ? (
                        <>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-4xl font-normal'>Asset: {offerDetails[0].asset_name}</h2>
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
                                        value={offerDetails[0].asset_name}
                                        disabled={true}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <GlobalInput
                                        id='assetName'
                                        placeholder='Asset Description'
                                        type='text'
                                        label='Asset Description'
                                        value={''}
                                        disabled={true}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <GlobalInput
                                        id='price'
                                        placeholder='Price'
                                        type='number'
                                        label='Price'
                                        value={offerDetails[0].price}
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
                                        value={userInputs.xrpAddress}
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
                                    { !requestDoing && <button onClick={handleBuyNFT} className='p-2 ring-1 bg-collecty-p rounded-md' type="submit">Buy NFT</button>}
                                    { requestDoing && <p>Buying NFT</p>}
                                </div>
                                {status && <p>{status}</p>}
                            </div>
                        </>
                    ) : <></>}
                </div>
            </div>
        </div>
    );
};

export default PopUpBuyNftOffer;