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
        apiService.get({
            url: `tokens/cancel/${offerToRemove.offerId}`,
            store: { token: token, user_id: userId },
            needAuth: true
        })
        .then(response => {
            setOffers((prevOffers) => prevOffers.filter((offer) => offer.offerId !== offerToRemove.offerId));
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
                    <div className='ring-2 ring-collecty-p m-3 rounded-md w-72 h-auto' key={`asssets-${offer.offerId}`}>
                    <div className='w-auto h-auto'>
                        <img src={`http://localhost:8080/${offer.nftUrl}`} alt={offer.nftId} className='w-auto h-auto' />
                    </div>
                    <div className='p-2'>
                        <h1 className='font-semibold pl-2 py-3'>Name: TEST cause only the picture will shown</h1>
                    </div>
                    <button className="w-2/4 h-full rounded-md cursor-pointer ring-1 ring-collecty-p p-2" onClick={() => cancelOffer(offer)}>Cancel Offer</button>
                </div>
                )) : <p>No assets</p>
                }
            </div>
        </div>
    );
};

export default GetUserOffers;