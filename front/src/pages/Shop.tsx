import { useEffect, useState } from "react";
import { apiService } from "../service/api";
//import PaintingCard from "../datas/Painting";
import { useSelector } from "react-redux";
import { RootState } from "../service/store";
import { showError, showSuccess } from '../components/Tostify/PopUp';

export interface OffersDetailsProps {
    offerId: string;
    nftId: string;
    nftPrice: number;
    nftUrl: string;
    offerCreatedAt: string;
}

function GlobalShop() {
    const auth = useSelector((state: RootState) => state.auth);
    //const [paintings, setPaintings] = useState([]);
    const [allOffers, setAllOffers] = useState<OffersDetailsProps[]>([]);

    const getPaintings = async () => {
        apiService.get({
            url: 'tokens/get-all-offers',
            store: { token: auth.token, user_id: auth.user_id },
            needAuth: true
        })
            .then((response) => {
                console.log(response);
                showSuccess('All offers fetched !');
                setAllOffers(response.data);
            }).catch((error) => {
                console.log(error);
                showError('An error occurred');
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
            
        </div>
    );
}

export default GlobalShop;