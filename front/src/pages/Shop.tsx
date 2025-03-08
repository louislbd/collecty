import { useEffect, useState } from "react";
import { apiService } from "../service/api";
//import PaintingCard from "../datas/Painting";
import { useSelector } from "react-redux";
import { RootState } from "../service/store";
import { showError, showSuccess } from '../components/Tostify/PopUp';
import GetShopOffers from "../components/GetShopOffers";
export interface OffersDetailsProps {
    offer_id: string;
    nft_id: string;
    price: number;
    nft_url: string;
    asset_name?: string;
    asset_description?: string;
    account?: string;
    user_id?: string;
    created_at: string;
}

function GlobalShop() {
    const auth = useSelector((state: RootState) => state.auth);
    //const [paintings, setPaintings] = useState([]);
    const [allOffers, setAllOffers] = useState<OffersDetailsProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getPaintings = async () => {
        setLoading(true);
        apiService.get({
            url: 'tokens/get-all-offers',
            store: { token: auth.token, user_id: auth.user_id },
            needAuth: true
        })
            .then((response) => {
                let allOffers: OffersDetailsProps[] = Object.values(response.data).map((dataOffer: any) => ({
                    offer_id: dataOffer.offer_id,
                    nft_id: dataOffer.nft_id,
                    price: dataOffer.price,
                    nft_url: dataOffer.nft_url,
                    created_at: dataOffer.created_at,
                    account: dataOffer.account,
                    user_id: dataOffer.user_id,
                    asset_name: dataOffer.asset_name,
                    asset_description: dataOffer.asset_description,
                }));
                setAllOffers(allOffers);
                showSuccess('All offers fetched !');
                setAllOffers(response.data);
            }).catch((error) => {
                console.log(error);
                showError('An error occurred');
            }).finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        getPaintings();
        // eslint-disable-next-line
    }, [auth.user_id]);


    return (
        <div>
            <h1 className='text-3xl font-bold'>Shop</h1>
            <div className='w-full h-[2px] rounded-sm bg-[#27AE60] my-4'></div>
            <GetShopOffers offers={allOffers} isLoading={loading} />
        </div>
    );
}

export default GlobalShop;