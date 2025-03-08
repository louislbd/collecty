import React, { useEffect, useState } from 'react';
import { apiService } from '../service/api';
import { useSelector } from 'react-redux';
import { RootState } from '../service/store';
import { showSuccess, showError } from './Tostify/PopUp';
import { OffersDetailsProps } from '../pages/Shop';

/*
export interface OffersDetailsProps {
    offerId: string;
    nftId: string;
    nftPrice: number;
    nftUrl: string;
    offerCreatedAt: string;
}
*/
const GetUserOffers: React.FC = () =>{
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const token = useSelector((state: RootState) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(true);
    const [offers, setOffers] = useState<OffersDetailsProps[]>([]);

    useEffect(() => {
            apiService.get({
                url: `tokens/${userId}`,
                store: { token: token, user_id: userId },
                needAuth: true
            })
            .then(response => {
                setLoading(false);
                console.log("LES OFFRES", response.data);
                let allOffers: OffersDetailsProps[] = Object.values(response.data).map((dataOffer: any) => ({
                    offer_id: dataOffer.offer_id,
                    nft_id: dataOffer.nft_id,
                    price: dataOffer.price,
                    nft_url: dataOffer.nft_url,
                    created_at: dataOffer.created_at,
                }));
                setOffers(allOffers);
                showSuccess('Succes getting offers');
            })
            .catch(error => {
                console.error('There was an error getting offers!', error);
                setLoading(false);
                showError('Error getting offers');
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    function cancelOffer(offerToRemove: OffersDetailsProps) {
        apiService.post({
            url: `tokens/cancel/${offerToRemove.offer_id}`,
            store: { token: token, user_id: userId },
            needAuth: true
        })
        .then(response => {
            setOffers((prevOffers) => prevOffers.filter((offer) => offer.offer_id !== offerToRemove.offer_id));
            showSuccess('Succes canceling offer');
        })
        .catch(error => {
            console.error('There was an error canceling offer !', error);
            showError('Error canceling offer');
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Offers</h1>
            <div className='w-full h-full flex flex-wrap'>
                {offers && offers.length > 0 ? offers.map((offer) => (
                    <div className='ring-2 ring-collecty-p m-3 rounded-md w-72 h-auto' key={`asssets-${offer.offer_id}`}>
                        <div className='w-auto h-auto'>
                            <img src={`http://localhost:8080/${offer.nft_url}`} alt={offer.nft_id} className='w-auto h-auto' />
                        </div>
                        <div className='p-2 text-white'>
                            <h1 className='font-semibold pl-2 py-3'>OfferId : {offer.offer_id}</h1>
                            <h1 className='font-semibold pl-2 py-3'>Prix : {offer.price}</h1>
                        </div>
                        <div>
                            <button className="w-2/4 h-full rounded-md cursor-pointer ring-1 ring-collecty-p p-2" onClick={() => cancelOffer(offer)}>Cancel Offer</button>

                        </div>
                </div>
                )) : <p>No assets</p>
                }
            </div>
        </div>
    );
};

export default GetUserOffers;